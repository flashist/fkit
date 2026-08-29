# Six-week retrospective — process health, and the two-to-one backlog ratio

**Read-only assessment, 2026-08-29.** Written by the `fkit-lead` in a live session, at the owner's
request (*"can you make some sort of retro for our recent work in general … one specific question I am
interested very much in is the big amount of tasks in the backlog"*). Covers **2026-07-20 → 2026-08-29**,
six weeks, Sprints 1–6. No brief, board, skill, test or vault file was touched; this report and its
published HTML twin are the only artifacts.

**This report exists to be measured against.** The owner's stated intent after reading it: *"when it's
implemented and released, I will keep an eye on the further work and we will be able to measure whether
the situation is improved or not."* Every figure below is therefore a **baseline**, dated and with its
method stated, so a later count can be compared to it honestly. Do not silently update the numbers in
place — a later measurement belongs in a **new** report that cites this one.

Published HTML version: `https://claude.ai/code/artifact/fa1f20e3-7878-4a11-8ec9-1cb33669d3c4`
(private artifact; same content, no additional findings).

---

## Headline

**The project files roughly two tasks for every one it closes, and has done so every week measured.**

| Measure | Count |
| --- | --- |
| Tasks ever filed | **351** |
| Closed (`done/`) | **210** |
| Cancelled | **12** |
| Open | **129** |
| Scheduled | **1** (`0347`, Sprint 7, unranked) |
| Created per closed, weeks 31–35 | **1.99** |

`351 − 210 − 12 = 129` ✓. Open rows are **all** `🔲 Backlog` — zero `🔄 In progress`, zero `🚧 Blocked`.

### Created against closed, by week

| Week | Created | Closed | Net |
| --- | --- | --- | --- |
| 2026-W30 | 152 | 111 | +41 |
| 2026-W31 | 37 | 20 | +17 |
| 2026-W32 | 69 | 27 | +42 |
| 2026-W33 | 48 | 30 | +18 |
| 2026-W34 | 17 | 8 | +9 |
| 2026-W35 | 28 | 14 | +14 |
| **Total** | **351** | **210** | **+141** |

`+141` net = 129 open + 12 cancelled ✓.

⚠️ **W30 is the project bootstrap and must not anchor any conclusion.** Sprint 2 alone closed 138 tasks,
many bulk-filed and bulk-closed; it flatters both columns. **The honest steady state is weeks 31–35:
199 created, 100 closed → 1.99:1.** W35 runs to 2026-08-29, so it is very nearly a full week.

The ratio is **not a recent regression.** It holds at roughly two-to-one in every week measured, across
three different sprint cadences. Throughput fell hard (111 closes in W30 against 14 in W35) but filing
fell with it and the proportion did not move.

### Method, and where it is soft

Every task folder in `ai-agents/tasks/{backlog,done,cancelled}/` was dated by **the first commit that
added its `brief.md`**, via `git log --diff-filter=A --name-only -- 'ai-agents/tasks/*/brief.md'`, taking
the earliest date per four-digit ID. Closure dates come from the first commit at the `done/` path.

⚠️ **"Created" means *first committed*, not *first written*.** A batch of briefs written over two days and
committed together lands on one date. The weekly shape is directionally sound; individual weeks are
±a few. **Any future comparison must use the same method or state its own.**

---

## Composition of the 129 open rows

Clustered by what the briefs are *for*, not by ID adjacency. Cluster counts were produced by a spawned
producer's read of all 129 briefs on 2026-08-29 and reconcile to 129.

| Group | Rows | Verdict |
| --- | --- | --- |
| **Repairing our own records** — dated correction notes, stale-citation / self-locator sweeps | **42 (33%)** | **Self-generated rework.** Exists because a previous task moved a file and rotted a pointer. |
| **Process machinery** — sprint lifecycle, ship-loop mechanics, skill routing, conventions, board tooling | ~42 | Legitimately the product, for a product that *is* a process. |
| **Genuine engineering** — init/launcher hardening, guards & test infrastructure, wiki mechanism, open architecture decisions | ~50 | The work. |

⚠️ **Correction, 2026-08-29, same day.** The first draft of this report put record repair at **37 (29%)**,
from a producer's thematic read. A second producer re-derived it by a **stated, reproducible rule** — folder
title begins `correct|repair|append|sweep|re-sweep|clean|resolve|refresh|reconcile|discharge|wiki-resync|gloss|triage`
— and got **42 (33%)**, with two arguable members (`0215`, `0251`) giving a floor of **40 (31%)**. The
original figure **understated** the problem. **Use 42 / 33%, and use the rule, not the theme** — a future
comparison needs a rule it can re-run.

⛔ **A figure withdrawn.** The first draft claimed *"~61% of open work is process machinery + record
repair."* A second producer **could not reproduce it with any rule it would defend**, because *"process
machinery" has no reproducible definition in this repo*. **That figure is withdrawn and must not be used as
a baseline.** Its withdrawal is itself evidence for the recommendation below that the machinery/product
split is a decision to be made, not a quantity to be measured.

By owner: coder 74 · architect 31 · producer 14 · wiki 6 · reviewer 4.

**Disk and boards reconcile exactly** — 129 folders, 129 open rows, no orphan brief, no phantom row.

### The verdict on task creation, split

- ✅ **Discovery filing is the system working.** Sprint 6's review found a coverage rule that would have
  silently withheld **every** close, and a race in `bin/release.mjs` between reading HEAD's name and
  acting on HEAD ~6 minutes later. Neither was in any brief. Both became tasks. That filing is the
  **return on the review**, not overhead.
- ⛔ **Bookkeeping debt is not.** A third of the queue is bookkeeping about bookkeeping. Move a task folder
  and every document citing it needs a repair task; land a correction and closed ledgers need dated
  notes — each filed as a full brief with a plan, an owner, a review and a close, for what is often a
  three-line edit.

**So the count going up is fine. The composition is not.**

---

## What is working

- **The separation of contexts holds.** Reviewers overturned their own findings twice in Sprint 6 when
  evidence went against them. Spawned workers corrected the lead's briefings repeatedly — a producer
  found the lead's task list wrong in both directions; a wiki worker found 3 of 10 reported defects were
  not defects, and one affected file nobody had listed. A single-context agent does not do that to itself.
- **The gates are real.** 792 tests passing, and **28 of 28 mutations proven to redden a *named*
  assertion**, so a test cannot quietly stop testing. Both historical CI failures (2026-08-12,
  2026-08-21) were traced to root cause this week and confirmed fixed, verified green on today's HEAD.
- **The records stay honest under pressure.** Every agent close carries
  `(agent-closed — not owner-verified)`. Archives get dated notes rather than edits. A producer declined
  to open Sprint 7's scope on its own authority because the owner's ruling named a row's *placement*,
  not a board's *contents*.

⚠️ **The counterweight: fix-induced regressions.** On task `0270`, **six of seventeen** review findings
were defects introduced by the coder's own earlier fixes. Review rounds partly generate their own next
round. Manageable, and managed — but it is why a 21-task sprint took two weeks where W30 closed 111.

---

## Where the process leaked (2026-08-29 session)

1. **Ordering error by the lead.** A full wiki sync ran, then Sprint 6 was archived an hour later —
   immediately staling ten vault pages and costing a second worker to repair. Repo change should have
   preceded the sync.
2. **The lead briefed workers from stale memory twice** — told a wiki worker the tree was uncommitted
   when it had been committed, and handed a producer a task list wrong in both directions. Both workers
   measured instead of trusting the prompt, which is the only reason it cost nothing.
3. **Nothing detects citation rot.** ⭐ Measured after this report's first draft: **248 of 3,600 relative
   markdown links in the repo do not resolve on disk**, across 96 files — including **12 in shipped
   product** under `claude/`, which reach every consuming project. A link checker has been deferred by
   name three times (`0050`, `0076`, `0103`) and never filed. Stale line-number and path citations have been caught **three
   separate times** by a lint or sync *noticing* them — never by a test. That is why 18 repair rows exist.

---

## Recommended changes — all five agreed by the owner, 2026-08-29

Ranked by how much backlog each **permanently removes**, not by effort. Owner's reply, verbatim:
*"I agree with all your points from the 'What I would change, in order' list. Let's implement them
first, let's plan the next sprint specifically about it, then, when it's implemented and released, I
will keep an eye on the further work and we will be able to measure whether the situation is improved
or not."*

1. **Build the guard that kills the citation-rot class.** A CI/test check validating every markdown link
   and every `path:line` citation against disk. The `durable-citation-anchors` convention already exists
   and nothing enforces it. *Removes a recurring class.*
2. **Add a lane for work too small to deserve a brief.** Small in-flight fixes route to the **review
   ledger** instead of a new task folder, under a hard size limit, with the reviewer's note as the
   record. *Stops the inflow.*
3. **Batch the 37 into ~3 sweeps** — ⛔ **after** the guard exists, so the sweep is verified not trusted.
   *−34 rows, consolidation not deletion.*
4. **Rank the board, or admit it is an archive.** 128 rows at priority `—` is not a backlog; nothing in
   it is next, so nothing in it starts. ⚠️ **Ranking is free only until Sprint 7's first row closes** —
   ADR-035 walls it after that.
5. **Decide how much of the project is about itself.** ~61% of open work is machinery + record repair.
   A high number may be correct here — but it arrived by **drift, not choice**.

---

## Baseline for the future comparison

To judge whether this improved, re-measure **with the same method** and compare against these:

| Baseline (2026-08-29) | Value |
| --- | --- |
| Created per closed, trailing 5 weeks | **2.01** |
| Open tasks | **129** |
| Self-generated rework rows | **42 (33% of open)**, by the stated title rule; floor 40 |
| Broken relative markdown links, repo-wide | **248** across 96 files — **68 in ~24 files** after the frozen-ledger and wiki-vault exemptions |
| Broken links in shipped product (`claude/`) | **12** |
| Open rows at priority `—` | **128** |
| Recurring classes with no automated detection | citation rot (**3** manual catches to date) |

**The target is not "fewer open tasks."** A backlog can shrink by cancelling real work. The measures that
matter are **the ratio** and **the rework share** — if the guard and the small-work lane do what they are
meant to, the 33% falls and the 1.99 approaches 1. If open count falls while the rework share holds,
nothing was fixed.
