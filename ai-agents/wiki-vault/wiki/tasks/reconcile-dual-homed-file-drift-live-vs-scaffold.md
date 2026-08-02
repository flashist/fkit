# Reconcile the dual-homed file drift — live `ai-agents/` vs `claude/scaffold/ai-agents/`

**Source**: `ai-agents/tasks/done/0132-reconcile-dual-homed-file-drift-live-vs-scaffold/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-01
**Sprint/Tag**: Sprint 2 · ID 0132 · owner fkit-coder

## Goal
[[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] §Decision 3 makes the order binding — **convention → reconciliation → test**. The convention landed; **the reconciliation brief was never filed**. This is it. Its stated deliverable was to byte-align the drifted files and, more importantly, to **write down the exception list** that task `0133`'s parity test would consume: *"The exception list is the real deliverable, not the file copy."*

## Key Changes

⚠️ **The sweep disproved ADR-027's core premise, and the owner overruled it.** The drifted scaffold `conventions/*` files are **not** stale copies left behind — **five of the six are deliberate, de-fkit-ified, audience-adapted rewrites** for a consuming project. Byte-aligning them, which **§Decision 2 mandates**, would ship fkit's own incident narrative and **4 verified-broken relative links** into every new project.

**Owner ruling 2026-08-01, Option B:** *"audience-adapted"* is a legitimate **third kind** alongside fkit-authored ✅ must-match and project-specific ⛔ never-sync. **Byte-aligning live → scaffold is rejected as a product regression.**

⚠️ **Verification step 2 of this brief is SUPERSEDED BY OWNER RULING, NOT MET — and must stay that way.** It demanded the scaffold copy of `dependency-declaration-form.md` be byte-identical to the live copy. It is **deliberately not**: it ships **GENERALIZED**. **Do not copy the live file over the scaffold copy** — that re-introduces the regression this task exists to prevent.

**Deliverable:** `test/dual-home-parity-exceptions.mjs` — **26 entries, each with its own specific reason**. A full classifier run maps **456 of 456** `diff -rq` lines to an entry: **0 unmatched, 0 dead entries**, and no over-broad blanket entry.

**Other findings, each newly on the record:**
- **`decisions/` and `reports/` are NOT part of the dual-homed surface** — ADR-035 and `0174`'s report are not drift events, and **no ADR ever will be**.
- `reviews/README.md` is gone from **both** homes (absorbed into `tasks/README.md` by ADR-029's migration); its stale row is fixed.
- The convention's own prescribed check command was **structurally blind** to missing-from-scaffold drift — now fixed.
- `claude/scaffold/universal-rules.md` is **single-homed** and outside the surface, so task `0130` created no drift.
- ADR-027's *"six drifted files"* figure is stale **in kind, not in count**: all six still differ, and **none** were fixed by `0043`/`0077`/`0086` — so this brief's own guess that two had been repaired is **wrong**.

## Outcome
`node --test test/*.test.js` → **551 pass / 0 fail / 17 suites**; `prove-red.sh` hard gate PASSED. **No existing test file was modified** — this task adds no test by design. `dual-home-parity.md` re-confirmed still **absent** from the scaffold (shipping it would be the regression).

Stateful review, verdict *changes requested — 6 defects, none blocking*; **Codex coverage FULL** (`codex-cli 0.145.0`), R1 and R2 raised independently by both reviewers. All six verified CORRECT by the coder; five fixed, **one handed onward by owner ruling**.

⚠️ **R1 handed to task `0133`.** The 10 directory entries match **bidirectionally**, so a real dual-homed file later added under one would **silently escape** `0133`'s enforcement. The assertion `0133` had to add: *no directory exception may cover a non-`.gitkeep` file present in **both** homes.* The `.gitkeep` carve-out is **required, not cosmetic** — 9 such files sit in both homes today. Recorded in the ledger, the worklog, **and as a comment in the module `0133` imports**.

⚠️ **ADR-027 is NOT amended by this task** — amending it is an architect act, **filed as task `0186` and still open**. Until it lands, the ADR on disk still instructs a future implementer to ship a regression.

**Still pending, untouched here:** `/fkit-task-brief`'s dual-home scoping check, which `dual-home-parity.md` records as outstanding.

## Related
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the ADR this executes and **whose premise it disproved**
- [[tasks/build-dual-home-parity-test]] — task `0133`, the test this unblocked and the recipient of finding R1
- [[tasks/investigate-dual-home-parity-live-vs-scaffold]] — task 49, the investigation that produced ADR-027
- [[tasks/teach-dashboard-to-resolve-notes-dependencies]] — task `0107`, whose `dependency-declaration-form.md` scaffold gap this closed
- [[systems/knowledge-base-structure]] — the conventions folder and its dual-home rule
- [[tasks/fix-scaffold-knowledge-base-folders]] · [[tasks/ship-one-skill-one-output-convention-in-scaffold]] · [[tasks/align-conventions-readme-enforcement-item-live-vs-scaffold]] — earlier point-fixes in the same drift class
- [[decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry]] — copies this task's exception-list shape as its registry
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
- [[systems/testing-and-verification]] — related
- [[tasks/disambiguate-the-frozen-history-clause]] — related
- [[tasks/investigate-the-skill-ownership-fact-inventory-gap]] — task `0142` — the skill-ownership site inventory, and the report that **shipped incomplete twice**
