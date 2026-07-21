# Roll out ADR-004's fixed consult titles

**Source**: `ai-agents/tasks/done/0085-rollout-adr-004-fixed-consult-titles/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 1 → closed as Done during Sprint 2 disposition

## Goal
Implement [[decisions/adr-004-fixed-role-based-titles-for-consult-spawns]]: every agent spawning a consult child uses a **fixed, reusable, role-based title** (`<target-agent>-consult`) instead of a fresh topic-derived one per question.

## Key Changes
Topic-derived titles were flooding the Web UI's agents panel with one-off entries (`adversarial-reviewer auto-spawn mechanism`, `reconnect-tooling-conventions`) and producing hard-to-parse names — **because Omnigent reused a child conversation only when the `(parent_conversation_id, title)` pair matched**, so a new title meant a new session every time.

ADR-004 deliberately deferred implementation to a follow-up task — *"the producer's task-lifecycle responsibility."* This was that task.

## Outcome
**Closed as Done during the Sprint 1 disposition — already complete in code**, verified by the doc-drift audit.

⚠️ **Its subject then disappeared.** [[decisions/adr-004-fixed-role-based-titles-for-consult-spawns]] is now **superseded**: it governs `sys_session_create` consult spawns, **an Omnigent mechanism that no longer exists.** Claude Code consults run through the Agent tool — no titled child sessions, no agents panel to flood.

**A completed task whose value was erased by a runtime decision three days later.** It is recorded, not deleted, because it is part of the record of what the panel-noise investigation actually cost.

## Related
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-004-fixed-role-based-titles-for-consult-spawns]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[systems/subagent-runner-connectivity]]
