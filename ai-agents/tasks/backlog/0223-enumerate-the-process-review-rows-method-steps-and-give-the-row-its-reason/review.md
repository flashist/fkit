# Review — 0223

Task: `ai-agents/tasks/backlog/0223-enumerate-the-process-review-rows-method-steps-and-give-the-row-its-reason/brief.md`
File(s) under review: `claude/skills/fkit-sprint-ship-loop/SKILL.md:126` (the §2 step table's **Process
review** row — cells 2 and 3), working tree vs `HEAD` `c45ec3d` (`git diff --numstat` = `1 1`)
Status: in-review

**Round 1 verdict:** ⚠️ **Changes requested — 4 defects (none blocking).** Reviewers run: reviewer's
own pass + Codex (`codex-cli 0.145.0`, `--sandbox read-only` → reasoning-only coverage, ADR-042 D1 —
the normal state, not a degradation event). Coverage complete.

**The headline answer — does the enumeration faithfully match the skill, step by step?** **Steps 0, 1,
2, 3, 3.5 and 5: yes.** **Steps 4, 6 and 7: not fully** — all three defects sit on the *Status
vocabulary* axis, which is the exact axis `0195` failed on and which the row itself cites as the
failure it prevents.

**Round 2 verdict:** ⚠️ **Changes requested — 1 defect (low; none blocking).** Reviewers run:
reviewer's own pass + Codex (`--sandbox read-only` → reasoning-only coverage, ADR-042 D1 — the normal
state, not a degradation event). **Coverage complete — no reviewer skipped.**

**R1–R4 are all closed**, each verified first-hand against `fkit-process-stateful-review/SKILL.md`,
not against the *Coder response* row's description of it. **The `pending approval` = 1 occurrence does
NOT reimpose the per-round gate** — it is a listing entry under an explicit negation, and it removes a
real hazard rather than creating one (detail in the Round 2 working record). **One new low finding
(R5)** — the enumeration carries every step's action but drops one load-bearing qualifier from Steps
3, 3.5 and 6. Not a regression: the pre-change row was weaker on the same axis.

**Round 3 verdict:** ⚠️ **Changes requested — 1 defect (medium; not blocking).** Reviewers run:
reviewer's own pass + Codex (`codex-cli 0.145.0`, `--sandbox read-only` → reasoning-only coverage,
ADR-042 D1 — the normal state, **not** a degradation event). **Coverage complete — no reviewer
skipped.** A design-intent consult was sent to `@fkit-architect` (hop 1 of 2) but **had not returned
when these findings were written — nothing in this round rests on it** (see *Correction* in the
round-3 working record).

