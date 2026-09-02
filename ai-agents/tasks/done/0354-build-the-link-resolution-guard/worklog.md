# Worklog — 0354, build the link-resolution guard

**Built 2026-09-02.** `HEAD` `c797df4`. Working tree dirty on arrival with other sprint workers'
changes; my own contribution is **one new untracked file**, `test/reference-integrity.test.js`.

Role: Build worker spawned by `fkit-sprint-ship-loop` under its declared-approval marker. The owner
approved `plan.md` live in the driver session ("Approve as written (Rec)"), plus Ruling 2 settling §6
("No prove-red entry — follow the precedent (Rec)"). The approved plan was both standing approval and
scope boundary.

---

## 1. Deliverable

**`test/reference-integrity.test.js`** — one new file, **20 tests** (19 at build time; review
round 1 added C8, see §11). Nothing else changed.

- Picked up by the existing `node --test test/*.test.js` glob. **No `package.json` change, no new
  devDependency, no registration anywhere else** — confirmed by `git status`.
- Per Ruling 2, **no `test/prove-red.sh` entry was added.**

## 2. Measurements, with the commands that produced them

§4.1 was extracted verbatim from the condition document into the session scratchpad — **never into the
repo** — and run from the repo root.

```
$ sed -n '337,513p' ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md \
    > <scratchpad>/link-resolution.js
$ node <scratchpad>/link-resolution.js
BROKEN: 0 instances across 0 files
NAMED-EXEMPT: 6 instances (see the exemption list above, each with its reason)
SCANNED: 825 files
```

**The guard was GREEN on arrival and GREEN at hand-off.** Runtime 0.33s.

### 2.1 Every alternate reading, re-measured today

| Reading | Command | At hand-off | Plan §0 (earlier same day) | §6.2 (2026-08-30) |
|---|---|---|---|---|
| **Settled** | `node link-resolution.js` | **0 broken / 6 exempt / 825 scanned** | 0 / 6 / 824 | 0 / 6 / 819 |
| `NAMED_EXEMPT` emptied | *(effect disabled)* | **6 across 4** | 6 across 4 | 6 across 4 |
| Document-level span masker | `SPAN_SCOPE=doc` | **1 across 1** | 1 across 1 | 1 across 1 |
| Blockquotes counted | `QUOTES=0` | **8 across 6** | 8 across 6 | 8 across 6 |
| Fences only, spans counted | `SPANS=0 QUOTES=0` | **131 across 61** | 130 across 60 | 130 across 60 |
| Naive | `SPANS=0 QUOTES=0 FENCES=0` | **167 across 73** | 166 across 72 | 166 across 72 |
| Closed folders also exempt | `EXEMPT_CLOSED=1` | **0 across 0** | 0 across 0 | 0 across 0 |

⭐ **The settled reading and every masked reading reproduced exactly.** Two figures moved, both by
exactly +1 instance across +1 file, and **both moves are the same single cause**, identified rather
than waved at.

⚠️ **The two naive rows above are a BUILD-TIME snapshot and went +1 stale almost immediately** — this
very worklog became another naive-only instance the moment it was written. Review round 1 (R9) caught
that. ⛔ Do not read them as current: **§11.2 carries the re-measured figures**, and the settled row
— the only one that is the condition — is unchanged at 0 broken / 6 named-exempt throughout.

### 2.2 ⚠️ The +1 in the two naive readings is this task's own `plan.md`

```
$ SPANS=0 QUOTES=0 node <scratchpad>/link-resolution.js | grep 0354
ai-agents/tasks/backlog/0354-build-the-link-resolution-guard/plan.md  (line 191)  ->  relative-target
```

Plan §10 predicted exactly this class of drift and asserted the plan text was safe from it. **The
prediction was right about the outcome and imprecise about the reason.** §10 claims the plan contains
no markdown inline link with a relative destination. It does contain one — literally, inside the very
sentence that makes the claim — but **inside a backtick code span**, so the settled masker masks it
and the settled figure is unmoved at **0 broken**. It surfaces only in the two readings that switch
span masking off, which are not the condition.

