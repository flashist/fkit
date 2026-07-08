---
name: plan-task
description: "Use when the user wants Codex to read a task file and produce an implementation plan before writing code. Trigger for requests like `$plan-task ai-agents/tasks/backlog/my-task.md`, planning a task from a markdown file, reviewing a backlog task, breaking a task into implementation steps, or gathering context and proposing an execution plan that must be approved before any edits are made. The plan should account for realistic edge cases, including non-obvious but plausible failure modes, where they could materially affect implementation, correctness, or testing."
---
<!-- fkit:generated source=plan-task version=0.1.17 — do NOT hand-edit; run `sync` to regenerate. Edit the kit source instead. -->

# plan-task (delegated to Claude)

This skill is **owned by Claude** in this project — its real implementation lives on the Claude side. **Do not do the work yourself.** Hand it to Claude and relay the result.

## Delegate

Run Claude non-interactively from the project root, telling it to run its own `/plan-task` skill with whatever argument the user passed:

```bash
claude -p --permission-mode acceptEdits "Run the plan-task skill (/plan-task). Argument from the user: <ARGS>. Do the task fully and report exactly what changed. Do not delegate further."
```

Replace `<ARGS>` with the user's argument to `/plan-task` (use `(none)` if there was none). Wait for it to finish, then relay Claude's output to the user.

**Fallback:** if the `claude` command is missing, unauthenticated, or errors, do **not** attempt the task yourself — tell the user to run `/plan-task` in their Claude tab instead.
