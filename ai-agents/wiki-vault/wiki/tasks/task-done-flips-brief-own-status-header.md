# Make `/fkit-task-done` flip the moved brief's own `## Status` header

**Source**: `ai-agents/tasks/done/task-done-flips-brief-own-status-header.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 34

## Goal
Close standing **board-vs-brief drift** produced on every completion. `/fkit-task-done` flipped the sprint-plan Status cell and moved the brief, but **never touched the moved brief file's own `## Status` field** — so a brief in `done/` still read `🔲 Backlog` internally while the board of record read `✅ Done`.

The cost was real: a `/fkit-status` run finds the two sources disagreeing and stamps `waiting on owner` on a genuinely-finished task — handing the owner a phantom decision. Sibling to [[tasks/harden-task-movers-against-closed-sprint-link-rot]] (task 22): the same class — a mover updating one record of a task's state and silently leaving another stale.

## Key Changes
- Extended `/fkit-task-done`'s step 5 so that **after moving the brief into `done/`, it also sets the moved brief's own `## Status` to `✅ Done`** — the same canonical marker, no variant wording.
- **Idempotent** — re-running on a brief already reading `✅ Done` leaves it byte-identical (no second marker, no appended line).
- **Missing-section case flagged, not invented** — a brief with no `## Status` heading is left untouched and the run reports it, rather than fabricating a section.
- **Only the brief just moved** is touched — never a sweep across `done/` repairing historical drift.
- The step-7 report contract updated so the run states the header was set (or flagged absent).
- **Canonical source is `claude/skills/fkit-task-done/SKILL.md`** — the mover skills live only in `claude/skills/`, not under `claude/scaffold/`; the `.claude/` copy is gitignored and init-regenerated. **Skill-text only; no product/runtime code, no commit change.**

## Outcome
**Done.** Prevents *new* drift. The backfill of the already-drifted Sprint 2 briefs (23, 30, 31, 32, 33) and the two leftovers was a **separate manual concern, out of scope here** — done by deliberate edit (and reflected in this sync: those briefs' internal headers now read `✅ Done`). Risk was low; the one hazard — a non-idempotent write growing the brief on re-run — is pinned by the verification.

## Related
- [[tasks/task-cancelled-flips-brief-own-status-header]] — the identical fix for `/fkit-task-cancelled`; co-landed
- [[tasks/harden-task-movers-against-closed-sprint-link-rot]] — task 22, the same mover-drift class
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[systems/knowledge-base-structure]] — the task-status vocabulary the header must match
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]] — the dashboard that *surfaces* this drift
- [[tasks/sprint-2-remove-omnigent]]
