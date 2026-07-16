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
- **A reserved full-board keyword** — `full` (aliases `all`, `board`), matched **case-insensitively**.
  It is **not a sprint name**: recognize and **strip it before** resolving the sprint, so whatever
  remains resolves per the two bullets above (empty → active sprint; a sprint name → that sprint). The
  keyword forces the **complete step-4 dashboard — every task row — even on a repeat call** (it
  overrides the step-5 delta default). It is honored wherever it appears in the argument, so
  `/fkit-status full` targets the active sprint and forces the full board, and `/fkit-status Sprint 2
  full` targets Sprint 2 and forces the full board. **`full` alone is never resolved as a sprint
  name** — it does not error with "no sprint named `full`".

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
- Note each brief's **`## Sprint`** field too — it is what tells you which sprint a task now belongs to.

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

**The drift *facts* are computed for you.** `dashboard.sh` (step 4) cross-checks, for every task, the
three things the record says about it — the **sprint plan's Status cell**, the **brief's own
`## Status`**, and **where the brief actually lives** (a brief in `done/` still marked `🔲 Backlog` is
drift: the move happened, the status edit didn't) — and emits them as `⟦FACTS⟧` records.

All three are `.md`. **The code is not a source here** — see step 1.

**Read the facts; don't re-derive them.** If you re-run the cross-check by hand you can disagree with
the board you are about to paste, and the owner gets two accounts of one record. Run the script early
enough that beats 2 and 6 can narrate from its output.

**The disposition is yours** — and it is the part no script does. Each `drift` record is a finding you
must explain and hand to the owner. Keep the two kinds apart:
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
- The script applies that rule for you: it renders the plan's marker verbatim, and — **for
  disagreement drift only** — puts `waiting on owner` in that row's Next step (a drifted `✅ Done` row
  reads `waiting on owner`, not `closed`). **The board reports the record; the prose reports reality
  and names the gap.** That way the board never silently overrides a status the owner never set, and
  never silently repeats one that's false. Same for the roll-up: it counts the board of record, and
  **your prose says where that record is wrong.**
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

### 4. The dashboard — run the script, don't hand-build it

**The board is computed, not recited.** Run:

```sh
bash .claude/skills/fkit-status/dashboard.sh <path-to-the-sprint-plan-you-resolved-in-step-1>
```

> **⚠️ `bash <path>` — never `./dashboard.sh`.** The exec bit is not guaranteed to survive install
> (`install.sh:44-46` chmods a hardcoded list of two other files). Running it directly works on some
> machines and fails on others. See [ADR-017](../../../ai-agents/knowledge-base/decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md).

You pass it a **path**; it does not resolve sprints. The argument contract, the `full` keyword, and the
step-5 delta all stay yours.

Its stdout has two delimited sections:

```
⟦fkit-dashboard v1⟧
⟦BOARD⟧      ← the finished table + roll-up
⟦FACTS⟧      ← the computed facts, one record per line
⟦END⟧
```

**If the version marker is not `⟦fkit-dashboard v1⟧`, say so rather than guessing at the shape.**

#### What to do with `⟦BOARD⟧`

**Paste it as beat 7 — verbatim, except the sentinel cells.** It is already the five columns, the six
canonical markers copied from the plan, and the roll-up. Do not re-count it, re-sort it, re-word it,
or "tidy" it. **The counts sum to `M` by construction** — that is the whole point of the script's
existence, and a hand-adjusted board forfeits it.

**The one thing you must fill: `⟨derive: …⟩` sentinels.** The script emits four of the six Next-step
shapes itself (`closed`, `dead`, `in Sprint N`, `waiting on owner`). It **cannot** decide `ready` vs
`after <N>`, because `Depends on:` is free text — so it hands you the **raw text it read**, in the cell:

| The cell says | You replace it with |
|---|---|
| `⟨derive: none recorded⟩` | `ready` — nobody wrote down a dependency, so there isn't one |
| `⟨derive: task 26 and task 27.⟩` | `after 26, 27` — name **every** task it waits on |
| `⟨derive: UNPARSEABLE — see brief⟩` | **the one case where you open the brief** — see below |

**Use the text inside the sentinel. Do not re-open the brief** — that is how you drift from what the
script saw. Name every task in a fan-in; don't drop one because another covers it transitively. **Do
not infer a dependency nobody wrote down** — this column is free text and it is the easiest place in
the report to start making things up. **A sentinel left in a delivered report is a bug** — that is
deliberate: it fails visibly rather than inventing quietly.

