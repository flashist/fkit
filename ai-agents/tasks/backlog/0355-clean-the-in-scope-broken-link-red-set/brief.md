# Clean the in-scope broken-link red set so `0354`'s guard goes green — re-measure first, the count is condition-dependent

## ID
0355

## Sprint
Sprint 7

## Priority
P5

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### The hole this closes

[`0354`](../0354-build-the-link-resolution-guard/brief.md) builds `test/reference-integrity.test.js`.
Like [`0176`](../0176-build-the-coordination-citation-policy-guard/brief.md) before it, **it is red on
arrival and shipping it red is not an option.** This task cleans the residual so it goes green. It is
the exact pairing `0237`/`0176` already are — and it is filed as its own row for the same reason the
owner ruled that one *"File the cleanup as its own task."*

### ⚠️ The count is CONDITION-DEPENDENT, and the numbers below are not a checklist

Measured 2026-08-29. ⛔ **Two matchers, and the difference between them is larger than the work
itself** — the only difference is whether **fenced blocks and inline code spans** are skipped:

| Matcher | Exemptions applied | Broken instances | Distinct files |
|---|---|---|---|
| **Naive** — code spans and fences counted | none | 304 | 96 |
| **Naive** | ADR-034 + ADR-005 + `sprints/done/` | 64 | 22 |
| ⭐ **Convention-correct** — fences and code spans skipped | none | 60 | 26 |
| ⭐ **Convention-correct** | ADR-034 + ADR-005 + `sprints/done/` | ⭐ **24** | ⭐ **11** |
| ⭐ **Convention-correct** | …and `knowledge-base/reports/` too | 17 | — |

⛔ **THE SCOPE FIGURE THIS SPRINT WAS PLANNED ON — *"~68 broken links across ~24 files"* — MATCHES THE
NAIVE READING, NOT THE CONVENTION-CORRECT ONE.** Under the reading that honours `0176` scoping
decision 2 (*"skip fenced blocks and blockquote lines"*), the in-scope set is **24 across 11 files** —
roughly **a third** of what was planned for. ⭐ **This is a correction, not a re-scope:** most of the
difference is quoted marker text inside backticks — documentation *of* the link form, not links. ⛔ **Do
not treat the smaller number as the work being done for you**; treat it as the work being correctly
bounded.

⛔ **RE-MEASURE UNDER `0353`'s SETTLED CONDITION BEFORE TOUCHING ANYTHING, AND REPORT AGAINST EVERY ROW
ABOVE.** Say which reading the settled condition matches, or that it matches none. ⚠️ **The inline
code-span question is unruled** — `0176`'s convention names fences and blockquotes, not code spans, and
that gap is the single largest lever on the number. `0353` rules it
([`evidence-before-assertion`](../../../knowledge-base/conventions/evidence-before-assertion.md)).

**Where the convention-correct in-scope 24 sit, measured 2026-08-29** — the whole distribution, so the
shape of the work is visible before it starts:

| Count | File |
|---|---|
| 7 | `ai-agents/knowledge-base/reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md` |
| 4 | `0309-…/brief.md` |
| 3 | `0299-…/brief.md` |
| 3 | `ai-agents/sprints/backlog.md` |
| 1 each | `0170`, `0276`, `0278`, `0279`, `0281` briefs |
| 1 each | `knowledge-base/decisions/adr-040-…md`, `knowledge-base/conventions/durable-citation-anchors.md` |

⚠️ **The single biggest contributor sits in `knowledge-base/reports/`, whose in-scope status is exactly
what `0353` must rule on.** If `0353` exempts reports, the red set drops to **17** and this task's shape
changes materially. **Do not start until that is settled.**

### ⛔ The trap this task must not fall into

A broken link has **two** honest repairs, and picking the wrong one destroys a record:

1. **The target moved** → re-point the link. This is the common case (a task folder that moved to
   `done/`, a sprint board archived under `sprints/done/`).
2. **The link is a frozen record of something that was true when written** → ⛔ **do not re-point it.**
   `0176` and `0237` each carry a `📌 DATED NOTE 2026-08-15 (0306)` recording exactly this: dead
   `ai-agents/sprints/sprint-2.md` strings deliberately **left byte-identical**, because *"the
   sentence is about that string being dead"* — re-pointing would make the sentence contradict itself.
   **That precedent binds this task.** Where a link is a frozen record, the repair is a dated note or
   an exemption, never a silent re-point.

## What to build

**A clean in-scope tree**, so `0354`'s guard is green.

### Steps

