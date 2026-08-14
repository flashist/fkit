# Worklog — 0288: fix the post-release verify line's failing and false-green cases

**Built 2026-08-14** by a spawned `fkit-coder` (the `/fkit-sprint-ship-loop` **Build worker**), under
the loop's declared-approval marker: the owner approved `plan.md` live via `AskUserQuestion` in the
driver's `fkit lead` session, answering all three open questions (**OQ1 (A)**, **OQ2 (A)**,
**OQ3 (A)**). The approved plan is both the standing approval and the scope boundary.

⛔ **No commit, no push, no staging. No task-file move, no `## Status` change.** `plan.md` untouched.

---

## Change surface — exactly three files

| file | state |
|---|---|
| `bin/release.mjs` | modified — **summary block only** (was `:271-277`) |
| `test/release-summary.test.js` | **new** |
| `test/prove-red.sh` | modified — header index, two helpers, baseline `0k`, mutations 18–22 |

⛔ No `package.json`, no `VERSION`, nothing under `ai-agents/wiki-vault/`. `:272`'s `if (dryRun)` arm
is behaviourally unchanged and nothing above the summary block was edited — no bump, tag, push or
dry-run logic, and the `:12-14` header comment is untouched.

**Real-repo integrity, before and after** (unchanged throughout):
`HEAD c23e322e0d159c7f00544b5d999bee6da7ce2eb2` · local tag count `32` · `VERSION 0.2.1` ·
`git status --porcelain` for my surface = `M bin/release.mjs`, `M test/prove-red.sh`,
`?? test/release-summary.test.js`.

**Every reproduction ran against a throwaway clone with a LOCAL BARE origin.** Nothing was ever pushed
to `flashist/fkit`; no tag was created, pushed or deleted on the real origin. The seal is structural,
not intentional: `release.mjs` derives `KIT` as `resolve(__dirname, "..")`, so the copy under
`<fixture>/bin/` operates on the fixture, and `makeFixture()` **asserts** `git remote get-url origin`
resolves inside its own tmp dir before doing anything.

---

## What was measured, in build order

1. **N1 reproduced by execution first** (brief step 12.2) — it was the one finding that was
   source-confirmed but never run. It reproduced exactly: `main` pushed, tag never pushed, **nothing
   said about it**, printed check exits **2** silently. Post-state proved it: `origin/main` = HEAD,
   `git ls-remote --tags origin v0.1.0` empty.
2. **R1 reproduced on all three variants**, including `--no-tag` **alone** — the publishing case: it
   moved `origin/main` and still printed a verify for a tag it declined to create (exit 2).
3. **R2 reproduced** — printed check exits **0** while the tag peels to a commit that is not what the
   run pushed.
4. **R5 re-measured** — `0` / `2` / `128`, distinct; `128` prints its own `fatal:`. ⛔ The codes were
   never ambiguous; the defect is the **silence of the exit-2 case** alone, and only that was fixed.
5. **The plan's git measurements re-measured on the fixture** — a pattern arg suppresses the peeled
   line, so the peel must be asked for as `refs/tags/<tag>^{}`; that form returns the peeled commit,
   exit 0.

---

## Decision log — every call made without asking

The loop's standing approval covers a fix only when it is verified `CORRECT`, mechanical/localized and
**inside the approved plan**, or an obvious winner within the plan's intent. Six calls qualified.
**None was a frontier-move, a scope widening, or a behaviour change outside the plan.**

### D1 — `tagOnOrigin` made load-bearing; the last three branches reordered
- **Answers:** the plan's own **mutation 19**, which targets `tagOnOrigin`.
- **What changed:** the plan's literal branch order (`tagCreated` → `remoteTagExists` → `else`) never
  used `tagOnOrigin`, one of the three derived facts the plan declares. It was **dead code**, and a
  mutation against dead code is a **no-op** — prove-red's own guard would have failed the gate.
  Reordered to `!tagOnOrigin` (N1) → `tagCreated` (default) → `else` (R2).
- **Why it qualified:** obvious winner **within the plan's intent** — the plan declares the const and
  specifies the mutation against it. The states are identical and still total, and **the printed
  output of all seven paths is byte-identical either way**; only the order of the last three tests
  changes. Verified `CORRECT` by running all seven paths and all five mutations.

