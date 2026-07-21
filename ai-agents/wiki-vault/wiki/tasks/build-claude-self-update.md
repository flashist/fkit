# Build self-update for the Claude path

**Source**: `ai-agents/tasks/done/0019-build-claude-self-update/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 2 (Phase 0.2, blocking)

## Goal
Give `claude/fkit-claude.sh` its own self-update, before the installer rewrite removes the Omnigent script that currently owns it.

## Key Changes
**This was also a live bug fix, not just removal plumbing.** `claude/fkit-claude.sh` had **no update logic at all** — yet bare `fkit` already dispatched to the Claude flavor. **Every user on the default path had been silently stuck on whatever version they installed**, with no notification that a newer one existed. The Omnigent script had the update logic; *the flavor people actually ran did not.*

The gap was masked only because `fkit update` forwarded to `omnigent/fkit.sh`. Once Phase 1 rewrote the installer, that forwarding disappeared — **so this code had to exist before the installer landed.**

- **`fkit update`** — an explicit verb; re-runs the canonical `install.sh`. Refuses to run in a source checkout.
- **An automatic check** — throttled, **time-boxed to 5 s**, silent when current and silent when offline. It **only ever prints** a "run `fkit update`" notice.

## Outcome
Done. The architect called this **the only non-mechanical piece of the entire removal** — everything else in Sprint 2 was a move, a delete, or a rewrite of existing behavior. **This was new code, sitting in the startup path of every `fkit` invocation.**

The design deliberately **never auto-updates and never re-execs itself** — a direct reaction to the Omnigent launcher, which had no timeout and no `GIT_TERMINAL_PROMPT` guard, so a credential-prompting repo could hang the launcher indefinitely.

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/rewrite-installer-single-flavor]]
- [[systems/install-and-self-update]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]]
- [[tasks/design-version-to-version-migration-mechanism]]
- [[tasks/remove-fkit-resume-passthrough]]
