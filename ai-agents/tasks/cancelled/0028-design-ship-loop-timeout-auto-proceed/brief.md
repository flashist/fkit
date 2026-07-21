# Design a timeout-auto-proceed for the ship-loop's owner questions

## ID
0028

## Sprint
Sprint 2

## Priority
59

## Status
⛔ Cancelled (2026-07-18) — feasible but declined on cost per ADR-024; safe version = launch-mode + gate re-expression + session-global user-scope AFK timer, not worth the convenience

## Context

**The owner's ask (2026-07-18):** in `fkit-task-ship-loop`, the owner-question stops currently **block
forever** — if the owner doesn't reply, the whole loop is stuck. Instead: when the loop asks a
question, the coder should **present options with one marked *recommended*, and if the owner does not
reply within ~30 seconds, proceed with the recommended option.** The owner said *"if possible"* — the
feasibility is explicitly part of the question.

This **modifies the approved ship-loop** ([spec](../../../knowledge-base/reports/2026-07-17-design-task-ship-loop-skill.md),
[ADR-019](../../../knowledge-base/decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)),
so it is scoped design-first: settle feasibility and the contract with the owner, record the ADR-019
amendment, then task 60 builds it. Nothing is implemented here.

### ⚠️ The gating unknown — feasibility, and it is a claim to RUN, not reason about

**Claude Code is turn-based. There is no established ambient wall-clock timer that re-invokes the
model "30 seconds later" if the human is silent** — a turn ends and the human replies whenever. Whether
a "wait 30s, then proceed on the default" is *expressible at all* in the runtime is the **central
open question**, and the precedent is expensive: `AskUserQuestion` looked obviously capable and the
task-39 investigation found it **session-only, 0/3 then 0/2** into a consult
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
Per [`evidence-before-assertion`](../../../knowledge-base/conventions/evidence-before-assertion.md)
(task 24): **this must be tested against the running binary, not asserted.** Candidates the design
must actually probe: does `AskUserQuestion` (just granted, ADR-021) support a timeout/default-on-no-
response? Can a session skill express a timed auto-continue any other way? **If the runtime cannot do
a timed auto-proceed, the literal ask is impossible** and the design proposes the closest achievable
alternative (below), rather than pretending.

### ⚠️ Hard conflicts — which gates this may touch, flagged before any solution

The ship-loop has three kinds of owner stop (spec §6.1, §11). **They are not equivalent, and
auto-proceeding is not safe on all three:**

1. **The done-gate (P6) — MUST be excluded.** Auto-proceeding "mark it done" after 30s would move a
   task to Done without the owner — routing around the **owner-invoked `/fkit-task-done` mover**, a
   universal hard rule that **D1 deliberately preserved** (the loop already "does NOT move task files").
   A timeout here re-opens a decision the owner just closed. **Not eligible.**
2. **The plan-approval gate (P1) — ADR-019's central guarantee.** It is *"the one unremovable upfront
   human checkpoint"* — the property the whole autonomy design rests on. Auto-approving a plan after
   30s guts it. The design's **default recommendation: exclude it too.** If the owner wants it
   included, that is an explicit, recorded weakening of ADR-019's core — an owner ruling, not a default.
3. **The mid-loop "important questions" (verify-budget, review judgment calls, non-convergence) — the
   plausible target.** These are the option-picking stops. A recommended-default-on-timeout here
   *extends* the existing "obvious winner" autonomy (spec §6.1) from no-brainers to genuine judgment
   calls with a default. **This is where the feature likely lives** — and even here it changes ADR-019's
   claim level (it makes a *judgment* call autonomously, not just a dominant one).

## What to build

A design spec in `ai-agents/knowledge-base/reports/` (dated), owner present for the rulings, that:

- **Determines feasibility by experiment** — can the runtime express a ~30s timeout-then-default on an
  owner question? Report the method and result (the task-39 rigor). State the Claude Code version.
- **If feasible:** specify the mechanism — how a question carries its options, how one is marked
  *recommended*, how the timeout fires, and what the loop logs when it auto-proceeds (the worklog
  decision-log must capture every auto-picked default, same as "obvious winner").
- **If not feasible:** propose the closest achievable alternative and recommend it plainly — e.g. an
  **up-front, per-run "you may proceed on recommended defaults for class X" grant** that converts the
  relevant stops into logged autonomous choices (no timer needed), or a documented "the loop waits;
  here is how to unstick it." Do not invent a timer the runtime doesn't have.
- **Rules the gate scope explicitly:** done-gate excluded (hard); plan-gate excluded by default unless
  the owner rules otherwise; the mid-loop important-questions as the target. Each as an owner-approved
  line.
- **The 30s value:** confirm or set the timeout, and whether it is fixed or configurable (a configurable
  timeout would be an operand, not an output variant — fine under one-skill-one-output).
- **Records the ADR-019 amendment** the change requires (via `/fkit-record-decision`), including the
  claim-level shift (autonomous *judgment* defaults, not just obvious winners).
- **Ends with the decisions the owner approves** and the downstream tasks the approval spawns.

**Recommended: an adversarial pass before owner sign-off** — the 20/29/39 precedent; every one of those
rev-1 designs lost something to a Codex pass, and this one rests on an unverified runtime capability.

## Verification steps

- A dated design spec exists in `ai-agents/knowledge-base/reports/`.
- Feasibility is settled **by a run against the actual binary**, not reasoned — method and result
  recorded, version pinned.
- The gate-scope ruling is explicit: done-gate excluded; plan-gate disposition stated; target gates named.
- If infeasible, a concrete alternative is recommended — the spec does not specify a timer the runtime
  cannot fire.
- The ADR-019 amendment is recorded (or scoped as a spawned task) with the claim-level change stated.
- The owner has approved the resulting contract.
- No implementation shipped: no change to `claude/skills/fkit-task-ship-loop/`, no source edits.

## Notes

- **Owner: fkit-architect**, owner present for the rulings (it amends ADR-019 and touches the owner-
  contact contract). Consults fkit-coder for the runtime reality if useful.
- **Depends on: nothing** (builds on the shipped task-53 loop and ADR-021's tool grant).
  **Blocks: task 60 (implementation) — hard, including the owner's approval and the feasibility verdict.**
- **Conflicts flagged, not resolved here:** the done-gate hard rule (excluded), ADR-019's plan-gate
  guarantee (excluded by default), and the runtime feasibility unknown. The owner rules; the producer
  surfaces.
