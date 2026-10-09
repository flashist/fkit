# Worklog — 0479 Keep CHANGELOG.md up to date at every release

Build step, spawned `fkit-coder` under `fkit-sprint-ship-loop` (Sprint 10), 2026-10-05.
Approved plan: `plan.md` in this folder (blob `bc5bfdf991c0d5a90d5a7e29ad314f7bed0ba208`, 14435 bytes;
hash re-checked at the start of Build — it matches). `plan.md` was not edited.

## Owner rulings on the plan's open questions (2026-10-05, `AskUserQuestion` in the lead session)

`plan.md` is never edited; the rulings live here.

- **OQ1 — contributor rule:** *"Yes, add the rule"* (*"Changes get noted as they land, so at release
  time the list is mostly written and the check is only a backstop."*). Done: one short paragraph
  appended under `CONTRIBUTING.md` → `## Releases`. Nothing else in that file was touched (it carries
  0477/0480 edits).
- **OQ2 — the `## Releases` table:** *"Retitle 'Earlier releases'"* (*"One heading plus one sentence
  saying newer releases have their own sections above. The release script leaves it alone."*). Done:
  `## Earlier releases` plus one sentence above the unchanged table.

## What was built (plan §5 steps 1–6)

1. **`bin/release.mjs`** — `--allow-empty-changelog` (header option list, `--help`, a header
   paragraph); `checkChangelog(when)` helper; the pre-gate call after version resolution; the post-gate
   re-read after the HEAD compare; the stamp step + one-line write after the bump block; the dry-run
   `willCommit` fold-in.
2. **`test/release-summary.test.js`** — `makeFixture()` commits a filled `CHANGELOG.md`; header SCOPE /
   PROVE-RED paragraphs and the 0300 "byte-identical" comment reworded; nine `0479/*` tests. 24/24 pass.
3. **One-off mutants** — below.
4. **`test/prove-red.sh`** — mutations 42 and 43 after 41; FORTY-THREE header and index; the
   "18-22, 25 and 26" mentions, the 0k comment and message, `1…43`, and the `run_release_suite()` cost
   comment (32 fixtures, ten runs).
5. **Docs** — `RELEASING.md` (§1 link, §3 new item 2 and renumbering, §4 changelog paragraph and step 1,
   §5 bullet, every `bin/release.mjs:N` citation repaired with a quoted fragment or name);
   `CHANGELOG.md` header sentence + OQ2 retitle (0481's entries kept); `architecture.md` flow 6;
   `CONTRIBUTING.md` (OQ1).
6. **Scratch dry run** — below.

## One-off mutants (plan §4; brief verification 2)

Each was made by exact string replacement (anchor count asserted = 1) on a **copy** of the working-tree
`bin/release.mjs` in the session scratchpad, and run with
`FKIT_RELEASE_MJS=<copy> node --test test/release-summary.test.js`. The real file was never edited.
The scratch copies were deleted afterwards.

| Mutant | Exact edit | Red tests (and only these) |
|---|---|---|
| T2 | removed the line `checkChangelog("before");` | `0479/refused-before-the-test-gate` |
| T3 | `if (unreleased.length !== 1) {` → `if (unreleased.length === 0) {` | `0479/missing-or-duplicate-unreleased-refused` |
| T5 | `if (empty && !warnedEmptyChangelog) {` → `if (false) {` | `0479/escape-hatch-loud` |
| T6 | `if (stamped) return null;` → `if (false) return null;` | `0479/no-bump-finishes-a-stamped-release` |
| T7 | pre-gate result kept (`const preGate = checkChangelog("before");`) and reused (`const stamp = preGate;`) — no re-read | `0479/edit-during-gate-kept`, `0479/emptied-during-gate-refused` (both depend on the re-read; inherent) |
| T8 | `if (empty && !allowEmptyChangelog) {` → `… && when === "before") {` (post-gate refusal off) | `0479/emptied-during-gate-refused` |

The permanent mutations' exact `sed` lines were also run by hand on scratch copies (prove-red.sh itself
was **not** run — that is the Verify step):

| Mutation | Lines changed / marker count | Red tests |
|---|---|---|
| 42 (empty-section refusal disarmed) | 1 / 1 | `0479/empty-unreleased-refused`, `0479/refused-before-the-test-gate`, `0479/no-bump-finishes-a-stamped-release`, `0479/emptied-during-gate-refused` |
| 43 (CHANGELOG.md write dropped) | 1 / 1 | `0479/filled-unreleased-stamped`, `0479/escape-hatch-loud`, `0479/edit-during-gate-kept` |

The isolation notes in prove-red.sh's 42/43 comments state exactly these lists.

## Scratch dry run (plan §5 step 6; brief verification 3)

Scratch git repo + local bare origin under the session scratchpad. `git remote get-url origin` was
asserted to be inside the scratchpad before each run (`case` check; printed "OK"). Copied in the
working-tree `bin/release.mjs`, `CHANGELOG.md`, `VERSION` (0.3.1) and `package.json`.

- **Empty `## Unreleased`** (body removed, committed): `node bin/release.mjs --no-test --no-push --no-tag`
  → exit 1, `✗ CHANGELOG.md: the \`## Unreleased\` section is empty — refusing to release v0.3.2 …`,
  `git status --porcelain` empty, no new commit.
- **Filled** (the real file): same command → exit 0; plan printed
  `• stamp CHANGELOG.md: ## Unreleased → ## v0.3.2 — 2026-10-05`; the release commit's diff to
  `CHANGELOG.md` is exactly two added lines (`## v0.3.2 — 2026-10-05` and a blank) under a fresh
  `## Unreleased`, the 0478/0481 entries unchanged below them; tree clean; nothing pushed, no tag.
- Scratch directory deleted afterwards.

## Decision log (calls made without asking, under the plan's standing approval)

- **Stamp write placed right after the bump `if/else`, not inside its bump branch.** Finding answered:
  none (Build). Changed: `bin/release.mjs` stamp step sits after `release current version … (no bump)`.
  Why it qualified: obvious winner within intent — plan §2 says the write goes "in the bump block,
  after VERSION and package.json", but its rule 2 and test 6 require `--no-bump` runs to stamp too,
  which the bump branch never reaches.
- **Dry-run `willCommit` also counts a pending stamp** (`|| stamp !== null`). Changed: one condition in
  `// 1. stage + commit`. Why: obvious winner within intent — without it a `--no-bump --dry-run` on a
  clean tree would print "nothing to commit" while the real run commits the stamp, so the plan's
  "prints and writes nothing" dry run would print a false plan.
- **"Already has a v<target> section" line printed once, at the plan step, not also before the gate.**
  Why: mechanical — printing it at both checks would duplicate the line; plan names the text, not a
  position. Test 6 asserts the text.
- **Gate-ON tests 7/8 use `cp <committed file> CHANGELOG.md` as the fixture test script**, not an
  inline edit. Why: mechanical — `releaseWithGateOn()` refuses any script matching `/release/`, and the
  word `Unreleased` matches it; `cp` of a committed file keeps that seal intact. Consequence, stated: in
  test 8 the gate script's own edit stays in the tree, so "tree clean" is asserted as porcelain
  ` M CHANGELOG.md` (nothing staged, nothing bumped or committed) rather than empty.
- **Fixture comment "all 15 tests" (core.hooksPath, review R8) kept, qualified** as the count when it
  was measured, before 0479. Not re-measured. Why: mechanical honesty fix of a number this change made
  stale.
- **prove-red `run_release_suite()` cost comment** updated to 32 fixtures, ~30 s (28 s measured here),
  ten runs. Why: in-plan bookkeeping (plan §4 "update … mentions").
- No review fixes applied (Build step; no review yet).

### Review round 1 — Process-review (spawned `fkit-coder` under `fkit-sprint-ship-loop`, 2026-10-05)

`plan.md` blob re-checked at the start: still `bc5bfdf991c0d5a90d5a7e29ad314f7bed0ba208`. Three fixes
applied without per-fix owner approval, under the plan's standing approval; one owner ruling recorded.

- **Owner ruling, R2 (2026-10-05, direct, `AskUserQuestion` in the fkit-lead session):** *"Accept as
  known limit"* (*"Record it as a rare limit of the simple reader, re-raised only if a real CHANGELOG
  hits it. R1 is fixed either way."*). Recorded in `review.md` as `won't fix (frontier)` plus an
  *Accepted residuals* entry. No code change.
- **R1 fix — finding answered:** R1 (the "already has `## v<target>`" skip also fired on a bumping run,
  so a hand-written or mis-parsed `## v<target>` let an empty `## Unreleased` release with no refusal
  and no banner). **Changed:** `bin/release.mjs` rule-2 line `if (stamped) return null;` →
  `if (stamped && target === originalVersion) return null;`; the rule-2 comment above
  `checkChangelog()` and the `// --- CHANGELOG.md, read AGAIN` comment reworded in place (same line
  count, so every `RELEASING.md` `bin/release.mjs:N` citation still lands — spot-checked); the
  `RELEASING.md` § 4 sentence now says the skip applies only on a run that does not bump; new test
  `0479/bumping-run-ignores-a-target-section` (bare and `--version 0.1.1`). **Why it qualified:**
  verified `CORRECT` at `bin/release.mjs:277`; mechanical, one condition; in-plan — plan § 2 rule 2
  exists for the `--no-bump` recovery path, which always has `target === originalVersion`. **Stated
  consequence, not acted on:** a bumping run with a hand-written `## v<target>` and a FILLED
  `## Unreleased` now stamps normally and the file ends up with two `## v<target>` headings. Refusing
  that case instead was the reviewer's other option; not taken, the driver scoped the fix to "apply
  the skip only when not bumping".
- **R3 fix — finding answered:** R3 (several parse rules had no test that went red when they broke).
  **Changed:** `test/release-summary.test.js` gains `0479/fenced-lines-are-not-headings`,
  `0479/subheading-stays-inside-the-section`, `0479/version-boundary`, `0479/crlf-file-stays-crlf`
  and `0479/no-bump-dry-run-counts-the-stamp` (and R1's test above); `test/prove-red.sh` mutation
  42/43 isolation notes and the `run_release_suite()` fixture count (40; 24 for 0479) updated to the
  measured sets. **Why it qualified:** verified `CORRECT` (the reviewer's three mutants re-read against
  the tests: none could go red); tests only, no behaviour change; in-plan (plan § 4 / § 7 claim these
  rules are tested). `0479/subheading-stays-inside-the-section` goes one step past the driver's list —
  obvious winner within R3's intent: plan § 7 claims `### ` subheadings are covered, and the same
  analysis showed test 4 cannot tell (its `### ` line follows real content). Named in this entry so it
  is findable.
- **R4 fix — finding answered:** R4 (stale "The ONE gate-ON run" comment). **Changed:** the comment
  above `releaseWithGateOn()` names all four gate-ON tests; the seal argument is unchanged. **Why it
  qualified:** verified `CORRECT`; comment-only; in-plan bookkeeping.
- **Mutations 42/43:** sed anchors untouched by these fixes. Re-run by their exact `sed` lines on
  scratch copies: 1 changed line and 1 marker each; no surviving original line.

**Correction to `plan.md` § 7 (plan not edited).** § 7 says *"Covered by tests: … `## ` lines inside
fences or `### ` subheadings."* As built in Build, that was **not true**: the reviewer's one-off
mutants (fence toggle removed; boundary check → `true`; CRLF detection off) left all nine `0479/*`
tests green, and the same holds for a `### ` mutant, because test 4's fenced and `### ` lines sit after
real content and the stamp rewrites only the heading line. It is true **after** review round 1 (table
below). Still **not** covered by any test, and never claimed by § 7: trailing-whitespace and case rules
on the heading line, and "an HTML comment counts as content".

**One-off mutants, review round 1** (exact string replacement, anchor count asserted = 1, on scratch
copies via `FKIT_RELEASE_MJS`, `--test-name-pattern '^0479/'`; real file never edited):

| Mutant | Exact edit | Red `0479/*` tests (only these) |
|---|---|---|
| R1 revert | `if (stamped && target === originalVersion) return null;` → `if (stamped) return null;` | `0479/bumping-run-ignores-a-target-section` |
| T6 (re-anchored) | same line → `if (false) return null;` | `0479/no-bump-finishes-a-stamped-release` |
| fence rule removed | `    if (/^(```\|~~~)/.test(l)) fenced = !fenced;` → a comment | `0479/fenced-lines-are-not-headings` |
| ``` only | `/^(```\|~~~)/` → `/^(```)/` | `0479/fenced-lines-are-not-headings` |
| ~~~ only | `/^(```\|~~~)/` → `/^(~~~)/` | `0479/fenced-lines-are-not-headings` |
| `###` ends a section | `!l.startsWith("## ")` → `!l.startsWith("##")` | `0479/subheading-stays-inside-the-section` |
| boundary off | `(rest === "" \|\| /^\s/.test(rest))` → `true` | `0479/version-boundary` |
| CRLF off | `const eol = text.includes("\r\n") ? "\r\n" : "\n";` → `const eol = "\n";` | `0479/crlf-file-stays-crlf` |
| dry-run stamp not counted | `versionChanged \|\| stamp !== null;` → `versionChanged;` | `0479/no-bump-dry-run-counts-the-stamp` |

