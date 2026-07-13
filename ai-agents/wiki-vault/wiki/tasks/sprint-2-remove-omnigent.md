# Sprint 2 — Remove Omnigent, land Claude-native as the only runtime

**Source**: `ai-agents/sprints/sprint-2.md`
**Status**: in-progress
**Sprint/Tag**: Sprint 2

## Goal
Execute the removal of the Omnigent runtime **end to end**: extract what the Claude flavor still depends on, build the one piece genuinely missing, rewrite the installer, delete `omnigent/`, and only *then* rewrite the docs and the wiki against the reality that's left.

Authorized by [[decisions/adr-009-claude-code-native-is-the-only-runtime]] and [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]].

## Key Changes

### The one thing that must not be got wrong
**`omnigent/` was load-bearing.** The Claude flavor read its scaffold at runtime, the installer copied it, and `fkit update` routed through it. **Deleting it first would have broken the product three ways at once.**

The sequence is **extract → build → rewrite → delete**, and the phases are **genuinely ordered** — the priority list is a *dependency chain*, not a preference. **Task 5 (delete `omnigent/`) was unsafe before tasks 1–4.**

The prize for holding the order: the docs get written **once, against the post-removal reality**, instead of correcting drift in files about to be `git rm`'d. **Omnigent-side doc drift was deliberately not fixed** — its output would have been a deletion.

### The removal chain (tasks 1–5, all Done)
1. [[tasks/extract-scaffold-into-claude]] — move the shared scaffold out of `omnigent/`.
2. [[tasks/build-claude-self-update]] — **the only non-mechanical piece**; new code, and a live bug fix.
3. [[tasks/make-codex-a-checked-prerequisite]] — Codex becomes required.
4. [[tasks/rewrite-installer-single-flavor]] — **the blast radius of the sprint.**
5. [[tasks/delete-omnigent-directory]] — the payoff.

### Then: verify, document, tidy
- 6 [[tasks/reconcile-skill-ownership-source-of-truth]] → produced [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]
- 7 [[tasks/verify-onboarding-flow-end-to-end]] — **the release gate. PASSED.**
- 8 [[tasks/rewrite-docs-post-omnigent]]
- 9 [[tasks/formalize-knowledge-base-incidents-folder]] → produced [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- 10 [[tasks/knowledge-base-hygiene-post-omnigent]] · 19 [[tasks/repair-knowledge-base-paths-in-product-source]]
- **11 wiki sync after the removal (`ai-agents/tasks/backlog/wiki-sync-post-omnigent.md`) — genuinely last, and still open.**

### The independent work carried alongside
- 12 [[tasks/bake-architecture-pointer-into-scaffold-templates]] · 13 [[tasks/extend-initiate-project-fill-overview]]
- 14 [[tasks/add-task-plan-skill-to-producer]] · 15 [[tasks/enforce-task-status-vocabulary]] · 16 [[tasks/add-status-skill-to-producer]]
- 17 [[tasks/restore-plan-mode-in-plan-task]] — a **regression**, recommended as the first thing picked up: it repairs the planning gate the rest of the sprint would be planned *through*.
- 22 [[tasks/harden-task-movers-against-closed-sprint-link-rot]] — the link-rot recurrence.

### Owner decisions taken during the sprint
- **Codex unreachable ⇒ a loudly-flagged partial, not a hard fail.** The owner ruled *against* the architect's preflight-fail recommendation: **the preflight warns; it does not wall.** The flag is now load-bearing — *a partial review that reads like a complete one is precisely the failure this guards against.*
- **`task-plan` decomposes to the smallest independently shippable unit.** *"If a part can be developed, tested and shipped separately, it's worth a sub-task."* The test is **independent shippability, not size** — and splits must carry their dependency links, or the split has lost information.
- **`package.json` stays, with its `scripts`** → [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]].

## Outcome
**18 of 22 tasks Done.** Omnigent is gone: zero tracked files remain, and `install.sh` actively cleans it out of pre-existing installs. The release gate (task 7) **passed** on a clean install.

**Still open (4), all in `ai-agents/tasks/backlog/`:** 11 wiki sync (*this sync*), 18 `remove-fkit-resume-passthrough.md`, 20 `design-version-to-version-migration-mechanism.md`, 21 `repair-broken-links-in-closed-sprint-plans.md`.

**Why task 11 was sequenced last, and it matters:** *syncing the wiki before the docs were rewritten would just have ingested the drift into the vault — and then it would be wrong in **two** places, with the vault carrying the authority of "verified knowledge."*

⚠️ **Open questions for the owner** (from the sprint plan, unresolved):
1. **Reserve `@flashist/fkit` on npm now**, or leave npm alone until there's something to publish?
2. **Task 22's ruling:** do the task movers repair inbound links repo-wide, or are closed sprint plans **immutable historical records** that may point at where a task *was*? *(Producer's recommendation: **re-point the href, never the prose** — a closed plan's claims are history, but a link is a pointer, and a pointer to a file that isn't there is rot, not history.)*
3. **Should fkit own a mechanical link checker at all?** The repo has **no test suite and no link check**; this defect was found only because the coder hand-rolled a sweep.

## Related
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[systems/fkit]]
- [[systems/install-and-self-update]]
- [[systems/role-locked-sessions]]
- [[systems/knowledge-base-structure]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]]
- [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]]
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- [[systems/subagent-runner-connectivity]]
- [[tasks/give-every-agent-direct-wiki-query-access]]
- [[tasks/rollout-adr-004-fixed-consult-titles]]
