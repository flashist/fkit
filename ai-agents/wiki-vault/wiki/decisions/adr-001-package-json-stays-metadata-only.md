# ADR-001: `package.json` stays metadata-only for now

**Date**: 2026-07-09
**Status**: accepted

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
