# Plan — 0479: keep CHANGELOG.md up to date at every release

## Summary
- **Mechanism: enforced.** `bin/release.mjs` refuses an empty or missing `## Unreleased`. On a release it turns that heading into `## v<x.y.z> — <date>` and opens a new empty `## Unreleased` above it. This change goes into the same commit as the version bump. The deliberate way around the refusal is `--allow-empty-changelog`, and it prints a loud warning.
- **Why not "documented only":** a manual step is what already failed (History was never kept up by hand). The extra cost is one refusal path plus a flag. Being refused costs seconds, because the check runs **before** the ~12-minute test gate.
- The tree stays clean on every refusal. The check reads the file and refuses before the test gate. After the gate it reads the file again, checks it again and builds the new text, and only then writes anything. So an edit made during the gate is kept, never overwritten.
- `RELEASING.md` §3/§4/§5 and `CHANGELOG.md`'s header get updated. The tests get a `0479/*` section in `test/release-summary.test.js` (9 tests), plus 2 permanent prove-red mutations (42, 43).
- Checks: `npm test` (the `CONTRIBUTING.md` table row for `bin/release.mjs` and `test/`). Nothing is skipped.
- 2 open questions: whether to add a contributor rule (the brief requires asking), and what happens to the `## Releases` table.

## 1. Where things stand now (checked against the working tree)
- `CHANGELOG.md` (71 lines) has these sections: header, then `## Unreleased` (the 0478 README bullet plus the 0481 `fkit update` bullet), `## Upgrade notes` (including the new 0481 "Custom-path or fork installs" note), `## History`, and `## Releases` (a table of tags v0.1.0 to v0.3.1). **All of it is kept.** The plan only adds a new version heading and edits the header and the table title (see OQ2).
- `bin/release.mjs` (463 lines), in order: preflight, branch/unborn guard (:136-164), version resolution (:185-205), test gate (:207-249), post-gate HEAD compare (:251-273), bump (:275-285), then `git add -A`, commit, push, tag, summary. Nothing in it mentions a changelog.
- `RELEASING.md` has no step for the changelog. Separately, **most of its `bin/release.mjs:N` citations were already wrong before this change.** For example, §4 cites `:175-192` for the gate, which now sits at `:207-249`, and `:259-260` for the tag, which now sits at `:337-338`.
- `test/release-summary.test.js` (15 tests, ~12.6 s measured) runs a **copy** of release.mjs inside a temporary repo whose origin is a local bare repo. That isolation is checked by assertions in the test, not just assumed. The prove-red seam is `FKIT_RELEASE_MJS`. prove-red runs this file 8 times (step 0k plus mutations 18-22, 25, 26).

## 2. Design (bin/release.mjs)

**New flag:** `--allow-empty-changelog`. It goes in the header comment's option list and in the `--help` text.

**Parse rules** (one small helper inside release.mjs, no dependencies):
- The heading must be the exact line `## Unreleased` (trailing whitespace is ignored, and case matters).
- Fenced code is not scanned for headings: a line starting with ``` or ~~~ switches fence mode on and off.
- The section ends at the next `## ` line outside a fence. `### ` subheadings stay inside the section.
- "Empty" means the section body is only whitespace. An HTML comment counts as content.
- Line endings: if the file uses CRLF, inserted lines use CRLF too. Otherwise LF.

**Before the test gate** (after version resolution, before `// --- test gate`). It runs on every path, `--dry-run` and `--no-test` included, just like the branch guard. Each check below either refuses or moves on:
1. `CHANGELOG.md` missing, no `## Unreleased`, or more than one `## Unreleased`: **always refuse**, even with the escape hatch. The file is broken and needs fixing, which takes seconds.
2. A `## v<target>` heading already exists (matched on `v<target>` followed by whitespace or end of line, so `v0.1.1` does not match `v0.1.10`). That means a partly failed release already did this step. Example: the bump commit was made but the push failed, and the maintainer re-runs with `--no-bump` as the script header advises. **No check and no rewrite.** It prints `changelog: CHANGELOG.md already has a v<target> section — left as is`. Without this rule, the documented recovery path would be refused, because `## Unreleased` is empty again by then.
3. Section empty and no hatch: **refuse**. The message names `CHANGELOG.md` and `## Unreleased`, says what to do, and includes these lines: "Finishing a partly-failed release? re-run with --no-bump"; "To release anyway: --allow-empty-changelog"; "Nothing was changed: no bump, no commit, no tag."
4. Section empty with the hatch: an unconditional stderr warning in the same style as the `--no-test` banner (`⚠ --allow-empty-changelog: releasing v<target> with an EMPTY ## Unreleased …`).

