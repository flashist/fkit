# Decide how `/fkit-sprint-ship-loop` handles a non-coder-owned task row — ADR-038 re-raise, or a defensive skip

## ID
0270

## Sprint
Sprint 6

## Priority
Sprint 6 P17

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**`/fkit-sprint-ship-loop` cannot execute a task whose `## Owner` is not `fkit-coder`, and it has no
way to notice.** Every claim below was measured on disk **2026-08-10**.

- **The loop's per-task pipeline fixes the worker role in the skill text.** Its step table
  (`claude/skills/fkit-sprint-ship-loop/SKILL.md:118-125`) spawns `@fkit-coder` for **Plan** (`:120`),
  **Build** (`:121`), **Verify** (`:122`) and **Process review** (`:124`). The Build row's role is a
  literal cell in that table.
- **The loop never reads a brief's `## Owner` field.** `grep -ni 'owner:' claude/skills/fkit-sprint-ship-loop/SKILL.md`
  returns **exactly one hit** — line 12, the skill's own `> ## ⛔ Owner: the **lead**` banner. A wider
  `grep -ni 'owner'` over the same file returns ~50 hits, and **every one** of them is about the
  *owner channel* (the human), the skill-ownership banner, or ledger ownership — **none** reads or
  compares a task's `## Owner`. Step 1's eligibility derivation (`:92-106`) orders by `## Priority`
  and dependency topology and consults the per-run skip memory; owner-role is not an input.
- **The coder may never write the vault.** `claude/agents/fkit-coder.md:211` — *"**Write to
  `ai-agents/wiki-vault/`** — ever. Wiki writes are the wiki role's exclusively."* This is
  [ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md).

**The consequence, stated as an execution fact rather than a preference.** Given a Sprint row reading
`## Owner: fkit-wiki` whose deliverable is a write under `ai-agents/wiki-vault/`, the loop drives it
to Build, spawns `@fkit-coder`, and the coder must either **refuse** (the loop stalls mid-run) or
**comply** (ADR-005 is breached). There is no third outcome. **Nothing in the loop detects the
mismatch in advance** — it is discovered at Build time, after the task has already been marked
`🔄 In progress` and the owner has already spent the loop's single approval gate on the plan.

**The same shape, less sharply, for `## Owner: fkit-architect` rows.** The loop's **only** owner gate
is plan approval, spent before Build (`SKILL.md:120`). A task whose acceptance criteria require the
owner's sign-off *during* the work has no beat left to stop at.

### ⚠️ What ADR-038 actually says — read it, do not carry this brief's paraphrase

[ADR-038](../../../knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md)'s
Decision (`:39`), verbatim:

> **A loop step's role is fixed by the skill the step runs, not by the deliverable's author.**

**Three things about that ADR bear directly on this task, and the second and third are easy to miss:**

1. It is deliberate role-fixing, adopted after a real misroute — a driver routed Process-review to the
   deliverable's *author* on three consecutive tasks (`:19-23`). Option **(b)**, granting the skill to
   a second role, was rejected in part because `skills_for_role()` is total-or-absent (`:57-63`).
2. **ADR-038's rule does not actually resolve the Build step's role.** Its own Consequences say
   (`:88-91`): *"Two current sprint-loop steps (Build and Verify) run no skill; their roles come from
   the loop's enumerated step table, not from this lookup."* So the `@fkit-coder` in the Build row is
   fixed by **the loop's table**, not by ADR-038's skill-lookup. ⚠️ Sprint 5's `## Notes` first bullet
   attributes the Build-row fixing to ADR-038 directly; that is a shortcut, and **this task must not
   repeat it.** Whether the fix belongs in ADR-038, in the loop's table, or in both is part of what
   this task decides.
3. **ADR-038 has a closeout clause and a `Re-raise only if` list, and this case is in neither.** The
   list (`:107-114`) names three triggers: per-artifact grant scoping in `skills_for_role()`; the owner
   re-ruling `0200`; or a loop step whose skill has no owning role, **or that runs no skill and whose
   loop row does not name its role**. The Build row *does* name its role, so that third trigger does
   not fire on its face. And `:116` reads: *"Anything else that re-argues (b) from deliverable
   authorship is closeout, not a new finding."* **This task argues from the task's declared
   `## Owner`, not from who authored a deliverable — a different axis.** The architect must say
   explicitly whether the closeout clause bars this re-raise, and if it does not, why not. Skipping
   that question makes any re-raise procedurally unfounded.

### The worked evidence — this was hit in practice, and the record is perishable

On **2026-08-10** the problem was hit on **Sprint 5**, on **three rows**, verified on disk:

