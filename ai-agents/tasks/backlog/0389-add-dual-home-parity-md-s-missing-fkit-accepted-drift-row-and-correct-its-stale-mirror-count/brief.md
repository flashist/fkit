# Add `dual-home-parity.md`'s missing `.fkit-accepted-drift` row and correct its stale mirror count

## ID
0389

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Owner ruling 2026-09-12**, given live via `AskUserQuestion` in the `fkit lead` session driving
`/fkit-sprint-ship-loop` — **the option label is the verbatim text**: **"File it as its own task
(Rec)"**. The alternative offered was folding the fix into task `0339`; the owner chose to keep `0339`
inside its approved boundary. ⛔ The ruling is *file it*, **not** *do it*.

**The defect, in one line.** `ai-agents/knowledge-base/conventions/dual-home-parity.md` carries a
completeness claim that is **wrong by two**, in a document whose next sentence instructs readers to
keep it right.

### The claim on the page today

> **The mirror is COMPLETE as of 2026-08-01: all 26 module entries appear above** — 16 file entries and
> 10 directory entries […] **If you add an entry to the module, add its row here in the same change.**

### What is actually in the authoritative module — measured on disk 2026-09-12

`test/dual-home-parity-exceptions.mjs` is the source of truth; the page says so about itself
(*"where the two disagree, the module wins and this table is stale"*).

| | Page claims | Measured | Verdict |
|---|---|---|---|
| Total entries | 26 | **28** | ⛔ wrong by 2 |
| File entries | 16 | **18** | ⛔ wrong by 2 |
| Directory entries | 10 | **10** | ✅ correct |

Measured by importing the module and partitioning on a trailing `/` in `path`.

### ⭐ The number alone cannot be made true — one entry has no mirror row at all

Cross-checking all 28 module entries against the page's table, **exactly one is missing**:

- **`.fkit-accepted-drift`** — `kind: 'live-only'`. The launch-notice intent file from task `0247`,
  added to the module by commit `fab400b` (2026-08-07) and **never mirrored onto the page**.
  Grepped 2026-09-12: the string `accepted-drift` does not occur anywhere in `dual-home-parity.md`.

The page's table therefore mirrors **17** file entries while claiming **16**, against a module holding
**18**. ⛔ **So the fix is a row AND a number, not a number.**

### What `0339` did and did not cause

⭐ **`0339` fully honoured the rule.** Its own new module entry —
`knowledge-base/conventions/sprint-status-vocabulary.md` (`audience-adapted`) — **is** in the page's
mirror; its plan's step 4 was done. `0339` moved the module from 27 entries to 28 and the page from
mirroring 16 to mirroring 17, leaving the stale `26`/`16` untouched.

⛔ **The gap this task fixes is pre-existing and independent of `0339`** — the `.fkit-accepted-drift`
row has been missing since 2026-08-07. `0339` only made an already-stale number staler.

### ⚠️ Nothing is red, and nothing will go red

**No test pins the count.** `test/dual-home-parity.test.js` reads the exception module and asserts
parity behaviour; it never asserts the convention page's prose. Grepped 2026-09-12: no assertion
anywhere in `test/` references the `26`, the `16`, or the mirror's completeness.

⛔ **This is a documentation-truth defect, not a build failure.** The whole cost of leaving it is that a
reader who cannot find a path in the table concludes it is byte-enforced when the module says it is
not — which is the exact failure mode the page's own text warns about (*"a partial mirror is worse
than none"*).

## What to build

**Two edits, both in `ai-agents/knowledge-base/conventions/dual-home-parity.md`. Nothing else.**

1. **Add the missing `.fkit-accepted-drift` row** to the table, in the page's existing row style, with
   `live-only` as its kind and a `⛔ never sync` parity cell. The module's own `reason` field is the
   material to condense — it records that the file is per-project intent, that a shipped copy would
   pre-suppress launch notices in every consuming project (the global mute the owner's `0247` Q3
   ruling forbade), and that the live copy exists because this repo dogfoods fkit.
   ⚠️ **Condense, do not paste** — every other cell in that table is a one-clause gloss, and the
   module stays authoritative for the full reason.

