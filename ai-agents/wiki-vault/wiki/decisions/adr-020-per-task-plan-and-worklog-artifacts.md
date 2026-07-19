# ADR-020: Per-task `plans/` and `worklogs/` artifacts, keyed by task-id, mirroring `reviews/`

**Date**: 2026-07-17
**Status**: accepted

## Context
The autonomous ship-loop ([[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]]) runs a long autonomous stretch after the owner approves the plan and walks away. Two problems fall out of that:

1. **A stateless playbook loses its own memory.** A `SKILL.md` is prompt-injected; across many turns and context compaction the model can lose *which phase, which review round, and — critically — the scope of the plan the owner approved*. The Codex adversarial pass flagged this (finding X5): the loop's autonomy boundary is measured against *the approved plan*, so the plan must survive a resume.
2. **The owner is absent during the work and needs an audit trail at the end.** Done means *reviewed · verified · complete*; the owner returns at the done-gate and must be able to confirm each — including **every autonomous choice the loop made while they were away.**

fkit already has the precedent: `ai-agents/reviews/<task-id>.md` — a git-tracked, task-id-keyed file, written by a non-owner role, that **stays put** when the brief moves to `done/`. A per-task plan and worklog are structurally the same kind of thing.

## Decision
**The ship-loop persists two new git-tracked, coder-written, task-id-keyed artifacts, each in its own top-level directory under `ai-agents/`, mirroring `reviews/`:**

| Path | Written | Contents | Lifecycle |
|---|---|---|---|
| `ai-agents/plans/<task-id>.md` | at plan approval | the approved implementation plan — the loop's **autonomy boundary** | retained by id; **not** moved by task-done; **not** wiki-ingested |
| `ai-agents/worklogs/<task-id>.md` | opened post-approval, grows during the run, finalized at the done-gate | worklog + owner-decision log (every important question and every "obvious winner" chosen while the owner was away) → finalized ready-for-done report | retained by id; **not** moved by task-done; **not** wiki-ingested |

- **Two separate files, not one combined document** — the owner's explicit choice. The plan is the (largely static) approved boundary; the worklog is the evolving record that ends as the report.
- **The review ledger stays a third, separate file** (`reviews/<task-id>.md`) — strict two-party (reviewer↔coder) section ownership; must not be merged into the coder-only worklog.
- **Both are new coder write targets** — a deliberate, bounded widening of the coder's write surface (previously: source + the *Coder response* section of the review ledger). The coder still **never** writes the wiki, and these files are **not** task briefs — the owner-only backlog/done/cancelled move rule does not apply to them.
- **Git-tracked, left in the working tree; the owner commits** — never the loop.
- **`worklogs/` deliberately avoids the name `reports/`** — `knowledge-base/reports/` already holds dated architect/analysis artifacts; a task-id-keyed working record is a different thing.
- **Intended future direction (recorded, not built here):** collapse the brief, plan, worklog, and review ledger into a single **per-task folder `ai-agents/tasks/<task-id>/`**. Today's separate top-level dirs are a known stepping stone.

## Consequences
- **Positive:** the approved plan survives compaction, so the autonomy boundary is stable across a long run (closes X5); the owner returns to a complete, durable audit trail; reuses an understood pattern (`reviews/`), so no new mental model.
- **Negative / costs:** two new directories in the `ai-agents/` tree and two new coder write targets — a real, if small, widening of the data model; **retention grows unbounded** (one plan + one worklog per task, kept indefinitely, like review ledgers — accepted, cheap text with historical value); a **third** per-task file is mild fragmentation until the per-task folder consolidates them.
- **Re-raise only if:** the per-task folder layout is adopted (reopen to relocate `plans/`, `worklogs/`, `reviews/` into it — the pre-registered trigger, not a defect). Do **not** re-raise "the coder shouldn't be writing new file types" — these two targets are sanctioned; a finding must point to a *different* undocumented write, or a write into `tasks/{backlog,done,cancelled}/` or the wiki (both still forbidden).

## Related
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the ship-loop that writes these artifacts; the plan is its autonomy boundary, the worklog its audit trail
- [[systems/fkit]] — the `ai-agents/` data model these extend
- [[tasks/design-task-ship-loop-skill]] — the design (§4.1, §7) that produced this ADR
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/implement-task-ship-loop-skill]] — the loop that writes these artifacts, now live
- [[tasks/design-spawned-invocation-consent-model-for-task-movers]] — task 63 evaluated the worklog as a candidate precondition and found it **forgeable by the writer**
