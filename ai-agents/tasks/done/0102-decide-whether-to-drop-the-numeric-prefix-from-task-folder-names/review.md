# Review — 0102

Task: 0102 — [brief](./brief.md)
File(s) under review: `ai-agents/knowledge-base/reports/2026-07-26-decide-task-folder-name-numeric-prefix.md`
Status: closed-out

**Verdict (round 2 — final):** ✅ **Converged. Ready to proceed — no open defects, no further round needed.**
R1/R2/R5 verified repaired at source; R3/R4/R6/R7 recorded as honest residuals with real re-raise
conditions; R8 correctly routed to a producer. **No repair introduced a new defect** — every new
citation re-verified. Round 2 was a **convergence call only; Codex was not re-run** (see round-2 note).

**Verdict (round 1):** ⚠️ **Changes requested — 8 defects (2 high), none blocking the owner-ruled decision.**
Option C's central mechanism and its decisive framing claim both **verified by execution**. The defects are
in how the report *argues*, not in what it *recommends*.

**Reviewers run:** own pass + Codex (`codex-cli 0.145.0`, read-only sandbox) — **both completed, full
coverage, nothing skipped.** R1 and R2 were reached **independently by both** reviewers.

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | high | `reports/2026-07-26-decide-task-folder-name-numeric-prefix.md:200-217` | §7.1's disproof of Option D rests on *"**Every** Task cell already renders the folder name in full"* — false for **85 of 130** board rows. Only **45/130** show `<NNNN>-<slug>` in the visible link label; the other 85 render a legacy slug-only `.md` stem with the folder ID hidden inside the href (`sprint-2.md:33-38` et al). The cited example (`:135`) is drawn from the 35% minority and generalised to "every". Option D is therefore **not shipped for the majority of the board**, so *"disproved, not deferred"* — the loudest claim in the document — is unsupported. Both reviewers independently counted 45/130. |
| R2 | 1 | high | `…numeric-prefix.md:196, 275-286` | §8 states 0103's scope *"in full"* but omits two real consumers of the priority-as-identity contract that Option C step 1 inverts: (a) `claude/skills/fkit-status/SKILL.md:299-304`, a documented narration contract stating `<task>` **is the Priority number** when the board has one; (b) `test/dashboard-contract.test.js:1655-1664`, a test literally named *"a numbered sprint plan still keys FACTS by number, not by filename"* that asserts the opposite of what C does. Compounding it: the report quotes `dashboard.sh:548-550` as support but omits the adjacent `:552-553` ⚠️ **ORDER MATTERS** warning — *"a fallback, not a replacement — changing sprint plans to filename ids would break every `drift on tasks 59, 60` reference the skill narrates"* — which is a direct objection to its own recommendation. Selective quotation + handoff gap; §8 names only test `:263`, not the guard test. |
| R3 | 1 | med | `…numeric-prefix.md:105-109` | §4.3's *"the confusion has already produced incorrect prose"* overclaims. In context (`sprint-2.md:564-572`) the addendum maps newly-assigned priorities to permanent IDs, with the IDs backticked to mark them as ID tokens — and the **same construction appears twice**: *"**103** (was `0102`)"* at `:565-566` and *"**104** (was `0103`)"* at `:570`. Two consistent uses read as a deliberate notation, not a slip; *"was"* plausibly means *"was referred to as"*, which the `—` backlog priority cell does not refute. The report cites only one instance and never acknowledges the competing reading. §4's conclusion survives on exhibits 1+2 (both verified), so this weakens a supporting exhibit rather than the finding. Both reviewers independently. |
| R4 | 1 | med | brief `:70-72` vs `…numeric-prefix.md` §7, §11 | The brief lists *"Drop the sprint-priority number instead of the ID"* under alternatives to **"surface them, evaluate them"**. The report answers the *"which number is the accident"* half (§5: the priority) but never evaluates dropping it — no option row for it in §7's A–E table — and §11 concedes *"dropping the integer entirely … [was] not compared on [its] merits."* Disclosed rather than hidden, but a required evaluation is absent. |
| R5 | 1 | med | `…numeric-prefix.md:143` | Naming inconsistency in the decisive step-1 evidence. The report calls the migration **"task 76"** by *priority* (folder `0062`, priority 76 — correct) but **"task 79"** by *folder ID* (folder `0079`, whose priority is **77**). A reader following the report's own convention lands on folder `0022` (priority 79 — an unrelated `universal-rules.md` compression task) and would judge the evidence check bogus. In a report whose thesis is that priority and folder ID are confusable and get conflated, the report commits that conflation. **Substance holds** — I verified folder `0079`'s four artifacts contain zero Priority-cell/`task_id` mentions. |
| R6 | 1 | low | `…numeric-prefix.md:102-104` | §4.2's exemplar `144/0145` is misquoted (the file reads `0144/0145`) and misclassified: at `sprint-2.md:190` and `:320` it denotes the **launcher pin-guard folder-ID pair** (`0144` and `0145`), not a priority→folderID mapping; only `:354` is a genuine mapping. The count **33** reproduces only under a loose regex that sweeps in these non-instances; the report supplies no defining command. Raised by Codex, confirmed by me. |
| R7 | 1 | low | `…numeric-prefix.md:223-243` | §7.2's reference-line figures are not reproducible as stated and are **systematically +1**: report's 219 / 257 / 281 vs both reviewers' **218 / 256 / 280** at the same commits; live tracked worktree is **291 non-wiki + 135 wiki = 426**, not "~416"; the parenthetical "443 worktree non-wiki" did not reproduce (Codex `rg`: 310). Separately, "92 `NNNN` mentions across **skills/docs/tests**" is a repo-wide count *including* `wiki-vault/` (non-wiki tracked is ~70-77 in 27 files) — the label understates its scope. **The trend and the 1.6× / 1.35× conclusions are unaffected.** |
| R8 | 1 | low | brief `:82-83` | Brief verification step 1 — *"A design/investigation report exists … **linked from this brief's board row**"* — is **unsatisfied and undisclosed**. The report has **zero inbound links** anywhere under `ai-agents/`: not from `sprint-2.md:135`, not from the brief. §11 does not flag it as a residual. (Board edits are arguably producer-owned, but the brief assigned the step and it was not surfaced.) |

