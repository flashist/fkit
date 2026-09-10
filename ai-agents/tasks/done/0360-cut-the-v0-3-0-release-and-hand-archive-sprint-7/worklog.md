# Worklog — `0360` cut v0.3.0 and hand-archive Sprint 7

**Role:** fkit-coder (Build worker), spawned by the fkit lead's `/fkit-sprint-ship-loop`.
**Date:** 2026-09-08. **Baseline HEAD:** `5ed0b91`. **Release commit:** `b677fa0`.

Phases 0–3 of the approved plan only. ⛔ Phase 4 (review, producer close) is the driver's and was
not performed here. ⛔ Nothing was pushed; no mover was run; no folder was moved; the vault was
not written.

## What was done

1. **Phase 0 — baseline frozen.** `reference-integrity` 20/20, 876 files, 3386 targets, 0 broken,
   7 named-exempt. Board 15 rows: 13 done / 1 in progress / 1 cancelled. `VERSION` `0.2.2`.
2. **Phase 1 — release.** `npm run release:minor -- --dry-run` (confirmed **v0.3.0**, and confirmed
   by measurement that the unflagged command **would push** `main` and the tag). Then
   `npm run release:minor -- --no-tag --no-push` → commit `b677fa0`, `⚠ NOT released`. Annotated tag
   `v0.3.0` created **by hand**, message naming Sprint 7 and the measurement-anchor purpose.
   Verified `objecttype` = `tag`, absent from `origin`, commit unpushed.
3. **Phase 2 — archive.** `0360`'s `P12` row flipped to `✅ Done (agent-closed — not owner-verified)`
   by hand **before** the move (ruling Z2); banner written under the H1; `git mv` into
   `sprints/done/`; 96 outbound link targets repaired by script; 36 inbound instances repaired
   across 14 files; Z5 open-question answer and Z6 annotations recorded.
4. **Phase 3 — proof.** See the evidence packet returned to the driver.

## ⛔ Decision log — choices made without asking, per ADR-019's audit obligation (carried by ADR-032)

No review was processed in this unit of work, so there are **no per-finding fixes** to record. The
entries below are the judgement calls taken inside the approved plan.

| # | The call | What changed | Why it qualified |
|---|---|---|---|
| 1 | **The plan's "8" and "9" guard-invisible links are both right.** Measured: 91 links = 82 guard-visible + **8** real links masked by blockquotes + **1** code-span literal. "8" = masked links needing repair; "9" = all masked instances. | Nothing in the repo; reported to the driver. | Verified `CORRECT` by measurement, documentation-only, no scope change. Not an inconsistency needing a ruling. |
| 2 | **The 5 inbound code-span `sprint-7.md` literals were NOT repaired.** | Nothing — deliberately left byte-identical. | In-plan: the plan says link **targets only** and forbids a blind `sed`. A link inside a code span is quoted literal text, not a pointer; repairing it would corrupt a quotation. The plan's own inbound count (**36**) already excludes them, and measurement reproduced exactly 36. |
| 3 | **The archival banner adds 5 links of its own** (4 × `](../…)`, 1 × `](backlog.md)`), taking the file 91 → 96 links. | `sprints/done/sprint-7.md`. | Mechanical consequence of writing the banner the plan requires; the same four repair rules cover them. Reported explicitly so the plan's pinned 75/13/1/2 breakdown is not silently restated as if unchanged. |
| 4 | **Verification widened beyond the plan:** a repo-wide by-hand resolver, plus the same resolver re-run against the pre-archival tree in a throwaway `git worktree`. | Nothing in the repo; the worktree was removed and pruned. | Verification only, no source effect, cheapest way to *prove* rather than assert that no broken link was introduced. It found the honest answer: the 186 pre-existing masked-placeholder breakages are the **identical set** before and after. |

⭐ **No frontier move, no scope widening, no behaviour-changing fix, and nothing outside the approved
plan was done.** No `NAMED_EXEMPT` entry was added; the pinned count stayed **7**. `sprint-6.md` was
not touched. No rank was changed and nothing was renumbered.

## ⚠️ Known residuals, stated rather than hidden

