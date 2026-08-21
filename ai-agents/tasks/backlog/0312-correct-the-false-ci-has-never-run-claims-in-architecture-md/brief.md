# Correct the false *"the CI half has never actually run"* claims in `architecture.md`

## ID
0312

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

**Owner ruling 2026-08-15**, given live via `AskUserQuestion` and relayed through the
`/fkit-sprint-ship-loop` driver session — **the option label is the verbatim text**:
**"File architecture.md:33-35 (Recommended)"**.

Surfaced during [`0280`](../../done/0280-rewrite-the-false-no-ci-paragraph-and-fabricated-citation-in-fkit-wiki-lint/brief.md)'s
planning pass. Sibling of [`0281`](../0281-correct-adr-003s-still-unmet-automated-verification-claim/brief.md),
which corrects the same falsified posture in ADR-003.

⚠️ **Citations in this brief are `file` + quoted phrase, never `:NNN`.** The planning worker
specifically found `architecture.md`'s line anchors already stale, which is
[`0286`](../0286-mechanical-citation-sweep-of-architecture-md/brief.md)'s whole subject. Anchor on the
quoted text.

### What is on disk — read first-hand at filing, 2026-08-15

Two passages in `ai-agents/knowledge-base/architecture.md` carry the same false claim.

**Occurrence A — the overview paragraph** (in the opening "what this project is" section, in the
sentence beginning *"There **is** a zero-dependency test suite"*), verbatim:

> ⚠️ **The CI half has never actually run**: the workflow is verified by review, not by a run. The
> release gate *has* been watched refusing a red tree.

**Occurrence B — the §9.1 bullet**, verbatim:

> - **Neither has been observed green on a runner yet.** The workflow is verified by review, not by a
>   run — it lands unpushed. **The suite has only ever run on darwin**; on `ubuntu-latest` `/bin/sh` is
>   dash, and a first run could go red on a genuine dash divergence in the shell under test. That risk
>   was accepted knowingly when CI was approved; a portability repair is a separate brief, not a reason
>   to distrust the workflow.

### The measurement that falsifies them — re-measured at filing, 2026-08-15

`gh run list` over the full history returns **16 runs**, all `push` events on `main`, all
`runs-on: ubuntu-latest` (`.github/workflows/test.yml`):

| Date | Conclusion | Note |
|---|---|---|
| 2026-08-12 | ⛔ **failure** (run `31634593615`) | the first run — went red |
| 2026-08-13 → 2026-08-15 | ✅ **success** ×15 | 15 consecutive green, most recent **2026-08-15** |

**Totals: 16 runs, 1 failure, 15 success.** Durations on the recent five: 2m59s–4m22s.