### D2 — one clause added to the R2 branch about lightweight tags
- **Answers:** the plan's own flagged risk (*"if the build finds it confusing, the printed prose gains
  one clause"*) — explicitly authorized latitude.
- **What changed:** added
  `(that peel exits 2 for a lightweight tag; this script only ever makes annotated ones)`.
- **Why it qualified:** in-plan and measured, not assumed — a lightweight tag has no `^{}` ref and the
  peel exits 2 silently; `release.mjs:260` only ever runs `git tag -a`, so this reaches foreign tags
  only.

### D3 — mutation 18 scoped to the summary block (awk), not a plain `sed`
- **Answers:** a real hazard found on disk, not predicted by the plan.
- **What changed:** `} else if (!doTag) {` occurs **twice** in `bin/release.mjs` — once in the
  **execute** section (the skip-tag step) and once in the summary. A plain `sed` hits the execute one,
  mutating the tag logic this task is **fenced away from** and proving nothing about the summary. The
  awk arms only after the `// --- summary ---` marker, and a post-condition asserts the mutant retains
  exactly one `} else if (!doTag) {`.
- **Why it qualified:** mechanical and localized; it implements the plan's stated mutation correctly
  rather than changing it.

### D4 — mutations 19/20/21 use getline-from-file, not `sed`
- **Answers:** this file's own documented **mutation-14 rule**.
- **What changed:** mutation 19's replacement contains `&&`, and in a `sed` replacement `&` means *the
  whole match* — a sed would splice the line into itself, producing a syntax error rather than a
  mutant: every test reds, the named-assertion grep still passes, and the gate reports a broken file as
  a successful catch. 20 and 21 carry backticks, `${tag}`, `^{}` and quotes with the same exposure.
- **Why it qualified:** mechanical, and it follows a convention the file already states in its header.

### D5 — the recursion-seal comment written from measurement, correcting the plan
- **Answers:** the plan's claim that omitting `--no-test` would recurse **unboundedly**.
- **What changed:** ⚠️ **Measured, and the plan's claim does not hold for this fixture shape:** the
  fixture's `package.json` has no `test` script, so `npm test` there **aborts** —
  `npm error Missing script: "test"`, `release.mjs` exits **1**. The `--no-test` assertion is **kept**
  (cost: one line; it is genuinely load-bearing for any future fixture copying a real `package.json`),
  but its comment now records the measurement instead of repeating the unmeasured claim.
- **Why it qualified:** reporting faithfully is not a design change; the seal itself is unchanged.

### D6 — mutation 22's double red documented rather than engineered away
- **What changed:** mutation 22 reds **both** `0288/default-released` and `0288/failure-speaks`.
  `0288/failure-speaks` executes the command the **default path** printed, so a mutation that stops the
  default path printing it necessarily takes both. Recorded in both files rather than papered over.
- **Why it qualified:** the gate's contract is *reds its NAMED assertion*, which holds. Mutations 18–21
  each leave `0288/default-released` green — that isolation was **measured**, and is itself evidence
  the default branch is independent of the four fixes.

**Obvious-winner calls beyond the above: none. Fixes applied outside the approved plan: none.**

---

## Step-5 justification — the default path's printed output DID change

The brief's Context ⛔ (*"any remedy that changes what the default path prints … has failed"*) and its
verification step 5 (*"if the default output changed at all, say so out loud and justify it"*) cannot
both hold once R5 is answered where a real release cut runs. **The owner ruled step 5 governs**
(2026-08-14, verbatim label *"(A) Fix R5 on the default path too (Recommended)"*). So, out loud:

- **The headline is byte-identical**: `✓ Released v0.1.1`.
- **The verify command's success behaviour is byte-identical**: git prints the sha and exits **0**; the
  `||` group never runs. Executed and confirmed in the fixture.
- **What changed** is a failure branch appended to the printed command:
  `|| { echo "✗ <tag> not confirmed on origin (git exit $?)"; false; }`. The line is longer.
- **Exit-status semantics change on failure only**: today `2` / `128`, now `1` in both cases — with
  **git's real code printed in the message** and git's own `fatal:` still on stderr. Information is
  **relocated from `$?` to the visible output**, not lost, and `$?` stays usable as pass/fail. ⛔ This
  does **not** presume the codes were ambiguous; they are distinct and are printed as such.