- **The board carries a recorded drift:** `0360` plan=`✅ Done` / brief=`🔄 In progress` /
  location=`backlog/`. Created deliberately by ruling Z2 and resolved only by the producer's
  `/fkit-task-done`. ⛔ The board is **not** drift-free and was not reported as such.
- **The archive is uncommitted**, and tag `v0.3.0` sits one commit **before** the sprint's closing
  commit (ruling Z7, accepted).
- **A green guard does not prove the archive.** `reference-integrity` masks blockquotes and code
  spans and cannot see 14 of the moved file's 96 links. Those were resolved by hand, and that result
  is reported separately from the guard's. ⚠️ **Superseded by round 1 of the review** — the file now
  carries **99** link-syntax instances (97 followable + 2 inline-code literals) and the guard still
  cannot see **14** of them. See the round-1 log below.

---

# Round 1 of the stateful review — processed 2026-09-08

**Role:** fkit-coder (Process-review worker), spawned by `/fkit-sprint-ship-loop` under its
declared-approval marker. ⛔ **No per-round owner gate was used**; R1, R6 and R8 carry live owner
rulings relayed in the spawn prompt, and R2/R3/R4/R5/R7/R9 were applied under the standing approval.
⛔ Nothing was committed or pushed; no mover was run; no folder moved; the vault was not written;
`sprint-6.md` still byte-identical; `NAMED_EXEMPT` still **7**.

## ⛔ Decision log — round 1, per ADR-019's audit obligation (carried by ADR-032)

