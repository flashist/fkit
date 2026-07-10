# Incident: fkit subagent runners disconnected (all 6 teammates)

- **Date:** 2026-07-10
- **Reporter:** fkit-team (root session), on behalf of the project owner
- **Severity:** Medium — no data loss, but the entire fkit team was unusable from the Subagents
  panel until manually recovered via CLI/API workarounds not available to a normal user.
- **Status:** Recovered manually. Root cause of the runner death itself is **not** confirmed —
  see "Open question" below. This doc is written to hand to the Omnigent tech team as a task
  input, not as a closed postmortem.

## Summary

All six fkit teammate sessions (`producer`, `coder`, `reviewer`, `architect`, `wiki`,
`adversarial-reviewer`), each a child session of the `fkit-team` root, showed as **disconnected**
in the Subagents panel. Standard listing tools (`sys_session_list`, `sys_agent_list`) reported
**zero** child sessions for the root, even though the sessions demonstrably still existed
server-side.

**Correction (added after initial write-up):** the per-session reconnect command itself is a
**first-party, product-surfaced feature**, not something reverse-engineered. Opening a
disconnected session's chat in the panel shows a small "Agent disconnected — click to reconnect"
notification; clicking it opens a dialog with a ready-to-copy `omnigent run <agent.yaml> --resume
<conv_id> --server <url>` command — exactly the command used in recovery below. The real friction
was narrower than "the UI is silent": (a) that notification is only visible per-session, so you
only see it if you happen to open that specific disconnected child's chat; (b) there is no
in-app view enumerating *all* disconnected children at once, which is why recovery still fell back
to querying the undocumented `/v1/sessions/{id}/child_sessions` REST endpoint directly to find the
other five; and (c) reconnecting still requires leaving the app to run the copied command in an
external terminal — no in-app one-click action.

## Impact

- All 6 fkit teammates were unreachable from the panel; the human could not click into any of
  them to work.
- The root `fkit-team` session's own tools (`sys_session_list`, `sys_agent_list`) could not see
  or enumerate the children at all, so it also could not self-heal or even report *which*
  sessions existed — it could only prove they existed indirectly, via a `409 already_exists` on
  `sys_session_create` (unique constraint on `(parent_conversation_id, title)`).
- Recovery required an out-of-band CLI command and a raw HTTP call to a private server API
  (`/v1/sessions/{id}/child_sessions`) that isn't exposed through any MCP tool.

## Timeline (session-relative)

1. Six teammates were originally created successfully in an earlier turn (`sys_session_create`
   per teammate, all returned running sessions).
2. On a later turn, user reports: "All subagents are disconnected, can you reconnect to them?"
3. `sys_session_list` (both the `sub_agents` and global `sessions` views) returns **empty** —
   no trace of any of the six children, despite the root session being their
   `parent_conversation_id`.
4. `sys_agent_list` → `session_agents` also only shows the root session itself, not the six
   children.
5. Retrying `sys_session_create` for each teammate (attempting to recreate them) fails with
   `409 already_exists` / `UNIQUE constraint failed: conversations.parent_conversation_id,
   conversations.title` — proving the six session rows still exist in the backing store, they're
   just not being surfaced by the listing tools.
6. User supplies one concrete data point: a CLI resume command they had available
   (`omnigent run path/to/agent.yaml --resume <conv_id> --server http://127.0.0.1:6767`) for the
   `adversarial-reviewer` session.
7. Using that `conv_id` directly against `sys_session_get_info`, the session is confirmed to
   exist with `status: "failed"`, `runner_online: false` — i.e. its runner process had died and
   was never replaced.
8. Running `omnigent run .fkit/agents/fkit-adversarial-reviewer/config.yaml --resume <conv_id>
   --server http://127.0.0.1:6767` (backgrounded via `nohup ... &`, stdin from `/dev/null`)
   spawns a fresh runner process, reattaches to the existing conversation, replays the standby
   prompt, and the harness responds "Ready and standing by." `sys_session_get_info` afterward
   shows `status: "idle"`, `runner_online: true`.
9. The foreground REPL wrapper process itself then **crashes** with an unhandled
   `OSError: [Errno 22] Invalid argument` inside `prompt_toolkit`'s `vt100.py` input-attach path
   (`selector_events.py: self._selector.register(fd, ...)`), because stdin is not a real TTY in
   this backgrounded/headless invocation. This crash is **cosmetic** for the purpose of
   reconnecting — the actual harness runner subprocess (`omnigent.runtime.harnesses._runner`,
   pid confirmed via `pgrep`) is a separate process and survives the parent REPL's crash,
   remaining attached to the session.
