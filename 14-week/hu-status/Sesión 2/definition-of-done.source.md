# Definition of Done (DoD)

> A User Story is **DONE** when it meets ALL criteria on this checklist.
> If even one is missing, the story is NOT done - it goes back to In Progress.
>
> Criteria marked with a norm reference (`§`, `Annex`) come from the course norm
> ("Norma de Estructura de Repositorios, Control de Versiones y Evaluación",
> Sistemas Distribuidos 2026-B) and cannot be waived by the team.

## Mandatory checklist

### Code
- [ ] Code implements all acceptance criteria of the user story
- [ ] The implemented behavior preserves the product identity: `Multitour` is the platform and `Travesia Natural` is only the main validation tenant
- [ ] Code was reviewed and approved according to the review rule of its target branch in [git conventions](git-conventions.md#review-rule-per-branch-norm-94) (norm §9.4)
- [ ] Every commit follows the Conventional Commits rules of [git conventions](git-conventions.md#commit-format-conventional-commits); non-conforming history is penalized even when the code is correct (norm §8, §8.4)
- [ ] The work was done in one child branch per task that lived at most 5 business days (norm §6.4)
- [ ] Code follows project standards; linting and formatting pass in the repository `ci.yml` (norm §5.1, Annex I)
- [ ] The domain layer does not import web, persistence or messaging frameworks; the service keeps the hexagonal layers of Annex C (norm §5.3.1-§5.3.3)
- [ ] The domain entity is never serialized directly: the HTTP adapter translates it into a response object, so renaming an internal field cannot break a client (norm §5.3.4)
- [ ] An aggregate is the transactional boundary: one transaction writes in a single aggregate and in a single domain, and consistency between domains stays eventual through events or the owner API (Annex J.3.5, norm §5.3.11; [shared invariants](../02-domain/entities-and-rules.md#shared-invariants))
- [ ] Endpoints, fields, tables, collections and events use the ubiquitous language of [the domain map](../02-domain/domain-map.md); renaming a domain concept in a contract or a schema is a defect, not a style choice (Annex J.1.1)
- [ ] The composition root declares every limit with its value: server read-header, write and idle timeouts, connection pool size, wait for a connection, per-statement timeout and graceful shutdown. An undeclared default is not a decision (norm §5.3.10, Annex C)
- [ ] No schema, migration or seed lives in an `-api` repository; data structure changes live only in the domain `-db` repository (norm §5.2.1)
- [ ] No portal implements its own HTTP client, session or token handling; it uses the ones of `-front` (norm §5.4.1)
- [ ] No secret, key, token or `.env` file is committed; `.env.example` lists every variable with placeholders only (norm §13, Annex I)
- [ ] No technical debt introduced without registering it in the project control record under `15-project-control/README.md`

### Tests
- [ ] Unit tests written for new business logic
- [ ] Test coverage does not decrease from the project baseline
- [ ] All applicable tests pass in the repository `ci.yml`; a red CI does not prove anything, even if it works locally (norm §5.1, Annex I)
- [ ] If the story changes an `-api` or the `-workflow`, the HTTP contract checks of Annex C are automated and green: authentication, error envelope, correlation, validation, idempotent creation, state transitions and bounded listing (norm §5.3.12)
- [ ] If the story changes an `-api` or the `-workflow`, its OpenAPI contract was written before the code and the API First contract tests in `ci.yml` validate every response against it; this is the contract-test gate for `qa` (Pact is not required). The published contract is `openapi/openapi.yaml` of the repository; the tool is `swagger-request-validator` in Java and `kin-openapi` in Go, and the suite fails if an operation of the contract has no test (ADR-004 D7)
- [ ] If the story changes a `-db` repository, it defines no database service or volume (the single instance per engine lives in the infrastructure repository: `multi-tour-infra-postgres` and `multi-tour-infra-mongo`, Annex J.8) and it uses its own migration control table (Annex J.3.1, J.6)
- [ ] If the story changes a `-db` repository, `db-ci.yml` is green: full build from an empty database, a second run applies nothing, full rollback, rebuild (norm §5.2.8, Annexes A and B)
- [ ] If the story changes another piece, the "how it is verified" list of its annex passes:
  - `-workflow`: happy path ends `COMPLETED`; a failed step compensates the completed ones in reverse order and ends `COMPENSATED` with `failedStep`; a failed compensation ends `FAILED`; repeating the start request runs no step again; every step sends `Idempotency-Key: <saga>:<step>` with the service token; the response never exposes internal failure details (Annex E)
  - `-worker`: bounded batch, failure does not stop the batch, retries only on network, 429 and 5xx, bounded and with exponential backoff and jitter (norm §5.7.2), service token and correlation id per run (Annex D)
  - `-api-gateway`: `nginx -t` and `tests/smoke.sh` green; it resolves services on every request, so a domain that is down answers `503 SERVICE_UNAVAILABLE` with the shared envelope and the other routes keep working (norm §5.6.3; Annexes F and I)
  - `-front` / `-portal`: React 19 or Angular 21 on Node 22 LTS or 24 (norm §5.5.1); the development sign-in does not reach `main` (norm §5.5.2); four states per view, field-level errors, disabled submit while pending, reused `Idempotency-Key`, money parsed from text, isolated remotes (Annex H)
  - security microservice (`multi-tour-security`, name confirmed by the course professor's written answer of 2026-10-03): it has no `-db` (norm §5.8.4; ADR-005 E1), so its migrations live in its own repository and create the `security` schema with its own control table `databasechangelog_security` (ADR-005 E2); the same checks as a `-db` apply: build from an empty schema, a second run applies nothing, rollback and rebuild
  - `-infra-postgres`: the whole system starts from scratch with `scripts/up.sh`, every `-db` migrates with its documented command and a resource is created and listed through the gateway (Annex G)
- [ ] Acceptance criteria verified (manual or automated)
- [ ] If the story affects bookings, payments, cash flow, discounts, or service execution, there is functional evidence for that flow
- [ ] If the story affects multitenancy, there is explicit validation that data is not mixed across tenants
- [ ] Applicable cases in the [domain validation matrix](../02-domain/validation-scenarios.md) have reproducible results; pending scenarios are not reported as passing
- [ ] Collaborator access, catalog lifecycle and establishment publication changes include actor/tenant rejection cases and preserve historical references
- [ ] Payment changes prove that uploading evidence does not by itself create cash income and that rejection/retry does not erase earlier valid receipts
- [ ] If the story affects a resource with limited capacity, concurrent attempts for the last available slot are tested and do not cause overselling within a tenant
- [ ] If the story affects the final customer channel, the applicable main flows have evidence of WCAG 2.1 AA accessibility and completion on the team-defined desktop and mobile browsers
- [ ] If the story affects consultation or registration performance, evidence shows the applicable main operation completes within 3 seconds under normal Phase 1 conditions
- [ ] If the story affects expected capacity, evidence covers the Phase 1 scenario of 10 active tenants, up to 20 internal users and 5,000 registered customers per tenant
- [ ] If the story affects user interaction, evidence shows that the applicable main flow is understandable and completable without external instructions

### Integration
- [ ] Changes do not break other services (integration tests pass)
- [ ] If API changes: the OpenAPI contract is updated in both places, through Pull Requests that reference the same user story: the design copy in `07-api/contracts/` of this repository (API First review) and the versioned copy published in the `-api` repository, which is the one CI tests and the teacher evaluates (norm §5.3). Both copies match and follow the common contract: camelCase, UUID identifiers, money as integer minor units, RFC 3339 UTC dates, single error envelope with `traceId` (norm §5.3.5)
- [ ] Every creation requires `Idempotency-Key` and every listing is paginated (`page`, `limit` 1-100, `{data, meta}`) (norm §5.3.6, §5.3.8)
- [ ] Every request reuses or generates `X-Correlation-Id`, returns it and writes it in each structured log line (norm §5.3.9)
- [ ] If data model changes: the versioned migration with its rollback and the data dictionary are updated in the domain `-db` repository, which is the source of truth for tables, columns and constraints (norm §5.2); the service `data-model.md` in this repository keeps only the summary and the link to that dictionary
- [ ] If new/modified events: they are written to an outbox table in the same transaction as the change, and the service `events.md` is updated (norm §5.3.11)
- [ ] Each service writes only in its own domain schema and connects with its domain user `<domain>_app`, never with the administrator (Annex J.2, J.3.2). Cross-domain data comes through events or the owner's published API; a read-only `SELECT` on another domain's tables is accepted only with a `GRANT` from the owner's `-db` and an ADR recording it as technical debt (Annex J.3.3). This project does not use that option, so a service never reads another domain's tables (ADR-005 E7). No foreign keys across domain schemas (Annex J.3.4)
- [ ] If the story changes a PostgreSQL schema or its grants, the isolation query of Annex J.10 returns `escribe = true` only in each user's own schema ([query](../06-data/migration-strategy.md#isolation-check-annex-j10)). The MongoDB equivalent is the `mongosh` query in the same section, from the course professor's written answer of 2026-10-03; each `<domain>_app` must show `escribe = true` only in its own database
- [ ] If permissions, authentication, or sensitive actions change, traceability of actor, tenant, action, affected record, timestamp, and justification when applicable is verified
- [ ] If the story affects functional errors, authentications, state changes, economic operations, or integrity events, logs identify the tenant, actor, action, and moment of the event
- [ ] If the story affects sensitive data, consent, retention, or recovery, access restrictions and the one-year retention/auto-deletion rule are verified (PDR v1.9 C4/E8)
- [ ] If the story affects operational data backup or restoration, the documented procedure and applicable Phase 1 RPO/RTO objectives are verified

### Deployment
- [ ] Code is merged into `develop` through a Pull Request from a `feat/`, `fix/` or `chore/` branch; it reaches `qa` and `main` only by promotion (norm §6.2, §10)
- [ ] The Pull Request follows `.github/pull_request_template.md` where the repository has it, references its user story (`code-corhuila/multi-tour-docs#NN`) and stays within 400 changed lines (norm §9.1, §9.2, Annex I)
- [ ] Every automated review finding is answered in the PR: applied, or not applied with a technical justification (norm §9.9)
- [ ] The board `Environment` field (Dev, QA, Main) matches where the story actually is (norm §16.7, Annex I)
- [ ] `ci.yml` is green on `develop`
- [ ] If a staging environment is formally provisioned for the change, deployment and smoke-test evidence pass there; otherwise, reproducible local validation and the deployment risk are documented
- [ ] If the story affects availability or operational resilience, the change preserves the Phase 1 95% monthly availability objective and the applicable recovery controls
- [ ] If the story affects the customer-facing channel, the evidence covers the applicable responsive web and mobile flow

**At each later promotion** (not required to move the story to `Done`, see
[agile conventions](agile-conventions.md#environment-field)):

- [ ] The commit carries its `(cherry picked from commit <sha>)` trail in `qa` and in the release branch, and the cited SHA exists in the source branch (norm §10.3-§10.5)
- [ ] `ci.yml` is green on `develop` and on `qa` (the workflows run only on pull requests to those two branches); a pull request to `main` runs no check, so for `main` the evidence is the green `qa` and the local run recorded in the release pull request; the `Environment` field is updated

### Documentation
- [ ] Service `README.md` updated if the public interface changed
- [ ] The story and its evidence use consistent domain terms such as booking, payment, cash flow, tenant, final customer, administrator, or operational collaborator, as applicable
- [ ] If a significant technical decision was made: ADR created or updated with context, at least two real options, dominant criterion, accepted cost and consequences (norm §4.2.3)
- [ ] Models and dictionary agree on record/field meaning, tenant scope and conditional requirements; logical designs are not described as deployed schemas
- [ ] Source version, coverage and outstanding propagation are recorded in [PDR alignment](pdr-alignment.md); open source issues are not silently declared resolved

---

## Allowed exceptions

The following exceptions must be explicitly agreed to by the `Project Lead`:
- E2E tests omitted due to environment limitations (document the risk)
- Documentation deferred for urgent delivery (create a tech-debt ticket)
- Integration tests against the real database skipped when `TEST_DATABASE_URL` is not available in CI (Annex I); the HTTP contract checks are never skipped

No exception can waive a criterion that comes from the course norm.

---

## What is NOT a Done criterion

- "The code is on my machine" - only what is published in the remote repository exists (norm §1.4)
- "It works only on my local environment" - it must pass `ci.yml` and use staging when that environment is formally available
- "The PM/PO approved it" - that is the product Definition of Done, not the code's
