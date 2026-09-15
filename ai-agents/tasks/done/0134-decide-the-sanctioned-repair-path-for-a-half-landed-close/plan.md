# Plan — 0134: decide the sanctioned repair path for a half-landed close

## buildRole

**`fkit-architect` via `/fkit-record-decision`**
- ADR-044 §Decision 1: *"`/fkit-record-decision` … → architect"*.
- ADR-038 §Decision: *"A loop step's role is fixed by the skill the step runs"*.
- `claude/skills-for-role.sh`: the `architect)` case owns `fkit-record-decision`.

**No split.**
- The deliverable is one ADR.
- Verification step 6 (0135 readable against the ADR) is a reading check. It needs no edit to `0135`'s brief, which already says *"Exactly what ADR 0134 rules"*.
- The skill and loop edits are `0135`'s work (coder).
- Verify stays coder, Review stays reviewer, Process-review stays coder, Close stays producer (ADR-044 §Decision 3; ADR-038; ADR-033 §Decision 4).
- If a dated note on ADR-033 were wanted, it would also be architect work (`/fkit-record-decision` §"Correcting an accepted ADR"). The plan recommends no such note (§3 step 7).

**Condition:** `fkit-architect.md:65` still binds a spawned architect. Until ADR-044 C2(i) lands, the Build spawn must carry a **named owner Route ruling** (ADR-037 §3; ADR-044 §Context, *"until they land, an architect Build row still needs a named ruling"*). See D0.

---

## Plan (self-contained; decision points marked ⟦D#⟧)

### 1. Goal
Write one ADR under `ai-agents/knowledge-base/decisions/` that records the owner's 2026-09-13 ruling (*"Producer-only reconcile mode (Rec)"*) and answers all seven questions in the brief. It must include an explicit **must-never** list and a detection rule precise enough to implement, and must rule on:
- the `0229` exception
- `/fkit-task-cancelled`
- the three carve-out sites

The ADR is the only file this task creates. No commit.

### 2. Measured ground (HEAD `d8ef596`, 2026-09-14; the ADR must state this commit)

| Fact | Evidence |
|---|---|
| `/fkit-task-done` step 1 stops on a folder already in `done/` | `SKILL.md:81` |
| Exception 1: the owner-verification upgrade. Owner-only (*"An agent hitting this case still stops"*) | `:81-85` |
| Exception 2 (`0229`): the contradicted-close repair. Owner-only (*"never fire for a non-owner identity — a producer **spawned** … stops here"*). Fires only when the brief reads open-work and a row whose Brief cell links this folder reads **plain** `✅ Done`; never moves a folder | `:86-110` |
| No door when the brief reads plain `✅ Done` and a row is stale. This blocks the **owner** too (neither exception fires) | `:81-110` |
| `/fkit-task-cancelled` has no repair exception | `:85-86` |
| Done and Cancelled may be set only by the skills. In progress and Blocked are free, so the loop's `🚧 Blocked` on a closed folder is lawful | `conventions/task-status-vocabulary.md` §"The authority split" |
| Neither loop ever routes a cancel to a producer | sprint-loop `:314`; task-loop `:206` |
| Half-landed branches | sprint-loop §4 `:294-308`, exit row `:337`, carve-out `:343-347`; task-loop `:117-120`, `:188-201`, `:211-214`, exit row `:277` |
| Stale citations in both loops | sprint `:302-303`, `:347`; task `:120`, `:195-196` |
| Producer-only movers; spawned producer = agent | ADR-033 §Decision 1, §5, §"The limit" |
| Next ADR number | highest on disk 047. **Do not pre-allocate**: run the step-2 sweep at write time |

