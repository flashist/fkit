# Review — 0306

Task: 0306 — [brief](./brief.md)
File(s) under review: the working tree vs `HEAD` (`9360177`) — 39 changed paths, **less two that are
not this task's**: `ai-agents/sprints/sprint-6.md` and this task's own `brief.md` (each a one-line
`## Status` change written by the sprint driver).
Status: **converged — ready to close** (set at round 2; see the round-2 convergence call).

**Round 1** · Reviewed 2026-08-15 by `fkit-reviewer` (`/fkit-stateful-review`).
**Reviewers run: 2 of 2.** Own pass + Codex adversarial second opinion
(`codex exec --sandbox read-only`, codex-cli 0.145.0, 135k tokens). **No degradation — coverage is
model-diverse and complete.**

**Round 2 (convergence)** · 2026-08-15 by `fkit-reviewer`, phase 2 of the stateful review.
**Reviewers run: 1 of 2 — own pass only. No Codex pass was run this round, by the driver's
instruction**, on the ground that round 1 already had full model-diverse coverage of this change
surface and round 2's surface is 4 briefs' notes plus this task's own records.
⚠️ **This does NOT downgrade round 1's recorded coverage state — round 1 remains FULL 2-of-2, and that
is what the sprint roll-up should keep reporting.** Round 2's own coverage is **single-reviewer**, and
the verdict below is scoped accordingly.

---

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | medium | `ai-agents/tasks/backlog/0226-repair-the-four-mirror-checklist-in-skills-for-role-shs-header/brief.md:200` | The dated note's headline — *"both **"Task 70"** mentions in `## Context` … are DELIBERATELY LEFT byte-identical"* — is **false**, and its own bullet at `:205` says so: the live-prose site at `:41` **was** repaired. A dated correction note that misstates what it corrected is the exact defect class this task exists to remove. |
| R2 | 1     | medium | `ai-agents/tasks/backlog/0296-decide-what-catches-a-task-brief-that-has-no-board-row/brief.md:263` | The note claims the dead `sprints/sprint-5.md` term *"simply contributes nothing"*. It does contribute: `grep` on the missing file exits `2` and warns on stderr. `0296:214-222` documents **this exact trap** (*"grep … errored with exit `2`, and the `! grep -q` test read every error as 'no match'"*), so the reassurance is wrong in the one brief that records the hazard. The **leave-it decision stays correct**; only the stated reason is wrong. |
| R3 | 1     | low    | `ai-agents/tasks/done/0302-pressing-enter-at-the-role-menu-should-open-the-lead/brief.md:279` (and `0306/worklog.md` §1 finding 6) | The `test/` breakdown does not add up: `4 + 4 + 1 + 14 = 23`, against a stated total of `25`. Measured on disk: the two `test/fixtures/closed-rank-0174-*.md` fixtures carry **8 each = 16**, not 14. The headline 25 is right; the itemisation shipped in a dated note is wrong, in both the note and the worklog. |
| R4 | 1     | low    | `ai-agents/tasks/backlog/0037-extend-prove-red-to-reach-init/brief.md:47` | Botched substitution — the folder slug is now printed **twice in a row**: `` **…folded into `0058` (`investigate-mutation-testing-library-adoption`)** (`investigate-mutation-testing-library-adoption`), ``. At `HEAD` the line read `` **…folded into task 46** (`investigate-mutation-testing-library-adoption`) `` — the descriptive name was **already alongside**, so the correct repair was the bare `` `0058` ``. |
| R5 | 1     | medium | `ai-agents/tasks/backlog/0226-…/brief.md:41` | The repair left **one sentence naming one referent two different ways**: *"This is the **task-70** failure mode recurring inside the very checklist that documents **`0008`**…"*. At `HEAD` the sentence read *"…that documents task 70"* — internally consistent, and its rhetorical point rested on the repetition. Half-repairing it degraded the record. Disclosed by the run at `:210-214`, but 170 lines from the reader who hits `:41`. |
| R6 | 1     | medium | `ai-agents/tasks/backlog/0046-…/brief.md:101`, `0168-…/brief.md` (`## Notes` dependency bullet) | **Shape 3's stated purpose is not met on the board surface for 2 of the 4 repaired rows.** `dashboard.sh` still derives `0046` as `depends="task 36"` and `0168` as `depends="0160 — hard."` — the corrections fall outside the `**…**` span the parser reads. For `0046` the board therefore **still prints the mis-resolving numeral this task exists to eliminate**. The brief's rationale is *"the row presents as blocked to anyone skimming the board — this is how ready work goes unscheduled"*; the dashboard **is** that surface. Disclosed as worklog residual 3, but framed as cosmetic. |
| R7 | 1     | low    | `claude/skills-for-role.sh:20` | The comment narrating the incident — *"**Task 70** followed the two-item list precisely…"* — is **still stale**, and it is the seed the run's own `task 70` → `0008` argument rests on. Correctly out of scope (the owner's widening covered the `task 43` numeral only), but the worklog's `## 9 Residuals` never carries it: residual 2 covers `test/`'s `task 43`, residual 4b the hyphenated form, and **no residual names `claude/`'s surviving `Task 70` / `Task 36` / `task 67` live seeds** — they appear only in §3, not in the residual list a later reader consults. |

