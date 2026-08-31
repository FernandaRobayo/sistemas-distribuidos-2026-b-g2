<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       04-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 04

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: fernandarobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Align the product baseline to the multi-tenant direction, finalize the PDR v1.7, adapt the landing experience to Multi tour with Travesia Natural as the reference tenant, and prepare the MVP 1 sprint artifacts for the next implementation step.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-XXX-001 | Adapt the landing page to the Multi tour multi-tenant product direction using Travesia Natural as the reference tenant | done | https://fernandarobayo.github.io/Travesia-Natural-landingpage/mockup-pdr-1/ |
| DOC-01 | Finalize the PDR baseline up to version 1.7 for the multi-tenant scope | done | [PDR_Multi_tour_v1.7.md](./PDR_Multi_tour_v1.7.md) |
| DOC-02 | Update the docs repository governance artifacts to reflect the multi-tenant direction | done | https://github.com/code-corhuila/travesia-natural-docs/tree/main/00-governance |
| DOC-03 | Update the domain documentation to reflect Multi tour and Travesia Natural as reference tenant | done | https://github.com/code-corhuila/travesia-natural-docs/tree/main/02-domain |
| DOC-04 | Update the data documentation to reflect the multi-tenant product direction | done | https://github.com/code-corhuila/travesia-natural-docs/tree/main/06-data |
| MVP1-01 | Prepare the MVP 1 sprint package: OpenAPI contract, task board, MoSCoW prioritization and Definition of Done | done | [Sesion 2 README](./Sesión%202/README.md) |

## 2. My individual contribution
- I adapted the landing page so it no longer represents a single-company product only, but the Multi tour software direction with Travesia Natural as the reference tenant for validation and demonstration.
- I worked on the final refinement of the product document and helped close the PDR up to version `1.7`, improving consistency in multi-tenancy, customer self-management scope, roles, states, non-functional requirements and delivery readiness.
- I updated the docs repository in `00-governance`, `02-domain` and `06-data` so the documentation reflects the product shift from a single operation to a multi-tenant platform.
- I helped keep the product narrative consistent between the landing page, the PDR and the documentation baseline, preserving the original business intent while clarifying that Travesia Natural is the main reference tenant and not the whole product.
- I prepared the Week 04 Session 2 MVP 1 planning package, including the API contract in `openapi.yaml`, a task board with small stories and testable acceptance criteria, a MoSCoW commitment for the sprint and a written Definition of Done.

## 3. Blockers and risks
- The architecture decisions required by the academic constraints are still open, especially the exact distribution between Java and Go, Angular and React, PostgreSQL and MongoDB, and the four Micro Frontends.
- The MVP 1 sprint package is ready at planning level, but the actual backend and frontend implementation of the committed flow is still pending.
- The technical definition of how each tenant's data will be stored and isolated is still pending in architecture and could affect the implementation sequence.
- Some compatibility details for the customer channel still depend on the browsers/devices selected by the team for MVP 1 validation.

## 4. Plan for next week
- Continue working on the landing page screens so they consistently reflect the multi-tenant direction of Multi tour and the use of Travesia Natural as the reference tenant.
- Continue breaking down the prioritized stories into concrete frontend tasks aligned with the landing page and the MVP 1 flow.
- Support the resolution of the remaining architecture decisions so implementation can proceed without contradicting the PDR v1.7 baseline.
- Keep the landing, documentation and implementation artifacts aligned with the multi-tenant product definition.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Landing page adapted to Multi tour: https://fernandarobayo.github.io/Travesia-Natural-landingpage/mockup-pdr-1/
- Final PDR baseline: [PDR_Multi_tour_v1.7.md](./PDR_Multi_tour_v1.7.md)
- Docs repository - governance updates: https://github.com/code-corhuila/travesia-natural-docs/tree/main/00-governance
- Docs repository - domain updates: https://github.com/code-corhuila/travesia-natural-docs/tree/main/02-domain
- Docs repository - data updates: https://github.com/code-corhuila/travesia-natural-docs/tree/main/06-data
- MVP 1 sprint package: [Sesion 2 README](./Sesión%202/README.md)
