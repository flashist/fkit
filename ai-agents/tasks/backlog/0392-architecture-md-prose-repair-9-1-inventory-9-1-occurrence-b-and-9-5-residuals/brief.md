# `architecture.md` prose repair — §9.1's inventory, §9.1's occurrence B, and §9.5's residuals

## ID
0392

## Sprint
Sprint 9

## Priority
P1

## Status
🔲 Backlog

## Owner
fkit-architect

> ⚠️ **THE OWNER FIELD IS A PRODUCER JUDGEMENT AND IS FLAGGED FOR THE OWNER — the three originals did
> not agree.** `0251` and `0376` were `fkit-coder`; `0366` was `fkit-architect`.
> [ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
> Decision 1 fixes the build role **by the deliverable**, and this row's deliverable is prose in a
> knowledge-base reference document plus two judgement calls about what a section should say —
> architect-shaped. ⚠️ **Group A is the exception**: re-deriving a suite count from `ls test/*.test.js`
> is mechanical and coder-shaped. ⛔ **This is not settled.** If the owner wants the mechanical half run
> by `fkit-coder`, that is a further split of this row, not a re-scoping of it.

## Context

### ⭐⭐ SPLIT 2026-09-13 — THIS ROW WAS NARROWED. READ THIS FIRST.

**Owner ruling 2026-09-13, given live via `AskUserQuestion` in an `fkit lead` session with the owner
present — the option label is the verbatim text: "Split A–C from D–E (Rec)".**

⭐ **This row previously carried five groups (A–E) consolidated from five cancelled originals. The two
citation sweeps — Groups D and E — moved out to
[`0393`](../0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md)
on that ruling.** This row keeps **Groups A, B and C** — the genuine `architecture.md` prose repair —
plus open decisions **OD1** and **OD2**.

⛔ **Nothing was dropped by the split.** Every original's scope is traceable across the two rows; see
the provenance map in `## Notes` here and its mirror on `0393`.

⛔ **The five cancelled originals are NOT resurrected.** `0251`, `0376`, `0366`, `0286` and `0323`
remain properly cancelled and frozen. Both rows cite them as **provenance only**.

⚠️ **The split was authorised, not invented.** This brief's own `## Notes` had already flagged the
boundary — *"The natural split, if one is wanted, is Groups A–C (one file, prose) from Groups D–E
(citations, repo-wide) — one edit, no renumbering. Flagged, not decided."* The owner decided it.

⚠️ **The row was also retitled and its folder slug renamed** to match the narrowed scope. Verified
before renaming: the **only** inbound reference to the old slug was this row's own Backlog board href,
which was repointed in the same edit.

### ⛔ THE SPLIT DID NOT REMOVE THE ORDERING CONSTRAINT — it made it a cross-row one

⚠️ **This is the single most important consequence of the split, and it is easy to lose.** The
consolidated row's safe internal order was **`B → A → C → E → D`**, because **Group D's deliverable IS
line arithmetic** and every prose group moves the coordinates it depends on.

⭐ **That ordering is now a dependency between two rows: this row runs FIRST, `0393` runs against the
settled file.** ⛔ **Running `0393` before this row lands guarantees a second pass** — every coordinate
`0393` derives before Groups A and B resize §9.1 is dead on arrival. `0393` records this as a hard
dependency on this row.

⛔ **This row does NOT inherit `0393`'s work as a consequence.** It repairs prose in `architecture.md`
and nothing else. See `## Out of scope`.

### Authority for the underlying consolidation

**Owner ruling 2026-09-13**, given live via `AskUserQuestion` in the `fkit lead` session — **the
option label is the verbatim text: "Consolidate into one brief (Rec)"**. The alternatives — *keep
separate but co-scheduled*, and *leave alone* — were **declined**.

⛔ **That was a re-scoping act, authorised by that ruling and by nothing else.** A previous producer
surfaced the consolidation and **correctly refused to perform it unasked**. ⚠️ A future reader must not
generalise either that ruling or the 2026-09-13 split into a licence to merge or split briefs on a
producer's own judgement.

### Why these three were consolidated

**All three target the same region of the same file.** Run separately, each re-derives coordinates the
previous one moved:

- `0251` and `0376` **both target §9.1** — ⚠️ **not "§9 and §9.1" as the consolidation hand-over
  described them.** `0251`'s own title is *"Refresh architecture.md §9.1's test-suite inventory"*.
- `0366` targets **§9.5**, immediately below, so any edit above it shifts its coordinates.

⭐ **`0376`'s item 6 is discharged by the consolidation** — see Group B6. It existed only to repair a
pointer inside `0251`'s brief.

### ⛔⛔ EVERY PREMISE IN THIS BRIEF PREDATES THE CURRENT `architecture.md`. RE-DERIVE AT PICKUP.

**The three originals were measured between 2026-08-07 and 2026-09-04. Sprint 8 has edited
`architecture.md` since.** Every line number, every count, every quoted fragment and every "on disk
today" claim carried into this brief is **evidence of a defect's existence, never a coordinate to
work from**.

⛔ **Do not copy a single figure out of this brief into the file.** Each group below restates its
original's own re-derivation instruction, because each original already carried one — that
instruction is the fix, and it stands.

### What was re-measured on 2026-09-13 by the filing producer — and it is only an existence check

⚠️ **Stated so the consolidation is not read as having done the work.** The filing producer checked
**only** whether each original had been made a no-op by Sprint 8. It had not:

| Original | Premise re-checked 2026-09-13 | Verdict |
|---|---|---|
| `0251` | §9.1 still reads **"eight `node --test` contract suites"** and still names eight by hand | ⛔ **NOT satisfied** — premise holds, and the drift is **worse** than when filed |
| `0376` | §9.1's occurrence-B bullet still reads *"Neither has been observed green on a runner yet"*, *"it lands unpushed"*, *"only ever run on darwin"*, and states the dash risk as live | ⛔ **NOT satisfied** — all four clauses present, byte-for-byte |
| `0366` | §9.5 still carries **three** bullets, including the *"ADRs 003, 004, 006, 007 are still marked `accepted`"* one | ⛔ **NOT satisfied** — and **3 of 3 measured false**, confirming the three-not-two count |

⚠️ **`0286`'s and `0323`'s re-measures moved to [`0393`](../0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md)** with Groups D and E. Both were re-checked on the same day and **neither is a no-op**.

⚠️ **The `0251` and `0376` checks nearly went the wrong way, and the reason matters at pickup:** the
phrase *"eight `node --test` contract suites"* **wraps across a line break** in the file, so a naive
`grep 'contract suites'` returns **nothing** and the text looks gone. ⛔ **Do not conclude a clause is
absent from a single-line grep.**

### ⭐ What Sprint 8 actually changed in `architecture.md` — measured 2026-09-13

**Exactly one commit in the Sprint 8 window touched the file: `abb1388`, `+4 / −4`, from `0341`.** All
four lines are in **§4.2** (the skill count `26` → `28`, plus the two sprint movers on the producer
row) and **§6** (the two data-model rows for `sprints/` and `tasks/`). ⛔ **None is in §9.** Sprint 8's
board carried no `architecture.md` row at all.

⚠️ **The two commits that DID move this ground are Sprint 7-era, 2026-09-04** — `351bea3` (`0356`,
Sweep A, which discharged most of `0286` half A — now `0393`'s Group D) and `cf289c2` (`0312`, which
rewrote **occurrence A only** and left occurrence B untouched — precisely the gap Group B closes).

## What to build

**One file is the target — `ai-agents/knowledge-base/architecture.md`.** Every item below names the
original it came from. ⛔ **Nothing here may be dropped without saying so and why.**
---

### Group A — §9.1's test-suite inventory · from [`0251`](../../cancelled/0251-refresh-architecture-md-section-9-test-suite-inventory/brief.md) items 1–3

**A1. Re-derive §9.1's suite count and enumeration** from `ls test/*.test.js` **on the day the change
is made**, replacing the *"eight `node --test` contract suites"* sentence and its eight-name list.
⛔ **Do not copy a number from this brief.** `0251` recorded the figure moving **8 → 19 → 20** inside
six days, ⚠️ **plus a wrong 21 in `0252`'s worklog — do not propagate that one.** ⭐ The point of the
record is the **drift rate**, not any of the numbers — and the rate is the argument for **OD1**:
measured again on 2026-09-13 the count was **29**, so the sequence is **8 → 19 → 20 → 29** and
**twenty-one of the twenty-nine suites are unnamed in §9.1**. All eight named ones still exist.

**A2. Sweep the surrounding §9 prose for other drifted counts** — anything numbering suites, prove-red
mutations, or coverage that moved with later additions. **The ground truth for mutation counts is
`test/prove-red.sh` itself** — its own header and its `--- Mutation N:` blocks. **Update what is
provably stale; leave accurate claims byte-identical.**
⚠️ **Two known drift candidates, dated 2026-09-13 — re-derive, do not copy:** `prove-red.sh`'s header
read **thirty-four** mutations, while `architecture.md` carried a *"prove-red mutations 16-17"*
reference and a *"mutation 15 covers…"* reference. ⭐ **A pointer to mutation 15 is not a count** — the
don't-repair-what-works rule applies to both.

**A3. Keep §9.1's live thesis intact.** ⛔ **Do NOT restore *"no CI runs it"* anywhere in §9. Do not
reintroduce a `No CI` bullet. Do not reword the heading back.** CI landed in `0256`. The thesis to
preserve is the one on disk: **the suite now runs automatically (CI plus the in-release gate), and
what remains is *coverage, not automation*** — `install.sh` is verified by nothing, and CI running
does not close that gap.

> ⚠️ **`0251` carried three layers of instruction about the occurrence-B bullet, and two of them are
> repealed.** They are preserved here as history because the repeal is what makes the live one safe:
>
> | Layer | What `0251` said | Standing |
> |---|---|---|
> | 1 — 2026-08-12 | *"Do not soften, shorten, or delete that caveat, and never write that CI is working."* | ⛔ **Repealed** by layer 2, inside `0251` itself |
> | 2 — `0251`'s 2026-08-15 correction | *"⛔ Do NOT preserve, restore, or re-word the 'Neither has been observed green on a runner yet' caveat, and ⛔ do not obey 'never write that CI is working.' Both instructions now command a falsehood."* | ✅ **Binding** |
> | 3 — the same block's pointer | *"`0312` … owns the repair of that exact §9.1 bullet"*, *"Recommended order: run `0312` first"* | ⛔ **Dead.** `0312` closed with occurrence B undone; the work is **Group B** of this row |
>
> ⛔ **Layer 1 is not a live hazard and must not be obeyed.** It is recorded so nobody re-derives the
> contradiction from `0251`'s cancelled brief and follows the wrong half.

---

### Group B — §9.1's occurrence B, the four falsified CI clauses · from [`0376`](../../cancelled/0376-rewrite-architecture-md-section-9-1-occurrence-b-the-four-falsified-ci-clauses-0312-left-undone/brief.md) items 1–6

**Authority for the underlying work: owner ruling N1, 2026-09-04**, verbatim option label
**"Close Done + producer files B in the same act (Rec)"**.

**B1. Rewrite §9.1's occurrence-B bullet so all four falsified clauses go** — *never observed green*,
*lands unpushed*, *only ever run on darwin*, and **the dash risk stated as a live risk**.

**B2. Re-derive the run figures at implementation time.** ⛔ **Do not copy any figure from this brief
or from occurrence A** — both are dated and the count only grows. **State the figures with their
measurement date**, per
[`0301`](../0301-record-that-a-dated-claim-is-correct-as-of-its-date-and-does-not-become-a-defect-by-ageing/brief.md)'s
convention, so the replacement cannot rot into the defect it replaces.

**B3. Record the red first run honestly** — it was a **filesystem case-sensitivity** divergence in
`test/orphan-cleanup.test.js`, repaired by
[`0283`](../../done/0283-make-the-lockdown-guard-case-test-filesystem-independent/brief.md).
⛔ **Do not describe it as the predicted dash failure.** ⚠️ **Getting this backwards is a defect of
this task** — it replaces one false claim with another.

**B4. Resolve the A→B cross-reference** so no sentence cites a §9.1 prediction that no longer exists.
**State which of the two shapes you took and why.**

**B5. Keep §9.1's surviving thesis intact.** The live point is **coverage, not automation**. ⛔ The
*"residual risk narrowed but did not close"* paragraph and the `install.sh` bullet are **not**
falsified — leave their substance alone.

**B6. `0376`'s item 6 — RE-POINTING `0251`'s BLOCK — IS DISCHARGED BY THIS CONSOLIDATION. ⛔ Do not
perform it.**
Item 6 existed to make `0251`'s dangling pointer name `0376` instead of the closed `0312`. Its
authority was **owner ruling N5, 2026-09-04**, verbatim **"Fold into 0376's scope (Rec)."** ⭐ **N5 is
satisfied, not overturned:** `0251` is now a **cancelled, frozen record**, the work its pointer was
waiting on is **Group B of this row**, and the owner's own stated reasoning for N5 was that the
dangling pointer should *"die with the work it names"*. It has. ⛔ **Do not edit `0251`'s cancelled
brief** — a cancelled record is corrected by an appended dated note if at all, and there is nothing
here that needs correcting.

---

### Group C — §9.5's residual-drift bullets · from [`0366`](../../cancelled/0366-re-verify-and-correct-architecture-mds-9-5-residual-drift-bullets/brief.md) items 1–4

⚠️ **`0366` carried NO owner ruling.** Its authority was a prose fence inside `0286`
(*"Correct the citation, never the prose … If a claim looks wrong, report it — do not fix it"*), as
applied in `0356`'s worklog. **Stated so nobody cites a ruling that does not exist.**

⭐ *"The section documenting the project's drift has itself drifted."*

**C1. Re-verify every bullet in §9.5 firsthand and report your own count** of how many are false.
⛔ **Do not carry a figure from this brief.** For context only: `0356` measured **two** and recorded
both false; `0366`'s filing producer found a **third** on disk that `0356` never named; and a
2026-09-13 re-measure found **3 of 3 false**. ⚠️ **If your count differs from any of these, say so
plainly** — a record that miscounted its own findings is worth naming.

> ⛔⛔ **`0366`'S OWN DESCRIPTION OF BULLET 1 IS WRONG. DO NOT INHERIT ITS PHRASING.**
> `0366` says `claude/fkit-claude-init.sh` prints *"a **derived** count from `ls … | wc -l`"*.
> ⛔ **Measured 2026-09-13: the summary block prints NO role count at all** — a comment directly above
> a seven-item list records that as **deliberate, owner-ruled 2026-07-20 (`0036` Part D)**, and the
> list **includes `lead`**. The derived `n_agents` count is on a **different line**, and it counts
> **refreshed agents, not roles**.
> ⭐ So bullet 1 is false in **both** halves, and `0366`'s correction of it was itself half wrong.
> ⚠️ **Re-derive it yourself — this note is why C1 says "firsthand", not "confirm".**

**C2. For each false bullet, decide its treatment and record the reason** — repair in place, or an
appended dated note. `architecture.md` is a **living document, not a frozen record**, so repair in
place is the likely answer; ⛔ **argue it rather than assuming it**, and be consistent across the
bullets or say why they differ.

**C3. Re-anchor the coordinates that survive.** A bullet that stays gets a citation form that does not
rot — **heading plus quoted fragment** for coordination documents. ⛔ **A bare line number replaced by
a fresher bare line number is not a repair.**

**C4. Say what §9.5 should contain now.** If every residual it lists is discharged, **the honest
outcome may be that the section is empty or gone** — ⛔ **do not invent replacement residuals to keep
it populated.** ⚠️ **See OD2 below: this one rises to the owner.**


## ⛔ THE INTERNAL COLLISIONS — and the two that the split turned into CROSS-ROW constraints

⚠️ **Read this before planning.** Consolidation removed the concurrency hazard between the originals;
it did NOT remove the ordering constraints, because the groups still move each other's coordinates.
⭐ **The 2026-09-13 split moved three of the six collisions across the row boundary. They did not
disappear — they became constraints on `0393`.**

**The safe internal order in this row is `B → A → C`.** Both prose groups resize §9.1, and C sits
below it.

| # | Collision | Groups | How it resolves |
|---|---|---|---|
| **X1** | **§9.1's length changes twice** — A's enumeration rewrite (8 names → ~29, or drop the list under OD1) and B's bullet rewrite both resize §9.1, shifting every line below it | A ↔ B ↔ C, **and `0393`** | ⭐ **Order.** B then A, then re-derive C's coordinates against the result. ⛔ No coordinate measured before A and B lands survives them — **including every coordinate `0393` will derive** |
| **X2** | **The occurrence-B bullet** — `0251` layer 1 ordered it preserved byte-identical; layer 2 repealed that; layer 3 handed it to the closed `0312` | A ↔ B | ⭐ **Settled in Group A's layer table.** Layer 2 binds, layer 1 must not be obeyed, layer 3 is dead and its work is **Group B** |
| **X3** | ⛔⛔ **THE SHARPEST ONE — §9.5's two bare coordinates are stale AND the claims they support are false** | C ↔ **`0393`** | ⛔ **ONLY Group C — in THIS row — may touch them, and it must fix the claim and the anchor TOGETHER (C3).** `0393`'s **D4** forbids repairing a coordinate attached to a false claim — *"repairing a coordinate that supports a false sentence would make the sentence look verified."* ⚠️ **This is exactly why `0356` reported instead of repairing, and why `0366` existed at all.** ⭐ **The split makes this SAFER, not riskier:** the two treatments now sit in different rows and cannot be confused inside one run |
| **X4** | **If OD2 deletes §9.5**, the removal takes the accurate `ADR-027` dual-home paragraph with it and shifts everything below | C ↔ OD2 ↔ **`0393`** | ⚠️ **OD2 is settled in THIS row, at its plan gate — and it must be settled before `0393` derives any shift map.** ⛔ A whole-section deletion is a case `0286`'s fences never anticipated. ⭐ **The dual-home paragraph is accurate — if §9.5 goes, that paragraph must survive somewhere, not die as collateral** |
| **X6** | **§9's suite and mutation counts** were fenced OUT of `0286` (*report, don't fix*) and INTO `0251` | A ↔ **`0393`** | ⭐ **The fence survives the split.** **Group A, in this row, owns those counts**; ⛔ `0393`'s Group D still may not touch a count — **D4 binds** |

