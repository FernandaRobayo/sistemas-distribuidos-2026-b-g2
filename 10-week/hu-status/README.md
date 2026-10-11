<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       10-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 10

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Validate distributed persistence for MVP 2 and document the remaining saga, outbox delivery, and isolation blockers.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-WRK-007 | Audit outbox relay delivery and retries | doing | Local evidence, publication pending: [session report](Sesión%201/README.md), [repository snapshots](Sesión%201/Evidencias/repositorios.json) |

## 2. My individual contribution
- Inspected existing onboarding saga, outbox, tenant projection, contracts, and infrastructure; no product code or migrations changed.
- Ran existing component suites and audited their logs: 479 passing results including parent tests and subtests, representing 473 leaf cases; zero failures and omitted tests.
- Corrected the evidence counter, clarified functional idempotency versus event-id deduplication, and recorded reproducible commands and source snapshots.

## 3. Blockers and risks
- The workflow entry point is empty; recovery can compensate a tenant after account creation and lacks concurrency protection.
- The relay marks some events published without recipients; event-id deduplication required by ADR-004 remains pending.
- MongoDB atomicity for onboarding, global data isolation, and end-to-end service integration are not verified. Session verdict: NOT READY FOR SUBMISSION.
- Evidence is local until committed and published through a PR; no commit or PR URL is claimed yet.

## 4. Plan for next week
- Complete the workflow runtime and safe recovery, delivery recipients, and approved event-id deduplication.
- Verify PostgreSQL/MongoDB access isolation and T01–T10 across real services before accepting MVP 2 in Session 2.

## 5. Compliance self-check
- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

Existing tests were executed; no product tests were added. Permanent-branch promotion and release remain pending. The documentation candidate is on `docs/10-week-persistence-session-1`, targeting `main`.

## 6. Evidence links
- [Session 1 report and limitations](Sesión%201/README.md)
- [Go suite results](Sesión%201/Evidencias/resultados.json)
- [Identity outbox Maven execution](Sesión%201/Evidencias/identity-audit-outbox-maven.txt)
- [Reproduction script](Sesión%201/verificar.ps1)
