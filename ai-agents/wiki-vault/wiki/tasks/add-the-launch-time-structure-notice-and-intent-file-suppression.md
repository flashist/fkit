# Add the launch-time structure notice and per-path intent-file suppression

**Source**: `ai-agents/tasks/done/0247-add-the-launch-time-structure-notice-and-intent-file-suppression/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 4 P6 · task `0247` · owner `fkit-coder`

## Goal

The **awareness layer** — *nobody runs what nobody is told to run.* A cheap, read-only, notice-only
pass on the existing every-launch hook that prints **one stderr line** when the project does not
conform.

Owner ruling Q3, verbatim **"Yes + yes (Recommended)"**. The design made this unit **conditional on
that approval**; the condition is discharged and the unit is licensed. **The repair's only entry
point stays the on-demand check** — the notice is never a repair and never a prompt.

## Key Changes

- **One stderr line**, in the same channel and shape as convergence's own announcements, and
  **complete silence on a conforming project**.
- **No memory.** The notice prints while the mismatch exists and stops when it is fixed —
  self-limiting the way the orphan cleanup is. ⛔ **No per-project progress or cursor state anywhere**;
  ADR-015's rejected cursor stays rejected.
- **Per-path intent-file suppression**, on the `ai-agents/.fkit-keep-out` precedent — *"It records
  INTENT, not progress."* A **tracked** entry names one path and means *"divergence here is
  deliberate; stop telling me about it."*

  **Two scope rules, binding, and each rules out an easier design:**
  - ⛔ **No global switch** — it would mute mismatches a future version introduces at unruled paths.
  - ⛔ **No per-mismatch keying** — that records a *position*, which is **the rejected cursor by the
    back door**.
- **The owned consequence, stated in the artifact's own docs:** a suppressed path stays silent **even
  when a future version changes what ships there**. Reversible by deleting the entry; survives a
  clone; shared with teammates.
- **Safety-bar rows as tests:** non-fatal on every failure, symlink refusal (`-L`-first), keep-out
  respect, stderr-only output.

## Outcome

**The launch path gains no new power.** ADR-015's invariant is unchanged for this path — the notice is
read-only, writes nothing to the consuming project, and the verification is that on a conforming
fixture **launch output is byte-identical to before the change**.

The per-path scope is proven rather than asserted: the fixture adds an intent entry for one drifted
path and requires that **a second drifted path still notices**.

⚠️ Closed `(agent-closed — not owner-verified)`; Sprint 4 archived unverified.

## Related
- [[tasks/sprint-4-ship-the-use-ready-self-healing-update]]
- [[systems/launch-convergence-and-init]] — the every-launch hook this piggybacks, and the keep-out precedent
- [[decisions/adr-015-additive-launch-convergence-no-migration-mechanism]] — the invariant unchanged for this path, and the cursor it rejected
- [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]]
- [[tasks/record-the-companion-adr-licensing-the-consent-gated-structure-repair]] — records the Q3 approval this unit was conditional on
- [[tasks/author-the-structure-spec-and-its-scaffold-inventory-drift-test]]
- [[tasks/build-the-hash-manifest-generator-and-completeness-test]]
- [[tasks/build-the-producer-owned-structure-check-skill]] — the repair's only entry point; this notice is awareness only
- [[systems/install-and-self-update]]
- [[tasks/design-the-post-update-structure-check]] — the design's §5 candidate 2, which this unit is
