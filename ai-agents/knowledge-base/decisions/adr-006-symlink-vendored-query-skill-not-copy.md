# ADR-006: Distribute the vendored `query` skill via relative symlinks, not byte-identical copies

- **Status:** superseded by ADR-007 (distribution mechanism only — this ADR's underlying rationale for
  wanting a single source of truth still stands; ADR-007 achieves it a different way, without symlinks,
  after this ADR's mechanism caused a real, reproducible git pathspec failure not caught by this ADR's
  own investigation. See
  [`adr-007-plain-copies-plus-sync-script-and-drift-check-for-vendored-query-skill.md`](adr-007-plain-copies-plus-sync-script-and-drift-check-for-vendored-query-skill.md).)
- **Date:** 2026-07-10
- **Deciders:** owner + fkit-architect

## Context

ADR-005 decided to vendor the wiki `query` skill into all six fkit bundles (fkit-wiki keeps the
canonical copy; the other five get byte-identical copies), and explicitly accepted a named cost in
its Consequences section: *"six copies of the same skill file must now be kept in sync by hand — no
shared/base-config or shared-skill mechanism exists in Omnigent."*

Before fkit-coder began the vendoring rollout, the owner asked whether that specific accepted cost
could be eliminated by symlinking the five copies to the canonical file instead of copying it.
fkit-coder investigated directly (source + a live `cp -R` test) and surfaced two closed findings plus
two caveats it could not close alone: (1) whether GNU coreutils `cp -R` (Linux) preserves symlinks the
same way BSD/macOS `cp -R` does, and (2) whether a symlink-of-a-symlink survives Codex's own runtime
skill-linking step for `fkit-adversarial-reviewer` (the one recipient bundle on `harness: codex`).

