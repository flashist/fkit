# Rewrite `fkit-sprint-ship-loop` close step — driver self-close → spawn the producer to close

## ID
0123

## Sprint
Sprint 2

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

[ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
§4 amends
[ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md):
the orchestrator no longer closes shipped tasks **directly** — it **spawns `@fkit-producer` to close
each one.** The evolved lead does not hold the movers.

Task 0111 built `claude/skills/fkit-sprint-ship-loop/SKILL.md` against **ADR-032-as-first-written**,
where the driver ran `/fkit-task-done` itself (0111 §5.2 Close row: *"the driver runs `/fkit-task-done`
itself and writes the agent-closed marker by default"*). ADR-033 reverses that. Once task 0124 removes
the movers from `lead`, that direct-close call is **hook-denied** — so this rewrite must land **before**
0124, exactly as 0122 must for the coder loop.

## What to build

Rewrite the Close step of `claude/skills/fkit-sprint-ship-loop/SKILL.md` (the §5.2 Close row + any
prose asserting the driver self-closes) per ADR-033 §4:

- The driver **no longer invokes `/fkit-task-done` itself.** It **spawns `@fkit-producer`** to close
  each shipped task — one producer-spawn per task added to the loop (ADR-033 §4 / §Consequences).
- The agent-closed marker persists: a producer **spawned** by the loop still writes
  `✅ Done (agent-closed — not owner-verified)` (ADR-033 §5). The marker's owner is now the spawned
  producer, not the driver.
- Keep the rest of the §5 contract intact — task selection, the live owner-relay gate (§5.3), stop
  conditions, progress reporting, and the **plan-gate honesty clause** (still prose-enforced, not a
  structural wall — do not "fix" it into a false guarantee).
- **Never self-cancel** stays as-is; a cancel still stops and asks.

## Verification steps

1. The sprint-ship-loop Close step contains **no** `/fkit-task-done` invocation by the driver.
2. It spawns `@fkit-producer` to close each shipped task; the added per-task producer-spawn is explicit.
3. The agent-closed marker is stated as written by the spawned producer, not the driver.
4. The rest of the §5 contract (relay gate, stop table, reporting, plan-gate honesty clause) is
   unchanged; no false structural guarantee is introduced.

## Notes

- **Owner:** fkit-coder.
- **Depends on: nothing.** (0111, the skill, is already Done.)
- **Blocks:** 0124.
- **Sequencing:** land this **before** 0124 — the sprint loop must reroute to a producer spawn before
  `lead` loses the mover, or the loop is hook-denied.
- **This revises 0111's built shape** (ADR-032-as-first-written direct-close) to ADR-033's spawn-the-
  producer shape. 0111 stays closed; this is the follow-on ADR-033 amends into.
- No commit — leave the edit in the working tree.
