# skills-for-role.sh — the single source of truth for fkit role → skill ownership.
#
# Extracted from fkit-claude.sh (task 43 / ADR-018) so it can be `source`d from the PreToolUse
# skill-ownership hook (claude/skill-ownership-hook.sh) WITHOUT pulling in fkit-claude.sh's top-level
# side effects — the self-hosting re-exec, the network update check, and its `$0`/`$PWD`-dependent
# logic must never fire just because a hook sourced this file. This file has none: it only defines
# the function below.
#
# This is the ONLY place role→skill ownership is expressed. Do not duplicate this mapping anywhere
# else (not in the hook script, not in a settings-generation helper) — source this file instead.
#
# ⚠️ CHANGING A ROLE'S SKILLS? Two hand-maintained tables MIRROR this list for humans and MUST be
# updated in the same commit, or the docs lie about what a role can do:
#   * claude/skills/fkit-team/SKILL.md  — the roster the /fkit-team skill prints
#   * claude/README.md                  — the skill-ownership table
# (Same caution as before this file existed — see git history on fkit-claude.sh for the original.)

skills_for_role() {
  case "$1" in
    lead)      echo "fkit-team fkit-query" ;;
    producer)  echo "fkit-team fkit-query fkit-initiate-project fkit-task-brief fkit-task-done fkit-task-cancelled fkit-status" ;;
    coder)     echo "fkit-team fkit-query fkit-plan-task fkit-process-review fkit-process-stateful-review fkit-task-ship-loop" ;;
    architect) echo "fkit-team fkit-query fkit-survey-project fkit-inspect fkit-design-spec fkit-evaluate-approach fkit-record-decision" ;;
    reviewer)  echo "fkit-team fkit-query fkit-review fkit-stateful-review" ;;
    adversarial-reviewer) echo "fkit-team fkit-query fkit-adversarial-review" ;;
    wiki)      echo "fkit-team fkit-query fkit-wiki-ingest fkit-wiki-lint fkit-wiki-sync" ;;
    *)         echo "" ;;
  esac
}