⚠️ **X5 (`architecture.md`'s one `ADR-008:85` site, a D ↔ E collision) went entirely to `0393`** — both
its sides are there. It is recorded on that row, not here.

## ⭐ The open decisions this row carries — ⛔ neither is settled here

⚠️ **Two of the five open questions that arrived with the originals stayed with this row. A run that
arrives having already chosen has failed them.** Each belongs at this task's **plan gate, with the
owner present**.

| # | Question | Origin | Standing |
|---|---|---|---|
| **OD1** | **Should §9.1 stop enumerating suite names by hand at all?** A hand-maintained list of twenty filenames is precisely what rotted. The alternative — state the count and the derivation command, drop the name list, or name only notable groups — trades discoverability for durability. | `0251` (b) | ⛔ **OWNER-DEFERRED, verbatim option label "Leave it for 0251's own run"** (`AskUserQuestion`, 2026-08-13). ⚠️ **Choosing *stop enumerating* means amending this row's own enumeration verification step in the same change** — ⛔ do not change the prose and leave a verification step that cannot pass |
| **OD2** | **What should §9.5 contain now — and should it exist at all?** | `0366` C4 | ⚠️ **No owner ruling exists.** Deleting a section of the project's reference document is owner-visible. ⭐ **The decision survives both the consolidation and the split intact and still needs the owner — but it does NOT need a row of its own**; it is this row's plan-gate question. ⚠️ **`0393` waits on its answer (X4).** |

⚠️ **OD3, OD4 and OD5 moved to [`0393`](../0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md)** with Groups D and E. ⛔ **Do not answer them here.**

## ⛔ Out of scope

- ⛔ **THE TWO CITATION SWEEPS.** Groups D and E — the `architecture.md` outbound/inbound citation
  census and the repo-wide `ADR-NNN:LINE` re-sweep — are
  [`0393`](../0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md)'s,
  by the 2026-09-13 split ruling. ⚠️ **The one sanctioned overlap is X3**: Group C repairs §9.5's own
  stale anchors **together with** the false claims they support, because a coordinate repaired apart
  from its false claim makes the claim look verified. ⛔ **Do not widen that into a general citation
  sweep** — outside §9.5, leave coordinates to `0393`.
- ⛔ **Any `ai-agents/wiki-vault/` write** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)). Route vault sites to `fkit-wiki`.
- ⛔ **Any behaviour change.** Documentation only.
- ⛔ **Any `## Status` value, any ADR's `- **Status:**` line, any task status, any rank, any row order
  or row count on any board** ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- ⛔ **No task file moved, renamed or reopened** — movers are producer-only
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- ⛔ **`ai-agents/sprints/done/` and everything under `ai-agents/tasks/done/` or `cancelled/`** —
  frozen history. A closed record that is now false is corrected by an **appended dated note**, never
  an edit. ⛔ **This row does not append those notes either — report what needs one.**
