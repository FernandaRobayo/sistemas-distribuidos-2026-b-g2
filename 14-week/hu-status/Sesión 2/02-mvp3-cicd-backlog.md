# MVP 3 pipeline stories

These are PROPUESTO (session 2 planning). They are local planning items; the team's issue and board states are preserved. Each implementation PR must stay within 400 changed non-test, non-generated lines (norm 9.2). Owners and estimates are proposals. Delivery of this course exercise does not mark the product stories Done.

| Order | Story | Priority | Proposed owner | Estimate | Dependencies / current state |
|---|---|---|---|---|---|
| 1 | PIPE-01 complete DoD traceability and reliable change selection | P0 | CI maintainer | 1 day | Implemented in the course pipeline; adoption PRs pending |
| 2 | PIPE-02 preserve Go build, authorization and coverage baselines | P1 | Security / relay maintainers | 1 day | Course verification passes; security 93%, relay 74.5% statements |
| 3 | PIPE-03 make all Java verification and native coverage gates pass | P0 | Four domain API maintainers | 2–3 days, separate PRs per service | Open: full verification exposes failures that selected suites did not cover |
| 4 | PIPE-04 keep provider and consumer contracts compatible | P0 | Commercial / security / domain DB maintainers | 1–2 days | Live Go → Java contract passes; commercial API/DB compatibility failures remain |
| 5 | PIPE-05 remediate dependency findings and expand security inventory | P0 | API / security maintainers | 2 days | Depends on SEC-01; the shared baseline reports 106 package-advisory matches |
| 6 | PIPE-06 promote the tested image and prove rollback | P1 | Infrastructure maintainer | 2 days | Disposable tagged-image smoke passes; persistent environment and rollback evidence pending |
| 7 | PIPE-07 adopt branch gates and review evidence in product repositories | P1 | Repository maintainers / authorized governance owner | 1 day | Course develop/qa/main protected; organization repository adoption pending |
| 8 | PIPE-08 prepare scale and MVP 3 launch evidence | P1 | QA / domain maintainers | 2 days | After PIPE-03/04/05; execution belongs to the following week's scale activity |

## PIPE-01 DoD and selection

As a reviewer, I want every DoD criterion assigned to a blocking gate, so missing applicable evidence prevents acceptance. Traces DOD-01–61.

- Given the pinned official DoD, when the audit runs, then all 61 original checkboxes match the source blob, have unique IDs and reference defined gates.
- Given a commercial change, then commercial and its relay consumer run, with the live contract and smoke jobs. Given a security change, then every API consumer runs.
- Given docs-only changes, then service jobs may be deliberately skipped while the audit, shared security policy and final gate still run. Unexpected failure, cancellation or skipping fails the final gate.
- Given an applicable semantic criterion, then the reviewer requires its linked evidence and blocks approval if it is absent. A complete mapping is not proof that the criterion passed.

## PIPE-02 Go service gates

As a Go service maintainer, I want compilation, formatting, vet, real tests and a fixed coverage baseline, so a regression cannot be promoted. Traces DOD-06/16/17/18/26.

- Given the security source, then production/test types compile, the full PostgreSQL-backed suite runs with zero skipped cases and statement coverage stays at or above 93%.
- Given the relay source, then build, gofmt, vet and its full tests pass with zero skips and statement coverage stays at or above 74.5%.
- Given a PR lowering a recorded baseline or replacing it with null, then the planner fails. A raised or unchanged baseline is accepted.

## PIPE-03 full Java verification

As a domain maintainer, I want `mvn verify` to include the real integration environment and the repository's native coverage rules, so a selected HTTP suite cannot hide a failing module. Traces DOD-07/16–23/41/42.

- Given each API and its pinned domain DB revision, then full compilation, tests and API First gates run with zero skipped cases. Runtime test data access uses the domain account.
- Given an existing JaCoCo configuration, then retain its execution and thresholds and do not attach a second agent. Given a healthy full run, freeze its measured aggregate baseline and retain native module floors.
- Given the commercial baseline, then investigate and fix the failing architecture import rule, cancellation log-privacy assertion, capacity fixture foreign key and exceptional-access outbox payload compatibility. Their logs are evidence of failures, not confirmed exploitation.
- Given cash reporting, then meet the existing core floors of 96% instructions and 97% lines; the assessed run measured ratios of 94% and 95%. Do not lower those floors.
- Given MongoDB 8.0.32, then use a supported runner/kernel combination and record the runtime. Schema/permission and business fixes belong in their owning repositories.

