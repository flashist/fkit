---
name: plan-task
description: Read a task file and produce a concrete implementation plan before any code is written.
---

# Plan Task

## Overview

Use this skill to turn a task file into a concrete implementation plan without making code changes. The goal is to gather the necessary context, identify the likely work areas, and present a step-by-step plan for approval before implementation begins.

## Workflow

1. {{plan_mode_enter}}
2. Read the task file path passed by the user when invoking the skill.
3. If `{{wiki_path}}/` exists, use the `{{wiki_query}}` skill to gather relevant project context before proceeding.
4. Read any files referenced by the task, including specs, related tasks, and knowledge-base documents.
5. Identify the implementation scope, constraints, dependencies, risks, and likely validation steps.
6. Produce a concrete step-by-step plan.
7. {{plan_mode_exit}}

## Planning Requirements

The plan should be specific enough that implementation can begin immediately after approval.

Include when relevant:
- likely files or subsystems to change
- sequencing of work
- dependencies or blockers
- testing and validation steps
- open questions or assumptions that could affect the implementation
- realistic edge cases and non-obvious but plausible failure modes that may affect implementation, correctness, or testing

## Guardrails

- Do not write or edit code while using this skill.
- Do not skip referenced documents if they materially affect the task.
- Do not present a vague high-level outline when the task file supports a concrete plan.
- If the task is underspecified, surface the missing details explicitly in the plan.

## Usage

Invoke this skill by naming the skill and passing the task file path in the request.

Examples:
- `{{invoke}}plan-task ai-agents/tasks/backlog/add-export-endpoint.md`
- `{{invoke}}plan-task ai-agents/tasks/backlog/fix-pagination-bug.md`
- `{{invoke}}plan-task ai-agents/tasks/done/refactor-auth-flow.md`
