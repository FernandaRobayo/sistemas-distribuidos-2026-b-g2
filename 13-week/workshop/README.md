# Week 13 Workshop - Threat Modeling and the Security Backlog

<!-- CONFIG-START -->
- FULL_NAME: Maria Fernanda Robayo Laguna
- GITHUB_USER: FernandaRobayo
- TEAM: ErrorCapa8
- DOCS_REPO: https://github.com/code-corhuila/multi-tour-docs
- BOUNDARY: api-gateway to commercial-reservation-api (inbound)
- CLAIM_ISSUE: https://github.com/code-corhuila/multi-tour-docs/issues/577
- REFLECTION_DOC: https://docs.google.com/document/d/1MoVQsGjm6SejsjRUww2WwLEKMmAEOHWhmmtKcYzFWOw/edit?usp=sharing
- LIBRARY_BOOK: Costas Santos, Jesus. Seguridad informatica. 1st ed. Bogota: Ediciones de la U, 2011. Call number 005.8 C838s Ej.1 (CORHUILA library, Prado Alto)
- LIBRARY_RECORD_TIME: 2026-10-29 08:20 (registered in the library system)
- STORIES: https://github.com/code-corhuila/multi-tour-docs/issues/581 https://github.com/code-corhuila/multi-tour-docs/issues/582 https://github.com/code-corhuila/multi-tour-docs/issues/583
- RELATED: https://github.com/code-corhuila/multi-tour-docs/issues/583 is related to https://github.com/code-corhuila/multi-tour-docs/issues/584 (same tenant isolation rule, catalog and memberships)
<!-- CONFIG-END -->

## Checkpoint index

| Checkpoint | File | Status |
|---|---|---|
| CP0 Setup and boundary claim | README.md | done |
| CP1 Attack surface map | 01-attack-surface.md | done |
| CP2 STRIDE Pull Request | [local snapshot](02-stride.md), [team PR #580](https://github.com/code-corhuila/multi-tour-docs/pull/580) | analysis submitted; PR open |
| CP3 Security backlog | [stories and role matrix](03-security-backlog.md), team issues #581, #582, #583 | stories refined; implementation open |
| CP4 Security gates and negative test | 04-security-ci/ | done |
| CP5 Peer review and close | [peer evidence](05-peer-review.md), ../hu-status/README.md | review delivered |
| CP6 Address peer feedback | [STRIDE row D](02-stride.md), [reply](05-peer-review.md) | applied in 920c95a |
| CP7 Refine security stories | [security backlog](03-security-backlog.md) | refinement delivered |
| CP8 Run negative test | [run guide](04-security-ci/HOW-TO-RUN.md) | local fixture verified; real integration pending |

## Review and execution

See [REVIEW.md](REVIEW.md) for corrections, checks run on 2026-11-05 and remaining delivery work.
The minimal module is a local exercise; its decoded token is not a verified identity.