### 3. Steps (Build, architect)
1. Re-measure every row of §2 at the Build-time HEAD, and record that commit in the ADR. If anything differs from §2, stop and return `NEEDS-DECISION`.
2. Run the `/fkit-record-decision` number sweep (malformed-name check, highest-on-disk, repo-wide grep for rival claims).
3. Write the ADR. Sections:
   - **Context:** the gap, `0123` R1/R6, `0229`, the owner ruling and its stated reason ("the artifact of worth is the constraint list").
   - **Decision.** Each of the seven questions under its own visible heading:
     - Q1: yes (owner, 2026-09-13), with the verbatim label.
     - Q2: producer-only; a spawned producer qualifies. Name it the whole point and the whole risk.
     - Q3: the MAY-write set ⟦D1⟧ ⟦D2⟧.
     - Q4: the must-never list (§4 below).
     - Q5: the detection rule (§5 below).
     - Q6: `/fkit-task-cancelled` ⟦D3⟧, citing `:85-86` and the loop cancel rules.
     - Q7: ADR-033 §"The limit" ⟦D5⟧.
   - **`0229`'s exception:** subsumed, kept or replaced ⟦D1⟧.
   - **The three carve-out sites**, each named with its re-derived lines ⟦D4⟧.
   - **Options considered:** *"keep it owner-only"* rejected by the owner, and why it lost (every stale close waits on a human, even when the landed value is already on disk).
   - **Consequences:** the stale loop citations handed to `0135`; `0135` stays a four-surface change.
   - **Re-raise only if**, **Owner sign-off**, **Related**.
4. The ADR quotes both owner constraints verbatim as conditions of approval. Sprint-9 criterion 9 needs the must-never list to name the agent-closed marker.
5. Run `node --test test/*.test.js`, including `test/adr-number-uniqueness.test.js` and `test/reference-integrity.test.js` for the new ADR's links. Green proves the number and links only, not the decision.
6. Write `worklog.md`.
7. Assumption, not a decision point: **ADR-033 gets no dated note.** Nothing in it forbids repair. The new ADR cites §Decision 1, §5 and §"The limit" and changes none of them.

### 4. Must-never list (content the ADR must carry; D1/D2 may add items)
1. Never upgrade `✅ Done (agent-closed — not owner-verified)` to plain `✅ Done`, anywhere. *(Owner constraint 2.)*
2. Never run when all status-bearing locations already agree. *(Owner constraint 1.)*
3. Never create a `✅ Done` when no landed close exists. That is a close, and it goes through the ordinary mover from `backlog/`.
4. Never touch a folder that is not in `done/`. Never move a folder.
5. Never downgrade an owner-closed plain `✅ Done`.
6. Never pick a winner when the landed locations disagree with each other (one row plain, another agent-closed): refuse and report both.
7. Never overwrite a `⛔ Cancelled …` or `➡️ Moved …` cell. A Moved row gets pointer repair only.
8. Never write the vault (ADR-005), and never edit `test/reference-integrity.test.js` (the existing step 5 rule).

### 5. Detection rule (draft for the ADR)
**Locations** = the brief's `## Status` plus every status-table row whose **Brief cell links this folder** (the discriminator `0229` already uses), plus epic slice cells and in-body `**Status:**` lines.

