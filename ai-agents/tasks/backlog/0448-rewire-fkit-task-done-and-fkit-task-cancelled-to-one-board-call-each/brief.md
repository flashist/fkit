# Rewire `/fkit-task-done` and `/fkit-task-cancelled` to one board call each

## ID
0448

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).**
> His standing rule, own words (2026-09-27): *"if we already have a brief for that task, the task
> shouldn't start, until I specifically approve it (because it might change the way fkit work in
> general)."*

**Phase 5 — wire fkit to the board** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **The largest phase** (decision document §5, §7). ⚠️ **fkit itself runs on today's rules until phase 6** (ADR-052 *Read first* item 2) — so this wiring must not break fkit's own dogfooded sessions before its conversion. How it stays safe (the previous fkit kept by `0445`, fixtures, working on a branch) is the plan's to say, and the plan must say it. Tests that touch the old layout are rewritten or retired **inside the unit that changes them**, not in a sweep at the end.

Decision document §5: the close skills keep the **judgement** (is a close warranted? which reason?) and make **one** `fkit board` call. **No more "is the owner present?" marker choice** — every command close is agent-closed (Q3). The skills stay producer-only (ADR-018, ADR-033 decisions 1–4). Today they are 460 + 422 lines of prose run step by step.

## What to build

1. Rewrite both skills in `claude/skills/` around one board call; retire the prose mechanics (moves, status cells, href repointing, marker stamping).
2. Rewrite or retire `test/mover-exemption-step*` and any other test pinned to the prose mechanics.

## Verification steps

1. A fixture close through each skill leaves `fkit board check` clean.
2. `test/skill-ownership-hook.test.js` still asserts producer-only movers.
3. The gitignored `.claude/skills/` copies refreshed and diffed against `claude/`.
4. Full suite green.

## Notes

- **Depends on:** [`0447`](../0447-add-the-identity-hook-a-fkit-board-writes-by-must-be-the-calling-agents-real-role/brief.md) and [`0427`](../0427-add-the-close-record-and-the-stores-close-rules-producer-only-closes-reasons-owner-verified-only-from-the-page/brief.md). Hard.
- **Blocks:** [`0449`](../0449-rewire-fkit-sprint-done-and-fkit-sprint-cancelled-to-sprint-close-carry-to/brief.md), [`0453`](../0453-rewire-both-ship-loops-to-start-block-and-log-through-the-board/brief.md), [`0457`](../0457-reword-fkits-rules-conventions-and-agent-prompts-for-the-board-within-the-rules-block-budget/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 5):** Full suite green on fixtures; rules block within its size budget. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
