# Review — 0288

Task: `ai-agents/tasks/done/0288-fix-the-post-release-verify-lines-failing-and-false-green-cases/brief.md`
File(s) under review: `bin/release.mjs` (summary block, `:271-346`), `test/release-summary.test.js`, `test/prove-red.sh`
Diff base: `c23e322..ce6bf54` (HEAD), restricted to the three files above
Status: closed-out — **converged (reviewer's call, round 2) and all findings disposed.**
R1–R5 verified fixed by execution. R6–R7 (round 1) and R8–R10 (round 2) are disposed under explicit
owner rulings and recorded below; **0 open confirmed defects**. Set to `closed-out` by the reviewer on
2026-08-14 after verifying the three round-2 dispositions landed — see *Round-2 dispositions — recorded*.

> **Round 1.** Reviewers run: **Claude** (this pass, with execution) + **Codex** via
> `codex exec --sandbox read-only` (**reasoning-only** per ADR-042 D1 — it executed nothing).
> Coverage is **complete**; neither reviewer was skipped.
>
> ⚠️ **Baseline correction.** The invoking brief stated `git log c23e322..HEAD` was empty and HEAD was
> `c23e322`. That is **stale**. HEAD is `ce6bf54 "Sprint push"`, authored and committed by
> Mark Dolbyrev `<ruflashist@gmail.com>` at 2026-08-14 11:57:38 +0300 — the **owner's own push**, same
> author and message pattern as `c23e322`, made after this task's worklog was last written (11:51).
> The working tree is **clean**. **No agent commit.** Reviewed `c23e322..HEAD` scoped to the three files.

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | high | `bin/release.mjs:293-301` | The `!doPush` branch is derived from `doTag`/`doPush` **alone** — violating this same block's ⛔ at `:277-280` — so with a pre-existing tag it prints a false statement and a harmful recovery command. **Measured**, both sub-cases. (a) Tag exists locally at an older commit: prints `v0.1.0 is committed and tagged locally only` (false — it names a different commit) and `Finish it with: git push origin main && git push origin v0.1.0`, which **publishes a tag naming the wrong commit — manufacturing the exact R2 false-green state this task exists to prevent**. The identical state under `--push` reaches branch 4, which *does* warn `⚠ Check what it names first`; branch 2 carries no such warning. (b) Tag exists only on origin, no local ref: `tagged locally only` is false, and the printed recovery exits 1 — `error: src refspec v0.1.0 does not match any`. |
| R2 | 1 | high | `bin/release.mjs:282-285`, `:250-252`, `:288`; `test/release-summary.test.js:83-88` | The invariant asserted at `:284` — *"nothing in the run can change `remoteTagExists` except our own tag push"* — is **false** under `push.followTags=true`. **Measured**: `git push origin <branch>` at `:252` publishes a local-only annotated tag reachable from the pushed ref, before the `:258` block is skipped. Three consequences: (a) the UNFINISHED branch prints `tag v0.1.0 was NOT pushed` when it *was*, plus a no-op recovery; (b) `makeFixture()` pins `commit.gpgsign`/`tag.gpgsign` against exactly this class of maintainer-config leakage but **not** `push.followTags`, so `0288/local-only-tag` **fails** on such a machine — **measured** via `GIT_CONFIG_GLOBAL`: `AssertionError: 0288 must NOT push the tag — the fence (owner-ruled 2026-08-13) has been lifted`, a false accusation; (c) because `release.mjs:188-192` gates every release on `npm test`, that maintainer **cannot cut a release at all**. |
| R3 | 1 | med | `bin/release.mjs:343-345` | The peel command is the stale-tag branch's **only** answer to "which commit does the tag name", and for a foreign **lightweight** tag it exits 2 with **empty stdout AND empty stderr** (measured) — **R5's exact defect signature, reintroduced in code 0288 added**. The default path's line gained a speaking `\|\| { echo "…(git exit $?)"; false; }` tail; this one did not, though the same tail preserves the 2-vs-128 distinction the design requires. The caveat's justification at `:345` (*"this script only ever makes annotated ones"*) is a **non-sequitur for the branch it sits on**: this branch fires precisely on a tag **this run did not create**. Partially overlaps worklog residual 6, which names the exit-2 behaviour but not its silence nor the circular reasoning. |
| R4 | 1 | med | `test/release-summary.test.js:98` vs `:100-106` | Seal 1 asserts **after** `git push -q origin main` at `:98`. Its comment claims *"A fixture that ever resolved origin to the real repo dies here instead of pushing to it"* — **false by ordering**: the first push has already happened. Today `origin` is set from `root` two lines above, so the assertion is a tautology; its only value is as a guard against a future edit, and that is exactly the case where the ordering is load-bearing. |
| R5 | 1 | low | `bin/release.mjs:344`, `:318` | `Which commit this run pushed: git rev-parse HEAD` is wrong under `--branch <other>`: `:214` takes `branchArg`, `:252` pushes **that** ref, and HEAD stays on the current branch — so the printed comparison is against the wrong commit. The N1 branch's `:318` (`vs git rev-parse HEAD`) carries the same flaw. |
| R6 | 1 | low | `test/prove-red.sh:1016-1018` | The comment states as fact *"Mutations 18-21 each leave `0288/default-released` GREEN — that isolation is itself evidence…"*, but **nothing in the script checks it**. Every mutation gate greps only that its **own** named assertion went red; none asserts the others stayed green. The isolation property is documentation, not a gate. |
| R7 | 1 | low | `test/release-summary.test.js:210`, `:305` | `0288/no-push` and `0288/dry-run` have no prove-red mutation. This is within the file's doctrine (*each mutation reds a named assertion*, not the converse). Recorded because `0288/no-push` is the assertion guarding the branch **R1** breaks, and it passes today while that branch prints falsehoods — direct evidence it is under-specified: it checks only that `nothing was pushed` appears, never the detail lines or the recovery command. |
| R8 | 2 | low | `test/release-summary.test.js:87-88` | The new R2 comment overclaims: *"This pin makes **the suite** measure git's documented DEFAULT instead of whatever the host machine is configured to."* It makes **`push.followTags`** host-independent — not the suite. **Measured this turn**: a global `core.hooksPath` pointing at a rejecting `pre-commit` reds **all 7** tests, and by the same `npm test` release gate that comment invokes, that maintainer also cannot cut a release. The sentence is new this round, so its accuracy is in scope; the underlying hook exposure is **pre-existing and outside 0288's fence**. Blast radius of the wording alone: a future reader trusts a host-independence guarantee the fixture does not provide. |
| R9 | 2 | low | `test/prove-red.sh:1021` vs `bin/release.mjs:320` | Mutation 22 is the **only** one of the five 0288 mutations with no wrong-target guard: its `sed` is not scoped to the summary block and rewrites **every** column-0 `} else if (tagCreated) {`, with only the `cmp` no-op check behind it (18 counts remaining occurrences; 19/20/21 each have a half-applied grep). R1 added the file's **second** `else if (tagCreated)` at `:320`, saved from co-mutation **only by its two-space indent**. **Measured**: exactly 1 line mutated today, mutant `node --check` OK, gate red at its named assertion — so the gate is sound **now**. The finding is that this round consumed the margin, on the one gate the brief calls the least forgiving. |
| R10 | 2 | low | `test/prove-red.sh:940`, `:995` | **Record correction, not a code defect** (raised by **both** reviewers). The *Coder response* justifies not editing `prove-red.sh` on the grounds that reusing either phrase *"would have **silently** disarmed those gates"*. The **collision is real** — **measured**, a branch-2 line reusing `Which commit the tag names` does retarget mutation 20's `awk` to itself and leaves the real peel intact — but the outcome is **loud, not silent**: the surviving `refs/tags/${tag}^{}` trips mutation 20's half-applied guard → `fail=1` → hard gate FAILS. Reusing `not confirmed on origin` trips mutation 21's guard identically. The avoidance was still the right call (a loud gate failure is a broken build), and the gates are **stronger** than the ledger credits them with — but the stated reason is wrong and should not be relied on later. |

### Verified sound — do not chase (recorded so the coder is not asked to re-derive these)

- **Branch totality for `doPush=true`** — exhaustive over all four `localTagExists × remoteTagExists`
  combinations: (F,F)→`✓ Released`, (T,F)→`UNFINISHED`, (F,T)→stale, (T,T)→stale. **No gap.**
- **The reorder vs the approved plan** — **behaviourally equivalent**. Past `!doPush`,
  `tagCreated ⟹ tagPushed ⟹ tagOnOrigin`, so branches 4 and 5 are provably mutually exclusive and both
  orders produce identical output on every reachable input. The reorder is sound, and it does make
  `tagOnOrigin` load-bearing — **mutation 19 is a real mutation, not a no-op**.
- **`$?` inside `|| { echo "…(git exit $?)"; false; }`** — **verified by execution** in `/bin/sh`,
  `bash`, `zsh`, `dash`: expands to git's own status (2), compound exits 1. Against real git with an
  unreachable origin: git's `fatal:` **plus** `✗ … (git exit 128)`. `$?` survives the JS template
  literal (`$?` is not `${`). The claim at `:322-325` is **CORRECT**.
- **`check: true` claim** — `git()` at `:90-97` calls `fail()` → `process.exit(1)` on non-zero; the only
  `check:false` calls are `:108` and `:240`, neither in the push/tag path. **CORRECT.**
- **The build's correction of the plan on `--no-test`** — **verified by execution**: the fixture's
  `package.json` has no `test` script, `npm test` (npm 11.6.2) exits non-zero with
  `Missing script: "test"`, and `runTests()` at `:175-186` calls `fail()`. It **aborts, it does not
  recurse**. The correction is **right**, and documenting it rather than claiming the recursion is the
  honest call.
- **Seal 2** (`--no-test` hard-coded + asserted, `:123-125`) — tautological as written (the assert
  cannot fail given the line above it), but it does catch the one future edit that drops the flag from
  the array. Weak, **not a defect**.
- **Mutation 22's double-red is NOT "engineered around a weak assertion"** — see the disproven note below.
- **Suite state** — measured this turn: `node --test test/release-summary.test.js` → **7/7 pass**, 7.8s.

### Disproven (raised by Codex, rejected here)

- **"Mutation 22's double-red is engineered, not inherent"** — **PARTIALLY CORRECT, characterization
  rejected.** Codex is right that an isolating alternative exists (mutate only the `✓ Released`
  *string*). But mutation 22's stated purpose is making the **branch unreachable**, not the string
  wrong; a string-only mutation is the **weaker** test. `0288/failure-speaks` is coupled because it
  **scrapes the command the default path actually printed** — a *stronger* assertion than hardcoding
  it. The double-red therefore follows from a stronger design, not a weaker one, and the build's
  wording (*"a mutation stopping the default path printing it takes both"*) is accurate as scoped. The
  only real residue is **R6**.

## Coder response

<!-- CODER-OWNED — the reviewer never writes this section. -->

> **Round 1, coder side.** Every finding was **independently re-verified against the code before any
> edit** — five of the seven by **execution** in throwaway fixtures (local bare origins; the real repo
> was never touched). **The reviewer was right on all seven.** Nothing was taken on its word, and
> nothing was returned as `NEEDS-DECISION`.
>
> Owner dispositions of 2026-08-14 (verbatim labels) authorize the actions below: R2 *"(a) Fix both
> sides (Recommended)"*, R1 *"(a) Consult the measured state (Recommended)"*, R3 *"(a) Give it the
> speaking tail (Recommended)"*, R4+R5 *"Action R4+R5, record R6+R7 (Recommended)"*.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT — reproduced, both sub-cases** | Defect | Branch 2 now reads `tagCreated` / `remoteTagExists` / `localTagExists`; four sub-branches, each statement true, no wrong recovery command | **fixed** |
| R2 | **CORRECT — reproduced, all three consequences** | Defect | Fixture pins `push.followTags=false`; the `:282-285` invariant comment replaced by an honest statement of the assumption and its exception | **fixed (both sides)** |
| R3 | **CORRECT — reproduced (exit 2, empty on BOTH streams)** | Defect | Peel line gains the same `\|\| { echo "✗ … (git exit $?)"; false; }` tail; the circular caveat at `:345` rewritten | **fixed** |
| R4 | **CORRECT — by reading; false by ordering as claimed** | Defect (latent) | Seal 1 moved to immediately after `git remote add origin`, before any push; comment updated to say why the ordering is the point | **fixed** |
| R5 | **CORRECT — reproduced under `--branch other`** | Defect | `git rev-parse HEAD` → `git rev-parse ${branch}` at both sites (`:318`, `:344`) | **fixed** |
| R6 | **CORRECT — by reading; nothing gates the isolation claim** | Defect (test-suite) | ⛔ **Not actioned — owner-ruled.** Recorded as an accepted residual with a re-raise condition | **accepted residual** |
| R7 | **CORRECT — by reading; `0288/no-push` is under-specified as claimed** | Frontier-move | ⛔ **Not actioned — owner-ruled.** Recorded as an accepted residual with a re-raise condition | **accepted residual** |

### Independent verification — what was actually run

- **R1(a)** `--no-bump --no-push` with an annotated `v0.1.0` already local at an **older** commit.
  Pre-fix output, verbatim: `v0.1.0 is committed and tagged locally only.` /
  `Finish it with: git push origin main && git push origin v0.1.0` — while the tag peeled to
  `0b9576c0…` and HEAD was `7366da63…`. The recovery would have published a tag naming the wrong
  commit. **Confirmed.**
- **R1(b)** same flags, tag on origin only, no local ref. Pre-fix: the same
  `tagged locally only` line (false), and running the printed recovery gave
  `error: src refspec v0.1.0 does not match any`, **exit 1**. **Confirmed.**
- **R2** `GIT_CONFIG_GLOBAL` with `push.followTags=true`, N1 setup: origin tags **before** the run
  `[]`, **after** the run `1817a799… refs/tags/v0.1.0` — published by the **branch** push at `:252`,
  while the summary printed `tag v0.1.0 was NOT pushed`. The suite then failed exactly as the reviewer
  measured: **6/7, `0288/local-only-tag` red** with `the fence … has been lifted`. **Confirmed,
  including the `npm test` release-gate consequence (c).**
- **R3** foreign **lightweight** tag on origin: `git ls-remote --exit-code origin 'refs/tags/v0.1.0^{}'`
  → `exit=2 stdout=[] stderr=[]`. **Silent. Confirmed** — R5's signature in code 0288 added.
- **R5** `--branch other` with `other` behind `main`: the summary said `other was pushed` and then
  printed `vs git rev-parse HEAD`, where HEAD was `fc29b8a6…` and the pushed tip was `dc71b48f…`.
  **Confirmed at `:318`**; `:344` is the identical construct on the sibling branch.
- **R6/R7** by reading `test/prove-red.sh`: every mutation gate greps only its **own** assertion
  (`grep -Eq '(✖|not ok|fail).*<name>'`); none asserts another stayed green. Mutations 18–22 cover
  no-tag / local-only-tag / stale-origin-tag / failure-speaks / default-released — **not**
  `0288/no-push` or `0288/dry-run`. **Both confirmed.**

### Two implementation choices worth naming

1. **R2's second half was answered by the comment, not the derivation.** The owner's ruling offered
   either. Making `tagOnOrigin` genuinely correct requires **re-reading origin after the push** — a
   network round-trip added to every release run, on a task fenced to the summary block. Pinning the
   push instead (`--no-follow-tags`) is above `:271` and therefore out of bounds. So the comment now
   states the assumption, its measured exception, and why it is not closed here. **The runtime
   inaccuracy remains and is recorded as a residual below.**
2. **Branch 2 deliberately prints no peel command**, and the R2 branch's peel keeps its exact wording.
   Two prove-red gates are keyed to that text — mutation 20's `awk` fires on the **first**
   `Which commit the tag names` line and its half-applied guard greps for a **surviving**
   `refs/tags/${tag}^{}`; mutation 21's half-applied guard greps for a surviving
   `not confirmed on origin`. A second peel line, or a reused failure message, would have **mis-fired
   the mutation and failed the hard gate loudly** — the surviving copy of the string trips that
   mutation's half-applied guard, so `fail=1` and the gate reds. Branch 2 therefore states the risk in
   prose, and R3's new tail uses a distinct message (`could not resolve what … names on origin`). ⛔ No
   mutation was edited to accommodate the fix.

   > **Corrected round 2 — R10**, owner-ruled 2026-08-14, verbatim label *"Correct the record
   > (Recommended)"*. This text originally read *"would have **disarmed those gates silently**"*. Round 2
   > measured both hypotheticals: the failure is **loud, not silent** — the half-applied guard catches
   > the surviving string and the hard gate fails. ⚠️ **The collision was real and avoiding it was
   > correct**; only the stated consequence was wrong.

### Re-verification after the fixes

```
node --test test/*.test.js   tests 730   pass 730   fail 0   (duration_ms 92271)
bash test/prove-red.sh       18. --no-tag summary branch unreachable — "0288/no-tag" ... red
                             19. tagOnOrigin → the naive `doTag && doPush` — "0288/local-only-tag" ... red
                             20. peel comparison → a plain existence check — "0288/stale-origin-tag" ... red
                             21. verify command loses its speaking tail — "0288/failure-speaks" ... red
                             22. ✓ Released headline unreachable — "0288/default-released" ... red
                             ✓ hard gate PASSED — real + unmutated copy green;
                               each mutation reds its NAMED assertion.
npm test  10:03.04 total     EXIT=0
```

**R2 proven under the config that broke it** — `GIT_CONFIG_GLOBAL` with `push.followTags=true`:
**before** the fix `pass 6 / fail 1`, `0288/local-only-tag` red with
`AssertionError: 0288 must NOT push the tag — the fence (owner-ruled 2026-08-13) has been lifted`;
**after** the fix `pass 7 / fail 0`. A config-dependent failure fixed and tested under that config.

⚠️ **Runtime: 10:03.04, against the build's 14:27.93 for the same surface.** ⛔ **Do not read that as an
improvement.** This change adds **no test and no mutation**, so it cannot have made the suite faster;
the build's run was measured with two concurrent fkit workers on the machine and this one was not.
**The owner's accepted +40% is not exceeded** — that is the honest claim, and no more.

⛔ **`test/prove-red.sh` was not edited in this round.** Where a fix and a mutation gate collided, the
fix was worded around the gate. All five 0288 mutations were additionally simulated directly against
the modified `bin/release.mjs` before the suite ran: each still lands, satisfies its no-op and
half-applied guards, and produces a `node --check`-valid mutant.

## Accepted residuals (shared, do-not-re-litigate)

- **Default-path output changed** — What: the default path's verify line gained a speaking failure
  branch; headline and success path stay byte-identical · Why (structural): the brief's Context ⛔ and
  its verification step 5 contradict; the **owner ruled 2026-08-14 that step 5 governs**, verbatim
  label *"(A) Fix R5 on the default path too (Recommended)"* · Re-raise only if: the **success** path's
  bytes change, or the headline changes.
- **Suite cost** — What: +4m08s / ~+40% against a "~1–2 min" estimate · Why (structural): **owner
  accepted 2026-08-14**, verbatim label *"Accept the +40% (Recommended)"* · Re-raise only if: the cost
  grows again beyond the accepted figure.
- **Recovery commands are printed** — What: the summary prints by-hand recovery commands · Why
  (structural): owner-ruled, verbatim label *"(A) Print them (Recommended)"* · Re-raise only if: a
  printed command is unsafe or wrong — **note R1 and R5 are exactly that case and are NOT covered by
  this residual**.
- **R4 — unquoted `${tag}` interpolation** — What: left exactly as it was · Why (structural):
  owner-ruled *"Unactioned — pre-existing"*; the new line's single quotes around `'refs/tags/…^{}'` are
  required for zsh to parse `^`/`{}` at all and are **not** claimed as a security fix · Re-raise only
  if: a *new* line introduces a *new* interpolation exposure.
- **N1's fence stays closed** — What: no tag push was added; `--no-bump` still cannot finish that
  release, it only stops lying about it · Why (structural): owner-ruled 2026-08-13, *"Report truthfully
  only — stay inside the fence"*; `0288/local-only-tag` asserts the tag is still absent from origin —
  the fence, tested · Re-raise only if: someone proposes making the script push the tag.

<!-- Added round 1, coder side (2026-08-14), under the owner's R4+R5 disposition
     "Action R4+R5, record R6+R7 (Recommended)". -->

- **R6 — mutation isolation is documented, not gated** — What: `test/prove-red.sh:1016-1018` states as
  fact that mutations 18–21 leave `0288/default-released` green, but every gate greps only its **own**
  named assertion; nothing checks the others stayed green · Why (structural): **owner-ruled
  2026-08-14, not actioned** — an isolation check was explicitly declined ⛔ · **Verified CORRECT by the
  coder before being accepted**, not waved through · Re-raise only if: someone relies on the isolation
  claim as evidence (e.g. to justify dropping a mutation), or a future mutation's red is diagnosed by
  reading that comment rather than by running the suite.
- **R7 — `0288/no-push` and `0288/dry-run` have no mutation** — What: neither assertion has been proven
  able to fail, and `0288/no-push` is thin (it checks the headline and origin state, not the detail
  lines or the recovery command — which is why it stayed green while branch 2 printed falsehoods)
  · Why (structural): **owner-ruled 2026-08-14, not actioned** — those two mutations were explicitly
  declined ⛔ · Re-raise only if: branch 2's sub-branches are edited again (they are now the
  file's most-branched and least-mutation-covered code), or `0288/no-push` is cited as proof that
  branch 2 is correct.
- **`push.followTags=true` still mis-reports at RUNTIME** — What: the fixture pin (R2) fixes the
  **suite**, so a maintainer with that global setting can cut a release again; the **script** still
  cannot see a tag its own branch push published, so the UNFINISHED branch can say `NOT pushed` of a
  tag that was · Why (structural): closing it needs a post-push `git ls-remote` — a network
  round-trip on every run — or `--no-follow-tags` on the push at `:252`, which is above `:271` and
  outside 0288's fence. The owner's R2 ruling offered "derivation **or** comment"; the comment was
  taken, and `bin/release.mjs:285-293` now states the assumption and its exception out loud · Blast
  radius: the printed recovery becomes a **no-op**, not a wrong-tag push · Re-raise only if: the fence
  above `:271` is opened, or a maintainer is actually misled by it in practice.
- **`--branch <other>` + `--no-push` compares and pushes different refs** — What: under `--no-push`
  the run commits at HEAD but its printed recovery pushes `${branch}`; with `--branch other` those are
  different commits · Why (structural): **pre-existing and out of 0288's scope** — it is a property of
  what `--branch` means to the *execute* section (`:214`, `:252`), not of the summary. R5's disposition
  scoped the fix to `:318` and `:344`; branch 2 deliberately compares against **HEAD**, which is
  correct for a run that pushed nothing, and `bin/release.mjs:302-304` says so · **Noticed by the coder,
  not raised by either reviewer** · Re-raise only if: `--branch` is worked on, or someone reports a
  `--no-push --branch` run finishing at the wrong commit.

<!-- Added round 2, coder side (2026-08-14), under the owner's R9 disposition
     "Record as a residual (Recommended)". ⛔ test/prove-red.sh was NOT touched. -->

- **R9 — mutation 22 has no wrong-target guard, and R1's fix consumed its safety margin** — What:
  mutation 22's `sed` is `s/^} else if (tagCreated) {$/…/` — unscoped, matching by text alone. R1's
  round-1 fix added a **second** `} else if (tagCreated) {` at `bin/release.mjs:320`; it survives only
  because it carries a two-space indent while the `sed` is anchored at **column 0** (the real target is
  `:351`). The block has the neighbours' `cmp -s` no-op guard, but **no** count or wrong-target guard,
  so a second column-0 copy would be silently co-mutated · Why (structural): **owner-ruled 2026-08-14,
  not actioned**, verbatim label *"Record as a residual (Recommended)"* — adding a guard reopens
  `test/prove-red.sh`, which the owner explicitly declined this round · **Verified by the coder before
  being accepted** (both occurrences and the `sed`'s column-0 anchor read directly), not waved through
  · Blast radius: latent test-infrastructure fragility only — no behaviour defect; the gate passes for
  the right reason today · Re-raise only if: **"a second column-0 `} else if (tagCreated) {` is ever
  added"**.

---

## Round 2 — verification of the round-1 fixes (reviewer, 2026-08-14)

> **Verdict: ✅ Ready to merge — 0 open confirmed defects. R1–R5 verified fixed by execution; 3 novel
> findings, all low, none blocking.**
>
> Reviewers run: **Claude** (this pass, **with execution** — full suite, hard gate, and purpose-built
> throwaway fixtures) + **Codex** via `codex exec --sandbox read-only` (**reasoning-only** per
> ADR-042 D1 — it executed nothing; its findings are labelled reasoning, not measurement).
> **Coverage is complete; neither reviewer was skipped.**
>
> ⚠️ **This was a judging round, not a hunt.** No general re-sweep of settled ground was run, by
> either reviewer. Scope was the change surface only: `bin/release.mjs` (+50/−7) and
> `test/release-summary.test.js` (+18/−7). `test/prove-red.sh` confirmed **unmodified**
> (`git status` clean for it), and the working tree carries **no** source change outside those two.

### Per-fix verification — every claim checked, not the intent

| Fix | Claim checked | Method | Result |
|-----|---------------|--------|--------|
| **R1** | 4 sub-branches total, each lands on the measured state, no reachable run prints a command that errors | **executed** all 5 reachable states in throwaway fixtures with local bare origins | **HOLDS.** `!doTag` and `tagCreated` outputs **byte-identical** to pre-fix. R1(a) (local tag, older commit) now says *"no tag was created — v0.1.0 already existed locally"* + ⚠ check-first + `Then:`. R1(b) (origin-only tag) now says *"already on origin"* and prints **only** `git push origin main` — the command that used to exit 1 is gone. The 4th state (tag both local **and** on origin) lands on the `remoteTagExists` arm and is also true. **Total, no gap.** |
| **R3** | 2 and 128 stay distinct; the tail speaks | **executed** the printed command against a foreign lightweight tag, then against an unreachable origin | **HOLDS.** exit 2 → `✗ could not resolve what v0.1.0 names on origin (git exit 2)`; exit 128 → git's own `fatal:` **plus** `✗ … (git exit 128)`. Compound exits 1 in both. The rewritten caveat is accurate. |
| **R5** | `${branch}` at the two push-sites; branch 2's **HEAD is deliberate and correct** | **executed** `--branch other --no-push` and `--branch other --no-bump` with `other` behind `main` | **HOLDS, and the coder's reasoning is sound.** `git commit` always commits at HEAD; `--branch` only changes the push refspec — so under `--no-push` the commit **and** any tag this run created are at HEAD, and HEAD is right. At `:349` the fix also removes a **false green**: with the tag at HEAD and `other` behind, the old `vs HEAD` printed a spurious match; `vs other` correctly shows the mismatch. |
| **R4** | Seal 1 now precedes every push | read + `makeFixture()` call-site enumeration | **HOLDS.** Seal at `:104-106`, `git remote add` at `:96`, first and only fixture push at `:115`. Both assertions unchanged. |
| **R2** | fixture pin fixes the suite under `push.followTags=true` | **re-run independently, with a control** | **HOLDS.** `GIT_CONFIG_GLOBAL` with `push.followTags=true`: current file **7/7 pass**. Control — same config, pin line deleted from a scratch copy — reds at exactly `AssertionError: 0288 must NOT push the tag — the fence (owner-ruled 2026-08-13) has been lifted`. Repo-local config outranks global, as claimed. |

### ⭐ The prove-red gate — independently verified, both halves

All five 0288 mutations were **reconstructed byte-for-byte from `test/prove-red.sh` and applied to the
current `bin/release.mjs`** in a scratch dir, then every guard re-evaluated and every mutant
`node --check`ed:

| Mut | Target lands | No-op guard | Wrong-target / half-applied guard | `node --check` |
|-----|--------------|-------------|-----------------------------------|----------------|
| 18 | yes, summary-scoped | clean | remaining `^} else if (!doTag) {$` = **1** (gate requires 1) | OK |
| 19 | yes | clean | no surviving `tagOnOrigin) {` | OK |
| 20 | yes — first match **is** the real peel line | clean | no surviving `refs/tags/${tag}^{}` | OK |
| 21 | yes — 2 lines → 1, `);` preserved | clean | no surviving `not confirmed on origin` | OK |
| 22 | yes | clean | *(none exists — see R9)*; exactly **1** line rewritten | OK |

And the gate itself, run for real: **`bash test/prove-red.sh` via `npm test` → all 22 mutations red at
their own named assertion, `0a`–`0k` green, `✓ hard gate PASSED`.**
⛔ **No gate is passing for the wrong reason.**

⚠️ **False alarm I caught on myself, recorded so nobody repeats it.** My first pass at mutation 20's
half-applied guard (`grep -q 'refs/tags/${tag}\^{}'`) reported **no match**, which would have meant a
dead guard. That was **my** shell: this session's interactive `grep` is a function wrapping `ugrep`,
whose BRE handles `{}` differently. `prove-red.sh` runs under `#!/bin/sh`, which uses `/usr/bin/grep`
— re-tested there and via `/bin/sh -c`, it **matches**. The guard is live. **Not a finding.**

**The collision claim (R10):** real, but mis-worded. Measured both hypotheticals — see the R10 row.
Reusing either phrase mis-fires the mutation **and trips the half-applied guard → `fail=1` → the hard
gate fails loudly**. Not silence. **Codex reached the same conclusion independently** (raised by both).

### Re-litigates settled decisions (suppressed — recorded, never dropped)

- **Codex, rated `high` · `bin/release.mjs:327-330`** — *"R1 still prints a recovery capable of
  publishing a wrong-commit tag"* (the local-only-tag arm prints `Then: git push origin ${branch} &&
  git push origin ${tag}`). **Verified CORRECT as a statement of fact; severity downgraded by me to
  low; classified frontier-move, already settled.** Reasons: (1) it is the **identical** treatment the
  `--push` sibling of the same state already gets at `:336-350`, and **round 1's own R1 text named
  that warned form as the standard branch 2 was missing** — so re-raising it re-litigates the fix
  round 1 asked for; (2) branch 2 in fact orders it **more safely** than the sibling does — the ⚠
  check-what-it-names line comes **before** the command, joined by `Then:`, whereas `:349` prints the
  push first and warns after; (3) it is covered by the accepted residual **"Recovery commands are
  printed"** (owner-ruled *"(A) Print them (Recommended)"*), whose re-raise condition — *"a printed
  command is unsafe or wrong"* — is **no longer met**: the surrounding statement is now true and the
  command is gated behind an explicit check. ⛔ Not re-filed.
- **R6, R7** — owner-ruled recorded-not-actioned (*"Action R4+R5, record R6+R7"*). Present as
  residuals with re-raise conditions. ⛔ Not re-raised.
- **R2's runtime half** — owner-ruled *"Leave it documented (Recommended)"*. **Confirmed honestly
  recorded**, and that is all this round does with it: `bin/release.mjs:284-293` states the
  assumption, names `push.followTags=true` as the measured exception, says `remoteTagExists` is read
  pre-run at `:219` and cannot see it, and states the blast radius (*"its recovery command becomes a
  harmless no-op, not a wrong-tag push"*) — matching the residual. ⛔ Not re-raised as a defect.
- **`--branch <other>` + `--no-push` refspec mismatch** — owner-ruled *"File it as its own task"*.
  ⛔ Not re-raised, not re-filed here.
- Default-path output change · +40% suite cost · printed recovery commands · unquoted `${tag}`
  (*"Unactioned — pre-existing"*) · N1's closed fence — ⛔ none re-raised.
- **Borderline, disclosed rather than filed:** `git rev-parse ${branch}` at `:349`/`:381` newly
  interpolates a CLI-controlled value into a **printed** command where the old line had none. Judged
  **covered** by the unquoted-`${tag}` residual: not a new line, not a new exposure class —
  `git push origin ${branch}` already interpolates the same variable the same way two lines away, and
  these strings are printed for a human to copy, never executed by the script. Flagged so the owner
  can overrule if they read the re-raise condition more strictly.
- **Codex novel, `test/release-summary.test.js`** — *"the fixture is not wholly host-config
  independent (`core.hooksPath`, env-scope config)"*. **I verified this by execution and it is TRUE**
  (all 7 red under a global rejecting `pre-commit`). It is **not** suppressed — it is folded into
  **R8**, scoped to the part that is genuinely in bounds (the new comment overclaims), with the
  underlying hook exposure flagged as pre-existing and outside 0288's fence.

### Measurements (this reviewer's own runs)

```
npm test                     tests 730   pass 730   fail 0   EXIT=0
bash test/prove-red.sh       0a-0k green; mutations 1-22 all red at their NAMED assertion
                             ✓ hard gate PASSED
wall clock                   9:33.30  (real 573.30s)
```

⛔ **This is NOT a speed-up and must not be reported as one.** The coder measured 10:03.04 and said
plainly that its figure was machine load, not improvement; the same applies to mine, in the other
direction and for a reason I can name: **my run overlapped my own verification work** — three
independent fixture suites and a `codex` process were running on this machine during it. **This round
added no test and no mutation, so the suite cannot have got faster.** The honest claim is that the
owner's accepted +40% is not exceeded, and no more.

### Convergence call — **CLOSE OUT**

Round 1 raised 7; the coder re-verified all 7, refuted none, fixed R1–R5, and recorded R6/R7 as
residuals under an explicit owner ruling. **This round confirms all five fixes by execution, finds no
regression, and finds nothing the fixes broke.** The three novel findings are **all low**: two are
accuracy-of-the-record (R8, R10) and one is latent test-infrastructure fragility (R9) — **no behaviour
defect among them**. The single `high` from the second reviewer collapses to a settled frontier-move
on inspection.

**Another review round would find nothing.** Recommend closeout once the owner disposes of R8–R10 —
they need a decision, not another pass.

### Open questions for the owner (reviewer has no owner channel — ADR-021)

1. **R8** *(recommended: fix — it is one sentence)* — narrow
   `test/release-summary.test.js:87-88` from *"makes the suite measure git's documented DEFAULT"* to a
   claim about `push.followTags` only, and (optionally) name `core.hooksPath` as a known remaining
   host dependency. Alternatives: record as a residual, or file the hook isolation as its own task.
2. **R9** *(recommended: record as a residual)* — mutation 22 has no wrong-target guard and R1
   consumed its safety margin. Options: add a count guard to `prove-red.sh` (⚠️ but the coder was
   right to keep `prove-red.sh` untouched this round — this reopens that file), record as a residual
   with re-raise *"if a second column-0 `else if (tagCreated)` is ever added"*, or accept silently.
3. **R10** *(recommended: record only, no code change)* — correct the *"silently disarmed"* wording in
   the round-1 *Coder response* rationale to *"would have mis-fired the mutation and failed the hard
   gate loudly"*. ⛔ The *Coder response* section is the coder's to edit, not mine.
4. **`Status`** — I have left it `in-review` with my convergence call spelled out. Say the word and it
   goes to `closed-out`; I did not set it there unilaterally while three findings are undisposed.

> ✅ **All four answered — owner-ruled 2026-08-14. See the next section.** Kept above as written, not
> edited, so the questions and their answers can both be audited.

---

## Round-2 dispositions — recorded (reviewer, 2026-08-14)

> ⛔ **This was NOT a review pass.** No third round was run — no Codex pass, no re-sweep, no hunt for
> new findings. The convergence call (**CLOSE OUT**) was already made at the end of round 2. This
> section does one job: **verify the owner's three dispositions actually landed, then close the
> ledger.** Verbatim option labels below are the owner's own, ruled 2026-08-14 via `AskUserQuestion`
> in the driving `fkit lead` session.

| # | Owner's disposition (verbatim label) | Actioned by | Landed? — reviewer's own check |
|---|--------------------------------------|-------------|-------------------------------|
| **R8** | *"Fix the sentence (Recommended)"* | Coder — source **comment** | ✅ **LANDED, as ruled.** `test/release-summary.test.js:82-91` now reads *"The pin makes `push.followTags` read git's documented DEFAULT here whatever the host is configured to — it pins that ONE setting, not the fixture as a whole"*, and adds *"⚠️ Known remaining host dependency (review R8, MEASURED): a global `core.hooksPath` with a rejecting `pre-commit` still reds all 7 tests. Pre-existing and outside 0288's fence — hook isolation is deliberately NOT added here."* The overclaim R8 named is gone; the measured exposure is named without being silently fixed. ⛔ Hook isolation **not** filed separately — owner declined. |
| **R9** | *"Record as a residual (Recommended)"* | Coder — **shared residual**, no code | ✅ **LANDED, as ruled.** Residual *"R9 — mutation 22 has no wrong-target guard…"* present in *Accepted residuals*, re-raise condition verbatim: **"a second column-0 `} else if (tagCreated) {` is ever added"**. ⛔ `test/prove-red.sh` **confirmed untouched** — `git status --short test/prove-red.sh` empty. Its three load-bearing facts re-checked by me first-hand this turn: `bin/release.mjs:320` carries a **two-space** indent, `:351` sits at **column 0**, and `test/prove-red.sh:1021` is `sed 's/^} else if (tagCreated) {$/…'` — **anchored at column 0**. The margin is real and the residual describes it accurately. |
| **R10** | *"Correct the record (Recommended)"* | Coder — **ledger prose**, its own section | ✅ **LANDED, as ruled.** The round-1 *Coder response* rationale now reads *"would have **mis-fired the mutation and failed the hard gate loudly**"*, with a dated correction note preserving the original *"would have disarmed those gates silently"* inline — so the amendment is auditable rather than a silent rewrite. The true half is kept explicit: *"The collision was real and avoiding it was correct; only the stated consequence was wrong."* ⛔ Written by the coder in the coder's own section; the reviewer did not edit it. |

**Both edits are non-behavioural** — one **source comment** (`test/release-summary.test.js:82-91`,
verified `//`-only: no assertion, no fixture config, no control flow changed; the `push.followTags`
pin itself is round-1 code and is untouched) and one **ledger prose** correction. Nothing executable
changed under these three dispositions.

⚠️ **Suite state is relayed, not re-measured by me this turn.** The coder re-ran after the edits:
**730/730 pass, all 22 mutations red at their named assertion, `✓ hard gate PASSED`, EXIT=0**, wall
**600.20s under load average 8.72**. ⛔ **That figure is a measurement under load, NOT a speed-up** —
consistent with both earlier rounds, this change adds no test and no mutation, so the suite cannot
have got faster. I chose not to spend a fourth 10-minute run to re-derive a green I have already
verified twice on unchanged executable code; **that is a deliberate gap, disclosed, not an omission.**

### Closeout

All ten findings are disposed: **R1–R5 fixed and verified by execution** (round 2), **R6, R7, R9
accepted residuals** with re-raise conditions, **R8 fixed**, **R10 record corrected**. **0 open
confirmed defects. 0 undisposed findings.** `Status:` set to **`closed-out`** by the reviewer —
withheld through round 2 only because three findings were undisposed, and they now are.

⛔ **Closeout is not a task close.** Moving `0288` out of `backlog/` is the **producer's** call via
`/fkit-task-done` (ADR-033), and nothing here was committed, staged, or moved.
