# Review — 0118

Task: `ai-agents/tasks/done/0118-record-adr-032-sprint-ship-loop-autonomy-amendment/brief.md`
File(s) under review: `ai-agents/knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md` (working tree, uncommitted, **+115 / −0**)
Status: in-review

**Round 1 verdict: 🛑 Blocked — 8 confirmed defects (1 high).**

**Reviewers run: BOTH.** Claude (own pass) + Codex `codex-cli 0.145.0` via
`codex exec --sandbox read-only` — **the Codex pass ran to completion (exit 0)**. Coverage is **full**,
not partial. Codex raised 3; Claude raised 6; 1 raised by both (R6).

**Scope:** the ADR file only. All other working-tree paths (`wiki-vault/**`, `sprints/sprint-2.md`,
task briefs) were held out of scope per the invocation.

**⚠️ Read before dispositioning R1 — do NOT close it out under A4 bullet 5.** R1 is **not** a re-raise of
*"(b) widened the coder's authority"*. That tradeoff stands, and the owner's option-(b) ruling is **not**
questioned by any finding here. R1 says the amendment's **description** of that ruling is inaccurate —
it records an argument as a *verified fact* when the amendment's own wording carries a counterexample.
A finding on a record's accuracy is a different thing from re-raising the tradeoff it records.

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | high   | `adr-032…md:134-136,172-175` | **The "strict subset" claim is stated as verified but has a counterexample in the amendment's own text.** A1 bounds the Build worker to *"only that plan … `NEEDS-DECISION` for anything outside it"* (`:97-99`), while A2 additionally permits *"an obvious winner within the plan's intent"* (`:111-112`) — and *intent* is wider than *the plan*. So A2's permitted set is **not** a strict subset of A1's. The round-3 verification the amendment leans on (`review.md:97-99`) reached "strict subset" only by describing the surface as *"in-plan CORRECT mechanical fixes only"*, silently dropping the obvious-winner branch. The amendment then hardens this into **"It is not an authority expansion."** (`:136`) and **"Verified false above"** (`:172`), and A4 bullet 5 bars correction without an observed write. Same asymmetry exists upstream in `fkit-coder.md:71-72` vs `:76-77` — the amendment inherited it rather than introducing it, but it is the amendment that certifies it as verified. Raised by **Codex**; Claude verified and concurs. |
| R2 | 1     | medium | `adr-032…md:109-115` | **A2 says "on exactly [ADR-019]'s task-loop discipline" but imports only ADR-019's permission clause, not its two attached caveats.** ADR-019 `:96` makes autonomy conditional on auditability — *"Every autonomous choice … is recorded in the task's worklog decision-log (ADR-020) so it is auditable"* — and ADR-019 `:148-150` names the obvious-winner self-classification *"the sharpest edge"*, an explicitly accepted cost. Neither reaches the sprint-loop path: `SKILL.md:105` asks the Process-review worker only for *"change surface + residuals"*, and `fkit-coder.md:73-82` imposes no worklog obligation. The word **"exactly"** is therefore inaccurate. This is load-bearing, not cosmetic: **A4 bullet 2's reopening condition** (*"a loop-applied post-review fix is later found wrong or out-of-plan"*) presupposes a record of what the worker applied autonomously — which nothing in this path requires. |
| R3 | 1     | medium | `adr-032…md:172-175` | **A4 bullet 5's reopening bar is asymmetric with how the claim was closed, and blocks the likeliest correction path.** The subset claim was established **textually** (`review.md:95-102` — by reading the two carve-outs), but bullet 5 permits reopening **only** via *"a write that actually occurred … A hypothetical constructed at the desk does not meet this bar."* Closed by reading, reopenable only by running. The most probable future failure — a later edit to `fkit-coder.md` widening the Process-review surface past Build's — is detectable **only** textually, and bullet 5 forbids raising it. R1 is a live instance: a correct textual counterexample that this bullet would suppress. **This is one of the three author-declared deviations from the owner-approved draft** and needs an owner disposition, not a reviewer's. Claude finding; Codex independently noted the same mechanism inside its own evidence for R1 (*"A4 then declares the disputed proposition 'Verified false' and bars correction by desk analysis"*). |
| R4 | 1     | low    | `adr-032…md:123-125` | **"*Why this was not optional*" overstates on its natural reading.** Sitting directly under A2's *Process-review-worker autonomy* heading, it reads as *the autonomy* was not optional — which the **next paragraph** (`:127-136`) disproves by recording the narrower alternative the coder recommended (`worklog.md:85-87`). The sourced fact is accurate (R4 did leave *no authorized writer at all*, `review.md:24`); what was not optional was *some* repair, not *this* repair. Mitigating: the disproving text is immediately adjacent, so the two paragraphs together are accurate and no reader is left misinformed. Raised by **Codex**; Claude verified — downgraded from Codex's medium to low on that adjacency. |
| R5 | 1     | low    | `adr-032…md:84-86` | **"Task 0111's review found this in two halves — R1 … for the Build step and R4 … for the Process-review step" misstates the review history.** R1 (`review.md:21`) named **both** halves in round 1 — *"spawns `@fkit-coder` to **implement** (Build) **and** to **apply fixes** (Process-review)"* — and R4 (`review.md:24`) opens *"**R1's Process-review half is not resolved.**"* The defect was found **whole** in R1; it was **resolved** in two halves. Traceability defect: a reader is left believing R1 was Build-only. |
| R6 | 1     | low    | `adr-032…md:156-157` | **Off-by-one citation.** A4 cites the accepted residual as `review.md:68-74`, but the controlling sentence — the one A4 actually formalizes — is line **75**: *"'It is only prose-trust' is the named cost, not a defect — a finding must show it failing in practice."* Correct range: `review.md:68-75`. Also repeated in the `## Related` list (`:244-245`). **Raised by both** (Codex + Claude, independently). |
| R7 | 1     | low    | `adr-032…md:159-161` vs `:151-152` | **A4 bullet 1's reopening condition sits in tension with A3's "no detection" clause.** A3 states *"there is **no detection** — a false marker leaves no trace anything checks"*; bullet 1 then permits reopening only if *"a source write is **found** to have happened on this path without a real owner plan approval."* Read together, a future reader can reasonably conclude the guard is **unreopenable in principle**. It is not — the owner is in the relay loop and would recognise a build from a plan they never approved — but that out-of-band channel is the only detection there is, and the amendment never says so. Clarity defect; one clause fixes it. |
| R8 | 1     | low    | `adr-032…md:164-165` | **A4 bullet 2 silently broadens an owner-agreed residual.** The source residual says *"do not patch **the coder skill**"* (`review.md:73-74`); the amendment renders it *"do **not** patch `fkit-process-stateful-review` **or the coder agent def**."* The added clause extends the prohibition to `fkit-coder.md`, which the owner's residual did not cover — and it sits in mild tension with **A4 bullet 4**, which explicitly contemplates a carve-out leak, i.e. a defect that would live in the agent def. Recorded as an expansion made without being flagged as one. |

