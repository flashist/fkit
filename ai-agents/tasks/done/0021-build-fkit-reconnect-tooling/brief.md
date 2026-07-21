# Build `fkit reconnect` tooling for disconnected subagent runners

## ID
0021

## Sprint
Sprint 1

## Priority
9

## Status
🔲 Backlog

## Context

Incident: [`ai-agents/knowledge-base/incidents/2026-07-10-subagent-runners-disconnected.md`](../../knowledge-base/incidents/2026-07-10-subagent-runners-disconnected.md).
All six `fkit-team` teammate sessions lost their runner processes simultaneously
(`runner_online: false`, `status: failed`); `sys_session_list`/`sys_agent_list` showed **zero**
children the whole time even though the sessions still existed server-side. Recovery required
manually shelling out to `omnigent run <config> --resume <conv_id> --server <url>` per teammate.

fkit-architect confirmed (2026-07-10 consult): the underlying causes — why the runners died, why
the listing tools don't see children, the missing reconnect tool, the non-TTY CLI crash — are all
**upstream Omnigent platform bugs**. fkit's repo contains no runtime/server/CLI code (it only
invokes the external `omnigent` binary), so none of that is fixable here; those five items stay
addressed to the Omnigent tech team via the incident doc itself, not this task.

What **is** buildable here: a client-side script that codifies the manual recovery recipe, so the
next disconnect doesn't require rediscovering the endpoint and command sequence under pressure.
This is a stopgap, not a fix — retire it once the Omnigent platform ships a real reconnect tool
(incident doc's ask #4).

## Design (revised 2026-07-10 — recursive discovery, no cache)

The design went through two owner-driven revisions before landing here; later findings supersede
earlier ones in this doc's history, but the full trail is left below for the coder's context.

1. **First cut:** discover conv_ids via `/v1/sessions/{id}/child_sessions`, called on the known
   root only (fkit-team's 5-6 direct teammates).
2. **Second cut:** cache `title -> conv_id` in `.fkit/team-roster.json` at bootstrap to avoid
   calling that endpoint at all in the common case, since the roster is config-declared. The owner
   correctly flagged this trades one staleness problem (an unknown/undiscoverable teammate) for
   another (a cache that silently drifts from a config change, e.g. task 5 removing
   `adversarial-reviewer`).
3. **Final design (this brief):** the owner proposed dropping the cache entirely and instead doing
   a **live, recursive walk of the whole session tree** every run — no cache, so no staleness class
   of bug is possible. fkit-architect verified this against the installed Omnigent package source
   (not inference):
   - `child_sessions` returns **direct children only** (`server/routes/sessions.py`) — a
     level-by-level walk (root → its children → their children → ...) is required and is safe:
     `parent_conversation_id` is set once at creation, so the tree cannot cycle, and fkit's real
     fan-out (6 teammates + occasional 1-2 ad hoc consult grandchildren, same pattern this very
     producer session uses to reach fkit-wiki/fkit-architect) is trivially small.
   - This is source-confirmed as the **same mechanism the Web UI panel itself uses**
     (`ChildSessionSummary`'s docstring names it the "canonical historical truth" source the web/
     REPL debug surface is built on). It is an internal endpoint with no published external API
     contract and not yet exposed on the agent-facing MCP tool surface — but it is not a fragile
     reverse-engineered hack either; treat it as stable-per-source, not likely-to-shift-under-us.
   - `child_sessions` does **not** carry the authoritative `runner_online` liveness bit — only
     `GET /v1/sessions/{id}` does (`schemas.py`, documented: *"runner_online is False ⇒ host alive
     ⇒ send a reconnect"*). Both the cache design and this one always needed a per-candidate
     `GET /v1/sessions/{id}` call; this was an implicit gap in the earlier drafts, not something
     recursion changes.
   - **Hard requirement, not optional:** recursion reaches ad hoc consult children (e.g.
     producer→wiki-consult) that may have been deliberately ended via `sys_session_close`, which
     durably marks them `labels: {"omnigent.closed": "true"}` (visible on `ChildSessionSummary`).
     **Any child carrying that label must be skipped** — it is intentionally closed, not crashed,
     and must never be "reconnected." Skipping this filter is a correctness bug, not a style
     choice.

## What to build

A new script `omnigent/fkit-reconnect.sh`, wired up as a `fkit reconnect` subcommand in
`omnigent/fkit.sh` (that file already has a subcommand dispatch pattern for `update`/`upgrade` —
extend it, don't invent a new pattern). Behavior:

1. Resolve the server URL the same way `fkit.sh` already does elsewhere (`omnigent host status
   --json`) — do not hardcode `127.0.0.1:6767`.
2. Resolve the `fkit-team` root conversation id from `.fkit/team-session` (already cached there —
   no need to hunt for it).
3. **Recursively discover the live session tree**, starting at the root: call
   `GET /v1/sessions/<id>/child_sessions` on the root, then again on every child returned that
   itself might have children, until a level returns empty. At each node, **skip any child whose
   `labels` includes `omnigent.closed: "true"`** — do not recurse into it and do not consider it a
   candidate.
4. For every remaining (non-closed) node discovered, call `GET /v1/sessions/<conv_id>` to get the
   authoritative liveness signal. Treat `runner_online: false` (or `status: "failed"`) as
   disconnected; everything else is left alone.
5. For each disconnected node, background-run:
   `omnigent run <path/to/its/agent/config.yaml> --resume <conv_id> --server <url> < /dev/null >
   /tmp/reconnect-<title>.log 2>&1 & disown`
   (the agent config path for the 5-6 named teammates is `.fkit/agents/<name>/config.yaml`; for an
   ad hoc consult child, resolve the same way `sys_session_create`'s `agent_id`/config resolution
   already does — do not assume every disconnected node is a named teammate).
6. Poll `GET /v1/sessions/<conv_id>` for each disconnected node until it shows `status: "idle"` /
   `runner_online: true`, with a reasonable timeout, and report per-node success/failure clearly
   (title + conv_id, not just a count).
7. **Treat the CLI's own non-zero exit or `OSError` traceback as expected noise, not failure** — the
   incident found the foreground REPL crashes on non-TTY stdin even when the reconnect itself
   succeeded. Judge success only from polled server state, never from the backgrounded process's
   exit code.
8. Script header must state explicitly, in comments:
   - The reconnect command itself is first-party (same command the panel's own "disconnected"
     dialog gives a human) — this script only automates finding *which* sessions need it (via a
     recursive tree walk) and running it for each.
   - `/v1/sessions/{id}/child_sessions` and `/v1/sessions/{id}` are internal endpoints with no
     published external API contract, confirmed (not assumed) to be the same mechanism the Web UI
     panel itself uses — stable-per-source, but not on the agent-facing MCP tool surface. Retire
     this direct-REST dependency once the platform ships ask #4 (reconnect + tree visibility as a
     first-class tool).
   - It currently assumes a **local, unauthenticated dev server**. Before running this against
     anything else, confirm whether the server requires auth and, if so, reuse whatever credential
     the `omnigent` CLI itself already uses — don't invent a new one.
   - The `omnigent.closed` label filter (step 3) is load-bearing, not cosmetic — removing it would
     make the script "reconnect" sessions that were deliberately ended.
9. **Scope as human-operator CLI tooling only.** Do not wire `fkit-team` or any teammate to invoke
   this script autonomously — that would expand the team's "orchestrates, never acts" charter and
   needs its own `record-decision` if ever proposed, not a side effect of this task.

Out of scope (do not attempt): fixing `sys_session_list`/`sys_agent_list` visibility, building
auto-respawn/self-healing, or patching the `omnigent` CLI's TTY-crash — those are the Omnigent
platform's own bugs, tracked via the incident doc, not this repo.

## Verification steps

- `fkit reconnect` with no disconnected sessions anywhere in the tree is a clean no-op with a clear
  "all connected" message (not a false error).
- If a `child_sessions` or per-session call fails or returns an unexpected shape, the script errors
  clearly rather than silently doing nothing.
- Running against at least one deliberately-killed runner (or simulated via a stale/failed session
  if a live kill isn't practical in dev) successfully reconnects it and reports `status: idle`,
  including when that node is a **grandchild** (e.g. a producer→consult session), not just a direct
  teammate.
- A session closed via `sys_session_close` (carrying the `omnigent.closed` label) is **never**
  reconnected, even if it would otherwise look inactive — confirm this with a session deliberately
  closed rather than crashed.
- The script does not require a TTY and does not treat the CLI's own crash output as a failure when
  the underlying reconnect succeeded.
- `fkit reconnect --help` (or equivalent) documents the internal-endpoint and closed-label-filter
  caveats from point 8 above inline, not just in the script's source comments.

## Notes

- Natural owner: **fkit-coder** (shell script + `fkit.sh` edit is source-write).
- fkit-architect verified the design above against the installed Omnigent package source during the
  2026-07-10 consult that produced this brief (not inference) — coder can consult the architect for
  implementation-level clarifying detail rather than re-deriving the approach from scratch.
- This is deliberately narrow: it does not attempt to fix any of the five upstream asks in the
  incident doc, only to reduce the manual pain of a repeat before the platform fixes them.
