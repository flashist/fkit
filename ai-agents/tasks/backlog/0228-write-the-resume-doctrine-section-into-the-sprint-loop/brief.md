# Write the `## Resume doctrine` section into the sprint loop — `0167`'s follow-up 1, doctrine half

## ID
0228

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**This is the second, unshipped half of `0167`'s follow-up 1.** Filed on a **named owner ruling**
(`AskUserQuestion`, live `/fkit-sprint-ship-loop` driver session, **2026-08-05**).

`0167` — *"decide what the sprint driver does when a spawned worker dies"* — ruled in **§5** that the
exit-table row **and** a `## Resume doctrine` section **must ship together**, and explicitly rejected
the row-alone option:

> **B, shipped as ONE follow-up task.** The row and the doctrine must land together: a row whose action
> cell says *"classify the disk state and act per §Resume doctrine"* is incoherent if that section does
> not exist, and a row that inlines the classification would be an unreadable table cell.

**Task `0208` shipped the row alone**, under owner ruling **OQ-1 → A**, *on the condition that this
brief be filed*. `0208`'s review ledger records the split as its **first accepted residual** — *"the row
ships without `0167` §5's resume-doctrine section … Re-raise only if: the doctrine half is ruled
unnecessary, or the row is found to be unusable without it."*

**Verified 2026-08-05, first-hand, this turn:** `0167`'s follow-up 1 had **never been filed and had no
board row** on any of the three boards. `/usr/bin/grep -rl 'Resume doctrine' ai-agents/tasks/` returned
only `0208`'s `plan.md` / `review.md` / `worklog.md` and `0167`'s own `review.md`;
`/usr/bin/grep -rn 'Resume doctrine' ai-agents/sprints/` returned **nothing**; no backlog folder name
matched. The doctrine existed **only inside a closed report's §10 and one task's working files** — which
is precisely the *"guidance only an archaeologist finds"* failure `0208` exists to fix. This brief is
what stops that failure being reproduced by the very task that names it.

### The three things the row provably cannot carry

`0208` shipped the decision procedure's **outputs**. Three pieces of `0167` are recorded in `0208`'s
ledger as **accepted residuals** precisely because a table cell cannot hold them:

- **`0208` residual R2** — *"the row carries decision-procedure OUTPUTS, not the procedure"*. `0167`
  §10 follow-up 1's owner-ruled **operational test** is not in the row.
- **`0208` residual R3** — *"`0167` §3's no-self-report rule has nowhere to live in a table cell"*.
- **`0208` residual R8**, folded into R2 by owner ruling 2026-08-05 — addendum part **(c)**
  (*"a structural probe cannot answer a content question"*) was compressed in the cell to the two words
  *"compare **content**"*, while parts (a) and (b) were carried near-verbatim. **Explicitly deferred to
  this task.**

Both R2 and R3 carry the re-raise condition *"only if the doctrine half is cancelled rather than
deferred."* **This task is the deferral being discharged.** Shipping it discharges all three.

### Conflict and dependency, stated up front

- ⚠️ **`claude/skills/fkit-sprint-ship-loop/SKILL.md` is a heavily contended file.** `0203`, `0208`,
  `0223`, `0224`, `0227` and `0204` all edit it. **Re-read it live and cite by section heading and row
  name, never by line number** (`0160`'s ruling binds here). Whichever lands second re-verifies its
  coordinates.
- ⛔ **`0208`'s shipped row is settled text.** Its three branches, their statuses and their wording were
  reviewed and owner-ruled on 2026-08-05 (dispositions D3, and fixes R1/R2/R3/R5/R6/R7). **Do not
  rewrite the row.** If the doctrine section needs the row to point at it, add **only** a pointer, and
  if a pointer cannot be added without altering ruled substance, **stop and surface the conflict** —
  do not resolve it in the edit.
- **Depends on:** nothing hard. `0208` has shipped the row, which is what makes this half the remainder.

## What to build

**One `## Resume doctrine` section in `claude/skills/fkit-sprint-ship-loop/SKILL.md`, sited beside
`## Durable artifacts` — the section it operates over. Nothing else.**

`0167` §10 follow-up 1 carries **four binding constraints** on this text plus one owner-ruled
operational test. They are reproduced below in substance; **read `0167` §10 follow-up 1 and §2's
addendum in full before writing — do not work from this brief alone.**

### 1. The full operational decision procedure — as a decision procedure, not a description

This is the piece `0208`'s row could not hold (residual **R2**), and it is owner-ruled (round-2 review
R11) because without it the SKILL inherits a **non-deterministic** classification — *"is a file
half-written?"* answers **no** on the form that actually occurred.

