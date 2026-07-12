# Verify onboarding flow end-to-end

## Sprint
Sprint 2

## Priority
7 (the removal gate — nothing ships until this passes)

## Status
✅ Done

## Context

> **Rescoped 2026-07-11 (Sprint 1 → Sprint 2).** This task's original *premise* died with Omnigent —
> it was written to verify `install.sh` → `omnigent/fkit-init.sh` → vendored bundles → `.fkit/run`,
> a path that no longer exists. Its *intent*, however, became **more** important, not less. Per the
> removal plan §E: *"after this removal, nothing is more worth verifying than a clean install →
> `fkit` → role session → consult → review."* Rewritten against the post-removal reality.

Sprint 2 rips out an entire runtime, rewrites the `curl | sh` entry point, and adds new code to the
startup path of every invocation. **This task is the proof that fkit still works when it's done.**

It is the sprint's release gate. It is deliberately owned by a fresh pair of eyes running the *public*
path — not by reading diffs, and not from inside this repo, which never exercises the install half of
the flow at all.

## What to build (verification, not implementation)

Run the real, public flow from a genuinely clean state. Record the actual commands and their output —
this is evidence, not vibes.

1. **Clean install.** From a branch ref, into a **clean `$HOME`** (container, VM, or a
   `HOME=$(mktemp -d)` harness). This is the `curl | sh` path a real new user takes. Confirm nothing
   from `omnigent/` is fetched or copied.
2. **Scaffold.** In a scratch project directory, confirm `fkit` scaffolds a complete project: the
   full `ai-agents/` tree, `AGENTS.md`, `CLAUDE.md` — all from `claude/scaffold/` (Phase 0.1).
3. **The role menu.** Bare `fkit` shows the deterministic 7-role menu. `fkit <role>` skips it.
4. **Role-locked sessions — all 7.** For each role, confirm the lockdown is real: the `/` menu shows
   only that role's skills, and a skill it does **not** own is **unrunnable even by explicit name**.
   This is the flavor's central invariant (ADR-010) — test it, don't assume it.
5. **A consult.** One role asking another, and getting the answer back.
6. **A review — reaching Codex for real.** Confirm from the review's actual output that it genuinely
   ran on Codex, not on a silent Claude fallback. Per ADR-009 a review that didn't reach Codex is not
   a complete review.
7. **First-run initiation.** Let the producer run `/fkit-initiate-project` against the fresh
   scaffold's placeholder `PROJECT.md`, through to a written `PROJECT.md` + `architecture.md`.
8. **Self-update.** `fkit update` works; the throttled notice fires when stale, stays silent when
   current, and never errors offline (Phase 0.2).

## Verification steps

- A brand-new user, on a clean machine, gets from `curl | sh` to a working initiated project with **no
  manual intervention** beyond answering intake questions and normal interactive prompts.
- Every step above passes, with recorded commands and exit codes.
- Document exactly where — if anywhere — it breaks, hangs, or needs an undocumented workaround.

## Notes

- Owner: **fkit-coder** or the **owner**, run in a real terminal. The producer cannot do this.
- **Depends on:** Phase 2 (`delete-omnigent-directory`), and therefore transitively on all of
  Phase 0 and Phase 1.
- If this surfaces concrete bugs, **report them back rather than fixing inline** — they get their own
  briefs, scoped against the rest of the sprint. A verification task that quietly turns into a fix
  task stops being a verification task.
