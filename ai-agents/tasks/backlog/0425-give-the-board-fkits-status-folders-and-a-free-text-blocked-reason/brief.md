# Give the board fkit's status folders and a free-text blocked reason

## ID
0425

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

D4: status = which folder the task is in — `backlog/`, `in-progress/`, `done/`, `cancelled/` (`in-progress/` is new for fkit — ADR-029 is amended at conversion). **Blocked** keeps aiboard's `blocked_by` (enforced at start, cycles reported) **and** gains fkit's free-text `blocked_reason`, because fkit's `🚧 Blocked — <reason>` needs the reason. `➡️ Moved` has no equivalent — a sprint is a field on the task (decision document §3.2).

## What to build

1. Map the store's statuses onto fkit's four folders.
2. Add `blocked_reason` beside `blocked_by`; `start` still refuses a blocked task.

## Verification steps

1. Tests: each status lands in its folder; a blocked task carries its reason in `--json`; starting a blocked task is refused; a cycle is reported.
2. `node --test test/*.test.js` green.

## Notes

- **Depends on:** [`0424`](../0424-give-the-board-fkits-four-digit-task-ids-with-forgiving-lookups-and-a-0013-round-trip/brief.md). Hard.
- **Blocks:** [`0426`](../0426-require-by-on-every-board-write-and-record-an-author-on-every-write/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 3):** Tests green; a copy of fkit's corpus runs clean. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
