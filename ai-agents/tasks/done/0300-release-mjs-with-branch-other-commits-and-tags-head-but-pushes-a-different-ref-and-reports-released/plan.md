# Plan — 0300: `release.mjs --branch <other>` commits and tags HEAD but pushes a different ref

> Approved by the owner via `AskUserQuestion` in a live `fkit lead` session driving `/fkit-sprint-ship-loop`, 2026-08-27. Written by the driver at approval, before the Build spawn (ADR-020). Rulings on Q1–Q4 are appended at the end.

Bug reproduced first-hand 2026-08-27 in a throwaway repo with a local bare origin (nothing pushed anywhere real): Run A commits on `main`, `push origin other` is a no-op, the tag lands on origin naming a commit no origin branch reaches, script prints `✓ Released`, exit 0. Run B (`--no-push`) prints `Finish it with: git push origin other && git push origin v0.1.2` while the commit and tag sit on `main`. Root cause at the brief's anchors, re-measured today: `:214` picks `branch` from `--branch`, `:244` commits HEAD, `:260` tags HEAD, `:252` pushes `${branch}`. Nothing compares the two.

## 0. Measured today (2026-08-27)

| Anchor | Line today | Text |
|---|---|---|
| `--branch` header comment | `bin/release.mjs:30` | `//   --branch <name>     Branch to push (default: current branch)` |
| `--branch` help text | `:64` | `  --branch <name>     Branch to push (default: current branch)` |
| flag parse | `:86` | `const branchArg = getArg("--branch", null);` |
| preflight block | `:107-113` | `// --- preflight ---` … `fail("no 'origin' remote configured");` `}` |
| first read of files | `:115-118` | `const pkgPath = …` |
| test gate call | `:188-198` | `if (doTest) { … } else { console.error("⚠ --no-test: …") }` |
| first write | `:204` | `writeFileSync(versionPath, …)` |
| the bug line | `:214` | `const branch = branchArg ?? git(["rev-parse", "--abbrev-ref", "HEAD"], { quiet: true }).out;` |
| commit / push / tag | `:244` / `:252` / `:260` | `git commit` / `git push origin ${branch}` / `git tag -a` |
| 0288 fence | `:271` | `// --- summary ---` |

Edge-case measurements in the throwaway repo:
- E1 `--branch main` while on `main` → works, `push origin main`.
- E2 bare trailing `--branch` (no value) → `getArg` returns `undefined`, `??` falls back to the current branch — today's behaviour is "flag ignored".
- E3 `--branch --no-push` → `branch` becomes the string `--no-push` **and** `--no-push` is honoured. Silent today.
- E4 detached HEAD, no `--branch` → `branch` = `HEAD`; the script **commits the bump on the detached commit, then** `git push origin HEAD` fails, exit 1, tree left half-released. Pre-existing, not this task's bug.
- E5 detached HEAD + `--branch main` → today: pushes `main` while the commit/tag sit on the detached commit — the same bug in another costume.
- E6 `git status --porcelain` shapes: unstaged edit is ` M file.txt`; after `git add -A` it is `M  file.txt`. This is the clean-abort probe the test uses.
- One run of `test/release-summary.test.js`: 6.56 s real on this machine today.

## 1. Code change — `bin/release.mjs`, all above `:271`

**1a. Insert the guard after `:113` (end of the preflight block), before `const pkgPath` at `:115`.**

```js
// --- --branch must name the CHECKED-OUT branch (task 0300) -------------------
// `git commit` (step 1) and `git tag -a` (step 3) act on HEAD; only the push (step 2)
// reads ${branch}. A --branch that is not HEAD's branch therefore commits and tags one
// ref and publishes another — MEASURED 2026-08-14: the tag lands on origin naming a
// commit no origin branch reaches, and the summary still prints ✓ Released.
//
// ⚠️ POSITION IS LOAD-BEARING, for the test gate's own reason (see below): this runs
// before the gate and before the first writeFileSync, so a refused run leaves the tree
// exactly as the user left it — no bump, no `git add`, no commit, no tag.
// `!= null` on purpose: a bare trailing `--branch` parses as undefined and keeps today's
// fall-back to the current branch.
const headBranch = git(["rev-parse", "--abbrev-ref", "HEAD"], { quiet: true }).out;
if (branchArg != null && branchArg !== headBranch) {
  fail(
    `--branch ${branchArg}: that is not the checked-out branch` +
      (headBranch === "HEAD" ? " (HEAD is detached)" : ` (HEAD is on ${headBranch})`) +
      `.\n` +
      `  The commit and the tag go to HEAD; the push would go to ${branchArg} — one run would\n` +
      `  tag one ref and publish another. Nothing was changed: no bump, no commit, no tag.\n` +
      `  Check it out first, then release:  git checkout ${branchArg}`,
  );
}
```

