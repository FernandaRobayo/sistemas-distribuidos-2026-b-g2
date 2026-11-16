# Week 15 — Session 1: testing Multi Tour

This exercise extends the Week 14 blocking pipeline with a real, disposable backend environment. Session 2 remains the MVP 3 release session. Passing this exercise does not override the existing release gates.

## Verified result

[Final CI run 43798627784](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/actions/runs/43798627784) passed on source `1077d6e6eec48e8a4205e1f981b1c0c84049b482`. All five JUnit tests passed with zero errors, failures or skips. The separate real issuer-consumer suite passed 29 checks; 41 cash HTTP responses also passed published OpenAPI validation.

| Evidence | Observed result |
|---|---|
| PostgreSQL integration | Domain runtime account, no superuser or foreign-schema access, private cash/security ports |
| Monetary path 1 | Total 134,000,000 cents; cash 5,000,000; two movements, one closure |
| Monetary path 2 | Total 1,300,000 cents; cash 800,000; retries did not duplicate money; reopening, retained closure and tenant isolation passed |
| k6 | 800 requests / 40 seconds / 20 VUs / 10 tenants; p95 34.76 ms, maximum 148.77 ms, zero HTTP errors; all identity/status checks and thresholds passed |
| Chaos degradation | Neutral correlated 503 in 2.005 seconds; gateway health 200 and independent security service response 401 |
| Recovery | 5.828 seconds; same session and 100,000 cents preserved |

[Run provenance](./evidence/run.json), [JUnit result](./evidence/junit.txt), [raw k6 summary](./evidence/k6-summary.json), and [report hashes](./evidence/sha256.json) are archived here. Both downloaded artifact ZIP hashes matched GitHub's SHA-256 digests. Full service logs remain in the CI artifact. The response precision observation was 127 ns; it is included in [monetary path 2](./evidence/monetary-two.json).

The test exercise is complete. HU-CSH-001 remains `doing` in weekly status because the full product DoD and MVP 3 release still have the Week 14 blockers listed below. The pipeline changes are published on the delivery branch and await integration through review; this exercise does not merge permanent branches or publish a release.

## Acceptance criteria and implementation

| Requirement | Executable acceptance criterion | Implementation |
|---|---|---|
| Integration with test containers | Real PostgreSQL 18 accepts the domain runtime account; it is not a superuser and cannot use the security schema. Cash and security expose no host ports. | JUnit 5 + Testcontainers, test 1 |
| Monetary E2E 1 | Gateway → cash API → PostgreSQL: open with 30,000,000 cents, expense 25,000,000, transfer income 129,000,000, close; total 134,000,000 and expected cash 5,000,000; exactly two persisted movements and one closure. | Test 2 |
| Monetary E2E 2 | Repeat an opening and a post-close transfer without duplication, reopen the same session, retain closure history and isolate another tenant; total 1,300,000 and expected cash 800,000 cents. Replay fields remain identical; its timestamp equals the stored instant and differs from creation by at most the verified PostgreSQL microsecond precision. | Test 3 |
| Contract tests in CI | Validate cash responses against its published OpenAPI snapshot; also run the existing real Go issuer → Java consumer contract suite. Any mismatch fails CI. | Response validator and reusable `week13-security.yml` contract-only job |
| Load against SLO | Authenticated reads with 20 virtual users across 10 tenants for 40 seconds; p95 and maximum below 3 seconds, HTTP failure rate below 1%, every identity/status check passing, at least 400 requests. | Test 4, k6 1.3.0 |
| Chaos and recovery | Stop only this suite's cash container. Gateway returns a neutral, correlated 503 in less than 3 seconds; gateway health and the independent security service remain responsive. Restart that same cash container, recover within 90 seconds, preserve session ID and 100,000 cents. | Test 5 |
| Blocking integration | The existing protected `week14-required` check requires `system_tests` whenever the path plan selects smoke tests. Existing service, contract and security gates remain required. | `week14-final-pipeline.yml` |

These are backend HTTP end-to-end paths through the actual gateway, service image and database. They do not include a browser, external payment provider or the entire commercial-reservation-to-cash saga. Those broader journeys require their own fixtures and acceptance evidence.

