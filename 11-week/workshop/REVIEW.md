# Workshop 11 review - 2026-11-05

## Result

CP0-CP10 artifacts are present. The Go exercise and the two Prometheus rules execute locally.
The SLIs, production dashboards, asynchronous integration and incident timelines remain proposals
or table-top simulations as declared in their source documents.

## Corrections

- Traceparent now rejects malformed flags and preserves the incoming sampling flags in child context.
  The outbound delivery header uses the same span ID as its JSON log.
- The middleware returns X-Correlation-Id and logs the status actually committed to the response.
- The histogram comment now distinguishes the 3 s latency target from the 5 s client timeout.
- SLO-1 handles an absent 5xx series when observed traffic exists. Zero traffic remains undefined.
- SLO-3 measures time, so its 432-minute budget cannot be expressed as two late deliveries.
  A missing gauge is unknown; an empty queue must explicitly emit zero.
- The runbook searches gateway logs by correlation_id separately from instrumented trace_id.
- CP2 and CP9 no longer prescribe automatic retries for a 422 response.
- Added executable fast-burn, slow-burn, healthy, low-traffic and zero-traffic alert scenarios.

## Validation

Executed from `03-instrumentation/worker-event-relay` with Go 1.26.4:

```powershell
gofmt -l .
go vet ./...
go test -count=1 -v ./...
go run ./cmd/relay -once
```

Result: formatting clean, vet successful, four top-level tests passed (plus five HTTP-status
subtests), one successful delivery with JSON log and Prometheus counter/histogram.

Executed with the workshop folder mounted at `/work` in `prom/prometheus:v2.55.1`:

```text
promtool check rules 06-alerts.yml
SUCCESS: 2 rules found
promtool test rules 06-alerts.test.yml
SUCCESS
```

Reproduce from the repository root (Docker must be running):

```powershell
$workshopPath = (Resolve-Path '11-week/workshop').Path
docker run --rm --entrypoint promtool --mount "type=bind,source=$workshopPath,target=/work,readonly" -w /work prom/prometheus:v2.55.1 check rules 06-alerts.yml
docker run --rm --entrypoint promtool --mount "type=bind,source=$workshopPath,target=/work,readonly" -w /work prom/prometheus:v2.55.1 test rules 06-alerts.test.yml
```

## Alignment and remaining work

| Status | Rule / evidence | Assessment |
|---|---|---|
| CUMPLE | Anexo D, rule 8; Anexo J J.3 | Exercise sends HTTP; it does not access another domain's database |
| CUMPLE | Anexo D, rules 6-7 | Command uses a 5 s timeout; delivery occurs once, with no automatic retry of 4xx |
| CONFLICTO CON NORMA, corrected locally | Anexo D, rule 7; CP2 / CP9 | Previous text retried 422. The norm prevails: record and escalate a permanent rejection; reconcile the upstream ADR if it prescribes otherwise |
| NO APLICA | Anexo D, full worker structure | This isolated instrumentation exercise is not the production worker or its acceptance suite |
| ABIERTO | Anexo C 5.3.9; CP1 mapping proposal | An existing X-Correlation-Id must be preserved. Equality with trace_id is only an example assumption, not permission to overwrite it. Product integration needs separate persisted trace context when they differ |
| NO CUMPLE as a production delivery | Anexo D, rule 4 | Exercise has no SERVICE_TOKEN, outbox polling, bounded batch, retry scheduler or durable acknowledgements. These are required before integrating with the real worker |

The two rules cover availability only. Freshness metric/exporter and alerting, consumer runbook,
and live incident validation remain the explicitly pending work of CP9. No live incident was induced.
Manual propagation is limited to version 00 traceparent; it does not export OpenTelemetry spans.
Reference used for header review: [W3C Trace Context](https://www.w3.org/TR/trace-context/).
