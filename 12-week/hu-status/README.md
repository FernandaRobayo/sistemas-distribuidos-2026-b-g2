<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       12-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 12

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- SPRINT_GOAL: Close the domain 02 commercial-reservation portal against the mockup, start the D-04 cash-reporting portal, connect the first catalog and establishment slices to the real commercial-reservation api (HU-COM-001 and HU-COM-002) and promote them to QA, align the operator shell and sidebar of the front, and plan the MVP 3 deployment with a verified rollback rehearsal.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-COM-001 | Manage tour catalog: catalog hub layout, forms aligned with the api contract, collaborator update, routes under the domain segment, QA promotion | done | [portal #123](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/123) · [portal #135](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/135) · [portal #136](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/136) · [portal #137](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/137) · [api #23](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/pull/23) · [api #24](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/pull/24) · [api #25](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/pull/25) · [docs #488](https://github.com/code-corhuila/multi-tour-docs/pull/488) · [docs #494](https://github.com/code-corhuila/multi-tour-docs/pull/494) · [docs #495](https://github.com/code-corhuila/multi-tour-docs/pull/495) |
| HU-COM-002 | Manage an associated establishment on the same screen and align it with the real api | doing | [portal #134](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/134) · [portal #138](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/138) · [api #26](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/pull/26) · [docs #503](https://github.com/code-corhuila/multi-tour-docs/pull/503) · [docs #504](https://github.com/code-corhuila/multi-tour-docs/pull/504) · [docs #505](https://github.com/code-corhuila/multi-tour-docs/pull/505) · [docs #506](https://github.com/code-corhuila/multi-tour-docs/pull/506) |
| HU-COM-004 | Additional discount: finish the entrances (week 11 carry-over), simplify the discount form and let the administrator reactivate an inactive rule | done | [portal #115](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/115) – [#119](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/119) · [portal #120](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/120) · [portal #131](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/131) |
| HU-COM-007 | Create a reservation: tour-only selector, pending holder note and new service form with transport and image | done | [portal #121](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/121) · [portal #122](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/122) · [portal #124](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/124) |
| HU-COM-009 | Payment parameters screen: button layout | done | [portal #125](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/125) |
| HU-COM-010 / HU-COM-011 | Payments table: Saldo a favor link in the Pagos header and customer phone in the follow-up screen | doing | [portal #127](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/127) · [portal #132](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/132) |
| W12-RES-1 | Reservation detail drawn as the mockup, operator table status colors and demo episode for Reprogramar | doing | [portal #126](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/126) · [portal #128](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/128) · [portal #129](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/129) · [portal #133](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/133) |
| W12-CSH-1 | D-04 cash-reporting portal: metrics layout, open, close and reopen the daily cash, correction after a closing, PDF report | doing | [cash #21](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/pull/21) · [cash #22](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/pull/22) · [cash #23](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/pull/23) · [cash #24](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/pull/24) · [cash #25](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/pull/25) · [cash #26](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/pull/26) · [cash #27](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/pull/27) |
| W12-FRT-1 | Operator shell: Auditoría and role menus, redirect to the identity area, fixed sidebar, active area reported by the portals, FormData upload | doing | [front #40](https://github.com/code-corhuila/multi-tour-front/pull/40) · [front #41](https://github.com/code-corhuila/multi-tour-front/pull/41) · [front #42](https://github.com/code-corhuila/multi-tour-front/pull/42) · [front #43](https://github.com/code-corhuila/multi-tour-front/pull/43) · [front #45](https://github.com/code-corhuila/multi-tour-front/pull/45) · [portal #130](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/130) |
| W12-DOC-1 | Authorized screens re-anchored with the sidebar of each role; identity-audit data model update | done | [docs #470](https://github.com/code-corhuila/multi-tour-docs/pull/470) · [docs #502](https://github.com/code-corhuila/multi-tour-docs/pull/502) |
| N/A (Session 2 activity) | MVP 3 deployment planning: artifact promotion, IaC, blue-green strategy, timed rollback and deployment stories with testable acceptance criteria | done | [lab and plan PR #1](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/pull/1) · [Session 2 delivery](Sesión%202/README.md) · [execution evidence](Sesión%202/Evidencias/resultado.json) |

## 2. My individual contribution
- Connected the first slices to the real commercial-reservation api: the enabled collaborator can update the descriptive information of a catalog entry (api #23) and the routes are served under the domain segment (api #24); both were promoted to QA (api #25). The matching portal changes aligned the catalog forms with the api contract (portal #135), explain in Spanish why a capacity below the held seats is refused (portal #136) and were promoted to QA with the new service transport (portal #137). The establishments screen is being aligned with the real api (portal #138) and an api test covers the establishment transition events in the same transaction (api #26).
- Published the specs that match the built state in multi-tour-docs: the domain-segment contract (docs #495), the associated establishments operations (docs #503), and the HU-COM-001 and HU-COM-002 api, db and portal specs synced with what was built (docs #488, #494, #504, #505, #506).
- Finished the domain 02 portal against the mockup: removed the help text under the calculation base of the discount form (portal #120), offered only tours in the reservation selector (portal #121), showed the pending holder note without the open point code (portal #122), laid out the catalog hub cards without overflow (portal #123), drew the associated transport and the image in the new service form (portal #124), laid out the payment parameters buttons (portal #125) and moved the Saldo a favor link to the header of Pagos (portal #127).
- Redrew the reservation detail as the mockup and grouped its header actions (portal #128, #129), drew the status colors and tidied the actions and widths of the operator tables (portal #126), gave the demo reservation RES-1835 the episode that its Reprogramar opens (portal #133), let the administrator reactivate an inactive discount rule (portal #131), managed an associated establishment on the same screen (portal #134) and showed the customer phone in the follow-up screen (portal #132).
- Started and built most of the D-04 cash-reporting portal: arranged the seven metrics in two rows (cash #21), opened the daily cash from screen 14 (cash #25), closed a pending daily cash (cash #27), reopened a closed daily cash with a reason (cash #26), laid out the PDF of the report as a document (cash #24) and opened the correction after a closing from the cash history (cash #22).
- Aligned the operator shell in the front: Auditoría and the role menus in the sidebar (front #40), redirect to the identity area after sign-in (front #41), a shell that fills the viewport with a fixed sidebar (front #42), and the sidebar marks the area that each portal reports (front #43, portal #130, cash #23). A fix to send a FormData as is and give file errors their own messages is open (front #45).
- Re-anchored the authorized screens with the sidebar of each role (docs #470) and added `account_session_cutoff` to the identity-audit data model (docs #502).
- Closed the carry-over of week 11: the five HU-COM-004 entrance PRs (portal #115 to #119) and db #14 (concurrent-index fix promoted to QA) were merged.
- Session 2 (planning): wrote the MVP 3 deployment plan, the rollback runbook and seven proposed deployment stories with acceptance criteria and explicit product gaps; ran an isolated Compose lab that reuses the same image IDs in dev, qa and simulated local production, front blue-green promotion, rollback under continuous HTTP traffic and unhealthy-target rejection (evidence in Session 2).

## 3. Blockers and risks
- Open PRs at the end of the week: portal #128, #132, #138; cash #22; api #26; front #45. They need team review before merging.
- The portal release PR #98 and the api release PR #22 (to release/2.0.0) are still open; the new HU-COM-001 slice is only promoted to QA.
- Only HU-COM-001 and HU-COM-002 talk to a real api; the rest of the domain 02 screens and the cash-reporting portal still run on demo adapters until their api and db slices exist.
- The Session 2 lab covers the front page and gateway health, not complete business journeys or public-cloud production. Registry publishing, CI/CD, Angular runtime configuration, database backup/restore and migration compatibility need product-level implementation and evidence. DEP-* references are local planning identifiers, not official backlog HU IDs.
- The Session 2 delivery is published directly on main, as authorized for this course repository. Its PRs #1 and #2 are historical references; no product deployment or promotion was performed by it.

## 4. Plan for next week
- Review and merge the open PRs (portal #128, #132, #138; cash #22; api #26; front #45) and promote the finished work to QA.
- Close the release PRs for the portal (#98) and the api (#22) once the team reviews them.
- Continue connecting the remaining domain 02 slices to the api and db (HU-COM-003 onward) and the cash-reporting portal to its own api.
- Assign the proposed deployment stories to the official MVP 3 backlog; continue with security and CI/CD, including registry digests, promotion gates and effective frontend runtime configuration.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [x] Per-environment HU branch + PR to that environment (feature PRs to develop; `chore` promotion PRs to qa: portal #137, api #25)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration - for example api #26 covers the establishment transition events)
- [x] DDD / hexagonal boundaries respected (domain has no I/O; ports and adapters isolated)
- [x] No secrets; config via environment variables

The Session 2 activity is infrastructure only; no product domain code was changed by it. Promotion to release/2.0.0 for the new slices is pending (see section 3).

## 6. Evidence links
- portal PRs - domain 02 mockup fidelity and HU-COM-001/002/004/007/009/010/011 (Oct 21-24): [#120](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/120) · [#121](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/121) · [#122](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/122) · [#123](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/123) · [#124](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/124) · [#125](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/125) · [#126](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/126) · [#127](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/127) · [#128](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/128) · [#129](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/129) · [#130](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/130) · [#131](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/131) · [#132](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/132) · [#133](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/133) · [#134](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/134) · [#135](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/135) · [#136](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/136) · [#137](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/137) · [#138](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/138)
- api PRs - HU-COM-001 collaborator update, domain segment routes, QA promotion and HU-COM-002 test (Oct 23-24): [#23](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/pull/23) · [#24](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/pull/24) · [#25](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/pull/25) · [#26](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/pull/26)
- cash-reporting portal PRs - D-04 daily cash (Oct 22): [#21](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/pull/21) · [#22](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/pull/22) · [#23](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/pull/23) · [#24](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/pull/24) · [#25](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/pull/25) · [#26](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/pull/26) · [#27](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/pull/27)
- front PRs - operator shell and sidebar (Oct 21-24): [#40](https://github.com/code-corhuila/multi-tour-front/pull/40) · [#41](https://github.com/code-corhuila/multi-tour-front/pull/41) · [#42](https://github.com/code-corhuila/multi-tour-front/pull/42) · [#43](https://github.com/code-corhuila/multi-tour-front/pull/43) · [#45](https://github.com/code-corhuila/multi-tour-front/pull/45)
- docs PRs - specs and screens (Oct 21-24): [#470](https://github.com/code-corhuila/multi-tour-docs/pull/470) · [#488](https://github.com/code-corhuila/multi-tour-docs/pull/488) · [#494](https://github.com/code-corhuila/multi-tour-docs/pull/494) · [#495](https://github.com/code-corhuila/multi-tour-docs/pull/495) · [#502](https://github.com/code-corhuila/multi-tour-docs/pull/502) · [#503](https://github.com/code-corhuila/multi-tour-docs/pull/503) · [#504](https://github.com/code-corhuila/multi-tour-docs/pull/504) · [#505](https://github.com/code-corhuila/multi-tour-docs/pull/505) · [#506](https://github.com/code-corhuila/multi-tour-docs/pull/506)
- Carry-over from week 11 merged this week: portal [#115](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/115) to [#119](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/pull/119) (HU-COM-004) and [db #14](https://github.com/code-corhuila/multi-tour-commercial-reservation-db/pull/14)
- Session 2: [lab and plan PR #1](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/pull/1) · [historical PR #2](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/pull/2) · [Deployment plan](Sesión%202/plan-despliegue.md) · [MVP 3 stories](Sesión%202/historias-mvp3.md) · [Rollback runbook](Sesión%202/runbook-reversion.md) · [Measured result](Sesión%202/Evidencias/resultado.json) · [Execution log](Sesión%202/Evidencias/ensayo.log)

### Commits of the week (Oct 20-24, non-merge commits, by repository)
- **multi-tour-cash-reporting-portal**
  - [`2b2a374`](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/commit/2b2a374) 2026-10-21 - test(portal): cover the layout of the seven metrics of the cash screen
  - [`36b62e0`](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/commit/36b62e0) 2026-10-21 - test(portal): cover the formal closing of a pending daily cash
  - [`43a6397`](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/commit/43a6397) 2026-10-21 - fix(portal): arrange the seven metrics of the cash screen in two rows
  - [`74ff16b`](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/commit/74ff16b) 2026-10-21 - feat(portal): close a pending daily cash from screen 14
  - [`766f4e4`](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/commit/766f4e4) 2026-10-21 - feat(portal): reopen the closed daily cash with a reason
  - [`94953fa`](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/commit/94953fa) 2026-10-21 - test(portal): cover the reopening of the closed daily cash
  - [`b390a39`](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/commit/b390a39) 2026-10-21 - test(portal): cover the area the portal reports to the container chrome
  - [`d9c543e`](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/commit/d9c543e) 2026-10-21 - feat(portal): lay out the PDF of the report as a document
  - [`edbf26d`](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/commit/edbf26d) 2026-10-21 - feat(portal): open the daily cash from screen 14
  - [`f4baa0e`](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/commit/f4baa0e) 2026-10-21 - test(portal): cover the layout of the PDF of the report
  - [`fabe4e2`](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/commit/fabe4e2) 2026-10-21 - test(portal): cover the operational opening of the daily cash
  - [`fbebd9d`](https://github.com/code-corhuila/multi-tour-cash-reporting-portal/commit/fbebd9d) 2026-10-21 - fix(portal): report the area it shows to the container sidebar

- **multi-tour-commercial-reservation-api**
  - [`4dd1fc5`](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/commit/4dd1fc5) 2026-10-23 - feat(api): serve the routes under the domain segment
  - [`700f0a2`](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/commit/700f0a2) 2026-10-23 - test(api): expect the routes under the domain segment
  - [`be2eebe`](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/commit/be2eebe) 2026-10-23 - feat(api): let the enabled collaborator update the descriptive information
  - [`d48a69c`](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/commit/d48a69c) 2026-10-23 - test(api): cover the enabled collaborator updating the descriptive information
  - [`e08b0d5`](https://github.com/code-corhuila/multi-tour-commercial-reservation-api/commit/e08b0d5) 2026-10-23 - chore(api): merge develop into the route prefix branch

- **multi-tour-commercial-reservation-portal**
  - [`10cb2e3`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/10cb2e3) 2026-10-20 - test(portal): expect no transportation item in the tour selector of the reservation form
  - [`675b9e0`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/675b9e0) 2026-10-20 - test(portal): expect the pending holder note without the open point code
  - [`74db06f`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/74db06f) 2026-10-20 - test(portal): expect the discount form without help text the mockup does not have
  - [`8eda4ac`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/8eda4ac) 2026-10-20 - feat(portal): drop the help text under the calculation base of the discount form
  - [`cc16d8a`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/cc16d8a) 2026-10-20 - feat(portal): show the pending holder note without the open point code
  - [`d9e2c2a`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/d9e2c2a) 2026-10-20 - feat(portal): offer only tours in the reservation form selector
  - [`0605988`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/0605988) 2026-10-21 - fix(portal): draw the status colors and tidy the actions and widths of the operator tables
  - [`14d08dc`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/14d08dc) 2026-10-21 - test(portal): cover the transport and the image of the new service screen
  - [`23371ca`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/23371ca) 2026-10-21 - fix(portal): give RES-1835 of the demo the episode that its Reprogramar opens
  - [`3fae5b2`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/3fae5b2) 2026-10-21 - test(portal): cover the look of the payments and refund tables
  - [`45cf36a`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/45cf36a) 2026-10-21 - feat(portal): draw the associated transport and the image in the new service form
  - [`58b5a44`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/58b5a44) 2026-10-21 - fix(portal): lay out the buttons of the payment parameters screen
  - [`6320d78`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/6320d78) 2026-10-21 - fix(portal): lay out the catalog hub cards without overflow
  - [`6b7f3e1`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/6b7f3e1) 2026-10-21 - fix(portal): move the Saldo a favor link to the header of Pagos
  - [`738bfb1`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/738bfb1) 2026-10-21 - test(portal): cover the content of the reservation detail and its payments block
  - [`776100b`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/776100b) 2026-10-21 - fix(portal): draw the content of the reservation detail as the mockup
  - [`97eb56f`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/97eb56f) 2026-10-21 - fix(portal): let the administrator reactivate an inactive discount rule
  - [`a897229`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/a897229) 2026-10-21 - test(portal): cover the Saldo a favor link as a header action of Pagos
  - [`ad3370e`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/ad3370e) 2026-10-21 - test(portal): cover the reactivation of a discount rule
  - [`dd389a8`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/dd389a8) 2026-10-21 - fix(portal): report the area it shows to the container sidebar
  - [`edb7a87`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/edb7a87) 2026-10-21 - test(portal): cover that every Reprogramar of the demo leads to an episode
  - [`f7a2079`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/f7a2079) 2026-10-21 - test(portal): cover the area the portal reports to the container chrome
  - [`da6ba0c`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/da6ba0c) 2026-10-22 - feat(portal): manage an associated establishment on the same screen
  - [`e974b04`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/e974b04) 2026-10-22 - test(portal): cover the management of an establishment on its screen
  - [`8958429`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/8958429) 2026-10-23 - test(portal): cover the Spanish reason of a capacity below the held seats
  - [`a5d5ff8`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/a5d5ff8) 2026-10-23 - fix(portal): align the catalog forms with the api contract
  - [`b6f4abf`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/b6f4abf) 2026-10-23 - fix(portal): explain in Spanish why a capacity below the held seats is refused
  - [`f1b76ad`](https://github.com/code-corhuila/multi-tour-commercial-reservation-portal/commit/f1b76ad) 2026-10-23 - test(portal): cover the catalog forms against the api contract

- **multi-tour-docs**
  - [`6e0daee`](https://github.com/code-corhuila/multi-tour-docs/commit/6e0daee) 2026-10-20 - docs(12-ux-ui): re-anchor the authorized screens and add the sidebar of each role
  - [`3083e5e`](https://github.com/code-corhuila/multi-tour-docs/commit/3083e5e) 2026-10-23 - docs(07-api): sync the hu-com-001 api spec with the built state (#488)
  - [`647cac7`](https://github.com/code-corhuila/multi-tour-docs/commit/647cac7) 2026-10-23 - docs(07-api): serve the commercial-reservation contract under the domain segment (#495)
  - [`e417282`](https://github.com/code-corhuila/multi-tour-docs/commit/e417282) 2026-10-23 - docs(07-api): amend the hu-com-001 portal spec to the api contract (#494)
  - [`126a64c`](https://github.com/code-corhuila/multi-tour-docs/commit/126a64c) 2026-10-24 - docs(data): add account_session_cutoff to identity-audit (#502)
  - [`4c24771`](https://github.com/code-corhuila/multi-tour-docs/commit/4c24771) 2026-10-24 - docs(07-api): sync the hu-com-002 db spec with the built state (#505)
  - [`b5c01b9`](https://github.com/code-corhuila/multi-tour-docs/commit/b5c01b9) 2026-10-24 - docs(07-api): publish the associated establishments operations in the commercial-reservation contract (#503)
  - [`d053b7c`](https://github.com/code-corhuila/multi-tour-docs/commit/d053b7c) 2026-10-24 - docs(07-api): sync the hu-com-002 portal spec with the built state (#506)
  - [`f2b9a19`](https://github.com/code-corhuila/multi-tour-docs/commit/f2b9a19) 2026-10-24 - docs(07-api): sync the hu-com-002 api spec with the built state (#504)

- **multi-tour-front**
  - [`0887dc4`](https://github.com/code-corhuila/multi-tour-front/commit/0887dc4) 2026-10-20 - test(front): expect the operator sidebar of each role of the landing page
  - [`3ca00ee`](https://github.com/code-corhuila/multi-tour-front/commit/3ca00ee) 2026-10-20 - feat(front): add Auditoría and the role menus to the operator sidebar
  - [`3fc9578`](https://github.com/code-corhuila/multi-tour-front/commit/3fc9578) 2026-10-20 - fix(front): give the content area of the operator shell its own width
  - [`6113d8f`](https://github.com/code-corhuila/multi-tour-front/commit/6113d8f) 2026-10-20 - test(front): expect the content area of the operator shell to keep its own width
  - [`6995a75`](https://github.com/code-corhuila/multi-tour-front/commit/6995a75) 2026-10-20 - feat(front): take the operator to the identity area after the sign-in
  - [`ac5a1cf`](https://github.com/code-corhuila/multi-tour-front/commit/ac5a1cf) 2026-10-20 - test(front): expect the identity redirect only on the sign-in route and with a full session
  - [`bbdc09f`](https://github.com/code-corhuila/multi-tour-front/commit/bbdc09f) 2026-10-20 - test(front): expect an operator who signs in to land on the identity area
  - [`bf9a1fa`](https://github.com/code-corhuila/multi-tour-front/commit/bf9a1fa) 2026-10-20 - fix(front): make the operator sidebar shell as tall as the viewport
  - [`d8f538b`](https://github.com/code-corhuila/multi-tour-front/commit/d8f538b) 2026-10-20 - test(front): expect the operator sidebar shell to fill the viewport
  - [`db62f48`](https://github.com/code-corhuila/multi-tour-front/commit/db62f48) 2026-10-20 - feat(front): limit the redirect after the sign-in to the sign-in route
  - [`3cc351f`](https://github.com/code-corhuila/multi-tour-front/commit/3cc351f) 2026-10-21 - test(front): cover the shell background and always remove the injected style
  - [`698929b`](https://github.com/code-corhuila/multi-tour-front/commit/698929b) 2026-10-21 - test(front): cover the sidebar following the area the portal reports
  - [`9cc1e7e`](https://github.com/code-corhuila/multi-tour-front/commit/9cc1e7e) 2026-10-21 - test(front): expect the operator sidebar to stay fixed to the window
  - [`ba3f22d`](https://github.com/code-corhuila/multi-tour-front/commit/ba3f22d) 2026-10-21 - test(front): cover the sidebar entry of the open area from a sub-screen
  - [`d101788`](https://github.com/code-corhuila/multi-tour-front/commit/d101788) 2026-10-21 - fix(front): keep the operator sidebar fixed to the window so the sign-out does not jump
  - [`d545edc`](https://github.com/code-corhuila/multi-tour-front/commit/d545edc) 2026-10-21 - fix(front): mark in the sidebar the area the portal reports
  - [`ea42013`](https://github.com/code-corhuila/multi-tour-front/commit/ea42013) 2026-10-21 - fix(front): mount the portal again when the entry of the open area is clicked

- **sistemas-distribuidos-2026-b-g2** (Session 2 lab, published directly on main)
  - [`735b1e0`](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/735b1e0) 2026-10-22 - docs(w12): record direct publication on academic main
  - [`f92ca84`](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/f92ca84) 2026-10-22 - docs(w12): link both published delivery pull requests
  - [`2d9c1b6`](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/2d9c1b6) 2026-10-22 - docs(w12): document deployment rehearsal and published evidence
  - [`fe3075a`](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/fe3075a) 2026-10-22 - feat(w12): add deployment plan and verified rollback rehearsal
  - [`7f09b81`](https://github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2/commit/7f09b81) 2026-10-20 - feat(w12): blue-green zero-downtime deployment of front and gateway with health checks
