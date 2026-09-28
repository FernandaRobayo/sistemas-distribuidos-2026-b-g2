<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       08-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 08

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Update PDR to v1.9 closing all Phase 1 open decisions and GAPs, produce the C4 Level 1 System Context diagram and a UML data model draft, and align documentation folders 00, 02, 06, and 08 in the shared docs repository.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| W08-PDR-19 | Update PDR to v1.9: close GAP-01 to GAP-11 and all Phase 1 open decisions | done | [PDR_Multi_tour_v1.9.md](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/08-week/hu-status/PDR_Multi_tour_v1.9.md) · [commit 66de5a3](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/66de5a3) |
| W08-C4-01 | Produce C4 Level 1 System Context diagram for Multitour | done | [Multitour-C4-Level-1-System-Context-Diagram.png](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/08-week/hu-status/Multitour-C4-Level-1-System-Context-Diagram.png) · [08-diagrams/c4](https://github.com/code-corhuila/multi-tour-docs/tree/main/08-diagrams/c4) |
| W08-UML-01 | Draft UML data model for the 06-data ownership slice | done | [uml-06-data.pdf](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/08-week/hu-status/uml-06-data.pdf) |
| W08-DOCS-00 | Align documentation folders 00, 02, 06, 08 in multi-tour-docs with PDR v1.9 | done | [multi-tour-docs](https://github.com/code-corhuila/multi-tour-docs/tree/main) |

## 2. My individual contribution
- Updated the PDR to v1.9 (2026-09-23): closed all eleven open functional decisions from Phase 1 (GAP-01 to GAP-11) and resolved more than 100 additional team decisions covering collaborator registration, transfer payment evidence, reservation confirmation states, tenant inactivation, date-only reservation changes, cash monthly reports, hotels and restaurants as informational conveniences only, expiry treatment of partial payments, data retention, normal load and browsers, and the collaborator/associated-establishment lifecycle. The PDR v1.9 is declared the final functional baseline for Phase 1.
- Produced the C4 Level 1 System Context diagram for Multitour, showing the system boundary and its principal external actors. The diagram is published in the shared docs repo under `08-diagrams/c4`.
- Produced a first draft of the UML data model for the 06-data ownership slice, documenting the projected record structure aligned to the 4-macrodomain / 11-context DDD structure.
- Updated and aligned documentation folders 00, 02, 06, and 08 in the shared docs repository (`multi-tour-docs`) to reflect the changes introduced in PDR v1.9.

## 3. Blockers and risks
- Dockerizing Camunda with the BPMN diagrams remains a blocker for the process-automation phase. The teacher will explain the container integration strategy; this unblocks the next BPMN deployment step.

## 4. Plan for next week
- Complete the UML diagrams for all ownership slices.
- Finish the remaining C4 diagrams (Level 2 and Level 3 as applicable).
- Refine and close pending updates in the docs repo folders.
- Start implementation code aligned to the four macrodomains defined with the team.

## 5. Compliance self-check
- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

Testable acceptance criteria is confirmed: PDR v1.9 defines explicit and verifiable acceptance criteria for every closed GAP decision. DDD/hexagonal boundaries confirmed: all documentation is structured around the 4-macrodomain / 11-context model from ADR-004; no I/O or infrastructure concerns are introduced in the domain layer. No secrets applies to all documentation contributions (PDR, diagrams, UML); no credentials or environment-specific values are present. Conventional Commits and per-environment branch/PR apply to the implementation work starting next week and will be verified when the first code PR is raised. Tests are not applicable to this week's documentation-only contributions.

## 6. Evidence links
- PDR v1.9: [PDR_Multi_tour_v1.9.md](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/08-week/hu-status/PDR_Multi_tour_v1.9.md) · [commit 66de5a3](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/66de5a3)
- C4 Level 1 diagram (local): [Multitour-C4-Level-1-System-Context-Diagram.png](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/08-week/hu-status/Multitour-C4-Level-1-System-Context-Diagram.png)
- C4 diagrams in docs repo: [08-diagrams/c4](https://github.com/code-corhuila/multi-tour-docs/tree/main/08-diagrams/c4)
- UML data model draft: [uml-06-data.pdf](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/08-week/hu-status/uml-06-data.pdf)
- Weekly summary: [week-08-sessions-01-02-weekly-summary.png.png](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/blob/main/08-week/hu-status/week-08-sessions-01-02-weekly-summary.png.png)
- Docs repo (folders 00, 02, 06, 08): [multi-tour-docs](https://github.com/code-corhuila/multi-tour-docs/tree/main)
