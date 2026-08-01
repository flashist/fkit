# Reconcile the dual-homed file drift — byte-align live `ai-agents/` vs `claude/scaffold/ai-agents/`

## ID
0132

## Sprint
Sprint 2

## Priority
119

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

[ADR-027](../../../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md)
§Decision 2 requires the parity test to be **"preceded by a reconciliation change that byte-aligns the
six drifted files — without it the test fails on day one"**, and §Decision 3 makes the ordering part of
the decision: **convention → reconciliation → test.** The convention landed. **The reconciliation brief
was never filed** — a sweep on 2026-07-25 found no task for it in any of the three boards.

**Confirmed drift as of 2026-07-25** (verified this session, `diff` of the two conventions directories):

| File | Live `ai-agents/knowledge-base/conventions/` | Scaffold copy |
|---|---|---|
| `dependency-declaration-form.md` | present | **absent** |
| `dual-home-parity.md` | present | **absent — and correctly so** |

`dual-home-parity.md` is **deliberately** fkit-repo-only (ADR-027 §Decision 5, and marked `†` in
[`conventions/README.md`](../../../knowledge-base/conventions/README.md)) — a consuming project has no
`claude/scaffold/` tree, so the rule would govern directories it does not have. **Do not ship it.**

`dependency-declaration-form.md` is **not** marked `†`, and the same README states plainly: *"Every other
convention here is dual-homed and must stay byte-identical across both copies."* Its absence from the
scaffold is a live violation of the repo's own written rule.

**The user-facing cost, stated concretely.** That convention defines the exact `- **Depends on:**` form
`dashboard.sh` parses. A consuming project that never receives it gets briefs written in a decorated or
freehand variant, and its board silently reports blocked tasks as pullable — **the task-84 misreport
class**, shipped to every downstream project rather than caught once here.

**⚠️ The "six drifted files" figure in ADR-027 is from 2026-07-18 and is stale.** Two of the six may have
been fixed by later point-fixes (0043, 0077, 0086 all touched scaffold paths). **Re-derive the drift set
from the tree — do not implement against the ADR's count.** The two rows above are the conventions
directory only; other dual-homed trees are not yet swept.

## What to build

1. **Sweep both trees and derive the current drift set** — every fkit-authored file present in one home
   and absent from the other, or present in both and not byte-identical. Cover the whole dual-homed
   surface (`knowledge-base/`, and any other directory the scaffold mirrors), not just `conventions/`.
2. **Byte-align each genuinely drifted file**, live → scaffold or scaffold → live as correctness
   dictates. Known: copy `dependency-declaration-form.md` into
   `claude/scaffold/ai-agents/knowledge-base/conventions/`.
3. **Leave every deliberate exception alone, and write the exception list down** as the artifact 0133
   consumes:
   - `dual-home-parity.md` — fkit-repo-only (ADR-027 §5).
   - `conventions/README.md` — its index table necessarily lists each home's **actual** contents, so the
     two copies legitimately differ (ADR-027 §5).
   - `PROJECT.md`, `wiki-vault/index.md`, `wiki-vault/log.md` — the scaffold copies are deliberate
     **placeholders**; syncing them would ship fkit's own project data into a user's repo (ADR-027 §1).
   - Anything else the sweep finds that is legitimately divergent — **record the reason, not just the
     path**. An exception with no stated reason becomes an unfalsifiable permanent hole in 0133's test.
4. **Update `conventions/README.md` in both homes** if the sweep changes what each home contains.

## Verification steps

1. A fresh `diff -r` of the two dual-homed trees reports **only** files on the written exception list.
2. `claude/scaffold/ai-agents/knowledge-base/conventions/dependency-declaration-form.md` exists and is
   byte-identical to the live copy.
3. `dual-home-parity.md` is still **absent** from the scaffold (a "fix" that ships it is a regression).
4. The exception list exists as a written artifact with a stated reason per entry, in a location 0133
   can read.
5. `conventions/README.md` in both homes accurately describes that home's contents.
6. The existing test suite is green.

## Notes

- **Owner:** fkit-coder.
- **Depends on:** nothing.
- **Blocks:** 0133 — ADR-027 §Decision 3 makes the order binding; building the test first *"just produces
  a red suite nobody can act on."*
- **Filed 2026-07-25** from a producer sweep of ADR-027's follow-ups. Siblings: 0131 (scoping check),
  0133 (the parity test).
- **The exception list is the real deliverable, not the file copy.** The copy is ten seconds' work; the
  list is what makes 0133 buildable and what stops a future maintainer from "fixing" a deliberate
  divergence.
- **Do not fold this into 0133.** ADR-027 §3 separates them on purpose, and they are independently
  shippable: reconciliation is verifiable by `diff` today, with or without a test.
