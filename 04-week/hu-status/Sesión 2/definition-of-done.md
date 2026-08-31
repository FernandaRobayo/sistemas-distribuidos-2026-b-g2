# Sprint MVP 1 - Definicion de Hecho

Un item del sprint MVP 1 solo se considera terminado si cumple todo lo siguiente:

## Producto

- El comportamiento implementado respeta el alcance del PDR `v1.7`.
- El item no introduce funciones fuera del alcance del MVP 1.
- Los criterios de aceptacion de la historia quedan comprobados.

## Codigo y arquitectura

- El codigo compila y arranca en el entorno del equipo.
- La separacion entre dominio, aplicacion e infraestructura se conserva.
- No se mezclan reglas de negocio con adaptadores de entrada o salida.
- No se introducen secretos en codigo fuente o repositorio.

## API y contrato

- Si el cambio afecta endpoints, request o response, `openapi.yaml` queda actualizado.
- Los codigos de estado HTTP y errores basicos estan documentados.
- Toda operacion autenticada exige contexto de tenant cuando aplique.

## Calidad

- Existe al menos una prueba por camino feliz del item, automatizada o verificable segun la madurez del modulo.
- Los casos de validacion relevantes del item fueron comprobados.
- No existen errores conocidos bloqueantes para el flujo principal del MVP 1.
- Para cerrar una historia debe existir como minimo una evidencia verificable asociada: prueba automatizada, curl reproducible, coleccion Postman ejecutada o captura con resultado observable.

## Seguridad y multitenencia

- El item no permite acceso cruzado entre tenants.
- Las validaciones de autenticacion y autorizacion basicas funcionan segun el rol o actor esperado.
- La informacion sensible no se expone en logs ni respuestas innecesarias.

## Documentacion y evidencia

- La historia o tarea actualiza su estado en el tablero del sprint.
- Existe evidencia verificable de ejecucion: prueba, captura, curl, Postman o commit.
- La evidencia debe indicar de forma rastreable que criterio de aceptacion fue comprobado y sobre que endpoint, flujo o modulo se verifico.
- Si el cambio modifica decisiones relevantes, la decision queda documentada en el entregable correspondiente.

## Revision y cierre

- El trabajo fue revisado por al menos una persona del equipo o por una lista de chequeo acordada.
- El item esta integrado sin romper el flujo principal comprometido.
- El equipo acepta que el item esta listo para demo o lanzamiento del MVP 1.