- ⛔ **`claude/skills/`, `dashboard.sh`, and every agent file.** This row **consumes** the
  correction-note form and the convention page; it changes neither.
- ⛔ **Writing a new convention, rider, guard, check or tooling change.** Raise, do not build.
- ⛔ **ADR-026's two present-tense *"no `.github/workflows/`"* claims.** The owner considered them in
  the 2026-08-15 question and did not select them; **reported-only**.
- ⛔ **No new devDependency** ([ADR-014](../../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md)). ⛔ **No commit, no push.** ⛔ **No secrets in any artifact.**

## Verification steps

**Scope and fences**

1. **`git diff --stat` lists only `ai-agents/knowledge-base/architecture.md`.** ⚠️ **Other workers'
   pre-existing dirty paths must be listed and excluded by name, not waved at.**
2. **Every fence held.** Name each fenced item and show it is byte-identical. ⛔ **`git diff --stat`
   must show zero changes under `test/fixtures/`, `ai-agents/tasks/done/`,
   `ai-agents/tasks/cancelled/` and `ai-agents/sprints/done/`.**
3. **`git status --porcelain` shows nothing under `ai-agents/wiki-vault/`.**

**Group A**

4. **`ls test/*.test.js | wc -l` equals the count §9.1 states.** ⚠️ **If OD1 is decided as *keep
   enumerating*:** every filename in the enumeration exists on disk **and vice versa** — no suite on
   disk is missing. ⚠️ **If OD1 is decided as *stop enumerating*:** this half of the step is
   **amended in the same change**, and the run says so.
