package week15;

import static org.junit.jupiter.api.Assertions.*;

import com.github.dockerjava.api.command.WaitContainerResultCallback;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.testcontainers.DockerClientFactory;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.images.builder.Transferable;

class Mvp3ReleaseTest extends MultiTourSystemTest {
    @Test @Order(6) void rollbackRestoresTheBackupAndKnownImage() throws Exception {
        var tenant = UUID.randomUUID().toString();
        var token = token(tenant);
        var day = day(token);
        var before = request("POST", day + "/open", token, "rollback-opening", "{\"openingBaseCents\":100000}", 200);
        var knownImage = cash.getContainerInfo().getImageId();
        var dump = DATABASE.execInContainer("pg_dump", "-U", "postgres", "-d", "multitour", "-Fc", "-f", "/tmp/rollback.dump");
        assertEquals(0, dump.getExitCode(), dump.getStderr());
        request("POST", day + "/movements", token, "rollback-after-backup", movement("INCOME", "TRANSFER", 50000), 201);
        assertEquals(150000, request("GET", day, token, null, null, 200).path("totalCents").asLong());
        var docker = DockerClientFactory.instance().client();
        cash.stop(); docker.stopContainerCmd(security.getContainerId()).withTimeout(5).exec();
        var started = System.nanoTime();
        var candidate = docker.createContainerCmd(System.getProperty("workshop.image.cash"))
                .withLabels(Map.of("week15.fixture", "rollback-startup-failure"))
                .withEntrypoint("/bin/sh").withCmd("-c", "exit 42").exec().getId();
        try {
            docker.startContainerCmd(candidate).exec();
            try (var wait = new WaitContainerResultCallback()) {
                assertEquals(42, docker.waitContainerCmd(candidate).exec(wait).awaitStatusCode(30, TimeUnit.SECONDS));
            }
            var restored = DATABASE.execInContainer("pg_restore", "--clean", "--if-exists", "--no-owner", "-U", "postgres", "-d", "multitour", "/tmp/rollback.dump");
            assertEquals(0, restored.getExitCode(), restored.getStderr());
            cash = new GenericContainer<>(System.getProperty("workshop.image.cash"))
                    .withNetwork(NETWORK).withNetworkAliases("multi-tour-cash-reporting-api")
                    .withEnv("DB_URL", "jdbc:postgresql://postgres:5432/multitour")
                    .withEnv("DB_USER", "cash_reporting_app").withEnv("DB_PASSWORD", APP_PASSWORD)
                    .withEnv("JWT_PUBLIC_KEY_FILE", "/run/keys/public.pem").withEnv("CASH_PERMISSION_MANAGE_CASH", "manage-cash")
                    .withCopyToContainer(Transferable.of(pem("PUBLIC KEY", signing.getPublic().getEncoded()), 0444), "/run/keys/public.pem")
                    .waitingFor(Wait.forLogMessage(".*Started CashReportingApplication.*\n", 1)).withStartupTimeout(Duration.ofMinutes(3));
            cash.start();
            assertEquals(knownImage, cash.getContainerInfo().getImageId());
            awaitCash(day, token);
            var after = request("GET", day, token, null, null, 200);
            assertEquals(before.path("cashSessionId"), after.path("cashSessionId"));
            assertEquals(100000, after.path("totalCents").asLong());
            assertEquals(0, count("cash_movement", tenant));
            report("rollback", Map.of("status", "passed", "backupRestored", true, "candidateExitCode", 42,
                    "knownImageId", knownImage, "restoredCents", 100000, "postBackupCentsRemoved", 50000,
                    "recoveryMs", Duration.ofNanos(System.nanoTime() - started).toMillis(),
                    "scope", "disposable PostgreSQL fixture recovery point and known-image redeployment after injected startup failure"));
        } finally {
            docker.removeContainerCmd(candidate).withForce(true).exec();
            docker.startContainerCmd(security.getContainerId()).exec();
        }
    }

    @Test @Order(7) void demonstrateFailureAndRecoveryWhileUnderLoad() throws Exception {
        var tenant = UUID.randomUUID().toString();
        var token = token(tenant);
        var day = day(token);
        var before = request("POST", day + "/open", token, "stress-opening", "{\"openingBaseCents\":100000}", 200);
        var docker = DockerClientFactory.instance().client();
        try (var load = new GenericContainer<>("grafana/k6:1.3.0")
                .withNetwork(NETWORK).withEnv("BASE_URL", "http://gateway:8080")
                .withEnv("CASH_PATH", BASE + day).withEnv("CASH_TOKEN", token)
                .withEnv("SESSION_ID", before.path("cashSessionId").asText())
                .withCopyToContainer(Transferable.of(Mvp3ReleaseTest.class.getResourceAsStream("/stress-failure.js").readAllBytes()), "/test/stress-failure.js")
                .withCommand("run", "/test/stress-failure.js")
                .waitingFor(Wait.forLogMessage(".*STRESS_READY.*\n", 1))) {
            load.start();
            Thread.sleep(5000);
            try {
                docker.stopContainerCmd(cash.getContainerId()).withTimeout(5).exec();
                assertEquals(503, raw("GET", BASE + day, token, null, null).statusCode());
                assertEquals(200, raw("GET", "/health", null, null, null).statusCode());
                assertEquals(401, raw("GET", "/api/v1/security/public/week15-absent", null, null, null).statusCode());
                Thread.sleep(5000);
            } finally {
                docker.startContainerCmd(cash.getContainerId()).exec();
            }
            awaitCash(day, token);
            try (var wait = new WaitContainerResultCallback()) {
                assertEquals(0, docker.waitContainerCmd(load.getContainerId()).exec(wait).awaitStatusCode(75, TimeUnit.SECONDS));
            }
            load.copyFileFromContainer("/tmp/stress-summary.json", EVIDENCE.resolve("stress-summary.json").toString());
            var metrics = JSON.readTree(EVIDENCE.resolve("stress-summary.json").toFile()).path("metrics");
            assertTrue(metrics.path("cash_healthy").path("values").path("count").asLong() >= 100);
            assertTrue(metrics.path("cash_degraded").path("values").path("count").asLong() > 0);
            assertEquals(1.0, metrics.path("checks").path("values").path("rate").asDouble());
            var after = request("GET", day, token, null, null, 200);
            assertEquals(before.path("cashSessionId"), after.path("cashSessionId"));
            assertEquals(100000, after.path("totalCents").asLong());
            report("stress-failure", Map.of("status", "passed", "vus", 20, "durationSeconds", 40,
                    "healthyCashResponses", metrics.path("cash_healthy").path("values").path("count").asLong(),
                    "expected503Responses", metrics.path("cash_degraded").path("values").path("count").asLong(),
                    "checkRate", 1.0, "moneyPreserved", true));
        }
    }

    static void awaitCash(String day, String token) throws Exception {
        long deadline = System.nanoTime() + Duration.ofSeconds(90).toNanos();
        while (System.nanoTime() < deadline) {
            try { if (raw("GET", BASE + day, token, null, null).statusCode() == 200) return; }
            catch (java.io.IOException ignored) { }
            Thread.sleep(500);
        }
        fail("Cash did not become ready within 90 seconds.");
    }
}
