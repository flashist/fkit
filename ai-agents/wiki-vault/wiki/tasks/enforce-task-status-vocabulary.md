# Enforce the task status vocabulary in the source

**Source**: `ai-agents/tasks/done/enforce-task-status-vocabulary.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 15

## Goal
Define a **closed** task-status vocabulary and make the shipped skills obey it.

## Key Changes
Until 2026-07-11 the project had **no defined task-status vocabulary** — it was convention-by-accident:

- `✅ Done` and `⛔ Cancelled` were the only values specified anywhere, and only *inside the two mover skills*.
- `🔲 Backlog` was **never defined**; it was simply what everyone typed.
- `➡️ Moved` was introduced **ad hoc** during Sprint 2 planning and written into a sprint plan without being recorded anywhere.
- **There was no `In progress` and no `Blocked` at all** — meaning **there was literally no way to record that a session had picked a task up, or that it was stuck.**

**That last gap produced a concrete failure the same day** — a fabricated-looking status report (see [[tasks/add-status-skill-to-producer]]).

**The closed set:** `Backlog` · `In progress` · `Blocked` · `Done` · `Cancelled` · `Moved`.

- **`Blocked` and `Cancelled` require a mandatory reason.**
- **`Done` and `Cancelled` are owner-only**, set via `/fkit-task-done` and `/fkit-task-cancelled`.
- **No other value is valid** — not "Not started", not "WIP", not "Todo", not "Complete". *If a status you need isn't there, amend the convention — don't invent a value inline.*

## Outcome
Done. `conventions/task-status-vocabulary.md` is the canonical set, and the source enforces it.

**A vocabulary gap is not cosmetic: a missing status is a state the project cannot represent, and a project that cannot say "in progress" will invent something that sounds like it.**

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/add-status-skill-to-producer]]
- [[tasks/repair-knowledge-base-paths-in-product-source]]
- [[systems/knowledge-base-structure]]