**After the post-gate HEAD compare, before the first write:**
- Read `CHANGELOG.md` **again** and repeat checks 1-4 on the fresh text. A refusal at this point is still a clean abort. Then build the new text in memory.
- New text: the `## Unreleased` line becomes `## Unreleased`, a blank line, then `## v<version> — <YYYY-MM-DD>` (local date, em dash, as the brief writes it). The old body stays below unchanged. Every byte before and after the section is unchanged.
- With the hatch on an empty section, the version section gets one line: `No changes were recorded for this release.` That way every tag still gets a heading, and the hatch stays visible in the file.
- The plan step prints `stamp CHANGELOG.md: ## Unreleased → ## v<version> — <date>` (or the "already has" line). Under `--dry-run` it prints and writes nothing.
- The write happens in the bump block, after `VERSION` and `package.json`, behind `!dryRun`. `git add -A` then puts it in the release commit. It is written as one distinctive single line (prove-red anchor, see §4).
- Accepted, existing risk (stated, not fixed): if one of the three writes fails partway, some files are changed and others are not. That is already true today for VERSION and package.json.
- **Prove-red anchors:** the new code must not add a second copy of any anchor line an existing mutation uses (for example `} else if (!doTag) {`, `^if (nowOn !== onBranch) {$`, `^} else if (tagCreated) {$`).

## 3. Docs
- **`RELEASING.md`**
  - §3: a new item 2, **"Write the release notes"**: entries go under `## Unreleased`; the release refuses an empty section before the test gate; the escape hatch exists. Items 2-4 become 3-5.
  - §4: the gate paragraph gains the changelog check, including that it runs before the gate and is checked again after it. Step 1 becomes "bump `VERSION` + `package.json`, and turn `## Unreleased` into `## v<version> — <date>` in `CHANGELOG.md`".
  - §5: a new bullet saying the check proves the section is not empty, not that it is complete or accurate, and that `--allow-empty-changelog` is loud but nothing blocks it.
  - §1: link "changelog entry" to `CHANGELOG.md`.
  - **Fix every `bin/release.mjs:N` citation** to its line after this change, each paired with a quoted fragment or the name of what it points at. This follows `conventions/durable-citation-anchors.md`: "a coordinate already known to be wrong is repaired, not annotated". Several are wrong today, and this change moves every one of them.
- **`CHANGELOG.md` header**: one sentence saying `npm run release` turns `## Unreleased` into the release's own `## v<x.y.z> — <date>` section and refuses an empty one. The `## Releases` table changes per OQ2. **No `## Unreleased` bullet for 0479 itself:** the release tooling ships to nobody, and this file is for fkit users.
- **`ai-agents/knowledge-base/architecture.md`** §7 flow "6 — Release": a few added words naming the changelog step, so the design record stays true.
- **Left out on purpose:** the stale "~6 min" runtime text in release.mjs, RELEASING.md and architecture.md belongs to task `0395`. The wiki page `systems/install-and-self-update.md` gets a follow-up note for `fkit-wiki` (the coder does not write the wiki). `CONTRIBUTING.md` changes only if OQ1 says yes.

## 4. Tests (ADR-014: `node --test`, no dependencies)
**Fixture change:** `makeFixture()` gains a committed `CHANGELOG.md` with a filled `## Unreleased`, so the 15 existing tests keep releasing. Its comment "makeFixture() stays byte-identical for 0288" gets reworded honestly. Step 0k (the unmutated copy must pass) certifies this.

**New `0479/*` section**, and the file's SCOPE / PROVE-RED header paragraphs get updated:
1. `0479/empty-unreleased-refused`: exits 1 with the message. Also under `--dry-run`. VERSION, package.json and CHANGELOG bytes are unchanged, `git status` stays empty, and no tag or origin change.
2. `0479/refused-before-the-test-gate`: gate ON, with the fixture test script `touch gate-ran`. Refused, and the `gate-ran` marker is absent. This proves the fast fail. The script respects `releaseWithGateOn()`'s rule against npm/node/release.
3. `0479/missing-or-duplicate-unreleased-refused`: no file, no heading, two headings. Each case is refused, with and without the hatch, and the tree is clean.
4. `0479/filled-unreleased-stamped`: the body includes a `### ` subheading and a fenced `## ` line. `git show HEAD:CHANGELOG.md` has a fresh `## Unreleased`, then `## v0.1.1 — <today>` (either side of midnight accepted), then the old body byte for byte, with prefix and suffix unchanged. CHANGELOG.md is in the tagged release commit, and the tree is clean afterwards.
5. `0479/escape-hatch-loud`: empty plus the hatch exits 0. The stderr banner is there, and the version section holds the "No changes were recorded" line.
6. `0479/no-bump-finishes-a-stamped-release`: the `## v0.1.0` section already exists and `## Unreleased` is empty. `--no-bump` is accepted with the file untouched and the "already has" line printed. A default (bumping) run in the same state is refused.
7. `0479/edit-during-gate-kept`: gate ON, with the script appending a line to `## Unreleased`. That line ends up in the stamped section, which proves the file is read again and not overwritten.
8. `0479/emptied-during-gate-refused`: gate ON, with the script rewriting the file to an empty section. Refused after the gate, before any write. VERSION is unchanged and the tree is clean.
9. `0479/dry-run-stamps-nothing`: prints the stamp step and leaves CHANGELOG unchanged.

