# `release.mjs --branch <other>` commits and tags HEAD but pushes a different ref — and reports `✓ Released`

**Source**: `ai-agents/tasks/done/0300-release-mjs-with-branch-other-commits-and-tags-head-but-pushes-a-different-ref-and-reports-released/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P18` · ID 0300 · owner `fkit-coder` · **three review rounds**, 2026-08-27

## Goal

⚠️⚠️ **A false green in the release tool.** `bin/release.mjs --branch <other>` commits and tags **HEAD**, pushes **`<other>`** (a silent no-op success), pushes the tag, and prints **`✓ Released`** — leaving origin carrying a tag that names **a commit no branch on origin reaches.** ⛔ **`0288`'s own printed verify command PASSES on it**, because the tag really is on origin.

⭐ **Found by the coder during `0288`'s review round 1 — raised by NEITHER reviewer**, on a review where Codex coverage was FULL. Pre-existing, above `0288`'s `:271` fence.

⭐ **Reproduced first-hand by the filing producer before the brief was written**, in a throwaway repo with a **local bare origin** — ⛔ nothing pushed to the real remote. `git branch -r --contains HEAD` came back **empty**.

⚠️ **And the `--no-push` recovery hint is wrong too** — it says `git push origin other && git push origin v0.1.2`, which **hand-builds the broken state**.

### Root cause — one line

`branch` is resolved from `--branch` or HEAD and used **only as a push target**. Nothing checks it out and nothing compares it to HEAD, while `git commit` and `git tag -a` both act on HEAD. ⭐ **The `--help` text — *"Branch to push (default: current branch)"* — is literally accurate, and that literal accuracy is what hides the hazard.**

### ⛔⛔ The `:271` fence

`0288` is closed and its fence stands. ⭐ **The preflight-guard shape was chosen partly BECAUSE it never touches below the fence** — *"this is the deciding argument"*. ⛔ If the fix had instead corrected the summary/recovery lines, **the task was to STOP and report, not edit.**

⚠️ **The tradeoff was stated plainly, not discovered later: the guard removes a documented capability**, making `--branch` nearly vestigial. ⛔ **Removing a documented CLI flag outright is an owner decision, not a coder's** — the brief instructed a STOP if the implementer judged that better.

## Key Changes

A **preflight guard** placed with the other preflight checks — **before the test gate and before the first `writeFileSync`**, so a rejected run leaves the tree exactly as the user left it. Plus a `0300/` section in `test/release-summary.test.js` and **prove-red mutation 25**.

`node --test test/*.test.js` → **778/778**; `bash test/prove-red.sh` → **hard gate PASSED**, mutation 25 reding its named assertion.

## Outcome

