# Plan — 0128: add the ADR-030 prose half to the universal rules block

## Context

ADR-030 Decision 8 mandates a **prose half** beside the Stop hook: the two behaviours the hook can't
enforce (never invent a next step; never assert unchecked repo state), carried in the managed rules
block so they're legible to an agent *before* it's ever blocked. The hook (0127) corrects; the prose is
what it corrects toward. Room was already reclaimed by task 0022; this files the never-written addition.

**Grounded / re-measured (not trusting design-time figures):**
- Source is single-homed: `claude/scaffold/universal-rules.md` (one `find` hit). It's the source
  `fkit-claude-init.sh:emit_block()` wraps + re-injects into every project's `CLAUDE.md`/`AGENTS.md`.
- **Byte budget: emitted block = 3065 B / 4096 cap → 1031 B headroom (75% used).** The ~430 B addition
  fits with ~600 B margin. `test/rules-block-budget.test.js` asserts the emitted block < `RULES_MAX`
  and must stay green.

## Change (one file, two bullets)

Append two bullets to the **Output style** section of `claude/scaffold/universal-rules.md` (after the
existing "Speak in simple terms" bullet), matching the section's bold-lead-in style. Universal across
roles (ADR-030 Decision 3). Draft (design §5.5, ~430 B — the two load-bearing qualifiers are mandatory
and survive any wording tweak):

```markdown
- **Close with "What's next?".** End every reply to the owner with a short **What's next?** — the one or
  two things they should do next, and why. After any prescribed shape, never instead of one. If nothing
  is pending, say so in a few words. **Never invent a next step to fill it, and never assert repo state
  you did not check this turn** (see `conventions/evidence-before-assertion.md`).
- **Ask interactively.** In a session, put a question to the owner with `AskUserQuestion`, not prose.
  Batch related questions; mark your recommendation. In a spawned consult the tool is absent — return
  open questions in your reply instead.
```

Nothing else changes. No hook/code change (the hook is 0127, already shipped).

## Verification
1. `node --test test/*.test.js` — **`rules-block-budget.test.js` stays green** (emitted block still <
   4096); full suite green. Re-measure and report the new block size + remaining headroom.
2. `bash test/prove-red.sh` — hard gate still passes.
3. **Dual-home / single-home re-check (0022 precedent — verify, don't trust):** `find . -name
   universal-rules.md` returns exactly one path under `claude/scaffold/`.
4. Confirm `emit_block()` runs clean and the two clauses (with both load-bearing qualifiers intact)
   appear in a re-injected block — exercised via the launcher-contract/init path in the suite.
5. Walk the brief's 4 verification steps.
6. Model-diverse review (the brief flags it — this lands in every agent's context every turn).

## Out of scope
No commit — working tree only. No hook change. The other ADR-030 pieces (0127 hook, addendum) are done.