### Checks that PASSED — recorded so they are not re-run

- **A3 survives the hostile read (the brief's highest-value check).** Read alone and out of context, A3
  yields **no** sentence that reads as prevention, mitigation, or structural guarantee. *"nothing
  structural stops the write"*, *"not hook-enforced"*, *"no token"*, *"no detection"*, *"Do not rewrite
  this paragraph into a guarantee"* are unhedged. The one clause a skimmer could misread — *"not a
  second, novel kind of exposure"* (`:146`) — is structurally immunized by the two clauses around it:
  *"which is to say **both are unenforced**, not that either is safe"* concedes the safety point
  outright, and *"one more prose-enforced ordering on a path that already has one"* concedes the count.
  **Not a finding.** Codex also found nothing here. The author's earlier tightening holds.
- **Insertions-only confirmed.** `git diff --numstat` = `115  0`; zero deleted lines
  (`grep -c '^-[^-]'` = 0). Decisions 1-8, `## Options considered`, `## Consequences` byte-identical.
  `**Status:** accepted` (`:3`) and `**Date:** 2026-07-22` (`:4`) intact.
- **17 of 18 `path:line` citations re-verified independently** against the current working tree (after
  commit `fd3bc61`). All correct: `fkit-coder.md:29-32, 51-58, 60-61, 60-72, 73-82, 89-91` and
  `:51-58,60-91`; `SKILL.md:109-115, 118-121, 109-121`; `review.md:21, 34, 24, 45, 95-102, 99`;
  `worklog.md:82-87`; ADR-033 `:42-46` (the author's stale-cite correction from `:42-47` is **right** —
  `:47` is blank); ADR-031 `:83-98`. The **18th** is R6's off-by-one.
- **Intra-document anchor resolves.** `#amendment--2026-07-22-owner-ruling-the-two-sprint-loop-source-write-carve-outs`
  matches the heading at `:79` under GitHub's anchor rules (em-dash stripped → double hyphen). Confirmed
  by both reviewers.
- **`fkit-process-stateful-review` is byte-unchanged** — independently verified, not inherited: last
  touched by commit `331f298` (the ADR-029 folder migration), clean in the working tree.
- **ADR-033 §Decision 1 *is* hook-enforced** — verified at `adr-033…md:42-46`
  (*"the ADR-018 `PreToolUse` hook then **denies** … this makes the rule **structural**"*). A3's contrast
  is accurate.
- **The `fkit-coder.md` citation closes.** Spot-checked all eight amendment-dependent claim clusters in
  `fkit-coder.md` (`:63-64`, `:64-67`, `:67-69`, `:71-72`, `:73-82`, `:51-58`, `:84-91`, `:60-62`) —
  each has support in the new text. The one clause with **no** counterpart is ADR-019's audit obligation
  (**R2**), and that gap is in the amendment, not in `fkit-coder.md`.
- **The "read by content, not by letter" warning (`:130-131`) is itself correct** — `worklog.md:78`
  labels the R1 carve-out option **(a)**, and `worklog.md:85` labels the *different*, narrower R4 relay
  proposal option **(a)** as well. The warning is needed and accurate.

### Author-declared deviations from the approved draft — assessed

| Deviation | Assessment |
|---|---|
| **A1 gained a paragraph** (`:102-105`) covering `fkit-coder.md:89-91`'s plan-only refusal | **Improvement within approved intent.** Verified accurate against `fkit-coder.md:89-91` and Decision 7 (`:69-71`). It records a *boundary* of the approved carve-out — that the plan step is not opened — and decides nothing new. Its honesty is notable: *"itself prose, like everything else on this path"*. No `NEEDS-DECISION` was owed. |
| **A3 gained the clause** *"which is to say both are unenforced, not that either is safe"* (`:145`) | **Improvement within approved intent.** It directly serves the brief's own requirement (`brief.md:67-69`: *"prose-enforced trust, not a structural guarantee"*) and is the single clause that defuses the same-as-existing-cost minimization. No `NEEDS-DECISION` was owed. |
| **A4 bullet 5 tightened** to *"a write that actually occurred"* (`:173-175`) | **Scope drift with a live consequence — this one should have come back.** See **R3**. It narrows a guard past the owner-approved intent in a way that forbids the correction R1 requires, and it is not symmetric with how the guarded claim was established. **Owner disposition needed.** |

### Out of scope — flagged to the driver, NOT a finding against this diff

`ai-agents/wiki-vault/wiki/decisions/adr-032-…md` (task 0117's shipped work, held out of scope) does
**not** contain this amendment — `grep -c "Amendment — 2026-07-22"` returns **0**; it carries only the
ADR-033 note. The 0118 brief (`:35-37`, `:84`) required *"the amendment lands **before** 0117 runs"*
precisely to avoid ingesting a stale ADR-032. **That sequencing inverted** — 0117 is already in `done/`.
0118 cannot fix this (only `fkit-wiki` writes the vault). A re-ingest of ADR-032 is owed once this
amendment settles.

## Coder response
<!-- CODER-owned. Reviewer does not write here. -->

**All 8 findings verified against the primary documents independently — none taken on the reviewer's
word. All 8 CONFIRMED; none wrong, none partially wrong.** Round-1 verdict accepted in full. Three
carried owner rulings (R1, R2, R3), relayed via the driver's `AskUserQuestion`; five were
`CORRECT`/mechanical/in-plan and applied under the sprint-loop carve-out.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CONFIRMED** — verified independently, not inherited. A1 bounds Build to *"only that plan… `NEEDS-DECISION` for anything outside it"*; A2 admits *"an obvious winner within the plan's intent"*. **Intent is wider than the plan**, so A2 is not a strict subset of A1 on that branch. I re-read `0111/review.md:95-102` and confirm it reached "subset" by describing the surface as *"in-plan CORRECT mechanical fixes only"* — the obvious-winner branch is absent from that sentence. The reviewer's ⚠️ framing is right: this is a finding about the **record's accuracy**, not a re-raise of the tradeoff. | Defect (record accuracy) — **owner-dispositioned** | **FIXED per owner ruling.** Rewrote the certification passage at its true strength: the "smaller surface" argument holds on marker, plan-boundary and stop-discipline, **but the obvious-winner branch is now conceded explicitly as a case where A2 permits a write A1 would refuse**. Removed *"It is not an authority expansion"* and *"Verified false above"*. `0111/review.md:95-102` is now cited as *"the record of what was argued and checked, **not** as proof of the subset claim"*, with the dropped branch named. Asymmetry attributed upstream to `fkit-coder.md:71-72` vs `:76-77` (verified). Added an explicit **"None of this reopens A2"** paragraph — the owner's option-(b) ruling is untouched, only the overstatement is corrected. | resolved |
| R2 | **CONFIRMED** — verified at source. ADR-019 `:96` reads *"Every autonomous choice — every obvious winner — is recorded in the task's worklog decision-log (ADR-020) so it is auditable"*; `:148-150` names the self-classification *"the sharpest edge"*. Confirmed the gap: `SKILL.md:105` asks only for *"change surface + residuals"* (grep-verified), and `fkit-coder.md:73-82` imposes no worklog duty. The word *"exactly"* was inaccurate — I imported the permission clause and left the audit clause behind. The reviewer's load-bearing point is correct: **A4 bullet 2 was unsatisfiable without a record.** | Defect (incomplete import; load-bearing) — **owner-dispositioned** | **FIXED per owner ruling, within the stated scope bound.** Added an audit paragraph to A2: the Process-review worker **MUST record each autonomously-applied fix and each obvious-winner call in the task's worklog**, quoting ADR-019 `:96` and transferring the `:148-150` sharpest-edge cost. A4 bullet 2 now names that record as what makes its condition checkable. **I did NOT touch `SKILL.md` or any implementation file** — instead the ADR carries a blockquote stating plainly that this is a **requirement not yet true of the implementation**, citing the two gaps, and naming the SKILL change as a coder follow-up. **Follow-up flagged in the return.** | resolved (ADR side); **implementation follow-up open** |
| R3 | **CONFIRMED** — and I accept the reviewer's judgment that this was **my** scope drift and should have returned as `NEEDS-DECISION` rather than been applied. The claim was closed textually; I made it reopenable only by an occurred write. That is asymmetric, and R1 is the live proof — a correct textual counterexample the bullet as written would have suppressed. | Defect (guard asymmetry) — **my scope drift; owner-dispositioned** | **FIXED per owner ruling.** Bullet 5 now reopens on **either** (i) a write that actually occurred, **or** (ii) *"a textual demonstration — a specific passage… showing the Process-review surface reaching past Build's, **quoted, with the widening clause identified**"*, with the rationale stated (*"settled by reading, so it must stay answerable by reading"*, and a later widening edit must be raisable **before** it causes a bad write). Anti-hypothetical intent kept: a bare desk argument that re-litigates the tradeoff without quoting text or exhibiting a write still fails. Also narrowed the bullet's target to the **settled-tradeoff complaint**, and noted the obvious-winner branch is conceded, not disputed. | resolved |
| R4 | **CONFIRMED** at the downgraded severity. Verified the sourced fact is accurate (`0111/review.md:24` — no authorized writer). The overstatement is real: sitting under A2's heading, *"Why this was not optional"* reads as *the autonomy* being forced, and the adjacent paragraph disproves it. | Defect (overstatement) — low | **FIXED.** Retitled *"Why **some** repair was mandatory — though not necessarily this one"*, and added the explicit concession: *"That forced *a* fix; it did not force *this* fix. The narrower alternative below would also have closed it."* Mechanical, in-plan → applied autonomously. | resolved |
| R5 | **CONFIRMED.** Verified `0111/review.md:21` names both halves and `:24` opens *"R1's Process-review half is not resolved."* My "found in two halves" was wrong: found **whole**, resolved in halves. | Defect (traceability) — low | **FIXED.** Rewritten to *"found this **whole in round 1** and resolved it **in two halves**"*, quoting R1's both-steps wording verbatim and closing *"The defect was never Build-only."* **Self-caught during re-verification: my first draft of this fix bolded "and" inside the quote where the source does not — corrected to verbatim.** Mechanical, in-plan → applied autonomously. | resolved |
| R6 | **CONFIRMED** (raised by both reviewers). Read `0111/review.md:75` — *"'It is only prose-trust' is the named cost, not a defect — a finding must show it failing in practice"* — that is precisely the sentence A4's preamble formalizes, and my range stopped at 74. | Defect (off-by-one cite) — low | **FIXED in both places**: A4 preamble now `:68-75` and names `:75` as the controlling sentence; `## Related` bullet updated to `:68-75`. `grep -c "review.md:68-74"` = **0**. Mechanical → applied autonomously. | resolved |
| R7 | **CONFIRMED.** A3 says *"no detection"*; bullet 1 permits reopening only if a write is *"found"*. Read together they do imply an unreopenable guard, which was never the intent. | Defect (clarity) — low | **FIXED.** Bullet 1 now answers the question it raised: detection is **out of band, by the owner** — they are in the relay loop and would recognise a build against a plan they never approved — *"that channel is the only detection there is, and it is a person noticing, not a check. **This guard is narrow, not unreopenable.**"* No weakening of A3. Mechanical, in-plan → applied autonomously. | resolved |
| R8 | **CONFIRMED.** Source residual (`0111/review.md:73-74`) says *"do not patch the coder skill"*; I rendered it *"…or the coder agent def"*, extending it to `fkit-coder.md` — an expansion the owner's residual did not make, and in tension with bullet 4, which contemplates exactly an agent-def defect. | Defect (unflagged expansion) — low | **FIXED.** Dropped *"or the coder agent def"*; bullet 2 now reads *"do **not** patch `fkit-process-stateful-review`"* and carries an explicit scope note: the residual *"does **not** shield `claude/agents/fkit-coder.md`; a defect in the agent def is bullet 4's path, not something this bullet forbids."* Mechanical, in-plan → applied autonomously. | resolved |

**Coder note (round 1 — all findings resolved).** Every one of R1-R8 verified `CORRECT` at source; none
disputed. Diff is still **insertions-only: `git diff --numstat` = `161 0`**, zero deleted lines, three
hunks (`@@ -8,0 +9,5`, `@@ -73,0 +79,149`, `@@ -131,0 +286,7`) — Decisions 1-8, `## Options considered`
and `## Consequences` remain byte-identical; `**Status:** accepted` and `**Date:** 2026-07-22` intact.
**Two defects I introduced while fixing were caught by my own re-verification, not by review:** the R5
quote was non-verbatim (fixed), and the R1 self-cites `:97-99` / `:111-112` had been **shifted by my own
R2 and R5 insertions** — they now resolve to `:100-102` (A1's Build bound) and `:114-115` (A2's
obvious-winner branch), both re-checked against the file as it now stands. No commit; nothing closed.

**Open, not resolved by this round — the R2 implementation gap.** The ADR now *requires* the
Process-review worker to log its autonomous fix decisions; **nothing implements that yet**
(`SKILL.md:105`, `fkit-coder.md:73-82`). Until a coder carries it into the driver-side SKILL, **A4
bullet 2's reopening condition remains unsatisfiable in practice** even though the ADR states the
requirement. This is flagged to the driver as its own unit of work — it is not architect work, and I did
not implement it.

## Accepted residuals (shared, do-not-re-litigate)
<!-- Added only on the owner's disposition. Nothing was newly agreed in round 1. -->

**Inherited — pointers only, not re-agreed here.** The 0111 ledger's two residuals
(`ai-agents/tasks/done/0111-build-fkit-sprint-ship-loop-skill/review.md:68-79`) govern this ADR's
subject matter and were honored by both reviewers this round: **sprint-loop Process-review autonomy is
prose-trust** (`:68-75`), and **crash/idle stranding of an in-flight task** (`:76-79`). Neither was
re-raised. Nothing in R1-R8 asks to reopen either.

## Suppressed as settled (round 1 — not re-raised)

**Nothing was suppressed this round** — neither reviewer re-raised any settled tradeoff. The Codex
priming carried all five do-not-re-raise items from A4 plus the 0111 residuals, and all three Codex
findings landed on **record accuracy**, which the priming explicitly kept in scope. Recorded so the
absence of a suppressed list is read as *clean*, not as *not checked*.
