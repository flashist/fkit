# Decide the sanctioned repair path for a half-landed close — ADR, then the reconcile mode

## ID
0134

## Sprint
Sprint 9

## Priority
P5

## Status
✅ Done (agent-closed — not owner-verified)

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
- **⚠️ RELATIONSHIP TO `0229`, added 2026-08-06 — read this before writing question 3's answer.**
  Task [`0229`](../../done/0229-widen-task-done-to-repair-a-brief-that-contradicts-a-landed-close/brief.md)
  (*widen `/fkit-task-done` to repair a brief whose `## Status` contradicts a landed close*) covers a
  **subset of this ADR's question 3** — question 3's candidate set already names *"the brief's own
  `## Status` when the board is the side that landed"*, which is precisely `0229`'s `0021`/`0041`
  case.
  **Owner ruling 2026-08-06, verbatim: *"Ship 0229 standalone."*** (`AskUserQuestion`, live `fkit
  lead` session.) **This brief is deliberately NOT narrowed** — the owner rejected the *"narrow 0134"*
  option by name. Question 3 stays exactly as written and this ADR still rules on the full case.
  **What that means for the architect writing this ADR:** by the time it is written, a narrow
  owner-gated exception for that one case may **already be shipped** in
  `claude/skills/fkit-task-done/SKILL.md`. **Read the file before assuming the ground is clear**, and
  rule explicitly on whether the wider mode **subsumes, keeps, or replaces** that exception. Ruling
  on it silently is the failure mode. **This is a scope overlap the owner accepted, not a defect to
  report.**
- No commit — leave the ADR in the working tree.

> ## ⭐ DATED CORRECTION 2026-09-13 — OWNER RULING: **question 1 is settled — the mode exists, producer-only.** Every prior byte left identical.
>
> **The owner ruled, live via `AskUserQuestion` in a live `fkit lead` session with the owner present,
> on 2026-09-13 — verbatim option label: *"Producer-only reconcile mode (Rec)"*.** This note is the
> amendment; ⛔ **the brief's existing text above is deliberately left byte-identical**, per the
> superseded-text convention. The seven questions are **not** deleted — the ADR still answers all of
> them. What the ruling settles is the **shape of the answer** to questions 1, 2 and 5.
>
> ### What the ruling decides
>
> | question | settled by this ruling |
> |---|---|
> | **1. Does the mode exist at all?** | **Yes.** The *"keep it owner-only"* alternative is **rejected**. `0135` is therefore **not** cancelled. |
> | **2. Who may invoke it?** | **Producer-only**, matching ADR-033 §1 — and a **spawned** producer qualifies. That is the whole point of the mode and, as the brief already says, the whole risk. |
> | **5. Detection rule** | The brief asked *"does it require the disagreement to be present, and refuse when both locations already agree?"* — **yes, it must REFUSE when both locations already agree.** See the two constraints below. |
>
> ### ⛔ The two constraints the owner accepted the option **on** — they are part of the ruling, not commentary
>
> 1. **The mode MUST REFUSE when both locations already agree.** A run with no live disagreement
>    between the brief and the board is **not** a half-landed close and the mode must decline it. The
>    disagreement is the precondition, not merely the motive.
> 2. **The mode MUST NEVER upgrade the agent-closed marker.** `✅ Done (agent-closed — not
>    owner-verified)` must never become plain `✅ Done` through this mode. That upgrade is the owner's
>    single act of verification and stays owner-only.
>
> Both belong in the ADR's **must-never** list (question 4), which already names the second; the first
> is now binding as well. ⚠️ These two are **conditions of the approval** — an ADR that ships the mode
> without both stated is not what the owner approved.
>
> ### The owner's stated reason for preferring this option
>
> ⭐ **The value is not the mode itself.** The owner's reason, recorded because it should steer how the
> ADR is written: preferring this option **forces a written must-never list and a precise detection
> rule onto the record**. The artifact of worth is the constraint list, not the feature. An ADR that
> ships the mode but leaves either the must-never list or the detection rule vague has delivered the
> part the owner did not value and skipped the part they did.
>
> ### ⚠️ `0135` is now unblocked
>
> [`0135`](../../backlog/0135-add-producer-only-reconcile-mode-to-task-done/brief.md) — the four-file doctrine
> change this task blocks — was gated on this ADR being approved. Question 1 no longer threatens to
> cancel it. ⛔ **The brief's standing instruction *"Do not begin 0135 before this ADR is approved by
> the owner"* still applies unchanged**: the *decision* is made, the **ADR is still unwritten**. `0135`
> is unblocked in the sense that its premise is secure, not in the sense that it may start now.
>
> ### ⭐ Question 6 re-measured on disk 2026-09-13 — the asymmetry is real
>
> ⚠️ **Measured independently for this note, not inherited from the brief.** The brief's question 6
> asks whether `/fkit-task-cancelled` needs the mirror mode, and says to *verify against the file
> rather than assuming symmetry*. Verified:
>
> | file | repair exceptions found | gated to |
> |---|---|---|
> | `claude/skills/fkit-task-done/SKILL.md` | **two** — the *owner-verification upgrade* and the *contradicted-close repair*, both at step 1 (`SKILL.md:81-107`) | **both owner-only.** The second states it explicitly: *"never fire for a non-owner identity — a producer **spawned** to close is an agent (ADR-033 §5) and stops here"* |
> | `claude/skills/fkit-task-cancelled/SKILL.md` | **none at all** — step 1's *"already in `ai-agents/tasks/cancelled/` (nothing to do — say so)"* (`SKILL.md:85`) has **no exception branch of any kind** | n/a |
>
> ⚠️ **Caveat on the measurement:** both skill files carry **uncommitted working-tree edits** from
> task `0381` at the time of measuring. The figures above are the **on-disk** state of 2026-09-13, not
> a committed state. Re-measure before writing the ADR.
>
> **What this means for the ADR.** The asymmetry is not a symmetry that was overlooked — the two
> movers are in genuinely different positions today. `/fkit-task-done` already has an owner-only repair
> door; `/fkit-task-cancelled` has no door at all. Question 6 must rule on whether the mirror mode
> **opens a first door** in `fkit-task-cancelled`, which is a larger step than widening an existing
> one. Note that `0342` (*mirror the self-locator repair rule into `fkit-task-cancelled`*) is a
> separate, already-filed instance of the same asymmetry.
>
> ### Status unchanged
>
> ⛔ **This row stays `🔲 Backlog`.** The ruling makes the ADR **writable**, not written. Nothing here
> closes anything.
