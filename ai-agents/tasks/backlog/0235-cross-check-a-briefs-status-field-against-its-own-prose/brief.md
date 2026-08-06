# Cross-check a brief's `## Status` field against its own prose — heuristic, and honest about it

## ID
0235

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Filed on a named owner ruling** taken via `AskUserQuestion` in a live `fkit lead` session on
**2026-08-06** — verbatim: **"File it."**

### The gap, with its worked example

Task `0185`'s brief carried `## Status: 🔲 Backlog` while its **own `## Notes` in the same file** read
*"🚧 **Blocked on an owner ruling** — deferred 2026-08-01."* Those are two different states, written
into one file, disagreeing with each other. The dependency line was the accurate one. **The `## Status`
field was wrong from 2026-08-01 to 2026-08-05 — five days — and nothing caught it.**

`0185`'s own closing record states why: `🚧 Blocked` is free for any session to set, and no control
reconciles a brief's status field against what the brief says about itself.

### Why no existing control sees it

`dashboard.sh` already cross-checks **three** carriers against each other:

- the board row's Status cell,
- the brief's `## Status` field,
- the folder location (`backlog/` vs `done/` vs `cancelled/`).

All three of those are **structured**. Every disagreement among them is reported. But the fourth
carrier — **what the brief says about itself in prose** — is checked against nothing. A brief can be
internally self-contradicting and every control in this repo reports green.

### ⚠️ The honest limit — this must be in the brief, and it must NOT be sold as detection

**A brief's prose is free text. Any check here is a heuristic — it will be noisy, evadable, or both.**
There is no construction that makes it a guarantee:

- **Noisy.** Briefs legitimately quote status markers as *subject matter*. This very brief contains the
  string `🚧 Blocked` while its own status is `🔲 Backlog`, and that is correct. So does
  `task-status-vocabulary.md`, so does every brief about the status vocabulary, so does every review
  ledger discussing a blocked task. A naive scan reports all of them.
- **Evadable.** The failure mode is a human or agent writing a state into prose that they forgot to
  write into the field. Nothing stops the next one from phrasing it in a way no pattern matches.

**The owner was told this explicitly when they ruled, and ruled to build it anyway.** The value on
offer is *catching the obvious case cheaply*, not coverage.

**⛔ A close report, test name, comment, or documentation line that presents this check as guaranteeing
a brief's status is honest is a DEFECT of this task, not a wording nit.** Everything this ships must
read as *"catches an obvious class"*, never *"prevents"*.

## What to build

A check that reports when a brief's `## Status` field is contradicted by an assertion the brief makes
about **its own** current state.

### The three decisions this task must make and state

1. **Where the check lives.** A `node --test` guard under `test/`, or a drift record emitted by
   `dashboard.sh`. **These are not equivalent and the choice is load-bearing:** a test blocks a commit,
   a drift record renders on a board and can be lived with. Given the check is explicitly heuristic,
   **the recommendation in this brief is the drift-record shape** — a noisy heuristic wired to a hard
   gate turns into a suppression list within a week. **Argue it either way in the plan, but choose and
   record why.**
2. **The condition.** What counts as "the brief asserting a state about itself" versus quoting one.
   State the convention explicitly. Skipping fenced blocks and blockquote lines is the precedent
   already adopted for the citation guard (`0176`, scoping decision 2) and is the obvious starting
   point, **but it is not sufficient here** — `0185`'s real defect sat in an ordinary `## Notes`
   bullet, not in a quote.
3. **The false-positive budget, measured, not guessed.** Run the candidate condition over **every
   brief in `backlog/`, `done/` and `cancelled/`** and report the raw hit count and how many are true
   defects. **If the noise is worse than the signal, say so and recommend not shipping it** — that is a
   legitimate outcome of this task and is not a failure. It is more useful than a check nobody trusts.

### Constraints

- **⛔ Do not edit any brief's `## Status` field as part of this task.** If the sweep in decision 3
  finds live self-contradicting briefs, **report them; do not repair them.** Repairing a brief's own
  fields is the producer's call, and `0229` already covers widening `/fkit-task-done` for one such
  case. File what you find back to the producer.
- **⛔ Do not move any task file.** `/fkit-task-done` and `/fkit-task-cancelled` are producer-only
  (ADR-033).
- **⛔ No new devDependency** (ADR-014).
- **⛔ No `:NNN` line-number citations** in this task's artifacts.

## Verification steps

1. **`0185` is the acceptance fixture.** Reconstruct its 2026-08-01 → 2026-08-05 state (`## Status:
   🔲 Backlog` + the `🚧 Blocked on an owner ruling` notes bullet) and show the check fires on it.
   **A check that does not catch the case it was filed for has failed.**
2. **This brief is the negative fixture.** `0235`'s own `## Status` is `🔲 Backlog` and its prose
   contains `🚧 Blocked` as subject matter. The check must **not** fire on it. Same for
   `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` if it is in scope.
3. Report the full sweep from decision 3: total briefs scanned, raw hits, and a per-hit true/false
   classification. Numbers, not adjectives.
4. Whichever shape was chosen in decision 1, prove it fails when it should: for a test, show the
   mutation red under `test/prove-red.sh`; for a drift record, show the fact line emitted and the row
   still rendering.
5. `npm test` passes with no change to `package.json`.
6. **No board and no `brief.md` `## Status` field was modified** — `git diff --stat` proves it.
7. **State the heuristic limit by name in the close report**, in the same words the ruling was given
   under: noisy, evadable, or both; catches an obvious class; guarantees nothing.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **Related, not blocking:** `0229` (widening `/fkit-task-done` to repair a brief that contradicts a
  landed close) and `0230` (repairing the self-contradiction inside `task-status-vocabulary.md`). All
  three circle the same weakness — **a brief's own fields have no keeper** — and none of them subsumes
  another. `0230` fixes one document; `0229` fixes one mover's behaviour on close; this one looks for
  the disagreement while the task is still open.
- **⚠️ Not-shipping is a sanctioned outcome.** If decision 3's measurement says the noise dominates,
  the deliverable is the measurement plus a recommendation, and the task closes on that. Say so up
  front in the plan so it is not read as a failure at close.
- ⚠️ **DATED CORRECTION 2026-08-06 — the open question this brief was filed with is ANSWERED.** The
  bullet above is left byte-identical. **The question, as put to the owner at filing:** `0235` may come
  back recommending **not to ship**, because a brief's prose is free text, so any checker here is
  heuristic — noisy, evadable, or both; decision 3's false-positive measurement is a real gate and a
  null result is a sanctioned outcome. The producer asked the owner to confirm they wanted it built on
  that basis. **Owner ruling, verbatim: *"Build it, null result acceptable."*** Given **2026-08-06** via
  `AskUserQuestion` in a live `fkit lead` session. Recorded here so the next reader sees the question
  was **asked and answered**, not never raised. The exact framing the owner ruled under:
  - Proceed knowing the task may conclude *"don't ship this guard."*
  - **That is a real finding either way** — it converts an unexamined blind spot into a measured one,
    and **the measurement is most of the value.**
  - **Accepted cost, stated to the owner before they ruled: one task's effort to possibly ship
    nothing.**
  - **⚠️ What this ruling does NOT authorize.** It authorizes **building on the heuristic basis** and
    nothing further. The honest-limit section above stands **unweakened**: any check here is heuristic,
    it must not be presented as promising or guaranteeing detection, and the ⛔ overselling clause
    remains a defect condition of this task.
- **Priority is `—` (unscheduled).** Filed to the Backlog board on the owner's ruling; no sprint was
  named and no row was re-ranked (ADR-035, `/fkit-task-brief` step 5).
