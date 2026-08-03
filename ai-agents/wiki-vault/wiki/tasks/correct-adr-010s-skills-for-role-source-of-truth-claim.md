# Correct ADR-010's `skills_for_role()` source-of-truth claim — the self-contradiction `0143` knowingly shipped

**Source**: `ai-agents/tasks/done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified** (2026-08-02)
**Sprint/Tag**: Sprint 2 · task `0195` · owner `fkit-architect`
**Key files**: `ai-agents/knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md` (+53 / −0, **additions only**)

## Goal
[[tasks/append-a-dated-correction-note-to-adr-010]] (`0143`) landed correction notes that named `claude/skills-for-role.sh` as `skills_for_role()`'s home — while **§Decision 5, out of `0143`'s scope, still named `claude/fkit-claude.sh`**. **The ADR contradicted itself on one screen, three decisions apart.** A reader landing on §Decision 5 alone was told the wrong file.

## Key Changes

**Two more ⚠️ blocks, in the same append-only form `0143` established:**

- **Below §Decision 5** — the binding site. `skills_for_role()` lives in `claude/skills-for-role.sh`, *"extracted from fkit-claude.sh (task 43 / ADR-018)"*; `claude/fkit-claude.sh` defines none of its own and only **sources** it. It has **two consumers now, not one** — the launcher, and the `PreToolUse` skill-ownership hook. And the `skills:` frontmatter was **DROPPED, not generated** — ADR-012 settled the second of the two branches §Decision 5 itself offered.
- **Below §Context's *"One real inconsistency"* passage** — that passage is **spent**: the inconsistency it named was resolved, **in one of the two ways the ADR itself prescribed**. There are no longer two lists. Its *"settled here"* promise was kept. **Still true in substance:** every role owns `fkit-team` — but the **mechanism is no longer the shell**: the launcher grants nothing, and a `PreToolUse` **deny** hook reads `skills_for_role()` at call time.

**⚠️ and not ⛔, and the reasoning is the point: this decision was not overturned, it was HONORED.** Its invariant — *one* source of truth for role→skill ownership — is in force. Only the file it names and its sentence about the frontmatter went stale. **Status stays `accepted`.**

⚠️ **ADR-010 now carries FIVE dated correction blocks, not three**, plus the header item.

⚠️ **The `- **Corrections:**` header item now carries TWO site lists.** The brief **pre-authorized** editing the first line in place; **the owner declined the pre-authorization and ruled a continuation line instead** — so the original list (§Context + §Decision 3) stands, and a second line names §Decision 5 + the *"One real inconsistency"* passage and states the first is superseded. **Read whole it is accurate; read halfway it is momentarily misleading.** Accepted as-is: it buys `−0` outright with no exception clause, and keeps the header inside `0143`'s ratified one-metadata-item form rather than carving an exception out of the load-bearing constraint. **A resync that reads only the first line will under-report the annotated sites.**

## Outcome

**Three accepted residuals, all owner-dispositioned live on 2026-08-02:**

- **`R-third-site-remains` — reworded, then accepted.** ADR-010 **still** points at `claude/fkit-claude.sh` for `skills_for_role()` at **two** un-annotated sites, not one: §Context's second lock bullet (which names the function, so states the wrong home outright) and §Related's bare `Code:` coordinate line. Both are fenced out to `0196` and `0197`. ⚠️ **The rewording was required, and why matters:** round 1 called one of them *the* remaining site. **In a series where `0143` missed one site and `0158` missed six, a residual that undercounts by one becomes the authority on "we're done".** Re-raise only if `0196` **and** `0197` both close with either site still wrong.
- **`R-header-two-site-lists`** — the two-list header above. Re-raise only if the item stops parsing as a single markdown list item, or a later append makes the stale first list **actively wrong** rather than superseded.
- **`R-size-overrun`** — shipped **+53** against a plan estimate of **+26**. Scope unchanged; the extra lines are rationale and an owner-authorized *"Named, not repaired here"* passage.

**It carries `0143`'s ratified form forward** as its own accepted constraints: no `:NNN` into a mutable file (**permitted, not mandated** — re-raise if `0171`'s durable-citation-anchors page supersedes it), and the one-metadata-item header form.

**The `skillOverrides` parenthetical was ruled a fence, not a defect.** Codex read it as excluded scope; ruled **partially correct, not a defect** — the owner had fenced `skillOverrides` out as an unrelated cause, and `0196` discharges the exclusion.

⚠️ **Its Process-review step was also routed to `@fkit-architect`** — the third of three consecutive tasks. **That worker disclosed, in the open, applying the *method* by hand rather than running the coder-owned skill**, which is one of the two live readings task `0201` must state without choosing between them.

⛔ **Serialization recorded at this task's close:** `0195` → `0196` → `0197` → `0171` → **`0199`** (the vault resync). **`0199` runs LAST** — run earlier and the vault page describes an ADR still being appended to, which is the exact defect that row exists to clear. **It is an ordering constraint on file writes, not a `Depends on:`**; the `## Priority` ranks are append ranks and do not encode it.

## Related
- [[tasks/append-a-dated-correction-note-to-adr-010]] — task `0143`, whose self-contradiction this repairs and whose note form it extends
- [[decisions/adr-010-role-locked-sessions-and-skill-lockdown]] — the ADR corrected
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — §1, which settled the `skills:` frontmatter as **dropped**
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the extraction of `skills_for_role()` and its second consumer
- [[tasks/reconcile-skill-ownership-source-of-truth]] — the one-source-of-truth invariant this decision states
- [[tasks/correct-claude-mds-stale-skills-for-role-location]] — task `0151`, the same stale pointer fixed in the repo-root `CLAUDE.md`
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — task `0160`, the citation form both notes follow
- [[tasks/wiki-resync-for-the-lead-rename-and-menu-reorder]] — task `0141`, the **vault's** own correction-note convention, worded opposite on the above/below axis
- [[tasks/sprint-2-remove-omnigent]] · [[systems/role-locked-sessions]] · [[systems/knowledge-base-structure]]
