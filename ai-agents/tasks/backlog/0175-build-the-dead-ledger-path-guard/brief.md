# Build the dead-ledger-path guard — regression cover for the `review.md` header sweep

## ID
0175

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### What this guards

Task `0160`'s ruling —
[the 2026-08-01 durable-citation report](../../../knowledge-base/reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md),
§4.6, owner-ruled — changed the stateful-review ledger's self-header to carry the **task folder ID**
instead of a path:

```
Task: 0159
```

> Optionally with a live relative link **beside** the ID, never in place of it. The ID is what
> survives; the link is a convenience that may rot without taking the identity with it.

The old form named `ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md`, and `/fkit-task-done` then moved
the folder — so **the path died at close, by construction.** Task `0168` executes both halves: the
schema change (its item 2) and a one-time normalization of the 40 existing dead headers (its item 1).

**This task is the guard that stops the class coming back.** It is **follow-up 7** of report §8.

### The file and the condition, from report §7.1

**File:** a new test under `test/`, picked up by `npm test`'s existing `node --test test/*.test.js`
glob. **No new devDependency**, consistent with ADR-014.

**Condition**, in the report's own words:

> *For every `review.md` under `ai-agents/tasks/`, the path named by its first `Task:` line resolves on
> disk.* Under the §4.6 folder-ID schema the condition becomes stronger and simpler: *the ID on the
> `Task:` line equals the `NNNN` prefix of the folder the file is in* — a check with no filesystem
> lookup and no ambiguity.

**Build the second form**, not the first. The first is what the condition was before the schema
ruling; the second is what it becomes after `0168` lands, and it is strictly better — no lookup, no
ambiguity, and it catches a wrong ID as well as a dead one.

### The guard's ceiling — state it, do not quietly exceed it

Report §7.1:

> **Its ceiling:** it checks the **header**. Per the §4.6 scope note it does **not** reach the **16**
> dead paths sitting in ledger **bodies** across 14 ledgers, unless deliberately widened to whole-file
> scanning — which raises its false-positive surface, because a ledger may legitimately quote a
> historical path inside a verbatim block.

The named example of exactly that: `0148`'s closed ledger quotes a wiki completion flag **verbatim**,
carrying a `backlog/` path for a task now in `done/`. **That is correct content in a frozen ledger,
not a defect to repair.** Widening the guard to whole-file scanning would fire on it.

**Header-scoped is the intended scope.** The 16 body-level paths are a **stated residual**, not an
oversight — record them as such rather than leaving them as an unnoticed gap.

### The two hesitations the owner weighed and overrode — recorded, not hidden

Report §11, open question 6, lists two reasons to hesitate before naming this guard at all:

- **(a)** Per §4.5, a guard is exactly the *"load-bearing for another consumer"* condition in ADR-034
  — **so building one changes what ADR-034 covers.** Read ADR-034 before writing the test; this is a
  real consequence, not a formality.
- **(b)** Under the folder-ID schema the class of defect **mostly stops being generated**, so a guard
  against a defect that can no longer be written is maintenance with little yield.

> **✅ Owner-ruled 2026-08-01 (report §11, open question 6), via `AskUserQuestion` in the live
> `/fkit-sprint-ship-loop` driver session: the guard IS named, filed LOW, and sequenced AFTER
> follow-ups 3 and 4** — that is, after task `0168`. **Its value is regression cover for the sweep** —
> *"worth little before the sweep exists, more after."*

**That ruling is why this brief is filed and why it is filed low.** Both halves are the owner's, and
neither should be quietly upgraded.

## What to build

A hand-rolled `node --test` guard under `test/` asserting:

**For every `review.md` under `ai-agents/tasks/` (all three boards — `backlog/`, `done/`,
`cancelled/`): the ID on its first `Task:` line equals the `NNNN` prefix of the folder the file sits
in.**

Scoping decisions to make and state:

1. **Missing header.** At least one ledger has no `Task:` line at all — report §8.2 names `0080`. Task
   `0168` item 5 fixes it. Decide whether a missing header is a **failure** or a **skip**, and say
   which. If `0168` has landed, missing should fail; if not, the guard is red on day one.
