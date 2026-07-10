# Verification: fkit-team "restart" skill (OPTION 1 — resume semantics)

- **Date:** 2026-07-10
- **Requested by:** coder (consult), verifying the process-kill mechanism for a new "restart"
  skill against the installed `omnigent` CLI (v0.4.0,
  `/Users/mark.dolbyrev/.local/share/uv/tools/omnigent/lib/python3.12/site-packages/omnigent`).
- **Status:** Process-kill mechanics (A–D below) verified safe. **But a blocking finding
  invalidates the design's premise — see "Critical finding" first.** Recommend owner sign-off
  before the coder implements anything.

## Critical finding — `--resume` does not re-read config.yaml/skills from disk

The stated goal of OPTION 1 is "kill the runner and relaunch with `--resume <conv_id>` so it
re-reads config.yaml/skills off disk." Tracing the actual upload path shows this is **false** for
an existing conversation:

- `chat.py:1722` `_chat_via_daemon` always rebuilds the bundle from the local path
  (`bundle_bytes = _bundle_agent(spec_path)`, `chat.py:1794`) and passes it into
  `_prepare_chat_session_via_daemon(..., bundle=bundle_bytes, resume_conversation_id=effective_resume_id, ...)`.
- Inside `_prepare_chat_session_via_daemon` (`chat.py:1630-1719`), the branch that actually runs
  for a resume is:
  ```python
  elif resume_conversation_id is not None:
      session_id = resume_conversation_id
  ```
  (`chat.py:1688-1689`) — `bundle` is **only** consumed by the sibling `else` branch,
  `sdk.sessions.create(bundle, filename="agent.tar.gz", workspace=workspace)` (`chat.py:1691-1694`),
  which runs **exclusively for a brand-new session**. On resume, the freshly-built bundle bytes
  are computed and then never referenced again.
- The next step, `launch_or_reuse_daemon_runner(client, host_id=host_id, session_id=session_id, workspace=workspace)`
  (`chat.py:1707-1709`; impl at `host/daemon_launch.py:166-206`), takes **no bundle parameter at
  all** — it only calls `POST /v1/hosts/{host_id}/runners` to spawn a runner process bound to the
  session's *already-registered* agent.
- The client SDK (`omnigent_client/_sessions.py`) confirms there is no update path: `bundle` only
  appears in `SessionsNamespace.create()` (`_sessions.py:338-390`). Every other mutator
  (`bind_runner`, `unbind_runner`, `set_reasoning_effort`, `set_model_override`, `set_archived`,
  `set_external_session_id`) is narrow-purpose and none touches the agent spec/bundle. There is no
  `update_bundle` / `resync_agent` / `rebind_agent_bundle` method anywhere in the SDK.

**Conclusion:** an agent's spec (config.yaml + skills) is fixed at the point a session is
*created* (`sdk.sessions.create`, i.e. the original `sys_session_create` / first `omnigent run
<bundle>`, no `--resume`). Killing the runner process and relaunching with `--resume <same conv_id>
<bundle_path>` **only respawns the runner process** — it reconnects to the exact same
server-side agent registration the conversation already had. It does **not** pick up any edits
made to `config.yaml` or the skills directory on disk since the session was created. The bundle
path argument on a `--resume` invocation is read and gzipped for nothing; it's dead weight kept
only so the CLI takes the "session exists" code branch instead of erroring.

This means OPTION 1 as specified **achieves "recover a dead/hung runner process"** (useful, and
exactly what the `2026-07-10-subagent-runners-disconnected.md` incident's recovery recipe already
does) but **does not achieve "pick up config/skill changes for an existing session"** — which per
the task description is the actual stated purpose of the "restart" skill. This is a real
unanticipated architecture gap, not a matter of getting the kill mechanics right. Recommend the
owner decide between:
1. **Re-scope the skill** to "recover a dead runner" only (rename/re-describe accordingly; this is
   exactly what the process-kill mechanics below already deliver, safely).
