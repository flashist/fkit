# Cut the v0.3.0 release with an annotated tag as the measurement anchor, then hand-archive Sprint 7

**Source**: `ai-agents/tasks/done/0360-cut-the-v0-3-0-release-and-hand-archive-sprint-7/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 7 · `P12` · task `0360` · owner `fkit-producer`

## Goal

Two acts in one row, in a ruled order: **cut `v0.3.0` with an ANNOTATED tag** so `0359`'s counter has a
dated point in history to measure from, **then hand-archive Sprint 7**.

## Key Changes

- **`VERSION` and `package.json` read `0.3.0`.** ⛔ **The release is committed and tagged LOCALLY and
  was never pushed — the push is the owner's.**
- **Sprint 7's plan moved to `ai-agents/sprints/done/sprint-7.md`** with a `## 🔒 CLOSED — 2026-09-08.`
  banner, and every relative href repaired in both directions.

⚠️ **TWO CONSEQUENCES OF THE ORDER, ACCEPTED BY OWNER RULING** (2026-09-08, option label verbatim
**"Keep the brief's order (Rec)"** — release first, then archive):

1. ⛔ **The tag `v0.3.0` does NOT contain the archive.** It sits **one commit before** the sprint's
   closing commit. The anchor is a **dated point in history**, which is what `0359` needs — ⛔ **but
   anyone reading `v0.3.0` as *"the tree at the moment Sprint 7 closed"* is wrong.**
2. ⛔ **The archive was left UNCOMMITTED for the owner.** ⭐ Proving the archive separately from the
   release gate is the honest split — **the archive is the part that could red a guard.**

⚠️ **THE ROW FLIPPED ITS OWN STATUS TO PERFORM THE ARCHIVAL.** `0360` stood `🔄 In progress` on the
very board it archives, and a board with an open row may not be archived. By **owner ruling of
2026-09-08, option label verbatim "Flip the row by hand before the move (Rec)"**, its row was flipped by
hand to `✅ Done (agent-closed — not owner-verified)` **before** the move — ⛔ **not by a mover, and not
after the fact.** The producer's later `/fkit-task-done` therefore found the row already `✅ Done`.
⛔ **Disclosed because the row closed itself: nothing independent verified that `0360`'s own work was
complete when it said so.**

### The link repair

⛔ **Doing it wrong would manufacture a fresh broken-link set in the sprint that built the guard against
them.** Repaired by an explicit script over link **targets only** — ⛔ never a blind text `sed`, because
the string `sprint-7.md` appears throughout the file's prose and code spans.

⭐ **One counting rule, both directions: an instance inside an inline code span is quoted literal text,
NOT a pointer.** ⛔ An earlier draft of the banner counted outbound and inbound under **opposite** rules.

- **Outbound: 91 instances = 89 followable pointers + 2 inline-code literals**, becoming **99 = 97 + the
  same 2** once the banner and the `## Notes` addendum add their own.
- **Inbound: 36 real link instances across 14 files**, by owner ruling **"Repair all 36 (Rec)"**.
  ⛔ An earlier draft said *"29 inside closed and cancelled task folders"*; **measured, it is 23**.
- ⭐ **Href-only in twelve of the fourteen — and NOT in two.** `0176` and `0237` each took their href
  repairs **plus a seven-line dated annotation**, by ruling **"Annotate, don't rewrite (Rec)"**, because
  each freezes a quotation a blind repair would have rewritten.

## Outcome

Closed `✅ Done (agent-closed — not owner-verified)`.

⭐ **The archival carries an owner ruling — 2026-08-29, option label verbatim "Hand-archive again, with
the caveat (Rec)" — and is STILL not owner-verified.** ⛔ **Both halves are true and neither cancels the
other.** Sprint 6's banner records that *its* archival carried **no** ruling; ⛔ **that sentence is false
here and was deliberately not copied.**

⛔ **The board's success criterion was MISSED: 20.5% against a target of under 10%** — reported in this
row's banner with the real number, as the brief required.

⚠️ **`b677fa0` (the release commit) swept in this task's `plan.md` via the release script's
`git add -A`.** The archival itself landed one commit later, in `b4a1a52`.

## Related
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board this row archived
- [[tasks/the-throughput-counter-created-vs-closed-per-iso-week]] — `0359`, whose counter the tag anchors
- [[tasks/settle-whether-a-sprint-board-may-be-committed-unranked]] — `0361`, the hard blocker that had
  to land before the release
- [[tasks/archive-sprint-5-move-the-plan-into-sprints-done]] — `0294`, the archival shape and the
  dangling-successor-link analysis this reused
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — the in-release test gate this cut ran through
- [[tasks/fix-the-version-labeled-sha-triggered-update-banner]] · [[tasks/fix-the-post-release-verify-lines-failing-and-false-green-cases]]
  — earlier repairs to the same release path
- [[systems/install-and-self-update]] — the release and self-update machinery
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — the rank rules
  the archival honoured
