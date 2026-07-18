# Remove the `.fkit/` Omnigent-orphan residue

**Source**: `ai-agents/tasks/done/remove-fkit-omnigent-orphan-residue.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 36

## Goal
Remove the dead Omnigent residue from consuming projects: exactly four paths with zero references in current code — `.fkit/agents/`, `.fkit/run`, `.fkit/team-session`, `.omnigent/`. **The one destructive act in the whole migration design** (an `rm -rf` in a user's project, no rollback) — deliberately carved out of the additive-convergence work (tasks 25–28), which never deletes, so a silent every-launch pass could not inherit the one operation that must never be silent.

## Key Changes
- **Consent model, owner-ruled 2026-07-17: announce-only** — delete on run, print exactly what was removed. Rationale: strictly Omnigent-scoped, and the owner is currently fkit's only user. Sets **no precedent** for future destructive operations (those return to the owner per the standing re-raise trigger). Ask-once and dry-run-first were rejected as unnecessary, not wrong.
- Safety bar (not waived by announce-only): a **hard reference-check gate** re-run at build time — any target with a reference in current `claude/` sources is refused, not deleted; a **dry-run capability**; per-path announcement; **non-fatal** (never bricks the launcher, task-26 bar).
- **`.fkit/settings` must never be touched** — live ADR-010 lockdown state, rewritten on every launch. The migration report's rev-1 deletion list wrongly named it — the mistake the reference-check gate exists to catch. The four-path list is exhaustive **by ruling**; any addition is a new owner decision.

## Outcome
**Done.** Resolves Sprint 2 open question 5. One-time cleanup, not part of the every-launch additive pass; depends on tasks 25–28 (all landed first).

## Related
- [[tasks/converge-ai-agents-additively-on-launch]] — the additive family this was deliberately kept out of
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the never-delete invariant this is the one sanctioned exception to
- [[systems/launch-convergence-and-init]]
- [[tasks/stop-init-failure-bricking-the-launcher]] — the non-fatal bar it reuses
- [[tasks/sprint-2-remove-omnigent]]
- [[systems/fkit]]
