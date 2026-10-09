# Make test/board-root.test.js reliable under machine load (its 20 s CLI time limit)

## ID
0502

## Sprint
Sprint 10

## Priority
P17

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** Being pullable on the board is not his word.
> The sprint ship-loop's per-task plan approval, given live by the owner, is where that word is given.

**Owner ruling, 2026-10-09** — given via `AskUserQuestion` in the `fkit lead` session, relayed to a
spawned `fkit-producer` with no owner channel (ADR-021; ⚠️ the texts are the lead's relay, not text this
producer saw the owner choose):

| Question | Selected option (verbatim, as relayed) | Option text |
|---|---|---|
| *"test/board-root.test.js keeps timing out under machine load (its 20 s limit) and has turned 4 full test runs red this sprint, never because of the task being tested. File a task to fix it?"* | *"File it, add to Sprint 10 (Recommended)"* | *"A small task to make that test reliable (e.g. a longer limit or a lighter check), ranked last in Sprint 10 (after 0474). Knock-on: none — no task depends on it."* |

⚠️ **The option said "after 0474"; the board's actual last row is `0498`** (rank `P16`), added after
`0474`. "Ranked last" is honoured literally: this task is appended at `P17`, below `0498`.

**The problem.** `test/board-root.test.js` runs the real board CLI (`bin/fkit-board.mjs`) as a child
process through a helper, *"const cli = (args) => spawnSync(process.execPath, [READER, ...args],"*,
with *"timeout: 20000"*. Two tests use it in the way that fails:

- *"R3: a bad --root exits 2, names what is missing, starts nothing, and never falls back"* — loops
  over 11 bad-`--root` cases, one CLI start each.
- *"R1: with no --root the root resolves exactly as before, and no --root line is printed"* — one
  `--bench` run over fkit's real task tree (3–14 s per `0477`'s plan, *"it counts task folders, then
  runs `--bench` (3–14 s)"*).

Under machine load (load average ~4–13) one call reaches the 20 s limit, Node kills the child, and the
call returns `status null` with empty stderr — so `assert.equal(r.status, 2, …)` fails as
`null !== 2`. The same test passes alone in about 1–10 s.

**Seen this sprint (all 2026-10-08/09), each time in files the task under test did not touch, each time
green on a targeted re-run** — cited from the task worklogs:

| Run | What went red | Worklog wording |
|---|---|---|
| `0492` round-1 full run | `prove-red.sh` step 0b, R3 | *"the board CLI was killed by that test's own 20 s `spawnSync` timeout (`status null`, empty stderr; the test took 43 s) under load"* |
| `0495` round-2 full run 1 | unit stage, R3 | *"`null !== 2` with empty stderr, i.e. the test's 20 s `spawnSync` timeout killed the board CLI (that test took 35 s)"* |
| `0495` round-2 full run 2 | `prove-red.sh` step 0a, R3 | *"step 0a (baseline re-run of the real suite) red on the same `board-root` R3 test (45 s; same `null !== 2`)"* |
| `0493` round-1 full run | `prove-red.sh` step 0a, R3 | *"the CLI call hit the test's 20 s `spawnSync` timeout (the case took 47 s)"* |
| `0494` `test:docs` run | R1 | *"at 20031 ms against about 1.2 s when it passes. The machine load average was about 5."* |

That is 4 full runs plus one `test:docs` run. **Why it multiplies:** `prove-red.sh` re-runs the whole
unit suite many times (step 0a, 0b, …), so one slow test gets many chances per gate to go red, and a
red hard gate stops a task's verify.

