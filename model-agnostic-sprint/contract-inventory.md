# Existing contracts — initial inventory

This is an evidence map, not a complete source sweep. The local Codex stage must preserve these behaviors or make any proposed change explicit for the owner.

| Area | Current contract | Source / consequence |
| --- | --- | --- |
| Entry | Role session starts with Claude's role definition and generated hook settings; unknown role fails, and absent usable role files fail closed. | `claude/fkit-claude.sh`, `test/launcher-contract.test.js`; root role injection needs a Codex-specific design. |
| Cold start | Setup runs before dependency checks; in a fresh project with no named role, terminal intake precedes a producer session, then lead opens only after producer exits successfully and the project is initiated. | `claude/fkit-claude.sh`; changing this ordering can affect existing users and noninteractive invocation. |
| Initiation | Producer creates product brief, consults wiki and has architect write technical architecture; fills root context overviews, offers wiki ingest. | `claude/skills/fkit-initiate-project/SKILL.md`; startup requires actual cross-role collaboration, not only a prompt translation. |
| Role ownership | `skills_for_role()` enumerates permissions; PreToolUse checks real invoking Claude agent and fails closed for missing or invalid identity. Four task/sprint movers belong only to producer. | `claude/skills-for-role.sh`, `claude/skill-ownership-hook.sh`, ADR-018 and ADR-033. Codex's documented hook surface must be tested; do not claim the same guarantee without evidence. |
| Wiki | Only wiki role writes `ai-agents/wiki-vault/`; all roles can read through query procedure. | Root `AGENTS.md`, ADR-005. This is a role rule, not automatically proof of filesystem enforcement. |
| Lead | Lead orchestrates fresh role contexts and relays worker decisions; it does not do source, review or diagnosis work itself. Consult depth and cycles are prompt-governed. | `claude/agents/fkit-lead.md`, ADR-031; model switch cannot be allowed to bypass role/context boundaries. |
| Approvals | Sprint loop requires owner plan approval, retains owner channel and relays worker decisions; no guessing that an unanswered question is approval. Some gates are explicitly prose-enforced. | `claude/skills/fkit-sprint-ship-loop/SKILL.md`, ADR-032 and amendments. Separate interactive vs headless behavior is essential. |
| Review | Primary reviewer independently reviews and invokes a second pass on the same scope; verifies and deduplicates findings; logs usable vs unusable pass and measured vs reasoning-only evidence. Unique prompt files prevent concurrent scope collisions. | `claude/skills/fkit-review/SKILL.md`, ADR-042, ADR-054. Current code uses read-only despite ADR-042 D2's adopted workspace-write change still outstanding; do not mistake the live flag for the whole decision. |
| Review role | Adversarial reviewer exists today but wraps a Codex pass from Claude. Review outcome and model diversity are different facts; a failed pass and a usable same-model pass require distinct treatment. | `claude/agents/fkit-adversarial-reviewer.md`, `claude/skills/fkit-adversarial-review/SKILL.md`; updated status semantics need an explicit decision. |
| Hooks | Skill ownership, owner-question marker, turn completion, ship-loop marker and consult carry checking each have distinct behavior. | `build_settings()` in `claude/fkit-claude.sh`; classify each independently, including errors and trigger coverage. |
| State and updates | `ai-agents/` is additive on unattended convergence (ADR-015); managed Claude role and skill copies refresh, `.fkit/` is local ignored state. | `claude/fkit-claude-init.sh`, ADR-015 and ADR-039; local settings do not automatically travel with the project. |
| Tests | Existing harness stubs both CLI binaries and verifies launch, file and hook contracts; it doesn't validate actual model behavior. ADR-057 requires owner approval for each new test file and a 2-minute default suite budget. | `test/harness.mjs`, ADR-057; isolated manual probes are not evidence of whole workflow coverage. |

## Next source sweep

Inventory the remaining 28 skills and all mirrored scaffold instructions, review `structure-spec.md`, install/update and board entry points, and assess relevant backlog tasks before finalizing task boundaries. Historic decisions require amendment-aware reading, not wholesale rewriting.
