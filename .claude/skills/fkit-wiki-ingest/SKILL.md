---
name: fkit-wiki-ingest
description: "Ingest one or more sources into the nimbus wiki at ai-agents/wiki-vault/. Use when asked to add, update, or sync wiki pages from source files, tasks, or knowledge-base documents. Accepts a file path, directory path, or keyword: 'all tasks', 'knowledge-base', 'architecture'."
user-invocable: true
---
<!-- fkit:generated source=fkit-wiki-ingest version=0.1.17 — do NOT hand-edit; run `sync` to regenerate. Edit the kit source instead. -->

# fkit-wiki-ingest (delegated to Codex)

This skill is **owned by Codex** in this project — its real implementation lives on the Codex side. **Do not do the work yourself.** Hand it to Codex and relay the result.

## Delegate

Run Codex non-interactively from the project root, telling it to run its own `$fkit-wiki-ingest` skill with whatever argument the user passed:

```bash
codex exec --sandbox workspace-write "Run the fkit-wiki-ingest skill ($fkit-wiki-ingest). Argument from the user: <ARGS>. Do the task fully and report exactly what changed. Do not delegate further."
```

Replace `<ARGS>` with the user's argument to `$fkit-wiki-ingest` (use `(none)` if there was none). Wait for it to finish, then relay Codex's output to the user.

**Fallback:** if the `codex` command is missing, unauthenticated, or errors, do **not** attempt the task yourself — tell the user to run `$fkit-wiki-ingest` in their Codex tab instead.
