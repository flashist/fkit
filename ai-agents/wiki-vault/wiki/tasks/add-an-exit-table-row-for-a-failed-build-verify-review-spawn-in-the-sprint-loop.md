# Add an exit-table row for a failed Build / Verify / Review spawn in the sprint loop

**Source**: `ai-agents/tasks/done/0208-add-an-exit-table-row-for-a-failed-build-verify-review-spawn-in-the-sprint-loop/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-05
**Sprint/Tag**: Sprint 2 · ID `0208` · owner `fkit-coder`

## Goal
**Follow-up 2 of `0202`'s review (finding `R5`).** The sprint loop's §5.4 exit table had **nine rows** and **only the *producer* spawn — the close — had a failure row**. A Build, Verify or Review spawn that dies, is denied, or returns nothing had none.

**Why the gap mattered now and did not before:** since `0202` the driver writes `<task-folder>/plan.md` **at plan approval, before the Build worker is spawned**. A failed Build spawn therefore leaves a **durable approved-plan artifact on disk for a task nobody is working** — an orphan, with the task's status telling a future driver nothing. **The resume guidance for exactly that window existed and was in the wrong place:** inside `0202`'s `worklog.md`. ***No future driver reads another task's worklog. Guidance only a human archaeologist will find is not guidance the loop has.***

## Key Changes
**One file — `claude/skills/fkit-sprint-ship-loop/SKILL.md`, +12 / −1.** Three edits:

- **The new row**, inserted directly above `Blocked — hand-off didn't land`. **Its trigger covers FIVE non-producer spawns — Plan, Build, Verify, Review and Process-review — not the brief's literal three.** ⚠️ **Owner-ruled at approval:** the literal three would have missed **`0167`'s only disk-corroborated instance, which was a Process-review worker.** The divergence is recorded; **the brief's title was not edited.**
- **A scoping clause appended to the producer row's trigger cell** — its single re-spawn is **close-step only and is not a general worker-retry rule**, so a later reader cannot mistake one for the other.
- **The orphaned-`plan.md` blockquote**, stating what happens to an already-written plan and what a resuming driver does when it finds one.

**Row count 9 → 10, table shape unchanged.** Status values checked against `task-status-vocabulary.md` — `🔲 Backlog`, `🔄 In progress`, `🚧 Blocked — <reason>`. **Nothing minted.**

### ⛔ Three defects were found IN THE APPROVED PLAN'S OWN BYTES, and the owner ruled on all three
The Verify round found them **in the plan's verbatim block, not in the copy of it** — `diff` confirmed byte-identity at Build. **They survived the plan gate.** ⚠️ **The shipped row now diverges from `plan.md` deliberately; `plan.md` was NOT re-authored, and a later reader must not "restore" the plan's text — the plan is the defective version here.**

| | Defect in the approved plan | Owner ruling, as applied |
|---|---|---|
| **D1** | A trailer (*"Either way: report it — do not pause the sprint"*) **contradicted branch 3**, which routes to `Owner decision pending` and pauses. **A driver hitting a torn unit could read the trailer and advance without ever asking the owner** — on the exact branch `0167` says *"no agent may guess"* about. *"Either way"* was also a **two-item word over three branches** | Trailer bound to the non-pausing branches only; **branch 3's pause left unqualified and un-removed** |
| **D2** | The nothing-landed branch **dropped `0167` §2's *"Do not decide alone"*** — it reset, skipped, reported and moved on, i.e. the driver deciding alone | **Follow §4's pairing.** Branch 1 now does all three: reset → `🔲 Backlog` in both locations, add to the per-run skip set, **and put the choice to the owner** — because *how many re-spawns are allowed* is unruled, which is owner territory |
| **D3** | Branch 3 named **no status at all** — defensible as a pause-not-exit, but **silent, and indistinguishable from an oversight** | State it: **the task stays `🔄 In progress` while the owner is asked — a pause is not an exit, so no terminal status is written** |

**The D1/D2 interaction was resolved by the worker from the file's own text rather than escalated** — the trailer binds branches **1 and 2**, because ***escalating is not, by itself, a pause***. Three textual grounds, all in §5.4: the `No Codex, degraded` row **already** puts something to the owner **and proceeds**; the per-run skip set is a **continue** device a pausing branch could never consume; and **only branch 3 names `Owner decision pending`**, which is where the `pause` actually comes from. **The reasoning is now in the row**, so the next reader need not re-derive it. ⚠️ **If it is wrong, the load lands on the first ground.**

