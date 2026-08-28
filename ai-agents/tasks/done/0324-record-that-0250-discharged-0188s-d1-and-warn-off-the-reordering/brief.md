# Record that `0250` discharged `0188`'s D1 — a dated correction note on the brief and its board cell, warning off the reordering

## ID
0324

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-producer

## Context

### Authority

**Owner ruling 2026-08-23**, given live via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop` and relayed to a spawned `fkit-producer` — **verbatim option label:
"File the producer follow-up (Recommended)"**.

The question it answered, verbatim:

> *"R1 (medium): 0250 silently discharges 0188's D1 — the identical defect — while three live records
> still assert D1 as open. Concrete regression risk: D1 says repair against `skills_for_role()`, whose
> order puts `/fkit-task-brief` second, so a later 0188 run could 'repair' by reordering the row and
> undo 0250's deliberate ordering. The remedy is producer-side; 0250's diff is fenced at 'the R10 line
> only'."*

The chosen option's description, verbatim:

> *"The reviewer's recommendation. A dated correction on 0188's D1 (brief `:54`, verification step
> `:138`) and its `sprint-6.md:241` board cell, recording D1 as discharged by 0250 and warning off the
> reordering. This is the false-live-claim class this repo repeatedly files against."*

### Provenance

Finding **R1** of `0250`'s Round-1 stateful review, recorded in the ledger
[`review.md`](../0250-fix-the-scaffold-producer-row-fkit-task-brief-omission/review.md) inside
[`0250`](../0250-fix-the-scaffold-producer-row-fkit-task-brief-omission/brief.md)'s folder.
Severity **medium**, classified **Defect (record), outside the change surface**. Raised by the
`fkit-reviewer`'s **own** pass; **Codex missed it**, on a review where Codex coverage was **FULL**.

⚠️ **That ledger is not this task's to edit** — see `### ⛔ Out of scope`.

### ⛔⛔ THE ONE FAILURE MODE THIS TASK EXISTS TO PREVENT

`0188`'s **D1** tells a future implementer to *"Repair against `skills_for_role()` as it reads at
implementation time"*. That instruction, followed today, produces a **reordering** of a row that
`0250` deliberately ordered the other way — because the two carriers disagree on order:

| Carrier | Producer-skill order as measured 2026-08-23 | Position of `/fkit-task-brief` |
|---|---|---|
| `claude/skills-for-role.sh`, the `producer)` branch | initiate-project, **task-brief**, task-done, task-cancelled, status, heal | **second** |
| `claude/scaffold/CLAUDE.md`, the producer row | initiate-project, status, **task-brief**, task-done, task-cancelled, heal | **third** |
| `claude/skills/fkit-team/SKILL.md`, the producer row | initiate-project, status, **task-brief**, task-done, task-cancelled, heal | **third** |

`0250` inserted `/fkit-task-brief` **after `/fkit-status`**, not second. That was a recorded,
reasoned choice — `0250`'s plan §1d, *"⚠️ A brief claim that is imprecise — corrected here, not
planned around"* — resolved on three grounds, quoted from it:

> *"Resolution — insert after `/fkit-status`. This (a) satisfies the brief's explicit positional
> constraint literally (it lands between `/fkit-initiate-project` and `/fkit-task-done`), (b) makes the
> scaffold row **character-for-character identical in ordering** to its nearest twin
> `fkit-team/SKILL.md:54`, and (c) is a **pure single insertion** — no reordering."*

and, in the same section:

> *"Deliberately NOT reordering the row to canonical order. That would be a second content change to a
> file the brief fences at 'the R10 line only', and it would gratuitously desynchronise the scaffold
> from `fkit-team/SKILL.md`."*

⛔ **So a later `0188` run that reads D1 as still-open, and "repairs" it against `skills_for_role()`
order, would (a) undo a deliberate choice, (b) re-break the scaffold-to-`fkit-team` twin match, and
(c) report success while doing it.** The character-for-character twin match was **verified firsthand
2026-08-23**: both rows carry the identical string
`` `/fkit-initiate-project`, `/fkit-status`, `/fkit-task-brief`, `/fkit-task-done`, `/fkit-task-cancelled`, `/fkit-heal` ``.

**And the reorder would be pointless as well as harmful.** On **2026-08-23** the owner ruled, live in
the same session — **verbatim option label: "Accept — order is not normative (Recommended)"** — that
the list order carries no meaning, Codex having verified explicitly that **no consumer parses it**.

