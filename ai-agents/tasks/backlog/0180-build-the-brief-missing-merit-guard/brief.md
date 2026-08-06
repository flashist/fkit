# Build the `brief-missing-merit` guard — presence and shape

## ID
0180

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**This is follow-up 3 of task `0174`'s decision report**
([the 2026-08-01 merit-ordering report](../../../knowledge-base/reports/2026-08-01-merit-ordering-record-when-board-rank-cannot-carry-it.md),
§5.1 and §8). It is the **enforceable half** of a deliberately split enforcement answer.

Report `0160` §7 had recorded this class as *"nothing can enforce this"*. Report `0174` §5 **splits**
that answer and changes it in one direction only:

| Half | Enforceable? | File | Condition |
|---|---|---|---|
| **Presence and shape** of the merit statement | **Yes** | `claude/skills/fkit-status/dashboard.sh` + `test/dashboard-contract.test.js` | below |
| **Whether the merit statement is true, honest, or the ordering the owner actually wants** | **No** | — | **nothing can enforce this** |

### The condition, in two parts

1. **Presence.** Every brief on a **ranked** board carries a line matching the canonical form —
   `**On merit:**` followed by either a relative statement naming a neighbour by folder ID, or the
   literal `as ranked`. A brief with neither is `brief-missing-merit` drift. **Unranked boards are
   excluded**: the Backlog board has no rank for a merit statement to be relative to.
2. **Shape.** The merit statement contains **no `P<n>` token**. A merit line reading
   `immediately above 0154 (P129)` is nonconformance.

`dashboard.sh` already emits the sibling drift kinds `brief-missing-status`, `brief-missing-owner` and
`brief-missing-id`, and `test/dashboard-contract.test.js` already asserts each of those three. This is a
fourth of the same family — the shape of the work is known.

### ⚠️ Two accepted costs the report names — carry BOTH from day one

**(a) The shape check reads `P<n>` tokens only, and a bare integer slips through.** Part 2 bans `P<n>`.
It does **not** catch a merit statement writing a bare rank with no `P`. **This is not hypothetical:**
`0158`'s brief writes *"On merit this belongs at 122"* — an absolute board rank, exactly the defect.
As written today that line is caught, but only by the **presence** half, for being in the legacy shape.
**Reshape it into the canonical form and keep the bare number — `**On merit:** belongs at 122` — and
the guard as specified passes it.** So a backfill done to clear cost (b) can extinguish the drift flag
while leaving the actual defect in the brief. Catching bare integers means flagging every number in a
merit sentence, which is noisy and unreproducible. **The literal `P<n>`-token reading ships; the gap is
accepted and named here so it is never reported later as a surprise.** Extending it is a separate
decision with its own measured cost — not a tweak to fold in.

**(b) The guard is red on the whole open board on day one, and the number is not 18.** Report §5.4b
sized it at **29 of 29** as of 2026-08-01 18:32 MSK, correcting an earlier draft that said 18: the 11
briefs that already carry the practice fail too, because §3.1 fixes the practice's **form** and no brief
in the corpus was written in that form.

**📅 Re-measured at filing (2026-08-01), after task `0174` closed and this batch of eight was filed:**

| Open sprint-2 briefs | Count | Why the guard is red |
|---|---|---|
| Carry **no** merit statement in any form | 17 | fails **presence** |
| Carry a merit statement in the **legacy** `**On merit this belongs …**` shape | 11 | fails **shape** — none matches `**On merit:**` |
| Match the canonical form | 8 | — (the eight briefs of this batch, written in the canonical form) |
| **Total open** | **36** | **the guard is red on 28 of 36** |

The report's 29 became 36 by two movements: `0174` closed (−1), and the eight follow-ups of its own
report were filed (+8). **These figures are a snapshot. Re-measure at implementation time and report
against this table rather than quoting it as current.**

**⚠️ Do not close the gap by loosening the condition to accept the legacy shape.** That re-opens exactly
what §3.1 ruled — *"the practice is right and its form is wrong"* — and defeats the **shape** half,
which is the half that stops the merit field becoming the next host for the bare-rank citation problem
this whole task family descends from.

## What to build

1. **`claude/skills/fkit-status/dashboard.sh`** — emit a new drift nonconformance kind
   `brief-missing-merit`, in the same family and the same emission shape as `brief-missing-status`.
2. **Render the merit statement** on the dashboard where the other brief-derived fields render, so the
   recorded ordering intent is visible rather than buried in a file nobody opens.
3. **`test/dashboard-contract.test.js`** — assert the new kind, matching how the three sibling kinds are
   asserted today. Assert **both** halves: a brief with no merit line is flagged, and a brief whose
   merit line carries a `P<n>` token is flagged.
4. **Carry the grandfathering decision** (below) in the implementation, not as a follow-up.

### 🚧 The blocking decision — grandfathering, and it is a 28-brief job

**The guard cannot land until this is decided.** The three options report §9 names:

- **Backfill all 28** — write 17 new statements, reshape 11 existing ones. **This is the option the
  driver's relay of the owner's ruling described as its own sequenced task.** If the owner wants it as a
  separate ship, it is a ninth brief and this task depends on it.
- **Exempt briefs filed before a named date**, and enforce forward only.
- **Ship the drift fact as advisory** and let the roll-up carry it without failing.

**Not choosing means the guard cannot land.** Producer judgement, or the owner's if the backfill is
chosen — the report notes the 28-brief size *"may change who decides it"*.

