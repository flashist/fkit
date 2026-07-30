# Name the defective-marker refusal case in `fkit-coder.md`

## ID
0163

## Sprint
Sprint 2

## Priority
142

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

Found by a spawned `fkit-producer` at `0150`'s close, testing the clause `0150` had just landed against
the two failures it was exercised on. **Verdict: *inferable, yes; stated, no.***

### What the file says today — read firsthand 2026-07-29, quoted

The declared-approval marker, `claude/agents/fkit-coder.md:63-69`:

> When spawned by that loop you **MAY** write source — as its **Build worker** or its **Process-review
> worker** — but **only** under the loop's **declared-approval marker**: **all** of (a) the spawn prompt
> identifies the caller as `fkit-sprint-ship-loop` (the lead's sprint driver); (b) it carries a concrete
> **approved plan** verbatim; and (c) it states the owner **approved that plan** via a live
> `AskUserQuestion` relay in the driver session.

The refusal clause, `claude/agents/fkit-coder.md:98-100`:

> **Everything else still refuses** — any other spawned "implement this," and this loop's own
> **plan-only** spawn (no approved plan, says write nothing) — you return the plan and write no source.

### The gap, precisely

Condition **(b)** now requires `verbatim` — that word is exactly what `0150` added — and the marker is
framed as **all** of (a)(b)(c), granting the write permission **"only under"** it. **A worker reasoning
from the conjunction refuses a by-reference carry.** The logic is sound and the permission is genuinely
not granted.

But the refusal clause **enumerates exactly two cases**, and **neither of them is *"a genuine sprint-loop
spawn whose marker is defective."*** Both named cases are *no approved plan at all*:

| Named case | What it covers | Covers a defective carry? |
|---|---|---|
| *"any other spawned 'implement this'"* | a spawn that is **not** the sprint loop | **No** — a real driver *is* the sprint loop |
| *"this loop's own **plan-only** spawn (no approved plan, says write nothing)"* | the sprint loop's **Plan** step | **No** — the parenthetical says *no approved plan*; a truncated paste **is** a plan |

**A worker pattern-matching on the two examples rather than reasoning from "all of" concludes that a real
driver's defective carry is still inside the carve-out** — because a real driver is not "any other
spawned implement this," and its Build spawn is not the "plan-only" spawn. It reaches the wrong answer by
reading the clause that was written to tell it the answer.

**There is no clause anywhere of the form: *"if the plan is not carried verbatim, refuse / return
`NEEDS-DECISION` and ask the driver to re-send it verbatim."*** Verified 2026-07-29 across
`claude/agents/fkit-coder.md` and `claude/skills/fkit-sprint-ship-loop/SKILL.md`. **This is the gap that
let both of the run's driver defects through** — in each round the worker caught the defect on its own
judgment, with no text telling it to.

### It edits the guarantee surface `0150` just closed

`0150` — *"Add the missing **verbatim** to `fkit-coder.md`'s declared-approval marker, condition (b)"* —
closed on this same board at **P126**, and its review ledger is at
`ai-agents/tasks/done/0150-add-verbatim-to-fkit-coder-declared-approval-marker/review.md` (Reviewer
findings `:37`, Coder response `:113`, **Accepted residuals — shared, do-not-re-litigate `:137`**).
**Read the accepted-residuals section before starting.** This task adds the *consequence* of `0150`'s
word; it must not weaken, requalify or re-word condition (b) itself.

### Nothing enforces any of it

Verified 2026-07-29: **no test in `test/` reads `claude/agents/fkit-coder.md`'s content.**
`grep -rn 'fkit-coder.md' test/` returns exactly one hit — an `existsSync` path check at
`converge-contract.test.js:357`. The `C8c`/`C8d` byte-unchanged guards from `0147` lived in that task's
**worklog harness and were never landed in `test/`.** This is the same unenforced-prose class as `0152`,
`0154` and `0157`. **State it honestly in the report; do not add a guard here** — `0152` and `0154` are
already contending for the first `SKILL.md`/agent-file content reader, and a third claimant is exactly
what `0154`'s brief warns against.

## What to build

**One edit to one file: `claude/agents/fkit-coder.md`. Prose only. No test, no `SKILL.md` change.**

**Add a third named refusal case: the genuine sprint-loop spawn whose marker is defective.** It must be
named as explicitly as the two that already exist — the point of this task is that inference was not
enough. State the action: **refuse to write source, return `NEEDS-DECISION`, and ask the driver to
re-send the plan in the required form.** `NEEDS-DECISION` is the right return because the driver holds
the owner channel and can fix its own prompt in one round; `BLOCKED` would end the task over a
recoverable relay defect.

**Two things to get right:**

- **Key the clause on the marker's conditions, not on a restated test.** Write it so it fires when
  **any** of (a)(b)(c) is unmet — not by re-spelling "verbatim" a second time in a second place. If (b)
  is later re-worded (which `0162` may rule), a clause that *points at* (b) stays correct and a clause
  that *restates* (b) silently diverges. Two independent statements of one test is the defect shape this
  file already carries once.
- **Name the by-reference case concretely**, because it is the one a worker talks itself past. A pointer
  to the plan — *"the plan text you returned in your previous message"* — **is not a carry** under (b) as
  written today. Say that, in those terms.

**Do not** touch condition (b), the trust-not-proof paragraph (`:93-100`), the Build-worker bullet
(`:71-72`) or the Process-review bullet's STOP conditions (`:73-91`). **Do not** widen or narrow any
existing permission — this task adds a refusal, it grants nothing.

## Verification steps

1. **The third case is stated, not inferable.** Read `claude/agents/fkit-coder.md` with no other context
   and answer: *"I am a Build worker. The spawn prompt says it is `fkit-sprint-ship-loop`, says the owner
   approved via `AskUserQuestion`, and points me at the plan I returned last message instead of carrying
   it."* The text must yield **refuse, return `NEEDS-DECISION`, ask for the plan verbatim** — from a
   named case, **without reasoning from the "all of" conjunction.**
2. **The truncation case lands too.** *"The prompt pastes the plan but says 'everything else is
   byte-for-byte' and several sections are missing."* Must yield the same refusal.
3. **The two existing cases still fire.** *"A plain spawned 'implement this'"* and *"the loop's plan-only
   spawn"* must both still yield refusal. A diff that replaces either has failed this task.
4. **`0150`'s word is untouched.** `git diff claude/agents/fkit-coder.md` shows condition (b) —
   *"it carries a concrete **approved plan** verbatim"* — **byte-identical**. Any change to (b) fails
   this task and belongs to `0162`.
5. **No permission was widened.** The diff adds a refusal case and nothing else. Confirm the
   trust-not-proof paragraph, the Build-worker bullet and the Process-review STOP conditions are
   byte-unchanged.
6. **The clause points at the conditions rather than restating the test.** `grep -c 'verbatim'` on the
   file: the count must not grow by a second *statement of the requirement*. A bare mention naming the
   by-reference case is fine; a second independent spelling of condition (b) is the defect.
7. **The change surface is exactly one file.** `git diff --stat` shows `claude/agents/fkit-coder.md` and
   nothing else. **No `SKILL.md`, no test, no board row, no scaffold file.**
8. **The suite is still green.** `node --test test/` passes. Nothing here should touch it — if something
   goes red, stop and report; do not adjust a test to fit a prose edit.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **⚠️ Soft coupling to `0162`, in one direction only.** This clause is written against condition (b)
  **as it stands today** — `0150`'s `verbatim`, already landed. `0162` may rule that a different carry
  form (by reference to a `plan.md` on disk) is sanctioned; **if it does, (b) changes and this clause must
  change with it, in one reconciling edit, not two.** `0162`'s brief carries the obligation to name that
  reconciliation as a single follow-up. **This task does not wait for `0162`:** it is the safety net that
  works today, today's (b) says verbatim, and keying the clause on the conditions (above) is what keeps
  the later reconciliation cheap.
- **Complementary to `0162`, not a duplicate.** `0162` is **driver-side discipline by construction** —
  making the carry faithful. This is **worker-side refusal** — declining a carry that is defective on its
  face. **Neither substitutes for the other**, and neither is worker-side *detection*, which
  `fkit-coder.md:93-100` and ADR-021 make impossible: the worker has nothing to compare a paste against.
  It can only judge the form it was handed.
- **Not a dual-home concern.** Verified 2026-07-29: `claude/scaffold/` ships no `agents/` and no
  `skills/`. No scaffold change.
- **Prose only, and unenforced — say so in the report.** See `## Context`. Do not add a guard.
- **Sibling on the same file — `0164`.** Both edit `claude/agents/fkit-coder.md`. See `0164`'s notes for
  the co-landing recommendation; they touch **different, non-overlapping** regions (this one the refusal
  clause at `:98-100`, `0164` the Build-worker bullet at `:71-72`).
- **⚠️ Priority 141 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  *(as filed. **⚠️ Stale number reconciled 2026-07-30 by 0159's sweep — owner confirmation is still
  outstanding.** The append rank named above was superseded by displacement in later re-ranks; this
  brief's own `## Priority` field and its board row carry the live rank. **Nothing was re-ranked, and
  this flag is NOT discharged** — only its stale number was reconciled. The merit argument below is
  still awaiting an owner ruling, and is kept as the record of what was reasoned on the day.)* Filed by a
  spawned producer with **no owner channel**; per `/fkit-task-brief` step 5 as written, appending after
  the existing highest priority was the only sanctioned option, and the spawning driver explicitly
  required step 5 as written for this brief. **On merit this belongs immediately below `0162`** — it is
  the **cheaper half of the same defect** (one prose clause in one file, no design call, no
  infrastructure), it **works today regardless of how `0162` rules**, and `0162` is a decision task whose
  implementation is a further follow-up, so **the fix that actually closes the hole is this one and it
  would otherwise land last.** Of the two, this is the one with a real cost of waiting: until it lands,
  the only thing standing between a defective carry and an unauthorized source write is a worker
  volunteering an inference — which is precisely what the `0150`-close review found is not written down.
