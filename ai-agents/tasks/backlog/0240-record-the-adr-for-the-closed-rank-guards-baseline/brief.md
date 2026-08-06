# Record the ADR — the closed-rank-immutability guard's baseline is `HEAD`, and its scope is the transition in progress

## ID
0240

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### Authority — three owner rulings, in sequence

All taken via `AskUserQuestion` in a live `fkit lead` session on **2026-08-06**:

1. On who should settle `0182`'s blocking baseline question — **"Have the architect decide it."**
2. The architect consult delivered its recommendation and returned two open questions. On CI —
   **"No CI planned."**
3. On whether to include the `HEAD` ↔ `HEAD^` second leg — **"Include it."**

This task records the resulting decision as an ADR. **The decision has been taken. This task does not
re-open it.**

### What the architect recommended

**Baseline = `HEAD`. Scope = the transition currently in progress, not a history range.**

This does not *answer* `0182`'s blocking decision — it **dissolves** it. `0182` is blocked on choosing
between *exempt history before a named commit* and *accept a permanently red run*. With no history
range there is no permanently red run, and therefore **no exemption to justify**. The `0174` commit
that renumbered eight closed rows stays in history, red or not, without the guard ever asserting over
it.

**The deciding criterion, and the sentence the ADR exists to preserve:**

> A baseline must be a record you cannot rewrite in the same act that breaks the invariant.

`HEAD` satisfies it — a working-tree change cannot alter what `HEAD` already committed.

**A committed snapshot / manifest file was rejected BY NAME**, and the ADR must record the rejection
with its reasoning intact: a manifest's only repair path is regenerating it from the thing under test,
so the act that breaks the invariant is also the act that updates the baseline — **laundering the
breach into the baseline.** It fails the criterion above by construction, not by accident.

### Why an ADR rather than a note on `0182`

Two reasons, both from the architect:

1. **[ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)'s
   §"Left undone, deliberately" leaves this hole open explicitly** — *"No guard is built here… it needs
   a baseline decision first, because it would be red on the commit that filed task `0174`."* The hole
   is named in an accepted ADR; the answer belongs at the same altitude.
2. **The snapshot idea will otherwise return as a review finding.** Recording the rejection by name is
   what makes a future proposal *closeout* rather than a new defect — the same device ADR-035 uses for
   the three options it rejected.

## What to build

An ADR in `ai-agents/knowledge-base/decisions/`, via `/fkit-record-decision`.

### It must contain

- **The decision:** baseline `HEAD`; scope = the transition in progress; **plus the `HEAD` ↔ `HEAD^`
  second leg, which the owner ruled *"Include it"*.**
- **The criterion**, stated as a criterion so it generalizes: *a baseline must be a record you cannot
  rewrite in the same act that breaks the invariant.*
- **The rejected option, by name:** a committed snapshot/manifest, with the laundering argument.
- **⚠️ The accepted residual, stated honestly and prominently — not implied away.** The design
  **knowingly accepts that a breach committed with no test run in between is never caught.** A
  working-tree comparison against `HEAD` sees only what is uncommitted right now; commit the breach,
  run nothing, and the next comparison's baseline already contains it. **This is a real limitation,
  ruled acceptable, and the ADR must say so.** An ADR that implies full coverage of closed-rank
  immutability is a defect of this task. Note that the `HEAD` ↔ `HEAD^` leg **narrows** this residual
  by one commit; it does not remove it, and the ADR must not let the second leg read as a fix.
- **The owner's CI ruling — "No CI planned"** — recorded as a **premise**, because it is load-bearing:
  with no CI, "run on every commit" is not available and the residual above cannot be closed by
  automation. The ADR's answer would change if that changed, which is why:
- **A mandatory `Re-raise only if` clause**, following ADR-035's own form, with at least these two:
  - **Re-raise only if CI is introduced** — the residual becomes closeable and the range question
    genuinely reopens.
  - **Re-raise only if the closed-row rule itself is revised** — this decision is downstream of it, as
    ADR-035 records of its own narrowing.

### ⛔ Out of scope

- **⛔ No implementation.** Do not write `test/closed-rank-immutability.test.js`, do not edit anything
  under `test/`, `claude/`, or any board. That is `0182`, and it is `fkit-coder`'s.
- **⛔ Do not re-open the decision.** The owner ruled on both open questions. A finding proposing a
  committed snapshot/manifest, or a history-range scope, is **closeout, not a new defect.**
- **⛔ Do not re-rank anything.** ADR-035 — closed rows are never renumbered, and a spawned session
  never re-ranks.
- **⛔ Do not repair the eight rows `0174` renumbered.** ADR-035 rejected reverting by name; `0183`
  corrects the record.
- **⛔ Do not write `ai-agents/wiki-vault/`** (ADR-005). If the ADR warrants an ingest, **file it as a
  follow-up** — the `0199` / `0239` shape.
- **⛔ No `:NNN` line-number citations** in this task's artifacts.
- **⛔ No commit.**

### ⚠️ The number hazard — do NOT pre-allocate 039

