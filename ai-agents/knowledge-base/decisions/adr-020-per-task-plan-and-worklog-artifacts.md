# ADR-020: Per-task `plans/` and `worklogs/` artifacts, keyed by task-id, mirroring `reviews/`

- **Status:** accepted
- **Date:** 2026-07-17
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect (fkit-producer consulted for lifecycle fit)

## Context

The autonomous ship-loop ([ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md))
runs as a long autonomous stretch after the owner approves the plan and walks away. Two problems fall
out of that:

1. **A stateless playbook loses its own memory.** A SKILL.md is prompt-injected; across many turns and
   context compaction the model can lose *which phase, which review round, and — critically — the scope
   of the plan the owner approved.* The Codex adversarial pass flagged this as a high-severity gap
   (design spec §15, finding X5): without a durable checkpoint, a resumed run could drift from what was
   approved or reset its budgets. The loop's autonomy boundary (ADR-019 Decision 4) is measured against
   *the approved plan*, so the plan must survive a resume.
2. **The owner is absent during the work and needs an audit trail at the end.** Done means *reviewed ·
   verified · complete*; the owner returns at the done-gate and must be able to confirm each — including
   **every autonomous choice the loop made while they were away.** The owner asked that the report be
   *"saved somewhere… changed/developed during active work, so when the task is done the report will
   have all the needed information."*

fkit already has the precedent for this shape: **`ai-agents/reviews/<task-id>.md`** — a git-tracked,
task-id-keyed file, written by a non-owner role, that **stays put** when the brief moves to `done/`
(`architecture.md` §6 data model). A per-task plan and a per-task worklog are structurally the same kind
of thing. This ADR records where they live and their lifecycle. Full design:
[`reports/2026-07-17-design-task-ship-loop-skill.md`](../reports/2026-07-17-design-task-ship-loop-skill.md)
§7.

## Decision

**The ship-loop persists two new git-tracked, coder-written, task-id-keyed artifacts, each in its own
top-level directory under `ai-agents/`, mirroring `reviews/`:**

| Path | Written | Contents | Lifecycle |
|---|---|---|---|
| `ai-agents/plans/<task-id>.md` | at plan approval | the approved implementation plan — the loop's autonomy boundary | retained by task-id; **not** moved by task-done; not wiki-ingested |
| `ai-agents/worklogs/<task-id>.md` | opened post-approval, grows during the run, finalized at the done-gate | worklog + owner-decision log (every important question and every "obvious winner" chosen while the owner was away) → finalized ready-for-done report | retained by task-id; **not** moved by task-done; not wiki-ingested |

1. **Two separate files, not one combined document** — the owner's explicit choice over a merged
   plan+report doc. The plan is the (largely static) approved boundary; the worklog is the evolving
   record that ends as the report.
2. **The review ledger stays a third, separate file** (`reviews/<task-id>.md`) — it has strict
   two-party (reviewer↔coder) section ownership and must not be merged into the coder-only worklog.
3. **Both are new coder write targets** — a deliberate, bounded widening of the coder's write surface
   (previously: source + the *Coder response* section of the review ledger). The coder still **never**
   writes the wiki, and these files are **not** task briefs — the owner-only move rule
   (`backlog`/`done`/`cancelled`) does not apply to them; they are records keyed by id that stay put.
4. **Git-tracked, left in the working tree; the owner commits** — never the loop (the universal hard
   rule). Consistent with the review ledger.
5. **`worklogs/` deliberately avoids the name `reports/`** — `ai-agents/knowledge-base/reports/` already
   holds dated architect/analysis artifacts; a task-id-keyed working record is a different thing, so it
   gets a distinct top-level home.
6. **Intended future direction (recorded, not built here):** collapse the brief, plan, worklog, and
   review ledger into a single **per-task folder `ai-agents/tasks/<task-id>/`** holding all of a task's
   files. Today's separate top-level dirs are a known stepping stone toward that, chosen for minimal
   change now.

## Options considered

- **Two separate top-level dirs (`plans/`, `worklogs/`), keyed by task-id, mirroring `reviews/`
  (chosen).** Matches an understood precedent; keeps the plan (autonomy boundary) and the report
  (audit trail) as durable, resumable, reviewable records; forward-compatible with the per-task folder.
- **A single combined per-task working doc** (plan + worklog + report in one file). Fewer files and the
  report would have the plan by construction — but the owner chose separation, and it reads more
  cleanly as two artifacts with different rates of change.
- **`ai-agents/tasks/plans/<task-id>.md` (nested under `tasks/`).** Rejected: `tasks/` is the one place
  with the owner-only backlog→done→cancelled *move* lifecycle; nesting a task-id-keyed record there
  invites the wrong question ("is a plan a task that gets moved?"). A top-level dir beside `reviews/`
  inherits the right semantics. (The owner agreed with this refinement.)
- **`ai-agents/reports/<task-id>.md`.** Rejected: name-collides confusingly with
  `knowledge-base/reports/`.
- **Gitignored scratch under `.fkit/tmp/`** (design rev 2). Rejected by the owner: the plan and report
  are durable records worth versioning and reviewing, not throwaway working state.
- **Per-task folder `tasks/<task-id>/` now.** Deferred: a larger restructuring of the task tree than
  this work needs; recorded as the intended direction instead (Decision 6).

## Consequences

- **Positive:**
  - The approved plan survives context compaction, so the loop's autonomy boundary is stable across a
    long run (closes X5).
  - The owner returns to a complete, durable audit trail of everything the loop did and decided while
    they were away.
  - Reuses an understood pattern (`reviews/`), so lifecycle rules (keyed by id, stays put, git-tracked,
    owner commits) are already familiar; no new mental model.
- **Negative / costs:**
  - **Two new directories** in the `ai-agents/` tree and **two new coder write targets** — a real, if
    small, widening of the data model and the coder's write surface. Recorded here so a future reviewer
    treats them as sanctioned, not as scope creep.
  - **Retention grows unbounded**: one plan + one worklog per task, kept indefinitely (like review
    ledgers). Accepted — they are cheap text and their historical value is the point.
  - A **third** per-task file (plan, worklog, review) is mild fragmentation until the per-task folder
    (Decision 6) consolidates them.
- **Residual risks / "re-raise only if":**
  - **We adopt the per-task folder layout** `ai-agents/tasks/<task-id>/` — reopen this ADR to relocate
    `plans/`, `worklogs/`, and `reviews/` into it. This is the pre-registered trigger, not a defect.
  - **`/fkit-task-done` is later found to need to touch these files** (e.g. a link repair) — that is a
    task-done implementation detail to handle, not a reason to reopen the storage decision.
  - Do **not** re-raise "the coder shouldn't be writing new file types" as a defect — the two targets
    here are sanctioned by this ADR; a finding must point to a *different* undocumented write, or a
    write into `tasks/{backlog,done,cancelled}/` or the wiki (both still forbidden).

## Related

- [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) — the ship-loop that
  writes these artifacts; the plan is its autonomy boundary, the worklog its audit trail.
- Design spec: [`reports/2026-07-17-design-task-ship-loop-skill.md`](../reports/2026-07-17-design-task-ship-loop-skill.md)
  §4.1, §7 (durability & the data model).
- Precedent: `ai-agents/reviews/<task-id>.md` (the two-party review ledger) and the `ai-agents/` data
  model in `architecture.md` §6.
- Implementation: `ai-agents/tasks/backlog/implement-task-ship-loop-skill.md` (task 53).
