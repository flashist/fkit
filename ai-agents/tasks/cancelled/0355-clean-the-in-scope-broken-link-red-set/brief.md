# Clean the in-scope broken-link red set so `0354`'s guard goes green — re-measure first, the count is condition-dependent

## ID
0355

## Sprint
Sprint 7

## Priority
P5

## Status
⛔ Cancelled (agent-closed — not owner-verified) (2026-08-30) — Red set is 0 under `0353`'s settled condition. All six surviving instances are named exemptions with recorded reasons, already carried into `0354`'s guard. There is nothing to clean and nothing this row blocks.

## Owner
fkit-coder

## Context

> # ⛔ STOP — THIS TASK'S RED SET IS **0**. DO NOT START IT. (2026-08-30)
>
> ⭐ **Re-measured 2026-08-30 under `0353`'s settled condition: `BROKEN: 0 instances across 0 files`,
> `NAMED-EXEMPT: 6`, `SCANNED: 819 files`.** This task was scoped against **24 instances across 11
> files**. ⛔ **There is nothing to clean.**
>
> **Six instances match the matcher.** All six were read in their surrounding source; all six are
> **quoted or illustrative text, not pointers offered to a reader**; and the owner ruled on
> **2026-08-30** (`AskUserQuestion`, option label verbatim **"Exempt them by name (Rec)"**) that they
> be **named as exempt cases with their reasons**, not left as a red set someone is told to ignore.
> ⛔ **The disposition already exists** — in §4.1's `NAMED_EXEMPT` and §6.2's reason table of
> [`2026-08-29-the-reference-integrity-condition.md`](../../../knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md)
> — and [`0354`](../../backlog/0354-build-the-link-resolution-guard/brief.md) carries it into the guard. **This
> task's work is not "clean 24 links", and it is not "ignore 6 false positives" either. It is
> nothing.**
>
> ### ⛔ THIS ROW IS RECOMMENDED FOR CANCELLATION, AND THE DECISION IS THE OWNER'S — NOT YET TAKEN
>
> A spawned `fkit-producer` re-scoped this row on 2026-08-30 and **recommends cancelling it**. ⛔ **It
> has NOT been cancelled.** A cancel always stops for the owner
> ([ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)),
> the movers are producer-only
> ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
> and a spawned agent has no owner channel (ADR-021).
> **`## Status` is unchanged at `🔲 Backlog` and no file was moved.** The recommendation and its two
> alternatives are in §**"⭐ RE-SCOPED 2026-08-30"** at the foot of this brief.
>
> ⛔ **Until the owner rules: do not implement this brief, and do not treat `0354` as blocked by it.**
> `0354`'s guard is **green without this task doing anything**.
>
> **All original text below is left byte-identical** as the record of what was believed on 2026-08-29.
> Falsified passages carry a `⚠️ DATED CORRECTION 2026-08-30` block at the end of their own section.

### The hole this closes

[`0354`](../../backlog/0354-build-the-link-resolution-guard/brief.md) builds `test/reference-integrity.test.js`.
Like [`0176`](../../backlog/0176-build-the-coordination-citation-policy-guard/brief.md) before it, **it is red on
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

