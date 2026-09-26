# Investigate a terminal UI for the board, and compare it against the web board

## ID
0405

## Sprint
Sprint 11

## Priority
P4

## Status
🔄 In progress — driven by `/fkit-sprint-ship-loop` from a `fkit lead` session, started 2026-09-21.

## Owner
fkit-architect

## Context

### ⛔ THIS IS AN INVESTIGATION AND A COMPARISON. IT IS NOT A BUILD, AND IT IS NOT AN ADOPTION.

⭐ **Nobody has decided to build a terminal UI.** The owner put the idea **on the table** on
2026-09-18 and set the sequencing himself. His words, verbatim, given via `AskUserQuestion` in a live
`fkit lead` session:

> *"I also want you (and maybe the other leads, Codex, and external-expert) to think about removing
> the web dependency at all, and maybe investigating what can be done in Terminal UI. Whether we can
> achieve something user-friendly here, that resembles the Trello/Jira board (if there is an option
> to do that, we may give it a try, without removing web first, compare them, and after that make the
> final decision)."*

⛔ **The sequencing he set is load-bearing and this brief is scoped to it: build alongside, compare in
practice, then decide.** Specifically:

- ⛔ **Do NOT remove the web board.** *"without removing web first"* is an explicit instruction, not a
  preference.
- ⛔ **Do NOT treat "investigate" as permission to ship a TUI.** *"we may give it a try"* is
  conditional and the condition is the investigation's own output.
- ⛔ **The final decision is the owner's alone.** This task ends by putting the comparison to him.

⚠️ **Written by a spawned `fkit-producer` with no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
Every framing below the owner's own words is this producer's and is open to correction.

### ⛔ THE DECISIVE FRAMING — a terminal UI is a CHANGE OF PREMISE, not an implementation detail

⭐ **This is the single most important sentence in this brief, and it must survive into whatever
report the task produces.** A TUI is not "the same board, drawn differently." It changes **who the
board is for.**

- **The owner's original motivation for a web board, in his own framing:** *"regular humans can open
  it in the browser and check the cards."* A browser is the one UI that needs no explanation, no
  install, and no terminal.
- **For *this* owner, a TUI is plausibly BETTER.** He is terminal-resident; fkit is driven entirely
  from a terminal; a board in the same window as the work removes a context switch.
