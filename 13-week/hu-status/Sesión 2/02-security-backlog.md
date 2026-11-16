# Prioritized Multi Tour security backlog

This backlog converts the assessed threats into verifiable work for MVP 3. New entries and proposed owners are PROPUESTO (session 2 assessment). Existing GitHub issues #581, #582 and #583 were checked on 2026-11-15 and remain open. PR #580 was merged on 2026-11-11. The course delivery records proposals locally and preserves the team's remote issue state. [#581](https://github.com/code-corhuila/multi-tour-docs/issues/581), [#582](https://github.com/code-corhuila/multi-tour-docs/issues/582), [#583](https://github.com/code-corhuila/multi-tour-docs/issues/583), [PR #580](https://github.com/code-corhuila/multi-tour-docs/pull/580)

| Order | Work item | Threat | Priority | Proposed owner | Verification state |
|---|---|---|---|---|---|
| 1 | SEC-01 restore a dependency baseline accepted by the gate | T07 | P0 triage | Commercial API and security maintainers | Open, dependency scan blocks the pinned baseline |
| 2 | SEC-02 complete catalog write authorization and audit, existing #581 | T06 | P0 | Commercial API maintainer with identity-audit maintainer | Role checks verified, audit criterion still open |
| 3 | SEC-03 prevent committed credentials and rotate exposed keys | T08 | P0 prevention | Platform and CI maintainers | Secret gate and synthetic-leak rejection verified |
| 4 | SEC-04 reject invalid identities at each service, existing #582 | T01 | P1 | Commercial API and infrastructure maintainers | Token checks verified, promoted-network isolation remains to verify |
| 5 | SEC-05 reject unauthorized field changes | T02 | P1 | Commercial API maintainer | Existing HTTP checks retained as regressions |
| 6 | SEC-06 preserve tenant isolation, existing #583 | T04 | P1 | Commercial API maintainer | Existing two-tenant HTTP checks verified |
| 7 | SEC-07 preserve audit attribution and monitor delivery | T03 | P2 | Commercial, relay and identity-audit maintainers | Protocol checks verified, integrated persistence evidence open |
| 8 | SEC-08 bound requests fairly by tenant and trusted client address | T05 | P2 | Gateway and Commercial API maintainers | Per-IP checks verified, tenant/proxy scenarios proposed |

## SEC-01 dependency remediation

As a platform maintainer, I want the resolved commercial runtime and security-module dependencies to pass the vulnerability gate, so releases carry a reviewed dependency baseline.

- Given the pinned source revisions, when CI generates the aggregate runtime CycloneDX BOM and scans it together with security/go.mod, then both sources must contain packages and produce a structured report.
- Given a reported advisory, when remediation is proposed, then identify package, version, advisory aliases, affected functionality and a fixed version or removal plan. Confirm the presence of the package separately from reachability of a vulnerable symbol.
- Given an upgraded baseline, when dependency scanning and authorization regression tests run, then the scanner reports zero findings and all selected regression tests pass.
- Given an unavailable scanner, advisory service or failed Maven resolution, when CI runs, then the dependency job fails with a diagnostic report.
- Given the current baseline, when the scanner reports findings, then CI remains blocked and the release record links the findings. No vulnerability suppression is included in this activity's policy.

The observed scan reports 106 package-advisory matches across 15 package versions. Aliases can describe the same vulnerability, so 106 is a match count. The report includes critical advisories for pgx/v5 5.7.6 and x/crypto 0.37.0, among other Go and Maven packages. The remediation review starts with the highest reported severity and reachable paths. [Recorded inventory and findings](evidence/dependency-summary.json)

## SEC-02 catalog write authorization and audit

As a Tenant Administrator, I want create, inactivate and reactivate to enforce the catalog role matrix and record rejected attempts, so unauthorized users cannot change my tenant's offer or avoid attribution.

- Given each ordinary tenant role and valid input, when it calls POST /catalog/services or the inactivate/reactivate routes, then TENANT_ADMINISTRATOR receives the documented success and other roles receive 403 with unchanged state and no business-change event.
- Given an ordinary SERVICE identity, when it calls public catalog creation, then it receives 403.
- Given a rejected attempt, when audit evidence is read through the supported audit API, then actor, tenant, action, affected resource when applicable, outcome and correlation ID match the request.
- Given the same test matrix in CI, when a route accidentally permits a refused role, then the authorization job fails.

