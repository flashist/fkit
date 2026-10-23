# Bound the update check's git path — `_fkit_remote_sha` has no deadline and hangs

**Source**: `ai-agents/tasks/done/0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 12 · `P3` · task `0284` · owner `fkit-coder` · built 2026-10-16 (committed `b5b46b8`, per `0334`'s worklog)

> ⭐ **Ingested 2026-10-23** (sync `96c7263`→`5ccf2c2`). The brief carries a long history from its 2026-08-13 owner ruling; `plan.md`, `worklog.md`, `review.md` and `plan-review.md` read as evidence. A plan-review trial log for it is `ai-agents/knowledge-base/reports/2026-10-20-plan-review-trial-0284.md`.

## Goal
Give the automatic update check a real deadline on its preferred path. The 2026-08-13 resync had found the vault's *"time-boxed to 5 s"* claim **false on the git path**: `FKIT_NET_TIMEOUT=5` bounded only the curl branches (`--max-time 5`); `git ls-remote` set only `GIT_HTTP_LOW_SPEED_*`, which bounds a stalled transfer, not DNS or connect — **measured 12 s**.

## Key Changes
- **Reproduced first, on the unchanged launcher:** with a stub git that stalls 12 s / 20 s, the launch took **12 s / 20 s** — *"the launcher waits exactly as long as git does."*
- **`_fkit_deadline`** — a watchdog that cuts `git ls-remote` at `FKIT_NET_TIMEOUT` (5 s), killing git and its **direct children**, with a `kill -9` one second later for a git that ignores TERM. After the fix the same reproduction ends in **5 s** under `/bin/sh`, `/bin/dash` and `/bin/bash`.
- **`fkit update`'s `install.sh` download** bounded too: `--max-time` `FKIT_INSTALLER_FETCH_TIMEOUT` = 60 s; a timeout prints the download-failure line, exits 1, and the partial script never runs.
- **Tests:** `0284/*` tests in `test/update-banner.test.js` (`git-deadline`, `git-env`, `no-stray`, `term-ignored`) and `test/update-reinstall.test.js` (`reinstall-deadline`, `reinstall-timeout-not-run`) — names read from the files on disk 2026-10-23 — and prove-red mutations **44–47**, each seen red at its named test. (Mutations 44–47 were later deleted with the other cut cases by `0529`; both test files stay — category 1.)
- **Owner rulings at the plan gate** (2026-10-15): PQ1–PQ6 adopted (*"All six, PQ1–PQ6 (Recommended)"*), OQ4 *"Fixed"*.

## Outcome
- **Now true:** each update-check network call is time-boxed at 5 s (+1 s for a git that ignores TERM), at most two calls, so **about 10 s at worst** — `architecture.md` was updated to say so. **Still not bounded:** `install.sh`'s own tarball download and `resolve_sha()`, so `fkit update` as a whole has no deadline.
- **Measured, not assumed:** on Apple git 2.50.1 `git-remote-https` runs as a **grandchild**; the watchdog kills only direct children, but git's own cleanup removed it at once and a descendant that outlives the launch holds no launcher file descriptor. No recursive walk was added — the adopted PQ2 wording was corrected to what was measured.
- **Follow-ups filed by owner ruling 2026-10-16** (open, not ingested): `0519` — the dogfooded `.claude/skills-for-role.sh` copy is stale and init never refreshes it (security-relevant: the ADR-018 hook sources `skills_for_role()`); `0520` — with a `url.*.insteadOf` rewrite to ssh, `git ls-remote` can still prompt (the watchdog now cuts it at 5 s). Later: `0537` — `0284/term-ignored` failed once under heavy load (33 s vs a 10.5 s ceiling) during `0536`'s verify.
- **Mutation 48's cost** (*"leave the watchdog armed after git answers"*, ~217 s under dash with a piped stderr) became the question task `0526` answered: a test-harness cost, not a user-facing slow launch — see [[tasks/the-test-scope-reset-tasks-0526-0530]].

## Related
- [[systems/install-and-self-update]] — the 2026-08-13 *"time-boxed to 5 s is FALSE"* correction this closes
- [[tasks/the-2026-08-13-vault-resync-chain]] — `0285`, the resync that found the false claim
- [[tasks/the-test-scope-reset-tasks-0526-0530]] — `0526`'s check of this task's mutation 48
- [[tasks/fix-the-launchers-symlink-blind-agents-fail-safe]] — `0334`, the next launcher edit in the same sprint
- [[tasks/sprint-12-set-a-nine-backlog-tasks-goal-not-set]] — the board
- *Added 2026-10-23 (sync `96c7263`→`5ccf2c2`, closing one-way links):* [[tasks/clean-up-existing-code-comments-pilot-launcher-init-heal-0507-0508-0510]]
