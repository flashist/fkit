# Review — 0358

Task: `ai-agents/tasks/done/0358-sweep-c-the-wiki-vault-resyncs-as-one-pass/brief.md`
File(s) under review: the working-tree diff under `ai-agents/wiki-vault/` — 19 modified (incl.
`index.md`, `log.md`, `.wiki-watermark`) plus 2 new pages (`wiki/decisions/adr-045-…`,
`wiki/decisions/adr-046-…`) — and this folder's `worklog.md`. Out of scope by the worker's named
baseline `cf289c2`, and not reviewed: Sweep B's renames, `0357`/`0361`, ADR-046 in
`knowledge-base/`, `0363`/`0376`/`0377`/`0378`, the `adr-003`/`adr-037` knowledge-base edits,
`test/closed-rank-immutability.test.js`, the board files.
Status: closed-out
Coverage: reasoning-only second opinion (ADR-042 D1 — the normal state, not a degradation). Codex
ran (`codex-cli 0.152.0`, exit 0) and returned a usable adversarial pass with 7 findings and an
explicit verified-true list, but it measured nothing — its whole pass was reads and greps, which the
state's own definition excludes from measurement. On a documents-only deliverable there was no suite,
fixture or mutation for either pass to execute; all counts in this ledger are mine, re-derived
firsthand.

⛔ **What no test covers here, stated before the findings.** `npm test`'s green proves nothing about
this deliverable. `test/reference-integrity.test.js` arm L5 asserts positively that no
`ai-agents/wiki-vault/` file ever enters the scanned set, and
`test/coordination-citation-policy.test.js` never walks the vault — it carries `log.md` in `TARGET`
as a **cited** class, never a **citing** one. Every finding below rests on a measurement taken in
this review, not on a suite.

## Reviewer findings

