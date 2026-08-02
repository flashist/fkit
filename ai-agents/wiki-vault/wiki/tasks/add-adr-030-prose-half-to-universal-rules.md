# Add the ADR-030 prose half to the universal rules block — "What's next?" + ask-interactively

**Source**: `ai-agents/tasks/done/0128-add-adr-030-prose-half-to-universal-rules/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID 0128 · priority 112 · owner `fkit-coder`

## Goal

Land [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] Decision 8 — the **prose half** the hook cannot enforce, carried in the managed rules block so the requirement is legible to an agent **before** it is ever blocked.

## Key Changes

*The hook corrects; the prose is what it corrects toward.* Two universal clauses were added to the **Output style** section of `claude/scaffold/universal-rules.md` — the source of the marker-delimited block that the launcher re-injects into every consuming project's `CLAUDE.md` and `AGENTS.md` **on every launch**:

- **Close with "What's next?"** — after any prescribed output shape, never instead of one; *"nothing pending"* is a valid body; **never invent a next step**, and **never assert repo state not checked this turn** (binding to `conventions/evidence-before-assertion.md`).
- **Ask interactively** — in a session, put questions with `AskUserQuestion`, not prose; batch related questions; mark the recommendation; in a spawned consult the tool is absent, so return open questions in the reply.

**Two qualifiers were declared non-negotiable** — *never invent a next step* and *never assert unchecked repo state* — because the [[tasks/compress-universal-rules-output-style-section]] precedent established that a cut which saves bytes by dropping a qualifier is a **regression**, not compression.

**This was a producer catch, not new scope.** Task 79 / 0022 compressed the same section *specifically to make room for this*, recording in its worklog that the ADR-030 prose brief was unblocked — and the brief was then simply never written until now.

**The hard constraint is a byte cap.** `RULES_MAX=4096`, and a launch **aborts** if the block exceeds it. The brief required re-measuring the live block rather than trusting the design-time figures.

## Outcome

**Done, agent-closed.** The two clauses are live in the rules block — they are visible in this project's own root `CLAUDE.md`.

⚠️ **It landed the block at 91.1% of the cap — roughly 363 bytes of headroom.** Reclaiming that budget (a compression pass, or an owner-signed `RULES_MAX` bump) is separate, still-open backlog work; a cap bump is an owner/architect call. The later ADR-033 rules-block edit returns a few bytes, since "producer-only" is shorter than the "any role but…" clause it replaced — but it must be **measured, not assumed**.

## Related
- [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — Decision 8, the prose half
- [[tasks/build-adr-030-stop-hook]] — the hook half; independently shippable, either order
- [[tasks/compress-universal-rules-output-style-section]] — task 79, which reclaimed the headroom and set the "a dropped qualifier is a regression" precedent
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — the layer this writes into
- [[tasks/stop-agents-asserting-unchecked-repo-state]] — the convention one clause binds to
- [[tasks/add-speak-in-simple-terms-output-style]] · [[tasks/merge-fkit-rules-block-into-existing-root-context-files]]
- [[systems/launch-convergence-and-init]] · [[systems/fkit]]
- [[systems/install-and-self-update]] — Install, Launcher & Self-Update
- [[systems/role-locked-sessions]] — Role-Locked Sessions & the Skill Lockdown
- [[tasks/revert-task-movers-to-producer-only]] — Revert the task movers to producer-only — ownership, mirrors, hook test, and mover prose
- [[tasks/reclaim-rules-block-budget-headroom]] — task `0130` — the rules-block compression pass, and the owner's ≥400 B standing headroom target
