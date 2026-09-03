# Worklog — `0176` Build the coordination-citation policy guard

**Built 2026-09-02/03 by a spawned `fkit-coder` (Build worker of `/fkit-sprint-ship-loop`), under the
declared-approval marker: the owner approved the plan live on 2026-09-02, option label verbatim
"Approve as written (Rec)", plus five further rulings (G1–G5) recorded in the plan's appendix.**

> ⚠️ **CITATION DISCIPLINE IN THIS FILE.** This worklog lives in an **open** task folder, so it is
> inside the guard's own scanned set and is **not** exempt. Every coordinate below is therefore
> rendered in the two-cell form — the document in one column, the line number in another — or as a
> bare file name with the line named in prose. ⛔ Nowhere in this file is a full `ai-agents/` path
> written with a colon and a line number after it. §8 check 10 measures that rather than trusting it.

---

## 1. Change surface

**One new file. Nothing else created or edited by me.**

| File | Change |
|---|---|
| `test/coordination-citation-policy.test.js` | ⭐ **NEW** — 773 lines, 51,050 bytes. The only file I created or edited |
| `package.json` | ⛔ unchanged — picked up by the existing `node --test test/*.test.js` glob |
| `test/prove-red.sh` | ⛔ **byte-unchanged**, 28 mutations. Owner ruling G2, "Yes, inherit (Rec)" |
| `test/reference-integrity.test.js` | ⛔ **unchanged** — but its behaviour changed anyway; see §5 |
| `plan.md` | ⛔ not touched. The driver wrote it at the approval gate |
| `brief.md` | ⛔ not touched by me. It shows modified because the **driver** flipped its status row |
| `ai-agents/tasks/done/**`, `cancelled/**`, `wiki-vault/**` | ⛔ never written, never even walked by this guard |

⛔ No commit, no push. No task file moved. Nothing written to the wiki vault. No secrets in any artifact.

---

## 2. ⭐ The revision transcribed, and the checksum discrepancy

Plan §12 step 1 required this be recorded rather than glossed.

| Item | Value |
|---|---|
| Condition document | `ai-agents/knowledge-base/reports/2026-08-29-the-reference-integrity-condition.md` |
| Revision taken | **`c797df4`** — its only commit. Working tree verified clean for that file at build time |
| Document md5 measured at build | `163d85e16df278706ebc2d6c59a31998` |
| §4.2 extract md5 (the fenced script alone) | `6c6242a6d57f3625961143b723c3e0ad` |
| §4.2 extract range | the fenced `js` block, lines 519–669 of that document |

⛔ **The brief's recorded document checksum does not resolve to any committed revision.** The brief
records `fea9ce0a5b71acda7f3070e76d0f8ccc`. The document has exactly one commit (`c797df4`), whose
content hashes to `163d85e1…`. The brief's figure was taken on 2026-08-30 from an **uncommitted
working tree**, while review round 2 was still open — which the brief itself warned about, asking that
the implementer *"say in the worklog which revision you took"*. This is that record.

⭐ **The plan's independently-taken §4.2 extract checksum reproduced exactly** at build time
(`6c6242a6…`), so the script I transcribed is the same one the plan measured against.

---

## 3. Before / after figures

**Method:** the §4.2 script extracted verbatim to the **session scratchpad — never into the repo** —
and run with `node` from the repo root. Nothing was written into the working tree.

### 3.1 The settled condition

```
SCANNED:  719 files
TOTAL:    166 citations across 66 files
EXEMPT:   166 across 66 files
RESIDUAL: 0 across 0 files
```

⭐ **`RESIDUAL: 0 across 0` — reproduced.** §8 check 1's stop-condition did **not** trigger: the
residual had not moved, so there was nothing to report and nothing to clean (cleanup was `0237`'s
scope, and `0237` is closed).

### 3.2 Every recorded alternate reading, re-run at build time

