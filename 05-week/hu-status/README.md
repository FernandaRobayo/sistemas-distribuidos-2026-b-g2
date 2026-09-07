<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       05-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 05

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Develop the Multi tour monolithic Angular frontend for MVP Corte 1, integrate its tenant and role-based workflows with the backend API, and document the implementation, validation evidence and remaining gaps against the PDR.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-03 | MVP - Corte 1 - Frontend: implement the monolithic portal and integrate backend workflows across tenant roles | done | [Implementation commit f7d92b4](https://github.com/Molina211/Multitour-Monolito-Portal/commit/f7d92b43ff616ae9bab96d21bec85081f9f5bd07) |

HU-03 corresponds to [frontend issue #1](https://github.com/Molina211/Multitour-Monolito-Portal/issues/1), supplied as closed. The `done` status records that story and its promoted frontend delivery; it does not certify full PDR compliance or completion of every end-to-end acceptance check. The remaining gaps are listed below.

## 2. My individual contribution
- I worked on the Multi tour frontend as a single Angular 18 application, using Travesia Natural as the reference tenant. The portal groups public pages and the Final Customer, Operator and Platform Administrator areas in one application and one build.
- I developed and refined navigation, forms, validation messages and loading/error feedback for the customer and internal operational screens.
- I worked on authentication and session handling, tenant context and route guards so navigation reflects the authenticated profile and the active tenant. Backend authorization remains a separate requirement.
- I integrated portal workflows with real backend APIs for catalog consultation, reservations, payment support, operational execution, cash, tenant administration and collaborator access. Coverage differs by workflow; an existing screen does not mean that every PDR requirement is complete.
- I worked on the frontend delivery configuration: an Angular production build served by Nginx, SPA route fallback, Docker Compose and an `/api/` proxy to the backend published on host port `8081`.
- I supported frontend verification and delivery. The [Session 2 validation record](./Sesi%C3%B3n%202/README.md) reports a successful development build and `88 SUCCESS` in ChromeHeadless. The Git history records promotion through `develop`, `qa` and `main`, with tag `v1.0.0` resolving to commit `06fdefd`.
- I reviewed the relationship between the implemented frontend, HU-03 and the PDR v1.7.1, identifying incomplete flows and documentation statements that overstate the MVP's current coverage.

## 3. Blockers and risks
- Password recovery is still a reference screen without a working recovery API flow. The PDR includes this capability, so it remains an implementation gap.
- Tenant creation does not yet accept the initial tenant status or the first Administrator's name through the current API contract, although the PDR requires those inputs.
- Dashboard and report views provide partial information derived from available APIs. Complete RF-011/RF-012 coverage, including the required reporting periods and financial fields, still needs validation.
- Frontend guards do not guarantee tenant isolation or permission enforcement in the backend. Sensitive API routes and cross-tenant rejection cases require backend authorization and integration evidence.
- A full frontend/backend demonstration and WCAG 2.1 AA assessment of the main flows are not established by the recorded unit tests. These must remain separate acceptance checks.
- The Session 1 Docker exercise uses a Node.js/TypeScript `tenant-service`; its evidence does not demonstrate deployment of the Angular portal and Java backend together. Session 2 is a historical verification record: its blank-weekly-status observation is superseded by this README, and its backend delivery statements require separate reconciliation with the subsequent backend release.

## 4. Plan for next week
- Coordinate the missing password-recovery and tenant-onboarding contracts with the backend team, keeping their behavior aligned with the PDR.
- Validate the main customer journey against the running frontend and backend: authenticate, consult the catalog, create a reservation, submit payment support and consult the reservation status. Save reproducible evidence and negative cases.
- Complete a requirement-to-screen/API/test matrix for the frontend, prioritizing reports, tenant isolation, role restrictions and accessibility.
- Update the affected UX documentation so implemented, partial and pending functionality are clearly distinguished.
- Prepare the next increment with the team using the confirmed MVP gaps; keep future microfrontend work subject to the project's architecture decisions.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [ ] No secrets; config via environment variables

The implementation commit follows Conventional Commits, HU-03 supplies acceptance criteria, and Session 2 records the frontend test results. The promotion commits are available, but the complete per-environment PR evidence has not been consolidated here. Hexagonal organization is recorded for selected frontend slices, not certified for the entire application. Docker/proxy configuration is present; a repository-wide secrets and configuration audit is not claimed. Unchecked items are not asserted as completed.

## 6. Evidence links
- User story: [HU-03 - MVP Corte 1 Frontend, issue #1](https://github.com/Molina211/Multitour-Monolito-Portal/issues/1).
- Main implementation: [f7d92b4 - integrate backend workflows across tenant roles](https://github.com/Molina211/Multitour-Monolito-Portal/commit/f7d92b43ff616ae9bab96d21bec85081f9f5bd07).
- Promotion to develop: [648047f](https://github.com/Molina211/Multitour-Monolito-Portal/commit/648047ff56879191481c1af4ac2ef14d2d18d85e).
- Promotion to qa: [e486c41](https://github.com/Molina211/Multitour-Monolito-Portal/commit/e486c410276cac8d5bcdc6ac215a6f5018660c28).
- Promotion to main: [06fdefd](https://github.com/Molina211/Multitour-Monolito-Portal/commit/06fdefdadfcb66b0373973915e88304f6d098138); [frontend source at tag v1.0.0](https://github.com/Molina211/Multitour-Monolito-Portal/tree/v1.0.0).
- Frontend container build: [Dockerfile at the delivery commit](https://github.com/Molina211/Multitour-Monolito-Portal/blob/06fdefdadfcb66b0373973915e88304f6d098138/Dockerfile).
- Recorded build/test verification and closure gaps: [Week 05 - Session 2](./Sesi%C3%B3n%202/README.md). These are previously recorded results, not tests rerun while writing this weekly report.
- Supporting academic Docker exercise: [Week 05 - Session 1](./Sesi%C3%B3n%201/README.md) and its [execution evidence](./Sesi%C3%B3n%201/Evidencias/).
- Functional reference: [PDR Multi tour v1.7.1](../../04-week/hu-status/PDR_Multi_tour_v1.7.md) (version inside the file; filename retains v1.7).
- Weekly summary artifact: [Week 05 summary image](./Weekly%20summary/Weekly%20Semana%205%20%C2%B7%20Contenerizaci%C3%B3n%20y%20Release%20del%20MVP%201.png).