Per role rules, the architect independently re-verified all of this against the installed Omnigent
package source this session (not just fkit-coder's account of it), plus this repo's own
`vendor-agents.sh` and `config.yaml` files:

1. **Skill discovery is symlink-transparent and correctly bundle-scoped.**
   `omnigent/spec/parser.py`'s `_discover_skills` (~1919-1969, installed package) does
   `sorted(skills_dir.iterdir())`, `skill_dir.is_dir()` (follows symlinks), `(skill_dir /
   "SKILL.md").exists()`, then reads content — all plain filesystem calls that transparently
   dereference symlinks. `iterdir()` yields each entry's **unresolved** path
   (`<bundle>/skills/query`, not the symlink's target), so a symlinked skill dir is still correctly
   attributed to its *own* bundle's skill list, never the target's.
2. **Bundle-root inference is symlink-safe too** — a finding beyond fkit-coder's own investigation.
   `omnigent/spec/omnigent.py:175` computes `bundle_dir = spec.skills[0].skill_dir.parents[1]`: pure
   string-path arithmetic on the unresolved `skill_dir` from finding 1. It always yields the agent's
   own real bundle root regardless of whether `spec.skills[0]` happens to be the symlinked skill, and
   regardless of skill ordering — no special-casing required.
3. **The Codex caveat is closed, not merely plausible.** `omnigent/inner/codex_executor.py`'s
   `_populate_codex_skills` (~519-533) does `link_path.symlink_to(skill_dir.resolve())` when it
   symlinks selected skills into `$CODEX_HOME/skills/<name>`. `.resolve()` fully collapses any
   symlink chain to the final canonical absolute path *before* creating that link. So a proposed
   `omnigent/fkit-adversarial-reviewer/skills/query` → `../../fkit-wiki/skills/query` symlink, run
   through Codex's own re-symlinking into `$CODEX_HOME/skills/query`, resolves to a single, direct,
   non-chained link at the point Codex actually reads it. No double-indirection risk. (fkit-wiki
   itself, also `harness: codex`, keeps `query` as a real file per ADR-005 point 1, so this only
   matters for fkit-adversarial-reviewer as a symlink *source*.)
4. **The claude-sdk harness path (fkit-producer, fkit-coder, fkit-reviewer, fkit-architect) is lower
   certainty but low risk.** Skills are exposed to the Claude Code CLI via `--plugin-dir <bundle_dir>`
   plus a `.claude-plugin/plugin.json` manifest (`omnigent/inner/bundle_skills.py`) that only names
   the plugin — it does not enumerate individual skill file paths. Claude Code's own runtime directory
   scan is therefore standard filesystem traversal, which plain POSIX file reads transparently follow
   through a symlink same as any other file. This is inferred from the absence of any path-enumeration
   step in Omnigent's own manifest code, not traced into Claude Code CLI's closed implementation —
   flagged honestly as the one lower-certainty leg of this decision (see Consequences).
5. **The `cp -R` platform caveat does not actually apply to this script's invocation shape.**
   `omnigent/vendor-agents.sh` runs `cp -R "$d" "$dest/.fkit/agents/"` with no `-H`/`-L`/`-P` flags,
   where `$d` is always a real directory, never itself a symlink; the proposed symlinks would be
   nested *inside* it. POSIX `cp` semantics (matched by both GNU coreutils and BSD/macOS defaults for
   `-R` without `-H`/`-L`) preserve symlinks encountered during the recursive tree walk rather than
   dereferencing them. The historical GNU/BSD divergence people usually cite is about whether a
   symlink passed *as the top-level command-line argument* gets dereferenced — irrelevant here since
   `$d` is a real directory. fkit-coder's live `cp -R` test on macOS/BSD confirmed preservation.
   Recommend adding `-P`/`--no-dereference` anyway: free, zero-downside, explicit pinning for future
   readers/maintainers, not a fix for an observed gap.
6. **Git tracks POSIX symlinks fine** (mode 120000) — not a new constraint for this Unix-only project.

## Decision

Adopt symlinks in place of byte-identical copies for the `query` skill vendored under ADR-005. This
**amends one specific accepted consequence of ADR-005** (its distribution mechanism) — it does not
reopen or reverse ADR-005's core decision (vendor `query`, reads decentralized, writes stay
fkit-wiki-exclusive), which is unaffected and stays intact.

1. `omnigent/fkit-wiki/skills/query/SKILL.md` remains the one real file — canonical source and
   fkit-wiki's own copy, unchanged in content from ADR-005.
2. `omnigent/fkit-{producer,coder,reviewer,architect,adversarial-reviewer}/skills/query` become
   relative symlinks: `query -> ../../fkit-wiki/skills/query`.
3. Add `-P` to `vendor-agents.sh`'s `cp -R` call, making symlink preservation explicit rather than
   implicit/default-dependent on both platforms.
4. Implementation (creating the symlinks, editing `vendor-agents.sh`, and verifying with a real
   `vendor-agents.sh` dry run into a scratch directory before calling it done) is fkit-coder's, per
   the same architect-designs / coder-implements split as ADR-004 and ADR-005.

## Options considered

- **Symlink to the canonical file (chosen)** — eliminates the hand-sync cost entirely; verified safe
  across both harnesses this project uses (claude-sdk and codex) and across the vendoring script.
- **Keep byte-identical copies (ADR-005 as originally written)** — rejected: leaves a real,
  now-demonstrably-avoidable hand-sync cost in place for no remaining benefit.
- **Build-time codegen/copy step (e.g. a script that regenerates the five copies from source)** —
  rejected: adds a new script dependency and a new failure mode (forgetting to re-run it) for zero
  benefit over a plain symlink, since Omnigent's own skill discovery is already symlink-transparent at
  every layer checked.

## Consequences

- **Positive:** the ADR-005 cost is fully eliminated — going forward there is exactly one real
  `query/SKILL.md` to edit; all six bundles pick up an edit automatically.
- **Negative / costs:** a small new sophistication cost — a reader or tool less familiar with symlinks
  may be confused that `omnigent/fkit-coder/skills/query/` "contains no real content" of its own;
  worth a one-line comment at the symlink or in `vendor-agents.sh` for future maintainers.
- **Residual risks / "re-raise only if":** the claude-sdk-harness leg (finding 4) is inferred from
  standard filesystem semantics and the absence of path-enumeration in Omnigent's manifest code, not
  traced into Claude Code CLI's own implementation. If a claude-sdk-harness bundle (fkit-producer,
  fkit-coder, fkit-reviewer, or fkit-architect) is ever observed *not* loading its symlinked `query`
  skill, re-open this ADR rather than treating it as an unrelated bug — but don't treat the
  possibility itself as a blocker to shipping.

## Related

- `ai-agents/knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md` — the
  decision this ADR amends (distribution mechanism only; core decision unaffected).
- `ai-agents/knowledge-base/decisions/adr-004-fixed-role-based-titles-for-consult-spawns.md` — same
  architect/coder ownership split precedent.
- `ai-agents/tasks/backlog/give-every-agent-direct-wiki-query-access.md` — the task both ADR-005 and
  this ADR support.
- `omnigent/vendor-agents.sh` — script to be edited (fkit-coder) per Decision point 3.
