# Plan — 0516: Fix the stale ADR-019 and `fkit-coder.md` line cites found during 0496

- Planning only. Nothing written. Plan review: on.
- Re-measured 2026-10-15 at HEAD `6227119` (0496 is closed, its ADR-019 notes committed). The only uncommitted changes are the parallel producer's 0516 status edits to `ai-agents/sprints/sprint-12.md` and this task's `brief.md`. They are not ours; the baseline step records them. Every cite the brief names is still stale.
- **One cite form for every live pointer this task writes: heading + quoted fragment, no line number.** The shape is `<file or ADR> §<heading> — *"<quote>"*`. Why:
  - ADR-019 carries appended dated notes, so `durable-citation-anchors.md` (§"Applying the two conditions to a target the table does not name") rules `path:NNN` wrong for it.
  - `fkit-coder.md:165` went stale within ten days of 0472 writing it.
  - The brief allows dropping the number for heading + quote.
- Diff: **6 files** + this task's `worklog.md`: 2 skills, `claude/agents/fkit-coder.md`, ADR-025, ADR-032 and ADR-037. Both reports, every board and every brief: no edit.
- The re-grep found **one extra hit of the same kind**: ADR-037 §Decision "2. What the worker does on collision" also cites ADR-019 `:96`. It wraps across a line break, so a single-line grep misses it. The same ADR-037 note covers it.
- Verify: full `npm test` (~12 min), because `fkit-sprint-ship-loop/SKILL.md` is named in `test/prove-red.sh`.

## Ground rules
- The brief has an "owner's specific word" gate. Approving this plan is that word. Nothing is built before it.
- Fix the cite, never the prose (0393 rule). Re-wrap only the lines the new cite lengthens.
- ADRs are additions only. Original lines stay byte-identical, and `git diff --numstat` shows 0 removed lines.
- Edit canonical files in `claude/` only. Init refreshes the `.claude/` copies.
- Re-measure at build time and find every target by its content. The numbers below are 2026-10-15 measurements.
- Baseline first: save `git status --porcelain` and `git diff --numstat` to the scratchpad before the first edit, because other Sprint 12 tasks may leave uncommitted work. Every diff check compares against this baseline.
- New notes carry the build day's date. They are written below as 2026-10-15; use the real date if it differs.
- Every quoted fragment sits wholly inside or wholly outside emphasis markers, so it can be found in the source (convention §"Verifying a claim about text").
- Worklog: create `<task-folder>/worklog.md` with three parts:
  - (a) one verdict line per cite — **fixed** / **already correct** / **frozen record, left as is** / **target gone** — with the before and after text;
  - (b) a "Re-grep hits" section;
  - (c) a decision log: obvious-winner calls, or `none`.
  - No `ai-agents/sprints/*.md:NNN` or `ai-agents/tasks/*/*/brief.md:NNN` form anywhere, because `coordination-citation-policy` scans open task folders.

## Targets, re-measured 2026-10-15
| Old cite | Means | Where today | What the old number hits today |
|---|---|---|---|
| ADR-019 `:96` | *"Every autonomous choice — every obvious winner — is recorded in the task's worklog decision-log (ADR-020) so it is auditable."* | §Decision item 4, lines 119–120 | inside Decision 3's 2026-07-18 amendment note |
| ADR-019 `:97` | *"The done-gate is unchanged and owner-only."* | §Decision item 5, line 129 | same amendment note |
| ADR-019 `:148-150` | the *"A soft self-classification boundary"* bullet, *"This is the sharpest edge"* | §Consequences → Negative / costs, lines 180–182 | `## Options considered` |
| ADR-019 `:138` | *"The owner later wants relayed-consent close-out"* | §Consequences → Residual risks, lines 194–195 | Decision item 7 |
| `fkit-coder.md:165` | *"But: a genuinely NEW architecture decision goes to the OWNER."* | §Consulting a teammate, line 212 | `## Getting your work reviewed` heading |

## Steps

**1. `claude/skills/fkit-sprint-ship-loop/SKILL.md`, *Process review* row (one table line, one replacement, nothing else in the file).**
- `(ADR-032 A2 / ADR-019 `:96`)` → `(ADR-032 A2 / ADR-019 §Decision item 4 — *"Every autonomous choice — every obvious winner — is recorded in the task's worklog decision-log"*)`
- The string occurs once in the file (checked). 0496's three `fkit-process-stateful-review/SKILL.md` cites in the same row stay exactly as landed.
- Prove-red: mutation 9 only de-indents the 2nd continuation line of the frontmatter `description: >-` block (its awk is anchored on structure). This row is far below it. No test reads the row text (grep of `test/` for the cite and the quote: no hits).

