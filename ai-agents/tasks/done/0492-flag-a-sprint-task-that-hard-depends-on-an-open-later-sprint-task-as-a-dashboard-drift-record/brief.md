# Flag a sprint task that hard-depends on an open later-sprint task, as a dashboard drift record

## ID
0492

## Sprint
Sprint 10

## Priority
P12

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** Being pullable on the board is not his word.
> The sprint ship-loop's per-task plan approval, given live by the owner, is where that word is given.

**The incident (reported 2026-10-05 by the `fkit-lead` session of a consuming project (geoconflict)).**
In that project, a Sprint-7 task had its hard `Depends on:` line re-pointed at a newly filed *verify*
task placed in Sprint 8. The re-point came from an owner ruling on an option the lead had marked
"(Recommended)" — and the question never said that the Sprint-7 task **and 5 tasks behind it** would
then wait on Sprint 8. Result: 6 of Sprint 7's 8 open rows depended on a later-sprint task. **No fkit
tool flagged it:** `dashboard.sh` emitted no `drift` record (only a `derive` line), and
`/fkit-sprint-ship-loop`'s dependency-deadlock stop reported "waiting" without saying the blocker sat in
a later sprint. The owner found it by hand.

**What the real defect is — and is not.** Several sprints may be `🔄 In progress` at once (ADR-047), and
`/fkit-sprint-done` carries open rows forward, so a later-sprint dependency is not a hard lock. The
defect is that **the board claims sprint-N work that cannot be done in sprint N, and nothing says so.**
That project also had a standing owner rule — *split build and verify; put the verify task at the top
of the next sprint* — so **refusing** such a dependency would collide with legitimate owner rulings.
The fix is to make it **visible**, never to forbid it.

**Owner rulings (2026-10-05, given directly by the owner in fkit's own `fkit-lead` session; relayed to
a spawned `fkit-producer`, which has no owner channel — ADR-021).** Typed request: *"Ask geoconflict-lead
agent about the situation … discuss … how to prevent this type of situations in the future, based on
that create a task and add it to the current [sprint]."* Then, via `AskUserQuestion` (selected option
text): scope = **"(a) Board flags it"**, **"(b) Warn when filing"**, **"(c) Say the knock-on in
questions"** (two other options were **not** chosen); shape = **"Let the producer split"**; placement =
**"Sprint 10, at the end"**. ⚠️ The wording is the lead's relay, not verified verbatim.

**This brief is ruling (a), the first of four briefs from that split** — `0492` (this), `0493`
(the ship-loop reads it), `0494` (warn when filing), `0495` (say the knock-on in questions). It goes
first because `0493` and `0494` consume the record it creates.

**Overlap, flagged — not a dependency.** ADR-052 phase-5 task `0451` rewrites `/fkit-status` and
`dashboard.sh` over the board's JSON store. It has not started. Build this on the current tree;
whichever lands second carries the other forward.

**Wiki:** a `/fkit-query` read found nothing on cross-sprint dependencies — a gap for `fkit-wiki` to
fill once this ships.

## What to build

1. **A new `drift` record kind in `dashboard.sh`'s render path** (board mode — the
   `dashboard.sh <plan>` call). It fires for a row on a **real sprint board** (identity `Sprint N`;
   never when the board being rendered is the Backlog board) when **all** of these hold:
   - the row is **open** (`🔲 Backlog`, `🔄 In progress`, or `🚧 Blocked`);
   - its brief's `Depends on:` names task `D` (the canonical form —
     [`dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md));
   - `D` is **open** (its brief's status is not `✅ Done`, `⛔ Cancelled` or `➡️ Moved`, and it is not
     in `tasks/done/` or `tasks/cancelled/`);
   - `D` sits on a sprint `M` that is **later or not yet started**, or on the **Backlog board** — read
     from `D`'s brief `## Sprint` and, for `M`, that sprint board's line-3 banner (ADR-047).
2. **The record names both rows**: the dependent task, the blocker, and the blocker's sprint — e.g. a
   shape like `drift depends-on-later-sprint <task> blocker="<D>" blocker_sprint="<M>"`. The exact
   kind name and fields are the coder's call; follow the existing `key="value"` grammar and
   `fact_value` escaping, and call `mark_drift` so the row renders and joins the roll-up's drift clause.
3. **`/fkit-status` surfaces it** — add the new kind to the drift-grammar list in
   `claude/skills/fkit-status/SKILL.md` (the list that *"has drifted from [the script] six times"*), with
   one line saying what it means and that it is an **owner decision in beat 6** (move the dependents
   forward, move the blocker earlier, or accept and record why). Its *"unknown kind → report as-is"*
   rule stays.
4. **Edit the canonical sources under `claude/`, never the `.claude/` copies.**

**Two questions for the plan step (settle them in the plan; the owner approves it):**
- **What "later" means.** Sprint numbers are not always chronological in fkit itself — `Sprint 11`
  closed before `Sprint 10` opened. The producer's recommendation: flag when `M` is the Backlog board,
  or `M`'s board is not `🔄 In progress` (`🔲 Backlog`, missing, or unresolved), **or** `M`'s number is
  higher than `N` while `N` is in progress. Two in-progress sprints with a lower-numbered blocker are not
  flagged. If the plan proposes otherwise, say so plainly.
- **Hard vs soft.** The owner's word is *hard* dependencies. `/fkit-sprint-ship-loop` today treats every
  `Depends on` link as blocking. Recommendation: every task ID on the `Depends on:` line counts as hard
  unless the line marks it soft (the convention's `— soft, not hard` form). Extracting IDs from that
  free text is the known-unreliable part (convention doc, "CommonMark-in-awk") — a line the script cannot
  read must stay a **loud** finding, never a silent "no dependency".

## Verification steps

1. A fixture with sprint `N` (`🔄 In progress`) whose open task depends on an open task on sprint `M`
   (`🔲 Backlog` banner) → `dashboard.sh` emits exactly one new `drift` record naming both tasks and `M`;
   the dependent row renders; the roll-up's drift clause names it.
2. Same fixture with the blocker on the **Backlog board** → the record fires.
3. **No record** when: the blocker is `✅ Done` or `⛔ Cancelled`; the blocker is on the same sprint; the
   blocker is on another `🔄 In progress` sprint with a lower number; the dependent row itself is closed;
   the board being rendered is the Backlog board.
4. The geoconflict shape: one task on sprint `N` depending on a later-sprint blocker, and 5 tasks
   depending on that task → the direct dependent is flagged; say in the plan whether the 5 transitive
   ones are flagged too, and test whichever the plan chose.
5. `claude/skills/fkit-status/SKILL.md`'s drift-grammar list names the new kind; any test that mirrors
   that list against the script still passes.
6. The existing `test/dashboard-contract.test.js` and `test/board-reader.test.js` suites pass
   unchanged, and a prove-red step shows the new test fails without the change.
7. `node --test test/reference-integrity.test.js test/task-id-uniqueness.test.js` passes.

## Notes

- **Depends on:** nothing.
- **Blocks:** 0493, 0494.
- Filed 2026-10-05 by a spawned `fkit-producer` on `fkit-lead`'s instruction, under the owner rulings
  above. ⚠️ `P12` is append rank, NOT a merit ranking — but here append is also the owner's own placement
  ruling (*"Sprint 10, at the end"*), so it needs no further confirmation. **On merit this belongs
  directly below `0395`, where it is**, because nothing earlier on the board depends on it and the four
  new briefs run as one contiguous set in dependency order.
- No secrets, no machine paths: the consuming project is named only as "a consuming project
  (geoconflict)"; its task IDs are not fkit task IDs and are not used here.
