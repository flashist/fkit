# Implement the `PreToolUse` skill-ownership gate (the hook-flip)

**Source**: `ai-agents/tasks/done/implement-pretooluse-skill-ownership-hook.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 43

## Goal
Build the hook that [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] adopted, fixing the live coder → reviewer bug: a spawned subagent inherited the *launching* session's `skillOverrides`, not its own role's. Generalizes the fix instead of adding a second hand-maintained `CONSULT_SKILLS` exception for every future role pair. **Depended hard on task 42** (the ADR) — building against an unsettled decision is what the design-then-implement split prevents.

## Key Changes
- **A `PreToolUse` hook on the `Skill` tool** (`claude/skill-ownership-hook.sh`) that reads the real invoking agent's identity from the payload (`agent_type`/`agent_id`) at any spawn depth, strips the `fkit-` prefix to the role, and **denies** via an explicit `hookSpecificOutput.permissionDecision` when the requested skill isn't in that role's `skills_for_role()` list — never a bare exit code.
- **`skills_for_role()` extracted into a sourceable unit** (`claude/skills-for-role.sh`) read by both `fkit-claude.sh` and the hook — the hook must **not** source `fkit-claude.sh`, whose top-level side effects (self-hosting re-exec, network update check) must never fire in a hook invocation.
- **Fail-closed, explicitly engineered:** any internal error (bad payload, unmappable role, exception, unexpected shape) resolves to an **explicit deny**, never Claude Code's fail-open default — with dedicated test coverage forcing those error states.
- **Retired the old plumbing, sequenced *after* the hook was verified:** stopped generating the `skillOverrides` off-list in `build_settings()` and removed `CONSULT_SKILLS`.
- **Corrected the two docs ADR-012 had flipped** — `claude/skills/fkit-team/SKILL.md` and `claude/scaffold/CLAUDE.md` — now back in the "structural at any depth" direction.

## Outcome
**Done.** Enforcement now follows the real caller at any spawn depth — extending ADR-010's structural claim to the consult path. Verified across session, one-hop and two-hop consults, plus the forced fail-open error states. A round-1 review finding (**R2**) caught that the refactor had silently broken `test/prove-red.sh` (the ADR-014 mutation gate — a hardcoded path failing at the unmutated baseline, and a moved `sed` target); R2 was fixed and verified in-scope, and spawned the forward-looking [investigate-mutation-testing-library-adoption] question (task 46, backlog). **Risk was medium-high** — this changes the mechanism reviewer independence rests on; a hook that silently fails open would be *worse* than the leak it replaced.

## Related
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the decision this implements
- [[tasks/record-pretooluse-skill-gate-adr-amendment]] — the ADR-recording task this depended on
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — the leak this closes
- [[systems/role-locked-sessions]] — the lockdown this makes structural on the consult path
- [[decisions/adr-014-how-fkit-tests-itself]] — the mutation gate the refactor briefly broke
- [[systems/testing-and-verification]]
- [[systems/fkit]]
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]] — this task's review finding R2 triggered that investigation
- [[tasks/add-open-questions-interview-skill-for-six-roles]] · [[tasks/add-dumb-down-skill-for-six-roles]] — six-role skills registered through this gate
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the hook gates the Skill tool only, and cannot answer *is the work done*
- [[tasks/investigate-mutation-testing-library-adoption]] — task 43, where the R2 no-op-mutation gap was found
