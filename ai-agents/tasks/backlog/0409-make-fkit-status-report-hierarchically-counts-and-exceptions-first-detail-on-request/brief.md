# Make `/fkit-status` report hierarchically — counts and exceptions first, detail on request

## ID
0409

## Sprint
Sprint 11

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### ⭐ AUTHORITY — an owner ruling of 2026-09-18, and it is the SECOND of two rulings given in one session

⛔ **This task exists by an owner ruling given live via `AskUserQuestion` in an `fkit lead` session on
2026-09-18**, relayed into a spawned `fkit-producer` which has **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).

⚠️ **PROVENANCE, stated precisely because this project distinguishes the two.** What follows is
**selected option text** — an option an agent wrote and the owner chose. ⛔ **It is not his own free
prose.** (His own typed prose on the underlying complaint is quoted separately below, and is marked as
such.)

> *"aiboard-lead's argument… your board is 83% prose stuffed into table cells, and briefs run to 57KB.
> That's a WRITING problem upstream of any UI. Make /fkit-status report hierarchically — counts and
> exceptions first, detail on request — and see if it still reads badly. If that fixes it, the terminal
> UI was solving a problem with a cheaper answer."*

⭐ **The ruling's own name for itself: "fix the reporting first, then decide."**

### ⭐⭐ THE OWNER'S OWN PROSE — the complaint this task answers. HE TYPED THIS. IT IS NOT SELECTED OPTION TEXT.

⛔ **This is his own free text, typed by him, on 2026-09-18.** It may be quoted as his words. It is the
canonical record of the complaint, and it lives canonically on
[`0404`](../0404-evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam/brief.md)
under its heading *"FIRST REAL USER EVIDENCE"*. ⛔ **The copy below is a duplicate, not an independent
record. If the two ever disagree, `0404`'s is canonical.** Only the sentence bearing on this task is
reproduced:

> *"When I ask agents in terminal about providing me the status of the sprint/tasks — it's also kind of
> hard to read when there are a lot of tasks and texts."*

⭐ **Note the scope of his sentence: "when I ask agents."** That covers **two** surfaces, and they are
split into two tasks deliberately — see "Why this is two tasks" below.

### ⛔⛔ THE FIRST THING TO DO IS MEASURE, NOT DESIGN — and the reason is that the convention ALREADY says "hierarchical"

⚠️ **Read this before writing any code, because it may change what the task is.**

This repo already has a written report-shape convention:
[`status-report-format.md`](../../../knowledge-base/conventions/status-report-format.md). Under its
heading *"Rules"* it already states, verbatim:

> *"Short by default. Aim for something readable in under 30 seconds. Detail is available on request —
> lead with the answer, not the evidence."*

and under *"The structure — six beats, then the board"* it already puts the dashboard **last**,
already prints **only open rows**, and already requires a **one-line roll-up**:

> *"`N done · N in progress · N blocked · N backlog · N cancelled · N moved — of M`"*

⭐ **That is already "counts and exceptions first, detail on request."** So there are three possible
findings, and the task's real shape depends on which one the measurement returns:

| Finding | What the task then is |
|---|---|
| **(1) The skill's output does NOT obey the convention** | A **conformance** fix. Cheapest outcome. No convention change, no owner decision needed on shape. |
| **(2) The output obeys the convention, but the convention is insufficient at today's scale** | A **convention** change first, then the skill follows. ⛔ **The convention is a producer surface — see the split note in `## Notes`.** |
| **(3) The output obeys it and the convention is fine — the pain is elsewhere** | Report that, and ⛔ **do not change anything.** The pain would then be in the briefs and board cells the reports quote from, which is `0383`'s and `0410`'s territory, not this one's. |

⛔ **A run that arrives having already assumed (2) has skipped the measurement and has failed.**

### ⚠️ Why the scale matters, and what the numbers are today

