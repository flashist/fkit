# Plan — task 0221: repair 0194's false premises 2 and 3

**Scope:** owner-ruled 2026-08-14, *"Widen to premise 3 (Recommended)"*. Fix premises 2 and 3 in one pass, in one file:
`ai-agents/tasks/backlog/0194-assess-adr-037s-two-clause-sites-against-the-adr-036-registry/brief.md`.
**Build role:** `fkit-coder` (ADR-044 §D1).
⚠️ **Plan-role departure:** this plan was written by `fkit-producer` by hand. ADR-044 §D2 routes Plan to the coder.

## Step 1 — Re-measure all three premises and quote the output in `worklog.md`
Find everything by its wording, never by line number.
- **Premise 1:** `ls test/skill-ownership-sites.mjs`, which should report no such file. Also `ls -d ai-agents/tasks/*/0189-*` and `0189`'s `## Status`.
- **Premise 2:** the clause in `claude/scaffold/universal-rules.md`, found by the phrase "A skill rule beats a contrary spawn instruction". Match across line breaks, because a one-line grep misses a phrase split over two lines. Also `ls -d ai-agents/tasks/*/0190-*`.
- **Premise 3:** the clause in `claude/skills/fkit-sprint-ship-loop/SKILL.md`, found by "Never instruct into the territory of a rule". Take the whole bullet, from that line down to just before the next top-level `- **` bullet. Also `ls -d ai-agents/tasks/*/0191-*`.
- **Check `0194` for edits since this plan:** `git diff` and `git log -1` on it. If it changed, re-read it before editing.
- **Stop rule:** if any measurement differs from the table below, stop and report. Never repair a premise that measures true.

| premise | expected on 2026-09-15 |
|---|---|
| 1 | true, so leave its bytes alone |
| 2 | false, so repair |
| 3 | false, so repair |

## Step 2 — Rewrite premises 2 and 3 in place
- Keep the numbers `2.` and `3.`, because `0194`'s prose refers to them.
- **Premise 2:** replace it with the shipped state. Say:
  - it is `0190`'s worker-side clause;
  - it lives in `claude/scaffold/universal-rules.md`, `## Universal hard rules`;
  - it was built 2026-08-04 per `0190`'s worklog, and `0190` is in `done/`;
  - then quote the clause as a blockquote, word for word.
- **Premise 3:** the same for `0191`'s driver-side clause. It lives in `claude/skills/fkit-sprint-ship-loop/SKILL.md`, `## Hard rules`, and `0191` is in `done/`.
  - Quote the whole bullet, including its three sub-bullets and the "weaker than its worker-side twin" paragraph.
  - Give the date only as recorded in `0191`'s worklog (built 2026-08-04). Don't guess a close date.
- **Wording to avoid:** neither new sentence may contain "clause does not exist". Brief verification 3 relies on that.
- **Why replace rather than annotate:** the brief says "in place. Replace", and success criterion 8 requires "ZERO false premises at close".
  - ⚠️ This differs from `0306`'s style on the same brief, which left the original lines and added dated sub-bullets. That style would leave false text in place, and brief verification 3 would then fail.
  - Record in the worklog that the difference is deliberate.

## Step 3 — Fix the heading's count
- Change `three prerequisites, all open` to say one of three is still open, and name `0189`.
- Nothing links to that heading by anchor, and nothing inbound uses the old heading text as a link target, so renaming it breaks nothing.

## Step 4 — `## Notes`: no edit expected
- `0306`'s dated corrections from 2026-08-15 already give the right count ("one", `0189`) under both claims.
- The original "at filing" sentence is true as history.
- Re-read both corrections against step 1. Edit only if a correction has itself gone stale, and then add a dated note rather than rewriting it.
- Record in the worklog that `0306` already did this step.

## Step 5 — Add a date stamp and a snapshot warning
Put one short dated note directly under the corrected heading. It should say:
- all three premises were re-measured on `<build date>`;
- item 1 is still true, and its "verified 2026-08-02" stamp is left unchanged;
- items 2 and 3 were corrected by `0221`;
- these are snapshots and must be re-checked when the task is pulled;
- `0194` is still blocked on `0189`, and nothing here makes it ready.

