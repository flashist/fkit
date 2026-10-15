# Check the links in fkit's top-level docs, not only under `ai-agents/`

**Source**: `ai-agents/tasks/done/0484-check-the-links-in-fkits-top-level-docs-not-only-under-ai-agents/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`
**Sprint/Tag**: Sprint 10 `P23` (pulled by owner ruling R11, 2026-10-14) · task `0484` · owner `fkit-coder`

## Goal
Owner ruling 2026-10-04 on `0480`'s plan OQ3 (*"a link check for the root docs"*): *"File a follow-up."* **The gap:**
`test/reference-integrity.test.js` walks only `ai-agents/` (minus the wiki vault), and its `L7` test asserts nothing
outside is scanned — so **no automated check read the links in** `README.md`, `CONTRIBUTING.md`, `RELEASING.md`,
`CHANGELOG.md`, `docs/` or `claude/README.md`, locally or in CI. `0480`'s *"What to run for a change"* table said so:
*"nothing — check any links you touched by eye"*. About 31 relative links, 0 broken at filing — the work is the check,
not a clean-up.

**Constraints:** the existing guard **transcribes a settled, owner-ruled spec** (`reports/2026-08-29-the-reference-integrity-condition.md`
§4.1), whose scanned set is part of the condition — widening it would change the condition and break `L7`. ⚠️ **Reuse
trap:** the shared functions lived in a `.test.js` file, and importing it runs its tests twice; copy-pasting the regexes
is forbidden by the spec (*"Do not paraphrase these into a fresh regex"*).

## Key Changes
- **`test/link-condition.mjs` (new, non-test module):** the §4.1 pieces moved **unchanged** out of the guard — `walk`,
  the masking functions, `LINK`, `SKIP_SCHEME`, `ELIDED`, `resolveExact`, `formatBroken` — plus `scanFiles(root, visited,
  namedExemptKeys)`, the old scan loop with one parameter renamed. Both tests import it.
- **`test/reference-integrity.test.js`** keeps its own scanned set, `L7` and the scanned-count tests; it now imports the
  moved pieces and calls `scanFiles(root, collectFiles(root), NAMED_EXEMPT)` (net −181 lines in this window's diff). Its live figures before and after were identical (`scanned 1173 files,
  resolved 4741 link targets, 0 broken, 7 named-exempt`).
- **`test/top-level-doc-links.test.js` (new):** a fixed `NAMED` list of **7** files — the six the owner named plus,
  by owner ruling OQ1 *"Include them (Rec)"*, root **`CLAUDE.md` and `AGENTS.md`** — and every `.md` under `docs/`.
  **No exemptions.** Live arms T1–T4 (incl. a scope pin: a renamed or deleted named file fails, not skips) and fixture
  arms M1–M5 under `os.tmpdir()`. Live: **8 files, 51 link targets, 0 broken, ~0.1 s.**
- **`npm run test:docs`** now runs it. **`CONTRIBUTING.md`**: the top-level docs get their own row naming the check; only
  `LICENSE` and the wiki vault still say *"no automated check covers these files"*.
- Owner OQ2 *"Disclose the gap (Rec)"*: **3 image/badge targets are not checked** — disclosed in the test header and the
  CONTRIBUTING row; nothing filed.

## Outcome
- Proven: a scratch copy with one broken link in `README.md` and one in `claude/README.md` reds T3 naming both; the
  fixture arms red on targeted mutants. `npm test` exit 0 (unit 1121, prove-red hard gate passed, **~23 min** against the
  plan's ~12 estimate); `test:docs` 398/398 in ~21 s.
- Review (both reviewers measured), all low: **R1 (frontier)** — `CHANGELOG.md` is scanned whole, **released entries
  too**, so deleting a file an old entry links to forces an edit of release history. Live case: v0.3.2 links
  `docs/board.md`, which Backlog task `0467` plans to delete. Owner: *"Accept + disclose (Rec)"* — accepted residual
  `released-changelog-links-checked`. **R2** — two comments in `test/coordination-citation-policy.test.js` still placed the
  shared masking copy in the guard file; owner *"Fix now (Rec)"*, fixed. **R3** — one long line re-wrapped.
- ⚠️ **For the producer, recorded not acted on:** `0467` must also fix the links to `docs/board.md` in `README.md`,
  `CONTRIBUTING.md` and the released `CHANGELOG.md` entry, or this check reds; cleanup brief `0512` should cover
  `test/link-condition.mjs` too. ✅ Both landed at `96c7263`: `0467`'s brief carries a 2026-10-14 note listing the
  three `docs/board.md` links (incl. the released `CHANGELOG.md` one), and `0512`'s brief names `test/link-condition.mjs`.

## Related
- [[tasks/build-the-link-resolution-guard]] — `0354`, the guard whose functions moved into the shared module
- [[tasks/settle-the-reference-integrity-condition-once-for-both-halves]] — `0353`, the settled §4.1 condition both tests apply
- [[tasks/run-only-the-checks-a-change-needs-not-the-full-suite-every-time]] — `0480`, whose OQ3 filed this task and whose table it updated
- [[tasks/fix-nine-stale-line-cites-and-claims-found-during-sprint-10]] — `0496`, run first because it edits `RELEASING.md`
- [[tasks/overhaul-the-readme-for-first-time-visitors]] — `0478`, which moved the web-board details into `docs/board.md`, the target R1's live case links
- [[systems/testing-and-verification]] · [[tasks/sprint-10-the-0472-0482-batch]] · [[tasks/add-backlog-board-default-for-unsprinted-task-briefs]]
- [[tasks/add-a-why-not-what-code-comment-rule-and-remove-the-rules-that-contradict-it]] — `0506`, whose comment-cleanup series (`0512`) inherits this task's R2 note
