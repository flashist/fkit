# Worklog — task 0283

## Build worker, 2026-08-13

Spawned by `/fkit-sprint-ship-loop` in a live `fkit lead` session, under the declared-approval marker
(owner approved `plan.md` 2026-08-13 via `AskUserQuestion` in the driver session). Bounded unit of
work: implement Edits 1, 2 and 3 of the approved plan in `test/orphan-cleanup.test.js`.

Plan pointer checked on arrival: `git hash-object plan.md` = `e2a6efdf74009d19c27f38da75ed69ac76165f32`,
7985 bytes — matches the pointer in the spawn prompt. (Self-computed and self-reported, like the
driver's own; no hook verifies it for 0283.)

### Premise check, before relying on the plan

The plan's Edit 1 rests on `mkdirSync(join(p, '.Fkit', 'Settings'), { recursive: true })` being a
no-op on a case-insensitive macOS filesystem rather than a throw. **Measured, not assumed** — in a
scratch directory with `.fkit/settings/coder.json` already present:

- `mkdirSync` did not throw;
- `readdir('.')` returned `[ '.fkit' ]` — no second directory was created;
- `coder.json` was still there; `existsSync('.Fkit/Settings')` was true.

So on macOS the seed resolves onto the existing lockdown state and changes nothing, which is what the
plan predicted. Guard mechanism re-read at `claude/fkit-claude-init.sh:735-751` and the refusal text
at `:760-825`: the `*settings*` `continue` is outside the existence check, the announcement is inside
it, and refusals are emitted to stderr as `    <line> — refused: fkit will never delete lockdown state`.
Reality matched the plan; no `NEEDS-DECISION` was needed.

### What changed

`test/orphan-cleanup.test.js`, the `describe('G. …')` test *"the never-delete-lockdown-state guard is
case-insensitive"* — one file, +26/-1.

- **Edit 1** — seeded `mkdirSync(join(p, '.Fkit', 'Settings'), { recursive: true })` before
  `runInitFrom`, so the differently-cased path exists on either kind of filesystem.
- **Edit 2 (owner ruling 3, the widening)** — the fixture `orphan-targets` is now
  `.Fkit/Settings\n.fkit/settings\n`, so a line names the real lockdown state on either platform and
  the `coder.json` survival assertion is load-bearing everywhere.
- **Edit 3** — reworded the comment. The C5 history is **kept** (not deleted), with the 0283 finding
  appended: why the test was really asserting "the filesystem folded case for me", what the two edits
  change, and what is now proved on both filesystem kinds.

No product change. `claude/fkit-claude-init.sh` untouched, as the plan's bounds require.

### Verification run here (cheap regression check only)

- `node --test test/orphan-cleanup.test.js` — **exit 0**, 23/23 pass.
- `npm test` — **exit 0**, **709 tests, 709 pass, 0 fail**. Exit code captured without a pipe.
- `git diff --stat` — exactly one source path: `test/orphan-cleanup.test.js`.
  (`ai-agents/sprints/sprint-5.md` was already modified in the opening `git status` before this worker
  ran — the driver's, not this task's.)

⚠️ **A plain macOS run cannot see this class of defect** — that is the whole point of the task. The
case-sensitive-image reproduction, the post-fix green there, and `prove-red.sh` are a **separate
verification spawn** and were **not** run here. Nothing in this worklog claims the Linux/CI red is
fixed; that remains **inferred, not measured**, until that spawn reports. No commit, no push.

## Decision log — fixes applied and calls made without asking

One entry.

1. **Added a per-line refusal-reason assertion inside the same test.**
   - *Which finding/instruction it answers:* the plan's Edit 2 ⚠️ — *"Both lines must still be refused
     and the state must survive. Do not let the widening turn the test into one that passes because the
     guard did something different than intended — verify the guard refuses on the basis of the
     `*settings*` match."*
   - *What changed:* a loop over `['.Fkit/Settings', '.fkit/settings']` asserting
     `r.stderr.includes(`${line} — refused: fkit will never delete lockdown state`)`, alongside the
     original `assert.match(r.stderr, /lockdown state/)` (kept — it is the pre-existing contract line).
   - *Why it qualified:* in-plan and mechanical/localized. The plan makes that verification an explicit
     obligation of Edit 2; encoding it as an assertion is the only way it holds after this worker is
     gone, rather than resting on one worker having eyeballed the stderr once. It adds no new fixture,
     no new dependency, and no assertion about anything the plan does not already name. It closes
     exactly the hazard the ⚠️ describes: a refusal arriving for the wrong reason (containment, a
     symlink check, or the line naming nothing) would still leave `coder.json` alone and the old
     assertions would pass regardless.
   - *Risk if wrong:* it couples the test to the guard's exact refusal wording. ~~That string is already
     asserted on elsewhere in this suite, so the coupling is not new~~, but a reviewer may reasonably
     want it looser — flagging it rather than burying it.

     > ⚠️ **CORRECTION (Process-review worker, 2026-08-13 — review finding R3, CORRECT).** The struck
     > clause is **FALSE** and is corrected rather than deleted, so the record shows what was claimed.
     > The exact rendered sentence was **not** asserted anywhere else. Re-measured first-hand this
     > round: `grep -rn -- " — refused: "` across `test/` returns **exactly one** hit — this assertion
     > itself; `grep -rn "refused: fkit will never delete lockdown state" test/ claude/` returns two —
     > this assertion and the emitting line `claude/fkit-claude-init.sh:746`. Before this change, only
     > the **fragment** `/lockdown state/` was asserted, in this same test.
     > **What is true:** asserting refusal *wording* is established practice in this suite; pinning the
     > **whole rendered line** is unique to this site. The coupling is therefore **new in degree**.
     > ⛔ The correction makes the case for keeping the assertion **stronger**, not weaker — it is the
     > sole detector of the C5 regression (see `review.md` R1 and the residuals).

No obvious-winner calls beyond the above. No frontier-moves. Nothing outside the approved plan was
attempted.

## Verify worker, 2026-08-13

Spawned by `/fkit-sprint-ship-loop`. **Verification only — no implementation, and nothing was fixed**
(nothing verification touched proved broken). Plan pointer re-checked on arrival:
`git hash-object plan.md` = `e2a6efdf74009d19c27f38da75ed69ac76165f32`, 7985 bytes — matches the spawn
prompt. (Self-computed; no hook verifies it until 0204 lands.)

**Case-sensitive volume used throughout:** `hdiutil create -size 900m -fs "Case-sensitive APFS"`,
mounted at `/Volumes/CS0283`, `diskutil` reporting `File System Personality: Case-sensitive APFS`.
Proven case-sensitive before use: `.Fkit/Settings` and `.fkit/settings` coexisted as distinct
directories. Detached and removed at the end.

### Method note — where each run was executed, and why it matters

`test/harness.mjs:19` derives `REPO` from its own directory, so a tree extracted with `git archive`
runs its own copy of `claude/`. That is exactly right for the **orphan-cleanup** file (it consults no
git), and it is how the PRE-FIX red was reproduced without reverting the working tree.

⚠️ **It is NOT valid for the full suite.** A first full-suite attempt from a `git archive` copy gave
**705 tests / 684 pass / 19 fail** — every failure in `structure-check` / `structure-manifest` /
`structure-repair`, all reading `fatal: not a git repository`, because `git archive` carries no `.git`.
**Discriminated, not assumed:** the same 19 failed identically with a normal `TMPDIR`, so they are a
copy artifact and **not** a case-sensitivity finding. Every full-suite number below therefore comes
from the **real repo** with `TMPDIR` pointed at the case-sensitive volume — which is the configuration
that matters, since every project dir and every `copyClaude()` copy is created under `TMPDIR`.

### Results — six required checks

| # | Check | Result |
|---|---|---|
| 1 | PRE-FIX red on case-sensitive FS | **PASS — red reproduced exactly** |
| 2 | Unit suite green on case-sensitive FS, fix applied | **PASS — 709/709, exit 0** |
| 3 | `prove-red.sh` **measured** green on case-sensitive FS | **PASS — exit 0, measured not inferred** |
| 4 | Plain macOS run green | **PASS — 709/709 + hard gate, `npm test` exit 0** |
| 5 | `git diff --stat` — one source path | **PASS — only `test/orphan-cleanup.test.js`** |
| 6 | Judgement on the build worker's autonomous call | **Correct, and necessary — see below** |

**1 — the red, on the PRE-FIX tree** (`git archive HEAD` → `/Volumes/CS0283/prefix`, working tree never
reverted; `diff` against the working-tree file confirmed the old content). Exit code **1**, 23 tests /
22 pass / **1 fail**:

```
test at test/orphan-cleanup.test.js:264:3
✖ the never-delete-lockdown-state guard is case-insensitive
  AssertionError: The input did not match the regular expression /lockdown state/. Input: ''
    actual: '',  expected: /lockdown state/,  operator: 'match'
```

Byte-for-byte the CI failure. **The diagnosis is confirmed.**

**2 — unit suite, case-sensitive, fix applied:** `tests 709 / pass 709 / fail 0 / skipped 0`,
`duration_ms 45335`, **exit code 0**. Target test green.

**3 — `prove-red.sh`, case-sensitive: MEASURED, exit code 0.** The honesty flag carried from the
diagnosis (plan §Verification 3 / brief §Notes) is now **discharged**. No skip injection was needed —
the fix removes the failure, so the script runs clean. Baselines `0a`–`0i` all green (`0a` and `0b`
were the two previously red); mutations 1–15 each red at their named assertion;
`✓ hard gate PASSED`.

**4 — plain macOS, `npm test` (both halves), default `TMPDIR`:** `tests 709 / pass 709 / fail 0`,
prove-red `✓ hard gate PASSED`, **exit code 0**. No platform was traded for the other.

**5 — `git diff --stat`:** `test/orphan-cleanup.test.js | 27 +++++-` and
`ai-agents/sprints/sprint-5.md | 32 +++++` (the driver's, pre-existing). Task folder is untracked.
**No other path.** `claude/fkit-claude-init.sh` verified byte-identical to HEAD
(`efdb56b1446cc053da8ddc18bf992812fea33ed6778d33ba27ee6a5969f6028a` both sides) — the plan's ⛔ bound
held.

### 6 — the build worker's autonomous call: CORRECT, and stronger than it claimed

Judged by mutation on **scratch copies only** (`claude/fkit-claude-init.sh` in the repo never edited).

| Mutant (scratch) | Filesystem | Outcome |
|---|---|---|
| **A** — lockdown guard disabled (`*settings*` → never-matching glob) | case-sensitive | **RED**, at `/lockdown state/` (:292) |
| **B** — guard **and** reference gate disabled | case-sensitive | **RED**, at the survival assertion (:290) |
| **C** — the exact C5 regression (lowercasing removed) | case-sensitive | **RED — only at the worker's assertion (:296)** |
| **D** — mutant C, worker's assertion deleted | case-sensitive | **GREEN 23/23, exit 0 — FALSE PASS** |
| **D** — mutant C, worker's assertion deleted | plain macOS | **GREEN 23/23, exit 0 — FALSE PASS** |
| **E** — mutant C against the PRE-widening single-line test | plain macOS | **RED** |

**Verdict: the assertion genuinely prevents a false pass, and it is not optional.** Mutant C is the
very hazard the test exists to catch — the guard defeated by case. Under it, `.Fkit/Settings` is
refused as *"still referenced in fkit's own sources"* (the reference gate, the wrong reason) while
`.fkit/settings` is refused as lockdown state — so the loose `/lockdown state/` still finds its
substring **from the other line** and passes. Rows D vs E are the finding that matters: the
owner-ruled widening, on its own, would have **destroyed** a detection the pre-widening test had
(E red → D green), on **both** filesystems. The worker's per-line assertion is the sole thing that
restores it and generalizes it to Linux. Had it not been added, Edit 2 would have shipped a test
weaker than the one it replaced.

**Coupling: acceptable.** Asserting refusal wording is the suite's established practice (~15 sites:
`/still referenced/`, `/absolute path/`, `/symlink/`, `/could not be run/`, and `:204` already asserts
that a refusal *names* a specific file). A looser per-line form would still have to name the reason to
distinguish mutant C, so little is bought by loosening.

⚠️ **One correction to the worker's own flag.** It wrote that the exact string *"is already asserted on
elsewhere in this suite, so the coupling is not new."* Measured: the **full sentence** `— refused: fkit
will never delete lockdown state` appears **only** at `test/orphan-cleanup.test.js:296` (the new
assertion) and `claude/fkit-claude-init.sh:746`. Only the fragment `/lockdown state/` was asserted
before. The *practice* is established; this exact full-sentence coupling is **new in degree**. The
substantive judgement is unaffected — and the measurement makes the case for keeping it stronger, not
weaker.

### ⚠️ Finding — the plan's stated rationale for Edit 2 is not achieved

Plan §Edit 2: *"With both lines present, on either platform a line names the real lockdown state, so
the survival assertion is load-bearing everywhere."* **Measured false.** Mutant A breaks the lockdown
guard outright and `assert.ok(existsSync(.fkit/settings/coder.json))` **still passes** — because
`.fkit/settings` is independently refused by the reference gate. That gate is structural, not
incidental: `claude/fkit-claude.sh:311-313` creates `.fkit/settings/<role>.json`, so the path is
permanently referenced in fkit's own sources and `orphan_refs` will always return a hit. Only mutant B
— guard **and** reference gate down together — makes the survival assertion fire.

So the survival assertion remains **non-load-bearing under any single fault**, on either filesystem;
the residual vacuity the brief recorded is narrowed, not removed. **This does not make the test
vacuous** — the announcement assertion and the per-line assertion both bite, as rows A and C show, and
the test is demonstrably non-vacuous overall. It means the *justification* written for the widening is
wrong, while the widening's actual value comes from somewhere else: it is what let the per-line
assertion pin the refusal reason. **Recorded for the reviewer; no code change made — nothing here is
broken, and re-scoping is not a verify worker's call.**

### Bounds honoured

No commit, no push, no task-file move, no `ai-agents/wiki-vault/` write, no `plan.md` re-authoring, no
edit to `claude/fkit-claude-init.sh` (hash-verified). All mutants lived on the scratch volume, which
was detached and deleted. **CI remains inferred, not measured** — this loop does not push, and no
GitHub Actions run ID was observed.

## Process-review worker, 2026-08-13

Spawned by `/fkit-sprint-ship-loop` under the declared-approval marker. Bounded unit of work: apply the
`fkit-process-stateful-review` method to `review.md` findings R1–R5. Plan pointer re-checked on arrival:
`git hash-object plan.md` = `e2a6efdf74009d19c27f38da75ed69ac76165f32`, 7985 bytes — matches the spawn
prompt. (Self-computed and self-reported; no hook verifies it for 0283 until 0204's carry-check lands.)

**Every finding independently re-verified against the code before any edit** — the reviewer's and the
verify worker's measurements were treated as claims, not as facts. Verdicts, evidence, and the
line-number shift are recorded in `review.md`'s *Coder response*. Ledger `Status:` set to `closed-out`.

🚨 **Codex's closing advice was NOT followed.** *"Remove the redundant broad assertion, loosen the
per-line matcher"* is, taken together, exactly the M2 mutant — a silent false pass at a clean 23/23 on
both filesystems with the C5 regression live. Per ADR-042 that advice was reasoning-only; measurement
contradicts it. Both assertions are byte-unchanged and are now protected in the source as well as the
ledger.

**Change surface this round: `test/orphan-cleanup.test.js`, comments only.** Verified mechanically —
`git diff` of the file with comment lines filtered out shows only the build worker's three earlier
edits, and nothing of mine. No product change; `claude/fkit-claude-init.sh` re-verified byte-identical
to HEAD (`efdb56b1446cc053da8ddc18bf992812fea33ed6778d33ba27ee6a5969f6028a`, `git diff -- claude/`
empty). No commit, no push, no task-file move, no `plan.md` re-authoring, no `ai-agents/wiki-vault/`
write. Mutants lived only on a scratch copy of the tree; the case-sensitive volume was detached and
deleted.

### Decision log — fixes applied and calls made without asking

Three entries. All three execute owner rulings relayed in the spawn prompt; **no judgement call was
made unilaterally, and no `NEEDS-DECISION` arose.**

1. **Corrected the widening's false rationale in the source comment** (`test/orphan-cleanup.test.js`,
   the item-2 clause, pre-edit `:276-278` → now `:279-287`).
   - *Which finding it answers:* **R2** — the clause *"list the REAL `.fkit/settings` alongside it, so
     the survival assertion bites everywhere"* is measured FALSE.
   - *What changed:* comment text only. It now says the second line makes `.fkit/settings` a deletion
     **candidate** everywhere, but the survival assertion still cannot fire under any single fault,
     because `claude/fkit-claude.sh:311-312` writes `.fkit/settings/<role>.json` on every launch so
     `orphan_refs` refuses the path independently — remove the whole `*settings*` guard and `coder.json`
     still survives; the assertion fires only when **both** gates are down. It then states the line's
     real value (the lowercase **control** the per-line assertion needs) and that the per-line assertion
     is what carries the test. C5 history kept, not deleted; not overstated in the other direction —
     the survival assertion is described as narrowed, not useless.
   - *Why it qualified:* **owner-ruled** 2026-08-13, *"Correct the comment too (Recommended)"*, taken
     after the review. In-plan (the plan's Edit 3 already owns this comment), mechanical, localized, and
     zero behavioural risk. I re-verified the disproof myself against
     `claude/fkit-claude.sh:305-317` and `claude/fkit-claude-init.sh:640-648` (`orphan_refs` greps `-i`
     over fkit's own sources) before writing it.
   - ⚠️ *Note for the record:* this ruling **reverses one clause** of the R2 residual the reviewer had
     already written (which listed re-wording the comment among its *rejected* alternatives). The
     residual is amended in `review.md` with the original text preserved and the reversal marked, so
     the next round cannot read the superseded clause as license to revert.
2. **Corrected the "no stat" parenthetical** (pre-edit `:267-268` → now `:267-270`).
   - *Which finding it answers:* **R5**.
   - *What changed:* comment text only — *"The refusal itself is filesystem-independent (`tr` + a glob,
     no stat)"* → *"The refusal **DECISION** is filesystem-independent — `tr` plus a glob over the
     line's TEXT, not a lookup on disk"*, naming the two stats that do happen and why neither changes
     the verdict.
   - *Why it qualified:* the ruling was *"correct the wording **if it is genuinely inaccurate** —
     verify before touching"*, so I verified rather than assumed: `orphan_contained`
     (`claude/fkit-claude-init.sh:665-686`) runs one `-L` per path component and is invoked at `:726`
     **before** the guard, and `exists` is computed by `-e`/`-L` at `:734-735`, also before the
     `*settings*` case at `:742-743`. "No stat" is inaccurate as written; the intended point (the match
     is text work) is true and is preserved. Mechanical, localized, in-plan, zero behavioural risk.
3. **Added a ⛔ warning comment above the per-line assertion loop** (now `:303-310`).
   - *Which finding it answers:* **R1**, and the standing ⛔ against loosening it.
   - *What changed:* comment only — names it the sole detector of the C5 regression, states the measured
     M2 outcome (delete it → clean 23/23 on both filesystems with the guard defeated), sets the floor
     any replacement must clear (**name the reason AND bind it to the line**), records the coupling with
     the broad `/lockdown state/` match above it, and says when it is *expected* to go red.
   - *Why it qualified:* **owner-ruled** *"Ledger note is enough (Recommended)"*, which explicitly
     allowed a short warning next to the assertion. ⛔ **No meta-test / guard-for-the-guard was built**,
     per that ruling. Comment only, zero behavioural risk.

**No obvious-winner calls beyond the above. No frontier-moves made** — R4 was *classified* as a frontier
and left **unchanged**. Nothing outside the approved plan and the relayed rulings was attempted.
**R4 required no edit at all**, and none was made.

### Re-proof after touching comments near the per-line assertion

Required because comments adjacent to the detector changed. **A comment-only change should not affect
the mutant — proved, not assumed.**

Mutant **M1** = the C5 regression, `lc="$(printf '%s' "$line" | tr '[:upper:]' '[:lower:]')"` →
`lc="$line"`, applied to a **scratch copy** of `claude/` + `test/` (repo never edited; hash re-checked
after).

| Run | Filesystem | Exit | Result |
|---|---|---|---|
| M1, post-edit test | plain macOS (default `TMPDIR`) | **1** | **RED** — 23/22/1, fails at the per-line assertion |
| M1, post-edit test | Case-sensitive APFS sparse image, `TMPDIR` on volume | **1** | **RED** — 23/22/1, same assertion |
| Unmutated target test | Case-sensitive APFS | **0** | **GREEN 23/23** |
| `npm test`, real repo | plain macOS | **0** | 709 tests / 709 pass / 0 fail / 0 skipped; `✓ hard gate PASSED` |

Case-sensitivity proven before use — `.Fkit` and `.fkit` coexisted as distinct directories on the
volume; `diskutil` reported `File System Personality: Case-sensitive APFS`.

Both M1 failures print the M2 mechanism verbatim: `.Fkit/Settings — refused: still referenced in fkit's
own sources` (the wrong reason, via `orphan_refs`' `-i` grep) alongside `.fkit/settings — refused: fkit
will never delete lockdown state`. **The broad `/lockdown state/` match passed in both runs** — direct
first-hand confirmation of both R1 (the per-line assertion is the sole detector) and R4 (the broad match
is a second layer for a *different* fault, not a substitute).

`npm test` exit code captured **without a pipe** (`npm test > file 2>&1; echo $?`).

⚠️ **CI remains inferred, not measured.** This loop does not push and no GitHub Actions run ID was
observed, so the original Linux/CI red is not confirmed fixed by observation.

## Comment-fix worker (review round 2), 2026-08-13

Spawned by `/fkit-sprint-ship-loop` under the declared-approval marker (owner approved `plan.md`
2026-08-13 via `AskUserQuestion` in the driver session). Bounded unit of work: the reviewer's round-2
findings F1–F3 — factual corrections to the **comment text only** in `test/orphan-cleanup.test.js`.

Plan pointer re-checked on arrival: `git hash-object plan.md` =
`e2a6efdf74009d19c27f38da75ed69ac76165f32`, 7985 bytes — matches the spawn prompt. (Self-computed and
self-reported; no hook verifies it for 0283 until 0204's carry-check lands.)

**Every finding re-measured first-hand before any text was written.** This is the third round in which
a sentence in this comment has been contradicted by measurement, so no claim below rests on the
reviewer's account or on my own earlier text. **All three findings verified CORRECT** — and F1 showed
my own previous sentence was not merely imprecise but **backwards**.

**Change surface: `test/orphan-cleanup.test.js`, comments only.** Proved mechanically, not asserted:
both the pre-edit and post-edit files stripped of `^\s*//` lines and `diff`ed — the non-comment
projections are **IDENTICAL**, and all 25 changed lines are `//` comments. No assertion, fixture,
`mkdirSync` or `orphan-targets` byte moved. No product change; `claude/fkit-claude-init.sh`
re-verified byte-identical to HEAD (`efdb56b1446cc053da8ddc18bf992812fea33ed6778d33ba27ee6a5969f6028a`,
`git diff -- claude/` empty). No commit, no push, no task-file move, no `plan.md` re-authoring, no
`ai-agents/wiki-vault/` write. No meta-test built (owner ruling stands).

### Decision log — fixes applied and calls made without asking

Three entries. All three execute reviewer findings I independently confirmed by measurement; **no
judgement call was made unilaterally, and no `NEEDS-DECISION` arose.**

1. **Rewrote the "control line" clause** (pre-edit `:285-287` → now `:290-299`).
   - *Which finding it answers:* **F1** — the clause claimed the control line is *"what lets the
     per-line assertion tell 'refused AS lockdown state' apart from 'refused for some other reason'"*.
   - *What changed:* comment text only. It now states the measured mechanism: the per-line assertion's
     discriminating power is **intrinsic** (it pins the reason **to** the line); with the cased line
     alone and no control, that assertion **still reds** under the C5 regression **and so does** the
     broad `/lockdown state/` match; what the control line measurably does is supply a lowercase line
     refused as lockdown state on either filesystem, which is **why the broad match stops detecting
     C5** and why the per-line assertion is left the **sole** detector.
   - *Why it qualified:* verified-`CORRECT` by my own measurement (below), mechanical, localized,
     comment-only, in-plan (the plan's Edit 3 owns this comment), zero behavioural risk.
   - *Measurement:* C5 regression applied to a **scratch** tree copy; the harness replicated in a small
     script so **both** assertions could be evaluated against the same stderr instead of stopping at
     the first red. Cased line only → stderr's sole refusal is
     `.Fkit/Settings — refused: still referenced in fkit's own sources`; broad match **RED**, per-line
     **RED**. Shipped two-line fixture → the control line adds
     `.fkit/settings — refused: fkit will never delete lockdown state`; broad match **PASS**, per-line
     **RED**. ⚠️ **The widening itself was not touched and is not in question** — only its stated
     reason.
2. **Corrected *"Neither can change the verdict"*** (pre-edit `:270` → now `:267-272`).
   - *Which finding it answers:* **F2**.
   - *What changed:* comment text only → *"Neither can turn a refusal into a deletion"* (the reviewer's
     suggested floor), plus the measured counter-case it was hiding: the two stats **can** change the
     refusal **reason**.
   - *Why it qualified:* verified-`CORRECT` by measurement, mechanical, localized, comment-only,
     in-plan, zero behavioural risk.
   - *Measurement:* guard **intact** (unmutated tree), `.fkit` made a symlink to a sibling real
     directory, `orphan-targets` = `.fkit/settings`. Rendered refusal:
     `.fkit/settings — refused: '.fkit' is a symlink — fkit will not delete through one`;
     `/lockdown state/` **absent from stderr entirely**; `coder.json` still on disk. Real-directory
     control on the same tree renders the lockdown-state sentence. Mechanism confirmed by reading —
     `orphan_contained` is called at `claude/fkit-claude-init.sh:726`, **before** the `*settings*` case
     at `:742-743`.
3. **Tightened the ⛔ floor to "in one rendered line"** (pre-edit `:306-307` → now `:318-322`), and
   added a matching additive note under the R1/R3 residual in `review.md`.
   - *Which finding it answers:* **F3** — the floor was a correct minimum but **not sufficient**.
   - *What changed:* comment text only, plus one clearly-marked additive blockquote in the ledger's
     residual (the reviewer's residual text itself was **not** rewritten). The floor now reads *"name
     the refusal reason AND bind it to the line — IN ONE RENDERED LINE"*, with the measured reason
     stated inline.
   - *Why it qualified:* verified-`CORRECT` by measurement, mechanical, localized, comment-only,
     in-plan, zero behavioural risk. The ledger note is judgement I am recording rather than burying:
     leaving the **shorter, insufficient** floor in the residual would let a future round cite the
     ledger as the real bar and re-open exactly the M2 hole — so the correction goes where a future
     round will read it. Additive only; nothing reviewer-owned was altered.
   - *Measurement:* the loop body replaced on the C5-regressed **scratch** tree with a regex meeting
     the old floor literally but allowed to span rendered lines
     (`new RegExp(`${esc}[\s\S]*refused: fkit will never delete lockdown state`)`): **23 tests / 23
     pass / 0 fail, exit 0 — M2 reproduced by another route.** Probe discarded; the shipped loop is
     byte-unchanged.

**No obvious-winner calls beyond the above. No frontier-moves.** Nothing outside the approved plan and
the relayed findings was attempted. ⛔ The per-line assertion and the broad `/lockdown state/` match
are both **byte-unchanged**.

### Re-proofs after the edit

| Run | Tree | Exit | Result |
|---|---|---|---|
| M1 — C5 regression, **post-edit** test | scratch copy, plain macOS | **1** | **RED — 23/22/1, sole red at the per-line assertion** (now `:327`) |
| Unmutated control, post-edit test | clean scratch copy | **0** | **GREEN 23/23** |
| `npm test`, real repo | plain macOS | **0** | `tests 709 / pass 709 / fail 0 / skipped 0`; `✓ hard gate PASSED` |

`npm test` exit code captured **without a pipe** (`npm test > file 2>&1; echo $?`).
`git diff --stat`: `test/orphan-cleanup.test.js` only (plus `ai-agents/sprints/sprint-5.md`, the
driver's, pre-existing).

### Flagged, deliberately NOT changed

Post-edit `:293-295` still reads *"a `*settings*` line — however cased, **whatever it resolves to** —
is refused FOR BEING LOCKDOWN STATE"*. F2's symlink case is one resolution where that is false. The
sentence is scoped to what this test's fixture proves, the reviewer's final factual check did not flag
it, and re-touching unflagged text is scope creep — **recorded here rather than decided by me.**

⚠️ **Not measured, stated as such.** (a) **CI** — this loop does not push and no GitHub Actions run ID
was observed; the Linux/CI green remains **inferred**. (b) **The case-sensitive volume was not
remounted this round** — filesystem coverage here is case-INSENSITIVE macOS only. A comment-only change
cannot alter filesystem behaviour, and the post-edit M1 red was re-proved on macOS, but the comment's
*both-filesystems* wording rests on the earlier rounds' measurements, not on a re-run here.

---

## Comment-fix worker (review round 3 — FINAL comment pass), 2026-08-13

Bounded spawn from the `fkit lead` session under the sprint-loop declared-approval marker. Scope: the
**one** clause flagged by me last round and ruled on by the owner. Comment-only.

**Owner ruling relayed by the driver** (`AskUserQuestion`, 2026-08-13), verbatim option label:
*"Fix it, then final-check once (Recommended)"*.

### What changed

`test/orphan-cleanup.test.js` — the summary clause below the C5 block. Pre-edit `:300-302` (three
lines) → post-edit `:300-307` (eight lines). Nothing else in the repo.

**Before:**

```
  // Proved on both kinds of filesystem: a `*settings*` line — however cased, whatever it resolves to —
  // is refused FOR BEING LOCKDOWN STATE (not incidentally, by containment or by naming nothing), is
  // announced, and the lockdown state is still on disk afterwards.
```

**After:**

```
  // Proved on both kinds of filesystem, for the two lines this test seeds — both of which exist on disk
  // with no symlink anywhere in their parent chain: a `*settings*` line, however cased, is refused FOR
  // BEING LOCKDOWN STATE (named as that, on its own line — not refused incidentally), is announced, and
  // the lockdown state is still on disk afterwards. ⚠️ Those two conditions are the claim's limits, not
  // decoration — earlier text spells out both exceptions and both are measured: symlink a parent and
  // that line is refused by containment first, with no lockdown-state sentence for it at all; point a
  // `*settings*` line at nothing and it is still never deleted, but nothing is announced for it either.
  // Neither is a hole — the deletion is refused either way — and neither is what this test measures.
```

The clause was longer after the fix. That was deliberate per the instruction: the accurate statement
needed two named preconditions, and brevity was not worth a fourth false claim.

### Decision log — fixes applied and calls made without asking

1. **Corrected the flagged clause.**
   - *Which finding it answers:* my own **round-2 flag** (`review.md` → *One thing I noticed and did NOT
     change*), promoted to a fix by the owner ruling above.
   - *What changed:* comment text only, as quoted above. Replaced the universal *"whatever it resolves
     to"* with the two measured preconditions (the line exists; no symlink in its parent chain), and
     replaced the parenthetical *"(not incidentally, by containment or by naming nothing)"* — which read
     as "it is never those" when those are exactly the two exceptions — with a line-scoped statement
     plus an explicit, non-alarming note that neither exception is a hole.
   - *Why it qualified:* **verified CORRECT by measurement this round** (table below), **mechanical and
     localized** (one comment block, zero executable lines), and **inside the approved plan** — the
     owner ruled on this exact clause. Not an obvious-winner judgement call; a measured correction.

2. **Left "however cased" standing — an obvious-winner call within the ruling's intent.**
   - *Why:* only *"whatever it resolves to"* was measured false. *"however cased"* is a claim about the
     guard's `tr`-plus-glob at `claude/fkit-claude-init.sh:742-744`, already established by the
     paragraph above it, and the fixture exercises two casings. Widening the edit to unflagged, true
     text would have been scope creep in the direction the last three rounds kept getting wrong.

3. **Kept the F3 floor correction in the shared *residuals* block**, per the driver's explicit ruling
   ("KEEP IT"). No further change to it; reviewer text still untouched.

**No frontier-moves. No `NEEDS-DECISION`. Nothing outside the ruling was attempted.** ⛔ The per-line
assertion and the broad `/lockdown state/` match are both **byte-unchanged**, as is every fixture line
and `orphan-targets`.

### Measurement backing the new wording — taken THIS round

Unmutated scratch copy of `claude/`; project = the test's own `makeResidueProject()` fixture; macOS
case-insensitive default `TMPDIR`. Driver script: `scratchpad/measure.mjs` (scratch only, not committed).

| # | Fixture | Refusal text observed | `/lockdown state/` present | `coder.json` |
|---|---|---|---|---|
| **M-A** | `.fkit` replaced by a **symlink** to a sibling real dir; list = `.Fkit/Settings` + `.fkit/settings` | both lines: `— refused: '<seg>' is a symlink — fkit will not delete through one` | **false** | survives |
| **M-B** | list = `.nowhere/settings` (names nothing) | *(no refusal line at all — silent)* | **false** | survives |
| **M-C** | the test's fixture **exactly** (baseline) | both lines: `— refused: fkit will never delete lockdown state` | **true** | survives |

Structural confirmation, read this round in `claude/fkit-claude-init.sh`: `orphan_contained` is called
at `:727`, **before** the `*settings*` case at `:742-750`, and refuses a symlinked segment at `:680`;
the lockdown refusal is emitted only inside `if [ "$exists" = 1 ]` at `:745`.

⚠️ **Stated precisely, not overstated.** M-A's *"absent from stderr entirely"* is a **macOS artefact** —
both list lines collapse onto the single symlinked `.fkit`. On a case-sensitive filesystem
`.Fkit/Settings` is a distinct real directory and would still be refused as lockdown state, so the
string would be present there. The comment's new wording is therefore scoped to **that line**, not to
stderr as a whole, which holds on both kinds of filesystem. And in the other direction: **neither
exception is a defect** — the deletion is refused either way and the lockdown state survives in all
three rows. This is a scoping correction to a comment, not an alarm.

### Re-proofs after the edit

| Run | Tree | Exit | Result |
|---|---|---|---|
| `//`-stripped projection diff, **pre-edit vs post-edit working tree** | real repo | 0 | **IDENTICAL — no executable line changed this round** |
| **M1** — C5 regression (`:742` lowercasing removed), post-edit test | scratch copy, plain macOS | **1** | **RED — `tests 23 / pass 22 / fail 1`, sole red at the per-line assertion** |
| **Full `npm test`**, real repo | plain macOS | **0** | `tests 709 / pass 709 / fail 0 / cancelled 0 / skipped 0`; `✓ hard gate PASSED` (all 15 `prove-red` mutants red) |

`npm test` exit code captured **without a pipe** (`npm test > file 2>&1; echo $?` → `REAL_EXIT=0`).

The projection diff was taken against the **pre-edit working tree**, reconstructed by inverting this
round's single comment replacement — not against `HEAD`, which still carries the whole task's
executable change from earlier rounds and would have shown it misleadingly.

### Not measured, stated as such

- **CI** — nothing was pushed and no GitHub Actions run was observed. The Linux/CI green remains
  **inferred**, exactly as the previous two rounds recorded it.
- **The case-sensitive volume was not remounted this round.** Filesystem coverage here is
  case-INSENSITIVE macOS only. A comment-only change cannot alter filesystem behaviour and M1 was
  re-proved red on macOS, but the comment's *both-filesystems* wording still rests on the earlier
  rounds' case-sensitive APFS measurements, not on a re-run here.
- **The `plan.md` blob pointer in the spawn prompt was not verified** — the driver flagged it as
  unverified and no hook checks it for 0283. I did not re-author or read-verify `plan.md`.