**2. `claude/agents/fkit-coder.md`, Process-review worker bullet ("Record what you did unattended").** Lines 114–116 today:
```
  ([ADR-019](../../ai-agents/knowledge-base/decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)
  `:96`; ADR-020's worklog decision log): for **each** fix applied without asking and **each**
  obvious-winner call, record in the task folder's `worklog.md`, **in its decision log** —
```
become:
```
  ([ADR-019](../../ai-agents/knowledge-base/decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)
  §Decision item 4 — *"Every autonomous choice — every obvious winner — is recorded in the task's
  worklog decision-log"*; ADR-020's worklog decision log): for **each** fix applied without asking and
  **each** obvious-winner call, record in the task folder's `worklog.md`, **in its decision log** —
```
- Net +1 line. Inbound `fkit-coder.md:NNN` cites below line 114 (ADR-044, the Backlog board and brief 0287, all `:211`) are already stale; the vault ban is at line 267. So no correct cite breaks. `fkit-task-ship-loop/SKILL.md`'s `fkit-coder.md:28-33` is above the edit and unaffected.
- Prose-unchanged check: whitespace-normalise the whole Process-review-worker bullet before and after, stripping leading indentation only (`sed 's/^[[:space:]]*//' | tr '\n\t' '  ' | tr -s ' '`), then diff the two strings. The only difference must be `` `:96` `` → the §Decision item 4 anchor. Record the result in the worklog. Run the same check, with the same command, on Step 3's bullet. The `>*-` strip is used only for the separate "quote is findable in the target" check, never for this before/after diff, because it removes a `**` that a re-wrap moves to a line start.

**3. `claude/skills/fkit-task-ship-loop/SKILL.md`, step 6's "⛔ STOP" bullet.** Lines 168–169 today:
```
     anything **outside the approved plan** (a new architecture/scope decision → owner,
     `fkit-coder.md:165`).
```
become:
```
     anything **outside the approved plan** (a new architecture/scope decision → owner,
     `fkit-coder.md` §Consulting a teammate — *"But: a genuinely NEW architecture decision goes to the
     OWNER."*).
```
- This points at the same rule `:165` meant (the architecture paragraph). The scope half is not added: fix the cite, not the prose.

**4. ADR-025 — header `Reverses` bullet's `adr-019:97`.** ADR-025 has no `Corrections:` bullet. Insert one new header bullet directly after the `Reverses` bullet (after the line ending `*"the done-gate is unchanged and owner-only"*).`) and before `- **Pre-registered:**`. The bullet is both the index and the note:
```
- **Corrections:** 2026-10-15 (`0516`) — this ADR carries **one** dated note, and this bullet is it.
  ⚠️ The line number in the **Reverses** bullet above (`:97`) no longer points at ADR-019's done-gate
  decision; the amendment is unchanged. It means ADR-019 **§Decision item 5**, which opens *"The
  done-gate is unchanged and owner-only."* Find it by that quote; ADR-019 carries appended dated notes,
  so its line numbers move. Marker legend: **⚠️ = a fact that drifted** (the decision is untouched);
  **⛔ = a decision that was overturned** (do not follow it). No existing line of this ADR was edited;
  the note is an append, and the Status stays `accepted`.
```
- The note restates the old cite as `` `:97` `` without an `adr-019` prefix, so future `adr-019:NNN` sweeps do not hit it again.
- Inbound line cites into ADR-025: none (checked).

**5. ADR-032 — §Amendment (2026-07-22) → A2, the paragraph "ADR-019's audit obligation transfers with its permission" (`ADR-019 `:96`` and `ADR-019 `:148-150``).** Two additions:
- **A. Index line**, appended after the last line of the existing `Corrections:` bullet (after the `0473` line ending "the same legend apply."), with a 2-space indent:
```
  ⚠️ 2026-10-15 (`0516`) — this ADR now carries **five** dated notes: the four the `0473` line above
  lists, plus one cite correction below **§Amendment → A2**'s paragraph *"ADR-019's audit obligation
  transfers with its permission"*. The count in the `0473` line is left byte-identical and is
  superseded by this line; the same append-only rule and the same legend apply.
```
  (Four existing notes confirmed: `0170` under Decision 1, `0473` under Decision 3, and two `0475`.)
