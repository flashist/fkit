# Implement the ship-loop timeout-auto-proceed from the approved design

## Sprint
Sprint 2

## Priority
60

## Status
⛔ Cancelled (2026-07-18) — parent design task 59 declined per ADR-024; feature not built, so no implementation

## Context

**Task 59 designs the timeout-auto-proceed for the ship-loop's owner questions and gets the owner's
ruling** — including the feasibility verdict (can the runtime fire a ~30s timeout-then-default at all)
and the gate scope. This task builds exactly that approved design into
`claude/skills/fkit-task-ship-loop/SKILL.md` and records the ADR-019 amendment if task 59 didn't.
Scoped now at shape level (the 52/53, 55/56 pattern); **task 59's approved spec governs and wins
wherever it differs — including the possibility that it rules the literal timer infeasible and
specifies an alternative instead.**

**⚠️ Do not start before task 59's approval and feasibility verdict are recorded.** The feature rests
on an unverified runtime capability; building a 30s auto-proceed the runtime cannot actually fire
would ship a promise that silently never triggers — worse than the current honest block.

## What to build

*(Shape only — task 59's approved spec is the specification; if it ruled the timer infeasible, build
the approved alternative instead.)*

- The owner-question behavior in `claude/skills/fkit-task-ship-loop/SKILL.md`, per the approved
  contract: options presented with one marked **recommended**, and — where the design ruled it applies
  — auto-proceed on the recommended option after the approved timeout, **logging every auto-pick in the
  `worklogs/<task-id>.md` decision-log** (same treatment as an "obvious winner").
- **Gate scope exactly as ruled:** the **done-gate stays a hard owner stop** (no timeout — the
  owner-invoked mover rule / D1); the plan-gate per the ruling (excluded by default); the mid-loop
  important-questions as the target.
- The **ADR-019 amendment** recorded (if task 59 left it to implementation), noting the claim-level
  shift to autonomous judgment-defaults.
- Any dual-home / scaffold copy the skill has (check — the ship-loop skill lives in `claude/skills/`;
  confirm whether a scaffold copy exists and keep parity per the task-48/49 lesson).
- Tests per ADR-014 (`node --test`, zero devDeps) as the design specifies — at minimum, that the
  done-gate is **not** subject to auto-proceed.

## Verification steps

- Task 59's approved spec exists and this implementation matches it; forced deviations listed and
  justified in the coder's report.
- **The done-gate never auto-proceeds** — proven, not asserted (the highest-care check: an
  auto-advanced done-gate would move a task toward Done without the owner).
- The recommended-option + timeout (or the approved alternative) behaves as ruled, and every
  auto-proceed is logged in the worklog decision-log.
- `npm test` (the project's real command — `node --test test/*.test.js`) is green.
- The skill's argument contract remains one-skill-one-output (a configurable timeout, if any, is an
  operand, not an output variant).
- No change to `ai-agents/wiki-vault/` (a wiki sync is a separate task once the behavior is final).

## Notes

- **Owner: fkit-coder.**
- **Depends on: task 59 — hard, including its owner-approval gate and feasibility verdict.**
  Blocks: a follow-up wiki sync (scoped when this lands).
- **Highest-care check:** the done-gate exclusion. Everything else is behavior tuning; that one is a
  hard-rule boundary.
- If the design ruled the timer infeasible, this task implements the approved **alternative** (e.g. an
  up-front proceed-on-defaults grant) — not a non-firing timer.
