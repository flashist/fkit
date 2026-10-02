# Run only the checks a change needs, not the full suite every time

## ID
0480

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** The ruling says so itself: *"starting on your
> word."* Being pullable on the board is not his word.

**The owner's problem, in his own words** (2026-10-02, `fkit-lead` session): *"the tests run every
time we do any changes, which is weird, because they can take up to 20-30 min, and right now we
changed only README that doesn't affect tests at all. How to improve it?"*

**Owner ruling** (same day, `AskUserQuestion`, selected option, relayed to a spawned producer):
*"Both: I adapt now + file a task — From now on I ask only for the relevant checks; the producer files
a task to put a 'what changed → which tests' rule into the coder's procedures (+ maybe an
`npm run test:docs`), starting on your word."* The lead already asks for relevant checks only; this
task makes that the written rule, so it does not depend on who drives.

**What runs today** (read at filing, not run):
- `npm test` = `node --test test/*.test.js` (33 test files, ~1017 tests per recent coder reports) **&&**
  `bash test/prove-red.sh` (deliberate mutations, each re-running suites; ~40 per the lead's report).
  `test:unit` and `test:prove-red` already exist as separate scripts.
- CI (`.github/workflows/test.yml`) runs `npm test` on every push to `main`, every PR, and on demand,
  with `timeout-minutes: 20`. `bin/release.mjs` runs `npm test` as the release gate.
- The coder's procedures do not say "run everything", but they do not say what to run either:
  `fkit-coder.md` says *"run the relevant tests"*; `fkit-task-ship-loop` step 5 and the sprint ship
  loop's Verify row say *"test per project conventions (ADR-014)"*. In practice "relevant" has meant
  `npm test`. `fkit-review` / `fkit-stateful-review` mention running a suite as review evidence.

**⚠️ The runtime figure on record is stale.** The wiki and `test.yml` record `npm test` at
**~6–8 minutes, machine-dependent** (owner-ruled 2026-08-13; observed 328–463 s), ~55 s of it unit.
The owner now reports **up to 20–30 min**, and the suite has grown since (15 mutants then, ~40 now).
Nobody has measured the parts recently. If a full run is near or over 20 min, **CI's
`timeout-minutes: 20` may already be cutting runs off** — measure before deciding anything.

**Locked decisions this must respect:**
- **ADR-026 Decision 4** (owner ruling 2026-07-19): `prove-red.sh` is wired into an automated gate so
  that mutation regressions are *"caught on every run"*, not only by manual audit. This task must
  **not** take prove-red out of `npm test`, CI, or the release gate without a new owner ruling. It
  changes what a coder runs **while working**, not what the gates run. (ADR-026 itself suggested a
  `test:full` / CI lane for prove-red; that is the precedent, not a licence.)
- **ADR-014**: `node --test`, zero dependencies.
- The **shared rules block** (CLAUDE.md "Universal hard rules" / output style) has a byte cap
  (`test/rules-block-budget.test.js`); keep the new rule out of it.
- Related: `0477` (prove-red step 0a sometimes goes red because tests read the live tree). Not a
  dependency, but measurements taken while other agents write to `ai-agents/` can be skewed by it;
  measure on a quiet tree.

## What to build

1. **Measure first.** Time `npm run test:unit` and `npm run test:prove-red` separately on a quiet tree,
   at least 2 runs each, and note the machine. Also time the cheap doc checks on their own (e.g.
   `test/reference-integrity.test.js`, `task-id-uniqueness`, citation / dual-home / frontmatter tests).
   Record the numbers in the worklog. If CI runs are hitting the 20-min timeout, say so and stop to
   ask the owner before going further (that is a separate fix).
2. **Write the "what changed → which checks" table** — the plan proposes it with the measured times,
   the owner approves it. Starting shape (the coder refines it from step 1 and from what each test
   actually reads):
   - **Docs only** (README, `docs/`, `CHANGELOG.md`, knowledge-base prose, briefs): link / reference /
     citation checks only.
   - **Skills, agents, hooks, scripts, launcher (`claude/`, `bin/`)**: the unit suite.
   - **Tests, or code a prove-red mutation targets**: unit + prove-red.
   - **Release, or anything uncertain**: everything (`npm test`). When in doubt, run more.
   - Always state in the report which checks ran and which were skipped, and why (a skipped check is
     not a passed one).
3. **Put the rule where the coder works.** Generic wording in the shipped procedures — `fkit-coder.md`
   and/or `fkit-plan-task` (the plan names the checks it will run), `fkit-task-ship-loop` step 5, the
   sprint ship loop's Verify row — so it works in a consuming project with its own test commands
   ("map the changed paths to the project's checks; run the full suite at release and when unsure").
   fkit's own table (its file paths, its scripts) lives **repo-local**, not in shipped skills — e.g.
   in `CONTRIBUTING.md` or a repo-only doc the generic rule points to "if the project has one".
   Check the reviewer's procedures too: if `fkit-review` / `fkit-stateful-review` run suites as
   evidence, give them the same rule. Not in the shared rules block.
4. **Maybe `npm run test:docs`**: a script running only the doc-safe checks from step 1. Add it if
   step 1 shows a meaningful saving and the set of doc-safe tests is clear; otherwise say why not.
   Repo-local (`package.json`), not shipped.
5. **Do not change** `npm test`, CI, or `release.mjs`'s gate. Whether CI should also skip prove-red on
   docs-only pushes (e.g. path filters) is an **open question for the owner** in the plan — it touches
   ADR-026 Decision 4 and needs his ruling, plus an architect consult on whether it needs an ADR.
6. Whether this change itself needs an ADR (it changes how fkit verifies work) — ask the architect in
   the plan; record one via `/fkit-record-decision` if so.
7. Refresh the `.claude/` copies after editing anything under `claude/`.

## Verification steps

1. Worklog has the measured times from step 1 (per part, per run, machine noted).
2. The approved table is written down in the repo-local doc; `grep` shows the generic rule in each
   shipped procedure named in step 3, and `CLAUDE.md`'s rules block is unchanged
   (`test/rules-block-budget.test.js` green).
3. If `test:docs` was added: it runs in well under the unit suite's time (state both numbers), and a
   deliberately broken link in a scratch doc makes it go red (then revert).
4. `package.json`'s `test` script, `.github/workflows/test.yml`, and `bin/release.mjs` are unchanged
   (`git diff --stat` on those three is empty), unless the owner ruled otherwise in the plan.
5. Since this change touches skills/agents, run what the new table itself says for that kind of
   change, and state it. No absolute machine path in any changed file.

## Notes
- **Depends on:** nothing
- **Blocks:** nothing
- **Why one brief, not two:** the owner asked for "a task". `test:docs` (step 4) could ship on its
  own, but it is optional and its contents come from step 1's measurements and step 2's table. If the
  owner prefers, it splits out cleanly.
- **Investigation inside the task:** step 1 (measure) gates the table; a CI timeout finding stops the
  task for an owner question.
- Related: `0477` (prove-red 0a flake), `0479` (changelog at release; release stays "run everything").
- Evidence on test counts and mutation counts came from the lead's relay and coder reports; not
  re-measured at filing.
- **Consulted:** none at filing.
- Filed 2026-10-02 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  ruling above; it decides nothing beyond that ruling.
