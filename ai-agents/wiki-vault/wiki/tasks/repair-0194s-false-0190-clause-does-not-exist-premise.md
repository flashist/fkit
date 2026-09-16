# Repair `0194`'s false *"`0190`'s clause does not exist"* premise

**Source**: `ai-agents/tasks/done/0221-repair-0194s-false-0190-clause-does-not-exist-premise/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 9 · `P6` · `0221` · ✅ Done (agent-closed — not owner-verified)

> ⚠️ **A FULLY-SPECIFIED, OWNER-RULED REPAIR THAT SAT UNEXECUTED FOR A MONTH.** ⭐ **That is why
> Sprint 9 restored a success criterion to score it** — see Outcome.

## Goal

**`0194` is a Backlog row that declares three prerequisites under *"Why it cannot be done now"*, and
one of them had stopped being true.** Its item 2 read:

> 2. **`0190`'s clause does not exist** — no wording to assess.

⛔ **False.** `0190` shipped its worker-side precedence clause on **2026-08-04**, verified on disk as
the final bullet of `## Universal hard rules` in `claude/scaffold/universal-rules.md`.

⭐ **Why it matters:** `0194` will be planned and pulled off its own stated premises. ⛔ **A reader who
checks premise 2 and finds it false has no reason to trust premises 1 and 3; a reader who does not
check carries a false statement forward.** ⭐ ***The whole point of `0194` existing as a separate row is
that it survives every ordering of its three prerequisites — a premise list that does not track their
real state defeats that design.***

## Key Changes

### ⚠️ The row decayed the way it exists to fix — on itself

| `0194`'s premise | 2026-08-05 | 2026-08-14 |
|---|---|---|
| 1. `test/skill-ownership-sites.mjs` does not exist (`0189`) | Still true | ✅ **STILL TRUE** — `0189` still open |
| 2. `0190`'s clause does not exist | ⛔ **NOW FALSE** | ⛔ **STILL FALSE** |
| 3. `0191`'s clause does not exist | Still true | ⛔⛔ **NOW ALSO FALSE** — the driver-side clause **is** in `fkit-sprint-ship-loop/SKILL.md` |

⛔⛔ **So the brief's own bolded instruction — *"Exactly ONE of the three premises is false — do not
'repair' the other two"* — named the WRONG COUNT and would have told a run to leave a false premise
standing.** ✅ **Its underlying rule was unchanged and still binding: repair only what is measured
false**, and premise 1 was genuinely still true.

⚠️ ***"This is the very decay this row exists to fix, recurring on this row."*** ⭐ **`0221`'s own
`## Notes` had predicted it** — *"Note for whoever closes `0191` and `0189` — each will falsify one
more of `0194`'s premises."* ⛔ **`0191` closed and the premise was not repaired. The prediction was
right and the mechanism behind it does not exist.**

### ⭐ The widening went to the owner rather than being taken

⛔ **A spawned producer with no owner channel does not widen a filed task's deliverable**, so step 2's
*"Correct premise 2 only"* was **left exactly as written** and the choice surfaced instead:

- **(a)** widen to premises 2 **and** 3 in one pass — *"the two repairs touch the same three sentences
  of the same file"*; or **(b)** hold to premise 2 and let `0191`'s own follow-up carry premise 3.

⛔ ***"Until the owner rules, a run takes the narrower branch (b) and REPORTS premise 3 as an unrepaired
measured falsehood — never silently widens, never silently leaves it unmentioned."***

✅ **Owner ruling 2026-08-14, verbatim *"Widen to premise 3 (Recommended)"*** — step 2 became *correct
premises 2 and 3 in one pass*.

⭐ **`0194` remained genuinely blocked throughout, on `0189` alone.** ⛔ ***"Do not read 'two of three
are now false' as '`0194` is ready'."***

## Outcome

⭐ **Verified on disk 2026-09-16: `0194`'s brief now reads *"Why it cannot be done now — three
prerequisites, one still open (`0189`)"*.** Premises 2 and 3 are repaired in place, each naming its
file, its ship date and ⭐ **quoting the wording to assess verbatim** — which is what `0194`'s job
needs. A dated **2026-09-15 (`0221`)** note sits above them recording that all three were re-measured
on disk and marking them as **snapshots**.

⭐ **This satisfied Sprint 9's success criterion 8 — *"`0194`'s brief contains ZERO false premises at
close, all three re-verified against disk."*** ⛔ **The board restored that criterion after a
driver-side diff found it had been dropped**, and said why the drop was the worst of the three:

> ⭐ **Closing `0221` without verifying the three premises would reproduce the precise failure the task
> exists to fix** — a premise list treated as permanent instead of as a snapshot. ⛔ **Criterion 1
> alone cannot catch that: a mover-set `✅ Done` says something closed the row, not that the premises
> are true.**

⚠️ **The class is not closed.** ⭐ **The argument that the mechanism behind this decay does not exist is
the standing case for `0171`'s durable-citation work and `0306`'s sweep** — ⛔ **neither of which this
row waited on.**

## Related
- [[tasks/sprint-9-settle-architecture-mds-truth-and-sweep-the-citation-rot]]
- [[tasks/add-adr-037s-worker-side-precedence-clause-to-the-universal-rules-block]]
- [[tasks/add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules]]
- [[tasks/investigate-the-skill-ownership-fact-inventory-gap]]
- [[tasks/write-the-durable-citation-anchors-convention-page]]
- [[tasks/sweep-the-stale-rank-citations]]
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]]
- [[decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry]]
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]]
