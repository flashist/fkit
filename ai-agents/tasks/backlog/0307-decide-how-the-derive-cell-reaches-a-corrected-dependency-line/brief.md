# Decide how a corrected dependency line reaches the dashboard's derive cell — `0046` and `0168` still print the stale text

## ID
0307

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### ⛔ What this task is, and what it is NOT

**This task DECIDES how the conflict is resolved, and returns a recommendation for the owner to rule
on.** ⛔ **It does NOT pre-pick an answer, and this brief deliberately does not prescribe one.** Two
credible options are stated below; ⛔ **a run that arrives having already chosen has failed the task.**

⚠️ **This is a real, unruled conflict between two rules the project holds today** — not an oversight
and not a bug with an obvious fix. Either answer is a good outcome **provided it is recorded as a
considered decision.** ⭐ If the answer is *"leave it, the cost is acceptable"*, that is a valid
outcome too — it just has to be written down as a ruling rather than left as an assumption.

### Provenance

**Owner ruling, 2026-08-15**, given live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop`, and relayed to a spawned producer. **The ruling is a selection from an
option list, so the option label is the verbatim text:** **"File a follow-up task (Recommended)"**.

**Parent task:** [`0306`](../../done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/brief.md)
(*Repair the three decay shapes across the open backlog briefs*), closed 2026-08-15.
**Authority for this residual:** that task folder's
[`review.md`](../../done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/review.md),
section *Accepted residuals (shared, do-not-re-litigate)*, row **R6**.

⛔ **Do not scope from `0306`'s `worklog.md` §9.** That section carries superseded figures on two of
the three residuals, and its own ledger says so. The `review.md` residuals table is the authority.

⚠️ **Unranked, no sprint** — filed by a spawned producer with no owner channel, so this row **appends**
and renumbers nothing
([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).

### The finding, re-derived on disk 2026-08-15

⚠️ **Re-derived firsthand by the filing producer, not carried on the ledger's word.** ⭐ **This matters
more than usual here:** `0306` was the task that repaired stale counts, and it reproduced the
stale-count defect three times inside its own artifacts. **Re-derive before acting.**

**Measurement context — state this, it changes the result.** Measured at `HEAD` = `9360177`
(*"Sprint push"*) **with a dirty working tree**: `0306`'s edits are uncommitted (44 modified/untracked
paths plus one staged rename). ⛔ **A reader who checks out a clean `9360177` will NOT reproduce these
figures** — the corrections that create the conflict live only in the working tree today.

**Command:**

```sh
bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-6.md | grep -E '^derive (0046|0168) '
```

**Output, verbatim:**

```
derive 0046 depends="task 36"
derive 0168 depends="0160 — hard."
```

⚠️ **The Sprint 6 board is where this reproduces, not the Backlog board.** The same grep over
`bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` returns **nothing** — both
rows sit on `sprint-6.md`. **Both boards exit `0` and neither reports drift** (`grep -c '^drift '` = 0
on the Backlog render). ⭐ **So this is not a crash, not `UNPARSEABLE`, and not a drift finding — every
row still derives. The board is confidently printing a wrong answer**, which is the harder failure to
notice.

### Why the cell is stale while the brief is correct

**Both briefs are correct on disk.** Each carries a dated correction that supersedes its dependency
line — and each correction sits in a **nested sub-bullet beneath** the declaration:

`ai-agents/tasks/done/0046-gate-symlink-escape-in-init-intake-write/brief.md`, the declaration and
the first line of its correction:

> `- **Depends on: task 36** (`remove-fkit-omnigent-orphan-residue`) — **soft, not hard.**`
> `  - ✅ **DATED CORRECTION 2026-08-15 — THE NUMERAL IS STALE *AND* THE DEPENDENCY IS DISCHARGED. The`
> `    line above is left byte-identical and is no longer binding.**`

`ai-agents/tasks/backlog/0168-remediate-the-dead-brief-paths-in-closed-review-ledger-headers/brief.md`:

> `- **Depends on 0160 — hard.** No other dependency.`
> `  - ✅ **DATED CORRECTION 2026-08-15 — THIS DEPENDENCY IS DISCHARGED. The line above is left`
> `    byte-identical and is no longer binding.**`

**The parser reads the `BI` (bold-inline) form and stops at the `**` that closes the label's bold
span.** `dashboard.sh`'s `depends_raw()` documents its grammar in its own header comment:

> `#   BI bold-inline    ‹a bolded label with its value INSIDE the same bold span, then trailing prose›  the `**` CLOSING the label's bold`

