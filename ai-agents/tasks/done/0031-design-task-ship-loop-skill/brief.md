# Design the coder's `task-ship-loop` skill — the autonomous brief-to-done loop

## ID
0031

## Sprint
Sprint 2

## Priority
52

## Status
✅ Done

## Owner
fkit-architect

## Context

**The owner's ask (2026-07-17):** a coder skill, working name `task-ship-loop`, that takes a task
from brief to done with **minimal owner involvement** — the coder works as independently as possible,
collaborating with other agents where needed, while *"important questions still can and should be
asked from the user."* The owner sketched a 13-step loop (reproduced in full below) and ruled, in the
same breath: **the sketch is not final** — the coder/architect/producer are to work out the best
version together, and **the loop's steps must be approved by the owner before implementation**.

This is therefore a **design task** (the 40/41 and 42/43 pattern): settle the loop with the owner,
then task 53 builds the approved design. Nothing is implemented here.

### The owner's sketch — the input, verbatim in substance

1. Coder reads the task description. 2. Consults other agents if needed. 3. Prepares the work plan.
4. Asks the owner questions if needed. 5. Implements the plan. 6. Tests with help of sub-agents where
possible. 7. On verification failure: plan fixes, consult if needed, repeat 4–7 until verification
passes. 8. Asks the reviewer for a **stateful review** (`/fkit-stateful-review`). 9. Processes it with
`/fkit-process-stateful-review`. 10. Asks the owner questions if needed. 11. Repeats 4–10 until the
stateful review completes. 12. Final report: task filename, problems encountered, lessons learned,
open questions. 13. Asks the owner whether to mark the task done; on Yes, has the producer sub-agent
run the task-done skill.

### ⚠️ Known conflicts the design MUST resolve — flagged, not planned around

1. **Step 13 collides with a universal hard rule.** Task files move **only via the owner-invoked**
   `/fkit-task-done` — "owner-invoked" today means *the owner runs it in a producer session*. A
   coder-spawned producer consult running the mover on the coder's relay of a "Yes" changes the
   consent chain. Precedent exists (2026-07-17: the owner authorized the producer session to run the
   mover after a delegated task, owner present and ruling in-channel) — but generalizing it into an
   unattended loop is a **consent-model decision for the owner**, possibly an ADR. The design must
   propose the mechanism (e.g. the loop *ends* by asking, and the owner closes via the normal path;
   or a relayed-consent form with the owner's Yes recorded) and the owner must rule.
2. **The coder's own contract says the opposite of "autonomous."** `fkit-coder.md`: *"NOT for
   background delegation — implementation needs the owner present for its plan and fix approval
   gates."* Task 17 restored plan mode as the gate. A loop that minimizes owner involvement
   redefines when those gates fire (e.g. one up-front plan approval covering the whole loop vs
   per-fix approvals). That is a deliberate amendment to the coder's contract — owner decision, to be
   settled in this design, not discovered in review of task 53.
3. **Sub-agents cannot ask the owner questions.** Steps 4/10 work because the *coder session* asks —
   but any agent the loop spawns (reviewer, architect, producer) returns open questions in its reply;
   it cannot reach the owner mid-chain. **Task 39** (AskUserQuestion investigation, `🔲 Backlog`)
   is exactly this seam. The design must either work within today's envelope (all owner contact
   funnels through the coder session) or declare a dependency on task 39's findings.
4. **The two-hop consult envelope and no-cycles rule** (ADR-010) bound step 2 and step 8: the loop's
   collaboration patterns must fit hop budgets, or propose their change (owner decision + ADR).
5. **The coder→reviewer spawn works today** — the task-43 PreToolUse hook fixed it. The design builds
   on that, not around it.

## What to build

A design, worked out with the named collaborators and put to the owner for approval:

- **The loop, step by step** — start from the owner's 13-step sketch; keep its intent (maximal
  independence, owner asked only what matters); change what the collaborators can justify. Every
  deviation from the sketch is listed with its reason.
- **Consultation happens during design, per the owner's instruction:** the designing agent consults
  **fkit-producer** (process/lifecycle fit: statuses, movers, briefs, reporting) and works within the
  coder's implementation reality. Respect the hop budget.
- **Explicit rulings for conflicts 1–4 above**, each stated as a proposal the owner can approve,
  amend, or reject — including whether any ADR or agent-contract amendment is needed.
- **The owner-contact contract:** which loop events REQUIRE stopping for the owner (the "important
  questions"), which proceed autonomously, and what the final report contains (the owner's step-12
  list: task filename, problems, lessons, open questions — is the floor, not the ceiling).
- **Failure and exit behavior:** what the loop does when verification cannot pass, when a review
  loops without converging, or when a consult dead-ends — it must end in a report, never a silent
  stall.
- **Skill mechanics** (shape only; task 53 implements): name (`fkit-task-ship-loop` unless the design
  argues otherwise), argument (a task-brief path, per the one-skill-one-output convention — operand,
  no output variants), registration in `skills-for-role.sh` for the coder, hook coverage.
- **Deliverable:** a design spec in `ai-agents/knowledge-base/reports/` (dated, per the house
  pattern) — **ending with the step list the owner is asked to approve.**

## Verification steps

- A dated design spec exists in `ai-agents/knowledge-base/reports/`.
- It addresses **all five** flagged conflicts explicitly — none silently dropped or "resolved" without
  an owner-facing proposal.
- Every deviation from the owner's 13-step sketch is listed with a reason.
- The failure/exit behavior is specified — no path ends in a silent stall.
- The spec ends with a concrete, numbered loop the owner can approve as-is.
- **The owner has approved the loop steps** — this task is not complete until that approval is
  recorded (the design may iterate to get there).
- No implementation shipped: no new skill directory, no `skills-for-role.sh` change, no source edits.

## Notes

- **Owner: fkit-architect** — the conflicts are contract/mechanism design (consult envelope, hook
  coverage, agent-contract amendment); consults **fkit-producer** for the lifecycle fit, per the
  owner's instruction that producer and architect both shape the loop. The owner is present for the
  approval gate by definition.
- **Depends on: nothing** (task 39's findings would *inform* conflict 3, but the design may instead
  scope within today's envelope — the design decides and says which).
- **Blocks: task 53 — hard.** No implementation before the owner approves the steps.
- **Recommended for an adversarial pass before owner review** — the 20/29 precedent: both of those
  rev-1 designs lost their headline to a Codex pass.
- Naming note: task 50 renames the *producer's* `task-plan` skill for name-collision reasons — the
  design should sanity-check `task-ship-loop` against the existing skill vocabulary for the same
  class of confusion.
