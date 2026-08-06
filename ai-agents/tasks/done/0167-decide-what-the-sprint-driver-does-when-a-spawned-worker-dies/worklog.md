# Worklog — task 0167

**Role:** `fkit-architect`, spawned as the **Build** worker by `/fkit-sprint-ship-loop` (live `fkit lead`
driver session), 2026-08-04. The owner ruled for this run that the coder plans and the architect builds,
because the deliverable is architect work product and `/fkit-evaluate-approach` / `/fkit-record-decision`
are hook-locked to the architect role.

**No owner channel** (ADR-021). Every judgment call below was made by me and is recorded so the owner can
overrule any of them.

---

## Plan carry — verified before any work

First action, before reading anything else, per the spawn instruction:

| Check | Declared | Measured | Result |
|---|---|---|---|
| `wc -c plan.md` | 20369 | 20369 | ✅ match |
| `git hash-object plan.md` | `ba9a6976cb78964dd5a4d580c9f1711291aa2f19` | `ba9a6976cb78964dd5a4d580c9f1711291aa2f19` | ✅ match |

Read with `cat` (not the `Read` tool, which frames output `cat -n`-style). 195 lines.

⚠️ **Carry form, stated honestly as the plan itself does:** this is the **pointer form**. It pins *which
bytes were carried*, not *which bytes were approved*. Nothing verifies it at runtime; I checked it
myself. The `carried-not-approved` class is not closed by this check.

---

## What I did

Worked the plan's §3 Step 1 → Step 11 in order.

- **Step 1 — grounded in `0160`'s citation rule.** Read
  `reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md` §1, §1.1, §1.2 and the R22 scope
  correction. Applied the narrowed form to this report.
- **Step 2 — read the evidence base, corrected.** `fkit-sprint-ship-loop/SKILL.md` whole file (296
  lines); `fkit-task-ship-loop/SKILL.md` §*Durable state* and its exit-table invariants;
  `0111/review.md` (findings row R6 at `:26`, verdicts at `:46`/`:48`, accepted residual at `:76-79`,
  round-3 suppression at `:92-94`); `conventions/task-status-vocabulary.md` in full; `0134/brief.md`;
  ADR-037 context + decision sections.
- **Steps 3–6 — the four answers.** §§2–5 of the report.
- **Step 7 before Step 8**, per the plan's §7 sequencing note.
- **Steps 9–11** — `0134` reconciliation, follow-ups, self-verification.

### Verification work done firsthand (not taken from the brief or plan)

| Claim | Method | Result |
|---|---|---|
| The gap is still open | `/usr/bin/grep -n -iE 'crash\|died\|dies\|dead\|terminat\|abnormal\|529\|overload\|no response\|resume\|SendMessage\|heartbeat\|lease\|stale'` over the sprint loop | 9 hits, **none** about abnormal termination — all close-repair / deadlock / owner-resume. Confirmed |
| Instance 1 corroboration | `/bin/ls -la ai-agents/tasks/done/0118-*/` | **Only `brief.md` + `review.md`.** No `worklog.md`, no `plan.md`. Instance 1 is declared testimony only |
| Instance 1 — any death recorded in its ledger? | `/usr/bin/grep -n -iE 'crash\|529\|overload\|resume\|SendMessage\|died\|terminat'` over `0118/review.md` | one hit at `:127`, a reference to `0111`'s residuals. **Not** a record of the death |
| Instance 2 corroboration | `git log --numstat` then `git show 7616585` over `wiki/systems/testing-and-verification.md` | **`4 ++++`, 1 file changed, 4 insertions(+)**, dated 2026-07-30. Exactly the `+4/−0` claimed. Diff read: the four lines are **one semantic unit** |
| Did `0118` strand? | read `0118/brief.md` `## Status` | `✅ Done (agent-closed — not owner-verified)`. **No stranding** — load-bearing for the R6 reading |
| `SendMessage` documented anywhere? | `/usr/bin/grep -rn 'SendMessage' claude/` and over `ai-agents/knowledge-base/` | **no hits, exit 1**, both. Became follow-up 2 |
| `lease` / `heartbeat` anywhere? | `/usr/bin/grep` over both loops | absent from both. Supports §6's reading 2 |
| Does `## Durable artifacts` cite ADR-020? | `/usr/bin/grep -n 'ADR-020\|adr-020'` over the sprint loop | **one hit, `:120`** — the §2 **Plan** row, not the artifacts section. Sharpened §0.1 |
| Baseline for verification step 7 | `git status --porcelain` before writing | recorded in the report §11 |

All sweeps used `/usr/bin/grep` and `/bin/ls` explicitly. No unqualified "zero hits" appears in the
report; every empty result names its command and scope.

---

## Change surface

