---
name: fkit-sprint-ship-loop
description: The lead's sprint-scope conductor loop — drives eligible tasks brief→closed by spawning
  role workers, relaying owner decisions live through this session, and closing with the agent-closed
  marker by default. Session-only; the driver holds the owner channel workers lack.
---

# ⛔ Owner: the lead

> ## ⛔ Owner: the **lead**
> This is the fkit-lead's own procedure. Execute it **only** if you are the lead — running in a
> `fkit lead` **session** (menu 7) with the owner reachable.
>
> **Any other role: do not execute this.** The ADR-018 skill-ownership hook denies it to every role but
> `lead`. It is also **session-only**: it drives by spawning workers and relaying owner decisions, and
> the owner channel (`AskUserQuestion`) exists **only** in a live session. A spawned/headless invocation
> cannot reach the owner — **refuse it**, and say why.

## Overview

`fkit-sprint-ship-loop` ships a **whole sprint's eligible tasks** from brief to closed. It is the
flagship application of the conductor remit ([ADR-031](../../../ai-agents/knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)),
specified by [ADR-032](../../../ai-agents/knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)
and the owner-approved design report
[`2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`](../../../ai-agents/knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md)
§5.

**It is a *driver*, not a doer.** For each task it spawns typed `fkit-<role>` workers for discrete,
bounded steps (coder to plan/build/verify, reviewer to review, coder to process the review), **holds the
owner channel itself**, and closes the task itself. The **work** runs in fresh spawned contexts — so
reviewer independence and the coder's sole-source-write authority are preserved; the loop only
*sequences* the separate contexts.

**It models `fkit-task-ship-loop`'s *rigor* at sprint scope — it never *invokes* it.** The coder's task
loop is **session-only and refuses a spawned invocation** (`fkit-task-ship-loop/SKILL.md:8-18`); it also
could not reach the owner from a spawn (ADR-021). So this loop is a **new driver** that reuses the task
loop's shape (stateful review, verify budget, degraded-run conservatism), never its session-bound
machinery. `fkit-task-ship-loop` stays **byte-unchanged.**

**Argument:** `$ARGUMENTS` — a sprint plan path (e.g. `ai-agents/sprints/sprint-2.md`); **empty = the
active sprint** (the `sprint-*.md` the project is working). One operand — no output-variant flags
(`conventions/one-skill-one-output.md`).

---

## ⚠️ The plan-gate honesty clause — read before the loop, do not "fix" it away

On this orchestrated path, **"no code before the owner approves the plan" is prose-enforced in the worker
prompt, NOT a runtime write-wall.** Plan mode — the coder session's structural write-wall and ADR-019's
one unremovable checkpoint — **cannot run in a spawned worker** (no owner channel there, ADR-021). So the
driver enforces the ordering by **splitting** it:

1. spawn `@fkit-coder` **for the plan only** — prompt: *"produce a plan with `/fkit-plan-task`, write no
   source, return the plan and any open questions"*;
2. the driver presents the plan to the owner via **`AskUserQuestion`** → owner approves;
3. spawn `@fkit-coder` **to implement the approved plan**.

The "write nothing yet" in step 1 is a **prompt instruction, not a wall** — a confused or injected worker
could write before approval and nothing structural stops it. **This is stated plainly and accepted by the
owner (2026-07-22, ADR-031 honesty clause / ADR-032 Decision 7).** A later reader — human or coder —
**must not** rewrite this into a false structural guarantee. Owners who want plan mode's structural wall
for a given task ship it the old way: `fkit coder` + `/fkit-task-ship-loop`.

---

## The loop, numbered

### 1. Select & order the sprint's tasks (§5.1)
- Read the sprint plan (`$ARGUMENTS`, or the active `sprint-*.md`) and the briefs it links.
- Get the board **via the deterministic reader** — never hand-derive status:
  ```
  bash claude/skills/fkit-status/dashboard.sh <plan>
  ```
- **Eligible** = tasks that are `🔲 Backlog` **and** whose every `Depends on` link is `✅ Done`. Skip
  `🔄 In progress` (someone else owns it), `🚧 Blocked`, `✅ Done`, `⛔ Cancelled`, `➡️ Moved`.
- **Order** by `## Priority`, then by dependency topology (a task never runs before a task it depends on).
- **Per-run skip memory.** Keep an in-session set of tasks **attempted or plan-rejected this run** and
  **exclude** them from the eligible set — so re-derivation (step 5) never re-selects a task the owner just
  rejected or one you already drove. This memory is **this-run only**; a later invocation reconsiders them.
- **Dependency deadlock** — backlog remains but nothing is eligible (every remaining task waits on
  something unfinished) → **stop and report the blocking chain** to the owner. Do not guess an order.

### 2. Drive each eligible task, in order (§5.2)
Run the **bounded-worker + driver-owns-owner-channel** pattern per task. Each worker is a **typed
`fkit-<role>` subagent** (a generic `general-purpose`/`Explore` helper is denied every `fkit-*` skill by
the ADR-018 hook — never use one for a step that runs an fkit procedure).

