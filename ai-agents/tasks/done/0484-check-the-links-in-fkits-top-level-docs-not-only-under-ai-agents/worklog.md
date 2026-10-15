# Worklog — 0484: check the links in fkit's top-level docs, not only under `ai-agents/`

Build worker: spawned `fkit-coder`, caller `fkit-sprint-ship-loop` / `fkit-lead` (Sprint 10), 2026-10-14.
Approved plan carried verbatim with its blob pointer; re-checked at start: `git hash-object plan.md` =
`f1f675de9c85958b8620bbaa2e3e9f6921a27f50`, 14851 B, a match. Owner approvals, all via
`AskUserQuestion` in the `fkit-lead` session on 2026-10-14:
- plan: "Approve (Rec)";
- OQ1 "Include them (Rec)" — `CLAUDE.md` and `AGENTS.md` are in `NAMED`, and their CONTRIBUTING Why
  cell is extended;
- OQ2 "Disclose the gap (Rec)" — the 3 unchecked image/badge targets are disclosed in the new test's
  header and the CONTRIBUTING Why cell; nothing filed.

`plan.md` was not touched. No commit, no push, no wiki-vault write.

## Change surface (5 files)
- `test/link-condition.mjs` (new): the §4.1 pieces moved out of `test/reference-integrity.test.js`
  unchanged — `walk`, `blank`, `maskFencesAndQuotes`, `maskCodeSpans`, `maskDocument`, `LINK`,
  `SKIP_SCHEME`, `ELIDED`, `entriesOf`, `resolveExact`, `formatBroken`, with their comments and the D2
  section divider. `maskDocument` and `formatBroken` are now exported. New `scanFiles(root, visited,
  namedExemptKeys)` is the old `scan` loop; its only text change is `NAMED_EXEMPT.has` →
  `namedExemptKeys.has`. Checked: every line removed from the guard is in the module, except the
  intended changes (the `scan` body, the two `export` prefixes, and the guard's own comment edits).
- `test/reference-integrity.test.js`: imports from the module; `scan(root)` is now
  `scanFiles(root, collectFiles(root), NAMED_EXEMPT)`; S4 added to the header; D3's match-loop
  paragraph names the `namedExemptKeys` parameter; C7's "FOUR places" comment names the module, and its
  failure message labels our copy `test/link-condition.mjs` instead of "this file".
- `test/top-level-doc-links.test.js` (new): `NAMED` (7 files, incl. `CLAUDE.md`, `AGENTS.md`) plus
  every `.md` under `docs/` if it exists; no exemptions. Arms T1–T4 (live) and M1–M5 (fixtures under
  `os.tmpdir()`).
- `package.json`: `test:docs` runs the new file.
- `CONTRIBUTING.md`: row 1 split (`LICENSE` + wiki vault stay "nothing"; new row for the top-level
  docs → `npm run test:docs`, fast path the single file); `CLAUDE.md`/`AGENTS.md` Why cell extended;
  the `test:docs` bullet now also names the top-level docs.

No `CHANGELOG.md` line: an internal repo test that fkit users will not notice (plan Step 6).
`test/coordination-citation-policy.test.js` left alone: re-checked by grep, its comments ("the sibling
half", "compares it against its own") are still true.

## Evidence
- Guard before and after: 22 pass / 0 fail; L8 identical — `scanned 1173 files, resolved 4741 link
  targets, 0 broken, 7 named-exempt`; skips `19 / 16 / 0`. L7 and C7 green.
- New check, live tree: 9 pass; `scanned 8 files, resolved 51 link targets, 0 broken`; skips `9 / 0 /
  0`; about 0.1 s wall.
- Scratch copy (`rsync -a --exclude .git`, session scratchpad): broke `README.md` → `CONTRIBUTNG.md`
  and `claude/README.md` → `../ai-agents/knowledge-base/decisions/adr-009-gone.md`; T3 red naming both
  files and both targets. Reverted: 9 pass.
- Fixture arms can red (scratch copy only): stubbing the `resolveExact` call in `scanFiles` reds M1,
  M2, M5. Walking the whole root instead of `docs/` and making `missingNamed` return `[]` reds M3, M4,
  T2 (and M1, M2, T3). Restored: 9 pass.
- `npm run test:docs`: 398 pass / 0 fail, 20.9 s wall; it runs the new file.
- CONTRIBUTING: the only row still saying "no automated check covers these files" is
  `LICENSE` + wiki vault.
- `npm test`: exit 0, 22.9 min wall (plan estimated ~12). Unit 1121 pass / 0 fail. Prove-red's final
  line: `✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.`
- Stray writes: `git status --porcelain` at start vs after the edits shows only the five planned files;
  unchanged across `test:docs` and `npm test` (nothing written by a test); nothing under
  `ai-agents/wiki-vault/`. This worklog was written after the suite ran.

## Decision log
Obvious-winner calls made without asking (each mechanical, localized, and inside the plan's intent):
1. **`scanFiles` parameter names.** Plan wrote `scanFiles(root, files, namedExempt)`. `namedExempt` is
   already the loop's counter (`let namedExempt = 0`), so that name is a redeclaration error. Named the
   set `namedExemptKeys`, and the file list `visited` so the lifted loop body stays byte-identical apart
   from the one planned change. D3's note names `namedExemptKeys`.
2. **The "1. THE SCANNED SET" comment stayed in the guard.** It sat above `walk` but describes the
   guard's scanned set (`exempt`, `collectFiles`), not the walk. Moving it into the shared module would
   put a false scope claim there; it now sits above `exempt`.
3. **C7's failure-message label.** It said `this file  ->` for our copy, which the move made wrong; now
   `test/link-condition.mjs  ->`. Message text only; the comparison is unchanged.
4. **New-test header length.** Two short comments (purpose/category; OQ2 disclosure) rather than one
   1–2 line comment, because the owner's OQ2 ruling puts the disclosure in the header.

Review round 1 (Process-review worker, 2026-10-14; standing approval = the approved plan plus the
owner's rulings relayed by fkit-lead). Each finding verified at file:line before acting:
5. **R1 (frontier) — no code change; disclosure only.** Authorized by the owner ruling "Accept +
   disclose (Rec)". Added a 2-line comment to `test/top-level-doc-links.test.js`'s header ("CHANGELOG.md
   is scanned whole, released entries too") and one sentence to the CONTRIBUTING row's Why cell; the
   residual `released-changelog-links-checked` is in `review.md` § Accepted residuals.
6. **R2 (stale comments) — fixed.** Authorized by the owner ruling "Fix now (Rec)", which explicitly
   covers `test/coordination-citation-policy.test.js` although the plan left it alone. Both comments
   ("against its own copy"; "four places (§4.1, §4.2, the sibling half, and this file)") now name
   `test/link-condition.mjs`; "documented there" became "documented at C7". Comment text only, outside
   the declaration C7 slices; C7 green.
7. **R3 (long line) — fixed.** Verified-CORRECT, mechanical, localized, in-plan (a comment the plan's
   C7 edit had re-wrapped). Re-wrapped the one ~170-column line in C7's comment; text unchanged.

## For the producer (not acted on)
- 0512 (Backlog, comment cleanup of the repo-content guards) lists `test/reference-integrity.test.js`
  but not `test/link-condition.mjs`; after this change it should cover both. Not edited here.
- 0467 (Backlog) deleting `docs/board.md` must also remove the links to it in `README.md` and
  `CONTRIBUTING.md`, and fix the released v0.3.2 entry's link in `CHANGELOG.md` (review R1), or this
  check reds.

## Re-verify after review round 1 — 2026-10-14
Ran after the R1–R3 edits:
- `node --test test/reference-integrity.test.js test/coordination-citation-policy.test.js test/top-level-doc-links.test.js`:
  53 pass, 0 fail, ~0.55 s. C7 green.
- Guard L8 figures unchanged vs the pre-round capture: `scanned 1175 files, resolved 4741 link
  targets, 0 broken, 7 named-exempt`; skips `scheme/protocol-relative/anchor 19, elided 16,
  empty-after-fragment 0`.
- New check: `scanned 8 files, resolved 51 link targets, 0 broken`.
- `npm run test:docs`: 398 pass, 0 fail, ~21 s.
- `npm test` (unit + prove-red): exit 0; unit 1121 pass, 0 fail; prove-red "✓ hard gate PASSED — real
  + unmutated copy green; each mutation reds its NAMED assertion." ~23 min.
- Stray writes: `git status --porcelain` before vs after the test runs is identical. The only path new
  to the change surface since the round began is `test/coordination-citation-policy.test.js` (R2,
  owner ruling).
- Skipped: nothing. The targeted pair (reference-integrity, coordination-citation-policy) was re-run
  once more after this section was written, because both scan this file.
