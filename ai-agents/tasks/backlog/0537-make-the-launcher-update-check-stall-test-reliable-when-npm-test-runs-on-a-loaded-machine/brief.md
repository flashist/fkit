# Make the launcher update-check stall test reliable when `npm test` runs on a loaded machine

## ID
0537

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule, own words (2026-09-27):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being filed, or on the board, is not his
> word.

**Where this comes from.** Owner ruling, 2026-10-20, `AskUserQuestion` in the `fkit-lead` session
(Sprint 14 ship-loop), relayed to a spawned `fkit-producer`. Question: *"One old timing test failed once
under load (not caused by 0536). Close 0536?"* Selected, verbatim: *"Close + log follow-up
(Recommended)"* — description he saw: *"Close 0536 (agent-closed marker); brief a Backlog task to fix
the flaky test. Knock-on: none — nothing waits on it."* This is that follow-up.

**What was seen (2026-10-20, during `0536`'s final re-verify).** The test is
`0284/term-ignored: a git that ignores SIGTERM is KILLed 1 s later` (`test/update-banner.test.js:504`;
its shared check `assertStallCut` is at `:488`; its ceiling is **10.5 s**, from `0284` —
[brief](../../done/0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md)).

- **1 of 3** full `npm test` runs failed it, at a machine load average of about **18**. The launcher
  was held **33.3 s** against the 10.5 s ceiling. The stub git's `woke` line was **absent** — so the
  stall *was* cut (the stub's 20 s sleep never completed), just late.
- One **earlier** one-off failure with the same assert message, while Codex ran in parallel. Which run,
  and its numbers, were not recorded.
- The test **passes alone, 6 of 6**, on the tree with `0536` and on `HEAD` without it. **Not caused by
  `0536`.**

**Why this is not just "the machine was slow" — the root cause is not known yet.** 33.3 s is more than
the stub's own 20 s sleep, yet the stub never reached `woke`. Plain slowness is one explanation; others
are plausible — a cut process whose pipe is held open by a child it left behind (the same *kind* of
cost `0526` found behind prove-red mutation 48: *"a held stderr pipe under dash"*), or the launcher's
1 s KILL step being scheduled very late. Each points to a different fix, and one of them could be a
real launcher defect rather than a test defect. Hence the diagnosis gate in step 1.

**Rules this work sits under** ([ADR-057](../../../knowledge-base/decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md)):
- **D2.1** — no **new** test file and no new prove-red case without the owner's OK. This task changes an
  existing test; it adds no file.
- **D8** — *"a new timing test must not sleep for real"*, and the named open tension: the three `0284`
  timing tests sleep (~25 s a run) because `FKIT_NET_TIMEOUT` is hard-coded in the launcher. Removing
  the sleep needs either a test-only change or a shipped-code change (a timeout override), **each its
  own owner-approved brief** (per `0526`). ⚠️ This task is **neither of those by default**: it makes the
  test reliable. If the plan finds the right fix *is* the timeout override (a change to
  `claude/fkit-claude.sh`), that is a shipped-code change — put it to the owner at plan approval, and
  say it would also settle D8's tension.
- **D10** — default `npm test` ≤ 2 min on an idle Mac. The fix must not make the suite slower.

**Neighbour, not a dependency.** [`0520`](../0520-stop-the-update-checks-git-ls-remote-from-prompting-over-ssh/brief.md)
(Backlog) plans a test in the same file, `test/update-banner.test.js`. Either can go first; whichever
goes second rebases on the other.

## What to build

1. **Diagnose first — a gate, not a formality.** Reproduce the failure on purpose: run the test (and the
   whole `0284/*` group) under heavy synthetic CPU load, several times, and record per run how long the
   launcher was held, which processes were still alive when it returned, and whether the stub logged
   `woke`. Answer one question in the worklog, with the numbers: **is the 33 s the test (wall-clock
   ceiling, scheduling) or the launcher (it really waits that long, e.g. on a held pipe)?**
   - **If it is the launcher** — a real defect in shipped code — stop and report to the owner with the
     evidence. Fixing launcher behaviour is a different task; do not fold it in here.
2. **Fix the test so it stays green on a loaded machine** without losing what it proves: a git that
   ignores SIGTERM is still cut (no `woke`), not too early (the `≥ 4.5 s` check, i.e. the
   `FKIT_NET_TIMEOUT` deadline really fired), no banner, nothing on stderr, exit 0. How — the coder's
   plan decides (e.g. a ceiling or measure that accounts for load, or a change to how the stall is
   timed); the plan says why its choice still catches a launcher that is really held too long.
3. **Apply the same fix to the sibling `0284/git-deadline` test** (`assertStallCut(r, 10)`, just above)
   if the diagnosis shows it shares the cause — it uses the same check with a tighter ceiling.

**Out of scope:** removing the real sleep from the `0284` tests (D8's speed-up — its own brief); any
change to `claude/fkit-claude.sh` without the owner's OK at plan time; any new test file; `0520`.

## Verification steps

1. The worklog records the step-1 diagnosis: the load used, at least 5 loaded runs with held-seconds,
   `woke` present/absent and survivors per run, and the one-line answer (test or launcher).
2. Under the same synthetic load, the changed test(s) pass in **at least 10 of 10** runs (the failure
   was 1 in 3 before), recorded with the command used.
3. The test still fails when it should — shown by temporarily breaking the launcher's KILL step (e.g.
   no KILL after the ignored TERM) and seeing the test go red, then restoring it. Recorded in the
   worklog; nothing broken is left in the tree.
4. Idle-machine `npm test` passes, and its time is not longer than before the change (both numbers
   recorded; D10).
5. `git status --porcelain` shows no new file under `test/`, and no change to `claude/fkit-claude.sh`
   unless the owner approved it at plan time (named in the plan).

## Notes
- **Depends on:** nothing
- **Blocks:** nothing. Checked 2026-10-20: no open brief names `0537` (it is new); nothing waits on it.
- **Knock-on of placement:** on the Backlog board, unranked; no task in any sprint waits on it.
- Observed during `0536` (Sprint 14) —
  [brief](../../done/0536-ship-the-read-only-board-reader-to-every-fkit-user-via-fkit-board/brief.md).
- Filed 2026-10-20 by a spawned `fkit-producer` (no owner channel), on the owner ruling quoted in
  *Context*.
