# Settle by ADR who runs Process-review on an architect-owned task — grant the skill, or route the response to a coder

## ID
0362

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### ⭐ AUTHORITY — THE OWNER RULED AN ADR, AND NAMED THE TWO WAYS IT MAY GO

**Owner ruling, 2026-08-30, given live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop`. The option label is the verbatim text: "File an ADR to settle it (Rec)".**

It was put to the owner as: *an ADR decides one of two ways — the architect gains the skill for
architect-owned investigation tasks, or such tasks route their review response to a coder. Either way
it stops being decided ad hoc by whoever hits it.*

Relayed and filed by a spawned `fkit-producer` with **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)),
which asked nothing and decided nothing beyond the mechanics of the filing.

⛔ **This brief does not pre-decide the ADR.** Both named options are recorded below with what each
costs, and with the evidence that stands on each side. The ADR rules; this brief does not.

### The incident that forced it — task `0353`, 2026-08-30

Reported to this filing by the lead; **taken on report, not measured here** (`0353`'s folder was under
concurrent write by another agent at filing time and was deliberately not opened — see `## Notes`):

- `0353` is a Sprint 7 `P3` row whose brief reads `## Owner: fkit-architect`.
- Per **ADR-044 §Decision 1**, the Build/Plan role follows the deliverable's producing skill, so the
  row was built by a spawned **architect**.
- That architect then reached the loop's **Process-review** step and was **denied by the ADR-018
  `PreToolUse` skill-ownership hook**, verbatim: `role 'architect' does not own skill
  'fkit-process-stateful-review'`.
- It applied the method **by hand**, both rounds, and refused to treat the driver's spawn instruction
  as authorization — **correctly**, since no owner ruling named that point (CLAUDE.md's conflict rule /
  [ADR-037](../../../knowledge-base/decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md) §3).
- ⚠️ **Round 1's ledger nonetheless claimed it ran the skill.** A dated correction to that record was
  being appended by a concurrent architect spawn at the moment this brief was filed.

### ⛔ MEASURED ON DISK 2026-08-30 — THE RECORD ALREADY ANSWERS THIS ONE WAY, AND THAT IS EVIDENCE, NOT A DECISION

Everything in this sub-section was read first-hand at filing. **It is handed to the ADR as evidence to
weigh, not as the ADR's conclusion** — the owner ruled that an ADR settles it, and the ADR may still
rule either way.

1. **`skills_for_role()` — `claude/skills-for-role.sh`, the sole declaration of role→skill ownership.**
   `fkit-process-stateful-review` appears on the `coder)` line and on **no other role's line**. The
   `architect)` line carries `fkit-survey-project fkit-inspect fkit-design-spec fkit-evaluate-approach
   fkit-record-decision` — the skill is **not** among them. The hook denial reported above is therefore
   the declared behaviour, not a bug.
2. **The ship-loop's own step table already fixes the step to the coder.** The Process-review row of
   `claude/skills/fkit-sprint-ship-loop/SKILL.md`'s step-2 table reads, verbatim:
   > `@fkit-coder` — **always, whoever authored the deliverable under review**

   with its reason enumerated in the same cell: *"a loop step's role is fixed by **the skill the step
   runs**, and this one writes the ledger's **coder-owned *Coder response*** section and **applies code
   fixes at its Step 6**. Neither changes when the deliverable is a document rather than code."*
3. **ADR-038 §Decision** rules it in general terms: *"A loop step's role is fixed by the skill the step
   runs, not by the deliverable's author."* Its §Decision names Process-review explicitly as *"always
   `@fkit-coder`, whoever wrote the deliverable under review."*
4. **ADR-038 already weighed and rejected option (a) of this brief, as its own option (b)** — *"Grant
   `fkit-process-stateful-review` to the architect in `skills_for_role()` — rejected."* Its three
   recorded reasons: the skill's Step 6 applies code fixes, which a design-only role must never do; the
   grant is **total-or-absent** because `skills_for_role()` has no per-artifact scoping, so *"there is
   no way to grant the skill 'for documents only'"*; and the premise generalizes to the four of seven
   roles that author deliverables.
5. **ADR-044 §Decision 3** — which is the ADR that staffs Build by the deliverable's skill — says in the
   same breath: *"Verify stays coder. Review stays reviewer. **Process-review stays coder.** Close stays
   producer."* So ADR-044 did **not** leave this open; it re-affirmed it while creating the split that
   made it bite.
