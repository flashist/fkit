# Research and decide how fkit runs a sprint retrospective, and how the lead suggests one

**Source**: `ai-agents/tasks/done/0500-research-and-decide-how-fkit-runs-a-sprint-retrospective/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 12 · `P9` · task `0500` · owner `fkit-producer` · decided 2026-10-20

> ⭐ **Ingested 2026-10-23** (sync `96c7263`→`5ccf2c2`), with its two evidence reports: `ai-agents/knowledge-base/reports/2026-10-20-recommendation-sprint-retro.md` (the producer's combined recommendation, status *open*, the owner's ruling recorded in the brief, not there) and `ai-agents/knowledge-base/reports/2026-10-20-eval-sprint-retro-evidence-home-and-role-fit.md` (the architect angle). No page of their own: they are this task's evidence.

## Goal
A research-and-decide task, investigation first: how fkit runs a sprint retro (format, owning role, output home, evidence) and how the lead suggests one. Three angles — producer (product and process practice, with web research), architect (evidence, home, role-lock fit), coder (tooling feasibility, a read-only consult whose text reached the report only as the lead's summary). Ends in an owner decision, then the producer files the build and trial briefs.

**Prior art added 2026-10-16:** a consuming project (geoconflict) ran a Sprint 8 retro and wrote it up as feedback for fkit — read as external data. It kept who-said-what apart, measured an "at a glance" table, and produced three fkit briefs (`0522`, `0523`, `0524`) plus a narrowing of `0383`. It raised a new question: **how does fkit feedback from a consuming project reach fkit?**

## Key Changes
**The owner's rulings, 2026-10-20** (`AskUserQuestion`, `fkit lead` session, labels verbatim as relayed):
0. *"Start 0500 as research (Recommended)"* — the start word.
1. *"Lead runs it (Recommended)"* — the owner stays in the lead session; producers read evidence and file briefs behind the scenes.
2. *"One form, ~10 min (Recommended)"* — covers the sprint just closed, or all since the last retro.
3. *"Drop both for v1 (Recommended)"* — no skill-text tests and no helper script (in line with [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]]); only the role→skill list test is updated. This **overrides** the brief's earlier *"tests that pin the skill text"*.
4. *"Separate fkit file (Recommended)"* — a retro tags findings; only the fkit part goes in its own **public-safe** file the owner carries over.
5. *"Backlog board (Recommended)"* — where the build and trial briefs go.

**Agreed by the research, not separately asked** (recorded as such, not as rulings): output home `ai-agents/knowledge-base/reports/YYYY-MM-DD-retro-sprint-<N>.md`, nothing written beside or onto the closed board; **at most 3** owner-picked action items, filed by a spawned producer and recorded by task ID; the previous retro's actions followed up first; offered **once** after a **verified** sprint close, declinable, never at the ship loop's *"Sprint shipped"* state, never run automatically; **one ADR** records it all.

## Outcome
- **Five briefs filed 2026-10-20 on the Backlog board** (open, not ingested): `0531` the ADR (architect) → `0532` build the lead-owned `/fkit-retro` skill → `0533` the once-only offer and `0534` the public-safe fkit-feedback file → `0535` the trial and keep/change/drop. This task now blocks `0531`.
- ⚠️ **Not filed, left for the owner to raise:** the architect's candidate to save the ship loop's sprint roll-up to disk, which would make the `NEEDS-DECISION` and blocked-run signals measured rather than partial.
- **Caveat on the evidence:** the architect's `/fkit-evaluate-approach` Step 1 (the owner-priorities interview) did not run — no owner channel in a spawn; the coder angle is the lead's relayed summary, two claims spot-checked.

## Related
- [[decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only]] — why v1 has no skill-text tests
- [[tasks/answer-a-question-typed-into-a-question-dialog-in-full-and-do-not-re-ask-in-the-same-turn]] — `0504`, which already made "Explain more, then ask again" fkit-wide, so the retro did not ask it again
- [[tasks/record-every-owner-question-and-decision-and-count-autonomous-tasks]] — `0482`, whose Phase B briefs `0485`–`0491` (ADR-053 owner-involvement capture) the brief names as future retro evidence, not required
- [[tasks/sprint-12-set-a-nine-backlog-tasks-goal-not-set]] — the board
