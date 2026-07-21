# Reconcile the skill-ownership source of truth

## ID
0063

## Sprint
Sprint 2

## Priority
6 (Phase 3 — independent, can run in parallel with Phases 0–2)

## Status
✅ Done

## Context

Per the Omnigent-removal plan
([`2026-07-11-plan-omnigent-removal.md`](../../../knowledge-base/reports/2026-07-11-plan-omnigent-removal.md)
§Phase 3) and [ADR-010](../../../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md)
§5.

Skill ownership per role is currently declared in **two places that disagree**:

1. `skills_for_role()` in `claude/fkit-claude.sh:75-86` — drives `--settings` / `skillOverrides` for
   **interactive sessions**.
2. The `skills:` frontmatter in `claude/agents/*.md` — governs **spawned consults**.

They already diverge: the shell grants every role `fkit-team`; **six of seven agent files omit it.**
Because the two govern *different* code paths, this disagreement is not currently breaking anything —
which is exactly why it is worth closing now, while it is cheap and boring, rather than after it has
quietly diverged into a real bug. The skill lockdown is the Claude flavor's **central invariant**
(ADR-010): two sources of truth for an invariant is one too many.

## What to build

Make `skills_for_role()` (`claude/fkit-claude.sh`) the **single** source of truth. Then either:

- **Generate** the `skills:` frontmatter in `claude/agents/*.md` from it (a small script, run as part
  of the existing sync/init flow, with a drift check), **or**
- **Drop** the `skills:` frontmatter entirely, if spawned consults can resolve their skill set from
  the same shell-side definition.

**Pick one and state why.** The architect did not prescribe which — it is a genuine implementation
call, and it hinges on how the consult spawn path actually resolves skills. Establish that first,
from the code, before choosing.

Whichever path is taken, reconcile the **existing** disagreement: decide whether every role really
should have `fkit-team` (the shell says yes; the agent files mostly say no), and make both paths
agree with the answer.

## Verification steps

- For **each** of the 7 roles: start a session and confirm the `/` menu shows exactly the skills that
  role owns — and that a skill it does *not* own is **not runnable even by explicit name**. The
  lockdown is only real if it holds on both.
- Spawn a **consult** to a role and confirm it has the same skill set there as in an interactive
  session. This is the divergence the task exists to close — test it directly.
- If a generator was built: mutate `skills_for_role()`, re-run it, confirm the frontmatter follows and
  the drift check catches a hand-edit.

## Notes

- Owner: **fkit-coder**.
- **Independent of Phases 0–2** — this can be picked up in parallel, at any time in the sprint. It is
  the one task here with no ordering constraint.
- Risk: **low.**
