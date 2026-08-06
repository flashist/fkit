# Implementation plan — task 0182: `test/closed-rank-immutability.test.js`

Built against **§"✅ DECIDED 2026-08-06"** of the brief (the buildable spec), never §"The condition". Planning done in a spawned consult — prose planning-only contract honored; nothing written.

## Re-measured ground facts (2026-08-06, this session — the brief requires re-measurement before building)

| Fact | Brief's value | Measured now | Movement |
|---|---|---|---|
| `\| Status \| Priority \| Task \| Brief \|` header count per board file | exactly 1 × 4 files | exactly 1 in each of `sprint-3.md`, `done/sprint-1.md`, `done/sprint-2.md`, `backlog.md` | none |
| `done/sprint-2.md` Status-table rows | 189 (188 closed, 1 open) | 189 rows, **189 closed, 0 open** | ⚠️ the one open row (`0185`) has since closed |
| Decoy addendum rows with BOTH a brief link AND a `P<n>` cell | 7 | 7 | none |
| `0169` bare unescaped `\|` in a code span (`` `Status: in-review \| closed-out` ``) | present | present | none |
| 0174 filing commit | (unnamed) | **`8540d03`** (2026-08-01); parent **`ba36196`** (= `8540d03~1`) lacks the `0174` row | pinned |
| The eight renumbered rows across that commit | exactly `0151/0147/0150/0157/0161/0148/0159/0160` | confirmed, exactly those eight: `0151` P123→P124, `0147` P125→P126, `0150` P126→P127, `0157` P130→P131, `0161` P131→P132, `0148` P132→P133, `0159` P140→P141, `0160` P141→P142 | none — and no ninth |
| `0181` landed | required | brief in `tasks/done/`; both rule clauses on disk in `claude/skills/fkit-task-brief/SKILL.md` ("contiguous run of open rows"; "NEVER renumbered") | confirmed |
| `0214`/`0215` status | open, not on Sprint 3 | both in `tasks/backlog/`; neither on the Sprint 3 board | confirmed |
| prove-red mutations reaching `ai-agents/` | 0 of 14 | 0 of 14 (all via `FKIT_LAUNCHER`/env seams or `claude/`+`test/` copies) | none |
| Escaped-`\|` rows | 7 rows (8 total mis-fielders incl. `0169`) | 10 *lines* in the file contain `\|`; per-row count not re-derived | not verified to the row — parser handles the class generally; exact count re-taken at build |
| Leg-1 greenness today | n/a | spot-checked: current uncommitted rollover transition shows **zero** rank changes on closed rows for both renamed boards | green expected |

## Files

- **NEW** `test/closed-rank-immutability.test.js` — everything (pure functions + fixture tests + live git-leg tests) in one file, following `test/task-id-uniqueness.test.js`'s precedent. Picked up by `npm test`'s existing `node --test test/*.test.js` glob — **no `package.json` change**.
- **NEW** `test/fixtures/closed-rank-0174-before.md` — byte-exact `git show ba36196:ai-agents/sprints/sprint-2.md` (322,634 bytes).
- **NEW** `test/fixtures/closed-rank-0174-after.md` — byte-exact `git show 8540d03:ai-agents/sprints/sprint-2.md` (350,035 bytes).
  Committed fixtures rather than runtime `git show`: a depth-1 clone does not have those commits, and the fixture test must run everywhere the suite runs. Provenance (both SHAs) recorded in test-file comments — never inside the fixture bytes. `test/fixtures/` is inert to the `test/*.test.js` glob and rides along harmlessly in prove-red's `make_repo_copy`.
- **Touched: nothing else.** No board, no skill, no `prove-red.sh`, no devDependency, no wiki.

## Design

