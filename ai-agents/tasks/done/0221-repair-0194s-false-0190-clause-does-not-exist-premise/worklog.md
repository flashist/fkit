# Worklog — task 0221: repair 0194's false premises 2 and 3

**Role:** `fkit-coder`, spawned as the **Build worker** of a `/fkit-sprint-ship-loop` run (live
`fkit lead` driver session), 2026-09-15.

**Authority:** the loop's declared-approval marker — the owner approved `plan.md` via `AskUserQuestion` in
the driver session on 2026-09-15 (option label *"Approve (Rec)"*). The approved plan is the standing
approval and the scope boundary.

**Plan pointer verified before any work:** `git hash-object plan.md` →
`6e8eb411f68b8c3479b09f6c34f183ad2423c3c0` — matches the driver's stated pointer. A hash pins which
bytes were carried, not which were approved.

**No owner channel** (ADR-021). No commit.

## ⚠️ Plan-role misroute (owner ruling)

`plan.md` was written by hand by `fkit-producer`. ADR-044 §D2 routes Plan to the Build role,
`fkit-coder`. The owner ruled on 2026-09-15, verbatim option label *"Use it, note the misroute (Rec)"*:
this producer-written plan is the plan of record, the misroute is recorded here, and `fkit-coder`
builds. Recorded, not repaired.

## Step 1 — re-measurement (command output, verbatim)

Everything located by wording, not line number.

**Premise 1**

```
$ ls test/skill-ownership-sites.mjs
ls: test/skill-ownership-sites.mjs: No such file or directory
exit=1
$ ls -d ai-agents/tasks/*/0189-*
ai-agents/tasks/backlog/0189-build-the-skill-ownership-site-registry-and-completeness-tripwire
--- 0189 status
## Status
🔲 Backlog
```

**Premise 2** — wrap-tolerant (`perl -0`, `\s+` between words) and a one-line grep:

```
$ ls -d ai-agents/tasks/*/0190-*
ai-agents/tasks/done/0190-add-adr-037s-worker-side-precedence-clause-to-the-universal-rules-block
--- premise 2 (whole bullet, claude/scaffold/universal-rules.md)
- **A skill rule beats a contrary spawn instruction** unless that instruction names an owner ruling
  on that point. With no such ruling: take the cheapest-to-reverse branch (usually the rule's),
  escalate if it changes the outcome, never silently comply or refuse.
multiline-match-count=1
universal-rules heading: ## Universal hard rules (every role, every session)
```

It is the final bullet of that section (the next line is blank, then `## Output style`).
`git diff --stat -- claude/scaffold/universal-rules.md` → empty (file unmodified in the working tree).

**Premise 3** — whole bullet, from the phrase down to just before the next top-level `- **` bullet:

```
$ ls -d ai-agents/tasks/*/0191-*
ai-agents/tasks/done/0191-add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules
multiline-match-count=1
SKILL heading: ## Hard rules
- **Never instruct into the territory of a rule in the skill a worker will run without naming the owner
  ruling you relay** (ADR-037 §3 — the driver-side half of the owner's Q2 ruling; this ADR binds the
  driver, not only the worker). Exactly one of three is permitted:
  - **Name the ruling** — what the owner ruled, when, on what point — and the instruction binds.
  - **Get the ruling first.** You hold the owner channel the worker lacks (ADR-021); if the point
    matters, ask before spawning.
  - **Do not issue it.** Let the skill rule stand.

  **A bare directive into a rule's territory is a defective instruction, and the worker's conservative
  branch is the correct response to it, not an obstruction** — do not read a worker's escalation here as
  a failure to follow orders. **This clause is weaker than its worker-side twin** and ADR-037 §3 records
  that deliberately: the worker-side clause reaches every spawn through the universal rules block, while
  this one binds you only because *you* load this file, and it reaches no worker.
```

`claude/skills/fkit-sprint-ship-loop/SKILL.md` has a pre-existing uncommitted diff — the two-line
`claude/skills/…` → `.claude/skills/…` dashboard-path swap in the board-reading step. Checked: it does
not touch this clause. Both quotes were taken from the working-tree files as they are. **Both clause
texts match `0221`'s 2026-08-05 / 2026-08-14 quotes word for word** — no rewording since.

