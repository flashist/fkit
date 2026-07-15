---
name: fkit-status
description: Answer "what's the status?" the way a producer would — read the live sprint plan and task briefs, reconcile any drift between them, and deliver a seven-beat briefing that ends in the task dashboard. Takes an optional sprint name as its argument (e.g. "Sprint 1"); empty means the active sprint. Read-only — it reports, it never changes a status, moves a file, or edits a plan.
---

# Status

> ## ⛔ Owner: the **producer**
> This is the fkit-producer's own procedure. Execute it **only** if you are the producer — running as the
> `fkit-producer` agent or in a `fkit producer` session.
>
> **Any other role: do not execute this.** Ask instead:
> ```
> @fkit-producer What's the status?
> ```


Answer *"what's the status?"* — grounded in the files, in the conventional shape this project uses for
a status briefing.

**Argument:** `$ARGUMENTS` — **optional**.
- **Empty** — the **active sprint**: the `sprint-*.md` at the top of `ai-agents/sprints/` (the ones in
  `ai-agents/sprints/done/` are closed). If there is more than one, take the highest N **and flag the
  ambiguity** in the report.
- **A sprint name** (e.g. `Sprint 1`) — resolve it against `ai-agents/sprints/` **and**
  `ai-agents/sprints/done/`. If nothing matches, say so and list what's there. Do not guess.

> **The standard being aimed at.** *"As if I ask the producer of the project what the status is, and
> they provide it in a simple yet informative way."* **Answer like a producer being asked in person,
> not like a dashboard being rendered.** A real producer doesn't recite the board — they tell you where
> things stand, what's stuck, and what they need from you.
>
> **This skill is the contract.** If the project records its own status-report format or task-status
> vocabulary in its knowledge base (`ai-agents/knowledge-base/conventions/status-report-format.md`,
> `ai-agents/knowledge-base/conventions/task-status-vocabulary.md`), read those and **defer to them** —
> they are the project's law and this skill executes it. Absent those, what's written below is the
> format.

---

## Steps — do these in order

### 1. Ground in the real files — never from memory

- Resolve the sprint per the argument contract above and **read the sprint plan**.
- **Read the briefs it references** — under `ai-agents/tasks/backlog/`, `done/`, and `cancelled/`.
  The sprint row's link tells you where the brief lives; a `Moved` row may still link to `backlog/`.
- Parse each brief's **`## Status`** field by its **marker prefix** (`🔲`, `🔄`, `🚧`, `✅`, `⛔`, `➡️`).
  The value is free text after the marker and **may wrap across lines** — don't match on the whole line.
- Note each brief's **`## Sprint`** field too — step 2 needs it.

**The `.md` files are the record, and the record is what you report.** The sprint plan and the briefs —
that is the whole source set. **Do not go reading the code or the git history to second-guess them.**
Not `git status`, not `git log`, not the diff. A status report is an account of what the project has
written down about itself; if the code and the record disagree, that is a *bookkeeping* failure, and the
fix is for someone to update the record — not for the producer to start auditing the working tree and
quietly overruling it. You are not the reviewer.

**Never state a count, a status, or a "what's next" you did not just read out of a file.** This skill
exists because a status report was once improvised from memory and fabricated a number that looked
precise and was false. If you haven't read it this run, you don't know it. This is the same failure
as claiming repository state without checking it — see
[`conventions/evidence-before-assertion.md`](../../../ai-agents/knowledge-base/conventions/evidence-before-assertion.md).

### 2. Reconcile drift — this is the core value of the skill