Mutation 42 now reds (full file, 30 tests): `0479/empty-unreleased-refused`,
`0479/refused-before-the-test-gate`, `0479/no-bump-finishes-a-stamped-release`,
`0479/emptied-during-gate-refused`, `0479/bumping-run-ignores-a-target-section`,
`0479/fenced-lines-are-not-headings`, `0479/version-boundary`. Mutation 43: `0479/filled-unreleased-stamped`,
`0479/escape-hatch-loud`, `0479/edit-during-gate-kept`, `0479/fenced-lines-are-not-headings`,
`0479/subheading-stays-inside-the-section`, `0479/crlf-file-stays-crlf`,
`0479/no-bump-dry-run-counts-the-stamp`. prove-red.sh's isolation notes state exactly these.

## Follow-up for others (not done here)

- `fkit-wiki`: `systems/install-and-self-update.md` (or wherever the release flow is described) may
  need the changelog step. The coder does not write the wiki.
- `0395` owns the stale "~6 min" runtime text in `release.mjs`, `RELEASING.md` and `architecture.md`;
  untouched here.

## Checks run in Build

- `node --test test/release-summary.test.js` — 24/24 pass (~28 s).
- `node --test test/reference-integrity.test.js` — 22/22 pass.
- `npm run test:docs` — 372/372 pass.
- The machine-path grep (plan §6, brief verification 5) over the seven changed files and this
  worklog — no match.
