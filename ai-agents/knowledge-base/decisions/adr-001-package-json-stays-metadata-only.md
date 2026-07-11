# ADR-001: `package.json` stays metadata-only for now

- **Status:** **superseded** by
  [ADR-011](adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md)
  (`package.json` stays **with** its `scripts`; version bumping **continues**; npm stays open under a
  scoped name).
- **Date:** 2026-07-09
- **Deciders:** owner (relayed via fkit-producer during project initiation), recorded by fkit-architect

> **⚠ Read as history, not as current design — and do not follow it.** Kept for the record of *why*
> `npx fkit` was deferred (that part still holds: there is still no `bin`, and building one is still
> out of scope). Everything else is wrong:
>
> - **"Stop bumping/publishing `package.json`'s `version`" (`:26`) — do NOT do this.** The version is
>   the git-tag release version (`bin/release.mjs:8,65`), and the Claude self-update resolves updates
>   via `git ls-remote` against those tags. Following this line would break it. Version bumping
>   continues.
> - **"No `scripts`" (`:22`) no longer holds** — `package.json:3-9` has a release-tooling `scripts`
>   block (`node bin/release.mjs`), which is not install semantics.
> - **The npm-discoverability rationale (`:40-41`) was never true** — the npm name `fkit` belongs to
>   an unrelated package (`nullobject/fkit`); this project has never had an npm listing.
>
> See [ADR-011](adr-011-package-json-stays-with-scripts-npm-under-scoped-name.md) for the current
> decision.

## Context

`package.json` at the repo root (`package.json:1-19`) declares only npm registry metadata — `name`,
`version`, `description`, `license`, `author`, `repository`, `homepage`, `keywords` — with **no
`bin`, `scripts`, or `dependencies` block** (confirmed: `grep '"scripts"' package.json` returns
nothing). fkit has no build step and no Node runtime dependency of its own — distribution today is
`curl -fsSL .../install.sh | sh` → `omnigent/fkit-init.sh` (`install.sh:1-27`), not an npm/npx flow.

The initiation survey (`ai-agents/knowledge-base/architecture.md`, "Risks, technical debt, and open
questions") flagged this as ambiguous: was the metadata-only shape a deliberate scope decision, or a
gap on the way to an `npx fkit` installer? The owner answered directly (relayed via fkit-producer):
this is deliberate, and `npx fkit` is a **deferred**, not abandoned, feature.

## Decision

`package.json` remains metadata-only — no `bin`, no `scripts`, no `dependencies` — until an actual
`bin` entry (wrapping `omnigent/fkit-init.sh`, the same script `install.sh` already calls) is built.
`npx fkit` is a deliberate, deferred future feature, not an oversight to fix now.

As a consequence of this decision: **stop bumping/publishing `package.json`'s `version`** until a
`bin` genuinely exists. An empty, no-`bin` npm package sitting at a bumped, published version is a
mild trap — it invites `npx fkit` (which currently does nothing useful) from anyone who sees a
published version and assumes an installer exists.

## Options considered

- **Leave as pure metadata, defer the `bin` (chosen)** — matches the current `curl | sh` distribution
  model exactly, adds no maintenance burden, and doesn't commit to an `npx` UX before it's designed
  (argument parsing, path resolution inside a downloaded npm package, etc.).
- **Add a `bin` now, wrapping `fkit-init.sh`** — rejected for this pass: the near-term goal is
  "a user-friendly startup sequence" via the existing `install.sh`/`.fkit/run` path
  (`omnigent/fkit-init.sh`), and a half-designed `npx` entry point risks becoming a second,
  inconsistent installer surface.
- **Remove `package.json` entirely** — rejected: keeping the npm listing (name/description/keywords)
  has discoverability value even without an installer, and removing it would be more churn than
  leaving it inert.

## Consequences

- **Positive:** no false signal that `npx fkit` works today; no premature commitment to an `npx` UX
  before it's designed; zero added maintenance.
- **Negative / costs:** anyone browsing npm sees a versioned package with no functionality — mitigated
  by not bumping the version further (see Decision) and by `README.md` already pointing at
  `install.sh` as the real entry point.
- **Residual risk / "re-raise only if":** someone proposes adding a `bin` entry, publishing a new
  version to npm, or otherwise giving `package.json` install semantics — at that point this ADR should
  be revisited or superseded by one that designs the `npx fkit` flow.

## Related

- `ai-agents/knowledge-base/architecture.md` — "Build / run / test" and "Risks, technical debt, and
  open questions" sections (this ADR resolves open question 1 from that survey).
- `package.json:1-19`, `install.sh:1-27`, `omnigent/fkit-init.sh`.