| # | Finding | What changed | Why it qualified |
|---|---|---|---|
| 1 | **R1** | Banner § "⛔ SUCCESS CRITERION — **MISSED.**": the like-for-like pair restated as the script's own figures at both ends (**33.3% → 17.9%**, **35.7% → 20.5%**), the ruled hand baseline **42 / 129 = 32.6%** kept beside it and labelled as a hand classification. | ⭐ **Owner ruling** *"Report the script's own figures (Rec)"* — applied as ruled, not chosen. Re-measured `throughput.mjs --at a9c2709` firsthand (**46 / 35.7%**, **43 / 33.3%**) rather than inheriting the reviewer's figures. |
| 2 | **R1, extra** | The success table's baseline column header now reads *"HAND-classified"* and its measured column *"script"*. | ⭐ **Obvious winner inside the ruling's intent.** The ruling requires the hand baseline to be *"labelled as the hand classification it is"*; leaving the table unlabelled while the bullet below it named the distinction would have created a fresh internal contradiction in the same section. Header text only — no figure changed. |
| 3 | **R2** | `0237`'s Z6 annotation moved to after the sentence it split; the frozen prose is whole again. | Verified `CORRECT` against the bytes, mechanical and localized, in-plan (Z6 authorized the annotation, not the split), and the `0176` twin is the model. Nothing rewritten — text moved. |
| 4 | **R3** | Banner inbound bullet: *"29 inside closed and cancelled"* → **7 + 23 + 6**, with the six named as `0360`'s own still-open folder. | Verified by my own per-file count of the added targets (36 total). Mechanical correction of a false figure in a record that becomes permanent on commit. |
| 5 | **R4** | The categorical *"Href only — nothing else in a closed record was touched"* narrowed to **twelve of the fourteen**, naming `0176` and `0237` and the Z6 annotations they carry. | Verified by `git diff --numstat` (`9 2` for both). ⛔ The **act** was authorized; only the **claim** was false, so the claim — not the act — was changed. |
| 6 | **R5** | Open-questions preface: *"Question 3 was never answered and stands"* → **ANSWERED 2026-09-08**, quoting Z5's option label. | This task made that sentence false; correcting it is in-plan (Z5 requires the question be marked answered). |
| 7 | **R5, deliberate non-fix** | The same preface's *"Questions 4–6 are NEW and open"* was **left untouched**, and flagged in the ledger. | ⛔ **Stopped rather than widened.** Verified against `HEAD` that it was already false on 2026-08-29 — pre-existing, not created by this task, and outside the approved plan. Recorded, not silently fixed and not silently ignored. |
| 8 | **R6** | The third stale `backlog.md` quote, in § "⭐ Addendum — the FOURTEENTH row", gained the same dated 2026-09-08 annotation; the quote is byte-identical. | ⭐ **Owner ruling** *"Annotate it too (Rec)"*, with Z6's annotate-never-rewrite rule governing. Verified the live row really is stale before annotating. |
| 9 | **R6, placement** | The annotation was placed at the **end** of the bullet rather than beside the quoted line. | ⭐ **Obvious winner within intent** — R2 is a live example of what beside-the-quote placement costs when the quote sits mid-sentence. End-of-bullet splits nothing. |
| 10 | **R7** | Banner now declares **one** counting rule for both directions and restates every count on the final bytes: **99 instances = 97 followable + 2 inline-code literals**, 97 resolved, 0 broken, 14 invisible to the guard. | Verified `CORRECT`: both `](sprint-7.md)` instances are code-span literals, one wrapping two lines. ⛔ **Every figure re-measured after the last edit**, because R1's and R6's own text changed the file. |
| 11 | **R8** | Local annotated tag `v0.3.0` deleted and recreated on the same commit `b677fa0`, first line now *"anchors Sprint 7"*. | ⭐ **Owner ruling** — option label verbatim **Retag as "anchors Sprint 7" (Rec)**. Verified first that the tagged tree still carries the `🔄 In progress` row; verified after that the object is still `tag`, still unpushed (zero refs on `origin`), and carries no secret. |
| 12 | **R9** | *"fell by roughly a third"* → **more than two-fifths**: **42.6%** and **46.2%** on the script's own like-for-like pairs. | ⛔ **Deliberately NOT the reviewer's 41.3 / 45.1 / 41.1.** Those are right for the pre-R1 pairs; R1 changed which pairs the sentence names, so re-deriving was required to avoid re-introducing the mis-derivation R1 exists to remove. Corrected upward, as the finding required. |
| 13 | **R7, a wrong first draft of my own fix — caught and corrected before finishing** | My first rewrite of the green-guard paragraph said the guard cannot see *"7 followable links inside blockquotes plus the 2 inline-code literals"*. ⛔ **That was wrong.** Measured per line, the invisible 9 of the original 91 are **8 blockquote links + 1 literal**: the second literal wraps two lines, so the guard **can** see it and **counts it as a followable link**. The shipped paragraph says that, and names the mis-read as the worse of the two failures. | Recorded because the audit obligation is to make a wrong fix findable. It came from reusing a document-level number in a sentence about a per-line masker — the same class of error R7 exists to correct. |
| 14 | **Verification widened** | Repo-wide by-hand link resolver re-run over the working tree **and** a `git archive` of `HEAD`, twice — once excluding `ai-agents/wiki-vault/` (**30 → 30**) and once including it (**31 → 31**). | Verification only, nothing changed in the repo. It explains rather than contradicts the reviewer's **31**: that is the with-vault reading, and under **both** corpora the broken set is **byte-identical** before and after. |

⭐ **No frontier move, no scope widening, nothing outside the approved plan, and no `NEEDS-DECISION`
was reached.** Every one of the nine findings was a defect and every one was fixed.

## ⚠️ Round-1 residuals, stated rather than hidden

- ⛔ **Nothing I changed has been independently verified.** Nine fixes landed; a round-2 reviewer pass
  over the final bytes is the honest next step. The ledger therefore stays **`in-review`**.
- ⛔ **Seven of the nine corrections sit in text that becomes permanent on the owner's commit**, and
  **R8's sits in an object that becomes permanent on the owner's push.** Neither has happened.
- ⚠️ **The open-questions preface still says *"Questions 4–6 are NEW and open"* while 4, 5 and 6 all
  read ANSWERED 2026-08-29.** Pre-existing at `HEAD`, out of the approved plan, deliberately left.
## ⛔ Decision log — round 1 addendum, 2026-09-09, per ADR-019's audit obligation (carried by ADR-032)

⭐ **One fix, owner-ruled, applied by a spawned `fkit-coder` Process-review worker under
`/fkit-sprint-ship-loop`'s declared-approval marker.** ⛔ **Nothing else was touched.**

