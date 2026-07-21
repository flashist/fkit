# Build `fkit reconnect` tooling for disconnected subagent runners

**Source**: `ai-agents/tasks/done/0021-build-fkit-reconnect-tooling/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 1

## Goal
Codify the manual recovery recipe for disconnected fkit teammate runners so a repeat incident does not require rediscovering the reconnect sequence under pressure.

## Key Changes
- Added a client-side `fkit reconnect` stopgap for human operators.
- Kept the solution scoped to the repo's shell tooling instead of trying to patch the upstream Omnigent runtime.
- Used the runner-disconnect incident as the source of truth for the recovery steps and the known platform bugs.

## Outcome
The team now has a repeatable reconnect command for disconnected runners while the upstream Omnigent bugs remain external to this repo. The task is explicitly a bridge, not the permanent fix.

## Related
- [[systems/subagent-runner-connectivity]]
- [[systems/fkit]]
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[tasks/amend-subagent-disconnect-incident-doc]]