**What the one red run actually was — and the trap in it.** Run `31634593615` failed on
`test/orphan-cleanup.test.js`, the test *"the never-delete-lockdown-state guard is case-insensitive"*,
with `AssertionError … did not match /lockdown state/`. That is a **filesystem case-sensitivity**
divergence (macOS case-insensitive vs the runner's case-sensitive filesystem) — it is **not** the dash
divergence occurrence B predicts. It was repaired by
[`0283`](../../done/0283-make-the-lockdown-guard-case-test-filesystem-independent/brief.md), which is
**closed**. ⛔ **Do not write that "the predicted dash risk materialized."** It did not. The dash risk
was discharged a different way — by 15 green runs on `ubuntu-latest`, where `/bin/sh` **is** dash.

### Clause-by-clause verdict — what must change and what must not

| Passage | Clause | Verdict |
|---|---|---|
| A | *"The CI half has never actually run"* | ⛔ **FALSE.** 16 runs. |
| A | *"the workflow is verified by review, not by a run"* | ⛔ **FALSE.** |
| A | *"The release gate *has* been watched refusing a red tree"* | ✅ **True and unaffected. Keep it.** |
| B | *"Neither has been observed green on a runner yet"* | ⛔ **FALSE.** 15 green. |
| B | *"it lands unpushed"* | ⛔ **FALSE.** Every run is a `push` event on `main`. |
| B | *"The suite has only ever run on darwin"* | ⛔ **FALSE.** 16 ubuntu-latest runs. |
| B | *"on `ubuntu-latest` `/bin/sh` is dash, and a first run could go red on a genuine dash divergence"* | ⚠️ **Now history, and the prediction did not come true in that form.** The first run went red on a **case-sensitivity** divergence, not dash. Rewrite as what happened, not as a standing risk. |
| B | *"a portability repair is a separate brief, not a reason to distrust the workflow"* | ⚠️ **Spent.** The portability repair happened — `0283`. |

### ⚠️ CONFLICT — two OPEN briefs carry standing instructions this task falsifies

**Both are surfaced, neither is repaired here.** This task must not edit another task's brief.

1. ⛔ **[`0281`](../0281-correct-adr-003s-still-unmet-automated-verification-claim/brief.md) is open and
   its brief mandates writing this false claim into ADR-003.** It carries a section headed
   *"⚠️ CI HAS NEVER EXECUTED — nothing this task writes may say otherwise"*, requires as element 3 of
   four that *"**The CI half has never run.** Stated, not softened"*, and constrains
   *"⛔ **Do not edit `ai-agents/knowledge-base/architecture.md`** — it is already correct and already
   carries the never-run caveat."* **All of that is now false.** Implemented as written, `0281` would
   write a **fresh** false claim into a decision record. ⚠️ **This is the most urgent consequence of
   this finding and it is reported, not fixed by this row.**
2. ⛔ **[`0251`](../0251-refresh-architecture-md-section-9-test-suite-inventory/brief.md) is open and
   its dated-correction block instructs the implementer to preserve occurrence B byte-identical** —
   *"⚠️ the **'Neither has been observed green on a runner yet'** bullet — **CI has never run** … **Do
   not soften, shorten, or delete that caveat, and never write that CI is working.**"* That instruction
   and this task are **directly contradictory**. Whichever runs second must not restore what the other
   removed.

**Neither conflict is this task's to settle.** They need their own rows and, for `0281`, plausibly an
owner ruling. Recorded here so the next reader knows they were seen, not missed.

### ⚠️ Scope extension, disclosed

The owner's ruling named the **overview passage** (`architecture.md:33-35` as the line anchors then
stood) — i.e. occurrence **A**. **Occurrence B was found by the re-measurement at filing** and is
included on the filing producer's own judgement, because it is the **same claim in the same file**, and
repairing one while leaving the other makes `architecture.md` contradict itself. ⚠️ **If the owner
intended the narrower scope, narrow this row to A** — the extension is stated so it can be reversed in
one edit.

## What to build

Prose corrections to **one file**: `ai-agents/knowledge-base/architecture.md`.

1. **Rewrite occurrence A** so it states the measured position: the CI workflow **has** run, repeatedly,
   on `ubuntu-latest`. **Keep the release-gate sentence** — it is true and it is the sentence that
   distinguishes the two mechanisms.
2. **Rewrite occurrence B** so that all four falsified clauses go: *never observed green*, *lands
   unpushed*, *only ever run on darwin*, and the dash risk stated as a **live** risk.
3. **Re-derive the run figures at implementation time.** ⛔ **Do not copy this brief's table** — it is
   dated 2026-08-15 and the count only grows. State the figures **with their measurement date**, so the
   replacement text cannot rot into the defect it replaced (see
   [`0301`](../0301-record-that-a-dated-claim-is-correct-as-of-its-date-and-does-not-become-a-defect-by-ageing/brief.md)).
4. **Record the red first run honestly.** It is real history and it is the strongest evidence CI works —
   a runner caught a genuine defect the darwin-only suite could not. Name `0283` as the repair. ⛔ **Do
   not describe it as the predicted dash failure.**

### Constraints

- ⛔ **One file only.** `git diff --stat` must list exactly `ai-agents/knowledge-base/architecture.md`.
- ⛔ **Do not overstate in the other direction.** *"CI is green"* on a given day is a dated measurement,
  not a permanent property. **A correction that overstates is a worse defect than the stale claim it
  replaces** — that is precisely how the corrected text became stale the first time.
- ⛔ **Do not edit `0281`'s, `0251`'s, or any other task's `brief.md`.** Report the conflicts; do not
  resolve them.
- ⛔ **Do not edit `ai-agents/knowledge-base/decisions/adr-003-ci-runs-validate-bundles.md`** — that is
  `0281`.
- ⛔ **Do not sweep ADR-026.** Measured at filing, it carries two present-tense *"no `.github/workflows/`"*
  claims. **The owner considered them in the same 2026-08-15 question and did not select them.** They
  stay reported-only and unfiled. ⚠️ Widening this row into a knowledge-base-wide CI-claim audit is out
  of scope.
- ⛔ **No `ai-agents/wiki-vault/` write** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  ⚠️ **Note:** an exact-phrase grep of the vault at filing found **no** copy of either passage, so no
  resync sibling is filed. Re-check at implementation time; if one has appeared, **report it**, do not
  write it.
