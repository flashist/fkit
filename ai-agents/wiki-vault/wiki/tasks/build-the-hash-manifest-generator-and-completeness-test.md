# Build the hash-manifest generator and its completeness test — the repair path's determination layer

**Source**: `ai-agents/tasks/done/0244-build-the-hash-manifest-generator-and-completeness-test/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 4 P2 · task `0244` · owner `fkit-coder`

## Goal

Build the layer that answers the question the spec cannot: **has this file been touched by its
owner, or is it just an older version of what fkit shipped?** Owner ruling Q6, verbatim **"Fold it in
(Recommended)"**.

**The mechanism was already recorded** — it sits in
[[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]'s rejected alternatives as
*"deferred, not rejected"*: hash the on-disk file, byte-match against every version fkit ever shipped;
match → untouched → safe to replace; no match → owner-edited → **never touch, report**. Stateless, no
cursor, survives a clone, no LLM.

**ADR-015's re-raise trigger 2 had fired** — the design measured **7 drifting fkit-authored files**
against a threshold of 3 — so the scope call ADR-015 deferred was taken **by the owner, not
agent-side**.

## Key Changes

- **A rename-aware walk across all three historical homes** of the scaffold tree, so *"any version
  fkit has ever shipped of that file"* means **every shipped blob per path across its homes** — not
  just the current path's history.
- **Root context files included**, with `CLAUDE.md`/`AGENTS.md` bodies hashed **with the
  marker-delimited region elided**, reusing the existing whole-line marker recognition contract —
  **never a re-implementation of it**.
- **CRLF → LF normalization on both sides** — generation *and* the on-disk file at check time. The
  brief insisted this be recorded **in the manifest artifact and generator, not only in tests**,
  because it is part of the manifest's definition.
- **Regenerated whenever the shipped share content is built, not at semver releases** — the
  distribution is sha-keyed and installable at an arbitrary ref.
- **The completeness test**, run **red first**, including a **CRLF fixture**: an ending-only variant
  of a shipped file must classify **untouched-stale, never owner-edited**.

## Outcome

**Neither artifact suffices alone**, and that is the design's point: *the spec is prose and decides
what should exist; **only the manifest can decide touched-or-not**.*

**Depends on nothing but ships behind `0242`** — the mechanism was already recorded, so it was
buildable from day one; **releasing it as a shipped artifact of the licensed capability waited on the
companion ADR.** That split (buildable now, releasable later) is why it took rank P2 on a board whose
P1 gates it.

⚠️ Closed `(agent-closed — not owner-verified)`; Sprint 4 archived unverified. **The manifest's
staleness guard is now enforced by CI as well as by hand** — `test/structure-manifest.test.js` runs
under `npm test`, which `.github/workflows/test.yml` runs on every push to `main`
([[tasks/gate-releases-so-an-untested-tree-cannot-ship]]).

## Related
- [[tasks/sprint-4-ship-the-use-ready-self-healing-update]]
- [[tasks/author-the-structure-spec-and-its-scaffold-inventory-drift-test]] — the other input; neither alone suffices
- [[tasks/record-the-companion-adr-licensing-the-consent-gated-structure-repair]] — the licence this ships behind
- [[tasks/build-the-producer-owned-structure-check-skill]] — the consumer that classifies from it
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — where the mechanism was already recorded, and whose trigger 2 fired
- [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]]
- [[tasks/gate-releases-so-an-untested-tree-cannot-ship]] — the release gate that now stops a stale manifest shipping
- [[systems/testing-and-verification]]
- [[tasks/add-the-launch-time-structure-notice-and-intent-file-suppression]] — `0247`, a consumer of this manifest at launch time
- [[systems/launch-convergence-and-init]] · [[tasks/design-the-post-update-structure-check]]
- [[tasks/decide-whether-claude-enters-the-structure-conformance-surface]] — why the manifest is **not** extended to `.claude/`: it exists to separate `untouched-stale` from `owner-edited`, and **"owner-edited" is not a state that survives a launch**
