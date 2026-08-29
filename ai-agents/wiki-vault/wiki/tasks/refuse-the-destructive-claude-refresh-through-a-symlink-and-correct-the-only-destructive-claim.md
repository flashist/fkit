# Refuse init's destructive `.claude/` refresh through a symlink — and correct the now-false "ONLY DESTRUCTIVE OPERATION" claim

**Source**: `ai-agents/tasks/done/0327-refuse-the-destructive-claude-refresh-through-a-symlink-and-correct-the-only-destructive-claim/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P11` · ID 0327 · owner `fkit-coder` · two review rounds, 2026-08-24

## Goal

⚠️⚠️ **A live, measured, DESTRUCTIVE escape. It DELETED a user's files outside the project, unprompted, unannounced, and exited 0.** ⛔ **More serious than the defect `0046` fixes** — `0046`'s §4 *creates* a file; this one **deletes**.

`claude/fkit-claude-init.sh` §3 refreshed the fkit-managed agents and skills with **no `[ -L ]` check on any component**: `mkdir -p`, `rm -f .../agents/fkit-*.md`, `cp`, an `rm -rf` loop over `.../skills/fkit-*/`, and `cp -R`.

**Reproduced by the filing producer, not taken on report** (`git archive HEAD` into a clean scratch share; hash matched `git show HEAD:` exactly):

