# Semana 11 · Sesión 2 — Planificación: SLI, SLO, presupuesto de error y alertas

Actividad ("Esta semana"): definir 2–3 SLO (disponibilidad, latencia, frescura) con ventanas, una política de
presupuesto de error, una alerta por síntoma con responsable y runbook, un runbook para un incidente probable,
y dividir todo en historias de observabilidad con criterios de aceptación comprobables.

**Naturaleza de la entrega.** Es una sesión de *planificación*: esto es diseño documentado, **no está desplegado**.
No existe Prometheus ni Alertmanager en el proyecto. La regla de alerta sí se validó con `promtool` v2.55.1 (`check rules` y
4 pruebas unitarias con series sintéticas, en [slo-availability-burn.test.yml](alerts/slo-availability-burn.test.yml)), pero eso
no prueba que funcione sobre tráfico real. Cada cifra lleva
su origen: **CONFIRMADO** (PDR v1.9, sección 17) o **PROPUESTO** (decisión nuestra, pendiente de aprobar).
Continúa la [Sesión 1](../Sesión%201/README.md), que definió en un laboratorio las métricas (`http_requests_total`,
`http_request_duration_seconds`) y el `trace_id`.

| Archivo | Contenido |
|---|---|
| Este README | SLO, política de presupuesto de error, alerta y decisiones abiertas |
| [alerts/slo-availability-burn.rules.yml](alerts/slo-availability-burn.rules.yml) | Regla de alerta (diseño, validada con promtool) |
| [alerts/slo-availability-burn.test.yml](alerts/slo-availability-burn.test.yml) | Pruebas unitarias de la regla (promtool) |
| [runbook-security-signin-5xx.md](runbook-security-signin-5xx.md) | Runbook del incidente probable |
| [historias-observabilidad.md](historias-observabilidad.md) | 6 historias con criterios Given/When/Then |

## 1. Los tres SLO

Alcance de los "flujos principales": consulta, autenticación, creación de reserva, carga de comprobantes y caja
(PDR 17, Disponibilidad). Hoy **ningún servicio del producto expone métricas**, así que estos SLO no se pueden medir todavía; esa es la brecha que cierran las historias OBS-01 y OBS-02.

| SLO | SLI (qué se mide) | Objetivo | Ventana | Origen |
|---|---|---|---|---|
| **SLO-1 Disponibilidad** | proporción de peticiones a flujos principales que no responden 5xx: `1 − 5xx / total` | ≥ 95 % | mes calendario | **CONFIRMADO**: PDR 17 exige disponibilidad mensual ≥ 95 % |
| **SLO-2 Latencia** | proporción de peticiones a flujos principales con duración ≤ 3 s | ≥ 95 % (equivale a p95 ≤ 3 s) | 30 días móviles | **CONFIRMADO** el umbral (PDR 17, Rendimiento: p95 ≤ 3 s); la medición operativa continua es **PROPUESTA**, el PDR la valida con una prueba de carga |
| **SLO-3 Frescura** | proporción de eventos del outbox publicados a todos sus consumidores en ≤ 60 s desde su creación | ≥ 99 % | 30 días móviles | **PROPUESTO**: el PDR no fija frescura. Base: el relay corre cada 5 s y reintenta con espera creciente (spec `worker-event-relay`, AC-01.3) |

Notas de honestidad:
- El PDR mide la disponibilidad en **minutos** (mes − mantenimiento programado − indisponibilidad no programada). El SLI de
  peticiones es una aproximación técnica; el cálculo oficial sigue la fórmula del PDR.
- Los errores 4xx (por ejemplo un 401 por token ausente) **no** cuentan como indisponibilidad: son respuestas correctas.
- El histograma de la Sesión 1 tiene cubos hasta 5 s pero **no el de 3 s**; SLO-2 exige añadirlo (historia OBS-01).
- Las métricas de frescura **no existen todavía** (historia OBS-05).

## 2. Presupuesto de error (cálculo)

Presupuesto = 100 % − objetivo.

