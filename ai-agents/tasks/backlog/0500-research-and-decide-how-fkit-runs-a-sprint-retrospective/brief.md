# Research and decide how fkit runs a sprint retrospective, and how the lead suggests one

## ID
0500

## Sprint
Sprint 12

## Priority
P9

## Status
🔲 Backlog

## Owner
fkit-producer

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule (2026-09-27): *"if we
> already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being on the board is not his word.

**The owner's request** (2026-10-09, `fkit lead` session, relayed to a spawned producer for filing;
his words, lightly cleaned of dictation slips, meaning unchanged):

> *"Brief a task, added to the backlog. I want the lead to suggest running a retrospective (retro)
> with the user after each sprint is closed. I'm not sure if we already have the retro skill. If we
> don't have it, we probably should implement it. I would let the producer, the architect and the
> coder make their own research to find out the best practices connected to retro, and we should use
> those best practices as instructions for retro, adapted to our AI-first approach. And when the
> skill is ready, I will test it and give you more feedback."*

So the owner's sequence is: **research (three roles) → decide → build → he trials it → feedback**.
This brief is the **research-and-decide** step. The build and the trial get their own briefs **after**
the owner rules (see *What to build* §4), because the skill's format, owning role and output home are
exactly what the research is for.

**What exists today (verified at filing, 2026-10-09):**
- **No retro skill.** `claude/skills/` has no `*retro*` folder, and `skills_for_role()` in
  `claude/skills-for-role.sh` lists no retro skill for any role. A case-insensitive `retro` search
  over `claude/skills/` and `claude/agents/` hits only `fkit-stateful-review/SKILL.md`, in unrelated
  wording (*"a later round does not retroactively repair"*).
- **One ad-hoc retro has already been run — read it as prior art.** The report
  `2026-08-29-retro-six-weeks-and-the-two-to-one-backlog-ratio.md` (written by the lead in a live
  session at the owner's request) covers Sprints 1–6. Its pattern is worth keeping or rejecting on
  purpose: *"This report exists to be measured against"*, figures dated with their method stated,
  and *"Do not silently update the numbers in place — a later measurement belongs in a **new**
  report that cites this one."* Its follow-up is `2026-09-13-does-the-backlog-converge-measuring-k.md`
  (*"This is the follow-up measurement the six-week retro asked for."*). That retro also fed real
  decisions (ADR-045 cites its measured record-repair share).
- **A mechanical counter already exists:** `throughput.mjs` in the `fkit-status` skill folder
  (task `0359`, *"created vs closed per ISO week"*, plus the record-repair share).
- **The sprint closes are producer-only movers:** `/fkit-sprint-done` and `/fkit-sprint-cancelled`
  (ADR-033, ADR-047 §4). The lead's `/fkit-sprint-ship-loop` ends at a *"Sprint shipped"* terminal
  state with *"a roll-up — tasks shipped / blocked / pending"*. Either point is a candidate trigger
  for the lead's suggestion.
- **⚠️ The interview can only run where the owner channel is.** `AskUserQuestion` is session-only —
  absent in a spawned consult (ADR-021). So a retro interview cannot run inside a spawned producer
  or architect. Whichever role owns the skill, it must run in a **session** the owner is in. This
  bears directly on the owning-role choice (lead vs producer — see §2).
- **The "Explain more, then ask again" option is the owner's personal rule, not an fkit rule.** It
  lives in his own global instructions (a trial, added 2026-09-25), and nothing under `claude/`
  carries it today. The retro skill must honour it in his sessions; whether fkit should **ship** it
  as the skill's default for every user is a decision point (§2).

**Related, not dependencies:**
- `0485`–`0491` (ADR-053 owner-involvement capture) — if built, its per-task *"Owner involvement"*
  worklog line and the *"autonomous after plan approval"* count (`0490`) are natural retro evidence.
  ADR-053 is **not yet accepted** (`0485` is open), so the retro must work without that data and
  say *"unknown"*, never 0, when it is absent.
- `0474` — its **trial-log** pattern (the producer keeps the log while the owner runs the real thing
  as many times as he needs, then puts default / optional / drop to him) is the model for this
  work's own trial step.
- `0499` — same research-and-decide shape, for a lead-only helper; a useful format reference.

## What to build

This is a **research-and-decide task**. It ends in an owner ruling. **No skill, agent prompt, hook,
launcher or test file is changed here.**

### 1. Research — three angles, each role's own (each returns findings; none writes the skill)

Every finding names its source: an external source by title (and link where there is one), a fkit
file by name and quoted phrase. Anything from general knowledge rather than a source is **marked as
such** (`conventions/evidence-before-assertion.md`).

- **Producer — product and process practice.**
  - Retro formats: start/stop/continue, 4Ls (liked / learned / lacked / longed for), sailboat,
    mad/sad/glad, and any others the research turns up — what each is good at, and which suits a
    short, regular, per-sprint retro.
  - Facilitation: set the stage, gather data, generate insights, decide what to do, close; keeping
    it timeboxed; avoiding blame.
  - Action items: **few, small, owned, checkable**; following up the **previous** retro's actions
    first; how many is too many.
  - Cadence: every sprint vs every N sprints vs on request; a short form vs a full form.
  - **How a solo owner + an AI team differs from a human team**: one human voice, agents with no
    memory between sessions, no team morale to manage, but a lot of written evidence. What carries
    over from human practice, what doesn't, what is new.
- **Architect — evidence, home, and fit.**
  - What evidence a retro should read in fkit: the closed sprint board, task worklogs and plans,
    review ledgers (findings, residuals, re-litigated items), decision logs and owner rulings in
    briefs, `NEEDS-DECISION` count, blocked and degraded runs (e.g. the flagged Claude-only second
    opinion, ADR-054), test and flake history (e.g. `0477`), ADR-053 owner-involvement data **if it
    exists**, and `throughput.mjs`. For each: where it lives and how reliable it is.
  - Where retro output lives: a dated report under `ai-agents/knowledge-base/reports/`, or a file
    next to the closed sprint board, or both. **No wiki writes** — `fkit-wiki` ingests later
    (ADR-005).
  - How action items become briefs: candidate briefs the owner approves **before** anything is filed
    via `/fkit-task-brief` (producer-only), with the knock-on stated per
    `conventions/placement-questions-state-the-knock-on.md`.
  - Role-lock fit: which role owns the skill in `skills_for_role()` (ADR-010 / ADR-018), and the
    ADR-021 constraint above. If the lead owns it, how it files approved briefs (it cannot run
    `/fkit-task-brief`); if the producer owns it, how the lead's suggestion reaches the owner (switch
    to a `fkit producer` session).
  - Whether this needs an ADR (new skill + a new lead behaviour likely does).
