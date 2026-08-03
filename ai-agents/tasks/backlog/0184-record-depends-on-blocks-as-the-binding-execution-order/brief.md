# Record `Depends on` / `Blocks` as the binding execution order, and record the discharged `0173` ordering

## ID
0184

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## ⚠️ RE-SCOPED 2026-08-03 by OWNER RULING — read this before anything below

**The owner ruled, live, on 2026-08-03: *"Re-scope it to the surviving half."*** This brief was
originally written on 2026-08-01, when `0173` was open. **`0173` closed on 2026-08-03**
(`✅ Done (agent-closed — not owner-verified)`), and that close spent the brief's primary purpose.

**What died — do not look for it below:**

- **The sequencing motive.** The whole point of declaring `0154` and `0165` as depending on `0173` was
  to make `0173` land **first**, because promoting its board row was illegal (five closed rows between
  it and `0154`). **`0173` landed first anyway, at its append rank, with both dependents still open.**
  The ordering the declaration was meant to enforce **held without the declaration**. There is nothing
  left to enforce.
- **The live board-honesty defect.** The original brief said *"the board is currently lying about two
  rows"* — reporting `0154` and `0165` as pullable while `0173` declared them blocked. **That is no
  longer true.** `0173` is `✅ Done`; `0154` and `0165` genuinely are pullable today; the board is
  telling the truth. **The close discharged the defect, not this task.**

**What survives, and is the whole of this brief now:**

1. **The general ruling** — live, and completely unaffected by `0173` closing. Record it.
2. **The historical record of the ordering** — the two halves of the declaration still disagree on
   disk, and the disagreement is now *history*, not a live board defect. Record it in the shape the
   `0149` precedent sets: **annotate, never delete**.
3. **Discharging the sprint-2 addendum's promotion flag** — live, and the discharge is now *stronger*
   than the original brief could claim.

**Which part is live and which is historical record — stated plainly, because the answer changed:**

| Deliverable | Status today |
|---|---|
| Record the three-carrier ruling on the convention page | **Live.** A standing rule for all future work. Nothing about it depended on `0173`. |
| Discharge the sprint-2 promotion flag | **Live.** A question is still standing on the board that nobody needs to answer. |
| Repair the `0154` / `0165` ↔ `0173` asymmetry | **Historical record only.** No board is misreporting because of it. Its value is that the record of what happened stays accurate and the ruling above has a real specimen to point at. |

## Context

**This is follow-up 7 of task `0174`'s decision report**
([the 2026-08-01 merit-ordering report](../../../knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md),
§3.7, §6 and §8). Report §8 ranked it *"soon — `0173`'s flag is live and marked urgent."* **That
urgency is spent.** `0173` shipped; nothing here is urgent any more.

### The ruling this discharges — unchanged, and still the point

Report §3.7 **ruled IN** — a candidate the brief's list did not contain — that where execution order
actually **matters**, the ordering belongs in the briefs' `Depends on` / `Blocks` declarations, **not**
in board rank, and the declaration is **binding** where board reading order contradicts it:

| Carrier | Carries | Binding? |
|---|---|---|
| Board rank `P<n>` | reading order — what to pick up next | yes, for picking work |
| `On merit` statement | the owner's preference the rank cannot express | **no — advisory** |
| `Depends on` / `Blocks` | correctness order — what must land first | **yes, and it outranks reading order** |

This is not new authority — the sprint-2 filing addendum already says *"The `Depends on` / `Blocks`
declarations in the briefs are the binding record."* The report **rules** it, so it stops being one
addendum's opinion.

### The asymmetry — re-verified on disk 2026-08-03, and re-characterised

| Brief | Where it lives now | Declares |
|---|---|---|
| `0173` | `ai-agents/tasks/done/` | `- **Blocks:** 0154, 0165.` |
| `0154` | `ai-agents/tasks/backlog/` | `- **Depends on:** nothing hard.` (plus a soft-follow on `0153`) |
| `0165` | `ai-agents/tasks/backlog/` | `- **Depends on:** nothing.` |

The two halves still disagree. **What changed is what the disagreement costs.**

- **On 2026-08-01 it cost board honesty.** `dashboard.sh` derives each open task's Next step from the
  **`Depends on`** side, so two blocked rows rendered as pullable.
- **On 2026-08-03 it costs nothing operational.** `0173` is closed; `ready` is the correct answer for
  both rows; the board is right.

### ⚠️ The naive repair would now CREATE a defect, in the opposite direction

**This is the single most important thing in this brief.** `dashboard.sh` does **not** interpret the
dependency — it hands `/fkit-status` the **raw text** it read and lets the reading agent map it. The
skill's own documented mapping turns a named task in that raw text into **`after <N>`**.

**So writing a bare `- **Depends on:** 0173 …` into `0154` and `0165` today would flip two rows that
currently render the TRUE answer `ready` into the FALSE answer `after 0173` — for a task that is
already `✅ Done`.** The original brief's instruction, executed literally, now manufactures the very
class of misreport it was written to remove.

