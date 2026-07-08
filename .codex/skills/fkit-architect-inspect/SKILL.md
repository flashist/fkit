---
name: fkit-architect-inspect
description: "Use when the user wants Codex to deeply research this project architecture and produce ai-agents/knowledge-base/architecture.md. Trigger for requests like $fkit-architect-inspect, an architecture deep-dive, an onboarding investigation, or documenting how the system fits together. Ask the user as many questions as needed and never hesitate to ask. Makes no commits."
---
<!-- fkit:generated source=fkit-architect-inspect version=0.1.17 — do NOT hand-edit; run `sync` to regenerate. Edit the kit source instead. -->

# fkit-architect-inspect (delegated to Claude)

This skill is **owned by Claude** in this project — its real implementation lives on the Claude side. **Do not do the work yourself.** Hand it to Claude and relay the result.

## Delegate

Run Claude non-interactively from the project root, telling it to run its own `/fkit-architect-inspect` skill with whatever argument the user passed:

```bash
claude -p --permission-mode acceptEdits "Run the fkit-architect-inspect skill (/fkit-architect-inspect). Argument from the user: <ARGS>. Do the task fully and report exactly what changed. Do not delegate further."
```

Replace `<ARGS>` with the user's argument to `/fkit-architect-inspect` (use `(none)` if there was none). Wait for it to finish, then relay Claude's output to the user.

**Fallback:** if the `claude` command is missing, unauthenticated, or errors, do **not** attempt the task yourself — tell the user to run `/fkit-architect-inspect` in their Claude tab instead.
