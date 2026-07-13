# ADR-006: Distribute the vendored `query` skill via relative symlinks, not byte-identical copies

**Date**: 2026-07-10
**Status**: superseded

> ## ⚠️ Superseded on two grounds.
> 1. **Omnigent removed** ([[decisions/adr-009-claude-code-native-is-the-only-runtime]]) — the
>    per-bundle vendored skill this ADR distributes **no longer exists at all**.
> 2. **Already superseded before that, by
>    [[decisions/adr-007-plain-copies-plus-sync-script-and-drift-check-for-vendored-query-skill]]** —
>    after this ADR's mechanism caused **a real, reproducible git pathspec failure that this ADR's own
>    investigation did not catch.**
>
> Its underlying *rationale* — wanting a single source of truth rather than N copies drifting — still
> stands. ADR-007 achieved it a different way, without symlinks.

## Context
[[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] decentralized wiki reads by vendoring the `query` skill into every agent bundle. That left **six byte-identical copies** of the same skill in the repo, with nothing keeping them in sync — a classic drift trap: the copies *look* identical on the day they land and diverge quietly thereafter.

## Decision
Replace the byte-identical copies with **relative symlinks** — five bundles' `skills/query` pointing at the one canonical copy in `fkit-wiki`'s bundle. One real file; the rest are pointers.

## Consequences
- One source of truth; no drift possible by construction.
- **And it broke.** Symlinks in the repo produced a real, reproducible **git pathspec failure**. The mechanism was reverted in ADR-007, which went back to plain copies — but kept the single-source-of-truth goal by adding a **sync script plus a mechanical drift-check**, rather than trusting discipline.
- **The lesson worth keeping** (it outlived both mechanisms): a clever distribution mechanism that the surrounding toolchain doesn't fully support is a worse trade than a boring one with a checker on it. This ADR's own investigation *did not surface* the failure — only using it did.
- On Claude Code the whole problem class evaporated: there is **one** `/fkit-query` skill and **nothing to vendor**.

## Related
- [[systems/fkit]]
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]]
- [[decisions/adr-007-plain-copies-plus-sync-script-and-drift-check-for-vendored-query-skill]]
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]]
- [[tasks/give-every-agent-direct-wiki-query-access]]