| Reading | Switches | Scanned | Total | Exempt | Residual | vs. the plan gate |
|---|---|---|---|---|---|---|
| ⭐ **Settled** | all defaults | 719 | **166 / 66** | 166 / 66 | ⭐ **0 / 0** | unchanged |
| Nothing masked | `FENCES=0 QUOTES=0` | 719 | ⚠️ **174 / 67** | 174 / 67 | 0 / 0 | ⚠️ **moved** — plan measured 166 / 66 |
| Spans also skipped | `SPANS=1` | 719 | ⛔ **5 / 4** | 5 / 4 | 0 / 0 | unchanged — ⭐ the 33× trap, reconfirmed |
| Widened to the archived sprint trees | `WIDE=1` | 727 | 172 / 68 | 166 / 66 | ⛔ **6 / 2** | unchanged at +6 (the brief records +4) |
| 2026-08-01 exemption shape | `OLD_EXEMPT=1` | 719 | 166 / 66 | 117 / 43 | ⛔ **49 / 23** | unchanged — reproduces the brief's own figure exactly |

### 3.3 Two figures that MOVED against the plan, named rather than carried

⚠️ **The plan reported three of the brief's figures as non-reproducing. Two of the plan's own figures
did not reproduce for me either, and I report mine rather than restating the plan's.**

**(a) Scanned-set size: 718 → 719.** Fully explained and expected. The driver wrote `plan.md` into
this task's folder after the plan gate, and that folder is inside the scanned set. The plan predicted
this in its blind spot 1.

⭐ **And the discipline held:** measured directly, this task's `plan.md` contributes **0 hits even
completely unmasked**. The two-cell rendering survived the driver's paste.

**(b) ⛔ The masking convention moves the total by 8 today, not by 0.** The plan measured `166 / 66`
both with and without the fence-and-blockquote convention, and concluded *"today it moves the total by
0"*. At build time I measure **174 / 67** unmasked against **166 / 66** masked — a delta of **8
instances across 2 files**.

Located precisely rather than left as a discrepancy. Both contributing files are **closed**, so they
are inside the exemption and the **residual cost is 0**:

| Contributing file | Masked | Unmasked |
|---|---|---|
| `0270`'s review ledger, in `done/` | 6 | 7 |
| `0353`'s review ledger, in `done/` | 0 | 7 |

⛔ **This does not restore the brief's claim, it further refutes it.** The brief states the convention
*"changes the count by zero (38 either way)"*, twice and as a hard zero. The true reading is that the
figure is **tree-dependent**: 8 on 2026-08-30, 0 at the plan gate, 8 again at build time. The
**decision is unchanged** — adopt the convention, per scoping decision 2 — but its stated
justification is withdrawn as false. This is recorded in the shipped file as blind spot 6.

---

## 4. ⭐ Both red runs (§8 check 6)

**Method.** The shipped guard has **no environment seam** — that is deviation D2, and inventing one
was refused. So each red run was made against a **scratchpad copy** of the shipped file with exactly
one line changed (the body of `exempt`), the harness import rewritten to a literal repo root. ⛔
Nothing was written into the repo and the shipped file was never edited.

| Red run | Mutation | Residual | Arms that red |
|---|---|---|---|
| **A** ⭐ | `exempt()` inverted to `return false` | ⭐ **166 across 66** | 4 — L2, L3, L5, M4 |
| **B** ⭐ | `exempt()` restricted to the 2026-08-01 shape (`done/*/review.md` only) | ⭐ **49 across 23** | 3 — L2, L5, M4 (17 pass / 3 fail) |

⭐ **Both reproduce the plan's predicted figures exactly, and red run B reproduces the brief's own
"49 across 23" figure exactly.** The guard is not vacuous: breaking the exemption in either direction
turns the suite red, and it names which arms.

---

## 5. ⭐ C7 armed — an existing test file changed behaviour without being edited

`test/reference-integrity.test.js` carries arm **C7 masker parity with the citation half (§7 item
14)** — a byte-for-byte source comparison of `maskFencesAndQuotes` between the two shipped halves. It
was `skip`ped with a loud diagnostic because the sibling did not exist.

| | Before this task | After |
|---|---|---|
| `node --test test/reference-integrity.test.js` | 20 tests, 19 pass, **1 skip** | ⭐ **20 tests, 20 pass, 0 skip** |

⭐ **The skip→pass transition is the proof C7 armed**, and it confirms the transcription matched
byte-for-byte against the **real** file — the plan had only been able to verify this against a
simulated sibling (its blind spot 2, now discharged).

**What that parity constrains, recorded so the next editor does not trip it.** The masker must stay at
column 0, must contain no `}` inside a string literal, and any change must be made in **both** files
in the same edit. ⚠️ The shipped form is the **OPT-free** one, not §4.2's OPT-gated one — those two
instructions collide, and D2 resolves it (the settled condition *is* every switch at its default).

