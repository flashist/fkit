# ADR-013: The knowledge-base root holds only PROJECT.md and architecture.md; everything else is filed by kind

**Date**: 2026-07-13
**Status**: accepted (amended 2026-07-13, before first action)

## Context
`ai-agents/knowledge-base/` grew organically. Its root held `PROJECT.md`, `architecture.md`, three subfolders — and **eight loose files of at least four different kinds**: two standing conventions, an audit, two verifications, an executed plan, and two evaluations.

Two of those were **standing conventions the project reads on every run** and obeys as law. The other six were **snapshots of a moment.** They are not the same kind of thing, and they sat in the same place — so **a reader landing in the root could not tell the live rules from the spent paperwork.**

The drift was structural, not incidental: `incidents/` was created ad hoc during an incident with no documented convention; `decisions/` acquired its `adr-NNN-` shape **by accident, after the fact**. Only `history/` was ever deliberately specified. Left alone, the root and `incidents/` would repeat that pattern.

**And it was not hypothetical.** The knowledge-base hygiene task **had already improvised a rule in the absence of one** — directing that an evaluation, a verification, the audit, the plan **and the 2026-07-10 incident itself** all be swept into `history/`. **That would have emptied `incidents/` on the day it was formalized**, and mis-filed four records as superseded designs. This ADR exists to settle the convention *before* that pass ran.

*(The brief that prompted this ADR listed six loose files; by the time it was picked up there were eight. **That is itself evidence of the drift rate.**)*

## Decision
**The root holds exactly two documents — `PROJECT.md` and `architecture.md`.** They are the project-defining pair: *what we are building* and *how it is built*.

**Everything else is filed by kind:**
- `conventions/` — **standing rules** (*how we do it*). Prescriptive, current, maintained in place, **never dated**.
- `decisions/` — ADRs (*why*). Immutable once accepted.
- `incidents/` — what happened to **our own runtime**.
- `reports/` — work performed at a point in time (audits, verifications, evaluations, plans).
- `history/` — **superseded design docs only**, per [[decisions/adr-002-archive-pre-omnigent-design-docs]]. *Not* the general archive.

**The governing principle: records don't go stale, designs do.** An audit, a verification, an evaluation, a plan, an incident — **none of them become false when the system they describe is removed.** They stay true; they happened. So they are **never relocated once filed.** Only designs go stale.

**The checkable forms:**
- **`ls knowledge-base/*.md` returns exactly those two names.**
- **A dated filename never lives at the root or in `conventions/`** — a dated name means "a record of a moment".

## Consequences
- A reader can tell **live law from spent paperwork** by looking at the folder, not by reading the file.
- The conventions/decisions split is enforced: **an ADR may *create* a convention; it never *is* one.** *If you have to read an ADR to know how to format a status report, the convention is missing.*
- A report is **never promoted** into `conventions/`. If its conclusion hardens into a rule, the rule gets its **own** convention document and the report stays put as the evidence.
- `history/` **stays closed at the four documents it already holds.**
- **⚠️ It broke shipped product source.** Moving the two conventions into `conventions/` left skills under `claude/` pointing at the old paths — and they fail **silently**, falling back to their own inline copies. See [[tasks/repair-knowledge-base-paths-in-product-source]]. *The restructure was right; the fallout was real and had to be chased into the code.*

## Related
- [[systems/knowledge-base-structure]]
- [[decisions/adr-002-archive-pre-omnigent-design-docs]]
- [[tasks/formalize-knowledge-base-incidents-folder]]
- [[tasks/knowledge-base-hygiene-post-omnigent]]
- [[tasks/repair-knowledge-base-paths-in-product-source]]
- [[systems/fkit]]
- [[tasks/amend-subagent-disconnect-incident-doc]]
- [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]
- [[systems/launch-convergence-and-init]]
- [[tasks/design-version-to-version-migration-mechanism]]
- [[tasks/fix-scaffold-knowledge-base-folders]]
- [[tasks/stop-agents-asserting-unchecked-repo-state]]
- [[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]]
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]]
