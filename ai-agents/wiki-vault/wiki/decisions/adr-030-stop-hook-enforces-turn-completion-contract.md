# ADR-030: A `Stop` hook enforces the turn-completion contract — interactive questions and a "What's next?" close

**Date**: 2026-07-19
**Status**: accepted

> **What this ADR decides, in one line:** two end-of-turn behaviours — **ask interactively** and **close
> with "What's next?"** — are enforced by a **second hook**, because the first of them was already
> written as prose and demonstrably did not fire.

✅ **Built and shipped 2026-07-23** by task 0127 ([[tasks/build-adr-030-stop-hook]]). Both hooks exist
in the tree — `claude/turn-completion-hook.sh` (`Stop`) and `claude/askuserquestion-marker-hook.sh`
(`PreToolUse`). One decision (**2A**) was refined at implementation: its "no `AskUserQuestion` this turn"
signal is realized via a **PreToolUse marker**, not the transcript. See the **Addendum — 2026-07-23**
below; nothing in Decisions 1–8 was withdrawn.

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
   *(2A's "no `AskUserQuestion` this turn" signal was refined at implementation — see the
   **Addendum — 2026-07-23**: it comes from a PreToolUse marker, not the transcript.)*
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
   *(As built, the safety-critical consult skip is **structural** — the hook registers on `Stop`
   only, never `SubagentStop` — not runtime detection. See the **Addendum — 2026-07-23**.)*
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

## Addendum — 2026-07-23: check A's "no `AskUserQuestion` this turn" signal, corrected at implementation

**Status:** accepted — refines Decision 2A, does **not** supersede the ADR. From task 0127's
model-diverse review (ledger `tasks/done/0127-build-adr-030-stop-hook/review.md`, R1 + R4–R6, closed ✅).

**The presupposition this corrects.** Decision 2A assumed "no `AskUserQuestion` call this turn" is
something a `Stop` hook can detect. **Review R1 (reviewer + Codex, reproduced) proved it is not.** A
`Stop` payload carries **no tool-call list**, and the transcript at `transcript_path` is unreliable
three ways: the real `AskUserQuestion` call is followed by a `tool_result` line that is itself
`"type":"user"`, so an "after the last user line" scan resets **past** the call; a readable but
unexpected-format file yields a confident "no tool"; and the docs say the file **lags** in-memory state
and parsing it is version-fragile. Each produces a **confident false BLOCK of a turn that DID use the
tool** — a direct violation of **Decision 6 (fail open)** in the exact direction this ADR rates worst.

**The mechanism now shipped (the design's "path 2" — extend the proven PreToolUse path, not a transcript
scan).** Check A no longer reads the transcript. "No `AskUserQuestion` this turn" is derived from a
**turn-scoped marker written by a second `PreToolUse` hook** matched on `AskUserQuestion` — the same hook
mechanism [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]
already proved, consistent with Decision 1's *"do not invent a second mechanism."*
- **Write:** `claude/askuserquestion-marker-hook.sh` (`PreToolUse`, `matcher:"AskUserQuestion"`) touches
  `$cwd/.fkit/state/askuq-<session_id>` when the tool is invoked. Wired as a **second `PreToolUse`
  entry** alongside the skill-ownership hook in the one `{"hooks":{…}}` object `build_settings()` emits.
- **Read + consume:** the `Stop` hook `claude/turn-completion-hook.sh` reads the marker and **deletes
  it**, so it is strictly turn-scoped. Marker **present ⇒ tool was used ⇒ suppress check A.**

**Fail-open preserved.** A **missing** marker is trusted as "no tool used" **only when the state dir
exists AND is writable** (`marker_infra_ok` requires `[ -d .fkit/state ] && [ -w … ]`; the launcher
pre-creates the dir). If the signal cannot be trusted, check A is **suppressed** — fail open. A stale
marker (write succeeded, consume missed) fails toward a **suppressed/dormant** check A, the safe
direction. This is the **R4 hardening**, owner-ruled.

**Two design questions this settles.**
- **Block-once:** uses Claude Code's built-in `stop_hook_active` — **no marker file**. The only marker
  file is the AskUserQuestion one above.
- **The consult skip (safety-critical):** now **structural** — the `Stop` hook registers on `Stop`
  **only, never `SubagentStop`** — so it never fires in a spawned consult where `AskUserQuestion` is
  absent ([[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]]). The unescapable-block
  hazard is closed by **wiring, not runtime detection**.

**Accepted residuals** (owner-ruled; do not re-litigate — each with a `Re-raise only if` in the ledger):
- **Exotic mid-session `cwd` change (R4):** if `cwd` differs between the PreToolUse write and the `Stop`
  read, the marker is sought in the wrong place → possible false block. Genuinely exotic,
  block-once-bounded. Re-raise only if observed, or a `cwd`-independent marker key becomes available.
- **Top-level headless `-p` run has no skip (R5):** self-heals via block-once (escapable, unlike the
  consult case); likely not distinguishable from the `Stop` payload.
- **Ship-loop under-skip on an unreadable/lagging transcript (R6):** degraded-only, block-once-bounded,
  session-only, pre-existing. **Named producer follow-up** (not filed by task 0127): give the ship-loop a
  transcript-independent skip signal; task 0116 extends the same seam.

**Net effect.** Decision 2A's **intent is preserved and now enforceable** — check A fires on a genuine
prose question that did not use the tool, and never on a turn that did — without violating Decision 6.
Only 2A's *mechanism assumption* (transcript-derivable) changed; the check itself stands.

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
- [[tasks/build-adr-030-stop-hook]] — task 0127, the build (shipped 2026-07-23) and its model-diverse
  review; the R1/R4–R6 findings and accepted residuals live in that task folder's `review.md`
- Source: `knowledge-base/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md` (+ its
  Addendum — 2026-07-23) and `knowledge-base/reports/2026-07-19-design-turn-completion-hook.md`; code as
  built — `claude/turn-completion-hook.sh` (`Stop`), `claude/askuserquestion-marker-hook.sh`
  (`PreToolUse` marker), wired in `claude/fkit-claude.sh` (`build_settings()`); prose half in
  `claude/fkit-claude-init.sh` managed block; `claude/agents/fkit-coder.md:34,:192-198`
- [[tasks/sprint-2-remove-omnigent]] — the sprint this decision was taken during; it carries no numbered row
- [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]] — task 81, the mover KB-sweep fix + ADR-number guard
- [[tasks/refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role]] — task 82, the architecture.md refresh for ADRs 026–030 + the eighth role
- [[tasks/repair-stale-adr-029-stop-hook-links-in-the-vault]] — task 80, the ADR-029/030 vault link repair
