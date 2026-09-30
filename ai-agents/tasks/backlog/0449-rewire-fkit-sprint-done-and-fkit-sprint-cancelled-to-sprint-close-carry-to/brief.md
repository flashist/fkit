# Rewire `/fkit-sprint-done` and `/fkit-sprint-cancelled` to `sprint close --carry-to`

## ID
0449

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

The sprint movers (456 + 476 lines) keep the judgement — is the sprint finished? where do open tasks go? — and make one `sprint close --carry-to` call (`0430`). The line-3 banner grammar retires in converted projects (ADR-040/041/047 amended at conversion).

## What to build

1. Rewrite both skills around one board call.
2. Rewrite or retire tests pinned to the banner-stamping mechanics (e.g. `closed-rank-immutability`).

## Verification steps

1. A fixture sprint close through each skill leaves `fkit board check` clean and no open task stranded.
2. `.claude/skills/` copies refreshed and diffed.
3. Full suite green.

## Notes

- **Depends on:** [`0448`](../0448-rewire-fkit-task-done-and-fkit-task-cancelled-to-one-board-call-each/brief.md) (same doctrine, landed first) and [`0430`](../0430-add-sprint-close-carry-to-a-whole-sprint-close-in-one-call/brief.md). Hard.
- **Blocks:** [`0457`](../0457-reword-fkits-rules-conventions-and-agent-prompts-for-the-board-within-the-rules-block-budget/brief.md), [`0458`](../0458-pilot-convert-fkit-itself-trial-run-owner-reads-apply-owner-commits/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 5):** Full suite green on fixtures; rules block within its size budget. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
