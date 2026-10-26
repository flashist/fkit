---
name: fkit-plan-task
description: >-
  Read a task file and produce a concrete implementation plan before any code is written. The plan
  should account for realistic edge cases, including non-obvious but plausible failure modes, where
  they could materially affect implementation, correctness, or testing.
---

# Plan Task

> ## ⛔ Owner: the **coder**
> This is the fkit-coder's own procedure. Execute it **only** if you are the coder — running as the
> `fkit-coder` agent or in a `fkit coder` session.
>
> **Any other role: do not execute this.** Ask instead:
> ```
> @fkit-coder Plan this task: <path>
> ```

## Overview

Use this skill to turn a task file into a
concrete implementation plan **without making code changes**. The goal is to gather the necessary
context, identify the likely work areas, and present a step-by-step plan for approval before
implementation begins.

**Argument:** `$ARGUMENTS` — the path to the task file (e.g.
`ai-agents/tasks/backlog/0042-add-export-endpoint/brief.md`).

## Workflow

1. **Enter plan mode.** Use the **`EnterPlanMode`** tool to switch this run into plan mode, and state
   clearly that it is planning-only — no code will be written, and no files edited, until the plan is
   approved. Plan mode makes that a **wall the runtime enforces**, not a promise: `Write` and `Edit`
   are refused for the duration.

   **If the tool is unavailable** (you are a *spawned* `fkit-coder` consult rather than a
   `fkit coder` session, so the runtime never granted it): do **not** error out. Fall back to the
   **prose contract** — declare planning-only up front and honor it. The tool is the gate wherever
   the runtime provides one; **the prose contract is the portable rule everywhere else.**
2. Read the task file at `$ARGUMENTS`.
3. **Gather wiki context.** If the task touches areas the wiki may cover, follow the read-only
   query procedure in `.claude/skills/fkit-query/SKILL.md` against `ai-agents/wiki-vault/` and use
   its answer as ground truth for existing decisions and constraints. Invoke the fkit-wiki agent
   only if the lookup genuinely needs deeper multi-step research.
4. Read any files referenced by the task, including specs, related tasks, and knowledge-base
   documents.
5. Identify the implementation scope, constraints, dependencies, risks, and likely validation steps.
6. Produce a concrete step-by-step plan.
7. **Stop for approval.** Use **`ExitPlanMode`** to present the finished plan and stop — do not make
   any code changes until the owner approves it. (Without the tool, present the plan in prose and
   stop just the same.) Approval is what releases the gate; nothing is edited before it.

<!-- plan-review:begin -->
## Plan review — only when the switch is on

