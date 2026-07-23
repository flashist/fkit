# Design — `fkit-lead` as the orchestrating front door, and the `fkit-sprint-ship-loop` skill

- **Date:** 2026-07-22
- **Author:** fkit-architect (owner present, session)
- **Task:** [`0109`](../../tasks/done/0109-design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop/brief.md)
- **Status:** design / feasibility only — **no source changed, no ADR written, no task filed.** The
  ADRs (§10) and follow-on tasks (§11) are *enumerated here* and created only after the owner reviews
  this spec.

> **One line:** it is **feasible** to grow `fkit-lead` into a single-point-of-interaction conductor
> that spawns and drives any role, **because** the ADR-018 skill hook already lets a spawned role run
> its own procedures, and **provided** the driver session keeps the owner channel to itself and workers
> *return* questions instead of asking them (ADR-021). The one real cost: on the orchestrated path the
> "no code before the owner approves the plan" gate downgrades from a **runtime write-wall** to
> **prose** — the owner has accepted this, and it is recorded honestly, not hidden.

---

## 1. Goal & context

The owner wants **one agent per terminal** that is aware of the whole toolkit, knows each role, and
**spawns/drives the other roles as needed** — so they don't open a session per role until they
genuinely need to. Owner rulings this session (2026-07-22):

- **Front door = `fkit-lead`, evolved** (keep the name). Grow the existing router into *the*
  single-point-of-interaction **doer/orchestrator**, absorbing its routing remit and gaining the
  ability to drive the team.
- **General conductor, not just build+review.** The orchestrator "should be able to spawn **anybody**
  it needs — producer, architect, coder, reviewer, wiki, and future roles — give them a task, wait for
  completion, then push the process further (spawn another agent, or tell the owner the work is done)."
  `fkit-sprint-ship-loop` is **one flagship application** of that general capability, not its whole
  extent.
- **Owner decisions relayed live.** When driven work needs an owner decision, the orchestrator
  **pauses, asks the owner in its own session, and resumes.** It is the owner's live channel.
- **Full drive scope.** The orchestrator drives implementation too (spawns a coder to write source),
  accepting the plan-gate downgrade below.
- **Sprint fit:** stays in **Sprint 2** (owner ruling, overriding the sprint-theme flag).
- **Close posture:** agent-closed marker **by default** — loop closes carry
  `(agent-closed — not owner-verified)` unless the loop explicitly stops for the owner to verify.

### 1.1 A correction that changes the feasibility answer

`architecture.md:184-228` (§5.2) still describes the role lock as a `skillOverrides` "off" list plus a
`CONSULT_SKILLS` exception — the pre-ADR-018 mechanism. **That is stale.** The launcher today writes a
**`PreToolUse` skill-ownership hook** (`fkit-claude.sh:257-265`, `build_settings()`), and the
`skillOverrides`/`CONSULT_SKILLS` mechanism was **retired** (ADR-018; `fkit-claude.sh:248-256` comment).
The live lock keys enforcement on the **real invoking agent's `agent_type` at any spawn depth**
(`skill-ownership-hook.sh:110-136`). This is the single fact that makes orchestration feasible, and
§9.5/§11 tracks fixing the stale doc.

---

## 2. Constraints & scope

**Hard constraints (each cited, each resolved in §3, not planned around):**

| # | Constraint | Source |
|---|---|---|
| C1 | `fkit-lead` is deliberately **not a doer** — "no Write or Edit tools" | `fkit-lead.md:20-24`; ADR-010 §Decision 3 |
| C2 | Spawned agents have **no owner channel** — `AskUserQuestion` is `TOOL_ABSENT`, 3/3, at any depth | ADR-021 §Decision |
| C3 | The coder's `fkit-task-ship-loop` is **session-only; refuses a spawned/headless invocation** | `fkit-task-ship-loop/SKILL.md:8-18,74-75,238` |
| C4 | The coder's **plan gate needs the owner present**; a timed auto-proceed was **declined on cost** | ADR-019 §Decision; ADR-024 |
| C5 | Task closure is **owner-gated with an honesty marker** `(agent-closed — not owner-verified)` | ADR-025 §Decision 3 |
| C6 | Team-shape docs say **"seven roles"**; evolving lead adds no role but **changes its nature** | ADR-028 §"Required follow-ups"; PROJECT.md, architecture.md |

**In scope:** a design/feasibility spec — the feasibility verdict with named mechanism; the evolved
`fkit-lead` remit; the `fkit-sprint-ship-loop` contract; the ADR(s) to record; the follow-on tasks with
dependencies.

