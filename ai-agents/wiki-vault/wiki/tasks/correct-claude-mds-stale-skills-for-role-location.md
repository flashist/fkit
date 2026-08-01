# Correct `CLAUDE.md`'s stale `skills_for_role()` location

**Source**: `ai-agents/tasks/done/0151-correct-claude-mds-stale-skills-for-role-location/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID `0151` · owner `fkit-coder`

## Goal

The repo-root `CLAUDE.md` named the wrong file as the home of the single source of truth for role→skill ownership: *"`skills_for_role()` in `claude/fkit-claude.sh`"*. The function had moved to `claude/skills-for-role.sh` (task 43 / [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]); `fkit-claude.sh` merely **sources** it.

**Why it matters:** `CLAUDE.md` is injected into **every fkit session**, so every role in every session was being told the wrong file — including the lead session that surfaced it. A one-line prose error on the most-read file in the repo.

**Severity deliberately not inflated.** The pointer misdirects by **one hop**, not into a wrong edit: `claude/fkit-claude.sh` documents the move in a comment directly above the `source` line, so a reader who follows the stale pointer lands next to the correction. The cost is wasted reading and a weakened claim of *"exactly one place"*, not a broken change.

## Key Changes

**One line, in one file.** The *"declared in exactly one place"* framing was preserved — that claim was still true; only the filename was wrong.

Three constraints were verified rather than assumed:

- `CLAUDE.md`'s line sits **outside** the fkit-managed `<!-- fkit:begin-rules -->` block, so this was a normal file edit and **not** a `universal-rules.md` regeneration. Editing the scaffold would have been wrong.
- **No dual-home twin exists** — `grep -rn skills_for_role claude/scaffold/` returns nothing.
- The two sibling docs (`claude/README.md` and `ai-agents/knowledge-base/architecture.md`) were **already correct** and deliberately left alone; re-editing them risks introducing the drift this task removes. ADRs citing the old path (010, 012, 014) are **dated records of their own moment** and were out of scope.

## Outcome

Done, **agent-closed — not owner-verified**. Verified in the vault on **2026-07-30**: `CLAUDE.md` now names `claude/skills-for-role.sh`, and `skills_for_role()` is declared there with `claude/fkit-claude.sh` only sourcing it.

**Provenance:** surfaced during [[tasks/fix-sprint-ship-loop-skill-owner-banner-format]] (`0120`)'s plan step — one of two follow-ups that task **correctly refused** to fold into itself.

⚠️ **It is plausibly a live specimen of the class task `0142` exists to investigate.** The `claude/skills-for-role.sh` mirror checklist has failed **twice** to name every place a role↔skill ownership fact is asserted. Note the specific shape: `0142`'s inventory question already names the *generated* `CLAUDE.md`/`AGENTS.md` blocks — but this line is **hand-written prose outside** the generated block, a class the inventory does not currently name.

⚠️ **The fix turned one line into three**, which invalidated `CLAUDE.md:43` citations elsewhere. The vault's copies were repaired; the knowledge-base and `claude/` were not checked and are outside the wiki role's write scope. That citation class is the subject of [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] (`0160`).

## Related

- [[tasks/fix-sprint-ship-loop-skill-owner-banner-format]] — `0120`, which found this and refused to fix it inline
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the decision that moved the function
- [[tasks/reconcile-skill-ownership-source-of-truth]] — the original single-source-of-truth work
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, the coordinate-drift class
- [[systems/role-locked-sessions]]