| # | Round | Sev | Location | Claim |
|---|---|---|---|---|
| R1 | 1 | high | `worklog.md` § "Link churn the producer must know about BEFORE it moves a folder" | *"**13** markdown links point into the **five** folders proposed for close"* and ⛔ *"No closing member's own folder holds a link into another closing member's folder."* Both false. Resolving every markdown link under `ai-agents/` (vault excluded — it is link-guard exempt) gives **17** links into those five folders, and one further outbound link that breaks. The hand-off's worklist is short by **2 unconditional breaks** and **3 order-sensitive** ones. Missing, with the citing site quoted: (a) `0358`'s own `brief.md`, *"[`0212`](../0212-append-a-dated-log-entry-correcting-the-still-open-framing/brief.md) joins this sweep"* — `0358` stays in `backlog/` while `0212` moves, so it breaks unconditionally; (b) `0319`'s `brief.md` § Related, *"**[`0290`](../0290-decide-whether-anything-should-notice-when-a-close-falsifies-a-vault-claim/brief.md)**"* — `0290` is open and stays put, so this breaks the moment `0319` moves; (c) `0239`'s `brief.md` § "The precedent — `0199`, the same job for ADR-010", *"[`0199`](../0199-wiki-resync-adr-010s-vault-page-after-the-correction-notes/brief.md) is the exact precedent"*, and (d) `0319`'s `brief.md` at two sites, *"[`0317`](../0317-reconcile-the-vaults-not-ready-to-close-flag-on-0238-with-its-landed-close/brief.md)'s subject"* — the three member-to-member links the plan predicted. ⛔ **The plan was right and the re-measurement disproved it with the wrong test:** the worklog dismissed them as *"not … a markdown link carrying a `backlog/` path"*, but the guard resolves `../<sibling>/brief.md` relative to the citer, so the `backlog/` segment is irrelevant to whether the link breaks. Sibling-relative links survive **only** a joint move; they red `test/reference-integrity.test.js` between two separate `/fkit-task-done` calls. True break set: **15 unconditional + 3 order-sensitive**, against **13** reported — and the worklog's stated purpose is *"not flagging it would leave the next suite run red with nobody expecting it."* |
| R2 | 1 | medium | `worklog.md` § "Stage 3 — the three member `log.md` appends, PLUS the pass entry" | *"**Four appends, and the append-only diff was taken after EACH ONE**"*, table ending at append E, *"`455  0`"*, and verification row 3's *"`455 / 0`"*. The delivered file is **`481  0`**. **Six** appends landed, not five — the sixth is the *"Addendum to the 2026-09-05 lint — the vault's own citation rule, checked"* section, **26 lines**, which has **no recorded per-append proof**. The lint entry compounds it: *"Append-only preserved across all five of this run's entries."* ⭐ **The append-only property itself HOLDS and I verified it independently** — `git diff --numstat` gives `481 0`, `git diff -U0` yields zero `-` lines, and the pre-run prefix is byte-identical under `cmp` against `git show HEAD:…log.md`. The defect is the audit record, not the file: on a row whose only real verification is the per-append proof, one append is unproved and the final figure is wrong at two sites. |
| R3 | 1 | medium | `log.md` § "2026-09-05 — reconciliation (task `0317`) …" § "Condition 1 — the literal pre-archival path, EVERY remaining site named with its disposition" | *"Re-measured this run: **6 files, 26 occurrences**"* with a table whose `log.md` row reads **20**. Three problems, all in an append-only file. (a) The rows sum to **27**, not 26. (b) At `HEAD` the vault held **19** occurrences in `log.md` / **26** total; the delivered file holds **21** / **28** — so the `20` cell matches neither the pre-run nor the post-run state. (c) ⛔ **The measurement is self-invalidating**: this entry's own text contains the literal `ai-agents/sprints/sprint-2.md`, so the count it freezes is false the instant the entry lands, and a reader re-running the scan today gets **28**. ⭐ The `DISCHARGED` verdict is **not** undermined — `0238`'s step 2 asks for a **named list** of instances, the six files and their dispositions are correct, and I confirmed none is a live pointer. It is the occurrence arithmetic that is wrong. Correctable only by a further dated append. |
| R4 | 1 | medium | `log.md` § "2026-09-05 — ingest (sync) — sweep C, task `0358`" § "Sync window and delta" | *"Changed source files detected under `ai-agents/`, excluding the vault: **150**. Of those **14** knowledge-base files, **7** sprint files, **29** committed `done/` briefs."* Measured over `16754e3..cf289c2`: **141** paths (default) or **152** (`--no-renames`) — **150 reproduces under no variant I could construct**, including committed-plus-working-tree (181). Sprint files are **8**, not 7 (`backlog.md`, `sprint-6.md`, `sprint-7.md`, and `done/sprint-2..6.md`). ⭐ The other two figures are exact: **14** knowledge-base, **29** committed `done/` briefs, and the **10**-commit window is right. No effect on the deliverable; the defect is a wrong sync-window record now frozen in an append-only file. |
| R5 | 1 | low | `log.md` § "⛔ `0287` is EXCLUDED BY A BLOCKED UPSTREAM …" (and the same sentence in `worklog.md` § "The two upstream checks") | ⛔ *"`0287`'s vault pages were left ALONE."* Overbroad. `0287`'s brief enumerates five carrying pages, and **three of them are in this diff**: `index.md` (2 catalog rows added, plus the `0140` row rewritten), ADR-042's vault page (a dated resync note plus an ADR-045 back-link) and `systems/review-and-model-diversity.md` (an ADR-045 back-link). ⭐ **None of `0287`'s substance moved** — I diffed all three and no `read-only` sandbox sentence was touched — and the T3 ruling is correctly honoured: I re-measured **6** `--sandbox read-only` and **0** `--sandbox workspace-write` under `claude/`, `0273` is still `🔲 Backlog`, and `0287` is on neither close list. The claim needed to be *"`0287`'s sandbox claims were left alone"*; as written it is falsifiable by one `git status`. |
| R6 | 1 | low | `log.md` § "2026-09-05 — correction (task `0212`) …" § "The scope of this correction" | *"**Re-derived at run time**, as the brief requires — a scan of this file for the literal `still open` returns **23 hits**. … The other **21** refer to unrelated open items."* 23 is the **pre-append** count. The delivered file holds **31** — this run's own entries add 8 while quoting and discussing the two targets. The scoping conclusion is unaffected and correct (only two hits are in scope; I checked the other 21 at `HEAD` and they are unrelated open items), but the entry presents a baseline as *"re-derived at run time"*, and a future reader re-running the same scan cannot reconcile 31 with 23. |
| R7 | 1 | low | `log.md` § "⭐ The one issue found and fixed — and it is the reason this sweep existed" | *"**Two shipped, accepted ADRs had NO vault page at all.**"* ADR-046 is not shipped, and the same run says so twice — the ADR-046 vault page's own banner reads *"⚠️ **It is UNTRACKED on disk** — new this session, never committed"*, and the ingest entry repeats it. `Status: accepted` is true; *"shipped"* is not. One word, but it is the sentence that justifies the page's creation, and it now sits unamendable in the log. |
| R8 | 1 | low | `log.md` § "Addendum to the 2026-09-05 lint — the vault's own citation rule, checked" | *"Scanned the whole vault for a coordination-document path followed by a line number. **Found 4.**"* and *"⭐ **Genuine live coordinate defects in the vault: ZERO.** Recorded so a future scan's four hits are recognised as triaged history."* The scan matched the **full-path** form only. A filename-relative scan finds **19** further coordinates in the vault — `log.md:3091`, `log.md:1905`, `review.md:76`, `review.md:466`, `sprint-5.md:3`, `sprint-2.md:162` and others — all pre-existing, all in frozen entries, and `durable-citation-anchors` row 3 rules the form wrong **categorically**, not only when the path is absolute. ⭐ **The load-bearing half is verified true:** this run added **zero**, under the guard's own `TARGET` regex and under a deliberately looser matcher. The defect is that the record hands a future scan the number **4** where the same rule yields **23**, which is the opposite of the "recognise it as triaged history" outcome the addendum wants. |

