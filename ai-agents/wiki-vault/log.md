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
