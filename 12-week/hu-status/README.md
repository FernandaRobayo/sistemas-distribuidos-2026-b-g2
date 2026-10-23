<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       12-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 12

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Plan the MVP 3 deployment of Multi Tour and validate artifact reuse, reproducible local environments, front blue-green switching and a timed rollback with recorded evidence.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| N/A (Session 2 activity) | MVP 3 deployment planning: artifact promotion, IaC, blue-green strategy, timed rollback and deployment stories with testable acceptance criteria | done | [lab and plan PR #1](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/pull/1) · [Session 2 delivery](Sesión%202/README.md) · [execution evidence](Sesión%202/Evidencias/resultado.json) |

## 2. My individual contribution
- Wrote the MVP 3 deployment plan, rollback runbook and seven proposed deployment stories with acceptance criteria, dependencies and explicit product implementation gaps.
- Added an isolated Compose lab using the same existing image IDs in dev, qa and simulated local production, with per-environment public configuration and checked NGINX reloads.
- Ran front blue-green promotion, rollback under continuous HTTP traffic, unhealthy-target rejection and environment recreation. Results and image identities are recorded in Session 2 evidence.

## 3. Blockers and risks
- The lab covers the front page and gateway health, not complete business journeys or public-cloud production. Registry publishing and CI/CD remain planned work.
- Angular runtime configuration, full-system readiness, database backup/restore and migration compatibility require product-level implementation and evidence. DEP-* references are local planning identifiers, not official backlog HU IDs.
- The lab and plan are published in draft PR #1; the companion documentation branch contains the guide, runbook and weekly status. Review and merge remain pending; no product deployment or promotion was performed.

## 4. Plan for next week
- Assign the proposed deployment stories to the official MVP 3 backlog; continue with security and CI/CD, including registry digests, promotion gates and effective frontend runtime configuration.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

The integration checks are executable infrastructure smoke/recovery checks. No product domain code was changed.
The academic delivery uses documentation branches and draft PRs. The per-environment product HU PR item is not applicable here; no product promotion was performed.

## 6. Evidence links
- [Published lab and plan PR #1](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/pull/1)
- [Deployment plan](Sesión%202/plan-despliegue.md) · [MVP 3 stories](Sesión%202/historias-mvp3.md)
- [Rollback runbook](Sesión%202/runbook-reversion.md) · [Executable rehearsal](Sesión%202/ensayar.ps1)
- [Measured result](Sesión%202/Evidencias/resultado.json) · [Image promotion](Sesión%202/Evidencias/promocion-imagenes.json) · [Execution log](Sesión%202/Evidencias/ensayo.log) · [Continuous traffic](Sesión%202/Evidencias/trafico.log)