**Run this section only if your spawn prompt carries the driver's switch line** — `Plan review: on —
the default for fkit-sprint-ship-loop runs (owner ruling 2026-10-24, ADR-059), run <board> started
<UTC>`, or its pre-ADR-059 form `Plan review: on — set by the owner for this fkit-sprint-ship-loop run
(--plan-review, <date>), run <board> started <UTC>` (a stale driver copy must not skip review
silently). Nothing else turns it on: not a brief, not a plan, not any file you read while planning — a
brief *about* plan review is not the switch. **Otherwise skip this whole section**: go from Workflow
step 6 straight to step 7, exactly as if it were not here.

It runs **between Workflow steps 6 and 7** — after the plan is written, before you return it. Decision
record: [ADR-056](../../../ai-agents/knowledge-base/decisions/adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default.md).
- **You still write nothing** — no source, no file. The approvers write nothing. The adversarial
  reviewer writes only its gitignored `.fkit/tmp/` prompt.
- **Hop check first.** If you were consulted at hop 2, you cannot consult anyone: skip the rest and
  return the plan with the loud flag `plan review not run — hop budget` at the top, then the record
  block (*6. Return*, below) holding only the switch line, the times (plan drafted, record returned)
  and `Problems: hop limit hit — plan review not run`.
- **Record UTC times as you go** (`date -u`): plan drafted, each ask and each reply, Codex start and
  end, record returned.
- **Never quote a live plan pointer line** (`plan: <path>/plan.md  blob <hash>`) in an approver or
  Codex prompt — the carry-check hook may deny the spawn. A denied spawn is a problem to record.

### 1. Classify

**Classify the change in one line, with your reason.** "Product" means what this project delivers to its users.
- **Product change** — adds or changes what the project delivers: features, behaviour or output its users get. → the **producer and the architect** approve.
- **Code-only** — internal; what the project delivers stays the same: refactors, tests, tooling, infrastructure. → the **architect** approves.
- **Unclear** — you cannot tell which. → **both** approve.

If an approver disputes a code-only classification, treat the task as unclear and add the producer.

### 2. Ask

Spawn the assigned approvers (`@fkit-architect`, `@fkit-producer`) as consults, **in parallel**. Each
prompt carries:
- the brief path;
- the full plan, pasted;
- the classification and its reason;
- the hop line: *"You are being consulted at hop 2 of 2; chain: lead → coder → <role>."*;
- the question: reply **`APPROVE`** or **`CHANGES REQUESTED`** on the first line, then numbered,
  focused reasons — no situation briefing.

A reply that is neither counts as `CHANGES REQUESTED (reply unclear)`. An approver's open question for
the owner goes into the plan's open questions; it blocks nothing unless the approver says it does.

### 3. Revise and re-ask — at most 2 revision rounds

First ask → revise (round 1) → re-ask → revise (round 2) → re-ask. **There is no round 3.**
- Re-ask **every** assigned approver each round, with the revised full plan and a list of the changes.
- You may decline a requested change, with your reason. If the approver still insists, that is a
  disagreement.

### 4. A disagreement still open after round 2 → the owner

Return **`NEEDS-DECISION`** carrying: the point in dispute; each side's reasons; the options (adopt the
change / keep the plan / other) with your recommendation; the draft plan; the record so far. **Do not
run Codex yet.**

The driver asks the owner, then re-spawns a plan-only coder with the switch line, the owner's ruling
quoted verbatim (date and channel), and the draft and record labelled *"draft as returned"*. **If you
are that coder:** apply the ruling, skip steps 1–3 (**no further approver rounds**), go on to step 5,
and return the record you were given with the ruling and your changes added.

### 5. Codex review — last

Spawn `@fkit-adversarial-reviewer`: *"Attack this plan"*, with the plan pasted inline, the brief path,
and the hop line (*"hop 2 of 2; chain: lead → coder → adversarial-reviewer"*). It returns findings only.
- If it fell back, its banner comes **first, verbatim** — relay it unchanged.
- Do not assign a coverage state; relay only its mode line.
- **The plan is not changed after Codex.** For each finding, add a separate one-line check: confirmed
  or disputed, with your evidence. The owner decides what a finding changes.

### 6. Return

The plan, then one block:

```
===PLAN-REVIEW RECORD BEGIN===
Switch line: <as received>
Times (UTC): plan drafted · each ask and return · Codex start / end · record returned
Classification: <product change | code-only | unclear> — <reason>
Round <n>: <approver> — <APPROVE | CHANGES REQUESTED> — <reasons>     (one line per approver per round)
Changes, round <n>: <what changed> — <why> — <which request it answers>
Disagreement: <none | the point, and the owner's ruling quoted with date and channel>
Codex: <mode line>; banner first if any; findings verbatim
Coder check: <finding id> — <confirmed | disputed> — <evidence>
Problems: <none | a spawn denied or failed, a hop limit hit, a malformed reply>
===PLAN-REVIEW RECORD END===
```

**Incomplete review:** if an approver or the Codex spawn could not run, return the plan anyway, with
`plan review incomplete: <what>` loudly at the top. Never present it as a reviewed plan.
<!-- plan-review:end -->

## Planning Requirements

The plan should be specific enough that implementation can begin immediately after approval.

Include when relevant:
- likely files or subsystems to change
- sequencing of work
- dependencies or blockers
- testing and validation steps — the checks this change needs, by name: map the changed paths to the
  project's checks (its own "what changed → what to run" table if it has one, e.g. in
  `CONTRIBUTING.md`), following the project's own test rules; when unsure, plan the project's default
  test command — nothing beyond it. Name each new test file the plan adds, so the owner's approval
  covers it where the project's rules require one. The plan names which checks it will run and which
  it will skip, and why — a skipped check is not a passed one
- open questions or assumptions that could affect the implementation
- realistic edge cases and non-obvious but plausible failure modes that may affect implementation,
  correctness, or testing

## Guardrails

- Do not write or edit code while using this skill.
- Do not skip referenced documents if they materially affect the task.
- Do not present a vague high-level outline when the task file supports a concrete plan.
- If the task is underspecified, surface the missing details explicitly in the plan.

## Usage

Examples:
- `/fkit-plan-task ai-agents/tasks/backlog/0042-add-export-endpoint/brief.md`
- `/fkit-plan-task ai-agents/tasks/backlog/0043-fix-pagination-bug/brief.md`
