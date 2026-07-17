---
name: fkit-task-ship-loop
description: The coder's autonomous brief-to-done loop. Takes one backlog task from its brief through plan → build → verify → stateful review → ready-for-done, running autonomously by default after a single up-front plan approval and stopping for the owner only at the "important questions" and the owner-only done-gate. Session-only; refuses a spawned/headless invocation. Does NOT move task files.
---

# Task Ship-Loop (coder side)

> ## ⛔ Owner: the **coder**
> This is the fkit-coder's own procedure. Execute it **only** if you are the coder — running in a
> `fkit coder` **session** with the owner reachable.
>
> **Any other role: do not execute this** — and it cannot be handed off as a spawned consult either
> (the loop is session-only and refuses a spawned/headless invocation). To ship a task with it, open a
> coder session and run it there:
> ```
> fkit coder
> /fkit-task-ship-loop <brief-path>
> ```

> ## ⛔ This skill does NOT move task files.
> Despite the `task-*` name, this is **not** part of the producer's task-file-lifecycle namespace
> (`task-brief`, `task-done`, `task-cancelled`). It **never** moves a brief between
> `backlog/`, `done/`, `cancelled/`, **never** sets `✅ Done`, and **never** tells or spawns another
> agent to do so. Its terminal act is a finalized evidence packet plus an ask — the owner closes the
> task the normal way, via the owner-invoked `/fkit-task-done` in a `fkit producer` session
> ([ADR-019](../../../ai-agents/knowledge-base/decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)).

## Overview

This skill runs one backlog task **from brief to ready-for-done** with **minimal owner involvement**.
The owner starts the loop, approves the plan, and may then **walk away**; the loop ships the task
autonomously, ending its turn only at an "important question" or a gate, and the owner returns at the
done-gate. It is the operating model settled in
[ADR-019](../../../ai-agents/knowledge-base/decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)
and the owner-approved design spec
[`reports/2026-07-17-design-task-ship-loop-skill.md`](../../../ai-agents/knowledge-base/reports/2026-07-17-design-task-ship-loop-skill.md)
(rev 3, §11).

**Argument:** `$ARGUMENTS` — the path to the **task brief** (e.g.
`ai-agents/tasks/backlog/add-export-endpoint.md`). An **operand** — it selects *which task* the loop
ships. Per [`conventions/one-skill-one-output.md`](../../../ai-agents/knowledge-base/conventions/one-skill-one-output.md)
there are **no output-variant arguments**: no `full`, no verbosity flag, no summary/partial mode. One
brief in, one loop.

**Task-id** — the brief's basename without extension (`ai-agents/tasks/**/<task-id>.md` →
`<task-id>`). It keys the three durable artifacts below and the review ledger. Resolve it once and use
it verbatim everywhere (the reviewer must agree, or the review ledger forks).

## What makes this autonomous — and what still stops (read first)

Invoking this coder-owned, hook-enforced skill (ADR-018) **is** the owner's authorization to proceed
autonomously. The loop carries the review **rigor** under its own discipline — it does **not** weaken
`fkit-process-stateful-review`'s per-round gate, which is byte-unchanged and still in force for every
use of it **outside** this loop. Autonomy here is bounded, not blanket:

- **One guaranteed upfront human checkpoint: the plan gate.** The owner approves *what gets built*
  before any code (runtime-enforced by plan mode). Only after approval may the owner walk away.
- **Between gates the loop proceeds without waiting.** "Walk away" is ordinary in-session turn-taking:
  at an important question the loop **ends its turn and idles** until the owner returns to the terminal.
- **Autonomy is bounded by fix *shape*, not verdict.** The loop applies a change without asking **only
  if** it is (a) verified `CORRECT`, **and** (b) mechanical/localized, **and** (c) inside the approved
  plan's design — **or** it is an **obvious winner** (one option clearly dominates on the merits *and*
  stays within the approved plan's intent). **When in doubt about the shape, it stops.**
- **Session-only.** If you are a genuinely spawned/headless invocation (no owner reachable in-session),
  **refuse**: do not run the loop, produce the plan and return it, and say why (`fkit-coder.md:28-33`).

## Durable state — the loop does NOT trust its own memory

A SKILL.md holds no memory across turns or context compaction, and this loop runs long autonomous
stretches. It anchors to durable, git-tracked, task-id-keyed files and **re-derives its position on
every resume** ([ADR-020](../../../ai-agents/knowledge-base/decisions/adr-020-per-task-plan-and-worklog-artifacts.md)):

| File | Written by the loop | Holds |
|---|---|---|
| `ai-agents/plans/<task-id>.md` | at plan approval | the approved implementation plan — **the boundary the loop's autonomy is measured against** |
| `ai-agents/worklogs/<task-id>.md` | opened post-approval, grows P2–P5 | worklog + owner-decision log (every important question asked, **every obvious winner chosen while the owner was away**) → finalized ready-for-done report |
| `ai-agents/reviews/<task-id>.md` | reviewer + coder (existing ledger) | the two-party review findings/verdicts — a **separate** file (different ownership); not merged into the worklog |