⚠️ **This paragraph used to reproduce the construct itself**, saved only by a backtick span of its
own — a span that pairs per line, so reflowing the sentence across a line break would have unpaired
it and reddened the guard on the document describing the guard. Review round 1 (R9) caught that, and
the owner ruled **"Rewrite the worklog's copy (Rec)"** on 2026-09-02: the construct is **described in
prose here and no longer written out**, rather than left depending on a fragile span. ⛔ `plan.md` is
approved and out of bounds for this worker, so line 191 there is unchanged and still carries it.

⛔ **Recorded rather than smoothed over.** No action was taken **in the build round**: the settled
condition is green, and editing the approved `plan.md` is out of bounds for this worker anyway. In
review round 1 the owner ruled that this worklog's own copy be rewritten — done above. `plan.md`
still carries the construct and is still out of bounds.

The scanned-set count moved 824 → 825 for the ordinary reason: `plan.md` itself was written by the
driver after the plan-time measurement.

### 2.3 The two extra measurements the condition document asks 0354 to build in

- **Stale-key check (§7 item 9a) — 0 of 5 keys stale.** All five citing files exist; all six targets
  are still missing. Built in permanently as assertion **L4**.
- **Case-sensitivity (§7 item 11) — 0 divergences.** Segment-walk resolution gives figures
  byte-identical to `fs.existsSync` (0 / 6 / 825 both ways). Built in permanently as **D2**.
- **Working volume of the guard — 3131 link targets resolved**, skips by class: 16 scheme /
  protocol-relative / anchor, 8 elided, 0 empty-after-fragment. Built in as **L8**, which asserts a
  floor and prints the figures on every run.

## 3. D1 / D2 / D3 — the three deviations, as recorded in the file header

| # | Deviation | Cost, measured |
|---|---|---|
| **D1** | CommonJS preamble → ESM preamble. ⭐ Imports are **default** imports (`import fs from 'node:fs'`) rather than **named** ones, precisely so every call site inside the transcribed bodies stays literally `fs.readdirSync` / `path.join` — the change really is the preamble alone. ⚠️ This row and the file header both said "namespace" until review round 1 (R2); a namespace import is `import * as fs`. Only the term was wrong | 0 |
| **D2** | `fs.existsSync` → per-segment case-exact walk (`resolveExact`), keeping §4.1's containment test. Instructed by §7 item 11 | 0 — figures byte-identical |
| **D3** | §4.1's `OPT` environment switches dropped; every switch hard-wired to its settled default | 0 |

