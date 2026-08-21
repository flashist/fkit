# skills-for-role.sh — the single source of truth for fkit role → skill ownership.
#
# Extracted from fkit-claude.sh (`0052` (`implement-pretooluse-skill-ownership-hook`) / ADR-018) so it can be `source`d from the PreToolUse
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

# ⚠️ THE TASK MOVERS ARE PRODUCER-ONLY (ADR-033, 2026-07-23 — REVERSING ADR-025).
# `fkit-task-done` / `fkit-task-cancelled` belong to `producer` and to NO other role. ADR-025
# (2026-07-19) had granted them to every role but the adversarial reviewer; ADR-033 reverses that
# knowingly, re-consolidating close authority in the one role whose job is the task lifecycle. This
# list is what makes it STRUCTURAL: the ADR-018 PreToolUse hook denies a mover call from any
# non-producer identity at any spawn depth, so it is no longer the prose ADR-025 relied on.
#
# Every other role ROUTES ITS CLOSES THROUGH THE PRODUCER and closes nothing itself — the coder
# ship-loop and the lead's sprint ship-loop each spawn `@fkit-producer` to close (ADR-033 §3/§4).
# A producer SPAWNED to close still writes `(agent-closed — not owner-verified)` (ADR-033 §5).
#
# ⚠️ What this does and does NOT buy (ADR-033 §The limit — do not "harden" past it): it restores
# separation of the closing IDENTITY, not full prevention. A determined doer can still spawn a
# producer to close. That residual is accepted and named; it is not a defect to file.
#
# `adversarial-reviewer` never had the movers and still does not — its contract is findings-only and
# it runs on Codex under a restricted tool allowlist (ADR-022). It is now one of six roles without
# them rather than the lone exclusion, but the ruling behind it (owner, 2026-07-19) stands: do NOT
# "fix" it by adding the movers here.
#
# The movers' own prose cannot grant a permission this mapping denies — that contradiction (Codex
# found it as X1 before task 64 shipped) is why the SKILLs, the mirrors and this file move together.
skills_for_role() {
  case "$1" in
    lead)      echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-sprint-ship-loop" ;;
    producer)  echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-initiate-project fkit-task-brief fkit-task-done fkit-task-cancelled fkit-status fkit-heal" ;;
    coder)     echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-plan-task fkit-process-review fkit-process-stateful-review fkit-task-ship-loop" ;;
    architect) echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-survey-project fkit-inspect fkit-design-spec fkit-evaluate-approach fkit-record-decision" ;;
    reviewer)  echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-review fkit-stateful-review" ;;
    adversarial-reviewer) echo "fkit-team fkit-query fkit-adversarial-review" ;;
    wiki)      echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-wiki-ingest fkit-wiki-lint fkit-wiki-sync" ;;
    *)         echo "" ;;
  esac
}
