# ADR-004: Fixed, role-based titles for ad hoc consult spawns (`<target-agent>-consult`)

**Date**: 2026-07-10
**Status**: superseded

> ## ⚠️ Superseded — Omnigent removed ([[decisions/adr-009-claude-code-native-is-the-only-runtime]]).
> This ADR governs the titling of `sys_session_create` consult spawns — **an Omnigent mechanism that
> no longer exists.** Claude Code consults run through the Agent tool, with no titled child sessions
> and no agents panel to flood. The rollout task ([[tasks/rollout-adr-004-fixed-consult-titles]]) was
> nonetheless closed as **Done** — it was already complete in code when Omnigent was removed.

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
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]
