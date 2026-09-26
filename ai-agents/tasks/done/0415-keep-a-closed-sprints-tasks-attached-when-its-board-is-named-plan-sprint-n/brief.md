# Keep a closed sprint's tasks attached when its board is named `plan-sprint-N.md`

## ID
0415

## Sprint
Backlog

## Priority
Unscheduled

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Owner ruling, 2026-09-26** — given live in a `fkit lead` session via `AskUserQuestion`. ⛔ **Selected
option text, not the owner's own prose — never quote it as his words:** *"Yes, I drive it now — Producer
writes a brief, the coder plans, you approve the plan here, then build, review and close, like 0412.
Small change to fkit's board reader; geoconflict isn't touched."*

What triggered it — **the owner's own typed words**, which may be quoted: *"Geoconflikt. Has just closed
sprint 4 and I no longer see it on the board. Is it okay?"*

### The bug (verified read-only by the lead, 2026-09-26)

Seen by running the board reader with `--root` (added by
[`0412`](../../done/0412-let-the-read-only-board-reader-serve-another-projects-ai-agents-tree-root-flag/brief.md))
over **a sibling fkit-using project**. No machine paths are recorded here.

`bin/fkit-board.mjs` gives each board an id that tasks attach to by their `## Sprint` value:

- **Open boards** (`sprints/*.md`) take the id from `dashboard.sh`'s resolved identity, via `boardId()`:
  `Sprint 4` → `S-004`.
- **Archived boards** (`sprints/done/`, `sprints/cancelled/`) take it from the **file name**, via
  `boardIdFromFile()`. That only maps `sprint-N.md` → `S-00N`; **any other stem falls through to
  `S-<stem>`**.

The sibling project names its boards `plan-sprint-N.md` (an older convention). So when its Sprint 4 was
closed — moved to `sprints/done/plan-sprint-4.md` with a Done banner — the board's id changed from
`S-004` to `S-plan-sprint-4`. Its **110 tasks** (105 done, 5 cancelled), all with sprint `S-004`, **no
longer attach to any board**. The same was already true of its done Sprints 1, 2, 3, 4b and 4c
(`S-plan-sprint-1` …).

**fkit's own tree is not affected** — it names boards `sprint-N.md`.

This is not new: it was known gap #4 in the lead's first probe (2026-09-23) and is listed as out of
scope in `0412`'s brief ("Archived `plan-sprint-N.md` boards map to `S-plan-sprint-N` …"). This task
closes it.

### Locked rules that bear on the fix

- **Read-only, always** ([ADR-051](../../../knowledge-base/decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md),
  `0411`, `0412`). The sibling project is **not touched** — no rename, no edit to its files.
- **The "one grammar" rule** (ADR-051 and
  [`sprint-status-vocabulary.md`](../../../knowledge-base/conventions/sprint-status-vocabulary.md))
  covers **status banners**, not H1 headings. Reading a board's H1 is therefore not banned by that rule
  — but `test/board-reader.test.js` greps the whole reader source (comments included) for banner tokens,
  so any H1-based approach must not quote or parse banner text.

## What to build

A **minimal fix** so an archived board named `plan-sprint-N.md` gets **the same id it had while open**.
The plan settles the exact approach; the required outcomes are:

1. **Archived `plan-sprint-N.md` → the open-board id.** `plan-sprint-4.md` → `S-004`;
   `plan-sprint-4b.md` → `S-4b` (the same unpadded-suffix rule `boardId()` already applies to open
   boards). `sprint-N.md` and `backlog.md` keep mapping exactly as today.
2. **Choose and justify the derivation** in the plan. Two candidates, at least:
   - **(a) File name:** also accept a `plan-sprint-` prefix in `boardIdFromFile()`. Smallest change.
   - **(b) H1 heading:** derive the id from the archived board's H1 (e.g. "Geoconflict — Sprint 4 — …"),
     the way open boards get theirs from their identity. More general, but it is a new parse of board
     text; the plan must show it trips none of `0411`'s source-grep assertions and reads no banner.

   The plan picks one, says why, and names what the other would have caught that the pick does not.
