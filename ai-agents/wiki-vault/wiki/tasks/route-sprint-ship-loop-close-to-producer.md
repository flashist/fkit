# Rewrite the `fkit-sprint-ship-loop` close step — driver self-close → spawn the producer

**Source**: `ai-agents/tasks/done/0123-route-sprint-ship-loop-close-to-producer/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID 0123 · owner `fkit-coder`

## Goal

The orchestrator half of the same reroute: the driver no longer closes shipped tasks directly — it **spawns `@fkit-producer` to close each one**. [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] §4, amending [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]].

## Key Changes

[[tasks/build-fkit-sprint-ship-loop-skill]] built the loop against **ADR-032-as-first-written**, where the driver ran `/fkit-task-done` itself. ADR-033 reverses that, and — exactly as for the coder loop — the rewrite must land **before** the mover grant is removed, or the direct call is hook-denied.

The change is deliberately narrow: one producer-spawn per shipped task added to the loop; the marker persists but is now attributed to the **spawned producer**, not the driver. Everything else in the §5 contract stays intact — task selection, the live owner-relay gate, the stop conditions, progress reporting, *"never self-cancel"*, and the **plan-gate honesty clause**, which the brief explicitly forbids "fixing" into a false structural guarantee.

## Outcome

**Done, agent-closed.** [[tasks/build-fkit-sprint-ship-loop-skill]] stays closed; this is the follow-on ADR-033 amends into.

**It found a fourth system prompt asserting the reversed posture** — `claude/agents/fkit-lead.md`, whose `/fkit-sprint-ship-loop` bullet still said the driver *"closes each task itself with the (agent-closed — not owner-verified) marker by default."* The owner ruled it into [[tasks/revert-task-movers-to-producer-only]]'s scope on a live ruling.

> **That find is the durable lesson.** The revert task's verification sweep greps for *"any role may invoke/close"* phrasing — which **cannot match** *"closes each task itself."* The sweep matches phrasing, not meaning, so a green sweep was **not** evidence for this line; it needed a by-hand check and its own verification step. **The second time that inventory was found incomplete.**

## Related
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — §4, the driver; and the standing "a grep is not an inventory" finding
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the amended contract
- [[tasks/build-fkit-sprint-ship-loop-skill]] — the shape being revised
- [[tasks/route-coder-ship-loop-close-to-producer]] — the coder-loop sibling
- [[tasks/revert-task-movers-to-producer-only]] — what this unblocks
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]]
- [[systems/fkit]]
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — ADR-025: Spawned agents may invoke `/fkit-task-done` and `/fkit-task-cancelled` — the owner-only gate is removed, and the anti-laundering guarantee is removed with it
- [[systems/role-locked-sessions]] — Role-Locked Sessions & the Skill Lockdown
