# Backfill the missing `## Priority` field into the six briefs that lack it

## ID
0155

## Sprint
Sprint 2

## Priority
138

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Six briefs carry no `## Priority` heading at all.** Found 2026-07-27 by a full sweep of
`ai-agents/tasks/{backlog,done,cancelled}/*/brief.md` — **6 of 154 briefs (≈4%)**, listed in full in
*What to build* below. All six omit the heading entirely; the field is simply absent from the skeleton
between `## Sprint` and `## Status`. Two were noticed incidentally while filing 0153/0154; the other
four were found by the sweep.

### Why this is not cosmetic

`claude/skills/fkit-sprint-ship-loop/SKILL.md:81` orders a sprint's eligible tasks like this:

> `- **Order** by `## Priority`, then by dependency topology (a task never runs before a task it depends on).`

That is **the brief's field, not the board cell** — the two are deliberately different carriers (see
[`priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md),
approved 2026-07-27: the board cell is mutable rank rendered `P<n>`; the brief's `## Priority` field is
"a plain number, or `Unscheduled` — it is a **field, not a board cell** — `fkit-sprint-ship-loop`
orders by it and reads it as a number"). **A brief with no `## Priority` is invisible to the rule the
sprint driver depends on.**

Two of the six are `🔲 Backlog` rows in the *currently running* sprint — **0126** at rank **P109**, the
second-highest-ranked eligible task on the board, and **0136** at **P114**.

### State the exposure honestly

**No mis-ordering is in flight today.** The driver falls back to the board's Priority cell, and for all
six the cell agrees with what the field should say. The defect is latent: it becomes a real ordering
error the moment the board is re-ranked and the fallback stops agreeing, or the moment the fallback is
tightened. This is a **conformance fix on a live rule**, not a live outage — do not treat it as urgent
and do not let its cheapness disguise it as archival tidying either.

### Nothing prevents this recurring

Verified 2026-07-27 (see 0156 for the full finding): `dashboard.sh` has no
`brief-missing-priority` drift kind, no test asserts the field's presence, and
`/fkit-task-brief`'s mandatory-field callouts name only `## Status` and `## Owner`. Running
`dashboard.sh` against `sprint-2.md` today emits **zero** drift for 0126 and 0136. The guard is
task **0156**, which **hard-depends on this task** — see *Notes*.

### Four of the six are `✅ Done`

0122–0125 closed already. Backfilling a closed task's brief is a deliberate scope call, taken here for
a concrete reason, not tidiness: all four are live `✅ Done` rows in `sprint-2.md` at P105–P108, so the
0156 guard **would fire on them on day one** unless they are backfilled with everything else. Precedent
is exact — task **0105** (`0105-backfill-owner-field-into-existing-briefs`) backfilled `## Owner` into
existing briefs across all boards for the same reason, after **0104** defined the field. This task is
0105's shape; 0156 is 0104's.

**This is not a `➡️ Moved`-marker rewrite and not a closed-sprint-plan edit** — both of which
`priority-is-rank-not-identity.md` explicitly freezes. It adds an absent field to a brief body. No
board row, no Status cell, and no `— priority M` marker is touched.

## What to build

Add a `## Priority` heading with its value on the following line to each of the six briefs, positioned
**between `## Sprint` and `## Status`** to match the authoritative skeleton in
`claude/skills/fkit-task-brief/SKILL.md` step 4.

**The six briefs and their values.** Every value is the board rank the row carries in
`ai-agents/sprints/sprint-2.md`, re-verified against the live plan on 2026-07-27. **Write the plain
number — no `P` prefix.** The `P<n>` token is the board cell's form; the brief's field is a bare
number.

| Brief | Board rank | Write |
|---|---|---|
| `ai-agents/tasks/done/0122-route-coder-ship-loop-close-to-producer/brief.md` | P105 | `105` |
| `ai-agents/tasks/done/0123-route-sprint-ship-loop-close-to-producer/brief.md` | P106 | `106` |
| `ai-agents/tasks/done/0124-revert-task-movers-to-producer-only/brief.md` | P107 | `107` |
| `ai-agents/tasks/done/0125-wiki-skills-flag-ready-to-close/brief.md` | P108 | `108` |
| `ai-agents/tasks/done/0126-wiki-resync-for-adr-033/brief.md` | P109 | `109` |
| `ai-agents/tasks/backlog/0136-convert-skill-descriptions-to-block-scalars-and-guard/brief.md` | P114 | `114` |

- **Re-derive the six from the sweep, do not trust this table's membership blindly.** Re-run the sweep
  in *Verification steps* first. Briefs filed between this brief and the implementation would not
  appear above.
- **Re-read each rank off `sprint-2.md` at write time.** The sprint-2 board was re-ranked twice in two
  days (2026-07-26 and 2026-07-27). If a rank has moved since this brief was written, **the live board
  wins** — write the live rank and say so in the report.
- **Change nothing else in any of the six files.** No wording, no other heading, no reflow. The four
  `✅ Done` briefs are closed records; this task adds one absent field and nothing more.
- **Touch no board.** No row, Status cell, or `➡️ Moved … — priority M` marker changes. If a brief's
  rank and its board cell appear to disagree, that is a finding to report, not to fix here.

## Verification steps

1. **The sweep is clean.** From the repo root:
   ```sh
   for f in ai-agents/tasks/{backlog,done,cancelled}/*/brief.md; do
     grep -qE '^## Priority' "$f" || echo "MISSING: $f"
   done
   ```
   Before: prints exactly the six paths above. After: prints **nothing**.
2. **Every value is a bare number, not a `P<n>` token.** For each of the six, the line after
   `## Priority` matches `^[0-9]+$`. Show the six values.
3. **Placement matches the skeleton.** For each of the six, `grep -n '^## '` shows
   `## Sprint` → `## Priority` → `## Status` in that order.
4. **Each value equals its live board rank.** For each of the six, read the row's Priority cell out of
   `ai-agents/sprints/sprint-2.md` and show it beside the value written. State any that had moved since
   this brief was written.
5. **Nothing else changed.** `git diff --stat` shows exactly six files, and `git diff` shows only
   added `## Priority` blocks — no deletions, no other additions.
6. **No new drift.** `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-2.md`
   produces no drift record naming 0122–0126 or 0136 that was not already there before the change.
   (It produced none for 0126/0136 before — that absence is the gap 0156 closes, and this step must
   not be read as proof the backfill was detected.)
7. `node --test test/` is green.

## Notes

- **Depends on: nothing.**
- **Blocks: 0156 — hard.** 0156 adds a `brief-missing-priority` drift kind; four of the six briefs
  above are live `✅ Done` rows in `sprint-2.md` at P105–P108, so shipping the guard first makes it
  red on day one against real repo state. Land this first and the guard is green immediately, with
  nothing grandfathered — the same standard 0152's brief sets for its own guard.
- **Cheap and low-risk: six one-line insertions with values already known.** Sized accordingly. It is
  ranked where it is because nothing is actually mis-ordering today, not because it is hard.
- **Not a dual-home concern.** Neither `ai-agents/tasks/README.md` nor `ai-agents/README.md` documents
  the brief schema (verified 2026-07-27 — the schema lives only in
  `claude/skills/fkit-task-brief/SKILL.md`), and task briefs are not synced into
  `claude/scaffold/`. No scaffold copy changes.
- **⚠️ Priority 133 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  `/fkit-task-brief` step 5 requires appending after the existing highest priority and forbids
  renumbering or inserting into the owner's ranking. On merit this belongs **immediately above 0146
  (currently P130)** — above the archival-correction cluster (0146, 0149) because it touches a rule the
  sprint driver reads live rather than a closed record, and it is among the cheapest items on the
  board; below 0151 (P122) and everything above it, because 0151 fixes a pointer that misdirects an
  agent **today** whereas this one is latent. The merit/append gap is about three slots.
