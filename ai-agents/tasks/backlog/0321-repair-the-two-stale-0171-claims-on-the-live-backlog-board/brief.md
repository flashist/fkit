# Repair the two stale `0171` claims on the live Backlog board — one repaired in place, one annotated

## ID
0321

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

### Authority — this task was created by an owner-ruled split

**Owner ruling 2026-08-22**, given via `AskUserQuestion` in an `fkit lead` session driving
`/fkit-sprint-ship-loop` and relayed to a spawned producer — **verbatim option label:
"Split it (Recommended)"**.

The question it answered, verbatim:

> *"Should 0320 split into two tasks? The producer filed it as one because your ruling said 'a
> separate brief' (singular) and a spawned worker doesn't widen a ruling — but it flagged that
> /fkit-task-brief's own independent-shippability test points the other way."*

The chosen option's description, verbatim:

> *"0320 keeps A+B (closed briefs — append-only notes, additions-only proof); a new 0321 takes C+D
> (live board — two different treatments, no additions-only proof available). The producer's own
> stronger read: different repair forms, different proofs, ship in either order. C and D differ from
> EACH OTHER, so one brief risks a run applying one treatment to both."*

**This task is the `0321` that ruling names.** Sites A and B stayed with
[`0320`](../0320-repair-the-four-stale-0171-claims-that-fall-outside-0309s-scope/brief.md), whose
folder slug still reads *"four stale claims"* and is now wider than its scope — ⚠️ **read `0320`'s
`# H1` and its narrowing block, not its slug.**

The upstream ruling that separated these sites from `0309` in the first place — **verbatim option
label: "File a separate brief (Recommended)"**, same session, earlier — is recorded in full under
`0320`'s `### Original authority` section.

### ⛔⛔ THE ONE FAILURE MODE THIS BRIEF EXISTS TO PREVENT

**C and D take DIFFERENT treatments from each other.** That is the owner's stated reason for the
split: *"C and D differ from EACH OTHER, so one brief risks a run applying one treatment to both."*

- **C is REPAIRED IN PLACE.** Its text is a live instruction.
- **D is NOT REWRITTEN — it is ANNOTATED.** Its text is dated testimony that was **true when
  written**.

⛔ **A run that applies one treatment to both sites has failed this task, even if both sites end up
reading correctly.** The distinction is the deliverable.

### Provenance — how the two became stale

[`0171`](../../done/0171-write-the-durable-citation-anchors-convention-page/brief.md) closed
**2026-08-22** (`## Status` reads `✅ Done (agent-closed — not owner-verified)`) and its folder moved
from `ai-agents/tasks/backlog/` to `ai-agents/tasks/done/`. The closing producer repaired **24** hrefs
and **deliberately left prose byte-identical**, so every sentence describing `0171` as open or in
progress survived the close.

### The two sites — re-measured firsthand on disk, 2026-08-22

⚠️ **Dated observation, not a permanent fact.** Measured against a **dirty working tree** at
`HEAD` = `6f3d9f3` (*"Sprint push"*), with other workers holding uncommitted edits on
`ai-agents/sprints/backlog.md` and a live `fkit-wiki` worker writing `ai-agents/wiki-vault/`.
⛔ **Re-measure before acting; do not carry these fragments forward unverified.**

