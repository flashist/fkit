# Review — 0176

Task: `ai-agents/tasks/done/0176-build-the-coordination-citation-policy-guard/brief.md`
File(s) under review: `test/coordination-citation-policy.test.js` (new, untracked, 773 lines) ·
`ai-agents/tasks/backlog/0176-build-the-coordination-citation-policy-guard/worklog.md` (new, untracked)
Status: in-review
Coverage: **both reviewers measured** (ADR-042 D1) — Codex (`codex-cli v0.152.0`, exit 0) executed
mutant scans against the live corpus and reported their behavioural results (`DIGIT_MUTANT {total:78,
ex:78, res:0, files:45}`, `MUT bare 159 159 0`, `MUT noTilde 166 0`, `MUT col0 166 0`, `ELIDED {el:45,
files:20, open:0}`) and ran both suites (its tmpdir fixtures hit `EPERM` under its read-only sandbox,
which it disclosed). The Claude reviewer independently ran `node --test` on both suites, `npm test`,
`bash test/prove-red.sh`, both red runs, and six source mutants built in a scratch directory.

> ⚠️ **G1 friction, recorded because this is the first review to run under the rule this task ships.**
> This ledger sits in `ai-agents/tasks/backlog/0176-…/` — inside the guard's scanned set and **not
> exempt**. Every `file:line` below points at a **source file** (`test/*.js`), which owner ruling G3
> rules legal and unflagged, so the prescribed findings-table column is safe *here*. Where this review
> needed to point at a **coordination document** — the plan and its owner rulings — it cites by
> **section heading**, never by line, because `…/plan.md:NNN` would red the guard this task just built.
> That substitution is the friction, and it is the ruled behaviour, not a misfire. See §Convergence.

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | high   | `test/coordination-citation-policy.test.js:218` | ⭐ **G1 — the one owner ruling that decides what ships — is the one ruling with no arm pinning it.** Option B, refused by name, can be re-added to `exempt()` and all 20 arms stay green. Verified: appending `\|\| rel.endsWith('/review.md')` to the return at :218 → **20 tests / 20 pass / 0 fail** (mutation run in place, file restored, md5 `37f6521b1473af8144ab427be8f0a4c5` before and after). No arm ever plants a coordinate in an **open** `review.md`; L4 only inspects files that already produced exempt hits; L5's four `exempt()` spot-checks name a `backlog/brief.md` and a sprint board, neither a `review.md`. Every *other* ruling is pinned — M6 pins owner ruling 1, M8 pins G3, C4 pins G4, M4 pins the 2026-08-29 whole-folder widening. G1 is the gap. |
| R2 | 1     | medium | `test/coordination-citation-policy.test.js:367` | **L3 has no floor on `total`, so a materially narrowed matcher passes the whole suite.** Verified: `TARGET`'s `:\d+` → `:\d{1,2}(?!\d)` drops the live corpus **166 → 78 hits across 45 files**, all still exempt; L2 residual stays 0, L3's arithmetic still closes (78 = 78 + 0), `exemptCount > 0` still holds, **20/20 pass**. Every matched fixture coordinate in the file is ≤ 2 digits (largest `:88` in C5), so no arm notices. ⭐ The shipped sibling carries exactly this floor with exactly this reasoning — `test/reference-integrity.test.js:840` `assert.ok(LIVE.checked > 2000, … 'the matcher is probably not matching, and "0 broken" would mean nothing')`. The build named this omission itself and referred it here; the referral is correct and the omission matters. |
| R3 | 1     | medium | `test/coordination-citation-policy.test.js:650` | **Three of the fence regex's four opener branches are unpinned; only the CommonMark close rule is.** Verified — three masker mutants each pass **20/20**: dropping `~{3,}` (live total unchanged 166), requiring column 0 (`^` for `^\s{0,3}`, unchanged 166), and rejecting any info-string opener (`([^`~]*)` → `(\s*)`, live total **166 → 159 across 64**, silently). Cause: C1's fixtures open with a bare column-0 backtick fence, and C2 exercises ` ```js ` and `~~~` only as **non-closers inside** an already-open fence, never as **openers**. ⭐ Contrast that proves the gap is specific, not general: the blockquote branch **is** pinned — I mutated `/^\s*>/` → `/^>/` and **C3 reds**. |
| R4 | 1     | low    | `test/coordination-citation-policy.test.js:496` | **M2 proves the citing side is not `brief.md`-only, but not that it is arbitrary `*.md`.** Verified: restricting `collectFiles`'s filter at :193 to `['brief.md','plan.md','worklog.md','review.md']` passes **20/20** with the live corpus **unchanged at 166 across 66** — every task-folder `.md` in the repo today is one of those four. A future open `notes.md` carrying the banned form would go unread. Live cost today **0**. |
| R5 | 1     | low    | `test/coordination-citation-policy.test.js:254` | **The comment's "it must stay at COLUMN 0" mis-states C7's real constraint.** C7 slices from `decl.index`, the `f` of `function` (`test/reference-integrity.test.js:874-884`), so the declaration line's own leading whitespace is **never in the slice**; what must match is the **body's** indentation. Fails safe either way, but a maintainer reading :254 is told the wrong invariant. |
| R6 | 1     | low    | `test/coordination-citation-policy.test.js:49` | **The "PRECISION ABOUT BYTE-IDENTICAL" paragraph is itself imprecise.** It says `TARGET` and `blank` are "transcribed byte-identical" and `exempt`/`maskFencesAndQuotes` "byte-identical MODULO D2". My independent extraction: `blank` **is** byte-identical; `TARGET`, `exempt` and `maskFencesAndQuotes` are byte-identical **modulo a leading `export `** (and, for `exempt`, modulo the removed `OPT.oldExempt` line). The `export ` keyword is arguably inside D1, but the paragraph exists precisely to avoid overclaiming and does not name it. |
| R7 | 1     | low    | `test/coordination-citation-policy.test.js:340` | **Module-load live scan can be killed by an ordinary concurrent task move — and takes all 20 arms with it.** `const LIVE = scan(REPO)` runs at import; `collectFiles` snapshots paths (:186-203) and `scan` reads them later (:290). A `backlog/ → done/` rename between the two raises an uncaught `ENOENT` at module load, so the file registers **zero** tests rather than failing one. ⚠️ **Pre-existing shared pattern, not introduced here** — `test/reference-integrity.test.js` does the same module-load live scan. Classified frontier-move; recorded so it is not re-derived next round. |

### Verified clean — checked and NOT raised as findings

Recorded so the coder is not asked to chase them, and so a later round does not re-derive them.

- ⭐ **Transcription fidelity: clean.** Extracted §4.2 from the document **as committed at `c797df4`**;
  the extract's md5 is `6c6242a6d57f3625961143b723c3e0ad`, matching the plan's recorded value.
  Compared piece by piece with an independent Python extraction, not by trusting the file's own claim:
  `TARGET` identical modulo `export `; `blank` identical; `exempt` identical modulo the removed
  `OPT.oldExempt` line; `maskFencesAndQuotes` identical modulo the two `OPT.fences` ternaries and the
  `OPT.quotes &&` guard. **No silent change in what the guard decides.** (R6 is only about how the
  header words this, not about the code.)
- ⭐ **C7 passes for the right reason, not through a slice artifact.** I reproduced the parity
  independently: extracting `maskFencesAndQuotes` from **both** shipped files with my own brace scanner
  gives byte-equal text. The `export` asymmetry is symmetric — both files declare `export function`,
  and `Function.prototype.toString()` omits `export` — and the body contains no `}` inside a string
  literal, so the brace scan is not truncated. `node --test test/reference-integrity.test.js` →
  **20 tests / 20 pass / 0 skip**, C7 live and green. ⭐ The skip did arm itself when this file landed.
- ⭐ **C4 does pin G4.** Reinstating span-masking would make all four of C4's cases (single-backtick,
  table cell, double-backtick, bracketed link label) drop from residual 1 to residual 0 — C4 reds in
  every one. The positive assertion is genuinely stronger than transcribing the dead function.
- **Every reported figure reproduces.** New suite **20/20/0 skip**; `test/reference-integrity.test.js`
  **20/20/0 skip**; `npm test` **832 tests / 832 pass / 0 fail / 0 skip**; `bash test/prove-red.sh`
  **`✓ hard gate PASSED`, 28 mutations, file unedited**; red run 1 (`exempt()→false`) **residual 166
  across 66**; red run 2 (2026-08-01 shape) **residual 49 across 23** — reproducing the brief's own
  figure exactly; live **residual 0 across 0**, total 166 across 66, scanned **720** (the file states a
  floor, not the count, and the corpus moved 718 → 720 during the build — correct design).
- **Both self-corrections against the approved plan are honest and both reproduce.** The masking
  convention moves the total by **8, not 0** — measured: unmasked 174 across 67 vs masked 166 across
  66, the 8 being 1 hit in `0270`'s closed review ledger and 7 in `0353`'s. Prong B is **223 across
  44**, within the matcher-dependent band the file itself declares; my own independent matcher gives
  **233 across 44** — same file count, and the file states the figure is matcher-dependent.
- **The accepted incompleteness is stated, not softened.** Verified live: `0013`'s brief is in
  `backlog/` — open and not exempt — and its line 28 carries `` [`sprint-2.md:354`](…) ``, a
  coordinate the guard walks, reads and does not flag. The header names it, L7 diagnoses it, and M6
  pins the refusal. `review.md` census confirmed: **133 in the scanned set, 133 in `done/`, 0 in
  `backlog/`** — exactly as claimed.
- **Do-not-touch check clean.** `git status --porcelain ai-agents/tasks/done ai-agents/tasks/cancelled`
  → empty. Working tree carries exactly the two new untracked `0176` artifacts, the new test file, and
  the driver's status flips.
- **Not defects** (checked, no action): the shared module-level `TARGET` with the `g` flag is safe —
  `String.prototype.matchAll` clones the regex and never mutates `lastIndex`. No catastrophic
  backtracking (the character classes are non-overlapping and there is no nesting). No symlinks in the
  scanned trees. `node --test` file parallelism cannot cross-pollute — every fixture is a distinct
  `mkdtempSync` directory under `fs.realpathSync(tmpdir())`.

## Coder response

<!-- CODER-OWNED. The reviewer never writes here. -->

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | Defect (coverage) | Added arm **M9** — plants a coordinate in an **open** `review.md` and requires it to RED, plus the two predicate assertions (`exempt()` false for the open ledger, true for its closed twin) so the ruling survives a loop restructure. ⭐ Bite-checked: with M9 in place, re-adding refused option B to `exempt()` now gives **21 tests / 20 pass / 1 fail**, and the failing arm is M9. | ✅ done |
| R2 | CORRECT | Defect (coverage) | Added a floor `assert.ok(LIVE.total > 120, …)` to **L3**, with the measurement, the mutant that motivated it, and "a floor, never a count" in the comment. ⭐ Bite-checked: the `:\d{1,2}(?!\d)` mutant now fails L3 with `only 78 citation(s) matched … (floor 120)`. | ✅ done |
| R3 | CORRECT | Defect (coverage) — **deferred by owner ruling, not reclassified** | ⛔ No code change this round. Owner ruling 2026-09-03, option label verbatim **"Follow-up (Rec)"**. Recorded below as an accepted residual with a *Re-raise only if*; filing a follow-up is the producer's and does not block this task. | won't fix (frontier) |
| R4 | CORRECT | Defect (coverage) — **deferred by owner ruling, not reclassified** | ⛔ No code change this round. Owner ruling 2026-09-03, option label verbatim **"Fix R5/R6, residual R4/R7 (Rec)"**. Recorded below as an accepted residual. Live cost re-verified 0. | won't fix (frontier) |
| R5 | CORRECT | Defect (comment) | Rewrote the parity-constraint sentence above `maskFencesAndQuotes`: the invariant is the **body's** indentation, not the declaration line's, because C7 slices from the `function` keyword. ⛔ Not one byte of `maskFencesAndQuotes` itself was touched — C7 stays **20/20/0 skip**. | ✅ done |
| R6 | CORRECT | Defect (comment) | Rewrote the "PRECISION ABOUT BYTE-IDENTICAL" paragraph to the measured truth: `blank` byte-identical; `TARGET`, `exempt`, `maskFencesAndQuotes` byte-identical **modulo a leading `export `** (attributed to D1) and, for the latter two only, modulo the removed `OPT.*` references (D2). | ✅ done |
| R7 | **PARTIALLY CORRECT** | Frontier-move | The race is real and every citation checks out. ⛔ **The stated consequence is wrong and I am not carrying it forward**: measured this round, `node --test` reports a module-load throw as **`tests 1 / pass 0 / fail 1`** — a synthesised failing test, a loud red — not "registers **zero** tests". The cost is a flaky CI red on a concurrent task move, not a silent loss of coverage. Pre-existing and shared with the sibling half, which does the same at `test/reference-integrity.test.js:400`. Recorded below with that correction. | won't fix (frontier) |

**⚠️ Severity was derived here, not inherited.** Traced blast radius, per finding: **R1 high** (a silent
re-widening path for the one ruling that decided what ships, with no detector — matches the reviewer's
label, derived independently); **R2 medium**; **R3 low** — ⛔ **I differ from the reviewer's `medium`**:
the magnitude is 7 hits of 166 (4%), residual is unaffected, and the branch that historically broke
(the CommonMark close rule) *is* pinned by C2; **R4/R5/R6/R7 low**, agreeing with the reviewer.

**⚠️ On the Status vocabulary for R3, R4 and R7, said rather than glossed.** The skill's six prescribed
values offer no cell for *"a real defect the owner deferred"*. `won't fix (frontier)` is the only one
that fits an accepted residual, so it is used — but the Defect/Frontier column above keeps R3 and R4
classified as **defects**, because relabelling them frontier-moves to match the Status cell would
launder a coverage gap into a design choice. R7 alone is a genuine frontier-move.

