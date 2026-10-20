# Trial `/fkit-retro` on real sprint closes, then put keep / change / drop to the owner

## ID
0535

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule, own words (2026-09-27):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being filed, or on the board, is not his
> word.

**The owner's own words** (2026-10-09, quoted in
[`0500`](../../done/0500-research-and-decide-how-fkit-runs-a-sprint-retrospective/brief.md)): *"when the skill
is ready, I will test it and give you more feedback."* The 2026-10-20 rulings in `0500`'s Notes make
the trial carry more weight: ruling 3 dropped skill-text tests for v1 — *"your trial checks the
wording"* — and said *"Revisit a helper after the trial."*

**The pattern is `0474`'s:** the owner runs the real thing **as many times as he needs**; the producer
keeps the trial log; when he says he has seen enough, the producer puts the choice to him. **There is
no fixed run count, and nobody picks sprints for him.**

**A candidate first trial, decided by no one yet:** the research names **Sprint 13**, whose board reads
*"Done — 2026-10-20"* (recommendation §8 item 3). Whether to start there, or on whatever closes after
the build lands (perhaps as *every sprint since the last retro*), is the owner's call when he starts.

## What to build

This task builds nothing. It needs `0532`, `0533` and `0534` shipped.

1. **Before the first run: relaunch `fkit lead`** after `claude/fkit-claude-init.sh .` has refreshed the
   `.claude/` copies. An agent-prompt change reaches only a relaunched session (`0474`'s note on
   `0473`'s smoke test), so a stale session would trial the old lead.
2. **A trial log per retro run.** One short report,
   `ai-agents/knowledge-base/reports/<YYYY-MM-DD>-retro-trial-sprint-<N>.md`, written after that run. It
   records:
   - **The subject** (which sprint or sprints) and how the run started (the lead's offer at a verified
     close, or by hand).
   - **The offer** (`0533`): did it come only after a verified close, once, declinably? If declined,
     was nothing written?
   - **Owner time**, measured from timestamps, not estimated (mark any estimate as one); and the number
     of questions he was asked. Against the ~10-minute aim (ruling 2).
   - **Evidence pass**: how long the spawned producer took (the architect flagged large boards as the
     risk); each number with its command — any number that was wrong, any `0` that should have been
     `unknown`, any command that failed.
   - **Candidate briefs**: how many were offered (cap 3), which he picked, the task IDs filed.
   - **Follow-up** (from the second run on): did the previous retro's actions come first, read from
     disk by task ID, and was their status right?
   - **His own answer** to the closing *"was this worth your time?"* question (asked of him, not
     inferred; if not asked, say so), and any change he asked for, in his words.
   - **The feedback file** (`0534`), on a consuming-project run: were the tags right, and was the file
     safe to make public?
   - Anything that broke or confused: a denied skill, a failed spawn, a hop limit, a relay error.
3. **Be honest about the comparison.** There is no baseline other than the 2026-08-29 ad-hoc retro and
   geoconflict's 2026-10-16 retro; cite them as rough comparisons, labelled as such.
4. **Keep going until the owner says stop.** The producer does not choose sprints, start runs, or decide
   the trial is long enough.
5. **When he says he has seen enough:** one short summary across the logs, then put to him:
   - **Keep** — as built;
   - **Change** — the changes he asked for (each needs its own follow-up brief);
   - **Drop** — remove it (needs its own follow-up brief, and an ADR amendment).
   And, per ruling 3, whether a **helper script** is now worth a brief. Record his rulings in the
   summary report, with the date, channel and his selected option text or own words.

## Verification steps

1. Every trial run has a log under `ai-agents/knowledge-base/reports/`, with every field in *What to
   build* §2 filled in or marked *not measured* with the reason.
2. The summary report exists and records the owner's keep / change / drop ruling and his helper-script
   answer, with date, channel and his words. A producer recommendation does not stand in for either.
3. The trial ended on the owner's word, and the summary says so. No run count was imposed and no sprint
   was picked for him.
4. If he rules *change* or *drop*, or asks for a helper, a follow-up brief is filed for each. This task
   changes no skill or prompt itself.

## Notes
- **Depends on:** 0532, 0533, 0534
- **Blocks:** nothing
- **Related:** `0500` (research and ruling); `0531` (ADR); `0474` (the trial-log pattern this copies).
- ⛔ **Do not start without the owner's specific word.**
- **Knock-on (stated per `placement-questions-state-the-knock-on.md`):** filed on the **Backlog board**
  (owner ruling 5, 2026-10-20 — *"trial waits on build, both on Backlog"*). It waits on `0532`, `0533`
  and `0534` (all Backlog). Nothing waits on it. Nothing in Sprint 12 or Sprint 14 waits on it
  (checked 2026-10-20).
- **Why it waits on all three build briefs:** the trial covers the offer and, on a consuming-project
  run, the feedback file, not only the core skill. If the owner wants to start on the core skill alone,
  he can say so and the dependency on `0534` is relaxed then.
- **Owner choice:** `fkit-producer` — keeping the log and putting the decision to the owner is planning
  work. The owner's answers need him present.
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled`.
- Filed 2026-10-20 by a spawned `fkit-producer` on owner rulings relayed by `fkit-lead` (no owner
  channel, ADR-021). No commit.
