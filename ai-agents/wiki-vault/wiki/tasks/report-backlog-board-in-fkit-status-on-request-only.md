# Report the Backlog board in `/fkit-status` on request only

**Source**: `ai-agents/tasks/done/0080-report-backlog-board-in-fkit-status-on-request-only/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 68

## Goal
The owner's ruling alongside task 67: `/fkit-status` must **not** report the Backlog board by default — only when asked for it specifically.

## Key Changes
- **Half was already true by construction.** The default (no-argument) run globs `sprint-*.md`; task 67's `backlog.md` deliberately does not match and is never picked up. This task is **the other half** — making `Backlog` a resolvable *named* target, since the skill's named path resolved sprint names against `sprints/` + `sprints/done/` and would otherwise miss or mishandle `backlog.md`.
- **`claude/skills/fkit-status/SKILL.md`** — argument resolution extended: `Backlog` (case-insensitive) resolves to `ai-agents/sprints/backlog.md`. **An absent board reports its absence and lists what exists — it does not create the file** (the read-only contract holds).
- **The beats that presuppose a sprint** (goal, phases, risk) reuse the existing closed-sprint *"say it's moot, don't invent"* pattern — the backlog board is unranked and has no goal line.
- **`dashboard.sh`** confirmed to tolerate the board's `—` priority cells and count the roll-up correctly. Task 67 kept the table format identical precisely so parsing would survive.

## Outcome
Done. **This conforms to one-skill-one-output and needed no reversal ADR** — the sprint-name argument is a **target selector** (which board), not an output variant (how the one board renders). Task 44 removed output variants; the named-sprint argument survived that ruling, and `Backlog` is simply one more value of it. That distinction is the reason this shipped as an argument rather than a switch.

If [[tasks/filter-fkit-status-board-to-open-tasks]] (task 65) applies, its open-work filter covers the backlog board too — done/cancelled rows hidden, drifted rows visible, roll-up kept — with **no special-casing**.

## Related
- [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]] — task 67, the board this reads; a hard dependency
- [[tasks/filter-fkit-status-board-to-open-tasks]] — task 65, whose filter applies here unchanged
- [[tasks/record-one-skill-one-output-convention]] — the convention this argument conforms to
- [[tasks/remove-output-variants-from-fkit-status]] — task 44, which removed output variants but kept the target-selector argument
- [[tasks/build-deterministic-dashboard-script-for-fkit-status]] — `dashboard.sh`, confirmed against the `—` priority cells
- [[tasks/add-status-skill-to-producer]] — the skill's origin
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
- [[systems/knowledge-base-structure]]
