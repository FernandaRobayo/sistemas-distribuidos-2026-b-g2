# Semana 5 - Sesión 1: Contenerización del MVP 1 con Docker

## Objetivo de la sesión

Contenerizar los servicios que conforman el MVP 1 con Docker: un `Dockerfile`
multietapa por servicio, un `.dockerignore`, un `docker-compose.yml` que levante
todos los servicios y la base de datos en la misma red, configuración por
variables de entorno, persistencia de datos vía volumen, y sin secretos dentro
de las imágenes.

## Alcance real (MVP 1 actual)

El único servicio del MVP 1 con código ejecutable hasta la fecha es
`tenant-service` (Node.js + TypeScript, arquitectura hexagonal), construido en
`04-week/hu-status/Sesión 1/tenant-service`. Esta sesión:

- Copia ese servicio (sin `node_modules`, `dist` ni `.env`) a
  `05-week/hu-status/Sesión 1/tenant-service/` para agregarle su
  contenerización sin modificar la entrega de la semana 4.
- Agrega el `Dockerfile` multietapa y el `.dockerignore` que antes no existían.
- Reemplaza el `docker-compose.yml` original (que solo levantaba Postgres) por
  uno que orquesta **servicio + base de datos** en una misma red, con variables
  de entorno y volumen persistente.

Si en próximas sesiones se agregan más servicios del MVP 1, cada uno debe
incorporarse a este mismo `docker-compose.yml` como un nuevo servicio con su
propio `Dockerfile` y `.dockerignore`, siguiendo este mismo patrón.

## Estructura de esta carpeta

```
Sesión 1/
├── README.md                      <- este archivo
├── docker-compose.yml             <- orquesta tenant-service + postgres
├── .env.example                   <- variables requeridas (sin valores reales)
├── .env                           <- valores locales para la demo (gitignored, NO se commitea)
├── .gitignore                     <- ignora .env
├── tenant-service/
│   ├── Dockerfile                 <- build multietapa (build -> production)
│   ├── .dockerignore
│   ├── src/                       <- copia del código de la Sesión 1 (semana 4)
│   ├── package.json / package-lock.json / tsconfig.json
│   ├── .gitignore
│   └── .env.example
└── Evidencias/
    ├── 01-docker-compose-up-build.txt
    ├── 02-docker-compose-logs.txt
    ├── 03-docker-compose-ps.txt
    ├── 04-http-health-and-create-tenant.txt
    ├── 05-volume-persistence-after-restart.txt
    └── 06-no-secrets-network-volume.txt
```

## Cómo ejecutarlo

```bash
cd "05-week/hu-status/Sesión 1"
cp .env.example .env   # completar con valores propios si se desea
docker compose up --build
```

Esto construye la imagen de `tenant-service` (Dockerfile multietapa) y levanta
`postgres:16-alpine`, ambos en la red `mvp1-network`, con Postgres persistiendo
sus datos en el volumen `tenant-service-postgres-data`.

Endpoints expuestos por `tenant-service` (puerto `3001` por defecto):

- `GET /health`
- `POST /tenants` (`{ "name": string, "status"?: "ACTIVE" | "INACTIVE" }`)
- `GET /tenants/:id`

## Requisitos solicitados y cómo se cumplen

