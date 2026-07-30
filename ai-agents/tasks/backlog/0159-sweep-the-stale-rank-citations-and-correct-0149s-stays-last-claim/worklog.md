# Worklog — 0159: sweep stale rank citations + correct 0149's "it stays last"

**Build worker, spawned by `/fkit-sprint-ship-loop`. Executed 2026-07-30.**
Owner approved the plan via `AskUserQuestion` in the live driver session, 2026-07-30, with five rulings
(Q1 honour the carve-out · Q2 follows Q1 · Q3 sweep by rule · Q4 fix flag, leave note · Q5 rebuild table).

---

## 1. Method — re-derivation before writing

Per the driver's instruction, the plan's Steps 1–6 were re-run **before any edit** rather than inherited.

- **Step 1** — rank/status table built mechanically from all **145** board rows, **0 unparsed**.
  ⚠️ **First extractor was buggy and was caught and rewritten.** It took the *first* `tasks/<folder>/NNNN`
  match on each row, which for row 174 picked up a **prose cross-reference** (`../tasks/done/0150-…`)
  instead of the row's own task, yielding `P142 → 0150` when the truth is `P142 → 0163`. Fixed by parsing
  the **link column only**. Board totals independently sanity-checked against `dashboard.sh`:
  **117 done · 1 in progress · 22 backlog · 5 cancelled, of 145** — matches the plan.
- **Steps 2/3** — the plan's two disjoint grep families.
- **Step 4** — append-flag vs `## Priority` field comparison, no rank grep at all.
- **Steps 5/6** — open board rows isolated first (the plan's catastrophic-backtracking warning was
  respected; no context regex was run over `sprint-2.md`), Part B located by anchor text.
- **Added a fourth, wrap-aware pattern family** not in the plan (see §3) — this is what found the site
  every previous pass had missed.

## 2. Which of the plan's findings held, and which had moved

| Plan's claim | Status today |
|---|---|
| Board totals 117/1/22/5 of 145 | ✅ exact |
| All 22 live ranks listed in §2 | ✅ all 22 correct |
| 11 A1 sites at the stated line numbers | ✅ all 11 exact — **but the list was incomplete (§3)** |
| 7 A2 sites at the stated line numbers | ✅ all 7 exact |
| Board open rows carry **zero** stale citations | ✅ confirmed across 23 open rows |
| `:1238` / `:1107` / `:1058` Part B sites | ✅ all three exact |
| `:1058`'s addendum is dated **2026-07-27**, not 2026-07-26 | ✅ confirmed firsthand at heading `:1015` |
| 0158 was owner-ruled to P122 on 2026-07-27 | ✅ confirmed at `sprint-2.md:811` |
| `package.json:5` makes the brief's step 9 defective | ✅ confirmed verbatim |
| **20 stale numbers / 18 sites / 12 files** | numbers **20 ✅**, files **12 ✅**, sites **19, not 18** |

**Nothing in the plan had decayed between its writing and this build.** The one divergence is that its
site count was one low — it counted 13 A1 stale numbers but tabulated only 11 A1 sites.

## 3. The site the plan's method could not see

`0152/brief.md:132-133` reads `Task **0154** (rank` / `127, …` — **the citation is split across a line
wrap.** Neither of the plan's grep families matches across a newline, so this site survived every earlier
pass *and* the approved plan. 0154 is **P128**. Found by adding a wrap-aware scan that allows `\s` inside
the citation and reports the line of the match start. The same family also showed `0155:141-142`
(`0146` / `(currently P130`) is likewise wrapped — the plan had it as a single-line site at `:142`.

**Reconciliation:** with this site included, A1 is **12 sites / 13 stale numbers**, which makes the plan's
headline **20 stale numbers exactly right** (13 + 7) and its **12 files exactly right**. Only the site
count moves, 18 → **19**.

## 4. What was changed — 12 files

**A1, 12 sites / 13 numbers / 6 files** — rank dropped, folder ID kept, or order stated relatively:
`0142:96` · `0152:132-133` (new) · `0152:134` · `0152:135` · `0154:135` · `0154:161` · `0155:141-142` ·
`0155:144` · `0156:58` · `0156:155` · `0166:174` · `0166:178`.
Every `0136 (P114)` / `0136 at P114` left **byte-identical** — correct today.

