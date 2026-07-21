# Wiki Index

Master catalog of all wiki pages — one line per page, grouped by category.
Add an entry here whenever a page is created (see `schema.md`).

## Features

_(none yet — fkit's user-facing surface is documented as systems)_

## Systems
- [[systems/fkit]] — The Claude Code native + Codex agent team: **seven roles built, an eighth authorized** (ADR-028) — roles, skills, topology, data model
- [[systems/role-locked-sessions]] — The skill lockdown: structural in a session, advisory in a consult
- [[systems/install-and-self-update]] — `install.sh`, the `fkit` launcher, preflight, onboarding, self-update, release
- [[systems/review-and-model-diversity]] — The Codex adversarial pass, loud degradation, and the review ledger
- [[systems/knowledge-base-structure]] — How `ai-agents/knowledge-base/` is filed: conventions vs decisions vs records
- [[systems/testing-and-verification]] — The launcher-contract suite: black-box scope, the hard-coded matrix, what is still uncovered
- [[systems/launch-convergence-and-init]] — What fkit writes into a project on every launch: the invariant, the seams, the symlink lesson
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
- [[decisions/adr-014-how-fkit-tests-itself]] — Black-box process contract, zero devDeps, hard-coded matrix; runner left open (later `node --test`)
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — **fkit adds, never mutates, inside `ai-agents/`. There is no migration mechanism**
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — The layer already exists; **delivery structural, compliance advisory**
- [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]] — Shipped skill executables: `bash <path>`, never the exec bit
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — **`PreToolUse` hook enforces skill ownership by the real caller at any depth; `CONSULT_SKILLS` retired.** Supersedes ADR-012 Decisions 3&4
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — The coder's ship-loop runs autonomously by default. ⚠️ **Its done-gate is gone** (ADR-025, shipped by task 64 — the loop now closes its own task); **only the plan gate remains**
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — Per-task `plans/` + `worklogs/` dirs, keyed by task-id, mirroring `reviews/`
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — Tombstone: `AskUserQuestion` measured session-only (2.1.212); the consult "return open questions" contract is the only option
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — **Tool allowlists relaxed for six roles; the adversarial reviewer's wall is the sole structural tool restriction**
- [[decisions/adr-023-fkit-git-agent-is-not-built]] — Tombstone: no commit/push agent; **the "never commit unprompted" hard rule reaffirmed, not amended**
- [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]] — Tombstone: the AFK timeout **is** real (2.1.214) — declined on **cost, not feasibility**
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — ⚠️ **Reverses a universal hard rule**: spawned agents may close tasks; the anti-laundering guarantee is **removed**, not downgraded. **Shipped 2026-07-19; amended three times in the building** (hook data source, adversarial-reviewer exclusion, marker invisible in `/fkit-status`)
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]] — Tombstone: no library mutates shell; **ADR-014 Decision 4 unamended**; the real gap was gating
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — The 5th convention + a parity test; the consuming-project drift decision **stays deferred despite its fired trigger**
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — ⚠️ **Reverses the owner's own "not breadth" constraint**: an eighth **tester** seat on *sandbox authority*, against the architect's and producer's recommendation. **Decided, not built**
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — A task becomes a **folder** `tasks/<board>/<NNNN>-<slug>/` under a **permanent global ID**; `plans/`, `worklogs/` and `reviews/` are absorbed. **The largest structural change in the project's history** — 94 folders, ~309 links. **Decided, not built**
- [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — A **second hook** (`Stop`) enforces interactive questions + a "What's next?" close, because the prose rule **demonstrably did not fire**. Larger blast radius than ADR-018's — it can stop a turn completing. **Decided, not built**

## Tasks

### Sprints
- [[tasks/sprint-1-ship-the-onboarding-sequence]] — 🔒 Closed: the Omnigent-era onboarding sprint, and how its 12 tickets were dispositioned
- [[tasks/sprint-2-remove-omnigent]] — Remove Omnigent, land Claude-native as the only runtime (**75 done · 4 backlog · 1 in progress · 5 cancelled — of 85**; grew 22 → 85)
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — 🆕 The **Backlog board** (`sprints/backlog.md`) — the standing home for unsprinted briefs

### Sprint 2 — the removal chain
- [[tasks/extract-scaffold-into-claude]] — Move the shared scaffold out of `omnigent/` (Phase 0.1)
- [[tasks/build-claude-self-update]] — Build self-update for the Claude path; the only non-mechanical piece
- [[tasks/make-codex-a-checked-prerequisite]] — Codex becomes required; a Codex-less review is a flagged partial
- [[tasks/rewrite-installer-single-flavor]] — Collapse `install.sh` to one flavor; the sprint's blast radius
- [[tasks/delete-omnigent-directory]] — Delete `omnigent/`; the payoff task
- [[tasks/verify-onboarding-flow-end-to-end]] — ✅ The release gate: clean install → session → consult → review. PASSED
- [[tasks/rewrite-docs-post-omnigent]] — Rewrite every doc against the post-removal reality
- [[tasks/reconcile-skill-ownership-source-of-truth]] — One source of truth for role→skill ownership → ADR-012
- [[tasks/remove-fkit-resume-passthrough]] — Drop the blanket arg-passthrough that resumed any session as `lead`
- [[tasks/wiki-sync-post-omnigent]] — The Phase 5b vault rebuild; genuinely last, and why
- [[tasks/remove-fkit-omnigent-orphan-residue]] — The one destructive act (`rm -rf` of 4 orphan paths); consent model ruled **announce-only**; `.fkit/settings` untouchable

### Sprint 2 — knowledge base
- [[tasks/formalize-knowledge-base-incidents-folder]] — Give `incidents/` a convention → ADR-013
- [[tasks/knowledge-base-hygiene-post-omnigent]] — Mark the Omnigent ADRs superseded; file the loose root docs
- [[tasks/repair-knowledge-base-paths-in-product-source]] — Repoint shipped skills at the moved `conventions/` paths
- [[tasks/repair-broken-links-in-closed-sprint-plans]] — The 6 broken links; the one-off cleanup
- [[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]] — Live vs scaffold README divergence — **possibly intentional**

### Sprint 2 — testing & verification
- [[tasks/add-launcher-contract-smoke-script]] — fkit's first automated verification → ADR-014; **caught a live defect immediately**
- [[tasks/stop-agents-asserting-unchecked-repo-state]] — A **false instruction in both movers**, shipping to every project → `evidence-before-assertion.md`
- [[tasks/fix-headless-menu-guard-crash]] — `[ -r /dev/tty ]` never tests openability; the lead default was **dead code**

### Sprint 2 — the task-folder restructure (74–77, 85) and the tester ruling
- [[tasks/design-task-folder-structure-and-id-scheme]] — Task 74 → ADR-029: a task becomes a **folder** keyed by a permanent global ID. The design found **three silent breaks and one data-loss path** the brief never suspected
- [[tasks/assign-global-task-ids-and-create-registry]] — Task 75 → every brief stamped with an `## ID`, **corpus pinned to a commit SHA**; no registry, no file moves. Backfill verified reproducible
- [[tasks/migrate-tasks-to-folder-structure-and-update-tooling]] — Task 76 → **the migration shipped (2026-07-21)**: ~186 files, three artifact dirs absorbed, the point of no return. Agent-closed
- [[tasks/repair-task-links-outside-the-wiki-after-migration]] — Task 77 → the knowledge-base + in-tree doc-link repair; also cleared **pre-existing** rot the movers had left
- [[tasks/assert-task-ids-are-unique-in-the-test-suite]] — Task 85 (ID 0101) → ADR-029 Decision 3's duplicate-ID guard; **ran before task 76** — its value is pre-merge
- [[tasks/decide-whether-fkit-needs-a-tester-agent]] — ID 0024 (Backlog board) → ADR-028: the eighth-role ruling; **the owner ruled against the recommendation, knowingly**

### Sprint 2 — the six batched wiki-syncs (discharged by the task-folder sync, 2026-07-21)
- [[tasks/wiki-sync-fkit-status-output-variant-removal]] · [[tasks/wiki-sync-task-plan-rename]] · [[tasks/wiki-sync-filtered-fkit-status-board]] · [[tasks/wiki-sync-backlog-board-introduction]] · [[tasks/wiki-sync-open-questions-interview-skill]] · [[tasks/wiki-sync-dumb-down-skill]] — priorities 45/51/66/69/71/73; each **batched into the migration sync** rather than run first (ADR-029 §9.2); every subject already recorded on its implementation page
- [[tasks/compress-universal-rules-output-style-section]] — Task 79 (ID 0022) → reclaimed ~549 B under the launch-blocking 4096-B universal-rules cap
- [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]] — Task 81 (ID 0036) → movers now sweep `knowledge-base/`; **Part B is the first defence against the ADR-number collision** that actually happened 2026-07-19

