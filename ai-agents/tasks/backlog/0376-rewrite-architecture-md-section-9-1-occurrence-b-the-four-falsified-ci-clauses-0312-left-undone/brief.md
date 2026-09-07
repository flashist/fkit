# Rewrite `architecture.md` §9.1 occurrence B — the four falsified CI clauses `0312` left undone

## ID
0376

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Authority

**Owner ruling N1, 2026-09-04**, given live via `AskUserQuestion` in the `fkit lead` session driving
`/fkit-sprint-ship-loop` and relayed to the closing producer — **the option label is the verbatim
text**: **"Close Done + producer files B in the same act (Rec)"**.

The ruling's stated reason for requiring this row: closing
[`0312`](../../done/0312-correct-the-false-ci-has-never-run-claims-in-architecture-md/brief.md)
without it would *"quietly retire the only carrier for four false clauses"* — in the document
`CLAUDE.md` points every role at for anything below product-brief altitude.

### Why this row exists — the half-done predecessor

`0312` was closed **`✅ Done (agent-closed — not owner-verified)`** on 2026-09-04 as a member of Sweep B
([`0357`](../../done/0357-sweep-b-the-single-site-correction-notes/brief.md)). ⭐ **Its close is correct and is
not in question:** its owner-ruled scope was **occurrence A** — the overview paragraph — and occurrence
A landed and is proved.

⛔ **But `0312`'s `## What to build` item 2 is unrepealed and undone.** It reads, verbatim:

> 2. **Rewrite occurrence B** so that all four falsified clauses go: *never observed green*, *lands
>    unpushed*, *only ever run on darwin*, and the dash risk stated as a **live** risk.

⚠️ Occurrence B was a **scope extension** `0312`'s filing producer made on its own judgement, disclosed
in `0312` so the owner could narrow it in one edit. **The owner did narrow it** — to A. That narrowing
is why `0312` closes `Done`, and it is also why the work below still has no home. **This row is that
home.**

### What is on disk — read first-hand by the filing producer, 2026-09-04

