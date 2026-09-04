# Correct the refuted *"IS CORRECT. DO NOT 'FIX' IT."* fence claim carried at two sites in `0273`'s open brief

## ID
0365

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

**Owner ruling H6**, given live via `AskUserQuestion` on **2026-09-03** in an `fkit lead` session
driving `/fkit-sprint-ship-loop` and relayed to a spawned producer. **The option label is the verbatim
text: "Report it, file a follow-up (Rec)".**

**Authority:** [`0356`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md)'s
[`worklog.md`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/worklog.md)
§"2.2 ⛔ Members whose briefs are WRONG, or whose premises DO NOT reproduce", item 1:
*"⛔⛔ **`0275`'s central fence is REFUTED. Its "correct" citation is no longer correct.**"*

### The claim, and why it is measurably wrong

[`0275`](../../done/0275-correct-the-stale-adversarial-review-citations-in-architecture-mds-review-walkthrough/brief.md)
(now closed) was built around a fence stated in capitals: that the bare line-range citation
`` `fkit-review/SKILL.md:128-135` `` resolves to the **degradation-template block** and therefore
*"IS CORRECT. DO NOT 'FIX' IT."*

⛔ **Re-measured firsthand 2026-09-03 and again 2026-09-04: it does not.** That range holds the tail of
a *"never invent a version"* bullet plus a **dated 2026-08-28 note** about Codex's sandbox. The
degradation template — the block carrying `**Decision: 🟡 Partial review — Codex unavailable**` and the
`⚠️ [NOT model-diverse — INCOMPLETE]` banner — has moved **far down the same file**.

⭐ **The consequence the fence got backwards: all three of that paragraph's citations are stale, not
two.** The fence claimed one was safe; none is.

### ⛔ Where the false claim lives today — TWO sites, not one

⚠️ **`0356`'s records say `0273`'s brief *"carries the same refuted claim"* in the singular. That
under-counts it.** Re-verified firsthand on disk 2026-09-04 — it appears at **two** sites in
[`0273`](../0273-move-the-codex-review-sandbox-to-workspace-write-at-all-call-sites/brief.md):

| # | Section | Fragment |
|---|---|---|
| 1 | §"⚠️ Two stale citations that sit ON lines this task already rewrites — fix them in passing" | *"One of its citations (`fkit-review/SKILL.md:128-135`) **was measured and is CORRECT** — a careless sweep would "fix" a right citation, which is worse than leaving drift."* |
| 2 | §"Notes" | *"**and it cites `fkit-review/SKILL.md:128-135`, which is CORRECT and must not be "fixed."** It is a different defect class"* |

⛔ **A run that repairs one and reports the job done has left the false fence live.**

### Why `0356` did not fix it

⛔ **`0273` is not a member of `0356`'s frozen membership**, and correcting a non-member mid-sweep is
exactly the scope creep the freeze exists to prevent. The refutation was **reported and returned** for
filing. The cost was named on the record: *"`0273`'s brief keeps a measurably false fence claim until
the follow-up is filed."* **This row is that follow-up.**

⚠️ **`0273` will not fix this itself.** Its deliverable is the `--sandbox workspace-write` move, and
its own text puts the citation cluster *"⛔ Out of this task"*.

## What to build

**`0273` is an OPEN brief, so this is a repair in place — not an append-only dated note.** That
distinction is the whole reason this is a separate row from the closed-record corrections.

1. **Re-verify the refutation firsthand before editing anything.** Read the cited range in
   `claude/skills/fkit-review/SKILL.md` and confirm what is actually there; locate where the
   degradation template genuinely sits. ⛔ **Do not act on this brief's word** — it decays.
2. **Correct both sites in `0273`'s brief.** The sentences currently assert a measured fact that is
   false. Replace the false assertion with what is true today, keeping the surrounding warning intact:
   the *shape* of the warning — that a careless sweep can break a correct citation — is a real and
   still-valuable caution; only the claim that **this particular** citation is correct is refuted.
3. **Re-anchor rather than re-number.** ⛔ **Do not replace the stale range with a fresh line range.**
   Cite the degradation block by **heading + quoted fragment** — the same rule that made the original
   claim rot.
4. **Decide and record the treatment of `0275`'s copy.** `0275` is **closed**, so its brief takes an
   **append-only dated correction note** if anything, never a rewrite — and only if you judge it
   needed. ⛔ **State the decision either way; "not considered" is not an outcome.**

⛔ **Out of scope:** any change to `claude/skills/fkit-review/SKILL.md` itself; `0273`'s actual
sandbox deliverable; any re-rank; any task-file move (movers are producer-only,
[ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md));
`ai-agents/wiki-vault/` ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

## Verification steps

1. The refutation is **re-verified firsthand** and the finding stated, including where the degradation
   template actually sits today.
2. **Both** sites in `0273`'s brief are corrected — ⛔ a diff touching one fails this task.
3. **No replacement citation is a bare line range.** Each names a heading or a quoted fragment.
4. `0273`'s warning against carelessly "fixing" a correct citation **survives** — only the refuted
   factual claim changed.
5. The disposition of `0275`'s closed copy is **recorded with its reason**, and if a note was appended
   it is proved append-only (`+N / −0`) against a **before-edit snapshot**.
6. `npm test` stays green — this touches no source.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
this belongs above the ordinary record repairs: a fence written in capitals telling future runs not to touch something is read as authority, and it is wrong — the longer it stands the more likely a sweep obeys it.- ⚠️ **This brief decays.** Every figure was measured **2026-09-04** at `HEAD` `6dcc33e` against a
  **dirty working tree**. **Re-measure; do not quote.**
- ⚠️ **Filed UNRANKED by a spawned `fkit-producer` with no owner channel** — this row **appends** and
  renumbers nothing ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  **On merit ** Flagged so the owner can say otherwise.
- ⚠️ **Citation form used here:** coordination documents are cited **file + heading + quoted
  fragment**, never `path:NNN` (row 3 of
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
  **Source-file line coordinates are used where load-bearing** — row 1 rules them correct, and
  `0176`'s owner ruling **G3** keeps them legal.
