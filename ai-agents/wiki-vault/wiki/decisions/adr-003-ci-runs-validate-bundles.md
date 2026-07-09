# ADR-003: Add CI running `omnigent/validate-bundles.sh`

**Date**: 2026-07-09
**Status**: accepted

## Context
There was no CI workflow in the repo. The only existing validation step was `omnigent/validate-bundles.sh`, which already catches bad `SKILL.md` frontmatter and degrades gracefully when a local Omnigent Python install is unavailable.

That made it a cheap, useful first CI target.

## Decision
Add a lightweight GitHub Actions workflow that checks out the repo and runs `omnigent/validate-bundles.sh`.

The initial workflow does not need to install Omnigent, because the script still performs frontmatter validation without it. Full `omnigent.spec.load` coverage can be added later.

## Consequences
- Every push or PR gets automatic bundle-frontmatter validation.
- The workflow adds no new runtime dependency in CI at first.
- Coverage remains partial until the `spec.load` path is added later.

## Related
- [[systems/fkit]]