### Sprint 2 — the four investigations closed 2026-07-19
- [[tasks/investigate-mutation-testing-library-adoption]] — Task 46 → ADR-026: **no library mutates shell**, so the zero-devDeps tension never existed; the real defect was gating
- [[tasks/investigate-dual-home-parity-live-vs-scaffold]] — Task 49 → ADR-027: the **cause** of a four-instance defect class; the enumeration corrected itself from five drifted files to **six**
- [[tasks/design-spawned-invocation-consent-model-for-task-movers]] — Task 63 → ADR-025: **no fabrication-resistant precondition exists**; prevention removed, an unenforced prose marker in its place
- [[tasks/implement-spawned-invocation-for-task-movers]] — Task 64: the reversal **built** (2026-07-19) and the sprint's **first agent-closed row — not owner-verified**; the adversarial pass forced three ADR amendments
- [[tasks/refresh-architecture-docs-for-tool-relaxation]] — Task 58 → the ADR-022 doc follow-up, Done; `architecture.md` is nonetheless **behind again** (cites no ADR past **025**; 023, 024, 026–030 absent)

### Sprint 2 — the migration investigation (and its "build nothing" answer)
- [[tasks/design-version-to-version-migration-mechanism]] — Investigation → ADR-015; **rejected the semver walk**
- [[tasks/fix-scaffold-knowledge-base-folders]] — The scaffold promised five KB folders and shipped one
- [[tasks/stop-init-failure-bricking-the-launcher]] — Any init failure took the user's whole team offline
- [[tasks/refuse-init-on-weird-ai-agents-state]] — The `[ -L ]` gate; **its stated rationale shipped false and was corrected**
- [[tasks/converge-ai-agents-additively-on-launch]] — **"the migration" — now Done**: per-path create-if-absent top-up under the never-overwrite invariant

