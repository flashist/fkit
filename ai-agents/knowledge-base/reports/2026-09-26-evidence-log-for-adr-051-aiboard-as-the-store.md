# Evidence log — should aiboard become fkit's one store for tasks? (ADR-051, destination B)

**Started:** 2026-09-26
**Kind:** evidence log — **append-only**, one dated entry per finding. Not a recommendation.
**Written by:** `fkit-architect`, at `fkit-lead`'s direction, on the owner's request (quoted below).
**For:** the owner, at the moment he makes the final fkit↔aiboard store decision.

---

## ⛔ Read first — what this document is NOT

1. **This is EVIDENCE, not a decision.** Each entry records something seen and which way it leans.
   Nothing here decides anything. The direction column is not a vote and the entries are not a score.
2. **This is NOT trial progress under ADR-051's gate.** The gate's trial counts real work on
   **fkit's own tree** and **starts at P1** (aiboard's Node port landing). P1 has not landed, so
   **zero** weeks, sprints and status changes have accrued toward it. Everything below happened on a
   *different* project, before the trial clock exists. None of it counts toward any gate bar.
3. **ADR-051 is still the authoritative text of the gate, and this report does not change it.** No
   precondition (P1–P6), acceptance test (A1–A2), trial bar or fail condition (F1–F5) moves because of
   anything written here. If this log and ADR-051 ever seem to disagree, ADR-051 wins.
4. **This log is not a review point, a check-in or a reminder.** ADR-051 §Amendment 9 forbids any agent
   from adding one to the trial. This file just waits to be read when the owner chooses to read it.

