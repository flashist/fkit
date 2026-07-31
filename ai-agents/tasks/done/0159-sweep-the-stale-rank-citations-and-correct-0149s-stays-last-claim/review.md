# Review — 0159-sweep-the-stale-rank-citations-and-correct-0149s-stays-last-claim

Task: `ai-agents/tasks/backlog/0159-sweep-the-stale-rank-citations-and-correct-0149s-stays-last-claim/brief.md`
File(s) under review: working tree — `ai-agents/sprints/sprint-2.md` + the `brief.md` of `0142`, `0152`,
`0154`, `0155`, `0156`, `0158`, `0159`, `0160`, `0163`, `0164`, `0166`, plus the new untracked
`0159/worklog.md`. **Out of scope, not reviewed:** the three modified `ai-agents/wiki-vault/` files
(another worker's, landed before this build) and the `🔄 In progress` status flips in `sprint-2.md:172`
and `0159/brief.md:13` (the driver's).
Status: closed-out

**Closed out at round 5, 2026-07-31, under the owner's close bar of 2026-07-31:** a ledger closes once
the **swept work product** is clean; residual low-severity defects in the task's **own record** are
recorded as accepted residuals rather than driving further rounds. **The swept work product is clean —
verified independently by both reviewers at round 5.** Two own-record residuals are recorded below.
Five rounds, twelve findings (R1–R12), all dispositioned by the owner. **Codex coverage: full in every
round.**

Round 1 — reviewers run: **fkit-reviewer (own pass)** + **Codex `codex exec --sandbox read-only`
(codex-cli 0.145.0)**. Codex coverage: **full**. Suite re-run independently by the reviewer:
`npm test` → exit 0, `prove-red.sh` hard gate PASSED.

Round 2 — same two reviewers, both re-run in full. Codex coverage: **full**. Suite re-run independently
by the reviewer: `npm test` → exit 0, **523 tests**, `prove-red.sh` hard gate PASSED.

Round 3 — same two reviewers, both re-run in full. Codex coverage: **full**. Suite re-run independently
by the reviewer: `npm test` → exit 0, **523 pass / 0 fail**, hard gate PASSED.
⚠️ **Baseline changed:** the repo was committed mid-review. Rounds 1–2 are committed, so `git diff`
alone shows only the latest round. **Commit counts depend entirely on which baseline you count from,
and both of these are correct under their own** (verified 2026-07-31: both are ancestors of `HEAD`
`e927a38`, no rebase):

| Baseline | Commits to `HEAD` | What it is |
|---|---|---|
| `2b4225b` | **6** | the whole review session |
| `7616585` | **1** | **this run only** — the second-newest commit |

**All invariants in this ledger are re-verified against `7616585`** — *this run's* baseline, not the
session's — against which the `sprint-2.md` accounting is still **14 added / 1 deleted**. An earlier
version of this note said *"exactly one commit"* while calling `7616585` the **session** baseline: the
number was right for the run and the label was wrong. A separately-reported *"five commits"* was also
wrong, from a different cause its author named — **the length of a `-5`-limited `git log` read as a
count**. Both errors are the same shape as this task's subject: a number stated without its coordinate
system. **No agent committed; the owner did.**

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | high   | `ai-agents/tasks/backlog/0160-decide-the-durable-citation-form-for-mutable-coordinates/brief.md:367` (+ `0159/brief.md:148-149`) | The A2 marker declares `0160`'s append-confirmation flag **"✅ Resolved"**, but the board records the opposite in terms: `sprint-2.md:601-603` — *"**0160** → **stays where it was appended.** … **Its append-confirmation flag stands, undischarged.**"* — and `sprint-2.md:623` — *"Its append-confirmation flag **stands**."* Consequently the deviation note's blanket claim that the plan's wording is *"true only for `0158`"* and the other six moved *"not by any owner ruling"* is **false for `0160`**: an owner ruling of 2026-07-27 (`sprint-2.md:579` addendum) expressly adjudicated `0160`'s placement and expressly left the flag standing. Raised by both reviewers. |
| R2 | 1 | medium | `0155/brief.md:140` · `0156/brief.md:153` · `0159/brief.md:330` · `0160/brief.md:367` · `0163/brief.md:157` · `0164/brief.md:167` | **"✅ Resolved" over-claims for all six.** The flag's own text is *"flagged for owner confirmation"*; no owner confirmation occurred for these six. What was reconciled is the stale **number**; the **request** is untouched, and each brief still carries its unanswered merit argument directly beneath. `0159`'s brief is self-contradictory on its face: *"✅ Resolved"* at `:330` alongside *"**The merit/append gap is nine slots**"* at `:346`. The marker silently retires six open owner questions. |
| R3 | 1 | medium | `ai-agents/sprints/sprint-2.md:1247` | Part B's correction is attributed to **"owner ruling, 2026-07-30"**. The brief's Part B spec (`0159/brief.md:214`) and **verification step 5** (`0159/brief.md:280-283`) both require naming *owner ruling, **2026-07-27***, and the board independently records that authority — `sprint-2.md:172` (*"owner-ruled 2026-07-27"*) and `sprint-2.md:619` (*"The repair is 0159's, by owner ruling"*, under the 2026-07-27 fourth re-rank at `:579`). **No 2026-07-30 ruling on the 0149 claim exists on the record** — that day's five rulings were Q1–Q5 (carve-out, sweep-by-rule, `0160`'s note, table rebuild). Worklog §6 row 5 reports step 5 **✅** while this half of it was unmet, and — unlike the A2 deviation — this deviation was **not flagged anywhere**. Raised by both reviewers. |
| R4 | 1 | medium | same six sites as R2 | The six markers introduce **fresh live-form rank prose** — *"the **live** board rank is **P138 / P139 / P140 / P141 / P142 / P143**"*. Present tense, undated in its own wording; each becomes a stale citation at the next re-rank, inside the very briefs just swept. The durable form was available and was used in A1 (site 4: *"this one (131)"* → *"this task"*) but not here. Self-inflicted regression of the swept class; low blast radius. Raised by Codex. |
| R5 | 1 | low    | `0159/brief.md:181` | Newly added line — *"The `:NNN` line-number citation defect generally — that is `0160`'s **(P141)**."* Correct today, but an undated live rank citation of another task in prose: precisely the A1 form the sweep removes elsewhere. **Not covered by the `:NNN` routing to `0160`** — this is a *rank* citation, not a line pointer. |
| R6 | 1 | low    | `0159/brief.md:335` | *"it is **P139** today"* — same class as R4, mitigated by the adjacent as-at framing (*"P136 on the filing date, 2026-07-27"*). Raised by Codex. |
| R7 | 1 | low    | `0159/worklog.md:108` (verification claim) → `ai-agents/tasks/backlog/0136-convert-skill-descriptions-to-block-scalars-and-guard/brief.md:6` | Verification step 7's claim *"every open brief's `## Priority` field still equals its board cell"* is **false**: `0136` is an open row at **P114** with **no `## Priority` heading at all** (`## Sprint` is followed directly by `## Status`). **Pre-existing and not in this change surface** — it is exactly the defect `0155` exists to fix, so this is **no regression** — but the verification claim as written is untrue. Raised by both reviewers. |
| R8 | 2 | medium | `0159/brief.md:300` (+ `worklog.md:71`, `:99`) | **Verification step 6 refreshes the stale rank instead of dropping it** — `0149 is `P134`` → ``0149 is `P137``. This is the one remedy the governing rule forbids in terms: *"A stale one is rewritten to **name the folder ID and drop the rank**; **updating it to today's number only reproduces the defect with a fresher date**"* (`ai-agents/knowledge-base/conventions/priority-is-rank-not-identity.md:43-44`). The build **recognised the class** — its own annotation calls the site *"itself an instance of the defect this task sweeps"* — and then applied the forbidden fix, logging it as a repair (`worklog.md:99`, `:71`). Aggravating: it is a **present-tense live rank sitting in an operative verification criterion**, so every re-run of step 6 must re-check a decaying number — the exact argument the producer itself used to justify correcting step 7's spec. The rank is **not load-bearing**: *"0149 did not move"* is proved by the before/after comparison, not by naming a value. **Raised by Codex only — the reviewer's own round-1 pass missed it.** |
| R9 | 2 | low    | `0159/brief.md:171-172` + `worklog.md:63` | **The summary sentence still calls the shape *"a dated resolution marker"* for all seven**, after R2 established that six of the seven are explicitly **not** resolved and now read *"owner confirmation is still outstanding … this flag is NOT discharged"*. Same over-claim R2 removed, surviving one layer up in the summary. Low blast radius — the seven markers themselves are unambiguous and sit adjacent — but the wording contradicts them. *"reconciliation marker"* is the accurate word. Raised by both reviewers. |
| R10 | 3 | low   | `0159/worklog.md:122` | **R8 is applied in three of four places — this one was missed.** The verification table row still reads *"`| 6 | 0149 did not move — **P137**, once in the table, brief byte-identical |`"* — a bare, undated, present-tense live rank, which is exactly what the owner ruled must be **dropped** under R8. It is **not** a quotation and **not** dated history: every other surviving `P134`/`P137` in the folder sits inside an explicit record-of-the-defect (`worklog.md:72`, `:103`, `:202`, `brief.md:307`) or the dated 2026-07-30 snapshot (`brief.md:97`), and each was checked. **No new owner decision is needed** — this is completion of the existing R8 ruling, and the producer's own standard already corrected the parallel worklog rows for R3, R7 and R8. The rank is not load-bearing: the before/after rank-sequence comparison proves non-movement. **Raised by Codex only — the reviewer's own round-3 enumeration scanned `brief.md` files and did not cover `worklog.md`.** |
| R11 | 4 | low | `0159/worklog.md:122` (+ `brief.md:304`, `worklog.md:202`, `:223`, `review.md:250-251` — all responder-owned) | **The replacement proof R10 installed points at a row whose *headline* does not carry it.** Row 6 now says non-movement is *"proved by row 7"*. Row 7's headline is *"`| P<n> |` sequence **identical**, 145 ranks"* — which **alone is insufficient**: two rows swapping folder IDs would leave that sequence identical. ⚠️ **Codex claimed row 7 contains *only* that clause. Read verbatim, that is wrong** — row 7 also asserts *"every open brief that **has** the field matches its cell"*, and since `0149/brief.md` is byte-identical carrying `## Priority: 137`, that clause **does** prove non-movement. **So the claim is true and a sufficient clause is present** — the defect is that it is buried in a `⚠️ Claim corrected` annotation while the headline a reader lands on is the insufficient one. Severity assigned **low**, below Codex's, on that basis. The strongest available proof — rank→ID→folder identical across all 145 rows — is what the reviewer verified independently and is what should be named. |
| R12 | 4 | low | `0159/worklog.md:223` | **A blind-swept numeral.** The R10 row says *"The other **four** surviving `P134`/`P137` are legitimate"* and then enumerates **five**: `worklog.md:72`, `:103`, `:202`, `brief.md:307` (records-of-the-defect) **and** `brief.md:97` (the dated snapshot). The count covers the first list only and omits the item the same sentence adds. Same class as R9 — a number that no longer matches what it counts, in the artifact whose subject is exactly that. Raised by Codex. |

### Round 5 — close-out. The swept work product is clean.

**R11 landed at all four sites** — `brief.md` step 6, `worklog.md` row 6, and the `worklog.md` R8/R10
record rows now lead with *"the rank→ID→folder mapping being identical across all 145 board rows before
and after — not by the `| P<n> |` sequence alone, which two rows swapping IDs would leave identical."*
Step 7's true clause is **kept** and labelled a second independent proof. ⚠️ The reviewer's literal
phrase-match returned **0** for two of the files because the wording differs slightly per site; the
sites were found by **positive enumeration** instead. Another zero that was not proof.
**R12 landed** — `four` → `five`, count and enumeration merged into one sentence; **0** occurrences of
*"other four surviving"*.

**THE CLOSE BAR — verified independently, and this is what the close rests on.**
*Method: emphasis/backtick stripping, newline collapse, every rank token enumerated independently of
adjacent task IDs, `:NNN` separated from `P<nnn>`, every hit classified positively.*
- **Ten swept briefs** (`0142 0152 0154 0155 0156 0158 0160 0163 0164 0166`): **79 rank tokens
  enumerated**, 4 candidates, **all 4 adjudicated as window artifacts or settled residuals** — the
  cited ranks are correct (`0136` P114, `0126` P109, `0143` P124, `0161` P131), and `0154`'s
  *"Placed at 127"* is the pre-existing dated-correction case already cleared.
- **All 23 open board rows: 0 stale candidates.**
- **`0159/brief.md`'s A2 marker** — the one swept site inside this task's own brief — correct: stale
  number reconciled, owner confirmation still outstanding, flag **NOT** discharged, **no live rank**.
- **Part B intact:** the three originals at `sprint-2.md:1058`, `:1111`, `:1245` byte-identical against
  the `7616585` baseline, corrections appended, attribution **2026-07-27** (count 1) and **0**
  occurrences of the retracted 2026-07-30.
- **All seven A2 markers correct** — `0158` alone a genuine resolution; `0160` **STANDS, UNDISCHARGED**.
- **Invariants vs `7616585`:** rank→ID identical · `| P<n> |` identical · only the excluded `0159`
  status delta · `sprint-2.md` **14 added / 1 deleted** · `0149/brief.md` byte-identical · tree is
  exactly the 3 task-folder files · nothing committed.
- **Suite:** `npm test` re-run by the reviewer — exit 0, **523 pass / 0 fail**, hard gate PASSED.

**Reviewer-section integrity — re-measured, and the earlier figure retracted.** The previously reported
*"0 deletions / 50 additions"* is **stale and must not be re-quoted**. Re-measured at round 5 with a
**heading-anchored** extraction: **116 → 194 non-empty lines, 0 HEAD lines removed, 78 new, 0 bearing a
responder signature.** The conclusion is unchanged and now rests on a proof that works: **the responder
did not touch this section.**

### Round 4 — R10 and the count change verified; two new low findings

- **R10 landed.** `worklog.md:122` names no live rank. **Independently re-verified that `:122` was the
  only live occurrence:** all 21 `P134`/`P137` tokens in the folder enumerated and classified — one
  dated snapshot (`brief.md:97`), the rest explicit records-of-the-defect, **zero live claims**.
- **Instance 6 recorded in both artifacts**, attributed to this pass and to the owner's ruling of
  2026-07-31, with the visibility-not-severity reasoning present in both. Mirrored into this section.
- **Count sweep — neither over- nor under-swept.** Every `five`/`six` token in both artifacts was
  enumerated and classified *by what it counts*. All correct. The deliberately-retained ones are right:
  *"five rulings (Q1–Q5)"*, *"the other six"* / *"five of six"* (the six briefs), *"six times over"*,
  *"the six tests touching `ai-agents/`"* (verified: 6 files). The tightening of instance 3 to **"five
  A2 markers"** is **correct and verified** — exactly five briefs (`0155`, `0156`, `0159`, `0163`,
  `0164`) carry *"owner confirmation is still outstanding"*; `0160` has distinct wording and `0158` is
  the genuine resolution. **The one numeral that is wrong is `worklog.md:223` — R12.**
