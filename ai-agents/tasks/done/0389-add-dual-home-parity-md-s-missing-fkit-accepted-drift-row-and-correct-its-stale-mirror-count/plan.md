**Task 0389: add the missing `.fkit-accepted-drift` mirror row and correct the stale mirror count**

**Write surface:** `ai-agents/knowledge-base/conventions/dual-home-parity.md` only, plus this task folder's records. The page exists only in the live tree (`fkit-repo-only`). There is no scaffold copy to update, and adding one would be a regression. It is not in the structure manifest, so no `generate:manifest`.

**Step 0: baseline (before editing)**
1. Save `git status --porcelain` to the scratchpad. The tree already has uncommitted changes from 0388/0390/0392 and briefs 0395/0396, so step 5's "nothing else changed" check compares against this snapshot, not against an empty diff.
2. Re-measure the module: total, files, directories. Use the measured numbers, not 28/18/10 from this plan, in case the module has changed since.
3. Re-run the row check (scratchpad script, not a repo file) and confirm the only miss is still `.fkit-accepted-drift`.
4. Record baselines for the three suites. Today: 9/9, 22/22 with 0 broken, 21/21.

**Step 1: add the row.**
- Insert it directly **after** the `knowledge-base/architecture.md` row. That is the page's other `live-only` row, and the module keeps the two next to each other.
- This is an insert, not a re-order. No other row is touched.
- Draft, a condensed form of the module's `reason`:
  ```
  | `.fkit-accepted-drift` | **live-only** — this project's launch-notice intent file (task 0247); a shipped copy would pre-mute launch notices in every consuming project, and the live copy exists only because this repo dogfoods fkit | ⛔ never sync |
  ```
- No link and no `path:NNN` citation. The module stays the authority for the full reason.

**Step 2: correct the completeness sentence.** Change `26` to the measured total and `16 file entries` to the measured file count. Leave `10 directory entries` alone if the re-measure still gives 10.
- ⛔ **[DECISION Q1]:** the date `as of 2026-08-01`. Rec: change it to the edit date. Alt B: leave it. Alt C: remove it.

**Step 3: optional, only if the owner widens scope**
- ⛔ **[DECISION Q2]:** stale comments at `test/dual-home-parity.test.js:141` (26/732, now 28/749) and `test/dual-home-parity-exceptions.mjs:199` ("13 real files", now 16 under `claude/scaffold/ai-agents/`). Rec: do not touch them; the producer files a follow-up if wanted.
- ⛔ **[DECISION Q3]:** a guard test. Rec: none in this task.

**Step 4: verify**
1. The page's total, file and directory counts equal the module's, re-derived by import and trailing-`/` split.
2. Every module `path` appears in the table's first column, with braces expanded. **Zero misses.**
3. `node --test test/dual-home-parity.test.js` gives the baseline result (9/9 today).
4. `node --test test/reference-integrity.test.js` reports 0 broken and an unchanged named-exempt count. No `NAMED_EXEMPT` entry is added.
5. `node --test test/coordination-citation-policy.test.js` gives the baseline result (21/21 today).
6. `git status --porcelain` compared with the step 0 snapshot shows changes only to `dual-home-parity.md` and this task folder's records, plus the `test/` files if Q2 is B or C.
7. Optional: the full `npm test` for completeness. Report its result as it comes, not as a claim of zero regressions, since uncommitted work from other tasks is present.

**Edge cases and risks**
- **The module changes before pickup.** Steps 0.2 and 0.3 re-measure. If a new entry also lacks a row, report it; do not add the row silently, because that is outside the approved plan.
- **Brace groups hide paths.** A plain grep for each path would falsely flag entries inside groups like `knowledge-base/{decisions,…}/`. The check must expand braces (the dry run already does).
- **The table has an index row with no parity symbol** (`conventions/README.md`). Match on the first column only, not on the Parity column.
- **Two things could be wrongly counted as rows:** the leading-dot path `.fkit/` (a directory entry) and the page's own row for `dual-home-parity.md`. Both are real module entries and both are already on the page.
- **The `.fkit-keep-out` name in the module's reason.** It is not a parity exception, so the gloss should not mention it, or a reader could look for it in the table.

**Out of scope, per the brief:** the exceptions module, anything under `test/` (unless Q2 says otherwise), new tests, other rows, the wiki vault, devDependencies, board ranks.

## Owner rulings (2026-09-14, via `AskUserQuestion` in the `fkit lead` session — verbatim option labels)

- **Q1:** "Update date to edit day (Rec)" → option A: the completeness sentence's date becomes the edit date, alongside the two count corrections.
- **Q2:** "Keep fence, no edit (Rec)" → option A: both stale `test/` comments are left untouched; no follow-up brief is filed.
- **Q3:** "No test in 0389 (Rec)" → option A: no guard test; nothing filed.
- **Plan approval:** "Approve (Rec)".
- **Driver note (orchestrated path):** under `fkit-sprint-ship-loop` the Build step ends at Step 4; the driver's separate Verify / Review / Process-review steps follow. No commit by any step.
