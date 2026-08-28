# `release.mjs` with `--branch <other>` commits and tags HEAD but pushes a different ref — and reports `✓ Released`

## ID
0300

## Sprint
Sprint 6

## Priority
Sprint 6 P18

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

### Authority

**Owner ruling 2026-08-14**, given live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop`, and relayed to the filing producer. **The option label is the verbatim
text: "File it as its own task (Recommended)".**

**Provenance:** found by the coder during
[`0288`](../../done/0288-fix-the-post-release-verify-lines-failing-and-false-green-cases/brief.md)'s
review round 1. ⚠️ **Raised by NEITHER reviewer** — neither the Claude pass nor the Codex adversarial
pass surfaced it. **Pre-existing**: it lives in the execute section **above `bin/release.mjs:271`**,
therefore outside `0288`'s fence, and **not introduced by that work**.

### ⚠️ Reproduced independently at filing — this is measured, not relayed

The filing producer was handed this as a worker's finding and **reproduced it first-hand on
2026-08-14** before writing this brief, in a throwaway repo with a **local bare origin**.
⛔ **Nothing was pushed to `flashist/fkit`.**

**Setup:** fresh repo, `bin/release.mjs` copied in verbatim, `VERSION`=`0.1.0`, matching
`package.json`, `git config push.followTags false`, a local bare `origin.git`, branches `main`
(checked out, HEAD) and `other` (both at the initial commit, both pushed).

**Run A — `node bin/release.mjs --branch other --no-test`** (push enabled). Verbatim output, abridged:

```
fkit release → v0.1.1  (branch: other)
• commit: "Release v0.1.1"
[main b519580] Release v0.1.1
• push origin other
• create annotated tag v0.1.1
• push origin v0.1.1
✓ Released v0.1.1
  Verify tag on origin: git ls-remote --exit-code --tags origin v0.1.1 || { ... }
```

**What actually happened:**

| | |
|---|---|
| the release commit | landed on **`main`** (`b519580`) — it is `git commit`, and `git commit` commits to **HEAD** |
| `push origin other` | pushed **`other`, unchanged** — a **silent no-op success** |
| the annotated tag `v0.1.1` | created at **HEAD** (`b519580`, on `main`) |
| `push origin v0.1.1` | **succeeded** — origin now carries `refs/tags/v0.1.1^{} = b519580` |
| origin's branches | `refs/heads/main = 2ea2c41`, `refs/heads/other = 2ea2c41` — **both still the initial commit** |
| `git branch -r --contains HEAD` | **empty** — the tagged commit is reachable from **no branch on origin** |
| the summary | **`✓ Released v0.1.1`** |

**⚠️⚠️ The `✓ Released` is a FALSE GREEN, and `0288`'s own verify command PASSES on it.** The printed
`git ls-remote --exit-code --tags origin v0.1.1` check succeeds — the tag *is* on origin. It just
names a commit origin has no branch pointing at. A release was announced; the released code was never
published.

**Run B — `node bin/release.mjs --branch other --no-push --no-test`.** Verbatim, abridged:

```
• commit: "Release v0.1.2"
[main c920147] Release v0.1.2
• skip branch push (--no-push)
• create annotated tag v0.1.2
• skip tag push (--no-push)
⚠ NOT released — nothing was pushed (--no-push)
  v0.1.2 is committed and tagged locally only.
  Finish it with: git push origin other && git push origin v0.1.2
