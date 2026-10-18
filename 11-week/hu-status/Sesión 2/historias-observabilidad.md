# Historias de observabilidad

División de lo planificado en [README](README.md) en historias con criterios Given/When/Then comprobables.
Son **propuestas**: aún no tienen HU, spec ni dueño aprobados (la metodología del curso exige spec aprobada antes del
primer commit `feat/`). Los identificadores `OBS-xx` son provisionales; no son HU del tablero.

Orden recomendado: OBS-01 → OBS-02 → OBS-03 → OBS-04 → OBS-06; OBS-05 es independiente; OBS-07 al final.

---

### OBS-01 · Cubo de 3 s en el histograma de latencia

Como responsable de operación quiero un cubo `le="3"` en `http_request_duration_seconds` para medir SLO-2 sin interpolar.

- **AC-01.1** Given el servicio en marcha, when se hace una petición y se lee `/metrics`, then el histograma incluye `le="3"` además de los cubos existentes.
- **AC-01.2** Given una petición de 3,5 s simulada, when se lee `/metrics`, then no cuenta en `le="3"` pero sí en `le="5"` y en `+Inf`.
- **AC-01.3** Given la suite del servicio, when se ejecuta `go test ./...`, then pasa, incluida la prueba de contrato.

### OBS-02 · Métricas RED en los servicios de los flujos principales

Como equipo queremos `/metrics` en las APIs de identidad-auditoría y de reservas comerciales, además de `security`, para cubrir los flujos principales.

- **AC-02.1** Given cada API, when se pide `GET /metrics` sin token desde la red interna, then responde 200 en texto Prometheus con `http_requests_total` y el histograma.
- **AC-02.2** Given una ruta con un identificador en el path, when se consulta `/metrics`, then la etiqueta `route` lleva la plantilla y nunca el identificador.
- **AC-02.3** Given el gateway, when se prueba su configuración, then `/metrics` **no** es accesible desde fuera (404 o 403).

### OBS-03 · SLI y recording rules de disponibilidad y latencia

Como responsable quiero reglas que calculen SLO-1 y SLO-2 para ver cuánto presupuesto queda.

- **AC-03.1** Given el archivo de reglas, when se valida con `promtool check rules`, then no devuelve errores.
- **AC-03.2** Given una serie sintética con 10 % de 5xx, when se evalúa `service:http_5xx_ratio:rate5m`, then vale 0,10 ± 0,001 (prueba unitaria de `promtool test rules`).
- **AC-03.3** Given una serie sintética con 4xx solamente, when se evalúa la regla, then la tasa 5xx es 0.

### OBS-04 · Alerta `SloAvailabilityBurnRate` con dueño y runbook

Como persona de guardia quiero una alerta por síntoma con trigger, severidad, dueño y runbook.

- **AC-04.1** Given 40 % de 5xx durante 10 min con tráfico, when se evalúa la regla, then la alerta pasa a `firing` tras 5 min (prueba unitaria de `promtool`).
- **AC-04.2** Given 40 % de 5xx durante 2 min, when se evalúa, then **no** dispara.
- **AC-04.3** Given 100 % de 5xx pero con menos de 0,02 peticiones/s, when se evalúa, then **no** dispara (tráfico mínimo).
- **AC-04.4** Given la alerta, when se revisan sus etiquetas y anotaciones, then lleva `severity`, `owner` y `runbook_url`, y la ruta del runbook existe.

### OBS-05 · Métrica de frescura del outbox

Como equipo quiero medir cuánto tarda un evento en llegar a todos sus consumidores para evaluar SLO-3.

- **AC-05.1** Given un evento creado en un outbox y entregado por el relay, when se lee la métrica, then `outbox_event_publish_delay_seconds` registra la diferencia entre creación y publicación.
- **AC-05.2** Given un consumidor que falla, when el relay reintenta, then `outbox_pending_oldest_age_seconds` crece y el evento no cuenta como publicado hasta que todos aceptan (RN-WRK7-02).
- **AC-05.3** Given un evento fallido tras 20 intentos, when se lee la métrica, then queda contado como tardío y se incrementa un contador de eventos fallidos.
- **Pendiente de decisión:** si la métrica vive en el relay o en cada API (README, decisión 3).

### OBS-06 · Runbook validado con un ejercicio de mesa

Como equipo quiero comprobar que el runbook de `security` funciona antes de necesitarlo.

- **AC-06.1** Given un entorno local con `security` y `postgres`, when se detiene `postgres`, then los pasos de las secciones 2 y 5.2 del runbook lo diagnostican y lo recuperan sin información adicional.
- **AC-06.2** Given el runbook, when se recorre con una llave JWT ausente, then la sección 5.1 identifica la causa desde los logs.
- **AC-06.3** Given el ejercicio, when termina, then se registran duración, pasos que fallaron o faltaban y las correcciones al runbook.

### OBS-07 · Informe semanal de consumo de presupuesto

Como equipo queremos revisar cada semana cuánto presupuesto de error se consumió para aplicar la política.

- **AC-07.1** Given las métricas de la ventana, when se genera el informe, then muestra el porcentaje consumido de SLO-1, SLO-2 y SLO-3 con su ventana.
- **AC-07.2** Given un consumo ≥ 100 %, when se genera el informe, then marca "congelación" según la política del README sección 2.
- **AC-07.3** Given el informe, when se publica en el `hu-status`, then enlaza la evidencia de donde salieron las cifras.

---

## Trazabilidad

| Historia | SLO | Requisito del PDR v1.9 (sección 17) |
|---|---|---|
| OBS-01, OBS-02, OBS-03 | SLO-1, SLO-2 | Disponibilidad ≥ 95 %; Rendimiento p95 ≤ 3 s |
| OBS-04, OBS-06 | SLO-1 | Disponibilidad; Observabilidad; Respaldo y recuperación (RTO 8 h) |
| OBS-05 | SLO-3 | Sin requisito en el PDR: objetivo propuesto |
| OBS-07 | todos | Política de presupuesto de error (propuesta) |
