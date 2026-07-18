# Report the Backlog board in `/fkit-status` on request only

## Sprint
Sprint 2

## Priority
68

## Status
🔲 Backlog

## Context

**The owner's ruling (2026-07-18, with task 67):** `/fkit-status` must **not** report the Backlog
board by default — only when asked for it specifically.

**Half of this is already true by construction:** the default (no-argument) run resolves the active
sprint by globbing `sprint-*.md` at the top of `ai-agents/sprints/`; task 67's `backlog.md` does not
match and is never picked up. **This task is the other half:** making `Backlog` a resolvable *named*
target — today the skill's named path resolves sprint names against `ai-agents/sprints/` +
`sprints/done/` and would either miss or mishandle `backlog.md`.

**One-skill-one-output — conforms, no ADR needed.** The sprint-name argument is a **target selector**
(which board), not an output variant (how the one board renders). Task 44's ruling removed output
variants; the named-sprint argument survived it. `Backlog` is one more value of the existing argument.

**Known friction to verify:** `dashboard.sh` and the skill's seven beats assume a *sprint* — goal,
phases, priorities, drift beats. The backlog board is unranked (`—` priorities) and has no goal line.
The beats that are moot on a closed sprint are similarly mostly moot here; the skill already has that
"say so, don't invent" pattern for `sprints/done/` — reuse it. `dashboard.sh` must tolerate the `—`
priority cells (task 67 keeps the table format identical precisely so parsing survives — **verify**).

## What to build

- **`claude/skills/fkit-status/SKILL.md`** (canonical source): extend the argument-resolution step —
  `Backlog` (case-insensitive) resolves to `ai-agents/sprints/backlog.md`; absent board → say so, do
  not create it. On the backlog board, apply the closed-sprint pattern to the beats that presuppose a
  sprint (goal/phase/risk): state they don't apply, report the board and drift beats that do.
- **Confirm-or-fix `dashboard.sh`** on the backlog board: renders rows with `—` priorities without
  error; roll-up counts correct. Fix only what the backlog board breaks — no unrelated changes.
- **Tests** (ADR-014, `node --test`): `dashboard.sh` against a backlog-board fixture — rows render,
  `—` priorities tolerated, roll-up correct.

## Verification steps

- `/fkit-status` (no argument) output is byte-equivalent in board choice to pre-change — active
  sprint only, no Backlog content.
- `/fkit-status Backlog` renders the backlog board with the non-applicable beats explicitly marked
  moot, not invented.
- `/fkit-status Backlog` with no `backlog.md` present reports its absence and lists what exists —
  no file created (read-only contract intact).
- Test suite green including the backlog-fixture cases.

## Notes

- **Owner: fkit-coder.**
- **Depends on: task 67 — hard** (the board format is the contract this parses).
  **Blocks: task 69** (wiki sync).
- **If task 65 (filtered board) lands first, the filter applies to the backlog board too** — done/
  cancelled rows hidden, drifted visible, roll-up kept. No special-casing; note the interaction in the
  plan.
- **Numbered 68 per append-don't-renumber.** Owner to confirm the ranking.
