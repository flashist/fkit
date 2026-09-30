# Require `--by` on every board write and record an author on every write

## ID
0426

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

**Phase 3 — make it fkit's board** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **This is where the board becomes fkit's** (ADR-052 D4, D5). It builds on the faithful port from phase 2 and changes behaviour on purpose; each change has its own tests. **Zero dependencies** (ADR-014). The module boundary holds: the rest of fkit will talk to the board only through `fkit board …` and its `--json` output (D1).

D5: *"Every write takes `--by`, and the board records an author on every write"* — including sprint, rank and edit operations, which record none in aiboard today (decision document §3.3, `aiboard-lead`). This is the name the identity hook (`0447`) will check is honest.

## What to build

1. Every write command requires `--by <who>`; a write without it is refused.
2. Every write records its author — task, sprint, rank and edit operations alike.

## Verification steps

1. A test per write command: refused without `--by`; author recorded with it.
2. `node --test test/*.test.js` green.

## Notes

- **Depends on:** [`0425`](../0425-give-the-board-fkits-status-folders-and-a-free-text-blocked-reason/brief.md). Hard.
- **Blocks:** [`0427`](../0427-add-the-close-record-and-the-stores-close-rules-producer-only-closes-reasons-owner-verified-only-from-the-page/brief.md), [`0429`](../0429-keep-sprint-membership-on-the-task-only-in-sprint-n-folders-with-the-sprints-task-list-shown-not-stored/brief.md), [`0447`](../0447-add-the-identity-hook-a-fkit-board-writes-by-must-be-the-calling-agents-real-role/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 3):** Tests green; a copy of fkit's corpus runs clean. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
