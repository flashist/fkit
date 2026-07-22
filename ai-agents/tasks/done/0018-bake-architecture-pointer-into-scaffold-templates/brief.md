# Bake the Architecture pointer sentence into the scaffold CLAUDE.md/AGENTS.md templates

## ID
0018

## Sprint
Sprint 2

## Priority
12

## Status
✅ Done

## Owner
fkit-coder

## Context

> **Rescoped 2026-07-11 (Sprint 1 → Sprint 2).** This task originally targeted
> `omnigent/scaffold/CLAUDE.md` and `omnigent/scaffold/AGENTS.md` — **both of which are being
> deleted or moved.** The underlying gap is real and runtime-independent, so the task survives,
> **retargeted to `claude/scaffold/`**, which is where the scaffold now lives after Phase 0.1.

The scaffold templates ship an Architecture section with a fill-in placeholder
(`<!-- project-specific — fill this in -->` / `_Describe this project's architecture…_`). Per the
removal plan §E, `claude/scaffold/CLAUDE.md:7` still carries that placeholder today.

But unlike the Project Overview — which is genuinely project-specific, and is
`extend-initiate-project-fill-overview.md`'s job — **the Architecture pointer sentence is identical
for every fkit project.** This repo's own root `CLAUDE.md`/`AGENTS.md` already demonstrate the fixed
text (applied manually in `fix-claude-agents-md-placeholder-text.md`).

Since the content never varies, there is no reason for it to be a process step at all. Baking it into
the template closes this half of the recurring-placeholder gap **permanently**, with zero ongoing
reliance on any skill remembering to fill it in. That is why this is worth doing even though it looks
trivial: it removes a whole class of recurrence rather than fixing one instance of it.

## What to build

In `claude/scaffold/CLAUDE.md` and `claude/scaffold/AGENTS.md` (post-Phase-0.1 locations — confirm the
paths before starting), replace the Architecture section's placeholder with the fixed pointer sentence
already used in this repo's own root files:

> Full technical detail — component map, runtime topology, data model, build/run/test, and
> cross-cutting concerns — lives in
> [`ai-agents/knowledge-base/architecture.md`](ai-agents/knowledge-base/architecture.md). Don't
> duplicate it here; read it for anything below product-brief altitude.

**Leave the Project Overview placeholder untouched** — that one is genuinely project-specific and
stays a fill-in target for `extend-initiate-project-fill-overview.md`.

## Verification steps

- `grep -n "fill in\|fill this in"` on `claude/scaffold/CLAUDE.md` and `claude/scaffold/AGENTS.md` no
  longer matches the Architecture section (the Project Overview placeholder is still legitimately
  present).
- The new Architecture text matches this repo's own root `CLAUDE.md`/`AGENTS.md` in substance.
- Fresh scaffold into a scratch dir: the dropped `CLAUDE.md`/`AGENTS.md` already carry the pointer,
  with no placeholder.

## Notes

- Natural owner: **fkit-architect** — flagged it and holds the exact wording; same content-only
  doc-template edit category as `fix-claude-agents-md-placeholder-text.md`.
- **Depends on:** Phase 0.1 (`extract-scaffold-into-claude`) — the target files must be in
  `claude/scaffold/` first. Trivial once that lands.
- Ships independently of `extend-initiate-project-fill-overview.md`.
