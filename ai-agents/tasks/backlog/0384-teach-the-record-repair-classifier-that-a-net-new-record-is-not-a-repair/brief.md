# Teach the record-repair classifier that a net-new record is not a repair — it scores `0337` and `0340` wrong today

## ID
0384

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### Authority

**Owner ruling 2026-09-10**, given live via `AskUserQuestion` in a `fkit lead` session — a selection
from the question's option list, and **the option label is the verbatim text**:
**"File it as a Backlog row (Rec)"**.

⛔ **Filed on the Backlog board, UNRANKED, appended last** — no row was renumbered, reordered or
re-ranked ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
⛔ **It is NOT on Sprint 8**, and Sprint 8's seven rows, goal and success criterion are unchanged by
this filing. Filed by a spawned `fkit-producer` with no owner channel
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
executing the mechanics of a relayed ruling and deciding nothing beyond them.

### The defect, measured — not asserted

`claude/skills/fkit-status/throughput.mjs` classifies a task folder as **record repair** when the
leading token of its slug is one of nine verbs. **Run 2026-09-10 at HEAD `9943dcf`**,
`node claude/skills/fkit-status/throughput.mjs --list` scores **two of Sprint 8's seven rows** as
record repair, and ⛔ **both are wrong**:

| Row | Verb | Scored | What the row actually is |
|---|---|---|---|
| [`0337`](../../done/0337-record-the-decision-that-the-current-sprint-is-the-lowest-numbered-open-sprint-not-the-highest/brief.md) | `record` | `record-repair` | ⛔ **A NET-NEW ADR.** It designs a sprint lifecycle that **does not exist** — status vocabulary, a line-3 banner carrier, `sprints/cancelled/`, producer-only movers. It repairs no record; it writes one that was never there |
| [`0340`](../../done/0340-backfill-a-sprint-status-onto-every-existing-sprint-plan-in-this-repo/brief.md) | `backfill` | `record-repair` | ⛔ **A ONE-TIME DATA MIGRATION** onto this repo's own plans — it stamps the field `0337` invents onto records that predate the field. Nothing it touches was stale, false, or self-contradictory |

The other five score `other`: `0271` `pin`, `0338` `flip`, `0339` `teach`, `0341` `build`, `0381`
`give`.

### ⛔ WHY THIS MATTERS — THE RULING IT CONTRADICTS, AND THE REASONING THAT WAS NEVER IMPLEMENTED

⭐ **The 2026-08-29 owner ruling capped record repair and left process work uncapped.** Sprint 7's
board records it under its heading *"🎯 SUCCESS CRITERION — record-repair rows under 10% of open
work"*, in the bullet reading *"Ruling 5 caps record repair and there is **no cap on process work at
all**"*.

⭐⭐ **THE SHARP PART: that same bullet already ruled a row OUT of the class on exactly this
reasoning, and the reasoning was never put into code.** The bullet reads
*"`0361` (`P13`) is NOT record repair"* and must not be counted as such — *"it settles a live rule
conflict"*. ⛔ **That was a hand correction to the classifier's verdict, recorded in prose on a sprint
board and applied nowhere else.** `0361` closed; the rule that excluded it did not survive it.

### ⚠️ THE CONSEQUENCE, MEASURED

**Sprint 8 shipping exactly right — all seven rows closed, nothing new created — scores `21 / 104 =
20.2%`.** Derivation, re-measured 2026-09-10 rather than inherited:

- Baseline at HEAD `9943dcf`: **open 111**, **repair 23** = **20.7%**; excluding the three named
  source-defect exceptions (`0215`, `0234`, `0334`): **20** = **18.0%**.
- Closing all seven: repair `23 − 2 = 21`; open `111 − 7 = 104`; **`21 / 104 = 20.2%`** — **a fall of
  one half of one percentage point.**
- Excluding source defects: `20 − 2 = 18`; **`18 / 104 = 17.3%`**.

⛔ **A sprint that ships the lifecycle machinery and creates nothing reads as near-total failure by
that instrument.** ⚠️ **The numerator is not the only flaw — the denominator moves by seven while the
numerator barely moves at all**, so the ratio is two slow-moving numbers divided by each other.

