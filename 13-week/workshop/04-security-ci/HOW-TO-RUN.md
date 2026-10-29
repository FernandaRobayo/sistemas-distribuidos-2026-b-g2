# How to run the negative authorization test

## What it proves

`CatalogRolesAuthzTest.collaboratorCannotRegisterCatalogService` covers **story #581, criterion 1**
(https://github.com/code-corhuila/multi-tour-docs/issues/581): a token of `OPERATIONAL_COLLABORATOR`
sent to `POST /catalog/services` of `multi-tour-commercial-reservation-api` must get `403`.
This closes the threat E of PR #580.

## Run it locally

1. Start `commercial-reservation-api` (port 8083) and get an access token of a user with the role
   `OPERATIONAL_COLLABORATOR` from `multi-tour-security`.
2. Set the two variables and run the test from the Maven module of the service:

```
set BASE_URL=http://localhost:8083
set COLLABORATOR_TOKEN=<token of an Operational Collaborator>
mvn -B test -Dtest=CatalogRolesAuthzTest
```

Without both variables the test is skipped, it does not fail.

## Where it runs

`security.yml` has three jobs on every pull request: `secret-scan` (gitleaks), `dependency-audit`
(OWASP dependency-check, fails from CVSS 7) and `authz-tests` (this test).

## Status

The service is not built yet, so the test has not run. CP8 runs it against a minimal module and
pastes the real console output here. `security.yml` is a proposal for the team pipeline and has
not run in GitHub Actions yet.
