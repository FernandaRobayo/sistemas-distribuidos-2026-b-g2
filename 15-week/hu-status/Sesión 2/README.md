# Week 15 — Session 2 — MVP 3 release and operability

Maria Fernanda Robayo Laguna · FernandaRobayo · ErrorCapa8

## Published release

The release audit found annotated `v3.0.0` tags in all 30 repositories referenced by the tagged root composition. For the eleven backend components used by this verification, the tag resolves to the release merge commit on protected `main`. Every corresponding release PR records the professor's approval. These published releases provide the promotion and tag evidence for this session. The audit used the existing release commits.

The eleven PRs contain 452 release commits. Their 446 direct QA cherry-pick trailers resolve to commits reachable from the audited QA heads. Six controlled changelog commits complete the releases. The last trailer identifies the direct QA source, while earlier retained trailers describe preceding promotions. Full paginated commit lists were inspected.

| Release evidence | Location |
|---|---|
| Thirty composition repository tags | [Composition inventory](./evidence/composition-tags.json) |
| Eleven immutable verification commits | [Source lock](./sources-lock.json) |
| Tag objects, main heads and comparisons | [Release tags](./evidence/release-tags.json) |
| PRs, teacher approvals and QA ancestry | [Promotion audit](./evidence/promotion-audit.json) |
| Cash API release | [PR 100](https://github.com/code-corhuila/multi-tour-cash-reporting-api/pull/100) |
| Commercial API release | [PR 526](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/pull/526) |

## Operability verification

The final workflow completed on source `12ad47ae4b6f470103982517ffbf38599dc89db1`. The aggregate result is **failure** because the native quality and dependency findings below remain open. [CI run 43802517726](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/actions/runs/43802517726)

| Observed result | Evidence |
|---|---|
| Seven system tests passed, zero failures/errors/skips | [JUnit report](./evidence/junit.txt) |
| Twenty-nine issuer-consumer checks and 49 cash response validations passed | [Contract report](./evidence/issuer-consumer-contract.json) and [response count](./evidence/response-contracts.json) |
| Healthy load completed 800 requests with zero errors, p95 21.19 ms and maximum 130.58 ms | [Load](./evidence/load.json) |
| Chaos returned 503 in 2.004 seconds and recovered in 5.161 seconds with money preserved | [Degradation](./evidence/chaos-degradation.json) and [recovery](./evidence/chaos-recovery.json) |
| Backup restoration and known-image redeployment passed in 5.573 seconds | [Rollback](./evidence/rollback.json) |
| Concurrent stress produced 540 healthy cash responses and 141 expected 503 responses, with every check passing and money preserved | [Stress and failure](./evidence/stress-failure.json) |
| Secret gate passed with zero unreviewed findings | [Secret summary](./evidence/secret-summary.json) |
| Ten artifact ZIP digests matched GitHub's SHA-256 values | [Artifact digests](./evidence/artifact-digests.json) |

The workflow exports the exact `v3.0.0` commits, builds the published Dockerfiles and runs the real service images in a disposable network. The release suite inherits the five Session 1 tests and adds PostgreSQL recovery with image redeployment and simultaneous load with service failure. The separate jobs run six native service suites, issuer-consumer contracts, dependency scanning and secret scanning.

| Criterion | Executable verification |
|---|---|
| Integration and money | PostgreSQL Testcontainers, domain runtime accounts, two cash monetary backend E2Es, retries, persisted balances and tenant isolation |
| Healthy-load SLO | 20 VUs, 10 tenants, 40 seconds, at least 400 authenticated reads, p95 and maximum below 3 seconds, error rate below 1%, every response/identity check passing |
| Chaos | Stop the suite's cash container, observe correlated 503 within 3 seconds, check gateway health and independent security response, restart and verify the same money and session |
| Rollback | Dump the fixture database, make a synthetic post-backup write, inject a candidate startup exit 42, restore the dump, redeploy the known image ID and verify the recovery-point session and balance |
| Stress with failure | Run 20 VUs for 40 seconds while stopping and restarting cash. Require healthy responses and explicit degraded responses, correct correlation and tenant data, gateway continuity and preserved money |
| Security | Real issuer/consumer authorization, runtime isolation, reviewed synthetic fixtures and dependency scanning |
| Native quality | Full native suites, API First contracts, existing module coverage floors and recorded per-service coverage baselines |

The rollback recovers the 100,000-cent backup balance and discards the 50,000-cent synthetic post-backup write. The reported recovery time measures this fixture's recovery point and image redeployment. The candidate startup failure is injected through its test-container entrypoint. PostgreSQL administrator credentials are confined to fixture setup and recovery operations. Runtime cash and security accounts keep their domain permissions.

The healthy-load thresholds apply to the declared CI workload. The fault-window probe counts expected 503 responses explicitly and verifies their envelope. Deployment-wide capacity and monthly availability require their corresponding operational evidence. The fixture uses HTTP internally and loopback access. The separate issuer-consumer suite exercises HTTPS.

## Reproduce the demonstration

From this delivery branch, dispatch the release operability workflow and inspect its system artifact.

```powershell
gh workflow run week15-release-operability.yml `
  --repo FernandaRobayo/sistemas-distribuidos-2026-b-g2 `
  --ref docs/15-week-session2-mvp3
```

The automated demonstration executes healthy cash traffic, a controlled cash outage, recovery, a backup restore with known-image redeployment, and sustained traffic across a second outage. The raw k6 summaries, JUnit report, image IDs, source revisions and service logs make each stage reviewable.

For a Docker-capable Linux checkout with Node 22, Java 21 and Maven, use the scoped source lock, bootstrap the images and execute the release test class.

```bash
export WORKSHOP_SOURCES_LOCK='15-week/hu-status/Sesión 2/sources-lock.json'
node '14-week/hu-status/Sesión 2/prepare.mjs' /tmp/mvp3-sources all
node '15-week/hu-status/Sesión 1/bootstrap.mjs' /tmp/mvp3-sources
# Export the SOURCES_DIR and image variables printed by bootstrap.
cd '15-week/hu-status/Sesión 1/harness'
mvn -B -ntp -Dtest=Mvp3ReleaseTest test
```

## Team evidence

Both contributing members have a published Week 15 HU Status with filled configuration, all six sections, recognized statuses and evidence URLs on every story row. The audit preserves each source blob and commit. Fernanda's weekly status includes this session's release audit and operational rehearsal. Jhon's published contribution includes his release PRs, load/chaos output, rollback preparation and declared gaps. The two authors' evidence remains attributed to their own accounts. [Team evidence audit](./evidence/team-evidence-audit.json)

## Final handoff

| Finding to resolve | Verification result |
|---|---|
| Commercial cancellation-log privacy assertion | 2,529 cases, one failure, zero skips. `CancellationHttpTest.theEventsAndTheLogsCarryNoPersonalDataNorTheReason` failed. Supplying the fixture administrator credentials also exercised the previously skipped retention restore test. [Native summary](./evidence/service-commercial.json) |
| Security account-creation assertion | 1,010 passed test events and one failing test, `TestC_ATakenEmailIsRefusedSayingWhoseItIsAndCreatesNothing`. It received 422 for a disabled tenant role. [Native details](./evidence/security-native-details.json) |
| Cash native core coverage | 361 core cases passed. Instruction coverage reached 94.5% against the native 96% floor. The native line check reported 95% against 97%. The reactor stopped at that gate. [Cash summary](./evidence/service-cash-reporting.json) |
| Operations coverage regression | 713 cases passed, coverage 73.4% against the recorded 73.9% baseline. [Operations summary](./evidence/service-operations-cost.json) |
| Runtime dependency advisories | 106 package-advisory matches across 15 package versions. Advisory aliases appear separately in this count. [Dependency report](./evidence/dependency-summary.json) |

Identity-audit passed 510 cases at 73.1% instruction coverage. Relay passed 94 Go test events at 75% statement coverage. The source owners can reproduce each remaining finding with the frozen lock and native runner. Fernanda owns the commercial and cash services, and Jhon owns security and operations.

The release checklist records deployment procedures and rollback instructions in each release PR. The tagged root composition supplies `scripts/up.sh`, backup and restore tooling. Environment secrets, service tokens and signing keys come from the target environment's configuration. The eleven-component CI verification covers the listed backend snapshots. Platform-wide MongoDB recovery and a target-environment rehearsal remain items for the final handoff.

The full operability result and remaining findings are recorded with the CI evidence below. Weekly stories retain `doing` while applicable DoD findings remain open.

## Norm alignment

- **CUMPLE**, norm 10.3–10.5 and 11.2, for the 446 inspected direct QA promotion sources and six controlled changelog commits.
- **CUMPLE**, norm 9.5 and 11.5, for the eleven inspected main-release approvals and their annotated version tags.
- **CUMPLE**, Anexo J, for the disposable single-PostgreSQL fixture, owner-managed schema scripts and domain runtime accounts.
- **NO CUMPLE**, complete operability acceptance, while the applicable native verification and dependency findings remain open.
- **ABIERTO**, norm 9.2, for the existing release PRs that declare diffs above the ordinary 400-line limit. Their approvals are recorded, and the audit found no general written size exception.