**Out of scope (brief):** implementing the agent, writing the skill, editing the launcher or any
source, any wiki write. Interface/contract description only. (§4.5 offers optional stubs — none written
in this pass.)

---

## 3. Feasibility — whether and how one agent can drive the team

### 3.1 The three harness facts that decide it

1. **Skill ownership follows the *real caller's identity*, at any spawn depth (ADR-018).** The hook
   reads the payload's own `agent_type` and allows/denies per `skills_for_role()`
   (`skill-ownership-hook.sh:119-136`). A subagent spawned as `@fkit-coder` is identified as
   `fkit-coder` and **may run every coder-owned skill** — `fkit-plan-task`,
   `fkit-process-stateful-review`, etc. (`skills-for-role.sh:39`) — regardless of who launched it. **The
   skill lockdown is *not* the blocker.** (Corollary, and a real limit: a **non-fkit** subagent —
   `general-purpose`, `Explore` — carries no fkit identity and is **denied every** `fkit-*` skill,
   ADR-018 §Consequences. The orchestrator must therefore spawn **typed `fkit-<role>` subagents**, never
   generic helpers, for any step that runs an fkit procedure.)

2. **The owner channel is session-only (ADR-021).** `AskUserQuestion` works in a top-level
   `fkit <role>` session and is **absent in any spawned subagent**, at any depth. A spawned worker
   **cannot ask the owner** — it can only *return* to its caller.

3. **Consult topology is prompt-enforced (ADR-010 §Consequences).** `Agent(type)` allowlists inside
   subagent definitions are ignored by Claude Code; the two-hop budget and "no cycles" are prose. So
   whatever spawn discipline the orchestrator follows is carried by prompt, not by the runtime.

### 3.2 The load-bearing inversion

Facts 1 and 2 point in opposite directions: a spawned worker **can do the work** but **cannot reach the
owner**. Only the **top-level session** holds the owner channel. Therefore:

> **You cannot "spawn a coder and run its ship-loop."** `fkit-task-ship-loop` is a *session* loop that
> expects to *be* the owner-present context (C3, C4). Spawned, it has no owner and correctly refuses
> (`SKILL.md:74-75`).
>
> **Instead, the orchestrator itself is the driver that holds the owner channel.** It decomposes work
> into **bounded, returnable worker units**, spawns a typed role subagent per unit, and **handles every
> owner interaction itself** via its own `AskUserQuestion`. Workers **return** a result plus any
> **decisions-needed as structured text**; the driver — a real session — does the asking, then spawns
> the next unit with the answer folded in.

This is not a workaround of ADR-021 — it **is** ADR-021's own prescribed contract ("return it as an
open question in your reply rather than asking", ADR-021 §Decision 1) applied at orchestration scale.
The feature is *built on* the constraint, not in conflict with it.

```
        ┌───────────────────────────────────────────────┐
        │  fkit-lead SESSION  (owner present)            │
        │  • holds the ONLY owner channel (AskUserQ)     │
        │  • runs /fkit-sprint-ship-loop (the driver)    │
        │  • never writes source, never reviews          │
        └───────────────────────────────────────────────┘
             │ spawn typed worker    ▲ return: result + questions[]
             ▼ (Agent tool)          │ (NO AskUserQuestion in worker)
   ┌───────────────────────────────────────────────────────┐
   │ fresh @fkit-<role> context — its OWN agent_type        │
   │  → ADR-018 hook lets it run its own skills             │
   │  → does ONE bounded unit, returns, dies                │
   └───────────────────────────────────────────────────────┘
             │ if the unit needs a decision → surfaced in the return, NOT asked
             ▼
   driver pauses → AskUserQuestion(owner) → resumes with the answer → next spawn
```

### 3.3 Why this preserves the separation-of-authority thesis

Reversing "lead is not a doer" (C1) revives ADR-010's own worry: a long-lived session that *does
everything* is the context-accumulation problem role-locking was built to kill (ADR-010 §Options,
"a long-lived lead session accumulates context from every role it has worn"). The design answers it:

- **The orchestrator is a conductor, not a performer.** Each role's *actual work* runs in its **own
  fresh spawned context** (a spawned `fkit-reviewer` is a fresh context — exactly the property reviewer
  independence rests on, ADR-010 §Context). The orchestrator **never** writes source and **never**
  reviews; it spawns, relays, sequences.
- **The invariant that matters holds:** the review of code the coder wrote still happens in a
  *different* context than the one that wrote it. Orchestration does not put proposal, build, and
  approval in one context — it keeps them in separate spawned contexts and merely *sequences* them.