2. **The optional link beside the ID.** §4.6 permits `Task: 0001 — [brief](./brief.md)`. The guard
   must accept both that and a bare `Task: 0001`. **A guard that only accepts the bare form rejects
   the ruled-permitted form** and is wrong.
3. **`cancelled/`.** Report §8.2 records `ai-agents/tasks/cancelled/` holds **11 task folders and 0
   `review.md` files** — checked positively, not inferred. The guard should cover the board anyway;
   there is simply nothing there to assert today.
4. **A `prove-red.sh` mutation**, per the project's existing pattern — a guard that has never been
   seen to fail is not known to work.

### Out of scope

- **⛔ Do not widen to whole-file scanning.** Header-scoped, per §7.1's ceiling. Record the 16
  body-level paths across 14 ledgers as a stated residual.
- **⛔ Do not perform or re-perform the sweep.** Task `0168` owns it. If this guard is red when it
  lands, that is `0168`'s work not finished — **report it, do not fix it here.**
- **⛔ Do not edit any `review.md`.** Frozen ledgers, per report §4.3 and ADR-034.
- **⛔ Do not add a new devDependency.** ADR-014.
- **⛔ Do not read or assert on `SKILL.md` content.** Tasks `0136`, `0152`, `0154` and `0173` own that
  walk; this guard reads `ai-agents/tasks/`, not `claude/`.
- **⛔ Write no `:NNN` line-number citations** in this task's artifacts.

## Verification steps

1. The new test file exists under `test/` and is picked up by `npm test` with **no** change to
   `package.json` — the existing `node --test test/*.test.js` glob finds it.
2. `npm test` passes, including `test/prove-red.sh`'s hard gate.
3. The guard's mutation in `prove-red.sh` makes it **fail** when the assertion is broken. Report the
   red run, not just the green one.
4. The guard accepts **both** `Task: 0001` and `Task: 0001 — [brief](./brief.md)`. Test both forms
   explicitly.
5. `git diff --stat` shows no `review.md` modified anywhere under `ai-agents/tasks/`.
6. State the residual explicitly in the close report: **header-scoped; 16 body-level dead paths across
   14 ledgers are NOT covered**, and that is by design per §7.1.
7. State whether ADR-034's coverage is affected, having read it. Do not skip this because it is not a
   code check.

## Notes

- **Depends on:** 0168. **Hard** — the condition asserts the folder-ID schema that `0168` item 2
  introduces and its item 1 normalizes. Built before `0168`, the guard is red on 40 headers on day one.
- **Blocks:** nothing.
- **LOW priority is an owner ruling, not a producer judgement.** Do not promote it without one.
- **🔗 Kept SEPARATE from task `0176` (follow-up 8) — a producer judgement, and the report explicitly
  left it to the producer.** Report §8: *"Follow-ups 7 and 8 are a pair … Whoever files them should
  consider one task with two conditions rather than two tasks — noted as a producer judgement, not a
  ruling."* **Decision: two tasks.** Reasons:
  1. **Merging takes the union of two unrelated preconditions.** This guard waits on `0168`. `0176`
     waits on an 11-citation cleanup that is a different piece of work. Merged, neither half can ship
     until both land — a strictly later ship date for whichever was ready first, against the owner's
     standing *"smallest independently shippable unit"* rule.
  2. **Different owner rulings attach to different halves.** This one carries a single ruling (named,
     LOW, after 3 and 4). `0176` carries **two** rulings plus four scoping decisions and a knowingly
     incomplete shipping condition. One brief cannot honestly carry one priority for both.
  3. **Different conditions over different scanned sets.** This asserts a structural property of one
     field in one file type, with no filesystem lookup. `0176` asserts a syntactic property across a
     wide scanned set with a fence/blockquote convention and a named exemption list.

  **The tradeoff accepted:** two test files and two `test/` walks instead of one, a small duplication
  of scaffolding. Independence is worth more than a shared file header.
- **Rank 153 is APPEND rank**, assigned under `/fkit-task-brief` step 5 by a spawned producer with no
  owner channel. **Flagged for owner confirmation.** The owner ruled this task LOW and after
  follow-ups 3 and 4; `0168` sits at P147, so **the append position satisfies the ruled sequencing**
  and merit and append coincide. No existing row was renumbered by this brief.