## PIPE-04 provider/consumer contracts

As a consuming service maintainer, I want the provider contract checked against real wire interactions, so a source-compatible build cannot hide an incompatible API. Traces DOD-08/19/20/35–38/40.

- Given a real token issued by Go security, when the Java catalog receives it over NGINX HTTPS, then the administrator request succeeds, a refused role receives 403 and foreign-tenant data stays hidden.
- Given expired, wrong-key, wrong-algorithm or rotated credentials, then the expected 401 and reissued-token behavior is verified; at least the existing 29 live assertions remain.
- Given every Java provider, then its full API First suite checks its published OpenAPI and fails for missing required operation coverage. Commercial's published catalog contract retains its own contract assertions.
- Given an API/schema change, then pin compatible API and DB revisions, keep both design/published contract copies aligned and link their PRs to the same product HU. Validate outbox payloads without loosening database constraints.

## PIPE-05 security remediation

As a release maintainer, I want an accepted dependency and secret baseline, so a known rejected build cannot be published. Traces DOD-14/18/51/56; linked to [SEC-01](../../../13-week/hu-status/Sesi%C3%B3n%202/02-security-backlog.md).

- Given the 106 package-advisory matches, then triage aliases, package/version, severity, fixed version and reachable paths; publish upgrade/removal evidence.
- Given a remediated baseline, then the dependency gate reports zero findings and the authorization/contracts still pass. Scanner/network errors remain blocking.
- Given product adoption, extend resolved dependency and secret inventories to each service and keep exact reviewed-fixture justification; the current shared scan's declared scope is commercial, security and gateway.
- Given an unresolved finding, then the required gate remains red and release publication is skipped. No `continue-on-error` or blanket exception supplies acceptance.

## PIPE-06 image promotion and rollback

As an infrastructure maintainer, I want promotion to use the tested image identity, so deployment is reproducible and reversible. Traces DOD-21/39/46/47/52/53/55.

- Given the tagged candidate, then health, private-route 401, non-root UID, no published business port and cleanup pass; source SHA and image identity are retained.
- Given a release tag, then every final pipeline gate passes and the tag belongs to reviewed main before publication. An existing tag or failed registry lookup blocks publication.
- Given a provisioned target, then apply domain migration tooling before the API, deploy by immutable digest, run smoke checks and record environment/commit/digest. Preserve the single instance per engine and existing volumes.
- Given a failed health probe, then restore the previous approved digest and record recovery time. Rehearse schema-safe rollback before MVP 3; never use `down -v` in QA/main.

## PIPE-07 governed branch adoption

As a repository maintainer, I want develop, qa and main to require the complete gate and review, so a direct push or a missing check cannot bypass the pipeline. Traces DOD-03–05/48–50/55/56/61.

- Given each protected branch, then require `week14-required` from GitHub Actions, up-to-date checks, one approval, stale-review dismissal, resolved conversations and administrator enforcement; disallow force push/deletion.
- Given the course repository, then retain the observed protection evidence. Organization-owned Multi Tour protection/CODEOWNERS changes require the project's authorized governance process.
- Given product promotion, then use the prescribed child branch and `cherry-pick -x`, preserve the existing source SHA and obtain the required main review. Answer automated-review findings with applied changes or technical justification.
- Given adoption PRs, then split the implementation into reviewable batches within norm 9.2 and retain source/version/environment evidence. No product approval or merge is fabricated by this exercise.

## PIPE-08 scale and launch preparation

As the MVP 3 reviewer, I want the remaining DoD evidence assembled before release, so a green smoke test cannot substitute for business readiness. Traces DOD-24–34/43–46/53/54/57–61.

- Given the Phase 1 workload of 10 active tenants, up to 20 internal users and 5,000 registered customers per tenant, then record repeatable workload, latency distributions, failures and tenant isolation.
- Given normal main operations, then check the applicable 3-second DoD objective. Given the last available seat, then concurrent attempts cause no overselling.
- Given affected customer flows, then attach applicable desktop/mobile, accessibility and usability results; sensitive-data, audit, retention and recovery changes include their own evidence.
- Given the launch review, then every applicable matrix row has accepted proof, all P0 blockers are closed and release/rollback evidence is available. Outstanding criteria keep the product story In Progress.