- **Residual (named, prose-enforced):** the discipline "orchestrator delegates, never substitutes its
  own judgment for a role's" is carried by the agent prompt, like the two-hop cap (fact 3). A confused
  orchestrator that reviews or designs "just this once" would break the thesis. This is the same class
  of prompt-enforced boundary the project already accepts (ADR-010 §Consequences).

### 3.4 Per-conflict resolution

| # | Conflict | Resolution |
|---|---|---|
| C1 | lead is not a doer / no Write-Edit | **Reversed by ADR (§10).** Note the prose is **already partly stale**: ADR-022 relaxed tools for all six Claude-side roles, so lead **already inherits Write/Edit** (`architecture.md:105`); `fkit-lead.md:22-24`'s "no Write or Edit tools" is a live drift. Reversal = stance change (router → conductor) **plus** a prose correction. |
| C2 | no owner channel in a spawn | **Honored, not circumvented.** Workers never call `AskUserQuestion`; the driver session owns it (§3.2). This is ADR-021's contract at scale. |
| C3 | ship-loop refuses spawned invocation | **Respected.** The sprint loop does **not** invoke `fkit-task-ship-loop`. It is a **new lead-owned driver** that spawns the coder for *discrete steps* (§5). `fkit-task-ship-loop` stays byte-unchanged and session-only. |
| C4 | plan gate needs owner; ADR-024 declined auto-proceed | **Not in tension.** ADR-024 declined a *timeout that guesses* on owner silence. Live-relay does the **opposite**: it **blocks on a real owner answer** in the live session — no timer, no guess. It is the "keep waiting for the owner" posture ADR-024 *kept* (ADR-024 §Decision 1), applied at sprint scale. |
| C5 | owner-gated close + honesty marker | **Honored.** Loop closes via `/fkit-task-done` (lead owns it, `skills-for-role.sh:37`) and carry `(agent-closed — not owner-verified)` **by default** (owner ruling). Live-relay checks *decisions*, not *done-ness* — the marker states exactly that truth (ADR-025 honesty clause). |
| C6 | "seven roles" docs | **No new role** — lead's *nature* changes, not the count. But the "does no work itself" / "router" claims across the docs go stale and must be corrected (§11). The seven→eight *count* ripple (ADR-028) is untouched by this change. |

### 3.5 The one genuine cost — stated loudly, not buried

**On the orchestrated implementation path, the plan gate is prose-enforced, not runtime-enforced.**

`fkit-task-ship-loop`'s "no code before the owner approves the plan" is protected by **Claude Code plan
mode** — a *session* write-wall (`SKILL.md:66-67,116-120`; ADR-019's one unremovable checkpoint). Plan
mode is interactive with the owner and **cannot function in a spawned worker** (no owner channel, C2).
So under orchestration the ordering must be enforced by the **driver**:

1. spawn coder **for the plan only** — prompt: *"produce a plan, write no source, return it"*;
2. driver presents the plan to the owner via `AskUserQuestion` → **owner approves**;
3. spawn coder **to implement the approved plan**.

The "write nothing yet" in step 1 is a **prose instruction in the worker prompt**, not a runtime wall.
A confused or injected worker could write before approval and nothing structural stops it — the same
honesty the project already accepted for the task movers (ADR-025 §"honesty clause": prevention removed,
labelling in its place). **The owner has accepted this (2026-07-22 ruling).** It is recorded here so no
future reader mistakes the orchestrated path for carrying plan mode's structural guarantee. (§9.1
revisits it as the top risk; the reversing ADR must carry this clause verbatim.)

**Feasibility verdict: FEASIBLE, with the plan-gate downgrade as the accepted cost.** No mechanism in
the design is infeasible on the pinned harness (Claude Code 2.1.212–2.1.214 per ADR-021/024). Two items
need a binary probe before implementation (§13, §14), neither a blocker for the design.

---

## 4. Proposed design — the evolved `fkit-lead`

### 4.1 Two capabilities, one agent

`fkit-lead` keeps its **router** remit (menu 7, "who do I need?", `/fkit-query`, one-off `@role`
consults — `fkit-lead.md:38-56`) and **gains** an **orchestrator** remit:

- **General conductor (the primitive).** Given a goal, the orchestrator spawns whatever typed role it
  needs, assigns one bounded unit of work, awaits the return, relays any surfaced decision to the owner,
  and advances — spawn the next role, or report "done" to the owner. This is the owner's generalized
  ask (§1). It underlies, but is not limited to, the sprint loop.
- **`fkit-sprint-ship-loop` (the flagship application).** A named, repeatable procedure that applies the
  primitive across a whole sprint's tasks (§5).