5. **Any mutation count written in §9 equals the mutation list in `test/prove-red.sh`** — the script's
   own header and its `--- Mutation N:` blocks are ground truth.
6. **`grep -n "eight" ai-agents/knowledge-base/architecture.md` returns no hit claiming eight test
   suites.** ⚠️ The eighth-**role** mentions are unrelated and **must survive untouched**.

**Group B**

7. **All four falsified clauses are gone**, and the run quotes the before and after text.
8. **Every run figure carries its measurement date**, and none was copied from this brief.
9. **The red first run is described as a filesystem case-sensitivity divergence**, ⛔ **not as the
   dash failure.**
10. **The A→B cross-reference resolves**, and the run states which shape it took and why.
11. **⛔ Do not overstate in the other direction.** *"CI is green"* is a dated measurement, not a
    permanent property. ⚠️ **A correction that overstates is a worse defect than the stale claim it
    replaces** — that is exactly how this text became stale the first time.

**Group C**

12. **Every bullet in §9.5 has a recorded verdict** with the command or observation that produced it.
    ⛔ **A document covering two when three exist fails this step.**
13. **The run states its own count** and says explicitly whether it matches `0356`'s two.
14. **No surviving citation in §9.5 is a bare line number.**
15. **If a bullet was removed, the run says why removal rather than annotation was right.**

