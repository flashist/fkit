# Review — 0159-sweep-the-stale-rank-citations-and-correct-0149s-stays-last-claim

Task: `ai-agents/tasks/backlog/0159-sweep-the-stale-rank-citations-and-correct-0149s-stays-last-claim/brief.md`
File(s) under review: working tree — `ai-agents/sprints/sprint-2.md` + the `brief.md` of `0142`, `0152`,
`0154`, `0155`, `0156`, `0158`, `0159`, `0160`, `0163`, `0164`, `0166`, plus the new untracked
`0159/worklog.md`. **Out of scope, not reviewed:** the three modified `ai-agents/wiki-vault/` files
(another worker's, landed before this build) and the `🔄 In progress` status flips in `sprint-2.md:172`
and `0159/brief.md:13` (the driver's).
Status: in-review

Round 1 — reviewers run: **fkit-reviewer (own pass)** + **Codex `codex exec --sandbox read-only`
(codex-cli 0.145.0)**. Codex coverage: **full**. Suite re-run independently by the reviewer:
`npm test` → exit 0, `prove-red.sh` hard gate PASSED.

Round 2 — same two reviewers, both re-run in full. Codex coverage: **full**. Suite re-run independently
by the reviewer: `npm test` → exit 0, **523 tests**, `prove-red.sh` hard gate PASSED.

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

**Provenance of the mismatch, for the record:** the driver has confirmed the mis-mapping was **its
own**, not the reviewer's — the owner-question named *"R4/R5/R6"* without saying what R6 was, and the
driver filled it in from context instead of reading this ledger. Logged as the driver's 17th relayed
error this sprint. Recorded here because the correction only worked by re-deriving from the ledger
rather than trusting the relay.
