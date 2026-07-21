---
name: fkit-plan-task
description: Read a task file and produce a concrete implementation plan before any code is written. The plan should account for realistic edge cases, including non-obvious but plausible failure modes, where they could materially affect implementation, correctness, or testing.
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

## Planning Requirements

The plan should be specific enough that implementation can begin immediately after approval.

Include when relevant:
- likely files or subsystems to change
- sequencing of work
- dependencies or blockers
- testing and validation steps
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
