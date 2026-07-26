# Rewrite `fkit-task-ship-loop` step 9 — self-close → route the close to the producer

**Source**: `ai-agents/tasks/done/0122-route-coder-ship-loop-close-to-producer/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID 0122 · owner `fkit-coder`

## Goal

Change the coder ship-loop's **terminal act** from closing its own task to handing the close to the producer — [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] §3, amending [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] §Decision 5.

## Key Changes

**The sequencing is the whole point.** Step 9 previously invoked `/fkit-task-done` itself — the ADR-025 self-close. Once [[tasks/revert-task-movers-to-producer-only]] removes the grant, the coder identity no longer owns that skill and the call is **hook-denied at run time**. So the loop had to be rerouted **first**; this task ships before the revert.

The rewrite: the loop no longer invokes the mover; its terminal act is spawning `@fkit-producer` to close, or handing the close to the owner. Prose asserting the coder writes the marker itself was removed — the marker still applies, but the **producer** writes it now. And the cost is stated, not hidden: **autonomous shipping now ends at a producer hand-off, not a green board.**

**ADR-019's plan gate is untouched.** Only the loop's last step changed.

## Outcome

**Done, agent-closed.** The loop routes to a producer spawn.

**It also surfaced a contradiction no filed brief owned.** The review (finding R4, raised by Codex and verified against both files) found a **hard rule** in the coder's *and* producer's system prompts — *"a consult is a focused question, not a hand-off"* — that forbids exactly the producer-spawn-to-close ADR-033 makes the sanctioned terminal act. A system prompt outranks a SKILL in an agent's own context, so leaving it would put a hard rule in tension with the very step it authorizes. The owner ruled it into [[tasks/revert-task-movers-to-producer-only]]'s scope as a **carve-out, not a deletion** — the rule still holds for every other consult.

⚠️ **A recorded process deviation:** the producer used `git mv`, which **staged** the brief's rename, so the index was no longer clean despite "nothing committed." Harmless and arguably desirable (it preserves rename detection), but flagged so the owner knew their index had been touched.

## Related
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — §3, the driver
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — §Decision 5 amended; plan gate unchanged
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the self-close being unwound
- [[tasks/route-sprint-ship-loop-close-to-producer]] — the same change for the sprint loop
- [[tasks/revert-task-movers-to-producer-only]] — what this unblocks, and where its R4 carve-out landed
- [[tasks/implement-task-ship-loop-skill]] · [[tasks/design-task-ship-loop-skill]]
- [[systems/fkit]] · [[systems/review-and-model-diversity]]
- [[systems/role-locked-sessions]] — Role-Locked Sessions & the Skill Lockdown
