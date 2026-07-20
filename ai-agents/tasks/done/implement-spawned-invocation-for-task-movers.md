# Implement spawned invocation for the task movers from the approved design

## ID
0054

## Sprint
Sprint 2

## Priority
64

## Status
✅ Done (agent-closed — not owner-verified)

## Context

**Task 63 designs a laundering-safe consent model** that lets another agent drive
`/fkit-task-done` and `/fkit-task-cancelled` by spawning the producer sub-agent, gets the owner's
ruling, and records the reversal/amending ADR. This task builds exactly that approved design. Scoped
now at shape level (the 55/56, 59/60 pattern); **task 63's approved spec governs and wins wherever it
differs — including the possibility that it rules the relaxation unsafe and specifies staying
owner-only, in which case this task shrinks to whatever the ruling actually authorizes (possibly
nothing).**

**⚠️ Do not start before task 63's approval and its recorded ADR exist.** This reverses a universal
hard rule and ADR-019's anti-laundering guarantee — building the relaxation before the authenticated
precondition is designed would open exactly the "agent launders its own work green" hole the gate
exists to close.

## What to build

*(Shape only — task 63's approved spec is the specification; if it ruled the relaxation unsafe or
asymmetric, build only what it authorized.)*

- The **authenticated precondition check** the design specified, added to the relaxed mover(s) in
  `claude/skills/fkit-task-done/SKILL.md` and/or `claude/skills/fkit-task-cancelled/SKILL.md`: the
  mover verifies the design's checkable signal (e.g. a closed review ledger with a passing verdict)
  **before** moving a file, and refuses otherwise.
- The **`⛔ Owner:` banner and skill text** updated to describe the new invocation contract (who may ask,
  under what precondition) — replacing the "runs only when the owner invokes it" wording per the ruling.
- The **CLAUDE.md universal hard rule** reworded to match the reversed decision — the "only via the
  owner-invoked mover / do not tell anyone else to" line no longer states the old absolute. Keep it a
  hard rule, now expressing the new authenticated-precondition boundary.
- **done vs cancelled exactly as ruled** — symmetric relaxation, or the weaker guard for cancelled the
  design chose.
- The **ADR-019 amendment** recorded (if task 63 left it to implementation).
- **Scaffold / dual-home parity:** the movers live in `claude/skills/`; confirm whether scaffold copies
  exist and keep parity (the task-48/49 lesson).
- Tests per [ADR-014](../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md)
  (`node --test`, zero devDeps) as the design specifies — at minimum, that a mover invocation **lacking
  the authenticated precondition refuses to move the file**.

## Verification steps

- Task 63's approved spec exists and this implementation matches it; forced deviations listed and
  justified in the coder's report.
- **A spawned mover invocation without the authenticated precondition refuses** — proven, not asserted
  (the highest-care check: this is the anti-laundering boundary).
- A spawned invocation **with** the precondition performs the move and updates the sprint plan + brief
  status exactly as the owner-invoked path does today (parity with tasks 34/35).
- CLAUDE.md, the two skill banners, and the ADR all state the same reversed contract — no artifact left
  asserting the old owner-only absolute.
- `npm test` (the project's real command — `node --test test/*.test.js`) is green.
- No change to `ai-agents/wiki-vault/` (a wiki sync is a separate task once the contract is final).

## Notes

- **Owner: fkit-coder.**
- **Depends on: task 63 — hard, including its owner-approval gate and the recorded reversal ADR.**
  Blocks: a follow-up wiki sync (scoped when this lands — the movers, CLAUDE.md, and the owner-gating
  story are all wiki-ingested).
- **Highest-care check:** the precondition refusal. Everything else is wiring; that one is the hard-rule
  boundary being redrawn.
- If task 63 ruled the relaxation unsafe and kept the movers owner-only, this task implements only what
  it authorized — do not build a relaxation the design rejected.
