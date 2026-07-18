# ADR-010: Role-locked sessions with a skill lockdown, replacing lead-session "hat" skills

**Date**: 2026-07-11
**Status**: accepted (partly superseded — see below)

**Supersedes**: [[decisions/adr-008-claude-code-native-port-alongside-omnigent]] §"Role access"

> ⚠️ **Two of its decisions were themselves corrected** by
> [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]: the lock is
> **session-scoped, not universal**, and the `skills:` frontmatter was **dropped, not generated**.
> The core decision — role-locked sessions — stands.

## Context
ADR-008 designed the Claude flavor around a **single interactive lead session** that was the team lead *and* the coder by default, and that could **"wear a hat"** — `/fkit-agent-<role>` skills that made the current session adopt a role.

The hat model was **prompt-enforced**, and that was the problem: *a session "wearing" the reviewer hat was the same context that had just written the code*, and nothing but instructions stopped it from running the coder's procedures. ADR-008 conceded this itself — reviewer independence *"is a property of a fresh context, not of the prompt"* — and then relied on an in-skill independence *check* to compensate.

The hat skills have since been **deleted in code**, and the owner confirmed the replacement is settled.

## Decision
**Every session is locked to exactly one role, two ways:**

1. **`claude --agent fkit-<role>`** — the role's system prompt and **tool allowlist** (harness-enforced).
2. **`--settings` carrying `skillOverrides`** — every `fkit-*` skill the role does *not* own is set to `"off"`: hidden from the `/` menu **and unrunnable by name**.

Plus:
- **`fkit` is a deterministic role menu.** No LLM decides who you're talking to — picking a role is an `if/else`. `fkit <role>` skips the menu.
- **A 7th agent, `fkit-lead`** — the "team room" — **routes rather than does**. It has no Write or Edit tools, deliberately.
- **Cross-role work is a consult, never a role switch** — the Agent tool, **max two hops, never a cycle**.
- **`skills_for_role()` in `claude/fkit-claude.sh` is the single source of truth** for role→skill ownership.

## Consequences
- **Role separation becomes structural where it counts.** A `fkit reviewer` session *is* a fresh context, and a coder session **cannot execute `/fkit-review`** — the skill does not exist in it. **This is the property reviewer independence rests on, and it holds.** It is a strictly stronger form of exactly what ADR-008 argued for.
- **The hop budget cannot be made structural.** Claude Code ignores `Agent(type)` allowlists inside *subagent* definitions, so the two-hop cap stays **prompt-enforced, knowingly**. It *is* structural in one place — `fkit-lead`'s own `Agent(...)` list.
- **"Never commit/push unprompted" remains a prompt rule too.** A known, accepted limit — **not a claim to overstate.**
- **Path-level hook enforcement of role boundaries was deferred** — and ADR-012 later *priced* that deferral.
- ADR-012 corrected the scope: the lockdown follows **the launching session**, so on the **consult path it is advisory**, not structural.

## Related
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]]
- [[tasks/design-task-ship-loop-skill]]
- [[systems/role-locked-sessions]]
- [[systems/fkit]]
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]]
- [[decisions/adr-008-claude-code-native-port-alongside-omnigent]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[systems/review-and-model-diversity]]
- [[tasks/reconcile-skill-ownership-source-of-truth]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/document-consult-chain-envelope]]
- [[tasks/restore-plan-mode-in-plan-task]]
- [[tasks/rewrite-docs-post-omnigent]]
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]
- [[systems/testing-and-verification]]
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — measured confirmation of the consult envelope
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — relaxes this ADR's tool-allowlist half; the skill half stands
