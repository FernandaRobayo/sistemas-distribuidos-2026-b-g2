package co.edu.corhuila.multi_tour.commercial_reservation.app;

import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

/** Real product HTTP adapters and use cases, with the product's in-memory catalog test ports. */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = {"server.address=0.0.0.0", "logging.level.root=WARN"})
@ContextConfiguration(initializers = TestDatabaseProperties.class)
@Import(CatalogHttpFixture.class)
class Session1LiveServerTest {
    @LocalServerPort int port;

    @DynamicPropertySource
    static void key(DynamicPropertyRegistry properties) {
        properties.add("JWT_PUBLIC_KEY_FILE", () -> System.getenv("JWT_PUBLIC_KEY_FILE"));
        properties.add("JWT_PUBLIC_KEY", () -> "");
    }

    @Test void serveRealCatalogUntilTheIntegrationFinishes() throws Exception {
        Path root = Path.of(System.getenv("SESSION1_DIR"));
        Files.writeString(root.resolve("java-ready"), Integer.toString(port));
        long deadline = System.nanoTime() + java.time.Duration.ofMinutes(12).toNanos();
        while (!Files.exists(root.resolve("java-stop"))) {
            if (System.nanoTime() > deadline) throw new AssertionError("Integration coordinator timed out");
            Thread.sleep(250);
        }
    }
}