```

**The recovery command is wrong.** `c920147` and the tag are on **`main`**. Following that line
publishes nothing from `other` and then publishes a tag naming an unreachable commit — **it
hand-builds Run A's broken state.**

### Root cause — one line, above the fence

`bin/release.mjs:214` (measured 2026-08-14):

```js
const branch = branchArg ?? git(["rev-parse", "--abbrev-ref", "HEAD"], { quiet: true }).out;
```

`branch` is used **only** as a push target (`:251-252`, `git push origin ${branch}`). Nothing checks
`${branch}` out, and nothing compares it to HEAD. Meanwhile `git commit` (`:245`) and `git tag -a`
(`:260`) both act on **HEAD**. So `--branch <other>` silently **decouples what is committed and
tagged from what is pushed**. The `--help` text at `:30`/`:64` says *"`--branch <name>` Branch to
push (default: current branch)"* — literally accurate, and that literal accuracy is what hides the
hazard.

**Everything above is at `:214`–`:268`, i.e. above `:271`.** `0288`'s fence is not implicated by the
root cause.

## What to build

A fix that makes it **impossible** for one run to commit/tag one ref and push another.

### The recommended shape — a preflight guard, entirely above `:271`

When `--branch <name>` is passed and `<name>` is **not** the current HEAD branch, `fail()` with a
speaking message before anything mutates. Place it with the other preflight checks (`:107-111`), i.e.
**before the test gate and before the first `writeFileSync`** — so a rejected run leaves the tree
exactly as the user left it, the same reasoning the test gate's own position comment (`:159-166`)
gives.

The message must say the three things a user needs: what they asked for, why it cannot be honoured
(the commit and tag go to HEAD, the push would go elsewhere), and what to do instead (`git checkout
<name>` first, then release).

**Why this shape:**

- ✅ It fixes **both** runs — A never reaches the push, B never reaches the wrong recovery line.
- ✅ **It does not require lifting `0288`'s `:271` fence.** The run aborts before the summary block,
  so nothing below `:271` changes. **This is the deciding argument** — see the fence note below.
- ✅ It is small, and it fails **loud and early** rather than repairing a half-published release.
- ⚠️ **Tradeoff, stated plainly: it removes a documented capability.** `--branch <name>` currently
  advertises pushing an arbitrary branch. After this, it only accepts the current one — which makes
  the flag nearly vestigial. **The alternative** — checking `<name>` out, or committing/tagging on it
  — is a much larger behavioural change to a release tool and is **not** what this task scopes.
  ⚠️ **If you judge the flag should be removed outright rather than narrowed, STOP and report** —
  removing a documented CLI flag is an owner decision, not a coder's.

### ⛔⛔ THE `:271` FENCE — do not assume it is open

`0288` is closed and its fence stands: **`bin/release.mjs:271` and below is `0288`'s territory.**

- If your fix is the preflight guard, you **never touch below `:271`** and there is nothing to ask.
- ⛔ **If your chosen fix instead corrects the summary/recovery lines** (`:322`, `:326`, `:330`,
  `:344-350`) so they name the right ref — **that is below `:271`, the fence is NOT open, and you must
  STOP and report** rather than editing. Say so explicitly in your plan before writing code.

⚠️ **Related, and explicitly NOT in this task's scope.** `0288` documented a second above-`:271`
issue: `release.mjs` cannot see a tag its **own branch push** published under a maintainer's global
`push.followTags=true` (the comment block at `:287-296` records the measurement). The owner ruled
**"Leave it documented"** and **declined to lift the `:271` fence** for it. ⛔ Do not fold it in. ⛔ Do
not "fix" it while you are in the file.

## Verification steps

1. **Reproduce it yourself first, before writing a line of code.** ⛔ **Only against a throwaway clone
   with a LOCAL BARE ORIGIN. NEVER push to `flashist/fkit`.** The recipe, which the filing producer
   ran on 2026-08-14:
   - `git init --bare /tmp/<x>/origin.git`; a work repo with `bin/release.mjs` copied in, `VERSION`
     and `package.json` both `0.1.0`, `git config push.followTags false`, remote `origin` pointing at
     the bare repo, branches `main` (HEAD) and `other` both pushed.
   - Run A: `node bin/release.mjs --branch other --no-test`. **Paste the output.**
   - Assert the breakage: `git ls-remote origin` shows `refs/tags/v0.1.1^{}` at a commit that
     `refs/heads/other` and `refs/heads/main` do **not** point at, and `git branch -r --contains HEAD`
     is **empty**.
   - Run B: `node bin/release.mjs --branch other --no-push --no-test`, and show the
     `Finish it with: git push origin other && git push origin v0.1.2` line naming a branch that does
     not carry the commit.
   ⚠️ **If you cannot reproduce it, STOP and report. Do not fix a defect you could not observe.**
2. **`--no-test` is mandatory in the fixture** — the release runs `npm test` otherwise, and the
   throwaway repo has no suite. Note in the close that this deliberately bypasses `0256`'s gate **in
   the fixture only**.
3. **Red-prove the guard:** with the fix in, Run A must now **exit non-zero before any mutation**.
   Confirm afterwards that `VERSION`, `package.json`, `git log` and `git tag` are all **unchanged** —
   the abort must be clean. Paste the evidence.
4. **Prove the normal path still works:** `node bin/release.mjs --branch main --no-test` (naming the
   current branch explicitly) and a bare `node bin/release.mjs --no-test` must both still release
   correctly against the local bare origin. ⚠️ **A guard that breaks the default path is a worse bug
   than the one it fixes.**
5. **Add a regression test.** `test/release-summary.test.js` already exists and is the likely home —
   **verify that before assuming it.** ADR-014: `node --test`, **zero devDependencies**, no new
   runner, no new npm script.
6. `npm test` green.
7. `git diff --stat` must not list any file under `ai-agents/tasks/done/0288-*/`.

## Notes

- **Depends on:** nothing. **Blocks:** nothing.
- **⚠️⚠️ CONCURRENCY — THE LOUDEST ITEM ON THIS BRIEF.** Measured **2026-08-14 at filing**: a reviewer
  session was **actively working on `bin/release.mjs`, on `test/`, and on `0288`'s `review.md`**.
  ⛔ **Do not start this task while that work is live** — it is the same file, and the collision would
  be at close range. **Confirm the reviewer's work has landed before beginning**, and **re-measure
  every `:NNN` in this brief against the file**; the durable anchors are the quoted code and comment
  text, not the numbers.
- ⛔ **Do not edit anything under `ai-agents/tasks/done/0288-.../`** — a closed task folder and its
  frozen ledger.
- ⛔ **No `wiki-vault/` write** (ADR-005). ⛔ **No task-file move** (ADR-033) — route the close to
  `@fkit-producer`.
- **⚠️ Filed by a spawned producer with no owner channel.** No ranking was assigned (ADR-035). The
  **severity argument for ranking this high is the false green**: a `--branch <other>` release
  announces `✓ Released` and passes its own verify command while publishing a tag no origin branch
  reaches. The rank itself is the owner's.
