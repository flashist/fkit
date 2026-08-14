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

> ⛔ **SETTLED — owner ruling 2026-08-03. The vault's correction-note placement rule is now `0143`'s form: the note goes BELOW the claim, at the claim — not in a header banner.** The rule stated in the sentence at the top of this block — *"banner above claim"* — **no longer governs from this date.** Given live via `AskUserQuestion` in a `/fkit-sprint-ship-loop` driver session, in answer to the question the ⚠️ note directly above returned to the owner. **Both the 2026-07-29 sentence and the 2026-08-03 lint note above are left byte-identical.** Nothing on disk moved.
>
> **What changed is a decision, not a discovery of error.** The 2026-07-29 wording was a stated convention adopted on real evidence — corrections written 19–25 lines from their claim — and the note above records that **nothing on disk could distinguish its two readings**. It still cannot. The ruling picks which reading governs **going forward**; it does **not** make the original wording retroactively wrong, and it is not a finding that anyone erred.
>
> **The owner's stated grounds for choosing this form:** it matches **31 of 31** correction notes already in the vault (re-derived across all 197 pages by the 2026-08-03 lint); **one ruling then governs both surfaces** — the knowledge-base and the vault — instead of two rules opposed on the above/below axis; and **nothing has to move.**
>
> **The rule as it now reads on both surfaces**, from [[tasks/append-a-dated-correction-note-to-adr-010]] (`0143`, owner-ruled 2026-08-02) as extended by [[tasks/correct-adr-010s-skills-for-role-source-of-truth-claim]] (`0195`): **⚠️ = a fact that drifted · ⛔ = a decision that was overturned**; the note sits **below the claim, at the claim** — not in a header banner, not nineteen lines away; the corrected sentence is left **byte-identical** and the note says so in those words; **additions only**; **no `:NNN` line numbers into a mutable file**.
>
> ⚠️ **One surface this ruling does NOT reach: the vault's `log.md`.** That file is **append-only with no exceptions** — a correction there is a **new dated entry** naming its target by folder ID and durable anchor, never a note placed at the claim, because there is no editing a past entry at all. Separate owner ruling, same day; see [[tasks/annotate-the-old-form-completion-flags-in-the-vault-log]] (`0211`).

> ✅ **ACCEPTED, RULED — the word *"banner"* names two different things in this vault, and that is deliberate. Owner ruling 2026-08-03. A later lint should recognise this as settled and move on; do NOT re-raise it, and do NOT sweep.**
>
> **The collision.** *"Banner"* is (a) the **superseded** correction-note placement above, and (b) a **live and still-used device** — the page-top `⚠️ STALE` / supersession / collision blocks on ADR mirror pages, and the `⛔ Owner:` banners in the skills. The ruling: **the two uses are distinguishable in context**, and the placement notes on this page already say which form governs a correction note. **No rename. No vault-wide sweep.**
>
> ⛔ **Exact scope — read this before acting on it.** The ruling accepts the **naming** overlap and nothing else. It does **not** re-open the placement ruling above, and it does **not** bless *"banner above claim"* as a correction-note form. **That form stays superseded.** A page-top banner remains a legitimate device for *page-level staleness*; it is still **not** how a correction note is placed.
>
> **Why this is written down at all:** it was flagged as a loose end with **no open task owning it**, and an accepted decision that leaves no artifact gets re-discovered every run — the cost pattern the placement question itself demonstrated across three lints. **This note is the artifact.** Provenance: the **owner**, live via `AskUserQuestion`, **2026-08-03**, in the `/fkit-sprint-ship-loop` driver session.

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
- [[tasks/annotate-the-old-form-completion-flags-in-the-vault-log]] — `0211`, the **append-only `log.md`** carve-out the 2026-08-03 ruling does not reach
- [[systems/knowledge-base-structure]] — where the correction-note form is catalogued, now recorded as governing the vault too
- [[systems/fkit]]
- [[tasks/the-2026-08-13-vault-resync-chain]] — a later link in the same chain of vault re-syncs
