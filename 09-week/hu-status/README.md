<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       09-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 09

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Reforzar la configuracion segura del MVP 2 de Multi tour con variables obligatorias y secretos fuera de Git.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| W09-SEC-01 | Configuracion segura y control del seeder para MVP 2 | doing | [Sesion 1](Sesion%201/README.md) |

## 2. My individual contribution
- Adi validacion fail-fast de datasource, JWT y credenciales del administrador de plataforma al inicio.
- Adi `APP_DEMO_SEED_ENABLED` para impedir o permitir el seeder administrativo de demostracion mediante configuracion.
- Retire la dependencia funcional de `APP_FEATURE_PUBLIC_RESERVATIONS` sobre el endpoint compartido y anadi `APP_FEATURE_HEALTH_DIAGNOSTICS` para el diagnostico tecnico auxiliar.
- Adi `.env.example`, exclusion de secretos y hook pre-commit con escaneo de secretos.

## 3. Blockers and risks
- Maven no esta instalado en el entorno de trabajo; las pruebas Java estan pendientes de ejecutarse con JDK/Maven.
- La validacion runtime de `APP_FEATURE_HEALTH_DIAGNOSTICS` queda pendiente hasta contar con Maven y una aplicacion ejecutable.

## 4. Plan for next week
- Ejecutar las pruebas backend/frontend y planificar el despliegue DEV/QA/PROD del MVP 2 en la sesion 2.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- [Sesion 1 README y guia de ejecucion](Sesion%201/README.md)
- [.env.example](Sesion%201/.env.example)
- [Compose con variables obligatorias](Sesion%201/compose.yaml)
- [Hook pre-commit](Sesion%201/.githooks/pre-commit)
