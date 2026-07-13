# ADR-003: Add CI running `omnigent/validate-bundles.sh`

- **Status:** **superseded** — Omnigent removed
  ([ADR-009](adr-009-claude-code-native-is-the-only-runtime.md)). `omnigent/validate-bundles.sh`, the
  script this ADR's CI would have run, no longer exists, and the CI never landed. **Kept for the
  record** — the need it identified (fkit has *no* automated verification) is still unmet and still
  open; see `../architecture.md`.
- **Date:** 2026-07-09
- **Deciders:** owner (relayed via fkit-producer during project initiation), recorded by fkit-architect
- **Implementation:** tracked as a task brief for fkit-coder (producer to write); this ADR records the
  decision and rationale only, not the implementation.

## Context

The initiation survey (`ai-agents/knowledge-base/architecture.md`, "Build / run / test") found **no
CI at all** — no `.github/workflows` directory exists in this repo (confirmed directly). The only
existing pre-flight check is `omnigent/validate-bundles.sh`
(`omnigent/validate-bundles.sh:1-40`), run manually: it YAML-parses every `SKILL.md` frontmatter
(catching, e.g., an unquoted `": "` in a description that would otherwise silently abort an agent at
`omnigent run` time) and, if a local Omnigent Python install is found at
`$OMNIGENT_PYTHON` (default `$HOME/.local/share/uv/tools/omnigent/bin/python`), additionally runs
`omnigent.spec.load` per bundle. When no such install is found, the script **degrades gracefully** —
it skips the `spec.load` step and still validates frontmatter, printing a note rather than failing.
This graceful degradation is exactly what makes a CI job for it cheap: it needs no Omnigent install to
provide real, if partial, coverage.

## Decision

Add a lightweight GitHub Actions workflow that checks out the repo and runs
`omnigent/validate-bundles.sh` — no Omnigent installation step required initially, since the script
degrades to the frontmatter-only YAML check without `$OMNIGENT_PYTHON` set. Full
`omnigent.spec.load` coverage can be added later by installing Omnigent in the workflow and setting
`OMNIGENT_PYTHON` accordingly.

## Options considered

- **Lightweight frontmatter-only CI now, upgrade later (chosen)** — near-zero setup cost (no Omnigent
  install, no provider credentials needed in CI), catches the failure mode the script's own comment
  calls out as the most dangerous (a bad `SKILL.md` frontmatter that "silently aborts the whole
  agent" only inside a live `omnigent run`), and is a strict improvement over the current
  manual-only status quo.
- **Full Omnigent-install CI from the start** — rejected for this pass: Omnigent isn't a pinned/vendored
  dependency of this repo (it's installed by the *consuming* environment via `omnigent setup`), so
  reliably installing a matching version inside CI needs more design (which version to pin, whether it
  needs model-provider credentials just to load specs, etc.). Deferred as a follow-up upgrade once the
  lightweight check is in place and proven.
- **No CI, keep validation manual** — rejected: manual-only validation means a broken bundle (bad YAML,
  bad frontmatter) can reach `main` and only surface at run time for whoever pulls it next; the
  lightweight version has no real downside to justify skipping it.

## Consequences

- **Positive:** every push/PR gets automatic frontmatter validation for all six bundles with no new
  external dependency in CI; a clear, cheap upgrade path exists (add Omnigent install + `spec.load`)
  once wanted.
- **Negative / costs:** CI coverage is partial until the `spec.load` step is added — a config error
  that only `omnigent.spec.load` would catch (as opposed to a YAML/frontmatter error) can still reach
  `main` undetected in the interim.
- **Residual risk / "re-raise only if":** the frontmatter-only check proves insufficient in practice
  (e.g. a bundle-breaking bug reaches `main` that only `spec.load` would have caught) — at that point,
  upgrade the workflow to install Omnigent and run the full `omnigent/validate-bundles.sh` `spec.load`
  path, rather than treating it as a new decision.

## Related

- `ai-agents/knowledge-base/architecture.md` — "Build / run / test" section (this ADR resolves open
  question 5 from that survey).
- `omnigent/validate-bundles.sh:1-40`.
- Follow-up: a task brief for fkit-coder (to be written by fkit-producer) implementing the workflow
  file itself.
