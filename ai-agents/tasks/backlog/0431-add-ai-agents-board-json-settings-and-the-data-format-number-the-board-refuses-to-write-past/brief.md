# Add `ai-agents/board.json` — settings and the data-format number the board refuses to write past

## ID
0431

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

D4 *Settings* and D7: each project records a **data-format number** in `ai-agents/board.json`, with the board name and stale-after hours that aiboard kept in `aiboard.json`. The board **refuses any write to data in a format it was not built for** (D5 layer 1). The launch-time check that uses the same number is phase 5 (`0446`).

## What to build

1. Read settings from `ai-agents/board.json`.
2. A data-format number; every write refuses a format it was not built for (older or newer).

## Verification steps

1. Tests: a write against an older or newer format number is refused with a clear message; settings are read from `board.json`.
2. `node --test test/*.test.js` green.

## Notes

- **Depends on:** [`0424`](../0424-give-the-board-fkits-four-digit-task-ids-with-forgiving-lookups-and-a-0013-round-trip/brief.md). Hard.
- **Blocks:** [`0432`](../0432-drop-aiboards-three-redundant-features-pip-packaging-board-discovery-and-its-pointer-file-agents-md-blocks/brief.md), [`0437`](../0437-build-the-converters-trial-run-tree-the-converted-project-built-in-a-temporary-folder/brief.md), [`0446`](../0446-check-each-projects-data-format-at-launch-and-offer-the-conversion-trial-run-first/brief.md), [`0456`](../0456-give-new-projects-a-board-json-and-the-status-folders-at-setup/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 3):** Tests green; a copy of fkit's corpus runs clean. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