- **B. Inline note**, after that A2 paragraph (which ends *"that accepted cost transfers unchanged."*) and before the existing `> **Stated as a requirement, not yet true of the implementation.**` blockquote, with a blank line on each side:
```
> ⚠️ **Dated note 2026-10-15 (`0516`) — the two ADR-019 line numbers in the paragraph above (`:96`,
> `:148-150`) no longer point at their text; A2 is unchanged.** The first means ADR-019 **§Decision
> item 4**'s closing sentence, *"Every autonomous choice — every obvious winner — is recorded in the
> task's worklog decision-log"*; the second means ADR-019 **§Consequences → Negative / costs**, the
> bullet *"A soft self-classification boundary"* (*"This is the sharpest edge"*). Find both by quote;
> ADR-019 carries appended dated notes, so its line numbers move.
```
- Inbound line cites into ADR-032: only the Backlog board's closed row `ADR-032`:129-133``, which is already stale and closed history. No correct cite breaks.
- The same A2 region has other stale cites (`fkit-coder.md:73-82`, `SKILL.md:105`, `SKILL.md:118-121`). They are not ADR-019 cites, so they are out of scope and listed in the worklog as seen.

**6. ADR-037 — §Decision "2. What the worker does on collision" (`ADR-019`\n``:96``, wrapped) and §Related (`[ADR-019](…) `:96``).** One note covers both sites, following the precedent of ADR-032's `0170` note (one note, two sites).
- **A. Index line**, appended after the last line of the existing `Corrections:` bullet (after the `0475` line ending "same legend apply."):
```
  ⚠️ 2026-10-15 (`0516`) — this ADR now carries **three** dated notes: the two the `0475` line above
  lists, plus one cite correction at the end of **§Decision → 2. What the worker does on collision**,
  below the paragraph *"The audit obligation, which is what makes the flag real."*; it also covers the
  same ADR-019 line number in §Related. The count in the `0475` line is left byte-identical and is
  superseded by this line; the same append-only rule and the same legend apply.
```
- **B. Inline note**, after that paragraph (which ends *"is a defect in the worker's output."*) and before `### 3. What the driver may not instruct`:
```
> ⚠️ **Dated note 2026-10-15 (`0516`) — the ADR-019 line number in the paragraph above (`:96`), and
> the same one in §Related, no longer point at their text; §2 is unchanged.** Both mean ADR-019
> **§Decision item 4**'s closing sentence, *"Every autonomous choice — every obvious winner — is
> recorded in the task's worklog decision-log"*. Find it by quote; ADR-019 carries appended dated
> notes, so its line numbers move.
```
- Inbound line cites into ADR-037 (ADR-038's `…:33`, and two reports' `:247` and `:249`) are already stale or sit in dated records. None is correct today, so none breaks.
- Record in the worklog decision log: one note covers ADR-037's two sites, and there is no note beside §Related; a reader reaches it through the index line and the §2 note. Why: ADR-032's `0170` one-note-two-sites precedent, and a second note would add a third dated note for one fact.

**7. The two reports — no edit.**
- `reports/2026-07-18-design-spawned-invocation-consent-model-for-task-movers.md` (`adr-019:138`, §8.1): its own header calls it *"now the evidence record of what was weighed, not a live design"* → **frozen record, left as is**.
- `reports/2026-08-05-eval-process-review-step-role-ownership.md` (`ADR-019 `:96``): the cite sits inside a quoted copy of the row → **frozen record, left as is**.

