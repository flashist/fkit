# Build the hash-manifest generator and its completeness test — the repair path's determination layer

## ID
0244

## Sprint
Sprint 4

## Priority
Sprint 4 P2

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

**Implementation unit 3 of the `0241` design** — report
[`2026-08-06-design-post-update-structure-check.md`](../../../knowledge-base/reports/2026-08-06-design-post-update-structure-check.md)
§7 ("The determination layer") and §11. Authority:

- **Q6 — the manifest, owner ruling verbatim: "Fold it in (Recommended)"** (`AskUserQuestion`, live
  `fkit lead` session, **2026-08-06**) — the hash manifest folds into the structure-check capability
  as its **determination layer**.
  [ADR-015](../../../knowledge-base/decisions/adr-015-additive-launch-convergence-no-migration-mechanism.md)'s
  re-raise **trigger 2 has fired** (report §3: **7 drifting fkit-authored files ≥ 3**), so the scope
  call the ADR deferred is taken — by the owner, not agent-side.
- The mechanism itself is **already recorded** in ADR-015 §Rejected alternatives ("deferred, not
  rejected"): hash the on-disk file; byte-match against every version fkit ever shipped; match →
  untouched → safe to replace; no match → owner-edited → never touch, report. Stateless, no cursor,
  survives a clone, no LLM. **Only the manifest can decide touched-or-not** — the spec (`0243`) is
  prose and decides *what should exist*; neither alone suffices (report §7).

**§11 note carried verbatim:** this unit depends on nothing (the mechanism is recorded) but **ships
behind `0242`** — buildable immediately, released as part of the licensed capability once the
companion ADR exists.

## What to build

1. **The manifest generator**, per report §7's "Manifest home" and hashing contract — specified there
   to the level a builder needs:
   - Built from fkit's **git history** by a **rename-aware walk across all three historical homes**
     of the scaffold tree (ADR-015 Context §2 names them: `generic/ai-agents`,
     `omnigent/scaffold/ai-agents`, `claude/scaffold/ai-agents`), so *"any version fkit has ever
     shipped of that file"* means **every shipped blob per path across its homes**, not just the
     current path's history.
   - **Root context files included:** `CLAUDE.md`/`AGENTS.md` bodies are hashed **with the
     marker-delimited region elided**, reusing the whole-line marker recognition `marker_lines`
     already defines (report §8) — never a re-implementation of that contract.
   - **CRLF → LF normalization on both sides** (manifest generation and the on-disk file at check
     time) — the contract is part of the manifest's definition, stated in report §7, so record it in
     the manifest artifact/generator, not only in tests.
   - **Regenerated whenever the shipped share content is built, not at semver releases** — the
     distribution is sha-keyed and installable at an arbitrary ref (ADR-015 Context §4).
2. **The manifest artifact's home:** the install share, beside the structure-spec (`claude/` in the
   repo) — same wholesale-refresh staleness-proofing (report §4/§7).
3. **The completeness test:** a repo test asserting the manifest covers every shipped historical
   version of every spec'd fkit-authored path — **test red first**, per init's own "run red first"
   note (report §9). Include the **CRLF fixture**: an ending-only variant of a shipped file must
   classify **untouched-stale, never owner-edited** (report §7/§9).

### ⛔ Out of scope

- ⛔ **No classification consumer** — the check skill (`0245`) and repair path (`0246`) consume the
  manifest; this unit produces it.
- ⛔ **No consuming-project write, ever** — the generator reads git history and writes only
  repo/share artifacts.
- ⛔ No launch-path behavior change (`0247`'s territory), no silent auto-update of anything.
- ⛔ No `ai-agents/wiki-vault/` write
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  No commit, no re-rank, no task-file move.
- ⛔ No new devDependency without checking ADR-014's bar.

## Verification steps

1. The generator exists and produces a manifest covering every shipped blob per path **across all
   three historical homes** — spot-check a file that lived in more than one home (e.g.
   `ai-agents/README.md`) and show blobs from at least two eras present.
2. The CRLF contract is honored: the fixture proves an ending-only variant of a shipped file matches
   (classifies untouched-stale), and the normalization is applied at generation.
3. `CLAUDE.md`/`AGENTS.md` body hashes elide the marker region; a fixture with only block-drift
   still matches a shipped body.
4. The manifest lands in the share beside the structure-spec on install/self-host.
5. The completeness test exists, was demonstrated **red** first, and `npm test` is green.
6. The generator run mutates nothing outside the repo's `claude/` artifacts and `test/` fixtures;
   `git status --porcelain` shows nothing under `ai-agents/`.

## Notes

- **Depends on:** nothing
- Per report §11 the mechanism is already recorded in ADR-015, so this is buildable immediately.
- **⚠️ Ships behind `0242`** (report §11, verbatim "ships behind 1"): do not release the manifest as
  a shipped share artifact of the licensed capability before the companion ADR is recorded. Building
  and testing it is unblocked today.
- **Blocks:** `0245`, `0247`.
- **Source of truth:** report §7 (hybrid + hashing contract), §8 (elision), §9 (fixtures). Implement,
  do not re-derive.
- **Priority is `—` (unscheduled).** Filed to the **Backlog** board — no sprint named by the owner;
  no re-rank (ADR-035).