### Re-litigates settled decisions (suppressed — not raised as findings)

Nothing was suppressed from the reviewers' output; recorded here for the next round's benefit:

- **Option C vs B / D / E as the choice** — owner-ruled 2026-07-26 (report §1). Out of scope. Note R1
  makes Option D *not disproved*, but D is cheap and **non-exclusive with C** — it is a possible
  complement, never a challenge to the ruling.
- **Long numbered folder paths; two ID carriers (`## ID` + folder name); the 33 frozen notations; the
  retained `id-mismatch` check** — report §10 accepted consequences, owner-accepted.
- **The unwritten convention page** — report §9, deliberate and reasoned (a convention must be
  "prescriptive and current"; `P103` does not exist yet). Its absence is not an incompleteness defect.
- **§11's three disclosed residuals** (movers-vs-`P103` unverified; `P` is one candidate token; ADR-029
  Decision 6 written in past tense) — disclosed, not hidden.
- **ADR-029 re-raise check:** the report's §7.4 claim that ADR-029's *"Re-raise only if"* bullet 1
  (*"the folder layout is proposed to change again"*) licenses task 0102 is **accurate** — verified at
  `adr-029-…md:282-284`. Task 0102 is legitimate, not a re-litigation.

### What I reproduced myself (executed, not taken on trust)

