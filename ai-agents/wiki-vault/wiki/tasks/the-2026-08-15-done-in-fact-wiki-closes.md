# The two `DONE-IN-FACT` wiki rows closed 2026-08-15 — `0206` and `0238`

**Source**: `ai-agents/tasks/done/0206-ingest-the-faithful-carry-decision-report-into-the-wiki/brief.md` · `ai-agents/tasks/done/0238-wiki-resync-after-the-sprint-2-archival-and-sprint-3-open/brief.md`
**Status**: done — ✅ **both agent-closed, not owner-verified**
**Sprint/Tag**: Backlog board, unranked · IDs 0206 · 0238 · both owner `fkit-wiki` · closed 2026-08-15

## Goal

Recorded together **because the reason they closed is the finding.** Both were `fkit-wiki`-owned rows sitting open on the Backlog board. Neither was worked in 2026-08-15's sprint: the 2026-08-14 backlog triage classified both **`DONE-IN-FACT`** — the only two of 108 triaged rows to get that verdict — and the owner ruled, verbatim, **"Close both as agent-closed"**.

- **`0206`** — ingest `0162`'s faithful-carry decision report into the vault. Follow-up 8 of that report (§10 row 8).
- **`0238`** — re-sync the vault after the Sprint 2 archival, because it still called Sprint 2 the active board. ⚠️ **Its brief states plainly that it was NOT filed on an owner ruling** — it was the `fkit-lead` session's obvious default, *"recorded here rather than buried so that a later reader does not mistake it for owner-ruled work."*

## Key Changes

**Neither close involved a vault write.** `ai-agents/wiki-vault/` has no `log.md` entry dated after 2026-08-14, and both rows closed on 2026-08-15 — the deliverables were already on disk from earlier runs.

- **`0206`'s deliverable exists and is verifiable:** [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] was created by the 2026-08-03 sync, carries the report's **checkable vs testimony** split, and states the **`carried-not-approved`** residual as **open, structural, and NOT closed by `0202`** — the two things the brief said the ingest's value collapses without.
- **`0238`'s deliverable was overtaken rather than performed as written.** Its acceptance asked the vault to say *"Sprint 3 is the **active** board"*; by 2026-08-15 that was itself false — Sprint 3 was archived 2026-08-07, Sprint 4 and Sprint 5 opened and closed after it. What the brief actually cared about — **the vault no longer calls Sprint 2 active and no longer points at the pre-archival path** — was landed by the **2026-08-07 sync**, which verified it site by site.

## Outcome

**Both closed 2026-08-15**, `✅ Done (agent-closed — not owner-verified)`, by a producer ([[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]]).

⚠️⚠️ **Both closed while this vault's own last word on them was `partial — not ready to close`.** `log.md`'s flag lines say so for `0206` (2026-08-06 sync) and `0238` (2026-08-07 and 2026-08-13 syncs), and the 2026-08-13 entry states explicitly *"`0238` and `0258` were NOT done and their preconditions are named above."* ⛔ **The flag was not withdrawn by the wiki role; the rows were closed on a triage verdict and an owner ruling from outside it.** Recorded as the tension it is, not smoothed over:

- For **`0206`** the outcome is nonetheless right — the deliverable is on disk and meets the brief's two named conditions. The stale flag is a **flag that was never re-run**, not a false close.
- For **`0238`** the close is **defensible on substance and unmet on its literal acceptance text**, because the board reality it was written against moved three times underneath it.

⭐ **The general lesson, and it is the same one `0108` produced:** the vault's completion flag is a line in a report that nothing reads automatically. A flag emitted by a sync in August is not re-evaluated by anything; when a later triage disagrees with it, **nothing reconciles the two.** Whether anything should notice is task `0290`, **open**.

## Related
- [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] — `0162`, the report `0206` was to ingest and the page that discharges it
- [[tasks/investigate-making-wiki-task-completion-visible-to-the-board]] — `0108`, the original of this exact failure: a finished wiki task stuck on the board for a week
- [[tasks/wiki-skills-flag-ready-to-close]] — `0125`, the flag-don't-close convention whose flag went unread here
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — the triage that produced the `DONE-IN-FACT` verdict
- [[tasks/sprint-2-remove-omnigent]] — the board whose archival `0238` was filed against
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — why both rows had to be `fkit-wiki`'s and nobody else's
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — why a producer, not the wiki, did the closing
