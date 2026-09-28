# Auditoría de preparación — Semana 8, Sesión 1

Fecha: 2026-09-26 (America/Bogota).

**Dictamen: existe base suficiente para ejecutar la actividad, pero la evidencia revisada todavía no permite declararla completada.** La mayor brecha es el registro del trabajo del sprint actual: selección y orden de historias, WIP aplicado, sincronización diaria y medición de cierres.

## Alcance y límites

Se revisaron el repositorio académico local, su historial y workflow, los backlogs y entregas de semanas anteriores, el estado de semana 8 y consultas de solo lectura a GitHub para el repositorio académico y los repositorios del producto `Molina211/Multitour-Monolito-Api` y `Molina211/Multitour-Monolito-Portal`.

La búsqueda de PR devolvió resultados del backend; las del frontend y del repositorio académico no devolvieron resultados. Esto se informa como resultado de búsqueda, no como prueba absoluta de inexistencia. No se inspeccionaron tableros externos, conversaciones del equipo, protecciones de ramas ni todas las ejecuciones de CI. No se ejecutó el producto ni se certificó su comportamiento. La auditoría evalúa evidencias de gestión, no sustituye pruebas funcionales.

No hay una skill especializada en auditoría Scrum/DevOps en el catálogo disponible; se emplearon inspección local y herramientas de GitHub. No se atribuye a una skill una verificación que no realiza.

## Qué pide la actividad

Aplicar un flujo de trabajo verificable sobre historias reales del proyecto: elegir qué se va a terminar, comprobar sus criterios, limitar lo iniciado, integrar cambios mediante PR, coordinar diariamente y contar lo efectivamente terminado. El texto facilitado no exige una funcionalidad nueva concreta; sí exige ejecución real. Un conjunto de plantillas vacías no demuestra esa ejecución.

## Matriz de hallazgos

