# Drop aiboard's three redundant features — pip packaging, board discovery and its pointer file, agents-md blocks

## ID
0432

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

R12 (selected): *"Drop as redundant — They're replaced by fkit's own install, its known board location, and its own agent instructions — not features lost."* ⛔ These three and **only** these (R11: everything else is ported). aiboard's `init` becomes fkit's own project setup and the converter — a form change (D3).

## What to build

1. Remove pip/pipx packaging traces, board discovery (walk-up) and the `aiboard.json` pointer, and the agents-md instruction block command.
2. Retire the ported tests for exactly those features (`test_init_writes_config_and_discovery_walks_up`, `test_pointer_file_discovery`, `test_install_block_is_idempotent`, `test_block_tells_agents_to_take_work_from_the_top`) — listed in the worklog, each with the R12 reason.

## Verification steps

1. The worklog lists every removed test and names its R12 item; no other feature is removed (diff-check).
2. `node --test test/*.test.js` green.

## Notes

- **Depends on:** [`0431`](../0431-add-ai-agents-board-json-settings-and-the-data-format-number-the-board-refuses-to-write-past/brief.md) (`board.json` replaces `aiboard.json`'s settings). Hard.
- **Blocks:** [`0434`](../0434-name-the-boards-command-fkit-board-throughout-its-own-surface/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 3):** Tests green; a copy of fkit's corpus runs clean. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