**Where the 20 s came from.** It arrived with the file in commit `0c6d679` (*"Board reader: --root flag
to serve another project's ai-agents tree (0412)"*). `0412`'s plan, worklog and review record **no
reason** for the number — none of them mentions it. The CLI's own guard for its dashboard call is
larger: *"const DASHBOARD_TIMEOUT_MS = 30000;"* in `bin/fkit-board.mjs`. Treat 20 s as an unrecorded
choice, not a decided value.

**⚠️ The limit is part of one R3 assertion — not just a safety net.** R3's comment says *"spawnSync
returning at all (no timeout) means no listener stayed up; no URL means none started."*, and it asserts
*"assert.equal(r.error, undefined, `${label}: the process ended by itself`)"*. So "starts nothing"
is partly proved **by the call not timing out**. Any fix must keep that proof: a CLI that wrongly starts
a server on a bad `--root` must still turn R3 red (sooner or later, but red).

**Producer's reading, unverified — the plan must measure, not trust this:** in `main()` of
`bin/fkit-board.mjs`, *"rootInfo = resolveRoot({ flag: arg(argv, '--root'), home });"* comes before
the *"const probe = spawnSync('bash', [dashboard, 'select-active', …"* call, so a bad `--root` should
be refused before any real work. If so, R3's 20 s is spent on process start-up and module load under
load, not on work the test can make lighter. R1 is different: `--bench` does real work over the whole
task tree.

**⚠️ The file already carries another task's uncommitted edit.** `git diff --stat
test/board-root.test.js` shows *"19 insertions(+), 16 deletions(-)"* (35 lines) — `0477`'s change
(its worklog: *"`test/board-root.test.js` (35), `test/harness.mjs` (30)"*): R1's count is now bracketed
before and after `--bench` using `liveTaskFolders` from `test/harness.mjs` (also uncommitted, +29/−1).
`0477` is closed (`✅ Done (agent-closed — not owner-verified)`). `0495`'s worklog attributed the edit
to `0492`; the diff itself names task `0477`. **Build on top of that edit — never revert it** — and
keep this task's diff separable in the report (see Notes for the owner question).

**Relation to other work — no conflict found:**

- `0477` (done) made prove-red's steps deterministic; it did not touch the 20 s limit. This task is the
  same kind of fix — a gate going red for a reason unrelated to the change.
- `0395` (done) set the CI job's time limit. A longer per-call limit here must not push the CI `test`
  job toward its limit — check the effect on total suite time.
- `0480` (done) runs only the checks a change needs; `test:docs` includes this file, so the fix helps
  that path too.
- ⛔ **Out of scope:** limiting CPU or test workers (the consuming-project precedent of capping
  workers). The owner dropped the CPU-limit idea on 2026-10-09 (as relayed).

## What to build

A test-reliability fix for `test/board-root.test.js`. The plan weighs the options and picks; it does
not take one on faith.

1. **Measure first.** Under synthetic load, time each slow call (R3's 11 cases, R1's `--bench`, and
   the `serveCli` helper's 20 s banner timer used by the server tests) and find where the time goes —
   start-up, module load, or real work. Confirm or reject the producer's reading above.
2. **Weigh these options in the plan** (one, or a mix), each against the R3 "starts nothing" proof:
   - **Raise the per-call limit** (one named constant, with a comment saying why its value). Cheapest;
     cost — a real hang takes longer to fail.
   - **Make the slow cases lighter** — fewer real CLI starts for R3 (e.g. keep the exported
     `resolveRoot` checks for every case, and start the real CLI for a representative subset), or a
     smaller tree for R1. Cost — less end-to-end coverage per case; the plan says which cases must keep
     a real start and why.
   - **Isolate them** — split the slow tests into their own file or group so they do not run inside
     every prove-red re-run. Cost — they may then run less often; the plan says where they still run.
   - **Retry once inside the test on a timeout only.** ⚠️ Weakest against the R3 proof: a retry must
     never turn a real "server stayed up" into a pass. If chosen, the plan must show how a genuine hang
     still fails.
3. **Keep every real assertion.** R3: a bad `--root` exits 2, names what is missing, starts nothing
   (no listener left up, no URL printed), and never falls back to fkit's own tree. R1: no `--root`
   reads fkit's own tree with the `0477` count bracket intact. No assertion is deleted or weakened
   without the plan naming it and the owner approving it.
4. **Same treatment for the other 20 s timer.** `serveCli` sets *"setTimeout(() => fail(new Error(`no
   banner in time; …`)), 20000)"*. It has not been seen red, but it is the same risk; the plan says
   whether it changes too.
5. **Test file only, by default.** A change to `bin/fkit-board.mjs` is out of scope unless the
   measurement shows the CLI itself is slow on the refuse path — then the plan says so and asks.

## Verification steps

1. **Reproduce red first.** Under a stated synthetic load (e.g. a CPU-burning process per core, or a
   concurrent full `npm run test:unit`; record the load average), run `node --test
   test/board-root.test.js` **N times (N ≥ 20) on the unfixed tree** and record the failure count. If
   the load does not make the unfixed test fail at least once, raise the load until it does — a green
   run under a load that never reproduced the red proves nothing.
2. **Green under the same load.** After the fix, the same N runs under the same load: **0 failures**.
   Record N, the load, and per-run times.
3. **The R3 proof still bites (mutation).** In a scratch copy, make the CLI fall back to its own tree,
   or keep a listener up, on a bad `--root`; R3 must go red. Revert. If a retry was chosen, also show a
   CLI that always hangs still fails.
4. **No assertion lost.** Diff review: every assertion in R1 and R3 is still present, or its removal
   is named in the plan and approved by the owner. `0477`'s R1 bracket and `liveTaskFolders` use are
   intact.
5. **Unloaded cost.** Record `test/board-root.test.js` time and full `npm test` time before and after
   on an idle machine; say how much the suite's total moved (relevant to `0395`'s CI job limit).
6. **Full suite green.** `npm test` (unit stage + `prove-red.sh`) exits 0 on the fixed tree.
7. **Scope.** `git diff --stat`: only `test/board-root.test.js` (and `test/harness.mjs` only if the plan
   says why), plus `CHANGELOG.md` if the release rule asks; the report separates this task's lines from
   `0477`'s uncommitted lines in the same file.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **Knock-on:** none — no open task waits on this one, and it waits on none.
- Related, not dependent: `0477` (done; its uncommitted edit lives in the same file), `0395` (done; CI
  job time limit), `0480` (done; change-scoped checks include this file), `0412` (done; introduced the
  file and the 20 s value with no recorded reason).
- `0493` and `0494` are `🔄 In progress` and their verify runs this file; until this task lands, a red
  on R1/R3 under load is this known issue, not their change — but each must still say so with
  evidence, as their worklogs already do.
- ⚠️ **Open for the owner:** `0477`'s edits to this file and `test/harness.mjs` are uncommitted while
  `0477` is closed. Should they be committed before this task starts, so its diff is clean? (No commit
  was made by this producer.)
- Filed 2026-10-09 by a spawned `fkit-producer` on `fkit-lead`'s instruction, under the owner ruling
  above (no owner channel, ADR-021).
- ⚠️ `Priority P17 is append rank, NOT a merit ranking — flagged for owner confirmation.`
  **On merit this belongs directly below `0477`**, because it is the same class of fix (a test gate that
  goes red for reasons unrelated to the change) and every later task's verify runs this file. That
  position sits above closed rows and is out of reach (ADR-035); the owner's ruling also asked for
  "ranked last", which `P17` is.
