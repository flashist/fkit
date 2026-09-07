# Worklog — task `0361`

## Phase 2 (build) — `fkit-coder`, spawned by `fkit-sprint-ship-loop`, 2026-09-05

**Authority.** The approved `plan.md` (hash-verified by me this turn: `git hash-object plan.md` =
`cbe5b52f118c7a5602c6b24487cdc79ef3c3792a`, 27122 bytes — identical to the blob the driver declared,
so the file and the pasted bytes agree and there is nothing to reconcile), plus
`ai-agents/knowledge-base/decisions/adr-046-a-sprint-board-may-be-committed-unranked-and-an-erased-rank-flags.md`
(**accepted**, 2026-09-04), which records owner rulings **P1/P2/P3**. Scope: plan §5 "Under (b)",
steps **b1–b6**. Ruling **P4** keeps `claude/skills/fkit-task-brief/SKILL.md` out of this row.

### Baseline, measured by me at the start of this turn — not inherited

| Measurement | Result |
|---|---|
| HEAD | `cf289c26394526ff2601800aa8f40d1873f370ba` (`cf289c2`) |
| `test/closed-rank-immutability.test.js` vs HEAD | **no diff** — the file was untouched when I started |
| Rank guard | **tests 34 / pass 34 / fail 0** |
| `—` codepoint on a live Backlog cell (`xxd`) | `e2 80 94` = **U+2014**, re-verified firsthand |

⚠️ **The working tree was NOT clean when I started, and almost none of it is mine.** Recorded before
my first edit: Sweep B's close (18 brief renames plus re-pointed hrefs), `adr-046`, task `0357`'s
records, task `0376`'s new brief, `plan.md`, and status flips on `backlog.md`, `done/sprint-2.md` and
`sprint-7.md`. **My change surface is exactly one file** — see below.

### What changed — one file, `test/closed-rank-immutability.test.js`

`git diff --stat`: **1 file changed, 108 insertions(+), 9 deletions(-)**. No `claude/` file, no board,
no manifest, no `.claude/` mirror, no `package.json`, no devDependency (**b6** held).

- **b1** — the rank accept widened to an **allowlist of two named forms**, one literal alternative
  added: `/^(?:—|P?\d+(?: \([^()]*\))?)$/`. The throw message now names the unranked marker too.
