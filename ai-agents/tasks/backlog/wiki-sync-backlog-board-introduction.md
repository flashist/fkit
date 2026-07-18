# Wiki sync after the Backlog board introduction

## Sprint
Sprint 2

## Priority
69

## Status
🔲 Backlog

## Context

**Tasks 67 and 68 change two skills' observable behavior:** `/fkit-task-brief`'s no-sprint path now
files to a persistent `ai-agents/sprints/backlog.md` board, and `/fkit-status` resolves `Backlog` as
a named target (default run unchanged). Vault pages describing "unsprinted backlog = field only, no
board" or the status skill's argument surface become wrong when they land.

**Precedent: tasks 45/51/66** — a skill-behavior change gets its own wiki-sync task because **only
the `fkit-wiki` agent may write `ai-agents/wiki-vault/`** (ADR-005). **Sequencing is the point**
(task-11 lesson): syncing first ingests drift.

## What to build

Run a **delta sync** of `ai-agents/wiki-vault/` against the post-67/68 reality. Sweep for pages
describing `/fkit-task-brief`'s sprint handling, the task lifecycle, unsprinted backlog, and
`/fkit-status`'s argument (**re-derive the page list at run time**). Page by page:

- **Current-behavior pages:** correct to — no sprint named → Backlog board row + `## Sprint: Backlog`;
  `/fkit-status Backlog` reports it on request, default run ignores it; backlog is unranked.
- **Record-of-past-task pages:** mark superseded behavior with a pointer to tasks 67/68; do not
  silently rewrite history.

## Verification steps

- Grep the vault for claims that unsprinted briefs live on no board, or that `/fkit-status` accepts
  only sprint names, presented as **current** behavior — zero hits.
- Historical pages remain discoverable with the 67/68 pointers — not deleted.
- `index.md` reflects any page whose summary line changed.
- A lint pass is clean — no dangling links.

## Notes

- **Owner: fkit-wiki** — exclusive write gateway for `ai-agents/wiki-vault/` (ADR-005).
- **Depends on: tasks 67 and 68 — hard.** Do not start before both land (one sync, not two, to avoid
  ingesting the halfway state).
- **Risk: low**, contained to the vault.
- **Numbered 69 per append-don't-renumber.** Owner to confirm the ranking.
