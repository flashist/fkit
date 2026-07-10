# Sprint 1 — Ship the onboarding sequence

**Source**: `ai-agents/sprints/plan-sprint-1.md`
**Status**: in-progress
**Sprint/Tag**: Sprint 1

## Goal
Close the loop on fkit's startup sequence: verify the user-facing onboarding flow end-to-end, document the consult-chain envelope, and land the initial CI validation for bundle frontmatter.

## Key Changes
- The sprint is owner-ranked around onboarding verification, consult-chain documentation, and CI validation.
- Task 4 is already done: placeholder text was removed from `CLAUDE.md` and `AGENTS.md`.
- Task 9 is already done: `fkit reconnect` was added as a stopgap for disconnected subagent runners.
- Later addenda extended the plan with the consult-title decision, the 2026-07-10 runner-disconnect incident, and the follow-on doc/task items that came out of that investigation.
- The plan explicitly defers skill-set expansion, structural role-boundary enforcement, and a `npx fkit` installer.
- A concurrent roster change may remove the eager `adversarial-reviewer` bootstrap, so any "six teammates" wording needs to be checked against that before dependent work lands.

## Outcome
Sprint 1 is the live coordination point for onboarding and reliability hardening. The doc now captures both the original priority stack and the later addenda so future work can distinguish completed cleanup from still-open backlog and upstream-only bugs.

## Related
- [[systems/fkit]]
- [[systems/subagent-runner-connectivity]]
- [[tasks/fix-claude-agents-md-placeholder-text]]
- [[tasks/build-fkit-reconnect-tooling]]
- [[decisions/adr-003-ci-runs-validate-bundles]]
- [[decisions/adr-004-fixed-role-based-titles-for-consult-spawns]]
