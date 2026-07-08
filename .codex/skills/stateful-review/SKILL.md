---
name: stateful-review
description: "Run both Claude's code review and Codex's adversarial review on the current diff, dedupe their findings against the task's review ledger (so settled tradeoffs aren't re-litigated), then route only novel findings through process-review and record the outcome. Use for a thorough, loop-resistant review."
---
<!-- fkit:generated source=stateful-review version=0.1.17 — do NOT hand-edit; run `sync` to regenerate. Edit the kit source instead. -->

# stateful-review (delegated to Claude)

This skill is **owned by Claude** in this project — its real implementation lives on the Claude side. **Do not do the work yourself.** Hand it to Claude and relay the result.

## Delegate

Run Claude non-interactively from the project root, telling it to run its own `/stateful-review` skill with whatever argument the user passed:

```bash
claude -p --permission-mode acceptEdits "Run the stateful-review skill (/stateful-review). Argument from the user: <ARGS>. Do the task fully and report exactly what changed. Do not delegate further."
```

Replace `<ARGS>` with the user's argument to `/stateful-review` (use `(none)` if there was none). Wait for it to finish, then relay Claude's output to the user.

**Fallback:** if the `claude` command is missing, unauthenticated, or errors, do **not** attempt the task yourself — tell the user to run `/stateful-review` in their Claude tab instead.
