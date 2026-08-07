# ADR-038: A loop step's role is fixed by the skill the step runs, not by the deliverable's author

**Date**: 2026-08-06
**Status**: accepted

> **What this ADR decides, in one line:** which role runs a loop step is derived from the **skill the
> step runs** — never from who authored the deliverable under that step. Concretely: the sprint loop's
> Process-review step is **always `@fkit-coder`**, whoever wrote the work product.

## Context

ADR-037 settled how a skill rule binds a *spawned* worker and **explicitly left the invocation axis
open** — *"which skill a role may run at all."* This ADR closes that axis for loop steps.

The forcing incident: on a single 2026-08-02 sprint-loop driver run, the driver spawned the wrong role
for the Process-review step on **three consecutive tasks** — routing the step to the deliverable's
*author* (an architect, for design documents) instead of the step's owning role. The ADR-018 hook
worked correctly everywhere it was reached; **the failure was role selection upstream of any skill
invocation**, so no hook could see it.

The owner ruled the question in task `0200` (closed 2026-08-05) and authorized this record on a named
2026-08-05 ruling (*"authorize a producer follow-up to file ADR-038"*); the plan was approved via
`AskUserQuestion` in the live lead session 2026-08-06. The full reasoning lives in
`ai-agents/knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md` — the ADR
records the decision and cites the report; it deliberately does not restate it.

## Decision

**A loop step's role is fixed by the skill the step runs, not by the deliverable's author.**

- The Process-review step is always `@fkit-coder`, because `fkit-process-stateful-review` writes the
  review ledger's coder-owned section and its Step 6 applies approved code fixes — neither changes
  when the deliverable is a document.
- Chosen: option **(a)** — the loop states the rule plainly, in an **enumerated** row carrying its
  reason — **with option (c)'s paired misroute detector as a non-optional companion** (task `0224`).
- **Rejected: (b)** — granting `fkit-process-stateful-review` to the architect in `skills_for_role()`.
  It hands a source-write procedure to a design-only role; the grant is **total or absent** (no
  per-artifact scoping exists); and the premise ("the author processes its own review") generalizes to
  four of seven roles, widening the coder's sole-source-write authority four ways.
- **Rejected as sufficient: (c) alone** — a detector detects rather than prevents, and leaves the loop
  row's method cell unenumerated.

**Accepted tradeoff — prose, not prevention.** The ADR-018 hook gates skill *invocation*; a driver
that spawns the wrong role and tells it to work **by hand** never reaches the gate. What is accepted
is a prose rule plus a durable detector **in place of prevention** — the same shape ADR-033 states
about its own residual. The detector's record is durable, not tamper-proof (ADR-022 leaves every role
but the adversarial reviewer tool-unrestricted).

**Gate non-reimposition:** the rule governs *role selection* only — the loop's single up-front
approval still replaces the stateful-review skill's per-round owner gate (ADR-019 / ADR-032), and the
row's "apply … method" construction stays.

## Consequences

- Every loop step that runs a skill has a **derivable owner**: look its skill up in
  `skills_for_role()` (`claude/skills-for-role.sh`). Two current sprint-loop steps (Build, Verify) run
  no skill; their roles come from the loop's enumerated step table.
- (b)'s rejection is on the record, so the next architect-authored deliverable does not re-open the
  argument. The ADR carries a `Re-raise only if` clause (per-artifact grant scoping appears; the owner
  re-rules `0200`; a loop step appears whose role the rule cannot resolve).
- Implementation follow-ups are separate, already-filed tasks — `0223` (row enumeration; **the only
  task genuinely depending on this ADR**, and only for its reason clause), `0224` (the paired
  detector), `0225` (loop-row↔ownership test), `0226`, `0232`, `0233`. `0224`/`0225`'s declared
  dependencies on `0222` were **owner-relaxed 2026-08-06** (*"Relax 0224 and 0225."*).
- The ADR notes on the record that ADR-012 names a **stale home** for `skills_for_role()`
  (`claude/fkit-claude.sh`); the function lives in `claude/skills-for-role.sh` — cite the file.
- Number allocation ran the mandatory **four-way sweep** (`decisions/`, `reports/`, boards, vault —
  the ADR-029 precedent) with evidence in the ADR itself: zero rival claimants for 038.

## Related
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — left the invocation axis open; this ADR closes it for loop steps
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the *route-don't-widen* precedent, and the prose-plus-detector honesty this ADR reuses
- [[tasks/decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill]] — task `0200`, the ruling and the full reasoning this ADR records
- [[tasks/record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — task `0222`, the recording task (Sprint 3 P4)
- [[tasks/sprint-3-close-the-rank-integrity-loop]] — the board it shipped on
- [[tasks/sprint-2-remove-omnigent]] — the board `0222` was carried from (frozen `P189`) — see its dated correction on the `0200` row
- [[tasks/design-the-post-update-structure-check]] — task `0241`, corroborating practice: its own steps were routed by skill, not by the deliverable's author
- Cited, not reopened: ADR-018 (invocation hook), ADR-019 / ADR-032 (loop approval model), ADR-022
  (tool-unrestricted roles), ADR-012 (single ownership declaration; stale path noted)
- Source: `ai-agents/knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md`, `ai-agents/knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md`
