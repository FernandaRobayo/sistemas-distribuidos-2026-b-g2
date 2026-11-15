# CP5 / CP6 - Peer review evidence

- Review given: [PR #579, row S](https://github.com/code-corhuila/multi-tour-docs/pull/579#discussion_r4414073924).
  The historical weekly status records the conflict between account lockout and the denial-of-service row.
- Follow-up recorded in the weekly status: [PR #587](https://github.com/code-corhuila/multi-tour-docs/pull/587#issuecomment-6511760980), change 51a9d47.
- Review received, checked on 2026-11-05: [Molina211 on row D](https://github.com/code-corhuila/multi-tour-docs/pull/580#discussion_r4414101698).
  A load balancer would make the gateway count every client under one address without trusted real-IP restoration.
- Response checked in the PR: [author reply](https://github.com/code-corhuila/multi-tour-docs/pull/580#discussion_r4428247324).
  Head 920c95a includes the missing mitigation and the deployment-specific residual risk.

PR #580 was open and unmerged when checked. Creating and reviewing the analysis is complete;
team approval and merge remain external delivery work.
Any real-IP configuration must trust only the actual proxy addresses.
