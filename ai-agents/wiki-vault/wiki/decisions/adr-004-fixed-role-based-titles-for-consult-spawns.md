# ADR-004: Fixed, role-based titles for ad hoc consult spawns (`<target-agent>-consult`)

**Date**: 2026-07-10
**Status**: accepted

## Context
The fkit agents that spawn consult children all shared the same generic titling instruction: derive a short, topic-summarizing title for each consult session.

Because Omnigent reuses a child conversation when the `(parent_conversation_id, title)` pair matches, topic-derived titles caused every new question to the same target agent to create a fresh child session instead of continuing one thread. In practice that produced unbounded noise in the Web UI's agents panel.

The same pattern had already been solved one level up for the standing `fkit-team` roster, which uses fixed role-based titles so reruns continue the same session instead of duplicating it.

## Decision
Every fkit agent that spawns a consult child uses a fixed, reusable role-based title of the form `<target-agent>-consult`, reused across all topics and questions to that target within the spawning session.

The naming scheme is `<target-agent>-consult` with no spawner prefix. The child session is already scoped by the caller's parent conversation, so separate spawners can safely reuse the same title for the same target role.

## Consequences
- The agents panel gains at most one consult child per spawner-target pair instead of growing without bound.
- Consult threads now accumulate context across topics, which is a deliberate tradeoff for stable naming and lower panel noise.
- A spawner can no longer hold two independent in-flight consult threads with the same target agent at the same time.
- If long-lived consult threads start to balloon in context or answer from stale context, revisit with a rotation scheme rather than reverting to per-topic titles.

## Related
- [[systems/fkit]]
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