**Mark the task `🔄 In progress` first.** At the start of driving a task, set `🔄 In progress` in **both**
the brief `## Status` and the sprint row (via a spawned worker or directly) — so `/fkit-status` and any
concurrent driver see it is owned (step 1 skips `🔄 In progress`). Every later exit overwrites this with
the accurate exit status — a terminal one (`✅ Done` / `🚧 Blocked`), **or reset to `🔲 Backlog` if the
owner rejects the plan** (§5.4), so a rejected task is never stranded `🔄 In progress`.

| Step | Driver spawns | Worker does (bounded, then returns) | Owner gate (driver-held) |
|---|---|---|---|
| **Plan** | `@fkit-coder` | run `/fkit-plan-task`; **write no source**; return the plan + open questions | **⛔ present plan → `AskUserQuestion` approve/reject** — the unremovable checkpoint (prose-enforced here, see honesty clause) |
| **Build** | `@fkit-coder` | implement the **approved** plan; write source + `plan.md`/`worklog.md`; return change surface + any decision surfaced | stop only if the worker returns `NEEDS-DECISION` |
| **Verify** | `@fkit-coder` | run tests per [ADR-014](../../../ai-agents/knowledge-base/decisions/adr-014-how-fkit-tests-itself.md) (`node --test`, zero devDeps); return pass/fail + diagnosis | **budget: 3 no-progress cycles** → `🚧 Blocked — verification` |
| **Review** | `@fkit-reviewer` → `/fkit-stateful-review` | own pass + Codex second opinion; write the *Reviewer findings* ledger section; return the verdict | — |
| **Process review** | `@fkit-coder` | apply `fkit-process-stateful-review` **method** — verify each finding, classify defect/frontier, write the *Coder response*; **apply verified-`CORRECT`, in-approved-plan fixes autonomously (task-loop discipline, ADR-019)**; return change surface + residuals, and **return `NEEDS-DECISION` for any judgment call** | **⛔ stop for judgment calls** — frontier-move, regression, disputed severity, broad/behavior-changing, or out-of-plan fix |
| **Close** | **the driver itself** runs `/fkit-task-done` | — | writes `✅ Done (agent-closed — not owner-verified)` **by default**; **stop for the owner only on a degraded run** |

**Rules that make this honor the ADRs:**
- **The Build AND Process-review spawn prompts MUST each carry the approved plan verbatim, state the owner
  approved it via `AskUserQuestion`, and identify the caller as `fkit-sprint-ship-loop`.** These three
  signals are the **declared-approval marker** that `fkit-coder.md`'s sprint-loop carve-out keys on for
  **both** worker roles; without them a spawned coder **refuses to write source** and returns the plan. It
  is **trust, not proof** — a prose
  mirror of the plan-step's "write nothing yet", carrying the same accepted prose-enforced cost (ADR-031
  honesty clause / ADR-032 D3/D7), not a verifiable token.
- **The plan/build split (honesty clause) is mandatory** — it is the only thing standing in for plan
  mode's write-wall on this path.
- **The Process-review worker applies fixes on ADR-019's discipline under the declared-approval marker,
  bounded by the approved plan** — verified-`CORRECT`, mechanical/localized, in-plan fixes proceed without
  per-fix owner approval (a second exception to the per-round gate, `fkit-coder.md`); every judgment call
  returns `NEEDS-DECISION`. **The driver re-verifies after any fix the worker writes.**
- **Re-verify after any post-review code change** before closing (mirror `fkit-task-ship-loop/SKILL.md`).
- **The close is the driver's, not a spawned worker's** — the lead already owns `/fkit-task-done`
  (`skills-for-role.sh:37`), and closing from the live session keeps the owner-relay coherent.

### 3. Relay every decision live — the load-bearing gate (§5.3, §6.2)
A spawned worker **never asks the owner** — it **returns** its final message as **exactly one** of:

```
DONE           { result, changeSurface?, evidence? }              → driver advances
NEEDS-DECISION { question, options[], recommendation, context }   → driver relays via AskUserQuestion
BLOCKED        { reason, whatFails }                              → driver records status, skips/stops
```

This envelope is **prose in the worker's spawn prompt**, not a runtime schema — ADR-021 gives workers no
structured owner channel and there is no cross-context type system; the driver parses the worker's final
message. On `NEEDS-DECISION` the driver:

1. calls **`AskUserQuestion`** with the returned options (recommendation pre-marked), and
2. **blocks on a real owner answer** — **no timer, no guess** — then
3. spawns the next worker with the decision folded into its prompt.

**This is the opposite of the declined ADR-024 auto-proceed.** It does not remove the owner via a
silence-timeout; it **keeps** the owner and merely **consolidates the channel** into this one session.
ADR-024 is **not** reopened.