| Requisito | Evidencia encontrada | Evaluación y brecha |
| --- | --- | --- |
| Backlog priorizado | [MoSCoW MVP 1](../../../04-week/hu-status/Sesión%202/sprint-mvp1-moscow.md), [tablero MVP 1](../../../04-week/hu-status/Sesión%202/sprint-mvp1-board.md), [ORQ-001 a 006](../../../06-week/hu-status/Sesión%202/historias-orquestacion.md), [INT-001 a 006](../../../07-week/hu-status/Sesión%202/historias-integracion-mvp2.md). | Parcial. Hay prioridades y dependencias históricas; falta seleccionar y ordenar explícitamente el trabajo de este sprint, con responsables reales y estados actuales. El tablero MVP 1 dice «Estado sugerido» y muestra Todo: no representa ejecución actual verificada. |
| Historias comprobables | El tablero MVP 1 incluye AC por historia. ORQ e INT detallan respuestas, aislamiento, resultados y pruebas esperadas. | Base disponible. Hay que revisar los AC de las historias seleccionadas contra el alcance vigente del [PDR v1.9](../PDR_Multi_tour_v1.9.md). Las rutas académicas antiguas no deben presentarse como endpoints implementados. |
| WIP definido y respetado | La [guía de semana 2](../../../02-week/hu-status/Weekly%20summary/buenas-practicas-scrum-kanban.md) explica WIP y contiene ejemplos. | No acreditado para el sprint. No se encontró un acuerdo operativo del equipo ni registros fechados que demuestren su cumplimiento. Los números de la guía son ejemplos. |
| PR por cambio | El backend tiene PR reales. Se verificó en detalle el [PR #33](https://github.com/Molina211/Multitour-Monolito-Api/pull/33): integrado a develop el 2026-09-16 desde chore/archunit-architecture-tests. | Parcial. Es un antecedente, no evidencia de semana 8. La consulta de reviews de ese PR devolvió una lista vacía. Su rama no sigue el patrón hu-...-dev documentado para el curso. Falta trazabilidad de cada historia actual a sus PR, verificaciones y revisión. |
| Sincronización diaria | Hay explicación del Daily Scrum en semana 2 y reportes semanales de contribuciones/bloqueos. | No acreditada. No se encontraron actas o registros diarios fechados del sprint en las entregas revisadas. Un reporte semanal no demuestra sincronización diaria. |
| Seguimiento de terminadas | [Semana 7](../../../07-week/hu-status/README.md) declara cuatro ítems documentales done y HU-05 doing. | Parcial histórico. No permite calcular el rendimiento del sprint de semana 8 ni atribuir cierres completos del equipo. Faltan período, historias comprometidas y fechas/evidencias de cierre. |

## Hallazgos complementarios

- El [reporte individual de semana 8](../README.md) sigue como plantilla: identidad, equipo, objetivo, historias y enlaces sin completar. El README raíz exige conservar su estructura y redactarlo en inglés porque lo procesa automáticamente.
- Existe [Definition of Done](../../../04-week/hu-status/Sesión%202/definition-of-done.md), pero referencia PDR v1.7. Conviene preparar una versión aplicable al sprint actual, enlazada a v1.9, manteniendo el documento histórico.
- Existe un [workflow de contratos](../../../.github/workflows/week07-contracts.yml) para push, PR y ejecución manual. Sus filtros cubren archivos concretos de semana 7: no constituye una puerta de calidad general del frontend o backend. Configuración de CI y ejecución remota satisfactoria son evidencias diferentes.
- Las historias INT permanecen inicialmente todo y distinguen el laboratorio existente de integraciones pendientes. Publicar contratos no satisface por sí solo todos sus AC.
- La [asignación de ramas y entornos](../../../06-week/hu-status/Sesión%202/ramas-entornos.md) ya documenta el flujo del producto. No es necesario inventar entornos adicionales en el repositorio académico para demostrar esa planificación.
- La imagen C4 de semana 8 aparece sin seguimiento en Git. Su presencia local no acredita publicación, revisión ni aceptación de una historia.

## Acciones para completar la sesión 1

1. **Fijar el sprint actual.** Registrar fechas, objetivo y miembros; seleccionar pocas historias reales y ordenarlas 1, 2, 3… según valor y dependencias. Incluir ID, responsable, AC, estado y enlace de evidencia. Usar los backlogs existentes como insumo y verificar el estado actual de HU-05 antes de incorporarla.
2. **Acordar y aplicar WIP.** Como propuesta inicial, máximo dos historias iniciadas sin terminar para el equipo; incluir desarrollo, revisión y bloqueadas en ese conteo. Ajustarlo a la capacidad real y registrar el acuerdo. No es un límite ya adoptado ni una cifra exigida por el enunciado.
3. **Trazar cada cambio.** Vincular historia → rama → PR al entorno correspondiente → pruebas/revisión → merge → aceptación. Un commit o una rama por sí solos no sustituyen el PR. Los PR históricos se pueden referenciar honestamente, sin presentarlos como revisiones realizadas en otra fecha.
4. **Registrar cada sincronización real.** Fecha, participantes, historias terminadas, trabajo activo, bloqueos, siguiente acción y WIP observado. Si no existe evidencia de días anteriores, comenzar el registro desde ahora; no reconstruir reuniones ficticias.
5. **Medir cierres.** Registrar por fecha las historias distintas que pasan a Done cumpliendo todos sus AC y la DoD. Throughput del sprint = número de historias terminadas dentro del período. No sumar PR de promoción como historias adicionales. Opcionalmente medir tiempo de ciclo desde inicio hasta Done y edad del trabajo pendiente.
6. **Completar la entrega individual.** Llenar el README de semana 8, conservar marcadores y cabeceras, y enlazar tablero, acuerdo WIP, diarios, PR y métricas. Marcar únicamente verificaciones realmente acreditadas.

## Relación con la sesión 2

La sesión 1 permite observar qué termina el equipo y qué lo bloquea. La sesión 2 utiliza esa información para refinar, dividir y estimar el backlog del MVP 2. Las seis historias ORQ y las seis INT son insumos técnicos existentes, no sustituyen todo el backlog funcional de Multi Tour. No hace falta implementar todas para demostrar la gestión del sprint de sesión 1.

## Criterio de cierre de esta auditoría

La auditoría queda documentada; la actividad académica sigue pendiente de evidencias de ejecución del equipo. No se asignaron responsables, no se declararon reuniones, no se cambiaron historias a Done y no se publicaron cambios remotos como parte de esta revisión.
