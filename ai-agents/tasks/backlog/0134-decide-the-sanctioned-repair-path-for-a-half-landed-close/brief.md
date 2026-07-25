# Decide the sanctioned repair path for a half-landed close — ADR, then the reconcile mode

## ID
0134

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**The gap, verified against the mover — not asserted.** Once a close has moved a task folder into
`ai-agents/tasks/done/`, a stale status row or a stale href left behind by that close can be repaired by
**nobody but the owner**:

- `/fkit-task-done` **stops** when the folder is already under `ai-agents/tasks/done/`
  (`claude/skills/fkit-task-done/SKILL.md:60-64`), and its one exception — the owner-verification upgrade
  — is explicitly **owner-only**: *"An agent hitting this case still stops: only the owner can upgrade."*
- `✅ Done` is **skill-gated** and may never be hand-edited (`claude/skills/fkit-task-done/SKILL.md:265-267`).

So an agent-side remedy would require either re-entering the mover (it refuses) or hand-writing a status
(forbidden). There is no third door.

**Where this came from.** Task 0123 review finding **R1** (Codex-raised, coder-verified), with **R6** as
its follow-on. Both ship-loops now state the limit **honestly** — the half-landed branch marks only the
stale location `🚧 Blocked — hand-off incomplete`, leaves any landed `✅ Done` untouched, and escalates to
the owner. That is accurate reporting of a real gap. **The gap itself is unowned. This task owns it.**

**Why this is an ADR before it is an edit.** Adding a repair mode to the mover changes the mover's
contract, and the mover's contract is where fkit's anti-laundering story lives
([ADR-025](../../../knowledge-base/decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md),
reversed by
[ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
A mode that lets an agent write into an already-closed task's records re-opens ground ADR-033 just closed,
and the value of the whole thing sits in its **must-never** list. This is not a place for confident prose:
0123 ran **three review rounds on exactly this logic**, and each of the first two found a defect *inside*
the previous round's fix. Decide it on the record, then implement (task 0135).

## What to build

An ADR under `ai-agents/knowledge-base/decisions/` via `/fkit-record-decision`, answering **all** of:

1. **Does the mode exist at all?** The live alternative is *keep it owner-only* — the gap is rare, is now
   reported honestly by both loops, and every escalation reaches a human. Say why that loses, or accept it
   and close 0135 as cancelled. **A decision to do nothing is a valid outcome of this task.**
2. **Who may invoke it.** Producer-only (matching ADR-033 §1), or owner-only-but-easier? If producer-only,
   note that a **spawned** producer qualifies — which is the whole point, and also the whole risk.
3. **What it MAY write.** Candidate set: a sprint-row status cell that disagrees with a landed
   `✅ Done` in the brief; a stale href left pointing at `backlog/`; the brief's own `## Status` when the
   board is the side that landed.
4. **What it MUST NEVER write** — the load-bearing half:
   - Never upgrade `✅ Done (agent-closed — not owner-verified)` to plain `✅ Done`. That upgrade is the
     owner's single act of verification and must stay owner-only.
   - Never create a `✅ Done` anywhere if **no** landed close exists (that is a close, not a repair — it
     goes through the ordinary mover from `backlog/`).
   - Never touch a task whose folder never moved (the ordinary mover handles that; re-spawning it works).
5. **How the mode recognises a genuine half-landed close** versus a request to re-touch a finished task.
   State the detection rule precisely enough to implement. Consider: does it require the *disagreement*
   to be present, and refuse when both locations already agree?
6. **Does `/fkit-task-cancelled` need the mirror mode?** It has the same structure and presumably the same
   gap. Verify against the file rather than assuming symmetry, and rule.
7. **What it does to ADR-033 §The limit.** ADR-033 accepts a named residual: routing separates the closing
   *identity*, not the judgment. Does this mode widen that residual, and is the widening acceptable?

## Verification steps

1. An ADR exists under `ai-agents/knowledge-base/decisions/`, numbered without collision
   (`test/adr-number-uniqueness.test.js` guards this — run the suite).
2. It answers all seven questions above, each visibly, including a stated **must-never** list.
3. It records the rejected option — *keep it owner-only* — with why it lost, per the ADR format.
4. It states whether `/fkit-task-cancelled` is in or out of scope, **with the file checked**, not assumed.
5. It rules explicitly on the three ADR-033 carve-out sites (see 0135's notes) — whether they survive, get
   amended, or get removed if the mode lands.
6. Task 0135's brief is readable against the ADR without a remaining open decision.

## Notes

- **Owner:** fkit-architect (this is a decision record, not an implementation).
- **Depends on:** nothing. The ADR can be written now; it does not touch the mover file.
- **Blocks:** 0135.
- **Source:** task 0123 review findings **R1** (and its follow-on **R6**), recorded as an accepted
  residual in [0123's ledger](../../done/0123-route-sprint-ship-loop-close-to-producer/review.md) and
  named as follow-up 1 in
  [0123's worklog](../../done/0123-route-sprint-ship-loop-close-to-producer/worklog.md).
- **Filed 2026-07-25** by the producer, on the 0123 ship-loop's hand-off (the loop names follow-ups; the
  producer files them).
- **⚠️ Do not begin 0135 before this ADR is approved by the owner.** The unknown here is a governance
  boundary, not a technical one — the implementation is small and the decision is the hard part.
- No commit — leave the ADR in the working tree.
