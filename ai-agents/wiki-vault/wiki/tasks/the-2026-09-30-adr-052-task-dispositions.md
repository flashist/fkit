# The 2026-09-30 ADR-052 task dispositions — three cancels, two re-scopes, one revisit task

**Source**: `ai-agents/tasks/cancelled/0135-add-producer-only-reconcile-mode-to-task-done/brief.md`, `ai-agents/tasks/cancelled/0408-build-the-deterministic-mover-command-the-four-mover-skills-call/brief.md`, `ai-agents/tasks/cancelled/0413-make-the-board-readers-snapshot-cache-notice-renames/brief.md` (plus the re-scoped open briefs `0405`, `0407` and the new `0416` on `ai-agents/sprints/backlog.md`)
**Status**: cancelled (`0135`, `0408`, `0413`) — each `⛔ Cancelled (agent-closed — not owner-verified) (2026-09-30)`
**Sprint/Tag**: Backlog board · executed 2026-09-30 by a producer under ADR-052 D11 (authorised by the owner's approval, A1)

> ⭐ **Ingested 2026-09-30** (sync `a351cb6`→`3915417`). One consolidated page, because all six moves have
> one cause and one authority. ⛔ **Open briefs `0405`, `0407` and `0416` are not ingested as their own
> pages** (the sync skips open briefs); they are recorded here only as the other half of the same act.

## Goal
Apply [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]]
D11: tasks whose premise the merge removes are re-scoped or cancelled, **through the normal close skills,
with the agent-closed marker**. ADR-052's approval (A1) authorised exactly these acts and nothing more.

## Key Changes

| Task | What it was | Disposition | Reason on the record |
|---|---|---|---|
| `0135` | ADR-048's producer-only reconcile mode in `/fkit-task-done`, mirrored into both ship loops | ⛔ **Cancelled** | *"a close cannot half-land once status has one place (the board's folder); ADR-048's reconcile mode is not to be built"* |
| `0408` | The deterministic mover command the four mover skills would call (ADR-050's build) | ⛔ **Cancelled** | *"`fkit board` is the deterministic command this task would have built; ADR-050's authorised build is discharged by the board"* |
| `0413` | Make the read-only reader's snapshot cache notice renamed task folders (`0412`'s finding R5) | ⛔ **Cancelled** | *"the read-only reader (`bin/fkit-board.mjs`) retires at phase 8, so a fix to its snapshot cache is not worth building"* |
| `0407` | The mover outcome verifier (ADR-050's acceptance test) | ↻ **Re-scoped**, still `🔲 Backlog` | Now **the converter's self-check** — ADR-052 D8 item 7's acceptance bar; phase 4; depends on `0437`, `0428` |
| `0405` | Investigate a terminal UI, compare it against the web board | ↻ **Re-scoped**, relocated from Sprint 11 | Now compares the board's page against `fkit board`'s terminal view; **`🚧 Blocked — waiting on 0433, 0434 (ADR-052 phase 3)`** |
| `0416` | *(new)* Revisit a tripwire hook against hand-moved task folders | Filed `🔲 Backlog`, owner `fkit-producer`, low priority | ADR-052 R8, his own words: *"Don't implement it, add a task to the backlog with low priority, that will require to think about this feature again after some time …"* — a **revisit** task whose only output is a recommendation |

## Outcome
- ⚠️ **ADR-048 is now obsolete** — its reconcile mode was never built and is not to be built. ⛔ **But
  until a project is converted, its closes are still prose and can still half-land, and nothing is built
  for that window** (ADR-052's own caveat). The owner-only exceptions in `/fkit-task-done` step 1
  (including `0229`'s contradicted-close repair) remain the only repair paths in the meantime.
- ⚠️ **`0413`'s staleness is live** in the reader until it retires: a renamed task folder can be missed by
  the snapshot cache.
- `0408` had been filed **without reading ADR-050** (the architect held `decisions/` at filing time) and
  was never authorised to start.
- All three cancels carry the `(agent-closed — not owner-verified)` marker: a spawned producer performed
  them.
- ⚠️ **Stale source prose, reported not repaired:** the evidence log's E3 table still lists `0413` as
  **Open** while linking its `cancelled/` path, and `0415`'s brief still calls `0413` *"still Backlog"*.

## Related
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — D11, the authority for every row above
- [[decisions/adr-048-a-half-landed-close-gets-a-producer-only-reconcile-mode-that-never-upgrades-the-marker]] — `0135`'s ADR, now obsolete
- [[decisions/adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed]] — `0407`/`0408`'s ADR, its build discharged
- [[tasks/decide-the-sanctioned-repair-path-for-a-half-landed-close]] — `0134`, whose ADR `0135` was to implement
- [[tasks/widen-task-done-to-repair-a-brief-that-contradicts-a-landed-close]] — `0229`, which `0135` would have edited again
- [[tasks/let-the-read-only-board-reader-serve-another-projects-ai-agents-tree-root-flag]] — `0412`, source of `0413`'s finding
- [[tasks/make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads]] — the reader `0413` would have fixed
- [[tasks/sprint-11-fkit-aiboard-convergence]] — the board `0405` was relocated from
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — the board all six rows sit on
