<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       10-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 10

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Complete the local MVP 2 documentation package, verify archived evidence, and prepare the Corte 3 handoff.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-WRK-007 | Audit outbox relay delivery and retries | doing | [Published session 1 evidence](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/e1ce637); [session 2 candidate](Sesión%202/README.md), local publication pending |

## 2. My individual contribution
- Previously checked develop, qa, main, and v2.0.0 references for four onboarding components on October 11.
- Previously executed Go component suites with disposable PostgreSQL and four controlled saga scenarios with simulated participants.
- Recorded the newer workflow runtime, remaining recovery and delivery blockers, an integration demonstration plan, preliminary retrospective, and Corte 3 backlog.
- Closed the documentation on October 12 with offline checks of archived logs, counters, patch hashes, and internal links; current work is restricted to this repository.

## 3. Blockers and risks
- Recovery may compensate a tenant after an administrator was created but its step was not saved; concurrent recovery remains unsafe.
- Revocation/blocking events still lack recipients; event-id deduplication and MongoDB atomicity need completion or verification.
- Real end-to-end integration, full-project DoD, individual team evidence, QA promotion, and teacher-approved release remain pending.
- MVP 2 is not released. Component test results do not establish end-to-end acceptance.

## 4. Plan for next week
- Follow the [Corte 3 proposed backlog](Sesión%202/README.md#pendientes-propuestos-para-corte-3), preserving week 10 as historical evidence.
- Resolve MVP 2 blockers before promoting approved commits with cherry-pick -x and tagging the approved main version.

## 5. Compliance self-check
- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

Earlier product fixes remain historical evidence; this documentation closure does not access external repositories. See the [archived fix evidence](Sesión%202/Evidencias/correcciones.json).
The template branch example above is historical; the candidate follows norm 6.1:
docs/10-week-mvp2-session-2, based on main, with a documentation PR still pending.

## 6. Evidence links
- [Session 1 published commit](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/e1ce637)
- [Session 2 report, DoD, retrospective, and Corte 3 backlog](Sesión%202/README.md)
- [Component results](Sesión%202/Evidencias/resultados.json)
- [Remote branch and tag snapshot](Sesión%202/Evidencias/remotos.json)
- [Controlled failure evidence](Sesión%202/Evidencias/fallo-compensacion.jsonl)
- [Local delivery package and verification](Sesión%202/ENTREGA.md)