**⚠️ If the backfill is chosen, `0158`'s line must be fixed in substance, not just reshaped** — see cost
(a). And `0155`'s line (*"On merit this belongs **immediately above 0146**"*) is the closest existing
brief to the canonical shape and is the natural template for the reshape.

> ### ✅ DECIDED 2026-08-06 — option 2, exempt existing briefs. THIS SECTION NO LONGER BLOCKS.
>
> **Owner ruling, verbatim: *"Grandfather existing briefs."*** Given via `AskUserQuestion` in a live
> `fkit lead` session, 2026-08-06. **Everything above is left byte-identical** so the options weighed
> stay readable — but the heading's `🚧` no longer describes reality. **This task is unblocked on the
> grandfathering axis. Do not re-open it.**
>
> **The decision.** The guard **binds only briefs written from the merit-statement convention's date
> forward.** Briefs filed before that date are **exempt** — they are never flagged for a missing merit
> statement. The **backfill option is NOT taken**: the 28-brief job does not happen, `0158`'s line is
> **not** reshaped by this task, and no ninth brief is owed. The **advisory option is NOT taken**
> either — for in-scope briefs the guard **fails**, it does not merely report.
>
> **⚠️ THE ACCEPTED COST, RECORDED IN THE OWNER'S OWN TERMS — a permanent two-tier record.** The
> owner was shown this before ruling and accepted it:
> - **Old briefs will never carry merit statements.** Not "not yet" — **never**. Nothing is queued to
>   backfill them and nothing is expected to.
> - **The guard cannot tell you which tier a brief is in.** It reports conformance for the briefs it
>   binds and silence for the rest, and **silence from this guard means "exempt" and "conformant"
>   equally**. Anyone auditing merit coverage across the whole corpus must date-filter by hand.
> - This is a **permanent** property of the record, not a transitional state. ⛔ **Do not present the
>   board going green as "the corpus conforms"** — it means "no in-scope brief violates". Say the
>   second thing.
>
> **⚠️ THE BOUNDARY DATE IS NOT YET FIXED, AND THIS TASK MUST NOT INVENT ONE.** The ruling names *the
> merit-statement convention's date*. That convention page is **`0178`'s deliverable and `0178` has
> not shipped**, so the date does not exist on disk today. **Derive the cut-off from the convention
> page once `0178` lands** — do not pick a date, and do not silently use this ruling's date
> (2026-08-06) as a stand-in. If `0178` lands without a stated date, that is a gap to raise, not to
> fill. The dependency on `0178` in `## Notes` therefore now carries **two** reasons, not one.
>
> **⚠️ How the exemption must be built — the same lesson `0176`'s closed-ledger exemption records.**
> The cut-off belongs in the guard's **definition** (which briefs it selects), **not** in a
> post-filter that drops flagged rows after the fact. A guard that flags and then discards has a
> failure mode a guard that never selects does not.

### Out of scope

- **⛔ Do not extend the shape check to bare integers.** Named as a separate decision; see cost (a).
- **⛔ Do not loosen the condition to accept the legacy shape.**
- **⛔ Do not edit `/fkit-task-brief`.** Tasks `0179` and `0181` own that file.
- **⛔ Do not add a devDependency** — ADR-014, zero devDeps.
- **⛔ Do not re-rank anything.**
- **⛔ Write no `:NNN` line-number citations.**
- **⛔ Do not touch `ai-agents/wiki-vault/`.**

## Verification steps

1. `dashboard.sh` emits `drift nonconformance <tid> kind="brief-missing-merit"` in the same fact shape
   as the three sibling kinds.
2. `test/dashboard-contract.test.js` asserts the presence half — a ranked-board brief with no merit line
   is flagged.
3. It asserts the shape half — a merit line containing a `P<n>` token is flagged.
4. It asserts the exclusion — a **Backlog-board** brief with no merit line is **not** flagged.
5. **Re-measure the red set before starting** and report it against the 17 / 11 / 8 / 36 table above. If
   it has moved, say by how much and why.
6. `npm test` passes, including `test/prove-red.sh`'s hard gate; a mutation of the new assertion makes
   it fail. **Report the red run, not only the green one.**
7. State the grandfathering decision actually taken, and show the board is green (or advisory-only, if
   that was the choice) under it.
8. **State cost (a) by name in the close report.** A close report presenting this guard as complete has
   failed verification.
9. `grep` for `\.md:[0-9]` over the changed files returns nothing.

## Notes

- **Depends on:** `0178`, `0179`. **And a grandfathering decision that is not yet made** — see above.
  **Sequencing this before `0178`/`0179` ships it red on 28 of 36 open briefs.**
  - **⚠️ DATED CORRECTION 2026-08-06 — the grandfathering clause above is DISCHARGED. Line left
    byte-identical.** Owner ruling, verbatim ***"Grandfather existing briefs."*** (`AskUserQuestion`,
    live `fkit lead` session, 2026-08-06) — see §"The blocking decision" above for the decision, its
    accepted cost, and the unfixed boundary date. **Current dependency: `0178`, `0179` — no
    outstanding decision.** ⚠️ `0178` is now a **doubly** hard gate: it supplies the canonical merit
    form *and* the date the exemption is measured from.
- **Blocks:** nothing.
- **⚠️ Priority 158 is append rank, NOT a merit ranking — flagged for owner confirmation.**
- **On merit:** immediately below `0179` — it is the last of the three-task grammar chain and must land
  after both, so append rank and merit rank coincide **within this batch**.
- **Merit form used here** is the canonical `**On merit:**` shape from report §3.1 / ADR-035 — the shape
  this guard checks for. Flagged so it is not read as drift.
- No existing row was renumbered by this brief.
