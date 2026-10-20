#!/bin/bash
# Stop hook (ADR-030): blocks once on a missing "What's next?" (check B, exact match) or on a prose
# question to the owner with no AskUserQuestion (check A, heuristic). It checks presence only.

# ⚠️ It fails OPEN, always — the reverse of the skill-ownership hook — because a misfire stops the turn
# (ADR-030 Decision 6).

# ⚠️ Stop only, never SubagentStop: a consult has no AskUserQuestion, so a block there is unescapable
# (ADR-030 Decision 7; mechanism: ADR-030 "Addendum — 2026-07-23", "Two design questions this settles").
set -u

allow() { exit 0; }   # no stdout: lets the turn complete
block() {             # $1 is static, JSON-safe as-is
  printf '{"decision":"block","reason":"%s"}\n' "$1"
  exit 0
}

extract_top() {
  printf '%s' "$1" | grep -o "\"$2\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | head -1 \
    | sed 's/.*:[[:space:]]*"\(.*\)"/\1/'
}
extract_bool() {
  printf '%s' "$1" | grep -oE "\"$2\"[[:space:]]*:[[:space:]]*(true|false)" | head -1 \
    | grep -oE 'true|false'
}
is_identifier() { case "$1" in '') return 1 ;; *[!A-Za-z0-9_.-]*) return 1 ;; *) return 0 ;; esac; }

payload="$(cat)" || allow
[ -n "$payload" ] || allow

# Defensive: registered on Stop only.
event="$(extract_top "$payload" hook_event_name)"
case "$event" in ''|Stop) : ;; *) allow ;; esac

# Consume the AskUserQuestion marker before any skip, so it never leaks into the next turn. Trust its
# absence only if the state dir is writable; else fail open (ADR-030 "Addendum — 2026-07-23"; 0127 review R4).
session_id="$(extract_top "$payload" session_id)"
cwd="$(extract_top "$payload" cwd)"
had_marker=0
marker_infra_ok=0
if [ -n "$cwd" ] && is_identifier "$session_id" && [ -d "$cwd/.fkit/state" ] && [ -w "$cwd/.fkit/state" ]; then
  marker_infra_ok=1
  marker="$cwd/.fkit/state/askuq-$session_id"
  [ -e "$marker" ] && had_marker=1
  rm -f "$marker" 2>/dev/null || :
fi

# Block once: stop_hook_active is true when a Stop hook already blocked this turn (ADR-030 Decision 5).
[ "$(extract_bool "$payload" stop_hook_active)" = "true" ] && allow

# The adversarial reviewer is findings-only (ADR-030 Decision 7).
agent_type="$(extract_top "$payload" agent_type)"
[ "$agent_type" = "fkit-adversarial-reviewer" ] && allow

# Ship-loop sessions skip via shiploop-marker-hook.sh's session marker, never a transcript scan (0129).
# A missing marker only under-skips (block-once lets it through); it never false-blocks.
if [ -n "$cwd" ] && is_identifier "$session_id" && [ -e "$cwd/.fkit/state/shiploop-$session_id" ]; then
  allow
fi

# No visible final message (absent, null, empty or blank) leaves nothing to enforce: fail open.
case "$payload" in *'"last_assistant_message"'*) : ;; *) allow ;; esac
printf '%s' "$payload" | grep -qE '"last_assistant_message"[[:space:]]*:[[:space:]]*(null|"[[:space:]]*")' && allow

# Search the whole raw payload: finding the heading errs toward not blocking.
whats_next_missing=1
case "$payload" in *"What's next?"*) whats_next_missing=0 ;; esac

# Check A: a question is a line ending in "?", skipping code fences, quotes and the heading line. The
# JSON keeps each newline as a literal "\n", so awk splits on /\\n/; truncation only drops lines.
msg="$(extract_top "$payload" last_assistant_message)"
has_question=0
if printf '%s' "$msg" | awk '
    { n = split($0, L, /\\n/)
      infence = 0
      for (i = 1; i <= n; i++) {
        l = L[i]
        if (l ~ /^[[:space:]]*```/) { infence = !infence; continue }   # toggle fenced region
        if (infence) continue
        if (l ~ /^[[:space:]]*>/) continue                            # blockquote line
        if (index(l, "What'\''s next?") > 0) continue                  # any line with the heading
        if (l ~ /\?[[:space:]]*$/) { found = 1 }                       # a line ending in ?
      }
    }
    END { exit (found ? 0 : 1) }
  '; then has_question=1; fi

# asked_with_tool: suppress check A when the tool WAS used (marker) OR the marker can't be trusted.
asked_with_tool=1
[ "$marker_infra_ok" = 1 ] && [ "$had_marker" = 0 ] && asked_with_tool=0
check_a=0
[ "$has_question" = 1 ] && [ "$asked_with_tool" = 0 ] && check_a=1

# At most one block, combining whichever checks fired.
REASON_B="Close your reply with a 'What's next?' section (place it after any prescribed output shape, never instead of one). If nothing is pending, say so in a few words."
REASON_A="You put a question to the owner in prose. In a session, ask it with the AskUserQuestion tool; in a spawned consult, return the open questions in your reply instead. If you were answering the owner's question or explaining ahead of one, open no dialog: end the turn with no question line other than the What's next? heading."

if [ "$whats_next_missing" = 1 ] && [ "$check_a" = 1 ]; then
  block "$REASON_A $REASON_B"
elif [ "$whats_next_missing" = 1 ]; then
  block "$REASON_B"
elif [ "$check_a" = 1 ]; then
  block "$REASON_A"
fi
allow
