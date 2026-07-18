# Wiki Log

Append-only activity log — newest entries at the bottom. Never edit or rewrite
existing entries; only append. Each ingest / lint / sync operation adds one entry
(see `schema.md` for the format).

## 2026-07-09 — ingest
- Ingested: `ai-agents/knowledge-base/PROJECT.md` and `ai-agents/knowledge-base/architecture.md` → created [[systems/fkit]]
- Ingested: `ai-agents/knowledge-base/decisions/adr-001-package-json-stays-metadata-only.md` → created [[decisions/adr-001-package-json-stays-metadata-only]]
- Ingested: `ai-agents/knowledge-base/decisions/adr-002-archive-pre-omnigent-design-docs.md` → created [[decisions/adr-002-archive-pre-omnigent-design-docs]]
- Ingested: `ai-agents/knowledge-base/decisions/adr-003-ci-runs-validate-bundles.md` → created [[decisions/adr-003-ci-runs-validate-bundles]]

## 2026-07-09 — ingest
- Sync window: force → HEAD (cad39eb3ce3d7773cdd5d30c3f15968ac5cad155)
- Changed source files detected: 1
- Ingested: `ai-agents/sprints/plan-sprint-1.md` → created [[tasks/sprint-1-ship-the-onboarding-sequence]]
- Skipped (already covered): `ai-agents/knowledge-base/PROJECT.md`, `ai-agents/knowledge-base/architecture.md`, `ai-agents/knowledge-base/decisions/adr-001-package-json-stays-metadata-only.md`, `ai-agents/knowledge-base/decisions/adr-002-archive-pre-omnigent-design-docs.md`, `ai-agents/knowledge-base/decisions/adr-003-ci-runs-validate-bundles.md` (already ingested in prior wiki update); `ai-agents/tasks/backlog/add-ci-validate-bundles.md`, `ai-agents/tasks/backlog/document-consult-chain-envelope.md`, `ai-agents/tasks/backlog/verify-onboarding-flow-end-to-end.md` (backlog, not yet ingest-worthy)

## 2026-07-10 — ingest
- Sync window: cad39eb3ce3d7773cdd5d30c3f15968ac5cad155 → HEAD (5d39a7baa60714cd1645435cbb5662890b31b80f)
- Changed source files detected: 8
- Ingested: `ai-agents/knowledge-base/architecture.md` → updated [[systems/fkit]]
- Ingested: `ai-agents/sprints/plan-sprint-1.md` → updated [[tasks/sprint-1-ship-the-onboarding-sequence]]
- Ingested: `ai-agents/tasks/done/fix-claude-agents-md-placeholder-text.md` → created [[tasks/fix-claude-agents-md-placeholder-text]]
- Skipped (already covered): `ai-agents/tasks/backlog/bake-architecture-pointer-into-scaffold-templates.md`, `ai-agents/tasks/backlog/extend-initiate-project-fill-overview.md`, `ai-agents/tasks/backlog/fix-agent-count-doc-drift-and-fresh-detection-dup.md`, `ai-agents/tasks/backlog/fix-claude-agents-md-placeholder-text.md`, `ai-agents/tasks/backlog/remove-adversarial-reviewer-eager-spawn.md` (backlog, not yet ingest-worthy)

## 2026-07-10 — ingest
- Sync window: 5d39a7baa60714cd1645435cbb5662890b31b80f → HEAD (f7b23f45aca3f3cf563fa3149d51cb444f9e7eb9)
- Changed source files detected: 9
- Ingested: `ai-agents/sprints/plan-sprint-1.md` → updated [[tasks/sprint-1-ship-the-onboarding-sequence]]
- Ingested: `ai-agents/knowledge-base/decisions/adr-004-fixed-role-based-titles-for-consult-spawns.md` → created [[decisions/adr-004-fixed-role-based-titles-for-consult-spawns]]
- Ingested: `ai-agents/knowledge-base/incidents/2026-07-10-subagent-runners-disconnected.md` → created [[systems/subagent-runner-connectivity]]
- Ingested: `ai-agents/tasks/done/build-fkit-reconnect-tooling.md` → created [[tasks/build-fkit-reconnect-tooling]]
- Updated backlinks: [[systems/fkit]]
- Skipped (already covered): `ai-agents/tasks/backlog/build-fkit-reconnect-tooling.md` (superseded by the done brief); `ai-agents/tasks/backlog/amend-subagent-disconnect-incident-doc.md`, `ai-agents/tasks/backlog/formalize-knowledge-base-incidents-folder.md`, `ai-agents/tasks/backlog/give-every-agent-direct-wiki-query-access.md`, `ai-agents/tasks/backlog/rollout-adr-004-fixed-consult-titles.md` (backlog, not yet ingest-worthy)

