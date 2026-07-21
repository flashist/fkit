# Formalize the knowledge-base folder structure, incl. `incidents/`

**Source**: `ai-agents/tasks/done/0044-formalize-knowledge-base-incidents-folder/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 9

## Goal
Give `incidents/` a documented convention before it accumulates files with an inconsistent shape — *the way `decisions/` did before ADRs got a naming convention.*

## Key Changes
`incidents/` had been **created ad hoc** during the 2026-07-10 incident to hold that write-up, with **no documented convention** for what belongs there or how future incidents should be named.

The wiki record confirmed (on consult) that **only `history/` was ever an explicitly documented knowledge-base subfolder convention.** There was **no prior convention** for `incidents/`, `runbooks/`, or ops — and an older external-review doc had actually flagged *"post-merge lifecycle (deploy, incident response, rollback, ops)"* as a known gap.

- Write `incidents/README.md`: what belongs (postmortems of **fkit's own runtime/tooling**, *not* product bugs — those are task briefs), the `YYYY-MM-DD-<slug>.md` naming, and the lifecycle (kept as historical record; new findings get a **new** dated doc, not a rewrite of the original).
- Extend `architecture.md` to describe the whole knowledge-base layout.

The brief **explicitly delegated the shape to the architect**: *"The architect decides the shape… Whatever is chosen, record the rule."*

## Outcome
Done — and it grew well past its brief, because the architect found the root itself was the actual problem. It produced [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]: **the root holds exactly two documents, and everything else is filed by kind.**

**It also caught a live error just in time.** The sibling hygiene task ([[tasks/knowledge-base-hygiene-post-omnigent]]) had **already improvised its own routing rule** in the absence of one, directing that an evaluation, a verification, the audit, the plan **and the 2026-07-10 incident itself** be swept into `history/`. **That would have emptied `incidents/` on the day it was formalized.** ADR-013 landed first and rewrote it.

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- [[tasks/knowledge-base-hygiene-post-omnigent]]
- [[systems/knowledge-base-structure]]
- [[systems/subagent-runner-connectivity]]
- [[decisions/adr-002-archive-pre-omnigent-design-docs]]
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[tasks/fix-scaffold-knowledge-base-folders]]
- [[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]]
