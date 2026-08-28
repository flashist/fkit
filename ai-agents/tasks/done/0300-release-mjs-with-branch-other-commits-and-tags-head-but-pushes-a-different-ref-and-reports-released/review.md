# Review — 0300

Task: 0300 — [brief](./brief.md)
File(s) under review: `bin/release.mjs` (preflight guard `:115-148`, push name `:249-253`, help `:30`/`:64`; Round-1 numbers were `:115-136` / `:237`), `test/release-summary.test.js` (`0300/*` section `:337-471` + header), `test/prove-red.sh` (mutation 25 `:1110-1145` + bookkeeping)
Diff base: working tree vs HEAD `2a64727` ("Sprint push", owner commit, 2026-08-27 16:34 +0300), restricted to the three files above
Status: closed-out

> **Round 1 (2026-08-27).** Reviewers run: **Claude** (this pass, with execution) + **Codex** via
> `codex exec --sandbox read-only` (codex-cli 0.145.0; **reasoning-only** per ADR-042 D1 — it read the
> diff and traced code, it executed nothing; it says so itself). Coverage is **complete** — neither
> reviewer was skipped. **All execution evidence below is mine:** `node --test test/release-summary.test.js`
> 11/11 green (7× 0288 + 4× 0300); `node --test test/*.test.js` 778/778 green; mutant 25 built by hand
> with the file's own `sed` and run through `FKIT_RELEASE_MJS` → T1, T2, T4 red, T3 + all 0288/* green
> (the isolation claim holds); `bash test/prove-red.sh` → **hard gate PASSED**: 0k green; 18–22 red at their named assertions; *"25. --branch guard disarmed — \"0300/branch-mismatch-refused\" should go RED ... red"*.
> Edge cases measured in a scratch repo with a local bare origin (nothing left this machine).
>
> **Fence check:** `git diff HEAD -- bin/release.mjs` has hunks at `@@ -27`, `@@ -61`, `@@ -112`,
> `@@ -211` only — nothing at or after `// --- summary ---` (now `:294`). `git diff --stat` shows nothing
> under `ai-agents/tasks/done/0288-*/`. Plan blob `bb523e88…` unchanged.
>
> **Re-litigation check:** neither reviewer re-raised Q1 (narrow, not remove), Q2 (detached HEAD with
> no `--branch`), Q3, Q4, the `push.followTags` "Leave it documented" ruling, or 0288's R6/R7/R9
> residuals. 0288's accepted residual *"`--branch <other>` + `--no-push` compares and pushes different
> refs — re-raise only if `--branch` is worked on"* has its re-raise condition met by this task and is
> **answered**, not re-litigated: the guard makes that state unreachable (T2 proves it under `--no-push`).
>
> **Bonus, measured (not a finding):** on an **unborn** HEAD (fresh `git init`, no commit) the old
> script bumped `VERSION` to 0.1.1 and *then* died at its `rev-parse` (`:214`), leaving the tree dirty;
> moving that `rev-parse` into the guard means it now dies **before** the bump — a clean abort.

