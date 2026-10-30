package co.edu.corhuila.multi_tour.commercial_reservation.catalog;

import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Minimal stand-in for POST /catalog/services of commercial-reservation-api.
 * It only applies the role rule of story #581: it does NOT verify the token signature.
 */
public class MinimalCatalogServer {

    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8083"));
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", port), 0);
        server.createContext("/catalog/services", exchange -> {
            int status = statusFor(exchange.getRequestMethod(),
                    exchange.getRequestHeaders().getFirst("Authorization"));
            exchange.sendResponseHeaders(status, -1);
            exchange.close();
        });
        server.start();
        System.out.println("minimal catalog server on http://127.0.0.1:" + port);
    }

    static int statusFor(String method, String authorization) {
        if (!"POST".equals(method)) {
            return 405;
        }
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return 401;
        }
        String roles = rolesOf(authorization.substring("Bearer ".length()));
        if (roles.contains("TENANT_ADMINISTRATOR")) {
            return 201;
        }
        return 403;
    }

    private static String rolesOf(String token) {
        String[] parts = token.split("[.]");
        if (parts.length < 2) {
            return "";
        }
        return new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
    }
}
