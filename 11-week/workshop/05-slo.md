# CP6 - SLIs, SLOs and error budget

Journey: inactivate a catalog service (HU-COM-001). The SLIs use the metrics of `04-metrics.md`.
Window for all SLOs: 30 days rolling (43,200 minutes).

## Traffic of the journey

The PDR sizes Phase 1 at 10 active tenants and 4 operational collaborators per tenant in the normal
load (`01-context/scope.md`, `04-requirements/non-functional.md`). The numbers below are my estimate
from that sizing; the PDR does not give a request volume.

| Item | Estimate | Reason |
|---|---|---|
| Catalog requests through the gateway (list, read, inactivate, reactivate) | 2,000 per day, 60,000 per 30 days | 10 tenants x 4 collaborators x about 50 catalog requests each per day |
| Inactivations | about 100 per 30 days | 10 tenants x about 10 items taken out of the offer per month |
| Events delivered by the relay | about 200 per 30 days | 100 events x 2 consumers (identity-audit and cash-reporting) |

With so little traffic, one bad hour can spend a large part of the budget. That is why SLO-1 and SLO-2 are
measured on all catalog routes and not only on the inactivation.

## SLO-1 Availability

| Item | Value |
|---|---|
| SLI | good requests / valid requests, where good = status is not 5xx, on routes `/api/v1/catalog/*` of the gateway |
| Target | 99 % over 30 days |
| Budget | 1 % = 600 failed requests of 60,000, or 432 minutes (7.2 h) of full outage |

```promql
1 - (
  sum(rate(http_requests_total{job="api-gateway",route=~"/api/v1/catalog/.*",status=~"5.."}[30d]))
  / sum(rate(http_requests_total{job="api-gateway",route=~"/api/v1/catalog/.*"}[30d]))
)
```

The PDR asks for 95 % monthly availability (about 36 hours down). I set 99 % as the internal target
because the catalog is a light and simple service, and a 36 hour budget would hide a bad day. The PDR
95 % stays as the floor. This is a proposal of mine, not a requirement.

## SLO-2 Latency

| Item | Value |
|---|---|
| SLI | requests that finish in 3 s or less / all requests, on the same routes |
| Target | 95 % over 30 days (the PDR asks for a 95th percentile of 3 s or less) |
| Budget | 5 % = 3,000 slow requests of 60,000, or 2,160 minutes of every request being slow |

```promql
sum(rate(http_request_duration_seconds_bucket{job="api-gateway",route=~"/api/v1/catalog/.*",le="3"}[30d]))
/ sum(rate(http_request_duration_seconds_count{job="api-gateway",route=~"/api/v1/catalog/.*"}[30d]))
```

The `le="3"` bucket exists in the buckets chosen in CP4.

## SLO-3 Event freshness

| Item | Value |
|---|---|
| SLI | time with the oldest unread outbox event younger than 60 s / total time |
| Target | 99 % over 30 days |
| Budget | 1 % = 432 minutes of lag over 60 s; as events, 1 % of about 200 deliveries is 2 late events |

```promql
avg_over_time((relay_outbox_lag_seconds <= bool 60)[30d:1m])
```

`relay_outbox_lag_seconds` is a proposed metric (CP4) and does not exist in the code yet. The 60 s limit is
mine: the audit trail and the cash view should not stay behind for more than a minute after an inactivation.

## Error budget policy

Owners: the domain owner of D-02 (me) and the Project Lead of the team.

| Budget spent | What the team does |
|---|---|
| 50 % | Review what changed in the catalog routes and the relay in the last days. Risky changes need a second review. The burn is reported in the next weekly status |
| 75 % | Stop new features of D-02 that touch these routes. Only reliability fixes go to `develop` and `qa`. Review the budget every day |
| 100 % | Freeze promotions to `qa` and `release` for D-02 except the fix. Write a blameless postmortem. Work resumes when the budget is back above 25 % |

## Honest limits

- Today no product service exposes these metrics, so these SLIs cannot be measured yet. The relay metrics
  of the workshop are the only ones that exist.
- The traffic numbers are estimates. After the first real month they should be replaced by measured values.