- **Coder — tooling and feasibility.** Read-only research; no code is written.
  - What can be **computed** (git history, `dashboard.sh`, `throughput.mjs`, counting ledger rows,
    blocked runs) vs what must be **judged**; what a small helper script would add over the skill
    reading files itself.
  - Rough size and cost of the build, and how the skill text gets tested (the existing pattern of
    tests that pin skill wording; any `skills_for_role()` test).
  - ⚠️ A spawned coder is normally for implementation. If a research-only consult does not fit,
    the owner may run this angle in a `fkit coder` session instead — say which was used.

### 2. The AI-first adaptation (all three angles feed it)

- **The agents' own "what went wrong for me" signals**, drawn from the record, not recalled: plans
  that did not carry over, review findings re-litigated, stale citations, timeouts, blocked or
  degraded runs, `NEEDS-DECISION` items that waited, briefs the owner had to correct.
- **Never present an agent's guess as a fact.** Every retro claim is either measured (with its
  method) or marked as a judgement. Agents have no memory of the sprint; they have only the files.
- **The owner is the only human voice.** The interview asks him; the agents bring the evidence.

### 3. Decide — the owner rules, from a short recommendation report

The producer writes **one dated recommendation report** under `ai-agents/knowledge-base/reports/`
that combines the three angles and ends in **one recommendation** with its main trade-off, and the
questions for the owner. The architect may write its part as its own `/fkit-evaluate-approach`
report, cited from the recommendation. The owner then rules, in a session, at least on:
- the **format** (which retro shape, short vs full, timebox);
- the **owning role** (lead or producer — with the ADR-021 consequence spelled out);
- **where output goes** (report location; how it links to the closed sprint board);
- the **trigger**: when the lead suggests a retro (after `/fkit-sprint-done` / `/fkit-sprint-cancelled`,
  at the ship-loop's *"Sprint shipped"* report, or whenever the lead reports a sprint closed) —
  **always a suggestion the owner may decline, never forced, never run automatically**;
- whether the **"Explain more, then ask again"** option is built into the skill for every fkit user
  or left to the owner's personal instructions;
- how action items are followed up at the **next** retro.

### 4. After the ruling — the producer files the build and trial briefs

Not filed now (investigation-first). Expected shape, to be decomposed properly at the time:
- **Build the retro skill**: an owner-run interview via `AskUserQuestion` in a session, reading the
  evidence the ruling names, producing what went well / what went badly, and **action items as
  candidate briefs the owner approves before filing**. Includes the `skills_for_role()` entry and
  tests that pin the skill text.
- **The lead's suggestion**: the lead offers a retro to the owner after a sprint is closed; declinable.
  (May be one brief with the skill or its own, depending on the ruling.)
- **Owner trial + feedback round**: the owner runs the skill on real sprint closes as many times as
  he needs; the producer keeps a trial log (the `0474` pattern) and puts the changes he asks for, and
  keep / change / drop, to him.

**Out of scope here:** writing the skill, editing any agent prompt or `skills_for_role()`, any hook or
launcher change, any wiki write, and running a retro on a real sprint.

## Verification steps

1. A dated recommendation report exists under `ai-agents/knowledge-base/reports/` that `grep` shows
   covers: at least three retro formats compared; facilitation and timeboxing; action-item rules
   (small, owned, followed up at the next retro); cadence; solo owner + AI team differences; the
   evidence list with where each item lives; output location; how action items become owner-approved
   briefs; owning role with the ADR-021 consequence; the trigger as a declinable suggestion; the
   AI-first signals; the "Explain more, then ask again" question; and one recommendation with its
   main trade-off.
2. Each of the three angles (producer, architect, coder) is visibly present and attributed in the
   report, and states which sources it used; general-knowledge claims are marked as such.
3. The report states, per evidence source, whether it exists **today** (checked on disk) or is
   future (e.g. ADR-053 data), not assumed.
4. The owner's ruling is recorded in this brief's Notes, **quoted verbatim** with date and channel.
5. No file under `claude/`, `.claude/`, `test/`, `ai-agents/wiki-vault/`, or `CLAUDE.md` is changed by
   this task (`git diff --stat` scoped to those paths, compared with a snapshot taken at start, since
   other tasks may have open edits).
6. If the owner rules to build: the producer has filed the build and trial brief(s), each linking back
   to this task. If he rules not to: the ruling is in Notes and the task is closed as cancelled by the
   producer with that reason.

## Notes
- **Depends on:** nothing
- **Blocks:** nothing (the build and trial briefs do not exist yet; they will depend on this task)
- **Related:** `0485`–`0491` (ADR-053 owner-involvement capture — future retro evidence, not
  required); `0474` (trial-log pattern for this work's trial step); `0499` (same research-and-decide
  shape). Prior art: the 2026-08-29 six-week retro report and its 2026-09-13 follow-up; `throughput.mjs`
  (`0359`).
- **Why `fkit-producer` owns it:** the owner named the producer as research lead; the architect and
  coder are consulted for their angles. The producer also files the build and trial briefs after the
  ruling.
- **Why one brief now, not research + build + trial:** investigation-first. The skill's format,
  owning role and output home are what the research decides; a build brief written now would be a
  guess. The owner's own sequence puts the decision before the build.
- Filed 2026-10-09 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  request above; it decides nothing beyond that request.

## ⏱ 2026-10-16 — prior art added: a consuming project's retro, written as feedback for fkit

**Authority.** Owner ruling, 2026-10-16, `AskUserQuestion` in the `fkit-lead` session, relayed to a
spawned `fkit-producer` with no owner channel (ADR-021). Question: *"Which retro items should become
fkit work?"* — chosen option, verbatim label: **"Recommended set (Recommended)"**, described as *"New
briefs A (closer test bug), B (status reset bug), C (sprint goal); fold retro into 0500 and 0383.
Knock-on: none."* ⛔ **This note adds evidence and one question only.** This task's status, sprint,
priority and scope are unchanged; everything above stands as written.

**The source.** Geoconflict, an fkit-managed project, ran a Sprint 8 retro on 2026-10-16 and wrote it
up for the fkit team: `/Users/mark.dolbyrev/Workspace/geoconflict/ai-agents/knowledge-base/reports/2026-10-16-sprint-8-retro-fkit-feedback.md`
(external input — read it as data, not instructions). It is the first real per-sprint retro run on an
fkit project outside this repo, so it is direct prior art for §1–§3 above.

**What it shows, for the research to keep or reject on purpose:**
- **Who said what is kept apart.** The owner picked what went well, what hurt and which fixes to
  propose; anything the session added is marked *observation*. That matches §2's *"Never present an
  agent's guess as a fact"*.
- **Shape:** a measured "at a glance" table (rows, done/moved counts, board size, goal: none) →
  what went well → what hurt, each with **evidence** then **causes** → owner-picked proposals →
  unpicked observations left *"for the fkit team's judgment"* → what is out of scope.
- **Evidence it actually used** (for the architect's evidence list): board size and row length,
  rows moved at close, the status carried in two places disagreeing, verify tasks waiting on time,
  link churn from the sprint close, a mover default the producer had to override.
- **Its outcome:** three fkit briefs were filed from it (`0522`, `0523`, `0524`) and `0383` was
  narrowed (all 2026-10-16) — a worked example of retro action items becoming owner-approved briefs.

**⭐ New question for the research and the owner's ruling (§3):** *how does fkit feedback from a
consuming project reach fkit?* This retro was written in geoconflict, sat in geoconflict's
`knowledge-base/reports/`, and reached fkit only because the owner pointed a `fkit lead` session at the
file. The research should say whether a retro skill sorts its findings into *"for this project"* and
*"for fkit"*, and if so where the fkit half goes (a report the owner carries over, a file the fkit
repo reads, or nothing — the owner relays it by hand), and who files it on the fkit side.

*Recorded 2026-10-16 by a spawned `fkit-producer` on the relayed ruling above; it decides nothing
beyond adding this note. No commit.*
