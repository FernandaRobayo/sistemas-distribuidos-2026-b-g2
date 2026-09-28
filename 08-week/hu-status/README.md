<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       08-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 08

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Demonstrate an authorized operational-cost write/read in extracted Operations and Costs, validating Reservations in the monolith and retaining the record in its own PostgreSQL after container recreation; reject unauthorized or unverifiable requests without writing.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|

Session 2 defines the MVP 2 scope and priorities. Both members reported normal availability as qualitative capacity for the planning session on Saturday, 26 September 2026 (2026-09-26). Sprint execution period, owners and current statuses: **PENDIENTE DE CONFIRMACIÓN**. The table intentionally contains no story records; the placeholder HU has been removed. Historical work is not automatically selected for this sprint.

The academic activity is to execute a sprint with a prioritized backlog, testable stories, a WIP limit, PRs for changes, daily coordination and throughput tracking. This activity objective does not establish the team's sprint commitment. See the [Session 1 record](Sesión%201/README.md) for the backlog and evidence structures.

## 2. My individual contribution
- The [Session 2 planning record](Sesión%202/README.md) defines the minimal operational-cost journey: extracted Operations and Costs queries Reservations in the monolith and persists in its own PostgreSQL. It includes a Story Map, goal/Release Line, eight MUST units (49 SP) and one SHOULD (8 SP), totaling 57 SP, and contract-first steps. Maria Fernanda Robayo and Jhon Sebastian Molina accepted these estimates, as explicitly confirmed by the user. Planning session: Saturday, 26 September 2026 (2026-09-26). Maria Fernanda Robayo: normal availability. Jhon Sebastian Molina: normal availability. This is qualitative capacity only, without hours or a numeric SP capacity. Session 2 §7 records the team's actual Planning Poker results: nine items, both participants' votes, four discussions and their second rounds. This is documentation, not implementation or story acceptance.
- This delivery organizes the available evidence and prepares the Session 1 record. It does not claim accepted product stories or completed sprint execution.
- The [Session 1 record](Sesión%201/README.md) now includes a candidate-to-PDR mapping, functional corrections supported by v1.9, role/permission distinctions, reusable DoD controls and documented dependencies. These are documentary corrections, not implemented features or accepted sprint stories.
- Confirmed documentary evidence: [PDR v1.9](PDR_Multi_tour_v1.9.md) is available in Week 8 and was changed by [commit 66de5a3](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/66de5a3). Its sections 1 and 24 still make final documentary closure conditional on an audit; the commit title does not override that statement. No HU, acceptance or sprint assignment is inferred from this artifact.
- Profile identity and team are carried over from the [Week 7 report](../../07-week/hu-status/README.md). Individual implementation contributions and accepted outcomes for the current sprint: **PENDIENTE DE CONFIRMACIÓN**.

## 3. Blockers and risks
- MVP 2 scope, priority, goal and consensus SP are recorded in Session 2. Normal availability is recorded for both members. Sprint execution period, ownership, technical details and applicable Definition of Done still require confirmation; 49 SP do not establish sprint capacity.
- WIP agreement: **PENDIENTE DE CONFIRMACIÓN POR EL EQUIPO**. Included states and treatment of blocked work: **PENDIENTE DE CONFIRMACIÓN**. The exact agreement fields are in Session 1.
- Daily records and PR/review/validation evidence attributable to this sprint: **SIN EVIDENCIA REGISTRADA** in the current record. Historical evidence is listed separately.
- Observed WIP, accepted stories and sprint throughput: **PENDIENTE DE CONFIRMACIÓN**; missing evidence is not recorded as zero.
- HU-05 identifies different work in the initial backlog and the Week 7 report. Use its source together with the identifier until the team confirms the mapping. Historical acceptance criteria and the MVP 1 DoD must not be applied to current work without checking PDR v1.9 and the agreed scope.
- Functional rules already settled by PDR v1.9 are recorded in Session 1: registration/activation, recovery, capacity versus seat allocation, payments, discounts, execution, tenant timezone and backup objectives. ADR-004 fixes four macrodomain services and extraction of Operations and Costs first. Reservations owns reservation economic state; Cash owns cash movements. Open questions concern concrete transition interfaces, identity propagation, economic coordination/publication and deployment destination, not those established responsibilities. Session 2 narrows the current cut to Operations, the transitional Reservations provider and independent PostgreSQL; economic messaging and production promotion decisions remain in the later backlog.

## 4. Plan for next week
- Next-week commitments: **PENDIENTE DE CONFIRMACIÓN**. Required follow-up is to confirm the sprint record, agree WIP, record actual daily coordination and link each accepted story to its PR, review and validation.
- Session 2 records final MUST/SHOULD/POSTERIOR scope and agreed estimates without treating parent stories as complete. Historical priorities remain unchanged; MUST 49 SP, SHOULD 8 SP, total 57 SP.
- Before implementation/acceptance, resolve bounded technical details and DoD. Use the reported normal availability only for the qualitative forecast; the planning date does not define the sprint execution period. Consensus and the reported Planning Poker votes/rounds are recorded. This first estimated commitment is the baseline for measuring observed velocity after sprint execution, using accepted stories only. Historical velocity: **VELOCIDAD HISTÓRICA NO DISPONIBLE** in the reviewed records.

## 5. Compliance self-check
- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [ ] No secrets; config via environment variables

The checkboxes remain unchecked: this record does not certify compliance for an unconfirmed sprint scope. Historical tests, PRs and architecture documents do not establish current-sprint compliance. No product code, workflow or runtime configuration is changed by this documentation task.

## 6. Evidence links
- **Confirmed documentary evidence:** [Week 8 PDR v1.9](PDR_Multi_tour_v1.9.md) and its commit linked above. These demonstrate an artifact, not acceptance of a sprint story.
- **Current execution record:** [Session 1 — backlog, acceptance, WIP, daily coordination, PR traceability and metrics](Sesión%201/README.md). Execution evidence: **SIN EVIDENCIA REGISTRADA**; team decisions remain pending.
- **PDR alignment:** the same Session 1 document distinguishes confirmed functional corrections, historical candidate stories and unresolved technical decisions. It does not select candidates or change historical priorities.
- **Historical references:** [Week 7 status](../../07-week/hu-status/README.md), [MVP 1 board](../../04-week/hu-status/Sesión%202/sprint-mvp1-board.md) and [MVP 1 DoD](../../04-week/hu-status/Sesión%202/definition-of-done.md).
- **Session 2 inputs:** [MVP 2 orchestration stories](../../06-week/hu-status/Sesión%202/historias-orquestacion.md) and [MVP 2 integration stories](../../07-week/hu-status/Sesión%202/historias-integracion-mvp2.md).
- **Session 2 planning:** [Final story map, scope, contract dependencies and consensus estimates](Sesión%202/README.md). Consensus estimates and functional commitment are recorded. The planning date and normal availability of both members are recorded. Actual Planning Poker results supplied by the team are recorded in Session 2 §7. Session 2 planning is ready for delivery; this does not certify product implementation or Session 1 sprint execution.
- **Technical planning evidence:** the Session 2 record links ADR-004, current architecture and existing contracts, distinguishes internal/remote/transitional dependencies, records required contract adjustments without editing OpenAPI/JSON Schema, and separates historical evidence from planned simulations. The decision register separates closed SP consensus from recorded qualitative availability, future execution details and completed Planning Poker evidence; D-03/D-04 remain later work. The requirement matrix distinguishes documented planning from pending team execution.
