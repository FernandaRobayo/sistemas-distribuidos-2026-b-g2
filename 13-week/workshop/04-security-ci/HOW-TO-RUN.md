# How to run the negative authorization test

## What it proves

`CatalogRolesAuthzTest.collaboratorCannotRegisterCatalogService` covers **story #581, criterion 1**
(https://github.com/code-corhuila/multi-tour-docs/issues/581): a token of `OPERATIONAL_COLLABORATOR`
sent to `POST /catalog/services` must get `403`. This exercises one case of threat E in PR #580;
the real service, the other two restricted routes and audit evidence are still pending.

## What it runs against

`multi-tour-commercial-reservation-api` is not built yet, so the test runs against a **minimal module**
(`minimal-module/`): a JDK `HttpServer` that only applies the role rule of the story. It does **not**
verify the token signature, so it proves the test, not the real service.

## Run the local exercise (PowerShell)

Requires JDK 21 and Maven 3.9 on PATH. From the repository root:

```powershell
cd 13-week/workshop/04-security-ci/minimal-module
mvn -B verify
```

With neither environment variable set, the test starts and stops the fixture on a free loopback port.
It creates a synthetic unsigned token in memory. No external service or secret is needed.
The four other tests cover exact role membership, names of roles in unrelated claims,
malformed credentials and unsupported methods. No test is skipped.

## Test a running service

Use a short-lived collaborator token issued by multi-tour-security. Supply the base URL including
any deployed API prefix; the test appends `/catalog/services`.

```powershell
$env:BASE_URL = 'http://127.0.0.1:8083/api/v1'
# Supply COLLABORATOR_TOKEN through your session's secret configuration.
mvn -B verify '-Dtest=CatalogRolesAuthzTest'
```

When either variable is supplied, both must be nonblank; incomplete configuration fails.
To return to the local fixture, remove both environment variables from the session.

For a standalone fixture process, run `mvn -B compile dependency:copy-dependencies`, then:

```powershell
java -cp 'target/classes;target/dependency/*' co.edu.corhuila.multi_tour.commercial_reservation.catalog.MinimalCatalogServer
```

The fixture binds only to 127.0.0.1, on PORT (default 8083). It decodes the top-level roles array
and checks exact membership. It intentionally does not verify signature, alg, exp, sub or tenantId;
it cannot establish compliance with story #582 or production authentication rules.

## Review output, 2026-11-05

```text
Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

## Historical output, 2026-10-30

Request by role (`curl -X POST /catalog/services`):

```
Operational Collaborator  -> 403
Tenant Administrator      -> 201
no token                  -> 401
```

Test with the Collaborator token (expected green):

```
[INFO] Running co.edu.corhuila.multi_tour.commercial_reservation.catalog.CatalogRolesAuthzTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 2.432 s
[INFO] BUILD SUCCESS
```

Check that the test can fail: the Administrator token sent as the Collaborator (expected red):

```
[ERROR] Tests run: 1, Failures: 1, Errors: 0, Skipped: 0, Time elapsed: 2.109 s <<< FAILURE!
Expected status code <403> but was <201>.
[INFO] BUILD FAILURE
```

## Workflow validation

`security.yml` checked with YAML Lint ("Valid YAML!") and with actionlint 1.7.7
(`docker run --rm -v <folder>:/wf rhysd/actionlint:1.7.7 /wf/security.yml`): no output, exit code 0.
It has not run in GitHub Actions yet; it is a proposal for the team pipeline.

Review of 2026-11-05: actionlint 1.7.7 passed again. The proposal now limits permissions to
contents:read, bounds each job with a timeout, pins Dependency-Check and explicitly passes its NVD key.
The integration job fails when its URL or token is absent, so it cannot fall back to the fixture.
The file is a service-repository proposal: it assumes a root pom.xml and the test installed in that
service. It is stored outside `.github/workflows` here and does not execute automatically in this fork.
The product's required Java `mvn -B verify` CI remains necessary in addition to these security gates.

## What is still missing

The same test must run against the real service when it exists, with a token signed by
`multi-tour-security`.
