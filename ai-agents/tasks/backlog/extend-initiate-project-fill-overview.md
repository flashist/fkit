# Extend `initiate-project` to also fill CLAUDE.md/AGENTS.md Project Overview

## Sprint
Sprint 2

## Priority
13

## Status
🔲 Backlog

## Context

`ai-agents/tasks/done/fix-claude-agents-md-placeholder-text.md` fixed, as a one-off, the fact that
root `CLAUDE.md`/`AGENTS.md` still carried raw scaffold "fill in" placeholder text for their Project
Overview and Architecture sections, even though this project had already been initiated (`PROJECT.md`
was fully written). Root cause identified there: `initiate-project`'s Step 4 writes `PROJECT.md` but
never revisits `CLAUDE.md`/`AGENTS.md` — so nothing ever fills their placeholders in.

That root cause is still live. **Every new fkit project run through `initiate-project` will hit the
exact same gap** the moment initiation completes, because the skill still only writes `PROJECT.md`.
This task closes the Project-Overview half of that gap at the source (the skill itself); the
Architecture half is a separate, simpler fix — see `bake-architecture-pointer-into-scaffold-templates.md`
— because that sentence is identical for every project and doesn't need a process step at all.

Flagged by fkit-architect during a follow-up architecture inspection (2026-07-10).

## What to build

In `omnigent/fkit-producer/skills/initiate-project/SKILL.md`, add a new step immediately after
**Step 4 — Write PROJECT.md** (e.g. "Step 4b — Fill CLAUDE.md/AGENTS.md's Project Overview"):

- After `PROJECT.md`'s Overview section is written, replace the "fill in" placeholder in both root
  `CLAUDE.md` and `AGENTS.md`'s **Project Overview** section with 1–3 sentences lifted (not copied
  verbatim — matching this repo's own precedent fix) from `PROJECT.md`'s Overview, keeping the
  existing pointer line to `PROJECT.md` intact.
- Do not touch the Architecture placeholder in this step — if
  `bake-architecture-pointer-into-scaffold-templates.md` has already shipped, the scaffold's
  Architecture section will already be the fixed pointer sentence and need no runtime action; if it
  hasn't shipped yet, leave Architecture out of scope here rather than duplicating that fix in two
  places.
- Keep this scoped to what the producer already owns per the skill's own stated boundary ("You write
  the product picture; the architect writes the technical one") — Project Overview is product-picture
  content sourced from `PROJECT.md`, which the producer already wrote in Step 4.

## Verification steps

- Run (or dry-run) `initiate-project` against a scaffolded-but-uninitiated test project; after the new
  step, `grep -n "fill in" CLAUDE.md AGENTS.md` no longer matches the Project Overview placeholder.
- The filled content in CLAUDE.md/AGENTS.md's Project Overview is substantively consistent with
  `PROJECT.md`'s Overview, not a verbatim block-copy — same tone/length as the manual fix in
  `fix-claude-agents-md-placeholder-text.md`.
- Existing root `CLAUDE.md`/`AGENTS.md` in this repo (already fixed manually) can serve as the
  reference output shape.

## Notes

- Natural owner: **fkit-architect** — flagged this, offered exact proposed wording, and it's the same
  non-code documentation/skill-instruction editing category as the two precedent tasks
  (`fix-claude-agents-md-placeholder-text.md`, `document-consult-chain-envelope.md`), both owned by
  the architect. The architect deliberately did not edit this unilaterally because it modifies the
  producer's own operational skill file — recommend the producer (this agent) reviews the specific
  wording before the owner marks it done, precisely because it's self-referential.
- Independent of `bake-architecture-pointer-into-scaffold-templates.md` — either can ship first.
- Small task; should not need its own sprint slot beyond this one.