2. **Find or build a real resync path.** I did not find one in the client SDK surface; there may
   be a lower-level server capability (e.g. a raw `PATCH /v1/sessions/{id}` with an `agent_id`
   field, or a server-side "register new agent version, then rebind" flow) that the client SDK
   doesn't wrap — unconfirmed, would need server-side source (not present in the CLI package) or
   an explicit ask to the Omnigent team.
3. **Abandon "resume" semantics entirely** for this use case and instead create a **fresh session**
   from the edited bundle (loses the conv_id/history — a real product trade-off, not mine to make).

I have not implemented or changed anything — flagging this for owner sign-off (and recommend
`record-decision` once resolved) before the coder proceeds.

## A) Does the conv_id substring match exclusively identify fkit-team's own footprint?

**Yes — confirmed safe, with one correction: it also matches the top-level `omnigent run --resume`
REPL, not just the runner subprocess (see B/D).**

- `runtime/harnesses/process_manager.py:1030-1042`: the runner subprocess is spawned via
  `asyncio.create_subprocess_exec(sys.executable, "-m", "omnigent.runtime.harnesses._runner",
  "--harness", harness, "--module", module_path, *endpoint.spawn_args(), "--conversation-id",
  conversation_id, "--parent-pid", str(parent_pid), ...)` — `conversation_id` is passed as an
  **exact, standalone argv token**, never concatenated into another value.
- `endpoint.spawn_args()` (`process_manager.py:388-392`) adds `--socket <path>` where the path is
  built from the *same* `conversation_id` (`_socket_path(instance_dir, conversation_id)`,
  `process_manager.py:378-382`) — this is the same process's own argv, so it only reinforces the
  match, never causes a cross-session collision.