**Why that is correct under the ruling:** R5 is *"the failing case must not be silent"*, and the
default path is the only path most maintainers ever paste. Answering R5 anywhere else would leave it
unanswered where it matters.

---

## Residuals and what is NOT covered — say these in the close

1. **N1's recovery gap is ACCEPTED, NOT FIXED** (owner-ruled 2026-08-13, *"Report truthfully only —
   stay inside the fence"*). After `0288`, `--no-bump` **still cannot finish** a release whose tag is
   local-only — it **stops lying about it** and prints the by-hand `git push origin <tag>`. ⛔ Do not
   report N1 as *"recovery restored"*. `0288/local-only-tag` asserts the tag is **still absent from
   origin** afterwards: the fence, tested.
2. **`bin/release.mjs:12-14` still claims a `--no-bump` run is "idempotent", and that overstates it.**
   Skipping tag *creation* is idempotent; skipping the tag *push* is not — it leaves the release
   unfinished. ⛔ The header comment was deliberately **not** rewritten (out of scope: the task owns the
   summary block). The summary now contradicts the header truthfully at runtime; the comment remains
   overstated.
3. **Brief step 11, satisfied by naming rather than deleted.** The **pre-existing** suite still says
   nothing about this line — a green `npm test` from the tests that already existed is **not** coverage
   of this change. What covers it is the **new** `test/release-summary.test.js` (7 named assertions)
   and prove-red mutations **18–22**, each proven red at its named assertion.
4. **R4 (unquoted `${tag}`) is untouched** — owner-ruled *"Unactioned — pre-existing"*. The pre-existing
   line keeps its unquoted interpolation exactly. The single quotes on the **new** `'refs/tags/…^{}'`
   line are required for the command to run at all (`^` and `{}` are shell-special in zsh) and are
   **not** claimed as a security improvement — a tag containing `'` still breaks out, the same
   pre-existing exposure.
5. **Windows shells are not covered.** The printed commands are POSIX, as they already were.
6. **Lightweight foreign tags**: the printed peel exits 2 for a lightweight tag. `release.mjs` only
   creates annotated tags, so this reaches only a tag someone else made lightweight; the printed line
   now says so in one clause.
7. **Suite runtime cost exceeded the plan's estimate** — see below. Reported, not silently absorbed.

---

## `npm test` — green, and the MEASURED runtime cost

```
node --test test/*.test.js   tests 730   pass 730   fail 0   (duration_ms 152062)
bash test/prove-red.sh       ✓ hard gate PASSED — real + unmutated copy green;
                               each mutation reds its NAMED assertion.
exit 0
```

All five new mutations red at their named assertion; the new baseline `0k` is green.

### ⚠️ The runtime cost is roughly DOUBLE the plan's estimate — measured, both ends

| run | wall clock |
|---|---|
| baseline (pre-`0288` test surface restored: no `release-summary.test.js`, `prove-red.sh` at HEAD) | **10:19.42** |
| after (`0288` coverage in place) | **14:27.93** |
| **delta** | **+4 min 08 s** (~+40%) |

⚠️ **The plan estimated ~+1–2 min and the owner accepted OQ3(A) against that number. The real figure is
about twice it, and that is a fact the owner has not yet seen.** Both ends were measured on this
machine today by restoring the pre-`0288` test surface and re-running; the two runs report different
CPU saturation (121% vs 98%), so a little of the gap is machine noise rather than the change.

**Where the time goes — the plan's cost model missed one multiplier.** The plan counted six extra
release-suite runs (baseline `0k` + five mutants). But `run_suite()` executes
`node --test "$repo"/test/*.test.js` — **all** test files — and it is called four times (`0a`, `0b`,
mutation 2, mutation 15). Adding a test file therefore also lengthens those four runs, plus the main
`node --test` phase. So the new file is executed **eleven** times per `npm test`, not seven.

⛔ **I did not act on this.** Trimming mutations, or narrowing `run_suite`'s glob, would be a scope and
design change outside the approved plan, and OQ3 is the owner's call — they chose "accept all five"
and the correct response to a number that moved is to report it, not to re-decide it.

