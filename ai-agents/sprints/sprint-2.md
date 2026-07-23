# Sprint 2 — Remove Omnigent, land Claude-native as the only runtime

**Goal:** fkit is now a **Claude Code native + Codex** team, and only that. Sprint 2 executes the
removal of the Omnigent runtime end to end — extract what the Claude flavor still depends on, build
the one piece that's genuinely missing, rewrite the installer, delete `omnigent/`, and only *then*
rewrite the docs and the wiki against the reality that's left.

**Authorized by:** [ADR-009](../knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md)
(Claude-native is the only runtime) and
[ADR-010](../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md)
(role-locked sessions + skill lockdown).
**Technical sequence from:** [`2026-07-11-plan-omnigent-removal.md`](../knowledge-base/reports/2026-07-11-plan-omnigent-removal.md)
(fkit-architect). **Evidence:** [`2026-07-11-doc-drift-audit.md`](../knowledge-base/reports/2026-07-11-doc-drift-audit.md).

## ⚠️ The one thing that must not be got wrong

**`omnigent/` is load-bearing today.** The Claude flavor reads its scaffold at runtime, the installer
copies it, and `fkit update` routes through it. Deleting it first breaks the product three ways at
once.

The sequence is **extract → build → rewrite → delete**, and the phases are **genuinely ordered**.
Priority order below is not a preference — it is a dependency chain. **Task 5 (delete `omnigent/`) is
unsafe before tasks 1–4.**

