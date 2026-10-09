# Check the links in fkit's top-level docs, not only under ai-agents/

## ID
0484

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** Being pullable on the board is not his word.

**Owner ruling behind this task** (2026-10-04, `fkit-lead` session, `AskUserQuestion`, on task
`0480`'s plan open question OQ3 — "a link check for the root docs"): *"File a follow-up."* Relayed to
a spawned producer. File it on the Backlog board; nothing is built now.

**The gap** (checked at filing, 2026-10-04, against the working tree):
- `test/reference-integrity.test.js` is the repo's link checker. Its `collectFiles(root)` walks only
  `ai-agents/` (minus `ai-agents/wiki-vault/`), and its test `L7 scope: claude/ and test/ were never
  walked at all` asserts that nothing outside `ai-agents/` is ever scanned.
- So **no automated check reads the links in** `README.md`, `CONTRIBUTING.md`, `RELEASING.md`,
  `CHANGELOG.md`, `docs/` (today `docs/board.md`) or `claude/README.md` — not locally, not in CI.
  A broken relative link there ships unnoticed.
- Task `0480` (in progress, Sprint 10) records this in its new `CONTRIBUTING.md` table
  ("### What to run for a change"): the first row, for exactly those files, says **"nothing — report
  'no automated check covers these files'; check any links you touched by eye"**. Source: `0480`'s
  `plan.md` §1 Summary, §2, §6 ("No link check covers the root docs (OQ3)"), and its `worklog.md`
  "Owner rulings" (OQ3: file a follow-up; the README row stays "nothing" until then).

**Size today** (rough count by the filing producer, using the guard's `LINK` / `SKIP_SCHEME` regexes
and a simple fence/code-span mask — **not** the guard's exact condition, so the plan re-measures):
about 31 relative links across the six named targets (`README.md` 9, `CONTRIBUTING.md` 6,
`RELEASING.md` 0, `CHANGELOG.md` 6, `claude/README.md` 7, `docs/board.md` 3), **0 broken**. So the
check should start green; the work is the check, not a clean-up.

**Constraints that shape the design:**
- **The existing guard is a transcription of a settled, owner-ruled specification** —
  `ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md` §4.1. Its header
  says the scanned set is part of that condition, and `claude/` and `test/` were put out of scope on
  purpose (frozen `test/fixtures/` and `claude/scaffold/` templates whose links resolve in the
  consuming project). Widening `collectFiles` itself would change the transcribed condition and break
  `L7` and the scanned-count tests. **Lean: a sibling test** that reuses the same match rule, masking
  and case-exact resolution over an explicit list of top-level files, leaving `reference-integrity`'s
  own scanned set untouched. The plan picks; if it widens the existing guard instead, it says why and
  records the change against the spec document.
- ⚠️ **Reuse trap:** the shared functions are exported from a `.test.js` file. Importing that file from
  another test file registers and runs its tests a second time. The plan decides how to share the code
  (for example, moving the pure functions to a non-test module, which the guard's header would then
  need to record as a structural adaptation) — not by copy-paste of the regexes, which the spec forbids
  ("⛔ Do not paraphrase these into a fresh regex").
- `claude/README.md` lives under `claude/`, but it is **not** a scaffold template (not in
  `claude/structure-manifest.tsv`, not copied by `claude/fkit-claude-init.sh`); its links resolve in
  this repo. Include it by name, not by walking `claude/`.
- `ai-agents/wiki-vault/` stays out (ADR-005: only `fkit-wiki` could make a red there green).
  `LICENSE` has no links.
- **Cost:** expected well under 1 s (the existing guard scans ~825 files in ~0.5 s).
- It is a repo-content guard (the "fourth test-scope category" the guard's header names, after
  `task-id-uniqueness`); fkit-repo-only, nothing ships to consuming projects.

**Dependency.** `0480` creates the `CONTRIBUTING.md` table and `npm run test:docs` that this task
updates. Start after `0480` is closed. No conflict with a locked decision found.

## What to build

1. **The check.** A test (sibling file, or an extension of the existing guard — plan decides, see
   Context) that applies the reference-integrity link condition to the top-level docs: `README.md`,
   `CONTRIBUTING.md`, `RELEASING.md`, `CHANGELOG.md`, every `.md` under `docs/`, and
   `claude/README.md`. Same rules as the existing guard: relative inline links only, external
   schemes and pure `#anchor` links skipped, case-exact resolution, target must stay inside the repo.
   A broken link reds with the file and the link target in the message.
2. **Proof it can red.** In-file negative fixtures under `os.tmpdir()` (the guard's own precedent —
   no `test/prove-red.sh` entry): a broken link in a fixture copy of a root doc reds; the fixed copy
   is green. Nothing is written into the repo.
3. **Scope pinned.** A test that the scanned list includes each named file (so a renamed or deleted
   file shows up as a failure, not a silent skip) and excludes `ai-agents/wiki-vault/`.
4. **Wire it into the right command.** Add it where a docs-only change will run it — lean:
   `npm run test:docs` in `package.json` (one command for "I changed docs"). It is part of
   `npm test` automatically via `test/*.test.js`.
5. **Update `0480`'s table in `CONTRIBUTING.md`** ("### What to run for a change"): the first row
   (`README.md`, `CONTRIBUTING.md`, … ) no longer says "nothing"; it names this check and the command
   that runs it. Keep `ai-agents/wiki-vault/` and `LICENSE` honestly described (still no check).
   Fix the row's "Why" cell ("`reference-integrity` scans `ai-agents/` only") to match.
6. **Open question for the plan gate (owner):** the owner's ruling names six targets. `CLAUDE.md` and
   `AGENTS.md` at the repo root also carry relative links (rough count 9 and 6, 0 broken) and appear
   in no row of `0480`'s table. Recommendation: include them in the same check. The plan asks; it
   does not decide alone.

## Verification steps

1. The new check passes on the live tree; state the number of files scanned and links checked.
2. In a **scratch copy** of the tree, break one relative link in `README.md` and one in
   `claude/README.md`: the check reds, naming each file and target. Revert: green again.
3. The in-file negative fixtures red before the fix they test and are green after (state which).
4. `npm run test:docs` runs the new check (or the plan's chosen command does); time it and state it.
   The new check alone runs in under 1 s.
5. `test/reference-integrity.test.js`'s own tests (including `L7`) are still green; if the plan chose
   to widen that guard instead, the changed tests and the spec-document note are in the diff.
6. `CONTRIBUTING.md`'s table row for the top-level docs names the check; no row still claims these
   files are unchecked.
7. `npm test` green; state the unit pass count and prove-red's final line.
8. `git diff` shows no change under `ai-agents/wiki-vault/`, and no file written by a test.

## Notes
- **Depends on:** `0480` — it creates the `CONTRIBUTING.md` table and `npm run test:docs` this task updates
- **Blocks:** nothing
- **Related:** [`0480`](../../done/0480-run-only-the-checks-a-change-needs-not-the-full-suite-every-time/brief.md)
  (source: plan OQ3 and its worklog's owner rulings);
  `ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md` (the settled
  condition the existing guard transcribes); `0354` (built that guard).
- **Why one brief:** one check over one fixed list of files, plus the one-row doc update that names
  it. The table edit cannot ship without the check, so they are one unit.
- **Not yet scheduled:** on the Backlog board by the owner's ruling. Pulling it into a sprint is the
  owner's call.
- **Consulted:** none at filing.
- Filed 2026-10-04 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  ruling above; it decides nothing beyond that ruling.
