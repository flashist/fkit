# ADR-034: A stateful review ledger closes on the work product, not on the task's own record

- **Status:** accepted
- **Date:** 2026-07-31
- **Deciders:** owner (Mark Dolbyrev), ruling in a live `fkit-lead` session during a
  `/fkit-sprint-ship-loop` run; question raised by **fkit-reviewer**, which explicitly declined to set
  the bar itself; recorded by fkit-architect.
- **Scope:** the close condition of a **stateful review ledger** (`<task-folder>/review.md`). It does
  not change what a review *finds*, only when the loop **stops**.

## Context

A stateful review runs in rounds. The reviewer writes findings into a shared `review.md` ledger, the
responder verifies and dispositions each one, and the loop repeats. Both skills say to close the ledger
but neither defines the bar in terms of *what surface* must be clean:

- `claude/skills/fkit-stateful-review/SKILL.md:156` — the reviewer sets `Status: closed-out`
  **"when warranted"**. The condition is undefined.
- `claude/skills/fkit-process-stateful-review/SKILL.md:200-201` — *"If all novel findings are closeout /
  disproven / accepted and nothing blocking remains, set the document header `Status: closed-out`."*
  Also silent on surface: a novel finding anywhere blocks.
- `claude/skills/fkit-task-ship-loop/SKILL.md:160-162` — the coder's loop repeats *"until the ledger is
  **closed-out** with the last verify green"*, so the undefined bar directly controls how long the loop
  runs.

Under that reading, **any** new finding starts another round. Task `0159`
(`ai-agents/tasks/done/0159-sweep-the-stale-rank-citations-and-correct-0149s-stays-last-claim/`) showed
what that costs when the findings stop being about the deliverable.

**What `0159` actually ran** (verified against its ledger, `review.md:9`, `:15-16`, `:414-421`):

- **Five rounds, twelve findings (R1–R12)**, `Status: closed-out`, **Codex coverage full in every
  round** (`review.md:15-16`).
- The task's deliverable was a sweep of **12 files** — 11 task briefs plus `ai-agents/sprints/sprint-2.md`
  (`review.md:246`). Those **passed R1–R7 and then held through three further independent verifications**
  (`review.md:414`).
- **Every finding from R8 onward sat in `0159`'s own record** — its brief, its worklog, or the ledger's
  own bookkeeping — **not in the sweep** (`review.md:415`; sites: R8 `brief.md:300`, R9 `brief.md:171-172`,
  R10 `worklog.md:122`, R11 `worklog.md:122` + `brief.md:304`, R12 `worklog.md:223`).
- Severity of those own-record findings decayed **medium → low → low** (`review.md:416`). R8 was medium;
  R9, R10, R11 and R12 were all low.
- **R8, R10, R11 and R12 were raised by Codex, not by the reviewer's own pass.** R8 and R10 are recorded
  as Codex-only with the reviewer's miss named explicitly (`review.md:56`, `:58`); R11 and R12 are
  attributed to Codex under the ledger's own convention, which distinguishes *"Raised by Codex"* from
  *"Raised by both reviewers"* (`review.md:59-60`).

That last point is the reason this was a genuine decision and not a cleanup. **The extra rounds were not
empty ritual.** They kept finding real defects that the reviewer's own pass had missed — in a surface of
steadily decreasing consequence. The choice was never "stop finding nothing"; it was "stop paying for
finds of diminishing consequence in the record *about* the work".

**The reviewer raised the threshold question and explicitly refused to answer it**, on the grounds that it
had no authority to set it and would not set it silently (`review.md:408`). That is why it reached the
owner.

**The boundary is per-site, not per-file.** `0159/brief.md` was *both* the task's own brief *and* one of
the swept files. The close-bar verification resolved this by splitting at the **site**: the ten other
swept briefs plus the board were checked as work product, and **the one swept site inside `0159`'s own
brief** — its A2 marker — was checked as work product too, while the rest of that brief counted as own
record (`review.md:76-82`).

## Decision

**A stateful review ledger closes once the SWEPT WORK PRODUCT is clean.**

- A defect in the **work product** — the artifact the task exists to change — still **blocks**, and still
  drives another review round. Nothing about that is relaxed.
- A residual defect in the task's **own record** — its `brief.md`, its `worklog.md`, and the ledger's own
  bookkeeping — is **recorded as an accepted residual** (with What / Why / *Re-raise only if*) instead of
  driving another round.
- The split is drawn at the **site**, not the file. A file can hold both surfaces; a swept site inside the
  task's own brief is work product.

`0159` was closed under this bar at round 5, with **two own-record residuals standing** (`review.md:466-493`).

## Options considered

- **Close on the work product; record own-record residuals (chosen).** Ends the loop at the point where
  further rounds buy shrinking value, without weakening the bar on the thing the task delivers. Keeps the
  finds visible rather than dropping them — they become residuals with a re-raise condition, so the
  information survives.
- **Close only when nothing at all is outstanding (the status quo reading).** Rejected on `0159`'s
  evidence: rounds 3, 4 and 5 each cost a full two-reviewer pass — the reviewer's own plus Codex, plus a
  suite re-run — to fix low-severity wording and counting defects in a worklog. There is no natural
  stopping point, because a record that documents its own defects generates fresh surface each round.
  ⚠️ This option is not absurd — it is what caught R8 through R12, which were real. It was rejected on
  **cost per round against consequence**, not because it was finding nothing.
