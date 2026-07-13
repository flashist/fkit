# ADR-001: `package.json` stays metadata-only for now

**Date**: 2026-07-09
**Status**: superseded

> ## ⚠️ Superseded by [[decisions/adr-011-package-json-stays-with-scripts-npm-under-scoped-name]] — read as history, and **do not follow it**.
> Only one part still holds: `npx fkit` is still deferred and there is still no `bin` field. Everything
> else is **wrong**, and following one line of it would break the product:
> - **"Stop bumping the `version`" — do NOT do this.** The version is the git-tag release version, and
>   self-update resolves updates via `git ls-remote` against those tags. **A coder who followed
>   ADR-001 would break the self-update.** Version bumping is load-bearing release infrastructure.
> - **"No `scripts`" no longer holds** — `package.json` has a release-tooling `scripts` block.
> - **The npm-discoverability rationale was never true** — the npm name `fkit` belongs to an unrelated
>   package (`nullobject/fkit`); this project has never had an npm listing.

## Context
`package.json` at the repo root declares only npm metadata and no `bin`, `scripts`, or `dependencies` block. The project is distributed today through `install.sh` and `omnigent/fkit-init.sh`, not through an npm or `npx` entry point.

During initiation, the question was whether the metadata-only shape was deliberate or just unfinished work on the path to an `npx fkit` installer. The owner clarified that it is deliberate for now.

## Decision
`package.json` remains metadata-only until a real `bin` entry exists that wraps `omnigent/fkit-init.sh`.

`npx fkit` is a deferred future feature, not an oversight. Until that lands, version bumps should stop so npm does not imply a working installer where none exists.

## Consequences
- The current `curl | sh` distribution model stays aligned with the repo's actual behavior.
- There is no false signal that `npx fkit` is ready today.
- A future installer decision will need to design argument parsing, path resolution, and packaging semantics deliberately.

## Related
- [[systems/fkit]]
- [[systems/install-and-self-update]]
