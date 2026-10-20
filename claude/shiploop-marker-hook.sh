#!/bin/bash
# UserPromptExpansion hook (0129): marks a session that invoked a ship-loop command, so the Stop hook can
# skip it without a transcript scan. Only this event carries an authoritative command_name.

# ⚠️ Records only, never blocks: every path exits 0 with no stdout. The marker lasts the session (keyed
# by session_id); a failed write only means the Stop hook enforces as normal.
set -u

allow() { exit 0; }

extract_top() {
  printf '%s' "$1" | grep -o "\"$2\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | head -1 \
    | sed 's/.*:[[:space:]]*"\(.*\)"/\1/'
}
is_identifier() {   # the id becomes a file name: no path or quote tricks
  case "$1" in
    '') return 1 ;;
    *[!A-Za-z0-9_.-]*) return 1 ;;
    *) return 0 ;;
  esac
}

payload="$(cat)" || allow
[ -n "$payload" ] || allow

# Self-check expansion_type and command_name rather than trusting the settings matcher.
[ "$(extract_top "$payload" expansion_type)" = "slash_command" ] || allow

# command_name normally has no leading slash; strip one defensively so both forms match.
command_name="$(extract_top "$payload" command_name)"
command_name="${command_name#/}"
case "$command_name" in
  fkit-task-ship-loop|fkit-sprint-ship-loop) : ;;
  *) allow ;;
esac

# No safe session id or cwd: record nothing, so the Stop hook enforces normally.
session_id="$(extract_top "$payload" session_id)"
cwd="$(extract_top "$payload" cwd)"
is_identifier "$session_id" || allow
[ -n "$cwd" ] && [ -d "$cwd" ] || allow

# Best-effort marker write. Never let a failure surface or change the exit status.
mkdir -p "$cwd/.fkit/state" 2>/dev/null && : > "$cwd/.fkit/state/shiploop-$session_id" 2>/dev/null
allow
