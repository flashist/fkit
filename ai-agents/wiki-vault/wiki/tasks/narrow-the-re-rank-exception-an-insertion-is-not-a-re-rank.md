# Narrow `/fkit-task-brief` step 5 — a mid-board insertion is not the owner-ruled re-rank exception

**Source**: `ai-agents/tasks/done/0181-narrow-the-re-rank-exception-an-insertion-is-not-a-re-rank/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-06
**Sprint/Tag**: Sprint 3 P1 · ID `0181` · owner fkit-coder

## Goal

Follow-up 4 of task `0174`'s decision report, and the **decision-recorded** one: the ruling is already
[[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] (accepted,
owner-signed 2026-08-01) — **this task is the skill edit only** and does not re-open it. The hole:
step 5's *"the one exception — an owner-ruled re-rank"* and its absolute *"closed rows are NEVER
renumbered — not even under an owner ruling"* were read as compatible and are not, **because of
arithmetic**: an insertion renumbers every row below it, so on an interleaved board there is no
mid-board insertion point that does not renumber a closed row. **The hole had already been used** —
`0174`'s own filing renumbered eight closed rows under an explicit owner ruling, with the check run in
the wrong direction (it verified the ranks *above* the insertion point).

## Key Changes

The edit to `claude/skills/fkit-task-brief/SKILL.md` step 5 (and any scaffold counterpart):

1. **The exception narrowed in ADR-035's words** — it permits **moving an existing row within its own
   contiguous run of open rows**; it does **not** permit inserting a new row mid-board.
2. **The remedy in the same breath** — an out-of-reach merit position **appends**, with the intent
   recorded in the brief as a canonical non-numeric merit statement naming a folder ID.
3. **The corollary recorded** — the append rule is a **forced consequence** of the closed-row rule;
   anyone proposing insertions must argue the closed-row rule itself.
4. The specific act forbidden by name where a closed row sits below the insertion point — operable by
   a producer standing at the board, with ADR-035 cited as authority.

Prohibitions honored: decision not re-opened, `0174` insertion not reverted (that renumbers the same
eight a second time; the record is `0183`'s), no `:NNN` citations and **no bullet ordinals** (*"a
bullet ordinal is a line number wearing different clothes"*).

## Outcome

Ranked **P1 on Sprint 3** — top of the fresh board: it hard-gates `0182`, it is the only item of its
batch of eight whose absence had already caused a **verified** breach, and it governs the path **every
future brief filing passes through**, which is the whole reason a fresh board was worth creating.
Pulled onto Sprint 3 from the Backlog board by owner ruling 2026-08-06 (accepted as `0182`'s gate);
its old append-rank/merit-divergence notes carry a dated correction — on the fresh board `P1` is a
merit rank and no divergence exists. ⚠️ Known file collision with `0179` (same step 5); whichever
lands second rebases on the first.

## Related
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — the decision this task writes into the skill
- [[tasks/build-the-closed-rank-immutability-guard]] — task `0182`, the guard that enforces the rule this task writes down (hard-gated on this task)
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — task `0174`, the report (its follow-up 4) and the proof-case breach
- [[tasks/sprint-3-close-the-rank-integrity-loop]] — the board, and why this row is P1
- [[tasks/state-task-brief-step-5s-append-rule-in-full]] — task `0157`, the earlier step-5 rule statement this narrows further
- [[systems/fkit]]
- [[tasks/decide-whether-sprint-2-rolls-over-to-a-fresh-board]] — task `0185`, the rollover that pulled this row from the Backlog board onto Sprint 3
