# Amend the product brief for the eighth role — `PROJECT.md:8,72`

**Source**: `ai-agents/tasks/done/0015-amend-project-brief-for-the-eighth-role/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 · ID **0015** · priority 83 · owner fkit-producer

## Goal
Correct `PROJECT.md`'s two seven-role assertions after [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] authorized an eighth: `:8` (*"a team of seven role-scoped AI agents…"*) and `:72` (the *"solid working set of seven roles … not breadth"* constraint under Stage: Prototype).

**Split out of task 82 by owner ruling, per ADR-028:154** — the brief is the **product document**, the producer's to own, not the architect's who owns `architecture.md`.

## Key Changes
- **`:8`** now reads seven role-scoped agents **with an eighth (a sandboxed e2e tester) authorized but not yet built — the team is seven today.**
- **`:72`** — the *"not breadth"* constraint was **the owner's own constraint that ADR-028 knowingly reversed.** It now reads *"no longer breadth-constrained — it grows when a capability gap justifies a new role,"* naming the authorized-but-unbuilt eighth. Reversed on the record, not dropped.

## Outcome
Done. **Closes the wiki's longest-standing carried flag** — that `PROJECT.md:8` and `:72` asserted a shape the owner had already reversed by his own ruling. Re-verified 2026-07-22 in the source. Together with task 82 (`architecture.md`) and task 81 Part D (the launcher's role-count literal, **deliberately removed** so no count can go stale), every place the "team of seven" was hard-asserted is now corrected — the vault's own now-stale *"still assert seven / now false"* notes are fixed in this same sync.

## Related
- [[decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester]] — the authorization this records; follow-up 1 named this amendment
- [[tasks/refresh-architecture-docs-for-adrs-026-030-and-the-eighth-role]] — task 82, the `architecture.md` half this split from
- [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]] — task 81, whose Part D removed the launcher's seven-roles literal entirely
- [[tasks/decide-whether-fkit-needs-a-tester-agent]] — the ruling (ADR-028) behind all three doc fixes
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
- [[tasks/refresh-architecture-docs-for-tool-relaxation]] — related
