#!/bin/bash
# turn-completion-hook.sh — the `Stop` turn-completion hook (task 0127 / ADR-030).
#
# Enforces two end-of-turn behaviours the coder's prompt already promises but does not fire reliably
# (ADR-016 §6 — delivery structural, compliance advisory):
#   • Check B (exact)     — the reply closes with a literal "What's next?" section.
#   • Check A (heuristic)  — a question put to the owner is asked with AskUserQuestion, not in prose.
# It performs PRESENCE checks only and never judges content (ADR-030 Decision 2). A sibling of
# skill-ownership-hook.sh (ADR-018); wired as a second key ("Stop") in the same {"hooks":{…}} object
# by build_settings() in fkit-claude.sh.
#
# ⚠️ FAIL OPEN, ALWAYS — the single most important rule here, and INVERTED from the skill-ownership
# hook (which fails CLOSED). A Stop hook can prevent a turn from COMPLETING; a misfire is worse than the
# missing footer it fixes (ADR-030 Decision 6). Every error, parse failure, empty field, unreadable
# file, or uncertainty calls allow() — never block(). block() is reached only on a POSITIVE, confident
# detection. `set -u` (not -e) so an unexpected unset var is a visible bug; risky commands guard `|| allow`.
#
# BLOCK PROTOCOL (verified against the Claude Code hooks docs): a Stop hook blocks by printing
# {"decision":"block","reason":"…"} to stdout and exiting 0. `reason` is fed back to the model. allow()
# is exit 0 with NO stdout. `reason` is always a STATIC string below — never interpolated payload.
#
# BLOCK-ONCE (Decision 5) uses Claude Code's built-in `stop_hook_active` (true when the model is already
# continuing because a Stop hook blocked) — no marker file needed.
#
# THE CONSULT SKIP IS STRUCTURAL (Decision 7, safety-critical): registered on `Stop` ONLY, never
# `SubagentStop`, so it NEVER runs in a spawned consult, where AskUserQuestion is absent (ADR-021) and a
# block would be unescapable.
#
# CHECK A'S "no AskUserQuestion this turn" SIGNAL comes from a PreToolUse MARKER, not the transcript
# (path 2 — a Stop payload has no tool-call list; the transcript lags and is version-fragile). The
# sibling askuserquestion-marker-hook.sh touches $cwd/.fkit/state/askuq-<session_id> when the tool is
# called; here we read it (= tool used this turn → suppress check A) and CONSUME it. A missing marker is
# trusted as "no tool" ONLY when the marker infra is demonstrably present (the state dir exists);
# otherwise we cannot trust it and fail open (suppress check A) — so a broken marker never false-blocks.
set -u

allow() { exit 0; }   # allow the turn to complete: exit 0, NO stdout.
block() {             # block ONCE with a corrective message. $1 is static (JSON-safe as-is).
  printf '{"decision":"block","reason":"%s"}\n' "$1"
  exit 0
}

extract_top() {   # first top-level "<key>":"<value>" string match
  printf '%s' "$1" | grep -o "\"$2\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | head -1 \
    | sed 's/.*:[[:space:]]*"\(.*\)"/\1/'
}
extract_bool() {  # first "<key>":true|false → true|false (unquoted JSON literal)
  printf '%s' "$1" | grep -oE "\"$2\"[[:space:]]*:[[:space:]]*(true|false)" | head -1 \
    | grep -oE 'true|false'
}
is_identifier() { case "$1" in '') return 1 ;; *[!A-Za-z0-9_.-]*) return 1 ;; *) return 0 ;; esac; }

# --- read the payload once; any failure fails OPEN --------------------------------------------------
payload="$(cat)" || allow
[ -n "$payload" ] || allow

# --- defensive: registered on Stop only; an explicitly different event fails open -------------------
event="$(extract_top "$payload" hook_event_name)"
case "$event" in ''|Stop) : ;; *) allow ;; esac

