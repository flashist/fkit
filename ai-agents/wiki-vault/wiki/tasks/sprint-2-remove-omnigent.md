# Sprint 2 — Remove Omnigent, land Claude-native as the only runtime

**Source**: `ai-agents/sprints/sprint-2.md`
**Status**: in-progress
**Sprint/Tag**: Sprint 2

## Goal
Execute the removal of the Omnigent runtime **end to end**: extract what the Claude flavor still depends on, build the one piece genuinely missing, rewrite the installer, delete `omnigent/`, and only *then* rewrite the docs and the wiki against the reality that's left.

Authorized by [[decisions/adr-009-claude-code-native-is-the-only-runtime]] and [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]].

**The sprint has grown far past its original scope — from 22 tasks to 62.** The removal itself finished early; **everything after task 22 is work the removal *uncovered*** — investigations that mostly concluded "build nothing", the defects they found on the way, and a set of skill-quality and coder-autonomy improvements the owner scoped as the runtime settled.

## Key Changes

### The one thing that must not be got wrong
**`omnigent/` was load-bearing.** The Claude flavor read its scaffold at runtime, the installer copied it, and `fkit update` routed through it. **Deleting it first would have broken the product three ways at once.** The sequence was **extract → build → rewrite → delete**, a genuine dependency chain. **Omnigent-side doc drift was deliberately not fixed** — its output would have been a deletion.

### The removal chain (tasks 1–5, all Done)
1. [[tasks/extract-scaffold-into-claude]] · 2. [[tasks/build-claude-self-update]] — **the only non-mechanical piece** · 3. [[tasks/make-codex-a-checked-prerequisite]] · 4. [[tasks/rewrite-installer-single-flavor]] — **the blast radius** · 5. [[tasks/delete-omnigent-directory]] — the payoff.

