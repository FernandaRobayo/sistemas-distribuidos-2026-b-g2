# CP9 - Incident drill and blameless postmortem

Journey: inactivate a catalog service (HU-COM-001). The hop I marked in CP1 and instrumented in CP3 is
`worker-event-relay` to `identity-audit-api` (hop 6). Everything below uses the files of CP1 to CP8.

## Scenario

For 40 minutes, `identity-audit-api` answers in 3 seconds for 25 % of the requests of the relay.
The relay client has a timeout of 3 s (`relay.go`), so those deliveries end as `outcome="timeout"`.
The normal volume is about 100 inactivations a month, too small to see an incident in 40 minutes.
To make the drill measurable I assume a clean-up burst: 60 inactivations in the 40 minutes, so 60
deliveries to identity-audit, and 15 of them (25 %) hit the slow answer. This burst is an assumption.

## Trace of one slow request

It is the request of `02-log-contract.md`, same `trace_id`. The synchronous part is not slowed.

```text
trace_id = 4bf92f3577b34da6a3ce929d0e0e4736
POST /api/v1/catalog/services/{serviceId}/inactivate   (api-gateway, root)             66 ms
  POST /catalog/services/{serviceId}/inactivate        (commercial-reservation-api)    51 ms
    db.transaction inactivate + outbox insert          (commercial-reservation-api)    44 ms
--- asynchronous boundary ---
relay.poll outbox                                      (worker-event-relay)            12 ms
  deliver CatalogServiceInactivated -> identity-audit  (worker-event-relay)          3004 ms  timeout
  deliver CatalogServiceInactivated -> cash-reporting  (worker-event-relay)            21 ms
```

## Four log lines of that trace (CP2 format)

```json
{"timestamp":"2026-10-19T14:02:16.210Z","level":"INFO","service":"worker-event-relay","version":"0.1.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"c3d4e5f607182930","correlation_id":"4bf92f3577b34da6a3ce929d0e0e4736","event":"outbox.event.read","message":"event read from the internal outbox, trace restored from correlationId","duration_ms":12,"tenant_id":"0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30","outbox_event_id":"9c1d7a52-48be-4f0a-b3c6-6e2d1f9a8b11","event_type":"CatalogServiceInactivated"}
{"timestamp":"2026-10-19T14:02:19.231Z","level":"ERROR","service":"worker-event-relay","version":"0.1.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"d4e5f60718293a4b","correlation_id":"4bf92f3577b34da6a3ce929d0e0e4736","event":"event.delivery.timeout","message":"identity-audit did not answer in time, retry planned","duration_ms":3004,"tenant_id":"0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30","outbox_event_id":"9c1d7a52-48be-4f0a-b3c6-6e2d1f9a8b11","event_type":"CatalogServiceInactivated","target_service":"identity-audit"}
{"timestamp":"2026-10-19T14:02:19.240Z","level":"WARN","service":"worker-event-relay","version":"0.1.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"d4e5f60718293a4b","correlation_id":"4bf92f3577b34da6a3ce929d0e0e4736","event":"event.delivery.retry.scheduled","message":"event stays in the outbox and is retried with backoff","duration_ms":0,"tenant_id":"0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30","outbox_event_id":"9c1d7a52-48be-4f0a-b3c6-6e2d1f9a8b11","event_type":"CatalogServiceInactivated","target_service":"identity-audit"}
{"timestamp":"2026-10-19T14:02:30.412Z","level":"INFO","service":"worker-event-relay","version":"0.1.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"f60718293a4b5c6d","correlation_id":"4bf92f3577b34da6a3ce929d0e0e4736","event":"event.delivered","message":"delivery to identity-audit: success on the second attempt","duration_ms":41,"tenant_id":"0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30","outbox_event_id":"9c1d7a52-48be-4f0a-b3c6-6e2d1f9a8b11","event_type":"CatalogServiceInactivated","target_service":"identity-audit","http_status":202}
```