**A2, 7 sites / 7 files** — original flag text kept, dated resolution marker appended:
`0155:139` · `0156:152` · `0158:189` · `0159:301` · `0160:364` · `0163:156` · `0164:166`.

**Part B, 3 sites in `sprint-2.md`** — full dated correction at the origin (`:1238`), visible pointers at
`:1107` and `:1058`, the latter also recording the corrected **2026-07-27** date. All three original
claims left byte-identical; the diff is **pure addition, zero deletion**.

**Q4** — `0160:347-348`'s dated note left intact, with the owner-permitted append only.
**Q5** — `0159`'s findings table rebuilt in place, plus its verification step 6 (`0149 is P134` → `P137`).

## 5. Decision log — autonomous calls made

1. **Fixed the wrap-split `0152:132-133`, which the approved plan did not list.** Ruling Q3 is "sweep by
   rule, every open brief"; this is the same defect class in the same paragraph as two listed sites.
   Applying the ruling, not expanding scope. **Reported to the driver.**
2. **Deviated from the plan's prescribed A2 wording.** The plan said append *"✅ resolved: owner ruled to
   N"* to **all seven** flags. That is true **only for 0158** (verified at `sprint-2.md:811`). Writing
   "owner ruled" on the rest would have fabricated rulings — the precise `evidence-before-assertion`
   failure this task fights. **The owner ratified the deviation on 2026-07-30.**
   ⚠️ **But the substituted wording was itself defective on three counts, all fixed in round 2:**
   (a) it read *"✅ Resolved"*, over-claiming — no owner confirmed those six, only the stale **number**
   was reconciled and each merit argument is still unanswered;
   (b) it re-introduced a **live rank** (*"the live board rank is P<N>"*), a fresh instance of the very
   class being swept, inside the briefs just swept;
   (c) **the blanket claim that the other six "moved by displacement, no owner ruling exists" was FALSE
   for `0160`** — the fourth re-rank of **2026-07-27** expressly ruled `0160` stays where it was
   appended and **expressly left its flag standing, undischarged** (`sprint-2.md:601-603`, `:623`).
   `0160`'s marker now records that specifically, and its flag is restored as undischarged.
3. **Corrected `0159:334` (`0156 at P136`) after initially clearing it by eye.** During the by-eye pass I
   asserted "0156 IS P136 — correct today". **That was wrong: 0156 is P139; 0152 is P136.** The
   post-edit mechanical re-check caught it. Marked as an as-at-filing value with its date, since the
   number is the arithmetic that produced this task's own append rank. **This is a self-caught error and
   is reported as such.**
4. **Placed the Part B corrections adjacent to the re-rank tables, not inside the table cells.** The plan
   permitted touching those cells; keeping the edit outside them satisfies both "original claim text
   byte-identical" and "no re-rank table cell altered" at once, with no markdown-table risk.
5. **Fixed verification step 6's `P134` → `P137`** inside `0159`'s brief — a stale rank citation in an
   open brief, squarely in the swept class under Q3.
6. **Did NOT edit verification step 9** despite confirming it defective. The plan directed that the
   *report* say so, not that the step be rewritten. Flagged, not fixed.

## 6. Verification — the plan's Section 5, in full