| # | What it answers | What changed, and why it qualified |
|---|---|---|
| 15 | **`R5b`** — the § "Open questions for the owner" preface says *"Questions 4–6 are NEW and open"* while questions 4, 5 and 6 all read `✅ ANSWERED 2026-08-29`. Raised by me in round 1 and left as out-of-plan; ⭐ **ruled IN by the owner on 2026-09-09**, option label verbatim **"Fix it now (Rec)"**. | A dated **CORRECTION 2026-09-09** note was appended inside the same blockquote in `ai-agents/sprints/done/sprint-7.md`. ⛔ **The original sentence is left byte-identical** — annotate, never rewrite (ruling Z6), the house pattern the `P9` and `P13` rows already use. **Qualified as:** verified `CORRECT` by me at `HEAD` before writing, mechanical and localized to one blockquote, and **inside the approved plan** by a specific owner ruling naming this fix. |
| 16 | **The pre-existing-falsity claim, re-verified rather than inherited** | ⭐ **It held, and it is stronger than round 1 recorded.** Round 1 said "already false at `HEAD`". Measured this turn: the preface sentence and all three `✅ ANSWERED 2026-08-29` markers were introduced in the **same commit**, `0d8b08e` of 2026-08-29 — so the sentence was **false in the commit that created it**, and stood unchanged at `5ed0b91` (pre-release) and `b677fa0` (release). The correction note states this, ⛔ **so the record does not blame the archival for a defect it inherited.** |
| 17 | **Question 4 is not a clean "answered"** | The note says so instead of flattening it: question 4's own text reads *"The question itself is still open — the ROW is what was ruled, not the answer"*, so it is answered **as filed** (`0361` at `P13`), with the merits settled later by that row. ⛔ **Judgment call resolved by recording the qualification, not by asserting the simpler claim.** |
| 18 | **The two dates are kept apart** | The answers are dated **2026-08-29**; the correction is dated **2026-09-09**. The note says both and warns against reading them as one. |
| 19 | **Verification re-run on the FINAL bytes** | `reference-integrity` **20/20** (878 files, 3391 targets, 0 broken, exempt 7) · `coordination-citation-policy` **21/21**, residual **0** · `closed-rank-immutability` **39/39** · `npm test` **872/872**, prove-red **31 mutations, hard gate PASSED** · `dashboard.sh` on the archived board **14 done · 1 cancelled — of 15** with the expected `0360` drift row · `select-active` **`active none`** · by-hand resolver **99 = 97 followable + 2 literals, 97 resolved, 0 broken, 14 guard-invisible (13 blockquote + 1 per-line literal)**. ⭐ **Identical on the pre-edit bytes** — ⛔ **no link count moved**, because the note contains **zero** link-syntax instances. Verification only; nothing in the repo changed for it. |
| 20 | **A figure I could not reproduce, recorded rather than smoothed** | Round 1's repo-wide broken set of **30 / 31** did not reproduce under my resolver, which measures **19 / 19** (tracked+untracked `*.md`, fences and code spans masked, elided and scheme targets skipped, `test/fixtures/` excluded). ⛔ **Different corpus definition, not a contradiction** — I did not reconstruct round 1's. What I did re-measure directly is the **movement**: the broken set is **byte-identical before and after** this edit (same count, same sha256 over the sorted set). |

⭐ **No obvious-winner call was made beyond the shape choice in row 15**, and ⛔ **no `NEEDS-DECISION`
was reached** — the owner's ruling covered the one judgment this fix needed.

## ⚠️ Round-1 addendum residuals, stated rather than hidden

- ⛔ **This fix has NOT been independently verified either.** It lands in the same frozen text as the
  round-1 nine, and the round-2 reviewer pass runs over all of it.
- ⛔ **Nothing was committed, pushed, moved or re-ranked.** The release commit `b677fa0` and the local
  annotated tag `v0.3.0` were not touched; `ai-agents/sprints/sprint-6.md` is **byte-identical to
  `HEAD`**, re-checked this turn; `NAMED_EXEMPT` is still pinned at **7**.
