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
2. The fake identity-audit server receives a `traceparent` with the same `trace_id`.
3. It also receives `Idempotency-Key` equal to the `eventId`.
4. The log line of the delivery carries that `trace_id`.
5. `/metrics` shows `relay_deliveries_total{target_service="identity-audit",outcome="success"} 1`.

## Limits

- The receiving route of identity-audit (`/internal/events`) is not defined in `07-api` yet; the test
  uses it as an assumption.
- The relay has no inbound HTTP in the docs. `TraceMiddleware` is an exercise of this workshop.
