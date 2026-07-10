#!/usr/bin/env bash
# fkit-team restart — kill the CURRENT fkit-team ROOT session's runner process and start a
# BRAND-NEW session for fkit-team, so it actually picks up on-disk config.yaml/skills edits.
#
# Context / why this exists (read before touching it):
#   ai-agents/knowledge-base/restart-skill-verification-2026-07-10.md — `omnigent run --resume
#   <conv_id>` does NOT re-read the agent bundle (config.yaml/skills/) from disk for an EXISTING
#   conversation. Traced directly in the installed omnigent CLI source (chat.py's
#   `_prepare_chat_session_via_daemon` and host/daemon_launch.py's `launch_or_reuse_daemon_runner`):
#   the freshly-built bundle bytes are only ever consumed by `sdk.sessions.create(bundle, ...)`,
#   which runs exclusively for a brand-new session; the resume branch never references it, and the
#   daemon-runner launch path that actually spawns the fresh runner process takes no bundle
#   parameter at all. So a "kill the runner, --resume the same conv id" restart (the FIRST design
#   tried here) only recovers a dead/hung runner — exactly what `fkit reconnect` /
#   `fkit-team/skills/reconnect-agents` already do — it does NOT pick up new skills/config. The
#   project owner explicitly chose, after seeing that verified finding, to implement restart as
#   "kill the existing session, start a genuinely fresh one" instead (an earlier reading of this
#   same idea had been explicitly abandoned before the finding, then explicitly re-adopted after).
#
# What this does, precisely:
#   1. Finds every OS process whose command line embeds the OLD fkit-team conversation id — the
#      foreground `omnigent run --resume <id> ...` REPL, the harness runner subprocess
#      (`omnigent.runtime.harnesses._runner --conversation-id <id> ...`), and that runner's
#      `claude` child (found by PPID, since its own argv carries no conv id) — and terminates them:
#      SIGTERM, then SIGKILL after a grace window generous enough for the runner's own internal
#      shutdown cascade to finish (verified: it can take up to ~7s before a bare SIGKILL would
#      orphan the `claude` child).
#   2. Launches a FRESH `omnigent run .fkit/agents/fkit-team -p "<bootstrap seed>" --server <url>`
#      (no --resume) — a genuine new session, which uploads the CURRENT on-disk bundle. This is
#      the one part of "restart" that actually delivers "picks up new skills/config".
#   3. Discovers the new session's conversation id and overwrites `.fkit/team-session` with it —
#      mirroring exactly what `fkit.sh`'s own "create" branch already does on a first-ever launch,
#      so the next `fkit` launch (or web-UI reload) lands on the new session automatically.
#   4. Archives the OLD fkit-team session (PATCH /v1/sessions/{old_id} with {"archived": true})
#      once the new session id is confirmed — the part that actually removes it from the default
#      session list. Archiving only flips a visibility flag: it does not delete the session or its
#      history, and it does not stop anything (the kill in step 1 already did that). Scoped to the
#      OLD ROOT session only — its six teammate child sessions stay orphaned-but-unarchived, same
#      as before (see next paragraph).
#
# Deliberately scoped to fkit-team's OWN root process only — it does NOT touch, discover, or kill
# any child teammate session (producer/coder/reviewer/architect/wiki/adversarial-reviewer). Those
# become orphaned: still existing server-side, runner left running, simply unreferenced once
# .fkit/team-session points at the new root. The new root's own standard bootstrap prompt creates
# six BRAND-NEW teammates under itself, same as any first-ever `fkit` launch. This is a known,
# accepted trade-off of "kill + fresh session" restart, not a bug — safely discovering and killing
# the old team's six children would need the same undocumented child_sessions tree walk
# `fkit-reconnect.sh` uses, which is a separate, larger capability, out of scope here unless
# explicitly asked for.
#
# Self-kill-race note: this script is meant to be launched DETACHED from the very process it is
# about to kill (fkit-team calling this ON ITSELF). It does NOT background itself — the caller
# (the `restart` skill) is responsible for `nohup ... & disown`-ing the whole invocation before
# returning from its own tool call, so the skill's tool call returns promptly rather than blocking
# on a script that is about to kill the process running it.
#
# Usage:  fkit restart-team [old_conv_id]
#   old_conv_id   Optional. The fkit-team conversation id to kill. Defaults to the id cached in
#                 .fkit/team-session. Pass it explicitly when the caller (fkit-team's own `restart`
#                 skill) already knows its own true conversation id authoritatively (from
#                 sys_session_get_info) — safer than trusting a cache file that could be stale.
#
# NOT intended for casual interactive human use like `fkit reconnect` is: reconnect only ever
# touches sessions that are ALREADY dead. This script kills a LIVE, currently-in-use fkit-team
# session. Running it by hand against your own active team chat will kill that chat mid-use. It is
# invoked programmatically by fkit-team's `restart` skill, gated there on an explicit human request
# — not by a human typing this command directly, and not on any timer/schedule.
#
# Env:  FKIT_RESTART_LOG        override the log path (default: /tmp/fkit-team-restart-<ts>.log).
#       FKIT_RESTART_KILL_GRACE seconds between SIGTERM and SIGKILL fallback (default 8).
set -uo pipefail   # no -e: one already-dead pid or one best-effort step must not abort the rest