---

## 6. Verification — every §8 check with its measured result

| # | Check | Expected | ⭐ Measured |
|---|---|---|---|
| 1 | §4.2 re-measure before the green run | RESIDUAL 0 / 0 | ⭐ **0 across 0** — pass, no stop |
| 2 | `node --test test/coordination-citation-policy.test.js` | all arms pass | ⭐ **20 tests / 20 pass / 0 fail / 0 skip** |
| 3 | `node --test test/reference-integrity.test.js` | 20 / 20 / 0 skip | ⭐ **20 / 20 / 0 skip — C7 armed** |
| 4 | `npm test` | ~830, **0 fail, 0 skip** | ⭐ **832 tests / 832 pass / 0 fail / 0 skip**, exit 0 |
| 5 | `bash test/prove-red.sh` | `✓ hard gate PASSED`, 28 mutations | ⭐ **PASSED**; **28** mutations each redding its named assertion; file byte-unchanged per `git status` |
| 6 | Both red runs | 166 / 66 and 49 / 23 | ⭐ **both exact** — see §4 |
| 7 | `git status` over the two closed trees (widened per correction 7) | empty | ⭐ **empty** |
| 8 | `git status` overall | one new untracked file | ⭐ one new untracked test file, plus this worklog and the driver's `plan.md` / `brief.md` |
| 9 | Step 7 disclosure by name | required | ⭐ §7 below, and in the shipped file's header |
| 10 | ⭐ **This worklog contributes 0 hits** — re-measured with it on disk | 0 | ⭐ **0 hits even completely UNMASKED.** The two-cell discipline held |

⭐ **Every check above I measured myself**, on the final tree with this worklog on disk. Two harness
interruptions (the machine slept mid-run) killed earlier `npm test` attempts; checks 4 and 5 were
re-run to completion afterwards and are my own readings, not carried from anyone else.

⭐ Check 4's load-bearing prediction was **`0 skip`, not the total**, and it came back **`0 skip`** with
the total at 832.

⚠️ **One figure moves with this worklog:** the scanned set is **720** files once `worklog.md` lands
(719 before it, 718 at the plan gate). `TOTAL`, `EXEMPT` and `RESIDUAL` are unchanged at 166 / 166 / 0,
which is the point of check 10.

---

## 7. ⛔ THE ACCEPTED INCOMPLETENESS — stated in full, by name

⛔ **Verification step 7 is mandatory: a close report presenting this guard as complete has failed
verification. Being the gate on `0356`, `0357` and `0358` does not make it complete.**

### 7.1 The two named specimens, re-verified firsthand at build time

| Specimen | Status at build time | Why the guard does not flag it |
|---|---|---|
| ⭐ **`0013`'s brief** — a link whose **visible label** is bare shorthand (a board name plus a line number) that does not match the literal `ai-agents/`-prefixed form | ⭐ **In `backlog/` — OPEN and NOT exempt.** Confirmed present; the coordinate sits on **line 28** | **The literal reading alone.** ⭐ This is the **live** specimen: the guard walks this file, reads this line, and does not flag it |
| **`0160`'s brief** — the brief describes it as *"in three places"* | ⚠️ **In `done/` — now exempt** | ⭐ **Two reasons now, where 2026-08-01 had one:** the literal reading **and** the closed-folder exemption. Step 7's wording is still true; its *reason* has changed |

⚠️ **A precision on "three places", measured rather than repeated.** I count **5** bare-shorthand
file-name-plus-line-number coordinates in `0160`'s brief at build time, **not three** — four distinct
forms, one of which occurs twice. The most likely explanation, **which I flag as unconfirmed**, is
that the 2026-08-01 count predates the 2026-08-30 widening of the cited class (one of the five names a
`plan.md`, which was not then in the class) and that the repeated coordinate was counted once. **I
report the measured 5 and this discrepancy rather than silently restating "three".**

### 7.2 The four further blind spots the re-scoping requires be disclosed alongside

Each **re-measured at build time**, not inherited from the brief.

