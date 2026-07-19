# Design — a `Stop` turn-completion hook: interactive questions + a "What's next?" close

- **Date:** 2026-07-19
- **Author:** fkit-architect
- **Status:** ✅ **Designed, owner-ruled, not built.** Decision recorded as
  [**ADR-030**](../decisions/adr-030-stop-hook-enforces-turn-completion-contract.md).
  **No code was written by this design.** Implementation is fkit-coder's, from a producer-written brief.
- **Raised by:** the owner, 2026-07-19 — two requests that turned out to be one problem.

---

## 1. The two requests, and why they are one

1. *"The coder asks me questions as prose instead of using the interactive `AskUserQuestion` tool."*
2. *"Can every agent end its reply with a short **What's next?** — tell me proactively what to do next."*

Both are **"make an agent reliably do a specific thing at the end of its turn."** They share a
mechanism, and they share a failure mode.

## 2. The finding that decides the design — request #1 is not a missing rule

The rule **already exists**, in the coder's own prompt, twice:

- `claude/agents/fkit-coder.md:34` — *"In a session you may use `AskUserQuestion` for a structured
  choice; in a spawned consult the tool is absent."*
- `claude/agents/fkit-coder.md:192-198` — an entire section, *"### 3. End by interviewing the owner on
  any open questions … **In a session:** use `AskUserQuestion`. Batch related questions into one call …
  mark your recommendation."*

That is exactly what the owner asked for, already written, and **it still does not happen reliably.**

**This is [ADR-016](../decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md)
§6 — *delivery is structural, compliance is advisory* — demonstrated on live evidence.** The rule fires
at end-of-turn: the moment the context window is fullest and a single instruction ~195 lines deep has
the least grip.

> **Therefore the fix is not more prose, and not better-worded prose.** The instruction is already as
> clear as prose gets. Rewriting it would be treating a mechanism failure as a wording failure — the
> same mistake ADR-016 §6 warns about, and the reason that ADR exists.

## 3. Where a cross-cutting rule actually lives (verified, and better than assumed)

Initial hypothesis — *"consuming projects won't receive it"* — was **wrong**, and the check corrected it:

- `CLAUDE.md:43-90` is a **marker-delimited block** (`<!-- fkit:begin-rules -->` … `<!-- fkit:end-rules -->`).
- `claude/fkit-claude-init.sh:316-333` (`emit_block()`) **re-injects that block into every project's
  `CLAUDE.md` and `AGENTS.md` on every `fkit` launch**. The owner's own "Output style" section already
  lives inside it.
- So a rule added there **ships to every consuming project automatically.** No scaffold edit, no
  dual-homing ([`conventions/dual-home-parity.md`](../conventions/dual-home-parity.md) does not apply —
  the block is generated, not stored twice).

**Hard constraint — the byte cap.** `fkit-claude-init.sh:318` sets `RULES_MAX=4096`, deliberately:
*"the block lands in every agent's context on every turn; cap fkit's own verbosity."* Measured
2026-07-19, the live block is **3535 bytes → ~561 bytes of headroom.** The new prose must fit, or
`fkit-claude-init.sh:341` aborts the launch. **This is the tightest constraint in the design.**

## 4. Owner rulings (2026-07-19)

| # | Question | Ruling |
|---|---|---|
| 1 | Prose, or structural enforcement? | **A `Stop` hook.** Prose already failed once (§2). |
| 2 | "What's next?" always, or only when real? | **Only when real — but *checkably* so:** the section is always present; *"nothing pending"* is a valid body. |
| 3 | Uniform across roles? | **Every role**, appended **after** any prescribed output shape — nothing relocated or compressed. |
| 4 | Safety posture of a blocking hook | **Block at most once per turn**, then allow through. |

### The conflict that was surfaced and resolved, not designed around

Rulings 1 and 2 initially **contradicted each other**: the owner chose structural enforcement *and* a
condition ("only when there's a real next step") that **a hook cannot mechanically check**. Left as-is,
#2 would have silently degraded back to prose — the exact failure the hook was chosen to escape.

Put back to the owner and resolved: **the hook checks presence only and never judges content.**
*"Nothing pending"* is an explicit, valid answer. This keeps both intents — enforcement *and* no
invented work.

