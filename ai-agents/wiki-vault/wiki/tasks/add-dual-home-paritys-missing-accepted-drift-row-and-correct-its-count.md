# Add `dual-home-parity.md`'s missing `.fkit-accepted-drift` row and correct its stale mirror count

**Source**: `ai-agents/tasks/done/0389-add-dual-home-parity-md-s-missing-fkit-accepted-drift-row-and-correct-its-stale-mirror-count/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 9 · `P4` · `0389` · ✅ Done (agent-closed — not owner-verified)

## Goal

⭐ **The defect in one line: `conventions/dual-home-parity.md` carried a completeness claim that was
wrong by two, in a document whose next sentence instructs readers to keep it right.**

**The claim on the page:** *"The mirror is COMPLETE as of 2026-08-01: all **26** module entries appear
above — **16** file entries and **10** directory entries […] If you add an entry to the module, add its
row here in the same change."*

## Key Changes

**Measured against the authoritative module — `test/dual-home-parity-exceptions.mjs`, which the page
itself names as winning where the two disagree:**

| | Page claimed | Measured 2026-09-12 | Verdict |
|---|---|---|---|
| Total entries | 26 | **28** | ⛔ wrong by 2 |
| File entries | 16 | **18** | ⛔ wrong by 2 |
| Directory entries | 10 | **10** | ✅ correct |

### ⭐ The number alone could not be made true — one entry had no mirror row at all

⛔ **Exactly one of the 28 module entries was missing: `.fkit-accepted-drift`** (`kind: 'live-only'`) —
the launch-notice intent file from `0247`, added to the module 2026-08-07 and **never mirrored**.
**Grepped: the string `accepted-drift` did not occur anywhere in the page.**

⭐ **So the page mirrored 17 file entries while claiming 16, against a module holding 18.** ⛔ **The fix
is a row AND a number, not a number.**

### ⚠️ Nothing was red, and nothing would go red

⛔ **No test pins the count.** `test/dual-home-parity.test.js` reads the module and asserts parity
**behaviour**; it never asserts the convention page's prose. ⛔ **A documentation-truth defect, not a
build failure.**

⭐ **The whole cost of leaving it: a reader who cannot find a path in the table concludes it is
byte-enforced when the module says it is not** — ***the exact failure mode the page's own text warns
about: "a partial mirror is worse than none."***

### ⭐ `0339` fully honoured the rule — the gap is pre-existing

`0339`'s own new module entry **is** in the mirror; it moved the module 27 → 28 and the page from
mirroring 16 to 17. ⛔ **The `.fkit-accepted-drift` row had been missing since 2026-08-07.** ⭐ **`0339`
only made an already-stale number staler.**

### ⚠️ Two more instances of the same class — RECORDED, NOT FIXED

⛔ **`test/` was fenced out of scope**, so both are plan-gate questions rather than silent extra work:

1. **`test/dual-home-parity.test.js`'s `REASON_FLOOR` comment** — *"Measured 2026-08-01 over all 26
   live entries: the SHORTEST real reason is 84 characters … the longest 732."* Re-measured over 28:
   **shortest still 84, longest now 749**. ⭐ **The floor itself is NOT invalidated** — 84 clears 30 by
   ~2.8×, so the calibration's conclusion holds and nothing is unsafe.
2. ⭐ **THIRD INSTANCE — `test/dual-home-parity-exceptions.mjs`'s own `"13 real files"` comment**, added
   by owner ruling 2026-09-12, verbatim *"Fold into 0389 (Rec)"*. ⛔ **The ruling is *record it here*,
   not *do it*.** ⚠️ **The number depends on which tree "the scaffold" means, so both readings are on
   the record:** `claude/scaffold/ai-agents/` (⭐ the module's own home root) held **15–16**; the whole
   `claude/scaffold/` tree **18–19**; `.gitkeep` files **13**. ⛔ **It was already wrong the day it was
   written** — the tree held 14 real files then. ⚠️ ***Hypothesis, not a measured fact:*** `13` matches
   the `.gitkeep` count exactly, then and now, so the two may have been transposed at authoring.
   ⛔ **Do not record that as the cause without evidence.**

## Outcome

⭐ **Verified on disk 2026-09-16.** The page now reads *"The mirror is COMPLETE as of **2026-09-14**:
all **28** module entries appear above — **18** file entries"*, and carries the missing row:

> `.fkit-accepted-drift` | **live-only** — this project's launch-notice intent file (task 0247); a
> shipped copy would pre-mute launch notices in every consuming project …

⭐ **The date moved with the numbers** — the completeness claim is dated to when it was re-verified, not
left carrying its 2026-08-01 stamp. ⭐ **`10 directory entries` was left alone because it was correct** —
the *don't-repair-what-works* rule, applied.

⚠️ **`dual-home-parity.md` is `fkit-repo-only`** — on its own exception list, shipping to no scaffold.
⛔ **There is no second copy to keep in step, and adding one to `claude/scaffold/` is a regression the
module names by name.**

⚠️ **The two `test/` instances above are still standing**, and ⛔ **whether this class of drift deserves
a guard was explicitly NOT decided by this task.**

## Related
- [[tasks/sprint-9-settle-architecture-mds-truth-and-sweep-the-citation-rot]]
- [[tasks/teach-the-roles-what-current-sprint-means]]
- [[tasks/build-dual-home-parity-test]]
- [[tasks/investigate-dual-home-parity-live-vs-scaffold]]
- [[tasks/reconcile-dual-homed-file-drift-live-vs-scaffold]]
- [[tasks/add-the-launch-time-structure-notice-and-intent-file-suppression]]
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]]
- [[decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1]]
- [[systems/testing-and-verification]]
- [[systems/launch-convergence-and-init]]
