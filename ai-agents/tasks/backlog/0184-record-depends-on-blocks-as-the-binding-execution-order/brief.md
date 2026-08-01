# Record `Depends on` / `Blocks` as the binding execution order, and repair the `0173` asymmetry

## ID
0184

## Sprint
Sprint 2

## Priority
162

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

**This is follow-up 7 of task `0174`'s decision report**
([the 2026-08-01 merit-ordering report](../../../knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md),
§3.7, §6 and §8). Report §8 ranks it **soon — `0173`'s flag is live and marked urgent.**

### The ruling this discharges

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

### The live specimen, and the standing flag it discharges

`0173`'s brief carries a merit case that is **stated, reasoned, urgent, producer-agreed and flagged to
the owner** — and the board cannot express it. `0173` sits in the append zone; `0154` sits three
segments above it, with **five closed rows in between** (`0157`, `0161`, `0148`, `0159`, `0160`).
Promoting `0173` would renumber all five, which the closed-row rule forbids absolutely.

The board addendum asks the owner *"whether to promote the row."* **Report §6's position: promotion is
the wrong remedy and it is not available** — the closed-row rule binds the owner too, so the question
offers a choice between one option that is illegal and one that is unstated.

**The legal alternative preserves the intent exactly and costs one line per brief:** declare `0154` and
`0165` as **depending on** `0173`. That renumbers nothing, touches no closed row, needs no owner ruling,
and delivers the outcome the flag wants — `0173` lands first — because under §3.7 the dependency binds
and outranks reading order.

### ⚠️ The declarations are asymmetric today — verified at filing

| Brief | Declares |
|---|---|
| `0173` | `- **Blocks:** 0154, 0165.` |
| `0154` | `- **Depends on:** nothing hard.` — **contradicts `0173`** |
| `0165` | `- **Depends on:** nothing.` — **contradicts `0173`** |

**This is load-bearing, not tidiness.** A ruling that leans on `Depends on` / `Blocks` as the binding
execution record is worth nothing if the two halves disagree, and `dashboard.sh` derives each task's
Next-step from the **`Depends on`** side — so today the board reports `0154` and `0165` as pullable while
`0173` says they are blocked. **The board is currently lying about two rows**, and it is lying in the
direction that lets someone pick up blocked work.

## What to build

Documentation only — brief edits and one convention statement. **No code, no re-ranking, no promotion.**

1. **Repair the asymmetry.** Amend `0154`'s and `0165`'s `## Notes` `Depends on` declarations to name
   `0173`, in the **canonical parse-safe form** the board reads:
   `- **Depends on:** 0173 — <reason>`
   **The label must be flush against the `**`** — no emoji or decoration between `**` and `Depends on`,
   per [`conventions/dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md).
   A decorated variant is read as *no dependency* (the task-84 misreport class).
   **⚠️ `0154` currently reads `nothing hard` and also records a soft-follow on `0153`. Preserve the
   soft-follow; do not overwrite the whole line.**
2. **Record the ruling** that `Depends on` / `Blocks` is the binding execution order where board reading
   order contradicts it — the §3.7 table above — in
   [`conventions/dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md),
   which is where a reader of the declaration form will look.
   **⚠️ That page is NOT in `claude/scaffold/` today** — it is one of the drift items task `0132` exists
   to reconcile. **Do not create the scaffold copy here**; that is `0132`'s job. Note the gap in the
   close report.
3. **Discharge the standing flag** on the sprint-2 addendum: append a dated note recording that the
   *"should the owner promote `0173`"* question is **answered without a promotion**, by dependency
   declaration, and that promotion was not available. **Append; do not edit the original flag.**

### Out of scope

- **⛔ Do not promote `0173`, and do not re-rank anything.** Promotion renumbers five closed rows.
- **⛔ Do not change any row's status cell.**
- **⛔ Do not sweep the rest of the corpus for other asymmetric declarations.** If the work surfaces
  more, **name them as a follow-up** — the producer files it. This task repairs the live specimen the
  report names.
- **⛔ Do not edit `dashboard.sh` or any test.**
- **⛔ Write no `:NNN` line-number citations.**
- **⛔ Do not touch `ai-agents/wiki-vault/`.**

## Verification steps

1. `0154`'s and `0165`'s briefs each carry a `Depends on` line naming `0173`, in the canonical flush
   form, and `0154`'s soft-follow on `0153` is preserved.
2. `0173`'s `Blocks: 0154, 0165` is unchanged, and the two halves now agree — state the check that was
   run, not just the conclusion.
3. Run `dashboard.sh` and show that `0154` and `0165` no longer report as pullable, and that neither
   renders `⟨derive: UNPARSEABLE — see brief⟩`. **The parse is the point of the canonical form; prove it
   parsed.**
4. `conventions/dependency-declaration-form.md` states the binding-order ruling and reproduces the
   three-carrier table.
5. A dated note on the sprint-2 addendum records the flag as discharged **without a promotion**; the
   original flag text is unedited.
6. `git diff` shows **no `P<n>` cell changed** anywhere in `ai-agents/sprints/`.
7. `grep` for `\.md:[0-9]` over the changed files returns nothing.
8. State in the close report that `dependency-declaration-form.md` has no `claude/scaffold/` counterpart
   and that closing the gap belongs to task `0132`.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing formally — but it **unblocks the board's honesty about** `0154` and `0165`, which
  are currently reported as pullable while `0173` declares them blocked.
- **⚠️ Priority 162 is append rank, NOT a merit ranking — flagged for owner confirmation.**
- **On merit:** immediately above `0154` — that is precisely the position `0173` cannot reach and this
  task exists to make unnecessary, and the board is misreporting two rows until it lands. Its append
  rank sits far below, in a different segment; **the merit position is itself unreachable**, which is
  the defect this whole task family documents.
- **Merit form used here** is the canonical `**On merit:**` shape from report §3.1 / ADR-035. Flagged so
  it is not read as drift.
- No existing row was renumbered by this brief.
