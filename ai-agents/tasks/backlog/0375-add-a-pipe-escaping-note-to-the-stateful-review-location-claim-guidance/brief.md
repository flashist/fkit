# Add a pipe-escaping note to the stateful-review `Location` / `Claim` guidance — pasting a verbatim fragment from a board splits the ledger row

## ID
0375

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

**Owner ruling K4**, given at [`0369`](../../done/0369-amend-the-review-ledger-location-column-to-heading-plus-fragment-for-coordination-documents/brief.md)'s
round-1 process-review on **2026-09-04**, live via `AskUserQuestion` and relayed to a spawned worker —
**the option label is the verbatim text: "Follow-up task (Rec)"**.

Recorded in `0369`'s [`review.md`](../../done/0369-amend-the-review-ledger-location-column-to-heading-plus-fragment-for-coordination-documents/review.md)
as finding **R3** and as the accepted residual
**"One sentence on cell layout, no pipe-escaping caveat"**, whose `Re-raise only if` reads, verbatim:

> *"the producer follow-up is not filed, **or** a findings row is actually observed corrupted by an
> unescaped pipe from a pasted fragment."*

⛔ **This brief IS that filing.**

### ⛔ The defect — a mechanism, not a style preference

`0369` shipped, into both stateful-review skills, the sentence ruled at **J4**:

> **In the row:** put the heading in the `Location` cell (e.g. `brief.md § Context`) and the quoted fragment in `Claim`.

⛔⛔ **That instruction tells a reviewer to paste a verbatim fragment from a coordination document into
a markdown table cell, and says nothing about escaping `|`.** An unescaped pipe **splits the findings
row** — the reader gets a corrupted table, and the finding it carried is mangled.

⚠️ **The documents most often quoted are themselves tables**, so the fragment most likely to be pasted
is the one most likely to contain a pipe.

### The exposure, measured — and verified twice

Counted 2026-09-04 by the reviewer and **independently re-verified by the coder**, both arriving at
the same two figures:

| Board | Pipe-leading lines |
|---|---|
| `ai-agents/sprints/sprint-7.md` | **70** |
| `ai-agents/sprints/backlog.md` | **208** |

⚠️ **These count pipe-*leading* lines — table rows — not total pipes**, so they are a floor on the
exposure, not a census of it. ⛔ **Re-measure and state your own method.**

### ⭐ The frontier tension, stated so the implementer does not walk into it

⛔ **J4 capped the layout guidance at ONE sentence, deliberately, and the owner re-affirmed the cap at
K4** after seeing this exact cost. A caveat is a **second** sentence. ⚠️ **That is why this could not
be fixed inside `0369` and needs its own row** — it is not an oversight to be quietly patched into the
existing sentence.

⛔ **The implementer does not get to decide the cap is wrong.** If the minimal correct fix genuinely
requires exceeding one sentence, **that is a question for the owner**, not a licence.

### ⚠️ Bounded, and honestly so

The cost is real but **not silent**: a corrupted table row is **visible and recoverable**, it changes
no behaviour, and no finding is lost — only mis-rendered. ⭐ **Recorded so this row is ranked for what
it is**, not oversold.

### ⭐ Pair with `0322` — related, NOT a duplicate

[`0322`](../0322-escape-the-stray-pipes-in-the-board-rows-and-guard-against-new-ones/brief.md)
(*"escape the stray pipes in the board rows and guard against new ones"*, open, `Unscheduled`) already
owns this failure class **for board rows**. ⛔ **It does not reach this row's target**, and its own
brief says so in terms:

> *"⛔ **The guard checks board files only.** It is **not** a general markdown-table linter over the
> whole repo…"*

⛔ **Three ways they differ, stated so nobody merges them:**

| | `0322` | this row |
|---|---|---|
| **Artifact** | board files under `ai-agents/sprints/` and `sprints/done/` | a task folder's `review.md` findings table |
| **Act** | repair existing broken rows **+** build a guard | add prose guidance to a `SKILL.md` |
| **Direction** | fixes rows already broken | stops a reviewer creating new ones |

⚠️ **They should nevertheless be read together** — whoever runs second should read the first, and
⭐ **if `0322`'s guard is later widened to task-folder ledgers, that changes this row's value and
should be re-costed.**

## What to build

