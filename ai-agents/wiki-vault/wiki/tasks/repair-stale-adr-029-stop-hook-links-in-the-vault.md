# Repair the stale `adr-029-stop-hook` links in the wiki vault

**Source**: `ai-agents/tasks/done/0078-repair-stale-adr-029-stop-hook-links-in-the-vault/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 · ID **0078** · priority 80 · owner fkit-wiki

## Goal
Repair the vault after an **ADR-number collision**. On 2026-07-19 a new ADR-029 (the task-folder / global-ID decision) was recorded against a number **already claimed** by a stop-hook decision that ~10 vault pages had ingested. The stop-hook decision was renumbered to **ADR-030** on disk — but the vault, ingested before the renumber, still carried the old `adr-029-stop-hook-…` slug.

**The dangerous shape of this defect:** every wiki-link to the old `adr-029-stop-hook` slug **resolved — to the wrong decision page.** A 404 announces itself; this did not. An agent asking about the turn-completion hook got a confident answer off a page the surrounding renumber had made wrong, with no dead link to notice. That is why it was pulled ahead of the batched task-99 sync.

## Key Changes
- **Renamed** the vault page `adr-029-stop-hook-…` → `adr-030-stop-hook-enforces-turn-completion-contract.md` (`git mv`), title line corrected to `# ADR-030:`; body prose untouched (all still accurate).
- **Wrote the new ADR-029 page** (task-folder / global ID) on architect-granted discretion — leaving 029 with no page while 030 existed is the same defect wearing a different hat.
- **Re-pointed every inbound vault link** to the new slug, incl. `index.md` and `log.md` index surfaces.
- **Hunted bare-number prose too** — e.g. an `adr-025` page mention naming "ADR-029" in words with no slug, which no mechanical link sweep can find.

## Outcome
Done — this was **fkit-wiki's own work** (2026-07-19), closed by the owner 2026-07-22. A follow-up full-vault lint swept every `ADR-029`/`ADR-030` occurrence including slug-bearing lines and confirmed **all resolve to the correct decision**. The **root cause — the ADR-number allocator looking in too few places — is fixed separately** by [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]] Part B; the vault-side lint cross-check ([[systems/testing-and-verification]]) is the standing detector.

## Related
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] · [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — the two decisions the collision confused
- [[tasks/extend-mover-reference-sweep-to-the-knowledge-base]] — task 81 Part B, the allocator fix that stops a recurrence
- [[tasks/wiki-sync-task-folder-migration]] — task 78, whose scope this repair was deliberately carved out of (its stale links failed silently and could not wait out the migration)
- [[systems/testing-and-verification]] — the ADR-number/slug cross-check that makes this class mechanically detectable
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
