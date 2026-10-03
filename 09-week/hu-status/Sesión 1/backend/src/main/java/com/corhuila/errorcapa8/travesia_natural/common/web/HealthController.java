package com.corhuila.errorcapa8.travesia_natural.common.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataAccessException;

@RestController
public class HealthController {
    private final JdbcTemplate jdbc;
    private final boolean healthDiagnosticsEnabled;

    public HealthController(JdbcTemplate jdbc,
                            @Value("${app.feature.health-diagnostics:false}") boolean healthDiagnosticsEnabled) {
        this.jdbc = jdbc;
        this.healthDiagnosticsEnabled = healthDiagnosticsEnabled;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        try {
            jdbc.queryForObject("SELECT 1", Integer.class);
            return ResponseEntity.ok(Map.of("status", "UP", "database", "UP"));
        } catch (DataAccessException exception) {
            return ResponseEntity.status(503).body(Map.of("status", "DOWN", "database", "DOWN"));
        }
    }

    @GetMapping("/health/diagnostics")
    public ResponseEntity<Map<String, String>> diagnostics() {
        if (!healthDiagnosticsEnabled) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("status", "UP", "diagnostics", "ENABLED"));
    }
}