## Outcome
`npm test` → **567 pass / 0 fail**, `prove-red.sh` gate **PASSED**, all 14 mutations red. ⚠️ **Regression checks only — no test reads this file's body**; `skill-frontmatter.test.js` discards everything after the closing `---`, and a grep for the section's terms across all 16 test files **exits 1**. **The only evidence the row landed is the read-back and the reviewer's pass.**

**No retry policy was created.** A retry-lexicon sweep over the new row returned **one** hit — the word *"re-attempted"*, inside a reference to the **owner's** pending decision. The row explicitly says the question **"is unruled and the driver must not settle it."**

**The delta was separated from two concurrent edits to the same file by hunk position cross-checked against content** — `0203`'s +92 in the honor-the-ADRs block, `0191`'s +13 in `## Hard rules`, and this task's +12/−1. **Arithmetic closes both ways.** File is now **412 lines**. `.claude/` was **not** regenerated, so a running driver keeps the old text until its next launch.

### ⛔ It knowingly DEFERS `0167` §5 — it does not satisfy it
`0167` §5 ruled the row and a `## Resume doctrine` section **must ship together** and **explicitly rejected row-alone**. **The owner ruled A anyway**, directing the doctrine half be filed as its own brief — task **`0228`**. ⚠️ **Recorded as fact this round: `0167`'s follow-up 1 had NEVER been filed at all** — verified 2026-08-05, no task folder matched it and the boards carried only narrative prose, **not a row**. It existed solely inside `0167`'s report §10 and this task's own artifacts.

**Until the doctrine half ships, two things stay open:** the row carries `0167`'s decision **outputs**, not its **operational procedure** — *a table cell cannot carry a three-state classification* — and `0167` §3's no-self-report rule **has nowhere to live** and is **named, not smuggled in**. ⚠️ `0167` §2's part **(c)** (*a structural probe cannot answer a content question*) is compressed in the cell to the two words *"compare **content**"* while (a) and (b) are carried near-verbatim; **the asymmetry is real and accepted on the same ground** — (c) is a decision procedure, not a terminal-state instruction.

### The divergence from `0167` §4 is now recorded on BOTH sides
The shipped partial-case behaviour **contradicts `0167` §4's written status ruling**, on owner ruling D3. That residual's stated re-raise condition was *"`0167` §4 is amended"* — and it is **✅ DISCHARGED**: a producer filed the **dated correction note on `0167`'s report**, append-only with no line above edited, and the reviewer independently confirmed it says what the ruling says. **Kept as history, not as a live residual.**

⚠️ **Every round of this task introduced a new finding through its own fixes** — `R9` was created by the `R5` fix — which is why one cosmetic under-specification (*"both `Blocked` rows above"*, where three §5.4 rows carry a `Blocked — …` name) was **deliberately accepted rather than repaired**: both reviewers resolved it correctly unprompted.

## Related
- [[tasks/decide-what-the-sprint-driver-does-when-a-spawned-worker-dies]] — task `0167`, the ruling this row implements. **Its §4 partial-case status is superseded by what shipped here**, and its §5 ship-together requirement is **deferred, not met**
- [[tasks/write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table]] — task `0202`, whose `plan.md` write **opened the orphan window** this row closes, and whose review row `R5` is this task's source
- [[tasks/amend-the-sprint-loops-honor-the-adrs-rule-with-the-faithful-carry-construction]] — task `0203`, same file, different region; **its corrected coordinates were the ones re-derived here**
- [[tasks/add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules]] — task `0191`, the third concurrent edit to the same `SKILL.md`
- [[tasks/build-fkit-sprint-ship-loop-skill]] — task `0111`, the loop and its exit table
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the loop's consent model
- [[decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record]] — the ledger-closing rule this task's rounds ran under
- [[tasks/enforce-task-status-vocabulary]] — the closed six-value status set the three branches draw from; **nothing minted**
- [[systems/testing-and-verification]] — why a green 567 proves only that nothing broke
- [[tasks/sprint-2-remove-omnigent]] · [[systems/fkit]]
