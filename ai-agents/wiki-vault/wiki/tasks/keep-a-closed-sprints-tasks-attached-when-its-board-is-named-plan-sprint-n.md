# Keep a closed sprint's tasks attached when its board is named `plan-sprint-N.md`

**Source**: `ai-agents/tasks/done/0415-keep-a-closed-sprints-tasks-attached-when-its-board-is-named-plan-sprint-n/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-09-26
**Sprint/Tag**: Backlog board · Unscheduled · task `0415` · owner `fkit-coder`

## Goal
The owner's own typed words (2026-09-26): *"Geoconflikt. Has just closed sprint 4 and I no longer see it
on the board. Is it okay?"* Seen through the reader's `--root` flag on a sibling fkit-using project that
names its boards `plan-sprint-N.md` (an older convention). The owner chose to drive it the same day
(selected option text: *"Yes, I drive it now …"*).

## Key Changes
- **The bug:** `bin/fkit-board.mjs` gives open boards an id from `dashboard.sh`'s resolved identity
  (`Sprint 4` → `S-004`) but gives **archived** boards an id from the **file name** via
  `boardIdFromFile()`, which only mapped `sprint-N.md`. Any other stem fell through to `S-<stem>`, so
  closing the sibling's Sprint 4 (moved to `sprints/done/plan-sprint-4.md`) changed its id to
  `S-plan-sprint-4` and **its 110 tasks attached to no board**. Its earlier done sprints had the same gap.
  **fkit's own tree was not affected.**
- **The fix:** `boardIdFromFile()` now maps `plan-sprint-N.md` (and letter suffixes such as `4b`) to the
  same id family. The id still comes from the **file name, not the H1** (owner-approved derivation) — the
  *one grammar* rule covers status banners, not H1s, but the plan kept the narrower change.
- Tests on temp-dir fixture trees only; `test/board-reader.test.js`'s read-only assertions unchanged.

## Outcome
- Measured by the coder, read-only: the sibling's done Sprint 4 board is `S-004` again with **110 tasks
  (105 done, 5 cancelled)**; `S-4b` 4, `S-4c` 8; sibling tree byte-identical; fkit's own reader output
  diff empty. `npm test` 1017/1017, `prove-red.sh` 40/40 (⚠️ no board-reader mutants in prove-red; the
  reviewer's probes are the only mutation evidence).
- Accepted residuals (owner, selected option text): suffix looseness (`plan-sprint-4-old` → `S-4-old`,
  *"Keep it"*); twelve sibling `Sprint backlog — …` tasks left as they are.
- The folder was **untracked** when closed, so it was moved with plain `mv`, not `git mv`.
- ⭐ ADR-052's converter must read exactly this shape: its D8 names `plan-sprint-N.md` among the old board
  names it copes with, reading old projects with fkit's current tools.

## Related
- [[tasks/let-the-read-only-board-reader-serve-another-projects-ai-agents-tree-root-flag]] — `0412`, the `--root` flag that exposed it
- [[tasks/make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads]] — `0411`, the reader
- [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]] — fkit's sprint-identity grammar, which the reader deliberately does not re-implement
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — the converter that inherits this case
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the board it was filed on
- *Added 2026-09-30 (sync `a351cb6`→`3915417`, closing a one-way link):* [[decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim]] — the interim reader's ADR, whose *one grammar* rule the fix honoured
