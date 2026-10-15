# Re-measure the full test run time, locally and on CI, and show both in CONTRIBUTING

## ID
0503

## Sprint
Sprint 12

## Priority
P8

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** Being pullable on the board is not his word.

**Owner ruling, 2026-10-09, AskUserQuestion in the `fkit lead` session**, relayed to a spawned
`fkit-producer` with no owner channel (ADR-021; ⚠️ the texts below are the lead's relay, not text this
producer saw the owner choose). Question: *"CONTRIBUTING says a full test run takes ~12 min; on this Mac
it's 23–30 min (CI ~11). Update it?"* — selected, verbatim: **"File a task to re-measure
(Recommended)"** (option text: *"Backlog task: re-measure and show local and CI times separately.
Knock-on: none — nothing waits on it."*). This is that task.

**What CONTRIBUTING says today.** `CONTRIBUTING.md`'s *Tests* block gives `npm test` as
*"everything: unit suites + test/prove-red.sh (~12 min)"*, `npm run test:unit` *"(~1 min)"*,
`npm run test:prove-red` *"(~11 min)"*, `npm run test:docs` *"(~30 s)"*, followed by *"Times are from a
busy Apple M4 Pro (2026-10); yours will differ."* The same *"`npm test` (~12 min)"* and
*"`npm run test:unit` (~1 min)"* appear again in its what-to-run table. These figures come from task
`0480` (plan table: *"`npm test` total (unit + prove-red, derived) | — | ≈ 706 s ≈ 12 min"* — derived,
not one timed run).

**What has been measured since** (all on the owner's Mac unless stated; verified in the files named):
- `0502` worklog, V6: *"`npm test` **exit 0**, 1385 s (23.1 min), load 2.6 at start / 2.7 at end"*, and
  *"CONTRIBUTING's "~12 min" is stale on this machine"*.
- `0498` worklog: *"`npm test` exit 0, 28m39s wall time"*.
- `0493` worklog: *"One full `npm test` in a fresh scratch copy including `.git` … 1870 s"* (round 1).
- Joint `0493`+`0494` run: **2134 s** — ⚠️ **as relayed by the lead; not found in any file under
  `ai-agents/`** when this brief was filed. Treat as unverified.
- Earlier, under heavy load: e.g. `0473` worklog *"13:19–14:07 UTC (~48 min), load 10.8 at start, ~28
  mid-run"*. The lead's relay puts the loaded range at *"~30–48 min"*.
- **CI:** `0395` worklog measured the ubuntu runner at *"7.4–10.9 min"* (slowest job ~10.9 min). That was
  **before Sprint 10's suite growth** — `.github/workflows/test.yml`'s own comment says Sprint 10's
  additions *"were NOT in the measured runs (estimated ~+1 min, unverified until a run carries them)"*;
  `timeout-minutes: 33` now.

**Why the gap matters.** CONTRIBUTING's table tells a contributor which check to run; the time is what
makes *"`npm test` (~12 min)"* vs *"~1 min"* a real trade-off. A figure off by 2× on the main dev machine
misleads anyone budgeting a task's verify step, and mixes two machines (local vs CI) into one number.

**What dominates (to confirm, not assumed).** `package.json`'s `test` script is the unit suite followed
by `bash test/prove-red.sh`. `test/prove-red.sh` calls `run_suite` — a whole `node --test
test/*.test.js` pass — 6 times (2 baselines + 4 mutations), plus many single-file suite runs; with
`npm test`'s own unit pass, that is **about 7 full passes of the unit suite**. So the full run should
scale with the unit suite × ~7. The coder confirms this from timings, not from this count.

## What to build

1. **Measure locally**, on the owner's Mac:
   - At least **one full `npm test` on an idle machine** (close other heavy work; record the load average
     at start, mid-run and end). If the machine cannot be made idle, say so and record the load.
   - Split the time: unit phase vs prove-red phase (and `npm run test:docs` once, for its row).
   - Record date, commit SHA, Node version, and **suite size** (`node --test` test count, prove-red
     mutation count / baseline count).
2. **Measure CI**: read the latest runs of `test.yml` that **carry Sprint 10's suite** (`gh run list
   --workflow test.yml`, then `gh run view <id> --json jobs` for job and step times, the method the
   workflow comment names). Report min / max / slowest job, with run dates. If no such run exists yet,
   say so — do not estimate a CI figure.
3. **Say which tests dominate**: confirm (or correct) the ~7-full-passes picture above from the timings
   — e.g. per-`run_suite` step times from prove-red's output, and the slowest few unit test files. A
   short ranked list is enough.
4. **Update `CONTRIBUTING.md`** so local and CI times are **shown separately**, each with its date and
   suite size (and machine/load for local). Update every place the old figures appear (the *Tests*
   block and the what-to-run table). Keep the *"yours will differ"* caveat; say plainly that load can
   roughly double the local time, with the measured loaded figure.
5. **Out of scope:** `.github/workflows/test.yml`'s `timeout-minutes` and its comment (task `0395`'s
   ground), and any speed-up of the suite. If the CI slowest job comes in above ~half the 33-min timeout,
   or the dominant-test finding suggests an easy speed-up, **record it as a finding** for the owner — do
   not act on it here.

## Verification steps

1. The worklog holds a measurement table: each run's date, commit SHA, wall time, unit/prove-red split,
   load averages, test count and mutation/baseline count — local and CI in separate rows, CI rows with
   their run IDs.
2. Every figure in the new `CONTRIBUTING.md` text matches a row of that table (reviewer spot-checks each).
3. `CONTRIBUTING.md` no longer carries a single unlabelled `~12 min`; local and CI each have a figure, a
   date and a suite size. `grep -n "12 min" CONTRIBUTING.md` returns nothing, or only a labelled figure
   the table supports.
4. The dominant-test statement is backed by timings in the worklog (not by the count in this brief).
5. `npm run test:unit` passes after the edit (no test reads `CONTRIBUTING.md` as of filing — re-check
   with `grep -l CONTRIBUTING test/*`; if one does, run what CONTRIBUTING's own table says).

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **Related:** `0395` (CI timeout re-measure — method and the 10.9 min baseline), `0480` (wrote the
  CONTRIBUTING table and the ~12 min figure), `0502` (board-root timeout under load; its V6 run is a
  data point here). Related, not dependent.
- **Knock-on:** on the Backlog board, nothing waits on it; it waits on no sprint.
- **Cost:** at least one full local run (~23–30 min at normal load on the owner's Mac, longer if busy)
  plus reading CI runs. The idle-machine run needs the owner's cooperation — ask before starting it.
- **Placement:** Backlog board, unranked (`—`), per the owner's ruling. Pull it into a sprint when the
  owner gives the word.
- Filed 2026-10-09 by a spawned `fkit-producer` on `fkit-lead`'s instruction, under the owner ruling
  quoted in *Context*. Not started; no commit.