10. To find the other five teammates' `conv_id`s (not given by the user), the server's internal
    REST API was queried directly: `curl http://127.0.0.1:6767/v1/sessions/<root_id>/child_sessions`.
    This endpoint — undocumented from the tool surface, discovered only via
    `/openapi.json` — correctly listed all six children with their `id`, `title`, and
    `current_task_status` (five of six showed `"failed"`).
11. The same `omnigent run <agent_config> --resume <conv_id> --server ... &` pattern was repeated
    for the remaining five teammates. All five came back `status: "idle"`, `runner_online: true`.
12. `sys_session_list` / `sys_agent_list` from the root session **still** show zero children even
    after full recovery — this listing gap persists regardless of connectivity state, so it looks
    like a separate bug rather than a symptom of the disconnect itself.

## Confirmed facts

- The six child sessions never disappeared from the server's backing store; only their runner
  processes went away (`runner_online: false`, `status: "failed"`).
- `sys_session_list` and `sys_agent_list`, called from the parent session, do not return child
  sessions **at all** — not filtered by status, just absent — even though
  `/v1/sessions/{id}/child_sessions` on the same server returns them correctly. This looks like a
  bug in those two MCP tools' query (or in what they're allowed to see), independent of the
  disconnect.
- Recovery is possible and non-destructive: `omnigent run <agent.yaml> --resume <conv_id>
  --server <url>` reattaches a new runner to the existing conversation without losing history
  (the standby prompt/response history was intact after reconnect).
- The reconnect command's foreground REPL requires a real TTY; run without one (e.g.
  backgrounded, from another agent's shell tool, in CI, etc.) it throws an unhandled
  `OSError` in `prompt_toolkit`'s input attach path. The underlying runner process is unaffected,
  but this makes the CLI's own crash output misleading (it looks like the reconnect failed when
  it actually succeeded).
- There is no MCP tool available to a session (root or otherwise) that (a) reports a child
  session's connectivity/runner status directly without already knowing its `conv_id`, or (b)
  triggers a reconnect. Both had to be done by shelling out to the `omnigent` binary and to a raw
  server HTTP endpoint.
- The reconnect *command* itself is not a workaround — it's the exact command the panel UI's own
  "Agent disconnected" dialog gives you, per session. The workaround is only in (a) discovering
  *which* sessions are disconnected in bulk (no in-app aggregate view — fell back to the
  undocumented `child_sessions` endpoint) and (b) having to run that command in an external
  terminal rather than in-app.

## Open question — not yet root-caused

**Why did all six runner processes die at roughly the same time / go unnoticed until the human
happened to check?** Candidates, none confirmed from information available in this session:

- A host-level restart or resource pressure event that killed all runner processes for this
  host (`host_b4c1e10dd3c3426eb265593cd4c65eb1`) at once — six near-simultaneous, correlated
  failures is more consistent with a shared-host event than six independent crashes.
- An idle-timeout or reaper on the server/runner side that tears down runner processes for
  sessions with no recent activity, without automatically respawning them on next use.
- A crash/bug in the specific harness runner module (`omnigent.runtime.harnesses._runner`) itself.

This needs the tech team to check runner/server logs around the failure window
(`~/.omnigent/logs/`, and any host-side supervisor logs) for the six sessions' `runner_id`s
noted below, to distinguish these.

## Session IDs and runner IDs involved (for log correlation)

| teammate | conversation_id | pre-incident runner_id (dead) | post-recovery runner_id |
|---|---|---|---|
| producer | `conv_089f45ae94f54924b754533958c5c325` | unknown — not queried before recovery | `runner_token_9480413c4930e4641739d98a6651e5d7` |
| coder | `conv_ca32ad6968604f30b63ecd37807637a3` | unknown | `runner_token_77ef24c1bf02fe4d0849f241e69592d1` |
| reviewer | `conv_442f0188d6e744ee9b086a24739b7bbe` | unknown | `runner_token_05d42f71c77fdcbe6b5e59d9632ab3fa` |
| architect | `conv_a168ece2d45841a2ad361c3715f6256f` | unknown | `runner_token_f41019285ca76190932407fe953294bb` |
| wiki | `conv_5f7f629fe9ff43669ed8112a28b82a48` | unknown | `runner_token_462b3a658e9defbd36e692245b3fb8a8` |
| adversarial-reviewer | `conv_ca367e02cdcc481bb435ea09d7de2f7b` | `runner_token_53a2105b892955c343cd254bcd38dedd` | `runner_token_21f5ac41e60dc605c6de8499dfb41941` |
| fkit-team (root, unaffected) | `conv_a3ca846e126b4a7fbb45dae5da0221c6` | `runner_token_3115901cd693b91e0d2124d951a7cb9b` (stayed online throughout) | same |

