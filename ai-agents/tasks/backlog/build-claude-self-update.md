# Build self-update for the Claude path

## Sprint
Sprint 2

## Priority
2 (Phase 0.2 — foundations, blocking)

## Status
🔲 Backlog

## Context

Per the Omnigent-removal plan
([`plan-omnigent-removal-2026-07-11.md`](../../knowledge-base/plan-omnigent-removal-2026-07-11.md)
§Phase 0.2) and [ADR-009](../../knowledge-base/decisions/adr-009-claude-code-native-is-the-only-runtime.md)
§Decision 3.

**This is also a live bug fix, not just removal plumbing.** `claude/fkit-claude.sh` has **no update
logic at all** today. Bare `fkit` already dispatches to the Claude flavor
(`install.sh:87-103`) — which means **every user on the default path has been silently stuck on
whatever version they installed**, with no notification that a newer one exists. The Omnigent script
had the update logic; the flavor that people actually run does not.

Today that gap is masked because `fkit update` forwards to `omnigent/fkit.sh`. Once Phase 1 rewrites
the installer, that forwarding disappears — so this code must exist **before** the installer lands.

The architect calls this **the only non-mechanical piece of the entire removal**. Everything else in
Sprint 2 is a move, a delete, or a rewrite of existing behavior. This is new code.

## What to build

Add self-update to `claude/fkit-claude.sh`, shaped per ADR-009 §Decision 3:

- **A throttled check that _notifies_ — not a silent fetch-and-exec.** Port the throttle +
  `git ls-remote` shape from `omnigent/fkit.sh` (read it before it is deleted), but **drop the
  automatic re-exec**. The old behavior of silently updating and re-running itself is explicitly not
  wanted.
- On startup, no more than once per throttle window (reuse the existing interval unless there's a
  reason to change it — state the reason if you do), check the remote for a newer version. If one
  exists, print a clear, non-blocking notice telling the user to run `fkit update`.
- **Keep `fkit update` explicit** — it stays a real subcommand the user invokes deliberately. After
  Phase 1 it routes here rather than to `omnigent/fkit.sh`.
- Failure to reach the network must be **silent and non-fatal**. A user offline, on a plane, or
  behind a proxy must never see an error or a hang because of an update check. Time-box the check.
- Drop `fkit omnigent` from the help text (`claude/fkit-claude.sh:53`).

## Verification steps

- With no network, `fkit` starts normally, promptly, and prints no error.
- With a stale local version, `fkit` prints the update notice exactly once per throttle window — not
  on every invocation.
- With an up-to-date local version, `fkit` prints nothing.
- `fkit update` actually updates, from a real remote, and reports what it did.
- The check never re-execs or mutates anything on its own.

## Notes

- Owner: **fkit-coder**.
- **Blocks:** Phase 1 (installer rewrite) — the installer's `fkit update` route needs this to exist.
- Depends on nothing, but read `omnigent/fkit.sh`'s update logic **before Phase 2 deletes it**.
- Risk: **medium.** New code, and it sits in the startup path of every single `fkit` invocation — a
  hang or a crash here breaks the whole tool. Bias hard toward failing silent and fast.
