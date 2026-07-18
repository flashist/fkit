# Plan — Add a Backlog board, the default home for unsprinted task briefs

**Task:** [`add-backlog-board-default-for-unsprinted-task-briefs.md`](../tasks/done/add-backlog-board-default-for-unsprinted-task-briefs.md)
· **Sprint 2, priority 67** · **Approved by the owner: 2026-07-18**

The durable autonomy boundary for this ship-loop run.

## The change

1. **`ai-agents/sprints/backlog.md`** — a persistent board using the **identical** four-column status
   table (`Status | Priority | Task | Brief`), so `dashboard.sh` and both movers parse it with no
   special-casing. Priority cells read `—` (unranked by design). Backfill one row per unsprinted brief,
   **re-deriving the list at build time**.
2. **`claude/skills/fkit-task-brief/SKILL.md`** — rewrite the no-sprint path: file with
   `## Sprint: Backlog`, add a row to `backlog.md` (create-if-absent), keep
   `## Priority: Unscheduled`. State the designed exception to "never invent a sprint" explicitly, and
   the producer-owned Moved-on-pull convention.
3. **Mover compatibility** — verify by dry-read that `/fkit-task-done`'s recursive sweep reaches
   `backlog.md`. Evidence, not assumption.

## Owner rulings taken during the run (both approved 2026-07-18)

- **The `sprint-backlog.md` phantom — fix all 5 references.** Scope extension beyond the three files
  above, approved after escalation: both task movers plus `ai-agents/README.md` in **both** homes
  referenced a `sprint-backlog.md` that never existed and whose name would match the `sprint-*.md`
  glob this task depends on avoiding.
- **Do not ship a scaffold board template.** An empty board makes `dashboard.sh` exit 1, so a fresh
  project's first `/fkit-status Backlog` would show a false "malformed plan" flag. Rely on the skill's
  create-if-absent path (a sanctioned alternative in the brief), so the board only ever exists with
  rows in it.

## Verification

- `backlog.md` has exactly one row per unsprinted brief; no sprint-assigned brief has a row.
- `bash dashboard.sh ai-agents/sprints/backlog.md` exits 0 and renders all rows.
- `ls ai-agents/sprints/sprint-*.md` still resolves only the real sprints — `backlog.md` is outside the
  glob, so the default `/fkit-status` run is unaffected **by construction**.
- Both movers' sweep globs match `backlog.md` (dry-read evidence).
- No residual `sprint-backlog.md` reference outside the deliberate warnings.
- `npm test` green.

## Scope boundary

No product code beyond skill sources and the two READMEs. No launcher change, no `skills-for-role.sh`
change, no wiki write, no task-file move.