The mode fires only if **all** of these hold:
- (a) the folder is under `tasks/done/`;
- (b) at least one location reads a landed `✅ Done…` value;
- (c) at least one location reads an open-work value (`🔲`, `🔄`, `🚧 …`, including the loop's `🚧 Blocked — hand-off incomplete: …`);
- (d) every landed location reads the **same** `✅ Done…` value.

Otherwise it refuses and reports what each location reads. A request to re-touch a finished task fails (c), so it is refused. The written value is ⟦D1⟧.

### 6. Edge cases the ADR must name
- **Ancient drift vs a fresh half-landed close** (the `0021`/`0041` class): not distinguishable on disk. The rule treats them the same; say so.
- **A hand-forged landed `✅ Done`** (a doer hand-edits a row and moves the folder by hand) would be propagated. See ⟦D5⟧.
- **A brief with no `## Status`:** refuse (nothing to disagree with).
- **Unsprinted (no row):** only one location exists, so (c) cannot hold; refuse.

### 7. Validation
- An ADR file exists and the suite is green.
- A checklist in the worklog maps brief verification items 1–6 and the two owner constraints to ADR headings.
- Criterion-9 check: the must-never list names the agent-closed marker.

---

## Decision points

**D0: Plan-step role and the Build Route ruling**
- **Question:** ADR-044 §D2 says an architect-owned row is planned by the architect by hand, but the loop table still says coder. How should this row proceed?
- **Options:**
  - (a) Accept this coder plan as the plan of record, flagged as a departure. The Build spawn carries a named Route ruling: "architect builds via `/fkit-record-decision`" (ADR-037 §3).
  - (b) Re-spawn Plan as `fkit-architect` by hand, per ADR-044 §D2, then Build as in (a).
  - (c) Pause the row until ADR-044 C2(i) ships.
- **Rec: (a).**

**D1: What value the mode writes, and what happens to `0229`**
- (a) **Copy the agent-closed value only.** A spawned producer writes the landed value only when it is `✅ Done (agent-closed — not owner-verified)`. A plain landed `✅ Done` → refuse and route to the owner. `0229` is **kept**, owner-only. Name the owner-side gap (brief plain, row stale) as a residual or a follow-up.
- (b) **Copy the landed value verbatim, plain included, for any producer.** `0229` is **subsumed**.
- (c) (a), plus an owner-present sub-path that copies plain and also covers "brief plain, row stale". `0229` is **replaced** by the unified branch.
- **Rec: (a).**

**D2: Href-only staleness**
- (a) Hrefs are not statuses. A pointer repair is free for the coder (ADR-044 §D1 coordination-doc repair), and the reconcile mode also repairs hrefs as a side effect *when it fires*. `0135` corrects the loops' "status or href → owner-only".
- (b) Treat a `backlog/` href to a `done/` folder as a "disagreement" that satisfies the precondition.
- (c) Leave hrefs out of scope; `test/reference-integrity.test.js` catches them.
- **Rec: (a).**

**D3: Q6, `/fkit-task-cancelled` mirror**
- (a) **Out of scope, with the file checked** (`:85-86`). Neither loop routes a cancel to a producer (sprint `:314`, task `:206`), so the mode has no caller. Re-raise if a producer-spawned cancel path ever exists.
- (b) Mirror it now, which opens a first door on `cancelled/`, the unaudited board.
- (c) Out of scope, and the producer files a follow-up brief.
- **Rec: (a).**

**D4: The three carve-out sites** (sprint `:343-347`, task `:117-120`, task `:211-214`; the exit rows `:337`/`:277` follow)
- (a) **Amend.** The carve-out stays as the fallback when the reconcile spawn refuses or fails (plain landed value, conflicting landed values). Its reason becomes "the mode refused", not "no agent can act".
- (b) **Remove**, so every half-landed close routes to the mode.
- (c) Keep as written.
- **Rec: (a).**

**D5: Q7, widening of ADR-033 §"The limit"**
- (a) **Accept and disclose.** The mode adds no new way to close. What widens is that an out-of-procedure or forged landed `✅ Done` gets a mover-shaped record. The reconcile report must say "landed close propagated; its provenance not checked".
- (b) (a), plus a git-provenance check.
- (c) Treat the widening as unacceptable and narrow the mode.
- **Rec: (a).**

---

## Owner rulings (2026-09-14, via `AskUserQuestion` in the `fkit lead` session — verbatim option labels)

- **D0:** "Keep plan, architect builds (Rec)" → option (a). This coder-authored plan is the plan of record, recorded as a departure from ADR-044 §D2 (the loop table lags ADR-044 C2(i)). **Named owner Route ruling for the Build spawn: `fkit-architect` builds this row via `/fkit-record-decision`** (ADR-037 §3).
- **D1:** "Agent-closed value only (Rec)" → option (a). `0229`'s exception kept, owner-only; owner-side gap named as a residual.
- **D2:** "Links aren't statuses (Rec)" → option (a).
- **D3:** "Out of scope (Rec)" → option (a). No follow-up brief filed.
- **D4:** "Amend as fallback (Rec)" → option (a).
- **D5:** "Accept and disclose (Rec)" → option (a).
- **Plan approval:** "Approve (Rec)".
- **Driver note (orchestrated path):** under `fkit-sprint-ship-loop` the Build step ends at §3 step 6; the driver's separate Verify / Review / Process-review steps follow. No commit by any step.