**1. Parser — `parseBoard(text, sourceName)` → `[{id, status, rank}]`, throws on malformation.**
- Anchor: find the `## Status` heading, then the exact header row `| Status | Priority | Task | Brief |`; consume the separator row, then contiguous `|`-prefixed lines until the first non-table line. Throw (naming `sourceName`) if the header appears 0 or ≥2 times in the file — decoy tables (7 live ones carry both a brief link and a `P<n>` cell) make any line-shape regex unsafe; the anchor is the required defense.
- Cell split: first mask escaped `\|`, **and mask pipes inside backtick code spans**, then split on `|`. Then the fail-loud rule as the load-bearing half: any row not yielding exactly the 4-cell shape **throws** naming the source and the row — never skips. (⚠️ Stated assumption: the brief demands fail-loud on unexpected field count *and* a green live run; the `0169` row's bare in-span pipe means both hold only if code-span pipes are masked. Masking is therefore in-spec, with the throw as the backstop for every shape masking doesn't cover.)
- Per row: `status` = cell 1 trimmed; `rank` = cell 2, must match `^P\d+$` (throw otherwise — sprint boards are ranked; `—` never appears there); `id` = the `NNNN` from the brief-link cell's `/<NNNN>-…/brief.md` path (throw if absent). Closed ⇔ status **starts with** `✅ Done`, `⛔ Cancelled`, or `➡️ Moved` — same reading as report §1.1.

**2. Comparator — `findRankViolations(earlierText, laterText, boardBasename)` → `[{id, board, oldRank, newRank}]` — the pure, exported-in-file function the fixtures feed.**
- Join strictly within one basename on folder ID (the `(board basename, folder ID)` key is realized structurally: only same-basename pairs are ever compared, so a cross-board join cannot exist — rank is never a key). For every row closed in *earlier* that appears in *later* with a different `P<n>`: violation.
- `➡️ Moved` rule: a moved row is closed on its **source** board, so its source rank is frozen by the ordinary same-board comparison; the destination board's row is a different join key and is never compared against it. Stated in a code comment.
- Stated reading (comment in code): a closed row **absent** from the later revision is not flagged — the invariant text is "appears with a different rank"; row deletion is a different breach and a different guard.
- Duplicate folder ID within one board's table: throw (ambiguous join).

**3. Board discovery.** `readdirSync` over `ai-agents/sprints/` and `ai-agents/sprints/done/`, filtered to `^sprint-.*\.md$` — covers both homes; **excludes `backlog.md` by construction, with the stated reason in a comment** (unranked by design; every Priority cell reads `—`, so it has no rank to hold still). HEAD-side listing via `git ls-tree -r --name-only HEAD -- ai-agents/sprints/`, same filter. Boards keyed by **basename**, so the archival rename (`sprint-2.md` → `done/sprint-2.md`) is transparent — the "moved, not frozen" note is honored: archived boards stay watched. A basename present at both paths in one revision: throw. A board with no counterpart in the other revision (new board, e.g. untracked `sprint-3.md` at leg 1 today): nothing to compare, by definition.

**4. Git legs — thin shell around the pure core, parameterized by `repoRoot` (default `REPO` from `harness.mjs`).** `execFileSync('git', …, {cwd: repoRoot})`.
- **Environment gates, in order:** not a git work tree (`git rev-parse --is-inside-work-tree` fails) → **skip with stated reason** (node:test `t.skip(…)` — reported as skipped, never a silent pass); repo with zero commits (`git rev-parse --verify HEAD` fails) → skip with stated reason; `HEAD^` absent (`git rev-parse --verify --quiet 'HEAD^'` fails — depth-1 clone) → **skip leg 2 only**, with stated reason, leg 1 still runs. Any *other* git failure (e.g. `git show` erroring on a listed path) throws — a crash is distinguishable from a skip, and neither is a pass.
- **Leg 1:** for each basename present in both HEAD and the working tree: earlier = `git show HEAD:<headPath>`, later = `readFileSync(<worktreePath>)` (read-only; the guard never writes under `ai-agents/`). **Leg 2:** earlier = `HEAD^` blob, later = `HEAD` blob, same basename join.
- **Vacuous-pass assertion** (precedent: `task-id-uniqueness.test.js`): each live leg asserts the total closed-row count parsed from its earlier revision is **non-zero** (derived at runtime, never hardcoded — today ~203 across three boards), so a parser change can never go green over a corpus it stopped reading.
- **Failure output:** `assert.deepEqual(violations, [])` with a message listing one line per violation — `<id>: <oldRank> → <newRank> (<board basename>)` — plus the closed-marker rule and a pointer to the brief. Names folder IDs with old and new rank, per spec.

