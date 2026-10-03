# Sesión 1 — Configuración segura para MVP 2

Esta entrega parte del MVP de Multi tour construido en la semana 06. El alcance se alinea con el PDR 19: plataforma multitenencia para gestionar reservas, servicios y operación de operadores turísticos.

## Entregado

- `.env.example` documenta todas las variables necesarias sin incluir credenciales reales.
- `compose.yaml` usa `${VAR:?mensaje}` para impedir que Docker arranque con valores secretos por defecto.
- Spring Boot exige al iniciar las variables de datasource, JWT y credencial administrativa. `StartupConfigurationValidator` rechaza un JWT vacío, de plantilla o menor a 32 caracteres.
- `.env`, secretos y artefactos locales están excluidos de Git.
- `scripts/scan-secrets.ps1` se ejecuta desde el hook versionado `.githooks/pre-commit`.
- `APP_FEATURE_HEALTH_DIAGNOSTICS` protege el endpoint técnico auxiliar `GET /health/diagnostics`; su valor por defecto es `false`, no expone secretos y no modifica el endpoint existente `GET /health`.
- `APP_DEMO_SEED_ENABLED` controla el seeder administrativo: `false` no crea datos demo y `true` conserva el comportamiento anterior. `APP_PLATFORM_ADMIN_PASSWORD` solo es necesario cuando la flag vale `true`.

## Uso local

```powershell
Copy-Item .env.example .env
# Editar .env y reemplazar los placeholders por valores locales
.\scripts\install-hooks.ps1
docker compose --env-file .env config
docker compose --env-file .env up --build
```

El seeder demo solo se activa explícitamente en un entorno controlado:

```text
APP_DEMO_SEED_ENABLED=true
```

Los secretos de QA/producción deben inyectarse desde el gestor de secretos o la configuración protegida del proveedor de despliegue; no deben copiarse al repositorio.

## Verificación

```powershell
.\scripts\scan-secrets.ps1
docker compose --env-file .env config
```

`docker compose config` y el escaneo se validan por separado. Maven no está incluido mediante Wrapper en esta carpeta; `mvn test` requiere Maven instalado. La feature flag de diagnósticos se valida con `false` (404) y `true` (200) cuando la aplicación está ejecutándose; la validación runtime queda pendiente si Maven no está disponible.
