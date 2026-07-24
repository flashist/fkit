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

---

## Addendum — 2026-07-23: check A's "no `AskUserQuestion` this turn" signal, corrected at implementation

- **Status:** accepted (refines Decision 2A; does **not** supersede the ADR)
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect; from task 0127's model-diverse review
- **Evidence:** review ledger `ai-agents/tasks/done/0127-build-adr-030-stop-hook/review.md` (R1–R8, closed-out ✅; R7 over-skip found in owner live-verify, fixed; R8 accepted → 0129)

### The presupposition this corrects
Decision 2A reads *"interrogative content … **and no `AskUserQuestion` call this turn**."* It presupposed
that "no `AskUserQuestion` call this turn" is something a `Stop` hook can detect. **Review R1 (reviewer +
Codex, reproduced) proved it is not.** A `Stop` payload carries **no tool-call list**, and the transcript
at `transcript_path` is an unreliable source for it three ways: the turn's real `AskUserQuestion` call is
followed by a `tool_result` line that is itself `"type":"user"`, so an "after the last user line" scan
resets **past** the call; a readable but unexpected-format file (e.g. `/etc/hosts`) yields a confident
"no tool"; and the official docs say the file **lags** in-memory state and parsing it is version-fragile.
Each produces a **confident false BLOCK of a turn that DID use the tool** — a direct violation of
**Decision 6 (fail open, always)** in the exact direction this ADR rates worst.

### The mechanism now shipped (design's "path 2" — extend the proven PreToolUse path, not a transcript scan)
Check A no longer reads the transcript. "No `AskUserQuestion` this turn" is derived from a **turn-scoped
marker written by a second `PreToolUse` hook**, matched on the `AskUserQuestion` tool — the same hook
mechanism ADR-018 already proved, consistent with §5.1's *"do not invent a second mechanism."*

- **Write:** `claude/askuserquestion-marker-hook.sh` (`PreToolUse`, `matcher:"AskUserQuestion"`) touches
  `$cwd/.fkit/state/askuq-<session_id>` when the tool is invoked (`:57`). Wired as a **second `PreToolUse`
  entry** alongside the skill-ownership hook in the one `{"hooks":{…}}` object `build_settings()` emits
  (`claude/fkit-claude.sh:277`). PreToolUse firing on `AskUserQuestion` was confirmed against the CC docs
  (only `EndConversation` is hook-exempt).
- **Read + consume:** the `Stop` hook `claude/turn-completion-hook.sh` reads the marker and **deletes it**
  (`:76-77`), so it is strictly turn-scoped. Marker **present ⇒ tool was used ⇒ suppress check A**
  (`:133-134`).

### Marker lifetime / confidence rule — how fail-open (Decision 6) is preserved
A **missing** marker is trusted as "no tool used" **only when the state dir exists AND is writable** —
`marker_infra_ok` requires `[ -d "$cwd/.fkit/state" ] && [ -w … ]` (`turn-completion-hook.sh:73`); the
launcher pre-creates that dir (`fkit-claude.sh:278`). If the signal cannot be trusted (dir absent or
unwritable), `asked_with_tool` stays `1` and **check A is suppressed** — fail open. A stale marker (write
succeeded, consume missed) fails toward a **suppressed / dormant** check A, the safe direction. This is
the **R4 hardening**, owner-ruled: it closes the dir-present-but-unwritable false-block in the mandated
direction.

### Two design questions this settles
- **§7 OQ3 (turn-scoped state for block-once):** resolved with **no marker file** — block-once uses Claude
  Code's built-in `stop_hook_active` (`turn-completion-hook.sh:81`). The only marker file is the
  AskUserQuestion one above.
- **The consult skip (§5.3, safety-critical):** now **structural** — the `Stop` hook is registered on
  `Stop` **only, never `SubagentStop`** (`fkit-claude.sh:268`), so it never fires in a spawned consult
  where `AskUserQuestion` is absent (ADR-021). The unescapable-block hazard is closed by wiring, not by
  runtime detection.

### Accepted residuals (owner-ruled; do not re-litigate — see the ledger)
Recorded in `…/0127-build-adr-030-stop-hook/review.md` "Accepted residuals", each with a `Re-raise only
if` condition:
- **Exotic mid-session `cwd` change (R4 residual):** if `cwd` at the PreToolUse write differs from `cwd`
  at the `Stop` read, the marker is sought in the wrong place → possible false block. Genuinely exotic
  (a working-dir change between an `AskUserQuestion` call and turn end), block-once-bounded. Re-raise only
  if a real `cwd` change mid-session is observed, or a `cwd`-independent marker key becomes available.
- **Top-level headless `-p` run has no skip (R5):** self-heals via block-once (escapable, unlike the
  consult case); likely not distinguishable from the `Stop` payload. Re-raise only if a reliable
  headless signal appears, or the block is shown unescapable headlessly.
- **Ship-loop under-skip on an unreadable/lagging transcript (R6):** degraded-only, block-once-bounded,
  session-only, pre-existing. **Named producer follow-up** (not filed by this task): give the ship-loop a
  transcript-independent skip signal; task 0116 extends the same seam.

### Net effect on the original decision
Decision 2A's **intent is preserved and now enforceable** — check A fires on a genuine prose question that
did not use the tool, and never on a turn that did — without violating Decision 6. Decision 2A's stated
*mechanism assumption* (transcript-derivable) is what changed; the check itself stands. Nothing in
Decisions 1–8 is withdrawn.