**Hand-off to `0393`**

16. ⭐ **The run states the §9 line-shift it caused**, so `0393` knows the ground moved and by how
    much. ⛔ **It does NOT hand over a shift map to be used as arithmetic** —
    [`0393`](../0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md)'s
    **D5** requires re-deriving from disk and forbids an inherited map. This step records **that** the
    ground moved, not **where** things landed.
17. ⭐ **The run states OD2's answer plainly**, because `0393` cannot derive a shift map until §9.5's
    fate is known (X4).

**Suite**

18. **`npm test` green; state the measured pass/fail counts.** `bash test/prove-red.sh` green.
    ⚠️ **State plainly that no existing test reads a docs citation** — the suite passing proves
    nothing about this change. ⛔ **Do not imply coverage.**
19. **`node --test test/reference-integrity.test.js` reports 0 broken links**, and
    `node --test test/coordination-citation-policy.test.js` is green. ⛔ **Do not add a `NAMED_EXEMPT`
    entry to make anything pass.**

## Notes

- **Depends on:** nothing.
- **Blocks:** [`0393`](../0393-the-two-citation-sweeps-architecture-md-outbound-inbound-and-the-repo-wide-adr-nnn-line-class/brief.md) — **hard.** ⭐ **This is the split's load-bearing consequence** (see § *THE SPLIT DID NOT REMOVE THE ORDERING CONSTRAINT*): `0393`'s deliverable is line arithmetic over a file this row rewrites, and it also waits on **OD2**'s answer.