### Verified as claimed — checked firsthand, no finding

Recorded so the coder does not re-verify them, and so the record shows what the pass got right.

- **T5 — the 11 ingested blobs.** All eleven `git hash-object` values in the worklog match the
  working-tree files exactly, including the untracked ADR-046.
- **T2 — the bound.** Present **inside** `log.md`, in two entries (`§ "⛔ THE BOUND — 45 uningested
  closed tasks are DELIBERATELY NOT IN THIS PASS"` and the lint entry's `§ "⛔ WATERMARK ADVANCED —
  and what that must NOT be read to mean"`), unambiguous, and it names the filing request without
  filing it. My own count of closed-task folders touched since the watermark is **64 / 48 without a
  slug-matched page** against the reported 61 / 45 — a difference in the safe direction, and the
  worker states the slug match is a floor.
- **T3 — `0287` not closed.** Re-measured: 6 `read-only`, 0 `workspace-write`, `0273` still
  `🔲 Backlog`. Five-of-six is the ruled outcome.
- **T4 — the `0199` reconciliation.** Written as this run's, dated **2026-09-05**, attributed to the
  run, ⛔ not framed as a quoted owner sentence (only the option label is quoted verbatim, which is
  the house form).
- **The owner-ruled `0317` / `0319` difference in kind.** Two separate dated entries, no shared
  "cleared both flags" line, and the distinction written **in words** — `0319` § "⭐ THIS FLAG IS
  **STALE**, NOT CONTESTED" versus `0317` § "⭐ VERDICT: `0238` is **DISCHARGED**" with *"a CONTESTED
  close reconciled."* `0317` carries the required **list**, not a count.
- **The 161 / 166 disambiguator.** Two `## 2026-07-26 — ingest (sync)` entries exist; the 161-page
  one carries the ADR-010 stale-text item with the quoted fragment, the 166-page one carries the
  ADR-029 §Decision 6 item with its fragment. Correct entries, correct fragments, no line number
  written, no fallback taken.
- **`dashboard.sh`'s reversed ladder.** Confirmed at `claude/skills/fkit-status/dashboard.sh:825-831`
  — `tid=$(folder_id_prefix "$folder")` runs first and `[ -n "$tid" ] || tid=$(task_id "$pr")` is arm
  2. Folder ID primary, Priority fallback. The frozen entry's claim is genuinely reversed.
- **ADR-010's re-measure.** **10** dated correction blocks and **four** site lists on disk today;
  `Status` `accepted`. All three figures confirmed, and the briefs' *"five / two"* is indeed stale.
- **ADR-012's resync.** `skills_for_role()` is defined only in `claude/skills-for-role.sh:51`;
  `build_settings()` only in `claude/fkit-claude.sh:295`. Both halves of the note are right.
- **Lint.** **274** content pages (0 features · 8 systems · 46 decisions · 220 tasks); **0** index
  gaps; **0** dangling index targets; **0** broken `[[…]]` across every content page; **12**
  unresolved relative markdown links, **all 12 inside inline code spans**, **0** genuine. **46 ↔ 46**
  ADRs verified **both** directions, by stripped-zero number *and* by exact filename slug.
- **Schema.** Both new pages carry `**Date**:` / `**Status**:` / `**Source**:` bold inline metadata
  and all four template sections; **zero** YAML frontmatter anywhere in the vault; both have
  `index.md` catalog rows; **all 10** of their cross-links reciprocate.
- **Diff surface.** Nothing under `ai-agents/tasks/` was written by this run but `0358`'s own
  `worklog.md` — `0319`'s and `0358`'s briefs both last changed **2026-09-04 21:34** and
  **2026-09-05 15:29**, before the run's writes at 17:47–17:48. ⚠️ The baseline's *"excluded by
  name"* list is **not exhaustive** (it omits the `0144` / `0251` / `0277` / `0278` / `0319` / `0323`
  brief edits, among others), so *"confirmed against the named baseline"* is weaker than it sounds —
  but the underlying claim is true on the mtime evidence.
