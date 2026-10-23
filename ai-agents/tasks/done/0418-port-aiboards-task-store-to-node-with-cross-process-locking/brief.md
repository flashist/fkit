# Port aiboard's task store to Node, with cross-process locking

## ID
0418

## Sprint
Sprint 14

## Priority
P3

## Status
✅ Done (agent-closed — not owner-verified)

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

- **Depends on:** [`0417`](../../done/0417-port-aiboards-model-and-front-matter-layer-to-node-in-board-tests-first/brief.md) (the model it stores). Hard.
- **Blocks:** [`0419`](../0419-port-aiboards-sprints-to-node-faithful-to-aiboards-format/brief.md), [`0420`](../0420-build-t-021s-index-once-per-read-into-the-node-store-with-its-reproduction-as-a-test/brief.md)
- ⛔ **Do not start without the owner's specific word (ADR-052 — each phase starts only on his word).** Being pullable on the board is not his word, and approval of another phase or of ADR-052 itself is not either.
- **Phase gate (Phase 2):** All ported tests green; output identical to the Python reference on the corpus; T-021/T-022 tests pass. A gate met means the next phase may be **put to** the owner — ⛔ not that it starts (D9).
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled` — unranked. Sprint planning is the owner's later call.
- **Filed 2026-09-30** by a spawned `fkit-producer` on the owner's approval of ADR-052 (A1, selected option text: *"Approve — Authorises the new ADR, the phase briefs (1–9) and task re-scopes. No phase or code starts without your word."*), relayed by `fkit-lead` — no owner channel (ADR-021). Decides nothing beyond the scoping; ⛔ no commit.
- ⚠️ **Dated note 2026-10-20 — pulled into [Sprint 14](../../../sprints/done/sprint-14.md) as `P2`, and checked against [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md).** By a spawned `fkit-producer` (no owner channel), on owner rulings of 2026-10-20 via `AskUserQuestion` in a `fkit lead` session — selected option text, verbatim: *"New sprint after 13 (Recommended)"*, then *"Close it, then plan AI-Board sprint (Recommended)"* (quoted in full on the Sprint 14 board). `## Sprint` and `## Priority` above are updated; the *Board and priority* bullet above is now stale and left byte-identical. The sprint is **not started**; the ⛔ *do not start without the owner's specific word* stands. Scope is **not** changed by this note.
  - **ADR-057 D2.1 — growth stop.** This brief plans new test files: the ported task-store tests, including the two real-process parallel tests (*What to build* 2). Each new test file needs the **owner's OK**, file by file, in any lane; a plan he approves counts as that OK **only for the files it names**, and an agent's plan-review APPROVE is not his OK. So this task's plan must list every test file it adds, by path, for the owner to approve.
  - ⚠️ **ADR-057 D1 — the fence: an open owner question, not ruled.** D1 lets a test cover only a **shipped** script seen from outside (the launcher / init / hooks, or a shipped skill executable), plus four named exceptions, *"no others"*. `board/` does not ship in this phase and is in neither list, so tests under `test/board/` sit **outside the fence as written**. The default `npm test` glob (`test/*.test.js`) also does not reach `test/board/`, so where they run and the 2-min budget (D10) follow from the same ruling. ⛔ Do not build tests here until the owner rules; the question is on the Sprint 14 board's *Notes for the driver*.