| SLO | Presupuesto | En una ventana de 30 días |
|---|---|---|
| SLO-1 | 5 % del tiempo | 2 160 min ≈ **36 h** de indisponibilidad no programada |
| SLO-2 | 5 % de peticiones lentas | 1 de cada 20 peticiones puede superar 3 s |
| SLO-3 | 1 % de eventos tardíos | 1 de cada 100 eventos puede tardar más de 60 s |

### Política de presupuesto de error (PROPUESTA)

| Presupuesto consumido en la ventana | Qué se hace |
|---|---|
| < 50 % | Se publica con normalidad. |
| 50 % – 99 % | Se revisa cada cambio de riesgo antes de promover a `qa`; se prioriza la deuda de fiabilidad abierta. |
| ≥ 100 % | **Congelación**: solo se promueven correcciones de fiabilidad y seguridad hasta que la ventana vuelva a cumplir. Se documenta un post-mortem. |
| Incidente P0/P1 con causa propia | Post-mortem obligatorio y mejora en el backlog técnico, consuma o no el presupuesto. |

Quién decide: el equipo (hoy, Fernanda y Jhon). Una congelación de promociones a `release`/`main` se comunica al docente.
El consumo se revisa al cerrar cada semana en el `hu-status`.

## 3. Alerta por síntoma (con responsable y runbook)

Regla completa: [slo-availability-burn.rules.yml](alerts/slo-availability-burn.rules.yml).

| Campo | Valor |
|---|---|
| Nombre | `SloAvailabilityBurnRate` |
| Síntoma | los usuarios reciben 5xx: la tasa de errores consume el presupuesto de SLO-1 a ritmo 6× o más |
| Disparador | tasa 5xx > 30 % (6 × el 5 % de presupuesto) durante 5 min **y** en la última hora, con tráfico mínimo |
| Severidad | P1 según [incident-management.md](../../../../multi-tour-docs/multi-tour-docs/13-operations/incident-management.md) (funcionalidad central degradada); sube a P0 si el servicio no responde `/health` |
| Responsable | **PROPUESTO**: María Fernanda Robayo (autora de esta entrega); los servicios transversales no tienen dueño asignado en el equipo y debe confirmarse |
| Runbook | [runbook-security-signin-5xx.md](runbook-security-signin-5xx.md) |
| Canal | Slack `#incidents` es el que usa la plantilla de la docs; no existe canal real configurado |

Por qué no se usan los umbrales genéricos de `observability.md` (error > 5 %, p95 > 500 ms): son una plantilla; con un SLO
confirmado del 95 % y p95 de 3 s esos umbrales dispararían muy por debajo del objetivo y generarían fatiga de alertas.
Tampoco se alerta por CPU ni por cada 500 aislado (causa, no síntoma).

## 4. Decisiones abiertas

1. ¿Se aprueba el objetivo de frescura de SLO-3 (60 s al 99 %)? Es nuestro, no del PDR.
2. ¿Quién es el responsable de los servicios transversales y de la guardia?
3. ¿Dónde se publica la métrica de frescura: el relay o cada API que posee el outbox?
4. ¿Se acepta medir la disponibilidad por peticiones como aproximación al cálculo por minutos del PDR?
5. Este material cambia el SLO operativo; si contradice `13-operations`, hay que actualizar primero la docs (no hay SLO publicado allí hoy).

## 5. Fuentes

- PDR v1.9, sección 17 (Disponibilidad, Rendimiento, Observabilidad, Respaldo y recuperación): [PDR_Multi_tour_v1.9.md](../../../08-week/hu-status/PDR_Multi_tour_v1.9.md).
- Docs: `13-operations/README.md` (conceptos SLI/SLO/presupuesto), `observability.md`, `incident-management.md`, plantilla `09-microservices/_template/service/runbook.md`, spec del relay.
- Código: `multi-tour-security` (`deploy/compose.yml`, README), solo lectura; y el laboratorio de la Sesión 1 de esta semana.
