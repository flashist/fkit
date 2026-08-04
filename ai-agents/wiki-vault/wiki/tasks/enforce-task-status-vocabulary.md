# Enforce the task status vocabulary in the source

**Source**: `ai-agents/tasks/done/0034-enforce-task-status-vocabulary/brief.md`
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
- **`Done` and `Cancelled` are skill-gated, not owner-gated.** They may only be set via `/fkit-task-done` and `/fkit-task-cancelled`, never by hand-editing — but ⚠️ **any role except `fkit-adversarial-reviewer` may invoke those skills.** [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] removed the owner-only gate, and **task 64 shipped it 2026-07-19** ([[tasks/implement-spawned-invocation-for-task-movers]]) — *this is live behaviour, not a pending decision.* ⚠️ **NO LONGER TRUE — reverted by ADR-033 on 2026-07-23; see the dated correction two bullets down.** *(The "live behaviour" self-certification above was accurate on 2026-07-19 and is not now.)*
- ⚠️ **An agent closing a task must write the agent-closed variant — and nothing makes it.** The marker is the *whole* of what replaced the old gate, and it is **prose, not enforcement**. ADR-025 removed the anti-laundering guarantee knowingly: an agent that marks its own work complete can quietly launder unfinished work into a green board, and **nothing now prevents that.** Do not read the marker as a weakened guarantee — read the ADR's honesty clause.
- ⚠️ **Corrected 2026-07-29 — the two bullets above were true on 2026-07-19 and are not true now.** [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] (2026-07-23) reversed ADR-025 Decisions 1–2: **only `fkit-producer` may invoke `/fkit-task-done` and `/fkit-task-cancelled`**, and the [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] `PreToolUse` hook **denies** a mover call from any non-producer identity **at any spawn depth** — so this rule is structural, where ADR-025's was prose. Every other role routes its closes through the producer. *"Skill-gated, not owner-gated"* still describes the mechanism, but the set of roles that may invoke is now **one**. **Unchanged by ADR-033:** the agent-closed marker rule itself, its invisibility in `/fkit-status` (bullet below), and the fact that a **spawned** producer is still not an owner-verified close. Landed by [[tasks/revert-task-movers-to-producer-only]].
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
- [[tasks/add-owner-field-to-brief-schema-and-task-brief-skill]] — Add a structured `## Owner` field to the brief schema and the task-brief skill
- [[tasks/revert-task-movers-to-producer-only]] — Revert the task movers to producer-only — ownership, mirrors, hook test, and mover prose
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — ⚠️ **the gating rule above is reversed**: `Done`/`Cancelled` are `fkit-producer`-only again, hook-enforced at any spawn depth
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook that makes producer-only structural rather than prose
- [[tasks/specify-and-support-the-reverse-move-sprint-to-backlog]] — `0210`, which added the **Moved (to backlog)** row — `➡️ Moved to [Backlog](backlog.md)`, no `— priority M` suffix
