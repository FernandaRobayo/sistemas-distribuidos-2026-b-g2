package week15;

import static org.junit.jupiter.api.Assertions.*;

import com.atlassian.oai.validator.OpenApiInteractionValidator;
import com.atlassian.oai.validator.model.Request;
import com.atlassian.oai.validator.model.SimpleResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.api.model.ExposedPort;
import com.github.dockerjava.api.model.PortBinding;
import com.github.dockerjava.api.model.Ports;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.Signature;
import java.sql.Connection;
import java.sql.DriverManager;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.testcontainers.DockerClientFactory;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.startupcheck.OneShotStartupCheckStrategy;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.images.builder.Transferable;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers(disabledWithoutDocker = false)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class MultiTourSystemTest {
    static final ObjectMapper JSON = new ObjectMapper();
    static final Path SOURCES = Path.of(System.getProperty("workshop.sources"));
    static final Path EVIDENCE = Path.of("target/evidence");
    static final String BASE = "/api/v1/cash-reporting";
    static final String APP_PASSWORD = UUID.randomUUID().toString();
    static final String SECURITY_PASSWORD = UUID.randomUUID().toString();
    static final Network NETWORK = Network.newNetwork();
    @Container static final PostgreSQLContainer<?> DATABASE = new PostgreSQLContainer<>("postgres:18-alpine")
            .withDatabaseName("multitour").withUsername("postgres").withPassword(UUID.randomUUID().toString())
            .withNetwork(NETWORK).withNetworkAliases("postgres")
            .withCreateContainerCmdModifier(cmd -> cmd.getHostConfig().withPortBindings(
                    new PortBinding(Ports.Binding.bindIpAndPort("127.0.0.1", 0), new ExposedPort(5432))));
    static GenericContainer<?> cash, security, gateway;
    static KeyPair signing;
    static String edge;
    static OpenApiInteractionValidator contract;
    static int validatedResponses;
    static final HttpClient HTTP = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3)).build();

    @BeforeAll static void startPlatform() throws Exception {
        Files.createDirectories(EVIDENCE);
        assertTrue(Files.isDirectory(SOURCES.resolve("cash-reporting")), "Export the locked sources first.");
        try (var connection = DriverManager.getConnection(DATABASE.getJdbcUrl(), DATABASE.getUsername(), DATABASE.getPassword());
             var statement = connection.createStatement()) {
            statement.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE ROLE cash_reporting_app LOGIN PASSWORD '"
                    + APP_PASSWORD + "'; CREATE ROLE security_app LOGIN PASSWORD '" + SECURITY_PASSWORD + "';");
            for (var owner : List.of(SOURCES.resolve("cash-db"), SOURCES.resolve("security/db"))) {
                for (var directory : List.of("01_ddl", "03_dcl")) {
                    try (var files = Files.walk(owner.resolve(directory))) {
                        for (var file : files.filter(p -> p.toString().endsWith(".sql")).sorted().toList())
                            statement.execute(Files.readString(file));
                    }
                }
            }
        }
        var generator = KeyPairGenerator.getInstance("RSA"); generator.initialize(2048); signing = generator.generateKeyPair();
        var publicKey = pem("PUBLIC KEY", signing.getPublic().getEncoded());
        var privateKey = pem("PRIVATE KEY", signing.getPrivate().getEncoded());
        cash = new GenericContainer<>(System.getProperty("workshop.image.cash"))
                .withNetwork(NETWORK).withNetworkAliases("multi-tour-cash-reporting-api")
                .withEnv("DB_URL", "jdbc:postgresql://postgres:5432/multitour")
                .withEnv("DB_USER", "cash_reporting_app").withEnv("DB_PASSWORD", APP_PASSWORD)
                .withEnv("JWT_PUBLIC_KEY_FILE", "/run/keys/public.pem").withEnv("CASH_PERMISSION_MANAGE_CASH", "manage-cash")
                .withCopyToContainer(Transferable.of(publicKey, 0444), "/run/keys/public.pem")
                .waitingFor(Wait.forLogMessage(".*Started CashReportingApplication.*\n", 1))
                .withStartupTimeout(Duration.ofMinutes(3));
        security = new GenericContainer<>(System.getProperty("workshop.image.security"))
                .withNetwork(NETWORK).withNetworkAliases("multi-tour-security")
                .withEnv("DATABASE_URL", "postgres://security_app:" + SECURITY_PASSWORD + "@postgres:5432/multitour?sslmode=disable")
                .withEnv("JWT_PRIVATE_KEY_FILE", "/run/keys/private.pem").withEnv("JWT_PUBLIC_KEY_FILE", "/run/keys/public.pem")
                .withCopyToContainer(Transferable.of(privateKey, 0444), "/run/keys/private.pem")
                .withCopyToContainer(Transferable.of(publicKey, 0444), "/run/keys/public.pem")
                .waitingFor(Wait.forLogMessage(".*security listening.*\n", 1));
        cash.start(); security.start();
        gateway = new GenericContainer<>(System.getProperty("workshop.image.gateway"))
                .withNetwork(NETWORK).withNetworkAliases("gateway").withExposedPorts(8080)
                .withCreateContainerCmdModifier(cmd -> cmd.getHostConfig().withPortBindings(
                        new PortBinding(Ports.Binding.bindIpAndPort("127.0.0.1", 0), new ExposedPort(8080))))
                .withEnv("ALLOWED_ORIGIN", "http://localhost").waitingFor(Wait.forHttp("/health").forPort(8080));
        gateway.start(); edge = "http://" + gateway.getHost() + ":" + gateway.getMappedPort(8080);
        contract = OpenApiInteractionValidator.createForSpecificationUrl(
                SOURCES.resolve("cash-reporting/openapi/openapi.yaml").toUri().toString())
                .withBasePathOverride(BASE).build();
        report("platform", Map.of("database", DATABASE.getContainerId(), "cash", cash.getContainerId(),
                "security", security.getContainerId(), "gateway", gateway.getContainerId(),
                "cashImage", cash.getContainerInfo().getImageId(), "gatewayImage", gateway.getContainerInfo().getImageId()));
    }

    @Test @Order(1) void integrationUsesTestcontainersAndDomainIdentity() throws Exception {
        try (var connection = applicationConnection(); var statement = connection.createStatement()) {
            var user = statement.executeQuery("SELECT current_user, rolsuper FROM pg_roles WHERE rolname = current_user");
            assertTrue(user.next()); assertEquals("cash_reporting_app", user.getString(1)); assertFalse(user.getBoolean(2));
            var isolation = statement.executeQuery("SELECT has_schema_privilege(current_user, 'security', 'USAGE')");
            assertTrue(isolation.next()); assertFalse(isolation.getBoolean(1));
        }
        assertTrue(cash.getContainerInfo().getHostConfig().getPortBindings().getBindings().isEmpty());
        assertTrue(security.getContainerInfo().getHostConfig().getPortBindings().getBindings().isEmpty());
        report("integration", Map.of("status", "passed", "engine", "PostgreSQL 18 Testcontainers", "runtimeUser", "cash_reporting_app", "foreignSchemaAccess", false));
    }

    @Test @Order(2) void monetaryExpenseTransferAndClosingPersistExactly() throws Exception {
        var tenant = UUID.randomUUID().toString(); var token = token(tenant); var day = day(token);
        request("POST", day + "/open", token, "money-one-opening", "{\"openingBaseCents\":30000000}", 200);
        request("POST", day + "/movements", token, "money-one-expense", movement("OPERATIONAL_EXPENSE", "CASH", 25000000), 201);
        request("POST", day + "/movements", token, "money-one-income", movement("INCOME", "TRANSFER", 129000000), 201);
        var result = request("GET", day, token, null, null, 200);
        assertEquals(134000000, result.path("totalCents").asLong()); assertEquals(5000000, result.path("expectedCashCents").asLong());
        request("POST", day + "/close", token, "money-one-closing", null, 200);
        assertEquals("CLOSED", request("GET", day, token, null, null, 200).path("status").asText());
        assertEquals(2, count("cash_movement", tenant)); assertEquals(1, count("cash_session_closure", tenant));
        try (var connection = applicationConnection(); var query = connection.prepareStatement(
                "SELECT sum(CASE WHEN movement_type='INCOME' THEN amount_cents ELSE -amount_cents END) FROM cash_reporting.cash_movement WHERE tenant_id=?")) {
            query.setObject(1, UUID.fromString(tenant)); var rows = query.executeQuery(); assertTrue(rows.next()); assertEquals(104000000, rows.getLong(1));
        }
        report("monetary-one", Map.of("status", "passed", "totalCents", 134000000, "expectedCashCents", 5000000, "persistedMovements", 2, "closures", 1));
    }

    @Test @Order(3) void monetaryRetryAfterClosingReopeningAndTenantIsolation() throws Exception {
        var tenant = UUID.randomUUID().toString(); var token = token(tenant); var day = day(token);
        var opened = request("POST", day + "/open", token, "money-two-opening", "{\"openingBaseCents\":800000}", 200);
        var repeated = request("POST", day + "/open", token, "money-two-opening", "{\"openingBaseCents\":800000}", 200);
        assertEquals(opened, repeated);
        request("POST", day + "/movements", token, "money-two-income", movement("INCOME", "TRANSFER", 200000), 201);
        request("POST", day + "/close", token, "money-two-closing", null, 200);
        var after = request("POST", day + "/movements", token, "money-two-late-income", movement("INCOME", "TRANSFER", 300000), 201);
        assertTrue(after.path("afterClosing").asBoolean());
        var replay = request("POST", day + "/movements", token, "money-two-late-income", movement("INCOME", "TRANSFER", 300000), 200);
        assertEquals(after.path("cashMovementId"), replay.path("cashMovementId"));
        request("POST", day + "/reopen", token, "money-two-reopen", "{\"reason\":\"Reconciliation in the disposable test\"}", 200);
        var result = request("GET", day, token, null, null, 200);
        assertEquals(opened.path("cashSessionId"), result.path("cashSessionId"));
        assertEquals("OPEN", result.path("status").asText()); assertEquals(1300000, result.path("totalCents").asLong());
        assertEquals(800000, result.path("expectedCashCents").asLong());
        assertEquals(2, count("cash_movement", tenant)); assertEquals(1, count("cash_session_closure", tenant));
        var other = token(UUID.randomUUID().toString());
        var foreign = request("POST", day(other) + "/open", other, "money-two-opening", "{\"openingBaseCents\":800000}", 200);
        assertNotEquals(opened.path("cashSessionId"), foreign.path("cashSessionId"));
        var initialTime = Instant.parse(after.path("registeredAt").asText());
        var replayTime = Instant.parse(replay.path("registeredAt").asText());
        var driftNanos = Duration.between(initialTime, replayTime).abs().toNanos();
        try (var connection = applicationConnection(); var statement = connection.createStatement()) {
            var precision = statement.executeQuery("SELECT datetime_precision FROM information_schema.columns WHERE table_schema='cash_reporting' AND table_name='cash_movement' AND column_name='registered_at'");
            assertTrue(precision.next()); assertEquals(6, precision.getInt(1));
        }
        try (var connection = applicationConnection(); var query = connection.prepareStatement(
                "SELECT registered_at FROM cash_reporting.cash_movement WHERE tenant_id=? AND cash_movement_id=?")) {
            query.setObject(1, UUID.fromString(tenant)); query.setObject(2, UUID.fromString(after.path("cashMovementId").asText()));
            var stored = query.executeQuery(); assertTrue(stored.next()); assertEquals(stored.getTimestamp(1).toInstant(), replayTime);
        }
        var initialFields = after.deepCopy(); var replayFields = replay.deepCopy();
        ((com.fasterxml.jackson.databind.node.ObjectNode) initialFields).remove("registeredAt");
        ((com.fasterxml.jackson.databind.node.ObjectNode) replayFields).remove("registeredAt");
        assertEquals(initialFields, replayFields, "Every non-timestamp response field must remain identical.");
        assertTrue(driftNanos <= 1000, "Replay timestamp differs beyond the actual database microsecond precision.");
        report("monetary-two", Map.of("status", "passed", "totalCents", 1300000, "expectedCashCents", 800000,
                "noDuplicateMovement", true, "tenantIsolation", true, "closurePreserved", true,
                "replayRepresentationStable", after.equals(replay), "initialRegisteredAt", after.path("registeredAt").asText(),
                "replayRegisteredAt", replay.path("registeredAt").asText(), "timestampDriftNanos", driftNanos));
    }

    @Test @Order(4) void loadMeetsTheDeclaredCashReadSlo() throws Exception {
        var actors = new ArrayList<Map<String, String>>();
        for (int tenant = 0; tenant < 10; tenant++) {
            var id = UUID.randomUUID().toString(); var first = token(id); var day = day(first);
            var opened = request("POST", day + "/open", first, "load-opening-" + tenant, "{\"openingBaseCents\":10000}", 200);
            for (int actor = 0; actor < 2; actor++) actors.add(Map.of("token", token(id), "path", BASE + day, "session", opened.path("cashSessionId").asText()));
        }
        try (var k6 = new GenericContainer<>("grafana/k6:1.3.0")
                .withNetwork(NETWORK).withEnv("BASE_URL", "http://gateway:8080").withEnv("ACTORS_JSON", JSON.writeValueAsString(actors))
                .withCopyToContainer(Transferable.of(MultiTourSystemTest.class.getResourceAsStream("/load.js").readAllBytes()), "/test/load.js")
                .withCommand("run", "/test/load.js")
                .withStartupCheckStrategy(new OneShotStartupCheckStrategy().withTimeout(Duration.ofMinutes(3)))
                .waitingFor(Wait.forLogMessage(".*Load summary exported.*\n", 1))) {
            k6.start(); k6.copyFileFromContainer("/tmp/summary.json", EVIDENCE.resolve("k6-summary.json").toString());
        }
        var summary = JSON.readTree(EVIDENCE.resolve("k6-summary.json").toFile());
        var metrics = summary.path("metrics");
        var latency = metrics.path("http_req_duration").path("values");
        assertTrue(latency.path("max").asDouble(Double.MAX_VALUE) < 3000);
        assertTrue(metrics.path("http_reqs").path("values").path("count").asLong() >= 400);
        report("load", Map.of("status", "passed", "vus", 20, "tenants", 10, "durationSeconds", 40,
                "requests", metrics.path("http_reqs").path("values").path("count").asLong(),
                "p95Ms", latency.path("p(95)").asDouble(), "maxMs", latency.path("max").asDouble(),
                "errorRate", metrics.path("http_req_failed").path("values").path("rate").asDouble(),
                "scope", "authenticated cash-day reads; CI probe, not full Phase 1 population or monthly availability"));
    }

    @Test @Order(5) void stoppingCashDegradesGracefullyAndRecoversWithoutLostMoney() throws Exception {
        var tenant = UUID.randomUUID().toString(); var token = token(tenant); var day = day(token);
        var before = request("POST", day + "/open", token, "chaos-opening-001", "{\"openingBaseCents\":100000}", 200);
        var docker = DockerClientFactory.instance().client();
        try {
            docker.stopContainerCmd(cash.getContainerId()).withTimeout(5).exec();
            var start = System.nanoTime(); var unavailable = raw("GET", BASE + day, token, null, null);
            var latency = Duration.ofNanos(System.nanoTime() - start).toMillis();
            assertEquals(503, unavailable.statusCode()); assertTrue(latency < 3000);
            var error = JSON.readTree(unavailable.body()); assertEquals("SERVICE_UNAVAILABLE", error.path("error").asText());
            assertEquals("week15-test", error.path("traceId").asText());
            assertFalse(unavailable.body().contains("Exception")); assertFalse(unavailable.body().contains("jdbc:"));
            assertEquals(200, raw("GET", "/health", null, null, null).statusCode());
            assertEquals(401, raw("GET", "/api/v1/security/public/week15-absent", null, null, null).statusCode());
            report("chaos-degradation", Map.of("status", "passed", "fault", "stop only this suite's cash container", "httpStatus", 503,
                    "degradationMs", latency, "unaffectedSecurityStatus", 401, "gatewayHealth", 200));
        } finally {
            docker.startContainerCmd(cash.getContainerId()).exec();
        }
        long started = System.nanoTime(), deadline = System.nanoTime() + Duration.ofSeconds(90).toNanos();
        boolean recovered = false;
        while (System.nanoTime() < deadline) {
            try { if (raw("GET", BASE + day, token, null, null).statusCode() == 200) { recovered = true; break; } } catch (Exception ignored) { }
            Thread.sleep(500);
        }
        assertTrue(recovered, "Stopped service did not recover.");
        var after = request("GET", day, token, null, null, 200);
        assertEquals(before.path("cashSessionId"), after.path("cashSessionId")); assertEquals(100000, after.path("totalCents").asLong());
        report("chaos-recovery", Map.of("status", "passed", "recoveryMs", Duration.ofNanos(System.nanoTime() - started).toMillis(), "moneyPreserved", true));
    }

    static String day(String token) throws Exception { return "/cash-days/" + request("GET", "/cash-days/current", token, null, null, 200).path("businessDate").asText(); }
    static String movement(String type, String medium, long cents) throws Exception {
        return JSON.writeValueAsString(Map.of("movementType", type, "paymentMedium", medium, "concept", "Week 15 synthetic money flow", "amountCents", cents));
    }
    static JsonNode request(String method, String path, String token, String key, String body, int expected) throws Exception {
        var response = raw(method, BASE + path, token, key, body);
        assertEquals(expected, response.statusCode(), () -> method + " " + path + ": " + response.body());
        var validation = contract.validateResponse(BASE + path, Request.Method.valueOf(method), SimpleResponse.Builder.status(response.statusCode())
                .withHeader("Content-Type", response.headers().firstValue("Content-Type").orElse("application/json")).withBody(response.body()).build());
        assertFalse(validation.hasErrors(), () -> "Published response contract failed: " + validation);
        assertEquals("week15-test", response.headers().firstValue("X-Correlation-Id").orElse("")); validatedResponses++;
        return JSON.readTree(response.body());
    }
    static HttpResponse<String> raw(String method, String path, String token, String key, String body) throws Exception {
        var builder = HttpRequest.newBuilder(URI.create(edge + path)).timeout(Duration.ofSeconds(5)).header("X-Correlation-Id", "week15-test");
        if (token != null) builder.header("Authorization", "Bearer " + token);
        if (key != null) builder.header("Idempotency-Key", key);
        if (body != null) builder.header("Content-Type", "application/json");
        return HTTP.send(builder.method(method, body == null ? HttpRequest.BodyPublishers.noBody() : HttpRequest.BodyPublishers.ofString(body)).build(), HttpResponse.BodyHandlers.ofString());
    }
    static Connection applicationConnection() throws Exception { return DriverManager.getConnection(DATABASE.getJdbcUrl(), "cash_reporting_app", APP_PASSWORD); }
    static long count(String table, String tenant) throws Exception {
        assertTrue(List.of("cash_movement", "cash_session_closure").contains(table));
        try (var connection = applicationConnection(); var query = connection.prepareStatement("SELECT count(*) FROM cash_reporting." + table + " WHERE tenant_id=?")) {
            query.setObject(1, UUID.fromString(tenant)); var rows = query.executeQuery(); assertTrue(rows.next()); return rows.getLong(1);
        }
    }
    static String token(String tenant) throws Exception {
        var encoder = Base64.getUrlEncoder().withoutPadding(); var now = Instant.now().getEpochSecond();
        var header = encoder.encodeToString("{\"alg\":\"RS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));
        var claims = encoder.encodeToString(JSON.writeValueAsBytes(Map.of("sub", UUID.randomUUID().toString(), "tenantId", tenant,
                "roles", List.of("TENANT_ADMINISTRATOR"), "permissions", List.of(), "iat", now, "exp", now + 3600)));
        var input = header + "." + claims; var signer = Signature.getInstance("SHA256withRSA"); signer.initSign(signing.getPrivate());
        signer.update(input.getBytes(StandardCharsets.US_ASCII)); return input + "." + encoder.encodeToString(signer.sign());
    }
    static byte[] pem(String type, byte[] der) {
        return ("-----BEGIN " + type + "-----\n" + Base64.getMimeEncoder(64, new byte[]{'\n'}).encodeToString(der) + "\n-----END " + type + "-----\n").getBytes(StandardCharsets.US_ASCII);
    }
    static void report(String name, Map<String, ?> values) throws Exception { JSON.writerWithDefaultPrettyPrinter().writeValue(EVIDENCE.resolve(name + ".json").toFile(), values); }
    @AfterAll static void cleanup() throws Exception {
        report("response-contracts", Map.of("validatedResponses", validatedResponses));
        var containers = new LinkedHashMap<String, GenericContainer<?>>();
        containers.put("cash", cash); containers.put("security", security); containers.put("gateway", gateway);
        for (var entry : containers.entrySet()) {
            if (entry.getValue() != null) {
                var logs = entry.getValue().getLogs().replace(APP_PASSWORD, "[REDACTED]").replace(SECURITY_PASSWORD, "[REDACTED]")
                        .replaceAll("eyJ[A-Za-z0-9_-]*\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]*", "[JWT]");
                Files.writeString(EVIDENCE.resolve(entry.getKey() + ".log"), logs);
            }
        }
        if (gateway != null) gateway.stop(); if (cash != null) cash.stop(); if (security != null) security.stop();
        DATABASE.stop(); NETWORK.close();
    }
}