6. ⚠️ **ADR-038 carries a *"Re-raise only if"* clause, and one of its bullets is satisfied.** The
   clause's closing line reads: *"Anything else that re-argues (b) from deliverable authorship is
   **closeout**, not a new finding."* Its listed re-raise triggers are: `skills_for_role()` gains
   per-artifact grant scoping; **the owner re-rules on `0200`**; or a loop step exists whose role the
   rule cannot resolve. ⭐ **The 2026-08-30 ruling above IS an owner re-rule on `0200`'s question, so
   this ADR is lawful and is not closeout.** ⛔ But the ADR **must** open by saying so in those terms —
   a re-raise that does not name the clause it satisfies reads as re-litigation to the next reader.

### ⭐ WHY IT IS WORTH DOING AT ALL — IT RECURS, AND IT FAILS QUIETLY

- **It recurs on every architect-owned task that gets reviewed.** The ADR-044 split is now standing
  rule, so architect-built rows are normal, not exceptional. Every one of them reaches a review step
  whose role the loop fixes elsewhere.
- **The failure mode is near-silent.** The worker either escalates (the good outcome, which costs a
  round-trip and a `NEEDS-DECISION`), or it hand-runs the method and **mis-attributes it in the
  ledger** — which is what happened on `0353` round 1, and was caught only because a second pass looked.
- The existing detector for this class is **`0224`** (the denial log + the mandatory worklog `**Role:**`
  line) and it is still `🔲 Backlog` on this board — so nothing mechanical catches the mis-attribution
  today. `0224`'s brief carries `⛔ skills_for_role() untouched (option (b) rejected)`, which **this
  ADR may falsify if it rules option (a)**; see `## Notes`.

## What to build

**One ADR** under `ai-agents/knowledge-base/decisions/`, written with `/fkit-record-decision`
(architect-owned), settling: **who performs the Process-review step when the task's Build was staffed
to a non-coder role under ADR-044 §Decision 1.**

The ADR must weigh **both** named options as real alternatives, each with its cost:

- **(a) The architect gains `fkit-process-stateful-review` for architect-owned tasks.**
  - *For:* keeps the deliverable's author in their own context — the person who wrote the ADR or design
    spec is the one answering findings about it, with no re-reading cost and no lost reasoning.
  - *Against, on the record:* ADR-038 rejected exactly this and stated why (§Options considered, option
    (b)) — Step 6 of the skill applies code fixes; `skills_for_role()` grants are total-or-absent so
    *"for documents only"* is not expressible today; and the premise generalizes to four roles.
  - ⛔ **If (a) is chosen, the ADR must say how the total-or-absent problem is solved** — a scoping
    mechanism that does not exist yet, or an accepted widening of what an architect may write. Choosing
    (a) without answering it re-opens ADR-038's rejection without displacing its reason.
- **(b) Such tasks route their review response to a coder, regardless of who built them.**
  - *For, on the record:* this is what ADR-038 §Decision already says, what ADR-044 §Decision 3
    re-affirms, what the loop's step table already prints verbatim, and what the ADR-018 hook already
    enforces. It also matches the reviewer-independence thesis — the author is not the one dispositioning
    findings about their own work.
  - *Against:* a coder answering findings on an architecture document is reading a deliverable it did not
    write, in a domain it does not own; the context cost is real and is the thing (a) exists to avoid.
  - ⛔ **If (b) is chosen, the ADR is a confirmation, and must say what actually failed instead** — on the
    measured record the `0353` incident is then a **driver misroute** (the loop spawned the architect for
    a step its own table fixes to the coder), not an undecided question. The ADR must then name what
    changes so the misroute stops recurring, rather than closing with "the rule already said so".

**Both branches must also settle the residual the incident exposes:** what a spawned worker does when it
is *told* to run a step its role cannot invoke. `0353`'s architect escalated-by-hand and mis-attributed;
ADR-037 §3 says a skill rule binds unless the instruction relays an owner ruling. The ADR should state
plainly whether the correct act is `NEEDS-DECISION` and stop, or hand-application with a mandatory
role-attribution line — and if the latter, note that `0224` is the task that builds the line.

⛔ **Out of scope for this task:** editing `skills_for_role()`, `claude/skills/fkit-sprint-ship-loop/SKILL.md`,
`claude/skills/fkit-process-stateful-review/SKILL.md` (ADR-032: byte-unchanged), any test, any board
status, `0224`, `0225`, or ADR-038/ADR-044 themselves. **This task writes the ADR and nothing else.**
Whatever the ADR rules, its implementation is a separate row filed against the ruling.