## 2026-07-10 — ingest
- Ingested: `ai-agents/sprints/plan-sprint-1.md` → updated [[tasks/sprint-1-ship-the-onboarding-sequence]]

## 2026-07-13 — ingest (sync)
- Sync window: f7b23f45aca3f3cf563fa3149d51cb444f9e7eb9 → HEAD (8a3f1e518d82b942937eb1023bcac7d51aea4b39) — 44 commits
- Changed source files detected: 87; ingest-worthy after filtering: 45
- **The post-Omnigent sync** (Sprint 2 task 11). The vault described a runtime that no longer exists; this rebuilds it against the Claude Code native + Codex reality.
- Ingested: `ai-agents/knowledge-base/architecture.md`, `PROJECT.md` → rewrote [[systems/fkit]]; created [[systems/role-locked-sessions]], [[systems/install-and-self-update]], [[systems/review-and-model-diversity]], [[systems/knowledge-base-structure]]
- Ingested: `ai-agents/knowledge-base/incidents/README.md`, `reports/README.md`, `conventions/*` → folded into [[systems/knowledge-base-structure]]
- Updated: [[systems/subagent-runner-connectivity]] → marked 🕰️ HISTORICAL (its whole subject was deleted with Omnigent; kept as the record of *why fkit left*)
- Ingested: `knowledge-base/decisions/adr-005…adr-013` → created 9 decision pages
- Updated: [[decisions/adr-001-package-json-stays-metadata-only]], [[decisions/adr-003-ci-runs-validate-bundles]], [[decisions/adr-004-fixed-role-based-titles-for-consult-spawns]] → status `accepted` → `superseded`; [[decisions/adr-002-archive-pre-omnigent-design-docs]] → cross-linked to ADR-013
- Ingested: `ai-agents/sprints/sprint-2.md` → created [[tasks/sprint-2-remove-omnigent]]
- Ingested: `ai-agents/sprints/done/sprint-1.md` → updated [[tasks/sprint-1-ship-the-onboarding-sequence]] (source moved from `sprints/plan-sprint-1.md`; status → closed)
- Ingested: 20 × `ai-agents/tasks/done/*.md` → created 20 task pages
- Ingested: 5 × `ai-agents/tasks/cancelled/*.md` → created 5 task pages
- Lint (targeted): 1 broken link fixed (a literal `[[wikilinks]]` in ADR-005 prose), 77 one-way links reciprocated, 1 template drift fixed. Vault now: 0 broken, 0 one-way, 0 index gaps.
- Skipped: `ai-agents/tasks/backlog/*` (23 files — not done, a page would be premature); `ai-agents/reviews/`, `ai-agents/README.md` (not ingest-worthy kinds); the 8 pre-ADR-013 knowledge-base root paths (rename-only → `reports/`, `conventions/`)
- ⚠️ Flagged for human review: `architecture.md` §8 and §9.6 claim ADRs 003/004/006/007 are "still marked `accepted` today" — they were marked superseded by the knowledge-base hygiene task, which ran after the doc was written. The wiki records the current (superseded) status.

## 2026-07-13 — lint
- Issues found: 3
- Issues fixed: 2
- Issues flagged for human review: 1
- Scope: all 48 pages. Structural checks all clean (0 broken links, 0 one-way links, 0 index gaps, 0 orphans, 0 template drift, 0 secrets).
- **Fixed — a stale claim ingested from a stale source.** [[systems/install-and-self-update]] and [[tasks/fix-agent-count-doc-drift-and-fresh-detection-dup]] both stated that `claude/fkit-claude-init.sh` prints **"Six roles"** and that its usage comment still advertises `fkit claude`. Both were taken from `architecture.md` §9.6 and **both are false against the code**: `:144` reads `Seven roles`, and the `fkit claude` comment is gone. Rewritten to record what the code says, and to keep the durable point (the count is a hard-coded literal, not derived — so it can drift again).
- **Verified against the code** (all pass): 7 agent definitions · 21 skills · `skills_for_role()` / `build_settings()` / `CONSULT_SKILLS` present · **0 tracked `omnigent/` files** · **0 `skills:` frontmatter** (ADR-012 holds) · no `.github/` (the CI gap is real) · `EnterPlanMode` restored to the coder allowlist · `fkit --resume` passthrough still live (`fkit-claude.sh:356`) · Sprint 2 tally 18 done + 4 backlog = 22.
- ⚠️ **Flagged for human review (not a wiki defect — a source defect):** `ai-agents/knowledge-base/architecture.md` §8 and §9.6 are **behind the code on three counts** — they state ADRs 003/004/006/007 are "still marked `accepted`" (they are superseded), that init prints "Six roles" (it prints "Seven"), and that the `fkit claude` usage comment survives (it does not). The architect owns that file; the wiki now records the verified state.