The audit acceptance criterion is retained from the existing story. Passing the current role tests provides partial evidence for that story. [Existing #581](https://github.com/code-corhuila/multi-tour-docs/issues/581)

## SEC-03 committed-secret prevention and rotation

As the platform operator, I want source changes and the assessed product snapshots scanned for credentials, so exposed signing material or service credentials block delivery.

- Given a clean source fixture, when Gitleaks runs, then its exit code is 0. Given a new synthetic token in an unreviewed file, then its exit code is 1.
- Given a scanner finding, when it has no exact reviewed file hash, line and rule classification, then CI fails and the report redacts the detected value.
- Given the eleven reviewed synthetic fixtures and empty example fields, when their exact source files match the recorded hashes, then they are counted as reviewed fixtures. Any changed content invalidates that classification.
- Given a signing-key rotation, when consumer trust is updated, then old user and SERVICE tokens receive 401 and freshly issued credentials succeed.
- Given an actual exposed credential, then revoke or rotate it and remove its operational use before proposing release.

## SEC-04 service-local token validation

As the platform operator, I want the API to reject invalid identities even when called directly, so the network cannot become an authentication bypass.

- Given an absent token, an expired token beyond the 30-second tolerance, another signing key or alg none/HS256/RS512, when the real catalog route is called, then it returns 401 and performs no business change.
- Given a valid token, when role/tenant authorization fails, then return 403 rather than accepting the request merely because the signature is valid.
- Given the composed promoted environment, when published ports are inspected, then business API ports are internal and the gateway is the public business entry point.
- Given a regression in any selected service verifier, when CI runs, then the authorization job fails.

The existing story supplies the token and network-isolation criteria. [Existing #582](https://github.com/code-corhuila/multi-tour-docs/issues/582)

## SEC-05 catalog field integrity

As a Tenant Administrator, I want a Collaborator's descriptive-edit permission confined to commercialName, so enabling that permission cannot change rates, costs, capacity or tenant ownership.

- Given the tenant has enabled descriptive edits, when a Collaborator patches only commercialName, then the documented update succeeds.
- Given the same identity, when a restricted commercial field is changed, then return 403 and preserve the resource.
- Given an unknown field such as tenantId or malformed JSON, when an authorized request is parsed, then return the documented 400 validation envelope. Authentication/authorization checks still precede business changes.
- Given these scenarios, when CatalogHttpTest runs in CI, then an unexpected acceptance fails the job.

## SEC-06 tenant isolation

As a tenant user, I want another tenant's item to be indistinguishable from a missing item, so resource identifiers cannot reveal another agency's catalog.

- Given an item owned by tenant A and a valid tenant B token, when B requests it, then return 404 with the same stable response fields as a missing UUID.
- Given identical X-Correlation-Id headers, when both complete JSON bodies are compared, then their error content matches.
- Given either response, then the body contains no foreign tenant/item details, stack trace or SQL.
- Given the two-tenant regression in CI, when a foreign item is disclosed or errors diverge, then the authorization job fails.

The test scenarios retain the existing issue's business meaning. [Existing #583](https://github.com/code-corhuila/multi-tour-docs/issues/583)

## SEC-07 audit attribution and delivery

As an auditor, I want attributable state changes and bounded audit-delivery delay, so a catalog change can be reconstructed and delivery failures become visible.

- Given a catalog inactivation that commits, when real persistence and the receiver are queried, then its outbox/audit data includes tenant, actor, action, affected identifier, outcome and correlation ID.
- Given a failed transaction, then both the business change and its outbox insert roll back.
- Given duplicate delivery of one eventId, then the consumer preserves one logical audit outcome.
- Given retry exhaustion, then the event is retained in the documented failed state and an alert exposes the failed-delivery count without credentials or personal data.
- Given secret-bearing requests, then operational logs contain correlation and safe outcome fields while excluding authorization headers and passwords.

## SEC-08 availability and client attribution

As a tenant user, I want bounded traffic and correct client attribution, so one busy tenant or a spoofed forwarding header cannot consume another tenant's budget.

- Given the configured gateway rate limit, then excessive requests receive 429 with Retry-After and the common error envelope.
- Given a proposed service tenant-budget test with N=3 requests in 60 seconds, when tenant A sends its fourth request and B sends its first from the same IP, then A receives 429 and B remains within its own budget. Production quota selection requires the team's policy decision.
- Given a direct untrusted X-Forwarded-For header, then it cannot replace the address used for the budget. A configured proxy may supply the address only through explicitly trusted proxy networks.
- Given the 34-user tenant workload referenced by the project assessment, then record latency, refusal counts and isolation between two tenant identities. Run timeouts and request-size checks in the same test plan.