| Task | `## Owner` | Why it cannot run in the loop |
|---|---|---|
| `0255` | `fkit-architect` | needs an owner sign-off beat *during* the work; the loop's only gate is plan approval |
| `0258` | `fkit-wiki` | deliverable is a `wiki-vault/` write — coder refusal or ADR-005 breach |
| `0269` | `fkit-wiki` | same |

The owner ruled all three out of that loop run (two rulings, both via `AskUserQuestion` in a live
session), and the exclusion is recorded on
[`sprint-5.md`](../../../sprints/done/sprint-5.md) — a `⛔` block above the `## Status` table plus the
first bullet of `## Notes`, which already records *"teaching the loop to route each step by the
brief's `## Owner` field"* as **the rejected-for-now alternative, an ADR-038 re-raise, not a quick
fix**.

**That record dies when Sprint 5 archives.** It is a per-run exclusion on one board. Every future
sprint that carries a non-coder-owned row hits the identical wall, and the next lead to hit it
rediscovers the analysis from scratch. That is why this is a brief and not a note.

**Related, and deliberately not conflated:**
[`0224`](../0224-build-the-misroute-detector-as-a-pair-denial-log-and-worklog-role-line/brief.md)
builds a misroute detector, but it detects a **driver deviating from the loop's step table**. Here the
driver follows the table exactly and the table's role is still wrong for the row — so on its face
`0224` does not cover this case. **Confirm that reading against `0224`'s brief rather than taking it
from here**; if `0224`'s design can be widened to cover it, say so, because that would change this
task's answer.

## What to build

An **ADR** in `ai-agents/knowledge-base/decisions/`, written via `/fkit-record-decision`, deciding how
`/fkit-sprint-ship-loop` handles a task row whose `## Owner` is not `fkit-coder`. **A decision, not an
implementation.**

1. **State the question precisely.** Not *"should the loop read `## Owner`"* but: *given that the
   loop's step roles are fixed by design, what should happen when the fixed role cannot perform the
   row's deliverable — and at which point in the run should that be discovered?*
2. **Discharge the ADR-038 procedural question first** (Context §3 above): does ADR-038's closeout
   clause (`:116`) bar this re-raise, or is the `## Owner` axis genuinely distinct from the
   deliverable-authorship axis it closes out? **Answer this before weighing options** — if it bars the
   re-raise, candidate 1 is off the table and the ADR says so.
3. **Weigh at least these two candidates, and find any others.** Neither is pre-favoured.
   - **Candidate 1 — re-raise ADR-038.** Reconsider whether a loop step's role should be fixed by the
     step, or derivable from the task's `## Owner`. Must answer: what happens to ADR-038's rejection
     of option (b) and its total-or-absent premise; whether a derived role reintroduces the misroute
     ADR-038 was adopted to prevent; and what a derived role means for the **Process-review** step,
     which ADR-038 fixes to the coder *precisely because* the deliverable's author is the wrong input.
   - **Candidate 2 — leave ADR-038 alone; make the loop defensive.** Step 1 explicitly reads each
     candidate row's `## Owner` and **skips** any row it cannot drive, reporting it as
     *out-of-scope-for-this-driver* rather than handing it to a role that must refuse. Must answer:
     what the skip predicate is (is it `Owner != fkit-coder`, or something narrower); whether a
     skipped row is reported and how loudly; whether the skip belongs at step 1 or earlier; and
     whether it needs an ADR at all or is a skill-text change.
   - **Any third option the architect finds** — including *"neither; the exclusion is the owner's call
     each time, as it was on Sprint 5"*. **Weigh that one seriously rather than listing it to be
     dismissed:** it is today's status quo and it worked.
4. **Say what the decision costs.** Which files a follow-on would touch, whether
   `claude/skills-for-role.sh`'s `skills_for_role()` is affected, whether
   `test/skill-ownership.test.js`-class tests or `0225`'s loop-table↔ownership test change shape, and
   whether `0223`/`0224`/`0225` are widened, narrowed or untouched. **If the decision implies ADR-038
   must be amended or superseded, say so in this ADR; do not amend ADR-038 under this task.**
5. **Get the owner's sign-off before the ADR is marked accepted**, and record how the ruling was given
   (date, channel), per the ADR precedent this repo already follows.

### ⛔ What is NOT being asked

- ⛔ **This is not a request to let the coder write `ai-agents/wiki-vault/`.** ADR-005 is **not** in
  question and is not an option to weigh. Any candidate whose effect is a coder vault write is
  rejected on sight.
- ⛔ **No implementation.** No edit to `claude/skills/fkit-sprint-ship-loop/SKILL.md`,
  `claude/skills-for-role.sh`, `claude/agents/*.md`, or any hook. The implementation brief is filed
  *after* this decision lands, and only if the decision calls for one.