| Architect's claim | Result |
|---|---|
| `task_id()` at `dashboard.sh:481-483`; `P103`→`103`, `P8 (optional)`→`8`, `#103`→`103`, `P0103`→`0103`, `—`/`Unscheduled`→empty, no parser change | ✅ **Reproduced exactly, all 8 cells.** The central mechanism holds. Also traced every `tid` consumer: `P` is stripped before use; the only aggregation is `sort -n \| uniq` (`:887`) — no break. |
| Prefix-strip → **130 `id-mismatch`**, baseline exit 0 / zero drift | ✅ **Reproduced by full scratch-tree execution** (copied `ai-agents/` to scratch, renamed all 152 folders, rewrote hrefs, ran the script). Baseline exit 0 / 0 drift; after strip exit 0 / **130** `id-mismatch` on `sprint-2.md`. The three sample drift lines in §6 match **verbatim**, and their fact ids (`1`,`2`,`3`) are priorities — confirming §3.1 independently. *Codex could not write to `/tmp` in its sandbox and reproduced the 130/130 outcome by in-memory emulation instead.* |
| 152 folders = 31 backlog / 110 done / 11 cancelled; 0 dup slugs; 0 dup IDs; 152/152 carry `## ID` | ✅ **Reproduced exactly**, all five figures. |
| **Step 1 (decisive):** task 76 never addressed the Priority-cell id derivation | ✅ **Verified.** `0062-…/plan.md:47-58` is section B and enumerates exactly the four items named; **site 5 is absent**. Zero mentions of `priority cell` / `task_id` / id-derivation across **all four** of task 76's artifacts, and zero across folder `0079`'s four. **No ruling to keep it exists.** The report's framing is correct. |
| Design report `:623` "site 5 of five" quote | ✅ **Verbatim-accurate and in context** (`### 6.1 dashboard.sh — the five sites`; the doc itself says sites 2/3/5 fail silently). |
| `sprint-2.md:135` = priority 103 → folder `0102`; `:136` = priority 104 → folder `0103`; `:570` text; `backlog.md:47-48` priority cells `—` | ✅ **All verified verbatim.** (Interpretation of `:570` disputed — see R3.) |
| §3 citations: `dashboard.sh:630-646`, `:638` = `folder_id=${folder%%-*}`, `:597-609` link recovery, `:561-562` fallback, `:548-550` rationale, `test/task-id-uniqueness.test.js`, `dashboard-contract.test.js:263` | ✅ **All verified exact.** |
| Growth 121 → 136 → 146 folders (worktree 152) | ✅ Real data points at dated commits (the report does not name which commit per day; other same-day commits give different values). Worktree 152 confirmed. |
| 33 notations · ~416 ref lines · 92/36 `NNNN` | ⚠️ **Did not cleanly reproduce** — see R6, R7. |

### Credit where earned

The report **does** record two findings that cut against its own case, and both are accurate:
§3 concedes two of the brief's three coupling claims are **overstated** (verified — only
`dashboard.sh:638` truly breaks), and §6 step 2 volunteers that a half-done rename fails **loudly**,
which *lowers Option B's risk*. Volunteering evidence against your own recommendation is the behavior
this review bar is meant to reward. R1/R2 are failures of completeness in the same document, not of
candour.

### Convergence call

**Round 1 — act, do not close out.** Every finding is novel; none re-litigates a settled residual or an
ADR re-raise condition. **The owner-ruled decision (Option C) is not challenged by any of them** — its
central mechanism and its decisive framing claim both survived execution-level verification.

Recommend: **R1 and R2 warrant a corrective pass on the report before it is treated as the record
0103 implements from** — R2 especially, since it is the one that could bite 0103 in flight (an
unlisted documented contract and a guard test that will fail red for the *right* reason and be
mistaken for a regression). R3-R8 are accuracy and completeness repairs to a document whose stated job
is to be right.

---

## Round 2 — reviewer convergence call (reviewer-owned)

> ⚠️ **Coverage note — read before treating this ledger as model-diverse.** Round 2 is a **convergence
> call on prose repairs I had already specified**, not a fresh review. **The Codex pass was NOT re-run.**
> Round 1's two-reviewer coverage (own pass + `codex-cli 0.145.0`) stands and is recorded above;
> **round 2 carries single-reviewer coverage only.** Skipping was the caller's instruction and is
> appropriate here — a second model cannot independently confirm "did the architect write down the
> thing I told it to write down" — but the ledger must not be read as carrying coverage it lacks.

### Did R1, R2, R5 land? — Yes, all three, verified at source

