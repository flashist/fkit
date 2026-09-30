# Make `check` flag closed tasks with no close record, or a record that does not fit its door

## ID
0428

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

D5 layer 4 — **detection**, kept by R8. An agent that moves a folder by hand bypasses every rule; `fkit board check` is what catches it afterwards. `/fkit-status` will show it (`0451`). It is also the main evidence source for `0416` (the tripwire revisit).

## What to build

1. `check` flags a task in `done/` or `cancelled/` with no close record, and a record whose kind does not fit its door.
2. Reported in `check`'s `--json` output so `/fkit-status` can read it.

## Verification steps

1. Fixture tests: a hand-moved folder is flagged; a page close marked agent-closed, or a command close marked owner-verified, is flagged; a clean close is not.
2. `node --test test/*.test.js` green.

## Notes

- **Depends on:** [`0427`](../0427-add-the-close-record-and-the-stores-close-rules-producer-only-closes-reasons-owner-verified-only-from-the-page/brief.md). Hard.
- **Blocks:** [`0439`](../0439-run-a-copy-of-fkits-corpus-on-the-fkit-ified-board-the-phase-3-gate/brief.md), [`0451`](../0451-rewrite-fkit-status-and-dashboard-sh-over-fkit-board-json/brief.md), [`0416`](../0416-revisit-whether-fkit-needs-a-tripwire-hook-against-hand-moved-task-folders/brief.md) (its evidence source)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 3):** Tests green; a copy of fkit's corpus runs clean. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
