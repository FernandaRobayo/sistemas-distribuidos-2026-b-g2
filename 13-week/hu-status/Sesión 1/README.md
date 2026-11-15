# Week 13 - Session 1: security in distributed systems

Maria Fernanda Robayo Laguna · FernandaRobayo · ErrorCapa8  
Verified on 2026-11-15 (America/Bogota).

## Result and evidence

The session 1 activity is complete as a reproducible integration exercise. Existing product controls were verified, and a new live test joins a real NGINX HTTPS edge, the security service's production HTTP handler with PostgreSQL, and the commercial API's Spring Boot HTTP server. The catalog uses the product's in-memory test repositories; token verification and authorization use the product implementation. The service clocks run at the current time in the live test.

Execution: [successful GitHub Actions run](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/actions/runs/43692024222). Machine-readable results: [completion.json](evidence/completion.json). The workflow exports fixed product revisions listed in [sources-lock.json](sources-lock.json), without changing the working product repositories.

| Component | Passing evidence |
|---|---|
| Security | 335 top-level Go tests; PostgreSQL integration included; zero skipped tests. [Log](evidence/security.log) |
| Event relay | 67 top-level Go tests, including credential propagation and correlation. [Log](evidence/relay.log) |
| NGINX gateway | 96 smoke checks, including nginx -t, credential filtering, internal-route isolation, CORS and rate limiting. [Log](evidence/gateway.log) |
| Commercial API | 132 verifier, catalog HTTP, threat-model and outbox cases; zero skips. [Log](evidence/commercial.log) |
| Identity/audit API | 26 token and authorization cases; disposable MongoDB supplied; zero skips. [Log](evidence/identity-audit.log) |
| Cash/reporting API | 25 token/error and internal-route cases; actual cash schema and domain database user supplied; zero skips. [Log](evidence/cash-reporting.log) |
| Operations/cost API | 60 token, authorization, HTTP and internal-outbox cases; zero skips. [Log](evidence/operations-cost.log) |
| Live Go → Java integration | Login, catalog write, role/tenant refusals, service credentials, TLS and signing-key rotation. Every named check passed. [Log](evidence/live-integration.log) |

Subtests are recorded separately in JSON; the Go top-level counts above do not add their nested cases twice. Earlier reports of missing operations code, omitted security integration tests and an unreproducible cash checkout were resolved by testing committed exports with the required databases.

## Requirement checklist

| Activity requirement | What was demonstrated | Status |
|---|---|---|
| Authenticate at the edge | Real login through HTTPS; wrong credentials receive 401; the token issued by security creates a catalog item in Java. The gateway rejects absent credentials. | CUMPLE |
| Validate tokens in each service | The four domain APIs and security have passing local-verifier checks. The live commercial service rejects expired tokens, HS256 and another signing key, including a direct request without credentials. | CUMPLE |
| Authorize by role and resource | Administrator creation succeeds; a valid Collaborator receives 403; another tenant's item returns the same 404 as a missing item. A service credential cannot create catalog items. | CUMPLE |
| Secure service-to-service calls | A SERVICE token issued by the real security command calls its real internal API. Missing credentials receive 401; a person's token receives 403; the gateway hides the internal route with 404. | CUMPLE |
| Hash secrets | bcrypt cost 12, independent salts and the 72-byte boundary are tested. The live test reads the stored password hash and verifies that plaintext was not stored. Refresh-token hashing is covered by security integration tests. | CUMPLE |
| Validate inputs | Catalog tests cover required fields, strict JSON, nulls, UUIDs, pagination, monetary values and idempotency headers. The live route rejects malformed JSON and a forged extra tenant field. | CUMPLE |
| Encrypt the public transport | TLS 1.2/1.3 is enabled on the exercise gateway. The client trusts only the temporary test certificate, checks its hostname and verifies HSTS. | CUMPLE |
| Rotate credentials | The signer key changes; the Java consumer restarts with the new public key. Old user and service tokens receive 401; newly issued tokens work. | CUMPLE |

