# How to run: worker-event-relay instrumentation

Module `worker-event-relay` (Go, standard library only). It instruments job 7 of the journey
"inactivate a catalog service": it restores the trace from `correlationId`, sends `traceparent`
to identity-audit, writes the CP2 log lines and counts the deliveries.

## Requirements

- Go 1.22 or newer (checked here with go1.26.4 on Windows).

## Install, check and test

```powershell
cd 11-week\workshop\03-instrumentation\worker-event-relay
gofmt -l .
go vet ./...
go test -count=1 -v ./...
```

## Output on my machine (2026-10-20)

```text
vet ok
=== RUN   TestTraceIdReceivedEqualsTraceIdSentDownstream
--- PASS: TestTraceIdReceivedEqualsTraceIdSentDownstream (0.00s)
PASS
ok  	worker-event-relay	0.031s
```

`gofmt -l .` prints nothing when the files are formatted.

## What the test proves

1. The event carries `correlationId` = `4bf92f3577b34da6a3ce929d0e0e4736` (the saved `trace_id`).
2. The fake identity-audit server receives a `traceparent` with the same `trace_id`, on the ADR-004 D4 route.
3. It also receives `Idempotency-Key` equal to the `eventId`.
4. The log line of the delivery carries that `trace_id`.
5. `/metrics` shows `relay_deliveries_total{target_service="identity-audit",outcome="success"} 1`.

`TestDeliveryHTTPResponses` also checks that only `200` and `201` count as accepted deliveries.
Responses `202`, `422` and `503` must return an error, write a rejection log and increment the rejected
delivery counter. This keeps an HTTP rejection from looking like success to the caller. The exercise
still delivers only once: recording outbox attempts and scheduling retries remain outside this module.

## Run it and see the logs and metrics

`cmd/relay` delivers one `CatalogServiceInactivated` event to a stand-in of identity-audit, prints
the log line of the CP2 contract and serves `/health` and `/metrics` on port 8087.

```powershell
go run ./cmd/relay -once
```

Output (the `-once` flag prints the metrics and exits):

```text
{"correlation_id":"4bf92f3577b34da6a3ce929d0e0e4736","duration_ms":1,"environment":"qa","event":"event.delivered","event_type":"CatalogServiceInactivated","level":"INFO","message":"delivery to identity-audit: success","outbox_event_id":"9c1d7a52-48be-4f0a-b3c6-6e2d1f9a8b11","service":"worker-event-relay","span_id":"1f0f1309aba64938","target_service":"identity-audit","tenant_id":"0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30","timestamp":"2026-10-20T11:59:58.403Z","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","version":"0.1.0"}
# TYPE relay_deliveries_total counter
relay_deliveries_total{target_service="identity-audit",outcome="success"} 1
# TYPE relay_delivery_duration_seconds histogram
relay_delivery_duration_seconds_bucket{target_service="identity-audit",le="3"} 1
relay_delivery_duration_seconds_count{target_service="identity-audit"} 1
```

(The real output has one `_bucket` line per bucket; two are shown.) Without the flag the server stays up:

```powershell
go run ./cmd/relay
curl.exe -i -H "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01" http://localhost:8087/health
```

The response returns `Traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-<new span_id>-01`: same
`trace_id`, new `span_id`.

## Limits

- The delivery route follows ADR-004 D4 (`POST /api/v1/<domain>/internal/tenants/{tenantId}/events`, `201` the
  first time, `200` for a repeat). `identity-audit.yaml` does not publish it yet, and the `identity-audit`
  segment is an assumption. The test and `cmd/relay` use a local stand-in server that answers `201`.
- The client timeout is 5 s, the `HTTP_TIMEOUT` of ADR-004 D10. This module does not retry and does not call the
  `attempts` route (D4, route 4); that part is designed, not built.
- A real `multi-tour-worker-event-relay` already exists in the product repositories (`transversales/`). It has its
  own routing table, `SERVICE_TOKEN`, `HEALTH_ADDR` (`:8080`) and no `/metrics`, and it does not know
  `CatalogServiceInactivated`. This module is a separate exercise, it does not replace it, and the product
  repositories were not modified. Its `/health`, `/metrics`, `TraceMiddleware` and port 8087 are an exercise of this
  workshop; the real worker exposes only `/health`.