**5. Tests** (all fixtures under `os.tmpdir()` via `harness.mjs`'s `cleanup`; the repo is opened read-only):
- *Parser:* anchor finds the one real table and ignores the decoy shapes (synthetic board with an addendum table carrying link+`P<n>`); 0-header and 2-header files throw; escaped-`\|` rows field correctly; a code-span bare pipe fields correctly; a genuinely malformed row throws naming board+row (the anti-vacuous-skip proof); a `—` or missing rank throws; empty table parses to zero rows.
- *Comparator:* clean transition → no violations; closed-row rank change → flagged with old/new; **the step-2 proof** — a closed row's rank changes and another (open) row takes its old rank: the closed row is flagged, the taker is not; two closed rows swap ranks → both flagged; an open row re-ranked → not flagged; a row that *closes* between revisions → not constrained; a closed row whose status text mutates (e.g. gains the agent-closed marker) but keeps rank → not flagged; same ID on two basenames at different ranks → no violation (the Moved rule / basename key).
- *The 0174 replay (rewritten verification step 3):* feed the two committed fixture revisions to the comparator; assert the flagged set is **exactly** `0151, 0147, 0150, 0157, 0161, 0148, 0159, 0160` — no more, no fewer — with the measured old→new ranks (P123→124, P125→126, P126→127, P130→131, P131→132, P132→133, P140→141, P141→142).
- *Git-leg plumbing, against throwaway `git init` repos in tmpdir* (git invoked with `-c user.name/-c user.email -c commit.gpgsign=false` so CI-less machines commit cleanly): a non-git tmpdir → skip path taken with its reason; a 1-commit repo → leg 2 skips, leg 1 runs; **the in-suite red proof** — a tmp repo whose working tree re-ranks a closed row makes the parameterized checker report exactly that violation (this is the mutation seam correction 10 says the pure-function-plus-tmpdir-fixture shape supplies).
- *Live corpus:* leg 1 (working tree vs HEAD) and leg 2 (HEAD vs HEAD^) over the real repo — expected green (leg 1 spot-checked green on today's uncommitted rollover), each with the non-zero closed-count assertion.

## The unrecorded prove-red dependency — recommendation: **state the gap explicitly** (option B), do not sequence after 0214/0215

Verified: none of `prove-red.sh`'s 14 mutations reaches `ai-agents/`, its header states it walks "the real, untouched `ai-agents/` live home", and prove-red must never edit the real boards. `0214`/`0215` are open, **unscheduled** backlog tasks — not on the Sprint 3 board. Reasoning for B:
1. Sequencing a Sprint-3 `P2` task the owner pulled in by name behind two unscheduled backlog tasks inverts the owner's expressed priority.
2. The evidence a prove-red mutation would buy — proof the assertion can go red at its named place — is delivered **in-suite** by the tmp-git-repo breach test and the 0174 fixture replay, without touching real boards. A copied-tree seam (mutation-14 style) cannot even work here: a copied `ai-agents/` has no `.git`, so the guard would *skip* in the copy, not red.
3. Building a proper ai-agents mutation seam is exactly the design ground 0214/0215 own; bolting a half-seam into this task widens its scope into theirs.

**The gap, stated for the record (and to be restated in worklog + close report):** `prove-red.sh` gains **no** mutation for this suite; named-assertion mutation coverage arrives if/when 0214/0215 land. Until then the red proof for this guard lives inside the suite itself. Verification step 6 is met as: `npm test` (including prove-red's untouched hard gate) green, plus the in-suite red demonstrated and its output reported.

## Sequencing

1. Extract the two fixture files from git (`ba36196` / `8540d03`), byte-exact, into `test/fixtures/`.
2. Write the test file: pure functions → parser tests → comparator tests → 0174 replay → tmp-git plumbing tests → live legs.
3. Run `node --test test/closed-rank-immutability.test.js`; then full `npm test` (unit glob + prove-red hard gate — prove-red re-runs the whole suite ~3 more times, so the new file must stay cheap: ~8 git calls on the live legs plus a few tmp-repo fixtures; if it adds more than a few seconds, trim tmp-repo commits).
4. Re-take the row-level pipe measurements during build and report any movement.
5. `grep -E '\.md:[0-9]'` over changed files → must return nothing (no `:NNN` citations; cite by heading + quoted phrase).

## Verification mapping (brief's 8 steps)

1. File exists, picked up with no `package.json` change ✓ (glob). 2. Join-on-ID proof ✓ (rank-taker test). 3. 0174 replay, exactly eight, list reported ✓ (fixture test). 4. Green under baseline=HEAD; baseline and why stated in close report ✓. 5. Missing-history skip with stated reason, no silent pass, no crash ✓ (skip-path tests). 6. `npm test` incl. prove-red green; red run reported from the in-suite breach test; **prove-red mutation gap stated explicitly** ✓ (recommendation above). 7. All four ceiling limits in the close report, **with limit 2 and 4 in their corrected forms** — including: no CI, the guard sees only the current uncommitted transition plus the last committed one, a breach committed with no test run in that window is never caught, ⛔ never presented as continuous protection ✓. 8. `:NNN` grep clean ✓.

## Edge cases and risks

- **Live leg 1 red at build time** would mean either a real in-progress breach (surface to owner immediately — that is the guard working) or a parser defect; spot-check today says green, but the tree may move before build.
- **`0185`'s closure** shifted the closed count (189/189 now) — affects only the derived non-zero assertion, which is why it is derived, never hardcoded.
- **Fixture weight:** ~672KB of committed fixtures (both full revisions). Full files chosen over trimmed tables for byte-exact provenance and because they exercise the header anchor against a real historical file. Flagged for approval below.
- **prove-red interplay:** the new file runs inside every `run_suite()` invocation with `FKIT_LAUNCHER` pointing at mutant copies — it ignores that env var and reads the real repo, so it stays green there by construction; mutation 2's "red only at assertion 2" check is unaffected.
- **git identity in tmp repos:** handled via `-c` flags, so the plumbing tests pass on machines with no global git config.
- **Renamed-board ambiguity** (same basename at both paths in one revision) throws rather than guessing.

---

## Approval record (written by the driver, fkit-sprint-ship-loop)

- **Approved by the owner via `AskUserQuestion`, live `fkit lead` session, 2026-08-06** — verbatim answer: **"Approve (Recommended)"**.
- **Prove-red dependency ruled in the same exchange** — verbatim answer: **"State the gap (Recommended)"** — ship now; no prove-red.sh mutation for this suite until 0214/0215 land; in-suite red proof + 0174 fixture replay carry the red evidence; gap stated in worklog and close report.
- **Fixture form ruled** — verbatim answer: **"Yes, full files (Recommended)"** — commit the two full byte-exact board revisions (~672KB) under `test/fixtures/`.
- **Both flagged readings ratified** — verbatim answer: **"Ratify both (Recommended)"** — (1) code-span pipes masked before the field split, throw as backstop; (2) a closed row deleted from the later revision is not flagged (deletion is a different breach and a different guard); both recorded in code comments.
- Plan text above is the coder worker's returned plan, copied verbatim by the driver at approval, before the Build spawn (per the sprint-ship-loop's durable-artifacts rule).