⛔ **Every figure here is dated and MUST be re-measured at pickup** — this repo's own rule, per
[`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md). It
is quoted so the implementer knows roughly what they are walking into, **not so it can be cited.**

- **405 tasks** in the corpus (measured by `fkit-external-expert` 2026-09-18 against fkit's unmodified
  tree; ⛔ **not measured by this producer**).
- The Backlog board renders **441,959 bytes** and carries **234 table data rows**, of which **122** read
  `🔲 Backlog` (measured 2026-09-18, carried on
  [`0404`](../0404-evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam/brief.md)
  under its heading *"The measured pain that motivates this"*).
- `claude/skills/fkit-status/dashboard.sh` is reported at **1,687 lines** (`fkit-external-expert`,
  2026-09-18; ⛔ **not counted by this producer** — count it yourself).

⚠️ **The 122-open-rows figure is the crux.** The convention's dashboard is *"one row per task"* with
*"no wrapped prose in cells"*, and at 2 rows (Sprint 11) that is fine. At **122** open rows it is a
wall of text **that fully obeys the convention.** ⭐ **That is what finding (2) would look like, and it
is the plausible one** — but it is still a hypothesis until measured.

### ⭐⭐ THIS TASK IS THE CONFOUND-REMOVER FOR `0405`, AND THAT RELATIONSHIP IS THE REASON IT IS ON THIS SPRINT

⛔ **Read this together with
[`0405`](../0405-investigate-a-terminal-ui-for-the-board-and-compare-it-against-the-web-board/brief.md),
which carries the mirror of this note.**

`0405` designs a comparison between a terminal UI and the web board. ⚠️ **A terminal UI scored against
today's verbose reports is scored against a confound:** the terminal would be measured partly on the
UI and partly on how much text this team emits into it, and the result could not tell the two apart.

⭐ **So this task's deliverable is not only a nicer report — it is `0405`'s clean baseline.** The
owner's ruling says so in its own words: *"see if it still reads badly. If that fixes it, the terminal
UI was solving a problem with a cheaper answer."*

⚠️ **This is NOT declared as a hard dependency of `0405`**, because `0405`'s premise/audience question
and its character-width work do not need it. ⛔ **But `0405`'s comparison step must not be RUN before
this lands**, or it measures the confound. That distinction — the task is not blocked, one of its steps
is — is stated here because the canonical dependency form has no way to say it
([`dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md)).

### ⚠️ Why this is two tasks, not one — the decomposition, recorded

The owner's sentence is *"when I ask agents."* That covers two genuinely different surfaces, with
different owners and different verification, each shippable alone:

| | Surface | Task | Owner |
|---|---|---|---|
| **This one** | **`/fkit-status`** — a shipped skill plus a deterministic shell script with a stdout contract | `0409` | `fkit-coder` |
| **The sibling** | **Agents' free-prose replies** to the owner across all seven roles — a behavioural convention, not a script | [`0410`](../0410-investigate-how-agents-report-status-to-the-owner-in-prose-and-put-a-shape-to-him/brief.md) | `fkit-producer` |

⛔ **They are not merged**, because a fix to a script is verifiable by running it and a fix to agent
behaviour is not, and because `0410` touches the owner's own output-style preferences and therefore
cannot ship without a ruling this one does not need.

### ⛔ NOT FROZEN — and the reason is stated so nobody has to re-derive it

[Sprint 11](../../../sprints/sprint-11.md) carries an owner-ruled **migration freeze**, re-founded
2026-09-18 on the gated-B ruling. ⛔ **This task is outside it.** The freeze covers *"re-keying ids,
moving folders, rewriting boards"* — changes to the **stored shape**. This task changes **how the store
is rendered to a reader** and touches **no stored file**. ⚠️ **If it ever proposes changing a board, a
brief or a folder, it has crossed into the freeze and must stop and escalate.**

## What to build

⛔ **MEASURE FIRST. The shape of the fix is decided by the measurement, not by this brief.**

