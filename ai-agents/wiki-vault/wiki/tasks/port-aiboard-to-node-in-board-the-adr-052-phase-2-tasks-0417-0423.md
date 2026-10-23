# Port aiboard to Node in `board/` — the ADR-052 phase 2 tasks (`0417`–`0423`)

**Source**: `ai-agents/tasks/done/0417-port-aiboards-model-and-front-matter-layer-to-node-in-board-tests-first/brief.md`, `ai-agents/tasks/done/0418-port-aiboards-task-store-to-node-with-cross-process-locking/brief.md`, `ai-agents/tasks/done/0419-port-aiboards-sprints-to-node-faithful-to-aiboards-format/brief.md`, `ai-agents/tasks/done/0420-build-t-021s-index-once-per-read-into-the-node-store-with-its-reproduction-as-a-test/brief.md`, `ai-agents/tasks/done/0421-port-aiboards-command-line-to-node-including-the-terminal-kanban-view-and-json/brief.md`, `ai-agents/tasks/done/0422-port-aiboards-web-server-and-page-to-node-with-t-022-closed-and-concurrent-writes-kept-in-order/brief.md`, `ai-agents/tasks/done/0423-prove-the-node-port-matches-the-python-reference-on-fkits-corpus-the-phase-2-gate/brief.md`
**Status**: done — all seven `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 14 · `P2`–`P8` (dependency order, not an owner choice) · owner `fkit-coder` · built 2026-10-20 → 2026-10-23

> ⭐ **Ingested 2026-10-23** (sync `96c7263`→`5ccf2c2`). **One page for seven briefs**, because they are one phase with one gate (`0423`) and one shared method. Each task's `plan.md`, `worklog.md` and `review.md` were read as evidence, not ingested. ⚠️ `board/` was **untracked** when the worklogs were written (they name files by hash); this page does not assert its commit state.

## Goal
[[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] D9 **phase 2**: port aiboard to Node **straight into `board/`**, **faithful to aiboard's format** (ids stay `T-001`, sprints `S-011`; fkit's rules are phase 3), **tests first**, **zero dependencies**, aiboard read-only. Gate: *"All ported tests green; output identical to the Python reference on the corpus; T-021/T-022 tests pass."* The owner calls this "AI-Board phase 1" — the first phase fkit builds; ADR-052's phase 1 is the external T-023 fix.

**Preconditions, both met 2026-10-20:** ADR-052 phase 1's gate — aiboard commit `a1592dc` fixes T-023 (`0013` silently becoming `13`), checked by `fkit-lead`; so **port source and Python reference = `a1592dc`, not `0108027`** (the briefs' text, corrected by dated notes). Owner ruling **A3** is the start word for phase 2 only and pre-approves **one test file under `test/board/` per task `0417`–`0422`** ([[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]] dated notes); those tests run **inside `npm test`**.

## Key Changes
| Task | What landed (from its worklog) |
|---|---|
| `0417` model + front matter | `board/core/model.mjs`, `board/core/python-compat.mjs`; `test/board/model.test.js` (11 tests); `package.json` `"test"` → `node --test test/*.test.js test/board/*.test.js`; `CONTRIBUTING.md` / `RELEASING.md` name the new glob. Red run seen first. |
| `0418` task store + locking | `board/core/store.mjs`, `board/core/lock.mjs`; `test/board/store.test.js` (31 tests). Lock = an `O_EXCL` owner file `.aiboard.lock.owner`, dead-holder detection, back-off with no timeout. ⚠️ The worklog lists **15 things it does not guarantee** — readers take no lock; writes are not crash-atomic; no exclusion against Python aiboard on the same board; network filesystems; PID-namespace and hostname-change cases where a writer waits forever or two write at once; one `Board` per root per process. One intended difference from Python's `check()`: two problems for ranks a JS number cannot hold exactly (owner ruling R5). |
| `0419` sprints | `moveSprint`, `sprintAdd`, `sprintRemove`; `test/board/sprints.test.js` (6 tests). aiboard's stored `tasks:` list kept for now — dropping it is phase 3 (`0429`). |
| `0420` T-021 index | `snapshot()` reads each task once. T-021 was never fixed in aiboard, so its brief's method was ported as test A; benchmark opt-in (`FKIT_BOARD_BENCH=1`). **At 540 tasks: 466.5 ms → 75.9 ms, 6.1×** (one busy machine); machine-independent counts: scans n+3 → 3, loads 2n → n. |
| `0421` CLI | `board/cli/argparse.mjs` (an argparse 3.9.6 subset), `cli.mjs`, `main.mjs`, `board/core/instructions.mjs`; `test/board/cli.test.js` (12 tests) incl. the kanban view counting characters as Python does. `serve`/`mcp` parse but print *"not ported"* until `0422` / `0468`. |
| `0422` server + page | `board/server/server.mjs` with the **T-022** checks (`refuseCrossSite`); `board/web/index.html` (byte copy, `cmp`-identical to `0536`'s `vendor/aiboard/index.html`); `pyJsonLoads` rewritten as a port of CPython 3.9's JSON scanner; `test/board/server.test.js` (18 tests). The original T-022 attack (a cross-site `text/plain` POST that flipped a task to done) was **accepted by a naive port and is refused** by the built one. Owner ruling A: a one-line `normalizeId` guard in `model.mjs`; ruling B: a macOS loopback-connect stall under many back-to-back runs **kept and noted** (single-run risk *"low, not zero"*). |
| `0423` the gate | A **throwaway** harness (owner Q1, *"scripts throwaway"*; not kept, not in git) ran Python `a1592dc` and the Node port over fkit's real corpus (538 files / 2,870 fields, plus a live-tree second corpus). |

## Outcome
- **Gate: PASS** (2026-10-23). **0 differences** between Node and Python on every corpus part, both corpora; self-runs 0; mutants 2 (T-023 dump guard, 402 diffs) and 3 (`check()` order) fire. **Mutant 1 (UTF-16 counting) cannot fire on fkit's corpus** — the only emoji in a title sits past the kanban's 25-character cut — and was ruled met **by note** (owner, *"Pass, with a note (Recommended)"*): caught instead by `0421`'s harness and `test/board/cli.test.js`. Test mapping **64/64**: 54 aiboard tests ported and passing by name, **10 MCP tests → `0468`** (owner ruling 2026-09-30), 0 missing; `test/board/` = 88 tests in 6 files.
- ⛔ **A met gate means phase 3 may be *put to* the owner — it starts nothing** (ADR-052 D9). `0424` and `0435` (phases 3 / 4) wait on `0423` and need their own word.
- **Inherited, not fixed:** a `None` / empty-string block-list item is dropped on read in `a1592dc`; the port matches it, so "0 differences" includes that gap. Ranks past 2^53 lose precision (accepted residual). Declared CLI/server differences (crash stderr, EPIPE, float text, some malformed-request answers) are listed in `0421`/`0422`'s worklogs.
- **Follow-ups:** `0539` — refuse foreign-Host GETs in the Node board server (today 200 on both sides); `0538` — the same for the shipped reader. `0423`'s scripts were throwaway, so `0539` must rebuild its comparison from the plan and worklog.
- **Two copies of aiboard's page now exist** (`board/web/` and `vendor/aiboard/`) — the cost [[decisions/adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge]] names.

## Related
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — phase 2, its gate, Q16 (fixture trees only)
- [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]] — the fence note that puts `test/board/` inside, and the 6-file pre-approval
- [[decisions/adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge]] — the page copied twice
- [[tasks/sprint-14-port-aiboard-to-node-adr-052-phase-2]] — the board
- [[tasks/ship-the-read-only-board-reader-to-every-fkit-user-via-fkit-board]] — `0536`, same sprint
- [[tasks/sprint-11-fkit-aiboard-convergence]] — the convergence sprint that led to ADR-052
- [[systems/testing-and-verification]]
- *Added 2026-10-23 (sync `96c7263`→`5ccf2c2`, closing one-way links):* [[systems/fkit]]