### Then: verify, document, tidy
- 6 [[tasks/reconcile-skill-ownership-source-of-truth]] → [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]
- 7 [[tasks/verify-onboarding-flow-end-to-end]] — **the release gate. PASSED.**
- 8 [[tasks/rewrite-docs-post-omnigent]] · 9 [[tasks/formalize-knowledge-base-incidents-folder]] → [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- 10 [[tasks/knowledge-base-hygiene-post-omnigent]] · 19 [[tasks/repair-knowledge-base-paths-in-product-source]] · 11 [[tasks/wiki-sync-post-omnigent]]

### Independent work carried alongside
- 12 [[tasks/bake-architecture-pointer-into-scaffold-templates]] · 13 [[tasks/extend-initiate-project-fill-overview]] · 14 [[tasks/add-task-plan-skill-to-producer]] · 15 [[tasks/enforce-task-status-vocabulary]] · 16 [[tasks/add-status-skill-to-producer]]
- 17 [[tasks/restore-plan-mode-in-plan-task]] — a **regression** repair · 18 [[tasks/remove-fkit-resume-passthrough]] — Omnigent scar tissue
- 21 [[tasks/repair-broken-links-in-closed-sprint-plans]] · 22 [[tasks/harden-task-movers-against-closed-sprint-link-rot]] — the symptom and the recurrence

### Testing — fkit's first automated verification
- 23 [[tasks/add-launcher-contract-smoke-script]] → [[decisions/adr-014-how-fkit-tests-itself]]. **It immediately caught 33.**
- 24 [[tasks/stop-agents-asserting-unchecked-repo-state]] — a **false instruction in both movers, shipping to every project**
- 33 [[tasks/fix-headless-menu-guard-crash]] — **the suite's first catch**

### The migration investigation (20) and its implementation (25–28) — now Done
[[tasks/design-version-to-version-migration-mechanism]] → [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]. **The headline is not "build a migration mechanism"** — fkit already converges every project on every launch; `ai-agents/` was simply carved out of it, and **un-carving it *additively* is the fix.** Rejected and not to be reintroduced: any `migration-*.md` semver-walk, a per-project version cursor, a migration agent — *most fatally, a cursor cannot survive a `git clone`.*
- 25 [[tasks/fix-scaffold-knowledge-base-folders]] · 26 [[tasks/stop-init-failure-bricking-the-launcher]] · 27 [[tasks/refuse-init-on-weird-ai-agents-state]] · **28 [[tasks/converge-ai-agents-additively-on-launch]] — "the migration", now Done**, gated behind 26 + 27. Its opt-out lives in a tracked `ai-agents/.fkit-keep-out` (OQ4).

### The shared-instructions investigation (29) and its implementation (30–32)
[[tasks/add-shared-instructions-layer-for-all-agents]] → [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]. **The layer already exists and already ships** — what was broken is its *delivery*, on two paths. **Rejected by name:** `AGENTS-COMMON.md` + splice (cannot reach Codex), `--append-system-prompt` (session-only). 30 [[tasks/give-codex-the-universal-hard-rules]] · 31 [[tasks/merge-fkit-rules-block-into-existing-root-context-files]] · 32 [[tasks/add-no-secrets-rule-to-fkit-lead]].

### Mover header drift (34/35)
34 [[tasks/task-done-flips-brief-own-status-header]] · 35 [[tasks/task-cancelled-flips-brief-own-status-header]] — the movers now flip a moved brief's own `## Status` header, closing the board-vs-brief drift task 22 is a sibling of. The already-drifted briefs were backfilled by hand.

### The `/fkit-status` deterministic dashboard (40, 41)
40 [[tasks/design-deterministic-dashboard-for-fkit-status]] → [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]] · 41 [[tasks/build-deterministic-dashboard-script-for-fkit-status]] shipped `dashboard.sh` (fkit's **first shipped executable**), turning the roll-up from an LLM hand-count into a computed invariant. 38 [[tasks/add-full-board-switch-to-fkit-status]] added the `full` switch — **later reverted** by task 44 (below).

### The coder→reviewer skill-gate bug (42, 43)
A live bug — a coder spawning `@fkit-reviewer` failed because a subagent inherits the launching session's `skillOverrides`. 42 [[tasks/record-pretooluse-skill-gate-adr-amendment]] → [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] · 43 [[tasks/implement-pretooluse-skill-ownership-hook]] built the `PreToolUse` hook that keys enforcement on the **real caller at any spawn depth**, retiring `CONSULT_SKILLS` and extending ADR-010's structural claim to the consult path.

### One skill, one output (44, 45, 47, 48, 49)
The owner reverted the `full` switch — *"there should be 1 version of the output."* 47 [[tasks/record-one-skill-one-output-convention]] recorded the general rule (operands allowed, output variants forbidden); 44 [[tasks/remove-output-variants-from-fkit-status]] applied it, deleting the delta default and `full` together (the sprint-name operand survives). 48 [[tasks/ship-one-skill-one-output-convention-in-scaffold]] shipped the convention in the scaffold — the **fourth** live-vs-scaffold parity instance, spawning 49 (the parity-cause investigation, backlog). 45 (the pre-filed wiki sync) remains backlog.

### The coder's autonomous ship-loop (52, 53)
52 [[tasks/design-task-ship-loop-skill]] — an owner-approved design for a coder skill that takes a task brief → done with minimal owner involvement → [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] + [[decisions/adr-020-per-task-plan-and-worklog-artifacts]]. 53 [[tasks/implement-task-ship-loop-skill]] built exactly that spec — skill live, hook suite green. Follow-ups from use, all backlog: 59/60 (timeout-auto-proceed for owner questions, design-first — feasibility unmeasured), 61 (the coder's report shape), 62 ("speak in simple terms").

### The `AskUserQuestion` seam and the tool-posture reversal (39, 54, 57, 58)
39 [[tasks/investigate-askuserquestion-availability-for-agents]] measured the session/consult seam (Claude Code 2.1.212: session works, consult `TOOL_ABSENT` 3/3) → [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] · 54 [[tasks/grant-askuserquestion-tool-to-six-claude-agents]] granted the tool to the six Claude-side agents. Then the audit's wider finding — capability tools excluded by **accident**, the `tools:` wall never a real sandbox — became [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]: 57 [[tasks/relax-tool-allowlists-except-adversarial-reviewer]] removed the six `tools:` lines entirely (54's grant survives by inheritance), leaving the adversarial reviewer's wall as **the sole structural tool restriction**. 58 (the doc refresh) is backlog.

### The skill-name collision (50, 51)
50 [[tasks/rename-task-plan-skill-to-task-brief]] renamed the producer's `/fkit-task-plan` → `/fkit-task-brief` (the coder's `/fkit-plan-task` with the same two words swapped) — atomic across the skill dir, `skills-for-role.sh`, and the ADR-018 hook. 51 (its pre-filed wiki sync) remains backlog.

