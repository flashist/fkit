# ADR-035: A mid-board insertion is not the owner-ruled re-rank exception

- **Status:** accepted
- **Date:** 2026-08-01
- **Deciders:** owner (Mark Dolbyrev), ruling via `AskUserQuestion` in the live `fkit-lead`
  `/fkit-sprint-ship-loop` driver session; question raised and recorded by **fkit-architect** from
  task `0174`'s decision report.
- **Scope:** `/fkit-task-brief` **step 5** — *"Determine priority"*. It narrows the **one exception** to
  the append rule. It does not change what a brief contains, how tasks are decomposed, or how ranks are
  read.

> **Citation form.** This ADR anchors every reference by **heading and quoted phrase**, and names every
> task by its **folder ID**, never by board rank. That is task `0160`'s ruling, applied here
> deliberately: the coordination documents this ADR is about are exactly the class in which a
> line-number pointer goes stale.
>
> **That includes bullet positions.** A rule inside a mutable skill file is anchored by its **step
> heading plus its quoted text**, never as *"the Nth bullet"* or *"four bullets later"* — a bullet
> ordinal is a line number wearing different clothes, and it rots the same way. A draft of this ADR
> carried one; it was corrected on review.

## Context

`/fkit-task-brief` step 5 carries two rules that were read as compatible and are not.

**The append rule**, and its stated exception:

> *"**Targeting a named sprint:** append **after** the existing highest priority. **Do not renumber or
> insert into the owner's ranking** …"*
>
> *"**The one exception — an owner-ruled re-rank. A re-rank is the owner's call.** The ban above
> protects **the owner's** ranking from an agent acting alone; it is not a bar on the owner ranking
> their own board."*

**The closed-row rule** — a separate bullet of the **same step**, quoted in full so the anchor is its
words and not its position — stated absolutely:

> *"**`✅ Done`, `⛔ Cancelled` and `➡️ Moved` rows are NEVER renumbered — not even under an owner
> ruling.** Closed history is not re-ranked to make room for new work."*
>
> *"**A closed row is a wall, not a step:** an open row sitting above one is out of reach however good
> the merit case, because reaching it would renumber the closed rows in between."*

**The two collide the moment the exception is used for an insertion, because of an arithmetic fact.**
Inserting a row at any position renumbers **every row below that position**. On a board where closed
and open rows **interleave**, the only insertion point with no closed row beneath it lies inside the
final run of open rows — which is to say, appending. Therefore:

> **On an interleaved board there is no mid-board insertion point that does not renumber a closed row.**

Sprint 2 is such a board: measured 2026-08-01, **126 of 155 ranked rows are closed**, scattered through
the open ones in five disjoint open segments.

**This is not a theoretical collision. It has already happened, once, and nobody noticed.** Task `0174`
— itself the task about ordering — was inserted mid-board on 2026-08-01 under an explicit owner ruling,
invoking the exception above. Verified against the filing commit's own diff, the insertion **renumbered
eight closed rows**: `0151`, `0147`, `0150`, `0157`, `0161`, `0148`, `0159`, `0160`. All eight read
`✅ Done` at the time.

**Two written records assert the opposite, and both are false.** The sprint-2 board addendum, under the
heading *"⚠️ One row was inserted mid-board by owner ruling, and it renumbered the board"*, states
*"no closed row was renumbered by the insertion."* `0174`'s own brief repeats it verbatim in its
`## Notes`. The reasoning that produced the error is visible and will recur: the producer checked the
ranks **above** the insertion point — the owner's named band, all closed — and correctly concluded that
placing the row below them renumbered none of **them**. An insertion renumbers what is **below** it.
The check ran in the wrong direction.

The full investigation, the live board measurement, and the seven candidate mechanisms weighed are in
[`reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md`](../reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md).

## Decision

**The owner-ruled re-rank exception permits moving an existing row within its own contiguous run of open
rows. It does not permit inserting a new row mid-board.**

The closed-row rule is **absolute and outranks the exception**, exactly as it already says — *"not even
under an owner ruling."* An owner may re-rank their own board; an owner may not renumber closed history,
and on an interleaved board a mid-board insertion always does.

**Where a new row's merit position is out of reach, it appends, and the ordering intent is recorded in
the brief** as a relative, non-numeric merit statement naming its neighbour by folder ID — the
mechanism ruled in by the same report:

```
- **On merit:** immediately above 0154 — <reason>
- **On merit:** as ranked
```

**Corollary, stated so it is not rediscovered as a defect:** the append rule is a **forced consequence**
of the closed-row rule, not an independent policy. It cannot be relaxed without first relaxing the
closed-row rule. Anyone proposing to allow insertions must argue the **closed-row rule**.

## Options considered

- **Narrow the exception to re-ranks within an open run (chosen).** It removes the contradiction by
  cutting the rule that was inferred, not the rule that was written — the closed-row rule is stated
  absolutely and in full; the exception's scope was never stated at all. It costs the project no
  capability it actually had, because §2.3 of the report shows the capability was never legally
  available. And it is the only option that makes the two bullets in step 5 readable together.

- **Leave step 5 as it is and treat the `0174` insertion as a one-off error.** Rejected. The two
  bullets still contradict each other for the next reader, and the reader who hit it was a careful
  producer who recorded its authority in full, checked its effect, and wrote down a specific merit
  justification. A rule that survives only until someone reads it carefully is not a rule.