- ⛔ **Do not fix `:NNN` citations while in the file** — that is
  [`0286`](../0286-mechanical-citation-sweep-of-architecture-md/brief.md). Correct the prose only.
- ⛔ No task-file move ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
  no re-rank, no board-row edit beyond this task's own close.
- ⛔ No commit. ⛔ No source-code change — this is documentation.

## Verification steps

1. **The falsification is re-measured by the implementer, not inherited from this brief.** Paste the
   output of `gh run list --limit 100` (or the JSON form) showing the run count, the conclusions, and
   the date of the most recent run.
2. **Both occurrences are gone.** Run `grep -n "never actually run\|observed green on a runner\|only ever
   run on darwin\|lands unpushed" ai-agents/knowledge-base/architecture.md` and show it returns **nothing**.
3. **Quote the replacement text for A and B in full.** A reviewer must be able to check every clause
   without opening the file.
4. **The release-gate sentence survives in A.** Show it.
5. **Every figure in the new text carries its measurement date.** Show the dates.
6. **The red first run is described as a case-sensitivity divergence, not a dash divergence**, and
   `0283` is named. ⚠️ **Getting this backwards is a defect of this task** — it would replace one false
   claim with another.
7. **`git diff --stat` lists exactly one path.** ⛔ `adr-003-*.md`, ADR-026, every task `brief.md`, and
   `ai-agents/wiki-vault/` must be untouched — show it.
8. **Full `npm test` green; state the measured counts.** ⚠️ **Expect this to prove nothing about the
   wording** — no test reads `architecture.md`'s prose. **Say so explicitly** rather than implying
   coverage.
9. **The two conflicts (`0281`, `0251`) are restated in the close as still-open and still-unresolved.**
   ⚠️ Closing this row without re-flagging them is how `0281` ships a fresh false claim.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Provenance:** surfaced during
  [`0280`](../../done/0280-rewrite-the-false-no-ci-paragraph-and-fabricated-citation-in-fkit-wiki-lint/brief.md)'s
  planning pass; **re-measured first-hand 2026-08-15** (16 runs, 1 failure, 15 success, latest
  2026-08-15); filed 2026-08-15 on the owner's ruling of the same day given live in the driving session,
  verbatim option label **"File architecture.md:33-35 (Recommended)"**.
- **⚠️ Root cause is the same landing as `0281`'s:**
  [`0256`](../../done/0256-gate-releases-so-an-untested-tree-cannot-ship/brief.md) landed CI and the
  in-release gate on 2026-08-12, correctly writing a *"has not run yet"* caveat **that was true that
  day** and was never revisited once runs started the next day.
- **⚠️ Ordering against the two open architecture.md rows.**
  [`0251`](../0251-refresh-architecture-md-section-9-test-suite-inventory/brief.md) edits **§9.1, the
  same section as occurrence B**, and its brief currently instructs preserving that bullet — see the
  CONFLICT section. **Whichever runs second must re-read the section rather than apply its brief
  verbatim.** [`0286`](../0286-mechanical-citation-sweep-of-architecture-md/brief.md) is citation-only
  and explicitly fenced off the prose, so it does not collide in content; either order is safe there.
- **⚠️ Adjacent, deliberately NOT filed:** ADR-026's two present-tense *"no `.github/workflows/`"*
  claims. **The owner considered them in the same question and did not select them.** Recorded so the
  next reader knows they were seen, not missed.
- **On merit:** the **Backlog**, unranked, and that is honest — nothing waits on it and no behavior
  changes. ⚠️ **But it is the strongest unranked row of its class**, for one reason: `architecture.md`
  is the document the architect's own survey writes and the document every role is pointed at for
  anything *"below product-brief altitude"* (`CLAUDE.md`). A false claim there propagates by design.
- **Blast radius if never done:** the project's own architecture document tells every reader — human or
  agent — that fkit's CI has never executed, while 16 runs sit in the repo's Actions history and a
  closed task (`0283`) exists **because** one of them went red. Concretely, it already has a downstream
  victim: `0281` is an open row whose brief **requires** the claim be copied into ADR-003.
- Filed 2026-08-15 by a spawned `fkit-producer` with **no owner channel**, on the owner's ruling of the
  same day. It asked nothing, edited `architecture.md` not at all, moved no task file, altered no
  existing task's status or rank, touched no sprint plan, and committed nothing.
