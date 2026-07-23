# Rewrite `fkit-task-ship-loop` step 9 — self-close → route the close to the producer

## ID
0122

## Sprint
Sprint 2

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

[ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
reverses ADR-025: **only `fkit-producer` may run the task movers.** ADR-033 §3 amends
[ADR-019](../../../knowledge-base/decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)
§Decision 5 — the coder ship-loop's terminal act is no longer a self-close.

Today `claude/skills/fkit-task-ship-loop/SKILL.md` step 9 ends the loop by invoking `/fkit-task-done`
itself (the ADR-025 self-close). Once the mover-authority revert lands (task 0124), the coder identity
no longer owns `fkit-task-done`, so that call is **hook-denied** at run time. Step 9 must be rewritten
to **route the close to the producer** *before* 0124 removes the grant — hence this task ships first.

This changes only the loop's terminal act; **ADR-019's plan gate is untouched.**

## What to build

Rewrite `claude/skills/fkit-task-ship-loop/SKILL.md` step 9 (the close step) per ADR-033 §3:

- The loop **no longer invokes `/fkit-task-done`.** Its terminal act becomes routing the close to the
  producer — spawn `@fkit-producer` to close the finished task, or hand the close to the owner.
- Remove/adjust any prose that asserts the coder self-closes and writes the agent-closed marker itself
  (the ADR-025 posture). The agent-closed marker still applies — but it is now written by the
  **producer** the loop routes to, not by the coder loop.
- State plainly that autonomous shipping now **ends at a producer hand-off, not a green board**
  (ADR-033 §Consequences — the narrowed-autonomy cost, stated honestly, not hidden).

## Verification steps

1. `fkit-task-ship-loop/SKILL.md` step 9 contains **no** `/fkit-task-done` invocation by the coder.
2. The step routes the close to the producer (spawn `@fkit-producer`) or to the owner, and says so.
3. The skill text no longer claims the coder writes the close/agent-closed marker itself; it states the
   loop's terminal act is a producer hand-off.
4. No source-code / control-flow change beyond the skill text; the plan gate is unchanged.

## Notes

- **Owner:** fkit-coder.
- **Depends on: nothing.**
- **Blocks:** 0124.
- **Sequencing:** land this **before** 0124 (the mover revert) — the coder loop must stop invoking a
  mover before the grant is removed, or the loop is hook-denied.
- **ADR-033 §3** is the driver; the plan gate (ADR-019) stays exactly as it is.
- No commit — leave the edit in the working tree.
