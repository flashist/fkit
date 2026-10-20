# Recommendation: how fkit runs a sprint retrospective, and how the lead suggests one (task `0500`, §3)

**Status:** open. The owner rules from this report, in a session. His ruling goes into `0500`'s Notes,
verbatim, and is not written here.

**Written 2026-10-20 by a spawned `fkit-producer`** (spawned by `fkit-lead`, driving Sprint 12 task
`0500`). It has **no owner channel**: `AskUserQuestion` is absent in a spawned consult
([ADR-021](../decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)). The questions in
§10 are for the lead to put to the owner.

**Authority to start.** The owner's go-ahead, given via `AskUserQuestion` on 2026-10-20 in the `fkit lead`
session. Selected option, verbatim: *"Start 0500 as research (Recommended)"*.

**What this report combines.** Three research angles from `0500` §1, each attributed below:
- **Producer** (§2): this report's author. Web research plus prior art on disk.
- **Architect** (§3): its own `/fkit-evaluate-approach` report,
  [`2026-10-20-eval-sprint-retro-evidence-home-and-role-fit.md`](2026-10-20-eval-sprint-retro-evidence-home-and-role-fit.md).
  That report's owner-priorities step (Step 1) did **not** run, because there is no owner channel in a spawn.
- **Coder** (§4): a read-only consult with a spawned `fkit-coder`. It returned text only. **What §4 holds is
  the lead's relayed summary of that text, not a byte copy.** The producer spot-checked two of its claims
  on disk (marked *checked*).

**Labels used.** **[SRC]** = an external source, named with a link. **[DISK]** = a fkit file, quoted.
**[GK]** = general knowledge, no source. **[JUDGEMENT]** = the named role's opinion.

**Not touched by this task.** `claude/`, `.claude/`, `test/`, `ai-agents/wiki-vault/`, `CLAUDE.md`, the
brief and the boards. This file is the only write. No commit.

---

## 0. Read first: three things that change the questions

1. **"Explain more, then ask again" is already decided. This report drops it as a question.**
   - The brief says *"nothing under `claude/` carries it today"*. That was true when the brief was filed
     (2026-10-09). It stopped being true the next day.
   - [DISK] `conventions/asking-the-owner.md`: *"Owner ruling, 2026-10-10 — ship the 'Explain more, then
     ask again' option to every fkit user … (task 0504)"*. Task `0504` is in `tasks/done/`.
   - The option ships today in all six agent prompts, three skills and the scaffold copy of the convention.
     The producer and the architect checked this separately.
   - **So a retro skill follows `asking-the-owner.md` like every other skill, and the option appears once.**
     There is nothing to rule.
2. **Warning: the brief's §4 promise of "tests that pin the skill text" conflicts with an accepted ADR.**
   [ADR-057](../decisions/adr-057-fkits-tests-cover-shipped-script-behaviour-only.md) (accepted 2026-10-19)
   says the suite *"may not cover … Category 4 — the wording or shape of shipped prompt and document files
   under `claude/`"*. Its §D2.1 adds: *"No new test file and no new prove-red case without the owner's OK"*.
   - What a build **must** still do: add the new skill to the `skills_for_role()` mirror in
     `test/skill-ownership-hook.test.js`. That is an edit to an existing file, and it falls under ADR-057's
     key list (D2.3 items 2–3).
   - Raised by the coder and the architect independently. Put to the owner in §10, Q3.
3. **The producer's first lean (a short retro every sprint plus a full one on request) conflicts with a
   convention. §6 resolves it.**
   - [DISK] `conventions/one-skill-one-output.md`: *"Arguments … never select output shapes, verbosity
     levels, or partial/full modes"*. Raised by the architect.
   - The fix keeps one form, and lets the **subject** be one sprint or every sprint since the last retro.
     The same convention's litmus test allows that. The two-form option stays open to the owner in Q2.

---

## 1. The question

How should fkit run a sprint retrospective (a retro) with its one human owner and its AI team? That covers
the format, the evidence, the output home, how action items become briefs, and the owning role. And how
should the lead suggest one after a sprint closes, always as an offer he can decline?

---

## 2. Producer angle: product and process practice

### 2.1 Retro formats compared

Seven formats compared. Fit is the producer's view.

