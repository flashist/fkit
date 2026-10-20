# Decide how a lead "clear handoff" carries the important context across a `/clear`

## ID
0499

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule (2026-09-27): *"if we
> already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being on the board is not his word.

**The owner's request** (2026-10-08, `fkit lead` session, relayed to a spawned producer for filing;
his words, lightly cleaned of dictation slips, meaning unchanged):

> *"Brief a task and add to the backlog. I often find myself in this situation when I need to clear
> the context, but if I do that I would lose all the important information from the current session.
> I want you to create a command that I can run. The command should be for the fkit lead agent only.
> The working title is `fkit clear handoff`. The idea is that the lead creates a temporary handoff
> that is saved locally and it has all the important information about the last things we discussed
> with the agent. It shouldn't include all the information from the session, only the last part that
> is important for me. And I want, if possible, when I run this command, this file to be created,
> then the clear command should be done, and then when the cleared session starts the lead should
> read this temporary handoff, understand the context from the previous session before clear, and
> remove the temporary file. I'm not sure if all of that is possible, because I believe you told me
> that you can't run the clear command yourself — it's something that I should do. So when the task
> is going to be implemented, we need to discuss what can be implemented and what can't. All that I
> said is just a very rough idea, so I'm open to improvements or changes in the way it's going to
> work. It's more like an open discussion, and the decision should be made after the architect and
> the producer do their research."*

So this is a **research-and-decide task**. The owner asked for research first and a decision after;
he called his own description *"a very rough idea"*. No build brief is filed until he rules.

**⚠️ A prior owner ruling sits close to this — read it first.** The report
`2026-09-27-eval-keeping-ship-loop-conductors-from-bloating.md` carries a dated note,
*"DECIDED 2026-09-28"*. In it the owner rejected *"a self-restarting session (the lead writes a
hand-over, ends its session, and the launcher starts a fresh one)"* and its fallbacks, including
*"a semi-automatic `/clear` followed by a hook reload"*, in his words: *"it looks like a workaround.
I think I will continue working with fkit and controlling it myself, so I will try to manage the
context manually"*. He also chose to record it *"So nobody re-proposes them."* The wiki page
`systems/fkit.md` repeats it: *"Owner ruling 2026-09-28: he manages context by hand; no fkit change
and no brief"*.

**⭐ Owner ruling 2026-10-09 — this task fits INSIDE the 2026-09-28 ruling; it does not reopen it.**
(See Notes for both rulings verbatim.) So the research covers **owner-triggered helpers only**: the
owner runs the command, and the owner types `/clear`. **No self-restarting or self-clearing lead** is
in scope. A hook that reads the handoff after an owner-typed `/clear` stays in scope **only as an
owner-triggered aid** — never as a way for the lead to clear or restart itself. The **manual two-step
flow** (lead writes the file, owner types `/clear`, the new lead reads it on its first turn) is an
**acceptable outcome**, worth building even without any automation.

The research must still say plainly **how the recommended mechanism stays inside the 2026-09-28
ruling**, and whether that ruling's note needs a dated pointer to this task's outcome. If a mechanism
only works by having the lead clear or restart itself, it is out of scope — record that, and do not
dress it up as something new.

**What exists today (verified at filing, 2026-10-08):**
- The lead owns five skills: `skills_for_role()` in `claude/skills-for-role.sh` reads
  *"lead)      echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down
  fkit-sprint-ship-loop""*. A new lead skill is added there (ADR-010 role lock; ADR-018 hook
  enforcement).
- The launcher installs hooks per role session: `build_settings()` in `claude/fkit-claude.sh` writes
  `PreToolUse`, `Stop` and `UserPromptExpansion` entries to `.fkit/settings/<role>.json`. There is
  **no `SessionStart` hook today**. Its own comment notes these hooks reach **launcher sessions
  only** — *"a running session gets it at its NEXT launch, never mid-session."*
- `.fkit/` is gitignored in this repo (`.gitignore` reads *".fkit/"*); whether every consuming
  project gets the same ignore line is **unverified** — check `claude/fkit-claude-init.sh`.
- ADR-053 (owner-involvement capture) says *"No SessionStart hook."* for its own scope — that is a
  scoping line in a different decision, not a ban; the research should say whether it matters here.

**Related, not a dependency:** `0475` / ADR-055 — context only, for how the lead's skills and the
hook surface are currently laid out.

## What to build

This is a **decision task**. It ends in an owner ruling. **No prompt, skill, hook or launcher file
is changed here.** If the owner rules to build, the producer files the build brief(s) afterwards.

