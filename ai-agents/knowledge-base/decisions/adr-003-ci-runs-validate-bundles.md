# ADR-003: Add CI running `omnigent/validate-bundles.sh`

- **Status:** **superseded** — Omnigent removed
  ([ADR-009](adr-009-claude-code-native-is-the-only-runtime.md)). `omnigent/validate-bundles.sh`, the
  script this ADR's CI would have run, no longer exists, and the CI never landed. **Kept for the
  record** — the need it identified (fkit has *no* automated verification) is still unmet and still
  open; see `../architecture.md`.

  > ⚠️ **Dated correction 2026-09-04 (`0281`, inside sweep `0357`) — the clause *"the need it
  > identified … is still unmet and still open"* is FALSE.** The Status bullet above is **left
  > byte-identical** as the record of what was written; ⛔ **its status VALUE is unchanged and this ADR
  > is still `superseded`.**
  >
  > **What landed.** Task `0256` (2026-08-12) wired **two** mechanisms, and they are different in kind:
  >
  > 1. **An in-release gate** — `bin/release.mjs` runs `npm test` before every release and **refuses to
  >    release a red tree**; there is no warn-and-continue path.
  > 2. **A CI workflow** — `.github/workflows/test.yml`, declaring `push` to `main`, `pull_request` and
  >    `workflow_dispatch` triggers.
  >
  > **What CI has actually done, measured 2026-09-04 and stated as a measurement with its date:** **33
  > runs on `ubuntu-latest` — 29 success, 4 failure.** Every one of them a **push to `main`**; no run has
  > been raised through the `pull_request` or `workflow_dispatch` triggers. First run 2026-08-12 (red, a
  > filesystem case-sensitivity divergence, repaired by task `0283`); most recent 2026-09-04, green. The
  > other three reds fell on 2026-08-21 and 2026-08-29 (×2). ⛔ **These are counts on a date, not a
  > standing property.** ⚠️ **Nothing here claims CI protects, guards or ensures anything** — of the two
  > mechanisms, the **release gate** is the one that has been watched refusing a red tree.
  >
  > ⭐ **THIS ADR'S OWN DECISION IS STILL DEAD AND STILL SUPERSEDED, and the *"the CI never landed"*
  > clause above is NOT flipped by this note.** The CI **this ADR decided on** — a workflow running
  > `omnigent/validate-bundles.sh` — never landed and now cannot: that script does not exist. What
  > landed under `0256` is a **different workflow** running a **different suite**. ⛔ **Nothing here
  > revives this ADR, and this note must not be read as ADR-003 having been implemented.** Only the
  > *need* it identified was met, and by other means.
  >
  > ⚠️ **The `see ../architecture.md` pointer is deliberately left unchanged**, for two reasons: it sits
  > inside the Status bullet, which this append-only correction does not edit; and that document's §9.1
  > is itself awaiting repair under an open task, so re-pointing at it today would aim a reader at text
  > known to be stale. The measurement above stands in its place.
  >
  > ⚠️ **Form note, so this ADR is not later cited as a precedent it is not.** The project's dated
  > correction-note form is written for an ADR *whose Status stays `accepted`*. ADR-003 is
  > **`superseded`**. The form is applied here **by analogy**, on the principle that recorded text is
  > history — which applies with more force, not less, to a superseded record. ⛔ **This is not a ruling
  > that the form covers superseded ADRs.**
  >
  > **Why ⚠️ and not ⛔.** Nothing in ADR-003 was overturned by `0256`; a status-line claim about the
  > project's verification posture was falsified by work done elsewhere.
  >
  > ⚠️ **Adjacent claims seen and deliberately NOT swept, so a later reader knows they were checked
  > rather than missed:** ADR-014's *"zero automated verification — no CI, no test suite, no `.github/`"*
  > (reads as Context/history) and **ADR-026's two present-tense *"no `.github/workflows/` in the tree"*
  > claims, which are false today. ⛔ **Reported, not fixed** — the owner did not rule either filed.
- **Date:** 2026-07-09
- **Deciders:** owner (relayed via fkit-producer during project initiation), recorded by fkit-architect
- **Implementation:** tracked as a task brief for fkit-coder (producer to write); this ADR records the
  decision and rationale only, not the implementation.
- **Corrections:** 2026-09-04 (`0281`, inside sweep `0357`) — this ADR carries **one** dated note
  inline, as a continuation block directly beneath the **`- **Status:**` bullet**, below the claim it
  corrects. It records that the *"still unmet and still open"* clause is **false** since task `0256`,
  names the two mechanisms that landed, and carries a dated CI measurement. ⛔ **The Status VALUE is
  unchanged and still reads `superseded`**, and ⛔ **this ADR's own decision is still dead** — the CI
  it decided on never landed and cannot. Marker legend: **⚠️ = a fact that drifted** (the decision is
  untouched); **⛔ = a decision that was overturned** (do not follow it). No existing line of this ADR
  was edited; the note is an append. ⚠️ **The form is applied here by analogy** — it is written for an
  ADR whose Status stays `accepted`, and this one is `superseded`.

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