| File | Action |
|---|---|
| `ai-agents/knowledge-base/reports/2026-08-04-sprint-driver-response-to-a-dead-worker.md` | **created** — the ruling |
| `ai-agents/tasks/backlog/0167-…/worklog.md` | **created** — this file |

**Nothing else.** No `claude/skills/` edit (`git status --porcelain -- claude/` → empty). No brief filed.
No ADR. No `ai-agents/wiki-vault/` write. No board or status change. No task moved. **No commit.**

`plan.md` was **not re-authored** — the driver wrote it at approval and it is byte-unchanged.

---

## Decision log — every judgment call, and why

**1. Ruled Q1's disk classification as THREE states, not the brief's two.**
*Call:* the brief's coherent/incoherent binary is a test over *partial* state; instance 2's second death
was **empty**, which is not partial. *Why:* calling empty "coherent" routes the driver toward
proceed-or-defer when the truth is that nothing advanced. *Alternative rejected:* naming it a fourth
*outcome*, as the plan floated. It is an input state, not an outcome — the outcomes stay three.

**2. Ruled the nothing-landed branch as `escalate to the owner`, not a driver decision.**
*Call:* the driver reports and puts the choice to the owner. *Why:* what actually decided instance 2's
second death was a **liveness judgment about the API**, which is the excluded territory. Escalation is
not a retry rule, and it is the loop's native posture (`Owner decision pending`). *This is the single
call most likely to be read as a retry rule; §8 of the report addresses that head-on.*

**3. Named the incoherent branch's evidence as ZERO rather than smoothing it.**
*Call:* said plainly that neither instance produced torn state, so the branch the shape most needs is
the one never exercised. *Why:* verification step 2 demands per-instance honesty. Ruling it
`stop and ask` is reasoning, not evidence, and is labelled as such.

**4. Gave Q2 two grounds and ranked them — the non-analogical one first.**
*Call:* ground A (a worker that died mid-turn cannot in principle know whether its write landed) is
decisive and stands alone; ground B (the `fkit-task-ship-loop` doctrine) is an ***a fortiori*, not an
entailment**. *Why:* the plan required me to say which it is. Calling it an entailment would have been
false; calling it a bare analogy undersells it.

**5. Narrowed Q2's rule using ADR-037, which the brief could not have anticipated.**
*Call:* the driver's enumeration is an **input** to a resumed worker, never a **substitute** for the
worker's own skill-mandated re-derivation — and ADR-037 §3 forbids the driver from instructing otherwise.
*Why:* without this, the obvious implementation ("trust my enumeration, skip your fail-safe") would
breach ADR-037 the day it shipped. Non-obvious and load-bearing for follow-up 1.

**6. Narrowed the exit row's trigger from "a worker died" to "and the driver is not continuing this task
in this run".** *Why:* a recovered death produces no exit at all — instance 1, as reported, closed
normally. A row triggered by every death would fire on a task that then ships.

**7. Made Q3's status answer state-dependent — two vocabulary values, not one.**
*Call:* `🚧 Blocked — <reason>` when anything landed; reset to `🔲 Backlog` when nothing landed.
*Why:* the vocabulary's own rule (*"a status is only true if it is current"*). `🔲 Backlog` means *"not
picked up"*, which would be a lie over a landed half-edit; `🚧 Blocked` overstates when nothing is
obstructed. The `Plan rejected` row already resets to Backlog for exactly the nothing-landed reason.
*Cost accepted and stated in the report:* the board cannot distinguish a nothing-landed death from a plan
rejection. *Nothing was minted* — both values are in `task-status-vocabulary.md`.

**8. Ruled Q4 = both, in ONE follow-up task.**
*Call:* the row and the doctrine ship together. *Why:* a row whose action cell points at a
non-existent section is incoherent, and inlining the classification into a table cell is unreadable.
*Alternative rejected:* the row alone — it cannot carry Q1's classification or Q2's rule at all.

**9. Ruled the sprint-driver doctrine is NOT a copy of the sibling loop's, and said so in the report.**
*Why:* the task loop re-derives *its own* position; the driver must re-derive *a dead subordinate's*
while itself alive with a plausible-but-unreliable memory. A copy would answer the wrong question. The
plan did not ask for this; it emerged from reading both sections side by side.

**10. Ruled *"no crash-recovery anywhere"* does NOT stand as written, and distinguished both readings.**
*Call:* false as a blanket, true in the sense R6 meant, and **R6's acceptance survives on the corrected
rationale**. *Why:* the plan required the distinction rather than a silent pick. The decisive
reconciliation — that the task loop's fail-safe runs only on resume, and a crashed session never resumes
— is mine, not the plan's.

