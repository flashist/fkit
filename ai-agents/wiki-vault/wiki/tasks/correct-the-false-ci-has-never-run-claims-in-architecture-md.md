# Correct the false *"the CI half has never actually run"* claims in `architecture.md`

**Source**: `ai-agents/tasks/done/0312-correct-the-false-ci-has-never-run-claims-in-architecture-md/brief.md`
**Status**: done — ✅ **Done (agent-closed — not owner-verified)**, closed 2026-09-04 inside Sweep B (`0357`)
**Sprint/Tag**: Backlog · `Unscheduled` · `0312` · owner `fkit-coder`

## Goal

⭐ **The project's own architecture document told every reader — human or agent — that fkit's CI had
never executed, while 16 runs sat in the repo's Actions history and a closed task (`0283`) existed
*because* one of them went red.**

⛔ **A false claim in `architecture.md` propagates by design:** it is the document the architect's own
survey writes and the one `CLAUDE.md` points every role at for anything *"below product-brief
altitude"*.

## Key Changes

**Owner ruling 2026-08-15**, given live via `AskUserQuestion` and relayed through a
`/fkit-sprint-ship-loop` driver session — **the option label is the verbatim text:
*"File architecture.md:33-35 (Recommended)"***.

### The two occurrences, and the clause-by-clause verdict

| Passage | Clause | Verdict at filing |
|---|---|---|
| **A** — the overview paragraph | *"The CI half has never actually run"* | ⛔ **FALSE.** 16 runs |
| A | *"the workflow is verified by review, not by a run"* | ⛔ **FALSE** |
| A | *"The release gate has been watched refusing a red tree"* | ✅ **True and unaffected. Keep it** |
| **B** — the §9.1 bullet | *"Neither has been observed green on a runner yet"* | ⛔ **FALSE.** 15 green |
| B | *"it lands unpushed"* | ⛔ **FALSE.** Every run is a `push` event on `main` |
| B | *"The suite has only ever run on darwin"* | ⛔ **FALSE.** 16 `ubuntu-latest` runs |
| B | the dash divergence, stated as a **live** risk | ⚠️ **Now history — and the prediction did not come true in that form** |
| B | *"a portability repair is a separate brief"* | ⚠️ **Spent.** The repair happened — `0283` |

### ⛔ The trap the brief guarded, and it is the inverse of the defect

**The one red run was a filesystem CASE-SENSITIVITY divergence** in `test/orphan-cleanup.test.js`
(macOS case-insensitive, the runner not), repaired by `0283`. ⛔ ***"Do not write that the predicted
dash risk materialized."*** It did not. ⭐ **The dash risk was discharged a different way — by 15 green
runs on `ubuntu-latest`, where `/bin/sh` IS dash.** ⚠️ **Getting this backwards is named in the brief
as a defect of the task itself** — it would replace one false claim with another.

### ⛔ The constraint that shaped everything downstream: re-derive, never copy

***"Do not copy this brief's table — it is dated 2026-08-15 and the count only grows. State the figures
WITH their measurement date, so the replacement text cannot rot into the defect it replaces."*** ⭐ **That
is the `0301` dated-claim convention applied to the very text being repaired**, and it is why every CI
figure in `architecture.md` today carries a date.

⛔ **And the symmetrical warning:** *"Do not overstate in the other direction. **A correction that
overstates is a worse defect than the stale claim it replaces** — that is precisely how the corrected
text became stale the first time."*

### ⚠️ It reported two conflicts it was forbidden to fix

**Neither was this row's to settle, and both are recorded rather than repaired** — a task does not edit
another task's brief:

1. ⛔ **`0281` was open and its brief MANDATED writing the false claim into ADR-003.** It carried a
   section headed *"⚠️ CI HAS NEVER EXECUTED — nothing this task writes may say otherwise"* and required
   as element 3 of four that *"**The CI half has never run.** Stated, not softened"*. ⛔ **Implemented as
   written, `0281` would have written a FRESH false claim into a decision record.** ⚠️ The brief calls
   this *"the most urgent consequence of this finding"*.
2. ⛔ **`0251` was open and instructed preserving occurrence B byte-identical** — *"Do not soften,
   shorten, or delete that caveat, and never write that CI is working."* **Directly contradictory.**
   *"Whichever runs second must not restore what the other removed."*

## Outcome

### ⛔⛔ THE SCOPE EXTENSION WAS DECLINED — and that is the origin of the §9.1 gap

