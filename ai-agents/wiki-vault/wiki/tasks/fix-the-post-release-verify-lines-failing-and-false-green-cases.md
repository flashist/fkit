# Fix the post-release verify line's failing and false-green cases in `bin/release.mjs`

**Source**: `ai-agents/tasks/done/0288-fix-the-post-release-verify-lines-failing-and-false-green-cases/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-14
**Sprint/Tag**: Backlog board, unscheduled and **unranked** · task `0288` · owner `fkit-coder`

> ⚠️⚠️ **Read the residuals before you read the fix.** This page describes the largest release-hygiene
> change fkit has made, and it **ships with five owner-ruled accepted residuals**. A reader who takes
> away *"release hygiene is fixed"* has taken away something false. See ## Outcome.

## Goal

The post-release summary block of `bin/release.mjs` **printed a verify command that the run had
already made false, and a verify command that could pass without being true.** Four defects, not
three — the count grew by amendment while the brief was open:

| # | Origin | What it was |
|---|---|---|
| **R1** | `0254`'s stateful review | The summary printed the tag-verify line on **every** non-dry path, including runs that declined to create the tag it named — check exits **2**. ⛔ **Not confined to runs that publish nothing:** `--no-tag` **alone** fires it, and that run genuinely pushes commits to `origin/main`. |
| **R2** | `0254`'s stateful review | `--no-bump` over a tag **already on origin**: the branch is pushed, the tag does not move, and the printed check exits **0** against a **stale** tag — a **false green** directly under `✓ Released`. The worst of the four. |
| **R5** | `0254`'s stateful review | The tag-absent failure is **silent on both streams**. ⛔ The exit codes were never ambiguous (2 = absent, 128 = unreachable, and 128 prints its own `fatal:`) — **the residual was the silence alone**. |
| **N1** | An independent review of `0289`'s vault output; folded in by amendment 2026-08-13 | `--no-bump` over a tag that exists **locally but not on origin**: the branch is pushed, the tag push **never runs**, **nothing says so**, and the printed check exits 2. It breaks the script's own documented recovery path. ⚠️ Filed **source-confirmed, NOT executed** — and the first thing the build did was turn that into an execution, where it reproduced exactly. |

**Owner rulings that shaped the task**, all 2026-08-13, `fkit lead` session, `AskUserQuestion`
(verbatim option labels): *"File a follow-up task, ship 0254 now"* (R1/R2 become this task),
*"Fold into the R1/R2 follow-up"* (R5 joins), *"Fold into 0288"* (N1 joins), *"Unactioned —
pre-existing"* (R4, the unquoted `${tag}`, is **out**), *"Report truthfully only — stay inside the
fence"* (N1's remedy is summary-block-only), and *"(a) Add a test + extend prove-red.sh"* — which
**lifted `0254`'s ⛔ no-added-test boundary for `0288` only**.

## Key Changes

**Three files, and nothing else** — no `package.json`, no `VERSION`, nothing under
`ai-agents/wiki-vault/`:

- **`bin/release.mjs` — the summary block only.** The block now describes **the run that happened**,
  derived from the **measured** pre-run tag state rather than from `--no-tag` / `--no-push` alone.
  That distinction is load-bearing and the code says so: both flags are **true** in N1's state, so a
  guard on the two flags fixes R1 and leaves N1 exactly as it was. The file grew from 277 to **385
  lines** (measured 2026-08-14), and every `:NNN` written about it before this task is stale.
- **`test/release-summary.test.js` — new**, with **seven named assertions**: `0288/default-released`,
  `0288/no-tag`, `0288/no-push`, `0288/stale-origin-tag`, `0288/local-only-tag`,
  `0288/failure-speaks`, `0288/dry-run`. Every fixture runs against a **throwaway clone with a local
  bare origin**, and `makeFixture()` **asserts** the remote resolves inside its own tmp dir before
  doing anything.
- **`test/prove-red.sh` — extended to twenty-two mutations** (17 → 22; header count verified on disk
  2026-08-14). ⚠️ **Mutations 18–22 are the first in the file's history to target `bin/`** rather than
  a copied launcher tree.

### ⚠️ The default path's printed output DID change — said out loud, because the brief forbade it

The brief's Context ⛔ (*"any remedy that changes what the default path prints … has failed"*) and its
verification step 5 (*"if the default output changed at all, say so out loud and justify it"*) cannot
both hold once R5 is answered where a real release cut runs. **The owner ruled step 5 governs**
(2026-08-14, verbatim label *"(A) Fix R5 on the default path too (Recommended)"*). So:

- The headline `✓ Released <tag>` is **byte-identical**, and the success path is **byte-identical** —
  git prints the sha, exits 0, the `||` group never runs.
- What changed is a **speaking failure branch** appended to the printed command. On failure the exit
  status becomes 1 in both cases, **with git's real code printed in the message** and git's own
  `fatal:` still on stderr. Information moved from `$?` into visible output; it was not lost.

### Two review rounds, both model-diverse, both **reasoning-only on the Codex side**

Claude ran **with execution** (full suite, hard gate, purpose-built throwaway fixtures); Codex ran via
`codex exec --sandbox read-only` and **executed nothing** — labelled *reasoning-only* per ADR-042 D1,
with coverage recorded as complete because neither reviewer was skipped. Round 1 raised **R1–R7**
(two high), round 2 raised **R8–R10** (all low). Round 2's verdict: **✅ Ready to merge — 0 open
confirmed defects.** ⚠️ Round 1's two high findings were real: one of them showed the fix's own
`!doPush` branch printing a recovery command that **manufactured the exact R2 false-green state the
task exists to prevent**.

## Outcome

### ⛔ FIVE accepted residuals — a page about `0288` that omits any of them is wrong

1. **N1's recovery gap is ACCEPTED, NOT FIXED.** After `0288`, `--no-bump` **still cannot finish** a
   release whose tag is local-only. It **stops lying about it** and prints the by-hand
   `git push origin <tag>`. ⛔ Do not report N1 as *"recovery restored"*. The fence is itself tested:
   `0288/local-only-tag` asserts the tag is **still absent from origin** afterwards.
2. **R2's runtime half is open BY DESIGN** (owner: *"Leave it documented"*). `release.mjs` still
   **cannot see a tag its own branch push published** under a maintainer's global
   `push.followTags=true`, so the UNFINISHED branch can say `NOT pushed` of a tag that **was** pushed.
   The **fixture** pins `push.followTags=false` so the suite passes on any machine; the **script** is
   not fixed. Closing it needs a post-push `git ls-remote` on every run, or `--no-follow-tags` on the
   branch push — which lives **above** the summary block and outside this task's fence.
3. **R6, R7 and R9 are test-rigour residuals, owner-ruled NOT actioned.** R6: the mutation-isolation
   property is **documented, not gated** — every gate greps only its own named assertion. R7:
   `0288/no-push` and `0288/dry-run` have **no mutation**, and `0288/no-push` is thin — it stayed
   green while the branch it guards printed falsehoods. R9: mutation 22's `sed` has **no wrong-target
   guard**, and round 1's own fix added a second `} else if (tagCreated) {` that survives only because
   it carries a two-space indent while the `sed` is anchored at column 0. **This round consumed that
   margin.**
4. **`bin/release.mjs:12-14` still calls a `--no-bump` run *"idempotent"*, and that overstates it.**
   Skipping tag *creation* is idempotent; skipping the tag *push* is not — it leaves the release
   unfinished. The header comment was deliberately **not** rewritten (out of scope). The summary now
   contradicts the header truthfully at runtime; the comment remains overstated.
5. **The unquoted `${tag}` interpolation is untouched** — owner-ruled *"Unactioned — pre-existing"*.
   The single quotes on the **new** `'refs/tags/…^{}'` line exist so zsh can parse `^` and `{}` at all
   and are **not** claimed as a security improvement. **Windows shells are uncovered** — the printed
   commands are POSIX, as they already were. And a global **`core.hooksPath`** with a rejecting
   `pre-commit` still reds **all seven** assertions: a known, pre-existing host dependency the fixture
   does **not** isolate.

### ⚠️ The suite got more expensive — and ⛔ no measured absolute figure belongs in this vault

The owner accepted the cost: verbatim label ***"Accept the +40% (Recommended)"***, 2026-08-14, against
a plan that had estimated ~1–2 minutes. **Three wall-clock figures exist for the same code — and
every worker that reported one stated it was moving with MACHINE LOAD, not merit** (the last recorded
load average was **8.72** on a 14-core machine, with other fkit workers running). ⛔ **None of the
three is recorded here as the suite's runtime**, and ⛔ **no new range was computed by applying the
accepted percentage to the ruled figure** — that would invent a number nobody measured.

- ✅ **What is true:** `0288` landed, it increased the suite's cost, the owner accepted a measured
  ~+40%, and the measurements were taken under load.
- ⚠️ **A clean idle-machine measurement is still owed.** Every worker that measured said so.
- **The standing authority is `RELEASING.md:128`** — *"A green run takes **roughly 6–8 minutes,
  machine-dependent**"* (owner ruling 2026-08-13, verified on disk 2026-08-14). ⚠️ **That figure was
  ruled BEFORE `0288` added its cost, so it may now understate.** ⛔ Changing it is the **owner's**
  call, not a librarian's, and `RELEASING.md` sits outside the vault's write surface. **Flagged, not
  fixed.**
- **Where the time goes** — the cost model missed one multiplier: `prove-red.sh`'s `run_suite()`
  executes **all** test files and is called four times, so a new test file is executed **eleven** times
  per `npm test`, not seven.

### ⚠️ It found a defect neither reviewer raised — task `0300`, still open

During review round 1 the **coder** found that `release.mjs --branch <other>` **commits and tags
HEAD** while pushing a **different** ref, then prints `✓ Released`. ⚠️⚠️ **`0288`'s own verify command
PASSES on it** — the tag genuinely is on origin; it just names a commit **reachable from no branch on
origin** (`git branch -r --contains HEAD` → empty). Under `--no-push` the printed recovery command
**hand-builds that broken state**. ⚠️ **Raised by neither reviewer** — not the Claude pass, not the
Codex adversarial pass — and **reproduced first-hand by the filing producer** before the brief was
written. It is **pre-existing**, living above the summary block, so `0288`'s fence is not implicated.
Filed 2026-08-14 as task **`0300`** (Backlog, `🔲 Backlog`, **unranked**) on the owner's verbatim
ruling *"File it as its own task (Recommended)"*. **Open at the time of writing.**

### What `npm test` does and does not prove here

⛔ **A green `npm test` from the pre-existing suite says nothing about this change** — no test in the
repo executed the summary block before `0288`. What covers it is the **new** file's seven named
assertions plus mutations **18–22**, each proven red **at its named assertion**. ⚠️ Mutation 22 reds
**two** assertions (`0288/default-released` and `0288/failure-speaks`); that coupling is inherent —
`0288/failure-speaks` scrapes the command the default path actually printed — and it was **documented
rather than engineered away**.

⚠️ Closed `(agent-closed — not owner-verified)`. **No human has checked it.**

## Related
- [[tasks/fix-the-unrunnable-verify-command-release-mjs-prints]] — `0254`, the predecessor whose replacement line carried all four of these defects
- [[systems/install-and-self-update]] — the release flow this changes, and where the now-historical open-defect description lives
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — `0256`, the release gate whose runtime figure this task's cost bears on
- [[systems/testing-and-verification]] — the suite this task grew: 21 test files, 22 prove-red mutations, and the first mutations to target `bin/`
- [[tasks/the-2026-08-14-retroactive-review-corrections]] — `0291` and `0295`, which corrected two vault claims *about* this task while it was still open
- [[tasks/correct-the-superseded-runtime-figure-on-the-gate-releases-page]] — `0297`, the row that restored the ruled runtime figure hours before this task landed and changed the cost behind it
- [[tasks/sprint-5-fix-what-a-real-project-found]] — the archived board carrying `0254`, the `P12` row this task follows from
- Referenced without a wiki-link, deliberately, so this page adds no back-link debt: task `0252` (`RELEASING.md`, which carries the ruled runtime figure this page defers to), **ADR-042 D1** (the *reasoning-only* Codex coverage vocabulary both review rounds used), **ADR-026** (`prove-red.sh` stays hand-rolled), and **ADR-011** (why no `bin` field was ever the answer)
- [[tasks/release-mjs-with-branch-other-commits-and-tags-head-but-pushes-a-different-ref]] — *added 2026-08-29:* `0300`, the defect this task's own review surfaced and which neither reviewer raised; its guard sits entirely above this task's frozen summary fence