**⛔ The header `Status:` is deliberately left at `in-review`, and that is a call I am naming rather
than making quietly.** The skill sets `closed-out` when every novel finding is closeout / disproven /
accepted — four of these seven were **fixed**, so the ledger now carries code the reviewer has not
seen (one new arm, one new assertion, two comment rewrites). Closing it here would close a ledger over
unreviewed changes. The reviewer or the driver closes it after looking at round 1's diff.

## Accepted residuals (shared, do-not-re-litigate)

<!-- Entries are added only once the owner approves treating a finding as a settled tradeoff. -->

### ⭐ Recorded this round (round 1), on the owner's 2026-09-03 dispositions

- **R3 — three of the four fence-opener branches stay unpinned** — What: `C1`/`C2` pin the CommonMark
  *close* rule and nothing else, so three *opener* branches (the `~{3,}` alternative, the `^\s{0,3}`
  indent tolerance, and the `([^`~]*)` info-string capture) can each be mutated with the suite staying
  green; I re-measured all three this round — each passes **20/20**, and the info-string mutant moves
  the live corpus **166 across 66 → 159 across 64**, silently · Why (structural): owner ruling
  2026-09-03, option label verbatim **"Follow-up (Rec)"** — real, but lower-stakes than R1/R2, and the
  branch that actually broke historically (a closing fence carrying an info string, introduced once and
  copied into both specification masters) *is* pinned by C2. Rejected alternative: pinning all three
  now, which the owner declined this round as scope the plan's arm list did not carry · Re-raise only
  if: a fence-opener branch is *edited*, or the live total moves without a matching edit to `TARGET` or
  to the corpus, or the follow-up the producer may file lands and re-opens it.
- **R4 — the citing side is proven "not `brief.md`-only", not "arbitrary `*.md`"** — What: `M2` shows a
  `worklog.md` is read, but no arm distinguishes `f.endsWith('.md')` from a closed four-name list; I
  re-measured this round — restricting `collectFiles`'s filter to `brief/plan/worklog/review.md` passes
  **20/20** with the live corpus **unchanged at 166 across 66**, because a census of
  `ai-agents/tasks/*/*/*.md` today returns exactly those four names (362 · 134 · 115 · 108) and nothing
  else · Why (structural): the divergence is unobservable until someone files a fifth filename in an
  open task folder, so the arm would be asserting against a tree that does not exist; live cost today
  is **0** · Re-raise only if: a task folder gains a `.md` that is not one of the four, or the
  `*.md` filter is narrowed by an edit.
- **R7 — the live scan runs at module load and can be killed by a concurrent task move** — What:
  `const LIVE = scan(REPO)` runs at import; `collectFiles` snapshots the paths and `scan` reads them
  afterwards, so a `backlog/ → done/` rename landing between the two raises an uncaught `ENOENT` at
  module load · ⛔ **Correction to the finding, measured this round, carried so the next reviewer does
  not inherit the wrong cost:** `node --test` reports a module-load throw as **`tests 1 / pass 0 /
  fail 1`** — it synthesises one failing test for the file. The failure is **loud**, not a silent
  registration of zero tests. The cost is a flaky red on a race, never a green over unscanned work ·
  Why (structural): pre-existing and **shared with the sibling half** (`test/reference-integrity.test.js:400`
  does the same), so the reviewer's own reasoning — which the owner took on 2026-09-03, option label
  verbatim **"Fix R5/R6, residual R4/R7 (Rec)"** — is that it is fixed in **both halves or neither**,
  never in this one alone. Rejected alternative: a try/catch or a re-`stat` in `scan`, which would
  diverge this half from its sibling and from §4.2 for a failure that already announces itself ·
  Re-raise only if: the race is observed in practice, or the sibling half is changed — at which point
  both halves change together.

### Pointers to what was already settled before this round

The rulings below are **already settled by the owner at the plan gate** and were suppressed from the
findings above rather than re-raised; they are listed here as pointers, not as new residual decisions.

- **G1 — no exemption for an open `review.md`** — What: a coordination-document coordinate is flagged
  wherever written, open review ledger included · Why (structural): the durable-citation convention's
  row 3 rules the form categorically wrong when the target is a coordination document, and option B
  was refused **by name** as a silent widening of "closed records are frozen" into "ledgers anywhere"
  · Re-raise only if: the owner reopens it. ⛔ **R1 is not a re-litigation of this** — it argues G1 is
  **under-defended**, the opposite direction.
- **G2 — no `test/prove-red.sh` entry** — Re-raise only if: `ai-agents/` gains an environment seam.
- **G3 — source-file coordinates stay legal** — Re-raise only if: the owner takes the follow-up.
- **G4 — `maskCodeSpans` omitted, C4 asserts the ruling positively** — Re-raise only if: C4 is removed.
- **G5 — the sweeps' mid-run risk** — carried to `0356`/`0357`/`0358`'s own plan gates, not solved here.
- **D1–D5** and the scanned-set exclusions (`sprints/done`, `sprints/reviews`, `knowledge-base`,
  `wiki-vault`, `claude/`, `test/`) — settled in the approved plan, §"Deviations from §4.2" and
  §"Target class, scanned set, exemption set".
