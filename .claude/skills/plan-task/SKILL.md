---
name: plan-task
description: "Enter plan mode to plan the implementation of a task described in the file passed as the argument (e.g. `/plan-task ai-agents/tasks/backlog/my-task.md`). The plan should account for realistic edge cases, including non-obvious but plausible failure modes, where they could materially affect implementation, correctness, or testing."
user-invocable: true
---
<!-- fkit:generated source=plan-task version=0.1.17 — do NOT hand-edit; run `sync` to regenerate. Edit the kit source instead. -->

# Plan Task

## Overview

Use this skill to turn a task file into a concrete implementation plan without making code changes. The goal is to gather the necessary context, identify the likely work areas, and present a step-by-step plan for approval before implementation begins.

## Workflow

1. Use the EnterPlanMode tool to switch into plan mode and state clearly that this run is planning-only and that no code will be written yet.
2. Read the task file path passed by the user when invoking the skill.
3. If `ai-agents/wiki-vault/` exists, use the `/fkit-wiki-query` skill to gather relevant project context before proceeding.
4. Read any files referenced by the task, including specs, related tasks, and knowledge-base documents.
5. Identify the implementation scope, constraints, dependencies, risks, and likely validation steps.
6. Produce a concrete step-by-step plan.
7. Use ExitPlanMode to present the plan to the user and stop for approval before making any code changes.

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
- `/plan-task ai-agents/tasks/backlog/add-export-endpoint.md`
- `/plan-task ai-agents/tasks/backlog/fix-pagination-bug.md`
- `/plan-task ai-agents/tasks/done/refactor-auth-flow.md`