The router remit stays because "I don't know who I need" still needs an answer that **doesn't** spin up
a full orchestration — the orchestrator drives only when asked to *do*, not to *point*.

### 4.2 What changes, concretely

| Surface | Change | File |
|---|---|---|
| Agent prompt | Remove "You are not a doer" / "no Write or Edit tools" (C1, and already stale per ADR-022). Add the conductor remit + the driver discipline (delegate, never substitute; hold the owner channel; workers return questions). Keep the routing sections. | `claude/agents/fkit-lead.md` |
| Skill ownership | `lead` gains `fkit-sprint-ship-loop` (and nothing else is required — spawns are Agent-tool calls, not skills). | `claude/skills-for-role.sh:37` |
| New skill | `claude/skills/fkit-sprint-ship-loop/SKILL.md` — the driver procedure (§5), `⛔ Owner: the lead`. | new |
| Launcher menu/help | "team room — routing help … **does no work itself**" (`fkit-claude.sh:165,440,467`) becomes accurate to a conductor. | `claude/fkit-claude.sh` |
| The FOUR skills_for_role mirrors | `fkit-team/SKILL.md`, `claude/README.md`, `claude/scaffold/CLAUDE.md`, `architecture.md` — updated in the **same commit** as `skills-for-role.sh` (the checklist at `skills-for-role.sh:12-24`, which has bitten before). | 4 files |
| Stop hook skip set | `fkit-sprint-ship-loop` should join `/fkit-task-ship-loop` in ADR-030 Decision 7's skip conditions (a long autonomous driver, not a normal turn). | `claude/turn-completion-hook.sh` (when built) |

### 4.3 What must NOT change

- `fkit-task-ship-loop` stays **byte-unchanged and session-only** (C3). The sprint loop reuses its
  *shape*, never invokes it.
- `skill-ownership-hook.sh` is **not touched** (the ADR-025/ADR-018 posture: no precondition checks in
  the hook).
- `skills_for_role()` stays the **single source of truth** (ADR-012 §1); no second list.
- The coder's **sole source-write authority** is intact — the orchestrator writes no source; the
  spawned coder does (ADR-028 §Decision 4 precedent for "drives, never writes" holds for lead too).

### 4.4 Menu / launch topology

No launcher control-flow change is required: menu option 7 already execs `claude --agent fkit-lead
--settings <lead.json>` (`fkit-claude.sh:466-475`), and `build_settings()` already wires the ADR-018
hook for every role including lead. The lead session simply gains one owned skill and a wider prompt.
The owner starts the conductor exactly as today: `fkit` → 7, or `fkit lead`.

### 4.5 Optional stubs

None written in this pass (out-of-scope guard). If the owner wants a concrete anchor before
implementation, the two worth scaffolding are `claude/skills/fkit-sprint-ship-loop/SKILL.md` (header +
step skeleton with `TODO(coder)` bodies) and the one-line `skills-for-role.sh:37` diff — both are
contract-only. Say the word.

---

## 5. The `fkit-sprint-ship-loop` contract

Modeled on `fkit-task-ship-loop` (`SKILL.md:104-167`) at **sprint scope**, re-implemented at the
**driver** level so the owner channel lives in the loop, not in a spawned worker.

**Argument:** `$ARGUMENTS` — a sprint plan path (e.g. `ai-agents/sprints/sprint-2.md`); empty = the
active sprint. One operand, no output-variant flags (`conventions/one-skill-one-output.md` precedent).

### 5.1 Task selection & ordering

- Read the sprint plan and the briefs it links; get the board via
  `bash claude/skills/fkit-status/dashboard.sh <plan>` (the deterministic reader; pure function of
  plan+briefs, `dashboard.sh:` header contract). **Never** re-derive status by hand.
- Eligible = `🔲 Backlog` tasks whose **`Depends on`** links are all `✅ Done`. Order by **priority**
  (the brief's `## Priority`), then by dependency topology. Skip `🔄 In progress` (someone else owns
  it), `🚧 Blocked`, `✅ Done`, `Cancelled`.
- **Dependency deadlock** (nothing eligible but backlog remains) → **stop**, report the blocking chain
  to the owner.

### 5.2 Per-task drive sequence (the primitive, specialized to ship a task)

Each task runs the **bounded-worker + driver-owns-owner-channel** pattern (§3.2):

