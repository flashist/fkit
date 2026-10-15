# Worklog — 0483: stop the board reader failing when a task folder moves between its check and its read

## 2026-10-14 — Build (fkit-coder, spawned Build worker under the ADR-055 declared-approval marker)

- Caller: `fkit-sprint-ship-loop` driven by `fkit-lead`, Sprint 10. Owner approved the plan via
  AskUserQuestion on 2026-10-14 ("Approve (Rec)"; (a) "Skip + don't cache (Rec)", (b) "Include both
  (Rec)", (c) "Add it (Rec)").
- Plan: `plan.md`, blob `3aa355b914c4f8ff6f227bb179b06f6e9003926f`, matched with `git hash-object`
  before building. Not edited.

### Change surface
- `bin/fkit-board.mjs`: new `readIfPresent()` (null on `ENOENT` only); `readTask` skips a vanished
  brief and re-checks the brief after the label checks; `readBoards` reads board files once,
  after `select-active`, building records only from files still present, and returns `vanished`;
  `snapshot()` drops unread tasks, builds `byId` from kept entries, and caches only a complete
  snapshot; `taskDetail` and `sprintDetail` retry once after dropping the cache, then return `null`.
  No import, `spawnSync` call, cache key or HTTP handler change.
- `test/board-reader.test.js`: H7, H8, H9, H10, H11, H11b, H12, plus a `moveOnFirst` fake
  (`fs` default import + `syncBuiltinESMExports`). No test hook in product code.
- `CHANGELOG.md`: one line under `## Unreleased`.

### Red before green
New tests run against the unchanged reader (`node --test test/board-reader.test.js`):
`tests 23, pass 16, fail 7`. The 16 existing tests passed; each new one failed:
- H7, H8, H11 — `ENOENT … tasks/backlog/0001-a/brief.md` (thrown)
- H9 — `AssertionError: a task whose labels could not be read is not shown as having none`
  (shown with `labels: []`)
- H10, H12 — `ENOENT … sprints/sprint-98.md` (thrown)
- H11b — `ENOENT … tasks/backlog/0001-b/worklog.md` (thrown)

After the fix: board-reader + board-root + board-archived-id, `tests 37, pass 37, fail 0`.

### Verify (plan §6)
- `node --test test/board-reader.test.js test/board-root.test.js test/board-archived-id.test.js`:
  37/37 pass.
- `node --test test/top-level-doc-links.test.js`: 9/9 pass.
- `npm test` (full): unit `tests 1128, pass 1128, fail 0`; prove-red final line
  `✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.`;
  exit 0.
- `node bin/fkit-board.mjs --bench` on the live tree: exit 0, full recompute 132–140 ms, cache hit
  2.8–7.4 ms, 516 tasks, 12 boards.
- Nothing written under `ai-agents/` by the tests: `git status --porcelain -- ai-agents/` identical
  before and after `npm test`, and `git diff -- ai-agents/ | shasum` was
  `b319eb8196a85ad5cb2b83f822b42f9aa2476908` both times. (This worklog was written after the
  after-snapshot.)
- Skipped (as the plan says): a live browser check, and an HTTP-level test of the detail routes. The
  handler is unchanged, and test G already pins `null` → 404.

### Decision log (obvious-winner calls)
1. **H11's second case split into its own test, H11b.** What: the plan's H11 "second case" (the
   folder moves between the brief and worklog reads) is a separate `test()`, not a second block
   inside H11. Why: in the first red run, H11's first case threw before the second ran, so the second
   case's own red could not be seen. Why it qualified: same assertions, same fixture shape, inside the
   plan's §4 (which asks for both cases red); test-only, localized.
2. **`readBoards` reads the board files after the `select-active` spawn, not before.** What: the
   plan says "read each board file first … the `select-active` call is unchanged", which leaves the
   order open; the reads happen after the existing spawn. Why: a board moved before its read is then
   always caught as vanished (no false "no candidate record" problem). Reading before the spawn would
   leave a window where a board read fine but then moved before `select-active`, giving that false
   problem. Why it qualified: one order clearly dominates, it keeps the plan's stated effect, and it
   changes nothing else.
3. **H12's id did not need the fallback.** Open `sprint-98.md` and archived `done/sprint-98.md`
   both resolve to `S-098` (open: dashboard identity "Sprint 98"; archived: `boardIdFromFile`), so
   the plan's primary assertion (no throw, status `Done`) is used. Confirmed by H12 red (ENOENT in
   `sprintDetail`) and then green.

