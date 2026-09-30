# Add the identity hook — a `fkit board` write's `--by` must be the calling agent's real role

## ID
0447

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

D5 layer 2: a `PreToolUse` hook on the terminal tool — for `fkit board` writes, `--by` must equal the calling agent's **real** role (visible at any spawn depth, ADR-018 §4); a `fkit board` command in a form it cannot read (`sh -c`, `eval`, variables) is **refused**; `fkit board serve` is **refused for agents**. It checks only "is the name honest?" — the store rules (`0427`) do the rest.

ADR-050's B-2 rejection (matching shell text) is overtaken **only** for this `--by` check (ADR-052 *Effect on existing ADRs*). ⛔ It does not widen or replace the skill lock (ADR-018, layer 3).

## What to build

1. The hook, wired in `build_settings()` beside the skill-ownership hook.
2. Role identity taken the same way the skill-ownership hook takes it — never from the command text.

## Verification steps

1. Tests: honest `--by` passes; a mismatched `--by` is denied; `sh -c` / `eval` / variable forms are denied; `fkit board serve` from an agent is denied.
2. `test/skill-ownership-hook.test.js` unchanged and green.
3. Full suite green.

## Notes

- **Depends on:** [`0444`](../0444-route-fkit-board-straight-from-the-launcher-to-the-board-module/brief.md) and [`0426`](../0426-require-by-on-every-board-write-and-record-an-author-on-every-write/brief.md). Hard.
- **Blocks:** [`0448`](../0448-rewire-fkit-task-done-and-fkit-task-cancelled-to-one-board-call-each/brief.md), [`0458`](../0458-pilot-convert-fkit-itself-trial-run-owner-reads-apply-owner-commits/brief.md), [`0469`](../0469-extend-the-identity-hook-to-mcp-calls-a-per-call-author-checked-against-the-real-role/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 5):** Full suite green on fixtures; rules block within its size budget. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