- ⛔ **For the never-withdrawn constraint, a TUI NARROWS the audience.** The standing constraint on
  [Sprint 11's board](../../../sprints/sprint-11.md), under its heading *"THE STANDING CONSTRAINT"*,
  quotes the owner: *"other people can attach the same module to other projects even if they just
  don't have any framework or system, but it might still be useful for them."* A terminal UI is
  usable by people who live in terminals. That is a **smaller** set than "regular humans."

⚠️ **So "web vs terminal" is not a technology choice that can be made on effort or elegance. It is a
question about audience, and the audience question is the owner's.** A report that compares rendering
quality and omits this has answered the wrong question.

### ⭐ THE POINT OF THE TASK — this would be the first usability evidence either project has ever had

⛔ **Nobody has measured readability for either option.** Neither fkit's markdown boards, nor aiboard's
web board, nor any terminal rendering has ever been **used by a non-agent human** in a measured way.
Every claim about which is easier to read is currently an assertion.

⭐ **A TUI-vs-web comparison would therefore produce the first usability evidence in the history of
both projects.** ⚠️ **That is the deliverable — not the TUI.** If the comparison can be run without
building a full TUI (a throwaway prototype, a rendered static sample, a side-by-side screenshot of
the same board in both), that is a **better** outcome, not a lesser one.

### ⛔ A TERMINAL UI DOES NOT SOLVE THE IDENTITY GAP — recorded so the argument is not revived

⚠️ **This argument was made on 2026-09-18 by `fkit-lead` and REFUTED the same day by `aiboard-lead`.**
It is recorded here because it is an attractive argument that will otherwise be re-proposed.

**The claim:** a terminal UI would tell a human apart from an agent, because a human sits at a
terminal and an agent does not.

**The refutation, from `aiboard-lead`:**

1. **The human and the agents share one uid here.** Anything derived from the operating-system user
   identifies both identically.
2. **Agents can drive a PTY.** A pseudo-terminal is not evidence of a human; an agent can open one.
3. **aiboard's existing CLI already has exactly this weak story** — its author attribution is derived
   from the environment, which is the same weak signal a TUI would have.

⛔ **Therefore the identity gap is untouched by the choice of UI, and a TUI must not be proposed or
scored as a mitigation for it.** ⚠️ **The identity gap is being recorded separately as an ADR that the
architect is drafting and the owner will sign off** — ⛔ **this task does not write, number, reference
or duplicate that ADR**, and the **mechanism** is being filed on **aiboard's** board by `aiboard-lead`
once the external expert rules, not here.

### ⭐ FEASIBILITY IS ALREADY MEASURED — do not re-derive it, verify it

⛔ **Attributed: measured by `aiboard-lead` on 2026-09-18. NOT read by this producer.** Re-verify
before relying on it; do not inherit it silently
([`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md)).

⭐ **A TUI is a FOURTH DOOR INTO THE SAME STORE.** aiboard's existing `board` command **already
renders a kanban from its snapshot in roughly 28 lines.** A TUI is that same renderer plus:

- raw-mode key handling
- a selection cursor
- scrolling
- a detail pane

⛔ **No store work. No data-model work.** That is why this task is separable from the frozen
convergence work at all — see the freeze note below.

**Honest Node cost, as reported:** **400–700 lines of terminal plumbing.** Node core already provides
raw-mode stdin, tty detection, terminal dimensions, a resize event, and ANSI escapes — **everything
`curses` gives except a window/pad abstraction and terminfo portability**, both of which would have to
be written or lived without.

### ⚠️⚠️ THE REAL COST DRIVER IS CHARACTER WIDTH — AND THIS IS ITS THIRD APPEARANCE TODAY

⛔ **Record this as a RECURRING RISK CLASS, not as a new finding of this task.** It surfaced **three
separate times on 2026-09-18**, in three different conversations, about three different pieces of
work. A class that recurs three times in one day is a property of this project, not a coincidence.

**The class:** the three layers count text differently.

| Layer | Counts |
|---|---|
| Python | code points |
| JavaScript | UTF-16 code units |
| A terminal | **display columns** |

⛔ **And this project's content is emoji-dense** — every board row, every status marker, every brief
heading in this repo carries emoji, many of them wide or composed. ⚠️ **So the naive `string.length`
that works in a browser produces misaligned columns in a terminal**, and that misalignment is the
thing that makes a hand-rolled TUI look broken rather than merely plain.

⭐ **This is the cost driver. It is not the 400–700 lines.** Any estimate that prices the plumbing and
not the width handling is under-priced.

### ⛔ "Python has `curses`" is MOOT — do not raise it

⚠️ The obvious counter-argument — *Python ships `curses`, so build the TUI in Python* — is **dead
under the port ruling.** aiboard is being ported **from Python to Node** (Sprint 11, step 1, on an
owner ruling of 2026-09-18). ⛔ **A Python TUI would be throwaway work the day it shipped.** Record the
argument as considered and closed; do not spend the task's time on it.

### ⚠️ Dependencies and conflicts, stated rather than planned around

- ⭐ **This task is NOT frozen by the Sprint 11 migration freeze, and here is why.** The owner's
  freeze of 2026-09-18 covers *"anything migration-shaped — re-keying ids, moving folders, rewriting
  boards."* A TUI investigation is **none of those**: per the feasibility finding above it is a fourth
  **reader** of an existing store, with **no store work and no data-model work**. ⚠️ **If the
  investigation ever proposes changing the stored shape, it has crossed into the freeze and must
  stop and escalate.**
- ⚠️ **Gated in practice on `fkit-external-expert`, which has not reported.** The expert may change
  what the board's data even looks like, which changes what a TUI would render. ⛔ **This is not
  declared as a hard dependency** — the audience question and the width-class risk can be worked on
  regardless — but pulling this before the expert reports risks comparing against a shape that is
  about to change.
- ⚠️ **Relates to `0383`** (shrink the Backlog board) and `0404` (evaluate aiboard), and **subsumes
  neither.** `0383` is currently **held** for the same reason.

## What to build

⛔ **A written comparison and a recommendation. Not a product.**

1. **State the premise question first, before any technical content.** Who is the board for? Record
   the owner's *"regular humans can open it in the browser"* framing and the standing
   no-framework constraint against the terminal-resident reality, and say plainly which audience each
   option serves. ⛔ **Do not resolve it — it is the owner's call. Present it so he can.**
2. **Verify the feasibility findings** above against aiboard's actual tree (the ~28-line `board`
   renderer; the 400–700-line plumbing estimate; what Node core does and does not supply versus
   `curses`). Report what reproduced and what did not.
3. **Cost the character-width problem explicitly and separately** from the plumbing. Say what it
   would take to get emoji-dense rows to align in a terminal, and what it looks like when it is wrong.
   ⭐ **Record it as a recurring class with its three 2026-09-18 sightings**, so the next task that
   meets it recognises it.
4. **Design the comparison itself — this is the core deliverable.** How would a human actually be
   asked which is more readable? What board, what tasks, what questions, measured how? ⚠️ **It must be
   runnable by one person (the owner) — there is no user panel.** A comparison design that needs ten
   testers is not a usable answer here.
5. **Recommend the cheapest artifact that makes the comparison real** — a throwaway prototype, a
   static rendering, a side-by-side capture. ⛔ **Recommend building the smallest thing that answers
   the question, not the best thing that could be built.**
6. **Record the identity-gap refutation** (above) in the output, so the "a TUI tells humans from
   agents" argument is closed rather than re-opened.
7. **End with the decision put to the owner** — options, the tradeoff of each, one recommendation.

⛔ **Out of scope, explicitly:**

- Building a production terminal UI.
- Removing, deprecating, or degrading the web board in any way.
- Any change to aiboard's or fkit's stored shape (the freeze).
- The identity mechanism, and the ADR recording the identity requirement.
- Any `ai-agents/wiki-vault/` write
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- Any re-rank
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md))
  or task-file move
  ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
- Any commit.

## Verification steps

1. **A report exists** under `ai-agents/knowledge-base/reports/`, dated, and it opens with the
   **premise/audience question** — not with a technology comparison. Reading only its first section
   must make clear that this is a question about **who the board is for**.
2. **Both audiences appear by name** in it: the terminal-resident owner, and the no-framework user
   the standing constraint protects. If it names only one, it has answered the wrong question.
3. **The feasibility figures are marked verified or not verified, each individually** — the ~28-line
   renderer, the 400–700-line estimate, the Node-core-versus-`curses` gap. A figure carried forward
   unverified is labelled as such.
4. **Character width is costed in its own section**, separate from the plumbing estimate, and is
   labelled a **recurring** class with its three 2026-09-18 sightings named.
5. **The identity-gap refutation appears verbatim in substance** — the shared uid, the PTY, aiboard's
   existing env-derived author story — and the report states that a TUI does **not** address the gap.
6. **A comparison method is written down that one person could actually run**, with the specific
   questions that would be asked.
7. **The web board is untouched.** `git status` shows no deletion or disabling of any web-board file.
8. **Nothing migration-shaped was done** — no id re-keying, no folder moves, no board rewrites.
9. **A single recommendation is stated with its main tradeoff**, and the final decision is left
   explicitly to the owner.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- ⚠️ **Soft-sequenced behind `fkit-external-expert`'s report** — deliberately **not** declared as a
  dependency above, because the audience question and the width-class work do not need it. See
  "Dependencies and conflicts" in `## Context`.
- ⚠️ **Priority: Sprint 11 is UNRANKED and no `P<n>` exists on it.** This brief therefore reads
  `## Priority: Unscheduled` and its board row's Priority cell reads `—`, matching every other row on
  that board. ⛔ **Inventing a rank is the act ADR-035 forbids** — ranking Sprint 11 is an owner act
  that has not happened. **On merit this belongs directly below `0404`**, because the comparison it
  designs is only meaningful once `0404`'s evaluation has established what the board's data shape is
  going to be. ⚠️ **That is a merit statement, not a rank** — it becomes a number when the owner ranks
  the board.
- ⭐⭐ **SUPERSEDED 2026-09-20 — SPRINT 11 IS NOW RANKED `P1`–`P4` AND THIS TASK IS `P3`.** The bullet above is left byte-identical; where the two disagree, this one governs. Authority: an owner ruling of 2026-09-20 relayed into a spawned `fkit-producer` (no owner channel, ADR-021) — *"rank the four"*. ⭐ **Both merit statements are satisfied literally**: `P3` is directly below `0404` (`P2`) and below `0409` (`P1`).
- ⭐⭐ **SUPERSEDED LATER ON 2026-09-20 — THIS TASK IS NOW `P4`, NOT `P3`.** The bullet above is left byte-identical; where the two disagree, this note governs. ⛔ **Authority first: the owner ruled it**, **2026-09-20**, **live via `AskUserQuestion` in an `fkit lead` session**, relayed into a spawned `fkit-producer` with no owner channel (ADR-021). ⚠️ **SELECTED OPTION TEXT — a pre-written option he chose; not his own prose.** ⛔⛔ **Not producer precedent for re-ranking.** **What moved and why:** `0404` was closed and the reader it was re-scoped to became its own task, [`0411`](../../done/0411-make-the-read-only-aiboard-reader-the-board-the-owner-actually-reads/brief.md), which the owner ruled runs **ahead of this task** — *"0405's own brief says it belongs directly below 0404 because its web-vs-terminal comparison is only meaningful once a real board exists to compare against."* ⭐ **This task's own merit statement is therefore SATISFIED, not overridden:** `0411` is the live board its comparison needs. ⛔ **Nothing else changed here** — no status, no scope, no `Depends on`, and the prose gate on the comparison step is untouched and still binding.
- ⛔ **`Depends on: nothing` above is UNCHANGED AND STILL CORRECT, DELIBERATELY.** The owner's option text said *"declare 0409 as a dependency of 0405"*; taken literally that **over-blocks this task** — `0409` gates the **comparison step only**, and this brief already says so at its heading *"WHAT ELSE CHANGED AROUND THIS TASK ON 2026-09-18"*. ⛔ **The prose gate on the comparison step is UNCHANGED and still binding.** ⭐ Rank alone gives the loop the required order without recording a false dependency.
- ⛔ **All figures attributed to `aiboard-lead` were measured in aiboard's repo on 2026-09-18 and were
  NOT read by this producer.** Two repos are in play; provenance is stated rather than blurred.
- ⛔ **No commit was made by the act that created this brief**, and nothing was written to
  `ai-agents/wiki-vault/`.
- **Citations here are durable anchors** — heading plus quoted fragment, never `path:NNN` — per
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md).

## ⭐⭐ FIRST REAL USER EVIDENCE — appended 2026-09-18. It contradicts this brief's own premise.

⛔ **Read this before working the task.** The section above under the heading *"THE POINT OF THE TASK"*
states that *"nobody has measured readability for either option"* and that the comparison *"would
therefore produce the first usability evidence in the history of both projects."* ⭐ **That is now
partly out of date.** On **2026-09-18** the owner used a working board against real content and said
what he thought. ⛔ **The section above is left BYTE-IDENTICAL; this is a dated note beside it, not an
amendment.**

⚠️ **What it changes and what it does not.** It closes *"has anyone ever used it"* **for the web
board**. It does **not** close *"which is more readable, web or terminal"* — **no terminal rendering
exists to compare against**, so this task's comparison deliverable is **unchanged and still needed**.
⭐ **The evidence is now an INPUT to that comparison, and a starting point for its design** (step 4
above, *"Design the comparison itself"*): the owner has already told you, unprompted, what he found
useful and what he found hard.

⛔ **PROVENANCE — this is a VERBATIM DUPLICATE, not an independent record.** The canonical copy, with
the full context, lives on
[`0404`](../../done/0404-evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam/brief.md)
under its heading *"FIRST REAL USER EVIDENCE"*, because that is where the durability argument was made.
⛔ **If the two ever disagree, `0404`'s copy is canonical.** It is duplicated here because the second
half of what the owner said is **directly about a terminal UI**, and this task must not be worked
without it.

### ⭐⭐ THE OWNER'S OWN PROSE — HE TYPED THIS. IT IS NOT SELECTED OPTION TEXT.

⛔ **This differs from every other owner record filed on 2026-09-18**, including the *"without removing
web first"* quote in this brief's own `## Context`, which reached the record through `AskUserQuestion`.
⭐ **This is his own free text, typed by him**, and may be quoted as his words. ⛔ **Do not let it
acquire the relayed-or-selected caveat that correctly sits on the others.**

> *"It's kind of useful, because I can see all the cards and read the details there by clicking the
> cards. When I open .md files the text is hard to read and is too huge to consume, the board allows me
> to see the titles and descriptions in a more readable way. When I ask agents in terminal about
> providing me the status of the sprint/tasks — it's also kind of hard to read when there are a lot of
> tasks and texts. I don't know if it can be improved to make it user-friendly in the Terminal-UI (I
> can think of some 'unusual' approaches, like using ASCII or 'rendering' the HTML here with some
> 'symbol-based-renders', maybe it will help and make the web-HTML board not needed, I don't know)."*

⭐ **The owner himself raised the terminal-UI question inside this quote, unprompted, and named his own
candidate approaches** — ASCII, and *"'rendering' the HTML here with some 'symbol-based-renders'."*
⚠️ **He also stated his own uncertainty twice** (*"I don't know"*). ⛔ **That is interest, not a
ruling. It is not permission to build a TUI** — the sequencing under this brief's heading *"THIS IS AN
INVESTIGATION AND A COMPARISON"* is unchanged.

**What he used:** `fkit-external-expert`'s read-only spike — aiboard's **unmodified** browser UI over
fkit's **unmodified** tree, **405 real tasks**, preserved at `0404`'s `assets/external-expert-spike/`.
⭐ **Real content at real scale, not a demo.** ⚠️ Still one user, one sitting, free-form, **no
side-by-side**.

### ⚠️ `fkit-lead`'s reading of it — ATTRIBUTED, UNCONFIRMED, AND SELF-FLAGGED AS POSSIBLY MOTIVATED

⛔ **This is `fkit-lead`'s interpretation, not the owner's words.** Kept below and separate from the
quote so the two are never read as one thing. ⚠️ **Status: UNCONFIRMED** — sent to `aiboard-lead` to
attack on 2026-09-18, **no answer received**.

> *The mechanic he named is **overview plus drill-down on demand** — see many titles at once, open one
> for detail. Not "cards", not "a browser". It is the thing neither existing tool gives him: raw
> markdown is all detail and no overview; a linear status report is a wall of text. If that reading
> holds, his requirement is a **presentation** requirement, which is where `fkit-external-expert`'s
> verdict already put the problem — and overview-plus-drill-down is the native shape of a terminal UI,
> not a stretch for one.*

⛔⛔ **`fkit-lead`'s OWN warning about its own reading, recorded at its request and not softened:** it
*"may be fitting his words to a conclusion I already preferred,"* and it *"has been caught doing that
twice today."* ⭐ **His words are the evidence. This reading is a hypothesis.** ⚠️ **It is exactly the
reading that favours this task's own subject**, so a run that adopts it without testing it against the
quote has let a convenient hypothesis become a finding.

### ⭐ A SECOND, DISTINCT FINDING — it is about THIS TEAM, not about tooling

⛔ **Recorded as its own finding, deliberately NOT folded into the terminal-UI question above.** The
owner said terminal status reports are *"kind of hard to read when there are a lot of tasks and
texts."* ⭐ **That is direct feedback on `/fkit-status` and on how this team reports to him**, and it
may be fixable with **no UI at all** — by reporting less, or hierarchically.

⚠️ **Why it matters to THIS task specifically: a TUI that papers over verbose reporting treats a
symptom.** If the reports are the problem, a new renderer hides it. ⛔ **A comparison that scores a TUI
against today's verbose reports without naming this confound has mis-attributed the improvement.**

⛔ **NOT ACTED ON. No task is filed and no fix is scoped** — `fkit-lead` has **not** put it to the
owner. Recorded solely so it is not lost.

### ⛔ WHAT THIS EVIDENCE DOES *NOT* DO

- ⛔ **The convergence decision is NOT ruled.** `fkit-lead` is putting it to the owner. **Do not
  anticipate it.**
- ⛔ **The Sprint 11 migration freeze is NOT lifted, and nothing here is re-scoped** on the strength of
  this feedback.
- ⛔ **The web board is still not to be removed, degraded, or deprecated** — *"without removing web
  first"* stands, and the owner's *"maybe it will help and make the web-HTML board not needed"* is a
  speculation he explicitly marked *"I don't know"*, **not** a reversal of it.
- ⛔ **Nothing above this section was changed by this append.**

---

## ⭐⭐ OWNER RULING 2026-09-18, LATE — "FIX THE REPORTING FIRST, THEN DECIDE"

⛔⛔ **READ THIS BEFORE WORKING THE TASK, AND BEFORE THE SECTION IMMEDIATELY ABOVE IT.** That section
ends *"The convergence decision is NOT ruled… Do not anticipate it"* and *"The Sprint 11 migration
freeze is NOT lifted."* ⭐ **Both statements are now out of date.** ⛔ **Their text is left
BYTE-IDENTICAL** as the true record of that morning, and is **superseded here, not rewritten.**

⛔ **Nothing above this section was changed by this append.** Additive, per the house dated-note
pattern.

**Authority.** Given live via `AskUserQuestion` in an `fkit lead` session on 2026-09-18 and relayed
into a spawned `fkit-producer` with **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).

⚠️ **SELECTED OPTION TEXT — an option an agent wrote and he chose.** ⛔ **Not his own free prose.** (His
own typed prose is the section above, under its heading *"THE OWNER'S OWN PROSE"*, and that distinction
is load-bearing in this file.)

> *"aiboard-lead's argument… your board is 83% prose stuffed into table cells, and briefs run to 57KB.
> That's a WRITING problem upstream of any UI. Make /fkit-status report hierarchically — counts and
> exceptions first, detail on request — and see if it still reads badly. If that fixes it, the terminal
> UI was solving a problem with a cheaper answer."*

### ⛔ WHAT THIS DOES — AND DOES NOT DO — TO THIS TASK

| | |
|---|---|
| ⛔ **NOT cancelled.** | Its `## Status` stays `🔲 Backlog`. |
| ⛔ **NOT deferred, and NOT re-scoped.** | Everything under `## What to build` above stands, word for word. |
| ⭐ **What CHANGED** | Its **comparison is now known to be CONFOUNDED**, and the confound has a named remover. |

### ⭐⭐ THE CONFOUND — this is the whole content of the ruling for this task

⚠️ **A terminal UI scored against today's verbose reports is scored against a confound.** The terminal
would be measured partly on **the UI** and partly on **how much text this team emits into it** — and
the result **could not tell the two apart.**

⭐ **The owner's own sentence says exactly this in his framing:** *"see if it still reads badly. If that
fixes it, the terminal UI was solving a problem with a cheaper answer."*

⭐ **The confound-remover is
[`0409`](../../done/0409-make-fkit-status-report-hierarchically-counts-and-exceptions-first-detail-on-request/brief.md)**
— "Make `/fkit-status` report hierarchically — counts and exceptions first, detail on request." ⛔ **The
mirror of this note is carried in `0409`'s brief**, under its heading *"THIS TASK IS THE
CONFOUND-REMOVER FOR `0405`"*, so neither task can be picked up without meeting it.

⚠️ **A contributory second task exists but does NOT gate this one:**
[`0410`](../0410-investigate-how-agents-report-status-to-the-owner-in-prose-and-put-a-shape-to-him/brief.md)
— agents' free-prose replies, the other half of the owner's *"when I ask agents."* ⭐ **`0409`, not
`0410`, is the named remover**, because `/fkit-status` is the scripted, measurable surface.

### ⛔ THE SEQUENCING RULE — precise, because "blocked" would be wrong

⛔ **`0409` is NOT declared a hard dependency of this task.** Steps 1 (the premise/audience question),
3 (character width) and 6 (the identity-gap refutation) of `## What to build` **do not need it** and
can be worked the moment this row is pulled.

⛔⛔ **BUT: step 4 — designing the comparison — and any RUN of that comparison MUST NOT happen before
`0409` lands.** Running it earlier measures the confound and produces a number nobody can interpret.

⚠️ **That distinction — the task is not blocked, one of its steps is — is stated in prose because the
canonical dependency form has no way to say it**
([`dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md)).
⛔ **`## Notes` above still reads "Depends on: nothing" and that remains CORRECT at task granularity.**

### ⚠️ WHAT ELSE CHANGED AROUND THIS TASK ON 2026-09-18

- ⭐ **The soft-sequencing behind `fkit-external-expert` is DISCHARGED — it reported.** Its verdict, at
  its heading *"5. The added question — web board, terminal UI, or both?"*, lands on
  *"not a distraction, but **not next**"*, and puts a TUI third in its own order. ⛔ **That is an INPUT
  to this task, not a ruling on it** — and it is **not** what the owner ruled. ⭐ **He ruled a different
  order: fix the reporting, then decide.**
- ⭐ **The convergence decision IS ruled: B as the destination, A as the interim, B gated.** Recorded
  canonically on
  [`0404`](../../done/0404-evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam/brief.md)
  under its heading *"THE CONVERGENCE DECISION IS RULED"*, and on
  [Sprint 11](../../../sprints/sprint-11.md).
  ⚠️ **What it means here:** the store this task's TUI would render **is now known to be fkit's tree
  today (A), and aiboard's tree eventually (B, gated).** ⛔ **So a TUI design that hard-codes either
  store has designed for a shape that is scheduled to change** — the verdict's *"a second thin consumer
  of the same snapshot contract"* is the shape that survives both.
- ⭐ **The migration freeze STILL STANDS, and its REASON CHANGED** — it now holds B behind an undefined
  gate rather than holding everything behind a pending decision. ⛔ **This task remains OUTSIDE it**, for
  the reason already given above under *"Dependencies and conflicts"*: it is a **reader**, with no store
  work and no data-model work. ⚠️ **If it ever proposes changing the stored shape, it stops and
  escalates** — unchanged.
- ⚠️ **One figure in the ruling's own text is `aiboard-lead`'s, not this producer's:** *"83% prose
  stuffed into table cells"*, and `0383`'s own measurement of 2026-09-10 reads **89%**. ⛔ **The two are
  not reconciled and neither was re-measured here.** ⭐ **Re-measure at pickup; trust neither number in
  this paragraph** — this is the same unreconciled-figure discipline already applied to the longest-cell
  count on [Sprint 11](../../../sprints/sprint-11.md).

### ⛔ WHAT THIS RULING DOES *NOT* DO

- ⛔ **It does not decide that a terminal UI is wrong, or right.** ⭐ **It decides the ORDER.** *"then
  decide"* is in the ruling's own words.
- ⛔ **It does not remove, degrade or deprecate the web board.** *"without removing web first"* still
  stands.
- ⛔ **It does not make `0409` a hard dependency of this row**, and it does not change this brief's
  `## Status`, `## Priority`, `## Owner` or its board row's Priority cell.
- ⛔ **It settles nothing about the premise/audience question** — who the board is for remains the
  owner's call, and step 1 above still exists to put it to him.

⛔ **Written by a spawned `fkit-producer` with no owner channel** (ADR-021). ⛔ **No commit was made by
this append**, and nothing was written to `ai-agents/wiki-vault/`
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
