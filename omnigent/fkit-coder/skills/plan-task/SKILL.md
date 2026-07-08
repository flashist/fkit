---
name: plan-task
description: Read a task file and produce a concrete implementation plan before any code is written. The plan should account for realistic edge cases, including non-obvious but plausible failure modes, where they could materially affect implementation, correctness, or testing.
---

# Plan Task

## Overview

Use this skill to turn a task file into a concrete implementation plan **without making code
changes**. The goal is to gather the necessary context, identify the likely work areas, and present a
step-by-step plan for approval before implementation begins.

**Argument:** `$ARGUMENTS` — the path to the task file (e.g.
`ai-agents/tasks/backlog/add-export-endpoint.md`).

## Workflow

1. **Declare planning-only.** State clearly, up front, that this run is planning-only — no code will
   be written yet, and no files will be edited until the plan is approved.
2. Read the task file at `$ARGUMENTS`.
3. **Gather wiki context.** If a wiki exists at `ai-agents/wiki-vault/`, ground yourself in it before
   proceeding: read `ai-agents/wiki-vault/index.md`, identify the pages relevant to this task, read
   them, and follow any `[[wikilinks]]` up to 2 hops. Treat the wiki as ground truth for existing
   decisions and constraints.
4. Read any files referenced by the task, including specs, related tasks, and knowledge-base documents.
5. Identify the implementation scope, constraints, dependencies, risks, and likely validation steps.
6. Produce a concrete step-by-step plan.
7. **Stop for approval.** Present the plan and stop — do not make any code changes until the owner
   approves it.

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

Invoke this skill by naming it and passing the task file path in the request.

Examples:
- `plan-task ai-agents/tasks/backlog/add-export-endpoint.md`
- `plan-task ai-agents/tasks/backlog/fix-pagination-bug.md`
- `plan-task ai-agents/tasks/done/refactor-auth-flow.md`
