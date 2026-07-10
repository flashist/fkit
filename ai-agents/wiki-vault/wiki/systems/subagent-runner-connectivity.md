# Subagent Runner Connectivity

**Layer**: shared
**Key files**: `omnigent/fkit.sh`, `omnigent/fkit-team/config.yaml`, `omnigent/fkit-reconnect.sh`, `ai-agents/knowledge-base/incidents/2026-07-10-subagent-runners-disconnected.md`

## Summary
fkit teammate sessions are durable child conversations, but the runner process behind a session can die independently of the stored session row. When that happens, the child can remain present server-side while the UI and the agent-facing listing tools stop showing it as connected.

The 2026-07-10 incident showed that all six standing teammates can lose their runners at once and that the recovery path is operational rather than automatic: discover the affected child sessions, resume each one, and verify that the runner comes back online.

## Architecture
The root `fkit-team` session owns the teammate tree. Recovery walks that tree recursively, skips deliberately closed consult children, checks each remaining node with the authoritative session lookup, and then restarts only the nodes whose runner state reports disconnected.

The stopgap reconnect flow depends on Omnigent's internal session REST endpoints and on the CLI's `omnigent run <config> --resume <conv_id>` command. Success is judged from server state (`status: idle` / `runner_online: true`), not from the reconnect process' foreground exit code.

## Gotchas / Known Issues
- `sys_session_list` and `sys_agent_list` did not surface the child sessions during the incident, even though the backing sessions still existed.
- The foreground `omnigent run --resume` process can throw a non-TTY `OSError` after the reconnect has already succeeded; that traceback is noise, not failure.
- Children labeled `omnigent.closed: "true"` are intentionally ended consult sessions and must never be reconnected.
- The direct REST dependency is a stopgap until the platform exposes reconnect and tree visibility on the agent-facing surface.

## Related
- [[systems/fkit]]
- [[tasks/build-fkit-reconnect-tooling]]
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
