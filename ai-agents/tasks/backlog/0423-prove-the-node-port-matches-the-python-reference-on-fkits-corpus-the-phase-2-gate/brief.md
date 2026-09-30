# Prove the Node port matches the Python reference on fkit's corpus — the phase-2 gate

## ID
0423

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

**Phase 2 — port aiboard to Node, straight into `board/`** of [ADR-052](../../../knowledge-base/decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md) (§D9). Design detail and evidence: the approved
[decision document](../../../knowledge-base/reports/2026-09-30-decision-document-merge-aiboard-into-fkit.md). ⛔ Where they differ, ADR-052 wins.

⭐ **Faithful to aiboard's format at this step.** Ids stay `T-001`, sprint folders stay `S-011`, aiboard's rules stay aiboard's. fkit's rules are phase 3, not here — mixing the two is the "three big changes at once" risk the phases exist to prevent (ADR-052 *Risks* #2). **Tests first:** port the named aiboard tests to `node:test` under `test/board/`, see them red, then write the code. **Zero dependencies** (ADR-014). The source is the aiboard repository at HEAD `0108027`, read-only — ⛔ nothing is written there.

Phase 2's gate (ADR-052 D9): *"All ported tests green; output **identical to the Python reference** on the corpus; T-021/T-022 tests pass."* The Python reference is aiboard **with T-023 fixed** (phase 1, external — see `0417`). This unit is the check that proves the port, not more port.

⚠️ **Test-count discrepancy, flagged.** ADR-052 says **62** tests are ported in phase 2. Measured in the aiboard repository at `0108027`: 46 (`test_board.py`) + 6 (`test_server.py`) + **10 (`test_mcp.py`)** = 62. But the MCP server is ported **after v1** (Q8, phase 9 — `0468`). This brief assumes the **52 non-MCP tests** are phase 2's and the 10 MCP tests travel with `0468`. ⚠️ **Producer's reading, raised to the owner — not ruled.** If he rules all 62 in phase 2, the MCP port moves forward.

## What to build

1. A harness that runs the Python reference and the Node port over the same corpus (fkit's real tasks, as phase 1 ran them) and diffs every output byte.
2. A table in the worklog mapping every aiboard test name to its ported `node:test` test (or to `0468` for MCP) — none unaccounted for.
3. Report every difference found; fix the port, never the reference.

## Verification steps

1. The harness reports **zero** differences on the corpus — paste its output.
2. The mapping table accounts for all 62 aiboard tests.
3. T-021 and T-022 tests pass; `node --test test/*.test.js` green.
4. The worklog states which corpus was used (commit and count) and that Python had T-023 fixed.

## Notes

- **Depends on:** [`0420`](../0420-build-t-021s-index-once-per-read-into-the-node-store-with-its-reproduction-as-a-test/brief.md), [`0421`](../0421-port-aiboards-command-line-to-node-including-the-terminal-kanban-view-and-json/brief.md) and [`0422`](../0422-port-aiboards-web-server-and-page-to-node-with-t-022-closed-and-concurrent-writes-kept-in-order/brief.md) (the whole port); and ADR-052 phase 1's gate (external — the Python reference). Hard.
- **Blocks:** [`0424`](../0424-give-the-board-fkits-four-digit-task-ids-with-forgiving-lookups-and-a-0013-round-trip/brief.md), [`0435`](../0435-build-the-converters-reader-every-tasks-and-sprints-facts-from-a-markdown-project-read-with-fkits-current-tools/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 2):** All ported tests green; output identical to the Python reference on the corpus; T-021/T-022 tests pass. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- Gate reached = phase 3 may be **put to** the owner. It does not start phase 3.
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
