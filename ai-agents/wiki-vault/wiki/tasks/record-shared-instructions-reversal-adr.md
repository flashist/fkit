# Record a tombstone ADR for the shared-instructions reversal

**Source**: `ai-agents/tasks/cancelled/0066-record-shared-instructions-reversal-adr/brief.md`
**Status**: cancelled
**Sprint/Tag**: Sprint 2 — priority 37. Cancelled 2026-07-19 — superseded by ADR-016 (duplicate).

## Goal
Record a tombstone ADR for the task-29 shared-instructions reversal — rejecting `ai-agents/AGENTS-COMMON.md` (structurally cannot reach Codex) and `claude --append-system-prompt` (session-only, measured `0/3` then `0/2` into a spawned consult on Claude Code 2.1.208) **by name**, with the version pinned.

## Key Changes
None — no ADR was written, because one already existed.

## Outcome
**Cancelled as a duplicate.** Everything this task asked for was **already recorded as [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] on 2026-07-14 — before this task was scoped.** That was verified against **all five** of the task's own verification steps.

The brief was flagged **⚠️ duplicate — do not implement** and left in `backlog/` until the owner ran `/fkit-task-cancelled`, which happened 2026-07-19. It resolved the sprint's open question OQ6.

**The lesson is a scoping one:** a task was written to produce an artifact that already existed, and it sat on the board for four days before anyone checked. The tombstone's *content* was never in doubt — only whether a second copy of it was needed.

## Related
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — the ADR that already existed, making this task redundant
- [[tasks/add-shared-instructions-layer-for-all-agents]] — task 29, the investigation whose reversal ADR-016 records
- [[tasks/give-codex-the-universal-hard-rules]] — task 30, the live defect that investigation found
- [[tasks/merge-fkit-rules-block-into-existing-root-context-files]] — task 31, the brownfield hole
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
