# Add the close record and the store's close rules — producer-only closes, reasons, owner-verified only from the page

## ID
0427

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

The heart of D5 layer 1. Every close stores **who** (`--by`), **which door** (command / page / converter / later MCP — **set by the board from the door, never by the caller**), **kind**, **when** and **reason** (required for Cancelled) — D4 *Close record*.

The store refuses: a close, cancel or reopen **through the command** unless `--by` is the producer; a close with no record; a cancel with no reason. **Kind = owner-verified if and only if the door is the page** (Q3, Q15 — both ruled against the architect's recommendation, knowingly; ⛔ do not re-raise). "Owner-verified" is a **label, not proof** (R3).

This replaces the `(agent-closed — not owner-verified)` text with a field that cannot be claimed (decision document §3.2).

## What to build

1. The close record fields, written by the board.
2. The refusals above, each with a test.
3. Door is taken from how the write arrived, never from an argument.

## Verification steps

1. Tests: a non-producer `--by` close/cancel/reopen via the command is refused; a producer close via the command records kind = agent-closed; a cancel without a reason is refused; no argument can set the door or the kind.
2. `node --test test/*.test.js` green.

## Notes

- **Depends on:** [`0426`](../0426-require-by-on-every-board-write-and-record-an-author-on-every-write/brief.md). Hard.
- **Blocks:** [`0428`](../0428-make-check-flag-closed-tasks-with-no-close-record-or-a-record-that-does-not-fit-its-door/brief.md), [`0430`](../0430-add-sprint-close-carry-to-a-whole-sprint-close-in-one-call/brief.md), [`0433`](../0433-build-the-owner-door-the-page-with-a-one-time-key-stamping-every-write-as-the-page-door/brief.md), [`0437`](../0437-build-the-converters-trial-run-tree-the-converted-project-built-in-a-temporary-folder/brief.md), [`0448`](../0448-rewire-fkit-task-done-and-fkit-task-cancelled-to-one-board-call-each/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 3):** Tests green; a copy of fkit's corpus runs clean. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- The page door itself is `0433`; this unit defines the rule it will satisfy.
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
