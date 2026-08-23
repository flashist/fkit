# Repair the three decay shapes across the open backlog briefs

**Source**: `ai-agents/tasks/done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P1` · ID 0306 · owner `fkit-coder` · shipped 2026-08-15

## Goal

Remove, in one pass, the three ways a task brief's own text rots as the board moves under it:

1. **The dead `ai-agents/sprints/sprint-N.md` path** — sprint boards moved under `ai-agents/sprints/done/`, so every brief citing the old path points at nothing.
2. **Pre-migration `task NN` numerals** — a numeral that once named a board row now resolves, under [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]], to a *different* task's folder ID.
3. **Discharged dependencies still reading as blocking** — a brief saying it waits on a task that closed weeks ago.

⛔ **One brief, not three, by owner ruling 2026-08-14** — option label verbatim **"One cleanup task, scheduled early (Recommended)"**. On the merits the three shapes *are* independently shippable, so `/fkit-task-brief`'s decompose-to-smallest rule would have split them; the ruling overrode it. **Do not re-split it.**

## Key Changes

### ⭐ The brief made re-measurement mandatory, and its own instruction proved why

Every count in the brief was measured 2026-08-14 at HEAD `4424b44` and recorded **so the implementer could tell whether the surface grew or shrank — never so they could be trusted.** ⚠️ *"A run that copies them into its worklog without re-deriving them has reproduced the exact defect this task exists to fix."*

⭐ **One count in the driver's own instruction was ALREADY STALE when the brief was written** — it named **18** briefs carrying the dead sprint path where the live figure was **17**. The difference was `0238`, which carried 5 occurrences and **closed earlier the same day**. ⚠️ **Not a discrepancy to reconcile — the first worked example of why re-measurement is mandatory.**

### Change surface

- **Shape 1 — dead sprint path:** 19 occurrences repaired across 12 files, path only. **Every `:NNN` suffix left byte-identical** (owner ruling; migrating them to `§heading` anchors is `0171`'s job). ⭐ **10 occurrences deliberately left, every survivor named with its reason — a bare count is not a pass**: quoted frozen records (re-pointing would make the record say something the measurer did not measure), and the one site that *is* the subject of its own brief's H1.
- **Shape 2 — mis-resolving numerals:** 50 occurrences repaired across 7 files under `ai-agents/`, plus 12 across 5 files under `claude/`. ⛔ **`task 70` was resolved against a brief instruction that an owner ruling OVERRODE**, recorded as required.
- **Shape 3 — discharged dependencies:** 4 rows repaired, 1 corrected, 1 skipped.

### ⭐ The finding the instruction did not contain — `task 43`

The mis-resolving-numeral class is **not confined to the oldest briefs**. *"task 43"* means the `PreToolUse` skill-ownership hook / [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]; today `0043` is an unrelated scaffold fix. ⚠️⚠️ **It is being actively reproduced, because it is copied out of live source comments under `claude/`** — two of the briefs citing it were filed on 2026-08-14, the day of the triage.

### ⛔ Shape 3's stated purpose is NOT met on the surface it is about, for 2 of 4 repaired rows

Round-1 review raised this and it is right: `0046` and `0168` carry their corrections **outside the `**…**` span `dashboard.sh`'s parser reads**, so the board **still prints `depends="task 36"`** — the exact mis-resolving numeral this task exists to eliminate — and `depends="0160 — hard."`. Not `UNPARSEABLE`; not repaired, **because fixing it means editing a line declared byte-identical.** ⛔ **Owner ruling 2026-08-15, verbatim "File a follow-up task (Recommended)."**

## Outcome

**Shipped 2026-08-15**, agent-closed. Two review rounds; the round-2 pass found **two new findings, both in the residuals, both of the class this task exists to remove**.

**Residuals — every one open:**

1. ⚠️ **Nothing enforces the durable citation form.** This run removed today's seed; it did not close the class. `0171` was still open and the convention file did not yet exist. **The decay can return tomorrow.**
2. ⚠️ **`test/` still carries 25 stale `task 43` occurrences** (`-i`; 23 case-sensitive), **16 of them in frozen replay fixtures that must never be edited** — `closed-rank-immutability.test.js` declares those files byte-exact copies of two named commits, so **editing a numeral falsifies that declaration even where no assertion trips.** *"It would break the suite" is the weaker claim and is not reliably true.*
3. ⛔ **The `0046` / `0168` derive-cell gap above** — follow-up owed, filing is producer-only.
4. ⚠️ **A hyphenated `task-NN` form is still stale and unswept** — 7 occurrences across 4 briefs, including one **no Shape-2 list ever named**. ⛔ Owner ruling: *"File a brief for the whole hyphenated class (Recommended)."*
5. ⚠️ **`claude/` still carries 10 stale non-`task 43` numerals across 7 files — the live seeds the whole class grows from.** ⚠️ **The worklog's own §3 list of these was itself incomplete** and was corrected in the residual section. ✅ `claude/scaffold/` carries **none**. ⛔ Owner ruling: *"Name them in Residuals, then file a follow-up (Recommended)."*
6. ⚠️ **`0194` remains genuinely BLOCKED on `0189`.** This task corrected the record; it did not unblock the row.
7. ⚠️ **Two quotations elsewhere are now knowingly stale** — the accepted cost of repairing the source; each carries a dated note giving the new wording.

⛔ **This step filed none of the follow-ups** — filing is producer-only ([[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]]).

## Related
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — `P1`, the row that had to run first and alone
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160`, the ruling this task's repairs land under; its follow-up `0171` writes the convention that would stop the recurrence
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — why a `task NN` numeral stopped resolving
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — what *"task 43"* actually means
- [[tasks/build-the-closed-rank-immutability-guard]] — `0182`, whose frozen fixtures are the 16 occurrences that must never be swept
- [[tasks/archive-sprint-5-move-the-plan-into-sprints-done]] — the archival that created shape 1
- [[systems/knowledge-base-structure]]
- [[tasks/pressing-enter-at-the-role-menu-should-open-the-lead]] — ⚠️ *Added 2026-08-22:* task `0302`, which **re-measured this task's out-of-scope `task 43` residue under `test/`** and corrected the inventory twice — anchors in round 1, totals in round 2
- [[tasks/write-the-durable-citation-anchors-convention-page]] — ✅ *Added 2026-08-22:* task `0171`, the convention this task's shape-1 survivors were left for (*"migrating them to `§heading` anchors is `0171`'s job"*) — **now closed**. ⛔ **This page's residual 1 is NOT discharged by that close:** the form is written down but **enforced by nothing** (the guard is `0176`, open), so *"the decay can return tomorrow"* still stands
