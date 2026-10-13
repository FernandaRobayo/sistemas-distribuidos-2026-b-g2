<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       09-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 09

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Produce ERD diagrams for the commercial-reservation, operations-cost, and cash-reporting macrodomains and a global UML domain view, aligned to the 4-macrodomain / 11-context DDD structure.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| W09-ERD-01 | ERD for the commercial-reservation macrodomain (D-02) | done | [ERD-01 — commercial-reservation.png](https://github.com/code-corhuila/multi-tour-docs/blob/main/08-diagrams/er/ERD-01%20%E2%80%94%20commercial-reservation.png) · [commit ebc6ea2](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/ebc6ea2) · [multi-tour-docs PR #69](https://github.com/code-corhuila/multi-tour-docs/pull/69) |
| W09-ERD-02 | ERD for the operations-cost macrodomain (D-03) | done | [ERD-02 — operations-cost.png](https://github.com/code-corhuila/multi-tour-docs/blob/main/08-diagrams/er/ERD-02%20%E2%80%94%20operations-cost.png) · [commit ebc6ea2](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/ebc6ea2) · [multi-tour-docs PR #70](https://github.com/code-corhuila/multi-tour-docs/pull/70) |
| W09-ERD-03 | ERD for the cash-reporting macrodomain (D-04) | done | [ERD-03 — cash-reporting.png](https://github.com/code-corhuila/multi-tour-docs/blob/main/08-diagrams/er/ERD-03%20%E2%80%94%20cash-reporting.png) · [commit ebc6ea2](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/ebc6ea2) · [multi-tour-docs PR #71](https://github.com/code-corhuila/multi-tour-docs/pull/71) |
| W09-UML-01 | Global domain view UML and corrected 06-data UML blueprint | done | [uml-00-global-domain-view.png](https://github.com/code-corhuila/multi-tour-docs/blob/main/08-diagrams/uml/uml-00-global-domain-view.png.png) · [uml-06-data-corregido.pdf](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/09-week/hu-status/uml-06-data-corregido.pdf) · [commit a32761d](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/a32761d) · [multi-tour-docs PR #79](https://github.com/code-corhuila/multi-tour-docs/pull/79) |

## 2. My individual contribution
- Produced ERD-01 for the commercial-reservation macrodomain (D-02), documenting the entity-relationship structure of the reservations, customers, catalog, discounts, and payment slices aligned to PDR v1.9.
- Produced ERD-02 for the operations-cost macrodomain (D-03): 9 tables — `salidas`, `vehicles`, `operational_executions`, `salida_vehicle_assignments`, `executed_services`, `non_executed_services`, `execution_incidents`, `operational_costs`, `cost_lines` — with 7 physical FKs (intra-domain), 4 cross-domain references without FK (`serviceReference` × 3, `reservationId` × 1), and one undefined relation (`vehicles` domain not yet assigned).
- Produced ERD-03 for the cash-reporting macrodomain (D-04): 7 tables — `cash_sessions`, `cash_session_reopenings`, `cash_movements`, `refund_movements`, plus 3 projections (`reporting_views`, `daily_dashboard_projections`, `monthly_administrative_reports`) — with 4 physical FKs (intra-domain) and 2 cross-domain references without FK (`refundAuthorizationId`, `reservationId`).
- Produced the global UML domain view (`uml-00-global-domain-view`) showing all 11 bounded contexts and their relationships across the 4 macrodomains.
- Produced the corrected 06-data UML blueprint (`uml-06-data-corregido`), a planning document that documents corrections to the previous data model draft and serves as the construction guide for the formal Draw.io UML diagrams.
- All diagrams published to the shared docs repository under `08-diagrams/er/` and `08-diagrams/uml/`.

## 3. Blockers and risks
- The team's HU proposal has not yet been approved in the GitHub project board. Implementation work on the microservices cannot begin until the stories are accepted.

## 4. Plan for next week
- Start implementation code for the d01-plataforma and d04-caja-reportes microservice domains.
- Complete the remaining BPMN process diagrams.
- Complete the C4 Level 2 and Level 3 architecture diagrams.
- Complete the formal UML class diagrams for all ownership slices.

## 5. Compliance self-check
- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

Testable acceptance criteria is confirmed: each ERD defines explicit tables, fields, data types, PK/FK constraints, and cross-domain boundary markers (no FK across bounded contexts) — all verifiable against PDR v1.9 and `06-data/models.md`. DDD/hexagonal boundaries confirmed: every ERD is scoped to a single macrodomain; cross-domain references are documented as logical references without physical FKs, consistent with the DDD isolation rule. No secrets applies: all contributions are diagrams and planning documents with no credentials or environment-specific values. Conventional Commits and per-environment branch/PR will apply to the implementation work starting next week.

## 6. Evidence links
- ERD diagrams commit (Sep 30): [docs(09-week): add ERD diagrams and data blueprint · ebc6ea2](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/ebc6ea2)
- Corrected UML artifacts commit (Oct 3): [docs(week09): add corrected UML artifacts · a32761d](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/a32761d)
- Week 09 evidence update (Oct 4): [docs(09-week): update week 9 evidence and status · 83025ae](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/83025ae)
- ERD-01 commercial-reservation: [ERD-01 — commercial-reservation.png](https://github.com/code-corhuila/multi-tour-docs/blob/main/08-diagrams/er/ERD-01%20%E2%80%94%20commercial-reservation.png) · [local SVG](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/09-week/hu-status/ERD-01.svg) · [multi-tour-docs PR #69](https://github.com/code-corhuila/multi-tour-docs/pull/69)
- ERD-02 operations-cost: [ERD-02 — operations-cost.png](https://github.com/code-corhuila/multi-tour-docs/blob/main/08-diagrams/er/ERD-02%20%E2%80%94%20operations-cost.png) · [local SVG](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/09-week/hu-status/ERD-02.svg) · [multi-tour-docs PR #70](https://github.com/code-corhuila/multi-tour-docs/pull/70)
- ERD-03 cash-reporting: [ERD-03 — cash-reporting.png](https://github.com/code-corhuila/multi-tour-docs/blob/main/08-diagrams/er/ERD-03%20%E2%80%94%20cash-reporting.png) · [local SVG](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/09-week/hu-status/ERD-03.svg) · [multi-tour-docs PR #71](https://github.com/code-corhuila/multi-tour-docs/pull/71)
- ERD 06-data (full model PDF): [erd-06-data.pdf](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/09-week/hu-status/erd-06-data.pdf)
- Global UML domain view: [uml-00-global-domain-view.png](https://github.com/code-corhuila/multi-tour-docs/blob/main/08-diagrams/uml/uml-00-global-domain-view.png.png) · [multi-tour-docs PR #79](https://github.com/code-corhuila/multi-tour-docs/pull/79)
- Corrected 06-data UML blueprint: [uml-06-data-corregido.pdf](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/09-week/hu-status/uml-06-data-corregido.pdf) · [HTML version](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/09-week/hu-status/uml-06-data-corregido.html)
- multi-tour-docs PRs — 06-data alignment + ADR-004 decisions: [PR #81](https://github.com/code-corhuila/multi-tour-docs/pull/81) · [PR #84](https://github.com/code-corhuila/multi-tour-docs/pull/84) · [PR #86](https://github.com/code-corhuila/multi-tour-docs/pull/86) · [PR #88](https://github.com/code-corhuila/multi-tour-docs/pull/88) · [PR #89](https://github.com/code-corhuila/multi-tour-docs/pull/89)
- multi-tour-docs PRs — C4 + UML-00 updates: [PR #87](https://github.com/code-corhuila/multi-tour-docs/pull/87) · [PR #124](https://github.com/code-corhuila/multi-tour-docs/pull/124) · [PR #134](https://github.com/code-corhuila/multi-tour-docs/pull/134)
- multi-tour-docs PRs — governance + domain alignment: [PR #80](https://github.com/code-corhuila/multi-tour-docs/pull/80) · [PR #97](https://github.com/code-corhuila/multi-tour-docs/pull/97) · [PR #100](https://github.com/code-corhuila/multi-tour-docs/pull/100) · [PR #122](https://github.com/code-corhuila/multi-tour-docs/pull/122) · [PR #138](https://github.com/code-corhuila/multi-tour-docs/pull/138)
