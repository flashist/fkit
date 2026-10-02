# Find why prove-red step 0a sometimes goes red, and make it deterministic

## ID
0477

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** The ruling that filed this task says so
> itself: *"Starts on your word."* Being pullable on the board is not his word.

**Owner ruling behind this task** (2026-10-02, `fkit-lead` session, `AskUserQuestion`, selected
option text, relayed to a spawned producer): *"File a task — Producer files a small task to find why
prove-red step 0a sometimes goes red (suspected: other agents writing files mid-run). Starts on your
word."*

**What was seen** (2026-10-02, relayed by two spawned coders; **not re-measured at filing**):
- Twice in one day `npm test` exited 1 because `test/prove-red.sh` failed at step **0a**
  (*"baseline — real launcher should be green ... red"*), while the unit suite run **just before it**
  in the same `npm test` passed 1017/1017. A standalone re-run of prove-red then passed
  (*"✓ hard gate PASSED"*).
- **Run 1** (a coder applying text fixes): during the run, another agent created
  `ai-agents/tasks/backlog/0475-…` and edited `ai-agents/sprints/backlog.md`. The coder's second run,
  with a check that the tree did not change, passed.
- **Run 2** (a coder making the README GIF): red at 0a on the first run; `ai-agents/tasks/backlog/0476-…`
  appeared during that work; re-run passed.
- **In neither case is the failing test known.** prove-red's output was already gone.

**What the producer checked in `test/prove-red.sh` at filing** (read, not run):
- **0a runs the whole unit suite against the REAL repo, not a copy.** `run_suite` runs
  `node --test "$repo"/test/*.test.js` with `FKIT_LAUNCHER` pointed at the real launcher. Only the
  later steps (0b onward) work on copies under a temp dir. So every test that reads live
  `ai-agents/` state reads the same tree other agents are writing to.
- **0a is the second full-suite run inside one `npm test`** (`package.json`: `node --test
  test/*.test.js && bash test/prove-red.sh`), so the window for a concurrent write to land mid-suite is
  doubled. That fits "unit suite green, 0a red, re-run green".
- **The failing output cannot survive today, for two separate reasons.** (1) Every step writes to the
  same file, `$work/suite-output.txt`, so 0a's output is overwritten by 0b straight away. (2) `$work` is
  a `mktemp -d` dir removed by `trap … EXIT`. Fixing only one of the two still loses the output.

**Suspects, not findings.** Many test files read live `ai-agents/` state (a grep at filing names, among
others, `reference-integrity`, `task-id-uniqueness`, `closed-rank-immutability`, `board-reader`,
`board-root`, `dashboard-contract`, `throughput-counter`, `adr-number-uniqueness`). One plausible
mechanism: a producer filing a brief adds the board row and creates the task folder in separate
writes, so for a moment a link dangles or a folder has no `brief.md`. **This is a guess; the task's
first job is to prove or disprove it.** If the red turns out to have another cause (for example a
timing-sensitive test with no concurrent write involved), stop and report before fixing.

**No conflict with a locked decision found.** prove-red's rule that it never mutates the real tree is
untouched by any fix here; keep it that way.

## What to build

1. **Keep the evidence first.** Make prove-red keep the failing step's full suite output when any
   step goes red, in a place that survives the run, and print where it is. Fix both causes above: a
   step's output must not be overwritten by the next step, and the temp-dir cleanup must not delete
   the output of a red step. Green runs should still clean up. The location must not be an absolute
   machine path in any committed file, and must not be inside `ai-agents/` (that would itself be a
   concurrent write to the tree the suite reads).
2. **Reproduce the red on purpose.** With 1 in place, run the 0a suite while a helper writes into
   `ai-agents/` mid-run (for example: add a board row, then create the task folder a moment later;
   also try a lone new folder with no `brief.md`). Name the exact test(s) that go red and why. If you
   cannot make it red this way, say so and report what you tried — do not fix a guessed cause.
3. **Make 0a deterministic.** Pick the fix from what step 2 shows, and say why. Candidates: run 0a's
   live-state readers against a snapshot of the tree taken at the start, or make those tests take one
   consistent read, or both. Prefer the smallest change that removes the race for every test that
   step 2 shows is exposed, not only the first one found. Check whether the same race reaches the
   first half of `npm test` (the plain unit run); if it does, say so and decide with the owner whether
   it is in scope.
4. Refresh the `.claude/` copies if anything under `claude/` changes.

## Verification steps

1. **Before the fix:** the deliberate reproduction from step 2 goes red at 0a, the failing test is
   named, and its kept output file is shown (path printed by prove-red, contents quoted in the worklog).
2. **Output kept on red:** force a red in a step other than 0a (e.g. a temporary local break,
   reverted afterwards) and show that step's own output is kept, not 0a's or another step's. Show a
   green run leaves nothing behind.
3. **After the fix:** the same deliberate reproduction, run at least 5 times, leaves 0a green every
   time. State the run count and results.
4. `npm test` green on a quiet tree; state the unit pass count and prove-red's final line.
5. `git diff` shows no change under `ai-agents/` made by the tests or the reproduction helper (the
   helper cleans up after itself), and no absolute machine path in any changed file.

## Notes
- **Depends on:** nothing
- **Blocks:** nothing
- **Why one brief, not two:** keeping the failing output (step 1) could ship on its own, but the
  owner asked for "a small task", and step 1 is the tool step 2 needs to name the failing test. They
  are sequenced inside the task instead of split. If the owner prefers, step 1 splits out cleanly as
  its own task.
- **Investigation inside the task:** the root cause is a strong suspect, not a finding. Step 2 is the
  gate; a different cause means stop and report, not fix.
- Evidence above came from spawned coders' reports, relayed by the lead; not re-measured at filing.
- **Consulted:** none at filing.
- Filed 2026-10-02 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  ruling above; it decides nothing beyond that ruling.
