# Plan — `0352` — ADR: the narrow in-flight review-fix lane

**Planned 2026-08-30 by `fkit-architect` (Plan worker of `/fkit-sprint-ship-loop`).** Every figure below was re-measured today with the command shown; none is carried forward from the brief or the lead's briefing.

---

## ⭐ OWNER RULINGS, 2026-08-30 — THESE SETTLE THE PLAN'S OWN OPEN QUESTIONS

Four rulings given live via `AskUserQuestion` in the `fkit lead` session at the plan-approval gate. Option labels are **verbatim**. Where a ruling and the plan text below disagree, **the ruling wins**; the plan text is left byte-identical as the record of what was proposed.

**Ruling 1 — plan approval.** Label: **"Approve as written (Rec)"**. → The plan below is approved.

**Ruling 2 — on §1's open question 1, ADR status.** Label: **"accepted (Rec)"**. Presented as: *you ruled the decision on 2026-08-29, and `/fkit-record-decision` step 1 asks only that a decision be settled, not implemented. The ADR itself will state that nothing changes behaviour until the five follow-up skill edits ship.*
→ ⛔ **ADR-045 ships with `Status: accepted`.** The plan's alternative (`proposed`) is not taken.

**Ruling 3 — on §2.8's open question 2, a sixth follow-up.** Label: **"Name it as a candidate (Rec)"**. Presented as: *`fkit-task-ship-loop`'s close report may need to mention lane-terminated findings — otherwise the lane is invisible in the close, and a reader of the close report can't see what the review absorbed. Named as a candidate only; filing it stays the producer's act.*
→ ⛔ **The ADR names `fkit-task-ship-loop` as a SIXTH follow-up candidate**, alongside the brief's five. ⛔ Named only — filing remains the producer's act, and no skill file is edited by this task.

**Ruling 4 — on §2.3's open question 3, the fifth hard limit.** Label: **"Keep it (Rec)"**. Presented as: *it's a real hole. The fail-safe rule already closes it implicitly, but stating it explicitly stops someone rediscovering it mid-review. A team wanting the lane runs the review stateful.*
→ ⛔ **Limit 5 (ephemeral reviews cannot use the lane) STAYS in the ADR**, stated explicitly.

⛔ **Everything below this section is the architect's returned plan, byte-identical.** Read it with the four rulings applied.

---

## 0. Grounding measured today (2026-08-30)

| Fact | Value | How measured |
|---|---|---|
| Suite | **792 tests, 792 pass, 0 fail** | `npm test` |
| Mutation gate | **hard gate PASSED**, 28/28 mutations red a named assertion | `npm test` (prove-red tail) |
| Highest ADR on disk | **044** → next free is **045** | `/fkit-record-decision` Step B pipeline, verbatim |
| Malformed ADR filenames | **none** (Step A printed nothing) | `/fkit-record-decision` Step A pipeline, verbatim |
| `ADR-045` claimed in prose anywhere | **no hits** | `grep -rn "ADR-045\|adr-045" ai-agents/ claude/ test/` |
| Review ledgers on disk | **130** | `ls ai-agents/tasks/*/*/review.md \| wc -l` |
| Ledgers carrying `File(s) under review:` | **127 of 130**; 3 missing the field, **12 more carry it empty** | per-file `grep` loop over the 130 |
| Ledgers whose `Status:` value begins `in-review` | **43** | per-file `sed 's/^Status:[[:space:]]*//'` + `case` |
| …begins `closed-out` | **63** | same |
| …begins with **neither** | **22** — e.g. `**closed-out**` (bolded), `converged`, `resolved`, `coder-responded (Round 1)`, `CLOSED` | same |
| …no `Status:` line at all | **2** | same |

⭐ **That last block is the plan's most load-bearing measurement and it changes the design.** 24 of 130 ledgers (18%) do **not** expose a mechanically readable `Status:` value today. Any entry condition that reads that field must state what happens when it cannot be read. This plan rules it **fail-safe** (§2.1, limit E).

**Documents read in full:** the brief; `ADR-034`; `ADR-044` (§Context, to confirm my own staffing); `claude/skills/fkit-stateful-review/SKILL.md`; `claude/skills/fkit-process-stateful-review/SKILL.md`; `claude/skills/fkit-record-decision/SKILL.md`; the six-week retro report; `conventions/durable-citation-anchors.md`; `claude/skills/fkit-task-brief/SKILL.md` §standing rule.

