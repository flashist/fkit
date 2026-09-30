# Add `sprint close --carry-to`, a whole sprint close in one call

## ID
0430

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

Today a sprint close is a 456-line prose procedure (`claude/skills/fkit-sprint-done/SKILL.md`). `sprint close --carry-to <sprint|backlog>` does it in **one call under one lock**, moving every still-open task to the named destination (D5; *Risks* #12). The store refuses a sprint close that would strand open tasks. The page's sprint close asks for the same destination (Q4: *"Only by choosing where they go"*) — that is `0433`.

## What to build

1. `sprint close --carry-to` for Done and Cancelled sprint closes, producer-only via the command, with a close record.
2. Refuse a close that would leave open tasks attached to a closed sprint.

## Verification steps

1. Tests: open tasks land in the destination; a close without a destination while tasks are open is refused; a non-producer `--by` is refused.
2. `node --test test/*.test.js` green.

## Notes

- **Depends on:** [`0427`](../0427-add-the-close-record-and-the-stores-close-rules-producer-only-closes-reasons-owner-verified-only-from-the-page/brief.md) and [`0429`](../0429-keep-sprint-membership-on-the-task-only-in-sprint-n-folders-with-the-sprints-task-list-shown-not-stored/brief.md). Hard.
- **Blocks:** [`0433`](../0433-build-the-owner-door-the-page-with-a-one-time-key-stamping-every-write-as-the-page-door/brief.md), [`0439`](../0439-run-a-copy-of-fkits-corpus-on-the-fkit-ified-board-the-phase-3-gate/brief.md), [`0449`](../0449-rewire-fkit-sprint-done-and-fkit-sprint-cancelled-to-sprint-close-carry-to/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 3):** Tests green; a copy of fkit's corpus runs clean. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