- **The `npm test` discipline.** Refusing to claim the suite before observing it, then reporting it
  and immediately saying what it cannot prove, is the right call and is not re-litigated here.

## Coder response

<!-- CODER-OWNED (ADR-038). The reviewer never writes this section. -->

⛔ **Written by a spawned `fkit-coder` on the owner's ruling of 2026-09-05, option label verbatim
"Spawn a coder to write the section (Rec)."** The deliverable is vault-owned, so the wiki worker built
it and dispositioned these eight findings in its own records. `fkit-process-stateful-review` is
coder-only in `skills_for_role()` and the ADR-018 hook denies it to a wiki identity at any spawn
depth, so that worker **correctly refused** to write this section. ⭐ **Consequence for every Action
cell below: the repairs were applied by the wiki worker's pass, NOT by me.** My act was Step 3
verification — I re-measured each finding against the artifact firsthand and checked that the claimed
disposition is present on disk and correctly described. Where a cell says a repair landed, I read it;
where it says one did not, I looked for it and it is absent.

| # | Verdict | Defect / Frontier | Action | Status |
|---|---------|-------------------|--------|--------|
| R1 | **CORRECT** — and severity **high**, derived here, not inherited: the cited section is the producer's pre-close hand-off, and acting on `13` would red `reference-integrity` mid-sweep with nobody expecting it | **Defect** (site is the task's own record — ADR-034 splits it from the work product) | ⛔ **NOT mine — applied by the wiki worker's pass**, which corrected the worklist to **15 unconditional + 3 order-sensitive** and named the root cause (substring-matching the raw href instead of resolving it; a `wiki-vault` path filter that excluded this task's own folder). **My independent re-measurement confirms the correction and then exceeds it.** Resolving every markdown link under `ai-agents/` (vault excluded) through the guard's **own** `maskFencesAndQuotes` + `maskCodeSpans` + `LINK`: **20** links resolve into the five closing folders. True break set **18 unconditional + 3 order-sensitive**, of which **17 unconditional are guard-visible**. ⭐ Both of the worker's refinements verified true: the `0358` brief cites `0212` on a **blockquote** line and **0 links survive masking there** — a real break for a human, invisible to the suite; and of the 4 outbound links from a moving folder, the **3** of `../../done/X` shape (to `0143`, `0232`, `0318`) survive the move and ⛔ must not be repointed, while `0319`'s `../0290` does not and breaks. ⛔ **THE GAP: the corrected worklist is still short by 3.** This ledger's own R1 row carries three markdown links — to `0212`, `0199`, `0317` — that resolve out of this folder, survive masking, and break unconditionally when those three close, because `0358` stays in `backlog/`. The reviewer's scan predates its own row, so 17-vs-20 is exactly self-exclusion. ⛔ **I cannot close this gap: the worklist lives in `worklog.md`, the wiki worker's surface, and the three links live in `## Reviewer findings`, which I must never edit.** ⭐ **CLOSED OUT 2026-09-10 — the gap named above is closed on disk, and I checked the work product, not a record of it.** `worklog.md` § *"2026-09-06 — R1, the FINAL corrected worklist ⭐ THIS IS THE ONE THE PRODUCER USES"* supersedes both earlier figures at **18 unconditional + 3 order-sensitive, 17 guard-visible**, and its worklist table carries the row this ledger said was missing — *"`0358`'s **`review.md`** (the R1 row) \| `0212` · `0199` · `0317` \| **3**"* — plus *"⛔ Who repoints `review.md`"* routing them to the producer. ⭐ **And the worklist was ACTED ON, which is the stronger proof:** all five members are in `ai-agents/tasks/done/` today, `reference-integrity` measures **0 broken over 3391 resolved targets** with `done/` folders in scope (its own arm *"M2 mutation: a broken link in ai-agents/tasks/done/ REDS"*), and the three sibling links out of this file to `0212` / `0199` / `0317` resolve — they **healed** on the joint move rather than needing a repoint. ⚠️ **One quoted link out of this file does NOT resolve and is deliberately suppressed** — the R1 row's quotation of `0319`'s brief citing `0290`, which is a `NAMED_EXEMPT` pair in `test/reference-integrity.test.js` with its own trip-wire comment (*"if 0290 ever closes into `done/` … the fix is DELETION of this key"*). Exempt count measured **7**, unchanged by this write. | `✅ done` |
| R2 | **CORRECT** — severity **medium**, mine: the artifact is sound, the evidence for it is not | **Defect** (own record — ADR-034) | ⛔ **NOT mine — the wiki worker's pass** corrected the proof table to **7 appends** ending **`591 0`**, and proved appends F and G each against a fresh pre-append snapshot by `cmp`. **Verified firsthand and independently:** `git diff --numstat` gives `591 0`; `git diff -U0` yields **0** deletion lines; the `HEAD` file is 3515 lines and the delivered file's first 3515 lines are **byte-identical** to it under `cmp`; delivered length 4106 = 3515 + 591. Seven append operations confirmed by heading count (six `##` entries dated 2026-09-05 plus the `###` lint addendum). ⭐ The append-only property itself always held — the defect was only ever the audit record. ⚠️ **Residual:** the original § "Stage 3" still reads *"Four appends"* over a table ending `455 0`, uncorrected and with no forward pointer to the corrections section below it. Fixing that is a `worklog.md` write, not mine. | `✅ done` |
| R3 | **CORRECT** — severity **medium**, mine: the number is wrong three ways, but it is the *support* for a verdict, not the verdict | **Defect** (work product — `log.md`) | ⛔ **NOT mine — discharged by the further dated append** the owner ruled ("One further dated append in this row (Rec)"), which I read in full at `log.md` § "2026-09-05 — correction (task `0358`, round 1 review)". **All three sub-claims re-measured by me:** (a) the frozen table's rows sum to **27**, not 26; (b) the literal pre-archival path occurs **19** times in `log.md` at `HEAD` (**26** vault-wide) and **22** now (**29** vault-wide), so the frozen `20` cell matches neither state; (c) the entry's own text contains the literal, so the count self-invalidates on landing. ⭐ Verdict correctly untouched — `0238`'s step 2 asks for a **named list with dispositions**, the six files and their dispositions are right, and none is a live pointer. | `✅ done` |
| R4 | ⛔ **INCORRECT** — the finding does not hold. Severity n/a | — | ⛔ **No correction written, and that is the right call** — amending a correct figure would have frozen a false statement in an append-only file; the append records the measurement instead. **I re-ran both commands myself rather than accept the builder's word.** Under the command `/fkit-wiki-sync` step 2 itself prescribes, over the pre-run watermark to `HEAD`: **150** paths with renames and **150** with `--no-renames`; sprint files **7** under both. A **tree-to-tree** `git diff` over the same range gives **137** — a different question (net change between two trees, not paths touched by commits in the window). ⭐ **I can also name why the reviewer counted 8 sprint files, which the append could not:** its eighth is `ai-agents/sprints/sprint-6.md`, whose only event in the window is a **`D`elete** — excluded by the procedure's own `--diff-filter=AMR`, and gone from disk. Both reported figures stand as written. | `disproven` |
| R5 | **CORRECT** — severity **low**, mine: the sentence's *purpose* is honoured, only its wording is falsifiable | **Defect** (work product — `log.md`; the own-record half is separate and was fixed) | ⛔ **NOT DISCHARGED IN THE WORK PRODUCT, and both prior records say otherwise.** The wiki worker's own disposition table reads *"Wording corrected below and in the append"*, and the driver's brief relayed *"corrected in both records"*. **I checked the append: it contains no R5 section, and `0287` appears in it exactly once, in the preamble line "`0287` stays **open**".** A vault-wide search for the corrected wording *"sandbox claims"* returns **nothing**. The overbroad sentence therefore stands uncorrected in the frozen ingest entry at `log.md` § "⛔ `0287` is EXCLUDED BY A BLOCKED UPSTREAM …", reading *"`0287`'s vault pages were left ALONE."* **The finding is true:** 3 of `0287`'s 5 named carrying pages are in this diff — `index.md`, ADR-042's page, and `wiki/systems/review-and-model-diversity.md`. ⭐ **T3's substance is intact and I re-verified it**: no `read-only` sandbox sentence moved on any page (the only added line mentioning the sandbox asserts the substance is unchanged), **6** `--sandbox read-only` and **0** `--sandbox workspace-write` under `claude/`, `0273` still `🔲 Backlog`. ⛔ **I cannot fix this: the correction is a write to `ai-agents/wiki-vault/`, exclusive to `fkit-wiki` under ADR-005, and the owner's append ruling scoped the instrument to R3/R4/R6/R7/R8.** ⭐ **CLOSED OUT 2026-09-10 — discharged in the WORK PRODUCT, verified by grepping the vault's bytes for the corrected wording, never a record claiming it.** A later owner ruling (label verbatim *"One more fkit-wiki append (Rec)"*) scoped a further append, and `fkit-wiki` wrote it: `ai-agents/wiki-vault/log.md` § *"2026-09-06 — correction (task `0358`, round 1 review, R5) — the `0287` exclusion claim"*, which reads the sentence instead as *"⭐ **`0287`'s SANDBOX CLAIMS were left alone.**"* **My own measurements:** `grep -c "sandbox claims\|SANDBOX CLAIMS"` on `log.md` returns **3** today (the append's own two, plus one in the wiki's 2026-09-10 withdrawal entry) against the **0** that exposed the gap; the original overbroad sentence is **still present byte-identical** in the frozen ingest entry § *"⛔ `0287` is EXCLUDED BY A BLOCKED UPSTREAM — not by oversight, and it is NOT on the close list"* — annotated, never rewritten, as append-only requires. ⭐ **T3's substance re-verified by me today: `0273` `🔲 Backlog`, `0287` `🔲 Backlog`, both still in `ai-agents/tasks/backlog/`.** ⛔ **`0287` stays genuinely owed — see the residual below; it is NOT a residue of this finding.** | `✅ done` |
| R6 | **CORRECT** — severity **low**, mine: the conclusion is right, the label on the number is wrong | **Defect** (work product — `log.md`) | ⛔ **NOT mine — discharged by the same dated append.** **Re-measured by me:** the literal `still open` occurs **23** times in `log.md` at `HEAD` and **32** now. **23 is a pre-append baseline, not a run-time re-derivation.** ⭐ The scoping conclusion is unaffected and correct — only two hits are in scope and both were named by durable anchor. | `✅ done` |
| R7 | **CORRECT** — severity **low**, mine: one word, in the sentence that justifies the page | **Defect** (work product — `log.md`) | ⛔ **NOT mine — discharged by the same dated append.** **Verified by me:** `git ls-files` does not know the ADR-046 file — it is **untracked, never committed** — while ADR-045's file is tracked. *"Shipped"* is false; `Status: accepted` is true, and the run says so twice elsewhere. ⭐ The justification for creating both pages is unaffected. | `✅ done` |
| R8 | **CORRECT** — severity **low**, mine: the load-bearing half is true; the harm is a number handed forward | **Defect** (work product — `log.md`) | ⛔ **NOT mine — discharged by the same dated append**, which correctly declines to freeze a *second* number and states the class is matcher-bound. **Re-measured by me:** the full-path form yields exactly **4** vault-wide, confirming the addendum's matcher; a filename-relative matcher yields **24** — my own figure differs from the reviewer's 23, which is itself the point the correction makes. ⭐ **The load-bearing half re-verified TRUE: this run added ZERO** — no coordinate of either form appears in any line the run added to the vault. | `✅ done` |

