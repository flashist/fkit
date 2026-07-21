# Design the task-folder structure and the global task-ID scheme

**Source**: `ai-agents/tasks/done/0030-design-task-folder-structure-and-id-scheme/brief.md`
**Status**: done — ⚠️ **`(agent-closed — not owner-verified)`**
**Sprint/Tag**: Sprint 2 · ID **0030** · priority 74 · owner fkit-architect · design-first

## Goal
Design a per-task **folder** keyed by a **permanent global ID**, executing the end state [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] §6 had already recorded as the intended direction.

Two problems, deliberately solved together:
- **No cohesion.** One task's artifacts live in four homes — `tasks/<board>/<slug>.md`, `plans/<slug>.md`, `worklogs/<slug>.md`, `reviews/<slug>.md` — joined by a **slug that can change**. Rename it and the artifacts orphan silently.
- **No identity.** The numbers used on boards and in conversation are **sprint-scoped priority and collide**: Sprint 1 and Sprint 2 each have a task 46. Nothing could name a task unambiguously across sprints.

## Key Changes
**The brief expected a naming exercise. The design found three mechanisms that break *without erroring*, and one that destroys data** — the finding that justifies the whole design-first shape:

1. **`dashboard.sh:535` derives a task's board from its parent directory.** Under folders the parent is the task folder, so the location cross-check can never succeed again — **every row on every board reports false drift**, which also defeats the open-work filter. **The script still exits 0.**
2. **Link-rot recovery keys on the brief's filename.** Under folders every brief is `brief.md`, so the recovery loop never matches — silently disabling two sprint tasks' worth of repair machinery.
3. **The review-ledger key is "the task file's basename".** Under folders that is `brief` for **every task in the project**, so every ledger collapses onto one file and overwrites the others. **Both agents derive it identically, so they agree perfectly on the wrong file. This is data loss** — and the reason the brief-filename decision could not be made in isolation.

**The brief's own stated facts were stale**, and the design said so: 95 briefs not 89, 21 tooling files not 13, and **task 64 — which the brief instructed the design to sequence against — was already Done**.

**An adversarial (Codex) pass ran and produced 18 findings, all evaluated and incorporated.** It forced revision 2's three substantive changes: the ID backfill **pinned to a commit SHA**, the ledger key resolving to a **folder** rather than a string, and a **bounded rollback window**.

## Outcome
**Approved on revision 2 → [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]]** — both acceptance gates clear at approval (the adversarial pass had run; the ADR-015 collision was resolved by deferral).

Notable rulings the design carried:
- **No registry file.** The architect raised a finding against the brief's own *"ID plus a registry"* instruction rather than substituting silently, and **the owner ruled to drop it** — a third carrier that can drift, which this project has paid for at least three times. It shrank task 75 to *"add a field and write down the procedure"*, creating no file at all.
- **The cross-branch ID race is accepted, not eliminated** — mitigated by detection (a duplicate-ID assertion), now filed as task 85.
- **Consuming projects are deliberately not migrated.** The owner first ruled to solve it inside the migration; on the finding that this would reopen [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]], the ruling **changed to deferral**. **ADR-015 is therefore not reopened.**

⚠️ **The cost is the largest single structural change in the project's history** — 94 folders, 138 file moves, ~309 link rewrites, ~21 tooling files and 4 test files changing atomically. **The rollback story depends on the owner performing a commit and tag the agent cannot do.**

## Related
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — the ruling this task produced
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — §6 recorded this as the intended end state; this design executes it
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the collision resolved by deferral, **not** by reopening
- [[decisions/adr-014-how-fkit-tests-itself]] — the suite the duplicate-ID guard must fit
- [[tasks/assign-global-task-ids-and-create-registry]] — task 75, the ID backfill this design gated
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]] — `dashboard.sh`, the tool three of the silent breaks live in
- [[tasks/implement-spawned-invocation-for-task-movers]] — task 64, which the brief wrongly told this design to sequence against
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]] · [[systems/review-and-model-diversity]]
- [[tasks/migrate-tasks-to-folder-structure-and-update-tooling]] — task 76, the folder migration
