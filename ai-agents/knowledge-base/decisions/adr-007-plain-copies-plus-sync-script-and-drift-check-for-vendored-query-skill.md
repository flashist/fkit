# ADR-007: Distribute the vendored `query` skill as plain copies again, kept in sync by a script with a mechanical drift-check — not symlinks

- **Status:** **superseded** — Omnigent removed
  ([ADR-009](adr-009-claude-code-native-is-the-only-runtime.md)). The per-bundle copies, the sync
  script, and the drift-check this ADR specifies all died with the Omnigent bundles; there is now one
  `/fkit-query` skill and nothing to vendor. It **supersedes ADR-006** on distribution mechanism only —
  that supersession stands as history, but both mechanisms are now moot.
- **Date:** 2026-07-10
- **Deciders:** owner + fkit-architect

## Context

ADR-006 replaced ADR-005's six byte-identical copies of the wiki `query` skill with five relative
symlinks: `omnigent/fkit-{producer,coder,reviewer,architect,adversarial-reviewer}/skills/query ->
../../fkit-wiki/skills/query`. The owner hit a real, reproduced problem ADR-006's own investigation did
not surface: git refuses a pathspec that goes "beyond a symbolic link" whenever a tracked directory
(containing a tracked file) is replaced by a symlink in the same change. Verified directly this
session:

```
$ git add omnigent/fkit-adversarial-reviewer/skills/query/SKILL.md
fatal: pathspec 'omnigent/fkit-adversarial-reviewer/skills/query/SKILL.md' is beyond a symbolic link
```

A workaround exists — `git add` the symlink path itself, or `git add -A`, both verified to correctly
stage the deletion + new symlink in one shot — but the owner's commit UI stages by individual file row
against the old nested path and hits the failure every time. The owner does not want every future skill
sync to depend on a workaround or muscle-memory fix; this is a recurring commit-workflow friction
point, not a one-off fluke, and warranted revisiting the mechanism (not ADR-005's underlying decision,
which is unaffected).

Full investigation, constraints, and the options comparison behind this decision are recorded in
`ai-agents/knowledge-base/reports/2026-07-10-eval-vendored-query-skill-distribution.md`. Key facts grounding this decision:

- `omnigent/vendor-agents.sh:5-9,20-27` copies each `omnigent/fkit-*/` bundle into a **consuming
  project's** `.fkit/agents/` via `cp -RP`. Every consuming project gitignores `.fkit/` by convention
  (`.gitignore:9`, confirmed in this self-hosting repo) — so the git pathspec failure can only occur in
  the **canonical `omnigent/` tree**, never in a vendored `.fkit/agents/` output.
- Every `fkit-*/config.yaml` documents canonical bundles as independently runnable directly, e.g.
  `omnigent run omnigent/fkit-coder` (`omnigent/fkit-coder/config.yaml:15-16`) — not only after
  vendoring. Each canonical bundle's `skills/query` must therefore carry real, self-sufficient content
  in the canonical tree itself; a design that only injects it at vendor-time would leave those bundles
  broken when run standalone.
- Skill discovery is directory-presence auto-discovery (no `skills: [...]` list in `config.yaml`),
  confirmed via `omnigent/fkit-coder/config.yaml`, consistent with ADR-006's own parser findings.
- `omnigent/validate-bundles.sh:1-46` is an existing manual pre-flight script (YAML-lints every
  `SKILL.md` frontmatter, runs `omnigent.spec.load` per bundle). **ADR-003** already decided to wire it
  into GitHub Actions CI — not yet implemented (no `.github/workflows` exists in this repo today,
  confirmed) — so any drift-check added to `validate-bundles.sh` inherits automatic CI enforcement for
  free the moment that pending workflow lands, no new infra decision required.
- ADR-005's originally-accepted, named cost: "six copies of the same skill file must now be kept in
  sync by hand — no shared/base-config or shared-skill mechanism exists in Omnigent."

## Decision

Adopt the owner's compile-script + drift-check mechanism. This **amends ADR-006's distribution
mechanism only** — it does not reopen ADR-005's core decision (vendor `query`, reads decentralized,
writes stay fkit-wiki-exclusive), which is unaffected and stays intact.

1. `omnigent/fkit-wiki/skills/query/SKILL.md` remains the single canonical source, content unchanged.
2. Replace the five symlinks with plain, regular-file copies again (as ADR-005 originally had) at
   `omnigent/fkit-{producer,coder,reviewer,architect,adversarial-reviewer}/skills/query/SKILL.md`.
3. Add a new script, `omnigent/sync-vendored-skills.sh` — deliberately **not** a repurposing of
   `omnigent/vendor-agents.sh`, whose documented job is copying bundles into a *consuming project's*
   `.fkit/agents/` (`omnigent/vendor-agents.sh:5-9`), a distinct concern from keeping the *canonical*
   tree's sibling copies in sync with each other. It overwrites the five sibling copies with the
   canonical file's byte content. Run it whenever the canonical file changes: at a fkit version
   bump/rollout, or ad hoc right after editing the canonical file.
