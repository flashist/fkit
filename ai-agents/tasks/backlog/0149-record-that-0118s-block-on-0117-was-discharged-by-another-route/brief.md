# Record that 0118's block on 0117 was discharged by another route

## ID
0149

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

Task 0118's brief — now closed and sitting in
[`ai-agents/tasks/done/0118-record-adr-032-sprint-ship-loop-autonomy-amendment/brief.md`](../../done/0118-record-adr-032-sprint-ship-loop-autonomy-amendment/brief.md)
— makes a dependency claim that **history overtook**. Two sites, verified 2026-07-26:

| Site | Text | Status of the claim |
|---|---|---|
| `brief.md:84` | `- **Blocks:** 0117 (wiki ingest must ingest the *amended* ADR-032 — the amendment lands before 0117 runs)` | **false as written** — 0117 shipped **first**, ahead of the amendment |
| `brief.md:49` | *"**Consequence: this has been blocking 0117 for three days** and nobody was tracking it as a block"* | **true when written**; the block was real and did cost three days |

**What actually happened.** Under an explicit owner ruling, **0117 shipped ahead anyway** — it ingested
the **un-amended** ADR-032 and carried a `⚠️ STALE` staleness pointer on the vault page in place of the
missing text (the one-line authorized widening recorded at
`ai-agents/tasks/done/0117-wiki-ingest-lead-conductor-and-adrs-031-032/review.md:33`). 0117 is
`✅ Done (agent-closed — not owner-verified)`. The block was therefore **discharged by a different
route than the brief predicted**: not by 0118 landing first, but by the owner authorizing a stand-in.

**The architect's recommendation, and the reason this is a task rather than a deletion:** *record that
the block was discharged by another route — do not delete the line.* A stale claim in a live brief is
history worth keeping visible, and **this particular one already caused a three-day silent block**. The
`:49` note is the project's own record of that lesson (*"a task parked on 'the owner is doing it
himself' has no owner the board can chase"*). Deleting the `Blocks:` line would erase the evidence that
the prediction was made and missed; leaving it unannotated lets a future reader act on a false ordering.

**⚠️ 0118 is in `done/`.** This edits a **closed** task's brief. That is deliberate and narrow: it appends
a dated correction, in the same spirit as the ADR-010 dated-correction-note precedent (0143) — the claim
stays, the correction sits beside it.

## What to build

A **dated correction note** in `ai-agents/tasks/done/0118-record-adr-032-sprint-ship-loop-autonomy-amendment/brief.md`:

- Annotate the **`- **Blocks:** 0117`** bullet so it records that the block was **discharged by another
  route** — 0117 shipped first, under an owner ruling, with a staleness pointer standing in for the
  missing amendment; 0118 landed afterwards. **Keep the original claim visible**; add, do not replace.
- **⚠️ Preserve the canonical dependency form.** The line must keep opening `- **Blocks:**` flush against
  the `**`, with no decoration between `**` and the label — `dashboard.sh` parses that exact shape, and a
  decorated variant renders `⟨derive: UNPARSEABLE⟩` (see
  [`conventions/dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md)).
  Put the correction in a **separate** bullet or a trailing dated sentence, not inside the label.
- Leave **`:49`** as written — it was true when written and is the record of the lesson. If it needs
  anything, it is a pointer to the correction note, not a rewrite.
- Do **not** change 0118's `## Status`, and do **not** move any task file.

## Verification steps

1. 0118's brief records that its `Blocks: 0117` prediction did not hold and how the block was actually
   discharged, with the date.
2. The **original** `Blocks:` claim and the `:49` three-day-block note are both still present — nothing
   was deleted.
3. `grep -n '^- \*\*Blocks:\*\*' ai-agents/tasks/done/0118-*/brief.md` still matches — the canonical form
   survived, and `dashboard.sh` does not report `⟨derive: UNPARSEABLE⟩` for 0118.
4. 0118's `## Status` still reads `✅ Done (agent-closed — not owner-verified)` — byte-identical, and no
   task file moved boards.
5. No change to 0117's brief, to any ADR, or to the vault.

## Notes

- **Owner:** fkit-producer — a task-record correction, which is producer work.
- **Depends on:** nothing. Both 0117 and 0118 are closed.
- **Blocks:** nothing.
- **Related stale wording, decide as part of this:** `ai-agents/sprints/done/sprint-2.md:132` (0118's board
  row) still carries *"blocked 99 for three days unnoticed"* in its description. That is past-tense and
  true, so the default is **leave it**. Confirm rather than assume.
- **Why not just fix it inline during the close:** the close (0118) was performed by a **spawned**
  producer with no owner channel. Editing a closed brief's dependency claims in the same breath as
  closing it would fold an unreviewed judgment into a close the driver cross-checks. Filed separately so
  the correction is visible as its own decision.
- **Vault:** if any vault page mirrors 0118's `Blocks: 0117` claim, that repair belongs to **fkit-wiki**
  (ADR-005), not here. 0148 sweeps the ADR-032-adjacent vault pages and is the natural place to catch it.
- No commit — leave the edit in the working tree.