The prize for holding the order: the docs (task 8) get written **once, against the post-removal
reality**, instead of correcting drift in files that are about to be `git rm`'d. **Do not fix
Omnigent-side doc drift** — its output would be a deletion.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| ✅ Done | 1 | Extract the shared scaffold into `claude/` *(Phase 0.1)* | [`extract-scaffold-into-claude.md`](../tasks/done/0038-extract-scaffold-into-claude/brief.md) |
| ✅ Done | 2 | Build self-update for the Claude path *(Phase 0.2)* | [`build-claude-self-update.md`](../tasks/done/0019-build-claude-self-update/brief.md) |
| ✅ Done | 3 | Make Codex a checked prerequisite *(Phase 0.3)* | [`make-codex-a-checked-prerequisite.md`](../tasks/done/0060-make-codex-a-checked-prerequisite/brief.md) |
| ✅ Done | 4 | Rewrite the installer for a single flavor *(Phase 1)* | [`rewrite-installer-single-flavor.md`](../tasks/done/0084-rewrite-installer-single-flavor/brief.md) |
| ✅ Done | 5 | Delete `omnigent/` *(Phase 2)* | [`delete-omnigent-directory.md`](../tasks/done/0025-delete-omnigent-directory/brief.md) |
| ✅ Done | 6 | Reconcile the skill-ownership source of truth *(Phase 3 — independent)* | [`reconcile-skill-ownership-source-of-truth.md`](../tasks/done/0063-reconcile-skill-ownership-source-of-truth/brief.md) |
| ✅ Done | 7 | Verify onboarding flow end-to-end *(the removal gate — PASSED, [evidence](../knowledge-base/reports/2026-07-12-onboarding-verification.md))* | [`verify-onboarding-flow-end-to-end.md`](../tasks/done/0091-verify-onboarding-flow-end-to-end/brief.md) |
| ✅ Done | 8 | Rewrite the docs against the post-removal reality *(Phase 4)* | [`rewrite-docs-post-omnigent.md`](../tasks/done/0083-rewrite-docs-post-omnigent/brief.md) |
| ✅ Done | 9 | Formalize the knowledge-base folder structure, incl. `incidents/` *(→ [ADR-013](../knowledge-base/decisions/adr-013-knowledge-base-root-holds-the-living-canon.md))* | [`formalize-knowledge-base-incidents-folder.md`](../tasks/done/0044-formalize-knowledge-base-incidents-folder/brief.md) |
| ✅ Done | 10 | Knowledge-base hygiene after the removal *(Phase 5a)* | [`knowledge-base-hygiene-post-omnigent.md`](../tasks/done/0059-knowledge-base-hygiene-post-omnigent/brief.md) |
| ✅ Done | 11 | Wiki sync after the removal *(Phase 5b)* | [`wiki-sync-post-omnigent.md`](../tasks/done/0098-wiki-sync-post-omnigent/brief.md) |
| ✅ Done | 12 | Bake the Architecture pointer into the scaffold templates | [`bake-architecture-pointer-into-scaffold-templates.md`](../tasks/done/0018-bake-architecture-pointer-into-scaffold-templates/brief.md) |
| ✅ Done | 13 | Extend `initiate-project` to fill CLAUDE.md/AGENTS.md Project Overview | [`extend-initiate-project-fill-overview.md`](../tasks/done/0035-extend-initiate-project-fill-overview/brief.md) |
| ✅ Done | 14 | Add a `task-plan` skill to fkit-producer | [`add-task-plan-skill-to-producer.md`](../tasks/done/0012-add-task-plan-skill-to-producer/brief.md) |
| ✅ Done | 15 | Enforce the task status vocabulary in the source | [`enforce-task-status-vocabulary.md`](../tasks/done/0034-enforce-task-status-vocabulary/brief.md) |
| ✅ Done | 16 | Add a `status` skill to fkit-producer | [`add-status-skill-to-producer.md`](../tasks/done/0011-add-status-skill-to-producer/brief.md) |
| ✅ Done | 17 | Restore Claude Code plan mode in `/fkit-plan-task` *(regression — independent)* | [`restore-plan-mode-in-plan-task.md`](../tasks/done/0081-restore-plan-mode-in-plan-task/brief.md) |
| ✅ Done | 18 | Remove `fkit --resume` and the blanket arg-passthrough *(Omnigent scar tissue)* | [`remove-fkit-resume-passthrough.md`](../tasks/done/0073-remove-fkit-resume-passthrough/brief.md) |
| ✅ Done | 19 | Repair the knowledge-base paths in product source *(ADR-013 fallout)* | [`repair-knowledge-base-paths-in-product-source.md`](../tasks/done/0077-repair-knowledge-base-paths-in-product-source/brief.md) |
| ✅ Done | 20 | Design a version-to-version migration mechanism *(investigation — [findings](../knowledge-base/reports/2026-07-14-migration-mechanism.md); spawned 25–28)* | [`design-version-to-version-migration-mechanism.md`](../tasks/done/0032-design-version-to-version-migration-mechanism/brief.md) |
| ✅ Done | 21 | Repair the 6 broken task links in the closed Sprint 1 plan *(one-off cleanup)* | [`repair-broken-links-in-closed-sprint-plans.md`](../tasks/done/0076-repair-broken-links-in-closed-sprint-plans/brief.md) |
| ✅ Done | 22 | Stop the task movers rotting links in closed sprint plans *(the recurrence — the real bug)* | [`harden-task-movers-against-closed-sprint-link-rot.md`](../tasks/done/0050-harden-task-movers-against-closed-sprint-link-rot/brief.md) |
| ✅ Done | 23 | Add the launcher-contract test suite *(zero devDeps; **runner TBD** — [ADR-014](../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md))* | [`add-launcher-contract-smoke-script.md`](../tasks/done/0006-add-launcher-contract-smoke-script/brief.md) |
| ✅ Done | 24 | Stop agents asserting repo state they never checked *(a false instruction in both task movers, shipping to every project)* | [`stop-agents-asserting-unchecked-repo-state.md`](../tasks/done/0087-stop-agents-asserting-unchecked-repo-state/brief.md) |
| ✅ Done | 25 | Fix the scaffold — ship the KB folders its own README promises *(defect; 100% of new projects)* | [`fix-scaffold-knowledge-base-folders.md`](../tasks/done/0043-fix-scaffold-knowledge-base-folders/brief.md) |
| ✅ Done | 26 | Stop an init failure from bricking the launcher *(pre-existing defect)* | [`stop-init-failure-bricking-the-launcher.md`](../tasks/done/0088-stop-init-failure-bricking-the-launcher/brief.md) |
| ✅ Done | 27 | Refuse init on a weird `ai-agents/` — symlink / file-where-dir *(live DoS + silent-skip bugs; the write-outside hazard is **prospective** — see the 2026-07-14 correction)* | [`refuse-init-on-weird-ai-agents-state.md`](../tasks/done/0069-refuse-init-on-weird-ai-agents-state/brief.md) |
| ✅ Done | 28 | Make launch converge `ai-agents/` additively *(**"the migration"**)* | [`converge-ai-agents-additively-on-launch.md`](../tasks/done/0023-converge-ai-agents-additively-on-launch/brief.md) |
| ✅ Done | 29 | Add a shared instructions layer that every fkit agent reads *(investigation — [findings rev 2](../knowledge-base/reports/2026-07-14-shared-instructions-layer.md); spawned 30–32)* | [`add-shared-instructions-layer-for-all-agents.md`](../tasks/done/0009-add-shared-instructions-layer-for-all-agents/brief.md) |
| ✅ Done | 30 | Give Codex the universal hard rules it has never had *(**live defect** — the required second model runs with no floor)* | [`give-codex-the-universal-hard-rules.md`](../tasks/done/0047-give-codex-the-universal-hard-rules/brief.md) |
| ✅ Done | 31 | Merge an fkit-managed rules block into an **existing** `CLAUDE.md`/`AGENTS.md` *(the brownfield hole; **idempotent or it grows the file forever**)* | [`merge-fkit-rules-block-into-existing-root-context-files.md`](../tasks/done/0061-merge-fkit-rules-block-into-existing-root-context-files/brief.md) |
| ✅ Done | 32 | Add the "no secrets" rule to `fkit-lead.md` *(the 1 of 7 missing it — one line)* | [`add-no-secrets-rule-to-fkit-lead.md`](../tasks/done/0007-add-no-secrets-rule-to-fkit-lead/brief.md) |
| ✅ Done | 33 | Fix the headless menu-guard crash — `[ -r /dev/tty ]` never tests openability *(launcher defect against task-23 assertion 7's contract)* | [`fix-headless-menu-guard-crash.md`](../tasks/done/0042-fix-headless-menu-guard-crash/brief.md) |
| ✅ Done | 34 | Make `/fkit-task-done` flip the moved brief's own `## Status` header *(mover drift — sibling to task 22)* | [`task-done-flips-brief-own-status-header.md`](../tasks/done/0090-task-done-flips-brief-own-status-header/brief.md) |
| ✅ Done | 35 | Make `/fkit-task-cancelled` flip the moved brief's own `## Status` header *(same gap, `⛔ Cancelled` marker)* | [`task-cancelled-flips-brief-own-status-header.md`](../tasks/done/0089-task-cancelled-flips-brief-own-status-header/brief.md) |
| ✅ Done | 36 | Remove the `.fkit/` Omnigent-orphan residue *(OQ5 resolved; announce-only ruled 2026-07-17; 4-path list, `.fkit/settings` protected, non-fatal; owner: fkit-coder)* | [`remove-fkit-omnigent-orphan-residue.md`](../tasks/done/0072-remove-fkit-omnigent-orphan-residue/brief.md) |
| ⛔ Cancelled (2026-07-19) — superseded by ADR-016 | 37 | Record a tombstone ADR for the shared-instructions reversal *(**duplicate — already recorded as [ADR-016](../knowledge-base/decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md), 2026-07-14, before this task was scoped; see OQ6**; owner: fkit-architect)* | [`record-shared-instructions-reversal-adr.md`](../tasks/cancelled/0066-record-shared-instructions-reversal-adr/brief.md) |
| ✅ Done | 38 | Add a full-board switch (`full`) to `/fkit-status` *(skill-text only; owner: fkit-coder)* | [`add-full-board-switch-to-fkit-status.md`](../tasks/done/0005-add-full-board-switch-to-fkit-status/brief.md) |
| ✅ Done | 39 | Investigate making `AskUserQuestion` available to fkit agents *(investigation — [findings](../knowledge-base/reports/2026-07-17-askuserquestion-availability-for-agents.md); spawned [ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md); owner: fkit-architect)* | [`investigate-askuserquestion-availability-for-agents.md`](../tasks/done/0056-investigate-askuserquestion-availability-for-agents/brief.md) |
| ✅ Done | 40 | Design the deterministic dashboard generator for `/fkit-status` *(design — [spec](../knowledge-base/reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md); spawned [ADR-017](../knowledge-base/decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md))* | [`design-deterministic-dashboard-for-fkit-status.md`](../tasks/done/0026-design-deterministic-dashboard-for-fkit-status/brief.md) |
| ✅ Done | 41 | Build the deterministic dashboard script and wire it into `/fkit-status` *(owner: fkit-coder; [review](../tasks/done/0020-build-deterministic-dashboard-script-for-fkit-status/review.md) closed-out, rounds 1–6, residuals recorded)* | [`build-deterministic-dashboard-script-for-fkit-status.md`](../tasks/done/0020-build-deterministic-dashboard-script-for-fkit-status/brief.md) |
| ✅ Done | 42 | Reopen ADR-012 Decisions 3 & 4 — record the `PreToolUse` skill-gate hook decision *(live bug fix, phase 1/2; owner: fkit-architect)* | [`record-pretooluse-skill-gate-adr-amendment.md`](../tasks/done/0065-record-pretooluse-skill-gate-adr-amendment/brief.md) |
| ✅ Done | 43 | Implement the `PreToolUse` skill-ownership gate (the hook-flip) *(owner: fkit-coder; [review](../tasks/done/0052-implement-pretooluse-skill-ownership-hook/review.md))* | [`implement-pretooluse-skill-ownership-hook.md`](../tasks/done/0052-implement-pretooluse-skill-ownership-hook/brief.md) |
| ✅ Done | 44 | Remove the output variants from `/fkit-status` — one skill, one output *(**reverts task 38**; skill-text only; owner: fkit-coder)* | [`remove-output-variants-from-fkit-status.md`](../tasks/done/0074-remove-output-variants-from-fkit-status/brief.md) |
| ✅ Done | 45 | Wiki sync after the `/fkit-status` output-variant removal *(needs 44 — hard; owner: fkit-wiki)* | [`wiki-sync-fkit-status-output-variant-removal.md`](../tasks/done/0096-wiki-sync-fkit-status-output-variant-removal/brief.md) |
| ✅ Done | 46 | Investigate adopting a proper mutation-testing library, replacing hand-rolled `prove-red.sh` *(investigation — [findings](../knowledge-base/reports/2026-07-18-mutation-testing-library-adoption.md); spawned [ADR-026](../knowledge-base/decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled.md); owner: fkit-architect; spawned from task-43 review finding R2)* | [`investigate-mutation-testing-library-adoption.md`](../tasks/done/0058-investigate-mutation-testing-library-adoption/brief.md) |
| ✅ Done | 47 | Record the "one skill, one output" convention *(OQ8 resolved — generalize; document only; owner: fkit-architect → [`conventions/one-skill-one-output.md`](../knowledge-base/conventions/one-skill-one-output.md))* | [`record-one-skill-one-output-convention.md`](../tasks/done/0064-record-one-skill-one-output-convention/brief.md) |
| ✅ Done | 48 | Ship the one-skill-one-output convention in the scaffold *(closes the 4th live-vs-scaffold instance; owner: fkit-coder; independent — does not wait for 49)* | [`ship-one-skill-one-output-convention-in-scaffold.md`](../tasks/done/0086-ship-one-skill-one-output-convention-in-scaffold/brief.md) |
| ✅ Done | 49 | Investigate dual-home parity — dogfood `ai-agents/` vs `claude/scaffold/` *(investigation — [findings](../knowledge-base/reports/2026-07-18-dual-home-parity-live-vs-scaffold.md); spawned [ADR-027](../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md); owner: fkit-architect)* | [`investigate-dual-home-parity-live-vs-scaffold.md`](../tasks/done/0057-investigate-dual-home-parity-live-vs-scaffold/brief.md) |
| ✅ Done | 50 | Rename the producer's `fkit-task-plan` skill to `fkit-task-brief` *(name collision with the coder's `fkit-plan-task`; atomic — dir + `skills-for-role.sh` + hook together; owner: fkit-coder)* | [`rename-task-plan-skill-to-task-brief.md`](../tasks/done/0075-rename-task-plan-skill-to-task-brief/brief.md) |
| ✅ Done | 51 | Wiki sync after the `task-plan` → `task-brief` rename *(needs 50 — hard; 8 vault pages; owner: fkit-wiki)* | [`wiki-sync-task-plan-rename.md`](../tasks/done/0100-wiki-sync-task-plan-rename/brief.md) |
| ✅ Done | 52 | Design the coder's `task-ship-loop` skill *(design — [spec, rev 3, owner-approved](../knowledge-base/reports/2026-07-17-design-task-ship-loop-skill.md); spawns ADR-019/ADR-020; owner: fkit-architect)* | [`design-task-ship-loop-skill.md`](../tasks/done/0031-design-task-ship-loop-skill/brief.md) |
| ✅ Done | 53 | Implement the `task-ship-loop` skill from the approved design *(owner: fkit-coder; skill live, registered for coder, hook suite green)* | [`implement-task-ship-loop-skill.md`](../tasks/done/0055-implement-task-ship-loop-skill/brief.md) |
| ✅ Done | 54 | Grant the `AskUserQuestion` tool to the six Claude-side agents *(implements [ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md) Decision 4 / task 39 findings; tool grant, not a skill; owner: fkit-coder)* | [`grant-askuserquestion-tool-to-six-claude-agents.md`](../tasks/done/0049-grant-askuserquestion-tool-to-six-claude-agents/brief.md) |
| ⛔ Cancelled (2026-07-19) — not pursuing git automation | 55 | Design the `fkit-git` agent + commit/push consent model *(design — collided with the "never commit" hard rule; **owner ruled 2026-07-19: the hard rule stands, fkit will not gain a commit/push agent — settled, not deferred**; owner: fkit-architect)* | [`design-fkit-git-agent-and-consent-model.md`](../tasks/cancelled/0027-design-fkit-git-agent-and-consent-model/brief.md) |
| ⛔ Cancelled (2026-07-19) — parent design task 55 declined | 56 | Implement the `fkit-git` agent + `commit-push` skill from the approved design *(parent design task 55 declined 2026-07-19 — agent not designed, so no implementation; owner: fkit-coder)* | [`implement-fkit-git-agent-and-commit-push.md`](../tasks/cancelled/0051-implement-fkit-git-agent-and-commit-push/brief.md) |
| ✅ Done | 57 | Relax the tool allowlist for every role except the adversarial reviewer *(implements [ADR-022](../knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md); subsumes task 54's mechanism; tools change only — skills stay locked; owner: fkit-coder)* | [`relax-tool-allowlists-except-adversarial-reviewer.md`](../tasks/done/0070-relax-tool-allowlists-except-adversarial-reviewer/brief.md) |
| ✅ Done | 58 | Refresh the docs for the tool-allowlist relaxation *(ADR-022 doc follow-up; owner: fkit-architect)* | [`refresh-architecture-docs-for-tool-relaxation.md`](../tasks/done/0068-refresh-architecture-docs-for-tool-relaxation/brief.md) |
| ⛔ Cancelled (2026-07-18) — declined on cost per ADR-024 | 59 | Design a timeout-auto-proceed for the ship-loop's owner questions *(feasible but declined on cost per [ADR-024](../knowledge-base/decisions/adr-024-ship-loop-owner-question-timeout-is-not-built.md); safe version = launch-mode + gate re-expression + session-global user-scope AFK timer, not worth the convenience)* | [`design-ship-loop-timeout-auto-proceed.md`](../tasks/cancelled/0028-design-ship-loop-timeout-auto-proceed/brief.md) |
| ⛔ Cancelled (2026-07-18) — parent design task 59 declined | 60 | Implement the ship-loop timeout-auto-proceed from the approved design *(parent design task 59 declined per [ADR-024](../knowledge-base/decisions/adr-024-ship-loop-owner-question-timeout-is-not-built.md); feature not built, so no implementation)* | [`implement-ship-loop-timeout-auto-proceed.md`](../tasks/cancelled/0053-implement-ship-loop-timeout-auto-proceed/brief.md) |
| ✅ Done | 61 | Restructure the coder's report — bullet summary first, interview on open questions last *(agent-contract edit; session=AskUserQuestion / consult=return-in-reply; owner: fkit-coder)* | [`restructure-coder-report-summary-then-interview.md`](../tasks/done/0082-restructure-coder-report-summary-then-interview/brief.md) |
| ✅ Done | 62 | Add a "Speak in simple terms" output-style preference for all agents *(preference not hard-rule; **scoped as 4 files — corrected at build time to ONE source, `claude/scaffold/universal-rules.md`, + re-run init; see the brief's 2026-07-18 correction**; owner: fkit-coder)* | [`add-speak-in-simple-terms-output-style.md`](../tasks/done/0010-add-speak-in-simple-terms-output-style/brief.md) |
| ✅ Done | 63 | Design a laundering-safe consent model for **spawned** invocation of the task movers *(design — [spec](../knowledge-base/reports/2026-07-18-design-spawned-invocation-consent-model-for-task-movers.md); spawned [ADR-025](../knowledge-base/decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md), **reverses the owner-only done-gate hard rule + ADR-019**; owner: fkit-architect)* | [`design-spawned-invocation-consent-model-for-task-movers.md`](../tasks/done/0029-design-spawned-invocation-consent-model-for-task-movers/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | 64 | Implement spawned invocation for the task movers from the approved design *(owner: fkit-coder)* | [`implement-spawned-invocation-for-task-movers.md`](../tasks/done/0054-implement-spawned-invocation-for-task-movers/brief.md) |
| ✅ Done | 65 | Filter the `/fkit-status` board to open tasks only *(conscious reversal of "show the dead rows"; roll-up kept, drifted rows always visible, replace not toggle; owner: fkit-coder)* | [`filter-fkit-status-board-to-open-tasks.md`](../tasks/done/0039-filter-fkit-status-board-to-open-tasks/brief.md) |
| ✅ Done | 66 | Wiki sync after the filtered `/fkit-status` board *(needs 65 — hard; owner: fkit-wiki)* | [`wiki-sync-filtered-fkit-status-board.md`](../tasks/done/0095-wiki-sync-filtered-fkit-status-board/brief.md) |
| ✅ Done | 67 | Add a Backlog board — the default home for unsprinted task briefs *(persistent `sprints/backlog.md`, backfills 5 unsprinted briefs; filename deliberately outside the `sprint-*.md` glob; owner: fkit-coder)* | [`add-backlog-board-default-for-unsprinted-task-briefs.md`](../tasks/done/0001-add-backlog-board-default-for-unsprinted-task-briefs/brief.md) |
| ✅ Done | 68 | Report the Backlog board in `/fkit-status` on request only *(`Backlog` as a target-selector argument — conforms to one-skill-one-output; owner: fkit-coder)* | [`report-backlog-board-in-fkit-status-on-request-only.md`](../tasks/done/0080-report-backlog-board-in-fkit-status-on-request-only/brief.md) |
| ✅ Done | 69 | Wiki sync after the Backlog board introduction *(needs 67 and 68 — hard; owner: fkit-wiki)* | [`wiki-sync-backlog-board-introduction.md`](../tasks/done/0093-wiki-sync-backlog-board-introduction/brief.md) |
| ✅ Done | 70 | Add the `/fkit-open-questions-interview` skill for the six Claude-side roles *(session-history sweep, interview-only, zero write surface; consult degrade per ADR-021; adversarial reviewer excluded per ADR-022; owner: fkit-coder)* | [`add-open-questions-interview-skill-for-six-roles.md`](../tasks/done/0008-add-open-questions-interview-skill-for-six-roles/brief.md) |
| ✅ Done | 71 | Wiki sync after the `/fkit-open-questions-interview` skill lands *(needs 70 — hard; owner: fkit-wiki)* | [`wiki-sync-open-questions-interview-skill.md`](../tasks/done/0097-wiki-sync-open-questions-interview-skill/brief.md) |
| ✅ Done | 72 | Add the `/fkit-dumb-down` skill for the six Claude-side roles *(on-demand re-explain, content-preserving, zero write surface; complementary to task 62 — owner ruled BOTH; adversarial reviewer excluded per ADR-022; owner: fkit-coder)* | [`add-dumb-down-skill-for-six-roles.md`](../tasks/done/0003-add-dumb-down-skill-for-six-roles/brief.md) |
| ✅ Done | 73 | Wiki sync after the `/fkit-dumb-down` skill lands *(needs 72 — hard; owner: fkit-wiki)* | [`wiki-sync-dumb-down-skill.md`](../tasks/done/0094-wiki-sync-dumb-down-skill/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | 74 | Design the task-folder structure and the global task-ID scheme *(design — [spec](../knowledge-base/reports/2026-07-19-design-task-folder-structure-and-id-scheme.md), [ADR-029](../knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md) **accepted**; gates 75–78; owner: fkit-architect)* | [`design-task-folder-structure-and-id-scheme.md`](../tasks/done/0030-design-task-folder-structure-and-id-scheme/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | 75 | Add an `## ID` field to every brief and write down the allocation procedure *(**no registry file** — owner ruled 2026-07-19; **corpus pinned to a commit SHA**; no file moves — reversible by design; needs 74 — hard; owner: fkit-coder)* | [`assign-global-task-ids-and-create-registry.md`](../tasks/done/0017-assign-global-task-ids-and-create-registry/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | 76 | Migrate every task into a folder, absorb `plans/` + `worklogs/` + `reviews/`, and update the tooling *(**atomic — the point of no return**; needs 75 — hard; review strongly recommended; owner: fkit-coder)* | [`migrate-tasks-to-folder-structure-and-update-tooling.md`](../tasks/done/0062-migrate-tasks-to-folder-structure-and-update-tooling/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | 77 | Repair the task links in `reviews/`, `knowledge-base/` and brief↔brief *(**covers pre-existing rot too — ~1/3 already broken before the migration**; **⚠️ its baseline-capture step must run BEFORE 76**, everything else after; sprint-keyed ledgers move to `sprints/reviews/` per design §5.2b; needs 76 — hard; parallel with 78; owner: fkit-coder)* | [`repair-task-links-outside-the-wiki-after-migration.md`](../tasks/done/0079-repair-task-links-outside-the-wiki-after-migration/brief.md) |
| ✅ Done | 78 | Wiki sync after the task-folder migration *(~96 vault refs + structural re-description; **batches the six queued syncs 45/51/66/69/71/73**; needs 76 — hard; parallel with 77; owner: fkit-wiki)* | [`wiki-sync-task-folder-migration.md`](../tasks/done/0099-wiki-sync-task-folder-migration/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | 79 | Compress the Output style section of `universal-rules.md` *(reclaims 549 B; block 3557→3008 B against a launch-blocking 4096 cap; **review pass required** — R3 precedent; sequenced **before** the not-yet-filed ADR-030 prose addition, same file; owner: fkit-coder)* | [`compress-universal-rules-output-style-section.md`](../tasks/done/0022-compress-universal-rules-output-style-section/brief.md) |
| ✅ Done | 80 | Repair the stale `adr-029-stop-hook` links in the wiki vault *(**page rename + 11 files' inbound links** — the vault page itself sat at the old slug, so links resolved silently to the wrong ADR — target is now [ADR-030](../knowledge-base/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md); **owner pulled it forward out of task 78** — depends on nothing, does not wait for the migration; **in flight at filing time**; owner: fkit-wiki)* | [`repair-stale-adr-029-stop-hook-links-in-the-vault.md`](../tasks/done/0078-repair-stale-adr-029-stop-hook-links-in-the-vault/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | 81 | Extend the task movers' reference sweep to `knowledge-base/` *(shipped defect — both movers grep `sprints/` + `tasks/` only, so ADR/report back-links rot on every close; same class as 21/22; **`fkit-task-cancelled` has the gap twice**; recommend landing before 76; owner: fkit-coder)* — **Part B**: next-ADR-number derivation looks in too few places *(2026-07-19 collision)* — **Part C** *(added 2026-07-19)*: `/fkit-wiki-lint` cross-checks vault ADR number vs knowledge-base slug, since a reused number stays resolvable and is invisible to a link check; **Part C ownership settled 2026-07-19 — fkit-coder, task does not split; the wiki's exclusivity is over the vault, not over its own skill source** — **Part D** *(absorbed from 82)*: `claude/fkit-claude-init.sh:847` hard-codes *"Seven roles"*; it is executable source so the architect may not edit it; **⚠️ ADR-028 is decided-not-built — do not blindly substitute Eight**; all four parts fkit-coder | [`extend-mover-reference-sweep-to-the-knowledge-base.md`](../tasks/done/0036-extend-mover-reference-sweep-to-the-knowledge-base/brief.md) |
| ✅ Done | 82 | Refresh `architecture.md` for ADRs 026–030 and the eighth role *(**`architecture.md:4` and `:82` say seven roles; ADR-028 added an eighth — the canonical doc is factually wrong about the team's shape**; **5 doc sites in 4 files** — `architecture.md:4,82`, `CLAUDE.md:7`, `AGENTS.md:7`, `README.md:76`, `claude/README.md:3` — **enumerated by [ADR-028](../knowledge-base/decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md):154-169, which says do not re-derive the list**; also adds a **dated ADR-023→028 pointer** (**ADR-023 is NOT superseded — only its count claim is overtaken**); `PROJECT.md:8,72` moved to **task 83** per ADR-028:154 (the product brief is not the architect's); `claude/fkit-claude-init.sh:847` is executable source, **task 81 Part D**; `wiki-vault/index.md:11` + `wiki/systems/fkit.md:7,15` are **fkit-wiki's resync, flag don't fix**; cites only up to ADR-025, so 026–030 absent plus the 023/024 tombstones; ADR-028/029/030 are **decided but not built** and must not be described as existing structure; historical "seven" in ADRs/reports/closed rows **must stay**; precedent task 58; owner: fkit-architect)* | [`refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role.md`](../tasks/done/0067-refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role/brief.md) |
| ✅ Done | 83 | Amend the product brief for the eighth role — `PROJECT.md:8,72` *(split from 82 per **ADR-028:154** — the brief is the product document, not the architect's; **`:72`'s "not breadth" clause is a product constraint ADR-028 knowingly reverses, so this is a stance restatement, not a count fix**; ADR-028 is **decided-not-built** so the brief must not promise a role that does not exist; **⚠️ needs owner sign-off on the stance wording**; owner: fkit-producer)* | [`amend-project-brief-for-the-eighth-role.md`](../tasks/done/0015-amend-project-brief-for-the-eighth-role/brief.md) |
| ✅ Done | 84 | Wiki resync for the eighth role — after the source docs land *(**⚠️ filed under a false premise, corrected in the brief: the vault is NOT stale** — `index.md:11` and `systems/fkit.md:9,17` already carry an accurate decided-not-built note; ADR-028:165 named them stale and the wiki fixed them afterwards. **The real work is the mirror image** — `fkit.md:9` tracks *which source docs still assert seven*, and that tracking claim expires when 82/83/81-D land; **depends on 82 + 83 + 81 Part D**, precedent task 11 / `sprint-2.md:209`; **not folded into 78**; decided-not-built framing must survive; owner: fkit-wiki)* | [`wiki-resync-eighth-role-after-source-docs-land.md`](../tasks/done/0092-wiki-resync-eighth-role-after-source-docs-land/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | 85 | Assert task IDs are unique in the test suite — the ADR-029 duplicate-ID guard *(**⚠️ priority 85 is append rank, NOT run order — this must land BEFORE 76**, owner-ruled 2026-07-20; ADR-029 Decision 3's **sole** named mitigation for the accepted cross-branch race, and it was never built — task 75 review finding R3; scope is the duplicate-ID assertion **only** — the other two design §10 assertions are in 76; the guard must discover briefs in **both** the flat and folder shapes so 76 cannot silently blind it; owner: fkit-coder)* | [`assert-task-ids-are-unique-in-the-test-suite.md`](../tasks/done/0101-assert-task-ids-are-unique-in-the-test-suite/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | 86 | Add a structured `## Owner` field to the brief schema and the task-brief skill *(owner ruled a structured field, not a prose scrape; defines the field + populates new briefs; blocks 87/88; owner: fkit-coder)* | [`0104-add-owner-field-to-brief-schema-and-task-brief-skill`](../tasks/done/0104-add-owner-field-to-brief-schema-and-task-brief-skill/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | 87 | Backfill the `## Owner` field into all ~103 existing briefs *(**~25 have no recoverable owner — owner-assigned, never guessed**; needs 86 — hard; blocks 88; owner: fkit-coder)* | [`0105-backfill-owner-field-into-existing-briefs`](../tasks/done/0105-backfill-owner-field-into-existing-briefs/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | 88 | Render the Owner column in `/fkit-status`, between Filename and Next step *(the feature the owner asked for; `dashboard.sh` + `SKILL.md` contract + test; needs 86 + 87 — hard; owner: fkit-coder)* | [`0106-render-owner-column-in-fkit-status`](../tasks/done/0106-render-owner-column-in-fkit-status/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | 89 | Make a task's `## Notes`-prose dependency visible to `dashboard.sh` *(the task-84 misreport, 7 status runs; parse-Notes vs enforce-row is the coder's design call; owner: fkit-coder)* | [`0107-teach-dashboard-to-resolve-notes-dependencies`](../tasks/done/0107-teach-dashboard-to-resolve-notes-dependencies/brief.md) |
| 🔲 Backlog | 90 | Investigate making fkit-wiki task completion visible to the board *(investigation — task 80 stuck `In progress` a week; `log.md` is an unread status source; must not breach the owner-gated close; owner: fkit-architect)* | [`0108-investigate-making-wiki-task-completion-visible-to-the-board`](../tasks/backlog/0108-investigate-making-wiki-task-completion-visible-to-the-board/brief.md) |
| 🔲 Backlog | 91 | Design fkit-lead as the orchestrating front door + the `fkit-sprint-ship-loop` skill *(design/feasibility only — owner ruled evolve `fkit-lead` into the single-point-of-interaction doer, relay owner decisions live, design-first; reverses ADR-010 non-doer, collides with ADR-021/024, `task-ship-loop` is session-only; blocks the follow-on implementation tasks; **sprint-fit flagged — Sprint 3 candidate**; owner: fkit-architect)* | [`0109-design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop`](../tasks/backlog/0109-design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | 92 | Evolve `fkit-lead` into the orchestrating conductor — reverse the non-doer stance, add conductor remit + driver discipline, keep routing *(agent-def edit; T2 of design §11; depends on ADR-031/032 which are Done; owner: fkit-coder)* | [`0110-evolve-fkit-lead-into-orchestrating-conductor`](../tasks/done/0110-evolve-fkit-lead-into-orchestrating-conductor/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | 93 | Build the `fkit-sprint-ship-loop` skill — the lead's sprint-scope conductor loop *(the substantive build, design §5; **must carry the plan-gate honesty clause as prose, not a false structural guarantee**; needs 92; owner: fkit-coder)* | [`0111-build-fkit-sprint-ship-loop-skill`](../tasks/done/0111-build-fkit-sprint-ship-loop-skill/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | 94 | Wire `fkit-sprint-ship-loop` into `skills_for_role()` + the FOUR mirrors in the same commit *(`skills-for-role.sh:37` + 4 mirrors per the `:12-24` checklist that has shipped false docs before; needs 93; owner: fkit-coder)* | [`0112-wire-lead-sprint-ship-loop-skill-ownership-and-mirrors`](../tasks/done/0112-wire-lead-sprint-ship-loop-skill-ownership-and-mirrors/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | 95 | Update the launcher menu/help text — "does no work itself" → accurate to a conductor *(text only, no control-flow change per design §4.4; needs 92; owner: fkit-coder)* | [`0113-update-launcher-menu-help-for-conductor`](../tasks/done/0113-update-launcher-menu-help-for-conductor/brief.md) |
| 🔲 Backlog | 96 | Amend PROJECT.md for the evolved `fkit-lead` conductor *(product-brief half of design §11 T6; **needs owner sign-off on stance wording**; needs 92 + 94; owner: fkit-producer)* | [`0114-amend-project-brief-for-lead-conductor`](../tasks/backlog/0114-amend-project-brief-for-lead-conductor/brief.md) |
| 🔲 Backlog | 97 | Refresh architecture.md for the lead conductor + fix the stale §5.2 lock description *(architecture half of T6 **plus** the independent §5.2 `skillOverrides`→ADR-018-hook stale-lock fix, design §1.1; coordinates with 94 on the same file; needs 92 + 94; owner: fkit-architect)* | [`0115-refresh-architecture-doc-for-lead-conductor-and-stale-lock`](../tasks/backlog/0115-refresh-architecture-doc-for-lead-conductor-and-stale-lock/brief.md) |
| 🔲 Backlog | 98 | Add `fkit-sprint-ship-loop` to the ADR-030 Stop-hook skip set *(**gated — the ADR-030 hook is authorized but NOT yet built**; filed to preserve the dependency, do not start until `turn-completion-hook.sh` exists; needs 93 + ADR-030 impl; owner: fkit-coder)* | [`0116-add-sprint-ship-loop-to-stop-hook-skip-set`](../tasks/backlog/0116-add-sprint-ship-loop-to-stop-hook-skip-set/brief.md) |
| 🔲 Backlog | 99 | Wiki ingest — ADR-031/032, the design report, and the evolved lead role *(vault write — fkit-wiki only; recommend running last, after 96 + 97 land; needs T1 (Done) + 92; owner: fkit-wiki)* | [`0117-wiki-ingest-lead-conductor-and-adrs-031-032`](../tasks/backlog/0117-wiki-ingest-lead-conductor-and-adrs-031-032/brief.md) |
| 🔲 Backlog | 100 | Record the ADR-032 sprint-ship-loop autonomy amendment — Build carve-out + Process-review autonomy (option b) + accepted cost + do-not-re-raise guard *(**owner is writing this in a `fkit architect` session** — tracking only, not reassigned; blocks 99's ingest of the *amended* ADR-032; owner: fkit-architect)* | [`0118-record-adr-032-sprint-ship-loop-autonomy-amendment`](../tasks/backlog/0118-record-adr-032-sprint-ship-loop-autonomy-amendment/brief.md) |
| 🔲 Backlog | 101 | Track the `fkit-coder` declared-approval carve-out — the guarantee-surface change 0111 folded in *(**already implemented in the working tree — done-pending-review, not re-do**; the architect asked it get its own reviewable record; needs 93 + 100; **recommend owner-verify, not agent-close**; owner: fkit-coder)* | [`0119-track-fkit-coder-declared-approval-carve-out`](../tasks/backlog/0119-track-fkit-coder-declared-approval-carve-out/brief.md) |
| 🔲 Backlog | 102 | Fix the `fkit-sprint-ship-loop` SKILL.md owner-banner format *(cosmetic; bare `# ⛔ Owner:` H1 → sibling-style title; no ADR-018-hook impact; independent; owner: fkit-coder)* | [`0120-fix-sprint-ship-loop-skill-owner-banner-format`](../tasks/backlog/0120-fix-sprint-ship-loop-skill-owner-banner-format/brief.md) |

### Addendum — tasks 100–102 added out of band (2026-07-22): fkit-lead-conductor arc follow-ups

Follow-ups the shipped arc (0110–0113, all agent-closed) left behind, filed after review of the
design report + ADR-031/032:
- **100 (0118)** — the ADR-032 combined amendment. **The owner is writing this themselves in a
  `fkit architect` session**; this row exists only to track the dependency (101 cites the amendment;
  99/0117 must ingest the *amended* ADR-032, not the pre-amendment one), not to reassign an ADR write.
- **101 (0119)** — the `fkit-coder.md` declared-approval carve-out that resolving 0111's feasibility gap
  required. It is **already in the working tree** (owner-approved + architect-vetted twice) but landed
  *folded inside 0111*; the architect recommended a guarantee-surface change get its own tracked,
  independently-reviewable record. **Done-pending-review** — the brief documents the shipped edit, it
  does not re-do it. **Recommend the owner verify this rather than agent-close it** — an
  `agent-closed — not owner-verified` close would defeat the independent review it was split out for.
- **102 (0120)** — a cosmetic banner-format nit in the sprint-ship-loop SKILL.md. No ADR-018-hook impact.

**Dependency shape:** `93 → 101`, `100 → 101` (citation) and `100 → 99` (amended-ADR ingest); `102` is
independent. Priorities 100–102 appended after 99; **existing ranking untouched — ranking is for the
owner to confirm.**

### Addendum — tasks 92–99 added out of band (2026-07-22): the fkit-lead-orchestrator implementation

The design/feasibility task 91 (0109) is **approved** and its two ADRs — [ADR-031](../knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)
(lead becomes the orchestrating front door) and [ADR-032](../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)
(the sprint-ship-loop autonomy & consent model) — are recorded. This is the follow-on implementation,
scoped from the design report's §11 (T2–T8; **T1 — record the ADRs — is already Done**, so no brief).
The eight T-tasks decompose into eight briefs (T6 split by owner into 96/97).

**Dependency shape (design §11):** `92 → {93 → 94, 95} → {96, 97} → 99`; **98 is gated on the separate,
not-yet-built ADR-030 Stop-hook** and must not be started until `claude/turn-completion-hook.sh` exists.

**Three things the briefs deliberately carry so implementation doesn't lose them:**
- **93** must keep the **plan-gate honesty clause** (design §3.5, ADR-031) as *prose* — on the
  orchestrated path "no code before the owner approves the plan" is prose-enforced, **not** a runtime
  write-wall; a coder must not "fix" it into a false structural guarantee.
- **94** must land the `skills-for-role.sh:37` change **and the four mirrors in the same commit** (the
  `:12-24` checklist, which has shipped false docs before). **97** and **94** both touch
  architecture.md — 97 lands after 94 and must not revert its mirror row.
- **97** also folds in the **independent §5.2 stale-lock fix** (architecture.md still describes the
  retired `skillOverrides`/`CONSULT_SKILLS`, not the ADR-018 hook).

**Two open questions for the owner (design §14 — flagged in the 0111 brief, do not block):** the
working skill name `fkit-sprint-ship-loop`; and whether the general-conductor primitive is its own
named skill or only runs through the sprint loop.

**Owner rulings honored:** filed to **Sprint 2** (owner overrode the design's Sprint-3-candidate flag);
close posture = agent-closed marker by default. Priorities 92–99 appended after 91; existing ranking
untouched. **Ranking is for the owner to confirm.**

### Addendum — task 91 added out of band (2026-07-22)

The owner wants a **single point of interaction** — one agent, aware of the whole toolkit, that knows
each role and spawns/drives them so they needn't open a session per role. After discussion the owner
ruled (2026-07-22): **evolve `fkit-lead`** into that single-point doer/orchestrator (keep the name,
reversing its deliberate non-doer stance), **relay owner decisions live** (pause → ask → resume), and
**design first**. Task 91 is therefore a **design/feasibility task only** (owner: fkit-architect); it
must resolve the collisions with ADR-010 (lead-is-not-a-doer), ADR-021 (spawned agents have no owner
channel), the session-only `task-ship-loop`, and ADR-024 (declined single-task auto-proceed), then spawn
the ADR(s) and the follow-on implementation tasks. Priority appended after 90; existing ranking
untouched. **⚠️ Filed to Sprint 2 per the owner's "current sprint" instruction, but it is thematically a
Sprint 3 candidate — Sprint 2 is the Omnigent removal and is 82/90 done. Sprint-fit and ranking are for
the owner to confirm.**

### Addendum — tasks 89–90 added out of band (2026-07-22)

Filed from the open-questions interview (2026-07-22): the owner ruled *"file both"* on two recurring
board/tooling gaps the producer had flagged without a decision. **89** — `dashboard.sh` cannot see a
dependency stated only in `## Notes` prose, so task 84 rendered a false `ready` and needed hand-correction
across seven status runs. **90** — fkit-wiki records completion only in `wiki-vault/log.md`, which no
board tool reads, so task 80 showed a stuck `🔄 In progress` for a week after its work was done; scoped
as an investigation because the fix turns on a role-boundary/design question. Priorities appended after
88; existing ranking untouched. **Ranking is for the owner to confirm.**

### Addendum — tasks 86–88 added out of band (2026-07-22)

The owner asked that `/fkit-status` show **Owner** as a first-class field in the per-task output —
*"the same way as Status, #, Task, Filename, Next step"* — positioned **just before Next step**. The
owner ruled (2026-07-22) the value must come from a **structured `## Owner` brief field**, not be
scraped from the board-row prose. Since owner is not a field today, that is schema + backfill + render:
task 86 defines the field, task 87 backfills the ~103 existing briefs (of which ~25 have no recoverable
owner and need owner assignment, not a guess), task 88 renders the column. Priorities appended after 85;
the existing ranking is untouched. **Ranking is for the owner to confirm.**

### Addendum — tasks 74–78 added out of band (2026-07-19)

The owner asked for the task structure to change: a task becomes a **folder** named by a **global task
ID**, holding the brief plus every related artifact (plan, worklog, reviews, assets), inside the
existing `tasks/{backlog,done,cancelled}/` boards.

**Three owner rulings taken at scoping time (2026-07-19):** a **new global sequential ID** (tasks have
none today — the numbers in conversation are sprint-scoped priority and collide across sprints); **all
briefs migrate in one pass**, no dual-format period; and the **wiki-vault's ~96 refs are a separate
`fkit-wiki` task**, because only that role may write the vault.

Scoped into five briefs — design (74), IDs (75), the atomic migration + tooling (76), then the two
parallel link repairs (77 coder, 78 wiki). Priorities appended after 73; the existing ranking is
untouched. **Ranking is for the owner to confirm.**

### Corrections (2026-07-19, after the task-74 design landed)

Applied from the design spec
([`2026-07-19-design-task-folder-structure-and-id-scheme.md`](../knowledge-base/reports/2026-07-19-design-task-folder-structure-and-id-scheme.md))
and the owner's rulings on it:

- **The task-64 collision is gone.** Task 64 is Done, so there is no ordering to state. The warnings on
  row 74 and in task 76's brief have been removed — an implementer following them would hunt for a rule
  that does not exist (spec §9.1).
- **Never hardcode a brief count.** The scoping figure of **89** was already stale when written; the
  measured number on 2026-07-19 was **94**, and it is **95** as this correction is applied. Tasks 75–78
  now say *derive the count* (`ls ai-agents/tasks/{backlog,done,cancelled}/*.md | wc -l`) rather than
  naming a figure. **A named count in a verification step is a guaranteed future failure.**
- **The stored ID registry is dropped** (owner ruling, spec §3.6). Authority rests on the folder name
  and the brief's `## ID` field. Task 75 shrinks accordingly.
- **`plans/`, `worklogs/` AND `reviews/` are all absorbed** into task folders as `plan.md`,
  `worklog.md`, `review.md` (owner ruling, spec §4.3) — three top-level directories disappear, not one.
  Tasks 76 and 77 widen accordingly.
- **The six queued wiki-syncs (45, 51, 66, 69, 71, 73) wait and batch into task 78** (owner ruling, spec
  §9.2). This **reverses** the recommendation previously recorded in task 78's brief, which advised
  running them *before* task 76. Their rows now carry a do-not-run-early marker.
- **Consuming-project migration scope is deliberately untouched** — it is open on an ADR-015 question
  the architect still has with the owner.
- **Task 74 is Done** (2026-07-19, agent-closed — not owner-verified). The owner approved the design and
  ADR-029 is `accepted`.

**Second round — from the adversarial pass on the design (2026-07-19).** Three more defects, all in the
briefs rather than the design:

- **Task 76's scaffold instruction was impossible to follow** and has been reversed. It said the
  scaffold "must land the same structure"; obeying that literally would copy *this project's* task
  folders into a consuming project's scaffold, and its verification condition cannot be satisfied by a
  deliberately-empty scaffold. **The scaffold is unchanged** — the three `.gitkeep`s stay as they are
  (spec §4.1 / ADR-029 Decision 9). ADR-027 parity holds for free.
- **Task 76's stop-and-ask on the two sprint-scoped review ledgers is settled and removed.** They move
  to `ai-agents/sprints/reviews/` (spec §5.2b / ADR-029 Decision 7); `ai-agents/reviews/` still
  disappears. As written the brief would have halted the migration **at the point of no return** on an
  answered question.
- **Task 75's ID backfill must be pinned to a named commit SHA**, recorded in the brief before work
  starts. Without the pin the assignment shifts every time a brief is added — the corpus moved 89→94→95
  in days — which silently fails the design's *"two people produce identical IDs"* bar. **Counting stays
  live; the assignment is pinned.**

## Dependency graph

```
1. scaffold ──────┐
2. self-update ───┼──→ 4. installer ──→ 5. delete omnigent/ ──→ 7. VERIFY ──→ 8. docs ──┐
3. codex req ─────┘                                                                      │
                                                          9. kb structure ──→ 10. kb hygiene ──→ 11. wiki sync
6. skill-ownership SoT ──(independent; any time)

12. arch pointer ──(needs 1)
13. initiate-project overview ──(independent)
14. task-plan skill ──(independent)
18. remove --resume ──(needs 2 and 4: they fix the verb set it must not break)
```

## Where the risk actually is

1. **Task 4, `install.sh`** — the `curl | sh` entry point, and **the blast radius of this sprint**.
   Breaking it breaks *installation itself*, including the self-update path that would ship the fix.
   **Must be verified by installing from a branch ref into a clean `$HOME`** — reading the diff is not
   verification for this file.
2. **Task 2, self-update** — **the only non-mechanical piece of the removal.** New code, not a move,
   and it sits in the startup path of every `fkit` invocation. It is also a **live bug fix**: bare
   `fkit` already runs the Claude flavor, which has *no update logic at all* — so every user on the
   default path has been silently stuck on whatever version they installed.
3. **Ordering** — task 5 before task 1 breaks Claude init, the installer, and `fkit update` at once.

## Context

- **Tasks 1–11 execute the architect's removal plan**, one task per phase, in his sequence.
  Tasks 12–14 are the Sprint 1 survivors (see below), appended after the removal work.
- **Task 7 is the release gate.** Sprint 2 rips out a runtime, rewrites the installer, and adds code
  to every startup. Nothing is "done" until a clean install → `fkit` → role session → consult →
  review passes on a clean machine.
- **Task 11 (wiki sync) is genuinely last.** Syncing before the docs are rewritten just ingests the
  drift into the vault — and then it's wrong in *two* places, with the vault carrying the authority of
  "verified knowledge."

## Sprint 1 disposition — the survivors

The owner's instinct to reset Sprint 1 was **mostly** right, but a blanket cancel would have dropped
live work. Per the removal plan §E, of Sprint 1's 12 backlog tickets:

- **5 die with Omnigent** → cancelled: `add-ci-validate-bundles` (its script is deleted),
  `amend-subagent-disconnect-incident-doc` (an Omnigent incident),
  `document-consult-chain-envelope` (the Claude 2-hop envelope is now recorded in ADR-010),
  `fix-agent-count-doc-drift-and-fresh-detection-dup` (those files are deleted),
  `remove-adversarial-reviewer-eager-spawn` (`fkit-team` is deleted).
- **2 were already complete in code** (verified in the audit) → closed as **Done**, not cancelled:
  `give-every-agent-direct-wiki-query-access`, `rollout-adr-004-fixed-consult-titles`.
- **5 are runtime-independent and still live** → **carried into Sprint 2**:
  - `verify-onboarding-flow-end-to-end` — **reframed.** Its premise (`.fkit/run`) died; its intent
    became the sprint's release gate (task 7).
  - `bake-architecture-pointer-into-scaffold-templates` — **rescoped** from `omnigent/scaffold/` to
    `claude/scaffold/CLAUDE.md`, which still carries the placeholder (task 12).
  - `extend-initiate-project-fill-overview` — `/fkit-initiate-project` still exists, still has the
    gap (task 13).
  - `add-task-plan-skill-to-producer` — **a real gap today**: the producer has `initiate-project` /
    `task-done` / `task-cancelled` but **no procedure for writing a task brief** — the thing it is
    most asked to do (task 14).
  - `formalize-knowledge-base-incidents-folder` — runtime-independent, and **task 10 depends on it**
    (`history/` / `incidents/` conventions must be settled before the archive pass) (task 9).

## Not in this sprint (explicitly deferred)

- **Fixing Omnigent-side doc drift, stale counts, or the `install.sh:42` `chmod` bug** — all deleted,
  not fixed.
- **Path-level hook enforcement of role boundaries** — deferred hardening, per ADR-010 §Options.
- **Building `npx fkit` / a `bin` entry** — still deferred. But **ADR-001 itself is now decided and
  needs to be superseded** — see below. That ADR write-up is the only ADR-001 work in scope.

## Owner decisions (2026-07-11) — both blocking questions resolved

- **Task 3 — Codex unreachable ⇒ emit a loudly-flagged partial**, *not* a hard fail (owner ruled
  against the architect's preflight-fail recommendation). The preflight warns; it does not wall.
  **The flag is now load-bearing:** the `NOT model-diverse / incomplete` marker must be the first
  thing a reader sees, because a partial review that reads like a complete one is precisely the
  failure this guards against. **Task 3 is unblocked.**
- **Task 14 — `task-plan` decomposes.** Owner's rule: *"all tasks should be split into the smallest
  possible shippable tasks — if a part can be developed, tested and shipped separately, it's worth a
  sub-task. Sometimes the producer decides alone; sometimes they consult the architect to clarify the
  technical scope."* The test is **independent shippability**, not size. Splits must carry their
  dependency links, or the split has lost information. **Task 14 is unblocked** and its scope widened
  accordingly.

- **Owner decision — `package.json` stays, with its `scripts` (2026-07-11).** This **supersedes
  [ADR-001](../knowledge-base/decisions/adr-001-package-json-stays-metadata-only.md)**, which is now
  wrong on all three of its load-bearing points. Owner's rationale: `package.json` **is in active use**,
  it **provides the project's versioning**, and npm publication stays open **under a changed, scoped
  name** (e.g. `@flashist/fkit`).

  Why ADR-001 could not simply stand:
  1. **The npm name `fkit` is taken.** It belongs to `nullobject/fkit` — an unrelated JS
     functional-programming toolkit at v3.4.1. This project has never been published to npm and
     **cannot be** under that name. ADR-001's rationale for keeping `package.json` (*"the npm listing
     has discoverability value"*) describes a listing **that does not exist** — and `npx fkit` today
     fetches *someone else's library*. Hence the owner's scoped-name ruling.
  2. **The `scripts` block is release tooling, not install semantics.** `bin/release.mjs` bumps,
     commits, tags, and pushes; it explicitly *"makes no npm-registry publish"*. There is still no
     `bin` field, so ADR-001's *spirit* (no `npx` install surface yet) survives — only its literal
     "no scripts" prohibition breaks, on a use it never contemplated. **The scripts stay.**
  3. **⚠️ ADR-001 actively conflicted with Sprint 2 task 2.** It instructs *"stop bumping the
     `version`."* But `version` is the **git-tag version**, and the self-update built in task 2 works
     off `git ls-remote` against those tags. **Following ADR-001 as written would have broken the
     self-update this sprint is building.** Version bumping is load-bearing release infrastructure,
     not an inert npm artifact. **It continues.**

  **Action:** fkit-architect records a new ADR superseding ADR-001, via `/fkit-record-decision`.
  Keep ADR-001's file (honest numbering), mark it superseded. Note that `package.json`'s
  `description` and `keywords` still say "Omnigent" — that cleanup already belongs to **task 5**.

## Addendum — task 17 added out of band (2026-07-11)

**Task 17 (`restore-plan-mode-in-plan-task`) was added after the sprint was planned**, from a defect
fkit-coder diagnosed and confirmed today: `/fkit-plan-task` **no longer enters Claude Code's plan
mode**. The Claude-native port (`627d5ea`) copied the Omnigent-era *prose-only* planning contract —
a workaround for a harness that lacked the tools — back into the Claude flavor, **which has them**.
The gate is a promise, not a wall. `claude/agents/fkit-coder.md` also omits `EnterPlanMode` /
`ExitPlanMode` from its allowlist, so **both** the skill and the allowlist must be fixed or neither
works.

- **It is numbered 17 to avoid renumbering the owner's ranking, not because it is low.** It has **no
  dependency on tasks 1–16** and is **recommended as the first thing picked up** — it repairs the
  planning gate that the rest of this sprint, including the high-risk `install.sh` rewrite (task 4),
  will be planned through.
- **Owner decisions on it are already made** (no session-wide plan default, **no hooks** — ADR-010's
  deferral stands — **no ADR**, and the model-initiated nature of the gate is an accepted residual).
  They are recorded in the brief. **Do not reopen them.**

## Addendum — task 18 added out of band (2026-07-11)

**Task 18 (`remove-fkit-resume-passthrough`) was added after the sprint was planned**, on the owner's
ruling: *"create a task for removing the `fkit --resume` thing (it was created to work around the
limitations and bugs of omnigent)."* It is **the same class of work as tasks 1–5** — Omnigent scar
tissue, removed rather than fixed. `--resume` existed for Omnigent's durable-root session model and its
runner disconnect bugs; a Claude-native role session is just `claude --agent fkit-<role>`, so the problem
it worked around is gone.

- **It is a removal, not a repair.** fkit-coder's earlier triage offered *persist the role* vs *require a
  role*. **The owner rejected both.** That framing is **closed** — do not reopen it, and do not build a
  replacement feature.
- **What actually goes** is the **blanket unrecognized-arg passthrough** in `claude/fkit-claude.sh`, which
  is what routes `fkit --resume` into the `:190` "no role → lead" default and silently resumes any session,
  coder included, under **lead's** lockdown. Doc-only removal would leave that live.
- **Sequenced after tasks 2 and 4**, which between them decide the wrapper's argv surface and where
  `fkit update` lives — the verb set task 18 must not break isn't final until they land. Numbered 18 for
  **append-don't-renumber** discipline. If the coder is already in `fkit-claude.sh` for task 4, landing it
  in the same pass is fine.

## Addendum — tasks 21 and 22 added out of band (2026-07-13)

**A repo-wide link sweep run during task 10 surfaced a pre-existing defect out of task 10's scope:**
`ai-agents/sprints/done/sprint-1.md` carries **6 broken links** (5 distinct tasks). Each is a
`➡️ Moved to Sprint 2` row still pointing at `tasks/backlog/…` for a task that has since been
completed into `tasks/done/`. fkit-coder found it, correctly did not fix it, and escalated.

**The 6 links are the symptom; the recurrence is the bug.** `/fkit-task-done` and
`/fkit-task-cancelled` update the *active* sprint plan but never re-point inbound links in a *closed*
one — so **every future completion of a carried-over task breaks one more link** in an older plan.
Notably, `fkit-task-done/SKILL.md` step 4 **already greps `ai-agents/sprints/` recursively and finds
these rows**; step 5 simply has no instruction for them, because a `➡️ Moved` row has no status to
flip. The skill sees the reference and drops it.

**Split into two tasks on purpose**, per the owner's independent-shippability rule:
- **21** is the one-off cleanup — uncontroversial, shippable today, independent of everything.
- **22** is the process fix — and it is **`🚧 Blocked` on an owner ruling**, not on any other task.

**Landing only 21 buys nothing durable**: the links rot again on the next carried-over completion.

## Addendum — tasks 25–28 added out of band (2026-07-14): the migration investigation's implementation

**Task 20's investigation is complete and the owner has reviewed it.** Findings:
[`reports/2026-07-14-migration-mechanism.md`](../knowledge-base/reports/2026-07-14-migration-mechanism.md)
(rev 2 — rev 1 went through an adversarial Codex pass and **did not survive intact**; two factual claims
were false and the headline changed). Tasks 25–28 are the implementation the owner greenlit. Per the
brief, the producer scopes these **only after** the review gate — which has now passed.

**The headline is not "build a migration mechanism."** It is: **fkit already converges every project on
every launch; `ai-agents/` is simply carved out of it.** Un-carving it — **additively** — is the fix.
There is no migration mechanism, no version walk, and nothing new for a user to run.

**Explicitly rejected, and not to be reintroduced:** the owner's `migration-current.md` +
`migration-X.Y.Z.md` semver-walk idea, a per-project version cursor, and a migration agent. Rejected as
**premature, not wrong** — the owner has acknowledged this. The strongest reason: **a version cursor
cannot survive a `git clone`**, because `.fkit/` is gitignored (`fkit-claude-init.sh:137`) — so a fresh
clone would replay every migration against an already-migrated tree. Report §6.

### The invariant — owner-ratified, and the thing to protect

> **Launch-time convergence NEVER writes to a path that already exists. Create-if-absent only. No
> overwrite, no move, no delete — ever — inside a user's `ai-agents/`.**

Every safety property in this design is downstream of that one line, and so is its one accepted
limitation (below). **The owner has also ratified the report's §8 safety bar as REQUIRED, not
optional:** non-fatal failure, refuse-on-weird-state, announce-what-you-did, an opt-out, and the
`.gitkeep` rule.

### Sequencing — the dependency is real, not a preference

```
25. scaffold fix ────────(independent; ship today; fixes NEW projects)
26. non-fatal init ──┐
                     ├──→ 28. additive convergence  (fixes EXISTING projects — "the migration")
27. weird-state gate ┘
```

- **25 and 26 are independent, unblocked, ship-today bug fixes.** Neither waits on anything.
- **27 is also a live bug on its own merits** — on two of its three cases. A **dangling** symlink makes
  `[ -e ]` false, `cp -R` **refuses** with rc=1, and `set -euo pipefail` kills init (which, before task
  26, **bricked the launcher**) — a denial-of-service bug. A **file** where the directory belongs makes
  `[ -e ]` true, so init skips **silently, forever**, and fkit never says so. Its third case — a **live**
  symlink, which `cp -R` genuinely *does* write through — is **unreachable today** because init skips it,
  and **task 28 is precisely what makes it reachable**. It is split out of 28 rather than folded into it
  so the hazard and its mitigation don't ship in the same commit, where a reviewer cannot tell them apart.
- **28 must not land before 26 and 27.** It makes the unattended, every-launch, project-mutating code
  path *more capable*; doing that while it can still brick the launcher, or while nothing yet stops a
  per-path write from going through a symlink, is exactly backwards.
- **25 and 28 are complementary:** 25 fixes what **new** projects receive; 28 carries that fix into
  **existing** ones. Neither alone is sufficient.

### Accepted residuals — decided, not overlooked

- **Content drift is deferred — a deliberate owner decision.** A scaffold-authored file whose *contents*
  drifted (this repo's `ai-agents/README.md` already has, in **both** directions) is a path that
  **already exists** — so the invariant **forbids** convergence from fixing it. **The safety and the
  limitation are the same property.** The report §3 costs the design that would fix it (a shipped
  hash-manifest keyed on content *identity*, not version order). **Re-raise when a third fkit-authored
  file starts drifting** — not before.
- **A renamed folder gets you both.** Rename `sprints/` to `iterations/` and convergence recreates
  `sprints/` alongside it. No stateless mechanism can know a rename happened. **Inherent limit — must be
  disclosed in the docs, not discovered by a user.**
- **The re-raise trigger, and it fires early:** the moment someone **proposes** a change that would
  move, rename, or delete content inside a consuming project's `ai-agents/`, this decision is **void and
  returns to the owner**. It fires on the *proposal*, not the implementation — because by the time a
  destructive migration is *written*, the wrong hook has already been chosen. **It does not get dropped
  into `fkit-claude-init.sh` as a one-off. Ever.**

### Not scoped — deliberately

The report's §9 **`.fkit/` Omnigent-orphan cleanup** (`.fkit/agents/`, `.fkit/run`, `.fkit/team-session`,
`.omnigent/`) has **no task and is not in this sprint.** The owner did not greenlight it. It is the one
**destructive** act in the report — an `rm -rf` in a user's project, with no rollback — and the report's
own rev-1 deletion list **wrongly included `.fkit/settings`, which is live ADR-010 lockdown state
rewritten on every launch** (`fkit-claude.sh:257-268`). A reviewer trusting that table would have shipped
a delete of live state. **It needs its own owner decision on the consent model before it is scoped.** See
open question 5.

## Correction (2026-07-14) — task 27's stated rationale was wrong, and shipped that way

**As first written, this addendum and task 27's brief both asserted — as established fact — that a
*dangling* `ai-agents` symlink makes today's `cp -R` "write the scaffold through the link, to a path
outside the project": a live, present-day write-outside-the-project bug.** It is not true, on any
platform.

- **fkit-coder could not reproduce it** on macOS/BSD `cp`: it refuses (`File exists`), rc=1, nothing
  written outside the project.
- **fkit-reviewer settled the Linux question in a Debian container:** **GNU coreutils 9.1 `cp -R` also
  refuses** (`cannot overwrite non-directory`), rc=1, the outside path is **never created**. **BusyBox
  refuses too.** Codex confirmed from the GNU manual that the historical write-through behavior on this
  case occurs only under `POSIXLY_CORRECT`.

**No live write-outside-the-project bug ever shipped.** What is real is stated above and in the brief:
a **denial-of-service** bug on the dangling symlink (rc=1 → `set -euo pipefail` → dead init → bricked
launcher, pre-task-26), a **silent-skip-forever** bug on a file-where-the-directory-belongs, and a
**prospective** write-through on a *live* symlink that **task 28 is what arms**.

**How it got here, recorded rather than smoothed over:** the claim entered
[`reports/2026-07-14-migration-mechanism.md`](../knowledge-base/reports/2026-07-14-migration-mechanism.md),
was carried into task 27's brief by the producer **without independent verification**, and was caught
only at **implementation and review** — the second false claim to come out of that report's lineage
(rev 1 lost two others to an adversarial Codex pass). **We did not know all along.** The lesson is the
cheap one: *a behavioral claim about a shell builtin or coreutil is a claim to run, not to reason
about* — and a brief that says "confirm the bug is real" **before** anyone has is a brief that has
already assumed its answer.

**Task 27 itself is unaffected and stands.** It is implemented, verified, and correct; only its stated
rationale was wrong, and it has been replaced with the true one. *(fkit-architect is separately
correcting the same claim in the migration report and checking ADR-015.)*

## Addendum — tasks 30–32 added out of band (2026-07-14): the shared-instructions investigation's implementation

**Task 29's investigation is complete and the owner has reviewed it.** Findings:
[`reports/2026-07-14-shared-instructions-layer.md`](../knowledge-base/reports/2026-07-14-shared-instructions-layer.md)
(**rev 2** — rev 1 went through an adversarial Codex pass, 17 findings, and **its recommendation did not
survive**; rev 2 **reverses** it). Tasks 30–32 are the implementation the owner greenlit. Per the brief,
the producer scopes these **only after** the review gate — which has now passed.

**The headline is not "build a shared instructions layer."** It is: **the layer already exists and
already ships** — the *"Universal hard rules (every role, every session)"* block in
`claude/scaffold/CLAUDE.md:56-63`, proven **3/3** (Claude Code 2.1.208) to reach **both** a session and a
spawned consult. **What is broken is its delivery, on two paths.** Nothing new gets built.

**The owner's original need is already met, today, with zero code:** to give every fkit agent a standing
instruction, he writes it in `CLAUDE.md`.

### Rejected — by the owner, by name, and not to be reintroduced

- **`ai-agents/AGENTS-COMMON.md` and the agent-file splice** (rev 1's recommendation). It **structurally
  cannot reach Codex** — the adversarial skill builds its own prompt and Codex never reads
  `.claude/agents/`. A "shared layer for **all** agents" that excludes the second model is misnamed. It
  also **silently depended on parked task 28** (its stub ships inside `ai-agents/`). Report §4.
- **`claude --append-system-prompt`.** **Session-only.** Two independent experiment designs, **0/3 then
  0/2** into a spawned consult, with a within-subject control that stayed live. The tombstone matters:
  it is the obvious idea, and the next person to have it must find the grave, not the trap. Report §5.
- **The "seven files have drifted" motivation. It collapsed.** The rule is present in **6 of 7** agent
  files — not 2 of 7 as task 29's brief claimed. Three counts were published, all three wrong, all three
  from grepping one phrasing of a *semantic* rule. **Lesson: read the files.** The real case for this work
  is holes 1 and 2 below, not the drift.
- **A single edit point for the owner's own instructions** — the owner declined to pursue it on other
  grounds. No task.

### The two real holes — and hole 2 is the find

- **Hole 2 → task 30. `codex exec --sandbox read-only --cd "$PWD"` means the codex CLI natively reads
  root `AGENTS.md`** (init's own comment says so, `fkit-claude-init.sh:9-10`) — **and
  `claude/scaffold/AGENTS.md` contains ZERO universal hard rules.** So does this repo's. **The one model
  [ADR-009](../knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md) *requires* for
  independent, model-diverse review runs with no "never commit", no "no secrets", no "don't write the
  wiki."** A live defect, near-free to fix, **fix it regardless of everything else.**
- **Hole 1 → task 31.** Init leaves an existing `CLAUDE.md` **as-is** (`:64-65`), so **every brownfield
  project — i.e. every project that already used Claude Code — has received none of fkit's rules, ever.**
  And fkit has **no channel to ship a correction through**. Fix: a **marker-delimited, fkit-managed,
  idempotent** block merged into both root files.

### ⚠️ Idempotency is the load-bearing requirement in task 31

**Init runs on every launch.** A merge that appends would grow the user's `CLAUDE.md` **without bound,
one block per launch**. The block must be **replace-in-place** — same content, same position, byte-identical
on re-run. The brief says so and its verification proves it: **run init 3×, get exactly one block and an
identical checksum.**

**Task 31 is also the first fkit code that writes into a file the user already owned**, unattended, every
launch. Hence: everything outside the markers is untouched forever, malformed states **refuse** rather than
guess, `[ -L ]` **before** `[ -e ]` (task 27's lesson, second seam), all-or-nothing via temp+`mv`, and
**silence when nothing changed**.

### Sequencing

```
30. codex gets the rules ──→ 31. idempotent merge into existing root files
    (independent; ship first)     (needs 30's canonical text; NOT blocked by parked task 28)

32. fkit-lead "no secrets" ──(independent; any time)
```

- **Task 31 does NOT depend on parked task 28 — confirmed.** `CLAUDE.md`/`AGENTS.md` are **project-root**
  files handled by init **step 2** (`:62-75`), a **different seam** from the all-or-nothing `ai-agents/`
  guard (`:55-56`) that 28 is about. **31 ships with 28 still parked.** *(This is exactly what killed the
  splice: its delivery ran through `ai-agents/`.)*
- **30 → 31 is a soft dependency**: 30 lands the canonical rules text that 31 hoists into a single source.
  It could be done in one pass, but 30 is a live defect with a ten-minute fix and should not wait behind a
  mechanism change. **Accepted churn:** 31 re-cuts ~8 lines that 30 wrote.

### Delivery: structural. Compliance: advisory. Full stop.

This makes the rules **arrive**. It does **not** make them **enforced**. There are **zero hooks** in this
repo; **all seven agents hold `Bash`** and five hold `Write`/`Edit`. A rule in a context file is **prose
asking an agent to behave**. Report §6 is the *only* claim level in the report, and the sprint will not
carry a stronger one — the "structural, not by instruction" overclaim is what ADR-012 had to retrofit onto
ADR-010, and it is not being repeated here.

### Explicitly out of scope

- **Stripping the duplicated rules out of the seven agent files.** Owner asked for **additive only**, and
  with the drift motivation collapsed it is moot.
- **Hooks / tool-level enforcement.** ADR-010's deferral stands.
- **Anything requiring parked task 28.**

## Addendum — task 33 added out of band (2026-07-15): a launcher defect the task-23 suite caught

**Task 33 (`fix-headless-menu-guard-crash`) was added after task 23's launcher-contract suite went
red.** On a no-role, no-args invocation of an **initiated** project with **no controlling terminal**
(piped / CI / detached), the launcher **crashed instead of defaulting to the team room.** The menu
guard gated on `[ -r /dev/tty ]`, which tests the device node's permission bits (`access()`), **not**
whether `open()` succeeds — and `/dev/tty` is world-`rw` on macOS/Linux, so it read TRUE with no
controlling terminal. The branch was entered, `exec 3</dev/tty` failed ENXIO under `set -eu`, and the
`role="lead"` default below was **never reached.** The lead default — the launcher's "piped/CI → safe
default" promise — was **dead code on any normal system.**

- **It is a defect against an EXISTING contract, not a decision.** `fkit-claude.sh:462-464` and **task
  23's assertion 7** both already settle initiated-headless → lead. **No ADR.** fkit-architect confirmed
  the `access()`-vs-`open()` cause (2026-07-15 consult).
- **Fix (applied in the working tree):** swap `[ -r /dev/tty ]` at `:426` for an openability probe
  `( exec 3</dev/tty ) 2>/dev/null`, which returns 0 only if `open()` genuinely succeeds. Verified:
  headless→lead (exit 0), interactive menu still opens on a real pty, fresh→producer unchanged. Task
  23's assertion 7 flipped from `todo` to enforcing and passes.
- **Numbered 33 for append-don't-renumber discipline, not because it is low.** Its **priority intent
  sits with the task-23/24/28 launcher cluster** — task 23 is what caught it, and 23's assertion 7 is
  only truly enforcing once this lands. **Depends on nothing**; **can co-land with task 18's launcher
  pass.**
- **Status is `🔲 Backlog` on purpose:** the fix is **uncommitted and not yet independently reviewed.**
  It is **not Done** — that is owner-gated via `/fkit-task-done` after review.
- **Scope boundary:** the **FRESH-project** headless case (producer vs lead) is **untouched** — it
  remains **task 23's reserved open question 1.**

## Addendum — tasks 34 and 35 added out of band (2026-07-15): the task movers leave brief headers stale

**A `/fkit-status` run on 2026-07-15 surfaced standing board-vs-brief drift produced by the movers
themselves.** `/fkit-task-done` and `/fkit-task-cancelled` flip the sprint-plan Status cell and move
the brief, but **neither updates the moved brief's own `## Status` field** — so a brief in `done/`
still reads `🔲 Backlog` internally while the board reads `✅ Done`. Visible right now on tasks **23,
30, 31, 32, 33** (closed by the current mover) plus two non-Sprint-2 leftovers
(`build-fkit-reconnect-tooling.md`, `fix-claude-agents-md-placeholder-text.md`).

**This is the same class as task 22** — a mover updating one record of a task's state and silently
leaving another stale. Fix philosophy is identical: make the mover write *every* place the state lives.

**Split into two on the owner's independent-shippability rule:**
- **34** fixes `/fkit-task-done` (`✅ Done`).
- **35** fixes `/fkit-task-cancelled` (`⛔ Cancelled (YYYY-MM-DD) — <reason>`, with the extra
  requirement of reproducing the mandatory date+reason faithfully).

Neither depends on the other; each closes drift on its own mover. They share a design (idempotent
header write, flag-don't-invent a missing section) and **can co-land in one pass.**

**Scope boundary — not a backfill.** These prevent *new* drift. Reconciling the five already-drifted
briefs (23, 30, 31, 32, 33) and the two leftovers is a separate manual concern via deliberate edit —
**not** an in-skill historical sweep.

**No scaffold copy exists.** The mover skills live only in `claude/skills/`, not under
`claude/scaffold/`, so the canonical sources are `claude/skills/fkit-task-done/SKILL.md` and
`claude/skills/fkit-task-cancelled/SKILL.md`; the `.claude/` copies are gitignored and init-regenerated.

**Numbered 34/35 for append-don't-renumber discipline.** Owner to confirm the ranking.

## Addendum — tasks 36 and 37, and one unsprinted task, added out of band (2026-07-15): open-question dispositions

The owner's 2026-07-15 rulings on the open questions (below) spawned three briefs:

- **Task 36 — `remove-fkit-omnigent-orphan-residue.md`** (OQ5). The migration report's §9 `.fkit/`
  cleanup: the **one destructive act** in the whole migration design (`rm -rf` in a user's project, no
  rollback). Deliberately **not** folded into the additive-convergence work (25–28), which never deletes.
  **Depends on task 28** (met), and was blocked on an owner ruling on the consent model — **ruled
  2026-07-17: announce-only** (owner is currently fkit's only user; Omnigent-scoped only, no precedent
  for future destructive operations). **Unblocked.** Exhaustive target list — `.fkit/agents/`,
  `.fkit/run`, `.fkit/team-session`, `.omnigent/`; **`.fkit/settings` is live lockdown state and must
  never be touched** (the rev-1 report named it for deletion — the mistake this task's reference-check
  gate exists to catch).
- **Task 37 — `record-shared-instructions-reversal-adr.md`** (OQ6). Tombstone ADR for the
  shared-instructions reversal; rejects `AGENTS-COMMON.md` (cannot reach Codex) and
  `--append-system-prompt` (session-only, `0/3`→`0/2` on Claude Code 2.1.208) **by name**, with the
  version pinned. **Owner: fkit-architect**, via `/fkit-record-decision`. Depends on nothing.
  **⚠️ Duplicate — do not implement.** All of the above was already recorded as
  [`ADR-016`](../knowledge-base/decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md)
  on **2026-07-14**, before this task was scoped; verified against all five of the task's own
  verification steps (see OQ6). The brief stays in `backlog/` at `🔲 Backlog` until the owner runs
  `/fkit-task-cancelled`.
- **Unsprinted — `gate-read-side-symlink-hazard-in-init.md`** (OQ7). The read-side counterpart to task
  27's write-side symlink guard. **Latent** (no code reads through `ai-agents/` today); tracked
  independently, per the owner, so it is not lost while task 28 is parked. Filed unsprinted.

**Numbered 36/37 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — task 38 added out of band (2026-07-16): the full-board switch

**Task 38 (`add-full-board-switch-to-fkit-status`) was scoped unsprinted, then pulled into Sprint 2 by
the owner (2026-07-16).** It adds a reserved `full` keyword (aliases `all` / `board`) that forces
`/fkit-status` to render the complete step-4 dashboard even on a repeat call, overriding the step-5
delta default. **Skill-text only** — `claude/skills/fkit-status/SKILL.md`, no scaffold copy, no launcher
or product code, no new skill registration.

- **Owner: fkit-coder.** **Depends on: nothing** — independent of the mover-drift tasks (34, 35) and
  everything else in Sprint 2.
- **Numbered 38 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — task 39 added out of band (2026-07-16): the AskUserQuestion investigation

**Task 39 (`investigate-askuserquestion-availability-for-agents`) was scoped unsprinted from the
owner's ask — *"make the `AskUserQuestion` skill available for all agents"* — then pulled into Sprint 2
by the owner (2026-07-16).**

**It is an investigation, and deliberately not the grant.** Three things established while scoping make
the seven-line version premature:

- **`AskUserQuestion` is a Claude Code *tool*, not a skill.** fkit gates skills via `skills_for_role()`
  / `skillOverrides` ([ADR-010](../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md),
  [ADR-012](../knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md))
  and **tools** via the `tools:` frontmatter in `claude/agents/fkit-*.md`. Verified 2026-07-16: it is in
  **none** of the seven allowlists and nowhere in `claude/` — **no agent can use it today.**
- **Session-vs-consult behavior is unmeasured, with expensive precedent.** `--append-system-prompt`
  looked obviously inheritable and was **session-only — 0/3, then 0/2** into a spawned consult
  ([report rev 2](../knowledge-base/reports/2026-07-14-shared-instructions-layer.md), Claude Code
  2.1.208). Same seam. Per
  [`evidence-before-assertion`](../knowledge-base/conventions/evidence-before-assertion.md) (task 24),
  **this is a claim to run, not to reason about.**
- **"All agents" may be structurally false.** `fkit-adversarial-reviewer` reviews on **Codex**, which has
  no `AskUserQuestion` — the same shape as the rejected `AGENTS-COMMON.md` (*"a shared layer for all
  agents that excludes the second model is misnamed"*).

**⚠️ It collides with a designed constraint, not an oversight.** `claude/agents/fkit-producer.md:44` and
`claude/agents/fkit-architect.md:38` both instruct a spawned consult to return an open question **in its
reply rather than asking**. Granting the tool would let a consult interrogate the owner mid-chain —
**a change to the consult model (the two-hop envelope), which is an owner decision, not a tool toggle.**

- **Owner: fkit-architect**, with the **owner present** for the consult-model call. **Depends on:
  nothing. Blocks: any implementation of the grant** — no implementation brief until findings are
  reviewed (the task-20 / task-29 pattern; both of those rev-1 recommendations died to an adversarial
  Codex pass, and this report is recommended for the same).
- **Numbered 39 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — tasks 40 and 41 added out of band (2026-07-16): the deterministic dashboard

**The owner's ask — a "deterministic layer" for `/fkit-status`:** a script that renders the step-4
dashboard, invoked by the skill so its output is shown, **replacing the prose dashboard-description**.
Beats 1–6 stay LLM-driven. Scoped unsprinted (2026-07-16), then pulled into Sprint 2 by the owner.

**Split design-then-implement on the architect's advice** (consult, 2026-07-16), because the runtime and
output contract were unsettled **owner-facing** decisions — building against them unsettled is what the
split exists to prevent.

**The feasibility split that drives both tasks:** row cells, roll-up counts, drift *facts*, and four of
the six Next-step shapes (`closed`, `dead`, `in Sprint N`, `waiting on owner`) are **deterministic**.
**`ready` vs `after N` is NOT** — the `Depends on:` line is free text, naming dependencies by number, by
phase name, and by filename slug. It is the one column the skill already flags as *"the easiest place to
start making things up."*

- **Task 40 — design. `✅ Done`**, closed by the owner via `/fkit-task-done`. Deliverables landed:
  [the spec](../knowledge-base/reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md)
  (all six items ruled) and
  [**ADR-017**](../knowledge-base/decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md).
  Decisions: output contract = **one run, two delimited sections** (`BOARD` verbatim + `FACTS` narrated
  from — so the board and beats 2/6 cannot disagree); `ready`/`after N` **stays LLM** with a sentinel
  for underived cells, and **`Depends on:` is not touched**; runtime **bash**; placement
  `claude/skills/fkit-status/dashboard.sh`, invoked **`bash <path>`, never `./<path>`** (the exec bit
  does not survive the ship chain — ADR-017); test **yes**, `node --test` at repo root.
- **Task 41 — implement + wire. `🔲 Backlog`, and now genuinely unblocked** — 40's spec is the contract
  it builds against. **Kept as one unit** (script + wiring): a script with no wiring buys nothing, and
  the wiring needs the script.

**Numbered 40/41 for append-don't-renumber discipline — contiguous and in dependency order. Owner to
confirm the ranking.**

## Addendum — tasks 42 and 43 added out of band (2026-07-16): the coder→reviewer skill-gate bug

**A live bug surfaced today during ordinary use of Sprint 2 workflow, not from a task in progress:**
fkit-coder spawning `@fkit-reviewer` to run a stateful review failed with `Error: Skill
fkit-stateful-review is disabled for model invocation in skillOverrides settings`. Traced across
three fkit-coder ↔ fkit-architect consults today to the same mechanism
[ADR-012](../knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md)
already found once: a spawned subagent inherits the *launching* session's `skillOverrides`, not its
own role's. ADR-012 hand-patched one instance of this (producer → architect, `fkit-survey-project`,
via `CONSULT_SKILLS`); coder → reviewer is the same class, unpatched, and it will keep recurring for
any other role pair.

**This is not a new decision — it is ADR-012's own re-raise trigger, now confirmed met.** ADR-012
Decision 4's residual-risk clause says to reopen Decisions 3 and 4 together the moment the
`PreToolUse` hook payload is confirmed to expose the calling subagent's real identity *and* someone is
prepared to build the gate. Verified today, against the running Claude Code binary: the payload does
expose the real caller (`agent_type`/`agent_id`) at any spawn depth, and the design (**"the
hook-flip"**) is worked out — a `PreToolUse` hook on the `Skill` tool that denies by the invoker's
*actual* role (keyed on the existing `skills_for_role()` source of truth), replacing the
`skillOverrides`-based off-list and retiring `CONSULT_SKILLS` entirely. Full design detail is in
task 42's brief.

**Split design-then-implement, on the same pattern already used for tasks 40/41 and the
investigation-then-implementation tasks 20/29/39** — recording an ADR and building against it are
independently shippable, and the architect said the ADR amendment must land first:
- **Task 42 — record the ADR** (reopen ADR-012 Decisions 3 & 4). Owner: fkit-architect. Depends on
  nothing; the analysis is already done.
- **Task 43 — implement the hook**, retire the old off-list/`CONSULT_SKILLS` plumbing once the hook is
  verified, update the two docs ADR-012 flagged. Owner: fkit-coder. **Depends on task 42 — hard.**

**Priority intent, despite append-only numbering:** this is a live bug blocking the coder's ability to
consult the reviewer at all for a stateful review — **recommended as the next thing picked up**,
ahead of the remaining lower-urgency backlog (34–39, 41), the same way task 17 was prioritized out of
its append-order slot. Owner to confirm the ranking.

**Not in scope for either task:** the "prose-only, no hook" alternative — evaluated and rejected today
(defeatable by prompt injection; would retire ADR-010's structural claim rather than strengthen it).
Task 42 records that rejection so it isn't re-litigated.

## Addendum — tasks 44 and 45 added out of band (2026-07-16): one skill, one output — reverting task 38

**The owner ran `/fkit-status`, was told *"Board not re-rendered (delta default). Run `/fkit-status
full` for the complete 43-row board"*, and asked why they should have to.** Ruling (verbatim):

> *"I want to remove different versions of the skill, there should be 1 version of the output if I run
> the skill, no additional arguments. I guess it means that we need to remove `full` and make the
> full-run by default."*

**This reverts task 38, `✅ Done` and shipped earlier the same week.** Task 38's brief argues
persuasively *for* the switch. **It is stale for one reason worth recording:** the step-5 delta default
was designed when the board was **hand-built by the LLM** — re-rendering 43 rows meant re-deriving every
marker and risking the miscount `SKILL.md` warns about. **Task 41 made the board `bash dashboard.sh` —
deterministic and free — retiring half the delta default's justification.** What survived was terseness
alone, and that is the owner's call.

**⚠️ `full` and the delta default go together or not at all.** Removing the keyword while keeping the
delta would be **strictly worse than today** — no path to the full board at all. The delta default is
the thing; `full` is only the patch on it.

### Settled by the producer: the sprint-name argument **survives**

*"No additional arguments"* reads literally as also killing `/fkit-status Sprint 1`. **It does not.**
The owner glossed their own rule and **named only `full`**; a sprint name is not an output *variant*
but a different *subject*; and killing it makes `sprints/done/` **unreachable by any path** — the same
failure shape as removing `full` while keeping the delta. **Owner to confirm at review**; the brief does
not build the two-argument removal on spec.

### Sequencing

```
44. remove the variants (fkit-coder) ──→ 45. wiki sync (fkit-wiki)
    (depends on nothing; 41 already landed)   (hard dependency — syncing first ingests the drift)
```

- **44 depends on nothing.** Task 41 is its *precondition already met*, not a blocker.
- **45 is split out because only `fkit-wiki` may write the vault** (ADR-005) — 8 pages reference `full`.
  Task 11's lesson: sync **after** the change, or the vault carries the drift with the authority of
  verified knowledge.

### Not in scope — deliberately

- **The dated design report** (`reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md`,
  3 refs) and **task 38's brief in `tasks/done/`**. Both are **history and stay frozen** — true when
  written. Task 38 remains `✅ Done`; it *was* done.
- **A softer delta** ("delta unless much changed"). A conditional variant is the same defect rewearing
  the hat.

### The tombstone-ADR call: **no ADR** — and the producer's reasoning, so it can be overruled

**Recommendation: no ADR.** The precedent raised is task 37 (the shared-instructions tombstone), and
**it does not transfer.** Task 37 tombstones a **mechanism** — it rejects `AGENTS-COMMON.md` and
`--append-system-prompt` **by name**, both of which are the first thing a competent person reaches for
and one of which cost an adversarial review to undo. **Nothing technical was learned here.** The owner
changed their mind about terseness after task 41 changed the cost. This repo's ADRs record mechanism and
structure (runtime, lockdown, KB layout, the exec bit) — not a product preference about one skill's
output. The record is task 44's brief and this addendum, both naming task 38 so the trail is findable
from the reverted work; task 45 additionally requires the task-38 **wiki page to be marked reverted
rather than deleted**, which is where someone re-proposing the feature would actually look.

**The tradeoff, stated plainly:** a brief in `tasks/backlog/` and an addendum in a sprint plan that will
be archived to `sprints/done/` are **weaker records than an ADR**, and neither is where a person
proposing a feature looks first. If `full` gets re-proposed citing task 38, this call was wrong and an
ADR is one cheap architect task away. **See open question 8** — the generalizable principle may be
better recorded as a **convention** than an ADR, and that is the owner's to rule.

## Addendum — task 46 added out of band (2026-07-16): the mutation-testing-library question

**Task 46 (`investigate-mutation-testing-library-adoption`) was scoped from the owner's reaction to a
review finding, mid-implementation of task 43** — relayed by fkit-coder, not raised by the producer.
Round-1 stateful review of task 43 (`ai-agents/reviews/implement-pretooluse-skill-ownership-hook.md`,
finding **R2**) found `test/prove-red.sh` — the task-23 / [ADR-014](../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md)
mutation-testing hard gate — silently broken by task 43's own refactor (a hardcoded path failing even
at the unmutated baseline, and a `sed` mutation target that had moved). **R2 itself is fixed and
verified inside task 43's scope** — task 46 is the forward-looking question the owner raised in
response to it, verbatim: *"it looks like we need to use a proper library for auto-tests, which handles
this specific type of tests 'testing negative cases'."*

**It is scoped as an investigation, not an implementation, on purpose** — same pattern as tasks
20/29/39/45(-adjacent): a library adoption here would have to reconcile with ADR-014's settled
zero-devDependencies stance (Decision 4) and its hard-coded-oracle principle (Decision 5), and whether
that tradeoff is worth it is an architecture call, not the producer's to make in the brief. **Owner:
fkit-architect.** Depends on nothing; does not block task 43 or anything else in Sprint 2.

**Numbered 46 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — task 47 added out of band (2026-07-17): OQ8 resolved — the convention

**The owner ruled OQ8: generalize.** *"One skill, one output"* is a standing rule for every fkit
skill, recorded as a `knowledge-base/conventions/` entry per the producer's recommendation — with the
owner's own qualification built in: **operands are not variants.** Skills that require arguments
(`/fkit-task-done <path>`, `/fkit-task-cancelled <path> <reason>`, `/fkit-status <sprint>`, stateful
review's docs) are untouched — an argument that selects *what the skill works on* is a parameter; one
that selects *what the same work looks like when reported* is the forbidden variant. Task 47 records
the rule, the litmus test, the honest history (`full` was correct when written; task 41 made it
wrong), and the escape hatch (a proposed variant goes to the owner, at proposal time).

- **Owner: fkit-architect.** Document only. **Depends on: nothing; does not block task 44** — task 44
  is the instance, 47 is the rule; shippable in either order.
- **Numbered 47 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — tasks 48 and 49 added out of band (2026-07-17): the dual-home parity gap

**Task 47's delivery surfaced the fourth instance of a recurring class:** the convention landed in the
live `ai-agents/knowledge-base/` but not in `claude/scaffold/ai-agents/` — so consuming projects would
never receive it. Prior instances, all fixed one-at-a-time without touching the cause:
`fix-scaffold-knowledge-base-folders`, `bake-architecture-pointer-into-scaffold-templates`,
`align-conventions-readme-enforcement-item-live-vs-scaffold`. The owner ruled the cause now gets
addressed: *"changes are applied both to the current dogfood version and to the version that will be
shipped to the end users."*

**Split on the independent-shippability rule, and deliberately NOT sequenced:**
- **Task 48** closes the current instance — copy the convention + index row into the scaffold, verify
  by clean-init and convergence check. Owner: fkit-coder. **Does not wait for 49.**
- **Task 49** is the investigation into the cause — enumerate the dual-home files, rule on a
  must-match manifest vs accepted drift, spec a process layer (`/fkit-task-plan` scoping check +
  convention entry) and a mechanical parity test under ADR-014's zero-devDeps constraint, and state
  whether the deferred content-drift decision's *"third drifting file"* re-raise trigger has fired.
  Owner: fkit-architect. **Investigation-first (the task-20/29/39 pattern): implementation briefs only
  after the owner reviews findings.** Known trap recorded in the brief: accepted drift exists
  (`ai-agents/README.md`, both directions, deliberate) — a naive parity check is red from birth.

**Numbered 48/49 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — tasks 50 and 51 added out of band (2026-07-17): the skill-name collision

**The owner's ask:** rename the producer's `/fkit-task-plan` to `/fkit-task-brief` — it is the coder's
`/fkit-plan-task` with **the same two words swapped**, for the opposite end of the task lifecycle.
The new name says what the skill produces: briefs.

**Split coder/wiki on ADR-005's write boundary, same as 44/45:**
- **Task 50 — the rename** (owner: fkit-coder). Deliberately **atomic**: the skill directory,
  `skills-for-role.sh` (the ownership source of truth), and the task-43 PreToolUse hook must flip
  together or the producer loses the skill mid-rename. Dual-home discipline applies — the two
  conventions files naming the skill change in **both** the live tree and the scaffold. Every
  `task-plan` grep hit must be read, not batch-replaced — half the vocabulary belongs to the coder's
  un-renamed skill. History (closed plans, done briefs, reports, this plan's frozen addenda) stays
  frozen.
- **Task 51 — wiki sync after** (owner: fkit-wiki; **needs 50 — hard**). 8 vault pages carry the old
  name; living pages get the new name, historical pages get the task-45 mark-don't-delete treatment.

**Numbered 50/51 for append-don't-renumber discipline — contiguous and in dependency order. Owner to
confirm the ranking.**

## Addendum — tasks 52 and 53 added out of band (2026-07-17): the coder's autonomous loop

**The owner's ask:** a coder skill (working name `task-ship-loop`) taking a task from brief to done
with minimal owner involvement — a 13-step loop sketch, with the owner's own caveats built in: the
sketch is **not final**, the coder/producer/architect refine it together, and **the owner approves
the steps before implementation**. That caveat *is* the design-then-implement split (the 40/41,
42/43 pattern):

- **Task 52 — design** (owner: fkit-architect, consults producer). Must resolve, as owner-facing
  proposals, the conflicts the record already shows: **step 13 vs the owner-invoked mover gate**
  (a consent-model decision), **"autonomous" vs the coder's own "owner present for plan and fix
  gates" contract** (a deliberate amendment, not drift), **sub-agents cannot ask the owner**
  (the task-39 seam — design within today's envelope or declare the dependency), and the **two-hop
  consult envelope**. Ends with a numbered loop the owner approves. Adversarial pass recommended
  (the 20/29 precedent).
- **Task 53 — implement** (owner: fkit-coder; **needs 52 including the approval — hard**). Skill dir,
  `skills-for-role.sh` registration, hook coverage, ADR-014 tests, dry-run on a real task. Its wiki
  sync is deliberately **not** pre-created — the design may rename or reshape the skill; scoped when
  53 lands.

**Numbered 52/53 for append-don't-renumber discipline — contiguous and in dependency order. Owner to
confirm the ranking.**

## Addendum — tasks 55 and 56 added out of band (2026-07-17): the `fkit-git` agent

*(Renumbered from 54/55 to 55/56 on 2026-07-17 to resolve a duplicate-priority-54 collision with the
concurrently-added `grant-askuserquestion` task, which keeps 54.)*

**The owner's ask:** a new agent `fkit-git` owning git work, with one skill `commit-push` (commit +
push all uncommitted changes, caller-supplied title/message), invocable by other agents.

**⚠️ Scoped design-first because it collides with a universal hard rule.** `CLAUDE.md:49`:
*"Never commit or push unless the owner explicitly asks."* An agent that commits **on another agent's
request** routes around that gate — a change to the meaning of the team's core safety guarantee, which
is an **owner decision, not an implementation detail** (the task-36 consent-model / task-52-D1
precedent). Two further conflicts the design must handle: the **seven→eight agent-count** ripple
(asserted verbatim in `CLAUDE.md`, `PROJECT.md`, wiki, README, launcher, `fkit-team`), and
**no-secrets-on-push** (an agent that blind-commits a dirty tree is the highest-risk secret-leak
surface).

- **Task 55 — design** (owner: fkit-architect, **owner present** for the consent ruling). Resolves the
  consent model (producer's steer: owner-only or explicit-relay, **not** a silent weakening of the hard
  rule), the commit-push contract (staging scope, forbidden force-push, failure/announce), the agent
  contract (tools, consult reachability, session-or-consult), and enumerates the count ripple. May
  require an ADR amending/scoping the hard rule. Ends with the owner's approval.
- **Task 56 — implement** (owner: fkit-coder; **needs 55 incl. approval — hard**). Agent file, skill,
  registration, hook coverage, count/roster updates, ADR-014 tests. Its wiki sync is deliberately not
  pre-created.

**Numbered 55/56. Owner to confirm the ranking.**

## Addendum — tasks 57 and 58 added out of band (2026-07-18): tool allowlists relaxed (ADR-022)

**Owner ruling (2026-07-18), recorded as
[ADR-022](../knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md)
(accepted):** relax the **tool-allowlist** half of the role lock. Six roles — producer, coder,
architect, reviewer, wiki, lead — get **unrestricted tools**; the **adversarial reviewer keeps its
exact current allowlist** (`Read, Grep, Glob, Bash, Skill`, byte-untouched). The ADR's audit found the
capability tools (`WebSearch`/`WebFetch`/`LSP`/`NotebookEdit`) were excluded by **accident, not
decision**, the `tools:` wall was never a real sandbox (Bash escape hatch), and **only** the
adversarial reviewer's wall protects a real invariant (its independence — the second opinion never had
write authority over the code it judges).

**This is a tools change only.** The **skill lockdown stays** (ADR-018 hook unchanged — the coder
still can't run `/fkit-review`), and the **prompt-level role contracts stay** (ADR-022 Decision 5 —
no role-boundary prose is edited).

**Split coder-implement / architect-doc-refresh, per the ADR's own division of labor:**
- **Task 57 — implement** (owner: fkit-coder). Remove the `tools:` line from the six agent files
  (recommended mechanism: omit it, so they inherit all tools); keep the adversarial reviewer's line
  byte-identical. **Subsumes task 54** (`grant-askuserquestion`, `✅ Done`): the six retain
  `AskUserQuestion` by **inheritance** instead of an explicit entry — capability preserved, mechanism
  superseded, task 54 not undone. **Depends on ADR-022** (exists). Blocks nothing.
- **Task 58 — doc refresh** (owner: fkit-architect). Update `architecture.md` (the "strongest
  boundary" line, §4.1 per-role tool table, §5.3/:209 lead's structural `Agent(...)` note) and the
  tool-allowlist mentions in `PROJECT.md`/`CLAUDE.md`. **NOT the coder's job** (ADR-022 Consequences).
  Soft-depends on 57 — the docs describe the reality 57 lands.

**Two open questions carried, not settled** (the producer does not act on them):
1. **Should task 54 be annotated "mechanism superseded by 57"?** It is **not** a cancellation — its
   grant survives via inheritance. Flagged so a future reader isn't confused that the explicit
   `AskUserQuestion` entry is gone; owner's call whether it's worth a breadcrumb.
2. **Does the wiki vault need a sync?** Only if a `wiki-vault/` page enumerates per-agent tool
   allowlists (owner: fkit-wiki). Not pre-filed — worth a task only if the vault records them.

**Numbered 57/58 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — tasks 59 and 60 added out of band (2026-07-18): ship-loop timeout-auto-proceed

**The owner's ask:** in `fkit-task-ship-loop`, an owner question that goes unanswered currently blocks
the whole loop forever. Instead — present options with one marked **recommended**, and if the owner is
silent for ~30s, proceed on the recommended one. Owner said *"if possible."*

**Scoped design-first — feasibility is the gating unknown.** Claude Code is turn-based; there is no
established ambient wall-clock timer that re-invokes the model after 30s of silence. Whether a timed
auto-proceed is expressible **at all** must be **tested against the binary, not reasoned** (the task-39
`AskUserQuestion` precedent: looked capable, measured session-only 0/3→0/2). If infeasible, the design
recommends the closest achievable alternative (e.g. an up-front proceed-on-defaults grant), not a timer
that never fires.

**Hard conflicts flagged for the design (owner rules):** the **done-gate must stay a hard stop** —
auto-advancing "mark it done" routes around the owner-invoked mover (a universal hard rule D1
preserved); the **plan-approval gate** is ADR-019's central guarantee and is **excluded by default**
unless the owner explicitly rules to weaken it; the **mid-loop important-questions** are the plausible
target, and even there it shifts ADR-019's claim level to autonomous *judgment* defaults — hence the
ADR-019 amendment.

- **Task 59 — design** (owner: fkit-architect, owner present; adversarial pass recommended).
- **Task 60 — implement** (owner: fkit-coder; **needs 59 incl. approval + feasibility verdict — hard**).

*(Numbered 59/60 — renumbered from a first-drafted 57/58 to avoid a duplicate-priority collision with
the concurrently-added tool-allowlist-relaxation tasks, which hold 57/58.)* **Owner to confirm the
ranking.**

## Addendum — task 61 added out of band (2026-07-18): the coder's report shape

**The owner's ask:** change how the coder reports back — (1) **open with a bullet-point summary**, and
(2) **end by interviewing the owner** on any open questions, rather than only listing them.

**One brief, single-file** (`claude/agents/fkit-coder.md`) — agent files are not dual-homed (no
scaffold copy), and the change needs no investigation: the session-vs-consult seam it relies on is
already codified at `fkit-coder.md:34-35` (session → `AskUserQuestion`, now held via ADR-022; spawned
consult → tool absent per ADR-021, return questions in the reply). That degradation is **forced**, and
the brief keeps it. *(Line reference is as-of scoping; task 61's implementation rewrote that passage
and the surrounding `## Output format` section — read the file, not this citation.)* Consistency to honor, not override: the `status-report-format` convention /
"be concise" (the summary aligns with them, no second format), and the ship-loop's own §6.3 report
(the loop's specific contract wins inside the loop; this general contract governs ordinary reports).
**Soft-adjacent to tasks 59/60** — no hard dependency.

**Numbered 61 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — task 62 added out of band (2026-07-18): "speak in simple terms"

**The owner's ask:** a standing instruction for every agent — *"Speak in simple terms"* (simpler,
easier words). This is the task-29 shared-instructions case: to give every fkit agent a standing
instruction, write it in the shared context files — **no code, no new mechanism.**

**One brief, atomic across four files.** Settled placement, per the task-29/30 findings:
- It is an **output-style preference** (like "be concise"), so it goes in the **`## Output style`**
  section — **not** the universal-hard-rules block, and **not** the task-31 marker-managed block.
- **"All agents" includes the Codex-run adversarial reviewer**, so it must be in **`AGENTS.md`**, not
  only `CLAUDE.md` (task-29's "a shared layer that excludes the second model is misnamed").
- **Dual-home** (task-48/49): the section lives in four files — root `CLAUDE.md`/`AGENTS.md` (dogfood)
  and `claude/scaffold/CLAUDE.md`/`AGENTS.md` (shipped). All four carry byte-identical wording or "all
  agents" is true in one home only.

**One scope question for the owner:** the brief ships it **fkit-wide** (scaffold + dogfood) on the
reading that "all agents" means every deployment. Owner to confirm it should reach consuming projects
and not stay local to this repo.

**Numbered 62 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — tasks 63 and 64 added out of band (2026-07-18): spawned invocation of the task movers

**The owner's ask:** let another agent drive `/fkit-task-done` and `/fkit-task-cancelled` by **spawning
the producer sub-agent and asking it to run them** — e.g. the coder finishes a task, spawns
`@fkit-producer`, and asks it to mark the task done. Today both movers are **owner-only**.

**⚠️ This reverses a locked, load-bearing decision — flagged before scoping.** The movers are owner-only
on purpose, in three places: the **CLAUDE.md universal hard rule** (*"only via the owner-invoked mover
… do not tell anyone else to"*), **ADR-019** (*"Done is owner-gated, anti-laundering"* — the autonomous
ship-loop stops at the owner-only done-gate by design), and the **`fkit-task-done` skill** (*"an agent
that can mark its own work complete can quietly launder unfinished work into a green board"*). The
owner chose to pursue the relaxation **deliberately, via a reversal ADR** (option B, 2026-07-18) — hence
design-first.

**The gating problem is the exact one that already sank a design.** ADR-019 records that a rev-1 attempt
to relax a gate "for a spawned/loop context" was **killed by a Codex adversarial pass** — *there is no
runtime-authenticated signal for "loop context,"* so the relaxation was either unenforceable or claimable
by any standalone invocation. A spawned producer **has no owner channel** (ADR-012 banner is advisory;
AskUserQuestion is session-only, ADR-021), so "coder asks producer to mark done" is functionally "the
coder marks its own work done." The design **must** answer this by specifying an **authenticated,
checkable precondition** an agent cannot fabricate for its own work (candidate: a closed review ledger
with a passing verdict) — or conclude honestly that none exists and the movers stay owner-only.

**Asymmetry flagged:** `done` turns the board green (the laundering target); `cancelled` records a drop
with a reason (far less prone). The design rules whether they get the same relaxation or a weaker guard
for cancelled.

- **Task 63 — design** (owner: fkit-architect, owner present; reverses a hard rule + amends ADR-019;
  adversarial pass recommended; records the reversal ADR).
- **Task 64 — implement** (owner: fkit-coder; **needs 63 incl. approval + recorded ADR — hard**; shrinks
  to whatever the ruling authorizes, possibly nothing if the relaxation is judged unsafe).

**Numbered 63/64 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — tasks 65 and 66 added out of band (2026-07-18): the filtered `/fkit-status` board

**The owner's ask:** the `/fkit-status` dashboard shows **only tasks that are not complete yet** — hide
`✅ Done` and `⛔ Cancelled` rows. Scoped via the producer interview (2026-07-18); the four rulings —
recorded in task 65's brief and **not to be reopened**:

1. **Roll-up totals line stays** (rows hidden, scope visible).
2. **`➡️ Moved` rows are hidden too** (third inert state).
3. **Drifted rows always render** — filter on **reconciled** state, not the raw marker. Hiding a drift
   buries a finding.
4. **Replace, not a switch** — a toggle would reverse the locked one-skill-one-output ruling (task 44)
   and needs a reversal ADR first.

**⚠️ Conscious reversal, flagged before scoping:** the skill's design principle *"show the dead rows —
a board that hides cancelled and moved tasks lies about scope"* is knowingly reversed by the owner;
ruling 1 is the mitigation. The change lives in `dashboard.sh`'s `⟦BOARD⟧` rendering (the board is
computed, not recited) plus the SKILL.md prose, so skill and script agree.

- **Task 65 — implement** (owner: fkit-coder; script + skill text + tests, one shippable unit;
  depends on nothing).
- **Task 66 — wiki sync** (owner: fkit-wiki; **needs 65 — hard**; the task-45/51 precedent).

**Numbered 65/66 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — tasks 67–69 added out of band (2026-07-18): the Backlog board

**The owner's ask:** when `/fkit-task-brief` gets **no sprint name**, the brief lands on a **real
Backlog board** — a persistent `ai-agents/sprints/backlog.md` with its own status table — not today's
board-less `## Sprint: Backlog (unsprinted)` field. Interviewed 2026-07-18; the owner's ruling adds:
**`/fkit-status` must not report it unless asked for it specifically.**

**Key facts the split rests on:**

- Five unsprinted briefs exist today with no board row anywhere — task 67 backfills them.
- `/fkit-status`'s default run globs `sprint-*.md`, so `backlog.md` is invisible to it **by
  construction** — the filename is load-bearing and stays outside the glob.
- The "report on request" half is one more value of the **existing sprint-name argument** — a target
  selector, not an output variant. **Conforms to one-skill-one-output; no reversal ADR.**
- The task-brief skill's "never invent a sprint" rule gets a **designed, documented exception** for
  the backlog board; the movers' recursive `sprints/` sweep should handle its rows unchanged
  (**verify, don't assume** — in 67's scope).

- **Task 67 — board + filing default** (owner: fkit-coder; skill text + board file + backfill;
  depends on nothing).
- **Task 68 — status read-side** (owner: fkit-coder; **needs 67 — hard**; reuses the closed-sprint
  "say it's moot" pattern for the sprint-shaped beats; if task 65 lands first, its filter applies to
  the backlog board too — no special-casing).
- **Task 69 — wiki sync** (owner: fkit-wiki; **needs 67 and 68 — hard**; one sync after both, per the
  45/51/66 precedent).

**Numbered 67–69 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — tasks 70 and 71 added out of band (2026-07-18): the open-questions interview skill

**The owner's ask:** a skill *"available for ALL agents"* — `/fkit-open-questions-interview`, *"If
there are any open questions, interview me about them."* Interviewed 2026-07-18; three rulings,
recorded in task 70's brief and **not to be reopened**:

1. **Source = the current session's history only** — questions put to the owner and left unanswered.
   Not the sprint plan, not briefs, not docs.
2. **Scope = the six Claude-side roles.** The adversarial reviewer is excluded — Codex-run, restricted
   allowlist (ADR-022), no interactive channel. The task-39 finding ("all agents" excluding the second
   model is the structural reality) applies; no ADR change needed.
3. **Interview only** — answers live in the conversation; the skill writes nothing.

**The known seam is designed in, not discovered later:** `AskUserQuestion` is session-only (ADR-021),
so the skill interviews in a session and **degrades in a spawned consult** to listing the unanswered
questions in its reply — the existing consult pattern. Registration is mechanical:
`skills_for_role()` + the task-43 `PreToolUse` gate, with allow/deny tests.

- **Task 70 — implement** (owner: fkit-coder; skill dir + six-role registration + tests, one
  shippable unit; depends on nothing).
- **Task 71 — wiki sync** (owner: fkit-wiki; **needs 70 — hard**; the 45/51/66/69 precedent).

**Numbered 70/71 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — tasks 72 and 73 added out of band (2026-07-18): the dumb-down skill

**The owner's ask:** a skill for all agents — `/fkit-dumb-down`, *"Explain again in simple terms"* —
an on-demand plain-language re-explanation of the agent's previous answer.

**Conflict checked before scoping — task 62 overlap, owner ruled BOTH (2026-07-18):** task 62 is the
**standing** simple-style preference; this is the **on-demand** re-explain. Complementary, independent,
either order. Neither folds into the other.

**Scoping facts:**

- **Six Claude-side roles** — the adversarial reviewer excluded, applying the same-day task-70 ruling
  (Codex-run, ADR-022). Assumed rather than re-asked; owner to confirm.
- **No ADR-021 seam** — unlike task 70, no owner channel is needed: the skill rewrites the agent's own
  prior output, so it behaves identically in sessions and consults.
- **Content-preserving is load-bearing:** simplification must not drop caveats, failures, or flags —
  the "concision is not omission" rule applied to simplification.
- Registration is mechanical: `skills_for_role()` + the task-43 gate, with allow/deny tests.

- **Task 72 — implement** (owner: fkit-coder; skill dir + six-role registration + tests, one
  shippable unit; depends on nothing).
- **Task 73 — wiki sync** (owner: fkit-wiki; **needs 72 — hard**; may batch with task 71 in one sync
  run if both parents have landed — separate rows, one pass).

**Numbered 72/73 for append-don't-renumber discipline. Owner to confirm the ranking.**

## Addendum — task 79 added out of band (2026-07-19): the rules-block budget

**The owner's ask, explicit:** compress `claude/scaffold/universal-rules.md` to reclaim headroom in the
fkit-managed rules block, in this sprint. Not a proposal weighed by the producer — a scoping request.

**Why it is real, and why now:**

- The block is injected into **every** consuming project's `CLAUDE.md` and `AGENTS.md` on **every
  launch** (`fkit-claude-init.sh:322`), and lands in every agent's context on every turn.
- The cap is `RULES_MAX=4096` (`:318`). The block measures **3557 B — 87% consumed, 539 B left.**
- **Overflow is `exit 1` (`:340-343`) — it fails the launch, it does not degrade.** This is a
  launch-blocking budget, which is what makes 539 B uncomfortable rather than merely tight.
- Review finding **R2** on task 62 already flagged this at 84%. Its test half is closed
  (`test/rules-block-budget.test.js`); its trim half was never scoped. This is that half.

**Scoping facts:**

- **Output style is 67% of the block** (2397 B). The architect drafted and measured a replacement:
  **2397 → 1848 B, saving 549 B**, headroom **539 → 1088 B**. The brief carries that draft **verbatim**.
- **The saving is structural, not wordsmithing** — two bullets were stating one rule twice with
  overlapping enumerations, and the precedence preamble stated its point five ways.
- **The risk is a clarity regression, not the byte count.** Findings **R3** (raised by *both* reviewers
  — a bullet became the wrong antecedent and produced a real misreading) and **R4** (the ~40 B
  enumeration disclaimer the owner **knowingly kept** against R2's budget warning) are direct
  precedent. **The brief makes a review pass mandatory and states that a cut which saves bytes by
  dropping a qualifier is a regression.**
- **`## Universal hard rules` is untouched.** `RULES_MAX` is untouched.
- **Dual-home parity is believed not to apply** — the file is under `claude/scaffold/`, not
  `claude/scaffold/ai-agents/`, and a `find` returned one copy. **The brief requires the coder to
  re-verify rather than trust that.**

- **Task 79 — implement** (owner: fkit-coder; one file, one section, one atomic replacement; depends on
  nothing; independently shippable today).

**Sequencing — recorded so the two do not collide:** the **ADR-030 prose addition** (the
*"What's next?"* / ask-interactively rules, ~430 B, from
[`ADR-030 stop-hook`](../knowledge-base/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md))
is a **separate brief that has not been written yet**. It touches **the same file and likely the same
section**, and is **sequenced after 79**. Its ~430 B fits comfortably in the 1088 B task 79 creates;
against today's 539 B it would leave the block at ~97% of a cap that fails the launch.

**Numbered 79 for append-don't-renumber discipline. No wiki-sync row scoped** — this is scaffold prose,
not a behavioural or structural change the vault describes; say the word if you want one anyway.

## Open questions for the owner

*(OQ8 resolved 2026-07-17 — ruled "generalize", spawning task 47. Original text kept below for the
record.)*

8. **Does *"one skill, one output"* generalize beyond `/fkit-status`?** The owner's ruling was about one
   skill, and tasks 44/45 treat it that way. But the sentence *"there should be 1 version of the output
   if I run the skill"* states a **principle that would constrain every fkit skill** — no output-variant
   arguments, anywhere, ever.
   **Producer's recommendation: if it generalizes, it is a `knowledge-base/conventions/` entry, not an
   ADR** — it is a standing rule about how skills are written, which is exactly what
   `task-status-vocabulary.md` and `evidence-before-assertion.md` are. **It also has more teeth than a
   tombstone would:** a convention stops the *next* `full` from being written, where an ADR only explains
   why this one died.
   **The tradeoff:** it is a rule written from a single instance. The honest counter is that a variant
   argument is sometimes right — `full` itself was defensible when the board was hand-built and
   expensive, and it stopped being defensible only when task 41 made it free. A blanket convention would
   have forbidden a decision that was **correct at the time**. **Not scoped; say the word and it becomes
   a brief.**

---

### Owner dispositions (2026-07-15) — all seven ruled

The owner ruled on all seven open questions below. Recorded here; the original text is kept for the record.

1. **OQ1 (npm reserve) — LEAVE IT for now.** No task; the scoped name is not held. Re-raisable any time.
2. **OQ2 (mover link policy) — DO THE REC: re-point the href, never the prose.** Ratifies what task 22
   already implemented; task 22's `✅ Done` stands. No new task.
3. **OQ3 (mechanical link checker) — NO.** Not pursued. No task.
4. **OQ4 (T28 opt-out location) — DO THE REC: a tracked `ai-agents/.fkit-keep-out`.** **Task 28 is
   unblocked** — its brief §4 is updated from recommendation to decided.
5. **OQ5 (`.fkit/` orphan cleanup) — DO THE REC: scoped as its own task with its own owner gate → task
   36** (`remove-fkit-omnigent-orphan-residue.md`), depends on 28, blocked on a consent-model ruling.
6. **OQ6 (tombstone ADR for the shared-instructions reversal) — DO THE REC → task 37**
   (`record-shared-instructions-reversal-adr.md`), owner: fkit-architect via `/fkit-record-decision`.
7. **OQ7 (read-side symlink hazard) — DO THE INDEPENDENT TASK** rather than fold it into task 28 →
   **unsprinted backlog** (`gate-read-side-symlink-hazard-in-init.md`).

---

1. **Reserve `@flashist/fkit` on npm now, or leave npm alone until there's something to publish?**
   Nothing in Sprint 2 depends on the answer — it only decides whether the name is held before
   someone else takes it, the way `fkit` already went.

2. **Task 22 — do the task movers repair inbound links repo-wide, or are closed sprint plans
   immutable historical records that may point at where a task *was*?** **Task 22 cannot start until
   this is answered.**
   **Producer's recommendation: re-point the href, never the prose.** A closed plan's *claims* are
   history and must stay frozen — `➡️ Moved to Sprint 2 — priority 7` is true forever. But a **link is
   not a claim, it is a pointer**, and a pointer to a file that isn't there is rot, not history.
   **The tradeoff:** the movers would then **write into `sprints/done/`**, a directory the project
   currently treats as never-touched. If "closed" means *byte-frozen*, the honest alternative is to
   accept the broken links by design — but that requires a permanent, unbounded `sprints/done/**`
   exclusion in any future link check, permanently blinding it over a directory that only grows.

3. **Should fkit own a mechanical link checker at all?** This repo has **no test suite and no link
   check** — this defect was found only because fkit-coder hand-rolled a sweep, and every verification
   step in tasks 21 and 22 is manual today. **Producer's position: worth doing, and its home is the
   already-unsprinted [`add-e2e-smoke-script-for-fkit-itself.md`](../tasks/cancelled/0004-add-e2e-smoke-script-for-fkit-itself/brief.md)** — deliberately **not**
   folded into task 22, where it would ship untested alongside the very change it exists to test.
   Flagged as a scoping question, not decided.

4. **Task 28 — where does the convergence opt-out live?** It is the one genuinely open design decision
   in tasks 25–28, and it is **the same trap that killed the version cursor**: `.fkit/` is **gitignored**,
   so an opt-out stored there **does not survive a `git clone`** — a teammate's launch would resurrect
   the `wiki-vault/` the owner deliberately deleted.
   **Producer's recommendation: a tracked opt-out file inside `ai-agents/`** (e.g.
   `ai-agents/.fkit-keep-out`), listing paths convergence must never create. It is committed, so it
   survives a clone and is shared with the team; it lives in the tree the user owns; and it records
   **intent**, not **progress**, so it is not a version cursor by the back door.
   **The tradeoff:** it puts an fkit-managed dotfile into the user's tracked history — a small,
   permanent surface the project has so far avoided. The honest alternative is *no opt-out at all*, and
   that one is not acceptable: it means a user who deleted a folder on purpose fights fkit about it on
   every launch, forever.

5. **The `.fkit/` Omnigent-orphan cleanup (report §9) — scope it, or leave it?** Not currently tasked;
   the owner did not greenlight it and the producer has not assumed it. It is the **one destructive act**
   in the report (`rm -rf` in a user's project, no rollback), and the report's own draft target list was
   **wrong once already** — it named `.fkit/settings`, which is **live** ADR-010 lockdown state. Dead
   residue really is sitting in this repo right now (`.fkit/agents/`, `.fkit/run`, `.fkit/team-session`,
   `.omnigent/` — all with zero references in current code).
   **Producer's recommendation: yes, but as its own task with its own owner gate**, and *after* 25–28
   land — because it needs a **consent model** (announce-only? ask once?), a **dry-run**, and the
   reference-check re-run as a hard gate. It is **not** an every-launch silent operation, and it should
   not be smuggled into the convergence pass, where it would inherit "runs unattended on every launch"
   from code that is *additive by invariant*. **Say the word and I'll write the brief.**

6. **Does the shared-instructions reversal get a tombstone ADR?** **✅ Resolved — and it already was, at
   the time this question was written.** [`ADR-016`](../knowledge-base/decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md)
   was recorded **2026-07-14**, the same day as report rev 2 and *before* this question was raised, and
   it satisfies every acceptance criterion below: both rejections by name (`AGENTS-COMMON.md` at
   `adr-016:154-172`, `--append-system-prompt` at `:137-152`), harness version pinned (Claude Code
   2.1.208 at `:14`, `:40`), experiment counts recorded (`0/3` at `:46`; `0/3`→`0/2` at `:58`, `:140`),
   re-raise trigger at `:272-275`, report rev 2 linked as evidence at `:7`, `:324-328`.
   **Consequence: task 37 was scoped from this question in error — it is a duplicate of already-completed
   work.** Its brief stays in `backlog/` with Status `🔲 Backlog`; cancelling it is the owner's call via
   `/fkit-task-cancelled` and has not been run. **ADR-016 is not to be edited** — the owner ruled it
   stays exactly as-is.
   *The original reasoning is kept below as the historical record of what was weighed.* The reversal
   settles a mechanism question and **rejects two specific, obvious ideas by name**: `AGENTS-COMMON.md`
   (cannot reach Codex) and **`claude --append-system-prompt`** (session-only — **0/3, then 0/2**, into a
   spawned consult, on **Claude Code 2.1.208**). Both are the *first* thing a competent person reaches
   for. Rev 1 of the report reached for one of them and it cost an adversarial review to undo. A dated
   report is easy to miss; an ADR is where someone looks before proposing a mechanism.
   **The tradeoff:** it pins a **negative result against one harness version**. If Claude Code later makes
   `--append-system-prompt` inheritable, the ADR is a fossil that says "don't" about something that now
   works. Mitigation is the one rev 2 already models — **record the version in the ADR itself** — but the
   risk of a stale prohibition is real and is the reason this is a question, not a task.
   **Owner: fkit-architect, via `/fkit-record-decision`.** Say the word.

7. **The read-side symlink hazard — task, or a note on task 28?** Flagged, not assumed. Task 27 gated
   **writes** through a symlinked `ai-agents/` (`[ -L ]` at `fkit-claude-init.sh:40`); it did **not** gate
   **reads**. A future init step that *reads* `$dest/ai-agents/…` would read **through** the link and pull
   off-project content into fkit's own behavior. **Nothing does that today** — and the one design that
   would have (the rejected `AGENTS-COMMON.md` splice) is dead, which is why this is now latent rather
   than live. **Tasks 30–32 do not touch it:** they read from the **scaffold** and write to the **project
   root**. *(Task 31 has its own, different symlink exposure — a symlinked `CLAUDE.md` — and its brief
   gates that with `[ -L ]` explicitly.)*
   **Producer's recommendation: no task now.** A brief for a bug no code can reach is a brief that rots
   before it ships. **Its right home is task 28** — the next thing that will genuinely read and write
   per-path inside `ai-agents/`. **When 28 is unparked, this hazard goes into its brief as a requirement,
   not into a task of its own.** If you'd rather have it tracked independently so it cannot be lost with
   28, say so and I'll write it — that is the honest counter-argument, and it costs one brief.

## Addendum — task 85 added out of band (2026-07-20): the duplicate-ID guard, and why it runs before 76

**Owner ruling, 2026-07-20.** Pulled out of the Backlog board into this sprint, **scheduled ahead of
task 76**, after the producer raised the sequencing as an open question.

**What it is.** ADR-029 Decision 3 accepts the cross-branch ID allocation race rather than preventing
it, and names **exactly one** mitigation: *"a duplicate-ID assertion in the `node --test` suite."* The
design spec says the same at §3.3 and lists it first under §10 *"New assertions to add."* It was never
built. The stateful review of task 75 caught it as finding **R3**; the ledger records R3 as deferred
to this task. **101 IDs are live with no automated uniqueness guard.**

**Why before 76, not after.** Task 76 is the largest merge in the project's history and exactly the
long-lived branch the race needs — two branches can each allocate the same ID and merge **cleanly**,
because the names differ and git sees no textual conflict. Guarding before that merge costs one test.
Discovering a collision after it means **renumbering an ID that things already link to**, which is the
permanent, unrecoverable failure the entire scheme exists to prevent.

**⚠️ Priority 85 is append rank, not run order.** This is the tension the ruling created: the ranks
around 76 are dense, and `fkit-task-brief` step 5 forbids renumbering or inserting into the owner's
ranking. **The tail was not renumbered** — the board's own established convention carries run order
instead, as it already does for three rows: **77** holds priority 77 while its note reads *"its
baseline-capture step must run BEFORE 76"*; **81** at priority 81 reads *"recommend landing before
76"*; **80** was *"pulled forward out of task 78."* Order lives in the note and the dependency line;
the Priority cell is board rank only (ADR-029 Decision 6). **Reading 85 as "last" is the misread this
note exists to prevent.**

**A scheduling gate, not a technical one.** Task 76 would build, test and ship without this guard —
nothing in the migration reads it. The gate exists because the guard's value is entirely *pre*-merge.
It is recorded on **both** briefs so it cannot quietly evaporate under schedule pressure.

**Scope is one assertion, not three.** §10 names three. The other two — `id-mismatch` drift and
malformed-folder — assert against a structure task 76 creates, so neither can be written or red-proved
before it; both were added to **76's** brief on 2026-07-20 (owner-approved) rather than here.

**One reciprocal requirement, flagged because it is a silent failure.** If this task lands first, task
76 must confirm the guard still finds a **non-zero** brief count after the move. A uniqueness check
over zero discovered briefs passes green while guarding nothing. This brief requires dual-shape
discovery for that reason; 76's brief carries the matching check.
