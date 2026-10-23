# Ship the read-only board reader to every fkit user via `fkit board`

**Source**: `ai-agents/tasks/done/0536-ship-the-read-only-board-reader-to-every-fkit-user-via-fkit-board/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 14 · `P1` (filed `P8` append rank, re-ranked `P1` on owner ruling A3) · task `0536` · owner `fkit-coder`

> ⭐ **Ingested 2026-10-23** (sync `96c7263`→`5ccf2c2`). The brief's `plan.md`, `worklog.md` and `review.md` were read as evidence, not ingested.

## Goal
Deliver the owner's stated goal — typed 2026-10-20: *"I just want this AI board to be compatible with F-Kit and I want later to make it part of F-Kit. So anybody who is using F-Kit has this board delivered to them."* — in one small task, by shipping today's read-only reader as `fkit board`, per [[decisions/adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge]] (the brief: *"where it and this brief differ, the ADR wins"*). Not part of ADR-052 phase 2's gate; nothing waits on it. Out of scope: the task format, movers, `dashboard.sh`, hooks, any write path, the `board/` module.

## Key Changes
*(from the worklog's Build entry; the plan was approved via `AskUserQuestion` 2026-10-20, option *"Approve, no new test (Recommended)"* — so **no new test file and no new test case**)*
- **`vendor/aiboard/index.html` + `LICENSE`**, copied with `git cat-file blob` from aiboard `a1592dc` (33,899 bytes, sha256 checked), plus `vendor/aiboard/README.md` recording provenance.
- **`bin/fkit-board.mjs`:** with no `--root` it serves the **current folder's** `ai-agents/` (clear error, exit 2, when there is none — no walk-up); page order `--aiboard` → `FKIT_AIBOARD` → the vendored copy (the sibling-checkout rung removed); the *"NOT vendored"* comment and others the change made wrong fixed; `findRoot` kept for `board-narrow.mjs`.
- **`install.sh`:** copies the reader and `vendor/aiboard/` only when the source has both, and clears an old copy otherwise; an optional-Node heads-up.
- **`claude/fkit-claude.sh`:** a `board` route ahead of update / setup / help / menu, with a no-Node message (exit 1) and a missing-reader message (exit 1).
- **Docs:** `docs/board.md` rewritten; `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md` (*"Existing installs get it with `fkit update`"*).
- **Review round 1 (owner rulings relayed 2026-10-20):** R3 *"Show help (Recommended)"* — `fkit board --help` / a mistyped option shows usage (exit 0 / exit 2); R4 typed *"Accept as a known cost"* — no code change, residual in `review.md`.

## Outcome
- **Verified** (independent Verify and final re-verify): a fixture install holds the reader and the page; installed `fkit board --port 0` in a fixture project → `/` 200 with the vendored page's hash, `/api/board` 200 with `read_only: true`, 405 for every POST/PUT/PATCH/DELETE, zero curl/git calls, fixture tree unchanged; with no `node` on `PATH`, the Node message and exit 1 while `fkit producer` still launches; `npm run board` from a checkout still works.
- ⚠️ **One `npm test` failure in 1 of 3 final runs, judged not from this task:** `0284/term-ignored` (*"the launcher was held 33.282s by a stalled git (ceiling 10.5s)"*) under machine load ~18; the other two runs and 3/3 isolated runs passed. Filed by owner ruling as backlog `0537` (make that stall test reliable under load).
- **Not done:** a browser check (HTTP evidence only, which the brief allows) and a real network install from `main` (needs a push).
- **Follow-ups filed** (open, not ingested): `0538` (refuse reads from a foreign host name in the shipped reader) and `0539` (the same in the Node board server), from `0422`'s plan Q2, owner ruling 2026-10-22.
- ⚠️ The reader ships **with no automated test** (ADR-058 *Consequences*); its earlier tests were deleted by `0529`.
  > ✅ *Dated note 2026-10-23 (sync `5ccf2c2`→`185ac5e`; the two lines above left byte-identical):* `0538` is **done** (agent-closed) — the reader now refuses (403) a `Host` that is not `localhost`, an IP literal or its own host, and on the owner's OK it has a test file again, `test/board-reader-host.test.js` (4 tests). `0539` (the `board/` server) is still open. → [[tasks/refuse-reads-from-a-foreign-host-name-in-the-shipped-fkit-board-reader]]

## Related
- [[decisions/adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge]] — the decision this implements
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — `0443` / `0444` / `0467` take over from it
- [[tasks/make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads]] — `0411`, the reader
- [[tasks/let-the-read-only-board-reader-serve-another-projects-ai-agents-tree-root-flag]] — `0412`, the tools-from-fkit / data-from-the-project rule this keeps
- [[tasks/sprint-14-port-aiboard-to-node-adr-052-phase-2]] — the board
- [[tasks/port-aiboard-to-node-in-board-the-adr-052-phase-2-tasks-0417-0423]] — the Node port that carries a second copy of the same page
- [[systems/install-and-self-update]]
- *Added 2026-10-23 (sync `96c7263`→`5ccf2c2`, closing one-way links):* [[tasks/stop-the-board-reader-failing-when-a-task-folder-moves-between-its-check-and-its-read]]
- *Added 2026-10-23 (sync `5ccf2c2`→`185ac5e`):* [[tasks/refuse-reads-from-a-foreign-host-name-in-the-shipped-fkit-board-reader]] — follow-up `0538` **done** (agent-closed): Host check on reads, plus a test file — the *"no automated test"* line above is no longer true
