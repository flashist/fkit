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
