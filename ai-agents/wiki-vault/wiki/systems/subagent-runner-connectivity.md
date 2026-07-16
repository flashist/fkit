# Subagent Runner Connectivity

**Layer**: shared
**Key files**: `ai-agents/knowledge-base/incidents/2026-07-10-subagent-runners-disconnected.md`

> ## 🕰️ HISTORICAL — the system this page describes no longer exists.
> Every mechanism below was **Omnigent's**: the durable root `fkit-team` session, its teammate tree,
> the REST session endpoints, and the `omnigent/fkit-reconnect.sh` / `omnigent/fkit-team-restart.sh`
> stopgaps. **All of it was deleted in Sprint 2** with the Omnigent runtime
> ([[decisions/adr-009-claude-code-native-is-the-only-runtime]]). `fkit reconnect` and
> `fkit restart-team` are now **retired verbs that fail loudly**.
>
> **Kept, not deleted, because it is load-bearing history**: these failures — sub-sub-agents failing
> to reply to their spawners, dropped sessions, disconnected runners — are **the original driver for
> leaving Omnigent**. The reconnect/restart tooling existed *only* to paper over them.
>
> A Claude-native role session is just `claude --agent fkit-<role>`; there is no runner tree, no root
> session, and nothing to reconnect. **The problem class is gone, not fixed.** See [[systems/fkit]].

## Summary
Under Omnigent, fkit teammate sessions were durable child conversations, but the runner process behind a session could die independently of the stored session row. When that happened the child could remain present server-side while the UI and the agent-facing listing tools stopped showing it as connected.

The 2026-07-10 incident showed that **all six standing teammates could lose their runners at once**, and that recovery was operational rather than automatic: discover the affected child sessions, resume each one, and verify the runner came back online.

## Architecture (as it was)
The root `fkit-team` session owned the teammate tree. Recovery walked that tree recursively, skipped deliberately closed consult children, checked each remaining node with the authoritative session lookup, and restarted only the nodes whose runner state reported disconnected.

The stopgap reconnect flow depended on Omnigent's internal session REST endpoints and on `omnigent run <config> --resume <conv_id>`. Success was judged from server state (`status: idle` / `runner_online: true`), **not** from the reconnect process' foreground exit code.

## Gotchas / Known Issues (as they were)
- `sys_session_list` and `sys_agent_list` did not surface the child sessions during the incident, even though the backing sessions still existed.
- The foreground `omnigent run --resume` process could throw a non-TTY `OSError` **after** the reconnect had already succeeded; that traceback was noise, not failure.
- Children labeled `omnigent.closed: "true"` were intentionally ended consult sessions and must never be reconnected.
- The direct REST dependency was always a **stopgap** — and it never stopped being one. The platform never exposed reconnect and tree visibility on the agent-facing surface; fkit left the platform instead.

## Legacy in the current codebase
Two things in today's code only make sense because of this:
- **`fkit reconnect` and `fkit restart-team` fail loudly** rather than being silently dropped — they were real commands. See [[systems/install-and-self-update]].
- **`fkit --resume` still exists** as scar tissue from Omnigent's durable-session model, and it is a live defect: it resumes *any* session under the **lead's** lockdown. Its removal is tracked in Sprint 2.

## Related
- [[systems/fkit]]
- [[systems/install-and-self-update]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[tasks/build-fkit-reconnect-tooling]]
- [[tasks/amend-subagent-disconnect-incident-doc]]
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]
- [[decisions/adr-008-claude-code-native-port-alongside-omnigent]]
- [[tasks/delete-omnigent-directory]]
- [[tasks/formalize-knowledge-base-incidents-folder]]
- [[tasks/rollout-adr-004-fixed-consult-titles]]
- [[tasks/remove-fkit-resume-passthrough]]
- [[tasks/wiki-sync-post-omnigent]]