> **Round 2 (2026-08-27).** Reviewers run: **Claude** (this pass, with execution) + **Codex** via
> `codex exec --sandbox read-only` (codex-cli 0.145.0; **reasoning-only** — it read the diff and ran
> read-only shell, executed no tests; it says so itself). Coverage is **complete**. Diff base unchanged
> (HEAD `2a64727`). **Fence check:** `git diff HEAD -- bin/release.mjs` hunks still `@@ -27`, `@@ -61`,
> `@@ -112`, `@@ -211` only — nothing at or after `// --- summary ---` (now `:310`);
> `git status --porcelain -- ai-agents/tasks/done/0288-*` empty.
>
> **Round-1 fixes re-verified (all execution mine):** **R1/R2** — compare is `symbolic-ref -q HEAD`
> (`:136-139`), `onBranch` null when detached, `!= null` kept. Both new tests are load-bearing: a copy
> with the Round-1 compare restored by sed (`branchArg !== headBranch`) reds
> `0300/branch-name-shadowed-by-tag-accepted` at `code === 0` and
> `0300/detached-head-with-branch-head-refused` at the `✗ --branch HEAD` match; both green on the real
> file. **R3** — mutant 25 rebuilt with the file's own `sed`: marker count 1, survivor grep 0, mutant
> differs from the original at `:139` only; it reds exactly the four named tests (T1, T2, T4, T6) and
> leaves T3, T5 and all 7× 0288 green — the isolation sentence at `prove-red.sh:1117-1121` is exact.
> **R5** — message `:140-147`: the load-bearing "Nothing was changed" sentence stayed; the new sentence
> describes the script, then names all three flags — exact on every path. Hint `git switch <arg>`:
> measured `git switch origin/main`, `refs/heads/main`, `HEAD` each refuse **without moving HEAD**; the
> hint is only printed, never run. The repo documents **no git floor** (README, knowledge-base, `bin/`,
> `test/` grepped — the only `git switch` in the repo is this hint plus T1's assertion; `git switch`
> needs git ≥ 2.23, Aug 2019; the fixture's own `git checkout --detach` is older). **R6** — counts
> verified: 13 tests; 14 fixture builds per run (13 call sites, T2 loops twice); "Seven runs (baseline +
> six mutants)"; "18-22 and 25"; `:38-40` now attributes 25 to the preflight. **R7** — T3 renamed
> (`:408`), assertions unchanged, mutation 25's name grep still pins T1. **R4** — row cites `0344`;
> `ai-agents/tasks/backlog/0344-…/brief.md` exists and carries the ruling.
>
> **Decision-log 4 judged (`const branch = headBranch`, `:253`) — right in substance, not a shape
> change; the plan ruling (Q1) is the contract, the push name is mechanism.** Measured: with a tag
> `main` present, `git push origin main` fails *"src refspec main matches more than one"* while
> `heads/main` pushes — even when origin carries a tag `main` too (`origin/main == HEAD` after). The
> dst side resolves through git's `refs/<x>` DWIM rule, which predates the ambiguity error itself —
> reasoning only, no old-git matrix was run, and the repo assumes no floor. Bare run: same value it
> always got (`--abbrev-ref`) on every HEAD state — no regression by construction. `--branch main` on
> an ordinary `main` pushes `main` as before. Only the shadowed corner differs, and there the plan's
> literal `branchArg ?? headBranch` dies at the push (coder's measurement, re-confirmed). The summary's
> `(branch: heads/main)` (`:262`, outside the fence) and the fenced `git push origin heads/main` /
> `git rev-parse heads/main` lines are valid commands naming the ref that was actually pushed —
> acceptable. ⚠️ **But WHEN the name is captured is wrong — R8 below.**
>
> **Suite:** `node --test test/release-summary.test.js` 13/13; `node --test test/*.test.js` 780/780;
> `bash test/prove-red.sh` → all 25 mutations red by name (`should go RED ... red` ×25), *"25. --branch guard
> disarmed … red"*, `✓ hard gate PASSED`, exit 0.
>
> **Codex claims, verified:** three raised. #1 TOCTOU → **CORRECT, measured → R8** (Codex *high*, mine
> **medium**). #2 unborn HEAD → **CORRECT in fact → R9** at *info* (Codex *medium*). #3 — HEAD a
> symref outside `refs/heads/` (`refs/custom/main`) with `--branch refs/custom/main` — **disproven as a
> defect**: measured on git 2.50.1, the guard accepts it, the commit lands on `refs/custom/main`,
> `git push origin custom/main` **succeeds** (creates `refs/custom/main` on origin), tag pushed,
> `✓ Released` — what was committed and tagged is what was pushed; Codex's predicted post-commit push
> failure did not happen. Contract nit only (a non-branch symref counts as "checked-out branch"); not
> recorded. Codex's *info* item (tests load-bearing, gate sound, counts consistent, fence untouched)
> agrees with mine.
>
> **Not re-litigated:** Q1–Q4, R4 → 0344, the fence, 0288's residuals. **R8 is not a Q1 re-raise** —
> Q1 narrowed the flag; R8 is HEAD moving *after* the check, on the bare run too.