| Blind spot | ⭐ Re-measured cost |
|---|---|
| **Source-file coordinates** (a `claude/…` or `test/…` path plus a line number) are not flagged | ⭐ **223 instances across 44 files** among records that could actually go red; **1615 across 328** counting the exempt closed folders too. ⚠️ Counts **coordinates, not verified-stale ones**, and is **matcher-dependent** — the plan measured 216–250 across three matchers and reported 249 / 45 over the same non-exempt subset |
| **Citing sites outside the scanned set** — the known-stale citations in `test/` and `claude/skills/` | **3.** Both prongs fail (target class *and* citing scope). Red-team fixtures, not an instruction to widen |
| **No right-hand closure; permissive folder segments** — a malformed coordinate in prose can match | **0 today** |
| **No elision rule** — an elided folder segment still counts for this half | **45 hits, all inside the exemption → residual cost 0** |

⚠️ **On that last row:** the brief records *"1, arguably 2, both inside the 19"*. That figure **no
longer reproduces**, because `0237` cleared the residual and the folders carrying those hits have since
closed. ⛔ **"Cost 0" means 0 residual, not 0 problems** — I did not audit the 45.

### 7.3 The shorthand extension — named, not implemented (§8 check 10)

⭐ **OWNER RULING 1 (2026-08-01) is unchanged and was NOT reopened.** Resolved shorthand — a bare board
name, or a bare `NNNN/brief`, followed by a line number — is refused **by name**: not folded in, not a
flag, not behind an option. ⭐ It is now **pinned as a positive assertion** (arm **M6**, four shorthand
forms plus a live control), so a later well-meaning widening turns the suite **red** instead of sliding
in as an improvement.

### 7.4 ⭐ An open review ledger reds — the ruled behaviour, and its unmeasured cost

An open task's `review.md` is inside the scanned set and is **not** exempt, while the reviewer's own
skill prescribes a findings table whose column is named `file:line`. So this guard **will** red on a
correctly-formed review ledger whose subject is a coordination document.

⭐ **Owner ruling G1, 2026-09-02, option label verbatim "A + file follow-up D (Rec)".** Option A ships:
**no exemption for review ledgers.** ⛔ **Option B — exempting open review ledgers — was REFUSED by
name** as a silent widening of *"closed records are frozen"* into *"ledgers anywhere"*.

| Measure | At build time |
|---|---|
| `review.md` files anywhere under the tasks tree | **133** |
| …of them in `backlog/` (open, scanned, **not** exempt) | ⭐ **0** |
| …of them in `done/` (exempt) | **133** |
| Residual hits contributed by any review ledger | ⭐ **0** |

⛔ **The cost is entirely PROSPECTIVE and its RATE IS UNMEASURED.** It lands the first time a stateful
review runs on a task whose subject is a coordination document — which is exactly the shape of the
three sweeps this guard gates. **Follow-up "D"** (amending the reviewer skill's guidance so its
`file:line` column reads *"heading + fragment where the target is a coordination document"*) is the
**producer's to file** and does **not** block this task.

⚠️ **The dodge has already been used and it cost something:** `0237`'s review ledger measures clean
only because its reviewer split every coordinate across two table cells — and **that ledger's own
finding R1 is a complaint that the resulting anchor is ambiguous.** The workaround produced the defect
the workaround's own author then filed.

---

## 8. ⛔ Blind spots — what this BUILD does not cover

Carried forward from the plan's §11, each re-checked at build time, plus what the build added.

1. ⭐ **DISCHARGED — C7 parity is now verified against the real file**, not the plan's simulated
   sibling. 20 / 20 / 0 skip.
2. ⭐ **DISCHARGED — this task's own artifacts contribute 0 hits.** Both `plan.md` and this `worklog.md`
   measured **0 hits even completely unmasked**, with the worklog on disk (§6 check 10).
3. ⭐ **DISCHARGED — `npm test` and `prove-red.sh` were re-run to completion and are my own readings.**
   Two harness interruptions killed earlier attempts; the final runs are mine (832 / 832 / 0 fail /
   0 skip; hard gate PASSED at 28 mutations).
4. **The prong-B figure counts coordinates, not verified-stale ones**, and is matcher-dependent
   (216–250 across four matchers over the non-exempt subset). An unknown fraction are still accurate.
5. **I did not audit the 45 elided hits** for genuine rot. All are inside the exemption, so the
   guard's verdict is unaffected — but "cost 0" means 0 residual, not 0 problems.
6. **The review-ledger cost is priced on principle, not on a rate** (§7.4). Today's cost is 0; how
   often future reviews produce these coordinates is **not measurable from here**.
