# Rewrite the installer for a single flavor

## ID
0084

## Sprint
Sprint 2

## Priority
4 (Phase 1)

## Status
✅ Done

## Context

Per the Omnigent-removal plan
([`2026-07-11-plan-omnigent-removal.md`](../../../knowledge-base/reports/2026-07-11-plan-omnigent-removal.md)
§Phase 1) and [ADR-009](../../../knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md).

`install.sh` still installs and dispatches **two** flavors. With Omnigent removed there is one:
Claude Code native. This task collapses the installer to it.

## ⚠️ This is the blast radius of the entire sprint

`install.sh` is the **`curl | sh` entry point**. A mistake here breaks installation **for everyone** —
including the self-update path that would otherwise deliver the fix. It is the one file in this sprint
where a bad landing cannot be quietly rolled back, because the broken version is the one users fetch.

Treat this task with proportionate care. The verification below is **not optional.**

## What to build

Collapse `install.sh` to one flavor:

- Drop the `omnigent/fkit.sh` existence gate (`:32-33`).
- Stop copying `omnigent/` (`:38-44`).
- Replace the flavor-dispatch launcher (`:87-103`) with a **direct exec of `claude/fkit-claude.sh`**.
- Route `fkit update` to the Phase 0.2 self-update code.
- Add the Codex preflight from Phase 0.3, if the owner's decision put it in the installer.

Retire along with it:
- The `omnigent` and `claude` subcommands (`fkit claude` was only ever a legacy alias).
- `update|upgrade|reconnect|restart-team` forwarding to the Omnigent script — `reconnect` and
  `restart-team` exist **only** to paper over Omnigent orchestration failures and have no meaning on
  the Claude path.
- The `install.sh:42` `chmod` loop. **Note:** the audit found this loop omits `fkit-team-restart.sh`
  — a latent bug. **That bug is deleted, not fixed.** Do not repair it on the way out.

## Verification steps

**Do not consider this done without an install from a branch ref into a clean `$HOME`.** Reading the
diff is not verification for this file.

- Install from a branch ref into a clean/throwaway `$HOME` (container, VM, or a `HOME=$(mktemp -d)`
  harness — whichever gives a genuinely clean slate).
- Then, in that clean environment: `fkit` starts and shows the role menu; `fkit <role>` opens a
  role-locked session; `fkit update` works; `fkit --help` describes only real subcommands.
- Confirm the retired subcommands (`fkit omnigent`, `fkit claude`, `fkit reconnect`,
  `fkit restart-team`) fail cleanly with a useful message, not a confusing stack trace or a silent
  no-op.
- Confirm nothing under `omnigent/` is copied into the install target.

## Notes

- Owner: **fkit-coder**.
- **Depends on:** Phase 0.1 (`extract-scaffold-into-claude`), 0.2 (`build-claude-self-update`),
  0.3 (`make-codex-a-checked-prerequisite`). **All three must land first** — the installer's exec
  target, update route, and preflight all come from them.
- **Blocks:** Phase 2 (`delete-omnigent-directory`).
- Risk: **medium-high — the highest in the sprint.**
