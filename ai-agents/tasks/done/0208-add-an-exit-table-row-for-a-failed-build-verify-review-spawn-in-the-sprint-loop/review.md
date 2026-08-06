# Review — 0208

Task: `ai-agents/tasks/done/0208-add-an-exit-table-row-for-a-failed-build-verify-review-spawn-in-the-sprint-loop/brief.md`
File(s) under review: `claude/skills/fkit-sprint-ship-loop/SKILL.md` (0208's share: **+12 / −1** — the new
`Worker spawn didn't land` row in §5.4, the orphaned-`plan.md` blockquote below the invariant, and one
clause on the `Blocked — hand-off didn't land` Trigger cell). The same file also carries `0203`'s **+92**
and `0191`'s **+13** uncommitted — **out of scope, not reviewed**.
Status: **closed-out** (2026-08-05, round 2 — R9 fixed and tested; R10/R11 recorded as accepted
residuals; authorized by the reviewer's convergence call: *"at most one narrow round, then closeout… if a
Round 3 produces findings on the R9 fix itself, close out regardless."*)

**Round 1 — reviewers run:** fkit-reviewer (own pass) **+ Codex** (`codex-cli 0.145.0`, `codex exec
--sandbox read-only`, exit 0). **Codex coverage: FULL — model-diverse review achieved, not degraded.**

**Citation form:** this file is a living document whose coordinates moved four times on 2026-08-05. Rows
are cited by **section heading + row name + quoted phrase**; the line numbers below were re-derived this
round and are paired with quoted text, never naked.

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | high | `claude/skills/fkit-sprint-ship-loop/SKILL.md:346` | §5.4 `Worker spawn didn't land`, branch 1: *"**put the choice to the owner** — do not decide alone"* + *"do not pause the sprint … next eligible task"*, justified by *"as in **No Codex, degraded**, escalating is not by itself a pause"*. **The cited row does not say that**, and the row two above (`Owner decision pending`) says the opposite for the same event: Trigger *"**any judgment call** / degraded close / cancel question"* → *"**pause**, relay via `AskUserQuestion`, resume on the answer"*. `No Codex, degraded`'s own escalation (*"put its close to the owner"*) is itself a **degraded close** — verbatim in `Owner decision pending`'s trigger — so the precedent, read against the table, points the other way or is at best contested. Two adjacent rows of the driver's own control table now give opposite pause/continue instructions with no precedence rule. **Raised by both reviewers.** |
| R2 | 1 | med  | `claude/skills/fkit-sprint-ship-loop/SKILL.md:346` | The Trigger cell reads *"a task's **Plan, Build, Verify, Review or Process-review** spawn failed, was denied, or returned nothing"* and **omits `0167` §4's explicit narrowing** — *"the trigger must be narrower than 'a worker died' … the row is needed only for the branch where the driver **stops driving that task in this run**"* (`0167` proposed *Trigger:* *"…returned nothing **and the driver is not continuing this task in this run**"*). Consequence: the **all-paths-discharged** disk state — `0167` §2's *"A complete unit landed"*, routed there to *"resumes, re-spawns, or defers"* — **has no branch**: branch 2 presupposes missing paths (*"with the **missing paths** never arriving"*, status template *"<what landed, what is **outstanding**>"*). A driver whose worker wrote everything and then failed to return (the shape of `0167`'s instances 1 **and** 3) force-fits branch 2 and writes `🚧 Blocked` over a task that could simply continue. |
| R3 | 1 | med  | `claude/skills/fkit-sprint-ship-loop/SKILL.md:346` | Branch 3's justification — *"Branch 3 waits because **no** accurate status exists to write"* — **is false as written.** `🚧 Blocked — <reason>` is legal (`conventions/task-status-vocabulary.md`: *"Started, cannot proceed. **A reason is mandatory.**"*, set by *"Anyone — freely"*), accurate for a torn unit, and is exactly what `0167` §4 assigns: *"**Something landed** (complete or partial) → `🚧 Blocked — worker terminated abnormally: <what landed, what is outstanding>`"*. ⚠️ **The behavior (task stays `🔄 In progress`) is owner-ruled (D3, 2026-08-05) and is NOT challenged** — the defect is the over-broad *claim* supporting it, in a file whose own culture (`0167` §0.1, R4/R6) treats an over-broad claim as a defect. The defensible form is narrower (*no accurate **terminal** status*). **Nothing records that the shipped row now diverges from `0167` §4's written status ruling.** |
| R4 | 1 | med  | `claude/skills/fkit-sprint-ship-loop/SKILL.md:359-367` | The orphaned-`plan.md` blockquote **names `Worker spawn didn't land` as one of the exits it covers**, but its resume predicate — *"A later run that finds a `plan.md` whose task is **not `🔄 In progress`** must not read it as a live approval"* — **cannot fire for that row's branch 3**, which by design leaves the task *"`🔄 In progress` … a pause is not an exit, so no terminal status is written"*. The note's stated safeguard is inapplicable to the very branch it claims to cover. Internal contradiction inside the new text, independent of the settled stranding residual (see *Accepted residuals* → `0111` R6). **Raised by Codex; the stranding half is suppressed, this half is novel.** |
| R5 | 1 | med  | `claude/skills/fkit-sprint-ship-loop/SKILL.md:346` | Branch 3's condition is *"something landed but the unit is torn **across paths**"* — so a **single half-written file** matches no branch: not *"nothing landed"*, not branch 2 (*"stands on its own"* is false), not branch 3 (the tear is not *across paths*). `0167` §10 follow-up 1's owner-ruled operational test states *"**A half-written FILE is `partial` by construction**"*, and §2's Q1 table names it explicitly (*"a file is half-written; a unit is torn"*). The three branches are therefore **not jointly exhaustive** over the authority's named disk states. **Raised by both reviewers.** |
| R6 | 1 | low  | `claude/skills/fkit-sprint-ship-loop/SKILL.md:359-361` | *"so **every** exit past the plan gate — `Worker spawn didn't land`, both `Blocked` rows above, and `Blocked — hand-off didn't land` — leaves an approved-plan artifact on disk"*. The enumeration is **not exhaustive**: `No Codex, degraded` is also a post-plan-gate exit (*"do not route its close — put its close to the owner"*) that leaves `plan.md` on disk. An `every`-claim narrower than its own list. **Raised by both reviewers.** |
| R7 | 1 | low  | `claude/skills/fkit-sprint-ship-loop/SKILL.md:346` | Branch 1 *"add[s] it to the per-run skip set (§1)"* **and** puts to the owner a choice the trailer describes as deciding *"whether the task is re-attempted"* — but §1's skip memory *"**exclude**[s] them from the eligible set"* and step 5 re-derives *"**minus the per-run skip set**"*, so an affirmative answer cannot be acted on **this run**. ⚠️ **Mitigated, not eliminated:** §1 says the memory is *"**this-run only**; a later invocation reconsiders them"*, and `Sprint drained — deferred remain` reports such tasks as `pending — re-run to reconsider`. So the outcome is defensible; the **stated rationale over-promises** what the owner's answer can change. |
| R8 | 1 | low  | `claude/skills/fkit-sprint-ship-loop/SKILL.md:346` | The disk-read instruction carries `0167` §2's addendum obligations **(a)** (*"read the paths the spawn instruction named — wherever they live, never the task folder as a proxy"*) and **(b)** (*"never `git status` for an untracked path (it reads `??` before the write and after it)"*) near-verbatim, but compresses **(c)** — *"a structural probe cannot answer a content question"* — into the two words *"compare **content**"*. The asymmetry leaves available the exact misclassification instance 3 committed (a `## ` heading present as an empty scaffold, counted as filled). ⚠️ **Substantially covered by accepted residual R2** (the row carries outputs, not the procedure) — recorded because (a) and (b) *were* carried explicitly and (c) alone was not. **Raised by Codex, downgraded from medium.** |

### Disproven this round — recorded so the coder is not asked to chase it

- **Codex #5 — *"'its **single** re-spawn' restates a retry count, violating `0167` §8's no-count rule."*
  INCORRECT (disproven).** §8's exclusion is against writing a **new** retry rule (*"no retry count … **of
  its own**"*), and `0167` §10 **follow-up 4** asks for precisely this clause: *"Add a scoping note beside
  the `Blocked — hand-off didn't land` row stating that its producer re-spawn is close-step-specific and is
  not the dead-worker rule. One line; **writes no new retry rule**."* The word `once` in that row is
  **pre-existing text**, not 0208's; the new clause **describes and denies** it. `0167` §11 step 6 already
  sanctions exactly this quotation-and-decline pattern. **Retry sweep of 0208's own text is clean** — no
  count, no limit, no backoff introduced; the only new retry-adjacent text is a denial
  (*"how many re-spawns are allowed is **unruled** and the driver **must not settle it**"*) and this
  scoping clause.

---

## Reviewer findings — Round 2

**Round 2 — reviewers run:** fkit-reviewer (own pass) **+ Codex** (`codex-cli 0.145.0`, `codex exec
--sandbox read-only`, exit 0, ~5 min). **Codex coverage: FULL — model-diverse review achieved, NOT
degraded.** ⚠️ The run stalled visibly (stderr frozen at 84002 bytes across four polls) and was waited
out rather than abandoned; it completed normally. **No retry was needed and no pass was skipped.**

**Coordinates re-derived this round** even though the delta was net 0 lines: §5.4 heading `:335`, table
`:337-348`, the row under review `:346`, producer row `:347`, invariant `:350-351`, orphan note `:359-367`.

### Verdict on the seven repairs — each re-verified firsthand against the file and the authority

| Fix | Holds? | How I checked |
|---|---|---|
| **R1** | ✅ **fixed** | The `No Codex, degraded` precedent clause is **gone** from `:346`. Branch 1 now rests on *"`🔲 Backlog` is an accurate **terminal** status for it, so the task is safely parked and the drive can exit"* — ground (iii), the only one of the three that survived Round 1. ⚠️ A narrowed remainder persists → **R11** below. |
| **R2** | ✅ **fixed** | Trigger now carries *"**and the driver is not continuing this task in this run**: if **every** path the spawn instruction named was discharged, the drive continues and **this row does not fire**"* — `0167` §4's narrowing. **The negative phrasing is the right call:** it states only *when the row does not fire* and imports no resume procedure, so nothing is pre-empted ahead of `0228`. The all-paths-discharged state is now correctly **outside** the row. |
| **R3** | ✅ **fixed** | Both sites corrected and consistent: the branch text says *"a pause is not an exit, so **no terminal status** is written"* and the trailer says *"Branch 3 has no **terminal** status to write"*. The false *"no **accurate** status exists"* is gone. **Matches the owner's confirmed R1/R3 reconciliation exactly** — the invariant governs exits, `🚧 Blocked` stays legal in general, it is simply not written on that branch. |
| **R4** | ✅ **fixed** | Predicate is now *"a `plan.md` it did not itself approve this run"*. Verified the old one was genuinely broken: branch 3 parks the task **at** `🔄 In progress`, so *"not `🔄 In progress`"* provably could not fire for the row the note claims to cover. The run-relative form fires correctly, and is also right for the crashed-driver case. |
| **R5** | ⚠️ **text present, but it introduced a NEW defect** → **R9** below. |
| **R6** | ✅ **fixed** | `No Codex, degraded` added. **I re-derived exhaustiveness independently across all ten rows** (not taken from the coder): `Sprint shipped` — folders closed, `plan.md` moves with them; `Sprint drained` — a roll-up, any orphan-producing per-task exit is separately named; `Plan rejected` — `plan.md` is written *at plan approval*, so a rejected plan never wrote one; `Owner decision pending` — a pause, not an exit, per this row's own principle; `Dependency deadlock` — selection-time, no task passed the plan gate. **The five omissions are each correct; the `every` now holds.** Codex re-derived the same ten-row result independently. |
| **R7** | ✅ **fixed** | *"§1's skip memory is **this-run only**, so the answer lands on a later run"* — checked against §1`:103` (*"This memory is **this-run only**; a later invocation reconsiders them"*). Accurate; no longer over-promises. |
| **R8** | ✅ **accepted as residual**, folded into residual R2, which now names part (c) explicitly. Correctly done. |

### Mechanical re-verification — every figure measured this turn

- **Row/column integrity:** 12 table lines, **all exactly 3 columns**; **10 data rows**. ✅
- **Retry sweep, whole file:** `budget` `:43` `:122` `:342`, `retries` `:320` `:348`, `retry` `:347`. **Line `:346` — 0208's own row — has ZERO retry/count/limit/backoff hits.** The only in-scope hit is `:347`'s sanctioned denial. `once` appears at `:161` `:162` `:212` `:307` `:347` `:383` — `:347` is the pre-existing producer re-spawn; the rest are outside 0208's block. ✅ **Clean.**
- **Status vocabulary:** `🔲 Backlog`, `🚧 Blocked — <reason>`, `🔄 In progress` — all three in `conventions/task-status-vocabulary.md`. **Nothing minted.** ✅
- **`0167` §4 correction note:** **verified present.** Pointer at `:588` (*"⛔ **PARTIALLY SUPERSEDED 2026-08-05 by owner ruling**"*), note at `:631-680`. Append-only, dated, owner-ruled, states the partial case now *"stays `🔄 In progress` … no **terminal** status is written, because a pause is not an exit"*, keeps `🚧 Blocked` legal in general, leaves the nothing-landed and complete cases unchanged, and cross-references this ledger both ways. **It also carries forward my Round 1 "exposure is now wider by design" note.** ✅ Says what the ruling says.
- **`0228` filed:** `ai-agents/tasks/backlog/0228-write-the-resume-doctrine-section-into-the-sprint-loop/`, `## Status` = `🔲 Backlog`. ✅

### New findings

| #   | Round | Sev  | file:line | Claim |
|-----|-------|------|-----------|-------|
| R9  | 2 | med  | `claude/skills/fkit-sprint-ship-loop/SKILL.md:346` | **Branches 2 and 3 are written at DIFFERENT SCOPES, so they are not disjoint — and this was introduced by the R5 fix.** Branch 2: *"**something landed and stands on its own** with the missing paths never arriving"* — read literally, `something … stands on its own` is **existential** over landed content. Branch 3 now: *"something landed but **a file is half-written**, or the unit is torn across paths"* — also **existential**, over files. **Counter-example both reviewers reached independently:** file A fully written and self-contained, file B half-written. Branch 2 matches (A stands alone); branch 3 matches (B is half-written). A driver reading the branches in written order takes **branch 2** — writes `🚧 Blocked`, continues the sprint — where `0167` §10 follow-up 1 requires **branch 3** (*"a half-written FILE is `partial` by construction"*), whose one question is asked over **the whole on-disk state**: *"is **what is on disk** usable and safe to build on with the missing paths never arriving?"* → **NO** here. **This directly rebuts the Coder response's R5 claim that *"2 ∩ 3 = ∅"*** — that holds only under a whole-state reading of branch 2, which its wording does not compel. Round 1's branch 3 (*"the unit is torn across paths"*) **was** whole-state phrased, so the mismatch is new this round. **Fix is one clause** — scope branch 2 to the whole state, e.g. `0167` §2's own R11 wording: *"nothing on disk depends on a path that is missing"*. **Raised by both reviewers.** ⚠️ **Severity is mine and I DOWNGRADED it from Codex's `high`:** branch 2 still writes an enumerating `🚧 Blocked — <what landed, what is outstanding>` in both locations and **reports**, so the owner still learns of the torn state and the catastrophic path (building on torn state) is **not** reachable through it. What is lost is the owner being *asked*. |
| R10 | 2 | low  | `claude/skills/fkit-sprint-ship-loop/SKILL.md:360-361` | The orphan note's enumeration says *"**both** `Blocked` rows above"* while naming `Blocked — hand-off didn't land` separately. **Three** rows in the table are named `Blocked — …`, and `Worker spawn didn't land`'s branch 2 also *writes* a `🚧 Blocked` status — so `both` is under-specified, and `above` is positionally true of all ten rows relative to a note that sits below the table. **Cosmetic only.** ⚠️ **My recommendation is NOT to fix this in `0208`** — both reviewers resolved it correctly on first read (Codex enumerated the intended two rows unprompted), and a text edit here buys precision at the cost of another round. Recorded for completeness, not for action. |
| R11 | 2 | low  | `claude/skills/fkit-sprint-ship-loop/SKILL.md:344` + `:346` | **The narrowed remainder of R1 — the false citation is gone, the row-vs-row tension is not.** `Owner decision pending`'s Trigger cell still reads *"**any judgment call** / degraded close / cancel question"* → *"**pause**"*, and branch 1 still puts a choice to the owner **and** continues. The distinguishing rule the fix introduced — *pause iff no accurate **terminal** status exists* — is stated **only inside the new row**; `Owner decision pending` carries no cross-reference, so a driver reading that row alone still reads `any judgment call → pause`. **Materially narrower than R1** (which turned on a disproven precedent); recorded so it is not lost, not to re-open R1. ⚠️ **My recommendation: accept as a residual rather than fix** — the table resolves under ordinary specificity (the worker-specific row governs over the generic one), and amending `Owner decision pending` reaches beyond `0208`'s scope. **Raised by both reviewers.** |

### Discharged this round — Round 1 records that are now stale (recorded here; Round 1 is not rewritten)

- **The residual note *"`0167`'s follow-up 1 has still NEVER been filed"* is now STALE and DISCHARGED** —
  filed as **`0228`**, verified on disk this round. My Round 1 finding was correct when written; it no
  longer is. Residuals R2 and R3 now point at a real task.
- **The divergence residual's *"Consequence to act on elsewhere — a dated correction note on `0167`'s
  report is the producer's to file"* is DISCHARGED** — verified at `:588` / `:631-680`. That residual's
  own re-raise condition (*"`0167` §4 is amended"*) is met, so it is **discharged, not re-litigated**.

### ⚠️ Recorded for the ledger, not scored as a defect — a degraded carry on this review's own input

**Carry-condition (b) failed on the Process-review spawn and the coder proceeded anyway**, recording the
decision as its own; the owner accepted it as a **second one-time acceptance**, standing rule unchanged.
It belongs in this ledger because `0167` §1 is the precedent for exactly this shape: an earlier round with
an unestablished/degraded hand-off landed corrections of which **two were later found factually false**,
and *"nothing but independent re-measurement caught them."* **Mitigation applied this round, stated so it
is checkable:** every figure and quotation above was re-measured firsthand from the file and the
authority — the row/column counts, the retry sweep, the ten-row exhaustiveness re-derivation, the
correction note, and `0228`'s existence — **none was taken from the Coder response.** The two Round 2
findings were then reproduced independently by Codex.

## Coder response

<!-- CODER-OWNED — the reviewer never writes here. -->

**Round 1 response — written 2026-08-05 by a spawned `@fkit-coder` (Process-review worker) under
`fkit-sprint-ship-loop`, against the owner's per-finding dispositions ruled live the same day.** Every
claim below was re-verified against the file and the cited authority this round; nothing was taken on the
reviewer's word.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | defect (false supporting claim; the *behaviour* is sound) | **Deleted the `No Codex, degraded` precedent clause.** Verified the charge: `No Codex, degraded` (`:348`) says only *"proceed-and-flag … put its close to the owner"* — it never says escalating is not a pause, and its own escalation **is** a *"degraded close"*, verbatim in `Owner decision pending`'s trigger (`:344`) → *"**pause**"*. The precedent was disproven, not merely contested. Escalate-and-continue on branch 1 **kept** (owner). New ground: *"`🔲 Backlog` is an accurate **terminal** status for it, so the task is safely parked and the drive can exit with the question outstanding."* | **fixed** |
| R2 | **CORRECT** | defect (missing branch — over-broad trigger) | **Added `0167` §4's narrowing to the Trigger cell**: *"**and the driver is not continuing this task in this run**: if **every** path the spawn instruction named was discharged, the drive continues and **this row does not fire**."* Confirmed the gap was real: §2's *"A complete unit landed"* routes to *"resumes, re-spawns, or defers"*, while branch 2 presupposes *"the missing paths never arriving"* — so all-paths-discharged had no branch and would have force-fit `🚧 Blocked` over completed work. The added clause states only when the row does **not** fire; it imports **no** resume procedure (that stays in the deferred doctrine half). | **fixed** |
| R3 | **CORRECT** | defect (over-broad claim; behaviour owner-ruled D3, unchallenged and unchanged) | **Narrowed the reason.** Confirmed the claim was false as written: `🚧 Blocked — <reason>` is legal (`task-status-vocabulary.md`, set by *"Anyone — freely"*) and is exactly what `0167` §4 assigns to *"Something landed (complete or partial)"*. Replaced *"Branch 3 waits because **no** accurate status exists to write"* with *"Branch 3 has no **terminal** status to write — a pause is not an exit — so it waits."* Behaviour unchanged. **The resulting divergence from `0167` §4 is now recorded as an accepted residual below.** | **fixed** |
| R4 | **CORRECT** | defect (internal contradiction — inapplicable safeguard) | **Fixed the predicate.** Confirmed: branch 3 parks the task **at** `🔄 In progress` by design, so *"whose task is **not `🔄 In progress`**"* could never fire for the row the note claims to cover. Now: *"**A later run that finds a `plan.md` it did not itself approve this run must not read it as a live approval**."* The new predicate is run-relative, so it fires for **every** listed exit including branch 3. Stranding half untouched (suppressed against `0111` R6). | **fixed** |
| R5 | **CORRECT** | defect (branches not jointly exhaustive) | **Widened branch 3** to *"something landed but **a file is half-written, or** the unit is torn across paths"*. Confirmed against `0167` §2 (*"a file is half-written; a unit is torn"*) and §10 follow-up 1 constraint (4) (*"define 'partial' over the UNIT, not the file"* — the file case is **additional**, not replaced). **Disjointness re-checked and holds:** branch 2 requires *"stands on its own with the missing paths never arriving"*, which a half-written file cannot satisfy, so 2 ∩ 3 = ∅. | **fixed** |
| R6 | **CORRECT** | defect (non-exhaustive `every`-claim) | **Corrected the enumeration, not the quantifier** — added `` `No Codex, degraded` `` to the list. Re-derived exhaustiveness over all 10 rows this round: `Plan rejected` and `Dependency deadlock` are pre-approval (no `plan.md` exists), `Owner decision pending` resumes rather than exits, `Sprint shipped`/`Sprint drained` are roll-ups. With `No Codex, degraded` added the **`every`** now holds. | **fixed** |
| R7 | **PARTIALLY CORRECT** (as the owner ruled) | defect (rationale over-promised) — **now largely dissolved by R1's fix** | **Rationale recorded, and one small text change made — judged warranted, stated either way as directed.** The over-promising sentence R7 targets (*"the answer changes only whether the task is re-attempted"*) was **deleted wholesale by R1's fix**, which removes most of the defect. Remaining gap: the row still put a question to the owner without saying when an answer could take effect. Added, citing existing text: *"§1's skip memory is **this-run only**, so the answer lands on a later run."* (§1`:103`: *"This memory is **this-run only**; a later invocation reconsiders them."*) Outcome unchanged; the row no longer implies the answer is actionable this run. | **fixed** |
| R8 | **CORRECT, accepted as residual** | frontier-move (doctrine, not a terminal-state cell) | **No text change** — folded into existing accepted residual **R2** by owner ruling. Addendum part (c) (*"a structural probe cannot answer a content question"*) is a **decision procedure**, and `0167` §5 already rules *"a table cell cannot carry a three-state classification"*. It belongs to the deferred doctrine half, alongside (the residual's) the operational test. Parts (a) and (b) remain carried explicitly in the cell. See the amended residual below. | **accepted residual** |
| Codex #5 | **INCORRECT (disproven)** — agreed with the reviewer, **not chased** | — | Independently re-confirmed rather than taken on the reviewer's word: `0167` §10 follow-up 4 asks for exactly this clause (*"…is not the dead-worker rule. One line; **writes no new retry rule**"*), and the word `once` on the producer row is **pre-existing** text, untouched by `0208`. The new clause **denies** a rule rather than creating one. **Retry sweep of this round's own additions: clean** — no count, no limit, no backoff. | **no action** |

### ⚠️ One owner disposition rested on a premise its neighbour disproves — reconciled, and said out loud

**R1's disposition and R3's disposition conflict on the branch-3 half.** R1 directs the new ground to be
*"an accurate status (`🔲 Backlog`) exists for this branch, so it can exit; **branch 3's does not**, so it
pauses"* — but R3 rules, correctly, that *"no accurate status exists"* for branch 3 is **false**, because
`🚧 Blocked — <reason>` is accurate and legal there. Writing R1's clause verbatim would have re-shipped the
exact defect R3 orders removed, one sentence later.

**Reconciled by taking R3's narrowing into R1's wording:** the contrast is drawn over **terminal** status,
which is true on both sides — branch 1 has one to write and exits; branch 3 has none to write **because a
pause is not an exit**, and waits. Both dispositions are honoured in substance; neither is applied in a
form that contradicts the other. Flagged rather than resolved silently.

### Verification of this round — every number measured this turn

| Check | Result |
|---|---|
| §5.4 data rows | **10** (was 9 pre-`0208`) — unchanged by this round |
| every §5.4 table line exactly 3 columns | **yes**, all 12 lines (header + separator + 10 data rows) |
| status values re-checked against `conventions/task-status-vocabulary.md` | `🔲 Backlog`, `🔄 In progress`, `🚧 Blocked — <reason>` — **all canonical, nothing minted** |
| retry-lexicon sweep of this round's added text | **clean** — no count, limit, or backoff. The one lexicon hit in the whole uncommitted diff is `:347`'s pre-existing *"its single re-spawn is not a general worker-retry rule"*, which is `0167` §10 follow-up 4's sanctioned **denial** (see Codex #5) |
| `0167` §2's three disk states each have exactly one route | **yes** — nothing landed → br 1; complete → br 2, **or the row does not fire** when all paths discharged (R2's fix); partial (half-written file **or** torn unit) → br 3 |
| `complete` / `partial` still **disjoint** after R2+R5 widened them | **yes** — br 2 requires *"stands on its own with the missing paths never arriving"*, which neither a half-written file nor a torn unit can satisfy |
| `git diff --numstat` on `SKILL.md` | **117 / 1** total uncommitted — **identical to this round's starting reading**. **This round's own delta is net 0 lines**: all six edits rewrote lines already inside `0208`'s added block (`:346` and the `:359-368` blockquote), so none registers as a new added line. Per the ledger header, that 117 splits `0203` **+92** · `0191` **+13** · `0208` **+12/−1** — arithmetic checks (92+13+12 = 117). ⚠️ The `0203`/`0191` split is **the reviewer's measurement, cited not re-derived**; the 117/1 total and the net-0 round delta are mine, taken this turn |
| `npm test` | **green — fail 0, 24.6 s**, plus the mutation hard gate (0a–0i green, mutations 1–14 each red their named assertion). ⚠️ **Regression check only** — verified at plan time and unchanged: **no test reads this file's body**, so a green suite is not evidence the row is correct. The read-back above and the reviewer's next pass are the only such evidence |
| `plan.md` blob unchanged | **yes** — `595790f677e12c34aa9adfe11c87d6c44415c119`, 12303 bytes |

**Change surface this round: `claude/skills/fkit-sprint-ship-loop/SKILL.md` only.** No brief filed, no
commit, no push, nothing under `ai-agents/wiki-vault/`, `fkit-claude-init.sh` **not** run (`.claude/` is
knowingly stale), `plan.md` not re-authored.

⚠️ **The shipped row now diverges from `plan.md` §3's text by owner ruling** — `plan.md` is the approved
bytes and is deliberately left un-re-authored, so it no longer matches what shipped. **Do not restore the
plan's version of the row.** Recorded in `worklog.md` as well.

📌 **Noted, not acted on:** `0167`'s follow-up 1 (the resume-doctrine brief) **is being filed by a producer
under separate owner ruling**. This worker filed nothing. The first accepted residual's *"has still NEVER
been filed"* line is therefore true as of the round-1 review and is being discharged elsewhere.

### Round 2 — Coder response (2026-08-05)

**Round 1's 🛑 Blocked lifted**; R1, R2, R3, R4, R6, R7 verified fixed by the reviewer against the
authority, and the R1/R3 *terminal*-status reconciliation confirmed to match the owner's ruling. Codex
coverage **FULL** (the run stalled visibly; the reviewer waited it out rather than abandoning it).
**Round 2 carries one fix (R9) and two new residuals (R10, R11).**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R9 | **CORRECT — and my Round 1 disjointness claim was WRONG** | defect (branch overlap, **introduced by my own R5 fix**) | **Fixed. See the tested result below.** I re-ran the counter-example before touching anything and it reproduces exactly as both reviewers state. **My Round 1 assertion *"2 ∩ 3 = ∅"* was unsound**: I tested branch 2 as though it were whole-state while I had just written branch 3 per-file, so the two were compared at different scopes and the overlap was invisible to the test. Round 1's branch 3 (*"the unit is torn across paths"*) was whole-state and did not overlap; **the per-file clause I added for R5 created R9.** | **fixed** |
| R10 | **CORRECT** | cosmetic (under-specified reference) | **No fix, by owner ruling.** *"both `Blocked` rows above"* is ambiguous on its face — three rows carry a `Blocked — …` name. Both reviewers resolved it correctly unprompted. **Recorded as a residual below.** ⚠️ The reviewer's own reason applies to me with more force: **every round so far has introduced a new finding through its own fixes — R9 came from the R5 fix.** A cosmetic edit is exactly how that pattern continues. | **accepted residual** |
| R11 | **CORRECT** | frontier-move (reaches beyond `0208`) | **No fix, by owner ruling.** `Owner decision pending`'s *"any judgment call → pause"* still literally covers branch 1, and the rule distinguishing them lives only inside the new row. **Resolves under ordinary specificity** (the specific row governs the general one), and amending `Owner decision pending` is outside `0208`'s scope. **Recorded as a residual below.** | **accepted residual** |

#### ⛔ R9 — the fix, and why the owner's directed wording alone was not enough

**The owner directed `0167` §2's R11 wording — *"nothing on disk depends on a path that is missing"* —
*"or wording that provably carries the same whole-state test."* I tested the directed clause first, and it
does NOT defeat the counter-example, so I used the sanctioned fallback. Stating this rather than
silently substituting.**

**Why the single R11 clause fails here:** in the counter-example, file B is **half-written** — it is a path
that *was* written, incompletely, **not a path that is missing**. File A is self-contained and depends on
nothing. So *"nothing on disk depends on a path that is missing"* reads **TRUE**, branch 2 still matches,
and the overlap survives. The clause fails alone because in `0167` §2 it is one of **two** conjuncts on the
`complete` row — it sits *beside* *"nothing is half-written"*, and lifting one conjunct drops the other.

**Applied (branch 2 only — branch 3 untouched, as ordered):**

- from: `**something landed and stands on its own with the missing paths never arriving**`
- to: `**something landed and everything that landed stands on its own with the missing paths never arriving — nothing is half-written, and nothing on disk depends on a path that is missing**`

Two changes, both whole-state: the quantifier goes **existential → universal** (*"everything that landed"*),
and **both** of §2's `complete` conjuncts are carried, R11's verbatim.

#### ✅ Disjointness — TESTED against the named counter-example, not re-asserted

**Counter-example: file A complete and self-contained; file B half-written.**

| Branch | Matches? | Why |
|---|---|---|
| 1 — *nothing landed* | **NO** | A landed |
| 2 — *everything that landed stands on its own … nothing is half-written …* | **NO** | B is half-written → *"nothing is half-written"* is **false**, and *"everything that landed stands on its own"* is **false**. The universal quantifier is what excludes it; the old existential did not |
| 3 — *a file is half-written, or the unit is torn across paths* | **YES** | B is half-written |

**Result: A-complete-plus-B-half-written now routes to branch 3 ALONE** — stop and put it to the owner,
which is what `0167`'s whole-state test requires (*"is **what is on disk** usable and safe to build on with
the missing paths never arriving?"* → **NO**). **The pre-fix behaviour — a top-to-bottom reader taking
branch 2 — is gone.**

**Branches 2 and 3 are now exact complements** given something landed: branch 2 is (nothing half-written
**AND** nothing depends on a missing path); branch 3 is its negation (something half-written **OR** the
unit torn across paths, i.e. something depends on a missing path). So they are **disjoint and jointly
exhaustive** — this time by construction, not by inspection.

#### `0167` §2's three disk states — each routing to exactly one branch

| `0167` §2 state | Routes to | Sole? |
|---|---|---|
| **Nothing landed** | branch 1 | yes |
| **A complete unit landed** | branch 2 — **or the row does not fire at all** when every named path was discharged and the drive continues (R2's fix, in the Trigger) | yes |
| **A partial unit landed** (*"a file is half-written; a unit is torn"*) | branch 3 — **both** disjuncts now covered (R5) | yes |

#### Round 2 verification — every number measured this turn

| Check | Result |
|---|---|
| §5.4 data rows | **10** |
| every §5.4 table line exactly 3 columns | **yes** — all 12 lines |
| status vocabulary | `🔲 Backlog`, `🔄 In progress`, `🚧 Blocked — <reason>` — **nothing minted**; R9's fix adds no status |
| retry-lexicon sweep of Round 2's added text | **clean** — no count, no limit, no backoff, no number of any kind |
| `git diff --numstat` | **117 / 1** — unchanged again; **Round 2's own delta is net 0 lines**, one in-place rewrite of `:346`. File still **412** lines |
| `npm test` | **green — 567 tests, 567 pass, fail 0**, 26.7 s, plus the mutation hard gate (0a–0i green; mutations 1–14 each red their named assertion). ⚠️ **Regression check only — no test reads this file's body**, so this is evidence of no regression elsewhere, **not** evidence R9's fix is correct. The tested counter-example above is that evidence |
| `plan.md` blob | unchanged — `595790f677e12c34aa9adfe11c87d6c44415c119` |

#### Recorded, not acted on

- **`0228` is filed** — *"Write the `## Resume doctrine` section into the sprint loop"*, Backlog, verified
  on disk this turn. **Accepted residuals R2 and R3 now point at a live task, not at a closed report.**
- **`0167` §4's dated correction note landed** — verified this turn at `:588` (pointer) and `:631+` (the
  note), and it says what the ruling says. **The residual I filed in Round 1 is thereby discharged** —
  see its dated amendment below.
- ⚠️ **The owner accepted my proceeding past the failed carry condition (b) as a SECOND one-time
  acceptance. The standing rule is UNCHANGED.** The owner noted plainly that **a third would be evidence
  the rule does not survive contact with the driver.** Recorded in the honest form rather than as
  precedent: two one-time acceptances are not a relaxation, and the next one is a signal about the rule
  itself, not about the spawn.

**Ledger set to `closed-out`** under the reviewer's convergence call — *"at most one narrow round, then
closeout… if a Round 3 produces findings on the R9 fix itself, close out regardless."* R9 is applied and
tested; R10 and R11 are recorded as residuals with re-raise conditions.

## Accepted residuals (shared, do-not-re-litigate)

- **The row ships without `0167` §5's resume-doctrine section** — What: `0167` §5 ruled the exit row and a
  `## Resume doctrine` section *"must land together"*; 0208 ships the row alone. · Why (structural): owner
  ruling — ship the row now, file the doctrine half separately. · Re-raise only if: the doctrine half is
  ruled unnecessary, or the row is found to be unusable without it.
  ⚠️ **Recorded as fact this round: `0167`'s follow-up 1 has still NEVER been filed.** Verified
  2026-08-05 — no task folder under `ai-agents/tasks/backlog/` matches it, and
  `/usr/bin/grep -rl 'Resume doctrine' ai-agents/sprints/` returns only narrative prose in
  `sprint-2.md:401`, **not a board row**. It exists only inside `0167`'s report §10 and 0208's own
  plan/worklog.
- **R2 — the row carries decision-procedure OUTPUTS, not the procedure** — What: the three branches state
  the rulings' results; `0167` §10 follow-up 1's owner-ruled operational test (list the instructed paths →
  discharged? → the one separating question) is not in the row. · Why (structural): a table cell cannot
  carry a decision procedure (`0167` §5's candidate table: *"a table cell cannot carry a three-state
  classification"*); the test belongs in the deferred doctrine section. · Re-raise only if: the doctrine
  half is cancelled rather than deferred.
  ⚠️ **Amended 2026-08-05 (round 1, owner-ruled) — R8 folded in here.** `0167` §2's addendum part **(c)**
  (*"a structural probe cannot answer a content question"* — a `## ` heading is present whether or not the
  section is filled) is compressed in the cell to the two words *"compare **content**"*, while parts (a)
  and (b) are carried near-verbatim. The asymmetry is real and is **accepted on the same ground**: (c) is a
  decision procedure, not a terminal-state instruction. Same re-raise condition.
- **⛔ NEW (recorded 2026-08-05, owner-ruled at R3) — the shipped row DIVERGES from `0167` §4's written
  status ruling, and nothing else records it** — What: `0167` §4 rules *"**Something landed** (complete or
  partial) → `🚧 Blocked — worker terminated abnormally: <what landed, what is outstanding>`"* — i.e. the
  **partial** case gets `🚧 Blocked` too. The shipped row instead leaves the partial case (branch 3) at
  `🔄 In progress` and writes **no** terminal status while the owner is asked. · Why (structural): owner
  ruling **D3, 2026-08-05** — a pause is not an exit, and writing a terminal status over a task the driver
  is still holding open would make the board lie in the other direction. The behaviour is deliberate, not a
  defect; only its false *justification* was a defect (R3, fixed). · **Consequence to act on elsewhere:**
  `0167`'s report §4 is now **stale on this point** and says so nowhere. A **dated correction note on
  `0167`'s report is the producer's to file, not the coder's** — flagged here so it is not lost. ·
  Re-raise only if: D3 is revisited, or `0167` §4 is amended (then this residual is discharged, not
  re-litigated).
  ✅ **DISCHARGED 2026-08-05 (round 2), by its own stated condition.** The producer filed the dated
  correction note on `0167`'s report — verified this turn: pointer at `:588`
  (*"PARTIALLY SUPERSEDED 2026-08-05 by owner ruling"*), note at `:631+`, append-only with no line above
  edited, and the reviewer independently confirmed it says what the ruling says. **The divergence is now
  recorded in both places.** Kept here as history, **not** as a live residual.
- **R10 (round 2, owner-ruled: accept) — *"both `Blocked` rows above"* is under-specified** — What: the
  orphaned-`plan.md` note says *"both `Blocked` rows above"*, but **three** §5.4 rows carry a
  `Blocked — …` name (`Blocked — verification`, `Blocked — review non-convergence`, `Blocked — hand-off
  didn't land`); the last is named separately in the same sentence, so *"both"* means the first two. ·
  Why (cosmetic, and a deliberate stop): both reviewers resolved it correctly unprompted, and **every
  round of this task has introduced a new finding through its own fixes — R9 was created by the R5 fix.**
  A cosmetic edit at closeout is how that pattern continues. · Re-raise only if: a reader is actually
  observed to mis-resolve it, or the §5.4 rows are renamed/reordered (which would change which two
  *"both"* picks out).
- **R11 (round 2, owner-ruled: accept) — `Owner decision pending` still literally covers branch 1** —
  What: that row's trigger is *"any judgment call / degraded close / cancel question"* → *"**pause**"*,
  which on its face also covers branch 1's escalation; the rule that branch 1 escalates **and continues**
  lives only inside the `Worker spawn didn't land` row. · Why (structural): it **resolves under ordinary
  specificity** — the specific row governs the general one — and amending `Owner decision pending`
  reaches beyond `0208`'s scope. · Re-raise only if: a driver is observed pausing on branch 1, or
  `Owner decision pending` is edited for another reason (fold the carve-out in then, at no extra risk).
- **R3 — `0167` §3's no-self-report rule has nowhere to live in a table cell** — What: *"The driver's
  enumeration is an INPUT to the resumed worker — never a substitute for the worker's own re-derivation"*
  is absent from the row. · Why (structural): same as R2 — it is doctrine, not a terminal-state cell. ·
  Re-raise only if: the doctrine half is cancelled rather than deferred.
- **Crash/idle stranding of an in-flight `🔄 In progress` task (`0111` R6, owner-ruled 2026-07-22:
  accept)** — What: a crash/kill mid-drive leaves the task `🔄 In progress` with no lease/recovery. · Why
  (structural): fkit has **no lease, heartbeat, or stale-task reclamation anywhere** (`0167` §6's corrected
  rationale); all state is working-tree + owner-driven. · Re-raise only if: stranded in-progress tasks
  become a recurring operational problem (then scope a lease/recovery task + ADR).
  ⚠️ **Noted, not re-raised:** 0208's branch 3 **deliberately adds a new source of this state** (a paused
  task parked at `🔄 In progress`, skipped by §1's *"Skip `🔄 In progress`"* on every later run). `0167`
  §7 verified the re-raise trigger unmet (**zero** stranded tasks across three instances), so it stays
  suppressed — but the exposure is now wider by design, which is the fact that would eventually trip it.

### Re-litigates settled decisions (suppressed this round — not dropped)

| Raised by | Claim | Suppressed against |
|---|---|---|
| Codex #7 (stranding half) | branch 3's `🔄 In progress` task is never reclaimed by a later run | `0111` R6 above — re-raise condition (*recurring operational problem*) **not met**; `0167` §7 grounds 1–4. **The novel half — the orphan note's predicate not covering its own row — is recorded as R4, not suppressed.** |
| Codex #4 (part) | the row does not carry `0167` §10 follow-up 1's operational test | Accepted residual **R2** above. **The narrow asymmetry — (a) and (b) carried, (c) compressed — is recorded as R8.** |
| — | the row ships without the `## Resume doctrine` section | First accepted residual above (owner-ruled deferral). |
