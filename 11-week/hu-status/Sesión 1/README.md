# Semana 11 · Sesión 1 — Observabilidad: registros, métricas y rastreo distribuido

Actividad ("Esta semana"): instrumentar servicios con registros estructurados con `trace_id` propagado,
métricas básicas (tasa, errores, latencia) y un rastreo distribuido para una solicitud de varios servicios.
SLO y alertas pertenecen a la sesión 2 y no se definen aquí.

**Alcance honesto.** Esta entrega vive solo en esta carpeta. Es un **laboratorio autocontenido** (Go, solo biblioteca estándar)
con tres servicios mínimos —`gateway`, `reservations`, `security`— que reproducen el flujo del producto
gateway → reservas → seguridad. Las respuestas de `reservations` son datos de prueba (`STUB`), no datos reales del dominio.
Aparte, el servicio real `security` fue instrumentado en una rama local sin commit (sección 5).
Qué tiene ya el producto y qué falta está en la sección 5.

## 1. Pilar 1 — Registros estructurados con `trace_id`

Cada servicio escribe una línea JSON por evento ([logs.jsonl](Evidencias/logs.jsonl)) con
`timestamp`, `level`, `message`, `service`, `trace_id` y `span_id`, campos mínimos de
`13-operations/observability.md` de la docs. No se registran datos personales ni secretos.

```json
{"timestamp":"2026-10-18T18:00:00.139-05:00","level":"INFO","message":"request received","service":"gateway","method":"GET","path":"/api/reservations/R-100","trace_id":"trace-ok-0001","span_id":"942fb39caa8721c7"}
```

**Propagación.** El gateway reutiliza `X-Correlation-Id` si es válido (`^[A-Za-z0-9._-]{1,128}$`, igual que el servicio
`security` del producto) o genera uno de 32 hex, lo devuelve en la respuesta y lo reenvía a cada salto. `trace_id` es el nombre
del campo del docente; su valor es el `X-Correlation-Id` del contrato (constitución global). Si el id tiene forma W3C
también viaja en `traceparent`.

## 2. Pilar 2 — Métricas (tasa, errores, latencia)

Cada servicio expone `GET /metrics` en formato de texto Prometheus: `http_requests_total{service,method,route,status}`
y el histograma `http_request_duration_seconds`. La etiqueta `route` usa la ruta con plantilla (`/reservations/{id}`)
para no generar cardinalidad por id. Muestra: [gateway](Evidencias/metrics-gateway.txt),
[reservations](Evidencias/metrics-reservations.txt), [security](Evidencias/metrics-security.txt).

| Señal | Cómo se lee |
|---|---|
| Tráfico | `rate(http_requests_total[5m])` |
| Errores | `http_requests_total{status=~"5.."}` / total |
| Latencia | cuantiles sobre `http_request_duration_seconds_bucket` |

Las señales de saturación quedan fuera de este laboratorio.

## 3. Pilar 3 — Rastreo distribuido

Cada salto genera un tramo (*span*) con `trace_id`, `span_id` y `parent_span_id` ([spans.jsonl](Evidencias/spans.jsonl)).
La prueba verifica que los 5 tramos de una solicitud (3 de servidor + 2 de cliente) forman **un único árbol** con una sola raíz.

Caso lento (`trace-lento-0002`, `security` con 180 ms simulados): el rastro señala el salto sin adivinar.

| Servicio | Tramo | Tipo | ms |
|---|---|---|---|
| gateway | `GET /api/reservations/{id}` | servidor (raíz) | 181.7 |
| gateway | `call reservations` | cliente | 181.7 |
| reservations | `GET /reservations/{id}` | servidor | 181.1 |
| reservations | `call security` | cliente | 181.1 |
| security | `GET /auth/validate` | servidor | 180.6 |

(Los milisegundos varían un poco en cada ejecución; el reparto no: casi todo el tiempo está en `security`.)

Caso de error (`trace-error-0003`): `security` responde 503, `reservations` 502 y el gateway 502. Filtrando
`trace_id == "trace-error-0003"` en [logs.jsonl](Evidencias/logs.jsonl) aparecen los 3 servicios con su `ERROR`, y la respuesta
al cliente incluye el mismo `traceId`.

## 4. Verificación

