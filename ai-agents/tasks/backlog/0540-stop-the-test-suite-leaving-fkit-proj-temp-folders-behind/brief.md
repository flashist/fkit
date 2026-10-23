# Stop the test suite leaving `fkit-proj-*` temp folders behind

## ID
0540

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**What was seen (2026-10-22 and 2026-10-23, by several verify workers).** Every `npm test` run
leaves about **3** folders named `fkit-proj-*` in the system temp folder (`os.tmpdir()`). They are
never removed. **1,071** of them have built up on the owner's machine.

**Where they come from.** `test/harness.mjs`'s `makeProject()` creates each one (prefix
`fkit-proj-`). They do **not** come from the `test/board/` tests. The harness already has a
`cleanup(dir)` helper, and `makeProject()` already cleans up on its own setup-failure path — so the
leak is in the callers that never hand the folder back.

**A lead, not a finding (checked by a text count on 2026-10-23, not by running anything).** Three test
files call `makeProject()` and never call `cleanup()`: `test/init-claude-refresh-guard.test.js`,
`test/init-intake-guard.test.js` and `test/structure-notice.test.js`. Three files, about three folders
per run — it fits, but the coder confirms it. The files that do call `cleanup()` may still leak when a
test **fails**, if the call is not in a teardown or `finally`-style path; check those too.

**Owner ruling 2026-10-23** (via `AskUserQuestion` in a `fkit lead` session, relayed to a spawned
`fkit-producer`): *"File a small Backlog task to stop the tests leaving temp folders behind?"* →
*"Yes, file it (Recommended)"* (description he saw: *"Adds one unranked Backlog task. Knock-on: none —
no other task waits on it."*).

**ADR-057 bearing.** This task changes **existing** test files and the harness; it needs **no new test
file**. Under [ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md)
§D2.1, any **new** test file (for example, a test that asserts "no leak") still needs the owner's OK,
file by file — the before/after count below is a hand check, not a kept test. The suite stays within
the 2-minute budget (§D10).

## What to build

1. **Every test that makes a temp project folder removes it when the test ends — pass or fail.**
   Use the harness's existing `cleanup()` helper, from a teardown path the test runner always runs.
2. **Fix it at the right level.** If many callers share the same pattern, the coder may make the
   harness own the cleanup (so a caller cannot forget it) instead of patching each file — the plan
   says which and why.
3. **Check the other harness temp prefixes** (`fkit-stub-`, `fkit-argv-`, `fkit-conv-`) while in there.
   If one also leaks, fix it in this task; if it does not, say so in the worklog.
4. ⛔ **Do not delete the existing 1,071 folders automatically** — not from a test, the harness, a
   script, or a postinstall step. A test suite must not sweep the shared temp folder by name; it could
   remove folders that belong to a run still in progress. The owner can clear the old ones by hand
   (delete the `fkit-proj-*` folders in the temp folder while no test run is going). Say this in the
   hand-off.
5. Code comments say **why**, not what (`conventions/code-comments.md`).

## Verification steps

1. **Before/after count, passing run.** Count the `fkit-proj-*` folders in `os.tmpdir()`, run
   `npm test`, count again. **The two counts are equal.** Record both numbers and the full test result
   (pass/fail counts) in the worklog.
2. **Before/after count, failing run.** Make one test that uses `makeProject()` fail on purpose
   (temporary local edit, reverted afterwards), run `npm test`, and count again. **The counts are still
   equal.** Record the numbers; confirm the temporary edit is reverted (`git diff` of that file is
   empty).
3. **Other prefixes.** The same before/after count for `fkit-stub-*`, `fkit-argv-*` and
   `fkit-conv-*` shows no growth on a passing run. Record the numbers.
4. **Nothing old was deleted.** The "before" count in step 1 is not lower than the count taken before
   the change was installed — the old folders are still there. (If the owner cleared them by hand in the
   meantime, say so instead.)
5. **Suite still green, still within budget.** `npm test` passes with the same number of tests as
   before the change, and the run time stays within ADR-057's 2-minute budget. No new test file was
   added.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- Filed 2026-10-23 by a spawned `fkit-producer` (no owner channel), on the owner ruling quoted in
  *Context*. Backlog board, unranked; placement knock-on: none.
- The 1,071 figure is the owner-machine count reported on 2026-10-23; it is not re-measured here.
