<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       10-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 10

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Implement HU-COM-002 associated establishments aggregate, use cases, http adapter, and persistence adapter for the D-02 commercial-reservation domain; promote api, db, and portal slices to QA to close the Corte 2 delivery window.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-COM-001 | Manage tour catalog with capacity validation and status transitions | done | [feat(api): add catalog status routes · f31ad84](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/commit/b33613d) · [feat(api): reject capacity changes below held seats · d2774c1](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/commit/d2774c1) |
| HU-COM-002 | Register and manage associated establishments linked to tour packages | done | [api PR #16](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/pull/16) · [api PR #17](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/pull/17) · [api PR #19](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/pull/19) · [db PR #10](https://github.com/code-corhuila/multi-tour-commercial-reservation-db/pull/10) · [portal PR #11](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/11) · [portal PR #12](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/12) |

## 2. My individual contribution
- Completed HU-COM-001 catalog slice: added status transition routes (`activate` / `inactivate`) and a guard that rejects capacity reductions below the number of held seats; every feat commit is paired with a passing test commit.
- Implemented HU-COM-002 in three merged PRs on the api repo: the `AssociatedEstablishment` domain aggregate and its test suite (PR #16), the http adapter with all CRUD routes (PR #17), and the JPA persistence adapter (PR #19).
- Extended the db repo with the associated-establishment tables, generalised the outbox relay to cover establishment events, and linked the salida capacity table to catalog services; promoted to QA via PR #10 (branch `chore/hu-com-002-promote-db-to-qa`).
- Added the portal screens for listing (with filters), registering, deactivating, and managing discount rules for associated establishments, backed by full component-level tests; promoted to QA via PR #12 (branch `chore/hu-com-002-promote-portal-to-qa`).
- All commits follow Conventional Commits (`feat`, `test`, `fix`, `chore`) and DDD/hexagonal layout: domain aggregate in the core layer, use cases in the application layer, http and persistence adapters in the infrastructure layer.

## 3. Blockers and risks
- D-04 cash-reporting implementation was not started this week; Corte 2 closes on 2026-10-13.
- QA promotion branches used the `chore/` prefix because a `qa/` ref already exists in the remote (push would be rejected as it would update the existing `qa` branch ref, not create a new one).

## 4. Plan for next week
- Start D-04 cash-reporting microservice (api, db, portal slices).
- Complete remaining BPMN process diagrams and C4 Level 2/3 architecture diagrams.
- Merge approved release into the `release/2.0.0` branch once all HUs are green on QA.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [x] Per-environment HU branch + PR to that environment (`feat/hu-com-002-dev-*` → develop; `chore/hu-com-002-promote-*` → qa)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration — every feat commit paired with a test commit)
- [x] DDD / hexagonal boundaries respected (domain has no I/O; adapters isolated)
- [x] No secrets; config via environment variables

## 6. Evidence links
- api PR #16 — establishment contract + aggregate: [code-corhuila/multi-tour-commercial-reservation-api/pull/16](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/pull/16)
- api PR #17 — establishment http adapter: [code-corhuila/multi-tour-commercial-reservation-api/pull/17](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/pull/17)
- api PR #19 — establishment persistence adapter: [code-corhuila/multi-tour-commercial-reservation-api/pull/19](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/pull/19)
- db PR #10 — establishment tables + outbox + QA promotion: [code-corhuila/multi-tour-commercial-reservation-db/pull/10](https://github.com/code-corhuila/multi-tour-commercial-reservation-db/pull/10)
- portal PR #11 — establishment screens: [code-corhuila/multi-tour-commercial-reservation-portal/pull/11](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/11)
- portal PR #12 — discount rules + QA promotion: [code-corhuila/multi-tour-commercial-reservation-portal/pull/12](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/12)
