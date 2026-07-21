# Wiki sync after the `/fkit-open-questions-interview` skill lands

## ID
0097

## Sprint
Sprint 2

## Priority
71

## Status
✅ Done

## Context

**Task 70 adds a new six-role skill** — `/fkit-open-questions-interview` — changing every Claude-side
role's skill surface and the `skills_for_role()` registry. Vault pages recording per-role skill
ownership and the role-locked-sessions system become stale when it lands.

**Precedent: tasks 45/51/66/69** — a skill-surface change gets its own wiki-sync task because **only
the `fkit-wiki` agent may write `ai-agents/wiki-vault/`** (ADR-005). **Sequencing is the point**:
syncing first ingests drift.

## What to build

Run a **delta sync** of `ai-agents/wiki-vault/` against the post-task-70 reality. Sweep for pages
listing role skills or describing the skill-lockdown surface (**re-derive the page list at run
time** — likely the role-locked-sessions systems page, per-role pages, `index.md`). Page by page:

- **Current-behavior pages:** add the skill — six roles, adversarial reviewer excluded (ADR-022),
  session-only interview with the consult degrade (ADR-021), interview-only / zero write surface.
- Keep any per-role skill counts consistent — a stale count is the exact drift class task 29's lineage
  warned about ("read the files").

## Verification steps

- Grep the vault for role-skill listings — every page listing a Claude-side role's skills includes
  `/fkit-open-questions-interview`; no page attributes it to the adversarial reviewer.
- `index.md` reflects any page whose summary line changed.
- A lint pass is clean — no dangling links.

## Notes

- **Owner: fkit-wiki** — exclusive write gateway for `ai-agents/wiki-vault/` (ADR-005).
- **Depends on: task 70 — hard.** Do not start before it lands.
- **Risk: low**, contained to the vault.
- **Numbered 71 per append-don't-renumber.** Owner to confirm the ranking.
