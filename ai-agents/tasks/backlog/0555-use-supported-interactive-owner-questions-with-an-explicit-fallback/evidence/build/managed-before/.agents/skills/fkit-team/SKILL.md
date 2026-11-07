---
name: fkit-team
description: Show the seven fkit roles and their configured runtime collaboration.
---
# Team
State the current role, then show this canonical roster:

   | Role | Does | Must not |
   |---|---|---|
   | **lead** (the conductor) | routes you to a role; drives the work when you hand it a goal; reads the wiki | plan, code, design, review, diagnose a cause, or write the wiki |
   | **producer** | product & sprint planning, task briefs, task lifecycle | write code |
   | **coder** | implementation — sole source-write authority | commit unprompted; make product calls; settle new architecture; review its own work |
   | **architect** | architecture, design specs, ADRs, feasibility | implement features; write the wiki |
   | **reviewer** | code review — its own pass + a Codex second opinion | edit source code — ever |
   | **adversarial-reviewer** | hostile second opinion in a fresh role session, findings only | edit anything |
   | **wiki** | the wiki — ingest / lint / sync; **exclusive write gateway** | write outside `ai-agents/wiki-vault/` |


Use fkit <role> for direct sessions and the runtime consult tool for fresh peer contexts. State the current enforcement limits from the runtime binding; never infer active hooks from the runtime name. Reviewer plus adversarial-reviewer run distinct passes even when they share a model. Coordination uses ai-agents/ files; wiki writes remain wiki-only and movers producer-only.

Role procedures from the canonical ownership registry:
- lead: fkit-team, fkit-query, fkit-open-questions-interview, fkit-dumb-down, fkit-sprint-ship-loop, fkit-status (delegates to producer), fkit-wiki-sync (delegates to wiki), fkit-wiki-lint (delegates to wiki)
- producer: fkit-team, fkit-query, fkit-open-questions-interview, fkit-dumb-down, fkit-initiate-project, fkit-task-brief, fkit-task-done, fkit-task-cancelled, fkit-sprint-done, fkit-sprint-cancelled, fkit-status, fkit-heal
- coder: fkit-team, fkit-query, fkit-open-questions-interview, fkit-dumb-down, fkit-plan-task, fkit-process-review, fkit-process-stateful-review, fkit-task-ship-loop
- reviewer: fkit-team, fkit-query, fkit-open-questions-interview, fkit-dumb-down, fkit-review, fkit-stateful-review
- adversarial-reviewer: fkit-team, fkit-query, fkit-adversarial-review
- architect: fkit-team, fkit-query, fkit-open-questions-interview, fkit-dumb-down, fkit-survey-project, fkit-inspect, fkit-design-spec, fkit-evaluate-approach, fkit-record-decision
- wiki: fkit-team, fkit-query, fkit-open-questions-interview, fkit-dumb-down, fkit-wiki-ingest, fkit-wiki-lint, fkit-wiki-sync

<!-- fkit-codex-generated -->