## Values the SLIs reach

| SLI | Value in the 40 minutes | Why |
|---|---|---|
| SLO-1 availability (gateway catalog routes) | 100 % | Every request answers 200; 5xx = 0 |
| SLO-2 latency (3 s or less) | 100 % | The slow call is asynchronous, the portal never waits for it |
| SLO-3 freshness (lag 60 s or less) | about 100 % | A timed-out event waits one backoff and succeeds on the second try; lag stays far below 60 s |
| `relay_deliveries_total{outcome="timeout"}` ratio | 25 % (15 of 60 first attempts) | This is the only metric that shows the incident |

## Which alert fires and which runbook step helps

- No alert fires. `CatalogAvailabilityFastBurn` needs more than 14.4 % of 5xx and the real value is 0 %.
  `CatalogAvailabilitySlowBurn` needs more than 6 %. The budget spent in the 40 minutes is 0 minutes.
- So the drill shows a gap: my alerts watch errors at the gateway, not the delivery to the consumers.
- Runbook `07-runbook.md`: section 2 helps, because the `trace_id` query shows the `ERROR` line of the
  relay. But none of the three mitigations applies, they are written for 5xx on the catalog routes.
  The step that stops the bleeding is outside the runbook: ask the owner of `identity-audit-api` to fix
  the slow answer. Meanwhile nothing is lost, the outbox keeps the event and the relay retries it.

## Blameless postmortem

**Timeline (drill, minutes from the start)**

| Minute | What happens |
|---|---|
| 0 | `identity-audit-api` starts answering in 3 s for 25 % of requests |
| 1 | First deliveries end as `event.delivery.timeout`; the portal still shows 200 |
| 5 | The timeout ratio is already 25 % in `relay_deliveries_total`; nobody is paged |
| 25 | Assumed in the drill: the owner looks at the relay metric and sees the timeouts |
| 40 | `identity-audit-api` is back to normal; the retried events are delivered |

**Impact:** 0 failed or slow requests for users; 15 deliveries timed out on the first attempt and all
arrived on retry; 0 minutes of error budget spent in SLO-1, SLO-2 and SLO-3.

**Root cause:** the consumer answered in 3 s, equal to the 3 s timeout of the relay, so the delivery
failed and had to be retried.

**Contributing factors**
- No alert on delivery timeouts; only the availability SLO has alerts (CP7).
- The runbook covers 5xx on the gateway, not a slow consumer.
- `relay_outbox_lag_seconds` does not exist yet, so the freshness SLO cannot be measured (CP6).
- No circuit breaker: ADR-004 D10 does not adopt one, the relay only has a timeout and retries.

**Action items**

1. As the owner of D-02, I want an alert on relay delivery timeouts, so that I learn about a slow
   consumer before freshness suffers.
   - Given 25 % of deliveries to identity-audit time out for 5 minutes, when the rule is tested with
     `promtool test rules`, then the alert fires.
   - Given 2 % of deliveries time out, then it stays inactive.
2. As the person on call, I want a section in `07-runbook.md` for a slow consumer, so that I know what
   to check and whom to call.
   - Given the symptom of the relay timeouts, when I follow the section, then it gives the PromQL, the
     `trace_id` log query and the owner of the consumer to escalate to.
   - Given a teammate who did not write it, when they run it as a table-top drill, then they finish in 10 minutes.
3. As the team, I want `relay_outbox_lag_seconds` implemented in the relay, so that SLO-3 can be measured.
   - Given an unread event older than 60 s, when `/metrics` is requested, then the value is 60 or more.
   - Given no pending events, then the value is 0; both cases are covered by a test in `relay_test.go`.

## Limits

- The 60-inactivation burst, the 25 minute detection and the second-attempt success are assumptions of the drill.
- The timeout ratio and the proposed alert are not implemented; the project has no Prometheus yet.
