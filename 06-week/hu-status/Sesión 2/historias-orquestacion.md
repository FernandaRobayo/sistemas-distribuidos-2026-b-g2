# Backlog de orquestación para MVP 2

Meta: convertir el arranque local de Sesión 1 en un despliegue configurable,
aislado y verificable para DEV, QA y PROD. Esta es la parte de orquestación de
MVP 2; no sustituye el backlog funcional de reservas, pagos y catálogo.

## División del trabajo

| Historia | Entregable | Prioridad | Dependencias | Rol ejecutor sugerido | Estado |
| --- | --- | --- | --- | --- | --- |
| HU-MVP2-ORQ-001 | Compose con tres entornos aislados | Must | — | Integración / infraestructura | Todo |
| HU-MVP2-ORQ-002 | Configuración obligatoria y secretos externos | Must | 001 | Backend + infraestructura | Todo |
| HU-MVP2-ORQ-003 | Inicio condicionado por salud | Must | 001, 002 | Backend + infraestructura | Todo |
| HU-MVP2-ORQ-004 | Prueba integrada del acceso frontend–API–BD | Must | 003 | Frontend + calidad | Todo |
| HU-MVP2-ORQ-005 | Persistencia, respaldo y restauración | Must | 002, 004 | Backend + infraestructura | Todo |
| HU-MVP2-ORQ-006 | Promoción trazable DEV → QA → PROD | Must | 001–005 | Integración + calidad | Todo |

Los roles no constituyen asignaciones personales acordadas. Se implementará en ese
orden, cerrando cada HU con su evidencia. El trabajo existente de Sesión 1 se
reutiliza, pero no demuestra todavía los tres entornos del contrato de esta sesión.

## HU-MVP2-ORQ-001 — Entornos aislados

Como desarrollador quiero iniciar el sistema con la configuración de cada entorno
para trabajar sin compartir datos ni interferir con los otros despliegues.

Tareas: parametrizar el nombre de proyecto y la dirección/puerto del frontend;
conservar una red y un volumen por proyecto; incorporar un Compose de MVP 2 que
consuma la matriz; documentar el comando de cada entorno.

Criterios de aceptación:

- AC1: dados los archivos locales completos, `docker compose --env-file .env.dev up
  -d --wait --wait-timeout 240` inicia los tres servicios desde el directorio del
  Compose MVP 2; el mismo comando funciona con `.env.qa` y `.env.prod`. La primera
  ejecución construye o descarga las imágenes sin arranques manuales separados.
- AC2: los tres proyectos pueden coexistir en un host de validación y publicar
  respectivamente 8087, 8088 y 8089; `docker compose ps` muestra tres servicios
  saludables por proyecto.
- AC3: `docker network inspect` y `docker volume inspect` muestran exactamente los
  nombres de la matriz; ninguna red contiene servicios de otro entorno y ningún
  volumen de BD está montado por dos entornos.
- AC4: al detener solo DEV, QA y PROD siguen respondiendo HTTP 200 en `/health`.

Evidencia: comandos, códigos de salida, estados y listados de red/volumen sin secretos.

## HU-MVP2-ORQ-002 — Configuración y secretos

Como responsable del despliegue quiero inyectar secretos propios de cada entorno
para evitar credenciales de demostración y filtraciones en Git o imágenes.

Tareas: conectar todas las entradas de la matriz; exigir los secretos sin defaults;
retirar valores incrustados de configuración de runtime; implementar
`APP_DEMO_SEED_ENABLED` y un procedimiento privado de alta del administrador inicial.

Criterios de aceptación:

- AC1: con cualquiera de los dos secretos vacío o ausente, `docker compose ...
  config --quiet` falla con salida distinta de cero y nombra la variable faltante,
  sin mostrar valores. Con ambos presentes, la validación termina con cero.
- AC2: los tres ejemplos contienen las mismas claves y los valores no sensibles
  de la matriz. `POSTGRES_PASSWORD` y `APP_JWT_SECRET` permanecen vacíos; `git
  check-ignore` confirma que los archivos efectivos de cada entorno se ignoran.
- AC3: un escaneo de los cambios y del contenido de las imágenes no encuentra los
  secretos de prueba ni archivos `.env`; se registra solo resultado y conteo, no
  los secretos buscados. La configuración efectiva usa credenciales diferentes
  para cada entorno, comprobadas mediante conexión autorizada.
- AC4: sobre una BD nueva de QA y PROD, `APP_DEMO_SEED_ENABLED=false` evita crear
  cuentas con credenciales públicas de demo. El administrador inicial se provisiona
  por el procedimiento privado y logra autenticarse. En DEV, `true` habilita datos
  sintéticos de demo. Esta variable aún no está implementada en Sesión 1.

Evidencia: validación positiva y negativa, revisión de Git e imágenes y prueba del seeder.

## HU-MVP2-ORQ-003 — Arranque y salud

Como operador quiero que cada servicio espere a sus dependencias listas para evitar
arranques aparentemente correctos con la base de datos inaccesible.

Tareas: conservar `pg_isready`, `/health` con consulta SQL y comprobación por Nginx;
conectar `depends_on: condition: service_healthy`; ajustar tiempos de inicio.

Criterios de aceptación:

- AC1: en un arranque sin contenedores previos, las marcas de tiempo de eventos y
  healthchecks prueban PostgreSQL saludable antes de iniciar backend y backend
  saludable antes de iniciar frontend.
