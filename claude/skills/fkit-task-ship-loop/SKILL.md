---
name: fkit-task-ship-loop
description: >-
  The coder's autonomous brief-to-hand-off loop. Takes one backlog task from its brief through plan
  → build → verify → stateful review → ready to close, running autonomously by default after a
  single up-front plan approval and stopping for the owner only at the "important questions". Since
  ADR-033 it closes nothing itself: its terminal act is routing the close to the producer, which
  writes the agent-closed marker. Session-only; refuses a spawned/headless invocation.
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

> ## ⚠️ This skill closes nothing itself — it hands the close to the producer.
> **Read what that does and does not fix.**
> Since [ADR-033](../../../ai-agents/knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
> the task movers are **producer-only** and hook-enforced (ADR-018). The loop's terminal act is to
> **route the close to `fkit-producer`** — it never invokes `/fkit-task-done` itself. The **producer**
> writes `✅ Done (agent-closed — not owner-verified)`.
>
> **Understand what that composes into.** ADR-019 sold this loop's autonomy on **two** human gates: plan
> approval up front, and an owner-only close at the end. ADR-025 removed the second one, and **ADR-033
> did not restore it** — it moved the close to a different *agent*, not to a human. What ADR-033 buys is
> separation of the closing **identity**: the coder can no longer flip its own board green under its own
> identity, and the runtime denies it if it tries. What it does **not** buy is prevention — ADR-033
> §The limit says so plainly: a coder that spawns a producer to close is still *"the coder marks its own
> work done with an extra hop"* (ADR-033 §The limit, quoting ADR-025). Laundering path **L1 — "the
> confused optimist"** survives, one hop longer.
>
> **The plan gate is therefore still the only human checkpoint. It is unremovable.** Treat every doubt
> about scope as a reason to stop, not a reason to proceed — there is no second checkpoint to catch what
> you get wrong here.

## Overview

This skill runs one backlog task **from brief to ready-to-close** with **minimal owner involvement**. The
owner starts the loop, approves the plan, and may then **walk away**; the loop ships the task
autonomously, ending its turn only at an "important question", and **routes the close to the producer**.
It is the operating model settled in
[ADR-019](../../../ai-agents/knowledge-base/decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)
§Decision 5, **twice amended**: by
[ADR-025](../../../ai-agents/knowledge-base/decisions/adr-025-spawned-agents-may-invoke-the-task-movers.md)
(which removed the owner-only done-gate) and then by
[ADR-033](../../../ai-agents/knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
§3 (which turned the coder's self-close into a producer route) — plus the owner-approved design spec
[`reports/2026-07-17-design-task-ship-loop-skill.md`](../../../ai-agents/knowledge-base/reports/2026-07-17-design-task-ship-loop-skill.md)
(rev 3, §11).

**Say the cost plainly** (ADR-033 §Consequences): **autonomous shipping now ends at a producer hand-off,
not a green board.** The loop's autonomy is narrower than ADR-019 first granted — one more hop, one more
agent, before a task leaves the board.

**Argument:** `$ARGUMENTS` — the path to the **task brief** (e.g.
`ai-agents/tasks/backlog/0042-add-export-endpoint/brief.md`). An **operand** — it selects *which task* the loop
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

Since ADR-029 these artifacts live **inside the task folder** alongside `brief.md`:

| File | Written by the loop | Holds |
|---|---|---|
| `<task-folder>/plan.md` | at plan approval | the approved implementation plan — **the boundary the loop's autonomy is measured against** |
| `<task-folder>/worklog.md` | opened post-approval, grows P2–P5 | worklog + owner-decision log (every important question asked, **every obvious winner chosen while the owner was away**) → the finalized close-out report |
| `<task-folder>/review.md` | reviewer + coder (existing ledger) | the two-party review findings/verdicts — a **separate** file (different ownership); not merged into the worklog |

`<task-folder>` = `ai-agents/tasks/<board>/<NNNN>-<slug>/` — the same folder that holds `brief.md`.

- All three are **git-tracked, left in the working tree; the owner commits — never the loop.** The
  folder already exists (the brief is in it); just write the file beside `brief.md`.
- They **move with the folder** when the **producer's** `/fkit-task-done` (or `-cancelled`) relocates the
  task — they are reserved names inside it, not separate top-level records. None is wiki-ingested; none is
  a task brief.
- **Fail-safe on resume:** if the loop cannot establish from these files that a gate was passed, it
  **returns to the nearest owner gate** — it never infers a plan approval it cannot evidence.
- **Status write = both locations:** every status transition writes the brief's `## Status` **and** the
  sprint-plan row in the same step; a half-written status is an error to finish, never left disagreeing.
  **One carve-out — a half-landed close** (step 9): once the producer has moved the folder, a landed
  `✅ Done` is **the owner's**, so the loop marks only the **stale** location and leaves the `✅ Done`
  alone. That is the single sanctioned disagreement, and only because no agent can lawfully reconcile it
  (`fkit-task-done/SKILL.md:78-82`, `:283-286`). It is always **reported**, never left silent.

---

## The loop, numbered

> **⛔ STOP** steps are owner gates. The owner approves the plan (step 3), then may walk away; the loop
> ships the task and **hands the close to the producer**. **Step 3 is the only guaranteed stop** — after
> it, the loop may run all the way to that hand-off without the owner returning at all.

1. **Ground.** Read the brief at `$ARGUMENTS`; resolve the task-id. Read the wiki (`/fkit-query`),
   `ai-agents/knowledge-base/architecture.md`, and any ADR whose **"Re-raise only if"** bears on the
   work. *(Autonomous.)*
2. **Clarify & plan.** If the brief is ambiguous on design/scope, consult **@fkit-architect**
   (design/structure) or **@fkit-producer** (scope/requirements) at **hop 1** — state "hop 1 of 2" and
   surface any open questions they return. Run **`/fkit-plan-task`** → produce the plan in plan mode.
   *(The plan is persisted to `<task-folder>/plan.md` at approval in step 4 — plan mode's write
   wall forbids writing it here, and ADR-020 keys the artifact to plan approval.)* *(Autonomous up to
   the gate.)*
3. **⛔ STOP — plan approval.** Present the plan (+ any open questions) and wait. **If the owner rejects
   it, stop** — the task stays `🔲 Backlog` (In progress is *not* set); report the rejection to the
   owner (no worklog is opened before approval). *After approval, the owner may walk away.*
4. **Persist the plan, mark In progress & build.** On approval (plan mode releases the write wall),
   write the approved plan to `<task-folder>/plan.md` — the durable autonomy boundary. Set
   `🔄 In progress` in **both** the brief `## Status` **and** the sprint row. Open
   `<task-folder>/worklog.md`. Implement the approved plan with minimal, idiomatic diffs, logging
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
     **loudly "reviewed — NOT model-diverse"** in the worklog — and, per step 9, **do not route the
     close** for a run that never got a model-diverse pass; put the close to the owner.
7. **Re-verify & loop.** **If any code changed in step 6, return to step 5.** Repeat steps 6–7 until
   the ledger is **closed-out with the last verify green.** Non-convergence (the loop-check fires) →
   **⛔ STOP** with the convergence call and a `🚧 Blocked — review not converging` worklog.
8. **Finalize the report.** Complete `<task-folder>/worklog.md` into the close-out
   **evidence packet** (see below) — evidence for the owner to judge, **not** a done-verdict.
9. **Route the close to the producer — never close it yourself.** The movers are **producer-only**
   (ADR-033 §1) and the ADR-018 `PreToolUse` hook **denies** a mover call from the coder identity at any
   spawn depth, so **do not invoke `/fkit-task-done`**. Instead spawn **@fkit-producer** (**hop 1**, no
   cycle) and ask it to close the finished task — naming the brief path, the task-id, and the evidence
   packet. The **producer** runs the mover and writes `✅ Done (agent-closed — not owner-verified)` in
   the brief and every board row (ADR-033 §5 — a **spawned** producer has no owner channel, so its close
   is never owner-verified). *(Autonomous.)*

   - **Confirm the close landed, then report.** The producer's own close-out report enumerates **every**
     doc it touched (`fkit-task-done` step 7): board rows, the brief's own `## Status`, any parent epic
     slice, `backlog.md`, in-body `**Status:**` lines, and every re-pointed href — including under
     `sprints/done/`, `sprints/reviews/` and the knowledge-base. **Read that report**, and cross-check
     it against the state you can see (folder now under `done/`; brief `## Status` and sprint row read
     Done **with** the marker). A three-location spot-check on its own cannot see a partial close —
     **do not claim a close you did not verify.** Then report the close, the marker, and the evidence
     packet to the owner.
   - **If the close half-landed, work out WHICH half first — only one case is an agent's to fix.**
     - **The folder never moved** (the producer failed before relocating it): **re-spawn @fkit-producer
       once**, naming what is missing. The mover runs normally from a `backlog/` folder. If the re-spawn
       also fails, nothing was closed and no `✅ Done` exists — so the ordinary rule applies: write
       `🚧 Blocked — hand-off incomplete: <what disagrees>` in **both** locations.
     - **The folder moved but a status or href is stale:** **only the owner can repair this.**
       `/fkit-task-done` **stops** on a folder already under `ai-agents/tasks/done/`, and its one
       exception — the owner-verification upgrade — is **owner-only** (`fkit-task-done/SKILL.md:78-82`);
       `✅ Done` is skill-gated and must **never** be hand-edited (`:283-286`). Do **not** re-spawn the
       producer for this case: write `🚧 Blocked — hand-off incomplete: <what disagrees>` **on the
       location still stale**, leave any `✅ Done` the producer legitimately wrote **untouched**, and
       **⛔ STOP** for the owner.
     - Either way the loop writes **only** its own `🚧 Blocked` marker, and **never** a `✅ Done` —
       statuses on a closing task are the producer's, and a landed close is the owner's.
   - **Do not route a degraded run.** If the review never got a Codex pass (step 6), or any verification
     is red, or a residual is unresolved — **⛔ STOP** and put the close to the owner instead. Routing
     work you already know is weak launders it through the producer; the extra hop is not a second
     judgment (ADR-033 §The limit).
   - **Cancelling is different — do not route it either.** If the loop concludes the task should be
     **cancelled** rather than done, **⛔ STOP and ask.** `cancelled/` is audited by nobody, and an
     agent retiring its own unfinishable obligation is the one move with no detection path at all
     (ADR-025 §Consequences) — a producer spawn does not fix that.

**Any early exit** (step 3 rejection, step 5 budget, step 7 non-convergence, a consult dead-end): set
the accurate status (`🔲 Backlog` on rejection, else `🚧 Blocked — <reason>`, **both locations** — except
the step-9 half-landed close, where only the stale location is marked and a landed `✅ Done` is left for
the owner), finalize the worklog with the reason, and **end the turn** — the owner returns to it. **On resume,
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
5. **A close the loop should not route itself** (step 9): a degraded run (no Codex pass, red
   verification, unresolved residual), a conclusion that the task should be **cancelled**, or a producer
   hand-off that did not land.
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

### The close-out evidence packet — the finalized `<task-folder>/worklog.md`
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
| **Handed off to the producer → closed** | ledger closed-out **and** last verify green | finalize worklog → spawn **@fkit-producer** to close (the loop never invokes the mover) → confirm the close landed → report the close and its marker |
| **Back to Backlog** | owner rejects the plan (step 3) | status stays `🔲 Backlog` (In progress not set); report the rejection (no pre-approval worklog); STOP |
| **Blocked — verification** | step 5 budget (3 no-progress cycles) hit | `🚧 Blocked — verification: <what fails>` (both locations); finalize worklog; STOP |
| **Blocked — review non-convergence** | step 7 oscillation (loop-check fires) | surface the convergence call; `🚧 Blocked — review not converging`; STOP |
| **Blocked — needs a decision** | a fix/plan question beyond the plan | surface; `🚧 Blocked — awaiting decision: <q>`; STOP |
| **Blocked — consult dead-end** | a hop-2 open question can't be answered | surface; `🚧 Blocked — <q>`; STOP |
| **Blocked — hand-off didn't land** | the producer spawn failed, was denied, or left the close partial | **folder never moved** → re-spawn **@fkit-producer** once, then if still unresolved `🚧 Blocked — hand-off incomplete: <what disagrees>` in **both** locations; **folder moved, a status/href stale** → owner-only, do not re-spawn, mark **only the stale location** (never over a landed `✅ Done`). Either way: STOP |
| **Proceeds, flagged — but does NOT route the close** | Codex absent after 3 attempts | finish the work and the report, mark it loudly "reviewed — NOT model-diverse", then **STOP** and put the close to the owner |

**Invariants:**
- `🔄 In progress` is set **only after plan approval** (a pre-approval exit leaves `🔲 Backlog`).
- On an **early exit, `🔄 In progress` is correct, not stale** — work started, close-out pending.
- On **resume**, re-derive status from the durable artifacts and correct any status that no longer
  matches reality.
- Every exit finalizes the worklog. The loop **never sets `✅ Done` at all** — only the **producer** it
  routes to does, via `/fkit-task-done` and always with the agent-closed marker. Hand-editing a status to
  Done is forbidden on every path.

---

## Hard rules

- **Session-only.** Refuse a spawned/headless invocation — return the plan, do not run the loop.
- **The plan gate is unremovable — and it is still the ONLY human checkpoint.** ADR-025 removed the
  owner-only close and ADR-033 **did not bring it back** (it moved the close to the producer, another
  agent). No code before the owner approves the plan (step 3). There is no second gate to catch a bad plan.
- **Autonomy is bounded by fix shape** (mechanical + in-plan `CORRECT`, or an obvious winner). Every
  judgment call and every direction/scope change **stops**. **When in doubt, stop.**
- **You close nothing yourself.** Neither mover is yours — both are producer-only (ADR-033 §1) and
  hook-denied to the coder identity. Your terminal act is a **producer hand-off** (step 9); the producer
  writes the `(agent-closed — not owner-verified)` marker. A **cancel** is never routed either: it
  **stops for the owner** — `cancelled/` is audited by nobody, so an agent retiring its own obligation has
  no detection path.
- **Never route a degraded run.** No Codex pass, red verification, or an unresolved residual ⇒ finish
  the report and **hand the close to the owner**. Pushing work you already know is weak through a
  producer spawn is the exact failure the removed gate used to catch — the extra hop is not a second
  judgment (ADR-033 §The limit).
- **`fkit-process-stateful-review` is used by *method*, not invoked-and-overridden**, and is
  byte-unchanged; the review ledger's *Reviewer findings* section is reviewer-owned — never edit it.
- **Re-verify after any post-review code change** before handing the close off (step 7).
- **Codex second opinion cannot be silently skipped** — retry 3×, then proceed-and-flag loudly.
- **Do not commit or push** — leave every edit (source, plan, worklog, ledger) in the working tree; the
  owner commits.
- **Never write `ai-agents/wiki-vault/`** — ever.
- **Record every autonomous choice** in the worklog decision log, so the owner's absence is auditable.

## Usage

```
/fkit-task-ship-loop ai-agents/tasks/backlog/0042-add-export-endpoint/brief.md
```