- Both new files are **git-tracked, left in the working tree; the owner commits — never the loop.**
  Create the `ai-agents/plans/` and `ai-agents/worklogs/` directories if they do not yet exist.
- Neither is moved by `/fkit-task-done`; neither is wiki-ingested; neither is a task brief (the
  owner-only move rule does not apply — they are records keyed by id that stay put).
- **Fail-safe on resume:** if the loop cannot establish from these files that a gate was passed, it
  **returns to the nearest owner gate** — it never infers a plan approval it cannot evidence.
- **Status write = both locations:** every status transition writes the brief's `## Status` **and** the
  sprint-plan row in the same step; a half-written status is an error to finish, never left disagreeing.

---

## The loop, numbered

> **⛔ STOP** steps are owner gates. The owner approves the plan (step 3), then may walk away; the loop
> ships autonomously and the owner returns at the done-gate (step 9).

1. **Ground.** Read the brief at `$ARGUMENTS`; resolve the task-id. Read the wiki (`/fkit-query`),
   `ai-agents/knowledge-base/architecture.md`, and any ADR whose **"Re-raise only if"** bears on the
   work. *(Autonomous.)*
2. **Clarify & plan.** If the brief is ambiguous on design/scope, consult **@fkit-architect**
   (design/structure) or **@fkit-producer** (scope/requirements) at **hop 1** — state "hop 1 of 2" and
   surface any open questions they return. Run **`/fkit-plan-task`** → produce the plan in plan mode.
   *(The plan is persisted to `ai-agents/plans/<task-id>.md` at approval in step 4 — plan mode's write
   wall forbids writing it here, and ADR-020 keys the artifact to plan approval.)* *(Autonomous up to
   the gate.)*
3. **⛔ STOP — plan approval.** Present the plan (+ any open questions) and wait. **If the owner rejects
   it, stop** — the task stays `🔲 Backlog` (In progress is *not* set); report the rejection to the
   owner (no worklog is opened before approval). *After approval, the owner may walk away.*
4. **Persist the plan, mark In progress & build.** On approval (plan mode releases the write wall),
   write the approved plan to `ai-agents/plans/<task-id>.md` — the durable autonomy boundary. Set
   `🔄 In progress` in **both** the brief `## Status` **and** the sprint row. Open
   `ai-agents/worklogs/<task-id>.md`. Implement the approved plan with minimal, idiomatic diffs, logging
   notable decisions and **every obvious winner** chosen. *(Autonomous.)*
5. **Verify.** Test per project conventions (ADR-014: `node --test`, zero devDeps for this repo),
   using sub-agents where they help. On failure: diagnose → fix → re-verify. **Budget: 3 no-progress
   cycles** → **⛔ STOP** with a `🚧 Blocked — verification: <what fails>` worklog. A fix that needs a
   decision beyond the plan → **⛔ STOP**. *(Autonomous within budget.)*
6. **Review.** Spawn **@fkit-reviewer** → **`/fkit-stateful-review`** (working tree, task-id; **hop
   1**). Then apply the **method** of `fkit-process-stateful-review` (do **not** run that skill's owner
   gate — this loop's authorization replaces it): verify each finding against the code, classify defect
   vs frontier-move, loop-check against Accepted residuals **and** ADR "Re-raise only if" conditions,
   write your verdicts to the *Coder response* section of the ledger.
   - **Apply autonomously:** mechanical, in-plan `CORRECT`-defect fixes, and obvious winners.
   - **⛔ STOP** for any **judgment call**: a frontier-move / recording a residual, a regression or
     review oscillation, a disputed severity that changes scope, a broad/behavior-changing fix, or
     anything **outside the approved plan** (a new architecture/scope decision → owner,
     `fkit-coder.md:109-113`).
   - **Partial (no Codex)?** Re-request the review up to **3 attempts total** (absorbing a transient
     outage). If still no model-diverse pass, **proceed** — do not stop and wait — but mark the task
     **loudly "reviewed — NOT model-diverse"** in the worklog and at the done-gate.
7. **Re-verify & loop.** **If any code changed in step 6, return to step 5.** Repeat steps 6–7 until
   the ledger is **closed-out with the last verify green.** Non-convergence (the loop-check fires) →
   **⛔ STOP** with the convergence call and a `🚧 Blocked — review not converging` worklog.
8. **Finalize the report.** Complete `ai-agents/worklogs/<task-id>.md` into the ready-for-done
   **evidence packet** (see below) — evidence for the owner to judge, **not** a done-verdict.
9. **⛔ STOP — the done-gate.** The owner returns; ask whether to mark the task done. **The loop does
   not move the file and does not spawn a producer to move it.** The owner closes via the normal
   owner-invoked `/fkit-task-done` (a producer session); status stays `🔄 In progress` until the mover
   sets `✅ Done`.

**Any early exit** (step 3 rejection, step 5 budget, step 7 non-convergence, a consult dead-end): set
the accurate status (`🔲 Backlog` on rejection, else `🚧 Blocked — <reason>`, **both locations**),
finalize the worklog with the reason, and **end the turn** — the owner returns to it. **On resume,
re-derive position from the durable artifacts and fail safe to the nearest owner gate.** No path ends
in silence.

---

## The owner-contact contract

### STOP for the owner — the "important questions"
1. **Plan approval** (step 3) — the one guaranteed upfront gate.
2. **Blocking ambiguity in the brief** that changes *what* gets built.
3. **A genuinely new architecture/scope decision** the plan didn't anticipate — a change of direction.
4. **Review judgment calls** (step 6): a frontier-move / accepting a residual, a regression or review
   oscillation, a disputed severity that changes scope, a broad/behavior-changing fix, or a fix outside
   the approved plan.
5. **The done-gate** (step 9).
6. **A dead-end** it can't resolve (verification it can't get green within budget; a consult that
   returns nothing usable).