### Disproven — recorded so the coder is not asked to chase it

- **Codex claimed the repairs break the `` `NNNN` (`folder-slug`) `` contract** by writing a bare
  `` `0072` `` at `0013:20` / `:42` / `:45` / `:48` and a bare `` `0052` `` at `claude/fkit-claude.sh:255`
  / `:274` / `:283` / `:286` / `:293`. **INCORRECT.** The run declared *"full form on the first
  occurrence of each numeral in each file, bare ID after"* (worklog §3, decision log #11) and applied
  it exactly: `0013:1` (the H1) carries `` `0072` (`remove-fkit-omnigent-orphan-residue`) ``, `0013:27`
  carries `0069`'s full form, `0013:74` carries `0078`'s, and `claude/fkit-claude.sh:19` carries
  `0052`'s. Codex read the later occurrences without the first. No action.

### Verified and could not fault — the load-bearing claims survived attack

- **⭐ `task 70` → `0008` is CORRECT, and the brief's explicit ⛔ was WRONG.** Both reviewers reached
  this independently, and git settles it: in commit **`0ad055a` (2026-07-18)** the false claim
  `only /fkit-team and /fkit-query — it routes, it doesn't do.` was **removed from
  `claude/scaffold/CLAUDE.md` in the same commit that added `fkit-open-questions-interview` to
  `skills_for_role()`** — i.e. `0008`'s landing is what made *"the lead has only two skills"* stop
  being true. Corroborating: `0008` carries `## Priority` **70**; **`0070` carries Priority 57**, so it
  cannot be `task 70` under the resolution rule at all; and `0070`'s own brief forbids the very diff
  the incident describes (`0070:100` — *"No `skills-for-role.sh` diff and no `fkit-team` / `README.md`
  mirror-table diff"*). The owner's override of the brief was right.
- **The Priority-field resolution rule holds on every numeral it was used for.** Read off disk:
  `0006`=23, `0088`=26, `0069`=27, `0023`=28, `0072`=36, `0052`=43, `0058`=46, `0064`=47, `0086`=48,
  `0078`=80, `0008`=70. Each also confirmed a second way from prose or git. Independent corroboration
  found for `task 23`: `cancelled/0004-add-e2e-smoke-script-for-fkit-itself:13` reads *"superseded by
  Sprint 2 task 23"*, and `0006` is `add-launcher-contract-smoke-script` — the same ground.
- **All 10 `` `NNNN` (`slug`) `` pairs match their disk folder names exactly** (mechanically checked
  against `ai-agents/tasks/*/`). No wrong-task referent found anywhere. **No numeral resolves to two
  different IDs across files.**
- **Every re-pointed board path exists** (`done/sprint-2.md`, `done/sprint-3.md`, `done/sprint-5.md`).
  The two `sprint-6.md` markdown links point at the **live** board and were correctly left alone.
- **No `Depends on:` or `Blocks:` line was removed or altered** anywhere under `ai-agents/tasks/` or
  `claude/` — byte-identity held. Correction bullets are nested; **`dashboard.sh` exits `0` on both
  boards with `^drift ` = 0 and `^derive .*UNPARSEABLE` = 0.**
- **Scope held.** Nothing under `test/`, `bin/`, `claude/scaffold/`, `ai-agents/wiki-vault/`,
  `tasks/done/`, `tasks/cancelled/`. No `## Status` line added or removed. No task file moved.
  `claude/structure-manifest.tsv` absent from the diff.
- **`0236:95` was re-pointed correctly.** The matched string is a **file the implementer is told to
  open** (`sprint-3.md`), not the `sprint-2.md` the surrounding sentences are *about* — and the
  neighbouring list item already reads `done/sprint-2.md`, confirming the author's intent. Verified
  `ai-agents/sprints/done/sprint-3.md` exists **and still contains the literal old path (×2)**, so the
  bullet's claim stays true and is now resolvable.
- **The two class-C "leave it" calls are genuine decisions, not unrepaired work.** `0234:113` — the
  sentence says *"all four **live** boards"* and lists three archived ones, so a path-only re-point
  would leave *"live"* and *"four"* false; that is `0234`'s own call. `0296:194` — the
  `done/sprint-*.md` glob in the same loop already matches `done/sprint-5.md`, so re-pointing would
  double-scan and deleting the term edits someone else's command. (The **stated reason** at `0296` is
  wrong — R2 — but the **decision** is right.)