## What to build

⛔ **FRAME ONLY — THE FIX IS NOT DESIGNED HERE, AND A RUN THAT ARRIVES HAVING ALREADY CHOSEN HAS
SKIPPED ITS PLAN GATE.** The candidate shapes, none preferred by this brief:

1. **Narrow the verb set.** Drop or split `record` and `backfill`. ⚠️ **Cheap and it curve-fits** —
   the file's own comment block warns that the set was pinned by reading all 129 open rows rather
   than by adjusting the list to hit a number, and dropping verbs to fix two rows is the exact hazard
   it names.
2. **Extend the hand-maintained exception list.** `SOURCE_DEFECT_EXCEPTIONS` already exists for
   judgements a slug cannot carry, each with a printed reason. ⚠️ **A second category is needed** —
   these two are not source defects, they are net-new records and migrations, so the existing list's
   name and reason text would have to widen or a sibling list appear.
3. **Add a NET-NEW / MIGRATION class the classifier can see** — e.g. a field a brief declares about
   itself, so the verdict stops being derived from a filename alone.
4. **Retire the metric.** ⛔ **NOT RULED and out of scope without its own ruling** — the owner ruled
   it *reported with its caveat* (Sprint 8 ruling S2). Named here only so the option is visible.
5. **Change nothing, and record why.** ⭐ **A real candidate.** The file already declares the verb
   rule *"A PROXY, PERMANENTLY"* and prints `--list` so disputed rows are checkable by hand. ⚠️ **If
   this wins, the deliverable is the written finding, not code.**

⭐ **Whichever wins must also settle `0361`'s exclusion** — the prose ruling above is unimplemented,
and a fix that leaves it unimplemented has fixed two rows and not the class.

## Verification steps

1. `node claude/skills/fkit-status/throughput.mjs --list` — `0337` and `0340` no longer score
   `record-repair`, **or** the run prints the reason they still do and the brief's finding says why
   that is right.
2. The verdict for
   [`0361`](../../done/0361-settle-whether-a-sprint-board-may-be-committed-unranked/brief.md) agrees
   with the 2026-08-29 ruling that it is **not** record repair.
3. **Re-derive every figure at run time.** ⛔ **The numbers in this brief are a 2026-09-10
   measurement and will be stale** — `open`, `repair` and both percentages must be re-measured, not
   quoted from here.
4. ⛔ **Whatever the classifier does, `--list` still prints a per-row verdict**, so a disputed row
   stays checkable by hand rather than argued about in the abstract.
5. Full test suite passes; any new behaviour proves itself red (ADR-026).

## Notes

- **Owner: fkit-coder** — `claude/skills/fkit-status/throughput.mjs` is a source file.
- **Depends on:** nothing. **Blocks:** nothing.
- ⛔ **This row does not gate Sprint 8 and must not be pulled onto it.** Sprint 8's ruling S2 makes
  the share a **reported metric that gates nothing**; this row changes how the number is computed,
  not what it decides.
- ⚠️ **The leading verb of this brief's own slug is `teach`, which scores `other`.** Deliberate — a
  slug beginning `fix` or `correct` would make this row count itself as record repair.
- ⛔ **No new devDependency** (ADR-014). ⛔ **No `ai-agents/wiki-vault/` write** (ADR-005).
- ⚠️ **THE METRIC IS GIT-DERIVED, AND THIS BRIEF'S OWN EXISTENCE MOVES IT — measured 2026-09-10.**
  `throughput.mjs` reads `git log`, not the working tree, so an **uncommitted** task folder is
  invisible to it: with this brief written but uncommitted, `open` still reads **111**, unchanged.
  ⛔ **Once it is committed, `open` becomes 112**, and the Sprint-8 counterfactual above shifts from
  `21 / 104 = 20.2%` to **`21 / 105 = 20.0%`**. ⭐ **Stated so nobody re-derives 20.2% after this row
  lands and reports a mismatch as a defect.** ⚠️ **Re-measure at pickup either way.**
- ⛔ **No secrets in any artifact.**