⭐ **This is the fact the rest of the vault refers to without explaining, and it is recorded here.**

`0312`'s filing producer **extended the owner's ruling on its own judgement.** The ruling named the
**overview passage** — occurrence **A**. Occurrence **B** was found by the re-measurement at filing and
folded in, **with the extension disclosed in the brief precisely so the owner could reverse it in one
edit**:

> *"⚠️ If the owner intended the narrower scope, narrow this row to A — the extension is stated so it
> can be reversed in one edit."*

⛔ **The owner did narrow it, to A.** ⭐ **So `0312`'s close is CORRECT and was never in question: its
owner-ruled scope was occurrence A, and occurrence A landed and is proved.** ⛔ **But its own
`## What to build` item 2 — *"Rewrite occurrence B so that all four falsified clauses go"* — was left
UNREPEALED AND UNDONE**, and closing the row retired the only carrier for four false clauses.

⭐ **The disclosure worked exactly as designed. The gap it left is not a failure of the disclosure —
it is the visible cost of a narrowing that nothing downstream inherited.**

### The chain that inherited the gap, and how it finally closed

| Row | Fate |
|---|---|
| `0376` | filed 2026-09-04 on **owner ruling N1** (*"Close Done + producer files B in the same act (Rec)"*) **to be occurrence B's home** — ⛔ **cancelled 2026-09-13**, consolidated |
| `0251` | ⛔ **cancelled 2026-09-13**, consolidated |
| `0366` | ⛔ **cancelled 2026-09-13**, consolidated |
| `0392` | ✅ **Shipped in Sprint 9** — Group B closed occurrence B at last |

⭐ **The ruling's stated reason for requiring `0376` names the hazard exactly:** closing `0312` without
it would *"quietly retire the only carrier for four false clauses"* — in the document `CLAUDE.md` points
every role at.

⚠️ **The file contradicted itself for nine days.** Occurrence A carried the corrected position while
§9.1, forty lines below, still said neither half had been observed green. ⛔ ***"A reader of §9 alone
gets the false answer."***

### ✅ Verified on disk 2026-09-16 by the `b4a1a52`→`a351cb6` sync

- ⛔ **All four of occurrence B's falsified clauses are gone.** §9.1's CI bullet now reads *"CI has been
  exercised on a runner. Measured **2026-09-14** … **43 runs on `ubuntu-latest`, 39 green and 4 red**"*,
  with ⚠️ *"Those are counts on a date, not a standing guarantee."*
- ✅ **The release-gate sentence survived in occurrence A**, as the brief required.
- ✅ **The red first run is described as a case-sensitivity divergence and names `0283`** — in **both**
  §1 and §9.1. **The inverse-defect trap was not fallen into at either site.**

### ⭐ Root cause — shared with `0281` and `0376`, and it is not carelessness

[[tasks/gate-releases-so-an-untested-tree-cannot-ship]] (`0256`) landed CI and the in-release gate on
2026-08-12, **correctly writing a *"has not run yet"* caveat that was TRUE that day** — and it was
never revisited once runs started **the next day**. ⭐ **The defect was created by an accurate sentence
ageing by one day**, which is the whole case for the dated-claim convention.

⚠️ **Adjacent, deliberately NOT filed:** ADR-026's two present-tense *"no `.github/workflows/`"* claims.
⛔ **The owner considered them in the same 2026-08-15 question and did not select them.** They stay
reported-only. Recorded so the next reader knows they were seen, not missed.

## Related
- [[tasks/architecture-md-prose-repair-9-1-inventory-occurrence-b-and-9-5]] — `0392`, which finally closed occurrence B as its Group B, nine days later
- [[tasks/sweep-b-the-single-site-correction-notes]] — `0357`, the sweep this row closed inside
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — `0256`, whose true-on-the-day caveat is the shared root cause
- [[tasks/make-the-lockdown-guard-case-test-filesystem-independent]] — `0283`, the repair for the one red run, which must never be described as the predicted dash failure
- [[tasks/sprint-9-settle-architecture-mds-truth-and-sweep-the-citation-rot]] — the board that discharged the whole chain
- [[systems/testing-and-verification]] — the CI and suite claims this row corrected
- [[decisions/adr-003-ci-runs-validate-bundles]] — the ADR `0281` corrected in the same cluster, and which `0312`'s brief flagged was about to receive a fresh false claim
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — why the row's own vault grep could report but never write