⚠️ **BOTH absolute numbers are inflated and should not be read as this machine's normal.**
`.github/workflows/test.yml:28` records `npm test` measured locally at **328 / 380 / 347 / 344 s**
(~5m30s–6m20s); my baseline measured **619 s** for the same pre-`0288` surface. **Two concurrent fkit
workers (tasks `0294` and `0292`) were running throughout both measurements**, so the absolute figures
carry their CPU load, and so does the delta. ✅ **The +40% ratio is the more transportable number than
the +4m08s.** Against the workflow's recorded ~350 s, a 40% increase lands near **~490 s**, comfortably
inside its `timeout-minutes: 20` (verified on disk, `:33`). ⛔ **A clean re-measure on an idle machine
is worth doing before anyone treats +4m08s as the real cost.**

---

## Review round 1 — decision log (fixes applied without asking)

Spawned by `/fkit-sprint-ship-loop` as its **Process-review worker**, under the loop's declared-approval
marker: the owner approved 0288's plan on 2026-08-14 and **ruled on every finding R1–R7** in the same
session. Each fix below is therefore applied under a **specific owner disposition**, not merely under
the standing plan approval. **Five calls; none was a frontier-move, a scope widening, or a change
outside the fences.** ⛔ **Every finding was independently re-verified before any edit — five of seven
by execution.** Nothing was returned as `NEEDS-DECISION`; the reviewer was correct on all seven.

### D7 — R1: branch 2 reads the measured tag state
- **Answers:** review finding **R1** (high). Owner disposition: *"(a) Consult the measured state
  (Recommended)"*.
- **What changed:** `bin/release.mjs` branch 2 (`!doPush`) replaced its `if (doTag)` two-way split with
  four sub-branches keyed on `tagCreated` / `remoteTagExists` / `localTagExists`. The
  `tagCreated` case is **byte-identical to before**; the two new cases state the true situation and
  print a recovery that works (or no tag command at all, when the tag is already on origin).
- **Why it qualified:** verified `CORRECT` by execution (both sub-cases reproduced pre-fix and
  re-measured post-fix), mechanical and localized to one branch of the block the plan owns, and
  **inside** the plan — the plan's own ⛔ at `:277-280` already forbade deriving this from flags; branch 2
  was the one place that violated it.

### D8 — R2: fixture pin + honest invariant comment
- **Answers:** review finding **R2** (high). Owner disposition: *"(a) Fix both sides (Recommended)"*.
- **What changed:** (a) `test/release-summary.test.js` `makeFixture()` pins `push.followTags=false`
  alongside the `gpgsign` pins; (b) the `:282-285` invariant comment in `bin/release.mjs` is replaced by
  a statement of what `tagOnOrigin` **assumes**, the measured exception, and why it is not closed here.
- **⚠️ Which half of "derivation or comment" I took, and why:** the **comment**. Making the derivation
  genuinely correct needs a post-push `git ls-remote` — a network round-trip on every release run —
  and the alternative (`--no-follow-tags` on the push at `:252`) is above `:271`, outside 0288's fence.
  The owner's ruling offered either. **The runtime inaccuracy therefore survives and is recorded as an
  accepted residual in `review.md`** — it is not silently closed.
- **Why it qualified:** verified `CORRECT` by execution, and **proven fixed under the failing config**
  (`GIT_CONFIG_GLOBAL` with `push.followTags=true`: 6/7 → 7/7). Both edits are localized and in-plan.

### D9 — R3: the peel command gets the speaking tail
- **Answers:** review finding **R3** (medium). Owner disposition: *"(a) Give it the speaking tail
  (Recommended)"*.
- **What changed:** `bin/release.mjs:343` gained
  `|| { echo "✗ could not resolve what ${tag} names on origin (git exit $?)"; false; }`, and the
  circular caveat below it was rewritten to say what actually happens for a lightweight tag.
- **⚠️ A distinct failure message was used deliberately** — **not** the default path's
  `not confirmed on origin`. prove-red **mutation 21**'s half-applied guard greps for that exact string
  surviving in the mutant; reusing it would have made mutation 21 report `MUTATION IS HALF-APPLIED` and
  **failed the gate**. The tail's *form* is what the disposition names, and the form is identical.
- **Why it qualified:** verified `CORRECT` by execution (silent exit 2 before; `✗ … (git exit 2)`,
  status 1 after; 128 still distinguishable), mechanical, in-plan. **This corrects a defect 0288 itself
  introduced**, which is why it is not a frontier-move.

### D10 — R4: fixture Seal 1 moved before the first push
- **Answers:** review finding **R4** (medium). Owner disposition: *"Action R4+R5"*.
- **What changed:** the Seal 1 assertions moved from after `git push -q origin main` to immediately
  after `git remote add origin`; the comment now says the ordering is what makes its claim true.
