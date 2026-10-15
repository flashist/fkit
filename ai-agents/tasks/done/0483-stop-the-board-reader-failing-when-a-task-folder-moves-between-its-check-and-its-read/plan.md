# Plan — 0483: stop the board reader failing when a task folder moves between its check and its read

Planning only. I wrote no files and no source.

**Summary**
- **Fix:** one small helper, `readIfPresent(path)`. It returns `null` only on `ENOENT` ("file not found"); every other error is still thrown. All four places that check a path and read it later use it.
- **Behaviour picked:** if a task or board moved inside the gap, `snapshot()` leaves it out of that one snapshot and **does not cache that snapshot**. The next poll (3 s later) shows it in its new place. The detail routes (`taskDetail`, `sprintDetail`) drop the cache and retry once.
- **Scope:** all three places the brief names (snapshot task read, `taskDetail`, board-file read). I also added two of the same kind: `sprintDetail`'s board read, and the label checks in `readTask`. The plan's own call; flagged below.
- **Tests:** 6 new tests in `test/board-reader.test.js`, red before the fix and green after. No test hook is added to product code. The tests swap `fs.readFileSync` for a fake through Node's `syncBuiltinESMExports`; the fake moves the folder and then does the real read, so the "file not found" error is real.
- **Verify:** `npm test` (the full suite, because a file under `test/` changes), plus a `--bench` smoke run and a before/after `git status` of `ai-agents/`.
- **Checked while planning (read-only):** the fake does reach the reader's named `readFileSync` import (Node v24.13.0). With it, today's `snapshot()` on the live tree throws `ENOENT`. That shows the red.

## 1. Context checked
- `bin/fkit-board.mjs` (733 lines):
  - `listTaskDirs` runs `statSync` on `brief.md` inside a `try`. Later, `readTask` reads it with `readFileSync` and no `try`.
  - `readBoards` reads each board file after `listBoardFiles` checked it, and after the `select-active` spawn.
  - `taskDetail` and `sprintDetail` read paths taken from the **cached** snapshot.
- The cache key (`cacheKey`) holds per-board task counts, the total number of board files, and the newest mtime. So it **cannot see**:
  - a rename inside one task board;
  - a board file moved between `sprints/`, `sprints/done/` and `sprints/cancelled/` without being edited (`renameSync` keeps the mtime).
  - In either case a cached snapshot keeps serving the old paths, and today the detail routes throw `ENOENT` → `500` on every request until something else changes the key. This makes the `taskDetail` gap the brief names a lasting failure, not only a timing window. The tests can reproduce it with no fake at all.
- `0477` residual R-c (`plan.md` § Risks and residuals; `review.md` § Accepted residuals) matches the brief. The wiki records R-c becoming `0483`. No locked decision conflicts.
- Guards I must keep green:
  - **E2**: `node:fs` imports stay exactly `existsSync, readFileSync, readdirSync, statSync`, and no write API appears. No new import is planned.
  - **C**: the reader's whole source, comments included, must not contain `In progress`, `✅`, `> ##`, the other banner markers, or `lines[2]`.
- `bin/fkit-board.mjs` is not named in `test/prove-red.sh`.
- `dashboard.sh` is **not touched**, so its ADR-017 header stays as it is.
- `0467` (retire the reader) is an unscheduled Backlog task gated on the owner's word. It does not affect this one.

## 2. Behaviour chosen, and why
- **Leave out and don't cache**, rather than re-listing inside `snapshot()`:
  - It is the simplest form that never invents data: a task that moved is not shown in its old place, and no data is made up for it.
  - It heals itself on the next poll.
  - Not caching is what makes healing certain. A within-board rename (or an unedited board move) leaves the cache key **unchanged**, so a cached snapshot missing the task would have been served indefinitely. Only the next poll after a gap pays a full recompute (~170 ms); a move takes microseconds, so this cannot repeat poll after poll.
  - Cost: the moved card can be missing for one poll (≤3 s). The alternative, re-listing once inside `snapshot()`, avoids that but adds a retry loop around the whole snapshot for a race never seen. The owner can ask for it at approval.
- **Detail routes retry once**, setting `cached = null` first, because a stale path there is lasting (§1). If the second try also fails, the answer is `null`, which the server sends as a 404. A moved-twice task gets "not found right now", not a 500.
- **Only `ENOENT` is tolerated.** `EACCES`, `EISDIR` and the rest are not a move. They still throw and still give the existing `500 (CODE)` with no path in it.

## 3. Changes — `bin/fkit-board.mjs` (~35 lines)
1. **New helper `readIfPresent(path)`** near `readTask`. One why-comment: a mover can move a folder between listing and reading, and only that gap (`ENOENT`) is tolerated.
2. **`readTask(entry)`:**
   - `const text = readIfPresent(entry.brief); if (text === null) return null;`
   - After the three label checks (`plan.md`, `review.md`, `worklog.md`), add `if (!existsSync(entry.brief)) return null;`.
   - Why: a folder that moved between the brief read and those checks would otherwise show with its labels missing — invented absence. One comment line says so.
   - Cost: one extra `stat` per task, and only on a full recompute.