**Three rounds, nine findings, every one CORRECT.** Reviewers: Claude (with execution) + Codex (`codex exec --sandbox read-only`, **reasoning-only** per [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] D1 — ⛔ **all execution evidence is the Claude reviewer's**). Coverage **complete** every round.

⭐ **The fence was re-checked mechanically each round** — `git diff HEAD -- bin/release.mjs` hunks confirmed to stop short of `// --- summary ---`, and `git status` on `0288`'s folder confirmed empty.

### ⭐⭐ R8 — the defect class came BACK through a race, as a regression this task introduced

**HEAD is read at preflight and acted on after the ~6-minute test gate.** Codex measured it: a fixture whose `npm test` runs `git switch -q other`, on the **bare** run, reproduces the original defect exactly — commit and tag on `other`, `push origin main` a no-op, a tag on origin naming an unreachable commit, `✓ Released`, exit 0. ⛔ **A regression versus HEAD for the bare run, introduced by this task's own build step.** Fixed by **re-reading HEAD after the gate and before the first write**.

### The other findings

- **R1 (both):** ⭐ **a false refusal on an ambiguous short name.** With a **tag** named `main` in the repo, `git rev-parse --abbrev-ref HEAD` prints `heads/main`, so a legitimate `--branch main` on `main` is refused — **and the suggested fix changes nothing**, making the flag unusable in that repo. Fixed by comparing via `symbolic-ref -q HEAD`. ⭐ **The push name deliberately does NOT use the user's spelling**, because `git push origin main` fails with a tag of that name while `heads/main` pushes fine.
- **R2 (both; Codex rated `high`, reviewer overrode to `low`):** on a detached HEAD, `--branch HEAD` **bypassed the guard**. ⭐ The override is reasoned: **loud exit 1, no false green** — the exact state the owner had already accepted under Q2.
- **R3 (both):** ⭐ **the prove-red count guard detects UNDER-mutation, and its comment claimed the opposite.** `sed s///` rewrites every matching line, so a second co-mutated copy would still read 0. Fixed by adding the marker-count guard that really is the co-mutation check.
- **R4:** ⭐ **seven `:NNN` references inside `0288`'s frozen fence went stale by +23 when the guard landed** — and the worklog named only one. ⛔ **This task may not edit them.** Filed as `0344`, ⭐ **with a note that after the round-1 fix the drift is +39, not +23 — re-measure before editing.**
- **R5 (info):** the refusal message was **unconditional and not exact on every path** — it spoke of a push and a tag under `--no-tag` / `--no-push` / `--dry-run`. ✅ The load-bearing sentence *"Nothing was changed"* **was** exact on every path, verified. Rewritten anyway, and the hint changed to `git switch`, measured against three shapes that must not move HEAD.
- **R6:** three stale bookkeeping comments — *"seven throwaway git fixtures"* is now **fourteen**, *"all 7 tests"* is now 13, and a line claiming mutation 25 breaks the summary block **contradicted a correct paragraph six lines below it**.
- **R7 (both, info):** ⭐ **a test NAME overclaimed** — *"releases exactly as the bare run does"* while running no bare control and comparing no output. **The assertions were sound and not tautological; only the name claimed equivalence.** Renamed.
- **R9 (info):** on an **unborn HEAD**, the new guard aborted with a raw git error where the old script had released. ⭐ **And the plan's own row saying that path was unreachable was wrong** — unborn HEAD reaches it. ⭐ **Round 1 had already recorded the mirror-image bonus**: the old script bumped `VERSION` and *then* died, leaving the tree dirty; the guard now dies **before** the bump, a clean abort.

### Accepted residuals

- ⛔ **A post-compare window remains.** HEAD is compared **once**, after the gate and before the first write; five git calls between that compare and `git commit` are not re-checked. ⭐ *"This script's shape has no atomic commit-if-HEAD-is-X and no lock, so a window of some size is unavoidable."* R8 closed the ~6-minute one; what remains is sub-second plus one `ls-remote` round-trip. **Rejected: a second compare immediately before the commit — it moves the window, it does not remove it.**
- **Inherited from `0288`:** the summary fence stays closed; the `push.followTags` runtime mis-report is *"Leave it documented"*; mutation isolation is documented, not gated.
- ⭐ **`0288`'s residual *"`--branch <other>` + `--no-push` compares and pushes different refs — re-raise only if `--branch` is worked on"* had its condition met by this task and is ANSWERED, not re-litigated** — the guard makes that state unreachable, proven by a test.

⚠️ **The concurrency warning was the loudest item on the brief** — a reviewer session was actively working on the same file at filing time, and the brief instructed the implementer to confirm that work had landed and **re-measure every `:NNN`**, the durable anchors being the quoted code, not the numbers.

## Related
- [[tasks/fix-the-post-release-verify-lines-failing-and-false-green-cases]] — `0288`, whose review surfaced this and whose `:271` fence bounds it
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — `0256`, the test gate this guard sits above, and which the fixtures bypass with `--no-test`
- [[systems/install-and-self-update]] — the release channel `bin/release.mjs` publishes to
- [[systems/testing-and-verification]] — prove-red, now carrying mutation 25
- [[decisions/adr-014-how-fkit-tests-itself]] — the zero-devDeps rule the regression test respects
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — the coverage state declared each round
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — the board this ran on
