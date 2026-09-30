# Port aiboard's task store to Node, with cross-process locking

## ID
0418

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

The store is where status lives: a task is a folder and its status is which folder it is in (aiboard's T-008; ADR-029). This unit ports the task half of `aiboard/store.py` (872 lines in the aiboard repo) — create, move, worklog, comments, rank, dependencies, assignment, the atomic `start` claim, stale detection and `check` / `check --fix` — **faithfully**, including aiboard's own `init` and board discovery (dropped later, in `0432`, not here).

**Cross-process locking must be correct** — two agents writing at once must get unique ids and exactly one winner of a `start` race (ADR-052 D9 phase 2; *Risks* #6).

## What to build

1. Port the task store onto `0417`'s model, faithful to aiboard's format.
2. Port the matching aiboard tests first (indicative: `test_create_and_move_task`, `test_log_appends`, `test_a_move_rewrites_only_the_moved_task`, the `test_rank_*` group, `test_dependencies`, `test_start_is_an_atomic_claim`, `test_assign_refuses_to_steal_without_force`, `test_parallel_writers_get_unique_ids`, `test_parallel_start_has_exactly_one_winner`, `test_comments_and_stale_detection`, `test_check_detects_inconsistency`, `test_check_reports_a_malformed_rank`, `test_init_writes_config_and_discovery_walks_up`, `test_pointer_file_discovery`, `test_snapshot_shape`, `test_not_found`).
3. File locking that holds across **processes** (separate `node` invocations). The plan names the mechanism and what it does not guarantee.

## Verification steps

1. Each ported test seen red first, then green.
2. The two parallel tests run real concurrent processes, not simulated ones, and pass repeatedly (state how many runs).
3. `node --test test/*.test.js` green; no dependency added.
4. The plan's locking limits are written in the worklog, not left implicit.

## Notes

- **Depends on:** [`0417`](../0417-port-aiboards-model-and-front-matter-layer-to-node-in-board-tests-first/brief.md) (the model it stores). Hard.
- **Blocks:** [`0419`](../0419-port-aiboards-sprints-to-node-faithful-to-aiboards-format/brief.md), [`0420`](../0420-build-t-021s-index-once-per-read-into-the-node-store-with-its-reproduction-as-a-test/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 2):** All ported tests green; output identical to the Python reference on the corpus; T-021/T-022 tests pass. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