The `if (…) {` line sits at column 0 and is unique in the file — mutation 25's anchor (§3).

**1b. `:214` becomes**

```js
const branch = branchArg ?? headBranch;
```

Same value on every accepted path; drops the duplicate `rev-parse`.

**1c. Help text, `:30` and `:64`**, same wording in both:

```
  --branch <name>     Branch to push — must be the checked-out branch (default: current branch)
```

Nothing at or below `:271` changes. No change to `:287-296` (the `push.followTags` comment the owner ruled "Leave it documented").

**Behaviour after the change**
- `--branch <other>` (≠ HEAD's branch): exit 1 with the message above, before the test gate, before any write. Fires under `--no-push` and `--dry-run` too (same precedent as the test gate).
- `--branch <current>`: accepted, identical to the bare run.
- No `--branch`: unchanged.
- Detached HEAD + `--branch x`: refused, message says `(HEAD is detached)`.
- Detached HEAD, no `--branch`: unchanged (E4) — Q2 ruled leave it.
- `--branch --no-push` (E3): now refused loudly — a side benefit.

"Reports Released" afterwards means: the `✓ Released` line can only be reached when the pushed branch is the branch HEAD is on. The summary block itself is unchanged; the guard makes its assumption true.

## 2. Tests — `test/release-summary.test.js` (Q3)

Fixture additions live **inside the new tests**, not in `makeFixture()` (0288's fixture stays byte-identical): `git(repo, ['branch', 'other']); git(repo, ['push', '-q', 'origin', 'other']);`. The `release()` helper's `--no-test` seal is reused unchanged.

New section after test 7 (`:327`), header `// ── 0300. --branch must be the checked-out branch ──`:

**T1 `0300/branch-mismatch-refused: --branch <other> exits 1 before any mutation — tree, HEAD, tags and origin untouched`** — fixture + `other` pushed, `commitWork`, an **unstaged** edit; snapshot HEAD and `ls-remote origin`; run `--branch other`; assert `code === 1`, stderr `/✗ --branch other/` + `HEAD is on main` + `git checkout other`; stdout has no `• commit`, `push origin`, `✓ Released`, no summary rule; stderr does **not** contain `--no-test: releasing WITHOUT` (proves the guard fired before the gate); `VERSION` `0.1.0`, `package.json` `0.1.0`, HEAD unchanged, `git tag --list` empty, `git status --porcelain === ' M file.txt'`, `ls-remote` unchanged. Red-first: fails pre-fix at the first assertion. Mutation 25's named assertion.

**T2 `0300/mismatch-under-no-push-and-dry-run: the guard fires under --no-push and --dry-run — no wrong recovery line, no plan`** — loop `['--branch','other','--no-push']` and `['--branch','other','--dry-run']`; each `code === 1`, stderr `/✗ --branch other/`, stdout lacks `Finish it with` and `Dry run`; tags empty, `VERSION` `0.1.0`. Red-first. Named distinctly from T1 (0288 R10's lesson).

**T3 `0300/branch-current-explicit-released: --branch <current> is accepted and releases exactly as the bare run does`** — `--branch main`: `code === 0`, `✓ Released v0.1.1`, `originMain === HEAD`, tag on origin, `v0.1.1^{} === HEAD`. Not red-first — regression fence.

**T4 `0300/detached-head-with-branch-refused: on a detached HEAD, --branch <name> is refused and the message says so`** — `git checkout -q --detach`, `--branch main`: `code === 1`, stderr `/HEAD is detached/` + `/✗ --branch main/`, `VERSION` `0.1.0`, tags empty, `ls-remote` unchanged. Red-first (E5).

File header edits: `:3` SCOPE sentence gains "and, since task 0300, the `--branch` preflight guard above it"; a short 0300 paragraph after `:41`; `:37` "mutations 18-22" → "18-22 and 25". Lines `:4-5` (the ⛔ 0288 fence sentence) stay.

## 3. prove-red — `test/prove-red.sh` mutation 25 (Q4)

Insert after mutation 24 (ends `:1106`), before the tail at `:1108`:

```sh
# --- Mutation 25: disarm the --branch preflight guard → the 0300/branch-mismatch-refused assertion
#     must go red (task 0300). With the guard off, `--branch other` commits and tags HEAD, pushes
#     `other` unchanged, and prints ✓ Released — the measured false green. Anchored on the guard's
#     column-0 `if` line, which is unique in the file; the count guard below is the wrong-target
#     check mutation 22 lacks (0288 R9). ---------------------------------------------------------
m25="$(make_release_copy release-mutant-branch-guard)"
cp "$m25" "$m25.orig"
sed -i.bak 's/^if (branchArg != null && branchArg !== headBranch) {$/if (false) { \/\/ mutation: --branch guard disarmed/' "$m25"
if cmp -s "$m25" "$m25.orig"; then
  echo "25. --branch guard disarmed ... ✗ MUTATION WAS A NO-OP — the sed no longer matches."
  echo "   This gate is disarmed: it would report success while proving nothing. Fix the mutation in"
  echo "   test/prove-red.sh before trusting any result above."
  fail=1
elif ! grep -q 'mutation: --branch guard disarmed' "$m25"; then
  echo "25. --branch guard disarmed ... ✗ MUTATION DID NOT LAND — marker absent from the mutant."; fail=1
elif [ "$(grep -c '^if (branchArg != null' "$m25")" != 0 ]; then
  echo "25. --branch guard disarmed ... ✗ WRONG TARGET — an un-mutated guard line survives."; fail=1
fi
printf '25. --branch guard disarmed — "0300/branch-mismatch-refused" should go RED ... '
r25="$(run_release_suite "$m25")"; echo "$r25"
if [ "$r25" != red ]; then
  echo "   ✗ the suite did NOT catch a --branch <other> run that commits HEAD and pushes another ref —"
  echo "     the 0300 guard is not load-bearing."; fail=1
elif ! grep -Eq '(✖|not ok|fail).*0300/branch-mismatch-refused' "$out"; then
  echo "   ✗ suite went red but NOT at 0300/branch-mismatch-refused — red for the wrong reason."; fail=1
fi
```

Bookkeeping: `:20` `TWENTY-FOUR` → `TWENTY-FIVE`; index entry after `:49`: `#  25. Disarm the --branch preflight guard          → "0300/branch-mismatch-refused"      (task 0300)`; `:52` "18-22" → "18-22 AND 25"; `:210-211` "Six runs (baseline + five mutants)" → "Seven runs (baseline + six mutants)"; `:348-357` "mutations 18-22" → "18-22 and 25", "all five" → "all six". Isolation (the mutant leaves `0288/*` green) documented in the comment, not gated (owner declined an isolation gate in 0288 R6).

Under the mutant: T1, T2 and T4 go red, T3 and all `0288/*` stay green; the named grep pins T1.

## 4. Verification (build step)
1. Write T1–T4 first, run `node --test test/release-summary.test.js` → T1, T2, T4 red, T3 green, 0288/* green (red-first evidence, paste).
2. Apply §1; re-run → 11/11 green. `node --check bin/release.mjs`.
3. Re-run the brief's recipe by hand in a throwaway repo (scratchpad, local bare origin, `push.followTags false`): Run A now exits 1 before any mutation — paste output and unchanged `VERSION`, `package.json`, `git log --oneline -3`, `git tag`, `git ls-remote origin`; then `node bin/release.mjs --branch main --no-test` and bare `node bin/release.mjs --no-test` both release (`✓ Released`, tag peel = HEAD = `origin/main`).
4. `bash test/prove-red.sh` → gate PASSED, "25. … should go RED ... red".
5. `npm test` green (full).
6. `git diff --stat` lists only `bin/release.mjs`, `test/release-summary.test.js`, `test/prove-red.sh`; nothing under `ai-agents/tasks/done/0288-*/`; `git diff bin/release.mjs` shows no hunk at or after the `// --- summary ---` line.

## 5. Edge cases / failure modes

| Case | After the fix | Note |
|---|---|---|
| detached HEAD + `--branch x` | refused, "(HEAD is detached)" | T4 |
| detached HEAD, no `--branch` | unchanged: commits on the detached commit, push fails, exit 1 (E4) | pre-existing; Q2 = leave |
| `--branch` names a branch that does not exist locally | refused by the guard; the suggested `git checkout <name>` then errors in git's own words | no existence check added |
| `--branch <current>` where current is not on origin yet | accepted; `git push origin <current>` creates it | unchanged |
| tag already exists (local / origin) | unchanged (`:218-229`, `:258`, summary N1/R2 paths); the guard runs first | 0288 territory, untouched |
| dirty tree | not required clean (same as the test gate); a refused run leaves unstaged edits unstaged | T1 asserts the ` M` shape |
| `--branch` equal to current | accepted | T3, E1 |
| bare trailing `--branch` | `undefined` → falls back to current, as today (E2) | `!= null` keeps this |
| `--branch --no-push` (value swallowed) | refused loudly (E3 was silent) | improvement, not a goal |
| `--branch refs/heads/main`, `origin/main`, `HEAD`, `@` | refused — plain string compare against `rev-parse --abbrev-ref HEAD` | help text: "must be the checked-out branch" |
| `--dry-run` + mismatch | refused, no plan printed | test-gate precedent; T2 |
| push rejected (non-fast-forward, auth) | unchanged: `check: true` → `fail()` exit 1 after the local commit/tag exist; header's `--no-bump` re-run advice applies | pre-existing |
| `push.followTags=true` runtime mis-report | untouched | owner-ruled "Leave it documented" |
| `git rev-parse` fails in the guard (not a repo) | unreachable — `:108` already failed | — |

## 6. How each ruling / caveat in the brief is honoured
- **Owner ruling 2026-08-14, verbatim label "File it as its own task (Recommended)"** — this plan is that task alone; nothing from 0288 is reopened and nothing else is folded in.
- **`:271` fence** — every edit is at `:30`, `:64`, `:114` (new), `:214`; no hunk at or below `:271`; verification step 6 checks it mechanically.
- **`push.followTags` "Leave it documented"** — `:287-296` untouched.
- **Do not remove the flag without the owner** — the plan narrows, it does not remove (Q1).
- **Concurrency** — reviewer's 0288 work landed (`2a64727`); `:NNN` anchors re-measured today and listed in §0.
- **0288 folder frozen** — untouched. Its residual "`--branch <other>` + `--no-push` compares and pushes different refs … re-raise only if `--branch` is worked on" is answered by this task; that goes in 0300's own worklog/review, not in 0288's ledger.
- **Reproduce before coding** — done today (§0). Stop-if-not-reproducible: not triggered.
- **`--no-test` in the fixture** — via the existing seal-2 helper; the close will state it bypasses 0256's gate in the fixture only.
- **ADR-014 / ADR-026** — `node --test`, zero devDeps, no new runner or npm script; prove-red mutation hand-rolled in the file's own idiom.
- **No wiki write, no task move** — close routed to `@fkit-producer` by the driver.

## 7. Owner rulings — `AskUserQuestion`, live `fkit lead` session, 2026-08-27 (verbatim option labels)
- **Plan gate:** "Approve".
- **Q1 (fix shape):** "Narrow --branch: refuse unless checked-out (Recommended)".
- **Q2 (detached HEAD, no `--branch`):** "Leave it (Recommended)" — pre-existing E4 stays; file as its own task if wanted.
- **Q3 (test home):** "New 0300/ section in release-summary.test.js (Recommended)".
- **Q4 (prove-red mutation 25):** "Add it (Recommended)".
