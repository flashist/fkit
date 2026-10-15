# Plan — 0484: check the links in fkit's top-level docs, not only under `ai-agents/`

Planning only. I wrote and edited no files. EnterPlanMode is not available to a spawned coder, so I followed the written planning-only rule instead.

## 1. Summary
- **What it adds:** a new sibling test, `test/top-level-doc-links.test.js`. It applies the link rule of `reference-integrity` to an explicit list of top-level docs.
- **What stays the same:** `reference-integrity`'s own scanned set (`collectFiles`, L1–L8, and L7 in particular) is not touched.
- **How the two tests share code:** the pure §4.1 pieces move, unchanged byte for byte, from `test/reference-integrity.test.js` into a new non-test module, `test/link-condition.mjs`, and both test files import them. This avoids the reuse trap: importing a `.test.js` file would run its 22 tests a second time.
- **Measured today** (live tree, 2026-10-14, using the guard's own exported masking, match and resolution functions):
  - The six named targets have 35 relative links and **0 broken**: README 9, CONTRIBUTING 7, RELEASING 2, CHANGELOG 7, claude/README 7, docs/board.md 3.
  - Adding `CLAUDE.md` (10) and `AGENTS.md` (6) gives 51 links, also **0 broken**.
  - So the check starts green.
- **Baseline before the change:** `node --test test/reference-integrity.test.js` gives 22 pass in about 0.5 s.

## 2. Design choice and why (the brief leaves it to the plan)
**Picked:** a sibling test plus a shared module. I rejected two alternatives:
- **Put new arms inside `reference-integrity.test.js` (no code move).** Rejected. All four mover skills (for example `claude/skills/fkit-task-done/SKILL.md`, in its "check the exemption keys" step) tell a producer to run that file. They also state that *"the guard scans nothing else"* than `ai-agents/`. Adding root-doc arms would make that text false and give movers a red that the clause does not route. Fixing it would mean editing four mover SKILL.md files that prove-red names, plus `test/mover-exemption-step.test.js`, which pins that text. That is scope creep.
- **Widen `collectFiles`.** Rejected. It changes the transcribed condition and breaks L7 and the scanned-count floors (the brief's own constraint).
- **Copy the regexes or the match loop into the new file.** Rejected. The spec says "⛔ Do not paraphrase these into a fresh regex", and the match loop carries the skip, fragment, decode and root-absolute decisions.

**No change to the spec report** (`2026-08-29-the-reference-integrity-condition.md`). The condition and the guard's scanned set are unchanged. The move is recorded in the guard's header as a fourth structural adaptation, S4, as the brief asks.

## 3. Steps

### Step 1 — new module `test/link-condition.mjs`
- **Moved from `test/reference-integrity.test.js`, unchanged byte for byte** (bodies and their existing comments, so `git diff --color-moved` shows a pure move):
  - `walk`
  - `blank`
  - `maskFencesAndQuotes`
  - `maskCodeSpans`
  - `maskDocument`
  - `LINK`, `SKIP_SCHEME`, `ELIDED`
  - `entriesOf`
  - `resolveExact`
  - `formatBroken`
- **Exports:** `maskDocument` and `formatBroken` become exported. Today they are module-private.
- **New `scanFiles(root, files, namedExempt)`:** today's `scan` loop body lifted as is. The one text change: `NAMED_EXEMPT.has(...)` becomes `namedExempt.has(...)`. It returns the same shape as today: `{ broken, namedExemptCount, scanned, visited, checked, skipped }`.
- **Header:** 1–2 lines per `code-comments.md`. They say this is the shared §4.1 link rule, and that its record (spec, D1–D3, S1–S4, blind spots) lives in `test/reference-integrity.test.js`'s header.

### Step 2 — `test/reference-integrity.test.js` (minimal edit)
- **Imports** the moved names from `./link-condition.mjs`.
- **No re-export.** A grep finds no file that imports this test file; `mover-exemption-step` only checks that it exists.
- **Stays here:** `exempt`, `collectFiles`, `NAMED_EXEMPT`, `staleExemptions`, the fixtures and all 22 tests.
- **`scan(root)` becomes** `return scanFiles(root, collectFiles(root), NAMED_EXEMPT);` with an identical return shape.
- **Header and comments the change makes wrong get fixed in the same edit:**
  - Add S4 (2 lines): the pure pieces live in `test/link-condition.mjs` so `test/top-level-doc-links.test.js` can share them, because importing this file would run its tests twice.
  - D3's "THE MATCH LOOP IS NOT BYTE-IDENTICAL" paragraph also names the `namedExempt` parameter.
  - C7's "hand-duplicated into FOUR places — §4.1, §4.2, this file, …" is changed to name `test/link-condition.mjs`.
- **C7 still works:** it uses `maskFencesAndQuotes.toString()`, which returns the same source text for an imported function.
- **`test/coordination-citation-policy.test.js` is left alone.** Its comments say C7 lives in `reference-integrity.test.js` and compares against "its own copy", which stays true. I re-check this by grep at build time.

### Step 3 — new `test/top-level-doc-links.test.js`
- **Header:** 1–2 lines. It is a repo-content guard, the fourth test-scope category; it points at `test/task-id-uniqueness.test.js`'s header by name, which is where that category is recorded today (0512 may re-home it). It also points to the shared rule module.
- **What it scans:**
  - `NAMED = ['README.md', 'CONTRIBUTING.md', 'RELEASING.md', 'CHANGELOG.md', 'claude/README.md']`, plus `CLAUDE.md` and `AGENTS.md` if OQ1 = include.
  - Plus every `.md` under `docs/`, found with the shared `walk`. It walks only if `docs/` exists, so 0467 removing `docs/board.md` does not crash the test.
  - `claude/README.md` is listed by name; `claude/` is never walked.
- **Missing files are a failure, not a skip:**
  - `missingNamed(root)` returns each named file that does not resolve case-exact (`resolveExact`).
  - The live scan reads only the files that are present, so a deleted file gives a clear red instead of an ENOENT crash at load.
- **No named exemptions:** `scanFiles(root, files, new Set())`. A front-door doc's link is a pointer offered to a reader, so a red is fixed at the link. Adding an exemption later would be a new decision.
- **Live arms:**
  - **T1 — scope:** `missingNamed(REPO)` is `[]`. The message names each missing or renamed file.
  - **T2 — scope:** the visited set contains every named file, and **no** path under `ai-agents/`. That covers the wiki vault and leaves `ai-agents/` to `reference-integrity`.
  - **T3 — broken links:** `broken` is `[]`. The message comes from `formatBroken` (file, line text, unresolved target) plus "repair the link; this check has no exemption list".
  - **T4 — disclosure:** a `t.diagnostic` line with files scanned, links checked and skips by class. It also has an anti-vacuity floor, `checked >= 20` (today 35, or 51).
- **Fixture arms** (`os.tmpdir()` only; a small local `fixture()` with exit cleanup, the guard's pattern; nothing written into the repo):
  - **M1:** a broken link in `README.md` reds, naming `README.md` and the target. The fixed copy is green. The clean control runs first.
  - **M2:** a broken link in `claude/README.md` reds and resolves relative to `claude/`. The fixed copy is green.
  - **M3:** with a named file missing from the fixture, `missingNamed` reports it.
  - **M4:** broken links in fixture `ai-agents/wiki-vault/x.md`, `ai-agents/y.md` and `test/z.md` are never visited and give no red.
  - **M5:** `docs/sub/deep.md` is collected (the walk is recursive) and its broken link reds.

### Step 4 — `package.json`
Add `test/top-level-doc-links.test.js` to the `test:docs` script. `npm test` and `test:unit` already pick it up through `test/*.test.js`.

### Step 5 — `CONTRIBUTING.md` "### What to run for a change"
- **Split row 1:**
  - **New row 1:** `LICENSE` and `ai-agents/wiki-vault/` (except `schema.md`) → **nothing**. Why: no test reads their contents; in the vault, `dual-home-parity` only checks which files sit outside `wiki/`. That cell's wording is kept.
  - **New row 2, placed above the `ai-agents/` row:** `README.md`, `CONTRIBUTING.md`, `RELEASING.md`, `CHANGELOG.md`, `docs/`, `claude/README.md` → `npm run test:docs` (~30 s). Fast path: `node --test test/top-level-doc-links.test.js` (about 1 s). Why: `top-level-doc-links` checks their relative links with `reference-integrity`'s rule, and `reference-integrity` scans `ai-agents/` only.
- **If OQ1 = include:** the `CLAUDE.md`/`AGENTS.md` row (`npm run test:unit`, which already runs every `test/*.test.js`) gets its Why cell extended to say `top-level-doc-links` checks their links. No row move.
- **The bullet** "A new test that reads the live `ai-agents/` tree must also be added to `test:docs`" becomes "…the live `ai-agents/` tree or the top-level docs…".
- **Final check:** no row still says these files are unchecked.

### Step 6 — no `CHANGELOG.md` line
This is an internal repo test that fkit users will not notice (CONTRIBUTING's rule). I will say so in the report rather than skip it silently.

## 4. Edge cases and failure modes
- **The refactor could change what the guard decides.** Control: capture the guard's L8 diagnostic line (`scanned N files, resolved M link targets, 0 broken, 7 named-exempt`, plus the skip counts) before the edit, and require the same figures and the same 22 pass after.
- **C7 parity:** it now compares the module's copy with `coordination-citation-policy`'s copy. It must stay green with no edit to either body.
- **Case-insensitive macOS:** existence and resolution go through `resolveExact` (D2), so `readme.md` does not pass for `README.md`.
- **0467 (Backlog) will delete `docs/board.md`:**
  - `README.md` and `CONTRIBUTING.md` link to it, so this check will red until 0467 also removes those pointers. That is intended; the wiki note on 0467 already says it must.
  - No floor is set on `docs/`, so an empty or missing `docs/` is not a red.
  - Knock-on for 0467: its own build must keep this check green.
- **The 0512 comment cleanup (Backlog) covers `reference-integrity.test.js`.** After this change it should also cover `test/link-condition.mjs`, and its brief's file list does not name it. I will flag this in the report; I will not edit 0512 (it is the producer's).
- **The rule this check reuses has known gaps** (measured here with a rough grep):
  - Image links `![..](..)` are skipped by `LINK`'s `(?<!!)`.
  - Nested-bracket badge labels are blind spot 4.
  - Blockquote lines are blind spot 1, reference-style definitions blind spot 3, anchors blind spot 2.
  - **Cost today: 3 relative targets go unchecked**, all in README: `docs/media/fkit-teaser.gif` and the `VERSION` and `LICENSE` badge targets. All 3 resolve today.
  - There are 0 blockquoted links and 0 reference definitions in these files. See OQ2.
- **Symlinks** (blind spot 8): there are no symlinks among these files.

## 5. Files
- **New:** `test/link-condition.mjs`, `test/top-level-doc-links.test.js`
- **Edited:**
  - `test/reference-integrity.test.js`: code moved out, imports, `scan` delegates, S4 and the D3/C7 comment fixes.
  - `package.json`: `test:docs`.
  - `CONTRIBUTING.md`: the table and one bullet.
- **Not touched:**
  - the spec report
  - `ai-agents/wiki-vault/`
  - the mover skills
  - `test/coordination-citation-policy.test.js` (re-checked by grep)
  - `test/prove-red.sh`: no entry, per the guard's in-file precedent named in the brief.

## 6. Verify — checks this change needs
**Mapped with CONTRIBUTING.md's table.** The changed paths are `test/*` (a new `.mjs`, a new and an edited `.test.js`), `package.json` and `CONTRIBUTING.md`. "Anything under `test/`" and "`package.json`" put the change in the heaviest row, so the required check is **`npm test`** (about 12 min, including prove-red). The table's spanning rule: run the heaviest row touched. Nothing is skipped.

1. **Guard unchanged:** `node --test test/reference-integrity.test.js` before and after. 22 pass both times (L7 included), and the L8 figures are identical. State them.
2. **New check on the live tree:** `node --test test/top-level-doc-links.test.js` is green. State files scanned and links checked (expected 6 or 8 files, and 35 or 51 links). Time it: it must be under 1 s.
3. **Scratch copy** (`rsync -a --exclude .git` of the repo to the scratchpad; `REPO` comes from `harness.mjs`'s location, so the copy scans itself):
   - Break one link in `README.md` and one in `claude/README.md`, then run the new test there: it reds naming both files and targets.
   - Revert: green.
   - Nothing in the real repo is touched.
4. **Fixture arms:** M1, M2 and M5 red with the broken copy and go green with the fixed one inside the same test. To show they can red, temporarily stub the `resolveExact` call in the scratch copy only, and state which arms went red.
5. **`npm run test:docs`:** it runs the new file. Time it and state it.
6. **CONTRIBUTING row:** a grep shows no row still says "no automated check covers" these files.
7. **`npm test` green:** state the unit pass count and prove-red's final line.
8. **No stray writes:** take a `git status --porcelain` snapshot before and after the test runs. Expected: no new or changed file other than the five planned, nothing under `ai-agents/wiki-vault/`, and nothing written by a test. The tree already holds unrelated uncommitted 0496/0501/0506 work and Backlog briefs 0507–0516, so the snapshot is the baseline, not a clean tree.

## 7. Open questions for the owner

**OQ1 — Also check `CLAUDE.md` and `AGENTS.md`?** (brief item 6)
- **Context:** your ruling named six targets. These two root files also carry relative links (10 and 6 today, 0 broken). The CONTRIBUTING table already sends edits to them to `npm run test:unit`, which would run this check automatically.
- **Options:**
  - **(a) Include them (Rec).** Two more names in the list; one Why cell updated. A broken link in the shared rules block then reds `npm test`. Knock-on: none (checked). No task placement or `Depends on:` changes.
  - **(b) Only the six named targets.** Their links stay unchecked, and the CONTRIBUTING row stays as it is. Knock-on: none (checked).

**OQ2 — Image and badge links the shared rule cannot see (3 targets today, all resolving).**
- **Context:** the rule copied from `reference-integrity` deliberately skips image links and badge-style nested links. So README's teaser gif and its `VERSION` and `LICENSE` badge targets are not checked. Checking them means changing the settled link grammar, which the spec forbids paraphrasing.
- **Options:**
  - **(a) Disclose the gap in the new test's header and the CONTRIBUTING Why cell; do not fix it (Rec).** Same rule as the guard; the cost is 3 targets.
  - **(b) File a follow-up brief to widen the grammar for these docs only.** A separate decision against the spec. Knock-on: a new Backlog brief, and no open task waits on it (checked).
