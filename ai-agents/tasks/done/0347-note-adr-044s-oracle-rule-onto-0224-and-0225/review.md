# Review — 0347

Task: `ai-agents/tasks/done/0347-note-adr-044s-oracle-rule-onto-0224-and-0225/brief.md`
File(s) under review: `ai-agents/tasks/backlog/0224-build-the-misroute-detector-as-a-pair-denial-log-and-worklog-role-line/brief.md` (+79/−0, note `:286-363`) · `ai-agents/tasks/backlog/0225-add-the-loop-table-row-to-skill-ownership-test/brief.md` (+69/−0, note `:140-207`)
Scope: working tree vs `HEAD`, restricted to this task's change surface
Status: **closed-out** (2026-08-29). R1–R5 are all `✅ done`; **N1** (raised by the Process-review
worker at Step 1) was dispositioned by the owner on 2026-08-29 and is now `won't fix (frontier)`,
recorded in *Accepted residuals* below. Every novel finding is done, disproven, or accepted, and
**nothing blocking remains**. ⛔ This supersedes the earlier round-1 header reason (*"⚠️ NOT
closed-out … N1 is `blocked`"*), which was true only while N1 awaited that ruling.
Coverage: **both reviewers measured** (ADR-042 D1) — Codex (`codex-cli 0.145.0`, exit 0) sourced `claude/skills-for-role.sh` and executed `skills_for_role()` across the live Backlog corpus, reproducing `138 / 14 / 10 / 9`; I ran the same census independently plus `node --test test/task-id-uniqueness.test.js test/dashboard-contract.test.js` → **185 pass / 0 fail**.

⚠️ **Post-close pointer repair — 2026-08-29, on owner ruling.** After this task closed and its folder
moved to `ai-agents/tasks/done/`, the two inbound links from `0224` and `0225` back to this brief still
read `../0347-…` and no longer resolved. On the owner's ruling of **2026-08-29** — option label
verbatim: **"Repair both hrefs now (Rec)"** — a producer re-pointed both to `../../done/0347-…/brief.md`,
completing `/fkit-task-done` step 5's sibling-link rule.
⛔ **No reviewed content changed:** the repair touched one href on one line in each brief and nothing
else. Both notes' text, the surrounding prose, the five header fields, and `grep -c "Depends on"` (3/3
in both) are byte-identical, and the *Reviewer findings* section below was not re-opened.
📏 **The figures did NOT move.** Both hrefs sit on lines this task itself appended, so the edit rewrote
an added line rather than adding or removing one: `git diff --numstat HEAD` still reports **`82 0`**
(`0224`) and **`95 0`** (`0225`). The ruling anticipated the figures moving; measured, they did not.
⚠️ Note also that the `+79/−0` / `+69/−0` on the `File(s) under review` line above are the **Build-round**
figures and were never updated after the process-review round; the post-review totals are the `+82`/`+95`
recorded in `worklog.md:259-260`. Both are left exactly as recorded.

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | high   | `ai-agents/tasks/backlog/0224-build-the-misroute-detector-as-a-pair-denial-log-and-worklog-role-line/brief.md:354-357` | The note's one paragraph headed *"What this means concretely for half (ii)'s implementation"* states in the present indicative that **"The detector compares the recorded `**Role:**` against the role that ADR-044 §Decision 1's rule yields"** — instructing exactly the comparison that accepted residual **R14** (`:181-185`) and the brief's own ⛔ *"Do not describe half (ii) as catching a misroute"* forbid, and that the note's own next paragraph (`:359-361`, *"nothing compares the recorded role to the row's role"*) denies. Two flatly contradictory instructions, and the actionable-labelled one is the wrong one. Raised by both reviewers. |
| R2 | 1     | high   | `ai-agents/tasks/backlog/0225-add-the-loop-table-row-to-skill-ownership-test/brief.md:152-156` | The note says *"the **Plan** and **Build** cells become a **rule**"* and attributes both to ADR-044 **§Decision 1**, omitting **§Decision 2** — under which the Plan cell becomes *"the Build role, by hand where that role does not own `/fkit-plan-task`"* (`0345`'s brief `:80-82` writes exactly that). `/fkit-plan-task` is **coder-exclusive** (`claude/skills-for-role.sh:55`; verified: no other role's list carries it). So after `0345` the Plan row deliberately pairs a possibly-non-coder role-rule with a skill that role does **not** own — making this test's core assertion *"that role owns that skill"* false on a **lawful** table. The note's stated widening would have the implementer assert it anyway. Raised by both reviewers. |
| R3 | 1     | medium | `ai-agents/tasks/backlog/0225-add-the-loop-table-row-to-skill-ownership-test/brief.md:162-164` | *"The existing rule stands and covers it: the parser **must fail loudly if it matches zero rows**"* is false. The pre-existing rule (`:82-83`) and its verification step 3 (`:102-105`) guard **whole-table** vacuity only. After `0345`, a parser that silently skips the two rule-cells still matches Review / Process-review / Close → three assertions, non-zero, green — the widening not implemented and nothing red. The note removes the one guard that would have caught it (step 4's *"4 row assertions"*, which it declares stale at `:176`) and names a replacement that does not cover the case. Raised by Codex; verified against the brief's existing text. |
| R4 | 1     | low    | `ai-agents/tasks/backlog/0225-add-the-loop-table-row-to-skill-ownership-test/brief.md:177-179` | *"ADR-044 §Decision 3 and §C4 scope the change to Build alone"* misreports the cited sections: **§Decision 2** moves **Plan**, and **§C4** names that departure explicitly (*"One clause departs from ADR-038, and it is named rather than absorbed: Decision 2 (Plan)"*). It also contradicts the same note's own `:152-156`. Cite-accuracy defect; compounds R2 by telling the implementer Plan is out of scope. |
| R5 | 1     | low    | `ai-agents/tasks/backlog/0347-note-adr-044s-oracle-rule-onto-0224-and-0225/plan.md` §6 step 6 | ⚠️ **Not a defect in the deliverable — a false negative in the plan's own verification.** The literal `grep -n "every named Build skill's owner must own it in"` returns 0 because the phrase wraps across `0225:159-160`; the clause **is** present and quoted correctly. ⛔ Do **not** reword the note to satisfy the grep. Record the corrected check (multiline / whitespace-tolerant) in the worklog. Confirms the Build worker's own flag. |

## Coder response

<!-- CODER-OWNED — the reviewer never writes this section. -->

Round 1 processed 2026-08-29 by a spawned `@fkit-coder` **Process-review worker** of
`/fkit-sprint-ship-loop`, under the driver's declared-approval marker (ADR-032 Decision 3 + its
2026-07-22 autonomy amendment; ADR-019 discipline). Every step of `fkit-process-stateful-review` was
run; **none of its per-round owner gate** — the loop's single up-front plan approval replaces it, and
`pending approval` is therefore never used here. Each finding was re-verified against the file at
`file:line` and its **severity re-derived**, not inherited. Step 2 loop-check: this is round 1, no
prior rounds, no residual and no ADR *"Re-raise only if"* is met — **nothing is `closeout`**. In
particular ADR-044 §"Re-raise only if" (4 triggers) and its *"Do not re-raise on"* list, and ADR-038's
closeout clause (*"anything else that re-argues (b) from deliverable authorship"*), were checked
against all five findings: **none is a re-litigation.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** — severity **high**, re-derived independently (not inherited). Verified at `0224/brief.md:354-357` against `:181-185` (residual **R14**: *"Do not describe half (ii) as catching a misroute"*) and against the note's own `:359-363`. The paragraph is the one headed *"What this means concretely for half (ii)'s implementation"* — i.e. the **actionable-labelled** sentence — and it read in the present indicative. Blast radius traced: an implementer of `0224` half (ii) building a comparison would ship exactly the false guarantee R14 exists to prevent, and the brief would carry two flatly contradictory instructions with the wrong one flagged as the instruction. | **defect** (self-contradiction + violates an accepted residual the same brief restates) | Rewrote the paragraph into the conditional the note's own closing paragraph already states: it now opens ⛔ *"Half (ii) still compares nothing — it asserts the `**Role:**` line is present, and that is all (residual R14, restated below)"*, and states the ADR-044 §Decision 1 oracle as *"the oracle any comparison must use if and when one is built"*. All three ⛔ negatives (not the literal cell, not `## Owner`, never a grep) kept verbatim; `producing skill` and the literal-cell refusal kept, so brief verification step 4's greps still hit. **+3 lines, no deletion outside the paragraph.** | ✅ done |
| R2 | **CORRECT** — severity **high**, re-derived. Verified at `0225/brief.md:152-156`. ADR-044 §Decision 1 (`adr-044…md:173-178`) governs **Build only**; **§Decision 2** (`:180-193`) governs Plan — *"The Plan row's role is the Build role, by hand where that role does not own `/fkit-plan-task`"* — and is flagged there as an **owner-ruled scoped exception to ADR-038** (ND3), which §C4 (`:387-394`) names verbatim. `/fkit-plan-task` confirmed **coder-exclusive**: `claude/skills-for-role.sh:55` is the only list carrying it (all seven role lists read). So this test's core assertion is deliberately false on a lawful Plan row, and the note as written had the implementer assert it anyway. | **defect** (mis-citation with a downstream false assertion) | Split the single §Decision 1 attribution into two bulleted rules — Build → §Decision 1, Plan → §Decision 2, each quoted verbatim, with the ADR-038-exception status named. Added a ⛔ block recording the `/fkit-plan-task` collision with its `skills-for-role.sh:55` evidence. ⭐ **Per the owner's ruling of 2026-08-29, verbatim label "Flag the collision only (Rec)", the note records the collision and explicitly does NOT declare the Plan row exempt** — it states in terms that the carve-out is `0225`'s own plan-gate decision, not `0347`'s, and quotes the ruling label so a later reader can find it. **+22 lines, no deletion.** | ✅ done |
| R3 | **CORRECT** — severity **medium**, re-derived. Verified at `0225/brief.md:162-164` against the pre-existing rule at `:82-83` and verification step 3 at `:102-105`: both guard **whole-table** vacuity (*"Point it at a fixture with no matching rows"*). Traced the flow on the live table (`claude/skills/fkit-sprint-ship-loop/SKILL.md:120-127`): with Plan and Build silently skipped, Review + Process-review + Close still match → **3 assertions, non-zero, green**, widening unimplemented. And the note itself declares stale (`:176`) step 4's *"4 row assertions"* — the only guard that would have caught it. | **defect** (false claim of coverage, which also removes the real guard) | Replaced *"The existing rule stands and covers it"* with the measured truth: the zero-row rule and step 3 guard whole-table vacuity **only**, spelled out with the three-assertion green path. Added the ⛔ replacement requirement — **per-cell**: every named row either asserted or explicitly skipped **for a named reason**, and a rule-cell resolving to no skill must fail — stated as **replacing** the stale row-count guard, *"it does not drop it"*. **+7 lines, no deletion.** | ✅ done |
| R4 | **CORRECT** — severity **low**, re-derived (agrees with the reviewer's label; derived independently from blast radius, which is one parenthetical inside a flag paragraph). Verified at `0225/brief.md:177-179`. §Decision 3 (`adr-044…md:195-197`) covers Verify/Review/Process-review/Close and says nothing about scoping the change to Build; §Decision 2 moves Plan; §C4 (`:387`) states *"One clause departs from ADR-038, and it is named rather than absorbed: Decision 2 (Plan)"*. The clause also contradicted the same note's own `:152-156`. | **defect** (cite accuracy; compounds R2) | Kept the true half (*"Verify stays table-fixed and stays skipped — ADR-044 §Decision 3"*) and replaced the false half with ⚠️ *"Not 'Build alone': §Decision 2 moves **Plan** as well, and §C4 names that departure verbatim"* plus §C4's sentence quoted. **+2 lines, no deletion.** | ✅ done |
| R5 | **CORRECT** — severity **low**, re-derived; and correctly self-limited by the reviewer as *not* a deliverable defect. Confirmed the false negative: the asserted clause wraps across `0225/brief.md:159-160` between *"Build"* and *"skill's"*, so the plan §6 step-6 literal `grep` returns 0 while the clause is present verbatim. ⛔ Its instruction not to reword the note to satisfy the grep was followed. | **defect in the plan's verification method**, not in the deliverable | ⛔ **No deliverable text changed.** Corrected check adopted and run: `tr '\n' ' ' < <brief> \| grep -c "every named Build skill's owner must own it in"` → **1**. Recorded in `worklog.md` for any re-runner. The line-wrap survived my R2/R3 edits (they are above and below that paragraph), so the corrected check remains the required one. | ✅ done |
| N1 | **CORRECT** — a **novel finding raised by me at Step 1** (no reviewer row; verdict is my own verification of my own claim). Verified: `0224`'s note states its oracle for Build only and ⛔ instructs *"Do not widen this note past Build"* (`:313-314`), yet `0224` half (ii) mandates a `**Role:**` line *"at the head of **every** worklog round"* (`:157`) — which includes the **Plan** round, whose role ADR-044 §Decision 2 also moves. Severity **low**, derived: the gap only bites if the hypothetical comparison of R1 is ever built, and R14 says nothing compares today. But it is the exact mirror of R2/R4 in the sister note, and after this round `0225` carries §Decision 2 while `0224` tells the implementer not to. | **defect (low)** as first derived — incompleteness, not a false statement: nothing in the `0224` note is untrue, and the note faithfully mirrors ADR-044 §C3, which scopes `0224`'s widening to Build. ⭐ **Reclassified by the owner's ruling of 2026-08-29 to a confirmed intended tradeoff (frontier-move)** — the incompleteness is real and is accepted with its cost stated, not denied. | ⛔ **NOT FIXED, and now settled — not blocked.** The worker's round-1 position stands on the facts: no additive fix exists, because naming Plan *is* widening the note past Build, reversing an explicit ⛔ line in the owner-approved plan text; so it was returned to the driver as `NEEDS-DECISION` (ADR-019 / ADR-032 discipline). ⭐ **The owner ruled on 2026-08-29, verbatim option label "Leave 0224 as approved (Rec)": `0224`'s note text does NOT change** — no clause naming §Decision 2 is added and *"Do not widen this note past Build"* stays as approved. The stated cost was put to them and accepted: an implementer building the Plan-round oracle from `0224` alone gets §Decision 1 only, and would flag a lawful architect-planned row as a misroute. **Nothing in `0224` was edited for N1, in round 1 or in this finalisation.** Recorded in *Accepted residuals* below. | won't fix (frontier) |

## Accepted residuals (shared, do-not-re-litigate)

<!-- Any entry here requires the owner's approval. -->

- **N1 — `0224`'s oracle is stated for Build only** — **What:** `0224`'s note states the ADR-044
  §Decision 1 role-rule as its oracle for the **Build** round and ⛔ instructs *"Do not widen this note
  past Build"* (`:313-314`), while `0224` half (ii) mandates a `**Role:**` line at the head of **every**
  worklog round — the **Plan** round included, whose role ADR-044 **§Decision 2** also moves. The note
  text is **unchanged**: no clause naming §Decision 2 was added, and the ⛔ line stays as approved.
  · **Why (structural):** ADR-044 **§C3 itself scopes `0224`'s widening to Build**, so the note mirrors
  its own source faithfully and nothing in it is false — this is an incompleteness, not an error. The
  rejected alternative, naming Plan, *is* the widening: it would depart from **both** §C3's scoping
  **and** the ⛔ line in the plan text the owner approved verbatim, so no additive fix exists. Owner
  ruled 2026-08-29, verbatim option label **"Leave 0224 as approved (Rec)"**, with the cost stated and
  accepted: an implementer building the Plan-round oracle from `0224` alone gets §Decision 1 only, and
  would flag a lawful architect-planned row as a misroute — the failure the note exists to prevent, one
  step over. · **Re-raise only if** *either* of these is true and checkable — **(a)** an implementation
  of `0224` half (ii) actually goes past the presence test and **compares** a recorded `**Role:**` to a
  rule-derived role for a round other than Build (i.e. residual **R14** no longer holds for the Plan
  round) — at that point the Build-only oracle is genuinely insufficient and the note must name
  §Decision 2; *or* **(b)** `0345` has landed its **Plan rule-cell** — check: the **Plan** row of the
  step table in `claude/skills/fkit-sprint-ship-loop/SKILL.md` cites ADR-044 §Decision 2 and contains
  the words *"scoped exception"* — **and** `0224` is still open, because from then on the live table a
  `0224` implementer reads carries Plan-as-a-rule while the note tells them not to. ⛔ **Do not re-raise
  merely because the note omits §Decision 2** — that omission *is* the ruling, and re-raising it as a
  new finding is re-litigation.

**Two further residuals live elsewhere and are unchanged by this round**, both in `0224`'s brief at
`:181-190` (from `0200`'s ledger): **R14** (half (ii) is a presence test, not misattribution detection)
and **R18** (ADR-022 leaves the worker tool-unrestricted, so the log is durable, not tamper-proof).
R1's fix **enforces** R14 rather than re-litigating it.
