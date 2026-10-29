package co.edu.corhuila.multi_tour.commercial_reservation.catalog;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import java.util.UUID;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

/**
 * Story #581, criterion 1: a token of OPERATIONAL_COLLABORATOR cannot register a catalog item.
 * It runs against a live commercial-reservation-api and is skipped when BASE_URL is not set.
 */
class CatalogRolesAuthzTest {

    private static final String BASE_URL = System.getenv("BASE_URL");
    private static final String COLLABORATOR_TOKEN = System.getenv("COLLABORATOR_TOKEN");

    @BeforeAll
    static void requireRunningService() {
        assumeTrue(BASE_URL != null && COLLABORATOR_TOKEN != null,
                "BASE_URL and COLLABORATOR_TOKEN are required");
    }

    @Test
    void collaboratorCannotRegisterCatalogService() {
        given()
                .baseUri(BASE_URL)
                .header("Authorization", "Bearer " + COLLABORATOR_TOKEN)
                .header("Idempotency-Key", UUID.randomUUID().toString())
                .contentType("application/json")
                .body("{\"commercialName\":\"Authz probe\"}")
        .when()
                .post("/catalog/services")
        .then()
                .statusCode(403);
    }
}
