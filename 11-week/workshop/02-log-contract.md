# CP2 - Structured log contract

Journey: inactivate a catalog service (HU-COM-001). Services in the contract: `api-gateway`,
`commercial-reservation-api`, `worker-event-relay`, `identity-audit-api` and `cash-reporting`.
One JSON object per line, written to standard output, same fields in every service.

Base: the required fields of `13-operations/observability.md` (timestamp, level, service, correlationId,
message) plus the fields asked by this workshop. The docs use `correlationId`; the logs use snake_case, so
`correlation_id` is the same value as the `X-Correlation-Id` header.

## Mandatory fields

| Field | Type | Required | Example | Why it exists |
|---|---|---|---|---|
| `timestamp` | string, ISO-8601 UTC with ms | yes | `2026-10-19T14:02:11.482Z` | Order events across services |
| `level` | string | yes | `ERROR` | Filter by severity |
| `service` | string | yes | `worker-event-relay` | Know which service wrote the line |
| `version` | string | yes | `0.1.0` | Link a failure to a release |
| `environment` | string | yes | `qa` | Do not mix dev, qa and production |
| `trace_id` | 32 hex | yes | `4bf92f3577b34da6a3ce929d0e0e4736` | Join all lines of one request |
| `span_id` | 16 hex | yes | `00f067aa0ba902b7` | Find the exact step inside the trace |
| `correlation_id` | string | yes | `4bf92f3577b34da6a3ce929d0e0e4736` | Value of `X-Correlation-Id`. In CP1 I save the `trace_id` here, so both are equal |
| `event` | string, dotted name | yes | `event.delivery.timeout` | Stable name to count and alert on |
| `message` | string | yes | `identity-audit did not answer` | Human reading, no sensitive data |
| `duration_ms` | number | yes | `3004` | Latency of the step; `0` if not a timed step |

## Domain fields

| Field | Type | Required | Example | Why it exists |
|---|---|---|---|---|
| `tenant_id` | UUID | yes | `0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30` | Every query is per tenant; find the affected tenant fast |
| `catalog_service_id` | UUID | optional, only while the request is handled | `3f2a1c9e-7b64-4d0e-9a51-0c6e8d2b4f10` | The `serviceId` of the item being inactivated |
| `outbox_event_id` | UUID | optional, once the event exists | `9c1d7a52-48be-4f0a-b3c6-6e2d1f9a8b11` | The `eventId` of the `outbox_event` row; also the `Idempotency-Key` |
| `event_type` | string | optional, once the event exists | `CatalogServiceInactivated` | Event of the catalog that travels through job 7 |
| `target_service` | string | optional, only on deliveries | `identity-audit` | Consumer that receives the event |
| `http_status` | number | optional, only on HTTP calls | `422` | Result of the call, for error rate |

## Never log

| Data | Why | How it is handled |
|---|---|---|
| Passwords, JWT, `Authorization: Bearer` and `SERVICE_TOKEN` | Account takeover (`security-rules.md`: never log passwords or tokens) | Never written; log only `auth.present: true` |
| Titular and companion identity document | Personal data of customers | Never written; use `customer_id` if needed |
| E-mail and phone of customers | Personal data | Masked: `u***@example.com`, last 2 digits of the phone |
| Medical, emergency and consent data | Sensitive data; its access is audited by `SensitiveDataAccessed` | Never written |
| Card numbers and payment proofs | Payment data | Never written; only `payment_id` |
| Full request or response bodies | May carry any of the above | Log field names and counts, not bodies |

## Levels in my project

| Level | When | Example |
|---|---|---|
| `ERROR` | A step failed and needs attention | `event.delivery.timeout`: identity-audit did not answer in 3 s |
| `WARN` | Abnormal but the system keeps working | `event.delivery.rejected`: cash-reporting refused the event by a business rule, so it is not retried |
| `INFO` | Normal business step | `catalog.service.inactivated` |
| `DEBUG` | Detail for development, off in production | Headers received at the gateway, without tokens |

## Seven lines of one request

