# Sprint 7 — Stop manufacturing record-repair rows: settle the reference-integrity condition, build the guards, sweep the class once

**Source**: `ai-agents/sprints/done/sprint-7.md`
**Status**: done
**Sprint/Tag**: Sprint 7 — 🔒 **CLOSED and ARCHIVED 2026-09-08**

> ⭐ **Ingested 2026-09-10** by the `cf289c2` → `b4a1a52` sync. The archival landed in commit
> `b4a1a52` ("Sprint push"); ⚠️ the release commit `b677fa0` (v0.3.0) sits **one commit before it**.

## Goal

Sprint 7 attacked a **rate**, not a backlog: the project was manufacturing *record-repair* rows — a
task folder, brief, plan, worklog, review ledger and close, six artifacts to append one paragraph.
Its four moves were to **settle the reference-integrity condition once** (`0353`), **build the two
guards** on that settled condition (`0354`, `0176`, unblocked by `0237`), **sweep the whole class in
three passes** that absorb and close the individually-filed rows (`0356`, `0357`, `0358`), and
**build the counter that makes the claim falsifiable** (`0359`).

## Key Changes

**15 rows — 14 `✅ Done (agent-closed — not owner-verified)` and 1 `⛔ Cancelled`.**
⛔ **A done row and a cancelled row are not the same fact and are not totalled together.** 14 closed
by doing the work; 1 (`0355`, `P5`) closed by ruling that there was no work. **Every one of the 15
closes was agent-performed.**