- **Relax the closed-row rule so mid-board insertions become legal.** Rejected, and it is the
  substantive rejection. Renumbering closed rows invalidates every rank reference in every closed
  brief, addendum, review ledger and report at once — the failure tasks `0157` and `0159` were spent
  repairing, and the reason
  [`conventions/priority-is-rank-not-identity.md`](../conventions/priority-is-rank-not-identity.md)
  exists. It trades a durable historical record for a mutable ordering column, which is the wrong side
  of the trade.

- **Formalize the owner-ruled re-rank harder — its own recorded act, with stronger authority.**
  Rejected. `0174`'s filing already did this, impeccably: owner ruling, dated, channel named, authority
  stated before outcome, explicitly disclaimed as producer precedent. It still breached the closed-row
  rule eight times, because the problem is arithmetic, not authority. More ceremony around an act that
  cannot be performed legally is a louder way to breach the rule.

- **Revert the `0174` insertion to restore the eight ranks.** Rejected. Reverting renumbers the same
  eight closed rows **a second time** — committing the breach again in the name of repairing it — and
  it contradicts the `0157`/`0159` precedent that a stale rank reference is repaired by **naming the
  folder ID**, not by restoring numbers. **Correct the record; do not revert.**

## Consequences

### Positive

- Step 5's two rules become readable together; the contradiction that produced the `0174` breach is
  gone.
- Closed ranks are genuinely immutable, so every historical rank reference in the corpus stays
  resolvable.
- The remedy for an out-of-reach merit position is now **stated** rather than absent: append, and record
  the intent in the brief.
- The rule is checkable. A guard becomes possible (see *Binds*, below) because "no closed row's rank
  changed" is a mechanical property of a diff.

### Negative / costs — accepted explicitly

- **An owner cannot place a new task at its merit position when that position is behind a closed row.**
  This is the direct, intended cost, and it is not small: measured 2026-08-01, **16 of 29 open sprint-2
  rows** sit behind a closed wall.
- **The board's reading order will keep drifting from merit order** as the board closes out. The merit
  statement records the gap; it does not close it.
- **The merit statement is advisory.** It changes nothing about which task is picked up next. Where
  ordering must actually bind, it belongs in `Depends on` / `Blocks`, not in rank and not in a merit
  note.
- **Two live records currently assert a falsehood** (the sprint-2 addendum and `0174`'s brief). This ADR
  does not repair them — that is a producer follow-up, by correction note, not by revert.

### Binds — and what is deliberately left undone

**Binds:** `/fkit-task-brief` step 5, and every role that files a brief onto a ranked board — in
practice `fkit-producer`, including a spawned producer acting on a relayed owner ruling.

**Left undone, deliberately:**

- **The skill edit is not made here.** This ADR records the decision; narrowing step 5's wording is a
  named follow-up of `0174`'s report, for the producer to file and the coder to make.
- **No guard is built here.** The report proposes `test/closed-rank-immutability.test.js` — a **diff**
  check across a commit range, since no property of a single board file reveals that a closed row was
  renumbered. It is ranked LOW and it needs a baseline decision first, because **it would be red on the
  commit that filed task `0174`**.
- **Nothing is re-ranked and nothing is reverted** by this ADR.

### Residual risks / "re-raise only if"

- **Re-raise only if** the closed-row rule itself is up for revision. This ADR is downstream of it: if
  closed rows ever become renumberable, the append rule and this narrowing both fall away
  automatically, and the argument to have is about closed history, not about insertions.
- **Re-raise only if** a board is shown where closed and open rows do **not** interleave — the
  arithmetic here assumes interleaving. On a board whose closed rows are all contiguous at the top, a
  mid-board insertion below them renumbers nothing closed, and the narrowing is unnecessary though
  harmless.
- **Do not re-raise** the "make insertions legal" option (report §3.5) or the "formalize the owner
  re-rank act" option (report §3.2). Both were weighed by name and rejected above, and a review finding
  that proposes either is **closeout, not a new defect**.
- **Not covered by this ADR:** whether the open rows should be rolled onto a fresh board to restore
  reachability wholesale. That is `0174`'s follow-up 8, it is **deferred by the owner as of
  2026-08-01**, and nothing here rules on it.

## Related

- [`reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md`](../reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md)
  — task `0174`'s decision report: the live measurement, the eight renumbered rows, and all seven
  candidates ruled in or out by name. This ADR records its §4.2.
- [`reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md`](../reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md)
  — task `0160`'s ruling, which handed this question back as its own task and supplies the citation form
  used here.
- [`conventions/priority-is-rank-not-identity.md`](../conventions/priority-is-rank-not-identity.md) —
  *"A sprint board's Priority cell is board rank … A task's identity is its task-folder name's `NNNN`
  prefix, and nothing else."* The reason closed ranks must not move.
- `claude/skills/fkit-task-brief/SKILL.md`, step 5 *"Determine priority"* — the rule this ADR narrows.
- [`adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md`](adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md)
  — permanent folder IDs are what make the relative, non-numeric merit statement durable.
- Tasks `0157` and `0159` (both closed) — the stale-rank-citation rule and its repair sweep; the
  precedent that a stale rank reference is fixed by naming the folder ID, not by restoring numbers.

**`fkit-wiki` should ingest this ADR** into the vault's decisions pages. The architect does not write
the wiki.
