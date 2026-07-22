# Migrate every task into a folder, absorb the artifact directories, update the tooling

**Source**: `ai-agents/tasks/done/0062-migrate-tasks-to-folder-structure-and-update-tooling/brief.md`
**Status**: done — ⚠️ **`(agent-closed — not owner-verified)`**
**Sprint/Tag**: Sprint 2 · ID **0062** · priority 76 · owner fkit-coder

## Goal
Execute [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]]: turn every task from a single `tasks/<board>/<slug>.md` file into a folder `tasks/<board>/<NNNN>-<slug>/` holding `brief.md` and its artifacts, and teach every fkit tool the new shape. **The largest single structural change in the project's history, and the point of no return.**

**Atomic by necessity.** Every product-source tool locates a brief by a path of the form `tasks/<board>/<slug>.md`. The moment the files move, `dashboard.sh` stops finding briefs, both movers stop finding rows, and `/fkit-status` reports drift on everything. **Moving the files and teaching the tools cannot ship separately** — so they are one task.

## Key Changes
- **~186-file change surface:** ~160 `git mv` renames + `dashboard.sh` + `test/dashboard-contract.test.js` (+3 new drift tests) + both movers + both stateful-review skills + `fkit-reviewer.md` + four READMEs + `task-brief` / `wiki-ingest` / `wiki-sync` / `ship-loop` / `task-done` / `task-cancelled` skills + the sprint-board hrefs.
- **The sprint-board hrefs are repaired here, not in task 77** — `dashboard.sh` reads the Brief-column href to locate each brief, so leaving them stale breaks the board. The **~110 documentation references nothing executes** are task 77's, genuinely separable.
- **Three top-level directories absorbed, not one** (owner ruling, ADR-029 §7): `ai-agents/reviews/`, `plans/` and `worklogs/` all fold into the task folder as `review.md`, `plan.md`, `worklog.md`. Absorbing only `reviews/` would leave two dirs slug-keyed while briefs are ID-keyed. **The two sprint-keyed ledgers had no task folder to fold into and moved to `ai-agents/sprints/reviews/`.**
- **`id-mismatch` completing its own design, not extra scope:** ADR-029 Decision 5 gives the ID two carriers — folder name (authoritative) and `## ID`. This task creates the second carrier, so it must also ship the reconciliation, or it *installs a drift it cannot detect*. Both the drift kind and its red-proved contract test were built.
- **The scaffold is UNCHANGED** — `claude/scaffold/ai-agents/tasks/{backlog,done,cancelled}/.gitkeep` stay; a fresh project starts with no tasks, so ADR-027 dual-home parity holds for free and `converge-contract.test.js` needs no change.

## Outcome
Done, agent-closed. **Worklog records the full verification walk**, self-checked: no flat briefs remain; **101 folders == pre-migration brief count**; the three absorbed dirs gone with **0 orphans**; dashboard reports the same roll-up with no new drift; sprint hrefs resolve; `sprints/reviews/` holds exactly the 2 sprint-keyed ledgers; scaffold board dirs and `.gitkeep`s unchanged; `converge-contract.test.js` passes unmodified; `id-mismatch` and malformed-folder both red-proved and neither fires across the real corpus.

⚠️ **Two things the owner still owns:**
- **The migration is agent-closed and not owner-verified** — for the project's largest, least-reversible change. ADR-029 §11 requires the owner to make the final commit/merge (the loop never commits) against the `pre-task-folder-migration` tag; the rollback story depends on that being in place.
- **Sequencing gate:** the task was owner-ruled to wait for task 85 (the duplicate-ID guard, ID 0101) — value entirely **pre-merge**, since this is exactly the long-lived branch ADR-029 Decision 3's accepted cross-branch race needs.

## Related
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — the decision this executes
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — §6's folder end-state; the three artifact dirs this absorbs
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — parity held for free (scaffold untouched)
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — why consuming projects are not migrated
- [[tasks/design-task-folder-structure-and-id-scheme]] · [[tasks/assign-global-task-ids-and-create-registry]] — tasks 74 and 75, the design and the ID backfill this depends on
- [[tasks/repair-task-links-outside-the-wiki-after-migration]] — task 77, the documentation-link repair that runs in parallel
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]] — `dashboard.sh`, re-taught the folder shape and given the `id-mismatch` drift kind
- [[systems/fkit]] · [[systems/testing-and-verification]] · [[tasks/sprint-2-remove-omnigent]]
- [[tasks/assert-task-ids-are-unique-in-the-test-suite]] — task 85, the duplicate-ID guard
- [[tasks/wiki-sync-backlog-board-introduction]] — a batched wiki-sync task (discharged by the migration sync)
- [[tasks/wiki-sync-dumb-down-skill]] — a batched wiki-sync task (discharged by the migration sync)
- [[tasks/wiki-sync-filtered-fkit-status-board]] — a batched wiki-sync task (discharged by the migration sync)
- [[tasks/wiki-sync-fkit-status-output-variant-removal]] — a batched wiki-sync task (discharged by the migration sync)
- [[tasks/wiki-sync-open-questions-interview-skill]] — a batched wiki-sync task (discharged by the migration sync)
- [[tasks/wiki-sync-task-plan-rename]] — a batched wiki-sync task (discharged by the migration sync)
- [[tasks/wiki-sync-task-folder-migration]] — task 78, the post-migration vault re-description
