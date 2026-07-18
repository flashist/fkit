# Add a Backlog board and make it the default home for unsprinted task briefs

## Sprint
Sprint 2

## Priority
67

## Status
✅ Done

## Context

**The owner's ask (2026-07-18):** when `/fkit-task-brief` is invoked with **no sprint named**, the
brief should land on a **real Backlog board** — a persistent `ai-agents/sprints/backlog.md` plan with
its own status table — instead of today's board-less `## Sprint: Backlog (unsprinted)` field, which
puts unsprinted work on **no board at all**. (Companion ruling: `/fkit-status` must **not** report the
Backlog board unless asked for it specifically — that read-side is **task 68**.)

**Today's gap:** five unsprinted briefs exist in `ai-agents/tasks/backlog/` with no board row anywhere
(`decide-whether-fkit-needs-a-tester-agent`, `gate-read-side-symlink-hazard-in-init`,
`gate-symlink-escape-in-init-intake-write`, `extend-prove-red-to-reach-init`,
`add-worked-example-to-evidence-before-assertion` — **re-derive the list at build time**). Unsprinted
work is invisible to every board-driven view.

**Interactions to respect — flagged, not to be planned around silently:**

- **The skill's own rule "never invent a sprint that doesn't exist"** gets a designed exception: the
  Backlog board is created-if-absent by the skill (or shipped). State the exception in the skill text
  explicitly so it reads as design, not drift.
- **The movers** (`/fkit-task-done` / `/fkit-task-cancelled`) already grep `ai-agents/sprints/`
  recursively for inbound rows (task 22 lineage) — they should pick up `backlog.md` rows unchanged.
  **Verify, don't assume** (evidence-before-assertion).
- **Pull-into-a-sprint path:** when a backlog task is later pulled into a sprint, the backlog row
  becomes `➡️ Moved` (the sprint-1 precedent) — the skill text must say who does this (the producer,
  at pull time).
- **`/fkit-status` active-sprint detection globs `sprint-*.md`** — `backlog.md` deliberately does not
  match, so the default status run ignores it by construction. **Keep the filename `backlog.md`** (or
  equivalent non-matching name); do not name it `sprint-backlog.md`.
- **Scaffold parity:** if `claude/scaffold/` ships an `ai-agents/sprints/` tree, ship the Backlog
  board template there too (create-if-absent convergence carries it to existing projects). If it
  doesn't, the skill's create-if-absent path covers it — record which applies.

## What to build

- **`ai-agents/sprints/backlog.md`** — a persistent board: same status-table format as the sprint
  plans (Status | Priority | Task | Brief) so `dashboard.sh` and the movers parse it unchanged;
  Priority column reads `—` (unscheduled — the backlog is unranked by design; note this in the board
  header). **Backfill one row per existing unsprinted brief.**
- **`claude/skills/fkit-task-brief/SKILL.md`** (canonical source; `.claude/` copy is gitignored):
  rewrite the no-sprint path — file the brief with `## Sprint: Backlog`, add a row to
  `ai-agents/sprints/backlog.md` (create-if-absent), keep `## Priority: Unscheduled`. Document the
  designed exception to "never invent a sprint", and the Moved-on-pull convention.
- **Mover compatibility check:** demonstrate `/fkit-task-done`'s sweep finds and flips a `backlog.md`
  row (dry-read of the skill steps against the new file is acceptable evidence; a live run is not
  required — the movers are owner-invoked).

## Verification steps

- `ai-agents/sprints/backlog.md` exists, one row per unsprinted brief in `ai-agents/tasks/backlog/`
  (cross-check: every brief whose `## Sprint` is Backlog/unsprinted has a row; no sprint-assigned
  brief does).
- A fresh `/fkit-task-brief` run with no sprint named produces a brief with `## Sprint: Backlog` **and**
  a matching `backlog.md` row; a run naming Sprint 2 touches `backlog.md` not at all.
- `/fkit-status` (no argument) resolves the active sprint exactly as before — `backlog.md` is not
  picked up (filename does not match `sprint-*.md`).
- The mover-compatibility check above is recorded in the task's closing notes.

## Notes

- **Owner: fkit-coder** — skill-text + board file; no product code beyond the skill sources.
- **Depends on: nothing. Blocks: task 68** (status read-side needs the board format) **and task 69**
  (wiki sync).
- **Numbered 67 per append-don't-renumber.** Owner to confirm the ranking.
