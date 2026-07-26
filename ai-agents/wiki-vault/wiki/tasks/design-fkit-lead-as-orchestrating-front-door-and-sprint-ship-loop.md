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

### Alternatives weighed, and why each was set aside (report §12)

The vault records the plan-gate downgrade as this arc's top accepted cost. **What follows is the part that was missing: a mitigating alternative existed, and the owner declined it knowingly.**

| Alternative | Why not |
|---|---|
| **A new `orchestrator` role** instead of evolving lead | Rejected by the owner — *keep the name, grow lead*. Also: a new role trips the seven→eight count ripple ([[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]]) for **no authority gain** — orchestration is not a new authority, it is lead's routing remit made active |
| **Orchestrator spawns the coder and runs `fkit-task-ship-loop`** | Infeasible: the loop refuses spawned invocation and could not reach the owner anyway ([[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]]). This is *why* the sprint loop is a **new driver, not a wrapper** |
| ⚠️ **The "split" option — keep implementation in a `fkit coder` session; orchestrate only review / close / relay** | **It preserves plan mode's structural write-wall** — the very guarantee the chosen path downgrades to prose. **Declined by the owner** in favor of full drive scope. Recorded so the tradeoff is on the record: **the owner chose maximum single-point-of-interaction over the structural plan gate, knowingly** |
| **Timed auto-proceed on owner silence** | Already declined for the task loop ([[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]]); live-relay is the deliberate opposite |

> **Read the split option before re-raising the plan-gate cost.** [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] says a finding must show the prose gate *failing in practice*. This row is why: the structural alternative was on the table and was traded away deliberately, not overlooked.

## Outcome

**Done.** Delivered `knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`, which produced **two ADRs** — [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] (the stance reversal, including the plan-gate honesty clause) and [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] (the loop's contract) — plus the follow-on implementation chain 0110 → 0117 with its dependency shape.

**The design also corrected a live doc drift it needed to reason from:** `architecture.md` still described the retired `skillOverrides` lock mechanism, which is the exact fact that decided feasibility. That correction was folded into [[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]] rather than left as cosmetic.

⚠️ The brief carried a **sprint-fit flag** — filed to Sprint 2 on the owner's "current sprint" instruction, though Sprint 2's theme is the Omnigent removal and this is thematically a Sprint 3 feature. The owner overrode the flag and kept it in Sprint 2.

### The design's two binary probes — one answered NO, one never run (report §13, §14 Q1)

The design deferred two things to *"confirm once against the binary"* — the **measure, don't reason** discipline. Their fates differ, and the difference matters:

- **Probe 1 / open question Q1 — *can a spawned `@fkit-coder` plan* **and write source**?* — **ANSWERED, and the answer was NO.** The design leaned *"the driver's spawn prompt fully carries it"*; that lean was **wrong**. [[tasks/build-fkit-sprint-ship-loop-skill]]'s adversarial review found `claude/agents/fkit-coder.md` makes a **spawned** coder refuse implementation outright — *"return the plan instead of writing code — nobody is there to approve it"* — with `/fkit-task-ship-loop` its only exception, the one skill the sprint loop must never invoke. **The loop as designed could not build.** Resolved by owner-approved option (a): a **declared-approval-marker carve-out** added to `fkit-coder.md`, which a re-review then had to **extend a second time** to the Process-review worker (the first carve-out authorized the Build worker only, so post-review fixes still had no authorized writer).
  > ⚠️ **The carve-out is trust, not proof.** Its marker is three signals in the driver's prompt — caller identity, the concrete approved plan, and a statement that the owner approved it — all **prose**, exactly mirroring the plan-step's "write nothing yet" and carrying the same accepted cost. **It is not a verifiable token.** Follow-ups are filed and open: `0118` (record the ADR-032 amendment for the carve-out) and `0119` (track the `fkit-coder.md` guarantee-surface change).
  > **And note what actually settled it:** a reviewer **reading a contract file**, not a live probe. Whether a spawned coder really refuses, and really writes under the marker, is still **unproven against the running binary**.
- **Probe 2 — does a worker's `NEEDS-DECISION` return reach the driver as parseable text, and does the driver's `AskUserQuestion` render?** — **No record it was ever run.** Searched the vault and the `0109` / `0110` / `0111` task artifacts; nothing claims it. The live-relay round-trip is **the load-bearing mechanism of the whole design**, and it rests on reasoning from the ADRs rather than a measurement. See [[systems/testing-and-verification]].

The design said this plainly and it remains true: **fkit cannot fully test its own session-scoped orchestration** — a spawned tester inherits the caller's context — so this round-trip stays **hand-verified**, like the hooks. Recorded rather than dressed up as coverage it does not have.

## Related
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] · [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the two ADRs this produced
- [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] · [[tasks/build-fkit-sprint-ship-loop-skill]] · [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] · [[tasks/update-launcher-menu-help-for-conductor]] · [[tasks/amend-project-brief-for-lead-conductor]] · [[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]] · [[tasks/add-sprint-ship-loop-to-stop-hook-skip-set]] — the implementation chain
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] · [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] · [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]] · [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] · [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — the six collisions
- [[tasks/design-task-ship-loop-skill]] — the task-scope precedent
- [[systems/fkit]] · [[systems/role-locked-sessions]]
- [[systems/testing-and-verification]] — where this design's two binary probes are tracked: probe 1 answered **NO**, probe 2 **never run**