**Idle behavior:** between relays the driver **ends its turn and idles** — ordinary in-session
turn-taking. The owner returns to the terminal to answer. (When [ADR-030](../../../ai-agents/knowledge-base/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md)'s
`Stop` hook ships, `fkit-sprint-ship-loop` joins `/fkit-task-ship-loop` in its skip set so these
mechanical idle turns are not forced to carry a "What's next?" footer; relay turns use `AskUserQuestion`
and satisfy the hook regardless — task 0116.)

### 4. Close posture (§5.2 Close row, ADR-032 D5/D6, ADR-025)
- **Agent-closed marker by default.** Live-relay checks *decisions*, not *done-ness* — so a loop close
  carries `✅ Done (agent-closed — not owner-verified)` **unless the loop explicitly stopped and the owner
  verified.** The marker states exactly what was and was not checked; apply it honestly.
- **Degraded run → do NOT self-close.** No Codex pass after retries, red verification, or an unresolved
  residual ⇒ finish the report and **put the close to the owner.** Self-closing work you already know is
  weak is the exact failure this posture must not commit.
- **Never self-cancel.** If a task should be **cancelled** rather than done, **stop and ask the owner** —
  `cancelled/` is audited by nobody (ADR-025 §Consequences). A cancel always stops.

### 5. Advance
After a task closes (or is skipped/blocked), return to step 1's eligible set — re-derive it (a just-closed
task may unblock a dependent), **minus the per-run skip set** (attempted / plan-rejected this run, §1) so a
just-rejected task is not re-selected — and drive the next task, until the eligible set is empty.

---

## Stop conditions — the driver's exit table (§5.4)

| Terminal state | Trigger | Driver does |
|---|---|---|
| **Sprint shipped** | **every eligible task CLOSED** (none deferred/rejected this run), last verify green | report the sprint roll-up + each task's close + marker |
| **Sprint drained — deferred remain** | eligible set empty, but one or more tasks were **plan-rejected / deferred this run** (in the skip set) and remain `🔲 Backlog` (**not** blocked by unfinished deps) | report the roll-up listing shipped tasks **and the deferred ones as `pending` — re-run to reconsider**; this is **NOT** a full-sprint ship (honesty thesis, ADR-031), and NOT a dependency deadlock |
| **Plan rejected** | owner rejects a task's plan | **reset the task `🔄 In progress` → `🔲 Backlog`** in **both** the brief and the sprint row (it was marked In progress at step 2), add it to the per-run skip set (§1), then move to the next eligible task, or stop if none |
| **Blocked — verification** | a task's no-progress budget (3 cycles) hit | `🚧 Blocked — verification: <what fails>`; skip to next eligible; report |
| **Blocked — review non-convergence** | review oscillation on a task | `🚧 Blocked — review not converging`; skip/stop; report |
| **Owner decision pending** | any judgment call / degraded close / cancel question | **pause**, relay via `AskUserQuestion`, resume on the answer |
| **Dependency deadlock** | eligible set empty, backlog remains | stop; report the blocking chain |
| **No Codex, degraded** | Codex absent after retries on a task | proceed-and-flag that task **loudly**; **do not self-close it** — put its close to the owner |

**Invariant — no path ends in silence.** Every exit writes accurate status in **both** the brief's
`## Status` **and** the sprint row, and ends in an owner-visible report.

## Progress reporting (§5.5)
- **Per task:** surface the coder worker's close-out evidence packet from its `worklog.md` (change
  surface, verification evidence, review verdict + Codex-coverage state, residuals).
- **Sprint level:** a roll-up — tasks **shipped / blocked / pending**, each close's marker (agent-closed
  vs owner-verified), and the Codex-coverage state per task. Loudly flag any task shipped without a
  model-diverse review.

---

## Hard rules
- **Session-only.** Refuse a spawned/headless invocation — you cannot reach the owner from a spawn.
- **Never invoke `fkit-task-ship-loop`** — it refuses a spawned invocation and is session-only; reuse its
  *shape* only. It stays byte-unchanged.
- **The driver delegates, never substitutes.** Spawn typed `fkit-<role>` workers for all real work; the
  driver **never writes source and never reviews.** A driver that reviews or designs "just this once"
  breaks the separation-of-authority thesis (ADR-031 Decision 2).
- **Spawn typed `fkit-<role>` subagents only** — never a generic helper for a step that runs an fkit skill.
- **The plan/build split is mandatory** and its gate is **prose-enforced, not structural** (honesty
  clause) — do not present it as plan mode's write-wall.
- **Close writes the agent-closed marker by default; degraded runs stop; never self-cancel** (ADR-032/ADR-025).
- **Re-verify after any post-review code change** before closing a task.
- **Do not commit or push** — leave every edit in the working tree; the owner commits.
- **Never write `ai-agents/wiki-vault/`** — ever.

## Usage
```
fkit lead
/fkit-sprint-ship-loop ai-agents/sprints/sprint-2.md
```
