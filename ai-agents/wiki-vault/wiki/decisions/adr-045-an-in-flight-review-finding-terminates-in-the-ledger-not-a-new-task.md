# ADR-045: A reviewer's in-flight finding terminates in the review ledger, not in a new task folder

**Date**: 2026-08-30
**Status**: accepted

**Source**: `ai-agents/knowledge-base/decisions/adr-045-an-in-flight-review-finding-terminates-in-the-ledger-not-a-new-task.md`

> ⭐ **Ingested 2026-09-05** (task `0358`, sweep C). This ADR shipped 2026-08-30 and had **no vault
> page at all** until this pass — the defect class this sweep exists to close. The bytes read were the
> working tree's, blob `fcb99a86c1d5527d070826250a5426fe17e374eb`.

> ⛔ **NOTHING CHANGES BEHAVIOUR UNTIL THE §7 FOLLOW-UPS SHIP.** This is a decision, not an
> implementation. The ADR says so itself: *"A close report or a status briefing implying the lane is
> live has **misreported**."* Read this page as a decision on the record, not as a description of the
> repo.

## Context

A reviewer working a diff finds a defect **in that diff**, and there is no written route for it. In
practice it became one of two wrong things: an **untracked in-place fix** (invisible — nothing on any
board records the code changed), or a **new task folder** (which manufactures a record-repair row for
something that could have been closed inside the review that found it).

Sprint 7's stated success criterion is to **cap record-repair rows**, and this is one of its two
structural causes. The six-week retro of 2026-08-29 measured **record repair at 42 of 129 open rows —
33%** by a stated, re-runnable title rule, and carries its own same-day correction upward from an
earlier draft's 29%: *"The original figure **understated** the problem."*

⭐ **The route already half-exists — this ADR invents no mechanism.** The stateful review pair already
round-trips findings through a `review.md` ledger inside the task folder.

## Decision

**A reviewer's finding that is in-flight — raised in this review, about the diff under review, in a
review that has not closed — terminates in the task folder's `review.md` ledger. It does not become a
new task folder. Every other finding files a brief.**

### The entry condition — three reads at the gate

| # | Condition | Proving artifact |
|---|---|---|
| **A** | The finding **came from this review** | A `## Reviewer findings` row carrying this pass's `Round`, **and** originating in this review's own reviewer pass |
| **B** | The finding is **about the diff under review** | Its `file:line` cell names a file inside the ledger header's `File(s) under review:` field |
| **C** | The review **has not closed** | The ledger header's `Status:` value **begins** `in-review` |

⚠️ **B and C are field reads; A is NOT.** Provenance has no column in the ledger schema today, so
condition A is a **judgement at the gate** — the very property the three-read design exists to avoid.
The owner ruled the rule ships with that gap in view, and named the follow-up that closes it.

⛔ **What condition A bars is an origin, not a transport.** A finding that did not originate in this
review's own reviewer pass — an ephemeral review's findings, or any external source — does not satisfy
A however it reached the table, and **files a brief**.

### The five hard limits, each ruled by name

| # | Case | Ruling |
|---|---|---|
| 1 | Finding **out of scope of the diff** | ⛔ Condition B fails → **files a brief** |
| 2 | Finding arriving **after the ledger closes** | ⛔ Condition C fails → **files a brief** |
| 3 | Finding the coder **disputes**, or the owner rules against | ✅ Terminates **when resolved, not merely argued** — see the terminal set below |
| 4 | A **large** in-scope in-flight fix | ✅ **Stays in the lane.** Size is irrelevant, by the owner's ruling of 2026-08-29 |
| 5 | Finding raised in an **ephemeral** review | ⛔ **The lane requires a stateful ledger.** No artifact exists for A–C to read |

**Limit 3's terminal set, and which states are owner-confirmed:**

| Terminal state | Who sets it | Owner-confirmed? |
|---|---|---|
| `✅ done` | Coder, at process-stateful-review Step 6 | ✅ **Yes** — Step 5 gates every code change on explicit approval |
| `won't fix (frontier)` | Coder, Step 4 → Step 6 | ⚠️ **Only at Step 6** — terminal only once the *Accepted residuals* entry is recorded |
| `disproven` | Coder, Step 4 | ⛔ **No** — coder-set |
| `closeout (re-litigation)` | Coder, Step 2 | ⛔ **No** — coder-set |

⛔ **`pending approval` and `blocked` do NOT terminate.** A finding a review ends on either, or one the
owner agrees is real but **defers**, is unresolved work and **files a brief**.

### One content requirement is added

> **Where a lane fix changes code, the `Action` cell names the files it touched.**

That makes the lane's footprint readable from one table and countable later. ⛔ **This ADR decides it;
a follow-up skill edit implements it.**

### ⛔ What is unchanged

`/fkit-task-brief`'s smallest-shippable-unit rule is untouched byte-for-byte, and its step-3 test
remains *"independent shippability, not size or effort."* **No category of new work is exempted**,
there is **no size floor in any form**, and `/fkit-task-brief` is **not amended**. The lane changes
**where a reviewer's finding on the diff in front of them is recorded** — nothing more.

## Consequences

**Positive** — a reviewer's finding on the diff in front of them stops manufacturing a record-repair
row; the gate needs **no size judgement**; the record is not lost (a findings row plus a response row
in the task folder that carried the diff); the `Action` cell makes the lane's footprint measurable.

**Negative / costs, accepted explicitly:**

- ⚠️ **Lane work never appears on a board.** That is the point and also the cost — a lane fix is
  visible in the ledger and nowhere else.
- ⛔ **Nothing changes behaviour until the follow-ups ship.**
- ⚠️ **The gate is strict against non-conforming ledgers.** **24 ledgers — 18% of the corpus** — would
  fail condition C's read (measured 2026-08-30, re-measured 2026-09-02), and their findings file
  briefs. Deliberate: an unreadable gate is a closed gate.
- ⚠️ **Condition A is not yet a field read**, and nothing marks a seeded row.
- **The stateful/ephemeral split becomes load-bearing** — the choice of review mode now decides
  whether the lane exists at all.

## Related
- [[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]] — the work-product bar this ADR **relaxes nothing in**; a lane finding is *presumptively* a work-product defect, and ADR-034's boundary is **per-site**, not per-file
- [[decisions/adr-042-a-codex-review-is-reasoning-only-and-reports-must-say-so]] — the other live constraint on what a review may claim
- [[systems/review-and-model-diversity]] — the review system this lane routes through
- [[decisions/adr-046-a-sprint-board-may-be-committed-unranked-and-an-erased-rank-flags]] — the other Sprint 7 decision ingested in the same 2026-09-05 pass
- [[tasks/replace-the-review-coverage-binary-with-adr-042s-three-state-vocabulary]] — the ledger vocabulary this ADR's terminal set builds on
