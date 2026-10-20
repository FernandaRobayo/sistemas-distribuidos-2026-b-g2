# CP4 - Golden signals and metric catalog

Journey: inactivate a catalog service (HU-COM-001). One table per service of the journey:
`api-gateway`, `commercial-reservation-api`, `worker-event-relay`, `identity-audit-api`
and `cash-reporting`. Names follow Prometheus: snake_case, unit suffix (`_seconds`),
`_total` for counters.

Status: the relay metrics (`relay_*`) exist in `03-instrumentation/worker-event-relay/metrics.go`.
All the others are proposed. The generic names `http_requests_total`,
`http_request_duration_seconds` and `http_requests_in_flight` come from
`13-operations/observability.md`.

## api-gateway

| Signal | Metric | Type | Labels | PromQL |
|---|---|---|---|---|
| Latency | `http_request_duration_seconds` | histogram | `route`, `method` | `histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket{job="api-gateway"}[5m])))` |
| Traffic | `http_requests_total` | counter | `route`, `method`, `status` | `sum(rate(http_requests_total{job="api-gateway"}[5m]))` |
| Errors | `http_requests_total` | counter | same | `sum(rate(http_requests_total{job="api-gateway",status=~"5.."}[5m])) / sum(rate(http_requests_total{job="api-gateway"}[5m]))` |
| Saturation | `http_requests_in_flight` | gauge | none | `max_over_time(http_requests_in_flight{job="api-gateway"}[5m])` |

## commercial-reservation-api

| Signal | Metric | Type | Labels | PromQL |
|---|---|---|---|---|
| Latency | `http_request_duration_seconds` | histogram | `route`, `method` | `histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket{job="commercial-reservation-api",route="/catalog/services/{serviceId}/inactivate"}[5m])))` |
| Traffic | `catalog_inactivations_total` | counter | `outcome` | `sum(rate(catalog_inactivations_total[5m]))` |
| Errors | `catalog_inactivations_total` | counter | `outcome` | `sum(rate(catalog_inactivations_total{outcome="error"}[5m])) / sum(rate(catalog_inactivations_total[5m]))` |
| Saturation | `outbox_pending_events` | gauge | none | `max_over_time(outbox_pending_events[5m])` (rows not yet read by the relay) |

## worker-event-relay

| Signal | Metric | Type | Labels | PromQL |
|---|---|---|---|---|
| Latency | `relay_delivery_duration_seconds` | histogram | `target_service` | `histogram_quantile(0.95, sum by (le) (rate(relay_delivery_duration_seconds_bucket{target_service="identity-audit"}[5m])))` |
| Traffic | `relay_deliveries_total` | counter | `target_service`, `outcome` | `sum by (target_service) (rate(relay_deliveries_total[5m]))` |
| Errors | `relay_deliveries_total` | counter | same | `sum(rate(relay_deliveries_total{outcome!="success"}[5m])) / sum(rate(relay_deliveries_total[5m]))` |
| Saturation | `relay_outbox_lag_seconds` (proposed) | gauge | none | `max_over_time(relay_outbox_lag_seconds[5m])` (age of the oldest unread event) |

## identity-audit-api

| Signal | Metric | Type | Labels | PromQL |
|---|---|---|---|---|
| Latency | `http_request_duration_seconds` | histogram | `route`, `method` | `histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket{job="identity-audit-api"}[5m])))` |
| Traffic | `events_received_total` | counter | `event_type`, `outcome` | `sum(rate(events_received_total{job="identity-audit-api"}[5m]))` |
| Errors | `events_received_total` | counter | `event_type`, `outcome` | `sum(rate(events_received_total{job="identity-audit-api",outcome=~"rejected|error"}[5m])) / sum(rate(events_received_total{job="identity-audit-api"}[5m]))` |
| Saturation | `http_requests_in_flight` | gauge | none | `max_over_time(http_requests_in_flight{job="identity-audit-api"}[5m])` |

## cash-reporting

The docs keep cash-reporting as portal only for now (its API and database are deferred), so this table is a design for when it consumes events.

| Signal | Metric | Type | Labels | PromQL |
|---|---|---|---|---|
| Latency | `http_request_duration_seconds` | histogram | `route`, `method` | `histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket{job="cash-reporting"}[5m])))` |
| Traffic | `events_received_total` | counter | `event_type`, `outcome` | `sum(rate(events_received_total{job="cash-reporting"}[5m]))` |
| Errors | `events_received_total` | counter | `event_type`, `outcome` | `sum(rate(events_received_total{job="cash-reporting",outcome=~"rejected|error"}[5m])) / sum(rate(events_received_total{job="cash-reporting"}[5m]))` |
| Saturation | `http_requests_in_flight` | gauge | none | `max_over_time(http_requests_in_flight{job="cash-reporting"}[5m])` |

## Cardinality of the labels

| Label | Values | Estimate | Note |
|---|---|---|---|
| `method` | GET, POST, PATCH | 3 | Closed set |
| `route` | route template, not the raw URL | about 25 | Example `/catalog/services/{serviceId}/inactivate` |
| `status` | HTTP codes used by the contract | about 8 | 200, 400, 401, 403, 404, 422, 500, 502 |
| `outcome` in `catalog_inactivations_total` | success, already_inactive, rejected, error | 4 | `already_inactive` is the repeated call that answers 200 and emits nothing (contract); `rejected` is 403, 404 or 422; `error` is 5xx |
| `outcome` in `relay_deliveries_total` | success, rejected, timeout, error | 4 | Same words as the logs of CP2 and as `metrics.go` |
| `outcome` in `events_received_total` | success, rejected, error | 3 | `rejected` is a business rule refusal (422) |
| `target_service` | identity-audit, cash-reporting | 2 | Consumers of job 7 |
| `event_type` | events of `event-catalog.md` | about 45 | Closed list |

Worst case is `route` x `method` x `status`, about 25 x 3 x 8 = 600 series per service. That is small.

## Forbidden labels

| Forbidden | Why | What replaces it |
|---|---|---|
| `tenant_id`, `catalog_service_id`, `outbox_event_id`, `trace_id` | Unbounded: grows with every tenant, item or request | They stay in the logs of CP2; search by `trace_id` there |
| Raw URL or query string | One series per identifier | The route template |
| E-mail, customer name, document | Personal data and unbounded | Nothing; never in metrics |

## Histogram buckets

The non-functional requirements ask for 95th percentile of 3 seconds or less for the evaluated
operations (`04-requirements/non-functional.md`; ADR-004 D8). The delivery timeout of the relay is also 3 s.

- HTTP: `0.05, 0.1, 0.25, 0.5, 1, 2, 3, 5`. An administrator clicking "Inactivate" expects an answer
  below 1 s, and 3 s is the limit of the requirement, so there are buckets around both.
- Relay delivery: `0.1, 0.5, 1, 3, 5`, as in `metrics.go`. The 3 s bucket shows deliveries that
  reach the timeout; the 5 s bucket catches the slow ones.
