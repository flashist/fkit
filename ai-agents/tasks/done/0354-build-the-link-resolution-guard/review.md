# Review — 0354

Task: `ai-agents/tasks/done/0354-build-the-link-resolution-guard/brief.md`
File(s) under review: `test/reference-integrity.test.js` · `ai-agents/tasks/backlog/0354-build-the-link-resolution-guard/worklog.md` · `ai-agents/tasks/backlog/0354-build-the-link-resolution-guard/plan.md`
Status: closed-out
Coverage: **both reviewers measured** (ADR-042 D1) — Claude ran the file (18 pass / 0 fail / 1 skip,
0.52s), the full unit suite (`node --test test/*.test.js`, 811 tests / 810 pass / 0 fail, 47.4s),
**26 mutants** against the guard's own functions, and a simulated `0176` sibling to exercise C7;
Codex (`codex exec`, exit 0) executed node one-liners reproducing `resolveExact` and the C7
extractor, a filtered `node --test`, and corpus counts. ⚠️ Codex's fixture arms hit sandbox `EPERM`
on `mkdtempSync` (10 pass / 8 fail / 1 skip), so its full-file execution was partial; all fixture and
mutation evidence below is Claude's. ⛔ Neither reviewer ran `npm test`'s `prove-red.sh` hard gate
(>10 min); its PASS is taken from the hand-off report, unverified here.

⛔ **This ledger is inside the scanned set.** It deliberately contains no bracket-label-plus-
parenthesised-target construct anywhere, masked or otherwise — see R9 for why that discipline matters.

## Reviewer findings

