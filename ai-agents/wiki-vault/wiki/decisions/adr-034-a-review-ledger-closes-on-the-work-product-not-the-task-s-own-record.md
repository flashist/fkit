# ADR-034: A stateful review ledger closes on the work product, not on the task's own record

**Date**: 2026-07-31
**Status**: accepted

**Source**: `ai-agents/knowledge-base/decisions/adr-034-a-review-ledger-closes-on-the-work-product-not-the-task-s-own-record.md`

> **In one line:** a stateful review ledger closes once the **swept work product** is clean; a residual defect in the task's **own record** (`brief.md`, `worklog.md`, the ledger's own bookkeeping) is **recorded as an accepted residual** instead of driving another review round. **A defect in the work product still blocks — nothing about that bar is relaxed.**

> ⚠️ **This binds three roles, not one, and no skill was edited by it.** Until pointer tasks land, **this ADR is the only durable home for the bar** — the reviewer, the coder's responder procedure and any driver each have to reach it here. That is the same re-derivation risk that produced the question in the first place; moving the bar out of one task's ledger **reduces it, and does not eliminate it.**

**Scope:** the **close condition** of a stateful review ledger (`<task-folder>/review.md`). It does **not** change what a review *finds* — only when the loop **stops**.

## Context

A stateful review runs in rounds: the reviewer writes findings into the shared `review.md`, the responder verifies and dispositions each one, repeat. Both skills said to close the ledger, and **neither defined the bar in terms of what surface must be clean**:

| Where | What it said | The hole |
|---|---|---|
| `claude/skills/fkit-stateful-review/SKILL.md:156` | reviewer sets `Status: closed-out` **"when warranted"** | "warranted" undefined |
| `claude/skills/fkit-process-stateful-review/SKILL.md:200-201` | *"If all novel findings are closeout / disproven / accepted and nothing blocking remains, set … `Status: closed-out`"* | silent on surface — **a novel finding anywhere blocks** |
| `claude/skills/fkit-task-ship-loop/SKILL.md` step 7 (`:160-162`) | the coder's loop repeats *"until the ledger is **closed-out** with the last verify green"* | the undefined bar directly controls **how long the loop runs** |

Under that reading **any** new finding starts another round. Task `0159` (`ai-agents/tasks/done/0159-sweep-the-stale-rank-citations-and-correct-0149s-stays-last-claim/`) showed the cost once the findings stopped being about the deliverable:

- **Five rounds, twelve findings (R1–R12)**, `Status: closed-out`, **Codex coverage full in every round**.
- The deliverable was a sweep of **12 files** — 11 task briefs plus `ai-agents/sprints/sprint-2.md`. Those **passed R1–R7 and then held through three further independent verifications**.
- **Every finding from R8 onward sat in `0159`'s own record** — its brief, its worklog, or the ledger's own bookkeeping — **not in the sweep**.
- Severity of those own-record findings decayed **medium → low → low** (R8 medium; R9–R12 all low).
- **R8, R10, R11 and R12 were raised by Codex, not by the reviewer's own pass** — R8 and R10 recorded as Codex-only with the reviewer's miss named explicitly.

**That last point is why this was a genuine decision and not a cleanup. The extra rounds were not empty ritual** — they kept finding real defects the reviewer's own pass had missed, in a surface of steadily decreasing consequence. The choice was never "stop finding nothing"; it was *"stop paying for finds of diminishing consequence in the record **about** the work."*

**The reviewer raised the threshold question and explicitly refused to answer it**, on the grounds that it had no authority to set the bar and would not set it silently. That is why it reached the owner.

## Decision

**A stateful review ledger closes once the SWEPT WORK PRODUCT is clean.**

1. A defect in the **work product** — the artifact the task exists to change — **still blocks**, and still drives another review round. **Nothing about that is relaxed.**
2. A residual defect in the task's **own record** — its `brief.md`, its `worklog.md`, and the ledger's own bookkeeping — is **recorded as an accepted residual** (with *What* / *Why* / *Re-raise only if*) instead of driving another round.
3. **The split is drawn at the SITE, not the file.** A single file can hold both surfaces; **a swept site inside the task's own brief is work product.**

### ⚠️ Point 3 is the substance, not a footnote — read it before applying the bar

`0159/brief.md` was **both** the task's own brief **and one of the swept files**. The close-bar verification resolved that by splitting at the **site**: the ten other swept briefs plus the board were checked as work product, **and the one swept site inside `0159`'s own brief — its A2 marker — was checked as work product too**, while the rest of that brief counted as own record.

**A file-level reading of this decision closes over real defects.** That is why the site-level split sits in the Decision rather than in a note, and why the classification belongs to the **reviewer**, who owns the findings section.

`0159` was closed under this bar at round 5, **with two own-record residuals standing.**

## Options considered