- ⭐ **Provenance map — where each cancelled original's scope landed. ⛔ Nothing was dropped.**

  | Original | Its scope | Landed as | Owner it carried |
  |---|---|---|---|
  | `0251` | §9.1 test-suite inventory (⚠️ **§9.1, not §9**) | **this row, Group A** (items 1–3) · **OD1** (its open decision (b)) | `fkit-coder` |
  | `0376` | §9.1 occurrence B — four falsified CI clauses | **this row, Group B** (items 1–5) · **B6** records item 6 as **discharged by construction** | `fkit-coder` |
  | `0366` | §9.5 residual-drift bullets | **this row, Group C** (items 1–4) · **OD2** (its C4 decision) | `fkit-architect` |
  | `0286` | whole-file citation sweep | ➡️ **`0393`, Group D** · **D0** · **OD3** | `fkit-coder` |
  | `0323` | repo-wide `ADR-NNN:LINE` sweep | ➡️ **`0393`, Group E** · **OD4**, **OD5** | `fkit-architect` |

- ⛔ **The five originals stay CANCELLED.** `0251`, `0376`, `0366`, `0286` and `0323` are frozen
  records cited here as provenance. ⛔ **Neither this row nor `0393` resurrects, reopens or edits any
  of them.**

- ⚠️ **`0366` was a decision-shaped row, and the answer to "does its decision survive?" is YES —
  intact, and it does NOT need a separate row.** Its items 2 and 4 are judgement calls, not owner
  rulings (`0366` records *"No owner ruling attaches to this row"*). Item 2 (repair in place versus
  appended note) is a **worker** judgement at plan time. **Item 4 — whether §9.5 should exist at all —
  rises to the owner**, because deleting a section of the project's reference document is
  owner-visible. It is carried as **OD2** and belongs at this row's plan gate.