1. **Re-measure the exposure** and state your own figures and method — ⛔ **occurrences, not lines,
   where the two differ**, and say which you counted
   ([`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md)).
2. **Add the escaping note to the `Location` / `Claim` guidance in BOTH stateful-review skills** —
   `claude/skills/fkit-stateful-review/SKILL.md` (reviewer's write side) and
   `claude/skills/fkit-process-stateful-review/SKILL.md` (coder's read side).
   ⛔⛔ **Both halves in the same change.** The rule block is currently **byte-identical** across the
   two files — verified by `0369`'s worklog at md5 `45339838c8479faa78222a8fdc73a77d` — and ⛔ **it
   must stay byte-identical**, or the ledger schema desyncs. ⭐ Precedent for the both-halves
   discipline: [`0209`](../0209-add-an-out-of-scope-by-owner-ruling-status-value-to-both-stateful-review-schemas/brief.md).
3. **Keep it minimal and keep J4's sentence intact.** ⛔ Do not reword, re-order or absorb the existing
   layout sentence — add beside it. ⚠️ **Say in the worklog how many sentences the block now carries**,
   because the cap is a live owner ruling and the run must be auditable against it.
4. **Say what the escape actually is.** ⚠️ *"Escape pipes"* is not enough for the reader who put the
   fragment in backticks and assumed that was sufficient — ⛔ **a backtick code span does NOT protect a
   pipe in a markdown table cell**, which is precisely the intuition that produced `0322`'s defect. The
   note must name `\|`.
5. **Update the dual-homed twin if either file has one**, per
   [ADR-027](../../../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md)
   — the parity test reds otherwise.

⛔ **Out of scope:** repairing any existing corrupted row anywhere (`0322` owns the board half; a
ledger half would be a new row — **raise it, do not do it**); building a guard over task-folder
ledgers (⛔ **a separate costing row** — see Notes); changing what `0176`'s guard scans; re-editing
`0369`'s column amendment; `ai-agents/tasks/README.md` (that is `0374`); `.claude/` mirror edits;
`ai-agents/wiki-vault/` ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

## Verification steps

1. **Both** skills carry the note, and the rule block is **still byte-identical across the two files** —
   ⛔ **state the md5 of the block in each, before and after.** A diff touching one fails this task.
2. The note **names `\|` explicitly** and says a backtick span does not exempt a pipe.
3. **J4's existing sentence is unchanged** — show it byte-identical.
4. `npm test` passes, **including the ADR-027 parity check** — ⚠️ **but say plainly that green is
   weak evidence here: no test pins this prose.** ⛔ **Do not report the suite as though it verified
   the change**; name what actually did (reading it, and the byte-identity check in step 1).
5. `bash test/prove-red.sh` still passes its named mutations.

## Notes

- **Depends on:** nothing. `0369` has landed — verified 2026-09-04, its folder sits in
  `ai-agents/tasks/done/`.
- **Blocks:** nothing.
this belongs low among the process rows on its own — the failure is visible and recoverable — but ⚠️ **it is very cheap** (one note, two files, no manifest and no test to regenerate, unlike `0374`), so it may be worth pairing with whatever run next touches these two skills rather than ranking it alone.
- ⚠️ **This brief decays.** Every figure was measured **2026-09-04** at `HEAD` `6dcc33e` against a
  **dirty working tree**. **Re-measure; do not quote.**
- ⚠️ **Filed UNRANKED by a spawned `fkit-producer` with no owner channel** — this row **appends** and
  renumbers nothing ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
- ⭐ **OPEN QUESTION FOR THE OWNER — raised, deliberately not decided.** Should a **guard** cover
  unescaped pipes in task-folder `review.md` findings tables, the way `0322` builds one for board
  files? ⛔ **Out of scope here** — this row is prose only, and a guard is a different size of task.
  ⚠️ `0322`'s guard is explicitly board-files-only, so today **nothing** would catch a corrupted
  ledger row. Raised so the gap is on the record, not so this run closes it.
- ⚠️ **Citation form used here:** coordination documents are cited **file + heading + quoted
  fragment**, never `path:NNN` (row 3 of
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
  **Source-file line coordinates are used where load-bearing** — row 1 rules them correct, and
  `0176`'s owner ruling **G3** keeps them legal.
