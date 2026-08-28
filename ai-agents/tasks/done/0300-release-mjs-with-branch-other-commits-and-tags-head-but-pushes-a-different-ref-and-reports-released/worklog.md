# Worklog — 0300: `release.mjs --branch <other>` commits and tags HEAD but pushes a different ref

Build step of the lead's `/fkit-sprint-ship-loop` (Sprint 6), 2026-08-27. Coder spawned as the **Build worker** under the declared-approval marker: plan approved by the owner via `AskUserQuestion` in the live driver session; `plan.md` blob `bb523e883745e0cbd0f903da39520fa49cab9351` confirmed with `git hash-object` before any edit. Built in the plan's §4 order.

## Change surface (`git diff --stat -- bin test`)

```
 bin/release.mjs              |  29 +++++++++--
 test/prove-red.sh            |  43 +++++++++++++---
 test/release-summary.test.js | 113 +++++++++++++++++++++++++++++++++++++++++--
 3 files changed, 173 insertions(+), 12 deletions(-)
```

`git diff bin/release.mjs` hunks: `@@ -27`, `@@ -61`, `@@ -112`, `@@ -211` — all above the `// --- summary ---` line (old `:271`, now `:294`). No hunk at or after it. `git status --porcelain -- ai-agents/tasks/done/0288-*` is empty — the 0288 folder is untouched. No commit, no push, no task move, no `plan.md` edit, no wiki write.

## Anchor drift vs plan §0 / §3 (re-measured before editing)

- `bin/release.mjs`: all anchors matched the plan exactly (`:30`, `:64`, `:86`, `:107-113`, `:115`, `:214`, `:271`).
- `test/prove-red.sh`: index item 24 is at `:50` (plan said "after `:49`" — item 23 is `:49`); mutation 24's closing `fi` is `:1107`, tail `echo` `:1109` (plan said `:1106` / `:1108`). One-line drift, inserted after the real `fi`. `:20`, `:52`, `:211`, `:351`, `:357` matched.
- `test/release-summary.test.js`: `:3`, `:37`, `:41` matched; file ended at `:327`.

## 1. Red-first — T1–T4 written before the guard

`node --test test/release-summary.test.js` against the unmodified `bin/release.mjs`:

```
✔ 0288/default-released … ✔ 0288/no-tag … ✔ 0288/no-push … ✔ 0288/stale-origin-tag …
✔ 0288/local-only-tag … ✔ 0288/failure-speaks … ✔ 0288/dry-run
✖ 0300/branch-mismatch-refused: --branch <other> exits 1 before any mutation — tree, HEAD, tags and origin untouched
✖ 0300/mismatch-under-no-push-and-dry-run: the guard fires under --no-push and --dry-run — no wrong recovery line, no plan
✔ 0300/branch-current-explicit-released: --branch <current> is accepted and releases exactly as the bare run does
✖ 0300/detached-head-with-branch-refused: on a detached HEAD, --branch <name> is refused and the message says so
ℹ tests 11  ℹ pass 8  ℹ fail 3
  AssertionError [ERR_ASSERTION]: --branch other was not refused:
  AssertionError [ERR_ASSERTION]: --branch other --no-push was not refused:
  AssertionError [ERR_ASSERTION]: detached HEAD + --branch main was not refused:
```

Exactly the plan's prediction: T1, T2, T4 red at their first (`code === 1`) assertion; T3 and all 0288/* green. Re-confirmed after the final test-file edits by pointing the suite at `git show HEAD:bin/release.mjs` through the `FKIT_RELEASE_MJS` seam — same 8/3 split, same three first-assertion failures.

## 2. Green — after §1 (guard at `:115-136`, `const branch = branchArg ?? headBranch;` at `:237`, help text `:30`/`:64`)

`node --check bin/release.mjs` clean. `node --test test/release-summary.test.js`:

```
ℹ tests 11  ℹ pass 11  ℹ fail 0
```

## 3. Recipe re-run by hand — scratchpad throwaway repo, LOCAL bare origin (`../origin.git`), `push.followTags false`

Setup: `main` at `initial` → `work`; `other` branched at `initial` and pushed; one **unstaged** edit to `file.txt`.