3. **`snapshot()`:**
   - Read each task and keep only the entries that returned a task.
   - Build `byId` from the kept entries only, so `byId` and `data.tasks` agree. The existing first-wins rule is unchanged.
   - Set `complete = (no task skipped) && !vanished` (where `vanished` comes from `readBoards`).
   - Return the snapshot as before, but store it only if complete: `cached = complete ? snap : null`. One comment line: a snapshot that skipped a moved file is never cached, because its key can match the settled tree.
4. **`readBoards()`:**
   - Read each board file first, with `readIfPresent`. Build the board records only from the files still present. The status logic and the `select-active` call are unchanged.
   - Effect: a board that vanished never gets the false "no candidate record from dashboard.sh" problem.
   - **Pitfall:** the duplicate-id warning block indexes `boardFiles[i]` alongside `boards`. It must use the `present` list instead, or the names go out of line.
   - Return `vanished: present.length < boardFiles.length` as well.
5. **`taskDetail(id)`:**
   - Loop at most 2 times. Each try: `snapshot()`, look up the task (if not found, return `null`), read the brief and `worklog.md` with `readIfPresent`.
   - If the brief is `null`, or `!existsSync(entry.brief)` after the worklog read (the folder moved between the two reads), set `cached = null` and try again.
   - Otherwise return as today. An absent worklog gives `[]`, so `readIfPresent` replaces the old `existsSync` check before the read.
   - After two failed tries, return `null`.
6. **`sprintDetail(id)`:** the same 2-try loop around `readIfPresent(board.path)`.
7. **Not changed:**
   - the HTTP handler and its `500` path;
   - `--bench` (it simply stops being able to throw `ENOENT` here);
   - `cacheKey` and its comments: they still say truthfully that the key misses a within-board rename;
   - the file header, imports and `spawnSync` call count (E2 counts exactly 2).

## 4. Tests — `test/board-reader.test.js` (~130 lines, new tests H7–H12)
- **Fixtures:** tmpdir trees built the way H5/H6 build them. Nothing is written into the repo.
- **New test-only imports:**
  - the default `fs` import from `node:fs`;
  - `syncBuiltinESMExports` from `node:module`.