Write it as steps the driver executes:

1. **List the paths the spawn instruction told the worker to write.** The driver has that list, because
   it wrote the instruction.
2. **For each path, ask whether the obligation it carried was discharged.**
3. Then:
   - **None discharged → `Nothing landed`.**
   - **All discharged → `A complete unit landed`.**
   - **Some discharged, some not → ask the ONE question that separates the remaining two states:**
     *is what is on disk usable and safe to build on **with the missing paths never arriving**?*
     - **YES** — the landed part stands alone, the remainder is separable → `A complete unit landed`.
     - **NO** — the landed part's correctness, attribution, or meaning depends on a missing path →
       **the unit is torn** → `A partial unit landed` → **stop and put it to the owner.**

Carry both worked examples from `0167`, because they are what make the separating question decidable:
instance 2's first death (one coherent wiki bullet, two further pieces simply unwritten → **complete**)
and instance 3 (report corrections on disk whose verification record and attribution lived in a ledger
and worklog that never arrived → **torn**; two of those corrections were later found factually false,
and only independent re-measurement caught them).

### 2. `0167` §3's no-self-report rule — in the narrower SKILL wording, NOT §3's headline

⛔ **`0167` constraint (1) is owner-ruled (round-1 review R7) and is not optional.** §3's headline
sentence — *"It never asks a worker what it already did"* — **must NOT be copied into the SKILL**: §3's
own ADR-037 narrowing **requires** a resumed worker to re-derive from disk where its skill mandates one,
so a section carrying both sentences contradicts itself. `0167` prescribes the operative wording:

> **The driver does not rely on a worker's *recollection*; it derives landed-vs-outstanding from disk
> itself. The driver's enumeration is an INPUT to the resumed worker — never a substitute for the
> worker's own re-derivation where its skill mandates one.**

Record why, briefly: a worker that died mid-turn **cannot in principle** know whether its last write
landed — the failure sits exactly at the boundary between *wrote* and *reported wrote*. And ADR-037 §3
**forbids the driver** from instructing a worker to skip its own skill-mandated re-derivation.

### 3. The which-disk constraints — all three, uncompressed

`0167` §2's addendum exists because **a real driver read disk and still misclassified.** State all
three; part **(c)** is the one `0208` compressed and deferred here (residual **R8**):

- **(a) Enumerate the deliverable itself, wherever it lives** — the paths the spawn instruction named —
  **never the task folder as a proxy.** A worker's output is frequently not inside `<task-folder>/`.
- **(b) `git status` is NOT a landing detector for an untracked path.** It reads `??` before the write
  and `??` after it. Compare **content** — length, section content, mtime — never tracking state.
- **(c) A structural probe cannot answer a content question.** Listing a file's `## ` headings shows a
  section **exists**; it cannot show whether the section is **filled**. The misclassified instance's
  `## Coder response` heading was present as an empty scaffold and was counted as present.

**And define "partial" over the UNIT, not the file** — the form that actually occurred was several
files, each internally coherent, with the unit torn across them; a check for a half-written file returns
**no** on it.

### 4. The two disk states `0208`'s review surfaced — stated coherently, not left to the row

`0208`'s row fixed both. The doctrine should be the coherent account rather than leaving the row as the
only one:

- **A worker that discharged ALL paths and then failed to return** (`0208` **R2**, verdict CORRECT).
  This is `0167` §2's *"A complete unit landed"* — it routes to *resume / re-spawn / defer*, the drive
  **continues**, and the exit row **does not fire**. Before `0208`'s fix this state had no branch at all
  and would have force-fit `🚧 Blocked` over completed work.
