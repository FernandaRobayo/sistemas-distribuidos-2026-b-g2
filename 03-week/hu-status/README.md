<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       03-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 03

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Complete and align governance and domain documentation artifacts for the multitenant tourism platform.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| DOC-01 | Refine the new PDR version for the multitenant tourism platform | done | https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/03-week/hu-status/PDR_Travesia_Natural.md |
| DOC-02 | Complete the Session 1 challenge for the Reservations bounded context | done | https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/tree/main/03-week/hu-status/Sesión%201 |
| DOC-03 | Complete the Session 2 challenge for Reservations services, data, and contracts | done | https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/tree/main/03-week/hu-status/Sesión%202 |
| DOC-04 | Review and apply feedback to the context map and domain artifacts | done | https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/03-week/hu-status/Sesión%202/Context-Map-Plataforma-Multitenencia.md |
| DOC-05 | Consolidate governance and domain documentation work from the base docs repository | done | https://github.com/code-corhuila/travesia-natural-docs/tree/main/02-domain |

## 2. My individual contribution
- I reviewed and refined the new PDR version to align it with the multitenant platform approach while keeping Travesia Natural as the main validation and demo tenant.
- I completed the Moodle Session 1 challenge by developing the Reservations bounded context with aggregate root, entities, value objects, invariants, and domain events.
- I completed the Moodle Session 2 challenge by defining services, data ownership, contracts, and relationships for the Reservations MVP1 vertical slice.
- I reviewed and applied feedback to the context map, contracts, and domain artifacts to improve consistency with the current PDR.
- I consolidated domain analysis work using the documentation repository as a base, especially the `00-governance` and `02-domain` folders.
- I interacted directly with the base repository artifacts to compare, complete, and align the project documentation with the guide materials.
- I aligned the context map, the domain map, and the new PDR version to keep consistency across bounded contexts, multitenancy rules, and domain responsibilities.

## 3. Blockers and risks
- The exact GitHub Projects board URL is still pending confirmation.
- Final architecture validation is still pending and may affect later service separation decisions.
- Some future technical contracts may still evolve during the detailed architecture phase.

## 4. Plan for next week
- Validate the domain artifacts against architecture decisions.
- Refine the documents where minor ambiguities or pending confirmation points still remain.
- Cross-check the bounded contexts and domain artifacts against the architectural proposal.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [ ] No secrets; config via environment variables

## 6. Evidence links
- https://github.com/code-corhuila/travesia-natural-docs/tree/main/00-governance
- https://github.com/code-corhuila/travesia-natural-docs/tree/main/02-domain
- https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/03-week/hu-status/PDR_Travesia_Natural.md
- https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/03-week/hu-status/Sesión%202/Context-Map-Plataforma-Multitenencia.md
