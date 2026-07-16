#!/bin/bash
# skill-ownership-hook.sh — the PreToolUse skill-ownership gate (task 43 / ADR-018).
#
# Denies a `Skill` tool call whenever the REAL invoking agent's role does not own the requested
# skill, per skills_for_role() — the single source of truth (skills-for-role.sh). Reads the hook
# payload's own `agent_type` field, which Claude Code populates with the actual calling context's
# identity (a role session launched with `--agent fkit-<role>`, or a spawned subagent's own type),
# at ANY spawn depth — confirmed empirically (2026-07-16) at 0, 1, and 2 hops: a sub-subagent's own
# `agent_type` is its own, never its caller's. This is what makes enforcement follow the real caller
# instead of the launching session's inherited settings (ADR-012's bug class).
#
# ⚠️ DENY IS THE `hookSpecificOutput.permissionDecision` JSON ROUTE — owner decision, 2026-07-16,
# resolving round-1 review R1. History, so the next reader doesn't re-litigate it:
#   - The FIRST version of this hook used `exit 2`. An early comment here claimed the documented JSON
#     route (`{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny",...}}`
#     on stdout, exit 0) was "silently ignored" — that was WRONG. Live-verified, twice, against the
#     real binary: the JSON route DOES block the call, but ONLY if `hookEventName` is present and
#     exactly right. The first test (which produced the false claim) omitted that one field.
#   - That left shipped code (`exit 2`) contradicting ADR-018 Decision 3's adopted text verbatim:
#     "an explicit `hookSpecificOutput.permissionDecision` deny... Never a bare exit code standing in
#     for the decision." Round-1 review (R1) caught this as a live ADR/code mismatch, not just a
#     stale comment. Owner decision: implement the JSON route, matching Decision 3 as written — no
#     ADR edit needed, since the ADR already mandated this; it was the code that had diverged.
#   - Known, accepted tradeoff: the JSON route has a schema `exit 2` didn't — get `hookEventName` (or
#     any other required field) wrong in a future edit and the call could fail OPEN instead of
#     denying, silently. Every value interpolated into a deny's JSON below has ALREADY passed
#     is_identifier() (a closed charset: letters, digits, `-`, `_`, `.` — no quotes, backslashes, or
#     newlines), so it can never break the JSON string it's placed into. The test suite
#     (test/skill-ownership-hook.test.js) pins the exact JSON shape, not just an exit code, for
#     exactly this reason — do not weaken those assertions to "exit 0" alone.
#
# Every code path below MUST end by calling deny() or allow() — nothing may fall through to a bare,
# unhandled exit. `set -u` (not `-e`): a failing command must be caught and turned into an explicit
# deny, not silently skip the rest of the script and exit 0 by accident.
set -u

here="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=./skills-for-role.sh
. "$here/skills-for-role.sh"

deny() {   # deny <reason> — the ONLY mechanism that actually blocks the call: an explicit
           # hookSpecificOutput.permissionDecision:"deny" JSON on stdout, exit 0. See header.
           # $1 is always either a static string or built from values already passed through
           # is_identifier() — never raw, unvalidated payload content — so it is always safe to place
           # directly inside a JSON string value with no further escaping.
  printf 'skill-ownership-hook: DENY — %s\n' "$1" >&2
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"%s"}}\n' "$1"
  exit 0
}
allow() {
  exit 0
}

# --- read the payload once (stdin can only be read once) ------------------------------------------
payload="$(cat)" || deny "failed to read hook payload from stdin"
[ -n "$payload" ] || deny "empty hook payload"