**11. Ruled the R6 reading `adjacent uncovered failure` → NO ADR.**
*Call:* four grounds (different actor, different harm, stated trigger unmet, "a rationale is not a
scope"). *Why:* the brief's conditional is "if and only if the ruling amends R6's acceptance". It does
not — the disposition and re-raise condition are untouched; only the rationale is corrected.
*⚠️ Flagged as owner-overridable in the report §7, with the exact reading that would flip it.* I did not
return this as `NEEDS-DECISION` because the plan explicitly delegated the call to me ("choose one of the
three on the record").

**12. Did NOT correct the frozen ledger `0111/review.md`.**
*Why:* it sits under `done/`; a review ledger records where things stood when findings were raised, and
editing it rewrites evidence — the reasoning the owner upheld in ADR-037's instance B. The correction
lives in the report.

**13. Quoted the `Blocked — hand-off didn't land` row verbatim despite the ⛔ retry exclusion, and
flagged the quotation for the step-6 checker.**
*Call:* reconcile by quotation, scope it three ways, explicitly decline to generalize, and add a note
warning a checker that the word "once" in the report is quoted existing text. *Why:* the plan mandated
reconciliation and warned that the likeliest breach was silently *importing* it as the Q1 answer. It is
not imported — Q1's answer is escalation. Ignoring the row would have left the ruling incomplete;
quoting it without the flag would have ambushed verification step 6.

**14. Ruled `0134` shares ONE premise, not a doctrine, and did not merge.**
*Call:* name "the driver's belief is derived from disk, never from a worker's report" once; keep the
rulings separate. *Why:* the remedies live in different domains — `0134` is write-authority governance
under ADR-033, `0167` is evidential/procedural with no authority component. Follow-up 5 is marked
**optional** because both rulings restating the premise is a cheaper acceptable outcome.

**15. Recorded TWO decay findings, not one.**
*Call:* the brief's false claim (mandated by the plan) **and** the plan's own risk-5 baseline, which was
already stale within hours because the owner committed in between. *Why:* the second was not in the plan
and is the stronger evidence for `0160`'s rider — two artifacts in this task's own chain decayed between
authorship and execution, on horizons of days and hours.

**16. Surfaced a tension inside `0160` itself rather than silently picking a side.**
*Call:* followed the plan's stricter heading-and-row-name form for `SKILL.md`, but recorded that
`0160`'s **table row 1** actually rules `path:NNN` *correct* for a skill file cited in a design doc,
while its own **R22 note** flags that row as bundling two uses that answer differently. *Why:* this
report is exactly the unresolved half of row 1. Raised as follow-up 6 for `0160`'s convention page.
The stricter form cost nothing, so no ruling was needed — only a record.

**17. Used the plan-approved filename and shape, without switching silently.**
Plain dated slug `2026-08-04-sprint-driver-response-to-a-dead-worker.md`, not
`/fkit-evaluate-approach`'s mandated `YYYY-MM-DD-eval-<slug>.md`; flat *Answer / Evidence / Limits* for
Q1–Q2, candidate-comparison shape only where there were real candidates (Q3's status choice, Q4). Both
were owner-approved as planned. **I did not judge the skill's naming binding** — the sibling rulings
(`0160`, `0162`) set the precedent and the owner ratified it.

**18. Recorded that `/fkit-evaluate-approach` Step 1's "ask the owner about priorities" could not be
performed** (ADR-021 — no channel in a spawn), and named which conclusion is most sensitive to the
weighting (§5's recommendation). *Why:* a skipped mandatory step is content, and concision does not drop
it.

---

## What I did NOT do, stated so nobody assumes otherwise

- **No ADR written** — ruled unnecessary (§7), flagged as owner-overridable.
- **No `claude/skills/` edit.** The report *specifies* the row and the doctrine; it does not write them.
  That is follow-up 1.
- **No brief filed.** This task names its follow-ups; the producer files them.
- **No wiki write.** The report should be ingested by `fkit-wiki`; I do not touch the vault.
- **No status or board change**, including this task's own `## Status` (the driver owns that).
- **No commit, no push.**

---

# Process-review worker — round 1 (2026-08-04)

Spawned by `/fkit-sprint-ship-loop` under the declared-approval marker (owner approved `plan.md` via
`AskUserQuestion` in the live driver session; `git hash-object` = `ba9a6976…`, `wc -c` = 20369, 195
lines — **all three re-confirmed byte-exact before acting**).

## ⚠️ State found on arrival — read before the decision log

**The deliverable had already been corrected for R1 and R3–R10, and for all three owner dispositions,
with no record anywhere.** Measured at start:

| What | Measured |
|---|---|
| Report | **833 lines**, mtime **12:10**, untracked (`??` — no git history to attribute edits to) |
| `review.md` | written **11:35**, against a **716-line** report; `## Coder response` **empty** |
| `worklog.md` | **200 lines** — no Process-review section, no decision log |

**Author of those edits: unestablished. I could not establish it, and I do not claim to have made
them.** This is a **work-landed / hand-off-unlanded** state — the exact shape this task rules on. I
handled it under the report's own Q1: *a complete unit landed* → **enumerate landed-vs-outstanding
from disk and verify, never trust a report that did not arrive.** So **every finding was re-measured
firsthand against its source** rather than accepted because the file claimed it.

**Two of the landed corrections were themselves defective** (below). Both were introduced by that
unrecorded round; neither came from the reviewer.

## Decision log — fixes applied without asking, and obvious-winner calls

Recorded per ADR-019's audit obligation, carried to this spawn by ADR-032 A4.

**1. Repaired R2's landed correction — removed a self-invalidating hit count.** *(fix applied without
asking)*
*Answers:* R2. *Changed:* §2(c)'s second sweep bullet in the report. The landed text obeyed the owner's
disposition (timestamp, preserve, do not re-scope) **but printed a live count** — *"this report names
`SendMessage` ten times, so the sweep returns 10 hits"*. **Measured 2026-08-04: 15 occurrences, 14
matching lines — the printed figure was false.** Replaced the number with the stable property (*every
hit is inside this file; no other knowledge-base file matches*), and said **why no count is printed**.
*Why it qualified:* verified `CORRECT` by firsthand measurement, mechanical and confined to one bullet,
and squarely **inside the owner's own R2 disposition** (preserve the evidence, timestamp it) — the
minimal correct way to satisfy it. Re-verified after the edit: `/usr/bin/grep -rln 'SendMessage'
ai-agents/knowledge-base/` → this file only.

**2. Repaired R3's landed correction — same class, same fix.** *(fix applied without asking)*
*Answers:* R3. *Changed:* §11's verification step-6 row. The landed text replaced *"one occurrence"*
with **"eight"**; **measured, there are 11**, five of them inside the correction sentence itself.
**Any number stated in that cell invalidates itself**, which is why round 1's figure was stale the
moment it was written. Removed the count; the claim is now the property — **exactly one occurrence
(§8) is the quotation of the `Blocked — hand-off didn't land` row; every other is an ordinary adverb;
none states a retry count, limit, or backoff.** *Why it qualified:* verified `CORRECT`, mechanical,
one table cell, inside R3's own remit and the approved plan. Re-verified after the edit:
`/usr/bin/grep -own 'once'` → 11 hits, `:660` is the quotation, remainder adverbs. **Step 6 passes on
substance throughout — the defect was only ever the stated argument.**

**3. Accepted R10 as a residual — obvious-winner call.** *(obvious-winner)*
*Answers:* R10. *Call:* accept as a residual, as the reviewer recommended; **not owner-ruled** — the
driver delegated it to me and I record it as **my** call. *Why it qualified as an obvious winner:* I
checked **all four sources firsthand first**, because altered *words* inside a quote labelled
"verbatim" would be a **correctness** defect and would have forced `NEEDS-DECISION`. They are not
altered — `0160`'s §1 table **row 1**, `0111/review.md:26` (frozen, line-cite permitted),
`conventions/task-status-vocabulary.md`'s **Backlog** row, and the flattened ADR-020 link all differ
from the report **only in bolding or link form**. With the words intact and the
reviewer's requested standing note already at §1, accepting dominates every alternative and stays
inside the plan's intent. ⚠️ **Sequencing flagged in the ledger:** §1 asserted the acceptance *before*
one existed; recording it is what makes that sentence true.

**4. Verified-only, changed nothing: R1, R4, R5, R6, R7, R8, R9.** *(no fix applied — the landed edits
were correct)*
Each was re-measured against its source (ADR-020 cited once in `fkit-sprint-ship-loop/SKILL.md`, in
§2's drive table, **Plan** row — and nowhere in `## Durable artifacts`; `git show --numstat 7616585` →
17 files / 1747 insertions with the wiki file at `4 0`; the BSD-grep BRE/ERE traps reproduced on this
host; `SKILL.md` §2, *"Mark the task `🔄 In progress` first"*, which precedes the Build spawn;
`git status --porcelain -- claude/` → empty). All
correct as landed. **I authored none of them and do not claim them.**

## What I did NOT do

- **No ADR written** — owner-ruled 2026-08-04: **no ADR**; §7 stands as written.
- **No brief filed.** R7's corrected wording is carried as **text inside §10 follow-up 1's ⛔ binding
  constraints**, exactly as the owner ruled — the producer who files it cannot miss it.
- **No edit to §3's Q2 headline** — owner-ruled to stay as the report's record.
- **No edit to the reviewer's *Reviewer findings* section.**
- **No `claude/skills/` edit, no wiki write, no status or board change, no commit, no push.**
- **No retry count, limit, or backoff written anywhere.** `0134` not merged.

---

# Instance-3 amendment round (2026-08-04) — `fkit-architect`

Spawned by `/fkit-sprint-ship-loop`. **This round is OUT of the approved plan** and was **separately and
explicitly owner-approved** via `AskUserQuestion` on 2026-08-04 (*"Add instance 3 to the report, then
re-review"*). The plan pointer is carried as **context, not as authority for this work**; re-confirmed
byte-exact anyway — `wc -c` = **20369**, `git hash-object` = `ba9a6976cb78964dd5a4d580c9f1711291aa2f19`,
195 lines. **`plan.md` was not re-authored and is byte-unchanged.**

⚠️ **Carry form unchanged from round 1: this is the pointer form. Nothing checks it at runtime; I checked
it myself.**

## Why this round exists

**A third instance of this task's own subject matter occurred during this task's ship.** A spawned
`@fkit-coder` running the Process-review step died when **the owner's network connection dropped**; the
driver read disk, concluded *"nothing landed"*, and was **wrong** — a partial landing was on disk. The
owner ruled it be recorded in the report's evidence base.

## What I changed, section by section

| Where | Change |
|---|---|
| Header | Added an **Amendment history** bullet — four rounds, one of them **unattributed**, and that unattributed round **is** instance 3 |
| §0 | One added pointer block: no ruling reversed; Q1 refined, Q2 strengthened, Q3/Q4/§6/§7 unchanged |
| §1 instances table | *"The two instances"* → *"The three instances"*; **third column added in the existing shape** (What is claimed / On-disk corroboration / Evidential weight) |
| §1 | **Replaced** the *"validated on n=1"* subsection with a **per-half standing table** — the old text is quoted inside the replacement, not deleted silently |
| §1 | New: **the instance-3 finding** (reading disk is necessary, not sufficient — four probes, why each missed) |
| §1 | New: **cause taxonomy** — API-side vs client-side, and why no ruling turns on it |
| §1 | New: **what instance 3 moves / does not move**, per ruling, plus an explicit ⛔ that the re-spawn is narrative fact |
| §2 | **Addendum to Q1 step 1** — enumerate the deliverable wherever it lives; `git status` is not a landing detector for an untracked path; a structural probe cannot answer a content question |
| §2(b) | **Correction in place** — *"neither instance produced torn state"* is true of a torn **file**, false of a torn **unit** |
| §2 *Limits* | n=1 bullet **amended**, narrowly — the partial state is now observed; the other two are still reasoning |
| §3 *Limits* | **Amended** — *"both instances"* was stale; instance 3 is confirmation **by necessity**, not by trial |
| §10 follow-up 1 | **THREE → FOUR binding constraints**; constraint **(4)** carries the which-disk rule into the SKILL text |
| §11 step 2 | Row extended — records the superseded n=1 framing and the §2(b) correction |
| §11 step 6 | A cited adverb example had gone stale (it lived in the paragraph I replaced) — **swapped, re-verified**, no count printed |
| §11 step 7 | **New measured baseline for this amendment**, with the observation that four of five lines are `??` |
| §12 | New open question 5 — should a deliverable be git-tracked before its worker is spawned? **Named, not answered** (it implies a commit; owner-only) |

## Verification done firsthand this turn (nothing taken on report)

| Claim | Method | Result |
|---|---|---|
| The deliverable is untracked — so `git status` carried no landing signal | `git ls-files --error-unmatch <report>` | *"did not match any file(s) known to git"* |
| …and still reads `??` | `git status --porcelain` over `reports/` + the task folder | report, `plan.md`, `worklog.md`, `review.md` all `??`; only `brief.md` is ` M` |
| The corrections **did** land | read the report — R4 block at §0.1, R6 at §2, R1 at §2(c), R5 at §6, R8 in §2 *Limits*, R9 at §11 | all present |
| …and landed **after** the ledger was written | ledger header declares *"(primary, **716 lines**, new)"*; its **R3** row cites `:673` for §11's step-6 row | line 673 is **blank**; that row is now far below it. Coordinates no longer resolve — **the file grew after the review** |
| Plan pointer | `wc -c`, `git hash-object`, `grep -c ''` | 20369 / `ba9a6976…` / 195 — all match, unchanged |
| `claude/` untouched | `git status --porcelain -- claude/` | **empty** |
| Report's `SendMessage` property still holds | `/usr/bin/grep -rln 'SendMessage' ai-agents/knowledge-base/` | **this report only** — property intact after my edits |
| Report's *"once"* property still holds | `/usr/bin/grep -own 'once'` over the report, then read each hit | the **§8 quotation is the sole quotation-use**; every other is an ordinary adverb; **my edits added none** |

**Could NOT be verified, and is labelled as such in the report:** the *cause* (owner testimony), and the
*outstanding* half of the partial landing — the empty `## Coder response` and the 200-line worklog are no
longer measurable, because the re-spawned worker filled both. Those rest on that worker's contemporaneous
record, cited by section rather than claimed as my measurement.

## Decision log — every judgment call this round

**1. Added instance 3 as a third COLUMN rather than a new subsection.**
*Why:* the spawn said *"in the same shape"*, and the existing shape is a per-instance column against three
fixed rows. A subsection would have let instance 3 answer different questions from the other two, which is
exactly how an evidence base drifts. *Cost accepted:* the table is now wide.

**2. Replaced the *"validated on n=1"* subsection instead of appending to it — but quoted the old text
inside the replacement.**
*Why:* a bare *"n=1"* is now false in one direction and still true in others, so leaving it standing beside
a contradiction would be worse than either. Quoting it keeps the change visible rather than silent.
*Alternative rejected:* a new single number (*"n=2"*). **Every candidate number is wrong**, because the
halves genuinely differ — hence the per-half table.

**3. Stated the standing per half rather than per instance.**
*Why:* instance 3 corroborates the **landing and its partiality** on disk but the **cause** is owner
testimony, and the driver's **process** remains unevidenced as ever. One number cannot carry that.

**4. Corrected §2(b) in place — the torn-file / torn-unit distinction.**
*Call:* §2(b)'s *"neither instance produced torn state"* becomes false with instance 3 unless the
distinction is drawn. Torn **file**: still zero instances. Torn **unit** across files: one, corroborated.
*Why this is not scope creep:* leaving a now-false sentence in a report just repaired for over-broad claims
would reproduce the exact defect class. **This is the sharpest thing instance 3 contributes** — the
multi-file torn unit is the form that actually occurs and the one a half-written-file check misses.

**5. Refined Q1's step 1 by addendum, and did NOT touch the three-state classification.**
*Why:* the spawn's bound is explicit — do not re-litigate the rulings. The classification was never the
problem; a driver reached the wrong **input** to it. So the fix is about *what to enumerate*, and it sits
as an addendum with the original text intact above it.

**6. Added binding constraint (4) to §10 follow-up 1, and changed its heading THREE → FOUR.**
*Call:* mine. *Why:* without it the refinement is inert — the SKILL would still say *"read disk"* without
saying which disk, and the failure repeats. I put it beside constraint (2) (the baseline gap) and said it
**sharpens** (2) rather than replacing it: (2) says *against what* to compare, (4) says *which paths*.
⚠️ **I did not touch constraint (1)** — that wording is owner-ruled from R7.

**7. Wrote NO retry rule, and said so at the point of temptation.**
*Call:* the driver's re-spawn is recorded as narrative fact with an explicit ⛔ beside it in §1.
*Why:* a reader reaching *"it re-spawned a fresh worker"* inside an evidence base is exactly where a retry
rule would be inferred. Flagging it there is louder than relying on §8 four sections away.

**8. Checked Q3, Q4, §6 and §7 against instance 3 rather than asserting they were unchanged.**
*Result:* none moves. For §7 I re-ran R6's four grounds against instance 3 — spawned worker died, driver
survived, **no task stranded** (`0167` stayed in flight), and R6's *Re-raise only if* trigger still did not
occur. *Why it is worth recording:* *"no change"* is only worth reading if it was tested.

**9. Ruled instance 3 STRENGTHENS Q2 but does not test it by trial — and named the difference.**
*Call:* *"confirmation by necessity, not by trial."* The successor **needed** the dead worker's account and
could get it neither by asking (worker gone) nor from history (file untracked). But no worker was asked and
believed, so the rule is still not tried. *Why:* calling it a trial would be the over-claim class this
report exists to avoid.

**10. Recorded that independent re-measurement — not any procedure — caught the two false corrections.**
*Why:* the honest limit of Q2's rule. The driver's disk enumeration protects the **driver's belief**; it
does nothing to validate an unattributed worker's **content**. Left unsaid, the report could be read as
claiming more coverage than it has.

**11. Added the git-tracking question as an OPEN QUESTION rather than a recommendation.**
*Call:* named for the owner, not answered. *Why:* tracking a deliverable at spawn time implies a **commit**,
and commits are owner-authorized only. It is the single change that would have prevented both of instance
3's failures, which is exactly why I must not slip it in as a rule.

**12. Updated the header's authorship rather than leaving it reading as single-author.**
*Why:* the file now has four rounds and one is unattributed. R9 was raised for precisely this class —
a stated surface that the file's own contents contradict.

**13. Repaired a stale example I created.** §11's step-6 row cited *"stated here, once, loudly"* as an
adverb example; that sentence was inside the paragraph I replaced. Swapped and re-verified.
*Why:* I broke it, in the same turn, in the same way this report keeps documenting. Recorded rather than
quietly fixed.

## What I did NOT do

- **No ADR** — owner-ruled; §7's *no ADR* and R6's acceptance both stand, and I re-checked them rather than
  assuming.
- **No brief filed.** Constraint (4) is text inside §10, exactly as R7's constraint was.
- **No retry count, limit, or backoff** anywhere.
- **No `claude/skills/` edit** (`git status --porcelain -- claude/` → empty), **no `ai-agents/wiki-vault/`
  write**, no board or status change, no task moved.
- **No edit to `review.md`** — neither the *Reviewer findings* nor the *Coder response* section. I cite
  them; I did not touch them.
- **`plan.md` not re-authored** — byte-unchanged, re-verified.
- **`0134` not merged.**
- **No commit, no push.**

---

# Process-review worker — round 2 (2026-08-04)

Spawned by `fkit-sprint-ship-loop` under its declared-approval marker. **Plan pointer verified byte-exact
before any edit** — `git hash-object plan.md` = `ba9a6976cb78964dd5a4d580c9f1711291aa2f19`, `wc -c` =
`20369`, both matching the marker (read with `cat`-class tools, not the `Read` tool, as instructed).

Round 2 findings: **R11–R18** — 0 high, 3 medium (R11, R12, R13), 5 low (R14–R18). Coverage **COMPLETE**
(Claude + Codex `codex-cli 0.145.0`). **Zero re-litigation**, confirmed independently against the round-1
*Coder response* rows and the R10 residual.

## Decision log — fixes applied without asking, and obvious-winner calls

**Owner-dispositioned before I was spawned (R11, R12, R13, R17, R18) — applied as ruled, not re-opened:**

1. **R11(a) — §2 state-table `complete` row narrowed by one clause.** *Answers:* R11 (states not disjoint;
   instance 3 satisfied *complete* as literally worded while §1 routes it *partial*, and the branches route
   differently). *Changed:* added *"and nothing on disk depends on a path that is missing — the remainder is
   separable"*. *Why it qualified:* **owner-ruled**, verified CORRECT firsthand against both definitions and
   both instances, mechanical/localized, and **disambiguation only — no ruling outcome moves** (instance 3
   stays *partial*, instance 2 death 1 stays *complete*).
2. **R11(a) cont. — the addendum's *"What this does NOT change"* clause repaired.** *Answers:* R11's
   falsified clause (it claimed the **definitions** were unchanged). *Changed:* now asserts the routing and
   **every instance's outcome** are unchanged, and states plainly that **one definition is narrowed**, with
   the reason and both worked instances. *Why:* owner-ruled, and leaving a knowingly false clause standing
   was not an option.
3. **R11(b) — §10 follow-up 1 constraint (4) gains an ⛔ OPERATIONAL TEST.** *Answers:* R11's blast radius
   (a SKILL written from constraint (4) would inherit a non-deterministic rule). *Changed:* a decision
   procedure over the paths the spawn instruction named — none / all / some discharged, with the
   discriminating question *"is the landed part usable with the missing paths never arriving?"* and **both
   worked examples** (instance 2 death 1 → complete; instance 3 → partial). *Why:* owner-ruled; it
   prescribes a **classification**, never a number of attempts, so the retry ⛔ is untouched.
4. **R12 — the *"driver misclassified"* row split into two, and graded honestly.** *Answers:* R12 (testimony
   promoted to direct evidence; the row contradicted the *"driver's PROCESS — zero instances"* row of the
   same table). *Changed:* **LANDING half** → *corroborated on disk*; **BELIEF half** → *DRIVER-REPORTED
   testimony*, noting the re-spawn does not discriminate. *Why:* owner-ruled ("downgrade, split the row; do
   not leave a single row graded directly evidenced").
5. **R13 + the STANDING RULE — self-referential coordinates stripped.** *Answers:* R13 (three printed
   coordinates, **all three verified false** by me against the current file). *Changed:* the instance-3
   *On-disk corroboration* cell now prints **no number of its own** and states the stable property; the
   quoted *"716 lines"* is kept because it is a quotation of the ledger, not a self-measurement. Swept the
   whole report for the class — every surviving coordinate points at another file. *Why:* owner-ruled as a
   **standing rule**, recorded in the ledger's *Accepted residuals*.
6. **R17 — §7 grounds 1–3 made three-instance.** *Answers:* R17 (a two-instance enumeration in the section
   carrying the ADR decision). *Changed:* *"All three instances"*, *"**No** instance produced stranding"*,
   *"any of the three"*, plus instance 3's facts and an update note. *Why:* owner-ruled FIX; **no ground
   changes and the ruling is untouched** — re-checked all four grounds against instance 3.
7. **R18 — WON'T FIX, and the tension recorded rather than resolved silently.** *Answers:* R18 (an
   unverifiable delta clause in §11's step-6 row). *Changed:* **nothing.** *Why:* owner-ruled won't-fix,
   closed under the standing rule. ⚠️ **Disposition 3 (*strip any self-referential delta*) and disposition 4
   (*R18 won't fix*) point opposite ways at this one clause. The specific ruling governs; I left the clause
   untouched and recorded the tension in the ledger** so a later reader knows the clause survives a rule
   that would otherwise have removed it.

**NOT owner-dispositioned — verified by me and applied under the ADR-019 standing-approval discipline
(verified `CORRECT`, mechanical/localized, inside the approved plan):**

8. **R14 — §1 item 2's blanket claim narrowed.** *Answers:* R14. *Verified firsthand:* `git ls-files
   <task-folder>` → **`brief.md` only**; porcelain shows `brief.md` ` M`, the other four `??`. So *"no part
   of this task's surface"* was false and §11's *"four of the five"* was right. *Changed:* now **"no worker
   deliverable in this task carried a git landing signal"**, naming `brief.md` as the one tracked path.
   *Why it qualified:* one sentence, contradiction between two sections of the same report, substantive
   point unchanged.
9. **R15 — §3 *Limits* sub-point (2) disambiguated.** *Answers:* R15. *Changed:* headed *"Its AUTHORSHIP
   could not be reconstructed"* + one clause stating that landed-vs-outstanding **was** derived from disk
   and the *"strengthened"* verdict rests on sub-point (1). *Verdict I assigned:* **PARTIALLY CORRECT** — I
   adopt the reviewer's narrowing and **not** Codex's *"contradicts itself"* framing, because the bullet's
   closing sentence already concedes the split. *Why it qualified:* wording only, no verdict in §3 moves.
10. **R16 — §12 question 5's false reason corrected.** *Answers:* R16. *Verified firsthand in a scratch
    repository **with no commits at all***: after `git add`, `git status --porcelain` → `A `, `git ls-files`
    → the path, `git log` → *"does not have any commits yet"*. **Tracking does not imply a commit.**
    *Changed:* a correction block; the **"I do not rule on this"** posture is **kept** — ruling is not mine
    to take — and the stage-only option is no longer foreclosed on a false premise. *Why it qualified:* a
    verified-false factual claim, localized, and it changes no ruling.

**Obvious-winner calls (within the dispositions' intent, not separately ruled):**

11. **The instance-3 *Evidential weight* cell split to match R12's row split.** It carried the same
    *"Directly evidenced"* label the owner ordered downgraded; leaving it would have re-created the finding
    two rows away. **One option clearly dominates.**
12. **Two further rows R12 names, each fixed with a qualifier:** *"landing occurred, and was coherent"* now
    says **at FILE level** and marks instance 3 *file-coherent, UNIT torn*; *"A landing was PARTIAL"* now
    says **corroborated for the LANDED half only**, with the outstanding half marked no-longer-measurable.
    Both are inside R12's finding and inside the owner's *"do not leave a row graded directly evidenced"*
    intent; neither moves a ruling.
13. **The `200-line worklog` figure left as written, and flagged rather than silently kept.** It is a
    *historical* state of **another** file, already marked *"no longer measurable"* in the same sentence, so
    it is outside the standing rule's *"measured against this file"* scope. Recorded in the ledger's *Not
    adopted* list so the choice is visible.

## Verification done firsthand this turn (nothing taken on report)

- Plan pointer: hash + byte count both match the marker.
- R13's three coordinates: re-measured against the current file — **all three false**, as claimed.
- R14: `git ls-files` + `git status --porcelain` over the task folder and the report.
- R16: scratch `git init` / `git add` repository with zero commits.
- R11: both state definitions re-read and tested against instances 2 and 3.
- Post-edit sweeps: no coordinate/count/delta measured against the report survives outside quotations of
  other documents; `/usr/bin/grep -niE 'backoff|retry|retries|re-spawn|respawn'` → **no count, no limit, no
  backoff**, in new text or old.
- `node --test` re-run after the edits — result recorded in the return to the driver.
- ⚠️ **`bash test/prove-red.sh` NOT run** — owner-ruled skipped this run; `0214`/`0215` document an
  unrepaired work-dir landmine in it.

## What I did NOT do

- **No ADR**, **no brief filed**, **no `claude/skills/` edit**, **no `ai-agents/wiki-vault/` write**, **no
  commit, no push**, **`0134` not merged**, **`plan.md` not re-authored**.
- **§10 constraint (1) not touched** — owner-ruled from R7 and re-verified intact.
- **No reviewer section edited** — neither *Reviewer findings* nor the *Round 2 — reviewer notes*; and the
  **round-1 *Coder response* table is unchanged**. I appended a *Round 2 — Coder response* subsection only.
- **No retry policy** in any form.
- **Ledger `Status:` left at `in-review`** — round-2 fixes are applied, not self-certified; whether a round
  3 runs is the driver's call.
