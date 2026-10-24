# Apply `0307`'s ruling to `0172`'s stale hard dependency declaration — cancelled the day it was filed, folded into `0307`

**Source**: `ai-agents/tasks/cancelled/0372-apply-0307s-ruling-to-0172s-stale-hard-dependency-declaration/brief.md`
**Status**: cancelled — `⛔ Cancelled (agent-closed — not owner-verified) (2026-09-04)`, absorbed into `0307` as its third instance under owner ruling H24; ⛔ **not** filed in error
**Sprint/Tag**: Backlog board, unranked · task `0372` · owner `fkit-producer`

> ⭐ **Ingested 2026-10-24 by task `0380`** (the closed-task backlog Sweep C bounded out). `0307`, which
> now carries this row's work, is **still open** and so has no page.

## Goal
Open brief `0172` declares a **hard** dependency on `0171`, and its stated reason — *"a pointer to a page
that does not exist is the defect class this whole arc is about"* — stopped being true when `0171` closed
(2026-08-22) and the convention page landed. Sweep A's `0309` found the line but, by owner ruling **H2**
at its plan gate (2026-09-03, *"Surface it, hand to producer (Rec)"*), did **not** repair it: board
semantics are the producer's.

## Key Changes
⛔ **Why this is not a citation repair:** the dashboard reads that dependency line to work out whether
`0172` is ready. Editing it changes what the board computes and **can flip a truthful `ready` row
false.** The brief therefore:
- made the row **wait on `0307`**, the open task deciding *how* a corrected dependency line reaches the
  dashboard's derive cell — `0307` named `0046` and `0168` as its instances but not `0172`;
- required a before/after capture of the dashboard's derived line and an explicit statement of whether
  readiness flipped;
- told every record to **describe the bold dependency label, never quote it** — quoting it had already
  made the dashboard misread a brief once (an earlier draft of `0309`'s brief rendered a false
  dependency for `0309` itself).

## Outcome
- ⛔ **Cancelled the same day it was filed.** The filing producer flagged it as a near-duplicate and
  offered the alternative; the owner chose it — ruling **H24**, 2026-09-04, *"Fold 0172 into 0307's
  instance list, drop 0372 (Rec)"*. `0172` is now `0307`'s **third instance**: one decision, one row.
- **Nothing was edited.** `0172`'s dependency line is unchanged until `0307` rules; `0307` and `0172`
  were both still open on the Backlog board when this page was written (2026-10-24).
- Counted in the k-measurement as one of the window's cancellations.

## Related
- [[tasks/sweep-a-members-the-ten-citation-rot-rows-and-0349]] — `0309`, which found the line and surfaced it
- [[tasks/sweep-a-the-citation-rot-class-one-verified-pass]] — the pass whose ruling H2 handed it to the producer
- [[tasks/write-the-durable-citation-anchors-convention-page]] — `0171`, the closed dependency
- [[systems/backlog-convergence-and-the-k-measurement]] — lists `0372` among the window's cancellations
- [[tasks/amend-the-review-ledger-location-column-to-heading-plus-fragment]] — `0369`, the reviewer-side sibling of `0172`'s architect-side `path:line` question
