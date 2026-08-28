# Worklog — 0229: Widen `/fkit-task-done` to repair a brief that contradicts a landed close

- **Task:** ai-agents/tasks/done/0229-widen-task-done-to-repair-a-brief-that-contradicts-a-landed-close/brief.md
- **Plan:** ai-agents/tasks/done/0229-widen-task-done-to-repair-a-brief-that-contradicts-a-landed-close/plan.md (blob `5d9cd4cd956affb968cb02651dc275f9a7cdc312`, verified with `git hash-object` before any edit)
- **Built by:** `fkit-coder`, spawned as the **Build worker** of `/fkit-sprint-ship-loop` (lead session, Sprint 6) under the declared-approval marker — owner approved the plan via `AskUserQuestion` on 2026-08-27 with Q1–Q5 as recorded in plan.md §4.
- **Date:** 2026-08-27

## What changed

| File | Change |
|---|---|
| `claude/skills/fkit-task-done/SKILL.md` | Step 1 "already in `done/`" bullet: existing exception relabelled `One exception:` → `First exception:` (Q1); the approved **Second exception: the contradicted-close repair** text inserted verbatim after "only the owner can upgrade.", with its four must-nevers and the "any other value ⇒ plain stop" closer, trailing `Or` moved to the end of the insert. Step 7: `Moved:` bullet gains the `Moved: none — <first \| second> exception; folder already in done/` clause; `Brief's own status header` bullet gains the outcome `repaired from <value read> to ✅ Done under the second exception` (Q4). Frontmatter untouched. |
| `.claude/skills/fkit-task-done/SKILL.md` (gitignored mirror) | Refreshed by a plain `cp` of the one file — **not** `fkit-claude-init.sh .` (judged unsafe to run mid-task earlier this sprint; it writes outside `.claude/`). `diff` canonical ↔ mirror: empty. The copy also carried 0325's previously unmirrored edits — expected. |
| this `worklog.md` | new |

`git diff -U0` on the canonical file shows hunks at old-file lines `:81`, `:85`, `:311`, `:315` only — the step-1 bullet and the two step-7 bullets. Net +21 lines in step 1, +2 in step 7 (file 376 → 399 lines). Every citation below `:85` in plan.md shifted by +21 after the edit (step 5 "Reads anything else" `:279-280` → `:300-301`; self-locator no-op `:200` → `:221`; step 7 `:311` → `:332`, `:314-318` → `:335-340`).

## Decision log

1. **Q1 — deviation from the brief's "byte-unchanged" clause, stated.** The brief asked that the existing owner-verification exception stay byte-unchanged. Owner ruled "First exception:" (recommended) — two words of its label change (`One` → `First`); every other word of the upgrade text is byte-identical. Visible as the `:81` hunk in the diff.
2. **Q2 — row match is plain `✅ Done` only.** A board row reading `✅ Done (agent-closed — not owner-verified)` beside an open-work brief does **not** fire the branch; the rule's "value that already begins `✅ Done`" / plain-stop closer plus must-never 1 cover it, and the report says what was read. Zero live cases today.
3. **Q3 — ship-loops' stale "one exception" cites left as-is; recorded for 0135.** `fkit-sprint-ship-loop` and `fkit-task-ship-loop` still cite the step-1 bullet as `:78-82` / `:283-286` and speak of "one exception"; both cites were already wrong before this edit and are wronger now (+21 lines). Not this task's; 0135 owns the follow-up.
4. **Accepted overlap with 0134 / 0135.** Shipped standalone per the brief's dated correction. 0134 (architect ruling on this exception) and 0135 (the wider mover rework) are not narrowed; the branch is labelled **"Second exception: the contradicted-close repair"** so 0135 can find, subsume, keep, or replace it by name and say so. No fresh ADR — 0134's brief already carries the 2026-08-06 instruction to rule on exactly this exception.
5. **Q5 — no test added.** No test reads SKILL.md body prose (0123; 0136 guards frontmatter only, untouched). `node --test test/*.test.js` run as **no-regression proof only**: 774 tests, 24 suites, 774 pass, 0 fail, 0 skipped. `test/skill-ownership-hook.test.js` still asserts producer-only movers (file untouched). `prove-red.sh` not run — no test was edited. ADR-014 zero devDeps holds.
6. **Nothing run, nothing hand-edited.** The mover was not run (the coder is hook-denied at any spawn depth, ADR-018/033, and the branch is owner-only by design — no dry run was possible). Briefs `0021`, `0041`, `0014` untouched. Drift re-measured at the end via `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/done/sprint-1.md`:
   ```
   drift disagreement 0041 plan="✅ Done" brief="🔲 Backlog" location="done/"
   drift disagreement 0021 plan="✅ Done" brief="🔲 Backlog" location="done/"
   ```
   `0014`: folder in `done/`, brief `🔲 Backlog`, **no `✅ Done` row anywhere under `ai-agents/sprints/`** (its only `sprints/` hit is `backlog.md:239`, a row for a different task mentioning it in prose) — the branch must refuse it (must-never 1). All three remain drifted for the owner to repair by running the widened skill in an owner-present `fkit producer` session.