**Seen-red evidence** (brief verification 2):
- **Permanent prove-red mutations:**
  - **42**: disarm the empty-section refusal, so `0479/empty-unreleased-refused` must go red by name.
  - **43**: drop the CHANGELOG write, so `0479/filled-unreleased-stamped` must go red by name.
  - Both use the existing anchor discipline: no-op check, marker present, marker count of 1, no surviving original line. They are added after step 41 and before `step end`.
  - Update the "FORTY-ONE" header, the index list, the 0k message, and the "18-22, 25 and 26" mentions in prove-red.sh and release-summary.test.js.
- **Cost: about +1.5 min on `npm test`.** Each release-suite run goes from ~12.6 s to ~19 s (estimated). prove-red runs it 10 times instead of 8.
- **One-off mutants for tests 2, 3, 5, 6, 7, 8.** Each is run against a **copy** in the scratchpad via `FKIT_RELEASE_MJS` and never against the real file. Each is recorded in `worklog.md` with the exact edit made and the red test's name.

## 5. Sequence
1. release.mjs: flag, parser helper, pre-gate check, post-gate re-read and new text, write, header/help.
2. Fixture change, then the 9 tests. Run `node --test test/release-summary.test.js` until it passes (fast loop).
3. One-off mutants on scratch copies; record them in the worklog.
4. prove-red mutations 42/43 plus the bookkeeping text.
5. Docs: RELEASING.md (including the citation fixes), CHANGELOG.md header and table (per OQ2), architecture.md flow 6, CONTRIBUTING.md (only if OQ1 says yes).
6. Scratch dry run (brief verification 3), done by hand. Scratch git repo plus a local bare origin under the scratchpad. **Assert that `git remote get-url origin` is inside the scratchpad before any run.** Copy in the working-tree release.mjs and CHANGELOG.md. Run `node bin/release.mjs --no-test --no-push --no-tag` with the section empty (expect refused and `git status` unchanged), then filled (expect the stamped heading and a new empty `## Unreleased`). Delete the scratch directory afterwards.
7. Checks (§6), then hand over for review.

**Never:** `npm run release` or `release:dry` on the real repo, or any tag, push or commit.

## 6. Checks (`CONTRIBUTING.md` "What to run for a change")
- **Run `npm test`** (~12 min, more with the new mutations). It is the heaviest row this change touches: `bin/release.mjs` and `test/` are both in it.
- **Also run** `node --test test/reference-integrity.test.js` explicitly (brief verification 4), and `node --test test/release-summary.test.js` during development. Both are already covered by `npm test`.
- `RELEASING.md`, `CHANGELOG.md` and `CONTRIBUTING.md` are in the "nothing" row: **no automated check covers them.** Check every link touched by eye (task 0484 has not been built yet). architecture.md is in the `test:docs` row, which `npm test` already runs.
- **Run** `grep -nE '/Users/|/private/|/home/'` over the changed files (verification 5).
- `grep -n -i changelog RELEASING.md` shows the new text (verification 1).
- **Skipped: none.**

## 7. Risks / edge cases
- If the fixture is not updated, all 15 existing tests fail for the wrong reason. Step 0k catches that.
- **Covered by tests:** the `--no-bump` recovery path (rule 2), the maintainer editing CHANGELOG during the 12-minute gate (re-read), and `## ` lines inside fences or `### ` subheadings.
- **Not covered by a test (judged too small):** a `--no-bump` release of a version that was tagged before this feature (for example `v0.3.1`) would stamp a `## v0.3.1` heading. That is an odd but harmless edge. The existing tag-exists warning still fires.
- Prerelease versions (`--version 1.2.3-rc.1`) get a heading such as `## v1.2.3-rc.1 — …`.
- Unknown flags are ignored, as they are today. So a mistyped hatch flag means a refusal, which is the safe direction.
- **Write-order caveat:** see §2.
- **First real release after this lands:** the current `## Unreleased` (0478 and 0481 entries) becomes the first stamped section, so there is nothing to backfill.