- AC2: forzando el healthcheck de PostgreSQL a fallar en un proyecto de prueba,
  `up --wait --wait-timeout 240` falla y el backend no inicia; se elimina esa
  alteración antes de continuar. No se realiza esta prueba destructiva en PROD real.
- AC3: con el sistema sano, `/health` devuelve 200 y `status=UP`, `database=UP`.
  Al detener la BD en QA, devuelve 503 en un máximo de 10 segundos; al restaurarla,
  vuelve a 200 y a estado saludable en un máximo de 240 segundos.
- AC4: la guía diferencia el bloqueo inicial por salud del reinicio por salida del
  proceso; no promete que Compose reinicie un contenedor solo por estar `unhealthy`.

Evidencia: eventos temporales y pruebas HTTP positivas, negativas y de recuperación.

## HU-MVP2-ORQ-004 — Flujo integrado

Como usuario quiero acceder al portal y a la API desde un mismo origen para operar
con el backend y la base del entorno seleccionado.

Tareas: configurar Nginx mediante `API_UPSTREAM`, conservar rutas `/api/`, preparar
smoke test parametrizable y datos sintéticos por entorno.

Criterios de aceptación:

- AC1: en cada entorno de validación, `/` devuelve HTTP 200 con la aplicación Angular;
  la navegación a una ruta del portal devuelve la aplicación y no 404 de Nginx.
- AC2: una solicitud válida a `/api/tenants` crea un tenant sintético con respuesta
  201; `/api/tenants/{tenantId}` devuelve 200 y los datos guardados, pasando por
  frontend → backend → PostgreSQL. El script falla ante cualquier código inesperado.
- AC3: el identificador creado solo en DEV devuelve 404 en QA y PROD de validación.
  La evidencia indica URL y entorno, sin incluir tokens ni contraseñas.
- AC4: las solicitudes API del navegador usan el mismo origen del portal; Nginx
  alcanza `backend:8080` por la red interna. No se requiere publicar backend ni BD
  ni usar `host.docker.internal`.

Evidencia: script repetible con parámetro de entorno y respuestas HTTP sanitizadas.

## HU-MVP2-ORQ-005 — Persistencia y recuperación de datos

Como operador quiero conservar los datos y restaurar un respaldo para recuperarme
de una recreación de contenedores o un despliegue fallido.

Tareas: verificar volumen por entorno; documentar `down` sin `-v`; preparar respaldo
con `pg_dump`, restauración con `pg_restore` y comprobación de migraciones Flyway.

Criterios de aceptación:

- AC1: en cada entorno de validación se crea un registro, se ejecuta `down` sin `-v`
  y luego `up`; el GET del mismo ID conserva todos los campos persistidos.
- AC2: se genera un respaldo de QA y se restaura en un proyecto temporal con volumen
  nuevo, distinto de los tres entornos. Coinciden el registro de control, el conteo
  de tenants y la versión de migraciones; el original permanece disponible.
- AC3: respaldo y credenciales quedan fuera de Git. La evidencia contiene resultado
  de restauración y conteos; no adjunta el dump ni datos personales.
- AC4: antes de un cambio en PROD existe respaldo con restauración ensayada en QA.
  El procedimiento declara que revertir una imagen no revierte automáticamente
  una migración; comprueba compatibilidad o exige restauración coordinada.

Evidencia: prueba antes/después de recreación y acta técnica del ensayo de restauración.

## HU-MVP2-ORQ-006 — Promoción y publicación

Como equipo quiero promover una versión comprobada entre ramas y entornos para
identificar qué se ejecuta y volver al candidato anterior si la publicación falla.

Tareas: configurar checks y revisión de PR por entorno; publicar imágenes identificadas
por digest; custodiar secretos del ejecutor; registrar el manifiesto de cada release;
configurar entrada TLS y validar controles de acceso antes de publicar PROD.

Criterios de aceptación:

- AC1: una entrega de prueba tiene PR y evidencia de los tres destinos de
  `ramas-entornos.md`; un build o smoke test fallido impide la promoción.
- AC2: el registro del candidato incluye SHA frontend/backend, digests, versión
  de configuración y migraciones. PROD utiliza los digests aceptados en QA; un
  cambio en el contenido obliga a validarlo de nuevo antes de promoverlo.
- AC3: las credenciales de PROD solo son accesibles al ejecutor autorizado de PROD;
  los jobs de DEV/QA no pueden obtenerlas. Se comprueba la denegación sin imprimir
  el contenido de los secretos.
- AC4: en QA se ensaya volver al candidato anterior; queda saludable en 240 segundos
  desde el arranque con imágenes disponibles, sin pérdida del registro de control
  para migraciones compatibles. Para una migración incompatible se aplica el plan
  de recuperación de ORQ-005 y se registra el tiempo real.
- AC5: antes de publicar PROD se documentan host y nombre DNS realmente asignados,
  HTTPS con certificado válido, redirección HTTP a HTTPS y ausencia de puertos
  públicos de BD/API. Un usuario sin autenticación no accede a operaciones
  administrativas; no existe acceso con cuentas de demo. Cualquier fallo bloquea
  la publicación y requiere corregir los controles del backend.

Evidencia: enlaces a PR/checks, manifiesto sin secretos, pruebas de acceso y rollback.

## Regla de cierre

Cada historia pasa de Todo a Done solo al comprobar todos sus AC sobre el candidato
indicado y adjuntar evidencia fechada, entorno, SHA/digest y resultado. La planificación
por sí sola no cierra las historias. Las interrupciones y pruebas de restauración se
ensayan en instalaciones de validación, sin afectar un PROD con usuarios reales.
