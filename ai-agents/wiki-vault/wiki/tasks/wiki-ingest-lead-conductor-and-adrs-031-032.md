# Wiki ingest — ADR-031/032, the design report, and the evolved lead role

**Source**: `ai-agents/tasks/done/0117-wiki-ingest-lead-conductor-and-adrs-031-032/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0117` · priority 99 · owner `fkit-wiki`

## Goal

Ingest the lead-conductor change into this vault: ADR-031, ADR-032 (the **amended** one), the design report behind both, and the evolved lead-role description on [[systems/fkit]]. From the approved design §11 (T8). Filed for `fkit-wiki` because the vault has exactly one write gateway.

## Key Changes

**The scope was narrowed BEFORE any write, on an owner ruling — and the narrowing is the interesting part.** All three stated deliverables were **already in the vault**, landed days earlier by the 2026-07-26 sync, which had run ahead of this task's row. Rather than re-ingest, a gap analysis found **three design-report sections that had never landed anywhere**, and the owner approved ingesting only those. ADR-031, ADR-032, `systems/fkit` and [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] were **deliberately left byte-unchanged**.

The three gaps, and why each mattered:

1. **The declined "split" alternative** (design §12) — **zero prior hits vault-wide.** The vault recorded the plan-gate downgrade as the arc's top accepted cost but **nowhere recorded that a structural alternative existed**: keep implementation in a `fkit coder` session and orchestrate only review/close/relay, which *preserves* plan mode's real write-wall. The owner declined it **knowingly**, choosing single-point-of-interaction over the structural gate.
2. **The two binary probes** (design §13). Probe 1 — *can a spawned coder plan **and write source**?* — came back **NO** and **blocked task 0111**. Probe 2 — the `NEEDS-DECISION` → driver → `AskUserQuestion` round-trip — has **no record of ever being run**.
3. **§14 Q1**, which probe 1 answers.

**The substantive find: the `fkit-coder.md` declared-approval-marker carve-out was entirely absent from the vault.** Probe 1's NO forced it — a spawned coder refuses implementation, so the loop could not build. Resolved over two review rounds (R1, then R4 extending it to the Process-review worker). It is **three prose signals in a spawn prompt — trust, not proof**, carrying the same accepted cost as the plan step's *"write nothing yet"*.

Pages updated: [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] (an *Alternatives weighed* table + the two-probe status block), [[tasks/build-fkit-sprint-ship-loop-skill]] (probe 1 and its two-round resolution), [[systems/testing-and-verification]] (probe 2 named as an outstanding obligation), and one `index.md` line.

## Outcome

Verification steps 1–3 were satisfied **by the earlier sync, not by this task** — recorded that way rather than claimed. Step 4's clean lint was satisfied twice: a vault-wide pass at 161 pages during the run, then **re-established after the fact**, because the first measurement predated commit `fd3bc61` (74 vault files landing from outside the ship loop). The re-run found and fixed 4 issues and confirmed **0 broken links · 0 one-way links · 0 index gaps · 0 dangling entries · 0 template drift · 0 secrets**, plus a 33 ↔ 33 ADR number/slug cross-check.

- **The block nobody was tracking.** 0117's brief made task `0118` (the ADR-032 amendment) a hard precondition so the vault would not ingest a stale ADR-032. **0117 shipped first anyway**, under an owner ruling, with a `⚠️ STALE` banner on the ADR-032 page standing in for the missing text. Task `0149` exists to record that discharge without deleting the stale prediction.
- **Two follow-on flags this run raised and could not close:** probe 2 still has no record of ever being run — *and it is the load-bearing mechanism of the whole orchestration design* — while probe 1 was settled by a reviewer **reading a contract file, not measuring the running binary**; and two pre-existing one-way links were left because reciprocating them fell outside the approved surface (later fixed by the follow-up lint).
- **The task closed `agent-closed — not owner-verified`.** Per ADR-033 the wiki closes nothing itself — it flagged *ready to close* and a producer ran the mover.

## Related
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the conductor reversal this ingested
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the loop ADR, whose missing amendment this run recorded as a staleness banner instead
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] — the design report; this task ingested its §12/§13/§14 Q1 gaps
- [[tasks/build-fkit-sprint-ship-loop-skill]] — where probe 1's NO and the carve-out's two-round resolution are recorded
- [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] — deliberately left byte-unchanged by this run
- [[tasks/record-adr-032-sprint-ship-loop-autonomy-amendment]] — task 0118, the amendment this task's brief made a precondition and which landed *after* it
- [[tasks/track-fkit-coder-declared-approval-carve-out]] — task 0119, the carve-out this run found missing from the vault
- [[systems/testing-and-verification]] — where probe 2's outstanding obligation is filed
- [[systems/fkit]] — the lead-role description this task verified rather than rewrote
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — why the wiki flagged its own task ready to close instead of closing it
- [[tasks/sprint-2-remove-omnigent]] — the sprint carrying this task
