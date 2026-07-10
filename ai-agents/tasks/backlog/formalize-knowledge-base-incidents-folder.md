# Formalize the knowledge-base folder structure, including `incidents/`

## Sprint
Sprint 1

## Priority
11

## Status
🔲 Backlog

## Context

`ai-agents/knowledge-base/` now has four things in it: `PROJECT.md`, `architecture.md`, and three
subfolders — `decisions/` (numbered ADRs, e.g. `adr-001-...md`), `history/` (superseded
pre-Omnigent design docs, documented by its own `history/README.md` and referenced from
`architecture.md`), and, as of the 2026-07-10 incident,
[`incidents/`](../../knowledge-base/incidents/2026-07-10-subagent-runners-disconnected.md) — created
ad hoc to hold that write-up, with no documented convention for what belongs there or how future
incidents should be named/structured.

fkit-wiki confirmed (2026-07-10 consult, on request): the wiki record only establishes `history/` as
an explicit, documented knowledge-base subfolder convention. There is **no prior convention** for
`incidents/`, `runbooks/`, or `ops` — and an older external-review doc actually flagged "post-merge
lifecycle (deploy, incident response, rollback, ops)" as a known gap. `decisions/` exists and is
used (three ADRs already in it) but isn't explicitly listed/described in `architecture.md` either.

This task closes that gap now, while it's fresh, rather than letting `incidents/` accumulate files
with an inconsistent shape the way `decisions/` did before ADRs got a naming convention.

## What to build

- **`ai-agents/knowledge-base/incidents/README.md`** (mirroring `history/README.md`'s shape):
  what belongs here (postmortem-style write-ups of operational incidents affecting the fkit team's
  own runtime/tooling, not product bugs — those stay as task briefs), naming convention (this
  incident's `YYYY-MM-DD-short-slug.md` is a reasonable pattern to lock in), and lifecycle (kept
  as historical record, not edited except for factual corrections like the sibling amendment task —
  new findings get a new dated doc or a follow-up task, not a rewrite of the original).
- **Extend `architecture.md`** wherever it currently describes the knowledge-base layout (the
  `history/` bullet is the closest existing anchor) to list all three subfolders —
  `decisions/`, `history/`, `incidents/` — each with a one-line purpose and a link to its README
  (or ADR-numbering convention, for `decisions/`, which doesn't have one yet — a single line is
  enough, it doesn't need its own README unless the architect judges otherwise).
- **Extend `PROJECT.md`'s knowledge-base pointer** only if the architect judges the one-line
  "don't duplicate it here" pattern needs updating to mention the subfolders exist — otherwise
  leave `PROJECT.md` as the thin pointer it already is and keep this detail in `architecture.md`.

## Verification steps

- `ai-agents/knowledge-base/incidents/README.md` exists and states scope, naming convention, and
  lifecycle, at the same altitude as `history/README.md`.
- `architecture.md` lists all three knowledge-base subfolders (not just `history/`) with their
  purpose.
- No change in meaning to `PROJECT.md`'s existing "don't duplicate it here" pointer unless the
  architect judges an addition is warranted.

## Notes

- Natural owner: **fkit-architect** — owns `architecture.md` and the knowledge-base structure
  precedent (`history/README.md`), same as the doc-structure work in
  `document-consult-chain-envelope.md`.
- After this ships, flag it to **fkit-wiki** for a sync/ingest pass so the wiki's own
  `[[systems/fkit]]` page reflects the new convention (wiki confirmed this gap during the
  2026-07-10 consult) — a follow-up note, not a blocker for this task itself.
- Small/doc-only task — should not need its own sprint slot beyond this one.
