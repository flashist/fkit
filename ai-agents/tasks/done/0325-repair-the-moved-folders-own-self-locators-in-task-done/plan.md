# Plan — 0325: Repair the moved folder's own self-locators in `/fkit-task-done`

> Approved by the owner via `AskUserQuestion` in a live `fkit lead` session driving `/fkit-sprint-ship-loop`, 2026-08-26. Written by the driver at approval, before the Build spawn (ADR-020). Rulings on Q1–Q3 are appended at the end.

## 1. Plan

### Files touched
- `claude/skills/fkit-task-done/SKILL.md` — the only edit. Regions, by current line: step 4 bullet `ai-agents/tasks/` (line 116–118), step 5 after the sibling-outbound bullet (insert after line 187, before `Make the **minimal** edit` at 189), step 5 "Then prove it." (line 228–229), step 7 after "Re-pointed links" (after line 254).
- No edit to `claude/skills/fkit-task-cancelled/SKILL.md`, `fkit-task-ship-loop`, `fkit-sprint-ship-loop`, any test, the manifest, or the vault.
- `worklog.md` records: the no-test decision explicitly, the two unowned stale locators (`0248` `plan.md:12`, `0218` `worklog.md:8`), the `cancelled/` measurement, and the follow-ups.

### Steps
1. **Re-verify coordinates before editing** (they are a snapshot): `grep -n "OWN outbound links\|Then prove it\|Re-pointed links\|ai-agents/tasks/\*\* itself" claude/skills/fkit-task-done/SKILL.md`; re-read step 5 end to end.
2. **Step 4, one clause.** In the bullet `**ai-agents/tasks/** itself — …` append: *"— **including the moved folder's own record files**, which point at themselves; step 5 rules that self case."* Reason: the folder-name grep already returns these hits; the reader must know they are expected, not noise.
3. **Step 5, the new bullet** — inserted directly after the sibling-outbound bullet's closing sentence (*"Fixing only the inbound half leaves the move half-done."*), so the two "OWN" cases sit together. Proposed text:

```
- **The moved folder's OWN self-locators** — the folder pointing at *itself*, the case the bullet
  above does not reach (a self-locator is not a sibling link). Its `plan.md`, `review.md` and
  `worklog.md` open with header lines whose only job is to say where this task's own files are —
  `Task: ai-agents/tasks/backlog/<NNNN>-<slug>/brief.md` (the review ledger's schema line),
  `Brief: …/brief.md`, `**Task:** …`, `**Plan:** …/<NNNN>-<slug>/plan.md`, `- **Task file:** …`, and
  the like. Every one of them went stale the moment step 3 ran. **Re-point the board segment of the
  path to the folder's new home (`tasks/backlog/` → `tasks/done/`, or from whichever board it left),
  and change nothing else on the line** — same key, same wrapping (backticks, bold, list marker),
  same absolute-or-relative form, same file named, line count unchanged. A locator that already
  names `done/` is left byte-identical (the re-run and owner-upgrade paths must be no-ops here). A
  locator written as a relative href (`[…](./brief.md)`) needs nothing — the target moved with the
  folder; its label is not this skill's to rewrite.

  **What a self-locator IS — decide by role, never by string.** It is a *pointer*: a named field in
  the file's header block (above the first `## ` heading), whose value is a path to a file inside
  this same folder, and which asserts nothing. That is the whole test. The same old path also
  appears inside this folder as *evidence*, and evidence is a claim: **a historical record's
  *claims* are frozen; its *links* are not.**

  ⛔ **Never rewrite the old path where it is evidence.** Not in a fenced block or captured command
  output — a `git status` that printed `backlog/` that day really printed it, and editing it forges
  a transcript. Not in a dated measurement or a quoted specimen. Not in a plan step, a findings row,
  a change-surface table, or body prose recording what was done or seen at the time. Not in any
  mention of **another** task's path, which may name `backlog/` correctly today.
  ⛔ **This is not "replace `backlog/` with `done/` inside the folder."** No search-and-replace, no
  added `backlog/`-string sweep. Step 4's folder-name grep already surfaces every literal self-hit —
  classify each as *locator → repaired* or *evidence → left frozen*, and report both lists (step 7).
  An elided self-path (`0250-.../worklog.md`) is not returned by that grep and is not a locator; it
  stays frozen because of what it is, not because a search missed it.

  **The worked example — `0250`'s folder as it stood at close, six occurrences, 2 repair / 4 freeze:**

  | Site | Reads (fragment) | Treatment |
  |---|---|---|
  | `plan.md` `Brief:` line (`:5`) | `Brief: /…/ai-agents/tasks/backlog/0250-…/brief.md` | **repair** — a header pointer to its own brief |
  | `review.md` `Task:` line (`:3`) | `Task: ai-agents/tasks/backlog/0250-…/brief.md` | **repair** — the ledger's forwarding address |
  | `plan.md` fenced block (`:117`) | ` M ai-agents/tasks/backlog/0250-.../brief.md` | **freeze** — captured `git status --porcelain` output |
  | `plan.md` step 7 (`:188`) | *"Write the task worklog (`…/backlog/0250-.../worklog.md`)"* | **freeze** — the plan's instruction, as written at plan time |
  | `review.md` (`:86`) | *"`0324`: still under `ai-agents/tasks/backlog/`, holding only `brief.md`"* | **freeze** — a dated measurement, about another task |
  | `review.md` (`:98`) | *"`0324`'s own folder was still under `ai-agents/tasks/backlog/` at measurement 2"* | **freeze** — same |

  Rows 3–4 name the moved folder in elided form; rows 5–6 name `backlog/` *correctly*, about `0324`.
  A string rule corrupts rows 5–6 and misses rows 3–4 only by luck. The role rule gets all six.