### ⭐ CLOSED OUT 2026-09-10 — R1 and R5 verified discharged, in the work product

⛔ **Written by a spawned `fkit-coder` on the owner's ruling of 2026-09-10, option label verbatim
"Close out 0358's review ledger (Rec)."** ⛔ **Nothing else changed.** `0358` is **not** reopened, not
moved and not re-statused — it stays in `ai-agents/tasks/done/`, and no vault file, source file, test,
board or brief was touched by this write. My whole surface is this section, the header's `Status:`,
*Accepted residuals*, and this folder's `worklog.md`.

⚠️ **I was told the two rows were discharged and told NOT to take it on trust. I did not.** Each claim
below was re-measured firsthand this turn, and the check applied is the one this task's own record
names: ⭐ **grep the work product for the corrected content, never the record for a claim of
correction.**

| Claim put to me | How I checked it | Result |
|---|---|---|
| R1 discharged 2026-09-06 | read `worklog.md` § *"2026-09-06 — R1, the FINAL corrected worklist"*; then resolved every relative link out of this folder's four files against the tree; then ran `reference-integrity` | ⭐ **HOLDS.** Worklist superseded to **18 + 3**, the three missing `review.md` links named, and the guard measures **0 broken / 3391 resolved / 7 named-exempt** with all five members now in `done/` |
| R5 discharged 2026-09-06 | grepped `ai-agents/wiki-vault/log.md` for the *corrected wording*, not for a record of it | ⭐ **HOLDS.** The 2026-09-06 R5 append is on disk; *"sandbox claims"* / *"SANDBOX CLAIMS"* returns **3** hits where the defect's signature was **0**; the original sentence is intact byte-identical |
| A wiki investigation measured the deliverable FINISHED, five-of-six | read `log.md` § *"2026-09-10 — withdrawal (task `0358`) — the standing `partial — not ready to close` flag, discharged"* and the sweep's vault page | ⭐ **HOLDS, and I re-derived the sixth myself.** `0273` and `0287` are both `🔲 Backlog` — `0287` is **correctly not done**, because the brief prescribes *reporting* a blocked member, not closing it. **Five-of-six is the specified outcome, not a shortfall** |
| The wiki recorded a **dated withdrawal** leaving both original flag lines intact | read both write sites | ⭐ **HOLDS.** Annotated, never rewritten — the sweep page's *"⚠️ **THE VAULT'S OWN LAST WORD ON THIS ROW WAS `Task 0358: partial — not ready to close`**"* block still stands, with the dated *"⭐ **RESOLVED 2026-09-10 …**"* block directly beneath it |