**`0194` edits since the plan:** `git diff --stat` on `0194`'s brief → empty (no uncommitted edits);
`git log -1` → `2eed3e9`, 2026-08-21, "Sprint push". Read in full before editing.

**Stop rule — did not fire.** Measured: premise 1 true, premise 2 false, premise 3 false — matches the
plan's table exactly.

**Dates from the done worklogs.** `0190`'s worklog: Build worker spawned 2026-08-04; the date is
recorded as "Date: 2026-08-04". `0191`'s worklog records that the owner approved its plan on 2026-08-04
"before any source was written", and that review round 1 was processed on 2026-08-05. It does not state a
separate build date in so many words. So premise 3 says *"Built on a plan the owner approved 2026-08-04,
per `0191`'s worklog"* rather than asserting a flat build date or a close date.

## Steps 2–6 — what changed in `0194`'s brief

- **Step 2 — premises 2 and 3 replaced in place.** Numbers `2.` and `3.` kept. Each new item names the
  clause, its file and section, its date as recorded, its folder in `done/`, then a verbatim blockquote.
  Premise 3's quote carries the three sub-bullets and the "weaker than its worker-side twin" paragraph,
  with a bare `>` on the blank line so the list stays inside the quote.
- **Step 3 — heading:** `three prerequisites, all open` → `three prerequisites, one still open (`0189`)`.
  Searched the repo for the old heading text and for an anchor slug (`why-it-cannot-be-done-now`): no
  anchor link anywhere. The old text appears only as prose quotes (in `0221`'s brief/plan, `0237`'s done
  plan/review, and board cells), none of them link targets.
- **Step 4 — `## Notes`: no edit.** `0306` already did this step: both of its 2026-08-15 dated
  corrections say one open prerequisite, `0189`. Re-read against step 1: `0190` and `0191` are in
  `done/` and `0189` is in `backlog/` with `🔲 Backlog` — neither correction has gone stale. The original
  "at filing" sentence is left as true history.
- **Step 5 — dated note** added directly under the corrected heading. It says: re-measured 2026-09-15;
  item 1 still true, with its "verified 2026-08-02" stamp unchanged; items 2 and 3 corrected by `0221`;
  snapshots to re-check at pull time; `0194` still blocked on `0189` alone, nothing here makes it ready.
- **Step 6 — nothing else moved.** See verification 6.

### Deliberate differences, recorded

1. **Replace, not annotate — differs from `0306`'s style on this same brief.** `0306` left the original
   lines and added dated sub-bullets. That would leave false text standing and break brief verification
   3. `0221`'s brief says "in place. Replace", and success needs zero false premises at close. Deliberate.
2. **Section name given in full.** The plan says `## Universal hard rules`. The real heading is
   `## Universal hard rules (every role, every session)`. The premise uses the real heading.
3. **Brief verification 3's expected hit count is wrong.** `0221`'s brief (its second 2026-08-14
   correction) says the grep must return "only premise 1's hit". Premise 1 actually reads "The registry
   module does not exist", which does not contain "clause does not exist". The correct result is **zero**
   hits, and that is what was measured.
4. **`0191` date wording** — see "Dates from the done worklogs" above.

## Verification