1. **Read `0353`'s condition document** and re-measure the red set under it. Report against all three
   rows of the table above.
2. **Classify every hit before fixing any of them** — case 1 (target moved, re-point) or case 2
   (frozen record, leave and annotate). ⛔ **Publish the classification in the worklog before editing.**
   A classification produced after the edits is a rationalisation.
3. **Repair case 1** — re-point the link to where the target actually is. ⛔ **Change the link, not the
   sentence around it.**
4. **Handle case 2** — leave the link byte-identical and record why, following the `0306` precedent
   the two briefs above already set. If the volume of case 2 is large enough that the guard cannot go
   green without an exemption, ⛔ **stop and surface it** — a new exemption is `0353`'s to rule, not
   this task's to invent.
5. **Re-run `0354`'s guard and report red-before / green-after**, with counts.

⛔ **Constraints:**

- **⛔ Edit nothing under `ai-agents/tasks/done/` or `ai-agents/tasks/cancelled/`** (ADR-034).
- **⛔ Edit nothing under `ai-agents/wiki-vault/`** (ADR-005). ⭐ **Measured 2026-08-29 there are ZERO
  convention-correct broken links there** — a naive matcher reports 13 and **all 13 are inline code
  spans**. Report whatever the settled condition finds; touch none.
- **⛔ Do not build or modify the guard.** That is `0354`.
- **⛔ Do not touch `0176`'s or `0237`'s citation red set.** Different defect class, different task.
- **⛔ Do not change any board row's status, and do not move any task file** (ADR-033).
- **⛔ No `path:NNN` citations in this task's own artifacts.**
- **⛔ Do not widen the condition to make the number look better, and do not narrow it to make the
  work smaller.** Both are `0353`'s call.

## Verification steps

1. `0353`'s condition document is named by filename in the worklog, and the re-measurement is reported
   against **every row** of the two-matcher table in §Context — **304 / 96**, **64 / 22**, **60 / 26**,
   **24 / 11**, **17** — and the divergence explained. ⛔ State explicitly whether the settled condition
   skips **inline code spans**, and what that alone does to the count.
2. The case-1 / case-2 classification exists in the worklog, **committed to before** the edits — show
   it as a discrete step, with a count per class.
3. **`0354`'s guard runs green** over the in-scope set. Show the red run before and the green run after.
4. `git diff --stat` shows **zero** files modified under `ai-agents/tasks/done/`,
   `ai-agents/tasks/cancelled/`, and `ai-agents/wiki-vault/`.
5. **Every case-2 link is byte-identical to `HEAD`.** Prove it per file with `git diff`; do not eyeball.
6. **Spot-check every case-1 repair**: the link now resolves **and** points at the thing the sentence
   says it points at. A repair that resolves to the wrong document is worse than the broken link.
7. `npm test` passes, including `test/prove-red.sh`. Report the counts.
8. Run the dashboard over all live boards; report roll-ups and drift **before and after**. ⛔ **No board
   gains a drift record** — `ai-agents/sprints/backlog.md` carries **3** of the convention-correct
   in-scope broken links (11 under the naive reading) and is a machine-parsed file.

## Notes

- **Depends on:** `0353` — hard. Nothing here is safe to start against an unsettled condition.
- **Blocks:** `0354` going green. ⚠️ `0354` can **ship** without this task (red, and honestly reported);
  it cannot be **green** without it. Both orderings are legal; the sequencing gate on the sweeps is on
  `0354` being **green**, which means this task.
- ⚠️ **`ai-agents/sprints/backlog.md` is a machine-parsed file and a contributor either way** — 3 hits
  convention-correct, 11 naive.
  Its rows are read by `dashboard.sh` and by both task movers. **Treat every edit there as touching a
  parser contract** and re-run the dashboard after each pass.
- ⚠️ **This brief's figures decay.** They are two matchers' output on 2026-08-29, taken on a tree with
  concurrent untracked work. **The inventory is evidence the set is real, not a checklist to execute.**
- **Priority `P5` is a rank on Sprint 7's board, assigned in the same act that ranked the board on the
  owner's ruling of 2026-08-29** — see [`sprint-7.md`](../../../sprints/sprint-7.md) §"⭐ THIS BOARD IS
  RANKED". Rank is board position, never identity
  ([`priority-is-rank-not-identity`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)).
- **Source:** Sprint 7 scope, owner ruling *"Approve all 12 as proposed (Rec)"*, 2026-08-29,
  `AskUserQuestion`, live `fkit lead` session.
</content>
