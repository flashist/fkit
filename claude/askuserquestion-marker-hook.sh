#!/bin/bash
# PreToolUse hook on AskUserQuestion: records "the owner was asked with the tool this turn" for the Stop
# hook, whose payload has no tool-call list (ADR-030 "Addendum — 2026-07-23"). The Stop hook consumes it.

# ⚠️ Records only, never denies. An unwritable state dir is safe: the Stop hook then skips check A.
# A write that fails in a writable dir (e.g. disk full) can cause one false block; block-once caps it.
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

# Defensive: the matcher already scopes this to AskUserQuestion; anything else records nothing.
tool_name="$(extract_top "$payload" tool_name)"
[ "$tool_name" = "AskUserQuestion" ] || allow

# No safe session id or cwd: record nothing; the Stop hook then cannot trust absence and fails open.
session_id="$(extract_top "$payload" session_id)"
cwd="$(extract_top "$payload" cwd)"
is_identifier "$session_id" || allow
[ -n "$cwd" ] && [ -d "$cwd" ] || allow

# Best-effort marker write. Never let a failure surface or change the exit status.
mkdir -p "$cwd/.fkit/state" 2>/dev/null && : > "$cwd/.fkit/state/askuq-$session_id" 2>/dev/null
allow
