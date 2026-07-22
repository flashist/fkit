# Update the launcher menu/help text — "does no work itself" → accurate to a conductor

## ID
0113

## Sprint
Sprint 2

## Priority
95

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

The launcher describes `fkit-lead` as the team room that "does no work itself" — accurate to the old
router, wrong for the evolved conductor (0110). From the approved design
[`2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`](../../../knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md)
§4.2 (change surface) and §4.4 (no control-flow change needed).

No launcher control-flow change is required (design §4.4): menu option 7 already execs
`claude --agent fkit-lead --settings <lead.json>` and `build_settings()` already wires the ADR-018
hook for lead. This task is **text only** — the menu/help strings.

## What to build

Update the launcher user-facing text in `claude/fkit-claude.sh` (design §4.2 points at
`fkit-claude.sh:165,440,467`; confirm the live line numbers before editing):

- The "team room — routing help … **does no work itself**" descriptions become accurate to a
  conductor that can spawn and drive the team — while keeping the routing capability it still has
  (design §4.1: lead drives when asked to *do*, points when asked to *point*).

Do **not** change control flow, the exec line, or `build_settings()` — text strings only.

## Verification steps

1. The menu/help strings for lead in `claude/fkit-claude.sh` no longer say lead "does no work itself";
   they describe the conductor + retained routing accurately.
2. No control-flow / exec / `build_settings()` change — `git diff` shows string edits only.
3. Launching `fkit` → option 7 still opens the lead session (no regression from the text edit).

## Notes

- **Owner:** fkit-coder.
- **Depends on:** 0110 (the evolved lead — the text must describe the new nature). Design §11: `T5`
  depends on T2 (0110). Independent of 0111/0112 — can run in parallel with them once 0110 lands.
- No commit — leave the edit in the working tree.