⚠️ **No `path:NNN` coordinate is load-bearing below, deliberately.** A board is a **coordination
document** — row 3 of
[`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md):
*"third parties append **above** your line for reasons unrelated to your sentence; the file grows
under you"*. Each site is anchored by **the row's Brief-cell link plus a quoted fragment**. Line
numbers appear only as dated conveniences and ⛔ **must be re-derived, never trusted.**

| # | Row (anchor: the row whose Brief cell links…) | Quoted fragment | What is stale | Href state |
|---|---|---|---|---|
| **C** | `0307-decide-how-the-derive-cell-reaches-a-corrected-dependency-line` (line `250` on 2026-08-22) | *"(in progress, Sprint 6 P2) does NOT gate this"* | *"(in progress, Sprint 6 P2)"* — a **live, present-tense** pointer aimed at a future implementer | ✅ **Already correct** — repointed to `../tasks/done/0171-…/brief.md` by the closing producer's href pass. **Verified 2026-08-22.** ⛔ Nothing to repair in the link |
| **D** | `0310-gate-the-sprint-ship-loop-on-an-owner-approved-commit-of-implemented-work` (line `253` on 2026-08-22) | *"(still `🔄 In progress`) and filed four briefs with **nothing committed** — **66 dirty paths** … re-derived firsthand at `HEAD` = `9360177` on 2026-08-15"* | the state word only — and ⚠️ **it sits inside an explicitly dated 2026-08-15 reading that was TRUE when written** | ✅ Already repointed, same pass, **verified 2026-08-22** |

**Premise confirmed 2026-08-22: both rows exist, both fragments are present, both claims are stale in
prose, neither is already repaired.**

⚠️ **PREMISE CORRECTION, carried forward deliberately and NOT to be dropped:** the original ruling's
framing implied a **link** repair was outstanding at these sites. **It is not.** Both hrefs were
already fixed inside the closing producer's 24-link sweep. **This task is PROSE-ONLY.** ⛔ **If a run
reports that it repaired a link here, it repaired something that was never broken.**

⚠️ **A third row also mentions `0171` and is NOT in scope.** The row linking `0308-…` (line `251` on
2026-08-22) carries *"does NOT gate this"* about `0171` **without** a stale state parenthetical — its
text reads *"the repair form is already ruled and `0171` only writes it down"*, which is **not
stale**. ⛔ **Do not "repair" it.** A grep for *"does NOT gate this"* returns **three** rows; only two
are sites.

## What to build

1. **Re-verify both sites before touching anything.** For each of C and D: does the row still exist,
   is the quoted fragment still present, and is the claim still stale? ⛔ **If a site has been
   repaired by another run in the meantime, skip it and record that in the worklog — do not re-repair
   it, and do not invent a replacement site.** ⛔ *"Not checked"* is not an outcome. Record the exact
   search commands and their output. ⚠️ **Anchor on the Brief-cell link, not on the line number** —
   other workers are appending rows to this board today. Authority:
   [`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md).