## 5. Design

### 5.1 Mechanism — extend the proven path, do not invent a second one

fkit already ships exactly one hook, and its wiring is the template:

- `claude/skill-ownership-hook.sh` — the `PreToolUse` skill-ownership gate
  ([ADR-018](../decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md), task 43).
- `claude/fkit-claude.sh:257-283` — `build_settings()` writes `.fkit/settings/<role>.json` containing a
  `{"hooks":{…}}` object, passed to Claude Code via `--settings`.
- `claude/fkit-claude.sh:265` — the single `PreToolUse` entry today.

**The change is additive:** a new `claude/turn-completion-hook.sh`, and a second key in the same JSON.

```
                  fkit <role>
                       │
                       ▼
        build_settings()            claude/fkit-claude.sh:257
                       │
                       ▼
   .fkit/settings/<role>.json
   {"hooks":{
      "PreToolUse":[…skill-ownership-hook.sh…],   ← exists (ADR-018)
      "Stop"      :[…turn-completion-hook.sh…]    ← NEW
   }}
                       │
                       ▼
              Claude Code --settings
```

### 5.2 What the hook checks — two mechanical facts, zero judgement

On `Stop`, given the turn's transcript:

| # | Check | Verdict |
|---|---|---|
| A | The final message contains **interrogative content addressed to the owner**, **and** no `AskUserQuestion` tool call occurred **this turn** | block once → *"you asked the owner a question in prose; re-ask it with `AskUserQuestion`"* |
| B | The final message contains **no "What's next?" section** | block once → *"append a What's next section; 'nothing pending' is a valid answer"* |

**Check B is exact** — a literal heading match. This is *why* ruling 2 was resolved to the checkable
form: presence is decidable, "was there a real next step" is not.

**Check A is a heuristic and must be treated as one.** Known false positives: a rhetorical question, a
question quoted back from the owner, a question inside a code block. This is precisely what ruling 4's
block-once posture bounds.

### 5.3 Skip conditions — where the hook must not fire

| Condition | Why |
|---|---|
| **Spawned consults / non-interactive runs** | `AskUserQuestion` is **absent** there ([ADR-021](../decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md), `TOOL_ABSENT` 3/3). Blocking on check A would demand a tool that cannot be called — an **unescapable** block. **This is the single most dangerous case in the design.** Also, a consult's reply is read by another agent, so "what should *you* do next" is addressed to the wrong reader. |
| **`/fkit-task-ship-loop`** | Runs autonomously by default after owner approval ([ADR-019](../decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)); there is no owner in the loop to ask. |
| **The adversarial reviewer** | Returns findings only; its output contract is fixed and hostile-by-design. |
| **Already blocked once this turn** | Ruling 4. |

### 5.4 Interface stub — scaffolding only, NOT an implementation

```sh
#!/bin/sh
# claude/turn-completion-hook.sh — Stop hook, ADR-030.
# Enforces the turn-completion contract. Presence checks only; never judges content.
# Sibling of skill-ownership-hook.sh (ADR-018); wired in fkit-claude.sh:build_settings().

# stdin: Claude Code Stop-hook payload (JSON) — transcript + invoking agent_type.
# stdout/exit: hook protocol — allow, or block ONCE with a corrective message.

is_interactive_session() {   # false for spawned consults, ship-loop, headless
  : # TODO(coder): AskUserQuestion is ABSENT in consults (ADR-021) —
    # blocking there is unescapable. Fail OPEN (allow) whenever this is uncertain.
  false
}

already_nudged_this_turn() {  # ruling 4: at most one block per turn
  : # TODO(coder): needs turn-scoped state. Choose the marker and document its
    # lifetime; a stale marker silently disables the hook, a missing one loops.
  false
}

asked_in_prose_without_tool() {   # check A — HEURISTIC, false positives expected
  : # TODO(coder): interrogative in final message AND no AskUserQuestion call this turn.
    # Must not match questions inside code fences or quoted back from the owner.
  false
}

missing_whats_next() {   # check B — EXACT heading match, no judgement
  : # TODO(coder): literal "What's next?" section absent from the final message.
  false
}

main() { echo "not implemented" >&2; exit 1; }
main "$@"
```