# --- narrow, safe field extraction, deliberately WITHOUT jq ----------------------------------------
# This hook parses harness-generated JSON, not free-form user text: every field it needs (tool_name,
# agent_type, tool_input.skill) is a simple identifier string — never arbitrary content a user
# controls. A full JSON parser (jq) would be the safer general-purpose choice for arbitrary JSON, but
# isn't needed for this narrow, known shape, and this repo deliberately hand-rolls JSON handling
# elsewhere (dashboard.sh, fkit-claude.sh) rather than depending on jq. Every extracted value is
# validated against a strict identifier charset before use (is_identifier); anything that doesn't
# match denies rather than risking a misparse. `grep -o` (not a single greedy `sed` substitution) is
# used deliberately: a greedy `.*` pattern matches the LAST occurrence of a repeated key in the
# payload, not necessarily the intended one — `grep -o | head -1` takes the first (leftmost) match,
# matching document order, which is what every field here needs.
extract_top() {   # extract_top <payload> <key> → first top-level "<key>":"<value>" match
  printf '%s' "$1" | grep -o "\"$2\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | head -1 \
    | sed 's/.*:[[:space:]]*"\(.*\)"/\1/'
}
extract_tool_input_skill() {   # narrows to the tool_input object first (bounded — no nested braces
                                # expected in a Skill call's tool_input), THEN extracts "skill" from
                                # within it, so a same-named key elsewhere in the payload can't collide.
  obj="$(printf '%s' "$1" | grep -o '"tool_input"[[:space:]]*:[[:space:]]*{[^}]*}' | head -1)"
  printf '%s' "$obj" | grep -o '"skill"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 \
    | sed 's/.*:[[:space:]]*"\(.*\)"/\1/'
}
is_identifier() {   # is_identifier <value> — safe charset only: letters, digits, hyphen, underscore, dot
  case "$1" in
    '') return 1 ;;
    *[!A-Za-z0-9_.-]*) return 1 ;;
    *) return 0 ;;
  esac
}

# --- gate: only the Skill tool is in scope ---------------------------------------------------------
# Defensive, not load-bearing: the hook is registered with matcher "Skill" in build_settings(), so
# this should never see another tool — but a future matcher misconfiguration must not silently open
# the gate for every other tool. Anything that isn't cleanly identifiable as the Skill tool is denied,
# not allowed — "unsure what this is" is not a reason to let it through.
tool_name="$(extract_top "$payload" tool_name)"
is_identifier "$tool_name" || deny "unparseable or missing tool_name"
case "$tool_name" in
  Skill) : ;;
  *) deny "unexpected tool_name '$tool_name' reached a hook registered for Skill only" ;;
esac

# --- gate: only fkit-* skills are governed by role ownership -------------------------------------
# A project's own or the user's own skills are untouched — matches the existing scope of the
# lockdown (fkit-claude.sh's build_settings() never touched non-fkit-* skills either).
skill_name="$(extract_tool_input_skill "$payload")"
is_identifier "$skill_name" || deny "unparseable or missing tool_input.skill"
case "$skill_name" in
  fkit-*) : ;;
  *) allow ;;
esac

# --- resolve the REAL caller's role ----------------------------------------------------------------
# `agent_type` is present when the calling context has one: a session launched with `--agent
# fkit-<role>` (fkit-claude.sh always does), or any spawned subagent (its OWN type, at any depth —
# empirically confirmed, not merely assumed). It is ABSENT for a plain, unrolled `claude` session
# with no --agent flag. That case is denied for any fkit-* skill, not allowed: a plain session
# carries no ADR-010 lockdown context at all, and today (pre-hook) it fails OPEN — every fkit skill
# live. This hook deliberately makes that fail CLOSED instead, consistent with the philosophy already
# stated elsewhere in fkit-claude.sh ("an unroled session carries no ADR-010 lockdown... refusing is
# the safe answer") — a strengthening, not a side effect to bury.
agent_type="$(extract_top "$payload" agent_type)"
if ! is_identifier "$agent_type"; then
  deny "no agent_type in payload — cannot determine caller identity for fkit-* skill '$skill_name'"
fi

role="${agent_type#fkit-}"
if [ "$role" = "$agent_type" ]; then
  deny "agent_type '$agent_type' is not an fkit-* agent; denying fkit-* skill '$skill_name'"
fi

# --- the actual ownership check: skills_for_role() is the ONLY source of truth --------------------
# Universal skills (fkit-team, fkit-query) are already listed in every role's own skills_for_role()
# output, so they need no special-casing — they're simply owned by every role.
owned=" $(skills_for_role "$role") "
case "$owned" in
  *" $skill_name "*) allow ;;
  *) deny "role '$role' does not own skill '$skill_name'" ;;
esac
