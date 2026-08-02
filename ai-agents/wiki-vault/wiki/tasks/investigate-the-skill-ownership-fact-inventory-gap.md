# Investigate the skill-ownership fact-inventory gap — the mirror checklist does not see every site

**Source**: `ai-agents/tasks/done/0142-investigate-the-skill-ownership-fact-inventory-gap/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-02
**Sprint/Tag**: Sprint 2 · ID 0142 · owner fkit-architect

## Goal
**An investigation, not an implementation** — the fix shape was genuinely unknown, and scoping a build before the shape is known is what the brief existed to avoid. `claude/skills-for-role.sh`'s **mirror checklist** had failed repeatedly, and *"two instances is a pattern in the checklist, not two slips."* The task had to enumerate the true inventory **by evidence, not by memory** — *the whole failure being investigated is a confidently incomplete list.*

## Key Changes
Produced `ai-agents/knowledge-base/reports/2026-08-02-skill-ownership-fact-inventory-gap.md` and **[[decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry]]**, both accepted 2026-08-02.

⚠️ **The report shipped an incomplete inventory TWICE, and that is its strongest evidence, not a footnote.** Round 1 was short by **17 rows and 5 whole classes**; round 2 was short by one — **and the one it missed was the exact shape both documents then declared had no live instance.** Three passes by one author on one day produced ~19, 21 and 38 rows. That is precisely why **ADR-036 hard-codes no site count at all**.

**Five live defects found, none previously recorded, and every one deliberately left live** (the brief was report-only): a declared mirror shipping an incomplete producer skill row into every consuming project; two `architecture.md` errors including **a citation-drift defect inside the report about citation drift**; the **FOUR**-mirror claim when there are five and a sixth — whose repair **must touch two byte-identical files** that neither point at each other nor are tested to agree; and a root `CLAUDE.md` claim contradicted by four live docs **and by ADR-018, which records the opposite as a knowingly accepted cost**. Filed as task `0188`.

**Scored honestly against itself:** the recommended registry would have caught 4 of 6 historical classes and **0 of the ≥5 current defects** — because all five are wrong content at **registered** sites, which is task `0137`'s territory, not the registry's.

## Outcome
Three review rounds, **Codex coverage FULL on all three**. Round 3 **converged** — the reviewer's words: *"Round 3 found none — the first round the inventory survived the attack that broke it twice."* Ledger closed **✅ ACCEPTED** with five accepted residuals, each carrying a falsifiable *re-raise only if*, including **R12's cause recorded as UNKNOWN** rather than adopting Codex's plausible-but-unproven mechanism.

One residual is worth preserving as a method note: a sweep figure in the appendix **does not reproduce** — the reviewer's and Codex's separately-written implementations both returned a different number. It was **left as the dated measurement it is with the non-reproduction disclosed in place**, and rated low *precisely because the report already refuses to lean on that sweep* — which R15 made **load-bearing rather than rhetorical**.

⛔ **Still investigation only:** no test created, no skill or agent definition edited, no live defect repaired, no brief filed, nothing written to the vault, no commit.

### ⚠️ Part 7 — the three-vs-four discrepancy, and its resolution here

The report recorded an **open discrepancy it could not settle**: the vault said the checklist *"missed **four system prompts** and the universal rules block"*, while `0142`'s brief and the sprint plan both said **three**. The architect **did not determine which was wrong**, because it read the question as requiring the `0124` sweep its brief forbade — and noted that **`0124`'s folder holds only `brief.md` and `review.md`, with no `worklog.md`**, so the sweep's own working record does not exist.

**Settled by `fkit-wiki` on 2026-08-02 without re-running the sweep** — from `0124`'s brief's own amendment history, which is the primary record of what the sweep found:

- `0124`'s item 5 reached a final inventory of **four sites**: `claude/scaffold/universal-rules.md` (the rules block) plus **three** agent system prompts — `fkit-producer.md`, `fkit-coder.md` and `fkit-lead.md`.
- **"Three" is not wrong, it is stale.** It is the count after the **first** scope amendment (2026-07-25). `fkit-lead.md` was added by the **third** amendment the same day, found by task `0123`.
- **The vault's figure overcounted.** An independent enumeration of every `claude/agents/fkit-*.md` path named anywhere in `0124`'s folder returns **exactly three files** — coder, lead, producer. There is no fourth agent definition. The vault most likely took the brief's phrase *"a **fourth** system prompt"* — where the brief's own count already included `universal-rules.md` among the "system prompts" — and then **added the rules block a second time**.

**The correct figure is four sites: three agent system prompts plus the universal rules block.** [[systems/fkit]] and [[tasks/revert-task-movers-to-producer-only]] are corrected accordingly. ⚠️ **Residual, stated rather than resolved:** if `0124`'s sweep found a site it never wrote into its brief, no record of it survives — the brief is the operative record, and with no worklog nothing else can be checked against it.

## Related
- [[decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry]] — the decision this investigation produced
- [[tasks/revert-task-movers-to-producer-only]] — task `0124`, failure 2, and the subject of the Part 7 discrepancy settled above
- [[tasks/correct-claude-mds-stale-skills-for-role-location]] — task `0151`, failure 3: hand-written prose **outside** the generated block, a class the checklist never named
- [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]] — task `0036`, failure 1: **the checklist was followed precisely and still shipped false docs**
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — `skills_for_role()` as the single source of truth, unchanged by this work
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — why a false system prompt yields a **runtime arguing with itself**
- [[tasks/reclaim-rules-block-budget-headroom]] — task `0130`, whose re-measured 126 B of usable growth grounded the rejection of the generate-the-prose option
- [[tasks/reconcile-dual-homed-file-drift-live-vs-scaffold]] — task `0132`, whose exception-list module is the shape ADR-036's registry adopts
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] · [[decisions/adr-014-how-fkit-tests-itself]]
- [[systems/fkit]] · [[systems/role-locked-sessions]] · [[systems/testing-and-verification]] · [[tasks/sprint-2-remove-omnigent]]
- [[systems/knowledge-base-structure]] — related
