# Wiki resync for the lead rename and the menu reorder

**Source**: `ai-agents/tasks/done/0141-wiki-resync-for-the-lead-rename-and-menu-reorder/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0141` · owner `fkit-wiki`

## Goal

Stop the vault asserting facts that `0139` and `0140` had already retired: the label **"team room"**, and the lead sitting at **menu option 7** instead of option **1**. Both had shipped and were owner-verified, so the vault was asserting false facts *today*, not prospectively.

## Key Changes

Recorded in the vault's `log.md` entry of **2026-07-29**. Six vault files changed.

**The disposition rule this task had to settle, because nothing settled it.** Three of the five sites were the vault's copies of **historical records** — two task pages and the ADR-010 mirror. The live-tree rule set by `0140`/`0143` is *do not rewrite history; append a dated correction*. Whether the **vault** mirrors that rule or treats its pages as always-current was explicitly *"the wiki role's call and not settled here"*. It was settled here, in favour of mirroring: a `wiki/tasks/*` body is the record of its ship date and stays byte-identical, with a **dated correction placed at the claim**.

**Placement, not word count, was the recurring error.** Corrections were repeatedly written 19–25 lines below the claim they corrected, where a reader reaches the false sentence first. The rule adopted — *banner above claim* — is now the vault's convention.

> ⚠️ **Dated correction 2026-08-03 (lint) — *"banner above claim"* does not describe what the vault does, and a second, differently-worded rule now governs the knowledge-base. The sentence above is left byte-identical as this task's record of what it settled on 2026-07-29.**
>
> **Measured this lint, across all 194 pages:** **21 correction notes on 14 pages** sit **below** the claim they correct — they say so in their own words (*"the sentence above is left byte-identical"*). **Zero sit above it.** The practice includes every note written since, and the notes on this vault's own [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] page.
>
> **Meanwhile [[tasks/append-a-dated-correction-note-to-adr-010]] (`0143`, 2026-08-02) ruled the opposite wording for the knowledge-base**, on an owner ruling: *"the note goes **below** the claim it corrects, at the claim — **not in a header banner**, not nineteen lines away."* That form also carries the ⚠️/⛔ legend, the *"left byte-identical"* clause and the no-`:NNN`-into-mutable-files rule, and was extended by [[tasks/correct-adr-010s-skills-for-role-source-of-truth-claim]] (`0195`).
>
> **The two rules are each correctly scoped where they are stated** — this page says *the vault's* convention, `0143`'s page says *the knowledge-base* form — **but they oppose on the above/below axis, neither page referenced the other until this note, and `0143`'s wording rules out by name the word this one adopts.**
>
> ⚠️ **NOT settled here, deliberately.** Both readings survive the artifacts: *"banner"* may have meant a visually distinct block **adjacent to** the claim (in which case the vault's practice conforms and only the word *above* is wrong), or it may have meant literally above (in which case the stated rule has never once been followed). **Nothing on disk distinguishes them**, and no owner ruling extends `0143`'s form to the vault. **No open task owns the vault-wide question** — `0199` owes only ADR-010's page the below-the-claim rule *with its rationale*, which is narrower. Flagged for the owner or an architect.

## Outcome

Done, **agent-closed — not owner-verified**.

⚠️ **The brief's own inventory was wrong before the task started.** It was filed saying *"two pages"*; it is **four pages, five sites**. The brief itself flagged the correction and told the implementer to treat even the corrected list as *"a floor, not a ceiling"*. Verification then found the five-site inventory was **2 of 5 false**, with one wrong line number.

Three record defects were found in review — an **unrun command printed as though run**, a **citation that went stale by the act of writing it**, and a claim of *"vault-wide"* coverage broader than what was measured (the structural checks ran over the content pages and `index.md`; the prose lint did not). The vault's own log states the one-line lesson plainly: **run every command you print.**

## Related

- [[tasks/reorder-launcher-menu-lead-first-and-rename-label]] — `0139`, the menu reorder
- [[tasks/retire-team-room-in-docs-and-agent-definitions]] — `0140`, the rename everywhere else
- [[tasks/wiki-resync-for-adr-033]] — `0126`, the first link in the wiki chain
- [[tasks/wiki-reingest-the-amended-adr-032-and-clear-its-stale-banner]] — `0148`, the third
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the *"does no work"* claim this had to judge
- [[tasks/append-a-dated-correction-note-to-adr-010]] — `0143`, the **knowledge-base** correction-note form, which words placement **opposite** to this page's vault convention (see the 2026-08-03 note above)
- [[tasks/correct-adr-010s-skills-for-role-source-of-truth-claim]] — `0195`, which extended `0143`'s form
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — the ADR mirror this task treated as a historical record, and whose vault page carries notes **below** their claims
- [[systems/fkit]]
