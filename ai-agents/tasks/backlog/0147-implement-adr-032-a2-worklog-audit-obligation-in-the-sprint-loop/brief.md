# Implement ADR-032 A2's worklog audit obligation in the sprint-ship-loop

## ID
0147

## Sprint
Sprint 2

## Priority
123

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

Task 0118 landed the **2026-07-22 autonomy amendment** on
[ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md).
Its **A2** block grants the sprint-loop **Process-review worker** the right to apply verified-`CORRECT`,
in-plan fixes **without per-fix owner approval** — and, in the same breath, imports ADR-019's audit
obligation as the condition on that grant:

> *"ADR-019's audit obligation transfers with its permission — it is part of 'exactly the same
> discipline.'"* … *the Process-review worker* **MUST record, in the task's worklog, each fix it applied
> without asking and each obvious-winner call it made.**

The source obligation is [ADR-019](../../../knowledge-base/decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)
`:96` — *"…obvious winner — is recorded in the task's worklog decision-log (ADR-020) so it is
auditable."*

**Nothing implements it.** The amendment says so itself, in a blockquote written deliberately so the gap
is visible rather than assumed closed. Both halves verified against the tree on **2026-07-26**:

| Site | What it says today | Gap |
|---|---|---|
| `claude/skills/fkit-sprint-ship-loop/SKILL.md:105` (the **Process review** row of the drive-sequence table) | asks the worker to *"return change surface + residuals, and return `NEEDS-DECISION` for any judgment call"* | **no worklog obligation at all** |
| `claude/agents/fkit-coder.md:73-82` (the *"As the Process-review worker"* bullet) | grants the autonomy, states the stop conditions | **imposes no worklog obligation** |

For contrast, the **Build** row (`SKILL.md:102`) already says *"write source + `plan.md`/`worklog.md`"* —
so the driver knows how to ask for a worklog; the Process-review row simply never was updated to.

**⚠️ The consequence, and the reason this is not cosmetic.** ADR-032's **A4 bullet 2** — a
do-not-re-raise guard — permits reopening A2's autonomy **only** on evidence that *"a loop-applied
post-review fix is later found wrong or out-of-plan"*, and names the mechanism explicitly:
*"(A2's worklog record is what makes that checkable)"*. **Until this task lands, that reopening
condition is unsatisfiable in practice** — the guard points at evidence that nothing requires anyone to
write. The result is a settled-tradeoff guard whose only escape hatch is closed: the autonomy is
non-reopenable not because it was proven safe, but because the proof surface does not exist.

**Owner-ruled during the 2026-07-26 sprint-loop run** that this be implemented rather than left as a
recorded gap.

## What to build

Carry the A2 requirement into the two files that actually drive the behavior. **Canonical sources under
`claude/` only** — `.claude/` holds gitignored mirrors refreshed by `claude/fkit-claude-init.sh`; never
edit a mirror.

1. **Driver side — `claude/skills/fkit-sprint-ship-loop/SKILL.md`.** Extend the **Process review** row's
   *"what the worker is asked to do"* cell so the worker is required to **record each autonomously-applied
   fix and each obvious-winner call in the task's `worklog.md`**, alongside the existing change-surface +
   residuals return. Keep the row's existing stop-condition cell intact.
2. **Worker side — `claude/agents/fkit-coder.md`.** Add the same obligation to the *"As the Process-review
   worker"* bullet, so a worker spawned by any conforming driver carries the duty in its own contract and
   does not depend on the prompt remembering to ask. Cite ADR-019 `:96` / ADR-020 as the source, the way
   the surrounding text cites its authorities.
3. **State what the record must contain** — enough to satisfy A4 bullet 2's check: for each autonomous
   write, *which finding it answers, what was changed, and why it qualified* (verified-`CORRECT` +
   mechanical/localized + in-plan, or obvious-winner-within-intent). A bare list of touched files does not
   make a wrong fix findable afterwards, which is the whole point.
4. **Do not widen the write authority.** This task adds an **obligation**, not a permission. The A1/A2
   surfaces, the declared-approval marker, and the stop conditions are settled (owner-ruled 2026-07-22)
   and **are not reopened here** — see ADR-032 A4.

## Verification steps

1. `claude/skills/fkit-sprint-ship-loop/SKILL.md`'s Process-review row requires a worklog record of
   autonomous fixes and obvious-winner calls; `grep -n "worklog" claude/skills/fkit-sprint-ship-loop/SKILL.md`
   returns a hit on that row, not only on the Build row.
2. `claude/agents/fkit-coder.md`'s Process-review-worker bullet carries the same obligation and cites
   ADR-019 `:96` / ADR-020.
3. The obligation names **what** must be recorded per fix (finding answered, change made, why it
   qualified) — not merely "log your fixes".
4. **No change** to the declared-approval marker's three signals, to A1/A2's permitted write surface, or
   to the `NEEDS-DECISION` stop conditions. A diff that touches those has exceeded this task.
5. `claude/agents/fkit-coder.md` still refuses source writes on every path without all three marker
   signals (the carve-out is not leaked — ADR-032 A4 bullet 4).
6. ADR-032's *"Stated as a requirement, not yet true of the implementation"* blockquote is now false as
   written. **Do not edit the ADR from this task** — an ADR amendment belongs to the architect; flag it
   in the hand-off instead (see Notes).

## Notes

- **Owner:** fkit-coder — implementation against a settled decision, not an architecture call.
- **Run order (owner ruling 2026-07-26): land this in ONE `fkit-coder` session with task 0150**
  (priority 124, directly below this one — *add the missing `verbatim` to `fkit-coder.md`'s
  declared-approval marker, condition (b)*). 0150 was promoted from 128 to sit beside this task **for
  that reason**: both edit `claude/agents/fkit-coder.md`, in **different clauses**, so one session means
  one read of the guarantee surface and one review pass instead of two. **This is not a dependency and
  not a merge** — the two remain separate tasks with separate verification, and this brief's
  verification step 4 still forbids *this* task's diff from touching the declared-approval marker's
  three signals. 0150's diff touches signal (b); yours must not.
- **Depends on:** nothing. 0118 (the amendment) is `✅ Done (agent-closed — not owner-verified)`; the
  requirement text it must implement is already in the ADR.
- **Blocks:** nothing formally. But note the practical effect: while this is open, ADR-032 A4 bullet 2's
  reopening condition cannot be met, so any future concern about A2's autonomy has no evidentiary route.
- **⚠️ Do not re-decide A2.** The option-(b) ruling, the carve-outs and the accepted prose-enforced cost
  are settled (owner-ruled 2026-07-22, re-affirmed by the amendment). If the implementation surfaces a
  reason to doubt them, that is an **open question for the owner**, not an edit to the ADR.
- **Follow-on flag, not this task's work:** once this lands, ADR-032's blockquote at A2 (*"Stated as a
  requirement, not yet true of the implementation"*) becomes stale. Correcting it is an **architect**
  action (a dated note, per the ADR-010 precedent in 0143), and the vault copy is **fkit-wiki**'s. Raise
  it; do not do it.
- **Dual-home caution:** `claude/agents/fkit-coder.md` and `claude/skills/…/SKILL.md` are mirrored into
  the gitignored `.claude/` tree. Edit canonical, then refresh via `claude/fkit-claude-init.sh .` if the
  live session needs the change. See 0131/0132/0133 for the standing dual-home drift work.
- No commit — leave the edits in the working tree.