1. **Step-1 output quoted** for all three premises and all three folder locations — above. ✅
2. **Diff scope.** ⚠️ **Whole-tree `git diff --stat` lists 24 files, not one.** 23 of them are
   pre-existing uncommitted changes from other work: closed tasks 0392, 0388, 0390, 0389, 0134, the
   boards, `claude/` skills and conventions, `test/dashboard-contract.test.js`, `test/prove-red.sh`,
   several briefs, and `0221`'s own `## Status` flip (its diff is exactly that one line). **This run's
   change is confined to `0194`'s brief:** it had no diff before this edit (`git diff --stat` on it was
   empty in step 1), and it is the only file this run edited. Now: `1 file changed, 31 insertions(+),
   3 deletions(-)`. `claude/scaffold/universal-rules.md`, `0190`'s and `0191`'s folders show no diff; the
   `fkit-sprint-ship-loop/SKILL.md` diff is the pre-existing path swap only. ✅ (for this run's change)
3. **`/usr/bin/grep -n "clause does not exist"` on `0194`'s brief** → no output, exit 1 (zero hits).
   Wrap-tolerant `perl -0ne` count of `clause\s+does\s+not\s+exist` → `0`. ✅
4. **Quotes exact.** Stripped the `   > ` prefix (and the bare `   >`) from each quote, then `diff`ed
   against the bullet freshly extracted from the source file:
   - premise 2 vs `universal-rules.md` → identical, 3 lines ✅
   - premise 3 vs `SKILL.md` → identical, 13 lines ✅ (the source extract's trailing blank line before the
     next bullet was trimmed before diffing; it is a separator, not part of the bullet)
5. **Count agrees everywhere** — heading "one still open (`0189`)"; the step-5 note "on `0189` alone";
   `0306`'s first correction "Current dependency: `0189` alone"; `0306`'s second correction "Not three —
   one … `0189` alone survives as the block". ✅
6. **Nothing else moved.** `git diff -U0` on `0194` shows exactly two hunks: `@@ -27 +27,6` (heading +
   new note) and `@@ -31,2 +36,25` (premises 2 and 3). No hunk touches the
   `- **Depends on:** \`0189\`, \`0190\`, \`0191\`.` line, `## Status`, `## Owner`, `## Priority`, premise 1,
   the scope/trigger-scoring steps, the "Why it is a row…" section or the append-rank flag. Compared by
   diff, not by `0221`'s backtick-less quoted form. ✅
7. **No test run** — documentation-only change; none needed and none claimed.

## Residuals — reported, not fixed (out of scope: one file only)

- `ai-agents/sprints/sprint-9.md`, row `0221`: still says *"EXACTLY ONE of the three premises is false"*.
- `ai-agents/sprints/backlog.md`, row `0194`: still says *"three prerequisites, all open"* (and row `0221`
  quotes the same phrase). Board cells are kept byte-identical by convention.
- `0221`'s `## Notes`: *"Priority: medium"* conflicts with `## Priority` `P6`.
- `0221`'s brief verification 3 expects one hit where the correct count is zero (difference 3 above).
- Wiki pages that mention `0194` may carry stale premises — `fkit-wiki`'s to fix (ADR-005). Not checked.

## Decision log

No review fix was applied (Build step, no review yet). Two small wording calls were made without asking,
recorded here so a wrong one is findable:

- **Full section heading in premise 2** (difference 2). Plan wrote `## Universal hard rules`; the file's
  heading is `## Universal hard rules (every role, every session)`. Why it qualified: obvious winner
  inside the plan's intent (name the section) — the exact heading is strictly more accurate.
- **`0191` date phrased as "built on a plan the owner approved 2026-08-04"** (difference 4). Plan said
  "built 2026-08-04" as recorded in the worklog; the worklog records the approval date and "before any
  source was written", not a flat build date. Why it qualified: the plan itself says to give the date only
  as recorded and not to guess — this is that instruction applied literally.

Differences 1 and 3 are instructed by the plan verbatim and are not calls.

## Process review — round 1 (2026-09-15)

**Role:** `fkit-coder`, spawned as the **Process-review worker** of the same `/fkit-sprint-ship-loop` run,
under its declared-approval marker. `git hash-object plan.md` → `6e8eb411f68b8c3479b09f6c34f183ad2423c3c0`
— matches the driver's pointer.

- **Step 0:** opened `review.md` (Coverage: both reviewers measured). Accepted residuals: empty. ADRs in
  scope skimmed: ADR-036, ADR-037, ADR-044.
- **Step 1:** Reviewer findings has zero rows ("no findings from either reviewer"). Novel set: empty.
- **Steps 2–5:** nothing to loop-check, verify, classify or verdict. No Coder response rows; a one-line
  round note added under Coder response instead.
- **Step 6:** no fix to apply. Header `Status:` set `in-review` → `closed-out`. `Coverage:` untouched
  (reviewer's).
- No source change. `0194`'s brief, `plan.md`, `0221`'s brief, the boards and `wiki-vault/` not touched.
  No commit.

### Decision log (Process review)

none — no fix applied without asking, no obvious-winner call made.