- `grep -n -i changelog RELEASING.md` — new text at §1, §3 item 2, §4, §5.
- **Not run in Build:** full `npm test` (incl. prove-red step 0k and mutations 42/43) — that is the
  separate Verify step, per the driver.

## Verify

Verify step, spawned `fkit-coder` under `fkit-sprint-ship-loop` (Sprint 10), 2026-10-05. Verify only:
nothing but this section was written. `plan.md` blob still `bc5bfdf991c0d5a90d5a7e29ad314f7bed0ba208`.

**Result: pass.**

- **Changed files did not move during the run.** sha1 at start = sha1 at end (`diff` empty) for
  `bin/release.mjs` `7d26f1da…`, `test/release-summary.test.js` `c4ae0d30…`, `test/prove-red.sh`
  `38ace970…`, `RELEASING.md` `214a1951…`, `CHANGELOG.md` `6c99ec61…`, `CONTRIBUTING.md` `ea91232a…`,
  `ai-agents/knowledge-base/architecture.md` `cfa42945…`. The scratch copy's sha1s matched too.
- **Full `npm test`** in a fresh `cp -R` copy (incl. `.git`) under the session scratchpad: exit 0.
  - Unit: 1042 tests, 24 suites, 1042 pass, 0 fail, 0 skipped (~133 s). All nine `0479/*` tests pass.
  - prove-red: 16 step-0 checks all green (incl. **0k** "unmutated copy of bin/release.mjs should be
    green ... green", **0p** "unmutated copy update-reinstall suite should be green ... green"); 43
    mutations, all red.
  - **41** installer variables stripped — "0481/version-only" ... red.
  - **42** empty-changelog refusal disarmed — "0479/empty-unreleased-refused" ... red.
  - **43** CHANGELOG.md write dropped — "0479/filled-unreleased-stamped" ... red.
  - Final line: `✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.`
  - Wall time 1635 s (~27 min), against the plan's "~12 min + ~1.5". Not diagnosed. A reviewer was
    running in parallel on the same machine, so this may be load and not the change. `0395` owns the
    runtime figures.
- **Plan §6:** `node --test test/reference-integrity.test.js` 22/22 pass. Machine-path grep
  (`/Users/|/private/|/home/`) over the seven changed files plus this worklog: no match.
  `grep -n -i changelog RELEASING.md`: hits at :29, :124, :128, :177-180, :189, :216-217. The cited
  `:220-308` (`checkChangelog()`) and `:378-381` ("read AGAIN") match the current `bin/release.mjs`.
- **Content:** `CHANGELOG.md` `## Unreleased` still holds the 0478 README bullet and the 0481
  `fkit update` bullet. `## Upgrade notes` still holds 0481's "Custom-path or fork installs" note.
  `## Earlier releases` and its one sentence are there. `CONTRIBUTING.md` `## Releases` has the new
  rule (:64-66).
- **Not run:** `npm run release` or `release:dry` on the real repo, or any tag, push or commit. The
  brief forbids them. Links in the "nothing" row files (`RELEASING.md`, `CHANGELOG.md`,
  `CONTRIBUTING.md`) were not re-checked by eye here. Build says it checked them, and no automated
  check covers them.

### Review round 1 — follow-up: owner ruling on R1's stated consequence

- **Owner ruling (2026-10-05, direct, `AskUserQuestion` in the fkit-lead session).** Question: *"Rare
  case: someone hand-writes '## v<next version>' in CHANGELOG.md AND fills in 'Unreleased', then
  releases. Today the CHANGELOG ends up with that version heading twice (nothing lost, just messy).
  What should the release do?"* Chosen: **"Refuse it"** (*"Stop with a clear message ('CHANGELOG
  already has a vX heading; remove it or put the notes under Unreleased'). Tiny change plus one
  test."*). This replaces the "stated consequence, not acted on" in the R1 entry above.
- **Changed, under that ruling:** `bin/release.mjs` `checkChangelog()` — right after the rule-2 line, a
  bumping run (`target !== originalVersion`) that finds `## v<target>` fails with *"CHANGELOG.md
  already has a `## v<target>` heading…, but no release wrote it … Remove it, or move its notes under
  `## Unreleased`, then re-run. --allow-empty-changelog does not skip this."* It sits in the shared
  helper, so it fires before the gate and on the post-gate re-read, empty or filled, hatch or not.
  The `--no-bump` recovery path is unchanged. The rule-2 comment now says a bumping run refuses. +7
  lines, so the `RELEASING.md` citations after the insertion were re-derived against the file
  (`:220-315`, `:317-359`, `:321-326`, `:328-335`, `:298-304`, `:355-358`, `:385-388`, `:390-468`,
  `:458-459`), and its § 4 sentence now says a bumping run refuses. The test
  `0479/bumping-run-ignores-a-target-section` was renamed `0479/bumping-run-refuses-a-target-section`
  and covers empty (bare), empty with `--version 0.1.1`, empty plus the hatch, and filled. The
  round-1 entries above keep the old name as a record.
- **Seen red** (scratch copies, exact replacement, anchor count 1): `  if (stamped) {` → `  if (false) {`
  reds only `0479/bumping-run-refuses-a-target-section`; the R1 revert (`if (stamped) return null;`)
  reds only the same test.
- **Mutations 42/43:** anchors untouched, 1 changed line and 1 marker each. 42 no longer reds the
  bumping-run test, because the new refusal fires first. It now reds 6 tests:
  `0479/empty-unreleased-refused`, `0479/refused-before-the-test-gate`,
  `0479/no-bump-finishes-a-stamped-release`, `0479/emptied-during-gate-refused`,
  `0479/fenced-lines-are-not-headings`, `0479/version-boundary`. 43 is unchanged (7). The 42 isolation
  note and the fixture count (42; 26 for 0479) in `prove-red.sh` are updated.

- **Citation miss, fixed (lead's final re-verify, 2026-10-05; not an owner ruling).** Finding answered:
  the re-verify found two `RELEASING.md` § 4 citations still on pre-insertion numbers. The re-derivation
  above searched only `bin/release.mjs:N` and missed the bare `:N` forms. **Changed:** the `const tag`
  citation `:402` → `:409`, and the `⚠ --no-test` banner citation `:348-351` → `:355-358`. Nothing else
  changed. **Why it qualified:** verified `CORRECT` with `sed -n` against the current file; mechanical;
  in-plan (plan § 3: fix every `bin/release.mjs:N` citation). Then every release.mjs citation in
  `RELEASING.md`, bare or prefixed, was re-checked: `:458-459`, `:409`, `:208-213`, `:317-359`, `:96`,
  `:355-358`, `:321-326`, `:220-315`, `:385-388`, `:390-468`, `:298-304`, `:328-335`, `:89`. All land.
  The R1 *Coder response* row was corrected to say so.

## Review round 1 — checks (Process-review)

- **Full `npm test`** in a fresh `cp -R` copy (incl. `.git`) under the session scratchpad: exit 0.
  Unit: 1048 tests, 24 suites, 1048 pass, 0 fail, 0 skipped (~140 s); all fifteen `0479/*` tests pass.
  prove-red: **0k** green; 43 mutations, all red (42 and 43 by name); final line
  `✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.`
- **Nothing moved during the run:** sha1 of `bin/release.mjs`, `test/release-summary.test.js`,
  `test/prove-red.sh`, `RELEASING.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `architecture.md`, `plan.md`,
  `review.md` and this worklog at start = real tree at end, and `cmp` against the copy: identical.
  This section was written after that check.
- `node --test test/release-summary.test.js test/reference-integrity.test.js` on the real tree:
  52/52 (30 + 22).
- Machine-path grep (`/Users/`, `/private/`, `/home/`) over the changed files: no new match.
- **Not run:** `npm run release` / `release:dry` on the real repo, any tag, push or commit (forbidden).

## Review round 1 follow-up — checks (owner ruling "Refuse it")

- **Full `npm test`** in a FRESH `cp -R` copy (incl. `.git`) under the session scratchpad: exit 0.
  Unit: 1048 tests, 24 suites, 1048 pass, 0 fail, 0 skipped (~134 s). prove-red: **0k** green; 43
  mutations all red (42 and 43 by name); `✓ hard gate PASSED`.
- **Nothing moved during the run:** sha1 at start = real tree at end, and `cmp` against the copy showed
  all 10 tracked files identical (release.mjs, both test files, RELEASING.md, CHANGELOG.md,
  CONTRIBUTING.md, architecture.md, plan.md, review.md, this worklog). This section was written after.
- `node --test test/release-summary.test.js test/reference-integrity.test.js` on the real tree: 52/52.
- **Not run:** `npm run release` / `release:dry` on the real repo, any tag, push or commit.

## Re-verify (final)

Independent light pass after the R1 "Refuse it" follow-up (fkit-sprint-ship-loop, 2026-10-05). Verify only — no source edits. **Result: FAIL — two stale `bin/release.mjs:N` citations in `RELEASING.md` § 4.** Everything else passed.

- **sha1 unchanged** start→end on all 7 watched files (`bin/release.mjs` f75e59bf…, `test/release-summary.test.js` 674925bb…, `test/prove-red.sh` 358ee3a9…, `RELEASING.md` 90359d8e…, `CHANGELOG.md` 6c99ec61…, `CONTRIBUTING.md` ea91232a…, `architecture.md` cfa42945…).
- **Fresh scratch copy** (rsync of the tree incl. `.git`, watched files `cmp`-identical): `node --test test/release-summary.test.js test/reference-integrity.test.js` 52/52 pass; `npm run test:docs` 372/372 pass; `node --check bin/release.mjs` exit 0.
- **prove-red in isolation** (prove-red's own `make_release_copy` / `run_release_suite` + its exact `sed` lines): 0k green (30/30). 42 red at `0479/empty-unreleased-refused`, 1 changed line (:289); red set = the 6 its comment documents. 43 red at `0479/filled-unreleased-stamped`, 1 changed line (:403); red set = the 7 its comment documents.
- **`checkChangelog()` read:** bumping run + `## v<target>` → `fail()` at :278-284 (before the empty check, so empty or filled, hatch or not), called pre-gate (:315) and post-gate (:388). Non-bumping (`target === originalVersion`) + stamped → `return null` (:277), step prints "left as is", no write. First write is :394 (after both checks); every refusal is a `fail()` before it. `--dry-run`: VERSION/package.json/CHANGELOG writes (:393, :403), commit, push, tag all guarded by `!dryRun`; dry-run skips `git add -A`.
- **Citations:** 13 of 15 land. **Two stale (off by 7, the size of the new refusal block):** `RELEASING.md:28` cites `:402` for `` const tag = `v${version}` `` — it is at **:409** (:402 is the stamp `step`); `RELEASING.md:172` cites `:348-351` for the `⚠ --no-test` banner — it is at **:355-358** (§ 5 at :215 already cites 355-358 correctly; 348-351 is the blank line / `if (doTest)` / comment / `console.log`). Both lines are in this task's diff; `review.md` R1 response says "shifted `bin/release.mjs:N` citations updated". `reference-integrity` does not catch line-number drift.
- **CHANGELOG.md:** `## Unreleased` holds the 0478 README entry and the 0481 `fkit update` entry; 0481 upgrade note present; `## Earlier releases` present. **review.md:** `Status: closed-out`; R1–R4 findings + coder rows present; R2 under *Accepted residuals*.
- **Not run:** full `npm test` (driver's call; worker's run reported exit 0). Never ran `npm run release` / `release:dry` on the real repo, or any tag/push/commit.
