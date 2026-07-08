---
name: fkit-config
description: "Use when the user wants Codex to review or change fkit's model-routing config — the project-wide default model or a specific skill's model override — then re-sync the compiled skills. Trigger for requests like $fkit-config, checking which model owns a fkit skill, or changing the project default model. Makes no commits."
---
<!-- fkit:generated source=fkit-config version=0.1.17 — do NOT hand-edit; run `sync` to regenerate. Edit the kit source instead. -->

# fkit-config (delegated to Claude)

This skill is **owned by Claude** in this project — its real implementation lives on the Claude side. **Do not do the work yourself.** Hand it to Claude and relay the result.

## Delegate

Run Claude non-interactively from the project root, telling it to run its own `/fkit-config` skill with whatever argument the user passed:

```bash
claude -p --permission-mode acceptEdits "Run the fkit-config skill (/fkit-config). Argument from the user: <ARGS>. Do the task fully and report exactly what changed. Do not delegate further."
```

Replace `<ARGS>` with the user's argument to `/fkit-config` (use `(none)` if there was none). Wait for it to finish, then relay Claude's output to the user.

**Fallback:** if the `claude` command is missing, unauthenticated, or errors, do **not** attempt the task yourself — tell the user to run `/fkit-config` in their Claude tab instead.