- **Helper `moveOnFirstRead(target, from, to, fn)`:**
  - Swaps in a fake `fs.readFileSync`. The first time it is asked to read `target`, it `renameSync(from, to)`s (the test's own unpatched binding) and then calls the **real** read, so the `ENOENT` is genuine.
  - Fires once.
  - Always restores the real function in `finally`, plus `syncBuiltinESMExports()`.
  - `node --test` runs each file in its own process, and tests in a file run one after another, so the fake cannot leak.
- **A twin, `moveOnFirstExists`,** does the same on `fs.existsSync`, for H9.

The tests:
- **H7.** A task moved across boards in the snapshot gap:
  - Fixture: `backlog/0001-a`, `backlog/0002-b`. On the read of 0001's brief, move it to `done/`.
  - Assert `snapshot()` does not throw and its tasks are just `['0002']`: 0001 is not shown in either place.
  - Then, on the quiet tree, the same reader's `snapshot()` has 0001 with `status: 'done'`. This is verification step 2.
- **H8.** A within-board rename in the gap (`backlog/0001-a` → `backlog/0001-renamed`), so the cache key is unchanged:
  - Assert no throw.
  - Then the follow-up `snapshot()` shows 0001 with `folder: '0001-renamed'`.
  - **This is the test that pins the "never cache a skipped snapshot" rule.** If the skipped snapshot were cached, the follow-up would serve it and the test would fail.
- **H9.** The folder moves after the brief read, before the label checks (fake on the `existsSync` of its `plan.md`):
  - Assert the task is left out, not shown without its labels. Follow-up shows it with label `plan`.
  - Red today: it is shown with `labels: []`.
- **H10.** A board file moved in the gap:
  - Fixture: an open `sprint-98.md` with a fixture banner, as `withSprintFixture` builds it. On its read, move it to `sprints/done/`.
  - Assert no throw, sprint absent, `problems()` free of any `sprint-98.md` problem.
  - Follow-up shows it with status `Done`. The board-file count and mtime are unchanged, so this also pins the no-cache rule for boards.
- **H11.** `taskDetail` with a stale cached path. No fake needed: warm the snapshot, `renameSync` `backlog/0001-a` → `backlog/0001-b`, then call `taskDetail('0001')`.
  - Assert it returns the brief text and the worklog, and does not throw.
  - Second case: with the fake moving the folder on the `worklog.md` read, assert the worklog still comes back, not `[]`.
- **H12.** `sprintDetail` with a stale cached path: warm, hand-move the open board to `done/`, call `sprintDetail(<id from the warm snapshot>)`.
  - Assert no throw, and a board with status `Done`.
  - The id should be the same for open and archived (see `board-archived-id.test.js`); I will confirm that at build time. If it differs, the assertion becomes "no throw, and the new id resolves", noted in the worklog.
- **Red before green:** the new tests are written first and run against the unchanged reader.
  - H7, H8, H10 and both H11 cases fail by throwing `ENOENT`; H9 by `labels: []`.
  - H12 throws `ENOENT` in `sprintDetail` — or, if the open and archived ids differ, it fails at its id lookup (the fallback assertion in its test item).
  - The failing lines are recorded, then the fix is applied and the same run turns green.
- **Comments:** why-only, 1–2 lines each (`code-comments.md`). The file header's A–G scope list is not extended; the H-series was already outside it.

## 5. CHANGELOG
- One line under `## Unreleased`: the web board no longer answers a poll or a detail request with an error when a task or sprint board is closed or moved at that moment.
- Per CONTRIBUTING ("a change people who use fkit would notice"). The owner can strike it at approval.

## 6. Verify — checks mapped through CONTRIBUTING.md's "what changed → what to run" table
| Changed path | Row | Check |
|---|---|---|
| `bin/fkit-board.mjs` | "`bin/` tools other than `release.mjs`" | `npm run test:unit` |
| `test/board-reader.test.js` | "anything under `test/`" | `npm test` (~12 min) |
| `CHANGELOG.md` | top-level docs | `npm run test:docs`; fast path `node --test test/top-level-doc-links.test.js` |

**Run, in order:**
1. **Red first.** Run `node --test test/board-reader.test.js` before the fix; record the failing tests.
2. **Inner loop.** Run `node --test test/board-reader.test.js test/board-root.test.js test/board-archived-id.test.js`, the three files that import the reader.
3. **Full suite.** Run `npm test` once; it covers both other rows (`test/*.test.js` includes every `test:docs` file).
   - Report the unit pass count and prove-red's final line (brief, verification step 4).
4. **Smoke run.** `node bin/fkit-board.mjs --bench` on the live tree (read-only): the CLI path still runs.
5. **Nothing written under `ai-agents/`** (brief, verification step 5).
   - Take `git status --porcelain -- ai-agents/` plus `git diff -- ai-agents/ | shasum` before and after the test runs.
   - Caveat: other agents in this sprint loop may write `ai-agents/` while the tests run. Any difference is checked against what those agents wrote before it is blamed on the tests.

**Skipped, and why:**
- **A live browser check of aiboard's UI:** no UI or HTTP-handler change. The routes' behaviour is pinned at the `makeReader` level.
- **A separate HTTP-level test of the detail routes:** the handler code is unchanged. It turns `null` into a 404 already (test G).

## 7. Edge cases and risks
- **Duplicate ids** (a botched move leaving 0001 in two boards): if the first copy vanished, the second is the one shown for that snapshot, by the same first-wins rule. Acceptable, and no invention.
- **Check C** fails if a new comment quotes a banner token or "In progress". Wording is checked before the run.
- **The fake depends on `syncBuiltinESMExports`.** It is documented Node API and shown working on v24.13.0. If it fails on the CI Node version, the fallback is an optional `makeReader({ …, afterList })` hook. That adds a test-only surface to product code, so it would come back as a NEEDS-DECISION, not be taken silently.
- **macOS tmpdir path forms:** the fake matches the path built with `join(...)` exactly as the reader builds it from the `root` it was given, so the `/var` vs `/private/var` difference does not arise.
- **Retry bound** is 2, so a folder that keeps moving gives a 404, never a loop.

## 8. Residuals, recorded rather than fixed
- **R1 — cache key blind spots** (pre-existing): a within-board rename, or a board hand-moved between `sprints/` folders without an edit, leaves the main `/api/board` snapshot stale until something else changes the key. Now:
  - the detail routes recover from it, and clear the cache when they do;
  - the movers move task folders between boards and edit a board before moving it, so in normal use the key does change.
  - Not fixed here: it is a cache-key change outside this task's "check then read" class.
- **R2 — the cost of skipping:** a moved card can be missing for one poll (≤3 s). This is the choice made in §2.
- **R3 — a board added between listing and `select-active`** is ignored for one poll. It is not an error and nothing is invented.

## 9. Not acted on (for the producer)
- The brief's Notes still say "Not yet scheduled: on the Backlog board", but its `## Sprint` says Sprint 10. That line is out of date. Left alone: it is a producer edit, not part of this task.

## Open questions
None blocking. The owner may overrule any of the plan's own calls at approval:
- (a) **Skip + don't cache** vs re-listing once inside `snapshot()` (§2).
- (b) **Bringing `sprintDetail` and the `readTask` label post-check into scope** (§3.2, §3.6). Without them, each stays a same-class residual.
- (c) **The CHANGELOG line** (§5).

Knock-on: none (checked). No task moves sprint or board, and no `Depends on:` link changes.
