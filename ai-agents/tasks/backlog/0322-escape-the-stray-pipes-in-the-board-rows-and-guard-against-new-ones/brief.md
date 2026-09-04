# Escape the stray unescaped pipes that split board rows in rendered markdown, and guard against new ones

## ID
0322

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

**Owner ruling 2026-08-22**, given live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop` and relayed to a spawned producer — **verbatim option label:
"File it (Recommended)"**.

The question it answered, verbatim:

> *"22–25 rows of `backlog.md` split into 7–15 markdown fields instead of 6, from stray `|`
> characters inside cells (shell snippets quoted in row text). The dashboard parses them fine — this
> is a rendered-markdown defect. No task covers it. The producer flagged it rather than filing
> unasked."*

The chosen option's description, verbatim:

> *"A brief to escape or fence the stray pipes across the affected rows, plus a guard so new rows
> can't reintroduce them. Latent but real: the board is the artifact humans read, and malformed rows
> render wrong wherever markdown is displayed."*

### ✅ Authority — the two follow-up rulings of 2026-08-22 (the open questions are CLOSED)

The filing producer deliberately left two questions open for the owner. **Both are now answered.**
Both were given live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop` on **2026-08-22**, and relayed to a spawned producer, which recorded them
here. **The implementer decides neither — it implements both.** Full text under
[`### ✅ THE TWO QUESTIONS, ANSWERED`](#-the-two-questions-answered) at the end of `## Notes`.

| # | Question | Owner's ruling — verbatim option label | Effect on this task |
|---|---|---|---|
| **Q1** | Are the two archived-board sites in scope? | **"In scope (Recommended)"** | `sprints/done/sprint-2.md` and `sprints/done/sprint-5.md` are **repaired**, not census-only. |
| **Q2** | Should the repair and the guard be two tasks? | **"Keep repair + guard together (Recommended)"** | `0322` stays **ONE** task. ⛔ Do not split. ⛔ Do not ship the repair alone. |

### ⚠️⚠️ THE RULING'S FIGURES ARE WRONG, AND THE CORRECTED ONES ARE BELOW

⛔ **Do not carry `22`, `25`, `6`, or `7–15` forward from the question text.** Every one of them was
measured by a method that could not tell an **escaped** pipe (`\|`) from a **bare** one, and against
the wrong column baseline. The defect the ruling describes **is real** — it is simply **much
smaller** than reported, and in a different place than the reported line list suggests.

**Re-measured firsthand 2026-08-22 at `HEAD` = `6f3d9f3` against a dirty tree.** Two corrections, both
load-bearing:

1. ⛔ **The board's `## Status` table is FOUR columns** — `Status | Priority | Task | Brief`.
   `dashboard.sh` **renders SIX** (it appends `Owner` and a `⟨derive: …⟩` cell). **The `6` in the
   ruling's question is the RENDER's width, not the source table's**, so every source row was being
   compared against a baseline two columns too wide.
2. ⛔ **An escaped pipe `\|` is the CORRECT form and is NOT a defect.** It does not split a cell in any
   markdown renderer. **18 rows of `backlog.md` already use it correctly.** The reported `22` is
   exactly **those 18 plus the 4 real defects** — the counting method unioned correct rows with
   defective ones.

**The true population, escape-aware, per board:**

| Board | Defective rows | Notes |
|---|---|---|
| `ai-agents/sprints/backlog.md` | **4** (holding **5** stray bare pipes) | see the site table below |
| `ai-agents/sprints/done/sprint-2.md` | **1** | archived board — ✅ **IN SCOPE** (owner ruling 2026-08-22, Q1) |
| `ai-agents/sprints/done/sprint-5.md` | **1** | archived board — ✅ **IN SCOPE** (owner ruling 2026-08-22, Q1) |
| `ai-agents/sprints/sprint-6.md` | **0** | ✅ clean |
| `ai-agents/sprints/done/sprint-1.md`, `-3.md`, `-4.md` | **0** each | ✅ clean |

**Total across every board: 6 defective rows.** ⛔ **Not 22, not 25.**

### The sites — anchored on the row's Brief-cell link, not on a line number

⚠️ **Line numbers below are dated conveniences from 2026-08-22 and MUST be re-derived.** A board is a
**coordination document** — row 3 of
[`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md):
*"third parties append **above** your line for reasons unrelated to your sentence; the file grows
under you"*. Other workers are appending rows to `backlog.md` today.

| Board | Row (Brief cell links…) | Line on 2026-08-22 | Stray bare pipes | The snippet carrying them |
|---|---|---|---|---|
| `backlog.md` | `0169-point-the-stateful-review-close-conditions-at-adr-034` | 137 | 1 | a ledger schema alternation, `Status: in-review ` then a bare pipe then ` closed-out` |
| `backlog.md` | `0278-confirm-or-disprove-the-filename-derived-moved-href-template-in-task-brief` | 222 | 1 | a `sed -nE` regex alternation inside `(${SPRINT_ID_RE}` … `Backlog)` |
| `backlog.md` | `0318-append-a-dated-correction-note-to-0238s-closed-brief` | 261 | **2** | the append-only deletion-filter shell pipeline, `git diff -U0 …` piped into `grep '^-'` piped into `grep -v '^---'` |
| `backlog.md` | `0319-discharge-the-vaults-partial-not-ready-to-close-flag-on-0206` | 262 | 1 | the whitespace-normalising pipeline, `tr` piped into `tr -s ' '` |
| `sprints/done/sprint-2.md` | the `➡️ Moved` row for the same `0169` task | 210 | 1 | ⭐ **the SAME snippet as `backlog.md`:137** |
| `sprints/done/sprint-5.md` | the `✅ Done` row for *"Implement ADR-040's identity grammar in `dashboard.sh`"* | 191 | 1 | — |

⭐ **A propagation mechanism, worth recording because it explains how the defect spreads:** the
`sprint-2.md` site and the `backlog.md`:137 site are **the same row text**, carried across when the
task moved boards. **A stray pipe survives a board move.** Repairing one copy does not repair the
other.

### ⚠️ IT IS ACTIVELY REPRODUCING, NOT A HISTORICAL BACKLOG

⛔ **Two of the four `backlog.md` defects — the `0318` and `0319` rows — were filed on 2026-08-22, the
same day this was found.** The defect is being introduced by current practice, right now, by
producers quoting shell pipelines into row text. That is precisely why the owner's ruling says
*"plus a guard so new rows can't reintroduce them"*: **repairing the six without the guard fixes
nothing durable.**

### ⛔⛔ `dashboard.sh` PASSING IS NOT EVIDENCE THE DEFECT IS ABSENT

**Verified 2026-08-22:** `dashboard.sh` parses all six defective rows correctly and both boards exit
`0`. It splits on the **first four** fields and ignores the rest, so a stray pipe is invisible to it.

⛔ **A run must NEVER cite a passing `dashboard.sh` as evidence that a stray pipe is harmless, or that
a row is clean.** The defect lives in **rendered markdown** — GitHub, an editor preview, any viewer —
which `dashboard.sh` does not exercise at all. A previous producer got this wrong and corrected
itself; the correction is recorded here so the next one does not repeat it.

⚠️ **Likewise, `grep -c '|'` cannot measure this.** It cannot distinguish `\|` from `|`. **The
measurement must strip `\|` first, then count** — and must compare each row against **its own table's
separator width**, because these files contain several tables of differing widths (`backlog.md` alone
has a 4-column `## Status` table and a 3-column addendum table).

## What to build

**Two deliverables, in this order — and they ship TOGETHER.** ⛔ **Owner ruling 2026-08-22 (Q2),
verbatim label "Keep repair + guard together (Recommended)": the repair must NOT land without the
guard.** ⛔ **The implementer may not split this task, and may not ship the repair alone.** The reason
is on the record: **the defect is actively reproducing**, so a repair shipped without the guard is
re-broken by the very next filing. One task, ships once, stays fixed.

⛔ **Both archived boards are IN SCOPE for repair** — owner ruling 2026-08-22 (Q1), verbatim label
**"In scope (Recommended)"**. All **six** rows on **all three** files are repaired in this task.

1. **Re-measure before repairing.** Reproduce the escape-aware, per-table-width count over **every**
   board under `ai-agents/sprints/` and `ai-agents/sprints/done/`. ⛔ **Do not carry this brief's `6`
   forward unverified** — state your own number, and **say this brief was wrong** if it differs.
   Record the command and its output. Authority:
   [`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md).

2. **Repair each defective row by escaping the stray pipe to `\|`.**

   - ⛔ **Escape; do not rewrite, reword, shorten or "clean up" the snippet.** The row text is a
     record. Escaping a pipe changes **zero rendered content** — it restores what the row was always
     meant to say. Anything beyond that is a prose edit this task does not authorise.
   - ⛔ **Prefer escaping over fencing.** The ruling's phrase was *"escape or fence"*; on this board
     the snippets already sit inside backtick code spans and **a backtick span does not protect a
     pipe in a table cell** — that is why these rows are broken despite being in code spans. ⚠️ **Say
     so in the worklog**, because "it's already in backticks" is the intuition that produced the
     defect.
   - ⛔ **Nothing else in any cell changes.** Not the Status cell, not the Priority cell, not the
     Brief-cell href, not one other character of the Task cell.
   - ⛔ **No row is added, removed, moved or renumbered** on any board
     ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
   - ⛔ **Repair BOTH copies of the `0169` row** — `backlog.md` **and** `sprints/done/sprint-2.md`.
     The archived boards **are in scope** (owner ruling 2026-08-22, Q1). They are the same text in
     two places: ⭐ **a stray pipe survives a board move**, so repairing one copy leaves the other in
     circulation.
   - ⛔ **Scope fence on the archived boards, stated plainly:** in scope means **escaping stray bare
     `|` characters only**. ⛔ **No `## Status` value, no rank, no row order, no row count, no prose,
     no link, and no other byte of an archived board may change.**

3. **Build the guard.** A test under `test/`, run by `npm test` (`node --test test/*.test.js`).

   - **Model it on
     [`test/closed-rank-immutability.test.js`](../../../../test/closed-rank-immutability.test.js)** —
     the same category (an invariant over the repo's own `ai-agents/` content, pre-authorised by
     ADR-029) and the same file-set shape (every board under `ai-agents/sprints/` and
     `ai-agents/sprints/done/`, keyed by **basename** so an archival rename stays watched).
   - **The invariant:** every row of a markdown table on a board has **exactly** the field count its
     own table's separator row declares, measured **after** removing `\|` escapes.
   - ⭐ **It must handle multiple tables per file with different widths.** A guard that assumes one
     width per file will false-positive on `backlog.md`'s 3-column addendum table. ⚠️ **Add a fixture
     that would catch that mistake.**
   - **Red-first.** Add a fixture reproducing at least one real defective row (e.g. the `0319` shell
     pipeline) and **show the guard failing on it before the repair lands**. `test/prove-red.sh`
     exists for this and `npm test` runs it.
   - ⚠️ **State the ceiling honestly in the test's header comment**, as
     `closed-rank-immutability.test.js` does: **there is no CI in this repo**, so the guard catches a
     breach only when somebody runs the suite. ⛔ **Do not claim continuous protection.**
   - ⛔ **The guard checks board files only.** It is **not** a general markdown-table linter over the
     whole repo, and it does not touch `dashboard.sh`.

4. **Prove the boards still parse.** Run
   `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` and
   `… ai-agents/sprints/sprint-6.md` against **before-edit captures**. ⚠️ **Both renders must be
   BYTE-IDENTICAL** — escaping a pipe changes nothing `dashboard.sh` reads, so any render difference
   means the repair went further than escaping. ⛔ **Exit 0 is not the test.**

### ⛔ Out of scope

- ⛔ **`claude/skills/fkit-status/dashboard.sh`.** It is not broken — it parses every defective row
  correctly. This task changes **no** parser.
- ⛔ **Any prose, claim, figure or href inside any row.** Escapes only.
- ⛔ **Any `## Status` value, any rank, any row order, any row count, on any board.**
- ⛔ **The two `0171` prose sites on `backlog.md`** — the rows linking `0307` and `0310`. Those are
  [`0321`](../../done/0321-repair-the-two-stale-0171-claims-on-the-live-backlog-board/brief.md)'s, and
  ⭐ **neither is among the 4 defective rows**, so the row sets are disjoint.
- ⛔ **`ai-agents/wiki-vault/`** — `fkit-wiki`'s exclusively
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  If the vault carries the same defect, **flag it to the producer for routing to `fkit-wiki`; do not
  write it here.** ⚠️ **The vault was NOT measured for this defect** — that absence is stated, not
  claimed as a zero.
- ⛔ **Task briefs, ADRs, conventions, reports and every other markdown table in the repo.** This task
  is **boards only**. Whether the same defect exists elsewhere is **unmeasured and deliberately not
  claimed**.
- ⛔ **No task file moved, renamed or reopened** — movers are producer-only
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- ⛔ **No commit, no push.** No secrets in any artifact.

## Verification steps

1. **The worklog records the escape-aware, per-table-width measurement** — command and output — for
   **every** board file, with **before and after** counts, and states its own total rather than
   quoting this brief's `6`.
2. **The worklog states explicitly that a passing `dashboard.sh` is NOT evidence a row is clean**, and
   that the defect is a rendered-markdown one. ⛔ A worklog that cites the dashboard as its pipe
   evidence fails this step.
3. **Every board's defective-row count is `0`** under the re-run measurement.
4. **The repair is escapes only.** `git diff -U0 -- ai-agents/sprints/` shows, on every changed line,
   that the only difference is a `|` becoming `\|`. ⛔ **No other character differs on any row.**
5. **The guard exists, is wired into `npm test`, and goes RED on a fixture reproducing a real
   defective row before the repair lands.** The worklog shows the red run's output, not a description
   of it.
6. **The guard handles more than one table width per file** — shown by a fixture with two tables of
   different widths in one file, which must pass.
7. **The guard's header comment states the no-CI ceiling** in its own words.
8. **`npm test` passes** after the change. ⚠️ Check `package.json` for the entry point rather than
   trusting a remembered one.
9. **Both dashboard renders are byte-identical to their before-edit captures.**
10. **No `## Status` line changed anywhere:** `git diff -U0 | grep -E '^[-+].*## Status'` is empty.
11. **`git status --porcelain` shows changes only at:** the board files repaired, `test/` (the new
    guard and its fixtures), and this task's own folder. ⛔ **Nothing under `claude/`,
    `ai-agents/wiki-vault/`, `ai-agents/knowledge-base/` or `ai-agents/tasks/` beyond this folder.**
    ⚠️ Other workers' pre-existing dirty paths must be **listed and excluded by name**, not waved at.

## Notes

- **Depends on:** nothing.

- ⚠️ **Shares a FILE, but not a ROW, with
  [`0321`](../../done/0321-repair-the-two-stale-0171-claims-on-the-live-backlog-board/brief.md).** Both write
  `ai-agents/sprints/backlog.md`. ⭐ **Their row sets are disjoint** — this task touches the 4
  defective rows, `0321` touches the rows linking `0307` and `0310`, neither of which is defective.
  **Neither gates the other**, but ⛔ **do not run them concurrently against the same working tree
  without re-measuring**; line numbers move.
- ⚠️ **Relates to
  [`0176`](../../done/0176-build-the-coordination-citation-policy-guard/brief.md)** — another guard over
  coordination documents, same owner role. ⭐ **`0176`'s guard would NOT catch this class** (it guards
  citation form, not table shape), and this guard would not catch `0176`'s. **Neither gates the
  other**; ⛔ **do not merge them.**
- ⚠️ **`## Owner` is `fkit-coder`, and that is a scope fact.** The write surface includes a new test
  under `test/` — source. This matches the precedent of `0176` and
  [`0156`](../0156-make-priority-a-required-brief-field-with-a-guard/brief.md), both repair-plus-guard
  tasks owned by `fkit-coder`.
- ⚠️ **This brief decays.** Every figure, line number and fragment above was measured **2026-08-22**
  at `HEAD` = `6f3d9f3` against a **dirty tree** with other workers' uncommitted edits on
  `ai-agents/sprints/backlog.md`, `sprint-6.md` and `sprints/done/sprint-2.md`. ⛔ **Re-measure at
  implementation time; do not quote this brief as evidence.**
- Filed 2026-08-22 by a spawned `fkit-producer` with no owner channel
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
  on the owner's ruling of the same day recorded under `### Authority`. Filed **UNRANKED** to the
  Backlog board; this row **appends** and renumbers nothing
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  **No commit was made.**

### ✅ THE TWO QUESTIONS, ANSWERED

⛔ **These are no longer open.** Both were answered by the owner live via `AskUserQuestion` in an
`fkit lead` session driving `/fkit-sprint-ship-loop` on **2026-08-22**, and relayed to a spawned
producer, which recorded them here on the same day. ⛔ **The implementer implements these answers; it
does not re-open, re-weigh or re-decide either one.** The filing producer's recommendation is
preserved under each answer only as the reasoning the owner endorsed — **not** as a live option.

**Q1 — Are the two archived-board sites (`sprints/done/sprint-2.md`, `sprints/done/sprint-5.md`) in
scope?**

**✅ ANSWERED — verbatim option label: "In scope (Recommended)".**

The question put to the owner, verbatim:

> *"`sprint-2.md` and `sprint-5.md` each carry one stray pipe, on archived boards. The producer
> recorded it in 0322 with the instruction that the implementer must NOT decide it — it's yours."*

The chosen option's description, verbatim:

> *"A stray pipe is neither a frozen claim nor a link — it makes the record DISPLAY something other
> than what it says, and escaping changes zero rendered content. Note: sprint-2.md:210 is the same
> row text as backlog.md:137, carried across when the task moved boards — a stray pipe survives a
> board move."*

**What this means for the implementer.** Both archived boards are **in scope for repair**, not
census-only. The reasoning is **load-bearing and must be carried, not paraphrased away**:

- ⭐ **A stray pipe is neither a frozen claim nor a link** — the two categories that normally protect
  an archived record. The governing rule elsewhere in this project is *a historical record's claims
  are frozen; its links are not*; a stray pipe is **neither**.
- ⭐ It makes the record **display** something **other than what it says**. Escaping it changes
  **zero rendered content** — it **restores** the record rather than editing it.
- ⭐ **`sprint-2.md`'s site and `backlog.md`'s `0169` site are the SAME row text**, carried across
  when the task moved boards. ⭐ **A stray pipe survives a board move.** That is the concrete reason
  repairing only the live board leaves the defect in circulation.

⛔ **Scope fence — state it plainly and hold it.** In scope means **escaping stray bare `|`
characters only**. ⛔ **No `## Status` value, no rank, no row order, no row count, no prose, no link,
and no other byte of an archived board may change.**

**Q2 — Should the repair and the guard be two tasks?**

**✅ ANSWERED — verbatim option label: "Keep repair + guard together (Recommended)".**

The question put to the owner, verbatim:

> *"This is the one that changes what ships. 0322 covers both repairing the 4 stray-pipe rows AND
> adding a guard. On the merits they're independently shippable — but the defect is actively
> reproducing (0318's and 0319's rows, filed today, are two of the four)."*

The chosen option's description, verbatim:

> *"The producer's recommendation, on a ground 0320 lacked: a repair shipped without the guard gets
> re-broken by the very next filing. One task, ships once, stays fixed."*

**What this means for the implementer.** `0322` stays **ONE task**. The repair and the guard **ship
together**. ⛔ **The implementer may NOT split them, and may NOT ship the repair alone.** The reason
is on the record: **the defect is actively reproducing** — the `0318` and `0319` rows were filed the
same day the defect was found — so **a repair without the guard is re-broken by the next filing**.
The ordering dependency is real even though the shippability is independent.

⚠️ Context worth keeping: **this is the same shape of question the owner answered "Split it" to on
[`0320`](../../done/0320-repair-the-four-stale-0171-claims-that-fall-outside-0309s-scope/brief.md) the same
day.** The
opposite answer here is not an inconsistency — it turns on the ground `0320` lacked: **`0320`'s
defect was not reproducing; this one is.**

### Precedent noted the same day — `0320`'s slug stays

⚠️ **Context only. This rules nothing about `0322` and authorises no edit to `0320`.** In the same
session the owner also ruled — **verbatim option label "Leave the slug (Recommended)"** — that
`0320`'s folder slug stays as it is despite its narrowed scope, because renaming it breaks the
Brief-cell href and every inbound citation, and ⭐ **task identity is the `NNNN` prefix, not the
slug**. ⛔ **Acting on that ruling means doing nothing**; it is recorded here only as the standing
precedent for any future "the slug no longer matches the scope" impulse on this task.