Cross-check, for every task in the sprint, the three things the record says about it:
- the **sprint plan's Status cell**,
- the **brief's own `## Status`**, and
- **where the brief actually lives** (a brief in `done/` still marked `🔲 Backlog` is drift — the move
  happened, the status edit didn't).

All three are `.md`. **The code is not a source here** — see step 1.

**First, check the brief's `## Sprint` field — and skip the status cross-check if it names a different
sprint.** A `➡️ Moved` row is the sprint's record that the task *left*; the brief now belongs to the
sprint it moved to, and reads `🔲 Backlog` there **correctly**. That is not drift, and reporting it as
drift would flag every moved row of every closed sprint forever, and hand the owner phantom decisions.
Such a row keeps its `in Sprint N` next step. **Do still check that the brief's `## Sprint` actually
names the sprint the `Moved` marker points at** — if they disagree, *that* is real drift.

Also check the marker itself against the vocabulary: **a status the plan records but the vocabulary
forbids is *nonconformance*** (e.g. a `⛔ Cancelled` or `🚧 Blocked` cell with no reason, which the
vocabulary makes mandatory). Sources can agree with each other and still all be wrong. Flag it; don't
repair it. But keep the two kinds apart:
- **Disagreement drift** — the sources say different things, so the task's real state is *unknown*.
  That's an owner decision, and it takes the `waiting on owner` override below.
- **Nonconformance** — the sources agree and the state is *known*; the marker is just written wrong
  (or its mandatory reason was recorded in the wrong column). **Report it in the prose and note it on
  the roll-up, but leave the row's Next step alone** — a cancelled task is still `dead`, and printing
  `waiting on owner` on five dead rows makes a graveyard look like a to-do list.

When they disagree:
- **The prose wins and the drift gets flagged.** Say which task, which sources disagree, and what each
  one claims. Never render a stale board as if it were true.
- **The sprint plan's Status cell is the board of record — it is what the dashboard renders, and what
  the roll-up counts.** The brief's `## Status` is only a claim a task makes about itself. When the
  sources split, the sprint plan wins **for the board**, and every source that disagrees with it is
  named in the prose. Without this rule "the record" is undefined the moment
  drift exists, and two producers hand the owner two different boards — the exact failure this skill
  prevents.
- So: **in the dashboard, render the sprint plan's marker verbatim**, and — **for disagreement drift
  only** — put `waiting on owner` in that row's Next step (it overrides the row's normal one: a drifted
  `✅ Done` row reads `waiting on owner`, not `closed`). The board reports the record; **the prose
  reports reality and names the gap.** That way the board never silently overrides a status the owner never set, and never
  silently repeats one that's false. Same for the roll-up: it counts the board of record, and the prose
  says where that record is wrong.
- **Do not silently "fix" it.** Don't pick a winner and don't edit either file — reconciling the record
  is a decision, and it's the owner's (see step 6). Surface it; let them call it. In particular `✅ Done`
  and `⛔ Cancelled` are **owner-gated** — this skill never concludes them, however obvious the code
  looks.

### 3. Emit the seven beats, in order

1. **The headline** — one sentence. Where the project actually is. If someone reads only this line,
   nothing below it should surprise them. **Lead with bad news**: anything broken, slipped, or missed
   goes *here*, not buried under progress.
2. **Where we are** — sprint name, `N of M done`, and what phase that actually means. One or two lines.
3. **What's moving** — what is genuinely in progress right now, and who has it. **If nothing is moving,
   say so plainly** — "nothing's in progress" is a real status, not an empty section.
   Read it off the record: the tasks marked `🔄 In progress`. If the owner tells you something is being
   worked that the record doesn't show, say so — and note that nobody set its status, which is a real
   finding. But do not go hunting for unrecorded work; **if it isn't in the files, it isn't moving as far
   as the board is concerned**, and the fix is a status marker, not a wider search.
4. **What's next** — **the one thing** to pick up, and why that one. A recommendation, not a ranked
   list of five.
5. **What's in the way** — real blockers and *live* risks only. If nothing is blocked, say "nothing's
   blocked" and move on. Never manufacture a risk to fill the section; never restate a risk the owner
   has already absorbed.
6. **What I need from you** — decisions only the owner can make (including any drift from step 2, which
   is theirs to reconcile). **If there are none: "nothing, you're clear."**
7. **The dashboard** — the board, last. Build it per the dashboard step below.

**On a closed sprint** (one you found in `sprints/done/`), beats 3–5 are mostly moot and should say so
in one line each — nothing's moving because it's closed, nothing's next because nothing here should be
picked up, nothing's in the way because it's dead. **Don't manufacture content to fill them**, and don't
recommend picking up a task from a superseded plan. Its live tasks are the ones marked `➡️ Moved` —
point at the sprint they moved to. Drift in a closed sprint still gets flagged: a closed record can be
wrong, and it stays wrong forever if nobody says so.

### 4. The dashboard — last, and only the six statuses

A compact table, **at the end, after the answer**. It is reference material, not the briefing.

Columns, in this order: **Status · # · Task · Filename · Next step**

- **Status** — the task's real state, as **one of the six canonical markers, and nothing else**:
  `🔲 Backlog` · `🔄 In progress` · `🚧 Blocked — <reason>` · `✅ Done` ·
  `⛔ Cancelled (YYYY-MM-DD) — <reason>` · `➡️ Moved to Sprint N — priority M`

  **Never invent a value.** No "Not started", no "WIP", no "Todo", no "Complete". If the board needs a
  distinction the vocabulary can't express, **the board is lying** — flag that instead of inventing one.
  **Copy the marker as the sprint plan writes it** — including its mandatory reason (`Blocked`,
  `Cancelled`) and any link or qualifier the plan carries (`➡️ Moved to [Sprint 2](…) — priority 12
  (rescoped)`). That is the vocabulary, not prose, so it belongs in the cell — but **keep it to one
  line**: if a recorded reason is a paragraph, trim it to its first clause rather than wrapping the
  table.