> **`⟨derive: UNPARSEABLE — see brief⟩` — the sanctioned exception.** The brief declares a dependency
> in a form the script could not read. **Open that brief and read it yourself.** The "don't re-open the
> brief" rule exists to stop you drifting from what the script saw — and here the script saw
> *nothing*, so there is nothing to drift from and the rule's reason does not apply. Resolve it to
> `ready` / `after <N>` as usual. **If you still cannot tell, put `waiting on owner` and say why in
> beat 6** — the accompanying `drift depends-unparseable` fact is an owner decision like any other.
> What you must **never** do is read it as `ready`: the script is telling you it could not find the
> dependency, not that there isn't one.

#### What to do with `⟦FACTS⟧`

**Beats 2 and 6 narrate from these records — never re-derive them from the files.** If you compute
drift yourself and the script computed it too, you can disagree with your own board, and the owner
gets two accounts of one record. The records you need:

```
total <M>                                  ← the sprint's task count
count <marker> <N>                         ← e.g. `count done 30`

drift disagreement <task> plan="…" brief="…" location="…"
drift disagreement <task> plan="…" brief_sprint="…" moved_target="…"
    ↑ two shapes. The second is the ➡️ Moved case: the plan says the task moved to one sprint and
      the brief claims another. Same finding — the record contradicts itself — different sources.

drift nonconformance <task> kind="…" cell="…"
    ↑ kinds: blocked-without-reason · cancelled-without-date · cancelled-without-reason ·
      moved-without-target · unknown-marker · brief-missing-status · missing-status-cell.
      The marker is written wrong, or a source is absent — the state is still KNOWN, so these rows
      keep their normal next step. `cancelled-without-date` and `-reason` are DIFFERENT defects:
      report the one named, or you send the owner to fix something already in the cell.
drift relocated <task> linked="…" found="…"
drift missing-brief <task> linked="…"
drift missing-sprint <task> plan="…" moved_target="…"
drift depends-unparseable <task> brief="…" form="S|BL|BI|P"
    ↑ the brief declares a dependency the script could not read. `form` is which declaration shape it
      matched, so you know what to look for. Pairs with the `⟨derive: UNPARSEABLE — see brief⟩`
      sentinel above — which is the ONE case where you open the brief yourself. Never read it as
      `ready`.
drift multiple-status-tables count=<n>
drift unresolved-plan-sprint h1="…"
    ↑ the plan has no recoverable `Sprint N` identity, so **drift rule 1** (skip the status
      cross-check when a brief's `## Sprint` names a different sprint) could not be applied — which
      means any drift below may be phantom. Say so; don't pretend the board is fully reconciled.
```

**This list is a mirror of the script's output and has drifted from it six times** (review rounds 1–6;
twice it was recorded as fixed when it was not). **If you see a `drift` record whose kind is not listed
here, report it as-is and say the grammar is out of date** — do not silently skip it. An unlisted
record is still an owner decision, and this list is the least trustworthy thing on this page.

Every `drift` record is an owner decision → **beat 6** (step 2 governs how to dispose of it: report,
never repair; disagreement is theirs to reconcile, nonconformance is a marker written wrong). The
roll-up already carries a generic drift clause pointing at beat 6 — **beat 6 is where you say what
each one actually is.**

#### If the script fails

**Don't wall the owner out of their own status.** If it exits non-zero (missing plan, unparseable
table, a bug), **hand-build the board and lead with the flag**:

```
⚠️ [dashboard hand-built — dashboard.sh failed: <reason>]
```

Then: the five columns above, one row per task, **markers copied from the plan's Status cell verbatim**,
**show the dead rows** (a board that hides cancelled and moved tasks lies about scope), and a roll-up
of the non-zero terms with **`— of M` where `M` is the number of rows in the table** — count them; not
a number the plan's prose quotes about itself, which goes stale.

**This fallback is deliberately lower fidelity, and says so in the flag.** The full contract lives in
the script. Do not reconstruct it here.

### 5. On a repeat status in the same session, report the delta

If you already gave a status this session, report **what changed** — don't re-render the whole state.
If nothing changed, say that.

**Exception — an explicit full-board request overrides the delta default.** If the argument carries
the reserved keyword (`full` / `all` / `board`, per the Argument contract), render the **complete
board** — every step-4 row — regardless of whether a status was already given this session. The delta
is the default only for repeat calls **without** the keyword.

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
/fkit-status full         # force the complete board even on a repeat (aliases: all, board)
/fkit-status Sprint 2 full # force the complete board for a named sprint
```
