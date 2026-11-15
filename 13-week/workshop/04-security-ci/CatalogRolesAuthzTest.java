package co.edu.corhuila.multi_tour.commercial_reservation.catalog;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.sun.net.httpserver.HttpServer;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

/**
 * Story #581, criterion 1: a token of OPERATIONAL_COLLABORATOR cannot register a catalog item.
 * Defaults to the local fixture. Explicit external configuration must be complete.
 */
class CatalogRolesAuthzTest {

    private static String baseUrl;
    private static String collaboratorToken;
    private static HttpServer fixture;

    @BeforeAll
    static void requireRunningService() throws Exception {
        baseUrl = System.getenv("BASE_URL");
        collaboratorToken = System.getenv("COLLABORATOR_TOKEN");
        if (baseUrl == null && collaboratorToken == null) {
            fixture = MinimalCatalogServer.start(0);
            baseUrl = "http://127.0.0.1:" + fixture.getAddress().getPort();
            collaboratorToken = fixtureToken("{\"roles\":[\"OPERATIONAL_COLLABORATOR\"]}");
        } else {
            assertTrue(baseUrl != null && !baseUrl.isBlank()
                            && collaboratorToken != null && !collaboratorToken.isBlank(),
                    "External mode requires nonblank BASE_URL and COLLABORATOR_TOKEN");
        }
    }

    static String fixtureToken(String payload) {
        return "eyJhbGciOiJub25lIn0." + Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8)) + ".fixture";
    }

    @AfterAll
    static void stopFixture() {
        if (fixture != null) {
            fixture.stop(0);
        }
    }

    @Test
    void collaboratorCannotRegisterCatalogService() {
        given()
                .baseUri(baseUrl)
                .header("Authorization", "Bearer " + collaboratorToken)
                .header("Idempotency-Key", UUID.randomUUID().toString())
                .contentType("application/json")
                .body("{\"commercialName\":\"Authz probe\"}")
        .when()
                .post("/catalog/services")
        .then()
                .statusCode(403);
    }
}
