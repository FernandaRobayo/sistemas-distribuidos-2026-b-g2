<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       15-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 15

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Verify Multi Tour integration, monetary paths, contracts, load and graceful recovery before MVP 3 release.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-CSH-001 | Validate daily cash monetary paths, retry safety and recovery | doing | [Executable suite](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/tree/docs/15-week-session1-testing/15-week/hu-status) |

## 2. My individual contribution
- Implemented a real PostgreSQL Testcontainers environment with cash, security and gateway images from immutable source revisions. Added two monetary backend E2Es, OpenAPI response validation, issuer-consumer contract CI, a k6 SLO probe and a stop/restart chaos experiment.
- Extended the existing blocking pipeline and documented reproducible acceptance criteria in [Session 1](./Sesión%201/README.md).

- Final CI: five system tests passed without skips; 29 real issuer-consumer checks and 41 published cash-response validations passed. Load: 800 requests, p95 34.76 ms, maximum 148.77 ms, zero HTTP errors. Chaos: neutral 503 in 2.005 seconds, recovery in 5.828 seconds with money preserved.

## 3. Blockers and risks
- The Session 1 testing exercise is complete. The story remains `doing` because the full release DoD still has blocking findings.
- MVP 3 remains blocked by the Week 14 commercial suite failures, cash core coverage floors and dependency findings. Passing this exercise does not authorize release.
- The load probe covers authenticated cash reads at its declared workload; browser/payment-provider/saga journeys, complete population capacity and monthly availability are not established by this run.

## 4. Plan for next week
- Session 2: review the evidence, resolve the remaining native-suite/coverage/security blockers and perform the MVP 3 release only after all required gates and reviews pass.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- [Session 1 test plan and acceptance criteria](./Sesión%201/README.md)
- [CI execution](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/actions/runs/43798627784)
- [Existing release blockers](../../14-week/hu-status/Sesión%202/README.md)
