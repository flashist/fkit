# Give the task movers a step for the `NAMED_EXEMPT` keys a move invalidates

**Source**: `ai-agents/tasks/done/0381-give-the-task-movers-a-step-for-the-named-exempt-keys-a-move-invalidates/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 8 · `P4` · `0381` · ✅ Done (agent-closed — not owner-verified)

## Goal

**The defect, in the coder's own words:**

> **"`/fkit-task-done` reasons about links it must *repoint* but has no step for exemption keys it must
> *delete* — the keys are in a test file, outside the folders it inspects."**

⛔ **Measured on disk 2026-09-07: the strings `NAMED_EXEMPT` and `reference-integrity` appear ZERO
times in EITHER mover `SKILL.md`.** ⭐ **The movers do not know the set exists** — so a fix landing only
in `fkit-task-done` half-ships it.

## Key Changes

### ⭐ The durable rule this task exists to record

> **"`../../done/X` survives, `../X` does not" is right about a POINTER and INVERTS for an EXEMPTION
> KEY.**

A sibling-relative link **heals** when its citer moves into `done/` beside a target already there. ⭐ **At
that moment the exemption is dead weight and must be DELETED, not repointed.** ⛔ **A run that applies
the pointer rule to the key does exactly the wrong thing.**

**A move can invalidate a key in two opposite directions, and the mover handled neither:**

| Direction | What happens |
|---|---|
| **Orphaned** | The citing file named in the key moves, so the key names a path that no longer exists and **suppresses nothing** |
| **Healed** | The link the key excuses starts **resolving**, so the exemption is dead weight — and `L4` (`targetIsBack`) reds on a **satisfied** exemption |

### ⛔ It fired TWICE in one day, both times as a red suite found AFTER a close reported success

1. Closing **Sweep C's five members** left three keys pointing at `0358`'s `backlog/` path.
2. Closing **`0358`** itself made those three links **resolve** — `namedExemptCount` fell **9 → 6**, and
   ⭐ **`L3` went red on the FALL, not on a rise.** A fourth link (`0290`) broke in the same move and
   needed a **new** exemption.

⚠️ **It does not fire on every close, which is why it kept surviving.** Closing `0359` the same day
grepped clean — zero keys naming that folder, no test-file change needed. ⭐ **A mover with this gap
reports a clean close most of the time.**

⭐ **The lesson was already written in prose — inside `test/reference-integrity.test.js`'s own
`NAMED_EXEMPT` comment block.** ⛔ **Which is exactly the wrong place for it:** visible to a reader of
the test, invisible to the skill that must act on it.

### ⛔ The brief deliberately did NOT choose the fix

**Three options were framed for the plan gate** — (A) the movers gain a step, (B) the key format
becomes move-invariant, (C) something better. ⛔ ***"A run that arrives having already picked one has
skipped the gate."***

**What any option had to settle regardless:** who may edit the coder-owned
`test/reference-integrity.test.js` (⭐ a spawned producer running a mover cannot — most plausibly it
returns `NEEDS-DECISION` naming the exact keys); how a **legitimate** fall in `namedExemptCount` goes
green without disarming the guard against an illegitimate one; and ⛔ **both movers, not one.**

### ⛔ Distinct from two rows it will be tempting to merge with

| Row | What it is | Why it is not this |
|---|---|---|
| `0378` | Telling a **concurrent** close's transient link-red from your own | **Concurrency/timing** — someone else's in-flight move |
| `0363` | The sweep-completion step that stops a fixed class recurring one file over | **Claim propagation** across a class |

⭐ **This row reds DETERMINISTICALLY** — given a key naming the moving folder, the suite goes red every
time, no race, no second actor. ⛔ **Say so if anyone proposes folding the three.**

## Outcome

⭐ **It shipped as prose pins in the mover skills plus durable mutations.** `test/prove-red.sh`'s
**mutations 33 and 34 both name `0381`**: 33 rewrites `fkit-task-done`'s
`**Delete the key — do not repoint it.**` and must red `T3 … targetIsBack delete rule`; 34 swaps a
board word in `fkit-task-cancelled` and must red `T11 … board-dependent sentences`.

⭐ **Mutation 34 also wrote its own successor into its comment** — it existed so the uniformity half
would not be *"permanently unexercised in this gate … before task 0341 pastes the clause a third and
fourth time."* ⛔ **`0341` pasted it a third and fourth time and added no mutation**, which is how
[[tasks/give-the-sprint-mover-pins-and-successor-mode-durable-prove-red-mutations]] came to exist.

⭐ **Its discipline became the template `0388` was required to follow:** an injected marker where the
prose could occur naturally (⛔ **but never where the wrong value IS the marker**); four checks per
mutation (the edit is not a no-op, no un-mutated copy survives, it landed, it landed exactly once);
and ⭐ **assert the suite reds AT THE NAMED ASSERTION**, failing on *"red for the wrong reason."*

⚠️ **It also unblocked a cosmetic fix it was queued ahead of:** `0340`'s folder rename was declined
precisely because this task had not shipped. ⛔ **Re-titling after it shipped is cheap — and was
explicitly not authorised by that note.**

## Related
- [[tasks/sprint-8-give-sprints-the-lifecycle-tasks-already-have]]
- [[tasks/give-the-sprint-mover-pins-and-successor-mode-durable-prove-red-mutations]]
- [[tasks/build-the-producer-only-sprint-movers]]
- [[tasks/backfill-a-sprint-status-onto-every-existing-sprint-plan]]
- [[tasks/sweep-c-the-wiki-vault-resyncs-as-one-pass]]
- [[tasks/build-the-link-resolution-guard]]
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]]
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]]
- [[systems/testing-and-verification]]
