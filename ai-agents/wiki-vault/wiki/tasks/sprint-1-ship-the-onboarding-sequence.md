# Sprint 1 — Ship the onboarding sequence

**Source**: `ai-agents/sprints/done/sprint-1.md`
**Status**: cancelled
**Sprint/Tag**: Sprint 1

> ## 🔒 CLOSED — 2026-07-11. Superseded by [[tasks/sprint-2-remove-omnigent]].
> Sprint 1 was **entirely Omnigent-path work** and has no awareness of ADR-008 / ADR-009 / ADR-010.
> The owner ruled that fkit drops Omnigent and goes Claude Code native only — **most of this sprint's
> premise died with that decision.**
>
> **The plan is kept, not deleted — it is the record of what was attempted.** Do not pick up work
> from it. Note its source file **moved**: `sprints/plan-sprint-1.md` → `sprints/done/sprint-1.md`.

## Goal
Close the loop on fkit's startup sequence: verify the user-facing onboarding flow end-to-end, document the consult-chain envelope, and land CI validation for bundle frontmatter. Sprint 1 was framed as *"the first draft of fkit"* — deliberately adaptive, with scope expected to shift as work surfaced new priorities.

## Key Changes
- Owner-ranked around onboarding verification, consult-chain documentation, and CI validation.
- Two tasks landed and stuck: [[tasks/fix-claude-agents-md-placeholder-text]] and [[tasks/build-fkit-reconnect-tooling]].
- Later addenda extended the plan with the consult-title decision ([[decisions/adr-004-fixed-role-based-titles-for-consult-spawns]]), the 2026-07-10 runner-disconnect incident ([[systems/subagent-runner-connectivity]]), and the follow-on items from that investigation.
- Skill-set expansion was brought back into scope (owner reversal, 2026-07-10).

## Outcome
**Closed, not completed.** A blanket cancel would have dropped live work, so its 12 backlog tickets were dispositioned individually:

- **5 cancelled** — died with Omnigent: [[tasks/add-ci-validate-bundles]], [[tasks/amend-subagent-disconnect-incident-doc]], [[tasks/document-consult-chain-envelope]], [[tasks/fix-agent-count-doc-drift-and-fresh-detection-dup]], [[tasks/remove-adversarial-reviewer-eager-spawn]].
- **2 closed as Done** — already complete in code, verified by the doc-drift audit: [[tasks/give-every-agent-direct-wiki-query-access]], [[tasks/rollout-adr-004-fixed-consult-titles]].
- **5 carried into Sprint 2** (runtime-independent; two rescoped): [[tasks/verify-onboarding-flow-end-to-end]] (reframed into the release gate), [[tasks/bake-architecture-pointer-into-scaffold-templates]] (retargeted to `claude/scaffold/`), [[tasks/extend-initiate-project-fill-overview]], [[tasks/add-task-plan-skill-to-producer]], [[tasks/formalize-knowledge-base-incidents-folder]].

**The lesson that outlived it:** *the sprint's premise, not just its tasks, can be invalidated by a decision.* Cancelling per-ticket rather than wholesale is what saved five live pieces of work.

⚠️ **Known defect in this file:** its `➡️ Moved to Sprint 2` rows carry **6 broken links**, still pointing at `tasks/backlog/…` for tasks since completed into `tasks/done/`. The one-off repair is still open (`ai-agents/tasks/backlog/repair-broken-links-in-closed-sprint-plans.md`); the recurrence — the real bug — was fixed by [[tasks/harden-task-movers-against-closed-sprint-link-rot]].

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[systems/fkit]]
- [[systems/subagent-runner-connectivity]]
- [[tasks/fix-claude-agents-md-placeholder-text]]
- [[tasks/build-fkit-reconnect-tooling]]
- [[decisions/adr-003-ci-runs-validate-bundles]]
- [[decisions/adr-004-fixed-role-based-titles-for-consult-spawns]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[tasks/repair-broken-links-in-closed-sprint-plans]]