7. **Unattended fixes / obvious-winner calls (ADR-032 A4 audit):** `none`. Only the approved plan was built; no review round was processed in this spawn.

## Walk-through by reading (no dry run possible)

- **`0021`** — folder `ai-agents/tasks/done/0021-build-fkit-reconnect-tooling/` ✓; brief `## Status` = `🔲 Backlog` ✓; `sprints/done/sprint-1.md:45` leading cell `✅ Done` ✓; identity owner ⇒ second exception fires; no move; brief resolves to plain `✅ Done`; report says `Moved: none — second exception; folder already in done/`.
- **`0041`** — same, board row `sprints/done/sprint-1.md:40`.
- **`0014`** — no `✅ Done` row ⇒ must-never 1 ⇒ stop and say so.
- **Spawned producer** on 0021 ⇒ must-never 2 ⇒ stops.
- **Brief reading `✅ Done (agent-closed — not owner-verified)`** ⇒ first exception, not this branch (must-never 3).

## Deliberately not done
No commit; no push; no task folder moved; `plan.md` not edited; mover not run; no brief hand-edited; `ai-agents/wiki-vault/`, ADRs, `fkit-task-cancelled/SKILL.md`, both ship-loops, `skills-for-role.sh`, `task-status-vocabulary.md`, and `test/*` untouched; `fkit-claude-init.sh .` not run.

---

## Process-review — Round 1 (2026-08-27)

