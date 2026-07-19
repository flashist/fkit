# ADR-030: A `Stop` hook enforces the turn-completion contract — interactive questions and a "What's next?" close

- **Status:** accepted
- **Date:** 2026-07-19
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect
- **Evidence:** [`reports/2026-07-19-design-turn-completion-hook.md`](../reports/2026-07-19-design-turn-completion-hook.md)
  — the design, the stub, the skip conditions, and the risks.

> **What this ADR decides, in one line:** two end-of-turn behaviours — **ask interactively** and **close
> with "What's next?"** — are enforced by a **second hook**, because the first of them was already
> written as prose and demonstrably did not fire.

## Context

The owner raised two complaints: the coder puts questions to him **as prose** instead of using
`AskUserQuestion`, and he wants every agent to close with a short **"What's next?"**.

**The first is not a missing rule.** It is already in the coder's prompt twice —
`claude/agents/fkit-coder.md:34` and an entire dedicated section at `:192-198` (*"use `AskUserQuestion`.
Batch related questions into one call … mark your recommendation"*). It is clear, specific, well-placed,
**and it still does not fire reliably.**

That is the whole context for this decision. It is
[ADR-016](adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md) §6 — *delivery is
structural, compliance is advisory* — observed live, on a rule the project already wrote. The behaviour
is required at **end of turn**: the moment context is fullest and a single deep instruction has least
grip. **Rewriting the prose would treat a mechanism failure as a wording failure.**

Verified 2026-07-19: cross-cutting rules ship via the marker-delimited block at `CLAUDE.md:43-90`,
re-injected into every consuming project's `CLAUDE.md` and `AGENTS.md` on every launch by
`fkit-claude-init.sh:316-333` — **capped at 4096 bytes (`:318`), currently 3535, leaving ~561 bytes.**

## Decision

1. **Add a second hook: `Stop`.** A new `claude/turn-completion-hook.sh`, wired as an additional key in
   the same `{"hooks":{…}}` object `build_settings()` already emits (`claude/fkit-claude.sh:257-283`).
   **Extend the proven ADR-018 path; do not invent a second mechanism.**
2. **It performs two presence checks and no judgement:**
   - **A** — interrogative content in the final message **and** no `AskUserQuestion` call this turn.
   - **B** — no `What's next?` section in the final message.
3. **"What's next?" is universal and always present.** Every role, **appended after** any prescribed
   output shape (findings table, six-beat briefing, verbatim relay) — **never instead of one and never
   compressing one.** When nothing is pending, the agent **says so**; that is a valid body.
4. **The hook never judges whether a next step was "real".** The owner's intent — don't invent work — is
   carried by **prose**, not by the hook, and this ADR records that as a deliberate, named gap.
5. **Block at most once per turn**, then allow the turn to complete.
6. **Fail open, always.** Any error, parse failure, or uncertainty allows the turn. A hook that can
   prevent a turn from completing is more dangerous than the defect it fixes.
7. **Skip conditions are part of the decision, not an implementation detail:** spawned consults and
   other non-interactive runs, `/fkit-task-ship-loop`, and the adversarial reviewer.
8. **The prose half still ships** in the managed rules block (~430 bytes drafted against ~561 available),
   carrying the two clauses the hook cannot enforce: *never invent a next step*, and *never assert repo
   state you did not check this turn*.

### The conflict that was surfaced rather than designed around

The owner's first two rulings **contradicted each other**: structural enforcement, plus a condition
(*"only when there's a real next step"*) that **no hook can check**. Left unreconciled, the
"What's next?" half would have silently degraded to prose — the exact failure the hook was chosen to
escape. It was put back to the owner and resolved into the checkable form in Decisions 3–4.

## Options considered

- **`Stop` hook + prose (chosen).** The only option that enforces rather than requests.
- **Prose only — strengthen the rule and add it to the rules block.** Rejected on **direct evidence**:
  the rule already exists, is well-written, and does not fire. This is the option that was already tried
  without anyone deciding to try it.
- **Prose now, hook later if it keeps failing.** Rejected by the owner: the "later" trigger has already
  fired once.
- **A hook that judges "was there a real next step" via a model call.** Rejected: slow on every turn,
  non-deterministic, and it makes turn completion depend on a model judgement — a large blast radius for
  a footer.
- **Block until satisfied.** Rejected (Decision 5): check A is heuristic, so a false positive could trap
  an agent in a loop it cannot escape.

## Consequences

- **Positive:**
  - **The owner gets interactive questions reliably**, which is what he asked for and what the prompt
    already promised.
  - **Every reply ends with an actionable next step**, uniformly, across all roles and every consuming
    project.
  - **fkit gains a general end-of-turn enforcement point.** Future turn-shaped contracts have a home.
  - **It ships everywhere automatically** — the hook via `build_settings()`, the prose via the managed
    block. No dual-homing.

- **Negative / costs — stated plainly:**
  - **This hook has a materially larger blast radius than ADR-018's.** That one denies a single tool
    call; this one can stop a turn **completing**. Decisions 5–6 bound it; they do not eliminate it.
    **A misfire is worse than the missing footer it exists to fix.**
  - **Check A is a heuristic and will produce false positives** — rhetorical questions, questions quoted
    back from the owner, questions inside code fences. Accepted knowingly.
  - **The consult skip is safety-critical.** `AskUserQuestion` is absent in spawned consults
    ([ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md), `TOOL_ABSENT` 3/3), so
    getting the interactive-session detection wrong makes the block **unescapable** — it would demand a
    tool that cannot be called. This is the single most dangerous line in the design.
  - **Decision 4 is a real, named gap.** "Don't invent a next step" is exactly the failure mode a
    mandatory proactive section invites, and it is left to prose — the claim level this ADR exists
    because of. **This is inconsistent by necessity, and it is recorded rather than hidden.**
  - **~561 bytes of rules-block headroom, and this spends most of it.** The cap is a real, shrinking
    budget; the next cross-cutting rule may not fit without evicting something.
  - **fkit cannot fully test this itself.** Per
    [ADR-012](adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md) a spawned subagent
    inherits the caller's settings, so session-scoped hook behaviour stays hand-verified; automated
    coverage reaches the script's logic against synthetic payloads only.
  - **Ritual decay.** A mandatory section trends toward filler.

- **Residual risks / "re-raise only if":**
  - **The hook blocks a turn it should not have** — especially in a consult. That is a **defect against
    Decisions 6–7**, fix the hook; it is not grounds to revisit the approach.
  - **"What's next?" becomes filler nobody reads.** Then the *rule* is wrong, not the agents — reopen
    Decision 3 and consider making it conditional again, accepting the loss of enforceability.
  - **Agents start inventing next steps to satisfy the check.** That is Decision 4's named gap becoming
    concrete, and it would justify revisiting whether presence-checking was worth it.
  - Do **not** re-raise *"just write the rule more clearly in the coder's prompt"* — that rule exists at
    `fkit-coder.md:34,:192-198`, and its failure is the entire premise of this ADR.
  - Do **not** re-raise *"the hook should judge whether the next step was real"* — weighed and rejected.

## Related

- [`reports/2026-07-19-design-turn-completion-hook.md`](../reports/2026-07-19-design-turn-completion-hook.md)
  — the design: mechanism, checks, skip conditions, interface stub, and the three open questions.
- [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) — the
  `PreToolUse` hook: the precedent for enforcing with a hook instead of prose, and the wiring pattern
  this extends.
- [ADR-016](adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md) §6 — *delivery
  structural, compliance advisory*; the managed rules block as the shared-instruction layer.
- [ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md) — why the consult skip is
  safety-critical.
- [`conventions/evidence-before-assertion.md`](../conventions/evidence-before-assertion.md) — binds what
  a "What's next?" may claim.
- Code: `claude/fkit-claude.sh:257-283`, `claude/skill-ownership-hook.sh`,
  `claude/fkit-claude-init.sh:316-341`, `claude/agents/fkit-coder.md:34,:192-198`.
- **Wiki:** **fkit-wiki** should ingest this ADR — an architect never writes the vault.