**The repair must therefore be shaped as a discharged-dependency annotation, not a live declaration.**
That shape already has a precedent and an owner-visible rationale in this project: task **`0149`**
(*record that `0118`'s block on `0117` was discharged by another route*) rules exactly this — *"record
that the block was discharged by another route — do not delete the line"*, and *"put the correction in
a **separate** bullet or a trailing dated sentence, not inside the label."* Follow `0149`.

### Two claims in the 2026-08-01 brief were STALE — corrected here, not preserved

The re-scope instruction asked for the original constraints to be preserved. **Two could not be, because
disk contradicts them.** Both are recorded rather than silently dropped:

1. **⛔ STALE: *"`dependency-declaration-form.md` is NOT in `claude/scaffold/` today — a `0132` drift
   item; do not create the scaffold copy."*** **False as of 2026-08-03.** Task `0132` **closed** and
   **shipped the page to the scaffold**. It is registered in the dual-home parity exception list as
   `kind: 'audience-adapted'` — shipped **generalized, deliberately not byte-identical**, by owner
   ruling 2026-08-01 (the scaffold copy keeps the canonical form, examples, rules and guard behaviour,
   and drops every fkit-specific task/review reference and the relative links into `tasks/`).
   **Consequence: the gap note is deleted and replaced by a live dual-home obligation** — see "What to
   build" item 2. The page is now dual-homed, so an edit to one home is an ADR-027 question about the
   other.
2. **Stale, but harmless: `0154`'s soft-follow on `0153`.** `0153` has **closed**, so that soft-follow
   is itself discharged. **Preserve the text** — it is history and the original instruction to preserve
   it stands — but do **not** treat it as a live constraint on ordering.

## What to build

Documentation only — brief annotations and one convention statement. **No code, no re-ranking, no
promotion, no status-cell change.**

1. **Record the ruling** that `Depends on` / `Blocks` is the binding execution order where board
   reading order contradicts it — the §3.7 three-carrier table above — in
   [`conventions/dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md).
   That is where a reader of the declaration form will look. **This is the live half of the task; do
   it first.**
2. **Decide and execute the dual-home question for that page** (replaces the deleted `0132` gap note).
   The page is dual-homed: live at `ai-agents/knowledge-base/conventions/` and in the scaffold at
   `claude/scaffold/ai-agents/knowledge-base/conventions/`, under an `audience-adapted` parity
   exception.
   **Producer's scoping call, made here and stated so it is not re-litigated: the three-carrier ruling
   is a GENERAL convention, not fkit history — so it belongs in BOTH homes**, written fkit-generically
   in the scaffold copy (no task IDs, no report reference, no relative link into `tasks/`), matching
   how that copy already treats the rest of the page. If the parity-exception entry's `reason` text
   needs a sentence to keep describing the two copies accurately, **update the reason text** — do not
   change the exception's `kind`, and do not remove the entry.
   **⚠️ Run the dual-home parity test after this edit.** An `audience-adapted` exception is not a
   licence to diverge freely, and this is the first edit to the page since the exception was recorded.
3. **Record the ordering as honoured and discharged — historical record, `0149` shape.**
   **✅ OWNER RULED 2026-08-03 — DO IT, in the `0149` shape.** The question this item used to carry
   (*"is the historical annotation wanted at all?"*) is **settled** — see *Owner rulings on record*
   below. ⚠️ **The ruling authorises the deliverable, not a shortcut: the trap in *"The naive repair
   would now CREATE a defect"* above is still in full force.** Annotate, never delete; the correction
   goes in a **separate bullet**, never inside the label.
   In `0154`'s
   and `0165`'s `## Notes`, add a **dated 2026-08-03 note** recording that `0173` declared `Blocks:
   0154, 0165`, that the ordering was real, and that **it was discharged by `0173` closing first on its
   own append rank — no promotion and no dependency declaration were needed.**
   - **⛔ Do NOT write `0173` into the `Depends on` label.** The label must keep reading a value that
     resolves to `ready`, because `ready` is the true answer. Put the history in a **separate bullet**.
   - **⛔ Do NOT delete or rewrite `0154`'s `nothing hard` line or its soft-follow on `0153`.** Add
     beside; never overwrite.
   - **Preserve the canonical parse-safe flush form** on every declaration line you touch — the label
     flush against the `**`, nothing between `**` and `Depends on` / `Blocks`, per
     [`conventions/dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md).
     A decorated variant is read as *no dependency* (the task-84 misreport class) or renders
     `⟨derive: UNPARSEABLE — see brief⟩`.
4. **Discharge the standing flag** on the sprint-2 addendum. The addendum still asks *"the owner should
   decide whether to promote the row"* about `0173`. **Append a dated 2026-08-03 note** recording that
   the question is **moot**: `0173` shipped from its append rank `P152` while both tasks it blocked sat
   above it at `P129` / `P130`, the ordering held regardless, and **no promotion was ever performed or
   needed**. **Append; do not edit the original flag text.**

### Out of scope

- **⛔ Do not promote `0173`, and do not re-rank anything.** `0184` stays at `P162`. ADR-035: an
  insertion is not the owner-ruled re-rank exception — append, never insert, renumber nothing.
- **⛔ Do not change any row's status cell**, and do not move any task folder.
- **⛔ Do not sweep the rest of the corpus for other asymmetric declarations.** If the work surfaces
  more, **name them as a follow-up** — the producer files it.
- **⛔ Do not edit `dashboard.sh`, `/fkit-status`, or any test** — other than the parity-exception
  `reason` text in item 2, if and only if that text has become inaccurate.
- **⛔ Write no `:NNN` line-number citations.**
- **⛔ Do not touch `ai-agents/wiki-vault/`.**

## Verification steps

1. `conventions/dependency-declaration-form.md` (live copy) states the binding-order ruling and
   reproduces the three-carrier table.
2. The scaffold copy carries the same ruling in generalized form, with **no** fkit task ID, report
   reference, or relative link into `tasks/`.
3. The dual-home parity test passes. State the command run and its result, not just the conclusion.
4. `0154` and `0165` each carry a dated 2026-08-03 note recording the discharged `0173` ordering, and
   **neither `Depends on` label names `0173`**.
5. `0154`'s `nothing hard` value and its soft-follow on `0153` are both still present, unmodified.
6. Run the `/fkit-status` board renderer and show that `0154` and `0165` still render **`ready`** — not
   `after 0173`, and not `⟨derive: UNPARSEABLE — see brief⟩`. **This is the point of item 3's shape;
   prove it.**
7. `0173`'s `Blocks: 0154, 0165` line in `ai-agents/tasks/done/` is **unchanged** — this task adds
   nothing to the closed brief.
8. A dated note on the sprint-2 addendum records the promotion question as **moot**; the original flag
   text is unedited.
9. `git diff` shows **no `P<n>` cell changed** anywhere in `ai-agents/sprints/`.
10. `grep` for `\.md:[0-9]` over the changed files returns nothing.
11. `git diff` shows **nothing** under `ai-agents/wiki-vault/`.

## Owner rulings on record

1. **✅ RULED 2026-08-03 — item 3 (the historical annotation) IS wanted, in the `0149` shape.**
   **Provenance:** owner ruling given live via `AskUserQuestion` in a `/fkit-sprint-ship-loop` driver
   session on **2026-08-03**, and relayed into this brief by a spawned producer with no owner channel.
   It settles the open question this brief carried after its 2026-08-03 re-scope — *"is it wanted at
   all? Nothing is wrong without it, and it is the only deliverable that can make things worse.
   Recommend yes, `0149` shape."*
   **What was ruled, in the ruling's own terms:** **annotate, never delete**; the correction goes in a
   **separate bullet**, **never inside the label**.
   ⚠️ **The trap that made this a question is NOT discharged by the ruling — it is the reason the shape
   is prescribed.** `dashboard.sh` does not interpret the dependency: it hands `/fkit-status` the **raw
   `Depends on` text**, and the skill's documented mapping turns a named task in that text into
   **`after <N>`**. So a bare `- **Depends on:** 0173` written today would flip two rows that render
   the **true** answer `ready` into the **false** answer `after 0173`, for a task that is already
   `✅ Done`. **The annotation must be shaped so it cannot parse as a live dependency.** Verification
   step 6 exists to prove that it does not; do not report this task done without it.

## Open questions for the owner

1. **Item 2's dual-home call** — the producer ruled the ruling belongs in **both** homes. If the owner
   would rather the scaffold ship without it, say so and item 2 collapses to the live copy only.

## Notes

- **Owner:** fkit-producer — a task-record correction plus a convention statement, both producer work.
- **Depends on:** nothing. `0173` closed 2026-08-03; nothing else gates this.
- **Blocks:** nothing.
- **⚠️ Priority 162 is append rank, NOT a merit ranking — flagged for owner confirmation.**
- **On merit:** **lowered by the re-scope.** The 2026-08-01 brief argued for a position immediately
  above `0154` on the strength of `0173`'s urgency. **That urgency is gone.** What is left is one live
  convention statement and two pieces of record-keeping, none of it blocking anything. **Append rank
  `P162` is now a fair position on merit** — the divergence the original brief flagged has closed by
  itself.
- **Merit form used here** is the canonical `**On merit:**` shape from report §3.1 / ADR-035. Flagged so
  it is not read as drift.
- **Re-scope provenance:** owner ruling 2026-08-03, relayed live through a `/fkit-sprint-ship-loop`
  driver session; written by a spawned producer with no owner channel. The two stale claims corrected
  above were **found on disk during the re-scope**, not relayed.
- No existing row was renumbered by this brief, and no rank cell was changed.