### The orphan cleanup (36) and the `fkit-git` question (55, 56)
36 [[tasks/remove-fkit-omnigent-orphan-residue]] — the one destructive act, ruled **announce-only** — is Done. 55/56 (design then implement an `fkit-git` agent + `commit-push` skill) are backlog — design-first because it **collides with the "never commit" universal hard rule**, an owner ruling.

### Owner decisions taken during the sprint
- **Codex unreachable ⇒ a loudly-flagged partial, not a hard fail.** The flag is load-bearing.
- **`task-plan` decomposes to the smallest independently shippable unit** — the test is independent shippability, not size.
- **`package.json` stays, with its `scripts`** → [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]].
- **The convergence invariant, ratified:** *never write to a path that already exists.*
- **The `.fkit/` orphan-cleanup consent model → announce-only** (2026-07-17), unblocking task 36.

## Outcome
**50 of 62 tasks Done.** Omnigent is gone; the release gate passed on a clean install; fkit has automated verification for the first time; Codex finally receives the universal hard rules; **"the migration" (additive convergence) landed**; the coder→reviewer consult path is structurally enforced; the coder's autonomous ship-loop is **built and live**; the `.fkit/` orphan residue is cleaned; and the tool-allowlist posture was deliberately reversed (ADR-022) — one structural tool wall remains, the adversarial reviewer's.

**Still Backlog (12):** **37** the tombstone ADR for the shared-instructions reversal; **45 / 51** the two pre-filed wiki syncs (output-variant removal; `task-brief` rename); **46** the mutation-testing-library investigation; **49** the dual-home parity investigation; **55 / 56** design + implement the `fkit-git` agent (collides with the "never commit" hard rule — owner ruling needed); **58** the ADR-022 doc refresh; **59 / 60** design + implement the ship-loop timeout-auto-proceed; **61** the coder's report shape; **62** "speak in simple terms".

**Owner dispositions (2026-07-15) — all seven original open questions ruled** (OQ8 added later, ruled 2026-07-17 → "generalize", spawning task 47).

### The recurring lesson of this sprint
**Three false claims reached briefs without anyone running the command.** Both investigation reports lost claims to an adversarial Codex pass; a third — that `cp -R` writes through a dangling symlink *"outside the project"* — survived into task 27's brief and was caught only at implementation and review.

> **A behavioral claim about a shell builtin or coreutil is a claim to run, not to reason about** — and **a brief that says "confirm the bug is real" before anyone has is a brief that has already assumed its answer.**

Its sibling: **a count of a *semantic* rule cannot be established by grepping one of its phrasings.** Both are now standing rules in `conventions/evidence-before-assertion.md` ([[tasks/stop-agents-asserting-unchecked-repo-state]]).

## Related
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[systems/fkit]] · [[systems/install-and-self-update]] · [[systems/role-locked-sessions]] · [[systems/knowledge-base-structure]]
- [[systems/testing-and-verification]] · [[systems/launch-convergence-and-init]] · [[systems/review-and-model-diversity]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]] · [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] · [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]] · [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] · [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- [[decisions/adr-014-how-fkit-tests-itself]] · [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] · [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] · [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]]
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] · [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] · [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] · [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] · [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]
- [[systems/subagent-runner-connectivity]]
- [[tasks/give-every-agent-direct-wiki-query-access]] · [[tasks/rollout-adr-004-fixed-consult-titles]] · [[tasks/add-e2e-smoke-script-for-fkit-itself]]