- ⚠️ **`0360`'s own brief still reads `🔄 In progress` and its folder is still in
  `ai-agents/tasks/backlog/`** — that is the drift `dashboard.sh` reports, and only the producer's
  close clears it.

# Round-2 closeout — 2026-09-10 (records-only)

⭐ **Two owner dispositions, both ruled live via `AskUserQuestion` in the `/fkit-sprint-ship-loop`
driver session and relayed to me in the spawn prompt**, option labels verbatim:
**"Close out — no round 3 (Rec)"** and **"Record as accepted residual (Rec)"**.

⛔ **Nothing in the repository changed.** Two files written, both records: this task's `review.md`
(*Coder response* section and the header only — ⛔ the *Reviewer findings* section was not touched)
and this `worklog.md`. ⛔ **No source edit, no `.claude/` edit, no vault write, no mover, no folder
moved, no board row flipped, no re-rank, no `NAMED_EXEMPT` addition** (pin stays **7**). ⛔ **No
commit, no push**; commit `b677fa0` was not amended and the local annotated tag `v0.3.0` was not
touched. ⛔ **The archived board `ai-agents/sprints/done/sprint-7.md` is untouched and final** — in
particular `R9`'s figures were **not** "improved": the residual records the basis, it does not change
the text.

## ⛔ Decision log — round-2 closeout, per ADR-019's audit obligation (carried by ADR-032)