| Step | Driver spawns | Worker does (bounded, returns) | Owner gate (driver-held) |
|---|---|---|---|
| Plan | `@fkit-coder` | run `/fkit-plan-task`; **write no source**; return the plan + open questions | **⛔ present plan → `AskUserQuestion` approve/reject** (the unremovable checkpoint, §3.5) |
| Build | `@fkit-coder` | implement the **approved** plan; write source + `plan.md`/`worklog.md`; return change surface + any decision needed | stop only if the worker surfaces a decision |
| Verify | `@fkit-coder` (or same build return) | run tests per ADR-014; return pass/fail + diagnosis | stop on non-progress budget (mirror `SKILL.md:127-129`) |
| Review | `@fkit-reviewer` → `/fkit-stateful-review` | own pass + Codex second opinion; write the *Reviewer findings* ledger section; return verdict | — |
| Process review | `@fkit-coder` | apply `fkit-process-stateful-review` **method**; verify findings, classify, write *Coder response*; return residuals/judgment calls | **⛔ stop for judgment calls** (frontier-move, regression, disputed severity, out-of-plan) |
| Close | **driver itself** runs `/fkit-task-done` | — | writes `✅ Done (agent-closed — not owner-verified)` **by default** (owner ruling); **stop** for the owner only on a **degraded run** |

**Notes that make this honor the ADRs:**

- **Plan/build split (§3.5)** is mandatory — it is the only thing standing in for plan mode's write-wall
  on this path.
- **Re-verify after any post-review code change** before closing (mirror `SKILL.md:144-146`).
- **Degraded-run stop (C5, ADR-025):** no Codex pass after retries, red verification, or an unresolved
  residual → **do not self-close**; put the close to the owner (mirror `SKILL.md:154-161`,
  `:224`).
- **Never self-cancel.** If a task should be *cancelled*, **stop and ask** — `cancelled/` is audited by
  nobody (ADR-025 §Consequences; `SKILL.md:158-161`).
- **The close is the driver's, not a spawned worker's** — cleaner, and the lead already owns the mover
  (`skills-for-role.sh:37`).

### 5.3 The live owner-relay gate (the load-bearing mechanism)

1. A spawned worker that hits a decision **does not ask** — it **returns** a structured payload:
   `{ status: needs-decision, question, options[], recommendation, context }` (ADR-021 contract).
2. The driver (a live session) reads the return, calls **`AskUserQuestion`** with those options
   (recommendation pre-marked), and **blocks** on the owner.
3. On the owner's answer, the driver **spawns the next worker** with the decision folded into its
   prompt, and the loop advances.

**How it differs from ADR-024's declined auto-proceed:** there is **no timer and no guess** — the driver
waits for a real answer (C4). ADR-024 declined *removing* the owner via a silence-timeout; this *keeps*
the owner and merely **consolidates the channel** into one session. The two are opposite moves; ADR-024
is not reopened.