4. Add a drift-check step to `omnigent/validate-bundles.sh` (extending the same pattern it already uses
   for frontmatter validation, `omnigent/validate-bundles.sh:1-46`): hash/byte-compare each of the five
   copies against the canonical source, fail loudly (nonzero exit, printed mismatch list) on any
   difference. Because ADR-003 already decided to run `validate-bundles.sh` in CI (pending
   implementation), this check gets automatic, always-on enforcement for free once that workflow lands.
5. Remove the `-P`/no-dereference flag ADR-006 added to `vendor-agents.sh`'s `cp -RP` call — there are
   no longer any symlinks in the canonical bundles for it to preserve, and leaving a no-op flag from a
   superseded decision in place would confuse future maintainers.
6. Implementation (restoring the five files as plain copies, writing `sync-vendored-skills.sh`, adding
   the drift-check to `validate-bundles.sh`, the `vendor-agents.sh` cleanup) is **fkit-coder's**, per
   the same architect-designs/coder-implements split as ADR-004, ADR-005, and ADR-006.

## Options considered

- **Compile script + drift-check (chosen)** — eliminates the git friction permanently, by construction
  (no symlinks left anywhere in the tracked canonical tree), while *also* making drift between the six
  copies mechanically detectable rather than silent — closing the exact gap ADR-005 named and accepted
  and ADR-006 tried, but failed, to close safely. Small new-script cost; fits the project's existing
  convention of small, purpose-built shell scripts; inherits free CI enforcement once ADR-003's already
  -decided, pending workflow lands.
- **Revert to ADR-005 exactly as originally written (plain hand-synced copies, no script)** — rejected:
  eliminates the git friction too, but reintroduces ADR-005's fully unmitigated drift risk (no
  mechanical detection of a missed or mistyped copy-paste edit at all) for only a negligible effort
  savings over the chosen option.
- **Keep ADR-006's symlinks as-is** — rejected: the git pathspec failure is real, reproducible, and
  recurring against the owner's actual commit workflow; not tenable to leave unresolved.
- **Git pre-commit hook** auto-running the compile script and/or blocking a commit on detected drift —
  rejected for now: this repo has zero hook/CI infrastructure today (no `.github/workflows`, no active
  `.git/hooks`), a materially bigger new precedent than the chosen option needs to solve the stated
  problem. Revisit only if drift is observed recurring in practice despite the CI-backed drift-check.
- **Symlinks only in the consuming-project vendored `.fkit/agents/` output, never in the canonical
  `omnigent/` tree** (the specific alternative the owner asked to have seriously weighed) — rejected as
  not viable: canonical bundles must be independently runnable via `omnigent run omnigent/fkit-coder`
  directly, which requires each canonical bundle's `skills/query` to already be self-sufficient in the
  canonical tree; a vendor-time-only symlink would leave canonical bundles broken standalone. Also buys
  nothing functionally over the chosen option, since Omnigent's skill loader doesn't care whether the
  five copies share an inode or are merely byte-identical files.

## Consequences

- **Positive:** the git pathspec failure is eliminated permanently and by construction — no symlinks
  remain in the tracked canonical tree, so a directory→symlink swap can never recur there. Drift between
  the six copies becomes mechanically detectable rather than silent, closing the exact gap ADR-005
  named and accepted. The mitigation already sits on a concrete, previously-decided path (ADR-003) to
  full CI enforcement with no further design work required.
- **Negative / costs:** a new small script (`sync-vendored-skills.sh`) to maintain. The compile step
  still depends on someone (or, eventually, CI) actually running it before a canonical-source edit is
  committed — not eliminated, only made cheaply and loudly detectable when skipped, until ADR-003's
  pending workflow is implemented.
- **Residual risks / "re-raise only if":** drift is observed recurring in practice even after the
  drift-check is in place and (once ADR-003 lands) running in CI — at that point, consider the
  git pre-commit hook option (rejected above for now) rather than treating recurrence as a reason to
  abandon this approach. Also re-raise if `omnigent/validate-bundles.sh`'s drift-check itself proves
  unreliable (e.g. false negatives from a comparison method that doesn't actually catch real
  divergence) — fix the check, don't revert the mechanism over it.

## Related

- `ai-agents/knowledge-base/reports/2026-07-10-eval-vendored-query-skill-distribution.md` — the full evaluation this ADR
  acts on.
- `ai-agents/knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md` — core
  decision (vendor `query`, reads decentralized, writes fkit-wiki-exclusive); unaffected by this ADR.
- `ai-agents/knowledge-base/decisions/adr-006-symlink-vendored-query-skill-not-copy.md` — superseded by
  this ADR on distribution mechanism only; see its updated status header.
- `ai-agents/knowledge-base/decisions/adr-003-ci-runs-validate-bundles.md` — the pending CI decision
  this ADR's drift-check piggybacks on for future automatic enforcement.
- `omnigent/vendor-agents.sh`, `omnigent/validate-bundles.sh` — files to be edited by fkit-coder.
- `omnigent/sync-vendored-skills.sh` — new file to be created by fkit-coder.
