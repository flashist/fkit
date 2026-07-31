# Decide what the sprint driver does when a spawned worker dies — an accepted residual that has now fired twice

## ID
0167

## Sprint
Sprint 2

## Priority
145

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**Investigation and ruling, not implementation.** The deliverable shape is genuinely unknown — the third
question below is *whether the exit table needs a row at all*, and two of the four questions have no
precedent anywhere in fkit. Per `/fkit-task-brief` step 2 (*"Do not write an implementation brief for
work whose shape isn't known yet"*), **no implementation brief is filed alongside this one.** This task
names its own follow-ups.

### The gap — verified firsthand 2026-07-30, not taken on report

`claude/skills/fkit-sprint-ship-loop/SKILL.md`'s exit table (§*Stop conditions — the driver's exit
table*, `:204-214`) has **nine rows**, enumerated here in full so a later reader need not re-derive them:

`Sprint shipped` · `Sprint drained — deferred remain` · `Plan rejected` · `Blocked — verification` ·
`Blocked — review non-convergence` · `Owner decision pending` · `Dependency deadlock` ·
`Blocked — hand-off didn't land` · `No Codex, degraded`

**None of them is "the spawned worker terminated abnormally."** Every row is triggered by a worker that
*returned* — a verdict, a `NEEDS-DECISION`, a failed close. The table has no entry for a worker that
returned nothing at all. The whole 255-line file was read; the omission is not confined to the table.

### It has fired twice, in two consecutive driver runs — both times an API 529 Overloaded

1. **Previous run.** An `fkit-coder` Build worker died mid-verification on task `0118`. **Its write had
   already landed.** The driver recovered by inspecting `git diff --numstat` and then the file itself,
   confirming the edit was correctly placed, and resumed the same agent via `SendMessage` to finish the
   outstanding checks.
2. **This run, 2026-07-30.** An `fkit-wiki` worker died **twice in a row** on one targeted-ingest task.
   The first death left **one complete, coherent edit** on disk (`wiki/systems/testing-and-verification.md`,
   `+4/−0`) and two pieces unwritten. The second attempt produced nothing. Both times the driver read disk
   before acting, judged the vault **coherent rather than half-written**, and deferred the remainder.

**Both recoveries worked. Neither was procedural.** The driver improvised the same three moves each time —
inspect disk, judge coherence, choose resume-vs-re-spawn-vs-defer — and `SKILL.md` describes none of them.
That two independent improvisations converged on one shape is evidence worth testing, **not** a licence to
write it up as settled.

### The residual this reopens — and the distinction that decides whether it *is* a reopening

`0111`'s review recorded the class as an accepted residual. Quoted in full from
`ai-agents/tasks/done/0111-build-fkit-sprint-ship-loop-skill/review.md:76-79`:

> - **Crash/idle stranding of an in-flight `🔄 In progress` task (R6, owner-ruled 2026-07-22: accept)** —
>   *What:* a crash/kill mid-drive leaves the task `🔄 In progress` with no lease/recovery; *Why (structural):*
>   fkit has **no crash-recovery anywhere** — all state is working-tree + owner-driven; *Re-raise only if:*
>   stranded in-progress tasks become a recurring operational problem (then scope a lease/recovery task + ADR).

It was re-raised by Codex in round 3 and **suppressed as settled** (`review.md:92-94`).

**⚠️ Read R6 precisely before treating this task as its re-raise — they may be different failures.**
R6 is about **the driver session itself** crashing: no terminal exit runs, the task strands `🔄 In progress`,
and a fresh invocation excludes it. **This task is about a spawned worker dying while the driver survives**
— and in both recorded instances the driver was not merely alive but *demonstrably able to recover*. R6's
stated re-raise trigger (*"stranded in-progress tasks become a recurring operational problem"*) was
therefore **not** met by either instance. **Whether this is R6's re-raise, an adjacent uncovered failure,
or a case R6's rationale silently swallowed is the architect's first call** — and it determines whether the
output is a plain report or an ADR amending an owner-ruled acceptance.

### The prior art the ruling must reconcile — and the blanket claim it puts in doubt

R6 was accepted on the rationale *"fkit has **no crash-recovery anywhere**."* **That claim is broader than
what is on disk.** The sibling loop has a recovery doctrine, and the sprint loop has no equivalent of it:

