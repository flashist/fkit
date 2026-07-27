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
| ✅ Done | P1 | Extract the shared scaffold into `claude/` *(Phase 0.1)* | [`0038-extract-scaffold-into-claude`](../tasks/done/0038-extract-scaffold-into-claude/brief.md) |
| ✅ Done | P2 | Build self-update for the Claude path *(Phase 0.2)* | [`0019-build-claude-self-update`](../tasks/done/0019-build-claude-self-update/brief.md) |
| ✅ Done | P3 | Make Codex a checked prerequisite *(Phase 0.3)* | [`0060-make-codex-a-checked-prerequisite`](../tasks/done/0060-make-codex-a-checked-prerequisite/brief.md) |
| ✅ Done | P4 | Rewrite the installer for a single flavor *(Phase 1)* | [`0084-rewrite-installer-single-flavor`](../tasks/done/0084-rewrite-installer-single-flavor/brief.md) |
| ✅ Done | P5 | Delete `omnigent/` *(Phase 2)* | [`0025-delete-omnigent-directory`](../tasks/done/0025-delete-omnigent-directory/brief.md) |
| ✅ Done | P6 | Reconcile the skill-ownership source of truth *(Phase 3 — independent)* | [`0063-reconcile-skill-ownership-source-of-truth`](../tasks/done/0063-reconcile-skill-ownership-source-of-truth/brief.md) |
| ✅ Done | P7 | Verify onboarding flow end-to-end *(the removal gate — PASSED, [evidence](../knowledge-base/reports/2026-07-12-onboarding-verification.md))* | [`0091-verify-onboarding-flow-end-to-end`](../tasks/done/0091-verify-onboarding-flow-end-to-end/brief.md) |
| ✅ Done | P8 | Rewrite the docs against the post-removal reality *(Phase 4)* | [`0083-rewrite-docs-post-omnigent`](../tasks/done/0083-rewrite-docs-post-omnigent/brief.md) |
| ✅ Done | P9 | Formalize the knowledge-base folder structure, incl. `incidents/` *(→ [ADR-013](../knowledge-base/decisions/adr-013-knowledge-base-root-holds-the-living-canon.md))* | [`0044-formalize-knowledge-base-incidents-folder`](../tasks/done/0044-formalize-knowledge-base-incidents-folder/brief.md) |
| ✅ Done | P10 | Knowledge-base hygiene after the removal *(Phase 5a)* | [`0059-knowledge-base-hygiene-post-omnigent`](../tasks/done/0059-knowledge-base-hygiene-post-omnigent/brief.md) |
| ✅ Done | P11 | Wiki sync after the removal *(Phase 5b)* | [`0098-wiki-sync-post-omnigent`](../tasks/done/0098-wiki-sync-post-omnigent/brief.md) |
| ✅ Done | P12 | Bake the Architecture pointer into the scaffold templates | [`0018-bake-architecture-pointer-into-scaffold-templates`](../tasks/done/0018-bake-architecture-pointer-into-scaffold-templates/brief.md) |
| ✅ Done | P13 | Extend `initiate-project` to fill CLAUDE.md/AGENTS.md Project Overview | [`0035-extend-initiate-project-fill-overview`](../tasks/done/0035-extend-initiate-project-fill-overview/brief.md) |
| ✅ Done | P14 | Add a `task-plan` skill to fkit-producer | [`0012-add-task-plan-skill-to-producer`](../tasks/done/0012-add-task-plan-skill-to-producer/brief.md) |
| ✅ Done | P15 | Enforce the task status vocabulary in the source | [`0034-enforce-task-status-vocabulary`](../tasks/done/0034-enforce-task-status-vocabulary/brief.md) |
| ✅ Done | P16 | Add a `status` skill to fkit-producer | [`0011-add-status-skill-to-producer`](../tasks/done/0011-add-status-skill-to-producer/brief.md) |
| ✅ Done | P17 | Restore Claude Code plan mode in `/fkit-plan-task` *(regression — independent)* | [`0081-restore-plan-mode-in-plan-task`](../tasks/done/0081-restore-plan-mode-in-plan-task/brief.md) |
| ✅ Done | P18 | Remove `fkit --resume` and the blanket arg-passthrough *(Omnigent scar tissue)* | [`0073-remove-fkit-resume-passthrough`](../tasks/done/0073-remove-fkit-resume-passthrough/brief.md) |
| ✅ Done | P19 | Repair the knowledge-base paths in product source *(ADR-013 fallout)* | [`0077-repair-knowledge-base-paths-in-product-source`](../tasks/done/0077-repair-knowledge-base-paths-in-product-source/brief.md) |
| ✅ Done | P20 | Design a version-to-version migration mechanism *(investigation — [findings](../knowledge-base/reports/2026-07-14-migration-mechanism.md); spawned 25–28)* | [`0032-design-version-to-version-migration-mechanism`](../tasks/done/0032-design-version-to-version-migration-mechanism/brief.md) |
| ✅ Done | P21 | Repair the 6 broken task links in the closed Sprint 1 plan *(one-off cleanup)* | [`0076-repair-broken-links-in-closed-sprint-plans`](../tasks/done/0076-repair-broken-links-in-closed-sprint-plans/brief.md) |
| ✅ Done | P22 | Stop the task movers rotting links in closed sprint plans *(the recurrence — the real bug)* | [`0050-harden-task-movers-against-closed-sprint-link-rot`](../tasks/done/0050-harden-task-movers-against-closed-sprint-link-rot/brief.md) |
| ✅ Done | P23 | Add the launcher-contract test suite *(zero devDeps; **runner TBD** — [ADR-014](../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md))* | [`0006-add-launcher-contract-smoke-script`](../tasks/done/0006-add-launcher-contract-smoke-script/brief.md) |
| ✅ Done | P24 | Stop agents asserting repo state they never checked *(a false instruction in both task movers, shipping to every project)* | [`0087-stop-agents-asserting-unchecked-repo-state`](../tasks/done/0087-stop-agents-asserting-unchecked-repo-state/brief.md) |
| ✅ Done | P25 | Fix the scaffold — ship the KB folders its own README promises *(defect; 100% of new projects)* | [`0043-fix-scaffold-knowledge-base-folders`](../tasks/done/0043-fix-scaffold-knowledge-base-folders/brief.md) |
| ✅ Done | P26 | Stop an init failure from bricking the launcher *(pre-existing defect)* | [`0088-stop-init-failure-bricking-the-launcher`](../tasks/done/0088-stop-init-failure-bricking-the-launcher/brief.md) |
| ✅ Done | P27 | Refuse init on a weird `ai-agents/` — symlink / file-where-dir *(live DoS + silent-skip bugs; the write-outside hazard is **prospective** — see the 2026-07-14 correction)* | [`0069-refuse-init-on-weird-ai-agents-state`](../tasks/done/0069-refuse-init-on-weird-ai-agents-state/brief.md) |
| ✅ Done | P28 | Make launch converge `ai-agents/` additively *(**"the migration"**)* | [`0023-converge-ai-agents-additively-on-launch`](../tasks/done/0023-converge-ai-agents-additively-on-launch/brief.md) |
| ✅ Done | P29 | Add a shared instructions layer that every fkit agent reads *(investigation — [findings rev 2](../knowledge-base/reports/2026-07-14-shared-instructions-layer.md); spawned 30–32)* | [`0009-add-shared-instructions-layer-for-all-agents`](../tasks/done/0009-add-shared-instructions-layer-for-all-agents/brief.md) |
| ✅ Done | P30 | Give Codex the universal hard rules it has never had *(**live defect** — the required second model runs with no floor)* | [`0047-give-codex-the-universal-hard-rules`](../tasks/done/0047-give-codex-the-universal-hard-rules/brief.md) |
| ✅ Done | P31 | Merge an fkit-managed rules block into an **existing** `CLAUDE.md`/`AGENTS.md` *(the brownfield hole; **idempotent or it grows the file forever**)* | [`0061-merge-fkit-rules-block-into-existing-root-context-files`](../tasks/done/0061-merge-fkit-rules-block-into-existing-root-context-files/brief.md) |
| ✅ Done | P32 | Add the "no secrets" rule to `fkit-lead.md` *(the 1 of 7 missing it — one line)* | [`0007-add-no-secrets-rule-to-fkit-lead`](../tasks/done/0007-add-no-secrets-rule-to-fkit-lead/brief.md) |
| ✅ Done | P33 | Fix the headless menu-guard crash — `[ -r /dev/tty ]` never tests openability *(launcher defect against task-23 assertion 7's contract)* | [`0042-fix-headless-menu-guard-crash`](../tasks/done/0042-fix-headless-menu-guard-crash/brief.md) |
| ✅ Done | P34 | Make `/fkit-task-done` flip the moved brief's own `## Status` header *(mover drift — sibling to task 22)* | [`0090-task-done-flips-brief-own-status-header`](../tasks/done/0090-task-done-flips-brief-own-status-header/brief.md) |
| ✅ Done | P35 | Make `/fkit-task-cancelled` flip the moved brief's own `## Status` header *(same gap, `⛔ Cancelled` marker)* | [`0089-task-cancelled-flips-brief-own-status-header`](../tasks/done/0089-task-cancelled-flips-brief-own-status-header/brief.md) |
| ✅ Done | P36 | Remove the `.fkit/` Omnigent-orphan residue *(OQ5 resolved; announce-only ruled 2026-07-17; 4-path list, `.fkit/settings` protected, non-fatal; owner: fkit-coder)* | [`0072-remove-fkit-omnigent-orphan-residue`](../tasks/done/0072-remove-fkit-omnigent-orphan-residue/brief.md) |
| ⛔ Cancelled (2026-07-19) — superseded by ADR-016 | P37 | Record a tombstone ADR for the shared-instructions reversal *(**duplicate — already recorded as [ADR-016](../knowledge-base/decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md), 2026-07-14, before this task was scoped; see OQ6**; owner: fkit-architect)* | [`0066-record-shared-instructions-reversal-adr`](../tasks/cancelled/0066-record-shared-instructions-reversal-adr/brief.md) |
| ✅ Done | P38 | Add a full-board switch (`full`) to `/fkit-status` *(skill-text only; owner: fkit-coder)* | [`0005-add-full-board-switch-to-fkit-status`](../tasks/done/0005-add-full-board-switch-to-fkit-status/brief.md) |
| ✅ Done | P39 | Investigate making `AskUserQuestion` available to fkit agents *(investigation — [findings](../knowledge-base/reports/2026-07-17-askuserquestion-availability-for-agents.md); spawned [ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md); owner: fkit-architect)* | [`0056-investigate-askuserquestion-availability-for-agents`](../tasks/done/0056-investigate-askuserquestion-availability-for-agents/brief.md) |
| ✅ Done | P40 | Design the deterministic dashboard generator for `/fkit-status` *(design — [spec](../knowledge-base/reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md); spawned [ADR-017](../knowledge-base/decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md))* | [`0026-design-deterministic-dashboard-for-fkit-status`](../tasks/done/0026-design-deterministic-dashboard-for-fkit-status/brief.md) |
| ✅ Done | P41 | Build the deterministic dashboard script and wire it into `/fkit-status` *(owner: fkit-coder; [review](../tasks/done/0020-build-deterministic-dashboard-script-for-fkit-status/review.md) closed-out, rounds 1–6, residuals recorded)* | [`0020-build-deterministic-dashboard-script-for-fkit-status`](../tasks/done/0020-build-deterministic-dashboard-script-for-fkit-status/brief.md) |
| ✅ Done | P42 | Reopen ADR-012 Decisions 3 & 4 — record the `PreToolUse` skill-gate hook decision *(live bug fix, phase 1/2; owner: fkit-architect)* | [`0065-record-pretooluse-skill-gate-adr-amendment`](../tasks/done/0065-record-pretooluse-skill-gate-adr-amendment/brief.md) |
| ✅ Done | P43 | Implement the `PreToolUse` skill-ownership gate (the hook-flip) *(owner: fkit-coder; [review](../tasks/done/0052-implement-pretooluse-skill-ownership-hook/review.md))* | [`0052-implement-pretooluse-skill-ownership-hook`](../tasks/done/0052-implement-pretooluse-skill-ownership-hook/brief.md) |
| ✅ Done | P44 | Remove the output variants from `/fkit-status` — one skill, one output *(**reverts task 38**; skill-text only; owner: fkit-coder)* | [`0074-remove-output-variants-from-fkit-status`](../tasks/done/0074-remove-output-variants-from-fkit-status/brief.md) |
| ✅ Done | P45 | Wiki sync after the `/fkit-status` output-variant removal *(needs 44 — hard; owner: fkit-wiki)* | [`0096-wiki-sync-fkit-status-output-variant-removal`](../tasks/done/0096-wiki-sync-fkit-status-output-variant-removal/brief.md) |
| ✅ Done | P46 | Investigate adopting a proper mutation-testing library, replacing hand-rolled `prove-red.sh` *(investigation — [findings](../knowledge-base/reports/2026-07-18-mutation-testing-library-adoption.md); spawned [ADR-026](../knowledge-base/decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled.md); owner: fkit-architect; spawned from task-43 review finding R2)* | [`0058-investigate-mutation-testing-library-adoption`](../tasks/done/0058-investigate-mutation-testing-library-adoption/brief.md) |
| ✅ Done | P47 | Record the "one skill, one output" convention *(OQ8 resolved — generalize; document only; owner: fkit-architect → [`conventions/one-skill-one-output.md`](../knowledge-base/conventions/one-skill-one-output.md))* | [`0064-record-one-skill-one-output-convention`](../tasks/done/0064-record-one-skill-one-output-convention/brief.md) |
| ✅ Done | P48 | Ship the one-skill-one-output convention in the scaffold *(closes the 4th live-vs-scaffold instance; owner: fkit-coder; independent — does not wait for 49)* | [`0086-ship-one-skill-one-output-convention-in-scaffold`](../tasks/done/0086-ship-one-skill-one-output-convention-in-scaffold/brief.md) |
| ✅ Done | P49 | Investigate dual-home parity — dogfood `ai-agents/` vs `claude/scaffold/` *(investigation — [findings](../knowledge-base/reports/2026-07-18-dual-home-parity-live-vs-scaffold.md); spawned [ADR-027](../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md); owner: fkit-architect)* | [`0057-investigate-dual-home-parity-live-vs-scaffold`](../tasks/done/0057-investigate-dual-home-parity-live-vs-scaffold/brief.md) |
| ✅ Done | P50 | Rename the producer's `fkit-task-plan` skill to `fkit-task-brief` *(name collision with the coder's `fkit-plan-task`; atomic — dir + `skills-for-role.sh` + hook together; owner: fkit-coder)* | [`0075-rename-task-plan-skill-to-task-brief`](../tasks/done/0075-rename-task-plan-skill-to-task-brief/brief.md) |
| ✅ Done | P51 | Wiki sync after the `task-plan` → `task-brief` rename *(needs 50 — hard; 8 vault pages; owner: fkit-wiki)* | [`0100-wiki-sync-task-plan-rename`](../tasks/done/0100-wiki-sync-task-plan-rename/brief.md) |
| ✅ Done | P52 | Design the coder's `task-ship-loop` skill *(design — [spec, rev 3, owner-approved](../knowledge-base/reports/2026-07-17-design-task-ship-loop-skill.md); spawns ADR-019/ADR-020; owner: fkit-architect)* | [`0031-design-task-ship-loop-skill`](../tasks/done/0031-design-task-ship-loop-skill/brief.md) |
| ✅ Done | P53 | Implement the `task-ship-loop` skill from the approved design *(owner: fkit-coder; skill live, registered for coder, hook suite green)* | [`0055-implement-task-ship-loop-skill`](../tasks/done/0055-implement-task-ship-loop-skill/brief.md) |
| ✅ Done | P54 | Grant the `AskUserQuestion` tool to the six Claude-side agents *(implements [ADR-021](../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md) Decision 4 / task 39 findings; tool grant, not a skill; owner: fkit-coder)* | [`0049-grant-askuserquestion-tool-to-six-claude-agents`](../tasks/done/0049-grant-askuserquestion-tool-to-six-claude-agents/brief.md) |
| ⛔ Cancelled (2026-07-19) — not pursuing git automation | P55 | Design the `fkit-git` agent + commit/push consent model *(design — collided with the "never commit" hard rule; **owner ruled 2026-07-19: the hard rule stands, fkit will not gain a commit/push agent — settled, not deferred**; owner: fkit-architect)* | [`0027-design-fkit-git-agent-and-consent-model`](../tasks/cancelled/0027-design-fkit-git-agent-and-consent-model/brief.md) |
| ⛔ Cancelled (2026-07-19) — parent design task 55 declined | P56 | Implement the `fkit-git` agent + `commit-push` skill from the approved design *(parent design task 55 declined 2026-07-19 — agent not designed, so no implementation; owner: fkit-coder)* | [`0051-implement-fkit-git-agent-and-commit-push`](../tasks/cancelled/0051-implement-fkit-git-agent-and-commit-push/brief.md) |
| ✅ Done | P57 | Relax the tool allowlist for every role except the adversarial reviewer *(implements [ADR-022](../knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md); subsumes task 54's mechanism; tools change only — skills stay locked; owner: fkit-coder)* | [`0070-relax-tool-allowlists-except-adversarial-reviewer`](../tasks/done/0070-relax-tool-allowlists-except-adversarial-reviewer/brief.md) |
| ✅ Done | P58 | Refresh the docs for the tool-allowlist relaxation *(ADR-022 doc follow-up; owner: fkit-architect)* | [`0068-refresh-architecture-docs-for-tool-relaxation`](../tasks/done/0068-refresh-architecture-docs-for-tool-relaxation/brief.md) |
| ⛔ Cancelled (2026-07-18) — declined on cost per ADR-024 | P59 | Design a timeout-auto-proceed for the ship-loop's owner questions *(feasible but declined on cost per [ADR-024](../knowledge-base/decisions/adr-024-ship-loop-owner-question-timeout-is-not-built.md); safe version = launch-mode + gate re-expression + session-global user-scope AFK timer, not worth the convenience)* | [`0028-design-ship-loop-timeout-auto-proceed`](../tasks/cancelled/0028-design-ship-loop-timeout-auto-proceed/brief.md) |
| ⛔ Cancelled (2026-07-18) — parent design task 59 declined | P60 | Implement the ship-loop timeout-auto-proceed from the approved design *(parent design task 59 declined per [ADR-024](../knowledge-base/decisions/adr-024-ship-loop-owner-question-timeout-is-not-built.md); feature not built, so no implementation)* | [`0053-implement-ship-loop-timeout-auto-proceed`](../tasks/cancelled/0053-implement-ship-loop-timeout-auto-proceed/brief.md) |
| ✅ Done | P61 | Restructure the coder's report — bullet summary first, interview on open questions last *(agent-contract edit; session=AskUserQuestion / consult=return-in-reply; owner: fkit-coder)* | [`0082-restructure-coder-report-summary-then-interview`](../tasks/done/0082-restructure-coder-report-summary-then-interview/brief.md) |
| ✅ Done | P62 | Add a "Speak in simple terms" output-style preference for all agents *(preference not hard-rule; **scoped as 4 files — corrected at build time to ONE source, `claude/scaffold/universal-rules.md`, + re-run init; see the brief's 2026-07-18 correction**; owner: fkit-coder)* | [`0010-add-speak-in-simple-terms-output-style`](../tasks/done/0010-add-speak-in-simple-terms-output-style/brief.md) |
| ✅ Done | P63 | Design a laundering-safe consent model for **spawned** invocation of the task movers *(design — [spec](../knowledge-base/reports/2026-07-18-design-spawned-invocation-consent-model-for-task-movers.md); spawned [ADR-025](../knowledge-base/decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md), **reverses the owner-only done-gate hard rule + ADR-019**; owner: fkit-architect)* | [`0029-design-spawned-invocation-consent-model-for-task-movers`](../tasks/done/0029-design-spawned-invocation-consent-model-for-task-movers/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P64 | Implement spawned invocation for the task movers from the approved design *(owner: fkit-coder)* | [`0054-implement-spawned-invocation-for-task-movers`](../tasks/done/0054-implement-spawned-invocation-for-task-movers/brief.md) |
| ✅ Done | P65 | Filter the `/fkit-status` board to open tasks only *(conscious reversal of "show the dead rows"; roll-up kept, drifted rows always visible, replace not toggle; owner: fkit-coder)* | [`0039-filter-fkit-status-board-to-open-tasks`](../tasks/done/0039-filter-fkit-status-board-to-open-tasks/brief.md) |
| ✅ Done | P66 | Wiki sync after the filtered `/fkit-status` board *(needs 65 — hard; owner: fkit-wiki)* | [`0095-wiki-sync-filtered-fkit-status-board`](../tasks/done/0095-wiki-sync-filtered-fkit-status-board/brief.md) |
| ✅ Done | P67 | Add a Backlog board — the default home for unsprinted task briefs *(persistent `sprints/backlog.md`, backfills 5 unsprinted briefs; filename deliberately outside the `sprint-*.md` glob; owner: fkit-coder)* | [`0001-add-backlog-board-default-for-unsprinted-task-briefs`](../tasks/done/0001-add-backlog-board-default-for-unsprinted-task-briefs/brief.md) |
| ✅ Done | P68 | Report the Backlog board in `/fkit-status` on request only *(`Backlog` as a target-selector argument — conforms to one-skill-one-output; owner: fkit-coder)* | [`0080-report-backlog-board-in-fkit-status-on-request-only`](../tasks/done/0080-report-backlog-board-in-fkit-status-on-request-only/brief.md) |
| ✅ Done | P69 | Wiki sync after the Backlog board introduction *(needs 67 and 68 — hard; owner: fkit-wiki)* | [`0093-wiki-sync-backlog-board-introduction`](../tasks/done/0093-wiki-sync-backlog-board-introduction/brief.md) |
| ✅ Done | P70 | Add the `/fkit-open-questions-interview` skill for the six Claude-side roles *(session-history sweep, interview-only, zero write surface; consult degrade per ADR-021; adversarial reviewer excluded per ADR-022; owner: fkit-coder)* | [`0008-add-open-questions-interview-skill-for-six-roles`](../tasks/done/0008-add-open-questions-interview-skill-for-six-roles/brief.md) |
| ✅ Done | P71 | Wiki sync after the `/fkit-open-questions-interview` skill lands *(needs 70 — hard; owner: fkit-wiki)* | [`0097-wiki-sync-open-questions-interview-skill`](../tasks/done/0097-wiki-sync-open-questions-interview-skill/brief.md) |
| ✅ Done | P72 | Add the `/fkit-dumb-down` skill for the six Claude-side roles *(on-demand re-explain, content-preserving, zero write surface; complementary to task 62 — owner ruled BOTH; adversarial reviewer excluded per ADR-022; owner: fkit-coder)* | [`0003-add-dumb-down-skill-for-six-roles`](../tasks/done/0003-add-dumb-down-skill-for-six-roles/brief.md) |
| ✅ Done | P73 | Wiki sync after the `/fkit-dumb-down` skill lands *(needs 72 — hard; owner: fkit-wiki)* | [`0094-wiki-sync-dumb-down-skill`](../tasks/done/0094-wiki-sync-dumb-down-skill/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P74 | Design the task-folder structure and the global task-ID scheme *(design — [spec](../knowledge-base/reports/2026-07-19-design-task-folder-structure-and-id-scheme.md), [ADR-029](../knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md) **accepted**; gates 75–78; owner: fkit-architect)* | [`0030-design-task-folder-structure-and-id-scheme`](../tasks/done/0030-design-task-folder-structure-and-id-scheme/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P75 | Add an `## ID` field to every brief and write down the allocation procedure *(**no registry file** — owner ruled 2026-07-19; **corpus pinned to a commit SHA**; no file moves — reversible by design; needs 74 — hard; owner: fkit-coder)* | [`0017-assign-global-task-ids-and-create-registry`](../tasks/done/0017-assign-global-task-ids-and-create-registry/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P76 | Migrate every task into a folder, absorb `plans/` + `worklogs/` + `reviews/`, and update the tooling *(**atomic — the point of no return**; needs 75 — hard; review strongly recommended; owner: fkit-coder)* | [`0062-migrate-tasks-to-folder-structure-and-update-tooling`](../tasks/done/0062-migrate-tasks-to-folder-structure-and-update-tooling/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P77 | Repair the task links in `reviews/`, `knowledge-base/` and brief↔brief *(**covers pre-existing rot too — ~1/3 already broken before the migration**; **⚠️ its baseline-capture step must run BEFORE 76**, everything else after; sprint-keyed ledgers move to `sprints/reviews/` per design §5.2b; needs 76 — hard; parallel with 78; owner: fkit-coder)* | [`0079-repair-task-links-outside-the-wiki-after-migration`](../tasks/done/0079-repair-task-links-outside-the-wiki-after-migration/brief.md) |
| ✅ Done | P78 | Wiki sync after the task-folder migration *(~96 vault refs + structural re-description; **batches the six queued syncs 45/51/66/69/71/73**; needs 76 — hard; parallel with 77; owner: fkit-wiki)* | [`0099-wiki-sync-task-folder-migration`](../tasks/done/0099-wiki-sync-task-folder-migration/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P79 | Compress the Output style section of `universal-rules.md` *(reclaims 549 B; block 3557→3008 B against a launch-blocking 4096 cap; **review pass required** — R3 precedent; sequenced **before** the not-yet-filed ADR-030 prose addition, same file; owner: fkit-coder)* | [`0022-compress-universal-rules-output-style-section`](../tasks/done/0022-compress-universal-rules-output-style-section/brief.md) |
| ✅ Done | P80 | Repair the stale `adr-029-stop-hook` links in the wiki vault *(**page rename + 11 files' inbound links** — the vault page itself sat at the old slug, so links resolved silently to the wrong ADR — target is now [ADR-030](../knowledge-base/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md); **owner pulled it forward out of task 78** — depends on nothing, does not wait for the migration; **in flight at filing time**; owner: fkit-wiki)* | [`0078-repair-stale-adr-029-stop-hook-links-in-the-vault`](../tasks/done/0078-repair-stale-adr-029-stop-hook-links-in-the-vault/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P81 | Extend the task movers' reference sweep to `knowledge-base/` *(shipped defect — both movers grep `sprints/` + `tasks/` only, so ADR/report back-links rot on every close; same class as 21/22; **`fkit-task-cancelled` has the gap twice**; recommend landing before 76; owner: fkit-coder)* — **Part B**: next-ADR-number derivation looks in too few places *(2026-07-19 collision)* — **Part C** *(added 2026-07-19)*: `/fkit-wiki-lint` cross-checks vault ADR number vs knowledge-base slug, since a reused number stays resolvable and is invisible to a link check; **Part C ownership settled 2026-07-19 — fkit-coder, task does not split; the wiki's exclusivity is over the vault, not over its own skill source** — **Part D** *(absorbed from 82)*: `claude/fkit-claude-init.sh:847` hard-codes *"Seven roles"*; it is executable source so the architect may not edit it; **⚠️ ADR-028 is decided-not-built — do not blindly substitute Eight**; all four parts fkit-coder | [`0036-extend-mover-reference-sweep-to-the-knowledge-base`](../tasks/done/0036-extend-mover-reference-sweep-to-the-knowledge-base/brief.md) |
| ✅ Done | P82 | Refresh `architecture.md` for ADRs 026–030 and the eighth role *(**`architecture.md:4` and `:82` say seven roles; ADR-028 added an eighth — the canonical doc is factually wrong about the team's shape**; **5 doc sites in 4 files** — `architecture.md:4,82`, `CLAUDE.md:7`, `AGENTS.md:7`, `README.md:76`, `claude/README.md:3` — **enumerated by [ADR-028](../knowledge-base/decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md):154-169, which says do not re-derive the list**; also adds a **dated ADR-023→028 pointer** (**ADR-023 is NOT superseded — only its count claim is overtaken**); `PROJECT.md:8,72` moved to **task 83** per ADR-028:154 (the product brief is not the architect's); `claude/fkit-claude-init.sh:847` is executable source, **task 81 Part D**; `wiki-vault/index.md:11` + `wiki/systems/fkit.md:7,15` are **fkit-wiki's resync, flag don't fix**; cites only up to ADR-025, so 026–030 absent plus the 023/024 tombstones; ADR-028/029/030 are **decided but not built** and must not be described as existing structure; historical "seven" in ADRs/reports/closed rows **must stay**; precedent task 58; owner: fkit-architect)* | [`0067-refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role`](../tasks/done/0067-refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role/brief.md) |
| ✅ Done | P83 | Amend the product brief for the eighth role — `PROJECT.md:8,72` *(split from 82 per **ADR-028:154** — the brief is the product document, not the architect's; **`:72`'s "not breadth" clause is a product constraint ADR-028 knowingly reverses, so this is a stance restatement, not a count fix**; ADR-028 is **decided-not-built** so the brief must not promise a role that does not exist; **⚠️ needs owner sign-off on the stance wording**; owner: fkit-producer)* | [`0015-amend-project-brief-for-the-eighth-role`](../tasks/done/0015-amend-project-brief-for-the-eighth-role/brief.md) |
| ✅ Done | P84 | Wiki resync for the eighth role — after the source docs land *(**⚠️ filed under a false premise, corrected in the brief: the vault is NOT stale** — `index.md:11` and `systems/fkit.md:9,17` already carry an accurate decided-not-built note; ADR-028:165 named them stale and the wiki fixed them afterwards. **The real work is the mirror image** — `fkit.md:9` tracks *which source docs still assert seven*, and that tracking claim expires when 82/83/81-D land; **depends on 82 + 83 + 81 Part D**, precedent task 11 / `sprint-2.md:209`; **not folded into 78**; decided-not-built framing must survive; owner: fkit-wiki)* | [`0092-wiki-resync-eighth-role-after-source-docs-land`](../tasks/done/0092-wiki-resync-eighth-role-after-source-docs-land/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P85 | Assert task IDs are unique in the test suite — the ADR-029 duplicate-ID guard *(**⚠️ priority 85 is append rank, NOT run order — this must land BEFORE 76**, owner-ruled 2026-07-20; ADR-029 Decision 3's **sole** named mitigation for the accepted cross-branch race, and it was never built — task 75 review finding R3; scope is the duplicate-ID assertion **only** — the other two design §10 assertions are in 76; the guard must discover briefs in **both** the flat and folder shapes so 76 cannot silently blind it; owner: fkit-coder)* | [`0101-assert-task-ids-are-unique-in-the-test-suite`](../tasks/done/0101-assert-task-ids-are-unique-in-the-test-suite/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P86 | Add a structured `## Owner` field to the brief schema and the task-brief skill *(owner ruled a structured field, not a prose scrape; defines the field + populates new briefs; blocks 87/88; owner: fkit-coder)* | [`0104-add-owner-field-to-brief-schema-and-task-brief-skill`](../tasks/done/0104-add-owner-field-to-brief-schema-and-task-brief-skill/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P87 | Backfill the `## Owner` field into all ~103 existing briefs *(**~25 have no recoverable owner — owner-assigned, never guessed**; needs 86 — hard; blocks 88; owner: fkit-coder)* | [`0105-backfill-owner-field-into-existing-briefs`](../tasks/done/0105-backfill-owner-field-into-existing-briefs/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P88 | Render the Owner column in `/fkit-status`, between Filename and Next step *(the feature the owner asked for; `dashboard.sh` + `SKILL.md` contract + test; needs 86 + 87 — hard; owner: fkit-coder)* | [`0106-render-owner-column-in-fkit-status`](../tasks/done/0106-render-owner-column-in-fkit-status/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P89 | Make a task's `## Notes`-prose dependency visible to `dashboard.sh` *(the task-84 misreport, 7 status runs; parse-Notes vs enforce-row is the coder's design call; owner: fkit-coder)* | [`0107-teach-dashboard-to-resolve-notes-dependencies`](../tasks/done/0107-teach-dashboard-to-resolve-notes-dependencies/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P90 | Investigate making fkit-wiki task completion visible to the board *(investigation — task 80 stuck `In progress` a week; `log.md` is an unread status source; owner overrode the report's recommendation → the movers become producer-only, [ADR-033](../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md); report: [`2026-07-23-eval-wiki-task-completion-visible-to-the-board`](../knowledge-base/reports/2026-07-23-eval-wiki-task-completion-visible-to-the-board.md); owner: fkit-architect)* | [`0108-investigate-making-wiki-task-completion-visible-to-the-board`](../tasks/done/0108-investigate-making-wiki-task-completion-visible-to-the-board/brief.md) |
| ✅ Done | P91 | Design fkit-lead as the orchestrating front door + the `fkit-sprint-ship-loop` skill *(design/feasibility only — owner ruled evolve `fkit-lead` into the single-point-of-interaction doer, relay owner decisions live, design-first; reverses ADR-010 non-doer, collides with ADR-021/024, `task-ship-loop` is session-only; blocks the follow-on implementation tasks; owner: fkit-architect)* | [`0109-design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop`](../tasks/done/0109-design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P92 | Evolve `fkit-lead` into the orchestrating conductor — reverse the non-doer stance, add conductor remit + driver discipline, keep routing *(agent-def edit; T2 of design §11; depends on ADR-031/032 which are Done; owner: fkit-coder)* | [`0110-evolve-fkit-lead-into-orchestrating-conductor`](../tasks/done/0110-evolve-fkit-lead-into-orchestrating-conductor/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P93 | Build the `fkit-sprint-ship-loop` skill — the lead's sprint-scope conductor loop *(the substantive build, design §5; **must carry the plan-gate honesty clause as prose, not a false structural guarantee**; needs 92; owner: fkit-coder)* | [`0111-build-fkit-sprint-ship-loop-skill`](../tasks/done/0111-build-fkit-sprint-ship-loop-skill/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P94 | Wire `fkit-sprint-ship-loop` into `skills_for_role()` + the FOUR mirrors in the same commit *(`skills-for-role.sh:37` + 4 mirrors per the `:12-24` checklist that has shipped false docs before; needs 93; owner: fkit-coder)* | [`0112-wire-lead-sprint-ship-loop-skill-ownership-and-mirrors`](../tasks/done/0112-wire-lead-sprint-ship-loop-skill-ownership-and-mirrors/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P95 | Update the launcher menu/help text — "does no work itself" → accurate to a conductor *(text only, no control-flow change per design §4.4; needs 92; owner: fkit-coder)* | [`0113-update-launcher-menu-help-for-conductor`](../tasks/done/0113-update-launcher-menu-help-for-conductor/brief.md) |
| ✅ Done | P96 | Amend PROJECT.md for the evolved `fkit-lead` conductor *(product-brief half of design §11 T6; owner-signed-off stance wording; needs 92 + 94; owner: fkit-producer)* | [`0114-amend-project-brief-for-lead-conductor`](../tasks/done/0114-amend-project-brief-for-lead-conductor/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P97 | Refresh architecture.md for the lead conductor + fix the stale §5.2 lock description *(architecture half of T6 **plus** the independent §5.2 `skillOverrides`→ADR-018-hook stale-lock fix, design §1.1; coordinates with 94 on the same file; needs 92 + 94; owner: fkit-architect)* | [`0115-refresh-architecture-doc-for-lead-conductor-and-stale-lock`](../tasks/done/0115-refresh-architecture-doc-for-lead-conductor-and-stale-lock/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P98 | Add `fkit-sprint-ship-loop` to the ADR-030 Stop-hook skip set *(one skip-list entry + test; owner: fkit-coder)* | [`0116-add-sprint-ship-loop-to-stop-hook-skip-set`](../tasks/done/0116-add-sprint-ship-loop-to-stop-hook-skip-set/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P99 | Wiki ingest — ADR-031/032, the design report, and the evolved lead role *(vault write — fkit-wiki only; needs T1 (Done) + 92; owner: fkit-wiki)* | [`0117-wiki-ingest-lead-conductor-and-adrs-031-032`](../tasks/done/0117-wiki-ingest-lead-conductor-and-adrs-031-032/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P100 | Record the ADR-032 sprint-ship-loop autonomy amendment — Build carve-out + Process-review autonomy (option b) + accepted cost + do-not-re-raise guard *(**reassigned 2026-07-25 — owner ruled it stalled**; was parked as "owner is writing it himself", verified never written, blocked 99 for three days unnoticed; the four 2026-07-22 decisions are settled and not reopened; owner: fkit-architect)* | [`0118-record-adr-032-sprint-ship-loop-autonomy-amendment`](../tasks/done/0118-record-adr-032-sprint-ship-loop-autonomy-amendment/brief.md) |
| ✅ Done | P101 | Track the `fkit-coder` declared-approval carve-out — the guarantee-surface change 0111 folded in *(**already implemented and committed — done-pending-review, not re-do**; **corrected 2026-07-26**, this cell and the brief previously said "in the working tree (uncommitted)" — false: the carve-out is in `a89c917`, and **both commits touching the file were authored by the owner, so no agent breached the no-commit rule**; the architect asked it get its own reviewable record; needs 93 + 100; **recommend owner-verify, not agent-close**; owner: fkit-coder)* | [`0119-track-fkit-coder-declared-approval-carve-out`](../tasks/done/0119-track-fkit-coder-declared-approval-carve-out/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P102 | Fix the `fkit-sprint-ship-loop` SKILL.md owner-banner format *(cosmetic; bare `# ⛔ Owner:` H1 → sibling-style title; no ADR-018-hook impact; independent; owner: fkit-coder)* | [`0120-fix-sprint-ship-loop-skill-owner-banner-format`](../tasks/done/0120-fix-sprint-ship-loop-skill-owner-banner-format/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P103 | Decide whether to drop the numeric prefix from task-folder names *(investigation — **weighs against ADR-029 Decision 5 + the task-76 migration**; the two-numbers confusion, folder-ID `0109` vs sprint priority `91`; blocks 104; owner: fkit-architect. **Deliverable: [decision report](../knowledge-base/reports/2026-07-26-decide-task-folder-name-numeric-prefix.md)** — owner ruled **Option C**: keep the prefix, fix the priority side; 104 rescoped, not cancelled)* | [`0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names`](../tasks/done/0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P104 | Implement the task-folder-name scheme change from the approved design *(**RESCOPED 2026-07-26, NOT a cancellation candidate** — 103 ruled **Option C**, owner-approved: keep the prefix, fix the priority side. Scope = folder ID primary in `dashboard.sh` + priority cell renders `P<n>` + Option D label normalisation (owner-ruled complement) + the convention page. **No folder renames, no href rewrites, no wiki churn** — ~1/10 the old blast radius. Spec = [decision report §8](../knowledge-base/reports/2026-07-26-decide-task-folder-name-numeric-prefix.md); dep on 103 satisfied; owner: fkit-coder)* | [`0103-implement-task-folder-name-scheme-change`](../tasks/done/0103-implement-task-folder-name-scheme-change/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P105 | Rewrite `fkit-task-ship-loop` step 9 — coder self-close → route close to producer *(ADR-033 §3 ripple, amends ADR-019; ships **before** 0124; owner: fkit-coder)* | [`0122-route-coder-ship-loop-close-to-producer`](../tasks/done/0122-route-coder-ship-loop-close-to-producer/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P106 | Rewrite `fkit-sprint-ship-loop` close step — driver self-close → spawn producer to close *(ADR-033 §4 ripple, amends ADR-032; revises 0111's as-first-written close; ships **before** 0124; owner: fkit-coder)* | [`0123-route-sprint-ship-loop-close-to-producer`](../tasks/done/0123-route-sprint-ship-loop-close-to-producer/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P107 | Revert the task movers to producer-only — `skills-for-role.sh` + 4 mirrors + hook test + mover SKILL prose *(ADR-033 §1 structural core; owner: fkit-coder)* | [`0124-revert-task-movers-to-producer-only`](../tasks/done/0124-revert-task-movers-to-producer-only/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P108 | Wiki flag-don't-close convention — 3 wiki SKILLs end by flagging "task N ready to close" *(ADR-033 §2 / task 0108's operative fix; recommend co-landing with 107; owner: fkit-coder)* | [`0125-wiki-skills-flag-ready-to-close`](../tasks/done/0125-wiki-skills-flag-ready-to-close/brief.md) |
| 🔲 Backlog | P109 | Wiki resync for ADR-033 — ingest the ADR + resync vault pages asserting the ADR-025 "any role may close" rule *(needs 107 — hard; owner: fkit-wiki)* | [`0126-wiki-resync-for-adr-033`](../tasks/backlog/0126-wiki-resync-for-adr-033/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P110 | Build the ADR-030 `Stop` hook — turn-completion contract enforcement *(Path 2 marker; owner live-verified check B end-to-end; R8 over-skip residual accepted → fix in 0129; owner: fkit-coder)* | [`0127-build-adr-030-stop-hook`](../tasks/done/0127-build-adr-030-stop-hook/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P111 | Give the fkit ship-loop(s) a transcript-independent skip signal for the ADR-030 Stop hook *(`UserPromptExpansion` marker replaces the transcript scan; fixes R8 over-skip + R6 under-skip for both loops; owner: fkit-coder)* | [`0129-transcript-independent-ship-loop-skip-signal`](../tasks/done/0129-transcript-independent-ship-loop-skip-signal/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P112 | Add the ADR-030 prose half to the universal rules block — "What's next?" + ask-interactively *(ADR-030 Decision 8; two clauses added to `universal-rules.md`; block at 91% → follow-up 0130; owner: fkit-coder)* | [`0128-add-adr-030-prose-half-to-universal-rules`](../tasks/done/0128-add-adr-030-prose-half-to-universal-rules/brief.md) |
| 🔲 Backlog | P113 | Reclaim universal-rules-block budget headroom — compression pass **or** a signed `RULES_MAX` bump *(0128 left the block at 91.1% / 363 B; measure-and-propose then implement the owner-signed option; a cap bump is an owner/architect call; owner: fkit-coder)* | [`0130-reclaim-rules-block-budget-headroom`](../tasks/backlog/0130-reclaim-rules-block-budget-headroom/brief.md) |
| 🔲 Backlog | P114 | Convert every skill `description:` to a `>-` block scalar, then add a frontmatter-parse guard test *(0123 R4/R5; **all 25 skills use plain scalars, 3 are invalid strict YAML**; a broken frontmatter fails **silently** — the listing falls back to the H1 and no test reads any `SKILL.md`; convert-then-guard is one unit, order binding; ADR-014 zero devDeps ⇒ hand-rolled reader; independent; owner: fkit-coder)* | [`0136-convert-skill-descriptions-to-block-scalars-and-guard`](../tasks/backlog/0136-convert-skill-descriptions-to-block-scalars-and-guard/brief.md) |
| ✅ Done | P115 | Reorder the `fkit` launcher menu so lead is option 1, and rename its label to "lead" *(owner ruling 2026-07-25; menu block + case arms + `--help` + init.sh role list; **word aliases `team`/`team room` are kept**; **accepted cost — every other role shifts down one and a mis-pick is silent**; independent; owner: fkit-coder)* | [`0139-reorder-launcher-menu-lead-first-and-rename-label`](../tasks/done/0139-reorder-launcher-menu-lead-first-and-rename-label/brief.md) |
| ✅ Done | P116 | Retire "team room" in the docs and agent definitions, and fix the stale "menu 7" citations *(**two kinds of edit — a rename, and a correctness fix**: 3 live files say "menu option 7" and become FALSE when 115 lands, incl. `fkit-lead.md`, a **system prompt**; ADR-010 + 2 dated reports deliberately OUT of scope; soft-depends 115 — ship together; owner: fkit-coder)* | [`0140-retire-team-room-in-docs-and-agent-definitions`](../tasks/done/0140-retire-team-room-in-docs-and-agent-definitions/brief.md) |
| 🔲 Backlog | P117 | The wiki completion flag must carry the task's **folder ID** and the **brief path** — `Task N` is undefined *(0125 follow-up, **found by the role that consumes the flag**; `N` is never defined and the two number-spaces collide on a **live specimen** — 0125 is rank **P108** and folder `0108` is a real task, the very investigation 0125 implements; the flag is the one line carried **verbatim** and carries **no path**, though the scan step already read `backlog/*/brief.md`; a wrong resolution points `/fkit-task-done` at the wrong task; cites `conventions/priority-is-rank-not-identity.md`; **land before 0154**; owner: fkit-coder)* | [`0153-wiki-flag-carries-folder-id-and-brief-path`](../tasks/backlog/0153-wiki-flag-carries-folder-id-and-brief-path/brief.md) |
| 🔲 Backlog | P118 | Wiki resync for the lead rename and menu reorder *(vault write — **fkit-wiki only**; 2 pages assert the retired facts; also carries a **stale claim of substance** — `systems/fkit.md:28` still says the lead "does no work", which ADR-031 reversed; overlaps task 99 (0117) — check its state first; needs 115 + 116 — hard; owner: fkit-wiki)* | [`0141-wiki-resync-for-the-lead-rename-and-menu-reorder`](../tasks/backlog/0141-wiki-resync-for-the-lead-rename-and-menu-reorder/brief.md) |
| 🔲 Backlog | P119 | Reconcile the dual-homed file drift — byte-align live `ai-agents/` vs `claude/scaffold/ai-agents/` *(**pulled from the Backlog board 2026-07-25 by owner ruling**; ADR-027 §2 follow-up, never filed for six days; `dependency-declaration-form.md` is missing from the scaffold — consuming projects inherit the **task-84 misreport class**; the exception list is the real deliverable; blocks 119; owner: fkit-coder)* | [`0132-reconcile-dual-homed-file-drift-live-vs-scaffold`](../tasks/backlog/0132-reconcile-dual-homed-file-drift-live-vs-scaffold/brief.md) |
| 🔲 Backlog | P120 | Build `test/dual-home-parity.test.js` *(**pulled from the Backlog board 2026-07-25 by owner ruling**; **task 0112 shipped claiming this test passed — it does not exist**; carries the named obligation to re-verify 0112's five touched files and report pass/fail to the owner; needs 118 — ADR-027 §3 makes the order binding; owner: fkit-coder)* | [`0133-build-dual-home-parity-test`](../tasks/backlog/0133-build-dual-home-parity-test/brief.md) |
| 🔲 Backlog | P121 | Investigate the skill-ownership fact-inventory gap — the mirror checklist does not see every site *(**investigation, not implementation** — fix shape unknown; the `skills-for-role.sh:12-24` checklist has failed **twice** (0036, then 0124's three missed sites); the missed sites are **system prompts + the universal rules block**, which outrank a SKILL in an agent's own context; coordinates with 0137; independent; owner: fkit-architect)* | [`0142-investigate-the-skill-ownership-fact-inventory-gap`](../tasks/backlog/0142-investigate-the-skill-ownership-fact-inventory-gap/brief.md) |
| 🔲 Backlog | P122 | Decide whether a spawn-time instruction may override a rule in the skill the spawned worker is running *(**investigation + ruling, fix shape unknown** — not implementation; a worker **cited step 5's rule, then followed the spawn prompt instead, and recorded that it did** (`sprint-2.md:245-249`); the instruction is **not in `fkit-sprint-ship-loop`** — it is ad-hoc spawn-prompt text from the live lead session, which is what makes it invisible to review; surface is **every spawned worker of every role**, not priorities; `universal-rules.md` carries fkit's only precedence vocabulary (hard rule vs preference) and **skill rules are classified as neither**; ADR-010/012/018 govern *which* skill may be invoked, never whether a rule *inside* one binds — a different axis; must face the *"a launching agent's messages direct your work"* tension by name; **a one-paragraph ruling is a legitimate outcome** — the point is a producer must not make the call; coordinates with 0142 (P121), adjacency not dependency; independent; owner: fkit-architect)* | [`0158-decide-whether-a-spawn-instruction-may-override-a-skill-rule`](../tasks/backlog/0158-decide-whether-a-spawn-instruction-may-override-a-skill-rule/brief.md) |
| 🔲 Backlog | P123 | Correct `CLAUDE.md`'s stale `skills_for_role()` location *(**`CLAUDE.md` is injected into every fkit session**, so every role in every session is currently told the wrong file; `:43` says the function is declared in `claude/fkit-claude.sh` — it **moved to `claude/skills-for-role.sh`** under task 43 / ADR-018 and `fkit-claude.sh:257` merely sources it; **one-hop misdirection, not a wrong edit** — `fkit-claude.sh:253-254` documents the move right above the source line; **the only live stale site** — `claude/README.md:41` and `architecture.md:154` are already correct, and ADRs are dated records, out of scope; the line sits **outside** the generated rules block, so a normal one-line edit; **plausible live specimen for 0142** (120) and pointered there; owner: fkit-coder)* | [`0151-correct-claude-mds-stale-skills-for-role-location`](../tasks/backlog/0151-correct-claude-mds-stale-skills-for-role-location/brief.md) |
| 🔲 Backlog | P124 | Append a dated correction note to ADR-010 for the menu reorder *(owner ruled 2026-07-25 — **note, not a rewrite**; ADR-010:26's "menu option 7" + "team room" go stale when 115/116 land, and its "routes rather than does" was already reversed by ADR-031; **establishes the form**, this being the first; ADR stays `accepted`; soft-needs 115 + 116; owner: fkit-architect)* | [`0143-append-a-dated-correction-note-to-adr-010`](../tasks/backlog/0143-append-a-dated-correction-note-to-adr-010/brief.md) |
| 🔲 Backlog | P125 | Implement ADR-032 A2's worklog audit obligation in the sprint-ship-loop *(**the amendment requires it; nothing implements it** — `fkit-sprint-ship-loop/SKILL.md:105` asks the Process-review worker only for "change surface + residuals" and `fkit-coder.md:73-82` imposes no worklog duty; **consequence: ADR-032 A4 bullet 2's reopening condition is unsatisfiable in practice** — the guard points at evidence nothing requires anyone to write; adds an **obligation, not a permission**; owner-ruled 2026-07-26; **land with 0150 (124) in ONE `fkit-coder` session — different clauses of the same file**; owner: fkit-coder)* | [`0147-implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop`](../tasks/backlog/0147-implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop/brief.md) |
| 🔲 Backlog | P126 | Add the missing **verbatim** to `fkit-coder.md`'s declared-approval marker, condition (b) *(0119 review **R1**, medium, raised **independently by both reviewers**; `fkit-coder.md:65-66` says the marker carries *"a concrete **approved plan**"* while ADR-032 **A1** `:97` and the driver `SKILL.md:109` both require it **verbatim** — a paraphrased plan satisfies the worker-side check, so the worker's **scope boundary** can silently become the driver's summary; **medium not high**: the driver's own verbatim rule must fail first, so this is a **missing second line of defence, not the primary control**; one-word prose fix on a **guarantee surface**, owner-ruled 2026-07-26 to be tracked rather than slipped in; **promoted 128 → 124 by owner ruling 2026-07-26, now adjacent to 0147 (123) — land the two in ONE `fkit-coder` session**; owner: fkit-coder)* | [`0150-add-verbatim-to-fkit-coder-declared-approval-marker`](../tasks/backlog/0150-add-verbatim-to-fkit-coder-declared-approval-marker/brief.md) |
| 🔲 Backlog | P127 | State `/fkit-task-brief` step 5's append rule in full — the owner-ruled exception, the merit-flag obligation, the closed-row carve-out *(two spawned producers placed briefs **oppositely** on 2026-07-27 and the owner accepted **both**; step 5 read firsthand is **not ambiguous** on the default — it says append and forbids inserting, reinforced twice more in the same file — but it is **silent on the sanctioned exception**, so the two owner-ruled re-ranks the board records look like producer precedent, which is exactly how one was misread; also codifies the two things both producers reached independently and no file states — **never renumber `✅ Done`/`⛔ Cancelled` rows**, and **say where merit would have put it**; **prose only, one file, unenforced** — no test reads any `SKILL.md` today and **adding a guard is out of scope** (0154's third-claimant warning); the spawn-instruction half is deliberately excluded → 0158; independent; owner: fkit-coder)* | [`0157-state-task-brief-step-5s-append-rule-in-full`](../tasks/backlog/0157-state-task-brief-step-5s-append-rule-in-full/brief.md) |
| 🔲 Backlog | P128 | Wiki re-ingest the amended ADR-032 and clear its now-wrong `⚠️ STALE` banner *(**merged from two candidates — one page, one edit**; vault `grep -c "Amendment — 2026-07-22"` = **0**, and the page's banner still says the amendment "was never written" and "0118 … still 🔲 Backlog" — **false on both counts** since 0118 closed; the banner was 0117's authorized stand-in and has outlived it; no overlap with 0126 (ADR-033) or 0141 (lead rename); owner: fkit-wiki)* | [`0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner`](../tasks/backlog/0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner/brief.md) |
| 🔲 Backlog | P129 | Build `test/wiki-flag-convention.test.js` — the wiki flag block is prose only and wholly unenforced *(named as a residual by **both** the coder and the reviewer on 0125; the ADR-018 hook reads only stdin + `skills_for_role()` and **never opens a `SKILL.md`**, and every `SKILL.md` mention under `test/` is a **comment** — deleting the block would red **nothing**; asserts **five** things in all three wiki SKILLs — complete flag, partial flag, hard-rule bullet, the **R2 "unrelated → say nothing"** branch and the **R5 "do not spawn the producer"** clause — plus a **fail-closed** uniformity check; **closes 0125's SUBSUME'd R3 residual** (`plan.md` check 4 is fail-open); ADR-014 zero devDeps + a `prove-red.sh` mutation; **⚠️ third claimant on the `SKILL.md` walk** after 0136 (P114) and 0152 — exactly one walk; soft-follows 0153; owner: fkit-coder)* | [`0154-build-wiki-flag-convention-test`](../tasks/backlog/0154-build-wiki-flag-convention-test/brief.md) |
| 🔲 Backlog | P130 | Pin the `team` / `team room` rejection with launcher-contract CLI tests *(**0139's standing residual, re-raise-triggered by 0140's close**; `rc=2` + **`claude` never exec'd** — the exit code alone would have passed while the real 0139 bug shipped; needs **no new harness**; adds a 3rd `prove-red.sh` mutation; independent; owner: fkit-coder)* | [`0144-pin-the-team-team-room-rejection-with-cli-contract-tests`](../tasks/backlog/0144-pin-the-team-team-room-rejection-with-cli-contract-tests/brief.md) |
| 🔲 Backlog | P131 | Give the launcher-contract suite a pty, and pin the menu picks 1-7 *(**partly reverses a recorded acceptance** — `architecture.md:453` says the tty menu stays manual; needs **new pty infrastructure** — `runFkit` is detached by design and must not change; **two documented false-result traps**; portability is an owner decision if it bites; independent; owner: fkit-coder)* | [`0145-pty-driven-menu-pick-coverage-for-the-launcher`](../tasks/backlog/0145-pty-driven-menu-pick-coverage-for-the-launcher/brief.md) |
| 🔲 Backlog | P132 | Correct the false "menu-pick alias" claim in 0139's accepted residual *(**a do-not-re-litigate residual describes behavior the code does not have** — it says `team`/`team room` still work as menu picks "exactly as before this task"; the menu arm is `1\|lead)` and the launcher's own comment agrees with the code, so the residual is the lone outlier; **owner ruled 2026-07-26: the text is wrong, the code is right — NO launcher change**; docs-only, `review.md` is the reviewer's ledger; feeds 0142; owner: fkit-reviewer)* | [`0146-correct-the-false-menu-pick-claim-in-0139s-accepted-residual`](../tasks/backlog/0146-correct-the-false-menu-pick-claim-in-0139s-accepted-residual/brief.md) |
| 🔲 Backlog | P133 | Guard test for the `SKILL.md` H1 house style — no skill may use the owner banner as its title *(0120 follow-up; **skill-file content is an entirely untested surface** — **no test in the repo reads any `SKILL.md`'s content**; **25** files, not 26: before 0120, 24 descriptive + **1 sole outlier**, after it 25/25, so the guard is green day one with **nothing grandfathered**; ADR-014 zero devDeps ⇒ hand-rolled; **⚠️ must reuse 0136's (114) `SKILL.md` walk, never add a second**; **low severity** — the original defect was cosmetic and the ADR-018 hook keys off `skills_for_role()`, not banner text; the coder's refusal to fold this into 0120 was correct; owner: fkit-coder)* | [`0152-guard-test-for-skill-md-h1-house-style`](../tasks/backlog/0152-guard-test-for-skill-md-h1-house-style/brief.md) |
| 🔲 Backlog | P134 | Record that 0118's block on 0117 was discharged by another route *(0118's brief `:84` still predicts "the amendment lands before 0117 runs" — **0117 shipped first** under an owner ruling with a staleness pointer standing in; architect ruled **record the discharge, do not delete the line** — a stale claim that already cost a three-day silent block is history worth keeping visible; edits a brief in `done/`; **must preserve the canonical `- **Blocks:**` form** or `dashboard.sh` reads UNPARSEABLE; owner: fkit-producer)* | [`0149-record-that-0118s-block-on-0117-was-discharged-by-another-route`](../tasks/backlog/0149-record-that-0118s-block-on-0117-was-discharged-by-another-route/brief.md) |
| 🔲 Backlog | P135 | Backfill the missing `## Priority` field into the six briefs that lack it *(a **full sweep** found **6 of 154** briefs (≈4%) with the heading absent entirely — 0122–0126 and 0136, not just the two noticed incidentally; `fkit-sprint-ship-loop:81` orders eligible tasks by the **brief's `## Priority` field**, so a brief without it is **invisible to the driver's own ordering rule**, and two of the six are live sprint rows at **P109** and **P114**; **no mis-ordering is in flight** — the driver falls back to the board cell and the cell agrees — so this is a conformance fix on a live rule, not an outage; 6 one-line inserts, values already known; touches four `✅ Done` briefs deliberately, because they are live P105–P108 rows the 0156 guard would otherwise fire on; **0105's shape**; blocks 0156 — hard; owner: fkit-coder)* | [`0155-backfill-the-missing-priority-field-into-six-briefs`](../tasks/backlog/0155-backfill-the-missing-priority-field-into-six-briefs/brief.md) |
| 🔲 Backlog | P136 | Make `## Priority` a required brief field — **nothing enforces it today** *(all three candidate sites checked 2026-07-27: `/fkit-task-brief`'s skeleton lists the field but its mandatory-field callouts name **only** `## Status` and `## Owner`; `dashboard.sh` has **no** `brief-missing-priority` kind — only `-id`, `-status`, `-owner` — and renders 0126/0136 with **zero** drift when run; **no test asserts presence**, `grep -rn "missing-priority" test/ claude/` returns nothing; **not an architect call** — the three-site pattern was walked end-to-end for `## Owner` by **0104 + 0105** this same sprint, so this is 0104's shape with no novel design; `Unscheduled` counts as **present** per the approved convention; ⚠️ existing raw test fixtures will trip it — use the `:62` default-injection precedent, **never a skip list**; brief-vs-board comparison **explicitly out of scope**; ADR-014 zero devDeps; **low severity** — ≈4% incidence, currently harmless, same class as 0152; needs 0155 — hard; owner: fkit-coder)* | [`0156-make-priority-a-required-brief-field-with-a-guard`](../tasks/backlog/0156-make-priority-a-required-brief-field-with-a-guard/brief.md) |

### Re-ranked 2026-07-27 (third re-rank of the day) **by owner ruling** — 0157 and 0158 moved from append rank to their merit positions

**Authority, stated first and in full.** This re-rank was **ruled by the owner**, on **2026-07-27**, via
**`AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session**. It was executed by a spawned
`fkit-producer` **on that instruction** — the producer contributed no placement judgment of its own, and
had no owner channel to acquire any. **This is not producer precedent for re-ranking at filing time.**

The authority is stated before the outcome deliberately. The addendum immediately below records a
placement's *outcome* far more visibly than its *authority*, and that omission was then read by a later
producer as licence to re-rank without one — the failure that produced tasks **0157** and **0158**.
`/fkit-task-brief` step 5's *"do not renumber or insert into the owner's ranking"* protects **the
owner's** ranking from an agent acting alone; it is not a bar on the owner re-ranking their own board.
The governing principle is already on this board at **`:414`** — **"A re-rank is the owner's call."**
This is that call.

**What was ruled.** The two rows the addendum below appended at P135/P136 and **flagged for owner
confirmation** move to the merit positions that flagging producer identified. **That standing flag is
now discharged.**

- **0158** → immediately below **0142** — same class, same investigator (`fkit-architect`), overlapping
  surface.
- **0157** → immediately below **0150** — the cheapest open item on the board, and the only one whose
  cost of waiting is a recurring owner adjudication.

**⚠️ One number in the ruling shifted by one, and here is exactly why.** The ruling named absolute
targets **P126 for 0157** and **P122 for 0158**. The two cannot both hold: inserting 0158 at P122 pushes
every row below it down one, so 0150 moves P125 → **P126**, and "immediately below 0150" is therefore
**P127**. The absolute targets were computed **independently of each other** by the flagging producer
(`:236-240`), each assuming the other move had not happened. **The relative anchors were followed**, and
they are what the ruling states in its own words. Taking P126 literally would have placed 0157
*between* 0147 and 0150 — **above** 0150, contradicting the ruling's own parenthetical and breaking the
0147/0150 adjacency the "one `fkit-coder` session" ruling protects. **No producer judgment entered this;
the resolution is forced.** Flagged for owner confirmation.

**No `✅ Done`, `⛔ Cancelled` or `➡️ Moved` row was renumbered.** The whole affected region **P121–P136
is contiguous `🔲 Backlog`** — the closed rows at P105–P108, P110–P112 and P115–P116 all sit above it and
were not reached. This is the third time in two days a producer has declined to rewrite closed history
on this board; **0157 makes that refusal normative.**

| Task | Was | Now | Why |
|---|---|---|---|
| **0142** | 121 | **121** | Unchanged. Anchor for 0158. |
| **0158** — decide whether a spawn instruction may override a skill rule | 136 | **122** | **Owner-ruled merit placement.** Immediately below 0142: same class (investigation, fix shape unknown), same owner role, overlapping surface. Not higher — the one known instance was benign. |
| **0151** | 122 | **123** | Displaced one place. **Nothing re-judged.** Its own reason — *"immediately below 0142"* — now reads *below the 0142/0158 pair*; the ordering it depends on is intact. |
| **0143** | 123 | **124** | Displaced one place. Not re-judged. |
| **0147** | 124 | **125** | Displaced one place. Not re-judged. **Still adjacent to 0150 at 125/126 — land the two in ONE `fkit-coder` session.** |
| **0150** | 125 | **126** | Displaced one place. Not re-judged; still directly below 0147. Anchor for 0157. |
| **0157** — state `/fkit-task-brief` step 5's append rule in full | 135 | **127** | **Owner-ruled merit placement.** Immediately below 0150, per the ruling's relative anchor — see the ⚠️ above for why this reads 127 and not the literal 126. |
| **0148** | 126 | **128** | Displaced two places. Its reason for sitting **after 0147** — one wiki pass over the ADR-032 page instead of two — is **still satisfied**. |
| **0154** | 127 | **129** | Displaced two places. Not re-judged; still below 0148 and the 0147/0150 pair. |
| **0144** | 128 | **130** | Displaced two places. Not re-judged. |
| **0145** | 129 | **131** | Displaced two places. Not re-judged; still directly after 0144. |
| **0146** | 130 | **132** | Displaced two places. Not re-judged. |
| **0152** | 131 | **133** | Displaced two places. Not re-judged. The open question about sharing a `SKILL.md` walk with 0136 and 0154 is **still open** — see `:364-367`. |
| **0149** | 132 | **134** | Displaced two places. Not re-judged. ⚠️ **Its *"it stays last"* reasoning was already untrue before this re-rank** — 0155/0156 were appended below it on 2026-07-27 and remain below it. This pass did not change its position relative to any other row, and did not fix that; **it is not something a producer may fix without an owner ruling.** |
| **0155** | 133 | **135** | Displaced two places. Not re-judged. |
| **0156** | 134 | **136** | Displaced two places. Not re-judged; still directly after 0155, which it hard-needs. |

**Existing rows moved, and why: thirteen, all of them displacement, none re-judged** — 0151 +1, 0143 +1,
0147 +1, 0150 +1, then 0148 +2, 0154 +2, 0144 +2, 0145 +2, 0146 +2, 0152 +2, 0149 +2, 0155 +2, 0156 +2.
**Every relative order among the displaced tasks is preserved.** The orderings this board protects were
checked by name after the edit: 0147/0150 adjacent ✅, 0148 after 0147 ✅, 0144 before 0145 ✅,
0149 above 0155/0156 as it already was ✅.

**Each displaced brief's own `## Priority` field was updated to match** — 15 briefs, board rank and brief
field verified to agree 1:1 across every open row afterward. Board cells render the rank token `P<n>`;
the brief field stays a plain number, per `conventions/priority-is-rank-not-identity.md`. **No row's
status, description, href or link label was touched** — only rank cells moved, and the rows were
reordered to match.

### Addendum — tasks 0157 and 0158 added out of band (2026-07-27): step 5 does not determine where a new brief lands

**Appended at 135 and 136. Nothing was renumbered and no existing row moved** — so every section below
stays authoritative exactly as written, including the 117-and-down table.

**Why filed.** Two spawned `fkit-producer` workers placed new briefs on this board **oppositely, about
an hour apart, on 2026-07-27**: Producer A merit-ranked 0153/0154 to P117/P127 and renumbered **14**
displaced rows; Producer B appended 0155/0156 at P133/P134 and refused to insert. **The owner accepted
both outcomes.** The owner approved filing this via `AskUserQuestion` on 2026-07-27.

**Correcting the premise this was filed under.** The commissioning brief supposed step 5 was *"ambiguous
enough that the same role did opposite things"*. Read firsthand, **it is not**. Step 5's first bullet, in
full:

> - **Targeting a named sprint:** append **after** the existing highest priority. **Do not renumber or
>   insert into the owner's ranking** — the ranking is theirs, and renumbering silently rewrites their
>   decisions. Flag the addition for owner confirmation in the report.

Reinforced twice more in the same file — step 8 (*"**Never renumber or alter an existing row.**"*) and
the closing `## Rules` block (*"**Do not renumber** the owner's existing priority ranking."*). **Producer
B read it correctly. Producer A did not misread it either** — its own addendum (`:245-249`) records the
override and its source: *"made on the lead's instruction to rank on merit rather than append"*, citing
the 2026-07-26 addendum as precedent.

**So the divergence had two causes, and they are different problems:**

| Cause | Nature | Task |
|---|---|---|
| Step 5 is silent on the **owner-ruled exception**, so the board's two legitimate re-ranks read as producer precedent | a wording gap on a **settled** rule | **0157** — `fkit-coder` |
| A **spawn-prompt instruction displaced an explicit skill rule**, and nothing says which wins | an **open** authority question | **0158** — `fkit-architect` |

**On the cited precedent.** The 2026-07-26 merit placement of 0151 (121) and 0152 (129) was **not** a
producer acting alone. It sits inside an owner ruling — *"The owner ruled: **promote it beside
0147**"* (`:302`) — in a pass whose own words are *"both owner-approved"*, and the same addendum states
the principle step 5 never does: **"A re-rank is the owner's call."** (`:414`). The producer's write-up
recorded the *outcome* far more prominently than the *authority*, and a later producer with no owner
channel read the outcome as the precedent. **An addendum that does not name its authority becomes
tomorrow's precedent for acting without one** — 0157 makes naming it mandatory.

**What else encodes an answer: nothing.** Checked 2026-07-27 by reading each file —
`claude/agents/fkit-producer.md` (two mentions of "priority", both as a brief field), `universal-rules.md`
(`grep -i "priorit\|rank"` returns nothing), `fkit-sprint-ship-loop/SKILL.md` (`:81` **consumes**
`## Priority` for ordering, never places a new brief), `dashboard.sh` + `fkit-status/SKILL.md` (treat the
cell as mutable rank, `:486`/`:560`), all 13 files in `test/` (`renumber\|merit\|insert into` hits only
ADR-number and task-ID uniqueness comments — a different number-space), and `wiki-vault/` (no page).
`conventions/priority-is-rank-not-identity.md` is adjacent but not an answer: it establishes rank is
mutable and *"re-ranked whenever the plan changes"* — never **who** may re-rank. **Step 5 is the only
site, and it is prose-only and unenforced** — the same class as 0154's finding.

**Two things both producers reached independently that no file states**, now codified by 0157: closed
`✅ Done`/`⛔ Cancelled` rows are never renumbered (written only in dated addendum prose today), and an
append should say where merit would have put it (0150's P128 flag did, and the owner acted on it the
**same day**).

**Cost, stated honestly.** This is not a wrong action in flight — both readings produced accepted
outcomes. It costs **an owner adjudication per filing**, which fired **three times on 2026-07-27 alone**
(0150's P128 flag — still the standing unresolved append flag at P128 — plus 0153/0154 and 0155/0156).
Ranked accordingly.

**Why two briefs and not one.** 0157 is a wording fix on a rule that is settled; 0158 is an open
question about who may override a skill rule, affecting **every** role. Folding them would put a
producer's text edit inside an architect's ruling. **Neither blocks the other** — 0157 deliberately
excludes the precedence clause, so it does not presume 0158's answer and can ship first.

**⚠️ Priorities 135 and 136 are append rank, NOT merit rankings — flagged for owner confirmation.**
Filed by a spawned producer with no owner channel; per the owner's ruling of 2026-07-27, appending was
the only sanctioned option. **On merit: 0157 at 126** (immediately below 0150 at P125 — the cheapest
open item on the board, and the only one whose cost of waiting is a recurring owner adjudication; not
higher, because no wrong action is in flight), and **0158 at 122** (immediately below 0142 at P121 —
same class, same investigator, overlapping surface; not higher, because the one known instance was
benign). Gaps of **nine** and **fourteen** slots.

### Addendum — tasks 0155 and 0156 added out of band (2026-07-27): the missing `## Priority` field

**Appended at 133 and 134. Nothing was renumbered and no existing row moved** — so the section below
stays authoritative for every priority from 117 down, exactly as it was written.

**Why filed.** A previous producer noticed while filing 0153/0154 that briefs **0126** (P109) and
**0136** (P114) carry **no `## Priority` heading at all**. The **owner approved filing this** via
`AskUserQuestion` on 2026-07-27. A full sweep of
`ai-agents/tasks/{backlog,done,cancelled}/*/brief.md` then found the real number: **6 of 154 briefs
(≈4%)** — 0122, 0123, 0124, 0125, 0126, 0136 — all with the heading omitted entirely between
`## Sprint` and `## Status`, all from two batch-filing sessions.

**Why it is not cosmetic.** `claude/skills/fkit-sprint-ship-loop/SKILL.md:81` orders a sprint's
eligible tasks *"by `## Priority`"* — **the brief's field, not the board cell**. The two are
deliberately different carriers (`conventions/priority-is-rank-not-identity.md`, approved 2026-07-27:
the board cell is mutable rank rendered `P<n>`; the brief's field is a plain number or `Unscheduled`).
**A brief with no `## Priority` is invisible to the rule the sprint driver depends on**, and one of the
six is the second-highest-ranked eligible task on this board.

**Stated honestly: no mis-ordering is in flight.** The driver falls back to the board cell, and for all
six the cell agrees with what the field should say. This is a conformance fix on a live rule — latent,
not an outage. It is ranked accordingly.

**The finding on enforcement: nothing enforces the field.** All three candidate sites checked
2026-07-27 by reading the files and running the script:

| Site | Verdict |
|---|---|
| `claude/skills/fkit-task-brief/SKILL.md` | **Partly.** Step 4's skeleton lists `## Priority`, but the mandatory-field callouts beside it name **only** `## Status` and `## Owner`. No obligation, no self-check. |
| `claude/skills/fkit-status/dashboard.sh` | **No.** Three nonconformance kinds exist — `brief-missing-id` (:661), `brief-missing-status` (:720), `brief-missing-owner` (:726). No `brief-missing-priority`. Run against this plan, it renders 0126 and 0136 with **zero** drift. |
| `test/dashboard-contract.test.js` | **No.** ~14 fixtures use the field and two tests pin its *parse* behavior, but **none asserts its presence**. `grep -rn "missing-priority" test/ claude/` returns nothing. |

**Why two briefs, not one.** The backfill is independently shippable and independently valuable today;
the guard is not shippable before it. Four of the six briefs are live `✅ Done` rows at **P105–P108**,
so a `brief-missing-priority` check shipped first would be **red on day one** against real repo state
and invite a skip list — the outcome 0152's brief explicitly refuses for its own guard. Hence
**0155 blocks 0156, hard**.

**Not an architect call, and here is why.** The three-site pattern is already designed and was walked
end-to-end for a fourth field *this same sprint*: **0104** added `## Owner` to the schema and the
skill, **0105** backfilled it into existing briefs, landing a `brief-missing-owner` drift kind, a test
at `dashboard-contract.test.js:1115`, and a mandatory-field callout. 0156 is 0104's shape and 0155 is
0105's. No novel structure, no trade-off to weigh. The one sub-question with judgment in it —
does `Unscheduled` count as present — is already answered *yes* by the approved convention. Both go to
**fkit-coder**; escalate only if implementation hits something the `## Owner` precedent does not answer.

**Explicitly out of scope:** any brief-vs-board priority *comparison*. 0156 checks the field **exists**.
Whether a brief's number must equal its board cell is a genuinely open, larger question — the board is
re-ranked far more often than briefs are edited, so strict equality would manufacture drift on every
re-rank. Recorded here so it is not read as a drop.

**⚠️ 133 and 134 are append ranks, NOT merit rankings — flagged for owner confirmation.**
`/fkit-task-brief` step 5 requires appending and forbids renumbering the owner's ranking, so the merit
judgment is recorded rather than applied. On merit **0155** belongs **immediately above 0146 (P130)** —
above the archival-correction cluster (0146, 0149) because it touches a rule the sprint driver reads
live rather than a closed record, and it is among the cheapest items on the board; **below 0151 (P122)**
and everything above it, because 0151 fixes a pointer that misdirects an agent *today* whereas this is
latent. **0156** belongs immediately below 0155 — hard dependency, and on its own merit it is the same
class as 0152 (P131): a guard on a low-severity, ≈4%-incidence, currently-harmless nonconformance. **The
merit/append gap is about three slots**, which is why appending is a cheap answer here rather than a
compromise.

### Re-ranked 2026-07-27 — two 0125 follow-ups filed and placed on merit (0153 at 117, 0154 at 127)

**This table is authoritative for every priority from 117 down.** Every earlier addendum heading and
table in this plan cites the numbers as they stood **before** this filing; they are kept as dated
records of their own reasoning and were **not** rewritten.

**What was filed.** Task **0125** closed 2026-07-27 as `✅ Done (agent-closed — not owner-verified)`.
Two follow-ups came out of that close and the **owner approved filing both** via `AskUserQuestion` on
2026-07-27:

- **0153** — the completion flag 0125 landed says `Task N`, and **`N` is never defined**. Found by a
  spawned `fkit-producer` during the close — **the role that consumes the flag**. The coder, the
  reviewer and the Codex adversarial pass all missed it across five rounds.
- **0154** — the convention 0125 landed is **prose only and enforced by nothing**. Named as a residual
  by **both** the coder and the reviewer.

**⚠️ The placement below is producer judgment, not an owner ruling.** The owner approved **filing**;
the ranking is the filing producer's, made on the lead's instruction to rank on merit rather than
append. It is open to an owner override. `/fkit-task-brief` step 5's default is to append, and the
precedent for merit placement at filing time is the 2026-07-26 addendum above (0151 at 121, 0152
at 129).

**Nothing above 117 moved, and no `✅ Done` or `⛔ Cancelled` row was touched.** 117 is the top of the
contiguous re-rankable region: **P110–P112** and **P115–P116** are closed rows, and renumbering closed
history is refused here for the same reason 0152's addendum refused it.

| Task | Was | Now | Why |
|---|---|---|---|
| **0153** — the wiki flag must carry the folder ID and the brief path | *(new)* | **117** | Ranked at the **top of the re-rankable region**. It is the **cheapest item in the whole open region** — three prose edits to three `SKILL.md` files, no new infrastructure, no design call — and the **only** one whose cost of waiting is a **wrong action** rather than missing evidence, stale prose, or inherited drift: a flag naming a task by the wrong number-space points `/fkit-task-done` at the **wrong brief**, which moves a file and edits the sprint plan. The collision is **live** — 0125 is rank **P108** and folder `0108` is a real task, and it is the very investigation 0125 implements. Placed **above** 0141 deliberately so the two displaceable wiki runs (0141, 0148) emit the corrected flag. |
| **0141** | 117 | **118** | Displaced one place. **Nothing re-judged.** |
| **0132** | 118 | **119** | Displaced one place. Not re-judged; still directly above 0133, which ADR-027 §3 makes binding. |
| **0133** | 119 | **120** | Displaced one place. Not re-judged. |
| **0142** | 120 | **121** | Displaced one place. Not re-judged. |
| **0151** | 121 | **122** | Displaced one place. Its own reason — *"immediately below 0142"* — is **still satisfied**. |
| **0143** | 122 | **123** | Displaced one place. Not re-judged. |
| **0147** | 123 | **124** | Displaced one place. Not re-judged. **Run order with 0150 is unchanged — land the two in ONE `fkit-coder` session**; they remain adjacent at 124/125. |
| **0150** | 124 | **125** | Displaced one place. Not re-judged; still directly below 0147. |
| **0148** | 125 | **126** | Displaced one place. Its reason for sitting **after 0147** — one wiki pass over the ADR-032 page instead of two — is **still satisfied**. |
| **0154** — build `test/wiki-flag-convention.test.js` | *(new)* | **127** | Above 0144/0145/0146 **and above 0152**. Same class as all four — adding a guard — but the strongest case of the group: the convention it guards is **one day old, duplicated across three files, and enforced by nothing at all**, and its only existing check is **fail-open and nearly shipped broken** (the anchor bug caught by chance at build time). The other four pin behavior **already verified correct**; 0152's convention held in 24 of 25 files with no enforcement whatsoever. Placed **below** 0148 and the 0147/0150 pair, which close gaps in controls the project is exercising right now. It also **closes 0125's SUBSUME'd R3 residual** — the only thing that does. |
| **0144** | 126 | **128** | Displaced two places (0153 + 0154). Not re-judged. |
| **0145** | 127 | **129** | Displaced two places. Not re-judged; still directly after 0144. |
| **0146** | 128 | **130** | Displaced two places. Not re-judged. |
| **0152** | 129 | **131** | Displaced two places. Not re-judged. **It was NOT promoted to sit beside 0154** despite the shared `SKILL.md` walk — see the open question below; promoting an existing task on producer judgment is an owner call, not a filing act. |
| **0149** | 130 | **132** | Displaced two places. Its *"the append order was right here"* reasoning is **unchanged** — it stays last. |

**Existing rows moved, and why: fourteen, all of them displacement, none re-judged** — 0141 +1, 0132
+1, 0133 +1, 0142 +1, 0151 +1, 0143 +1, 0147 +1, 0150 +1, 0148 +1, then 0144 +2, 0145 +2, 0146 +2,
0152 +2, 0149 +2. Every relative order among the displaced tasks is preserved.

**Dependency the board does record.** 0153 → 0154, **soft**. 0154 asserts the flag lines **verbatim**;
0153 rewrites them. Landing 0153 first means 0154 pins the final wording. Either order ships — only one
is free.

**⚠️ Timing hazard the board CANNOT express — read before running any wiki task.** Three wiki-owned
tasks will each emit the 0125 flag: **0126** (rank **P109**), **0141** (118) and **0148** (126). 0141
and 0148 rank below 0153 and will emit the corrected flag. **0126 ranks above it and cannot be
displaced** without renumbering the `✅ Done` rows at P110–P112. If 0126 runs before 0153 lands, its
flag carries a bare `Task N` — **resolve it against the task-folder ID, never the board rank, before
invoking any mover.**

**Open question for the owner — harness sharing.** Three tasks now commit to reading `SKILL.md` bodies:
**0136** (P114, frontmatter), **0154** (127) and **0152** (131). All three are hand-rolled under
ADR-014 and all three want the same file walk. On merit they rank apart. If the owner prefers one
session over three, the cheapest form is **co-landing 0154 with 0152**. Not done unilaterally.

### Re-ranked 2026-07-26 (second re-rank of the day) by owner ruling — 0150 promoted beside 0147, and two 0120 follow-ups placed on merit

**This table is authoritative for every priority from 120 down.** Earlier addendum headings and tables
in this plan cite the numbers as they stood **before** this ruling; they are kept as dated records of
their own reasoning and were not rewritten. Where a heading names a task by priority, the parenthetical
now carries the new number too.

**The owner's ruling (Unit 1).** 0150 was filed at **128** — append rank, which the filing producer
correctly flagged as *not* merit (`/fkit-task-brief` step 5 forbids a spawned producer inserting into
the owner's ranking without a ruling). The owner ruled: **promote it beside 0147**, because the two
touch **different clauses of the same file** (`claude/agents/fkit-coder.md`) and should be **landable in
one `fkit-coder` session** — one read of the guarantee surface and one review pass instead of two.

**Two follow-ups filed at the same time (Unit 2)**, both surfaced during **task 0120's plan step** by
the `fkit-coder` worker and **verified against the repo** before filing, both owner-approved, both
**ranked on merit here rather than appended**.

| Task | Was | Now | Why |
|---|---|---|---|
| **0151** — correct `CLAUDE.md`'s stale `skills_for_role()` location | *(new)* | **121** | Immediately **below 0142**, the investigation of this exact failure class, so the specimen sits next to it on the board. Ranked this high because **`CLAUDE.md` is injected into every fkit session** — every role, every turn, is currently told the wrong file, for a one-line fix at zero risk. Not ranked higher, because the misdirection is **one hop**: `fkit-claude.sh:253-254` documents the move in a comment right above the `source` line, so a reader who follows the stale pointer lands next to the correction. **Adjacency is not a dependency** — 0151 does not wait on 0142. |
| **0147** | 122 | **123** | Displaced one place by 0151. **Nothing re-judged** — its relative position to everything except 0151 is unchanged. |
| **0150** | 128 | **124** | **The ruling.** Directly below 0147: same file, same already-settled ADR-032 clause work, and R1 (0150's source finding) is graded **medium** against 0147's **low**. It sits *below* rather than above 0147 because 0150 is a **second line of defence** — the driver's own verbatim rule must fail first — while 0147 closes a gap that makes ADR-032 **A4 bullet 2 unsatisfiable today**. **Run order: land 0150 with 0147 in one session.** |
| **0148** | 123 | **125** | Displaced two places (0151 + 0150). Its own reason for sitting **immediately after 0147** — one wiki pass over the ADR-032 page instead of two — is **still satisfied**: 0150 between them is a coder task and touches no vault page. |
| **0144** | 124 | **126** | Displaced two places. Not re-judged. |
| **0145** | 125 | **127** | Displaced two places. Not re-judged; still directly after 0144, which is the order its own addendum sets ("124 first only because it is cheap"). |
| **0146** | 126 | **128** | Displaced two places. Not re-judged. |
| **0152** — guard test for the `SKILL.md` H1 house style | *(new)* | **129** | Below the launcher pin-guards (0144/0145) and below 0146, because it is the **same class** — pinning behavior **already verified correct** — with the **lowest recurrence risk of the four**: the convention held in **24 of 25** files with no enforcement at all, and the defect it prevents is cosmetic (0120's own words). Above 0149 because 0149's cost of waiting is **archival only**. **Not** ranked near 0136 (114) despite the shared surface: doing that would have meant renumbering the two ✅ Done rows at 115/116, and the merit case does not justify rewriting closed history. |
| **0149** | 127 | **130** | Displaced three places. Its "the append order was right here" reasoning from the earlier re-rank is **unchanged** — it stays last. |

**Existing rows moved, and why: seven, all of them displacement, none re-judged** — 0147 +1, 0148 +2,
0144 +2, 0145 +2, 0146 +2, 0149 +3, and 0150 itself 128 → 124 by the ruling. Every relative order among
the displaced tasks is preserved. **Nothing above 120 moved**, and **no ✅ Done or ⛔ Cancelled row was
renumbered** — closed history is not re-ranked to make room for new work.

**Correction to the earlier re-rank's observation.** That addendum noted **0146** sits below **0142**
despite *feeding* it, and counted it as *"six places below"*. After this re-rank it is **eight places**
(120 → 128). The inversion is still **pre-existing and deliberately untouched** — it was not part of
either ruling. **Still worth a decision if 0142 is picked up first**, and this re-rank widened the gap.

**Two things this re-rank did NOT do:** no task's **status** changed — **101 (0119)** and **102 (0120)**
remain `🔄 In progress` and mid-flight, and 0119 in particular still awaits an **owner-verified** close,
not an agent close. And **0142 was not re-scoped**: its status, priority (120) and scope are untouched;
only a **pointer** to 0151 was added to its brief.

### Addendum — tasks 121 and 129 (0151/0152) added 2026-07-26: the two follow-ups task 0120's plan step surfaced

Both were found by the **`fkit-coder` worker while planning 0120**, not by a review — the worker read
the whole skill tree to place a one-file cosmetic fix and saw two things next to it. Both premises were
**re-verified against the tree by the producer before filing**; two of the worker's reported numbers did
not survive that check and are corrected below, because a brief that repeats a wrong count teaches it.

**0151 — `CLAUDE.md:43` names the wrong file.** It says `skills_for_role()` is declared in
`claude/fkit-claude.sh`. It **moved to `claude/skills-for-role.sh`** under **task 43 / ADR-018**;
`fkit-claude.sh:257` now merely sources it (`. "$here/skills-for-role.sh"`), and `:253-254` says so in a
comment. Verified: **`CLAUDE.md:43` is the only live site still asserting the old location** —
`claude/README.md:41-42` and `ai-agents/knowledge-base/architecture.md:154-156` are both already
correct, `grep -rn skills_for_role claude/scaffold/` returns nothing (no dual-home twin), and the ADRs
that cite the old path (010, 012, 014) are dated records, deliberately out of scope.

- **Why it is worth a task at all:** `CLAUDE.md` is injected into **every fkit session**, so this
  misdirects **every role in every session** — including the lead session that found it.
- **Why it is not urgent:** one hop, not a wrong edit (see the ranking table).
- **It is pointered into 0142** (priority 120, the fact-inventory investigation) as a **plausible live
  specimen** of the failure that investigation exists to characterise — the mirror checklist at
  `claude/skills-for-role.sh:12-24` has now missed a skill-ownership assertion **twice** (0036, then
  0124's three sites). Note the **shape**: 0142's inventory question already names *"the generated
  `CLAUDE.md`/`AGENTS.md` blocks"*, but this line is **hand-written prose outside** the generated block
  (which starts at `CLAUDE.md:45`) — a class the inventory does not currently name. **0142's status,
  priority and scope were not changed**; a pointer was added to its Notes.

**0152 — nothing stops the `SKILL.md` H1 drift 0120 just fixed from recurring.** The load-bearing fact
is not the H1 at all: **no test in this repo reads any `SKILL.md` file's content**, so skill-file
content is an **entirely untested surface**. Opening it is the larger part of this task's value.

- **Two corrections to the worker's report, made after re-verification.** There are **25**
  `claude/skills/*/SKILL.md` files, **not 26** (matching 0136's independently-verified count) — so the
  split was **24 descriptive + 1 outlier** before 0120, and 25/25 after. And
  `grep -rn "claude/skills" test/*.js` returns **two** hits, not zero: `dashboard-contract.test.js:28`
  **executes** `claude/skills/fkit-status/dashboard.sh`, and `harness.mjs:212-217` lists `.claude/skills`
  **directory names**. Neither opens a `SKILL.md`. **The conclusion survives; the grep that was cited
  for it does not.**
- **⚠️ The surface-opening credit is contingent on run order.** Task **0136** (priority 114, above this)
  already commits to *"the first automated reader"* of `SKILL.md` frontmatter. If 0136 lands first, 0152
  is one more assertion on an existing walk, **not** a surface-opener — and it must **reuse** that walk.
  The two must not end up with two independent `SKILL.md` readers; 0152's brief makes that a
  verification step.
- **The coder deliberately declined to fold this into 0120** — new scope with a new enforcement surface
  on a one-file cosmetic fix. **That judgment was correct**, and is recorded here so it is not
  re-litigated as a miss. It is the same fold-it-in pattern 0119 exists to correct.

### Addendum — task 128 → **124** (0150) added out of band (2026-07-26): the one-word marker drift 0119's review found

Filed during the same sprint-loop run, from **0119's round-1 review ledger** — finding **R1**
(`ai-agents/tasks/done/0119-track-fkit-coder-declared-approval-carve-out/review.md:18`), graded
**medium** and reached **independently by fkit-reviewer (Claude) and the Codex adversarial pass**
(`codex-cli 0.145.0`, exit 0 — full model-diverse coverage, not degraded). The ledger's convergence call
is explicit: *"Act on R1 — this is not a review loop."*

**All three cited sites re-verified against the tree on 2026-07-26** before filing, not copied from the
ledger — this tree moved repeatedly during the run.

- **Why it is tracked and not slipped in.** The edit is **one word**, but it lands on the clause that
  defines a spawned coder's **scope boundary** (`fkit-coder.md:68-69`). Owner-ruled during the run that a
  guarantee-surface change gets its own reviewable record — the same reasoning that produced 0119 itself.
- **Why medium and not high, kept as the reviewer graded it.** The driver's own verbatim rule
  (`fkit-sprint-ship-loop/SKILL.md:109`) has to fail first. This is a **second line of defence**, not the
  primary control. Recorded here so the severity is not re-argued upward or downward later.
- **Deliberately NOT folded into 0147** (priority 122), despite both editing `claude/agents/fkit-coder.md`.
  0147's verification step 4 forbids any diff touching the declared-approval marker's three signals — and
  this fix touches signal (b). Folding would mean weakening the exact guard that keeps 0147 off settled
  ground, and would repeat the fold-a-guarantee-surface-change-into-another-task mistake that 0119 exists
  to correct.

**⚠️ Priority 128 is append rank, NOT a merit ranking — flagged for owner confirmation.** Filed by a
**spawned** producer with no owner channel; `/fkit-task-brief` step 5 forbids inserting into or
renumbering the owner's ranking, so appending was the only sanctioned option. **On merit it belongs
adjacent to 0147** (122) — same file, same settled-ADR-clause work, and by the same reasoning the owner
used on 2026-07-26 to lift 0147 above the launcher-test pair, it closes a gap in a control the project is
**exercising right now**. Note R1 is graded **medium** while 0147's source finding R2 is **low**.
**A re-rank is the owner's call.** **Run-order recommendation regardless of number: land 0150 with 0147
in one `fkit-coder` session** — different clauses of one file, so one read of the guarantee surface and
one review pass over it.

**✅ RESOLVED, same day.** The owner ruled on **2026-07-26**: **promote 0150 to priority 124**, directly
below **0147 (123)**. The flag above did its job and is kept as the record of why the number was
questioned. **The run-order recommendation is now the plan's instruction, not a suggestion — land 0150
and 0147 in ONE `fkit-coder` session.** Full table: *Re-ranked 2026-07-26 (second re-rank of the day)*,
above.

**Dependency shape:** independent — depends on nothing, blocks nothing. **Filing it does not close
0119**, which stays `🔄 In progress` for the owner to verify and close personally.

### Addendum — tasks 122, 123 and 127 → **123, 125 and 130** (0147–0149) added out of band (2026-07-26): follow-ups surfaced by the sprint-loop run that closed 0118

Filed at **0118's close** by the spawned producer, from gaps workers surfaced during the run that no
existing task owned. Each premise was **re-verified against the tree** before filing — this tree moved
twice mid-run (commit `fd3bc61`, plus a vault re-lint), so cited `path:line` claims were checked, not
copied.

- **122 (0147)** — the audit-log gap. ADR-032's own amendment text flags it in a blockquote; the point of
  the task is that **A4 bullet 2 is unsatisfiable until it lands**.
- **123 (0148)** — the vault re-ingest **and** the stale-banner removal, deliberately **merged into one
  task**: same file, same edit. Two tasks would have raced over one page.
- **127 (0149)** — the producer-side correction to 0118's own `Blocks:` claim.

**Two candidate follow-ups were declined, not filed** — see the *Declined follow-ups* note below.

**Dependency shape:** all three are **independent**; none blocks another.

#### Re-ranked 2026-07-26 by owner ruling — the three were appended, not ranked

They were first filed at **125–127**, i.e. appended below everything. The owner ruled during the same run
that they be **placed on merit** against the existing ranking. The producer's ruling:

| Task | Was | Now | Why |
|---|---|---|---|
| **0147** | 125 | **122** | Above the launcher-test pair (0144/0145). Those pin behavior that is **already verified correct** against a hypothetical future re-addition; 0147 closes a hole in a control the project is **exercising right now**. Every sprint-loop run that applies an autonomous post-review fix while this is open produces evidence that is never written and cannot be reconstructed later, and ADR-032 **A4 bullet 2's reopening condition stays unsatisfiable** meanwhile. Cost is two prose edits to two named files — no new infrastructure, no design call. |
| **0148** | 126 | **123** | Immediately **after** 0147, deliberately. 0148's own brief says the ingest reads differently depending on whether 0147 has landed (*"if 0147 lands first, ingest the amended reality; if not, ingest the gap as the ADR records it"*). Running it second means **one wiki pass over that page instead of two**. Not ranked higher than 0141/0132/0133 because the stale banner is **self-describing** — it announces itself as a staleness pointer, so a reader is warned rather than silently misled. Wrong in its specifics, still doing its job. |
| **0149** | 127 | **127 (unchanged)** | **The append order was right here.** Both 0117 and 0118 are closed, so the false `Blocks:` prediction schedules nothing and misleads no live decision — the cost of waiting is archival only. It also **soft-follows 0143** (priority 121), which establishes the dated-correction-note form 0149 says it is copying. The current order already satisfies that; keeping 0149 last preserves it. |

**Existing rows moved, and why:** only the three the insert displaced — **0144 122→124**, **0145
123→125**, **0146 124→126**. Each keeps its **relative** order to the others and to everything else on
the board; nothing was re-judged, they were pushed down two places by the insert. No other priority on
the sprint changed.

**⚠️ Three wiki tasks now share one vault — sequence them as a batch.** **109 (0126)** owns the ADR-033
pages, **117 (0141)** the lead-rename pages, **123 (0148)** the ADR-032 amendment page. Each brief
declares a scope boundary and by declaration they do not overlap — **but each also ends in a re-sweep**,
and **0141 and 0148 both defer to an unsettled rule about historical vault pages that neither of them
owns settling** (0148 says so explicitly, citing 0141). The mitigation is not a priority number: the wiki
role should take **0126 → 0141 → 0148 in that order, ideally in one session**, and **whichever runs first
states the historical-page rule** for the ones after it to follow.

**Observation, not a change — pre-existing and left alone:** **126 (0146)** is recorded as *feeding*
**120 (0142)**, yet sits six places below it *(**correction 2026-07-26: eight places** — 0146 moved
126 → 128 in the second re-rank later the same day, while 0142 stayed at 120; the inversion is
unchanged, the gap is wider)*.
That inversion predates this re-rank and was not part of
the owner's ruling, so it was not touched. Worth a decision if 0142 is picked up first.

### Declined follow-ups from the same run (2026-07-26) — recorded so they are not re-raised as drops

- **"0119 must be owner-verified, not agent-closed" — NO TASK FILED, deliberately.** The requirement is
  **already written into 0119's own brief** at `:76-78` (*"Recommend the owner verify this one rather than
  agent-close it — … an `agent-closed — not owner-verified` close would defeat the reason it got its own
  brief"*), and again in this plan's 2026-07-22 addendum for task 101. A new task would have duplicated an
  instruction that is already in the only place that acts on it. A dated note was added to 0119's brief
  instead, recording that its 0118 dependency is now discharged **and** re-affirming the owner-verify
  requirement. **This is a live constraint on 0119, not a dropped item.**

### Addendum — tasks 124–125 → **126–127** (0144/0145) added out of band (2026-07-26): the launcher coverage 0139 deferred and never filed

*(Filed at priorities 122–123; **re-ranked to 124–125 on 2026-07-26** when 0147/0148 were placed above
them — see the re-rank table in the 0147–0149 addendum — then **displaced again to 126–127 the same
day** by the second re-rank (0151 + 0150's promotion). Nothing about these two was re-judged in either
pass; the table numbers below are the first-re-rank numbers.)*

Filed at **0140's close**, by owner ruling relayed from the coder session. These two exist because a
follow-up **fell through the gap once already**: 0139's review ledger routed the launcher alias-coverage
to *"a separately named follow-up task"* that **was never created** (0141 is the wiki resync, 0142 the
inventory investigation, 0143 the ADR-010 note — none of them this). 0140's reviewer carried the
residual forward with an explicit re-raise trigger — *"or 0140 closes without the producer filing the
brief"* — which is what put these on the board rather than a fourth silent drop.

**Why the suppression in 0140 was legitimate and still needed this.** Codex raised the missing coverage
in 0140 round 1; it was suppressed as matching 0139's accepted residual, whose re-raise condition
(*"hides a demonstrable defect"*) was **not** met — the removal is verified working. Suppression was the
right call **and** left a real gap. The gap is now a dated row, not a memory.

**Split at the infrastructure seam, not by size:**

| # | ID | Unit | Why separate |
|---|---|---|---|
| 124 | **0144** | `fkit team` / `fkit team room` → `rc=2`, `claude` never exec'd, + a 3rd `prove-red.sh` mutation | reachable by the **existing** harness — cheap, ships on its own today |
| 125 | **0145** | a **pty** helper + menu picks 1-7 and the menu-level `team` rejection | needs test infrastructure that does not exist; carries all the risk |

Neither depends on the other; 124 first only because it is cheap.

**⚠️ 125 partly reverses a recorded acceptance**, and that is deliberate:
`architecture.md:453` says the real tty menu *"stays manual"*. 0139 renumbered every pick and this
sprint's own note calls the accepted cost *"a mis-pick is silent"* — silent mis-picks are what tests
catch and humans do not. The brief includes updating that sentence once the coverage lands.

**Why 0139 was right not to grow this into its own scope.** The alias removal is verified — by a manual
pty run and by reading the source. What is missing is the *guard against re-addition*, and 0139 proved
the need for one the hard way: it **added** `team` / `team room`, the two-word form silently handed
`room` to Claude Code as an initial prompt, and it was reverted. **Nothing in the suite would catch that
happening again**, which is exactly what 124 fixes.

### Addendum — tasks 118–121 added 2026-07-25: three questions the producer had left unanswered, now ruled

Filed after an open-questions sweep of the 2026-07-25 producer session found **three questions put to
the owner that never got an answer** — each raised, then dropped when the session was redirected. All
three are now ruled. **The pattern is worth naming: this is the third time this project has lost a
question by moving on from it** (OQ6/task 37, OQ8, and now these three), and the first two were lost by
*re-asking* something settled while these were lost by *never re-asking*. Both are the same failure of
follow-through.

| Ruling | Result |
|---|---|
| **Pull 0132 + 0133 into Sprint 2** — ✅ yes | priorities **118**, **119** |
| **File the mirror-checklist gap** — ✅ yes, as an investigation | task **120** (`0142`) |
| **ADR-010's stale "menu option 7"** — ✅ dated correction note, by the architect | task **121** (`0143`) |

**On 118/119 — what the pull actually buys.** These are two of the three ADR-027 follow-ups that sat
unfiled for six days. They were filed to the Backlog board on 2026-07-25 and left unscheduled, which
meant **the owner's own ruling that day — "re-verify 0112 by hand once 0133 lands" — had no date on
it.** Scheduling them puts a date on it. Until 119 lands, task **0112** remains
`✅ Done (agent-closed — not owner-verified)` on the strength of a verification step that was
**unrunnable when it was claimed** — an accepted, dated, tracked exposure, still open.

**On 120 — why an investigation and not a fix.** The checklist has failed twice and the *shape* of the
remedy is genuinely unknown: a grep-based test must detect free-form prose assertions, and generating
the sentences instead collides with the rules-block byte budget task 113 says is at **91.1%**. Scoping
an implementation now would be scoping a guess. The owner was offered folding it into 0137 and declined
— **0137 teaches a convention; 120 fixes the specific mechanism.**

**On 121 — the precedent, not just the note.** This is the first correction note this project will
write, so the task's real deliverable is **the form**: where it goes, how it is marked, how a reader
tells it from the original decision. ADR-010 stays `accepted` — the decision it records is still in
force; only incidental facts in its prose went stale. The brief also flags a **third** stale claim in
the same sentence — *"routes rather than does"*, reversed by ADR-031 — which must be addressed or
explicitly deferred, never passed over.

### Addendum — tasks 115–117 added out of band (2026-07-25): lead goes to the top of the menu, and "team room" is retired

**Owner ruling, 2026-07-25**, from seeing the menu on screen: the lead should be **option 1**, not option
7, and **"team room" should be retired project-wide** in favor of the role's real name. The owner was
offered a menu-label-only option and **chose the project-wide retirement** explicitly.

**Why lead moves first:** since [ADR-031](../knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)
the lead *is* the front door — the role you pick when you don't yet know which role you need, and the one
that drives a whole sprint via `/fkit-sprint-ship-loop`. Listing it last contradicts the decision.

**Why "team room" is a label, not an alias.** The producer checked before scoping: `lead` is the
canonical name in `--help`, the case arms, `skills_for_role()`, the agent file, and **both test suites,
which assert roles by name and never by menu number** (`launcher-contract.test.js:29`,
`skill-ownership-hook.test.js:139`). "team room" appears only in prose — in **15 places**, which is what
turned a one-line change into three briefs.

**Split at the authority seams, not by size:**

| # | ID | Unit | Owner | Why separate |
|---|---|---|---|---|
| 115 | **0139** | the launcher — menu, case arms, `--help`, init.sh list | fkit-coder | shell source; independently runnable and verifiable on its own |
| 116 | **0140** | docs + agent definitions + the stale "menu 7" citations | fkit-coder | different file class, and **`fkit-lead.md` is a system prompt** — the exact site 0124's checklist missed |
| 117 | **0141** | the wiki vault | **fkit-wiki** | `wiki-vault/` writes are the wiki role's **exclusively** (ADR-005) — this could not be folded into 116 at any size |

**⚠️ The accepted cost, recorded rather than discovered later.** Renumbering shifts every other role
down one: producer 1→2, coder 2→3, architect 3→4, reviewer 4→5, adversarial 5→6, wiki 6→7. **A mis-pick
is silent** — you land in a working session of the wrong role, with no error. The word-alias path
(`fkit coder`) is unaffected and is the mitigation to tell users about. The `team` and `"team room"`
word aliases are **deliberately kept** in the case arms even though the label is retired from the
display, so nobody's habit breaks.

**Deliberately out of scope, and the reason matters.**
[ADR-010](../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md)`:26` says *"the
'team room' (menu option 7)"*, and two dated design reports say similar. Those statements were **true
when written**. Silently rewriting a decision record to match today erases the history the record exists
to hold. **Producer's recommendation: a dated one-line correction note on ADR-010, added by the
architect — not a coder edit, and not a rewrite.** Left as an open question below; the briefs instruct
the coder to touch none of it.

**Dual-home checked at scoping time** (ADR-027 §Decision 1, the check task 0131 will automate): **no
parity surface here.** `architecture.md` is not in `claude/scaffold/`, `decisions/` is `⛔ never sync`,
and the repo-root `CLAUDE.md` vs `claude/scaffold/CLAUDE.md` are independent files rather than copies —
both need editing, neither is a pair.

**Open question for the owner:** ADR-010's now-false "menu option 7" — dated correction note (producer's
recommendation), leave it as a historical statement, or something else? **Nothing in 115–117 touches it
until you rule.**

### Addendum — task 0129 added out of band (2026-07-23), then pulled forward to priority 111: the transcript-independent ship-loop skip signal (0127 residuals R6 + R8)

Filed from task **0127**'s review — accepted residuals **R6** and **R8** carried a **named producer
follow-up**. The 0127 Stop hook decides a `/fkit-task-ship-loop` turn by scanning `transcript_path` for
the command-marker *text* (SKIP-3), which is fragile in both directions:
- **R6 (under-skip, low):** a missing/unreadable/lagging transcript fails to skip a real ship-loop turn
  → spurious "What's next?" / interactive block. Bounded (block-once-escapable, degraded-only,
  session-only, pre-existing).
- **R8 (over-skip — the reason for the pull-forward):** the scan matches the bare command string
  **wherever it appears as transcript content** (a file read, `tool_result`, attachment, pasted excerpt),
  not just a real invocation, so the hook **silently disables itself**. On this dogfooding repo most
  self-maintenance sessions read files containing the marker → **the hook is effectively non-enforcing
  here until 0129 lands.** Fail-open-safe (over-skip = not-block), so accepted for 0127; downstream
  consuming projects unaffected.

**0129** is the durable fix: replace the substring scan with an **authoritative, transcript-independent**
signal for a real ship-loop invocation — candidate leads **`UserPromptExpansion` `command_name`**
(Codex-surfaced during 0127 review; verify against the Claude Code hooks docs in planning — would fix R8,
R6, and the R8 known-limitation test in one change, for both loops) **or** a loop-written
`$cwd/.fkit/state/` marker (the pattern 0127 introduced for the `AskUserQuestion` PreToolUse marker).
Fail-open preserved.

- **Owner pulled 0129 forward (2026-07-23):** re-ranked **112 → 111** (now directly after the reopened
  hook 0127 at 110, ahead of the independent prose-half 0128, which moved 111 → 112). Motivated by R8
  found during owner live-verification of the reopened 0127.
- **Depends on 0127** — the hook (reopened for its R7 fix, being re-closed), its `$cwd/.fkit/state/`
  marker pattern, and the skip list this hardens. Do not start before 0127's rework lands.
- **Relates to 0116** (backlog, priority 98) — 0116 adds `/fkit-sprint-ship-loop` to the *same*
  transcript-scanned skip list. 0129 makes detection robust for **both** loops; whichever of the two
  lands second must not re-introduce a transcript-only skip. **Do not do them blindly in isolation.**
- **Scope decision surfaced for the owner** (in the brief): which signal (Lead A vs Lead B), and whether
  to keep the transcript scan as a fallback. Does not block starting.
- **Flagged for owner confirmation:** the 111 placement and the single adjacent bump of 0128 (111 → 112).
  0129 was ranked no lower than 111 because it depends on 0127 (110); going ahead of the ADR-033 chain
  (105–109) — which itself sits ahead of 0127 — would be incoherent. Owner can override.

Filed while the fkit-coder was running `/fkit-task-ship-loop` on **0116** and hit a hard blocker: 0116
is gated on the ADR-030 `Stop` hook, which is **accepted but not built** (`claude/turn-completion-hook.sh`
does not exist) and had **no brief tracking it**. Both ADR-030 deliverables were unfiled:

- **110 (0127) — the hook.** `claude/turn-completion-hook.sh` + the second `Stop` key in
  `build_settings()` + `node --test` coverage. Design is complete
  ([`2026-07-19-design-turn-completion-hook.md`](../knowledge-base/reports/2026-07-19-design-turn-completion-hook.md),
  [ADR-030](../knowledge-base/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md)) — **no
  new design decision needed**. This is **0116's sole remaining blocker** (0116's other dependency, task
  93 / 0111, is Done).
- **111 (0128) — the prose half.** ADR-030 Decision 8 / design §5.5 — the two clauses the hook cannot
  enforce, added to `claude/scaffold/universal-rules.md`. **Task 79 / 0022 was compressed specifically to
  make room for it**, then the brief was never written. A producer catch, not part of the coder's request.

**The two halves are independently shippable in either order — neither blocks the other.** Only 0127
unblocks 0116; 0128 is already unblocked today.

**Two open questions for the owner on 0127 (design §7 — do not block starting):** (1) the exact heading
text for check B — literally `What's next?` or a looser match (it is a string-match *contract*; design
recommends the literal string); (2) whether check A (ask-interactively enforcement) is universal or
coder-only — ADR-030 Decision 3 made *"What's next?"* universal but did not rule on check A (design
recommends universal). A third item — the block-once turn-scoped marker — is a **coder-level** decision,
flagged in the 0127 brief as the piece most likely to go subtly wrong (design §5.4).

**Priorities 110–111 appended after 109; existing ranking untouched. Ranking is for the owner to
confirm.**

### Addendum — tasks 105–109 added out of band (2026-07-23): the ADR-033 mover-authority reversal ripple

The owner ruled during the task 0108 open-questions interview that **the task movers become
producer-only again**, reversing [ADR-025](../knowledge-base/decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md);
recorded as [ADR-033](../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md).
These five briefs are its implementation ripple (ADR-033 §Follow-on), decomposed into the smallest
independently shippable units:

- **105 (0122)** — coder ship-loop step 9: self-close → producer route (ADR-033 §3, amends ADR-019).
- **106 (0123)** — sprint-ship-loop close step: driver self-close → spawn producer to close (ADR-033 §4,
  amends ADR-032). **This revises what 0111 built** to ADR-032-as-first-written; 0111 stays closed.
- **107 (0124)** — the structural core: `skills-for-role.sh` producer-only + the four mirrors + the hook
  test flip + the two movers' SKILL "any role may close" prose, one atomic unit (ADR-033 §1).
- **108 (0125)** — the wiki flag-don't-close convention in the three wiki SKILL *sources* (coder-owned
  per the task 0081 Part C ruling). **This is task 0108's operative implementation fix.**
- **109 (0126)** — fkit-wiki resync: ingest ADR-033, resync the vault pages asserting the ADR-025 "any
  role may close" rule (vault write — fkit-wiki only).

**Dependency shape:** `{105, 106} → 107 → {109}`; **107 must land after 105 + 106** so the ship-loops
reroute to a producer spawn before the grants are removed (else the loops hit a hook-denied mover).
**108 is independent** (additive flag) but recommended to co-land with 107 so the 0108 gap does not
re-open in the interval. Existing dependencies for 0115 and 0117 were updated to build to ADR-033 (see
their briefs). Priorities 105–109 appended after 104; existing ranking untouched. **Ranking is for the
owner to confirm.**

### Addendum — tasks 103–104 pulled in from the Backlog (2026-07-23)

The owner pulled the **task-folder-numbering** pair off the Backlog board into Sprint 2. **103** (was
`0102`) is the architect investigation into the owner's *"two numbers, and they don't match"* confusion
— a task's permanent folder-ID prefix (e.g. `0109`) versus its sprint priority (e.g. `91`); it decides
whether to drop the folder-name number, weighing cheaper alternatives against ADR-029 Decision 5 and the
days-old task-76 migration. **104** (was `0103`) implements the scheme change **only if** 103 approves it,
and is a cancellation candidate otherwise. Priorities appended after 102, dependency order preserved
(103 blocks 104); the existing ranking is untouched. **Ranking is for the owner to confirm.**

> **Correction (2026-07-26) — the "cancellation candidate" clause above is void.** 103 ruled and the
> owner approved **Option C**: keep the folder prefix, fix the confusion on the *priority* side. **104
> is RESCOPED, not cancelled** — `dashboard.sh` folder-ID-primary, `P<n>` priority rendering, Option D
> label normalisation, and the convention page. The 2026-07-23 sentence is left as written because it
> was true when written; this note records that it no longer is.

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

## Addendum — task 0130 added out of band (2026-07-24): reclaim rules-block budget headroom

**Owner-directed follow-up from task 0128's review**, filed by the producer. Task 0128 (the ADR-030
prose half) brought the fkit-managed rules block to **91.1% of `RULES_MAX=4096` — 3733 B emitted,
363 B headroom.** `fkit-claude-init.sh` aborts a launch above the cap, and
`test/rules-block-budget.test.js` trips a warning gate at 92% — the block is one cross-cutting rule from
being blocked. 0130 hardens the budget: measure-and-propose, then implement the owner-signed option —
either a **compression pass** (the 0022 precedent) or a deliberate **`RULES_MAX` bump**.

**Not a 0128 defect** — 0128's review closed clean and flagged this as the follow-up. **No hard
dependency**; it should land before the next cross-cutting rule needs the room.

**A `RULES_MAX` bump is an owner/architect call, not the coder's alone** — the cap exists because the
block lands in every agent's context on every turn. The coder presents the option + tradeoff and
implements the signed choice.

**Priority 113 is appended after the tail, not inserted** — `fkit-task-brief` step 5 forbids renumbering
the owner's ranking. Flagged for owner confirmation. **✅ Confirmed by the owner 2026-07-25 — 0130 stays
at priority 113.** No re-ranking; the question is settled.

## Addendum — 2026-07-25: owner dispositions, and a scope gap found in task 107 (0124)

### OQ8 — ❌ the producer re-raised it in error; it was resolved on 2026-07-17

**No task filed. Nothing to do.** The producer's 2026-07-25 situation briefing listed OQ8 as *"never
scoped, still awaiting your word"* and the owner ruled on it again. **That was a producer error.** OQ8 was
ruled *"generalize"* on **2026-07-17**, spawning **task 47**, and the resolution is stated in this plan's
own §Open questions header — directly above the text the producer read. The convention has existed since
then:
[`conventions/one-skill-one-output.md`](../knowledge-base/conventions/one-skill-one-output.md).

**The already-shipped convention satisfies every point raised in the re-ask**, including the one the
producer flagged as critical — §"The escape hatch" states that a proposed output-variant is *"an owner
decision at proposal time, never a silent design choice"*, and §"History — recorded honestly" records the
`/fkit-status full` tradeoff verbatim: the variant *"was correct when written"* and only task 41 retired
its justification. Its scaffold follow-up also shipped, as task **0086**.

**Cause, for the record:** the producer read the resolution marker and reported the question as open
anyway — a failure of the standing rule in
[`conventions/evidence-before-assertion.md`](../knowledge-base/conventions/evidence-before-assertion.md).
It cost the owner a decision they had already made. **This is the second OQ to be re-raised after
resolution** — OQ6/task 37 was the first (see §Owner dispositions, item 6, still sitting cancelled-pending
in `backlog/`). Two instances is a pattern in the briefing procedure, not two slips.

### Three ADR-027 follow-up briefs were never filed — found by sweep, filed 2026-07-25

The OQ8 check above led into the conventions directory, which surfaced a real and larger gap.
[ADR-027](../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md)
(accepted **2026-07-19**) named **three producer-scoped briefs**. A sweep of all three boards found that
**none had ever been filed** — for six days. Now on the Backlog board:

| ID | Task | ADR-027 ref |
|---|---|---|
| **0131** | Add the dual-home scoping check to `/fkit-task-brief` | §Decision 1 |
| **0132** | Reconcile the dual-homed file drift (blocks 0133) | §Decision 2 |
| **0133** | Build `test/dual-home-parity.test.js` (needs 0132) | §Decision 2 |

**Confirmed live drift:** `conventions/dependency-declaration-form.md` exists in `ai-agents/` but **not**
in `claude/scaffold/`, while `conventions/README.md` states *"every other convention here is dual-homed
and must stay byte-identical."* That file defines the `- **Depends on:**` form `dashboard.sh` parses — so
consuming projects never receive it and inherit the **task-84 misreport class** (blocked tasks rendering
as pullable). ADR-027 recorded four prior recurrences of this drift; this is the fifth.

**🚩 The finding that needs the owner, loudly: `test/dual-home-parity.test.js` does not exist, and two
briefs cite it as a verification step.**

- **Task 0112** — `✅ Done (agent-closed — not owner-verified)` — shipped with verification step 4 reading
  *"The ADR-027 dual-home parity test passes (live vs scaffold)."* **That step was unrunnable when it was
  claimed.** Agent-closed, so no human confirmed it either.
- **Task 0124** (priority 107) — same wording. **Corrected in the brief 2026-07-25** to a hand-run `diff`,
  with an explicit "do not go looking for that test" warning.

**✅ Owner ruled 2026-07-25: re-verify 0112 by hand once 0133 lands.** It is **not** reopened and **not**
written off. 0133's brief now carries the obligation as a named deliverable — run the new parity test
against 0112's five touched files, report pass or fail to the owner, and if it fails, scope the repair as
its own task rather than fixing it under 0133. **The risk this leaves open, stated plainly:** 0112 stays
`✅ Done` in the meantime on the strength of a verification nobody ran. That is an accepted, dated,
tracked exposure — not a resolved one — and it stays exposed until 0132 and 0133 both land.

### Owner dispositions, 2026-07-25 — summary

| Item | Ruling |
|---|---|
| 0130 priority 113 | ✅ Confirmed; no re-ranking |
| OQ8 | ❌ Producer error — already resolved 2026-07-17; no task |
| Task 100 (0118) | **Stalled → reassigned** to fkit-architect as live work |
| Task 0112 | Re-verify by hand once 0133 lands; stays closed meanwhile |
| ADR-033 chain (105–109) | Owner drives it in a `fkit coder` session |

### Task 107 (0124) — scope amended, gap found by sweep

Brief `0124-revert-task-movers-to-producer-only` listed only the **four** `skills-for-role.sh:12-24`
mirrors. A grep sweep this session found **three further live sources** asserting the reversed ADR-025
grant that the checklist does not cover:

| File | What it says |
|---|---|
| `claude/scaffold/universal-rules.md:7` | *"Any role but the adversarial reviewer may invoke them"* — the rules block in **every agent's context, every turn**; also generates the repo-root `CLAUDE.md`/`AGENTS.md` blocks |
| `claude/agents/fkit-producer.md:7,37-38,95-96` | three assertions of the ADR-025 grant |
| `claude/agents/fkit-coder.md:103,190-191` | *"closes the task itself"* + *"you may invoke them yourself"* — the latter in the coder's **hard must-not-do list** |

**Why this mattered:** these are **system prompts**, which outrank a SKILL in the agent's own context. Had
0124 shipped as written, the ADR-018 hook would deny the coder a mover while `fkit-coder.md:190-191` still
told it to invoke one — a runtime that argues with itself. Added to the brief as **item 5**, with a
verification sweep as step 6.

**The generalizable finding — not just this instance:** the `skills-for-role.sh:12-24` mirror checklist is
**not a complete inventory** of where a skill-ownership fact is stated. It was built for docs and misses the
agent definitions and the universal rules block. That checklist has shipped false docs once before
(task 0036); this is the second class of thing it does not see. **Not scoped** — flagged for the owner.

**Ripple onto 0130 (priority 113):** item 5 edits `universal-rules.md`, changing the size of the very block
0130 is reclaiming headroom in. Producer-only is *shorter* than "any role but the adversarial reviewer", so
0124 likely returns a few bytes — **measured, not assumed**. Whichever task lands second re-measures.
