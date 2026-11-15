<!-- Local evidence snapshot, retrieved 2026-11-05 from PR #580 at head 920c95ada04f7a3f1cf361db5b389720e7eb40cf. -->
Source: https://github.com/code-corhuila/multi-tour-docs/pull/580 (open at review time).
The team PR remains the authoritative submission. The analysis below records its historical scope.

# STRIDE: api-gateway to commercial-reservation-api

Claim issue: #577. Boundary TB2, inbound direction. Status of every control below: decided in the
ADRs, not implemented yet (the services are not built).

## Boundary

| Item | Detail |
|---|---|
| Less trusted side | Portal users (Tenant Administrator, Operational Collaborator) with a Bearer RS256 token |
| Boundary | `multi-tour-api-gateway` (NGINX): rate limit, body size, timeouts, CORS (ADR-004 D10). It does not validate the token |
| More trusted side | `multi-tour-commercial-reservation-api` (Java 21, port 8083): validates the token itself and takes the tenant only from the `tenantId` claim (ADR-003, ADR-004 D5) |

## Data that crosses it

| Data | Classification |
|---|---|
| Access token (RS256, `tenantId`, `roles`) | Restricted |
| Catalog item: commercial value, operational cost, capacity, high-risk mark | Confidential |

Customer data and the transfer proof will also cross this boundary, but their endpoints are not in the
contract yet, so this analysis does not cover them.

## Entry points

Source: `07-api/contracts/openapi/commercial-reservation.yaml`.

- `GET` and `POST /catalog/services` (creation requires `Idempotency-Key`)
- `GET` and `PATCH /catalog/services/{serviceId}`
- `POST /catalog/services/{serviceId}/inactivate`
- `POST /catalog/services/{serviceId}/reactivate`

## STRIDE table

Likelihood (L) and impact (I) go from 1 to 3. Risk = L x I.

| STRIDE | Threat in this boundary | L | I | Risk | Existing control | Missing mitigation |
|---|---|---|---|---|---|---|
| S | A caller inside the internal network reaches port 8083 without going through the gateway and sends an expired token, a wrong signature or a token with another `alg` on `POST /catalog/services/{serviceId}/inactivate` | 2 | 3 | 6 | The service validates the token itself: `alg` exactly RS256, `exp` and `sub` required (ADR-004 D5) | Negative tests in the service that return `401` for each case; keep 8083 unpublished so only the gateway reaches it |
| T | A Collaborator whose tenant enabled `commercialName` edits sends rate, cost or capacity fields, or a `tenantId`, in the body of `PATCH /catalog/services/{serviceId}` | 2 | 3 | 6 | The tenant comes only from the token; a change of rate, cost or capacity answers `403` (HU-COM-001 AC4) | Ignore any `tenantId` in the body and reject unknown fields; a test that proves a rate change by a Collaborator leaves the item unchanged |
| R | A Tenant Administrator denies having inactivated a catalog item with `POST /catalog/services/{serviceId}/inactivate` | 2 | 2 | 4 | The service writes audit evidence to its outbox in the same transaction; job 7 delivers it to `identity-audit`; `actorId` is `sub` and each request carries `X-Correlation-Id` (ADR-004 D4, D5, D8) | A test that checks the evidence has actor, tenant, action, affected id and correlation id; an alert when job 7 stops delivering |
| I | A user of tenant B guesses the `serviceId` of an item of tenant A in `GET /catalog/services/{serviceId}` and reads its rates and costs, or learns it exists from a different error body | 2 | 3 | 6 | An item of another tenant answers `404`, the same as one that does not exist (D-C10); the tenant comes only from the token | A test that compares the `404` body of an item of another tenant with a missing one; no stack trace or SQL text in any error body |
| D | One office behind one IP sends a burst of `GET /catalog/services` and the per-IP limit leaves the rest of its tenant without service, or a slow query blocks the pool | 2 | 2 | 4 | The gateway limits 50 requests/s per IP with burst 100 and answers `429` with `Retry-After`; timeouts of 2 s to connect and 10 s to read (ADR-004 D10) | A limit per tenant inside the service, because the gateway cannot count per token; restore the real client address at the gateway (`set_real_ip_from` plus `real_ip_header X-Forwarded-For`) before the limit is counted, as soon as a balancer or proxy sits in front of it, because today the gateway sends `X-Forwarded-For $remote_addr` and has no `real_ip` setting; a load test with the 34 users of one tenant that the PDR names |
| E | An Operational Collaborator calls `POST /catalog/services` or `POST /catalog/services/{serviceId}/reactivate`, which belong to the Tenant Administrator | 3 | 3 | 9 | Each route authorizes by the roles in the token and answers `403` for another role (`07-api/authentication.md`, ADR-004 D5) | [B] A role matrix per entry point, with the rights grouped by role; an automated test that calls every entry point with every role and checks the expected status, run in the service CI |

## Ranking by risk

1. E, risk 9 (P0)
2. S, T and I, risk 6 (P1)
3. R and D, risk 4 (P2)

## Residual risk I accept

The limit of the gateway is per IP and not per tenant (D), so one very busy office can still
slow down its own tenant. I accept it for the first version because the PDR load test is 34 users of
one tenant and the limit is 50 requests/s. This changes if the target is the AWS path of ADR-004 D9: behind a
balancer every client would arrive with the same address, so the limit would count the whole platform and one
client could use the budget of all, until the real address is restored at the gateway. A delay in the delivery of audit evidence by job 7 (R) is
also accepted, because the delivery is at least once and the evidence is never lost. None of the
controls above exists in code yet, so the first real test of each one is part of its story.

## References

- Costas Santos, J. (2011). *Seguridad informatica* (1st ed.). Bogota: Ediciones de la U. Call number
  005.8 C838s Ej.1, CORHUILA library, Prado Alto. Physical copy consulted in the library on
  2026-10-29, record at 08:20. Page used: 93, section 3.2.2 Roles.

Rows marked [B] come from the book. In the row E, section 3.2.2 says that access can also be
controlled through the function, profile or role of the user, and that the access rights and security
policies can be grouped by role. I use this idea for the role matrix per entry point.