- **Why it qualified:** verified `CORRECT` by reading (the ordering is plainly visible), purely
  mechanical (a move, no logic change), and it makes an existing safety assertion do what it already
  claimed to do.

### D11 — R5: `git rev-parse ${branch}` at both sites
- **Answers:** review finding **R5** (low). Owner disposition: *"Action R4+R5"* — **both** `:318` and
  `:344`, the Claude pass having found the site Codex missed.
- **What changed:** `git rev-parse HEAD` → `git rev-parse ${branch}` in the N1 branch and the R2
  branch, each with a one-line comment saying why HEAD is wrong there.
- **⚠️ Branch 2 deliberately keeps HEAD** and says so in a comment: that branch pushed **nothing**, so
  the commit this run made is at HEAD, and `${branch}` would be the wrong reference there. The
  pre-existing `--branch` + `--no-push` mismatch this exposes is recorded as a residual, **not fixed** —
  it lives in the execute section, outside 0288's fence.
- **Why it qualified:** verified `CORRECT` by execution under `--branch other` (printed `HEAD`
  `fc29b8a6…` vs the actually-pushed `dc71b48f…`), one-token change at each site, in-plan.

### Not actioned, by owner ruling — R6 and R7
⛔ **No isolation check was added to `test/prove-red.sh`, and no mutation was added for
`0288/no-push` or `0288/dry-run`.** Both findings were independently verified as **CORRECT** and are
recorded in `review.md`'s *Accepted residuals* with re-raise conditions. ⛔ **No existing mutation was
edited** to accommodate any fix above — where a fix and a mutation gate collided (D9), the **fix** was
worded around the gate, not the gate around the fix.

### Round-1 re-verification

```
node --test test/*.test.js   tests 730   pass 730   fail 0   (duration_ms 92271)
bash test/prove-red.sh       ✓ hard gate PASSED — real + unmutated copy green;
                               each mutation reds its NAMED assertion.
npm test  225.48s user 538.93s system 126% cpu 10:03.04 total     EXIT=0
```

Mutations 18–22 each red at their named assertion; baseline `0k` (unmutated copy of the **modified**
`bin/release.mjs`) green. **R2 proven under `push.followTags=true`: 6/7 before, 7/7 after.**

