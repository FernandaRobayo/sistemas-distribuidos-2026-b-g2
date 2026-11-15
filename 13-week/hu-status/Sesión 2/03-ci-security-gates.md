# Executable CI security gates

The course workflow evaluates Multi Tour's commercial-reservation, security and gateway snapshots at the revisions used by session 1. Authorization verification also exercises identity-audit, cash-reporting, operations-cost and the event relay through the reusable session 1 workflow. Each job has read-only repository permissions and a bounded timeout. [Session 2 workflow](../../../.github/workflows/week13-threat-model-security.yml), [authorization workflow](../../../.github/workflows/week13-security.yml)

## Gate policy

The following policy is PROPUESTO (session 2 CI policy). It is the exercise's explicit threshold and can be reviewed by the team for its release workflow.

| Gate | Inputs and threshold | Blocking behavior | Evidence |
|---|---|---|---|
| Dependencies | Commercial aggregate runtime CycloneDX BOM and security/go.mod, scanned by OSV-Scanner 2.7.1 with an explicit configuration containing zero vulnerability suppressions | Any reported advisory returns exit 1. Resolution, scanner or report errors fail the job | BOM, raw OSV output and dependency-summary.json |
| Secrets | Pinned commercial/security/gateway source exports and course changes since the origin/main merge base, scanned by Gitleaks 8.30.1 | Any unreviewed finding returns exit 1. Scanner errors also fail | Fully redacted reports and secret-summary.json |
| Authorization | Real service verifier/HTTP tests and the live HTTPS Go-to-Java exercise from session 1 | An unexpected status, data change, disclosure or skipped security database coverage fails verification | Per-component logs and completion.json in the authorization artifact |

The jobs run independently so a dependency block still allows authorization evidence to be collected. Their exit codes determine the workflow result. The workflow uses no continue-on-error bypass. Downloaded scanner binaries are pinned to a release and checked against that release's SHA-256 manifest before execution.

## Current findings and their treatment

The dependency scan completed and blocked the assessed baseline with 106 package-advisory matches across 15 package versions on 2026-11-15. Multiple advisory IDs can share aliases, so the match count is kept separate from a count of unique vulnerabilities. SEC-01 records the remediation and reachability review. The source revisions and inventory remain in the report. [Dependency evidence](evidence/dependency-summary.json), [SEC-01](02-security-backlog.md)

The native Windows scan initially reported 11 matches. Four are Idempotency-Key test inputs. Six are synthetic password/token/idempotency values inside Go test fixtures. One is a CRLF-dependent multiline match spanning empty variables in .env.example. The first Linux scan reported the ten test inputs. Each reviewed item binds the UTF-8 source SHA-256 after CRLF-to-LF normalization, line and scanner rule to its justification. A content change or a new finding loses that classification and blocks the gate. The reviewed-fixture file defines no directory-wide exclusion. [Reviewed fixtures](reviewed-fixtures.json), [secret evidence](evidence/secret-summary.json)

The gate self-test exercises four controlled scanner cases. Clean text and a synthetic package without an advisory pass. A dynamically generated inert token and a known vulnerable Log4j 2.14.1 fixture return exit 1. Three additional checks prove that reviewed content is accepted across LF/CRLF and that changed content is rejected. The synthetic token is created in a temporary directory and removed after the test. [Self-test evidence](evidence/gate-self-test.json)

## Reproduce

Use Node 22+, Git, tar, JDK 21, Maven 3.9, OSV-Scanner 2.7.1 and Gitleaks 8.30.1. Full authorization integration uses the Linux/Docker environment documented in session 1. The following commands run from the course repository, using a fresh temporary source-export directory.

```powershell
$sources = Join-Path $env:TEMP ('multi-tour-session2-' + [guid]::NewGuid().ToString('N'))
node './13-week/hu-status/Sesión 2/prepare-sources.mjs' $sources
node './13-week/hu-status/Sesión 2/gate-self-test.mjs'
node './13-week/hu-status/Sesión 2/secret-gate.mjs' $sources
node './13-week/hu-status/Sesión 2/dependency-gate.mjs' $sources
```

OSV_SCANNER and GITLEAKS override executable paths. WORKSHOP_PRODUCT_ROOT uses existing local product repositories for export. Without that variable the preparation script fetches the exact public revisions into its temporary workspace. The dependency command currently exits 1 because of the recorded advisories. Scanner/network failures also fail and require retry or diagnosis.

The Linux CI installer downloads the official release binaries and verifies their checksum manifests. Raw SBOMs and scanner reports are uploaded as workflow artifacts. Selected summaries are included in this delivery. Public advisory data is refreshed on each scan, so findings can change while source revisions remain fixed. [OSV source scanning](https://github.com/google/osv-scanner/blob/v2.7.1/docs/scan-source.md), [OSV output and CVSS fields](https://github.com/google/osv-scanner/blob/v2.7.1/docs/output.md), [CycloneDX Maven plugin](https://github.com/CycloneDX/cyclonedx-maven-plugin), [Gitleaks usage and redaction](https://github.com/gitleaks/gitleaks/tree/v8.30.1)

## Handoff to next week's CI/CD activity

Promotions should retain the source revision, runtime BOM, scan date, gate results and authorization artifact. SEC-01 must supply an accepted dependency baseline before release can pass this policy. Deployment/protection policy remains subject to the project's existing promotion rules and review. The activity installs the three security gates in the course CI, with the existing team issues and proposed remediation work providing the release backlog.

CUMPLE (Annex I), the three gates are executable, report their outcomes and return a blocking exit code for their defined failures. NO CUMPLE (release readiness), the assessed dependency baseline is blocked by reported advisories. CUMPLE (norm 5.3.7 / Annex C), the selected service-local verifier and authorization checks have passing evidence from session 1.