- **`0302:159` is a quotation of `test/prove-red.sh:346`, not of `claude/skills-for-role.sh`** —
  confirmed on disk. The run corrected its own plan here; that quotation is genuinely still accurate.
- **The `0196` and `0305` stale-quotation notes are adequate.** Each reproduces the old wording **and**
  the current wording, gives the numeral → folder-ID key, and names the coincidence landing it is not.
  `0196:123-137` verified against `claude/fkit-claude.sh:283` line by line. A reader is not misled.

### Re-litigates settled decisions (suppressed)

**None raised.** The following were **checked and deliberately not re-raised** — each is an owner
ruling recorded in `plan.md`'s 2026-08-15 addendum, not a defect: the `task 70` override (OQ 1), the
widened Shape-2 set (OQ 5), class E as a fifth leave-class (OQ 2), path-only re-pointing with `:NNN`
suffixes left byte-identical (OQ 3), excluding `0306`'s own brief from both sweeps (OQ 4), and the
four judgement calls ruled at worklog §6. No ADR in `ai-agents/knowledge-base/decisions/` carries a
**"Re-raise only if"** condition that any finding above meets.

### Convergence call

**Act, do not close out.** This is round 1 — nothing here re-litigates anything, and five of the seven
findings are **new record-quality defects the run itself introduced** (R1–R5), which is precisely the
class this task exists to remove. None is blocking: the tree is sound, the board parses, and the
load-bearing resolution work survived a two-reviewer attack intact. R6 and R7 are **frontier-moves**
needing an owner disposition rather than a fix.

---

## Reviewer findings — Round 2 (convergence)

**Every claim below was re-derived from disk this round. Nothing was accepted on the coder's say-so,
and nothing was accepted on the driver's say-so.**

### R1–R5 — the applied fixes, verified as landed and correct

| # | Claimed fix | Verified independently | Verdict |
|---|---|---|---|
| **R1** | `0226`'s note headline no longer claims *both* `Task 70` mentions were left byte-identical | `0226:208-209` now reads *"every "Task 70" / "task-70" mention in `## Context` means `0008`, not `0070`. ONE was repaired; the rest were deliberately left byte-identical."* — checked against the actual `## Context` population (`:37` quoted-left, `:41` repaired to `` `0008` ``, hyphenated survivors left). `:232` records the superseded wording. **The headline and its own bullets now agree.** | **CLOSED — correct** |
| **R2** | `0296`'s *"simply contributes nothing"* replaced with measured behaviour + the Trap-2 tie | **The narrowing is CORRECT and is not a softening — see the box below.** | **CLOSED — correct** |
| **R3** | `×14` → `×16 (8 each)`; `4+4+1+16 = 25` | **Re-counted per file, not inherited:** `prove-red.sh` 4, `launcher-contract.test.js` 4, `skill-ownership-hook.test.js` 1, each fixture **8**; `grep -roiE '\btask 43\b' test/` totals **25**. Corrected in **both** `0302:279-284` and worklog §1 finding 6. ⛔ `test/` untouched. | **CLOSED — correct** |
| **R4** | `0037:47` → the bare `` `0058` `` inside the bold, slug once outside | Disk reads `` rather than folded into `0058`** (`investigate-mutation-testing-library-adoption`) `` — one slug, not two. `HEAD` confirms the name was already outside the bold. `:48`'s later occurrence correctly carries the bare `` `0058` ``, matching the run's declared form. | **CLOSED — correct** |
| **R5** | disclosure half only — pointer blockquote beneath `0226:41`; string untouched | Blockquote present at `0226:45-51`, immediately beneath the sentence; states the shared referent, the deliberate leave, and the ⛔ *"not `0070`"*. `git diff` confirms the `task-70` **string at `:41` is unchanged**. **The boundary the driver drew is right — see the box below.** | **CLOSED — disclosure half correct; string half is an accepted residual** |