⚠️ **What I did NOT verify, and why.** The two vault writes above are **uncommitted in the working
tree**; I read them there and did not touch, revert or tidy them — the vault is `fkit-wiki`'s
exclusively under ADR-005. I re-ran **two guards**, not the full suite. And I did not re-audit R2, R3,
R4, R6, R7 or R8 — they were dispositioned in an earlier round and nothing in this closeout depends on
re-opening them.

⚠️ **One residual carried forward unchanged, already named in R2's own row:** `worklog.md` § *"Stage 3
— the three member `log.md` appends, PLUS the pass entry"* still reads *"Four appends"* over a table
ending `455  0`, with no forward pointer to the corrected 7-append table below it. ⛔ **I left it
alone deliberately** — R2 is discharged by the correction section, the owner's ruling scoped this
write to the ledger closeout, and rewriting a run record to tidy it is the failure mode this task
spent two rounds learning. It is a stale own-record line, not a live defect.

> # ⛔ THE TWO SECTIONS BELOW ARE SUPERSEDED BY THE ONE ABOVE. DO NOT ACT ON THEM.
>
> ⛔ **They state that R1 and R5 are blocked and that the header must stay `in-review`. Both were true
> when written on 2026-09-05 and are FALSE today.** ⭐ They are kept byte-identical, not deleted,
> because they are the record of what was owed and of why the ledger could not close then.

