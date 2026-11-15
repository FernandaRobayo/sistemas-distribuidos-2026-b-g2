<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       13-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 13

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Verify authentication, per-service token validation, authorization, service credentials, password hashing and input validation; relate the evidence to the STRIDE model and security backlog for MVP 3.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| N/A (Session 1 security) | Complete the reproducible security exercise: HTTPS login, service-local token validation, role/tenant authorization, service credentials, password hashing, input validation and key rotation | done | [implementation 5f72058](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/5f72058) · [session 1 delivery](Sesi%C3%B3n%201/README.md) · [CI execution](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/actions/runs/43692024222) |
| N/A (Workshop delivery 1) | Threat modeling workshop on the boundary api-gateway to commercial-reservation-api: attack surface map, STRIDE analysis in a team PR, three security stories and security gates for the pipeline | done | [workshop README](../workshop/README.md) · [CP0 496953a](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/496953a) · [CP1 6324658](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/6324658) · [CP3 9bc40fc](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/9bc40fc) · [CP4 ebd89e6](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/ebd89e6) · [CP7 90d2e34](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/90d2e34) · [CP8 d97b306](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/d97b306) · [CP8 389d3f0](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/389d3f0) |
| N/A (STRIDE PR) | STRIDE analysis of the boundary in the team docs repository | doing | [PR #580](https://github.com/code-corhuila/multi-tour-docs/pull/580) · [29079d2](https://github.com/code-corhuila/multi-tour-docs/commit/29079d2) · [48f013c](https://github.com/code-corhuila/multi-tour-docs/commit/48f013c) · [b032239](https://github.com/code-corhuila/multi-tour-docs/commit/b032239) · [CP6 920c95a](https://github.com/code-corhuila/multi-tour-docs/commit/920c95a) |
| N/A (Security stories) | Three security stories from the top risks: [#581](https://github.com/code-corhuila/multi-tour-docs/issues/581) role check, [#582](https://github.com/code-corhuila/multi-tour-docs/issues/582) invalid tokens, [#583](https://github.com/code-corhuila/multi-tour-docs/issues/583) same 404 for another tenant | todo | [#581](https://github.com/code-corhuila/multi-tour-docs/issues/581) · [#582](https://github.com/code-corhuila/multi-tour-docs/issues/582) · [#583](https://github.com/code-corhuila/multi-tour-docs/issues/583) |

## 2. My individual contribution
- Session 1 completion (2026-11-15): wrote a live Go-to-Java security integration test, a Spring Boot test server and an immutable-source verifier with disposable PostgreSQL/MongoDB. Verified real login over HTTPS, per-service RS256 checks, role/tenant refusals, service credentials, stored bcrypt hashes, invalid input and signing-key rotation. Published an executable GitHub Actions workflow and its evidence. Existing product controls remain attributed to their authors; my new contribution is this harness and delivery. See [session 1](Sesi%C3%B3n%201/README.md).
- Claimed the boundary api-gateway to commercial-reservation-api in issue #577 and drew the data flow with four trust boundaries, six assets and the six entry points of `/catalog/services` (`01-attack-surface.md`).
- Wrote the STRIDE analysis in PR #580: six threats with likelihood, impact, existing control and missing mitigation, a risk ranking (E has risk 9, S, T and I have 6, R and D have 4) and the residual risk I accept. Row E uses the book Costas Santos, Seguridad informatica (2011), section 3.2.2 Roles, p. 93, from the CORHUILA library (call number 005.8 C838s Ej.1).
- Opened three security stories with labels `security` and P0 or P1, in the team Project: #581 (only the Tenant Administrator registers, inactivates or reactivates items), #582 (401 for invalid tokens) and #583 (the same 404 for an item of another tenant).
- Proposed `security.yml` with secret scanning, dependency audit and an authorization test, and wrote `CatalogRolesAuthzTest`, a negative test for story #581 (`04-security-ci/`).
- Left a review comment on the STRIDE of a teammate: [review comment on row S](https://github.com/code-corhuila/multi-tour-docs/pull/579#discussion_r4414073924), PR #579 of Molina211: the lockout counted per account in row S contradicts row D. I also commented on his follow-up PR #587 ([comment](https://github.com/code-corhuila/multi-tour-docs/pull/587#issuecomment-6511760980)) and he applied the change in commit 51a9d47.
- CP6: answered the review of Molina211 on row D of my STRIDE. I checked the gateway on `develop` (it sends `X-Forwarded-For $remote_addr` and has no `real_ip` setting), added the restore of the real client address to the missing mitigation and wrote in the residual risk that D changes on the AWS path of ADR-004 D9 (commit 920c95a).
- CP7: refined the three stories, fixed the title of #581 so it matches its acceptance criteria and linked #583 with #584 of Molina211, which asks the same tenant isolation rule for the memberships (commit 90d2e34).
- CP8: built a minimal module of `POST /catalog/services` and ran `CatalogRolesAuthzTest` against it: green with a Collaborator token (403) and red with an Administrator token (201), with the real output in `HOW-TO-RUN.md`. `security.yml` was validated with YAML Lint and actionlint 1.7.7 (commits d97b306 and 389d3f0).

## 3. Blockers and risks
- Session 1 is complete in the Linux/CI exercise, with live HTTPS login and key rotation. The original workshop fixture remains historical evidence. Native Windows replay hit a Docker-to-host 503; the Linux GitHub Actions run is the verified reproduction target.
- `security.yml` has not run in GitHub Actions; it is a proposal for the team pipeline, checked with YAML Lint and actionlint.
- The STRIDE PR and security-story rows retain their historical workshop status; this session 1 delivery does not recheck or change their remote review state.
- The live business journey exercises catalog services; the selected component security suites cover the other domain APIs. This delivery does not claim exhaustive testing of every business route.

## 4. Plan for next week
- Follow the merge of PR #580 and any new review comment.
- Reuse the passing live gateway-to-service test during environment promotion and the production certificate rollout.
- Write the role matrix per entry point of `/catalog/services` and a common tenant isolation test for #583 and #584.
- Put `security.yml` in the pipeline of the service and see it run in GitHub Actions.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Session 1 security verification: [delivery](Sesi%C3%B3n%201/README.md), [runner](Sesi%C3%B3n%201/verify.ps1), [logs and source revisions](Sesi%C3%B3n%201/evidence/).
- Claim issue: https://github.com/code-corhuila/multi-tour-docs/issues/577
- STRIDE Pull Request: https://github.com/code-corhuila/multi-tour-docs/pull/580
- Security stories: https://github.com/code-corhuila/multi-tour-docs/issues/581 https://github.com/code-corhuila/multi-tour-docs/issues/582 https://github.com/code-corhuila/multi-tour-docs/issues/583
- Fork folder: https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/tree/main/13-week/workshop
- Peer review comment: https://github.com/code-corhuila/multi-tour-docs/pull/579#discussion_r4414073924
- Second review comment: https://github.com/code-corhuila/multi-tour-docs/pull/587#issuecomment-6511760980
- Negative test and minimal module: https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/tree/main/13-week/workshop/04-security-ci
- Reflection document: https://docs.google.com/document/d/1MoVQsGjm6SejsjRUww2WwLEKMmAEOHWhmmtKcYzFWOw/edit?usp=sharing