### Sprint 2 — the shared-instructions investigation (and its reversal)
- [[tasks/add-shared-instructions-layer-for-all-agents]] — Investigation → ADR-016; **the layer already existed**
- [[tasks/give-codex-the-universal-hard-rules]] — The required second model ran with **no rules at all**
- [[tasks/merge-fkit-rules-block-into-existing-root-context-files]] — The brownfield hole; **first fkit code to write into a file the user owned**
- [[tasks/add-no-secrets-rule-to-fkit-lead]] — The 1 of 7 missing it — one line

### `/fkit-status` tooling
- [[tasks/design-deterministic-dashboard-for-fkit-status]] — Design-first → ADR-017; **implementation now Done**
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]] — fkit's **first shipped executable** (`dashboard.sh`); the roll-up becomes a computed invariant
- [[tasks/add-full-board-switch-to-fkit-status]] — A reserved `full` keyword overriding the delta default (**later reverted by task 44**)
- [[tasks/remove-output-variants-from-fkit-status]] — Task 44: the delta default and `full` deleted together; one output on every invocation (sprint-name operand survives)
- [[tasks/record-one-skill-one-output-convention]] — The standing rule the `full` reversal generalized: one complete output per subject; no output-variant arguments
- [[tasks/ship-one-skill-one-output-convention-in-scaffold]] — Task 48: the convention shipped in the scaffold — the **fourth** live-vs-scaffold parity instance

### Sprint 2 — the consult-path skill-gate hook
- [[tasks/record-pretooluse-skill-gate-adr-amendment]] — Reopens ADR-012 Decisions 3&4 → ADR-018
- [[tasks/implement-pretooluse-skill-ownership-hook]] — The `PreToolUse` hook-flip; retires `CONSULT_SKILLS`, enforces by the real caller

### Sprint 2 — the coder's autonomous ship-loop
- [[tasks/design-task-ship-loop-skill]] — Owner-approved design → ADR-019 + ADR-020; brief→done with minimal owner involvement
- [[tasks/implement-task-ship-loop-skill]] — Task 53: the loop built and live — skill registered for the coder, hook suite green

### Sprint 2 — the `AskUserQuestion` seam and the tool-posture reversal
- [[tasks/investigate-askuserquestion-availability-for-agents]] — Measured the session/consult seam (consult `TOOL_ABSENT` 3/3) → ADR-021
- [[tasks/grant-askuserquestion-tool-to-six-claude-agents]] — Task 54: the six-agent grant; mechanism later superseded by task 57, capability preserved
- [[tasks/relax-tool-allowlists-except-adversarial-reviewer]] — Task 57: six `tools:` lines removed (ADR-022); the adversarial reviewer's wall stays byte-identical