7. ⚠️ **The `WIDE=1` cost is +6 where the brief records +4, and I did not identify which 2 are new.**
   Reported, not explained.
8. ⚠️ **Every live figure is a snapshot of a tree this team writes to continuously.** The repo's own
   coordination documents are inside the scanned set.
9. **I did not touch `0361`'s claim about the closed-rank guard.** It does not bear on this work — that
   file is a sibling content guard but shares no code with mine. Reported, not fixed.
10. ⛔ **The guard is SYNTACTIC and always will be.** It cannot verify that any line number still says
    what the citer meant. That half is unenforceable.

---

## 9. ⭐ DECISION LOG — every call applied without asking

Per ADR-019's audit obligation, carried to this spawn by ADR-032. Each entry names **what changed** and
**why it qualified** (verified `CORRECT` + mechanical/localized + inside the approved plan, or an
obvious winner within the plan's intent). ⛔ **No judgment call was taken unilaterally; nothing here
changes what the guard decides beyond what the plan and rulings G0–G5 already settled.**

| # | Call | Why it qualified |
|---|---|---|
| 1 | **Kept §4.2's asymmetry** — the tasks tree is guarded by `existsSync`, the sprints directory is read unguarded — rather than "fixing" it. Fixtures were made to always create both instead | ⭐ Transcription fidelity. Adding a guard would have been an **unnamed sixth deviation**; the plan named exactly five. Mechanical, in-plan, and recorded in a code comment |
| 2 | **Added a negative case to arm M5** — a task-folder `.md` outside the ruled four (brief / plan / worklog / review) must **not** match | In-plan intent: M5 exists to pin the widened cited class, and pinning a **closed alternation** requires the negative. Mechanical, changes no shipped behaviour |
| 3 | **Broadened arms M6 and M7 from 2 cases each to 4** | Mechanical, same assertion shape, strictly more coverage of a refusal the plan already required be pinned |
| 4 | **Added an indented-blockquote case to arm C3** | Mechanical; the transcribed rule is `/^\s*>/` and the indented form is the half a reader would doubt |
| 5 | **Added a non-vacuity guard to arm L6** — each excluded tree must actually exist on disk | In-plan intent, and directly modelled on the sibling half's own L5 precedent. Without it the exclusions pass for the wrong reason |
| 6 | **Renumbered the shipped header's blind spots to 1–11**, adding "green here is not a complete guard" and the review-ledger item as numbered entries | Presentation only. Every item the plan listed is present; two ruled facts were promoted from prose to numbered entries so step 7's disclosure is findable |
| 7 | ⭐ **DECLINED to add a `total` floor to arm L3**, though the sibling half has an equivalent | ⛔ **Deliberate restraint.** The plan assigned anti-vacuity to L1 and L3's `exemptCount > 0`, which already reds if the matcher dies. Adding a floor would have been outside the approved arm list. **Recorded because a later reviewer may reasonably want it** — that is the owner's call, not mine |
| 8 | **Reported my own measured figures where they disagreed with the plan's** — the masking-convention delta (8, not 0) and the prong-B count (223 / 44, not 249 / 45) | Explicitly instructed: *"if a figure does not reproduce, say so rather than carrying the plan's number."* Both discrepancies are located and explained above |

⛔ **No obvious-winner call was made.** ⛔ **No frontier-move, no scope widening, no behaviour-changing
fix, and nothing outside the approved plan.** Every ruled question (G1–G5) was implemented as ruled;
none was reopened.

---

## 9.1 ⭐ DECISION LOG — review round 1 (2026-09-03), the process-review step

Same ADR-019 audit obligation, carried by ADR-032 to the sprint loop's Process-review worker. ⛔ **Every
code change below was applied under a NAMED owner ruling given live on 2026-09-03, not under the
standing in-plan approval** — the reviewer's findings R1 and R2 add arms **beyond** the plan's approved
arm list, and rulings H1 and H2 are exactly the authority that list otherwise withheld. Nothing was
applied on my own judgment.

| # | Finding answered | What changed | Why it qualified |
|---|---|---|---|
| 1 | **R1** — owner ruling G1 was the one ruling with no arm pinning it | ⭐ **New arm `M9`** in `test/coordination-citation-policy.test.js` — plants a coordinate in an **open** `review.md`, requires it to RED, and asserts the predicate both ways (open ledger not exempt, its closed twin exempt) | ⭐ Owner ruling 2026-09-03, option label verbatim **"Add the arm now (Rec)"**. Verified `CORRECT` firsthand before writing anything: appending `\|\| rel.endsWith('/review.md')` to `exempt()` left the pre-existing suite **20/20 green**. Localized — one new arm, no existing arm and no shipped function touched |
| 2 | **R2** — `L3` had no floor on `total` | ⭐ **New assertion** `LIVE.total > 120` inside `L3`, with the measurement and "a floor, never a count" in the comment | ⭐ Owner ruling 2026-09-03, option label verbatim **"Add the floor now (Rec)"**. ⭐ **This is the decision §9 entry 7 deliberately declined to take and referred to the owner** — the referral was correct and it has now been answered. Verified `CORRECT` firsthand: narrowing `TARGET`'s `:\d+` to one- and two-digit line numbers drops the live corpus **166 across 66 → 78 across 45** and the suite stayed **20/20 green** |
| 3 | **R5** — the parity comment mis-stated C7's constraint as "column 0" | Comment above `maskFencesAndQuotes` rewritten: the invariant is the **body's** indentation, because C7 slices from the `function` keyword and never sees this line's own leading whitespace | Owner ruling 2026-09-03, option label verbatim **"Fix R5/R6, residual R4/R7 (Rec)"**. Verified `CORRECT` by measurement, not by reading: indenting the declaration line alone by two spaces left C7 **20/20 green**. Comment-only; ⛔ not one byte of the function changed, so C7 parity is untouched |
| 4 | **R6** — the "PRECISION ABOUT BYTE-IDENTICAL" paragraph overclaimed | Paragraph rewritten to the measured truth: `blank` byte-identical; `TARGET`, `exempt`, `maskFencesAndQuotes` byte-identical **modulo a leading `export `** (D1), and the latter two also modulo the removed `OPT.*` references (D2) | Same ruling. Verified `CORRECT` by extracting all four constructs from §4.2 at `c797df4` and diffing them construct by construct — the `export ` keyword is the only undeclared difference, and it is present on three of the four, not zero. Comment-only, in a file whose whole purpose is transcription fidelity |

**⛔ No fix was applied without asking, and no obvious-winner call was made this round.** R3, R4 and R7
were ruled **not** to be fixed and are recorded as accepted residuals in the ledger instead, each with
a full What / Why (structural) / *Re-raise only if*.

⚠️ **One correction carried upward into the ledger rather than accepted as written.** R7 stated that a
module-load `ENOENT` makes the file "register **zero** tests rather than failing one". Measured this
round: `node --test` synthesises one failing test for a file that throws at import — **`tests 1 /
pass 0 / fail 1`**. The race is real; its consequence is a **loud** flaky red, not a silent loss of
coverage. The residual records the corrected cost so the next reviewer does not inherit the wrong one.

⚠️ **My own severity derivation differs from the reviewer's on one finding.** R3 was labelled `medium`;
tracing the blast radius myself gives **low** — 7 hits of 166 (4%), residual unaffected, and the
opener branch that historically broke is already pinned by `C2`. Recorded because the severity, not
the finding, is what H3's "lower-stakes than R1/R2" turns on.

---

## 10. Sequencing actually followed

1. Read the condition document at `c797df4`; recorded the revision and the checksum discrepancy (§2).
2. Extracted §4.2 to the session scratchpad and re-measured all five readings (§3).
3. Wrote `test/coordination-citation-policy.test.js` — header, transcribed core, then the L / M / C arms.
4. ⭐ Ran the sibling suite **first** to confirm C7 armed and passed — 20 / 20 / 0 skip (§5).
5. Ran the new suite — 20 / 20 / 0 skip.
6. Ran both red runs against scratchpad copies and recorded both figures (§4).
7. Ran `npm test` (832 / 832 / 0 skip) and `bash test/prove-red.sh` (PASSED, 28 mutations).
8. Ran the widened closed-tree `git status` check — empty.
9. Wrote this worklog, then **re-measured the residual with it on disk** — 0 hits from it, RESIDUAL
   still 0 across 0 (§6 check 10).
10. ⛔ **Stopped here: the review is the loop's separate step and the driver spawns the reviewer.
    I did not run it.**