usage() {
  cat <<'USAGE'
Usage: fkit restart-team [old_conv_id]

Kill the CURRENT fkit-team root session's runner process and start a BRAND-NEW fkit-team session
(so it re-reads config.yaml/skills off disk — `--resume` does not). Scoped to fkit-team's own root
process only; does not touch any teammate child session (they become orphaned, not killed).

NOT for casual human use: unlike `fkit reconnect` (which only touches already-dead sessions), this
kills a LIVE session. Meant to be invoked by fkit-team's own `restart` skill, gated on an explicit
human request.

Env:
  FKIT_RESTART_LOG          override the log path (default /tmp/fkit-team-restart-<ts>.log).
  FKIT_RESTART_KILL_GRACE   seconds between SIGTERM and SIGKILL fallback (default 8).
USAGE
}

case "${1:-}" in
  -h|--help) usage; exit 0 ;;
esac

for b in curl omnigent pgrep; do
  command -v "$b" >/dev/null 2>&1 || {
    echo "fkit restart-team: '$b' is required on PATH but was not found." >&2
    exit 1
  }
done

proj="$(pwd)"
teamfile="$proj/.fkit/team-session"

old_conv_id="${1:-}"
if [ -z "$old_conv_id" ]; then
  [ -f "$teamfile" ] || {
    echo "fkit restart-team: no conv id given and $teamfile not found." >&2
    exit 1
  }
  old_conv_id="$(head -1 "$teamfile" | tr -d '[:space:]')"
fi
[ -n "$old_conv_id" ] || { echo "fkit restart-team: could not resolve a conversation id." >&2; exit 1; }

_server_url() {  # mirrors fkit.sh's own _team_server_url / fkit-reconnect.sh's _server_url
  omnigent host status --json 2>/dev/null \
    | sed -n 's/.*"server_url"[[:space:]]*:[[:space:]]*"\(http[^"]*\)".*/\1/p' | head -1
}
server_url="$(_server_url)"
if [ -z "$server_url" ]; then
  echo "fkit restart-team: no local Omnigent server appears to be running — start your team first (fkit)." >&2
  exit 1
fi

log="${FKIT_RESTART_LOG:-/tmp/fkit-team-restart-$(date +%s).log}"
grace="${FKIT_RESTART_KILL_GRACE:-8}"

exec >>"$log" 2>&1
echo "$(date): fkit-team restart starting. old_conv=$old_conv_id server=$server_url proj=$proj"

# Let the CURRENT turn's tool call return, and fkit-team's own final reply for this turn flush to
# the client, before the process producing it gets killed.
sleep 5

cd "$proj" || { echo "fkit restart-team: cannot cd to $proj"; exit 1; }

# --- Identify: exact, non-overlapping conv-id substring match. Verified against the installed
# omnigent v0.4.0 source: --conversation-id is always passed as a distinct, standalone argv token
# (never concatenated into another value), and shared infra (omnigent.runner._entry, omnigent.cli
# server, omnigent.host._daemon_entry) never parses/carries a conversation id at all — so this
# cannot collide with a sibling teammate session or the shared server/runner-host processes. ---
old_pids="$(pgrep -f "$old_conv_id" || true)"
echo "matched pids for $old_conv_id: ${old_pids:-<none>}"