- **A single half-written FILE**, as distinct from a unit torn across several (`0208` **R5**, verdict
  CORRECT). It is `partial` **by construction** — but **the test must not depend on finding one**,
  because the form that occurred had none. Both forms route to `partial`; disjointness with `complete`
  holds because *"stands on its own with the missing paths never arriving"* is false for either.

### 5. Operationalize the nothing-landed baseline

`0167` constraint (2), from §2's *Limits*: say **against which baseline** *"byte-identical to before the
spawn"* is measured — **capture the comparison point at spawn time and diff worker-owned paths against
it.** Without this a driver instead asks *"is this task's tree dirty?"*, which is **yes** for a task the
driver itself marked `🔄 In progress` and wrote `plan.md` for, and misroutes **every** empty attempt
into the `🚧 Blocked` branch — the precise error the classification exists to prevent.

### 6. Say, in the section, that it is not a copy of the sibling loop's

`0167` §5 requires this. `fkit-task-ship-loop`'s `## Durable state` section is about a loop re-deriving
**its own** position after **its own** interruption. This section is about a driver re-deriving **a dead
subordinate's** position while itself alive and holding context — **a different and harder problem**,
because the driver has a *plausible but unreliable* memory of what it asked for, which is more dangerous
than having none. An implementer who copies the sibling section across ships a doctrine that answers the
wrong question.

## Out of scope

- ⛔ **NO retry policy — no count, no limit, no backoff.** `0167` constraint (3) and §8. Who decides how
  many times a dead worker is re-spawned is **`0167`'s follow-up 3, an owner decision**, named and
  deliberately unanswered. Do not fold it in. Do not read the existing `Blocked — hand-off didn't land`
  row's *"re-spawn `@fkit-producer` once"* as licence — `0167` §8 declines it explicitly on three
  independent scopings.
- ⛔ **Do not rewrite `0208`'s shipped exit row** (see *Conflict* above).
- ⛔ **`0167`'s follow-up 4** — the one-line scoping note beside the `Blocked — hand-off didn't land`
  row — is **not in this brief's scope**. `0167` §10 says it *"ships with follow-up 1"*, but the owner
  ruled only follow-up 1 on 2026-08-05. **See the open question in `## Notes`.**
- ⛔ **No ADR.** `0167` §7 ruled none is required: the doctrine grants no authority, reverses no
  decision, mints no status value, changes no role boundary.
- ⛔ `ai-agents/wiki-vault/`, `claude/agents/*`, `/fkit-task-ship-loop`, and any hook.

## Verification steps

1. `claude/skills/fkit-sprint-ship-loop/SKILL.md` contains a `## Resume doctrine` section, sited beside
   `## Durable artifacts`.
2. **The operational test is present as a decision procedure** — a reader can execute it: list the
   instructed paths → discharged per path → the three outcomes, with the separating question written for
   the mixed case. Both worked examples present.
3. **The narrower no-self-report wording is present, and `0167` §3's headline sentence
   (*"It never asks a worker what it already did"*) is ABSENT** from the SKILL. Both halves checked —
   presence of the right form and absence of the forbidden one.
4. **All three which-disk constraints (a), (b), (c) are present and uncompressed** — in particular (c),
   *a structural probe cannot answer a content question*, which is the piece `0208` deferred here.
   "Partial" is defined over the **unit**, not the file.
5. Both disk states from §4 above are stated: the **all-paths-discharged** case (drive continues, exit
   row does not fire) and the **single half-written file** case (`partial` by construction, and the test
   does not depend on finding one).
6. The nothing-landed baseline names **when** the comparison point is captured (spawn time) and **what**
   is diffed (worker-owned paths).
7. The section says it is not a copy of `fkit-task-ship-loop`'s `## Durable state`, and why.
8. **No retry count, limit, or backoff appears in the new text.** Check by reading, and record the check.
9. **`0208`'s exit row is unchanged in substance** — `git diff` over the row shows either no change or a
   pointer-only addition. State which.
