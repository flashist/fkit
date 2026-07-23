# Wiki flag-don't-close convention — the three wiki SKILLs end by flagging "task N ready to close"

## ID
0125

## Sprint
Sprint 2

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

The operative fix for task 0108 (the wiki-stuck-marker investigation), as ruled by the owner and
recorded in
[ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
§2 and the report's §7 "Post-ruling"
([`2026-07-23-eval-wiki-task-completion-visible-to-the-board.md`](../../../knowledge-base/reports/2026-07-23-eval-wiki-task-completion-visible-to-the-board.md)).

The wiki stays **wiki-only**: it writes only `wiki-vault/` (ADR-005) and — after task 0124 — no longer
owns the movers, so it **closes nothing**. Instead its procedures must **flag** completion: end the
report with an explicit *"task N ready to close"* line for each tracked task whose deliverable is the
vault work just finished. The producer then runs `/fkit-task-done`. This is Approach 2's mechanism with
the producer as closer — the operative resolution of 0108 (task 80 sat `🔄 In progress` on the board for
~a week because the wiki never surfaced completion anywhere a board-driven view could see it).

**Ownership note:** these are wiki **SKILL source** files under `claude/skills/`, not the vault. Per the
task 0081 Part C ruling, *"the wiki's exclusivity is over the vault, not over its own skill source"* — so
`fkit-coder` edits them (ADR-033 report §8 also scopes this as coder work).

## What to build

Edit the three wiki SKILLs — `claude/skills/fkit-wiki-ingest/SKILL.md`,
`claude/skills/fkit-wiki-sync/SKILL.md`, `claude/skills/fkit-wiki-lint/SKILL.md` — so each ends its final
report by **flagging** every tracked task it completed:

- When an operation **completes a tracked task whose deliverable is this vault work**, end the report
  with an explicit, uniform line — *"Task N's vault work is complete — ready to close (producer runs
  `/fkit-task-done`)"* — for each such task.
- The wiki **closes nothing and moves no task file.** It never invokes a mover (it no longer owns one).
- Add the one-line rule for the ambiguous case: when the vault work is only *part* of a larger task, or
  completeness is uncertain, still flag "partial — not ready to close," never close.

These SKILLs are `claude/`-only (not scaffold-dual-homed), so no ADR-027 parity concern; the `.claude/`
copies refresh on launch (report §8 dual-home note).

## Verification steps

1. All three wiki SKILLs end their report with a uniform "task N ready to close" flag for each completed
   tracked task, and contain the "deliverable *is* this vault work?" rule.
2. None of the three SKILLs invokes `/fkit-task-done` or any mover, and none moves a task file.
3. The flag routes the close to the **producer**, consistent with ADR-033 (producer-only movers).
4. No source-code change beyond the three SKILL texts.

## Notes

- **Owner:** fkit-coder.
- **Depends on: nothing.** (The flag is additive and shippable independently.)
- **Recommend landing together with 0124** — once 0124 removes the movers from `wiki`, this flag is the
  wiki's only completion signal; landing them together avoids re-opening the 0108 gap in the interval.
- **Implements the operative outcome of task 0108** (ADR-033 §2 / report §7 Post-ruling).
- No commit — leave the edit in the working tree.