**Idle behavior:** between relays the driver **ends its turn and idles** (ordinary in-session
turn-taking, like `SKILL.md:67-68`). The owner returns to the terminal to answer. **Stop-hook
interaction (ADR-030):** these idle turns run in the interactive lead session, so ADR-030's Stop hook
*sees* them; `fkit-sprint-ship-loop` should be **added to ADR-030 Decision 7's skip set** (alongside
`/fkit-task-ship-loop`) so the loop's mechanical idle turns aren't forced to carry a "What's next?"
footer. (Relay turns use `AskUserQuestion`, so they satisfy the hook's check A regardless.)

### 5.4 Stop conditions (the driver's exit table)

| Terminal state | Trigger | Driver does |
|---|---|---|
| Sprint shipped | every eligible task closed, last verify green | report the sprint roll-up + each task's close + marker |
| Plan rejected | owner rejects a task's plan | task stays `🔲 Backlog`; move to the next eligible task or stop if none |
| Blocked — verification | per-task no-progress budget hit | `🚧 Blocked — verification: …`; skip to next eligible; report |
| Blocked — review non-convergence | review oscillation | `🚧 Blocked — review not converging`; skip/stop; report |
| Owner decision pending | any judgment call / degraded close / cancel question | **pause**, relay, resume on answer |
| Dependency deadlock | eligible set empty, backlog remains | stop; report the blocking chain |
| No Codex, degraded | Codex absent after retries | proceed-and-flag the task loudly; **do not self-close** — put close to owner |

**Invariant:** no path ends in silence; every exit writes accurate status in **both** the brief and the
sprint row (mirror `SKILL.md:163-167`).

### 5.5 Progress reporting

Per-task: the close-out evidence packet the coder worker produces in `worklog.md`
(`SKILL.md:197-211`), surfaced up. Sprint-level: a roll-up — tasks shipped / blocked / pending, each
close's marker (agent-closed vs owner-verified), and the Codex-coverage state per task.

---

## 6. Interfaces & contracts

### 6.1 `skills_for_role()` — the single source of truth

```sh
# claude/skills-for-role.sh — lead gains exactly one skill (spawns are Agent-tool calls, not skills)
lead) echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down \
             fkit-task-done fkit-task-cancelled fkit-sprint-ship-loop" ;;
```

The ADR-018 hook then **allows** lead to run `/fkit-sprint-ship-loop` and **denies** every role that
doesn't own it — no further hook change (`skill-ownership-hook.sh:132-136`). The FOUR human mirrors
(`skills-for-role.sh:12-24`) update in the same commit.

### 6.2 The worker-return envelope (prose contract, carried in the loop's spawn prompts)

A spawned worker ends with **exactly one** of:

```
DONE      { result, changeSurface?, evidence? }          → driver advances
NEEDS-DECISION { question, options[], recommendation, context }  → driver relays via AskUserQuestion
BLOCKED   { reason, whatFails }                           → driver records status, skips/stops
```

This is **prose in the worker's prompt**, not a runtime schema — ADR-021 gives workers no structured
owner channel, and there is no cross-context type system. The driver parses the worker's final message.

### 6.3 The new skill's front matter

```yaml
---
name: fkit-sprint-ship-loop
description: The lead's sprint-scope conductor loop — drives eligible tasks brief→closed by spawning
  role workers, relaying owner decisions live through this session, and closing with the agent-closed
  marker by default. Session-only; the driver holds the owner channel workers lack.
---
# ⛔ Owner: the lead
```

`⛔ Owner: the lead` banner is **load-bearing** on the spawned-consult path (ADR-018 makes the hook
structural, but the banner is still the human-readable owner) — do not omit it.

---

## 7. Data & state

No new data model. The loop reuses the existing per-task folder artifacts (ADR-029): the spawned coder
worker writes `plan.md`/`worklog.md`/`review.md` **inside the task folder** exactly as
`fkit-task-ship-loop` does (`SKILL.md:82-99`) — because that work runs in a real (spawned) coder
context, the artifacts are authored by the coder role, not the lead. The lead driver writes **no task
artifacts**; it only reads the board (`dashboard.sh`) and invokes the movers. Status writes hit **both**
the brief `## Status` and the sprint row (existing invariant). Nothing is committed (owner commits).

---

## 8. Control & data flow (end to end)

```
owner: fkit → 7 (or `fkit lead`) → /fkit-sprint-ship-loop [sprint]
  └─ driver reads plan + dashboard.sh → eligible tasks, priority+dependency order
     for each eligible task:
        spawn @fkit-coder (plan-only) ──return plan──▶ driver
        driver AskUserQuestion(owner: approve plan?) ─┬─ reject → next task
                                                      └─ approve ▼
        spawn @fkit-coder (implement approved plan) ──return change surface──▶ driver
        spawn @fkit-coder (verify) ──return pass/fail──▶ driver (budget on non-progress)
        spawn @fkit-reviewer /fkit-stateful-review ──return verdict + ledger──▶ driver
        spawn @fkit-coder (process-review method) ──return residuals/judgment──▶ driver
             └─ judgment call? → driver AskUserQuestion(owner) → resume
        code changed post-review? → re-spawn verify
        degraded run? → driver AskUserQuestion(owner: close?) ; else:
        driver runs /fkit-task-done → ✅ Done (agent-closed — not owner-verified)
     end for → driver reports sprint roll-up to owner
```

Error/edge paths are the §5.4 exit table; every one ends in an owner-visible report, never silence.

---

## 9. Impact & risks

### 9.1 TOP RISK — the plan-gate downgrade (accepted, must be recorded verbatim)

The single biggest change to fkit's guarantee surface. On the orchestrated path, "no code before plan
approval" moves from **runtime write-wall (plan mode)** to **prose in the worker prompt** (§3.5). This is
the same shape as ADR-025's honesty clause (prevention removed, labelling/ordering-by-prose in its
place). **Owner-accepted.** The reversing ADR (§10) **must** carry this clause unsoftened — an ADR that
claims plan-gate parity with the direct coder session would be the most damaging artifact this work
could produce (cf. ADR-025 §"honesty clause"). Owners who want the structural wall for a given task can
still ship it the old way: `fkit coder` + `/fkit-task-ship-loop`.

### 9.2 Orchestrator context accumulation

A sprint-long driver context accumulates every task's plan, diff, and review. Mitigation (§3.3): the
*work* runs in fresh spawned contexts; the driver only sequences and relays. Residual: if the driver
starts *judging* (reviewing/ designing) instead of delegating, it becomes the accumulation anti-pattern
ADR-010 killed. Prose-enforced discipline; name it in the agent prompt and the ADR.

