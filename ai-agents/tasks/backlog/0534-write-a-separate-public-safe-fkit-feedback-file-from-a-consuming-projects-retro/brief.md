# Write a separate, public-safe fkit-feedback file from a consuming project's retro

## ID
0534

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule, own words (2026-09-27):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being filed, or on the board, is not his
> word.

**Where this comes from.** Owner ruling 4, 2026-10-20 (`AskUserQuestion`, `fkit lead` session), quoted
verbatim in
[`0500`](../../done/0500-research-and-decide-how-fkit-runs-a-sprint-retrospective/brief.md)'s Notes: selected
**"Separate fkit file (Recommended)"**, described as *"Retro tags findings; only the fkit part goes in
its own public-safe file you carry over. fkit files briefs from it as usual."* The design is in the ADR
from [`0531`](../0531-record-the-adr-for-how-fkit-runs-a-sprint-retro/brief.md) and in the architect's
report
[`2026-10-20-eval-sprint-retro-evidence-home-and-role-fit.md`](../../../knowledge-base/reports/2026-10-20-eval-sprint-retro-evidence-home-and-role-fit.md)
§7.

**Why.** Geoconflict's Sprint 8 retro (2026-10-16) was written for the fkit team, sat in geoconflict's
own reports folder, and reached fkit only because the owner pointed a `fkit lead` session at it (`0500`
2026-10-16 note). The fkit repo is public (architect report §7, inferred from `install.sh`), so
whatever crosses into it must be safe to publish — and the project's full retro should not travel.

## What to build

An addition to `claude/skills/fkit-retro/SKILL.md` (`0532`):

1. **Tagging.** In a consuming project, the retro tags each finding *for this project* or *for fkit*.
   The **owner confirms the tags** in the interview — which pain is fkit's is his call.
2. **The separate file.** When the owner picks **at least one** fkit item, the skill also writes
   `YYYY-MM-DD-retro-sprint-<N>-fkit-feedback.md` in the consuming project's own
   `ai-agents/knowledge-base/reports/`. It holds **only** the fkit items, each with its evidence
   (measured with method, judgement, or `unknown` — the same rule as the retro). It is written to be
   **safe to make public**: no secrets, and no project-confidential detail beyond what the fkit point
   needs. The project's retro report names the feedback file; the feedback file stands alone.
3. **No fkit items picked → no file.** This depends on content, not on an argument, so it is not an
   output variant under `conventions/one-skill-one-output.md` (architect report §7).
4. **In the fkit repo itself the split collapses** — the project *is* fkit — so no tagging and no
   separate file. The plan states how the skill tells it is running in the fkit repo, and asks the
   owner if that is not obvious.
5. **Hand-off by hand.** The skill tells the owner the file's path and that he carries it to a
   `fkit lead` session in the fkit repo. **No automatic cross-repo write and no auto-filed issue.**
6. **The fkit side is the existing path** (ruling 4: *"fkit files briefs from it as usual"*): the lead
   puts the items to the owner, and a spawned producer copies the file verbatim as `source-report.md`
   into each filed task's folder (the `0506` intake pattern) and runs `/fkit-task-brief` on his picks.
   The skill text may point to that path; nothing on the fkit side is built here.

**Out of scope:** the core skill (`0532`); the lead's offer (`0533`); any automatic transport; any test
or helper script (ruling 3); any wiki write.

## Verification steps

1. `grep` on `claude/skills/fkit-retro/SKILL.md` shows: the two tags; the owner confirms the tags; the
   file name pattern `-fkit-feedback.md`; written only when at least one fkit item is picked; only fkit
   items, each with its evidence; public-safe (no secrets, no project-confidential detail); no file in
   the fkit repo itself; carried by hand, no automatic cross-repo write, no issue; the fkit-side intake
   as `source-report.md`.
2. The plan names how the skill knows it is in the fkit repo, and the worklog records the owner's
   answer if he was asked.
3. No new test file, no new prove-red case, no helper script (`git status --porcelain test/` shows
   nothing from this task).
4. A real consuming-project run is part of `0535`'s trial, not this task.

## Notes
- **Depends on:** 0532
- **Blocks:** 0535
- **Related:** `0500` (2026-10-16 note on geoconflict's retro; ruling 4); `0522`–`0524` and `0383`
  (the worked example of geoconflict's feedback becoming fkit briefs); `0506` (the `source-report.md`
  intake pattern).
- ⛔ **Do not start without the owner's specific word.**
- **Knock-on (stated per `placement-questions-state-the-knock-on.md`):** filed on the **Backlog board**
  (owner ruling 5, 2026-10-20). It waits on `0532` (Backlog). `0535` waits on it, on the Backlog board.
  Nothing in Sprint 12 or Sprint 14 waits on it (checked 2026-10-20).
- **Why its own brief:** the core retro works without it (in the fkit repo the split does not apply),
  and it can be built and checked on its own once the skill exists.
- **Owner choice:** `fkit-coder` — skill text is build work.
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled`.
- Filed 2026-10-20 by a spawned `fkit-producer` on owner rulings relayed by `fkit-lead` (no owner
  channel, ADR-021). No commit.
