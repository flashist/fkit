# Add the `/fkit-dumb-down` skill for the six Claude-side roles

**Source**: `ai-agents/tasks/done/add-dumb-down-skill-for-six-roles.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 72

## Goal
A skill — *"Explain again in simple terms."* On invocation, the agent re-explains its **previous answer** in plain, non-specialist language: short sentences, everyday words, project jargon only with a one-line gloss, an analogy where it helps.

## Key Changes
- **`claude/skills/fkit-dumb-down/SKILL.md`** — takes the agent's most recent substantive answer in the conversation and re-explains it at reduced altitude. **If there is no previous answer, it says so and stops.** No file writes.
- **Content-preserving is load-bearing:** simplification must **not** drop caveats, failures, or unverified-claim flags. This is CLAUDE.md's *"concision is not omission"* rule applied to simplification — say it simpler, keep saying it.
- Registered for the six Claude-side roles in `skills_for_role()`, enforced by the task-43 `PreToolUse` gate; the adversarial reviewer is excluded, applying the same-day task-70 ruling and the same structural fact (Codex-run, restricted allowlist per ADR-022).
- **No ADR-021 seam** — unlike [[tasks/add-open-questions-interview-skill-for-six-roles]], this skill needs no owner channel: it rewrites the agent's own prior output, so it behaves **identically in a session and in a spawned consult**, where the re-explanation simply becomes the reply.

## Outcome
Done. fkit's skill count goes 23 → 24.

**Relation to [[tasks/add-speak-in-simple-terms-output-style]] — the owner ruled BOTH (2026-07-18).** Task 62 makes simple language the **standing default** via an output-style preference in the shared context files; this skill is the **on-demand** counterpart. Even with 62 landed, *"explain that again, simpler"* remains a distinct act. **Neither folds into the other**, and they shipped independently.

⚠️ The six-role scope was **assumed from the same-day task-70 ruling rather than re-asked**, and flagged in the scoping report for owner confirmation. That confirmation is not recorded in the brief.

## Related
- [[tasks/add-open-questions-interview-skill-for-six-roles]] — task 70, the sibling six-role skill; same registration shape, but it *does* carry the ADR-021 consult degrade
- [[tasks/add-speak-in-simple-terms-output-style]] — task 62, the standing-preference counterpart; owner ruled both, neither folds into the other
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — why the adversarial reviewer is excluded
- [[tasks/implement-pretooluse-skill-ownership-hook]] — task 43, the gate enforcing the registration
- [[decisions/adr-014-how-fkit-tests-itself]] — the allow/deny test constraints
- [[systems/role-locked-sessions]] · [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]
- [[tasks/investigate-askuserquestion-availability-for-agents]]
