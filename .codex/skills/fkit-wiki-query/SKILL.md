---
name: fkit-wiki-query
description: "Answer a question about the nimbus project using the wiki at ai-agents/wiki-vault/. Use when asked to look something up in the wiki, find information about a feature or system, or answer a project question."
---
<!-- fkit:generated source=fkit-wiki-query version=0.1.17 — do NOT hand-edit; run `sync` to regenerate. Edit the kit source instead. -->

# fkit-wiki-query (delegated to Claude)

This skill is **owned by Claude** in this project — its real implementation lives on the Claude side. **Do not do the work yourself.** Hand it to Claude and relay the result.

## Delegate

Run Claude non-interactively from the project root, telling it to run its own `/fkit-wiki-query` skill with whatever argument the user passed:

```bash
claude -p --permission-mode acceptEdits "Run the fkit-wiki-query skill (/fkit-wiki-query). Argument from the user: <ARGS>. Do the task fully and report exactly what changed. Do not delegate further."
```

Replace `<ARGS>` with the user's argument to `/fkit-wiki-query` (use `(none)` if there was none). Wait for it to finish, then relay Claude's output to the user.

**Fallback:** if the `claude` command is missing, unauthenticated, or errors, do **not** attempt the task yourself — tell the user to run `/fkit-wiki-query` in their Claude tab instead.