### 9.3 Reviewer independence — preserved

The review runs in a spawned `fkit-reviewer` (fresh context) + Codex second opinion — unchanged from
today (ADR-010 §Context). Orchestration sequences it; it does not merge it into the writer's context.
**No regression here** — worth stating because it's the property most likely to be *assumed* broken.

### 9.4 Close honesty (C5) — weaker than it reads, by design

Loop closes carry `(agent-closed — not owner-verified)` by default (owner ruling). ADR-025 §A3 already
records that this marker is **invisible in `/fkit-status`** (`dashboard.sh` collapses it to plain
`done`). So a sprint driven end-to-end can turn a board green with **no surfaced signal** that no human
verified any task. Not a new defect — an **amplification** of ADR-025's accepted cost across many tasks
at once. The ADR must note the amplification.

### 9.5 Doc-drift blast radius

Reversing "lead is a router that does no work" touches the FOUR skills_for_role mirrors + the launcher
menu/help + `fkit-lead.md` + PROJECT.md + wiki. The `skills-for-role.sh:12-24` checklist exists because
this exact mirror set has shipped false statements before (task 70). Plus the **independent** fix:
`architecture.md` §5.2 is stale on the lock mechanism (§1.1) — fold it into the same docs task.

### 9.6 Backward-compat

Additive. `fkit lead` still routes; the new skill is opt-in by name. `fkit-task-ship-loop` and every
other role are untouched. No consuming-project migration.

---

## 10. ADR(s) to record (after owner review — enumerated, not written)

**Recommendation: two ADRs** (mirroring how ADR-019 gave the *task* ship-loop its own autonomy ADR
separate from the mechanism ADRs):

**ADR-031 — `fkit-lead` becomes the orchestrating front door (reverses ADR-010 §Decision 3).**
- Reverses ADR-010 §Decision 3 ("lead is a router, not a doer; no Write/Edit"); **preserves** ADR-010
  Decisions 1, 2, 4, 5 (role-locked sessions, structural separation, consult model, single source of
  truth).
- Records the conductor-not-performer argument (§3.3) — why reversal doesn't revive the
  context-accumulation problem, and why reviewer independence holds.
- Explicit interactions: **ADR-021** (built on, not reversed — workers return questions);
  **ADR-018** (the hook is what makes spawned workers able to run their skills — the enabling fact);
  **ADR-022** (lead already inherits Write/Edit — corrects the stale "no tools" prose);
  **ADR-024** (not reopened — live-relay is the opposite of the declined auto-proceed);
  **ADR-028** (no new role — count unchanged; nature changed; "does no work itself" docs go stale).
- Carries the **§3.5 plan-gate honesty clause verbatim** (§9.1).

**ADR-032 — the `fkit-sprint-ship-loop` autonomy & consent model (analogue of ADR-019 at sprint scope).**
- The bounded-worker/driver-owns-owner-channel model; the per-task drive sequence; the live-relay gate.
- **ADR-025** interaction: agent-closed marker by default; degraded-run stop; never self-cancel; the
  §9.4 amplification.
- **ADR-030** interaction: add `fkit-sprint-ship-loop` to the Stop-hook skip set.

