# Semana 5 · Sesión 2 — Cierre del MVP Corte 1

## Objetivo de la sesión

Documentar el cierre del MVP de envío 1 (Corte 1) de Multi Tour: ascenso a `main`, existencia del tag `v1.0.0`, verificación de la Definition of Done (DoD) con evidencia real, evidencia de demostración, retrospectiva, estado de la evidencia individual de cada integrante en su fork, y preparación del paso a Corte 2.

**Método de verificación.** Toda afirmación de esta sesión se contrastó contra evidencia real ejecutada u observada directamente: `git log`, `git tag`, `git ls-remote`, `git status`, y una corrida real de `npm run build` / `npm test` sobre el repositorio del Frontend. Donde no fue posible verificar algo con evidencia real, se deja marcado explícitamente como **PENDIENTE** en vez de asumirlo. Los repositorios de código (`Multitour-Monolito-Portal`, `Multitour-Monolito-Api`) están fuera de `sistemas-distribuidos-2026-b-g2`; se consultaron en modo solo lectura (sin commit, push, tag ni cambio de rama) únicamente para verificar los hechos que esta sesión debe documentar.

## 1. Ascenso a `main`

| Componente | Estado | Evidencia |
| --- | --- | --- |
| Frontend (`Multitour-Monolito-Portal`) | ✅ VERIFICADO | Rama actual `main`, árbol de trabajo limpio (`git status` sin cambios). Historial: `06fdefd release: promote MVP Corte 1 frontend to main` ← `e486c41 merge: promote MVP Corte 1 frontend to qa` ← `648047f merge: integrate HU-03 MVP Corte 1 frontend`. |
| Backend (`Multitour-Monolito-Api`) | ⚠️ PENDIENTE DE CONFIRMAR | Existe la rama `main` (local y remota) y `origin/HEAD` apunta a ella, pero el historial de `main` no muestra un commit explícito de "release"/"promote" equivalente al del Frontend; los últimos commits son de integración de funcionalidades (`Merge pull request #12 from Molina211/develop`, etc.). No se puede confirmar con evidencia local que el contenido de `main` corresponda deliberadamente al corte del MVP 1 y no a un estado posterior o distinto. |

## 2. Etiqueta `v1.0.0`

| Componente | Estado | Evidencia |
| --- | --- | --- |
| Frontend | ✅ VERIFICADO | `git tag -l` → `v1.0.0` (local). `git ls-remote --tags origin` → `refs/tags/v1.0.0` y `refs/tags/v1.0.0^{}` apuntando ambos al commit `06fdefd`, el mismo de la promoción a `main`. Coincide exactamente con lo ya confirmado en el enunciado de esta actividad. No se creó ni se modificó ningún tag en esta sesión. |
| Backend | ❌ NO EXISTE | `git tag -l` y `git ls-remote --tags origin` no devuelven ningún tag en `Multitour-Monolito-Api`. El Backend del MVP 1 no está etiquetado como `v1.0.0`. |

## 3. Verificación de Definition of Done (DoD)

Se usó como referencia la DoD ya escrita por el equipo en `04-week/hu-status/Sesión 2/definition-of-done.md` (no se redefinió una nueva DoD para esta sesión). Verificación con evidencia real, criterio por criterio, solo sobre lo que pudo comprobarse directamente:

| Criterio de la DoD | Frontend | Backend |
| --- | --- | --- |
| El código compila y arranca en el entorno del equipo | ✅ `npx ng build --configuration development` ejecutado en esta sesión sobre `main`: `Application bundle generation complete` | ⚠️ No se ejecutó el build en esta sesión (fuera del alcance verificado aquí) |
| Existe al menos una prueba por camino feliz, automatizada o verificable | ✅ `npx ng test --watch=false --browsers=ChromeHeadless` ejecutado en esta sesión sobre `main`: `TOTAL: 88 SUCCESS`, 0 FAILED | ⚠️ No se ejecutó la suite de pruebas en esta sesión |
| Separación dominio/aplicación/infraestructura conservada | ✅ Slice hexagonal de Auth (`core/auth/{domain,application,infrastructure}`) y casos de uso de Reservation/Catalog verificados en la iteración de mejora técnica previa de este mismo Frontend | ⚠️ No verificado en esta sesión |
| `openapi.yaml` actualizado si el cambio afecta contrato | ❌ GAP DETECTADO | No se encontró ningún archivo `openapi.yaml` ni `swagger` dentro del repositorio real del Backend (`Multitour-Monolito-Api`). El único `openapi.yaml` existente en todo el proyecto vive en `04-week/hu-status/Sesión 2/openapi.yaml`, que documenta el ejercicio académico (`tenant-service`), no el contrato real del MVP 1 desplegado. |
| Toda operación autenticada exige contexto de tenant | ✅ Confirmado en el Frontend: `SessionService.tenantId()` y los guards de sesión (`session.guard.ts`) están cubiertos por tests reales | ⚠️ No verificado en esta sesión |
| No se introducen secretos en código fuente o repositorio | ✅ Confirmado en trabajo previo sobre este mismo Frontend (`nginx.conf`, `docker-compose.yml`, `environment.ts` usan rutas relativas y variables, sin credenciales embebidas) | ⚠️ No verificado en esta sesión |

