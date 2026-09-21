<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       07-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 07

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Deliver BPMN diagrams for the operational macroproceso and reservation flows, update the PDR to v1.8 with client registration and password recovery requirements, and publish admin, collaborator and tenant-admin UI improvements to the frontend.
<!-- CONFIG-END -->

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| W07-BPMN-00 | Model the Multi Tour operational macroproceso connecting reservation, payment, execution, costs and cash management | done | [BPMN-00-Macroproceso-operativo.bpmn](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/07-week/hu-status/BPMN-00-Macroproceso-operativo.bpmn) |
| W07-BPMN-01 | Model reservation creation through the customer portal | done | [BPMN-01 Crear reserva.bpmn](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/07-week/hu-status/BPMN-01%20Crear%20reserva.bpmn) |
| W07-BPMN-01A | Model reservation registration by internal operations | done | [BPMN-01A Registrar reserva desde la operación interna.bpmn](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/07-week/hu-status/BPMN-01A%20Registrar%20reserva%20desde%20la%20operaci%C3%B3n%20interna.bpmn) |
| W07-PDR-18 | Update PDR to v1.8: formalize required fields for client registration and minimum password recovery flow | done | [PDR_Multi_tour_v1.8.md](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/07-week/hu-status/PDR_Multi_tour_v1.8.md) |
| HU-05 | Frontend UI/UX: publish platform admin, collaborator and tenant-admin screens | doing | [feat/hu-05-frontend-uiux branch](https://github.com/Molina211/Multitour-Monolito-Portal/tree/feat/hu-05-frontend-uiux) |

## 2. My individual contribution

- I completed the BPMN-00 macroproceso diagram connecting the full operational flow of Multi Tour: reservation creation, payment registration and validation, service execution, cost recording and cash management, with modification, cancellation, refunds and rescheduling as alternative paths.
- I completed BPMN-01 modeling the reservation creation flow through the customer portal: catalog browsing, authentication, service and date selection, traveler details, terms acceptance, modality selection and form validation before creating the reservation.
- I completed BPMN-01A modeling the reservation registration flow by internal operations, with a separate actor, form fields and available validations from the customer portal flow.
- I updated the PDR to v1.8 (2026-09-18): formalized the required fields for final-customer registration (first name, last name, email, phone, password and password confirmation) and the minimum functional flow for password recovery (email, recovery code, new password and confirmation). Both flows preserve tenant isolation — an email can exist across tenants without mixing accounts, reservations or credentials. Technical details of the recovery code (generation, length, format, expiry, channel) remain pending architecture and security decisions.
- I worked on the frontend (HU-05, branch `feat/hu-05-frontend-uiux` in `Molina211/Multitour-Monolito-Portal`): published changes to the platform administrator screens, the collaborator screens and the tenant-admin screens. This work is still in progress.

## 3. Blockers and risks

- Dockerizing Camunda with the BPMN diagrams is a blocker for the next phase of process automation. The integration and deployment strategy for Camunda as a container alongside the existing stack is not yet defined.

## 4. Plan for next week

- Continue modeling the remaining BPMN diagrams from the inventory defined in previous weeks.
- Start the C4 architecture diagrams for the Multi Tour system.
- Continue and close the frontend UI/UX changes on HU-05, targeting the PR merge once the screens are validated.

## 5. Compliance self-check

- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

Testable acceptance criteria is confirmed: PDR v1.8 defines explicit required fields and minimum functional flows for client registration and password recovery; BPMN diagrams define observable process steps and decision points. No secrets applies to the documentation contributions (BPMN files and PDR) which contain no credentials or environment-specific values. Conventional Commits and per-environment branch/PR cannot be confirmed until HU-05 commit messages and the PR promotion are available. Tests and DDD/hexagonal apply to the HU-05 code changes and will be verified when the PR is merged.

## 6. Evidence links

- BPMN-00 macroproceso: [BPMN-00-Macroproceso-operativo.bpmn](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/07-week/hu-status/BPMN-00-Macroproceso-operativo.bpmn)
- BPMN-01 customer portal reservation: [BPMN-01 Crear reserva.bpmn](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/07-week/hu-status/BPMN-01%20Crear%20reserva.bpmn)
- BPMN-01A internal operations reservation: [BPMN-01A Registrar reserva desde la operación interna.bpmn](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/07-week/hu-status/BPMN-01A%20Registrar%20reserva%20desde%20la%20operaci%C3%B3n%20interna.bpmn)
- PDR v1.8: [PDR_Multi_tour_v1.8.md](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/07-week/hu-status/PDR_Multi_tour_v1.8.md)
- Frontend HU-05 branch: [feat/hu-05-frontend-uiux](https://github.com/Molina211/Multitour-Monolito-Portal/tree/feat/hu-05-frontend-uiux)
- Weekly summary: [Weekly Summary Semana 7](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/07-week/hu-status/Weekly%20Summary%20Semana%207%20Comunicaci%C3%B3n%20entre%20Servicios%2C%20Contratos%20y%20Pruebas%20de%20Integraci%C3%B3n.png)
