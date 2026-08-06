# Sprint 2 — Remove Omnigent, land Claude-native as the only runtime

> ## 🔒 CLOSED — 2026-08-06. Superseded by [Sprint 3](../sprint-3.md).
>
> **Sprint 2 was rolled over to a fresh board by OWNER RULING, 2026-08-06**, given via
> `AskUserQuestion` in a live `fkit lead` session — verbatim **"Roll over to Sprint 3."** The archival
> shape was ruled in the same session: **"Follow the Sprint 1 precedent"** — this file moves to
> `sprints/done/` and a fresh `sprint-3.md` is created. Executed by a spawned `fkit-producer` under
> task [`0185`](../../tasks/done/0185-decide-whether-sprint-2-rolls-over-to-a-fresh-board/brief.md),
> which is the task that scoped the decision.
>
> **Why it was rolled.** The board was drained — **138 done · 5 cancelled · 45 moved · 1 open**, of
> 189 rows. A fresh board gives new work a real rank range instead of appending at `P190`+ behind 188
> closed rows, and it restores reachability in one act: rolling the open rows onto a contiguous new
> board resets them into a single segment **without renumbering a single closed row**. See the
> [merit-ordering report](../../knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md)
> §3.6 for the mechanism, and [ADR-035](../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
> for the rule that makes it the *only* available mechanism.
>
> **⚠️ A rollover is NOT a renumbering pass** (report §3.3 ruled that OUT). A renumbering pass rewrites
> the ranks of rows that stay; a rollover moves open rows to a new board and leaves this one frozen.
> **Every `P<n>` on this board is unchanged from before the roll**, including the moved row's `P189`.
>
> **This plan is kept, not deleted — it is the record of what was done.** Everything below is
> historical. Do not pick up work from this file; see [Sprint 3](../sprint-3.md).
>
> **Disposition of its one open row:** task `0222` (`P189`) **moved to Sprint 3**. Its Priority cell
> here keeps the historical `P189` — a moved row's rank on the source board is frozen.
>
> **⚠️ Archived, not frozen.** Sprint 1's archived board was edited three more times after archiving.
> A dated correction appended below is legitimate; a silent rewrite of a rank or a status is not.

**Goal:** fkit is now a **Claude Code native + Codex** team, and only that. Sprint 2 executes the
removal of the Omnigent runtime end to end — extract what the Claude flavor still depends on, build
the one piece that's genuinely missing, rewrite the installer, delete `omnigent/`, and only *then*
rewrite the docs and the wiki against the reality that's left.

**Authorized by:** [ADR-009](../../knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md)
(Claude-native is the only runtime) and
[ADR-010](../../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md)
(role-locked sessions + skill lockdown).
**Technical sequence from:** [`2026-07-11-plan-omnigent-removal.md`](../../knowledge-base/reports/2026-07-11-plan-omnigent-removal.md)
(fkit-architect). **Evidence:** [`2026-07-11-doc-drift-audit.md`](../../knowledge-base/reports/2026-07-11-doc-drift-audit.md).

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
| ✅ Done | P1 | Extract the shared scaffold into `claude/` *(Phase 0.1)* | [`0038-extract-scaffold-into-claude`](../../tasks/done/0038-extract-scaffold-into-claude/brief.md) |
| ✅ Done | P2 | Build self-update for the Claude path *(Phase 0.2)* | [`0019-build-claude-self-update`](../../tasks/done/0019-build-claude-self-update/brief.md) |
| ✅ Done | P3 | Make Codex a checked prerequisite *(Phase 0.3)* | [`0060-make-codex-a-checked-prerequisite`](../../tasks/done/0060-make-codex-a-checked-prerequisite/brief.md) |
| ✅ Done | P4 | Rewrite the installer for a single flavor *(Phase 1)* | [`0084-rewrite-installer-single-flavor`](../../tasks/done/0084-rewrite-installer-single-flavor/brief.md) |
| ✅ Done | P5 | Delete `omnigent/` *(Phase 2)* | [`0025-delete-omnigent-directory`](../../tasks/done/0025-delete-omnigent-directory/brief.md) |
| ✅ Done | P6 | Reconcile the skill-ownership source of truth *(Phase 3 — independent)* | [`0063-reconcile-skill-ownership-source-of-truth`](../../tasks/done/0063-reconcile-skill-ownership-source-of-truth/brief.md) |
| ✅ Done | P7 | Verify onboarding flow end-to-end *(the removal gate — PASSED, [evidence](../../knowledge-base/reports/2026-07-12-onboarding-verification.md))* | [`0091-verify-onboarding-flow-end-to-end`](../../tasks/done/0091-verify-onboarding-flow-end-to-end/brief.md) |
| ✅ Done | P8 | Rewrite the docs against the post-removal reality *(Phase 4)* | [`0083-rewrite-docs-post-omnigent`](../../tasks/done/0083-rewrite-docs-post-omnigent/brief.md) |
| ✅ Done | P9 | Formalize the knowledge-base folder structure, incl. `incidents/` *(→ [ADR-013](../../knowledge-base/decisions/adr-013-knowledge-base-root-holds-the-living-canon.md))* | [`0044-formalize-knowledge-base-incidents-folder`](../../tasks/done/0044-formalize-knowledge-base-incidents-folder/brief.md) |
| ✅ Done | P10 | Knowledge-base hygiene after the removal *(Phase 5a)* | [`0059-knowledge-base-hygiene-post-omnigent`](../../tasks/done/0059-knowledge-base-hygiene-post-omnigent/brief.md) |
| ✅ Done | P11 | Wiki sync after the removal *(Phase 5b)* | [`0098-wiki-sync-post-omnigent`](../../tasks/done/0098-wiki-sync-post-omnigent/brief.md) |
| ✅ Done | P12 | Bake the Architecture pointer into the scaffold templates | [`0018-bake-architecture-pointer-into-scaffold-templates`](../../tasks/done/0018-bake-architecture-pointer-into-scaffold-templates/brief.md) |
| ✅ Done | P13 | Extend `initiate-project` to fill CLAUDE.md/AGENTS.md Project Overview | [`0035-extend-initiate-project-fill-overview`](../../tasks/done/0035-extend-initiate-project-fill-overview/brief.md) |
| ✅ Done | P14 | Add a `task-plan` skill to fkit-producer | [`0012-add-task-plan-skill-to-producer`](../../tasks/done/0012-add-task-plan-skill-to-producer/brief.md) |
| ✅ Done | P15 | Enforce the task status vocabulary in the source | [`0034-enforce-task-status-vocabulary`](../../tasks/done/0034-enforce-task-status-vocabulary/brief.md) |
| ✅ Done | P16 | Add a `status` skill to fkit-producer | [`0011-add-status-skill-to-producer`](../../tasks/done/0011-add-status-skill-to-producer/brief.md) |
| ✅ Done | P17 | Restore Claude Code plan mode in `/fkit-plan-task` *(regression — independent)* | [`0081-restore-plan-mode-in-plan-task`](../../tasks/done/0081-restore-plan-mode-in-plan-task/brief.md) |
| ✅ Done | P18 | Remove `fkit --resume` and the blanket arg-passthrough *(Omnigent scar tissue)* | [`0073-remove-fkit-resume-passthrough`](../../tasks/done/0073-remove-fkit-resume-passthrough/brief.md) |
| ✅ Done | P19 | Repair the knowledge-base paths in product source *(ADR-013 fallout)* | [`0077-repair-knowledge-base-paths-in-product-source`](../../tasks/done/0077-repair-knowledge-base-paths-in-product-source/brief.md) |
| ✅ Done | P20 | Design a version-to-version migration mechanism *(investigation — [findings](../../knowledge-base/reports/2026-07-14-migration-mechanism.md); spawned 25–28)* | [`0032-design-version-to-version-migration-mechanism`](../../tasks/done/0032-design-version-to-version-migration-mechanism/brief.md) |
| ✅ Done | P21 | Repair the 6 broken task links in the closed Sprint 1 plan *(one-off cleanup)* | [`0076-repair-broken-links-in-closed-sprint-plans`](../../tasks/done/0076-repair-broken-links-in-closed-sprint-plans/brief.md) |
| ✅ Done | P22 | Stop the task movers rotting links in closed sprint plans *(the recurrence — the real bug)* | [`0050-harden-task-movers-against-closed-sprint-link-rot`](../../tasks/done/0050-harden-task-movers-against-closed-sprint-link-rot/brief.md) |
| ✅ Done | P23 | Add the launcher-contract test suite *(zero devDeps; **runner TBD** — [ADR-014](../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md))* | [`0006-add-launcher-contract-smoke-script`](../../tasks/done/0006-add-launcher-contract-smoke-script/brief.md) |
| ✅ Done | P24 | Stop agents asserting repo state they never checked *(a false instruction in both task movers, shipping to every project)* | [`0087-stop-agents-asserting-unchecked-repo-state`](../../tasks/done/0087-stop-agents-asserting-unchecked-repo-state/brief.md) |
| ✅ Done | P25 | Fix the scaffold — ship the KB folders its own README promises *(defect; 100% of new projects)* | [`0043-fix-scaffold-knowledge-base-folders`](../../tasks/done/0043-fix-scaffold-knowledge-base-folders/brief.md) |
| ✅ Done | P26 | Stop an init failure from bricking the launcher *(pre-existing defect)* | [`0088-stop-init-failure-bricking-the-launcher`](../../tasks/done/0088-stop-init-failure-bricking-the-launcher/brief.md) |
| ✅ Done | P27 | Refuse init on a weird `ai-agents/` — symlink / file-where-dir *(live DoS + silent-skip bugs; the write-outside hazard is **prospective** — see the 2026-07-14 correction)* | [`0069-refuse-init-on-weird-ai-agents-state`](../../tasks/done/0069-refuse-init-on-weird-ai-agents-state/brief.md) |
| ✅ Done | P28 | Make launch converge `ai-agents/` additively *(**"the migration"**)* | [`0023-converge-ai-agents-additively-on-launch`](../../tasks/done/0023-converge-ai-agents-additively-on-launch/brief.md) |
| ✅ Done | P29 | Add a shared instructions layer that every fkit agent reads *(investigation — [findings rev 2](../../knowledge-base/reports/2026-07-14-shared-instructions-layer.md); spawned 30–32)* | [`0009-add-shared-instructions-layer-for-all-agents`](../../tasks/done/0009-add-shared-instructions-layer-for-all-agents/brief.md) |
| ✅ Done | P30 | Give Codex the universal hard rules it has never had *(**live defect** — the required second model runs with no floor)* | [`0047-give-codex-the-universal-hard-rules`](../../tasks/done/0047-give-codex-the-universal-hard-rules/brief.md) |
| ✅ Done | P31 | Merge an fkit-managed rules block into an **existing** `CLAUDE.md`/`AGENTS.md` *(the brownfield hole; **idempotent or it grows the file forever**)* | [`0061-merge-fkit-rules-block-into-existing-root-context-files`](../../tasks/done/0061-merge-fkit-rules-block-into-existing-root-context-files/brief.md) |
| ✅ Done | P32 | Add the "no secrets" rule to `fkit-lead.md` *(the 1 of 7 missing it — one line)* | [`0007-add-no-secrets-rule-to-fkit-lead`](../../tasks/done/0007-add-no-secrets-rule-to-fkit-lead/brief.md) |
| ✅ Done | P33 | Fix the headless menu-guard crash — `[ -r /dev/tty ]` never tests openability *(launcher defect against task-23 assertion 7's contract)* | [`0042-fix-headless-menu-guard-crash`](../../tasks/done/0042-fix-headless-menu-guard-crash/brief.md) |
| ✅ Done | P34 | Make `/fkit-task-done` flip the moved brief's own `## Status` header *(mover drift — sibling to task 22)* | [`0090-task-done-flips-brief-own-status-header`](../../tasks/done/0090-task-done-flips-brief-own-status-header/brief.md) |
| ✅ Done | P35 | Make `/fkit-task-cancelled` flip the moved brief's own `## Status` header *(same gap, `⛔ Cancelled` marker)* | [`0089-task-cancelled-flips-brief-own-status-header`](../../tasks/done/0089-task-cancelled-flips-brief-own-status-header/brief.md) |
| ✅ Done | P36 | Remove the `.fkit/` Omnigent-orphan residue *(OQ5 resolved; announce-only ruled 2026-07-17; 4-path list, `.fkit/settings` protected, non-fatal; owner: fkit-coder)* | [`0072-remove-fkit-omnigent-orphan-residue`](../../tasks/done/0072-remove-fkit-omnigent-orphan-residue/brief.md) |
| ⛔ Cancelled (2026-07-19) — superseded by ADR-016 | P37 | Record a tombstone ADR for the shared-instructions reversal *(**duplicate — already recorded as [ADR-016](../../knowledge-base/decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md), 2026-07-14, before this task was scoped; see OQ6**; owner: fkit-architect)* | [`0066-record-shared-instructions-reversal-adr`](../../tasks/cancelled/0066-record-shared-instructions-reversal-adr/brief.md) |
| ✅ Done | P38 | Add a full-board switch (`full`) to `/fkit-status` *(skill-text only; owner: fkit-coder)* | [`0005-add-full-board-switch-to-fkit-status`](../../tasks/done/0005-add-full-board-switch-to-fkit-status/brief.md) |
| ✅ Done | P39 | Investigate making `AskUserQuestion` available to fkit agents *(investigation — [findings](../../knowledge-base/reports/2026-07-17-askuserquestion-availability-for-agents.md); spawned [ADR-021](../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md); owner: fkit-architect)* | [`0056-investigate-askuserquestion-availability-for-agents`](../../tasks/done/0056-investigate-askuserquestion-availability-for-agents/brief.md) |
| ✅ Done | P40 | Design the deterministic dashboard generator for `/fkit-status` *(design — [spec](../../knowledge-base/reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md); spawned [ADR-017](../../knowledge-base/decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md))* | [`0026-design-deterministic-dashboard-for-fkit-status`](../../tasks/done/0026-design-deterministic-dashboard-for-fkit-status/brief.md) |
| ✅ Done | P41 | Build the deterministic dashboard script and wire it into `/fkit-status` *(owner: fkit-coder; [review](../../tasks/done/0020-build-deterministic-dashboard-script-for-fkit-status/review.md) closed-out, rounds 1–6, residuals recorded)* | [`0020-build-deterministic-dashboard-script-for-fkit-status`](../../tasks/done/0020-build-deterministic-dashboard-script-for-fkit-status/brief.md) |
| ✅ Done | P42 | Reopen ADR-012 Decisions 3 & 4 — record the `PreToolUse` skill-gate hook decision *(live bug fix, phase 1/2; owner: fkit-architect)* | [`0065-record-pretooluse-skill-gate-adr-amendment`](../../tasks/done/0065-record-pretooluse-skill-gate-adr-amendment/brief.md) |
| ✅ Done | P43 | Implement the `PreToolUse` skill-ownership gate (the hook-flip) *(owner: fkit-coder; [review](../../tasks/done/0052-implement-pretooluse-skill-ownership-hook/review.md))* | [`0052-implement-pretooluse-skill-ownership-hook`](../../tasks/done/0052-implement-pretooluse-skill-ownership-hook/brief.md) |
| ✅ Done | P44 | Remove the output variants from `/fkit-status` — one skill, one output *(**reverts task 38**; skill-text only; owner: fkit-coder)* | [`0074-remove-output-variants-from-fkit-status`](../../tasks/done/0074-remove-output-variants-from-fkit-status/brief.md) |
| ✅ Done | P45 | Wiki sync after the `/fkit-status` output-variant removal *(needs 44 — hard; owner: fkit-wiki)* | [`0096-wiki-sync-fkit-status-output-variant-removal`](../../tasks/done/0096-wiki-sync-fkit-status-output-variant-removal/brief.md) |
| ✅ Done | P46 | Investigate adopting a proper mutation-testing library, replacing hand-rolled `prove-red.sh` *(investigation — [findings](../../knowledge-base/reports/2026-07-18-mutation-testing-library-adoption.md); spawned [ADR-026](../../knowledge-base/decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled.md); owner: fkit-architect; spawned from task-43 review finding R2)* | [`0058-investigate-mutation-testing-library-adoption`](../../tasks/done/0058-investigate-mutation-testing-library-adoption/brief.md) |
| ✅ Done | P47 | Record the "one skill, one output" convention *(OQ8 resolved — generalize; document only; owner: fkit-architect → [`conventions/one-skill-one-output.md`](../../knowledge-base/conventions/one-skill-one-output.md))* | [`0064-record-one-skill-one-output-convention`](../../tasks/done/0064-record-one-skill-one-output-convention/brief.md) |
| ✅ Done | P48 | Ship the one-skill-one-output convention in the scaffold *(closes the 4th live-vs-scaffold instance; owner: fkit-coder; independent — does not wait for 49)* | [`0086-ship-one-skill-one-output-convention-in-scaffold`](../../tasks/done/0086-ship-one-skill-one-output-convention-in-scaffold/brief.md) |
| ✅ Done | P49 | Investigate dual-home parity — dogfood `ai-agents/` vs `claude/scaffold/` *(investigation — [findings](../../knowledge-base/reports/2026-07-18-dual-home-parity-live-vs-scaffold.md); spawned [ADR-027](../../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md); owner: fkit-architect)* | [`0057-investigate-dual-home-parity-live-vs-scaffold`](../../tasks/done/0057-investigate-dual-home-parity-live-vs-scaffold/brief.md) |
| ✅ Done | P50 | Rename the producer's `fkit-task-plan` skill to `fkit-task-brief` *(name collision with the coder's `fkit-plan-task`; atomic — dir + `skills-for-role.sh` + hook together; owner: fkit-coder)* | [`0075-rename-task-plan-skill-to-task-brief`](../../tasks/done/0075-rename-task-plan-skill-to-task-brief/brief.md) |
| ✅ Done | P51 | Wiki sync after the `task-plan` → `task-brief` rename *(needs 50 — hard; 8 vault pages; owner: fkit-wiki)* | [`0100-wiki-sync-task-plan-rename`](../../tasks/done/0100-wiki-sync-task-plan-rename/brief.md) |
| ✅ Done | P52 | Design the coder's `task-ship-loop` skill *(design — [spec, rev 3, owner-approved](../../knowledge-base/reports/2026-07-17-design-task-ship-loop-skill.md); spawns ADR-019/ADR-020; owner: fkit-architect)* | [`0031-design-task-ship-loop-skill`](../../tasks/done/0031-design-task-ship-loop-skill/brief.md) |
| ✅ Done | P53 | Implement the `task-ship-loop` skill from the approved design *(owner: fkit-coder; skill live, registered for coder, hook suite green)* | [`0055-implement-task-ship-loop-skill`](../../tasks/done/0055-implement-task-ship-loop-skill/brief.md) |
| ✅ Done | P54 | Grant the `AskUserQuestion` tool to the six Claude-side agents *(implements [ADR-021](../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md) Decision 4 / task 39 findings; tool grant, not a skill; owner: fkit-coder)* | [`0049-grant-askuserquestion-tool-to-six-claude-agents`](../../tasks/done/0049-grant-askuserquestion-tool-to-six-claude-agents/brief.md) |
| ⛔ Cancelled (2026-07-19) — not pursuing git automation | P55 | Design the `fkit-git` agent + commit/push consent model *(design — collided with the "never commit" hard rule; **owner ruled 2026-07-19: the hard rule stands, fkit will not gain a commit/push agent — settled, not deferred**; owner: fkit-architect)* | [`0027-design-fkit-git-agent-and-consent-model`](../../tasks/cancelled/0027-design-fkit-git-agent-and-consent-model/brief.md) |
| ⛔ Cancelled (2026-07-19) — parent design task 55 declined | P56 | Implement the `fkit-git` agent + `commit-push` skill from the approved design *(parent design task 55 declined 2026-07-19 — agent not designed, so no implementation; owner: fkit-coder)* | [`0051-implement-fkit-git-agent-and-commit-push`](../../tasks/cancelled/0051-implement-fkit-git-agent-and-commit-push/brief.md) |
| ✅ Done | P57 | Relax the tool allowlist for every role except the adversarial reviewer *(implements [ADR-022](../../knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md); subsumes task 54's mechanism; tools change only — skills stay locked; owner: fkit-coder)* | [`0070-relax-tool-allowlists-except-adversarial-reviewer`](../../tasks/done/0070-relax-tool-allowlists-except-adversarial-reviewer/brief.md) |
| ✅ Done | P58 | Refresh the docs for the tool-allowlist relaxation *(ADR-022 doc follow-up; owner: fkit-architect)* | [`0068-refresh-architecture-docs-for-tool-relaxation`](../../tasks/done/0068-refresh-architecture-docs-for-tool-relaxation/brief.md) |
| ⛔ Cancelled (2026-07-18) — declined on cost per ADR-024 | P59 | Design a timeout-auto-proceed for the ship-loop's owner questions *(feasible but declined on cost per [ADR-024](../../knowledge-base/decisions/adr-024-ship-loop-owner-question-timeout-is-not-built.md); safe version = launch-mode + gate re-expression + session-global user-scope AFK timer, not worth the convenience)* | [`0028-design-ship-loop-timeout-auto-proceed`](../../tasks/cancelled/0028-design-ship-loop-timeout-auto-proceed/brief.md) |
| ⛔ Cancelled (2026-07-18) — parent design task 59 declined | P60 | Implement the ship-loop timeout-auto-proceed from the approved design *(parent design task 59 declined per [ADR-024](../../knowledge-base/decisions/adr-024-ship-loop-owner-question-timeout-is-not-built.md); feature not built, so no implementation)* | [`0053-implement-ship-loop-timeout-auto-proceed`](../../tasks/cancelled/0053-implement-ship-loop-timeout-auto-proceed/brief.md) |
| ✅ Done | P61 | Restructure the coder's report — bullet summary first, interview on open questions last *(agent-contract edit; session=AskUserQuestion / consult=return-in-reply; owner: fkit-coder)* | [`0082-restructure-coder-report-summary-then-interview`](../../tasks/done/0082-restructure-coder-report-summary-then-interview/brief.md) |
| ✅ Done | P62 | Add a "Speak in simple terms" output-style preference for all agents *(preference not hard-rule; **scoped as 4 files — corrected at build time to ONE source, `claude/scaffold/universal-rules.md`, + re-run init; see the brief's 2026-07-18 correction**; owner: fkit-coder)* | [`0010-add-speak-in-simple-terms-output-style`](../../tasks/done/0010-add-speak-in-simple-terms-output-style/brief.md) |
| ✅ Done | P63 | Design a laundering-safe consent model for **spawned** invocation of the task movers *(design — [spec](../../knowledge-base/reports/2026-07-18-design-spawned-invocation-consent-model-for-task-movers.md); spawned [ADR-025](../../knowledge-base/decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md), **reverses the owner-only done-gate hard rule + ADR-019**; owner: fkit-architect)* | [`0029-design-spawned-invocation-consent-model-for-task-movers`](../../tasks/done/0029-design-spawned-invocation-consent-model-for-task-movers/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P64 | Implement spawned invocation for the task movers from the approved design *(owner: fkit-coder)* | [`0054-implement-spawned-invocation-for-task-movers`](../../tasks/done/0054-implement-spawned-invocation-for-task-movers/brief.md) |
| ✅ Done | P65 | Filter the `/fkit-status` board to open tasks only *(conscious reversal of "show the dead rows"; roll-up kept, drifted rows always visible, replace not toggle; owner: fkit-coder)* | [`0039-filter-fkit-status-board-to-open-tasks`](../../tasks/done/0039-filter-fkit-status-board-to-open-tasks/brief.md) |
| ✅ Done | P66 | Wiki sync after the filtered `/fkit-status` board *(needs 65 — hard; owner: fkit-wiki)* | [`0095-wiki-sync-filtered-fkit-status-board`](../../tasks/done/0095-wiki-sync-filtered-fkit-status-board/brief.md) |
| ✅ Done | P67 | Add a Backlog board — the default home for unsprinted task briefs *(persistent `sprints/backlog.md`, backfills 5 unsprinted briefs; filename deliberately outside the `sprint-*.md` glob; owner: fkit-coder)* | [`0001-add-backlog-board-default-for-unsprinted-task-briefs`](../../tasks/done/0001-add-backlog-board-default-for-unsprinted-task-briefs/brief.md) |
| ✅ Done | P68 | Report the Backlog board in `/fkit-status` on request only *(`Backlog` as a target-selector argument — conforms to one-skill-one-output; owner: fkit-coder)* | [`0080-report-backlog-board-in-fkit-status-on-request-only`](../../tasks/done/0080-report-backlog-board-in-fkit-status-on-request-only/brief.md) |
| ✅ Done | P69 | Wiki sync after the Backlog board introduction *(needs 67 and 68 — hard; owner: fkit-wiki)* | [`0093-wiki-sync-backlog-board-introduction`](../../tasks/done/0093-wiki-sync-backlog-board-introduction/brief.md) |
| ✅ Done | P70 | Add the `/fkit-open-questions-interview` skill for the six Claude-side roles *(session-history sweep, interview-only, zero write surface; consult degrade per ADR-021; adversarial reviewer excluded per ADR-022; owner: fkit-coder)* | [`0008-add-open-questions-interview-skill-for-six-roles`](../../tasks/done/0008-add-open-questions-interview-skill-for-six-roles/brief.md) |
| ✅ Done | P71 | Wiki sync after the `/fkit-open-questions-interview` skill lands *(needs 70 — hard; owner: fkit-wiki)* | [`0097-wiki-sync-open-questions-interview-skill`](../../tasks/done/0097-wiki-sync-open-questions-interview-skill/brief.md) |
| ✅ Done | P72 | Add the `/fkit-dumb-down` skill for the six Claude-side roles *(on-demand re-explain, content-preserving, zero write surface; complementary to task 62 — owner ruled BOTH; adversarial reviewer excluded per ADR-022; owner: fkit-coder)* | [`0003-add-dumb-down-skill-for-six-roles`](../../tasks/done/0003-add-dumb-down-skill-for-six-roles/brief.md) |
| ✅ Done | P73 | Wiki sync after the `/fkit-dumb-down` skill lands *(needs 72 — hard; owner: fkit-wiki)* | [`0094-wiki-sync-dumb-down-skill`](../../tasks/done/0094-wiki-sync-dumb-down-skill/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P74 | Design the task-folder structure and the global task-ID scheme *(design — [spec](../../knowledge-base/reports/2026-07-19-design-task-folder-structure-and-id-scheme.md), [ADR-029](../../knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md) **accepted**; gates 75–78; owner: fkit-architect)* | [`0030-design-task-folder-structure-and-id-scheme`](../../tasks/done/0030-design-task-folder-structure-and-id-scheme/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P75 | Add an `## ID` field to every brief and write down the allocation procedure *(**no registry file** — owner ruled 2026-07-19; **corpus pinned to a commit SHA**; no file moves — reversible by design; needs 74 — hard; owner: fkit-coder)* | [`0017-assign-global-task-ids-and-create-registry`](../../tasks/done/0017-assign-global-task-ids-and-create-registry/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P76 | Migrate every task into a folder, absorb `plans/` + `worklogs/` + `reviews/`, and update the tooling *(**atomic — the point of no return**; needs 75 — hard; review strongly recommended; owner: fkit-coder)* | [`0062-migrate-tasks-to-folder-structure-and-update-tooling`](../../tasks/done/0062-migrate-tasks-to-folder-structure-and-update-tooling/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P77 | Repair the task links in `reviews/`, `knowledge-base/` and brief↔brief *(**covers pre-existing rot too — ~1/3 already broken before the migration**; **⚠️ its baseline-capture step must run BEFORE 76**, everything else after; sprint-keyed ledgers move to `sprints/reviews/` per design §5.2b; needs 76 — hard; parallel with 78; owner: fkit-coder)* | [`0079-repair-task-links-outside-the-wiki-after-migration`](../../tasks/done/0079-repair-task-links-outside-the-wiki-after-migration/brief.md) |
| ✅ Done | P78 | Wiki sync after the task-folder migration *(~96 vault refs + structural re-description; **batches the six queued syncs 45/51/66/69/71/73**; needs 76 — hard; parallel with 77; owner: fkit-wiki)* | [`0099-wiki-sync-task-folder-migration`](../../tasks/done/0099-wiki-sync-task-folder-migration/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P79 | Compress the Output style section of `universal-rules.md` *(reclaims 549 B; block 3557→3008 B against a launch-blocking 4096 cap; **review pass required** — R3 precedent; sequenced **before** the not-yet-filed ADR-030 prose addition, same file; owner: fkit-coder)* | [`0022-compress-universal-rules-output-style-section`](../../tasks/done/0022-compress-universal-rules-output-style-section/brief.md) |
| ✅ Done | P80 | Repair the stale `adr-029-stop-hook` links in the wiki vault *(**page rename + 11 files' inbound links** — the vault page itself sat at the old slug, so links resolved silently to the wrong ADR — target is now [ADR-030](../../knowledge-base/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md); **owner pulled it forward out of task 78** — depends on nothing, does not wait for the migration; **in flight at filing time**; owner: fkit-wiki)* | [`0078-repair-stale-adr-029-stop-hook-links-in-the-vault`](../../tasks/done/0078-repair-stale-adr-029-stop-hook-links-in-the-vault/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P81 | Extend the task movers' reference sweep to `knowledge-base/` *(shipped defect — both movers grep `sprints/` + `tasks/` only, so ADR/report back-links rot on every close; same class as 21/22; **`fkit-task-cancelled` has the gap twice**; recommend landing before 76; owner: fkit-coder)* — **Part B**: next-ADR-number derivation looks in too few places *(2026-07-19 collision)* — **Part C** *(added 2026-07-19)*: `/fkit-wiki-lint` cross-checks vault ADR number vs knowledge-base slug, since a reused number stays resolvable and is invisible to a link check; **Part C ownership settled 2026-07-19 — fkit-coder, task does not split; the wiki's exclusivity is over the vault, not over its own skill source** — **Part D** *(absorbed from 82)*: `claude/fkit-claude-init.sh:847` hard-codes *"Seven roles"*; it is executable source so the architect may not edit it; **⚠️ ADR-028 is decided-not-built — do not blindly substitute Eight**; all four parts fkit-coder | [`0036-extend-mover-reference-sweep-to-the-knowledge-base`](../../tasks/done/0036-extend-mover-reference-sweep-to-the-knowledge-base/brief.md) |
| ✅ Done | P82 | Refresh `architecture.md` for ADRs 026–030 and the eighth role *(**`architecture.md:4` and `:82` say seven roles; ADR-028 added an eighth — the canonical doc is factually wrong about the team's shape**; **5 doc sites in 4 files** — `architecture.md:4,82`, `CLAUDE.md:7`, `AGENTS.md:7`, `README.md:76`, `claude/README.md:3` — **enumerated by [ADR-028](../../knowledge-base/decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md):154-169, which says do not re-derive the list**; also adds a **dated ADR-023→028 pointer** (**ADR-023 is NOT superseded — only its count claim is overtaken**); `PROJECT.md:8,72` moved to **task 83** per ADR-028:154 (the product brief is not the architect's); `claude/fkit-claude-init.sh:847` is executable source, **task 81 Part D**; `wiki-vault/index.md:11` + `wiki/systems/fkit.md:7,15` are **fkit-wiki's resync, flag don't fix**; cites only up to ADR-025, so 026–030 absent plus the 023/024 tombstones; ADR-028/029/030 are **decided but not built** and must not be described as existing structure; historical "seven" in ADRs/reports/closed rows **must stay**; precedent task 58; owner: fkit-architect)* | [`0067-refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role`](../../tasks/done/0067-refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role/brief.md) |
| ✅ Done | P83 | Amend the product brief for the eighth role — `PROJECT.md:8,72` *(split from 82 per **ADR-028:154** — the brief is the product document, not the architect's; **`:72`'s "not breadth" clause is a product constraint ADR-028 knowingly reverses, so this is a stance restatement, not a count fix**; ADR-028 is **decided-not-built** so the brief must not promise a role that does not exist; **⚠️ needs owner sign-off on the stance wording**; owner: fkit-producer)* | [`0015-amend-project-brief-for-the-eighth-role`](../../tasks/done/0015-amend-project-brief-for-the-eighth-role/brief.md) |
| ✅ Done | P84 | Wiki resync for the eighth role — after the source docs land *(**⚠️ filed under a false premise, corrected in the brief: the vault is NOT stale** — `index.md:11` and `systems/fkit.md:9,17` already carry an accurate decided-not-built note; ADR-028:165 named them stale and the wiki fixed them afterwards. **The real work is the mirror image** — `fkit.md:9` tracks *which source docs still assert seven*, and that tracking claim expires when 82/83/81-D land; **depends on 82 + 83 + 81 Part D**, precedent task 11 / `sprint-2.md:209`; **not folded into 78**; decided-not-built framing must survive; owner: fkit-wiki)* | [`0092-wiki-resync-eighth-role-after-source-docs-land`](../../tasks/done/0092-wiki-resync-eighth-role-after-source-docs-land/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P85 | Assert task IDs are unique in the test suite — the ADR-029 duplicate-ID guard *(**⚠️ priority 85 is append rank, NOT run order — this must land BEFORE 76**, owner-ruled 2026-07-20; ADR-029 Decision 3's **sole** named mitigation for the accepted cross-branch race, and it was never built — task 75 review finding R3; scope is the duplicate-ID assertion **only** — the other two design §10 assertions are in 76; the guard must discover briefs in **both** the flat and folder shapes so 76 cannot silently blind it; owner: fkit-coder)* | [`0101-assert-task-ids-are-unique-in-the-test-suite`](../../tasks/done/0101-assert-task-ids-are-unique-in-the-test-suite/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P86 | Add a structured `## Owner` field to the brief schema and the task-brief skill *(owner ruled a structured field, not a prose scrape; defines the field + populates new briefs; blocks 87/88; owner: fkit-coder)* | [`0104-add-owner-field-to-brief-schema-and-task-brief-skill`](../../tasks/done/0104-add-owner-field-to-brief-schema-and-task-brief-skill/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P87 | Backfill the `## Owner` field into all ~103 existing briefs *(**~25 have no recoverable owner — owner-assigned, never guessed**; needs 86 — hard; blocks 88; owner: fkit-coder)* | [`0105-backfill-owner-field-into-existing-briefs`](../../tasks/done/0105-backfill-owner-field-into-existing-briefs/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P88 | Render the Owner column in `/fkit-status`, between Filename and Next step *(the feature the owner asked for; `dashboard.sh` + `SKILL.md` contract + test; needs 86 + 87 — hard; owner: fkit-coder)* | [`0106-render-owner-column-in-fkit-status`](../../tasks/done/0106-render-owner-column-in-fkit-status/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P89 | Make a task's `## Notes`-prose dependency visible to `dashboard.sh` *(the task-84 misreport, 7 status runs; parse-Notes vs enforce-row is the coder's design call; owner: fkit-coder)* | [`0107-teach-dashboard-to-resolve-notes-dependencies`](../../tasks/done/0107-teach-dashboard-to-resolve-notes-dependencies/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P90 | Investigate making fkit-wiki task completion visible to the board *(investigation — task 80 stuck `In progress` a week; `log.md` is an unread status source; owner overrode the report's recommendation → the movers become producer-only, [ADR-033](../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md); report: [`2026-07-23-eval-wiki-task-completion-visible-to-the-board`](../../knowledge-base/reports/2026-07-23-eval-wiki-task-completion-visible-to-the-board.md); owner: fkit-architect)* | [`0108-investigate-making-wiki-task-completion-visible-to-the-board`](../../tasks/done/0108-investigate-making-wiki-task-completion-visible-to-the-board/brief.md) |
| ✅ Done | P91 | Design fkit-lead as the orchestrating front door + the `fkit-sprint-ship-loop` skill *(design/feasibility only — owner ruled evolve `fkit-lead` into the single-point-of-interaction doer, relay owner decisions live, design-first; reverses ADR-010 non-doer, collides with ADR-021/024, `task-ship-loop` is session-only; blocks the follow-on implementation tasks; owner: fkit-architect)* | [`0109-design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop`](../../tasks/done/0109-design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P92 | Evolve `fkit-lead` into the orchestrating conductor — reverse the non-doer stance, add conductor remit + driver discipline, keep routing *(agent-def edit; T2 of design §11; depends on ADR-031/032 which are Done; owner: fkit-coder)* | [`0110-evolve-fkit-lead-into-orchestrating-conductor`](../../tasks/done/0110-evolve-fkit-lead-into-orchestrating-conductor/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P93 | Build the `fkit-sprint-ship-loop` skill — the lead's sprint-scope conductor loop *(the substantive build, design §5; **must carry the plan-gate honesty clause as prose, not a false structural guarantee**; needs 92; owner: fkit-coder)* | [`0111-build-fkit-sprint-ship-loop-skill`](../../tasks/done/0111-build-fkit-sprint-ship-loop-skill/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P94 | Wire `fkit-sprint-ship-loop` into `skills_for_role()` + the FOUR mirrors in the same commit *(`skills-for-role.sh:37` + 4 mirrors per the `:12-24` checklist that has shipped false docs before; needs 93; owner: fkit-coder)* | [`0112-wire-lead-sprint-ship-loop-skill-ownership-and-mirrors`](../../tasks/done/0112-wire-lead-sprint-ship-loop-skill-ownership-and-mirrors/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P95 | Update the launcher menu/help text — "does no work itself" → accurate to a conductor *(text only, no control-flow change per design §4.4; needs 92; owner: fkit-coder)* | [`0113-update-launcher-menu-help-for-conductor`](../../tasks/done/0113-update-launcher-menu-help-for-conductor/brief.md) |
| ✅ Done | P96 | Amend PROJECT.md for the evolved `fkit-lead` conductor *(product-brief half of design §11 T6; owner-signed-off stance wording; needs 92 + 94; owner: fkit-producer)* | [`0114-amend-project-brief-for-lead-conductor`](../../tasks/done/0114-amend-project-brief-for-lead-conductor/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P97 | Refresh architecture.md for the lead conductor + fix the stale §5.2 lock description *(architecture half of T6 **plus** the independent §5.2 `skillOverrides`→ADR-018-hook stale-lock fix, design §1.1; coordinates with 94 on the same file; needs 92 + 94; owner: fkit-architect)* | [`0115-refresh-architecture-doc-for-lead-conductor-and-stale-lock`](../../tasks/done/0115-refresh-architecture-doc-for-lead-conductor-and-stale-lock/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P98 | Add `fkit-sprint-ship-loop` to the ADR-030 Stop-hook skip set *(one skip-list entry + test; owner: fkit-coder)* | [`0116-add-sprint-ship-loop-to-stop-hook-skip-set`](../../tasks/done/0116-add-sprint-ship-loop-to-stop-hook-skip-set/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P99 | Wiki ingest — ADR-031/032, the design report, and the evolved lead role *(vault write — fkit-wiki only; needs T1 (Done) + 92; owner: fkit-wiki)* | [`0117-wiki-ingest-lead-conductor-and-adrs-031-032`](../../tasks/done/0117-wiki-ingest-lead-conductor-and-adrs-031-032/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P100 | Record the ADR-032 sprint-ship-loop autonomy amendment — Build carve-out + Process-review autonomy (option b) + accepted cost + do-not-re-raise guard *(**reassigned 2026-07-25 — owner ruled it stalled**; was parked as "owner is writing it himself", verified never written, blocked 99 for three days unnoticed; the four 2026-07-22 decisions are settled and not reopened; owner: fkit-architect)* | [`0118-record-adr-032-sprint-ship-loop-autonomy-amendment`](../../tasks/done/0118-record-adr-032-sprint-ship-loop-autonomy-amendment/brief.md) |
| ✅ Done | P101 | Track the `fkit-coder` declared-approval carve-out — the guarantee-surface change 0111 folded in *(**already implemented and committed — done-pending-review, not re-do**; **corrected 2026-07-26**, this cell and the brief previously said "in the working tree (uncommitted)" — false: the carve-out is in `a89c917`, and **both commits touching the file were authored by the owner, so no agent breached the no-commit rule**; the architect asked it get its own reviewable record; needs 93 + 100; **recommend owner-verify, not agent-close**; owner: fkit-coder)* | [`0119-track-fkit-coder-declared-approval-carve-out`](../../tasks/done/0119-track-fkit-coder-declared-approval-carve-out/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P102 | Fix the `fkit-sprint-ship-loop` SKILL.md owner-banner format *(cosmetic; bare `# ⛔ Owner:` H1 → sibling-style title; no ADR-018-hook impact; independent; owner: fkit-coder)* | [`0120-fix-sprint-ship-loop-skill-owner-banner-format`](../../tasks/done/0120-fix-sprint-ship-loop-skill-owner-banner-format/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P103 | Decide whether to drop the numeric prefix from task-folder names *(investigation — **weighs against ADR-029 Decision 5 + the task-76 migration**; the two-numbers confusion, folder-ID `0109` vs sprint priority `91`; blocks 104; owner: fkit-architect. **Deliverable: [decision report](../../knowledge-base/reports/2026-07-26-decide-task-folder-name-numeric-prefix.md)** — owner ruled **Option C**: keep the prefix, fix the priority side; 104 rescoped, not cancelled)* | [`0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names`](../../tasks/done/0102-decide-whether-to-drop-the-numeric-prefix-from-task-folder-names/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P104 | Implement the task-folder-name scheme change from the approved design *(**RESCOPED 2026-07-26, NOT a cancellation candidate** — 103 ruled **Option C**, owner-approved: keep the prefix, fix the priority side. Scope = folder ID primary in `dashboard.sh` + priority cell renders `P<n>` + Option D label normalisation (owner-ruled complement) + the convention page. **No folder renames, no href rewrites, no wiki churn** — ~1/10 the old blast radius. Spec = [decision report §8](../../knowledge-base/reports/2026-07-26-decide-task-folder-name-numeric-prefix.md); dep on 103 satisfied; owner: fkit-coder)* | [`0103-implement-task-folder-name-scheme-change`](../../tasks/done/0103-implement-task-folder-name-scheme-change/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P105 | Rewrite `fkit-task-ship-loop` step 9 — coder self-close → route close to producer *(ADR-033 §3 ripple, amends ADR-019; ships **before** 0124; owner: fkit-coder)* | [`0122-route-coder-ship-loop-close-to-producer`](../../tasks/done/0122-route-coder-ship-loop-close-to-producer/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P106 | Rewrite `fkit-sprint-ship-loop` close step — driver self-close → spawn producer to close *(ADR-033 §4 ripple, amends ADR-032; revises 0111's as-first-written close; ships **before** 0124; owner: fkit-coder)* | [`0123-route-sprint-ship-loop-close-to-producer`](../../tasks/done/0123-route-sprint-ship-loop-close-to-producer/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P107 | Revert the task movers to producer-only — `skills-for-role.sh` + 4 mirrors + hook test + mover SKILL prose *(ADR-033 §1 structural core; owner: fkit-coder)* | [`0124-revert-task-movers-to-producer-only`](../../tasks/done/0124-revert-task-movers-to-producer-only/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P108 | Wiki flag-don't-close convention — 3 wiki SKILLs end by flagging "task N ready to close" *(ADR-033 §2 / task 0108's operative fix; recommend co-landing with 107; owner: fkit-coder)* | [`0125-wiki-skills-flag-ready-to-close`](../../tasks/done/0125-wiki-skills-flag-ready-to-close/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P109 | Wiki resync for ADR-033 — ingest the ADR + resync vault pages asserting the ADR-025 "any role may close" rule *(needs 107 — hard; owner: fkit-wiki)* | [`0126-wiki-resync-for-adr-033`](../../tasks/done/0126-wiki-resync-for-adr-033/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P110 | Build the ADR-030 `Stop` hook — turn-completion contract enforcement *(Path 2 marker; owner live-verified check B end-to-end; R8 over-skip residual accepted → fix in 0129; owner: fkit-coder)* | [`0127-build-adr-030-stop-hook`](../../tasks/done/0127-build-adr-030-stop-hook/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P111 | Give the fkit ship-loop(s) a transcript-independent skip signal for the ADR-030 Stop hook *(`UserPromptExpansion` marker replaces the transcript scan; fixes R8 over-skip + R6 under-skip for both loops; owner: fkit-coder)* | [`0129-transcript-independent-ship-loop-skip-signal`](../../tasks/done/0129-transcript-independent-ship-loop-skip-signal/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P112 | Add the ADR-030 prose half to the universal rules block — "What's next?" + ask-interactively *(ADR-030 Decision 8; two clauses added to `universal-rules.md`; block at 91% → follow-up 0130; owner: fkit-coder)* | [`0128-add-adr-030-prose-half-to-universal-rules`](../../tasks/done/0128-add-adr-030-prose-half-to-universal-rules/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P113 | Reclaim universal-rules-block budget headroom — compression pass **or** a signed `RULES_MAX` bump *(owner signed **option (a) tier a3** 2026-08-01 — compression pass, no `RULES_MAX` bump, cap stays 4096; emitted block 3717 B → **3570 B**, net −147 B, **526 B headroom** at 87% of cap, 219 B clear of the 92% warning gate; new standing target **≥400 B headroom**; owner: fkit-coder)* | [`0130-reclaim-rules-block-budget-headroom`](../../tasks/done/0130-reclaim-rules-block-budget-headroom/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P114 | Convert every skill `description:` to a `>-` block scalar, then add a frontmatter-parse guard test *(0123 R4/R5; **all 25 skills use plain scalars, 3 are invalid strict YAML**; a broken frontmatter fails **silently** — the listing falls back to the H1 and no test reads any `SKILL.md`; convert-then-guard is one unit, order binding; ADR-014 zero devDeps ⇒ hand-rolled reader; independent; **all 25 converted, render byte-identical, verified 3 independent ways**; `npm test` 551 pass / 0 fail, `prove-red.sh` mutations 1–9 red incl. the 2 new ones deliberately disarmed to prove the gate live; 6 review findings all fixed, Codex coverage COMPLETE; **⚠️ brief verification step 5 — the live-loader eyeball — is OUTSTANDING, NOT passed**: no session that made the edits could see the post-change render and no test parses `SKILL.md` the way the loader does, owner ruled ship-anyway 2026-08-01, discharge by comparing a fresh session's injected listing against the 25 folded descriptions; owner: fkit-coder)* | [`0136-convert-skill-descriptions-to-block-scalars-and-guard`](../../tasks/done/0136-convert-skill-descriptions-to-block-scalars-and-guard/brief.md) |
| ✅ Done | P115 | Reorder the `fkit` launcher menu so lead is option 1, and rename its label to "lead" *(owner ruling 2026-07-25; menu block + case arms + `--help` + init.sh role list; **word aliases `team`/`team room` are kept**; **accepted cost — every other role shifts down one and a mis-pick is silent**; independent; owner: fkit-coder)* | [`0139-reorder-launcher-menu-lead-first-and-rename-label`](../../tasks/done/0139-reorder-launcher-menu-lead-first-and-rename-label/brief.md) |
| ✅ Done | P116 | Retire "team room" in the docs and agent definitions, and fix the stale "menu 7" citations *(**two kinds of edit — a rename, and a correctness fix**: 3 live files say "menu option 7" and become FALSE when 115 lands, incl. `fkit-lead.md`, a **system prompt**; ADR-010 + 2 dated reports deliberately OUT of scope; soft-depends 115 — ship together; owner: fkit-coder)* | [`0140-retire-team-room-in-docs-and-agent-definitions`](../../tasks/done/0140-retire-team-room-in-docs-and-agent-definitions/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P117 | The wiki completion flag must carry the task's **folder ID** and the **brief path** — `Task N` is undefined *(0125 follow-up, **found by the role that consumes the flag**; `N` is never defined and the two number-spaces collide on a **live specimen** — 0125 is rank **P108** and folder `0108` is a real task, the very investigation 0125 implements; the flag is the one line carried **verbatim** and carries **no path**, though the scan step already read `backlog/*/brief.md`; a wrong resolution points `/fkit-task-done` at the wrong task; cites `conventions/priority-is-rank-not-identity.md`; **land before 0154**; owner: fkit-coder)* | [`0153-wiki-flag-carries-folder-id-and-brief-path`](../../tasks/done/0153-wiki-flag-carries-folder-id-and-brief-path/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P118 | Wiki resync for the lead rename and menu reorder *(vault write — **fkit-wiki only**; 2 pages assert the retired facts; also carries a **stale claim of substance** — `systems/fkit.md:28` still says the lead "does no work", which ADR-031 reversed; overlaps task 99 (0117) — check its state first; needs 115 + 116 — hard; owner: fkit-wiki)* | [`0141-wiki-resync-for-the-lead-rename-and-menu-reorder`](../../tasks/done/0141-wiki-resync-for-the-lead-rename-and-menu-reorder/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P119 | Decide how an owner records a merit ordering that board rank can no longer carry *(**follow-up 6 of `0160`'s decision report** — case 5, **RULED OUT OF CLASS by name and handed back** as its own task (§6): *"a rule-consequence question, not a stale-coordinate question … no anchor form answers it"*, on three grounds — **nothing in it is stale**, **no citation is misdirected**, and **the remedy spaces do not overlap** (cases 1–4 ask *"what should I write instead?"*, this asks *"how does the owner express an ordering intent rank can no longer carry?"*); the report records this as **agreeing with the recording producer's on-record dissent** — *"the dissent was right on the merits"*; **the defect**: `/fkit-task-brief` step 5 forbids inserting, so a row can only be re-ranked **within its own open segment**, and closed rows are walls — as the board closes out, segments fragment and rows become **unreachable**, their merit position no longer expressible as a rank at all; **evidence, measured 2026-08-01**: board **83% closed**, and **unreachable open rows went 11 of 24 → 17 of 25 in two days** — mechanism confirmed and **worsening**; **⚠️ the report's own headline proof case HAS ALREADY EXPIRED** — `0160`'s brief named `0161` as *"a singleton that can never move at all … the proof, generated by the close that found it"*, and **`0161` closed**, leaving `0143` as the only singleton — *"a finding whose headline proof case expires in two days while its underlying mechanism gets worse needs its own task with its own live measurement"*; **⚠️ and that measurement is ALREADY STALE — filing this task moved the board it describes**: this row's insertion renumbered every rank from the old P119 through the old P148 **up by one**, and six new open rows were added the same day, so **every rank in the report's segment list is a PRE-RENUMBERING rank — RE-MEASURE, do not inherit**, and cite tasks by folder ID never by rank; **report-only — an investigation and a ruling, no implementation, files no briefs**; must **rule the candidate mechanisms in or out BY NAME**, say whether step 5's wall clause stands (it is *"operable and correctly reasoned"* — the question is whether its consequence is acceptable), answer enforcement with a file+condition or the literal words *"nothing can enforce this"* (§7/§7.3 today say the latter: *"there is nothing to assert"*), and **reckon with its own filing as a data point** — it was inserted by explicit owner ruling, an act the standing rule forbids by default; ⛔ case 1 hard out of scope (0157/0159, both closed), ⛔ re-rank nothing, ⛔ write no `:NNN` citations; **🔒 RANK P119 IS AN OWNER RULING, NOT AN APPEND, AND NOT PRODUCER PRECEDENT** — ✅ owner-ruled 2026-08-01 (report §11 OQ3, `AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session): *"the owner ranks it explicitly at filing"*, placement directed to the **P115–P120 band**, exact position left to the producer, **because appending would land it near P149 inside the bottom segment where it could never be promoted past the closed P140 row — making the filing an instance of the very defect it exists to fix**; **producer's merit reason for P119 specifically**: P115–P118 are all `✅ Done`, so **P119 is the highest rank in the band not behind a closed row** — head of the earliest *reachable* open segment, and **no closed row was renumbered**; **⚠️ the insertion renumbered ranks — expected and authorized for THIS ROW ONLY; no task identity changed**, identity being the folder-name `NNNN` prefix and nothing else per `conventions/priority-is-rank-not-identity.md`; owner: fkit-architect)* | [`0174-decide-how-an-owner-records-a-merit-ordering-board-rank-cannot-carry`](../../tasks/done/0174-decide-how-an-owner-records-a-merit-ordering-board-rank-cannot-carry/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P120 | Reconcile the dual-homed file drift — byte-align live `ai-agents/` vs `claude/scaffold/ai-agents/` *(**pulled from the Backlog board 2026-07-25 by owner ruling**; ADR-027 §2 follow-up, never filed for six days; `dependency-declaration-form.md` is missing from the scaffold — consuming projects inherit the **task-84 misreport class**; the exception list is the real deliverable; blocks 119; owner: fkit-coder — **⚠️ the sweep DISPROVED ADR-027's core premise**: five of the six "drifted" scaffold files are **not** stale copies but deliberate **audience-adapted** rewrites, and byte-aligning them would ship fkit's own incident narrative and **4 verified-broken relative links** into every consuming project; **owner ruled 2026-08-01, Option B** — audience-adapted is a legitimate **third kind**, byte-aligning live → scaffold **rejected as a product regression**, and `dependency-declaration-form.md` ships **GENERALIZED, not byte-identical**; **⚠️ brief verification step 2 is SUPERSEDED BY OWNER RULING, NOT MET — do not "fix" it by copying the live file over the scaffold copy**; deliverable `test/dual-home-parity-exceptions.mjs`, **26 entries, each with its own reason**, classifier maps **456/456** `diff -rq` lines, **0 unmatched, 0 dead**; **ADR-027 is NOT amended** — filed as `0186` (architect); `decisions/` and `reports/` are **outside** the dual-homed surface, so **no ADR is ever a drift event**; `0130` created no drift; `0178`'s contested page resolves in its favour, its brief untouched; `551 pass / 0 fail / 17 suites`, `prove-red.sh` PASSED, **no existing test file modified**; review **Codex coverage FULL** (`codex-cli 0.145.0`), 6 defects verified CORRECT, 5 fixed; **⚠️ OUTSTANDING — R1 HANDED TO `0133`, WHICH IS THE NEXT ELIGIBLE TASK AND HARD-DEPENDS ON THIS ONE**: the 10 directory exception entries match **bidirectionally**, so a real dual-homed file later added under one would **silently escape `0133`'s enforcement** — **`0133` must assert that no directory exception covers a non-`.gitkeep` file present in BOTH homes**, with the `.gitkeep` carve-out **required, not cosmetic** (9 such files sit in both homes today); named near-miss `knowledge-base/reports/README.md`; **`/fkit-task-brief` scoping enforcement still pending**, untouched here)* | [`0132-reconcile-dual-homed-file-drift-live-vs-scaffold`](../../tasks/done/0132-reconcile-dual-homed-file-drift-live-vs-scaffold/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P121 | Build `test/dual-home-parity.test.js` *(**pulled from the Backlog board 2026-07-25 by owner ruling**; needed 118 — ADR-027 §3 made the order binding; owner: fkit-coder — **`test/dual-home-parity.test.js` exists and is green**, the test ADR-027 §Decision 2 called for on 2026-07-19 and **never filed as a brief**; **zero devDeps** (ADR-014) — `package.json` unchanged, no `devDependencies`, no `node_modules`; `test/prove-red.sh` gained step **`0h`** and **mutations 10–13**; `conventions/dual-home-parity.md` no longer claims the test is unbuilt; **it iterates the UNION of both trees** — a scaffold-first loop would **not** have caught the `dependency-declaration-form.md` case `0132` found; the enforced set is **derived, not hard-coded**: exactly **four** files today — `conventions/priority-is-rank-not-identity.md` (4389 B), `conventions/task-owner-vocabulary.md` (3227 B), `tasks/README.md` (5611 B), `wiki-vault/schema.md` (3608 B) — all byte-identical, re-derived independently by the reviewer, which confirms the suite is **green because the tree is clean, not because the walk found nothing**; **⚠️ built against the owner's Option B ruling, NOT against ADR-027's current text** — §Decision 2 still mandates byte-aligning on disk and the owner overruled it, `0186` will amend the ADR; stated in the test's header comment; verification `npm test` → **560 pass / 0 fail / 17 suites**, `bash test/prove-red.sh` → `0a`–`0h` green, **mutations 1–13 all red at their named assertions**, `✓ hard gate PASSED`, exit 0; **all seven** brief verification steps graded **PASS** by the reviewer; **review ran TWO ROUNDS** — R1 found 7 defects, none blocking; **round 2 was convened at the coder's own request** because R1's fix rewrote the tripwire (the compensating control justifying the pruned walk), found 4 more, none blocking, and judged the **R1 rewrite SOUND with no third regression**; **Codex coverage FULL on BOTH rounds** (`codex-cli 0.145.0`, exit 0 each time); ledger **CLOSED 2026-08-02, final verdict ✅ approved**; **the disarm discipline is the strongest evidence here and it caught real defects** — every mutation's no-op guard was deliberately broken to prove it fires, by the coder then independently by the reviewer across six variants, and **guard 12 FAILED that test on the first attempt** (`>>` creates a missing file, so a renamed target silently became a different mutation) and was strengthened; the coder also disclosed **two regressions it introduced inside the fix round** and **one harness error of its own** that made two guards look dead when they were not; **⚠️ OPEN PRODUCER ITEM — `0112`'s re-verification is NOT APPLICABLE and can NEVER be discharged by this mechanism**: the intersection between `0112`'s write surface and the parity surface is **empty**, verified row by row by coder and reviewer — `claude/skills-for-role.sh`, `claude/skills/fkit-team/SKILL.md`, `claude/README.md`, `claude/scaffold/CLAUDE.md` are outside both homes and `knowledge-base/architecture.md` is live-only and exempt by decision — and because `0112`'s surface lives under `claude/` it will **never** intersect; **reporting "pass" would have laundered an unrunnable step into a runnable-looking green**; a **substitute check** (grep `lead` ↔ `sprint-ship-loop` across the source of truth and its four mirrors) **PASSES 5/5**, so `0112`'s substance is intact and only its verification wording was phantom — **this does NOT retire the owner's accepted risk**, filed as `0187`; **accepted residuals**: **R3** a symlinked excepted directory escapes both controls **silently green** (`isDirectory()` is false for a symlink-to-directory, so it is skipped by the walk *and* never added to `prunePoints`) — measured mitigant **zero symlinks in either home today**, re-raise if one ever appears under `ai-agents/` or `claude/scaffold/ai-agents/`; **R4** `readdirSync` errors swallowed at every depth — safe at the root (verified), but mid-tree the same subdirectory unreadable in **both** homes silently shrinks the enforced set while non-vacuity still passes, re-raise if the enforced set ever shrinks without an explanatory change; **R6** `firstDifference` column off by one inside a multibyte UTF-8 sequence — recorded as an **accepted defect, not a defensible tradeoff**, it must not be re-argued as though the behavior were right; **R11** mutation 13's false-accusation text still prints **after** the no-op guard rather than instead of it, and **the two reviewers DISAGREED on severity — Codex said medium, the reviewer said LOW, the owner took LOW** (dissent recorded, not just the verdict), accepted because the correct diagnosis prints **first** and ends *"the result below proves nothing"*, the gate exits 1 either way, and all 13 mutations share the annotate-don't-abort shape so changing it is a frontier-move on `prove-red.sh`'s design; **`architecture.md`'s "eight contract files" claim is stale — 14 before this task, 15 after**, pre-existing and deliberately not fixed (`0115` owns that surface), worth a producer scoping decision)* | [`0133-build-dual-home-parity-test`](../../tasks/done/0133-build-dual-home-parity-test/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P122 | Investigate the skill-ownership fact-inventory gap — the mirror checklist does not see every site *(**investigation, not implementation** — fix shape unknown; the `skills-for-role.sh:12-24` checklist has failed **twice** (0036, then 0124's three missed sites); the missed sites are **system prompts + the universal rules block**, which outrank a SKILL in an agent's own context; coordinates with 0137; independent; owner: fkit-architect)* | [`0142-investigate-the-skill-ownership-fact-inventory-gap`](../../tasks/done/0142-investigate-the-skill-ownership-fact-inventory-gap/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P123 | Decide whether a spawn-time instruction may override a rule in the skill the spawned worker is running *(**investigation + ruling, fix shape unknown** — not implementation; a worker **cited step 5's rule, then followed the spawn prompt instead, and recorded that it did** (`sprint-2.md:245-249`); the instruction is **not in `fkit-sprint-ship-loop`** — it is ad-hoc spawn-prompt text from the live lead session, which is what makes it invisible to review; surface is **every spawned worker of every role**, not priorities; `universal-rules.md` carries fkit's only precedence vocabulary (hard rule vs preference) and **skill rules are classified as neither**; ADR-010/012/018 govern *which* skill may be invoked, never whether a rule *inside* one binds — a different axis; must face the *"a launching agent's messages direct your work"* tension by name; **a one-paragraph ruling is a legitimate outcome** — the point is a producer must not make the call; coordinates with 0142 (P121), adjacency not dependency; independent; owner: fkit-architect)* | [`0158-decide-whether-a-spawn-instruction-may-override-a-skill-rule`](../../tasks/done/0158-decide-whether-a-spawn-instruction-may-override-a-skill-rule/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P124 | Correct `CLAUDE.md`'s stale `skills_for_role()` location *(**`CLAUDE.md` is injected into every fkit session**, so every role in every session is currently told the wrong file; `:43` says the function is declared in `claude/fkit-claude.sh` — it **moved to `claude/skills-for-role.sh`** under task 43 / ADR-018 and `fkit-claude.sh:257` merely sources it; **one-hop misdirection, not a wrong edit** — `fkit-claude.sh:253-254` documents the move right above the source line; **the only live stale site** — `claude/README.md:41` and `architecture.md:154` are already correct, and ADRs are dated records, out of scope; the line sits **outside** the generated rules block, so a normal one-line edit; **plausible live specimen for 0142** (120) and pointered there; owner: fkit-coder)* | [`0151-correct-claude-mds-stale-skills-for-role-location`](../../tasks/done/0151-correct-claude-mds-stale-skills-for-role-location/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P125 | Append a dated correction note to ADR-010 for the menu reorder *(owner ruled 2026-07-25 — **note, not a rewrite**; ADR-010:26's "menu option 7" + "team room" go stale when 115/116 land, and its "routes rather than does" was already reversed by ADR-031; **establishes the form**, this being the first; ADR stays `accepted`; soft-needs 115 + 116; owner: fkit-architect)* | [`0143-append-a-dated-correction-note-to-adr-010`](../../tasks/done/0143-append-a-dated-correction-note-to-adr-010/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P126 | Implement ADR-032 A2's worklog audit obligation in the sprint-ship-loop *(**the amendment requires it; nothing implements it** — `fkit-sprint-ship-loop/SKILL.md:105` asks the Process-review worker only for "change surface + residuals" and `fkit-coder.md:73-82` imposes no worklog duty; **consequence: ADR-032 A4 bullet 2's reopening condition is unsatisfiable in practice** — the guard points at evidence nothing requires anyone to write; adds an **obligation, not a permission**; owner-ruled 2026-07-26; **land with 0150 (124) in ONE `fkit-coder` session — different clauses of the same file**; owner: fkit-coder)* | [`0147-implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop`](../../tasks/done/0147-implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P127 | Add the missing **verbatim** to `fkit-coder.md`'s declared-approval marker, condition (b) *(0119 review **R1**, medium, raised **independently by both reviewers**; `fkit-coder.md:65-66` says the marker carries *"a concrete **approved plan**"* while ADR-032 **A1** `:97` and the driver `SKILL.md:109` both require it **verbatim** — a paraphrased plan satisfies the worker-side check, so the worker's **scope boundary** can silently become the driver's summary; **medium not high**: the driver's own verbatim rule must fail first, so this is a **missing second line of defence, not the primary control**; one-word prose fix on a **guarantee surface**, owner-ruled 2026-07-26 to be tracked rather than slipped in; **promoted 128 → 124 by owner ruling 2026-07-26, now adjacent to 0147 (123) — land the two in ONE `fkit-coder` session**; owner: fkit-coder)* | [`0150-add-verbatim-to-fkit-coder-declared-approval-marker`](../../tasks/done/0150-add-verbatim-to-fkit-coder-declared-approval-marker/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P128 | Decide the construction that satisfies the sprint-loop's verbatim-carry requirement — **an investigation, no implementation** *(**⚠️ ranked here by OWNER RULING 2026-07-29, not appended — see the placement note directly below the table**; `claude/skills/fkit-sprint-ship-loop/SKILL.md@2026-08-02:110` states the Build and Process-review spawn prompts *"MUST each carry the approved plan verbatim"* and gives **no construction for satisfying it**; the driver violated it **twice in consecutive rounds** of the run that shipped 0147/0150 — round 1 carried the plan **by reference** (*"the plan text you returned in your previous message"*), round 2 pasted it but **silently truncated ~10 passages — one of them an actual instruction — while asserting *"everything else is byte-for-byte"***; **both caught by the worker, never by any check**; **⚠️ those two failures are the driver's self-report of its own conduct and are NOT verifiable from disk** — no transcript is stored — the checkable third data point is `0147`'s worklog **§13**; **⚠️ worker-side detection is impossible**: `claude/agents/fkit-coder.md:93-100` + [ADR-021](../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md) leave the worker nothing to compare a paste against, so this is **driver-side discipline by construction** and any proposal claiming worker-side detection is wrong on its face; **do not presuppose literal pasting is the fix** — carry-by-reference to a `plan.md` on disk may be the right answer, **that is the question, not the answer**; may reopen condition **(b)**, the word `0150` just landed, so reconciliation with 0163's clause must be **one** follow-up, not two; **report-only — files no briefs, names its follow-ups**; owner judged **fkit-architect** on the `0160` precedent — it decides, it does not edit, and the eventual `SKILL.md` wording is fkit-coder's follow-up; owner: fkit-architect)* | [`0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement`](../../tasks/done/0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P129 | Build `test/wiki-flag-convention.test.js` — the wiki flag block is prose only and wholly unenforced *(named as a residual by **both** the coder and the reviewer on 0125; the ADR-018 hook reads only stdin + `skills_for_role()` and **never opens a `SKILL.md`**, and every `SKILL.md` mention under `test/` is a **comment** — deleting the block would red **nothing**; asserts **five** things in all three wiki SKILLs — complete flag, partial flag, hard-rule bullet, the **R2 "unrelated → say nothing"** branch and the **R5 "do not spawn the producer"** clause — plus a **fail-closed** uniformity check; **closes 0125's SUBSUME'd R3 residual** (`plan.md` check 4 is fail-open); ADR-014 zero devDeps + a `prove-red.sh` mutation; **⚠️ third claimant on the `SKILL.md` walk** after 0136 (P114) and 0152 — exactly one walk; soft-follows 0153; owner: fkit-coder)* | [`0154-build-wiki-flag-convention-test`](../../tasks/backlog/0154-build-wiki-flag-convention-test/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P130 | Decide where a real check on the wiki completion flag's **emitted form** can live *(**investigation + ruling, fix shape unknown** — not implementation; tasks 0125/0153 landed a **prescribed, verbatim** flag line, present and identical today in all three wiki SKILLs (`fkit-wiki-ingest/SKILL.md:72`, `fkit-wiki-sync/SKILL.md:116`, `fkit-wiki-lint/SKILL.md:81`) — **and it failed on its second live use**: `ai-agents/wiki-vault/log.md:623` records `0141`'s run emitting *"task 0141 ready to close…"*, **not the prescribed line**, with **all the required facts present** — the failure was **the form, not the content**; **⚠️ the plan-side account is NOT verifiable from disk** — neither `0126` nor `0141` left a `plan.md`, so *"the plan specified the non-conforming act"* and *"`0126` conformed only by luck of drafting"* are **testimony**, same honesty flag `0162` carries; **the decisive evidence is the consumer's own testimony** — a spawned `fkit-producer` asked whether it would have caught the deviation answered **"No. I would have acted on it without noticing"**, because it never opens the wiki SKILL during a close and matches on **the facts it needs, not string shape**, concluding *"on this run 'carried verbatim' was decorative, not a control"* and *"the party that caught the deviation is the party that specified it — self-correction, not independent verification"*; **⚠️ distinct from `0154` (P128), judged and not merged** — `0154` asserts the five strings are **in the three files**, and they were, so **`0154` would have been green for the entire duration of this failure**: it guards the **source**, nothing guards the **emission**; **distinct from `0158` (P122)** too — that asks *which wins*, this asks *whether a deviation is detected at all*; must rule **four candidate sites in or out by name** — consumer-side, a test, the plan gate, or **no mechanical check** (a legitimate outcome, to be argued not defaulted to); must say **what "verbatim" means modulo the `<NNNN>`/`<slug>` slots**, and whether the obligation sits on the right party (the SKILL states it on the **caller who summarizes**, the failure was in the **emitter**); **report-only — files no briefs, names its follow-ups**; **appended under `/fkit-task-brief` step 5, flagged for owner confirmation**; independent; owner: fkit-architect)* | [`0165-decide-where-a-check-on-the-wiki-flags-emitted-form-can-live`](../../tasks/backlog/0165-decide-where-a-check-on-the-wiki-flags-emitted-form-can-live/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P131 | State `/fkit-task-brief` step 5's append rule in full — the owner-ruled exception, the merit-flag obligation, the closed-row carve-out *(two spawned producers placed briefs **oppositely** on 2026-07-27 and the owner accepted **both**; step 5 read firsthand is **not ambiguous** on the default — it says append and forbids inserting, reinforced twice more in the same file — but it is **silent on the sanctioned exception**, so the two owner-ruled re-ranks the board records look like producer precedent, which is exactly how one was misread; also codifies the two things both producers reached independently and no file states — **never renumber `✅ Done`/`⛔ Cancelled` rows**, and **say where merit would have put it**; **also adds the *cite the folder ID, not the board rank* clause** — in the SKILL file, **not** the dual-homed convention page; **prose only, one file, unenforced** — no test reads any `SKILL.md` today and **adding a guard is out of scope** (0154's third-claimant warning); **narrowed 2026-07-27 by owner ruling — the stale-citation sweep and the 0149 correction split out to 0159** (`fkit-producer` artifacts; a brief has one `## Owner`), **rank unchanged at P127, owner-confirmed**; the spawn-instruction half is deliberately excluded → 0158; independent of 0159, soft-prefer landing first; owner: fkit-coder)* | [`0157-state-task-brief-step-5s-append-rule-in-full`](../../tasks/done/0157-state-task-brief-step-5s-append-rule-in-full/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P132 | Disambiguate the frozen-history clause in `priority-is-rank-not-identity.md` *(**0159's flagged-not-filed item, owner approved filing 2026-07-27**; the page **shipped this morning** as 0103 and **already required an owner ruling to read** — its `## What NOT to rewrite` second bullet calls `priority (folderID)` notations *"frozen history … never mass-edited"* and **never says which form**: board-cell `124 (0150)` or prose `0150 (124)`, **one character apart**; the owner ruled **board-cell only**, which unblocked 0159 — this task just makes `:38` say so in its own words, **nothing is being decided**; **two hard constraints, both already on the page**: it is **dual-homed** and must stay byte-identical with the `claude/scaffold/` copy — verified identical today, **0133's parity test is NOT landed yet so check by hand** — and it must use **bare citations, never relative links** into the ⛔ never-sync `decisions/`/`reports/`, a constraint the page itself states — **do not let an implementer "helpfully" add links**; **must not contradict 0159's recorded Ruling 2**; no change-surface conflict with 0159; cheapest item on the board — **merit says immediately below 0157**; owner: fkit-coder)* | [`0161-disambiguate-the-frozen-history-clause-in-priority-is-rank-not-identity`](../../tasks/done/0161-disambiguate-the-frozen-history-clause-in-priority-is-rank-not-identity/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P133 | Wiki re-ingest the amended ADR-032 and clear its now-wrong `⚠️ STALE` banner *(**merged from two candidates — one page, one edit**; vault `grep -c "Amendment — 2026-07-22"` was **0** at filing and is **2** measured at close 2026-07-29; the page's banner said the amendment "was never written" and "0118 … still 🔲 Backlog" — **false on both counts** since 0118 closed, and **the banner had already been replaced on 2026-07-26** by the sync entry at `wiki-vault/log.md:416`, before this task ran; the banner was 0117's authorized stand-in and has outlived it; no overlap with 0126 (ADR-033) or 0141 (lead rename); owner: fkit-wiki)* | [`0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner`](../../tasks/done/0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P134 | Pin the `team` / `team room` rejection with launcher-contract CLI tests *(**0139's standing residual, re-raise-triggered by 0140's close**; `rc=2` + **`claude` never exec'd** — the exit code alone would have passed while the real 0139 bug shipped; needs **no new harness**; adds a 3rd `prove-red.sh` mutation; independent; owner: fkit-coder)* | [`0144-pin-the-team-team-room-rejection-with-cli-contract-tests`](../../tasks/backlog/0144-pin-the-team-team-room-rejection-with-cli-contract-tests/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P135 | Give the launcher-contract suite a pty, and pin the menu picks 1-7 *(**partly reverses a recorded acceptance** — `architecture.md:453` says the tty menu stays manual; needs **new pty infrastructure** — `runFkit` is detached by design and must not change; **two documented false-result traps**; portability is an owner decision if it bites; independent; owner: fkit-coder)* | [`0145-pty-driven-menu-pick-coverage-for-the-launcher`](../../tasks/backlog/0145-pty-driven-menu-pick-coverage-for-the-launcher/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P136 | Correct the false "menu-pick alias" claim in 0139's accepted residual *(**a do-not-re-litigate residual describes behavior the code does not have** — it says `team`/`team room` still work as menu picks "exactly as before this task"; the menu arm is `1\|lead)` and the launcher's own comment agrees with the code, so the residual is the lone outlier; **owner ruled 2026-07-26: the text is wrong, the code is right — NO launcher change**; docs-only, `review.md` is the reviewer's ledger; feeds 0142; owner: fkit-reviewer)* | [`0146-correct-the-false-menu-pick-claim-in-0139s-accepted-residual`](../../tasks/backlog/0146-correct-the-false-menu-pick-claim-in-0139s-accepted-residual/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P137 | Guard test for the `SKILL.md` H1 house style — no skill may use the owner banner as its title *(0120 follow-up; **skill-file content is an entirely untested surface** — **no test in the repo reads any `SKILL.md`'s content**; **25** files, not 26: before 0120, 24 descriptive + **1 sole outlier**, after it 25/25, so the guard is green day one with **nothing grandfathered**; ADR-014 zero devDeps ⇒ hand-rolled; **⚠️ must reuse 0136's (114) `SKILL.md` walk, never add a second**; **low severity** — the original defect was cosmetic and the ADR-018 hook keys off `skills_for_role()`, not banner text; the coder's refusal to fold this into 0120 was correct; owner: fkit-coder)* | [`0152-guard-test-for-skill-md-h1-house-style`](../../tasks/backlog/0152-guard-test-for-skill-md-h1-house-style/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P138 | Record that 0118's block on 0117 was discharged by another route *(0118's brief `:84` still predicts "the amendment lands before 0117 runs" — **0117 shipped first** under an owner ruling with a staleness pointer standing in; architect ruled **record the discharge, do not delete the line** — a stale claim that already cost a three-day silent block is history worth keeping visible; edits a brief in `done/`; **must preserve the canonical `- **Blocks:**` form** or `dashboard.sh` reads UNPARSEABLE; owner: fkit-producer)* | [`0149-record-that-0118s-block-on-0117-was-discharged-by-another-route`](../../tasks/backlog/0149-record-that-0118s-block-on-0117-was-discharged-by-another-route/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P139 | Backfill the missing `## Priority` field into the six briefs that lack it *(a **full sweep** found **6 of 154** briefs (≈4%) with the heading absent entirely — 0122–0126 and 0136, not just the two noticed incidentally; `fkit-sprint-ship-loop:81` orders eligible tasks by the **brief's `## Priority` field**, so a brief without it is **invisible to the driver's own ordering rule**, and two of the six are live sprint rows at **P109** and **P114**; **no mis-ordering is in flight** — the driver falls back to the board cell and the cell agrees — so this is a conformance fix on a live rule, not an outage; 6 one-line inserts, values already known; touches four `✅ Done` briefs deliberately, because they are live P105–P108 rows the 0156 guard would otherwise fire on; **0105's shape**; blocks 0156 — hard; owner: fkit-coder)* | [`0155-backfill-the-missing-priority-field-into-six-briefs`](../../tasks/backlog/0155-backfill-the-missing-priority-field-into-six-briefs/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P140 | Make `## Priority` a required brief field — **nothing enforces it today** *(all three candidate sites checked 2026-07-27: `/fkit-task-brief`'s skeleton lists the field but its mandatory-field callouts name **only** `## Status` and `## Owner`; `dashboard.sh` has **no** `brief-missing-priority` kind — only `-id`, `-status`, `-owner` — and renders 0126/0136 with **zero** drift when run; **no test asserts presence**, `grep -rn "missing-priority" test/ claude/` returns nothing; **not an architect call** — the three-site pattern was walked end-to-end for `## Owner` by **0104 + 0105** this same sprint, so this is 0104's shape with no novel design; `Unscheduled` counts as **present** per the approved convention; ⚠️ existing raw test fixtures will trip it — use the `:62` default-injection precedent, **never a skip list**; brief-vs-board comparison **explicitly out of scope**; ADR-014 zero devDeps; **low severity** — ≈4% incidence, currently harmless, same class as 0152; needs 0155 — hard; owner: fkit-coder)* | [`0156-make-priority-a-required-brief-field-with-a-guard`](../../tasks/backlog/0156-make-priority-a-required-brief-field-with-a-guard/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P141 | Sweep the stale board-rank citations out of the briefs and the sprint board, and correct 0149's *"it stays last"* claim *(**the producer half of the 0157 split, owner-ruled 2026-07-27**; 0157 keeps the rule, this takes the repair — a brief has one `## Owner` and the sweep edits **task briefs + the sprint plan**, which are producer artifacts; owner ruled the convention's frozen-history clause covers the **board-cell** form `124 (0150)` only, **not** the prose form `0150 (124)`, so the sweep proceeds; verified firsthand 2026-07-27: **21 stale rank numbers, 19 sites, 11 files** — including **two nobody had found**, `0158`'s append flag (says 136, field is **122**, and still reads **unresolved** though the owner ruled it) and the `0151` board row; the *"it stays last"* claim is at **three** board sites (`:417`, `:466`, `:597`), not one, and **`:417`'s addendum is dated 2026-07-27, not 2026-07-26** as previously stated; **dated corrections appended, never rewrites**; **⚠️ this brief decays — re-verify every rank at implementation time, and run it late**; no rank changes, no file moves; independent of 0157, soft-prefer 0157 first; owner: fkit-producer)* | [`0159-sweep-the-stale-rank-citations-and-correct-0149s-stays-last-claim`](../../tasks/done/0159-sweep-the-stale-rank-citations-and-correct-0149s-stays-last-claim/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P142 | Decide the durable citation form for mutable coordinates — **an investigation, no implementation** *(the **class** behind 0157/0159, scoped as a class on owner approval 2026-07-27; three artifact classes cite coordinates that move and **may not want the same answer**: **case 1** board ranks in prose — **already 0157 + 0159, hard out of scope**; **case 2** `:NNN` line numbers — one appended row shifted `sprint-2.md` **+70 lines** and silently broke **11** pointers in one edit, repaired by hand, nothing flagged them; **case 3** `tasks/backlog/…` paths in review ledgers that die on close — **30 closed tasks carry one**, not 3, and **"just repair it" is NOT obviously right**: it means editing a document the ledger rule freezes by design; **⚠️ must reconcile `fkit-architect.md`'s `## Output format`, which actively mandates `path:line`**; enforcement checked firsthand — `dashboard.sh`'s `drift relocated` is the **only** existing stale-path catcher and covers **board rows only**, `test/` reads no citations, **no lint exists**, so a guard is only **partly** possible even in principle; same unenforced-prose class as 0154/0157; ADR-014 zero devDeps; **report-only — files no briefs, names its follow-ups**; owner: fkit-architect)* | [`0160-decide-the-durable-citation-form-for-mutable-coordinates`](../../tasks/done/0160-decide-the-durable-citation-form-for-mutable-coordinates/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P143 | Name the defective-marker refusal case in `fkit-coder.md` *(found by a spawned `fkit-producer` at `0150`'s close, testing the clause `0150` had just landed against the two failures it was exercised on — verdict **"inferable, yes; stated, no"**; condition **(b)** now requires `verbatim` and the marker is framed as **all** of (a)(b)(c) granting the write permission *"only under"* it, so a worker **reasoning from the conjunction** refuses a by-reference carry — but the refusal clause at `claude/agents/fkit-coder.md:98-100` enumerates **exactly two** cases, *"any other spawned 'implement this'"* and *"this loop's own **plan-only** spawn"*, and **neither of them is "a genuine sprint-loop spawn whose marker is defective"** — the named failure is *no* approved plan, not a plan carried by reference, so a worker pattern-matching on the examples rather than the *"all of"* can conclude a real driver's defective carry is still inside the carve-out; **there is no clause anywhere of the form "if the plan is not carried verbatim, refuse / return `NEEDS-DECISION` and ask the driver to re-send it"** — verified 2026-07-29 across both files, and this is **the gap that let both driver defects through**; **⚠️ edits the same guarantee surface `0150` just closed** — read `0150`'s [review ledger](../../tasks/done/0150-add-verbatim-to-fkit-coder-declared-approval-marker/review.md) accepted-residuals section first and leave condition (b) **byte-identical**; **key the clause on the marker's conditions, not on a restated test**, so a later (b) change cannot silently diverge; unenforced prose — **no test in `test/` reads `fkit-coder.md` content** (`0147`'s C8c/C8d guards were never landed), **do not add a guard**, 0152/0154 own that walk; soft-coupled to 0162 in one direction only and **does not wait for it**; recommend co-landing with 0164 — same untested file, non-overlapping regions; owner: fkit-coder)* | [`0163-name-the-defective-marker-refusal-case-in-fkit-coder`](../../tasks/backlog/0163-name-the-defective-marker-refusal-case-in-fkit-coder/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P144 | Close the build-phase logging hole — or state on the record why build choices need no log *(**⚠️ this is NOT a defect in `0147` as delivered** — both its briefs were scoped to **ADR-032 A2** and the **Process-review** worker, ADR-032`:129-133` named exactly those two sites as the outstanding gap, and `0147` closed both in full; this is a newly surfaced **adjacent** hole and must not be reported or reviewed as a miss; `claude/agents/fkit-coder.md:71-72`'s **Build**-worker bullet imposes **no logging duty of any kind**, and `claude/skills/fkit-sprint-ship-loop/SKILL.md:102`'s Build row asks only for *"write source + `plan.md`/`worklog.md`; return change surface + any decision surfaced"* — **no per-decision content requirement**, unlike the Process-review row at `:105` which spells all three out; **consequence: A4 bullet 2's reopening condition has no evidence base for build-phase choices**, since it turns on *"A2's worklog record is what makes that checkable"* — **whether A4 bullet 2 reaches build-phase choices at all is itself part of what this task settles**, its own words say *post-review*; **live proof on disk**: `0147`'s worklog **§13** records three out-of-plan verification-harness additions (`C8c`, `C8d`, `NC4`) made **during build** and logged **nowhere**, caught only because the author **voluntarily applied an obligation that did not cover them** — *"the obligation's own author breached it within one round of writing it"*; **two acceptable outcomes** — extend the duty (2 files, reuse `0147`'s wording, scope the trigger to plan-undetermined choices) **or** write down why none is needed, **addressing §13 by name**; unenforced prose, **no guard** (0152/0154); **recommend co-landing with 0163**; owner: fkit-coder)* | [`0164-close-the-build-phase-logging-hole-in-the-sprint-loop`](../../tasks/backlog/0164-close-the-build-phase-logging-hole-in-the-sprint-loop/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P145 | Decide the enforcement point for *"run every command you print"* — the rule already exists and did not bind *(**investigation + ruling, fix shape unknown** — not implementation; a reviewer named **three same-class defects in `0141`'s record and three in `0126`'s — six across two tasks, all in `ai-agents/wiki-vault/log.md`**, while the vault **content** passed every review with **zero** findings: **an unrun command** (both printed `grep -rn "not a doer" ai-agents/knowledge-base/` as returning *nothing*; it returns **9** — claim at `log.md:547`, correction at `:646`, **re-verified 9 hits 2026-07-29** — a one-file result generalized to a whole-directory claim, broadened form never re-run), **shifted citations** (`adr-022:44`→`:45`, stale **by the act of writing the entry that cited it**, plus `0126`'s `:314`), and **claims wider than their measurement** (*"vault-wide"* over 166 content pages + `index.md` with `log.md` itself unchecked, plus `0126`'s *"staged"*); **the same class reached the owner** — the driver relayed the unrun-command finding as a headline result **without running it**, recorded at `log.md:657`, whose blast radius is *"a reader who runs the printed command gets 9 hits and has direct evidence to discount a genuinely valuable method finding"*; **⚠️ the load-bearing finding: this is NOT a missing rule** — `conventions/evidence-before-assertion.md` already says *"a claim about repository state requires a check, in the same turn"* and *"applies to every role"*, so question 1 is **why an existing, on-point, already-linked rule failed to bind**, and an answer that adds more prose to a page that already has the right prose has not answered it; **`0013` (Backlog board) already owns worked examples on that page** and already records this counter-argument **and** a length risk at three examples — **a fourth example is likely the wrong deliverable, do not collide**; **nothing machine-checks any of this today** and **all six were caught by an independent reviewer, never the author**, and only because these tasks were reviewed at all — so the ruling must also say whether the honest control is **review coverage**; a genuine mechanical option exists that `0013`'s example 2 lacked — these are **printed shell commands with stated results**, extractable and re-runnable — feasibility/side-effects/false-positives are the architect's call; must adjudicate **the relay instance by name** (author vs relayer); **must re-run the grep rather than copy "9 hits" from the brief** — copying it would reproduce the defect inside the ruling; **report-only — files no briefs, names its follow-ups**; **appended under `/fkit-task-brief` step 5, flagged for owner confirmation**; independent; owner: fkit-architect)* | [`0166-decide-the-enforcement-point-for-run-every-command-you-print`](../../tasks/backlog/0166-decide-the-enforcement-point-for-run-every-command-you-print/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P146 | Decide what the sprint driver does when a spawned worker dies — an accepted residual that has now fired twice *(**investigation + ruling, no implementation** — the third question is *whether the exit table needs a row at all*, so no implementation brief was filed alongside; **verified firsthand 2026-07-30**: `fkit-sprint-ship-loop/SKILL.md:204-214`'s exit table has **nine** rows and **none** covers a worker that terminated abnormally — every row is triggered by a worker that *returned*; **it has fired twice in two consecutive runs**, both **API 529 Overloaded** — a Build worker died mid-verification on `0118` **with its write already landed** (driver recovered via `git diff --numstat` + `SendMessage` resume), and an `fkit-wiki` worker died **twice in a row** on 2026-07-30 leaving **one complete, coherent edit** (`testing-and-verification.md`, `+4/−0`) and two pieces unwritten; **both recoveries worked, neither was procedural** — the driver improvised inspect-disk → judge-coherence → resume/re-spawn/defer both times, and the SKILL describes none of it; **⚠️ read R6 precisely before calling this its re-raise** — `0111`'s residual (`review.md:76-79`, owner-ruled accept 2026-07-22) is about **the driver session** crashing, this is a **worker** dying while the driver survives and demonstrably recovers, so R6's stated trigger *"stranded in-progress tasks become a recurring operational problem"* was **not** met by either instance, and which reading applies decides report-vs-ADR; **the load-bearing find the gap report did not have: R6's rationale *"fkit has no crash-recovery anywhere"* is broader than disk** — `fkit-task-ship-loop/SKILL.md:87-109` carries a whole **"Durable state — the loop does NOT trust its own memory"** section with a fail-safe-on-resume, and **`fkit-sprint-ship-loop` has no equivalent section at all**, so the gap may be larger than one table row; that same doctrine already half-answers *"may a resumed worker self-report?"* — **neither real recovery asked one to**, and whether that is rule or accident needs ruling; **the honest limit**: a driver cannot tell *died-before-writing* from *died-after-writing-before-reporting* **except by reading disk**, so disk is the only possible first step, not the recommended one; **`:216-217`'s *"no path ends in silence"* invariant makes an uncovered exit a live breach**, and a tracked task would sit `🔄 In progress` from `:95-97` with no rule about it; **⛔ a retry policy is explicitly OUT of scope** — two 529s indicate an overloaded API, the owner made the call live both times, and generalizing a count from two samples is over-fitting; **adjacent to `0134` but distinct — do not merge** (that is a producer that *ran* and left inconsistent state; this is a worker that never returned); **report-only — files no briefs, names its follow-ups**; **appended under `/fkit-task-brief` step 5; ✅ rank owner-confirmed 2026-07-30** (confirmed by the owner via `AskUserQuestion` at the start of this sprint run — the row did not move and nothing was renumbered, so the merit alternative the flag offered, a rank above the tail, was not taken; ⚠️ **recorded on the board 2026-07-31, a day late** — the confirmation was never routed to a producer on the day it was given, so this row asserted an unresolved flag for a day after the owner had in fact ruled); independent; owner: fkit-architect)* | [`0167-decide-what-the-sprint-driver-does-when-a-spawned-worker-dies`](../../tasks/done/0167-decide-what-the-sprint-driver-does-when-a-spawned-worker-dies/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P147 | Remediate the dead brief paths in closed `review.md` ledger headers *(**execution arm of 0160's Case 3 — needs 0160, hard; do NOT start before it rules**; a ledger's self-header reads ``Task: `ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md` `` and `/fkit-task-done` then moves the folder, so the path dies at close; **the large majority is a code span or a bare path, not an href — nothing resolves through those, severity is low**, and the owner's close bar accepts it as residual; **🆕 2026-08-01 — corrected: this row previously read "code span, not an href — nothing resolves through it" flatly for the whole population, i.e. 0 of 60 in href form, and that was wrong.** Re-measured independently twice (reviewer, then the correcting producer — same result both times): of the 60 ledger `Task:` headers, **30 are code spans, 25 bare, 4 markdown hrefs, 1 has no header** — so **4 ARE hrefs**, in `0001`, `0010`, `0022` and `0039`, **and all 4 resolve**: each reads ``Task: [`…dead-flat-path.md`](./brief.md)``, where the **link text** is a code span naming a dead pre-migration path but the **target** is the relative, move-proof `./brief.md` — **dead in display and live in navigation at the same time**. **No count changes**: 40 dead / 19 resolve / 60 files / variants 17-14-9 all re-derived identically, and all 4 hrefs sit inside variant 3's nine (variant and form are independent axes). **Consequence — two mover gaps, not one**: **Gap A**, the 56 code-span/bare headers the mover's *"re-point the href"* rule never reaches; **Gap B**, the 4 hrefs whose target is already correct, wrapped in stale link text no rule governs — for these four, `/fkit-task-done` doing nothing is **correct behaviour, not a miss**. The brief accordingly gained a **fourth case** in `## What to build` (do not re-point or unwrap the 4 working targets; treat as text-only) and **two new verification steps** (classify on the notation axis and report the href count *even if zero*; prove no working link was broken). *Provenance: reviewer re-measurement during the `0160` stateful review; owner ruling 2026-08-01 via `AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session.* Filed as a class on owner ruling 2026-07-31 because it belongs to no single task; **⚠️ the relayed scale of "39 of 60" is wrong and was re-derived firsthand 2026-07-31**: 39 counts the string `tasks/backlog/` *anywhere*, including 8 files that only cite sibling tasks in finding rows — the described class is **31 of 60**, and the full dead-header population is **40 of 60** (19 resolve, 1 has no `Task:` line at all — 0080); **three variants, not one**: 17 current-form `backlog/<NNNN>-<slug>/brief.md`, **14 pre-migration flat `backlog/<slug>.md`** whose target exists under no name, and **9 pre-migration flat `done/<slug>.md`** — right board, dead path, **a variant the report misses entirely**, so "points at done/" is not proof of correctness; 0160's own count of 30 on 2026-07-27 is consistent with 31 today — the conflict is with the 39, not between the two briefs; **`cancelled/` holds 11 folders and ZERO `review.md` files**, so that scope question answers itself — nothing to sweep, but the rule should still cover it; **`/fkit-task-done` does not re-point it, by the design of its own wording** — its step-5 sweep is href-scoped throughout (*"re-point the href, change nothing else"*, *"A link is not a claim; it is a pointer"*) and its one own-folder rule is scoped to links the folder makes **to a sibling**; **the generator is located**: `fkit-stateful-review/SKILL.md`'s ledger schema line `Task: <path to task file>`, mirrored byte-for-byte in `fkit-process-stateful-review` and declared shared — the reviewer writes it while the task genuinely IS in `backlog/`, so **a sweep alone is a treadmill: every future close reproduces it**; ⚠️ **do not arrive at "rewrite the paths"** — repairing means editing a frozen ledger, the thing the ledger rule exists to forbid, and 0160 weighs four candidate answers incl. leave-them-dead; **⛔ out of scope**: 0160 Case 2 (`:NNN` line numbers), board-rank prose (shipped by 0157 + 0159), and any machine guard (0152/0154 own the skill-file walk); **appended under `/fkit-task-brief` step 5; ✅ rank owner-confirmed 2026-07-31** (*"Confirm both as appended"*, `AskUserQuestion`, jointly with `0169` — no row moved, nothing renumbered; **the merit argument was NOT adopted**: on merit this belongs directly below `0160` as its execution arm, and the owner kept the appended position instead, so that is recorded as filed and not as a pending move); owner: fkit-coder)* | [`0168-remediate-the-dead-brief-paths-in-closed-review-ledger-headers`](../../tasks/backlog/0168-remediate-the-dead-brief-paths-in-closed-review-ledger-headers/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P148 | Point the stateful-review close conditions at ADR-034's work-product bar — four sites, three files *(**ADR-034 (accepted 2026-07-31) defines the close bar and deliberately edits no skill** — its *Binds* table names three sites and leaves each pointer as a separate task; the bar: a ledger closes once the **swept work product** is clean, own-record defects (`brief.md`, `worklog.md`, ledger bookkeeping) become **accepted residuals** instead of driving another round, and **the split is per SITE, not per file**; filed as a task and not an ADR footnote because the bar **binds three roles** — reviewer, coder's responder, any driver — so filing it in one skill leaves the others re-deriving it, which is how the question surfaced; **all three sites re-derived firsthand 2026-07-31 and say what the ADR says**, but two corrections: the ADR cites `fkit-task-ship-loop` `:160-162` while the close-bar sentence is `:160-161` (162 is the same step's non-convergence clause), and **a FOURTH site the ADR does not name** — the same file's terminal-state table restates *"ledger closed-out and last verify green"*, in scope; **no skill references ADR-034 today** (verified repo-wide); ✅ **the `fkit-task-ship-loop` freeze question is SETTLED — owner ruling 2026-07-31, the freeze does NOT bind**: `fkit-sprint-ship-loop` and ADR-032 both say it *"stays byte-unchanged"*, but in context that is scoped to ADR-032's own ripple and **ADR-033 later rewrote its step 9**, which is in the file today; all four sites are in scope **unconditionally — no gate, no fallback shipment**, and whether `fkit-sprint-ship-loop`'s own stale claim needs repair is task `0170`, not this one; ⛔ **write no `:NNN` line numbers** — that is 0160 Case 2 surface, and citing the ADR by name needs none, so this does **not** wait on 0160; ⛔ out of scope: the ledger **schema** lines `Status: in-review | closed-out`, the pre-existing **ADR-links-ship-dead** class (`scaffold/.../decisions/` ships EMPTY — verified), and any machine guard (0152/0154 own the `SKILL.md` walk); **no scaffold copy to mirror** — `claude/scaffold/` holds no skills tree; **appended under `/fkit-task-brief` step 5; ✅ rank owner-confirmed 2026-07-31** (*"Confirm both as appended"*, `AskUserQuestion`, jointly with `0168` — no row moved, nothing renumbered; ⚠️ the flag as filed stated no merit alternative, which step 5 requires, so the confirmation was given without one in front of the owner — moot for this row, not repaired retroactively); owner: fkit-coder)* | [`0169-point-the-stateful-review-close-conditions-at-adr-034`](../../tasks/backlog/0169-point-the-stateful-review-close-conditions-at-adr-034/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P149 | Correct the stale *"stays byte-unchanged"* claim in `fkit-sprint-ship-loop` — a decision on wording, not a deletion *(**third instance of the class 0151 and 0159 fixed** — a governing document asserting a fact about another file that is no longer true; the skill says `fkit-task-ship-loop` *"stays byte-unchanged"*, but **ADR-033 rewrote that file's step 9 and the edit is in the file today** — both halves re-derived firsthand 2026-07-31: ADR-033 (accepted, **amends ADR-032**) records the change, and the file's step 9 now reads *"Route the close to the producer — never close it yourself"* citing ADR-033 by name across **13** references incl. its frontmatter; **⚠️ TWO sites in the skill file, not the one relayed** — the narrative *"models its rigor, never invokes it"* passage, **and the `## Hard rules` bullet** *"Never invoke `fkit-task-ship-loop`"*, which is **the worse of the two** because a driver reads that section as binding; **filed rather than noted on owner ruling 2026-07-31** because it sits in the driver skill run every sprint, so it misinforms that loop first — this run's evidence: a stale governing claim propagates into worker prompts, which is how a wrong ruling date reached the owner's plan approval and was caught only by a reviewer; **⚠️ needs a DECISION on wording, NOT deletion** — the claim had a **true scope** (ADR-032's own ripple genuinely required no edit to the task loop) written in unscoped permanent tense, so the likely fix is to **state the scope**, not remove the sentence; three options weighed in the brief and **the wording is deliberately not prescribed** — a mechanical replace would reproduce the defect in a fresher tense; **the never-invoke / session-only rule is CORRECT and must survive** — only the factual claim is stale; **🆕 scope widened by owner ruling — this task now spans TWO FILES, not one** *(ruling 2026-07-30, written into the brief 2026-07-31, re-confirmed 2026-08-01; the earlier "open question routed to the owner, not settled" is therefore **settled**)*: alongside the skill file's two sites it must **append ONE dated note** to `adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md` covering **two further sites** — `## Decision` item 1's closing sentence *"stays byte-unchanged and session-only"*, and the `## Consequences` → Positive bullet *"`fkit-task-ship-loop` and every role stay untouched"* — recording that **ADR-033 §Decision 3 falsified the *byte-unchanged* half while the *session-only* half stands**, citing ADR-033 by name; ⛔ **APPEND-ONLY — rewriting ADR-032's existing text is hard-forbidden**: it is an **accepted** ADR and therefore frozen record, so neither the Decision 1 sentence nor the Consequences bullet may be reworded, scoped, dated or deleted in place (cf. 0143's appended note on ADR-010); **one note covering both sites, never two**, and it must not restate the claim in a fresher permanent tense; the three wording options above apply to the **skill file only, never to the ADR**; ⛔ do not touch ADR-032's §Amendment *"byte-unchanged"* sentence about `fkit-process-stateful-review` (**different subject — truth not assessed either way**), and do not touch ADR-033 at all; ⛔ **write no `:NNN` line numbers** (0160 Case 2) — locate by heading and quoted phrase; ⛔ out of scope: the other two `byte-unchanged` uses in `fkit-task-ship-loop` (**different subjects, not stale — do not sweep**), any behavioral change, the ADR-034 pointers (that is 0169), and any machine guard (0152/0154 own the `SKILL.md` walk); **appended under `/fkit-task-brief` step 5; ✅ rank owner-confirmed 2026-07-31** (confirmed by the owner via `AskUserQuestion` in a live `/fkit-sprint-ship-loop` session, separately from `0168`'s and `0169`'s earlier joint confirmation — the row did not move and nothing was renumbered; **on merit it belongs directly below `0169`** (that ruling created it, same sentence, soft-follows it) and **merit and append positions coincide**, so the confirmation adopts the merit position rather than overriding it); **🆕 THE ADR-032 NOTE'S FORM IS NOW SETTLED (2026-08-02) — this row's model, `0143`, has shipped, and FOUR decisions are BINDING on this task**, written into its brief: **(1) placement — the note goes BELOW the claim it corrects**, a deliberate departure from the wiki vault's *"banner above claim"* convention, kept-as-shipped **with a recorded rationale** (`0143` residual `R1-placement`) — follow it and cite it, **do not re-litigate**; **(2) the header `- **Corrections:**` bullet** — one metadata item that **may wrap**, carrying the ⚠️/⛔ legend and the annotated-site list, and **the one part of an `accepted` ADR an append-only correction may extend** (owner ruling Q3; residual `R5-header-form`, ratified); **(3) citation form — no `:NNN` into a mutable file**, anchor by file plus quoted phrase (**permitted, not mandated**, but it is the form where this task writes a new pointer); **(4) two markers and ONLY two — ⚠️ = a fact that drifted, ⛔ = a decision that was overturned; do not invent a third**; **this task writes ⚠️, not ⛔, and the note must say why** — ADR-033 falsified a *fact* inside ADR-032's Decision 1 (*"byte-unchanged"*) and did **not** overturn the decision, the *"session-only"* half standing; **also inherited: the `+N / −0` proof obligation**, verified by `git diff --numstat` + `git diff -U0 \| grep '^-'`, **not by eye**, with the same single worklog-justified header-bullet exception; **⚠️ and one caveat NOT to import silently — `0143` shipped a KNOWING self-contradiction** (its header bullet names `claude/skills-for-role.sh` while §Decision 5, out of scope, still names `claude/fkit-claude.sh`; `0195` repairs it), so **check ADR-032 for a NEIGHBOURING site this note's own wording will contradict, and say what you found — including if the answer is "none"**; owner: fkit-coder)* | [`0170-correct-the-stale-byte-unchanged-claim-in-fkit-sprint-ship-loop`](../../tasks/backlog/0170-correct-the-stale-byte-unchanged-claim-in-fkit-sprint-ship-loop/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P150 | Write the `durable-citation-anchors` convention page — dual-homed into the scaffold *(**follow-up 1 of `0160`'s decision report**, the standing rule the report deliberately did not write; `conventions/README.md`'s own root rule forbids promoting a report, so this is a new page carrying **six** named pieces — §1's rule block, §1's five-row table with its `Because` cells, **§1's R22 scope note** (mandatory: the report says the overclaim matters *"because follow-up 1 copies this section into a convention page"* — the claim-vs-pointer question decides **one row of five** and a writer applying it alone gets the coordination-document row wrong **in the unsafe direction**), §1.1's *"never cite a line number naked"* rider, §1.2's ledger-`Claim`-cell practice note (**practice, NOT a schema change**), and **§4.2.1's link-label rule in its NARROWED R20 wording** — *"do not use a mutable location as the visible label of a forwarding link into a living document"*, **never the withdrawn `never`**, which contradicted §1; **✅ owner-ruled 2026-08-01 (report §11 OQ5): DUAL-HOMED** into `claude/scaffold/`, with two costs the owner accepted and the brief records — every future edit is bound to **two byte-identical files** per `conventions/dual-home-parity.md`, and **the report may be cited from the page BY NAME ONLY, never linked**, because `claude/scaffold/.../reports/` ships **empty** (verified 2026-08-01: `.gitkeep` only) so a relative link would resolve here and dangle in every consuming project — the exact defect class the report is about; **⚠️ scope fact added at filing: this touches FOUR files, not two** — both `conventions/README.md` copies carry a *"What's here"* index a new page must join, and the scaffold copy's *"Six conventions ship with the scaffold"* count goes false; the owner has ruled the page **exists and is dual-homed**, **not** its wording; **🆕 SCOPE WIDENED BY OWNER RULING 2026-08-02 — this task now has TWO deliverables, not one** *(`AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session at `0143`'s close: **"fold into the durable-citation-anchors work (`0171`) — do NOT file standalone"**)*: **Deliverable B repairs the 12 displaced `adr-010:NNN` pointers** that `0143`'s `+71 / −0` append pushed out of place across **ADR-012 / ADR-018 / ADR-031** — count re-derived at filing 2026-08-02; **10 self-correct** because they carry a quoted phrase (that is §1.1's rider working), **2 are NAKED — `adr-012:87` and `adr-012:105` — and now land on unrelated text with nothing to recover the intent from**, the exact failure case the rider exists to prevent; **recover their original intent from git history, not by guessing at the current lines**; the fold's justification is that the 12 are this convention's **first real specimen** — repairing them **in the form the page defines, in the same change that defines it**, is what proves the form applicable rather than merely stated; **cost stated rather than buried: this is no longer a single-act write** — two deliverables that can fail independently, and the repair half touches three files the page half never would; **if the owner would rather the page ship alone, Deliverable B splits cleanly — but that is a change to the ruling, not a producer call**; ⛔ **these are `accepted` ADRs — repair the pointer, change nothing else on the line** (no prose, status, date or decision text); ⛔ do not touch ADR-010 itself (`0195`/`0196`/`0197`); ⛔ no `wiki-vault/`; ⚠️ **if `0195`/`0196`/`0197` land first the line numbers shift again — re-derive at implementation time**, a recurrence that is itself the argument the page makes; **the rank did NOT change and no row was renumbered by the widening**; **appended under `/fkit-task-brief` step 5, flagged for owner confirmation**; blocks 0172 and 0176; soft-related to `0197` (that task repairs ADR-010's **outbound** citations, this one the **inbound**); owner: fkit-architect)* | [`0171-write-the-durable-citation-anchors-convention-page`](../../tasks/backlog/0171-write-the-durable-citation-anchors-convention-page/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P151 | Narrow the architect's `## Output format` `path:line` mandate — it currently mandates the banned form *(**follow-up 2 of `0160`'s decision report**, per §1.2; `claude/agents/fkit-architect.md` is the architect's system prompt in **every** architect session and consult, and its `## Output format` first bullet mandates *"structured markdown with `path:line` citations"* with **no exclusion** — while §1's table rules `path:NNN` **wrong, categorically**, for a coordination document others append to (`ai-agents/sprints/*.md`, task briefs, `ai-agents/wiki-vault/log.md`), so **fkit's own architect prompt instructs the architect to produce the form its own ruling bans**; `0160`'s brief named this as a hard reconcile obligation and the report did the reconciling but states *"I did not edit `claude/agents/fkit-architect.md`"*; **⚠️ the verdict is NARROW, not delete** — §1.2: *"it narrows. It does not stand unchanged, and it does not go"* — **three clauses, none droppable**: it **stays** for code/tests/`claude/` files (§1 table row 1 rules that form **correct**, so a bullet banning `path:line` outright has FAILED this task), it **excludes** coordination documents, and it **gains §1.1's rider** (pair the number with a quoted fragment or heading); point the bullet at `conventions/durable-citation-anchors.md` rather than restating the law inline — it is a line in a budget-constrained system prompt; **wording deliberately not prescribed** — a mechanical replace reproduces the defect in a fresher tense (cf. `0170`); **⚠️ adjacent site named and NOT folded in**: the same file's `## Behavioral rules` *"Ground every claim in a `path:line` reference"* is **broader** and the report rules **nothing** on it — needs its own ruling, do not edit under this brief; **9 further `path:line` mandates across `claude/skills/`** (`fkit-survey-project`, `-design-spec`, `-evaluate-approach`, `-inspect`, `-record-decision`) are **mostly safe under §1 row 1** and are **out of scope**; ⛔ no guard (0136/0152/0154 own the `SKILL.md` walk), ⛔ **no scaffold copy exists** — `claude/scaffold/` holds no agents tree, verified 2026-08-01; ⛔ write no `:NNN` citations; needs 0171 — **hard**; **appended under `/fkit-task-brief` step 5, flagged for owner confirmation — merit and append positions coincide** (it sits directly below the page it depends on); owner: fkit-coder)* | [`0172-narrow-the-architect-output-format-path-line-mandate`](../../tasks/backlog/0172-narrow-the-architect-output-format-path-line-mandate/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P152 | Tighten the wiki completion-flag block — the template manufactures a dead path on every emission *(**follow-up 5 of `0160`'s decision report**, per §5.2; **⚠️ URGENT — the generator is running**: every wiki completion flag this project emits today manufactures a dead path and any ledger quoting one **preserves it permanently**; confirmed firsthand 2026-08-01 that **all three** wiki skills still carry the defective template, independently confirmed the same day by the wiki role; live specimen on disk is `0148`'s closed ledger, a verbatim flag quote carrying a `backlog/` path for a task now in `done/`; **two changes, both halves of §5.2's "live delta"** — **(i)** add the missing **`:NNN` prohibition** (the block bans board rank and says nothing about line numbers — verified), and **(ii)** **replace the hardcoded `backlog/` path in BOTH template lines** (the `partial or uncertain` line carries it too, and §5.2 flags that form as **the worse of the two to detect** — *"correct at emission, dead later … a pointer that was demonstrably correct when written"*); **🔒 OWNER RULING THE REPORT DOES NOT CONTAIN — §11 still reads *"⏳ Awaits the owner"* and is OUT OF DATE**: the owner ruled open question 7 **after** the report was finalised and ruled the report ships as-is, so **the ruling travels in the brief** — **the replacement form is FOLDER ID ONLY, candidate (i), no path at all** (e.g. *"Task 0148's vault work is complete — ready to close"*), owner via `AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session 2026-08-01, **accepted cost: the producer does one lookup**; without that box a coder reading §11 alone finds this unruled and stops; **⚠️ the rank / `P<n>` prohibition is ALREADY SHIPPED in all three — do not re-add or reword it** (`0160`'s brief proposed it as new; it is not); **⚠️ same TEXTUAL change in all three, NOT "make the blocks byte-identical"** — re-verified firsthand 2026-08-01 (§5.2 / R12): ingest and lint **are** byte-identical, **sync is NOT** — 0-space leading indent vs 3 — so an editor told they are equivalent will normalize sync and produce a diff nobody asked for; **blocks 0165** (§5.4: content first, then the check — *"a check written before the content ruling would pin today's form"*) **and blocks 0154 — a dependency the report does NOT name, found at filing**: `0154` asserts the complete- and partial-flag lines **verbatim in all three files**, so landing it first pins the defective form in a test and ships a guard enforcing a form the owner has ruled out; **⚠️ RANK CONFLICT, for the owner** — this is **append rank P152** but `0154` (P129) and `0165` (P130) both sit **above** it, so the board's order contradicts the dependency links; **on merit this belongs immediately above `0154`**; the `Depends on`/`Blocks` links are the binding record; ⛔ no guard (0136/0152/0154 own the walk), ⛔ do not decide where an emitted-form check lives (0165), ⛔ **no vault writes** — §5.3's further `log.md` rank citations are explicitly **unclassified and unverified** and any cleanup is a separate `fkit-wiki` task, ⛔ do not edit `0148`'s frozen ledger, ⛔ write no `:NNN` citations; **appended under `/fkit-task-brief` step 5, flagged for owner confirmation — merit says PROMOTE**; owner: fkit-coder)* | [`0173-tighten-the-wiki-completion-flag-block-in-all-three-wiki-skills`](../../tasks/done/0173-tighten-the-wiki-completion-flag-block-in-all-three-wiki-skills/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P153 | Build the dead-ledger-path guard — regression cover for the `review.md` header sweep *(**follow-up 7 of `0160`'s decision report**, file and condition in §7.1; §4.6 (owner-ruled) changed the ledger self-header to carry the **task folder ID** — `Task: 0159`, *"optionally with a live relative link **beside** the ID, never in place of it"* — because the old `backlog/<NNNN>-<slug>/brief.md` form **died at close by construction**; `0168` executes the schema change and the one-time normalization of the 40 dead headers, and **this is the guard that stops the class coming back**; **file**: a new test under `test/` picked up by the existing `node --test test/*.test.js` glob, **no new devDependency** (ADR-014); **condition — build the POST-schema form, not the pre-schema one**: *"the ID on the `Task:` line equals the `NNNN` prefix of the folder the file is in"* — no filesystem lookup, no ambiguity, and it catches a **wrong** ID as well as a dead one; **⚠️ ceiling, to be stated and not quietly exceeded**: header-scoped only — it does **NOT** reach the **16 dead body-level paths across 14 ledgers**, and widening to whole-file scanning raises the false-positive surface because a ledger may **legitimately** quote a historical path verbatim (`0148`'s closed ledger is exactly that — correct content in a frozen ledger, not a defect); the 16 are a **stated residual**, not an oversight; **four scoping calls to make and state**: missing-header behaviour (`0080` has no `Task:` line — fail or skip?), **the guard MUST accept both `Task: 0001` and `Task: 0001 — [brief](./brief.md)`** or it rejects the ruled-permitted form, `cancelled/` coverage (**11 folders, 0 `review.md`** — checked positively, nothing to assert today), and a `prove-red.sh` mutation; **two hesitations the owner weighed and overrode, recorded not hidden**: per §4.5 a guard is exactly ADR-034's *"load-bearing for another consumer"* condition **so building one changes what ADR-034 covers** (read it first), and under the folder-ID schema the class **mostly stops being generated**; **✅ owner-ruled 2026-08-01 (report §11 OQ6, `AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session): NAMED, filed LOW, sequenced AFTER follow-ups 3 and 4** — value is **regression cover for the sweep**, *"worth little before the sweep exists, more after"*; **LOW is an owner ruling, not a producer judgement — do not promote without one**; **🔗 kept SEPARATE from `0176` — the producer judgement §8 explicitly left open** (*"consider one task with two conditions rather than two tasks — a producer judgement, not a ruling"*): merging takes the **union of two unrelated preconditions** (this waits on `0168`, `0176` waits on an 11-citation cleanup) so neither half could ship until both landed; the two carry **different owner rulings** (one here, **two** plus four scoping decisions there); and they assert **different conditions over different scanned sets** — accepted tradeoff is two test files instead of one; ⛔ do not widen to whole-file scanning, ⛔ do not perform or re-perform `0168`'s sweep (**report red, do not fix**), ⛔ edit no `review.md` (frozen — §4.3/ADR-034), ⛔ no new devDependency, ⛔ read no `SKILL.md` (0136/0152/0154/0173 own that walk), ⛔ write no `:NNN` citations; needs 0168 — **hard**; **appended under `/fkit-task-brief` step 5, flagged for owner confirmation — the append position satisfies the ruled sequencing** (`0168` is P147), so merit and append coincide; owner: fkit-coder)* | [`0175-build-the-dead-ledger-path-guard`](../../tasks/backlog/0175-build-the-dead-ledger-path-guard/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P154 | Build the coordination-citation policy guard — literal reading, closed ledgers grandfathered *(**follow-up 8 of `0160`'s decision report**, file / condition / four scoping decisions in §7.2; added after round-1 review found §7.2 had **wrongly given case 2 away as unenforceable in full** — the *meaning* half genuinely is (*"no check can verify that line N still says what the citer meant"*), the **policy** half is not: §3.3's *"stop using `path:NNN` for coordination documents"* is **syntactic**, the same shape as case 1's already-shipped `test/dashboard-contract.test.js`, and **a guard of this shape would have caught the original 11-pointer incident at the commit that introduced it**; **file**: `test/coordination-citation-policy.test.js`, existing `node --test test/*.test.js` glob, **no new devDependency** (ADR-014); **condition**: no line in the scanned set contains `<path>:<NNN>` whose path names `ai-agents/sprints/*.md`, `ai-agents/tasks/*/*/brief.md`, or `ai-agents/wiki-vault/log.md`; **🔒 OWNER RULING 1 (decision 4) — ships on the LITERAL full-path form**, because **literal is the only reproducible reading**: reviewer, Codex and author all land on **38 citations / 19 files, 27 exempt**, while shorthand did **NOT** reproduce (published 391/53, Codex 399/53, reviewer 296–318/46–48) and *"a test's acceptance criterion must be reproducible"*; **the shorthand extension is filed as its OWN named decision with its own measured cost — do NOT fold it in, not even behind a flag**; **⚠️ the cost the owner accepted, which must never be glossed: the guard is KNOWINGLY INCOMPLETE on day one** — the literal condition **misses §7.2's own lead specimen**, `0013`'s brief's bare `sprint-2.md:354` inside a link label, and misses `0160`'s own brief in **three** places; those violations are real and the shipped guard will not flag them, so **any report on this guard must state its incompleteness alongside its pass**; **🔒 OWNER RULING 2 (R18) — the closed ledgers are GRANDFATHERED BY NAME**: the policy applies **going forward only** and citations already inside closed `done/*/review.md` are exempt, because cleaning them means editing **frozen historical ledgers** (§4.3 / ADR-034) — **the exemption must be in the guard's DEFINITION from day one or it is red on historical files the ruling has decided will never be cleaned; it is not an optimization to add later**; **the exemption names `done/*/review.md` ONLY — `done/*/brief.md` and `done/*/worklog.md` are NOT exempt**; both rulings 2026-08-01 via `AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session; **📅 red set RE-MEASURED AT FILING as §7.2 requires (R30 — the as-of date is load-bearing): 38/19 total, 27/11 exempt, 11 citations across 8 files residual — reproduces the report EXACTLY**; the 8 are `sprint-2.md`, five `backlog/` briefs (`0149`, `0154`, `0158`, `0165`, `0166`) and two `done/` briefs (`0092`, `0160`); **the drift source the report flagged has closed** — `0160`'s ledger is now inside `done/*/review.md` and therefore inside the exemption, though its **brief** stays in the residual; **still a snapshot — re-measure again at implementation**; **⚠️ shipping it red is NOT an option** — the 11 must be cleaned first, and **that cleanup is owned by no task today, flagged for the owner**; **the other three scoping decisions**: scanned set is `ai-agents/tasks/*/*/*.md` + `ai-agents/sprints/*.md` (**⛔ do NOT widen to `knowledge-base/reports/`** — it would fail on `0160`'s own report, which cites a coordination document **as the specimen it diagnoses**), a stated fence/blockquote-skip convention so the guard does not *"punish the reports that document the defect"* (**⚠️ this changes the count by ZERO — 38 either way — do not blame the red-set size on it; §7.2 corrected exactly that error twice, R27**), and the reading (ruled above); **🔗 kept SEPARATE from `0175`** per the producer judgement §8 left open — reasoning recorded in `0175`; **this task carries TWO owner rulings and four scoping decisions, which is itself part of why it is not merged** with a one-ruling LOW guard; ⛔ do not clean the 27 exempt citations, ⛔ no vault cleanup (`fkit-wiki` only), ⛔ no new devDependency, ⛔ read no `SKILL.md`, ⛔ write no `:NNN` citations — **a guard against the form must not ship carrying it**; **appended under `/fkit-task-brief` step 5, flagged for owner confirmation — merit and append coincide** (adjacent to its pair `0175`); owner: fkit-coder)* | [`0176-build-the-coordination-citation-policy-guard`](../../tasks/backlog/0176-build-the-coordination-citation-policy-guard/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P155 | Verify the codex half of the HTML-comment-stripping canary *(**carried-forward residual of `0130`**; the **Claude half is measured firsthand** — Claude Code 2.1.220 strips HTML comments from `CLAUDE.md` before they reach agent context, so the 404 B `emit_block()` wrapper costs cap budget but no Claude-side context; the **codex half was never measured** — whether `codex-cli 0.145.0` strips HTML comments from `AGENTS.md` is **second-hand from an architect consult**; two rationale comments (the `RULES_MAX` site in `claude/fkit-claude-init.sh`, the header of `test/rules-block-budget.test.js`) carry an explicit hedge and assume the conservative default that codex still pays; **measure it, version-stamp per ADR-016's harness-version discipline, correct or confirm both hedges** — an **inconclusive** result is a valid outcome, not a reason to manufacture a verdict; if codex also strips them the wrapper costs **no agent context on either side**, a live input to any future budget decision; **⚠️ standing trap recorded in `0130`: this must NOT become an argument for capping the SOURCE instead of the EMITTED block** — the owner ruled 2026-08-01 that the cap keeps measuring the emitted block, and the coder flagged the alternative as *"a 493 B cap loosening wearing a correctness costume"*; ⛔ no `RULES_MAX` change (stays 4096), no cap-semantics change, comments only; **priority LOW — nothing is blocked on it**; **appended under `/fkit-task-brief` step 5, flagged for owner confirmation — merit and append coincide**; owner: fkit-coder)* | [`0177-verify-the-codex-half-of-the-comment-stripping-canary`](../../tasks/backlog/0177-verify-the-codex-half-of-the-comment-stripping-canary/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P156 | Record the canonical merit-statement form in the convention page *(**follow-up 1 of `0174`'s decision report**, §3.1/§8 — the grammar `0179` and `0180` both cite; report §3.1 **RULED IN**, against six weighed alternatives, that an ordering intent board rank cannot carry is recorded as a **relative, non-numeric merit statement in the brief** — two shapes only, `- **On merit:** immediately above 0154 — <reason>` and `- **On merit:** as ranked`; **relative never absolute** (an absolute rank is stale the moment anything above it moves), **folder ID only, never a `P<n>` token** (writing `0154 (P129)` reintroduces the defect `0157`/`0159` were spent sweeping out), **advisory — board rank still binds execution**, and **`as ranked` is REQUIRED not optional** because the explicit no-op is what makes absence detectable and is what makes `0180`'s guard possible at all; **the practice already exists and its form is wrong** — `On merit` appears in 15 briefs in at least four incompatible shapes, and `0158`'s reproduces the stale-rank defect *inside* the practice (*"belongs at 122 — immediately below 0142 (P121)"*, both halves already stale); **home**: `conventions/priority-is-rank-not-identity.md`, **⚠️ dual-homed — both copies verified to exist at filing and must move together** per `conventions/dual-home-parity.md`; **⚠️ conflict flagged, not planned around**: the driver's relay of the owner ruling named `dependency-declaration-form.md` instead, which is **absent from the scaffold** (a `0132` drift item) — **the report is the source and names `priority-is-rank-not-identity.md`; flagged for owner confirmation**; ⛔ do not amend `/fkit-task-brief` (that is `0179`), ⛔ do not build the guard (`0180`), ⛔ do not backfill any brief, ⛔ no `:NNN` citations; **appended under `/fkit-task-brief` step 5 by a spawned producer with no owner channel, flagged for owner confirmation — ⚠️ APPEND AND MERIT DIVERGE: on merit it belongs immediately above `0132`**, 24 open rows higher, because every day it is unshipped more briefs are filed in a shape that must later be reshaped; **⚠️ owner field flagged** — report §8 says *"`fkit-architect` to write; `fkit-producer` to file"*, the driver's relay said `fkit-coder`; owner: fkit-architect)* | [`0178-record-the-canonical-merit-statement-form-in-the-convention-page`](../../tasks/backlog/0178-record-the-canonical-merit-statement-form-in-the-convention-page/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P157 | Require a merit statement on every ranked-board brief, in the canonical form *(**follow-up 2 of `0174`'s decision report**, §8 — `/fkit-task-brief` **step 5 "Determine priority"** today mandates a merit sentence **only for appended rows** and only in the legacy shape `**On merit this belongs directly below <NNNN>**, because <reason>.`; two things change and they are not separable in practice — **scope**: required on **every** brief filed onto a **ranked** board (the Backlog board is excluded by construction, it is unranked and its briefs read `## Priority: Unscheduled`), and **form**: the canonical grammar `0178` records, including the `as ranked` no-op; **why it is not cosmetic** — report §4.1 accepted explicitly that **16 of 29 open rows cannot be promoted to their merit positions** and that the number grows as the board closes out, so the merit statement is the project's **only** record that the gap exists, and a field optional on most briefs records nothing reliable; keep the existing append-rank flag sentence, which answers a different question and is not superseded; ⛔ do NOT narrow step 5's re-rank exception (that is `0181`), ⛔ do not build the guard (`0180`), ⛔ do not backfill, ⛔ no `:NNN` citations and no bullet ordinals — anchor by step heading plus quoted text; **⚠️ FILE COLLISION with `0181`** — both edit step 5, independent in substance, must NOT be merged, whichever lands second rebases on the first, **flagged for whoever schedules them**; **depends on `0178`** — pointing the skill at a page that does not yet carry the grammar ships a dangling instruction; **appended under step 5, flagged for owner confirmation — merit and append coincide within this batch** (immediately below `0178`); owner: fkit-coder)* | [`0179-require-a-merit-statement-on-every-ranked-board-brief`](../../tasks/backlog/0179-require-a-merit-statement-on-every-ranked-board-brief/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P158 | Build the `brief-missing-merit` guard — presence and shape *(**follow-up 3 of `0174`'s decision report**, §5.1/§8 — the **enforceable half** of a deliberately **split** enforcement answer that changes report `0160` §7's *"nothing can enforce this"* **in one direction only**: presence and shape are enforceable in `claude/skills/fkit-status/dashboard.sh` + `test/dashboard-contract.test.js`; **whether the statement is true, honest, or the ordering the owner actually wants — nothing can enforce this**, in those words; **condition, two parts**: (1) **presence** — every brief on a **ranked** board carries `**On merit:**` followed by a relative statement naming a neighbour by folder ID or the literal `as ranked`, else `brief-missing-merit` drift (**unranked boards excluded** — the Backlog board has no rank to be relative to); (2) **shape** — the statement contains **no `P<n>` token**; same family and same emission shape as the existing `brief-missing-status`/`brief-missing-owner`/`brief-missing-id` kinds, all three already asserted in `dashboard-contract.test.js`; **⚠️ TWO ACCEPTED COSTS, both carried from day one**: **(a) the shape check reads `P<n>` tokens ONLY and a bare integer slips through** — `0158`'s *"belongs at 122"* is the live specimen, caught today only by the **presence** half for being legacy-shaped, so **reshaping it into canonical form while keeping the bare number makes the guard PASS it** — a backfill can extinguish the flag while leaving the defect; catching bare integers means flagging every number in a merit sentence, which is noisy and unreproducible, so **the literal reading ships and the gap is named here, never later as a surprise**; **(b) the guard is red on the whole open board on day one and the number is NOT 18** — report §5.4b corrected it to **29 of 29**, because the 11 briefs already carrying the practice fail the **shape** half; **📅 re-measured at filing after `0174` closed and this batch of eight was filed: 17 no statement / 11 legacy shape / 8 canonical / 36 total open — red on 28 of 36**; still a snapshot, re-measure at implementation; **⛔ do NOT close the gap by loosening the condition to accept the legacy shape** — that re-opens §3.1's *"the practice is right and its form is wrong"* and defeats the half that stops the merit field becoming the next host for the bare-rank citation problem; **🚧 BLOCKED on a grandfathering decision (§9 OQ1) — backfill all 28 (17 new, 11 reshaped), exempt by date, or ship the fact as advisory; not choosing means the guard cannot land**, and the 28-brief size *"may change who decides it"*; `0155`'s line is the closest existing brief to canonical and is the natural reshape template; ⛔ no bare-integer extension (separate named decision), ⛔ do not edit `/fkit-task-brief`, ⛔ no new devDependency (ADR-014), ⛔ no `:NNN` citations; **depends on `0178` + `0179`** — sequencing it earlier ships it red on 28 of 36; **appended under step 5, flagged for owner confirmation — merit and append coincide within this batch**; owner: fkit-coder)* | [`0180-build-the-brief-missing-merit-guard`](../../tasks/backlog/0180-build-the-brief-missing-merit-guard/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P159 | Narrow `/fkit-task-brief` step 5 — a mid-board insertion is NOT the owner-ruled re-rank exception *(**follow-up 4 of `0174`'s decision report**, §4.2/§8, and the **decision is already recorded**: [ADR-035](../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md), status **accepted**, owner-signed 2026-08-01 — **this task is the skill edit only and does not re-open it**; **the hole**: step 5's *"The one exception — an owner-ruled re-rank"* and its *"`✅ Done`, `⛔ Cancelled` and `➡️ Moved` rows are NEVER renumbered — not even under an owner ruling"* were read as compatible and are not, **because of arithmetic**: an insertion renumbers **every row below it**, so on an interleaved board **there is no mid-board insertion point that does not renumber a closed row**; **⚠️ THIS IS THE ONE THAT CLOSES THE HOLE TASK `0174`'S OWN FILING WENT THROUGH — RANK IT ACCORDINGLY**: `0174` was inserted mid-board 2026-08-01 under an explicit owner ruling invoking that exception and **renumbered eight closed rows** — `0151`, `0147`, `0150`, `0157`, `0161`, `0148`, `0159`, `0160`, all reading `✅ Done` at the time — verified against the filing commit's diff by the architect and **independently re-derived exactly by the reviewer**; the producer recorded authority in full, checked the effect, wrote a specific merit justification, and **still breached an absolute rule, because the check ran in the WRONG DIRECTION** — it verified the ranks *above* the insertion point; *"a rule that survives only until someone reads it carefully is not a rule"*; **the edit**: narrow the exception to **moving an existing row within its own contiguous run of open rows**, state the remedy in the same breath (**append, and record the intent as a canonical merit statement**), and record the corollary that **the append rule is a FORCED CONSEQUENCE of the closed-row rule** — anyone proposing to allow insertions must argue the **closed-row rule**; ⛔ do NOT re-open the decision (ADR-035 rejected *"leave it"*, *"relax the closed-row rule"*, *"formalize the act harder"* and *"revert `0174`"* each by name — a finding proposing any is **closeout, not a new defect**), ⛔ do NOT revert the insertion (it renumbers the same eight a **second** time; the record is corrected by `0183`), ⛔ no `:NNN` citations **and no bullet ordinals** — *"a bullet ordinal is a line number wearing different clothes"*; **⚠️ FILE COLLISION with `0179`**, flagged; **independent — can land first**; **blocks `0182`**; **appended under step 5, flagged for owner confirmation — ⚠️ APPEND AND MERIT DIVERGE: on merit it belongs immediately above `0178`, the HIGHEST MERIT OF THIS BATCH OF EIGHT**, being the only one whose absence has already caused a verified breach; owner: fkit-coder)* | [`0181-narrow-the-re-rank-exception-an-insertion-is-not-a-re-rank`](../../tasks/done/0181-narrow-the-re-rank-exception-an-insertion-is-not-a-re-rank/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P160 | Build `test/closed-rank-immutability.test.js` — no closed row's rank ever changes *(**follow-up 5 of `0174`'s decision report**, §5.3/§8, **ranked LOW**; **why it exists** — report §2 found a breach of an absolute rule that **no existing check caught** and that **both written records of the act claimed had not happened**; **condition**: across a commit range, for every `sprint-*.md`, no row whose status in the **earlier** revision starts with `✅ Done`/`⛔ Cancelled`/`➡️ Moved` carries a different `P<n>` in the **later** revision; **⚠️ rows matched by FOLDER ID, never by rank** — matching by rank makes the guard's own key the thing it is testing; **⚠️ its ceiling, four limits stated up front**: (1) it is a **diff** check, not a state check — no property of a single board file reveals the breach; (2) it therefore **needs git history**, unlike every other test under `test/`, and **cannot run against a bare working tree or a shallow/single-commit clone**; (3) it asserts a **transition, not a state** — it cannot say the current board is correct; (4) **it would be RED on the commit that filed task `0174`**, confirmed by replay, flagging all eight rows — *"that is the test working correctly"*, **and it is the argument for building it**; **🚧 BLOCKED on a baseline decision (§9 OQ2) — exempt history before a named commit, or accept a permanently red run; not choosing means the guard cannot land**, and the exemption must be in the guard's **definition**, not a post-filter (the same lesson `0176`'s closed-ledger exemption records); failure output must name folder IDs with old and new rank, and a missing-history environment must **skip with a stated reason**, never pass silently; ⛔ do not repair the eight renumbered rows (ADR-035 rejected reverting by name; `0183` corrects the record), ⛔ no new devDependency (ADR-014), ⛔ do not edit any sprint board, ⛔ no `:NNN` citations; **depends on `0181`**; **appended under step 5, flagged for owner confirmation — merit and append coincide** (`- **On merit:** as ranked`); owner: fkit-coder)* | [`0182-build-the-closed-rank-immutability-guard`](../../tasks/done/0182-build-the-closed-rank-immutability-guard/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P161 | Correct the "no closed row was renumbered" claim in two live records *(**follow-up 6 of `0174`'s decision report**, §2.2/§6/§8, ranked **soon — two live records assert a falsehood right now**; **the falsehood**: the sprint-2 filing addendum under the heading *"⚠️ One row was inserted mid-board by owner ruling, and it renumbered the board"* states *"no closed row was renumbered by the insertion"*, and **`0174`'s own brief repeats it verbatim** in its `## Notes` — **both are false**: **eight closed rows were renumbered**, `0151`, `0147`, `0150`, `0157`, `0161`, `0148`, `0159`, `0160`, each down exactly one, verified against the filing commit's diff by the architect and **independently re-derived exactly by the reviewer**; **the reasoning that produced it must be recorded because it will recur** — the producer checked the ranks **above** the insertion point (the owner's named band, all closed) and correctly concluded none of *them* moved; an insertion renumbers what is **below** it, so **the check ran in the wrong direction**; **second correction — a terminology collision**: the addendum calls P119 the head of the earliest *"reachable"* open segment, meaning *the highest rank in the band not itself closed*, while the measurement's sense (report §1.1, `0160` §6.2) makes a row reachable **only** if it sits in the **final** segment — under which that segment was **not reachable at all**, it was segment 1 of 5, and **`0174` was itself one of the 16 unreachable rows: the task filed to fix unreachability sat in an unreachable slot, described in its own filing note as reachable**; only the measurement's sense is used going forward; **⚠️ CORRECT THE RECORD — DO NOT REVERT**, owner-ruled and recorded in ADR-035: reverting **renumbers the same eight closed rows a second time** and contradicts the `0157`/`0159` precedent that a stale rank reference is repaired by **naming the folder ID**, not by restoring numbers; **the two notes are appended beside the originals — ⛔ do NOT edit or delete the false sentences**, deleting destroys the evidence that the error was made and how; **⚠️ `0174` closed 2026-08-01 so its brief is under `tasks/done/`** — editing a closed brief is in scope **for this correction note only**, and ADR-034 still bars editing any `done/*/review.md`; ⛔ no re-rank, ⛔ no status-cell change, ⛔ no edit to ADR-035 or the report (both already correct), ⛔ no vault edit (`fkit-wiki`'s, if the falsehood was ingested), ⛔ no `:NNN` citations; **appended under step 5, flagged for owner confirmation — ⚠️ APPEND AND MERIT DIVERGE: on merit it belongs immediately above `0132`**, 25 open rows higher; owner: fkit-producer)* | [`0183-correct-the-no-closed-row-renumbered-claim-in-two-live-records`](../../tasks/backlog/0183-correct-the-no-closed-row-renumbered-claim-in-two-live-records/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P162 | Record `Depends on`/`Blocks` as the binding execution order, and record the discharged `0173` ordering *(**follow-up 7 of `0174`'s decision report**, §3.7/§6/§8; **⚠️ RE-SCOPED 2026-08-03 by OWNER RULING — *“re-scope it to the surviving half”*** after `0173` closed: **the sequencing motive and the live board-honesty defect are both SPENT** — `0173` landed first at its own append rank with both dependents still open, so the ordering held without any declaration, and `0154`/`0165` rendering `ready` is now the **TRUE** answer; **what survives**: (1) **LIVE** — record report §3.7's three-carrier ruling on `conventions/dependency-declaration-form.md`: rank carries *what to pick up next* (binding for picking work), the `On merit` statement carries *the owner's preference rank cannot express* (**advisory**), and `Depends on`/`Blocks` carries *what must land first* (**binding, and it outranks reading order**); (2) **LIVE** — append a dated note discharging the addendum's *“the owner should decide whether to promote the row”* flag as **moot — no promotion was performed or needed**; (3) **HISTORICAL RECORD ONLY** — annotate `0154`/`0165` with the discharged `0173` ordering in the **`0149` shape** (*record the discharge, do not delete the line*; the correction goes in a **separate bullet**, never inside the label); **⚠️ THE NAIVE REPAIR NOW CREATES A DEFECT IN THE OPPOSITE DIRECTION** — `dashboard.sh` hands `/fkit-status` the **raw** `Depends on` text and a named task maps to `after <N>`, so writing a bare `Depends on: 0173` today would flip two **truthful** `ready` rows into a **false** `after 0173`; **⛔ two 2026-08-01 claims were STALE and are CORRECTED here, not preserved** — `dependency-declaration-form.md` **IS** in `claude/scaffold/` (shipped by the now-closed `0132`, generalized by owner ruling, registered `audience-adapted` in the dual-home parity exceptions), so the gap note is deleted and replaced by a **live dual-home obligation** (producer's call: the ruling is general convention ⇒ **both homes**, generalized in the scaffold copy; run the parity test), and `0154`'s soft-follow on `0153` is **itself discharged** (`0153` closed) — preserve the text, do not act on it; ⛔ do NOT promote `0173` or re-rank anything, ⛔ do not sweep the corpus for other asymmetries, ⛔ do not edit `dashboard.sh` or any test, ⛔ no `:NNN` citations, ⛔ do not touch the vault; **✅ the historical annotation is RULED IN — OWNER, 2026-08-03: yes, in the `0149` shape** (annotate, never delete; the correction in a **separate bullet**, never inside the label — **the `after 0173` trap above is NOT softened by the ruling**); **1 open question left** — whether the scaffold copy gets the ruling; **⚠️ P162 is APPEND rank, flagged for owner confirmation — but the append/merit divergence has now CLOSED**: the 2026-08-01 merit case rested entirely on `0173`'s urgency, which is spent, so P162 is a fair position on merit today; owner: fkit-producer)* | [`0184-record-depends-on-blocks-as-the-binding-execution-order`](../../tasks/backlog/0184-record-depends-on-blocks-as-the-binding-execution-order/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P163 | Decide whether Sprint 2 rolls over to a fresh board *(**🚧 AWAITING OWNER SIGN-OFF — deferred 2026-08-01; the row reads `🔲 Backlog` to match the brief, but nothing may start until the owner rules**; **follow-up 8 of `0174`'s decision report**, §3.6/§8/§9 — **⚠️ NOT RULED. THE OWNER DEFERRED THIS ON 2026-08-01. Nothing may be rolled without a signed ruling, and candidate 6's ruling is NOT authorization**: report §3.6 rules the rollover **IN as a mechanism** and states in the same breath *"its execution is a separate decision and is NOT ruled here … nothing in this report authorizes rolling the board"*, and ADR-035 repeats it; **the report simultaneously calls it the HIGHEST-LEVERAGE of the eight** — everything else makes an unrepresentable ordering **recordable and binding**; this is the only one that makes it **representable again**, and the only one that moves the absolute unreachable count down for a reason other than work disappearing; **board state measured 2026-08-01 18:32 MSK, reviewer-confirmed cell for cell and independently reproduced by Codex**: **155 rows / 126 closed (81%) / 29 open / 5 segments / 16 of 29 unreachable (55%) / 1 singleton (`0143`) / ~3,300 lines**; **⚠️ the headline share improved for a reason that is NOT progress** — it fell 68% → 55% while **no open row moved from unreachable to reachable, not one**: the movement was entirely two unreachable rows **closing** plus fresh rows appending into the reachable zone and inflating the denominator — **read the absolute count, not the share: 17 → 16 against +7 new rows**; **⛔ distinguish it from a periodic renumbering pass, which §3.3 ruled OUT** — a renumbering pass rewrites the ranks of rows that **stay**, invalidating every rank citation in the corpus in one commit; a rollover **moves open rows to a new board and freezes the old one**, touching no closed rank — *"they are not variants of one idea"*; **phase 1 is an owner sign-off gate, not a producer judgement**; **phase 2, only if the owner signs, must state FOUR things** — what happens to in-flight tasks, what happens to every existing citation into the sprint-2 board, what happens to `/fkit-status`'s `sprint-*.md` board discovery, and **whether the new board restarts at `P1` or continues from `P156`** (both defensible; leaving it unstated is not); ⛔ do NOT roll the board — not partially, not as a draft, not behind a flag; ⛔ do NOT create a `sprint-3.md` (creating the file **is** the roll); ⛔ no re-rank or renumber; ⛔ no `:NNN` citations; **a deferral is an outcome, not a failure**; **appended under step 5, flagged for owner confirmation — ⚠️ APPEND AND MERIT DIVERGE: on merit it belongs immediately above `0132`**, 26 open rows higher, and its append rank being the **bottom of the board** is itself a demonstration of the defect it addresses; owner: fkit-producer)* | [`0185-decide-whether-sprint-2-rolls-over-to-a-fresh-board`](../../tasks/done/0185-decide-whether-sprint-2-rolls-over-to-a-fresh-board/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P164 | Amend ADR-027 to record the audience-adapted third kind *(**the single follow-up of `0132`'s close**, 2026-08-01; ADR-027 models the dual-homed surface as **two** kinds — ✅ must-match and ⛔ never-sync — and `0132`'s sweep found a **third**: five of the six "drifted" scaffold `conventions/*` files are **not stale copies** but deliberate, de-fkit-ified **audience-adapted** rewrites, so **§Decision 2's byte-align mandate is a live record instructing a future implementer to ship a regression** — fkit's own incident narrative plus **4 verified-broken relative links** into every consuming project; **owner ruled 2026-08-01, Option B**: audience-adapted is a legitimate third kind and byte-aligning live → scaffold is **rejected as a product regression**; **⚠️ the ADR's real defect is its EVIDENCE, not its arithmetic** — "six drifted files" is a `diff -rq` count, and **a `diff` count cannot distinguish a stale copy from a deliberate adaptation**; the figure is stale **in kind, not in count** (all six still differ, and **none** were fixed by `0043`/`0077`/`0086`, so `0132`'s own guess that two had been repaired is **wrong**); the amendment must also point at `test/dual-home-parity-exceptions.mjs` as the **authoritative** list and record that `decisions/` and `reports/` are **outside** the surface, so **no ADR is ever a drift event**; ⛔ no test or code edits, ⛔ do not touch `0132`'s brief or its closed `review.md` (ADR-034), ⛔ do not re-open the byte-align question — it is ruled; **appended under `/fkit-task-brief` step 5 by a spawned producer with no owner channel, flagged for owner confirmation — ⚠️ APPEND AND MERIT DIVERGE: on merit it belongs directly below `0132`, i.e. immediately above `0133`**, ~34 open rows higher, because `0133` is the **next eligible task**, hard-depends on `0132`, and consumes exactly the model this amendment corrects — a `0133` implementer reading ADR-027 as written today is told to byte-align files the owner has ruled must not be byte-aligned; owner: fkit-architect)* | [`0186-amend-adr-027-to-record-the-audience-adapted-third-kind`](../../tasks/backlog/0186-amend-adr-027-to-record-the-audience-adapted-third-kind/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P165 | Re-verify task `0112` by a check that can actually cover it *(**the single follow-up of `0133`'s close**, 2026-08-02; the owner's **2026-07-25 ruling** — *"re-verify `0112` by hand once `0133` lands"* — is **undischargeable as written and permanently so**: `0112`'s write surface is `claude/skills-for-role.sh`, `claude/skills/fkit-team/SKILL.md`, `claude/README.md`, `claude/scaffold/CLAUDE.md` (all **outside both homes**) plus `knowledge-base/architecture.md` (**live-only, exempt by decision**), so its **intersection with the dual-home parity surface is EMPTY**, verified row by row by `0133`'s coder and reviewer, and because that surface lives under `claude/` it will **never** intersect; **`0133` was right to refuse to report a pass** — reporting one would have laundered an unrunnable step into a runnable-looking green, the same failure `0112`'s close already committed once; a **substitute check** — grep `lead` ↔ `sprint-ship-loop` across the source of truth and its four documented mirrors — **passes 5/5 today**, so `0112`'s substance looks intact and only its verification wording was phantom, **but that is a signal, not a discharge**: it was run in passing by a coder whose brief did not scope it and is written down nowhere as `0112`'s standing verification; this task **names** the covering check, **runs** it, records the result **per file — five rows, pass/fail each**, states plainly whether `0112`'s substance holds, and annotates the 2026-07-25 ruling as **not applicable** so no future reader retries it that way; ⛔ **if it fails, do NOT repair here** — a `0112` defect is its own task; **⚠️ `/fkit-task-done` stops on a folder already under `done/`, and its one exception — the owner-verification upgrade — is OWNER-ONLY, so only the owner can change `0112`'s landed status** whatever this task concludes; ⛔ do not edit `0112`'s brief or folder; **appended by a spawned producer with no owner channel, flagged for owner confirmation — ⚠️ APPEND AND MERIT DIVERGE: on merit it belongs immediately below `0133`**, ~35 open rows higher, because it is `0133`'s only carried-forward producer item, is minutes of read-only work, and retires a risk the owner has held open since 2026-07-25; owner: fkit-producer)* | [`0187-re-verify-0112-by-a-check-that-can-actually-cover-it`](../../tasks/backlog/0187-re-verify-0112-by-a-check-that-can-actually-cover-it/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P166 | Repair the five live ownership-fact defects found by `0142` (D1–D5) *(**follow-up 1 of `0142`'s decision report**, Part 3 + Part 8; `0142` was **report-only by its own verification step 5**, so it found five live defects and deliberately left every one live, **none previously recorded**: **D1** `claude/scaffold/CLAUDE.md`'s producer row omits `/fkit-task-brief` — a **declared mirror that ships into every consuming project's root `CLAUDE.md`**, the same failure mode in the same file as the incident the checklist's own warning narrates; **D2** `architecture.md` says *"Only `fkit-query` carries no banner"* — **two** lack it (`fkit-query` + `fkit-team`, 23 of 25 carry one), plus two *"every skill"* sentences sharing the error, and **whether to add two banners or correct three sentences is this task's call, deliberately left open**; **D3** `architecture.md` cites a dead line for `skills_for_role()` — **a citation-drift defect inside the report about citation drift**; **D4** the **FOUR**-mirror claim when there are five and a sixth — **⚠️ its repair MUST touch TWO files**, `claude/skills-for-role.sh@2026-08-02:12-23` and `claude/fkit-claude.sh@2026-08-02:239-250`, **byte-identical duplicates** (`diff` → no output) that neither point at each other nor are tested to agree; **D5** root `CLAUDE.md` says foreign skills are *"invisible"* — contradicted by **four live docs and ADR-018 §Decision 5, which records visibility as a knowingly ACCEPTED COST**, and it sits in every session's context every turn; **sequenced BEFORE `0189` on the owner's ruling, carried verbatim: *"do not let the build quietly repair its own corpus"*** — ⛔ **and there is NO mechanical sequencing constraint: `0142` §D4 records TWO mechanisms asserted, found false and withdrawn, so do not re-derive one**; **`0142` scored A-i against all five and the answer was NO on every one** (Part 6 row 6) — wrong prose at *registered* sites is `0137`'s territory, not the registry's, so **`0189` would never have surfaced these**; also look at, **no defect asserted**, `PROJECT.md`'s *"turned off"* and `ai-agents/README.md` / `ai-agents/tasks/README.md` (incomplete, not false); ⛔ no ADR prose edited, ⛔ no wiki write, ⛔ no new devDependency; **appended under `/fkit-task-brief` step 5 by a spawned producer with no owner channel, flagged for owner confirmation — ⚠️ APPEND AND MERIT DIVERGE: on merit it belongs directly below `0158`**, at the top of the contiguous open run, ~43 rows higher, because five live falsehoods sit in documents agents read every turn; owner: fkit-coder)* | [`0188-repair-the-five-live-ownership-fact-defects`](../../tasks/backlog/0188-repair-the-five-live-ownership-fact-defects/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P167 | Build A-i — the declared skill-ownership site registry plus the completeness tripwire *(**follow-up 2 of `0142`'s decision report**, Part 8; **the decision is already recorded and accepted** — [ADR-036](../../knowledge-base/decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry.md), clauses 2–5 — **this builds it, it does not re-open it**; **the checklist has failed THREE times** (`0036`, `0124`'s three system-prompt sites, `0151`'s prose-outside-the-generated-block) and `0142` enumerated the true inventory: **39 rows across 21 classes over 61 fact-site files** against a checklist naming **five**; **build**: `test/skill-ownership-sites.mjs` in `test/dual-home-parity-exceptions.mjs`'s shape — flat `{ path, kind, reason }` array with a **≥30-char `reason` floor enforced by the test** (ADR-027 §Decision 3's reason: *an entry with no stated reason is an unfalsifiable permanent hole*), **two kinds** (ownership-fact sites + declared non-fact hits — **without the second the tripwire can never go green**), a **completeness tripwire** that greps the declared live surface and fails on any hit whose file is unregistered **without judging whether the prose is true**, and the **checklist demoted to a pointer in BOTH byte-identical copies** (clause 2, widened after review round 2 — *"both are demoted, or neither is"*); **⛔ the five-trigger spec is taken VERBATIM from ADR-036 clause 4** — the matching rules for (b), (c) and (e) are a **~13.9k-character blockquote, byte-identical with report §4.1**, and **clause 4 says of its own summary sentence *"this sentence is a summary of it, not a second copy of it"*** — **point at it, do not paraphrase**; **(b) binds to `claude/skills/*/` enumerated at test time, NEVER a hand-maintained constant** (`skill-ownership-hook.test.js`'s `UNIVERSE` holds 24 of 25 and says so about itself); **the registry is AUTHORITATIVE for the inventory and NO COUNT IS HARD-CODED** — every figure in the report is a **dated measurement of one tree on one day**, and three passes by one author produced ~19, 21 and 38 rows; **⛔ ADR-036 GRANTS NO COMPLETENESS LICENCE — *"whoever builds A-i must NOT treat clause 4 as complete"*, with no exception clause anywhere** (the opposite wording existed in an earlier revision and was **withdrawn**); **the tradeoff, carried verbatim: it makes the INVENTORY mechanical, NOT the sweep — a registered site whose prose quietly goes false still ships false**, and A-i scores **4 of 6 historical classes and 0 of the ≥5 current defects**; ⛔ **A-ii is DEFERRED by ruling — do not build it or half-build it**; ⛔ do not settle `0142` Part 7's three-vs-four wiki discrepancy (needs the barred sweep, and **only `fkit-wiki` writes the vault**); ⛔ no new devDependency (ADR-014), ⛔ ADR-036 not edited; **depends on `0188`** — by owner ruling, not by mechanism; **appended under step 5, flagged for owner confirmation — merit and append coincide for this row**, since the dependency pins it after `0188` regardless; owner: fkit-coder)* | [`0189-build-the-skill-ownership-site-registry-and-completeness-tripwire`](../../tasks/backlog/0189-build-the-skill-ownership-site-registry-and-completeness-tripwire/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P168 | Add ADR-037's worker-side precedence clause to the universal rules block *(**follow-up 1 of `0158`/ADR-037**, §4 — ADR-037 is **accepted and binds nothing yet**: no file carries the rule to a spawned worker, so every ship-loop run still spawns workers under the same silence the ADR was written to close; site ruled by §4 as `claude/scaffold/universal-rules.md`, the **only** surface reaching every spawned worker of every role on every turn and therefore the only one escaping the ADR-012 trap; **⚠️ the clause does NOT fit for free — re-measured first-hand at filing 2026-08-02: emitted block 3570 B against `RULES_MAX=4096`, 526 B free, 87.16 % utilization**; **two ceilings, and the binding one is NOT the test** — the standing ≥ 400 B-free target (owner ruling, task `0130`, recorded in `test/rules-block-budget.test.js`'s header) leaves **126 B**, while the test's rounding gate (`Math.round((size/max)*100) <= 92`) first reds at **3789 B**, so **218 B of growth stays green**; ADR-037 §4's three drafted wordings measured **174 / 186 / 212 B** — **all three pass the test, all three breach the standing target**, and the ADR's own counterfactual sentence is **313 B** against a 259 B predecessor, so **neither fits the 126 B headroom**; **the brief must put the (a) compress / (b) owner-signed bump (ADR-016) / (c) spend-the-margin choice to the OWNER — it cannot be resolved by picking the cheapest branch**; **⛔ the clause MUST keep the conservative-branch-and-escalate escape** — the shorter draft without it shipped in ADR-037's first draft, was raised as a **round-1 high finding**, and read literally re-points instance B's frozen ledger, the exact outcome the ADR rejects *"the skill rule always wins, full stop"* to avoid; **⚠️ the three candidate wordings are recorded in NO file** (accepted residual R4 of `0158`), so this task re-drafts and re-measures its own; also check the wording against **ADR-036 trigger (e)** — a role name near an ownership verb — but **the registry module `test/skill-ownership-sites.mjs` does not exist on disk (2026-08-02)**, so that check defers to `0194`; **⛔ out of scope**: the driver-side clause (`0191`), any `/fkit-task-done` amendment (`0192`), any text-presence test — **ADR-037 §5 names one and does NOT require it**, because a green test asserting the words are on disk reads like one asserting a worker obeyed them; `test/rules-block-budget.test.js` must stay green (all three tests verified green at filing); **appended under `/fkit-task-brief` step 5 by a spawned producer with no owner channel, flagged for owner confirmation — ⚠️ APPEND AND MERIT DIVERGE: on merit it belongs directly above `0143`**, at the very top of the open board, **held back by one honest caveat only** — it cannot ship without the owner's budget call, so ranking it top would head the board with a blocked row; independent; owner: fkit-coder)* | [`0190-add-adr-037s-worker-side-precedence-clause-to-the-universal-rules-block`](../../tasks/done/0190-add-adr-037s-worker-side-precedence-clause-to-the-universal-rules-block/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P169 | Add ADR-037's driver-side clause to the sprint-ship-loop's hard rules *(**follow-up 2 of `0158`/ADR-037**, §3 + §4 — **on the owner's Q2 ruling of 2026-08-02 the ADR binds the DRIVER as well as the worker**, and the worker-side half alone leaves the driver free to issue the instruction that starts the collision; site ruled by §4 as `claude/skills/fkit-sprint-ship-loop/SKILL.md` under its `## Hard rules`, **section verified present at filing**; **no budget constraint applies** — the rules-block ceiling that shapes `0190` does not reach a `SKILL.md`; must state **all three permitted forms by name** — name the ruling, get the ruling first, or do not issue it — because a clause giving only the first reads as a licence to relay; must also carry §3's *"a driver that issues a bare directive into a rule's territory has issued a **defective instruction**, and the worker's conservative branch is the correct response, not an obstruction"*, without which a driver reads an escalation as a failure to follow orders; **⚠️ must NOT claim parity with the worker-side clause** — §4 records the **honest asymmetry**: this clause binds the driver because the driver loads it, and it **reaches no worker**, a weaker surface that *"should not be described as equally strong"*; governs **instance A** (2026-07-27, *"rank on merit rather than append"*, adjudicated **FORBIDDEN as executed**), whose instruction was in **no `SKILL.md`** — it was ad-hoc spawn-prompt text from a live lead session, which is what made it invisible to review; cite ADR-037 **by name, no `:NNN`** (`0176` policy); **⛔ out of scope**: the worker-side clause (`0190`), any other hard rule, the loop's steps / stop conditions / progress reporting, any test; **⚠️ no test reads any `SKILL.md` today**, so a green suite is a regression check and **not** proof the clause landed; **appended under `/fkit-task-brief` step 5 by a spawned producer with no owner channel, flagged for owner confirmation — ⚠️ APPEND AND MERIT DIVERGE: on merit it belongs directly above `0143` and ABOVE `0190`**, because it is the half of ADR-037 that ships with no owner decision, no budget fight and one file touched, and because both recorded instances began at the driver instruction; independent; owner: fkit-coder)* | [`0191-add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules`](../../tasks/done/0191-add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P170 | Decide whether `/fkit-task-done` step 5 needs amending on the ledger-freezing reasoning *(**investigation + ruling, fix shape unknown** — not implementation; **follow-up 3 of `0158`/ADR-037**, which **deliberately does not decide it** and which `0158`'s brief forbade reading out of the instance — left open on the record, by name, twice; **the collision**: `/fkit-task-done` step 5 tells a closing producer to **re-point review-ledger references** into `done/`, and at `0141`'s close on 2026-07-29 a driver instructed the opposite; the worker took the conservative branch and escalated, and **the owner ruled — FOR THAT INSTANCE ONLY — the spawn instruction wins, the ledger stays frozen**, on the reasoning that a ledger records **where the files sat when the findings were raised**, so re-pointing **rewrites evidence** rather than repairing a link, and that every ledger of that run (`0103` `0125` `0147` `0150` `0126` `0141`) carries stale `backlog/` paths **by design**; **⚠️ TWO DOCUMENTS NOW POINT OPPOSITE WAYS ON THE SAME ACT** — step 5 treats a ledger reference identically to a closed sprint plan's href (*"they record what happened, not where a file lives"*), which is the **contrary** conclusion applied to the same class of file; **live on every close, and the count is now three** — `0158`'s own close (2026-08-02) hit it a third time, its producer leaving the moved brief's `review.md` recorded path byte-unchanged and flagging it; must answer five things explicitly — link repair or evidence rewrite; whether step 5 changes and **which bullet** (*"no change"* is a valid finding, but then step 5's wording needs a stated reason it is right); **how far the freeze reaches**, naming ledgers / worklogs / plans / briefs in or out against `0176`'s owner ruling of 2026-08-01 which exempts `done/*/review.md` **ONLY**; what a mover does with a **broken** pointer it must not repair; and whether the moved task's **own** records differ from a sibling's (step 5 has two bullets, instance B was a sibling, `0158`'s close was the own-record case); **interacts with ADR-034 and `0169`** — adjacency, not dependency; **⛔ no implementation** — if the ruling implies a step-5 edit or an ADR-034 amendment, **name it as a follow-up for the producer to file**; **appended under `/fkit-task-brief` step 5 by a spawned producer with no owner channel, flagged for owner confirmation — on merit it belongs directly below `0190`** in the ADR-037 follow-up run, because it is the cheapest of the three to leave open (**no wrong action is in flight** — all three recorded decisions reached the same conservative answer); independent, and it does **not** gate `0190`/`0191`; owner: fkit-architect)* | [`0192-decide-whether-task-done-step-5-needs-amending-on-ledger-freezing`](../../tasks/backlog/0192-decide-whether-task-done-step-5-needs-amending-on-ledger-freezing/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P171 | Repair the stale citations in `0158`'s closed brief *(**follow-up 4 of `0158`/ADR-037** — six stale facts found during `0158`'s own run and **deliberately left live**: per **ADR-034** they sit in the task's **own record**, not its work product, so they were an **accepted residual and not a close blocker**, and `0158` closed on 2026-08-02 carrying them; **editing a closed brief is sanctioned** — `0176`'s owner ruling of 2026-08-01 grandfathers frozen records **by name and the exemption covers `done/*/review.md` ONLY**, so `done/*/brief.md` is in scope; **the six, each verified first-hand at filing 2026-08-02**: (1) the addendum pointer reads `sprint-2.md:245-249`, the text is now at `sprint-2.md@2026-08-02:1069-1073`; (2) the same stale pointer is **repeated in the sprint board row**; (3) `## Priority` reads **122**, the board row reads **P123**; (4) `claude/universal-rules.md` is cited and **that path does not exist** — the file is `claude/scaffold/universal-rules.md`; (5) `0157` described as *"filed alongside this one"* and `0142` as *"check its state first"* when **`0142`, `0157` and `0160` are all closed**; (6) the merit note cites *"immediately below 0142 (P121)"* while the board shows **`0142` at P122** — the bare-rank drift `0159` was spent sweeping out; **⚠️ CONFLICT FLAGGED, NOT PLANNED AROUND — `0180` uses defect 6 as its LIVE SPECIMEN**: `0180`'s guard is measured against `0158`'s *"belongs at 122"*, and its brief states the trap in terms — **reshaping the line into canonical form while keeping the bare number makes the guard PASS it** — so defect 6 must be repaired **in substance, not shape**, and **`0180`'s brief must be updated in the same change** or it ships citing a case no longer on disk; **worth a row because `0158`'s brief is not inert history** — `0176`, `0180` and `0188` all cite it, so its staleness propagates into live scoping; corrections are **dated, never silent rewrites** (`0159`'s convention); **board rank binds, `## Priority` follows it**; coordinates with `0178` (canonical merit form) — use its shapes if it lands first, else step 5's relative folder-ID form, **adjacency not dependency**; **⛔ out of scope**: any other brief's citations beyond `0158` and `0162`, any re-rank, any file move, any wiki write; **⚠️ SCOPE EXTENDED 2026-08-03 BY OWNER RULING** (`AskUserQuestion`, live `fkit-lead` session, 2026-08-02) **to cover the same rank drift in `0162`'s closed brief — defect 7**: `0162`'s `## Priority` reads **127** while its board row reads **P128** (P127 is now held by `0150`), left unrepaired at `0162`'s close because the brief also carries a **long dated 2026-07-29 narrative reasoning from the number 127** (*"P127 is the highest rank reachable"*), so the field alone makes the brief self-inconsistent and both together rewrite a historical record; **the repair is DATED CORRECTION ONLY — the two P127 bullets stay byte-unchanged**, `## Priority` moves to the board value, and `0162`'s board row is not touched at all; **⚠️ the extension did NOT change this row's rank (still P171) and does NOT move it on merit** — defect 7 is the same class as the six already here; **⚠️ THIS BRIEF DECAYS — re-verify every coordinate at implementation time and run it late**; **appended under `/fkit-task-brief` step 5 by a spawned producer with no owner channel, flagged for owner confirmation — on merit it belongs directly below `0192`**, at the bottom of the ADR-037 run and below both clause tasks, because nothing acts on these seven facts today (six in `0158`, one in `0162`) (**wrong in a closed record, not in a running control**) — **not lower still only because three open briefs cite it**; independent; owner: fkit-producer)* | [`0193-repair-the-stale-citations-in-0158s-closed-brief`](../../tasks/backlog/0193-repair-the-stale-citations-in-0158s-closed-brief/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P172 | Assess ADR-037's two clause sites against the ADR-036 registry *(**follow-up 6 of `0158`/ADR-037** — ADR-037 adds two clauses to the repo, worker-side in `claude/scaffold/universal-rules.md` (`0190`) and driver-side in `claude/skills/fkit-sprint-ship-loop/SKILL.md` (`0191`), and **both need assessing against ADR-036's declared skill-ownership site registry**; **⚠️ NOT DOABLE TODAY — three prerequisites, all open**: the registry module `test/skill-ownership-sites.mjs` is **absent from disk, verified 2026-08-02** (it is `0142`'s follow-up, filed as `0189`), and neither clause exists yet; **filed as its own row and NOT as a verification step inside `0190`/`0191` because the ordering is not guaranteed** — if `0189` lands after both clause tasks, a folded-in check is one that was skipped as unrunnable and never revisited, so **a separate row is the only form that survives every ordering**; ADR-037's prediction, **stated so it can be falsified rather than assumed**: both clauses attribute no skill to a role so they are **likely declared non-fact hits**, but `claude/scaffold/universal-rules.md` **is inside ADR-036's declared live surface** so its hit is not automatically noise, and **trigger (e)** (a role name within a proximity window of an ownership verb) is the one most likely to fire; must **score both sites against ALL FIVE triggers (a)–(e), not (e) alone**, classify each into exactly one of three named outcomes — ownership-fact site (registered) / declared non-fact hit / **neither**, a legitimate result — and **state the registry noise count before and after** on ADR-036's measured basis; **⛔ out of scope**: changing either clause's wording, changing ADR-036's triggers or thresholds, building any part of the registry (`0189`), any ADR amendment; **if `test/skill-ownership-sites.mjs` still does not exist the task is `🚧 Blocked`, not done**; **appended under `/fkit-task-brief` step 5 by a spawned producer with no owner channel, flagged for owner confirmation — on merit it belongs directly below `0189`**, its heaviest dependency and the one that unblocks it, because a registry assessment has no value before the registry exists — **append and merit very nearly coincide**, so this is not flagged as a divergence; **depends on `0189`, `0190`, `0191`** — all three open at filing; owner: fkit-coder)* | [`0194-assess-adr-037s-two-clause-sites-against-the-adr-036-registry`](../../tasks/backlog/0194-assess-adr-037s-two-clause-sites-against-the-adr-036-registry/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P173 | Correct ADR-010's `skills_for_role()` source-of-truth claim *(**follow-up 2 of `0143`, and the one it RAISED IN PRIORITY** — this is `0143`'s accepted residual `R4-contradiction-ships`, whose **re-raise condition fires if this has not landed by end of Sprint 2**; **ADR-010 contradicts itself on one screen today**: the ⛔ notice `0143` appended at §Decision 3 names `claude/skills-for-role.sh` as `skills_for_role()`'s home, while its neighbour **§Decision 5 — pre-existing, out of `0143`'s scope — still names `claude/fkit-claude.sh`**, so a reader landing on §Decision 5 alone is told the wrong file; §Context's *"One real inconsistency"* passage carries the same stale pointer **and** presents the `skills:` frontmatter as a live second list; **both facts re-verified 2026-08-02**: `claude/skills-for-role.sh` exists (4,557 B) and **no `claude/agents/*.md` carries a `skills:` key** — it was **dropped** (ADR-012), which is one of the two branches §Decision 5 itself permitted, so **the decision HELD and this is ⚠️ drift, not ⛔ reversal** — the note must say why; **it ships as a contradiction only because the owner's Q4 ruling of 2026-08-02 fenced §Decision 5 out of `0143` and the *"note, not a rewrite"* rule forbade an in-place edit**; ⛔ **APPEND ONLY, `+N / −0`** — prove by `git diff --numstat` + `git diff -U0 \| grep '^-'`, **not by eye**; the header `- **Corrections:**` bullet is the ONE exception (metadata, owner ruling Q3) and must be worklog-justified; ⛔ Status stays `accepted`; ⛔ no new `:NNN`; ⛔ no `wiki-vault/`; ⛔ out of scope by name: `0196`, `0197`, `0198`, `0199`; **notes go BELOW the claim** (`0143` residual `R1-placement`, recorded rationale — do not re-litigate); **two markers only, ⚠️/⛔**; ⚠️ **coordinates with `0196` + `0197`** — all three append to ADR-010, so second and third rebase and re-run the `−0` proof; not blocked on each other, **must not be worked in parallel on the same file**; **⚠️ P173 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly above `0162`**, at the very top of the open board: the only open row repairing a document that contradicts itself in the live tree, the only one carrying an end-of-sprint deadline, and a single-file append with no unknowns; filed by a spawned producer with no owner channel, which never re-ranks (ADR-035); owner: fkit-architect)* | [`0195-correct-adr-010s-skills-for-role-source-of-truth-claim`](../../tasks/done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P174 | Correct ADR-010's `skillOverrides` claims, retired by ADR-018 *(**follow-up 1 of `0143`** — ADR-010 describes the skill lock as a `--settings` **`skillOverrides`** off-list at **two sites**, §Context bullet 2 and §Decision 2; **that mechanism is retired** — ADR-018 replaced it with a `PreToolUse` skill-ownership hook, and the only surviving `skillOverrides` mention in `claude/fkit-claude.sh` is a comment reading *"Retired here (task 43 / ADR-018 …)"* (verified 2026-08-02); **the sharper half is user-visible**: *"hidden from the `/` menu and unrunnable by name"* is **false** — under the hook an unowned skill is **visible but blocked**, so a reader trusting ADR-010 expects absence and gets denial; **⚠️ drift, NOT ⛔ reversal** — §Decision 2's decision *"role separation is enforced structurally, not by instruction"* **stands**, and ADR-018 strengthened it with a different structure; **this is the follow-up `0143`'s own shipped parenthetical promises** (*"deliberately not corrected in this pass … filed as a follow-up so this pass does not mix two unrelated causes"*), fenced out by **owner ruling Q4, 2026-08-02** — **discharge the exclusion, do not reopen it**, and ⛔ **do not edit that parenthetical**, which is a true record of that pass; the reviewer's *"excluded scope"* reading was adjudicated **PARTIALLY CORRECT, not a defect** (`0143` residual `Q4-scope-fence`); ⛔ **APPEND ONLY, `+N / −0`**, header-bullet exception worklog-justified; ⛔ Status stays `accepted`; ⛔ no new `:NNN`; ⛔ no `wiki-vault/`; ⛔ out of scope by name: `0195`, `0197`, `0198`, `0199`, and ADR-018 itself; **notes BELOW the claim**; **⚠️/⛔ only**, and this task writes ⚠️ at both sites; ⚠️ **coordinates with `0195` + `0197`** — same file, serialize; **no deadline, which is why it is a separate brief from `0195`**; **⚠️ P174 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly below `0195`**, same act, same file, same form, no deadline — one architect carries the form across both without re-reading `0143`'s worklog twice; filed by a spawned producer with no owner channel, which never re-ranks (ADR-035); owner: fkit-architect)* | [`0196-correct-adr-010s-skilloverrides-claims-retired-by-adr-018`](../../tasks/backlog/0196-correct-adr-010s-skilloverrides-claims-retired-by-adr-018/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P175 | Resolve ADR-010's remaining stale code line-ranges *(**follow-up 3 of `0143` — INVESTIGATION-FIRST, the repair shape is unknown and *"nothing needed repair"* is a legitimate outcome**; ADR-010 cites code by `path:NNN` in **seven** places and `0143` annotated **three** stale in place (`fkit-lead.md:22-26`, `fkit-claude.sh:190`, and the `:75-86` pointer at §Decision 3), leaving the rest **never assessed** — §Context's menu bullet `fkit-claude.sh:151-187`, its lock bullet `:14-18,192-199` + `:75-103`, the two-lists passage `:75-86`, §Related's `Code:` line, and the `adr-008:106-120` / `:114` citations; **⚠️ one is unverified in a way the others are not**: **`claude/scaffold/CLAUDE.md:12-50` in §Related has never had its contents checked by any task** — measured 2026-08-02 the file is **92 lines**, `:12` is `## The fkit agent team`, and **`:50` lands mid-sentence**, so the range is plausible at its start and arbitrary at its end; **silence on that one fails the task**; **⛔ NOT a mechanical sweep** — the right outcome differs per pointer (lands / drifted / target gone / frozen-record N/A) and a bulk re-numbering would **reproduce the defect in a fresher tense** besides breaching append-only; deliverable is a **per-pointer verdict table in the worklog**, then a single dated ⚠️ note only if the assessment justifies one; ⛔ **APPEND ONLY, `+N / −0`** — **existing `path:NNN` pointers stay byte-identical, stale ones included** (`0143` ruled them the record of what was cited in 2026-07); ⛔ Status stays `accepted`; ⛔ **no new NAKED `:NNN`** — new anchors take `0171`'s form, file plus quoted fragment or heading; ⛔ do not edit the files ADR-010 points at; ⛔ no `wiki-vault/`; ⛔ **out of scope by name: the 12 displaced `adr-010:NNN` pointers in ADR-012/018/031 — those are INBOUND citations and were owner-ruled into `0171`**; this task handles ADR-010's **outbound** citations only; ⚠️ **coordinates with `0195` + `0196`** — same file, serialize, whoever lands last rebases and re-runs the `−0` proof; **⚠️ P175 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly below `0171`**, which supplies the anchor form it writes in — running it earlier means inventing that form twice; filed by a spawned producer with no owner channel, which never re-ranks (ADR-035); soft-depends `0171`; owner: fkit-architect)* | [`0197-resolve-adr-010s-remaining-stale-code-line-ranges`](../../tasks/backlog/0197-resolve-adr-010s-remaining-stale-code-line-ranges/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P176 | Teach `/fkit-record-decision` the dated-correction-note form *(**follow-up 5 of `0143`, and the one `0143`'s OWN BRIEF named and deferred** — *"if `/fkit-record-decision` should learn the shape, say so as a follow-up rather than changing that skill under this brief"*; **the form exists in exactly one place: a closed task folder**; **`/fkit-record-decision` has no notion of amending an ADR at all** — verified 2026-08-02, 165 lines across four steps, template offers only `proposed \| accepted \| superseded \| deprecated`, and the words *amend* and *correct* appear **nowhere** — so an architect needing to record that an accepted ADR's prose went stale has **no procedure** and must re-derive `0143`'s form from `done/`; **this project amends ADRs rather than superseding them**, so a form only one closed task knows is a form the next architect reinvents differently; **five pieces, all owner-ruled or reviewer-ratified, none of them proposals**: (1) the **three-part shape** — ⚠️ drift note, ⛔ reversal notice, header metadata bullet; (2) the **two-marker legend and only two**, with both glosses, because mismarking a drift as a reversal tells readers to stop following a decision that stands; (3) the ***"left byte-identical"* clause** plus the `+N / −0` proof commands, **not by eye**; (4) **🆕 from review round 1 (`R1-placement`) — BELOW-the-claim placement WITH ITS RATIONALE**, a deliberate departure from the vault's *"banner above claim"* convention: **the rationale is not decoration** — without it the next writer reads the placement as an oversight, "fixes" it back, and the form forks; (5) **the header bullet's form** (`R5-header-form`, ratified) — one wrappable metadata item, and **the one part of an `accepted` ADR an append-only correction may extend**, an exception that must be stated or a later writer either breaches append-only unknowingly or leaves the ADR lying about its own annotations; must also say a corrected ADR **stays `accepted`** (the likeliest wrong move is marking it `superseded`) and what a correction note is **not** for; ⛔ do not change how the skill writes a NEW ADR; ⛔ no third marker; ⛔ do not apply the form to any ADR under this task; ⛔ no `wiki-vault/`; ⚠️ edit `claude/skills/…` only — `.claude/skills/` is a gitignored refresh copy; **not dual-homed** — `claude/scaffold/` ships no skills directory (verified 2026-08-02, ADR-027 §Decision 1), **re-check at implementation time**; **⚠️ P176 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly above `0195`**, at the head of the ADR-010 run, because it is the only one of the five that makes the other work **cheaper** rather than more, and every day it is undone is another chance for a second architect to invent a second form — **not ranked higher only because `0195` repairs a live self-contradiction and this repairs a gap**; filed by a spawned producer with no owner channel, which never re-ranks (ADR-035); independent; owner: fkit-coder)* | [`0198-teach-record-decision-the-dated-correction-note-form`](../../tasks/backlog/0198-teach-record-decision-the-dated-correction-note-form/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P177 | Wiki resync of ADR-010's vault page after the correction notes *(**follow-up 6 of `0143` — `fkit-wiki` ONLY, ADR-005**; `0143`'s brief drew the boundary itself: *"Not a wiki task … if a resync is needed it is a follow-up"*; **two claims on the vault page are now false** (read 2026-08-02, re-verify before acting) — it says the sanctioned fix is a *"dated **one-line** correction note appended … an architect call, owner-flagged and **still open**"*: **"still open" is false** (it shipped 2026-08-02) and **"one-line" is false and was a prediction, not a record** — what landed is **three note blocks plus a header bullet, `+71 / −0`**; **the same *"still open"* framing appears elsewhere in the vault and is part of THIS sweep** — at minimum `index.md`'s `0140` entry and two `log.md` entries — **sweep for the claim, not for the coordinates cited here**; **✅ OWNER RULED 2026-08-03 — `log.md` is append-only, no in-place annotation ever** (a correction is a **new dated entry** naming folder ID + durable anchor; originals byte-identical), which **unblocks this row** and **reshapes the sweep**: the `index.md` half stands, the **`log.md` half is unperformable as written**, and **verification step 1 is unsatisfiable as written** because two `log.md` hits must survive — ⛔ **do not satisfy step 1 by editing frozen entries**; **2 open questions recorded in the brief** — what step 1 should assert instead, and whether this row itself appends the correcting log entry; the page must record the ship date + task, the real shape, **the form itself** (⚠️/⛔ legend with both glosses, the *"left byte-identical"* clause, and — flagged, because it departs from the vault's own convention — **below-the-claim placement WITH its rationale**), and **⚠️ `0143`'s live self-contradiction as a gotcha naming `0195`** — *"do not smooth it over"*, because if the page describes ADR-010's current state, the contradiction **is** part of that state; ⛔ **do NOT edit `ai-agents/knowledge-base/`** — flag and route (precedent `0141`, `0148`); ⛔ do not restate `0143`'s notes verbatim, the vault synthesizes; ⛔ do not mark ADR-010 superseded or deprecated; ⚠️ **if `0195`/`0196`/`0197` land first the page must describe THAT state**, not this brief's snapshot — re-read ADR-010 before writing; **why a board row and not routine sync**: `/fkit-wiki-sync` is delta-driven and would update the page *from* the ADR, but would not on its own know to clear the *"still open"* framing in `index.md`/`log.md` or to record the `0195` contradiction — judgement calls with a named verification (**contrast the ADR-037 wiki ingest, deliberately left unfiled 2026-08-02 as genuinely routine**); **⚠️ P177 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly below `0197`**, at the end of the ADR-010 run, because every earlier row changes the state this page must describe and running it first guarantees a second resync; filed by a spawned producer with no owner channel, which never re-ranks (ADR-035); owner: fkit-wiki)* | [`0199-wiki-resync-adr-010s-vault-page-after-the-correction-notes`](../../tasks/backlog/0199-wiki-resync-adr-010s-vault-page-after-the-correction-notes/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P178 | Decide whether Process-review is always `@fkit-coder`, or the architect gains the skill *(**investigation + ruling, fix shape unknown** — not implementation; **"neither (a) nor (b)" is a legitimate outcome**; **the defect, established 2026-08-02 and owner-ruled worth filing** (`AskUserQuestion`, live lead driver session): `fkit-sprint-ship-loop`'s step-2 table row **"Process review"** names `@fkit-coder`, but on this run the driver spawned **`@fkit-architect`** for that step on **three consecutive tasks — `0158`, `0143`, `0195`** — because each deliverable was architect work product (an ADR, and dated correction notes on an ADR), the driver reasoning that the role owning the artifact should process its review; **`/fkit-process-stateful-review` is coder-owned** (the `coder)` arm of `skills_for_role()` in `claude/skills-for-role.sh`; the `architect)` arm does **not** carry it — both re-verified 2026-08-02), so the **ADR-018 `PreToolUse` hook denied the skill**; on `0195` the worker reported the denial verbatim (*"role 'architect' does not own skill 'fkit-process-stateful-review'"*), applied the **method by hand** from the spawn instruction, and **disclosed that it never read the skill's procedure text**; **`0195`'s process-review is being re-run by a coder now** on the owner's ruling, and **`0158`/`0143` closed with architect-written ledgers and are being audited READ-ONLY** (owner-ruled: audit, do **not** reopen); **⚠️ THE HOOK WORKED — this is NOT a bug report against ADR-018**: it caught a real routing error, and the gap is that **the loop's prose and the hook's enforcement disagreed for three tasks before anyone noticed**, surfaced only because one worker chose to disclose it, and that **nothing in the loop says WHY the coder is the right role**, so the next driver re-derives the architect substitution as obviously right; **the question, deliberately NOT pre-decided in the brief** — **(a)** the loop states plainly that Process-review is **always** `@fkit-coder` regardless of deliverable type **and says why**, or **(b)** `skills_for_role()` grants `fkit-process-stateful-review` to `architect` too, **or a third answer**; **the asymmetry, stated as an input and not a ruling: (b) widens a hook-enforced ownership boundary — an authority-model change likely needing an ADR — while (a) is a wording change to one skill file**, and (b) also drags the **four hand-maintained mirrors** named in `claude/skills-for-role.sh`'s own header (`fkit-team` SKILL, `claude/README.md`, `claude/scaffold/CLAUDE.md` which **ships into every consuming project**, and `architecture.md`), whose earlier incompleteness already shipped a false statement downstream (task 70); **a third wrinkle the ruling must address either way**: the table row asks the worker to *"apply `fkit-process-stateful-review` **method**"* — **method**, not *run the skill* — which is close to a licence for the hand-application that occurred; **must answer five things explicitly**: does the step's role follow the **deliverable's author** or is it **structurally the coder**; is *"apply the method"* the right wording; if (b), does granting a coder-owned skill to the architect weaken the **sole-source-write** boundary and what stops the same argument reaching every authoring role; **what makes the next prose-vs-hook disagreement visible in fewer than three tasks** (a detection answer, not only a repair); and whether an ADR is needed — **if so, name it as a follow-up for the producer to file**; **relevant decisions: ADR-018** (the hook, identity-following at any depth), **ADR-012** (`skills_for_role()` is the single declared source of truth — ⚠️ ADR-012 itself names the stale home `claude/fkit-claude.sh`, the same defect `0195` repairs in ADR-010, so cite the file not the ADR's path), **ADR-033** (movers are producer-only — precedent for *"this step belongs to that role, structurally"*), **ADR-037** (accepted 2026-08-02: a skill rule binds a spawned worker unless the instruction relays a **named owner ruling**, and the owner ruled it **binds the driver too** — the substitution here carried **no** owner ruling; ⚠️ ADR-037 §Context says it decides the **content** axis and explicitly **not** the *"which skill may a role run at all"* axis, so it does **not** already answer this), and **ADR-036** (if (b), the change is a new ownership-fact site); **⚠️ a fact defect flagged and NOT repaired here**: `0143`'s `review.md` §Coder response asserts the architect was *"running `fkit-process-stateful-review`"*, which the hook denies at any depth, and **no denial is recorded in that folder** — either the ledger overstates what happened or a denial went unrecorded, and `0158`'s ledger omits the role entirely; **routed to the read-only `0158`/`0143` audit already in flight**; ⛔ **no implementation** — do not edit `claude/skills/fkit-sprint-ship-loop/SKILL.md` or `claude/skills-for-role.sh` under this task; ⛔ do not touch `done/0158-*`, `done/0143-*` or `done/0195-*`; ⛔ no `wiki-vault/`; ⛔ do not reopen ADR-018/033/037; **⚠️ THIS BRIEF DECAYS** — every coordinate was verified against a tree three concurrent workers were editing, re-verify at implementation time; **⚠️ P178 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly above `0162`**, at the top of the open board, because it is the only open row repairing a **live control** — a routing rule that has already misfired three times and will misfire again on the next architect-authored deliverable the same loop ships — where the rows above it repair stale prose; **⚠️ merit contention: `0195` already claims that same position** on the strength of its end-of-sprint deadline, both cannot hold, and **this brief does not resolve it — the owner picks**; filed by a spawned producer with no owner channel, which never re-ranks (ADR-035); independent — `Depends on: nothing`, `Blocks: nothing`; owner: fkit-architect)* | [`0200-decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill`](../../tasks/done/0200-decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P179 | Append dated correction notes to `0143`'s and `0158`'s closed review ledgers *(**record-accuracy cleanup of THREE defects in TWO CLOSED review ledgers — filed as ONE task by owner ruling 2026-08-02** (`AskUserQuestion`, live lead driver session): *append the correction to `0143`'s ledger and **fold `0158`'s two ledger gaps into the same task***, because they share one cause, one artifact class and one authorization gate — **splitting would put three separate owner-authorization requests in front of the owner for the same act**; ⛔ **PRECONDITION, NOT A FOOTNOTE — both folders are CLOSED and this task may not start without explicit owner authorization to write into them**: a landed `✅ Done` is the owner's alone, `/fkit-task-done` step 1 refuses a folder already in `done/` outright, and its **one** exception (the owner-verification upgrade) is reserved to the owner in the same bullet (*"An agent hitting this case still stops: only the owner can upgrade"*) — **both briefs read `✅ Done (agent-closed — not owner-verified)` today, so neither has had the owner's verification pass**; **the three defects, all re-verified first-hand 2026-08-02** — **(1)** `0143`'s `review.md` §Coder response opens *"Written by the **fkit-architect** running `fkit-process-stateful-review` as a bounded worker"*, but that skill is **coder-owned** (`coder)` arm of `skills_for_role()` in `claude/skills-for-role.sh`; **absent** from the `architect)` arm) and the ADR-018 `PreToolUse` hook denies it to the architect identity **at any spawn depth**, while **a search of the whole folder returns NO denial record** — so either the ledger **overstates what happened** (method applied by hand, described as running the skill, exactly what the `0195` worker disclosed doing) **or a denial went unrecorded**, and ⛔ **the note MUST NOT assert which**: a read-only `fkit-coder` audit established the artifacts **cannot distinguish them** (ledgers record authorship and method, not tool calls) — state both and stop, do **not** investigate to break the tie; **(2)** `0158`'s `review.md` header still reads **`Status: in-review`** while the task is **closed and in `done/`** — `/fkit-process-stateful-review` **step 6** requires the flip (*"If all novel findings are closeout / disproven / accepted and nothing blocking remains, set the document header **Status: closed-out**"*) and **nothing was blocking**: its own table records R1/R2/R3 **FIXED** and R4/R5 **ACCEPTED RESIDUAL** on owner disposition; **graded substantive** — a future round or any reviewer opening it reads `in-review` as **live work**; contrast `0143`, which flipped **and** carries a dated close-out comment; ⚠️ **this one defect is NOT obviously an append** — flipping an existing line breaches additions-only, so **two shapes go to the owner and this brief picks neither**: **(i)** leave `in-review` byte-identical and append a dated ⚠️ note that the flip was required and not performed, or **(ii)** perform the flip and append a note recording who/when/why — **(ii) breaches additions-only; (i) leaves a header that actively misreads as live**; **(3)** `0158`'s two accepted residuals carry **What** and a structural **Why** but **no per-entry re-raise trigger** — only a blanket preamble (*"raise a NEW finding only if new evidence changes what they are"*), which is **unfalsifiable**: no reader can tell whether it fired; **⚠️ stronger than first reported — step 6 names `Re-raise-only-if` as a REQUIRED part of the entry** (*"with its full What / Why (structural) / Re-raise-only-if"*), so this is a missing required field, not a style preference; **graded substantive (minor)**, the re-raise condition being the **operative** half of the loop-prevention memory; contrast `0143`'s, which fire on named checkable events (*"if follow-up 2 has not landed by the end of Sprint 2"*, *"if the durable-citation-anchors work is cancelled"*); suggested shapes are **NOT binding** — the implementer proposes, **the owner disposes**; **the form is already established by `0143` and owner-ratified, and a ledger correction follows the same discipline**: false text left **byte-identical**, additions only **`+N / −0`** proven by `git diff --numstat` + `git diff -U0 \| grep '^-'` **not by eye**, dated note **BELOW** the claim (`0143` residual `R1-placement`, recorded rationale — do not re-litigate), **two markers only** ⚠️ (drifted fact) / ⛔ (overturned decision) and **all three here are ⚠️** since no decision is overturned, and **no `:NNN` into a mutable file** — anchor by file + heading + quoted phrase, which bites harder than usual because **this very task shifts line numbers inside both ledgers**; ⚠️ **one form question deliberately unanswered**: `0143`'s form includes a **header metadata bullet**, but a `review.md` header is a different shape — **ask the owner, do not invent one**; ⚠️⚠️ **A GENUINE TENSION THIS TASK MUST NAME AND MUST NOT RESOLVE** — the owner ruled **today** that **review-ledger paths stay frozen because re-pointing rewrites evidence**; appending a dated note is **not** re-pointing, **but it is still writing into a frozen record**, and **`0192` is open to decide exactly where that line sits** (`0192` records that `/fkit-task-done` step 5 treats a ledger reference like any other href — *"they record what happened, not where a file lives"* — the **opposite** conclusion from the owner's instance-B ruling on the same class of file: **two documents in this repo point in opposite directions on the same act**); **this task may be BLOCKED on `0192`, or may be the case that INFORMS it — it does not get to pick**, and ⛔ **must not be cited as having drawn the line**; **cause context, cross-referenced NOT duplicated**: all three defects trace to **one** driver error — the sprint loop's Process-review step routed to `@fkit-architect` instead of `@fkit-coder` on three consecutive tasks (`0158`, `0143`, `0195`) — and **`0200` (filed today, P178) owns the routing question itself**; **this task is the CLEANUP, not the fix**, and it is where `0200`'s own *"routed to the read-only `0158`/`0143` audit already in flight"* lands; **the audit's own conclusion, carried honestly: NOTHING HERE WARRANTS A REOPEN ON ITS MERITS** — no obligation is unmet in a way that changes a decision, misrepresents a finding, or leaves anything undispositioned; **these are record-accuracy defects**, and each note must say so, so a later reader does not mistake a correction note for a re-opened round; ⛔ **out of scope by name**: reopening either task (no status change, no folder move, **no `/fkit-task-done` or `/fkit-task-cancelled` under this task by anyone**); any file in either folder **other than `review.md`**; `backlog/0195-*` (another worker's live territory); deciding `0192`; duplicating `0200` (the loop's prose, `skills_for_role()`, the hook — all untouched); `0158`'s stale brief citations (an ADR-034 accepted residual carried as ADR-037 follow-up 4); `wiki-vault/` (ADR-005); any commit; any re-rank; **`Depends on: 0192`, declared in the SAFE direction and NOT a ruling** — the relationship is genuinely open, gating keeps the board from showing it pullable while the question is live, and **`0192` or the owner may release it, which is not a re-rank**; `Blocks: nothing`; **⚠️ THIS BRIEF DECAYS** — verified against a tree three concurrent workers were editing; re-verification is **mandatory step 3**, not advisory; **⚠️ P179 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly below `0200`** — append and merit **AGREE**, no move needed: it is gated on `0192` which already sits above it, and it is the **lowest-urgency open row** on the board, repairing two records that are already closed and already correct in substance, where every row above it repairs a live control or a document a reader is actively misled by; filed by a spawned producer with no owner channel, which never re-ranks (ADR-035); **owner: fkit-coder** — all three defects sit in coder-side territory (§Coder response is marked `CODER-OWNED`, the header flip is step 6, §Accepted residuals is coder-written with owner approval); ⚠️ **if `0200` rules option (b) this owner field does NOT auto-follow — revisit it**)* | [`0201-append-dated-correction-notes-to-0143s-and-0158s-closed-review-ledgers`](../../tasks/backlog/0201-append-dated-correction-notes-to-0143s-and-0158s-closed-review-ledgers/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P180 | Write `plan.md` at plan approval in the sprint loop, and add the artifact table it lacks *(**follow-up 1 of `0162`'s decision report** (§10 row 1, §9, §0.1) — **the fix for a CONFIRMED LIVE PRODUCTION FAILURE, not a tidy-up**; `/fkit-sprint-ship-loop` writes `plan.md` in its **Build** row (`claude/skills/fkit-sprint-ship-loop/SKILL.md@2026-08-02:103`) while the sibling `/fkit-task-ship-loop` writes it **at plan approval** (`claude/skills/fkit-task-ship-loop/SKILL.md@2026-08-02:142-143`, step 4) and declares it in an **artifact table** (`:100-104`) — **the sprint loop has NO artifact table at all**, verified 2026-08-02 (`grep -i artifact` returns **zero hits**); consequence **F2**: the loop's own verbatim-carry rule needs a `plan.md` to point at **at the Build spawn**, and there is none yet; consequence **⚠️ R4b, dated and evidenced**: asked to supply the approved plan's path/hash, the driver found `0162/plan.md` **is not the approved plan** — the Build worker **authored a re-rendering** instead of copying (two of three distinctive strings absent; `git hash-object` = `2458a57eda55ca774884110e76dee1bf91b6d6e0`) — the recall-versus-copy failure `0162` diagnosed, **on the task that defined it, within hours**; ⛔ **it closes the *reconstruction route* ONLY, NOT the `carried-not-approved` class** (the hash pins which bytes were *carried*, not which were *approved*; structural, ADR-021 leaves approval with no artifact; accepted residual in `0162`'s review ledger) and the brief must say so; ⚠️ **coordinates with `0164` and `0203` on the same file** — non-overlapping regions, **not to be worked in parallel**; ⚠️ **mid-flight hazard recorded**: this edits the driver's own step table while that table drives Sprint 2; **⚠️ OWNER RULED the sequencing** (`AskUserQuestion`, live `fkit-lead` session, 2026-08-02, `0162` OQ-4): **rank now, drive this sprint** — the owner weighed the mid-flight hazard and rejected "after Sprint 2" on the ground that this is **prose in a step table, not running code**; **⚠️ P180 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly above `0154`**, at the very top of the open board, as the only open row repairing a control with a dated live failure against it and the hard prerequisite for two other rows — **append rank and merit diverge by roughly fifty places**; the ruling is a **sequencing** decision and is **not** authority to renumber (ADR-035), filed by a spawned producer with no owner channel; **Blocks 0203 and 0204**; owner: fkit-coder)* | [`0202-write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table`](../../tasks/done/0202-write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P181 | Amend the sprint loop's *"Rules that make this honor the ADRs"* with the faithful-carry construction *(**follow-up 2 of `0162`'s decision report** (§10 row 2, §2, §4) — the prose edit `0162`'s ruling authorizes; the rule at `claude/skills/fkit-sprint-ship-loop/SKILL.md@2026-08-02:110-116` says the Build and Process-review spawn prompts *"MUST each carry the approved plan verbatim"* and **gives no construction for satisfying it**, which is why it fired **zero times** in the run that installed it; **SEVEN required elements (six as filed, ⚠️ a SEVENTH added 2026-08-03 — see below), all of them**: a **byte-exact read** (`Bash(cat …)`-class, **⚠️ explicitly NOT the `Read` tool** — it `cat -n`-frames its output and caps at 2000 lines, and the rule must say why), a **mandatory whole-file check** (e.g. against `wc -c`), **paste unaltered**, a **path + `git hash-object` pointer** (**both paste and pointer — the owner rejected pure by-reference**), the **"verbatim"-word discipline** (***"verbatim" is a word a driver may apply only to bytes it read from a file that turn***), and the **pointer-only degraded form** with **truncation never permissible** — never a partial paste, never a completeness claim over cut bytes; **⚠️ MANDATORY IN THE RULE TEXT ITSELF, owner ruling: the emitted pointer carries `unverified — no hook checks it until follow-up 3 lands`** so a self-computed, self-reported hash is never mistaken for a checked one — **this ships without waiting for `0204`**; ⛔ condition **(b)** stands **byte-unchanged** and `0163` needs **no** edit — do not touch `fkit-coder.md`; **⚠️ ELEMENT 7, added 2026-08-03: a PRESENCE CHECK on both legs before the spawn** — the driver must confirm the pasted bytes **and** the path+hash pointer are **actually in the prompt it is about to send**, and state the result (in the degraded form: pointer present **and** degradation declared); ***"both ways" is a phrase a driver may use only after looking at what it wrote***; **evidence: it happened on `0202`'s own run 2026-08-02** — the driver announced the plan was carried *"BOTH ways — paste and pointer"* and **shipped pointer only**, the same shape as the false certification `R4b` exists to prevent; ⛔ **read it as SUPPORT for elements 3 and 4, never as a case for dropping either — the pointer is what made it detectable**, and with a paste and no pointer (`0158`/`0143`/`0195`) nothing would have surfaced it: **the two-legged construction produced the evidence of its own first failure**; **⚠️ scope grew, the rank did NOT — and on merit the addition does not move this row** (it makes an existing element checkable, not new territory); **⚠️ P181 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly below `0202`**, wherever the owner places it — one fix in two shippable halves, worthless before the first; **Depends on 0202**; owner: fkit-coder)* | [`0203-amend-the-sprint-loops-honor-the-adrs-rule-with-the-faithful-carry-construction`](../../tasks/done/0203-amend-the-sprint-loops-honor-the-adrs-rule-with-the-faithful-carry-construction/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P182 | Build the `PreToolUse`/`Task` carry-check hook and its tests *(**follow-up 3 of `0162`'s decision report** (§10 row 3, §6 `F3`) — `0162` ruled a driver-side machine check **is** possible and the wiring precedent is already shipped (`claude/askuserquestion-marker-hook.sh`, `claude/shiploop-marker-hook.sh`, the ADR-018 skill-ownership hook, all `PreToolUse` entries in `.fkit/settings/<role>.json`); the hook confirms a sprint-loop Build/Process-review spawn prompt contains the exact bytes of the `plan.md` it names at the `git hash-object` blob it names; **⚠️ FIVE caveats, ALL of which the brief carries and the plan must repeat unsoftened**: (1) it checks a **carry-fidelity PROXY for (b)**, **never (b) itself** — (b) asserts the plan was *approved* and no hook reaches approval (ADR-021), so **green does not mean the marker held** and (a)/(c) stay forgeable prose; (2) **HARD-GATED on `0202`** — with no `plan.md` at spawn time the hook either fires on everything or is disabled on everything; (3) **TOCTOU** — time-of-check only, `plan.md` may be rewritten between the hook's read and the worker's use; (4) the siblings' **jq-free `"[^"]*"` extraction is insufficient** for a long multi-line escape-bearing prompt field and must **not** be copied — it needs **real JSON parsing** (`node v24.13.0` verified 2026-08-02, ADR-014 zero-devDeps satisfied); (5) **launcher sessions only** — hooks live in `.fkit/settings/<role>.json`, this repo has **no `.claude/settings.json`** and `.claude/settings.local.json` carries **no `hooks` key**, so spawned/non-launcher sessions are **not covered**; tests must **prove red** via `test/prove-red.sh`; ⛔ **does NOT close the `carried-not-approved` residual** — do not write anywhere that it does; **⚠️ P182 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly below `0203`** — the only member of the trio that turns prose into a check; **Depends on 0202 (hard gate)**; owner: fkit-coder)* | [`0204-build-the-pretooluse-task-carry-check-hook-and-its-tests`](../../tasks/backlog/0204-build-the-pretooluse-task-carry-check-hook-and-its-tests/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P183 | Append a dated correction note to ADR-037 §5's enforcement claim *(**follow-up 4 of `0162`'s decision report** (§10 row 4, §7) — **REQUIRED by the owner's OQ-3 ruling**, and ruled an **ADR amendment, not a report note**; ADR-037 §5 states *"There is no mechanical enforcement, and none is possible"* (`adr-037-…@2026-08-02:249-250`) and `0162`'s `F3` establishes that is **too strong — but only about a proxy**; the note must state **five** things: *"none is possible"* **holds for (a), for (c), and for (b) as written** (b reads *"a concrete **approved** plan verbatim"*, `adr-037@2026-08-02:96-97` / `claude/agents/fkit-coder.md@2026-08-02:65-66` — approval has no artifact, ADR-021); what it does **not** hold for is a **carry-fidelity proxy for (b)**, checkable **driver-side** by a `PreToolUse`/`Task` hook once `plan.md` exists at spawn time; ⛔ **it must NOT say condition (b) itself is machine-checkable** — the single most important wording constraint, verified by a zero-occurrence grep; it is a **NARROWING, not a reversal** (all three conditions still unverifiable as written, conjunctive marker only as strong as its weakest signal, **launcher sessions only**, **time-of-check only**); and **ADR-037's pre-registered re-raise trigger has NOT fired** (`@2026-08-02:362-364`, *"a cross-context verification token"* — **a file is not a token**), nor are the fenced items at `:365-367` re-raised; ⛔ **APPEND ONLY, `+N / −0`** proved by `git diff --numstat` + `git diff -U0 \| grep '^-'`, **not by eye**; ⛔ Status stays `accepted`; **notes go BELOW the claim** (`0143` residual `R1-placement`, recorded rationale — do not re-litigate); precedent form: `0143`'s correction notes and the form `0195` extended; **related but NOT a dependency: `0198`** (teach `/fkit-record-decision` the note form) — follow it if it lands first; **⚠️ P183 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly below `0204`** — record accuracy over a live ADR, real but not urgent; independent; owner: fkit-architect)* | [`0205-append-a-dated-correction-note-to-adr-037-section-5s-enforcement-claim`](../../tasks/backlog/0205-append-a-dated-correction-note-to-adr-037-section-5s-enforcement-claim/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P184 | Ingest the faithful-carry decision report into the wiki *(**follow-up 8 of `0162`'s decision report** (§10 row 8) — `fkit-wiki` **ONLY**, ADR-005; ingest `ai-agents/knowledge-base/reports/2026-08-02-faithful-carry-of-an-approved-plan.md`, which rules on what *"carry the approved plan verbatim"* means across `/fkit-sprint-ship-loop` and interacts with ADR-021/031/032/037; **two things the ingest must preserve or the page is worse than none**: the report's §0 **checkable-vs-testimony** evidence separation (the two driver-conduct failures are **self-report, not verifiable from disk** — no session transcripts exist in this repo), and the accepted residual **`carried-not-approved`** (§9, §11 — the hash pins which bytes were *carried*, not which were *approved*; **`0202` closes only the reconstruction route, not the class**); **also flag, do not silently repair**: `0162`'s folder moved to `tasks/done/` on 2026-08-02, so any vault link to its old `backlog/` path is the wiki role's repair (the movers deliberately never touch the vault); **may be batched into one wiki session with `0199`** as a scheduling convenience — **not a merge**, different sources; **⚠️ P184 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly below `0205`** — it records knowledge rather than changing behaviour and reads best once the corrections above it settle; independent; owner: fkit-wiki)* | [`0206-ingest-the-faithful-carry-decision-report-into-the-wiki`](../../tasks/backlog/0206-ingest-the-faithful-carry-decision-report-into-the-wiki/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P185 | Append a dated correction note to ADR-020 naming the **driver** a sanctioned `plan.md` writer *(**follow-up 1 of `0202`'s review** — finding `R1`, verdict **CORRECT**, *Defect (documentary)*, owner-dispositioned `deferred → follow-up (owner ruling)`; `0202` made the sprint-loop **driver** write `<task-folder>/plan.md` at plan approval and cited ADR-020 for it, but **ADR-020's Decision sentence (`adr-020-…:34`) calls these artifacts *"coder-written"*** — verified 2026-08-03; ✅ **its timing clause (`:39`, *"at plan approval"*) already fits and needs no change**, so only the *writer* attribution is corrected; **form per `0143`, extended by `0195`** — do not invent a third shape; **`claude/skills/fkit-sprint-ship-loop/SKILL.md` keeps its ADR-020 citation byte-unchanged** (owner-dispositioned: the citation is not the defect, the ADR is); ⛔ **SETTLED, NOT TO BE REOPENED — Codex recommended the opposite fix** (keep *coder-written* and have the driver **delegate** the `plan.md` write to a bounded coder spawn); **the reviewer ruled that RECREATES `R4b`** — the confirmed live failure where a spawned worker handed an approved plan **authored a re-rendering instead of copying it** (`0162`, `git hash-object` = `2458a57eda55ca774884110e76dee1bf91b6d6e0`) — **and the owner agreed**; the brief must state the ruling and must not re-weigh the option; **⚠️ P185 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly below `0205`**, the same class of work with the same owner role, and it is **not urgent** — the shipped behaviour is correct and only the record disagrees; **append and merit are close here, a few places**; independent; owner: fkit-architect)* | [`0207-append-a-dated-correction-note-to-adr-020-naming-the-driver-a-sanctioned-plan-md-writer`](../../tasks/backlog/0207-append-a-dated-correction-note-to-adr-020-naming-the-driver-a-sanctioned-plan-md-writer/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P186 | Add an exit-table row for a failed **Build/Verify/Review** spawn in the sprint loop *(**follow-up 2 of `0202`'s review** — finding `R5`, verdict **CORRECT**, *Defect (process gap, not documentary)*, owner-dispositioned `deferred → follow-up (owner ruling)`; `/fkit-sprint-ship-loop` §5.4's exit table (`claude/skills/fkit-sprint-ship-loop/SKILL.md@2026-08-03:243-256`, nine rows) has a terminal state for a failed **producer** spawn (*Blocked — hand-off didn't land*) and **none for a Build, Verify or Review spawn that fails, is denied, or returns nothing** — verified 2026-08-03; **the gap went live when `0202` landed**: the driver now writes `<task-folder>/plan.md` **before** the Build spawn, so a failed Build **orphans a durable approved-plan artifact** for a task nobody is working; **the resume guidance exists but is unreachable** — it sits in `ai-agents/tasks/done/0202-…/worklog.md:60-74`, and **no future driver reads another task's worklog**; the new row must name the status written in **both** locations (satisfying §5.4's own *"no path ends in silence"* invariant) **and say what happens to the already-written `plan.md`** and what a resuming driver does on finding one; ⚠️ **contended file** — `0203` edits the Rules bullet, `0164` the Build row; §5.4 is a third region, **not to be worked in parallel**, second to land re-verifies coordinates; **⚠️ P186 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly below `0203`** — it repairs a **running control executing right now**, not a record, which puts it above `0205`/`0207` and `0206`; **append and merit diverge by roughly four places**; independent; owner: fkit-coder)* | [`0208-add-an-exit-table-row-for-a-failed-build-verify-review-spawn-in-the-sprint-loop`](../../tasks/done/0208-add-an-exit-table-row-for-a-failed-build-verify-review-spawn-in-the-sprint-loop/brief.md) |
| ➡️ Moved to [Backlog](../backlog.md) | P187 | Add an *"out of scope by owner ruling"* Status value to **both** stateful-review schemas *(**follow-up 4 of `0202`'s review — raised by the run itself, not by a finding**; the ledger Status vocabulary is declared **twice and identically** — `claude/skills/fkit-stateful-review/SKILL.md@2026-08-03:74` and `claude/skills/fkit-process-stateful-review/SKILL.md@2026-08-03:85` (`pending approval` · `✅ done` · `won't fix (frontier)` · `disproven` · `closeout (re-litigation)` · `blocked`) — and **has no value for a finding that is CORRECT, accepted, and out of scope by owner ruling**; **the evidence is `0202`'s own ledger**: `R1`, `R5` and `R6` all landed in exactly that state and the processing worker wrote **`deferred → follow-up (owner ruling)` — out of vocabulary, deliberately** — because `won't fix (frontier)` would have **falsely branded three correct findings as accepted tradeoffs the team declined**, when in fact a fix IS coming and each has a filed row; **⚠️ THE TWO SCHEMAS MUST CHANGE TOGETHER OR THE LEDGER FORKS** — both skills write the **same** `review.md`, so a value added to one and not the other has one party writing a status the other's schema rejects; the wording must be **byte-identical in both files**, must carry the rule distinguishing it from `won't fix (frontier)`, and must **require a destination pointer** (a deferral with no destination is indistinguishable from a dropped finding); ⛔ **Status column only — the Verdict vocabulary is out of scope**, as are the ephemeral `/fkit-review` pair and `0202`'s already-written ledger; **⚠️ P187 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly below `0208`** — also a running control, above the documentary corrections, but below `0208` because a missing exit row can orphan an artifact mid-run while this costs ledger honesty and the field already worked around it correctly; **append and merit diverge by roughly three places**; independent; owner: fkit-coder)* | [`0209-add-an-out-of-scope-by-owner-ruling-status-value-to-both-stateful-review-schemas`](../../tasks/backlog/0209-add-an-out-of-scope-by-owner-ruling-status-value-to-both-stateful-review-schemas/brief.md) |
| ✅ Done (agent-closed — not owner-verified) | P188 | Specify and support the **reverse move** — sprint → Backlog board *(**filed into Sprint 2 by explicit OWNER RULING, `AskUserQuestion`, live lead session 2026-08-03** — ⚠️ **this is an owner-instruction exception, NOT a justification-1 or -2 pass** under the standing rule adopted the same session, and **must not be cited as precedent**: nothing emits a `Moved to Backlog` marker today so no live control is broken, and no surviving Sprint 2 row depends on it; the forward move backlog→sprint is specified **in full in two places** — `ai-agents/sprints/backlog.md` and `claude/skills/fkit-task-brief/SKILL.md` — while **the reverse is specified nowhere and is unsupported by tooling**; cause verified first-hand 2026-08-03 at `claude/skills/fkit-status/dashboard.sh@2026-08-03:681`, whose target regex matches **only** `Sprint <digits>`, so a `Backlog` target yields an empty `moved_target` → permanent `drift nonconformance kind="moved-without-target"` (`:708`) on **every such row forever** plus a literal **`in Sprint ?`** Next-step cell (`:817`) — **reproduced end-to-end on a fixture**; ⚠️ **the obvious BRE fix `\|` alternation SILENTLY DOES NOTHING ON macOS** — BSD sed does not support it, exits 0, prints nothing, and the patched copy produced **byte-identical broken output**; verified working on this machine: `sed -nE 's/.*Moved to \[*(Sprint [0-9]+\|Backlog).*/\1/p'`, which returned a **completely clean** fixture and removed `in Sprint ?` as a **side effect**; scope is the marker form documented beside the forward form in both files, the parser change, the **four** mandatory edits — three mirroring the forward form **plus the brief's `## Priority` → `Unscheduled`, which has no forward analogue and which NOTHING enforces** (`dashboard.sh` performs no `## Priority` drift check at all) — a decision on **what happens to rank** (recommend: rank surrendered, sprint row keeps its historical `P<n>`), and contract tests in `test/dashboard-contract.test.js`; **`test/prove-red.sh` cannot cover the new branch today** — all thirteen mutations target the launcher via `FKIT_LAUNCHER` and the dashboard suite is deliberately not routed through it, so wiring it is a **test-architecture change, handed back as a follow-up, not built here**; **⚠️ P188 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs FAR higher: it gates the 45 owner-authorized sprint-2→backlog moves and closes a gap that has bitten this board twice**; appended anyway because a spawned producer has no authority to insert into the owner's ranking (ADR-035; tasks 0157/0158); **blocks the 45 moves, the `0146`→`0144` merge, and the `0149`→backlog ruling** — see the 2026-08-03 triage addendum; owner: fkit-coder)* | [`0210-specify-and-support-the-reverse-move-sprint-to-backlog`](../../tasks/done/0210-specify-and-support-the-reverse-move-sprint-to-backlog/brief.md) |
| ➡️ Moved to [Sprint 3](../sprint-3.md) — priority P3 | P189 | Record **ADR-038** — a loop step's role is fixed by the skill the step runs, not by the deliverable's author *(**filed on a NAMED OWNER RULING, `AskUserQuestion`, live lead `/fkit-sprint-ship-loop` driver session 2026-08-05** — *authorize a producer follow-up to file ADR-038*; **the ONLY one of the EIGHT follow-ups named in `0200`'s report that the owner has authorized — the other seven are held for the owner and deliberately NOT filed**; **⚠️ DATED CORRECTION 2026-08-06 — the clause immediately above was true on 2026-08-05 and is FALSE now: ZERO remain unfiled, and the count itself was wrong (report §8 item 6 is struck through IN THE REPORT and folded into item 3, so there were SEVEN distinct follow-ups, not eight — *"the other seven"* should have read *"the other six"*). Items 1/3/4/5 → `0223`/`0224`/`0225`/`0226` filed 2026-08-05; items 7/8 → `0232`/`0233` filed 2026-08-06 on a named owner ruling, verbatim **"File both now."** ⚠️ **The `Blocks:` rationale below is ALSO wrong**: scored per item, `0222` is a real blocker for **at most ONE** of the six (`0223`, and only its reason clause) — `0224` is a mechanism, `0225` a test, `0226`/`0232` fact repairs, `0233` an ADR-036 question; ⛔ but note three of the four filed on 2026-08-05 (`0223`/`0224`/`0225`) **DO declare `Depends on: 0222`**, so the weakness is on merit, not in what the briefs say — **an open question for the owner, NOT changed by a producer**. **Original clause left byte-identical; the ADR's decision, scope and rank are unaffected. Full accounting in this board's `0222` addendum and in the brief's §Notes.**; records a decision **already taken** by `0200` (closed 2026-08-05): *"the Process-review step's role is fixed by the skill the step runs, not by who wrote the deliverable: it is always `@fkit-coder`"*, recommending **(a)** with the row's *"apply … **method**"* wording **kept and enumerated** plus **(c)'s PAIRED detector as a non-optional companion**, and **rejecting (b)** (granting `fkit-process-stateful-review` to `architect` in `skills_for_role()`); **division of labour, so it is not re-litigated: the ADR records the decision, the report carries the reasoning** — `ai-agents/knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md` (§6 why an ADR is needed, §7 the recommendation, §8 item 2 this follow-up) — **cite it by path, do not re-narrate it**; **why an ADR and not a table row**: it closes an axis **ADR-037 §Context explicitly left open** (*"Not decided here (the invocation axis): which skill a role may run at all"*), the rule **generalizes to every step in every loop**, and recording **(b)'s rejection** is what stops the next architect-authored deliverable re-opening it; **⚠️ MANDATORY FOUR-WAY NUMBER SWEEP before allocating** — `decisions/`, `reports/`, the sprint boards **AND** `wiki-vault/` (read-only, ADR-005) — `adr-037` is highest on disk today so **038 is LIKELY but MUST NOT be assumed**: the **ADR-029 precedent** is that a number was once claimed **everywhere except `decisions/`**, so sweeping `decisions/` alone is exactly the check that already failed once; **the ADR must state the accepted tradeoff honestly — the rule stays PROSE**: the ADR-018 hook gates skill **invocation**, and a driver that spawns the wrong role and tells it to work **by hand** never reaches the gate, so this is a prose rule plus a durable detector **in place of prevention**, the same shape ADR-033 states about its own residual; must carry a **`Re-raise only if`** clause; **⚠️ two ACCEPTED RESIDUALS in the source report must NOT be copied forward**: the §7 mirror-cost figure reads **"8 files / 9 sites"** where ledger residual **R15** records the true figure as **7 files / 8 sites** (re-count or omit — the count belongs to the rejected option (b)), and **R18** — *"outside the denied worker's control"* **overstates**, since **ADR-022** leaves every role but the adversarial reviewer tool-unrestricted; ⚠️ **phrase the rule so it does NOT re-impose the per-round owner gate ADR-019/ADR-032 deliberately replaced** with the loop's single up-front approval (report finding **R1**, owner-re-scoped); ⚠️ **ADR-012 names the stale home `claude/fkit-claude.sh` for `skills_for_role()` — it lives in `claude/skills-for-role.sh`; cite the file, not the ADR's path**; ⛔ **no implementation** — no edit to `claude/skills/fkit-sprint-ship-loop/SKILL.md`, `claude/skills-for-role.sh`, `claude/skill-ownership-hook.sh` or `test/`; ⛔ do not reopen ADR-018/033/037; ⛔ no `wiki-vault/` write; ⛔ no commit, no re-rank, no task-file move; **⚠️ P189 is APPEND rank, NOT merit — flagged for owner confirmation. On merit this belongs directly above `0203`**, the highest-ranked open row on this board, because `0203` and `0208` both amend the same sprint-loop skill this ADR governs and **every implementation follow-up the ruling implies will want to cite an ADR number rather than a report path**; filed by a spawned producer with no owner channel, which never re-ranks (ADR-035); `Depends on: nothing`; **`Blocks:` the seven unfiled `0200` follow-ups**; owner: fkit-architect)* | [`0222-record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs`](../../tasks/done/0222-record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs/brief.md) |

### ⚠️ Addendum 2026-08-06 — this board now reports TWO drift records, and they are CORRECT. Do not "fix" them.

**A `/fkit-status` run on this board emits:**

```
drift disagreement 0181 plan="➡️ Moved to [Backlog](../backlog.md)" brief_sprint="Sprint 3" moved_target="Backlog"
drift disagreement 0182 plan="➡️ Moved to [Backlog](../backlog.md)" brief_sprint="Sprint 3" moved_target="Backlog"
```

**⛔ DO NOT REPAIR THESE BY REWRITING THE ROWS.** Rows `P159` (`0181`) and `P160` (`0182`) say
*"Moved to Backlog"* because **that is what happened** — both were de-scoped from Sprint 2 to the
Backlog board on 2026-08-03, as part of the 45 owner-authorized de-scopes. On **2026-08-06** they were
pulled **from the Backlog board into [Sprint 3](../sprint-3.md)** by owner ruling. Changing these rows
to read *"Moved to Sprint 3"* would assert a move that **never happened** and would erase the Backlog
hop. **The marker is frozen history and is accurate. The brief is accurate. Both are right.**

**What the drift record actually means.** Drift rule 2 compares a row's `Moved` target against the
brief's **current** `## Sprint`. That comparison silently assumes **a task moves at most once**. A task
that goes **sprint → Backlog → sprint** breaks the assumption: the historical marker and the live brief
disagree *by construction*, and no edit to either can make them agree without one of them lying.

**⚠️ This is NOT a consequence of archiving this board** — it is a consequence of the round-trip, and it
would read identically had this file stayed at `ai-agents/sprints/sprint-2.md`.

**⚠️ Scope, which is the part worth reading.** **45 rows on this board read `➡️ Moved to [Backlog]`.**
Every one of them that is ever pulled into a future sprint will add one more permanent drift record
here, by the same mechanism. Two today; the ceiling is 45. **This is a defect in the drift rule, not in
these rows, and it needs a filed task** — it is recorded in
[Sprint 3](../sprint-3.md) §"Known follow-ups this rollover created".

### Promoted by OWNER RULING 2026-07-29 — 0165 raised from P143 to P129

**Authority, stated first and in full — before any outcome.** This promotion was **ruled by the owner**,
on **2026-07-29**, via **`AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session**. It was
executed by a spawned `fkit-producer` **on that instruction**. The producer had **no owner channel** and
contributed **no merit judgment of its own** about whether 0165 deserved raising. **This is not producer
precedent for re-ranking.**

The authority goes before the outcome for a reason this board has already paid for: an earlier addendum
recorded a placement's *outcome* more visibly than its *authority*, and that omission was later read as
licence to re-rank unbidden — the failure that produced tasks **0157** and **0158**.
`/fkit-task-brief` step 5's *"do not renumber or insert into the owner's ranking"* protects **the
owner's** ranking from an agent acting alone; **it is not a bar on the owner re-ranking their own
board.** This is the owner doing exactly that.

**What was ruled, and the owner's reasoning in the owner's own terms.** Move **0165**
(`decide-where-a-check-on-the-wiki-flags-emitted-form-can-live`) from its appended rank to sit
**immediately below 0154**, adjacent to the `0162`/`0154` pair at the top of the open region. The
reasoning: of the three tasks on this surface, **0165 is the only one that addresses the emission rather
than the source text — and therefore the only one that would have caught the `0141` flag failure.** A
previous producer established, checkable on disk, that **`0154` would have been green throughout that
failure**, because the required strings were present in all three wiki `SKILL.md` files the whole time
(`fkit-wiki-ingest/SKILL.md:72`, `fkit-wiki-sync/SKILL.md:116`, `fkit-wiki-lint/SKILL.md:81`), while the
deviation on disk at `ai-agents/wiki-vault/log.md:623` was in the **emitted** form. Leaving 0165 fifteen
slots below two tasks that would not have caught the defect **inverts their actual value**.

**0162 stays at P127 and 0154 stays at P128 — neither was touched.** The owner **confirmed the previous
producer's refusal** to infer *"lower 0162"* from *"raise 0154"*; that judgment was correct and is
upheld here. **0166 stays where it was appended, at P144** — no change was ruled, and none was made. Its
own append-confirmation flag **stands, undischarged**.

**No `✅ Done`, `⛔ Cancelled` or `➡️ Moved` row was renumbered.** Verified after the edit: the whole
affected region **P129–P143 is contiguous `🔲 Backlog`**; the closed rows at P125/P126 sit above it and
were not reached. The two owner-ruled ranks above the region (P127, P128) were not reached either.

| Task | Was | Now | Why |
|---|---|---|---|
| **0162** | 127 | **127** | **Untouched.** Owner-ruled placement of 2026-07-29 preserved, and the refusal to lower it explicitly upheld by the owner. |
| **0154** | 128 | **128** | **Untouched.** Owner-ruled promotion of 2026-07-29 preserved. |
| **0165** — decide where a check on the wiki flag's **emitted form** can live | 143 | **129** | **Owner-ruled promotion, 2026-07-29.** The only one of the three that guards the emission, and so the only one that would have caught the `0141` failure. See the reasoning above. |
| **0157** | 129 | **130** | Displaced one place. **Nothing re-judged.** |
| **0161** | 130 | **131** | Displaced one place. Not re-judged; **still immediately below 0157**. |
| **0148** | 131 | **132** | Displaced one place. Not re-judged. Still **after 0147**. ⚠️ **Only its `## Priority` field was edited** — a concurrent wiki worker was active, so nothing else in that task folder was touched. |
| **0144** | 132 | **133** | Displaced one place. Not re-judged. |
| **0145** | 133 | **134** | Displaced one place. Not re-judged; **still after 0144**. |
| **0146** | 134 | **135** | Displaced one place. Not re-judged. |
| **0152** | 135 | **136** | Displaced one place. Not re-judged. |
| **0149** | 136 | **137** | Displaced one place. Not re-judged. |
| **0155** | 137 | **138** | Displaced one place. Not re-judged. |
| **0156** | 138 | **139** | Displaced one place. Not re-judged; **still adjacent to 0155**. |
| **0159** | 139 | **140** | Displaced one place. Not re-judged. |
| **0160** | 140 | **141** | Displaced one place. Not re-judged. |
| **0163** | 141 | **142** | Displaced one place. Not re-judged. |
| **0164** | 142 | **143** | Displaced one place. Not re-judged; **still adjacent to 0163**. |
| **0166** | 144 | **144** | **Untouched.** Ruled to stay where it was appended. |

**Existing rows moved, and why: fourteen, all pure displacement, none re-judged** — each +1. **Every
relative order among the displaced tasks is preserved.** The protected orderings were checked by name
after the edit: 0163/0164 adjacent ✅, 0148 after 0147 ✅, 0144 before 0145 ✅, 0155/0156 adjacent ✅,
0161 immediately below 0157 ✅.

**Each moved brief's own `## Priority` field was updated to match** — fifteen briefs (0165 plus the
fourteen displaced), board rank and brief field verified to agree 1:1. Board cells render `P<n>`; the
brief field stays a plain number, per `conventions/priority-is-rank-not-identity.md`. **No row's status,
description, href or link label was touched** — only rank cells moved, plus the one row reordered.

⚠️ **Line-number citations elsewhere in the repo may now be stale, and were deliberately NOT repaired.**
This edit reordered the region and grew `sprint-2.md` by the length of this addendum, so any
`sprint-2.md:NNN` pointer aimed at or below the board may now name the wrong line. Per the owner's
standing rulings, **`0159` re-verifies its own citations at implementation time and `0160` decides the
durable fix** — this pass measured and reported the impact rather than repairing it.

### Promoted by OWNER RULING 2026-07-29 — 0154 raised from P131 to P128

**Authority, stated first and in full — before any outcome.** This promotion was **ruled by the owner**,
on **2026-07-29**, via **`AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session**. It was
executed by a spawned `fkit-producer` **on that instruction**. The producer had **no owner channel** and
contributed **no merit judgment of its own** about whether 0154 deserved raising. **This is not producer
precedent for re-ranking.**

The authority is stated before the outcome deliberately, and for a reason this board has already paid
for once: an earlier addendum here recorded a placement's *outcome* far more visibly than its
*authority*, and that omission was later read as licence to re-rank without one — the failure that
produced tasks **0157** and **0158**. `/fkit-task-brief` step 5's *"do not renumber or insert into the
owner's ranking"* protects **the owner's** ranking from an agent acting alone; it is not a bar on the
owner ranking their own board. **A re-rank is the owner's call.** This is that call.

**What was ruled, and the merit stated.** Raise **0154** (`build-wiki-flag-convention-test`) to a rank
reflecting that **this run has now produced direct evidence for it**. The evidence is the consumer's own
testimony: a spawned `fkit-producer`, asked at `0141`'s close whether it would have caught the
non-conforming wiki flag, answered **"No. I would have acted on it without noticing"**, and concluded
***"on this run 'carried verbatim' was decorative, not a control"***. **0154 is the only filed work that
can make the flag form a real control.** The deviation itself is on disk at
`ai-agents/wiki-vault/log.md:623`.

**⚠️ Placed at P128, immediately BELOW 0162 — not at P127. Read why before treating this as a ceiling.**
Three constraints bounded the placement, and the producer applied all three rather than resolving any of
them on its own judgment:

1. **`✅ Done`, `⛔ Cancelled` and `➡️ Moved` rows are never renumbered**, not even under an owner ruling.
   **P126 is `✅ Done`** (0150) and **P125 is `✅ Done`** (0147), so the top of the contiguous open region
   is **P127** — the same wall 0162's placement hit hours earlier, and the same one this placement
   respects.
2. **P127 is an owner-ruled placement made today** (0162). Promoting 0154 *into* P127 would have pushed
   an owner-ruled rank down **on producer judgment**. The owner ruled that 0154 be raised; the owner did
   **not** rule that 0162 be lowered. **The producer declined to infer the second from the first.**
3. The two tasks are the **same class** — a *"carry this verbatim"* requirement with no construction and
   no check behind it, 0162 for the driver→worker plan, 0154 for the worker→caller flag. **P128 puts
   them adjacent**, which is the outcome the merit argument actually supports.

**Open for the owner: if the intent was 0154 at the top of the open region, that means P127 and 0162
moves to P128.** Say so and it will be done. **It was not assumed.**

**No `✅ Done`, `⛔ Cancelled` or `➡️ Moved` row was renumbered.** Verified after the edit: the whole
affected region (P127–P131) is `🔲 Backlog`, and the closed rows sit above it and were not reached.

| Task | Was | Now | Why |
|---|---|---|---|
| **0162** | 127 | **127** | **Untouched.** Owner-ruled placement of 2026-07-29 preserved — see constraint 2 above. |
| **0154** — build `test/wiki-flag-convention.test.js` | 131 | **128** | **Owner-ruled promotion, 2026-07-29.** Merit: the consumer that would have to enforce the flag form has stated on the record that it cannot. See the authority note above. |
| **0157** | 128 | **129** | Displaced one place. **Nothing re-judged.** |
| **0161** | 129 | **130** | Displaced one place. Not re-judged; **still immediately below 0157**, the protected ordering from the 2026-07-27 fourth re-rank. |
| **0148** | 130 | **131** | Displaced one place. Not re-judged. Still **after 0147** — one wiki pass over the ADR-032 page, not two. ⚠️ **Only its `## Priority` field was edited**; a concurrent worker was reading that task folder, so nothing else in its brief was touched. |

**Existing rows moved, and why: three, all pure displacement, none re-judged** — each +1. **Every
relative order among the displaced tasks is preserved.** The orderings this board protects were checked
by name after the edit: 0161 immediately below 0157 ✅, 0148 after 0147 ✅, 0144 before 0145 ✅, 0155
before 0156 ✅, 0163 adjacent to 0164 ✅.

**Each moved brief's own `## Priority` field was updated to match** — four briefs (0154, 0157, 0161,
0148), board rank and brief field verified to agree 1:1. Board cells render the rank token `P<n>`; the
brief field stays a plain number, per `conventions/priority-is-rank-not-identity.md`. **No row's status,
description, href or link label was touched** — only rank cells moved, plus the one row reordered.

⚠️ **0154's brief carries a stale self-description in its own `## Notes`** — a *"Ranking note"* that says
*"Placed at **127** … The ranking is producer judgment, not an owner ruling."* That was true when
written on 2026-07-27 and is now wrong twice over: the rank is **128**, and the current rank **is** an
owner ruling. **A dated correction has been appended to that brief rather than rewriting the original
line**, per this board's standing practice. The stale *number* is also in `0159`'s sweep territory.

### Addendum — task 0167 added out of band (2026-07-30): the sprint driver has no procedure for a worker that dies

**Appended under `/fkit-task-brief` step 5 as written — at P145, after the existing highest priority
(P144). Nothing was renumbered or inserted. Flagged for owner confirmation.** The driver that
commissioned this brief gave **no placement instruction**, and none was invented. (An earlier driver
prompt that *did* override step 5 is what produced tasks `0157` and `0158`; the owner ruled that it stop.)

**Merit, stated so the owner can rank it deliberately — it could reasonably go either way:**

- **For a higher rank:** the gap has fired **twice in two consecutive driver runs**, and both times it
  consumed live owner attention that a written procedure would have saved. Recurrence in consecutive runs
  is the strongest empirical signal any item on this board currently carries.
- **For the tail append:** **both recoveries succeeded and no work was lost.** The class was already put
  to the owner and **ruled an accepted residual on 2026-07-22** (`0111` R6). Nothing is on fire, and the
  ruling this task produces changes no shipped behaviour by itself.

**The producer's own read: merit is above the tail but below the promoted items.** It was appended anyway,
because ranking it there is a placement judgment the producer is not authorised to make. **The merit/append
gap is small — a handful of slots, not fifteen.**

**Judgment recorded, because it decides what this task even is: `0167` is filed as an INVESTIGATION, not
an implementation.** `/fkit-task-brief` step 2 forbids an implementation brief for work whose shape is
unknown, and the shape here is genuinely unknown — the task's own third question is *whether the exit table
needs a row at all*, and its fourth is whether the real fix is the **missing durable-state section** rather
than a row. Filing a "add the row" brief now would presuppose both answers. **No sibling implementation
brief was filed**; `0167` names its follow-ups instead. This mirrors `0160`/`0166`, not `0134`/`0135` —
`0134` could file its implementation alongside because the ADR's three target files were already known.

**⚠️ Two claims behind `0167` are testimony, not disk, and the brief says so.** The two crash instances
were reported by the driver session that performed the recoveries. Instance 2's landed edit
(`wiki/systems/testing-and-verification.md`, `+4/−0`) **is** checkable on disk. **Instance 1 — the `0118`
Build-worker death and its `SendMessage` resume — is not independently verifiable from the brief's
evidence** and should be confirmed against `0118`'s folder before the ruling leans on it as a second data
point. Everything else in the brief was read firsthand on 2026-07-30 and is cited with quoted text beside
each line number.

**One finding this brief adds that the commissioning report did not have:** R6 was accepted on the
rationale *"fkit has **no crash-recovery anywhere**"* — and that claim is **broader than what is on disk**.
`fkit-task-ship-loop/SKILL.md:87-109` is a resume doctrine, and `fkit-sprint-ship-loop` has **no equivalent
section**. So the sprint driver's gap is plausibly a **missing section**, not a missing row, and the
architect is asked to adjudicate the blanket claim by quotation.

#### Correction note (recorded 2026-07-31) — the rank flag above is resolved, and was resolved late

The addendum above is kept **as written**. Its "**Flagged for owner confirmation**" is superseded:
**the owner confirmed `0167`'s appended rank at P145 on 2026-07-30**, via `AskUserQuestion` at the start
of that sprint run. No row moved and nothing was renumbered, so the merit alternative the addendum
offers — a rank above the tail, below the promoted items — was **not** taken.

⚠️ **This correction is a day late, and that is the finding worth keeping.** The confirmation was given
on 2026-07-30 but was never routed to a producer, so this addendum, `0167`'s brief, and its board row
all continued to assert an unresolved flag through 2026-07-31 — **the board stated for a day that no
owner had ruled on a rank the owner had ruled on.** No decision was lost and no row was misplaced; the
defect is in the record, not the ranking. It is the same class the board is already tracking under
`0151`, `0159` and `0170` — *a governing document asserting a fact about something else that is no
longer true* — with a different cause: not staleness through drift, but **a confirmation that was never
written down.**

### Addendum — tasks 0165 and 0166 added out of band (2026-07-29)

**Both appended under `/fkit-task-brief` step 5 as written — no placement instruction was given, and
none was invented.** They sit at **P143** and **P144**, after the existing highest priority. **Flagged
for owner confirmation.** Merit, stated so the owner can rank them if they choose:

- **0165** — decide where a real check on the wiki flag's **emitted form** can live. **Merit: the same
  class as 0162 (P127) and 0154 (P128)** — a *"verbatim"* requirement with no control behind it — and
  it is the **only** one of the three that addresses the emission rather than the source text. On merit
  it belongs beside them. **It was appended anyway**, because ranking it there is a placement judgment
  the producer was not authorised to make. **The merit/append gap is roughly fifteen slots.**
- **0166** — decide the enforcement point for *"run every command you print"*. **Merit: lower.** The
  rule it concerns **already exists and is already linked** (`conventions/evidence-before-assertion.md`),
  the defective claims were all in **records** rather than in shipped work, and every instance was caught
  by review. **Append rank is close to merit rank here.**

**Judgment recorded, because it was asked for and could have gone the other way: 0165 was judged
DISTINCT from 0154 and filed separately, rather than merged into it.** The deciding argument is
checkable and is on disk: **0154 asserts the five required strings are present in the three wiki
`SKILL.md` files — and they were present throughout the `0141` failure** (verified 2026-07-29 at
`fkit-wiki-ingest/SKILL.md:72`, `fkit-wiki-sync/SKILL.md:116`, `fkit-wiki-lint/SKILL.md:81`). **0154
would have been green for the entire duration.** Guarding the source text and detecting a non-conforming
emission are different surfaces needing different controls. 0165 is likewise **not** a duplicate of 0158
(P122): that rules on *which authority wins*, this on *whether a deviation is detected at all*.

⚠️ **One claim behind 0165 is NOT verifiable from disk and is recorded as testimony, not fact.** That
`0141`'s plan specified the non-conforming terminal act, that the driver approved it without checking it
against the live SKILL, and that `0126` conformed only because its plan quoted the SKILL correctly, all
come from the live driver session. **Neither `ai-agents/tasks/done/0141-…/` nor `…/0126-…/` contains a
`plan.md`** — checked 2026-07-29. This is the same honesty flag 0162's row carries about the driver's
self-reported verbatim failures. **What is on disk is `log.md:623` — the deviation itself.**

### Placed by OWNER RULING 2026-07-29 — 0162 filed directly at P127, not appended

**Authority, stated first and in full — before any outcome.** This placement was **ruled by the owner**,
on **2026-07-29**, via **`AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session**. It was
executed by a spawned `fkit-producer` **on that instruction**. The producer had **no owner channel** and
contributed **no placement judgment of its own**. **This is not producer precedent for re-ranking at
filing time.**

The authority is stated before the outcome deliberately, for the reason the third and fourth re-ranks
both gave: an earlier addendum on this board recorded a placement's *outcome* far more visibly than its
*authority*, and that omission was later read as licence to re-rank without one — the failure that
produced tasks **0157** and **0158**. `/fkit-task-brief` step 5's *"do not renumber or insert into the
owner's ranking"* protects **the owner's** ranking from an agent acting alone; it is not a bar on the
owner ranking their own board. **A re-rank is the owner's call.** This is that call.

**What was ruled.** The owner approved filing all three briefs below, and ruled **0162 specifically** to
be ranked **HIGH — above the remaining polish work**, rather than appended. The owner's stated argument:
**a prose control that failed twice in two consecutive rounds, during the very run installing its own
backup, is not a polish item.** **0163 and 0164 were given no placement instruction** and were appended
under step 5 as written — see the addendum below.

**⚠️ The ruling was executed as far as the closed-row rule allows, and no further — read this before
treating P127 as "the top".** `✅ Done`, `⛔ Cancelled` and `➡️ Moved` rows are **never renumbered**, not
even under an owner ruling. **P127 is the highest rank 0162 could receive without renumbering closed
history**, because the region **P127–P139 was contiguous `🔲 Backlog`** and the row immediately above it,
**P126, is `✅ Done`**. **Ten open rows therefore remain above 0162** — P109, P113, P114, P118, P119,
P120, P121, P122, P123, P124 — every one of them separated from P127 by at least one closed row.
**Four of those are arguably the "polish work" the ruling meant to place 0162 above**: `0136` (P114),
`0141` (P118), `0151` (P123), `0143` (P124). **Putting 0162 above any of them was not available**, and
the producer did not attempt it. **Open question for the owner — see the addendum's last section.**

**No `✅ Done`, `⛔ Cancelled` or `➡️ Moved` row was renumbered.** Verified after the edit: the whole
affected region is `🔲 Backlog`, and the closed rows all sit above it and were not reached.

| Task | Was | Now | Why |
|---|---|---|---|
| **0162** — decide the construction that satisfies the verbatim-carry requirement | *(new)* | **127** | **Owner-ruled placement, 2026-07-29.** Not appended. See the authority note above. |
| **0157** | 127 | **128** | Displaced one place. **Nothing re-judged.** |
| **0161** | 128 | **129** | Displaced one place. Not re-judged; **still immediately below 0157**, which is the whole point of the 2026-07-27 fourth re-rank and is preserved. |
| **0148** | 129 | **130** | Displaced one place. Not re-judged. Its reason for sitting **after 0147** — one wiki pass over the ADR-032 page instead of two — is still satisfied. |
| **0154** | 130 | **131** | Displaced one place. Not re-judged. |
| **0144** | 131 | **132** | Displaced one place. Not re-judged. |
| **0145** | 132 | **133** | Displaced one place. Not re-judged; **still directly after 0144**. |
| **0146** | 133 | **134** | Displaced one place. Not re-judged. |
| **0152** | 134 | **135** | Displaced one place. Not re-judged. |
| **0149** | 135 | **136** | Displaced one place. Not re-judged. ⚠️ Its *"it stays last"* reasoning was already untrue before this pass and remains so; the repair is **0159's**, by owner ruling. |
| **0155** | 136 | **137** | Displaced one place. Not re-judged. |
| **0156** | 137 | **138** | Displaced one place. Not re-judged; **still directly after 0155**, which it hard-needs. |
| **0159** | 138 | **139** | Displaced one place. Not re-judged. |
| **0160** | 139 | **140** | Displaced one place. Not re-judged. Its append-confirmation flag **still stands, undischarged**. |

**Existing rows moved, and why: thirteen, all of them pure displacement, none re-judged** — each +1.
**Every relative order among the displaced tasks is preserved.** The orderings this board protects were
checked by name after the edit: 0161 immediately below 0157 ✅, 0148 after 0147 ✅, 0144 before 0145 ✅,
0156 directly after 0155 ✅.

**Each displaced brief's own `## Priority` field was updated to match** — 13 briefs, board rank and brief
field verified to agree 1:1 across every open row afterward. Board cells render the rank token `P<n>`;
the brief field stays a plain number, per `conventions/priority-is-rank-not-identity.md`. **No row's
status, description, href or link label was touched** — only rank cells moved.

**Every re-rank table below stays authoritative exactly as written.** They record what was true on their
own dates and are **not** rewritten to match today's ranks.

**⚠️ Prose this displacement just made stale, recorded rather than repaired — it is 0159's change
surface, not this pass's.** `0157`'s brief states *"This task's own rank is unchanged at **P127**"* and
*"Priority: ruled to 127 by the owner on 2026-07-27"*; both now read one short. `0157`'s brief
**explicitly forbids** repairing its own rank citations here (they are `0159`'s worked example), so
nothing was touched. **0159 must pick these up at implementation time**, along with everything else its
findings table already names — and its own brief already warns that it decays and must be re-verified
when it runs.

### Addendum — tasks 0162, 0163 and 0164 added out of band (2026-07-29): the verbatim-carry construction, the unnamed refusal case, and the build-phase logging hole

**Authority.** The owner approved **filing all three briefs** on **2026-07-29** via `AskUserQuestion` in
the live `/fkit-sprint-ship-loop` driver session. **0162's rank is an owner ruling** — see the placement
note directly above. **0163 and 0164 were given no placement instruction**: they are appended at P141 and
P142 under `/fkit-task-brief` step 5 as written, and **both are flagged for owner confirmation with merit
stated** below.

**Where all three came from.** The `/fkit-sprint-ship-loop` run that shipped `0147` and `0150` produced
three findings about its own guarantees. All three are about the same thing from different sides: **the
sprint loop's declared-approval marker is prose, and nothing anywhere checks it.**

**Why three briefs and not one.** They share a subject and nothing else — different owners, different
files, different kinds of work, and each is worth shipping if the others are deferred.

| | 0162 | 0163 | 0164 |
|---|---|---|---|
| **Kind** | decides something nobody has decided | states a rule that is currently only inferable | closes a scope gap, or writes down why it is not one |
| **Owner** | `fkit-architect` | `fkit-coder` | `fkit-coder` |
| **Files** | 1 new report; **no source** | 1 — `claude/agents/fkit-coder.md` | ≤2 — `fkit-coder.md` + `fkit-sprint-ship-loop/SKILL.md` |
| **Blocked on anything?** | no | no | no |

Folding a decision task with an unknown answer together with two prose edits whose answers are known
would hold both edits behind a ruling that needs the owner. That is the `0157`/`0159` and `0160`/`0161`
shape, applied again.

**Why 0162 is owned by `fkit-architect`, not `fkit-coder`** — the driver asked for this judgment
explicitly, so it is recorded rather than assumed:

| | |
|---|---|
| **It decides, it does not edit.** | The deliverable is a decision report; the eventual `SKILL.md` wording is a **follow-up**, and that follow-up is `fkit-coder` work. Precedent: `0160`, ruled the same way on the same grounds. |
| **It may move a guarantee surface.** | If carry-by-reference is sanctioned, condition **(b)** of the declared-approval marker — the word `0150` landed one round ago — no longer says the right thing. Reopening a just-closed guarantee is an ADR-altitude call. |
| **It must be reconciled against three ADRs.** | ADR-021 (owner channel is session-only), ADR-031's honesty clause, ADR-032 D3/D7's **accepted** prose-enforced cost. Deciding whether a new construction changes that accepted cost — or needs an ADR-032 amendment — is architect work by definition. |

**It would be wrong to default this to `fkit-coder` because the eventual fix is a prose edit.** The prose
edit is the follow-up. The task is the ruling.

**Dependency direction among the three — asked for explicitly, and the answer is: none is hard.**

- **0162 → 0163 is a soft coupling, one way.** `0163`'s clause is written against condition **(b)** as it
  stands today. If `0162` rules a different carry form sanctioned, **(b)** changes and `0163`'s clause
  must change with it — **in one reconciling edit, not two independent ones**. `0162`'s brief carries
  that obligation. **`0163` does not wait for `0162`:** it is the safety net that works today, today's
  (b) says `verbatim`, and `0163` is required to key its clause on the marker's *conditions* rather than
  restate the test — which is what keeps the later reconciliation cheap.
- **0164 is independent of both.**
- **0163 and 0164 should co-land, or land back to back in one session.** Not because either depends on
  the other — neither does — but because they edit **different, non-overlapping regions of the same
  file** (`claude/agents/fkit-coder.md`: the refusal clause at `:98-100`, the Build-worker bullet at
  `:71-72`), and **no live test reads that file's content at all**, so each edit's only real check is a
  careful read of the whole clause set. Splitting them pays that read twice. If they are split, the
  second to land must **re-read** the first's region rather than assume it.
- **0164 and 0162's eventual follow-up share `fkit-sprint-ship-loop/SKILL.md`** — the Build row at `:102`
  and the verbatim-carry rule at `:109`. Independent regions; coordinate on the file only.

**What was checked firsthand on 2026-07-29, and found to enforce nothing.**

| Site | Verdict |
|---|---|
| `test/` (13 files) | **Nothing reads `claude/agents/fkit-coder.md`'s content.** `grep -rn 'fkit-coder.md' test/` returns exactly **one** hit — an `existsSync` path check at `converge-contract.test.js:357`. |
| `0147`'s `C8c` / `C8d` byte-unchanged guards | **Never landed.** They lived in that task's worklog harness only; nothing in `test/` carries them. The Build-worker bullet `0164` edits is protected by **no** live guard. |
| `claude/scaffold/` | **Not dual-homed.** Ships `AGENTS.md`, `CLAUDE.md`, `universal-rules.md`, `ai-agents/` — **no `agents/`, no `skills/`**. None of the three briefs is a scaffold change. |
| `claude/agents/fkit-coder.md:93-100` (trust-not-proof) | **Forecloses worker-side detection.** *"not a verifiable token"*, *"you cannot verify the approval from your context"*. Any proposal requiring the worker to compare a carried plan against the owner's real plan is wrong on its face. |

**This is the same unenforced-prose class as `0152`, `0154`, `0157` and `0161`, and all three briefs are
required to say so plainly rather than imply a guard exists.** None of them adds one — `0152` and `0154`
are already contending for the first reader of agent/skill file content, and a third claimant is what
`0154`'s brief warns against.

**⚠️ Two of the three failures behind 0162 are NOT verifiable from disk.** The round-1 by-reference carry
and the round-2 silent truncation are the **driver's own report of its own conduct** in a live session;
**no transcript is stored in this repo.** The **third** data point is on disk and checkable — `0147`'s
worklog **§13**, three out-of-plan verification checks made during build and logged nowhere, found only
because the author voluntarily audited itself against an obligation that did not cover it. The briefs
mark the distinction, and the architect is told not to present the self-report as file evidence.

**Merit statements — both appended rows flagged for owner confirmation.**

- **P141 (0163) — merit says materially higher, immediately below 0162.** It is the **cheaper half of the
  same defect** (one prose clause, one file, no design call, no infrastructure), it **works today
  regardless of how 0162 rules**, and **0162 is a decision task whose implementation is a further
  follow-up** — so the edit that actually closes the hole is this one, and appending puts it last.
  **This is the one of the two with a real cost of waiting:** until it lands, the only thing between a
  defective carry and an unauthorized source write is a worker volunteering an inference, which is
  exactly what the `0150`-close review found is nowhere written down.
- **P142 (0164) — merit says immediately below 0163**, on the co-landing argument above: the two edits
  share an untested file, and the read that verifies either verifies both. **Not higher than that** — no
  wrong action is in flight. The build phase has been unlogged for the whole life of the loop, the one
  known instance was caught and retroactively recorded by the worker itself, and this buys back
  **auditability of a path already running**, not correctness of something shipping wrong today.

**⚠️ Open question the owner must settle — the ruling could not be executed in full.** The owner ruled
0162 **"HIGH — above the remaining polish work."** It was placed at **P127**, which is **the highest rank
available without renumbering `✅ Done` rows** — and closed rows are never renumbered, not even under an
owner ruling. **Four arguably-lighter open items still sit above it: `0136` (P114), `0141` (P118), `0151`
(P123), `0143` (P124)**, each separated from P127 by at least one closed row. **If the owner intended
0162 above those too, that placement is not reachable under the closed-row rule**, and the owner should
say how to resolve it — accept P127, or rule something the current rules do not provide for. **Nothing
was assumed either way.**

**Raised, not filed.** No new investigation was spawned out of this filing. `0162` is **report-only**: it
files no briefs and names its own follow-ups, which the producer files afterwards.

**⚠️ This edit shifted `sprint-2.md` by +188 lines and no `:NNN` citation anywhere was repaired.**
Measured firsthand after the edit: **2,555 → 2,743** lines. The shift is not uniform — old `:159`–`:171`
moved **+1** (the 0162 row insert), old `:172` moved **+3** (the two appended rows), and **everything at
old `:173` and beyond moved +188** (this addendum and the placement note above it). Across the repo
**56** `sprint-2.md:NNN` pointers exist in **24** files; **29 of them point at old `:173`+ and are now
off by 188**, and **27 point below `:159` and are unaffected**. Per the standing owner ruling, **0159
re-verifies its own citations at implementation time** rather than being repaired by hand, and **0160**
is the task filed to decide the durable fix. **Nothing here was fixed on purpose** — this is the third
consecutive filing to demonstrate the defect 0160 exists to solve.

### Re-ranked 2026-07-27 (fourth re-rank of the day) **by owner ruling** — 0161 moved from append rank to its merit position

**Authority, stated first and in full.** This re-rank was **ruled by the owner**, on **2026-07-27**, via
**`AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session**. It was executed by a spawned
`fkit-producer` **on that instruction** — the producer contributed no placement judgment of its own, and
had no owner channel to acquire any. **This is not producer precedent for re-ranking at filing time.**

The authority is stated before the outcome deliberately, for the same reason the third re-rank did. An
earlier addendum on this board recorded a placement's *outcome* far more visibly than its *authority*,
and that omission was later read as licence to re-rank without one — the failure that produced tasks
**0157** and **0158**. `/fkit-task-brief` step 5's *"do not renumber or insert into the owner's ranking"*
protects **the owner's** ranking from an agent acting alone; it is not a bar on the owner re-ranking
their own board. The governing principle is already on this board — **"A re-rank is the owner's call."**
This is that call.

**What was ruled.** The addendum immediately below appended **0160** and **0161** at P138/P139 and
**flagged both for owner confirmation**. The owner ruled on them separately:

- **0161** → **immediately below 0157**. The owner accepted the filing producer's merit argument: it is
  the cheapest item on the board (one bullet, two files, no design call, no infrastructure), the
  decision it records is **already made**, and its cost of waiting is a **recurring owner adjudication**.
  **Its append-confirmation flag is now discharged** — in this board and in its brief.
- **0160** → **stays where it was appended.** The owner ruled its merit is roughly where it sits. Its
  rank number moves 138 → 139 as pure displacement; it remains the last row on the board.
  **Its append-confirmation flag stands, undischarged.**

**No `✅ Done`, `⛔ Cancelled` or `➡️ Moved` row was renumbered.** The whole affected region **P128–P139
is contiguous `🔲 Backlog`** — the closed rows all sit above it and were not reached. The two `🔄 In
progress` rows (0147 at 125, 0150 at 126) sit above the region and were not touched either.

| Task | Was | Now | Why |
|---|---|---|---|
| **0157** | 127 | **127** | Unchanged. Anchor for 0161. |
| **0161** — disambiguate the frozen-history clause in `priority-is-rank-not-identity.md` | 139 | **128** | **Owner-ruled merit placement.** Immediately below 0157: cheapest open item on the board, the decision is already made, and the cost of waiting is a recurring owner adjudication. |
| **0148** | 128 | **129** | Displaced one place. **Nothing re-judged.** Its reason for sitting **after 0147** — one wiki pass over the ADR-032 page instead of two — is **still satisfied**. |
| **0154** | 129 | **130** | Displaced one place. Not re-judged. |
| **0144** | 130 | **131** | Displaced one place. Not re-judged. |
| **0145** | 131 | **132** | Displaced one place. Not re-judged; still directly after 0144. |
| **0146** | 132 | **133** | Displaced one place. Not re-judged. |
| **0152** | 133 | **134** | Displaced one place. Not re-judged. The open question about sharing a `SKILL.md` walk with 0136 and 0154 is **still open**. |
| **0149** | 134 | **135** | Displaced one place. Not re-judged. ⚠️ **Its *"it stays last"* reasoning was already untrue before this re-rank** and remains so; this pass did not change its position relative to any other row, and did not fix that. The repair is 0159's, by owner ruling. |
| **0155** | 135 | **136** | Displaced one place. Not re-judged. |
| **0156** | 136 | **137** | Displaced one place. Not re-judged; still directly after 0155, which it hard-needs. |
| **0159** | 137 | **138** | Displaced one place. Not re-judged. |
| **0160** | 138 | **139** | Displaced one place — **the owner ruled it stays where it was appended**, and it is still the last row. Its append-confirmation flag **stands**. |

**Existing rows moved, and why: eleven, all of them displacement, none re-judged** — 0148, 0154, 0144,
0145, 0146, 0152, 0149, 0155, 0156, 0159 and 0160, each +1. **Every relative order among the displaced
tasks is preserved.** The orderings this board protects were checked by name after the edit:
0147/0150 adjacent ✅ (125/126, untouched — they are being built right now in one session),
0148 after 0147 ✅, 0144 before 0145 ✅.

**Each displaced brief's own `## Priority` field was updated to match** — 12 briefs (the 11 displaced
plus 0161 itself), board rank and brief field verified to agree 1:1 across every open row afterward.
Board cells render the rank token `P<n>`; the brief field stays a plain number, per
`conventions/priority-is-rank-not-identity.md`. **No row's status, description, href or link label was
touched** — only rank cells moved, and the 0161 row was relocated to match.

**⚠️ This edit shifted `sprint-2.md` by +70 lines and no `:NNN` citation anywhere was repaired.**
Measured firsthand after the edit: the row relocation itself was net-zero on file length — it only
re-ordered the 12-line region **P128–P139**, so a pointer aimed *inside* that region may now name the
wrong row (none was found to be). **This addendum is what moved the file**: 2,484 → **2,554** lines, and
**everything at old line `:173` and beyond shifted +70** (old `:173` → `:243`, old `:257` → `:327`,
old `:335` → `:405`). Across the repo **56** `sprint-2.md:NNN` pointers exist in **23** other files;
**29 of them point at old `:173`+ and are now off by 65** — concentrated in
`0102`'s `review.md` (8), `0159`'s brief (4), the 2026-07-26 folder-prefix report (4), `0157`'s
brief (3), and singles in `0013`/`0158`/`0160`/`0092`/`0001`/`0082`/`0122` and this plan itself. Per
owner ruling, **0159 re-verifies its own citations at implementation time** rather than being repaired
by hand, and **0160** is the task filed to decide the durable fix. **Nothing here was fixed on purpose.**

### Addendum — tasks 0160 and 0161 added out of band (2026-07-27): the citation-form class, and the clause that needed a ruling to read

**Appended at P138 and P139, after the existing highest priority (0159 at P137). Nothing was renumbered
and no existing row moved** — so every re-rank table below stays authoritative exactly as written.

> **⚠️ The placement is `/fkit-task-brief` step 5's default, applied deliberately.** The spawning driver
> gave **no** placement instruction and explicitly required step 5 as written — appending after the
> existing highest priority, no renumbering, no insertion, flagged for owner confirmation with merit
> stated. A driver prompt overriding step 5 is what produced tasks **0157** and **0158**; it did not
> happen here. **Both merit statements are below, and both rows are unconfirmed until the owner rules.**

**Authority.** The owner approved **filing both briefs** on 2026-07-27 via `AskUserQuestion` in the live
`/fkit-sprint-ship-loop` driver session. The owner approved **filing**; the **ranking is the append
default**, not an owner ruling — see the merit statements.

**Why two briefs and not one.** They share a subject and nothing else. **0161** transcribes a ruling the
owner has **already made** into the page that should have carried it — one bullet, two files, no design
call. **0160** decides something **nobody has decided**, across two cases whose answers may differ and one
of which collides with a standing design rule. Folding a settled transcription into an open investigation
would hold a five-minute fix behind a decision that needs the owner. Neither blocks the other; **soft
preference is 0161 first**, so 0160's case-3 reasoning reads a clause that already says what it means.

**Why 0160 is an investigation and files no briefs.** The defect is measured; the fix is not known. Its
case 3 — dead `tasks/backlog/…` paths in review ledgers — has **no obvious right answer**, because
repairing them means editing a document the ledger rule freezes on purpose. Per investigation-first, the
implementation briefs are **not** written until its findings are reviewed with the owner. 0160 **names**
its follow-ups; the producer files them afterwards.

**Why 0160 is owned by `fkit-architect`, not `fkit-coder`** — the driver asked for this judgment
explicitly, so it is recorded rather than assumed:

| | |
|---|---|
| **It decides, it does not edit.** | Its deliverable is a decision report. There is nothing to implement until the anchor form is chosen; the convention page, the wording edits, the repair sweep and any guard are all **follow-ups**, and those will be `fkit-coder` work. |
| **Case 3 is an authority question.** | "A frozen document contains a pointer that has become false" is a design ruling against a rule fkit holds deliberately — not a text edit. |
| **Case 2 contradicts the architect's own instructions.** | `claude/agents/fkit-architect.md`'s `## Output format` **mandates** `path:line` citations. Reconciling a new rule against that is architect work by definition. |
| **The precision/durability line is a design call.** | A review finding at `plan.md:106` is precise in a way no heading anchor is. "Never cite a line number" is **not** obviously right, and deciding where the line falls is the task. |

**It would be wrong to default this to `fkit-coder` because parts of the eventual fix are text edits.**
The text edits are the follow-ups. The task is the ruling.

**What was checked firsthand today, and found to enforce nothing.**

| Site | Verdict |
|---|---|
| `claude/skills/fkit-status/dashboard.sh` | **Partial, and board-rows only.** `drift relocated` / `drift missing-brief` resolve a **sprint-board row's** brief link against the folder's real location — the one existing stale-path catcher in the repo. It never reads a `review.md`, a brief's prose, or any `:NNN`. |
| `test/` (13 files) | **Nothing.** No test reads any `.md` for citation validity. 0152 and 0154 are building the first two readers of `SKILL.md` *content*; neither reads citations. |
| Any markdown lint | **Does not exist.** There is no lint step in this repo. |
| `ai-agents/wiki-vault/` | **Nothing.** No page records a citation convention — flagged as a wiki gap. |

**A guard is only partly possible even in principle.** A hand-rolled check could verify a `path:NNN`
resolves to a file with at least N lines — cheap, and it catches the deleted-file case. It **cannot**
verify the line still says what the citer meant, which is the actual failure. **This is the same
unenforced-prose class as 0154 and 0157, and 0160's report is required to say so plainly.**

**Measured firsthand, 2026-07-27 — these decay, re-measure at implementation time.**

| Measure | Count |
|---|---|
| `path:NNN` citations in open briefs under `tasks/backlog/` | **113** |
| of those, pointing into `sprint-2.md` (2,398 lines, grows every addendum) | **12** |
| closed tasks whose `review.md` carries a dead `tasks/backlog/…` path | **30** |

The trigger instance: appending **one** Status-table row on 2026-07-27 shifted `sprint-2.md` **+70 lines**
and silently invalidated **11** `:NNN` pointers — 2 in the plan, 3 in 0157's brief, 6 in 0159's. Found and
repaired by hand by the producer that caused it. **Nothing flagged them.**

**Merit statements — both rows flagged for owner confirmation.**

- **P139 (0161) — merit says materially higher, immediately below 0157.** It is the cheapest open item on
  the board: one bullet, two files, no design call, no infrastructure, and **the decision it records is
  already made**. Its cost of waiting is a **recurring owner adjudication** — the ambiguity cost one
  ruling on the day the page shipped and will cost another the next time anyone reads the clause. **Not
  ranked higher, because appending is the rule and no wrong action is in flight** — 0159 is already
  unblocked by the ruling given.
- **P138 (0160) — merit says roughly where it is.** An investigation with nothing blocked behind it; its
  cost of waiting is that new stale citations keep accruing at the observed rate, not that anything wrong
  ships. **The one argument for moving it up:** 0157 and 0159 are solving one third of this class right
  now, and deciding the other two thirds while that context is live is cheaper than re-acquiring it.

**Raised, not filed.** 0160's case 1 is deliberately out of scope and stays with 0157/0159. 0160 must not
touch `claude/skills/fkit-task-brief/SKILL.md`, any task brief, or this board — doing so re-creates the
two-owner collision the 0157/0159 split resolved.

### Addendum — task 0159 added out of band (2026-07-27): the producer half of the 0157 split

**Appended at P137, after the existing highest priority (0156 at P136). Nothing was renumbered and no
existing row moved** — so every re-rank table below stays authoritative exactly as written. **0157's own
rank is unchanged at P127**, owner-confirmed today.

**Authority.** The owner ruled **twice** on 2026-07-27, via `AskUserQuestion` in the live
`/fkit-sprint-ship-loop` driver session:

1. **Split 0157 on the role seam.** 0157 had been widened that morning to carry three items. The owner
   ruled it split: **0157 keeps the rule** — state step 5's append rule in full, plus the *cite the folder
   ID, not the board rank* clause — a `fkit-coder` edit to **one** file,
   `claude/skills/fkit-task-brief/SKILL.md`. **0159 takes the sweep** — the stale-citation repair and the
   0149 correction — a `fkit-producer` edit to **task briefs and this sprint plan**. A brief has one
   `## Owner` field and cannot express two role owners; the widened task also broke its own verification
   step (*"`git diff --stat` shows exactly one file"*), which is the mechanical sign a second unit was
   present. **Neither half blocks the other.**
2. **The frozen-history clause does not block the sweep.**
   `conventions/priority-is-rank-not-identity.md:38` calls existing `priority (folderID)` notations
   *"frozen history … never mass-edited"*. The owner ruled that clause covers the **board-cell** form
   (`124 (0150)`) **only** — not the prose form (`0150 (124)`) inside a brief's reasoning. The reasoning:
   *a board cell records what a row meant on the day it was written; prose inside a brief is a live
   cross-reference that misdirects a reader today.*

**What verification found, and how it moved.** The scope was re-derived firsthand against this board
today, after 0153 closed and after the split:

| | List the owner first ruled on | Earlier pass (pre-split) | **This pass** |
|---|---|---|---|
| Stale numbers | 11 | 24 | **21** |
| Sites | 11 | 18 | **19** |
| Files | — | 10 | **11** |

The site count rose while the number count fell — **two sites nobody had found** (`0158/brief.md`'s
append flag and the `0151` board row), several earlier entries **re-classified as carve-outs**
(quotations inside `>` blocks, dated records of completed actions), and 0157's narrowing removed others.
**That instability is the argument for 0157's rule, and it is why 0159's brief instructs its own
implementer not to trust its tables.**

**Two premise corrections carried into the brief**, both verified by reading the files:

- The *"it stays last"* claim about 0149 is **not in 0149's brief** — that brief carries no rank citation
  at all. It is in **this plan, at three sites**: `:597` (its origin), `:466` and `:417`.
- **`:417` sits in a 2026-07-27 addendum** (heading at `:374`), **not** the 2026-07-26 one, as both the
  driver prompt and 0157's earlier brief stated. All three claims were **true when written** and became
  false at the same moment — when 0155 and 0156 were appended below 0149 (`:312`).

**No re-rank, no move, no close.** No `✅ Done`, `⛔ Cancelled` or `➡️ Moved` row was touched, no existing
row was renumbered, and no task file moved between `backlog/`, `done/` and `cancelled/`. The one edit to
an existing row is **0157's row parenthetical**, which was extended to name the split and the rule clause
the owner kept in it — **its `P127` cell is untouched.**

**⚠️ Priority 137 is append rank, NOT a merit ranking — flagged for owner confirmation.** Step 5 requires
appending after the existing highest priority and forbids inserting; this was filed by a spawned producer
with no owner channel, so appending was the only sanctioned option. **On merit 0159 belongs immediately
below 0157** — the two are halves of one ruling and read as one decision, and 0159 is the **only item on
this board whose own brief decays while it waits**: every re-rank re-stales its findings tables, so nine
slots of waiting is nine slots of drift to re-verify before it can start. **Not ranked higher, because no
wrong action is in flight** — a stale rank citation misdirects a *reader*, costing them a board lookup;
nothing is scheduled or moved wrongly as a result. On that axis it is the same class as the
archival-correction cluster (0146, 0149), and the decay property is the only thing separating it.
**The merit/append gap is nine slots.**

**⚠️ Raised for the owner, deliberately NOT filed.**
`conventions/priority-is-rank-not-identity.md:38` never says **which notation form** its frozen-history
clause means. Ruling 2 settled the reading for 0159; the clause itself is still ambiguous and the next
reader hits the same question. Making `:38` explicit would be a **separate, dual-homed** task (that page
must stay byte-identical with its `claude/scaffold/` copy — 0131/0132/0133 territory). Not filed unasked.

**⚠️ Also raised, also NOT filed: `sprint-2.md` line numbers are as mutable as board ranks.** Appending
this row and addendum shifted the plan by **+70 lines** and silently invalidated **eleven** `:NNN`
pointers in one edit — **two inside this plan** (both dated addenda cite *"A re-rank is the owner's
call."* as `:414`; **repaired here to `:628`**), **three in 0157's brief** (**repaired**), and six in
0159's own brief (repaired before filing). Same defect *shape* as the stale rank citations — a
precise-looking pointer into a mutable coordinate — but a **different coordinate system** that neither
ruling covers, and a real fix means a durable addressing scheme rather than a number. **Flagged for the
owner.**

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
The governing principle is already on this board at **`:628`** — **"A re-rank is the owner's call."**
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
the principle step 5 never does: **"A re-rank is the owner's call."** (`:628`). The producer's write-up
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

**⚠️ Corrected — see the correction under the 2026-07-26 out-of-band addendum for 0147–0149. `0149` is
not last; its position is unchanged.** **This addendum is dated 2026-07-27** — earlier records of this
task stated 2026-07-26, which is wrong. *(Swept by 0159, 2026-07-30.)*

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

**⚠️ Corrected — see the correction under the 2026-07-26 out-of-band addendum for 0147–0149. `0149` is
not last; its position is unchanged.** *(Swept by 0159, 2026-07-30.)*

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

**⚠️ Correction — owner ruling, 2026-07-27.** The *"it stays last"* reasoning recorded for **0149** in
the row above is **no longer true.** `0155` and `0156` were appended below `0149` on **2026-07-27** (see
that day's *"Addendum — tasks 0155 and 0156 added out of band"*) and remain below it; **`0149` is not
last.** **`0149`'s board position is unchanged and this correction does not move it.** The claim above is
kept as the record of what was reasoned on the day. *(Swept by 0159, 2026-07-30.)*

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

**Why lead moves first:** since [ADR-031](../../knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)
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
[ADR-010](../../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md)`:26` says *"the
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
  ([`2026-07-19-design-turn-completion-hook.md`](../../knowledge-base/reports/2026-07-19-design-turn-completion-hook.md),
  [ADR-030](../../knowledge-base/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md)) — **no
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
producer-only again**, reversing [ADR-025](../../knowledge-base/decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md);
recorded as [ADR-033](../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md).
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

The design/feasibility task 91 (0109) is **approved** and its two ADRs — [ADR-031](../../knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)
(lead becomes the orchestrating front door) and [ADR-032](../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)
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
([`2026-07-19-design-task-folder-structure-and-id-scheme.md`](../../knowledge-base/reports/2026-07-19-design-task-folder-structure-and-id-scheme.md))
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
  [ADR-001](../../knowledge-base/decisions/adr-001-package-json-stays-metadata-only.md)**, which is now
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
[`reports/2026-07-14-migration-mechanism.md`](../../knowledge-base/reports/2026-07-14-migration-mechanism.md)
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
[`reports/2026-07-14-migration-mechanism.md`](../../knowledge-base/reports/2026-07-14-migration-mechanism.md),
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
[`reports/2026-07-14-shared-instructions-layer.md`](../../knowledge-base/reports/2026-07-14-shared-instructions-layer.md)
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
  [ADR-009](../../knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md) *requires* for
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
  [`ADR-016`](../../knowledge-base/decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md)
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
  / `skillOverrides` ([ADR-010](../../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md),
  [ADR-012](../../knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md))
  and **tools** via the `tools:` frontmatter in `claude/agents/fkit-*.md`. Verified 2026-07-16: it is in
  **none** of the seven allowlists and nowhere in `claude/` — **no agent can use it today.**
- **Session-vs-consult behavior is unmeasured, with expensive precedent.** `--append-system-prompt`
  looked obviously inheritable and was **session-only — 0/3, then 0/2** into a spawned consult
  ([report rev 2](../../knowledge-base/reports/2026-07-14-shared-instructions-layer.md), Claude Code
  2.1.208). Same seam. Per
  [`evidence-before-assertion`](../../knowledge-base/conventions/evidence-before-assertion.md) (task 24),
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
  [the spec](../../knowledge-base/reports/2026-07-16-design-deterministic-dashboard-for-fkit-status.md)
  (all six items ruled) and
  [**ADR-017**](../../knowledge-base/decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md).
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
[ADR-012](../../knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md)
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
finding **R2**) found `test/prove-red.sh` — the task-23 / [ADR-014](../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md)
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
[ADR-022](../../knowledge-base/decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md)
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
[`ADR-030 stop-hook`](../../knowledge-base/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md))
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
   already-unsprinted [`add-e2e-smoke-script-for-fkit-itself.md`](../../tasks/cancelled/0004-add-e2e-smoke-script-for-fkit-itself/brief.md)** — deliberately **not**
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
   the time this question was written.** [`ADR-016`](../../knowledge-base/decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md)
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
[`conventions/one-skill-one-output.md`](../../knowledge-base/conventions/one-skill-one-output.md).

**The already-shipped convention satisfies every point raised in the re-ask**, including the one the
producer flagged as critical — §"The escape hatch" states that a proposed output-variant is *"an owner
decision at proposal time, never a silent design choice"*, and §"History — recorded honestly" records the
`/fkit-status full` tradeoff verbatim: the variant *"was correct when written"* and only task 41 retired
its justification. Its scaffold follow-up also shipped, as task **0086**.

**Cause, for the record:** the producer read the resolution marker and reported the question as open
anyway — a failure of the standing rule in
[`conventions/evidence-before-assertion.md`](../../knowledge-base/conventions/evidence-before-assertion.md).
It cost the owner a decision they had already made. **This is the second OQ to be re-raised after
resolution** — OQ6/task 37 was the first (see §Owner dispositions, item 6, still sitting cancelled-pending
in `backlog/`). Two instances is a pattern in the briefing procedure, not two slips.

### Three ADR-027 follow-up briefs were never filed — found by sweep, filed 2026-07-25

The OQ8 check above led into the conventions directory, which surfaced a real and larger gap.
[ADR-027](../../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md)
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

## Addendum — task 0168 added out of band (2026-07-31): dead brief paths in closed review ledgers

**Filed on an owner ruling of 2026-07-31**, relayed through the `/fkit-sprint-ship-loop` driver, that
this defect class be filed as a task rather than repaired inside the task that surfaced it. A closed
task's `review.md` self-header still names its brief under `ai-agents/tasks/backlog/…`; the mover
relocated the folder, so the path is dead. It is a **code span, not an href** — nothing resolves
through it, and **severity is low**.

**⚠️ The relayed scale was wrong, and the correction is the substance of this addendum.** The ruling
carried **"39 of 60"**. Re-derived firsthand on 2026-07-31 by testing each header path for existence
on disk rather than matching a string: of the **60** `review.md` files in `ai-agents/tasks/done/`,
**19** headers resolve, **40** are dead, and **1** has no `Task:` line at all (`0080`). Of the 40 dead,
**31** name `tasks/backlog/` — that is the described class, **31 of 60, not 39**. The 39 counted the
string `tasks/backlog/` anywhere in the file, sweeping in **8** files that merely cite sibling tasks in
their finding rows.

**Three variants, where the report assumed one.** The 31 split into **17** in the current
`backlog/<NNNN>-<slug>/brief.md` form and **14** in a pre-migration flat `backlog/<slug>.md` form whose
target exists under no name today. A further **9** dead headers name `tasks/done/<slug>.md` in that
same flat form — right board, dead path — **a variant the report misses entirely**, which means
"the header points at `done/`" is not evidence that a header is correct. `ai-agents/tasks/cancelled/`
holds 11 folders and **zero** `review.md` files, so the open question about `cancelled/` has no
instances behind it.

**Not a new class — 0160 already owns it as Case 3**, and 0160 is report-only, architect-owned, and
explicitly refuses to presume that "just repair the path" is the answer, because repairing means
editing a document the ledger rule freezes by design. **0168 is therefore scoped as the execution arm
of 0160's ruling and carries a hard dependency on it.** 0160's own count of **30**, taken 2026-07-27,
is consistent with 31 today; the disagreement is with the 39, not between the two briefs.

**A sweep alone would be a treadmill.** The header is written by the ledger schema in
`claude/skills/fkit-stateful-review/SKILL.md`, mirrored byte-for-byte in
`fkit-process-stateful-review` and declared shared between them, at a moment when the task genuinely
*is* in `backlog/`. Every future close reproduces the defect. Separately verified: `/fkit-task-done`
does **not** re-point it and is not failing to — its step-5 sweep is href-scoped by its own wording,
and its one rule reaching the moved folder's own files is scoped to links that folder makes to a
**sibling** task.

**⚠️ Priority 146 is append rank, NOT a merit ranking — flagged for owner confirmation.**
**On merit this belongs directly below 0160**, because it is that task's execution arm and cannot
start until it rules; parking it at the tail separates it from the ruling it depends on. It was
appended under `/fkit-task-brief` step 5 by a **spawned** producer with no owner channel, which that
step forbids from re-ranking. No row was renumbered.

**Open question for the owner:** 0160 is report-only and *"files no briefs, names its follow-ups"* —
so 0168 is the follow-up 0160 would have named. The 2026-07-31 ruling was given without 0160's Case 3
in view. Either cancel 0168 and let 0160 name its own follow-up, or keep it as the pre-filed
execution row. It is written here as the latter.

## Addendum — task 0169 added out of band (2026-07-31): pointers from three skills to ADR-034's close bar

**Owner ruling, 2026-07-31, via `AskUserQuestion` in a live `fkit-lead` session.** ADR-034 defines when a
stateful review ledger closes and **deliberately edits no skill** — its *Binds* table names three close
conditions and states that "each pointer below is a separate task the owner ranks." The owner ruled this
be filed as a task rather than left as an ADR footnote. Task **`0169`** is that task.

**Why a task and not a footnote.** The reviewer's argument, which the owner accepted over the driver's
proposal to file the bar inside one skill: the bar **binds three roles** — the reviewer's
`fkit-stateful-review`, the coder's `fkit-process-stateful-review`, and any driver — so filing it in one
skill leaves the other roles to re-derive it, **which is exactly how the question surfaced in the first
place.** Until the pointers exist, ADR-034 is the only durable home for the bar.

**Corrections to the coordinates, re-derived firsthand at brief-writing time.** All three named sites do
say what ADR-034 says they say. Two things the ADR does not have quite right:

- It cites `fkit-task-ship-loop/SKILL.md:160-162`; the close-bar sentence is at **`:160-161`** — line 162
  is the same step's non-convergence clause. A one-line-wide citation, not a defect.
- **There is a FOURTH site the ADR does not name.** The same file's *Failure & exit behavior*
  terminal-state table restates the bar as a trigger — *"ledger closed-out and last verify green"*. A
  reader who consults that table instead of step 7 gets the undefined bar. It is in `0169`'s scope.

**No skill references ADR-034 today** — verified repo-wide; the only non-ADR file that mentions it is
task `0168`'s brief.

**⚠️ One question goes to the owner before any code moves.** `fkit-sprint-ship-loop` and ADR-032 both
state that `fkit-task-ship-loop` **"stays byte-unchanged."** Read in context both are scoped to ADR-032's
own ripple — introducing the sprint driver does not require editing the task loop — not a repo-wide
freeze; and **ADR-033 subsequently rewrote that file's step 9**, an edit present today. The evidence
weighs against a live freeze, **but `0169` does not settle it**: it requires an explicit owner yes/no, and
if the freeze binds, it ships the two review skills and routes the other two sites back rather than
stalling. Whether `fkit-sprint-ship-loop`'s own *"stays byte-unchanged"* wording is now a stale claim is
an **open question, not a filed task**.

**⚠️ Priority 147 is append rank, NOT a merit ranking — flagged for owner confirmation.** It was appended
under `/fkit-task-brief` step 5 by a **spawned** producer with no owner channel, which that step forbids
from re-ranking. No row was renumbered. **No owner has ruled on this rank** — the 2026-07-31 ruling
settled only that the work be filed as a task, not where it sits on the board.

### Correction note (2026-07-31, later the same day) — three claims above are superseded

The addendum above is kept **as written**; it is the record of what was known when `0169` was filed.
Three of its claims were overtaken by owner rulings made later the same day, in a live
`/fkit-sprint-ship-loop` session via `AskUserQuestion`. Where the two disagree, **this note governs.**

1. **The `fkit-task-ship-loop` freeze question is SETTLED — the freeze does NOT bind.** The paragraph
   above says `0169` "does not settle it" and describes a fallback shipment of two sites. Both are
   superseded: the owner ruled the *"stays byte-unchanged"* claim scoped to ADR-032's own ripple, so
   **all four sites are in scope unconditionally.** There is no gate and **no fallback shipment**.
2. **`fkit-sprint-ship-loop`'s own *"stays byte-unchanged"* wording is a FILED TASK, not an open
   question.** The paragraph above calls it "an open question, not a filed task". The owner ruled it be
   filed; it is task **`0170`**.
3. **Priority 147 IS owner-confirmed.** The final paragraph's "**No owner has ruled on this rank**" was
   true when written and is now false. The owner confirmed the appended ranks of `0168` and `0169`
   together on 2026-07-31 (*"Confirm both as appended"*). No row moved and nothing was renumbered.

**Unchanged and still accurate:** ADR-034's *Binds* table genuinely names **three** sites — the fourth
(`fkit-task-ship-loop`'s *Failure & exit behavior* table) is a site the ADR does not name, found during
brief-writing. The `:160-162` vs `:160-161` citation correction also stands.

---

## Addendum — task 0170 added out of band (2026-07-31): the stale *"byte-unchanged"* claim in `fkit-sprint-ship-loop`

**Owner ruling, 2026-07-31, via `AskUserQuestion` in a live `/fkit-sprint-ship-loop` session.** While
settling `0169`'s freeze question, the owner ruled that `fkit-sprint-ship-loop`'s own *"stays
byte-unchanged"* wording — the claim whose non-binding scope that ruling established — be **filed as its
own task** rather than left as an open question. Task **`0170`** is that task.

> ⚠️ **This ruling settled WHAT gets filed, not WHERE it ranks.** `0170`'s priority 148 is an
> **append rank and is UNRESOLVED** — see the flag below. This is not producer precedent for re-ranking.
>
> **⛔ SUPERSEDED 2026-07-31 (later the same day).** The rank was subsequently confirmed by the owner in
> its own ruling — see the correction note at the end of this addendum. The sentence "this is not
> producer precedent for re-ranking" **still stands**: nothing was re-ranked, then or now.

**The defect, re-derived firsthand.** `fkit-sprint-ship-loop/SKILL.md` states that
`fkit-task-ship-loop` *"stays byte-unchanged."* **ADR-033 falsified that, and the edit is in the file
today**: ADR-033 (accepted, and it **amends ADR-032**) records that *"`fkit-task-ship-loop` step 9 changes
from invoke `/fkit-task-done` to route the close to the producer"*, and the file's step 9 now reads
*"Route the close to the producer — never close it yourself"*, citing ADR-033 across **13** references
including its frontmatter `description:`.

**⚠️ Correction to the relay: TWO sites, not one.** The defect was relayed as a single site. There are
two, both in `fkit-sprint-ship-loop/SKILL.md` — the narrative *"it models the task loop's rigor, never
invokes it"* passage, **and the `## Hard rules` bullet** *"Never invoke `fkit-task-ship-loop`"*. **The
rules-block site is the worse of the two**, because that section is read as binding. A fix repairing only
the first leaves the claim standing where it does the most damage.

**Why filed rather than noted.** It is the **third instance** of the class `0151` (`CLAUDE.md`'s stale
`skills-for-role.sh` location) and `0159` (stale board rank citations) already fixed — *a governing
document asserting a fact about another file that is no longer true.* Two prior instances make it a
class. What earns it a task: it sits in **the driver skill that runs on every sprint**, so it misinforms
that loop first. This run supplied the evidence — a stale claim in a governing document **propagates into
worker prompts**, which is how a wrong ruling date reached the owner's own plan approval and was caught
only by a reviewer, never the author.

**⚠️ It needs a decision on wording, not a deletion.** The claim had a **true scope** — ADR-032's own
ripple genuinely did not require editing the task loop — written in unscoped, permanent-tense words. The
likely fix is to **state that scope**, not remove the sentence. `0170`'s brief weighs three options and
**deliberately does not prescribe the wording**; a mechanical find-and-replace would reproduce the defect
in a fresher tense. The **never-invoke / session-only rule is correct and must survive** the edit.

**Open question routed to the owner, deliberately not settled.** ADR-032 Decision 1 carries the same
claim. An accepted ADR is corrected by an **appended dated note, never a rewrite** (cf. `0143` on
ADR-010), and ADR-033 already declares the amendment — so it may need nothing. **No ADR is to be edited
without an explicit ruling.** Adjacent and out of scope: ADR-032's header does not list *"Amended by:
ADR-033"* although ADR-033's header declares it — raise, do not silently fix.

**⚠️ Priority 148 is append rank, NOT a merit ranking — flagged for owner confirmation.** It was appended
under `/fkit-task-brief` step 5 by a **spawned** producer with no owner channel, which that step forbids
from re-ranking. No existing row was renumbered. **No owner has ruled on this rank** — the 2026-07-31
ruling settled only that the work be filed as a task. **The confirmed ranks on `0168` and `0169` are
their own rulings and do not extend to this row.**
**On merit this belongs directly below `0169`**, because that task's ruling created this one, the two
concern the same sentence, and this one soft-follows it so the wording can describe the file's final
state — **so the merit and append positions coincide**, and confirming the append costs nothing.

### Correction note (2026-07-31, later the same day) — the rank flag above is resolved

The addendum above is kept **as written**; it is the record of what was known when `0170` was filed.
One of its claims was overtaken by an owner ruling made later the same day, in a live
`/fkit-sprint-ship-loop` session via `AskUserQuestion`. Where the two disagree, **this note governs.**

1. **Priority 148 IS owner-confirmed.** The flag paragraph's "**No owner has ruled on this rank**" was
   true when written and is now false. The owner confirmed `0170`'s appended rank on **2026-07-31**, in
   **this row's own ruling** — given separately from, and later than, `0168`'s and `0169`'s joint
   confirmation. No row moved and nothing was renumbered.

**Unchanged and still accurate:** the flag paragraph's warning that `0168`'s and `0169`'s confirmations
"do not extend to this row" was correct as a matter of reasoning and **was never relied on** — this row
did not inherit their confirmation, it received its own. The merit statement also stands: merit and
append positions coincide, so the confirmation **adopts** the merit position rather than overriding it.

## Addendum — tasks 0171–0176 added out of band (2026-08-01): the six remaining follow-ups of `0160`'s citation ruling

Task `0160` closed on 2026-08-01, delivering
[the durable-citation decision report](../../knowledge-base/reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md).
Its §8 names **eight** follow-ups and files none — *"the producer files these. Naming them is this
task's deliverable."* **Follow-ups 3 and 4 were already filed as `0168`** (its items 2 and 1) and are
**not** re-filed. The other six are the rows above:

| Follow-up | Task | Rank | `## Owner` |
|---|---|---|---|
| 1 — the citation convention page, **dual-homed** | `0171` | **P150** | `fkit-architect` |
| 2 — narrow the architect's `## Output format` bullet | `0172` | **P151** | `fkit-coder` |
| 5 — tighten the wiki completion-flag block | `0173` | **P152** | `fkit-coder` |
| 6 — case 5 handed back as its own task | `0174` | **P119** | `fkit-architect` |
| 7 — the dead-ledger-path guard | `0175` | **P153** | `fkit-coder` |
| 8 — the coordination-citation policy guard | `0176` | **P154** | `fkit-coder` |

*(Ranks are bolded above so this summary table is not picked up by the board's own
`\| P[0-9]+ \|` rank-sequence scan — it is a note, not a board.)*

### ⚠️ One row was inserted mid-board by owner ruling, and it renumbered the board

**`0174` was ranked at P119 by explicit owner ruling** (report §11, open question 3, 2026-08-01, via
`AskUserQuestion` in the live `/fkit-sprint-ship-loop` driver session): *"the owner ranks it explicitly
at filing"*, **not appended**, placed in the **P115–P120 band**, with the exact position left to the
producer.

**The recorded reason is the task's own subject.** Appending would have landed it near P149, inside the
bottom segment, where per §6.2 it could never be promoted past the closed P140 row however good its
merit case — **making the filing an instance of the very defect the task exists to fix.**

**The producer's merit reason for P119 specifically**, as `/fkit-task-brief` step 5 requires: within the
owner's band, **P115–P118 are all `✅ Done`**, so **P119 is the highest rank in the band that is not
behind a closed row.** It takes the head of the earliest *reachable* open segment, and **no closed row
was renumbered by the insertion.**

**What the insertion did to the board, stated plainly:**

- **Every rank from the old P119 through the old P148 moved up by exactly one**, becoming P120–P149.
- **No row's identity changed.** A task's identity is its task-folder name's `NNNN` prefix and nothing
  else — see [`priority-is-rank-not-identity.md`](../../knowledge-base/conventions/priority-is-rank-not-identity.md).
  Rank is mutable; identity is not. **No folder was renamed, moved, or re-ID'd.**
- **This is NOT producer precedent for re-ranking.** `/fkit-task-brief` step 5's default stands: a
  spawned producer with no owner channel **appends**. This row moved because the owner ruled it, and
  the authorization covers **this row only**.

**⚠️ Consequence for anyone reading report §6.2:** every rank printed in its open-segment list is a
**pre-renumbering** rank. Every one at 119 or above has since moved by +1, and six new open rows were
added the same day. `0174`'s brief carries this warning; **re-measure rather than inherit.**

### The other five ranks are append ranks and are flagged for owner confirmation

`0171`, `0172`, `0173`, `0175` and `0176` were appended under step 5. For `0171`, `0172`, `0175` and
`0176`, **merit and append positions coincide** and confirming costs nothing.

**`0173` is the exception, and its flag is loud.** On merit it belongs **immediately above `0154`** and
it is **urgent** — until it lands, every wiki completion flag this project emits manufactures a dead
path, and any ledger quoting one preserves it permanently. But its append rank is **P152**, while the
two tasks it blocks sit **above** it: `0154` at P129 and `0165` at P130. **The board's reading order
therefore contradicts the dependency links.** The `Depends on` / `Blocks` declarations in the briefs are
the binding record; **the owner should decide whether to promote the row.**

### One owner ruling in these briefs is NOT in the report

Report §11's **open question 7** — *what replaces the brief path in the wiki completion flag?* — still
reads **"⏳ Awaits the owner."** It is **out of date.** The owner ruled it on **2026-08-01, after the
report was finalised**, and ruled the report ships as-is rather than being reopened. **The ruling
therefore travels in `0173`'s brief:** the replacement form is **folder ID only — candidate (i), no path
at all**, e.g. *"Task 0148's vault work is complete — ready to close"*, at the accepted cost of one
lookup by the producer. A coder reading §11 alone would find this unruled and stop, which is why
`0173`'s brief carries the ruling with its full provenance.

### Follow-ups 7 and 8 were filed as TWO tasks, not one — a producer judgement

Report §8 explicitly left this open: *"Whoever files them should consider one task with two conditions
rather than two tasks — noted as a producer judgement, not a ruling."* **Decision: two tasks
(`0175`, `0176`).** Merging would take the **union of two unrelated preconditions** — `0175` waits on
`0168`, `0176` waits on an 11-citation cleanup — so neither half could ship until both landed, against
the standing *"smallest independently shippable unit"* rule. They also carry **different owner rulings**
(one versus two plus four scoping decisions) and so cannot honestly share one priority, and they assert
**different conditions over different scanned sets**. The accepted tradeoff is two test files instead of
one.

### Recorded at filing, and not repaired here

- **Report §11's open question 7 is stale** — see above. **The report was not edited.**
- **`0172` names an adjacent site the report does not rule on**: `claude/agents/fkit-architect.md`'s
  `## Behavioral rules` *"Ground every claim in a `path:line` reference"* is **broader** than the
  `## Output format` bullet §1.2 rules on. Raised, not fixed, and **not** folded into `0172`'s scope.
- **`0173` names a dependency the report does not**: `0154` asserts the wiki flag lines **verbatim**, so
  landing it before `0173` pins the defective form in a test.
- **`0171` names a scope fact the report does not**: dual-homing the convention page touches **four**
  files, not two — both `conventions/README.md` copies carry an index a new page must join, and the
  scaffold copy's *"Six conventions ship with the scaffold"* count goes false.
- **Pre-existing index gap, out of scope:** `conventions/dependency-declaration-form.md` exists in the
  live tree but is absent from the live `conventions/README.md` index table.

## Addendum — task 0177 added out of band (2026-08-01): verify the codex half of the comment-stripping canary

**Carried-forward residual of task `0130`**, filed by the producer at the close of `0130` in the live
`/fkit-sprint-ship-loop` driver session, at the owner's request.

`0130`'s compression pass measured **one half** of a two-half question and said so honestly. The
**Claude half is firsthand**: **Claude Code 2.1.220 strips HTML comments from `CLAUDE.md`** before they
reach agent context, so the 404 B `emit_block()` wrapper costs cap budget without costing Claude-side
context. The **codex half was never measured** — whether **`codex-cli 0.145.0`** strips HTML comments
from `AGENTS.md` is **second-hand, from an architect consult**.

Two rationale comments in the tree — at the `RULES_MAX` assignment site in
`claude/fkit-claude-init.sh`, and in the header of `test/rules-block-budget.test.js` — carry an
**explicit hedge** about this and assume the **conservative default that codex still pays**. `0177`
measures it, **version-stamps the result per ADR-016's harness-version discipline**, and corrects or
confirms both hedges. **An inconclusive result is a valid outcome** of the task, recorded as such.

**Why it is worth a task at all:** if codex **also** strips them, the wrapper costs **no agent context
at all on either side** — only cap budget. That is a live input to any future rules-block budget
decision, and it is unknown today.

**⚠️ Standing trap, carried over from `0130` and repeated here on purpose.** A finding that the wrapper
costs no agent context must **not** become an argument for capping the **source** file instead of the
**emitted** block. **The owner ruled 2026-08-01 that the cap keeps measuring the emitted block**,
unchanged, and the coder flagged the alternative as *"a 493 B cap loosening wearing a correctness
costume"*. `0177` changes comments only — no `RULES_MAX` edit (stays **4096**), no cap-semantics edit.
If the measurement genuinely argues for a semantics change, that is a **separate proposal to the
owner**, never an edit made inside this task.

**Priority: LOW — nothing is blocked on it. Depends on: nothing. Blocks: nothing.**

⚠️ Priority 155 is append rank, NOT a merit ranking — flagged for owner confirmation.
**On merit this belongs directly below `0176`**, because it is the lowest-urgency item on the open
board — a hedge-resolution with no blocked dependent — so append rank and merit rank coincide here.

---

### Addendum — tasks 0178–0185 added out of band (2026-08-01): all eight follow-ups of `0174`'s ruling

**Authority.** The owner ruled *"file all eight"* on 2026-08-01, relayed through the live `fkit-lead`
`/fkit-sprint-ship-loop` driver session. Task `0174` — *"Decide how an owner records a merit ordering
that board rank can no longer carry"* — closed the same day as an investigation and a ruling, delivering
[the merit-ordering decision report](../../knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md)
and [ADR-035](../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
(status **accepted**). The report's §8 names eight follow-ups and files none; these eight rows are that
filing.

**⚠️ ALL EIGHT WERE APPENDED. NOTHING WAS INSERTED AND NO EXISTING ROW WAS RENUMBERED.** They take
`P156`–`P163`, below the previous highest rank `P155`. This is stated first and loudly because it is the
exact act ADR-035 was written about: `0174`'s **own** filing was inserted mid-board and renumbered eight
closed rows. A spawned producer has no owner channel and therefore **never** re-ranks — not on a
spawn-prompt instruction, and not on a precedent read off an earlier addendum.

**⚠️ Append rank and merit rank DIVERGE for five of the eight, and the divergence is the point.** Each
brief carries its merit position in the canonical relative form. In summary:

| Task | Append | On merit | Divergence |
|---|---|---|---|
| `0178` record the canonical merit-statement form | P156 | immediately above `0132` | **~24 open rows** |
| `0179` require a merit statement on every ranked brief | P157 | immediately below `0178` | none (in-batch) |
| `0180` build the `brief-missing-merit` guard | P158 | immediately below `0179` | none (in-batch) |
| `0181` narrow step 5 — an insertion is not a re-rank | P159 | immediately above `0178` — **highest merit of the eight** | **~27 open rows** |
| `0182` build the closed-rank immutability guard | P160 | as ranked | none |
| `0183` correct the "no closed row was renumbered" claim | P161 | immediately above `0132` | **~25 open rows** |
| `0184` `Depends on`/`Blocks` is binding; repair the `0173` asymmetry | P162 | immediately above `0154` — itself an **unreachable** position | **unrepresentable** |
| `0185` decide whether Sprint 2 rolls over | P163 | immediately above `0132` | **~26 open rows** |

**Flagged for owner confirmation.** Five of eight sit far below where merit puts them, and one merit
position (`0184`'s) **cannot be reached by any legal act at all** — `0154` sits three segments up, behind
five closed rows. That is not a filing error; it is the defect `0174` measured, reproducing itself in
the very act of filing `0174`'s remedies.

**⚠️ Merit statements in these eight use the CANONICAL `- **On merit:**` shape** ruled in by report §3.1
and recorded in ADR-035 — not the legacy `**On merit this belongs …**` sentence `/fkit-task-brief` step 5
still mandates. The ruling is signed and the ADR accepted; task `0179` lands the wording in the skill.
**This is flagged so it is not read as drift**, and it moves task `0180`'s red-set arithmetic: report
§5.4b measured the guard red on **29 of 29** open briefs; re-measured at this filing it is red on
**28 of 36** (17 carrying no statement, 11 legacy-shaped, 8 canonical).

**Sequencing, from report §8:** `0178` → `0179` → `0180` is a hard chain (the guard ships red on 28 of 36
if run early). `0181` is independent and *"can land first"*; `0182` follows it and is ranked **LOW**.
`0183` and `0184` are marked *"soon"* — two live records assert a falsehood, and `0173`'s urgent flag is
outstanding. `0185` **awaits the owner**.

**⚠️ Two of the eight are blocked on decisions nobody has made yet.** `0180` needs the grandfathering
decision (backfill all 28, exempt by date, or ship advisory) and `0182` needs the baseline decision
(exempt history before a named commit, or accept a red run). **Neither guard can land until its decision
is made.**

**⚠️ `0179` and `0181` both edit `/fkit-task-brief` step 5.** They are independent in substance and must
not be merged; whichever lands second rebases on the first.

**Two conflicts surfaced rather than planned around.** (1) The report names
`conventions/priority-is-rank-not-identity.md` as the merit grammar's home; the driver's relay named
`dependency-declaration-form.md`, which is **absent from `claude/scaffold/`** — a task `0132` drift item.
`0178` follows the report. (2) The report records `0178`'s owner as *"`fkit-architect` to write"*; the
driver's relay said `fkit-coder`. `0178` follows the report. **Both flagged for owner confirmation.**

### Addendum — task `0186` added out of band (2026-08-01): the single follow-up of `0132`'s close

**Authority.** Filed at the direction of the `fkit-lead` `/fkit-sprint-ship-loop` driver as the one
follow-up carried out of task
[`0132`](../../tasks/done/0132-reconcile-dual-homed-file-drift-live-vs-scaffold/brief.md), closed the same
day. **This is not an owner ruling on the row's placement** — see the append flag below.

**⚠️ `0186` WAS APPENDED. NOTHING WAS INSERTED AND NO EXISTING ROW WAS RENUMBERED.** It takes `P164`,
below the previous highest rank `P163`. Stated first and loudly, for the reason ADR-035 exists: a
spawned producer has no owner channel and therefore **never** re-ranks — not on a spawn-prompt
instruction, and not on precedent read off an earlier addendum.

**⚠️ Priority 164 is append rank, NOT a merit ranking — flagged for owner confirmation.**
**On merit this belongs directly below `0132`** — i.e. immediately above `0133` — because `0133` is the
next eligible task, hard-depends on `0132`, and consumes exactly the model `0186` corrects. Append rank
puts it roughly **34 open rows** below that. `0186` uses the canonical `- **On merit:**` shape ruled in
by `0174`'s report §3.1 and recorded in ADR-035, alongside the legacy sentence `/fkit-task-brief` step 5
still mandates; task `0179` lands the wording in the skill. **Flagged so it is not read as drift.**

**Why the follow-up exists.** `0132` swept both dual-homed trees and **disproved ADR-027's core
premise**. The ADR models the surface as two kinds of file — fkit-authored ✅ must-match, project-specific
⛔ never-sync. The sweep found a **third**: five of the six drifted scaffold `conventions/*` files are
**not stale copies left behind** but deliberate, de-fkit-ified, **audience-adapted** rewrites for a
consuming project. Byte-aligning them — which **§Decision 2 mandates** — would ship fkit's own incident
narrative and **4 verified-broken relative links** into every new project. The owner ruled **Option B** on
2026-08-01: the third kind is legitimate, and byte-aligning live → scaffold is **rejected as a product
regression**.

**⚠️ The ADR's defect is its evidence, not its arithmetic.** "Six drifted files" is a `diff -rq` count,
and **a `diff` count cannot distinguish a stale copy from a deliberate adaptation** — it reports
difference, never intent. The figure is stale **in kind, not in count**: `0132` verified all six still
differ and that **none** were fixed by `0043`/`0077`/`0086`, so `0132`'s own brief was **wrong** to guess
that two had been repaired. Correcting the number is not the fix.

**Owner: `fkit-architect`.** An ADR amendment is an architect act. **Depends on: nothing** — `0132` is the
evidence and it closed 2026-08-01.

**⚠️ One residual from `0132` is NOT covered by `0186` and is tracked on `0132`'s own row:** review
finding **R1** was handed to task `0133` by owner ruling. The 10 directory exception entries in
`test/dual-home-parity-exceptions.mjs` match **bidirectionally**, so a real dual-homed file later added
under one would **silently escape `0133`'s enforcement**. **`0133` must assert that no directory exception
covers a non-`.gitkeep` file present in BOTH homes**, with the `.gitkeep` carve-out **required, not
cosmetic** (9 such files sit in both homes today and would otherwise fire it immediately). Named
near-miss: `knowledge-base/reports/README.md`. `0133` is the **next eligible task** and hard-depends on
`0132`.

---

### Addendum — task `0187` added out of band (2026-08-02): the single follow-up of `0133`'s close

**Authority.** Filed at the direction of the `fkit-lead` `/fkit-sprint-ship-loop` driver as the one
follow-up carried out of task
[`0133`](../../tasks/done/0133-build-dual-home-parity-test/brief.md), closed the same day. **This is not an
owner ruling on the row's placement** — see the append flag below.

**⚠️ `0187` WAS APPENDED. NOTHING WAS INSERTED AND NO EXISTING ROW WAS RENUMBERED.** It takes `P165`,
below the previous highest rank `P164`. Stated first and loudly, for the reason ADR-035 exists: a
spawned producer has no owner channel and therefore **never** re-ranks — not on a spawn-prompt
instruction, and not on precedent read off an earlier addendum.

**⚠️ Priority 165 is append rank, NOT a merit ranking — flagged for owner confirmation.**
**On merit this belongs directly below `0133`**, because it is `0133`'s only carried-forward producer
item, the check is minutes of read-only work, and it retires an accepted risk the owner has been holding
open since 2026-07-25. Append rank puts it roughly **35 open rows** below that. **Flagged so it is not
read as drift.**

**Why the follow-up exists — the owner's own ruling cannot be carried out.** On **2026-07-25** the owner
ruled that task [`0112`](../../tasks/done/0112-wire-lead-sprint-ship-loop-skill-ownership-and-mirrors/brief.md)
would stay closed and be **re-verified by hand once `0133` landed**. `0112` shipped as
`✅ Done (agent-closed — not owner-verified)` carrying a verification step 4 — *"the ADR-027 dual-home
parity test passes"* — for a test that **did not exist**. `0133` has now landed, and the ruling turns out
to be **undischargeable as written, and permanently so.**

**The intersection between `0112`'s write surface and the dual-home parity surface is EMPTY** — verified
row by row by `0133`'s coder and independently by its reviewer. `claude/skills-for-role.sh`,
`claude/skills/fkit-team/SKILL.md`, `claude/README.md` and `claude/scaffold/CLAUDE.md` are **outside both
homes**; `ai-agents/knowledge-base/architecture.md` is **live-only and exempt by decision**. The parity
surface is `ai-agents/` ↔ `claude/scaffold/ai-agents/`, and because `0112`'s surface lives under
`claude/` it will **never** intersect it. This is structural, not a timing problem.

**⚠️ `0133` was right to refuse to report a pass.** Running the parity suite, seeing green, and reporting
*"0112 re-verified"* would have laundered an unrunnable step into a runnable-looking green — precisely
the failure `0112`'s own close already committed once.

**What `0133` did find, and why it is not enough.** A **substitute check** — grep `lead` ↔
`sprint-ship-loop` across the source of truth `claude/skills-for-role.sh` and its four documented mirrors
— **passes 5/5 today**, so `0112`'s *substance* looks intact and only its *verification wording* was
phantom. **That is a signal, not a discharge:** it was run in passing by a coder whose brief did not
scope it, it is recorded nowhere as `0112`'s standing verification, and nobody has ruled it the right
check. **The owner's accepted risk on `0112` remains open.**

**⚠️ Only the owner can close this loop.** `/fkit-task-done` stops on a folder already under `done/`, and
its one exception — the **owner-verification upgrade** that clears `(agent-closed — not owner-verified)`
— is **owner-only**; an agent hitting the same case still stops. `0187` produces the evidence and the
recommendation; **it cannot change `0112`'s landed status, and neither can any agent.**

**Owner: `fkit-producer`.** The check is trivial and read-only; the judgment about what counts as
covering `0112` is a scoping call. **Depends on: nothing** — `0133` closed 2026-08-02 and supplied the
evidence.

---

### Addendum — task `0142` closed and its two follow-ups `0188`–`0189` added out of band (2026-08-02): the skill-ownership fact-inventory gap

**Closed by a SPAWNED producer with no owner channel — `✅ Done (agent-closed — not owner-verified)`**
(ADR-033 §5). The owner ruled on the recommendation and on 15 review findings across 3 rounds; **that is
a ruling on the content, not a verification of done-ness.** Nobody human has checked that this task is
finished.

#### What `0142` produced

**An investigation and a ruling. Report-only, no implementation** — its own verification step 5 required
that. Two deliverables:

- [`reports/2026-08-02-skill-ownership-fact-inventory-gap.md`](../../knowledge-base/reports/2026-08-02-skill-ownership-fact-inventory-gap.md)
- **ADR-036** — [`adr-036-the-skill-ownership-site-inventory-is-a-declared-registry.md`](../../knowledge-base/decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry.md), **accepted**

#### The ruling (owner-signed 2026-08-02)

Build **A-i** — a **declared site registry** (`test/skill-ownership-sites.mjs`, `{ path, kind, reason }`
with a **≥30-character `reason` floor**, in `test/dual-home-parity-exceptions.mjs`'s shape) plus a
**completeness tripwire**; **defer A-ii**; **demote the `claude/skills-for-role.sh` mirror checklist to a
pointer at the registry.**

> **Its tradeoff, carried verbatim: it makes the *INVENTORY* mechanical, NOT the *SWEEP*. A registered
> site whose prose quietly goes false still ships false.**

**The inventory: 39 rows across 21 classes over 61 fact-site files** — against a mirror checklist that
names **five**. Two independently-written enumerators (the reviewer's and Codex's) both confirmed at
round 3 that **no unregistered ownership-fact site remains**.

#### ⚠️ The finding that most deserves recording: this artifact reproduced the defect it was investigating, TWICE

Round 1 shipped an inventory of **21 rows** whose stated method **never opened three surfaces its own ADR
declared in scope**. Round 2's correction **still missed a site** — and it was **the exact shape both
documents swore had no live instance**: `claude/scaffold/ai-agents/knowledge-base/PROJECT.md`,
attributing `fkit-initiate-project` to the producer **by possessive alone**, nearest ownership verb
**839 characters** away. **Round 3 was the first round the inventory survived the attack.** The report
says this plainly in its §0.1 and it is recorded here so the close does not lose it.

**A pattern the review named and the report now honors:** the sequencing note for follow-up 1 carried
**two false mechanisms in two consecutive rounds, both asserted rather than measured**. It now carries
**no mechanism at all** — the sequencing rests on the owner's ruling alone.

#### The five triggers — all specified and priced

The owner ruled two scoping calls (the **bare token `skills_for_role`** into the trigger set, and
**`test/` inside the live surface**), then a **fifth trigger (e)** (a role name within 80 characters of
an ownership verb), then a **re-scope of trigger (c)** — which the reviewer had **proved was a no-op**,
`(c) ⊆ (b)`, at every window from same-line to unbounded. The re-scoped **(c)** — a bare skill suffix
near a role name — catches the missed site with **zero false positives and zero new registry noise**, on
a **633-character stable margin**.

#### Review: THREE rounds, 🛑 Blocked twice

**15 findings R1–R15: 14 applied and re-verified, 1 accepted as a residual.** **Codex coverage FULL on
all three rounds** (`codex-cli 0.145.0`). Ledger **closed out 2026-08-02, final verdict ✅ ACCEPTED**.
**All five of the brief's verification steps PASS** (step 1 was PARTIAL after round 1).

**ADR-036 grants no completeness licence of any kind** — *"must **NOT** treat clause 4 as complete"*,
**with no exception clause anywhere.**

#### Residuals recorded at close — all of them

1. **FIVE live defects found and deliberately NOT repaired** (the brief was report-only). Stated in full
   in report Part 3 and in the `0188` row above; in summary: **D1**
   `claude/scaffold/CLAUDE.md`'s producer row omits `/fkit-task-brief`; **D2** *"only `fkit-query`
   carries no banner"* when **two** of 25 lack one; **D3** a dead line cited for `skills_for_role()`;
   **D4** the **FOUR**-mirror claim when there are five — **⚠️ its repair requires touching TWO files**,
   `claude/skills-for-role.sh` and `claude/fkit-claude.sh`, whose checklists are **byte-identical
   duplicates**; **D5** root `CLAUDE.md`'s *"invisible and unrunnable"*, contradicted by four other
   documents **and by ADR-018 §Decision 5, which records visibility as an accepted cost**.
2. **R15** — the appendix's *"282 instances across 49 files"* **does not reproduce**. Two
   separately-written implementations of the stated method both returned **291 across 50**; the extra
   file is `claude/fkit-claude.sh`, **already registered as A3**. **The conclusion is confirmed twice
   over** — all files registered, nothing beyond `C32` unregistered — and the discrepancy is **disclosed
   in place** as the dated measurement it is, rather than re-typed.
3. **R12's cause: UNKNOWN.** The withdrawn *"88 files"* figure **cannot be explained from the record**.
   Codex offered a plausible mechanism and it was **deliberately not adopted** — the reviewer judged that
   the right call, since *"guessing would have been the exact vice the report is about."*
4. **The proxy-measurement stance: no sweep result becomes a completeness licence.**
5. **`C32` is numbered out of sequence deliberately**, so that no existing row silently changes
   identifier between revisions.
6. **The report's §0 citation form** (`@YYYY-MM-DD:NNN` dated measurements) was ruled **LEGITIMATE** by
   the reviewer and by Codex independently — **no conflict with task `0160` or ADR-035** — and the owner
   ruled it be **passed to task `0171` as an input** to the `durable-citation-anchors` convention page.
   **`0171`'s brief was NOT edited by this close; the hand-off is recorded here.**

#### The two follow-ups filed

Both taken from **report Part 8**, in the order Part 8 gives them.

| Task | What | Sequencing |
|---|---|---|
| [`0188`](../../tasks/backlog/0188-repair-the-five-live-ownership-fact-defects/brief.md) | Repair the five live ownership-fact defects **D1–D5** | **FIRST**, on the owner's verbatim ruling *"do not let the build quietly repair its own corpus."* **No mechanical constraint — two were asserted, found false and withdrawn.** |
| [`0189`](../../tasks/backlog/0189-build-the-skill-ownership-site-registry-and-completeness-tripwire/brief.md) | Build **A-i** — the registry + the completeness tripwire, per ADR-036 | **After `0188`.** Carries the five-trigger spec **as written in ADR-036 clause 4** (pointed at, not paraphrased), the ≥30-char `reason` floor, that the registry is **authoritative and no count is hard-coded**, and that **ADR-036 grants no completeness licence**. |

**Not filed, and the reasoning is recorded so it is not lost:** **A-ii** (deferred by ruling), and a
re-scope of the **three-vs-four discrepancy** between `wiki-vault/wiki/systems/fkit.md` and this plan
about how many sites `0124` missed (report Part 7) — settling it needs the sweep `0142` was barred from
running, and **only `fkit-wiki` may write the vault**.

#### ⚠️ Priorities 166 and 167 are APPEND ranks, NOT merit rankings — flagged for owner confirmation

**Filed by a spawned producer with no owner channel, which never re-ranks** (ADR-035,
`/fkit-task-brief` step 5). **No existing row was re-ranked, renumbered, or inserted past.**

- **`0188` — APPEND AND MERIT DIVERGE, and it is the sharper of the two. On merit it belongs directly
  below `0158`**, at the top of the contiguous run of open rows, roughly **43 rows higher**, because
  **five live falsehoods sit in documents every agent reads on every turn** — root `CLAUDE.md`,
  `claude/scaffold/CLAUDE.md` (which ships into every consuming project), and `architecture.md`. Every
  day they stay, agents reason from them.
- **`0189` — merit and append coincide.** Its dependency on `0188` pins it below regardless.

### Addendum — tasks 0190–0194 added out of band (2026-08-02): the five filed follow-ups of `0158` / ADR-037

`0158` closed on 2026-08-02 having produced
[ADR-037](../../knowledge-base/decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md)
(`accepted`): **a skill rule binds a spawned worker against a contrary spawn instruction, unless the
instruction relays a named owner ruling on that exact point.** ADR-037 named **six** follow-ups. **Five
are filed here; one deliberately is not.**

| # | Follow-up | Filed as | Why |
|---|---|---|---|
| 1 | Worker-side clause → `claude/scaffold/universal-rules.md` | **`0190`** | The ADR binds nothing until it exists |
| 2 | Driver-side clause → `fkit-sprint-ship-loop`'s `## Hard rules` | **`0191`** | Separate from `0190`: no budget constraint, ships immediately |
| 3 | Whether `/fkit-task-done` step 5 needs amending | **`0192`** | Architect-owned; ADR-037 explicitly does not decide it |
| 4 | Repair `0158`'s own stale citations | **`0193`** | ADR-034 accepted residual; three open briefs cite it |
| 5 | **Wiki ingest of ADR-037** | **not filed** | Routine `fkit-wiki` work. `/fkit-wiki-sync` is delta-driven off the `.wiki-watermark` SHA and picks the new ADR up on its next run. **A board row here would track work the wiki role already owns end to end** — no decision, no dependency, no verification a producer could add. **Route it to `fkit-wiki`; do not treat its absence from the board as an oversight.** |
| 6 | ADR-036 registry check on both clause sites | **`0194`** | Filed as its own row precisely because its three prerequisites may land in any order |

**Why `0190` and `0191` are two briefs and not one.** They are the two halves of one ruling, but only
one is free. `0191` touches a single `SKILL.md` under no byte ceiling and can ship the day it is pulled.
`0190` **cannot land without an owner budget decision** — see below. Merging them would hold a free
change hostage to a paid one. ADR-037 §4's recorded **asymmetry** is the second reason: the worker-side
clause reaches every spawn through the injected rules block, the driver-side one reaches only the driver
that loads it, so **shipping either is not shipping the other**, and neither covers for the other.

#### ⚠️ `0190` carries an owner decision that has not been made — re-measured at filing, not inherited

| Quantity | Measured 2026-08-02 |
|---|---|
| Emitted rules block | **3570 B** |
| `RULES_MAX` | **4096 B** |
| Free / utilization | **526 B** / **87.16 %** |
| Standing ≥ 400 B-free target (owner ruling, task `0130`) | leaves **126 B** |
| `test/rules-block-budget.test.js` rounding gate | first reds at **3789 B** → **218 B of growth stays green** |

**The binding ceiling is the standing target, not the test.** ADR-037 §4's three drafted wordings
measured **174 / 186 / 212 B** — **all pass the test, all breach the standing target.** The ADR's own
counterfactual sentence is **313 B**. **Nothing drafted fits the 126 B headroom.** So `0190` must put
**(a) compress / (b) owner-signed bump (ADR-016) / (c) spend the margin below 400 B** to the owner. It is
not a call a coder or a spawned producer makes.

⚠️ **The three candidate wordings exist in no file** — accepted residual R4 of `0158`. `0190` re-drafts
and re-measures its own, and **must keep the conservative-branch-and-escalate escape**: the shorter draft
without it was a round-1 **high** finding and, read literally, re-points instance B's frozen ledger.

#### ⚠️ Priorities 168–172 are APPEND ranks, NOT merit rankings — flagged for owner confirmation

**Filed by a spawned producer with no owner channel, which never re-ranks** (ADR-035,
`/fkit-task-brief` step 5). **No existing row was re-ranked, renumbered, or inserted past, and no
`✅ Done` / `⛔ Cancelled` / `➡️ Moved` row was touched.**

- **`0191` — APPEND AND MERIT DIVERGE, and it is the sharpest of the five. On merit it belongs directly
  above `0143`**, at the very top of the open board **and above `0190`**, because it is the half of
  ADR-037 that ships with **no owner decision, no budget fight and one file touched** — and because both
  recorded instances began at a driver instruction, which is the surface this clause governs.
- **`0190` — APPEND AND MERIT DIVERGE. On merit directly above `0143`** too, since **ADR-037 binds
  nothing until this clause exists**. **Held back by one honest caveat:** it cannot ship without the
  owner's budget call, so heading the board with it heads the board with a blocked row.
- **`0192` — on merit directly below `0190`.** Cheapest of the three to leave open: **no wrong action is
  in flight**, and all three recorded encounters with the question reached the same conservative answer.
- **`0193` — on merit directly below `0192`**, bottom of the ADR-037 run. Its six facts are **wrong in a
  closed record, not in a running control**. Not lower still only because `0176`, `0180` and `0188` all
  cite that brief.
- **`0194` — merit and append very nearly coincide.** On merit directly below `0189`, its heaviest
  dependency; a registry assessment has no value before the registry exists.

**One conflict surfaced rather than planned around:** `0193`'s defect 6 is **`0180`'s live specimen**.
Repairing it removes the case `0180`'s guard is measured against, and repairing it in shape rather than
substance makes that guard **pass a defect it was built to catch**. `0193` carries the obligation to
update `0180` in the same change. **The two are not blocked on each other, but they must not be worked
independently.**

---

### Addendum — task `0143` closed and its follow-ups filed out of band (2026-08-02): the ADR-010 correction-note run

`0143` closed on 2026-08-02 having appended **three dated note blocks plus one header metadata bullet**
to [ADR-010](../../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md) —
`+71 / −0`, Status still `accepted`. **Closed by a spawned producer with no owner channel, so the row
carries `(agent-closed — not owner-verified)`** (ADR-033 §5). The process review named **seven**
follow-ups. **Five are filed here, one was folded into an existing row, one is not brief-worthy, and one
earlier item is CLOSED and must not be refiled.**

| # | Follow-up | Filed as | Why |
|---|---|---|---|
| 1 | `skillOverrides` retired by ADR-018 — §Context bullet 2 + §Decision 2 | **`0196`** | Owner-fenced out of `0143` by ruling Q4; `0143`'s own shipped parenthetical promises it |
| 2 | `skills_for_role()` moved + `skills:` frontmatter dropped — §Decision 5 + §Context | **`0195`** | **Priority-raised.** Until it lands ADR-010 contradicts itself on one screen |
| 3 | ADR-010's remaining stale code line-ranges, incl. one never checked | **`0197`** | Investigation-first: `claude/scaffold/CLAUDE.md:12-50` has never had its contents examined |
| 4 | The 12 displaced `adr-010:NNN` pointers in ADR-012 / ADR-018 / ADR-031 | **folded into `0171`** | **Owner-ruled 2026-08-02: *"fold into the durable-citation-anchors work (`0171`) — do NOT file standalone."*** |
| 5 | Teach `/fkit-record-decision` the correction-note form | **`0198`** | `0143`'s own brief named it and deferred it; the skill has no amendment procedure at all |
| 6 | Wiki resync of ADR-010's vault page | **`0199`** | `fkit-wiki` only (ADR-005). Two claims on the page are false today |
| 7 | Brief `## Priority` 124 vs board P125 | **not filed** | **Harmless per `conventions/priority-is-rank-not-identity.md`** — rank is board position, identity is the folder-name `NNNN` prefix. It is a real brief/board mismatch, and it is **systemic, not specific**: `0143` was displaced twice by later insertions and every displaced brief carries the same lag. `0143` is now a **closed row, and a closed row's rank is never touched**. A one-row brief would fix nothing general. **Recorded here so its absence from the board is not read as an oversight**; the general form belongs with `0155` / `0156`, which own the `## Priority` field. |

⛔ **Do NOT refile *"reconsider the notes' citation form"*.** It appeared on an earlier version of this
follow-up list and was **adjudicated settled** during `0143`'s review. The citation form is a **permitted,
not mandated** residual and binds `0170`. Refiling it would relitigate a closed disposition.

#### ⚠️ `0143` shipped a knowing self-contradiction — this is why `0195` is the priority one

ADR-010 now contradicts itself on one screen. The header bullet `0143` added names
`claude/skills-for-role.sh` as the home of `skills_for_role()`; **its neighbour §Decision 5 —
pre-existing and out of `0143`'s scope — still names `claude/fkit-claude.sh`.** A reader landing on
§Decision 5 alone is told the wrong file.

**It is not an oversight.** It is the owner's Q4 exclusion holding, plus the *"note, not a rewrite"* rule
forbidding an in-place edit. It is recorded in `0143`'s ledger as residual `R4-contradiction-ships`,
with a **re-raise condition that fires if `0195` has not landed by the end of Sprint 2** — the only
deadline on the open board.

#### The four binding form decisions from `0143`, and where they are recorded

`0143` was scoped to **establish the form**, and it did. Four decisions are now binding on every task
that appends a dated correction note:

| # | Decision | Source |
|---|---|---|
| 1 | The note goes **BELOW** the claim it corrects — departing from the vault's *"banner above claim"* convention, **with a recorded rationale** | Residual `R1-placement`, kept-as-shipped |
| 2 | The `- **Corrections:**` header bullet is **one wrappable metadata item** carrying the legend — and the one part of an `accepted` ADR an append-only correction may extend | Owner ruling Q3; residual `R5-header-form`, ratified |
| 3 | **No `:NNN` into a mutable file** — anchor by file plus quoted phrase. **Permitted, not mandated** | `0143` accepted residual |
| 4 | **Two markers only: ⚠️ drifted fact / ⛔ overturned decision.** No third | Owner ruling Q1; shipped legend |

**`0170` inherits all four** — its row already cited *"cf. `0143`'s appended note on ADR-010"* as its
model, and the four are now written into both its row and its brief, with the ⚠️-not-⛔ call spelled out
and the `+N / −0` proof obligation attached. **`0198` is the task that moves them out of a closed task
folder and into `/fkit-record-decision`**, where the next architect will actually find them.

#### Other accepted residuals of `0143`, recorded and not filed

- **`R2-pointer-drift`** — the 12 displaced pointers. **Now `0171`'s Deliverable B** (item 4 above).
  Two are naked: `adr-012:87`, `adr-012:105`.
- **`Q4-scope-fence`** — the `skillOverrides` parenthetical stays as shipped; Codex's *"excluded scope"*
  reading was ruled **PARTIALLY CORRECT, not a defect**. `0196` discharges the exclusion; it does not
  reopen it.

#### ⚠️ Priorities 173–177 are APPEND ranks, NOT merit rankings — flagged for owner confirmation

**Filed by a spawned producer with no owner channel, which never re-ranks** (ADR-035,
`/fkit-task-brief` step 5). **No existing row was re-ranked, renumbered or inserted past, and no
`✅ Done` / `⛔ Cancelled` / `➡️ Moved` row was touched.** `0171`'s scope widening likewise changed no
rank.

- **`0195` — APPEND AND MERIT DIVERGE, and it is the sharpest of the five. On merit it belongs directly
  above `0162`**, at the very top of the open board: the only open row repairing a document that
  contradicts itself in the live tree today, the only one carrying an end-of-sprint deadline, and a
  single-file append with no unknowns. Its append rank of P173 is the **bottom of the board**.
- **`0198` — on merit directly above `0195`.** It is the only one of the five that makes the other work
  cheaper rather than more; not ranked above `0195` only because `0195` repairs a live contradiction and
  `0198` repairs a gap.
- **`0196` — on merit directly below `0195`.** Same act, same file, same form, no deadline.
- **`0197` — on merit directly below `0171`**, which supplies the anchor form it writes in.
- **`0199` — on merit directly below `0197`**, at the end of the run: every earlier row changes the
  state the vault page must describe, so running it first guarantees a second resync.

**Why five briefs and not one ADR-010 correction task.** `0195` carries the board's only deadline;
`0196`'s subject was **explicitly fenced out by the owner** as an unrelated cause; `0197` is an
**investigation** whose repair shape is unknown and whose legitimate outcome may be *"nothing needed
repair"*; `0198` touches a skill file, not an ADR; `0199` is **`fkit-wiki`-only by ADR-005** and cannot
be done by the same role as any of the others. Merging any pair would hold a free or urgent change
hostage to a slower one.

**⚠️ One coordination constraint that is not a dependency.** `0195`, `0196` and `0197` all append to the
same file. **They are not blocked on each other and they must not be worked in parallel** — whichever
lands second and third rebases on what is already there and re-runs the `−0` proof against the updated
baseline. `0171`'s Deliverable B re-derives its line numbers for the same reason.

---

### Addendum — task `0200` added out of band (2026-08-02): the Process-review role mismatch found mid-run

**Filed on an owner ruling given in the live `fkit-lead` `/fkit-sprint-ship-loop` driver session on
2026-08-02 via `AskUserQuestion` — *"File it as a task."*** The defect was established during that same
run. **Filing was the owner's call; the ranking below is an append, not a merit ranking** — see the
priority note at the end of this addendum.

#### What was found, and how

`fkit-sprint-ship-loop`'s step-2 spawn table row **"Process review"** names **`@fkit-coder`**. On this
run the driver instead spawned **`@fkit-architect`** for that step on **three consecutive tasks —
`0158`, `0143`, `0195`** — because each deliverable was architect work product (an ADR, and dated
correction notes on an ADR). Its reasoning: the role that owns the artifact should process its review.

`/fkit-process-stateful-review` is **coder-owned** — the `coder)` arm of `skills_for_role()` in
`claude/skills-for-role.sh`; the `architect)` arm does not carry it (both re-verified 2026-08-02). The
**ADR-018 `PreToolUse` hook therefore denied the skill** to the architect worker, resolving the role from
the payload's own `agent_type` as it is designed to at any spawn depth.

**Only the third of the three surfaced it.** On `0195` the worker reported the denial verbatim —
*"role 'architect' does not own skill 'fkit-process-stateful-review'"* — applied the **method by hand**
from the driver's spawn instruction, and **disclosed that it never read the skill's procedure text**.

| Task | State now | What its own record says |
|---|---|---|
| `0158` | closed, **read-only audit in flight** | `worklog.md`: *"Role: fkit-architect, spawned by `fkit-sprint-ship-loop`"*. Its `review.md` §Coder response **does not name the role**, and **no denial is recorded anywhere in the folder**. |
| `0143` | closed, **read-only audit in flight** | `review.md` §Coder response: *"Written by the **fkit-architect** running `fkit-process-stateful-review`"*. **No denial recorded.** |
| `0195` | `🔄 In progress` — **process-review being re-run by a coder**, on the owner's ruling | Denial reported verbatim, method applied by hand, non-execution disclosed. |

**Owner ruling, same session: `0158` and `0143` are AUDITED READ-ONLY, not reopened.** `0200` does not
edit them.

#### ⚠️ The hook worked. This is not a bug report against ADR-018

The gate caught a real routing error and denied exactly what it exists to deny. **Two other things are
wrong**, and they are what `0200` is for:

1. The loop's prose and the hook's enforcement **disagreed for three consecutive tasks before anyone
   noticed** — and were caught only because one worker chose to disclose a denial it had worked around.
2. **Nothing in the loop says *why* the coder is the right role for that step.** The rule is stated but
   not reasoned, so a driver holding an architect-authored deliverable re-derives the substitution as
   obviously right — which is precisely what happened, three times.

#### The question `0200` settles — deliberately left open here

- **(a)** the loop states plainly that Process-review is **always** `@fkit-coder` regardless of
  deliverable type, **and says why**; or
- **(b)** `skills_for_role()` grants `fkit-process-stateful-review` to `architect` as well.
- **A third answer may be right. Neither this addendum nor the brief pre-decides it.**

**The asymmetry, recorded as an input and not as a ruling: (b) widens a hook-enforced ownership
boundary — an authority-model change that would likely need an ADR — while (a) is a wording change to
one skill file.** (b) additionally drags the **four hand-maintained mirrors** named in
`claude/skills-for-role.sh`'s own header, one of which ships into every consuming project and whose
earlier incompleteness already shipped a false statement downstream (task 70). **Cheapness is an input
to the decision, not the decision.**

**A third wrinkle either answer must address:** the table row asks the worker to *"apply
`fkit-process-stateful-review` **method**"* — **method**, not *run the skill*. That wording is readable
as licensing hand-application by any role, which is close to what occurred.

#### Decisions it sits against

**ADR-018** (the hook, identity-following at any spawn depth — it performed correctly here) · **ADR-012**
(`skills_for_role()` is the single declared source of truth; ⚠️ ADR-012 itself still names the stale home
`claude/fkit-claude.sh` — the same class of defect `0195` is repairing in ADR-010, so cite the file, not
the ADR's path) · **ADR-033** (movers are producer-only — the precedent for *"this step belongs to that
role, structurally"*) · **ADR-037** (accepted 2026-08-02: a skill rule binds a spawned worker unless the
instruction relays a **named owner ruling**, and the owner ruled Q2 that it **binds the driver too**; the
substitution here carried no owner ruling — ⚠️ but ADR-037 §Context states it decides the **content**
axis and **explicitly not** the *"which skill may a role run at all"* axis, so **it does not already
answer this**) · **ADR-036** (if (b), the change is a new ownership-fact site to assess).

#### ⚠️ A fact defect found while filing, flagged and NOT repaired

`0143`'s `review.md` §Coder response asserts the architect was *"running `fkit-process-stateful-review`"*.
The hook denies that invocation to the architect identity at any depth, and **no denial is recorded in
`0143`'s folder**. Either the ledger overstates what happened or a denial went unrecorded — **both are a
record defect** — and `0158`'s ledger omits the role entirely. **Routed to the read-only `0158`/`0143`
audit already in flight; not touched by `0200`, and not filed as its own row** pending that audit's own
findings.

#### ⚠️ Priority 178 is an APPEND rank, NOT a merit ranking — flagged for owner confirmation

**Filed by a spawned producer with no owner channel, which never re-ranks** (ADR-035, `/fkit-task-brief`
step 5). **No existing row was re-ranked, renumbered or inserted past, and no `✅ Done` / `⛔ Cancelled` /
`➡️ Moved` row was touched.**

- **`0200` — APPEND AND MERIT DIVERGE. On merit it belongs directly above `0162`**, at the top of the
  open board: it is the only open row repairing a **live control** — a routing rule that has already
  misfired on three tasks and will misfire again on the next architect-authored deliverable this same
  loop ships — where every row above it repairs stale prose in a document. Its append rank of **P178** is
  the bottom of the board.
- **⚠️ Merit contention, stated so it is visible in one place.** `0195` already claims *"directly above
  `0162`"*, on the strength of its end-of-sprint deadline. **Both claims cannot hold.** `0195` carries a
  deadline; `0200` carries a live misrouting. **This addendum does not resolve it — the owner picks.**

**Why one brief and not two.** (a) and (b) are two answers to **one** question, and they are mutually
exclusive: deciding either settles the other. Splitting would file two implementation briefs for a
decision nobody has taken yet — the investigation-first rule forbids exactly that. The implementation
follow-ups get filed **after** the ruling, and will mostly be `fkit-coder`'s.

**Owner: `fkit-architect`.** Option (a) alone would be ordinary coder work, but the task is the *choice*,
and **(b) widens a hook-enforced authority boundary** — the architect's seat per
`conventions/task-owner-vocabulary.md`, and the same owner `0192` carries as the board's other open
*"decide whether the skill needs amending"* row. **Assigning it to the coder would presuppose (a).**

---

### Addendum — task `0201` added out of band (2026-08-02): three record-accuracy defects in two CLOSED review ledgers

**Filed on an explicit owner ruling** (`AskUserQuestion`, live lead driver session, 2026-08-02): append
the correction to `0143`'s closed ledger, **and fold `0158`'s two ledger gaps into the same task** rather
than filing them separately.

#### ⛔ The precondition, stated before anything else

**Both target folders are CLOSED.** A landed `✅ Done` belongs to the owner alone. `/fkit-task-done`
step 1 refuses a folder already in `done/` outright, and its **one** exception — the owner-verification
upgrade — is reserved to the owner in the same bullet (*"An agent hitting this case still stops: only the
owner can upgrade"*). **Both briefs read `✅ Done (agent-closed — not owner-verified)` today**, so neither
has had the owner's verification pass. **`0201` therefore requires explicit owner authorization to touch
those folders at all.** That is a precondition on starting, not a caveat on finishing.

#### The three defects, all re-verified first-hand at filing

| # | Ledger | Defect | Grading |
|---|---|---|---|
| 1 | `done/0143-…/review.md` §Coder response | Opens *"Written by the **fkit-architect** running `fkit-process-stateful-review`…"*. That skill is **coder-owned** (`coder)` arm of `skills_for_role()` in `claude/skills-for-role.sh`; **absent** from `architect)`), and the ADR-018 `PreToolUse` hook denies it to the architect identity **at any spawn depth**. **No denial is recorded anywhere in that folder.** | Record defect either way |
| 2 | `done/0158-…/review.md` header | Still reads **`Status: in-review`** while the task is closed and in `done/`. `/fkit-process-stateful-review` **step 6** requires the flip to `closed-out` once nothing blocking remains — and nothing was: R1/R2/R3 **FIXED**, R4/R5 **ACCEPTED RESIDUAL** on owner disposition. | **Substantive** |
| 3 | `done/0158-…/review.md` §Accepted residuals | Both entries carry **What** and a structural **Why** but **no per-entry re-raise trigger** — only a blanket preamble (*"raise a NEW finding only if new evidence changes what they are"*). | **Substantive (minor)** |

**On defect 1 — `0201` MUST NOT assert which reading is true.** Either the ledger **overstates what
happened** (the role applied the *method* by hand and described it as running the skill — exactly what
the `0195` worker disclosed doing, in the open) **or a denial went unrecorded**. A read-only audit by an
`fkit-coder` worker established that **the artifacts cannot distinguish them**: ledgers record authorship
and method, not tool calls. The note states both possibilities and that the evidence cannot decide
between them. **It does not investigate further to break the tie.**

**On defect 2 — a future round or reviewer opening that ledger reads `in-review` as live work.** Contrast
`0143`, which **did** flip and carries a dated close-out comment. ⚠️ **This is the one defect that is not
obviously an append**: flipping an existing line breaches additions-only. **Two shapes go to the owner and
`0201` picks neither** — **(i)** leave `in-review` byte-identical and append a dated ⚠️ note that the flip
was required and not performed, or **(ii)** perform the flip and append a note recording who, when and
why. **(ii) breaches additions-only; (i) leaves a header that actively misreads as live.**

**On defect 3 — stronger at filing than first reported.** Step 6 names `Re-raise-only-if` as a **required
part of the entry** (*"with its full What / Why (structural) / Re-raise-only-if"*), so this is a missing
required field rather than a style preference. A blanket *"unless new evidence"* is **unfalsifiable** — no
reader can tell whether it has fired. `0143`'s residuals by contrast fire on **named, checkable events**
(*"if follow-up 2 has not landed by the end of Sprint 2"*, *"if the durable-citation-anchors work is
cancelled"*). Suggested conditions in the brief are **not binding**: the implementer proposes, the owner
disposes.

#### The correction form is already established — and it is owner-ratified

`0143` established it and the owner ratified it; **a ledger correction follows the same discipline**:
false or stale text left **byte-identical**; a dated note appended beside it; **additions only, `+N / −0`**,
proven by `git diff --numstat` + `git diff -U0 | grep '^-'` and **not by eye**; **two markers only** — ⚠️
for a drifted or false fact, ⛔ for an overturned decision, and **all three notes here are ⚠️** because no
decision in either ledger is overturned; placement **BELOW** the claim (`0143` residual `R1-placement`,
with its recorded rationale — not re-litigated); and **no `:NNN` into a mutable file**, anchoring instead
by file + heading + quoted phrase. That last rule bites harder than usual here: **`0201` itself shifts the
line numbers inside both ledgers.**

⚠️ **One form question deliberately left open.** `0143`'s form includes a **header metadata bullet**, but a
`review.md` header is a different shape (`Task:` / `File(s) under review:` / `Status:`). **`0201` asks the
owner whether the ledgers get an equivalent line, and does not invent one.**

#### ⚠️⚠️ A genuine tension `0201` must NAME and must NOT resolve

The owner ruled **today** that **review-ledger paths stay frozen, because re-pointing rewrites evidence**.
Appending a dated note is **not** re-pointing — **but it is still writing into a frozen record**, and
**`0192` is open to decide exactly where that line sits**. `0192` records the collision in its own words:
`/fkit-task-done` step 5 treats a ledger reference like any other href — *"they record what happened, not
where a file lives"* — the **opposite** conclusion from the owner's instance-B ruling on the same class of
file. **Two documents in this repository currently point in opposite directions on the same act.**

**`0201` may be BLOCKED on `0192`, or it may be the concrete case that INFORMS `0192`. It does not get to
pick**, and ⛔ **it must not be cited as having drawn that line.** Its `Depends on: 0192` is declared in the
**safe direction** — gating keeps the board from showing it pullable while the question is live. **`0192`
or the owner may release it, and that release is not a re-rank.**

#### Cause: cross-referenced, not duplicated

All three defects trace to **one** driver error — `fkit-sprint-ship-loop`'s Process-review step routed to
`@fkit-architect` instead of `@fkit-coder` on three consecutive tasks (`0158`, `0143`, `0195`). **`0200`
(filed today) owns the routing question itself.** `0201` is the **cleanup, not the fix**, and it is where
`0200`'s own *"routed to the read-only `0158`/`0143` audit already in flight"* lands.

#### The audit's conclusion, carried honestly

**Nothing here warrants a reopen on its merits.** No obligation is unmet in a way that changes a decision,
misrepresents a finding, or leaves anything undispositioned — every finding in both ledgers was
dispositioned. **These are record-accuracy defects**, and each note must say so, so that a later reader
does not mistake a correction note for a re-opened round.

#### ⚠️ Priority 179 is an APPEND rank, NOT a merit ranking — flagged for owner confirmation

**Filed by a spawned producer with no owner channel, which never re-ranks** (ADR-035, `/fkit-task-brief`
step 5). **No existing row was re-ranked, renumbered or inserted past, and no `✅ Done` / `⛔ Cancelled` /
`➡️ Moved` row was touched.**

- **`0201` — APPEND AND MERIT AGREE, and no move is needed. On merit it belongs directly below `0200`**,
  where the append rank already puts it: it is gated on `0192`, which already sits above it, and it is the
  **lowest-urgency open row** on the board — every row above it repairs either a live control (`0200`) or a
  document a reader is actively being misled by, while this one repairs two records that are **already
  closed and already correct in substance**.
- **No merit contention.** Unlike `0195` and `0200`, `0201` makes no claim on the top of the board.

#### Why one brief and not three

**By the owner's ruling above.** The three defects share one cause, one artifact class, and **one
authorization gate**. Splitting would put **three separate owner-authorization requests in front of the
owner for the same act**. The decomposition default yields to a recorded owner ruling; the ruling is named
in the brief so a later reader does not read the single brief as a decomposition failure.

**Owner: `fkit-coder`.** All three defects sit in coder-side territory of the stateful review — §Coder
response is marked `CODER-OWNED — the reviewer does not write here`, the header `Status:` flip is
`/fkit-process-stateful-review` step 6, and §Accepted residuals is written by the coder side with owner
approval. ⚠️ **If `0200` rules option (b) — the architect gains the skill — this owner field does not
auto-follow; revisit it before starting.**

---

## Addendum — `0195` closed 2026-08-02: the ADR-010 serialization chain, and two follow-ups deliberately NOT filed

**Written by a spawned `fkit-producer` at `0195`'s close, running `/fkit-task-done`. No owner channel —
the close is marked `(agent-closed — not owner-verified)` per ADR-033 §5.** The owner ruled every
decision named below live via `AskUserQuestion` on 2026-08-02, but did not personally verify done-ness.

### 1. ⛔ The ADR-010 chain runs STRICTLY SERIALLY — and the ranks do not say so

Five open rows touch ADR-010 or its citations. **The `## Priority` numbers are append ranks (ADR-035) and
encode none of this ordering.** The order is:

| # | Task | Board rank | Why it cannot move earlier |
|---|---|---|---|
| 1 | `0195` | P173 | ✅ **Landed 2026-08-02**, `+53 / −0`. It is the baseline the rest measure against. |
| 2 | `0196` | P174 | Appends to ADR-010; its `−0` proof is meaningless unless `0195` is already in the tree |
| 3 | `0197` | P175 | Appends to ADR-010 again; needs `0195` **and** `0196` in the tree |
| 4 | `0171` | P151 | Its folded-in half re-anchors the **12 displaced `adr-010:NNN` pointers**. Run before the appends land and it re-anchors against a **moving** ADR-010, and the new anchors re-rot on the next append. *(The convention-page half of `0171` carries no such constraint and may run any time.)* |
| 5 | `0199` | P177 | The vault resync must describe ADR-010's **final** state, so it runs last |

**This is an ordering constraint on file writes, not a `Depends on:`** — no task here waits on another's
*outcome*. **Recorded in the briefs themselves as well as here**, so a worker who never opens this board
still sees it: `0196`, `0197`, `0171` and `0199` each carry a `⛔ SERIALIZATION` bullet in their `## Notes`.

⚠️ **`0197` was NARROWED in place at this close** (owner ruling OQ-3, 2026-08-02, which assigned the
narrowing to the producer). Its item *"§Context, the two-lists passage — `claude/fkit-claude.sh:75-86`"*
is now the **line-range half only**. `0195`'s two blocks already corrected the **file** half; left
un-narrowed, `0197` would have re-annotated a corrected site and put the same fact in two places — the
defect the correction-note form exists to remove. **Its rank did not change.**

⚠️ **`0199` was corrected in place, not re-ranked.** Its §Context and its *What to build* item 4 both
still describe the §Decision 5 contradiction as **live** and name `0195` as its future repair. `0195` has
landed, so that framing is stale; a note in its `## Notes` says to record the contradiction as **history**,
and states the two facts a resync must not miss — **ADR-010 now carries five dated correction blocks**
(three from `0143`, two from `0195`), and **the header `- **Corrections:**` item now carries two site
lists**, an original plus a continuation line.

### 2. The ADR-034 pointer gap — NOT filed, already covered by `0169` (P148)

`0195`'s re-run Process-review found that the first worker **skipped the Step-0 ADR skim** and therefore
missed **ADR-034**, the decision that set that review's close bar. ADR-034 §Binds predicted this in
writing: no skill was ever edited to carry a pointer to it, so the ADR is its only durable home.

**A new brief was considered and rejected as a duplicate.** Row **P148 / `0169` — *"Point the
stateful-review close conditions at ADR-034's work-product bar — four sites, three files"*** already owns
exactly this, and covers all three sites named at the close (`fkit-stateful-review`'s *"when warranted"*
line, `fkit-process-stateful-review`'s Step-6 close condition, `fkit-task-ship-loop`'s termination
condition) **plus a fourth the ADR does not name.** All three were re-verified present and pointer-free on
2026-08-02: `grep -i adr-034` over the three skill files returns nothing.

**What was added instead:** an evidence note in `0169`'s brief recording that the predicted failure has now
**happened once, observed**, and that the four cited line numbers must be re-measured at implementation
time — `fkit-task-ship-loop`'s step-7 close line measured at `:166` on 2026-08-02 against ADR-034's cited
`:160-162`. **`0169`'s rank did not change.**

### 3. `0198` strengthened in place — the form now has a SECOND application

`0198` (P176, teach `/fkit-record-decision` the correction-note form) was written when the form had exactly
one application (`0143`). `0195` is the second, and it produced two generalizations `0143` alone could not
support. Both added to `0198` as pieces **6** and **7**, with matching verification steps; **rank
unchanged**:

- **Indentation follows the claim, and prose gets indent 0.** All three of `0143`'s blocks correct claims
  inside **list items** and are indented to match (2 and 3 spaces). `0195`'s §Context block corrects a
  **top-level paragraph** and sits at **column 0**. `0143` alone would have taught that correction notes
  are indented — an accident of what it happened to correct.
- **Cross-reference, do not restate.** `0195`'s §Context note deliberately does not repeat the fact its
  §Decision 5 note carries, and **says so out loud**. This is the multi-site rule the form was missing: one
  site carries the fact, the others point at it, and the pointing note says it is pointing on purpose.

### 4. The `+49` framing line in `0195`'s ledger — NOT filed, and it is a weaker defect than reported

It was handed to this close as a *"known record defect — stale by 4 lines"*. **Read first-hand at the
close, it is less than that**, and the correction is recorded here so a later reader does not chase it:

- **Line 4** reads `… (+49 / −0 for this task)` — the round-1 measurement.
- **Lines 5–6, immediately below, reconcile it explicitly**: `Status: closed-out 2026-08-02 … (+53 / −0
  for this task after the fixes; was +49 / −0 at round 1)`.

So the ledger is **not merely non-contradictory, it is self-explaining** — it states both numbers, labels
which round each belongs to, and says which is current. The residual is cosmetic: a reader who stops at
line 4 sees a round-1 number without a round label. **Not brief-worthy on its own.**

**And filing it would pre-decide an open question.** The owner ruled on 2026-08-02, during this same run,
that **a review ledger's recorded paths stay frozen** — re-pointing them rewrites evidence. Whether that
freeze extends to a ledger's **prose and numbers** is exactly what **`0192`** (P170, *"Decide whether
`/fkit-task-done` step 5 needs amending on the ledger-freezing reasoning"*) exists to settle.

**Recommendation, for the owner:** leave it. If `0192` later rules ledger prose repairable and the owner
still wants line 4 labelled, the natural home is **`0201`** (P179), which already appends dated correction
notes to two closed ledgers for the same class of defect — extend its scope to a third rather than filing
a fourth row. ⚠️ `0201`'s scope fence excludes `0195`'s folder by name, so extending it is an **owner
decision**, not a producer edit.

### 5. ⚠️ Two things this close did NOT repair, by rule

- **`review.md` line 3's brief path** still reads `tasks/backlog/0195-…`, now dead. **Left frozen on the
  owner's 2026-08-02 ruling** — a ledger's recorded paths are evidence. It is the exact class row **P147 /
  `0168`** already owns (*"Remediate the dead brief paths in closed `review.md` ledger headers"*), with
  **P153 / `0175`** as its guard. Nothing new to file.
- **The `0200` narrative table above** (§*"`0143` shipped a knowing self-contradiction"*) still shows
  `0195` as `🔄 In progress` in its *State now* column. That block is a dated scoping record of what the
  `0200` investigation found, not a tracked status row; **the tracked row is P173 and it now reads
  `✅ Done (agent-closed — not owner-verified)`.** Flagged rather than edited, because rewriting another
  task's investigation record is not this skill's authority.

---

### Addendum — task `0162` closed and its follow-ups `0202`–`0206` added out of band (2026-08-02): the faithful-carry ruling

**Authority, stated before any outcome.** The five rows below were **appended** at P180–P184 by a
**spawned `fkit-producer` with no owner channel**, per `/fkit-task-brief` step 5 and
[ADR-035](../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md).
**Nothing was renumbered and nothing was inserted.** Every one of the five carries the required
`⚠️ APPEND rank, NOT merit` flag plus a stated merit position, in its board row **and** in its brief.
**This is not producer precedent for re-ranking.**

**`0162` closed as `✅ Done (agent-closed — not owner-verified)`** (ADR-033 §5) — a spawned producer has no
owner channel, so no human verified this work.

#### What `0162` shipped

Report-only, exactly as its brief required: one new file,
[`ai-agents/knowledge-base/reports/2026-08-02-faithful-carry-of-an-approved-plan.md`](../../knowledge-base/reports/2026-08-02-faithful-carry-of-an-approved-plan.md).
No ADR, no `SKILL.md` edit, no source, no test, no brief, no board row written by the task itself.

**The ruling.** A faithful carry is a **copy operation over a durable artifact, never recall over
conversation state** — a **byte-exact read** (explicitly **not** the `Read` tool, which `cat -n`-frames its
output and caps at 2000 lines), a whole-file check, an unaltered paste, plus a path + `git hash-object`
pointer. **Truncation is never permissible.** The governing rule:
***"verbatim" is a word a driver may apply only to bytes it read from a file that turn.***
Condition **(b)** of the declared-approval marker **stands byte-unchanged**, and **`0163` needs no edit**.

**Verification, driver-confirmed firsthand:** `npm test` → **560 pass / 0 fail / 17 suites**, prove-red
hard gate **PASSED**. Nothing touched outside docs (`git status -- claude/ test/ package.json` empty);
`ai-agents/wiki-vault/` clean. Review: **1 round, Codex coverage FULL** (`codex-cli 0.145.0`, exit 0),
**8 findings** — 2 high, 3 medium, 3 low — all verified **CORRECT** and all fixed. Ledger
`Status: closed-out`.

#### ⚠️ Three things that survive this close unsoftened

1. **A CONFIRMED LIVE PRODUCTION FAILURE, `R4b`.** Going to supply the path/hash pointer the owner had
   just approved, the driver found that `0162/plan.md` **is not the approved plan** — the Build worker
   **authored a re-rendering** rather than **copying** the approved bytes (two of three distinctive strings
   absent; `git hash-object` = `2458a57eda55ca774884110e76dee1bf91b6d6e0`). What the report had written
   down as a theoretical residual is now **dated and evidenced, on the task that defined it**. This is why
   the owner ranked follow-up 1 (`0202`) for this sprint.
2. **No independent re-verification of the 8 fixes ran.** The processing worker verified each fix as it
   made it — **that is not a second pair of eyes**. **`R1`'s fix widened from 2 dispositioned sites to 6.**
   The owner was told this explicitly and ruled to close on **ADR-034**'s work-product bar anyway. The
   statement of the limit is in the review ledger and is **left unsoftened**.
3. **Accepted residual `carried-not-approved`.** The hash pins which bytes were **carried**, not which were
   **approved**. A driver that writes an unapproved `plan.md`, carries it faithfully and hashes it
   correctly produces a green check over bytes the owner never saw. **Structural, not provisional** —
   approval is granted in a session channel that leaves no artifact
   ([ADR-021](../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md);
   `claude/askuserquestion-marker-hook.sh` writes an **empty** marker, and no `.jsonl` transcripts exist
   in-repo). **Follow-up 1 does NOT close it** — it closes only the **reconstruction route**.

#### The five rows, and why they split this way

| Row | Rank | Owner | Why it is its own shippable unit |
|---|---|---|---|
| `0202` — `plan.md` at plan approval + artifact table | P180 | `fkit-coder` | The prerequisite. One `SKILL.md`, testable on its own, and the fix for `R4b`. |
| `0203` — amend the *"Rules that make this honor the ADRs"* bullet | P181 | `fkit-coder` | A different region of the same file, and it **ships knowingly incomplete** carrying the `unverified — no hook checks it until follow-up 3 lands` marker. |
| `0204` — the `PreToolUse`/`Task` carry-check hook + tests | P182 | `fkit-coder` | Code plus tests plus a hook registration — a different change class entirely, and **hard-gated** on `0202`. |
| `0205` — dated correction note to ADR-037 §5 | P183 | `fkit-architect` | An ADR amendment, `+N / −0`, independent of all three above. |
| `0206` — wiki ingest of the report | P184 | `fkit-wiki` | `ai-agents/wiki-vault/` is `fkit-wiki`'s exclusive write surface (ADR-005). |

**Dependency order:** `0202` → `0203`; `0202` → `0204` (**hard gate**). `0205` and `0206` are independent.

**⚠️ Merit and append rank diverge sharply on `0202`** — by roughly fifty places. On merit `0202` belongs
**directly above `0154`**, at the very top of the open board: it is the only open row repairing a control
with a **dated, evidenced live failure** against it, and it gates two other rows. **The owner has already
ruled the sequencing** — `AskUserQuestion`, live `fkit-lead` session, 2026-08-02, on `0162`'s OQ-4:
**rank now, drive this sprint** — but a sequencing ruling is **not** authority to renumber the board, so
the rank above is append and the owner confirms it.

#### Follow-up 5 was CANCELLED and deliberately NOT filed

`0162`'s report §10 row 5 proposed a single joint reconciliation of condition **(b)** and `0163`'s refusal
clause. It was **conditional on the owner choosing pure by-reference**, and the owner **rejected** pure
by-reference (OQ-1). **(b) stands byte-unchanged; `0163` needs no edit; no row was filed.** Recorded here
so a later reader does not read the gap in the numbering as an omission.

#### Follow-ups 6 and 7 were producer work and were done in place, not filed

Both are repairs to `0162`'s own brief, now at
`ai-agents/tasks/done/0162-decide-the-construction-that-satisfies-the-verbatim-carry-requirement/brief.md`.
Editing a **closed brief** is sanctioned — the owner's 2026-08-01 ruling grandfathers `done/*/review.md`
**only**, and `done/*/brief.md` is explicitly not exempt (the same basis `0193` files on).

- **Follow-up 6 — two stale citations repaired.** `…SKILL.md:109` → **`@2026-08-02:110`**, and the quote
  range `(:109-115)` → **`(:110-116)`**. Re-verified firsthand 2026-08-02: the rule bullet is at `:110` and
  the quoted block spans `:110-116`. **The same stale `:109` appeared in this board's `0162` row and was
  repaired there too**, re-cited in the durable `path@date:line` form.
- **Follow-up 7 — the test-surface claim corrected**, as a **dated correction note below the claim**, per
  the `0143` `R1-placement` precedent. The brief said *"no test in `test/` reads `fkit-coder.md` or any
  `SKILL.md` content **at all**"*. That is **too strong**: `test/skill-frontmatter.test.js` **does** read
  every `claude/skills/*/SKILL.md` and every `claude/agents/*.md`, over a discovered-then-pinned corpus
  (live-corpus tests at `@2026-08-02:577` and `:597`, pinned to `EXPECTED_SKILLS = 25` /
  `EXPECTED_AGENTS = 7` at `:574-575`). It audits **frontmatter only** — so the accurate claim, and the one
  the task actually rests on, is **no test reads the prose *body***. The narrower supporting check still
  holds: `grep -rn 'fkit-coder.md' test/` returns one hit, an `existsSync` path check in
  `converge-contract.test.js@2026-08-02:357`.

#### ⚠️ Three things this close did NOT repair, by rule — flagged, not edited

- **`0162`'s `review.md` line 3** still reads `tasks/backlog/0162-…`, now dead. **Left frozen on the
  owner's 2026-08-02 ruling** — a review ledger's recorded paths are evidence, and re-pointing rewrites
  evidence. Same class as **P147 / `0168`**, guarded by **P153 / `0175`**, and to be codified by **`0192`**.
  Nothing new to file.
- **The decision report's `§0.1` path citation** (`…/reports/2026-08-02-faithful-carry-of-an-approved-plan.md`
  line 48) still names the `backlog/` folder. It is **not an href** — it is the object of a dated evidence
  claim (*"an `ls` of \<path\> at the start of this turn returned exactly one file"*). Re-pointing it would
  falsify the evidence rather than repair a link. **Left deliberately.**
- **⚠️ DISCREPANCY, unrepaired: `0162`'s brief `## Priority` reads `127`; this board's row reads `P128`.**
  Verified 2026-08-02 — P127 is now held by `0150`. The brief also carries a long 2026-07-29 narrative
  arguing *"P127 is the highest rank reachable"*, so changing the field alone would make the brief
  internally inconsistent and changing both is a rewrite of a historical record, which is beyond a close's
  authority. **This is exactly `0193`'s defect 3 in a different brief.** Flagged for the owner: extend
  `0193`'s scope to `0162`, or leave it. **A producer did not decide this.**
  - **Dated correction, 2026-08-03 — RULED, no longer an open flag.** The owner ruled
    (`AskUserQuestion`, live `fkit-lead` session, 2026-08-02): **extend `0193`'s scope to cover `0162`'s
    brief.** `0193`'s brief now carries it as **defect 7**, with the repair constrained to a **dated
    correction only** — the `## Priority` field moves to the board value `128`, and the two P127 bullets
    in `0162`'s brief stay **byte-unchanged** as the historical record of the 2026-07-29 ruling.
    **`0193`'s rank was not changed** (still P171). **The discrepancy itself is still unrepaired** — this
    records who owns the repair, not that it happened.

## Addendum — 2026-08-03: the sprint-2 open-row triage (52 → 7), and the block that stops it executing

**Authority, stated first and in full — before any outcome.** The classification below was produced by
a spawned `fkit-producer` and **ruled on by the owner** via `AskUserQuestion` in a live `fkit-lead`
session on **2026-08-03**. The producer had **no owner channel**; it proposed, the owner decided. This
addendum is a **record of a decision, not an execution of one.**

> ⚠️ **NOTHING BELOW HAS BEEN EXECUTED. Not one row has moved.** All 45 moves, the `0146` → `0144`
> merge, and the `0149` ruling are **blocked** on task
> [`0210`](../../tasks/done/0210-specify-and-support-the-reverse-move-sprint-to-backlog/brief.md)
> (P188), which builds the reverse-move marker and parser those moves require. The board above still
> shows **52 open rows**. It is telling the truth. **The 52 → 7 reduction has not happened.**

> ⚠️ **Dated correction 2026-08-03 — the blockquote above is SPENT. Every claim in it was true when it
> was written and every one of them is false now.** The blockquote is **left byte-identical** as the
> record of what was true at the moment the triage was ruled, and this note is an append below it.
>
> **Marker legend for this addendum:** **⚠️ = a fact that drifted** (the ruling itself is untouched);
> **⛔ = a decision a later ruling overturned** (do not follow it). No existing line of this addendum was
> edited.
>
> **What is true today**, re-derived 2026-08-03 with
> `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md` — ⚠️ the **`claude/` copy
> by path**, because the gitignored `.claude/` mirror still carries the pre-`0210` parser and emits
> false drift on exactly these rows:
>
> - **The moves WERE EXECUTED, 2026-08-03. 45 rows now carry `➡️ Moved to [Backlog](../backlog.md)`.** The
>   reader reports `count moved 45`, and the 45 executed IDs are the **identical set** to the 45
>   classified under *"The 45 movers — destination: the Backlog board"* below — compared element-wise,
>   not by count alone.
> - **6 survivors remain open, NOT 7.** The reader reports `count backlog 6`: `0167`, `0190`, `0191`,
>   `0200`, `0203`, `0208`. The seventh, **`0173`, closed earlier the same day — after this addendum was
>   written** — and its row in *"The 7 survivors, and why each stays"* already carries the ✅. The
>   *"7 + 45 = 52"* line below therefore stands as the count **at triage time**, not the count today.
> - **`0149` moved with the other 44**, per the owner's ruling recorded at the foot of this addendum.
>   It was **not** cancelled, and `/fkit-task-cancelled` was never run on it.
> - **The `0146` → `0144` merge was NOT performed** — and it is no longer waiting. The owner ruled on
>   2026-08-03 that both stay separate; see the ⛔ notice under *"Two owner rulings recorded, awaiting
>   the unblock"*.
> - **The block this blockquote names is discharged.** `0210` is
>   **✅ Done (agent-closed — not owner-verified)**, which is what allowed the moves to execute.
>
> **Board totals behind these numbers:** **132 done · 6 backlog · 5 cancelled · 45 moved — of 188.**
>
> **This is a drifted fact, not an overturned ruling.** The triage's classification and the owner's
> 2026-08-03 decisions are unaffected; only the *"nothing has been executed"* status is.

### Why it is blocked — the reverse move does not exist

The forward move (backlog board → sprint) is specified in full in **two** places. **The reverse move
(sprint → backlog board) is specified nowhere and is unsupported by `dashboard.sh`.** Three candidate
forms were measured first-hand against the real script on 2026-08-03:

| Candidate | Sprint open-count drops? | Cost |
|---|---|---|
| Leave the cell `🔲 Backlog`, flip only the brief's `## Sprint` | **No** — still counts as open | achieves nothing |
| `➡️ Moved to [Backlog](../backlog.md)` | **Yes** | `drift nonconformance kind="moved-without-target"` on **every row, forever** |
| Delete the sprint row | Yes | no drift, but the pointer to where the work went is destroyed |

Cause verified at `claude/skills/fkit-status/dashboard.sh@2026-08-03:681` — the move-target regex matches
**only** `Sprint <digits>`, so `Backlog` yields an empty target.

**Owner ruling: extend the marker and the parser FIRST; the 45 moves wait behind it.** The owner
accepted the cost — that the 52 → 7 number does not land today — on the reasoning that this is the
**second** time an unspecified reverse operation has bitten this board. That work is `0210`.

### The 7 survivors, and why each stays

| ID | Rank | Why it survives |
|---|---|---|
| [`0167`](../../tasks/done/0167-decide-what-the-sprint-driver-does-when-a-spawned-worker-dies/brief.md) | P146 | The driver's §5.4 exit table has **no row for an abnormally-terminated worker**. Has **fired twice**. **✅ Done (agent-closed — not owner-verified).** |
| [`0173`](../../tasks/done/0173-tighten-the-wiki-completion-flag-block-in-all-three-wiki-skills/brief.md) | P152 | The wiki completion-flag template **manufactures a dead path on every emission** — happening today. **✅ Done (agent-closed — not owner-verified).** |
| [`0190`](../../tasks/done/0190-add-adr-037s-worker-side-precedence-clause-to-the-universal-rules-block/brief.md) | P168 | ADR-037 **§4 worker-side** clause was never installed. **✅ Done (agent-closed — not owner-verified).** |
| [`0191`](../../tasks/done/0191-add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules/brief.md) | P169 | ADR-037 **§3 driver-side** clause was never installed. **✅ Done (agent-closed — not owner-verified).** |
| [`0200`](../../tasks/done/0200-decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill/brief.md) | P178 | The loop routes Process-review to a role the **ADR-018 hook denies**. Has **happened three times**. |
| [`0203`](../../tasks/done/0203-amend-the-sprint-loops-honor-the-adrs-rule-with-the-faithful-carry-construction/brief.md) | P181 | The verbatim-carry rule **gives no construction for satisfying it**. |
| [`0208`](../../tasks/done/0208-add-an-exit-table-row-for-a-failed-build-verify-review-spawn-in-the-sprint-loop/brief.md) | P186 | Since `0202`, a failed Build/Verify/Review spawn **orphans an approved-plan artifact**. |

### The 45 movers — destination: the Backlog board

Grouped as classified. Every one is **still on the Sprint 2 board** pending `0210`.

1. **New tests / guards (10)** — `0144`, `0145`, `0152`, `0154`, `0175`, `0176`, `0180`, `0182`, `0189`, `0204`
2. **Correction notes on ADRs and reports (8)** — `0170`, `0186`, `0196`, `0197`, `0199`, `0205`, `0206`, `0207`
3. **Record repairs on closed tasks (7)** — `0146`, `0149`, `0155`, `0168`, `0183`, `0193`, `0201`
4. **New convention pages (2)** — `0171`, `0178`
5. **Skill / agent prose amendments (9)** — `0156`, `0163`, `0169`, `0172`, `0179`, `0181`, `0184`, `0198`, `0209`
6. **Deferred decisions and investigations (9)** — `0164`, `0165`, `0166`, `0177`, `0185`, `0187`, `0188`, `0192`, `0194`

7 + 45 = 52, the board's full open count as of 2026-08-03.

### Two findings that matter more than the count

#### Finding 1 — justification 1 is empty, and that emptiness is itself the finding

The keep/move test admits exactly two justifications: **(1)** something already in Sprint 2 depends on
it, or **(2)** a live control is broken. **All 7 survivors passed on justification 2. Justification 1
never fired once.**

**Why:** every dependency edge among the 52 points either at an **already-closed** task or at **another
of the 52**. A dependency chain wholly inside the set being removed **moves with the set** — it creates
no reason to keep anything. The producer therefore applied justification 1 only where a **surviving** row
depended on a candidate, and that condition was never met.

⚠️ **Record the alternative reading, because it is defensible and it changes the answer.** Read
justification 1 as *"any `Depends on` edge counts, regardless of where the other end sits"* and roughly
**20 rows** would have been kept — which **defeats the exercise**. The narrow reading is a **judgement
call by a spawned producer**, ratified by the owner on 2026-08-03. It is not derived from any written
rule, because no written rule covers it.

#### Finding 2 — the dependency field is present but *unstructured*, and the task that would fix that is a mover

⚠️ **This finding is recorded in CORRECTED form.** The producer that produced the triage reported it as
*"there is no `## Depends on` field; every dependency lives in prose."* **Re-verified first-hand on
2026-08-03, that is half right and the half it gets wrong matters.**

**What is true:** no brief in the repo carries a `## Depends on` **heading**. 60 of the 62 briefs then
under `ai-agents/tasks/backlog/` share exactly nine `##` headings (`ID` · `Sprint` · `Priority` ·
`Status` · `Owner` · `Context` · `What to build` · `Verification steps` · `Notes`); the other two add a
bespoke evidence or caveats heading.

**What is wrong:** dependencies are **not** loose prose. `dashboard.sh` (`depends_raw()`, `:314-400`)
parses **three** declaration forms — a `## Depends on` heading, a bold `**Depends on:**` bullet, and a
plain `- Depends on` bullet — and **60 of the 62** briefs carry a recognized one, almost all in the bold
bullet form. The dashboard already emits a `derive <id> depends="…"` fact for each. Only `0013`, `0037`
and `0045` declare nothing at all.

**The real defect is that the declared VALUE is free prose**, not a task list — e.g. `0154`'s reads
*"nothing hard. Soft-follows 0153 (rank 117), which changes the exact strings this test asserts…"*. So
the field is machine-**located** but not machine-**read**, and the graph still had to be recovered by
pattern-matching the values for `needs` · `depends on` · `blocks` · `soft-follows` · `coordinates with`
and reading every ambiguous one firsthand. **That is a lossy method and it should be recorded as one** —
but the gap to close is *value structure*, not *field existence*. A future task scoped as "add the
field" would be scoped against a fact that is not true.

⚠️ **The field this triage most needed is itself one of the 45 movers.** Task
[`0184`](../../tasks/backlog/0184-record-depends-on-blocks-as-the-binding-execution-order/brief.md) (P162)
would make `Depends on` / `Blocks` binding — and it is classified **move to Backlog**. Deferring the
instrument that would make the next triage cheap is a real cost; it is recorded here so the next
producer sees the trade rather than repeating the extraction.

### Sequencing constraints among the 7 survivors

**Four of the seven edit the same file** — `claude/skills/fkit-sprint-ship-loop/SKILL.md`: `0167`,
`0191`, `0203`, `0208`.

⚠️ **This is FILE CONTENTION, not dependency.** No one of them needs another's outcome; they collide on
line numbers. Suggested order:

> `0167` → `0208` → `0203` → `0191`, then **`0190`, `0200` in parallel** (different files).
> (`0173` was in this parallel group; it is now ✅ Done and no longer a survivor to sequence.)
> (`0167` headed this chain; it is now ✅ Done (agent-closed — not owner-verified) and no longer a
> survivor to sequence. It shipped **report-only** and edited no `SKILL.md`, so it was never in fact
> part of the file contention this line describes — the chain now starts at `0208`.)
> (`0190` was in this parallel group; it is now ✅ Done (agent-closed — not owner-verified) and no
> longer a survivor to sequence. `0200` is now the only member of that parallel group still open.)
> (`0200` was the last member of that parallel group; it is now ✅ Done (agent-closed — not
> owner-verified) and no longer a survivor to sequence. The parallel group is now empty — `0173`,
> `0190` and `0200` are all closed.)

⚠️ **`0167` and `0208` must NOT be merged**, even though both add rows to the **same §5.4 exit table**.
`0167`'s open question is *whether that table needs a row at all* — folding a live question into an
implementation task **destroys the question**. They stay two tasks.

### `0185` is fed by this triage, not superseded

[`0185`](../../tasks/done/0185-decide-whether-sprint-2-rolls-over-to-a-fresh-board/brief.md) (P163,
owner-deferred) asks whether Sprint 2 rolls over to a fresh board. **It lacked a measured remainder.
This triage is that remainder** — 7 rows survive on merit, 45 do not. `0185` is **re-pointed at this
addendum** as its input. It remains a mover; it is not closed, superseded, or answered here.

### Two owner rulings recorded, awaiting the unblock

- **`0149` → BACKLOG. Do NOT cancel.** The prior producer proposed cancelling
  [`0149`](../../tasks/backlog/0149-record-that-0118s-block-on-0117-was-discharged-by-another-route/brief.md)
  (P138), **then argued against its own proposal**. The owner took the conservative alternative on
  2026-08-03: **move it, do not kill it.** `/fkit-task-cancelled` **must not** be run on it. It travels
  with the other 44 movers.
- **The `0146` → `0144` merge stays UNEXECUTED.** The proposal to fold
  [`0146`](../../tasks/backlog/0146-correct-the-false-menu-pick-claim-in-0139s-accepted-residual/brief.md)
  (P136) into [`0144`](../../tasks/backlog/0144-pin-the-team-team-room-rejection-with-cli-contract-tests/brief.md)
  (P134) is **recorded, not performed**. It waits with the moves.

  > ⛔ **Dated ruling 2026-08-03 — the merge is now DECIDED, not waiting: DO NOT MERGE. `0146` and
  > `0144` stay two separate Backlog rows.** Owner ruling, given live via `AskUserQuestion` in an
  > `fkit-lead` session on **2026-08-03**. The bullet above is **left byte-identical** as the record
  > that the proposal was open and unruled; this note is an append below it.
  >
  > **Why:** the merge's rationale was **schedule pressure inside Sprint 2**. Both rows are now
  > **unranked on the Backlog board**, so that pressure is gone. And `0146`'s own brief already argues
  > against folding — *"0144 is the durable fix and this is not a substitute for it"* — recording that
  > the owner had **previously** considered folding it into `0144` and chose to keep it separate so the
  > false sentence is corrected now rather than whenever `0144` runs. The 2026-08-03 ruling reaches the
  > same answer a second time.
  >
  > ⛔ **Do not re-derive or re-propose this merge.** Recorded here and in `0146`'s own brief.
  >
  > **Nothing was cancelled or closed by this ruling.** Both rows remain live Backlog work.

---

### Addendum — task `0222` added out of band (2026-08-05): record ADR-038, the loop-step role rule

**Filed on a NAMED OWNER RULING given via `AskUserQuestion` in the live `fkit lead`
`/fkit-sprint-ship-loop` driver session on 2026-08-05 — *authorize a producer follow-up to file
ADR-038*.** Filing was the owner's call. **The ranking below is an append, not a merit ranking** — see
the priority note at the end of this addendum. **This is not producer precedent for re-ranking:** the
producer that filed it was spawned, had **no owner channel**, and re-ranked nothing.

#### Why it exists

`0200` closed on 2026-08-05 having **ruled**, not merely investigated:

> *"The Process-review step's role is fixed by the skill the step runs, not by who wrote the
> deliverable: it is always `@fkit-coder`."*

Its report — `ai-agents/knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md` —
recommends **(a)** with the loop row's *"apply … **method**"* wording **kept and enumerated**, plus
**(c)'s paired detector as a non-optional companion**, and **rejects (b)**. §6 rules that the answer
**needs an ADR**, because it closes an axis **ADR-037 §Context explicitly left open**:

> *"Not decided here (the invocation axis): which skill a role may run at all."*

**The ADR records the decision; the report carries the reasoning.** `0222` writes the former and cites
the latter by path.

#### ⚠️ The number is NOT pre-allocated — a four-way sweep is mandatory

`adr-037` is the highest present in `decisions/` today, so **038 is likely**. It **must not be taken on
trust**. The **ADR-029 precedent** is that a number was once claimed **everywhere except
`decisions/`** — so the brief requires a sweep of **`decisions/`, `reports/`, the sprint boards, AND
`ai-agents/wiki-vault/`** (read-only; ⛔ never written — ADR-005) before allocating, and requires the
sweep to be **evidenced**, not asserted.

#### ⛔ Exactly ONE follow-up was filed — the other seven were NOT

`0200`'s report §8 names **eight** follow-ups. **The owner has authorized only this one.** The
remaining seven — the loop-row enumeration, the paired detector, the row↔ownership test, the
four-mirror checklist repair, the ADR-012 stale-path correction, the folded worklog `**Role:**` line,
and the ADR-036 registry assessment — are **held for the owner** and were **deliberately not filed**.
⛔ **Do not file them off this addendum.** They are in the driver's hand-off for the owner to rule on.

#### ⚠️ Dated correction 2026-08-06 — the section immediately above is FALSE today. Every follow-up is filed.

**It was true when written on 2026-08-05** and is left **byte-identical** as the record of that day.
⚠️ This is a **drift correction, not a reversal** — `0222`'s decision, scope, verification steps and
rank are all unaffected, and *"do not file them off this addendum"* still stands (there is nothing left
to file).

**The count was also wrong from the start.** Report §8 numbers items 1–8, but **item 6 is struck
through in the report itself** (*"~~Require a `**Role:**` line per worklog round~~ **FOLDED INTO
follow-up 3 (R2)**"*, confirmed by item 3's *"Supersedes follow-up 6, which is its second half"*).
There were **seven** distinct follow-ups, one of them `0222` — so ***"the other seven"* should have
read *"the other six"*** even on 2026-08-05.

**Filing status, measured on disk 2026-08-06:**

| §8 item | Task | Filed |
|---|---|---|
| 1 — enumerate the Process-review row's method steps | [`0223`](../../tasks/backlog/0223-enumerate-the-process-review-rows-method-steps-and-give-the-row-its-reason/brief.md) | 2026-08-05 |
| 2 — file ADR-038 | **`0222`** | 2026-08-05 |
| 3 — the paired misroute detector | [`0224`](../../tasks/backlog/0224-build-the-misroute-detector-as-a-pair-denial-log-and-worklog-role-line/brief.md) | 2026-08-05 |
| 4 — the loop-table row↔ownership test | [`0225`](../../tasks/backlog/0225-add-the-loop-table-row-to-skill-ownership-test/brief.md) | 2026-08-05 |
| 5 — repair the four-mirror checklist | [`0226`](../../tasks/backlog/0226-repair-the-four-mirror-checklist-in-skills-for-role-shs-header/brief.md) | 2026-08-05 |
| 6 — worklog `**Role:**` line | ⛔ **struck in the report**, folded into item 3 = `0224` half (ii) | n/a |
| 7 — correct ADR-012's stale source-of-truth path | [`0232`](../../tasks/backlog/0232-correct-adr-012s-stale-source-of-truth-and-code-coordinates/brief.md) | **2026-08-06** |
| 8 — assess the denial record as an ADR-036 registry site | [`0233`](../../tasks/backlog/0233-assess-the-denial-log-as-an-adr-036-registry-site/brief.md) | **2026-08-06** |

**Zero remain unfiled.** Items 1/3/4/5 were filed on a named owner ruling of 2026-08-05; items 7 and 8
on a named owner ruling of **2026-08-06**, verbatim: ***"File both now."*** ⚠️ **`0232` widened item
7's scope** — the report frames it as one coordinate; ADR-012 was measured on 2026-08-06 and carries
**five classes** of stale citation, including three claims false on their facts and a stale
self-citation. **The report's one-line framing of item 7 is an undercount.**

##### ⚠️ The *"citable ADR number"* rationale does not survive measurement

Both the board cell and the §Priority section below claim **every** implementation follow-up *"will
want to cite an ADR number rather than a report path."* Scored per item:

| Task | Declares `Depends on: 0222`? | Genuinely wants a citable ADR number? |
|---|---|---|
| `0223` | **yes** | **yes — the one genuine case**, and only for the row's *reason* clause |
| `0224` | yes | **no** — a **mechanism** (hook `deny()` + worklog line); works with no ADR on disk |
| `0225` | yes | **no** — a **test** asserting a row agrees with `skills_for_role()` |
| `0226` | **no**, declares independence | **no** — a **fact repair**; the report itself says *"Independent of this ruling"* |
| `0232` | **no** | **no** — a **fact repair** on ADR-012's coordinates |
| `0233` | **no** (depends on `0189`, `0224`) | **no** — an **ADR-036** question, not an ADR-038 one |

**`0222` is a real blocker for AT MOST ONE of the six.** ⛔ **But keep two facts apart:** three of the
four filed on 2026-08-05 (`0223`, `0224`, `0225`) **do declare `Depends on: 0222`**. The rationale is
weak **on merit**; it is **not** absent from what the briefs say. *(A handed-down claim that "four of
the five filed did not wait for it" was checked against disk on 2026-08-06 and is **wrong** — recorded
here so it is not propagated.)*

⛔ **Nothing was changed as a result.** No `Depends on:` line on `0223`/`0224`/`0225` was edited —
that is each task's decision, not a note's. **Open question for the owner: should those three keep the
declared dependency?** Relaxing two of them would unblock two runnable tasks; a producer will not do it
without a ruling.

⛔ **The rank is unchanged and that is deliberate.** The owner ruled 2026-08-06, verbatim: ***"Accept
P189; merit lives in the brief."*** `0222` stays at **P189**; no row was renumbered
(`/fkit-task-brief` step 5, ADR-035). ⛔ The report is not edited — its §8 is a dated record of what one
author recommended on 2026-08-05.

#### Priority

- **`0222` — APPEND AND MERIT DIVERGE. On merit it belongs directly above `0203`**, the
  highest-ranked open row on this board: `0203` and `0208` both amend the same sprint-loop skill this
  ADR governs, and every implementation follow-up the ruling implies will want to cite **an ADR number
  rather than a report path**. Its append rank of **P189** is the bottom of the board.
- **⚠️ P189 is APPEND rank, NOT a merit ranking — flagged for owner confirmation.**
- **Filed by a spawned producer with no owner channel, which never re-ranks** (ADR-035,
  `/fkit-task-brief` step 5). **No existing row was re-ranked, renumbered or inserted past, and no
  `✅ Done` / `⛔ Cancelled` / `➡️ Moved` row was touched.**