| Rank | Task | Page |
|---|---|---|
| P1 | `0347` — note ADR-044's oracle rule onto `0224`/`0225` | [[tasks/note-adr-044s-oracle-rule-onto-0224-and-0225]] |
| P2 | `0352` — ADR the narrow in-flight review-fix lane | [[tasks/adr-the-narrow-in-flight-review-fix-lane]] |
| P3 | `0353` — settle the reference-integrity condition, once | [[tasks/settle-the-reference-integrity-condition-once-for-both-halves]] |
| P4 | `0354` — build the link-resolution guard | [[tasks/build-the-link-resolution-guard]] |
| P5 | `0355` — ⛔ **Cancelled** — clean the in-scope broken-link red set | [[tasks/clean-the-in-scope-broken-link-red-set]] |
| P6 | `0237` — clean the coordination-citation residual set | [[tasks/clean-the-coordination-citation-residual-set-that-blocks-0176]] |
| P7 | `0176` — build the coordination-citation policy guard | [[tasks/build-the-coordination-citation-policy-guard]] |
| P8 | `0356` — Sweep A, the citation-rot class | [[tasks/sweep-a-the-citation-rot-class-one-verified-pass]] |
| P9 | `0357` — Sweep B, the single-site correction notes | [[tasks/sweep-b-the-single-site-correction-notes]] |
| P10 | `0358` — Sweep C, the wiki-vault pass | [[tasks/sweep-c-the-wiki-vault-resyncs-as-one-pass]] |
| P11 | `0359` — the throughput counter | [[tasks/the-throughput-counter-created-vs-closed-per-iso-week]] |
| P12 | `0360` — cut v0.3.0, then hand-archive this board | [[tasks/cut-the-v0-3-0-release-and-hand-archive-sprint-7]] |
| P13 | `0361` — settle whether a sprint board may be committed unranked | [[tasks/settle-whether-a-sprint-board-may-be-committed-unranked]] |
| P14 | `0369` — amend the review-ledger Location column | *(closed and ingested before this board's archival)* |
| P15 | `0379` — start the lead session, not the producer, after a cold start | [[tasks/start-the-lead-session-not-the-producer-after-a-fresh-projects-cold-start]] |

⭐ **The gap at `P5` is deliberate** — the cancelled row's rank was not reassigned.
⚠️ **Rank order is not run order on this board**: `P13`, `P14` and `P15` were appended after `P12` and
all three ran before it; the binding order lived in `Depends on` / `Blocks`.

## Outcome

### ⛔ THE SUCCESS CRITERION WAS MISSED

**Target, ruled 2026-08-29 (*"Cap record repair, not process work (Rec)"*): record-repair rows under
10% of open work. Measured at the v0.3.0 release commit, 2026-09-08: 20.5%.** ⛔ **Missed by any
reading — not adjusted, not rounded, not reframed.**

| Reading | Baseline 2026-08-29, as ruled — **hand-classified** | Measured 2026-09-08 — **script** | Target |
|---|---|---|---|
| Record repair, all of it | 45 of 129 = **34.9%** | **23 of 112 = 20.5%** | under 10% |
| Excluding source-defect repairs (`0215`, `0234`, `0334`) | 42 of 129 = **32.6%** | **20 of 112 = 17.9%** | under 10% |

- ⛔ **Neither baseline cell is what the script reproduces.** Both are the **hand** classification made
  on 2026-08-29, and the criterion was ruled against the hand figure **42 / 129 = 32.6%**. Re-measured
  2026-09-08, `throughput.mjs --at a9c2709` prints **repair 46 / 129 = 35.7%** and
  **repair-excluding-source-defects 43 / 129 = 33.3%**. ⭐ The 46-vs-45 gap is an **owner-ruled accepted
  residual** of `0359` (*"The counter's 9-verb figures (Rec)"*) — recorded, not reopened.
- ⭐ **Like-for-like, script classification at both ends:** excluding source-defect repairs,
  **33.3% → 17.9%**; all-in, **35.7% → 20.5%**. ⛔ **Every pairing misses; the smallest defensible
  figure is 17.9%.**
- ⚠️ **The baseline's denominator was already stale on the day it was set, and the board said so** —
  138 open folders on disk 2026-08-29, not 129, giving **42 / 138 = 30.4%**. ⛔ Neither figure is
  retro-fitted; the measurement is reported on its own measured denominator of **112**.
- ⭐ **The direction is real even though the criterion was missed.** Open work fell **129 → 112**, and
  the repair share fell by more than two-fifths on both like-for-like readings (a **42.6%** and a
  **46.2%** relative fall). ⛔ **That is progress, not a pass.**

### ⭐ The first two weeks on record where closes exceed creations

**2026-W36: 14 created / 20 closed. 2026-W37: 7 created / 28 closed.** ⭐ **Every prior week on record
created more than it closed** (W28 27/22 through W35 38/15). Measured by `0359`'s counter at the
release commit.

### The archival — ruled, and still not verified

⭐ **UNLIKE SPRINT 6'S ARCHIVAL, THIS ONE CARRIES AN OWNER RULING — and it is STILL not owner-verified.
Both halves are true and neither cancels the other.**

- ⭐ **The ruling exists** — given live via `AskUserQuestion` in a `fkit lead` session on 2026-08-29,
  option label verbatim **"Hand-archive again, with the caveat (Rec)"**. Sprint 6's banner records that
  its own archival carried **no** such ruling; ⛔ that sentence is **false here and was not copied**.
- ⛔ **The verification does not.** Every step was **agent-performed and not owner-verified** — the
  sprint-level counterpart of ADR-033 §5's task marker.

⚠️ **THE ROW THAT PERFORMED THE ARCHIVAL FLIPPED ITS OWN STATUS TO DO IT.** `0360` (`P12`) stood
`🔄 In progress` on the very board it archives, and a board with an open row may not be archived. By
owner ruling of 2026-09-08 (**"Flip the row by hand before the move (Rec)"**) its row was flipped by
hand **before** the move — ⛔ not by a mover, and not after the fact. ⛔ **Disclosed because the row
closed itself: nothing independent verified `0360`'s own work was complete when it said so.**

⛔ **This archival changed no row's status except `0360`'s disclosed self-flip, changed no rank, and
renumbered nothing** ([[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]]).

### ⚠️ No successor clause — and the omission establishes NO convention

**There is no Sprint 8**, so naming a successor would ship a dangling link. ⭐ Unlike Sprint 6's
omission — a producer judgement taken without a ruling — **this one IS ruled** (2026-09-08, option
label verbatim **"Omit, and state the omission (Rec)"**). ⛔ **The omission establishes no convention:**
Sprints 1–4 each named a successor; Sprints 5, 6 and 7 did not, each for its own recorded reason.
`select-active` now returns `active none` and **the project has no active sprint.**

### The link repair the archival performed

Moving the file one level down invalidates every relative href it carries and every inbound href to
it. ⛔ **Doing that wrong would manufacture a fresh broken-link set in the sprint that built the guard
against them.** Repaired by an explicit script over link **targets only** — ⛔ never a blind text
`sed`, because the string `sprint-7.md` appears throughout the file's prose and code spans.

⭐ **One counting rule applied to both directions: an instance inside an inline code span is quoted
literal text, not a pointer a reader can follow.**

- **Outbound:** the board carried **91 instances = 89 followable pointers + 2 inline-code literals**;
  75 × `](../…)` → `](../../…)`, 13 × `](backlog.md)` → `](../backlog.md)`, 1 × `](done/sprint-6.md)`
  → `](sprint-6.md)`. ⛔ The 2 × `](sprint-7.md)` instances were left byte-identical because they are
  **not self-links**. With the banner's own 5 and the `## Notes` addendum's 3, the archived file carries
  **99 instances = 97 followable pointers + the same 2 literals**.
- **Inbound: 36 real link instances across 14 files**, re-pointed by owner ruling **"Repair all 36
  (Rec)"** — 7 in `backlog.md`, **23** inside closed and cancelled task folders, 6 in `0360`'s own
  still-open folder. ⛔ An earlier draft said *"29 inside closed and cancelled task folders"*; measured,
  it is **23**.
- ⭐ **Href-only in twelve of the fourteen — and not in two.** `0176`'s and `0237`'s briefs each took
  their 2 href repairs **plus a seven-line dated 2026-09-08 annotation**, by owner ruling
  **"Annotate, don't rewrite (Rec)"**.

### `v0.3.0` — the measurement anchor

**Cut with an ANNOTATED tag** naming Sprint 7 and its measurement-anchor purpose, so `0359`'s counter
has a dated point in history to measure from. ⛔ **`VERSION` and `package.json` read `0.3.0`; the
release is committed and tagged LOCALLY and was never pushed — the push is the owner's.**

⚠️ **Two consequences of the order, accepted by owner ruling** (2026-09-08, **"Keep the brief's order
(Rec)"** — release first, then archive):

1. ⛔ **The tag `v0.3.0` does NOT contain this archive.** It sits one commit before the sprint's
   closing commit. ⛔ Anyone reading `v0.3.0` as *"the tree at the moment Sprint 7 closed"* is wrong.
2. ⛔ **The archive was left uncommitted for the owner** — proving the archive separately from the
   release gate is the honest split.

## Related
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — the predecessor board, archived without an
  owner ruling; Sprint 7's banner says so explicitly and refuses to copy the sentence
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the Backlog board, which carried the
  rows Sprint 7 pulled and now carries its follow-ups
- [[decisions/adr-045-an-in-flight-review-finding-terminates-in-the-ledger-not-a-new-task]] ·
  [[decisions/adr-046-a-sprint-board-may-be-committed-unranked-and-an-erased-rank-flags]] — the two ADRs
  this board produced
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — why every close here is the
  producer's act and carries the agent-closed marker
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — the rank rules
  the archival honoured
- [[systems/testing-and-verification]] — where the two guards this board built now live