- I did not find the exact conv-id generator in this package (likely server-side, not in the CLI
  wheel), but every observed id (yours, the six in the incident doc, and the sibling teammate's)
  is `conv_` + a fixed-length 32-char hex string. Fixed-length tokens can't be a proper prefix/substring
  of one another unless equal, so `pgrep -f "<conv_id>"` cannot cross-match a different session's
  argv through this vector. (If you want this airtight rather than "observed consistently," ask
  fkit-wiki / the owner whether ID length is a documented invariant — I didn't find a length
  assertion in the client-visible code.)
- `omnigent.runner._entry` (the shared runner host, your 97151) and `_daemon_entry.py` /
  `omnigent.cli server` (97130/97132) never take a `--conversation-id` argument — confirmed by
  reading both files directly; neither module even imports/parses one. So rule 4 (never touch
  97151/97130/97132) is correctly enforced by construction, not just by luck.
- **Correction to your plan:** `pgrep -f "<conv_id>"` will *also* match the **top-level
  `omnigent run --resume <conv_id> <bundle>` REPL process** (your 97052) — its own argv literally
  contains the conv_id. Your step 1(a) already anticipates this ("this should only ever match (a)
  `omnigent run --resume <conv_id> ...` REPL processes"), so this is not a gap in your plan, just
  confirming it's correct and intentional, not an oversight.

## B) Does SIGTERM to the `_runner` process already cleanly terminate the `claude` child?

**Yes, internally — but your step 2 is genuinely load-bearing, not redundant-but-harmless, given
your proposed timeout.**

Traced the cascade:
1. `_runner.py` runs uvicorn with `_HardExitServer` (`runtime/harnesses/_runner.py:243-248`).
   `handle_exit` on SIGTERM arms a hard-exit backstop (`_HARD_EXIT_TIMEOUT_S`, default
   `_GRACEFUL_SHUTDOWN_TIMEOUT_S + 2 = 7s`) and lets uvicorn run its normal lifespan-shutdown path.
2. Lifespan shutdown → `runtime/harnesses/_scaffold.py`'s `_lifespan` teardown (`_scaffold.py:783,
   862-935`) → `_executor_adapter.py:1110-1117` calls `await self._executor.close()`.
3. `inner/claude_sdk_executor.py`'s `close()` (`~1469` onward, cleanup logic at `1568-1590`) calls
   `_terminate_process_tree(process)` → `omnigent.inner._proc.terminate_tree` on the `claude` CLI
   subprocess, waits up to 5s, escalates to `_kill_process_tree` (SIGKILL) on timeout.
4. Critically: the `claude` CLI child is spawned with `**_proc.spawn_kwargs()`
   (`start_new_session=True` on POSIX — this is stated directly in `_proc.py`'s module docstring
   and `spawn_kwargs()`'s own docstring, `inner/_proc.py:59-78`), i.e. it's a **separate
   process-group leader** from the runner. `terminate_tree`'s `_killpg` fast path
   (`inner/_proc.py:81-107`) explicitly refuses to signal a group equal to *our own* — so it only
   works because `claude` is properly isolated into its own group. This is exactly the pattern
   your step 3 asked me to confirm isn't process-group-wide against the runner's own group; it
   isn't — it's scoped correctly to the `claude` subtree.

So the internal path is real and correct: SIGTERM to the runner **does** cleanly reap its `claude`
child, given time. The problem is time: worst case that internal cascade takes up to ~7s
(`_HARD_EXIT_TIMEOUT_S`) before the runner process itself force-exits. **Your plan's own external
timeout is ~2s before escalating to SIGKILL on the runner PID.** SIGKILL is not catchable — if you
SIGKILL the runner before its internal 5-7s graceful path finishes, the `claude` child (already in
its own process group, per point 4) is **not** part of any signal you sent and is **not** reaped
by anything — it's simply orphaned and left running. So: keep step 2 (explicit find-and-kill of
the `claude` child) — it is a necessary safety net given a 2s external timeout, not
redundant-but-harmless. Alternatively, raise your external SIGTERM→SIGKILL grace window to ≥7-8s
to reliably let the internal path finish and make step 2 truly redundant; I'd keep step 2 either
way since it's cheap and removes the timing dependency entirely.

## C) Is `os_env` helper (97404) tied to conv_64a... in a way `pgrep -f` would miss?

**No — confirmed it is correctly out of scope, by design, not by accident.**

- `inner/os_env.py` contains **zero** references to `conversation` anywhere in the file (grepped
  directly) — its `helper` subcommand takes only `--config-fd <fd>` / `--config-file <path>`
  (`inner/os_env.py:1557-1573`), consistent with your observation that its argv carries no conv-id.
- Traced its owner: `runner/resource_registry.py` creates/caches `OSEnvironment` instances keyed
  by **`session_id`** in `self._primary_envs[session_id]` (`resource_registry.py:585-586`), with
  explicit environment-cloning/sharing logic (`env_id == environment_id`, `~line 564`) — i.e. this
  is a resource owned by the **shared runner-host process** (your 97151, part of
  `omnigent.runner`), not a resource privately owned by the per-conversation `_runner` subprocess
  (97153) you're planning to kill.
- Practically: you never touch 97151, so this registry (and 97404) is untouched by your plan
  regardless — correct, since it may be serving other sessions too (its "clone" language implies
  reuse across sessions is a real code path). On the fresh `--resume` relaunch, the daemon-owned
  runner-launch path (`host/daemon_launch.py:166` `launch_or_reuse_daemon_runner`) only spawns/binds
  a new **runner** — it doesn't touch the OSEnvironment registry — so whatever `sys_os_*` tool
  state fkit-team had (cwd, open shell) is provided fresh by the *existing*, already-running
  registry entry when the new runner subprocess calls into it, not respawned. That's expected and
  fine; nothing here needs killing.

## D) `--server <url>` vs. bare `omnigent run --resume <id> <bundle>` for the relaunch

**Use `--server <url>`, matching your task instructions — do not omit it, and here's the concrete
mechanical reason, not just "mirror the reconnect skill":**

- `_dispatch_run` → `run_chat` (`chat.py:254`) has a **local-mode, non-URL target** branch
  (`chat.py:426-448`) that always does `base_url = _ensure_backend(server_url)` — i.e. the
  daemon/local-server bring-up path runs regardless of whether you pass `--server`. Passing no
  `--server` at all makes `server_url=None`, which routes through `_ensure_backend(None)` →
  `_ensure_host_daemon(None)` (`cli.py:2452`) — **local-daemon mode**, which will spin up (or
  reuse) *this machine's* local server via `ensure_local_omnigent_server()`
  (`host/_daemon_entry.py:37-38`). Since fkit-team is *already* running against a live local
  server (confirmed reachable — `97132`/port 6767 in your tree), an explicit `--server <url>`
  discovered via `omnigent host status --json` guarantees the relaunched runner binds to the
  **same** already-running server/host stack instead of taking a code path that re-derives/reuses
  it implicitly. Functionally these usually converge to the same server in a single-local-server
  setup, but explicit `--server` removes ambiguity for a **backgrounded, non-interactive**
  relaunch where there's no human present to notice if daemon-discovery picked something
  unexpected (e.g. after an auth-mode change, `_ensure_host_daemon` can tear down and respawn the
  local server under changed config — see `cli.py:2234-2260`'s `config_changed` return and
  `_exit_for_auth_mode_change`, `cli.py:2461-2497` — which would print an interactive message and
  `SystemExit(0)` in a foreground run; behind `nohup` that just silently fails to reconnect).
  Passing `--server` explicitly is exactly the same reasoning `fkit-reconnect.sh`'s pattern and the
  `2026-07-10-subagent-runners-disconnected.md` incident's recovery recipe already rely on
  (`omnigent run <agent.yaml> --resume <conv_id> --server <url>`, item 8 in that doc) — so this
  also keeps you consistent with the one already-proven recovery path in this codebase.
- One live caveat already documented in that same incident (`item 9`): the foreground REPL wrapper
  crashes with `OSError: [Errno 22]` from `prompt_toolkit` when stdin isn't a real TTY (exactly
  your backgrounded/`nohup`/`</dev/null` case) — confirmed **cosmetic**: the crash happens in the
  REPL wrapper after the runner subprocess is already spawned and bound; the runner itself
  survives and the session comes back online. Don't treat a non-zero exit / traceback from the
  backgrounded relaunch command as reconnect failure — verify via `sys_session_get_info` (`status:
  "idle"`, `runner_online: true`) instead, same as the incident recipe does.

## Addendum (coder, same day) — owner chose kill+fresh-session; one mechanism fix from synthetic testing

Per the critical finding above, the owner reviewed this doc directly and chose **kill the existing
fkit-team session, start a genuinely new one** (not a re-scope to "recover a dead runner", not a
search for a hidden resync endpoint). Implemented as `omnigent/fkit-team-restart.sh` (wired up as
`fkit restart-team`, invoked by the new `restart` skill), reusing the kill-mechanics verification
(A-D) above essentially as designed.

One refinement found via safe synthetic testing (decoy processes standing in for the real
runner/`claude` pair — never run against the live team session): the `claude` child should be
signaled by **process group** (`kill -TERM -- -<pid>`), not just its own pid. Confirmed with a real
`start_new_session=True` Python child+grandchild pair that a single-pid `kill` leaves a grandchild
(e.g. a subprocess `claude` itself spawned) orphaned, while a process-group kill reaps both in one
shot — consistent with B's finding that the runtime's own internal cascade uses `killpg` for the
same reason. `fkit-team-restart.sh` now signals the `claude` child's group, not just its pid.

## Bottom line for the coder

- Steps 1, 3, 4, 5 of your mechanism are correct as designed (A, C, D above confirm them; D adds
  one concrete justification for keeping `--server`).
- Step 2 (explicit `claude` child kill) is not just a safety margin — keep it, or extend your
  SIGTERM→SIGKILL grace to ≥7-8s if you'd rather rely on the internal cascade alone (B above).
- **Do not proceed to ship this as "picks up config.yaml/skill edits" until the owner resolves the
  critical finding above** — the kill/relaunch mechanics are safe and correct, but as specified
  they recover a dead runner, they do not resync spec content. That's a scope/design decision, not
  something I can resolve unilaterally.