| # | What it answers | What changed, and why it qualified |
|---|---|---|
| 21 | **Owner disposition 1 — "Close out — no round 3 (Rec)"** | Ledger header set from `Status: in-review` to **`Status: closed-out`**, with a comment recording the date, the verbatim option label and where the reason lives. A new § "⭐ Round-2 closeout — 2026-09-10" records that round 2 **verified all ten fixes** (`R1`–`R9` + `R5b`), found **zero novel defects** and added **no `R10`**. **Qualified as:** a direct owner ruling naming this disposition — not my call to make and not made as one. |
| 22 | **Codex `C1` and `C2` recorded as disproven; `C3` recorded as a resolved coverage limit** | A table names all three with the labels the reviewer's own disproven list uses, so a reader can find each one from either name. `C2` is recorded as falling **with** `C1`, since `C1`'s counts were its premise. ⭐ **`C3` is deliberately NOT recorded as a disproven finding** — it was never a defect claim, it was Codex's sandbox having no network, and the reviewer resolved it by measuring `git ls-remote --tags origin` → zero `v0.3.0` refs. Flattening those two shapes into one would misreport the round. |
| 23 | **`C1`'s disproof reason recorded IN FULL, not summarised** | ⭐ **Instructed, and correct on the merits: this is the round's one real contest and a future reader will hit it again.** Recorded: Codex counted with a bare `](target)` pattern, which sweeps up **11 pattern fragments the banner writes while describing its own repair rules**; those carry **no `[label]`** and are not links under the repo's own ruled grammar, `test/reference-integrity.test.js`'s exported `LINK` (`test/reference-integrity.test.js:263`), commented *"What counts as a link: a markdown inline link."* ⭐ **The tell is recorded too — Codex's own before-count of 91 agreed exactly, and the divergence appears only after the banner introduced the fragments** — because without it the disproof reads as one counter's word against another's. |
| 24 | **Owner disposition 2 — "Record as accepted residual (Rec)"** | An *Accepted residuals* entry added for **`R9`'s rounding basis** in the full **What / Why (structural) / Re-raise only if** shape: the banner's **42.6% / 46.2%** derive from the **rounded** percentages the sentence names; from raw counts they would be **42.4% / 46.4%**, a **0.2pp** difference. ⭐ **"More than two-fifths" is true either way and no claim flips.** **Qualified as:** a direct owner ruling. |
| 25 | **The re-raise condition was written to be the thing that actually matters** | ⛔ Not "never mention rounding again", and not a bare pointer. It settles **a future reviewer re-raising the 0.2pp alone**, and it re-opens **only if a claim FLIPS on the basis chosen** — a figure that lands on opposite sides of a threshold the record asserts. ⭐ **Judgment call resolved by naming the flip condition rather than the topic**, so the entry ends a wording loop without silencing a real defect. |
| 26 | **Limit 1 — `R1`'s "MISSED verdict byte-unchanged" recorded as verified BY CONTENT** | ⛔ **Recorded as the content-level verification it is, and the reason stated: the round-1 bytes were never committed, so no blob survives to diff against.** The check that exists is against the verdict's text (`⛔ SUCCESS CRITERION — **MISSED.**`, *"BY ANY READING"*, *"Every pairing misses"*, unhedged) and against round 1's own quotation in the ledger. ⭐ **A byte-for-byte claim would be false**, so it is not made. |
| 27 | **Limit 2 — the three-valued repo-wide broken-set figure recorded as under-specification, not regression** | All three values are named — round 1's **30/31**, the round-2 coder's **19**, the reviewer's **22** — with the cause (differing, individually-declared corpus rules) and ⛔ **no winner picked, because no banner claim depends on the absolute number.** ⭐ **What is recorded as load-bearing is the MOVEMENT claim all three agree on: the broken set is byte-identical before and after** (reviewer's sha256 `219e13…` over the sorted set). ⭐ **Written explicitly so a later reader does not mistake three numbers for a regression.** |
| 28 | **Shape call — the round-1 § "⚠️ Why this ledger is NOT closed out after a 9-for-9 round" was ANNOTATED, not rewritten or deleted** | ⭐ **Obvious-winner call, within the ruling's intent.** Leaving it bare would put a live *"NOT closed out"* claim in a `closed-out` ledger — ⚠️ **exactly `R5`'s failure mode, two mutually exclusive claims about the same thing in one frozen record.** Rewriting or deleting it would destroy the record of what round 1 knew. A dated **SUPERSEDED 2026-09-10** note was prepended instead, ⛔ **leaving the section's text byte-identical** — annotate, never rewrite (ruling Z6), the house pattern already used for the `P9` and `P13` rows and for the worklog's *"96 links"* bullet. |
| 29 | **No link added, so no count could move — and it was measured, not assumed** | ⛔ **The closeout write contains ZERO markdown inline-link instances** (`[label](target)`); every path in it is a bare code span. ⭐ **The guards were re-run anyway rather than assumed**, per the instruction — results in the residuals note below. |
| 30 | **Fixes applied without asking, and obvious-winner calls: recorded even though the answer is almost `none`** | ⛔ **Fixes applied without asking: `none`.** Both writes are direct owner dispositions; no finding was verified, classified or fixed this turn, and no row's verdict changed. ⭐ **Obvious-winner calls: exactly one — row 28's annotate-don't-rewrite shape.** ⛔ **`NEEDS-DECISION` reached: none.** Recorded explicitly because an empty log and a forgotten one are otherwise indistinguishable. |

## ⚠️ Round-2 closeout residuals, stated rather than hidden

- ⚠️ **`R1`'s "MISSED verdict byte-unchanged" will never be byte-verifiable.** The round-1 bytes were
  never committed. Content-level verification is the ceiling, and the ledger says so.
- ⚠️ **The repo-wide broken-set figure remains three numbers (30/31, 19, 22) under an under-specified
  corpus rule.** ⛔ **Deliberately left unresolved** — no banner claim depends on it, and picking a
  winner would assert a corpus rule nobody has ruled. The movement claim, which is the load-bearing
  one, holds under all three.
- ⚠️ **`coordination-citation-policy` is green and that green still says nothing about the archived
  board** — the guard's own output prints *"sprints/done and sprints/reviews not scanned"*. The
  round-2 reviewer checked that file by hand and found its one `path:NNN`-shaped string byte-identical
  at `HEAD` and pre-existing. ⛔ **Unchanged by this closeout, and re-flagged rather than inherited
  silently.**
- ⚠️ **`0360`'s own brief still reads `🔄 In progress` and its folder is still in
  `ai-agents/tasks/backlog/`.** That is the `dashboard.sh` drift row, intended by ruling Z2, and
  ⛔ **only the producer's close clears it** — a closed-out review ledger does not.