⛔⛔ **THAT QUOTE IS PARAPHRASED WHERE EVERY OTHER QUOTE IN THIS BRIEF IS VERBATIM, AND THE REASON IS
THIS TASK'S OWN SUBJECT MATTER.** `dashboard.sh`'s header illustrates the `BI` form with a **literal
bolded declaration**. When this brief first carried that example verbatim, the board derived
`derive 0307 depends="task 18"` — ⭐ **the parser matched the documentation example instead of this
brief's real `## Notes` declaration, and the row falsely announced a dependency on a task that has
nothing to do with it.** Caught by running the board immediately after filing. ⚠️ **`depends_raw()`'s
own header predicts exactly this** — *"A brief may **discuss** the field in prose or a code span … this
script's own task brief made the sentinel render `⟨derive: ` line is⟩`"* — ⭐ **so the hazard is known,
documented, and still catches a careful writer, which is itself evidence bearing on the decision this
task must make.** ⛔ **Do not restore the verbatim form.** ⚠️ **And re-run the board after any edit to
this brief.**

The function also states the contract one line above itself:

> `# Raw `Depends on:` text, single-line, for the sentinel. NEVER interpreted (spec §4.2).`

⭐ **So the correction never enters the cell by construction, not by accident.** The sub-bullet is a
separate list item outside the bold span, and the extractor is contractually forbidden to interpret
what it finds.

> ### ⭐ THIRD INSTANCE ADDED 2026-09-04 — `0172`, BY OWNER RULING H24
>
> **Owner ruling H24, given live via `AskUserQuestion` on 2026-09-04; the ruling is a selection from
> an option list, so the option label is the verbatim text: "Fold 0172 into 0307's instance list, drop
> 0372 (Rec)".** Relayed to a spawned `fkit-producer` with no owner channel.
>
> ⭐ **This task's instance list is now `0046`, `0168` and `0172` — one decision, one row, three
> instances.** A separate row (`0362`-series `0372`) was filed for `0172` on 2026-09-04 and
> **cancelled the same day** under this ruling, because a row whose own brief forbids acting before
> this one lands can only ever wait. ⛔ **This is an APPENDED instance, not a re-scoping** — nothing
> above or below this note changed, and this task's question is unchanged.
>
> **The site.** ⚠️ **Stated precisely, because the relayed summary called it *"`0309`'s site"* and that
> is not where it lives.** The declaration is in
> [`0172`](../0172-narrow-the-architect-output-format-path-line-mandate/brief.md)'s own `## Notes`
> section — its dependency-declaration bullet, which **`0309` merely surfaced and declined to
> repair**. Verified firsthand 2026-09-04.
>
> - It declares a **hard** dependency on `0171`, with the stated rationale that a pointer to a page
>   which does not exist is the defect class the arc is about.
> - ⛔ **`0171` closed 2026-08-22 and the convention page exists**, so the rationale is false and the
>   dependency is discharged — yet the board still derives the stale text for `0172`.
>
> **Why it was surfaced and not repaired — owner ruling H2, 2026-09-03**, option label verbatim
> **"Surface it, hand to producer (Rec)"**, settled as ⛔ *"**Do NOT repair the live
> dependency-declaration line.** … **Board semantics are the producer's.**"* The reason is this task's
> own subject: **editing it changes what `dashboard.sh` derives, and can flip a truthful `ready` row
> false.**
>
> ⛔⛔ **THE HAZARD THAT APPLIES TO WHOEVER RUNS THIS TASK.** `dashboard.sh` matches the bold
> dependency label **mid-line**. When an earlier draft of `0309`'s brief quoted that label literally,
> the board rendered a false derived dependency **for `0309` itself** — ⭐ the misreport class, fired
> by a brief about citation defects, inside the table listing the defect. ⛔ **This note therefore
> DESCRIBES `0172`'s bullet and never quotes its label, and no record written for this task may
> restore a verbatim quote.**
>
> **What `0172` adds to the decision.** ⭐ It is the first instance where the stale declaration is a
> **hard** dependency on a **closed** row, so the derived cell does not merely print stale prose — it
> may misstate readiness. ⚠️ **Whatever this task rules must therefore say what happens to readiness,
> not only to the rendered text.** Its evidence shape is prescribed: capture what `dashboard.sh`
> renders for `0172` **before and after**, and state whether readiness flipped and whether the flip is
> truthful.

