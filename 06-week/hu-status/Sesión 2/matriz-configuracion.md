# Matriz de configuración de MVP 2

## Variables de entrada

Estos valores definen el Compose objetivo; las variables nuevas deben conectarse
al YAML o a la aplicación mediante las historias del backlog. No son tres perfiles
ya desplegados. DEV es la plantilla `.env.example`.

| Variable | DEV | QA | PROD | Consumidor / tratamiento |
| --- | --- | --- | --- | --- |
| `COMPOSE_PROJECT_NAME` | `multitour-mvp2-dev` | `multitour-mvp2-qa` | `multitour-mvp2-prod` | Compose; sustituir el nombre fijo de Sesión 1 |
| `FRONTEND_BIND_ADDRESS` | `127.0.0.1` | `127.0.0.1` | `127.0.0.1` | Compose, dirección de publicación; nueva variable |
| `FRONTEND_PORT` | `8087` | `8088` | `8089` | Compose, puerto del host; evita el 8086 de Sesión 1 |
| `POSTGRES_DB` | `multitour_dev` | `multitour_qa` | `multitour_prod` | PostgreSQL y URL JDBC |
| `POSTGRES_USER` | `multitour_dev` | `multitour_qa` | `multitour_prod` | PostgreSQL y backend |
| `POSTGRES_PASSWORD` | Secreto `dev/postgres-password` | Secreto `qa/postgres-password` | Secreto `prod/postgres-password` | Valor privado, distinto por entorno; campo vacío en ejemplos |
| `APP_JWT_SECRET` | Secreto `dev/jwt-secret` | Secreto `qa/jwt-secret` | Secreto `prod/jwt-secret` | Valor privado e independiente; campo vacío en ejemplos |
| `API_UPSTREAM` | `backend:8080` | `backend:8080` | `backend:8080` | Plantilla Nginx; DNS interno de cada red |
| `SPRING_DATASOURCE_HIKARI_CONNECTION_TIMEOUT` | `2000` | `2000` | `2000` | Backend, milisegundos; conectar al Compose |
| `APP_DEMO_SEED_ENABLED` | `true` | `false` | `false` | **Nueva**, implementar interruptor del seeder en ORQ-002 |

Las rutas `dev/...`, `qa/...` y `prod/...` son identificadores lógicos para custodiar
secretos; **no son contraseñas ni un gestor de secretos ya contratado**. No se
versionan los valores efectivos. Un secreto JWT debe aportar al menos 32 bytes
aleatorios para HS256; no se reutilizan los valores de la demo de Sesión 1.

## Variables del contenedor derivadas

El Compose objetivo construirá estas variables a partir de las entradas anteriores,
para evitar mantener dos credenciales divergentes en un mismo entorno.

| Variable / propiedad | DEV | QA | PROD |
| --- | --- | --- | --- |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://postgres:5432/multitour_dev` | `jdbc:postgresql://postgres:5432/multitour_qa` | `jdbc:postgresql://postgres:5432/multitour_prod` |
| `SPRING_DATASOURCE_USERNAME` | `multitour_dev` | `multitour_qa` | `multitour_prod` |
| `SPRING_DATASOURCE_PASSWORD` | Valor privado de `POSTGRES_PASSWORD` DEV | Valor privado de `POSTGRES_PASSWORD` QA | Valor privado de `POSTGRES_PASSWORD` PROD |
| Red, con clave YAML `multitour` | `multitour-mvp2-dev_multitour` | `multitour-mvp2-qa_multitour` | `multitour-mvp2-prod_multitour` |
| Volumen, con clave YAML `postgres-data` | `multitour-mvp2-dev_postgres-data` | `multitour-mvp2-qa_postgres-data` | `multitour-mvp2-prod_postgres-data` |
| Acceso local del host | `http://127.0.0.1:8087` | `http://127.0.0.1:8088` | `http://127.0.0.1:8089` |

Puertos internos constantes: frontend 80, backend 8080, PostgreSQL 5432. Solo se
publica el frontend. PROD tendrá un punto de entrada TLS en el host delante del
puerto 8089; esa dirección local no se presenta como una URL pública de producción.

## Reglas de secretos y cambios

1. Versionar únicamente `.env.example`, `.env.qa.example` y `.env.prod.example`;
   los campos secretos permanecen vacíos. Nunca adjuntar `.env.dev`, `.env.qa`,
   `.env.prod`, volcados de BD ni resultados completos de `docker compose config`
   que muestren credenciales.
2. El Compose objetivo exigirá `${POSTGRES_PASSWORD:?Falta POSTGRES_PASSWORD}` y
   `${APP_JWT_SECRET:?Falta APP_JWT_SECRET}`, sin valores públicos alternativos.
   La validación usará `docker compose ... config --quiet`, sin imprimir secretos.
3. Los `.dockerignore` excluirán `.env*`. Las credenciales se inyectarán al arrancar,
   nunca mediante `ARG`, `COPY` ni valores incrustados en las imágenes. Revisar también
   los valores de ejemplo existentes en `application.properties` y el seeder.
4. Los secretos de QA y PROD se custodiarán en el almacén del ejecutor de despliegue;
   el proveedor y los permisos concretos se implementan en ORQ-006. DEV puede usar
   un archivo local ignorado y con acceso limitado al usuario del desarrollador.
5. Rotar contraseñas de una BD existente requiere cambiar el usuario en PostgreSQL
   y la credencial del backend de forma coordinada; editar `.env` por sí solo no
   modifica un volumen inicializado. Rotar JWT invalida los tokens anteriores.
6. No copiar datos reales de PROD a DEV o QA. Las pruebas de estos entornos usan
   datos sintéticos. No ejecutar `down -v` en PROD.
