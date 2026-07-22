# Wiki sync after the `/fkit-dumb-down` skill lands

## ID
0094

## Sprint
Sprint 2

## Priority
73

## Status
✅ Done

## Owner
fkit-wiki

## Context

**Task 72 adds a new six-role skill** — `/fkit-dumb-down` — changing every Claude-side role's skill
surface and the `skills_for_role()` registry. Vault pages recording per-role skill ownership and the
role-locked-sessions system become stale when it lands.

**Precedent: tasks 45/51/66/69/71** — a skill-surface change gets its own wiki-sync task because
**only the `fkit-wiki` agent may write `ai-agents/wiki-vault/`** (ADR-005). **Sequencing is the
point**: syncing first ingests drift.

**If task 71 (the open-questions-interview sync) is still pending when this runs, batch the two into
one sync pass** — same pages, same edit class; two passes over the same role listings is waste. The
tasks stay separate on the board (different parents, different gates), but the wiki agent may close
both in one run.

## What to build

Run a **delta sync** of `ai-agents/wiki-vault/` against the post-task-72 reality. Sweep for pages
listing role skills or describing the skill-lockdown surface (**re-derive the page list at run
time**). Page by page:

- **Current-behavior pages:** add the skill — six roles, adversarial reviewer excluded (ADR-022),
  on-demand re-explain, content-preserving, zero write surface; note the complementary relation to
  task 62's standing style preference (both, by owner ruling).
- Keep per-role skill counts consistent (the task-29 "read the files" lesson).

## Verification steps

- Grep the vault for role-skill listings — every page listing a Claude-side role's skills includes
  `/fkit-dumb-down`; no page attributes it to the adversarial reviewer.
- `index.md` reflects any page whose summary line changed.
- A lint pass is clean — no dangling links.

## Notes

- **Owner: fkit-wiki** — exclusive write gateway for `ai-agents/wiki-vault/` (ADR-005).
- **Depends on: task 72 — hard.** Do not start before it lands. May be executed in the same sync run
  as task 71 if both parents have landed.
- **Risk: low**, contained to the vault.
- **Numbered 73 per append-don't-renumber.** Owner to confirm the ranking.
