---
name: fkit-wiki-sync
description: "Sync the nimbus wiki at ai-agents/wiki-vault/ by detecting what changed in non-wiki ai-agents/ sources since the last ingest and ingesting only the delta. Use when asked to sync or update the wiki. Optional argument: a date (YYYY-MM-DD) to override the auto-detected since-date, or 'force' to re-ingest all non-wiki ai-agents sources."
user-invocable: true
---
<!-- fkit:generated source=fkit-wiki-sync version=0.1.17 — do NOT hand-edit; run `sync` to regenerate. Edit the kit source instead. -->

# fkit-wiki-sync (delegated to Codex)

This skill is **owned by Codex** in this project — its real implementation lives on the Codex side. **Do not do the work yourself.** Hand it to Codex and relay the result.

## Delegate

Run Codex non-interactively from the project root, telling it to run its own `$fkit-wiki-sync` skill with whatever argument the user passed:

```bash
codex exec --sandbox workspace-write "Run the fkit-wiki-sync skill ($fkit-wiki-sync). Argument from the user: <ARGS>. Do the task fully and report exactly what changed. Do not delegate further."
```

Replace `<ARGS>` with the user's argument to `$fkit-wiki-sync` (use `(none)` if there was none). Wait for it to finish, then relay Codex's output to the user.

**Fallback:** if the `codex` command is missing, unauthenticated, or errors, do **not** attempt the task yourself — tell the user to run `$fkit-wiki-sync` in their Codex tab instead.
