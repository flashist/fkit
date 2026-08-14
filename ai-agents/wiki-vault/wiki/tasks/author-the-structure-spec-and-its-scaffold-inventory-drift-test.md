# Author the structure-spec `.md` (install share) and its scaffold-inventory drift test

**Source**: `ai-agents/tasks/done/0243-author-the-structure-spec-md-and-its-scaffold-inventory-drift-test/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 4 P3 · task `0243` · owner `fkit-coder`

## Goal

Ship the document that answers *what should exist* — the element the owner's original ruling names
directly: *"a verbatim explaination of what is needed in the structure as an .md file that the agents
will read"*. Owner ruling Q5, verbatim **"Yes (Recommended)"**: a **hand-authored prose spec in the
install share, guarded by a mechanical scaffold-inventory drift test.**

## Key Changes

**`claude/structure-spec.md`**, carrying:

- **The full path inventory** the installed version requires — the scaffold's files under
  `ai-agents/`, **plus** the project-root `CLAUDE.md` and `AGENTS.md`. ⚠️ The brief instructed
  **re-derive the count from `claude/scaffold/`, do not trust the figure it quoted.**
- **A class per path** from the design's six-class table — structural directory / fkit-authored
  reference file / owner-authored seed / wiki-authored living file / placeholder / root context file —
  each with its check and repair semantics. Owner-authored seeds are **never content-checked**.
- **Prose per path** — what it is *for* and what "conforming" means. *That is the "verbatim
  explaination" the ruling asks for, and the part a raw listing cannot carry.*
- **An ADR-005 routing note on every wiki-vault row** — existence-only checks, `schema.md`
  content-check report-only, any vault repair routed to `fkit-wiki` — *"so no future reader of the
  spec is instructed into a violation."*
- **No `version:` field.**

Plus **the scaffold-inventory drift test**, run **red first** per the repo's own custom: a scaffold
change cannot land without the spec moving in the same commit.

## Outcome

### Why the install share, not the project — the trap it avoids

A project-local copy is **self-defeating**: create-if-absent steps over it forever, so the spec would
describe a stale version — **the exact trap it exists to fix**. The install share is refreshed
wholesale (`rm -rf` + `cp -R`), so the spec is *by construction* the installed sha's spec and needs
**no version field at all**.

### The drift test is what makes this spec not-a-mirror

*Hand-maintained mirrors rot* — the design cites a prior incident by name. **The test is the whole
reason a hand-authored document is acceptable here.**

⚠️ Closed `(agent-closed — not owner-verified)`; Sprint 4 archived unverified.

## Related
- [[tasks/sprint-4-ship-the-use-ready-self-healing-update]]
- [[tasks/design-the-post-update-structure-check]] — the design's §4, the source of truth
- [[tasks/record-the-companion-adr-licensing-the-consent-gated-structure-repair]] — the licence this ships behind
- [[tasks/build-the-hash-manifest-generator-and-completeness-test]] — the *other* half: the spec says what should exist, the manifest says whether it was touched
- [[tasks/build-the-producer-owned-structure-check-skill]] — the consumer
- [[decisions/adr-005-vendor-wiki-query-skill-reads-decentralized]] — the routing note on every vault row
- [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]]
- [[systems/testing-and-verification]]
- [[tasks/add-the-launch-time-structure-notice-and-intent-file-suppression]] — `0247`, a consumer of this spec at launch time
- [[systems/launch-convergence-and-init]] · [[tasks/design-the-post-update-structure-check]]
- [[tasks/decide-whether-claude-enters-the-structure-conformance-surface]] — ⛔ ruled that this spec keeps **zero `.claude` rows BY DECISION**; absence here is now evidence of a ruling, not an omission to correct