- **Round 4 introduced no new live rank citation.** The `P141` additions are dated records of the
  2026-07-31 routing ruling.
- **Invariants vs `7616585`:** rank→ID identical · `| P<n> |` identical · only the excluded `0159`
  status delta · `sprint-2.md` **14 added / 1 deleted** · `0149/brief.md` byte-identical · R1–R9 intact.
- **Suite:** `npm test` re-run by the reviewer — exit 0, **523 pass / 0 fail**, hard gate PASSED.
- **Reviewer-section integrity — the retracted proof replaced.** The responder's byte-comparison of
  `review.md:26-208` against `HEAD` was correctly retracted as meaningless (the reviewer's round-3
  additions are themselves uncommitted, so the ranges do not correspond). **Replaced with a
  line-number-independent method:** extract the text between the `## Reviewer findings` and
  `## Coder response` markers from `HEAD` and from the working tree and diff the *content*. Result:
  **0 deletions and 0 modifications of pre-existing content; 50 additions, all the reviewer's own.**
  The responder did not touch this section. This method holds under arbitrary line shifts.

### Round 3 — R8 and R9 verified, and one gap

- **R8 — landed in 3 of 4 places.** `brief.md:303-311` now names **no rank**: *"`0149`'s board rank is
  **unchanged across this task's diff** — proved by the before/after rank-sequence comparison in step 7,
  not by naming a number"*, with a dated annotation recording that **both** the original `P134` **and**
  round 1's `P137` were *"wrong in kind"*, citing `priority-is-rank-not-identity.md:42-44`.
  `worklog.md:72` and `:103` no longer present the refresh as a repair — `:103` now reads *"This was the
  WRONG remedy and was reversed … Logging this as a 'repair' was itself a misreport."* **The cited proof
  actually holds:** step 7's second clause (open-brief `## Priority` == board cell) plus `0149/brief.md`
  being byte-identical (`## Priority: 137`, `git status` clean) does prove non-movement — checked, not
  assumed. **The gap is `worklog.md:122` — filed as R10.**
