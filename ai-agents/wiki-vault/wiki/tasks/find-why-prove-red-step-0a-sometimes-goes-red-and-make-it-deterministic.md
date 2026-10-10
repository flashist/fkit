# Find why prove-red step 0a sometimes goes red, and make it deterministic

**Source**: `ai-agents/tasks/done/0477-find-why-prove-red-step-0a-sometimes-goes-red-and-make-it-deterministic/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 10 `P1` · task `0477` · owner `fkit-coder`

## Goal
Owner ruling 2026-10-02 (selected option text, relayed): *"File a task — Producer files a small task to find
why prove-red step 0a sometimes goes red (suspected: other agents writing files mid-run). Starts on your
word."* Twice in one day `npm test` went red at prove-red step **0a** (*"baseline — real launcher should be
green"*) while the unit run just before it passed 1017/1017; a standalone re-run passed. In both cases another
agent was filing a brief during the run, and **the failing test was unknown — its output was already gone.**

What the producer found at filing (read, not run): 0a runs the whole suite against the **real** repo, not a
copy, so every test reading live `ai-agents/` state reads a tree other agents are writing; and the output could
not survive for **two** reasons — every step wrote the same `suite-output.txt`, and the temp dir was deleted by
the `EXIT` trap. ⚠️ The concurrent-write cause was a **suspect, not a finding**: step 2 was a gate — a
different cause meant stop and report.

## Key Changes
- **Keep the evidence first** (`test/prove-red.sh`): each of the 55 step blocks now starts with a `step <label>`
  call that keeps the previous step's output if it failed and points output at the step's own file. Kept
  output goes to a `fkit-prove-red-kept.*` dir under `$TMPDIR`, made on first failure only (never inside
  `ai-agents/` — that would itself be a concurrent write); the `EXIT` trap keeps an aborted step's output; the
  final `✗` line names the failed steps and the kept dir. A green run leaves nothing.
- **Reproduced on purpose, in a scratch copy only** (owner OQ3). ⭐ **A finding the plan did not have: the race
  is phase-locked to the writer.** Started at the same instant as the run, a writer was green every time;
  started **1–3 s before** the run it went red — **`board-root` R1** (`--bench` counted 484 tasks after R1 had
  counted 483: a probe brief filed between the two reads). A mover writer hit `L2 live corpus: BROKEN is 0`
  (the known half-moved state, ruled strict by the owner, OQ2 — residual R-a). Board-reader A and E were
  **not** reproduced red.
- **The fix — make the two-read tests tolerate a concurrent writer:** a `liveTaskFolders()` helper in
  `test/harness.mjs`; board-reader A brackets its snapshot with two listings; R1 accepts a count between
  `|before ∩ after|` and `|before ∪ after|`; E crawls a private `git init`ed copy. Single-read live guards
  (reference-integrity, task-id-uniqueness, …) stay strict. No new permanent prove-red mutations (owner OQ4).

## Outcome
- Closed after process review round 1 (R1, a temp-dir leak in E's `privateCopy()`, verified `CORRECT` and
  fixed); full `npm test` 1017/1017 and prove-red hard gate passed (920 s). Four accepted residuals recorded
  (R-b…R-e); R-c became backlog task `0483` (the board reader throwing when a folder moves between its check and
  its read).
- ⚠️ **Not fixed here, by scope:** single-read checks still go red if a writer leaves a half-written state at
  the moment they read (R-a, owner-ruled strict). And **load**, not concurrency, later turned `board-root` red
  four more times — that became [[tasks/make-board-root-test-reliable-under-machine-load]] (`0502`).
- ⚠️ Its edits to `test/board-root.test.js` and `test/harness.mjs` sat **uncommitted** after close; `0502` was
  told to build on top of them, never revert them.

## Related
- [[tasks/sprint-10-the-0472-0482-batch]] — `P1`: every later task's verify runs this step
- [[tasks/make-board-root-test-reliable-under-machine-load]] — `0502`, the same class of fix (a gate red for reasons unrelated to the change)
- [[tasks/run-only-the-checks-a-change-needs-not-the-full-suite-every-time]] — `0480`, measured on a quiet tree because of this
- [[systems/testing-and-verification]] — prove-red, the hard gate
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]] — Decision 4 wires prove-red into every gate; this keeps that gate honest
- [[tasks/make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads]] — `0411`, the reader tests A/E belong to