1. **Re-measure the scale figures above**, with the counting rule written down beside each, per
   [`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md).
   At minimum: corpus task count, open-row count on each active board, and `dashboard.sh`'s line count.
2. **Capture the actual output.** Run `/fkit-status` — and `dashboard.sh` underneath it — against the
   **real** tree, for the **active sprints, plural**, resolved deterministically:
   ```
   bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints
   ```
   Save the raw output. ⛔ **Do not summarise it** — the artefact under measurement is its length and
   its shape, and a summary destroys exactly the property being measured.
3. **Score that output against
   [`status-report-format.md`](../../../knowledge-base/conventions/status-report-format.md), rule by
   rule.** Produce a table: each rule, obeyed or not, with the evidence. ⛔ **Every rule, including the
   ones it passes** — a scoring pass that lists only failures cannot distinguish finding (1) from
   finding (3).
4. **Name the finding — (1), (2) or (3) from the table in `## Context` — and say which, in one
   sentence, before proposing anything.**
5. **Then, and only then, fix what the finding says to fix:**
   - **Under (1)** — bring the output into conformance. No convention edit. ⭐ **This is the whole task
     if it is the answer.**
   - **Under (2)** — ⛔ **STOP and split.** The convention is a producer surface; see `## Notes`. The
     convention change goes to the owner as a proposal, and the skill change follows it.
   - **Under (3)** — write the finding, change nothing, and say where the pain actually is.
6. **Whatever ships, these hold:**
   - ⛔ **The canonical status vocabulary is not touched.** The six values in
     [`task-status-vocabulary.md`](../../../knowledge-base/conventions/task-status-vocabulary.md) are
     rendered **verbatim, marker and all**, including the `(agent-closed — not owner-verified)`
     variants. ⛔ **Never invent a value to make a summary tidier** — a report that cannot express a
     distinction must say so, not smooth it.
   - ⛔ **No status is changed, no file is moved, no board row is edited.** This task renders; it does
     not reconcile. `/fkit-status` is read-only by its own definition and stays that way.
   - ⛔ **Drift still shows.** The convention's rule *"A row with drift on it always shows, whatever its
     marker says"* survives any hierarchy. ⚠️ **A hierarchy that hides a drift finding behind
     "detail on request" has traded a readability defect for a correctness one** — that is the single
     biggest risk in this task and it is named here rather than found in review.
   - ⛔ **`dashboard.sh`'s parsed stdout contract is a shipped contract** (ADR-017 rule 4 put it in test
     scope). If the fix changes it, the tests that assert it change in the same commit and the change is
     called out.
   - ⛔ **No `ai-agents/wiki-vault/` write**
     ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
   - ⛔ **Edit the canonical sources in `claude/`, never the gitignored `.claude/` copies.**
   - ⛔ **No `path:NNN` citation into a coordination document** — anchor by heading plus quoted fragment
     ([`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
     `test/coordination-citation-policy.test.js` scans this corpus and backticks hide nothing from it.
   - ⛔ **Nothing under `ai-agents/tasks/done/` or `ai-agents/tasks/cancelled/` is edited** (ADR-034
     freezes closed folders).
   - ⛔ **No commit.**

## Verification steps

1. **The captured "before" output exists as an artefact** in the task folder, at full length, with the
   date and the command that produced it. ⛔ A run with no "before" cannot show an "after".
2. **The rule-by-rule scoring table exists** and covers **every** rule in `status-report-format.md`,
   each marked obeyed or not with evidence.
3. **The finding is named — (1), (2) or (3) — in one sentence, before any proposal.**
4. **If anything changed: an "after" capture exists, produced by the same command on the same tree**,
   and the before/after length is stated in bytes and lines with the counting rule beside it.
5. ⛔ **Every one of the six status values still renders verbatim**, and a search of the "after" output
   for a task known to carry `(agent-closed — not owner-verified)` still finds the marker.
6. ⛔ **A drift case still surfaces at the top level.** Construct or find one and show it is not hidden
   behind a drill-down. ⚠️ **A hierarchy that buries drift is a failed run, not a tradeoff.**
7. `node --test test/*.test.js` passes; `bash test/prove-red.sh` passes.
8. `git diff --stat` shows changes only under `claude/skills/fkit-status/`, `test/`, this task's own
   folder, and — **only under finding (2), and only after the owner has ruled** —
   `ai-agents/knowledge-base/conventions/status-report-format.md`.
9. ⛔ **No file under `ai-agents/tasks/` other than this task's own folder, and no board row, is
   edited.** A board diff means the task was misread as a reconcile.
10. `bash claude/skills/fkit-status/dashboard.sh select-active ai-agents/sprints` still resolves the
    active sprints identically before and after.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing as a hard dependency. ⚠️ **But `0405`'s comparison STEP must not be run before
  this lands** — see the confound section in `## Context`. That is a step-level gate the canonical
  dependency form cannot express.
- **Sibling:**
  [`0410`](../0410-investigate-how-agents-report-status-to-the-owner-in-prose-and-put-a-shape-to-him/brief.md)
  — the same owner sentence, the other surface. ⛔ **Neither subsumes the other.**
- **Owner: `fkit-coder`** — the deliverable is a shipped skill plus a shell script with a stdout
  contract, which is a source surface.
  ⚠️ **The counter-argument, recorded rather than buried:** the *shape* of a status report is a
  **producer** surface — `status-report-format.md` is a producer convention and the owner's own words
  say it is a *"WRITING problem."* ⭐ **The split rule:** under finding (1) the coder does the whole
  thing; ⛔ **under finding (2) the task SPLITS at the plan gate** — the convention change is
  `fkit-producer`'s and goes to the owner as a proposal, and the coder implements what he rules. This
  mirrors `0383`'s precedent, whose `## Notes` already says *"split at the plan gate if the shape
  includes a guard."*
- ⚠️ **The strongest objection to this task, stated rather than answered:** the owner's complaint may be
  about the **content** the reports quote — 57KB briefs and prose-stuffed board cells — and not about
  the report's structure at all. That is what `0383` addresses, and it is finding (3) above. ⭐ **This
  task is filed anyway because the ruling named `/fkit-status` explicitly**, and because measuring is
  cheap and settles the question either way.
- ⚠️ **Priority: Sprint 11 is UNRANKED and no `P<n>` exists on it.** This brief therefore reads
  `## Priority: Unscheduled` and its board row's Priority cell reads `—`, matching every other row on
  that board. ⛔ **Inventing a rank is the act
  [ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)
  forbids** — ranking Sprint 11 is an owner act that has not happened. **On merit this belongs above
  `0405`**, because `0405`'s comparison is confounded until this lands. ⚠️ **That is a merit statement,
  not a rank.**
- ⛔ **Filed by a spawned `fkit-producer` with no owner channel** (ADR-021), executing the mechanics of a
  relayed owner ruling. ⛔ **No commit was made by the act that created this brief**, and nothing was
  written to `ai-agents/wiki-vault/`.
- **Citations here are durable anchors** — heading plus quoted fragment, never `path:NNN` — per
  [`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md).
</content>
</invoke>