- **Record the bar as a step inside `fkit-sprint-ship-loop`'s SKILL** (the driver's proposal). **Rejected;
  the owner took the reviewer's side.** The reviewer's recorded reasoning is that it is a **cross-role
  decision about when review ends, not a step in one skill's procedure** (`review.md:495-499`) — it binds
  the reviewer's `fkit-stateful-review`, the coder's `fkit-process-stateful-review`, and any driver alike.
  Filing it in one skill leaves the other roles to re-derive it — **which is exactly how the question
  surfaced in the first place**: the ledger itself records that the bar "currently lives only in this
  ledger" and that "the next multi-round review will re-derive it from scratch" (`review.md:495-497`).
- **Cap the number of rounds.** Not seriously considered and rejected here for the record: a round cap is
  blind to *what* is being found. It would have stopped `0159` at the same place by accident, and would
  stop a work-product defect at the same place by accident too.

## Consequences

### Positive

- The loop terminates on a stated condition instead of on someone's patience.
- The bar is written once, in a cross-role place, so the reviewer, the coder's responder procedure and any
  driver read the same rule.
- Own-record findings are **recorded, not dropped** — with a *Re-raise only if*, so the next reviewer
  treats a matching finding as closeout rather than a new defect.
- The work-product bar is untouched and remains strict.

### Negative / costs — accepted explicitly, not hidden

- **A closing task's own worklog may carry known low-severity defects.** This is the direct, intended cost.
  `0159` is the evidence: **R8, R10, R11 and R12 were all real findings in exactly that surface**, and
  under this bar their equivalents would now be recorded rather than fixed. `0159` closed with **two
  own-record residuals standing** (`review.md:466-493`).
- **"Closed-out" now means something narrower.** The ledger states it plainly: `0159` is closed to a
  *work-product* standard, **not a record-perfect one** (`review.md:420-421`). Anyone reading a closed
  ledger as "everything about this task is clean" will be wrong.
- **Genuine finds are forgone.** Codex found four real defects past R8. Under this bar those rounds do not
  run, so their equivalents are not found at all — not merely deferred. The owner accepted this knowing
  the rounds were productive.
- **The work-product / own-record split needs judgment per site.** `0159/brief.md` was both surfaces at
  once. Misclassifying a work-product defect as own-record would close over a real blocker. The
  classification belongs to the **reviewer**, who owns the findings section.

### Binds — and what is deliberately left undone

This decision binds three places. **No skill is edited by this ADR** — each pointer below is a separate
task the owner ranks.

| Surface | Why it is bound | Suggested follow-up |
|---|---|---|
| `claude/skills/fkit-stateful-review/SKILL.md:156` | The reviewer's `closed-out` is set *"when warranted"* — this ADR defines "warranted" | Point the close step at this ADR |
| `claude/skills/fkit-process-stateful-review/SKILL.md:200-201` | The responder's close condition says *"nothing blocking remains"* without naming a surface | Same pointer; note that own-record residuals go to *Accepted residuals* |
| `claude/skills/fkit-task-ship-loop/SKILL.md:160-162` | The coder's loop repeats until the ledger is closed-out, so this bar sets the loop's termination | Same pointer |

⚠️ Until those pointers exist, this ADR is the **only** durable home for the bar and each role must reach
it here. That is the same re-derivation risk the reviewer named — reduced by moving the bar out of one
task's ledger, not eliminated.

### Residual risks / "re-raise only if"

Re-raise this decision only if one of these holds:

- A **work-product** defect is found to have been closed over because it was classified as own-record.
  That is a misapplication of this bar, not a reason to widen it — but if it happens more than once, the
  site-level split needs a sharper test.
- A task's own record becomes **load-bearing for another consumer** — e.g. a guard, a report generator, or
  a downstream task that reads a worklog's numbers as input. Then that record is somebody's work product
  and this bar no longer covers it.
- The recorded own-record residuals are observed to **mislead a later reader or a later round** — for
  instance a re-verification driven from a stale disposition row rather than from the artifacts, which is
  precisely the re-raise condition already attached to `0159`'s first residual (`review.md:482`).

Do **not** re-raise it merely because a closed ledger is found to contain a low-severity defect in its own
brief, worklog or bookkeeping. **That is this decision working as ruled, not a defect.**

## Related

- `ai-agents/tasks/done/0159-sweep-the-stale-rank-citations-and-correct-0149s-stays-last-claim/review.md`
  — the ledger this was ruled from; the bar itself at `:406-421`, the close-out residuals at `:466-493`,
  the ADR-over-skill recommendation at `:495-499`.
- `claude/skills/fkit-stateful-review/SKILL.md:156` · `claude/skills/fkit-process-stateful-review/SKILL.md:200-201`
  · `claude/skills/fkit-task-ship-loop/SKILL.md:160-162` — the three close conditions this binds.
- `claude/skills-for-role.sh:50-55` — the role→skill map showing the bar spans three roles' skills
  (reviewer, coder, lead).
- [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) — the coder loop whose
  review sub-loop this terminates.
- [ADR-032](adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md) — the sprint-scope conductor
  under which this ruling was made.
- [ADR-029](adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md) — the task-folder model that
  makes "the task's own record" (`brief.md`, `worklog.md`, `review.md`) a well-defined set of files.
- `ai-agents/knowledge-base/conventions/evidence-before-assertion.md` — the convention the own-record
  residuals are recorded under rather than being silently dropped.