- `claude/skills/fkit-task-ship-loop/SKILL.md:87-109` carries a whole section, **"Durable state — the loop
  does NOT trust its own memory"** — anchoring to git-tracked, task-id-keyed `plan.md` / `worklog.md` /
  `review.md` and **re-deriving its position on every resume** (ADR-020). Its `:108-109` fail-safe, quoted:

  > **Fail-safe on resume:** if the loop cannot establish from these files that a gate was passed, it
  > **returns to the nearest owner gate** — it never infers a plan approval it cannot evidence.

- **`fkit-sprint-ship-loop/SKILL.md` has no such section at all.** It names `worklog.md` in its Build and
  Process-review rows (`:102`, `:105`) and in §*Progress reporting* (`:226-230`), but states **no**
  re-derive-on-resume rule and **no** durable-state anchoring of its own.

This matters twice over. It means the driver-side gap is **larger than one missing table row**; and it
means fkit's existing doctrine already answers something close to question 2 below — *don't trust
memory, re-derive from durable artifacts* — which the two real recoveries independently obeyed. **Test the
shape against that doctrine and against the two instances. Do not invent a new one.**

### The honest limit, which any procedure must start from

A driver **cannot** distinguish *"the worker died before writing"* from *"the worker died after writing but
before reporting"* — **except by reading disk.** The worker's final message is exactly the artifact that
did not arrive. Disk is the only oracle, so disk inspection is not the first *recommended* step; it is the
only possible first step. Instance 1 is the proof: the write had landed and nothing in the driver's
context said so.

## What to build

**A ruling, delivered as a report to `ai-agents/knowledge-base/reports/`** — plus an **ADR** if and only if
the ruling amends R6's owner-ruled acceptance (see the distinction above). **Report-only: this task files
no briefs and edits no SKILL.** It **names its follow-ups** so the producer can scope them once the shape
is known.

Answer these four, each on the record:

1. **What must the driver do when a spawned worker terminates abnormally?** The two recoveries suggest a
   shape — *inspect disk before anything else; establish whether the partial state is **coherent** (a
   complete unit landed) or **incoherent** (a half-written file); then resume, re-spawn, or defer.*
   **Test that shape against both recorded instances rather than adopting it.** State explicitly whether it
   holds for both, and name any instance it fails to describe.
2. **May a resumed worker be trusted to report what it already did?** In instance 1 the driver re-verified
   the landed write **itself** and told the worker what it had found; in instance 2 the driver enumerated
   landed-vs-outstanding explicitly. **Neither worker was asked to self-report its own progress.** Rule
   whether that is the **rule** or an **accident** — and reconcile the answer with
   `fkit-task-ship-loop/SKILL.md:87-109`, which already says a loop does not trust its own memory across a
   resume. If the rule generalizes, say so in terms that also cover a worker resumed by `SendMessage`.
3. **Does the exit table need a row, and what status does a tracked task carry when a worker dies and the
   driver defers the remainder?** In instance 2 nothing was left `🔄 In progress` **only because the work
   was not a tracked task**. A tracked task in the same position **would** be — with no rule about it, and
   with §2's *"Mark the task `🔄 In progress` first"* (`:95-97`) having already set it. Any answer must use
   the canonical six-value vocabulary
   (`ai-agents/knowledge-base/conventions/task-status-vocabulary.md`) — **do not mint a value.** Note that
   `:216-217`'s invariant *"no path ends in silence"* already binds every exit to write both locations, so
   an uncovered exit is a live breach of a stated invariant, not merely an undocumented case.
4. **Whether the fix is one table row or the missing durable-state section.** Given that the sprint loop
   lacks the sibling's entire resume doctrine, rule whether a row suffices or whether the driver needs the
   anchoring section too — and if the latter, whether it is this task's follow-up or belongs with a
   broader ADR.

### ⛔ Explicitly out of scope — a retry policy

**Do not scope, recommend, or imply one.** Two consecutive 529s on one worker indicate an **overloaded
API**, not an unworkable task; how many times to retry is an operational judgment **the owner made live on
both occasions**. Generalizing a retry count from two samples would be over-fitting, and this exclusion is
stated here rather than silently omitted so a later reader does not read the gap as an oversight. If the
ruling concludes a retry rule is unavoidable, **say so and stop** — name it as a follow-up for the owner,
do not write the number.

## Verification steps

1. The report exists under `ai-agents/knowledge-base/reports/` and answers **all four** numbered questions,
   each with an explicit answer rather than a discussion.
2. **Question 1's shape is tested, not assumed:** the report states, per instance, whether the
   inspect→coherence→resume/re-spawn/defer shape describes what actually happened, and names any part of
   either instance it fails to describe.
