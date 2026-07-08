---
name: task-done
description: "Mark a task complete — move its brief file into ai-agents/tasks/done/ and update the sprint plan (and parent epic, if any) so the task's status reads Done. Takes the path to the task file as its argument. Use when a task has been reviewed/verified and is finished."
---
<!-- fkit:generated source=task-done version=0.1.17 — do NOT hand-edit; run `sync` to regenerate. Edit the kit source instead. -->

# task-done (delegated to Claude)

This skill is **owned by Claude** in this project — its real implementation lives on the Claude side. **Do not do the work yourself.** Hand it to Claude and relay the result.

## Delegate

Run Claude non-interactively from the project root, telling it to run its own `/task-done` skill with whatever argument the user passed:

```bash
claude -p --permission-mode acceptEdits "Run the task-done skill (/task-done). Argument from the user: <ARGS>. Do the task fully and report exactly what changed. Do not delegate further."
```

Replace `<ARGS>` with the user's argument to `/task-done` (use `(none)` if there was none). Wait for it to finish, then relay Claude's output to the user.

**Fallback:** if the `claude` command is missing, unauthenticated, or errors, do **not** attempt the task yourself — tell the user to run `/task-done` in their Claude tab instead.
