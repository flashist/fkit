# Plan — 0496: Fix nine stale line cites and claims found during Sprint 10

- Planning only. Nothing written. Plan review: off. The `fkit-architect` consult that the brief requires for items (g), (h) and (i) is **done at plan time**: hop 2 of 2, chain lead → coder → architect, verdict CHANGES REQUESTED, and all of its changes are adopted below. That means the owner approves the exact ADR text at this gate.
- All 9 items were re-checked against today's working tree (2026-10-14). Every cite the brief names is still stale, except where noted below.
- The diff touches **9 files**: 1 skill, 1 init script, 1 test, `RELEASING.md`, 3 ADRs and 2–3 open briefs (`0328`, `0382`, `0403`). Plus this task's `worklog.md`. Brief `0284`, brief `0436` and the Backlog board get **no edit**.
- Verify runs the **full `npm test`** (about 12 minutes). It is required because of 3 rows in the CONTRIBUTING table (see §Verify).
- 3 open questions are at the end. Each has a recommendation, and none blocks starting with the recommended option.
- ⚠️ Found while planning, outside this brief: more stale cites, and a likely-obsolete part of brief `0284`. They are listed in §Out of scope, and OQ3 asks what to do with them.

## Ground rules
- **The owner's specific word.** The brief carries a "do not start without the owner's specific word" gate. R11 pulled the task into the sprint, and this plan gate is that word. Nothing is built before approval.
- **Cites:** fix the cite, never the prose (the 0393 rule). Pair each fixed number with a quoted fragment or name (`durable-citation-anchors.md`).
- **ADRs:** additions only, and the original text stays byte-identical.
- **Code comments (new convention `code-comments.md`, rule 2):** a pointer in code names its target and never uses a line number. So in (b) and (c) the line number is **replaced by a name**, which the brief allows ("next to (or instead of) the number"). See OQ1.
- **Baseline first.** The tree holds uncommitted work from 0506, 0501 and others. Before the first edit, save `git status --porcelain` and `git diff --numstat` to the scratchpad. Every later diff check compares against that saved state.
- **Worklog.** Create `<task-folder>/worklog.md`. It gets one verdict line per cite or claim (**fixed** / **already correct** / **frozen record, left as is** / **target gone**) with the before and after text. It also gets a decision log: the architect ruling, OQ answers, and any obvious-winner call, or `none`. ⛔ No `ai-agents/…/brief.md:NNN` or `ai-agents/sprints/*.md:NNN` form anywhere, because `coordination-citation-policy` scans open task folders. Name briefs by ID plus a quoted fragment.
- **Re-measure every number below at build time.** Find each target by its content. These numbers were measured 2026-10-14.

## Steps

**1. (a) `claude/skills/fkit-sprint-ship-loop/SKILL.md`, *Process review* row.** One table line, three replacements, nothing else in the file:
- `` (`fkit-process-stateful-review/SKILL.md:195`) `` → `` (`fkit-process-stateful-review/SKILL.md:208` — *"Step 6 — Apply approved fixes + update the shared file"*) ``
- `` (`fkit-process-stateful-review/SKILL.md:85`) `` → `` (`fkit-process-stateful-review/SKILL.md:96-97` — *"Status vocabulary"*) ``
- `` (`fkit-process-stateful-review/SKILL.md:103-104`, `:119-120`) `` → `` (`fkit-process-stateful-review/SKILL.md:114-118` — Step 0's *"create it"* — and `:132-133` — Step 1's *"If findings arrived as pasted text"*) ``
- That covers 4 cites, all verified stale. Line 195 is the Step 5 heading. Line 85 is "by their stable id". Line 103 is "You are a critical filter". Line 119 is the residuals/ADR loading.
- Prove-red check: mutation 9 only de-indents the frontmatter `description: >-` block, so editing this row cannot move its target. No test reads the row text (checked by grep).
- ⚠️ The same row also cites `ADR-019 :96`, which is stale too. It is **not** fixed here, because the brief says "nothing else in the file changes". See OQ3.

**2. (b) `claude/fkit-claude-init.sh` (comment near line 644).**
- `probe (fkit-claude.sh:576) just` → `probe (fkit-claude.sh, fresh-project start) just`.
- Its target, `[ -x "$proj/.fkit/interview" ]`, is at launcher line 656 today.
- Comment only. Re-wrap only those two lines, and only if they get too long.

**3. (c) `test/orphan-cleanup.test.js` (comment near line 288).**
- `` `claude/fkit-claude.sh:311-312` writes `` → `` `build_settings()` in `claude/fkit-claude.sh` writes ``.
- The write is at lines 392–393 today, inside `build_settings()`, which runs on every launch path (lines 662 and 750). So the claim around the cite still holds.
- Comment only. The rest of that long comment is left for `0515` (see OQ1).

