# Repair the task-brief links outside the wiki after the folder migration

**Source**: `ai-agents/tasks/done/0079-repair-task-links-outside-the-wiki-after-migration/brief.md`
**Status**: done — ⚠️ **`(agent-closed — not owner-verified)`**
**Sprint/Tag**: Sprint 2 · ID **0079** · priority 77 · owner fkit-coder

## Goal
Re-point the **documentation** references to task briefs that [[tasks/migrate-tasks-to-folder-structure-and-update-tooling]] deliberately left behind. Task 76 repaired only the **executable** references — the sprint-board hrefs `dashboard.sh` and the movers actually follow. This task clears the ~110+ links to `tasks/<board>/<slug>.md` paths that **nothing executes**, across `ai-agents/knowledge-base/` and all of `ai-agents/tasks/` (brief↔brief cross-links, and the links inside the now-absorbed plans, worklogs and review ledgers).

**Separating this from task 76 is what makes task 76 reviewable** — the structural change is judged on whether the tools work, not buried under a hundred mechanical href edits.

## Key Changes
- **The sweep areas changed with the widened absorption:** `ai-agents/reviews/`, `plans/`, `worklogs/` no longer exist, so the sweep covers `knowledge-base/` and **all of `tasks/`** — not three separate top-level directories.
- **⚠️ It repairs pre-existing rot, not only migration-induced rot** (owner ruling). A large share of task-brief links outside `sprints/` and `tasks/` were **already broken before the migration**, rotted by past closes, because the movers' reference sweep never covered `knowledge-base/`. An indicative (unaudited) measurement found **~16 of 47 already broken** — roughly a third. The related defect is fixed by [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]], which stops *new* rot; this task clears the accumulated rot.
- **The two sprint-keyed ledgers are a special case:** `sprint2-shared-instructions-delivery` and `sprint2-scaffold-launcher-hardening` relocated to `ai-agents/sprints/reviews/` (ADR-029 §5.2b), *not* into a task folder — so both the links they contain **and their own paths** changed.
- **Hard scope boundary: `ai-agents/wiki-vault/` is out of scope** — that is task 99's (this sync's) work, and only the `fkit-wiki` role may write there.

## Outcome
Done, agent-closed. **The wiki is the last mile:** task 76 fixed the executable paths, task 77 the knowledge-base and in-tree documentation paths, and **this sync (task 99) fixes the ~104 vault references** — the single largest concentration, and the one only `fkit-wiki` may touch.

⚠️ **Agent-closed and not owner-verified.** The repair's own worklog flagged that the moved `sprints/reviews/*.md` ledgers still carried broken flat `../tasks/<board>/<slug>.md` links at task-76 time — this task's baseline captured them; confirm the clear-out held.

## Related
- [[tasks/migrate-tasks-to-folder-structure-and-update-tooling]] — task 76, whose paths this repairs; ran in parallel
- [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]] — the mover defect that *caused* the pre-existing rot this clears
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — the migration; §5.2b, the sprint-keyed-ledger special case
- [[tasks/harden-task-movers-against-closed-sprint-link-rot]] · [[tasks/repair-broken-links-in-closed-sprint-plans]] — the same link-rot class, one sprint earlier
- [[systems/fkit]] · [[systems/knowledge-base-structure]] · [[tasks/sprint-2-remove-omnigent]]