- **R9 — landed in full.** `brief.md:171-175` now reads *"append a dated **reconciliation** marker"* and
  adds *"**Only `0158`'s marker records a genuine resolution** … none of them discharges its flag."*
  The surviving *"resolution marker"* at `worklog.md:164` **is genuinely a quotation** — introduced by
  *"The append read"*, italicised, and called false in the same sentence. Correctly kept.
- **Round 3 introduced nothing new.** Every rank token in round-3 added lines is a record-of-the-defect,
  a dated annotation, or a ledger entry; the only new `:NNN` pointers are `priority-is-rank-not-identity.md:42-44`
  (a stable convention citation) and ledger coordinates inside the settled residual.
- **Invariants re-verified against the session baseline `7616585`:** 237 board rows parsed; rank→ID
  sequence **identical**; `| P<n> |` sequence **identical**; the only status delta is the excluded
  `0159` flip; no file moved; `sprint-2.md` still **14 added / 1 deleted** with that flip the sole
  deletion; R1–R7 all still intact post-commit, confirmed **positively** (not by zero-counts).
- **Suite:** `npm test` re-run by the reviewer — exit 0, **523 pass / 0 fail**, hard gate PASSED.

### ⚠️ The verification blind spot — now seven instances, and it bit the reviewer three times

A check that *looks* clean while being structurally unable to see the thing it checks. Recorded because
**two of the seven (2 and 5) were caught only by the other reviewer**, and every one of the rest was
caught only because someone **refused to accept a zero as an answer**:

1. The sweep missed a citation **split across a line wrap** (`0152/brief.md:132-133`) — invisible to
   every single-line grep; found only by adding a wrap-aware family.
2. **R8 sat inside a verification criterion, not a cross-reference** — a scan keyed on *"task ID near a
   rank number"* structurally cannot reach it. Missed by both reviewers in round 1.
3. The producer's own post-commit check was **wrap-blind and returned 0**, nearly reporting that the
   commit had lost every fix — *a false negative that looked exactly like a clean pass.*
4. The reviewer's `grep "reconciliation marker"` returned **0** on the brief because markdown bold
   splits the phrase (`**reconciliation** marker`). Caught only by refusing to accept the zero.
5. The reviewer's round-3 enumeration covered `brief.md` files and **not `worklog.md`** — which is
   exactly where **R10** was. Found by Codex, not by the reviewer.
6. **The same failure running the other way.** The responder's first R10 classifier produced **138
   false-positive "stale citations"** by reading `:NNN` **line numbers** as ranks — noise, not silence.
   Surfaced by this pass; **included on the owner's ruling, 2026-07-31.** ⚠️ **Why it belongs with 1–5:**
   the two directions are **one class**, and **the symmetry is the evidence** — a checker that silently
   **under-reports** and one that **floods with noise** are the same detection problem. **The asymmetry
   is in visibility, not severity:** a false negative reads as a clean pass, a false positive announces
   itself. Only instances 1–5 were ever going to be found by someone noticing something missing.

7. **The reviewer's own section-integrity measurement, round 5.** It extracted *"`## Reviewer findings`
   → `## Coder response`"* by first-occurrence, and **truncated at the reviewer's own mention of the
   marker string** inside the round-4 text — reporting **104 lines apparently deleted** from a section
   nothing had touched. **A false alarm, not a false pass** — the same noise direction as instance 6,
   and it corroborates that reasoning firsthand. Fixed by anchoring on a line that *starts* the
   heading. ⚠️ The responder's independent measurement hit the **same trap** and reached the right
   conclusion by a different route (an authorship-signature search).