### ⛔ Two findings are NOT discharged — stated before anything else in this section

- **R5 — a live, uncorrected defect in the WORK PRODUCT.** Under ADR-034 a work-product defect blocks
  the ledger; only an own-record residual is recordable instead. R5's site is `log.md`. ⚠️ **The
  hazard is not the wording, it is that two records assert a repair that is not on disk** — the exact
  *"a record row describing a repair is not evidence a repair happened"* failure. Discharging it needs
  one more dated append, which only `fkit-wiki` may write (ADR-005) and which the owner's append
  ruling did not scope.
- **R1 — the corrected worklist is still short by 3 guard-visible breaks.** Site is the task's own
  record, so ADR-034 permits recording it as a residual rather than driving another round — ⛔ **but it
  cannot simply be recorded and dropped, because the producer acts on that worklist and the three
  breaks red the suite at close time.**

### `Status:` — left at `in-review`, deliberately

Step 6 permits `closed-out` only when every novel finding is closeout / disproven / accepted and
**nothing blocking remains**. R5 is a work-product defect that ADR-034 does not let me convert to a
residual, and R1's discharge is incomplete; neither is fixable from this role. Six of eight are
genuinely discharged and one is genuinely disproven, so the ledger is close — but not closed.

### What I re-measured firsthand, and what I did not

