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
# ⚠️ CHANGING A ROLE'S SKILLS? FOUR hand-maintained places MIRROR this list for humans and MUST be
# updated in the same commit, or the docs lie about what a role can do:
#   * claude/skills/fkit-team/SKILL.md  — the roster the /fkit-team skill prints
#   * claude/README.md                  — the skill-ownership table
#   * claude/scaffold/CLAUDE.md         — SHIPS INTO EVERY CONSUMING PROJECT's root CLAUDE.md
#   * ai-agents/knowledge-base/architecture.md — the skill count and the role/skill table
#
# ⚠️ THIS LIST SAID "TWO" UNTIL 2026-07-18, AND THE OMISSION COST EXACTLY WHAT IT LOOKS LIKE IT WOULD.
# Task 70 followed the two-item list precisely and still shipped a false statement into every consuming
# project (scaffold/CLAUDE.md asserted the lead role has "only" two skills, which had just stopped being
# true). A checklist that is itself incomplete is worse than no checklist: it is followed, and it fails.
# If you add a fifth mirror, add it HERE FIRST.
# (Same caution as before this file existed — see git history on fkit-claude.sh for the original.)

# ⚠️ THE TASK MOVERS ARE OWNED BY EVERY ROLE BUT ONE (ADR-025, 2026-07-19).
# `fkit-task-done` / `fkit-task-cancelled` used to be producer-only, and that was the anti-laundering
# gate: an agent could not mark its own work complete. ADR-025 removed the gate knowingly — any spawned
# role may now close a task. This list is what makes that true; the movers' own prose cannot grant a
# permission the hook denies (the contradiction Codex found as X1 before task 64 shipped).
#
# `adversarial-reviewer` is DELIBERATELY EXCLUDED (owner ruling, 2026-07-19). Its contract is
# findings-only, it never edits anything, and it runs on Codex under a restricted tool allowlist
# (ADR-022). Excluding it is intentional — do NOT "fix" it by adding the movers here.
skills_for_role() {
  case "$1" in
    lead)      echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-task-done fkit-task-cancelled" ;;
    producer)  echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-initiate-project fkit-task-brief fkit-task-done fkit-task-cancelled fkit-status" ;;
    coder)     echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-plan-task fkit-process-review fkit-process-stateful-review fkit-task-ship-loop fkit-task-done fkit-task-cancelled" ;;
    architect) echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-survey-project fkit-inspect fkit-design-spec fkit-evaluate-approach fkit-record-decision fkit-task-done fkit-task-cancelled" ;;
    reviewer)  echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-review fkit-stateful-review fkit-task-done fkit-task-cancelled" ;;
    adversarial-reviewer) echo "fkit-team fkit-query fkit-adversarial-review" ;;
    wiki)      echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-wiki-ingest fkit-wiki-lint fkit-wiki-sync fkit-task-done fkit-task-cancelled" ;;
    *)         echo "" ;;
  esac
}