*(If the owner prefers, ADR-032's content can fold into ADR-031 as one decision — but the ADR-019
precedent argues for separating the "who lead is now" reversal from the "how the loop behaves" consent
model. Architect's recommendation: two.)*

---

## 11. Follow-on implementation tasks (recommendation — file only after review)

| # | Task | Depends on | Owner role |
|---|---|---|---|
| T1 | Record **ADR-031** (+ **ADR-032**) via `/fkit-record-decision` | this design reviewed | architect |
| T2 | Evolve `claude/agents/fkit-lead.md` — reverse non-doer prose, add conductor remit + driver discipline, keep routing | T1 | coder |
| T3 | Build `claude/skills/fkit-sprint-ship-loop/SKILL.md` (the driver loop, §5) | T1, T2 | coder |
| T4 | Wire `skills-for-role.sh:37` (`lead += fkit-sprint-ship-loop`) + the **FOUR mirrors** in the same commit | T3 | coder |
| T5 | Launcher menu/help text (`fkit-claude.sh:165,440,467`) — "does no work itself" → accurate to a conductor | T2 | coder |
| T6 | Docs: PROJECT.md (lead description), **architecture.md** (lead role/skill row + **§5.2 stale-lock fix**, §1.1) | T2, T4 | architect (arch.md) / producer (PROJECT.md) |
| T7 | ADR-030 Stop-hook skip set adds `fkit-sprint-ship-loop` — **only when that hook is built** (currently authorized, not built) | T3 + ADR-030 impl | coder |
| T8 | **fkit-wiki** ingest: ADR-031/032, updated lead role, `wiki/systems/fkit.md` lead description | T1, T2 | wiki |

**Dependency shape:** `T1 → T2 → {T3 → T4, T5} → T6 → T8`; T7 gated on the (separate) ADR-030 build.
Each is small; T3 is the substantive one. Scoped as a recommendation — the producer decides sprint
placement (owner: Sprint 2).

---

## 12. Alternatives considered

- **Add a new "orchestrator" role instead of evolving lead.** Rejected by the owner (keep the name,
  grow lead). Also: a new role would trip the seven→eight count ripple (ADR-028) for no authority gain —
  orchestration is not a new *authority*, it's lead's routing remit made active.
- **Have the orchestrator spawn the coder and run `fkit-task-ship-loop`.** Infeasible (C3): the loop
  refuses spawned invocation and couldn't reach the owner anyway (C2). This is *why* the sprint loop is
  a new driver, not a wrapper.
- **Keep implementation in a `fkit coder` session; orchestrate only review/close/relay** (the "split"
  option). Preserves plan mode's structural write-wall. **Declined by the owner** in favor of full drive
  scope (§1). Recorded so the tradeoff is on the record: the owner chose maximum single-point-of-
  interaction over the structural plan gate, knowingly.
- **Timed auto-proceed on owner silence** (so the loop never blocks). Already declined for the task loop
  (ADR-024); the same cost applies and the owner's live-relay model is the deliberate alternative.

---

## 13. Testing strategy

- **`skills-for-role.sh` change:** extend the existing skill-ownership hook test
  (`test/skill-ownership-hook.test.js`, ADR-018) — assert `lead` **owns** `fkit-sprint-ship-loop`
  (allow) and every other role is **denied** it. Pin the JSON deny shape, not just an exit code
  (`skill-ownership-hook.sh` header caution).
- **Mirror parity:** the ADR-027 dual-home parity test + the `skills-for-role.sh:12-24` four-mirror
  checklist catch a docs/source drift; run them in the T4 commit.
- **Binary probes before implementation (not blockers for the design):**
  1. **A spawned `@fkit-coder` can produce a plan and write source when spawned from a lead session** —
     i.e. the ADR-018 hook allows its skills and ADR-022 tools let it Write. High confidence from the
     ADRs; confirm once against the binary (the "measure, don't reason" discipline, ADR-021/024).
  2. **A spawned worker's `NEEDS-DECISION` return reliably reaches the driver as parseable text** and the
     driver's `AskUserQuestion` renders — the live-relay round-trip end to end on a throwaway task.
- **fkit cannot fully test the session-scoped orchestration itself** (a spawned tester inherits the
  caller's context, ADR-028/ADR-012) — the round-trip stays **hand-verified**, like the hooks. Say so;
  don't claim automated coverage it can't have.

---

## 14. Open questions

1. **Plan-artifact without plan mode.** `fkit-plan-task` today leans on plan mode's approval gate; a
   spawned coder must instead **return** a plan as text and write no source. Does `/fkit-plan-task` need
   a small "spawned/return-only" branch, or does the driver's spawn prompt fully carry it? (Design
   leans: driver-prompt carries it; confirm in T3.) — *this is the §13 probe #1 made concrete.*
2. **One ADR or two** (§10). Architect recommends two; owner's call.
3. **Skill name.** `fkit-sprint-ship-loop` is the working name for the owner's *"fkit-spec
   sprint-ship-loop"*. Also worth deciding: is the **general conductor** primitive (§4.1) a separate
   named skill, or only ever exercised *through* the sprint loop? (Owner framed a general capability;
   this spec models the general primitive but names only the sprint-loop application.) — owner's call.
4. **ADR-030 sequencing.** The Stop-hook skip-set entry (T7) can't land until that hook is built (it's
   authorized, not built). Until then the sprint loop's idle turns rely on prose to avoid the footer —
   acceptable, since the hook doesn't exist yet, but note it so it isn't forgotten when ADR-030 ships.

---

**Written:** this file (`ai-agents/knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`).
**No source changed. No ADR written. No task filed. No commit. No wiki write.** The ADRs (§10) and tasks
(§11) are created only after the owner reviews this design (brief verification step 5). If this design
should live in the wiki, **fkit-wiki** ingests it — an architect never writes the vault.
