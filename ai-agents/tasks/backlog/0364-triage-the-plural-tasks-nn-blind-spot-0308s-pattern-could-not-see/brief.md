# Triage the plural `tasks NN` numerals `0308`'s singular-only pattern could not see — six sites, one of them inside `claude/scaffold/`

## ID
0364

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Owner ruling H16**, given live via `AskUserQuestion` **2026-09-03/04** in an `fkit lead` session
driving `/fkit-sprint-ship-loop` and relayed to a spawned producer. **The option label is the verbatim
text: "File a follow-up task (Rec)".**

**Authority:** [`0356`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/brief.md)'s
[`review.md`](../../done/0356-sweep-a-the-citation-rot-class-one-verified-pass/review.md) finding
**R11** and its accepted residual *"`0308`'s population pattern is singular-only, and the population is
frozen"*.

### ⭐⭐ `0308` IS NOT WRONG — read this before touching anything

[`0308`](../../done/0308-triage-and-repair-claudes-surviving-stale-task-numeral-seeds/brief.md)
closed correctly. Three strands, all verified firsthand:

1. ⭐ **Its execution was exact.** The pattern `\btask[ -][0-9]{1,2}\b` **is `0308`'s own pinned
   verification step 1**; the coder ran it as written and its 48-row triage table reproduces. *"What
   is wrong is the **completeness claim**, not the execution."*
2. ⭐ **`0308`'s pinned check still passes.** The **singular** pattern over `claude/scaffold/` returns
   **0** — re-measured 2026-09-04 — exactly as its brief requires.
3. ⭐ **The sixth site is pre-existing at `HEAD`** in a file this sweep never modified. It is a
   **blind spot, not a regression**.

⛔ **The defect is in the population *definition*, which is why its disposition was an owner call and
not a mid-close fix.** Widening the pattern during `0308`'s close would have reopened a frozen
population and voided the completeness proof of its 48-row triage table. Both alternatives were
considered and rejected on the record: *(a)* widen now — voids the triage proof at the moment of
closing; *(b)* hold `0308` open — punishes complete work for a defect in the question it was asked.

### The six sites — re-derived firsthand 2026-09-04

`grep -rInoiE '\btasks[ -][0-9]{1,2}\b' claude/` → **6 occurrences**: **5** in
`claude/skills/fkit-status/dashboard.sh` and **1** in `claude/scaffold/`.

| File | Line | Fragment |
|---|---|---|
| `claude/skills/fkit-status/dashboard.sh` | 667 | ``e.g. `- **⚠️ Depends on tasks 82…**` `` |
| `claude/skills/fkit-status/dashboard.sh` | 687 | ``a quoted `Depends on tasks 82, 83` `` |
| `claude/skills/fkit-status/dashboard.sh` | 811 | ``because `drift on tasks 59, 60` is what SKILL.md narrates`` |
| `claude/skills/fkit-status/dashboard.sh` | 864 | `# Link rot (tasks 21/22): the FOLDER moved between boards.` |
| `claude/skills/fkit-status/dashboard.sh` | 1122 | `counts — which is why live tasks 59/60 still appear.` |
| `claude/scaffold/ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md` | 20 | ``keyed its `⟦FACTS⟧` records by the **Priority cell** until task 0103 — so `drift on tasks 59, 60` named *ranks*`` |

⭐⭐ **THE SCAFFOLD SITE IS THE LOAD-BEARING ONE.** `0308`'s brief pins `claude/scaffold/` at
*"0 ⭐ and must stay 0"*. **Under the singular form it genuinely is 0. Under the plural form it is
not.**

⭐ **At least one site is a real provenance citation of exactly the repaired class.** In the
folder-recovery branch, *"# Link rot (tasks 21/22)"*: rank **21** resolves to
`0076-repair-broken-links-in-closed-sprint-plans` and rank **22** to
`0050-harden-task-movers-against-closed-sprint-link-rot` — **both match the comment's own subject**,
the identical `(task 65)` / `(task 67)` / `(task 76)` form repaired 27 times in `0308`.

⚠️ **This is the same failure one spelling over.** `0309` exists **because** a prior sweep's pattern
missed the *hyphenated* spelling. ⛔ **Codex reproduced the blind spot too** — it re-ran the singular
pattern and reported *"silent no-writes: none"*.

## What to build

**Triage first, repair second. ⛔ Step 2 may not begin on a site step 1 has not classified.**

1. **Re-derive the population yourself** with a pattern that matches **both** spellings, and record
   before-counts. ⛔ **Do not carry this brief's 6 forward unverified** — state your own number, and
   **say this brief was wrong** if it differs. Use `grep -o … | wc -l` (occurrences, not lines) and
   `-i` (case matters).
2. **Triage all six into exactly one of three classes**, one worklog row each: **(a)** stale citation
   — a pre-ADR-029 rank resolving to unrelated work today; **(b)** correct citation; **(c)**
   illustrative / grammar example. ⛔ **A site with no row is an unfinished triage, not an implicit
   "leave it".**
3. **Resolve each (a) site's referent by reading its surrounding context** — ⛔ never by arithmetic or
   pattern.
4. **Repair the (a) sites to the durable folder `NNNN` ID** (ADR-029 Decision 3). ⛔ **Never cite a
   board rank.**
5. **State positively what `claude/scaffold/` holds after the run, under BOTH spellings** — a number,
   including a zero. ⛔ Silence is not a result.
6. **Decide and record whether `0308`'s pinned scaffold check should be widened to the plural form**,
   or whether that is a separate change. Say which, and why.

⛔ **Out of scope:** re-opening `0308` or editing anything under
`ai-agents/tasks/done/0308-…/`; any behavioural change to `dashboard.sh` (**comments and prose
only** — its grammar examples document a live parser); `ai-agents/`, which is `0309`'s half; any
`.claude/` mirror edit; `ai-agents/wiki-vault/` ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

## Verification steps

1. Before **and** after occurrence counts for **both** spellings are recorded. ⚠️ **The after-count may
   legitimately be unchanged** for (b)/(c) sites — the test is the triage table, not the count.
2. **The triage table has one row per occurrence found in step 1**, and its row count equals the
   before-count. ⛔ A shorter table fails.
3. `claude/scaffold/` is reported under **both** spellings, positively, including any zero.
4. No repaired site cites a board rank.
5. `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` exits `0`, and the same
   for the active sprint plan. ⚠️ Five of the six sites are in `dashboard.sh`; a broken comment edit is
   caught here.
6. `npm test` passes — check `package.json` for the entry point rather than trusting a remembered one.
7. `git diff --stat` shows changes **only** under `claude/`.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
this sits with the other `claude/`-side citation repairs; it is small and bounded, and the scaffold site gives it a little more weight than a pure comment fix.- ⚠️ **This brief decays.** Every figure was measured **2026-09-04** at `HEAD` `6dcc33e` against a
  **dirty working tree**. **Re-measure; do not quote.**
- ⚠️ **Filed UNRANKED by a spawned `fkit-producer` with no owner channel** — this row **appends** and
  renumbers nothing ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md),
  [ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
  **On merit - ⚠️ **`0356`'s residual re-raises if this row closes without triaging all six.** That is its
  recorded condition — ⛔ a partial triage does not discharge it.
** Flagged so the owner can say otherwise.
- ⚠️ **Citation form used here:** coordination documents are cited **file + heading + quoted
  fragment**, never `path:NNN` (row 3 of
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
  **Source-file line coordinates are used where load-bearing** — row 1 rules them correct, and
  `0176`'s owner ruling **G3** (*"No, refuse — file follow-up if wanted (Rec)"*, 2026-09-02) keeps
  them legal.
