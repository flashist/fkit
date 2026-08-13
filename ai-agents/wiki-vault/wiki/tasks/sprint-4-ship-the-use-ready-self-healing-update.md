# Sprint 4 — Ship the use-ready self-healing update

**Source**: `ai-agents/sprints/done/sprint-4.md`
**Status**: done — 🔒 **CLOSED 2026-08-10 by owner ruling**, archived at `sprints/done/sprint-4.md`
**Sprint/Tag**: Sprint 4 · opened 2026-08-07 · closed 2026-08-10 · **8 done · 0 cancelled · 0 moved · 0 open**

## Goal

Ship the **use-ready fkit**: the post-update structure check and its consent-gated self-heal path,
per the `0241` design. The owner's stated purpose, verbatim: *"the main purpose of the sprint is to
built the use-ready fkit version that can self-heal / fix migration issues during update."*

Opened by **three owner rulings of 2026-08-07** (`AskUserQuestion`, live `fkit lead` session, option
labels verbatim): scope **"Chain-only: 0242–0249 (Recommended)"**, board **"Open Sprint 4
(Recommended)"**, goal wording **"Keep as proposed (Recommended)"**.

## Key Changes

Eight rows, one dependency chain, all shipped:

| Rank | Task | What landed |
|---|---|---|
| P1 | `0242` | The **companion ADR** licensing consent-gated repair → [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]] |
| P2 | `0244` | The **hash-manifest generator** + completeness test — the determination layer |
| P3 | `0243` | The **structure-spec `.md`** in the install share + its scaffold-inventory drift test |
| P4 | `0245` | The **producer-owned structure-check skill** — read-only in every branch |
| P5 | `0246` | The **consent-gated repair path** — the sprint's headline capability |
| P6 | `0247` | The **launch-time structure notice** + per-path intent-file suppression |
| P7 | `0248` | **Docs** — `architecture.md`, `README.md`, scaffold pointers |
| P8 | `0249` | **Wiki ingest** of the design report + companion ADR (ADR-005 split from `0248`) |

Ranking honored every declared dependency edge; the board opened with no closed rows, so every rank
was assigned freely on merit.

## Outcome

**Drained, then archived — a plain close, not a rollover.** No open row moved anywhere and not one
`P<n>` was renumbered. Archiving before Sprint 5 opened is what kept exactly one active board.

### ⛔ ARCHIVED UNVERIFIED — read this before citing any row as evidence

The board reads **8 of 8 `✅ Done`**, and **every one of those eight closes carries
`(agent-closed — not owner-verified)`. No human has checked any of them.** The owner's 2026-08-08 note
recorded `0245` and `0246` as being personally verified; **that verification did not complete and no
verification is recorded anywhere for any row on this board.** The markers stay on every row by owner
ruling — *the record stays honest about what was never checked*. ⛔ **Do not "clean up" those
markers**: they are the marker [[decisions/adr-025-spawned-agents-may-invoke-the-task-movers]]
introduced as its honesty condition and
[[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] deliberately kept.

### ⚠️ The real-project stale-install test was NOT run — the gate was lifted, not met

The owner's 2026-08-08 ruling gated Sprint 5 on that test reporting. On 2026-08-10 the owner **lifted
the gate rather than satisfying it**, because a downstream project running fkit `0.2.1` filed a real
defect and the fix became the priority. **So nothing this board shipped has been exercised outside
this repo.**

**The verification promise has a home that discharges it** — owner ruling 2026-08-10, verbatim
**"0262 replaces it — record that (Recommended)"**: task `0262` (Backlog board) carries `0245`'s and
`0246`'s own fifteen verification steps as its acceptance criteria, and **discharges the promise on
completion**. ⛔ **This changes nothing about the markers**: `0262` completing does **not**
retroactively verify any row, and nothing may be edited to suggest it does. ⚠️ `0262` is deliberately
unscheduled and **not a release gate** — *until it runs, the promise is assigned, not met*.

### The archival was executed by an owner ruling of 2026-08-10

Verbatim option label **"Archive it now, unverified"**. Executed by a spawned `fkit-producer` with no
owner channel, which asked nothing and decided nothing beyond the mechanics.

⚠️ **Archived, not frozen.** Sprints 1, 2 and 3 were each edited after archiving. **A dated correction
appended is legitimate; a silent rewrite of a rank or a status is not.**

### The wiki debt this board recorded against itself

The archival banner flagged, correctly, that **a wiki re-sync was owed and not performed** — the
producer wrote nothing in the vault, which is right (ADR-005). It named two classes: four pages
already stale from the Sprint 3 archival, and **the vault having no page for Sprint 4 or Sprint 5 at
all**. ✅ **Both classes are discharged by the 2026-08-13 sync** — this page and
[[tasks/sprint-5-fix-what-a-real-project-found]] exist, and the index no longer calls Sprint 3 active.

## Related
- [[tasks/sprint-5-fix-what-a-real-project-found]] — the board that supersedes this one
- [[tasks/sprint-3-close-the-rank-integrity-loop]] — the board this one follows
- [[tasks/design-the-post-update-structure-check]] — the `0241` design every row implements
- [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]] — `0242`'s deliverable, the licence the board runs on
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the invariant left unchanged for the unattended path
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — why the wiki half split out of `0248` into `0249`
- [[tasks/record-the-companion-adr-licensing-the-consent-gated-structure-repair]]
- [[tasks/author-the-structure-spec-and-its-scaffold-inventory-drift-test]]
- [[tasks/build-the-hash-manifest-generator-and-completeness-test]]
- [[tasks/build-the-producer-owned-structure-check-skill]]
- [[tasks/build-the-consent-gated-repair-path-inside-the-check-skill]]
- [[tasks/add-the-launch-time-structure-notice-and-intent-file-suppression]]
- [[tasks/update-the-docs-for-the-structure-check-capability]]
- [[tasks/wiki-ingest-of-the-structure-check-design-report-and-companion-adr]]
- [[systems/launch-convergence-and-init]]
- [[systems/install-and-self-update]]
- [[systems/fkit]] · [[tasks/decide-whether-sprint-2-rolls-over-to-a-fresh-board]] — ⚠️ **this board was a PLAIN CLOSE, not a rollover**, so `0185`'s machinery was not exercised a second time
