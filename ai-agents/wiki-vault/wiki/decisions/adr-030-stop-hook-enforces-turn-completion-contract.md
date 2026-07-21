# ADR-030: A `Stop` hook enforces the turn-completion contract — interactive questions and a "What's next?" close

**Date**: 2026-07-19
**Status**: accepted

> **What this ADR decides, in one line:** two end-of-turn behaviours — **ask interactively** and **close
> with "What's next?"** — are enforced by a **second hook**, because the first of them was already
> written as prose and demonstrably did not fire.

⚠️ **Decided, not built.** As of ingest this is a ruling plus a design; `claude/turn-completion-hook.sh`
does not exist in the tree.

## Context

Two owner complaints: the coder puts questions to him **as prose** instead of using `AskUserQuestion`,
and he wants every agent to close with a short **"What's next?"**.

**The first is not a missing rule.** It is already in the coder's prompt twice — `fkit-coder.md:34` and
a dedicated section at `:192-198` (*"use `AskUserQuestion`. Batch related questions into one call …
mark your recommendation"*). It is clear, specific, well-placed, **and it still does not fire
reliably.**

That is the whole context: [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]
§6 — *delivery is structural, compliance is advisory* — **observed live, on a rule the project already
wrote**. The behaviour is required at **end of turn**, the moment context is fullest and a single deep
instruction has least grip. **Rewriting the prose would treat a mechanism failure as a wording
failure.**

Verified 2026-07-19: cross-cutting rules ship via the marker-delimited block at `CLAUDE.md:43-90`,
re-injected into every consuming project on every launch by `fkit-claude-init.sh:316-333` — **capped at
4096 bytes, currently 3535, leaving ~561 bytes.**

## Decision

1. **Add a second hook: `Stop`** — `claude/turn-completion-hook.sh`, wired as an additional key in the
   same `{"hooks":{…}}` object `build_settings()` already emits. **Extend the proven ADR-018 path; do
   not invent a second mechanism.**
2. **Two presence checks, no judgement:** **A** — interrogative content in the final message *and* no
   `AskUserQuestion` call this turn. **B** — no `What's next?` section in the final message.
3. **"What's next?" is universal and always present** — every role, **appended after** any prescribed
   output shape (findings table, six-beat briefing, verbatim relay), **never instead of one and never
   compressing one.** When nothing is pending, the agent **says so**; that is a valid body.
4. **The hook never judges whether a next step was "real".** The owner's intent — don't invent work —
   is carried by **prose**, and this ADR records that as a deliberate, named gap.
5. **Block at most once per turn**, then allow the turn to complete.
6. **Fail open, always.** Any error, parse failure, or uncertainty allows the turn. *A hook that can
   prevent a turn from completing is more dangerous than the defect it fixes.*
7. **Skip conditions are part of the decision**, not an implementation detail: spawned consults and
   other non-interactive runs, `/fkit-task-ship-loop`, and the adversarial reviewer.
8. **The prose half still ships** in the managed rules block (~430 bytes against ~561 available),
   carrying the two clauses the hook cannot enforce: *never invent a next step*, and *never assert repo
   state you did not check this turn*.

### The conflict that was surfaced rather than designed around

The owner's first two rulings **contradicted each other**: structural enforcement, plus a condition
(*"only when there's a real next step"*) that **no hook can check**. Left unreconciled, the
"What's next?" half would have silently degraded to prose — the exact failure the hook was chosen to
escape. It was put back to the owner and resolved into the checkable form in Decisions 3–4.

## Consequences

- **Positive:** the owner gets interactive questions reliably, which the prompt already promised; every
  reply ends with an actionable next step across all roles and projects; fkit gains a general
  **end-of-turn enforcement point** with a home for future turn-shaped contracts; and it ships
  everywhere automatically — hook via `build_settings()`, prose via the managed block, **no
  dual-homing**.
- **Negative, stated plainly:**
  - **This hook has a materially larger blast radius than ADR-018's.** That one denies a single tool
    call; this one can stop a turn **completing**. Decisions 5–6 bound it; they do not eliminate it.
    **A misfire is worse than the missing footer it exists to fix.**
  - **Check A is a heuristic and will produce false positives** — rhetorical questions, questions
    quoted back from the owner, questions inside code fences. Accepted knowingly.
  - **The consult skip is safety-critical.** `AskUserQuestion` is absent in spawned consults
    ([[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]], `TOOL_ABSENT` 3/3), so
    getting interactive-session detection wrong makes the block **unescapable** — it would demand a
    tool that cannot be called. **The single most dangerous line in the design.**
  - **Decision 4 is a real, named gap.** "Don't invent a next step" is exactly the failure a mandatory
    proactive section invites, and it is left to prose — the claim level this ADR exists because of.
    **Inconsistent by necessity, and recorded rather than hidden.**
  - **~561 bytes of rules-block headroom, and this spends most of it.** A real, shrinking budget; the
    next cross-cutting rule may not fit without evicting something.
  - **fkit cannot fully test this itself.** Per
    [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] a spawned subagent
    inherits the caller's settings, so session-scoped hook behaviour stays **hand-verified**; automated
    coverage reaches the script's logic against synthetic payloads only.
  - **Ritual decay.** A mandatory section trends toward filler.
- **Re-raise only if:** the hook blocks a turn it should not have, especially in a consult (**a defect
  against Decisions 6–7 — fix the hook**, not the approach); "What's next?" becomes filler nobody reads
  (then the *rule* is wrong — reopen Decision 3, accepting the loss of enforceability); or agents start
  inventing next steps to satisfy the check (Decision 4's gap becoming concrete). Do **not** re-raise
  *"just write the rule more clearly in the coder's prompt"* — that rule exists and its failure is the
  entire premise. Do **not** re-raise *"the hook should judge whether the next step was real"* —
  weighed and rejected as slow, non-deterministic, and far too large a blast radius for a footer.

## Related
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the
  `PreToolUse` hook: the precedent for enforcing with a hook instead of prose, and the wiring pattern
  this extends
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — §6 *delivery
  structural, compliance advisory*; the managed rules block, and the byte cap this decision spends into
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why the consult skip is
  safety-critical
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — why fkit cannot fully
  test a session-scoped hook
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — the ADR that now holds the
  number **029**, which this decision briefly carried; every inbound link to
  `adr-029-stop-hook-…` was repointed here by task 80
- [[systems/role-locked-sessions]] — the hook layer this adds a second member to
- [[systems/fkit]] · [[systems/testing-and-verification]]
- Source: `knowledge-base/reports/2026-07-19-design-turn-completion-hook.md`; code cited
  `claude/fkit-claude.sh:257-283`, `claude/fkit-claude-init.sh:316-341`,
  `claude/agents/fkit-coder.md:34,:192-198`
- [[tasks/sprint-2-remove-omnigent]] — the sprint this decision was taken during; it carries no numbered row
- [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]] — task 81, the mover KB-sweep fix + ADR-number guard
