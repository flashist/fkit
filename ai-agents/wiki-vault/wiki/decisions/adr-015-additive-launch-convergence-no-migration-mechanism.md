# ADR-015: fkit converges `ai-agents/` additively on launch — it has no migration mechanism

**Date**: 2026-07-14
**Status**: accepted — **evidence amended 2026-07-14**; one supporting fact was falsified by implementation and review. **The decision is unchanged.**

## Context

The trigger was a proposed design — `migration-current.md` plus per-version `migration-X.Y.Z.md` files, walked in semver order on update, with natural-language items executed by a migration agent. The brief invited **evaluation, not validation**. Four facts decided it:

1. **The hook is *launch*, not `fkit update` — and it already exists.** `fkit update` refreshes the install share and **never writes to a consuming project**. What *does* write is `fkit-claude-init.sh`, on **every single launch**: it already re-copies agents and skills and idempotently ensures `.gitignore` entries. **fkit already runs a convergence loop against the project continuously.** `ai-agents/` is the one thing carved out of it, by an all-or-nothing `[ -e "$dest/ai-agents" ]` guard on the **parent**. That guard does two jobs at once — *"don't clobber the user's content"* (right) and *"don't add anything new"* (wrong, never intended). **It is at the wrong granularity.**
2. **The migration need has been additive-only across fkit's entire history.** All three historical homes of the scaffold tree were checked: the delta to a project's `ai-agents/` **path set** is **three additions, zero renames, zero deletions, zero moves — ever.** Stated precisely: that proves **paths, not bytes**. The destructive-path class has real-world incidence **zero**; the content-drift class does not.
3. **The fatal fact: `.fkit/` is gitignored — a version cursor cannot survive a `git clone`.** It is *not* "fkit has nowhere to write per-project state" (that objection is weak and false). A cursor is **cheap to write and impossible to keep correct**: clone on a second machine and you get a fully-migrated tree with **no cursor**, so the walk replays every migration against an already-migrated tree — unattended. **The mechanism's central state has no safe home in fkit's layout.**
4. **The distribution model is sha-keyed, so a semver walk is not well-defined.** `fkit update` reinstalls at `main` HEAD, not at a tag. Two installations can report the same `VERSION` and hold different content. `VERSION` is `0.1.30`, there are 30 tags and **zero migration files** — "no file for this version" is ~100% of the walk.

## Decision

### The invariant — owner-ratified, and the load-bearing line

> **Convergence never writes to a path that already exists.** Create-if-absent only. **No overwrite, no move, no delete — ever — inside a consuming project's `ai-agents/`.** fkit **adds**; it does not mutate.

Every "not required" in the safety bar is **downstream of it**.

- **Additive launch convergence — APPROVED.** The all-or-nothing guard is replaced by a **per-path create-if-absent** pass, running where convergence already runs: on launch. **It is "the migration" — and it is not a migration mechanism.**
- **The safety bar — RATIFIED IN FULL.** REQUIRED: **idempotency** (free by construction); **non-fatal failure** (was violated — a mid-convergence error **bricks the launcher**); **refuse on weird state**; **announce what you did** (which is what makes a dry-run unnecessary); **opt-out** (*deletion must be respectable*); **never re-add `.gitkeep` to a live directory** (the scaffold carries 10 — naive create-if-absent dirties `git status` on every launch). Not required: dry-run, rollback, refuse-on-dirty-tree — **and only because the invariant holds.**
- **The semver walk — REJECTED**, as **premature, not wrong**. No `migration-current.md`, no `migration-X.Y.Z.md`, no walk, no cursor, no migration agent.
- **Content drift — DEFERRED**, with eyes open. A knowing acceptance of a real, already-occurred case.

## Consequences

### Positive
- **Existing projects can gain new scaffold paths for the first time** — the concrete bug the investigation started from.
- **Convergence is continuous, not version-boundary**, so it also heals a project hand-broken *between* updates — which a cursor-based walk never would.
- **The one unattended path that touches a user's project is bounded by a one-line invariant.** *"fkit never deletes your stuff"* is a property, not a hope.

