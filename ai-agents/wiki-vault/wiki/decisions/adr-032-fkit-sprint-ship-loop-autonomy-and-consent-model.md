# ADR-032: The `fkit-sprint-ship-loop` autonomy & consent model — the conductor at sprint scope

**Date**: 2026-07-22
**Status**: accepted *(§Decision 3 and §Decision 5's close step **amended 2026-07-23** by [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the driver no longer closes; it spawns the producer)*

**Source**: `ai-agents/knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md`
**Depends on**: [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]]

> ⚠️ **STALE — a SECOND amendment is missing from this ADR.** Beyond the ADR-033 close-step amendment noted above, the drive sequence now depends on a **2026-07-22 autonomy amendment that was never written**: the `fkit-coder.md` **declared-approval-marker carve-out** letting the loop's Build **and** Process-review workers write source, the latter applying verified-`CORRECT` in-plan fixes **without per-fix owner approval**. `claude/agents/fkit-coder.md` already **cites** *"[ADR-032] Decision 3 + its 2026-07-22 autonomy amendment"* — **a citation to text that does not exist here.** Task `0118` will land it (still 🔲 Backlog); the substance is recorded meanwhile on [[tasks/build-fkit-sprint-ship-loop-skill]].

> **In one line:** `fkit-sprint-ship-loop` is a **lead-owned driver** that ships a sprint's eligible tasks brief→closed by spawning role workers for bounded steps, relaying every owner decision **live** through the lead session, and closing with the agent-closed marker **by default** — and it **never** invokes the coder's session-only `fkit-task-ship-loop`.

## Context

ADR-031 established that `fkit-lead` can drive the team. This records the behaviour of its first named application: a loop that ships a whole sprint. Two constraints shaped it:

- **The coder's `fkit-task-ship-loop` is session-only and refuses a spawned/headless invocation.** So *"spawn a coder and run its ship-loop"* is infeasible — and it could not reach the owner anyway (ADR-021). The sprint loop must be a **new driver** that spawns the coder for *discrete steps*, not a wrapper.
- **The task loop's owner gates rely on the owner being present in the coder's own session.** Under orchestration the owner is present in the **lead** session, so the driver must own every gate.

## Decision

1. **A new skill owned by `lead`** (`skills-for-role.sh`; the ADR-018 hook then allows lead and denies every other role). It **does not invoke** `fkit-task-ship-loop`, which stays byte-unchanged and session-only.
2. **Task selection & order.** Read the sprint plan and its briefs; get the board via `dashboard.sh` — **never re-derive status by hand**. Eligible = `🔲 Backlog` tasks whose `Depends on` links are all `✅ Done`, ordered by priority then dependency topology. Dependency deadlock → **stop and report the chain**.
3. **Per-task drive sequence** — the bounded-worker / driver-owns-owner-channel pattern: spawn `@fkit-coder` for **plan only** → **driver `AskUserQuestion`: approve plan** → spawn coder to **implement** → spawn coder to **verify** → spawn `@fkit-reviewer` for `/fkit-stateful-review` → spawn coder to apply the process-stateful-review method → **close**. Re-verify after any post-review code change before closing.
   > ⚠️ **Amended by ADR-033 §4:** the close step was *"driver runs `/fkit-task-done`"*. It is now *"spawn `@fkit-producer` to close"* — the driver holds no movers. Landed by [[tasks/route-sprint-ship-loop-close-to-producer]].
4. **The live owner-relay gate is the load-bearing mechanism, and it differs from ADR-024.** A worker surfaces a decision by **returning** it; the driver relays via `AskUserQuestion` and **blocks on a real owner answer** — **no timer, no guess.** This is the *opposite* of ADR-024's declined silence-timeout auto-proceed: it **keeps** the owner in the loop and merely consolidates the channel into one session. **ADR-024 is not reopened.**
5. **Agent-closed marker by default.** Live-relay checks *decisions*, not *done-ness*, so a loop close carries `✅ Done (agent-closed — not owner-verified)` **unless the loop explicitly stops and the owner verifies.** *(Post-ADR-033 the marker is written by the **spawned producer**, not the driver — the marker rule itself is unchanged.)*
6. **Degraded runs and cancellations stop for the owner.** No Codex pass after retries, red verification, or an unresolved residual → **do not self-close**, put the close to the owner. **Never self-cancel** — `cancelled/` is audited by nobody, so a cancel always stops and asks.
7. **The plan/build split is mandatory** — it is the only thing standing in for plan mode's write-wall on this path (ADR-031's honesty clause). "Plan only, write nothing yet" is **prose-enforced**, and that limit is accepted, not hidden.
8. **Stop-hook interaction.** `fkit-sprint-ship-loop` **joins `/fkit-task-ship-loop` in [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]]'s Decision-7 skip set** — a long autonomous driver's idle turns must not be forced to carry a "What's next?" footer. *(Landed by [[tasks/add-sprint-ship-loop-to-stop-hook-skip-set]] once the hook was built; the detection was then made transcript-independent by [[tasks/transcript-independent-ship-loop-skip-signal]].)*

## Consequences

- **Positive:** a whole sprint ships from one session, with the owner answering only real decisions; reuses `dashboard.sh` for deterministic selection and the existing stateful-review rigor; `fkit-task-ship-loop` and every role stay untouched — the change is additive and opt-in by name.
- **Negative, stated plainly:**
  - **The plan-gate is prose on this path.** Accepted.
  - **The agent-closed marker is invisible in `/fkit-status`** — `dashboard.sh` collapses it to plain `done`. A sprint driven end-to-end can turn a board green with **no surfaced signal** that no human verified any task. This is an **amplification** of ADR-025's accepted cost across many tasks at once, **not a new defect**.
  - **Orchestrator context accumulates over a sprint.**
- **Re-raise only if:** an agent-closed task shipped by the loop is found incomplete; the `/fkit-status` invisibility proves painful at sprint scale; or the live-relay round-trip is *measured* not to deliver a worker's `NEEDS-DECISION` return (that would be an implementation defect, not a model problem). **Do not re-raise** *"the sprint loop should just call `fkit-task-ship-loop`"* (infeasible — recorded here) or *"add a timeout so it doesn't block"* (declined, ADR-024).

## Related
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the conductor this applies
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — **amends** Decisions 3 & 5's close step
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the task-scope loop whose rigor this reuses and whose session-bound machinery it deliberately does not
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why workers return, not ask
- [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]] — the declined auto-proceed; live-relay is the opposite
- [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]] — the marker and its `/fkit-status` invisibility this loop amplifies
- [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — the skip set this loop joined
- [[tasks/build-fkit-sprint-ship-loop-skill]] — the build
- [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] — the ownership wiring
- [[tasks/add-sprint-ship-loop-to-stop-hook-skip-set]] · [[tasks/transcript-independent-ship-loop-skip-signal]]
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] — the design
- [[systems/fkit]] · [[systems/role-locked-sessions]]
- [[systems/testing-and-verification]] — Testing & Verification
- [[tasks/refresh-architecture-doc-for-lead-conductor-and-stale-lock]] — Refresh architecture.md for the lead conductor + fix the stale §5.2 lock description