- **By:** `fkit-coder`, spawned as the **Process-review worker** of `/fkit-sprint-ship-loop` (lead session, Sprint 6) under the declared-approval marker (plan blob `5d9cd4cd956affb968cb02651dc275f9a7cdc312` re-verified with `git hash-object` before any edit). Method: `/fkit-process-stateful-review` steps 0–7, per-round owner gate replaced by the standing approval (ADR-032 amendment / ADR-019 discipline).
- **Findings:** R1 medium → **low**, `CORRECT`, fixed · R2 low, `CORRECT`, fixed · R3 low, `CORRECT`, frontier — **no edit, residual not written (owner's word needed)**. No closeout / re-litigation hits against *Accepted residuals* or ADR-033/034. Rows written to `review.md` *Coder response*; *Reviewer findings* untouched. Ledger `Status` **closed-out** after the owner's R3 ruling (decision 8).

### What changed this round
| File | Change |
|---|---|
| `claude/skills/fkit-task-done/SKILL.md` | Step 1, second exception: (R1) discriminator clause after *"whose leading cell reads plain `✅ Done`"* — *"For this task" means the row's Brief cell links this task's folder; prose mention / quoted specimen row / another task's row citing this folder is not a landed close*; *"If one exists"* → *"If such a row exists"*; the following sentence reflowed to the region's width. (R2) must-never 1: *"reads plain `✅ Done`"*, rationale narrowed to the no-row case, plus *"A row reading `✅ Done (agent-closed — not owner-verified)` beside an open-work brief is also not this branch's case: stop, and report what the row reads"*. Net this round +4 lines (file 399 → 403). `git diff -U0` vs HEAD: hunks only at old `:81`, `:85` (+26), `:311`, `:315` — step 1 and step 7, nothing else. Step 5 / self-locator lines (`:225`, `:292`, `:316`) byte-identical to HEAD. |
| `.claude/skills/fkit-task-done/SKILL.md` | re-copied (`cp`); `diff` canonical ↔ mirror empty. |
| `review.md` | *Coder response* rows R1–R3. |
| this `worklog.md` | this entry. |

### Verification
- `node --test test/*.test.js`: **774 tests, 24 suites, 774 pass, 0 fail, 0 skipped** — no-regression proof only (no test reads SKILL.md body prose).
- No naked `:NNN` added to skill text (`git diff -U0 | grep '^+' | grep -E ':[0-9]+'` → empty).
- `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/done/sprint-1.md` still emits `drift disagreement 0041 …` and `drift disagreement 0021 …` — nothing repaired, no mover run, no brief hand-edited.
- Mirror identical; `plan.md` blob unchanged.

### Decision log (ADR-032 A4 audit — every unattended fix and obvious-winner call)
1. **R1 — applied without asking.** Answers R1. Changed: one clause + "If such a row exists" at step 1. Qualified: verified `CORRECT` against `0014`'s two foreign-row hits and `0021`'s real row; mechanical/localized (one sentence, one bullet); inside the approved plan's rule intent ("find a status-table row **for this task**") — it makes the discriminator explicit, changes no outcome for the three live cases and no Q1–Q5 ruling. Severity re-assigned low (latent, no live specimen); fixed because the cost is one clause.
2. **R2 — applied without asking.** Answers R2. Changed: must-never 1 wording. Qualified: verified `CORRECT` (`:96` lacked "plain"; rationale wrong for the agent-closed-row case); mechanical/localized; inside the plan — Q2's outcome (plain `✅ Done` only, no fire) is unchanged, only the restriction's wording and its stop message tightened.
3. **R3 — NOT applied; no obvious-winner call.** Claim accurate, holds in effect. The approved plan says §Step 5 "no edit" and old `:200` "left byte-identical" — widening those sentences is outside the standing approval, so it stops. Recommended disposition: record as an accepted residual (leave for `0135`, which re-edits this branch); that needs the owner's word, returned as `NEEDS-DECISION`. Alternative if the owner prefers: approve the one-word widening at `:225` (and, if wanted, `:292` / `:316`) as an out-of-plan edit.
4. **Record nit (this worklog, decision 6 above) — corrected.** `0014` has **two** `sprints/` hits, not one: `backlog.md:239` (`0296`'s row) and `backlog.md:244` (`0301`'s row), both `🔲 Backlog` rows for other tasks that cite `0014` in their description. Conclusion unchanged: no `✅ Done` row ⇒ must-never 1 ⇒ stop.
5. **Record nit (plan §Verification 4(b)) — noted, `plan.md` not edited.** The plan cites `sprints/done/sprint-2.md:2447` as a 0014 mention. Measured 2026-08-27: line 2447 exists and carries the **bare slug** `align-conventions-readme-enforcement-item-live-vs-scaffold` in prose — no `0014-` prefix — so step 4's folder-name grep (`0014-align-…`) does **not** hit it. As a folder-name cite it is stale; as a prose mention it is real. Blob unchanged.
6. **Decision 2 above — attribution corrected.** It said the Q2 case (agent-closed board row + open-work brief) was covered by the closer plus must-never 1. After R2 it is covered **explicitly by must-never 1**; the closer is about the *brief's* value, not the board row's (reviewer's own-record note, ADR-034).
7. **Obvious-winner calls:** `none`.
8. **R3 — owner ruling relayed 2026-08-27 (live `AskUserQuestion`, driver session): "Record as residual (Recommended)".** *Accepted residuals* entry added to `review.md` in full What / Why (structural) / Re-raise-only-if shape, citing the ruling and date; R3 row stays `won't fix (frontier)`; ledger `Status` → **closed-out**. No source edit; `git diff -U0` hunks unchanged; mirror still identical.

### Deliberately not done
No commit; no push; no task folder moved; `plan.md` not edited; mover not run; no brief hand-edited; `ai-agents/wiki-vault/`, ADRs, step 5 / self-locator sentences (R3), `fkit-task-cancelled/SKILL.md`, both ship-loops, `skills-for-role.sh`, `task-status-vocabulary.md`, and `test/*` untouched; `fkit-claude-init.sh .` not run. Ledger `Status` set `closed-out` after the R3 ruling (decision 8).
