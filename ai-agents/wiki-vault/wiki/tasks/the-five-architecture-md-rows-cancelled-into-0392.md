# The five `architecture.md` rows cancelled into `0392` on 2026-09-13 — re-scoped, not dropped

**Source**: `ai-agents/tasks/cancelled/0251-refresh-architecture-md-section-9-test-suite-inventory/brief.md`; also `cancelled/0286-mechanical-citation-sweep-of-architecture-md/brief.md`, `cancelled/0323-re-sweep-the-adr-line-citation-class-case-insensitively-and-repair-adr-013s-drifted-pointers/brief.md`, `cancelled/0366-re-verify-and-correct-architecture-mds-9-5-residual-drift-bullets/brief.md`, `cancelled/0376-rewrite-architecture-md-section-9-1-occurrence-b-the-four-falsified-ci-clauses-0312-left-undone/brief.md`
**Status**: cancelled — each `⛔ Cancelled (agent-closed — not owner-verified) (2026-09-13)`, *"Consolidated into task `0392`"*; every one says **"Re-scoped, ⛔ not done and ⛔ not abandoned"**
**Sprint/Tag**: Backlog board, unranked · consolidated by owner ruling 2026-09-13, verbatim *"Consolidate into one brief (Rec)"*

> ⭐ **Ingested 2026-10-24 by task `0380`** (the closed-task backlog Sweep C bounded out). One page because
> one ruling closed all five, for one reason. Where their work actually landed is
> [[tasks/architecture-md-prose-repair-9-1-inventory-occurrence-b-and-9-5]] (`0392`) and
> [[tasks/the-two-citation-sweeps-architecture-md-and-the-repo-wide-adr-line-class]] (`0393`).

## Goal
Five separate rows, filed 2026-08-07 → 2026-09-04, that each wanted to make `architecture.md` (or the
citations into it) true again. They overlapped: the three prose rows move the very line numbers the
citation sweep (`0286`) is about.

## Key Changes
| Task | What it wanted | Why it was filed | Became |
|---|---|---|---|
| `0251` | Rebuild §9.1's test-suite inventory from disk — it said *"eight `node --test` contract suites"* when there were **19** | Owner ruling at `0248`'s plan gate, 2026-08-07, *"File separate task (Recommended)"* | `0392` Group A + open decision OD1 |
| `0376` | Rewrite §9.1 **occurrence B** — four falsified CI clauses (*never observed green*, *lands unpushed*, *only ever run on darwin*, the dash risk as live) | Owner ruling N1, 2026-09-04: `0312` closed on occurrence A alone, and without this row the clauses would have had **no carrier** | `0392` Group B; its item 6 (re-pointing `0251`) discharged by construction |
| `0366` | Correct §9.5 *"Residual drift"* — the section about drift had itself drifted | Authority is `0286`'s prose fence as applied in Sweep A (⚠️ **no owner ruling**, the brief says so). Sweep A found two false bullets; the filing producer found a **third** (ADRs 003/004/006/007 called `accepted` — all four read `superseded`) | `0392` Group C + OD2 |
| `0286` | A mechanical sweep of every `:NNN` citation in `architecture.md`, outbound **and** inbound | Driver-filed 2026-08-13 after `0257`; ⚠️ **no verbatim owner ruling attaches to it** | Half A repaired inside Sweep A; half B (~230 inbound citations, ~60 files) and the per-citation census carried to `0393` Group D + OD3 |
| `0323` | Re-run the `ADR-NNN:LINE` citation sweep **case-insensitively** — `0171`'s lowercase pattern missed `ADR-013`'s pointer into ADR-010 | Owner ruling 2026-08-22, *"File it — re-sweep case-insensitively (Recommended)"* | Ruled out of Sweep A (its census was re-measured at **402**, not 351); carried to `0393` Group E + OD4 / OD5 |

⭐ **The lesson `0323` carried, in its own words:** *"A citation form is only as good as the pattern that
finds violations of it."* Its whole cause was a case-sensitive search.

## Outcome
- **Consolidation was the owner's, not a producer's.** An earlier producer surfaced the merge and
  correctly refused to do it unasked; the owner then ruled it, and a second ruling the same day split the
  citation sweeps (`0286`, `0323`) out to `0393`.
- ⛔ **The five briefs stay cancelled and frozen.** `0392` and `0393` cite them as provenance only —
  their scope is not dropped, and a reader must not take "cancelled" here to mean abandoned.
- ⚠️ **The ruling is not a general licence** to merge or split briefs on a producer's own judgement.

## Related
- [[tasks/architecture-md-prose-repair-9-1-inventory-occurrence-b-and-9-5]] — `0392`, where `0251`, `0376` and `0366` landed
- [[tasks/the-two-citation-sweeps-architecture-md-and-the-repo-wide-adr-line-class]] — `0393`, where `0286` and `0323` landed
- [[tasks/correct-the-false-ci-has-never-run-claims-in-architecture-md]] — `0312`, whose undone occurrence B became `0376`
- [[tasks/sweep-a-the-citation-rot-class-one-verified-pass]] — where `0286` half A was done and `0323` was ruled out
- [[tasks/sweep-a-members-the-ten-citation-rot-rows-and-0349]] — the rows Sweep A did absorb
- [[tasks/sprint-9-settle-architecture-mds-truth-and-sweep-the-citation-rot]] — the board `0392` and `0393` ran on
- [[tasks/write-the-durable-citation-anchors-convention-page]] — `0171`, whose case-sensitive sweep `0323` exposed
- [[systems/testing-and-verification]] — the §9.1 test inventory `0251` wanted rebuilt