> ⚠️ **Honest limit on that second ruling.** It was **relayed to the filing producer, and was not yet
> written to any file on disk at filing time** (a `grep -rn "order is not normative" ai-agents/ claude/`
> on 2026-08-23 returned only `0250`'s own plan/worklog *proposing* such a declaration, not the ruling).
> ⛔ **Re-verify it before quoting it as landed.** It strengthens the case; it is not the case. The
> regression risk stands on the plan §1d record alone.

### The three sites — re-measured firsthand on disk 2026-08-23

⚠️ **Dated observation, not a permanent fact.** Measured at `HEAD` = `05fd9d0` against a **dirty
working tree**, with a concurrent `fkit-coder` holding uncommitted edits on `0250`'s folder and on
`claude/`, and the ship-loop driver holding uncommitted in-progress markings on
`ai-agents/sprints/sprint-6.md`.

⚠️ **Only site 3's anchor is categorically forbidden a line number; all three are anchored on quoted
fragments anyway.** A sprint board is a **coordination document** — row 3 of
[`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md) rules
`path:NNN` **wrong** there, because *"third parties append above your line for reasons unrelated to
your sentence; the file grows under you"*. The line numbers below are **dated conveniences**;
⛔ **re-derive every one, trust none.**

| # | Target | Anchor — heading plus quoted fragment | Line on 2026-08-23 | Still asserts D1 as open? |
|---|---|---|---|---|
| **1** | [`0188`](../0188-repair-the-five-live-ownership-fact-defects/brief.md) `brief.md`, under `## What to build` | the sub-heading *"### D1 — `claude/scaffold/CLAUDE.md`: the producer's row omits `/fkit-task-brief`"* and its body *"The role table's producer row lists … `skills_for_role(producer)` … **also includes `fkit-task-brief`**"* | `:54` | ✅ **yes — verified present, and now false** |
| **2** | the same file, under `## Verification steps` | step 1, *"**D1** — the producer row in `claude/scaffold/CLAUDE.md` lists exactly the skills `skills_for_role(producer)` returns, compared **against the live function output**"* | `:138` | ✅ **yes — verified present; it now passes with no work done** |
| **3** | [`sprint-6.md`](../../../sprints/sprint-6.md), the `## Status` row whose Brief cell links `0188-repair-the-five-live-ownership-fact-defects` | *"**D1** `claude/scaffold/CLAUDE.md`'s producer row omits `/fkit-task-brief` — a **declared mirror that ships into every consuming project's root `CLAUDE.md`**"* | `:241` | ✅ **yes — verified present, and now false** |

**Premise confirmed 2026-08-23:** all three coordinates resolve, all three fragments are present, all
three still assert D1 as an open defect, and **neither brief cross-references the other** —
`grep -rn 0250` inside `0188`'s folder returns **nothing**, and the only `0188` hit inside `0250`'s
folder is the review ledger's own R1 row.

⚠️ **`0188`'s `brief.md` was CLEAN in git at filing time; `sprint-6.md` was DIRTY.** That asymmetry
decides which proof shape is available at which site — see `## What to build` step 5.

## What to build

1. **Re-verify the premise before touching anything.** For each of the three sites: does the anchor
   still resolve, is the quoted fragment still present, is the claim still stale, and has another run
   already corrected it? ⛔ **If a site is already corrected, skip it, record that, and do not
   re-correct or invent a replacement site.** ⛔ *"Not checked"* is not an outcome — record the exact
   commands and their output
   ([`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md)).
   **Also re-verify the discharge itself:** that `claude/scaffold/CLAUDE.md`'s producer row now
   contains `/fkit-task-brief`, and that its ordering is still character-for-character identical to
   `claude/skills/fkit-team/SKILL.md`'s producer row. ⛔ **If `0250`'s edit is not present, STOP — the
   correction would be false.**

2. **Use the dated correction-note form, not a rewrite.** The form is
   [`claude/skills/fkit-record-decision/SKILL.md`](../../../../claude/skills/fkit-record-decision/SKILL.md),
   section **"Correcting an accepted ADR — the dated correction note"**, as shipped by `0198`. The
   binding parts here:
   - **The corrected text stays byte-identical.** The note is **appended next to** the claim, never
     written over it.
   - **The note goes BELOW the claim**, per the form's *"Placement — below the claim, deliberately"*.
   - **Indentation matches the block the note sits under** — the form's *"Indentation follows the claim
     it annotates"*. D1's heading body is top-level prose (column 0); verification step 1 is a numbered
     list item and takes that item's continuation indent.

3. **The marker is ⚠️, at all three sites. It is NOT ⛔.** The form's legend admits exactly two markers
   and **no third**: ⚠️ = *a fact that drifted (the decision is untouched)*; ⛔ = *a decision that was
   overturned (do not follow it)*. D1's claim is **a fact that drifted** — the row no longer omits the
   skill. **No decision was overturned; a defect was discharged.** ⛔ **Marking this ⛔ would tell every
   reader that a standing decision must not be followed, which is false.** The *"do not reorder"*
   warning is **content inside the ⚠️ note**, not a licence for a second marker.

4. **What each note must say.** All three notes carry the same four facts; sites 1 and 3 get the full
   text, site 2 may be shorter but must still carry fact (c):
   - **(a) D1 is discharged** — by `0250` (name it by folder ID, per row 4 of
     `durable-citation-anchors.md`), with the date, and the note's own measurement date.
   - **(b) The remaining four defects are untouched.** ⛔ **D1 is one of five. Discharging it does not
     discharge `0188`**, which stays `🔲 Backlog` with D2–D5 live — and, per the review ledger's own
     sequencing note, **D2 still edits `claude/scaffold/CLAUDE.md`, so `0188` remains a manifest-regen
     task.**
   - **(c) ⛔ THE REORDERING WARNING — the load-bearing sentence, and the one a summariser will drop.**
     It must state, in the note itself and not by reference: that D1's *"repair against
     `skills_for_role()`"* instruction is **discharged and must not be executed**; that
     `skills_for_role()` puts `/fkit-task-brief` **second** while the scaffold row deliberately puts it
     **third, after `/fkit-status`**; that this was `0250`'s reasoned choice (plan §1d) and makes the
     scaffold row **character-for-character identical to `claude/skills/fkit-team/SKILL.md`'s producer
     row**; and that **reordering the row would undo that and re-break the twin match**. ⛔ **A note
     that records the discharge but not the reordering warning has failed this task**, even though it
     is factually true.
   - **(d) A pointer to this task** (`0324`) as the correction's authority, and to the owner ruling's
     date and verbatim label.

5. **Proof shapes differ by site, and only one of them is additions-only. Say which you used.**
   - **Sites 1 and 2 (`0188/brief.md`) — additions-only proof IS available.** Run the form's exact
     pair: `git diff --numstat -- <file>` → expect `N  0  <file>`, and
     `git diff -U0 -- <file> | grep '^-' | grep -v '^---'` → expect **no output**. ⚠️ **Use that
     deletion filter exactly** — the shorter `grep '^-[^-]'` is wrong and misses deleted list lines.
     ⚠️ **The file was clean at filing time but may not be at implementation time**; if anything else
     has appended to it uncommitted, **snapshot before editing** and also run
     `git diff --no-index --numstat <snapshot> <file>` and `diff <snapshot> <file> | grep '^<'`.
   - **Site 3 (`sprint-6.md`) — additions-only proof is NOT available, and this is expected, not a
     failure.** A board row is one physical line, so appending inside its `Task` cell **modifies** that
     line and the diff necessarily shows `-old +new`. ⛔ **Do not chase a `+N/−0` here, and do not
     restructure the row to manufacture one.** Prove it instead by **prefix preservation**: capture the
     row's exact pre-edit text from a **before-edit snapshot**, and show the post-edit cell still
     contains that text **byte-identically, as a prefix**, with the note appended after it. ⚠️ The file
     is already dirty from another worker, so a diff against `HEAD` will show changes that are **not
     this run's** — measure against the snapshot and name the excluded paths.

6. ⛔ **NO UNESCAPED `|` MAY ENTER THE BOARD CELL.** A bare pipe splits the row for any markdown
   renderer. If the appended text must show one, write it escaped as `\|`.
   ⚠️ **A passing `dashboard.sh` is NOT evidence of correctness here** — it parses the already-defective
   rows fine; the defect is in **rendered markdown**, which the dashboard does not exercise. The board's
   pre-existing stray-pipe rows belong to
   [`0322`](../../backlog/0322-escape-the-stray-pipes-in-the-board-rows-and-guard-against-new-ones/brief.md);
   ⛔ **do not repair them here.**

7. **Prove the boards' shape did not move.** Snapshot the renders first, then re-run
   `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-6.md` and
   `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md`. Both exit **0**; the
   `backlog.md` render is **byte-identical**; the `sprint-6.md` render differs **only** in the `0188`
   row's `Task` text. ⛔ **No `derive` line may change, on any row** — including `0188`'s own.
   ⚠️ **A pass is not "exit 0".**

   ⛔ **Do not let a quoted bold dependency label into any cell you write.** A producer once quoted one
   verbatim and `dashboard.sh` parsed the quotation as that task's own dependency — the `task-84`
   misreport class
   ([`dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md)).

8. **Record the reader-warning gap as an ACCEPTED GAP — do not hide it, and do not close it here.**
   The form's part 3 is a header `- **Corrections:**` metadata bullet, and it is what justifies
   below-placement: *"the reader is already warned first by the header bullet, so below-placement costs
   no warning."* **A task brief and a board row have no such header, and no equivalent has been
   defined** — that is
   [`0315`](../../backlog/0315-define-the-corrections-header-warning-equivalent-for-briefs-and-board-rows/brief.md)'s
   open question. ⛔ **Do not invent one, and do not pre-decide `0315`.** Follow the precedent set by
   `0318` and `0320`: **omit the header bullet, and state the resulting gap plainly in the worklog** —
   a reader who stops at the claim gets no warning.

   ⚠️ **The gap bites harder here than at those precedents, and the worklog must say so.** At `0318`
   and `0320` the corrected text was **testimony**; here D1 is a **live instruction to act**, so a
   reader who never reaches the note does not merely believe something stale — they **execute the
   reordering**. **Mitigation within the form:** place each note **immediately** below its claim, with
   no intervening prose, and open it with the discharge sentence. ⛔ **That is a mitigation, not a fix;
   record it as an accepted gap belonging to `0315`, not as solved.**

### ⛔ Out of scope

- ⛔ **`0188` is NOT reopened, re-statused, re-ranked, moved, or renamed.** It stays `🔲 Backlog` at
  **P14** on Sprint 6 with D2–D5 intact. **No `## Status` value changes anywhere**, on any brief or in
  any board Status cell. Movers are producer-only and are not invoked
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- ⛔ **`0250` in every respect** — its diff, `brief.md`, `plan.md`, `worklog.md`, and **especially
  `review.md`**, which a concurrent `fkit-coder` writes. **This task opens none of them for writing.**
- ⛔ **`claude/` — no source, no skill, no scaffold, no manifest, no `dashboard.sh`, no agent file.**
  In particular ⛔ **`claude/scaffold/CLAUDE.md` is not touched.** This task records what `0250` did; it
  does not redo, extend, or adjust it.
- ⛔ **The producer-row ordering itself is NOT changed, unified, or re-litigated** at any of the five
  carriers. The two coexisting orderings are `0250`'s deferred Q1, settled for now by the owner's
  *"order is not normative"* ruling. **This task writes a warning, not a convention.**
- ⛔ **No rank, no row order, no row count, no Brief-cell href, no `Owner` cell.** No row added to
  `sprint-6.md`, none removed, none moved, none renumbered
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  ⚠️ **The driver's `🔄 In progress` marking on `0250`'s P9 row is left exactly as found.**
- ⛔ **`ai-agents/sprints/backlog.md`** — beyond this task's own row, already filed.
- ⛔ **`0315`, `0322` and `0229` are general mechanisms and are NOT pre-decided here.** ⛔ A run that
  invents a rule, a check, a convention or a tooling change has exceeded this brief.
- ⛔ **`ai-agents/wiki-vault/`** — `fkit-wiki`'s exclusively
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  If the vault carries the same stale D1 claim, **flag it to the producer for routing to `fkit-wiki`;
  do not write it.**
- ⛔ **No commit, no push. No secrets in any artifact.**

## Verification steps

1. **The worklog carries a four-row premise table** — sites 1, 2, 3 plus the discharge re-check — each
   row stating *resolves / fragment present / still stale / already corrected?* with **the command and
   its output** that established it, each anchored on a **quoted fragment**, and site 3 anchored on the
   row's **Brief-cell link** rather than a line number.
2. **Every one of the three notes contains the reordering warning.** Show it: a grep over the three
   edited regions returns, for each, text naming both **`skills_for_role()` order (`/fkit-task-brief`
   second)** and **the scaffold's deliberate third position after `/fkit-status`**, plus an explicit
   instruction not to reorder. ⛔ **A run that produces three notes recording only the discharge has
   failed, however true they are.**
3. **Every note is marked ⚠️ and none is marked ⛔.** State in the worklog why: a drifted fact, not an
   overturned decision.
4. **Sites 1 and 2 are additions-only.** `git diff --numstat -- ai-agents/tasks/backlog/0188-…/brief.md`
   → `N  0`, and `git diff -U0 -- <that file> | grep '^-' | grep -v '^---'` → **no output**. The two
   quoted fragments (site 1's D1 heading, site 2's verification-step-1 text) are **still present
   verbatim** after the edit.
5. **Site 3 preserves its cell prefix byte-identically.** The `0188` row's pre-edit `Task` cell text,
   taken from a before-edit snapshot, is still present as a **byte-identical prefix** of the post-edit
   cell. ⚠️ **State plainly that additions-only proof was unavailable at this site and why** — a run
   that claims `+N/−0` on `sprint-6.md` has measured something else.
6. **Exactly one row line changed in `sprint-6.md`**, measured against a before-edit snapshot, and it
   is the `0188` row. ⛔ **`0250`'s P9 row is byte-identical**, `🔄 In progress` marking included.
7. **No `## Status` line changed anywhere:** `git diff -U0 | grep -E '^[-+].*## Status'` is **empty**.
8. **No unescaped pipe was introduced.** Re-run an **escape-aware** field count over `sprint-6.md` and
   show the defective-row set is **exactly the same as before the run**, with the edited row not among
   it. ⛔ **A raw `grep -c '|'` does not establish this** — it cannot tell `\|` from `|`.
9. **Both dashboards behave as `## What to build` step 7 requires** — exit 0, `backlog.md` render
   byte-identical, `sprint-6.md` render differing only in the `0188` row's `Task` text, **every
   `derive` line unchanged on every row**, and the `⟦FACTS⟧` block byte-identical.
10. **The worklog states the `0315` reader-warning gap as an accepted gap**, names `0318`/`0320` as the
    precedent, and states the **elevated** severity here (a live instruction, not testimony) plus the
    placement mitigation used.
11. **`git status --porcelain` shows changes only at** `ai-agents/sprints/sprint-6.md`,
    `ai-agents/tasks/backlog/0188-…/brief.md`, and this task's own folder. ⛔ **Nothing under
    `claude/`, `ai-agents/wiki-vault/`, `ai-agents/knowledge-base/`, `test/`, or `0250`'s folder.**
    ⚠️ Other workers' pre-existing dirty paths are **listed and excluded by name**, not waved at.
12. **The four remaining defects are demonstrably untouched:** `0188`'s D2–D5 sections, its `## Status`,
    its `## Priority`, and its P14 board rank are all byte-identical to their pre-run state.

## Notes

- **Depends on:** `0250` — its scaffold-row edit is this correction's premise; do not run before that
  edit has landed.

- **Blocks:** `0188` — practically, not mechanically. Nothing enforces the order, but if `0188` runs
  first it reads D1 as open and may execute the reordering this task exists to prevent. ⚠️ **Both live
  on Sprint 6 (`0250` at P9, `0188` at P14), so the window is real and inside one sprint.**

- ⚠️ **This task carries the sequencing risk it was created to remove, and that is NOT resolved by
  filing it.** It is filed **unranked on the Backlog board** while `0188` sits **scheduled on Sprint 6**
  — so on the boards as they stand, `0188` can run first. **Pulling this task into Sprint 6 ahead of
  `0188` is an owner decision** (a rank is the owner's to grant, and a spawned producer never re-ranks
  —
  [ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  ⛔ **Flagged, not solved.**

- ⚠️ **`## Owner` is `fkit-producer`, and that is a scope fact, not a preference.** The write surface is
  a task brief and a sprint board — planning artifacts. **No source file changes**, so there is nothing
  for `fkit-coder` to build. Same shape as `0318`, `0320` and `0321`.

- ⚠️ **Filed UNRANKED by a SPAWNED producer with no owner channel** (`AskUserQuestion` is absent in a
  consult —
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  This row **appends** to the Backlog board and renumbers nothing. The Backlog board is unranked by
  design, so **no merit position is stated**.

- ⚠️ **This brief decays.** Every fragment, path, line number and hash above was measured **2026-08-23**
  at `HEAD` = `05fd9d0` against a **dirty tree**, with uncommitted edits from a concurrent `fkit-coder`
  and the ship-loop driver on files this task reads. ⛔ **Re-measure at implementation time; do not quote
  this brief as evidence.**

- Filed 2026-08-23 by a spawned `fkit-producer` with no owner channel, on the owner ruling recorded
  under `### Authority`. **No commit was made** — the new file and the board row are left in the working
  tree.
