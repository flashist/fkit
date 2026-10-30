# The canonical role → load-permission map (ADR-018); source it so native and MCP gates cannot drift.
# The PreToolUse hook sources it, so it must stay free of top-level side effects.

# ⚠️ CHANGING A ROLE'S SKILLS? These hand-maintained places MIRROR this list (or a role fact it carries)
# for humans and MUST be updated in the same commit, or the docs lie about what a role can do:
#   * claude/skills/fkit-team/SKILL.md  — the roster the /fkit-team skill prints
#   * claude/README.md                  — the skill-ownership table
#   * claude/scaffold/CLAUDE.md         — SHIPS INTO EVERY CONSUMING PROJECT's root CLAUDE.md
#   * ai-agents/knowledge-base/architecture.md — the skill count and the role/skill table
#   * test/skill-ownership-hook.test.js — OWNED, the hard-coded mirror the hook test asserts against
#   * claude/fkit-claude-init.sh        — the printed role roster (mirrors the role list and the lock
#                                         invariant, not the per-role skill lists; nothing tests it)
#   * claude/agents/fkit-lead.md      — direct and delegated lead capabilities
#   * codex/materialize.mjs            — generated roster/runtime entry explanations
#   * codex/fkit.mjs, codex/README.md   — preview labels and configured-runtime docs
#
# ⚠️ THIS LIST SAID "TWO" UNTIL 2026-07-18, AND THE OMISSION COST EXACTLY WHAT IT LOOKS LIKE IT WOULD.
# Task 70 followed the two-item list precisely and still shipped a false statement into every consuming
# project (scaffold/CLAUDE.md asserted the lead role has "only" two skills, which had just stopped being
# true). A checklist that is itself incomplete is worse than no checklist: it is followed, and it fails.
# If you add another mirror, add it HERE FIRST. (It said "FOUR" until 2026-08-27 — incomplete a second time; 0142 D4.)
# (Same caution as before this file existed — see git history on fkit-claude.sh for the original.)

# ⚠️ The four movers are producer-only (ADR-033; sprint movers ADR-047 §4); the hook makes that structural.
# It separates the closing identity only — ADR-033 "The limit"; do not harden past it.

# Never give adversarial-reviewer the movers (ADR-025 amendment A2, kept by ADR-033).
# A mover's SKILL.md cannot grant what this map denies: change the skills, the mirrors and this file together.
# Lead's status/sync/lint entries forward only; execution remains producer/wiki duty.
skills_for_role() {
  case "$1" in
    lead)      echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-sprint-ship-loop fkit-status fkit-wiki-sync fkit-wiki-lint" ;;
    producer)  echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-initiate-project fkit-task-brief fkit-task-done fkit-task-cancelled fkit-sprint-done fkit-sprint-cancelled fkit-status fkit-heal" ;;
    coder)     echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-plan-task fkit-process-review fkit-process-stateful-review fkit-task-ship-loop" ;;
    architect) echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-survey-project fkit-inspect fkit-design-spec fkit-evaluate-approach fkit-record-decision" ;;
    reviewer)  echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-review fkit-stateful-review" ;;
    adversarial-reviewer) echo "fkit-team fkit-query fkit-adversarial-review" ;;
    wiki)      echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-wiki-ingest fkit-wiki-lint fkit-wiki-sync" ;;
    *)         echo "" ;;
  esac
}
