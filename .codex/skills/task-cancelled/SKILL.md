---
name: task-cancelled
description: "Mark a task cancelled — move its brief into ai-agents/tasks/cancelled/ and update the sprint plan (and parent epic, if any) so the task's status reads Cancelled, with a recorded reason. Takes two arguments — the task file path, then the cancellation-reason text (everything after the path). Use when a task has been dropped/abandoned and will not be done."
---
<!-- fkit:generated source=task-cancelled version=0.1.17 — do NOT hand-edit; run `sync` to regenerate. Edit the kit source instead. -->

# task-cancelled (delegated to Claude)

This skill is **owned by Claude** in this project — its real implementation lives on the Claude side. **Do not do the work yourself.** Hand it to Claude and relay the result.

## Delegate

Run Claude non-interactively from the project root, telling it to run its own `/task-cancelled` skill with whatever argument the user passed:

```bash
claude -p --permission-mode acceptEdits "Run the task-cancelled skill (/task-cancelled). Argument from the user: <ARGS>. Do the task fully and report exactly what changed. Do not delegate further."
```

Replace `<ARGS>` with the user's argument to `/task-cancelled` (use `(none)` if there was none). Wait for it to finish, then relay Claude's output to the user.

**Fallback:** if the `claude` command is missing, unauthenticated, or errors, do **not** attempt the task yourself — tell the user to run `/task-cancelled` in their Claude tab instead.