10. **Change surface is exactly one file** — `claude/skills/fkit-sprint-ship-loop/SKILL.md`.
    `git diff --stat` shows nothing else.
11. **Frontmatter guard green:** `node --test test/skill-frontmatter.test.js` passes.
12. **`npm test` passes.** Record pass/fail/suite counts.

## Notes

- **Depends on:** nothing hard. `0208` shipped the row half, which is what leaves this as the remainder.
- **Blocks:** nothing. **Discharges** `0208`'s accepted residuals **R2** (with R8 folded in) and **R3**,
  and its first accepted residual (*"the row ships without the resume-doctrine section"*).
- **Coordinates with `0203`, `0204`, `0223`, `0224`, `0227`** — same `SKILL.md`, different regions.
  Adjacency, not dependency. Re-verify coordinates at implementation time; cite by heading, never by
  line.
- **Source:**
  `ai-agents/knowledge-base/reports/2026-08-04-sprint-driver-response-to-a-dead-worker.md` — §2 (the
  three disk states and the which-disk addendum), §3 (the no-self-report rule and its ADR-037
  narrowing), §4, §5, §8, §10 follow-up 1. And
  `ai-agents/tasks/done/0208-add-an-exit-table-row-for-a-failed-build-verify-review-spawn-in-the-sprint-loop/review.md`
  — the *Accepted residuals* section (R2, R8, R3) and rows R2 / R5.
- **Filed on a named owner ruling** — `AskUserQuestion`, live `/fkit-sprint-ship-loop` driver session,
  **2026-08-05**. Filed by a **spawned producer with no owner channel**, which never re-ranks (ADR-035).
- **Backlog board — the owner named no sprint.** This board is unranked by design, so there is no rank
  to flag. **⚠️ Merit position, flagged for the owner:** on merit this belongs **directly below `0208`**
  and should be pulled into **Sprint 2** with it. Reason: `0167` §5 ruled the two halves *"must land
  together"*; they are currently split across two boards, and the longer the split stands the longer the
  driver's own control table carries decision-procedure outputs with the procedure nowhere a driver
  reads. **This is a merit statement only — no row is re-ranked and nothing is pulled into a sprint by
  this brief.**
- **⚠️ Owner field diverges from the spawn instruction's suggestion, and the divergence is the
  producer's call, not an owner ruling.** The driver suggested `fkit-architect` on the ground that this
  is a doctrine piece. **Assigned `fkit-coder` instead**, on three grounds: (i) the design work is
  already **done and owner-ruled** — `0167` §10 fixes the operational test, the exact no-self-report
  wording, and all four constraints, so what remains is composing ruled content into a source file;
  (ii) `claude/skills/**/SKILL.md` is source, and the coder is the sole source-write authority; (iii)
  `0208`, the sibling half of this same follow-up and the same file, was owned by `fkit-coder`.
  **Consult `fkit-architect` during the plan for item 5** (the spawn-time baseline mechanism), which is
  the one piece `0167` leaves as *"mechanical"* rather than fully specified.
- **⚠️ Open question for the owner — `0167`'s follow-up 4.** `0167` §10 says follow-up 4 (a one-line
  scoping note beside the `Blocked — hand-off didn't land` row, stating its producer re-spawn is
  close-step-specific and is **not** the dead-worker rule) *"ships with follow-up 1"*. The
  **2026-08-05 ruling named follow-up 1 only**, so it is scoped **out** here rather than folded in.
  **Should it be added to this task, or filed separately?** Folding it in is one line in the same file
  and the same edit; leaving it unfiled leaves an ambiguity `0167` §8 specifically warns a later reader
  will trip over.
- **⚠️ Wiki gap, flagged.** `/usr/bin/grep -rln 'Resume doctrine\|0167' ai-agents/wiki-vault/` returned
  **no files**, measured 2026-08-05. `0167`'s report has never been ingested — its own §13 filing note
  asks `fkit-wiki` to do so. **Not scoped here**, but the ruling this task implements is currently
  invisible to every `/fkit-query`.
