# Refresh `architecture.md` for ADRs 026–030 and the eighth role

**Source**: `ai-agents/tasks/done/0067-refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 · ID **0067** · priority 82 · owner fkit-architect

## Goal
Bring the canonical architecture document current. **It was factually wrong about the shape of the team** — the reason this was sprinted rather than parked: *"a stale citation list is a maintenance chore, but a wrong role count is a claim every future run reads as ground truth."*

Measured (not carried from a standing flag — `evidence-before-assertion`): `architecture.md` cited up to **ADR-025**; **ADR-026, 027, 028, 029, 030 were absent** — five past the high-water mark, all five on disk. And §4.1 asserted **seven roles** while ADR-028 had authorized an eighth.

## Key Changes
- **ADR coverage extended to 030.** The doc now references ADR-002 through ADR-030 (verified: the high-water mark is now 030), including the task-folder model (029), the turn-completion hook (030, decided-not-built), and the tombstones 023/024/026.
- **The role count reframed, not just bumped:** *"seven built roles; an eighth (a sandboxed e2e tester) is a decision taken (ADR-028) and not yet built"* — with an explicit callout that `claude/agents/` holds seven files and no tester among them. **Accurate in both the seven-today and eight-someday worlds.**
- This is the **doc-refresh half** of the ADR-028 fallout; the `PROJECT.md` half was split into task 83 per ADR-028:154 (the brief is the product document, not the architect's).

## Outcome
Done. **Closes a flag the wiki carried across four consecutive syncs** — that `architecture.md` recorded no ADR past 025 and its "seven roles" lines were falsified by ADR-028. Re-verified 2026-07-22: the coverage and the eighth-role framing are both present. The vault's own now-stale *"architecture.md is behind"* notes are corrected in this same sync.

## Related
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — the eighth-role authorization the doc now records
- [[tasks/amend-project-brief-for-the-eighth-role]] — task 83, the `PROJECT.md` half split from this one
- [[tasks/refresh-architecture-docs-for-tool-relaxation]] — task 58, the earlier (ADR-022) architecture refresh whose "behind again" flag this closes
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] · [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — among the ADRs newly cited
- [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]] — task 81, which carried the installer role-count half (Part D)
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
