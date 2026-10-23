# Make `test/board-root.test.js` reliable under machine load (its 20 s CLI time limit)

**Source**: `ai-agents/tasks/done/0502-make-board-root-test-reliable-under-machine-load/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 10 `P17` (append rank) · task `0502` · owner `fkit-coder`

## Goal
Owner ruling 2026-10-09 (`AskUserQuestion`, ⚠️ the lead's relay): *"File it, add to Sprint 10 (Recommended)"*, on
*"test/board-root.test.js keeps timing out under machine load (its 20 s limit) and has turned 4 full test runs red
this sprint, never because of the task being tested."*

**The problem.** The file starts the real board CLI as a child process with `timeout: 20000`. Under load (load
average ~4–13) one call hits 20 s, Node kills it, the call returns `status null`, and `assert.equal(r.status, 2)`
fails as `null !== 2`. Seen in `0492`, `0495` ×2, `0493` full runs and one `0494` `test:docs` run, each in files the
task did not touch, each green on re-run. **Why it multiplies:** prove-red re-runs the whole suite many times, so one
slow test gets many chances per gate. **Where 20 s came from:** it arrived with `0412` and **no record gives a
reason**.

⚠️ **The limit is part of one assertion:** R3 proves "a bad `--root` starts nothing" partly **by the call not timing
out** — any fix must keep a CLI that wrongly starts a server turning R3 red. ⛔ The owner dropped the CPU-limit idea.

## Key Changes
- Owner plan approval 2026-10-09: *"Approve, no CPU burners (Recommended)"*; Q2 *"120 s (Recommended)"*; Q3 *"One run
  after (Recommended)"*. No CPU-burner process was ever started; measurement at normal load only.
- **One named constant, `CLI_TIMEOUT_MS = 120000`**, for every CLI call and for the `serveCli` banner timer (the
  other 20 s timer, same risk). Test file only — `bin/fkit-board.mjs` and `test/harness.mjs` unchanged; built on top
  of `0477`'s still-uncommitted edits to the same file, never reverting them.
- Proven with a deliberate 25 s pause in a scratch copy and mutants showing the R3 proof still bites.

## Outcome
- ⚠️ **The cost, stated in the brief:** a real hang now takes up to 120 s to fail, not 20 s.
- ⚠️ **Open for the owner at filing:** whether `0477`'s uncommitted edits to this file should be committed first —
  not asked by the producer (no owner channel).
- The full-run times measured around it (23.1 min at `0502` V6, and more under load) fed task `0503` (open:
  re-measure locally and on CI).

> ⚠️ **Dated note 2026-10-23 (sync `96c7263`→`5ccf2c2`) — `test/board-root.test.js` is deleted.** Task `0529` deleted it on 2026-10-20 under [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]] §D1 (category 3 — repo-only `bin/` tooling). The record above is left as written; what it describes no longer runs. Its `CLI_TIMEOUT_MS` fix went with it.

## Related
- [[tasks/find-why-prove-red-step-0a-sometimes-goes-red-and-make-it-deterministic]] — `0477`, the same class of fix; its edit lives in the same file
- [[tasks/let-the-read-only-board-reader-serve-another-projects-ai-agents-tree-root-flag]] — `0412`, which introduced the file and the 20 s value
- [[tasks/re-measure-the-ci-test-runtime-on-the-ubuntu-runner-and-correct-the-workflow-timeout]] — `0395`, the CI job limit a longer per-call limit must not crowd
- [[tasks/run-only-the-checks-a-change-needs-not-the-full-suite-every-time]] — `0480`; `test:docs` includes this file
- [[tasks/make-a-later-sprint-blocker-visible-0492-0495]] — the runs it kept turning red
- [[systems/testing-and-verification]] · [[tasks/sprint-10-the-0472-0482-batch]]
- *Added 2026-10-15 (sync `baf6a4e`→`96c7263`, closing a one-way link):* [[tasks/stop-the-board-reader-failing-when-a-task-folder-moves-between-its-check-and-its-read]] — `0483`, the other Sprint 10 change to the board reader's tests
- *Added 2026-10-23 (sync `96c7263`→`5ccf2c2`):* [[tasks/the-test-scope-reset-tasks-0526-0530]] — the cut that deleted this test