**4. (d) `RELEASING.md`.**
- `:79-91` → `` `claude/fkit-claude.sh:80-92`, `_fkit_remote_sha()` ``
- `:92-98` → `` `claude/fkit-claude.sh:93-99`, `_fkit_remote_version()` ``
- `:202-208` → `` `claude/fkit-claude.sh:203-209`, the `if [ -n "$rver" ] && [ -n "$curver" ]` block ``. It was off by one: line 202 is a comment, and the block ends at the `fi` on line 209.
- `:124` (`fkit_ref=…:-main`) and `:185` (`if [ -n "$remote" ] && [ -n "$installed" ]`) are **already correct** and are not touched.
- No links are added, so this is safe for 0484's link check, which runs after this task.

**5. (e) Open briefs that cite launcher lines.**
- A re-grep for `fkit-claude.sh:<n>` across `ai-agents/tasks/backlog/` found **14 cites in 4 briefs** (0284, 0328, 0382, 0403). 0472 is closed, so there is no skip set.
- Per-cite verdicts:

| Brief | Cite → today | Section | Verdict |
|---|---|---|---|
| 0284 | `:69`, `:60-63` | table "Verified on disk 2026-08-13" | frozen record, left as is |
| 0284 | `:126-165`, `:79-91` | "The defect, measured" / "Verified line by line 2026-08-13" | frozen record, left as is |
| 0284 | `:99-103` | "Re-measured on disk 2026-08-13" | frozen record, left as is |
| 0284 | `:101-102`, `:99-103` | "Two distinct defects… (folded in 2026-08-13)", "as it stands on disk" | frozen record, left as is |
| 0328 | `:355-361` | "ONE PREMISE… WAS WRONG" (the 2026-08-23 audit's measured run) | frozen record, left as is |
| 0328 | `:363-367` → `:424-431` | **What to build** (live pointer) | **fixed** — `` `claude/fkit-claude.sh:424-431` (the `case "$setup_rc" in` block) `` |
| 0382 | `:606` → `:652` | "What is unpinned" (live pointer, already paired with the quoted `if`) | **fixed** — number only |
| 0382 | `:606` | "Verified firsthand on 2026-09-07" | frozen record, left as is |
| 0382 | `:606` | Notes, "used deliberately" | already correct. It describes the citation form, and `:606` still appears in the dated section. |
| 0403 | `:259` → `:305`, `:264` → `:310` | "The checklist…" (live pointer; the identical text is quoted two lines above) | **fixed** — numbers only |

- No optional dated notes are added to 0284. Its real problem is bigger than line numbers (see §Out of scope).
- Short-form `:NNN` launcher cites (0284's What to build, about 15; 0328's `:373-377`, `:387-392`, `:331`, `:336`) are **not in this sweep**. See OQ2.

**6. (f) Backlog board, `CLAUDE.md:58`** (the `➡️ Moved to Sprint 8` row for 0341). **No edit.** Verdict: frozen record, left as is. It is a closed row.

**7. (g) ADR-026** (no inbound line cites, so inserting lines here is safe).
- **A. New header bullet**, after the `- **Evidence:**` bullet:
```
- **Corrections:** 2026-10-14 (`0496`) — this ADR carries **one** dated note, at the end of
  **§Context → "The real defect R2 exposed was not hand-rolling"**. Marker legend: **⚠️ = a fact that
  drifted** (the decision is untouched); **⛔ = a decision that was overturned** (do not follow it). No
  existing line of this ADR was edited; the note is an append, and the Status stays `accepted`.
```
- **B. Inline note**, after the paragraph ending "no library would have fixed it." and before `## Decision`. This is the architect's corrected text. The draft wrongly said "not in `npm test`" was true on the ADR's date. In fact `0ad055a` (2026-07-18), which put prove-red into `npm test`, came before the ADR's own commit `f50a821`. I verified that with `git show f50a821:package.json`.
```
> ⚠️ **Dated note 2026-10-14 (`0496`) — the "nothing runs `prove-red.sh`" facts in this ADR no longer
> hold; the decision is untouched.** `npm test` runs it: `package.json`'s `"test"` script is
> `node --test test/*.test.js && bash test/prove-red.sh`, since `0ad055a` (2026-07-18) — a commit made
> a few hours before this ADR's own (`f50a821`, 2026-07-19), so the two "not in `npm test`" statements
> were already out of date when this ADR was committed. `.github/workflows/test.yml` (since `df55b50`,
> 2026-08-12) runs `npm test` on every push to `main` and every pull request. Decision 4's automated
> gate is therefore in place, and these statements no longer describe the tree: §Context *"is **not in
> `npm test`**"* and *"no `.github/workflows/` in the tree at all"*; §Consequences *"Today
> `prove-red.sh` still runs only when a human types it"* and the re-raise bullet's *"already approved
> and awaiting its brief"*; §Related *"No `.github/workflows/` exists today"* and *"does **not** include
> `prove-red.sh`"*.
```
- The note is wider than the brief's three workflow statements. The architect ruled that the two "not in npm test" statements and "awaiting its brief" are the same drifted fact.

**8. (h) ADR-019.**
- **A. New lines after the existing `Corrections:` bullet**, after line 18. Line 18 itself is not edited.
```
  ⚠️ 2026-10-14 (`0496`) — this ADR now carries **two** dated notes: the `0473` pointer note above,
  plus a cite correction inside **§Decision item 4** (after its last line). The text above is left
  byte-identical and its count (**one**) is superseded by this line; the same append-only rule and the
  same legend apply.
```
- **B. Inside item 4**, after "…so it is auditable." and before `5.`, with a 3-space indent:
```
   > ⚠️ **Dated note 2026-10-14 (`0496`) — the `fkit-coder.md:109-113` cite above no longer points at
   > the rule; item 4 is unchanged.** The architecture half is the paragraph that opens *"But: a
   > genuinely NEW architecture decision goes to the OWNER."* in `claude/agents/fkit-coder.md`, under
   > **§Consulting a teammate**; the scope half is under **§What you must not do**: *"Make product or
   > scope decisions that belong to the producer / owner — surface them instead."* Find both by quote;
   > line numbers in that file move with every edit.
```
- The scope half was verified at `fkit-coder.md:268`.
- Inserting these lines shifts the other files' `ADR-019 :NNN` cites. **Every one of them is already stale today** (checked: `:96`, `:97`, `:138`, `:148-150`), so no correct cite breaks.

**9. (i) ADR-052 D8 item 3 and brief 0436.**
- Add a sub-bullet **after item 3's second line** ("Fixed in the old format first, then re-run."), with a 3-space indent. It follows the file's own 0472 "⏱ Correction" form. No header line is added (architect ruling).
```
   - ⏱ **Correction, 2026-10-14 (`0496`) — on task 0472's owner ruling R7 (2026-10-02); item 3 above is
     unchanged.** The `0014` example no longer fits "brief says Backlog, folder says done": `0014`'s
     `## Status` now reads `✅ Done`. It still has no board row, so on fkit's tree `0014` now belongs to
     the **no board row** class, like `0004`. The converter's rule is unchanged.
```
- Brief **0436**: verdict **already correct**. Its 2026-10-02 note already says this ("`0014` now falls under the **no board row** class"). No edit.
- R7 was verified in 0472's plan.

**10. Refresh the dogfooded copies.**
- Run `claude/fkit-claude-init.sh .` so `.claude/skills/fkit-sprint-ship-loop/SKILL.md` matches the canonical file.
- Then compare `git status --porcelain` and the hash of every changed file with the baseline. ⚠️ If init changes any **tracked** file (for example, it rewrites the rules block in `CLAUDE.md` or `AGENTS.md` after 0506's cuts): do not revert it and do not keep it silently. Return `NEEDS-DECISION`.
- Note: the lead is running this same skill right now. The refreshed copy differs only in cites.

**11. No CHANGELOG entry.** Users would notice nothing: these are cite and note fixes only.

## Verify
- **Checks, from CONTRIBUTING's "What to run for a change" table:**
  - `RELEASING.md` → nothing automated. Check by eye.
  - Briefs and ADRs → `test:docs`.
  - `fkit-claude-init.sh` (a non-`.md` file under `claude/`), `test/orphan-cleanup.test.js` (under `test/`), and `fkit-sprint-ship-loop/SKILL.md` (named in prove-red; confirm with `grep -F 'skills/fkit-sprint-ship-loop/SKILL.md' test/prove-red.sh`) → **`npm test`**.
  - The heaviest row wins, so run **full `npm test`** (unit tests plus prove-red). It covers `test:docs`, `reference-integrity`, `coordination-citation-policy` and `adr-number-uniqueness`.
  - **Skipped: none.**
  - Report the pass count, or report any failure plainly with its output.
- **Diff checks against the baseline:**
  - The files that changed are exactly the 9 named above, plus the task folder. That is `fkit-sprint-ship-loop/SKILL.md`, `fkit-claude-init.sh`, `orphan-cleanup.test.js`, `RELEASING.md`, ADR-019, ADR-026, ADR-052, and briefs 0328, 0382 and 0403.
  - `git diff --numstat` shows **0 removed lines** for ADR-019, ADR-026 and ADR-052.
  - The Backlog board has no new change of ours, and neither do briefs 0284 and 0436.
- **Per fixed cite:** open the target and confirm the cited lines or quoted fragment are the thing the sentence describes. Record it in the worklog.
- **Every worklog verdict line is present.** Items a–i give 4 + 1 + 1 + 5 (d: 3 fixed, 2 already correct) + 14 + 1 + 1 + 1 + 2 = **30 lines**.

## Risks and edge cases
- **Line numbers move again soon.** 0507 and 0508 (comment cleanups in `skills-for-role.sh` and the launcher) will move every launcher line. They may also delete the checklist block that 0403 cites. That is why every fix carries a name or fragment. A later "target gone" for 0403 belongs to those tasks.
- **Process-review skill drift.** If 0506 or any other uncommitted change shifted `fkit-process-stateful-review/SKILL.md` lines, step 1 re-measures. It is not in `git status` today.
- **Markdown nesting.** A misplaced indent in the ADR-019 or ADR-052 notes would break the numbered list. Check the rendered nesting by eye.

## Out of scope — found while planning, not fixed
1. The same Process-review row's `ADR-019 :96` is stale. It means *"Every autonomous choice … is recorded in the task's worklog decision-log"*, which is at ADR-019 lines 115–116 today.
2. More stale `ADR-019` line cites elsewhere:
   - `fkit-coder.md` (`:96`)
   - ADR-025 (`adr-019:97`)
   - ADR-032 (`:96`, `:148-150`)
   - two reports (`adr-019:138`, `:96`)
3. `claude/skills/fkit-task-ship-loop/SKILL.md` cites `fkit-coder.md:165`. That is 0472's fix from 2026-10-05, and it is already stale: the rule is now at `:212`.
4. **Brief 0284 looks partly obsolete.** Its folded-in "defect 2" (the env vars never reach the `sh`) appears **fixed by 0481**: `_fkit_reinstall` now downloads first, then runs `… | FKIT_REPO=… FKIT_REF=… sh`. Its What to build also carries about 15 short-form launcher cites. That needs a producer re-scope, not a renumbering.
5. The Backlog board has other `CLAUDE.md:NNN` cites on closed rows. They are closed history.
6. ADR-052 has no `Corrections:` header index, unlike ADR-017, ADR-019 and ADR-031 (an architect note).
7. From the architect, for information only: ADR-026 does not record which task wired prove-red into `npm test` in `0ad055a`. Tracing that would be a separate task.

After close: `fkit-wiki` may need a re-sync for its ADR-019, ADR-026 and ADR-052 pages.

## Open questions

**OQ1 — The new code-comment rule vs. this brief's "no rewording", in (b) and (c).**
- Context: `code-comments.md` (ruled 2026-10-10, after this brief was filed on 2026-10-05) says a comment in code you edit must follow the rule: 1–2 lines, WHY only, no history. The (c) comment is about 20 lines of history, and the (b) comment is 4 lines. The brief says: fix the cite only, no rewording. Backlog tasks 0508 (launcher and init) and 0515 (orphan-cleanup and other tests) exist to clean up exactly these files' comments.
- Options:
  1. **(Rec)** Fix only the pointer, using a name instead of a line number, which meets the rule's "point by name, never by line number". Leave the rest of each comment to 0508 and 0515.
  2. Rewrite both comments to the new rule now. This goes beyond the brief and overlaps 0508 and 0515.
  3. Delete the parenthetical pointer outright instead of renaming it.

**OQ2 — Item (e): sweep only the full-form `claude/fkit-claude.sh:NNN` cites, or also the short-form `:NNN` launcher cites?**
- Context: the brief's re-grep names the full form, and that finds 14 cites. Short-form launcher cites (`:387-392` etc.) sit in 0328 (about 4) and in 0284's What to build (about 15). 0284's What to build is partly obsolete since 0481 (§Out of scope, item 4), so renumbering it would polish text that needs a re-scope.
- Options:
  1. **(Rec)** Full-form only, as in the brief. Record the short-form ones in the worklog as found and not fixed.
  2. Also fix the short-form pointer cites in 0328 only (about 2 live pointers, in Verification). 0284 is left.
  3. Fix every short-form launcher cite in all four briefs, including 0284.
- Knock-on for each: none (checked). No sprint placement and no `Depends on:` change.

**OQ3 — The extra stale items in §Out of scope (1–4).**
- Options:
  1. **(Rec)** Record them in the worklog, and have the producer file **one small follow-up tidy task on the Backlog board** covering items 1–3, plus a producer re-check of 0284 (item 4). Knock-on: none (checked). The new task depends on nothing, nothing waits on it, and 0394 is related, not a dependency.
  2. Record them in the worklog only, and file nothing.
  3. Widen 0496 to fix items 1–3 now. Knock-on: 0484 (P23, set to run after 0496 in Sprint 10) waits longer. No `Depends on:` link changes. ADR edits stay additions-only and would need another architect check.
