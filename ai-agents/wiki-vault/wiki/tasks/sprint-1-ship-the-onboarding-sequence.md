# Sprint 1 — Ship the onboarding sequence

**Source**: `ai-agents/sprints/plan-sprint-1.md`
**Status**: in-progress
**Sprint/Tag**: Sprint 1

## Goal
Close the loop on fkit's startup sequence: verify the public onboarding flow end-to-end, document the consult-chain envelope, and land the initial CI check for bundle validation.

## Key Changes
The sprint is ordered by owner priority:
- Verify onboarding flow end-to-end.
- Document the consult-chain envelope.
- Add CI to run `omnigent/validate-bundles.sh`.

The plan also captures the explicit deferrals for this sprint: expanding skill sets, structural role-boundary enforcement, and an `npx fkit` installer.

## Context
The sprint plan was later extended with an addendum that appended follow-on work after the owner's original 1-3 ranking rather than renumbering the list. Task 4 is complete, tasks 6-7 close the repeated placeholder-text problem at the source, and task 8 is explicitly optional.

The follow-up note also tracks a concurrent task 5 change from a separate conversation: dropping the eager adversarial-reviewer bootstrap reduces the standing roster, so any later wording that refers to "six teammates" should be checked against that change before task 8 lands.

## Outcome
Sprint 1 establishes the baseline onboarding workstream for the dogfood project. The onboarding verification, consult-envelope, and CI briefs remain backlog items, while the documentation cleanup task is already done.

## Related
- [[systems/fkit]]
- [[tasks/fix-claude-agents-md-placeholder-text]]
