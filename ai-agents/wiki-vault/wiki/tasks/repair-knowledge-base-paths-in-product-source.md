# Repair the knowledge-base paths in product source

**Source**: `ai-agents/tasks/done/0077-repair-knowledge-base-paths-in-product-source/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 — priority 19 (ADR-013 fallout)

## Goal
Repoint the shipped skills under `claude/` at the new `conventions/` paths after [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]] restructured the knowledge base.

## Key Changes
ADR-013 moved the two standing conventions (`task-status-vocabulary.md`, `status-report-format.md`) out of the knowledge-base root into `conventions/`. **Product source under `claude/` still pointed at the old paths, and two shipped skills were broken by it right now.**

**The failure mode is the dangerous part:** *"They will silently mis-behave rather than fail loudly — a skill that cannot find its contract document falls back to its own inline copy."*

## Outcome
Done. **This is the clearest illustration in the repo of why a doc move is a code change.**

The conventions are **live contracts that shipped skills read at runtime**, not reference material. A restructure that is entirely right at the knowledge-base level still **broke the product**, and broke it *quietly* — falling back to inline copies, **which is precisely the drift this sprint spent itself removing.**

## Related
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]]
- [[tasks/knowledge-base-hygiene-post-omnigent]]
- [[systems/knowledge-base-structure]]
- [[tasks/enforce-task-status-vocabulary]]
- [[tasks/add-status-skill-to-producer]]
