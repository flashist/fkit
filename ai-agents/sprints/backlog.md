# Backlog — the default home for unsprinted task briefs

**This is not a sprint.** It is the standing board for work that has been scoped into a brief but not
yet scheduled into one. A brief written with no sprint named lands here, and stays here until someone
pulls it into a sprint.

**⚠️ The filename is deliberately `backlog.md`, NOT `sprint-backlog.md`.** `/fkit-status` resolves the
active sprint by globbing `sprint-*.md` at the top of `ai-agents/sprints/`. This file does not match
that glob, and that is the whole mechanism by which the default status run ignores the backlog. Rename
it into the glob and every `/fkit-status` call starts reporting unscheduled work as if it were the
active sprint. **Do not "normalize" this name.**

## How work moves on and off this board

- **On:** `/fkit-task-brief` with no sprint named files the brief with `## Sprint: Backlog` and adds a
  row here (creating this file if it is absent).
- **Off:** when the **producer** pulls a task into a sprint, **three** edits, all mandatory: add the
  row to that sprint plan; flip the row here to `➡️ Moved to [Sprint N](sprint-N.md) — priority M`
  (the canonical marker — `M` is the priority the task gets in Sprint N, and the `— priority M`
  component is **not** optional here); **and update the brief's own `## Sprint` to `Sprint N`.**
  The row here is **not deleted** — a deleted row loses the pointer to where the work went.
  > **⚠️ Skip the brief-side update and the row never goes away.** Drift rule 2 compares the `Moved`
  > target against the brief's `## Sprint`; a mismatch is `drift disagreement`, and a drifted row
  > always renders. Every pulled task would leave a permanent drifted row on this board.
- **Closed here:** a backlog task can be completed or cancelled without ever joining a sprint.
  `/fkit-task-done` / `/fkit-task-cancelled` already sweep `ai-agents/sprints/` recursively, so they
  find and flip rows in this file unchanged.

## Priority

**The Priority column reads `—` by design: this board is unranked.** Ranking is what a sprint is for.
A number here would be a commitment nobody made — and the briefs themselves record `## Priority:
Unscheduled` to match (some add a free-text qualifier after it, e.g.
`Unscheduled — high-value (…)`; that is the brief's own note and **never** becomes a number in this
column). If a task needs a rank, that is the signal to pull it into a sprint, not to number it here.

## Status

| Status | Priority | Task | Brief |
|---|---|---|---|
| 🔲 Backlog | — | Add a worked example to `evidence-before-assertion.md`, drawn from task 36 | [`add-worked-example-to-evidence-before-assertion.md`](../tasks/backlog/add-worked-example-to-evidence-before-assertion.md) |
| 🔲 Backlog | — | Decide whether fkit needs a dedicated e2e-tester agent | [`decide-whether-fkit-needs-a-tester-agent.md`](../tasks/backlog/decide-whether-fkit-needs-a-tester-agent.md) |
| 🔲 Backlog | — | Extend `prove-red.sh` to reach `fkit-claude-init.sh` (add the missing test seam) | [`extend-prove-red-to-reach-init.md`](../tasks/backlog/extend-prove-red-to-reach-init.md) |
| 🔲 Backlog | — | Gate the read-side symlink hazard when init reads inside `ai-agents/` | [`gate-read-side-symlink-hazard-in-init.md`](../tasks/backlog/gate-read-side-symlink-hazard-in-init.md) |
| 🔲 Backlog | — | Gate the symlink escape when init writes the `.fkit/interview` intake | [`gate-symlink-escape-in-init-intake-write.md`](../tasks/backlog/gate-symlink-escape-in-init-intake-write.md) |

## Notes

- **Backfilled 2026-07-18** (task 67) from the five briefs then carrying `## Sprint: Backlog
  (unsprinted)`. Before this board existed, unsprinted work had a brief but **no row anywhere** — it
  was invisible to every board-driven view.
- **Known drift, reported not repaired:** `gate-read-side-symlink-hazard-in-init.md` has **no
  `## Status` section**, so `dashboard.sh` reports `brief-missing-status` against its row. The board is
  correct; the brief is incomplete. Fixing a brief's own fields is the producer's call.