> ## ⚠️ DATED CORRECTION 2026-08-30 — EVERY FIGURE IN `## Context` ABOVE IS FALSIFIED. ⛔ DO NOT WORK FROM THE TABLES.
>
> **All text above is left byte-identical as the record of what was measured on 2026-08-29.**
>
> ### ⛔ None of the five table rows reproduced
>
> The five-row matcher table (`304 / 96`, `64 / 22`, `60 / 26`, ⭐`24 / 11`, `17`) and the
> eleven-row distribution beneath it are **all wrong**. The settled condition matches **none** of
> them, and the distribution table names files that are not on any red set today.
>
> | Reading | Broken | Files |
> |---|---|---|
> | ⭐ **Settled condition** — named exemptions applied | ⭐ **0** | **0** |
> | Settled, `NAMED_EXEMPT` emptied | 6 | 4 |
> | Document-level span masker | 1 | 1 |
> | Blockquotes counted | 8 | 6 |
> | Fences only, spans counted | 127 | 60 |
> | Naive — nothing skipped | 163 | 72 |
> | Settled **+ closed folders exempt** (this brief's assumption) | 0 | 0 |
>
> **Why each of the brief's four headline figures failed**, from the condition document §6.3:
> **`304`** — the settled matcher's own naive reading is **163**; the gap is fence-masking and
> link-syntax strictness, not exemptions. **`60`** — the brief's matcher skipped code spans only
> *within* a line without pairing backtick runs, so most multi-backtick spans went unmasked; the
> settled reading is **6** before named exemptions and **0** after. **`24` and `17`** — both rest on
> exempting `tasks/done/` and `sprints/done/`, and ⛔ **the owner ruled that exemption OUT for this
> half on 2026-08-29** (*"Accept — links in scope, citations exempt (Rec)"*). Under the settled
> condition it does not exist.
>
> ⭐ **The brief's central worry — *"the inline code-span question is unruled … the single largest
> lever on the number"* — was RIGHT, and `0353` ruled it: for the LINK half, inline code spans ARE
> skipped.** A link in backticks is documented marker text, not a pointer offered to a reader.
> ⚠️ **The citation half rules the opposite way, deliberately** (condition document §1).
>
> ### ⛔ Two more specific claims above are wrong
>
> - **The vault: *"a naive matcher reports 13"*** — ⛔ **it reports 12, across 8 files.** Re-measured
>   2026-08-30 by pointing the settled walker at `ai-agents/wiki-vault/` with the exemption lifted:
>   **275 files, 0 broken settled, 12 across 8 naive**, every one inside an inline code span. The
>   constraint *"report whatever the settled condition finds; touch none"* stands — and what it finds
>   is **zero**.
> - **The `knowledge-base/reports/` worry** — *"the single biggest contributor sits in
>   `knowledge-base/reports/`, whose in-scope status is exactly what `0353` must rule on … if `0353`
>   exempts reports, the red set drops to 17"*. ⛔ **`0353` ruled `knowledge-base/**` IN scope, and
>   the measured cost of that widening is 0.** There is no contributor there.
>
> ### ⭐ The `0306` case-1 / case-2 trap was real — and the ruling resolved it in case 2's favour
>
> The *"⛔ The trap this task must not fall into"* section above is the part of this brief that held
> up. All six surviving instances are **case 2** — frozen or illustrative records where re-pointing
> would destroy the thing the text is about: a synthetic board row inside ADR-040's own diagnosis of a
> regex, two throwaway scratchpad fixture rows whose own worklog says the fixture was *"never in the
> repo"*, and three quoted proposed-replacement snippets whose relative depth is **correct at the file
> the text is proposed for**. ⭐ **The owner's "Exempt them by name (Rec)" ruling is precisely the
> *"dated note or an exemption, never a silent re-point"* disposition this section demanded.** It has
> already been applied. **Case 1 is empty.**
>
> ### 📅 Provenance and decay
>
> **Re-measured 2026-08-30 by a spawned `fkit-producer`**, by extracting §4.1's script **verbatim**
> from the condition document into a session scratchpad (never into the repo) and running it from the
> repo root against the working tree of that date.
>
> ⚠️ **AS-OF 2026-08-30, AND THE SOURCE WAS STILL UNDER REVIEW (round 2) WHEN TAKEN.** ⛔ **If this
> row survives cancellation, re-measure at its own plan gate before acting on any number here.**

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

> ## ⚠️ DATED CORRECTION 2026-08-30 — THE `Blocks:` BULLET AND VERIFICATION STEP 8 ARE FALSIFIED.
>
> **All text above is left byte-identical.**
>
> - ⛔ **`Blocks: 0354 going green`** — falsified. **`0354`'s guard is GREEN on arrival, without this
>   task.** Re-measured 2026-08-30: 0 broken, 6 named-exempt. The bullet's careful reasoning
>   (*"`0354` can ship without this task (red, and honestly reported); it cannot be green without
>   it"*) was correct under the condition believed on 2026-08-29 and is void under the settled one.
>   ⭐ **This row blocks nothing.** The `0356`/`0357`/`0358` sequencing gate still requires `0354` and
>   `0176` green — `0354` is green already, and the remaining cost sits in `0176`, which depends on
>   [`0237`](../../backlog/0237-clean-the-coordination-citation-residual-set-that-blocks-0176/brief.md).
> - ⛔ **Verification step 8** asserts *"`ai-agents/sprints/backlog.md` carries **3** of the
>   convention-correct in-scope broken links (11 under the naive reading)"*. **Re-measured 2026-08-30
>   under the settled condition: `ai-agents/sprints/backlog.md` carries ZERO broken links.** ⚠️ The
>   step's underlying caution stands and is worth keeping wherever it applies: **that file is
>   machine-parsed by `dashboard.sh` and by both task movers, so any edit to it touches a parser
>   contract.** There is simply no edit to make here.
> - **`Depends on: 0353` — hard** — unchanged, and now discharged: the condition is settled.
> - **The `📌`-style precedent note and the `0306` case-2 reasoning stand** — see the §Context
>   correction, where the ruling that applied them is recorded.

---

## ⭐ RE-SCOPED 2026-08-30 — THIS ROW HAS NO WORK. CANCELLATION RECOMMENDED, OWNER TO RULE.

**Authority for the re-scope:** owner ruling **2026-08-29**, live `AskUserQuestion`, option label
verbatim **"Accept — links in scope, citations exempt (Rec)"**, presented with the explicit cost
*"contradicts three briefs, so `0354` and `0355` need re-scoping before they run"*; sharpened by the
owner ruling **2026-08-30**, option label verbatim **"Exempt them by name (Rec)"**. Escalation **E2**
of [`2026-08-29-the-reference-integrity-condition.md`](../../../knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md),
which records that *"`0355` therefore has nothing to clean … The producer should re-scope or cancel it
on that basis — that call is the producer's, not this document's."*

### The finding, in one line

⭐ **Settled red set: `BROKEN: 0 instances across 0 files` / `NAMED-EXEMPT: 6` / `SCANNED: 819 files`,
re-measured 2026-08-30.** Scoped against 24. **Case 1 (target moved, re-point) is empty. Case 2
(frozen record, leave and annotate) is all six, and is already dispositioned by owner ruling.**

⛔ **Every route to work inside this task's stated scope was checked and is empty:**

| Candidate work | Status |
|---|---|
| Broken links in scope | **0** |
| The 6 surviving instances | Already dispositioned by name, with reasons, by owner ruling — and carried into `0354`'s guard |
| `ai-agents/sprints/backlog.md` | **0** broken links |
| `knowledge-base/reports/` — the feared "biggest contributor" | Ruled **IN scope**; measured cost **0** |
| `ai-agents/wiki-vault/` | **0** settled (12 naive, all inline code spans). ⛔ Vault writes are `fkit-wiki`'s alone (ADR-005) — never this task's |
| The 8 blockquote-hidden instances | All inspected 2026-08-30: **all quotation or proposed text, none genuine rot** |
| `claude/` (3) and `test/` (440) | ⛔ Ruled **out of the scanned set** — frozen `test/fixtures/` (ADR-042) and `claude/scaffold/` templates that resolve **in the consuming project**. A guard reddening on these is *wrong*, not inconvenient |

### ⛔ THE DECISION IS THE OWNER'S. It has not been taken, and no status was changed.

**Producer recommendation: `⛔ CANCEL`**, reason — *"Red set is 0 under `0353`'s settled condition. All
six surviving instances are named exemptions with recorded reasons, already carried into `0354`'s
guard. There is nothing to clean and nothing this row blocks."*

**The two alternatives, weighed and not recommended:**

- **Keep it as a thin verification row** — re-measure at the moment `0354`'s guard lands and confirm 0.
  ⛔ **Rejected as duplicate:** that is already `0354`'s corrected verification step 8′, which requires
  re-measuring at its own plan gate and reporting the figure honestly. A second row asserting the same
  thing adds a board row, not a check.
- **Re-purpose the row** onto the one genuinely unowned thing this investigation surfaced —
  §7 item 6's **250 source-file coordinates across 46 files**, invisible to both guards. ⛔ **Rejected
  as a re-purposing:** that is different work, of a different class, against a scope both `0176` and
  `0353` explicitly **refuse to widen into**. It deserves its own row with its own brief, not this
  row's identity
  ([`priority-is-rank-not-identity`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)).

⛔ **Nothing here cancels anything.** `## Status` is unchanged at `🔲 Backlog`, `## Sprint` at
`Sprint 7`, `## Priority` at `P5`; no board row was touched and no file was moved. A cancel stops for
the owner (ADR-032), the movers are producer-only (ADR-033), and a spawned agent has no
owner channel ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
⭐ **If the owner rules cancel, the mover must be run by a producer with the reason text above, and the
close carries the `(agent-closed — not owner-verified)` marker only if the owner is not present for it.**

### If the owner rules KEEP

⛔ **Do not implement §"What to build" as written** — its steps operate on a 24-instance red set that
does not exist. The only honest shape left is: **re-run §4.1's script at the plan gate, publish the
figure, and close on the finding — including the count of named exemptions, which is a disposition,
not an absence.** ⛔ **Do not widen the condition to manufacture work**, and ⛔ **do not narrow it to
make the zero look bigger.** Both are `0353`'s call and both were made.

### 📅 Provenance and decay

**Re-measured 2026-08-30 by a spawned `fkit-producer` with no owner channel (ADR-021)**, by extracting
§4.1's script verbatim from the condition document into a session scratchpad (never into the repo) and
running it from the repo root against the working tree of that date. Reproduced: `BROKEN: 0 /
NAMED-EXEMPT: 6 / SCANNED: 819`; vault `0` settled and `12 across 8` naive over 275 files.

⚠️ **AS-OF 2026-08-30. The condition document was STILL UNDER REVIEW (round 2) when these were taken
and may change**, and the document's own artifacts are inside the scanned set, so the tree measures
differently as they are written. ⛔ **Re-measure before acting on the cancellation recommendation** —
a red set of 0 is exactly the kind of claim that should be checked on the day it is used.

*Recorded 2026-08-30 by a spawned `fkit-producer` executing escalation **E2** of the condition
document under the owner's 2026-08-29 ruling. Every edit is an append; all prior text is
byte-identical. ⛔ **No status, rank, board membership, dependency field or file location was changed,
and no mover was run.***
</content>

---

## ⛔ CANCELLED 2026-08-30 — THE OWNER RULED. THIS ROW IS CLOSED.

**Marker written to `## Status`, verbatim:**

```
⛔ Cancelled (agent-closed — not owner-verified) (2026-08-30) — Red set is 0 under `0353`'s settled condition. All six surviving instances are named exemptions with recorded reasons, already carried into `0354`'s guard. There is nothing to clean and nothing this row blocks.
```

### Provenance of the ruling

- **Decided by:** the **owner**, live via **`AskUserQuestion`** in a `fkit lead` session, **2026-08-30**.
- **Option label, verbatim:** **"Cancel it (Rec)"**.
- **Presented as:** the producer's recommendation, with a reason line ready for the mover. It rejected
  keeping the row as a thin verification row — ⛔ **that check is already `0354`'s corrected step 8′.**
- **Authority chain:** escalation **E2** of
  [`2026-08-29-the-reference-integrity-condition.md`](../../../knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md),
  opened under the owner ruling of 2026-08-29 (*"Accept — links in scope, citations exempt (Rec)"*) and
  sharpened by the ruling of 2026-08-30 (*"Exempt them by name (Rec)"*), which dispositioned all six
  surviving instances by name.

### ⚠️ Why the marker still says `(agent-closed — not owner-verified)`

⭐ **The owner ruled the cancellation itself.** ⛔ **But the producer that executed it was SPAWNED and
had no owner channel** ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
so [ADR-033 §5](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
requires the qualifier. **The ruling authorizes the act; it does not make the execution
owner-verified.** ⛔ Do not read the qualifier as doubt about the decision — read it as: *nobody with
the owner's eyes watched the files move.*

### ⛔ Two sentences above this block are now FALSIFIED by this very act

**Both are left BYTE-IDENTICAL** as the record of what was true when written on 2026-08-30, hours
before the ruling:

- §`## Context`'s stop-banner: *"⛔ **It has NOT been cancelled.** … **`## Status` is unchanged at
  `🔲 Backlog` and no file was moved.**"* — ⛔ **false as of this block.** It has been cancelled,
  `## Status` reads the marker above, and this folder now sits in `ai-agents/tasks/cancelled/`.
- §`⭐ RE-SCOPED 2026-08-30`'s closing line: *"⛔ **Nothing here cancels anything.** `## Status` is
  unchanged at `🔲 Backlog`, `## Sprint` at `Sprint 7`, `## Priority` at `P5`; no board row was touched
  and no file was moved."* — ⛔ **false as of this block** for `## Status`, the board row and the file
  location. ⭐ **Still TRUE for `## Sprint` (`Sprint 7`) and `## Priority` (`P5`)** — ⛔ **rank was not
  changed and nothing was renumbered** ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  Sprint 7's board now carries a **gap at `P5`**, deliberately.

### What this close changed outside this folder

- [`sprint-7.md`](../../../sprints/sprint-7.md) — the `P5` row's status cell and brief href, plus a
  dated addendum in `## Notes` enumerating the board prose this cancellation falsifies.
- [`0360`](../../backlog/0360-cut-the-v0-3-0-release-and-hand-archive-sprint-7/brief.md)'s
  machine-parsed `- **Depends on:**` bullet — `0355` removed, with a dated sub-bullet recording it.
- Inbound hrefs re-pointed to this folder's new path in
  [`0353`](../../done/0353-settle-the-reference-integrity-condition-once-for-both-halves/brief.md),
  [`0354`](../../backlog/0354-build-the-link-resolution-guard/brief.md) and
  [`0356`](../../backlog/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md) — **href only,
  no sentence touched.**
- This brief's own outbound sibling links (`0176`, `0237`, `0354`) re-pointed from `../` to
  `../../backlog/`, which the extra board hop requires.

*Executed 2026-08-30 by a spawned `fkit-producer` running `/fkit-task-cancelled` against the canonical
`claude/skills/fkit-task-cancelled/SKILL.md`. Every edit above this block is an append; all prior text
is byte-identical apart from the `## Status` line and the three outbound sibling hrefs, both of which
the skill mandates. ⛔ **Nothing was committed.***
