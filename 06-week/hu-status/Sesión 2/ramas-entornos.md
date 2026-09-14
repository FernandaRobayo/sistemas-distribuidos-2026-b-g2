# Asignación rama ↔ entorno y promoción

## Asignación confirmada para el proyecto

| Entorno | Rama base / destino | Rama de una historia (ejemplo) | Entrada |
| --- | --- | --- | --- |
| DEV | `develop` | `hu-mvp2-orq-001-dev` | PR hacia `develop` |
| QA | `qa` | `hu-mvp2-orq-001-qa` | PR hacia `qa`, con trazabilidad del cambio validado en DEV |
| PROD | `main` | `hu-mvp2-orq-001-main` | PR hacia `main`, con aceptación en QA |

La regla del [README del curso](../../../README.md) es crear una rama de historia
desde la rama base del entorno y abrir PR hacia esa misma base. Se aplica a los
repositorios ejecutables del frontend y backend. Los commits siguen Conventional
Commits, por ejemplo `feat(orchestration): parameterize environment configuration`.

## Evidencia de existencia de ramas

Consulta remota de solo lectura realizada el **13 de septiembre de 2026** con
`git ls-remote --heads origin develop qa main` en cada repositorio local:

| Componente | Rama | SHA anunciado por origin |
| --- | --- | --- |
| Frontend | `develop` | `648047ff56879191481c1af4ac2ef14d2d18d85e` |
| Frontend | `qa` | `e486c410276cac8d5bcdc6ac215a6f5018660c28` |
| Frontend | `main` | `06fdefdadfcb66b0373973915e88304f6d098138` |
| Backend | `develop` | `1167c5be00c0d4b205ea3ea40e7b29a217a676d4` |
| Backend | `qa` | `8e99969206ed1230fe9fd3fbde01c035c92e03d0` |
| Backend | `main` | `aaed367d3ddeb458f5128173a93c6069d2fb1e68` |

Rutas de consulta relativas al workspace:

- Frontend: `Multitour-Monolito-Portal/Multitour-Monolito-Portal`.
- Backend: `Multitour-Monolito-Portal/Multitour-Monolito-Api/Multitour-Monolito-Api`.

El repositorio académico `sistemas-distribuidos-2026-b-g2` muestra solo `main` y
`origin/main` en sus referencias locales; es la entrega documental. No se inventaron
ramas DEV/QA en él. El HEAD remoto actual del backend tampoco equivale necesariamente
a la copia de Sesión 1: cada candidato debe registrar los SHA que realmente construye.

La consulta confirma ramas remotas, no protecciones, pipelines, servidores ni un
despliegue automático. Esos controles se implementarán y comprobarán en ORQ-006.

## Flujo del candidato a MVP 2

1. Implementar cada HU desde `develop` en su rama `hu-...-dev`; validar sus criterios
   y abrir PR a `develop`.
2. Preparar la integración en `hu-...-qa`, creada desde `qa`, con los cambios y las
   referencias de los PR de DEV. Ejecutar build y pruebas sobre el resultado exacto
   que se integrará. Abrir PR a `qa`; no copiar secretos entre entornos.
3. Registrar un candidato con SHA de frontend y backend, digest de sus imágenes,
   versión de configuración y migraciones. QA valida ese conjunto.
4. Preparar `hu-...-main` desde `main` y PR a `main`, vinculando la aceptación de QA.
   Si el contenido de ejecución cambia al integrar, se construye y valida un nuevo
   candidato en QA antes de publicar PROD. No desplegar imágenes con `latest` como
   única referencia de versión.
5. Promover a PROD los mismos digests aceptados, cambiando solo la configuración
   y secretos propios de PROD. Conservar el manifiesto anterior y el respaldo para
   volver a la versión previa siguiendo ORQ-005 y 006.

La promoción es planificada; esta actividad no ejecutó merges ni despliegues.