Local server: `http://127.0.0.1:6767`, `host_id: host_b4c1e10dd3c3426eb265593cd4c65eb1`.
Recovery performed 2026-07-10, session-relative timestamps ~`updated_at: 1783666617` epoch
seconds onward per the `child_sessions` API.

## Ask for the tech team

1. **Root-cause the runner deaths.** Pull server/runner/host logs for the runner_ids above
   (pre-incident column) around their last-alive timestamps and determine whether this was a
   host-wide event, an idle reaper, or a runner crash. Six correlated failures on one host
   strongly suggests a shared cause, not six unrelated bugs.
2. **Add auto-reconnect / self-healing.** A session whose runner dies should not require a human
   to notice, dig up its `conv_id`, and manually run a CLI reconnect. At minimum: detect
   `runner_online: false` and either auto-respawn the runner, or surface a clear, actionable
   "disconnected — reconnect available" state to both the panel and to the parent session's
   tools (rather than the session silently vanishing from listings).
3. **Fix child-session visibility.** `sys_session_list` (`sub_agents` view) and `sys_agent_list`
   (`session_agents`) return **zero** entries for a parent's children, in every state observed
   (both while disconnected and after full recovery) — while the server's own
   `/v1/sessions/{id}/child_sessions` REST endpoint correctly lists them the whole time, and the
   panel UI independently proves per-session connectivity data exists (it renders the
   "disconnected — reconnect" notification per child). So this is confirmed **not** a
   data-availability gap — the server clearly has and uses this data elsewhere — it's specifically
   that these two agent-facing MCP tools don't surface it. Either these tools should be backed by
   the same data the REST endpoint and panel use, or document why they intentionally differ.
   Relatedly: there is also no in-app view that enumerates *all* disconnected children of a session
   at once (only the per-child notification) — worth folding in as a UI ask alongside this one.
4. **Expose the existing reconnect capability to the agent/tool surface, and add a bulk view.**
   Correction from the initial write-up: the reconnect *command* itself is already a first-party
   product feature (panel notification → dialog → ready-to-copy `omnigent run --resume` command),
   not something to build from scratch. What's actually missing is (a) a way for a **parent
   session's own tools** to detect a disconnected child and trigger/request that same reconnect
   without a human copying a command into an external terminal, and (b) a way to see/act on **all**
   disconnected children at once instead of discovering them one disconnected-chat-notification at
   a time (today's fallback for "all at once" is the undocumented `/v1/sessions/{id}/child_sessions`
   endpoint). Scope is narrower than originally asked — promote/aggregate an existing feature,
   not invent reconnect logic — but still requires product/tool-surface changes outside fkit's
   repo.
5. **Fix (or suppress) the non-TTY crash on `omnigent run --resume`.** When stdin isn't a real
   terminal, the REPL should either run headless cleanly or fail with a clear message — not an
   unhandled `OSError` traceback from `prompt_toolkit` that makes a *successful* reconnect look
   like a failure.

## Recovery recipe (for reference, until item 4 above ships)

> Caveat: this recipe (and the `curl` call in particular) implicitly assumes a **local,
> unauthenticated dev server** (`127.0.0.1:6767`). Don't copy it against a non-local deployment
> without first confirming whether the server requires auth. It also depends on the **undocumented**
> `/v1/sessions/{id}/child_sessions` endpoint (no published API contract, found only via
> `/openapi.json`) purely for bulk discovery of disconnected children — the reconnect command itself
> is first-party (see Summary correction above); only the "find all of them at once" step relies on
> this private endpoint. Treat that dependency as fragile and retire it once ask #4 ships.

```bash
# 1. Find child session ids + status from the parent session id:
curl -s "http://<server>/v1/sessions/<parent_conv_id>/child_sessions" | python3 -m json.tool

# 2. For each disconnected child (runner_online: false / status: failed), reconnect:
nohup omnigent run <path/to/agent-bundle>/config.yaml \
  --resume <child_conv_id> \
  --server http://<server> \
  < /dev/null > /tmp/reconnect-<title>.log 2>&1 &
disown

# 3. Verify:
# sys_session_get_info(session_id=<child_conv_id>) should show status: "idle", runner_online: true
```