**Staffing confirmed, not assumed.** ADR-044 §Decision 1 staffs Plan/Build by the deliverable's producing skill. The deliverable is one ADR; ADR files are produced by `/fkit-record-decision`, which is architect-owned. I am the right worker and I am not re-routing.

---

## 1. What gets written

**One file, and nothing else:**

`ai-agents/knowledge-base/decisions/adr-045-an-in-flight-review-finding-terminates-in-the-ledger-not-a-new-task.md`

**Title:** `ADR-045: A reviewer's in-flight finding terminates in the review ledger, not in a new task folder`

**Status:** `accepted` — the owner ruled the shape on 2026-08-29 via `AskUserQuestion` (option label *"Narrow it — in-flight review fixes only (Rec)"*). `/fkit-record-decision` Step 1 requires the decision be settled; it is. ⚠️ If the owner would rather this land as `proposed` pending the follow-up skill edits, say so at the approval gate — that is a one-word change and the only field the plan cannot settle alone.

⛔ **The number is re-derived at write time, not copied from this plan.** Both pipelines re-run, plus the manual "is 045 spoken for by work in flight" look that `/fkit-record-decision` says no pipeline can do.

---

## 2. What the ADR decides — the substance the owner is approving

### 2.1 §The entry condition — three field reads, no judgement call

A finding is **in-flight** when **all three** hold. Each half of the brief's candidate condition gets a named artifact, and all three artifacts are **fields that already exist** in the ledger schema shared by `fkit-stateful-review` and `fkit-process-stateful-review`:

| # | Condition | Proving artifact (existing) |
|---|---|---|
| A | The finding **came from this review** | It is a row in the ledger's `## Reviewer findings` table, carrying this pass's `Round` |
| B | The finding is **about the diff under review** | Its `file:line` cell names a file inside the ledger header's `File(s) under review:` field |
| C | The review **has not closed** | The ledger header's `Status:` reads `in-review` |

**What stops B being argued wider later** — the anti-widening rule, stated as a rule, not a hope:

> ⛔ **The `File(s) under review:` field is not edited to admit a finding.** It records the diff the review opened on. Widening it mid-review is not admitting a finding to the lane — it is reviewing a different diff, which is a new review.

**E — the unreadable-gate ruling (this is the measured 24-of-130 case).** If any of the three artifacts is **absent, empty, or written in a form the condition cannot read** — a missing or empty `File(s) under review:`, a `Status:` line that is absent or reads something other than `in-review`/`closed-out` — the finding is **not** in-flight and files a brief. **An unreadable gate is a closed gate.** This costs nothing to a reviewer who wants the lane: they own the header and can write the field conformingly. It is deliberately self-correcting in the safe direction.

The measurement above is quoted **in the ADR** as the reason this ruling exists, so a later reader sees the hazard was counted, not imagined.

### 2.2 §The route — the ledger is declared the terminus; no new mechanism

- **The reviewer** writes the finding as a row in `## Reviewer findings` (`fkit-stateful-review` Step 4). Unchanged.
- **The coder** writes one `## Coder response` row (`fkit-process-stateful-review` Step 4), gates any code change on the owner's explicit approval (Step 5), applies only what was approved and sets the row's `Status` and `Action` (Step 6). Unchanged.
- **The record a reader finds six months later** is that pair of rows, inside the task folder that carried the diff, at `ai-agents/tasks/<board>/<NNNN>-<slug>/review.md`: what was found, where, the verdict, what was done about it.
- ⭐ **One content requirement is added, and it is the lane's audit trail:** where a lane fix changes code, the `Action` cell **names the files it touched**. That makes the lane's whole footprint in a task readable from one table and countable later. It is a content rule for an existing cell — **the ADR decides it; a follow-up skill edit implements it** (§2.5).

### 2.3 §The hard limits — the brief's four, each ruled by name, plus a fifth