# --- CONSUME the AskUserQuestion marker (before any skip, so it can never leak to the next turn) -----
# marker present ⇒ the tool WAS used this turn. marker_infra_ok ⇒ we can trust a MISSING marker.
# ⚠️ The state dir must be WRITABLE, not merely present (R4): the dir is created by the launcher, so its
# mere existence does NOT prove the marker hook could record. If it is not writable, a marker write
# would have failed and its absence is untrustworthy — so we treat the infra as not-ok and fail OPEN
# (suppress check A). This closes the "dir exists but unwritable" false-block corner in the safe
# direction. (Residual, accepted: a mid-session cwd change between the PreToolUse write and this Stop
# read is not detectable here — genuinely exotic; see review.md.)
session_id="$(extract_top "$payload" session_id)"
cwd="$(extract_top "$payload" cwd)"
had_marker=0
marker_infra_ok=0
if [ -n "$cwd" ] && is_identifier "$session_id" && [ -d "$cwd/.fkit/state" ] && [ -w "$cwd/.fkit/state" ]; then
  marker_infra_ok=1
  marker="$cwd/.fkit/state/askuq-$session_id"
  [ -e "$marker" ] && had_marker=1
  rm -f "$marker" 2>/dev/null || :          # consume — turn-scoped
fi

# --- SKIP 1: already blocked once this turn (Decision 5, built-in loop guard) -----------------------
[ "$(extract_bool "$payload" stop_hook_active)" = "true" ] && allow

# --- SKIP 2: the adversarial reviewer — findings-only contract (Decision 7) -------------------------
agent_type="$(extract_top "$payload" agent_type)"
[ "$agent_type" = "fkit-adversarial-reviewer" ] && allow

# --- SKIP 3: the autonomous ship-loop(s) (Decision 7) — detected by a SESSION MARKER, transcript-free.
# The shiploop-marker-hook.sh (a UserPromptExpansion hook) writes $cwd/.fkit/state/shiploop-<session_id>
# when a ship-loop command is INVOKED (authoritative `command_name`, task 0129). Reading that marker
# replaced the old transcript-substring scan, which over-skipped whenever the command text appeared as
# transcript CONTENT — a file read / tool_result / attachment — silently disabling the hook (0127 R8),
# and under-skipped on a missing/lagging transcript (R6). The marker is authoritative for BOTH loops
# (`/fkit-task-ship-loop` and `/fkit-sprint-ship-loop`, per 0116) and needs no transcript at all.
# Fail-open direction preserved: a missing marker ⇒ NOT a loop turn ⇒ enforce normally; a genuine loop
# turn whose marker could not be written is an R6-class bounded under-skip (block-once-escapable), never
# a false block. $cwd/$session_id were already extracted (and validated) above for the askuq marker.
if [ -n "$cwd" ] && is_identifier "$session_id" && [ -e "$cwd/.fkit/state/shiploop-$session_id" ]; then
  allow
fi

# --- both checks need a non-empty final assistant message; absent / null / empty / blank → fail open (R2)
# Tolerates whitespace after the colon, a literal JSON null, and a whitespace-only value, all of which
# an earlier guard missed. A message with no visible text is nothing to enforce against.
case "$payload" in *'"last_assistant_message"'*) : ;; *) allow ;; esac
printf '%s' "$payload" | grep -qE '"last_assistant_message"[[:space:]]*:[[:space:]]*(null|"[[:space:]]*")' && allow

# --- CHECK B (exact): the literal "What's next?" heading must be present -----------------------------
# Searched against the WHOLE raw payload (not a truncation-prone extracted substring): erring toward
# FINDING the heading errs toward NOT blocking, the safe direction.
whats_next_missing=1
case "$payload" in *"What's next?"*) whats_next_missing=0 ;; esac

# --- CHECK A (heuristic): a prose question to the owner, with no AskUserQuestion this turn -----------
# has_question (R3): a LINE ending in '?', excluding code-fenced lines, '>' block-quotes, and any line
# carrying the "What's next?" heading. The value is a single JSON line whose newlines are literal 2-char
# "\n" sequences, so awk splits on /\\n/ to recover logical lines. Extraction truncation only ever DROPS
# lines (fewer fires) — the safe direction.
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

# --- decide: at most one block, combining whichever fired -------------------------------------------
REASON_B="Close your reply with a 'What's next?' section (place it after any prescribed output shape, never instead of one). If nothing is pending, say so in a few words."
REASON_A="You put a question to the owner in prose. In a session, ask it with the AskUserQuestion tool; in a spawned consult, return the open questions in your reply instead."

if [ "$whats_next_missing" = 1 ] && [ "$check_a" = 1 ]; then
  block "$REASON_A $REASON_B"
elif [ "$whats_next_missing" = 1 ]; then
  block "$REASON_B"
elif [ "$check_a" = 1 ]; then
  block "$REASON_A"
fi
allow
