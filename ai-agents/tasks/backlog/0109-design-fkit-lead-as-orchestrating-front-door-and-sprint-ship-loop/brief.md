# Design fkit-lead as the orchestrating front door, and the `fkit-sprint-ship-loop` skill

## ID
0109

## Sprint
Sprint 2

## Priority
91

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

The owner wants a **single point of interaction** with the fkit team: one agent they open per
terminal, that is aware of the whole toolkit, knows each role's responsibilities, and spawns/drives the
other roles as needed — so they don't have to open a session per role until they genuinely need to.

**Owner rulings taken this session (2026-07-22):**
- **The front door is `fkit-lead`, evolved.** Rather than add a new role, grow the existing `fkit-lead`
  into *the* single-point-of-interaction **doer/orchestrator**, absorbing its current routing remit and
  gaining the ability to drive the team. **The name stays `fkit-lead`.**
- **Owner decisions are relayed live.** When driven work needs an owner decision, the orchestrator
  **pauses, asks the owner in its own session, and resumes** — it does not run blind. The orchestrator
  *is* the owner's live channel.
- **Design first.** This task is design/feasibility only. Implementation is scoped afterward, once the
  owner has reviewed the spec.

**This collides with several locked decisions — the design must resolve each, not plan around it:**
- **`fkit-lead` is deliberately NOT a doer** (`claude/agents/fkit-lead.md:20`; ADR-010). Making it drive
  work **reverses** that stance and needs an ADR.
- **Spawned agents have no owner channel** — `AskUserQuestion` is session-only, absent in consults
  (ADR-021). The "relay live" model must supply the mechanism ADR-021 says a spawned agent lacks.
- **The coder's `task-ship-loop` is session-only and refuses a spawned/headless invocation** (task
  0055). An orchestrator therefore cannot simply "spawn a coder and run its ship-loop."
- **The coder's plan/fix approval gates need the owner present**, and **ADR-024 declined** an
  auto-proceed on owner questions *for a single task* on cost. This asks for owner-in-the-loop
  automation at **sprint scale** — the live-relay model is the owner's chosen answer to that cost.
- **Task closure is owner-gated with an honesty marker** (ADR-025 — an agent-performed close carries
  `(agent-closed — not owner-verified)`). Any loop that closes tasks must honor this.
- **Team-shape docs say "seven roles"** (ADR-028 authorized an eighth, not built). Evolving `fkit-lead`
  adds no role but changes its nature — the docs describing it must stay accurate.

The skill the owner named — *"fkit-spec sprint-ship-loop"* — is read here as a working name
**`fkit-sprint-ship-loop`**: the sprint-scope analogue of the coder's task-scope ship-loop. The final
skill name is a design output, not fixed.

## What to build

**A design/feasibility spec** (a report under `ai-agents/knowledge-base/reports/`, per the design-spec
procedure) that answers, grounded in the actual source and ADRs — **no implementation, no code beyond
interface/contract description:**

1. **Feasibility of driving the team from one agent.** Establish *whether and how* `fkit-lead` can spawn
   and drive the other roles given (a) `task-ship-loop` refuses spawned invocation and is session-only,
   and (b) ADR-021 denies spawned agents the owner channel. Name the mechanism concretely — spawned
   subagent consults vs. launched sessions, and what each buys and costs against role-lock (ADR-010).
2. **The live owner-relay gate.** Specify how a driven sub-task surfaces an owner decision back up to the
   `fkit-lead` session, how the loop pauses and resumes on the answer, and how this differs from the
   ADR-024 auto-proceed that was declined. This is the load-bearing mechanism — if it can't be built,
   the whole feature changes shape.
3. **The evolved `fkit-lead`.** Specify the reversal of the non-doer stance, how it absorbs its current
   routing role while gaining orchestration, and the launcher/menu implications
   (`skills_for_role()` in `claude/fkit-claude.sh`, menu option 7).
4. **The `fkit-sprint-ship-loop` contract.** Model it on the coder's `task-ship-loop` at sprint scope:
   task selection (priority + dependency order read from the sprint plan / `dashboard.sh`), which roles
   it drives per task and in what order (build → review → close), how it honors the owner-gated close
   (ADR-025) and the live-relay gate, its stop conditions, and how it reports progress to the owner.
5. **The ADR(s) to record.** At minimum one reversing/amending ADR-010's "lead is not a doer"; likely
   one for the orchestration topology + owner-relay model. Note the ADR-021 / ADR-024 / ADR-025
   interactions explicitly.
6. **The follow-on implementation tasks**, scoped as a recommendation with dependency links (agent-def
   change, the skill build, launcher/`skills_for_role` wiring, docs, wiki sync) — **to be filed only
   after the owner reviews this design.**

**Explicitly out of scope:** implementing the agent, writing the skill, editing the launcher or any
source, and any wiki write. Interface/contract description only.

## Verification steps

1. A design spec exists under `ai-agents/knowledge-base/reports/` and makes **no source changes**.
2. It answers the **feasibility question** with evidence cited from the real files — `fkit-claude.sh`,
   `task-ship-loop`'s SKILL, and ADR-010/021/024/025/028 — not from assumption. It names the spawn
   topology and the owner-relay mechanism concretely, or states plainly if one is infeasible.
3. It defines the `fkit-sprint-ship-loop` contract: task selection, driven roles + order, the
   owner-relay gate, the owner-gated close, and stop conditions.
4. It enumerates the ADR(s) to record and the follow-on implementation tasks with their dependencies.
5. The owner reviews and approves the design **before** any implementation task is scoped.

## Notes

- **Owner rulings (2026-07-22, this session):** front door = evolve `fkit-lead` (keep the name); relay
  owner decisions live; design-first.
- **Conflicts/dependencies to resolve (not plan around):** reverses ADR-010 non-doer (needs ADR);
  ADR-021 (spawned agents lack the owner channel); `task-ship-loop` is session-only / refuses spawned
  invocation (task 0055); ADR-024 declined single-task owner-question auto-proceed on cost; ADR-025
  owner-gated close + honesty marker; ADR-028 team-shape/"seven roles" doc accuracy.
- **Depends on:** nothing — the design can start now.
- **Blocks:** the follow-on implementation tasks (evolve `fkit-lead` + build `fkit-sprint-ship-loop` +
  launcher/docs/wiki), which are scoped only after this design is reviewed with the owner.
- **Consult:** the architect is expected to put the feasibility unknowns to the owner during the design;
  the producer is available for product scope.
- **⚠️ Sprint-fit flag:** filed to **Sprint 2** per the owner's "current sprint" instruction, but Sprint
  2's theme is the Omnigent removal and it is 82/90 done. This new-feature design is thematically a
  **Sprint 3** candidate. Flagged for owner confirmation.
- **Name flag:** `fkit-sprint-ship-loop` is a working name for the owner's *"fkit-spec sprint-ship-loop"*;
  the final skill name is a design output.