| Requisito | Cómo se cumple | Evidencia |
|---|---|---|
| Dockerfile multietapa por servicio | `tenant-service/Dockerfile`: etapa `build` (compila TS con devDependencies) y etapa `production` (solo `dist/` + dependencias de producción, usuario no root) | `Evidencias/01-docker-compose-up-build.txt` |
| `.dockerignore` | `tenant-service/.dockerignore` excluye `node_modules`, `dist`, `.env*`, `.git`, etc. | build exitoso sin arrastrar esos archivos |
| `docker-compose.yml` | En la raíz de esta carpeta, define `postgres` y `tenant-service` | `docker-compose.yml` |
| Todos los servicios + BD en la misma red | Ambos servicios declaran `networks: [mvp1-network]` | `Evidencias/06-no-secrets-network-volume.txt` (IPs de ambos contenedores en `sesin1_mvp1-network`) |
| Configuración por variables de entorno | `docker-compose.yml` usa `${POSTGRES_DB}`, `${POSTGRES_USER}`, `${POSTGRES_PASSWORD}`, `${POSTGRES_PORT}`, `${TENANT_SERVICE_PORT}`, tomadas de `.env` (no committeado) | `.env.example`, `Evidencias/06-no-secrets-network-volume.txt` (`docker compose config`) |
| Datos persistentes vía volumen | Volumen nombrado `tenant-service-postgres-data` montado en `/var/lib/postgresql/data` | `Evidencias/05-volume-persistence-after-restart.txt` (el tenant creado sigue existiendo tras `down` + `up`) |
| Sin secretos dentro de las imágenes | El `Dockerfile` nunca copia `.env`; las credenciales solo llegan en tiempo de ejecución vía `environment:` de compose | `Evidencias/06-no-secrets-network-volume.txt` (no existe `.env` dentro de la imagen y la contraseña no aparece en el `.tar` exportado de la imagen) |
| `docker compose up --build` funciona | Corrida real documentada de punta a punta | `Evidencias/01-docker-compose-up-build.txt`, `02-docker-compose-logs.txt`, `03-docker-compose-ps.txt` |

## Evidencia generada (ejecución real, no simulada)

Todas las evidencias en `Evidencias/` provienen de una ejecución real de
`docker compose` en este entorno (Docker Desktop, verificado con `docker
info`), no de una transcripción hipotética:

1. **`01-docker-compose-up-build.txt`** — salida completa de
   `docker compose up --build -d`: build multietapa de `tenant-service`,
   creación de la red `mvp1-network`, arranque de `postgres` (health check en
   verde) y luego de `tenant-service`.
2. **`02-docker-compose-logs.txt`** — logs combinados de ambos contenedores
   (`tenant-service running on http://localhost:3001`, Postgres listo para
   aceptar conexiones).
3. **`03-docker-compose-ps.txt`** — `docker compose ps`: ambos servicios
   `Up`/`healthy`, con sus puertos publicados.
4. **`04-http-health-and-create-tenant.txt`** — `GET /health` (200 OK) y
   `POST /tenants` (201 Created) contra el servicio ya contenerizado.
5. **`05-volume-persistence-after-restart.txt`** — el mismo tenant creado
   (`GET /tenants/:id`) sigue existiendo después de `docker compose down`
   (elimina contenedores y red) y `docker compose up -d` nuevamente: la única
   razón por la que el dato sobrevive es el volumen nombrado.
6. **`06-no-secrets-network-volume.txt`** — (a) listado de archivos dentro de
   la imagen construida: no hay `.env` ni código fuente `.ts`, solo `dist/` y
   `node_modules` de producción; (b) búsqueda binaria de la contraseña de
   ejemplo dentro del `.tar` exportado de la imagen: 0 coincidencias; (c)
   `docker compose config` resuelto, mostrando que los valores vienen de
   variables de entorno; (d) `docker network inspect` con ambos contenedores
   en la misma red; (e) `docker volume ls` mostrando el volumen persistente.

## Qué quedó completo y qué falta

**Completo:**
- Dockerfile multietapa, `.dockerignore`, `docker-compose.yml` funcionando de
  punta a punta para el único servicio real del MVP 1 (`tenant-service`) más
  su base de datos, en una misma red, con variables de entorno, volumen
  persistente y sin secretos en la imagen.

**Falta / brechas:**
- El MVP 1 hoy solo tiene un servicio implementado (`tenant-service`); si se
  suman más servicios en sesiones futuras, deben añadirse a este mismo
  `docker-compose.yml` siguiendo el mismo patrón (cada uno con su propio
  `Dockerfile` y `.dockerignore`).
- No hay un registry/CI configurado para publicar la imagen; el build es
  únicamente local (`docker compose up --build`), que es lo pedido para esta
  sesión.
