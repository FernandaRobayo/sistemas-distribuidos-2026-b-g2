<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       06-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 06

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Run the complete Multi tour system with Docker Compose, plan DEV/QA/PROD configuration and MVP 2 orchestration stories, and analyze the required BPMN processes while starting diagrams 01 and 01A, and continue frontend UI/UX improvements.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| W06-ORQ-01 | Start and verify the complete system with Docker Compose, shared networking, health checks and persistent data | done | [Session 1 delivery](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/Sesi%C3%B3n%201/README.md); PR/commit URL pending |
| W06-PLAN-01 | Define three environments, document the configuration matrix and split MVP 2 orchestration stories | done | [Session 2 planning](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/Sesi%C3%B3n%202/README.md); PR/commit URL pending |
| BPMN-INV | Analyze and define the recommended Multi tour BPMN process inventory | done | [BPMN inventory](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/README.md#recommended-bpmn-inventory-analyzed-this-week); PR/commit URL pending |
| BPMN-01 | Model reservation creation through the customer portal | doing | Drafting started this week; diagram artifact and PR/commit URL pending |
| BPMN-01A | Model reservation registration by internal operations | doing | Drafting started this week; diagram artifact and PR/commit URL pending |
| W06-UIUX-01 | Refine the frontend user interface and user experience | doing | Specific UI/UX change evidence and PR/commit URL pending |

`W06-ORQ-01`, `W06-PLAN-01`, `BPMN-INV` and `W06-UIUX-01` are local reporting identifiers, not published issue IDs. The completed planning item does not close implementation stories `HU-MVP2-ORQ-001` through `006`, which remain `todo` in the Session 2 backlog. BPMN progress records the work reported this week; diagrams 01 and 01A are not yet marked complete.

## 2. My individual contribution
- I also worked with the team on ongoing frontend UI/UX changes to improve the interface and user experience. These adjustments are still in progress.
- I prepared the complete Multi tour stack in Session 1: Angular served by Nginx, the Spring Boot backend and PostgreSQL, started through one Docker Compose configuration.
- I configured a shared network, environment-based settings, a named database volume and health-based startup dependencies. The backend checks its database connection, and Nginx forwards API and health requests through the internal network.
- I verified application availability, creation and retrieval of a test tenant, persistence after container recreation, HTTP 503 when PostgreSQL was stopped and recovery after it restarted. I saved the integration script and actual execution evidence.
- I documented DEV, QA and PROD, their configuration matrix and separate environment templates with empty secret fields. I confirmed the remote `develop`, `qa` and `main` branches in both application repositories and documented their environment mapping.
- I divided MVP 2 orchestration into six implementation stories with dependencies, expected evidence and 25 testable acceptance criteria.
- I started the BPMN modeling work by analyzing which processes the project needs and defining the recommended inventory below. I distinguished implemented behavior, partial coverage and requirements that still need confirmation against the PDR.
- I started BPMN 01 for customer portal reservations and BPMN 01A for internal reservation registration. I kept the two entry channels separate because their actors, forms and available validations differ.

### Recommended BPMN inventory analyzed this week

| ID | Recommended process | Project scope and boundaries |
|---|---|---|
| BPMN 00 | Multi tour operational overview | Connect reservation, payment, execution, costs and cash management. Include modification, cancellation, refunds and rescheduling as alternative paths. Cash receives movements throughout the operation. |
| BPMN 01 | Create a reservation through the customer portal | Browse tours, authenticate, select date, travelers and optional transport, enter lead traveler and companion details, accept conditions, select the reservation modality, validate the form and create the reservation. Continue to BPMN 02. Draft in progress. |
| BPMN 01A | Register a reservation through internal operations | Model the Administrator or operational Collaborator workflow separately, using the fields and validations available in the internal form. Draft in progress. |
| BPMN 02 | Register and validate reservation payments | Cover transfers, cash and partial payments; payment evidence reference, authorized review, approval, rejection, retry, outstanding balance, confirmation and follow-up. Payment deadlines and automatic cancellation remain pending PDR requirements. |
| BPMN 03 | Modify a reservation before execution | Allow the Administrator or Collaborator to change service, date and traveler count, record the reason and update amounts and balance. Individual companion editing and automatic capacity/discount recalculation are not confirmed capabilities. |
| BPMN 04 | Record execution and complete a reservation | Start execution, record delivered or undelivered services with reasons and complete the reservation. Distinguish individual attendance exceptions that are not yet implemented. |
| BPMN 05 | Manage cancellation and its financial treatment | Record permitted cancellation and reason, determine balance and applicable refund, authorize or reject the refund, then execute it or record credit. Link actual money outflows to cash management. |
| BPMN 06 | Reschedule a reservation or service | Define whether to reuse a reservation or create a linked one, the agreed date, availability and financial treatment. Required by the PDR; complete implementation remains unconfirmed. |
| BPMN 07 | Record and consult operational costs | Record cost concepts and amounts associated with reservations in execution. Distinguish operational costs from commercial prices and cash disbursements. |
| BPMN 08 | Operate and close the daily cash register | Open with an authorized starting balance; record income, operational payments, expenses and refunds; close the day and consult history. Feed monthly consolidation. |
| BPMN 09 | Administer tenants | The Platform Administrator creates a tenant and its first Administrator, and manages activation, deactivation and reactivation with reasons and traceability. |
| BPMN 10 | Register and consult operational collaborators | The tenant Administrator creates the collaborator identity, associates it with the tenant and assigns the operational profile. Include collaborator consultation. |
| BPMN 11 | Administer the service catalog | Create, consult, update, deactivate and reactivate services. Manage prices, validity periods, capacity and the fields available for each service type. |
| BPMN 12 | Administer associated establishments | Register and display associated hotels and restaurants; deactivate or reactivate their publication. Commercial information does not imply reservable inventory. |
| BPMN 13 | Consult operational indicators and reports | Consult dashboards, reservations, execution, costs and monthly cash consolidation; export the available report. |
| BPMN 14 | Administer and apply authorized discounts | The Administrator maintains discounts and applies them to reservations through the existing workflow. Distinguish this from automatic promotions required by the PDR and still pending. |

This inventory defines modeling scope; it does not mean that all 16 diagrams or all corresponding software capabilities are complete.

## 3. Blockers and risks
- The DEV/QA/PROD configuration is documented but not yet implemented as three deployments. Session 1 still uses a local demo configuration; the new parameters, mandatory secrets and demo-account switch must be implemented through the MVP 2 backlog.
- Branch existence does not prove automated deployment, branch protection or completed promotion PRs. These remain implementation and delivery checks.
- BPMN 01 and 01A are still being drafted. Their files and review evidence have not yet been linked in this weekly report.
- The diagrams must not present pending requirements as implemented behavior, especially payment deadlines, automatic cancellation, complete rescheduling, automatic promotions and individual companion or attendance changes.
- Configuration templates in Session 2 contain no secret values, but the Session 1 application retains public demo credentials and seed behavior. Production secret handling and removal of demo access remain planned work.
- The weekly deliverables still need commit/PR evidence. Local files and recorded tests do not by themselves confirm publication to the remote repository.

## 4. Plan for next week
- Continue the frontend UI/UX adjustments and document the changes with review evidence and the corresponding commit/PR links.
- Continue BPMN 01 and 01A, review actors, decisions, validations and exception paths against the actual forms and PDR, and attach the diagram artifacts and review evidence.
- Connect both reservation entry processes to BPMN 02 and refine payment validation, balance and confirmation paths without assuming that pending automation exists.
- Review the remaining BPMN inventory with the team, keeping cancellation, refunds, rescheduling, operational costs and cash movements consistent across processes.
- Start MVP 2 orchestration stories 001 and 002: consume the environment matrix, isolate project resources, require private credentials and control demo-account creation by environment.
- Extend the existing integration checks to the planned environments and collect evidence of startup gating, data isolation, persistence and recovery.
- Publish the weekly artifacts and add actual commit/PR links following the project's branch-per-environment workflow.

## 5. Compliance self-check
- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [ ] No secrets; config via environment variables

The checked items are supported by the Session 2 acceptance criteria and the Session 1 integration verification script and execution record. The remaining items are not certified for this weekly delivery: commit/PR evidence is pending, no application-wide DDD/hexagonal audit was performed, and production secret handling still requires the planned changes. Session 2 templates themselves have empty secret fields and working Git ignore rules.

## 6. Evidence links

The following GitHub file URLs are prepared for publication on `main`; their availability depends on committing and pushing the weekly deliverables. PR/commit URLs remain pending.

- Complete system orchestration: [Session 1 README](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/Sesi%C3%B3n%201/README.md) and [Compose configuration](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/Sesi%C3%B3n%201/compose.yaml).
- Recorded build and startup: [Execution log](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/Sesi%C3%B3n%201/Evidencias/01-arranque.txt).
- HTTP, persistence and recovery checks: [Integration script](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/Sesi%C3%B3n%201/verificar.ps1) and [execution evidence](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/Sesi%C3%B3n%201/Evidencias/02-verificacion.txt).
- Environment planning: [Session 2 README](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/Sesi%C3%B3n%202/README.md), [configuration matrix](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/Sesi%C3%B3n%202/matriz-configuracion.md) and [branch/environment mapping](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/Sesi%C3%B3n%202/ramas-entornos.md).
- Secret-free templates: [DEV example](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/Sesi%C3%B3n%202/.env.example), [QA example](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/Sesi%C3%B3n%202/.env.qa.example), [PROD example](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/Sesi%C3%B3n%202/.env.prod.example) and [configuration/Git validation record](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/Sesi%C3%B3n%202/verificacion.txt).
- MVP 2 planning: [Six orchestration stories and acceptance criteria](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/Sesi%C3%B3n%202/historias-orquestacion.md).
- BPMN inventory: [Recommended process inventory](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/README.md#recommended-bpmn-inventory-analyzed-this-week). Separate BPMN 01 and 01A diagram links remain pending.
- Weekly summary: [Week 06 summary image](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/06-week/hu-status/Weekly%20summary/Weekly%20Summary%20%20Semana%206%20Docker%20Compose%2C%20Entornos%20y%20Orquestaci%C3%B3n.png).
