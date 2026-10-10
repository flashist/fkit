# Re-measure the CI test runtime on the ubuntu runner, and correct the workflow timeout and its comment

**Source**: `ai-agents/tasks/done/0395-re-measure-the-ci-test-runtime-on-the-ubuntu-runner-and-correct-the-workflow-timeout-and-its-comment/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-10-05 — ⚠️ **with V5 PENDING the owner's push**
**Sprint/Tag**: Sprint 10 `P11` (append rank; filed on the Backlog board 2026-09-14) · task `0395` · owner `fkit-coder`

## Goal
Owner ruling 2026-09-14 (verbatim option label **"File follow-up brief (Rec)"**), from review finding **R6** on
`0388`: `.github/workflows/test.yml` sets `timeout-minutes: 20`, justified by a comment whose figures no longer
held — *"~5m30s-6m20s across four runs"*, *"15 mutants plus 9 clean-copy baselines"*, *"~3x headroom"*. ⛔ The
brief forbade picking the timeout from **local macOS** figures or from **pre-`0388`** runner history; a runner
measurement was the first deliverable.

**Pulled into Sprint 10 on 2026-10-05** — the owner typed *"I want that"* in reply to the lead's suggestion, so a
push would not fail CI on timeout. Why then: local `npm test` had grown to 19–27 min on a busy machine as
`0477`, `0480`, `0481`, `0479` added prove-red steps. ⚠️ **A tension the brief named for the plan gate:** "fix it
before any push" and "measure on the runner first" cannot both hold — a runner run needs a push, the owner's act.

## Key Changes
- Plan-gate rulings (from the worklog, as recorded in the close note): Q1 *"Use existing CI runs now"* (resolving
  the push tension); Q2 *"3x → 33 min"*; Q3 *"Fix all of them"* — which widened scope to the adjacent stale
  figures in `RELEASING.md`, `bin/release.mjs` and `architecture.md`.
- **20 post-`0388` runner runs recorded**; the slowest whole job **652 s (10m52s)** → **`timeout-minutes: 33`**,
  ~3.0× headroom. The comment was rewritten with sourced, dated figures. `architecture.md`'s *"~6 min separate the
  gate from"* now reads *"10+ min"*.

## Outcome
- Full local `npm test` exit 0 (1048/1048, prove-red hard gate passed); stateful review round 1 closed out (R1,
  R2 done; coverage *"reasoning-only second opinion"*).
- ⚠️ **V5 — PENDING the owner's push. Not verified.** The owner chose to close anyway (*"Close, check pending"*,
  2026-10-05): the first CI run after the push must finish green well under 33 min. To confirm: `gh run list
  --workflow test.yml --limit 1`, then `gh run view <id> --json jobs`. The estimate with Sprint 10's additions
  (~12–13 min) is **unverified**.
- **Routed to the wiki:** pages still quoting `timeout-minutes: 20` and the old *"6–8 minutes"* / *"~6 min"* —
  updated with dated notes in the 2026-10-10 sync.

## Related
- [[tasks/give-the-sprint-mover-pins-and-successor-mode-durable-prove-red-mutations]] — `0388`, whose review R6 it came from (hard dependency)
- [[tasks/run-only-the-checks-a-change-needs-not-the-full-suite-every-time]] — `0480`, which routed the stale wording here
- [[tasks/keep-changelog-md-up-to-date-at-every-release]] — `0479`, started before this (same release files)
- [[systems/testing-and-verification]] — CI and the release gate
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the board it was filed on
- [[tasks/sprint-10-the-0472-0482-batch]] — `P11`, pulled by owner ruling R6
- *Added 2026-10-10 (sync `3915417`→`79a7dbf`, closing a one-way link):* [[systems/install-and-self-update]] — Install, Launcher & Self-Update · [[tasks/make-board-root-test-reliable-under-machine-load]] — Make `test/board-root.test.js` reliable under machine load (its 20 s CLI time limit)