| # | Check | Result |
|---|---|---|
| 1 | Ranks re-derived this session; counts reported against 21/19/11 | ✅ **20 numbers / 19 sites / 12 files** |
| 2 | Zero stale citations remain, proved by **disjoint families all clean** | ✅ Step 4 emits **0 unresolved**; wrap-aware scan leaves only quotations-of-the-defect and the two documented carve-outs |
| 3 | Nothing correct was "corrected" | ✅ every `0136 (P114)` byte-identical; the 4 Step-3 survivors re-checked correct |
| 4 | No quotation, no `>` interior, no re-rank table cell altered | ✅ sprint diff is 3 pure additions, **0 deletions** |
| 5 | All three Part B sites handled, `:1058` dated 2026-07-27, correction attributed to **owner ruling, 2026-07-27** | ⚠️ **FAILED in round 1, fixed in round 2.** The three sites and the `:1058` re-dating were right, but the correction was attributed to *"owner ruling, **2026-07-30**"* — a ruling that does not exist on the record. Step 5's other half (brief `:214`, verification step 5) demands **2026-07-27**, and the board agrees at `:172` and `:619`. **This row was originally reported ✅ over an unmet check.** Attribution corrected to **2026-07-27**; now genuinely ✅ |
| 6 | 0149 did not move — **P137**, once in the table, brief byte-identical | ✅ `git status` clean on `0149/` |
| 7 | No rank changed | ✅ `\| P<n> \|` sequence **identical**, 145 ranks. ⚠️ **Claim corrected at review round 1** — this row originally read *"every sprint-2 brief's `## Priority` matches its cell"*, which is **untrue**: `0136` is an open row (`P114`) with **no `## Priority` heading at all**. True statement: every open brief that **has** the field matches its cell. Pre-existing, no regression, and `0155`'s deliverable to backfill |
| 8 | Change surface exactly the named files | ✅ `sprint-2.md` + the 11 briefs |
| 9 | Suite green via **`npm test`** (not `node --test test/`) | ✅ **523 pass / 0 fail**, 17 suites, and `prove-red.sh`'s hard gate **PASSED** (all 7 mutations red their named assertion) |
| 10 | `dashboard.sh` `⟦FACTS⟧` identical before/after | ✅ byte-identical |

**Board stability.** Steps 1–6 were re-run after the sweep as the plan requires. The rank→ID→folder table
is **identical across all 145 rows** before and after; the board did not move mid-sweep, so no redo was
needed.

---

## 6a. Review round 1 — process-review pass (2026-07-30)

Run by a spawned **`fkit-producer`**, not a coder: `0159` is producer-owned (`## Owner: fkit-producer`)
and edits only briefs and the sprint board. ⚠️ **`/fkit-process-stateful-review` was NOT invoked** — it
is a coder-owned skill (`claude/skills-for-role.sh:52`), so its **method was applied by hand**: verify
each finding firsthand, classify defect vs frontier, respond in the ledger, apply the dispositioned fix.

**All seven reviewer findings verified firsthand at their cited sites. All seven confirmed TRUE** —
no finding was found incorrect or partially correct. Fixes applied per the owner's dispositions:

| # | Fix applied |
|---|---|
| R1 | `0160`'s append-confirmation flag **restored as undischarged**, and its marker now records the specific fact: the fourth re-rank of **2026-07-27** ruled `0160` stays where appended and **expressly left the flag standing** (`sprint-2.md:601-603`, `:623` — both verified firsthand). The brief's blanket "no owner ruling" claim, false for `0160`, corrected. |
| R2 | All six `✅ Resolved` markers reworded to **"stale number reconciled — owner confirmation still outstanding … this flag is NOT discharged"**. `0159`'s self-contradiction against its own *"merit/append gap is nine slots"* resolved by the same wording. |
| R3 | `sprint-2.md` correction re-attributed **2026-07-30 → 2026-07-27**. Authority re-derived firsthand before writing: brief Part B spec, verification step 5, `sprint-2.md:172` and `:619` all agree on 2026-07-27; **no 2026-07-30 ruling on the 0149 claim exists.** Verification-table row 5 above corrected too — it had reported ✅ over an unmet check. |
| R4 | The six markers' *"the live board rank is P&lt;N&gt;"* prose **removed**; they now point at each brief's own `## Priority` field and board row. `0160`'s Q4 append, which repeated `P141`, corrected the same way. |
| R5 | `0160`'s `(P141)` rank citation dropped; folder ID kept. |
| R6 | *"it is P139 today"* **removed**; *"P136 on the filing date, 2026-07-27"* kept and re-framed as **dated arithmetic, not a live citation**, pointing at `0156`'s board row for its rank today. ⚠️ **Applied on an explicit owner ruling of 2026-07-30, NOT autonomously** — the disposition first relayed for "R6" described a different finding, so it was returned as `NEEDS-DECISION` and the owner ruled before anything was written. See §6b. |
| R7 | The untrue *"every open brief's `## Priority` …"* claim narrowed to *"every open brief that **has** the field"*, in **both** places it appears (this worklog's row 7 and the brief's verification step 7). `0136` **not** touched — backfilling it is `0155`'s deliverable. |

