# Week 13 - Session 2: Multi Tour threat modeling and security gates

Maria Fernanda Robayo Laguna · FernandaRobayo · ErrorCapa8
Assessment and execution date 2026-11-15.

The activity models Multi Tour's catalog boundary from api-gateway to commercial-reservation-api, with the security issuer, domain datastores, event relay, secret configuration and CI supply chain included in its data flow. It updates the merged STRIDE work using the source revisions and security execution from session 1.

| Requested deliverable | Completed artifact |
|---|---|
| Data flow and trust boundaries | Mermaid DFD with 16 named flows, seven trust boundaries and an asset inventory in [01-threat-model.md](01-threat-model.md) |
| STRIDE analysis | Eight concrete findings covering S/T/R/I/D/E and supply-chain/credential risks in [01-threat-model.md](01-threat-model.md) |
| Prioritized security backlog | Eight ordered items with proposed owners, P0/P1/P2 priorities, testable Given/When/Then criteria and links to existing team issues in [02-security-backlog.md](02-security-backlog.md) |
| Dependency, secret and authorization CI gates | Active workflow, pinned scanners, exact benign-fixture review and regression checks described in [03-ci-security-gates.md](03-ci-security-gates.md) |
| Gate validation | Four scanner exit-code cases and three reviewed-fixture checks in [gate-self-test.json](evidence/gate-self-test.json) |

## Results

The dependency scanner completed and blocked the assessed source baseline with 106 package-advisory matches across 15 package versions. SEC-01 records the required dependency remediation and reachability assessment. The counts describe the scan inventory, including advisory aliases. [Dependency summary](evidence/dependency-summary.json)

Gitleaks passed locally after classifying eleven benign fixture entries by normalized source hash, line and rule. The registry covers test-only inputs and an empty environment template. A new synthetic credential blocks scanning, and changing a reviewed file invalidates its classification. The Linux gate is checked by the same CI workflow. [Secret summary](evidence/secret-summary.json), [reviewed fixtures](reviewed-fixtures.json)

The authorization job reuses the real service-local token, role and tenant tests and the live HTTPS Go-to-Java exercise. Session 1's completed run supplies the preceding implementation evidence, and the session 2 workflow executes it as its authorization gate. [Session 1 evidence](../Sesi%C3%B3n%201/README.md), [session 2 CI runs](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/actions/workflows/week13-threat-model-security.yml?query=branch%3Adocs%2F13-week-session2-security)

The workflow remains blocked while dependency findings violate its declared policy. The model, backlog and gates are delivered, with unresolved product risks retained as explicit backlog work for MVP 3 and the next CI/CD activity.

## Project traceability

PR #580 is merged. The existing security stories #581, #582 and #583 remain open, with their original acceptance criteria retained in this backlog. The activity's new ownership and gate-threshold choices are PROPUESTO (session 2 assessment). Risk scores are INFERIDO (session 2 risk assessment). [PR #580](https://github.com/code-corhuila/multi-tour-docs/pull/580), [#581](https://github.com/code-corhuila/multi-tour-docs/issues/581), [#582](https://github.com/code-corhuila/multi-tour-docs/issues/582), [#583](https://github.com/code-corhuila/multi-tour-docs/issues/583)

The target source revisions are pinned by the session 1 lock. Dependency scope includes the resolved commercial runtime graph and the security module graph. Secret scope includes those two product snapshots, gateway configuration and the course change history since origin/main. Raw SBOM and redacted reports are available as CI artifacts. [Source lock](../Sesi%C3%B3n%201/sources-lock.json), [CI workflow](../../../.github/workflows/week13-threat-model-security.yml)

Reproduction commands and the measured gate thresholds are in the CI guide. The model follows Annex J's single instance per engine and domain-owned data access, ADR-004's local JWT verification and internal service credentials, and Annex I's executable CI evidence. [CI guide](03-ci-security-gates.md)