- ⚠️ **Dated note 2026-10-20 — owner ruling A3: start word, test-file pre-approval, port source re-pointed.** Recorded by a spawned `fkit-producer` (no owner channel), relayed verbatim by `fkit-lead`. Earlier text is not rewritten; scope is unchanged except as stated here. Owner ruling **A3**, 2026-10-20, via `AskUserQuestion` in the `fkit-lead` session — question *"Go ahead with this plan?"*, selected option text, verbatim: *"Yes, all of it (Recommended)"* (description he saw: *"Ship the view-only board to every fkit user now, and start the Node rebuild (Sprint 14)."*). The plan he approved is quoted in full on the [Sprint 14](../../../sprints/done/sprint-14.md) board (row A3); its test clause, quoted: *"The board's code gets automated tests. One test file per task, up to 6, pre-approved now, so you won't be asked about each file."*
  - **Start word (ADR-052 D9, phase 2) — given.** A3 is the owner's specific word to start phase 2, this task included. It supersedes the ⛔ *do not start without the owner's specific word* above **for this task only**. ⛔ It is **not** his word for phases 3+.
  - **Port source and Python reference re-pointed: aiboard `a1592dc`, not `0108027`.** The text above names aiboard HEAD `0108027`; that commit **still has T-023** (`0013` → `13` on write). `a1592dc` (its child, T-023 fixed — see the 2026-10-20 gate note above or the Sprint 14 board) is the source to port from and the reference to compare against. The earlier text is left byte-identical; where it says `0108027`, read `a1592dc`. Still read-only — ⛔ nothing is written in the aiboard repository.
  - **ADR-057 — ruled for this task.** D1 (the fence): the board's tests count, so tests under `test/board/` are inside the fence for this work. D2.1 (growth stop): **one** new test file under `test/board/` is pre-approved for this task — it holds this task's task-store tests, including the two parallel-process tests. The plan names its path. ⛔ **Any second new test file, or any new test file outside `test/board/`, still goes to the owner, file by file.** This supersedes the *"⛔ Do not build tests here until the owner rules"* line of the 2026-10-20 ADR-057 note above.
  - ⚠️ **Not ruled by A3:** how `test/board/` is run (the default `npm test` glob, `test/*.test.js`, does not reach it — so *Verification*'s `node --test test/*.test.js` does not run this file) and how it fits the 2-min budget (ADR-057 D10). The plan says how, and puts it to the owner if it changes `package.json`'s test scripts or the suite's time.
  - ⚠️ **Known red test at the source (reported by `aiboard-lead`, not checked by fkit):** `test_comments_and_stale_detection` fails at `a1592dc` because of hard-coded 2026-09 dates; it pre-dates T-023. A faithful port inherits a date-bound test. The plan says how it handles this (e.g. a fixed clock); no scope change is made here.
- ✅ **Dated note 2026-10-20 — rank `P2` → `P3`.** By a spawned `fkit-producer` (no owner channel): `0536` moved to `P1` on owner ruling A3 — 2026-10-20, `AskUserQuestion`, `fkit lead` session, question *"Go ahead with this plan?"*, selected *"Yes, all of it (Recommended)"* (description: *"Ship the view-only board to every fkit user now, and start the Node rebuild (Sprint 14)."*); plan text: *"1. Now, 1 small task: ship that view-only web page to every fkit user, through a new `fkit board` command. ... 2. Sprint 14, 7 tasks: rebuild aiboard inside fkit in Node ..."*. *"Now"*, and step 1 before step 2, is his ruling that `0536` runs first; every other Sprint 14 row moved down one. `## Priority` above is updated; the earlier *"as `P2`"* text is left byte-identical. Dependency order within `0417`–`0423` is unchanged. **Knock-on: none** — no `Depends on:` line changed.
  - ✅ **Correction 2026-10-20 — the *"Not ruled by A3"* line above is wrong; it was ruled, inside A3.** The architect's dated ⛔ note below [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md) §D1 records the terms (option A, D2) that A3's *"Yes"* approved: tests under `test/board/` run **inside the default `npm test`** — `0417` adds `test/board/*.test.js` to `package.json`'s `"test"` script — **within the 2-minute budget** (D10, unchanged), and the coder names any slow board test in the task's plan, before building it. So *Verification*'s `node --test test/*.test.js` is no longer the whole suite once `0417` lands; `npm test` is. Earlier lines left byte-identical.
- ✅ **Dated note 2026-10-20 — two aiboard tests carried over from `0417`, plus a forward note from `0417`'s planner.** By a spawned `fkit-producer` (no owner channel), relayed by `fkit-lead` (`fkit-sprint-ship-loop`, Sprint 14). Owner ruling, 2026-10-20, via `AskUserQuestion` in the `fkit-lead` session — question *"Approve 0417's plan (Node copy of aiboard's model, tests first)?"*, selected option text, verbatim: *"Approve, fix the docs (Recommended)"* (description he saw: *"Build as planned; also fix RELEASING.md + CONTRIBUTING.md lines; architecture.md to architect; 2 store tests move to 0418."*). Earlier text left byte-identical.
  - **Two tests added to this task's port list** (*What to build* 2): `test_hand_edited_urgent_reads_as_critical` (named in [`0417`](../../done/0417-port-aiboards-model-and-front-matter-layer-to-node-in-board-tests-first/brief.md)'s brief) and `test_critical_priority_and_urgent_alias` (aiboard `tests/test_board.py` at commit `a1592dc`). Both call `Board.create_task` / `update_task` / `get_task` — the task store — so they cannot run in `0417`. They go into this task's **one** pre-approved test file under `test/board/` — ⛔ no extra file. `0423`'s *"every aiboard test landed somewhere"* check finds them here.
  - **Coverage gap until this task lands:** nothing tests `Task.priority` turning `urgent` into `critical`; only `normalize_priority`'s alias handling is tested (`0417` test 7).
  - **Forward note from `0417`'s plan (store layer):** Python's `read_text` converts `\r\n` to `\n` on read; Node `readFileSync(…,'utf8')` does neither that nor BOM stripping. The store must copy Python's read and write behaviour, or bytes will differ.
  - **Knock-on: none** — no `Depends on:` line changed (`0418` already depends on `0417`), no task moved between boards, no status changed.
