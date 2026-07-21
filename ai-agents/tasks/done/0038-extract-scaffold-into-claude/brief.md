# Extract the shared scaffold into `claude/`

## ID
0038

## Sprint
Sprint 2

## Priority
1 (Phase 0.1 — foundations, blocking)

## Status
✅ Done

## Context

Per the Omnigent-removal plan
([`2026-07-11-plan-omnigent-removal.md`](../../../knowledge-base/reports/2026-07-11-plan-omnigent-removal.md)
§Phase 0.1) and [ADR-009](../../../knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md).

**`omnigent/` is load-bearing for the Claude flavor today.** The single most important fact about
this whole sprint: `omnigent/` cannot simply be deleted, because the Claude flavor reads its
scaffold at runtime. `claude/fkit-claude-init.sh:20` sets
`scaffold="$here/../omnigent/scaffold"` and copies the `ai-agents/` tree (`:30`) *and* `AGENTS.md`
(`:46`) from it. `claude/scaffold/` today contains only `CLAUDE.md`.

This task removes that dependency. It is the first of three blocking foundations; **nothing in
Phase 1 or 2 may start until it lands.**

## What to build

- Move `omnigent/scaffold/ai-agents/` → `claude/scaffold/ai-agents/` (use `git mv` to preserve
  history).
- Move `omnigent/scaffold/AGENTS.md` → `claude/scaffold/AGENTS.md`.
- Drop `omnigent/scaffold/CLAUDE.md` — this is the *Omnigent-flavored* CLAUDE.md and is genuinely
  dead. `claude/scaffold/CLAUDE.md` (which stays) is the correct one; per the audit it is currently
  the single most accurate doc in the repo about the role-locked model.
- Repoint `claude/fkit-claude-init.sh:20` to `scaffold="$here/scaffold"` (verify the correct relative
  path against the script's own `$here`).
- Confirm no other file reads `omnigent/scaffold` — grep before declaring done.

After this task, `omnigent/scaffold/` should no longer exist and nothing under `claude/` should
reference it.

## Verification steps

- `grep -rn "omnigent/scaffold" .` returns nothing outside the knowledge-base/plan docs.
- Run `fkit` in a scratch directory (`mktemp -d`) and confirm it scaffolds a **complete** project:
  the full `ai-agents/` tree, `AGENTS.md`, and `CLAUDE.md` all land, with the same content as before
  the move.
- Diff the scaffolded output against a pre-change scaffold run to prove nothing was dropped.

## Notes

- Owner: **fkit-coder**.
- **Blocks:** Phase 1 (installer rewrite) and Phase 2 (delete `omnigent/`).
- Depends on nothing.
- Risk: **low** — a mechanical move plus one path change. The risk is only in *not* doing it before
  Phase 2.
- Do **not** fix any Omnigent-side doc drift you encounter along the way — those files are being
  deleted, not repaired (plan §"Explicitly not in scope").
