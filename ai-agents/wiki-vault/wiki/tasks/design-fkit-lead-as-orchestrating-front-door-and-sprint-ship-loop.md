# Design fkit-lead as the orchestrating front door, and the `fkit-sprint-ship-loop` skill

**Source**: `ai-agents/tasks/done/0109-design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 · ID 0109 · priority 91 · owner `fkit-architect`

## Goal

Design-and-feasibility only: establish *whether and how* one agent can drive the whole team, and specify the sprint-scope loop that would do it. **No implementation, no source changes, interface/contract description only.**

## Key Changes

The owner wanted a **single point of interaction** — one agent per terminal, aware of the whole toolkit, that spawns and drives the other roles so they need not open a session per role.

**Three owner rulings shaped it (2026-07-22):** the front door is `fkit-lead` **evolved, keeping the name** (not a new role); **owner decisions are relayed live** — the orchestrator pauses, asks in its own session, and resumes, rather than running blind; and **design first**, with implementation scoped only after review.

**The brief's real value is that it named the collisions up front and required each be *resolved*, not planned around:**

| Locked decision | The collision |
|---|---|
| ADR-010 — lead is deliberately **not a doer** | driving work **reverses** it; needs an ADR |
| ADR-021 — spawned agents have **no owner channel** | "relay live" must supply the mechanism ADR-021 says is absent |
| The coder's `task-ship-loop` is **session-only** and refuses spawned invocation | an orchestrator cannot simply "spawn a coder and run its ship-loop" |
| ADR-024 — declined auto-proceed on owner questions, on **cost** | this asks for owner-in-the-loop automation at **sprint** scale |
| ADR-025 — the honesty marker on an agent-performed close | any loop that closes tasks must honor it |
| ADR-028 — "seven roles" doc accuracy | evolving lead adds no role but changes its nature |

The skill name `fkit-sprint-ship-loop` was carried as a **working name** for the owner's *"fkit-spec sprint-ship-loop"*, with the final name flagged as a design output rather than fixed.

## Outcome

**Done.** Delivered `knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`, which produced **two ADRs** — [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] (the stance reversal, including the plan-gate honesty clause) and [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] (the loop's contract) — plus the follow-on implementation chain 0110 → 0117 with its dependency shape.

**The design also corrected a live doc drift it needed to reason from:** `architecture.md` still described the retired `skillOverrides` lock mechanism, which is the exact fact that decided feasibility. That correction was folded into [[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]] rather than left as cosmetic.

⚠️ The brief carried a **sprint-fit flag** — filed to Sprint 2 on the owner's "current sprint" instruction, though Sprint 2's theme is the Omnigent removal and this is thematically a Sprint 3 feature. The owner overrode the flag and kept it in Sprint 2.

## Related
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] · [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the two ADRs this produced
- [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] · [[tasks/build-fkit-sprint-ship-loop-skill]] · [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] · [[tasks/update-launcher-menu-help-for-conductor]] · [[tasks/amend-project-brief-for-lead-conductor]] · [[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]] · [[tasks/add-sprint-ship-loop-to-stop-hook-skip-set]] — the implementation chain
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] · [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] · [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]] · [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] · [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — the six collisions
- [[tasks/design-task-ship-loop-skill]] — the task-scope precedent
- [[systems/fkit]] · [[systems/role-locked-sessions]]
