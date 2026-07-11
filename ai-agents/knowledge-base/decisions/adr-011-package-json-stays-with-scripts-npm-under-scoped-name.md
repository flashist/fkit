# ADR-011: `package.json` stays, with its `scripts`; npm stays open under a scoped name

- **Status:** accepted
- **Date:** 2026-07-11
- **Deciders:** owner (Mark Dolbyrev), relayed via fkit-producer, recorded by fkit-architect
- **Supersedes:** [ADR-001](adr-001-package-json-stays-metadata-only.md) (`package.json` stays
  metadata-only; stop bumping the version)

## Context

[ADR-001](adr-001-package-json-stays-metadata-only.md) (2026-07-09, accepted) decided `package.json`
stays **metadata-only** — "no `bin`, no `scripts`, no `dependencies`" (`adr-001:22-23`) — and, as a
consequence, instructed: **"stop bumping/publishing `package.json`'s `version`"** (`adr-001:26`). Its
stated reason for keeping the file at all was that "keeping the npm listing (name/description/
keywords) has discoverability value" (`adr-001:40-41`).

Three facts, all verified 2026-07-11, falsify that ADR:

1. **The npm name `fkit` is taken, and always was.** `npm view fkit` resolves to `nullobject/fkit`
   — "A functional programming toolkit for JavaScript", v3.4.1 — an unrelated third-party library.
   This project has never been published to npm and **cannot be** under that name. So ADR-001's
   rationale describes **an npm listing that does not exist**; there is no discoverability to
   preserve. Worse, `npx fkit` today fetches someone else's package — a sharper form of the exact
   "mild trap" ADR-001 was written to prevent (`adr-001:27-29`).

2. **`package.json` has a `scripts` block, and it is release tooling — not install semantics.**
   `package.json:3-9` defines `release` / `release:minor` / `release:major` / `release:dry`, all
   invoking `node bin/release.mjs`, which bumps the version, commits, tags `v<version>`, and pushes
   — and states explicitly that it "Makes no npm-registry publish" (`bin/release.mjs:66`). There is
   still **no `bin` field**. ADR-001's *spirit* — no `npx`/install surface until one is designed —
   therefore survives intact; only its literal "no `scripts`" prohibition breaks, on a use it never
   contemplated.

3. **The load-bearing one: ADR-001 conflicts with in-flight Sprint 2 work.** `VERSION` is the single
   source of truth and `package.json`'s `version` is kept in sync with it; the release tag is
   `v<VERSION>` (`bin/release.mjs:8,65`). The Claude-path self-update being built in **Sprint 2 task
   2** (`ai-agents/tasks/backlog/build-claude-self-update.md`) resolves updates by a throttled
   `git ls-remote` against those tags (task `:35-40`; shape ported from `omnigent/fkit.sh:48`).
   ADR-001's "stop bumping the `version`" thus reads as "stop cutting releases" — **a coder who
   reads ADR-001 and follows it would break the very self-update this sprint is building.** Version
   bumping is load-bearing release infrastructure, not an inert npm artifact.

## Decision

**`package.json` stays, `scripts` block included.** It is in active use: it provides the project's
versioning and drives the release flow (`bin/release.mjs`). **Version bumping continues** — it is
release infrastructure that the Claude self-update depends on.

**npm publication remains open for the future, under a changed, scoped name** (e.g.
`@flashist/fkit`), since the bare name `fkit` is unavailable. The owner already owns the `@flashist`
npm scope and has **explicitly decided not to reserve or publish the name now** — there is no action
item here.

**Still explicitly deferred / out of scope: building `npx fkit` or a `bin` entry.** This ADR is
**not** authorization to build one. Adding an install surface (argument parsing, path resolution
inside a downloaded package, its relationship to `install.sh` and the self-update flow) is a real
feature to design, not a cleanup — it needs its own design spec and its own decision.

## Options considered

- **Keep `package.json` with `scripts`; defer `bin`/publish; scope the name if/when published
  (chosen)** — matches what the repo actually does today, unblocks the Sprint 2 self-update, and
  keeps the npm door open without paying for it now.
- **Keep ADR-001 as written (metadata-only, stop bumping)** — rejected: it is factually wrong on its
  own premise (no npm listing exists), and following it would break in-flight Sprint 2 work.
- **Delete `package.json` entirely** — rejected: it is the versioning source of record for the
  release flow and the `scripts` entry point; removing it would break `npm run release` and the
  version that self-update reads via git tags.
- **Reserve/publish `@flashist/fkit` now** — rejected by the owner: no functionality to publish yet,
  and the scope is already owned, so the name is not at risk.

## Consequences

- **Positive:** the release flow and Sprint 2's self-update are unblocked and consistent; no coder is
  told to stop doing something the sprint depends on; npm remains a live future option at a name that
  is actually available.
- **Negative / costs:** fkit still has no npm presence, so `npx fkit` continues to fetch an unrelated
  third-party package for anyone who guesses at it. This is **not mitigated** by this ADR — it is
  accepted, on the grounds that fkit's real entry point is `install.sh` (`README.md`) and nothing
  points users at npm. It is the strongest argument for eventually publishing `@flashist/fkit`, even
  as a stub-with-a-pointer.
- **Known cosmetic debt (do not fix here):** `package.json`'s `description` and `keywords` still say
  "Omnigent" (`package.json:10,17-25`), which is stale post-[ADR-009](adr-009-claude-code-native-is-the-only-runtime.md).
  That cleanup already belongs to **Sprint 2 task 5** (`ai-agents/tasks/backlog/delete-omnigent-directory.md`)
  — it is deliberately not duplicated into this ADR.
- **Residual risk / "re-raise only if":**
  - someone proposes adding a **`bin` field** or an actual `npx fkit` install surface — that needs a
    design spec and a new ADR, not this one;
  - someone proposes **publishing to npm** (scoped or otherwise) — the owner's "not now" was explicit,
    so re-raise only with a concrete reason the timing changed;
  - the release flow stops being tag-driven, or self-update stops resolving versions via git tags —
    which would remove the main structural reason version bumping is load-bearing.

## Related

- [ADR-001](adr-001-package-json-stays-metadata-only.md) — superseded by this ADR.
- [ADR-009](adr-009-claude-code-native-is-the-only-runtime.md) — Omnigent removal (context for the
  stale `description`/`keywords`).
- `ai-agents/sprints/sprint-2.md` — the sprint whose task 2 this decision unblocks; contains the
  owner-decision block this ADR records.
- `ai-agents/tasks/backlog/build-claude-self-update.md`, `ai-agents/tasks/backlog/delete-omnigent-directory.md`.
- `package.json:1-26`, `bin/release.mjs:1-66`, `VERSION`, `omnigent/fkit.sh:48`, `install.sh`.
