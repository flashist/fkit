# Wiki sync after the filtered `/fkit-status` board

## ID
0095

## Sprint
Sprint 2

## Priority
66

## Status
✅ Done

## Context

**Task 65 changes `/fkit-status`'s observable behavior:** the board hides `✅ Done` / `⛔ Cancelled` /
`➡️ Moved` rows (drifted rows excepted, roll-up kept). Vault pages describing the board as showing
every row become wrong the moment 65 lands — wrong *with the authority of "verified knowledge."*

**Precedent: tasks 45 and 51** — a skill-behavior change gets its own wiki-sync task because **only the
`fkit-wiki` agent may write `ai-agents/wiki-vault/`** (ADR-005); the coder cannot do this inside 65.

**Sequencing is the point** (the task-11 lesson): syncing before 65 lands ingests the drift into the
vault — then it is wrong in two places.

## What to build

Run a **delta sync** of `ai-agents/wiki-vault/` against the post-task-65 reality. Sweep the vault for
pages describing the `/fkit-status` board contents — likely candidates (**re-derive rather than trust
this list**): the `/fkit-status` / role-locked-sessions systems pages, the task pages for 40/41/44
and the one-skill-one-output convention page, `index.md`. Page by page:

- **Current-behavior pages:** correct to — board shows open work only; totals line carries full scope;
  drifted rows always visible; still one output, no variants.
- **Record-of-past-task pages** (e.g. task-44's): the show-everything principle **was** current and was
  then consciously reversed by task 65 — mark the reversal and point at 65; do not silently rewrite
  history.

## Verification steps

- Grep the vault for claims that the `/fkit-status` board shows all/every row (done, cancelled, moved
  included) as **current** behavior — zero hits.
- Historical pages remain discoverable, marked with the task-65 reversal pointer — not deleted.
- `index.md` reflects any page whose summary line changed.
- A lint pass is clean — no dangling links from the edits.

## Notes

- **Owner: fkit-wiki** — the exclusive write gateway for `ai-agents/wiki-vault/` (ADR-005).
- **Depends on: task 65 — hard.** Do not start before 65 lands.
- **Risk: low**, contained to the vault. No product code.
- **Numbered 66 per append-don't-renumber.** Owner to confirm the ranking.