**Conclusión de la DoD:** el Frontend tiene evidencia real y reciente que respalda el cumplimiento de los criterios técnicos verificables desde este entorno. El Backend no pudo verificarse en esta sesión (no se ejecutó su build ni sus pruebas) y presenta una brecha concreta y confirmada: no existe un contrato `openapi.yaml` del proyecto real. Ambos puntos quedan como pendientes explícitos, no como supuestos de cumplimiento.

## 4. Demostración del sistema en funcionamiento

**Estado: ⚠️ PENDIENTE.** No se encontró en el repositorio ningún artefacto de evidencia de demo (grabación, guion de demo, capturas fechadas, o documento de sesión de demostración) para el MVP Corte 1 completo. Existe evidencia de ejecución real pero acotada a un solo servicio académico: `05-week/hu-status/Sesión 1/Evidencias/` (contenerización de `tenant-service` con Docker, no el sistema completo Frontend + Backend).

### Evidencia pendiente
El equipo debe generar y anexar a esta carpeta (`05-week/hu-status/Sesión 2/`) evidencia real de una demo end-to-end del MVP 1 desplegado (Frontend en `main` + Backend), por ejemplo: capturas de pantalla fechadas del flujo cliente final (consulta de oferta → creación de reserva → registro de pago) contra el sistema realmente corriendo, o una grabación/registro de la sesión de demo. No se debe generar ni simular esta evidencia; debe provenir de una ejecución real del sistema.

## 5. Retrospectiva

**Estado: ⚠️ PENDIENTE (sesión en vivo con el equipo).** No se encontró en el repositorio ningún registro de una retrospectiva ya realizada para el cierre del MVP 1, ni una plantilla de retrospectiva propia del curso reutilizable (se revisó `03-week/02-session/material-gobernanza-microservicios/` sin encontrar una).

Como insumo verificable para esa sesión (no como sustituto de ella), se deja un borrador basado únicamente en evidencia técnica observable en este cierre:

| Qué funcionó (evidencia) | Qué no funcionó / brechas (evidencia) |
| --- | --- |
| El Frontend completó su ciclo hasta `main` con tag `v1.0.0` publicado (Sección 1 y 2). | El Backend no tiene tag `v1.0.0`; no hay evidencia de que su `main` corresponda deliberadamente al corte del MVP 1. |
| El Frontend pasó de una suite de pruebas prácticamente inexistente (3 pruebas, 1 fallando) a 88 pruebas reales, 0 fallando, verificado nuevamente en esta sesión. | No existe `openapi.yaml` del contrato real del proyecto; el único existente pertenece al ejercicio académico `tenant-service`. |
| El tablero de historias del MVP 1 (`04-week/hu-status/Sesión 2/sprint-mvp1-board.md`) y su DoD quedaron documentados desde la Semana 4. | Ese mismo tablero sigue marcando las 12 historias como `Todo`, sin actualizar, a pesar de que el Frontend ya evidencia trabajo real sobre varias de ellas (catálogo, reserva, pago, sesión). Es una inconsistencia entre la documentación académica y el estado real del proyecto. |
| — | El archivo de estado semanal individual (`05-week/hu-status/README.md`) sigue con su plantilla en blanco (CONFIG y todas las secciones vacías), pese a que ya existe evidencia real de la Sesión 1 de esa misma semana. |

### Evidencia pendiente
El equipo debe ejecutar una sesión de retrospectiva en vivo (formato sugerido: Qué funcionó / Qué no funcionó / Acciones) y registrar su resultado real en esta carpeta. La tabla anterior es un punto de partida verificable, no un reemplazo de esa conversación.

## 6. Evidencia individual por miembro (`NN-week/hu-status` en cada fork)