## Verification steps

1. The ADR exists under `ai-agents/knowledge-base/decisions/` with a number allocated by
   `/fkit-record-decision`'s own four-way sweep (filenames, `reports/`, `sprints/`, `wiki-vault/`
   read-only) — ⛔ **do not pre-allocate a number in this brief or anywhere else**; ADR-029's precedent
   is that a number can be claimed everywhere except `decisions/`.
2. Its `## Decision` names one of (a) or (b) and quotes the owner's ruling label verbatim.
3. **It opens by naming ADR-038's *"Re-raise only if"* bullet it satisfies** (*"the owner re-rules on
   `0200`"*), so it does not read as closeout.
4. Its `## Options considered` records **both** options with the costs above, and — if it rules (a) —
   states how ADR-038's total-or-absent objection is answered.
5. It states, explicitly, whether ADR-038 and ADR-044 §Decision 3 are **amended, superseded, or left
   untouched**. ⛔ Silence on this is a defect: ADR-044 set the precedent of saying so in its own header
   (*"not amended, not superseded"*).
6. It states what happens to `0224`'s standing `⛔ skills_for_role() untouched (option (b) rejected)`
   clause under the ruling — falsified, or still true.
7. It names the follow-up work the ruling implies, as work to be **filed**, and does not perform it.
8. ⛔ No commit, no push. ⛔ No edit to any file outside `ai-agents/knowledge-base/decisions/` and this
   task's own folder.

## Notes

- **Owner is `fkit-architect`** — an ADR is architecture work, and `/fkit-record-decision` is
  architect-owned in `skills_for_role()`
  ([`task-owner-vocabulary`](../../../knowledge-base/conventions/task-owner-vocabulary.md): *"the role
  accountable for the task's delivery"*). ⭐ **Per ADR-044 §Decision 1 the Build role here is the
  architect too** — the deliverable is produced by an architect-owned skill. ⚠️ **And per ADR-038 plus
  ADR-044 §Decision 3 as they stand today, this task's own Process-review step is the coder's** — i.e.
  **this task will walk straight into the situation it exists to settle.** Whoever drives it should
  expect that and route the review response to a coder under the rule in force, not improvise.
- ⛔ **`0353`'s folder was NOT opened at filing time.** A concurrent architect spawn was appending a
  dated correction to its round-1 ledger. Every `0353` fact in `## Context` is **taken on the lead's
  report**; everything in the *"MEASURED ON DISK"* sub-section was read first-hand. Whoever picks this
  up should re-read `0353`'s corrected ledger as primary evidence.
- ⚠️ **Adjacent open row, not a dependency:** this board already carries *"Carry ADR-044's Build/Plan
  role rule and vault-row skip into `/fkit-sprint-ship-loop` and the agent text"*. That row edits the
  loop's prose to match ADR-044; this task decides a question ADR-044 left biting. If this ADR rules (a),
  that row's target text changes — **flagged for whoever schedules them together.** No hard dependency
  either way.
- ⚠️ **`0224` (misroute detector) and `0225` (loop-table row↔ownership test)** are both still
  `🔲 Backlog`. `0225` asserts every loop row's role owns the skill that row names — **under ruling (a)
  that assertion still passes; under (b) it also passes.** But `0224`'s brief carries an explicit
  `⛔ skills_for_role() untouched (option (b) rejected)` clause that ruling (a) would falsify. ⛔ **Do not
  edit `0224` from this task** — the ADR names it as follow-up work; a separate row does the edit.
- ⚠️ **Citations here are name-anchored, not `path:NNN`**, on purpose
  ([`durable-citation-anchors`](../../../knowledge-base/conventions/durable-citation-anchors.md)) — skill
  and ADR sites are quoted by heading plus fragment, because `0237` and `0176` are currently cleaning and
  then guarding coordination-citation form.
- **Priority is `—` / `Unscheduled` by construction.** This board was declared an **archive of known
  issues, not a ranked queue** by owner ruling 2026-08-29 (*"Rank Sprint 7; declare backlog an archive
  (Rec)"*), so ⛔ nothing here is ranked and no merit statement is owed
  (the unranked-board exclusion). ⛔ **It is NOT on Sprint 7** — Sprint 7's banner rules that a row
  arrives there only by an owner ruling naming it, and the 2026-08-30 ruling names an **ADR**, not a
  Sprint 7 row. **Pulling this into a sprint needs a separate ruling.**
