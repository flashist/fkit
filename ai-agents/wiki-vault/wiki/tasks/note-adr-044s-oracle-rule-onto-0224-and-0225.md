# Note ADR-044's oracle rule onto `0224` and `0225` — read the producing skill, never grep for skill names

**Source**: `ai-agents/tasks/done/0347-note-adr-044s-oracle-rule-onto-0224-and-0225/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 7 · `P1` · task `0347` · owner `fkit-producer`

## Goal

ADR-044's widest-reach clause was **measured, not estimated**: the skill-less limb of its step-1
predicate reaches **all 13 `## Owner: fkit-producer` Backlog rows**, and ⛔ **eight of those name a
producer-exclusive skill in their text** — `/fkit-status`, `/fkit-task-brief` and others. That is
*"the misroute shape exactly, at scale"*.

⛔ **So a future oracle must read the deliverable's PRODUCING SKILL — never grep the brief for skill
names.** This row writes that rule as a `## Notes` note onto the two open rows that would otherwise
build the oracle the wrong way: `0224` and `0225`.

⚠️ **The rule-cell does not exist in the loop skill yet** — `0345` writes it, and the note states that
dependency rather than assuming it.

## Key Changes

Two notes, one per brief, each carrying the C6 measurement (⚠️ **re-measured before writing** — the
8-of-13 count is dated 2026-08-28) and the same anti-pattern warning.

⛔ **Out of scope by name:** `claude/`, `test/`, any sprint or backlog board row, ADR-038 and ADR-044
themselves.

## Outcome

Closed `✅ Done (agent-closed — not owner-verified)`. ⭐ **`P1` on Sprint 7 — the rank that was owed had
been paid**, updated 2026-08-29.

### ⭐ Why this brief's `## Owner` reads `fkit-producer` while ADR-044 staffs the Build `@fkit-coder`

⭐ **Both are correct, because they answer different questions. This is NOT a routing defect**, and a
reader must not "fix" it.

- ⛔ **ADR-044 §Decision 1 settles it in its own words:** the Build role follows the skill the
  **deliverable** is produced by. `## Owner` is a **proxy, not the thing itself**.
- ⛔ **AND `## Owner` still has a live job that `fkit-coder` would break** — ADR-044 §Decision 4 keeps
  it load-bearing. `dashboard.sh` reads `## Owner` and renders it in the Owner column;
  `/fkit-sprint-ship-loop` **does not read `## Owner` at all**, so the field steers no worker.
- ⛔ **Nothing is mis-routed, and nothing was ever mis-routed.**
- ⛔ **DO NOT "CORRECT" THIS FIELD BY GREPPING THE BRIEF FOR SKILL NAMES.** ⭐ *That is the 8-of-13
  failure this very row exists to warn against.*

⚠️ **Time-sensitivity, stated plainly:** `0224` and `0225` were both `🔲 Backlog` as of 2026-08-28.

- **Depends on:** `0270` — closed.
- **Blocks:** nothing directly — but the notes it writes are what make `0224` and `0225` correct when
  they run.

## Related
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board this row sits on
- [[decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1]] — the
  decision whose oracle rule this note carries
- [[decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs]] — the companion rule
  fixing a loop step's role to the skill it runs
- [[tasks/decide-how-the-ship-loop-handles-a-non-coder-owned-task-row]] — `0270`, the dependency
- [[tasks/design-deterministic-dashboard-for-fkit-status]] · [[tasks/render-owner-column-in-fkit-status]]
  — where `## Owner` is actually consumed
