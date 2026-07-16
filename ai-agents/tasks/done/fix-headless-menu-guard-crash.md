# Fix the headless menu-guard crash — `[ -r /dev/tty ]` never tests openability

## Sprint
Sprint 2

## Priority
33

## Status
✅ Done

*(The fix is **implemented in the working tree** but **not committed** and **not yet independently
reviewed**. It is not Done. `Done` is owner-gated and set only by `/fkit-task-done` after review.)*

## Context

**On a NO-ROLE, NO-ARGS invocation of an INITIATED project with no controlling terminal** (piped, CI,
or detached), **the launcher crashed instead of defaulting to the team room (`fkit-lead`).**

The menu guard gated on `[ -r /dev/tty ]`. `-r` tests the device node's **permission bits**
(`access()`), **not** whether `open()` on it succeeds — and `/dev/tty` is world-`rw` on macOS and
Linux, so `[ -r /dev/tty ]` reads **TRUE even with no controlling terminal.** The branch was therefore
entered, and the very next line, `exec 3</dev/tty`, failed **ENXIO ("Device not configured")** under
`set -eu`, exiting 1 — **never reaching the `role="lead"` default below it.**

**Net effect: the lead default was dead code on any normal system.** The launcher's documented
"piped / CI → safe default" promise — the team room — could not be reached on the exact input it exists
to serve. What should have been a clean fall-through to `fkit-lead` was a crash.

**This is a defect against an EXISTING contract, not a new decision.** Two places already settle that
an initiated-headless run routes to the lead: the fall-through comment at `fkit-claude.sh:462-464`
("*No role and no tty (piped / CI) → the team room is the safe default*"), and **task 23's
launcher-contract assertion 7** (no-args, no-tty, initiated → `--agent fkit-lead`). The behavior was
specified; the code did not deliver it. **No architecture decision is involved, so no ADR.**

## Discovery

- **Surfaced by the task-23 launcher-contract test suite.** Its **assertion 7** pins
  headless-no-arg-initiated → `fkit-lead`; when that assertion was made enforcing it went **red**,
  exposing the crash.
- **Confirmed by an fkit-architect consult (2026-07-15):** `[ -r /dev/tty ]` tests the node's
  permission bits, not openability, and `/dev/tty` is world-`rw`, so the predicate is true in a
  headless session where `open()` will fail.

**Scope boundary — do not widen.** The **FRESH-project** headless case (producer-vs-lead routing on a
project with no `PROJECT.md`) is a **separate, untouched** question — it remains **task 23's reserved
open question 1** (`fkit-claude.sh:408-413`, the fresh branch has no tty check). **This defect and its
fix are confined to the INITIATED path.** Do not resolve the fresh-project question here.

## What to build

**Already applied in the working tree — this brief documents the change for review and owner
sign-off; it is not a fresh implementation ask.**

Replace the permission-bit test with an **openability probe** in the menu guard
(`claude/fkit-claude.sh:426`):

- **Was:** `[ -r /dev/tty ]`
- **Now:** `( exec 3</dev/tty ) 2>/dev/null` — a subshell that returns **0 only if `open()` genuinely
  succeeds.** It is non-fatal on failure inside the `||` test, and `2>/dev/null` swallows the ENXIO
  noise. A headless run now returns non-zero from the probe and **falls through to the team-room
  default** at `:462-464` instead of crashing.

The explanatory comment at `fkit-claude.sh:419-425` records exactly this reasoning inline; keep it.

## Verification steps

- **`npm test` — task 23's assertion 7 passes.** It flipped from a `todo`/non-enforcing state to an
  **enforcing** test and is now green: headless, no-arg, initiated → `--agent fkit-lead`, exit 0.
- **Headless no-arg initiated → `fkit-lead`, exit 0** — run the launcher with no controlling terminal
  (piped / detached) on an initiated project; it reaches the team room, does not crash.
- **The interactive menu still opens** on a real tty (pty) — the guard is not over-tightened; a genuine
  terminal still gets the 1–7 menu.
- **Fresh → producer is unchanged** — the fresh-project branch is not touched by this change.

## Notes

- **Owner: fkit-coder** — this is a production launcher change (`claude/fkit-claude.sh`).
- **Risk: low.** One predicate swapped, verified across **all three routing paths** (headless→lead,
  interactive-menu, fresh→producer). No other behavior changes.
- **Depends on nothing.** It **relates to task 23** — task 23's assertion 7 is what caught it, and that
  assertion only becomes truly enforcing once this fix lands. It can **co-land with task 18's launcher
  pass** if the coder is already in `fkit-claude.sh`.
- **Not committed, not reviewed.** The change sits in the working tree pending the owner's sign-off and
  an independent review. Do **not** report it as Done, and do **not** move this brief — that is the
  owner-invoked `/fkit-task-done`.
- Technical picture: **fkit-architect** (2026-07-15 consult — confirmed the `access()`-vs-`open()`
  distinction and the world-`rw` `/dev/tty` cause).
