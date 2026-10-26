# CP8 - Runbook: CatalogAvailabilityFastBurn

Alert: `CatalogAvailabilityFastBurn` (`06-alerts.yml`), severity `page`. Journey: inactivate a catalog
service (HU-COM-001). The catalog routes of the gateway return 5xx in more than 14.4 % of the requests;
2 % of the 30-day budget of SLO-1 is spent, and the whole budget would be gone in about 50 hours.

Sources: `09-microservices/services/03-commercial-reservation/runbook.md` (planned procedures, the
service has no code yet) and `13-operations/incident-management.md`. Commands follow the root composition
project `multi-tour-dev` and are not confirmed until HU-INF-001; set `SVC=commercial-reservation-api`.

## 1. Symptoms

- The page `CatalogAvailabilityFastBurn` fires.
- In the portal, the catalog screens or the "Inactivate" button show an error with a `traceId`.
- The gateway answers 502 or 503 on `/api/v1/catalog/*`.

## 2. How to confirm

Which route and status fail (PromQL, gateway):

```promql
sum by (route, status) (rate(http_requests_total{job="api-gateway",route=~"/api/v1/catalog/.*",status=~"5.."}[5m]))
```

Is the problem in the gateway or behind it (compare the same query for `job="commercial-reservation-api"`, with `route=~"/catalog/.*"`, because that service sees the route without the gateway prefix).

Follow one failed request by `trace_id` (Loki in Grafana). The `traceId` comes from the error body or
from the `X-Correlation-Id` header of the response (the gateway returns it):

```logql
{service=~"api-gateway|commercial-reservation-api|worker-event-relay"} | json | trace_id="<trace_id>"
```

The last line with level `ERROR` of that trace tells which service failed first.

Is the service alive:

```bash
docker compose -p multi-tour-dev ps "$SVC"
docker compose -p multi-tour-dev exec "$SVC" wget -qO- http://localhost:8083/health
docker compose -p multi-tour-dev logs --tail 200 "$SVC"
```

## 3. Mitigations, from lowest to highest risk

| # | Mitigation | Risk | When |
|---|---|---|---|
| 1 | Restart the service: `docker compose -p multi-tour-dev restart "$SVC"` | Low: requests in flight fail once | `/health` fails or the logs show a stuck process |
| 2 | Roll back to the previous image of `commercial-reservation-api` | Medium: the database schema may be ahead of the old image; check the last migration first | The errors began right after a promotion to `qa` or `release` |
| 3 | Fix the PostgreSQL instance of `multi-tour-infra-postgres`, with its owner | High: it serves other domains too. In `qa` and `main`, back up first and never remove the volume (Annex J, J.5.4) | The logs show connection errors; the pool is 10 and the statement time 5 s |

Not used, because the project does not define them for this service: feature flags, a circuit breaker
and scale out. They appear in `incident-management.md` as general options only.

## 4. Escalation

| Time without improvement | Who | Role |
|---|---|---|
| 0 min | Domain owner of D-02 (Fernanda) | First responder; runs sections 2 and 3 |
| 15 min | Project Lead (Jhon) | Decides the rollback and talks to the other domains |
| If it is the database | Owner of `multi-tour-infra-postgres` | Acts on the shared instance |

## 5. Verify recovery

1. The 5xx ratio of the catalog routes stays below 1 % for 15 minutes (same query as in section 2, divided by total).
2. `CatalogAvailabilityFastBurn` resolves and `/health` answers 200.
3. One real test: inactivate and reactivate a catalog item; both answer 200.
4. Check how much budget is left with the SLO-1 query of `05-slo.md`.
5. See which level of the policy of `05-slo.md` is reached (50, 75 or 100 % of the budget) and apply it. Write a blameless postmortem (CP9 is the drill for it).