### ⛔ The conflict — read this before proposing anything

**Two rules the project holds today point in opposite directions, and nobody has ruled between them.**

| Rule | Where it comes from | What it demands here |
|---|---|---|
| **A superseded line stays byte-identical, corrected by a dated note beside it** | The correction form `0306` applied throughout, itself modelled on `0143`'s appended-note precedent; the same principle that forbids editing a frozen record to make it accurate | ⛔ **Do not touch the `**Depends on…**` line.** |
| **The board must not print a wrong answer** | `dashboard.sh`'s own design contract — the sentinel carries the **raw** text so the skill cannot fabricate; a length cap was removed precisely because *"a dropped dependency is a fabrication"* | ⛔ **The cell must reflect the correction.** |

**Two candidate answers, stated without preference:**

- **Option A — teach the parser to read the correction.** Extend `depends_raw()` (or a layer above it)
  to pick up a dated correction sub-bullet attached to the declaration. ⚠️ **Cost:** this makes the
  extractor *interpret*, which its own contract (spec §4.2, quoted above) says it must never do, and it
  invents a second grammar for a function whose header records that *"this function has been wrong three
  times"* and is now deliberately written as **one closed grammar with one code path**. It also adds a
  new declaration form every future brief writer must know.
- **Option B — change the line form.** Let a discharged or corrected dependency be rewritten in place
  (with the original preserved some other way — a quoted history block, a separate field). ⚠️ **Cost:**
  it relaxes the byte-identical rule, and that rule is load-bearing across the correction work `0306`,
  `0143`, `0170` and `0184` all rest on. Relaxing it here invites relaxing it where it protects a frozen
  record.

⚠️ **A third answer is legitimate and must be weighed, not dismissed:** **accept the stale cell** and
close the gap by making the *board* say the brief carries a correction — e.g. a marker rather than a
rewrite. ⭐ **Do not treat A and B as the whole option space.**

### Conflicts and dependencies with open work

- ⛔ **[`0184`](../0184-record-depends-on-blocks-as-the-binding-execution-order/brief.md) forbids
  itself from editing `dashboard.sh`** (*"⛔ Do not edit `dashboard.sh`, `/fkit-status`, or any test"*)
  and is the task that documents the canonical declaration form the board can read. **Option A directly
  reopens ground `0184` was scoped to leave alone.** ⚠️ **Read `0184` before recommending A**, and say in
  the recommendation whether A changes what `0184` must write.
- **[`0171`](../../done/0171-write-the-durable-citation-anchors-convention-page/brief.md)** (closed 2026-08-22) — the
  `durable-citation-anchors` convention page. ⚠️ **Related but does not
  gate this.** `0171` governs how a *citation* anchors; this task is about how a *declaration's
  correction* reaches a derived cell. **Say explicitly in the recommendation whether the two forms need
  to agree** — if the answer is "no", say so; if "yes", that is a finding.
- **No hard dependency on anything.** Both stale cells exist today and the decision can be made now.

## What to build

⛔ **No code. No `dashboard.sh` edit. No brief edit.** This task produces a **recommendation document**
and returns open questions for the owner.

1. **Re-derive the finding firsthand** with the command above, and **state the tree state you measured
   against** (clean checkout vs. working tree). ⛔ **Do not carry this brief's figures forward
   unverified** — that is the exact defect this whole follow-up chain is about.
2. **Read the two briefs' declaration lines and their correction sub-bullets in full**, and read
   `depends_raw()` and its header grammar in `claude/skills/fkit-status/dashboard.sh`. ⚠️ Anchor on the
   quoted text, not line numbers — they will move.
3. **Establish whether the class is bigger than two rows.** ⛔ **Do not assume `0046` and `0168` are the
   whole population.** Sweep the open briefs for any declaration carrying a nested correction, and report
   the count — **including if the answer is "just these two"**.
