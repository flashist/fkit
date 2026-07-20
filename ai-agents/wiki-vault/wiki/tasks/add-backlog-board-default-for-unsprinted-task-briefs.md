# Add a Backlog board — the default home for unsprinted task briefs

**Source**: `ai-agents/tasks/done/add-backlog-board-default-for-unsprinted-task-briefs.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 67

## Goal
Give unsprinted work a **real board**. Before this, a brief written with no sprint named carried a board-less `## Sprint: Backlog (unsprinted)` field and had **no row anywhere** — it was invisible to every board-driven view. Five such briefs existed.

## Key Changes
- **`ai-agents/sprints/backlog.md`** — a persistent board using the same status-table format as the sprint plans (Status | Priority | Task | Brief), so `dashboard.sh` and the task movers parse it unchanged. **Five existing unsprinted briefs backfilled** as rows.
- **`claude/skills/fkit-task-brief/SKILL.md`** — the no-sprint path rewritten: file the brief with `## Sprint: Backlog`, add a row to `backlog.md` (create-if-absent), keep `## Priority: Unscheduled`.
- **The filename is load-bearing and deliberately outside the glob.** `/fkit-status` resolves the active sprint by globbing `sprint-*.md`; `backlog.md` does not match, and **that is the whole mechanism** by which the default status run ignores the backlog. The board file says so in a standing warning: *"Do not 'normalize' this name."* Naming it `sprint-backlog.md` would make every `/fkit-status` call report unscheduled work as the active sprint.
- **A designed exception to "never invent a sprint."** The task-brief skill's own rule gets an explicit, documented carve-out for the backlog board — stated in the skill text so it reads as design, not drift.
- **The board is unranked by design** — the Priority column reads `—`. A number here would be a commitment nobody made; needing a rank is the signal to pull the task into a sprint.

## Outcome
Done. Unsprinted work is now visible on a board for the first time. The **pull-into-a-sprint path is three mandatory edits**: add the row to the sprint plan, flip the backlog row to `➡️ Moved to [Sprint N] — priority M`, **and update the brief's own `## Sprint`**. The row is **not deleted** — a deleted row loses the pointer to where the work went. ⚠️ **Skipping the brief-side update leaves a permanent drifted row**: the drift rule compares the `Moved` target against the brief's `## Sprint`, and a drifted row always renders.

Mover compatibility was **verified, not assumed** — the movers already sweep `ai-agents/sprints/` recursively (task 22 lineage), so they find and flip `backlog.md` rows unchanged. A backlog task can therefore be completed or cancelled without ever joining a sprint.

⚠️ **Known drift, reported not repaired** (recorded on the board itself): `gate-read-side-symlink-hazard-in-init.md` has **no `## Status` section**, so `dashboard.sh` reports `brief-missing-status` against its row. The board is correct; the brief is incomplete. Fixing a brief's own fields is the producer's call.

The read-side half — making `/fkit-status` report this board **only on request** — is [[tasks/report-backlog-board-in-fkit-status-on-request-only]] (task 68).

## Related
- [[tasks/report-backlog-board-in-fkit-status-on-request-only]] — task 68, the status read-side; depends on this board's format
- [[tasks/filter-fkit-status-board-to-open-tasks]] — task 65; its open-work filter applies to the backlog board too, with no special-casing
- [[tasks/rename-task-plan-skill-to-task-brief]] — the skill this task edits, under its current name
- [[tasks/add-task-plan-skill-to-producer]] — the skill's origin
- [[tasks/harden-task-movers-against-closed-sprint-link-rot]] — task 22, the recursive `sprints/` sweep this board relies on
- [[tasks/record-one-skill-one-output-convention]] — the convention task 68's argument had to conform to
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
- [[systems/knowledge-base-structure]]
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]]
- [[tasks/decide-whether-fkit-needs-a-tester-agent]] — a Backlog-board task whose ruling produced ADR-028; **its close does not move Sprint 2's count**