### The "obvious winner" override
Do **not** manufacture an important question out of a no-brainer. Where one option **clearly dominates
on the merits** *and* stays **within the approved plan's intent**, **pick it and proceed** — and
**record it in the worklog's decision log** so the owner sees exactly what was chosen while away. The
boundary: a genuine tradeoff with no dominant option, or any choice that **changes direction/scope**,
is **not** a winner — it stops (items 2–4). **When in doubt, stop.**

### Proceed autonomously (no stop)
Grounding; implementing the approved plan; verify cycles within budget; verifying/classifying review
findings; applying mechanical in-plan `CORRECT`-defect fixes and obvious winners; consulting agents
within the hop budget.

### The ready-for-done evidence packet — the finalized `worklogs/<task-id>.md`
Evidence for the owner to judge, **not** a done-verdict. Contains, at minimum:
- **Task filename · problems encountered · lessons learned · open questions.**
- **Owner-decision log** — every important question asked and every obvious winner chosen while the
  owner was away (the autonomy audit trail).
- **Review ledger** — path, verdict line, all findings resolved/dispositioned, **and the Codex-coverage
  state** (full vs partial — if partial, flagged loudly).
- **Verification evidence, concrete** — commands + pass/fail, **from the run after the final code
  change**, not "verification passed."
- **The brief's `## Verification steps`, walked and ticked** — each criterion met/unmet.
- **Files touched / change surface** — the diff scope (frames the later wiki sync's delta).
- **Residuals / deferrals** and **recommended follow-up tasks** — *named only*; the loop does **not**
  file briefs (producer's job) and does **not** write the wiki (fkit-wiki's job).
- **Commit state** — explicit (`git status`; the loop never commits).

---

## Failure & exit behavior — never a silent stall

| Terminal state | Trigger | The loop does |
|---|---|---|
| **Ready for done** | ledger closed-out **and** last verify green | finalize worklog → done-gate (STOP) |
| **Back to Backlog** | owner rejects the plan (step 3) | status stays `🔲 Backlog` (In progress not set); report the rejection (no pre-approval worklog); STOP |
| **Blocked — verification** | step 5 budget (3 no-progress cycles) hit | `🚧 Blocked — verification: <what fails>` (both locations); finalize worklog; STOP |
| **Blocked — review non-convergence** | step 7 oscillation (loop-check fires) | surface the convergence call; `🚧 Blocked — review not converging`; STOP |
| **Blocked — needs a decision** | a fix/plan question beyond the plan | surface; `🚧 Blocked — awaiting decision: <q>`; STOP |
| **Blocked — consult dead-end** | a hop-2 open question can't be answered | surface; `🚧 Blocked — <q>`; STOP |
| **Proceeds, flagged** | Codex absent after 3 attempts | proceed to the report/done-gate; task marked loudly "reviewed — NOT model-diverse" (not a stop) |

**Invariants:**
- `🔄 In progress` is set **only after plan approval** (a pre-approval exit leaves `🔲 Backlog`).
- At the **done-gate, `🔄 In progress` is correct, not stale** — work done, close-out pending the owner.
- On **resume**, re-derive status from the durable artifacts and correct any status that no longer
  matches reality.
- Every exit finalizes the worklog; the loop **never sets `✅ Done`.**

---

## Hard rules

- **Session-only.** Refuse a spawned/headless invocation — return the plan, do not run the loop.
- **The plan gate is unremovable.** No code before the owner approves the plan (step 3).
- **Autonomy is bounded by fix shape** (mechanical + in-plan `CORRECT`, or an obvious winner). Every
  judgment call and every direction/scope change **stops**. **When in doubt, stop.**
- **Never move a task file, never set `✅ Done`, never tell or spawn another agent to.** The done-gate
  is owner-only.
- **`fkit-process-stateful-review` is used by *method*, not invoked-and-overridden**, and is
  byte-unchanged; the review ledger's *Reviewer findings* section is reviewer-owned — never edit it.
- **Re-verify after any post-review code change** before closing (step 7).
- **Codex second opinion cannot be silently skipped** — retry 3×, then proceed-and-flag loudly.
- **Do not commit or push** — leave every edit (source, plan, worklog, ledger) in the working tree; the
  owner commits.
- **Never write `ai-agents/wiki-vault/`** — ever.
- **Record every autonomous choice** in the worklog decision log, so the owner's absence is auditable.

## Usage

```
/fkit-task-ship-loop ai-agents/tasks/backlog/add-export-endpoint.md
```