- **#** — the priority number, matching the sprint plan.
- **Task** — the same short wording the sprint plan uses.
- **Filename** — the brief's filename, linked to where it actually lives (`backlog/`, `done/`,
  `cancelled/`).
- **Next step** — what actually advances it. The sprint plan has no such column, so **derive it** — from
  the plan's dependency graph, its blockers and open questions, **and the brief's own `Depends on:`
  line** (a sprint's graph often omits tasks; the brief still records the dependency, so check it
  before concluding a task is free). Keep to these shapes:
  `ready` · `after <N>` or `after <N>, <N>…` (name **every** task it waits on — don't collapse a
  fan-in to one, and don't drop a dependency because another task already covers it transitively) ·
  `waiting on owner` · `in Sprint N` (a moved row) · `dead` (a cancelled row) · `closed` (a done row).
  **If neither the plan nor the brief records a dependency, it is `ready`.** Say `ready` — do not infer
  a dependency nobody wrote down. An invented dependency is a fabrication like any other, and this
  column is free text, which makes it the easiest place in the report to start making things up.

Then:
- **One row per task**, no wrapped prose in cells.
- **Show the dead rows** — cancelled and moved tasks too. A board that hides them lies about scope.
- **A one-line roll-up** underneath, so the shape is legible without counting rows:

  ```
  N done · N in progress · N blocked · N backlog · N cancelled · N moved  —  of M
  ```

  - Counted from **the record** (what the files actually say), and named with the vocabulary's words
    (`backlog`, never "not started").
  - **Print only the non-zero terms** — a clean sprint reads `2 done · 1 in progress · 11 backlog — of
    14`, not a form with zeroes in it. Zero-filled slots are the "N/A-grade content" anti-pattern.
  - **Always print `— of M`, the sprint's total task count.** This is the load-bearing part: it makes an
    under-counting roll-up impossible. A closed sprint then reads `4 done · 10 cancelled — of 14`
    instead of `4 done · 0 in progress · 0 blocked · 0 backlog`, which silently implies the sprint had
    four tasks.
    **`M` is the number of rows in the sprint plan's Status table** — count them. Not a number the
    plan's prose quotes about itself; that prose goes stale (a plan may say "12 tickets" over a table
    of 14). **The counts must sum to M.** If they don't, you miscounted or missed a row — recount
    against the table before reporting.
  - **If step 2 found drift, the roll-up must carry it** — append a plain clause saying so, e.g.
    *"— as recorded; tasks \<N\> and \<N\> sit in `done/` but their briefs still read `🔲 Backlog`. See
    above."* A roll-up counted from a record you already know is inconsistent, printed bare, is a
    true-looking sentence that misleads. Counting the record is right; **printing it as if nobody
    noticed the contradiction is not.**

### 5. On a repeat status in the same session, report the delta

If you already gave a status this session, report **what changed** — don't re-render the whole state.
If nothing changed, say that.

### 6. Report — and stop there

The briefing *is* the report. Two things to be explicit about:
- **Drift** found in step 2 — surfaced under beat 6 as an owner decision, with what each source claims.
- **Anything you couldn't resolve** — an ambiguous active sprint, a missing brief, an unparseable
  status. Say it; don't paper over it.

**Change nothing.** If the owner then decides to reconcile a status, that goes through the normal
paths (`/fkit-task-done`, `/fkit-task-cancelled`, or a deliberate edit) — not through this skill.

---

## Rules
- **Read-only. This skill writes nothing.** It never sets a status, moves a task file, edits a sprint
  plan, or commits — **including to fix drift it finds**. Step 2 surfaces drift; it does not repair it.
- **Short by default** — readable in under 30 seconds. Detail is available on request.
- **Prose and short bullets in beats 1–6. The dashboard is the only table.** Beats 1–6 are an answer;
  don't turn the answer back into a report.
- **Sparing emphasis.** Bold the headline and genuine blockers. No decorative emoji, no 🔥 — the status
  markers in the dashboard are the exception, because those are the vocabulary.
- **Say "nothing" when it's nothing.** Empty sections are information. Padding them is how a status
  report starts lying.
- **Don't recite the board in prose.** A 40-line table with a dependency graph is not an answer — the
  owner can read the board. They asked *you*.

## Usage

```
/fkit-status              # the active sprint
/fkit-status Sprint 1     # a named sprint, including a closed one in sprints/done/
```
