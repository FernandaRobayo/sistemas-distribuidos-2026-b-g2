package co.edu.corhuila.multi_tour.commercial_reservation.catalog;

import com.sun.net.httpserver.HttpServer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.Base64;

/**
 * Minimal stand-in for POST /catalog/services of commercial-reservation-api.
 * It only applies the role rule of story #581: it does NOT verify the token signature.
 */
public class MinimalCatalogServer {

    private static final ObjectMapper JSON = new ObjectMapper()
            .enable(DeserializationFeature.FAIL_ON_TRAILING_TOKENS);

    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8083"));
        start(port);
        System.out.println("minimal catalog server on http://127.0.0.1:" + port);
    }

    public static HttpServer start(int port) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", port), 0);
        server.createContext("/catalog/services", exchange -> {
            int status = !"/catalog/services".equals(exchange.getRequestURI().getPath()) ? 404
                    : statusFor(exchange.getRequestMethod(),
                    exchange.getRequestHeaders().getFirst("Authorization"));
            exchange.sendResponseHeaders(status, -1);
            exchange.close();
        });
        server.start();
        return server;
    }

    static int statusFor(String method, String authorization) {
        if (!"POST".equals(method)) {
            return 405;
        }
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return 401;
        }
        try {
            String[] parts = authorization.substring("Bearer ".length()).split("[.]", -1);
            if (parts.length != 3) {
                return 401;
            }
            JsonNode payload = JSON.readTree(Base64.getUrlDecoder().decode(parts[1]));
            if (payload == null || !payload.isObject()) {
                return 401;
            }
            JsonNode roles = payload.path("roles");
            if (roles.isArray()) {
                for (JsonNode role : roles) {
                    if (role.isTextual() && "TENANT_ADMINISTRATOR".equals(role.textValue())) {
                        return 201;
                    }
                }
            }
            return 403;
        } catch (IOException | IllegalArgumentException invalidToken) {
            return 401;
        }
    }
}
