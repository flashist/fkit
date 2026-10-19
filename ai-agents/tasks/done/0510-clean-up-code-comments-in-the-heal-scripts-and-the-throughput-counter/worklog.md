# Worklog — 0510: comment cleanup of the `/fkit-heal` scripts and the throughput counter

- **Step:** Build, spawned by `fkit-sprint-ship-loop` (driver: `fkit-lead`), Sprint 12 run, under the
  ADR-055 declared-approval marker. Plan: this folder's `plan.md`, blob `f3710201` (checked with
  `git hash-object` before any edit — it matched the carried pointer; 23889 bytes).
- **Owner approval relayed:** `AskUserQuestion` in the `fkit-lead` session, 2026-10-17 — PC-1 "Keep it
  (Recommended)", Q-A "File a backlog brief (Recommended)", M4k note "Yes, add a note (Recommended)",
  plan "Approve (Recommended)". PC-1 is built: `throughput.mjs`'s T3 line 2 carries `node >= 18`.
- **Not this build's work:** the Q-A brief (`0525`) and the M4k notes in the later units' briefs — a
  producer's, done in parallel.
- **Nothing committed or pushed.** No init run; no `.claude/` copy edited. `plan.md` and
  `plan-review.md` untouched. Files edited: the 3 in scope, and this worklog.

## Method for the series

The method is `0507`'s worklog, section "Method for the series" (M1–M4j, as amended through 0507
review R9), applied as written. This unit adds one amendment, **M4k**, for `0508`, `0509` and
`0511`–`0515`.

**Who decided what.** The plan chose M4k (plan §2); the owner approved the plan and chose to have a
producer put a one-line note about M4k in the later units' briefs ("Yes, add a note (Recommended)",
2026-10-17, `AskUserQuestion` in the `fkit-lead` session).

### M4k — text fences
M3 proves the code did not change. It cannot see comment text. But a test can read a source file as
text, and then comment words matter.

1. **Before editing a file,** grep its name across `test/`, `bin/` and `claude/` (`test/prove-red.sh`
   included). Read every hit for code that reads the file as text: `readFileSync` (also through a
   variable or a loop, e.g. `for (const script of [CHECK, REPAIR])`), or shell `grep`, `sed`, `awk`,
   `cat` on it. Two reads do not name the file (added by 0510 review R1):
   - **A path constant.** When a hit defines an exported constant for the file (e.g.
     `test/harness.mjs`'s `export const INIT = join(REPO, 'claude', 'fkit-claude-init.sh')`, and
     `LAUNCHER`), grep the constant's name across `test/` too, and read those hits the same way.
     Search: `grep -rnE '^export const [A-Z_]+ *=' test/ bin/ claude/`, then
     `grep -rlwE '<NAME>' test/ | xargs grep -nE 'readFileSync\((<NAME>)'`.
   - **A function's own source.** `.toString()` on an imported function reads the text of the file
     that defines it (e.g. `test/reference-integrity.test.js`'s
     `const ours = maskFencesAndQuotes.toString()`, the copy in `test/link-condition.mjs`). Search:
     `grep -rnE '\b[A-Za-z_$][A-Za-z0-9_$]*\.toString\(\)' test/ bin/ claude/`; read each hit (most
     are a Buffer or a number, not source).
2. **List each fence and its kind:**
   - **must-not-contain** — no new comment may add the token;
   - **must-contain** and **exact-count** — deleting comment text can break these: keep the counted
     text, or prove the count sits on code;
   - **byte-equal to another copy (parity)** — a test compares a function body with its hand-made
     copy elsewhere (e.g. `maskFencesAndQuotes` in `test/link-condition.mjs` and in
     `test/coordination-citation-policy.test.js`). Any comment added, changed or deleted inside
     either body goes red: change both copies the same way, or leave the body's comments alone.
3. **After each file's edit,** re-run each fence's own pattern on the edited file. The test run is the
   final proof.
4. A fence that pins a token's absence for safety reasons (here 0246's residual R8) also governs the
   words a new comment may use: check the residual's list, not only the test's regex.

**This unit's fences** (`test/structure-repair.test.js`):

