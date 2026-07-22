# ADR-032: The `fkit-sprint-ship-loop` autonomy & consent model — the conductor at sprint scope

- **Status:** accepted
- **Date:** 2026-07-22
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect
- **Depends on:** [ADR-031](adr-031-fkit-lead-becomes-the-orchestrating-front-door.md) (the conductor
  reversal). This ADR records how the flagship application of that conductor behaves — the sprint-scope
  analogue of [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)'s task loop.
- **Evidence:** [`reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`](../reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md)
  §5 (the contract), §5.3 (the live-relay gate), §5.4 (stop conditions).

> **What this ADR decides, in one line:** `fkit-sprint-ship-loop` is a **lead-owned driver** that ships a
> sprint's eligible tasks brief→closed by spawning role workers for bounded steps, relaying every owner
> decision **live** through the lead session, and closing with the agent-closed marker **by default** —
> it **never** invokes the coder's session-only `fkit-task-ship-loop`.

## Context

ADR-031 establishes that `fkit-lead` can drive the team as a conductor. This ADR records the behavior of
its first named application: a loop that ships a whole sprint. Two constraints shape it:

- **The coder's `fkit-task-ship-loop` is session-only and refuses a spawned/headless invocation**
  (`fkit-task-ship-loop/SKILL.md:8-18,74-75,238`). So *"spawn a coder and run its ship-loop"* is
  infeasible — and it could not reach the owner anyway (ADR-021). The sprint loop must therefore be a
  **new driver** that spawns the coder for *discrete steps*, not a wrapper around the task loop.
- **The task loop's owner gates rely on the owner being present in the coder's own session** — plan
  approval (plan mode), review judgment calls, degraded-run close. Under orchestration the owner is
  present in the **lead** session, not the worker's; the driver must therefore own every gate.

## Decision

1. **`fkit-sprint-ship-loop` is a new skill owned by `lead`** (`skills-for-role.sh:37` gains it; the
   ADR-018 hook then allows lead and denies every other role). It **does not invoke**
   `fkit-task-ship-loop`, which stays byte-unchanged and session-only.

2. **Task selection & order.** Read the sprint plan and its briefs; get the board via
   `bash claude/skills/fkit-status/dashboard.sh <plan>` (never re-derive status by hand). Eligible =
   `🔲 Backlog` tasks whose `Depends on` links are all `✅ Done`, ordered by **priority** then dependency
   topology. Dependency deadlock (nothing eligible, backlog remains) → **stop and report the chain**.

3. **Per-task drive sequence** — the bounded-worker/driver-owns-owner-channel pattern (ADR-031
   Decision 3): spawn `@fkit-coder` for **plan only** (write no source) → **driver AskUserQuestion:
   approve plan** → spawn coder to **implement approved plan** → spawn coder to **verify** → spawn
   `@fkit-reviewer` `/fkit-stateful-review` → spawn coder to apply `fkit-process-stateful-review`
   **method** → **driver runs `/fkit-task-done`** to close. Re-verify after any post-review code change
   before closing.

4. **The live owner-relay gate is the load-bearing mechanism, and it differs from ADR-024.** A worker
   surfaces a decision by **returning** it; the driver relays via `AskUserQuestion` and **blocks on a
   real owner answer** — **no timer, no guess.** This is the *opposite* of ADR-024's declined
   silence-timeout auto-proceed: it **keeps** the owner in the loop and merely consolidates the channel
   into one session. ADR-024 is **not** reopened.

5. **Agent-closed marker by default** (owner ruling, honoring
   [ADR-025](adr-025-spawned-agents-may-invoke-the-task-movers.md)). Live-relay checks *decisions*, not
   *done-ness*; so a loop close carries `✅ Done (agent-closed — not owner-verified)` **unless the loop
   explicitly stops and the owner verifies.** The marker states exactly what was and was not checked.

6. **Degraded runs and cancellations stop for the owner.** No Codex pass after retries, red
   verification, or an unresolved residual → **do not self-close**, put the close to the owner
   (mirroring `fkit-task-ship-loop/SKILL.md:154-161,224`). **Never self-cancel** — `cancelled/` is
   audited by nobody (ADR-025 §Consequences); a cancel always stops and asks.

