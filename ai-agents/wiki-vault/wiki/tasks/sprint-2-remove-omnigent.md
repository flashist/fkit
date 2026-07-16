# Sprint 2 — Remove Omnigent, land Claude-native as the only runtime

**Source**: `ai-agents/sprints/sprint-2.md`
**Status**: in-progress
**Sprint/Tag**: Sprint 2

## Goal
Execute the removal of the Omnigent runtime **end to end**: extract what the Claude flavor still depends on, build the one piece genuinely missing, rewrite the installer, delete `omnigent/`, and only *then* rewrite the docs and the wiki against the reality that's left.

Authorized by [[decisions/adr-009-claude-code-native-is-the-only-runtime]] and [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]].

**The sprint has grown well past its original scope — from 22 tasks to 38.** The removal itself finished early; everything after task 22 is work the removal *uncovered*: two investigations that both concluded "build nothing", and the defects they found on the way.

## Key Changes

### The one thing that must not be got wrong
**`omnigent/` was load-bearing.** The Claude flavor read its scaffold at runtime, the installer copied it, and `fkit update` routed through it. **Deleting it first would have broken the product three ways at once.**

The sequence is **extract → build → rewrite → delete**, and the phases are **genuinely ordered** — the priority list is a *dependency chain*, not a preference. **Omnigent-side doc drift was deliberately not fixed** — its output would have been a deletion.

### The removal chain (tasks 1–5, all Done)
1. [[tasks/extract-scaffold-into-claude]] · 2. [[tasks/build-claude-self-update]] — **the only non-mechanical piece** · 3. [[tasks/make-codex-a-checked-prerequisite]] · 4. [[tasks/rewrite-installer-single-flavor]] — **the blast radius** · 5. [[tasks/delete-omnigent-directory]] — the payoff.

### Then: verify, document, tidy
- 6 [[tasks/reconcile-skill-ownership-source-of-truth]] → [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]
- 7 [[tasks/verify-onboarding-flow-end-to-end]] — **the release gate. PASSED.**
- 8 [[tasks/rewrite-docs-post-omnigent]] · 9 [[tasks/formalize-knowledge-base-incidents-folder]] → [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- 10 [[tasks/knowledge-base-hygiene-post-omnigent]] · 19 [[tasks/repair-knowledge-base-paths-in-product-source]] · 11 [[tasks/wiki-sync-post-omnigent]] — **genuinely last**

### The independent work carried alongside
- 12 [[tasks/bake-architecture-pointer-into-scaffold-templates]] · 13 [[tasks/extend-initiate-project-fill-overview]] · 14 [[tasks/add-task-plan-skill-to-producer]] · 15 [[tasks/enforce-task-status-vocabulary]] · 16 [[tasks/add-status-skill-to-producer]]
- 17 [[tasks/restore-plan-mode-in-plan-task]] — a **regression**; repairs the planning gate the rest of the sprint would be planned *through*
- 18 [[tasks/remove-fkit-resume-passthrough]] — Omnigent scar tissue, removed rather than fixed
- 21 [[tasks/repair-broken-links-in-closed-sprint-plans]] · 22 [[tasks/harden-task-movers-against-closed-sprint-link-rot]] — the symptom and the recurrence

### Testing — fkit's first automated verification
- 23 [[tasks/add-launcher-contract-smoke-script]] → [[decisions/adr-014-how-fkit-tests-itself]]. **It immediately caught 33.**
- 24 [[tasks/stop-agents-asserting-unchecked-repo-state]] — a **false instruction in both movers, shipping to every project**
- 33 [[tasks/fix-headless-menu-guard-crash]] — **the suite's first catch**: the headless lead-default was dead code on any normal system

### The migration investigation (20) and its implementation (25–28)
[[tasks/design-version-to-version-migration-mechanism]] → [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]].

**The headline is not "build a migration mechanism."** It is: **fkit already converges every project on every launch; `ai-agents/` is simply carved out of it.** Un-carving it — **additively** — is the fix. **No mechanism, no version walk, nothing new for a user to run.**

**Explicitly rejected and not to be reintroduced:** the owner's `migration-current.md` semver-walk, a per-project version cursor, and a migration agent. **Rejected as premature, not wrong** — the owner has acknowledged this. **The strongest reason: a version cursor cannot survive a `git clone`**, because `.fkit/` is gitignored.

- 25 [[tasks/fix-scaffold-knowledge-base-folders]] · 26 [[tasks/stop-init-failure-bricking-the-launcher]] · 27 [[tasks/refuse-init-on-weird-ai-agents-state]] — Done. **28 (additive convergence — "the migration") is still Backlog**, and 26 + 27 are its preconditions.

