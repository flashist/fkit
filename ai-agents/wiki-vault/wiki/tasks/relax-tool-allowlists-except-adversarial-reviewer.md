# Relax the tool allowlist for every role except the adversarial reviewer

**Source**: `ai-agents/tasks/done/relax-tool-allowlists-except-adversarial-reviewer.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 57

## Goal
Implement ADR-022: remove the `tools:` frontmatter line from the six Claude-side agent files (`fkit-producer`, `fkit-coder`, `fkit-architect`, `fkit-reviewer`, `fkit-wiki`, `fkit-lead`) so each inherits **every** Claude Code tool; keep `claude/agents/fkit-adversarial-reviewer.md` **byte-identical** (`tools: Read, Grep, Glob, Bash, Skill` — the one deliberate wall). A tools change only.

## Key Changes
- Removing the line drops, **by design** (each named in ADR-022 as an accepted consequence): the six explicit `AskUserQuestion` entries (task 54 — capability retained by inheritance), the coder's explicit `EnterPlanMode`/`ExitPlanMode` (same), and the **lead's scoped `Agent(...)` list** — the one structurally-enforced point of the two-hop consult topology, now prompt-enforced like everywhere else.
- **Prose untouched:** the session/consult notes and every role-boundary contract stay (ADR-022 Decision 5).
- **Out of scope, deliberately:** `skills-for-role.sh` + the ADR-018 hook (skill lockdown stays — the coder still cannot run `/fkit-review`); skill mirror tables; the doc refresh (task 58, architect-owned, backlog).

## Outcome
**Done.** The six agents carry no `tools:` line; the adversarial reviewer's wall is now the **sole structural tool restriction** in fkit — its purpose legible rather than lost among blunt ones. Open question flagged to the owner (not acted on): whether task 54 deserves a "mechanism superseded by 57" breadcrumb.

⚠️ `architecture.md`'s per-role tool table and "strongest boundary" language now describe a superseded posture until task 58 lands.

## Related
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — the decision implemented
- [[tasks/grant-askuserquestion-tool-to-six-claude-agents]] — task 54, whose mechanism this supersedes (capability preserved)
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the skill lockdown explicitly kept
- [[systems/role-locked-sessions]] · [[systems/review-and-model-diversity]] — the surviving wall's home
- [[systems/fkit]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/refresh-architecture-docs-for-tool-relaxation]] — task 58, the doc half of ADR-022 to this task's code half
