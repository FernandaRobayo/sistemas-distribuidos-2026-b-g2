# Week 14 - Session 2: Multi Tour pipeline finalization

Maria Fernanda Robayo Laguna · FernandaRobayo · ErrorCapa8

This activity maps the official project DoD to blocking gates, adds service selection and inter-service contract/smoke verification, protects the course repository's three target branches and splits the remaining CI/CD work for MVP 3. Product readiness is assessed separately from delivery of the pipeline configuration.

| Requested deliverable | Artifact |
|---|---|
| Every DoD item assigned to a blocking gate | [61-row matrix](01-dod-gates.md), [machine-readable policy](dod-policy.json), [audit](dod-gate.mjs) |
| develop / qa / main protection | [Observed GitHub settings](evidence/branch-protection.json) |
| Pipelines by service with path filtering | [Workflow](../../../.github/workflows/week14-final-pipeline.yml), [planner](plan.mjs), [regression tests](plan.test.mjs) |
| Provider and consumer contract verification | Full Java API First suites plus the live Go-security → Java-commercial HTTPS contract job |
| Smoke test | Tagged security-image health/authentication/runtime checks plus gateway `nginx -t` and its smoke suite |
| MVP 3 pipeline stories | [Eight prioritized stories with testable criteria](02-mvp3-cicd-backlog.md) |

## Source and DoD traceability

The authoritative DoD is `code-corhuila/multi-tour-docs/00-governance/definition-of-done.md`, blob `2b72b719bec59667af6d0fc071870e2d21f88d8c`. The [immutable source snapshot](definition-of-done.source.md) is retained for the audit. The matrix links refer to the original project documents. A source or checklist change requires a reviewed update; a missing item, duplicate ID or undefined gate fails the audit.

Every checkbox has a required branch-review gate for applicability and semantic evidence. Automated jobs verify the narrower properties named in the matrix. A passing traceability audit proves that all criteria are mapped; it does not approve a business story, accessibility evidence, recovery procedure or performance result. Missing applicable evidence must block the review. These conditional criteria remain in the MVP 3 backlog until demonstrated.

CONFLICTO CON NORMA (Annex I): DOD-56's source paragraph says main PRs run no checks. The source is preserved, and this pipeline requires checks on develop, qa and main in accordance with the activity and Annex I.

## Pipeline selection

The workflow has no PR-level path filter. It always emits `week14-required`. Its internal planner uses the complete Git diff, including deleted/renamed input paths, and compares changed objects in the source lock. Service jobs are selected only after this plan succeeds.

| Input change | Selected service work | Additional gates |
|---|---|---|
| Security provider | All five APIs and relay | Live contracts and smoke |
| Commercial, identity-audit, operations-cost or cash-reporting | Owning API and relay consumer | Live contracts and smoke |
| Relay | Relay | Live contracts and smoke |
| Gateway | Gateway through its smoke checks | Live contracts and tagged-image smoke |
| One source-lock entry | Its owner and the configured consumers | Contracts and smoke |
| Workflow, policy, shared runner or unknown executable input | All service jobs | Contracts and smoke |
| Documentation / recorded evidence only | No service rebuild | DoD audit, shared security policy and final gate still run |

There are twelve path-selection assertions and five baseline-change assertions. A baseline reduction, reset to null or invalid value is rejected. The final gate accepts a skipped service/contract/smoke job only when the planner explicitly selected no work for it. Failure, cancellation or an unexpected skip blocks acceptance. [Planner tests](plan.test.mjs)

This repository is the course delivery, not a product monorepo. Its executable inputs are the service revisions in [sources-lock.json](sources-lock.json); changes to external product repositories are represented here by reviewed pin updates. Product-style paths are also recognized for a composed checkout. Changes in an external repository do not automatically trigger this course repository's workflow.

## Service, contract and smoke gates

The matrix contains five APIs (`security`, `commercial`, `identity-audit`, `operations-cost`, `cash-reporting`) and the event relay. Go jobs build, format/vet and run their full suites. Java jobs run full `mvn verify`, preserving their native JaCoCo agents and checks; repositories without one receive a pinned coverage agent. Zero executed tests, any skipped case, a missing API First report or an unestablished/regressed coverage baseline blocks the service job. [Service runner](service.mjs)

Each service and its domain DB source is exported at an immutable revision. Operations and identity-audit use their API's test-DB tooling; commercial and cash fixtures apply the domain repository's DDL and DCL in a disposable PostgreSQL instance. The application test role retains the domain's actual grants. These fixtures support API integration tests; they do not claim the complete `db-ci.yml` build/no-op/rollback/rebuild acceptance of DOD-22, which remains separate evidence required for DB changes.

Security retains the measured 93% statement baseline, relay 74.5% statements, identity-audit 68.5% aggregate instructions and operations-cost 73.9% aggregate instructions. Native module thresholds also remain enforced. A null Java baseline means a healthy full run has not yet established it and is blocking; partial coverage from a failed reactor is never promoted to a healthy baseline. [Coverage policy](coverage-baselines.json)

The live contract job uses the same source lock as the service matrix. It issues real user/SERVICE tokens in Go, calls the real Java HTTP adapter through NGINX HTTPS, and checks valid/invalid credentials, authorization, tenant isolation and key rotation. It retains at least 29 assertions. The Java catalog uses its published test ports; this is a real wire/authentication contract, not a claim that all business persistence or every pair of services was exercised. Other provider contracts are checked in their complete native suites.

The shared security workflow's older monolithic authorization job is deliberately disabled in this entry point: the dedicated contract job and selected full service suites now perform those checks. That planned job choice is separate from the zero-skipped-test requirement inside an executed service suite.

