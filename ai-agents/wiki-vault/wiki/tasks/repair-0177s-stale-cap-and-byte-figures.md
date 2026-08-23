# Repair `0177`'s stale cap and byte figures

**Source**: `ai-agents/tasks/done/0218-repair-0177s-stale-cap-and-byte-figures/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P3` · ID 0218 · owner `fkit-producer` · shipped 2026-08-16

## Goal

`0177`'s brief told its worker to reproduce a `RULES_MAX` cap of **4096 B** and byte figures of **3570 B emitted / 526 B headroom**. All three were superseded: task `0190`'s **owner-signed bump moved `RULES_MAX` to 4352** on 2026-08-04, and the emitted block moved with it. ⚠️ **`0177` was unworkable as written until this landed** — which is why Sprint 6 ranks `0218` (`P3`) ahead of `0177` (`P4`).

## Key Changes

Four `Edit` calls on **one file** — `0177`'s brief. Nothing else was opened for write.

| site | change |
|---|---|
| `## Context` | `4096` → live **4352 B**, dated, naming `0190`'s owner-signed bump; added a standing *"every byte figure below is a snapshot, not an acceptance criterion"* warning |
| `## What to build` §4 | absolute figures demoted to a **dated snapshot** (3837 B / 515 B); the **≥400 B standing target promoted to "that is the criterion"** |
| `## Verification steps` §4 | *"`RULES_MAX` is unchanged at 4096"* → *"unchanged **by this task** — read the live value before and after and confirm they match; **do not assume a number**"* |
| `## Verification steps` §6 | *"still measures 3570 B with 526 B headroom"* → re-measure at work time and report raw output; criterion is *this task did not move it* |

⭐ **The load-bearing distinction it drew: a snapshot is not a criterion.** The absolute byte figures are dated measurements that expire; the **≥400 B standing headroom target** is an owner-set criterion that does not. The repair demotes the first and promotes the second rather than simply updating numbers.

**Figures re-measured this run rather than copied from the plan** — `RULES_MAX` **4352**, emitted **3837 B**, free **515 B**, source `universal-rules.md` **3433 B**, wrapper **404 B**, utilization **88 %**. All four re-confirmed exactly against the plan; **nothing to re-baseline.**

**`404 B` and `≥400 B` were kept verbatim, uncorrected** — they had not moved.

## Outcome

**Shipped 2026-08-16**, agent-closed, by a **spawned `fkit-producer` build worker with no owner channel** — every judgment call recorded in its decision log instead. One review round, converged.

**Owner rulings taken at plan approval:** the one labelled-historical `4096` mention stays (*"Keep the one labelled mention (Recommended)"*), and `0220` was **not read and not widened into** (*"Check 0220 after 0218 ships (Recommended)"*).

⛔ **No test was run and none was claimed** — the change is one brief's prose.

## Related
- [[tasks/verify-the-codex-half-of-the-comment-stripping-canary]] — `0177`, the brief this repaired and the row it unblocked
- [[tasks/reclaim-rules-block-budget-headroom]] — `0130`, which set the ≥400 B standing target and the superseded figures
- [[tasks/add-adr-037s-worker-side-precedence-clause-to-the-universal-rules-block]] — `0190`, the owner-signed 4096 → 4352 bump
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — `P3`, ranked ahead of `0177` for exactly this reason
- [[systems/testing-and-verification]] — the rules-block budget test and its cap gate