**Independently re-verified after the round-2 fixes:** wrap-aware cross-reference sweep over every open
brief — **19 hits, all quotations-of-the-defect or carved-out sites**, zero uncatalogued stale live
citations; all **7** A2 flags carry a reconciliation marker (**0** unmarked); **0** `✅ Resolved` or
`live board rank is` residuals outside the deviation note that quotes the removed wording. `npm test`
**523 pass / 0 fail**, `prove-red.sh` hard gate **PASSED**. `dashboard.sh` `⟦FACTS⟧` **byte-identical**;
`| P<n> |` sequence **identical at 145**. Change surface **unchanged** — no file added, moved or removed.

## 6b. Decision log — round 2 autonomous calls

1. **Corrected `0160`'s Q4 append as well as its flag.** The append read *"the flag now carries a
   resolution marker recording the live rank as `P141`"* — after R1/R2/R4 that sentence was false on
   all three counts (not a resolution, and a live rank). It is the **build's own append**, not the
   dated 2026-07-29 observation above it, which Q4 protects and which is **left byte-identical**.
2. **Corrected the R7 claim in the brief as well as the worklog.** The reviewer cited only the
   worklog, but the brief's verification step 7 carries the same untrue claim **as a specification** —
   left alone it forces the same false report at every future re-run.
3. **Corrected §5 decision-log item 2 and the §6 row-5 record.** Fixing a defect in the artifact while
   leaving the worklog asserting the defective version is the same failure R3 names.
4. ⚠️ **DID NOT decide R6 — returned it instead.** The disposition received described a different
   finding. **R6 was subsequently fixed on an explicit owner ruling, not on this pass's judgment.**

**⚠️ The R6 disposition did not match the R6 in the ledger.** The instruction described R6 as *"the
rebuilt findings table's new `:NNN` line pointers … accepted"*. That is the **suppressed Codex finding
5** in the ledger's *Re-litigates settled decisions* section — already suppressed by the reviewer and
never a numbered finding. **The actual R6** is `0159/brief.md` *"it is **P139** today"*, which the
reviewer classes as **the same class as R4** — the live-rank prose the owner ruled must be removed.
Rather than apply the relayed instruction or substitute its own judgment, this pass **left the site
untouched and returned `NEEDS-DECISION`**.

**Resolved 2026-07-30 — the owner ruled: remove the live rank, keep the as-at value.** Reasoning: it is
the same defect already ordered removed six times over, in the same brief, on reasoning that applies
unchanged; the *"adjacent as-at framing"* mitigation covers the `P136` half (correctly kept as dated
arithmetic) but not the bare present-tense `P139` half. **Applied on that ruling.** The driver has since
confirmed the mis-mapping was **its own**, not the reviewer's — its owner-question named *"R4/R5/R6"*
without saying what R6 was, and it filled the item in from context instead of reading the ledger.
**Logged as the driver's 17th relayed error this sprint.** The catch only worked because every relayed
coordinate was re-derived from the ledger and the live files rather than trusted.

## 7. Honesty clause

- **Nothing in `test/` reads brief or board prose.** 0157's rule is written but **unenforced**. This sweep
  fixes today's instances; **nothing prevents tomorrow's.** The class is **not** closed.
- **The brief's verification step 9 is defective** — `node --test test/` omits `bash test/prove-red.sh`
  (`package.json:5`) and fails MODULE_NOT_FOUND. Left in place, flagged only.
- **`ai-agents/wiki-vault/` was neither read nor written.** Three vault files show as modified in the
  working tree; they were **already modified before this build began** and are another worker's.
- **Nothing was committed or pushed.** All work is left in the working tree.
- Left deliberately undone and flagged, not filed: `0133:37`'s stale *status* citation; `sprint-2.md:1238`'s
  `0143 (priority 121)` inside a frozen re-rank cell; `0162:155`'s *"ten open rows"* count (**seven** today).
