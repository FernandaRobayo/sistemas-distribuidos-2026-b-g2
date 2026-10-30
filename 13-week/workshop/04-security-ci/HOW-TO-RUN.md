# How to run the negative authorization test

## What it proves

`CatalogRolesAuthzTest.collaboratorCannotRegisterCatalogService` covers **story #581, criterion 1**
(https://github.com/code-corhuila/multi-tour-docs/issues/581): a token of `OPERATIONAL_COLLABORATOR`
sent to `POST /catalog/services` must get `403`. This closes the threat E of PR #580.

## What it runs against

`multi-tour-commercial-reservation-api` is not built yet, so the test runs against a **minimal module**
(`minimal-module/`): a JDK `HttpServer` that only applies the role rule of the story. It does **not**
verify the token signature, so it proves the test, not the real service.

## Run it

```
cd minimal-module
mvn -B compile
java -cp target/classes co.edu.corhuila.multi_tour.commercial_reservation.catalog.MinimalCatalogServer
```

In another terminal, with a token whose `roles` claim is `OPERATIONAL_COLLABORATOR`:

```
set BASE_URL=http://127.0.0.1:8083
set COLLABORATOR_TOKEN=<token>
mvn -B test -Dtest=CatalogRolesAuthzTest
```

Without both variables the test is skipped, it does not fail.

## Real output, 2026-10-30

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

## What is still missing

The same test must run against the real service when it exists, with a token signed by
`multi-tour-security`.
