# Wiki sync after the `fkit-task-plan` → `fkit-task-brief` rename

## Sprint
Sprint 2

## Priority
51

## Status
🔲 Backlog

## Context

**Task 50 renames the producer's `/fkit-task-plan` skill to `/fkit-task-brief`.** The wiki vault
carries the old name as verified knowledge — the 2026-07-17 reference sweep found it in 8 pages:
`index.md`, `wiki/systems/fkit.md`, and six task pages (`add-task-plan-skill-to-producer.md`,
`add-status-skill-to-producer.md`, `harden-task-movers-against-closed-sprint-link-rot.md`,
`sprint-2-remove-omnigent.md`, `sprint-1-ship-the-onboarding-sequence.md`,
`design-deterministic-dashboard-for-fkit-status.md`). Some of those hits may be the coder's
`plan-task` — the sync disambiguates, same as task 50 does in source.

**Why a separate task:** only `fkit-wiki` writes the vault (ADR-005) — task 50's coder cannot touch
these pages. **Why sequenced after:** task 11's lesson, re-applied for tasks 44/45 — sync **after**
the change lands, or the vault ingests drift with the authority of verified knowledge.

**Historical accuracy over rewriting:** task pages describing *past* work (e.g. "task 14 added the
`task-plan` skill") were true when written. The precedent is task 45's ruling — mark renamed/reverted,
don't erase. The *living* pages (`index.md`, `systems/fkit.md`) describe the present and simply get
the new name.

## What to build

A `fkit-wiki` sync/ingest pass over the rename:

- Update **living** pages (`index.md`, `wiki/systems/fkit.md`, and any current-state description) to
  the new name `fkit-task-brief`.
- On **historical task pages**, keep the original claims and add the rename note where the old name
  would now mislead a reader (the task-45 mark-don't-delete pattern) — the wiki role's judgment per
  its own lint/ingest conventions.
- Disambiguate: leave every reference to the coder's `fkit-plan-task` untouched.

## Verification steps

- `grep -r "fkit-task-plan" ai-agents/wiki-vault/` returns hits **only** in historical context
  accompanied by a rename note — no living page presents the old name as current.
- References to the coder's `fkit-plan-task` are unchanged.
- The vault's own link integrity holds (the wiki role's lint standard) — no page links broken by the
  update.
- No file outside `ai-agents/wiki-vault/` is modified by this task.

## Notes

- **Owner: fkit-wiki** — the vault's exclusive write gateway (ADR-005).
- **Depends on: task 50 — hard.** Syncing first ingests a name that doesn't exist yet.
- **Blocks: nothing.**
- Sibling in shape to task 45 (`wiki-sync-fkit-status-output-variant-removal`) — if both land close
  together, one wiki session can run both syncs, but they remain separately verifiable.
