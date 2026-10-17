# Worklog — 0334: the launcher's agents fail-safe must require a usable agent file

Build step, Sprint 12 `/fkit-sprint-ship-loop` run (driver: fkit-lead), 2026-10-16. Worker role: Build,
under the ADR-055 declared-approval marker. The approved plan is `plan.md` in this folder (blob
`5bf76063b13ed485cb9fcba6e809684ad42624b0`, checked with `git hash-object` before building), with the
owner's plan-gate rulings at its end: PC1 + PC2 adopted, PC3 = refuse any symlink, Q1 = ship as scoped
(the follow-up brief is the producer's, filed in parallel — not part of this build).

**A network failure (API `ENOTFOUND`) cut the first Build worker off before it reported back.** A
second Build worker finished the job (2026-10-16) under the owner's re-spawn ruling, *"Re-spawn build
to finish (Recommended)"*, quoted via AskUserQuestion in the fkit-lead session. It redid nothing. It
spot-checked the landed change against the plan and PC1/PC2/PC3 and found no gap: awk `index()`
literal swaps, a `0334/healthy` stays-green guard on each of steps 49–53, and `realpathSync`'d fixture
paths. It then re-ran `npm run test:unit` and the full `bash test/prove-red.sh`; the results are in
the table below. The test file holds 10 tests, which is the plan's list.

## Statements the plan requires

- **A, B and C are refused only on a launch where setup FAILED.** The check sits behind the unchanged
  `setup_ok = 0` gate. With today's init, a symlinked `.claude` (A) or `.claude/agents` (B) makes init
  skip the refresh, warn and exit 0, so `setup_ok` stays 1 and the check never runs. Closing A/B on a
  successful setup is the Q1 follow-up, not this task.
- **The any-symlink strictness is deliberate and owner-ruled** (PC3, "Refuse any symlink
  (Recommended)", 2026-10-16). Semantics (owner-ruled 2026-10-16): refuse ANY symlink on the chain, even
  one inside the project — init's `path_contained` rule; such a layout is already unsupported by init's
  refresh.

## What changed — the hunks to review

0284 was already committed (`b5b46b8`) when this build started, so none of these files carries
uncommitted 0284 work. Every hunk in the files below is 0334's. `ai-agents/sprints/backlog.md` and the
`0521-…` task folder are the producer's parallel Q1 filing — not this build's.

| File | Hunk |
|---|---|
| `claude/fkit-claude.sh` | New `agents_usable` function directly above the guard; the guard now calls it; one comment phrase changed ("no usable fkit agent is on disk"). Plain absence keeps today's two lines byte-identical; every other cause gets the new message naming each path and why. |
| `test/launcher-agents-guard.test.js` | New file, 10 tests: `0334/A`, `B`, `C`, `E`, `F+D`, `unreadable`, `not-a-dir`, `healthy`, `mixed`, `gate`. Runs a copy of `dirname(LAUNCHER)` with init stubbed to exit `$FKIT_STUB_INIT_RC` (default 1). Every fixture dir is `realpathSync`'d at creation (PC2); no assertion was loosened. |
| `test/harness.mjs` | `runFkit(args, { project, extraEnv, launcher = LAUNCHER })` — backward-compatible. |
| `test/prove-red.sh` | Header FORTY-EIGHT → FIFTY-THREE, index lines 49–53, `1…53` in "HOW TO READ A RED"; new `run_agents_guard_suite`; helpers `swap_literal_line`, `check_literal_swap`, `check_healthy_green`; steps 49–53; the `step end` comment. |
| `CHANGELOG.md` | One `## Unreleased` bullet, scoped to "when setup fails". |
| `ai-agents/knowledge-base/architecture.md` | §5.1 flow sketch: one line — setup failed AND no usable agent → refuse, exit 1. |

No file was added under `claude/`, so no manifest regen. No ADR. No wiki write.

## Red-first evidence

The new test file was written first and run against the UNPATCHED launcher (only the harness option
added), 2026-10-16:

```
✖ 0334/A          — AssertionError: claude must not be exec'd
✖ 0334/B          — AssertionError: claude must not be exec'd
✖ 0334/C          — AssertionError: claude must not be exec'd
✖ 0334/E          — AssertionError: claude must not be exec'd
✖ 0334/F+D        — AssertionError: claude must not be exec'd   (the F half; the D half passed)
✖ 0334/unreadable — AssertionError: claude must not be exec'd
✖ 0334/not-a-dir  — AssertionError: the refusal headline is missing   (old guard fires its old message)
✔ 0334/healthy
✔ 0334/mixed
✔ 0334/gate
ℹ tests 10  pass 3  fail 7
```

Exactly the plan's §8 expectation: red at A/B/C/E/F+D/unreadable/not-a-dir, green at healthy/mixed/gate.
After the launcher change: 10/10 pass.

## Checks run

| Check | Result |
|---|---|
| `node --test test/launcher-agents-guard.test.js test/launcher-contract.test.js` | 53/53 pass |
| `sh -n claude/fkit-claude.sh`, `sh -n test/prove-red.sh` | OK |
| `agents_usable` extracted and run under `/bin/dash` in a scratch dir (dangling link + directory; empty dir; healthy; symlinked `.claude`) | refused with both reasons / refused with no reasons / usable / refused "a symlink" — as designed |
| Steps 49–53 alone (scratch driver = prove-red's setup + the 49–53 block) | all five red at their named test, healthy green, gate PASSED |
| Negative check of the new guards (scratch): 49 replaced by `return 0`; 53 given a syntax error | 49 failed on "the D half went red too"; 53 failed on "0334/healthy did not pass" — both guards bite |
| `npm run test:unit`, first worker (load < 8 at start) | 1156 tests, 1155 pass, **1 fail** — `dual-home-parity` "every file is present in BOTH homes": `knowledge-base/.DS_Store — present in ai-agents/, MISSING from claude/scaffold/ai-agents/`. A macOS Finder file (mtime 20:50, gitignored), not created by this build. Not a 0334 failure. The lead later deleted the file on the owner's ruling, "Delete it (Recommended)". |
| `npm run test:unit`, re-run by the second worker after that `.DS_Store` was deleted (confirmed absent) | **1156/1156 pass, 0 fail**, rc 0, 140 s. Load before 7.49 (1-min); after 22.33 — the suite's own parallel run. |
| `bash test/prove-red.sh` (full, run alone, load < 8 at start) | **PASSED** — see below |
| shellcheck | **skipped — not installed.** Not counted as passed. |

**Full prove-red** (second Build worker, 2026-10-16, run alone, after polling until the 1-minute load
fell below 8):

- Verdict line, verbatim: `✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.`
- rc 0. Run time 1519 s (about 25 min).
- Steps 0a–0p all green. Mutations 1–53 all red at their named assertion: 53 of 53. No failed step.
  No `board-narrow` ETIMEDOUT.
- The new steps, verbatim:
  ```
  49. agents check → bare name existence — "0334/F+D" should go RED, its D half stay green ... red
  50. agents check → ls -L — "0334/A" and "0334/F+D" should go RED, "0334/E" stay green ... red
  51. ancestor symlink test dropped — "0334/A" should go RED, "0334/F+D" stay green ... red
  52. readability test dropped — "0334/unreadable" should go RED ... red
  53. setup_ok gate dropped — "0334/gate" should go RED ... red
  ```
- Load averages (1/5/15 min): before 6.98 / 10.39 / 9.80; after 10.75 / 9.94 / 10.81.
- `npm test` as a whole was not run as one command. Its two parts, `test:unit` and prove-red, were
  each run separately above.

## Decision log — obvious-winner calls (none outside the plan)

1. **One shared awk helper for 49–53** (`swap_literal_line`) instead of five inline awk blocks. It is
   exactly PC1's mechanics — replacement line from a file via getline, target found by literal
   `index()`, never a regex. Why it qualified: same behaviour, less to get wrong five times.
2. **An extra WRONG-TARGET guard**: the anchor must match exactly ONE line of the original launcher.
   Needed because the 49/50 mutant line itself contains the anchor (`agents_usable() {`), so the usual
   "un-mutated line survives" grep cannot be used; single-line diff + marker-exactly-once + anchor-once
   cover it. Strengthens PC1's guards, changes nothing else.
3. **Anchors match anywhere in the line (`index() > 0`), not as a prefix**, so a re-indent does not
   disarm a mutation; guard 2 keeps that from hitting a second line.
4. **"0334/healthy stayed green" requires a PASS line**, not just the absence of a fail line — a run
   that never reached healthy would otherwise count as green.
5. **"D's half still passes" (mutation 49) is checked through the assertion text**: the D-half
   assertions in `0334/F+D` carry a `D:` prefix, and step 49 fails if any `AssertionError …: D:` appears.
6. **`0334/mixed` names its bad entries to sort before the good file** (`fkit-a-dir.md`,
   `fkit-b-dead.md`, `fkit-coder.md`), so the check has to walk past both blockers — the case the test
   exists for.
7. **The architecture.md line cites `agents_usable` by name, not by line number** — the sketch's other
   line numbers drift with every launcher edit.
8. **Harness comment for the `launcher` option** says why (reaching the setup-failed paths), at two lines.

Fixes applied without asking under the Process-review discipline: none (this is the Build step).

Second Build worker (re-spawn to finish): no code change, no obvious-winner call — `none`. It edited
only this worklog.

## Process review, round 1 — decision log (Process-review worker, 2026-10-16)

Under the ADR-055 declared-approval marker (caller `fkit-sprint-ship-loop`, driver fkit-lead; plan blob
`5bf76063…` re-checked with `git hash-object`). Every item below was applied without asking, under the
standing approval. Launcher untouched; `plan.md` / `plan-review.md` untouched.

1. **R1 → prove-red mutations 54 and 55 (obvious winner within the plan's intent).** What changed:
   `test/prove-red.sh` — step 54 swaps the leaf `if [ -L "$_a" ]; then` for `if false; then` and must
   red `0334/C` and `0334/E`; step 55 swaps the ancestor `elif [ -e "$_p" ] && [ ! -d "$_p" ]; then`
   for `elif false; then` and must red `0334/not-a-dir`; both through `swap_literal_line` +
   `check_literal_swap` + `check_healthy_green` (PC1 mechanics). Header FIFTY-THREE → FIFTY-FIVE,
   index lines 54–55, `1…55`, block title, `step end` comment; `test/launcher-agents-guard.test.js`
   header "mutations 49–53" → "49–55". Why it qualified: R1 verified CORRECT at
   `claude/fkit-claude.sh` (`agents_usable`, the two branches named); test-only and localized; plan §6
   pairs each branch of the check with a named mutation, and these are two branches it left unpaired
   (0284 precedent: mutation 48 added the same way). **55 goes one step past the reviewer's suggested
   fix** (it proposed only 54) because R1's claim names the not-a-dir branch too; same mechanics, one
   more ~5 s suite run in prove-red. If the lead or owner wants only 54, delete step 55 and its index
   line and set the header to FIFTY-FOUR.
2. **R2 → CHANGELOG bullet reworded** (verified CORRECT, mechanical, in plan §7). What changed: the
   `## Unreleased` 0334 bullet now reads "any symlink on the way (a symlinked `.claude`,
   `.claude/agents` or agent file, working or dangling), a directory, or an unreadable file". Why: as
   written it implied a working symlinked agent file still launches, against the PC3 ruling.
3. **Ledger header `Status:` → `closed-out`** — both findings fixed, nothing blocking, nothing
   re-litigated (the skill's Step 6 rule; 0284 precedent).

Evidence: scratch driver (prove-red's setup lines + helpers + steps 54–55 only) → `54 … red`,
`55 … red`, gate PASSED; negative run with each mutant line reset to the original → both steps fail
"did NOT catch" (guards bite; its kept dir removed). `node --test test/launcher-agents-guard.test.js
test/launcher-contract.test.js` 53/53. `sh -n test/prove-red.sh` OK. Load (1-min) 7.00 at start, 8.62
before the last run. Not run here: full prove-red, `npm test` — the lead's final Verify.

## Dogfood refresh

`claude/fkit-claude-init.sh .` ran (rc 0): refreshed 7 agents and 28 skills into `.claude/`.
`git status --porcelain` was identical before and after — init changed no tracked file. The launcher
(`claude/fkit-claude.sh`), the only canonical `claude/` file touched, has no dogfooded copy under
`.claude/`, so there is nothing to `cmp`.

## Not done / residuals

- A/B on a launch where setup succeeds; the guard checks "any agent", not "this role's agent" — the Q1
  follow-up (being filed by the producer).
- No folder-slug rename (the brief's open question; not put to the owner).
- shellcheck not run (not installed).
