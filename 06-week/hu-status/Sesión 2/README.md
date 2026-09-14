# Semana 06 · Sesión 2: planificación de entornos y orquestación para MVP 2

## Objetivo y entrega

Definir DEV, QA y PROD, documentar sus variables y valores, separar los secretos del
repositorio, confirmar la relación rama–entorno y dividir la orquestación del MVP 2
en historias con criterios de aceptación comprobables.

| Requisito | Entregable |
| --- | --- |
| Tres entornos y valores por entorno | [Matriz de configuración](matriz-configuracion.md) |
| Secretos fuera de Git | [.env.example](.env.example) (DEV), [.env.qa.example](.env.qa.example), [.env.prod.example](.env.prod.example) y [.gitignore](.gitignore) |
| Asignación rama–entorno | [Ramas y promoción](ramas-entornos.md), con referencias remotas verificadas |
| Historias de orquestación MVP 2 | [Backlog y criterios de aceptación](historias-orquestacion.md) |

## Tres entornos definidos

| Entorno | Propósito | Datos | Condición de ingreso |
| --- | --- | --- | --- |
| DEV | Integrar y probar cambios del equipo | Sintéticos, regenerables | PR de historia aprobado hacia `develop` y build correcto |
| QA | Validar el candidato integrado y sus criterios de aceptación | Sintéticos controlados, distintos de DEV | Candidato trazable de DEV, pruebas de integración aprobadas y PR hacia `qa` |
| PROD | Ejecutar la versión aceptada por el equipo | Persistentes; acceso restringido | Aceptación en QA, respaldo verificable y PR hacia `main` |

Cada entorno tendrá proyecto Compose, red y volumen independientes. Compartir red
significa que los servicios de **un mismo entorno** se comunican; no se compartirá
la red ni el volumen entre DEV, QA y PROD. La arquitectura prevista conserva
frontend Angular/Nginx, backend Spring Boot y PostgreSQL; esta planificación no
introduce nuevos microservicios.

## Uso de las plantillas

Desde esta carpeta, preparar solo el archivo del entorno que se necesite:

```powershell
Copy-Item .env.example .env.dev
Copy-Item .env.qa.example .env.qa
Copy-Item .env.prod.example .env.prod
```

Completar `POSTGRES_PASSWORD` y `APP_JWT_SECRET` únicamente en los archivos locales
ignorados o en el almacén de secretos del ejecutor. Los valores deben ser distintos
por entorno. Las plantillas dejan esos campos vacíos deliberadamente.

La matriz es el contrato del Compose de MVP 2 **por implementar** en HU-MVP2-ORQ-001
y 002. No basta con pasar estos archivos al Compose de Sesión 1: allí el nombre de
proyecto y varios parámetros aún están fijados para la demo y existen valores de
credenciales de ejemplo. No se presenta ese despliegue como DEV/QA/PROD ya operativos.

## Estado de esta sesión

Planificación documentada. Se verificó la existencia remota de las ramas de ambos
componentes el 13 de septiembre de 2026 y se comprobó que las plantillas no contienen
valores secretos y que los archivos locales quedan ignorados por Git.
Los resultados de estas comprobaciones están en [verificacion.txt](verificacion.txt).

Las seis historias están en `Todo`: la Sesión 1 aporta evidencia de arranque,
salud y persistencia de una demo local; falta extenderla y comprobarla para cada
entorno. No se crearon ramas, PR, pipelines ni despliegues en esta sesión.

La definición no presupone proveedores ni dominios contratados. Los puertos de la
matriz permiten validar aislamiento en un solo host; la publicación de PROD con
TLS y los controles de acceso es parte de HU-MVP2-ORQ-006.
