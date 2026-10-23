# Stop the board reader failing when a task folder moves between its check and its read

**Source**: `ai-agents/tasks/done/0483-stop-the-board-reader-failing-when-a-task-folder-moves-between-its-check-and-its-read/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 10 `P24` (pulled by owner ruling R11, 2026-10-14) · task `0483` · owner `fkit-coder`

## Goal
Residual **R-c** of `0477` (test-only scope, so not fixed there); owner ruling 2026-10-04: *"File a backlog task."*
**The gap** in `bin/fkit-board.mjs`: `listTaskDirs` `stat`s each `brief.md`, and `readTask` reads it later with **no
`try`**. If another agent moves the folder in between (e.g. `/fkit-task-done` moving it `backlog/` → `done/`),
`snapshot()` throws — today a one-poll HTTP `500`, and `--bench` exits. **Never seen in any run**; a narrow window; low
priority. The same pattern existed in `taskDetail` (a cached path) and in the board-file read (the sprint movers move
board files). Constraint: the reader stays **read-only** and must **not invent data**; folder location stays the
authority for a task's state (ADR-029).

## Key Changes
- Owner plan rulings 2026-10-14: *"Approve (Rec)"*; behaviour *"Skip + don't cache (Rec)"*; scope *"Include both (Rec)"*
  (`taskDetail` and the board-file read); a `CHANGELOG.md` line *"Add it (Rec)"*.
- **`readIfPresent()`** returns `null` **on `ENOENT` only** — any other error still throws. A vanished brief is
  **skipped for this snapshot**, and **only a complete snapshot is cached**, so the next poll on a quiet tree sees the
  task in its new place. `readBoards` reads board files once, **after** the `select-active` call (so a board moved
  before its read is always caught as vanished), and reports the vanished ones.
- **`taskDetail` / `sprintDetail` retry once** after dropping the cache, then return `null` (→ 404, *"not found right
  now"*). After review R1 a miss also retries when this call's own snapshot skipped a moved file; the retry bound stays
  2, so only a task moved **twice** gets the 404.
- No import, `spawnSync` call, cache key or HTTP handler changed; **no test hook in product code** — tests use a
  `moveOnFirst` fake via `syncBuiltinESMExports`.
- Tests H7–H15b in `test/board-reader.test.js`, each red before the fix; review added H13/H13b (R1), H14 (only `ENOENT`
  is tolerated — a real `EISDIR` must still throw) and H15/H15b (the duplicate-id warning and `byId` built from kept
  entries only).

## Outcome
- Board tests 42/42; `npm test` exit 0, unit **1133/1133**, prove-red hard gate passed; `test:docs` 410/410.
  `--bench` on the live tree: full recompute ~120–140 ms, cache hit ~2–7 ms, 516 tasks, 12 boards. Nothing written
  under `ai-agents/` by the tests (hashed before and after).
- Review: reasoning-only second opinion — Codex ran but its sandbox denied temp-dir creation, so the measurements are
  the Claude reviewer's. R1–R3, all low, all `✅ done`.
- **Skipped, as the plan said:** a live browser check and an HTTP-level test of the detail routes (handler unchanged;
  test G pins `null` → 404).
- ⚠️ ADR-052 retires this read-only reader at its phase 8 (Backlog task `0467`); this fix lives until then.

> ⚠️ **Dated note 2026-10-23 (sync `96c7263`→`5ccf2c2`) — `test/board-reader.test.js` is deleted.** Task `0529` deleted it on 2026-10-20 under [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]] §D1 (category 3 — repo-only `bin/` tooling). The record above is left as written; what it describes no longer runs. The fix itself stays in `bin/fkit-board.mjs`, which now **ships** to every user as `fkit board` ([[decisions/adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge]]) — with no automated test.

## Related
- [[tasks/find-why-prove-red-step-0a-sometimes-goes-red-and-make-it-deterministic]] — `0477`, source of residual R-c
- [[tasks/make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads]] — `0411`, the reader this hardens
- [[tasks/let-the-read-only-board-reader-serve-another-projects-ai-agents-tree-root-flag]] — `0412`, the `--root` flag and the board-root tests run alongside
- [[tasks/make-board-root-test-reliable-under-machine-load]] — `0502`, the other Sprint 10 fix in the reader's tests
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — the board that replaces this reader
- [[tasks/sprint-10-the-0472-0482-batch]] · [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]]
- [[systems/testing-and-verification]] — the reader's tests and the `fs`-fake pattern
- *Added 2026-10-23 (sync `96c7263`→`5ccf2c2`):* [[tasks/the-test-scope-reset-tasks-0526-0530]] — the cut · [[tasks/ship-the-read-only-board-reader-to-every-fkit-user-via-fkit-board]] — the reader now ships
