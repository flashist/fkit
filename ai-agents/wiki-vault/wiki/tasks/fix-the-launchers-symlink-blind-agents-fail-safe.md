# Fix the launcher's symlink-blind agents fail-safe

**Source**: `ai-agents/tasks/done/0334-fix-the-launchers-symlink-blind-agents-fail-safe/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 12 · `P4` · task `0334` · owner `fkit-coder` · built 2026-10-16

> ⭐ **Ingested 2026-10-23** (sync `96c7263`→`5ccf2c2`). `plan.md`, `worklog.md`, `review.md`, `plan-review.md` read as evidence; trial log `ai-agents/knowledge-base/reports/2026-10-20-plan-review-trial-0334.md`.

## Goal
When setup fails, the launcher's fail-safe must refuse to start a session unless a **usable** fkit agent file is on disk — not merely a path that exists, which a symlink or an unreadable entry could satisfy.

## Key Changes
- **`claude/fkit-claude.sh`:** a new `agents_usable` function feeds the existing guard: a readable **regular** `fkit-*.md`, with **no symlink anywhere on the way**. Plain absence keeps today's two message lines byte-identical; every other cause names each path and why. `architecture.md` §5.1's flow sketch gains *"setup failed AND no usable agent → refuse, exit 1 (task 0334)"*.
- **`test/launcher-agents-guard.test.js`** (new, 10 tests: `0334/A`, `B`, `C`, `E`, `F+D`, `unreadable`, `not-a-dir`, `healthy`, `mixed`, `gate`), `test/harness.mjs` gains a `launcher` option, and prove-red steps **49–53**. (Those mutations went with `0529`'s cut; the test file stays — category 1, launcher.)
- **Owner rulings at the plan gate, 2026-10-16:** PC1 + PC2 adopted; **PC3 = refuse any symlink** on the chain, even one inside the project (*"Refuse any symlink (Recommended)"*); Q1 = *"Ship as scoped + follow-up brief"*.
- A network failure (`ENOTFOUND`) cut the first Build worker off; a re-spawned worker (owner: *"Re-spawn build to finish"*) redid nothing and re-ran the checks.

## Outcome
- ⚠️ **Scoped on purpose: refused only on a launch where setup FAILED.** With today's init, a symlinked `.claude` or `.claude/agents` makes init skip the refresh, warn and **exit 0**, so the guard never runs; and the guard checks "any usable agent", not **this role's** `fkit-<role>.md`. Both gaps are the follow-up **`0521`** (open, not ingested).
- Not done: no folder-slug rename (an open brief question, not put to the owner); shellcheck not run.

## Related
- [[systems/launch-convergence-and-init]] — setup is best-effort; the session is not
- [[systems/install-and-self-update]] — the launcher
- [[tasks/refuse-the-destructive-claude-refresh-through-a-symlink-and-correct-the-only-destructive-claim]] — `0327`, init's own symlink refusal
- [[tasks/bound-the-update-checks-git-path-which-has-no-deadline-and-hangs]] — `0284`, the other launcher edit in the sprint (`0508` ran after both)
- [[tasks/sprint-12-set-a-nine-backlog-tasks-goal-not-set]] — the board
- *Added 2026-10-23 (sync `96c7263`→`5ccf2c2`, closing one-way links):* [[tasks/clean-up-existing-code-comments-pilot-launcher-init-heal-0507-0508-0510]]
