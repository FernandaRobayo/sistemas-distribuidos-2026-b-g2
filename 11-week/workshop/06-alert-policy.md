# CP7 - Burn-rate alert policy

Journey: inactivate a catalog service (HU-COM-001). Rules in `06-alerts.yml`, validated with
`promtool check rules` (2 rules found). They alert on how fast SLO-1 spends its budget (`05-slo.md`):
availability 99 % over 30 days, so the budget is 1 % = 600 failed requests of about 60,000, or 432 minutes.

## The two alerts

| | Fast burn | Slow burn |
|---|---|---|
| Alert | `CatalogAvailabilityFastBurn` | `CatalogAvailabilitySlowBurn` |
| Burn rate | 14.4 | 6 |
| Windows | 1 h, confirmed over 5 min | 6 h, confirmed over 30 min |
| Error ratio that fires it | more than 14.4 x 1 % = 14.4 % | more than 6 x 1 % = 6 % |
| Budget spent when it fires | 14.4 x 1 h / 720 h = 2 % | 6 x 6 h / 720 h = 5 % |
| In failed requests | 2 % of 600 = 12 | 5 % of 600 = 30 |
| Time to empty the whole budget at that rate | 720 h / 14.4 = 50 h | 720 h / 6 = 120 h (5 days) |
| Severity | `page` | `ticket` |
| Minimum traffic | 20 requests in 1 h | 100 requests in 6 h |

My traffic is about 2,000 catalog requests per day, around 83 per hour. At that volume, 12 failed
requests in one hour already look like a 14.4 % error ratio. That is why both rules ask for a minimum
number of requests: without it, 1 failed request out of 2 would fire the page.

## How I read them

- Fast burn: something is clearly broken now. A person looks at it at once, using the runbook
  (`07-runbook.md`, CP8). If nobody acts, the month budget is gone in about two days.
- Slow burn: a smaller leak that would not show in a short window. It opens a ticket for the next
  working hours. If nobody acts, the budget is gone in five days.
- Both confirm with a short window (5 min and 30 min) so the alert stops when the problem is already over.
- 4xx answers are not errors: a 404 or a 403 is a correct answer of the contract.

## Cause-based alerts I will NOT create

| Alert I will not create | Why |
|---|---|
| CPU of `commercial-reservation-api` above 80 % | High CPU can happen while every request is fine, and a failing service can have low CPU. The user feels errors and slowness, which the burn-rate alerts already measure. I keep CPU as a dashboard panel, not as a page |
| `worker-event-relay` restarted | A restart can pass without any user noticing, and Docker Compose can restart it on purpose. If the restarts lose events, the freshness SLO (`relay_outbox_lag_seconds`) shows the effect. Paging at every restart would teach the team to ignore pages |

## Limits

- Design only: there is no Prometheus or Alertmanager in the project, so the rules have not fired on real traffic.
- The `team` value `ErrorCapa8` and the `severity` names are my proposal.
- The `runbook_url` points to `07-runbook.md`, which I write in CP8.
- Only the availability SLO has alerts. Latency and freshness (SLO-2 and SLO-3) have none yet.