## Reproducibility and isolation

The exercise exports the immutable Week 14 Session 2 source lock using `prepare.mjs`. No product repository working tree is modified. It builds each original cash, security and gateway Dockerfile and records source revisions and resulting image IDs. Upstream base images are not digest-pinned, so image IDs describe this run rather than guaranteeing bit-identical rebuilds.

The fixture applies the owning repositories' DDL and DCL to one disposable PostgreSQL instance. Only fixture initialization uses the administrator. Runtime services use `cash_reporting_app` and `security_app`; monetary assertions use the cash account. RSA keys and passwords are generated at runtime, never committed. Testcontainers owns cleanup; chaos targets its own container ID and restarts it in `finally`. Only PostgreSQL fixture access and the gateway bind ephemeral loopback ports.

The isolated fixture uses HTTP; it is not evidence of production TLS configuration. The separate existing issuer-consumer suite exercises HTTPS. Cash-test JWTs are generated by the harness to isolate the monetary scenarios; real issuer interoperability is checked by that separate contract job.

On a Docker-capable machine with Node 22, Java 21 and Maven:

```bash
node '14-week/hu-status/Sesión 2/prepare.mjs' /tmp/week15-sources all
node '15-week/hu-status/Sesión 1/bootstrap.mjs' /tmp/week15-sources
# Export SOURCES_DIR, CASH_IMAGE, SECURITY_IMAGE and GATEWAY_IMAGE from bootstrap's output.
cd '15-week/hu-status/Sesión 1/harness'
mvn -B -ntp test
```

GitHub Actions exports those variables automatically. JUnit XML, individual assertions, source/image provenance, k6 metrics and redacted service logs are retained in `week15-system-evidence`; the issuer-consumer suite retains its separate evidence artifact.

## SLO interpretation

The three-second response target comes from the project's DoD. The percentile, error budget, 20-user workload and recovery window are **PROPUESTO (FUENTE this exercise's acceptance criteria)** operational choices. This 40-second CI probe verifies its stated workload only. It does not establish the complete Phase 1 population capacity or monthly availability SLO. Load runs before fault injection; chaos is assessed separately.

## Release readiness and norm alignment

The initial executable run exposed an overly strict test expectation: creation used a nanosecond `registeredAt`, whereas replay returned PostgreSQL's microsecond value. The published contract requires the stored result without duplicate writes and RFC 3339 timestamps; it does not require byte-identical timestamp precision. The corrected test verifies the column's actual precision is six digits, checks the replay timestamp equals the persisted instant, limits creation-to-replay drift to one microsecond and compares **every other response field exactly**. It also checks persisted counts, balances, closure history and tenant isolation. Timestamp drift and exact-representation stability are retained in the evidence rather than hidden.

**PROPUESTO (FUENTE test 3):** the cash owner may standardize creation/replay timestamp formatting to make client comparisons simpler. This is an optional consistency improvement, not evidence of duplicated money or a failed contractual idempotency guarantee.

The Week 14 audit still blocks MVP 3: commercial native suite failures, cash core coverage below its existing floors, and dependency advisories. Building an image with its original `-DskipTests` Dockerfile does not waive those independent native-suite/coverage/security gates. No release tag or production deployment is created here.

- **CUMPLE — Anexo J:** one PostgreSQL instance in this scoped fixture, owner-managed SQL, domain runtime users and schema isolation. MongoDB and other domains are outside this cash-focused fixture, not removed from the product architecture.
- **CUMPLE — Anexo C / Anexo I:** published HTTP contracts, testable idempotency, CI failures on unmet criteria, runtime configuration and generated secrets.
- **ABIERTO — release acceptance:** complete the existing failed gates and obtain the required review before Session 2 release; broader browser/saga and population-scale evidence remains separate.

Implementation uses [Testcontainers JUnit 5](https://java.testcontainers.org/test_framework_integration/junit_5/) and [PostgreSQL module](https://java.testcontainers.org/modules/databases/postgres/). [k6 thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/) make unmet load criteria fail the process.