Request: the administrator inactivates the catalog item; the API answers 200, then the relay delivers the
event. All lines share the same `trace_id`. The values are examples written for this exercise, not captures.

```json
{"timestamp":"2026-10-19T14:02:11.482Z","level":"INFO","service":"api-gateway","version":"0.1.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"a1b2c3d4e5f60718","correlation_id":"4bf92f3577b34da6a3ce929d0e0e4736","event":"request.received","message":"POST inactivate forwarded to commercial-reservation-api","duration_ms":0,"tenant_id":"0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30","catalog_service_id":"3f2a1c9e-7b64-4d0e-9a51-0c6e8d2b4f10"}
{"timestamp":"2026-10-19T14:02:11.497Z","level":"INFO","service":"commercial-reservation-api","version":"0.1.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"00f067aa0ba902b7","correlation_id":"4bf92f3577b34da6a3ce929d0e0e4736","event":"catalog.service.inactivate.requested","message":"inactivation requested by the tenant administrator","duration_ms":0,"tenant_id":"0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30","catalog_service_id":"3f2a1c9e-7b64-4d0e-9a51-0c6e8d2b4f10"}
{"timestamp":"2026-10-19T14:02:11.541Z","level":"INFO","service":"commercial-reservation-api","version":"0.1.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"b7ad6b7169203331","correlation_id":"4bf92f3577b34da6a3ce929d0e0e4736","event":"catalog.service.inactivated","message":"item inactive and outbox row written in one transaction","duration_ms":44,"tenant_id":"0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30","catalog_service_id":"3f2a1c9e-7b64-4d0e-9a51-0c6e8d2b4f10","outbox_event_id":"9c1d7a52-48be-4f0a-b3c6-6e2d1f9a8b11","event_type":"CatalogServiceInactivated"}
{"timestamp":"2026-10-19T14:02:11.548Z","level":"INFO","service":"api-gateway","version":"0.1.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"a1b2c3d4e5f60718","correlation_id":"4bf92f3577b34da6a3ce929d0e0e4736","event":"request.completed","message":"answered 200 to the portal","duration_ms":66,"tenant_id":"0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30","http_status":200}
{"timestamp":"2026-10-19T14:02:16.210Z","level":"INFO","service":"worker-event-relay","version":"0.1.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"c3d4e5f607182930","correlation_id":"4bf92f3577b34da6a3ce929d0e0e4736","event":"outbox.event.read","message":"event read from the internal outbox, trace restored from correlationId","duration_ms":12,"tenant_id":"0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30","outbox_event_id":"9c1d7a52-48be-4f0a-b3c6-6e2d1f9a8b11","event_type":"CatalogServiceInactivated"}
{"timestamp":"2026-10-19T14:02:19.231Z","level":"ERROR","service":"worker-event-relay","version":"0.1.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"d4e5f60718293a4b","correlation_id":"4bf92f3577b34da6a3ce929d0e0e4736","event":"event.delivery.timeout","message":"identity-audit did not answer in time, retry planned","duration_ms":3004,"tenant_id":"0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30","outbox_event_id":"9c1d7a52-48be-4f0a-b3c6-6e2d1f9a8b11","event_type":"CatalogServiceInactivated","target_service":"identity-audit"}
{"timestamp":"2026-10-19T14:02:19.260Z","level":"WARN","service":"worker-event-relay","version":"0.1.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"e5f60718293a4b5c","correlation_id":"4bf92f3577b34da6a3ce929d0e0e4736","event":"event.delivery.rejected","message":"cash-reporting refused the event: catalog item is not known in the cash view","duration_ms":21,"tenant_id":"0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30","outbox_event_id":"9c1d7a52-48be-4f0a-b3c6-6e2d1f9a8b11","event_type":"CatalogServiceInactivated","target_service":"cash-reporting","http_status":422}
```

Filtering by `trace_id` tells the story: the administrator got a 200 in 66 ms (lines 1 to 4), but the event
did not reach the audit trail (line 6, timeout) and cash-reporting rejected it by a business rule (line 7,
422). The first answer was good while the follow-up work failed, which is the reason to trace across the
asynchronous boundary.