| # | Landed? | What I checked |
|---|---|---|
| R1 | ✅ **Fully** | §7.1 retitled *"Option D is 35% shipped — a complement to C, not a rival and not disproved."* The **"Every Task cell"** premise is struck; **"disproved, not deferred"** is withdrawn; a 45/85 split table replaces the assertion; the section **self-flags** *"This section was wrong in round 0 and is rewritten"* and names R1. The owner's D-as-complement ruling is recorded as a ruling, not re-argued. §7's option-D row now reads **"35% shipped — 45 of 130 rows."** |
| R2 | ✅ **Fully, all three parts** | §8 gained item **4** (`SKILL.md:299-304`, flagged *"the single most missable item"* because it is prose and fails silently), item **5** (the guard test, stated as **"will go RED, and that is correct… not a regression. Do not 'fix' it by reverting step 1"**), and item **6** (label normalisation, owner-ruled). The ⚠️ **ORDER MATTERS** warning is now quoted **in full** at `:190-192` and addressed **both ways**: its literal hazard (non-numeric *filename* ids) does not fire for C, **but** its underlying point — that priority-numbering is deliberate — is **conceded**. Selective quotation acknowledged. |
| R5 | ✅ **Fully** | A citation convention (**folder `NNNN` (priority N)**) is stated in the header and applied (§7.3, §11 now read *"folder `0062` (priority 76)"*). The round-1 catch is **recorded in the report**, not silently fixed. |

### Are the four residuals recorded honestly? — Yes