3. The report states which of the three readings of R6 it adopts — re-raise / adjacent failure / swallowed
   by R6's rationale — **and** whether an ADR is therefore required. If an ADR is required, it exists in
   `ai-agents/knowledge-base/decisions/` and cites R6 by its `0111` review coordinates.
4. The report adjudicates the *"fkit has no crash-recovery anywhere"* claim against
   `fkit-task-ship-loop/SKILL.md:87-109` **by quotation**, and says whether the claim stands as written.
5. Question 3's answer names a status value that appears in
   `ai-agents/knowledge-base/conventions/task-status-vocabulary.md`. Confirm by reading that file — a value
   not in it fails this step.
6. **No retry count, retry limit, or backoff rule appears anywhere in the output.** Confirm by reading the
   report.
7. **No brief is filed and no `claude/skills/` file is edited by this task.** Confirm with `git status`.
8. Follow-ups are named explicitly (title + one-line scope each), so the producer can scope them without
   re-deriving the ruling.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing yet — its follow-ups are named by the ruling itself, not pre-declared.
- **Priority `145` was appended after the existing highest (`P144`, task `0166`) per `/fkit-task-brief`
  step 5. Nothing was renumbered or inserted. ⚠️ Flagged for owner confirmation.**
  *(as filed. **✅ Resolved — the owner confirmed the appended rank on 2026-07-30**, via
  `AskUserQuestion` at the start of the 2026-07-30/31 `/fkit-sprint-ship-loop` run. The rank is
  **owner-confirmed**, no longer merely appended; the row did not move and nothing was renumbered, so
  the merit alternative stated below — a rank above the tail — was **not** taken. The flag no longer
  reads unresolved. ⚠️ **Recorded here and on the board only on 2026-07-31, a day after the ruling** —
  the driver never routed the confirmation to a producer on the day it was given, so both records
  asserted an unresolved flag for a day after the owner had in fact ruled. The delay is a record-keeping
  defect, not a second ruling.)* Merit for the rank, so
  the owner can move it deliberately: the gap has fired **twice in two consecutive runs** and both times
  cost live owner attention, which argues for a higher rank than a tail append; against that, both
  recoveries **succeeded**, no work was lost, and the class was **already owner-ruled as an accepted
  residual** in 2026-07-22 — so nothing here is on fire. Appended per the rule; **the rank is the owner's
  to change.**
- **Adjacent but distinct — do not merge with `0134`.** `0134` (Backlog board, unscheduled) decides the
  sanctioned repair path for a **half-landed close**: a producer that ran and left inconsistent state,
  where the constraint is that `/fkit-task-done` refuses an already-moved folder. This task is about a
  worker that **did not return at all**, where the constraint is that the driver has no report to read.
  Same neighbourhood — a driver facing partial state — different failure and different remedy. The
  architect should read `0134` before ruling, and say whether the two rulings should share a doctrine.
- **This brief cites line numbers, which decay.** Every citation above is paired with quoted text or a
  named section heading so a shifted line is recoverable by search. Task `0160` (P141) is deciding the
  durable citation form for exactly this class; if it lands first, conform to whatever it rules.
- **Evidence base for this brief, all read firsthand 2026-07-30:**
  `claude/skills/fkit-sprint-ship-loop/SKILL.md` (whole file, 255 lines),
  `ai-agents/tasks/done/0111-build-fkit-sprint-ship-loop-skill/review.md`,
  `.../worklog.md`, `claude/skills/fkit-task-ship-loop/SKILL.md:86-115`, and a wiki sweep that surfaced
  `ai-agents/wiki-vault/wiki/tasks/build-fkit-sprint-ship-loop-skill.md:51`, which records R6 with the same
  re-raise condition. **The two 529 instances are the driver's live testimony, not on-disk records** — the
  `0118` recovery and the `2026-07-30` wiki-worker deaths were reported by the session that performed them.
  Instance 2's landed edit (`wiki/systems/testing-and-verification.md`, `+4/−0`) is checkable on disk;
  **instance 1's account is not independently verifiable from this brief's evidence** and should be
  confirmed against `0118`'s folder before being relied on as the ruling's second data point.
- **⚠️ Use `/usr/bin/grep`, not bare `grep`, when verifying any claim here.** In this environment `grep` is
  a shell function that honours `.gitignore` and silently omits paths — measured at **96 files vs 119** on
  one recursive query. Recorded at `ai-agents/wiki-vault/wiki/systems/testing-and-verification.md`. Never
  report an unqualified "zero hits". (Note `/usr/bin/ls` does **not** exist on this macOS host; `/bin/ls`
  does.)
</content>
</invoke>
