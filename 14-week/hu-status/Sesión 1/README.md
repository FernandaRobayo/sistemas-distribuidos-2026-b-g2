# Week 14 - Session 1: Multi Tour CI/CD

Maria Fernanda Robayo Laguna · FernandaRobayo · ErrorCapa8

This delivery adds executable CI/CD to the course repository using real Multi Tour sources. The detailed build, type, coverage and image target is `multi-tour-security` at the immutable revision in the [source lock](../../../13-week/hu-status/Sesi%C3%B3n%201/sources-lock.json). Shared security verification also exercises the commercial, identity-audit, operations-cost and cash-reporting APIs, gateway and event relay. This is a representative service pipeline, not a claim that every product repository has been reconfigured.

## Blocking PR gates

The [workflow](../../../.github/workflows/week14-cicd.yml) runs for every PR targeting main, develop or qa, without path filters. PR jobs have read-only repository permissions and bounded timeouts. `week14-required` runs even after a dependency job fails and accepts only successful quality and security results; failure, cancellation or skipping blocks it.

| Requested gate | Executable check | Failure threshold |
|---|---|---|
| Compilation | `go build ./...` | Any compiler error |
| Static analysis | `gofmt -l .` and `go vet ./...` | Any unformatted file or analyzer error |
| Types | `go test -run=^$ ./...` | Production or test package fails Go's static type checking |
| Tests | Full `go test -count=1 -json` with disposable PostgreSQL | Any failure, zero executed tests or any skipped test |
| Coverage | `-coverpkg=./... -coverprofile=...` and `go tool cover` | Missing/invalid report or statement coverage below 80% |
| Security | Reusable dependency, secret and service authorization jobs | Reported advisory, unreviewed secret or failed authorization check |
| Image startup | Build a SHA-tagged candidate and run the preview checks | Wrong image ID, root user, published business port, unhealthy process or absent-token response other than 401 |

The 80% coverage threshold is PROPUESTO (session 1 quality policy). Go compilation checks static types; this service has no TypeScript build. The complete module supplies the coverage denominator, with no production package excluded. Code and tests are exported with LF line endings to avoid Windows checkout conversion changing the format check. [Quality runner](quality.mjs)

Dependency security retains the explicit session 2 policy: every reported advisory blocks. The previously assessed baseline reports 106 package-advisory matches across 15 package versions. These are inventory matches, including aliases, rather than 106 unique vulnerabilities. Remediation and reachability assessment remain SEC-01. [Security policy and evidence](../../../13-week/hu-status/Sesi%C3%B3n%202/03-ci-security-gates.md)

## Main protection

Main protection was applied to `FernandaRobayo/sistemas-distribuidos-2026-b-g2`, the course repository, and read back through GitHub's API. It requires a PR, one approving review, dismissal of stale approvals, resolved conversations, an up-to-date branch and the GitHub Actions `week14-required` check. Administrators are included. Force pushes and branch deletion are disabled. [Requested policy](main-protection.json), [observed settings](evidence/main-protection.json)

The activity explicitly requests protection. Organization-owned Multi Tour protections and CODEOWNERS were not edited. Applying the workflow to main still requires the normal PR/review process; this delivery does not merge itself or approve itself.

## Tagged image deployment

The PR quality job builds `multi-tour-security:ci-<delivery SHA>` using the product Dockerfile, with Go 1.26.9 and Alpine 3.24.2. OCI revision metadata identifies the product source SHA; a separate label identifies the course delivery SHA. [Deployment verifier](preview.mjs)

The verifier deploys that tagged image in an isolated Docker network with disposable PostgreSQL and a `security_app` runtime identity. It generates short-lived test signing keys outside the repository, mounts them read-only, waits for health, verifies the running image ID, non-root user, absence of published service ports and HTTP 401 without credentials. Containers, network and generated keys are removed afterward. This is a startup/authentication smoke test; the shared authorization job supplies the broader functional security evidence. The preview creates no persistent QA/production schema or volume.

A push of `security-v<major>.<minor>.<patch>` runs all gates. Only after `week14-required` succeeds does the release job verify tag syntax and ancestry in reviewed main, reject an existing registry tag, build/push the versioned image to GHCR, pull it back and deploy it into the same disposable exercise environment. Registry write permission exists only in this gated release job. PRs cannot publish images. The registry credentials use GITHUB_TOKEN and are not stored in files.

The current dependency findings block release publication and the release deployment job. The candidate preview remains an isolated integration test. No production release tag is created by this activity, and no external server is configured. A persistent Multi Tour rollout must use its infra-owned databases, domain migration tooling, environment secrets and approved release promotion, preserving Annex J data ownership and volumes.

## Reproduce and inspect

From the course root, use Node 22, Go 1.26.9, Docker and Git:

```powershell
$sources = Join-Path $env:TEMP ('week14-' + [guid]::NewGuid().ToString('N'))
$evidence = Join-Path $env:TEMP ('week14-evidence-' + [guid]::NewGuid().ToString('N'))
node './13-week/hu-status/Sesión 2/prepare-sources.mjs' $sources
node './14-week/hu-status/Sesión 1/quality.mjs' "$sources/security" $evidence
$image = 'multi-tour-security:week14-local'
docker build -t $image "$sources/security"
node './14-week/hu-status/Sesión 1/preview.mjs' "$sources/security" $evidence $image
gh api repos/FernandaRobayo/sistemas-distribuidos-2026-b-g2/branches/main/protection
```

CI artifacts retain quality logs, JSON test output, textual/HTML coverage, source revisions, redacted scanner reports and deployment identity. [CI executions](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/actions/workflows/week14-cicd.yml?query=branch%3Adocs%2F14-week-session1-cicd)

CUMPLE (Annex I): executable PR checks, read-only CI permissions and timeouts. CUMPLE (norm 5.6.1): the deployed API preview publishes no business port. CUMPLE (Annex J.3): the runtime uses its domain account and no foreign-domain writes. NO CUMPLE (release readiness): the assessed dependency baseline violates the security gate. Production promotion remains governed by norm 6.2 and 9.5; no production release is claimed.

Session 2 should map the project's DoD to these checks and split the pipeline work for MVP 3, including SEC-01 remediation, coverage expansion to other components, persistent environment deployment and rollback validation.

References: [Go testing and coverage flags](https://pkg.go.dev/cmd/go#hdr-Testing_flags), [Go static analysis](https://go.dev/doc/cmd), [GitHub required status checks](https://docs.github.com/en/pull-requests/reference/status-checks), [branch-protection API](https://docs.github.com/en/rest/branches/branch-protection), [Docker image publication](https://docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images).