**Method that survives all seven, used for this round's negative proof:** strip markdown emphasis and
backticks, collapse newlines, enumerate **every** rank-shaped token *independently of any adjacent task
ID*, then **classify each hit positively** — dated record / quotation-of-the-defect / verified-correct
preserved text / settled carve-out / live defect. **Never report a zero as proof.** This round that
enumeration returned **205 tokens across 33 open briefs**, of which 10 were candidates and all 10 were
adjudicated: nine are window artifacts where the cited rank is correct, and `0154/brief.md:139`'s
*"Placed at **127**"* is cleared by a **pre-existing dated correction two lines below** (*"The rank is
`128`, not `127`"* — `0154` is live P128), in a region this task never touched.

### Round 2 — the seven round-1 fixes, verified landed

Every fix checked at its site by **both** reviewers independently, against the board text rather than
the brief's summary of it.

- **R1 ✅** — `0160/brief.md:369-376` now reads *"this flag itself STANDS, UNDISCHARGED … the sprint
  plan's fourth re-rank of 2026-07-27 ruled that `0160` stays where it was appended, and in the same
  breath expressly left this append-confirmation flag standing, undischarged."* Matches
  `sprint-2.md:594-603` and `:623` in substance; neither over- nor under-stated. The blanket claim is
  corrected in the deviation note at `0159/brief.md:163-166` and narrowed at `:147-151` to *"resolved by
  an owner ruling **to a named rank**"* — which **is** true of `0158` alone.
- **R2 ✅** — `✅ Resolved` is gone from all six; `0158:190` correctly retains it (genuine ruling).
  Surviving occurrences are only in this ledger, the worklog, and the deviation note quoting the removed
  wording. `0159`'s `:330`/`:346` self-contradiction is resolved — its marker now names the nine-slot gap
  as still awaiting a ruling.
- **R3 ✅** — `sprint-2.md:1247` reads *"owner ruling, **2026-07-27**"*; **0** occurrences of
  `2026-07-30` remain. The worklog's step-5 row now records the failed check instead of reporting green.
- **R4 ✅** — *"the live board rank is P<N>"* removed from all six; they now point at each brief's own
  `## Priority` field and board row — the durable form. **0** live-rank numbers in the six markers.
- **R5 ✅** — `0159/brief.md:197` now reads *"that is `0160`'s."* Rank dropped, folder ID kept.
- **R6 ✅** — *"it is P139 today"* → **0** hits. `P136` survives labelled dated 2026-07-27 arithmetic.
- **R7 ✅** — narrowed to *"every open brief that **has** a `## Priority` field"* in **both** the worklog
  and the brief's verification spec. `0136` untouched.

**Both autonomous calls judged IN BOUNDS.** (a) Correcting `0160`'s separate Q4 append, which repeated
`P141` and called the marker a *"resolution"* — that text was written by this same build and carried the
identical defects R2/R4 ordered removed, so fixing it applies the ruling rather than widening scope; the
protected dated **2026-07-29** observation is **byte-identical to `HEAD`**, verified by direct diff.
(b) Correcting R7's untrue claim in the brief's **verification spec** as well as the worklog — the
reviewer had cited only the worklog, but the brief carries the claim as a *specification*, so leaving it
would compel the same false report on every re-run. Correct reading of the finding's intent.

**Invariants re-verified after the fixes** (reviewer's own mechanical pass over all 237 board table
rows): rank→ID sequence **identical** before/after · `| P<n> |` sequence **identical** · only status
delta is the excluded `0159` flip · no file moved · `sprint-2.md` diff still **14 added / 1 deleted**,
the single deletion being that flip · the three original *"it stays last"* claims at `sprint-2.md:1058`,
`:1111`, `:1245` all still present and byte-identical against `HEAD` · dashboard `⟦FACTS⟧`
`117 done · 1 in progress · 22 backlog · 5 cancelled — of 145`.

**The negative re-proved independently.** Wrap-aware plus broad-form scan over every open brief and all
23 open board rows: the only cross-references that differ from the live board are the **two documented
carve-outs** — `0160:35` (`` `0150 (124)` `` as the convention's *notation example*, in backticks) and
`0165:105` (a verbatim quotation of an emitted `priority 125`, annotated against live `P132` in the same
row). Zero uncatalogued stale live cross-references. **R8 is the one fresh operative instance**, and it
sits inside `0159`'s own verification steps rather than in a cross-reference, which is why a
cross-reference scan does not surface it.

**Judged and NOT filed:** `0159/brief.md:307`'s `` `0136` is an open row (`P114`) `` — a rank written by
the round-2 fix. It sits inside an explicitly dated *(Corrected 2026-07-30 at review round 1: …)*
annotation, i.e. a dated record, not an operative criterion — the same distinction the owner drew in the
R6 ruling (dated as-at value acceptable, bare live claim not). **No action.** Recorded so it is not
re-raised as a discovery next round.

### Verified TRUE — claims tested hardest and confirmed (recorded so they are not re-tested)

- **"19 sites / 20 stale numbers / 12 files"** — arithmetic confirmed independently. A1 = 12 sites / 13
  numbers / 6 files; A2 = 7 sites / 7 files; union = 11 briefs + `sprint-2.md` = **12 files**.
- **The wrap-split site is real.** `git show HEAD:0152/brief.md` lines 132-133 read `Task **0154** (rank`
  / `127, …`. Two of three single-line grep families return **0** matches. Genuine find that every
  earlier pass *and* the approved plan missed.
- **"Nothing correct was corrected."** Every `0136 (P114)` / `0136 at P114` is byte-identical
  before/after in `sprint-2.md`, `0152`, `0154`, `0156`. (`0159`'s own count rises 3→4 — quotations
  inside the rebuilt table, by design.)
- **"No rank changed, no status changed, no file moved."** Mechanical parse of all **237** board table
  rows before and after: rank→ID sequence **identical**; `| P<n> |` sequence **identical**; the only
  status delta is the driver's `P140` flip; no renames in `git status`.
- **Sprint diff accounting.** `14 added / 1 deleted`; the single deletion **is** the driver's status
  flip. The worker's own edits are **13 added lines across 3 addition sites, 0 deletions** — no re-rank
  table cell altered, no blockquote interior touched.
- **Carve-out honoured.** `0147`, `0150`, `0151`, `0157`, `0161` absent from the change surface;
  `0149`'s brief byte-identical.
- **Part B sites.** All three original *"it stays last"* claims intact at `sprint-2.md:1058`, `:1111`,
  `:1245`; the `:1058` site correctly re-dated to **2026-07-27**. The pointer anchor *"the 2026-07-26
  out-of-band addendum for 0147–0149"* resolves **uniquely** to the heading at `sprint-2.md:1219` — a
  rank-free, line-number-free, durable anchor. Correct form.
- **Self-caught error corrected correctly.** `0156` is **P139**; `P136` is `0152`.
- **The negative holds.** An independent wrap-aware scan plus a broad citation-form sweep over every
  open brief and all **23** open board rows found **no uncatalogued stale live cross-reference**.
  `0162`'s `0141 (P118)` checked and correct.
- **Declared residuals were right to leave.** `0133:37` — `0124` **is** P107, rank correct, status stale
  (different class). `sprint-2.md:1245` *"soft-follows 0143 (priority 121)"* — `0143` is P124, but the
  text sits **inside a dated re-rank table cell**, which the brief's carve-out excludes. `0162:155` —
  **exactly seven** open rows sit above P127 today (P113, P114, P119, P120, P121, P122, P124); P109,
  P118, P123 have closed. All three confirmed.
- **`0158` was genuinely owner-ruled to P122 on 2026-07-27** — `sprint-2.md:811` heading + `:853` cell.
- **Nothing in `test/` reads brief or board rank prose.** The six tests touching `ai-agents/` read
  structure (IDs, layout, `## Status`/`## Owner`), not citations. The worker's honesty clause is
  accurate; the class is **not** closed.

### On the deviation from approved plan text — the reviewer's independent judgment

**(a) Was the factual claim true?** `0158` owner-ruled to P122 on 2026-07-27: **TRUE**. The other six
moved by displacement: **true for five, materially incomplete for `0160`** — see R1.

**(b) Was the substituted wording accurate?** Accurate as to *how the number moved* for five of six;
**over-claims "Resolved" for all six** (R2); **contradicts the board for `0160`** (R1); and
**re-introduces a live rank number** in all six (R4).

**(c) Was deviating from approved plan text the right call?** **Yes — and it should not have returned
`NEEDS-DECISION`.** Writing *"owner ruled to N"* onto six briefs would have fabricated six rulings;
`conventions/evidence-before-assertion.md` binds every role and outranks a plan's prose, and *narrowing*
an assertion to what the evidence supports needs no fresh permission. The worker also recorded the
deviation visibly in the artifact, in the worklog, and to the driver — the correct handling shape.
**The judgment was right; the replacement wording is where it fell short.** Note the symmetry that
makes R3 sting: having refused to write an owner ruling that did not exist, the same build then wrote
`owner ruling, 2026-07-30` at `sprint-2.md:1247`, which no record supports.

### Re-litigates settled decisions (suppressed — recorded, not dropped)

- **New `:NNN` line pointers in the rebuilt findings table and the worklog** (Codex finding 5, medium).
  The `:NNN` mutable-coordinate class is routed to task `0160` by this brief (`0159/brief.md:181`), and
  owner ruling **Q5 (2026-07-30)** directed the findings table be *rebuilt in place* — which
  necessarily re-records site coordinates. No durable alternative form exists yet; deciding it **is**
  `0160`'s deliverable. **Suppressed.** Re-raise only if `0160` rules and this table is not migrated.
  ⚠️ **Not suppressed:** `0159/brief.md:181`'s `(P141)` — that is a *rank* citation, outside this
  routing. Filed as **R5**.
- **"Nothing enforces brief or board prose."** Declared honestly by the worker; a guard is explicitly
  forbidden in this task and owned by `0152`/`0154`. Not re-raised.

## Coder response

<!-- CODER-OWNED — the reviewer does not write this section. -->

**Responder: spawned `fkit-producer`, round 1, 2026-07-30.** `0159` is producer-owned
(`## Owner: fkit-producer`) and edits only briefs and the sprint board.
⚠️ **`/fkit-process-stateful-review` was NOT invoked** — it is coder-owned
(`claude/skills-for-role.sh:52`), so **its method was applied by hand**: every finding verified
firsthand at its cited site, classified, responded to here, and the dispositioned fix applied.

**All seven findings verified independently. All seven confirmed TRUE — none incorrect, none partially
correct.** Coordinates re-derived at the moment of writing rather than trusted.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CONFIRMED** — `sprint-2.md:601-603` and `:623` read verbatim; the board does say the flag **stands, undischarged**, and the 2026-07-27 fourth re-rank (`:579`) did adjudicate `0160`'s placement | **Defect** | `0160`'s flag **restored as undischarged**; its marker now records that the owner ruled it *stays where it was appended* and expressly left the flag standing. The brief's blanket *"not by any owner ruling"* claim — false for `0160` — corrected in the deviation note and in the worklog | ✅ fixed |
| R2 | **CONFIRMED** — no owner confirmed any of the six; only the stale **number** was reconciled. The `0159` self-contradiction against *"the merit/append gap is nine slots"* is real | **Defect** | All six reworded to **"stale number reconciled — owner confirmation still outstanding … this flag is NOT discharged"**; each merit argument explicitly noted as still awaiting a ruling. `0158` untouched — its resolution is genuine | ✅ fixed |
| R3 | **CONFIRMED** — `2026-07-30` present at `sprint-2.md:1247`. Authority re-derived: brief Part B spec, verification step 5, `sprint-2.md:172` and `:619` all name **2026-07-27**; **no 2026-07-30 ruling on the 0149 claim exists on the record** | **Defect** — and the sharpest of the round: a green ✅ was reported over an unmet check | Attribution corrected to **2026-07-27**. Worklog row 5 corrected too — a green check over a corrected defect is its own defect | ✅ fixed |
| R4 | **CONFIRMED** — all six carried present-tense *"the live board rank is P&lt;N&gt;"*, a fresh instance of the swept class inside the briefs just swept | **Defect** (self-inflicted regression) | Live-rank numbers **removed**; the six now point at each brief's own `## Priority` field and board row — the durable form used in A1. `0160`'s Q4 append, which repeated `P141`, corrected the same way | ✅ fixed |
| R5 | **CONFIRMED** at `0159/brief.md:181` — a *rank* citation, correctly distinguished from the `:NNN` routing | **Defect** | Rank dropped, folder ID kept: *"that is `0160`'s."* | ✅ fixed |
| R6 | **CONFIRMED as written in this ledger** — `0159/brief.md` *"it is **P139** today"*, which the reviewer classes as **the same class as R4**, mitigated by adjacent as-at framing | **Defect** (low) | ⚠️ The disposition first relayed for "R6" described *the rebuilt findings table's `:NNN` line pointers* — the **suppressed Codex finding 5** below, not this finding — so it was **returned unactioned** rather than decided unilaterally. **The owner then ruled on the real R6 (2026-07-30): remove the live rank, keep the as-at value.** Applied: *"it is P139 today"* dropped; *"P136 **on the filing date, 2026-07-27**"* kept and re-framed as **dated arithmetic, not a live citation**, pointing readers at `0156`'s board row for its rank today | ✅ fixed **on owner ruling** |
| R7 | **CONFIRMED** — `0136` verified as the **only** open brief with no `## Priority` heading; it is an open `P114` row | **Defect** in the claim, **not** a regression | The untrue claim narrowed to *"every open brief that **has** the field"* in **both** places it appears — this worklog's row 7 and the brief's verification step 7. **`0136` deliberately NOT touched** — backfilling it is `0155`'s deliverable, out of scope here | ✅ fixed |
| R8 | **CONFIRMED** — `priority-is-rank-not-identity.md:42-44` read verbatim; it requires a stale citation be rewritten to *"name the folder ID and drop the rank"* because *"updating it to today's number only reproduces the defect with a fresher date."* Round 1 **named the class correctly at that very site** and applied the forbidden remedy anyway. Aggravated: it sits inside an **operative verification criterion** | **Defect** (medium) | **Applied on owner ruling (2026-07-30), not autonomously.** Rank **dropped**, not refreshed — step 6 now proves *"0149 did not move"* from step 7's before/after rank-sequence comparison. `worklog.md:71` and `:99`, which logged the forbidden refresh **as a repair**, corrected to record it as the wrong remedy, reversed | ✅ fixed **on owner ruling** |
| R10 | **CONFIRMED** — `worklog.md:122` still carried a bare, undated, present-tense `**P137**` in verification row 6: **R8 landed in three of four places.** Independently re-verified that `:122` is the **only** live one — `worklog.md:72`, `:103`, `:202` and `brief.md:307` are explicit records-of-the-defect, `brief.md:97` is the dated snapshot | **Defect** (low) — completes R8 | **Applied on owner ruling (2026-07-31), not autonomously**; ruled to fall under the existing R8 ruling. Rank **dropped**; row 6 now proves non-movement from the rank-sequence comparison in row 7, matching R8's replacement proof | ✅ fixed **on owner ruling** |
| R11 | **CONFIRMED, with the reviewer's downgrade upheld** — row 7's headline (`\| P<n> \|` sequence identical) **is** insufficient alone, since two rows swapping folder IDs leave it identical. But **Codex overstated it**: row 7 also asserts *"every open brief that has the field matches its cell"*, which with `0149/brief.md` byte-identical (`## Priority: 137`) **does** prove non-movement. The claim was **true** and a sufficient clause was **already present**; the defect is placement — the weak headline is what a reader lands on | **Defect** (low) | **Applied on owner ruling (2026-07-31), not autonomously.** The sufficient proof — **rank→ID→folder mapping identical across all 145 rows** — is now named up front at all four sites (`brief.md` step 6, `worklog.md` row 6, and the R8/R10 record rows). **The existing true clause was NOT removed**; it is kept and labelled a second, independent proof | ✅ fixed **on owner ruling** |
| R12 | **CONFIRMED** — the R10 record row said *"the other **four** surviving"* then enumerated **five** (`worklog.md:72`, `:103`, `:202`, `brief.md:307`, plus `brief.md:97`). The count covered the first list and omitted the item the same sentence adds. Same class as R9 | **Defect** (low) | **Applied on owner ruling (2026-07-31), not autonomously.** **four → five**, with count and enumeration merged into one sentence so they cannot disagree again | ✅ fixed **on owner ruling** |
| R9 | **CONFIRMED** at `brief.md:172` and `worklog.md:63` — both still called the shape a *"dated **resolution** marker"* for all seven after R2 established six are not resolved | **Defect** (low) — the R2 over-claim surviving one layer up | **Applied on owner ruling (2026-07-30), not autonomously.** Reworded to *"dated **reconciliation** marker"*, naming `0158` as the only genuine resolution and the other six as *stale number reconciled, owner confirmation still outstanding, flag undischarged* | ✅ fixed **on owner ruling** |

### Re-verified after the fixes

- **Wrap-aware negative proof.** A wrap-tolerant cross-reference scan (the single-line families cannot
  see `0152:132-133`) over every open brief: **19 hits, every one a quotation-of-the-defect inside
  `0159`'s own findings/carve-out tables, or a carved-out site.** `0165:105` checked specifically — it
  quotes an emitted `priority 125` and **correctly annotates it against the live `P132`**. Zero
  uncatalogued stale live cross-references.
- **A2 flags:** all **7** carry a reconciliation marker; **0** unmarked mismatches.
- **R2/R4 residual forms:** **0** occurrences of `✅ Resolved` or *"live board rank is"* outside the
  deviation note that quotes the removed wording as the record of what was changed.
- **`npm test`** (not `node --test test/`): **523 pass / 0 fail**, 17 suites; `prove-red.sh` hard gate
  **PASSED**, all 7 mutations red their named assertion.
- **Board untouched:** `dashboard.sh` `⟦FACTS⟧` **byte-identical**; `| P<n> |` sequence **identical at
  145 ranks**; `sprint-2.md` diff still **14 added / 1 deleted** (the deletion remains the driver's
  status flip); no `>` interior and no re-rank table cell altered.
- **Change surface unchanged** — the same 12 files plus this task folder's `review.md` / `worklog.md`.
  No file added, moved or removed; `0147`, `0150`, `0151`, `0157`, `0161`, `0149` all untouched;
  `ai-agents/wiki-vault/` neither read nor written; nothing committed or pushed.

### ⚠️ Ledger-integrity note — the R6 mismatch

The dispositions relayed into round 2 described **R6** as *"the rebuilt findings table's new `:NNN` line
pointers … accepted, do not remove"*. **That is not R6.** It is **Codex finding 5**, recorded in
*Re-litigates settled decisions* below and **already suppressed by the reviewer** — it was never a
numbered finding awaiting disposition. The **R6 in this ledger** is a live-rank citation of the same
class the owner ruled **must be removed** under R4. The owner's "accept R6" was given against a
description of a different item, so it is **not** a ruling on this finding. Left untouched pending the
owner's actual call. Recording it here so the next round does not read the acceptance as settled.

## Accepted residuals (shared, do-not-re-litigate)

Ruled by the owner via `AskUserQuestion` in the live driver session, **2026-07-30**:

- **The build's deviation from the approved plan's A2 wording was RATIFIED.** Refusing to write
  *"owner ruled to N"* onto six flags where no ruling existed was correct — `evidence-before-assertion`
  outranks a plan's prose, and *narrowing* an assertion to what the evidence supports needs no fresh
  permission. **Do not revert to the plan's wording.** Only the substituted wording was wrong (R1/R2/R4).
- **The `:NNN` line pointers in the rebuilt findings table and worklog stay** (Codex finding 5, already
  suppressed). Ruling Q5 required the table be *rebuilt in place*, which necessarily re-records
  coordinates; no durable form exists yet and deciding one **is** `0160`'s deliverable. Re-raise only if
  `0160` rules and this table is not migrated.
- **`0136` is NOT given a `## Priority` heading here** — that is `0155`'s deliverable (it exists to
  backfill all six briefs missing the field). R7 corrects the untrue **claim** only.
- **Closed briefs and rows stay unswept** (Q1): `0147`, `0150`, `0151`, `0157`, `0161` untouched; the
  closed-artifact class routed to `0160`. Cost accepted knowingly: a reader of a closed brief still
  meets a stale number.
- **`0160`'s dated 2026-07-29 non-edit note stays** (Q4) — only its flag was fixed.
- **The 20 wiki-vault task pages carrying `priority NNN` are frozen record**, out of scope entirely.

**R6 — ruled 2026-07-30, after the mismatch was caught.** Remove the live rank, keep the as-at value.
The owner's reasoning: it is the same defect already ordered removed six times over, in the same brief,
on reasoning that applies unchanged; the reviewer's *"adjacent as-at framing"* mitigation covers the
`P136` half (correctly kept as dated arithmetic) but **not** the bare present-tense `P139` half.
**Applied.** No finding in this round remains open.

**Round 2 — R8 and R9 ruled 2026-07-30, both applied on the owner's ruling, neither decided
autonomously.** R8: drop the rank entirely from verification step 6 — the rank was never load-bearing,
and *"did not move"* is proved by the before/after comparison. R9: reword *"resolution marker"* to
*"reconciliation marker"*, since it must not assert resolution for the six.

**Judged and NOT filed at round 2 — recorded so it is not re-discovered.** `0159`'s `` `0136` is an open
row (`P114`) ``, a rank written by the round-2 R7 fix, sits inside an explicitly dated
*(Corrected 2026-07-30 …)* annotation — a **dated record, not an operative criterion**. Both reviewers
reached that independently; it is the distinction the owner drew in the R6 ruling. **No action.**

**Round 3 — R10 ruled 2026-07-31, applied on the owner's ruling, not autonomously.** Ruled to fall under
the existing **R8** ruling rather than to need a new decision: drop the rank, keep the rank-sequence
proof. R8 had landed in three of four places; `worklog.md:122` was the fourth.

### ⚠️ The close bar — new standing ruling, owner, 2026-07-31

The reviewer raised this and **explicitly declined to set it**; the **owner ruled it**:

> **A ledger closes once the SWEPT WORK PRODUCT is clean.** Residual defects in the task's **own record**
> — brief, worklog, ledger bookkeeping — are recorded as **accepted residuals** rather than driving
> further review rounds.

**Evidence behind it:** the 12 swept files passed R1–R7 and held through three subsequent independent
verifications. **Every finding from R8 onward has been in `0159`'s own record, not the sweep.** Severity
decayed medium → low → low.

**⚠️ The cost, accepted and not hidden:** a closing task's own worklog may carry **known low-severity
defects**. This run is the evidence — Codex kept finding real ones (R8, R10, R11, R12) in exactly that
surface, and under this bar they no longer block a close. **This changes what "closed-out" means here:**
`0159` is closed to a *work-product* standard, not a *record-perfect* one.

### ⚠️ Method gap — RESIDUAL, routed as evidence to `0160` (P141) by owner ruling, 2026-07-31

**Ruling: the evidence goes to `0160` as input to its *existing* enforcement-feasibility question. Do
NOT widen `0160`'s scope, do NOT add it as a new case, and do NOT file a task.** `0160`'s brief already
asks whether a conformance guard is possible even in principle; this is direct evidence that **naive
grep-based checking yields false negatives**. `0160` may name a follow-up if it rules a guard is wanted.

**Six instances in one day, two of them the reviewer's own** *(count raised from five to six by owner
ruling, 2026-07-31 — instance 6 added)*:

