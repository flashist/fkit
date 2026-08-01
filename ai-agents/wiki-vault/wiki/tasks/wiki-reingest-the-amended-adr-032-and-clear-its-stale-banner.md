# Wiki re-ingest the amended ADR-032 and clear its now-wrong STALE banner

**Source**: `ai-agents/tasks/done/0148-wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0148` · owner `fkit-wiki`

## Goal

Bring the vault's ADR-032 page up to the **2026-07-22 autonomy amendment** that `0118` landed, and remove the `⚠️ STALE` banner that told readers the amendment did not exist.

The banner was itself a deliberate, owner-authorised widening during `0117`'s review — **a pointer standing in for missing text until it landed.** It had outlived its purpose: a reader who trusted it was told the amendment did not exist, when it did.

## Key Changes

Recorded in the vault's `log.md` entry of **2026-07-29**. Six content pages changed, `+14/−3`.

- The amendment's **A1–A4** carried onto [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] as **two dated annotations**, with `**Status**: accepted` unchanged, **no banner**, and both original claims left byte-identical.
- **A3 must not be softened into a guarantee** — the ADR says so in its own text. Verified by content, not by line range: all four of *"trust, not proof"*, *"no token"*, *"no detection"* and *"do not rewrite this paragraph into a guarantee"* present and byte-identical.
- Sibling pages reconciled where they asserted the amendment was unwritten or that `0118`/`0119` were still open.
- `0126`'s explicit deferral on `adr-032`'s Decision 6 was **discharged, not inherited onward**: inspected, and deliberately left byte-unchanged because ADR-033's amendment is already carried above it, and **banner-above-claim is the correct placement**.

## Outcome

Done, **agent-closed — not owner-verified**.

⚠️ **The brief was wrong on BOTH of its headline claims, and both were false before the task started.** It asserted the vault's ADR-032 page contained the amendment **0** times (it contained it **twice**), and that a `⚠️ STALE` banner claimed the amendment was never written (the single `STALE` hit was the **✅ replacement line** recording the banner it had replaced). Two further deliverables were also already satisfied. **A prior sync had done the work**, and its own completion flag had over-claimed in the opposite direction — right about the two headline deliverables, wrong that it had finished the task; five sibling sites survived it.

This is the third instance of the chain's most reliable finding: **a completeness claim made by the run that would benefit from it has been wrong every time — three for three** (`0126`, `0141`, `0148`).

The task self-caught two false-clean defects in its own work before returning — a **line-shift artifact** nearly reported as a content change, and a **grep filter that dropped every changed `index.md` line because index entries begin with `-`** — and still shipped six findings to review, two of them the same self-invalidating-measurement class. **The durable lesson: every claim in a record must be re-measured *after* the record is written, because writing the record changes what the claim measures.**

⚠️ **This task's own completion flag became a decision specimen.** It carried a stale board rank and cited the wrong `sprint-2.md` line twice — pointing at a **different real task's row**. Only an out-of-band correction from the driver stopped the closing producer editing the wrong row. That near-miss became **Case 4** of [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] (`0160`), whose finding is quoted from this run: ***"the mandated content was never wrong; the unmandated extras were wrong three times."***

## Related

- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the ADR re-ingested
- [[tasks/record-adr-032-sprint-ship-loop-autonomy-amendment]] — `0118`, which wrote the amendment
- [[tasks/wiki-resync-for-adr-033]] — `0126`, the first link in the wiki chain
- [[tasks/wiki-resync-for-the-lead-rename-and-menu-reorder]] — `0141`, the second
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, which this run's flag fed as Case 4
- [[tasks/wiki-ingest-lead-conductor-and-adrs-031-032]] — `0117`, which raised the stand-in banner
- [[tasks/implement-adr-032-a2-worklog-audit-obligation-in-the-sprint-loop]] — `0147`, whose landing this ingested