| Prueba (`lab/obs_test.go`) | Comprueba |
|---|---|
| `TestTraceIdPropagatesAcrossThreeServices` | el mismo `trace_id` en logs de los 3 servicios y árbol de 5 tramos |
| `TestSpansFormOneTreeWithW3CTraceparent` | propagación con `traceparent` y raíz única |
| `TestGeneratesTraceIdWhenMissingAndReturnsIt` | genera y devuelve el id si falta |
| `TestMetricsRateErrorsLatency` | contadores 200/502, histograma y `+Inf` |
| `TestTraceShowsTheSlowHop` | el tramo de `security` refleja los 150 ms inyectados |
| `TestWriteEvidence` | regenera `Evidencias/` (solo con `LAB_EVIDENCE=1`) |

Resultado de la última ejecución (2026-10-18): 6 pruebas aprobadas, 0 fallos, `go vet` limpio
([pruebas.jsonl](Evidencias/pruebas.jsonl)). Para repetir: `& '.\11-week\hu-status\Sesión 1\ejecutar.ps1'`.

Ejecución manual:

```powershell
cd '.\11-week\hu-status\Sesión 1\lab'; go run .   # imprime la URL del gateway
curl.exe -H "X-Correlation-Id: demo-1" "<gateway>/api/reservations/R-1?delay_ms=200"
curl.exe "<gateway>/metrics"
```

## 5. Servicio real instrumentado: `multi-tour-security`

Además del laboratorio, instrumenté el servicio real `security` (Go) en la rama local
`feat/observability-metrics-trace-s11` del repo `MultiTour/transversales/multi-tour-security`
(base `aafda9c`, **sin commit ni push**; el cambio está en el árbol de trabajo y en
[security-real-cambios.patch](Evidencias/security-real-cambios.patch)).

| Pilar | Cambio en `security` |
|---|---|
| Registros | cada petición escribe una línea `request completed` con `traceId`, `method`, `route`, `status` y `durationMs`, además de la línea `request` que ya existía |
| Métricas | `GET /metrics` (texto Prometheus, sin token, no enrutado por el gateway): `http_requests_total` y `http_request_duration_seconds` por método, ruta registrada y estado; el id del path nunca es etiqueta y el scrape no se cuenta a sí mismo |
| Rastreo | sin `X-Correlation-Id` válido, el servicio se une al trace de un `traceparent` W3C válido (el `X-Correlation-Id` sigue teniendo prioridad, contrato intacto); uno malformado se ignora |
| Contrato | `/metrics` añadido a `openapi/openapi.yaml` y a la prueba de contrato que exige producir cada respuesta |

Pruebas: 7 nuevas (`observability_test.go`) más la de contrato; la suite completa del repo pasa, 0 fallos
([security-real-pruebas.jsonl](Evidencias/security-real-pruebas.jsonl)). Tamaño: unas 160 líneas de código
más 117 de pruebas, dentro del límite de 400 por PR.

Pendiente de este cambio (no hecho): HU y spec que lo respalden, commit, PR a `develop`, y reflejar `/metrics`
en el contrato de diseño de `multi-tour-docs`. No hay colector de trazas: el servicio propaga y registra el
`trace_id`, no exporta tramos.

## 6. Relación con el producto (verificada en el código local, 2026-10-18)

| Servicio real | Correlación | Logs JSON | `/metrics` | Trazas |
|---|---|---|---|---|
| security (Go) | `X-Correlation-Id` → `traceId`, o `traceparent` | sí, con `traceId` | sí, tras el cambio de la sección 5 (sin commit) | propaga, no exporta tramos |
| identity-audit-api | `CorrelationIdFilter` | sí (`logstash`, id en MDC) | no encontrado | no |
| commercial-reservation-api | `CorrelationFilter` | no verificado | no encontrado | no |
| worker-runtime | `correlationId` | sí (slog JSON) | no encontrado | no |
| api-gateway (NGINX) | sí: reutiliza `X-Correlation-Id` válido o usa `$request_id`, lo reenvía (`proxy_set_header`) y lo devuelve; el 404 incluye `traceId` | no verificado | no encontrado | no |

Lo que falta para llevar esto al producto, fuera de lo autorizado (solo se tocó `security`):
`/metrics` en los demás servicios, propagar el id también en los logs de commercial-reservation y un colector de trazas (la docs sugiere OpenTelemetry
pero no fija el backend). Cada cambio debe entrar por su HU y su spec.

## 7. Limitaciones

- Los tramos se guardan en memoria y se vuelcan a JSONL; no hay exportador OTLP ni Jaeger.
- Los servicios son simulados; los tiempos no representan al producto.
- No se definen SLO ni alertas (sesión 2).