⚠️ **One precision the plan's own wording did not carry, and the file header now does.** The plan's D1
row calls `exemptFile` and `maskFencesAndQuotes` "byte-identical". They **cannot** be byte-identical
*and* OPT-free simultaneously, because both reference `OPT`. The header states it exactly: `walk`, `blank`,
`maskCodeSpans`, `LINK`, `SKIP_SCHEME`, `ELIDED` and `NAMED_EXEMPT` are byte-identical;
`exempt` (§4.1's `exemptFile`) and `maskFencesAndQuotes` are byte-identical **modulo D3**, whose removal
of the `OPT.*` references is the only edit to either. Claiming otherwise would overclaim.

⛔ **And the match loop is NOT byte-identical — this section said it was, until review round 1 (R2).**
It reads `root` rather than the module-global `ROOT`, calls `resolveExact` in place of the inline
`fs.existsSync(...) && (...)` test (that **is** D2), and increments the `checked` / `skipped`
counters. Its match rule, skip rules, fragment rule and decode step are transcribed unchanged, and
the decision it reaches for any given link is unchanged — but the text is not identical, and the
header now says so. See §11 entry 2 and the file's **STRUCTURAL ADAPTATIONS** block.

⚠️ **D2 carries one ordering change, and it is not a behavior change.** §4.1 reads
`if (fs.existsSync(abs) && (abs === ROOT || abs.startsWith(ROOT + path.sep)))`. `resolveExact`
evaluates the containment half **first**, because a case-exact walk is defined relative to the root and
is meaningless outside it. `&&` is commutative over two side-effect-free predicates.

## 4. ⭐ Finding — D2 subsumes the containment test. Reported, not hidden.

Proving the arms red (§5) turned up something the plan did not anticipate.

**Deleting the containment line from `resolveExact` and re-running the entire file reds nothing —
18 pass / 0 fail, live figures unchanged.**

The mechanism, confirmed directly rather than inferred:

```
$ node -e "...path.relative('/tmp/root','/etc/hosts')..."
"/etc/hosts"  -> path.relative = "../../etc/hosts" | first segment = ".."
```

For any `abs` outside `root`, `path.relative(root, abs)` begins with a `..` segment, and `..` is never
an entry in a `readdirSync` listing — so **D2's segment walk refuses the escape on its own.**

**Nothing was weakened and nothing was removed.** The containment line stays, because §7 item 11
instructs `0354` to transcribe it and because it is the half that survives if D2 is ever reverted to
`fs.existsSync`. What changed is only the honesty of the **comment**: C3's header now records this
measurement and states plainly that the test **cannot** tell the two refusals apart, instead of
implying it pins containment down. A guard file built to enforce a document about unsafe claims must
not ship an overclaimed one.

## 5. Proving the arms actually red

⛔ No mutation was ever left in the repo. Each mutant was written to `test/.mutant.test.js` — a
leading-dot name the `test/*.test.js` glob does not match — run once, and deleted. Verified absent
after each batch.

| Mutation | Condition broken | Reds |
|---|---|---|
| **A** `exempt()` also exempts `tasks/done/` | the 2026-08-29 in-scope ruling | L1, L3, L6, **M2**, M3, L2 (6 fail) |
| **B** containment test removed | — | ⚠️ **nothing** — see §4 |
| **C** case-exact walk → `fs.existsSync` | D2 | **C4** |
| **D** closing fence may carry an info string | CommonMark close rule | **C2**, L3 |
| **E** span scope line-level → document-level | §7 item 4 | L2, L3 |
| **F** named exemptions never fire | §7 item 9 | L2, L3, **M3** |
| **G** vault exemption removed | ADR-005 | **L5**, **M4** |
| **H** exemption made a post-filter over failures | "exemption is in the definition" | **L5**, **M4** |
| **I** blockquote masking removed | 0176 scoping decision 2 | L2, L3 |
| **J** fence masking removed entirely | §4.1 masking | C2, L2, L3 |
| **K** fragment not stripped before resolution | §4.1 fragment rule | **C6** |
| **L** image syntax matched as a link | §7 item 8's fix | **C5** |

⚠️ **Two mutants in the first batch mis-applied and were re-run, not reported as passes.** D initially
patched a *comment* containing the same text (single-occurrence replacement); F initially produced a
syntax error. The harness was tightened to assert exactly one occurrence of each pattern, and both
were re-run. Their rows above are the corrected runs.

## 6. Verification actually run — §9 of the plan, with results

| # | Step | Result |
|---|---|---|
| 1 | `node --test test/reference-integrity.test.js` | ✅ **18 pass / 0 fail / 1 skip**, 0.51s |
| 2 | Eight live-corpus assertions, figures printed | ✅ 825 scanned, 3131 resolved, 0 broken, 6 named-exempt |
| 3 | Mutation arms M1–M4 (M1 all three runs) | ✅ all four; §5 table is the wider evidence |
| 4 | `grep -nE ':[0-9]+' test/reference-integrity.test.js` | ✅ **no hits** (exit 1) |
| 5 | `git status --porcelain test/ package.json` | ✅ only `?? test/reference-integrity.test.js`; **`package.json` unmodified**; nothing of mine under `tasks/done/`, `tasks/cancelled/`, `wiki-vault/` |
| 6 | `npm test` in full, including `bash test/prove-red.sh` | see §7 |
| 7 | Final re-run of the §4.1 scratchpad script at hand-off | ✅ 0 / 6 / 825 — agrees with the test's own figures |

**C7 is the one skip, and it is deliberate and loud.** `test/coordination-citation-policy.test.js` does
not exist (task 0176 unshipped), so the masker-parity check cannot run. It reports that state as a
diagnostic and skips, rather than passing silently, and goes live automatically the moment 0176 lands.

## 7. `npm test` in full — the hard gate, recorded HERE

⚠️ **This section used to say "recorded in the report accompanying this worklog".** There is no such
report in the task folder — it holds `brief.md`, `plan.md`, `worklog.md` and `review.md` — so plan §9
step 6, the hard gate, was deferred to a place the durable record could not reach. Review round 1
(R11) caught that. The figures are now written down here, where they are auditable.

**Build-round measurement, 2026-09-02, taken by the sprint-loop driver with this file present:**

```
npm test  ->  811 tests, 810 pass, 0 fail, 1 skip
              ✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion
              exit 0
```

**Review-round measurement, 2026-09-02, taken after the round-1 fixes below (§11):** see §11's
verification table — the file grew one test (C8), so the suite reads **812 / 811 pass / 0 fail /
1 skip**, and the hard gate was re-run rather than carried over.

## 8. Decision log, BUILD round — what I did unattended, and why it qualified

ADR-019's audit obligation, transferred with its permission under ADR-032.

**Two entries** (R10: this line read "One entry." above a list of two, and was corrected in review
round 1).

1. **C3's explanatory comment corrected to record the MUT-B measurement.**
   - **Which finding it answers** — none from a reviewer; my own §5 mutation run, which showed C3 does
     not isolate what its original comment implied it isolated.
   - **What changed** — the comment block above `C3` only. Added the measured fact that removing the
     containment line reds nothing, the structural reason (`..` is never a directory entry), and an
     explicit statement that the test cannot tell the two refusals apart. ⛔ **No assertion, no
     production logic, and no transcribed §4.1 line was touched**; the containment line stays.
   - **Why it qualified** — verified `CORRECT` (measured firsthand, twice, with the mechanism
     confirmed); mechanical and localized (one comment block, zero behavior change, test results
     identical before and after); and inside the approved plan, which lists C3 as an assertion to
     ship. It is also the obvious winner: the alternative is shipping an overclaimed comment into the
     one file whose entire purpose is enforcing a document about unsafe claims.

2. **A wrong count in the D1 header comment corrected — "29 existing test files" → 25.**
   - **Which finding it answers** — my own verification of the claims I was about to ship. Plan §2's
     D1 row states "all 29 existing test files are ESM". **Measured: there are 25 pre-existing
     `test/*.test.js` files** (plus 2 `.mjs` helpers, 27 in total); 25 of 25 use `import` and zero use
     `require`. The plan's figure of 29 did not reproduce.
   - **What changed** — the D1 comment in the file header only. The substance of D1's justification is
     unaffected and in fact stronger than stated (the ESM idiom is unanimous); only the count moved.
   - **Why it qualified** — verified `CORRECT` (`ls`/`grep` over `test/`, shown in the report);
     mechanical and localized (one comment line, zero behavior change); inside the approved plan,
     which is where D1 comes from. Obvious winner: transcribing an unreproduced number into the file
     is the precise failure §2 C2 of the condition document is about.
   - ⛔ **`plan.md` was NOT edited to match.** Correcting the approved plan is not this worker's call;
     the discrepancy is recorded here and surfaced in the return instead.

**No other fix was applied without asking, and no other obvious-winner call was made.**

## 9. What the close report must disclose

Carried from plan §8 unchanged, all seven items, re-measured where measurable — blockquote lines
skipped (8 across 6, all quotation today, ⛔ the blind spot is **not** safe); anchor existence never
checked; reference-style definitions out of scope by name; link grammar narrower than the ruled class;
the `NAMED_EXEMPT` (file, target) key suppressing a future rot on the same pair; the fence masker's two
rough edges transcribed knowingly; and ⛔ **green here does not unblock the sweeps** — the gate needs
Half B (0176) green too, which is 0237's work at 19 instances across 14 files.

**Plus one item the plan did not have:** §4 above — D2 subsumes the containment test.

### 9.1 ⭐ An EIGHTH blind spot, found in review round 1 and disclosed by owner ruling

Owner ruling 2026-09-02, option label verbatim **"Disclose as an eighth blind spot (Rec)"**. It sits
alongside the seven from plan §8, in this worklog and in the shipped file's header, and it is stated
precisely rather than softened:

- **Containment is LEXICAL.** `resolveExact` compares strings — it refuses a path that does not lie
  under the root textually, and its segment walk refuses a `..` segment because `..` is never an
  entry in a `readdirSync` listing. **Neither step resolves symlinks.** So an in-repo symlink to,
  say, `/etc` would make a target under it resolve as **satisfied**, and `/etc/hosts` would read as
  a good link. `walk` likewise never follows a symlinked directory and never collects a symlinked
  `.md` file, so such a file is silently outside the scanned set.
- **⛔ It is the SPECIFICATION's hole, not the transcription's.** §4.1 pairs `fs.existsSync` with the
  same lexical `startsWith` test and behaves identically. Closing it needs `fs.realpathSync` — a
  **fourth deviation** from the document this task exists to transcribe faithfully, and unapproved.
  The owner ruled disclosure over a fix on exactly that ground.
- **Live cost 0** — re-verified independently in review round 1: `find ai-agents -type l` returns
  **0 symlinks**. ⛔ That makes today's sample clean; it does **not** make the blind spot safe.
- It also narrows a claim made elsewhere: assertion **C3**'s title, "never satisfied", holds for a
  **lexical** escape. C3's comment now says so.

## 10. Not done, and out of scope

⛔ No commit, no push. ⛔ No task file moved, no board or status edit. ⛔ Nothing written to
`ai-agents/wiki-vault/`. ⛔ No broken link fixed (0355 is cancelled; the red set is 0). ⛔
`test/coordination-citation-policy.test.js` not created — that is 0176's. ⛔ No `prove-red.sh` entry,
per Ruling 2. ⛔ `plan.md` neither re-authored nor overwritten.

---

## 11. REVIEW ROUND 1 — decision log, one entry per fix

Role: **Process-review worker** spawned by `fkit-sprint-ship-loop` under its declared-approval
marker (ADR-032 Decision 3 + its autonomy amendment; discipline per ADR-019). The owner approved
`plan.md` live in the driver session, and that plan is both the standing approval and the scope
boundary. Every fix below is recorded because it was applied **without a per-fix approval**, which is
ADR-019's audit obligation transferred with its permission.

⛔ **Four findings were settled by live owner rulings, not by me** — R5 (disclose as blind spot 8),
R13 and R12 (accepted residuals), R9 (rewrite this worklog's copy). Their labels are quoted verbatim
in `review.md` and in §9.1 above.

**Nine entries.** Each says which finding it answers, what changed, and why it qualified — verified
`CORRECT` + mechanical/localized + inside the approved plan, or an obvious winner within the plan's
intent.

1. **R1 — C3's failure message corrected.** *Answers:* R1. *Changed:* the assertion string in C3
   only; it still claimed "Containment is what stops that" after the build round had corrected the
   comment above it to record the opposite. It now names both refusals (segment walk + the
   containment line it duplicates) and says rebasing is not one of them. *Qualified:* verified
   `CORRECT` by reading the two against each other; one string, zero behaviour change; C3 is an
   assertion the approved plan §4 ships.

2. **R2 — the header's transcription-fidelity account corrected in three places.** *Answers:* R2.
   *Changed:* (a) "There are three, they are named, **nothing else differs**" was false — a new
   **STRUCTURAL ADAPTATIONS** block now names S1 the root seam, S2 the instrumentation and S3 the
   shape, each plan-approved (§3, §5) and each behaviour-neutral; (b) the match loop was listed as
   "byte-identical" and is not — it reads `root` not `ROOT`, calls `resolveExact`, and increments
   counters, so it is now named as **not** byte-identical with the differences enumerated;
   (c) "NAMESPACE imports" corrected to **DEFAULT** imports (a namespace import is `import * as`),
   the reason for the choice unaffected. *Qualified:* verified `CORRECT` against §4.1 read in full;
   comments only, zero behaviour change. ⭐ **These are not a fourth deviation** — nothing the guard
   decides changed, which is exactly why the block is titled adaptations rather than deviations.

3. **R3 — the three unpinned transcribed branches pinned.** *Answers:* R3. *Verified first:* live
   counts measured **0 root-absolute / 0 percent-encoded / 0 angle-bracket** targets across the
   whole corpus, and deleting each branch reddened **nothing** (18 pass / 0 fail, three times).
   Under Ruling 2 the M and C arms **are** the mutation proof, so an unpinned branch is a hole in
   it. *Changed:* C3 gained a root-absolute target that resolves **because** of the rebase
   (`/ai-agents/knowledge-base/architecture.md`) — the three escapes already there red under either
   rule, so they never pinned it; and a new test **C8** pins percent-decoding and angle-bracket
   destinations, each with a resolvable case and a missing case. *Red proof:* mutating the rebase
   branch now reds **C3 alone**; removing `decodeURIComponent` reds **C8 alone**; removing the `<>`
   strip reds **C8 alone**. *Qualified:* mechanical additions; inside plan §4, whose C-list exists
   to be the mutation proof.

4. **R4 — L6 changed from `.some()` to a floor per prefix.** *Answers:* R4. *Verified first:*
   per-prefix counts measured 2026-09-02 — done **561**, cancelled **13**, sprints/done **6**,
   sprints/reviews **2**, knowledge-base **102**. *Changed:* each prefix must now clear a floor set
   below its measured count (400 / 10 / 5 / 2 / 80), with the reasoning and the `sprints/reviews`
   tightness written into the comment. *Red proof, and it is the decisive one:* silently re-exempting
   **12 of the 13** files under `tasks/cancelled/` passed the **entire file** under the old `.some()`
   — **19 pass / 0 fail** — and under the floors it reds **L6 and nothing else** (18 pass / 1 fail).
   *Qualified:* verified `CORRECT` and measured both ways; localized to one assertion; L6 is a plan
   §4 assertion and this is the regression its own comment says it exists to catch.
   ⚠️ **Residual stated in the file, not hidden:** the floors stop a narrowing aimed at one tree; a
   narrowing spread thinly across all of them is bounded only by L1's floor — **27 files of slack**
   at 827 scanned. Closing that needs an exact corpus count, which L1 rejects for good reason.

5. **R6 — M4 given the anti-vacuity lines M1 already had.** *Answers:* R6. *Verified first:* with
   `collectFiles` stubbed to return nothing, 11 tests failed and **M4 was not one of them** — every
   M4 assertion is satisfied by `visited: []`. *Changed:* `r.scanned >= 2` and `r.checked >= 1`
   added, mirroring M1's `a.checked >= 2` one screen earlier. *Red proof:* the same stub now fails
   **13** tests, M4 among them. *Qualified:* two lines, copied discipline, zero behaviour change.

6. **R8 — L4's citer check made case-exact.** *Answers:* R8. *Verified first:* `fs.existsSync` on
   this volume returns **true** for a deliberately mis-cased citing path, while the target half of
   the same test was already case-exact — the "result depends on who runs it" failure D2 exists to
   remove, reintroduced in the assertion that guards D2's own exemption list. *Changed:* the citer
   check now calls `resolveExact` with the cache the target check already uses. *Red proof, with a
   control:* mis-case one `NAMED_EXEMPT` citing path and the **old** `existsSync` leaves L4 **green**
   (2 unrelated fails); the **new** check reds **L4** (3 fails). The fix is demonstrably what catches
   it. *Qualified:* one line; D2 is the approved plan's own instruction.

7. **R7 — C7's extractor: the false-PARITY half fixed, the false-DRIFT half deliberately not.**
   *Answers:* R7. *Verified first:* simulated five sibling shapes — `indexOf('function
   maskFencesAndQuotes(')` accepts an **`async`** sibling as identical (false parity), and reports
   drift on a re-indented copy and on a `}` inside a string literal (false drift); genuine drift is
   caught and a genuine copy is accepted. *Changed:* the declaration is now matched with its
   modifiers by regex, so an async sibling reports drift; both false-drift edges are **named in the
   comment and left in place**. *Why the rest was not fixed:* removing them means normalising
   whitespace or parsing the sibling, and §7 item 14 asks for the two copies to be **byte-identical**
   — loosening the comparison weakens the thing asserted. A false drift fails loud and correctable;
   a false parity fails silent, and that is the half that was closed. ⚠️ **Unmeasured against a real
   sibling** — `test/coordination-citation-policy.test.js` does not exist (0176 unshipped), so C7
   still **skips**, and this whole assertion is exercised only against simulations.

8. **R10 — "One entry." above a list of two, corrected to "Two entries."** *Answers:* R10. *Changed:*
   §8's count line only. *Qualified:* counted the list; obvious winner — a decision log whose own
   count is wrong is the failure mode ADR-019's audit obligation exists to prevent.

9. **R11 — the hard gate written into the folder instead of pointed at.** *Answers:* R11. *Changed:*
   §7 rewritten to carry the figures. *Qualified:* the worklog is the durable record and plan §9
   step 6 is the gate; deferring it to a file that is not in the folder is the defect.

⛔ **`plan.md` was not touched.** Approved, and out of bounds. ⛔ **No mutant file survives any run** —
each was written to `test/.mutant.test.js` (a leading-dot name the `test/*.test.js` glob does not
match), the harness asserted **exactly one occurrence** of its pattern before applying, and absence
was verified after every batch. ⛔ **No assertion was weakened to make anything pass.**

### 11.1 Verification actually run, review round

| # | Step | Result |
|---|---|---|
| 1 | `node --test test/reference-integrity.test.js` | ✅ **20 tests, 19 pass, 0 fail, 1 skip** (C7), 0.55s |
| 2 | Live figures printed | ✅ **827 scanned, 3131 resolved, 0 broken, 6 named-exempt**; skips 16 scheme / 8 elided / 0 empty-after-fragment |
| 3 | `npm run test:unit` | ✅ **812 tests, 811 pass, 0 fail, 1 skip**, 63.1s |
| 4 | Red proofs for every added or tightened assertion | ✅ six mutants, each killing the intended arm — see entries 3, 4, 5, 6 |
| 5 | `grep -nE ':[0-9]+' test/reference-integrity.test.js` | ✅ **no hits** (exit 1) |
| 6 | `git status --porcelain test/ package.json` | ✅ only `?? test/reference-integrity.test.js`; `package.json` unmodified |
| 7 | `find ai-agents -type l` | ✅ **0** — blind spot 8's live cost independently re-verified |
| 8 | §4.1 scratchpad script re-run at hand-off | see §11.2 |
| 9 | `npm test` in full, including the `prove-red.sh` hard gate | see §11.2 |

### 11.2 The §4.1 script re-run at review hand-off, and what moved

Same method as §2 — §4.1 extracted verbatim into the session scratchpad, **never into the repo**, run
from the repo root.

| Reading | At review hand-off | Reviewer measured (round 1) | Build hand-off (§2.1) |
|---|---|---|---|
| **Settled** | **0 broken / 6 exempt / 827 scanned** | 0 / 6 / 826 | 0 / 6 / 825 |
| Document-level span masker | **1 across 1** | 1 across 1 | 1 across 1 |
| Blockquotes counted | **8 across 6** | 8 across 6 | 8 across 6 |
| Fences only, spans counted | **131 across 61** | 132 across 62 | 131 across 61 |
| Naive | **167 across 73** | 168 across 74 | 167 across 73 |
| Closed folders also exempt | **0 across 0** | 0 across 0 | 0 across 0 |

⚠️ **R9's second half, answered with a measurement rather than a caveat.** The reviewer was right
that §2.1's two naive figures had gone **+1 stale**: the extra instance was **this worklog itself**,
which did not exist when §2.1 was measured. Rewriting the sentence per Ruling D removed it, and the
two readings are back at **131 across 61** and **167 across 73**. ⛔ **That they again equal the
build-hand-off numbers is partly coincidence, not proof of stasis** — the corpus also grew 825 → 827
in between, and those two added files happen to contribute no naive hits. The naive-only hits left
inside this task folder are `brief.md` and `plan.md`, both out of bounds for this worker.

⭐ **The settled reading — the only one that is the condition — has never moved: 0 broken, 6
named-exempt, at every measurement by every party.**

### 11.3 The hard gate, re-run on the post-fix file

⛔ Not carried over from the build round: the file changed, so the number was re-measured.

```
$ npm test                                    # 2026-09-02, review round 1, post-fix file
  ℹ tests 812
  ℹ pass 811
  ℹ fail 0
  ℹ skipped 1                                 # C7 — sibling half not built (0176 unshipped)
  ...
  28. one list item re-indented — "uniformity: identical modulo ONE uniform offset" should go RED ... red

  ✓ hard gate PASSED — real + unmutated copy green; each mutation reds its NAMED assertion.
  EXIT=0
```

All **28** `prove-red.sh` mutations reddened their named assertion, and the unmutated copies were
green — so the gate itself is not passing vacuously. ⛔ **This file still adds no mutation of its own
to `test/prove-red.sh`**, per Ruling 2; the six review-round red proofs in §11 are its equivalent,
and they are recorded there with the arm each one killed.

## 12. REVIEW ROUND 2 — decision log (one append, no code change)

Role: **Process-review continuation worker** spawned by `fkit-sprint-ship-loop` under the same
declared-approval marker as §11 (ADR-032 Decision 3 + its autonomy amendment; discipline per
ADR-019). Surface this round: **`review.md` and this file only.**

⛔ **No fix was applied without asking, and no obvious-winner call was made — `none` on both counts.**
The one substantive act was carrying out an **explicit live owner ruling**, so it is recorded here as
a disposition, not as unattended autonomy.

**One entry.**

1. **R7's false-drift half — recorded as an accepted residual, per owner ruling.** *Answers:* R7
   (the half §11 left unrecorded because it had not been put to the owner). *Ruling, verbatim
   option label, 2026-09-02:* **"Confirm as an accepted residual (Rec)"** — so C7's comparison
   **stays byte-identical** and neither false-drift edge is fixed. *Changed:* three edits in
   `review.md` — the *Accepted residuals* list gained a third entry (What / Why / Re-raise only if);
   R7's *Coder response* row now shows the split (false-**parity** half `✅ done`, false-**drift**
   half `won't fix (frontier)`); and the round-1 paragraph that said the candidate was "deliberately
   NOT recorded" carries a dated **SUPERSEDED** note rather than being rewritten. *Re-measured, not
   carried over:* (a) a re-indented sibling extracts to **455 chars vs our 431** and reds; (b) with a
   simulated future masker containing `if (line === "}") return line;`, a **byte-identical** sibling
   copy extracts **four characters short** — the slice ends at the map callback's brace — while the
   `"X"` control ends at the true end, proving the string brace is the cause. Live cost of (b) today
   is **0**; our masker has no `}` in a string literal. *Qualified:* an owner ruling executed as
   given, inside the approved plan's review-processing step; `test/reference-integrity.test.js` was
   **not touched** (`git diff --stat` on it: empty). *Not done:* nothing was re-opened — the ledger
   still reads `closed-out`, and this is an append inside it.