**R5 is closed on all three sub-findings** (Steps 3, 3.5, 6), each re-read against its source line
first-hand. **No neighbour broke** — all nine steps re-read, plus every R1–R4 clause, both `0204`
anchors, the ADR-038 reason clause, the OQ-1(A) bridge and the `pending approval` disclaimer. **One new
medium finding (R6)**, and it is **not** in the R5 change: Step 6's enumerated *closeout condition*
adds a term (`done`) that its cited source does not have. ⚠️ **That clause entered in ROUND 1 and I
passed it in round 2 — my miss, not a round-3 regression.** The reason it was missed is
methodological and worth naming: **round 2's fidelity sweep checked every step for *omissions* and
never for *additions*.** R6 is a defect in the **work product** itself, so under
[ADR-034](../../../knowledge-base/decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md)
it **blocks closeout and drives another round** — see the round-3 convergence call for why I am not
calling this converged despite three rounds on one line.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `claude/skills/fkit-sprint-ship-loop/SKILL.md:126` | Step 6 is enumerated as "set **each** row's Action to what you actually did and its Status to `✅ done`" — unconditional across all rows. It contradicts the skill inside its own sentence: `fkit-process-stateful-review/SKILL.md:203-205` says a confirmed intended tradeoff's row gets Status **`won't fix (frontier)`**, yet the row tells the worker to add that residual entry *and* set the status to `✅ done`. It also drops `:202`'s alternative (`blocked` with the reason if you couldn't complete it), and would have the worker overwrite `disproven` / `closeout (re-litigation)` rows set at Step 4. The new bridge clause (*"an authorized fix lands at Status `✅ done` in the same round"*) compounds it by reinforcing `✅ done` as the sole landing status. Raised by both reviewers. |
| R2 | 1 | medium | `claude/skills/fkit-sprint-ship-loop/SKILL.md:126` | Step 4 orders the worker to take the status "**from the skill's prescribed Status vocabulary**, not ad-hoc labels" but the row never states that vocabulary. Of the six values at `fkit-process-stateful-review/SKILL.md:85`, only `✅ done` appears on the row (2×), plus the bare word `closeout` (1×); `won't fix (frontier)`, `disproven`, `closeout (re-litigation)` and `blocked` occur **0 times**. The row also drops `:175-176`'s mappings (INCORRECT → `disproven` / Action `none`; a retained frontier-move → `won't fix (frontier)`) and `:128`'s prescribed `closeout (re-litigation)` + "point at the residual or ADR by name" + "do not re-fix". A worker who works from the row — the premise this enumeration exists on — cannot obey the instruction the row gives. Raised by both reviewers. |
| R3 | 1 | low | `claude/skills/fkit-sprint-ship-loop/SKILL.md:126` | Step 7 is enumerated in name only — "**7** — final report" — conveying nothing a worker would execute. `fkit-process-stateful-review/SKILL.md:214-222` prescribes its contents: findings dispositioned, code changed + how tested + result, the *Coder response* rows written, any newly-recorded residual, the document's new Status, anything flagged, the reminder that the skill made no commit, and the evidence-before-assertion caution against asserting commit state. Naming a step without saying what it contains is the failure mode the row exists to close. Partly covered elsewhere by the loop's `DONE {result, changeSurface?, evidence?}` envelope (`fkit-sprint-ship-loop/SKILL.md:268`) and its no-commit rule (`:407`), which is why this is low and not medium. Raised by Codex. |
| R4 | 1 | low | `claude/skills/fkit-sprint-ship-loop/SKILL.md:126` | "**Never edit the *Reviewer findings* section**" is stated absolutely, while the row's own Step 0 says "open **or create** `<task-folder>/review.md`". The skill's create path seeds that section (`fkit-process-stateful-review/SKILL.md:103-104`) and Step 1 requires appending pasted findings to it, noted as seeded on the reviewer's behalf (`:119-120`). So the row instructs creating a ledger it then forbids populating. Near-unreachable in-loop — the **Review** step (`:125`) always writes the section first — which is why this is low, not medium. Raised by Codex. |
| R5 | 2 | low | `claude/skills/fkit-sprint-ship-loop/SKILL.md:126` | The enumeration carries every step's **action** but drops one **load-bearing qualifier** from three of them. **Step 3** omits `fkit-process-stateful-review/SKILL.md:137-138`'s *"with enough surrounding context to understand the full flow — **not just the cited line**"* — the row says only "verify each against the actual code at `file:line`", which reads as licensing exactly the cited-line-only verification the source forbids; it also drops `:143-146`'s "trace the full flow — the real blast radius may be far smaller than the label", leaving "derive severity yourself" without its method. **Step 3.5** omits `:162-163`'s *"a genuine **new defect** in round 3+ MUST still be acted on; stop on the nature of the finding, not the count"*. **Step 6** omits `:198-200`'s *"minimal, idiomatic fix (smallest correct change; match surrounding style; no unrelated refactors); add/update tests and run the relevant tests / linter / build; if you can't run them, say so"* — the row's Step 6 covers only the ledger-update half and presupposes the apply half, which the row states later under "Then:". Severity **low**, not medium: the row does mandate reading the actual code; the loop covers the test-running half at `:124` (Verify) and `:256` ("the driver re-verifies after any fix the worker writes"), and bounds fix breadth via the gate column ("broad/behavior-changing, or out-of-plan fix" → stop). **Not a regression** — the pre-change row said only "verify each finding", so the change is a strict improvement on this axis. Raised by Codex (Steps 3, 6); Step 3.5 added by the reviewer. |
| R6 | 3 | medium | `claude/skills/fkit-sprint-ship-loop/SKILL.md:126` | **Step 6's enumerated closeout condition adds a term its cited source does not have, in the permissive direction.** Source, `fkit-process-stateful-review/SKILL.md:206-207`: *"If all novel findings are **closeout / disproven / accepted** and nothing blocking remains, set the document header **Status: closed-out**."* The row: *"Set the document header **Status: closed-out** once every novel finding is **done** / closeout / disproven / accepted and nothing blocking remains."* `done` (Status `✅ done`) is **not** in the source's list. **Why the extra term is load-bearing here and not cosmetic:** the three source terms — `closeout`, `disproven`, `accepted` — are exactly the dispositions that **change no code**, so they are safe for the responder to self-certify; `✅ done` is the one that **does** change the deliverable, which is why it needs the other party's eyes. In this loop the standing approval makes a verified-`CORRECT` fix land `✅ done` **in the same round**, so adding `done` tells the Process-review worker to declare the review of **his own just-applied, unreviewed fix** finished — collapsing the two-party round-trip the ledger exists to provide. For a **document** deliverable this has no downstream catch at all: the driver's re-verify (`fkit-sprint-ship-loop/SKILL.md:256`) re-runs **tests**, and per **AR-2** no test asserts this row's content. **ADR-034 does not rescue it** — it redefines the *surface* ("the swept **work product** must be clean"), not the term list, quoting the same three terms at `adr-034:19-20`, and it assigns the work-product-clean call to *"the **reviewer**, who owns the findings section"* (`adr-034:124`). **It collides with a settled owner ruling:** ADR-034 §Options considered rejected *"record the bar as a step inside `fkit-sprint-ship-loop`'s SKILL"* — the driver's proposal; **the owner took the reviewer's side** (`adr-034:88-94`) because it is *"a cross-role decision about when review ends, not a step in one skill's procedure"*. This clause does the rejected thing **and states a different bar**. **Out of plan:** the plan's step-4 replacement text (`plan.md:154`) contains **no `Status: closed-out` clause at all** — grepped this round; `plan.md:45` records `:207` only as a citation-anchor **KEEP** check, not as wording to reproduce. The whole close sentence, term list included, was authored at implementation time. **Live evidence the divergence changes behavior:** the row's own author declined to close out twice on the source's reading (*"Closing out would be the author declaring the review of his own fixes finished"* — `worklog.md:388-391`, `:503-505`; this ledger `:56`, `:79-80`). A worker reading only the row would have closed out. ⚠️ **NOT a round-3 regression and NOT caused by the R5 fix** — `git show HEAD:claude/skills/fkit-sprint-ship-loop/SKILL.md` line 126 contains `closed-out` **0** times; the whole clause entered in **round 1**'s R1 rewrite and round 2 passed it. **My miss.** ⚠️ **Cost of the one-word fix — CORRECTED after re-checking; weaker than an earlier draft of this row claimed.** Deleting `done /` restores fidelity, and the sprint loop's step table does run Review (`:125`) → Process review (`:126`) → Close (`:127`) with **no step that re-spawns Review**, so under the restored narrow bar a round in which any fix lands can never reach `closed-out` through this loop. **But it is NOT an undefined dead end, as I first wrote:** `fkit-sprint-ship-loop/SKILL.md:345` defines the terminal state *"**Blocked — review non-convergence** · review oscillation on a task · `🚧 Blocked — review not converging`; skip/stop; report"*. The real cost is therefore **such tasks route to blocked instead of closing** — a defined, visible, non-shipping outcome. (`fkit-task-ship-loop/SKILL.md:266` — *"ledger closed-out **and** last verify green"* — is verified but governs the **coder's** loop, not this one; an earlier draft leaned on it too heavily.) Whether to accept that routing, or give the loop an explicit re-Review round, is **out of `0223`'s scope** and the **owner's** call. Raised by the reviewer's own pass; **Codex did not find it**. ⚠️ **Provenance correction:** an `@fkit-architect` consult was sent but **had not returned** when this row was first written, and an earlier draft wrongly attributed corroboration to it. **Every citation in this row is the reviewer's own first-hand read**, re-verified after the error was caught. |

## Coder response

*(coder-owned — `fkit-process-stateful-review` writes this section)*

**Round 1 — all four verified first-hand against the code before any edit; all four CORRECT, all four
defects, all four severities agreed. Fixed in one pass on the single line, under the sprint loop's
standing approval (owner-ruled 2026-08-24: R1+R2 "Fix now", R3+R4 "Fold into the same pass").**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** (severity **medium** — agreed) | Defect | Rewrote Step 6 to map three outcomes **distinctly** instead of one unconditional `✅ done`: `✅ done` for an applied fix, `blocked` **plus the reason** for one that could not be completed, `won't fix (frontier)` for a confirmed intended tradeoff (which also earns the *Accepted residuals* entry, in full **What / Why (structural) / Re-raise only if** shape). Added the non-overwrite guard — *"Leave the `disproven` and `closeout (re-litigation)` rows exactly as Step 4 set them — this step revisits only the rows you acted on."* Verified against `fkit-process-stateful-review/SKILL.md:201-205`. The OQ-1 bridge is untouched and does not compound it: it is scoped to *an authorized fix*, which correctly lands `✅ done`. | `✅ done` |
| R2 | **CORRECT** (severity **medium** — agreed; if anything understated, see note) | Defect | Step 4 now **states the vocabulary it orders the worker to use**: all six values from `fkit-process-stateful-review/SKILL.md:85` listed verbatim, plus the mappings the row had dropped — INCORRECT → `disproven` / Action `none` (`:175-176`); a retained frontier-move → `won't fix (frontier)` (`:176`); a Step-2 re-litigation → `closeout (re-litigation)`, **naming the residual or ADR that settles it**, and **do not re-fix it** (`:126-130`). Measured after the fix, all six now appear on `:126` (`pending approval` 1 · `✅ done` 3 · `won't fix (frontier)` 3 · `disproven` 4 · `closeout (re-litigation)` 3 · `blocked` 2), against 1 verbatim before. **Note, strengthening not disputing the finding:** the reviewer counted 2 of 6 present pre-fix by counting the bare word `closeout`; that occurrence is Step 2's **Verdict** word, not the Status value `closeout (re-litigation)`, so the true pre-fix count was **1 of 6**. | `✅ done` |
| R3 | **CORRECT** (severity **low** — agreed) | Defect | Step 7 given its contents from `fkit-process-stateful-review/SKILL.md:214-222`: findings dispositioned this round, code changed (files, how tested, result), the *Coder response* rows written, any newly-recorded residual, the document's new Status, and anything flagged — plus *"noting that the method itself makes no commit, and **asserting no commit state you did not check this turn**"* (the evidence-before-assertion caution at `:220-222`). Low is right: the loop's `DONE {…}` envelope (`:268`) and no-commit rule (`:407`) already cover part of it. | `✅ done` |
| R4 | **CORRECT** (severity **low** — agreed) | Defect | The absolute *"Never edit the Reviewer findings section"* now carries the skill's own single exception, cited: seeding on creation (`fkit-process-stateful-review/SKILL.md:103-104`) or appending findings handed over as pasted text (`:119-120`), each noted as done on the reviewer's behalf — closed with *"In this loop the **Review** step has already written that section, so in practice you never touch it."* That preserves the rule's force where it bites while removing the create-then-forbid-populating contradiction. | `✅ done` |

**Not closed out.** The document header stays `Status: in-review`. `fkit-process-stateful-review`'s
Step 6 closes out when every novel finding is `closeout` / `disproven` / **accepted** — these four are
`✅ done` (**fixed**), which that condition does not name, and the fixes have not themselves been
reviewed. Closing out here would be the author declaring the review of his own fixes finished.

**Round 2 — R5 re-derived first-hand from `fkit-process-stateful-review/SKILL.md` (the source lines
read directly, not taken from the finding's quotation) and checked against what `:126` actually said
before the edit. CORRECT, defect, severity `low` agreed. Fixed in one pass on the same single line,
under the sprint loop's standing approval (owner-ruled 2026-08-24, verbatim label "Fix now, same line
(Recommended)": add all three dropped clauses).**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R5 | **CORRECT** (severity **low** — agreed) | Defect | All three qualifiers restored on `:126`, each re-read at source first. **Step 3** — the pre-edit text was *"verify each against the actual code at `file:line`, deriving severity yourself, never inheriting the reviewer's label"*; `file:line` with no scope qualifier does read as licensing the cited-line-only verification `fkit-process-stateful-review/SKILL.md:137-138` forbids, and "derive severity yourself" stood without the method `:143-147` gives it. Now reads *"verify each against the actual code at `file:line`, reading **enough surrounding context to understand the full flow, not just the cited line**, and **deriving severity yourself from the blast radius you traced, never inheriting the reviewer's label**"*. This is the sub-finding that matters: a wrong `disproven` has no downstream catch — the driver re-verifies fixes, not disproofs. **Step 3.5** — `:162-163`'s round-budget clause was absent verbatim and in substance; added *"— a round budget is a proxy, not the rule, so **a genuine new defect in round 3+ MUST still be acted on: stop on the *nature* of the finding, not the count**"*. **Step 6** — confirmed the pre-edit Step 6 opened at *"set each row's Action to what you actually did"*, i.e. the ledger-update half only, with `:198-200`'s apply discipline nowhere on the row; Step 7's *"code changed (files, how tested, result)"* asks the worker to **report** testing but never instructs it, so the overlap does not discharge the finding. Step 6 now opens *"apply the **minimal, idiomatic fix** for each (smallest correct change; match surrounding style; no unrelated refactors), **add/update tests and run the relevant tests / linter / build — or say plainly you could not**; then set each row's Action…"*. Severity `low` agreed and independently reached: the row already mandated reading real code, the loop's **Verify** step (`:124`) and driver re-verification (`:256`) cover the test half, and the gate column bounds fix breadth — the row is a summary that names its source skill, which stays authoritative. Added ~70 words (the owner's "~40" was an estimate in the rationale, not a bound); the cell remains ragged, as accepted. | `✅ done` |

**Constraint checks re-run after the edit** — `wc -l` **414** (unchanged: the line grew in width, not
count; `git diff --numstat` = `1 1`, single hunk `@@ -126 +126 @@`). `:205` and `:248` (`0204`'s
anchors) both re-asserted present and unmoved. `:151-249` untouched — outside the only hunk. Row
integrity: 5 pipes / 4 cells, no literal `|` added. All nine step tokens present exactly once; all six
Status values still present; `wait for` / `explicit approval` / `Once I` / `approve specific` all **0**;
`pending approval` exactly **1** (not removed, not duplicated). R1–R4's clauses all re-asserted intact
— no neighbour broken. `node --test test/*.test.js` **747/747, fail 0**; `bash test/prove-red.sh`
**22/22 red, hard gate PASSED**, mutation 9 observed individually `red`.
**No red-first test exists for this row's content and none was manufactured — that check is `0225`'s
(see AR-2). The suites prove not-broken; the source-line re-reading above is what proves correct.**

**Still not closed out.** Header stays `Status: in-review` — R5 is `✅ done` (**fixed**), which
Step 6's closeout condition does not name, and this fix has not itself been reviewed.

**No third residual.** R5 was a fidelity defect in the copy, not a tradeoff: its fix has no cost worth
recording, and the standing structural risks it touches are already held by **AR-1** (the row is a
prose control, not prevention) and **AR-2** (the enumeration drifts silently if the skill changes) —
both of which cover it exactly. Nothing added below.

## Accepted residuals (shared, do-not-re-litigate)

*(Both recorded under the owner's 2026-08-24 ruling — verbatim label **"Record both formally
(Recommended)"**. Neither is a defect; both are structural properties of the chosen design.)*

**AR-1 — The enumerated row is a prose control, not prevention.**

- **What:** `claude/skills/fkit-sprint-ship-loop/SKILL.md:126` makes a partial application of the
  `fkit-process-stateful-review` method *visible* to a driver or worker who **reads** the row. It makes
  nothing *impossible*. A worker who does not read it can still skip steps exactly as `0195` did.
- **Why (structural):** the loop table is documentation; a document cannot enforce itself. This is the
  tradeoff ADR-038 §*Accepted tradeoff* takes deliberately, and `0223`'s scope is the enumeration and
  the reason clause — not a detector. **Detection is `0224`'s task** (the misroute detector: hook denial
  log + a mandatory `**Role:**` line per worklog round).
- **Re-raise only if:** `0224` ships and its detector still cannot observe a skipped step, **or** a
  post-`0223` loop run is found to have skipped a step *despite* the row being read.

**AR-2 — The enumeration drifts silently if the skill it summarizes changes.**

- **What:** the row restates the nine steps, the six-value Status vocabulary, and the Step 4 / Step 6
  mappings of `claude/skills/fkit-process-stateful-review/SKILL.md`. Nothing checks the two stay in
  agreement. If that skill changes, the row becomes wrong without any signal.
- **Why (structural):** the two files have no mechanical link — the copy is prose, and no test asserts
  this row's content. ADR-032 keeps `fkit-process-stateful-review/SKILL.md` byte-unchanged, so the risk
  is low **today**, but the guard is the ADR, not a check. Writing the check is **`0225`'s task** (the
  loop-table row↔ownership test, filed in ADR-038 §Consequences); building it inside `0223` would be
  doing another task's work.
- **Re-raise only if:** ADR-032's byte-unchanged constraint on `fkit-process-stateful-review/SKILL.md`
  is lifted or that file changes, **and** `0225` has not yet landed a check that catches the drift.

---

## Round 1 — reviewer's working record

### Re-litigates settled decisions (suppressed)

None. This is Round 1; the ledger had no prior rows and no accepted residuals. The items below were
excluded from the pass as already settled, and are recorded here so they are not rediscovered:

- **No red-first test.** No test asserts this row's content; writing one is `0225`'s task
  (ADR-038 §Consequences). Not a gap this task should have closed.
- **Prose control, not prevention.** ADR-038 §*Accepted tradeoff*; detection is `0224`'s.
- **Silent drift if the skill changes.** `0225`'s territory.
- **Ragged cell-2 column** vs the other five rows — owner-ruled OQ-2(A).
- **The `✅ done` bridge's inch of scope** beyond enumerate-the-steps — owner-ruled OQ-1(A).
- **The word "method"** kept over `run /fkit-process-stateful-review` — settled ADR-019 / ADR-032.
- **`:225-229`'s pointer-only-refusal prose** — knowingly false pending `0333`.
- **`0224` also edits `:126`** — sequencing.

### Raised and disproven (no row written; do not chase)

- **Codex: "Step 0 drops canonical ledger-key resolution / the stop-on-ambiguity rule."**
  **INCORRECT.** The row pins the path directly — `<task-folder>/review.md` — which is *stronger* than
  running the four-rule resolution. `fkit-sprint-ship-loop/SKILL.md:83`'s ambiguity warning is aimed at
  the **Review** row (`:125`), which "passes no task-id"; it does not apply to this row.
- **Codex: "Step 5 omits the what-requires-a-code-change inventory and the act-vs-closeout
  recommendation."** **INCOMPLETE, not recorded.** The row's own trailing clause already requires
  "return change surface + residuals", and "convergence call" is a defined term in this codebase
  carrying act-vs-closeout with the reason. Negligible.

### Verified clean

- **The three gate clauses are absent in substance**, not merely by keyword. Measured on `:126`:
  `pending approval` 0 · `wait for` 0 · `explicit approval` 0 · `Once I` 0 · `approve specific` 0. No
  paraphrase reimposes the per-round owner gate at `:174` / `:191` / `:197`. Both reviewers agree.
- **The bridge does not contradict the skill and licenses nothing beyond ADR-019 / ADR-032.**
  `✅ done` is the skill's own applied-fix status (`:201`); the standing-approval model is stated at
  `fkit-sprint-ship-loop/SKILL.md:253-256`; the clause is bounded by "verified-`CORRECT`,
  in-approved-plan" and by the row's gate column. Its only problem is R1's over-broad reach.
- **ADR-038 fidelity: the reason clause mirrors the ADR's wording, near-verbatim.** ADR-038 `:41-45`
  → both grounds present (coder-owned *Coder response* section; Step 6 applies code fixes), the
  `SKILL.md:195` citation is exactly Step 6's header, "Neither changes when the deliverable is a
  document rather than code" tracks the ADR's closing sentence, and the relative link resolves. (One
  wording note, below the bar for a row: ADR-038 says "applies **approved** code fixes"; the row says
  "applies code fixes" — consistent with the loop's standing-approval model, not a drift.)
- **Steps 0, 1, 2, 3, 3.5, 5 are faithful.** Step 2's polarity is correct (an **unmet** *"Re-raise only
  if"* → `closeout`); Step 3 keeps the load-bearing "derive severity yourself, never inherit the
  reviewer's label"; Step 3.5 keeps both the classification and the regression/oscillation check
  against prior rounds.
- **Table integrity.** `:126` has exactly 5 pipes / 4 cells; rows `:120-127` are all 5 pipes; no
  literal `|` inside any cell. (The frontmatter suite would not have caught a broken table — checked
  by hand.)
- **`0204`'s five sites did not move.** `wc -l` = **414**, unchanged; anchors verified independently at
  `:205` (*"there are FIVE, not the two most visible"*) and `:248` (*"until `0204`'s carry-check hook
  lands, nothing does"*). `git diff` against `c45ec3d` on this path shows exactly **2** changed content
  lines — one removed, one added.
- **`run /fkit-process-stateful-review`** occurs 0 times in the file and 0 times under `claude/`.
- **Suites, re-run by the reviewer.** `node --test test/*.test.js` → **747 pass / 0 fail**.
  `bash test/prove-red.sh` → **22/22 red, hard gate PASSED**.

### Convergence call

**Act, do not close out.** Round 1: zero re-litigation, four novel defects, all confined to the single
line under review. R1 and R2 are the same root cause — the enumeration preserves each step's *actions*
but not its *status mappings* — and they sit on the one axis the row's own `0195` warning names
("used none of Step 4's prescribed Status values"). Landing them is a wording change to one line, with
no reach beyond it. R3 and R4 are optional polish on the same line and cost nothing extra if taken in
the same pass.

**Regression check:** none of the four recommended directions recreates a condition any prior finding
flagged, and none of them touches the gate excision, the "method" wording, or `0204`'s five sites.

---

## Round 2 — reviewer's working record

Scope unchanged: `claude/skills/fkit-sprint-ship-loop/SKILL.md:126`, working tree vs `HEAD`. The four
round-1 fixes landed in **one physical line** — `git diff --numstat` on this path = **1 1**,
`git diff --stat` = 1 file, 1 insertion, 1 deletion. Everything else in the file is byte-unchanged by
construction, which is what discharges the `:151-249` / `0204`-anchor constraints below.

### R1–R4 — each verified closed against the skill itself

- **R1 — closed.** Step 6 now maps by outcome: `✅ done` for an applied fix · `blocked` **plus the
  reason** for one not completed (`fkit-process-stateful-review/SKILL.md:201-202`) · `won't fix
  (frontier)` for a confirmed intended tradeoff, which also earns the residual entry in full What /
  Why (structural) / Re-raise-only-if shape (`:203-205`). The unconditional `✅ done` is gone.
  **The non-overwrite guard is correct.** The source does not state it in those words, but it follows
  directly: Step 6 acts "once I explicitly approve **specific** findings" and updates "the *Coder
  response* row" for those (`:197-201`), and `:210` says INCORRECT findings get no code change. So
  *"leave the `disproven` and `closeout (re-litigation)` rows exactly as Step 4 set them — this step
  revisits only the rows you acted on"* is a faithful inference, not an invention. It is the precise
  antidote to R1's over-broad reach. The OQ-1 bridge is scoped to *an authorized fix* and no longer
  compounds anything.
- **R2 — closed.** All six values of `:85` now appear on `:126`, measured: `pending approval` 1 ·
  `✅ done` 3 · `won't fix (frontier)` 3 · `disproven` 4 · `closeout (re-litigation)` 3 · `blocked` 2.
  **All three mappings check out against the source, not against the coder's description of it:**
  INCORRECT → `disproven` / Action `none` (`:175`); a frontier-move recommended for keeping → `won't
  fix (frontier)` (`:175-176`); a Step-2 re-litigation → `closeout (re-litigation)`, naming the
  residual or ADR that settles it, and do not re-fix (`:128-130`).
- **R3 — closed.** Step 7's enumerated contents match `:216-222` element for element: findings
  dispositioned this round · code changed (files, how tested, result) · the *Coder response* rows
  written · any newly-recorded residual · the document's new Status · anything flagged · the no-commit
  note · the evidence-before-assertion caution. Nothing prescribed is missing.
- **R4 — closed, and the exception is accurate.** `:102-105` is the create path and says in terms
  *"seed **Reviewer findings** from whatever findings you were handed"*; `:119-120` says *"first append
  them as rows to **Reviewer findings** (that's seeding the reviewer's section on their behalf — note
  it)"*. Both citations are right. The closing sentence is **true**: the loop's **Review** row
  (`fkit-sprint-ship-loop/SKILL.md:125`) reads *"write the *Reviewer findings* ledger section"*, so
  in-loop that section is always already written.

### The `pending approval` = 1 judgement call — ruled: it does NOT reimpose the gate

The occurrence, verbatim: ``` `pending approval` ⛔ *(the one value this loop never uses: the standing
approval above has already replaced the per-round gate that produces it)* ``` followed, after the
other five, by *"so **five of the six apply here**."*

1. **It is a negation, not an instruction.** The gate in the source skill is three **imperatives** —
   `:174` ("set Status = `pending approval`"), `:191` ("wait for my explicit approval before changing
   any code"), `:197` ("Once I explicitly approve specific findings"). The row reproduces **none** of
   them; measured on `:126`: `wait for` 0 · `explicit approval` 0 · `Once I` 0 · `approve specific` 0.
   Nor does any paraphrase reimpose it — the row's only stop is the gate column's `NEEDS-DECISION` for
   **judgment calls**, which is narrower than a per-round gate and predates this change.
2. **Omitting would have been strictly worse.** The plan's §5 risk 3 — a worker parking an in-plan
   verified-`CORRECT` fix at `pending approval` and stalling a loop premised on standing approval — is
   only closed by *naming* the value and forbidding it. A worker who never sees the word can still
   invent it from the source skill they are told to apply.
3. **Nothing is lost by forbidding it.** I checked the one case where `pending approval` would be the
   semantically exact value — a judgment call the worker cannot decide. The loop routes that
   **structurally** instead, via the `NEEDS-DECISION` envelope (`:265-271`, `:275`), which returns
   control before the round ends; if the round does end with it open, Step 6's `blocked` **plus the
   reason** carries the same information. So *"the one value this loop never uses"* is true as stated.
4. **1 is inside the owner's "0 or 1" envelope**, on its face. The disclosed intermediate draft at 2
   was outside it and was tightened before this pass; I measured the file on disk, not the draft.

### Enumeration fidelity — all nine steps re-read, not only the three that changed

| Step | Faithful? | Note |
|---|---|---|
| 0 | ✅ | open-or-create, load residuals, skim ADRs, "Re-raise only if" binds like a residual (`:98-109`). |
| 1 | ✅ | novel = no *Coder response* row yet (`:113-117`). |
| 2 | ✅ | polarity correct — an **unmet** "Re-raise only if" → `closeout`; the naming and do-not-re-fix clauses are carried in Step 4's mapping (`:126-130`). |
| 3 | ⚠️ | action right, one qualifier dropped — **R5**. |
| 3.5 | ⚠️ | classification + regression/oscillation check both present; the round-budget-is-a-proxy rule dropped — **R5**. |
| 4 | ✅ | four verdicts + the full six-value Status vocabulary + all three mappings (`:167-176`). |
| 5 | ✅ | summary table, suppressed-as-settled, convergence call. (The code-change inventory is the round-1 INCOMPLETE below.) |
| 6 | ⚠️ | ledger-update half faithful and now correctly outcome-mapped; the apply-and-test half dropped from the step — **R5**. |
| 7 | ✅ | contents match `:216-222` element for element. |

**No fix broke a neighbour.** Steps 0, 1, 2, 3.5, 5 read identically to round 1; the rewrites of 4, 6
and 7 are additive and do not contradict any other step. The internal tension a reader might notice —
Step 4 says "exactly these six" and then "five of the six apply here" — is resolved by the negation
itself and is not a defect.

### Raised and disproven / suppressed this round (no row written; do not chase)

- **Codex: "Step 2/4 omits the prescribed Verdict `closeout` for re-litigation."** **INCORRECT as
  framed.** The row's Step 2 does say *"makes one `closeout`"*. More decisively, the alleged
  infidelity is the **source skill's own** structure: its Step 4 (`:169`) also lists only CORRECT /
  PARTIALLY CORRECT / INCORRECT / INCOMPLETE, and `closeout` appears only in its Step 2 (`:128`). The
  row mirrors that exactly. Fidelity is the test, and the row is faithful.
- **Codex: "Step 5 omits *what, if anything, requires a code change*."** **Already dispositioned in
  round 1** (see the round-1 record) as INCOMPLETE-not-recorded: the row's own trailing clause requires
  "return change surface + residuals". Codex adds nothing new. **Suppressed as prior-round** — the
  ledger's loop-prevention memory working as designed.
- **Codex's ordering complaint about the "Then:" clause** (that it places fix application after Step
  7) is **absorbed into R5 as the weaker half**, not carried separately: Step 6's own words — *"what
  you actually did"*, *"a fix **you applied**"* — force application first, so the ordering is
  self-correcting. What survives is the omission of `:198-200`'s minimal-fix/testing discipline.
- **The coder's correction to the reviewer's pre-fix count is ACCEPTED.** The bare word `closeout` is
  the **Verdict** at `fkit-process-stateful-review/SKILL.md:128`, not the Status value `closeout
  (re-litigation)`. True pre-fix count of the six Status values on the row: **1 of 6** (`✅ done`
  only). The round-1 R2 row already said as much in its own text; the "2 of 6" framing in the round-1
  reply prose was wrong and is corrected here.

### Verified clean (round 2, re-measured on disk)

- **Constraints all hold.** `wc -l` = **414**. `git diff --numstat` = `1 1`; `--stat` = 1 file / 1
  insertion / 1 deletion — so `:151-249` including `0333`'s prose at `:225-229` is byte-unchanged, and
  `0204`'s anchors verified in place at `:205` (*"there are FIVE, not the two most visible"*) and
  `:248` (*"until `0204`'s carry-check hook lands, nothing does"*).
- **Table integrity.** `:126` has exactly **5 pipes / 4 cells**; rows `:120-127` are all 5 pipes; no
  literal `|` inside any cell.
- **Cell 2 (OQ-2(A)) intact** — the ADR-038 role rationale, with the relative ADR link. **The OQ-1(A)
  bridge intact** — *"under that standing approval an authorized fix lands at Status `✅ done` in the
  same round"*.
- **`run /fkit-process-stateful-review`** still occurs 0 times on the row.
- **Suites re-run by the reviewer.** `node --test test/*.test.js` → **747 pass / 0 fail**.
  `bash test/prove-red.sh` → **22/22 red, hard gate PASSED**.
- **Round-1's mutation-9 gap is closed.** Mutation 9 (`test/prove-red.sh:542-574`, which de-indents a
  continuation line of **this file's** `description:` block scalar) printed **`red`** individually, and
  the `MUTATION WAS A NO-OP` message at `:559-564` did **not** print — that message is the alternative
  branch taken when `cmp -s` finds the file unchanged, so its absence proves the mutation applied.
  Both signals agree: the frontmatter suite genuinely covers this file, and this change did not disarm
  it. Confirmed.

### Convergence call

**Act on R5, or record it — but this is not a loop.** Round 2 surfaced **zero** re-litigation of the
two accepted residuals and **one** genuinely novel low finding on an axis neither round-1 finding
touched. R1–R4 are closed on first-hand evidence, so the round-1 work converged cleanly. R5 is not a
new species of problem — it is the same "the enumeration keeps the action, drops the qualifier" root
cause as R1/R2, one layer finer, and landing it is again a wording change to the same one line.

**It does not block.** No confirmed defect changes behavior, no suite fails, and the change is a
strict improvement over the pre-change row on every axis measured. R5 is equally defensible as a
**frontier-move** — a one-cell summary of a 239-line skill cannot carry every qualifier, and which
ones it carries is a judgement made once — which is why its disposition (fix vs record as a residual)
is the **owner's**, not the reviewer's.

**Status stays `in-review`** because R5 is open and undispositioned. Everything else is closeable.

---

## Round 3 — reviewer's working record

Scope unchanged: `claude/skills/fkit-sprint-ship-loop/SKILL.md:126`, working tree vs `HEAD`. **`HEAD` is
still `c45ec3d`** (re-checked this round; `git diff c45ec3d HEAD` on this path is empty), so the header's
base ref is current. `git diff --numstat` = **1 1**, single hunk `@@ -126 +126 @@`. All measurements
below were taken on disk this round, not carried forward.

### R5 — closed on all three sub-findings, each re-read at source first

| Sub-finding | Source | Restored wording | Verdict |
|---|---|---|---|
| **Step 3 — scope of verification** | `:137-138` *"read the actual code at the referenced location, with enough surrounding context to understand the full flow — not just the cited line"* | *"reading **enough surrounding context to understand the full flow, not just the cited line**"* | ✅ **Closed.** Near-verbatim; the "not just the cited line" negation — the load-bearing half — is carried intact. |
| **Step 3 — severity method** | `:143-147` *"Trace the full flow — the real blast radius may be far smaller than the label… Derive it from the blast radius you traced; never inherit the reviewer's label"* | *"**deriving severity yourself from the blast radius you traced, never inheriting the reviewer's label**"* | ✅ **Closed.** "From the blast radius you traced" supplies the method that "derive severity yourself" previously lacked. The dropped half (*"may be far smaller than the label"*) is rationale, not instruction. |
| **Step 3.5 — round budget** | `:162-163` *"A round budget is a proxy, not the rule: a genuine new defect in round 3+ MUST still be acted on; stop on the nature of the finding, not the count."* | *"a round budget is a proxy, not the rule, so **a genuine new defect in round 3+ MUST still be acted on: stop on the *nature* of the finding, not the count**"* | ✅ **Closed.** Verbatim in substance and near-verbatim in wording. |
| **Step 6 — apply discipline** | `:198-200` *"Apply the minimal, idiomatic fix for each approved finding (smallest correct change; match surrounding style; no unrelated refactors). Add/update tests and run the relevant tests / linter / build; if you can't run them, say so."* | *"apply the **minimal, idiomatic fix** for each (smallest correct change; match surrounding style; no unrelated refactors), **add/update tests and run the relevant tests / linter / build — or say plainly you could not**"* | ✅ **Closed.** The parenthetical is verbatim; the testing clause keeps both arms (do it, or say you could not). The dropped word *"approved"* is the deliberately excised per-round gate (ADR-019 / ADR-032), not a fidelity loss. |

**Does Step 3's restored clause actually close the hazard it was raised for?** The hazard was that
`file:line` with no scope qualifier licenses cited-line-only verification, which can produce a wrong
`disproven` — and a wrong `disproven` has no downstream catch, because the driver re-verifies **fixes**,
not **disproofs**. **Yes, it closes it.** The clause is imperative (*"reading enough surrounding context
to understand the full flow"*), it carries the source's explicit negation (*"not just the cited line"*),
and it now sits in the same clause as the severity method, so the worker cannot reach "derive severity
yourself" without first reading the scope instruction. **Confirmed first-hand this round:** it is the
clause that surfaced **R6** — R6 was found by reading `fkit-process-stateful-review/SKILL.md:206-207`
in full rather than the row's citation of it.

### Step 6's two halves — do they cohere?

**Yes.** They are chained *"…or say plainly you could not; **then** set each row's Action to what you
actually did"* — apply first, record second, which is the correct order and which also disposes of
round 2's Codex ordering complaint. The tail's *"by outcome, not uniformly"* mapping presupposes that
not every row gets a fix, and the non-overwrite guard says so outright (*"this step revisits only the
rows you acted on"*). The halves do not fight. **This is not a re-run of R1** — R1 was one sentence
conflating a residual entry with `✅ done`; here the two halves are sequenced, not conflated.

### Neighbour check — all nine steps re-read, not only the three that changed

| Step | Intact? | Evidence |
|---|---|---|
| 0 | ✅ | open-or-create, load residuals, skim `decisions/`, *"Re-raise only if"* binds like a residual (`:98-109`). Unchanged from round 2. |
| 1 | ✅ | novel = no *Coder response* row yet (`:115`). |
| 2 | ✅ | polarity correct — an **unmet** *"Re-raise only if"* → `closeout`; naming + do-not-re-fix carried in Step 4's mapping (`:126-131`). |
| 3 | ✅ | **R5 closed** — see table above. |
| 3.5 | ✅ | **R5 closed.** Classification + regression/oscillation check both still present alongside the new round-budget clause; nothing displaced. |
| 4 | ✅ | four verdicts (`:169`) + all six Status values in source order (`:85`) + all three mappings (`:175-176`, `:128-130`). **Measured on disk:** `pending approval` 1 · `✅ done` 3 · `won't fix (frontier)` 3 · `disproven` 4 · `closeout (re-litigation)` 3 · `blocked` 2. |
| 5 | ✅ | summary table · suppressed-as-settled · convergence call (`:184-189`). |
| 6 | ⚠️ | apply-discipline half **restored** and by-outcome mapping + non-overwrite guard **both intact** (verified verbatim against `:201-205`) — **but the closeout condition diverges: R6.** |
| 7 | ✅ | contents match `:216-222` element for element, including the no-commit note and the evidence-before-assertion caution. |

**Each item the round-3 brief named, re-verified individually on disk:**

- **R1's by-outcome mapping** — present verbatim (`✅ done` / `blocked` **plus the reason** / `won't fix
  (frontier)` + the residual entry in full What / Why (structural) / Re-raise-only-if shape). ✅
- **R1's non-overwrite guard** — *"Leave the `disproven` and `closeout (re-litigation)` rows exactly as
  Step 4 set them — this step revisits only the rows you acted on."* Present, unaltered. ✅
- **R2's six-value vocabulary and its three mappings** — all present; counts measured above. ✅
- **R3's Step 7 contents** — all eight elements present. ✅
- **R4's seeding exception** — present with both citations, which I re-read: `:102-105` is the create
  path (*"seed **Reviewer findings** from whatever findings you were handed"*) and `:119-120` the
  pasted-text append. Closing sentence still true. ✅
- **Cell 2's ADR-038 reason clause** — present; the relative link resolves to an existing file
  (checked); the `fkit-process-stateful-review/SKILL.md:195` citation is exactly Step 6's header
  (re-read). ✅
- **OQ-1(A)'s bridge** — *"under that standing approval an authorized fix lands at Status `✅ done` in
  the same round"*. Present, unaltered. ✅
- **The `pending approval` disclaimer** — present exactly once, under its explicit negation. ✅

**Constraints, all re-measured this round:** `wc -l` **414** · `git diff --numstat` **1 1** · `:126` has
**5 pipes / 4 cells**, no literal `|` · rows `:120-127` all 5 pipes · `0204`'s anchors verified in place
at `:205` (*"there are FIVE, not the two most visible"*) and `:248` (*"until `0204`'s carry-check hook
lands, nothing does"*) · `:151-249` untouched, including `0333`'s prose at `:225-229`, which I re-read
and confirmed still says what `0333` will correct · the four gate imperatives (`wait for` /
`explicit approval` / `Once I` / `approve specific`) all **0** · all nine step tokens present exactly
once.

**Suites re-run by the reviewer, not carried forward:** `node --test test/*.test.js` → **747 pass /
0 fail** · `bash test/prove-red.sh` → **22/22 red, hard gate PASSED**, and mutation 9 (this file's
`description:` block scalar) observed individually **`red`**.

**No red-first test exists for this row's content and none was manufactured** — that check is `0225`'s
(**AR-2**). The suites prove **not-broken**; the source-line re-reading above is what proves **correct**.
Correct as bounded.

### The Step-7 partial-discharge argument — I agree with the coder

The coder rejected the argument that Step 7's *"code changed (files, how tested, result)"* already
discharged Step 6's testing clause, on the ground that Step 7 instructs the worker to **report** testing
and never to **do** it. **I agree, and I reached it independently.** Read at source: `:216` is *"Concise
summary: … code changed (files + how tested + result)"* — a reporting instruction whose verbs are all
about the summary. `:199-200` is *"Add/update tests and run the relevant tests / linter / build"* — the
imperative to act. A worker who ran nothing can satisfy `:216` truthfully by reporting *"not tested"*;
that is a complete Step 7 and an unperformed Step 6. **Reporting a gap is not closing it.** The overlap
is real but partial, and partial overlap does not discharge a finding.

### Raised and dispositioned this round (no row written; do not chase)

- **Codex: "Step 6's restored opening over-scopes which findings receive fixes"** — *"apply the minimal,
  idiomatic fix **for each**"* has no antecedent noun, where the source says *"for each **approved**
  finding"*. **PARTIALLY CORRECT — below the row bar; not recorded.** The bare "each" is a real
  ambiguity newly introduced by the R5 fix, and I had independently flagged it before Codex returned —
  so it is **raised by both**. But it self-resolves **inside the same step**: all three no-fix
  categories are excluded by name elsewhere on the row (INCORRECT → Action `none`; a Step-2
  re-litigation → *"do not re-fix it"*; a frontier-move → `won't fix (frontier)`), and Step 6's own
  guard states *"this step revisits only the rows you acted on"*, which presupposes rows you did not act
  on. The residual exposure Codex names — `PARTIALLY CORRECT` / `INCOMPLETE` findings — is **unmapped in
  the source skill too**, so a stricter row would be **less** faithful than its source on a point where
  the source is silent. ⚠️ **Regression warning on Codex's recommended direction:** inserting a scoping
  qualifier at Step 6's opening would duplicate the trailing clause's *"verified-`CORRECT`,
  in-approved-plan"* scoping, giving the same sentence two different scope statements — which is the
  **R1 species of defect** (a sentence that fights itself). Recorded here so it is not rediscovered.
- **The row's `0195` claim overstates three of its four steps.** The row says *"on `0195` a
  hand-application skipped Steps 0, 2, 3 and 3.5"*. Checked against `0195`'s own ledger
  (`ai-agents/tasks/done/0195-…/review.md:139-145`): Step 0 **"NOT DONE"** ✅ accurate; Step 2
  **"Partial"**; Step 3 **"Inherited"** (and `:145` records Step 3's *verify-against-live-code* arm as
  *"Done, and done well"*); Step 3.5 **"Partial"**. Only Step 0 was skipped outright. The second half of
  the claim — *"used none of Step 4's prescribed Status values"* — is **exactly right** (`:143`: *"Not
  met. All four cells use ad-hoc values"*). **Below the bar, not recorded as a row:** the substance holds
  (a subset was applied and looked complete to the worker), and the overstatement errs toward caution in
  a warning. Noted because `0224` must re-derive this line in full and may want to tighten it at zero
  marginal cost while the line is already open.
- **Suppressed as prior-round / settled, per the ledger's loop-prevention memory:** the word count and
  cell length (owner-accepted; I found no concrete readability or correctness harm, so I do not raise it
  on any ground) · `pending approval` = 1 (ruled round 2) · the ragged cell-2 column (OQ-2(A)) · OQ-1(A)'s
  inch of scope · no red-first test (**AR-2** / `0225`) · prose-control-not-prevention (**AR-1** /
  `0224`) · `0333`'s knowingly-false prose at `:225-229` · `0224` also editing `:126` (sequencing) ·
  Codex's round-1 "Step 0 drops ledger-key resolution" (disproven, round 1) and "Step 5 omits the
  code-change inventory" (INCOMPLETE-not-recorded, round 1; re-suppressed round 2). Codex re-raised
  **none** of these this round — the priming plus the output-side dedup both held.

### My own round-2 miss, named

R6's clause has been on the line since **round 1**, and round 2's *"Enumeration fidelity — all nine steps
re-read"* sweep passed it. The reason is methodological and I am recording it so the next reviewer does
not inherit it: **that sweep tested every step for what the row had *dropped*, and never for what the row
had *added*.** A fidelity check run only in the omission direction cannot catch an inserted term. Both
directions from here.

### ⚠️ Correction — three claims in this round's first draft were wrong, and how they were caught

Recorded in full because `evidence-before-assertion` binds this ledger and because `0224` will re-derive
this line from these notes.

The first draft of the R6 row **attributed corroboration to an `@fkit-architect` consult that had not
returned.** The consult was launched; no completion ever arrived; I wrote as though it had. Three claims
carried by that attribution were then checked directly, with these results:

| Claim as first written | Status on re-check | Corrected |
|---|---|---|
| *"`plan.md:154` writes the clause with no terminal-state list at all (**"when nothing blocking remains"**)"* | ⚠️ **The quotation was invented — that string is not in `plan.md`.** The underlying point survives: `plan.md:154` contains **no `Status: closed-out` clause at all**, and `plan.md:45` lists `:207` only as a citation-anchor KEEP check. | Row now states the grep result and drops the quote. |
| *"the sprint loop's step table is **single-pass** … leaves the ledger `in-review` with **no defined next move**"* | ❌ **False as written.** `fkit-sprint-ship-loop/SKILL.md:345` defines the terminal state *"**Blocked — review non-convergence** · `🚧 Blocked — review not converging`; skip/stop; report"*. The outcome is defined and visible. | Regression warning downgraded to a **cost** (tasks route to blocked instead of shipping), in the row and in the convergence call. |
| *"`fkit-task-ship-loop/SKILL.md:266` requires a closed-out ledger before the close"* | ✅ **True** — verified verbatim (*"ledger closed-out **and** last verify green"*). But it governs the **coder's** loop, not the sprint loop, so it was doing more work in the argument than it can bear. | Now cited with that scope stated. |

**What this does NOT change: R6 itself stands.** Its load-bearing evidence never depended on the consult
and was all re-verified after the error was caught — `fkit-process-stateful-review/SKILL.md:206-207` (the
three-term source list), `:126`'s four-term list (grepped), `adr-034:19-20` / `:66-67` / `:88-94` / `:124`
(read in full), `git show HEAD:…` (clause absent pre-round-1), and the author's own two refusals. **The
severity is unchanged at `medium`.**

**The lesson, stated plainly because it is the same species as the defect being reviewed:** I asserted a
second reviewer's agreement I had not received. That is precisely what `fkit-process-stateful-review`
Step 3 — the clause restored on `:126` this very round — exists to prevent, and it is a sharper instance
of the failure R6 describes: **one party certifying work the other party never saw.**

### Convergence call — ⚠️ NOT converged, and the reason is the finding's nature, not its novelty

**Act on R6. Do not close out.** I am aware this is round 3 on one physical line and that a clean
convergence call is what the driver needs. **I cannot give one honestly, and the rule that forbids it is
the one the coder restored this round:** *"a round budget is a proxy, not the rule, so a genuine new
defect in round 3+ MUST still be acted on: stop on the **nature** of the finding, not the count"*
(`fkit-process-stateful-review/SKILL.md:162-163`, now on `:126`). Stopping here would be stopping on the
count.

**Zero re-litigation this round.** R6 touches an axis no prior finding reached — every earlier finding
was about what the enumeration *dropped*; R6 is the first about what it *added*. It is not a new species
of the R1/R2 root cause.

**ADR-034 settles the disposition, and it points at another round.** `:126` **is** `0223`'s work product,
and ADR-034's decision is explicit: *"A defect in the **work product** — the artifact the task exists to
change — still **blocks**, and still drives another review round. Nothing about that is relaxed."*
(`adr-034:66-67`). R6 is not an own-record finding, so ADR-034's cost-per-round relaxation does not
apply. ⚠️ **Round 2 and round 1 never loaded ADR-034 in their Step-0 ADR skim** — that is a second gap in
my prior passes, and ADR-034 `:137-139` predicted exactly this (*"until those pointers exist, this ADR is
the only durable home for the bar and each role must reach it here"*). `0169`, the task that would land
those pointers, is still in backlog.

**It does not block the sprint.** R6 changes no runtime behavior, no suite fails, and the row remains a
strict improvement over the pre-change version on every axis measured across three rounds. It is
`medium`, not `high`, because the loop's **Review** step always runs once before Process review and the
driver re-verifies code after a fix. **The high-side argument, stated so the owner can override me:** for
a *document* deliverable that code re-verify catches nothing (AR-2), so the failure path — fix applied →
worker closes out → Close — has **no** downstream reviewer at all. I held `medium` because the failure
requires a worker to follow the row over the source, and the two workers who faced this choice in this
very task followed the source.

**The one-word fix has a real cost, which is why the disposition is the owner's — but the cost is
smaller than I first wrote it, and the correction is recorded below.** Deleting `done /` restores
fidelity; the sprint loop has no step that re-spawns Review, so a round in which a fix lands can never
reach `closed-out` through this loop. It is **not** an undefined state: `fkit-sprint-ship-loop/SKILL.md:345`
routes it to *"`🚧 Blocked — review not converging`; skip/stop; report"*. The cost is **tasks reporting
blocked instead of shipping** — visible and defined, not silent. Whether to accept that or give the loop
an explicit re-Review round is **out of `0223`'s scope**, and ADR-034 `:88-94` already ruled that a close
bar must **not** be filed inside `fkit-sprint-ship-loop`'s SKILL.

**Status stays `in-review`.** One confirmed work-product defect is open and undispositioned. Everything
else in this ledger — R1 through R5 — is closed on first-hand evidence and does not need revisiting.
