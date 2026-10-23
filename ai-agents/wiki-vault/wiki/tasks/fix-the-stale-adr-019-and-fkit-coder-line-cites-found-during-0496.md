# Fix the stale ADR-019 and `fkit-coder.md` line cites found during `0496`

**Source**: `ai-agents/tasks/done/0516-fix-the-stale-adr-019-and-fkit-coder-line-cites-found-during-0496/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 12 · `P1` · task `0516` · owner `fkit-coder` · built 2026-10-15 at `6227119`

> ⭐ **Ingested 2026-10-23** (sync `96c7263`→`5ccf2c2`). `plan.md`, `worklog.md`, `review.md`, `plan-review.md` read as evidence; trial log `ai-agents/knowledge-base/reports/2026-10-20-plan-review-trial-0516.md`. The first task the Sprint 12 `--plan-review` run drove (owner ruling R5).

## Goal
`0496`'s own ADR-019 inserts pushed already-stale `ADR-019:NN` line cites further off. Re-point every live cite to ADR-019 and `fkit-coder.md` by **heading + quoted fragment**, not line number (the durable-citation convention).

## Key Changes
- **13 cites, one verdict each.** Fixed in three shipped prompts — `fkit-sprint-ship-loop/SKILL.md` (*Process review* row), `fkit-coder.md`, `fkit-task-ship-loop/SKILL.md` (step 6 STOP bullet) — now citing e.g. ADR-019 **§Decision item 4**, *"Every autonomous choice — every obvious winner — is recorded in the task's worklog decision-log"*, and `fkit-coder.md` **§Consulting a teammate**, *"But: a genuinely NEW architecture decision goes to the OWNER."*
- **Three ADRs fixed by append-only dated notes**, each original line left byte-identical: [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] (a new **Corrections** header bullet), [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] (fifth dated note, below §Amendment → A2), [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] (third dated note, §Decision → 2).
- **Three cites left as frozen records** in two reports (one marks itself an evidence record *"of what was weighed, not a live design"*; one quotes a row as it was).

## Outcome
- Each fixed target was checked findable by its quote; prose around the cites unchanged; ADRs append-only. `claude/fkit-claude-init.sh .` refreshed the `.claude/` copies and changed no tracked file.
- Owner's plan approval: *"Approve with X1+X2 fixes (Recommended)"*.

## Related
- [[tasks/fix-nine-stale-line-cites-and-claims-found-during-sprint-10]] — `0496`, which surfaced these
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the ADR the cites point into
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] · [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] · [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — the three ADRs given dated notes
- [[tasks/write-the-durable-citation-anchors-convention-page]] — the heading-plus-quote form used
- [[tasks/sprint-12-set-a-nine-backlog-tasks-goal-not-set]] — the board
