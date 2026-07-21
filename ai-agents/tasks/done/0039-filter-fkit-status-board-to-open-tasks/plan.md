# Plan — Filter the `/fkit-status` board to open tasks only

**Task:** [`filter-fkit-status-board-to-open-tasks.md`](./brief.md)
· **Sprint 2, priority 65** · **Approved by the owner: 2026-07-18**

This is the durable autonomy boundary for the ship-loop run. Work outside it stops for the owner.

## The change

### 1. `claude/skills/fkit-status/dashboard.sh`

- Add a per-row `row_drift` flag, reset at the top of the row loop.
- Replace all 8 in-loop `DRIFT_TASKS="$DRIFT_TASKS $tid"` appends with one `mark_drift()` helper that
  sets **both** `DRIFT_TASKS` and `row_drift=1`. Faithful 1:1 refactor — every drift fact already
  appended to `DRIFT_TASKS`, so no fact changes category.
- Guard **only** the `BOARD_ROWS` append: if the reconciled `key` is `done`/`cancelled`/`moved` **and**
  `row_drift` is empty, `continue`. Counting, roll-up, `⟦FACTS⟧` and the drift clause are all computed
  above the guard and are untouched.

### 2. `claude/skills/fkit-status/SKILL.md`

- Rewrite the `⟦BOARD⟧` section: the board shows open work only; scope lives in the roll-up; a drifted
  row always renders whatever its marker says; explicit "do not "fix" the totals to match the visible
  rows"; explicit note that this is a knowing reversal and **not a toggle**.
- Rewrite the hand-built fallback passage, which instructed the exact opposite ("show the dead rows").
  New instruction: render open rows only, keep drifted rows, and count **every** row for `M`.

### 3. `test/dashboard-contract.test.js`

- Update the existing tests whose assertions depended on a now-hidden row rendering, each preserving
  its original intent (see the worklog for the per-test rationale).
- Add a dedicated task-65 block covering the brief's required cases plus the two next-step shapes that
  would otherwise lose coverage.

## The four owner rulings this implements (not reopened)

1. Keep the roll-up totals line. 2. Hide `➡️ Moved` too. 3. Drifted rows stay visible — filter on
**reconciled** state, not the raw marker. 4. Replace, don't switch — no `full`/`all` toggle.

## Verification

- `npm test` green.
- `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md`: no clean Done/Cancelled
  rows; roll-up **byte-identical** to the pre-change baseline; tasks 59/60 still render on their
  `cancelled-without-date` nonconformance.
- Mutation check: disabling the filter, and filtering on the raw marker, must both go red.
- Grep SKILL.md for residual "shows every row" claims and for any introduced output-variant keyword.

## Scope boundary

Only `claude/` sources are edited — the `.claude/` copies are gitignored and init-regenerated. No
launcher change, no `skills-for-role.sh` change, no scaffold copy of this skill exists, no wiki write.