## Step 6 — Change nothing else
- Leave these in `0194` unchanged: `## Status` `🔲 Backlog`, `## Owner` `fkit-coder`, `## Priority` `Unscheduled`, the scope and trigger-scoring steps, the "Priority 172 is append rank" flag, the "Why it is a row…" section, and premise 1.
- The `- **Depends on:** \`0189\`, \`0190\`, \`0191\`.` line keeps its exact bytes.
- ⚠️ `0221`'s verification 6 quotes that line without backticks. The real line has backticks and a trailing period. Compare using the diff, not the quoted form.

## Verification
1. The worklog quotes step 1's command output for all three premises and all three folder locations.
2. `git diff --stat` lists exactly one file, `0194`'s `brief.md`. Nothing under `claude/` or `test/`, no board, and not the `0190`, `0191` or `0221` briefs.
   - ⚠️ `0221`'s own `brief.md` already shows as modified. That is its `## Status` flip, made before this run.
   - Check the new change as a new hunk inside `0194` only.
3. `/usr/bin/grep -n "clause does not exist"` on `0194`'s brief returns **zero** hits.
   - The brief's "only premise 1's hit" wording expects one, but premise 1 actually reads "The registry module does not exist". Record this in the worklog.
   - Also check across line breaks, e.g. `perl -0ne` over the file.
4. **Both quotes are exact.** Strip the `> ` prefixes, then `diff` against the source lines taken fresh from `universal-rules.md` and `SKILL.md`. The only allowed difference is the blockquote prefix.
5. **The count agrees everywhere:** the heading, the step 5 note and both `0306` Notes corrections all say one open prerequisite, `0189`.
6. **Nothing else moved:** `git diff` on `0194` shows no hunk touching the `Depends on` line, `## Status`, `## Owner`, `## Priority`, premise 1 or the append-rank flag.
7. No test run is needed and none is claimed.

## Edge cases and risks
- **A clause moves or is reworded before Build:** the quote comes from the fresh step 1 read, never from this plan or `0221`'s brief. If the text differs from `0221`'s 2026-08-14 quote, say so in the worklog.
- **`0189` closes, or `test/skill-ownership-sites.mjs` appears, before Build:** premise 1 has become false. Stop and escalate. The owner's widening covers premises 2 and 3 only.
- **Markdown nesting:** premise 3's quote contains nested bullets and a blank line. Every quoted line needs a `>` prefix, including a bare `>` on the blank line, or the list escapes the quote.

## Residuals — report, do not fix (out of scope: one file only)
- **Board cells keep stale filing text:**
  - `ai-agents/sprints/sprint-9.md`, row `0221`: *"EXACTLY ONE of the three premises is false"*;
  - `ai-agents/sprints/backlog.md`, row `0194`: *"three prerequisites, all open"*.
  - Both are kept byte-identical by convention.
- **`0221`'s `## Notes`:** *"Priority: medium"* conflicts with `## Priority` `P6`. The board says to report this, not quietly fix it.
- **Wiki pages mention `0194`** (e.g. `ai-agents/wiki-vault/wiki/decisions/adr-036-…md`). Any stale premise there belongs to `fkit-wiki` (ADR-005). Not checked this run.

## Owner rulings (2026-09-15, via `AskUserQuestion` in the `fkit lead` session — verbatim option labels)

- **Plan role:** "Use it, note the misroute (Rec)" — this producer-written plan is the plan of record; the misroute (ADR-044 §D2 routes Plan to the Build role, `fkit-coder`) is recorded in the worklog; `fkit-coder` builds.
- **Plan approval:** "Approve (Rec)".
- **Driver note (orchestrated path):** under `fkit-sprint-ship-loop` Build ends at Verification; the driver's separate Verify / Review / Process-review steps follow. No commit by any step. (`&lt;`/`&gt;` in the producer's original return were rendered here as `<`/`>`.)