| Outside the project, before | After |
|---|---|
| `agents/fkit-mine.md` (user's own agent) | ⛔ **DELETED** |
| `skills/fkit-myskill/` (user's own skill dir) | ⛔ **DELETED** by `rm -rf` |

Init printed `• refreshed 7 agents …, 26 skills …`, ran to the end, and **exited 0**. ⚠️ **The project itself was left with no real `.claude/` at all.** ⭐ **Broader than the `0046` audit reported** — that audit recorded only the agents-file deletion; **the recursive `rm -rf` of a user's skill directory reproduces too**.

### ⛔ The second required deliverable — a comment that lies about where the danger is

`claude/fkit-claude-init.sh` carried, verbatim, `# ⚠️ THIS IS THE ONLY DESTRUCTIVE OPERATION IN FKIT.` — heading **§6**, the orphan cleanup, which has a per-path announcement, a reference-count gate and a containment walk. **§3 has none of that apparatus and performs both an `rm -f` and an `rm -rf`.** ⭐ *"This is not a comment nit. It is the sentence that tells the next reader where the danger in this file is, and it points them at the wrong section — which is plausibly why §3 never got the doctrine §1, §4 and §6 all have."*

⭐⭐ **The brief anchored that deliverable on the quoted string and REFUSED to pin a line number** — measured at `:577` at `HEAD` and `:637` in the working tree on the same day, because `0046`'s hoist was moving it live. *"Do not re-pin it… a plan that treats a `HEAD` coordinate as a forwarding address has misread this brief."*

## Key Changes

- **§3 guarded at every statement** — `mkdir -p`, both deletes, both copies. ⭐ The `rm -rf` loop needed a guard **one level deeper than the leaf**: a new `skills_entries_contained()` walks each `fkit-*` entry itself.
- **Refuse-and-report, non-fatal, on stderr**, consistent with §1, `merge_rules`, §6 and `0088`'s bar. Init's **exit status is unchanged** (owner ruling Q1a) — and the interaction with `claude/fkit-claude.sh:387`'s `setup_ok` fail-safe was checked on the code rather than assumed.
- **The exclusivity claim rewritten at SIX sites** — `fkit-claude-init.sh` ×3, `claude/orphan-targets`, `test/orphan-cleanup.test.js`, `test/init-intake-guard.test.js`. ⭐ **The exclusivity moved from *recoverability* to *namespace***: §6 is the only place fkit deletes a path **named from a list rather than matched by one of its own two `fkit-*` patterns**.
- `test/init-claude-refresh-guard.test.js` **new**. Suite 737 → **747/747**, `prove-red.sh` 22/22, hard gate PASSED.

## Outcome

Two rounds, `fkit-reviewer` + Codex (`codex exec --sandbox read-only`, `gpt-5.6-sol`, **full coverage** both rounds). ⭐ Every reviewer reproduction ran in `mktemp -d` outside the repo; `git status --porcelain` was identical before and after.

### ⭐⭐ Round 1 found the fix INCOMPLETE — and disproved Codex's clearance by measurement

**R1 (high):** ⛔ **the defect the task exists to close was still live one level below the new guard.** The guard walked `.claude` and `skills` but **not the `fkit-*` entries the `rm -rf` names.** ⭐ **The mechanism is the glob's TRAILING SLASH** — `"$dest/.claude/skills/fkit-"*/` forces symlink resolution before `rm` is ever reached. Measured post-fix: an outside `precious/` tree **deleted**, `rc=0`, **empty stderr**, and a successful-refresh summary printed.

⚠️⚠️ **Codex had explicitly CLEARED that area**, reasoning that macOS `rm` uses `FTS_PHYSICAL` and would not traverse a directory symlink. ⛔ **That clearance is disproven by measurement — `FTS_PHYSICAL` never applies, because the glob resolves the link first.** ⭐ *"An automated reviewer's 'no finding' is an input, not an authority."* The reasoning is now a do-not-re-adopt note in the code. ✅ In round 2, given the fix to attack and the round-1 history, **Codex did not repeat the wrong clearance** — and every clearance it did give was independently corroborated by measurement rather than taken on its word.

**R2 (medium):** a dangling or non-directory `fkit-*` entry killed init under `set -euo pipefail` — bare `cp: … Not a directory`, `rc=1`, no fkit refusal, §5 and §6 never running. ⭐ **Measurement narrowed it: it fires only on a collision with a payload skill name.**

⭐ **A fourth measured shape decided the fix, and is why R1 and R2 are one change:** an R1-only fix that merely skipped the `rm` would let a live colliding directory symlink reach the `cp -R`, converting **R1's silent destruction into R2's fatal abort**. Guarding the entry for both statements is the only shape that leaves neither.

⭐ **The agents half needs no equivalent — verified, not assumed by symmetry:** `rm -f` removes a symlink *itself*, not its target. Measured live/dangling, colliding/not: `rc=0`, outside byte-intact.

**R3 (medium):** ⛔ **the corrected claim was STILL false**, in two shapes — and one of them survives the fix. **R4 (low):** the header edit broke a durable-citation anchor and wrote a **new one already stale**. ⭐ **Repaired durably, not renumbered** — the coordinate was **deleted** and replaced with a unique quoted fragment. ⭐⭐ **The repair was proved durable rather than lucky: round 2 shifted the same line AGAIN (`:317` → `:319`), and both repaired citations were still correct.** A renumber-to-`:317` fix would already have been stale.

⭐ **A sixth site was found and fixed** — `test/init-intake-guard.test.js:4` carried the same false claim outside the finding's list of five. *A sweep that repaired five and left the sixth would have re-filed R3 next round.*

### Round 2 — two new low findings, both filed out

- **R6:** a **wrong-type (non-symlink) squatter** still kills init — a real directory at `.claude/agents/fkit-x.md`, or a real file at a payload skill name. ⛔ **Pre-existing at `HEAD`, verified byte-identical — not a regression.** Priced `low` on measured blast radius: nothing outside the project touched, **no user-owned path destroyed**, only fkit's own gitignored payload lost and fully recovered by moving the stray and re-running.
- **R7:** the skills refusal **names only the FIRST symlinked entry**, so a user discovers the rest one re-run at a time, and its path line points at the **real parent** rather than the symlink. ⚠️ **Not a re-raise of the granularity ruling** — a gap against the fix's own stated rationale.

Both owner-ruled out of `0327` and filed as **`0336`**.

### Accepted residuals

- **Whole-half refusal granularity** — ⛔ owner-ruled *"Keep whole-half refusal (Recommended)"*. One stray symlinked `fkit-*` entry costs the user **all** the fkit skills until they move it. ⭐ **The cost is stated plainly and accepted, because the alternative to refusing is destroying.** ⛔ *"It refuses too much"* is **not** a re-raise condition.
- **R6 / R7** — owner-ruled *"File as its own task"* / *"Fold into R6's task"*, now `0336`.
- **TOCTOU** between the `-L` check and the write — not closable in POSIX shell; §6 already records it. ⛔ **The new guard inherits it and does not widen it**; the brief warned that a worklog calling the hazard *"closed"* without naming this has over-claimed.

### ⚠️ Left open, with no owning task

⛔ **The launcher's own fail-safe `ls "$proj"/.claude/agents/fkit-*.md` DEREFERENCES** — so a project that ran the buggy init once finds the escaped copies and starts a session **reading its agents from outside the project**. Owner ruled *"File it as its own task"*; recorded in the plan and worklog. `0330` covers the launcher's `.fkit` *writes*, not this read.

### ⚠️ Evidence gaps, stated

- **`prove-red.sh` cannot reach `fkit-claude-init.sh`** — `test/harness.mjs:160` hardcodes `INIT` with no env override, so the red-first proof for this change is **manual, not mechanized**. That seam is open task `0037`'s.
- **One build claim was not re-derived**: that control test C1 passed pre-fix as well as post-fix, for the same reason. Taken on the build's report.
- **`review.md` is untracked**, so git holds no baseline — round-1 byte-identity was **taken on the build's report, not verified**.

## Related
- [[tasks/gate-symlink-escape-in-init-intake-write]] — `0046`, whose audit finding **F1** this is, and whose `path_contained()` hoist this reuses
- [[tasks/remove-fkit-omnigent-orphan-residue]] — `0072`, §6's careful apparatus, the section the false comment pointed at
- [[systems/launch-convergence-and-init]] — the init script and its `.claude/` refresh
- [[systems/testing-and-verification]] — prove-red, and the `0037` seam it still cannot reach
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — the coverage state declared in both rounds
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — the ruling under which this row was placed at `P11`
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — the board this ran on
- [[systems/review-and-model-diversity]] — *added 2026-08-29:* the two-reviewer contract, and the page recording that ⭐ **this task disproved a Codex clearance by measurement**
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — *added 2026-08-29:* the board where this task's four unfixed audit findings (`0328`–`0330`, plus `0336`) sit open
