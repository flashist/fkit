# Assert the >= 400 B free budget target in a test

## ID
0219

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**The standing rules-block budget target is an owner ruling that nothing checks.**

The target — **keep at least 400 B free** under `RULES_MAX` — is an **owner ruling from task `0130`**.
It exists in exactly two places in the repo, and **both are prose**:

- the header comment of `test/rules-block-budget.test.js`: *"Standing budget target (same ruling): keep
  >= 400 B free."*
- the comment at the `RULES_MAX` assignment site in `claude/fkit-claude-init.sh`.

**No test asserts it.** ⚠️ **State this plainly in any plan or report: the target is currently
UNGUARDED.** Do not describe it as enforced, as "covered by the budget test", or as a threshold the
suite watches — it is none of those.

**How it survived its last real test — by luck of process, not by machinery.** Task `0190` raised
`RULES_MAX` 4096 → 4352 and grew the block. It came out at **115 B of slack above the target** (free
headroom 515 B against a 400 B floor, re-measured 2026-08-05). That held **because a worker measured it
by hand and reported it**, not because anything failed when it did not. The next bump has no such
guarantee.

**⚠️ The existing 92% gate is NOT a substitute, and the reason is the important part.**
`test/rules-block-budget.test.js` already has a headroom test:

    Math.round((size / max) * 100) <= 92

That threshold is **relative to `RULES_MAX`**. Raising the cap **moves the warning line outward with
it** — the exact motion the 400 B target exists to resist. Computed 2026-08-05 by enumerating every
size the gate accepts (note `Math.round`, so the true boundary is 92.5%, not 92%):

| | `RULES_MAX` | Largest block the 92% gate passes | Bytes free at that size |
|---|---|---|---|
| Before `0190` | 4096 | 3788 B | **308 B** |
| After `0190` | 4352 | 4025 B | **327 B** |

At **both** caps the relative gate passes a block with **less than 400 B free** — 308 B and 327 B
respectively — and the bump made it *more* permissive in absolute terms, not less. It is a
*utilization* warning; the owner's ruling is an *absolute byte floor*. They are different controls and
one does not imply the other. **Keep both**; this task adds the missing one.

⚠️ **Re-derive both rows rather than trusting them** — they are computed from the gate's current
expression, and the `Math.round` boundary is easy to get wrong by hand (an earlier draft of this brief
had 328 B and 348 B, off by exactly the rounding).

**Live figures, re-measured 2026-08-05** — a snapshot, not a constant: `RULES_MAX` **4352**, emitted
block **3837 B**, free **515 B**. The new assertion must read the live numbers the way the existing
tests already do, never hardcode them.

**Conflicts with no locked decision.** ADR-016's signed-bump discipline is unaffected: an owner may
still bump `RULES_MAX`, and this guard does not veto that — it only refuses a bump that leaves less
than 400 B free without a deliberate decision.

## What to build

**One new test in `test/rules-block-budget.test.js`** asserting the owner's absolute byte floor, plus
the comment repair that stops the file overstating its own coverage.

1. **Add an absolute-headroom test.** It fails when `RULES_MAX - emittedBlockSize() < 400`. Reuse the
   file's existing `rulesMax()` and `emittedBlockSize()` helpers — `emittedBlockSize()` deliberately
   runs the **real** `emit_block()` from `claude/fkit-claude-init.sh` and counts **UTF-8 bytes**;
   reimplementing either is the precise mistake that file's header narrates at length (a 107 B silent
   divergence). **Do not hardcode 4352, 3837, or 515.**
2. **Do not hardcode 400 either, without a source.** The number is an owner ruling recorded in prose.
   Decide and state where the test takes it from — a named constant in the test with a comment citing
   the `0130` ruling is acceptable; inventing a config file for one number is over-build. **Whatever
   is chosen, the ruling and its date must be readable at the assertion site.**
3. **Write a failure message that tells the truth about the choice.** Following the file's existing
   style, the message must say this is an **owner-ruled floor**, name `0130` as its source, print the
   live free-byte count, and state the two legitimate responses: **trim** `universal-rules.md`, or
   **get an owner ruling** that moves the floor or bumps the cap. It must **not** suggest raising
   `RULES_MAX` as a self-service fix — that is the discipline ADR-016 exists to enforce.
4. **Correct the header comment.** The line *"Standing budget target (same ruling): keep >= 400 B
   free"* currently sits among descriptions of what the file tests, reading as though it were tested.
   Once the test exists, say so and point at it.
5. **Prove the guard actually bites.** See verification 2 — an assertion that has never been seen red
   is an assertion nobody has checked.
6. **Change nothing else.** No `RULES_MAX` edit, no `universal-rules.md` edit, no change to the 92%
   gate's threshold or its message, no wrapper change (that is `0220`).

## Verification steps

1. **`node --test test/*.test.js` is green**, and the pass/fail counts are reported.
2. **The new test was observed FAILING on a deliberate mutation** — temporarily lower `RULES_MAX`, or
   raise the floor constant, so free bytes drop under 400; quote the red output; revert. A guard that
   has only ever been seen green is unproven. Check whether `test/prove-red.sh` is the repo's sanctioned
   home for this and use it if so.
3. **`bash test/prove-red.sh` passes**, with counts reported.
4. **Nothing is hardcoded that can be read:** `/usr/bin/grep -n '4352\|3837\|515'` over the test file
   returns no hits inside the new test.
5. **The 92% test is untouched** — `git diff` shows no change to its threshold, its assertion, or its
   message. Both tests exist and both run.
6. **The failure message names the `0130` owner ruling** and does not offer a cap bump as a remedy.
   Quote the message.
7. **The header comment no longer implies the target was already guarded** — read it back and confirm.
8. **`git diff` touches only `test/rules-block-budget.test.js`** (plus `test/prove-red.sh` if step 2
   put the mutation there). Nothing under `claude/`.

## Notes

- **Owner:** fkit-coder.
- **Depends on:** nothing.
- **Blocks:** nothing.
- **Priority: medium.** Nothing is broken today — 515 B free clears the floor. This closes a gap
  between an owner ruling and the machinery, before the next bump tests it again by hand.
- **Prompted by:** task `0190`'s `RULES_MAX` bump (2026-08-04), which held the target at 115 B of slack
  because a worker measured it, not because anything checked it.
- **Merit ordering note (soft, not a hard dependency):** landing this **before** `0220` means the
  wrapper compression ships against a guarded floor. Neither task blocks the other and either order
  works; this is a preference, recorded so the sequencing is a choice rather than an accident.
- **Owner rulings this task inherits (2026-08-01, from `0130`):** the cap measures the **emitted**
  block, not the source; standing headroom target **>= 400 B**; cap rationale is **discipline primary**
  (ADR-016), with attention dilution **suspected but unmeasured and flagged as such**.
- **Filed by a spawned producer with no owner channel**, on the owner's ruling of 2026-08-04 (relayed
  through the live `fkit lead` session) to file this follow-up. Filed on the **Backlog board** — it was
  not scoped into Sprint 2, and a spawned producer never ranks (ADR-035).
- No commit — leave the change in the working tree.
