<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       13-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 13

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Threat-model the trust boundary api-gateway to commercial-reservation-api with STRIDE, turn the top risks into three security stories in the team backlog, and propose security gates for the pipeline.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| N/A (Workshop delivery 1) | Threat modeling workshop on the boundary api-gateway to commercial-reservation-api: attack surface map, STRIDE analysis in a team PR, three security stories and security gates for the pipeline | done | [workshop README](../workshop/README.md) · [CP0 496953a](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/496953a) · [CP1 6324658](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/6324658) · [CP3 9bc40fc](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/9bc40fc) · [CP4 ebd89e6](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/ebd89e6) |
| N/A (STRIDE PR) | STRIDE analysis of the boundary in the team docs repository | doing | [PR #580](https://github.com/code-corhuila/multi-tour-docs/pull/580) · [29079d2](https://github.com/code-corhuila/multi-tour-docs/commit/29079d2) · [48f013c](https://github.com/code-corhuila/multi-tour-docs/commit/48f013c) · [b032239](https://github.com/code-corhuila/multi-tour-docs/commit/b032239) |
| N/A (Security stories) | Three security stories from the top risks: [#581](https://github.com/code-corhuila/multi-tour-docs/issues/581) role check, [#582](https://github.com/code-corhuila/multi-tour-docs/issues/582) invalid tokens, [#583](https://github.com/code-corhuila/multi-tour-docs/issues/583) same 404 for another tenant | todo | [#581](https://github.com/code-corhuila/multi-tour-docs/issues/581) · [#582](https://github.com/code-corhuila/multi-tour-docs/issues/582) · [#583](https://github.com/code-corhuila/multi-tour-docs/issues/583) |

## 2. My individual contribution
- Claimed the boundary api-gateway to commercial-reservation-api in issue #577 and drew the data flow with four trust boundaries, six assets and the six entry points of `/catalog/services` (`01-attack-surface.md`).
- Wrote the STRIDE analysis in PR #580: six threats with likelihood, impact, existing control and missing mitigation, a risk ranking (E has risk 9, S, T and I have 6, R and D have 4) and the residual risk I accept. Row E uses the book Costas Santos, Seguridad informatica (2011), section 3.2.2 Roles, p. 93, from the CORHUILA library (call number 005.8 C838s Ej.1).
- Opened three security stories with labels `security` and P0 or P1, in the team Project: #581 (only the Tenant Administrator registers, inactivates or reactivates items), #582 (401 for invalid tokens) and #583 (the same 404 for an item of another tenant).
- Proposed `security.yml` with secret scanning, dependency audit and an authorization test, and wrote `CatalogRolesAuthzTest`, a negative test for story #581 (`04-security-ci/`).
- Left a review comment on the STRIDE of a teammate: [review comment on row S](https://github.com/code-corhuila/multi-tour-docs/pull/579#discussion_r4414073924), PR #579 of Molina211: the lockout counted per account in row S contradicts row D

## 3. Blockers and risks
- `commercial-reservation-api` is not built yet, so every control in the STRIDE is decided in the ADRs but not implemented, and the negative test has not run.
- `security.yml` has not run in GitHub Actions; it is a proposal for the team pipeline and was only checked as valid YAML.
- The contract of the service only covers `/catalog/services`, so reservations, payments and customer data are not analyzed yet.

## 4. Plan for next week
- Answer the review on PR #580 and finish the residual risk and references.
- Refine the three stories and link them to the related stories of my teammates.
- Run the negative test against a minimal module of the service and record its console output in `HOW-TO-RUN.md`.
- Write the implementation plan in the reflection document.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Claim issue: https://github.com/code-corhuila/multi-tour-docs/issues/577
- STRIDE Pull Request: https://github.com/code-corhuila/multi-tour-docs/pull/580
- Security stories: https://github.com/code-corhuila/multi-tour-docs/issues/581 https://github.com/code-corhuila/multi-tour-docs/issues/582 https://github.com/code-corhuila/multi-tour-docs/issues/583
- Fork folder: https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/tree/main/13-week/workshop
- Peer review comment: https://github.com/code-corhuila/multi-tour-docs/pull/579#discussion_r4414073924
- Reflection document: https://docs.google.com/document/d/1MoVQsGjm6SejsjRUww2WwLEKMmAEOHWhmmtKcYzFWOw/edit?usp=sharing