claude_pids=""
for p in $old_pids; do
  claude_pids="$claude_pids $(pgrep -P "$p" 2>/dev/null || true)"
done
echo "claude child pids: ${claude_pids:-<none>}"

# --- Terminate: SIGTERM everything first, generous grace, then SIGKILL survivors. Killing the
# `claude` child explicitly (not just relying on the runner's internal cascade) matters: SIGKILL
# on the runner is uncatchable and does not reach its child if it lands mid-cascade. The `claude`
# child is signaled by PROCESS GROUP (negative pid), not just its own pid: it's spawned with
# start_new_session=True (its own process-group leader, verified against the installed omnigent
# source — the runtime's own graceful shutdown uses killpg on it for the same reason), so a
# single-pid kill can leave ITS OWN children (e.g. an in-flight shell-tool subprocess at the
# moment of kill) orphaned one level deeper than a plain `pgrep -P` walk would catch. The runner
# and REPL pids are signaled individually (not verified to be their own group leaders). ---
for p in $old_pids; do
  kill -TERM "$p" 2>/dev/null || true
done
for p in $claude_pids; do
  kill -TERM -- "-$p" 2>/dev/null || kill -TERM "$p" 2>/dev/null || true
done
sleep "$grace"
for p in $old_pids; do
  kill -0 "$p" 2>/dev/null && kill -KILL "$p" 2>/dev/null || true
done
for p in $claude_pids; do
  kill -0 "$p" 2>/dev/null && { kill -KILL -- "-$p" 2>/dev/null || kill -KILL "$p" 2>/dev/null || true; }
done
echo "old fkit-team root process(es) terminated"

# --- Create a genuinely NEW session — the part that actually re-reads config.yaml/skills off
# disk (--resume does not; see header). Mirrors fkit.sh's own "create" branch invocation. ---
seed="Stand up the fkit team now: create each teammate as a named standby session per your instructions, then end your turn."
nohup omnigent run ".fkit/agents/fkit-team" -p "$seed" --server "$server_url" \
  < /dev/null > "${log}.repl" 2>&1 &
disown
echo "launched fresh omnigent run (repl log: ${log}.repl)"

# --- Discover the new conversation id + repoint .fkit/team-session — identical polling loop/query
# to fkit.sh's own create-mode background worker. ---
newid=""
n=0
while [ "$n" -lt 30 ] && [ -z "$newid" ]; do
  cand="$(curl -s "$server_url/v1/sessions?agent_name=fkit-team&limit=1&order=desc&sort_by=updated_at" 2>/dev/null \
            | grep -o 'conv_[A-Za-z0-9]*' | head -1)"
  if [ -n "$cand" ] && [ "$cand" != "$old_conv_id" ]; then
    newid="$cand"
  else
    n=$((n + 1)); sleep 1
  fi
done

if [ -n "$newid" ]; then
  printf '%s\n' "$newid" > "$teamfile"
  curl -s -o /dev/null -X PATCH "$server_url/v1/sessions/$newid" \
    -H 'Content-Type: application/json' \
    --data "{\"title\":\"fkit · $(basename "$proj")\"}" 2>/dev/null || true
  # Archive the OLD root session so it drops out of the default session list. This only flips a
  # visibility flag server-side (does not delete the session/history, does not stop anything —
  # its process is already dead from the kill step above) and is deliberately scoped to the old
  # ROOT session only: its six teammate children are intentionally left unarchived (see header).
  # Only done here, in the success branch, so a failed new-session discovery (below) never leaves
  # .fkit/team-session pointing at a session that's both dead AND hidden from the list.
  curl -s -o /dev/null -X PATCH "$server_url/v1/sessions/$old_conv_id" \
    -H 'Content-Type: application/json' \
    --data '{"archived": true}' 2>/dev/null || true
  echo "$(date): fkit-team restart complete. new_conv=$newid .fkit/team-session updated." \
       "old_conv=$old_conv_id archived (hidden from the default session list, still exists" \
       "server-side, not deleted); its six teammates are NOT killed or archived — also" \
       "orphaned, unreferenced."
else
  echo "$(date): WARNING — could not discover the new session id after ${n}s." \
       ".fkit/team-session NOT updated (still points at the now-dead $old_conv_id)." \
       "Check ${log}.repl and GET $server_url/v1/sessions?agent_name=fkit-team manually."
fi
