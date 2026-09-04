# Review — 0357

Task: `ai-agents/tasks/backlog/0357-sweep-b-the-single-site-correction-notes/brief.md`
File(s) under review: the 29 repaired files of Sweep B + this task's `worklog.md`. ⛔ Excluded by name
as the driver's own work, not the coder's: `ai-agents/sprints/sprint-7.md`, `0357`'s `brief.md`,
`0357`'s `plan.md`.
Status: in-review — round 1 dispositioned; ⛔ NOT closed-out, awaiting the Codex second opinion (owner ruling N4)
Coverage: **Codex unavailable** — ADR-042 D1, the one state that IS a degradation. `codex exec`
(`codex-cli 0.152.0`, read-only sandbox) started, ran ~176k tokens of real investigation over the
diff, the briefs and live code, then terminated on an account usage limit (*"You've hit your usage
limit … try again at 7:24 PM"*) **before emitting any findings**. A retry probe returned the same
error, so the limit is hard. There was no usable second opinion to weigh; **all evidence in this
section is mine.**

## Reviewer findings

| # | Round | Sev | Location | Claim |
|----|-------|------|----------|-------|
| R1 | 1 | high | `worklog.md § Step 8 — the hand-off to the producer`, the close list | `0312` closes as `Done` under the reason common to all eighteen — *"its correction landed at its own named site under its own brief's constraints"* — but that is true of occurrence A only. Its brief's `## What to build` item 2, *"**Rewrite occurrence B** so that all four falsified clauses go"*, is **unrepealed and undone**; `architecture.md` §9.1 still carries *"Neither has been observed green on a runner yet"*, *"lands unpushed"* and *"only ever run on darwin"* (measured whitespace-normalised, 2026-09-04). The owner's ruling was **"File B as a follow-up (Rec)"** — no follow-up brief exists (the only backlog file naming *"occurrence B"* is `0312`'s own), and the hand-off does not ask the producer for one. ⚠️ **Mitigation, stated honestly:** the coder DID surface B upstream, in `worklog.md § Refusals and report-only findings` (*"See the loud residual in the return"*), and the close has not happened yet. But once `0312` closes, the only board row tracking those clauses is retired with nothing filed behind it — in the document `CLAUDE.md` points every role at. |
| R2 | 1 | medium | `worklog.md § Step 5 — the repairs, grouped by target file`, the `0276` row's Diff cell | The cell reads *"skill `+6 / −4`"*. Measured: `git diff --numstat claude/skills/fkit-task-brief/SKILL.md` → **`5  3`**. ⭐ **This is a second instance of the exact class the coder self-reported** in `worklog.md § A GAP I INTRODUCED…` — *"a table row describing a repair is not evidence the repair happened"*. The repair itself did land and is correct; the proof cell is wrong. Every other Diff cell in that table was checked against `git diff --numstat` and matches. |
| R3 | 1 | medium | `worklog.md § Step 5 — the repairs, grouped by target file` | **`0279` has no row in that table at all** — no `+N / −0` proof, no scope quote, no evidence of its own six verification steps — although it is on the close list and edited three files. The brief's verification step 4 asks for a diff proof run as a command *"on every edited record"*, and `0279`'s own verification step 1 requires the two landed fragments *"quoted side by side … ⛔ Not 'I edited both'; **show both**"*. ⭐ The repair itself is correct — I verified it independently: both homes edited, gloss byte-for-byte identical to `0268`'s landed text in `task-status-vocabulary.md`, that file untouched, no marker token changed, exactly the three allowed paths, and `npm run generate:manifest` re-run by me reproduces `claude/structure-manifest.tsv` byte-identically. |
| R4 | 1 | medium | `plan.md § OWNER RULINGS`, ruling **L3**, vs `worklog.md § Step 1 — frozen membership`, the `0279` row | Ruling L3 says ⛔ *"The homes are **glossed separately and adapted**, never byte-copied"*. Measured: the two added blocks are **byte-identical** (same md5 over the extracted `+` lines). ⭐ **The byte-copy is the CORRECT act** — `0279`'s own brief requires it: *"The gloss should therefore land **textually identical** in both — this file's parity exception is about its *header framing*, not this table"*, and *"Add the textually identical gloss to the scaffold copy."* So an owner ruling and a member brief genuinely conflict and the coder resolved it in the member brief's favour, which is what *"a sweep does not relax a member's scope"* demands. ⛔ **The defect is that the departure from an owner ruling is recorded nowhere** — not in the worklog, not in the hand-off. |
| R5 | 1 | medium | `0276`'s `brief.md`, the grep-hit adjudication table, the row for *"the tool says so on every run and never guesses"* | That row reads *"⚠️ **Judgement required.** … **Decide explicitly; record the verdict either way.**"*, and `0276`'s verification step 4 requires *"Every `grep -rn 'unresolved-plan-sprint'` hit has **exactly one recorded verdict**"*. The sentence is still present in ADR-041 and **no verdict for it appears anywhere in `worklog.md`** (grep for *"never guesses"* returns nothing there). `0276` nevertheless closes as `Done`, so a named verification step of an absorbed member is unmet at close. |
| R6 | 1 | low | `0327`'s `review.md § Corrections (record repair — task 0335)`, notes **B1**, **B2**, **B3** | `0335`'s brief requires *"**Every note states** that the corrected text is left byte-identical, carries the date, quotes the …"*. B1 carries a byte-identity statement but no date of its own; **B2 carries neither**; B3 carries a date but no byte-identity statement. Both are supplied **collectively** by the section preamble (*"added 2026-09-04 …"*, *"All three party sections above are left byte-identical"*), which is a reasonable form — but it is not the per-note form the member brief specifies, and the worklog does not name the substitution. A1–A4 and B4 are complete. |
| R7 | 1 | low | `0139`'s `review.md`, the `0146` note's clause *"⛔ **The *Why* clause and the *Re-raise only if* condition above are UNTOUCHED and byte-identical.**"* | Overstated about itself. The line carrying `· Why (structural): the menu reads a whole line, the CLI reads argv already split on whitespace,` was **removed and re-added** with the `·` separator reflowed onto it from the preceding line. The clause's *words* are byte-identical (verified whitespace-normalised, HEAD vs worktree); the *line* is not, so `git diff` shows a removal inside protected text. ⭐ `worklog.md`'s own Proof cell is more accurate than the shipped record — it says *"only the `·` separator reflowed"*. In a sweep whose whole subject is records that overstate, the record should carry the caveat the worklog carries. |
| R8 | 1 | low | `claude/skills/fkit-task-brief/SKILL.md:343`, the added clause *"`candidate file="…" identity="unresolved"` line the briefing must report"* | Stronger than the tool's own contract supports: `claude/skills/fkit-status/SKILL.md` mandates listing every `candidate` line **only** under `active none` (*"there is no eligible sprint plan. Say so, list every `candidate` line with its identity or `unresolved`, and stop"*); with an active sprint resolved it merely defines what the line means. ⭐ **Frontier-move, not a defect of this work** — the wording is **verbatim from `0276`'s own brief** as a required element, and honouring it is exactly what this task's central constraint demands. Recorded so a later sweep does not re-file the same sentence as a fresh defect. |

### ✅ Verified clean by my own pass — recorded so these are not re-checked next round

Independently reproduced, not accepted from the worklog:

- **CI re-measurement (`0281`, `0312`).** `gh run list --limit 300` → **33 runs, 29 success, 4 failure, all `push` to `main`**. Matches the landed text clause for clause. The brief's stale 16/15/1 was correctly not used.
- **The dashboard "before" run the coder skipped, and its substituted argument.** I ran the missing before-run against a pristine `git archive HEAD` extract. Both boards: **zero `drift` lines before and after**; `backlog.md`'s roll-up is identical (`total 204 · done 27 · backlog 128 · cancelled 2 · moved 47`); `sprint-7.md`'s only delta is the driver's own status flip. ⭐ **The argument holds** — no live board was written by the sweep.
- **The added-lines coordinate screen.** Reproduced: **0 hits** over the whole scoped diff on the deliberately over-broad `token:digits` pattern.
- **Link churn.** Reproduced number-for-number: **69 markdown links across 19 holding files** into the eighteen closing folders, and the per-member breakdown matches on all eighteen.
- **Both guards.** Citation guard: `total 166 = exempt 166 + residual 0` ✓ (`total` counts hits, not files, so appends inside exempt closed folders raise it — **not drift**). Link guard: `854 files, 3262 targets, 0 broken, 6 named-exempt` ✓, exemption set still exactly six.
- **`0299`'s count fence held at all three sites.** Verified whitespace-normalised, HEAD vs worktree: *"exactly **one** `sprint-*.md`"* (sprint-4), *"exactly one `sprint-*.md`"* (sprint-5), *"exactly one `sprint-*.md` (this board)"* (sprint-4) all survive verbatim; only the mechanism half changed, each with a dated ADR-041 aside stating *"The count above is left unchanged."* ⚠️ **My first check read site 3 as absent — that was my own regex false negative, the same trap that nearly cancelled `0312`.**
- **The NUL member.** NUL count 1 → 0, size 20966 → 20967, `numstat 1 1`, no other line changed, **no correction note appended** (correct), and a repo-wide re-scan of every `.md` under `ai-agents/` finds **zero** remaining NUL bytes.
- **The manifest is genuine generator output, not hand-edited** (ruling L3): re-running `npm run generate:manifest` reproduces `claude/structure-manifest.tsv` byte-identically.
- **Scope proofs.** No task folder moved (no rename in `git status`); **no** `## Status` / `## Sprint` / `## Priority` / `## ID` / `## Owner` line changed on any absorbed brief; **zero** files modified under `ai-agents/wiki-vault/`.
- **Ruling L1's factual basis.** `0201` and `0192` are both still open under `ai-agents/tasks/backlog/`.
- **ADR statuses untouched.** ADR-003 `superseded`; ADR-010/020/032/037/038/041 all `accepted`.
- **`- **Corrections:**` bullets.** Added to ADR-003, ADR-032, ADR-037, ADR-038 and ADR-041 only. ⛔ **None added to `0238`'s closed brief** (`0318` forbids it) and none to ADR-010, where `0196` sanctions the exception but the coder took a continuation line under the existing bullet instead — a pure append, and its own worklog says so.
- **`0351` is comment-only.** All 6 removed and all 15 added lines in `test/prove-red.sh` begin with `#`; step `0i` and mutation 23 left byte-identical; `prove-red.sh` still 28/28.
- **`0170`'s third `byte-unchanged` hit** in `fkit-sprint-ship-loop/SKILL.md` is about `fkit-process-stateful-review` — a different subject — and is correctly left.

### Disproven — do not chase these

- **"The sweep added new banned-form coordinates into `ai-agents/sprints/done/`."** The citation guard's informational line 4 reports *"+6 residual across 2 files (the brief records +4; the cost has grown)"*. Measured HEAD vs worktree: the set of `ai-agents/…:NNN` coordinates under `sprints/done` and `sprints/reviews` is **identical before and after**. The growth predates this sweep.
- **"`0279`'s gloss is missing its date, claim and authority."** `0279`'s deliverable is a **gloss**, not a dated correction note — its `## What to build` is a four-step gloss and none of its six verification steps asks for a date. No defect.
- **"`0348`'s empty-diff fence is violated."** `0327`'s ledger is `+144 / −0` at sweep end because `0335` wrote into it lawfully afterwards. Ruling **L2** sequenced them and the proof is a per-member snapshot. Correctly reported as such.

### Re-litigates settled decisions (suppressed — NOT findings)

- **`architecture.md` §9.1 occurrence B left uncorrected, and the file therefore self-contradicting.** Owner-narrowed OUT, ruled 2026-09-04, option label verbatim **"File B as a follow-up (Rec)"**. ⛔ **Not a defect and not the coder's judgment.** ⚠️ **R1 above is a different object** — it is about the *close disposition* and the *unfiled follow-up*, not about the narrowing.
- **ADR-003's append-only form.** Ruled 2026-09-04, option label verbatim **"Append only — keep the precedent closed (Rec)"**; the hybrid in-place form was refused by name. ⛔ Not recommended here.
- **`0351`'s third site left untouched.** Ruling **L5**, option label verbatim **"Two ruled sites only; report the third (Rec)"**. ⛔ Not a miss.
- **`0201` out and still open.** Ruling **L1**. ⛔ Not an omission.
- **The vault re-ingest owed for the seven annotated ADRs.** Folded into Sweep C, ruled 2026-09-04, option label verbatim **"Fold into Sweep C (Rec)"**. ⛔ Not this sweep's gap.
- **`claude/structure-manifest.tsv` appearing in the diff.** Ruling **L3**. ⛔ Expected; verified as generator output.

## Coder response

<!-- CODER-OWNED (ADR-038). The reviewer never writes here. -->

**Round 1 dispositioned 2026-09-04.** Every finding was **re-verified against the artifact myself** and
its severity **derived from the blast radius I traced**, never inherited. ⛔ **Two of the reviewer's own
measurements were corrected in my favour and against it** — see R6 and R8.

⛔ **THIS SECTION DOES NOT CLOSE THE REVIEW.** Coverage for round 1 is **`Codex unavailable`** — ADR-042
D1's one genuinely degraded state. There was **no second opinion**: the model that reviewed this work is
the same model family that produced it, on a sweep where the suite proves almost nothing about the
content. Owner ruling **N4**, verbatim *"Re-run Codex after the reset, then close (Rec)"*, keeps this
ledger open pending that pass.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect (close disposition — documentary) | Re-verified: all three §9.1 clauses **PRESENT** (whitespace-normalised); **no** occurrence-B brief exists; my hand-off asked for none. Per owner ruling **N1**, `0312` **stays `Done`** (its ruled scope was occurrence A, which landed) and the hand-off now carries an explicit **⛔ PRODUCER FOLLOW-UP** block requiring the producer to file occurrence B **in the same act as the closes**, with scope and the `0251` conflict named. | `✅ done` |
| R2 | **CORRECT** | Defect (own record) | Measured `git diff --numstat` on the skill: **`5  3`**, not the `+6 / −4` my cell claimed. Cell corrected to **`+5 / −3`**. ⭐ I also re-measured **every other Diff cell** in that table against `numstat`; all others match. The repair itself was always correct — only the proof cell was wrong. | `✅ done` |
| R3 | **CORRECT** | Defect (own record) | Confirmed: my two `0279` rows sit in the **Step 1 membership** and **Step 2 claim** tables; the **Step 5 proof table had none**. Added `0279`'s row with measured proofs (`+3 / −0`, `+3 / −0`, `+1 / −0`), the twin-edit evidence, the untouched-paths proof and the manifest re-run. | `✅ done` |
| R4 | **CORRECT** | Defect (unrecorded departure) — the byte-copy itself is an intended tradeoff | Confirmed the conflict is real: ruling **L3** says *"never byte-copied"*; `0279`'s brief requires *"the textually identical gloss"*. Per owner ruling **N2**, **the member brief wins and the act stands**; the defect was that the departure was recorded nowhere. Recorded now as a full ***Accepted residual*** below (What / Why / Re-raise only if). | `✅ done` |
| R5 | **CORRECT** | Defect (a member's named verification step unmet) | Confirmed: zero occurrences of *"never guesses"* in my worklog; the sentence still present in ADR-041. Per owner ruling **N3** the step asks for a **recorded verdict**, not further repair. Verdict **derived by measurement** (two fresh fixture runs, both scenarios) and recorded in the worklog: **CORRECT AS-IS, no annotation warranted** — the sentence's subject is *the tool*, which does emit the `candidate … identity="unresolved"` line on every run, and it never names the board-mode drift channel `0276` corrects. | `✅ done` |
| R6 | **CORRECT — and worse than reported** | Defect (member-scope shortfall in shipped notes) | ⚠️ **The reviewer's own measurement was slightly wrong in my disfavour's opposite direction and I am correcting it against myself:** it recorded *"B3 carries a date"*. Measured: **B3 carried neither a date nor a byte-identity statement**; B1 had byte-identity only; B2 had neither. `0335` requires them **per note**. All three now carry both, stated in their own text rather than only in the section preamble. `review.md` still **`+144 / −0`** and all three party sections still **byte-identical**. | `✅ done` |
| R7 | **CORRECT** | Defect (a shipped record overstating about itself — this sweep's own subject) | Confirmed from the diff: the line carrying the Why clause **was removed and re-added**, the `·` separator having reflowed onto it. The clause's **words** are byte-identical (re-verified normalised, HEAD vs worktree); the **line** is not. The note now carries that qualification explicitly instead of the bare *"UNTOUCHED and byte-identical"*. | `✅ done` |
| R8 | **CORRECT** | ⭐ **Frontier-move — not a defect of this work** | Independently confirmed the contract: `fkit-status/SKILL.md` mandates listing every `candidate` line **only** under `active none`; the `candidate` bullet otherwise merely *defines* the line, and the *"your job is to report it"* mandate belongs to the **ambiguous-active-sprint** drift line, a different object. So *"the briefing must report"* is stronger than the contract for the active-sprint case. ⛔ **Not changed:** the wording is **verbatim from `0276`'s own brief** as a required element, and rewriting it would relax an absorbed member's scope — the one thing this sweep must not do. Recorded as an ***Accepted residual*** below. | `won't fix (frontier)` |

**Regression / oscillation check (Step 3.5).** Round 1 is the only round, so no finding re-litigates a
prior disposition and no oscillation is possible. ⛔ **No finding was suppressed as settled** — the
reviewer's own *Re-litigates settled decisions* list was checked and I agree with all six entries.
⚠️ **ADR-034 was skimmed and is genuinely in scope:** it directs that own-record defects be *recorded as
residuals rather than drive another round*. R2 and R3 are own-record. ⭐ **I fixed them rather than
residual-ising them** — ADR-034 bars a *loop* over own-record trivia, not a one-edit correction of a
demonstrably false number while the file is already open. Recording a known-false proof cell as a
residual, in a sweep whose entire subject is records that overstate, would have been the wrong call.

**Coverage of these fixes, stated plainly.** `npm test` and both guards were re-run after them and are
green — ⛔ **and that proves almost nothing about R1 and R4–R8**, which are wording, disposition and
record-accuracy findings no test reads. **R2, R3, R6 and R7 were each verified by a command whose output
is recorded in the worklog.**

## Accepted residuals (shared, do-not-re-litigate)

- **`0279`'s two convention homes are byte-identical, departing from ruling L3 (R4)** *(owner ruling
  **N2**, 2026-09-04, verbatim option label "Record as accepted residual: the member brief wins (Rec)")*
  — **What:** the gloss added to `ai-agents/knowledge-base/conventions/status-report-format.md` and to
  its `claude/scaffold/` twin is **byte-identical**, while the approved plan's ruling **L3** says the
  homes are *"glossed separately and adapted, never byte-copied"*. · **Why (structural):** `0279`'s own
  brief requires the opposite in terms — *"The gloss should therefore land **textually identical** in
  both — this file's parity exception is about its *header framing*, not this table"* — and *"Add the
  **textually identical** gloss to the scaffold copy."* The surrounding table text is identical in both
  homes, so there is no audience difference for the gloss to adapt to, and inventing one would make the
  two homes disagree about what `N` means. **The member brief wins**, per the sweep's own constraint that
  a sweep never relaxes an absorbed member's scope. L3's operative instruction — *edit both homes and
  regenerate the manifest* — was followed exactly; only its *"never byte-copied"* clause is departed
  from, and the twin edit was made deliberately in each home and **checked by hand**, because the
  dual-home parity test **skips this path** (`kind: 'audience-adapted'`), so nothing else verifies it.
  · **Re-raise only if:** the two homes' surrounding table text ever genuinely diverges by audience, at
  which point the gloss should be adapted per home rather than copied; **or** the parity exception for
  this file is removed, making the automated comparison live again.

- **`fkit-task-brief/SKILL.md` says the briefing "must report" the `candidate … identity="unresolved"`
  line (R8)** — **What:** the clause added under `0276` states the stray board *"shows up on **every**
  status run as a `candidate file="…" identity="unresolved"` line **the briefing must report**"*.
  Measured, `claude/skills/fkit-status/SKILL.md` mandates listing every `candidate` line **only** under
  `active none`; with an active sprint resolved, the `candidate` bullet merely defines what the line
  means. So *"must report"* is stronger than the contract for that branch. ⭐ **The tool half is true** —
  the line is emitted on every run, verified in both scenarios. · **Why (structural):** the wording is
  **verbatim from `0276`'s brief**, which lists it as a required element of the corrected statement.
  Rewriting it would relax an absorbed member's scope — the single thing this sweep is built not to do —
  and the sentence's conclusion (*"neither case is a licence to write one"*) is unaffected either way.
  ⛔ **Recorded so a later sweep does not re-file the same sentence as a fresh defect.**
  · **Re-raise only if:** `fkit-status/SKILL.md`'s reporting contract is widened to mandate candidate
  lines under an active sprint (which would make the clause simply true); **or** a reader is shown to
  have acted on the clause and expected a briefing that never came.