| Format | Good at | Weak at | Fit here [JUDGEMENT] |
|---|---|---|---|
| **Start / Stop / Continue** [GK; listed by Retromat] | Turns straight into actions; fast | Skips the "why" | Good for the regular retro, if a "why" step is added |
| **Plus / Delta** [SRC Creately] | Smallest; *"focuses on actions rather than feelings"* | Little detail | Good: two prompts, little owner time |
| **4Ls** (liked, learned, lacked, longed for), by Gorman & Gottesdiener [SRC EBG] | Finding facts, neutral feedback; "Longed For" gives *"some very powerful data"* | Slower; built for a group sorting sticky notes | Keep "longed for" as one optional prompt |
| **Sailboat / speedboat** (Hohmann, *Innovation Games*) [SRC Agile Alliance; Mountain Goat] | Visual picture: anchors slow us, wind helps; rocks (risks) were added later | Needs a shared visual board; little value in a chat with one person | Poor fit. Keep only the idea of "rocks ahead" (next sprint's risks) |
| **Mad / Sad / Glad** [SRC draft.io; Creately] | Brings out feelings and morale | Agents have no feelings, and there is no team morale to manage | Drop the feelings frame. Keep one owner prompt: "what frustrated you?" |
| **Starfish** (keep, less, more, stop, start) [SRC Creately; GK: Patrick Kua] | Finer-grained actions | Five categories is heavy | Not needed |
| **Timeline + metrics** [GK; Retromat's "gather data" stage] | Covers several sprints; agents can rebuild the timeline from git | Costly to prepare | Fits a retro whose subject is several sprints. The 2026-08-29 retro was this kind |

**Producer pick:** three owner prompts: *what went well, what hurt, what we change*. This is Plus/Delta
joined with Start/Stop/Continue. "Longed for" is an optional fourth prompt. The agents fill in candidate
answers from the evidence first. See §5.

### 2.2 How to run it: stages, timebox, no blame

- **Five stages:** set the stage, gather data, generate insights, decide what to do, close.
  - [SRC] Derby & Larsen, *Agile Retrospectives: Making Good Teams Great* (2006), via the summaries at
    [appliedframeworks](https://agile.appliedframeworks.com/applied-frameworks-agile-blog/agile-retrospective-framework-in-five-steps)
    and [cprime](https://cprime.com/?p=18348). In "decide what to do", the team picks *"one or two action
    items"*.
  - [SRC] [Retromat](https://retromat.org/blog/category/facilitation/page/2/) builds its plans on the same
    five phases. Its author notes that *"phases 2-3-4 are usually kind of merged"*.
- **Timebox:**
  - [SRC] The [Scrum Guide 2020](https://scrumguides.org/scrum-guide.html) caps a retro at *"a maximum of
    three hours for a one-month Sprint"*, and less for shorter sprints. Ending early is fine
    ([echometer](https://echometerapp.com/en/time-box-sprint-retrospective/)).
  - [JUDGEMENT] For one owner: **at most about 10 minutes of owner time**, roughly five questions. The
    agents' preparation happens before he is asked anything, so it does not count against that.
- **No blame:**
  - [SRC] Kerth's Prime Directive, from *Project Retrospectives* (2001), quoted at
    [martinfowler.com](https://www.martinfowler.com/bliki/PrimingPrimeDirective.html): *"everyone did the
    best job they could, given what they knew at the time…"*. Fowler adds that the research behind
    reading it aloud has since come into doubt.
  - [SRC] [Google SRE book, ch. 15](https://sre.google/sre-book/postmortem-culture/): find contributing
    causes *"without indicting any individual"*; fix the process, not the person.
  - [JUDGEMENT] In fkit, blame goes to the **system**: a skill's wording, a convention, a missing guard.
    It never goes to "the coder" or to the owner.

### 2.3 Action items: few, small, owned, checkable; the previous retro's actions first

- **Few.** [SRC] Practitioner sources agree on **1–3 per retro**
  ([easyagile](https://www.easyagile.com/blog/improve-sprint-retrospective-action-items),
  [kollabe](https://kollabe.com/posts/retrospective-action-items)). Too many overwhelm the team. A "35%
  completed" figure circulates; it could not be checked and is not used.
- **The previous retro's actions come first.** [SRC] easyagile, kollabe, and
  [HackerNoon, "Personal Retrospectives for Developers"](https://hackernoon.com/personal-retrospectives-for-developers-e5d86813d65a).
  The scrum.org post
  ["Ditch the Unfinished Action Items"](https://www.scrum.org/resources/blog/ditch-unfinished-action-items)
  argues against carrying unfinished items forward without deciding. It was seen in search summaries
  only, because the page fetch came back empty.
- **Owned and checkable.** [JUDGEMENT] This comes almost free in fkit. Each action becomes a candidate
  brief, which has an owning role, verification steps (checkable), and a status on disk (trackable).
- **How many is too many: a fkit-specific reason for a tight cap.**
  - [DISK] The 2026-08-29 retro found the project *"files roughly two tasks for every one it closes"*. A
    retro after every sprint that files several briefs adds to that inflow.
  - [JUDGEMENT] **A hard cap of 3 candidate briefs.** "Change an existing brief", "cancel one", and "no
    action" all count as actions.
  - Prefer actions that remove a **recurring class** of problem. The 2026-08-29 retro ranked by *"how much
    backlog each permanently removes"*.

### 2.4 Cadence

- [SRC] Practice:
  - A retro every sprint is the norm. Mike Cohn,
    ["Does a Scrum Team Need a Retrospective Every Sprint?"](https://www.mountaingoatsoftware.com/blog/does-a-scrum-team-need-a-retrospective-every-sprint).
  - Release-level retros are added on top, not instead.
  - The risk of running them too often is fatigue
    ([parabol](https://www.parabol.co/blog/how-often-to-run-retrospectives),
    [goretro](https://goretro.ai/post/how-long-between-sprint-retrospectives)).
- [DISK] fkit's sprints are irregular. Line-3 banners in `sprints/done/` show 12 sprint closes from
  2026-07-11 to 2026-10-20:
  - gaps from **1 day** (S2 closed 08-06, S3 closed 08-07) to **26 days** (S5 closed 08-13, S6 closed 08-29);
  - boards from **88 lines** (S13) to **4,670** (S2).
- [JUDGEMENT] So: **offer a retro after every sprint close.** When sprints close days apart, one retro
  covers *"every sprint since the last retro"*, so the owner is not asked twice. A fixed "every N sprints"
  rule fits fkit's irregular sprints poorly.

### 2.5 One owner with an AI team, compared with a human team

**What carries over:**
- the five stages, the timebox, no blame;
- few, owned, checkable actions, with the previous actions reviewed first;
- running one every sprint;
- the Scrum Guide's subjects, *"individuals, interactions, processes, tools, and their Definition of
  Done"* [SRC]. In fkit terms: roles, handoffs, skills, tools, and close criteria.

**What does not carry over** [JUDGEMENT]:
- icebreakers and check-ins (e.g. ESVP [GK]);
- dot-voting, since there is one voter;
- managing psychological safety and morale;
- the feelings frame for agents.

**What is new** [JUDGEMENT unless marked]:
- **Agents have no memory of the sprint, only files.** Their "what went wrong for me" has to be rebuilt
  from the record.
  - [SRC] [TeamRetro, "AI retrospectives"](https://www.teamretro.com/blog/gather-feedback-from-ai-agents/)
    says agent self-reports are unreliable (*"the agent can't see all of its own mistakes"*). It also says
    a single entry is an anecdote; "roughly five entries" are needed before a pattern means anything.
- **Owner time is the scarce resource; agent time is cheap.** The agents prepare a measured evidence pack;
  the owner judges and decides. [DISK] The geoconflict retro worked this way: a measured "at a glance"
  table, then the owner's picks, and anything the session added marked *observation*.
- **Anchoring risk** [GK: anchoring]. If the agents show candidate items first, the owner may only pick
  from them. Ask one open question first, then show the candidates.
- **"Owned" means an fkit role plus the owner's approval**, not a person.
- **Owner frustration is strong evidence.** [DISK] The `asking-the-owner.md` convention exists because
  *"He gave up, left the dialog … This happened often."*
- **Keep the retro about process.** The owner is both the customer and the only human on the team, so
  product review and process review mix easily. Scrum keeps them apart: the Sprint Review covers the
  product, the Retrospective covers the process [SRC Scrum Guide].
- **Related tooling** [SRC]: [agent-retro](https://github.com/giannimassi/agent-retro) is a Claude Code
  skill that reads one session's transcript and proposes text changes, each approved separately. It
  works on one session; fkit's retro works on a sprint. Transcripts are excluded as evidence here
  (§3.1, E15).

### 2.6 Prior art on disk: what to keep and what to reject on purpose

- [DISK] **The 2026-08-29 six-week retro**
  ([`2026-08-29-retro-six-weeks-and-the-two-to-one-backlog-ratio.md`](2026-08-29-retro-six-weeks-and-the-two-to-one-backlog-ratio.md)).
  - **Keep:**
    - figures dated, with their method stated;
    - *"a later measurement belongs in a **new** report that cites this one"*;
    - corrections made in the report, and figures withdrawn when they cannot be reproduced;
    - the owner's agreement quoted verbatim.
  - **Reject:** its size, and hand-made git queries.
    - [DISK] The 2026-09-13 follow-up found the retro's W30 figure wrong: *"the script reports 52 created,
      the retro reported 152"*.
- [DISK] **The 2026-09-13 follow-up**
  ([`2026-09-13-does-the-backlog-converge-measuring-k.md`](2026-09-13-does-the-backlog-converge-measuring-k.md)).
  It shows a retro action carried out and then measured: *"executed the 2026-08-29 retro's own
  recommendation #3"*. It also shows the owner reframing the question partway through. So the follow-up
  step must let him change *what* is measured.
- [DISK, external data] **The geoconflict Sprint 8 retro, 2026-10-16.**
  - **Keep:** a "who said what" line; an "at a glance" table; evidence, then causes; owner picks kept
    apart from unpicked observations; an out-of-scope section.
  - **What it led to:** briefs `0522`–`0524` and a narrowed `0383`.
  - **What it lacked:** a follow-up of previous actions (it was a first retro) and any cap on proposals
    (4 proposals plus 5 observations).

---

## 3. Architect angle: evidence, home, and fit

Source for everything in this section:
[`2026-10-20-eval-sprint-retro-evidence-home-and-role-fit.md`](2026-10-20-eval-sprint-retro-evidence-home-and-role-fit.md).
Reliability ratings and judgements are the architect's.

### 3.1 Evidence: where each source lives, and whether it exists today

"Today" means the architect checked it on disk on 2026-10-20. The coder's computed/judged rating (§4.1)
is joined in the last column: **C** = computed, **S** = counted but fragile, **J** = judged, **F** = future.

| # | Evidence | Where it lives | Today or future | Reliability (architect) | Coder |
|---|---|---|---|---|---|
| E1 | Closed sprint board | `sprints/done/` or `sprints/cancelled/` | **Today**: 12 in `done/`, `cancelled/` empty | High for status (read via `dashboard.sh`); low for free text | C (FACTS counts); the table hides closed rows, so read the row links |
| E2 | Task briefs: status, owner rulings, correction notes | `tasks/{done,backlog,cancelled}/<id>/brief.md` | **Today** | High; rulings are quoted verbatim by convention | S (owner picks: located by a regex, counted by an agent) |
| E3 | Plan and worklog, incl. decision log | `<task>/plan.md`, `worklog.md` | **Today, partial** (exists only for loop-driven tasks) | Medium; a missing worklog means "no record", never "nothing happened" | S (decision-log counts misfire) |
| E4 | Review ledgers: rounds, verdicts, residuals, re-litigation rows | `<task>/review.md`; older ones in `sprints/reviews/` | **Today**: 195 | High; tabular | C for rounds and verdicts; S for residuals; J for re-litigation per the coder |
| E5 | Degraded runs: coverage line, ADR-054 Claude-only flag | `Coverage:` header in `review.md` | **Today, partial** | Medium; spelling drifts | C/S (rare: "Codex unavailable" in 3 ledgers, 5 worklogs) |
| E6 | Plan-review attempts (ADR-056, opt-in) | `<task>/plan-review.md` | **Today**: 13–14 folders | High but sparse; zero files does not mean zero problems | C |
| E7 | `NEEDS-DECISION` count and how long each waited | No home; the live relay is in chat | **Today, count partial; wait time does not exist** | Low; report as `unknown`, never 0 | J |
| E8 | Blocked runs, timeouts | `🚧` status text; worklog prose | **Today, partial** (an earlier block is overwritten at close) | Low–medium | J |
| E9 | Test and flake history (e.g. `0477`) | Narrative only; CI on GitHub | **Today, narrative only; CI is external** (`gh`, network, auth) | Low | C for CI if `gh` works, else `unknown`; J for flakes |
| E10 | Stale citations / broken links | No detector since the reference-integrity test was removed (ADR-057, `0529`) | **Not measurable today** | Judgement only | J |
| E11 | `throughput.mjs`: created vs closed, record-repair share | `claude/skills/fkit-status/throughput.mjs` | **Today**: ran 2026-10-20 | High as a trend; ISO weeks, not sprint windows; repair share is *"A PROXY, PERMANENTLY"* | C; no per-sprint window |
| E12 | Git history | `git log` | **Today**: 334 commits | Fine for dates, poor for meaning | C for dates; subjects mostly bulk ("Sprint push" ×60, "Tasks update" ×59, *checked* by the producer) |
| E13 | ADR-053 owner-involvement data | Would be a launcher log plus a worklog line | **Future**: ADR-053 is `proposed`; `0485`–`0491` are in backlog | Once built, deletable after about 30 days | F; report as `unknown`, never 0 |
| E14 | Prior retro reports (baselines, last retro's actions) | `knowledge-base/reports/` | **Today**: 2026-08-29, 2026-09-13 | High; written to be measured against | C |
| E15 | Owner session transcripts | `~/.claude/projects/…`, outside the repo | Exists locally; **excluded** | Private, per machine, may hold secrets | not used |

The cheapest gap to close, per the architect: the ship-loop's sprint roll-up (*"tasks shipped / blocked /
pending"*) is printed to the owner and then lost. Saving it would make E7 and E8 measured instead of
partial. **This is a candidate extra build brief, not part of `0500`.**

### 3.2 Where retro output lives

- **One dated report:** `ai-agents/knowledge-base/reports/YYYY-MM-DD-retro-sprint-<N>.md`. It links one way
  to the closed board in `sprints/done/` or `sprints/cancelled/`, whose path is terminal and so does not rot.
- **Nothing next to the board.** `dashboard.sh:24-29` reads the first line of every `*.md` beside a board,
  to catch two boards claiming one sprint. A `# Sprint 13 — retro` file there would read as a second
  Sprint 13 board.
- **No back-link added to the closed board.** Closed rows are *"frozen history and is NEVER touched"*
  (`fkit-sprint-done/SKILL.md`). And board text growth was geoconflict's top pain.
- **No wiki write.** `fkit-wiki` ingests later (ADR-005).

### 3.3 How action items become owner-approved briefs

- The retro produces **candidate briefs**, one line each: title, why, owning role, placement.
- The owner picks which to file, **in the session**. Unpicked candidates stay in the report as
  observations.
- Each placement states its **knock-on** (`conventions/placement-questions-state-the-knock-on.md`).
- **Only the producer can file** (`/fkit-task-brief` is producer-only, enforced by the hook). If the
  interview runs outside a producer session, the lead relays the picks **verbatim, with date and channel**,
  to a spawned producer. That path is proven: it filed `0500` itself and `0522`–`0524`.
- **Filed briefs are recorded in the report by task ID**, and each brief links back to the report. The next
  retro then reads those IDs' folders, which makes the follow-up mechanical.

### 3.4 Role-lock fit and the ADR-021 consequence

- **ADR-021 consequence:** the interview needs `AskUserQuestion`, which exists only in a **session**. No
  spawned role can interview the owner. Whoever owns the skill runs it in a session.
- **The lead's own rule:** *"never diagnose … Tripwire: a second file read in service of explaining a
  behaviour … stop there and hand off"* (`claude/agents/fkit-lead.md`). This was added 2026-10-09, after
  the lead wrote the 2026-08-29 retro by itself. **A lead that gathered its own retro evidence would now
  break that rule.**
- **Where sprints close today:** Sprints 10, 11 and 13 were closed *"by a spawned `fkit-producer` on the
  fkit lead's instruction, under an OWNER RULING given … in a live `fkit lead` session"*. So the owner is
  in a lead session when a sprint closes.
- **Option A, the producer owns `/fkit-retro`.** The lead's offer tells the owner to switch: *"leave this
  session and run `fkit producer`"*. One context reads and asks, so follow-up answers are best, briefs are
  filed directly, and there are the fewest moving parts. The cost is a session switch on every accepted
  retro.
- **Option B, the lead owns `/fkit-retro` (the architect recommends this).** The skill is session-only.
  1. A spawned producer measures the evidence and writes the measured half of the report.
  2. The lead interviews the owner.
  3. A spawned producer records his picks verbatim and files the briefs.

  This runs where the owner already is and keeps the lead a conductor. The cost is two spawns and a relay.
  A deeper "why?" from the owner costs another spawn.
- **Option C, both roles own it.** Rejected by the architect: two filing paths, and split responsibility.
- **An ADR is needed after the ruling.** Exactly one. It covers: the owning role and the ADR-021
  consequence; the lead's offer at sprint close as an amendment to ADR-031's lead remit; the output home;
  action items filed by the producer; the consuming-project hand-off; and "measured or judgement, absent
  reads `unknown`".

### 3.5 Trigger (architect view)

- The lead offers a retro **after it confirms that a `/fkit-sprint-done` or `/fkit-sprint-cancelled` close
  landed**.
- **Not** at the ship-loop's *"Sprint shipped"* state. That state means *"every eligible task CLOSED"*, and
  the board still needs its own close.
- Once, declinable, never repeated, never run automatically.
- **Enforced by the prose only.** Nothing can check that the lead offered, or that it did not force the
  retro.

---

## 4. Coder angle: tooling and feasibility

**Attribution.** A read-only consult with a spawned `fkit-coder`, 2026-10-20. What follows is **the lead's
relayed summary** of that consult, not the coder's own text. Where the producer re-checked a claim on disk,
it is marked *checked*.

### 4.1 What can be computed and what must be judged

- **Computed:**
  - `dashboard.sh` FACTS counts;
  - agent-closed markers;
  - start and end dates (coarse: from the banner and the board's first commit; older boards use a
    `🔒 CLOSED` banner);
  - `throughput.mjs` (ran: open 186, repair share 11.8%; it has no per-sprint window, and sprints overlap);
  - `plan-review.md` presence;
  - CI via `gh run list`, if `gh`, network and auth are present; otherwise `unknown`.
- **Counted but fragile:**
  - review residuals;
  - owner picks and how often he takes the recommended option (on Sprint 13, 3 of 4 "not Recommended"
    hits were false);
  - decision-log entries (an `awk` pass found 0 for `0529`, which has 7).
- **Judged:**
  - re-litigation ("suppress" and "re-litigate" are template words);
  - the `NEEDS-DECISION` count (word noise; the `.fkit/state` markers are empty and gitignored);
  - blocked runs, timeouts, flakes.
- **Future:** ADR-053 data.
- **Review-ledger figures (repo-wide):**
  - 195 ledgers, 186 with parseable rows;
  - rounds: 133×1, 31×2, 13×3, 7×4, 1×6, 1×8;
  - verdicts: 631 correct, 36 partly correct, 1 incorrect;
  - roughly 380 defects against 33 frontier moves.
- **Artefact coverage:** `plan.md` 171, `worklog.md` 178, `review.md` 195, of 530 task folders.
- **Git commit subjects are mostly useless.** *Checked:* "Sprint push" ×60, "Tasks update" ×59.

### 4.2 Helper script or not

- **What a helper would add:** reproducibility, and a method fixed in code.
- **What it would cost:** a new shipped executable (ADR-017), and a new test file that needs the owner's
  OK (ADR-057 §D2.1).
- **Coder recommendation: v1 with no helper.** Use `dashboard.sh`, `throughput.mjs`, and stated `grep -c`
  lines. Print each number with its command. Write `unknown`, never 0. Revisit after the trial.

### 4.3 Build size and testing (estimate)

- **Size:**
  - the skill: about 150–300 lines (`fkit-open-questions-interview` is 108);
  - one word in `skills_for_role()`, plus the 6 mirrors listed in that file's header, plus the owning
    agent prompt's skill list;
  - install needs no change (glob copy);
  - the lead's offer is prose only and cannot be tested (a `PostToolUse` hook could test it, but was
    judged too heavy);
  - about 10–12 files and **one build task**, plus one more if a helper is ruled in.
- **Testing:**
  - The ADR-057 conflict from §0.2: drop the skill-text tests, and let the owner's trial check the wording.
  - The only required test edit is the matrix row in `test/skill-ownership-hook.test.js` (OWNED and
    UNIVERSE).
  - **A gap that already exists:** `fkit-sprint-ship-loop` is missing from that mirror. *Checked:* the
    test's own comment says *"pre-existing gap, not this task's to close"*.

---

## 5. The AI-first adaptation (brief §2), combined

All three angles agree on what follows.

1. **The agents' signals come from the record, never from recall.** They are the rows in §3.1, each with
   its method:
   - re-litigated findings and review rounds (E4);
   - degraded runs (E5);
   - plan attempts (E6);
   - `NEEDS-DECISION` items and blocked runs (E7, E8: partial or `unknown` today);
   - briefs the owner had to correct (E2, E11 proxy);
   - stale citations (E10: judgement only).
2. **Every claim carries one of three labels:** *measured (method)*, *judgement*, or *unknown*. Absent data
   reads `unknown`, never 0. ADR-053 data reads `unknown` until it exists.
3. **The owner is the only voice that rules.** Agent items are *observations* until he picks them (the
   geoconflict pattern).
4. **Order of the interview:**
   1. Previous actions, with their status **computed** from disk by task ID.
   2. One open question.
   3. Candidates for what went well, what hurt, and what we change, drawn from the evidence.
   4. At most 3 candidate briefs, each with its knock-on, approved before anything is filed.
   5. Close with one "was this worth your time?" question [GK: ROTI, return on time invested]. Its answers
      feed the trial log.

   [Not verified] `AskUserQuestion` holds at most 4 options, so candidates may need batched questions; the
   build should check whether multi-select is available.

---

## 6. Where the angles agree and where they disagree

**They agree** (no owner question needed unless he objects):
- the output home and its name;
- no edit to the closed board;
- no wiki write;
- action items become candidate briefs, owner-picked, filed by a producer, recorded by task ID;
- previous actions are followed up first, computed from disk;
- the trigger is one declinable offer after a verified sprint close (done or cancelled), never at "Sprint
  shipped", never automatic, and a decline writes nothing (the architect's Q3, the producer agrees);
- one ADR after the ruling;
- "Explain more" is settled;
- session transcripts are excluded.

**Disagreement 1: one form, or a short form plus a full form.**
- The producer leaned toward a short retro every sprint and a full one on request.
- The architect cites `one-skill-one-output.md`: *"never select … partial/full modes"*, and *"'delta unless
  much has changed' is the same defect"*.
- **How it is resolved:** one form, one output shape. **The subject is the input:** by default the sprint
  just closed, or optionally *every sprint since the last retro*.
  - The convention's own litmus test: *"does the argument change what the skill works on, or what the same
    work looks like when reported? The first is a parameter."* A span of sprints is a different subject,
    not a different output shape, so it is allowed.
  - A span naturally carries more evidence, which gives most of what the "full form" was for, with no
    second shape.
- The owner can still choose two forms. That needs his ruling through the convention's escape hatch, at
  proposal time (Q2).

**Disagreement 2: who owns it.**
- The architect recommends B (the lead).
- The producer agrees: the owner channel and the trigger both sit in the lead session, and the filing path
  is proven.
- The coder took no position.
- It is still the owner's call, because A gives a better interview (Q1).

---

## 7. Feedback from a consuming project to fkit (the brief's 2026-10-16 question)

- **Producer and architect agree:**
  - The retro tags each finding *for this project* or *for fkit*. The owner confirms the tags.
  - In the fkit repo itself the tag is skipped, because there the project is fkit.
  - The fkit half reaches fkit **by hand**: the owner carries it to a `fkit lead` session in the fkit repo.
  - On the fkit side, a spawned producer copies the file verbatim as `source-report.md` (the existing
    intake pattern, e.g. `0506`) and files the picked briefs.
  - **No automatic cross-repo write and no auto-filed issue.** A project's agents should not write outside
    their project. The fkit repo is public, inferred by the architect from `install.sh`. And an issue would
    need credentials.
- **Coder:** tagging costs nothing; how the feedback is delivered is a product decision.
- **One open point.** The architect wants a **separate** `…-fkit-feedback.md` file, written safe to make
  public. The producer leaned toward a section in the same report. **The producer now sides with the
  separate file:** the file is what crosses into a public repo, and the full project retro should not
  travel with it. Put to the owner in Q4.

---

## 8. After the ruling (brief §4): what the producer files

These are not filed now. The expected decomposition, to be confirmed against the ruling:
1. **Build `/fkit-retro`**, with its `skills_for_role()` entry and the hook-test mirror row. The lead's
   offer goes in the same brief if the lead owns the skill. No skill-text tests if Q3 rules that way.
2. **Record the ADR** (architect, `/fkit-record-decision`). This may come first, as the build's dependency.
3. **Owner trial and feedback round:** a producer-kept trial log, the `0474` pattern.
   - **A candidate first trial:** Sprint 13. Its banner reads *"Done — 2026-10-20"*.
4. **Optional, put to the owner when filing:** save the ship-loop's sprint roll-up (architect's Q4), which
   would make E7 and E8 measured.

---

## 9. Recommendation

**Build one retro skill, `/fkit-retro`, owned by the lead (Option B), with one timeboxed form. Its subject
is the sprint just closed, or every sprint since the last retro.**

- **How it runs:**
  1. A spawned producer measures the evidence in §3.1, printing each number with its command and writing
     `unknown` where data is absent.
  2. The lead runs the owner interview in the order of §5: previous actions first; the three prompts
     *went well, hurt, change*; at most 3 candidate briefs.
  3. A spawned producer records the owner's picks verbatim and files them with `/fkit-task-brief`.
- **Output:** one report, `reports/YYYY-MM-DD-retro-sprint-<N>.md`, linking to the closed board. For a
  consuming project, a separate hand-carried `…-fkit-feedback.md`.
- **The offer:** the lead offers the retro once, after a verified sprint close. It is declinable.
- **v1 build:** no helper script, and no skill-text tests (ADR-057). The owner's trial checks the wording.
  One ADR after the ruling.

**Main trade-off:**
- **Cost:** relay and spawn overhead, and shallower answers when the owner asks "why?" beyond the measured
  report, because the lead must spawn again instead of answering from its own reading.
- **What it buys:** the retro starts where the owner already is, with a one-word yes, and the lead stays
  within its never-diagnose rule.
- **If he would happily switch to a `fkit producer` session, Option A is simpler and gives the better
  interview.**

---

## 10. Questions for the owner

At most 3 options each, with the recommended option first. The relayer adds *"Explain more, then ask
again"* as the 4th. None of these places a task in a sprint, so each knock-on is *none (checked)*.

**Q1. Who runs the retro?**
- **Context:** the retro interview can only happen in a session you are in. Today you are in the lead
  session when a sprint closes.
  - If the lead owns the retro, you answer "yes" to its offer and it starts there. Behind the scenes it
    hands the reading and the filing to producers.
  - If the producer owns it, accepting means leaving the lead session and opening `fkit producer`. One
    agent then reads the evidence and asks you everything, so its follow-up answers are better.
- **Options:**
  1. **Lead runs it (Recommended).** You stay where you are; producers do the reading and filing behind
     the scenes. Your deeper "why?" questions take an extra step. Knock-on: none (checked).
  2. **Producer runs it.** You switch to a producer session for each retro. Fewest moving parts and the
     best follow-up answers. Knock-on: none (checked).

**Q2. One form, or two?**
- **Context:** a fkit rule from 2026-07-17 says a skill has one output, never short and full modes. The
  retro can still look at more than one sprint: you say "just this sprint" or "everything since the last
  retro", and the shape stays the same. Two forms are possible only if you grant an exception to that
  rule.
- **Options:**
  1. **One form, about 10 minutes of your time; it covers the sprint just closed, or every sprint since
     the last retro (Recommended).** Follows the rule; a longer span simply has more evidence. Knock-on:
     none (checked).
  2. **Two forms: a short one every sprint, a full one when you ask.** Needs your exception to the
     one-output rule; two shapes to build and trial. Knock-on: none (checked).

**Q3. Drop the skill-text tests and the helper script for v1?**
- **Context:** the brief promised tests that pin the skill's wording. Since then you accepted ADR-057
  (2026-10-19), which retires such tests and needs your OK for any new test file. A helper script that
  counts the evidence would also need a new test file.
  - Without either, the skill uses the counting tools fkit already ships, and shows each number with the
    command that produced it. Your trial checks the wording.
  - One small existing test still gets updated: the list of who owns which skill.
- **Options:**
  1. **Drop both for v1; your trial checks the wording (Recommended).** Smallest build, follows ADR-057.
     Revisit a helper after the trial. Knock-on: none (checked).
  2. **Add a helper script in v1 (with its new test file).** More reproducible numbers, a bigger build and
     a new test file you approve now. Knock-on: none (checked).

**Q4. In another project, how does feedback about fkit itself reach fkit?**
- **Context:** the geoconflict retro reached fkit only because you pointed a fkit session at the file. The
  proposal is that the retro marks each finding "for this project" or "for fkit". The fkit part goes into
  its own small file, written safe to be public, because the fkit repo is public. You carry that file
  over. Nothing is sent automatically, and the project's full retro never leaves the project.
- **Options:**
  1. **Separate fkit-feedback file, you carry it over (Recommended).** Only the fkit part travels, safe to
     make public; fkit files briefs from it the usual way. Knock-on: none (checked).
  2. **One report with an fkit section, you carry it over.** One file, but the whole project retro travels
     with it, so you must strip private detail by hand. Knock-on: none (checked).
  3. **No tagging; you relay fkit points by hand, as now.** Nothing new to build; easy to lose points.
     Knock-on: none (checked).

---

## Sources

**External**, with the producer's Derby & Larsen citations reached through summaries:
- Scrum Guide 2020 — https://scrumguides.org/scrum-guide.html
- Derby & Larsen, *Agile Retrospectives* (2006), via
  https://agile.appliedframeworks.com/applied-frameworks-agile-blog/agile-retrospective-framework-in-five-steps
  and https://cprime.com/?p=18348
- Retromat — https://retromat.org/blog/category/facilitation/page/2/
- Kerth's Prime Directive, via Fowler — https://www.martinfowler.com/bliki/PrimingPrimeDirective.html
- Google SRE book, ch. 15 — https://sre.google/sre-book/postmortem-culture/
- 4Ls — https://www.ebgconsulting.com/?p=993
- Speedboat — https://agilealliance.org/?p=780 ; https://www.mountaingoatsoftware.com/reviews/innovation-games
- Mad/Sad/Glad, Starfish, Plus/Delta — https://creately.com/guides/mad-sad-glad-alternatives/ ;
  https://site.draft.io/mad-sad-glad-retrospective/
- Action items — https://www.easyagile.com/blog/improve-sprint-retrospective-action-items ;
  https://kollabe.com/posts/retrospective-action-items ;
  https://www.scrum.org/resources/blog/ditch-unfinished-action-items (search summary only)
- Cadence — https://www.mountaingoatsoftware.com/blog/does-a-scrum-team-need-a-retrospective-every-sprint ;
  https://www.parabol.co/blog/how-often-to-run-retrospectives ;
  https://goretro.ai/post/how-long-between-sprint-retrospectives
- Solo retros — https://hackernoon.com/personal-retrospectives-for-developers-e5d86813d65a
- Retros with AI agents — https://www.teamretro.com/blog/gather-feedback-from-ai-agents/ ;
  https://github.com/giannimassi/agent-retro (README only)

**On disk:**
- `0500` brief
- [`2026-10-20-eval-sprint-retro-evidence-home-and-role-fit.md`](2026-10-20-eval-sprint-retro-evidence-home-and-role-fit.md) (architect)
- [`2026-08-29-retro-six-weeks-and-the-two-to-one-backlog-ratio.md`](2026-08-29-retro-six-weeks-and-the-two-to-one-backlog-ratio.md)
- [`2026-09-13-does-the-backlog-converge-measuring-k.md`](2026-09-13-does-the-backlog-converge-measuring-k.md)
- geoconflict `reports/2026-10-16-sprint-8-retro-fkit-feedback.md` (external data)
- `conventions/asking-the-owner.md`, `conventions/one-skill-one-output.md`,
  `conventions/evidence-before-assertion.md`, `conventions/placement-questions-state-the-knock-on.md`
- ADR-021, ADR-031, ADR-053, ADR-054, ADR-057
- `claude/agents/fkit-lead.md`, `claude/skills-for-role.sh`,
  `claude/skills/fkit-sprint-ship-loop/SKILL.md`, `test/skill-ownership-hook.test.js`
- line-3 banners of `ai-agents/sprints/done/*.md`