> **Round 3 (2026-08-27) — scoped to the Round-2 fixes (R8, R9, mutation 26, the record correction).**
> Reviewers run: **Claude** (this pass, with execution) + **Codex** via `codex exec --sandbox read-only`
> (codex-cli 0.145.0; read-only shell + reasoning, executed no tests or fixtures — it says so itself).
> Coverage is **complete**. Diff base unchanged (HEAD `2a64727`). **Fence check:** `git diff HEAD --
> bin/release.mjs` hunks `@@ -27`, `@@ -61`, `@@ -112`, `@@ -197`, `@@ -211` — nothing at or after
> `// --- summary ---` (`:349`); `git status --porcelain -- ai-agents/tasks/done/0288-*` empty.
>
> **Verdict: ✅ Ready to merge — no new defects; `closed-out` stands; converged.**
>
> **R8 re-verified (all execution mine).** Compare at `bin/release.mjs:262-272` is `nowOn !== onBranch`
> against the *preflight* `onBranch` (never a re-resolve), sits after the gate (`:245`) and before the
> first `writeFileSync` (`:279`), and runs on every path. Scratch repo, local bare origin, working-tree
> script copied into the fixture: **(a)** test script switches away *and back* (`git switch -q other &&
> git switch -q main`) → released, exit 0, `origin/main == v0.1.1^{}` — **no false refusal**; **(b)**
> branch renamed mid-gate (`git branch -m main main2`) → refused *"it was on main, it is on main2 now"*,
> nothing written — a right refusal (`push origin main` would have failed); **(c)** a new commit on the
> *same* branch mid-gate → released, `origin/main == v0.1.1^{}` — consistent, and the coder's recorded
> non-goal; **(d)** bare detached + no-op script → E4 unchanged (bump, commit, `push origin HEAD` fails,
> exit 1) — **Q2 stands**; **(e)** detached → `main` mid-gate → refused *"it was detached, it is on main
> now"*; **(f)** HEAD a symref to `refs/custom/main` before and after → passes, pushes `custom/main`,
> exit 0 (Round 2's disproven item, re-measured); **(g)** `--no-test` → compare is a no-op, released;
> **(h)** `--branch main` + switch mid-gate → refused, **not** pushed to `other`. Representation: both
> reads are `symbolic-ref -q HEAD` through the same `.trim()` + `refs/heads/` strip, so a branch name
> that contains `refs/heads/`, case, or slashes compares the same way twice (Codex checked the same).
> **Test** `0300/head-moved-during-test-gate-refused` (`test/release-summary.test.js:497-527`): the
> fixture's `test` script is exactly `git switch -q other`; `releaseWithGateOn()` (`:160-168`) asserts a
> non-empty `scripts.test` that names none of `npm` / `node` / `release`, and refuses `--no-test` — SEAL
> 2's substance (no re-entry into this suite) holds for the fixture as written. **"Nothing was
> changed"** on the R8 path: the script itself wrote nothing (no bump, no `add`, no commit, no tag —
> traced `:245-279`); `npm test` in the fixture writes no file (`git status --porcelain` empty after
> the run, asserted at `:524`); the sentence that precedes it names the one thing that did change (HEAD,
> moved by the test script). Same wording as the settled 0256 gate-failure message at `:233`, which also
> follows a completed `npm test`. Exact for what it enumerates.
>
> **Mutation 26** (`test/prove-red.sh:1150-1182`): hand-built with the file's own `sed` → mutant differs
> from the original at `:264` only, marker count 1, survivor grep 0; through `FKIT_RELEASE_MJS` it reds
> **only** `0300/head-moved-during-test-gate-refused` at `code === 1` (14 pass / 1 fail) — the isolation
> sentence is exact. **Mutation 25** rebuilt the same way: differs at `:154` only; reds exactly T1, T2,
> T4, T6 and leaves T3, T5, **both new tests** and all 7× 0288 green — so *"25 alone was insufficient"*
> is measured, not asserted: the R8 test is a bare run and never enters the `branchArg != null` guard.
> Anchors unique (`grep -c` = 1 each). Name pin: `head-moved-during-test-gate-refused` is a substring of
> exactly one `test('…` name. **Bookkeeping** verified: `TWENTY-SIX` (`:20`), index rows 25/26
> (`:51-52`), *"18-22, 25 and 26"* (`:54`, `:359`; test file `:65`), *"sixteen fixtures (7× 0288, 9× 0300
> — T2 builds two)"* = 15 call sites (7 `makeFixture()`, 8 `fixtureWithOther()`) + T2's loop, *"Eight
> runs (baseline + seven mutants)"* = 0k + {18–22, 25, 26}, *"all seven"* (`:353`), 15 tests, test file
> `:103` *"all 15"*. `.orig`/`.bak` land in `$work`, not the fixture.
>
> **R9 re-verified.** `rev-parse --abbrev-ref HEAD` is `check: false` (`:142`); on a fresh `git init` it
> prints `HEAD` on stdout and the `fatal: ambiguous argument 'HEAD'` line on stderr, exit 128 —
> `headName.err.split("\n")[0]` picks that line. Measured on an unborn repo: `--branch other`, bare,
> `--branch main`, `--dry-run` all print *"✗ HEAD is unborn — branch main has no commit yet. Make the
> first commit before releasing."* + *"Nothing was changed"* + the `fatal:` line, exit 1, tree untouched.
> The sentence is accurate under `--branch other` too (it names the checked-out branch, which is the
> unborn one); the mismatch is not mentioned because the unborn check sits above the compare (`:143` vs
> `:154`) — a deliberate two-step, recorded by the coder. Test `0300/unborn-head-refused-in-words`
> (`:529-550`) covers `--branch newborn` and bare via `checkout --orphan`. Record nit, no row: the coder's
> R9 row says a *non-unborn* resolve failure gets *"HEAD does not resolve to a commit"* — the branch at
> `:145` is actually keyed on whether `symbolic-ref` succeeded, not on the failure's cause. No reachable
> path differs: with a branch ref holding a bogus sha, `--abbrev-ref HEAD` still exits 0 (measured), so
> the only known way into `:143` with a symref HEAD is the unborn case — "none known" is right.
>
> **Record correction judged right.** At HEAD `2a64727` the bare run resolved its push name at `:214`
> (`branchArg ?? git rev-parse --abbrev-ref HEAD`), *after* `runTests()` at `:191`; plan §1b replaced it
> with `branchArg ?? headBranch`, `headBranch` read in the preflight — so the bare-run window dates from
> the **build**, not from Round 1's `const branch = headBranch`. My Round-2 R8 sentence *"`const branch =
> headBranch` extends it to the bare run"* was wrong; the coder's correction stands. Action unchanged.
>
> **Suite:** `node --test test/release-summary.test.js` 15/15 (inside the full run); `node --test
> test/*.test.js` **782/782**; `bash test/prove-red.sh` → `0k … green`, `25. … red`, `26. post-gate HEAD
> compare disarmed — "0300/head-moved-during-test-gate-refused" should go RED ... red`, **26 red by
> name**, `✓ hard gate PASSED`, exit 0.
>
> **Codex claims, verified — none is a new defect; no rows added.** **#1** (*high*): a window remains
> between the compare (`:264`) and `git commit` (`:322`) — `tag --list`, `ls-remote --tags`, `status
> --short`, `add -A`, `diff --cached`. **CORRECT in fact, frontier-move, info:** five git calls (one
> network round-trip), sub-second locally, versus the ~6-minute window R8 closed; no atomic
> commit-if-HEAD-is-X exists for this script's shape, so a window of *some* size is unavoidable without
> a lock. Not a defect; owner disposition below. **#2** (*medium*): symref outside `refs/heads/` —
> **re-raise of Round 2's disproven #3**, re-measured this round (f): commit, push and summary all name
> `custom/main`; the invariant holds. Disproven again. **#3** (*low*): *"Nothing was changed"* false on
> the R8 path because HEAD moved — **not a defect**: the script changed nothing, the sentence before it
> names the HEAD move, and the wording is the settled 0256 sentence on the same post-gate footing.
> **#4** (*low*): every `--abbrev-ref` failure with a symref HEAD is labelled unborn — **no reachable
> path** (see R9 above); git's own `fatal:` line is printed either way. Cosmetic, not recorded. **#5**
> (*low*): `releaseWithGateOn()` checks only `scripts.test`, not `pretest`/`posttest`, and `yarn test` /
> `sh test.sh` would pass the regex — **PARTIALLY CORRECT, hardening, not a defect:** the fixture has
> only `test`; the seal it claims (no re-entry through the fixture's `npm test`) holds for every fixture
> in the file today. Optional tightening (also check `pretest`/`posttest`); not required for closeout.
> **#6** (*info*): agrees with mine on anchors, guards, name pin, counts, no 0288 regression.
>
> **Not re-litigated:** Q1–Q4, R1–R7 dispositions, decision-log 4, R4 → 0344, Q2/E4 (re-measured
> unchanged), the fence, 0288's residuals. **Convergence:** no new defect in two rounds of fixes; the only
> live items are a settled-class residual (#1) and an optional hardening (#5). **Closeout recommended;
> `Status: closed-out` stands.**
>
> **NEEDS-DECISION {owner}:** record Codex #1 as an accepted residual — *"post-compare window — What: HEAD
> is compared once after the gate; the five git calls between the compare and `git commit` are not
> re-checked · Why: no atomic commit-if-HEAD-is-X in this script's shape; the six-minute window is closed,
> the remainder is sub-second · Re-raise only if: a lock or an atomic shape becomes available, or the
> window is observed to bite"* — so a later round does not re-raise it? **Recommended: yes.** Owner
> present → the coder relays; recorded here only on the owner's word.

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | low | `bin/release.mjs:126-127`, `:130` | **False refusal on an ambiguous short name** (raised by **both**). `git rev-parse --abbrev-ref HEAD` returns the *unambiguous* abbreviation: with a **tag named `main`** in the repo it prints `heads/main` (measured), so a legitimate `--branch main` on `main` is refused — *"that is not the checked-out branch (HEAD is on heads/main). … git checkout main"* — and the suggested fix changes nothing, so `--branch main` is unusable in that repo. The **bare** run is unaffected (`git push origin heads/main` resolves fine). Blast radius: clean abort, no damage, rare repo shape. A robust compare is `git symbolic-ref HEAD` (full `refs/heads/<name>`, measured `refs/heads/main` even with the tag present; `refs/heads/feature/x` for slashed names) against `` `refs/heads/${branchArg}` ``, with `check: false` so the detached case (exit 128, *"ref HEAD is not a symbolic ref"*) maps to "detached". ⚠️ Keep `--abbrev-ref` (or strip `refs/heads/`) for the value that feeds `:237` — the push refspec and the summary's `${branch}` want the short name. |
| R2 | 1 | low | `bin/release.mjs:127`, `:130` | **Detached HEAD + `--branch HEAD` bypasses the guard** (raised by **both**; Codex rated it *high*, my severity is **low** — reasoning below). On a detached HEAD `headBranch === "HEAD"`, so `--branch HEAD` satisfies `branchArg !== headBranch` → false and the run proceeds: **measured** — VERSION bumped to 0.1.1, `Release v0.1.1` committed on the detached commit, `git push origin HEAD` fails (*"unable to push to unqualified destination"*), exit 1, tree half-released. That is **exactly the E4 state the owner accepted under Q2** ("Leave it") for the no-`--branch` run — loud failure, no false green, no tag reaches origin — which is why this is low, not high. But the guard's own contract ("must be the checked-out branch" — `HEAD` is not a branch, `git branch HEAD` is refused by git) is violated, and plan §5 claims `--branch HEAD` is "refused" — true only when HEAD is on a branch. **Not a Q2 re-litigation:** Q2 covered *no* `--branch`; this is `--branch HEAD`. One-line shape: when `headBranch === "HEAD"`, refuse **any** `--branch` (the R1 `symbolic-ref` form gives this for free). ⛔ Do **not** extend the refusal to the bare run on a detached HEAD — that *would* re-open Q2. T4 tests only `--branch main`; a `--branch HEAD` case would pin this. |
| R3 | 1 | low | `test/prove-red.sh:1113-1114`, `:1128` | **The count guard detects under-mutation, not the over-mutation 0288 R9 was about — and the comment claims the latter** (raised by **both**). Comment: *"the count guard below is the wrong-target check mutation 22 lacks (0288 R9)"*. R9's concern was a **second column-0 copy being silently co-mutated**. But `sed s///` rewrites *every* matching line: if the anchor ever occurred twice, both would be disarmed, the marker would be present, and `grep -c '^if (branchArg != null' … != 0` would still read **0** — the guard passes. What it actually catches is a *near-miss survivor* (a line starting `if (branchArg != null` that the full anchor did not match). The gate is sound **today** (anchor matches exactly once — measured `grep -c` = 1; mutant differs from the original at `:127` only). To catch R9's mode, count the **marker** `== 1` (mutation 18's `!= 1` pattern). Record-correction plus optional hardening; no behaviour at stake now. |
| R4 | 1 | low | `bin/release.mjs:303`, `:310`, `:313`, `:319`, `:329`, `:371`, `:403` (all **inside 0288's frozen fence**) | **Seven in-fence `:NNN` references went stale by +23 when the guard landed** — the worklog names only `:311`. `:303` and `:329` say `:218-220` (tag checks, now `:241-243`); `:310` says `:250-252` (push, now `:273-275`); `:313` says `:258`/`:219` (now `:281`/`:242`); `:319` says `:258` (now `:281`); `:371` and `:403` say `:252` (now `:275`). Also `:371-372` and `:403` justify `${branch}` with *"under `--branch <other>` HEAD is still on the current branch"* — after 0300 that state is **unreachable** (the guard guarantees `branch` is HEAD's branch on every path that reaches the summary), so the R5 rationale is moot, though the code it defends is still correct. **This diff may not fix any of it** — the fence forbids it and the coder rightly left it. Disposition is the owner's (see NEEDS-DECISION below): open the fence for a comment-only refresh in 0300, file a follow-up, or leave and accept as a residual. |
| R5 | 1 | info | `bin/release.mjs:132-134` | **Refusal message is unconditional; two sentences are not exact on every path** (Codex). (a) *"The commit and the tag go to HEAD; the push would go to X — one run would tag one ref and publish another"* is printed verbatim under `--no-tag` (no tag would be made), `--no-push` (no push), `--dry-run` (nothing would happen). The load-bearing sentence — *"Nothing was changed: no bump, no commit, no tag"* — **is** exact on every path (verified: nothing above `fail()` mutates; `fail()` only writes stderr). (b) *"Check it out first … `git checkout ${branchArg}`"* is unusable for the refused spellings `origin/main` and `refs/heads/main` (both **measured** to detach HEAD, after which the same `--branch` is refused again) and for the swallowed `--branch --no-push` (prints `git checkout --no-push`). Cosmetic; the refusal itself is always correct and loud. |
| R6 | 1 | low | `test/prove-red.sh:211-212`; `test/release-summary.test.js:38`, `:98` | **Stale bookkeeping in three comments** (Codex; verified). `prove-red.sh:211` *"Each run builds seven throwaway git fixtures"* — now **12** (7× 0288 + T1 + 2× T2's loop + T3 + T4; 12 `makeFixture()`/`fixtureWithOther()` call sites, counted). `release-summary.test.js:98` *"still reds all 7 tests"* — the file has 11. `:38` *"mutations 18-22 and 25 … break the summary block"* — 25 breaks the **preflight**, above the block (the paragraph at `:44-49` says so correctly; `:38` contradicts it). "Seven runs (baseline + six mutants)", "TWENTY-FIVE", "18-22 and 25", "all six" are **correct**. |
| R7 | 1 | info | `test/release-summary.test.js:408` | **T3's name overclaims** (raised by **both**): *"releases exactly as the bare run does"* — it runs no bare control and compares no output; it proves exit 0, the `✓ Released v0.1.1` headline, `origin/main == HEAD`, tag on origin, `v0.1.1^{} == HEAD`. Those are the material outcomes and the assertions are not tautological; only the **name** claims equivalence. Passing against the unfixed script is by design (plan: "Not red-first — regression fence"). |
| R8 | 2 | medium | `bin/release.mjs:136-138` (reads), `:227` (gate), `:240` (first write), `:253`, `:283`, `:291`, `:299` | **HEAD is read before the ~6-minute test gate and acted on after it — the 0300 defect class comes back through a race, and for the BARE run that is a regression this round** (Codex; **measured**). `onBranch`/`headBranch` are captured at `:136-138`; `npm test` runs at `:227`; commit (`:283`) and tag (`:299`) act on whatever HEAD is *then*; the push (`:291`) uses the stale `headBranch`. Fixture whose `npm test` runs `git switch -q other`, bare run: **current** script prints `(branch: main)`, commit + tag land on `other`, `push origin main` moves nothing, tag `v0.1.1` reaches origin naming a commit **no origin branch reaches**, `✓ Released` — the exact false green this task exists to stop. **HEAD's** script under the same fixture pushed `other` (it resolved the name after the gate) — consistent, tag reachable from `origin/other`. Round 1's `branchArg ?? headBranch` had the same window on the `--branch` path only (I missed it then — mine to own); `const branch = headBranch` extends it to the bare run. Window is zero under `--no-test`. Blast radius: needs HEAD to move during the gate — a second terminal `git switch`/`checkout` in the same worktree while waiting, plausible in six minutes; outcome is the task's own defect. Shape (coder's call; in the plan's spirit): keep the preflight refusal where it is (T1's ordering proof stays) and **re-read `symbolic-ref -q HEAD` + `--abbrev-ref` after the gate, before the first write at `:240`**; if the branch is not the preflight `onBranch` (or HEAD is now detached), `fail("HEAD moved during npm test …")` — still a clean abort, nothing written yet — and take the push name from the post-gate read. ⚠️ Regression check: a post-gate read that only *re-resolves* (HEAD's old shape) would silently push wherever HEAD landed, which under `--branch main` breaks the guard's own promise — **compare, don't just re-resolve**. A test: fixture `npm test` = `git switch -q other`, bare run, expect exit 1, no bump, no tag, origin unchanged. |
| R9 | 2 | info | `bin/release.mjs:138` | **Unborn HEAD + `--branch main` now aborts with a raw git error where HEAD's script released** (Codex; **measured**). Fresh `git init`, `--branch main --no-test`: HEAD's script skipped `rev-parse` (`branchArg ??`), made the root commit `Release v0.1.1`, pushed, tagged, `✓ Released`; the current script dies at `:138` — `git rev-parse --abbrev-ref HEAD exited 128 / fatal: ambiguous argument 'HEAD'` — **before** the bump, tree untouched. The bare run on an unborn HEAD died in both (HEAD's after the bump, the Round-1 bonus; current before it). Releasing a repo with no history is not a supported shape and the abort is arguably right; the residue is cosmetic — a raw git line instead of a guard sentence, and `--branch other` on an unborn HEAD gets the same raw error instead of the refusal. No behaviour at stake. Recommend **accept as residual**; the alternative is `check: false` on `:138` plus one sentence. |

**Disproven / not recorded:** none — every Codex claim verified against the code; the one severity I
overrode is R2 (Codex *high* → **low**, blast radius traced to the Q2-accepted state).

**Checked and sound (so the coder is not asked to chase these):** guard position — nothing above it
(`rev-parse --is-inside-work-tree`, `git remote`, `rev-parse --abbrev-ref HEAD`) or in `fail()` writes
the tree, index, refs or origin; T1's ordering proof (no `--no-test: releasing WITHOUT` on stderr) is
real — the gate's warning is at `:217`, the guard at `:127`. `!= null` (`:127`) and `??` (`:237`) agree:
a bare trailing `--branch` is `undefined` on both, fall-back to HEAD's branch (E2); `--branch --no-push`
is swallowed as the value `--no-push` and refused loudly (E3, measured). `git()` in the guard keeps
`check: true`, so a failing `rev-parse` exits 1 via `fail()` before any write. `HEAD`, `@`,
`refs/heads/main`, `origin/main` are all refused on an ordinary `main` checkout (measured `@` and
`main`-with-tag; Codex traced the rest). T1: the raw `spawnSync` porcelain read is necessary and
correct — the file's `git()` helper `.trim()`s, and ` M file.txt` (unstaged) vs `M  file.txt` (staged)
is the fact under test (measured both shapes). T2: both arg sets run, each labelled in its assertion
messages. T4: `git checkout -q --detach` works on the fresh fixture (measured; green). Mutation 25:
anchor matches exactly once; `.bak`/`.orig` land in `$work`, not the fixture; the named grep
`0300/branch-mismatch-refused` is a substring of no other test name, so it pins T1; "Seven runs
(baseline + six mutants)" = 0k + {18,19,20,21,22,25} — correct. No regression on 0288's seven tests
(green on the real file; green on mutant 25). Help text `:30`/`:64` matches the new behaviour.

## Coder response

> **Round 1 (2026-08-27)** — coder spawned as the sprint-ship-loop's Process-review worker under the
> declared-approval marker (plan blob `bb523e88…` re-hashed before any edit). Owner rulings relayed by
> the driver (verbatim labels): R4 *"File a follow-up task (Recommended)"* → `0344`; R2, R5, R7 *"Fix in
> Round 2 (Recommended)"*; R1, R3, R6 verified-`CORRECT`, in-plan, applied under the standing approval.
> Every claim below was re-measured before acting — scratch repo with a local bare origin, nothing left
> this machine. **Severities are mine** (traced blast radius), not inherited. Loop check: none of R1–R7
> matches an accepted residual or an ADR re-raise condition; Q2 is *not* touched (R2 covers `--branch
> HEAD` on a detached HEAD, not the bare run — the bare run still bumps, commits and fails the push,
> re-measured after the fix).

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect (low — clean abort, rare repo shape; reproduced: `git tag main` → `--abbrev-ref` says `heads/main`, `--branch main` refused) | Compare via `git symbolic-ref -q HEAD` (`bin/release.mjs:136-139`): `onBranch` = `refs/heads/` stripped, or `null` on exit ≠ 0; guard is `branchArg !== onBranch`; `!= null` kept (E2). **Push name deliberately NOT the user's spelling:** `const branch = headBranch` (`:253`, `--abbrev-ref`'s unambiguous form) — measured that `git push origin main` FAILS with a tag named `main` ("src refspec main matches more than one") while `heads/main` pushes; with the plan's literal `branchArg ?? headBranch` the newly-accepted run died at the push (first green run showed it). Same value on every accepted path, which was the plan's own rationale for the line. Test `0300/branch-name-shadowed-by-tag-accepted` (`test/release-summary.test.js:442`), red-first (fails pre-fix at `code === 0`). Mutation 25 anchor updated to the new `if` line (`test/prove-red.sh:1124`); prove-red result below. | ✅ done |
| R2 | CORRECT | Defect (low — agrees with the reviewer's override of Codex's *high*: loud exit 1, no false green, the Q2-accepted half-released state; reproduced) | Falls out of the R1 shape: `onBranch === null` on a detached HEAD, so **any** `--branch` is refused with "(HEAD is detached)". Bare run on a detached HEAD unchanged (re-measured: bump → `push origin HEAD` fails → exit 1) — Q2 stands. Test `0300/detached-head-with-branch-head-refused` (`:459`), red-first (pre-fix: `✗ --branch HEAD` absent, VERSION bumped). Plan §5's "`HEAD` … refused" is now true on both HEAD states. | ✅ done |
| R3 | CORRECT | Defect in a record (comment overclaimed which misfire the guard catches; the gate itself was sound — anchor count 1) | Added the marker-count guard `grep -c 'mutation: --branch guard disarmed' != 1` (mutation 18's idiom) — that is the co-mutation check R9 was about; kept the survivor grep as the near-miss check; rewrote the comment to say which guard catches which (`test/prove-red.sh:1110-1132`). Isolation sentence extended with the two new tests (`…-head-refused` reds under the mutant; `…-shadowed-by-tag-accepted` stays green). | ✅ done |
| R4 | CORRECT | Frontier (record drift inside 0288's frozen fence — this task may not edit at/after `// --- summary ---`, now `:310`) | None here, by the owner's ruling *"File a follow-up task (Recommended)"* → **`0344`** (`ai-agents/tasks/backlog/0344-refresh-the-stale-line-refs-and-moot-r5-rationale-inside-release-mjss-fenced-summary-block/`, depends on 0300). Note for 0344: after this round's R1/R2 fix the guard is 16 lines longer, so the in-fence refs are stale by **+39**, not +23 (push now `:289-291`, tag checks `:257-259`, summary fence `:310`); re-measure before editing. | won't fix (frontier) → 0344 |
| R5 | CORRECT | Defect (info — wording only; the refusal was always correct and the "Nothing was changed" sentence exact) | (a) Message rewritten to be exact on every path (`bin/release.mjs:144-147`): *"This script commits and tags HEAD but pushes --branch, so the two must be the same branch; refused on every path, --no-tag / --no-push / --dry-run included. Nothing was changed: no bump, no commit, no tag."* (b) Hint is now `git switch ${branchArg}` — measured: `git switch origin/main`, `refs/heads/main`, `--no-push` each refuse without moving HEAD (checkout detached on the first two). T1's assertion updated `git checkout other` → `git switch other`. | ✅ done |
| R6 | CORRECT | Defect in records (three stale comments; verified counts) | `prove-red.sh:211-212` → "fourteen throwaway git fixtures (7× 0288, 7× 0300 — T2 builds two)" — 13 call sites, T2's loop runs twice; `release-summary.test.js:98` "all 7" → "all 13"; `:38-40` now says 18-22 break the summary block and 25 the preflight above it. | ✅ done |
| R7 | CORRECT | Defect in a record (test name claimed an equivalence it does not measure) | Renamed: `0300/branch-current-explicit-released: --branch <current> is accepted — exit 0, ✓ Released, origin/main and the tag both at HEAD` (`:408`). Assertions unchanged. Mutation 25's name grep pins T1, not T3 — unaffected. | ✅ done |

> **Round 2 (2026-08-27)** — coder spawned again as the sprint-ship-loop's Process-review worker under
> the declared-approval marker; plan blob `bb523e88…` re-hashed before any edit (unchanged). Novel set:
> R8, R9 (R1–R7 untouched). Loop check: neither matches an accepted residual, a plan ruling, or an ADR
> re-raise condition — R8 is HEAD moving *after* the guard, not a Q1 re-raise; R9 is a message on a
> path that already aborted before any write, not Q2. Both **reproduced first** in a scratch repo with a
> local bare origin (nothing left this machine). **Severities are mine.** One record correction to R8,
> action unchanged: the bare-run window dates from the **build**, not from Round 1's `const branch =
> headBranch` — plan §1b's `branchArg ?? headBranch` already took the bare run's push name from the
> preflight read (at HEAD `2a64727` the name was resolved at `:214`, *after* `runTests()` at `:191`).

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R8 | CORRECT | Defect (**medium** — the task's own false green, reached by a race: needs HEAD to move during the ~6-min gate, e.g. a `git switch` in another terminal; a **regression vs HEAD** for the bare run, introduced by this task's build step) | Reproduced (fixture `test` script = `git switch -q other`, bare run: commit + tag on `other`, `push origin main` no-op, tag on origin naming a commit no origin branch reaches, `✓ Released`, exit 0). Fix as shaped: after the gate and before the first write (`bin/release.mjs:251-272`, first `writeFileSync` now `:279`), re-read `symbolic-ref -q HEAD` and **compare** to the preflight `onBranch` — never re-resolve; `fail()` with "HEAD moved after the preflight check (during npm test): it was on main, it is on other now … Nothing was changed". Runs on every path (the compare is a no-op under `--no-test`, zero window kept); message exact on every path (R5's lesson: the "(during npm test)" clause is conditional on `doTest`). Push name still the preflight `headBranch` (`:292`) — the compare has just proved it is HEAD's branch. Test `0300/head-moved-during-test-gate-refused` (`test/release-summary.test.js:499`), gate **ON** via a new `releaseWithGateOn()` helper (`:160`) that keeps SEAL 2's substance (asserts the fixture's test script names no `npm`/`node`/`release`, so it cannot re-enter the suite); red-first (pre-round copy: fails at `code === 1`). **prove-red mutation 26** added (`test/prove-red.sh:1150-1182`): disarms the compare's column-0 `if`, same two guards as 25, requires the new test red **by name**; bookkeeping (TWENTY-SIX, index, "18-22, 25 and 26", "sixteen fixtures … 9× 0300", "Eight runs (baseline + seven mutants)", "all seven"). Mutation 25 alone was **not** sufficient: it disarms the preflight guard, which the bare run never enters — measured, the new test stays green under mutant 25. | ✅ done |
| R9 | CORRECT | Defect (**info** — wording on a path that already aborted before any write; releasing an unborn branch is not a supported shape, and the plan §5 row "rev-parse fails in the guard → unreachable" was wrong: unborn HEAD reaches it) | Reproduced (fresh `git init`: `--branch main`, `--branch other`, bare and `--dry-run` all die at the guard's `rev-parse` with git's raw "ambiguous argument 'HEAD'", tree untouched). Applied the one-line shape: `rev-parse --abbrev-ref HEAD` now `check: false` (`bin/release.mjs:142-152`); on failure `fail("HEAD is unborn — branch <name> has no commit yet. Make the first commit before releasing.")` + "Nothing was changed" + git's `fatal:` line (first line only). A non-unborn resolve failure (none known — `symbolic-ref` succeeded, so HEAD is a symref) gets "HEAD does not resolve to a commit" — exact on every path. Sits **above** the `--branch` compare, so `--branch other` on an unborn branch gets the unborn sentence, not the mismatch refusal (the more fundamental problem wins). Test `0300/unborn-head-refused-in-words` (`:532`) — `checkout --orphan` on the existing fixture (same HEAD state as a fresh init, both measured), `--branch newborn` and bare; red-first (pre-round copy: fails at the sentence match). Not recorded as a residual — nothing left to accept. | ✅ done |

**Verification this round** — red-first: `FKIT_RELEASE_MJS=<pre-round-2 copy>` (compare disarmed +
`check: true` restored by sed) → 13 pass / 2 fail, R8's test at `code === 1`, R9's at the sentence match;
`node --test test/release-summary.test.js` → 15/15; `node --test test/*.test.js` → 782/782; hand-built
mutant 26 through the seam reds **only** `0300/head-moved-during-test-gate-refused` (14 pass / 1 fail);
hand-built mutant 25 still reds exactly its four and leaves both new tests green (isolation comment
updated). `bash test/prove-red.sh` → `0k … green`; `25. --branch guard disarmed — "0300/branch-mismatch-refused" should go RED ... red`; `26. post-gate HEAD compare disarmed — "0300/head-moved-during-test-gate-refused" should go RED ... red`; all 26 mutations red by name; `✓ hard gate PASSED`, exit 0 (re-run from scratch after the last edit to the file — a first run was stopped because a comment edit landed while it was executing). Scratch-repo recipe (local bare origin,
`push.followTags false`): R8 race → refused after "✓ npm test green", exit 1, `VERSION` 0.1.0,
`package.json` 0.1.0, no tag, no commit on either branch, `ls-remote` unchanged, tree clean; controls —
bare run with a no-op test script → `✓ Released v0.1.1`, `HEAD = origin/main = v0.1.1^{}`; bare
`--no-test` → `✓ Released v0.1.2`; E4 (detached, bare) unchanged — bump, commit, `push origin HEAD`
fails, exit 1 (Q2 stands). `git diff HEAD -- bin/release.mjs` hunks `@@ -27`, `@@ -61`, `@@ -112`,
`@@ -197`, `@@ -211` — nothing at or after `// --- summary ---` (now `:349`); `git status --porcelain
-- ai-agents/tasks/done/0288-*` empty; plan blob unchanged.

**Not done, on purpose (Round 2):** no check that HEAD's *commit* moved during the gate (someone
committing on the same branch mid-gate) — the gate's own comment already says it tests the tree as it
stood when the suite started, and `git add -A` picks up whatever is there; not R8's finding. No second
compare after the commit (between commit and push nothing waits). The help text and header say nothing
new — the refusal message carries it. Everything from Round 1's list still stands (E4/Q2, in-fence refs →
`0344`, no `--branch` existence check, no isolation gate on 25 or 26).

**Verification this round** — `node --test test/release-summary.test.js` 13/13 (red-first: 11 pass / 2
fail at their first assertions before the guard change); `node --test test/*.test.js` 780/780; `bash
test/prove-red.sh` → `25. … should go RED ... red`, `✓ hard gate PASSED`, exit 0 (all 25 mutations red by name); scratch-repo
recipe re-run for Run A (refused, ` M file.txt` still unstaged, ls-remote unchanged), tag-named-`main`
+ `--branch main` (released, `HEAD = origin/main = v0.1.1^{}`), detached + `--branch HEAD` (refused,
nothing written), detached bare run (E4 unchanged), bare `main` run (released). `git diff HEAD --
bin/release.mjs` hunks at `@@ -27`, `@@ -61`, `@@ -112`, `@@ -211` only — nothing at or after the
summary fence; `git status --porcelain -- ai-agents/tasks/done/0288-*` empty; plan blob unchanged.

**Not done, on purpose:** E4 (bare run on a detached HEAD) — Q2. In-fence refs — `0344`. No
existence check on `--branch`. No isolation gate on mutation 25 (0288 R6). The summary prints
`(branch: heads/main)` in the tag-named-`main` corner — that is `--abbrev-ref`'s name, the one the
push actually used, and the bare run printed the same before this task.

## Accepted residuals (shared, do-not-re-litigate)

- **Inherited from the owner's plan rulings (2026-08-27, verbatim labels)** — Q1 *"Narrow --branch: refuse
  unless checked-out (Recommended)"* · Q2 *"Leave it (Recommended)"* (detached HEAD, **no** `--branch`,
  commits on the detached commit then fails the push) · Q3 *"New 0300/ section in
  release-summary.test.js (Recommended)"* · Q4 *"Add it (Recommended)"* (mutation 25) · Re-raise only if:
  the owner reopens one, or a finding shows the narrowed flag still lets one run commit/tag one ref and
  push another.
- **Inherited from 0288's ledger** — the `:271` (now `:294`) summary fence stays closed; `push.followTags`
  runtime mis-report "Leave it documented"; R6 (mutation isolation documented, not gated); R7; R9
  (mutation 22 has no wrong-target guard). Re-raise conditions as recorded there.
- **Post-compare window (Round 3, Codex C1; owner ruling 2026-08-27, live via `AskUserQuestion`, verbatim
  label *"Record as residual (Recommended)"*)** — What: HEAD is compared to the preflight read **once**,
  after the test gate and before the first write (`bin/release.mjs:262-272`); the five git calls between
  that compare and `git commit` (`tag --list`, `ls-remote --tags`, `status --short`, `add -A`, `diff
  --cached`, `:296-322`) are not re-checked · Why (structural): this script's shape has no atomic
  commit-if-HEAD-is-X and no lock, so a window of *some* size is unavoidable; R8 closed the ~6-minute
  window (the gate), what remains is sub-second locally plus one `ls-remote` round-trip. Rejected: a
  second compare immediately before the commit (moves the window, does not remove it) and a repo lock
  (out of scope for a release script). · Re-raise only if: a lock or an atomic commit shape becomes
  available to the script, or the residual window is observed to bite in practice.