Plan §7 fallback (`afterList` hook) was **not** needed: `syncBuiltinESMExports` reached the reader's
named imports on Node v24.13.0.

## 2026-10-14 — Review round 1, processed (fkit-coder, spawned Process-review worker under the ADR-055 declared-approval marker)

- Caller: `fkit-sprint-ship-loop` driven by `fkit-lead`, Sprint 10. Plan blob re-checked:
  `3aa355b914c4f8ff6f227bb179b06f6e9003926f`, matches. Per-round owner gate skipped under the
  standing approval; no judgment call arose, so nothing was returned as `NEEDS-DECISION`.
- Loop check: `review.md` § Accepted residuals was empty; ADR-051 / ADR-052 re-raise clauses do not
  cover any of R1–R3. All three novel.

### Decision log (fixes applied without asking)
1. **R1 → detail lookup retries on a miss in an uncached snapshot.** What changed: in
   `bin/fkit-board.mjs` `taskDetail` and `sprintDetail`, `if (!task) return null;` /
   `if (!board) return null;` became `if (cached === snap) return null; continue;` (a snapshot that
   skipped a moved file is never cached, so `cached !== snap` is the signal); the why-comment above
   `taskDetail` now covers both retry causes in 2 lines. New tests H13 / H13b in
   `test/board-reader.test.js`, red before the fix (`null` returned) and green after. Why it
   qualified: verified `CORRECT` (reproduced red); mechanical and localized (two lines plus a comment);
   in-plan, since plan §2 says only a task moved twice gets "not found right now" and the retry bound
   of 2 is unchanged. CHANGELOG wording is now accurate as written, so it was not touched.
2. **R2 → H14 added (test-only).** What: a `brief.md` that is a directory gives a real `EISDIR`;
   `snapshot()` must throw it. Proven to red on the mutant "null on every error" and on no other
   test. Why it qualified: verified `CORRECT` (the mutant passed all 37 before); a small regression
   pin for plan §2's "Only `ENOENT` is tolerated"; no product change.
3. **R3 → H15 and H15b added (test-only).** What: H15 pins the duplicate-id warning to `present[i]`
   (an earlier open board vanishes before a duplicate pair); H15b pins `byId` built from kept entries
   (an earlier duplicate copy is gone for its own read and back before the kept copy's read, using two
   nested `moveOnFirstRead` calls, so no new helper). Mutant `boardFiles[i]` reds H15 only; mutant
   `for (const e of taskDirs)` reds H15b only. Why it qualified: verified `CORRECT`; pins plan §3.3 and
   §3.4's stated invariants; test-only and small.
- Obvious-winner calls: none.
- Mutants were applied to the real reader one at a time from a scratch backup and restored;
  `cmp` against the backup confirmed the restore before the fix was written.

## Re-verify after review round 1 — 2026-10-14

- Red first: H13, H13b (new, R1) failed on the unfixed reader (`null` returned: `undefined` status);
  H14, H15, H15b passed on it and each red on its own mutant only (see the decision log above).
- `node --test test/board-reader.test.js test/board-root.test.js test/board-archived-id.test.js`:
  `tests 42, pass 42, fail 0` (was 37; +5 new).
- `npm test` (full): unit `tests 1133, pass 1133, fail 0` (was 1128; +5); prove-red final line
  `✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.`;
  exit 0.
- `npm run test:docs`: `tests 410, pass 410, fail 0`.
- `node bin/fkit-board.mjs --bench` on the live tree: exit 0, full recompute 119–128 ms, cache hit
  2.1–5.8 ms, 516 tasks, 12 boards.
- Guards: E2 (fs imports unchanged, exactly 2 `spawnSync(` calls) and C (no banner tokens in the
  reader) are both inside `board-reader.test.js` and passed; no import or spawn was added.
- Nothing written under `ai-agents/` by the test runs: `git status --porcelain -- ai-agents/`
  identical before and after (44 lines); `git diff -- ai-agents/ | shasum` was
  `b319eb8196a85ad5cb2b83f822b42f9aa2476908` both times; and, since this task folder is untracked
  and `git diff` cannot see it, a hash over every untracked file under `ai-agents/` was
  `eef17020acf1e920d5f41d10af350ae0eb022513` both times. (This section was written after the
  after-snapshot.)
- Skipped, as plan §6 says: a live browser check and an HTTP-level test of the detail routes (handler
  unchanged; test G pins `null` → 404). `npm run test:unit` was not run on its own: `npm test` covers it.
