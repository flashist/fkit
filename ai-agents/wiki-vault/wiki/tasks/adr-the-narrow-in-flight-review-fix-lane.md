# ADR the narrow in-flight review-fix lane — a reviewer's finding on a diff already under review is recorded, not filed as a task

**Source**: `ai-agents/tasks/done/0352-adr-the-narrow-in-flight-review-fix-lane/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 7 · `P2` · task `0352` · owner `fkit-architect`

## Goal

Write the ADR that gives a reviewer's own in-flight finding a written home, so it stops becoming a task
folder. ⭐ **One of the two structural causes of Sprint 7's record-repair rate.**

**The owner ruling this task executes**, 2026-08-29, live via `AskUserQuestion`, option label verbatim
**"Narrow it — in-flight review fixes only (Rec)"**, with a binding description:

> *the lane covers ONLY a fix a reviewer finds on a diff already in front of them. It exempts no new
> work and needs no size judgement at filing time — it just stops a reviewer's own finding from
> becoming a task folder. Your standing rule survives untouched.*

⛔ **THREE THINGS THE RULING FORBIDS — an earlier proposal had all three and was superseded by name:**

1. ⛔ **NO SIZE FLOOR.** Not *"under N lines"*, not *"trivial"*, not *"one-liner"*. ⭐ **The lane is
   defined by WHERE the finding came from, never by how big the fix is.**
2. ⛔ **`/fkit-task-brief`'s smallest-shippable rule is NOT AMENDED** — the owner's standing rule
   survives **untouched, byte-for-byte**. ⛔ An ADR that weakens, qualifies or footnotes it has failed.
3. ⛔ **NO NEW WORK IS EXEMPTED.** Work that did not arrive as a finding on a diff already under review
   still gets a brief, however small.

⛔ **The superseded proposal — amending the smallest-shippable rule with a size floor — must not be
revived**, not as an option, a footnote, or a *"rejected alternative that could be revisited"*.

## Key Changes

⭐ **The route already half-existed.** The stateful review pair — `fkit-stateful-review` (reviewer
writes findings) and `fkit-process-stateful-review` (coder verifies, classifies, gates on the owner,
records the outcome) — already round-trips findings through a `review.md` ledger inside the task
folder. ⭐ **The ADR's job was to say when that ledger is the TERMINUS and when a finding must still
leave it as a brief** — ⛔ not to invent a new mechanism.

⛔ **The conflict it had to face rather than route around:**
[[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]] makes a
closed ledger **frozen**, so a lane terminating in the ledger has a hard edge — ⛔ **a finding arriving
after the ledger closes cannot use the lane.** Stated explicitly, not left to be discovered.

The ADR number was to be **re-derived, not copied forward** (045 as measured 2026-08-29).

## Outcome

Closed `✅ Done (agent-closed — not owner-verified)`. The deliverable is
[[decisions/adr-045-an-in-flight-review-finding-terminates-in-the-ledger-not-a-new-task]] —
⚠️ **which then had no vault page of its own until Sweep C ingested it on 2026-09-05**, six days after
the ADR shipped.

⛔ **The ADR is DECIDED, NOT BUILT** — *"a close report or a status briefing implying the lane is live
has misreported."*

- **Depends on / Blocks:** as recorded on the board — this is `P2`, ahead of the guard-and-sweep chain.

## Related
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board this row sits on
- [[decisions/adr-045-an-in-flight-review-finding-terminates-in-the-ledger-not-a-new-task]] — the
  deliverable
- [[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]] — the
  frozen-ledger rule that draws the lane's hard edge
- [[systems/review-and-model-diversity]] — the stateful review pair the lane runs through
- [[tasks/sweep-c-the-wiki-vault-resyncs-as-one-pass]] — the pass that finally gave ADR-045 a page