| # | Case | Ruling |
|---|---|---|
| **1** | Finding **out of scope of the diff** | ⛔ **Does not use the lane.** Condition B fails. It files a brief. Out-of-scope work is new work, and the owner's ruling exempts no new work. |
| **2** | Finding arriving **after the ledger closes** | ⛔ **Does not use the lane.** Condition C fails. It files a brief. Named against **ADR-034** — see §2.4. |
| **3** | Finding the coder **disputes**, or the owner rules against | ✅ **The lane still terminates it — when it is resolved, not merely argued.** The terminal set is the *existing* Status vocabulary: **`✅ done`, `disproven`, `won't fix (frontier)`, `closeout (re-litigation)`** all terminate in the ledger. **`pending approval` and `blocked` do not** — a finding a review ends on either of those, or one the owner agrees is real but **defers**, is unresolved work and files a brief. ⭐ This is not a new bar: it is exactly the ledger's own close condition, so the lane cannot terminate a finding the ledger itself would not close over. |
| **4** | A **large** in-scope in-flight fix | ✅ **Stays in the lane.** Size is irrelevant by owner ruling. What stops it becoming a hiding place is §2.6 — and the first line of that answer is that the owner's per-finding approval gate is untouched. |
| **5** ⭐ | *(beyond the brief's four — flagged as an addition, not a substitution)* A finding raised in an **ephemeral** review | ⛔ **The lane requires a stateful ledger.** `fkit-review` and `fkit-process-review` write no persistent file *(both SKILLs, §Hard rules: "Writes no persistent file — no ledger, no shared doc")*, so conditions A–C have no artifact to read. Condition E therefore already closes the gate; the ADR states it explicitly so it is not rediscovered. A team that wants the lane runs the review **stateful**. |

### 2.4 §Interaction with ADR-034 — three points, each stated rather than left to discovery

1. **A lane finding is a work-product defect by construction.** Condition B puts it inside the reviewed diff, which is ADR-034's *work product* surface. So it **blocks the close and drives another round**, exactly as ADR-034 requires. ⭐ **The lane relaxes nothing in ADR-034's bar.**
2. **⛔ `Accepted residuals` is not a parking space for a defect.** Under ADR-034 that row is for a frontier-move or an own-record residual. Recording a real in-scope defect there to avoid *both* a fix *and* a brief is the abuse this ADR forbids by name.
3. **The closed-ledger edge**, named by ADR number as the brief requires. ⚠️ **A drafting accuracy note the Build worker must honour:** ADR-034 establishes that `closed-out` is the ledger's terminal state and what bar sets it. It does **not** contain the word "frozen" — I grepped ADR-034 and the conventions folder today and the word is absent from both. The ADR will therefore **derive** the edge from ADR-034's close bar (a closed ledger is the completed record of a finished review; a later finding was not part of that review) and will **not** put "frozen" in ADR-034's mouth. Where the don't-edit-closed-records rule is wanted, the ADR points at `claude/skills/fkit-task-done/SKILL.md`, which is where 0353's plan located it.

### 2.5 §What is unchanged — mandatory section

- `/fkit-task-brief`'s standing rule is quoted **verbatim** from the SKILL and stated to be **untouched, byte-for-byte**: *"All tasks should be split into the smallest possible shippable tasks. If a part of a bigger system can be developed, tested and shipped separately, it's worth creating a sub-task for it and splitting the bigger task. Sometimes the producer can make that decision themselves; sometimes they need to consult the architect to clarify the technical scope."*
- Its step-3 test — *"The test is independent shippability, not size or effort"* — is likewise unchanged.
- **No category of new work is exempted.** The lane changes where a *reviewer's finding on the diff in front of them* is recorded. It exempts nothing from filing.
- **⛔ There is no size floor**, in any form, at any point in the ADR.

### 2.6 ⭐ §What stops the lane becoming a hole — named failure mode, three checks

**The failure mode, named:** *scope creep by review.* Work that would have been a ranked, owner-visible board row gets performed inside a review round and never appears on any board. The symptom is the retro's own warning realised backwards — the created-per-closed ratio improves while the work volume does not. The retro states the trap directly: *"The target is not 'fewer open tasks.' … If open count falls while the rework share holds, nothing was fixed."*

**Three checks, cheapest first:**

1. ⭐ **Structural, and already in force — the owner's consent gate is untouched.** `fkit-process-stateful-review` Step 5 gates every code change on the owner's explicit approval, finding by finding, and Step 6 applies only what was approved. **The lane removes filing ceremony, not consent.** Nothing enters the lane that the owner did not see and approve. This is the load-bearing answer to limit 4.
2. **Boundary — the scope test plus the anti-widening rule** (§2.1 B and the ⛔ rule under it). Size does not gate the lane; **scope does**, and the scope field cannot be edited to let something in.
3. **Observable — the `Action` cell names the files touched** (§2.2). The lane's footprint is then countable from the ledgers, so the next re-measurement against the retro's baseline can separate *ceremony removed* from *work absorbed*.

**Re-raise only if** (the ADR's §Residual risks, which is what stops a future review re-litigating this):
- a lane-terminated fix is found to have shipped a behaviour change that **no brief and no ledger row describes**; or
- a `File(s) under review:` field is found **edited mid-review to admit a finding**; or
- the created-per-closed ratio falls while the **volume of code changed per task rises** — the lane absorbing work rather than removing ceremony.

Do **not** re-raise it merely because a lane fix turned out to be large. Size was ruled irrelevant by the owner on 2026-08-29.

### 2.7 §Options considered

- **The narrow in-flight lane (chosen)** — the owner's ruling of 2026-08-29.
- **A size floor on what needs a brief (rejected).** Recorded as **rejected by name**, with the owner's 2026-08-29 ruling as the reason, so a later reader can tell a rejected option from an unconsidered one. ⛔ It is **not** written as revivable and carries no "could be revisited" clause.
- **Leave it unwritten (status quo)** — rejected: a reviewer's finding today becomes either an invisible in-place fix or a record-repair row, and the retro measured record repair at **42 of 129 open rows (33%)** on 2026-08-29 by a stated, re-runnable title rule.

### 2.8 §Follow-ups — named, not edited

The five the brief enumerates: **`fkit-stateful-review`**, **`fkit-process-stateful-review`**, **`fkit-review`**, **`fkit-process-review`**, **`fkit-task-brief`**. Named only. ⛔ Filing them is the producer's act, after this ADR is accepted; ⛔ `/fkit-task-brief` is not amended by this task, and naming it here is the whole of this task's reach into it.

⚠️ **One candidate sixth, flagged and NOT added unilaterally:** `fkit-task-ship-loop`'s close report may need to mention lane-terminated findings, or the lane is invisible in the close. The brief enumerates five; I am not widening its list on my own authority. **Owner's call whether the ADR names it as a sixth candidate.**

⚠️ **One open question carried, not settled:** task `0362` records that the ship-loop's Process-review step is coder-owned while ADR-044 can staff Build to a non-coder, in which case the ADR-018 hook denies the skill. The lane routes through `fkit-process-stateful-review`, which is coder-owned — so the lane's route **touches** that question. The ADR will **name `0362` as the open question and settle nothing about it**, per the spawn's instruction.

---

## 3. Drafting constraints the Build worker must honour

- ⛔ **No `path:NNN` citations anywhere in the ADR.** Anchor on file + quoted fragment (`conventions/durable-citation-anchors.md`, *"Never cite a line number naked"*). This overrides `/fkit-record-decision`'s generic *"Cite `path:line`"* template line — the brief rules it explicitly for this ADR.
- ⛔ **The words `trivial`, `one-liner`, `small enough` must not appear**, and no numeric line/byte/word threshold, **not even inside the rejected-option paragraph.** Name the rejected shape as *"a size floor"* and nothing else. This is what makes the brief's verification step 4 pass cleanly rather than by argument.
- ⛔ **Do not attribute the word "frozen" to ADR-034** (§2.4 point 3).
- Structure per `/fkit-record-decision` Step 3, with the brief's five questions each getting its own section.

---

## 4. Verification steps — the exact commands, with expected output

1. **File exists, number correct, status set**
   `ls ai-agents/knowledge-base/decisions/adr-045-*.md` → exactly one file; `head -5` shows `# ADR-045: …` and `- **Status:** accepted` (or `proposed`, per the owner at §1).
2. **Number re-derived at write time** — re-run `/fkit-record-decision` Step A (expect **no output**) and Step B (expect **44** before the write), plus `grep -rn "ADR-045" ai-agents/ claude/ test/` before writing.
3. **Exactly one new file plus this task's own folder**
   `git status --porcelain` / `git diff --stat` → ⛔ **zero** changes under `claude/`, `test/`, `ai-agents/sprints/`, `ai-agents/wiki-vault/`. ⚠️ **The tree is dirty with other workers' concurrent changes** — report this task's own contribution explicitly rather than the whole diffstat, and say so.
4. **`fkit-task-brief` provably untouched** — `git diff --stat -- claude/skills/fkit-task-brief/SKILL.md` → **empty output**. Paste the command and its empty result; do not assert it.
5. **No size floor** — `grep -niE 'trivial|one-liner|small enough|under [0-9]+ (lines|bytes|words)|[0-9]+[- ]line' <adr>` → **zero hits**.
6. **The unchanged section exists and quotes the standing rule verbatim** — `grep -c "smallest possible shippable tasks" <adr>` → **≥ 1**; diff the quoted block against `claude/skills/fkit-task-brief/SKILL.md` to prove it is byte-identical.
7. **All five brief questions have a section; all five limits carry a ruling** — `grep -n '^## \|^### ' <adr>`, walked against the brief's list. No limit reads "to be decided".
8. **ADR-034 named by number** — `grep -n 'ADR-034' <adr>` → **≥ 1 hit**. And `grep -ni 'frozen' <adr>` must not attribute that word to ADR-034.
9. **Follow-ups named and not edited** — the five skill names appear in the ADR; cross-check against step 3's diffstat showing zero changes under `claude/`.
10. **Suite** — `npm test`. Baseline to beat: **792/792, 0 fail, prove-red hard gate PASSED** (measured today). Report the actual counts, not this line.
11. **Recommend `fkit-wiki` ingest** the ADR in the close report. ⛔ This task writes no vault file (ADR-005).

---

## 5. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| ⭐ **The entry condition reads fields 18% of existing ledgers don't expose cleanly** (24 of 130, measured today) | High if unaddressed | Ruled fail-safe at §2.1 E — unreadable gate = closed gate = file a brief. Named in the ADR with the measurement, so the follow-up skill edits know to tighten the field. |
| A later reader takes the lane as a general small-fix exemption | High — this is the shape the owner rejected | §2.5 is mandatory and quotes the standing rule verbatim; §2.7 records the size floor as rejected by name. |
| The lane absorbs real work invisibly | High | §2.6 — the owner's per-finding consent gate is untouched; scope test; `Action` names files touched; three re-raise conditions. |
| ADR number collides with in-flight work | Medium | Both pipelines re-run at write time plus the manual look; `test/adr-number-uniqueness.test.js` catches a collision afterwards. |
| Concurrent producers dirty the tree, making "one new file" hard to prove | Medium | Verification step 3 reports **this task's** contribution explicitly and states the tree was dirty. |
| The ADR is mistaken for a live change | Medium | The ADR states in its own §Consequences that **nothing changes behaviour until the follow-ups ship**; the close report must say the same. A close report implying the lane is live has misreported. |
| ⚠️ Scope field growth when an approved lane fix touches a new file (e.g. a new test) | Low–Medium, **honestly unresolved** | The ADR rules the anti-widening case it can rule — *not edited to admit a finding* — and records the append-on-approved-fix case as a **residual risk with a re-raise condition**, rather than inventing a mechanism for it here. Flagging this rather than papering it. |

---

## 6. What this plan does **not** do

No skill edit, no source, no test, no board status change, no task-folder move, no vault write, no commit, no push. **One ADR file.**

---

## Open questions for the owner at the approval gate

1. **`accepted` or `proposed`?** I recommend **`accepted`** — the decision was ruled 2026-08-29 and `/fkit-record-decision` Step 1 asks only that it be settled, not implemented. `proposed` is defensible if you want the follow-up skill edits to land first.
2. **Name `fkit-task-ship-loop` as a sixth follow-up candidate?** I recommend **yes, as a candidate** — otherwise a lane-terminated finding may not appear in the close report at all. The brief enumerates five and I will not widen its list without your word.
3. **The fifth limit (ephemeral reviews) — keep it?** I recommend **yes**. It is beyond the brief's four, but it is a real hole the brief's own follow-up list implies, and leaving it unstated guarantees someone rediscovers it in a review round.