2. **Correct the two counts** in the completeness note: `26` → `28`, `16 file entries` → `18 file
   entries`. ⛔ **Leave `10 directory entries` alone — it is correct.**

⚠️ **Re-measure before editing, do not copy the numbers above.** The module may have gained entries
between this filing and pickup. Derive the three numbers from the module itself and use what you
measure.

⚠️ **`dual-home-parity.md` is `fkit-repo-only`** — it is on its own exception list and ships to no
scaffold. ⛔ **There is no second copy to keep in step**, and adding one to `claude/scaffold/` is a
regression the module names by name.

### ⛔ Out of scope

- ⛔ **No change to `test/dual-home-parity-exceptions.mjs`.** It is correct; the page is what is stale.
- ⛔ **No change to any file under `test/`** — including the two adjacent stale comments recorded under
  § *Notes*, which are **not** authorized by this ruling.
- ⛔ **No new test pinning the count.** Whether this class of drift deserves a guard is a real question
  and **not this task's** — raise it at the plan gate if you think it is owed; do not decide it here.
- ⛔ **No re-write of the table's other rows**, no re-ordering, and no change to the enforced
  (`✅ must match`) rows.
- ⛔ **No `ai-agents/wiki-vault/` write** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  ⛔ **No new devDependency** (ADR-014). ⛔ **No re-rank of any board** (ADR-035).

## Verification steps

1. **The counts on the page equal the module's, re-derived at pickup.** Import
   `test/dual-home-parity-exceptions.mjs`, partition on a trailing `/`, and confirm the page's three
   numbers match total / file / directory exactly.
2. **Every module entry has a mirror row.** Walk all entries and confirm each `path` appears in the
   page's table (directly, or inside one of its brace-expanded groups). ⛔ **Zero misses** — the claim
   the page makes is *complete*, so one miss falsifies it again.
3. **The parity suite still passes.** `node --test test/dual-home-parity.test.js`.
4. **Reference integrity unchanged.** `node --test test/reference-integrity.test.js` reports **0
   broken**. ⛔ **Do not add a `NAMED_EXEMPT` entry** to make anything pass.
5. **Citation policy unchanged.** `node --test test/coordination-citation-policy.test.js`.
6. **Nothing else changed.** `git diff --name-only` lists `dual-home-parity.md` and this task folder's
   records, and nothing else.

⛔ **Do not hardcode any pass/fail total from this brief.** Re-derive the baseline at pickup.

## Notes

- **Depends on:** nothing. **Blocks:** nothing. The gap is pre-existing and independent; `0339` did
  not create it and no other open task touches this page.

- **Estimated size: one table row and two numbers.** Measured as under a minute of editing. ⚠️ The
  verification above costs more than the fix, which is normal for a truth-of-record defect and is not
  a reason to skip it.

- ⚠️ **Two ADJACENT stale comments were found in `test/dual-home-parity.test.js` while measuring, and
  are recorded here rather than fixed.** Its `REASON_FLOOR` calibration comment says *"Measured
  2026-08-01 over all 26 live entries: the SHORTEST real reason is 84 characters […] the longest
  732."* Re-measured 2026-09-12 over 28 entries: **shortest is still 84** (`wiki-vault/.fkit`,
  unchanged), **longest is now 749** (`sprint-status-vocabulary.md`, was 732).
  ⭐ **The floor itself is NOT invalidated** — 84 still clears 30 by ~2.8×, so the calibration's
  conclusion holds and nothing is unsafe. ⛔ **The owner ruled on the convention page, not on this
  file, and § *Out of scope* fences `test/` — so this is a plan-gate question, not silent extra work.**

