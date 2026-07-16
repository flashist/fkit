# ADR-011: `package.json` stays, with its `scripts`; npm stays open under a scoped name

**Date**: 2026-07-11
**Status**: accepted

**Supersedes**: [[decisions/adr-001-package-json-stays-metadata-only]]

## Context
[[decisions/adr-001-package-json-stays-metadata-only]] decided `package.json` stays **metadata-only** — "no `bin`, no `scripts`, no `dependencies`" — and, as a consequence, instructed: **"stop bumping/publishing `package.json`'s `version`."** Its stated reason for keeping the file at all was that *"keeping the npm listing has discoverability value."*

**Three facts falsify that ADR:**

1. **The npm name `fkit` is taken, and always was.** It belongs to `nullobject/fkit` — an unrelated JS functional-programming toolkit. This project **has never been published to npm and cannot be** under that name. So ADR-001's rationale describes **an npm listing that does not exist** — there is no discoverability to preserve. Worse, **`npx fkit` today fetches someone else's package** — a sharper form of the exact "mild trap" ADR-001 was written to prevent.

2. **`package.json` has a `scripts` block, and it is release tooling — not install semantics.** It defines `release` / `release:minor` / `release:major` / `release:dry`, all invoking `bin/release.mjs`, which bumps the version, commits, tags `v<version>`, and pushes — and **makes no npm-registry publish**. There is still **no `bin` field**, so ADR-001's *spirit* (no `npx`/install surface until one is designed) **survives intact**; only its literal "no `scripts`" prohibition breaks, on a use it never contemplated.

3. **The load-bearing one: ADR-001 conflicted with in-flight work.** `VERSION` is the single source of truth, `package.json`'s `version` tracks it, and the release tag is `v<VERSION>`. The Claude-path self-update being built in Sprint 2 resolves updates by a throttled `git ls-remote` **against those tags**. So ADR-001's *"stop bumping the version"* reads as **"stop cutting releases"** — **a coder who read ADR-001 and followed it would have broken the very self-update that sprint was building.**

## Decision
**`package.json` stays, `scripts` block included.** It is in active use: it provides the project's **versioning**, and `bin/release.mjs` is **real release tooling**.

- **Version bumping continues.** It is **load-bearing release infrastructure**, not an inert npm artifact.
- **There is still no `bin` field** — `npx fkit` is still not an install surface, and building one is still out of scope.
- **npm publication stays open under a *scoped* name** (e.g. `@flashist/fkit`), since the bare name is unavailable.

## Consequences
- Self-update keeps working — the thing ADR-001 would have broken.
- fkit still has no npm install surface, and that remains deliberate.
- **A live illustration of why ADRs carry a "Re-raise only if" field**: ADR-001 was *accepted*, sat unchallenged for two days, and was **actively dangerous to follow**. A settled decision is not a correct one; it is only a recorded one.
- **Open question for the owner:** reserve `@flashist/fkit` on npm now, or leave npm alone until there is something to publish? Nothing depends on the answer — it only decides whether the name is held **before someone else takes it, the way `fkit` already went.**

## Related
- [[decisions/adr-001-package-json-stays-metadata-only]]
- [[systems/install-and-self-update]]
- [[systems/fkit]]
- [[tasks/build-claude-self-update]]
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-014-how-fkit-tests-itself]]
- [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]]
