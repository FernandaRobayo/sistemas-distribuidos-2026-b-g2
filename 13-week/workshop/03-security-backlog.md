# CP3 / CP7 - Security backlog and authorization matrix

Evidence checked through the GitHub connector on 2026-11-05.
The three issues remain open. Local tests cover only the registration role rule in a fixture.

## Role matrix

Paths below are relative to the catalog contract, as in CP1. Successful results assume valid input,
an item in the caller's tenant and a suitable current state. Missing/invalid credentials require 401.

| Operation | Tenant Administrator | Operational Collaborator |
|---|---|---|
| GET /catalog/services | 200 | 200 |
| POST /catalog/services | 201 (200 for idempotent replay) | 403 |
| GET /catalog/services/{serviceId} | 200 | 200 |
| PATCH /catalog/services/{serviceId} | 200 | 200 only for commercialName when enabled by the tenant; otherwise 403 |
| POST /catalog/services/{serviceId}/inactivate | 200 | 403 |
| POST /catalog/services/{serviceId}/reactivate | 200 | 403 |

For item reads, another tenant's item and a missing item both return 404 with equivalent error content.
Compare stable error fields; use the same correlation header when comparing bodies containing traceId.
Signature, expiration, tenant isolation, persistence and audit evidence require tests against the product.

## [#581: [security] Only the Tenant Administrator can register, inactivate or reactivate catalog items](https://github.com/code-corhuila/multi-tour-docs/issues/581)

State checked on 2026-11-05: **open**. These are implementation tasks, not closed by the fixture.

### User story

As a **Tenant Administrator** I want these actions to be refused to any other role, so that a Collaborator cannot change what my tenant offers.

### Threat

| | |
|---|---|
| STRIDE | **E** (Elevation of privilege) |
| Risk | **9** (likelihood 3 x impact 3), priority **P0** |
| Boundary | `multi-tour-api-gateway` to `multi-tour-commercial-reservation-api` |
| Source | PR #580, file `05-architecture/security/stride-FernandaRobayo.md` |

### Acceptance criteria

- [ ] `POST /catalog/services`, `POST /catalog/services/{serviceId}/inactivate` and `POST /catalog/services/{serviceId}/reactivate` with a token of `OPERATIONAL_COLLABORATOR` return `403`.
- [ ] The refused attempt is written to the audit evidence with actor, tenant, action, affected id and correlation id.
- [ ] An automated test calls every entry point with every role and checks the expected status; it runs in the service CI.
- [ ] Book support: Costas Santos, *Seguridad informatica* (2011), section 3.2.2 Roles, p. 93: access can be controlled by the role of the user, so the rights are grouped by role.

Refs PR #580

## [#582: [security] The service answers 401 to expired, badly signed or wrong-algorithm tokens](https://github.com/code-corhuila/multi-tour-docs/issues/582)

State checked on 2026-11-05: **open**. These are implementation tasks, not closed by the fixture.

### User story

As the **platform operator** I want `commercial-reservation-api` to answer `401` to any invalid token, so that a caller that skips the gateway cannot act as another user.

### Threat

| | |
|---|---|
| STRIDE | **S** (Spoofing) |
| Risk | **6** (likelihood 2 x impact 3), priority **P1** |
| Boundary | `multi-tour-api-gateway` to `multi-tour-commercial-reservation-api` |
| Source | PR #580, file `05-architecture/security/stride-FernandaRobayo.md` |

### Acceptance criteria

- [ ] A request with an expired token, a wrong signature or an `alg` other than RS256 returns `401`.
- [ ] Port 8083 is not published, so only the gateway reaches the service.
- [ ] An automated negative test covers the first case and runs in CI.

Refs PR #580

## [#583: [security] An item of another tenant looks the same as one that does not exist](https://github.com/code-corhuila/multi-tour-docs/issues/583)

State checked on 2026-11-05: **open**. These are implementation tasks, not closed by the fixture.

### User story

As a **Tenant Administrator** I want the service to answer the same `404` for an item of another tenant and for a missing one, so that nobody can learn what my tenant sells.

### Threat

| | |
|---|---|
| STRIDE | **I** (Information disclosure) |
| Risk | **6** (likelihood 2 x impact 3), priority **P1** |
| Boundary | `multi-tour-api-gateway` to `multi-tour-commercial-reservation-api` |
| Source | PR #580, file `05-architecture/security/stride-FernandaRobayo.md` |

### Acceptance criteria

- [ ] `GET /catalog/services/{serviceId}` with a token of tenant B for an item of tenant A returns `404` with the same body as a missing id.
- [ ] No error body shows a stack trace or SQL text.
- [ ] An automated test compares both responses and runs in CI.

Related to #584 (same tenant isolation rule, applied to the memberships of the security service).

Refs PR #580

