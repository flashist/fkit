#!/bin/bash
# shiploop-marker-hook.sh — a UserPromptExpansion marker hook (task 0129 / ADR-030).
#
# Records a session-scoped marker when an autonomous ship-loop is INVOKED as a slash command, so the
# ADR-030 `Stop` hook (turn-completion-hook.sh) can tell — RELIABLY — that a ship-loop is driving this
# session, WITHOUT scanning the transcript. This replaces the transcript-substring scan the Stop hook
# used, which over-skipped whenever the command marker text appeared as transcript *content* (a file
# read, tool_result, attachment, or pasted excerpt) and silently disabled the hook (task 0127 review R8).
#
# `UserPromptExpansion` is the one hook event that fires on a DIRECT `/command` invocation and carries an
# AUTHORITATIVE `command_name` — set only for a real slash-command invocation (`expansion_type` ==
# "slash_command"), never for the command string appearing in prose/attachments (verified against the
# Claude Code hooks docs, 2026-07-23). `UserPromptSubmit` and `PreToolUse` do NOT carry it. Sibling of
# askuserquestion-marker-hook.sh (task 0127); wired by the same build_settings().
#
# ⚠️ RECORDS ONLY — NEVER BLOCKS. A UserPromptExpansion hook that recorded a marker must not interfere
# with the command it observes. Every path exits 0 with no stdout. `set -u`.
#
# The marker PERSISTS for the session (a ship-loop session's whole point is the loop — the same semantics
# the transcript marker had, minus the content-collision). It is keyed by session_id, so a fresh session
# (new id) has no marker and enforces normally; dead-session marker files are inert (never matched by a
# new id). A write that fails simply leaves no marker — the Stop hook then does NOT skip and enforces
# (an R6-class bounded under-skip, block-once-escapable), never a false block.
set -u

allow() { exit 0; }   # allow the command to proceed, record nothing more: exit 0, no stdout.

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

# Only a real slash-command invocation is in scope. expansion_type gates out mcp_prompt / anything else;
# command_name is authoritative. Self-check both rather than trusting the settings matcher.
[ "$(extract_top "$payload" expansion_type)" = "slash_command" ] || allow

# command_name is the skill name, normally WITHOUT a leading slash (e.g. "fkit-task-ship-loop"); strip a
# leading "/" defensively so both forms match.
command_name="$(extract_top "$payload" command_name)"
command_name="${command_name#/}"
case "$command_name" in
  fkit-task-ship-loop|fkit-sprint-ship-loop) : ;;
  *) allow ;;
esac

# Need a safe session id and a cwd to key/place the marker. Either missing or unsafe → record nothing
# (the Stop hook then enforces normally — the safe direction).
session_id="$(extract_top "$payload" session_id)"
cwd="$(extract_top "$payload" cwd)"
is_identifier "$session_id" || allow
[ -n "$cwd" ] && [ -d "$cwd" ] || allow

# Best-effort marker write. Never let a failure surface or change the exit status.
mkdir -p "$cwd/.fkit/state" 2>/dev/null && : > "$cwd/.fkit/state/shiploop-$session_id" 2>/dev/null
allow