1. The original sweep missed `0152:132-133` — citation **split across a line wrap**.
2. **R8** sat inside a *verification criterion*, which a cross-reference scan over citation prose cannot
   structurally reach.
3. The responder's own **commit-verification grep returned 0** for all five A2 markers, because *"owner
   confirmation is still outstanding"* wraps across a newline — a false negative that nearly caused a
   correct commit to be reported as missing its fixes.
4. The reviewer's `grep "reconciliation marker"` returned **0** because markdown bold splits the phrase
   (`**reconciliation** marker`).
5. The reviewer's round-3 enumeration covered `brief.md` but **not `worklog.md`** — exactly where **R10**
   was hiding.
6. **The same problem running the other way.** The responder's first R10 classifier produced **138
   false-positive "stale citations"** by reading `:NNN` **line numbers** as ranks — noise, not silence.

**⚠️ Why 6 belongs with 1–5 — the owner's reasoning, and the reason it was included.** The two
directions are **one class**, and **the symmetry is itself the evidence** for `0160`'s
enforcement-feasibility question: a checker that silently **under-reports** and a checker that **floods
with noise** are the same detection problem, and **only one of them is visible**. A false negative reads
as a clean pass; a false positive at least announces itself. That asymmetry in *visibility*, not in
*severity*, is what makes naive grep-based conformance checking unsafe to rely on.

