# Run the owner-involvement summarizer in `/fkit-task-done` before the move

## ID
0489

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

> ⛔ **Do not start without the owner's specific word.**
>
> ⛔ **Blocked by [`0485`](../0485-owner-reads-and-accepts-adr-053-before-any-owner-involvement-capture-is-built/brief.md)
> (B0) until ADR-053 is `accepted`.** The 2026-10-05 APPROVE of Phase B is not acceptance of the ADR.

## Context

**Where this comes from.** Brief **B3b** of the Phase-B split of the gated umbrella
[`0482`](../../done/0482-record-every-owner-question-and-decision-and-count-autonomous-tasks/brief.md)
(the close half of item 3, "the per-task line"). Design:
[ADR-053](../../../knowledge-base/decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log.md)
D8. **ADR-053 governs where it differs from `0482`'s `plan.md` § 3.**

**Why a separate brief.** This touches a **mover** — `/fkit-task-done`, which only the producer may
run (ADR-033) and whose execution rules are ADR-050's. Keeping it apart from `0488` lets the summarizer
ship and be tested before any mover changes, and keeps the mover change small and reviewable. **The
coder gets no mover** — the coder edits the SKILL's text; the producer runs it.

**Coordinate with ADR-052.** ADR-052 is moving tasks to the built-in board in phases, and changes how
the movers work. Check which phase has landed before editing `claude/skills/fkit-task-done/SKILL.md`; the
step must work in today's file-based flow and must not block the ADR-052 phases (ADR-053 D10).

## What to build

1. Add one step to `claude/skills/fkit-task-done/SKILL.md`, **before the move**: the producer runs
   `0488`'s summarizer for the task being closed. The script writes the line itself; the producer never
   retypes it.
2. **If the script cannot run**, the producer appends a fixed `unknown (summary-unavailable)` line —
   **given word for word in the SKILL** — and the close goes on. A failed summary never blocks a close.
3. The step adds nothing to the `(agent-closed — not owner-verified)` marker and never changes it
   (ADR-053 D12, ADR-049).
4. Decide, in the plan, whether `/fkit-task-cancelled` also runs it (a cancelled task is not counted by
   the metric, D9) — and say why. Default if in doubt: not added.
5. Update the close-out report shape in the SKILL to list the line written (or the fallback).
6. Refresh the `.claude/` copies via `claude/fkit-claude-init.sh .`. Nothing in the shared rules block.

## Verification steps

1. The SKILL's new step sits before the move and names the script by path; the fallback line appears in
   the SKILL word for word.
2. A fixture close (temp tree) with capture data ends with exactly one Owner-involvement line in the
   moved task's `worklog.md`; a second close-like run does not add a second line.
3. A fixture close where the script is missing or fails ends with the fixed
   `unknown (summary-unavailable)` line, and the move still completes.
4. The mover's existing tests (task-done, ADR-050 execution checks, reference integrity) pass.
5. The `(agent-closed — not owner-verified)` marker text and placement are unchanged.
6. Rules block size unchanged — `fkit-claude-init.sh`'s cap check passes with the same byte count.
7. No absolute machine path in any changed file.

## Notes
- **Depends on:** 0485, 0488
- **Blocks:** 0491
- **Parent:** [`0482`](../../done/0482-record-every-owner-question-and-decision-and-count-autonomous-tasks/brief.md);
  design in [ADR-053](../../../knowledge-base/decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log.md).
- **Bears on:** ADR-033 (producer-only movers), ADR-050 (how movers are executed), ADR-052 (board
  phases).
- **Not yet scheduled:** on the Backlog board; pulling it into a sprint is the owner's call.
- **Consulted:** none at filing.
- Filed 2026-10-05 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  APPROVE of `0482` Phase B items 1–5; it decides nothing beyond that APPROVE and ADR-053.