```

4. **Step 5 "Then prove it."** — append one sentence: *"Every self-locator you re-pointed must name a file that now exists — most are code spans, not markdown links, so the link check above does not reach them; test the path."*
5. **Step 7** — new bullet directly after "Re-pointed links":

```
- **Self-locators repaired, and self-hits left frozen:** every header locator in the moved folder's
  own `plan.md` / `review.md` / `worklog.md` you re-pointed (e.g. "`done/<NNNN>-<slug>/review.md:3` —
  `Task:` path → `tasks/done/`; rest of line untouched"), and, separately, every other self-hit from
  step 4 you classified as evidence and left byte-identical, with the reason in a phrase (captured
  output / dated measurement / plan text / another task's path). If there were none of either, say
  so. The freeze calls are judgments, and this list is the only place they can be checked.
```
   Decision on brief item 6: **yes, report them** — the freeze decisions are otherwise invisible.

6. **Verify** (maps to the brief's six): (1) read amended step 5 end to end; (2) walk the rule against `0250` pre-repair — must select exactly `plan.md:5` + `review.md:3`, reject `plan.md:117`, `:188`, `review.md:86`, `:98`; also walk it against `0327` — must repair `plan.md:5`/`review.md:3` and freeze the change-surface table rows at `review.md:401–402`; (3) freeze cases are ⛔ bullets in the rule body, not a footnote; (4) manifest: not tracked (0 `skills/` rows) — no regen; (5) `npm test` — expect 774 pass / 24 suites / prove-red PASSED, unchanged if no test is added; (6) `git diff --numstat` = one file; `git diff -U0` shows four hunks in steps 4, 5, 5-prove, 7 and nothing in step 1.
7. **Refresh the dogfood copy**: `claude/fkit-claude-init.sh .` (or note it refreshes on next `fkit` launch). Not committed.

### Tests
- **Recommendation: no new test**, stated in the worklog. Skill bodies are prose; `skill-frontmatter.test.js` says so in its own header. The property that matters (2 repaired / 4 frozen) is not mechanically checkable.
- **If the owner wants the weak guard:** `test/mover-self-locator-rule.test.js` — asserts presence of two anchor phrases (`The moved folder's OWN self-locators`, `Never rewrite the old path where it is evidence`) + a `prove-red.sh` mutation section. ≈70 lines; deletion guard only.
- **Corpus test** (no `done/*/` record carries a stale self-locator): red on day one (46 instances), blocked on `0168` — follow-up.

## 2. Edge cases / failure modes
1. **Absolute machine paths** (`Brief: /Users/…/backlog/…`): repair the board segment only; form conversion is `0326`'s.
2. **Elided self-paths** (`0250-.../`): not returned by the grep; correct by role; no `backlog/` string sweep.
3. **Another task's path inside the folder**: hrefs → sibling-outbound bullet; code-span measurements freeze.
4. **Locators to own `plan.md`/`review.md`/`worklog.md`** (`0218` `worklog.md:8`): covered.
5. **Href form** `[label](./brief.md)`: target durable; stale label is `0168` Gap B — leave, report.
6. **Ledger variant** `Task: 0160 — <path>`: re-point the path, keep the ID.
7. **`File(s) under review:` lines** naming own files under `backlog/`: claim → freeze by default (Q2).
8. **Body-prose forwarding pointers** (`0218` `worklog.md:212`): outside header → freeze + report by default (Q2).
9. **Idempotency**: locators already naming `done/` are no-ops.
10. **Moved from a board other than `backlog/`**: "from whichever board it left".
11. **Wrapped header values**: none observed; grep keys on folder name regardless.
12. **Skill line numbers in the worked example**: paired with quoted fragments; `0250` is closed history.

## 3. How each caveat / ruling is honored
- **Ruling "Re-point them, add rule to task-done"**: option 1 exactly; nothing else.
- **Locator ≠ claim, role not string**: defined by role; search-and-replace and `backlog/` sweep forbidden by ⛔.
- **Freeze cases as hard prohibitions in step 5's register**: two ⛔ paragraphs in the bullet.
- **`0250`'s six occurrences, 2/4 split, both traps**: the table.
- **Covers all three records**: named.
- **No existing step-5 bullet changes meaning**: pure insertion; `git diff -U0`.
- **Step 7 decision stated**: reported, with reason.
- **Out of scope respected**: no remediation of the 46 (`0168`'s); `0248`/`0218` flagged not fixed; no `fkit-task-cancelled` edit (Q3); no step 1 edit (`0229`/`0135`/`0134` own it); no vault write.
- **Manifest**: not tracked — no regen.
- **Option 2 (durable form)**: already `0326`.
- **ADR-033/032/014**: text edit not invocation; task-ship-loop untouched; no scope widening unless Q1 picks the guard.
- **Residuals carried**: `0168`'s board `depends="0160 — hard."` stale (`0160` done); `0248`/`0218` unowned; counts are floors.

## 4. Owner rulings — `AskUserQuestion`, live `fkit lead` session, 2026-08-26 (verbatim option labels)
- **Plan gate:** "Approve".
- **Q1 (test):** "No test (Recommended)" — record the decision in the worklog; name the corpus test as a follow-up gated on `0168`.
- **Q2 (reach):** "Header block only (Recommended)" — a self-locator is a named field above the first `## ` heading; body-prose forwarding pointers and `File(s) under review:` self-entries are frozen and listed in the report.
- **Q3 (task-cancelled mirror):** "Follow-up brief (Recommended)" — this task edits `fkit-task-done` only; the mirror is a producer-filed follow-up.
