# Record the ADR for how fkit runs a sprint retro

## ID
0531

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule, own words (2026-09-27):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being filed, or on the board, is not his
> word.

**Where this comes from.** Task
[`0500`](../../done/0500-research-and-decide-how-fkit-runs-a-sprint-retrospective/brief.md) researched how fkit
should run a sprint retrospective (a "retro") and how the lead should suggest one. The owner ruled on
2026-10-20 (`AskUserQuestion`, `fkit lead` session). **The rulings are quoted verbatim in `0500`'s
Notes, section *"⏱ 2026-10-20 — the owner's ruling on the research"* — read them there; do not
re-quote them from memory.** The research:
- [`2026-10-20-recommendation-sprint-retro.md`](../../../knowledge-base/reports/2026-10-20-recommendation-sprint-retro.md)
  (combined producer / architect / coder report, §9 recommendation);
- [`2026-10-20-eval-sprint-retro-evidence-home-and-role-fit.md`](../../../knowledge-base/reports/2026-10-20-eval-sprint-retro-evidence-home-and-role-fit.md)
  (architect's angle; its §8 lists what the ADR must hold).

**Why an ADR first.** A new skill, a new unprompted lead behaviour at sprint close, a new report kind
and a cross-repo hand-off are a direction change, not wording (architect report §8). The build briefs
`0532`–`0534` implement this ADR, so it comes first.

**In short, the rulings it records:** the **lead** owns the retro (ruling 1); **one form**, about 10
minutes of owner time, whose subject is the sprint just closed or every sprint since the last retro
(ruling 2); **no skill-text tests and no helper script** in v1 (ruling 3); a **separate, public-safe
fkit-feedback file** from a consuming project's retro (ruling 4). Plus the points the research agreed
on and the owner did not challenge (listed in `0500`'s note as *agreed by the research, not separately
asked*).

## What to build

Record **one** ADR with `/fkit-record-decision`, in `ai-agents/knowledge-base/decisions/` (next free
number). Status per the skill's own rules; the owner's 2026-10-20 rulings are its authority, cited
from `0500`'s Notes with date and channel. It records, at minimum:

1. **The owning role and the ADR-021 consequence.** The lead owns `/fkit-retro`, **session-only**
   (`AskUserQuestion` exists only in a session — ADR-021). How the work splits so the lead stays a
   conductor under its own *"never diagnose"* rule (`claude/agents/fkit-lead.md`): a **spawned producer
   measures the evidence** and writes the measured half of the report; **the lead interviews the
   owner**; a **spawned producer records his picks verbatim** (date, channel) and files the picked
   briefs with `/fkit-task-brief`. The cost the owner accepted: a deeper "why?" costs another spawn.
   Option A (producer owns it, owner switches session) and Option C (both own it) as the options not
   chosen, with reasons (architect report §5).
2. **The lead's sprint-close offer, as a dated amendment to ADR-031's lead remit**
   ([ADR-031](../../../knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)):
   offered **once**, only after the lead has **verified** that a `/fkit-sprint-done` or
   `/fkit-sprint-cancelled` close landed; **declinable**; **never** at the ship-loop's *"Sprint
   shipped"* state (that state means every eligible task closed, not the sprint closed); never run
   automatically; a decline writes nothing. State honestly that this is **prose-enforced only** —
   nothing checks that the lead offered or did not force it. Amend ADR-031 by a dated note that points
   to the new ADR; leave its original text as written.
3. **The output home.** One dated report,
   `ai-agents/knowledge-base/reports/YYYY-MM-DD-retro-sprint-<N>.md` (date = the day the retro ran),
   linking one way to the closed board. **Nothing written beside the board, and no edit to the closed
   board** — with the reason: `dashboard.sh` reads the first line of every `*.md` beside a board to
   catch two boards claiming one sprint, so a `# Sprint N — retro` file there reads as a second board
   (architect report §3). No wiki write (ADR-005). Past retros are never edited in place; the next one
   is a new report that cites the last.
4. **One form** (ruling 2), and why it is consistent with `conventions/one-skill-one-output.md`: the
   span of sprints is the skill's **subject** (what it works on), not an output shape.
5. **Action items.** At most **3** owner-picked candidate briefs per retro (change-a-brief, cancel-one
   and no-action count as actions); placement with its knock-on stated
   (`conventions/placement-questions-state-the-knock-on.md`); filed only by a producer; recorded in the
   retro report **by task ID**; the **previous retro's actions are followed up first**, read from disk
   by those IDs.
6. **The cross-repo hand-off** (ruling 4). In a consuming project the retro tags each finding *for this
   project* or *for fkit*; the owner confirms the tags; only the fkit items go into a separate,
   public-safe `YYYY-MM-DD-retro-sprint-<N>-fkit-feedback.md` in that project's own reports folder,
   which the owner carries to fkit by hand. No automatic cross-repo write; no auto-filed issue. On the
   fkit side, the usual path files it (a spawned producer copies it verbatim as `source-report.md`, the
   `0506` intake pattern, and files the owner's picks). In the fkit repo itself the split collapses and
   no separate file is written.
7. **The measured-or-judgement rule.** Every retro claim is **measured** (with its method — the command
   that produced the number), a **judgement** (marked as such), or **unknown**. Absent data reads
   `unknown`, **never 0** — including ADR-053 owner-involvement data until it exists. Owner session
   transcripts are **not** evidence (private, per machine, may hold secrets).
8. **Testing for v1** (ruling 3): no tests on skill text and no helper script; the only test change is
   the existing role→skill mirror in `test/skill-ownership-hook.test.js` (within ADR-057's key list,
   D2.3). The helper question is revisited after the trial (`0535`).
9. **Re-raise only if** (architect report §8): spawned subagents gain `AskUserQuestion` (re-opens
   ADR-021); ADR-052's built-in board replaces the markdown boards; ADR-053 is accepted; or the trial
   (`0535`) rules *change* or *drop*.

**Out of scope:** writing the skill or any prompt (`0532`–`0534`); saving the ship-loop's sprint
roll-up to disk (the architect's Q4 candidate — not filed, the owner's to raise); any wiki write.

## Verification steps

1. One new ADR exists under `ai-agents/knowledge-base/decisions/`, written via `/fkit-record-decision`,
   and `grep` shows it covers all nine items in *What to build*.
2. It cites `0500`'s 2026-10-20 Notes section as its authority (date and channel), and quotes no owner
   wording that is not in that section. The points *agreed by the research* are not presented as owner
   rulings.
3. ADR-031 carries a dated amendment note pointing to the new ADR; `git diff` of ADR-031 shows only
   added lines.
4. Options not chosen (owning role A and C; two forms; helper script in v1; one report with an fkit
   section; no tagging) are each named with the reason.
5. No file under `claude/`, `.claude/`, `test/`, `ai-agents/wiki-vault/` or `CLAUDE.md` is changed by
   this task (`git diff --stat` on those paths, against a snapshot taken at start).

## Notes
- **Depends on:** 0500
- **Blocks:** 0532
- **Related:** `0500` (the research and the ruling); `0533`, `0534`, `0535` (the rest of the series);
  ADR-021, ADR-031, ADR-057; `conventions/one-skill-one-output.md`.
- ⛔ **Do not start without the owner's specific word.**
- **Knock-on (stated per `placement-questions-state-the-knock-on.md`):** filed on the **Backlog board**
  (owner ruling 5, 2026-10-20). It waits on `0500` (Sprint 12). `0532`, then `0533`, `0534` and `0535`
  wait on it, all on the Backlog board. Nothing in Sprint 12 or Sprint 14 waits on it (checked
  2026-10-20).
- **Why its own brief, before the build:** the ADR can be written, reviewed and accepted on its own;
  the build implements it. Same shape as `0527` before `0528`–`0530`.
- **Owner choice:** `fkit-architect` — `/fkit-record-decision` is the architect's skill.
- **Board and priority:** Backlog board, Priority cell `—`, `## Priority: Unscheduled`.
- Filed 2026-10-20 by a spawned `fkit-producer` on owner rulings relayed by `fkit-lead` (no owner
  channel, ADR-021). No commit.
