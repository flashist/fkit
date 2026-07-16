# ADR-003: Add CI running `omnigent/validate-bundles.sh`

**Date**: 2026-07-09
**Status**: superseded

> ## ⚠️ Superseded — Omnigent removed ([[decisions/adr-009-claude-code-native-is-the-only-runtime]]).
> `omnigent/validate-bundles.sh`, the script this ADR's CI would have run, **no longer exists**, and
> **the CI never landed.** Kept for the record — because **the need it identified is still unmet and
> still open**: fkit has *no* automated verification of any kind. That is now the project's top
> structural risk, and *"what is the intended verification story?"* is an open question for the owner.

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
- [[tasks/add-ci-validate-bundles]]
- [[tasks/sprint-1-ship-the-onboarding-sequence]]
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[systems/testing-and-verification]]
