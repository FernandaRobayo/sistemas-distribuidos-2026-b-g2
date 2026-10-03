package com.corhuila.errorcapa8.travesia_natural.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** Rejects unsafe configuration before the application starts accepting requests. */
@Component
public class StartupConfigurationValidator {
    private final String jwtSecret;
    private final String platformAdminPassword;
    private final boolean demoSeedEnabled;

    public StartupConfigurationValidator(@Value("${app.jwt.secret}") String jwtSecret,
                                         @Value("${app.platform-admin.password:}") String platformAdminPassword,
                                         @Value("${app.demo-seed.enabled:false}") boolean demoSeedEnabled) {
        this.jwtSecret = jwtSecret;
        this.platformAdminPassword = platformAdminPassword;
        this.demoSeedEnabled = demoSeedEnabled;
    }

    @jakarta.annotation.PostConstruct
    void validate() {
        if (jwtSecret.isBlank() || jwtSecret.length() < 32 || jwtSecret.startsWith("<")) {
            throw new IllegalStateException(
                    "APP_JWT_SECRET is required and must contain at least 32 secret characters");
        }
        if (demoSeedEnabled && (platformAdminPassword.isBlank() || platformAdminPassword.startsWith("<"))) {
            throw new IllegalStateException("APP_PLATFORM_ADMIN_PASSWORD is required");
        }
    }
}
