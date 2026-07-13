# Wiki Index

Master catalog of all wiki pages — one line per page, grouped by category.
Add an entry here whenever a page is created (see `schema.md`).

## Features

_(none yet — fkit's user-facing surface is documented as systems)_

## Systems
- [[systems/fkit]] — The seven-role Claude Code native + Codex agent team: roles, skills, topology, data model
- [[systems/role-locked-sessions]] — The skill lockdown: structural in a session, advisory in a consult
- [[systems/install-and-self-update]] — `install.sh`, the `fkit` launcher, preflight, onboarding, self-update, release
- [[systems/review-and-model-diversity]] — The Codex adversarial pass, loud degradation, and the review ledger
- [[systems/knowledge-base-structure]] — How `ai-agents/knowledge-base/` is filed: conventions vs decisions vs records
- [[systems/subagent-runner-connectivity]] — 🕰️ Historical: Omnigent runner disconnects and the reconnect stopgap

## Decisions
- [[decisions/adr-001-package-json-stays-metadata-only]] — ⚠️ Superseded by ADR-011; do not follow it
- [[decisions/adr-002-archive-pre-omnigent-design-docs]] — Move superseded design docs into `history/`
- [[decisions/adr-003-ci-runs-validate-bundles]] — ⚠️ Superseded (Omnigent removed); the CI gap it named is still open
- [[decisions/adr-004-fixed-role-based-titles-for-consult-spawns]] — ⚠️ Superseded (Omnigent removed)
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — Wiki reads decentralized, writes fkit-wiki-exclusive (**rule in force**)
- [[decisions/adr-006-symlink-vendored-query-skill-not-copy]] — ⚠️ Superseded: symlinked the vendored `query` skill; broke git
- [[decisions/adr-007-plain-copies-plus-sync-script-and-drift-check-for-vendored-query-skill]] — ⚠️ Superseded: plain copies + a drift-check
- [[decisions/adr-008-claude-code-native-port-alongside-omnigent]] — ⚠️ Superseded; kept as the record of *why fkit left Omnigent*
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]] — **Claude Code + Codex is the only runtime; Omnigent removed**
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — Role-locked sessions replace lead-session "hat" skills
- [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]] — `package.json` stays with its `scripts`; version bumping is load-bearing
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — The lockdown follows the *launching session*; `skills:` frontmatter dropped
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]] — The KB root holds only `PROJECT.md` + `architecture.md`

## Tasks

### Sprints
- [[tasks/sprint-1-ship-the-onboarding-sequence]] — 🔒 Closed: the Omnigent-era onboarding sprint, and how its 12 tickets were dispositioned
- [[tasks/sprint-2-remove-omnigent]] — Remove Omnigent, land Claude-native as the only runtime (18/22 done)

### Sprint 2 — the removal chain
- [[tasks/extract-scaffold-into-claude]] — Move the shared scaffold out of `omnigent/` (Phase 0.1)
- [[tasks/build-claude-self-update]] — Build self-update for the Claude path; the only non-mechanical piece
- [[tasks/make-codex-a-checked-prerequisite]] — Codex becomes required; a Codex-less review is a flagged partial
- [[tasks/rewrite-installer-single-flavor]] — Collapse `install.sh` to one flavor; the sprint's blast radius
- [[tasks/delete-omnigent-directory]] — Delete `omnigent/`; the payoff task
- [[tasks/verify-onboarding-flow-end-to-end]] — ✅ The release gate: clean install → session → consult → review. PASSED
- [[tasks/rewrite-docs-post-omnigent]] — Rewrite every doc against the post-removal reality
- [[tasks/reconcile-skill-ownership-source-of-truth]] — One source of truth for role→skill ownership → ADR-012

### Sprint 2 — knowledge base
- [[tasks/formalize-knowledge-base-incidents-folder]] — Give `incidents/` a convention → ADR-013
- [[tasks/knowledge-base-hygiene-post-omnigent]] — Mark the Omnigent ADRs superseded; file the loose root docs
- [[tasks/repair-knowledge-base-paths-in-product-source]] — Repoint shipped skills at the moved `conventions/` paths

### Sprint 2 — producer & coder tooling
- [[tasks/add-task-plan-skill-to-producer]] — A procedure for writing task briefs; decompose to smallest shippable unit
- [[tasks/add-status-skill-to-producer]] — A procedure for answering "what's the status?"
- [[tasks/enforce-task-status-vocabulary]] — The closed status set: Backlog · In progress · Blocked · Done · Cancelled · Moved
- [[tasks/restore-plan-mode-in-plan-task]] — Regression: the planning gate was prose, not a wall
- [[tasks/harden-task-movers-against-closed-sprint-link-rot]] — Stop the movers rotting links in closed sprint plans
- [[tasks/bake-architecture-pointer-into-scaffold-templates]] — Scaffold points at `architecture.md` instead of a placeholder
- [[tasks/extend-initiate-project-fill-overview]] — Initiation fills the CLAUDE.md/AGENTS.md Project Overview

### Sprint 1 — completed
- [[tasks/fix-claude-agents-md-placeholder-text]] — Replace placeholder prose in `CLAUDE.md` and `AGENTS.md`
- [[tasks/build-fkit-reconnect-tooling]] — Stopgap `fkit reconnect` CLI for disconnected subagent runners
- [[tasks/give-every-agent-direct-wiki-query-access]] — Decentralize wiki reads → ADR-005
- [[tasks/rollout-adr-004-fixed-consult-titles]] — Fixed role-based consult titles (subject since removed)

### Sprint 1 — cancelled (Omnigent removed)
- [[tasks/add-ci-validate-bundles]] — ⛔ CI for `validate-bundles.sh`; **the verification gap it named is still open**
- [[tasks/document-consult-chain-envelope]] — ⛔ The consult envelope is now recorded in ADR-010
- [[tasks/amend-subagent-disconnect-incident-doc]] — ⛔ An Omnigent incident write-up
- [[tasks/fix-agent-count-doc-drift-and-fresh-detection-dup]] — ⛔ The drifted files were deleted, not fixed
- [[tasks/remove-adversarial-reviewer-eager-spawn]] — ⛔ `fkit-team` and its eager roster were deleted
