# Let the read-only board reader serve another project's `ai-agents/` tree (`--root` flag)

**Source**: `ai-agents/tasks/done/0412-let-the-read-only-board-reader-serve-another-projects-ai-agents-tree-root-flag/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-09-23
**Sprint/Tag**: Backlog board · Unscheduled · task `0412` · owner `fkit-coder`

## Goal
Owner ruling 2026-09-23 (selected option text): *"Read-only, now + --root task"* — use fkit's read-only
board reader on **another fkit-using project** now, and give it a proper command-line door. Before this,
`bin/fkit-board.mjs` found its root by walking up from its own file, so it could only serve fkit's own
tree. The lead had already proven the library worked on a sibling project by hand (289 tasks, 12 boards,
~250 ms snapshot, 0 writes).

## Key Changes
- **`--root <path>`** on `bin/fkit-board.mjs`; no flag → unchanged behaviour. The root is **validated up
  front** (must hold `ai-agents/tasks/` and `ai-agents/sprints/`); a bad path is a non-zero exit, **never a
  fall-through to fkit's own tree**.
- ⭐ **The rule chosen: TOOLS come from fkit's own checkout, DATA comes from `--root`.** The target
  project's own `dashboard.sh` is **never run** — on the sibling project it was an older v1 dashboard that
  the reader could not use. This keeps sprint-status recognition in **one grammar** (fkit's canonical
  `dashboard.sh`). ⚠️ Accepted consequence: a newer dashboard may read an older project's boards
  differently than that project's own `/fkit-status` does.
- The startup banner names the tree being served; `--bench` honours `--root`; README documents the flag.
- ⛔ Still read-only in every mode, bound to `127.0.0.1`; fkit never edits another project's tree.
- ⛔ **Not ADR-051 trial evidence** — the trial counted fkit's own tree and had not started.

## Outcome
- Review converged over three rounds (Claude + Codex); `npm test` 1012/1012, `prove-red.sh` 40/40
  (⚠️ prove-red holds no board-reader mutations — the reviewer's own probes are the only mutation evidence;
  2 of 7 survived → accepted residual R11). Coder's manual run: 290 tasks / 12 boards on the sibling, tree
  byte-identical, `POST` → 405. **The owner has not personally verified the build.**
- Finding **R5** (the snapshot cache misses renamed task folders) was deferred to `0413` — which was then
  **cancelled** under ADR-052 ([[tasks/the-2026-09-30-adr-052-task-dispositions]]). The staleness is live.
- Known fidelity gaps on the sibling project left out of scope: `unresolved` open-sprint status (old
  banners), two boards resolving to `BACKLOG` (warned on `/api/check`), and `plan-sprint-N.md` archives →
  fixed next by [[tasks/keep-a-closed-sprints-tasks-attached-when-its-board-is-named-plan-sprint-n]].
- Evidence-log entry **E3** (ADR-051): the owner found the reader *"very useful"* on the sibling project.
- ⚠️ Retires with the reader at ADR-052 phase 8.

## Related
- [[tasks/make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads]] — `0411`, the reader this extends
- [[tasks/keep-a-closed-sprints-tasks-attached-when-its-board-is-named-plan-sprint-n]] — `0415`, the next fix found through `--root`
- [[decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim]] — the interim this serves
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — keeps the *tools from fkit, data from the project* rule for its converter
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the board it was filed on
