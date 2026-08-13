# Record the companion ADR — the consent-gated structure-repair licence

**Source**: `ai-agents/tasks/done/0242-record-the-companion-adr-licensing-the-consent-gated-structure-repair/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 4 P1 · task `0242` · owner `fkit-architect`

## Goal

Turn the six owner rulings taken against the `0241` design into a **durable record** — an ADR via
`/fkit-record-decision`, and nothing else changed. **Until this ADR existed, the repair-path units had
rulings but no record to cite.**

Why an ADR at all: [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]]'s
`Re-raise only if` trigger 1 fired, and ADR-015's own amendment section says a changed ruling needs a
**new record, not an in-place amendment**. The owner chose a **companion ADR** (verbatim *"Companion
ADR (Recommended)"*) precisely so ADR-015's load-bearing property stays **literally true**: *the one
unattended code path that touches a user's project is bounded by a one-line invariant.*

## Key Changes

The ADR had to record, with date, channel and verbatim wording, all six rulings — the scoped grant,
the consent model, the trigger, the owning role, spec maintenance, and the manifest fold-in — plus the
rejected options **cited to the report rather than re-derived**.

⚠️ **A numbering trap the brief made the ADR state explicitly:** the rulings are numbered **Q1–Q6 as
they were put to the owner**, and they map onto the design report's §10 items **1, 2, 4, 5, 6, 7**.
Report §10.3 was pre-ruled settled scope and is **not one of the six**.

**One sanctioned edit outside the new file:** ADR-015 gains a **one-line dated cross-reference** —
an *evidence pointer*, in ADR-015's own amendment form, changing no ruling in it. The brief flagged
this for owner confirmation and the owner ruled it **in scope and no longer droppable** (verbatim
*"Keep in 0242 (Recommended)"*), closing the "drop it" branch in the brief **and** in the verification
step that had been written to accept either outcome.

## Outcome

**Landed 2026-08-07** as
[[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]]. ADR-015
carries the one-line cross-reference and no other change.

The task **gates four siblings** (`0243`, `0246`, `0247`, `0249`) and **ship-gates a fifth** (`0244` —
buildable immediately, releasable only behind the licence). That ordering exists for a stated reason:
*a repair capability built before its licence is recorded is the "mechanism built around the record"
the whole design exists to prevent.*

⚠️ Closed `(agent-closed — not owner-verified)`, and Sprint 4 was **archived unverified** — see
[[tasks/sprint-4-ship-the-use-ready-self-healing-update]].

## Related
- [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]] — this task's deliverable
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the invariant kept unchanged, and the file that gained the cross-reference
- [[tasks/design-the-post-update-structure-check]] — the `0241` design and its §10 rulings
- [[tasks/sprint-4-ship-the-use-ready-self-healing-update]]
- [[tasks/build-the-consent-gated-repair-path-inside-the-check-skill]] — the unit this licence exists for
- [[tasks/wiki-ingest-of-the-structure-check-design-report-and-companion-adr]]
- **The units this licence gates:** [[tasks/author-the-structure-spec-and-its-scaffold-inventory-drift-test]] · [[tasks/build-the-hash-manifest-generator-and-completeness-test]] (ship-gated, not dependency-gated) · [[tasks/add-the-launch-time-structure-notice-and-intent-file-suppression]]
