# Disambiguate the colliding record ids in `0356`'s closed worklog — append-only, and ⛔ correcting the worklog's own wrong diagnosis of them

## ID
0367

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

**Authority:** [`0356`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md)'s
own [`worklog.md`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/worklog.md),
§"Decision log — the ROUND 2 PROCESS-REVIEW pass (2026-09-04)" → *"⚠️ **A pre-existing defect in THIS
worklog, found while writing the table above and NOT repaired by me**"*, and the follow-up row
**F5**.

⚠️ **No owner ruling attaches to this row.** It is the coder's own recorded refusal to repair
somebody else's audit trail. Stated so nobody cites a ruling that does not exist.

### The defect — one `D<n>` id names two different things

⭐ **`D1`–`D20` each name two records in one file.** Re-measured firsthand 2026-09-04:
**42 `D<n>` row occurrences, 22 distinct ids** — `D1` through `D20` appear **twice each**, `D21` and
`D22` once each.

### ⛔⛔ THE WORKLOG'S OWN DIAGNOSIS OF THIS IS WRONG — do not propagate it

The worklog explains the collision as: *"round 1 ran `D1`–`D14` and the H11 pass **restarted at
`D1`**"*.

⛔ **That is not what happened, and a repair built on it would be wrong.** Verified firsthand: the
decision logs run **monotonically `D1` → `D22`** across five sections (`D1`–`D3`, `D4`–`D7`,
`D8`–`D14`, `D15`–`D19`, `D20`–`D22`). **Nothing restarted.**

⭐ **The real collision is against a different table entirely** — §"Group 1 classification…" → *"The 20
drifted live pointers"*, whose **row ids are also `D1`–`D20`** (for example the row
``D11 | **bare**, `0275`'s fence``). So each `D<n>` names **one drifted pointer and one decision**.

⚠️ **The duplicate-title half of the worklog's claim IS correct**, though loosely stated: two sections
share the **title prefix** *"Decision log — third entry"* — one continues *", the PROCESS-REVIEW round
(2026-09-03)"*, the other *", the `H11` pass"*. They are not byte-identical headings. ⛔ **Say it
precisely; "two sections share a title" overstates it.**

### Why it was left alone, and what that constrains

⛔ *"**I did NOT renumber or retitle the other logs** — they are other workers' records of their own
unattended decisions, and silently rewriting an audit trail is worse than a collided one."* The
round-2 author mitigated **only its own** entries, using a distinct `PR2-<n>` prefix and a unique
section title.

⛔ **That constraint binds this task too. The folder is CLOSED.** Its `plan.md`, `worklog.md` and
`review.md` are the coder's and the reviewer's records. **Nothing here may renumber, retitle, or
rewrite them.**

## What to build

**The only sanctioned instrument is an APPENDED, DATED note. ⛔ There is no renumbering in this task.**

1. **Re-derive the collision firsthand.** Count `D<n>` occurrences and distinct ids; identify **which**
   tables collide. ⛔ **Do not trust either this brief or the worklog's own account** — one of them is
   already known to be wrong.
2. **Append a dated navigation note** to `0356`'s `worklog.md` recording: that `D<n>` ids are ambiguous
   in this file, **which two tables** they span, and how a reader should disambiguate (by section, not
   by id). ⛔ **Append only** — every existing line stays byte-identical.
3. **Record the corrected diagnosis in that note**, since the file's own explanation is wrong and a
   reader following it would look for a restart that never happened. ⛔ **Do not edit the wrong
   sentence** — annotate beside it. A historical record's claims are frozen.
4. **Decide whether a convention is warranted** — should a task record's id namespaces be required to
   be unique per file? ⛔ **Raise it as a question for the owner; do not write a convention here.**

⛔ **Out of scope:** renumbering or retitling anything; editing `plan.md` or `review.md`; any other
task folder's records; any `## Status` change; `ai-agents/wiki-vault/`
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

## Verification steps

1. The collision is **re-measured firsthand**, with the occurrence count, the distinct-id count, and
   the two colliding tables named.
2. The note **states the corrected diagnosis** and does not repeat the "restarted at `D1`" account.
3. The duplicate-heading claim is stated **precisely** — shared title *prefix*, not identical titles.
4. **Append-only, proved by diff and not by eye**, against a **before-edit snapshot** (the folder's
   records are untracked, so a `HEAD` diff cannot isolate the change):
   `git diff --no-index --numstat <snapshot> <file>` reads `N  0`, and
   `diff <snapshot> <file> | grep '^<'` is empty.
5. **Not one existing line changed** — no renumber, no retitle, no rewrite.
6. `npm test` stays green.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
this is low: a collided id in one closed record is a navigation annoyance, not a wrong fact acted on — the one thing raising it at all is that the record's own explanation of the collision is itself false.- ⚠️ **This brief decays.** Every figure was measured **2026-09-04** at `HEAD` `6dcc33e` against a
  **dirty working tree**. **Re-measure; do not quote.**
- ⚠️ **Filed UNRANKED by a spawned `fkit-producer` with no owner channel** — this row **appends** and
  renumbers nothing ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  **On merit - ⚠️ **Adjacent:** `0313` (the append-only proof standard for untracked task-folder ledgers) —
  ⛔ neither gates the other, but a run here should use whatever `0313` settles if it lands first.
** Flagged so the owner can say otherwise.
- ⚠️ **Citation form used here:** coordination documents are cited **file + heading + quoted
  fragment**, never `path:NNN` (row 3 of
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
  **Source-file line coordinates are used where load-bearing** — row 1 rules them correct, and
  `0176`'s owner ruling **G3** keeps them legal.
