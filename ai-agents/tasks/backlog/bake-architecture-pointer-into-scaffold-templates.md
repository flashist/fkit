# Bake the Architecture pointer sentence into scaffold CLAUDE.md/AGENTS.md templates

## Sprint
Sprint 1

## Priority
7

## Status
🔲 Backlog

## Context

`omnigent/scaffold/CLAUDE.md` and `omnigent/scaffold/AGENTS.md` currently ship an Architecture
section with a "fill in" placeholder comment (`<!-- project-specific — fill this in -->` /
`_Describe this project's architecture, critical files, and development commands here._`). But unlike
the Project Overview (genuinely project-specific, see `extend-initiate-project-fill-overview.md`),
the Architecture pointer sentence is **identical for every fkit project** — this repo's own root
`CLAUDE.md`/`AGENTS.md` already demonstrate the fixed text, applied manually in
`fix-claude-agents-md-placeholder-text.md`.

Since the content never varies, there is no reason to make it a process step at all. Baking it
directly into the scaffold template closes this half of the recurring placeholder gap permanently,
with zero ongoing reliance on any skill remembering to fill it in.

Flagged by fkit-architect during a follow-up architecture inspection (2026-07-10); the architect
offered to make this edit directly rather than route it through a full brief. Decision: still write
it as a brief so it's tracked the same way the precedent fix was (brief → execute → owner reviews via
`task-done`), rather than as an untracked ad hoc edit outside the task-lifecycle process.

## What to build

In both `omnigent/scaffold/CLAUDE.md` and `omnigent/scaffold/AGENTS.md`, replace the Architecture
section's placeholder with the fixed pointer sentence already used in this repo's own root files:

> Full technical detail — component map, runtime topology, data model, build/run/test, and
> cross-cutting concerns — lives in
> [`ai-agents/knowledge-base/architecture.md`](ai-agents/knowledge-base/architecture.md). Don't
> duplicate it here; read it for anything below product-brief altitude.

Leave the Project Overview placeholder untouched in the scaffold templates — that one is genuinely
project-specific and stays a fill-in target for `extend-initiate-project-fill-overview.md`'s new step.

## Verification steps

- `grep -n "fill in\|fill this in"` on `omnigent/scaffold/CLAUDE.md` and `AGENTS.md` no longer matches
  the Architecture section (Project Overview placeholder still legitimately present).
- The new Architecture section text matches this repo's own root `CLAUDE.md`/`AGENTS.md` Architecture
  section in substance.
- Fresh scaffold via `omnigent/fkit-init.sh` against a scratch directory: the dropped
  `CLAUDE.md`/`AGENTS.md` already carry the pointer, no placeholder.

## Notes

- Natural owner: **fkit-architect** — flagged it, holds the exact wording, same content-only
  non-code doc-template edit category as `fix-claude-agents-md-placeholder-text.md`.
- Trivial, no dependencies; can ship independently of `extend-initiate-project-fill-overview.md`.