§11.1 records R3/R4/R6/R7 with **real, falsifiable re-raise conditions** (not "re-raise if it matters
again"). Each states what was verified, what it does *not* touch, and its condition. R4 is stated
plainly as **"a genuine gap in required coverage"** rather than softened.

**R7's required statement is present and correctly placed** — in a blockquote, not a footnote:
*"**Explicitly: the trend and the 1.6× / 1.35× conclusions are UNAFFECTED.**"* It gives the reason
(a ±1 across figures of 218–281 cannot move a two-significant-figure ratio) and adds that §7.2's
separate *understatement* correction moves the numbers **against Option B**, the option not chosen.

### Did any repair introduce a new defect? — No. Every new citation re-verified

The caller flagged this specifically; this run has seen fix rounds introduce fresh defects twice.

| New citation | Verified |
|---|---|
| `test/dashboard-contract.test.js:1657` — the `test(...)` name line | ✅ **Exact.** `test('task 68: a numbered sprint plan still keys FACTS by number, not by filename', …)` |
| `:1655-1656` — the two ⚠️ header comments | ✅ **Exact.** The architect's self-caught correction was **real and right**: `:1653-1654` are `});` and a blank line. Catching and fixing that itself is the behavior this gate exists for. |
| `claude/skills/fkit-status/SKILL.md:299-304` | ✅ **Exact**, quoted accurately. |
| `sprint-2.md:1820` — "a 131st brief link, prose not a board row" | ✅ **Verified.** Does not begin with `\|`; it is prose. The 130-vs-131 reconciliation holds. |
| `sprint-2.md:566` — *"**103** (was `0102`)"* | ✅ **Correct.** The construction begins on `:566` (wrapping to `:567`). |
| `sprint-2.md:33-38` legacy-label example · `dashboard.sh:552-553` quote · `backlog.md` 16 further rows · 45 of 130 | ✅ **All verified** (16 and 45/130 re-confirmed by my own count). |

### A — the R7 count disagreement: **settled as a methodology difference, not an error by either side**

**My exact command, now published** (the thing R7 says should always accompany a count):

```
git grep -nE 'tasks/(backlog|done|cancelled)/[0-9]{4}-' HEAD -- . ':(exclude)ai-agents/wiki-vault' | wc -l
```

→ **280** non-wiki, **134** wiki, **414** total at HEAD. I re-ran it against **every** plausible
pathspec variant — `:!ai-agents/wiki-vault/**`, no `.` pathspec, directory vs glob form on the wiki
side — and it returns **280 / 134 / 414 unchanged in all of them.** So the gap is **not** a pathspec
artifact on my side, and Codex reached the same figures with different tooling (`rg`).

The architect re-ran its command and still gets **281 / 135**. The difference is **exactly +1 in each
bucket, consistently, across three historical commits and HEAD** — the signature of a **definition
difference** (one extra line-form included in "reference line"), not arithmetic error.

**Judgment: neither side is wrong, and it cannot be settled without a shared definition — which is
precisely R7's conceded point.** I am **not withdrawing R7**: the counts remain irreproducible as
published. I am also **not asserting the architect miscounted** — it did not silently adopt my numbers,
which was the correct call. The residual stands as a **disputed count with both outcomes recorded**,
and its existing re-raise condition ("publish the exact command alongside it") already resolves it for
any future reuse. **Immaterial to every conclusion; both sides agree on that.** Effort stops here.

### B — the declared deviation on R3/R6: **stayed within the owner's ruling. Declared, not buried**

The owner ruled *record, do not repair*. The architect recorded them in §11.1 **and** appended a
one-line pointer at each exhibit. My judgment, plainly: **within bounds.**

- **The disputed claims are verbatim intact.** §4.3 still reads *"treating a permanent folder ID as a
  former priority. It never was one… a factual error… written by someone who knew the rule."* §4.2
  still reads *"33 instances"* with the `144/0145` exemplar. **Nothing was re-measured or restated.**
  What was added is a ⚠️ pointer: *"Do not cite exhibit 3 on its own as proof of harm"* / *"Cite this
  exhibit for the notation's **existence**, never for its magnitude."* That is discoverability at the
  point of use — a reader who never reaches §11.1 is still warned.
- **The consequential edits are coherence, not repair.** §7's option A and §10 had reused **33** as a
  bare magnitude. Leaving them would have put the report in violation of the residual it had just
  recorded — and would have tripped R6's own re-raise condition (*"re-raise if 33 is used as a
  magnitude"*) **on the day it was filed.** "Record, do not repair" cannot sensibly mean "keep
  asserting elsewhere the number you just conceded is unmeasured."
- **One item sits closest to the line, and I name it rather than wave it through:** §4's verdict
  sentence was narrowed to *"not theoretical — carried by exhibits 1 and 2, which are unqualified."*
  That edits a **conclusion**, not a pointer, and is the largest change of the set. It is still within
  bounds because it narrows the conclusion **toward** what the evidence supports and implements exactly
  what my own R3 finding and the recorded residual both say (*"§4's conclusion is unaffected — it rests
  on exhibits 1 and 2"*). It removes reach; it does not add any.
- **It was declared in the ledger, not buried.** A deviation surfaced by the party who made it is the
  outcome this process is built to produce, and it is why this closes in one round instead of two.

### Convergence verdict

✅ **Converged — close out. No further round.** Every round-1 finding is disposed: three repaired and
verified at source, four recorded as residuals with real re-raise conditions, one routed to its correct
owner. No repair introduced a new defect. Nothing in round 2 re-litigates a settled decision, and I
raise **no new findings** — the report is now, to the limit of two reviewers' checking, an honest
argument for a decision the owner had already made on other grounds.

**Not closed by me, and not mine to close:** the task itself. A producer runs the mover, and R8's board
link is that producer's edit.

## Coder response

_(coder-owned — do not write above this line into this section)_

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | ✅ **CORRECT** — verified independently | **Defect** (high) | **Repaired.** Counted it myself before changing anything: of **130** board data rows in `sprint-2.md` linking a brief, **45** show the `<NNNN>-` prefix in the visible label and **85** render a legacy `slug.md` stem — matching both reviewers exactly. (A 131st brief link at `sprint-2.md:1820` is prose, not a row; that is the source of the 130-vs-131 gap.) §7.1 rewritten: the "**Every** Task cell" premise is struck, Option D is **35% shipped, not disproved**, and the "disproved, not deferred" conclusion is withdrawn. Per the owner's ruling, D is recorded as a **live complement to C, not a rival** — C makes the numbers typographically distinct, D makes the ID visible on all 130 rows instead of 45. | ✅ Applied |
| R2 | ✅ **CORRECT** — all three parts verified verbatim | **Defect** (high) | **Repaired.** (a) `claude/skills/fkit-status/SKILL.md:299-304` confirmed — it instructs that `<task>` **is the Priority number**; added to §8 as item 4, flagged as **the most missable item** because it is prose and fails silently. (b) `test/dashboard-contract.test.js:1657` confirmed — `'task 68: a numbered sprint plan still keys FACTS by number, not by filename'`, asserting `drift nonconformance 7`; added as §8 item 5 stating plainly that C **turns it red for the right reason — not a regression**, with its name and the two ⚠️ header comments at `:1655-1656` to be re-pointed in the same change. (c) The omitted ⚠️ **ORDER MATTERS** warning at `dashboard.sh:552-553` is now quoted **in full** in §6 and addressed both ways: its literal hazard (non-numeric *filename* ids) does not fire for C, whose ids stay numeric single tokens — but its underlying point, that priority-numbering is deliberate, is **conceded**, and is precisely why items 4–5 are now explicit. Selective quotation acknowledged. | ✅ Applied |
| R5 | ✅ **CORRECT** — verified | **Defect** (med) | **Repaired.** Confirmed the conflation myself: folder `0062` = priority **76**; folder `0079` = priority **77**; the folder holding priority **79** is `0022` (`compress-universal-rules-output-style-section`) — an unrelated task, exactly as reported. A citation convention (**folder `NNNN` (priority N)**) is now stated in the header and applied throughout; where an artifact says *"task 76"* it is quoted and glossed, since ADR-029 and several `dashboard.sh` comments use that name. The round-1 catch is recorded in the report rather than silently fixed. **Substance unchanged** — step 1's finding stands. | ✅ Applied |
| R3 | ⚠️ **PARTLY CORRECT** — verified | **Defect** (med) | **Accepted residual — owner-ruled record, do not repair.** Verified both instances: `sprint-2.md:566` (*"**103** (was `0102`)"*) and `:570` (*"**104** (was `0103`)"*). Two consistent uses do support the competing *"was referred to as"* reading, which §4.3 never acknowledged. Recorded in §11.1 with a re-raise condition, **plus a pointer at the exhibit itself** so no reader takes it at face value: *do not cite exhibit 3 alone as proof of harm*. §4's conclusion is unaffected — it rests on exhibits 1 and 2. | 📌 Residual |
| R4 | ✅ **CORRECT** — verified against the brief | **Defect** (med) | **Accepted residual — owner-ruled record, do not repair, do NOT now evaluate.** Confirmed the brief (`:70-72`) required *"drop the sprint-priority number instead"* be surfaced **and evaluated**; §5 answers which number is the accident but §7's A–E table has no row for dropping it. Recorded in §11.1 as a **genuine gap in required coverage**, honestly stated, with a re-raise condition: if `0103` finds `P<n>` unworkable, the integer-drop becomes the live fallback and must then be evaluated properly. | 📌 Residual |
| R6 | ✅ **CORRECT** — verified | **Defect** (low) | **Accepted residual — owner-ruled record, do not repair.** Verified: the file reads `0144/0145`, and at `sprint-2.md:190` and `:320` it denotes a **folder-ID pair**, not a priority→folder-ID mapping; only `:354` is genuine. So **33** is inflated by a loose regex and no defining command was published. Recorded in §11.1, and §4.2 now carries an inline warning to cite the exhibit for the notation's **existence, never its magnitude**. Related magnitude claims in §7's option A and §10 were de-numbered to match. | 📌 Residual |
| R7 | ⚠️ **PARTLY CORRECT** — reproduced my own figures; concede the substantive point | **Defect** (low) | **Accepted residual — owner-ruled record, do not repair.** Re-running my original command still returns **219/257/281**, so I cannot confirm the ±1 as an arithmetic error — it is a **methodology difference between two unpublished commands**, and I say so rather than silently adopting the reviewer's numbers. **R7's real point is conceded in full: the report published counts without publishing the command, which is what makes them irreproducible.** The `92 NNNN mentions` scope label is likewise corrected as repo-wide including `wiki-vault/`. **Stated explicitly in §11.1: the trend and the 1.6× / 1.35× conclusions are UNAFFECTED** — a ±1 across figures of 218–281 cannot move a two-significant-figure ratio. | 📌 Residual |
| R8 | ✅ **CORRECT** — not mine to fix | **Defect** (low) | **Out of scope, routed.** The missing inbound board link is a `sprint-2.md` edit, which is producer-owned; a producer is making it. Recorded at the end of §11.1 so the gap is not mistaken for an oversight. I did not touch `sprint-2.md`. | ↪️ Routed |

**Volunteered by the reviewer, folded in:** the blast-radius figures were **understated** — `backlog.md`
carries **16** further rows linking numeric task folders (verified: 16), so the row-level radius is
**146**, not 130. This cuts **against Option B**, the option *not* chosen, so it **strengthens** the
recommendation. Recorded in §7.2 for exactly that reason: an error in the losing option's favour is
the one most worth correcting.

**Both self-weakening disclosures are retained unchanged**, per the reviewer's note that R1/R2 were
failures of completeness rather than candour: §3's concession that two of the brief's three coupling
claims are overstated, and §6 step 2's finding that a half-done rename fails **loudly** (which lowers
Option B's risk).

**Not reopened:** Option C itself. Both load-bearing claims were reproduced by independent execution
(`task_id()` across all 8 cells; the 130-row prefix strip, with my three sample lines matching
verbatim), and the decisive step-1 finding was independently verified. No finding challenged the
ruling.

**One deviation to flag:** the owner ruled R3/R6 *record, do not repair*. I recorded them in §11.1 **and**
added a one-line pointer at each qualified exhibit (§4.2, §4.3). That is discoverability, not repair —
the claims themselves are untouched — but it is slightly more than "record", so it is declared here
rather than buried.

## Accepted residuals (shared, do-not-re-litigate)

Owner-ruled 2026-07-26 — **do not re-raise in a later round** except on the stated condition:

- **R3 — the `sprint-2.md:570` "incorrect prose" exhibit has a competing reading.** Re-raise **only if**
  the exhibit is cited on its own as proof of harm.
- **R4 — "drop the sprint-priority number instead" was required by the brief and never evaluated.**
  Gap recorded, deliberately not closed. Re-raise **only if** `0103` finds `P<n>` unworkable.
- **R6 — the `33` notation count is inflated and its `144/0145` exemplar is misquoted.** Re-raise
  **only if** 33 is used as a magnitude rather than as evidence the notation exists.
- **R7 — reference-line counts are irreproducible (±1) and were published without their command.**
  Trend and the 1.6× / 1.35× conclusions unaffected. Re-raise **only if** the counts are reused
  outside this report without publishing the command.
- **From round 0, owner-accepted and not defects:** long numbered folder paths; two ID carriers
  (`## ID` + folder name); the frozen `priority (folderID)` notations; the retained `id-mismatch`
  check; and the **unwritten convention page** — the owner **ratified** withholding it, and `0103`
  writes it alongside the rendering it describes.

**Reviewer confirmation (round 2).** I confirm all four residuals above as recorded, with their
re-raise conditions as written. Two amendments, both additive:

- **R7 is a DISPUTED COUNT, not a conceded one.** Two reviewers with different tooling obtained
  **280 / 134 / 414** at HEAD (my command is published in the round-2 section above); the architect's
  command still returns **281 / 135**. The gap is **+1 per bucket, consistently** — a definition
  difference over what counts as a "reference line", **not** a demonstrated arithmetic error by either
  side. **Neither figure is withdrawn.** Re-raise condition unchanged and already sufficient: publish
  the exact command alongside any reuse. **Immaterial to the trend and to the 1.6× / 1.35× ratios.**
- **R8 is routed, not resolved.** It leaves this ledger **open against a producer**, not closed: the
  brief's verification step 1 (report *"linked from this brief's board row"*) is still unsatisfied at
  the time of writing. Recorded in the report's §11.1 so it is not mistaken for an oversight.

**Also settled in round 2 (owner-ruled, do not re-raise):** **Option D is 35% shipped, not disproved,
and is a complement to C** — label normalisation is in `0103`'s scope (report §7.1, §8 item 6).
Re-raise **only if** `0103` proposes dropping label normalisation from its scope.
