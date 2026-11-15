package co.edu.corhuila.multi_tour.commercial_reservation.catalog;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static co.edu.corhuila.multi_tour.commercial_reservation.catalog.CatalogRolesAuthzTest.fixtureToken;

import org.junit.jupiter.api.Test;

class MinimalCatalogServerTest {
    private int post(String payload) {
        return MinimalCatalogServer.statusFor("POST", "Bearer " + fixtureToken(payload));
    }

    @Test
    void administratorCanCreate() {
        assertEquals(201, post("{\"roles\":[\"TENANT_ADMINISTRATOR\"]}"));
    }

    @Test
    void roleNamesInOtherClaimsDoNotGrantAccess() {
        assertEquals(403, post("{\"roles\":[\"OPERATIONAL_COLLABORATOR\"],\"name\":\"TENANT_ADMINISTRATOR\"}"));
        assertEquals(403, post("{\"roles\":[\"NOT_TENANT_ADMINISTRATOR\"]}"));
        assertEquals(403, post("{\"roles\":\"TENANT_ADMINISTRATOR\"}"));
        assertEquals(403, post("{}"));
    }

    @Test
    void malformedCredentialsReturn401() {
        assertEquals(401, MinimalCatalogServer.statusFor("POST", null));
        assertEquals(401, MinimalCatalogServer.statusFor("POST", "Bearer a.%.b"));
        assertEquals(401, MinimalCatalogServer.statusFor("POST", "Bearer missing-parts"));
        assertEquals(401, post("not-json"));
    }

    @Test
    void unsupportedMethodReturns405() {
        assertEquals(405, MinimalCatalogServer.statusFor("GET", null));
    }
}
