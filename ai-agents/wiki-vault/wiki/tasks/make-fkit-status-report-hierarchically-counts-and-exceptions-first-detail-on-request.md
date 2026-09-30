# Make `/fkit-status` report hierarchically — counts and exceptions first, detail on request

**Source**: `ai-agents/tasks/done/0409-make-fkit-status-report-hierarchically-counts-and-exceptions-first-detail-on-request/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, landed by 2026-09-21 (commit `3027cc7`)
**Sprint/Tag**: Sprint 11 · `P1` · task `0409` · owner `fkit-coder`

## Goal
Answer the owner's second ruling of 2026-09-18 — *"fix the reporting first, then decide"* — and his own
typed complaint: *"When I ask agents in terminal about providing me the status of the sprint/tasks — it's
also kind of hard to read when there are a lot of tasks and texts."* ⭐ **It was the confound-remover for
`0405`**: a terminal UI compared against today's verbose reports would be scored partly on the UI and
partly on how much text the team emits.

**Measure first, don't design first** — `conventions/status-report-format.md` already prescribed short,
open-rows-only, detail-on-request output. The brief defined three possible findings: **(1)** the output
disobeys the convention → a cheap conformance fix; **(2)** it obeys and the convention is insufficient →
**split** at the plan gate (the convention is a producer surface); **(3)** the pain is in the content the
reports quote → report it, change nothing.

## Key Changes
- **Finding (1) — a conformance failure.** The rule-by-rule scoring (`scoring-table.md` in the task folder)
  found **exactly two rules failing, both about the Task cell** — the convention already forbade what the
  output did. So **no convention edit, no split**; the whole task stayed with the coder.
- **`title_cell()` in `claude/skills/fkit-status/dashboard.sh`** shortens the Task cell. Measured on the
  live tree, same command before and after (full captures in the task folder's `captures/`):

  | Render | Before | After |
  |---|---|---|
  | Backlog board | 458,446 bytes, 246 lines | **74,980 bytes**, 246 lines (**−83.6%**) |
  | Sprint 11 board | 10,541 bytes, 19 lines | **1,812 bytes**, 19 lines (**−82.8%**) |

- ⭐ **Drift safety proven:** `⟦FACTS⟧` and the roll-up are **byte-identical** before and after, plus a
  `0409/facts-identical` test. The six status values still render verbatim, marker and all.
- The dashboard stdout contract version was **kept at `v2`, not bumped** (owner ruling 2026-09-20).

## Outcome
- Shipped; `0405`'s comparison step was no longer confounded by it. `0410` (the same complaint, about agent
  **prose** rather than `/fkit-status`) stays open on the Backlog board.
- ⚠️ Under [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]]
  phase 5, `/fkit-status` and `dashboard.sh` are to be **rewritten over `fkit board --json`** (task
  `0451`) — this fix holds until then, and in every unconverted project.

## Related
- [[tasks/sprint-11-fkit-aiboard-convergence]] — `P1` on that board
- [[tasks/make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads]] — the web half of the same readability complaint
- [[tasks/add-status-skill-to-producer]] — the skill whose output this reshaped
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — the rewrite that will replace it
