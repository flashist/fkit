# Make the read-only aiboard reader the board the owner actually reads

**Source**: `ai-agents/tasks/done/0411-make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-09-21
**Sprint/Tag**: Sprint 11 · `P3` (re-ranked from `P5` by owner ruling 2026-09-20) · task `0411` · owner `fkit-coder`

> ⚠️ **Scheduled for retirement.** Under [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]]
> the read-only reader is the interim **only until a project is converted**, and `bin/fkit-board.mjs`,
> `bin/board-narrow.mjs` and their tests are **retired at phase 8** (task `0467`). ⛔ Until the fkit pilot,
> **no writable `aiboard serve` on real project data — this reader only** (ADR-052 Q16). It is live today.

## Goal
Track 1, **"A now"**, of [[decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim]]:
turn the expert's throwaway spike into **a read-only board the owner runs and actually reads his sprints
and tasks in** — the code half `0404` never authorised.

## Key Changes
- **`bin/fkit-board.mjs`** (Node, run as `npm run board`) — a local HTTP server that serves **aiboard's
  unmodified web UI over fkit's unmodified `ai-agents/` tree**, bound to `127.0.0.1`. The spike was
  **read, never extended**: its endpoint set and `read_only: true` flag survive as design; its hard-coded
  absolute paths, its second copy of the banner grammar and its `priority: "medium"` flattening are gone.
- ⛔ **Read-only in every mode** — every non-`GET` method is refused; nothing opens a file for writing,
  renames anything, or calls a mover.
- ⛔ **One grammar for sprint status.** The file contains **no banner regex and none of the banner's
  markers**: open boards get identity and status from **one `dashboard.sh select-active` call**; archived
  boards take status from **location**. `test/board-reader.test.js` greps the **whole file, comments
  included**, and goes red if a banner marker appears — *a guard that must first parse comments out can be
  fooled into a false pass.*
- Task status **is** read here, deliberately: a task's `## Status` is a different vocabulary told apart by
  **position**; only `🔄` and `🚧` are matched, the rest comes from the folder (ADR-029).
- Hard constraints held: no id re-keyed, no folder moved, no closed-task or vault edit, nothing written into
  aiboard's repo.

## Outcome
- ⭐ **The owner's demo verdict, 2026-09-21** — recorded on this brief at close because it existed only in a
  session transcript: he ran the reader on the **live tree, 411 tasks across 11 boards**, and chose *"Yes —
  I'd use this"*. ⚠️ **Selected option text, not his own words.** ⛔ **Limits:** one session, one user, who
  is the author of both systems and knew what he hoped to see — **a strong signal about one workflow, not a
  usability finding.**
- The verdict became ADR-051's only evidence-log entry (not trial evidence — the trial clock never started).
- Follow-ups on the same reader: `--root` → [[tasks/let-the-read-only-board-reader-serve-another-projects-ai-agents-tree-root-flag]];
  `plan-sprint-N.md` attachment → [[tasks/keep-a-closed-sprints-tasks-attached-when-its-board-is-named-plan-sprint-n]];
  snapshot-cache renames (`0413`) → **cancelled** under ADR-052 ([[tasks/the-2026-09-30-adr-052-task-dispositions]]).
- `bin/board-narrow.mjs` — a separate **format probe** for `0405`'s Stage 0 (a filter over `dashboard.sh`
  stdout rendering a fixed-width table) — sits beside it and retires with it.

> ⭐ **Dated note 2026-10-23 (sync `96c7263`→`5ccf2c2`) — this reader now ships to every fkit user as `fkit board`.** By [[decisions/adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge]] (owner ruling A3, 2026-10-20), task `0536` installs `bin/fkit-board.mjs` with a vendored copy of aiboard's page (aiboard `a1592dc`) and routes `fkit board` to it — read-only, Node for that command only. ⚠️ Its tests (`board-reader`, `board-root`, `board-narrow`, `board-archived-id`) were deleted by `0529` (ADR-057 category 3), so it ships untested. Interim until `0444` / `0467`.

## Related
- [[tasks/sprint-11-fkit-aiboard-convergence]] — the board it shipped on
- [[tasks/evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam]] — `0404`, whose spike it replaced
- [[decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim]] — the interim it implements
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — retires it at phase 8
- [[tasks/make-fkit-status-report-hierarchically-counts-and-exceptions-first-detail-on-request]] — `0409`, the other half of *"fix the reporting first"*; `dashboard.sh`'s stdout is a contract both depend on
- *Added 2026-09-30 (sync `a351cb6`→`3915417`, closing a one-way link):* [[systems/fkit]] — the team page, whose data-model section now points here as the only board code in the repo
- *Added 2026-10-10 (sync `3915417`→`79a7dbf`):* [[tasks/find-why-prove-red-step-0a-sometimes-goes-red-and-make-it-deterministic]] — `0477`: tests A/E/R1 read the live tree twice and raced concurrent writers
- *Added 2026-10-10 (sync `3915417`→`79a7dbf`):* [[tasks/overhaul-the-readme-for-first-time-visitors]] — `0478` moved the README's board section to `docs/board.md`
- *Added 2026-10-15 (sync `baf6a4e`→`96c7263`, closing a one-way link):* [[tasks/stop-the-board-reader-failing-when-a-task-folder-moves-between-its-check-and-its-read]] — `0483`: the reader no longer throws when a task folder or board file moves between its check and its read
- *Added 2026-10-23 (sync `96c7263`→`5ccf2c2`):* [[decisions/adr-058-the-read-only-board-reader-ships-to-every-fkit-user-as-fkit-board-ahead-of-the-merge]] · [[tasks/ship-the-read-only-board-reader-to-every-fkit-user-via-fkit-board]] — shipped as `fkit board`