- No commit — leave the edits in the working tree.

## Close-out (2026-08-01) — read before "fixing" anything below

Closed by a **spawned producer with no owner channel** — `✅ Done (agent-closed — not owner-verified)`
(ADR-033 §5). The owner ruled on the parity model and on every review finding; that is **not** a
verification of done-ness.

**⚠️ Verification step 2 above is SUPERSEDED BY OWNER RULING, NOT MET — and must stay that way.** It
demands the scaffold copy of `dependency-declaration-form.md` be byte-identical to the live copy. It is
**deliberately not**: the owner ruled (2026-08-01) that it ships **GENERALIZED**. **Do not copy the live
file over the scaffold copy** — that would re-introduce the regression this task exists to prevent.

**⚠️ The sweep disproved ADR-027's core premise.** The drifted scaffold `conventions/*` files are **not**
stale copies left behind; five of the six are deliberate, de-fkit-ified, **audience-adapted** rewrites for
a consuming project. Byte-aligning them (which ADR-027 §Decision 2 mandates) would ship fkit's own
incident narrative and **4 verified-broken relative links** into every new project. Owner ruling
(2026-08-01), **Option B**: "audience-adapted" is a legitimate **third kind** alongside fkit-authored
✅ must-match and project-specific ⛔ never-sync; byte-aligning live → scaffold is **rejected as a product
regression**. **ADR-027 is NOT amended by this task** — amending it is an architect act, filed as `0186`.
Its "six drifted files" figure is stale **in kind, not in count**: all six still differ, and **none** were
fixed by `0043`/`0077`/`0086`, so this brief's own guess that two may have been fixed is **wrong**.

**Deliverable:** `test/dual-home-parity-exceptions.mjs` — **26 entries, each with its own specific
reason**. A full classifier run maps **456 of 456** `diff -rq` lines to an entry: **0 unmatched, 0 dead
entries**, and no over-broad blanket entry (the 10 `Files … differ` lines and every file-level `Only in`
line map to **specific file** entries; directory entries absorb only the 440 lines of fkit's own project
content).

**Other findings recorded:**
- `decisions/` and `reports/` are **NOT** part of the dual-homed surface — ADR-035 and `0174`'s report are
  not drift events, and **no ADR ever will be**.
- `reviews/README.md` is gone from **both** homes (absorbed into `tasks/README.md` by ADR-029's migration,
  commit `331f298`); its stale row is fixed.
- The convention's own prescribed check command was **structurally blind** to missing-from-scaffold drift
  and is now fixed.
- `claude/scaffold/universal-rules.md` is single-homed and outside the surface — task `0130` created no drift.
- `knowledge-base/reports/README.md` is an fkit-authored folder-purpose doc with no scaffold counterpart,
  inside a ⛔ never-sync directory. Covered by the directory entry, **not** drift. Whether it *should*
  ship is a separate scoping question, unfiled.
- Task `0178`'s contested home page resolves **in its favour**: `priority-is-rank-not-identity.md` is
  byte-identical in both homes today. `0178`'s brief is deliberately **not** edited.
- `/fkit-task-brief` scoping enforcement is **still pending** — `dual-home-parity.md`'s "Where this is
  enforced" section records that skill edit as outstanding. Untouched by this task.

**Verification:** `node --test test/*.test.js` → **551 pass / 0 fail / 17 suites**; `bash test/prove-red.sh`
→ hard gate PASSED. **No existing test file was modified** — this task adds no test by design; `0133` is
the one that adds it. Step 3 re-confirmed: `dual-home-parity.md` is still **ABSENT** from the scaffold.

**Review:** stateful, ledger in this folder. Verdict *changes requested — 6 defects, none blocking*.
**Codex coverage FULL, not degraded** (`codex-cli 0.145.0`, exit 0; R1 and R2 raised independently by both
reviewers). All six verified CORRECT by the coder; five fixed, one (R1) handed onward by owner ruling.

**⚠️ OUTSTANDING — R1 handed to task
[`0133`](../../backlog/0133-build-dual-home-parity-test/brief.md).** The 10 directory entries match
**bidirectionally**, so a real dual-homed file later added under one would silently escape `0133`'s
enforcement. **The assertion `0133` must add: no directory exception may cover a non-`.gitkeep` file
present in BOTH homes.** The `.gitkeep` carve-out is **required, not cosmetic** — 9 such files sit in both
homes today and would otherwise fire it immediately. Named near-miss: `knowledge-base/reports/README.md`,
same species as the enforced `tasks/README.md`. Recorded in the review ledger, the worklog, and as a
comment in the module `0133` imports.