**Run A — `node bin/release.mjs --branch other --no-test`** (the brief's bug):

```
✗ --branch other: that is not the checked-out branch (HEAD is on main).
  The commit and the tag go to HEAD; the push would go to other — one run would
  tag one ref and publish another. Nothing was changed: no bump, no commit, no tag.
  Check it out first, then release:  git checkout other
exit=1
```

After Run A — clean-abort proof, every value identical to before:

```
VERSION=0.1.0
package.json version=0.1.0
aec7231 work
efa8a37 initial
tags: []
efa8a37…  HEAD / refs/heads/main / refs/heads/other   (ls-remote origin, unchanged)
porcelain: [ M file.txt]                                (still UNSTAGED — no `git add` ran)
```

**Run B — `--branch main --no-test`** → `✓ Released v0.1.1`; `HEAD = origin/main = v0.1.1^{} = fe815f4a…`.
**Run C — bare `--no-test`** (after one more commit) → `✓ Released v0.1.2`; `HEAD = origin/main = v0.1.2^{} = 22c1fe3e…`.

Nothing was pushed anywhere but the scratchpad bare repo. This repo's real remote was never involved.

## 4. prove-red — `bash test/prove-red.sh`

```
25. --branch guard disarmed — "0300/branch-mismatch-refused" should go RED ... red

✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
```

Mutations 1–24 all still `red` at their named assertions; 0k (unmutated copy of `release.mjs`) green. 6 min 30 s wall on this machine.

## 5. `npm test` (full)

`npm test` = `node --test test/*.test.js && bash test/prove-red.sh`, run in full after every edit above:

```
ℹ tests 778   ℹ suites 24   ℹ pass 778   ℹ fail 0   ℹ cancelled 0   ℹ skipped 0   ℹ todo 0
25. --branch guard disarmed — "0300/branch-mismatch-refused" should go RED ... red
✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
npm test exit=0
```

## 0288 residual answered here

0288's ledger carried the accepted residual: "`--branch <other>` + `--no-push` compares and pushes different refs … re-raise only if `--branch` is worked on". This task is that re-raise. After 0300, `--branch <other>` cannot reach the compare, the commit, the tag, or the `Finish it with:` line — it is refused in preflight, under `--no-push` and `--dry-run` too (T2). Recorded here, not in 0288's frozen ledger.

## `--no-test` in the fixture

Every fixture run goes through the `release()` helper's seal-2 `--no-test`. That bypasses 0256's test gate **in the fixture only** (the fixture's `package.json` has no `test` script, so the gate could not run there anyway). The real `bin/release.mjs` still gates every real release on `npm test`. T1 asserts the 0300 guard fires **before** that gate — the stderr must not contain `--no-test: releasing WITHOUT`.

## Decision log (ADR-019 / ADR-032 audit — fixes applied without asking, obvious-winner calls)

1. **T1 porcelain assertion — mechanical adaptation, in-plan.** The plan's assertion `git status --porcelain === ' M file.txt'` cannot be written through the file's `git()` helper: it `.trim()`s, which strips the leading space that IS the fact under test (` M` unstaged vs `M ` staged). The first green run failed only there (`actual 'M file.txt'`). Changed T1 to read the porcelain line raw via `spawnSync` (strip only the trailing newline). Same assertion as the plan, same intent; nothing else in the file changed for it. Qualified: verified-`CORRECT`, localized to one assertion, inside the approved plan.
2. **Second "mutations 18-22" reference in the test file (`:52`, the `FKIT_RELEASE_MJS` comment) → "18-22 and 25".** The plan named only `:37` for this wording change. Obvious winner within the plan's intent ("keep the file's own mutation references in step"): a comment, zero behaviour, and leaving it would make the file contradict itself one paragraph down. Qualified: obvious-winner-within-intent.
3. **Mutation 25 comment says which other tests the mutant reds.** The plan's §3 text says "Isolation … documented in the comment, not gated"; the plan's own closing line names T1, T2, T4 red / T3 + 0288/* green. I wrote that sentence into the mutation's comment block verbatim in substance. In-plan; no gate added (owner declined one in 0288 R6).

No other unattended fix. No frontier-move, no scope change, no `NEEDS-DECISION` raised.

## Deliberately not done

- E4 (detached HEAD with **no** `--branch`) — still commits on the detached commit and then fails the push. Owner Q2 = "Leave it"; file as its own task if wanted.
- No `--branch` existence check (a nonexistent name is refused by the guard; the suggested `git checkout <name>` then errors in git's words).
- `push.followTags=true` runtime mis-report (`:310-319` today) — untouched, owner-ruled "Leave it documented".
- No isolation gate on mutation 25 (documented in its comment only).
- **Stale `:NNN` reference inside the summary block, left as is (fence):** the summary-block comment at `:311` today reads "the branch push at :250-252"; after the guard's +23 lines that push now sits at `:273-275`. The comment is at/after `// --- summary ---`, which this task may not touch. Noting it for the reviewer / a follow-up rather than editing across the fence.
- No commit, no push, no task-file move, no `plan.md` edit, no wiki write, nothing under `ai-agents/tasks/done/0288-*/`.

---

# Process-review — Round 1 (2026-08-27)

Coder spawned as the sprint-ship-loop's **Process-review worker** under the declared-approval marker; plan blob `bb523e883745e0cbd0f903da39520fa49cab9351` re-hashed before any edit. Owner rulings relayed by the driver (verbatim labels): R4 *"File a follow-up task (Recommended)"* → **`0344`**; R2, R5, R7 *"Fix in Round 2 (Recommended)"*; R1, R3, R6 verified-`CORRECT` in-plan fixes under the standing approval. Full dispositions in `review.md` → *Coder response*. Every finding was reproduced before acting (scratch repo, local bare origin; nothing pushed anywhere real).

## What changed (`git diff --stat -- bin test`, cumulative with the build)

```
 bin/release.mjs              |  45 ++++++++++++-
 test/prove-red.sh            |  52 +++++++++++++--
 test/release-summary.test.js | 156 +++++++++++++++++++++++++++++++++++++++++--
 3 files changed, 237 insertions(+), 16 deletions(-)
```

- **`bin/release.mjs:136-148`** (R1, R2, R5): the compare now reads `git symbolic-ref -q HEAD` → `onBranch` (`refs/heads/` stripped, or `null` when detached); guard is `branchArg !== onBranch`. `rev-parse --abbrev-ref HEAD` stays, as the **push name** only. Message reworded to be exact on every path; hint is `git switch ${branchArg}`.
- **`bin/release.mjs:253`**: `const branch = headBranch;` (was `branchArg ?? headBranch`) — see decision log 4.
- **`test/release-summary.test.js`**: two new tests `0300/branch-name-shadowed-by-tag-accepted` (`:442`) and `0300/detached-head-with-branch-head-refused` (`:459`); T1's hint assertion → `git switch other`; T3 renamed (R7); header comments `:38-40`, `:98` (R6).
- **`test/prove-red.sh`**: mutation 25's sed anchor → the new `if` line (`:1124`); marker-count `!= 1` guard added, comment corrected (R3); `:211-212` fixture count → fourteen (R6).
- Fence: `git diff HEAD -- bin/release.mjs` hunks `@@ -27`, `@@ -61`, `@@ -112`, `@@ -211` only; `// --- summary ---` is now `:310` and untouched. `ai-agents/tasks/done/0288-*` untouched. `plan.md` untouched.

## Red-first (the two new tests against the pre-round guard)

```
✖ 0300/branch-name-shadowed-by-tag-accepted …   AssertionError: --branch main was refused because a tag is also named main:
✖ 0300/detached-head-with-branch-head-refused … AssertionError: --branch HEAD slipped the guard on a detached HEAD:
ℹ tests 13  ℹ pass 11  ℹ fail 2
```

First green attempt (guard fixed, `branchArg ?? headBranch` still in place) left `…shadowed-by-tag-accepted` red: the run was accepted, committed, then `• push origin main` failed with `src refspec main matches more than one`. That is what forced decision-log 4.

## Green

- `node --check bin/release.mjs` clean; `node --test test/release-summary.test.js` → `ℹ tests 13  ℹ pass 13  ℹ fail 0`.
- `node --test test/*.test.js` → `ℹ tests 780  ℹ suites 24  ℹ pass 780  ℹ fail 0`.
- `bash test/prove-red.sh` → see the paste at the end of this entry.

## Scratch-repo recipe (local bare origin, `push.followTags false`)

- **Run A** `--branch other --no-test` → `✗ --branch other: that is not the checked-out branch (HEAD is on main).` … `git switch other`; exit 1; `VERSION=0.1.0 pkg=0.1.0 tags=[] porcelain=[ M file.txt]`; `ls-remote` unchanged.
- **R1 case** `git tag main` then `--branch main --no-test` → `• push origin heads/main`, `✓ Released v0.1.1`, `HEAD = origin/main = v0.1.1^{}`.
- **R2 case** `git checkout --detach` then `--branch HEAD --no-test` → `✗ --branch HEAD: … (HEAD is detached).`; exit 1; VERSION, HEAD, tags, `ls-remote` all identical before/after.
- **E4 (Q2, unchanged)** detached, bare `--no-test` → bumps, commits `Release v0.1.2` on the detached commit, `✗ git push origin HEAD exited 1`. Still the owner-accepted state.
- **Bare run on `main`** → `✓ Released v0.1.2`, `HEAD = origin/main = v0.1.2^{}`.
- `--branch origin/main` → hint `git switch origin/main`, which git refuses without moving HEAD (measured; `git checkout origin/main` detached).

## Decision log (ADR-019 / ADR-032 audit — fixes applied without asking, obvious-winner calls)

1. **R1 — compare via `symbolic-ref`** (`bin/release.mjs:136-139`). Answers R1 (and R2 for free). Verified-`CORRECT` (reproduced `heads/main`), mechanical/localized (three lines + the `if` condition), in-plan (the driver's relayed instruction named this exact shape). Regression test red-first.
2. **R2 — any `--branch` on a detached HEAD refused** (same lines). Verified-`CORRECT` (reproduced: bump + commit on the detached commit, push fails). In-plan per the relayed ruling; the bare detached run was re-measured unchanged (Q2 not touched). Regression test red-first.
3. **R3 / R6 / R7 — record fixes** (`test/prove-red.sh:1110-1132`, `:211-212`; `test/release-summary.test.js:38-40`, `:98`, `:408`). Verified-`CORRECT` (counted: 13 fixture call sites, T2 runs twice → 14 fixtures; 13 tests; mutation 25 is a preflight mutation; T3 runs no bare control). Comments and a test name only. The marker-count guard is the reviewer's named hardening in mutation 18's own idiom; the survivor grep was kept because it catches a different misfire.
4. **Obvious-winner within the plan's intent — `const branch = headBranch;` instead of the plan's literal `branchArg ?? headBranch`** (`bin/release.mjs:253`). Answers R1. The plan's stated reason for the line was "same value on every accepted path"; with the R1 fix the two are the same *branch* but not always the same *string*, and the user's spelling is not always a valid refspec: measured `git push origin main` fails when a tag `main` exists ("src refspec main matches more than one") while `--abbrev-ref`'s `heads/main` pushes. Keeping the literal line made the newly-accepted `--branch main` run die at the push — the first green attempt showed it. Pushing `refs/heads/${branch}` instead would have meant editing the push step (`:291`), a line the plan says does not change, and the summary's `${branch}` alongside. One option dominates: the guard has proved `--branch` names HEAD's branch, so the push name is HEAD's own unambiguous name on every accepted path — which is exactly what the bare run already pushed. Zero behaviour change for every repo without a tag shadowing the branch name.
5. **R5(b) — `git switch` instead of `git checkout` in the hint** (`bin/release.mjs:147`; T1 assertion). Answers R5. Verified-`CORRECT` (measured `git checkout origin/main` and `refs/heads/main` detach; `git switch` refuses both and `--no-push` without moving HEAD). Wording-level, inside the relayed "small wording edits" ruling. Git ≥ 2.23 (2019) — the same floor `git switch` has had for six years; this machine is 2.50.
6. **R4 — no edit** across the fence; `won't fix (frontier)` pointing at `0344`. Told 0344 the drift is now +39 (the guard grew by 16 lines this round).

No `NEEDS-DECISION` raised. No frontier-move created here — R4's is the owner's ruling, recorded as such.

## Deliberately not done

- E4 (bare run on a detached HEAD): still bumps, commits, then fails the push — owner Q2 "Leave it".
- Seven stale in-fence `:NNN` refs + the moot R5 rationale under `// --- summary ---` — `0344`.
- No `--branch` existence check; no isolation gate on mutation 25 (0288 R6).
- The summary prints `(branch: heads/main)` in the tag-named-`main` corner — that is the name the push used; the bare run printed the same before 0300. Not changed (the summary block is fenced anyway).
- No commit, no push, no task-file move, no `plan.md` edit, no wiki write, nothing under `ai-agents/tasks/done/0288-*/`.

## prove-red — `bash test/prove-red.sh` (after every edit above)

```
25. --branch guard disarmed — "0300/branch-mismatch-refused" should go RED ... red

✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
exit=0
```

All 25 mutations `red` at their named assertions; 0k (unmutated `release.mjs` copy) green. The new anchor (`if (branchArg != null && branchArg !== onBranch) {`) and the marker-count guard both landed.

---

# Process-review — Round 2 (2026-08-27)

Coder spawned again as the sprint-ship-loop's **Process-review worker** under the declared-approval marker; plan blob `bb523e883745e0cbd0f903da39520fa49cab9351` re-hashed before any edit (unchanged). Novel findings R8, R9 — both reproduced in a scratch repo with a local bare origin before acting (nothing pushed anywhere real). Full dispositions in `review.md` → *Coder response*, Round 2. Ledger `Status` set to `closed-out` (all nine rows done / won't-fix-by-ruling; nothing blocks).

## What changed (`git diff --stat HEAD -- bin test`, cumulative)

```
 bin/release.mjs              |  84 +++++++++++++++-
 test/prove-red.sh            |  87 ++++++++++++++--
 test/release-summary.test.js | 235 +++++++++++++++++++++++++++++++++++++++++--
 3 files changed, 390 insertions(+), 16 deletions(-)
```

- **`bin/release.mjs:142-152`** (R9): the guard's `rev-parse --abbrev-ref HEAD` is `check: false`; on failure a sentence — *"HEAD is unborn — branch <name> has no commit yet. Make the first commit before releasing. Nothing was changed …"* + git's `fatal:` line — instead of the raw `exited 128`. Above the `--branch` compare.
- **`bin/release.mjs:251-272`** (R8): after the test gate, before the first `writeFileSync` (`:279`), re-read `symbolic-ref -q HEAD` and **compare** to the preflight `onBranch`; mismatch → `fail("HEAD moved after the preflight check (during npm test): it was on main, it is on other now …")`. Compare, never re-resolve (a re-resolve would push wherever HEAD landed and break `--branch main`). Push name unchanged (`:292`).
- **`test/release-summary.test.js`**: `releaseWithGateOn()` (`:160`) — the one gate-ON helper, keeping SEAL 2's substance (fixture test script asserted present and free of `npm`/`node`/`release`); tests `0300/head-moved-during-test-gate-refused` (`:499`, fixture test script `git switch -q other`) and `0300/unborn-head-refused-in-words` (`:532`, `checkout --orphan`); header `:3-4`, `:38-39`, `:49-54`, `:60`, `:98`.
- **`test/prove-red.sh`**: **mutation 26** (`:1150-1182`) disarms the post-gate compare and requires the R8 test red by name; bookkeeping `:20` TWENTY-SIX, index `:52`, `:54`, `:212-213` (sixteen fixtures, eight runs), `:352-353`, `:359`; mutation 25's isolation comment names the two new tests as staying green (`:1121-1124`).
- Fence: hunks `@@ -27`, `@@ -61`, `@@ -112`, `@@ -197`, `@@ -211`; `// --- summary ---` now `:349`, untouched. `ai-agents/tasks/done/0288-*` untouched. `plan.md` untouched.

## Red-first (pre-round-2 copy via `FKIT_RELEASE_MJS`: compare disarmed, `check: true` restored by sed)

```
✖ 0300/head-moved-during-test-gate-refused …  AssertionError: HEAD moved during the gate and the run was NOT refused:
✖ 0300/unborn-head-refused-in-words …         AssertionError: --branch newborn: no unborn sentence:
ℹ tests 15  ℹ pass 13  ℹ fail 2
```

## Green

- `node --check bin/release.mjs` clean; `node --test test/release-summary.test.js` → `ℹ tests 15  ℹ pass 15  ℹ fail 0`.
- `node --test test/*.test.js` → `ℹ tests 782  ℹ suites 24  ℹ pass 782  ℹ fail 0`.
- Hand-built mutant 26 through the seam → `ℹ pass 14  ℹ fail 1`, the one red is `0300/head-moved-during-test-gate-refused`. Hand-built mutant 25 → `ℹ pass 11  ℹ fail 4`, its four; both new tests green.
- `bash test/prove-red.sh` → `0k … green`; `25. --branch guard disarmed — "0300/branch-mismatch-refused" should go RED ... red`; `26. post-gate HEAD compare disarmed — "0300/head-moved-during-test-gate-refused" should go RED ... red`; all 26 mutations red by name; `✓ hard gate PASSED`, exit 0 (re-run from scratch after the last edit to the file — a first run was stopped because a comment edit landed while it was executing)

## Scratch-repo recipe (local bare origin, `push.followTags false`)

- **R8 race** — fixture `package.json` test script `git switch -q other`, bare run → `✓ npm test green` then `✗ HEAD moved after the preflight check (during npm test): it was on main, it is on other now.` exit 1; `VERSION=0.1.0 pkg=0.1.0 tags=[]`, `ls-remote` unchanged, porcelain clean, no commit on either branch. Before the fix the same run: commit + tag on `other`, `push origin main` no-op, tag on origin naming a commit no origin branch reaches, `✓ Released`, exit 0.
- **Controls** — test script `true`, bare run → `✓ Released v0.1.1`, `HEAD = origin/main = v0.1.1^{}`; bare `--no-test` → `✓ Released v0.1.2`; E4 (detached, bare `--no-test`) unchanged: commit on the detached commit, `✗ git push origin HEAD exited 1` (Q2 stands).
- **R9** — fresh `git init`, `--branch main` / `--branch other` / bare / `--dry-run`: each `✗ HEAD is unborn — branch main has no commit yet. … Nothing was changed …`, exit 1, `VERSION=0.1.0`, HEAD still `refs/heads/main` unborn. `checkout --orphan newborn` on a committed repo: same sentence naming `newborn`.

## Decision log (ADR-019 / ADR-032 audit — fixes applied without asking, obvious-winner calls)

1. **R8 — post-gate HEAD compare** (`bin/release.mjs:251-272`). Verified-`CORRECT` (reproduced the false green), localized (one block, no line at or after the fence, push step untouched), in-plan: the plan's stated contract is *"the `✓ Released` line can only be reached when the pushed branch is the branch HEAD is on"* and this closes the window the plan's own preflight placement opened; the driver's relay named this exact shape. Red-first test.
2. **R8 — compare on every path, not only under `doTest`.** Obvious winner within intent: one flat block with a column-0 `if` (the same anchor discipline as mutation 25) instead of a nested `if (doTest) { … }`; under `--no-test` it is one extra `symbolic-ref` (milliseconds) and a no-op compare, so the reviewer's "zero window stays zero" holds; the message's "(during npm test)" clause is conditional on `doTest`, so it is exact on every path (R5's lesson).
3. **R8 — `releaseWithGateOn()` beside `release()`** (`test/release-summary.test.js:160`). The reviewer's named test needs the gate ON; `release()` hard-codes `--no-test` (SEAL 2). Obvious winner within intent: SEAL 2's stated hole is a fixture test script that re-enters this suite (`npm test` → this file → `npm test`); the new helper asserts the script is present and names no `npm`/`node`/`release`, so a git one-liner can move HEAD but cannot recurse. The seal moves, it does not drop. `release()` and its assertion are unchanged.
4. **R8 — prove-red mutation 26 added** (driver left the choice to me). Obvious winner within intent: mutation 25 measured **insufficient** (it disarms the preflight guard, which the bare run never enters; the new test stays green under mutant 25); the owner's Q4 ruling ("Add it") is the precedent for pinning a 0300 guard; the file's own thesis is that an unexercised gate hides drift; cost one more ~25 s release-suite run per prove-red. Written in the file's idiom with 25's two guards and full bookkeeping.
5. **R9 — `check: false` + sentence** (`bin/release.mjs:142-152`) rather than `NEEDS-DECISION` for a residual. Verified-`CORRECT` (reproduced), mechanical (one option flag, one `fail()`), in-plan in the sense that plan §5 claimed this failure was unreachable and the guard's message contract is "a sentence + Nothing was changed"; zero behaviour change on any accepted path — the path already aborted before any write, only the words differ. Pinned with a red-first test via `checkout --orphan` on the existing fixture (no second fixture builder; `makeFixture()` still byte-identical). Kept git's `fatal:` line (first line only) so a non-unborn failure, if one ever exists, is still visible.
6. **Record correction in the ledger, not a re-litigation:** the bare-run window came from the build (plan §1b read `headBranch` in preflight), not from Round 1's `const branch = headBranch`. Same fix either way.

No `NEEDS-DECISION` raised. No new residual recorded. No frontier-move created.

## Deliberately not done

- No check that HEAD's **commit** moved on the same branch during the gate — not R8's finding; the gate's comment already says it tests the tree as it stood when the suite started.
- No second compare between commit and push (nothing waits there).
- Header / help text unchanged for R8 and R9 — the refusal messages carry it.
- Round 1's list stands: E4/Q2; in-fence refs → `0344`; no `--branch` existence check; no isolation gate on 25 or 26.
- No commit, no push, no task-file move, no `plan.md` edit, no wiki write, nothing under `ai-agents/tasks/done/0288-*/`.
