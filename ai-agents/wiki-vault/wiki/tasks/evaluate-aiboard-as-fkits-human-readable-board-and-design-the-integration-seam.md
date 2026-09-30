# Evaluate aiboard as fkit's human-readable board, and design the fkit↔aiboard integration seam

**Source**: `ai-agents/tasks/done/0404-evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-09-20
**Sprint/Tag**: Sprint 11 · `P2` · task `0404` · owner `fkit-architect`

## Goal
Filed 2026-09-18 as a **transcript rescue**: nothing in `ai-agents/` mentioned aiboard before it (a
recursive search returned zero files), and the owner's description of aiboard existed only in a live
`fkit lead` session. He described it as *"Jira for AI agents"*, born from the realisation that *"it's hard
for humans to understand the status of the sprint and tasks"*. The owner's architectural intent at filing
time: **aiboard is a dependency fkit consumes, usable without fkit — the arrow points one way.**
⚠️ *That constraint was later dropped by [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] (ADR-049 C4).*

## Key Changes
- **The evaluation happened in the knowledge base, not in code:** a data-model evaluation written for an
  external expert (`reports/2026-09-18-fkit-aiboard-data-model-evaluation-for-an-external-expert.md`,
  reviewed by Codex), the external expert's verdict
  (`reports/2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md`), and ADRs
  [[decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one]],
  [[decisions/adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed]] and
  [[decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim]].
- **The expert's 129-line read-only spike** is preserved in this task's folder at
  `assets/external-expert-spike/` (README: *"THROWAWAY SPIKE — a demonstration, not a component"*),
  together with the audit scripts behind ADR-049's C5 figures.
- ⭐ **First real user evidence, 2026-09-18 — the owner's own typed words** (canonical record on this
  brief): *"When I open .md files the text is hard to read and is too huge to consume, the board allows me
  to see the titles and descriptions in a more readable way. When I ask agents in terminal about providing
  me the status of the sprint/tasks — it's also kind of hard to read when there are a lot of tasks and
  texts."* A verbatim duplicate sits on `0405`; this brief's copy is canonical.
- Re-scoped the same day by the convergence ruling into **Track 1 — "A now"** (the interim read-only seam).

## Outcome
- **Closed 2026-09-20 on an owner ruling** (selected option text): *"Close 0404, file the reader as its own
  task — The evaluation happened and produced three reports plus an accepted ADR — 0404's stated
  deliverable exists."* The brief's two carriers disagreed about what the task was (evaluation vs. building
  the reader); the code half became `0411` →
  [[tasks/make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads]].
- ⚠️ **Folder move cost, flagged in ADR-049:** the spike folder travelled from `backlog/` to `done/` with
  this close; inbound links in the verdict's §8 and in ADR-049's *Related* still cite the old
  `tasks/backlog/0404-…` path (source files outside the vault — reported, not repaired here).
- ⭐ **Recorded lesson from its own history:** a producer scoped out of `decisions/` wrote *"An ADR
  recording this ruling — it does not exist"* while ADR-051 existed — the struck text is kept as the record
  that **an agent barred from a directory cannot tell "absent" from "invisible."**

## Related
- [[tasks/sprint-11-fkit-aiboard-convergence]] — the board it ran on
- [[decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim]] — the ruling this evaluation produced
- [[decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one]] · [[decisions/adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed]]
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — the final decision; keeps `0404`-style ids (R5: *"Keep 0404"*)
- [[tasks/make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads]] — the code half, split out as `0411`
