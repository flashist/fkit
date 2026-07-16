# Repair the broken task links in the closed Sprint 1 plan

**Source**: `ai-agents/tasks/done/repair-broken-links-in-closed-sprint-plans.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 21

## Goal
`ai-agents/sprints/done/sprint-1.md` carried **6 broken relative links** (5 distinct tasks). Every one is a `➡️ Moved to Sprint 2` row whose href still pointed at `tasks/backlog/…` for a task since completed into `tasks/done/`.

## Key Changes
- **Re-pointed the 6 hrefs**, `backlog/` → `done/`.
- **Changed the href only — not the row's status cell or its prose.** `➡️ Moved to Sprint 2 — priority N` is **historically true and stays exactly as written**: it records what happened to the task in Sprint 1, not where the file lives now. **This fixes a link that 404s, not a status.**
- **Verified — did not fix — one likely false positive.** A repo-root-relative link inside a **blockquote quoting template text** looks broken to a checker but is **correct as template content**. *"Expected outcome: no-op… 'fixing' it would corrupt the template text the task was about."* Confirmed as quoted content and left alone.

## Outcome
**Done.** Found by a hand-rolled repo-wide link sweep during the knowledge-base hygiene task — **pre-existing and out of that task's scope**; the coder **correctly did not fix it and escalated.**

**The 6 links are the symptom; the recurrence is the bug.** Split from [[tasks/harden-task-movers-against-closed-sprint-link-rot]] **on purpose**, per the owner's independent-shippability rule: this one is uncontroversial and shippable today; the process fix was **blocked on an owner ruling**. **"Landing only 21 buys nothing durable" — the links rot again on the next carried-over completion.**

**The owner ruled (2026-07-15): re-point the href, never the prose** — ratifying what task 22 had already implemented.

**It also raised a question that got answered No:** *"should fkit own a mechanical link checker at all?"* The repo had **no test suite and no link check** — this defect was found only because the coder hand-rolled a sweep. **Owner ruling: NO. Not pursued, no task.**

## Related
- [[tasks/harden-task-movers-against-closed-sprint-link-rot]] — the recurrence; the real bug
- [[tasks/knowledge-base-hygiene-post-omnigent]] — the sweep that found it
- [[tasks/add-e2e-smoke-script-for-fkit-itself]] — the nominated home for the rejected link checker
- [[tasks/sprint-1-ship-the-onboarding-sequence]] — the closed plan repaired
- [[systems/knowledge-base-structure]]
- [[tasks/sprint-2-remove-omnigent]]