| Fence | Kind | Over | Result after the edits |
|---|---|---|---|
| `/\b(rm\|mv\|unlink\|rmdir)\b/` | must-not-contain | `check.sh`, `repair.sh` (the `for … of [CHECK, REPAIR]` loop) | no match in either (`/usr/bin/grep -nwE 'rm\|mv\|unlink\|rmdir'` and the test's own regex in node) |
| `/> *"\$root\//g` = 1 | exact-count | `repair.sh` | 1 — on code: step (g)'s `printf '%s' "$repl" > "$root/$p"`; no comment carries it |
| `/mktemp\|>>/` | must-not-contain | `repair.sh` | no match |
| 0246 review residual R8: no `cp`/`dd`/`tee`/`ln`/`truncate` | must-not-contain (record, not a test) | new comment lines in both scripts | none (`grep -w` over the added lines) |

`throughput.mjs` has no text fence: `test/throughput-counter.test.js` imports it and runs it with
`spawnSync`; nothing reads its bytes. `dashboard-contract.test.js`'s `readFileSync(SCRIPT)` is
`dashboard.sh`.

## Baseline (before any edit, 2026-10-18)
- All 3 files equal to HEAD (`cmp` against `git show HEAD:<file>`); `git diff HEAD --stat` on them empty.
- `ai-agents/knowledge-base/architecture.md` carried a **pre-existing** 2-line diff: `0507`'s two
  re-anchored cites (`skills-for-role.sh`, `skill-ownership-hook.sh`). Not this task's; this task does
  not touch `architecture.md`.
- Tools (bash 3.2.57, node v24.13.0), HEAD copies: `check.sh` `norm` 18365 bytes, `repair.sh` 16983,
  both `norm` and `bash -n` exit 0; `throughput.mjs` token hash `fd0a7d56…` (3236 tokens), AST hash
  `8b114a84…`, `node --check` ok.
- M4h on HEAD: 30 comment runs over 2 lines (check.sh 7, repair.sh 8, throughput.mjs 15); no comment
  line over 110 columns.
- `node --test test/*.test.js` (load 7.78 at start) → 1156 tests, **1156 pass, 0 fail**.
- `bash test/prove-red.sh`, alone (load 7.57 at start) → exit 0, "✓ hard gate PASSED": baselines 0a–0p
  16 green, mutations 1–55 all 55 red, no `✗` line.

## V1 — Comments only
**Primary check (M3), final tree vs HEAD:**
- `check.sh`, `repair.sh`: `norm` exit 0, non-empty, byte-identical to HEAD (18365 and 16983 bytes);
  `bash -n` exit 0 both sides.
- `throughput.mjs`: raw-token hash `fd0a7d56…` (3236 tokens) and AST hash `8b114a84…`, both equal to
  HEAD; `node --check` exit 0. The AST compare covers the deleted multi-line `/** … */` blocks (ASI).
- **Rule-4 check** (`rule4.sh`, X1 pattern) on all 3: line 1 equal; no directive line among the changed
  lines (the four `# shellcheck disable=SC2046` in `repair.sh` and two in `check.sh` are untouched);
  `git diff HEAD --summary` prints no mode change (all three stay 100644).

**Secondary check (the brief's line grep, R1 block filter):**

```bash
git diff -U0 -- claude/skills/fkit-heal/check.sh claude/skills/fkit-heal/repair.sh \
  claude/skills/fkit-status/throughput.mjs | /usr/bin/grep -E '^[-+]' | /usr/bin/grep -vE '^(\+\+\+|---) ' \
  | /usr/bin/grep -vE '^[-+][[:space:]]*(#|//|/\*|\*([[:space:]/]|$)|$)'
```

It prints exactly 4 lines — the two exceptions the plan names, a trailing comment deleted:

| File | Function / line | Change |
|---|---|---|
| `repair.sh` | `synthesize`, markerless branch: `cat "$sf"` | trailing `# markerless untouched-stale: whole-file replace (Q1)` deleted (the comment above the function now says it) |
| `throughput.mjs` | `foldTransitions`, the `'A'` branch: `st.closed = week; closed += 1; bump(week, 'closed', rec.commit);` | trailing `// born closed — case 1` deleted (the new comment above `if (rec.status === 'A') {` says it) |

The parser checks above prove the code part of both lines unchanged.

**Prove-red (M4f).** Only Mutation 29 touches these files. Its sed matches the whole line
`      if (from.segment === to.segment) {`: that line is byte-identical, has no trailing comment, and no
comment contains `from.segment === to.segment`. Dry run of its sed on the edited file: exactly 1 line
changed. Steps 0n and 29 are green / red in the final run (V2).

**Behavioural equality (plan step 4)** — HEAD copies (from `git show`) vs the edited files, both run on
this repo, stdout **and** stderr compared with `cmp`:

| Run | Exit (both) | Result |
|---|---|---|
| `bash check.sh --share <repo> <repo>` | 1 | identical, 55 stdout lines |
| `bash repair.sh propose --share <repo> <repo>` (each beside its own `check.sh`) | 0 | identical — "nothing repair-eligible" (this repo has no untouched-stale row; `test/structure-repair.test.js` covers propose items and apply) |
| `node throughput.mjs --repo <repo>` | 0 | identical, 34 lines |
| `node throughput.mjs --repo <repo> --list` | 0 | identical, 214 lines |

## V2 — Tests
Ran, each alone, the 1-minute load average below 8 before each:
- The 4 suites the plan names (`structure-check`, `structure-repair`, `structure-notice`,
  `throughput-counter`), after all 3 edits: 93 tests, **93 pass, 0 fail**.
- Full `npm test`, in its two halves: `node --test test/*.test.js` (load 6.05 at start) → 1156 tests, **1156 pass, 0 fail** (same as baseline); `bash test/prove-red.sh`, alone (load 7.56 at start) → exit 0, **"✓ hard gate PASSED"**: baselines 0a–0p 16 green (0n, the unmutated throughput copy, green), mutations 1–55 all 55 red (29 red at "migration-is-not-a-close"), no `✗` line, no `board-narrow` timeout.
- After this worklog: `npm run test:docs` → 410 tests, **410 pass, 0 fail** (includes `reference-integrity` and `coordination-citation-policy`).

Skipped: live `/fkit-heal` and `/fkit-status` session runs — step 4 above compares the real output
instead. The loop's own Verify step re-runs the full suite.

## V3 — Count
Command, both times: `/usr/bin/grep -cE '^[[:space:]]*(#|//|\*|/\*)' <file>` (counts the shebang too).

| File | Before | After |
|---|---|---|
| `claude/skills/fkit-heal/check.sh` | 120 | 51 |
| `claude/skills/fkit-heal/repair.sh` | 129 | 46 |
| `claude/skills/fkit-status/throughput.mjs` | 194 | 43 |
| **Total** | **443** | **140** |

## V4 — Nothing lost
**Reasons moved into the knowledge base: none.** Every long reason already had a durable home (M1
item 1), or fit in 1–2 lines; no report, convention or ADR addendum was written.

**Pointer table — every pointer in the new and changed comments, checked by hand (M4e):** `ls` the
file, `grep` the heading / ID, read the passage.

| File | Pointer | Target checked | Holds the reason? |
|---|---|---|---|
| check.sh, repair.sh | ADR-017 rule 2 | ADR-017 §Decision rule 2: "Invocation is `bash <path>`, never `./<path>` — and never a shebang relied upon"; the exec bit does not survive | yes |
| check.sh | ADR-039; 0245 plan §2 | ADR-039 §Decision 1 (the scoped grant); 0245 plan "## 2. `check.sh` contract": "Read-only, structurally" and the per-row outcomes | yes |
| check.sh | ADR-017 (a script, not prose) | ADR-017 §Decision: byte mechanics go in a shipped script | yes |
| check.sh | ADR-017 rule 4 (stdout is the test contract) | rule 4: shipped executables are in the test suite; pure, deterministic output | yes |
| check.sh | 0245 plan §2 (outcomes) | §2 "Per-row outcomes — exactly the report-§7 classes" plus the refusal/annotation set | yes |
| check.sh | structure-manifest.tsv's header; ADR-017 rule 3 | `claude/structure-manifest.tsv` "The hashing contract — CONSUMERS MUST APPLY THE SAME TRANSFORMS" (steps 1–3); rule 3 "`bash`, and nothing more" | yes |
| check.sh | test/structure-check.test.js pins parity | the file exists; its parity cases (e.g. the R2 elision case) | yes |
| check.sh | 0245 plan §3 (verdict) | "## 3. The hashing pipeline and the classification precedence": installed hash → conforming, manifest row → untouched-stale, nothing → owner-edited | yes |
| check.sh | 0245 review R6 | R6 unique in the findings table: present-but-broken sha tool, empty/garbage hash | yes |
| check.sh, repair.sh | 0245 review R1 | R1 unique: awk truncates at `\0`; an edit after a NUL is invisible | yes |
| check.sh, repair.sh | structure-spec.md "Machine-read contract — pinned" | `claude/structure-spec.md`, the blockquote "**Machine-read contract — pinned.**" over the two inventory tables | yes |
| check.sh | 0245 review R5 | R5 unique: spec paths never validated project-relative; `../..` escapes `$root` | yes |
| check.sh | 0245 plan §2, "Keep-out" | §2 "**Keep-out:**": init's parser semantics; unreadable/symlinked/directory → fail closed, root files still checked | yes |
| check.sh | 0245 review R3 | R3 unique: a symlinked `ai-agents/` had its keep-out read through the link | yes |
| repair.sh | ADR-039 | §Decision 1 (replacement only) and 2 (consent model) | yes |
| repair.sh | SKILL.md (apply's output and exit codes) | `claude/skills/fkit-heal/SKILL.md` step 5: per-path apply output; "Exit `0` all applied, `1` any refusal or error, `2` could not run" | yes |
| repair.sh | ADR-039 Decision 1; Decision 2 (consent never stored) | §Decision "### 1. The scoped grant", "### 2. The consent model" | yes |
| repair.sh | "the repair test pins both by word match only" | `test/structure-repair.test.js`, the two fence tests (M4k above); 0246 review residual R8 records that they are token-shaped | yes |
| repair.sh | 0246 plan §1; worklog decision log item 3 | plan "## 1. Shape": helper duplication deliberate, mirror-rot guarded by the apply→check fixture; worklog "## Decision log" item 3: the spec-table parse duplicated too | yes |
| repair.sh | 0245 review R6 | as above | yes |
| repair.sh | 0246 plan §2; 0246 plan, ruling Q1 | "## 2. Replacement content": reference file = scaffold copy, root file keeps its marker region; "Q1 RULED: include, whole-file replace" | yes |
| repair.sh | 0246 review R5 | R5 unique: a failed diff left an approvable item with no diff | yes |
| repair.sh | 0246 review R7 | R7 unique: a signal mid-write left no announce line | yes |
| repair.sh | 0246 review R1, R6 | R1 (bytes written never hashed before the write), R6 (lost intermediate rc), each unique | yes |
| repair.sh | 0246 worklog, decision log item 1 | "## Decision log" item 1: `synthesize > target` truncates the target first; found live; buffer with an `x` sentinel. (The round-1 decision log numbers from 7, so "item 1" is unambiguous) | yes |
| repair.sh | 0246 review R2-R4; "that review's residuals" | R2 (hardlink), R3 (symlink swap), R4 (freshness window), each unique; "## Accepted residuals": "R3 core" and "R4 core" races at the write instant | yes |
| throughput.mjs | ADR-017 rule 2; 0359 worklog D2 | rule 2 as above; D2 "the `/fkit-status` draft ships with `bash` corrected to `node`" | yes |
| throughput.mjs | 0359 plan §7, ruling W6 | "### 7. The `/fkit-status` amendment" (the snapshot ban); OWNER RULINGS row W6 "Approve the draft" | yes |
| throughput.mjs | ADR-014 (no dependency) | ADR-014 §Decision "### 4. Zero devDependencies, no lockfile, no `node_modules`" | yes |
| throughput.mjs | 0359 plan, ruling W5 | W5: "The `--worktree` alternative was refused: it would stop the headline number being a git-history figure" | yes |
| throughput.mjs | 0359 plan §6 | "### 6. Output shape — a new producer, not a change to the old one": its own markers, so no dashboard parser sees a new token | yes |
| throughput.mjs | 0359 worklog D1 | D1: the verb set pinned by reading rows (nine, not eight) | yes |
| throughput.mjs | 0359 plan §3 | "### 3. Pinned definitions": "`%G-W%V` … is strftime-and-platform-dependent. I will not rely on it" | yes |
| throughput.mjs | ADR-029; 0359 plan, ruling W2 | ADR-029: a task is a folder keyed by a permanent `NNNN`; W2: per-week counts exact, per-ID drill-down unavailable pre-migration | yes |
| throughput.mjs | 0359 worklog D4; 0359 review R5 | D4: the guard's measured effect corrected (no spike; it matters where the carry cannot fire); R5 unique: the header's wrong number | yes |
| throughput.mjs | 0359 review R1 | R1 unique: pathspec resolved against the caller's cwd → all-zero report | yes |
| throughput.mjs | 0359 plan §0.3; 0359 review R2 | "**0.3 ⛔ A pathspec narrowed to `done/` silently destroys rename detection**"; R2 unique: rename detection not forced | yes |
| throughput.mjs | 0359 review R4 | R4 unique: `ls-tree -d` fabricated a share pre-migration | yes |
| throughput.mjs | 0359 review R3 | R3 unique: the migration note printed a false "zero closes" | yes |
| throughput.mjs | 0359 review R9 | R9 unique: `--at --list` bound the flag as a value | yes |
| throughput.mjs | 0359 worklog D3 | D3: "fixed a silent no-output bug in the script's direct-invocation guard" | yes |

Uniqueness (M2): in `0245`, `0246` and `0359`'s `review.md`, each cited ID appears exactly once in the
*Reviewer findings* table (single-round ledgers), so no pointer names a round.

**Spot-check help for the reviewer (V4 asks for ≥ 5):** the deleted text is in `git diff`. Suggested:
`check.sh`'s 45-line hashing-pipeline and precedence copy (manifest header; 0245 plan §3); its
"THE ONE EXCEPTION" bullet (0245 plan §2 "Keep-out", now in the keep-out comment); `repair.sh`'s
(a)–(g) list (each step keeps its own comment); its 12-line step (e) history (0246 review R1/R6, 0246
worklog item 1); `throughput.mjs`'s 40-line `foldTransitions` JSDoc (three cases moved to their
branches; the measured analysis is 0359 worklog D4); its "READING ALL 129 OPEN ROWS" paragraph
(0359 worklog D1).

## V5 — Inbound references
Searches, re-run at build time:
- **S1** — `path:NNN`, `#L` and "line N" cites to `check.sh`, `repair.sh`, `throughput.mjs`, whole repo
  (closed task folders and dated reports filtered out as frozen).
- **S2** — the same names followed within 80 chars by `header|comment|own words|warning block`, over
  `claude test bin`, the knowledge base, open briefs, the wiki and the top-level docs.
- **S3a** — about 65 distinctive phrases of the deleted comments (e.g. "READ-ONLY IN EVERY BRANCH",
  "THE ONE EXCEPTION", "last-instant gauntlet", "A PROXY, PERMANENTLY", "THE THREE CASES",
  "HARDCODED LIST OF TWO FILENAMES", "PORTABILITY"), whole repo.
- **S3b** — every deleted or changed comment line, cut into 30-character windows at every 3rd offset
  (6278 pieces), matched against every line of `claude test bin`, `ai-agents/knowledge-base`
  (including `decisions/`), open briefs, `ai-agents/wiki-vault/` and the top-level docs (141 hits;
  each read). ⚠️ A plain `grep -F -f` with that many patterns returned nothing under the UTF-8 locale
  here (a false green); a small python window-set lookup was used instead and checked on a known
  quote (`0305`'s "reads approved `item` lines VERBATIM").
- **Divider labels** — each deleted divider's label searched alone ("the hashing pipeline",
  "transition folding", "git plumbing", "the record-repair rule", "byte-exact line slicing", "the fresh
  check run", "spec classes", "sha256 tool"); the generic ones ("arguments", "classification", "the
  report", "ISO week", "reporting", "synthesis", "keep-out", "spec inventory") on lines that also name
  one of the 3 files. No live hit cites a divider. `test/throughput-counter.test.js`'s own divider
  "2. classify: the record-repair rule" is its own text.

| Hit | Kind | Action |
|---|---|---|
| `architecture.md`: "its `# Outcomes:` header comment" | live | kept — the `# Outcomes:` comment (C3) still lists the vocabulary; no edit |
| `architecture.md`: "apply-time freshness re-check" | live | the `(d)` comment is unchanged |
| `architecture.md`: "Read-only in every branch" | live | kept in C1 ("READ-ONLY IN EVERY BRANCH") |
| open brief `0303`: quotes `check.sh`'s classification comment (manifest row → untouched-stale; nothing → owner-edited) | open brief | phrase kept (C5); brief untouched |
| open brief `0303`: "the consent given was to a diff that no longer exists" | open brief | a `say` string in `repair.sh` (data), unchanged |
| open brief `0305`: quotes `repair.sh`'s header ("the LLM's only jobs are to PRESENT … applies exactly what was approved") and "reads approved `item` lines VERBATIM on stdin" | open brief | both kept (H1, H3); brief untouched |
| open brief `0305`: "GitHub tarball + `cp -R` chain …" | open brief | quotes `dashboard.sh`'s header, not these files — no action |
| open brief `0384`: quotes "A PROXY, PERMANENTLY" | open brief | kept in the record-repair comment |
| open brief `0384`: "checkable by hand rather than argued about in the abstract" | open brief | its own requirement wording, not a dependent quote; the kept comment still says `--list` prints each row's verdict for a check by hand |
| **open brief `0525`** (filed 2026-10-18, in parallel): quotes the header's section "PORTABILITY" — *"node >= 18, no dependency, no `package.json` change."* — and the strftime reason *"rather than taken from `git log --date=format:%G-W%V`, because that path goes through the platform's strftime and %G/%V are not portable…"* | open brief | **not kept verbatim** (the approved T3 and `isoWeek` wording replace them): T3 keeps "node >= 18, no dependency"; the `isoWeek` comment keeps the reason ("git's %G/%V go through a non-portable strftime"). Brief untouched — outside this build's file scope, and `0525`'s own Notes already say `0510` cleans this header and to re-check the quotes. Decision log D3 |
| open briefs `0277`, `0517`, `0523`, `0310` | open brief | shared wording only (`dashboard.sh` command lines; "apply-time freshness re-check" from SKILL/ADR-039) — no action |
| ADR-043: `check.sh:23` and the quote "one line per spec-inventory row, in table order"; its other `check.sh` line cites | ADR | left (owner Q3, R4; M4d). The quote survives in C2 |
| ADR-017: shares the exec-bit wording ("rides a GitHub tarball + `cp -R` …") | ADR | `dashboard.sh`'s and ADR-017's own text; the source of the C0/H0/T1 pointer |
| ADR-050, `sprint-status-vocabulary.md` (both copies), skills, agents, `fkit-claude.sh`, `fkit-claude-init.sh`, `bin/generate-structure-manifest.mjs`, `structure-spec.md`, `structure-manifest.tsv` | live | shared phrases (command lines, the manifest's own hashing contract, init's own lessons) — their own text, no edit |
| `test/structure-check.test.js`, `test/structure-repair.test.js`, `test/throughput-counter.test.js`, `test/launcher-contract.test.js`, `test/skill-ownership-hook.test.js`, `test/converge-contract.test.js`, `test/structure-manifest.test.js`, `test/board-reader.test.js`, `test/dashboard-contract.test.js` | live | their own headers and comments share words with the old comments; none cites a comment of these files as a source — no edit |
| `test/prove-red.sh` Mutation 29 | live | matches code, not comments (V1) |
| wiki pages (the 0506 page quoting "`# Outcomes:` header"; the 0245/0246/0359 task pages; ADR-017/043 pages; index) | wiki | left for the wiki role's next sync; the `# Outcomes:` header is kept anyway |
| dated reports (2026-07-16, 2026-07-19, 2026-08-06, 2026-09-13), closed task folders, sprint boards (including the Backlog board), `.fkit/tmp/` | frozen | left (M4d) |
| this task's own `plan.md` / `plan-review.md` | this task | not edited (ground rule) |

## V6 — Rule followed
M4h (block-aware awk, and the perl width check at 110 columns, code points, indentation included) on
the 3 final files: **no comment run over 2 lines; no comment line over 110 columns** (widest: 110 in
each file). No rule-1 data run is listed, so the R8 `datarun.sh` proof has nothing to prove here (the
HEAD baseline also had none). No named exception.

## Decision log — obvious-winner calls and unattended changes (ADR-019 / ADR-055 audit)

Each entry: what, why it qualified. All are inside the approved plan's intent; none needed a new
knowledge-base destination (M1). No review finding was processed in this step.

- **D1 — a deleted divider in `throughput.mjs` takes its following blank line with it.** The four
  `// --- … ---` dividers each sat between two blank lines; deleting only the divider would leave a
  double blank line. Blank lines only (V1 allows them); M3 hashes unchanged. Obvious winner: tidy,
  no meaning.
- **D2 — blank lines between the new header comments in all 3 files.** The plan says "blank lines
  between" for `check.sh` and `repair.sh`, and "four comments" for `throughput.mjs`; without a blank
  line M4h would count the touching comments as one run over 2 lines. Same treatment in the JS header.
- **D3 — `0525` (filed during this build) quotes header text this unit replaces; no note added.**
  M4d's two routes are "keep the phrase" or "a dated note in the brief". The approved T3 / `isoWeek`
  wording keeps the facts ("node >= 18, no dependency"; the strftime reason) but not the exact
  sentences, and editing `0525` is outside this build's file scope. `0525`'s own Notes already name
  `0510` as cleaning that header and say to re-check the quotes, which is the note's content.
  Obvious winner: nothing of `0525`'s meaning is lost, and no file outside scope is touched. Flagged
  to the lead in the return, in case a producer should add a dated pointer to this worklog anyway.
- **D4 — M4k gained items 3 and 4 when written down** (re-run each fence's pattern after each file;
  a safety residual's token list also binds comment words). Both are what the plan's §2 and §6 step 3
  already did for this unit (the fence grep after each file; "by 0246's accepted residual R8, new
  comments add no `cp`/`dd`/`tee`/`ln`/`truncate` word"); written as general steps so `0508`–`0515`
  inherit them. A record, not code.
- **D5 — left untouched although not named by the plan** (M4j): `check.sh`'s trailing comments on
  `parse_tables`, `marker_lines`, `file_hash`'s markers-absent branch, `manifest_has`, `emit`,
  `kept_out_p`, `refused_ancestor`, `refused_dirs`, `bare=`, the self-host `share="$root"` line, and the
  ko-refused `continue`; `repair.sh`'s helper signature comments and the three trailing comments in
  `synthesize`'s marker merge; `throughput.mjs`'s `tasks` / `byCommit` / `continue` trailing comments
  and the `isoWeek` trailing comments. Each is one line and still true.

### Process review, round 1 (2026-10-18; Process-review worker, `fkit-sprint-ship-loop` via `fkit-lead`)

- **D6 — answers review R1: M4k's two missing text reads, applied without asking.** What changed:
  "Method for the series" › M4k step 1 now also follows an exported path constant (`INIT`,
  `LAUNCHER`) and treats `.toString()` on an imported function as a text read, each with its search;
  step 2 gains the fence kind "byte-equal to another copy (parity)". Why it qualified: R1 verified
  `CORRECT` against the code; docs-only and localized to M4k (no source, test, `plan.md` or
  `plan-review.md` edit); inside the approved plan (plan §2 puts M4k in this worklog as the series
  amendment, and the owner approved the M4k note for the later units). Each new search proven on a
  case, 2026-10-18: the constant search lists `test/harness.mjs`'s `INIT` and `LAUNCHER`, and the
  follow-up finds the two `readFileSync(INIT, 'utf8')` reads in `test/rules-block-budget.test.js`
  (its own `INIT`); the `.toString()` search finds `test/reference-integrity.test.js`'s
  `maskFencesAndQuotes.toString()` plus one Buffer in `test/carry-check-hook.test.js`. No miss today:
  neither `maskFencesAndQuotes` body has a comment (`awk` over each body, 0 `//` lines), and no file
  reads `LAUNCHER` as text. 0510's own fences are unchanged and hold.
- **Obvious-winner calls: none.**