### The shared-instructions investigation (29) and its implementation (30–32)
[[tasks/add-shared-instructions-layer-for-all-agents]] → [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]].

**The headline is not "build a shared instructions layer."** It is: **the layer already exists and already ships.** **What is broken is its delivery, on two paths.** Nothing new gets built — **the owner's need is met today, with zero code**, by writing in `CLAUDE.md`.

**Rejected by name:** `AGENTS-COMMON.md` + the agent-file splice (**structurally cannot reach Codex**), and **`claude --append-system-prompt`** (**session-only; 0/3 then 0/2** into a spawned consult, Claude Code 2.1.208). **The "seven files have drifted" motivation collapsed** — the rule is in **6 of 7**, not 2 of 7. *Three counts published, all three wrong.*

- 30 [[tasks/give-codex-the-universal-hard-rules]] — **a live defect: the required second model ran with no rules at all** · 31 [[tasks/merge-fkit-rules-block-into-existing-root-context-files]] — the brownfield hole · 32 [[tasks/add-no-secrets-rule-to-fkit-lead]]

### `/fkit-status` tooling
- 38 [[tasks/add-full-board-switch-to-fkit-status]] — Done. Related: [[tasks/design-deterministic-dashboard-for-fkit-status]] → [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]] (unsprinted).

### Owner decisions taken during the sprint
- **Codex unreachable ⇒ a loudly-flagged partial, not a hard fail.** The owner ruled *against* the architect's preflight-fail recommendation. **The flag is load-bearing** — *a partial review that reads like a complete one is precisely the failure this guards against.*
- **`task-plan` decomposes to the smallest independently shippable unit.** The test is **independent shippability, not size** — and splits must carry their dependency links.
- **`package.json` stays, with its `scripts`** → [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]].
- **The convergence invariant, ratified:** *never write to a path that already exists.*

## Outcome
**33 of 38 tasks Done.** Omnigent is gone: zero tracked files remain, and `install.sh` actively cleans it out of pre-existing installs. The release gate **passed** on a clean install. fkit now has **automated verification for the first time**, and **Codex finally receives the universal hard rules**.

**Still Backlog (5):** **28** additive convergence (*"the migration"* — needs 26 + 27, both now Done); **34 / 35** the movers flipping a moved brief's own `## Status` header; **36** removing the `.fkit/` Omnigent-orphan residue (**the one destructive act** — needs 28 **and** a consent-model ruling); **37** the tombstone ADR for the shared-instructions reversal.

**Owner dispositions (2026-07-15) — all seven open questions ruled:** npm reserve **left**; mover link policy **re-point the href, never the prose** (ratifying task 22); a mechanical link checker **NO**; task 28's opt-out → **a tracked `ai-agents/.fkit-keep-out`** (28 unblocked); `.fkit/` cleanup → **its own task, own gate** (36); the tombstone ADR → **task 37**; the read-side symlink hazard → **an independent unsprinted task**.

### The recurring lesson of this sprint, recorded rather than smoothed over
**Three false claims reached briefs without anyone running the command.** Rev 1 of *both* investigation reports lost claims to an adversarial Codex pass; a third — that `cp -R` writes through a dangling symlink, *"outside the project"* — survived into task 27's brief and was caught only at **implementation and review**. *"We did not know all along."*

> **A behavioral claim about a shell builtin or coreutil is a claim to run, not to reason about** — and **a brief that says "confirm the bug is real" before anyone has is a brief that has already assumed its answer.**

Its sibling: **a count of a *semantic* rule cannot be established by grepping one of its phrasings.** Three counts published, all three wrong. **Read the files.** Both lessons are now standing rules in `conventions/evidence-before-assertion.md` ([[tasks/stop-agents-asserting-unchecked-repo-state]]).

## Related
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[systems/fkit]] · [[systems/install-and-self-update]] · [[systems/role-locked-sessions]] · [[systems/knowledge-base-structure]]
- [[systems/testing-and-verification]] · [[systems/launch-convergence-and-init]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]] · [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] · [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]] · [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] · [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- [[decisions/adr-014-how-fkit-tests-itself]] · [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] · [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] · [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]]
- [[systems/subagent-runner-connectivity]]
- [[tasks/give-every-agent-direct-wiki-query-access]] · [[tasks/rollout-adr-004-fixed-consult-titles]] · [[tasks/add-e2e-smoke-script-for-fkit-itself]]
