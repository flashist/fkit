# Decide the sanctioned repair path for a half-landed close — ADR, then the reconcile mode

**Source**: `ai-agents/tasks/done/0134-decide-the-sanctioned-repair-path-for-a-half-landed-close/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 9 · `P5` · `0134` · ✅ Done (agent-closed — not owner-verified)

> ⚠️ **Filed 2026-07-25. Closed 2026-09-16.** ⭐ **It sat for nearly two months** — the oldest row on
> Sprint 9 by a wide margin.

## Goal

**The gap, verified against the mover rather than asserted:** once a close has moved a task folder into
`tasks/done/`, a stale status row or href left behind by that close can be repaired by **nobody but the
owner**.

- `/fkit-task-done` **stops** when the folder is already under `done/`, and its one exception — the
  owner-verification upgrade — is **owner-only**: *"An agent hitting this case still stops: only the
  owner can upgrade."*
- `✅ Done` is **skill-gated** and may never be hand-edited.

⛔ **So an agent-side remedy would require either re-entering the mover (it refuses) or hand-writing a
status (forbidden). There is no third door.**

### ⭐ Why an ADR before an edit

**Adding a repair mode changes the mover's contract, and the mover's contract is where fkit's
anti-laundering story lives.** A mode that lets an agent write into an already-closed task's records
**re-opens ground ADR-033 just closed**, and ⭐ **the value of the whole thing sits in its *must-never*
list.** ⛔ ***"This is not a place for confident prose:"*** `0123` ran **three review rounds on exactly
this logic**, and each of the first two found a defect *inside* the previous round's fix.

## Key Changes

**Seven questions the ADR had to answer** — does the mode exist at all (⭐ *"a decision to do nothing is
a valid outcome of this task"*), who may invoke it, what it MAY write, ⭐ **what it MUST NEVER write —
the load-bearing half**, how it recognises a genuine half-landed close, whether
`/fkit-task-cancelled` needs the mirror, and what it does to ADR-033's named residual.

### ⭐ Owner ruling 2026-09-13 settled questions 1, 2 and 5 — verbatim *"Producer-only reconcile mode (Rec)"*

| Question | Settled |
|---|---|
| **1. Does the mode exist?** | **Yes.** *"Keep it owner-only"* is **rejected**; `0135` is therefore **not** cancelled |
| **2. Who may invoke it?** | **Producer-only**, matching ADR-033 §1 — ⚠️ **and a SPAWNED producer qualifies. That is the whole point of the mode and the whole risk** |
| **5. Detection rule** | ⛔ **It must REFUSE when both locations already agree.** The disagreement is the **precondition**, not merely the motive |

### ⛔ Two constraints the owner accepted the option ON — part of the ruling, not commentary

1. **The mode MUST REFUSE when both locations already agree.**
2. **The mode MUST NEVER upgrade the agent-closed marker.** `✅ Done (agent-closed — not
   owner-verified)` must never become plain `✅ Done` through this mode — ⭐ **that upgrade is the
   owner's single act of verification and stays owner-only.**

⚠️ ***"These two are conditions of the approval — an ADR that ships the mode without both stated is not
what the owner approved."***

### ⭐⭐ The owner's stated reason shapes the whole ADR

> ***"The value is not the mode itself … preferring this option FORCES a written must-never list and a
> precise detection rule onto the record. The artifact of worth is the constraint list, not the
> feature."***

⛔ **An ADR that ships the mode but leaves either the must-never list or the detection rule vague has
delivered the part the owner did not value and skipped the part they did.**

### ⭐ Question 6 re-measured on disk — the asymmetry is real, not an oversight

| File | Repair exceptions | Gated to |
|---|---|---|
| `fkit-task-done/SKILL.md` | **two** — the owner-verification upgrade and the contradicted-close repair | **both owner-only** — the second says so explicitly: *"a producer **spawned** to close is an agent (ADR-033 §5) and stops here"* |
| `fkit-task-cancelled/SKILL.md` | ⛔ **none at all** — its already-cancelled branch has **no exception of any kind** | n/a |

⭐ **So question 6 had to rule on whether the mirror mode OPENS A FIRST DOOR in `fkit-task-cancelled` —
a larger step than widening an existing one.**

⚠️ **The measurement's own caveat, which the Sprint 9 board re-flagged at the top of the board:** both
skill files carried **uncommitted working-tree edits from `0381`** when measured. ⛔ ***"An ADR that
records a state which does not survive the next commit is worse than no ADR"*** — the author was
required to re-measure and state the commit.

## Outcome

⭐ **Delivered as
[[decisions/adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker]]** —
**ten must-nevers and a six-clause detection rule as the deliverable**, with the mode as what they
constrain.

**Both of the owner's conditions are in it by name**, which is what Sprint 9's success criterion 9
required: *the ADR exists, AND is owner-approved, AND its "must never" list NAMES the agent-closed
marker* — ⛔ **all three conjuncts, or the criterion is missed.**

⭐ **Its other rulings:** it **copies, it does not resolve** — an owner-present producer running it also
writes the agent-closed value. ⭐ **A link is not a status** — a stale href alone never triggers it.
⭐ **Attribution is by link, never by nearness** — an unattributable line is refused, not guessed at.
⛔ **`/fkit-task-cancelled` gets NO mirror**, because that would open a *first* door onto the board
nobody audits.

⛔ **DECIDED, NOT BUILT.** `0135` implements it and remains open. ⚠️ **The brief's standing instruction
*"Do not begin 0135 before this ADR is approved by the owner"* was unblocked in the sense that its
premise is secure** — question 1 no longer threatens to cancel it.

⚠️ **Two named residuals were left OPEN, not filed as follow-ups:** in both, a plain `✅ Done` brief
means **no branch fires for anyone**, and the run *"escalates to an owner who has no door either."*

⚠️ **A scope overlap the owner accepted, not a defect:** `0229` had already shipped a narrow owner-gated
exception covering a subset of question 3 (owner ruling 2026-08-06, *"Ship 0229 standalone"* — ⛔ **the
*"narrow 0134"* option was rejected by name**). ⭐ **The ADR had to rule explicitly on whether the wider
mode subsumes, keeps or replaces it** — *"ruling on it silently is the failure mode."*

## Related
- [[tasks/sprint-9-settle-architecture-mds-truth-and-sweep-the-citation-rot]]
- [[decisions/adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker]]
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]]
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]]
- [[tasks/widen-task-done-to-repair-a-brief-that-contradicts-a-landed-close]]
- [[tasks/route-sprint-ship-loop-close-to-producer]]
- [[tasks/repair-the-moved-folders-own-self-locators-in-task-done]]
- [[systems/role-locked-sessions]]
