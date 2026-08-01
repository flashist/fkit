# Retire "team room" in the docs and agent definitions, and fix the stale "menu 7" citations

**Source**: `ai-agents/tasks/done/0140-retire-team-room-in-docs-and-agent-definitions/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 2 · ID 0140 · priority 116 · owner `fkit-coder`

## Goal

Carry the owner's project-wide "team room" retirement everywhere outside the launcher and the wiki vault — and fix the menu-number claims that [[tasks/reorder-launcher-menu-lead-first-and-rename-label]] made false.

## Key Changes

**Two distinct kinds of edit, and conflating them is how this task goes wrong:**

- **A naming change** — "team room" as a concept name, a wording preference. Sites across the lead's agent definition, both READMEs, the team skill, the scaffold `CLAUDE.md`, and the root `CLAUDE.md`/`AGENTS.md`. *"This is a wording change — do not restructure the prose, and do not change any claim the sentence makes."*
- **A correctness fix** — three live files stated the lead is **"menu option 7"**, which became **false** the moment the reorder landed. These are **stale claims in files agents read as instructions**, including the lead's own system prompt.

**The inventory was handed over with an explicit instruction not to trust it:** *"verify every site before editing it. A path or line number that does not match what you find is a finding to report, not a number to quietly correct."* Two of the previous three tasks had shipped citations that no longer resolved.

**The preferred fix was a citation that cannot go stale** — *"the first entry in the `fkit` menu"* rather than re-pinning a number that can move again.

### What was deliberately left alone, and why

- **ADR-010's *"the 'team room' (menu option 7)"*** — an **accepted ADR**, true when written. *"Silently rewriting a decision record to match today's reality erases the history the record exists to hold."* The producer's recommendation, flagged as an owner question and an architect call: a **dated one-line correction note appended** to the ADR, never a rewrite of its body. **Still open.**
- **Two dated design reports** — historical evidence of what was true on their date.
- **`ai-agents/wiki-vault/`** — wiki writes are `fkit-wiki`'s exclusively.

⚠️ A YAML hazard was called out: the lead's `description:` frontmatter is a plain scalar, and a `": "` sequence in a continuation line breaks the loader **silently**, degrading the description to the file's H1. That hazard affects three skills and is separate, still-open work.

## Outcome

**Done**, owner-verified (no agent-closed marker). Verified this sync (2026-07-26): a repo-wide sweep of `claude/`, `CLAUDE.md`, `AGENTS.md` and `README.md` finds "team room" **only** in two launcher comments explaining why the aliases are rejected.

⚠️ **The wiki vault still carried the retired phrasing until this sync** — [[systems/fkit]] described *"a 'team room' lead"* and *"The **team room** (menu 7). Routes; **does no work**"*, the latter also asserting a stance ADR-031 reversed. **Corrected in this ingest.** Two historical task pages retain "team room" as point-in-time description of past launcher behaviour, which is correct and left intact.

## Related
- [[tasks/reorder-launcher-menu-lead-first-and-rename-label]] — the launcher half; soft dependency, shipped together
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the stance behind the rename
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — deliberately untouched; awaiting an owner-ruled dated correction note
- [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] — the same system prompt, earlier pass
- [[tasks/stop-agents-asserting-unchecked-repo-state]] — the convention behind "verify every site before editing it"
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — checked at scoping; the two `CLAUDE.md` files are independent, **not** a parity pair
- [[systems/install-and-self-update]] · [[systems/fkit]] · [[systems/knowledge-base-structure]]
- [[tasks/update-launcher-menu-help-for-conductor]] — Update the launcher menu/help text — "does no work itself" → accurate to a conductor
- [[tasks/wiki-resync-for-the-lead-rename-and-menu-reorder]] — `0141`, the same sweep inside the vault
