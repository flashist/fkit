# Record ADR-038 — a loop step's role is fixed by the skill the step runs

**Source**: `ai-agents/tasks/done/0222-record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-06
**Sprint/Tag**: Sprint 3 P4 (carried from Sprint 2, frozen `P189` there) · ID `0222` · owner fkit-architect

## Goal

Record the decision task `0200` already took — *"the Process-review step's role is fixed by the skill
the step runs, not by who wrote the deliverable: always `@fkit-coder`"* — as an ADR. Filed on a named
owner ruling of 2026-08-05 (*"authorize a producer follow-up to file ADR-038"*), **the only one of
`0200`'s named follow-ups the owner had authorized at filing**. Why an ADR and not a table row: it
closes the invocation axis ADR-037 §Context explicitly left open, the rule generalizes to every loop
step, and recording option (b)'s rejection is what stops the next architect-authored deliverable
re-opening the argument. Division of labour: **the ADR records the decision; the `0200` report
carries the reasoning**, cited by path and not re-narrated.

## Key Changes

Delivered [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] (accepted,
2026-08-06), with the mandatory **four-way number sweep** (`decisions/`, `reports/`, boards, vault —
the ADR-029 precedent) evidenced inside the ADR: zero rival claimants for 038. The ADR states the
accepted tradeoff honestly (**prose plus a durable detector, not prevention** — a driver working a
role by hand never reaches the ADR-018 gate), avoids re-imposing the per-round owner gate ADR-019/032
replaced, corrects the two residuals it was barred from copying forward (the 8/9 vs 7/8 mirror count;
the "outside the worker's control" overstatement), and carries a `Re-raise only if` clause.

## Outcome

The task's own board row became a record of decay corrected in place — **three dated corrections**,
originals byte-identical: (1) *"the other seven follow-ups are held, deliberately NOT filed"* was true
2026-08-05 and false by 2026-08-06 — **all were filed** (`0223`–`0226`, `0232`–`0233`; and the count
was seven distinct follow-ups, not eight); (2) its rank: carried onto fresh-board Sprint 3, where `P3`
was merit, then `P4` by the owner-ruled `0241` re-rank — its recorded merit statement's reason was
discharged, and the non-honoring is **flagged, then settled by owner ruling** (*"Leave it at P3."* on
the earlier promotion question); (3) its `Blocks:` claim narrowed twice — owner ruling *"Relax 0224
and 0225."* left **`0223`'s reason clause as the only thing this ADR genuinely blocks**, so two
runnable tasks stopped idling behind an unwritten ADR.

## Related
- [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — the deliverable
- [[tasks/decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill]] — task `0200`, the ruling this records
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — the axis it closes
- [[tasks/sprint-3-close-the-rank-integrity-loop]] — the board, including the carry and both re-rank rulings
- [[tasks/sprint-2-remove-omnigent]] — the source board (row frozen at `P189`, `➡️ Moved to Sprint 3`)
- [[systems/fkit]]
- [[tasks/enumerate-the-process-review-rows-method-steps-and-give-the-row-its-reason]] — *added 2026-08-29:* `0223`, whose row reason clause cites this ADR
- [[tasks/decide-how-the-ship-loop-handles-a-non-coder-owned-task-row]] — *added 2026-08-29:* `0270`, which discharged this ADR's closeout clause and produced [[decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1]]