### Sprint 2 — the `/fkit-status` board reshaped
- [[tasks/filter-fkit-status-board-to-open-tasks]] — Task 65: the board shows **open work only** — a conscious reversal of "show the dead rows", roll-up as the mitigation
- [[tasks/report-backlog-board-in-fkit-status-on-request-only]] — Task 68: `Backlog` as a **target selector**, conforming to one-skill-one-output

### Sprint 2 — output style and the two six-role skills
- [[tasks/add-open-questions-interview-skill-for-six-roles]] — Task 70: `/fkit-open-questions-interview` — session-history sweep, interview-only, zero writes
- [[tasks/add-dumb-down-skill-for-six-roles]] — Task 72: `/fkit-dumb-down` — on-demand plain-language re-explain; **content-preserving**
- [[tasks/add-speak-in-simple-terms-output-style]] — Task 62: the standing preference — **its four-file premise was disproven at build time**
- [[tasks/restructure-coder-report-summary-then-interview]] — Task 61: summary-first, interview-last, with the forced consult degrade

### Sprint 2 — the skill-name collision
- [[tasks/rename-task-plan-skill-to-task-brief]] — Task 50: `/fkit-task-plan` → `/fkit-task-brief`, atomic across dir + ownership source of truth + hook

### Sprint 2 — producer & coder tooling
- [[tasks/add-task-plan-skill-to-producer]] — A procedure for writing task briefs; decompose to smallest shippable unit (skill since renamed `fkit-task-brief`, task 50)
- [[tasks/add-status-skill-to-producer]] — A procedure for answering "what's the status?"
- [[tasks/enforce-task-status-vocabulary]] — The closed status set: Backlog · In progress · Blocked · Done · Cancelled · Moved
- [[tasks/restore-plan-mode-in-plan-task]] — Regression: the planning gate was prose, not a wall
- [[tasks/harden-task-movers-against-closed-sprint-link-rot]] — Stop the movers rotting links in closed sprint plans
- [[tasks/task-done-flips-brief-own-status-header]] — `/fkit-task-done` now flips the moved brief's own `## Status` (mover drift, sibling of task 22)
- [[tasks/task-cancelled-flips-brief-own-status-header]] — Same fix for `/fkit-task-cancelled`, reproducing the mandatory date+reason
- [[tasks/bake-architecture-pointer-into-scaffold-templates]] — Scaffold points at `architecture.md` instead of a placeholder
- [[tasks/extend-initiate-project-fill-overview]] — Initiation fills the CLAUDE.md/AGENTS.md Project Overview

### Sprint 1 — completed
- [[tasks/fix-claude-agents-md-placeholder-text]] — Replace placeholder prose in `CLAUDE.md` and `AGENTS.md`
- [[tasks/build-fkit-reconnect-tooling]] — Stopgap `fkit reconnect` CLI for disconnected subagent runners
- [[tasks/give-every-agent-direct-wiki-query-access]] — Decentralize wiki reads → ADR-005
- [[tasks/rollout-adr-004-fixed-consult-titles]] — Fixed role-based consult titles (subject since removed)

### Cancelled
- [[tasks/add-e2e-smoke-script-for-fkit-itself]] — ⛔ Superseded by the launcher-contract suite; **two of its instructions are actively wrong**
- [[tasks/design-fkit-git-agent-and-consent-model]] — ⛔ Task 55: the owner ruled for unattended commit/push, then **reversed in the same session** → ADR-023
- [[tasks/implement-fkit-git-agent-and-commit-push]] — ⛔ Task 56: never started; parent design declined
- [[tasks/design-ship-loop-timeout-auto-proceed]] — ⛔ Task 59: **feasible** (the first verdict was wrong) but declined on cost → ADR-024
- [[tasks/implement-ship-loop-timeout-auto-proceed]] — ⛔ Task 60: never started; parent design declined
- [[tasks/record-shared-instructions-reversal-adr]] — ⛔ Task 37: a **duplicate** — already recorded as ADR-016 four days before scoping

### Sprint 1 — cancelled (Omnigent removed)
- [[tasks/add-ci-validate-bundles]] — ⛔ CI for `validate-bundles.sh`; **the gap it named is now partly closed — `install.sh` still uncovered**
- [[tasks/document-consult-chain-envelope]] — ⛔ The consult envelope is now recorded in ADR-010
- [[tasks/amend-subagent-disconnect-incident-doc]] — ⛔ An Omnigent incident write-up
- [[tasks/fix-agent-count-doc-drift-and-fresh-detection-dup]] — ⛔ The drifted files were deleted, not fixed
- [[tasks/remove-adversarial-reviewer-eager-spawn]] — ⛔ `fkit-team` and its eager roster were deleted