### Negative — stated rather than buried
- **Content drift is UNFIXABLE under this decision, and it has ALREADY OCCURRED.** The invariant is precisely what forbids fixing it: `ai-agents/README.md` **exists**, so convergence steps over it, forever. **The safety and the limitation are the same property — this is the trade.** This repo is drifted right now, in **two directions at once**: its copy is missing a section the scaffold has (the scaffold is right), and the scaffold names sprint files `plan-sprint-N.md` while the skills write `sprint-N.md` (**the repo is right; the scaffold's README is simply wrong**). The file **is read by an agent at runtime**. **The owner ruled with the cost in front of them:** *a stale README is not worth giving fkit the power to overwrite files in a user's project.*
- **A renamed folder yields both.** Rename `sprints/` → `iterations/` and convergence recreates `sprints/` alongside it. **No stateless mechanism can know a rename happened** — an inherent limit, to be *stated*, not discovered.
- **If a genuinely destructive migration ever arrives, nothing is in place.** Rated **high** risk and carried deliberately. The honest failure mode: it arrives *attached to a feature someone wants shipped*, and the path of least resistance is an `mv`/`rm` dropped into the unattended, every-launch, no-consent code path — **which this decision makes more capable right before the moment of temptation.**

### Amendment (2026-07-14) — a supporting fact was falsified; the decision stands
The safety bar asserted, as verified, that `cp -R` **writes through a symlinked `ai-agents/`, outside the project**. **False, and retracted.** It was never tested — it was *inferred* from the true fact that `[ -e ]`/`[ -d ]` dereference, then written down as though it had been. **No write-outside-the-project bug ever shipped.** Falsified twice independently: macOS/BSD `cp` refuses (rc=1); **GNU coreutils 9.1 refuses too**; BusyBox refuses; the historical write-through occurs only under `POSIXLY_CORRECT`.

**The three true grounds that replace it:** a **dangling** symlink → `cp` refuses → `set -euo pipefail` → **bricked launcher** (a DoS bug, real); a **live** symlink → GNU `cp` genuinely **does** write through, unreachable today only because `[ -e ]` short-circuits — **and this ADR's own additive convergence is what arms it**; a **file where the directory belongs** → silent skip, forever.

**It *strengthens* the decision:** the gate is not remediation of an existing bug, it is a **precondition of the change the ADR approves.** Amended in place rather than superseded because what changed is **evidence, not decision** — and the false sentence is **struck, not deleted**, so the record shows it was falsified by implementation, not quietly laundered.

### Re-raise only if
1. **Someone PROPOSES a change that would move, rename, or delete content inside a project's `ai-agents/`.** **The trigger fires on the proposal, not the implementation** — by the time a destructive migration is *written*, the wrong hook has already been chosen. It **voids this decision and returns to the owner.**
2. **A THIRD fkit-authored file starts drifting.** Two have.

*Not* a trigger: adding a folder, README, or file to the scaffold — **that is convergence, and it works.**

> *⚠️ Dated update 2026-08-06 (recorded by the 2026-08-07 sync; text above byte-identical):* **both
> triggers have now fired.** Trigger 1 fired on the owner's own 2026-08-06 structure-check proposal
> (*"if needed updated the structure"* — the trigger fires on the proposal), and the sanctioned
> re-raise ran as [[tasks/design-the-post-update-structure-check]] (`0241`): the design returned to
> the owner with this ADR's record in front of them, recommending a **companion ADR** licensing an
> in-session, consent-gated, propose-then-apply repair of **untouched-stale files only** — with the
> unattended launch path's invariant here **unchanged and in force**. Trigger 2 was measured fired
> the same day: **seven** fkit-authored files drift in fkit's own checkout (≥ 3), so the deferred
> hash manifest is the design's determination layer. The owner ruled all the design's open questions
> 2026-08-06; **the companion ADR is not yet recorded** (task `0242`, Backlog) — until it lands,
> this ADR remains the last word on disk.

> *✅ Dated update 2026-08-07 (recorded by the `0249` ingest; text above byte-identical):* **the
> companion ADR is now recorded** —
> [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]]
> (`ai-agents/knowledge-base/decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md`,
> accepted, filed 2026-08-07; all six rulings dated 2026-08-06). This ADR is **no longer the last
> word on content drift**: ADR-039 licenses the in-session, owner-present, consent-gated repair
> (v1 = replacement of untouched-stale fkit-authored files only — no move, no rename, no delete),
> while this ADR's invariant stays **unchanged and in force for the unattended launch path**.