`ai-agents/knowledge-base/architecture.md` §9.1 (*"The suite now runs automatically — CI plus an
in-release gate; `install.sh` is still uncovered"*), the third bullet, verbatim:

> - **Neither has been observed green on a runner yet.** The workflow is verified by review, not by a
>   run — it lands unpushed. **The suite has only ever run on darwin**; on `ubuntu-latest` `/bin/sh` is
>   dash, and a first run could go red on a genuine dash divergence in the shell under test. That risk
>   was accepted knowingly when CI was approved; a portability repair is a separate brief, not a reason
>   to distrust the workflow.

⚠️ **Citations here are `file` + quoted phrase, never `:NNN`.** `architecture.md`'s line anchors are
already known-stale — that is
[`0286`](../0286-mechanical-citation-sweep-of-architecture-md/brief.md)'s whole subject. The line
numbers below are a **dated convenience measured 2026-09-04**, not the anchor: the quoted text is.

**Clause-by-clause, all four still present (measured whitespace-normalised, 2026-09-04):**

| # | Clause (durable anchor) | Line, 2026-09-04 | Verdict |
|---|---|---|---|
| 1 | *"Neither has been observed green on a runner yet"* | 530 | ⛔ **FALSE** |
| 2 | *"it lands unpushed"* | 531 | ⛔ **FALSE** |
| 3 | *"The suite has only ever run on darwin"* | 531 | ⛔ **FALSE** |
| 4 | the dash divergence stated as a **live** forward risk (*"a first run could go red on a genuine dash divergence"*, *"That risk was accepted knowingly"*, *"a portability repair is a separate brief"*) | 532–534 | ⚠️ **SPENT AND MIS-STATED** — it is history, and the first red run was **not** a dash divergence |

⭐ **The file contradicts itself today.** Occurrence A, forty lines above, already carries the corrected
position (*"**Both halves have now been exercised**"*, with dated figures). §9.1 still says neither has
been observed green. **A reader of §9 alone gets the false answer.**

### ⚠️ The A→B cross-reference — found firsthand at filing, and the trap in this row

Occurrence A's corrected text **cites occurrence B's prediction** in order to distinguish what actually
happened from what was predicted. It reads, verbatim:

> ⛔ **it was not the dash divergence §9.1 predicted.**

⛔ **A rewrite of B that simply deletes the dash prediction leaves A pointing at a prediction §9.1 no
longer makes.** That is a fresh defect of exactly this row's own class — a dangling citation to text
that no longer exists.

**Either resolve it or state the resolution.** Two workable shapes, and the choice belongs to the
implementer's plan gate, not to this brief:
- keep the dash prediction in B **as recorded history** (*"the risk §9.1 recorded when CI was
  approved"*), so A's reference still lands; or
- rewrite both sides of the reference in the same act, so A no longer cites a §9.1 prediction.

⛔ **What is NOT acceptable: rewriting B and leaving A's sentence untouched and dangling.** ⚠️ Note this
means the change may legitimately touch occurrence A's one sentence — see the constraints, which permit
it narrowly and forbid anything wider.

### ⚠️ CONFLICT — `0251` is open, and its pointer at `0312` goes stale with this close

[`0251`](../0251-refresh-architecture-md-section-9-test-suite-inventory/brief.md) *"Refresh
`architecture.md` §9.1's test-suite inventory"* **edits this same section** and is **open**. Three
layers, and they must not be conflated:

1. ⛔ **`0251`'s ORIGINAL 2026-08-12 block instructs preserving this bullet byte-identical** — *"⚠️ the
   **'Neither has been observed green on a runner yet'** bullet — **CI has never run** … **Do not
   soften, shorten, or delete that caveat, and never write that CI is working.**"* **Implemented as
   written, `0251` would restore the very clauses this row removes.**
2. ✅ **That instruction is ALREADY REPEALED inside `0251` itself.** `0251` carries a later dated
   correction block that says, verbatim: *"⛔ **Do NOT preserve, restore, or re-word the 'Neither has
   been observed green on a runner yet' caveat, and ⛔ do not obey 'never write that CI is working.'**
   Both instructions now command a falsehood."* ⭐ **So the conflict is dead as a live hazard** — but
   only for a reader who reaches the correction block, which sits ~70 lines below the instruction it
   repeals.
3. ⛔ **What this close breaks:** that same correction block names the repairer — *"`0312` … **owns the
   repair of that exact §9.1 bullet**"* — and recommends *"**Recommended order: run `0312` first**"*.
   ⚠️ **`0312` is now closed `Done` and will never do it.** `0251`'s pointer now aims at a closed row,
   and **this row is the true owner of that bullet.**

⛔ **Repairing `0251`'s pointer is NOT this row's job** — a task does not edit another task's brief, the
same constraint `0312` carried. ⚠️ **It is an open question for the owner**, recorded in `## Notes`.
**If `0251` runs before this row:** obey its own correction block — leave the bullet untouched, do not
treat it as true, do not echo its claim elsewhere in §9, and say in the close that it was knowingly
left standing and false, now pending **this** row rather than `0312`.

## What to build

Prose corrections to **one file**: `ai-agents/knowledge-base/architecture.md`.

1. **Rewrite §9.1's occurrence-B bullet so all four falsified clauses go** — *never observed green*,
   *lands unpushed*, *only ever run on darwin*, and the dash risk stated as a **live** risk.
2. **Re-derive the run figures at implementation time.** ⛔ **Do not copy any figure from this brief or
   from occurrence A** — both are dated and the count only grows. State the figures **with their
   measurement date** (the convention
   [`0301`](../0301-record-that-a-dated-claim-is-correct-as-of-its-date-and-does-not-become-a-defect-by-ageing/brief.md)
   records), so the replacement cannot rot into the defect it replaces.
3. **Record the red first run honestly** — a **filesystem case-sensitivity** divergence in
   `test/orphan-cleanup.test.js`, repaired by
   [`0283`](../../done/0283-make-the-lockdown-guard-case-test-filesystem-independent/brief.md). ⛔ **Do
   not describe it as the predicted dash failure.** ⚠️ **Getting this backwards is a defect of this
   task** — it replaces one false claim with another.
4. **Resolve the A→B cross-reference** (see the section above) so no sentence cites a §9.1 prediction
   that no longer exists. State which of the two shapes you took and why.
5. **Keep §9.1's surviving thesis intact.** The section's live point is **coverage, not automation**:
   `install.sh` is verified by nothing, and CI running does not close that gap. ⛔ The *"residual risk
   narrowed but did not close"* paragraph and the `install.sh` bullet are **not** falsified — leave
   their substance alone.

### Constraints

- ⛔ **One file.** `git diff --stat` must list exactly `ai-agents/knowledge-base/architecture.md`.
- ⚠️ **The A-sentence exception, narrowly:** item 4 may edit occurrence A's *"it was not the dash
  divergence §9.1 predicted"* sentence **only** to keep the cross-reference honest. ⛔ Nothing else in
  occurrence A may change — its dated figures, its release-gate sentence and its *"counts on a date,
  not a standing guarantee"* caveat all stand.
- ⛔ **Do not overstate in the other direction.** *"CI is green"* is a dated measurement, not a
  permanent property. **A correction that overstates is a worse defect than the stale claim it
  replaces** — that is precisely how this text became stale the first time, and ⭐ **round 2 of Sweep
  B's own review caught exactly this failure twice**, in correction notes the sweep had already shipped.
- ⛔ **Do not edit `0251`'s, `0312`'s, or any other task's `brief.md`** — report the conflict, do not
  resolve it.
- ⛔ **Do not sweep ADR-026's two present-tense *"no `.github/workflows/`"* claims.** The owner
  considered them in the 2026-08-15 question and did not select them; they stay reported-only.
- ⛔ **Do not fix `:NNN` citations while in the file** — that is
  [`0286`](../0286-mechanical-citation-sweep-of-architecture-md/brief.md). Correct the prose only.
- ⛔ **No `ai-agents/wiki-vault/` write**
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  ⚠️ `0312`'s exact-phrase vault grep at its filing found **no** copy of this passage. **Re-check at
  implementation time; if one has appeared, report it** — do not write it. ⭐ A vault re-ingest covering
  Sweep B's annotated ADRs is already folded into **Sweep C**.
- ⛔ No task-file move ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
  no re-rank, no board-row edit beyond this task's own close.
- ⛔ No commit. ⛔ No source-code change — this is documentation.

## Verification steps

1. **The falsification is re-measured by the implementer, not inherited from this brief.** Paste the
   output of `gh run list --limit 100` (or its JSON form) showing the run count, the conclusions, and
   the date of the most recent run.
2. **All four clauses are gone.** Show that
   `grep -n "observed green on a runner\|lands unpushed\|only ever run on darwin" ai-agents/knowledge-base/architecture.md`
   returns **nothing**, and quote what replaced the dash-risk sentences.
3. **Quote the replacement bullet in full.** A reviewer must be able to check every clause without
   opening the file.
4. **Every figure in the new text carries its measurement date.** Show the dates.
5. **The red first run is described as a case-sensitivity divergence, not a dash divergence**, and
   `0283` is named. Show the sentence.
6. **The A→B cross-reference resolves.** Show occurrence A's sentence as it now stands and show that
   whatever it cites exists in §9.1. ⛔ A dangling *"§9.1 predicted"* is a failure of this task.
7. **§9.1 no longer contradicts occurrence A.** Quote both and show they agree.
8. **`git diff --stat` lists exactly one path.** ⛔ Every task `brief.md`, `adr-003-*.md`, ADR-026 and
   `ai-agents/wiki-vault/` must be untouched — show it.
9. **Full `npm test` green; state the measured counts.** ⚠️ **Expect this to prove NOTHING about the
   wording** — no test reads `architecture.md`'s prose. ⭐ **Say so explicitly** rather than implying
   coverage. The `reference-integrity` guard checks that links resolve, not that sentences are true.
10. **The `0251` conflict is restated in the close as still-open**, together with the fact that
    `0251`'s correction block still names `0312` — a closed row — as the repairer of this bullet.

## Notes

- **Depends on:** nothing. ⚠️ **Not blocked by `0251`** — either order is safe *provided* the second one
  to run re-reads §9.1 rather than applying its brief verbatim. **Recommended order: this row first**,
  so `0251` re-derives its inventory against a §9.1 whose CI framing is already true (that is exactly
  what `0251`'s own correction block recommends, with `0312` in this row's place).
- **Blocks:** nothing.
- **Provenance:** filed **2026-09-04** by a **spawned `fkit-producer` with no owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
  in the same act as Sweep B's eighteen closes, on **owner ruling N1** of the same day relayed through
  the driving session. ⚠️ **This row APPENDS and renumbers nothing, and was deliberately NOT added to a
  sprint** ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- **Root cause, same as `0281`'s and `0312`'s:**
  [`0256`](../../done/0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md) landed CI and the
  in-release gate on 2026-08-12, correctly writing a *"has not run yet"* caveat **that was true that
  day**, and it was never revisited once runs started the next day. §9.1 is the last carrier.
- **⭐ OPEN QUESTION FOR THE OWNER — not settled here.** `0251`'s dated correction block names `0312`
  as the owner of this bullet's repair and recommends running `0312` first. `0312` is now closed and
  this row inherits that ownership, so **`0251` carries a pointer at a closed row that will never do the
  work**. Re-pointing it means editing an open task's brief, which no task may do to another — so it
  needs either an owner ruling or its own row. ⛔ **Deliberately left unresolved rather than decided by a
  spawned agent.**

---

## ⭐ AMENDMENT — appended 2026-09-05, recording owner ruling **N5** of 2026-09-04

**Owner ruling N5, 2026-09-04**, given live via `AskUserQuestion` in the `fkit lead` session driving
`/fkit-sprint-ship-loop` and relayed to the filing producer — **the option label is the verbatim text**:
**"Fold into 0376's scope (Rec)."**

⛔ **Everything above this line is left byte-identical.** The four-clause core in `## What to build`
items 1–5 is **unchanged and un-rescoped**; this amendment only **adds** to it.

### What N5 settles

The `## Notes` **OPEN QUESTION** — *"`0251` carries a pointer at a closed row that will never do the
work"* — **is now ruled.** ⭐ Its original text is deliberately **left byte-identical above** as the
record of what was genuinely open at filing; read it as **answered by this section**, not as still open.

### ⛔ Why this row has the authority at all — state it, do not assume it

**No task may edit another task's brief unilaterally.** That constraint is real, it is why the filing
producer declined to settle this, and it is **not** waived in general. ⭐ **`0376`'s authority to touch
`0251` rests on owner ruling N5, named and dated — and on nothing else.** A future reader must not
generalise this into a licence for one brief to edit another.

### 6. Re-point `0251`'s dated correction block — added to `## What to build`

Re-point the pointer in
[`0251`](../0251-refresh-architecture-md-section-9-test-suite-inventory/brief.md)'s dated correction
block that names **`0312`** as the repairer of §9.1's occurrence-B bullet, so it names **this row**
instead.

**The owner's stated reasoning, which belongs in the brief:** `0376` **already owns the §9.1
occurrence-B work that `0251`'s block is waiting on**, so it is the natural repairer — and the dangling
pointer then **dies with the work it names**, rather than needing a row whose entire deliverable is one
pointer fix that would still wait on `0376` anyway.

**The three-layer history — carried here so whoever runs this row does not re-derive it:**

| Layer | What `0251` says | Standing today |
|---|---|---|
| 1 — original, 2026-08-12 | *"**Do not soften, shorten, or delete that caveat, and never write that CI is working.**"* — orders the occurrence-B bullet preserved **byte-identical** | ⛔ **Repealed** — by layer 2, inside `0251` itself |
| 2 — `0251`'s own dated correction block | *"⛔ **Do NOT preserve, restore, or re-word the 'Neither has been observed green on a runner yet' caveat, and ⛔ do not obey 'never write that CI is working.'** Both instructions now command a falsehood."* | ✅ **Binding.** This is why layer 1 is not a live hazard |
| 3 — the same block's pointer | *"`0312` … **owns the repair of that exact §9.1 bullet**"*, and *"**Recommended order: run `0312` first**"* | ⛔ **STALE — this is what item 6 repairs.** `0312` closed `✅ Done (agent-closed — not owner-verified)` 2026-09-04 with occurrence B undone |

⛔ **Repair layer 3 only.** Layers 1 and 2 are `0251`'s own record of how its instruction changed — they
are **history, and they stay byte-identical**. ⛔ Do not "tidy" the repealed layer-1 text away.

### Constraints on item 6 — additional to `### Constraints` above

- ⛔ **The one-file constraint above now reads: two files** — `ai-agents/knowledge-base/architecture.md`
  **and** `0251`'s `brief.md`, and **nothing else**. `git diff --stat` must list exactly those two.
  ⛔ The blanket *"Do not edit `0251`'s … `brief.md`"* in `### Constraints` is **superseded by N5 for
  `0251` alone** — it still binds for `0312`'s and every other task's brief.
- ⛔ **Pointer only.** Change who the block names and the recommended-order sentence. ⛔ Do **not**
  restate, re-litigate or "improve" `0251`'s CI findings, its inventory items 1–2, or its still-open
  decision (b) on whether §9.1 should keep enumerating suite names by hand.
- ⛔ **Do not change `0251`'s `## Status`, its board row, its rank, or its position.** `0251` stays
  **open** — item 6 repairs a pointer inside it, nothing more.
- ⭐ **Prefer an appended dated note over an in-place rewrite** where the block's original wording is
  itself evidence of the drift, consistent with how `0251` already records layers 1 and 2.
- ⛔ `0376` stays **UNRANKED** on the Backlog board. Nothing re-ranked
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).

### Verification — additional, and one supersession

- ⛔ **`## Verification steps` step 10 is SUPERSEDED by this amendment.** It required the `0251` conflict
  be *"restated in the close as still-open"*. Under N5 the pointer is **repaired, not restated**.
  **Replace it with steps 11–13 below.**
- 11. **Quote `0251`'s block before and after.** Show that it now names `0376` and no longer recommends
  running `0312` first.
- 12. **Show layers 1 and 2 are byte-identical** after the edit — `git diff` on `0251`'s brief must touch
  the layer-3 pointer only.
- 13. **Show `0251` is still open** — its `## Status` and its board row unchanged, its folder still under
  `ai-agents/tasks/backlog/`.
