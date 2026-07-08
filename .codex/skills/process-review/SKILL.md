---
name: process-review
description: "Critically evaluate external reviewer feedback before acting — verifies every claim against the codebase, classifies findings, gates code changes on explicit user approval, and tracks decisions in a per-task review ledger to prevent review loops. Use when processing Codex reviews, GitHub review comments, or any external feedback before deciding what to act on."
---
<!-- fkit:generated source=process-review version=0.1.17 — do NOT hand-edit; run `sync` to regenerate. Edit the kit source instead. -->

# process-review (delegated to Claude)

This skill is **owned by Claude** in this project — its real implementation lives on the Claude side. **Do not do the work yourself.** Hand it to Claude and relay the result.

## Delegate

Run Claude non-interactively from the project root, telling it to run its own `/process-review` skill with whatever argument the user passed:

```bash
claude -p --permission-mode acceptEdits "Run the process-review skill (/process-review). Argument from the user: <ARGS>. Do the task fully and report exactly what changed. Do not delegate further."
```

Replace `<ARGS>` with the user's argument to `/process-review` (use `(none)` if there was none). Wait for it to finish, then relay Claude's output to the user.

**Fallback:** if the `claude` command is missing, unauthenticated, or errors, do **not** attempt the task yourself — tell the user to run `/process-review` in their Claude tab instead.