- ⚠️ **Two open decisions in this row, not one.** ⛔ **`0251` carries an owner-deferred decision too** —
  OD1, held over by the verbatim ruling *"Leave it for 0251's own run"*. **A run that ships Group A
  without settling OD1 has skipped an owner question**, and OD1 changes this row's own verification
  step 4.

- ⛔⛔ **CARRIED-FORWARD FLAG 1 — `0366`'s OWN CORRECTION IS HALF WRONG. DO NOT INHERIT IT.**
  It is flagged inside Group C as well; repeated here so a reader of `## Notes` alone cannot miss it.
  `0366` says `claude/fkit-claude-init.sh` prints *"a **derived** count from `ls … | wc -l`"*.
  ⛔ **Re-measured on disk 2026-09-13 and again when this split was filed: the summary block prints NO
  role count at all.** A comment on the line records that as **deliberate, owner-ruled 2026-07-20
  (`0036` Part D)**; the derived `n_agents` value is assigned on a **different line** and printed as
  *"refreshed N agents"* — it counts **refreshed agents, not roles**. ⭐ So `0366`'s bullet 1 is false
  in **both** halves, and `0366`'s correction of it was itself half wrong. ⚠️ **This is why C1 says
  "firsthand", not "confirm".**

- ⚠️ **CARRIED-FORWARD FLAG 2 — `0366`'s Backlog board row has SEVEN cells, not six.** A stray
  **unescaped pipe** in its description cell adds a column. ⭐ **Measured when this split was filed:**
  the row splits into **5** inner fields where every neighbouring row splits into **4**. ⛔ **It is
  deliberately LEFT ALONE, not repaired** — the escape belongs to
  [`0322`](../0322-escape-the-stray-pipes-in-the-board-rows-and-guard-against-new-ones/brief.md)'s scope, and repairing a
  board row from this row would be an out-of-scope board edit. **Noted so nobody re-discovers it and
  widens this row's diff.** ⚠️ Check `0322`'s live scope before assuming the pipe is still unfixed.

- ⚠️ **Placement: Backlog board, UNRANKED.** ⛔ **The split renumbered nothing and re-ranked nothing**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  This row keeps id `0392` and its board position; `0393` was **appended last, unranked**.
  ⭐ **On merit** this sits with the other `architecture.md` rows: it is a set of **false statements in
  the project's own reference document**, which is worse than a rotted pointer because a reader cannot
  tell it is wrong. ⛔ **It is not ranked there** — the merit position is recorded so the owner can act
  on it in one edit.

- ⚠️ **Cite tasks by folder ID, never by board rank** —
  [`priority-is-rank-not-identity.md`](../../../knowledge-base/conventions/priority-is-rank-not-identity.md).

- ⚠️ **Every coordinate in this brief is a dated anchor and the durable anchor is the quoted text.**
  ⛔ **Re-measure every one.** This brief is about stale coordinates; its own will rot the moment
  anything edits `architecture.md`.
