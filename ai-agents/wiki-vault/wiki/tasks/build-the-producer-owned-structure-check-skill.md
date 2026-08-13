# Build the producer-owned structure-check skill — read-only conformance report over spec + manifest

**Source**: `ai-agents/tasks/done/0245-build-the-producer-owned-structure-check-skill/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 4 P4 · task `0245` · owner `fkit-coder`

## Goal

A new **producer-owned** `/fkit-*` skill producing a **read-only per-file conformance report** over
the install share's structure-spec and hash manifest, the project's `ai-agents/` tree, and the root
`CLAUDE.md`/`AGENTS.md`.

Owner ruling Q4, verbatim **"Yes, producer (Recommended)"** — the producer already owns the task-file
lifecycle ([[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]]) and board hygiene;
this is the same custodianship. Wiki-vault repairs are **always routed to `fkit-wiki`**.

**Scope split with `0246`, deliberately:** this unit is **the check — read-only, in every branch**.
Building it first keeps a genuinely shippable deliverable independent of the licence.

## Key Changes

- **Six per-file outcome classes:** conforming / **missing** (convergence's job — *report, don't
  create*) / **untouched-stale** (manifest-matched an older shipped version) / **owner-edited**
  (matched nothing) / wrong-type / wiki-routed.
- **Class semantics per the spec's table:** owner-authored seeds existence-only and **never
  content-checked**; wiki-vault rows existence-only with `schema.md` content-check **report-only**
  and repair routed to `fkit-wiki`; placeholders defer to init's `.gitkeep` rule.
- **`CLAUDE.md`/`AGENTS.md` marker-elision hashing**, reusing the existing whole-line marker
  contract. ⚠️ **A malformed marker set — begin without end, end without begin, several pairs —
  makes the check REFUSE TO CLASSIFY and report the malformation**, mirroring the merge path's own
  refusal contract. Markers **absent** → the whole file hashes → classifies owner-edited. **Either
  way report-only, never repaired.**
- **Skill ownership wired completely** — declared to the producer in `skills_for_role()` *and* every
  surface that ownership fact touches, including the ADR-018 hook's test matrix. ⚠️ **This is the
  `0111`→`0112` lesson applied deliberately: an unwired skill exists and the hook denies it to
  everyone.**
- **Safety-bar inheritance as testable behavior** — symlink refusal (`-L`-first), keep-out respect,
  non-fatal failure, honest reporting — with fixtures for fresh / drifted-untouched / drifted-edited /
  renamed dir / symlinked subdir / dangling symlink / file-where-dir-belongs / keep-out / CRLF /
  chmod-000 / markers absent, malformed, and block-only-drift.

## Outcome

**Read-only in every branch is the whole contract** — the verification step is *grep the skill for any
write action on checked paths and find none*, and *nothing under `ai-agents/wiki-vault/` is written in
any fixture run.* The repair phase is [[tasks/build-the-consent-gated-repair-path-inside-the-check-skill]],
which needed the licence this one did not.

The skill ships today as `fkit-heal` — the producer's structure-conformance check and its
consent-gated repair, in one skill with the check phase always available and the repair phase gated.

⚠️ Closed `(agent-closed — not owner-verified)`. **`0245` and `0246` are the two rows the owner's
2026-08-08 note said were being personally verified; that verification never completed.** The promise
is now carried and discharged by task `0262` — see
[[tasks/sprint-4-ship-the-use-ready-self-healing-update]].

## Related
- [[tasks/sprint-4-ship-the-use-ready-self-healing-update]]
- [[tasks/author-the-structure-spec-and-its-scaffold-inventory-drift-test]] — input 1
- [[tasks/build-the-hash-manifest-generator-and-completeness-test]] — input 2
- [[tasks/build-the-consent-gated-repair-path-inside-the-check-skill]] — the repair phase built inside this skill
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — why vault repairs route away from the producer
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the custodianship precedent
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook whose matrix had to be updated
- [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] — the `0112` lesson this task applied
- [[systems/role-locked-sessions]]
- [[tasks/add-the-launch-time-structure-notice-and-intent-file-suppression]] — `0247`, the awareness layer; ⚠️ **this skill stays the repair's only entry point**
- [[tasks/update-the-docs-for-the-structure-check-capability]] — `0248`, which documents this skill
- [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]] — the licence recording the producer-custodian ruling this skill implements
- [[systems/install-and-self-update]] · [[systems/launch-convergence-and-init]] · [[tasks/design-the-post-update-structure-check]] — the surfaces this check reads and the design it implements
- [[systems/fkit]] — where `fkit-heal` sits in the role→skill ownership table