**8. Re-grep, logged in the worklog.** Done at plan time with a multi-line scan (not a single-line grep) over tracked and untracked files, excluding closed task folders, `ai-agents/wiki-vault/` and `.claude/`. It is re-run at build. Hits beyond the brief's list:
- ADR-037 §Decision 2 `:96` → same kind → **fixed** (step 6).
- The Backlog board row for 0516 (which names `fkit-coder.md:165` as this task's subject) and 0516's own brief → not live pointers → logged, not fixed. Boards are producer-owned anyway.
- No other `ADR-019`/`adr-019` + line-number cite, and no other `fkit-coder.md:165`.

**9. Refresh the dogfooded copies.** Run `claude/fkit-claude-init.sh .`. Confirm with `cmp` that `.claude/skills/fkit-sprint-ship-loop/SKILL.md`, `.claude/skills/fkit-task-ship-loop/SKILL.md` and `.claude/agents/fkit-coder.md` match their sources. Then compare `git status --porcelain` with the baseline. If init changes any **tracked** file, do not revert it and do not keep it silently: return `NEEDS-DECISION`.

**10. No CHANGELOG entry.** Users see no change (cite-only); 0496 made the same call.

## Verify
- Checks, from CONTRIBUTING's "What to run for a change" table:
  - ADRs → `test:docs`.
  - `fkit-coder.md` and `fkit-task-ship-loop/SKILL.md` → `test:unit`.
  - `fkit-sprint-ship-loop/SKILL.md` is named in prove-red (confirm with `grep -F 'skills/fkit-sprint-ship-loop/SKILL.md' test/prove-red.sh`) → **full `npm test`**. It is the heaviest row and covers the other two.
  - **Skipped: none.** Report the measured pass/fail counts, or any failure with its output.
- Diff vs baseline: only the 6 files plus the task folder changed. `git diff --numstat` shows 0 removed lines for ADR-025, ADR-032 and ADR-037.
- Per fixed cite: open the target and confirm the quoted fragment is found (whitespace-normalised match: `sed 's/^[[:space:]>*-]*//' | tr '\n\t' '  ' | tr -s ' '`) and is the sentence the table above describes. Record it in the worklog.
- The prose-unchanged check (Steps 2 and 3) passes and is recorded.
- No fixed live pointer carries a line number; every one is heading + quote.
- Check by eye that it renders: the new ADR-025 bullet and the ADR-032/037 continuation lines stay inside their header bullet, and the new blockquotes do not merge into their neighbours.
- Worklog verdict lines: item 1 (1) + item 2 (fkit-coder 1, ADR-025 1, ADR-032 2, reports 2, ADR-037 §Related 1) + item 3 (1) + re-grep extra (ADR-037 §2 1) = **10 verdict lines**, plus the 2 logged non-pointer hits.

## Risks and edge cases
- The lead is running `fkit-sprint-ship-loop` right now. Refreshing its `.claude/` copy changes only a cite. The same goes for the coder agent file that other spawns read.
- Parallel Sprint 12 tasks: none of 0385, 0284, 0334, 0507, 0510, 0508, 0503 or 0500 plans to edit these 6 files (checked by grepping their briefs). The baseline catches anything that does.
- If ADR-019 changes again before the build, re-measure. The quote-anchored form does not drift with line numbers.
- The quoted fragments wrap across lines in their targets, so a single-line grep will miss them. Use the normalised match above.

## Out of scope — seen, not fixed
- Other stale cites that are not ADR-019 cites: in ADR-032 A2 (`fkit-coder.md:73-82`, `SKILL.md:105`, `:118-121`), in ADR-025's header (`CLAUDE.md:55` etc.), and ADR-038's `adr-037…md:33` (already stale). They are listed in the worklog only.

## Open questions
- None blocking. (See the post-Codex questions after the record block.)

## Owner-approved amendments at the plan gate (post-Codex X1 and X2)

The plan above is the coder's plan as returned. The owner approved it together with the coder's
recommended answers to its two post-Codex questions. The question lines and option labels below are
the lead's condensed wording; the fenced ADR-025 note, the worklog/count sentences and the closing
"If the owner approves…" paragraph are copied from the coder's return. Where they differ from the
plan above, these amendments govern.

**Q1 — X1: fix ADR-025 §Related's two stale ADR-019 cites (`:97`, `:143`) too?** Option 1 — fix both in the same ADR-025 note. Step 4's bullet becomes:
```
- **Corrections:** 2026-10-15 (`0516`) — this ADR carries **one** dated note, and this bullet is it.
  ⚠️ Three ADR-019 line numbers in this ADR no longer point at their text; the amendment is
  unchanged. The `:97` in the **Reverses** bullet above and the `:97` in §Related's ADR-019 entry
  mean ADR-019 **§Decision item 5**, which opens *"The done-gate is unchanged and owner-only."*;
  §Related's `:143` means the ADR-019 **§Consequences → Residual risks** bullet *"The owner later
  wants relayed-consent close-out"*. Find both by quote; ADR-019 carries appended dated notes, so
  its line numbers move. Marker legend: **⚠️ = a fact that drifted** (the decision is untouched);
  **⛔ = a decision that was overturned** (do not follow it). No existing line of this ADR was
  edited; the note is an append, and the Status stays `accepted`.
```
Worklog: +2 verdict lines (ADR-025 §Related `:97` and `:143`, both **fixed**). Step 8 is corrected to list them as re-grep hits.

**Q2 — X2: add the missing verdict line for the report's second `:138` (§Related)?** Option 1 — yes. +1 worklog verdict line, **frozen record, left as is**. The total becomes 11, or 13 with Q1 option 1.

**If the owner approves the plan with Q1 = 1 and Q2 = 1**, the driver's `plan.md` should carry the plan above with Step 4's note replaced by Q1's text, Step 8 listing ADR-025 §Related's `:97` and `:143` (fixed) and the report's §Related `:138` (frozen), and Verify's count at **13 verdict lines**.