3. **No new id collisions.** Use `0412`'s collision warnings on `/api/check` as the check: the fix must
   not make two boards claim one id that did not collide before (e.g. an archived `plan-sprint-4.md`
   and an open `sprint-4.md` in the same tree). If a collision is possible, it must be **warned, not
   silently merged** — the same behaviour `0412` already has.
4. **Tests** in the existing `node --test` suite, on **temp-dir fixture trees only** (never the sibling
   project, never fkit's live tree mutated): archived `plan-sprint-N.md` and `plan-sprint-Nb.md` in
   `sprints/done/` and `sprints/cancelled/` attach their tasks; `sprint-N.md` and `backlog.md` unchanged;
   a deliberate collision case shows its warning on `/api/check`.
5. **Report, don't change — does aiboard's UI show Done sprints at all?** The owner asked where closed
   Sprint 4 went. The coder checks, read-only, whether aiboard's unmodified web UI lists Done / Cancelled
   boards and where, and writes the answer in the worklog so the lead can tell the owner where to look.
   ⛔ **No change to aiboard.** If aiboard hides Done sprints, that is a finding for the owner, not part
   of this fix.

### Oddities seen in the sibling project — the plan classifies each in or out

Probably **out of scope** (the plan says so, or argues otherwise):

- a task whose sprint value is `S-3.` (a stray trailing dot in that project's data);
- tasks with no sprint (`-`);
- two backlog boards both resolving to `BACKLOG` (already warned by `0412`).

## Verification steps

1. `npm test` green, including the new tests. Each new test **fails against the current
   `boardIdFromFile()`** — the coder shows that red run (revert, run, restore) in the worklog.
2. **fkit's own tree is unchanged:** reader output over fkit's tree (snapshot JSON and/or `--bench`)
   before and after the change is identical — shown by a diff in the worklog, not by claim.
3. **The sibling project, read-only, via `--root`:** its done Sprint 4 board now carries id `S-004` with
   its 110 tasks attached (105 done, 5 cancelled), and done Sprints 1, 2, 3, 4b, 4c carry `S-001`,
   `S-002`, `S-003`, `S-4b`, `S-4c` with their tasks attached. Recorded in the worklog **without machine
   paths**. The sibling tree is byte-identical before and after.
4. **No new collision warnings** on `/api/check` over fkit's tree or the sibling tree, compared to
   before the change (the existing `BACKLOG` warning may stay).
5. **0411's read-only contracts still hold, unedited** — `test/board-reader.test.js` passes with **no
   change to its assertions** (fs import list, `spawnSync` call count, banned-needle list).
6. The worklog answers item 5 of *What to build*: does aiboard's UI show Done sprints, and where.

## Notes

- **Depends on:** nothing (`0412` is done).
- **Blocks:** nothing.
- ⚠️ **Same file as [`0413`](../../backlog/0413-make-the-board-readers-snapshot-cache-notice-renames/brief.md)**
  (`bin/fkit-board.mjs`, still Backlog). Different functions (`boardIdFromFile()` here, `cacheKey()`
  there), so the conflict risk is low, but whichever lands second rebases on the first. Not a hard
  dependency — no ordering is imposed. ⭐ `0413`'s rename tests would be a natural place to also cover a
  board renamed to/from `plan-sprint-N.md`, if it lands second.
- ⚠️ **Trap for the coder — the reader's source is grepped as text.** `test/board-reader.test.js` bans
  needles anywhere in `bin/fkit-board.mjs`, **comments included** — including sprint banner markers.
  Fixture text containing banners belongs in the test file, never in the reader.
- ⭐ **Small by design.** If the plan finds it is not small, stop and say why.
- ⛔ **Nothing in the sibling project changes.** Renaming its boards to `sprint-N.md` would also "fix"
  it, but that is that project's call, not this task.
- Filed by a spawned `fkit-producer` on a relayed ruling (no owner channel, ADR-021); decides nothing
  beyond the scoping. Owner flow per the ruling: coder plans → owner approves the plan in the lead
  session → build → review → close.