- ⛔ No amendment to ADR-005 or ADR-038 under this task.
- ⛔ No `ai-agents/wiki-vault/` write (ADR-005) — the vault ingest of any resulting ADR is
  `fkit-wiki`'s, filed separately once the ADR is accepted.
- ⛔ No edit to `ai-agents/sprints/sprint-5.md` — its exclusion record is correct for that board and
  that run. This task exists because that record is perishable, not because it is wrong.
- ⛔ No commit, no re-rank, no task-file move (ADR-033).

## Verification steps

1. A new ADR exists under `ai-agents/knowledge-base/decisions/`, following the numbering and structure
   of the existing ADRs (context / decision / options considered with reasons for rejection /
   consequences).
2. The ADR quotes **ADR-038's Decision line verbatim** and cites it by file and line.
3. The ADR contains an explicit answer to the closeout question in *What to build* §2 — whether
   ADR-038 `:116` bars this re-raise — with a reason. An ADR that weighs the options without answering
   this fails the step.
4. The ADR states, in its own words, that ADR-038's rule does **not** by itself fix the Build step's
   role (ADR-038 `:88-91`), and names what does.
5. The ADR gives **each** of the candidates in §3 — the two named, plus the status-quo option — an
   explicit accept/reject with a reason. An option silently omitted fails this step.
6. The ADR cites the Sprint 5 worked evidence by task ID (`0255`, `0258`, `0269`) and by owner-ruling
   date, so the evidence survives the archival of `sprint-5.md`.
7. The ADR states explicitly whether `0223`, `0224` and `0225` are affected, and whether ADR-038 needs
   amending or superseding (without doing it here).
8. The ADR records the owner's sign-off: the ruling, its date, and the channel it came through.
9. `git status --porcelain` shows changes **only** under `ai-agents/knowledge-base/decisions/` plus
   this task's own folder — no `claude/` path, no `ai-agents/wiki-vault/` path, no
   `ai-agents/sprints/sprint-5.md`.
10. `git diff --stat -- claude/skills/fkit-sprint-ship-loop/SKILL.md` is empty (the decision-only
    boundary held).

## Notes

- **Depends on:** nothing
- **Blocks:** the (unwritten) implementation brief for whichever candidate is chosen — deliberately
  not filed, because scoping it before this decision lands would be scoping before findings.
- Related: [`0224`](../0224-build-the-misroute-detector-as-a-pair-denial-log-and-worklog-role-line/brief.md)
  (misroute detector — driver-vs-table deviation, a different failure than this one),
  [`0223`](../0223-enumerate-the-process-review-rows-method-steps-and-give-the-row-its-reason/brief.md)
  and [`0225`](../0225-add-the-loop-table-row-to-skill-ownership-test/brief.md) — the other open
  ADR-038 follow-ups. All three read `🔲 Backlog` as of 2026-08-10.
- **Provenance — owner ruling, 2026-08-10**, given via `AskUserQuestion` in a live session; a
  selection from the question's option list, so **the option label is the verbatim text**:
  **"File a brief now (Rec)"**. Option description as presented: *"One architect brief: either
  re-raise ADR-038's 'a loop step's role is fixed by the skill it runs', or make the ship-loop
  explicitly skip and report non-coder-owned rows rather than handing them to a coder that must
  refuse. Lands on the Backlog, unscheduled, doesn't touch Sprint 5. Cheap insurance against
  rediscovering this every sprint."*
- ⚠️ **Unscheduled by that ruling, and deliberately not in Sprint 5.** Pulling it into Sprint 5
  reverses the ruling. No Sprint 5 row, status or note was touched when this was filed.
- **No merit statement.** Per [`0179`](../0179-require-a-merit-statement-on-every-ranked-board-brief/brief.md),
  the requirement applies to briefs on a **ranked** board; the Backlog board is excluded by
  construction — it is unranked, so there is no rank for a merit statement to be relative to.
- Verified on disk 2026-08-10, by a spawned producer: `grep -ni 'owner:' claude/skills/fkit-sprint-ship-loop/SKILL.md`
  → **one hit, line 12** (the skill's own ownership banner); `SKILL.md:118-125` (step table, `@fkit-coder`
  on Plan/Build/Verify/Process-review), `:92-106` (step-1 eligibility, no owner-role input);
  `claude/agents/fkit-coder.md:211` (vault ban); ADR-038 `:39`, `:88-91`, `:107-116`;
  `0255`/`0258`/`0269` `## Owner` fields; `sprint-5.md` `## Status` header block and `## Notes` first
  bullet.
- Filed to the **Backlog** board — no sprint named; no re-rank, no insertion, appended as an ordinary
  row ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