2. **C — the `0307` row: REPAIR IN PLACE. This one is not a note.**

   **Why, justified rather than assumed.** This row is a **live open backlog row**, and the stale
   text is a **pointer aimed at a future implementer** — it tells whoever picks up `0307` what state
   `0171` is in, so that they can judge the *"does NOT gate this"* claim. It is not a dated reading
   and carries no date. `durable-citation-anchors.md` rules exactly this case, in its own words:
   *"A coordinate already known to be wrong is repaired, not annotated."* Annotating a live pointer
   leaves the wrong text still reading as current.

   - **Change ONLY the parenthetical `(in progress, Sprint 6 P2)`.** Replace it with a statement that
     is durable rather than state-shaped: name `0171` as **closed**, with its close date.
   - ⛔ **Do not re-cite a board rank as if it were a state.** `Sprint 6 P2` is board rank on a
     now-closed row and is frozen history there; per
     [`priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md)
     a task's identity is its folder-name `NNNN` prefix and rank is *"never identity"*. ⛔ **The
     replacement text must not contain a rank at all.**
   - ⛔ **Everything else in that cell stays byte-identical** — in particular the verbatim owner-ruling
     label the row records (*"File a follow-up task (Recommended)"*), and the substantive claim
     *"does NOT gate this"*, which is **still true** and must survive unchanged.
   - ⚠️ **State the residual honestly in the worklog:** an in-place repair **destroys** the record that
     the row once read *"in progress"*. That is accepted here because the sentence is instruction, not
     testimony — say so, do not leave it implicit.

3. **D — the `0310` row: DO NOT REWRITE. Append a dated note inside the cell.**

   **Why, and why it differs from C.** This claim sits inside a reading the row itself dates and
   labels — *"re-derived firsthand at `HEAD` = `9360177` on 2026-08-15"*, followed by the row's own
   *"a dated observation against a dirty tree … RE-DERIVE BEFORE ACTING"*. **On 2026-08-15 `0171` WAS
   `🔄 In progress`. The sentence was true when written.** The governing rule the closing producer
   applied is **a historical record's claims are frozen; its links are not** — and the link here is
   already correct. Rewriting *"still `🔄 In progress`"* to *"Done"* would make a dated 2026-08-15
   observation state something false **about 2026-08-15**. ⛔ **That is a corruption of the record, not
   a repair.**

   - **Append a short dated note inside the same cell**, after the dated reading, marked ⚠️: that
     `0171` has since closed (`✅ Done`, 2026-08-22), that the reading above is a **frozen 2026-08-15
     observation left as written**, and — useful to the reader — that its `HEAD` = `9360177` figure is
     itself now historical (`HEAD` had already moved to `6f3d9f3` by 2026-08-22; **re-derive, do not
     quote either**).
   - ⛔ **Not one character of the dated reading changes.**

4. ⛔ **NO UNESCAPED `|` MAY ENTER EITHER CELL.** A bare pipe inside a cell splits the row for any
   markdown renderer. **If the appended text must show a pipe, write it escaped as `\|`** — that is
   the correct, already-used form on this board.

   ⚠️ **Stated precisely, because the looser version that circulated is measurably false and was
   corrected on 2026-08-22:**

   - The board's `## Status` table is **4 columns** (`Status | Priority | Task | Brief`).
     `dashboard.sh` **renders 6** (it appends `Owner` and `derive`). ⛔ **The 6 is the render's width,
     not the source table's** — an earlier count that measured source rows against 6 was measuring the
     wrong baseline.
   - Measured escape-aware on 2026-08-22, this board carries **4 defective rows** holding **5 stray
     unescaped pipes** — not 22 and not 25. **18 further rows carry `\|` escaped pipes, which are the
     CORRECT form and are NOT defects.** An earlier count of `22` was the union of those 18 with these
     4, produced by a method that did not distinguish escaped from unescaped.
   - ⭐ **Neither C's row nor D's row is among the 4 defective rows**, so this task inherits no
     pre-existing pipe defect — but it must not create one.
   - ⛔ **`dashboard.sh` parses the defective rows fine. A passing `dashboard.sh` is NOT evidence that
     a stray pipe is harmless.** The defect is in **rendered markdown**, which the dashboard does not
     exercise.
   - ⚠️ **The pre-existing defective rows belong to
     [`0322`](../0322-escape-the-stray-pipes-in-the-board-rows-and-guard-against-new-ones/brief.md);
     ⛔ do not repair them here.**

5. **Prove the board's shape did not move.** Capture before editing, then re-run:
   `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` and
   `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-6.md`.
   The `sprint-6.md` render must be **byte-identical**. The `backlog.md` render changes **only** in
   the two edited rows' `Task` text — ⛔ **no `derive` line may change, on any row**, and the
   `⟦FACTS⟧` block (`total`, `count done`, `count backlog`, `count moved`) must be **byte-identical**.
   ⚠️ **A pass is not "exit 0".**

### ⛔ Out of scope

- ⛔ **`ai-agents/tasks/done/0261-…` and `ai-agents/tasks/done/0263-…` — sites A and B are
  [`0320`](../0320-repair-the-four-stale-0171-claims-that-fall-outside-0309s-scope/brief.md)'s.** This
  task edits **nothing** under `ai-agents/tasks/done/`.
- ⛔ **The `0308` row**, which mentions `0171` but is **not stale** — see the ⚠️ note above.
- ⛔ **The 4 pre-existing stray-pipe rows** — `0322`'s ground.
- ⛔ **`0309` in every respect.** Owner-ruled intact 2026-08-22. **Its file is not edited by this task
  at all.**
- ⛔ **Any `## Status` value, anywhere** — not on any brief, not in any board row's Status cell. This
  is prose repair inside the `Task` cell only.
- ⛔ **Any rank, any row order, any row count, any Brief-cell href, any `Owner` value on this board.**
  No row added, none removed, none moved, none renumbered
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  **Two `Task` cells change text; the table's shape does not.**
- ⛔ **`ai-agents/sprints/sprint-6.md` and every archived board.** Only `backlog.md` is written.
- ⛔ **No task file moved, renamed or reopened** — movers are producer-only
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- ⛔ **`ai-agents/wiki-vault/`** — `fkit-wiki`'s exclusively
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  If the run concludes the vault carries the same stale claim, **flag it to the producer for routing to
  `fkit-wiki`; do not write it here.**
- ⛔ **`claude/`** — no skill, no `dashboard.sh`, no agent file.
- ⛔ **`0229`** and **`0315`** are **general mechanisms** and are **NOT pre-decided here**; this is two
  named instances. ⛔ **A run that invents a rule, a check, a convention or a tooling change has
  exceeded this brief.**
- ⛔ **No commit, no push.** No secrets in any artifact.

## Verification steps

1. **The worklog carries a two-row premise table**, one row per site C and D, each stating *exists /
   stale / already repaired* with the **command and its output** that established it, and each
   anchored on the row's **Brief-cell link** rather than a line number.
2. **The worklog states, in its own words, that C and D received DIFFERENT treatments**, and shows
   which. ⛔ A worklog that describes one treatment fails this step even if both rows read correctly.
3. **C changed only its parenthetical.** The worklog quotes the row's before and after text, and shows
   that the verbatim owner-ruling label in that cell and the phrase *"does NOT gate this"* are
   unchanged. The replacement text contains **no board rank**:
   `git diff -U0 -- ai-agents/sprints/backlog.md | grep '^+' | grep -E 'Sprint [0-9]+ P[0-9]+'` →
   **no output**.
4. **D's dated reading is byte-identical.** The substring *"still `🔄 In progress`"* is **still present
   verbatim** in the `0310` row after the edit, and the row gained an appended ⚠️ dated note:
   `grep -c 'still `🔄 In progress`' ai-agents/sprints/backlog.md` is **unchanged** from before the run.
5. **No unescaped pipe was introduced.** Re-run the escape-aware field count over the whole board and
   show that the defective-row set is **exactly the same 4 rows as before the run** — no fifth row, and
   neither edited row among them. ⛔ **A raw `grep -c '|'` does not establish this** — it cannot tell
   `\|` from `|`.
6. **Exactly two row lines changed.** `git diff -U0 -- ai-agents/sprints/backlog.md` touches **exactly
   two** row lines, both in the `Task` cell, measured against a **before-edit snapshot** (another
   worker's uncommitted edits already sit on this file, so a diff against `HEAD` will show more and
   that is **not** this run's).
7. **The board's shape is untouched.** The board's total row count is unchanged, and **every** row's
   Status cell, Priority cell and Brief-cell href is unchanged.
8. **No `## Status` line changed anywhere:** `git diff -U0 | grep -E '^[-+].*## Status'` is empty.
9. **`0309`, `0320`, `0261` and `0263` are byte-identical to their pre-run state**, each compared
   against a before-edit snapshot.
10. **`git status --porcelain` shows changes only at:** `ai-agents/sprints/backlog.md` and this task's
    own folder. ⛔ **Nothing under `claude/`, `ai-agents/tasks/done/`, `ai-agents/wiki-vault/`,
    `ai-agents/knowledge-base/` or `test/`.** ⚠️ Other workers' pre-existing dirty paths must be
    **listed and excluded by name**, not waved at.
11. **The dashboard renders behave as step 5 of `## What to build` requires** — `sprint-6.md`
    byte-identical, `backlog.md` differing only in the two edited rows' `Task` text, **every `derive`
    line unchanged**, and the `⟦FACTS⟧` block byte-identical.

## Notes

- **Depends on:** nothing.

  This task is independently shippable today: both rows exist, both are stale, and no other task is
  authorised to touch either.

- **Relates to, with no ordering in either direction:**
  [`0320`](../0320-repair-the-four-stale-0171-claims-that-fall-outside-0309s-scope/brief.md) — its
  sibling from the same 2026-08-22 split, carrying sites A and B in `ai-agents/tasks/done/`. ⭐ **The
  two have NO file in common**: `0320` writes only under `ai-agents/tasks/done/`, this task writes only
  `ai-agents/sprints/backlog.md`. They may run in either order or concurrently, and **neither gates the
  other.**
- ⚠️ **Shares a FILE, but not a ROW, with
  [`0322`](../0322-escape-the-stray-pipes-in-the-board-rows-and-guard-against-new-ones/brief.md).** Both
  write `ai-agents/sprints/backlog.md`. ⭐ **Their row sets are disjoint** — `0322` touches the 4
  defective rows, this task touches C's and D's rows, and neither of those is defective. **Neither
  gates the other**, but ⛔ **do not run them concurrently against the same working tree without
  re-measuring**; a concurrent run must re-derive its rows rather than trust a captured line number.
  ⚠️ If `0322` ships a guard first, this task's edits must pass it — which they will, since neither
  adds a pipe.
- **Relates to, without any ordering between them:**
  [`0309`](../0309-repair-the-hyphenated-task-nn-citation-class-in-four-open-briefs/brief.md) — scopes
  are disjoint by owner ruling.
- **Related and deliberately NOT pre-decided:**
  [`0229`](../0229-widen-task-done-to-repair-a-brief-that-contradicts-a-landed-close/brief.md) and
  [`0315`](../0315-define-the-corrections-header-warning-equivalent-for-briefs-and-board-rows/brief.md).
  Both are **general mechanisms**; this is **two named instances**. ⛔ This task adds no rule, no check
  and no convention.
- ⚠️ **Filed UNRANKED by a SPAWNED producer with no owner channel** (`AskUserQuestion` is absent in a
  consult —
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  This row **appends** to the Backlog board and renumbers nothing; a mid-board insertion is not the
  owner-ruled re-rank exception
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  The Backlog board is unranked by design, so **no merit position is stated.**
- ⚠️ **`## Owner` is `fkit-producer`, and that is a scope fact, not a preference.** The write surface is
  a sprint board — a planning artifact. No source file changes; there is nothing for `fkit-coder` to
  build. This mirrors `0318` and `0320`, the same shape of task, filed the same day.
- ⚠️ **This brief decays.** Every fragment, path, line number and figure above was measured
  **2026-08-22** against a **dirty tree** at `HEAD` = `6f3d9f3`, with uncommitted edits from other
  workers on the target file. ⛔ **Re-measure at implementation time; do not quote this brief as
  evidence.**
- Filed 2026-08-22 by a spawned `fkit-producer` with no owner channel, on the owner's split ruling of
  the same day recorded under `### Authority`. **No commit was made** — the new files and the board row
  are left in the working tree.