## 2026-07-16 — ingest (sync)
- Sync window: 8a3f1e518d82b942937eb1023bcac7d51aea4b39 → HEAD (31f6ddac5a147b77776aa38f2330b0c61364eb0e) — 16 commits
- Changed source files detected: 50; ingest-worthy after filtering: 30
- **The post-investigation sync.** Sprint 2 grew 22 → 38 tasks; the removal finished early and everything after task 22 is work the removal *uncovered* — two investigations that both concluded "build nothing", and the defects they found on the way.
- Ingested: `knowledge-base/decisions/adr-014…adr-017` → created 4 decision pages
- Ingested: `knowledge-base/reports/2026-07-14-migration-mechanism.md`, `2026-07-14-shared-instructions-layer.md`, `2026-07-16-design-deterministic-dashboard-for-fkit-status.md` (as ADR evidence) → folded into the ADR pages and [[systems/launch-convergence-and-init]], [[systems/testing-and-verification]]
- Ingested: `knowledge-base/conventions/evidence-before-assertion.md`, `conventions/README.md`, `status-report-format.md` → updated [[systems/knowledge-base-structure]]
- Created: [[systems/testing-and-verification]] (the launcher-contract suite, ADR-014/017 scope), [[systems/launch-convergence-and-init]] (init's two seams, the invariant, the `[ -L ]` lesson)
- Ingested: 17 × `ai-agents/tasks/done/*.md` → created 17 task pages
- Ingested: 1 × `ai-agents/tasks/cancelled/add-e2e-smoke-script-for-fkit-itself.md` → created 1 task page
- Ingested: `ai-agents/sprints/sprint-2.md` → rewrote [[tasks/sprint-2-remove-omnigent]] (22 → 38 tasks; 33 done / 5 backlog; all seven open questions now ruled)
- Ingested: `ai-agents/knowledge-base/architecture.md` (delta: §9.4 `--resume` removed; §9.5/§9.6 renumbered)
- Updated: [[systems/fkit]], [[systems/install-and-self-update]], [[systems/knowledge-base-structure]] — stale claims corrected (below)
- Updated backlinks: 21 pages
- Lint (targeted, then vault-wide): 0 broken links, 0 one-way links (35 reciprocated), 0 index gaps, 0 template drift, 0 secrets. Vault now 72 pages: 0 features · 8 systems · 17 decisions · 47 tasks.
- Skipped: `ai-agents/tasks/backlog/*` (16 files — not done, a page would be premature); `ai-agents/reviews/*` (3 files — not an ingest-worthy kind); `ai-agents/sprints/done/sprint-1.md` (href-only repair, no synthesized change)

### Stale claims corrected against the code (verified this run, not inferred)
- **[[systems/fkit]] and [[systems/install-and-self-update]] both described `fkit --resume` as a LIVE bug.** It was removed on 2026-07-13 and the removal is pinned by a test. Rewritten to record the fix and keep the durable lesson.
- **[[systems/fkit]] "zero automated verification — the top structural risk"** — now false as written. `claude/fkit-claude.sh` is covered (`npm test` → `node --test`); **`install.sh` genuinely still has none, and there is no `.github/`.** Rewritten as *reduced, not closed*.
- **[[systems/fkit]] open questions 2 and 3** marked answered (ADR-014; owner ruled removal). Added open question 4 — the `.fkit/` cleanup consent model, which blocks task 36.
- Re-verified and still true: the agent-count literal reads "Seven" and is correct; the `fkit claude` usage comment is gone.

### ⚠️ Flagged for human review — source defects, not wiki defects
1. **`architecture.md` is behind the code on four counts** (three of them carried over from the 2026-07-13 lint, still unfixed): §8/§9.5 claim **ADRs 003/004/006/007 are "still marked `accepted` today"** — all four are **superseded** (verified); §9.5 claims init **prints "Six roles"** — the code prints **"Seven"**; §9.5 claims the **`fkit claude` usage comment survives** — it does not; and **NEW: §9.1 states fkit has "zero automated verification" and that both high-blast-radius files are "POSIX shell with no coverage of any kind"** — `claude/fkit-claude.sh` now has a test suite. The architect owns that file. The wiki records the verified state.
2. **ADR-014 still presents the test runner as an OPEN question**, though `node --test` is shipped and wired to `npm test` (`test/launcher-contract.test.js`). The ADR's own consequence section predicted the brief would go stale against it; the reverse happened. Not amended.
3. **Five briefs in `done/` still carry `## Status: 🔲 Backlog` internally** — tasks 23, 24, 30, 31, 32, 33, 38, plus the two unsprinted ones. This is exactly the mover drift Sprint 2 tasks **34/35** exist to stop. The wiki records the **sprint board's** status (Done) and notes the drift on each affected page.
4. **[[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]] closed without the wiki being able to establish WHICH option (a or b) was chosen** — the decision is in the task's close-out, not the brief. Flagged rather than guessed.

## 2026-07-16 — lint
- Issues found: 3
- Issues fixed: 3
- Issues flagged for human review: 1 (carried forward, unresolved)
- Scope: all 72 pages. Structural checks all clean (0 broken links, 0 one-way links, 0 index gaps, 0 orphans, 0 template drift, 0 missing required fields, 0 secrets).
- **Fixed — a real stale-claim contradiction, not a false positive.** [[tasks/repair-broken-links-in-closed-sprint-plans]] (Status: done, per `ai-agents/tasks/done/…`) was contradicted by two sibling pages still asserting the repair "remains open" and pointing at a `tasks/backlog/…` path that no longer exists: [[tasks/harden-task-movers-against-closed-sprint-link-rot]] and [[tasks/sprint-1-ship-the-onboarding-sequence]]. Verified against `ai-agents/sprints/sprint-2.md` (task 21 ✅ Done) and `ai-agents/sprints/done/sprint-1.md` (all rows now link `tasks/done/…`, zero remaining `tasks/backlog/…` broken links). Both pages rewritten to record the fix.
- **Fixed — a stale path plus a stale "no CI and no test suite" claim.** [[tasks/add-ci-validate-bundles]] pointed at `ai-agents/tasks/backlog/add-e2e-smoke-script-for-fkit-itself.md` (that task moved to `cancelled/` on 2026-07-14) and still claimed fkit has "no CI and no test suite of any kind" — contradicted by [[systems/testing-and-verification]] and [[systems/fkit]], both already updated in the 2026-07-16 sync to record the launcher-contract suite. Rewritten to match the verified current state (`install.sh` still uncovered; `claude/fkit-claude.sh` is not); added 3 missing cross-links + reciprocal back-links ([[tasks/add-e2e-smoke-script-for-fkit-itself]], [[tasks/add-launcher-contract-smoke-script]], [[decisions/adr-014-how-fkit-tests-itself]]).
- ⚠️ **Flagged for human review (carried forward, unresolved) — source defect, not a wiki defect:** `ai-agents/knowledge-base/architecture.md` is still behind the code on the four counts named in the 2026-07-16 sync entry above (ADRs 003/004/006/007 shown `accepted` rather than `superseded`; "Six roles" rather than "Seven"; the `fkit claude` usage comment shown as surviving; "zero automated verification" rather than partial coverage). Re-verified this run, unchanged. The architect owns that file.
- Not re-flagged (already correctly recorded on every affected page, verified consistent): the 6-brief `## Status: 🔲 Backlog` mover-drift note.

## 2026-07-17 — ingest (sync)
- Sync window: 31f6ddac5a147b77776aa38f2330b0c61364eb0e → HEAD (8dcafd4e3b978032bfa6d844aa6394b3465b4bba) — 12 commits (incl. one prior sync + lint)
- Changed source files detected: 47; ingest-worthy after filtering: 27 (3 new ADRs + 2 modified ADRs + 1 modified conventions README + sprint-2 + 15 done briefs + 1 new convention + 1 report as ADR evidence). Skipped: `ai-agents/tasks/backlog/*` (16 — not done), `ai-agents/reviews/*` (5 — not an ingest-worthy kind), `ai-agents/README.md`.
- **Post-investigation-and-improvements sync.** Sprint 2 grew 38 → 53; the removal was long done and this batch is the work it uncovered — the consult-path skill-gate hook, the deterministic dashboard, the coder's autonomous ship-loop (designed), and the mover-drift and one-skill-one-output fixes.
- Ingested: `knowledge-base/decisions/adr-018…adr-020` → created [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]], [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]], [[decisions/adr-020-per-task-plan-and-worklog-artifacts]]
- Ingested: `knowledge-base/reports/2026-07-17-design-task-ship-loop-skill.md` (as ADR-019/020 evidence) → folded into the design task page and the two ADRs
- Ingested: `knowledge-base/conventions/one-skill-one-output.md` + `conventions/README.md` → updated [[systems/knowledge-base-structure]]; recorded via [[tasks/record-one-skill-one-output-convention]]
- Ingested: 8 × newly-done briefs → created [[tasks/build-deterministic-dashboard-script-for-fkit-status]], [[tasks/converge-ai-agents-additively-on-launch]], [[tasks/implement-pretooluse-skill-ownership-hook]], [[tasks/record-one-skill-one-output-convention]], [[tasks/record-pretooluse-skill-gate-adr-amendment]], [[tasks/task-done-flips-brief-own-status-header]], [[tasks/task-cancelled-flips-brief-own-status-header]], [[tasks/design-task-ship-loop-skill]]
- Updated (ADR supersession): [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — **Decisions 3 & 4 marked superseded by ADR-018** (the `CONSULT_SKILLS` list retired; consult-path enforcement now structural). [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]] — linked to its now-done implementation.
- Updated (systems): [[systems/role-locked-sessions]] — rewrote the lock-scope section for the two eras (`skillOverrides` session-scoped → the `PreToolUse` hook, structural at any depth); [[systems/fkit]] — data model gains `plans/` + `worklogs/` (ADR-020), open questions 1 & 4 marked answered, skill source-of-truth moved to `skills-for-role.sh`; [[systems/knowledge-base-structure]] — fourth convention added; [[systems/review-and-model-diversity]] — back-links.
- Rewrote: [[tasks/sprint-2-remove-omnigent]] (38 → 53 tasks; **42 done / 11 backlog**; task 28 "the migration" now Done; five new work-clusters recorded)
- **Resolved 8 stale drift-notes:** the internal `## Status: 🔲 Backlog` headers on the previously-flagged done briefs were backfilled to `✅ Done` (tasks 23, 24, 30, 31, 32, 33, 38, 40) — the corresponding wiki pages had their mover-drift ⚠️ notes removed. [[tasks/design-deterministic-dashboard-for-fkit-status]] also corrected: its "implementation still backlog" claim is now Done, and its Sprint/Tag set to Sprint 2 priority 40.
- Lint (targeted, then vault-wide): 0 broken links, 0 one-way links (35 reciprocal back-links added across 18 pages), 0 index gaps, 0 missing required fields, 0 template drift, 0 secrets. Vault now **83 pages: 0 features · 8 systems · 20 decisions · 55 tasks.**
- ⚠️ **Flagged for human review:**
  1. **Uncommitted working-tree source, ingested from the working tree, not from a committed source.** Task 52 (`design-task-ship-loop-skill`) is `✅ Done` and its brief has been moved `backlog/ → done/`, and `sprints/sprint-2.md` carries the matching flip — **both uncommitted at HEAD (`8dcafd4`)**. The watermark is HEAD, so a future sync will re-detect and re-confirm these once committed. The [[tasks/design-task-ship-loop-skill]] page carries the same caveat.
  2. **`architecture.md` still behind the code** on the four counts carried from the 2026-07-13 and 2026-07-16 entries (ADRs 003/004/006/007 shown `accepted`; "Six roles"; the `fkit claude` usage comment; "zero automated verification"). Not re-verified this run — no architecture.md change in the window — but presumed unchanged; the architect owns that file. **Additionally, `architecture.md` predates the `plans/`+`worklogs/` data-model addition (ADR-020) and the `PreToolUse` hook / `skills-for-role.sh` extraction** — the wiki now records those; the survey does not yet.
  3. **ADR-018 accepted a real regression** (owner-approved, fail-closed): a non-fkit subagent (`general-purpose`, `codex:rescue`, …) spawned from any fkit session is now denied **every** `fkit-*` skill, `fkit-query` included — so such a helper can no longer read the wiki via `/fkit-query`. Recorded on [[systems/role-locked-sessions]] and the ADR; noted here because it narrows the "reads are decentralized" story for non-fkit helpers.