1. **Product side — what the owner actually needs** (producer, with the owner). Pin down:
   - What *"the last part that is important for me"* means in practice: the current topic, open
     questions, decisions made in this session (with whether each is an owner ruling or a lead
     claim), pending next steps, files in play, task IDs. What is left out.
   - A size budget, so the handoff stays a summary and not a transcript copy.
   - What must **never** be in it: secrets, credentials, DSNs, endpoints, keys — the universal
     *"No secrets in any artifact"* rule applies even to a local file.
   - Where it lives (proposal to test: under `.fkit/tmp/`, local and gitignored), and who may read
     it — **lead sessions only**.

2. **Feasibility — every item below is UNVERIFIED until the architect checks it** against Claude
   Code's real behaviour and fkit's code. Record each as verified / refuted / partly true, with the
   evidence:
   - **(a)** Can an agent or skill trigger `/clear` itself? The lead believes it cannot and the owner
     must type it. **Check this only to confirm the boundary** — per the 2026-10-09 ruling, a
     self-clearing lead is out of scope even if it turns out to be possible.
   - **(b)** Can a Claude Code `SessionStart` hook (installed by the launcher, like the existing
     hooks) tell that a session was started by an **owner-typed** `/clear`, inject the handoff file's
     contents as context, and then delete the file? A plausible mechanism to check, not a fact. Also
     check: does it fire only in `fkit lead` sessions (the launcher's per-role settings), and what
     happens in a plain `claude` session. In scope **only as an owner-triggered aid** (2026-10-09
     ruling); if it does not work, the manual two-step flow is the fallback.
   - **(c)** Alternatives, each with what it gives and what it costs:
     - a lead skill (working name `/fkit-clear-handoff`) that writes the file and tells the owner to
       type `/clear`;
     - the lead's start-up instructions checking for a handoff file on its first turn;
     - Claude Code's own `/compact` with focus instructions, as the comparison point — what it
       already gives, and why it may not be enough (the 2026-09-27 report's §1.3 records the
       ~20,000-character skill cut after a compaction, and the owner's view that compaction
       *"degrades the quality of sessions"*).

3. **Fit with fkit's rules.** The design must answer:
   - **Role lock** — the skill is owned by `lead` in `skills_for_role()` (ADR-010 / ADR-018), and
     the reader side (hook or start-up check) must not hand the file to another role.
   - **Launcher and hook surface** — what changes in `claude/fkit-claude.sh` and which hook files,
     if any; launcher-only reach.
   - **No unverified claims passing as fact** (`conventions/evidence-before-assertion.md`). The
     handoff is one session's summary. The new session must state the handoff's age and that its
     contents are a summary to re-check, and must not repeat its claims about repo state, task
     status or owner rulings as verified without checking them.
   - **Stale or orphaned files** — a crash or a closed terminal before `/clear`; a handoff never
     read; two lead sessions in one repo writing or reading the same file; a handoff older than some
     limit. Say what happens in each case.
   - **Privacy** — local only, never committed, never copied into the wiki or a report, deleted
     after use.
   - **Relation to the 2026-09-28 ruling** — per Context above: the recommendation must stay
     owner-triggered (2026-10-09 ruling).

4. **Output.** The architect writes `/fkit-evaluate-approach` (comparing the mechanisms) or
   `/fkit-design-spec` (if one mechanism is clearly right), saved under
   `ai-agents/knowledge-base/reports/`, ending in one recommendation with its main trade-off and the
   open questions for the owner. Then **the owner decides**. Only then does the producer file the
   build brief(s), decomposed per the usual rule.

**Out of scope:** writing the skill, hook, or launcher change; changing other roles' skills;
automatic (owner-not-involved) context management of any kind; **a self-clearing or self-restarting
lead** — the area the 2026-09-28 ruling closed and the 2026-10-09 ruling kept closed.

## Verification steps

1. A report exists under `ai-agents/knowledge-base/reports/` (dated, from `/fkit-evaluate-approach`
   or `/fkit-design-spec`) that `grep` shows covers: feasibility items (a), (b) and (c) each marked
   verified / refuted / partly true with the evidence named; the handoff's contents and size budget;
   the never-in-it list (secrets); location and gitignore status; role lock; stale/orphaned and
   two-session cases; the evidence-before-assertion handling; the 2026-09-28 ruling and how the
   recommendation stays inside it (owner-triggered only, per the 2026-10-09 ruling); the manual
   two-step flow assessed as a standalone outcome.
2. Feasibility item (b) is backed by a real check (Claude Code documentation quoted, or a probe
   run and its output recorded), not by belief. If it could not be checked, the report says so.
3. The owner's ruling is recorded in this brief's Notes, **quoted verbatim** with date and channel.
4. No file under `claude/`, `.claude/`, `test/`, or `CLAUDE.md` is changed by this task
   (`git diff --stat` scoped to those paths, compared with a snapshot taken at start, since other
   tasks may have open edits).
5. If the owner rules to build: the producer has filed the build brief(s), each linking back to this
   task. If he rules not to: the ruling is in Notes and the task is routed to the producer to close
   as cancelled with that reason.

## Notes
- **Depends on:** nothing
- **Blocks:** nothing
- **Related:** `0475` / ADR-055 — context only (lead skills and hook surface), not a dependency. The
  2026-09-27 report on conductor context bloat and its 2026-09-28 owner ruling — read first.
- **Why `fkit-architect` owns it:** the research lead is technical feasibility, and
  `/fkit-evaluate-approach` and `/fkit-design-spec` are architect-only. The producer covers step 1
  (what the owner needs) and files the build brief(s) after the ruling.
- **Why one brief, not research + build:** the build's shape is unknown until feasibility is checked
  and the owner rules (investigation-first). The owner said himself *"the decision should be made
  after the architect and the producer do their research."*
- **Owner rulings 2026-10-09** (`AskUserQuestion` in the `fkit lead` session, relayed to a spawned
  producer; answered around the 2026-10-08/09 date change, dated 2026-10-09). Selected options,
  verbatim:
  1. On the 2026-09-28 *"manage context by hand"* ruling: **"Fits inside — I trigger it
     (Recommended)"** — option text: *"Research only helpers you start by hand (you run the command,
     you type /clear). No self-restarting or self-clearing lead."*
  2. On a fallback if the automatic read after `/clear` does not work: **"Yes, two-step is fine
     (Recommended)"** — option text: *"The research may land on the manual two-step flow; worth
     building even without automation."*

  These rulings narrow the research scope (see Context, step 2 and Out of scope). They are **not**
  the owner's word to start — the ⛔ line in Context still holds.
- **Owner rule 2026-10-19 — WHEN the lead offers a clear** (typed reply in the `fkit lead` session,
  relayed to a spawned producer; the owner chose to record it here via `AskUserQuestion`, same
  session and day: *"Yes, dated note in 0499 (Recommended)"*). What started it, verbatim:

  > *"I still face the problem of not being able to clear the context of the main lead agent when it
  > asks me something: e.g. it asks me something about what should be done next, but I can't answer
  > and pause, if I answer - the work continues, but the context is already pretty full. How to fix
  > it? I believe we already discussed it, but I am not sure if we come up to a solution for this?"*

  His rule, verbatim (typo kept as typed):

  > *"I don''t [sic] want to have "pause in the middle of a task" option. What I want is to be able to
  > clear context when there is no active work on a task: e.g. when one task is done, but the next
  > one is not started yet. Ideally, the lead should stop and ask the question about clearing the
  > context (or using the new "handoff>clear>continue" option) when the context is 50% or more and an
  > active task is completed."*

  **What this adds to the scope:** the research must also cover the **trigger** — not only how the
  handoff works, but when the lead offers it. At a **task boundary** (one task closed, the next not
  yet started), if the lead's context is **50% or more**, the lead stops and asks the owner whether
  to (a) do a plain `/clear`, or (b) use the handoff → clear → continue helper this task designs.
  **No mid-task pause** — the owner rejected it; a "pause" option raised in a same-day
  producer + architect consult is out. This stays inside the 2026-09-28 and 2026-10-09 rulings: the
  lead only asks; the owner still decides and types `/clear` himself.

  **Open check — UNVERIFIED, for the architect before any design:** can the lead (or a hook the
  launcher installs) actually read how full its context is, as a number it can compare with 50%? If
  it cannot, the fallback is to offer the choice at **every** task boundary instead. Record the
  answer as verified / refuted / partly true, with evidence, alongside feasibility items (a)–(c).

  **Where it applies:** mainly `/fkit-sprint-ship-loop`. Its natural boundary is after a task's close
  and before it picks the next task. Known cost, from the same-day consult (a reading, not yet
  checked): between tasks a `/clear` loses nothing on disk — closed tasks are closed, and a fresh
  loop rebuilds from the boards — **except the run's skip list** (tasks rejected earlier in that
  run), which lives only in the session. The research should say whether the handoff carries it,
  or whether losing it is accepted.

  This note widens the research scope only. It is **not** the owner's word to start — the ⛔ line in
  Context still holds.
- Filed 2026-10-08 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  request above; it decides nothing beyond that request.
