# Replace leftover placeholder text in CLAUDE.md / AGENTS.md

## ID
0041

## Sprint
Sprint 1

## Priority
3

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

Both root instruction files still carry raw scaffold placeholder text:

- `CLAUDE.md` → Project Overview: `_One-paragraph overview of this project — fill in._`
- `CLAUDE.md` → Architecture: `_Describe this project's architecture, critical files, and
  development commands here._`
- `AGENTS.md` → same two placeholders, near-identical wording.

This was raised by the architect as a "can't tell if deliberate or unfinished" question during
Sprint 1 review. Decision: **oversight, not deliberate.** Evidence — `PROJECT.md` is fully written
(this project has been initiated) and its own Architecture section already models the correct
pattern: a short paragraph plus an explicit pointer, ending "*Don't duplicate it here; read it for
anything below product-brief altitude*" → `architecture.md`. `CLAUDE.md`/`AGENTS.md` never got that
same treatment — they still say "fill in" rather than either containing a real paragraph or
pointing anywhere. `initiate-project` filled in `PROJECT.md` and `architecture.md` but missed these
two files. There is no deliberate-thin-pointer reading that's consistent with literal "fill in"
placeholder text — a deliberate pointer would read like PROJECT.md's own Architecture section, not
like an unfilled template.

This is a **documentation consistency fix**, not a design decision — no new content to invent,
just apply the existing convention.

## What to build

In both `CLAUDE.md` and `AGENTS.md`:

- **Project Overview**: replace the "fill in" placeholder with 1–3 sentences (can lift near-verbatim
  from `PROJECT.md`'s Overview) plus keep the existing pointer line to `PROJECT.md`.
- **Architecture**: replace the placeholder line with a short pointer sentence to
  `ai-agents/knowledge-base/architecture.md`, mirroring PROJECT.md's own phrasing convention
  ("full technical detail lives in architecture.md — don't duplicate it here").
- Keep both files thin either way — this is not an invitation to add new prose beyond a short
  pointer; the point is removing the "still unfinished" look, not writing a second project brief.

## Verification steps

- `grep -n "fill in" CLAUDE.md AGENTS.md` returns nothing.
- Both files' Architecture sections link to `ai-agents/knowledge-base/architecture.md`.
- No content duplicated wholesale from `PROJECT.md`/`architecture.md` — pointers, not copies.

## Notes

- Natural owner: **fkit-architect** — raised it, already holds the architecture.md content this
  needs to mirror, and it's non-code documentation (same precedent as
  `document-consult-chain-envelope.md`). Not a coder task.
- Trivial (~5 min) — should not need its own sprint slot beyond this one.
