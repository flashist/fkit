# Amend the subagent-disconnect incident doc with technical corrections

**Source**: `ai-agents/tasks/cancelled/0016-amend-subagent-disconnect-incident-doc/brief.md`
**Status**: cancelled
**Sprint/Tag**: Sprint 1 — cancelled 2026-07-11

## Goal
Apply the architect's technical corrections (auth caveat, undocumented-endpoint risk note, and others) to the 2026-07-10 subagent-runner-disconnect incident write-up.

## Key Changes
Raised from the architect's review of `ai-agents/knowledge-base/incidents/2026-07-10-subagent-runners-disconnected.md` during the producer consult that also generated [[tasks/build-fkit-reconnect-tooling]].

## Outcome
**⛔ Cancelled (2026-07-11) — Omnigent removed.** It is an **Omnigent** subagent-runner incident, and the runtime it describes no longer exists.

⚠️ **Note the disposition changed after cancellation.** The cancellation note says the doc is *"archived to `history/` by Sprint 2 task 10."* **That did not happen, and correctly so** — [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]] established that **`history/` is for superseded *design docs* only**, and that **records don't go stale, designs do.** An incident **happened**; it does not become false when the system is removed. **The incident doc stays in `incidents/`.**

*Sweeping it into `history/` would have emptied `incidents/` on the day it was formalized* — the error ADR-013 was written to prevent.

## Related
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[systems/subagent-runner-connectivity]]
- [[tasks/build-fkit-reconnect-tooling]]
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[systems/knowledge-base-structure]]