- **b2** — **both** statements of the refusal amended, which the plan flags as the trap. The
  file-header widening note's tail `"—" / empty / prose still throw` became `Empty / prose still
  throw`, and a second widening paragraph was added recording ADR-046, the U+2014 byte value, the
  allowlist rationale, the transition table, the no-numeric-coercion rule and the standing prove-red
  gap. The inline `parseBoard` comment was rewritten from `never appears on a sprint board and
  throws` to state the accept and name the two wrong-codepoint dashes.
- **b3** — the ADR-046 transition table implemented in `findRankViolations` as a single guarded
  `continue` on `prev.rank === UNRANKED`, above the existing `prev.rank !== r.rank` compare. That
  yields exactly the ruled table: `—`→`—` no flag, `—`→`P<n>` **allowed**, `P<n>`→`—` **flags**,
  `P<n>`→`P<m>` **flags**, open rows untouched. ⛔ No numeric coercion introduced; `—` is compared
  verbatim as a string like every other rank.
- **b4** — the unit test **split, never deleted**. `parseBoard: a garbage Priority cell throws`
  **keeps the original `'high'` assertion** and gains negatives; `parseBoard: an unranked (—)
  Priority cell parses on a sprint board (ADR-046)` is the inverted half.
- **b5** — four new `findRankViolations` tests, one per closed-row row of the ruled table.
- A module-level `const UNRANKED = '—'` was introduced so the marker has one source of truth.

### RED-then-GREEN — the verification correction that is this task's point

The brief's *"the rank test goes GREEN"* is **vacuous**: the suite was already green at 34/34. Plan §7
step 5 replaces it, and this is the order I actually worked in.

1. Wrote the b4/b5 tests **and the bare `UNRANKED` constant only** — no regex change, no comparator
   change. (The constant was landed first on purpose: without it the new tests would have died on a
   `ReferenceError`, which proves nothing about behavior.)
2. **RED run: tests 39 / pass 35 / fail 4.** The four failures were exactly the new behavior-bearing
   tests — the unranked-parses test and comparator rows 1, 2 and 3 — and every one failed with the
   genuine parser throw `Priority cell "—" is not a rank`, not a scaffolding error. Row 4
   (`P<n>`→`P<m>`) passed red-stage as expected: it asserts unchanged behavior.
3. Applied **b1 + b3** (and b2's comments).
4. **GREEN run: tests 39 / pass 39 / fail 0.** Exactly the four flipped.

### Remaining verification, all measured this turn

- **Full suite `npm test`: tests 838 / pass 838 / fail 0.** Arithmetic checks out against the plan's
  833 baseline: one test split into two (+1) plus four new (+4) = **+5**.
- **`bash test/prove-red.sh`: `✓ hard gate PASSED`, 28 mutations, all red.** Unchanged count —
  ⛔ this rule correctly gains **no** mutation, per the suite's standing owner ruling of 2026-08-06
  and ADR-046's Related section. Its red proof is the in-suite RED-then-GREEN above.
- **`dashboard.sh select-active`: `active file="sprint-7.md" identity="Sprint 7"`, exit 0** —
  unchanged from the plan's baseline. Full `dashboard.sh`: **zero** drift or `MALFORMED` lines.
- **No rank changed anywhere.** ⚠️ The plan's step-9 proof — *"`git diff -- ai-agents/sprints/` is
  empty"* — **is no longer available**, because Sweep B's board edits landed in the tree before my
  turn. Substituted, and stronger: my change surface is one file under `test/`; the board diffs were
  recorded in my pre-edit baseline; inspecting them shows only Status-cell flips
  (`🔲 Backlog` → `✅ Done (agent-closed — not owner-verified)`) with the Priority cell **byte-identical
  on both sides**; and `live leg 1` passes, which is a direct machine assertion that no closed row's
  rank moved between the working tree and HEAD.
- **Vacuous-pass re-check (plan §8's named risk), measured rather than assumed.** 7 sprint boards,
  **262 closed rows** parsed from the working tree, and **zero** Priority cells reading U+2014 on any
  sprint board. So `closedRows > 0` holds with a wide margin, and the widening is **provably inert on
  today's corpus** — it accepts a form no live sprint board currently contains. Its effect is on the
  next board opened unranked, which is exactly what ADR-046 says it is for.
- No other test file asserts the old throw message (grepped across `test/`).

## Decision log — calls made without asking

Recorded per ADR-019's audit obligation. All five sit inside the approved plan; none is a
frontier-move, and none changes the ruled semantics.

1. **Introduced `const UNRANKED = '—'`.** Not named by the plan, but b1/b3 both need the marker and a
   single source of truth is the smaller change. Mechanical, localized, in-plan.
2. **Landed that constant before the RED run.** Judgment call in service of plan §7 step 5: a
   `ReferenceError`-red would not have proven the widening does anything. Ordering only — no behavior
   moved before the red was captured.
3. **Added `'——'` (two em-dashes) to b4's negatives**, beyond the plan's listed set. In-plan intent:
   the allowlist's whole point is that near-misses still throw.
4. **Added a `UNRANKED.codePointAt(0) === 0x2014` assertion** inside the unranked test. Serves
   ADR-046's explicitly named residual risk — a wrong-codepoint paste into the constant would
   otherwise widen the allowlist silently. Kept inside an existing test rather than added as a new
   one, so the test count stays aligned with the plan.
5. **Wrote b5's fourth test even though it duplicates existing coverage.** The plan says four, one per
   closed-row row; the `P<n>`→`P<m>` row is already covered by `a re-ranked closed row is flagged with
   old and new rank`. Followed the plan and flagged the duplication in a comment beside the test
   rather than silently dropping a step.

## ⚠️ One finding that corrects a list in ADR-046 — surfaced, not resolved

ADR-046's Decision part 1 lists the forms that must keep throwing and includes **`'— '`** (em-dash
plus a trailing space). **That form is unreachable through this parser and I deliberately did not
assert it.** The Priority cell is `.trim()`ed before the rank check, so a cell written `| —  |`
arrives at the regex as `'—'` and is the unranked marker. The ADR's list describes the regex; the
parser trims first. Every other item on that list — `'high'`, `''`, `'P'`, `-` U+002D, `–` U+2013,
`'—5'` — **is** reachable and **is** asserted.

⛔ **No behavior was changed on account of this**, and it does not affect the ruling: accepting
`| —  |` as unranked is the correct reading of a whitespace-padded markdown cell. It is recorded in a
comment beside the test and here so the discrepancy is findable, rather than left as a list item a
later reader would assume is covered.

## Not done, deliberately

- ⛔ Nothing committed or staged by me. No folder moved, no mover skill invoked, no board row flipped,
  no vault write, no `.claude/` mirror edit.
- ⛔ No review requested — the driver spawns it.
- ⛔ `claude/skills/fkit-task-brief/SKILL.md` untouched (ruling **P4** files it separately).
- ⛔ The plan's false §3 Finding 1 wording — *"`dashboard.sh` never reads that column"* — is **not**
  repeated anywhere in this worklog or in the code comments. `dashboard.sh` does read the Priority
  column, as arm 2 of its FACTS-id ladder. What holds, and what (b) rests on, is that this test is the
  only **enforcer**.

## Round-1 process-review — `fkit-coder`, spawned by `fkit-sprint-ship-loop`, 2026-09-05

Applied `fkit-process-stateful-review`, steps 0–7, to the task folder's `review.md`. Coverage on that
ledger reads **both reviewers measured** (Codex executed). **4 findings, all round 1, zero behaviour
defects** — all four are *record* defects, the load-bearing category in a suite whose declared method
is that its comments are the record.

**Step 0 loaded, and honoured:** the one existing accepted residual (the two-commit launder's
dependence on the guard running in the window) and ADR-046 including its **two new 2026-09-05 dated
notes**, which did not exist when phase 2 read the ADR. ⛔ Nothing settled was re-litigated: options
(a)/(b)/(c), the five transition rows, verbatim-string comparison, the prove-red gap, the
`dashboard.sh` correction and the routed `'— '` item were all left alone.

**Verdicts: R1, R2, R3, R4 all `CORRECT`.** Severities were derived from blast radius I traced, not
inherited. Three fixed, one accepted as residual per owner ruling.

### What changed in `test/closed-rank-immutability.test.js` this round

Cumulative surface is now **+127/−10** on that one file (was +108/−9). Still one file. No board, no
`claude/`, no ADR, no mirror.

- **R1, both sites.** `findRankViolations`' contract comment said *"a row closed in `earlier` that
  appears in `later` with a different Priority cell is a violation"* — measurably false since part 2:
  `—`→`P3` is a different cell and returns `[]`. It now carries the exception. The top-of-file **THE
  INVARIANT** statement gained the same exception (owner **S3**). ⭐ ADR-046 §Related named this
  defect class and enumerated **two** refusal sites; b2 amended both. These are a **third and fourth**
  the enumeration did not reach — the class was right, its list was short.
- **R2.** `'P1 (a) (b)'` added to the garbage test's negatives.
- **R3.** The header's red-proof sentence replaced with the measured mutant→killer map.

### Measured this round — counts are mine, none quoted

| Measurement | Result |
|---|---|
| Rank guard, after fixes | **tests 39 / pass 39 / fail 0** |
| `reference-integrity` + `coordination-citation-policy` as one command | **tests 41 / pass 41 / fail 0** |
| Quantifier mutant `?`→`*`, **before** R2's fix | **39 / 39 / 0** — survived |
| Quantifier mutant `?`→`*`, **after** R2's fix | **39 / 38 / 1** — killed by `parseBoard: a garbage Priority cell throws` |
| Character-class mutant `[—–-]` | **39 / 38 / 1** — sole killer is that same garbage test |
| Revert widened regex only | **39 / 35 / 4** — unranked-parse test + comparator rows 1-3 |
| Drop the guarded `continue` only | **39 / 38 / 1** — comparator row 2 alone |

⭐ **R2's fix is proven, not asserted.** An assertion that does not kill the mutant it was added for
is not a fix; this one flips that mutant from surviving to red. Every mutation above was run on a
backed-up copy and the file restored; `git diff --stat` was re-checked after each restore.

## Decision log — round-2 additions

6. **Amended R1's PRIMARY site without a separate owner ruling.** The owner ruled only the lesser site
   (**S3**). Qualifies under the standing approval: verified `CORRECT` by execution, mechanical and
   localized (one comment in a file already in scope), and an **obvious winner within the approved
   plan's intent** — plan §8 states the principle outright (*"a stale header in a suite whose method
   is its comments is a real defect, not cosmetics"*) and ADR-046 §Related names the class. Leaving a
   measurably false contract comment above the function it describes had no defensible alternative.
   The driver had also scoped it as covered.
7. **Wrote R3's replacement as a measured mutant→killer map rather than the minimal three-word edit.**
   Judgment call. The minimum would have made the sentence *not false*; it would still not have said
   what the red proof is, and the whole finding is that this file's record must be accurate. The map
   is the measurement I had already run.
8. **Left the ledger header's `File(s) under review: … (+108/−9)` stat untouched** though my surface is
   now +127/−10. The header is the reviewer's and only `Status:` is mine to set. ⚠️ Flagged rather
   than corrected — the drift is real and belongs to whoever owns that line.
9. **Set ledger `Status: closed-out`.** All four findings dispositioned, nothing pending or blocked.
   ⚠️ Recorded honestly: my three fixes have **not** been independently re-reviewed, and the method's
   close condition names *closeout / disproven / accepted*, not `✅ done`. If the driver wants the
   fixes verified, a round 2 reopens the ledger — that is the driver's call, not mine.
10. **Recorded R4's residual with its tension stated, not smoothed.** R4 is the same mis-citation class
    that S1's own reason invokes and that Sweep B is clearing. The residual says so, names it a
    **scoped cost the owner took knowingly** rather than a finding argued away, and carries three real
    re-raise conditions — including that the residual is discharged the next time this worklog is
    edited for any other reason.

### ⚠️ A transient guard RED observed mid-turn — not mine, and now cleared

Recorded because it was real, measured, and would otherwise be invisible. Sequence, all measured:

1. Guards **41/41** immediately after my fixes.
2. Minutes later, the same command: **41 / 40 / 1** — `L2 live corpus: BROKEN is 0` failed with
   **7 unresolved links across 4 files**: `sprint-7.md`, `0376`'s brief, and the closed briefs of
   `0356` and `0357`. Cause: task `0357` moved `backlog/` → `done/` **during my turn**, and links
   pointing at it (and its own outbound links to `0358`, still in `backlog/`) had not yet been
   re-pointed.
3. ⛔ **None of the four files is one I touched.** My surface this whole task is
   `test/closed-rank-immutability.test.js` plus this folder's `review.md` and `worklog.md`, and none
   of them contains a link to `0357` or `0358`. Corroborating: `npm test` is
   `node --test test/*.test.js && bash test/prove-red.sh`, and the `&&` short-circuits — prove-red
   **ran and passed**, which is only possible if the node suite exited 0 at that moment.
4. Re-measured after the other worker finished: **guards 41/41, 0 broken links, 3295 targets
   resolved.** The red cleared on its own.

⭐ **Nothing to repair, and I repaired nothing.** ⚠️ The hazard worth naming for the driver: a close
that moves a folder is **not atomic** with re-pointing the hrefs into it, so any guard run inside that
window reds on files the runner never touched. A worker who assumed the red was its own would have
"fixed" four files it had no business editing — two of them closed folders that are append-only under
ADR-034.