**Measured this turn:** the link resolution and its masking, through the guard's own exported
`maskFencesAndQuotes` / `maskCodeSpans` / `LINK`; `log.md`'s `591 0` and the byte-identical 3515-line
prefix; all four sync-window variants; the pre-archival-path and `still open` occurrence counts at
`HEAD` and now; ADR-045/046 git tracking; the two citation-coordinate matchers; the sandbox counts and
`0273`'s board row; the vault's 19-modified-plus-2-new surface. Both guards — `reference-integrity`
and `coordination-citation-policy` — **41/41 before this write and 41/41 after it**.

⚠️ **Not verified by me:** the wiki worker's reported unit-suite and `prove-red` figures are its own;
I ran the two guards, not the full suite. ⚠️ **Out of my baseline:** the working tree carries a great
deal that is not this task's — Sweep B's renames, closed `0357`/`0361` folders, ADR-046, other briefs
and board edits. **My own diff is this file and nothing else.**

## Accepted residuals (shared, do-not-re-litigate)

- **`0287` is genuinely owed, and it is NOT a residue of `0358`** — recorded 2026-09-10 on the owner's
  closeout ruling. **What:** sweep `0358` resynced **five** of its six members and deliberately did not
  resync `0287` (the Codex-sandbox `read-only` vault pages). `0287` and its upstream `0273` are both
  `🔲 Backlog`, both still in `ai-agents/tasks/backlog/`, and **6** `--sandbox read-only` / **0**
  `--sandbox workspace-write` remain under `claude/` — re-measured this turn. **Why (structural):**
  `0358`'s brief prescribes **reporting** a member whose upstream has not landed, never closing it;
  resyncing those pages while `0273` is unshipped would write a page **wrong in a new way**, which is
  what `0287`'s own step 2 exists to prevent. ⭐ **Five-of-six is the specified outcome, not a
  shortfall** — the rejected alternative was to reach a closable six by re-taking the measurement, and
  the pass explicitly refused it. **Re-raise only if:** `0273` lands (then `0287` becomes actionable on
  its own brief, as a live task — never as a reopening of `0358`), **or** a later reader finds a vault
  page whose sandbox claim moved during sweep `0358` after all, which would falsify the corrected
  sentence *"`0287`'s SANDBOX CLAIMS were left alone"* rather than the exclusion.