> **⭐ R2 — the coder's narrowing was CHECKED and it did NOT soften the finding.**
> I re-ran `0296:193-199`'s loop verbatim against the live tree. Measured: `grep` on the dead
> `ai-agents/sprints/sprint-5.md` term **warns on stderr and exits `2`**; that `2` is **discarded**
> because `grep` is not last in the pipeline; the pipeline's own status is the `while` loop's, **`0`**;
> and **no false `DEAD:` line is emitted**, because the resolution test is `[ -f ]` and the loop body
> never iterates on empty input. **All four of the coder's claims reproduce.**
> **My R1 finding never claimed a false `DEAD:` line** — it claimed the *stated reason* (*"simply
> contributes nothing"*) was false, and that `0296`'s own Trap 2 records that shape. **The rewrite
> keeps both**, and adds the precision that the corruption does not occur *here*. That is a
> **strengthening, not a narrowing.** ⚠️ One honest nit, recorded and not raised as a defect: the note
> says the site is *"exactly that shape"* as Trap 2 and then immediately bounds it with *"it does not
> corrupt the result here"* — the qualification sits in the adjacent clause, which is the same
> disclosure-adjacency standard R5 asked for. Acceptable as written.

> **⭐ R5 — the driver's scope call was CHECKED and it is RIGHT.**
> My R5 finding had two halves: **(a)** the sentence names one referent two ways, and **(b)** its only
> disclosure sat ~170 lines away at `:210`. **The owner's ruling routed the hyphenated-string class to
> a follow-up brief; it did not rule on (b).** Closing (b) is not a widening of that class — it is the
> plan's own already-approved treatment for a deliberately-left site (*"a dated note beside every left
> site"*, worklog §3), applied at the site instead of only under `## Notes`. **Had (b) been routed away
> too, the record would have shipped a mixed-naming sentence with nothing beside it saying why** — the
> exact record-quality defect this task exists to remove. ⛔ **I do not think the pointer belongs in the
> follow-up brief.** It is additive, self-contained, revertible, and it leaves the string for the brief.

### R6, R7 — the residual claims, re-verified on disk

- **R6 reproduces exactly.** `dashboard.sh ai-agents/sprints/sprint-6.md` still prints
  `derive 0046 depends="task 36"` and `derive 0168 depends="0160 — hard."`. Both boards exit `0` with
  anchored `^drift ` = **0** and `^derive .*UNPARSEABLE` = **0**. The residual's description is accurate.
- **⭐ R7's re-derived figure is CONFIRMED, independently: 10 sites across 7 files.** Derived here with
  `grep -rniE '\btask ?-?(70|36|67)\b' claude/` minus `claude/scaffold/` — **10 lines, 7 distinct
  files**, and the per-numeral split checks out (`Task 70` ×2, `task 36` ×3, `task 67` ×5).
  **The coder's catch was real:** `claude/skills/fkit-status/dashboard.sh:58` (`task 36`) is on disk and
  was genuinely absent from worklog §3's list. **My round 1 missed it too.** ✅ `claude/scaffold/`
  carries **0**, confirmed.

### Two NEW findings this round — both in the residuals, both the class this task exists to remove

| #  | Sev | file:line | Claim |
|----|-----|-----------|-------|
| **R8** | low | worklog §9 residual 4b; `review.md` *Accepted residuals* R5 row | **The hyphenated-class count is wrong: it is 6 occurrences, not 7.** Re-derived at `HEAD` across every open brief except `0306`: `0226:41`, `0226:161`, `0226:186`, `0037:24`, `0156:120`, `0184:165` — **6, across 4 files**. Worklog §6's own table lists exactly those six rows, then its prose says *"7 occurrences"*. ⚠️ **This is R3's defect class exactly** — an itemisation that does not sum to its stated total — reproduced inside the residual the owner just ruled into a follow-up brief. **Corrected in the Accepted residuals below; the worklog still carries the `7`.** |
| **R9** | low | worklog §9 residual 7; `review.md` *Accepted residuals* R7 row | **R7's headline over-claims completeness.** The figure `10` is exact **for the `{70, 36, 67}` set that was measured**, but both records generalise it to *"10 stale **non-`task 43`** numerals"*. `claude/` carries **at least 7 further citation-shaped sites using numerals THIS TASK'S OWN §2 table resolved** — `task 26` → `0088` (`fkit-claude.sh:561`, `fkit-claude-init.sh:805`, and hyphenated `task-26` at `fkit-claude.sh:426`), `task 27` → `0069` (`fkit-claude.sh:562`), `task 80` → `0078` (`fkit-wiki-sync/SKILL.md:103`, `fkit-wiki-lint/SKILL.md:67`, `fkit-wiki-ingest/SKILL.md:58`) — **3 of those files are not among R7's 7.** ⚠️ **Consequence, and the only reason this is worth raising:** the owner ordered a follow-up brief scoped from this residual, and as worded it would under-scope by 7 known-resolvable sites. **Scoped correctly in the Accepted residuals below.** (Two further sites are *illustrative*, not citations — `fkit-status/SKILL.md:271`'s `⟨derive: task 26 and task 27.⟩` example row and `dashboard.sh:763`'s hypothetical `task 47` — and are deliberately **not** claimed here.) |

**⛔ Neither R8 nor R9 needs a coder round.** Both are corrections to records **the reviewer owns** and
both are made below. **No source file, brief, or `plan.md` change is implied by either.** The only
carry-forward is that **the follow-up briefs must be scoped from the corrected figures below, not from
the worklog's.**

### Round 2 — verified and could not fault

- **`plan.md` is byte-frozen.** `git hash-object` = `fc99fd6c0695d68369ba8216343ddf5a4ee57711`,
  matching the blob recorded at build time. Not amended by either round.
- **No forbidden path entered the tree.** `git status --porcelain` matches nothing under `test/`,
  `bin/`, `claude/scaffold/`, `ai-agents/wiki-vault/`, `tasks/done/`, `tasks/cancelled/`.
- **No `## Status` line changed** — `git diff -U0 | grep '^[+-]## Status'` is empty.
- **No `Depends on:` / `Blocks:` bullet was added or removed** anywhere under `ai-agents/tasks/` or
  `claude/`. The only diff line matching that label is `ai-agents/sprints/sprint-6.md`'s single board-row
  description change, which is **the driver's pre-existing modification, not this task's** (§7).
- **No task file moved; no follow-up folder was filed.** Correct — filing is producer-only.
- **R8 and R9 are not re-litigation.** Neither was raised in round 1; both are defects *introduced by
  round 1's own remediation*, and neither touches an owner ruling or a recorded frontier-move.

### Round 2 convergence call

**CONVERGED. Close it out.** Round 2 raised **zero** findings against the change surface itself — R1–R5
all verified landed and correct, R6 and R7 reproduce exactly as recorded, and the driver's two
judgement calls (R2's narrowing, R5's boundary) both survive checking. The only two new findings are
**low-severity count/scope corrections to the residual records, and the reviewer has made both here** —
they close in this round and open no coder work. **Nothing in round 2 re-litigates an owner ruling or a
settled tradeoff.** ⚠️ Round 2's own coverage is **single-reviewer** (no Codex pass, by instruction) —
round 1's FULL 2-of-2 coverage of the same change surface stands unchanged.

---

## Coder response

<!-- CODER-OWNED — the reviewer never writes this section. -->

**Round 1 processed 2026-08-15** by `fkit-coder` (Process-review step of `/fkit-sprint-ship-loop`,
Sprint 6 P1), under the driver's declared-approval marker. **Every finding was verified against disk
before any verdict was assigned — none was applied on the reviewer's say-so.** **All 7 verified
`CORRECT`; none rejected.** ⛔ No commit, no push, no `git add`, no `git stash`. ⛔ `plan.md` unchanged.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | defect (record-quality, introduced by this run) | Headline of `0226`'s dated note rewritten — it no longer claims *both* `Task 70` mentions were left byte-identical; a closing bullet records what it first said. ⛔ No `Task 70` / `task-70` string in `## Context` rewritten. | **fixed** |
| R2 | **CORRECT** | defect (wrong stated reason; decision sound) | `0296`'s *"simply contributes nothing"* replaced with the measured behaviour and the tie to this brief's own Trap 2. **The leave-it decision and the loop site are unchanged.** | **fixed** |
| R3 | **CORRECT** | defect (arithmetic) | **Re-derived from disk, not taken from the finding:** fixtures carry **8 each = 16**; `4+4+1+16 = 25`. Corrected in **both** `0302`'s note and worklog §1 finding 6. | **fixed** |
| R4 | **CORRECT** | defect (botched substitution) | `0037:47` → `` `0058`** (`investigate-mutation-testing-library-adoption`) ``. `HEAD` confirmed the name was already outside the bold, so the bare ID was the right substitution. | **fixed** |
| R5 | **CORRECT** | defect (disclosure distance) — **half fixed by owner ruling** | ⛔ The `task-70` **string was NOT rewritten**: owner ruling **"File a brief for the whole hyphenated class (Recommended)"** puts it in a follow-up. **Only the 170-line gap was closed** — a pointer blockquote now sits immediately beneath the sentence at `## Context`. | **fixed (distance) / residual (string)** |
| R6 | **CORRECT** | **frontier-move** — fixing it means editing a line declared byte-identical | ⛔ **Not fixed.** Owner ruling **"File a follow-up task (Recommended)"**. Recorded as residual; worklog residual 3 upgraded from *cosmetic* to a stated gap in Shape 3's purpose on the board surface. ⛔ No `Depends on:` line touched. This step files nothing (producer-only). | **residual — follow-up owed** |
| R7 | **CORRECT** | **frontier-move** — outside the owner's `task 43`-only widening | ⛔ **Not fixed.** Owner ruling **"Name them in Residuals, then file a follow-up (Recommended)"**. Promoted from worklog §3 into **worklog residual 7**, re-derived on disk: **10 sites / 7 files**. ⭐ **§3's own list was incomplete — it missed `dashboard.sh:58` (`task 36`)**; corrected. | **residual — follow-up owed** |

**Codex's disproven claim was not chased**, as the ledger records: the run declared *"full form on first
occurrence per file, bare after"* and applied it exactly. Left rejected.

**Verification after these fixes** (all re-run this step, not inherited):
`npm test` **green** — `node --test test/*.test.js` `pass 730 / fail 0`, and `prove-red.sh` reports
`✓ hard gate PASSED`. `dashboard.sh` exits `0` on **both** boards with `^drift ` = **0** and
`^derive .*UNPARSEABLE` = **0**, unchanged from baseline. `git diff -U0 | grep '^[+-]## Status'` is
**empty**; no `Depends on:` / `Blocks:` line changed; nothing under `test/`, `bin/`, `claude/scaffold/`,
`ai-agents/wiki-vault/`, `tasks/done/`, `tasks/cancelled/`; `ai-agents/sprints/sprint-6.md` carries only
its pre-existing modification. **Five files touched this step:** `0037`, `0226`, `0296`, `0302` briefs
and `0306`'s `worklog.md` (plus this ledger). **No new file was created and no task folder was filed.**

---

## Accepted residuals (shared, do-not-re-litigate)

<!-- Entries are added only once the owner approves treating a finding as a settled tradeoff. -->

**Owned and written by `fkit-reviewer`, round 2, 2026-08-15.** ⚠️ **Section-ownership deviation,
recorded rather than left silent:** this section was first written by `fkit-coder` in round 1, on the
driver's explicit instruction; the coder disclosed the deviation inline rather than letting it pass.
**The instruction was the driver's, not an overstep by the worker.** The reviewer has now reviewed that
content, **taken ownership of the section, and rewritten it.** Verdict on what the coder wrote: **the
owner rulings were transcribed correctly and the R6 row was accurate as written; two figures in it were
wrong and are corrected here — see R8 and R9 in round 2.**

Source of the rulings: `AskUserQuestion`, live `fkit lead` session driving `/fkit-sprint-ship-loop`,
2026-08-15. **Each ruling is a selection from an option list, so the option label is the verbatim text.**

| # | Accepted residual — **figures re-derived from disk by the reviewer, round 2** | Owner ruling — verbatim option label |
|---|---|---|
| **R6** | `0046` and `0168` still derive **stale dependency text** on the dashboard (`depends="task 36"`, `depends="0160 — hard."`) — the nested corrections fall outside the `**…**` span the parser reads. ✅ **Reproduced by the reviewer on disk in round 2: both cells still print the stale text.** Not `UNPARSEABLE`; every row still derives; both boards exit `0` with `^drift ` = 0. Fixing it means editing a line this task declared byte-identical, or teaching `dashboard.sh` to read the nested correction. **Accurate as first written.** | **"File a follow-up task (Recommended)"** |
| **R7** | **`claude/` (excluding `claude/scaffold/`) carries 10 stale sites across 7 files in the `{task 70, task 36, task 67}` set** — `Task 70` ×2 (`skills-for-role.sh:20`, `fkit-claude.sh:267`), `task 36` ×3 (`fkit-claude-init.sh:578`, `orphan-targets:7`, `dashboard.sh:58`), `task 67` ×5 (`dashboard.sh:149/157/160`, `fkit-task-done/SKILL.md:195`, `fkit-task-cancelled/SKILL.md:202`). ✅ **10 / 7 independently confirmed by the reviewer, round 2.** ⭐ The coder's own catch stands: worklog §3 had missed `dashboard.sh:58`. ✅ `claude/scaffold/` carries **0**. ⚠️ **CORRECTED (R9): this is NOT the whole non-`task 43` population** — `claude/` carries **at least 7 further citation-shaped sites on numerals this task itself resolved**: `task 26` → `0088` (`fkit-claude.sh:561`, `fkit-claude-init.sh:805`, hyphenated `task-26` at `fkit-claude.sh:426`), `task 27` → `0069` (`fkit-claude.sh:562`), `task 80` → `0078` (`fkit-wiki-sync/SKILL.md:103`, `fkit-wiki-lint/SKILL.md:67`, `fkit-wiki-ingest/SKILL.md:58`) — **3 of those files are outside the 7.** ⛔ **Scope the follow-up brief from BOTH lists, not from the 10 alone.** Correctly outside the owner's `task 43`-only widening either way. | **"Name them in Residuals, then file a follow-up (Recommended)"** |
| **R5 (string half)** | The **hyphenated `task-NN`** class is still stale. ⚠️ **CORRECTED (R8): the population is 6 occurrences across 4 open briefs, not 7** — `0226:41`, `0226:161`, `0226:186` (`task-70` → `0008`), `0037:24` (`pre-task-18`), `0156:120` (`task-68`), `0184:165` (`task-84`); the last three are numerals this task never triaged. Re-derived at `HEAD` by the reviewer, round 2; worklog §6's own table lists exactly these six and its prose then says *"7"*. ⭐ `0184` remains a file **no Shape-2 list ever named**, which is the finding worth keeping. ⛔ The string at `0226:41` was **not** rewritten. **Only the disclosure distance was fixed** — a pointer blockquote now sits at `0226:45-51`, beside the sentence; **the reviewer confirms that pointer is in scope and does not belong in the follow-up brief.** ⚠️ A hyphenated `task-26` also exists in `claude/` (`fkit-claude.sh:426`) — outside the open-brief population, listed under R7 above. | **"File a brief for the whole hyphenated class (Recommended)"** |

⛔ **No follow-up task folder has been created by either party.** Filing is **producer-only** and the
driver routes it; **its absence is not an unresolved finding and must not reopen this review.**
**Three follow-up briefs are owed: R6, R7, and the hyphenated `task-NN` class** — ⚠️ **scoped from the
corrected figures in this table, not from `worklog.md` §9**, which still carries the superseded `7`
hyphenated occurrences and the over-broad *"non-`task 43`"* framing (R8, R9). **The worklog was left
unamended deliberately: it is the coder's record, and this ledger is the authority on these three
residuals.**