4. **Weigh at least the three options above**, each with its cost stated against the rule it breaks.
   ⛔ **Do not present a single option as the only one.**
5. **Write the recommendation** to `ai-agents/knowledge-base/reports/` — one recommendation with its main
   tradeoff, plus the options rejected and why. ⛔ **Not to `ai-agents/wiki-vault/`.**
6. **Return the decision to the owner as an open question.** ⛔ **The choice is the owner's, not this
   task's.**

## Verification steps

1. The report exists under `ai-agents/knowledge-base/reports/` and is dated.
2. The report quotes the **actual output** of
   `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-6.md | grep -E '^derive (0046|0168) '`
   as run by the implementer, and **names the tree state it was run against**.
3. The report states the **population** of declarations-with-nested-corrections across the open briefs,
   as a number, with the command that produced it — **including a stated `2` if that is the answer**.
4. The report weighs **three or more** options, and for each names **the rule it breaks**.
5. The report states, explicitly, **whether Option A reopens `0184`'s scope**, and **whether this form
   must agree with `0171`'s citation form** — a "no" is an acceptable answer, an omission is not.
6. `git diff --stat` shows **no change** to `claude/skills/fkit-status/dashboard.sh`, to
   `ai-agents/tasks/backlog/0046-*/brief.md`, or to
   `ai-agents/tasks/backlog/0168-*/brief.md`.
7. Nothing under `ai-agents/tasks/done/0306-*/` is modified — those four files are frozen.
8. Both dashboards still exit `0`:
   `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/sprint-6.md >/dev/null; echo $?` → `0`.

## Notes

- **Depends on:** nothing.
- **Relates to:** `0184` (owns the declaration form and forbids editing `dashboard.sh`), `0171` (closed 2026-08-22; the
  citation convention page), `0308` and `0309` (the other two `0306` residuals, filed the same
  day).
  - ⚠️ **DATED CORRECTION 2026-08-21 — THE NEIGHBOUR LIST IN THE BULLET ABOVE PREDATES `0315` AND IS
    INCOMPLETE. The bullet above is left byte-identical, and everything it says still stands; this note
    adds only the neighbour it could not have named.** Verified first-hand against both briefs on disk
    2026-08-21.
    [`0315`](../0315-define-the-corrections-header-warning-equivalent-for-briefs-and-board-rows/brief.md)
    — *"Define the `Corrections:` header-warning equivalent for task briefs and sprint-board rows"* — is
    the **same collision one field over**. **Where they differ:** this task asks whether a dated
    correction reaches one *derived* board cell; `0315` asks whether a reader is *warned* a correction
    exists at all. **Where they touch:** both are the dated-correction form meeting the brief and
    board-row structure, and both are constrained by the same `dashboard.sh` parser.
  - ⚠️ **SEQUENCING RULED BY THE OWNER 2026-08-21.** Given live via `AskUserQuestion` in an `fkit lead`
    session driving `/fkit-sprint-ship-loop` — **verbatim option label: *"Sequence them, 0307 first
    (Recommended)"***. **This task (`0307`) is ruled to run FIRST**, because its parser ruling
    constrains where `0315`'s warning device can go, and not the reverse. **NEITHER TASK IS FOLDED INTO
    THE OTHER** — the ruling orders them, it does not merge them; `0315`'s own no-fold instruction
    stands. **THIS IS A SEQUENCING PREFERENCE, NOT A DEPENDENCY** — no dependency or blocking
    declaration was added to or altered in either brief, and this brief's own declarations are
    unchanged. Recorded by a **spawned** `fkit-producer` with no owner channel, relaying the ruling
    above.
- ⚠️ **Figures in this brief were re-derived at `HEAD` = `9360177` on 2026-08-15 against a DIRTY working
  tree.** They are a dated observation, not a permanent fact. **Re-derive before acting.**
- ⛔ **Frozen — do not modify:** anything under
  `ai-agents/tasks/done/0306-repair-the-three-decay-shapes-across-the-open-backlog-briefs/`.
- ⛔ **Do not commit, push, `git add` or `git stash`** unless the owner explicitly asks.