### 5.5 The prose half — still required, and it must fit in ~561 bytes

The hook corrects; the prose is what it corrects *toward*, and it is what makes the requirement
legible to an agent **before** it gets blocked. It goes in the managed rules block (§3), in the
**Output style** section, since ruling 3 makes it universal.

Draft (**~430 bytes — measure before landing; the cap aborts the launch**):

```markdown
- **Close with "What's next?".** End every reply to the owner with a short **What's next?** — the one
  or two things they should do next, and why. It goes *after* any prescribed shape, never instead of
  one. If nothing is pending, say so in a few words. Never invent a next step to fill it, and never
  assert repo state you did not check this turn.
- **Ask interactively.** In a session, put a question to the owner with `AskUserQuestion`, not as
  prose. Batch related questions; mark your recommendation. In a spawned consult the tool is absent —
  return open questions in your reply instead.
```

Note the two clauses doing real work: *"never invent a next step"* (ruling 2's intent, which the hook
cannot enforce) and *"never assert repo state you did not check this turn"* — which binds this to
[`conventions/evidence-before-assertion.md`](../conventions/evidence-before-assertion.md). **A
proactive "what's next" is exactly the shape of output that invites confident, unchecked claims about
the repo.**

## 6. Risks — stated plainly

1. **A `Stop` hook has a larger blast radius than the `PreToolUse` one.** ADR-018's hook denies a single
   tool call; this one can prevent a turn from **completing**. A misfire is worse than the missing
   footer it exists to fix. Ruling 4 bounds it; it does not eliminate it. **The hook must fail OPEN on
   every error, every parse failure, and every uncertainty.**
2. **Check A is heuristic and will produce false positives.** Accepted, bounded by block-once.
3. **The consult case is the sharp edge** (§5.3). Getting `is_interactive_session()` wrong makes the
   block unescapable, because the remedy tool does not exist in that context.
4. **Ritual decay.** A mandatory section tends toward filler. The *"nothing pending"* escape is the
   mitigation; if the section becomes noise, that is evidence the rule is wrong, not that agents are.
5. **Byte cap.** ~561 bytes of headroom (§3). Future cross-cutting rules will not fit — the cap is a
   real, shrinking budget and this spends most of it.
6. **fkit's own tests cannot fully cover this.** Per
   [ADR-012](../decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md), a spawned
   subagent inherits the caller's settings, so a subagent cannot verify session-scoped hook behaviour.
   Expect the `node --test` suite ([ADR-014](../decisions/adr-014-how-fkit-tests-itself.md)) to cover the
   **script's** logic against synthetic payloads, and the live session path to remain hand-verified.

## 7. Open questions for the owner

1. **Exact heading text** — literally `What's next?`, or a looser match? Check B is an exact match, so
   this is a contract, not a preference. *(Recommend: the literal string, since it is what you asked
   for.)*
2. **Does check A apply to every role, or only the coder?** The complaint was about the coder;
   ruling 3 made "What's next?" universal but said nothing about check A. *(Recommend: universal — the
   reviewer and producer put questions to you too.)*
3. **Turn-scoped state for block-once** (§5.4) — where does the marker live and when is it cleared? A
   stale marker silently disables the hook; a missing one risks a loop. **A coder-level decision, but it
   is the piece most likely to go subtly wrong.**

## Related

- [ADR-018](../decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) — the `PreToolUse` hook:
  the precedent, the wiring pattern, and the standing judgement that prose-only enforcement is
  insufficient.
- [ADR-016](../decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md) §6 —
  *delivery structural, compliance advisory*; the managed rules block as the shared-instruction layer.
- [ADR-021](../decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md) — `AskUserQuestion`
  is session-only; the reason §5.3's skip condition is safety-critical.
- [`conventions/evidence-before-assertion.md`](../conventions/evidence-before-assertion.md) — binds the
  "What's next?" content.
- Code: `claude/fkit-claude.sh:257-283` (`build_settings()`), `claude/skill-ownership-hook.sh`,
  `claude/fkit-claude-init.sh:316-341` (`emit_block()`, `RULES_MAX`),
  `claude/agents/fkit-coder.md:34,:192-198` (the rule that already exists and does not fire).
