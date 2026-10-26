# CP9 - Incident drill and blameless postmortem

Journey: inactivate a catalog service (HU-COM-001). Everything below uses the files of CP1 to CP8.
The drill has two parts because the question of the guide ("which alert fires first, at what minute, and
which runbook step stops the bleeding") has a different answer for each kind of fault:

- **Drill 1, slow consumer (asynchronous hop 6).** The hop I instrumented in CP3. No alert fires: it shows a gap.
- **Drill 2, bad promotion (synchronous hops 2 to 4).** The case that CP7 and CP8 were written for. An alert
  fires and a runbook step stops the bleeding.

Reference values from the docs: relay `HTTP_TIMEOUT` is 5 s and `HTTP_ATTEMPTS` is 3 (ADR-004 D10). When a
consumer does not accept an event, the relay calls route 4 (`POST .../internal/outbox/{eventId}/attempts`);
the owning API computes `nextAttemptAt` (the wait doubles from 5 s up to 15 min, 20 attempts, ADR-004 D4 and D10).
`relay.go` only does the delivery and the metrics; recording attempts is designed, not built.

## Drill 1 - slow consumer

### Scenario

For 40 minutes, `identity-audit-api` takes 6 seconds to answer for 25 % of the requests of the relay.
The relay client has a timeout of 5 s (`HTTP_TIMEOUT`), so those deliveries end as `outcome="timeout"`.
The normal volume is about 100 inactivations a month, too small to see an incident in 40 minutes.
To make the drill measurable I assume a clean-up burst: 60 inactivations in the 40 minutes, so 60
deliveries to identity-audit, and 15 of them (25 %) hit the slow answer. This burst is an assumption.

### Trace of one slow request

It is the request of `02-log-contract.md`, same `trace_id`. The synchronous part is not slowed. The
gateway writes only a log line, so the tree starts at the API.

```text
trace_id = 4bf92f3577b34da6a3ce929d0e0e4736
POST /catalog/services/{serviceId}/inactivate          (commercial-reservation-api)    51 ms
  db.transaction inactivate + outbox insert            (commercial-reservation-api)    44 ms
--- asynchronous boundary ---
relay.poll outbox                                      (worker-event-relay)            12 ms
  deliver CatalogServiceInactivated -> identity-audit  (worker-event-relay)          5004 ms  timeout
  deliver CatalogServiceInactivated -> cash-reporting  (worker-event-relay)            21 ms  rejected 422, attempt recorded
```

### Four log lines of that trace (CP2 format)

These lines are written for the exercise from the CP2 contract; they are not captures.

```json
{"timestamp":"2026-10-19T14:02:16.210Z","level":"INFO","service":"worker-event-relay","version":"0.1.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"c3d4e5f607182930","correlation_id":"4bf92f3577b34da6a3ce929d0e0e4736","event":"outbox.event.read","message":"event read from the internal outbox, trace restored from correlationId","duration_ms":12,"tenant_id":"0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30","outbox_event_id":"9c1d7a52-48be-4f0a-b3c6-6e2d1f9a8b11","event_type":"CatalogServiceInactivated"}
{"timestamp":"2026-10-19T14:02:21.231Z","level":"ERROR","service":"worker-event-relay","version":"0.1.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"d4e5f60718293a4b","correlation_id":"4bf92f3577b34da6a3ce929d0e0e4736","event":"event.delivery.timeout","message":"identity-audit did not answer in 5 s, attempt recorded","duration_ms":5004,"tenant_id":"0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30","outbox_event_id":"9c1d7a52-48be-4f0a-b3c6-6e2d1f9a8b11","event_type":"CatalogServiceInactivated","target_service":"identity-audit"}
{"timestamp":"2026-10-19T14:02:21.260Z","level":"WARN","service":"worker-event-relay","version":"0.1.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"d4e5f60718293a4b","correlation_id":"4bf92f3577b34da6a3ce929d0e0e4736","event":"outbox.attempt.recorded","message":"failed attempt sent to the owning API, which computes nextAttemptAt (5 s)","duration_ms":18,"tenant_id":"0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30","outbox_event_id":"9c1d7a52-48be-4f0a-b3c6-6e2d1f9a8b11","event_type":"CatalogServiceInactivated","target_service":"identity-audit"}
{"timestamp":"2026-10-19T14:02:32.412Z","level":"INFO","service":"worker-event-relay","version":"0.1.0","environment":"qa","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"f60718293a4b5c6d","correlation_id":"4bf92f3577b34da6a3ce929d0e0e4736","event":"event.delivered","message":"delivery to identity-audit: success on the second attempt","duration_ms":41,"tenant_id":"0b6f2c1e-5d3a-4e8b-9a47-2f1c8d6e7b30","outbox_event_id":"9c1d7a52-48be-4f0a-b3c6-6e2d1f9a8b11","event_type":"CatalogServiceInactivated","target_service":"identity-audit","http_status":201}
```

### Values the SLIs reach

| SLI | Value in the 40 minutes | Why |
|---|---|---|
| SLO-1 availability (gateway catalog routes) | 100 % | Every request answers 200; 5xx = 0 |
| SLO-2 latency (3 s or less) | 100 % | The slow call is asynchronous, the portal never waits for it |
| SLO-3 freshness (lag 60 s or less) | about 100 % | A timed-out event waits one backoff (5 s) and succeeds on the next run; the lag is about 20 s, far below 60 s |
| `relay_deliveries_total{outcome="timeout"}` ratio | 25 % (15 of 60 first attempts) | This is the only metric that shows the incident |

### Which alert fires and which runbook step helps

- No alert fires. `CatalogAvailabilityFastBurn` needs more than 14.4 % of 5xx and the real value is 0 %.
  `CatalogAvailabilitySlowBurn` needs more than 6 %. The budget spent in the 40 minutes is 0 minutes.
- ADR-004 D8 plans Grafana alerts for "an old pending outbox event" (older than 5 minutes, D10) and "any event
  in the failure destination". Neither would fire here either: each event is delivered in about 20 s. So the
  gap is real even with the planned alerts, and a rule on the timeout ratio of the relay would be new.
- Runbook `07-runbook.md`: section 2 helps, because the `trace_id` query shows the `ERROR` line of the
  relay. But none of the three mitigations applies, they are written for 5xx on the catalog routes.
  The step that stops the bleeding is outside the runbook: ask the owner of `identity-audit-api` to fix
  the slow answer. Meanwhile nothing is lost, the outbox keeps the event and the owning API schedules the retry.

## Drill 2 - bad promotion

### Scenario

At minute 0 a promotion puts a new image of `commercial-reservation-api` in `qa` with a broken query.
Every request to the catalog routes returns 500 until the rollback. Assumptions, all mine: traffic is steady at
the 2,000 requests a day of `05-slo.md` (about 83 an hour, 1.4 a minute); alert evaluation delays are ignored,
so the minutes are approximate; the responder follows `07-runbook.md`.

### When the alert fires

`CatalogAvailabilityFastBurn` needs the 1 h ratio of 5xx above 14.4 %, the 5 min ratio above 14.4 %, at
least 20 requests in the hour (always true here, there are about 83), and it must stay true for `for: 2m`.

- The 5 min ratio is 100 % from the first minute, so it is never the slow condition.
- The 1 h window holds about 83 requests. After t minutes of failures the 1 h ratio is about t / 60, which
  passes 14.4 % at t = 8.6, so at **minute 9** the alert goes pending.
- After the 2 minutes of `for`, it **fires at minute 11**.
- `CatalogAvailabilitySlowBurn` (6 % over 6 h and over 30 min, `for: 15m`) goes pending at about minute 22
  and fires at about minute 37, after the fast one. It stays active after the rollback because its windows
  still remember the failures.

### Runbook steps and recovery

| Minute | Event | Runbook step |
|---|---|---|
| 0 | Promotion; every catalog request returns 500 | - |
| 11 | `CatalogAvailabilityFastBurn` pages the first responder (Fernanda) | Section 1, symptoms |
| 13 | Section 2 shows 5xx on all routes and `/health` answering 200 | Section 2, confirm |
| 15 | Restart does not help, the new image is the problem | Mitigation 1 |
| 26 | 15 minutes without improvement: the Project Lead (Jhon) decides the rollback | Section 4, escalation |
| 30 | Rollback to the previous image; 5xx drops to 0 | **Mitigation 2, the step that stops the bleeding** |
| 45 | 5xx below 1 % for 15 minutes; `/health` answers 200 | Section 5, verify recovery |

The errors last 30 minutes, about 42 failed requests of the 600 that the monthly budget allows (1 % of
60,000), so 7 % of the budget, which is 30 of the 432 minutes. The policy of `05-slo.md` starts at 50 %,
so no level is reached. Mitigation 2 applies because the errors began right after a promotion, which is
exactly the "when" column of the runbook. The check of the last migration comes first.

## Blameless postmortem (Drill 1)

**INC-DRILL-01 - identity-audit answered slowly to the event relay**

**Key data (drill)**

| Item | Value |
|---|---|
| Start | Minute 0 of the drill |
| Resolution | Minute 40 |
| Total duration | 40 minutes |
| Severity | P3: no user impact, a secondary function is degraded, no business operation stops (`incident-management.md`) |
| Affected users | 0; 15 audit deliveries were late by about 20 s |

**Timeline (drill, minutes from the start)**

| Minute | What happens | Action taken |
|---|---|---|
| 0 | `identity-audit-api` starts answering in 6 s for 25 % of requests | - |
| 1 | First deliveries end as `event.delivery.timeout`; the portal still shows 200 | None, nothing pages |
| 5 | The timeout ratio is already 25 % in `relay_deliveries_total` | None, nobody looks at it |
| 25 | Assumed in the drill: the owner looks at the relay metric and sees the timeouts | The owner asks the identity-audit owner to check |
| 40 | `identity-audit-api` is back to normal | The retried events are delivered |

**Impact:** 0 failed or slow requests for users; 15 deliveries to identity-audit timed out on the first attempt and all
arrived on retry; the cash-reporting refusal (422, see CP2) is a business rule refusal: the attempt is recorded and the
event is retried, up to 20 attempts, before it goes to the failure destination (ADR-004 D4); 0 minutes of error
budget spent in SLO-1, SLO-2 and SLO-3.

**Root cause (5 whys)**
1. Why did 15 deliveries fail on the first attempt? The consumer took 6 s and the relay waits 5 s.
2. Why was the consumer slow? Assumed for the drill: a slow dependency in `identity-audit-api`.
3. Why did nobody notice for 25 minutes? No alert watches the delivery to the consumers.
4. Why is there no alert? CP7 covered only the availability SLO, measured at the gateway.
5. Why only that? The first alert policy asked for the user-facing SLO; the asynchronous hop was left for later.

**Contributing factors**
- No alert on delivery timeouts; only the availability SLO has alerts (CP7). The Grafana alerts planned in
  ADR-004 D8 are not built and would not fire either (each event arrives in about 20 s).
- The runbook covers 5xx on the gateway, not a slow consumer.
- `relay_outbox_lag_seconds` does not exist yet, so the freshness SLO cannot be measured (CP6).
- No circuit breaker: no ADR defines one; the relay only has a timeout and the retries of ADR-004 D10.

**What went well**
- The outbox kept every event and the owning API scheduled the retry, so nothing was lost.
- Tracing by `trace_id` found the failing hop in one query.
- The users never noticed: the slow call is asynchronous by design.

**What did not work**
- Detection depended on someone reading a metric; no alert and no runbook section covered this case.
- The only metric that showed the incident is not part of any dashboard or rule.

**Action items**

| # | Action | Owner | Deadline | Status |
|---|---|---|---|---|
| 1 | Alert on relay delivery timeouts | Domain owner of macrodomain 2 (Fernanda) | Next sprint (assumed) | Pending |
| 2 | Section for a slow consumer in `07-runbook.md` | Domain owner of macrodomain 2 (Fernanda) | Next sprint (assumed) | Pending |
| 3 | Implement `relay_outbox_lag_seconds` in the relay | Domain owner of macrodomain 2 (Fernanda) | Next sprint (assumed) | Pending |

1. As the owner of macrodomain 2, I want an alert on relay delivery timeouts, so that I learn about a slow
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

- The 60-inactivation burst, the 25 minute detection, the 6 s answer, the steady traffic of Drill 2, the rollback
  minute and the second-attempt success are assumptions of the drill. The minutes of Drill 2 come from arithmetic
  on the alert rules, not from a run: the project has no Prometheus yet.
- The log lines of Drill 1 are examples. `relay.go` delivers once and counts the outcome; it does not call the
  `attempts` route and does not retry. Recording attempts and the owner's backoff are designed in ADR-004 D4 and D10.
- The timeout ratio and the proposed alert are not implemented.
- The 422 refusal of cash-reporting is an example rule of CP2, not a rule of the docs. The project owner keeps
  cash-reporting as portal only for now (its API and database are deferred), so its consumer route is a design.
- Severity P3 is my classification with the table of `incident-management.md`.
