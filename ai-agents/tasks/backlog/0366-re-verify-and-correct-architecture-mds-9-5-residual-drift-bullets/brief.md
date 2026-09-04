# Re-verify and correct `architecture.md` §9.5 *"Residual drift"* — the section documenting the project's drift has itself drifted

## ID
0366

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**Authority:** [`0286`](../0286-mechanical-citation-sweep-of-architecture-md/brief.md)'s own prose
fence, as applied in
[`0356`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md)'s
[`worklog.md`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/worklog.md)
§"Group 1 classification — `ai-agents/knowledge-base/architecture.md`" → **"The 3 stale CLAIMS — ⛔
reported, not fixed"**.

⚠️ **No owner ruling attaches to this row.** Its authority is a prose fence inside another brief, not
an `AskUserQuestion`. Stated so nobody cites a ruling that does not exist.

⭐ *"**The section documenting the project's drift has itself drifted.**"*

### The bullets, and what was measured

`0356` measured **two** bullets and recorded both as false:

| Bullet, as it stands on disk | Measurement recorded | Verdict |
|---|---|---|
| *"**`claude/fkit-claude-init.sh:144` prints "Six roles"** and omits `lead`, immediately after copying **7** agent files… The count is a literal, not derived."* | *"`grep -n 'Six'` over the whole file returns **nothing**. The script prints a **derived** count from `ls … \| wc -l`"* | ⛔ **FALSE today, in both halves** |
| *"**`claude/fkit-claude-init.sh:17`** still advertises `fkit claude` in its usage comment — a verb that now **hard-fails**."* | *"`grep -c 'fkit claude'` → **0**, exit 1. The string is gone"* | ⛔ **FALSE today** |

### ⚠️⚠️ A THIRD BULLET — found by the filing producer, NOT named in `0356`'s records

⛔ **§9.5 carries three bullets on disk, not two, and the third also fails firsthand.** It reads
*"**ADRs 003, 004, 006, 007 are still marked `accepted`** though the code they describe is deleted…"*.
Checked 2026-09-04: **all four read `superseded`** — `adr-003`, `adr-004` and `adr-007` each
*"**superseded** — Omnigent removed"*, and `adr-006` *"**superseded, on two grounds.**"*

⚠️ **So the count carried into this row may be 3, not 2.** ⛔ **Do not settle that from this brief** —
re-verify all three yourself and report your own number. If it differs from `0356`'s two, **say so
plainly**; a record that miscounted its own findings is worth naming.

### Why `0356` reported instead of repairing

⛔ **Deliberate, under `0286`'s `## What to build` A4**, verbatim: *"Correct the citation, never the
prose. Every claim the citations attach to is accurate. If a **claim** looks wrong, **report it — do
not fix it**."* ⭐ *"Repairing a coordinate that supports a false sentence would make the sentence look
verified."* The bare coordinate inside the first bullet was therefore **left with its claim**,
deliberately, rather than re-anchored.

⚠️ **`0286` will not cover this.** It stays open carrying **half B only** (its ~230 inbound
coordinates, ruling *"Split — half A now, half B stays open (Rec)"*), and its A4 forbids it touching
prose. ⚠️ **`0251` will not either** — that row is scoped to §9.1's test-suite inventory.

## What to build

1. **Re-verify every bullet in §9.5 firsthand** and report **your own count** of how many are false.
   ⛔ Do not carry this brief's figures.
2. **For each false bullet, decide its treatment and record the reason** — repair in place, or an
   appended dated note. `architecture.md` is a **living document, not a frozen record**, so repair in
   place is the likely answer; ⛔ **argue it rather than assuming it**, and be consistent across the
   bullets or say why they differ.
3. **Re-anchor the coordinates that survive.** A bullet that stays gets a citation form that does not
   rot — heading + quoted fragment for coordination documents. ⛔ **A bare line number replaced by a
   fresher bare line number is not a repair.**
4. **Say what §9.5 should contain now.** If every residual it lists is discharged, the honest outcome
   may be that the section is empty or gone — ⛔ **do not invent replacement residuals to keep it
   populated.**

⛔ **Out of scope:** §9.1 (that is `0251`), `0286`'s half B inbound coordinates, any ADR status change,
`ai-agents/wiki-vault/` ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)),
and any source change under `claude/`.

## Verification steps

1. **Every bullet in §9.5 has a recorded verdict** with the command or observation that produced it —
   ⛔ a document covering two when three exist fails this step.
2. The run **states its own count** and says explicitly whether it matches `0356`'s two.
3. No surviving citation in §9.5 is a bare line number.
4. If a bullet was removed, the run says **why removal rather than annotation** was right.
5. `npm test` stays green — this touches no source.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
this belongs with the other `architecture.md` corrections: it is a false statement in the project's own reference document, which is worse than a rotted pointer because a reader cannot tell it is wrong.- ⚠️ **This brief decays.** Every figure was measured **2026-09-04** at `HEAD` `6dcc33e` against a
  **dirty working tree**. **Re-measure; do not quote.**
- ⚠️ **Filed UNRANKED by a spawned `fkit-producer` with no owner channel** — this row **appends** and
  renumbers nothing ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  **On merit - ⚠️ **Adjacent, not dependent:** `0286` (half B, same file, different defect class), `0251`
  (§9.1's inventory), `0312` (the false CI claims elsewhere in the same file). ⛔ **None gates this
  and this gates none** — but a concurrent run must re-derive its own line positions.
** Flagged so the owner can say otherwise.
- ⚠️ **Citation form used here:** coordination documents are cited **file + heading + quoted
  fragment**, never `path:NNN` (row 3 of
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
  **Source-file line coordinates are used where load-bearing** — row 1 rules them correct, and
  `0176`'s owner ruling **G3** keeps them legal.