**Related documents:**
- [ADR-051 — one store for tasks; aiboard is the gated destination; the read-only reader is the interim](../decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md) — the decision and the gate.
- [Sprint 11 board](../../sprints/sprint-11.md) — the convergence sprint (a planning summary of the gate, not the gate).
- [2026-09-18 — the two data models, laid out for an external expert](2026-09-18-fkit-aiboard-data-model-evaluation-for-an-external-expert.md)
- [2026-09-18 — the external expert's verdict](2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md) (its endpoint was overridden by ADR-051; its file is unchanged).

---

## Why this log exists — the owner's words

Typed by the owner on 2026-09-26 in a lead session, relayed verbatim (the `[...]` elision is the
relaying agent's):

> *"I feel like it's the second argument in favor of moving moving work with tasks into the AI board.
> Logic. And use it as a dependency for fkit. But it's not a final decision, but it's definitely one in
> favor of it, right? [...] you need to save information about it somewhere just to make sure that we
> don't lose it. And that, when needed we can analyze all the reports that we have and make the final
> decision based on them."*

Plain meaning: keep the findings in one place so none are lost, and read them all together when the
final decision is made.

---

## Summary so far

| # | Date seen | What | Leans |
|---|---|---|---|
| [E1](#e1--timestamps-on-each-worklog-entry-and-comment) | 2026-09-23..26 | aiboard stamps every worklog entry and comment with time and author; fkit's worklog is one free-text file with day-level dates at best, and fkit has no comments | **For B** |
| [E2](#e2--a-history-of-who-changed-what-and-when) | 2026-09-23..26 | aiboard writes a timed, signed line for every status change, assignment, block and unblock; fkit keeps no such record | **For B** |
| [E3](#e3--the-read-only-board-in-real-use-on-a-sibling-project) | 2026-09-23..26 | The owner found the read-only board "very useful" on a busy sibling project, and keeps using it; getting there needed four fixes | **For A-now's value; mixed for B** |

"B" = aiboard as the single store (ADR-051's gated destination). "A" = fkit's tree stays the store,
read by a read-only board (ADR-051's interim, running now).

---

## Entries

### E1 — Timestamps on each worklog entry and comment

- **Recorded:** 2026-09-26 · **Observed:** 2026-09-23..26, lead session, while the owner used fkit's
  read-only board (`bin/fkit-board.mjs --root`, tasks 0412 and 0415) on a sibling fkit-using project.
- **Leans:** **for B.**

**What was seen.**
- **aiboard:** a worklog entry and a comment are both structured records, each with a **timestamp**
  (ISO, UTC, to the second) and an **author**. Written to disk as a heading `## <timestamp> — <author>`.
- **fkit:** `worklog.md` is free text. Headings are usually dated to the **day**, almost never to the
  time of day. fkit tasks have **no comments** at all.
- **The read-only reader** therefore shows a whole fkit `worklog.md` as **one** entry with an empty
  timestamp, and the comments list is always empty.

**Owner ruling tied to this entry:** he chose **not** to build per-entry timestamps into fkit now,
because aiboard already has them — building them in fkit would be wasted work if B happens.

**Evidence / where verified.**
- aiboard (read at its commit `df554b9`): the `WorklogEntry` record with `timestamp` and `author` —
  `aiboard/model.py:190`; the heading format — `aiboard/model.py:222-223`; comments use the same
  record type — `aiboard/model.py:236`; the time source (UTC, seconds, `Z`) — `aiboard/model.py:43-44`.
- fkit reader: one entry, empty timestamp, author `worklog.md`, comments `[]` —
  `bin/fkit-board.mjs:489-495`. No `comments.md` exists anywhere under `ai-agents/tasks/` (checked
  2026-09-26: 0 files).
- Heading counts, **measured by the lead** earlier on 2026-09-26. **The lead's counting rule**, per
  `worklog.md` under `ai-agents/tasks/*/*/`: **"dated"** = at least one heading line matching
  `^#{2,3} .*[0-9]{4}-[0-9]{2}-[0-9]{2}` (`grep -E`; H2/H3 only; date anywhere in the heading);
  **"timed"** = the number of H2/H3 heading lines containing `[0-9]{2}:[0-9]{2}`.

  | Project | Worklogs with dated headings | Headings with a time of day |
  |---|---|---|
  | fkit | 83 of 141 | 4 |
  | the sibling project | 58 of 70 | 2 |
  | a third fkit-using project | 5 of 8 | 0 |

- **Architect's recount, fkit only, 2026-09-26, with a looser rule** (any heading line containing a
  `YYYY-MM-DD` date; a time = the same heading also containing `H:MM`): **99 of 142** worklogs dated,
  **2** timed headings. ⚠️ **The figures differ from the lead's** — different counting rule (any
  heading level, and `H:MM` only in a heading that also has a date), and one more worklog exists now.
  The direction is the same under both: dates are common, times are rare.
  Re-running **the lead's rule** on fkit later the same day gave **84 of 142** dated and **4** timed —
  consistent with the lead's 83 of 141 plus the one worklog added since.

**Caveats.**
- aiboard's `author` is whatever string the caller passes (the default is `"aiboard"` —
  `aiboard/store.py:382`). A timestamp is exact; the author is only as good as the caller.
- This is aiboard's **Python** code. ADR-051 P1 makes the **Node port** the thing that would actually
  be adopted; this feature matters only if the port keeps it.
- If B is never taken, fkit still lacks this. The owner's deferral assumed B might happen; under an
  "A forever" outcome the question of building it in fkit comes back.

---

### E2 — A history of who changed what, and when

- **Recorded:** 2026-09-26 · **Observed:** 2026-09-23..26, same session and context as E1.
- **Leans:** **for B.**

**What was seen.** The owner asked for a Jira-style activity history: when did a task's status
change, and who changed it.
- **aiboard:** every status change, assignment, block and unblock **automatically adds a timed,
  signed worklog entry** (for example: ``Status changed `backlog` → `in-progress`.``). It is one mixed
  timeline inside the worklog — not a separate "Activity" tab.
- **fkit:** a status change is a folder move plus a field edit (and a board-row edit). No timed record
  of the change is kept. Git history is not a substitute: it records **commit** time, and commits are
  batched (12 of fkit's last 15 commits are titled "Sprint push"), so one commit can hold many changes
  made at different times.

**Evidence / where verified.**
- aiboard: `move_task` writes the status line — `aiboard/store.py:382`, `aiboard/store.py:397-400`;
  block / unblock — `aiboard/store.py:424-444`; assignment — `aiboard/store.py:465-477`; the shared
  append helper stamping `now_iso()` — `aiboard/store.py:499-504`. A test pins the status-change
  entry — `tests/test_board.py:314` (aiboard repo).
- fkit: the task mover moves the folder with `git mv` (`claude/skills/fkit-task-done/SKILL.md:125`);
  a search of that skill found no step that appends a dated line to the worklog.
- **How verified:** the lead read aiboard's source; the architect re-read the same lines on
  2026-09-26. ⚠️ **Nobody exercised aiboard's UI** to see the timeline rendered.

**Caveats.**
- **Only changes made through aiboard are logged.** A hand edit to a task file bypasses it and leaves
  no entry. Under B that is the same gap fkit has today, just smaller.
- Same Python-vs-Node-port caveat as E1.

---

### E3 — The read-only board in real use on a sibling project

- **Recorded:** 2026-09-26 · **Observed:** 2026-09-23..26, same session and context as E1.
- **Leans:** **supports the value of A-now; mixed for B.**

**What was seen.** The owner used the read-only board on a fast-moving sibling project with a large
sprint, found it **"very useful"** (his word), and chose to keep using it as a temporary solution.

Friction met on the way — each one fixed or filed in fkit:

| Friction | Status |
|---|---|
| The reader could only serve fkit's own `ai-agents/` tree | Fixed — `--root` flag, [task 0412](../../tasks/done/0412-let-the-read-only-board-reader-serve-another-projects-ai-agents-tree-root-flag/brief.md) |
| The sibling project's installed fkit copy was stale (v0.2.2, dashboard v1); its sprint banners predated the sprint-status vocabulary | Observed; not an fkit code defect |
| Archived boards named `plan-sprint-N.md` lost their tasks on the board | Fixed — [task 0415](../../tasks/done/0415-keep-a-closed-sprints-tasks-attached-when-its-board-is-named-plan-sprint-n/brief.md) |
| The reader's snapshot cache does not notice renamed task folders | **Open** — [task 0413](../../tasks/backlog/0413-make-the-board-readers-snapshot-cache-notice-renames/brief.md) |

**Why "mixed" for B.**
- **Toward B:** it shows a board is genuinely wanted for real work. And it shows the running cost of A:
  a reader over fkit's files has to keep up with every project's tree, fkit version and naming
  convention, through adapters, and each drift surfaces as a fix.
- **Not toward B (architect's reading, not the lead's):** the same drift — stale installs, old banner
  formats, old board names — is exactly what a migration into aiboard would also have to handle, once
  per project. The variety does not go away under B; it moves into the import.

**Evidence / where verified.** The owner's words and choice: lead session, relayed by `fkit-lead`.
The friction items: the three linked task files.

**Caveats.**
- This is one project, a few days, and one user's judgement.
- ⛔ **It is not trial evidence.** It is not fkit's own tree and the trial has not started (see *Read
  first*, item 2).

---

## Open questions (for the owner, at decision time)

1. ~~Which observation the owner counted as "the first" argument, and whether E1 and E2 are one
   argument or two.~~ **Answered 2026-09-26 by `fkit-lead` — from the order of the conversation,
   NOT an owner ruling:** E1 was raised first. On it the owner concluded *"if it's part of the logic
   that AI board already have ... we don't need to re-implement it on the F-Kit level"* (relayed by
   the lead; `...` is the lead's elision). E2 came next, and he then called it *"the second argument
   in favor"*. **So E1 = first, E2 = second: two arguments, not one.** ⚠️ **E3 was added by the lead;
   the owner did not name it as an argument.** This is the lead's reading; the owner can correct it.
2. Would aiboard's Node port (ADR-051 P1) keep the timed/signed worklog and the automatic status
   lines? That is aiboard's work on aiboard's board; fkit can only check it once the port exists.

---

## How to add an entry

1. **Append** a new `### E<next number> — <short title>` at the end of *Entries*. Never rewrite or
   delete an earlier entry; if one turns out wrong, add a dated correction note under it.
2. Give it the same parts: **Recorded** date, **Observed** date and context, **Leans** (for B /
   against B / for A / mixed), **What was seen**, **Evidence / where verified** (file and line, a
   measurement, or the owner's own words — and who verified it), **Caveats**.
3. Add one row to *Summary so far*.
4. Keep the owner's own words separate from option text an agent wrote, and say which is which.
5. Name no machine paths, secrets or other projects' private details — "a sibling fkit-using project"
   is enough.
6. **Do not** count anything here as trial progress, and do not add deadlines or check-ins (ADR-051
   §Amendment 9). A finding that would change the gate itself goes to the owner as a question, not
   into this log.
