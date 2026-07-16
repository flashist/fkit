# Stop an init failure from bricking the launcher

**Source**: `ai-agents/tasks/done/stop-init-failure-bricking-the-launcher.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 26

## Goal
**Any failure inside `fkit-claude-init.sh` prevented `fkit` from starting at all.** No degraded session, no warning, no team — a bare shell error and no Claude Code.

## Key Changes

**The mechanism was two lines:** init runs under `set -euo pipefail`, and it was called **unguarded** from a launcher itself under `set -eu`. Init's non-zero exit propagated and **killed the launcher before `claude` was ever exec'd**.

So a permissions problem on `.claude/`, a read-only checkout, ENOSPC, or one failed `cp` **took the user's entire team offline** — and since init runs on **every single launch**, this was never a first-run-only hazard.

- **The rule: setup is best-effort; the session is not.** *A user must always be able to reach their team, even when fkit cannot finish setting the project up.*
- **On failure: warn loudly on stderr and continue into the session** — saying that setup did not complete, that the session is starting anyway, and that fkit-managed files may be missing. **Silence is the failure mode** — *a half-set-up project that appears fine is worse than one that says so.*
- **On success: behave exactly as today.** Quiet on an already-set-up project; full summary on a fresh one. **Do not add noise to the happy path** — it runs on every launch.
- **`set -euo pipefail` stays inside init.** Failing fast internally is correct; **the bug was that its failure was fatal to the caller. Fix it at the boundary, not by making init sloppy.**
- **No partial-succeed or resume logic** — init's steps are already idempotent-by-re-run, so the next launch retries. *All this changes is who dies when it fails.*

## Outcome
**Done.** Rated *"low risk to the change, high to leave alone"* — the fix is small; the bug took the whole product offline for anyone who hit it.

**Provenance: found in passing** by the architect while investigating the migration mechanism — *not what the investigation was looking for, and the more urgent of the two things it found.* [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]'s safety bar rates non-fatal failure **REQUIRED — and currently violated**.

**It is the precondition for additive convergence** (Sprint 2 task 28, still backlog): convergence adds *more* work to this same unattended, every-launch path, and **making that path more capable while it can still brick the launcher is exactly backwards.**

## Related
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]
- [[tasks/design-version-to-version-migration-mechanism]] — the investigation that found it
- [[tasks/refuse-init-on-weird-ai-agents-state]] — the sibling precondition
- [[tasks/fix-scaffold-knowledge-base-folders]]
- [[systems/launch-convergence-and-init]]
- [[systems/install-and-self-update]]
- [[tasks/sprint-2-remove-omnigent]]
