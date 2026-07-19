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

**The closed set:** `Backlog` · `In progress` · `Blocked` · `Done` · `Cancelled` · `Moved` — **plus, since 2026-07-19, the two agent-closed variants** of the last two: `✅ Done (agent-closed — not owner-verified)` and `⛔ Cancelled (agent-closed — not owner-verified) (YYYY-MM-DD) — <reason>`.

- **`Blocked` and `Cancelled` require a mandatory reason.**
- **`Done` and `Cancelled` are skill-gated, not owner-gated.** They may only be set via `/fkit-task-done` and `/fkit-task-cancelled`, never by hand-editing — but ⚠️ **any role except `fkit-adversarial-reviewer` may invoke those skills.** [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] removed the owner-only gate, and **task 64 shipped it 2026-07-19** ([[tasks/implement-spawned-invocation-for-task-movers]]) — *this is live behaviour, not a pending decision.*
- ⚠️ **An agent closing a task must write the agent-closed variant — and nothing makes it.** The marker is the *whole* of what replaced the old gate, and it is **prose, not enforcement**. ADR-025 removed the anti-laundering guarantee knowingly: an agent that marks its own work complete can quietly launder unfinished work into a green board, and **nothing now prevents that.** Do not read the marker as a weakened guarantee — read the ADR's honesty clause.
- ⚠️ **The marker does not appear in `/fkit-status`.** `dashboard.sh` matches the marker prefix, so an agent-closed row is counted and filtered as an ordinary `✅ Done`. To tell an agent-closed task from an owner-closed one **you must open the sprint plan or the brief.** Recorded, accepted, and **not a defect to file** (ADR-025 amendment A3).
- **No other value is valid** — not "Not started", not "WIP", not "Todo", not "Complete". *If a status you need isn't there, amend the convention — don't invent a value inline.*

## Outcome
Done. `conventions/task-status-vocabulary.md` is the canonical set, and the source enforces it.

**A vocabulary gap is not cosmetic: a missing status is a state the project cannot represent, and a project that cannot say "in progress" will invent something that sounds like it.**

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/add-status-skill-to-producer]]
- [[tasks/repair-knowledge-base-paths-in-product-source]]
- [[systems/knowledge-base-structure]]
- [[tasks/stop-agents-asserting-unchecked-repo-state]]
- [[tasks/implement-spawned-invocation-for-task-movers]] — task 64, which added the two agent-closed variants and made the movers skill-gated rather than owner-gated