The smoke job builds a tagged security image, verifies its running image ID, health, non-root UID, private-route 401, absence of published business ports and cleanup. It also exports the gateway and runs `nginx -t` plus the existing smoke suite. Both are disposable test environments. Version publication in session 1 now depends on this final pipeline and uses this session's source lock; known failed gates prevent release publication.

## Verified component execution

[Run 43790091251](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/actions/runs/43790091251) verified the complete service runners at course source commit `faa7387`. The eleven downloaded artifact ZIP digests were checked against GitHub metadata. [Job outcomes](evidence/ci-validation.json), [verified artifact identities](evidence/artifacts.json).

| Service | Executed cases / test events | Coverage | Result |
|---|---|---|---|
| Security | 363 Go test events, zero skipped | 93% statements | passed |
| Event relay | 84 Go test events, zero skipped | 74.5% statements | passed |
| Identity-audit | 280 Java cases, zero skipped | 68.5% aggregate instructions | passed |
| Operations-cost | 708 Java cases, zero skipped | 73.9% aggregate instructions | passed |
| Commercial | 2,253 Java cases, zero skipped; two failures and three errors | failed reactor; no healthy baseline | blocked |
| Cash-reporting | 361 core cases, zero skipped | native core coverage floor fails; later modules are not accepted | blocked |

[Per-service summaries and runtime records](evidence/services/) preserve source revisions and distinguish partial failed-build measurements from accepted baselines. The [live contract](evidence/contracts.json) passed 29 assertions; the [tagged image smoke](evidence/smoke.json) and [96 gateway checks including nginx -t](evidence/gateway-smoke.json) passed. [Secret scanning](evidence/secret-summary.json) passed with zero unreviewed findings. [Dependency scanning](evidence/dependency-summary.json) blocked 106 package-advisory matches across 15 package versions.

The latest workflow run, including the required-check ownership audit, is recorded in [workflow-validation.json](evidence/workflow-validation.json). The release entry point is configured to invoke the final pipeline once; registry publication remains unexecuted while product gates block. No production acceptance is claimed.

## Branch protection and adoption

`develop`, `qa` and `main` are protected in `FernandaRobayo/sistemas-distribuidos-2026-b-g2`. Develop and qa were created at the existing main commit because the course fork did not have them. The settings were applied and read back: GitHub Actions `week14-required`, up-to-date checks, one approval, dismissal of stale approvals, resolved conversations, administrator enforcement, no force push and no branch deletion. Main's existing equivalent protection was retained. [Protection evidence](evidence/branch-protection.json)

These course branches do not provision deployed application environments. The code is published on `docs/14-week-session2-pipeline`; adoption into permanent branches requires normal reviewed PRs. The product's branch/promotion rules, professor approval, `cherry-pick -x` trace and CODEOWNERS remain governed by the project. Organization repository protections were not changed by this course exercise.

## Readiness and remaining work

The required gate must remain red while a selected service, native coverage rule or security policy fails. Full verification exposed commercial architecture/fixture/API-DB compatibility failures and a cancellation-log privacy assertion requiring investigation. Cash's native core coverage checks reported 94% instructions versus 96% required and 95% lines versus 97% required. The shared dependency baseline reports 106 package-advisory matches; aliases mean this is not a count of unique vulnerabilities. These are explicit blockers in PIPE-03/04/05.

MongoDB 8.0.32 rejected the kernel of the initial hosted runners. Identity-audit selects Ubuntu 22.04; its verified kernel was 6.8.0-1070-azure and its full run passed 280 tests with zero skips. The runtime is recorded in `runtime.json`; failed database startup remains blocking. This activity preserves the product's MongoDB version and checks. [MongoDB kernel compatibility](https://jira.mongodb.org/browse/SERVER-125742)

The shared secret/dependency scan retains its declared commercial/security/gateway scope. Expanding resolved inventories to every product component is PIPE-05. Load, accessibility, recovery and release readiness remain conditional DoD evidence, not results inferred from a passing smoke test. [MVP 3 backlog](02-mvp3-cicd-backlog.md)

CUMPLE (Annex I): PR triggers cover the three targets, jobs have read-only permissions/timeouts and the aggregate fails closed. CUMPLE (norm 9.4 / course policy): the three course branches require review and a named gate. NO CUMPLE (project release readiness): selected verification and security blockers remain. DOD-18/51/56 do not pass while CI is red.

## Reproduce

Use Linux/Docker, Node 22, Java 21 and Go 1.26.9. From the course root:

```powershell
node './14-week/hu-status/Sesión 2/plan.test.mjs'
node './14-week/hu-status/Sesión 2/dod-gate.mjs'
$sources = Join-Path $env:TEMP ('multitour-' + [guid]::NewGuid().ToString('N'))
$evidence = Join-Path $env:TEMP ('multitour-evidence-' + [guid]::NewGuid().ToString('N'))
node './14-week/hu-status/Sesión 2/prepare.mjs' $sources operations-cost
node './14-week/hu-status/Sesión 2/service.mjs' operations-cost $sources $evidence
```

The service runner uses the published POSIX test-DB tooling, so the Linux CI run is the complete reproduction target. Inspect source revisions, service summaries, native logs, coverage and contract/smoke artifacts in [CI executions](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/actions/workflows/week14-final-pipeline.yml?query=branch%3Adocs%2F14-week-session2-pipeline).

References: [GitHub path-filter and required-check behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), [required status-check troubleshooting](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks), [branch-protection API](https://docs.github.com/en/rest/branches/branch-protection), [JaCoCo Maven integration](https://www.jacoco.org/jacoco/trunk/doc/maven.html).