7. **The plan/build split is mandatory** — it is the only thing standing in for plan mode's write-wall
   on this path (ADR-031's honesty clause). The "plan only, write nothing yet" worker prompt is
   **prose-enforced**, and that limit is accepted, not hidden.

8. **Stop-hook interaction.** When [ADR-030](adr-030-stop-hook-enforces-turn-completion-contract.md)'s
   `Stop` hook is built, `fkit-sprint-ship-loop` **joins `/fkit-task-ship-loop` in its Decision-7 skip
   set** — a long autonomous driver's idle turns must not be forced to carry a "What's next?" footer.
   (Relay turns use `AskUserQuestion`, so they satisfy the hook's check A regardless.) Until that hook
   ships, this is prose only — noted so it is not forgotten.

## Options considered

- **A new lead-owned driver that spawns workers per step (chosen).** The only feasible shape given the
  task loop's spawned-invocation refusal and the session-only owner channel. Reuses the task loop's
  *rigor* (stateful review, verify budget, degraded-run conservatism) without reusing its session-bound
  machinery.
- **Wrap `fkit-task-ship-loop` (spawn a coder, run the loop).** Infeasible: the loop refuses spawned
  invocation and has no owner channel. This is *why* the sprint loop is a new driver.
- **Owner-verify every task close.** Offered; **declined** by the owner in favor of the agent-closed
  marker by default — stronger guarantee, but per-task interruptions the owner did not want. Recorded so
  the weaker-close posture is a knowing choice.
- **Timed auto-proceed so the loop never blocks.** Declined per ADR-024; live-relay is the deliberate
  alternative.

## Consequences

- **Positive:**
  - A whole sprint ships from one session, with the owner answering only real decisions.
  - Reuses `dashboard.sh` for deterministic task selection and the existing stateful-review rigor.
  - `fkit-task-ship-loop` and every role stay untouched; the change is additive and opt-in by name.
- **Negative / costs — stated plainly:**
  - **The plan-gate is prose on this path** (Decision 7 / ADR-031 honesty clause). Accepted.
  - **The agent-closed marker is invisible in `/fkit-status`** (ADR-025 §A3: `dashboard.sh` collapses it
    to plain `done`). A sprint driven end-to-end can turn a board green with **no surfaced signal** that
    no human verified any task — an **amplification** of ADR-025's accepted cost across many tasks at
    once, not a new defect.
  - **Orchestrator context accumulates over a sprint** (ADR-031 §Consequences).
- **Residual risks / "re-raise only if":**
  - **An agent-closed task shipped by the loop is found incomplete** — evidence the default-marker
    posture costs real quality (ADR-025's own re-raise shape). Reopen Decision 5 (consider owner-verify),
    do not patch the mover.
  - **The `/fkit-status` invisibility (ADR-025 §A3) proves painful at sprint scale** — a spot-check
    finding many silent agent-closes is the trigger to surface the marker in the dashboard.
  - **The live-relay round-trip is measured to not reliably deliver a worker's `NEEDS-DECISION` return
    to the driver** (design report §13 probe #2) — that is an implementation defect against this ADR, fix
    the loop; it is not grounds to revisit the model.
  - Do **not** re-raise *"the sprint loop should just call `fkit-task-ship-loop`"* — infeasible, this ADR
    records why.
  - Do **not** re-raise *"add a timeout so it doesn't block"* — declined (ADR-024), and live-relay is the
    chosen alternative.

## Related

- [`reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`](../reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md)
  §5 (contract), §5.3 (relay gate), §5.4 (stop table), §9.4 (close honesty), §13 (test/probe plan).
- [ADR-031](adr-031-fkit-lead-becomes-the-orchestrating-front-door.md) — the conductor this applies.
- [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) /
  [task loop SKILL](../../../claude/skills/fkit-task-ship-loop/SKILL.md) — the task-scope loop whose
  rigor this reuses and whose session-bound machinery it deliberately does not.
- [ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md) — why workers return, not ask.
- [ADR-024](adr-024-ship-loop-owner-question-timeout-is-not-built.md) — the declined auto-proceed;
  live-relay is the opposite.
- [ADR-025](adr-025-spawned-agents-may-invoke-the-task-movers.md) — the agent-closed marker and its
  `/fkit-status` invisibility this loop amplifies.
- [ADR-030](adr-030-stop-hook-enforces-turn-completion-contract.md) — the Stop-hook skip set this loop
  must join when that hook is built.
- Code: `claude/skills-for-role.sh:37`, `claude/skills/fkit-status/dashboard.sh`,
  `claude/skills/fkit-task-ship-loop/SKILL.md`.
- **Wiki:** **fkit-wiki** should ingest this ADR — an architect never writes the vault.
