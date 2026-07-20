# Stop an init failure from bricking the launcher

## ID
0088

## Sprint
Sprint 2

## Priority
26

## Status
✅ Done

## Context

**Today, any failure inside `fkit-claude-init.sh` prevents `fkit` from starting at all.** The user does
not get a degraded session, or a warning, or their team — they get a bare shell error and no Claude
Code.

The mechanism is two lines:

- `claude/fkit-claude-init.sh:18` — `set -euo pipefail`. Any non-zero command aborts the script.
- `claude/fkit-claude.sh:281,283` — the script is called **unguarded**, from a launcher that is itself
  under `set -eu` (`:28`). Init's non-zero exit therefore propagates and **kills the launcher before
  `claude` is ever exec'd**.

So a permissions problem on `.claude/`, a read-only checkout, ENOSPC, a `cp` that fails on one file —
any of these takes the user's entire team offline. Init runs on **every single launch**
(`fkit-claude.sh:280-284`), so this is not a first-run-only hazard.

**This is a pre-existing latent defect, found in passing.** It is independent of migrations and of
everything else in this group, and it is
[worth fixing regardless](../../knowledge-base/reports/2026-07-14-migration-mechanism.md) — see
`reports/2026-07-14-migration-mechanism.md` §8 (the "non-fatal failure" row, rated **REQUIRED — and
currently violated**) and follow-up §11.4.

**It is also the precondition for task 28.** Convergence adds *more* work to this same unattended,
every-launch code path. Making that path more capable while it can still brick the launcher is exactly
backwards. **Task 28 must not land before this does.**

## What to build

**The rule: setup is best-effort; the session is not.** A user must always be able to reach their team,
even when fkit cannot finish setting the project up.

At the call site (`claude/fkit-claude.sh:280-284`):

- Call `fkit-claude-init.sh` so that a **non-zero exit does not abort the launcher**. Under `set -eu`
  the call must be guarded (e.g. run it in a condition context, or `|| <handle>`, or explicitly capture
  its status) — pick the form that reads cleanly in that script.
- **On failure: warn loudly on stderr and continue into the session.** The warning must say (a) that
  project setup did not complete, (b) that the session is starting anyway, and (c) that the project may
  be missing fkit-managed files. Silence here is the failure mode — a half-set-up project that
  *appears* fine is worse than one that says so.
- **On success: behave exactly as today.** Quiet on an already-set-up project, full summary on a fresh
  one. Do not add noise to the happy path — it runs on every launch.

Do **not** relax `set -euo pipefail` inside `fkit-claude-init.sh` itself. Init failing fast internally
is correct; the bug is that its failure is *fatal to the caller*. Fix it at the boundary, not by making
init sloppy.

**Do not** try to make init partially-succeed or resume in this task. Its steps are already
idempotent-by-re-run — the next launch retries. All this task changes is who dies when it fails.

## Verification steps

Each of these is a real, runnable check — not an inspection of the diff.

- **The bricking repro, before and after.** Make init fail deterministically and confirm the behavior
  flips. A clean way: point `fkit` at a project directory that is **read-only** (`chmod a-w`), so
  init's `mkdir -p "$dest/.claude/agents"` fails.
  - **Before the fix:** `fkit` exits non-zero, Claude Code never starts.
  - **After the fix:** a warning is printed to **stderr**, and `claude` **is** launched.
  Verify the launch actually happens — check that the `claude` process starts (or use
  `FKIT_SETUP_ONLY=1` to isolate the setup phase, then a real launch to confirm the exec).
- **`FKIT_SETUP_ONLY=1` still reports failure honestly.** `fkit-claude.sh:286` exits early in that
  mode. A failed setup under `FKIT_SETUP_ONLY=1` should **not** exit 0 pretending success — that path
  is a setup check, and a setup check that lies is worse than no check. Decide and state the exit code;
  the reviewer will look for it.
- **Happy path is byte-for-byte unchanged.** On an already-set-up project, `fkit` prints **no** extra
  output (init stays `>/dev/null`). On a fresh project, the full setup summary still prints. Diff the
  terminal output before/after the change on both.
- **Exit code on a successful launch is still Claude Code's**, not swallowed by the new guard.

## Notes

- **Owner: fkit-coder.**
- **Depends on:** nothing. Unblocked. Ship today.
- **Blocks: task 28 (additive launch convergence).** 28 makes this code path do more; it must not be
  able to take the launcher down with it. Land this first, or land it as the first commit of 28 — but
  **never after**.
- **No ADR.** A latent defect fix, not an architecture decision.
- **Provenance:** found in passing by fkit-architect while investigating the migration mechanism
  (report §8, §11.4). It was not what the investigation was looking for, and it is the more urgent of
  the two things it found.
- Risk: **low to the change, high to leave alone.** The fix is small; the bug takes the whole product
  offline for any user who hits it.