| #   | Round | Sev  | file:line | Claim |
|-----|-------|------|-----------|-------|
| R1  | 1 | low  | `test/reference-integrity.test.js:628` | C3's **failure message** still reads "Containment is what stops that" — under D2 the segment walk is what stops it. The comment above C3 was corrected for exactly this; the assertion string was not. |
| R2  | 1 | low  | `test/reference-integrity.test.js:24,30,55` | The header's transcription-fidelity account is wrong in three places: (a) "There are three, they are named, **nothing else differs**" omits the `scan(root)` / `collectFiles(root)` seam and the `checked` / `skipped` / `visited` instrumentation — both approved by plan §3–§5 and acknowledged at lines 276–281, but absent from the D-list; (b) "**the match loop** … transcribed byte-identical" is false (counters, cache, helper call); (c) "**NAMESPACE imports**" is false — `import fs from 'node:fs'` is a *default* import. |
| R3  | 1 | low  | `test/reference-integrity.test.js:292,297,300` | Three transcribed branches are pinned by **no arm** and exercised by **no live instance**: root-absolute rebasing, `decodeURIComponent`, angle-bracket `<target>` stripping. Live counts measured 0 / 0 / 0. Mutating the root-absolute branch to resolve relatively reds **nothing** — C3's plain-root-absolute case looks like coverage and is not. Under Ruling 2 the M/C arms *are* the mutation proof, so an unpinned branch is a hole in it. |
| R4  | 1 | low  | `test/reference-integrity.test.js:438` | L6 uses `.some()`, so **one surviving file per prefix** satisfies it. With L1's floor (826 vs 800) and L8's headroom (3131 vs 2000), a silent narrowing of **up to 25 files** passes L1, L6 and L8 together. Narrowing makes the guard *more* green, which is the regression L6 exists to catch. |
| R5  | 1 | low  | `test/reference-integrity.test.js:261` | `resolveExact`'s containment is **lexical**. A target reaching outside the repo *through an in-repo symlink* resolves as SATISFIED — measured: a symlink to `/etc` makes `.../escapehatch/hosts` return `true`. `walk` also silently skips symlinked `.md` files and directories. Live cost **0** (0 symlinks under `ai-agents/`). Contradicts C3's title "never satisfied". ⛔ Not a transcription defect — §4.1 has the identical hole — but an **eighth blind spot**, absent from the seven disclosed. |
| R6  | 1 | low  | `test/reference-integrity.test.js:533` | M4 never asserts that anything **was** scanned: with `visited: []` every one of its assertions passes. M1 applies exactly this discipline one screen earlier (`a.checked >= 2`, "too thin to be a control"); M4 does not. Globally caught by L1/M1, locally vacuous. |
| R7  | 1 | low  | `test/reference-integrity.test.js:708` | C7's extractor — **currently skipped, therefore unmeasured** — can produce **false parity**: an `async ` prefix is invisible to `indexOf('function maskFencesAndQuotes(')`. It can also produce **false drift** on re-indentation or a `}` inside a string literal. Simulated against five sibling shapes: real drift IS caught and real parity IS accepted; these are the edges. |
| R8  | 1 | low  | `test/reference-integrity.test.js:394` | L4's stale-**citer** check uses `fs.existsSync` (case-insensitive on macOS) while its **target** check uses case-exact `resolveExact`. A citing file renamed only in case reads as present here and stale on a case-sensitive runner — precisely the "result depends on who runs it" that D2 was adopted to remove. |
| R9  | 1 | low  | `ai-agents/tasks/backlog/0354-build-the-link-resolution-guard/worklog.md:62` | The worklog **reproduces** plan §10's self-refuting construct: it contains a bracket-label-plus-parenthesised-target, saved only by a **line-level** backtick span. Reflow that sentence across a line break and the span stops pairing and the guard reds on the document describing it. It also leaves the worklog's own naive figures (167 across 73) +1 stale, uncaveated. |
| R10 | 1 | low  | `ai-agents/tasks/backlog/0354-build-the-link-resolution-guard/worklog.md:178` | The ADR-019 decision log states "**One entry.**" and then lists **two** (lines 180 and 193). |
| R11 | 1 | low  | `ai-agents/tasks/backlog/0354-build-the-link-resolution-guard/worklog.md:171` | §7 defers the hard gate to "the report accompanying this worklog"; the task folder holds only `brief.md`, `plan.md`, `worklog.md`. The full-suite figures reached this review only through the spawn prompt, which is not durable. The worklog is the durable record and step 6 is the gate. |
| R12 | 1 | low  | `test/reference-integrity.test.js:637` | C4's **mutant-killing power is platform-bound**: on a case-sensitive volume the D2-revert mutant still yields exactly one broken link, so C4 passes. The assertion is correct on both platforms; only its value as the D2 arm is macOS-only. ⚠️ Reasoned, not measured — no case-sensitive volume available here. Frontier-move; the C4 diagnostic already names the platform. |
| R13 | 1 | info | `test/reference-integrity.test.js:262` | **MUT-B, independently verified and answered.** Deleting the containment line reds nothing (18 pass / 0 fail) — mechanism confirmed exactly as self-reported. ⭐ **New evidence the build did not produce:** deleting containment **and** reverting D2 to `existsSync` together reds **C3 and C4**. The line is therefore load-bearing precisely in the D2-reverted world the file claims it is. **Recommend: keep the line, record as an accepted residual.** Frontier-move — no code action. |

## Coder response

_(coder-owned — do not write above this line into this section)_

**Round 1 processed 2026-09-02** by the Process-review worker of `fkit-sprint-ship-loop`, under the
loop's declared-approval marker (owner approved `plan.md` live in the driver session). Severity was
**re-derived from traced blast radius, not inherited** — including for the two findings Codex sent up
as HIGH. Two land above the reviewer's uniform `low`; the rest are confirmed `low`. Every claim below
was reproduced first-hand before any edit; the mutants and counts are recorded in `worklog.md` §11.

| #  | Verdict | Defect / Frontier | My severity | Action | Status |
|----|---------|-------------------|-------------|--------|--------|
| R1  | CORRECT | Defect (doc) | low | C3's failure message rewritten — it now names both refusals (segment walk + the containment line it duplicates) and says rebasing is not one of them, matching the comment the build round had already corrected | ✅ done |
| R2  | CORRECT | Defect (doc) | **medium** | All three corrected. New **STRUCTURAL ADAPTATIONS** block names S1 the root seam, S2 the instrumentation, S3 the shape; the match loop is no longer claimed byte-identical, with its differences enumerated; "NAMESPACE" → **DEFAULT** imports. Mirrored fixes in `worklog.md` §3, which repeated both false claims | ✅ done |
| R3  | CORRECT | Defect (coverage) | **medium** | Verified: **0 / 0 / 0** live instances, and deleting each branch red **nothing** (18 pass / 0 fail, three times). C3 gained a root-absolute target that resolves *because* of the rebase; new test **C8** pins percent-decoding and angle-bracket destinations. Each now kills exactly one arm | ✅ done |
| R4  | CORRECT | Defect (coverage) | low | L6's `.some()` replaced by a floor per prefix (400 / 10 / 5 / 2 / 80 against measured 561 / 13 / 6 / 2 / 102). ⭐ Control: re-exempting 12 of 13 `tasks/cancelled/` files passed the **whole file** (19/0) under `.some()`; under the floors it reds **L6 alone**. ⚠️ Residual stated in-file: a *diffuse* narrowing is still bounded only by L1's slack (27 files) | ✅ done |
| R5  | CORRECT | Frontier — **owner-ruled** | low (live cost 0) | ⛔ Symlink escape **NOT fixed**, per owner ruling "Disclose as an eighth blind spot (Rec)". Disclosed as blind spot **8** in the file header and `worklog.md` §9.1: containment is **lexical**, an in-repo symlink to `/etc` would make `/etc/hosts` resolve satisfied, **§4.1 has the identical hole**, and fixing it means `realpathSync` plus an unapproved fourth deviation. Live cost 0 re-verified independently (`find ai-agents -type l` → 0) | ✅ done (disclosure) |
| R6  | CORRECT | Defect (coverage) | low | Verified locally vacuous: with `collectFiles` stubbed empty, 11 tests failed and **M4 was not one of them**. Added `r.scanned >= 2` and `r.checked >= 1`, mirroring M1. Same stub now fails **13**, M4 among them | ✅ done |
| R7  | PARTIALLY CORRECT | Defect (false parity) + **Frontier — owner-ruled** (false drift) | low | **The two halves went different ways, and both are recorded.** ⭐ **False-parity half → FIXED:** the declaration is matched with its modifiers, so an `async` sibling now reports drift (was: a slice identical to ours). ⛔ **False-drift half → NOT fixed,** per owner ruling "Confirm as an accepted residual (Rec)" (2026-09-02): the re-indent and `}`-in-string false drifts stay, because removing them means normalising whitespace or parsing the sibling and §7 item 14 asks the two copies be **byte-identical** — a false drift fails loud and correctable, a false parity fails silent. Both re-measured in round 2 and recorded as an accepted residual below; both named in C7's comment. ⚠️ Still **unmeasured against a real sibling** — C7 skips, 0176 unshipped | **false-parity half ✅ done** · **false-drift half won't fix (frontier)** |
| R8  | CORRECT | Defect | low | Verified `existsSync` returns **true** for a mis-cased citing path on this volume while the target half was already case-exact. Citer check now uses `resolveExact` with the shared cache. ⭐ Control: with a mis-cased key the **old** check leaves L4 green, the **new** one reds it | ✅ done |
| R9  | CORRECT | Defect (doc) | low | ⛔ Owner ruling "Rewrite the worklog's copy (Rec)": the construct is now **described in prose and no longer written out** — no reliance on a backtick span. Second half also addressed: the stale naive figures are re-measured in `worklog.md` §11.2. ⛔ `plan.md` untouched (approved, out of bounds) | ✅ done |
| R10 | CORRECT | Defect (doc) | low | "One entry." → "Two entries." | ✅ done |
| R11 | CORRECT | Defect (doc) | low | `worklog.md` §7 rewritten to carry the hard-gate figures **in the folder** instead of pointing outside it; the review round re-ran the gate rather than carrying the build-round number over. See §11.2 | ✅ done |
| R12 | CORRECT | **Frontier — owner-ruled** | low | ⛔ Owner ruling "Accept as a frontier-move (Rec)". C4 kills the D2-revert mutant only on a case-insensitive volume, so on Linux CI it passes vacuously; C4's diagnostic already names the platform. ⛔ Not made conditional/skipped. Recorded as an accepted residual below | won't fix (frontier) |
| R13 | CORRECT | **Frontier — owner-ruled** | info | ⛔ Owner ruling "Record it as an accepted residual (Rec)". Containment line **kept**. Recorded below, carrying the reviewer's stronger evidence | won't fix (frontier) |

**Nothing suppressed as settled.** Loop check run against *Accepted residuals* (empty on entry) and
against `ai-agents/knowledge-base/decisions/` — **no ADR governs this guard**, so no finding is
re-litigation. All 13 are novel and none is an oscillation against a prior round.

**Convergence call: CONVERGED — act, then close.** These are round-1 findings on a new file, not a
loop. Eleven were actionable and are done; the two frontier-moves are owner-settled and recorded
below. No finding disputes a settled tradeoff, and no fix here reopened one. ⭐ **The guard itself was
not in question in any of the 13** — 26 mutants, no vacuous arm, and the transcribed core diffed
byte-identical to §4.1. Every defect was in what the file *said about itself* or in what its arms
failed to pin.

**⚠️ Two things this round did not close, carried forward rather than dropped:**
1. **L6's diffuse-narrowing slack** — the per-prefix floors stop a narrowing aimed at one tree; one
   spread thinly across all of them is bounded only by L1's floor (**27 files** at 827 scanned).
   Closing it needs an exact corpus count, which L1 rejects for good reason. Stated in the file.
2. **C7 is still unmeasured against a real sibling** and still **skips** — 0176 is unshipped. The
   async fix and both named false-drift edges are verified only against simulations.

⛔ **One residual candidate is deliberately NOT recorded below, because it was not put to the owner:**
R7's false-**drift** half (re-indent, `}` in a string). I judged it a frontier-move and left it
unfixed with the reasoning written into C7's comment, but an *Accepted residuals* entry needs the
owner's confirmation, and there was none for R7 — only for R5, R12 and R13. It is surfaced in the
worker's return instead. **A future round re-raising it is not re-litigation**; it is genuinely
unsettled.

> **SUPERSEDED 2026-09-02 (round 2 append).** The paragraph above records round 1's state accurately
> and is left standing rather than rewritten. It no longer holds: the driver put R7's false-drift
> half to the owner live, who ruled **"Confirm as an accepted residual (Rec)"**. Both edges were
> re-measured and the entry is now the **third** one below. R7's row above was updated to show the
> split. ⛔ The ledger status was **not** re-opened — this is an append inside a closed-out ledger,
> recording a disposition the owner has now made. **A future round re-raising this IS now
> re-litigation, unless one of the entry's re-raise triggers has fired.**

## Accepted residuals (shared, do-not-re-litigate)

- **The containment line in `resolveExact` is kept although deleting it alone reds nothing (R13)** —
  **What:** `resolveExact` keeps §4.1's lexical containment test (`abs === root || abs.startsWith(root
  + path.sep)`) even though, under D2, the per-segment walk already refuses every lexical escape on
  its own, so removing the line reds nothing (18 pass / 0 fail, self-reported at build and
  independently reproduced in review). · **Why (structural):** ⭐ the reviewer's evidence is stronger
  than the build round's own — deleting containment **and** reverting D2 to `existsSync` **together**
  reds **C3 and C4**. The line is therefore load-bearing in precisely the D2-reverted world the file
  says it is, which is the world §7 item 11 wrote it for; it is a **defensive duplicate**, not dead
  code. Removing it would also be an **unapproved fourth deviation** from §4.1, which this task exists
  to transcribe faithfully. C3's comment already states plainly that the test cannot tell the two
  refusals apart, so nothing is overclaimed. Rejected alternative — deleting the line as unreachable:
  buys one line, costs the D2-revert safety net and a deviation nobody approved. · **Re-raise only
  if:** D2 is removed or reverted to `fs.existsSync` (the line becomes the sole mechanism and needs
  its own arm), **or** §4.1 itself drops containment.

- **C4's mutant-killing power is platform-bound, and it stays unconditional (R12)** — **What:** C4
  asserts a wrongly-cased target is broken. On a case-**insensitive** volume (macOS default) it kills
  the D2-revert mutant; on a case-**sensitive** volume `existsSync` already rejects the mis-cased path,
  so the mutant yields the same one broken link and C4 passes **vacuously**. The assertion is correct
  on both platforms — only its value *as the D2 arm* is macOS-only. · **Why (structural):** the
  vacuity is a property of the filesystem, not of the test, and it cannot be asserted away from
  inside the test. C4 already emits a `t.diagnostic` naming which kind of volume it actually ran on
  (`D2 is load-bearing here` / `D2 is redundant here, and harmless`), so a reader of a green run can
  see which case they got. Rejected alternatives — making C4 **skip** on a case-sensitive volume
  (turns a passing correctness assertion into a silent gap, and D2's own point is that the result
  must not depend on who runs it), or creating a case-sensitive volume in-test (not portable, and
  writes outside the tmpdir discipline). ⚠️ Reasoned, not measured — no case-sensitive volume was
  available to either party. · **Re-raise only if:** CI moves to a case-sensitive runner **and** the
  D2 arm is wanted there — then the answer is an added arm that fakes the collision, not a change to
  C4.

- **C7's parity check stays a BYTE comparison, and keeps its two false-drift edges (R7, false-drift
  half)** — **What:** C7 extracts the sibling's `maskFencesAndQuotes` by a brace scan and compares it
  byte-for-byte against `maskFencesAndQuotes.toString()`, so two genuinely equivalent copies can be
  reported as **drifted**. ⭐ **Both edges re-measured 2026-09-02 in round 2, not carried over:**
  (a) **re-indentation** — a simulated sibling whose body carries two extra leading spaces per line
  extracts to **455 chars against our 431** and reds `assert.equal`; (b) **a `}` inside a string
  literal** — simulating a *future* masker that both halves carry (`if (line === "}") return line;`),
  with the sibling file a **byte-identical** copy of it, the brace scan hits `depth === 0` four
  characters early and the slice ends at the map callback's `}` instead of the function's final `}`,
  so **two byte-identical copies compare unequal**. Control: the same added line with `"X"` in place
  of `"}"` extracts to the true end — so the truncation is caused by the string brace, not by the
  added line. ⚠️ Live cost of (b) **today is 0**: our masker contains no `}` inside a string literal,
  and its three regex brace runs (`{0,3}`, `` {3,} `` twice) are balanced pairs the scan survives. It
  bites only once the masker itself gains one. ⚠️ On (a), be precise about *what* is false: under a
  strict reading of §7 item 14 a re-indented copy **is** byte-different, so the report is literally
  correct; it is false only against what a reader wants the word "drift" to mean — *do the two halves
  behave the same*. · **Why (structural):** §7 item 14 asks for byte-identity **because the two copies
  already drifted once** — the specification's own **review round 2** found the same CommonMark
  fence-close bug in BOTH copies, introduced once and copied (quoted in C7's comment; ⚠️ that is a
  round of the specification's review, **not** this ledger's finding R2). Normalising whitespace or parsing the sibling
  would answer a *different, weaker* question than the one that was asked, and this assertion's whole
  value is that it is the strict one. ⭐ **The asymmetry that settles it: a false drift fails LOUD and
  is correctable in one commit; a false parity fails SILENT and leaves the two halves disagreeing
  about what a fenced block is — which is the failure this check exists for.** The false-**parity**
  hole (an `async` sibling extracting to a slice identical to ours) was the silent one, and it **was**
  fixed in round 1: the declaration is now matched with its modifiers. This residual is the deliberate
  price of keeping the remaining comparison strict. Rejected alternatives — normalising leading
  whitespace before comparing (weakens item 14 into "identical modulo indentation", which would have
  to be re-ruled, not assumed), or parsing the sibling with a real JS parser (a dependency and a
  parser to maintain, to remove an alarm that already fails safe). Both edges are named in C7's own
  comment, so a reader who hits one is told why. · **Re-raise only if** — two concrete triggers, and
  **0176 merely landing is NOT one of them**: (1) 0176 ships
  `test/coordination-citation-policy.test.js`, C7 stops skipping, and its **first live run reports
  drift while the two bodies are the same modulo leading whitespace** — checkable by diffing the two
  slices with `sed 's/^[[:space:]]*//'` applied to each; that is the first moment this check has ever
  run against a real second copy, and the moment a false alarm would actually materialise. A green
  C7, or a drift a whitespace-insensitive diff also reports, settles it and this entry stands.
  (2) `maskFencesAndQuotes` gains a `}` inside a string literal in **either** copy — checkable by
  whether the brace scan's slice still ends at the function's final `}`; from then on the scan
  truncates and reports drift between identical copies, and the extractor needs the fix this entry
  declined.
