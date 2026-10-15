# Tidy fkit's documents after ADR-052 (machine paths, stale pointers, ADR-049 OQs)

**Source**: `ai-agents/tasks/done/0472-tidy-fkits-documents-after-adr-052-machine-paths-stale-pointers-adr-049-oqs/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 10 `P7` (filed on the Backlog board 2026-09-30) · task `0472` · owner `fkit-coder`

## Goal
[[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] left
small loose ends in fkit's own documents — pointers or status words now wrong, and machine-specific paths that
do not belong in git. **The rule for every item: minimal and mostly additive** — a dated note added, or a single
token replaced; archived and decision text otherwise word for word. Grew from five items (rulings R1–R5,
2026-09-30) to eight (R6/R7 on 2026-10-02, R8 on 2026-10-05).

## Key Changes
1. **Two absolute machine paths replaced** with *"the sibling aiboard repo"* (R1): Sprint 11's decision row D3,
   and ADR-051 §Decision item 1. ⛔ Other hits of the same pattern were **owner-excluded** (R4: *"No, just the
   two"* — historical working files, not secrets).
2. **The 2026-09-26 evidence log marked closed by ADR-052** — kept, not deleted. Its E3 cell keeps **Open** as the
   2026-09-26 reading with a dated annotation (`0413` cancelled 2026-09-30), because the log is append-only (R3).
3. `0415`'s brief: a dated note that `0413` was since cancelled (*"still Backlog"* was true when written).
4. **`0404` spike pointers repointed** from `tasks/backlog/` to `tasks/done/` in ADR-049 (its own
   *"a future mover must repoint"* warning now discharged), and the visible link text fixed in the 2026-09-18
   verdict and ADR-051 (R5).
5. **ADR-049's OQ-1 and OQ-2 marked resolved by ADR-052** (R2) — both rested on C4, which ADR-052 drops.
6. ⭐ **The records that blamed commit `331f298` corrected (R6).** Git shows the 2026-07-21 folder migration
   only **renamed** the three briefs (`0014`, `0021`, `0041`), content unchanged (R100). `0021`/`0041` were
   **created in `backlog/` already reading `🔲 Backlog`** and the owner's close commits moved them unedited;
   `0014` was created inside `done/` reading `🔲 Backlog`. So **wrong:** "born wrong in the migration"; *"at close
   time there was no `## Status` field"* (it existed); **"59 days"** (really **70** for `0021`/`0041`, **64** for
   `0014`); **3.75% / 2.97% as a "migration error rate"** (the migration wrote none). Dated correction notes went
   into the 2026-09-18 evaluation and verdict, three 2026-09-30 reports, ADR-033, ADR-049 (its quote stays
   verbatim), ADR-052, and backlog briefs `0407`, `0435`–`0438`, `0440`–`0442`. ⛔ **No original sentence was
   rewritten — quoted text included.** ⚠️ **It reopens no decision:** ADR-052's converter safeguards stand; the
   true precedent that remains is *a duplicated status field went wrong at close or creation and nothing caught it
   for 64–70 days*.
7. **R7 recorded in ADR-033:** `0014`'s `## Status` corrected to plain `✅ Done` on 2026-10-02 — the owner
   confirmed he closed it himself — overriding *"Leave it, pending 0296"* **for that field only**. **The missing
   board row stays** as the specimen for `0296`/`0406`.
8. **A stale line-cite fixed (R8):** `fkit-task-ship-loop`'s ⛔ STOP bullet pointed at `fkit-coder.md:109-113` (the
   skill list) instead of the *"genuinely NEW architecture decision goes to the OWNER"* rule — found by `0480`.

## Outcome
- Per the brief, the ADR notes for items 6–7 were to go through an `fkit-architect` consult (they correct an ADR's own causal story) — ⚠️ the brief states the routing; this page did not check the worklog for the consult itself.
- The owner's ruling on the plan's OQ2 (*"New small tidy task"*) kept this task's scope and filed **`0496`**
  (nine more stale line cites and claims found during Sprint 10; open).
- **Wiki pages repeating the claim** (listed in the brief for a `fkit-wiki` sync) — ADR-033, ADR-052,
  [[tasks/build-fkit-reconnect-tooling]], [[tasks/fix-claude-agents-md-placeholder-text]],
  [[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]] — **corrected with dated notes in the
  2026-10-10 sync**, original lines left byte-identical.

## Related
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — the decision whose loose ends this tidies
- [[decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one]] — OQ-1/OQ-2 resolved; `0404` pointers repointed
- [[decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim]] — machine path and link text
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the addendum's causal story corrected; R7 recorded
- [[tasks/sprint-11-fkit-aiboard-convergence]] — row D3
- [[tasks/keep-a-closed-sprints-tasks-attached-when-its-board-is-named-plan-sprint-n]] — `0415`, annotated
- [[tasks/evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam]] — `0404`, whose spike moved to `done/`
- [[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]] · [[tasks/build-fkit-reconnect-tooling]] · [[tasks/fix-claude-agents-md-placeholder-text]] — the three briefs the R6/R7 story is about
- [[tasks/sprint-10-the-0472-0482-batch]] — `P7`, run after `0476` (same docs)
- *Added 2026-10-10 (sync `3915417`→`79a7dbf`, closing a one-way link):* [[systems/knowledge-base-structure]] — Knowledge-Base Structure
- *Added 2026-10-15 (sync `baf6a4e`→`96c7263`):* [[tasks/fix-nine-stale-line-cites-and-claims-found-during-sprint-10]] — `0496` ✅ closed 2026-10-14: the nine-item tidy this task's OQ2 filed