## 2026-07-18 — ingest (sync)
- Sync window: 8dcafd4e3b978032bfa6d844aa6394b3465b4bba → HEAD (6b10d151d5c84babde64f7bf12c6426bcb57a943) — 9 commits
- Changed source files detected: 39; ingest-worthy after filtering: 15 (2 new ADRs + sprint-2 + 9 done briefs + `architecture.md` + 3 conventions files as rename evidence; 1 report as ADR-021 evidence). Skipped: `ai-agents/tasks/backlog/*` (10 — not done), `ai-agents/reviews/*` (5), `ai-agents/plans/*` (3) and `ai-agents/worklogs/*` (3) — ADR-020 artifacts, by decision not wiki-ingested.
- **The tool-posture-reversal batch.** Sprint 2 grew 53 → 62 (now **50 done / 12 backlog**): the `AskUserQuestion` seam measured and settled (ADR-021), the tool allowlists relaxed for six roles (ADR-022 — the adversarial reviewer's wall is now the sole structural tool restriction), the ship-loop implemented, the `task-plan` → `task-brief` rename, the `/fkit-status` one-output reversion applied and shipped in the scaffold, and the `.fkit/` orphan cleanup (announce-only) done.
- Ingested: `knowledge-base/decisions/adr-021…adr-022` → created [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]], [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]
- Ingested: `knowledge-base/reports/2026-07-17-askuserquestion-availability-for-agents.md` (as ADR-021 evidence) → folded into the ADR and task pages
- Ingested: 8 × newly-done briefs → created [[tasks/investigate-askuserquestion-availability-for-agents]], [[tasks/grant-askuserquestion-tool-to-six-claude-agents]], [[tasks/relax-tool-allowlists-except-adversarial-reviewer]], [[tasks/implement-task-ship-loop-skill]], [[tasks/remove-fkit-omnigent-orphan-residue]], [[tasks/remove-output-variants-from-fkit-status]], [[tasks/rename-task-plan-skill-to-task-brief]], [[tasks/ship-one-skill-one-output-convention-in-scaffold]]
- Ingested: `tasks/done/design-task-ship-loop-skill.md` (now committed) → updated [[tasks/design-task-ship-loop-skill]] — **the 2026-07-17 uncommitted-working-tree flag is resolved** (brief move + board flip re-confirmed at HEAD)
- Ingested: `sprints/sprint-2.md` → rewrote [[tasks/sprint-2-remove-omnigent]] (53 → 62; 50/62 done; four new work-clusters recorded)
- Updated (systems): [[systems/fkit]] — tool posture reversed per ADR-022, skill table renamed `task-brief` + `task-ship-loop` added (22 skills), ship-loop live, OQ4 cleanup Done; [[systems/role-locked-sessions]] — "the tool half of the lock — relaxed" section added, lead's `Agent(...)` list gone, summary reworded; [[systems/review-and-model-diversity]] — the adversarial wall recorded as the sole surviving structural tool restriction.
- Updated (rename, task-51 territory): living pages now carry `fkit-task-brief` ([[systems/fkit]], [[tasks/add-task-plan-skill-to-producer]], [[tasks/design-deterministic-dashboard-for-fkit-status]] inline note); historical pages keep the old name, per mark-don't-delete.
- Updated (revert record): [[tasks/add-full-board-switch-to-fkit-status]] — outcome now records the deliberate task-44 revert; [[tasks/record-one-skill-one-output-convention]] — tasks 44/48 now Done.
- Lint (targeted, then vault-wide): 0 broken links, 0 one-way links (23 reciprocal back-links added across 21 pages), 0 index gaps, 0 template drift, 0 secrets. Vault now **93 pages: 0 features · 8 systems · 22 decisions · 63 tasks.**
- ⚠️ Flagged for human review:
  1. **`architecture.md` was updated in this window (AskUserQuestion grant + rename) but is already stale again**: its per-role `tools:` table and "strongest boundary" language describe the pre-ADR-022 posture superseded the same day by task 57. Task 58 (architect-owned doc refresh) is backlog and covers exactly this. The four older staleness counts flagged 2026-07-13/16 were partially addressed; not re-audited line-by-line this run.
  2. **Pre-filed wiki-sync tasks 45 and 51 are still on the sprint board as backlog**, but their substance is covered by this sync (the `full` reversal and the rename are now recorded in the vault). The wiki role does not move task files — the owner may want to close them via `/fkit-task-done` or fold them into this sync's record.
  3. **ADR-020 `plans/` + `worklogs/` artifacts appeared under `ai-agents/` for the first time** (3 + 3 files). Treated as not ingest-worthy per ADR-020's own "not wiki-ingested" ruling — noted so the exclusion is a decision on record, not an oversight.
