# Port aiboard's command line to Node, including the terminal kanban view and `--json`

## ID
0421

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

aiboard's CLI (`aiboard/cli.py`, 573 lines in the aiboard repo) is how agents and scripts use the board (R6: *"CLI for everything"*). Ported faithfully here, including its **terminal kanban view** (the `board` command), `info`, list filters, `--json` on every read, JSON errors — and, faithfully for now, its `init` and agents-md instruction block (both dropped in `0432`).

⭐ The terminal kanban view is the one `0405` (terminal-UI investigation) is re-scoped over.

## What to build

1. Port every aiboard command, faithful to aiboard's names and output at this step.
2. Port the matching aiboard tests first (indicative: `test_full_flow`, `test_argparse_errors_are_json`, `test_critical_priority_via_cli`, `test_task_rank_via_cli`, `test_board_truncates_with_ellipsis`, `test_install_block_is_idempotent`, `test_block_tells_agents_to_take_work_from_the_top`).

## Verification steps

1. Each ported test seen red first, then green.
2. `--json` output of every read command parses as JSON (a test, not a claim).
3. `node --test test/*.test.js` green.

## Notes

- **Depends on:** [`0419`](../0419-port-aiboards-sprints-to-node-faithful-to-aiboards-format/brief.md) (the CLI drives tasks and sprints). Hard.
- **Blocks:** [`0423`](../0423-prove-the-node-port-matches-the-python-reference-on-fkits-corpus-the-phase-2-gate/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 2):** All ported tests green; output identical to the Python reference on the corpus; T-021/T-022 tests pass. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
