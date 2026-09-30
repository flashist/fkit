# Rewrite `/fkit-status` and `dashboard.sh` over `fkit board --json`

## ID
0451

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

`fkit-status` (537 lines) + `dashboard.sh` (1,773 lines of bash) are rewritten over `fkit board … --json`; most drift checks disappear because status has one place (decision document §5). **Close-record detection (`0428`) is shown** (D5 layer 4). The hierarchical shape the owner ruled for `0409` — counts and exceptions first — is kept.

⚠️ **Size L** — if the plan finds it is not one reviewable unit, it says so and the producer splits it.

## What to build

1. Status briefing and task dashboard read the board's JSON.
2. Detection findings surfaced as exceptions.
3. Rewrite or retire `test/dashboard-contract*` and `test/prove-red.sh` cases pinned to the old parser.

## Verification steps

1. A fixture project with a hand-moved closed task shows it as an exception.
2. Output shape matches the `0409` hierarchy (counts first).
3. Full suite green.

## Notes

- **Depends on:** [`0444`](../0444-route-fkit-board-straight-from-the-launcher-to-the-board-module/brief.md) and [`0428`](../0428-make-check-flag-closed-tasks-with-no-close-record-or-a-record-that-does-not-fit-its-door/brief.md). Hard.
- **Blocks:** [`0452`](../0452-rewrite-the-throughput-counter-over-the-board/brief.md), [`0453`](../0453-rewire-both-ship-loops-to-start-block-and-log-through-the-board/brief.md), [`0416`](../0416-revisit-whether-fkit-needs-a-tripwire-hook-against-hand-moved-task-folders/brief.md) (its evidence surface)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 5):** Full suite green on fixtures; rules block within its size budget. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
