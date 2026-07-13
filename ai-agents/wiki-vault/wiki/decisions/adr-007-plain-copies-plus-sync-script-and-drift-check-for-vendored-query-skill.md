# ADR-007: Plain copies again, kept in sync by a script with a mechanical drift-check — not symlinks

**Date**: 2026-07-10
**Status**: superseded

> ## ⚠️ Superseded — Omnigent removed ([[decisions/adr-009-claude-code-native-is-the-only-runtime]]).
> The per-bundle copies, the sync script, and the drift-check this ADR specifies **all died with the
> Omnigent bundles**. There is now one `/fkit-query` skill and **nothing to vendor**.
>
> It **supersedes [[decisions/adr-006-symlink-vendored-query-skill-not-copy]]** on distribution
> mechanism only — that supersession stands as history, but both mechanisms are now moot.

## Context
[[decisions/adr-006-symlink-vendored-query-skill-not-copy]] replaced ADR-005's six byte-identical copies of the wiki `query` skill with **relative symlinks** to a single canonical file.

The symlinks caused **a real, reproducible git pathspec failure** — a failure ADR-006's own investigation had not caught. The mechanism was clever and the toolchain did not fully support it.

## Decision
**Go back to plain copies** — and make the single-source-of-truth goal hold by *mechanism* rather than by discipline:

- a **sync script** regenerates the vendored copies from the one canonical source;
- a **mechanical drift-check** fails if any copy has diverged.

The copies are an implementation detail; the checker is the guarantee.

## Consequences
- The git failure mode introduced by ADR-006 is gone; ordinary files behave the way every tool expects.
- Drift is **prevented by a check, not by trust**. The pattern this establishes outlives the specific problem: *if you must duplicate, add the checker in the same change.*
- The cost is a build-ish step in a project that otherwise has none.
- All of it became unnecessary on Claude Code — a single `/fkit-query` skill, zero distribution machinery. **The best fix for the vendoring problem turned out to be not having to vendor.**

## Related
- [[systems/fkit]]
- [[decisions/adr-006-symlink-vendored-query-skill-not-copy]]
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[tasks/give-every-agent-direct-wiki-query-access]]