- **Close on the work product; record own-record residuals — chosen.** Ends the loop where further rounds buy shrinking value, without weakening the bar on the thing the task delivers. **Keeps the finds visible rather than dropping them** — they become residuals with a re-raise condition, so the information survives.
- **Close only when nothing at all is outstanding** (the status-quo reading). Rejected on `0159`'s evidence: rounds 3, 4 and 5 each cost a full two-reviewer pass — the reviewer's own plus Codex, plus a suite re-run — to fix low-severity wording and counting defects in a worklog. **There is no natural stopping point, because a record that documents its own defects generates fresh surface each round.** ⚠️ **This option is not absurd — it is what caught R8 through R12, which were real.** It was rejected on **cost per round against consequence**, not because it was finding nothing.
- **Record the bar as a step inside `fkit-sprint-ship-loop`'s SKILL** (the driver's proposal). **Rejected; the owner took the reviewer's side.** The reviewer's recorded reasoning: this is a **cross-role decision about when review ends, not a step in one skill's procedure** — it binds the reviewer's `fkit-stateful-review`, the coder's `fkit-process-stateful-review`, and any driver alike. Filing it in one skill leaves the other roles to re-derive it — **which is exactly how the question surfaced**: the ledger itself records that the bar *"currently lives only in this ledger"* and that *"the next multi-round review will re-derive it from scratch."*
- **Cap the number of rounds.** Not seriously considered, rejected here for the record: a round cap is **blind to what is being found**. It would have stopped `0159` at the same place by accident — and would stop a **work-product** defect at the same place by accident too.

## Consequences

### Positive

- The loop terminates on a **stated condition** instead of on someone's patience.
- The bar is written once, in a cross-role place, so the reviewer, the coder's responder procedure and any driver read the same rule.
- Own-record findings are **recorded, not dropped** — with a *Re-raise only if*, so the next reviewer treats a matching finding as closeout rather than a new defect.
- **The work-product bar is untouched and remains strict.**

### ⚠️ Negative / costs — accepted explicitly by the owner, not hidden

- **A closing task's own worklog may carry known low-severity defects. This is the direct, intended cost, not a side effect.** `0159` is the evidence: **R8, R10, R11 and R12 were all real findings in exactly that surface**, and under this bar their equivalents would now be **recorded rather than fixed**. `0159` closed with **two own-record residuals standing**.
- **"Closed-out" now means something narrower.** `0159` is closed to a **work-product** standard, **not a record-perfect one**. **Anyone reading a closed ledger as "everything about this task is clean" will be wrong.**
- **Genuine finds are forgone.** Codex found real defects past the work-product bar. Under this rule those rounds **do not run**, so their equivalents are **not found at all — not merely deferred.** The owner accepted this **knowing the rounds were productive.**
- **The work-product / own-record split needs judgment per site.** `0159/brief.md` was both surfaces at once. **Misclassifying a work-product defect as own-record would close over a real blocker.**

### Binds — and what is deliberately left undone

**No skill is edited by this ADR.** Each pointer below is a **separate task the owner ranks**:

| Surface | Why it is bound | Suggested follow-up |
|---|---|---|
| `claude/skills/fkit-stateful-review/SKILL.md:156` | the reviewer's `closed-out` is set *"when warranted"* — this ADR defines "warranted" | point the close step at this ADR |
| `claude/skills/fkit-process-stateful-review/SKILL.md:200-201` | the responder's close condition says *"nothing blocking remains"* without naming a surface | same pointer; note that own-record residuals go to *Accepted residuals* |
| `claude/skills/fkit-task-ship-loop/SKILL.md:160-162` | the coder's loop repeats until the ledger is closed-out, so this bar sets the loop's **termination** | same pointer |

`claude/skills-for-role.sh:50-55` is the role→skill map showing the bar spans **three roles'** skills — reviewer, coder, lead.

### Residual risks / "re-raise only if"

Re-raise **only** if one of these holds:

- A **work-product** defect is found to have been closed over because it was classified as own-record. **That is a misapplication of this bar, not a reason to widen it** — but if it happens **more than once**, the site-level split needs a sharper test.
- A task's own record becomes **load-bearing for another consumer** — a guard, a report generator, or a downstream task reading a worklog's numbers as input. Then that record is **somebody's work product** and this bar no longer covers it.
- The recorded own-record residuals are observed to **mislead a later reader or a later round** — e.g. a re-verification driven from a stale disposition row rather than from the artifacts, which is precisely the re-raise condition attached to `0159`'s first residual.

**Do NOT re-raise it merely because a closed ledger is found to contain a low-severity defect in its own brief, worklog or bookkeeping. That is this decision working as ruled, not a defect.**

## Related

- [[systems/review-and-model-diversity]] — the review ledger and the two-model pass this sets the close condition for
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — the coder loop whose review sub-loop this terminates
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the sprint-scope conductor under which this ruling was made
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — the task-folder model that makes "the task's own record" (`brief.md`, `worklog.md`, `review.md`) a **well-defined set of files**
- Evidence: `ai-agents/tasks/done/0159-sweep-the-stale-rank-citations-and-correct-0149s-stays-last-claim/review.md` — the ledger this was ruled from (the bar at `:406-421`, the two close-out residuals at `:466-493`, the ADR-over-skill recommendation at `:495-499`). ⚠️ **`0159` has no wiki page yet** — see the standing task-page debt in `log.md`
- Convention: `ai-agents/knowledge-base/conventions/evidence-before-assertion.md` — the convention the own-record residuals are recorded under rather than being silently dropped
- [[tasks/sweep-the-stale-rank-citations]] — `0159`, the task whose ledger is this decision's entire evidentiary base
- [[tasks/decide-the-durable-citation-form-for-mutable-coordinates]] — `0160` §4.5, which states this ADR's bearing on the dead-ledger-path guard in both directions
