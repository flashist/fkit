# Make the board reader's snapshot cache notice renames

## ID
0413

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Owner ruling, 2026-09-23** — given live in a `fkit lead` session via `AskUserQuestion`. ⛔ **Selected
option text, not the owner's own prose — never quote it as his words:** *"Separate backlog task — The
producer files a small follow-up to make the refresh check notice renames. Keeps 0412 to its approved
plan; the fix waits in Backlog until you schedule it."* This is that follow-up.

### The gap

Source: finding **R5** in [`0412`'s review ledger](../../done/0412-let-the-read-only-board-reader-serve-another-projects-ai-agents-tree-root-flag/review.md)
(round 1, severity low; raised by both reviewers, Codex as X2).

`bin/fkit-board.mjs` caches its snapshot behind `cacheKey()` — code from
[`0411`](../../done/0411-make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads/brief.md),
**not changed by `0412`**. The key is: per-board task-folder counts + board-file count + the newest
mtime. A **rename** keeps every count and every mtime, so a running reader keeps serving the old
snapshot until some other file in the tree is edited or the reader restarts. Cases the key misses:

- a **board file** renamed (e.g. `sprints/done/sprint-4b.md` → `sprints/done/sprint-04.md`);
- a board file moved between `sprints/` and `sprints/done/` (total count unchanged, mtime kept);
- a **task folder** renamed inside one board (`0123-old` → `0123-new`);
- by the same logic, one entry removed and a different one added at the same count, where neither
  carries the newest mtime.

**Reproduced by the reviewer:** on a live reader, renaming `done/sprint-4b.md` → `done/sprint-04.md`
kept listing `sprint-4b.md` and reported `warnings: []`; a fresh reader reported the board-id
collision. So the **id-collision warnings `0412` adds** inherit the gap — a stale snapshot can hide a
collision.

The code comment above `cacheKey()` admits the task-folder rename case but **not** the board-file
case — the comment understates the gap.

### Impact — low, stated plainly

The movers edit file content (which bumps the mtime), and any later edit or a restart clears it. The
gap is a **plain rename with no edit**. Low, but it is a wrong board shown with full confidence.

## What to build

1. **Make the key see names and locations**, not only counts and the newest mtime — e.g. include each
   task folder's board + name and each board file's location + name. The plan picks the exact shape.
   It must stay cheap per request — the key exists so the full snapshot is not rebuilt on every call.
2. **No new I/O.** `listTaskDirs()` and `listBoardFiles()` already read every name the key needs; the
   fix should reuse them, not add calls.
3. **Rewrite the comment above `cacheKey()`** so it says truthfully what the key catches and what it
   still does not.
4. **Tests** in the existing `node --test` suite, on fixture trees in a temp dir, that prove a live
   reader picks up, with no other edit:
   - a board-file rename that keeps its mtime (the R5 reproduction), including the collision warning
     appearing / disappearing on `/api/check`;
   - a board file moved between `sprints/` and `sprints/done/` with its mtime kept;
   - a task-folder rename inside one board with its mtime kept.

## Verification steps

1. `npm test` green, including the new tests above. Each new test must **fail against the current
   `cacheKey()`** — the coder shows that red run (revert the key, run, restore) in the worklog.
2. **0411's read-only contracts still hold, unedited** — `test/board-reader.test.js` passes with
   **no change to its assertions**: the `node:fs` import list is still exactly the four read calls,
   `spawnSync` is still called exactly twice, and the banned-needle list still finds nothing.
3. **Read-only proof still holds:** the existing byte-identical-tree check passes.
4. **Cache still works:** with nothing changed on disk, two back-to-back snapshot requests reuse the
   cached snapshot (show this by test or `--bench`, not by claim).
5. The new comment above `cacheKey()` names every case the key still misses, if any.

## Notes

- **Depends on:** 0412 (same file, `bin/fkit-board.mjs`; land after it so the two diffs don't collide,
  and so the tests can cover `0412`'s collision warnings).
- **Blocks:** nothing.
- ⚠️ **Trap for the coder — the reader's source is grepped as text.** `test/board-reader.test.js` bans
  needles such as `renameSync(` anywhere in `bin/fkit-board.mjs`, **comments included**. Rename
  fixtures belong in the test file, never in the reader. The same whole-file grep also bans quoting
  sprint banner markers.
- ⚠️ **A new module import is a plan question, not a free choice.** 0411's tests pin the `node:fs` and
  `node:child_process` import lists. Something like a hash of the key would need a new import (e.g.
  `node:crypto`); if the plan wants one, it checks it trips no 0411 assertion and says why a plain
  string key is not enough.
- ⭐ **Small by design.** If the plan finds it is not small, stop and say why.
- Out of scope: any other `0412` finding (R1–R4, R6) — those stay in `0412`'s ledger.
- Filed by a spawned `fkit-producer` on a relayed ruling (no owner channel, ADR-021); decides nothing
  beyond the scoping.
