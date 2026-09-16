# Make `/fkit-status` report every In-progress sprint, and give the selector a status rung and a lowest-first single choice

**Source**: `ai-agents/tasks/done/0338-flip-select-active-to-choose-the-lowest-ordered-open-sprint-and-repin-its-tests/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 8 · `P6` (⭐ **re-ranked from `P3`**) · `0338` · ✅ Done (agent-closed — not owner-verified)

## Goal

**Build what [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]]
specifies** — the reader half of the sprint lifecycle. ⛔ **Where the brief and the ADR differ, the ADR
wins and the difference is reported back.**

## Key Changes

**What `select-active` was before:** it chose **one** plan — the **highest**-ordered eligible identity.
Eligibility was **identity-only** (`Backlog` and `unresolved` excluded) and "closed" was
**location-only**, via a depth-1 glob that never sees `done/`.

**What this task built:**

1. **A status reader in `dashboard.sh`** parsing the **line-3 banner only** — ⛔ **no "find the banner
   anywhere" rule**, for the same reason ADR-040 reads a whole H1 segment and never a substring. The
   legacy `> ## 🔒 CLOSED — <date>.` form reads as `Done`. No banner → **unresolved**.
2. **Eligibility gains a status rung** — `Sprint <N><suffix>` identity **and** `In progress`.
   ⭐ **A missing or unparseable status is ineligible AND emits a `drift sprint-status-unresolved`
   fact** — the ADR-040 *"wrong is worse than none"* posture, so a plan that never got a status is
   **loud, not silently active**.
3. **`select-active` prints all and picks one** — every eligible sprint lowest-ordered-first, plus one
   `chosen`, overridable by the option-(d) marker. ⚠️ **A marker pointing at an ineligible or missing
   plan emits `drift active-marker-invalid` and the default applies.**
4. **Sprint-level drift facts** for the three disagreement shapes.
5. **`SKILL.md` rewritten for N sprints** — beats 1–6 per sprint, one board per sprint, one
   cross-sprint closing line. ⛔ **Still one output** (`one-skill-one-output.md`).
6. **Tests** in `test/dashboard-contract.test.js`, including `Sprint 9` chosen over `Sprint 10` —
   ⭐ **S1 flipped: integer ordering still, in the new direction.**

### ⭐ Re-ranked `P3` → `P6` on 2026-09-10 by owner ruling

**Verbatim option label: *"Re-order — 0340 before 0338 (Rec)"*.** ⛔ **The reason is this task's own
blast radius, measured — not a preference.** It makes `In progress` a rung of eligibility and a
bannerless plan resolve `unresolved`; ⛔ **the live Sprint 8 board had no banner**, so shipping this
first would have returned `active none`, exit 3, and taken the board out from under the ship-loop
driving it — **mid-sprint, on the sprint that exists to fix exactly this.**

⛔ **"Blocks `0340`" is corrected — it does not.** `0340` needs only the banner **grammar** to write a
banner; this task is what **reads it back**. ⭐ **`0340`'s dependency here is a deferred verification,
not a work gate**, which is what made the re-order legal rather than a dependency violation.
⚠️ **No `Depends on` line in either brief was edited.**

## Outcome

⭐ **This task's verification is where Sprint 8's success criterion (a) was actually demonstrated** —
`0340` shipped the banner one rank earlier but could not machine-verify it.

⚠️ **The brief's own verification step 3 was stale twice over and the producer said so rather than
letting it be discovered:** it named `Sprint 6` (archived 2026-08-29) and carried a *"Before `0340`:
expect `active none` … not a defect"* clause that **inverts under the re-order** — `0340` now lands
first, so the expected result is `sprint-8.md` active and chosen, and ⛔ **anything else IS a defect,
not an expected state.**

⭐ **Verified on disk 2026-09-16, after both boards closed:** `select-active ai-agents/sprints` prints
`active none`, exit 3, listing `backlog.md` as the only candidate with `status="unresolved"` —
the shape this task built, reporting correctly that there is no active sprint.

## Related
- [[tasks/sprint-8-give-sprints-the-lifecycle-tasks-already-have]]
- [[tasks/record-the-sprint-lifecycle-adr-047]]
- [[tasks/backfill-a-sprint-status-onto-every-existing-sprint-plan]]
- [[tasks/teach-the-roles-what-current-sprint-means]]
- [[tasks/pin-the-five-unpinned-behaviors-in-the-sprint-identity-grammar]]
- [[decisions/adr-047-a-sprint-has-an-explicit-status-and-current-means-every-in-progress-sprint]]
- [[decisions/adr-041-the-active-sprint-is-selected-by-resolved-identity-not-by-filename-glob]]
- [[decisions/adr-040-a-plan-s-sprint-identity-is-a-whole-h1-segment-never-a-substring]]
- [[tasks/implement-adr-041s-dashboard-half]]