## Related
- [[decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged]] — the companion ADR (recorded 2026-08-07, rulings 2026-08-06): licenses the consent-gated in-session repair; this ADR's invariant unchanged for the unattended path
- [[tasks/design-the-post-update-structure-check]] — task `0241` (2026-08-06): the sanctioned re-raise — spec + hash-manifest hybrid, consent-gated repair, companion-ADR recommendation
- [[tasks/converge-ai-agents-additively-on-launch]]
- [[decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer]] — the root-file seam, deliberately **not** dependent on this one's parked work
- [[decisions/adr-013-knowledge-base-root-holds-the-living-canon]] — its Consequences section already does `migration-current.md`'s authoring job; also the amend-in-place precedent
- [[decisions/adr-009-claude-code-native-is-the-only-runtime]] — the removal whose orphaned `.fkit/` state is the one destructive act still on the table
- [[tasks/design-version-to-version-migration-mechanism]] — the investigation behind it
- [[tasks/fix-scaffold-knowledge-base-folders]] · [[tasks/stop-init-failure-bricking-the-launcher]] · [[tasks/refuse-init-on-weird-ai-agents-state]] — the defects it spawned
- [[systems/launch-convergence-and-init]]
- [[systems/install-and-self-update]]
- [[tasks/sprint-2-remove-omnigent]]
- [[tasks/merge-fkit-rules-block-into-existing-root-context-files]]
- [[decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit]]
- [[systems/knowledge-base-structure]]
- [[systems/fkit]]
- [[tasks/remove-fkit-omnigent-orphan-residue]] — the one sanctioned destructive exception (announce-only, owner-ruled)
- [[tasks/ship-one-skill-one-output-convention-in-scaffold]] — a delivery via the convergence this ADR ratifies
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the additive invariant is *why* the consuming-project content-drift seam cannot be fixed by convergence, and stays a separate deferred decision
- [[tasks/investigate-dual-home-parity-live-vs-scaffold]] — task 49: why launch-time convergence cannot fix content drift by invariant
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — the additive invariant here forced that migration's consuming-project half into a **separate, deferred** decision; **ADR-015 is not reopened by it**
- [[tasks/design-task-folder-structure-and-id-scheme]] — task 74; the consuming-project migration was **deferred rather than solved**, so this ADR is **not reopened**
- [[tasks/migrate-tasks-to-folder-structure-and-update-tooling]] — task 76, the folder migration
- ✅ **Dated update 2026-08-13 (the `0263` resync): the capability licensed beside this invariant is BUILT and SHIPPED.** [[tasks/sprint-4-ship-the-use-ready-self-healing-update]] closed all eight follow-ups 2026-08-07/10. ⚠️ **This ADR's invariant is UNCHANGED and in force for the unattended launch path** — [[tasks/add-the-launch-time-structure-notice-and-intent-file-suppression]] is **read-only and writes nothing to the consuming project**, and its per-path intent file records **intent, not progress**, so §Context's rejected cursor stays rejected. The **hash manifest** this ADR deferred as a rejected alternative is now built ([[tasks/build-the-hash-manifest-generator-and-completeness-test]]) as the capability's determination layer, on the owner's ruling that **re-raise trigger 2 had fired**. ⚠️ **All eight closed `(agent-closed — not owner-verified)`; Sprint 4 was archived unverified**
- **The tasks that built the licensed capability beside this invariant:** [[tasks/record-the-companion-adr-licensing-the-consent-gated-structure-repair]] (`0242`, and the source of this file's one-line dated cross-reference) · [[tasks/build-the-consent-gated-repair-path-inside-the-check-skill]] (`0246`, the capability this invariant forbids the **unattended** path — and only that path — to have) · [[tasks/wiki-ingest-of-the-structure-check-design-report-and-companion-adr]] (`0249`, which gave this page its dated correction)
- [[tasks/fix-the-version-labeled-sha-triggered-update-banner]] — `0257`: ⚠️ **this ADR's §Context §4 is why the banner's trigger was left alone.** Distribution is **sha-keyed**, so comparing shas is correct; only the wording was wrong
- [[tasks/record-fkits-release-hygiene-channel-version-role-and-manifest-duty]] — `0252` (2026-08-13): `RELEASING.md` §2 cites **this ADR's Context §4** as where the sha-keyed-distribution consequence is argued — **two installs can report the same `VERSION` and hold different content**
- [[decisions/adr-043-claude-is-not-a-structure-conformance-surface-the-refresh-is-the-guarantee]] — ⛔ **does NOT touch or amend this invariant** (its C2); it records where this invariant's scope **ends**, and notes that on **deletion** `.claude/`'s unconditional refresh is **strictly stronger** than anything this invariant permits
- [[tasks/decide-whether-claude-enters-the-structure-conformance-surface]] — the task that produced it
