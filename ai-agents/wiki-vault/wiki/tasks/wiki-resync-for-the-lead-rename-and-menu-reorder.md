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
- [[systems/fkit]]
