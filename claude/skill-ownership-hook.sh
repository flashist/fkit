#!/bin/bash
# PreToolUse gate (ADR-018): deny a Skill call when the caller's own role does not own the skill.
# agent_type is the caller's own at any depth; with no depth field, a 2-hop leaf and a session look alike.

# ⚠️ Deny only via hookSpecificOutput JSON with an exact hookEventName — a wrong field fails OPEN silently
# (0052 review R1). test/skill-ownership-hook.test.js pins the JSON shape; never weaken it to exit codes.

# Every path ends in deny() or allow(). set -u, not -e: an error must become a deny (ADR-018 Decision 3).
set -u

here="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=./skills-for-role.sh
. "$here/skills-for-role.sh"

# $1 is static or already passed is_identifier(), so it is safe inside the JSON string unescaped.
deny() {
  printf 'skill-ownership-hook: DENY — %s\n' "$1" >&2
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"%s"}}\n' "$1"
  exit 0
}
allow() {
  exit 0
}

payload="$(cat)" || deny "failed to read hook payload from stdin"
[ -n "$payload" ] || deny "empty hook payload"

# jq-free on purpose: every field read is identifier-shaped and is checked by is_identifier before use.
# grep -o | head -1 takes the first match; a greedy sed would take the last.
extract_top() {
  printf '%s' "$1" | grep -o "\"$2\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | head -1 \
    | sed 's/.*:[[:space:]]*"\(.*\)"/\1/'
}
# Narrow to tool_input first so a same-named key elsewhere cannot collide.
extract_tool_input_skill() {
  obj="$(printf '%s' "$1" | grep -o '"tool_input"[[:space:]]*:[[:space:]]*{[^}]*}' | head -1)"
  printf '%s' "$obj" | grep -o '"skill"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 \
    | sed 's/.*:[[:space:]]*"\(.*\)"/\1/'
}
is_identifier() {
  case "$1" in
    '') return 1 ;;
    *[!A-Za-z0-9_.-]*) return 1 ;;
    *) return 0 ;;
  esac
}

# Defensive: the hook is registered with matcher "Skill" in build_settings(), but a misconfigured
# matcher must not open the gate for other tools.
tool_name="$(extract_top "$payload" tool_name)"
is_identifier "$tool_name" || deny "unparseable or missing tool_name"
case "$tool_name" in
  Skill) : ;;
  *) deny "unexpected tool_name '$tool_name' reached a hook registered for Skill only" ;;
esac

# Non-fkit skills (the project's or the user's own) are out of scope.
skill_name="$(extract_tool_input_skill "$payload")"
is_identifier "$skill_name" || deny "unparseable or missing tool_input.skill"
case "$skill_name" in
  fkit-*) : ;;
  *) allow ;;
esac

# No agent_type means a plain, unrolled session: fail CLOSED for fkit-* skills (ADR-018).
agent_type="$(extract_top "$payload" agent_type)"
if ! is_identifier "$agent_type"; then
  deny "no agent_type in payload — cannot determine caller identity for fkit-* skill '$skill_name'"
fi

role="${agent_type#fkit-}"
if [ "$role" = "$agent_type" ]; then
  deny "agent_type '$agent_type' is not an fkit-* agent; denying fkit-* skill '$skill_name'"
fi

# Universal skills need no special case: every role's list already includes them.
owned=" $(skills_for_role "$role") "
case "$owned" in
  *" $skill_name "*) allow ;;
  *) deny "role '$role' does not own skill '$skill_name'" ;;
esac
