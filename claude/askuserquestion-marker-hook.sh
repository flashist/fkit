#!/bin/bash
# askuserquestion-marker-hook.sh — a PreToolUse marker hook (task 0127 / ADR-030, path 2).
#
# Records a turn-scoped marker whenever the interactive `AskUserQuestion` tool is called, so the `Stop`
# turn-completion hook (turn-completion-hook.sh) can tell — RELIABLY — whether the owner was asked via
# the tool this turn. This exists because a `Stop` payload carries NO tool-call list, and the transcript
# is version-fragile and lags the current turn; `PreToolUse`, by contrast, sees the call authoritatively
# at call time (verified: PreToolUse fires on AskUserQuestion; it is not exempt — only EndConversation
# is). This is the ADR-018 "extend the proven path" — a sibling of skill-ownership-hook.sh, wired by the
# same build_settings(), matched on the AskUserQuestion tool.
#
# ⚠️ RECORDS ONLY — NEVER DENIES. A PreToolUse hook that recorded a marker must not interfere with the
# tool call it is observing. Every path exits 0 with no stdout (allow). `set -u`: an unexpected unset
# var is a visible bug, not a silent misfire.
#
# The Stop hook reads AND CONSUMES the marker (deletes it each turn), so the marker means "AskUserQuestion
# was used since the last Stop" = "...this turn".
#
# ⚠️ A FAILED WRITE IS NOT SELF-HEALING HERE — the Stop hook cannot tell "tool not used" from "tool used
# but the marker write failed" by marker-absence alone. The two hooks close that gap TOGETHER: the Stop
# hook only trusts a MISSING marker when the state dir is present AND WRITABLE (R4). If this hook cannot
# write (unwritable state dir), the dir is unwritable at Stop time too, so the Stop hook treats the
# signal as untrustworthy and fails OPEN (suppresses check A). So a failed write does not cause a false
# block — but that safety lives in the Stop hook's writability check, not in this hook silently.
set -u

allow() { exit 0; }   # allow the tool call, record nothing more: exit 0, no stdout.

extract_top() {   # first top-level "<key>":"<value>" string match (same jq-free approach as the siblings)
  printf '%s' "$1" | grep -o "\"$2\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | head -1 \
    | sed 's/.*:[[:space:]]*"\(.*\)"/\1/'
}
is_identifier() {   # safe charset only: letters, digits, hyphen, underscore, dot — no path/quote tricks
  case "$1" in
    '') return 1 ;;
    *[!A-Za-z0-9_.-]*) return 1 ;;
    *) return 0 ;;
  esac
}

payload="$(cat)" || allow
[ -n "$payload" ] || allow

# Only AskUserQuestion is in scope (the matcher already scopes us; this is defensive). Anything else,
# including an unparseable tool_name, records nothing.
tool_name="$(extract_top "$payload" tool_name)"
[ "$tool_name" = "AskUserQuestion" ] || allow

# Need a safe session id and a cwd to key/place the marker. Either missing or unsafe → record nothing;
# the Stop hook will then fail open (it cannot trust marker-absence, so it suppresses check A).
session_id="$(extract_top "$payload" session_id)"
cwd="$(extract_top "$payload" cwd)"
is_identifier "$session_id" || allow
[ -n "$cwd" ] && [ -d "$cwd" ] || allow

# Best-effort marker write. Never let a failure surface or change the exit status.
mkdir -p "$cwd/.fkit/state" 2>/dev/null && : > "$cwd/.fkit/state/askuq-$session_id" 2>/dev/null
allow