Este repositorio es el fork individual de **Maria Fernanda Robayo Laguna** (`GITHUB_USER: FernandaRobayo`, `TEAM: ErrorCapa8`; ver `01-week/hu-status/README.md`). Solo puede verificarse desde aquí el estado de este fork; el fork del otro integrante (`Jhon Sebastian Molina Fierro`, coautor del PDR, dueño del repositorio `travesia-natural-docs`) no es accesible localmente.

| Semana | `hu-status/README.md` | `hu-status/Sesión 1` o `02-session`/`01-session` | Observación |
| --- | --- | --- | --- |
| 01 | ✅ Completo (CONFIG y las 6 secciones con contenido) | ✅ `Sesión 1` y `Sesión 2` con evidencia propia de esta semana | — |
| 02 | ✅ Completo | ✅ `Sesión 1` (arquitectura candidata) y `Sesión 2` (context map) | — |
| 03 | No verificado en esta sesión (fuera del alcance de este cierre) | No verificado en esta sesión | — |
| 04 | No verificado en esta sesión | ✅ `Sesión 2` con ADR, backlog, DoD, board y `openapi.yaml` (ya usados como referencia en esta sesión) | — |
| 05 | ❌ **PENDIENTE** — plantilla en blanco: `FULL_NAME`, `GITHUB_USER`, `TEAM`, `SPRINT_GOAL` y las 6 secciones sin completar | ✅ `Sesión 1` completa (contenerización, con evidencia real de ejecución) | Brecha real detectada: existe evidencia técnica de la semana pero el índice semanal que se califica automáticamente no la refleja. |

**Estado: ⚠️ PENDIENTE.** `05-week/hu-status/README.md` requiere ser completado por el integrante responsable de este fork antes del cierre. No se modificó ese archivo desde esta sesión: está fuera de `05-week/hu-status/Sesión 2` y completarlo implica contenido de primera persona (contribución individual, bloqueos, meta del sprint) que no corresponde inventar aquí.

### Evidencia pendiente
1. Completar el bloque CONFIG y las 6 secciones de `05-week/hu-status/README.md` con la información real de la semana (reutilizando el mismo bloque CONFIG ya usado en semanas anteriores de este mismo fork).
2. Verificar en GitHub, no localmente, que el fork de `Jhon Sebastian Molina Fierro` tiene su propia evidencia semanal completa hasta la Semana 5.

## 7. Transición a Corte 2

No existe todavía en el repositorio una definición explícita de alcance para Corte 2: `06-week/hu-status/README.md` existe únicamente como plantilla en blanco, y `06-week/01-session` / `06-week/02-session` solo contienen `.gitkeep`. Como insumo real para esa definición (no como el alcance ya decidido), quedan disponibles en este repositorio:

- Los elementos `Should Have`, `Could Have` y `Won't Have en MVP 1` ya documentados en `04-week/hu-status/Sesión 2/sprint-mvp1-moscow.md` (recuperación de contraseña, descuentos visibles, validación de soportes con `409`, modificar/cancelar/reagendar reserva, devoluciones operativas completas, caja diaria con cierres, dashboard administrativo, roles opcionales por tenant, pasarela de pagos).
- Las brechas confirmadas en esta misma sesión (Secciones 3 a 6): tag `v1.0.0` del Backend, `openapi.yaml` real del proyecto, evidencia de demo end-to-end, retrospectiva en vivo, y el estado semanal individual pendiente.

### Evidencia pendiente
El equipo debe decidir y documentar explícitamente en `06-week/hu-status/` (cuando corresponda) qué subconjunto de lo anterior entra a Corte 2, priorizando primero las brechas de cierre de Corte 1 detectadas en esta sesión antes de sumar alcance nuevo del `Should`/`Could Have`.

## Conclusiones

El MVP Corte 1 tiene su componente Frontend genuinamente cerrado con evidencia real y verificable: promovido a `main`, etiquetado `v1.0.0` sobre el mismo commit de release, con build y 88 pruebas en verde confirmadas en esta misma sesión. El resto del cierre exigido por esta actividad —tag y verificación del Backend, contrato `openapi.yaml` real, demo end-to-end, retrospectiva en vivo, y el estado semanal individual de esta semana— no pudo darse por completado porque no existe evidencia real que lo respalde, y se deja documentado explícitamente como pendiente en cada sección, sin asumir que ya ocurrió. Esta misma lista de pendientes es, a la vez, el punto de partida más honesto para preparar la transición a Corte 2.