**⚠️ The reviewer's counter-argument, recorded because the owner was shown it and `0160` may need it:**
this is arguably **not** `0160`'s class. `0160` owns *what a citation should look like*; this is *how you
reliably detect one in markdown*. **Even a perfect citation form would not fix a wrap-blind checker.**
Recorded as a live disagreement, not a settled routing.

**Provenance of the R6 mismatch, for the record:** the driver has confirmed the mis-mapping was **its
own**, not the reviewer's — the owner-question named *"R4/R5/R6"* without saying what R6 was, and the
driver filled it in from context instead of reading this ledger. Logged as the driver's 17th relayed
error this sprint. Recorded here because the correction only worked by re-deriving from the ledger
rather than trusting the relay.

---

## Accepted residuals added at close-out (round 5, 2026-07-31)

Both fall on the **task's own record** side of the owner's close bar of 2026-07-31, and are recorded
rather than fixed. **Neither touches the swept work product.**

- **The R8 and R10 dispositions still describe the fix by its weak proof.** *What:* the *Coder response*
  rows for R8 and R10 say non-movement is proved *"from step 7's before/after rank-sequence comparison"*
  / *"from the rank-sequence comparison in row 7"* — the insufficient headline that **R11 corrected
  everywhere else**. *Why (structural):* these are **stale descriptions of the fix, not the fix**. Every
  operative artifact — `brief.md` step 6, `worklog.md` row 6, and the `worklog.md` R8/R10 rows — names
  the sufficient rank→ID→folder proof, verified at round 5. The rows sit in the **coder-owned** section,
  which the reviewer may not edit, and no verification criterion is wrong. Raised by Codex; classified
  by the reviewer as own-record. ⚠️ **It also disproves the claim relayed into round 5 that the only
  weak-proof reference left in `review.md` was the reviewer's own R11 quotation — there are two more, in
  the responder's own section.** *Re-raise only if:* a re-verification is ever driven from these
  disposition rows rather than from the artifacts, or the weak proof reappears in `brief.md` or
  `worklog.md`.

- **Instance 7 of the verification blind spot, and the retracted section-integrity figure.** *What:* the
  reviewer's own section-integrity check truncated at its own mention of the `## Coder response` marker
  and reported **104 lines apparently deleted** from an untouched section; the earlier
  *"0 deletions / 50 additions"* figure is **stale and must not be re-quoted**. *Why (structural):* both
  are measurement defects, not artifact defects — re-measured heading-anchored at round 5 as
  **0 removed / 78 new / 0 responder signatures**, and the conclusion (the responder did not touch the
  reviewer's section) is unchanged. Recorded because it is **firsthand corroboration of instance 6's
  reasoning**: this one failed in the *noise* direction and was therefore visible, where instances 1–5
  failed silently. *Re-raise only if:* a future round quotes either retracted figure, or the
  section-integrity claim is restated without re-measuring.

**Standing recommendation carried out of this ledger, not settled here:** the close bar itself
(work-product clean, own-record residuals recorded) currently lives **only in this ledger**. The next
multi-round review will re-derive it from scratch. The driver is separately putting to the owner whether
it belongs in `fkit-sprint-ship-loop`'s SKILL or an ADR — **the reviewer's recommendation is an ADR**,
because it is a cross-role decision about when review ends, not a step in one skill's procedure.
