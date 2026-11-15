# Workshop 13 review - 2026-11-05

## Result

The attack surface, STRIDE evidence, three security stories, role matrix, pipeline proposal,
negative test, minimal fixture and peer review evidence are available from this folder's README.
The GitHub connector confirmed that [PR #580](https://github.com/code-corhuila/multi-tour-docs/pull/580)
is open and unmerged and [#581](https://github.com/code-corhuila/multi-tour-docs/issues/581),
[#582](https://github.com/code-corhuila/multi-tour-docs/issues/582) and
[#583](https://github.com/code-corhuila/multi-tour-docs/issues/583) are open.
The snapshots describe the submitted analysis, not a fresh audit of product implementation.

## Corrections

- Added local copies of STRIDE and issue criteria with source links and the retrieval date.
- Added the six-entry-point role matrix and CP6-CP8 entries in the checkpoint index.
- The test now creates and stops its fixture automatically when external variables are absent.
  Partial or blank external configuration fails instead of skipping the test.
- The fixture checks exact membership of the top-level roles array. A role name in another claim,
  a prefixed role name or a string instead of an array cannot grant administrator access.
- Malformed credentials return 401. The fixture remains unsigned and local; it proves neither
  RS256 verification nor tenant isolation.
- CI proposal has read-only permissions, job timeouts, an explicit NVD key parameter and a pinned
  Dependency-Check version. Its integration step requires external configuration before Maven runs.
- Corrected the run guide to use PowerShell syntax and the module's actual working directory.

## Validation

JDK 21, Maven 3.9; from `04-security-ci/minimal-module`:

```text
mvn -B verify
Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

Also exercised incomplete external configuration with only COLLABORATOR_TOKEN set: Maven failed
with `External mode requires nonblank BASE_URL and COLLABORATOR_TOKEN`, as expected; zero skipped tests.

Workflow lint, using the CP4 directory mounted at `/work`:

```text
docker run --rm -v <absolute-CP4-path>:/work:ro rhysd/actionlint:1.7.7 -shellcheck= /work/security.yml
```

Result: exit 0, no diagnostics. ShellCheck is disabled in this container invocation;
this validates actionlint's workflow checks, not execution of the three jobs.

## Alignment and remaining work

| Status | Rule / evidence | Assessment |
|---|---|---|
| CUMPLE | Anexo I, ci.yml | Proposal now declares contents:read and timeout-minutes for every job |
| NO APLICA | Anexo C, full hexagonal layout | Minimal fixture is a test aid, not the production API |
| NO CUMPLE as production authentication | Anexo C 5.3.7 | Fixture intentionally does not check signature, RS256, expiration or subject. Real-service verification is still required |
| NO CUMPLE as completed security stories | #581-#583 acceptance criteria | One fixture registration case does not prove all role routes, audit evidence, invalid signatures or tenant isolation |
| CONFLICTO CON NORMA, external evidence | Norma 9.2 / Conventional Commit title | Existing PR #580 title is not a Conventional Commit. Suggested title: `docs(security): model catalog gateway threats`. Remote title was not changed |
| ABIERTO | Delivery evidence | PR approval/merge, service CI execution and reflection-document contents are not established by the local checks |

The security workflow is a proposal for the service repo's root pom.xml. It is not installed as a
workflow in this educational fork. Integration into the actual service needs a CI-accessible running
target and short-lived credentials. No issues, PR metadata, reflection documents or remote files
were modified during this local review.