- ⚠️ **THIRD INSTANCE OF THE SAME DEFECT CLASS — `test/dual-home-parity-exceptions.mjs`'s own
  `"13 real files"` comment. Recorded, NOT fixed.** Added here by **owner ruling 2026-09-12**, given
  live via `AskUserQuestion` in the `fkit lead` session driving `/fkit-sprint-ship-loop`; **the option
  label is the verbatim text: "Fold into 0389 (Rec)"**. The alternative offered was a new board row,
  and the owner chose to batch it onto this task. Raised as **R6** of task `0339`'s round-1 review.
  ⛔ **The ruling is *record it here*, not *do it* — this bullet adds nothing to § *What to build*,
  which still fences `test/` shut.**

  **The claim, at `test/dual-home-parity-exceptions.mjs:199`:**

  > The surface is NOT "both trees". The scaffold ships **13 real files** plus `.gitkeep` placeholders;

  **Re-measured on disk 2026-09-13 — and the number depends on which tree "the scaffold" means, so
  BOTH readings are recorded:**

  | Scope | At `HEAD` | Working tree (incl. `0339`'s uncommitted scaffold page) | `.gitkeep` |
  |---|---|---|---|
  | `claude/scaffold/ai-agents/` — ⭐ **the module's own home root** | **15** | **16** | 13 |
  | `claude/scaffold/` — whole tree | 18 | 19 | 13 |

  ⭐ **`claude/scaffold/ai-agents/` is the reading this module's own header supports** — it states that
  a `path` is *"relative to EACH home's root"* and names the homes as `ai-agents/` and
  `claude/scaffold/ai-agents/`. The whole-tree figure additionally counts `AGENTS.md`, `CLAUDE.md` and
  `universal-rules.md`, which sit **outside** the dual-homed surface the comment is describing.
  ⚠️ **The implementer must settle the scope before writing a number** — writing the wrong-scope
  number would replace one false claim with another.

  ⛔ **It was already wrong the day it was written.** Introduced 2026-08-01 by commit `7a444c5`, when
  `claude/scaffold/ai-agents/` held **14** real files and **13** `.gitkeep` files. ⚠️ **Hypothesis, not
  a measured fact:** `13` matches the `.gitkeep` count exactly, then and now, so the two may have been
  transposed at authoring. Do not record that as the cause without evidence.

  ⛔ **NOT TEST-PINNED; NOTHING IS RED.** Grepped 2026-09-13: the string `13 real` occurs at exactly one
  site repo-wide, and no assertion anywhere in `test/` references the scaffold's real-file count. Same
  as the two instances above — a documentation-truth defect, not a build failure.

  ⭐ **Why it belongs on this task:** same defect class (a hand-maintained count that drifted from the
  tree it describes), same document family (the dual-home parity mirror and its own module), and — per
  ADR-044 Decision 1's skill-less clause already argued below — the same implementer.
  ⛔ **But it is in `test/`, which § *Out of scope* fences.** Like the `REASON_FLOOR` bullet above,
  this is a **plan-gate question**, not silent extra work: the implementer must put the `test/` fence
  to the owner before touching the module.
  `ai-agents/knowledge-base/conventions/` — prose that **names no producing skill** in
  `skills_for_role()` (`/fkit-record-decision` produces an ADR, `/fkit-task-brief` a brief,
  `/fkit-wiki-ingest` a vault page; none produces a convention page).
  [ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
  **Decision 1** fixes the Build role as the owner of the skill the deliverable is produced by, and its
  skill-less clause staffs a deliverable that names none — *"source, tests, scaffold, prose under
  `claude/`, coordination-doc repairs"* — **to the coder as sole source-write authority, whatever
  `## Owner` says.** A convention-page repair is that same species. The task's other named artifact,
  `test/dual-home-parity-exceptions.mjs`, is a test-adjacent module and therefore also coder territory
  — though ⛔ this task does not edit it.

- ⚠️ **Placement: Backlog board, UNRANKED, APPENDED LAST.** Filed 2026-09-12 by a **spawned
  `fkit-producer` with no owner channel**
  ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
  executing the mechanics of the relayed owner ruling named in § *Context* and deciding nothing beyond
  them. Nothing was renumbered and nothing was inserted mid-board
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).

- ⚠️ **`0383`** (*"shrink the backlog board whose task cells are being used as a document store"*) is
  open and targets the cell bloat a long Task cell adds to. This row's cell was written to the board's
  prevailing style rather than pre-empting that task's decision; ⛔ it is **not** a dependency in
  either direction.