**Sequence this task AFTER [`0222`](../../done/0222-record-adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs/brief.md),
which files ADR-038 and carries its own mandatory four-way number sweep.** `adr-037` is the highest on
disk today and `0222` has not landed, so **039 is likely and MUST NOT be assumed.**

Run the **same mandatory four-way sweep `0222` carries** before allocating: `decisions/`, `reports/`,
**the sprint boards**, and **`ai-agents/wiki-vault/` (read-only, ADR-005)**. The **ADR-029 precedent**
is the reason: a number was once claimed **everywhere except `decisions/`**, so sweeping `decisions/`
alone is exactly the check that has already failed once in this repo. Measured at filing on
2026-08-06, the strings `adr-038` / `adr-039` already appear across **17 files** — boards, briefs,
reports, and the vault — none of which is a `decisions/` file.

## Verification steps

1. `0222` is closed before this starts — state its close date and the ADR number it took.
2. The four-way sweep is **run and its output recorded in the worklog** before a number is allocated —
   `decisions/`, `reports/`, the sprint boards, `wiki-vault/`. Sweeping `decisions/` alone fails this
   step.
3. The allocated number is unclaimed in all four places.
4. The ADR names the rejected snapshot/manifest option and reproduces the laundering argument.
5. The ADR states the accepted residual — *a breach committed with no test run in between is never
   caught* — **in its own section, not in a footnote or a parenthetical.** Grep the file for the
   claim; if it is not findable as a standalone statement, this step fails.
6. The ADR carries a `Re-raise only if` clause containing both named triggers.
7. The ADR records **"No CI planned"** as a dated premise attributed to the owner ruling of
   2026-08-06.
8. `git diff --stat` shows **one new file under `ai-agents/knowledge-base/decisions/`** plus, at most,
   board/brief rows the producer adds. **Nothing under `test/`, `claude/`, or `ai-agents/wiki-vault/`.**
9. `0182`'s blocking status is addressed in the close report: state explicitly that the blocking
   decision is **dissolved, not answered**, and that `0182`'s brief still records the old blocked
   framing. **Do not edit `0182`'s brief** — hand that to the producer as a follow-up.

   > **⚠️ DATED CORRECTION 2026-08-06 — the follow-up has ALREADY been done. Step above left
   > byte-identical.** A spawned producer applied the architect's decision and all twelve of its
   > corrections into `0182`'s brief the same day, as
   > [`0182`](../../done/0182-build-the-closed-rank-immutability-guard/brief.md) §"✅ DECIDED 2026-08-06".
   > **`0182` no longer records the old blocked framing** — its original text is preserved
   > byte-identical beneath a dated correction that governs.
   > **What this step now requires:** still state in the close report that the block is **dissolved,
   > not answered** — that claim is unchanged and still load-bearing. **Drop only the *"still records
   > the old blocked framing"* half, and check the brief first rather than asserting either way from
   > this line.** ⛔ **The prohibition stands: this task still does NOT edit `0182`'s brief.**

## Notes

- **Depends on:** `0222` — hard, for the ADR number only. `0222` files ADR-038 and runs the number
  sweep; allocating before it lands risks a collision that is permanent once anything links to it.
  **The decision itself does not depend on `0222` in any way** — the two ADRs are unrelated in subject.
- **Blocks:** `0182` — soft. `0182` is currently recorded as blocked on this baseline decision, and this
  ADR is what discharges that block. It is soft rather than hard because the ruling already exists in
  the session record; the ADR is what makes it durable and citable.
- **Related, not blocking:** `0181` (narrows the re-rank exception — the rule `0182` enforces), `0183`
  (corrects the two live records that claimed no closed row was renumbered), ADR-035 (whose
  §"Left undone, deliberately" this ADR closes).
- **⚠️ `0182`'s brief carries a separate, already-flagged defect that this task does NOT fix:** its
  guard glob `ai-agents/sprints/sprint-*.md` no longer reaches the archived Sprint 2 board at
  `sprints/done/sprint-2.md` — the exact history it exists to protect. A separate unit is queued for
  that. **Do not fold it in here, and do not build `0182` against the current glob.**
  - **⚠️ DATED CORRECTION 2026-08-06 — the glob defect is REPAIRED. Text above left byte-identical.**
    The *"separate unit queued"* landed the same day: `0182`'s §"✅ DECIDED 2026-08-06" **correction 4**
    globs **both** `ai-agents/sprints/sprint-*.md` **and** `ai-agents/sprints/done/sprint-*.md` and
    **excludes `backlog.md` with a stated reason**. ⛔ **Both prohibitions still stand** — do not fold
    it in here, and build `0182` only against its corrected specification, never against its
    §"The condition" glob.
- **Priority is `—` (unscheduled).** Filed to the Backlog board on the owner's rulings; no sprint was
  named and no row was re-ranked (ADR-035, `/fkit-task-brief` step 5). **Sequencing after `0222` is a
  dependency, not a rank** — `0222` sits on Sprint 3 at `P3` and this row is unscheduled, so nothing
  here asserts a position on any ranked board.