⚠️ **10:03.04 vs the build's 14:27.93 is machine load, not a speed-up.** This round adds no test and no
mutation, so it cannot have shortened the suite; the build's measurement ran alongside two concurrent
fkit workers. **The owner's accepted +40% is not exceeded.** ⛔ A clean idle-machine re-measure is still
worth doing before any absolute figure here is trusted (the build's note on this stands).

⛔ **Change surface this round: `bin/release.mjs` + `test/release-summary.test.js` only.**
`test/prove-red.sh` **untouched** — no mutation was edited to accommodate a fix. No commit, no push, no
staging; no task-file move; no `## Status` change; `plan.md` untouched; nothing under
`ai-agents/wiki-vault/`. Nothing above `bin/release.mjs:271` was edited — the earliest changed line is
**284**, inside the summary block.

---

## Review round 2 — decision log (owner dispositions applied)

Round 2 raised three novel findings, **all low, none blocking** (reviewer verdict: *"✅ Ready to merge
— 0 open confirmed defects"*). The owner ruled on all three live via `AskUserQuestion` on 2026-08-14
and the driver relayed the verbatim labels. **Two edits were made. Neither changes behaviour** — one is
a source **comment**, one is **ledger prose**. ⛔ **No executable line was touched this round.**

### D12 — R8: the fixture-pin comment narrowed to what the pin actually does
**Answers:** R8 (round 2) — the comment at `test/release-summary.test.js` claimed the
`push.followTags` pin *"makes the suite measure git's documented DEFAULT instead of whatever the host
machine is configured to."*
**Owner ruling that authorized it:** verbatim label **"Fix the sentence (Recommended)"**.
**What changed:** that one sentence. It now says the pin makes **`push.followTags`** read git's
documented default here — **that ONE setting, not the fixture as a whole** — and names the known
remaining host dependency: a global `core.hooksPath` with a rejecting `pre-commit` still reds **all 7**
tests (measured by the reviewer; pre-existing, outside 0288's fence).
**Why the finding is correct:** confirmed by reading — the fixture writes exactly five keys
(`user.name`, `user.email`, `commit.gpgsign`, `tag.gpgsign`, `push.followTags`) and writes them
**repo-local**; nothing there isolates hooks. A per-setting pin cannot make *the suite* host-independent.
⛔ **Comment only. No behaviour change, and hook isolation was deliberately NOT added** — the owner
declined filing it separately; it is pre-existing and outside the fence.

### D13 — R10: the round-1 "silently disarmed" rationale corrected in `review.md`
**Answers:** R10 (round 2) — the *Coder response* section's second implementation note claimed that
reusing R3's wording *"would have **disarmed those gates silently**"* (mutations 20 and 21).
**Owner ruling that authorized it:** verbatim label **"Correct the record (Recommended)"**.
**What changed:** that clause now reads that it **would have mis-fired the mutation and failed the hard
gate loudly** — the surviving copy of the string trips the mutation's **half-applied guard**, so
`fail=1` and the gate reds. A dated round-2 correction note records the original wording, so the change
to the record is itself on the record.
**Why the finding is correct:** round 2 measured both hypotheticals; mutations 20 and 21 each carry a
half-applied guard grepping for a **surviving** `refs/tags/${tag}^{}` / `not confirmed on origin`. The
failure is **loud, not silent**. ⚠️ **The collision was real and avoiding it was still correct** — only
the stated consequence was wrong, and the correction says so rather than over-correcting into "there
was no problem".
⛔ Edited **only** the coder-owned section. *Reviewer findings* and the *Round 2* section were not
touched.

### Not actioned, by owner ruling — R9
**Owner ruling:** verbatim label **"Record as a residual (Recommended)"**. ⛔ **No guard was added and
`test/prove-red.sh` was NOT touched** — the owner explicitly declined reopening it. R9 is recorded in
`review.md`'s shared *Accepted residuals* with the owner's re-raise condition, *"if a second column-0
`} else if (tagCreated) {` is ever added"*. **Verified by the coder before being accepted:** mutation
22's `sed` is `s/^} else if (tagCreated) {$/…/` (column-0 anchored, unscoped); `bin/release.mjs` now has
**two** such lines — `:320` (two-space indent, added by R1's fix, survives only on that indent) and
`:351` (column 0, the real target). The block has the `cmp -s` no-op guard but **no** count or
wrong-target guard.

### Round-2 re-verification

```
npm test  ( = node --test test/*.test.js && bash test/prove-red.sh )
node --test   tests 730   suites 17   pass 730   fail 0   duration_ms 87361.318083
prove-red     0a-0k green; mutations 1-22 all red at their NAMED assertion
              ✓ hard gate PASSED — real + unmutated copy green
all seven 0288/* named assertions green (default-released, no-tag, no-push,
stale-origin-tag, local-only-tag, failure-speaks, dry-run)
real 600.20   user 224.18   sys 534.33   EXIT=0
```

⚠️ **Runtime is a measurement, not a speed-up.** 600.20s (10:00.20) — macOS 26.2, arm64, 14 cores,
node v24.13.0, git 2.50.1, **load average 8.72 / 9.96 / 10.95 at launch** (other work on the machine).
⛔ **This round adds no test and no mutation, so the suite cannot have got faster by merit.** The two
prior figures (build 14:27.93, round 1 10:03.04) both moved with machine load, and so does this one.
The only honest claim is that the owner's accepted +40% is not exceeded.

⚠️ **`bash test/prove-red.sh` was run as the second half of `npm test` — literally that command, from
`package.json`'s `test` script — not a second time standalone.** Its full output is above.

⛔ **Change surface this round: `test/release-summary.test.js` (comment only) + this task folder's
`review.md` and `worklog.md`.** `bin/release.mjs` **not edited this round** (its round-1 diff stands);
`test/prove-red.sh` **untouched**; no `package.json`, no `VERSION`. Repo integrity after the run:
`HEAD ce6bf54` unchanged, `VERSION 0.2.1` unchanged, 32 local tags (unchanged), no tag pushed. No
commit, no push, no staging; no task-file move; no `## Status` change; the ledger's `Status:` header
left as the **reviewer** set it (`in-review`); `plan.md` untouched; nothing under
`ai-agents/wiki-vault/`.
