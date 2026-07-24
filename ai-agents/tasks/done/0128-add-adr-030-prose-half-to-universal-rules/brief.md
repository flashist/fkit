# Add the ADR-030 prose half to the universal rules block — "What's next?" + ask-interactively

## ID
0128

## Sprint
Sprint 2

## Priority
112

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

[ADR-030](../../../knowledge-base/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md)
Decision 8 mandates a **prose half** alongside the `Stop` hook: the two behavioural clauses the hook
**cannot** enforce, carried in the managed rules block so the requirement is legible to an agent
**before** it is ever blocked. The hook corrects; the prose is what it corrects *toward*
(design §5.5 in [`reports/2026-07-19-design-turn-completion-hook.md`](../../../knowledge-base/reports/2026-07-19-design-turn-completion-hook.md)).

**This work is a known, already-unblocked, but never-filed ADR-030 deliverable — a producer catch.**
Task 79 / 0022 (compress the Output style section of `claude/scaffold/universal-rules.md`) was done
**specifically to make room for it** — its worklog records *"the ADR-030 prose-addition brief is now
unblocked (~430 B into 957 B of headroom)."* The brief was simply never written. This files it.

**This is the prose half of ADR-030 only.** The **hook half** is task 0127. The two are independently
shippable in either order; neither blocks the other.

## What to build

Add the ADR-030 prose (design §5.5 draft, ~430 B) to the **Output style** section of
`claude/scaffold/universal-rules.md` — the source of the marker-delimited rules block that
`claude/fkit-claude-init.sh` (`emit_block()`) re-injects into every consuming project's `CLAUDE.md`
and `AGENTS.md` on every launch (design §3). Two clauses, universal across roles (ADR-030 Decision 3):

- **Close with "What's next?"** — end every reply to the owner with a short *What's next?*: after any
  prescribed output shape, never instead of one; *"nothing pending"* is a valid body; **never invent a
  next step**, and **never assert repo state not checked this turn** (binds to
  [`conventions/evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md)).
- **Ask interactively** — in a session, put a question to the owner with `AskUserQuestion`, not prose;
  batch related questions; mark the recommendation; in a spawned consult the tool is absent, so return
  open questions in the reply instead.

The design §5.5 draft is a starting point, not a verbatim mandate — but the two load-bearing clauses
above (*never invent a next step*; *never assert unchecked repo state*) must survive any wording change,
per the R4/0022 precedent that a cut which saves bytes by dropping a qualifier is a **regression**.

**Hard constraint — the byte cap** (design §3, §6.5). `claude/fkit-claude-init.sh:318` sets
`RULES_MAX=4096` and the launch **aborts** if the block exceeds it. **Re-measure the live block before
landing** — do not trust the ~430 B / ~957 B figures blindly; they were measured at design time and the
block has changed since. The addition must fit with margin.

## Verification steps

1. The two clauses are present in the **Output style** section of `claude/scaffold/universal-rules.md`,
   both load-bearing qualifiers intact (*never invent a next step*; *never assert unchecked repo state*).
2. The generated rules block stays **under `RULES_MAX` (4096 B)** — measure the emitted block and
   confirm margin remains; a launch must not abort.
3. A launch re-injects the updated block into a consuming project's `CLAUDE.md` and `AGENTS.md`
   (`emit_block()` runs clean).
4. Dual-home parity re-checked: the design believes the file is single-homed under `claude/scaffold/`
   (not `claude/scaffold/ai-agents/`) — **re-verify with a `find`, do not trust it** (0022 precedent).

## Notes

- **Owner:** fkit-coder.
- **Depends on:** nothing — task 79 / 0022 already reclaimed the headroom; this is unblocked today.
- **Blocks:** nothing (the hook, task 0127, does not depend on this prose; design §5.5 — nothing depends
  on the prose half).
- **Companion task:** 0127 (the ADR-030 hook half) — same ADR, independently shippable, either order.
- A **review pass is warranted** — this edits the shared rules block that lands in every agent's context
  on every turn; the R3/0022 precedent applies.
- No commit — leave the change in the working tree.