Authentication establishes identity; authorization decides which operation and tenant that identity may access. A valid signature grants no permission by itself. JWT is the token format used here; OAuth 2.0 and OIDC are different protocols and are not required by this project's chosen token mechanism.

The gateway's cheap Authorization-presence filter follows norm 5.6.2. Signature, expiration and subject validation remain in each service (norm 5.3.7 / Annex C). This keeps authentication and authorization effective when the gateway is bypassed. Public login routes intentionally allow unauthenticated requests so security can validate the supplied credentials.

## Zero trust, least privilege and secrets

Selected internal and external operations are checked independently of network location. Tenant identity comes from signed claims. SERVICE identities are separate from user sessions, and the gateway exposes no internal outbox route. The runtime security handler uses a dedicated non-superuser database identity in the strengthened live test; test administrators are reserved for fixture setup. Cash connects as cash_reporting_app to its own schema.

Signing keys, certificate keys and random database passwords exist only in the temporary test environment. The gateway receives its TLS key; the Java consumer receives only the public JWT key. No signer private key, token or password is committed. Signing-key rotation in this exercise uses a consumer restart; it does not claim a zero-downtime JWKS rollout.

ADR-004 D9 accepts unencrypted traffic inside one host's private platform network and reserves mTLS for an architecture change. Dedicated service tokens still authenticate those calls. The exercise verifies HTTPS at the public edge. Production certificates, operations and promotion remain governed by the deployment process; this delivery makes no production-deployment claim.

## Reproduce the exercise

Verified execution target: Linux / GitHub Actions, with Node 22+, Go 1.26.4, JDK 21, Maven 3.9, Docker, Git, tar, Bash and OpenSSL. Git Bash supplies Bash and OpenSSL on Windows, and the launcher can find Maven in the wrapper cache. Native Windows execution additionally requires Docker-to-host connectivity: this machine's native replay returned 503 when the container called the host service. The successful Linux CI run is the reproducibility evidence for the full networked exercise.

From this course repository:

```powershell
node './13-week/hu-status/Sesión 1/verify.mjs'
# PowerShell convenience launcher:
& './13-week/hu-status/Sesión 1/verify.ps1'
```

By default, MultiTour is a sibling directory. WORKSHOP_PRODUCT_ROOT overrides that location; the PowerShell launcher also accepts -ProductRoot. All revisions in sources-lock.json must be present in those repositories. The [CI workflow](../../../.github/workflows/week13-security.yml) fetches them directly from their published repositories.

The verifier starts disposable PostgreSQL and MongoDB containers, applies cash DDL from its own -db repository and gives cash its domain user. Security tests create isolated test databases from their own DDL. It runs the component checks, overlays the two additional test files only in temporary source exports, then starts the live HTTPS integration and rotates the signing key and consumer trust.

Maven checks run sequentially with bounded memory. The optional --resume flag reuses successful component evidence only for identical locked revisions; CI runs the full verification. A failing check returns a nonzero exit status. Completion metadata is written only after every check passes. Child processes, generated keys, containers, networks and temporary images are cleaned up.

## Scope and norm alignment

CUMPLE: local JWT verification (norm 5.3.7 / Annex C), tested edge controls (norm 5.6.2 / Annex F), dedicated service credentials (norm 5.7 / ADR-004 D5), domain-schema separation for the test database (Annex J.3), and executable security verification in CI (Annex I).

This is session 1's security exercise. The STRIDE model and prioritized security stories for session 2 remain in the [workshop delivery](../../workshop/README.md). Their remote issue or PR status is not changed by these tests. Existing product code remains attributed to its authors; the new contribution is the integration harness, TLS/rotation exercise, repeatable verifier, evidence and weekly status.

References: [course overview](../Semana%2013_%20Seguridad%20en%20Sistemas%20Distribuidos.png), ADR-004 D5/D9/D10, [OWASP microservices security](https://cheatsheetseries.owasp.org/cheatsheets/Microservices_Security_Cheat_Sheet.html), and [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
