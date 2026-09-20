# Evaluate aiboard as fkit's human-readable board, and design the fkit↔aiboard integration seam

## ID
0404

## Sprint
Sprint 11

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### ⛔ WHY THIS BRIEF EXISTS AT ALL: IT IS A TRANSCRIPT RESCUE

⭐ **Everything in the "What the owner said" section below existed ONLY in a live `fkit lead` session
transcript on 2026-09-18 and would have been lost when that session ended.** Nothing in this repo
mentioned `aiboard` before this brief was filed — verified 2026-09-18 by a recursive case-insensitive
search of `ai-agents/` for the string `aiboard`, which returned **zero** files. The capture is the
primary value of this row; the work described below is secondary to it.

⚠️ **This brief was written by a spawned `fkit-producer` with no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
Every framing choice below the owner's own words is the producer's, and is open to correction.

### What the owner said, 2026-09-18 — his words, relayed by `fkit-lead`

⛔ **These are relayed quotes, not a transcript this producer read.** They reached this brief through
the lead session that held the owner channel. Treat them as the owner's, and treat any gloss around
them as the producer's.

- What aiboard is, one line: **"Jira for AI agents."**
- Where it came from — while working on fkit the owner realised **"it's hard for humans to understand
  the status of the sprint and tasks, and it would be much easier if we had something like Jira or
  Trello for tasks that regular humans can open in the browser and check the cards, their statuses,
  maybe change something like change the status or like move something from one sprint to another."**
- Its state: **MVP phase.** ⛔ **The owner says he has not tested it yet.** It "already does something."
- Its shape: its structure of tasks and sprints **"resembles pretty much what we are doing in fkit,
  but there might be differences."**

### ⭐ The load-bearing architectural intent — the owner's, and it is a constraint, not a preference

1. **fkit would consume aiboard as a dependency.**
2. **aiboard must be usable without fkit** — **"it's like some module that we will attach to fkit, but
   other people can attach the same module to other projects even if they just don't have any
   framework or system, but it might still be useful for them."**
3. **Therefore the dependency arrow points one way: aiboard must not depend on fkit; fkit adapts to
   aiboard, not the reverse.**

⛔ **Constraint 3 is the design's spine.** Any proposal that asks aiboard to learn fkit's folder
layout, fkit's six-value status vocabulary, or fkit's mover procedures has violated the owner's stated
intent, however convenient it is for fkit. The adaptation happens on the fkit side.

### ⚠️ UNDECIDED, AND NOT DECIDED HERE: whether this becomes its own sprint

The owner, verbatim: **"maybe it's worth creating a separate sprint for that, I'm not sure yet."**
⛔ **Recorded as undecided.** This brief is filed unsprinted on the Backlog board for exactly that
reason — not as a judgement that it is low value. **Do not read the Backlog board placement as a
ranking**; that board is an archive of known work, not a queue (owner ruling 2026-08-29, carried in
[`0383`'s brief](../0383-shrink-the-backlog-board-whose-task-cells-are-being-used-as-a-document-store/brief.md)
under its heading *"Notes"*).

#### ⏱ DISCHARGED 2026-09-18 BY OWNER RULING — IT IS ITS OWN SPRINT. The text above is left BYTE-IDENTICAL as the record of what was undecided that morning.

⭐ **Owner ruling, 2026-09-18**, given in a live `fkit lead` session and relayed by `fkit-lead`. The
ruling's own words:

> *"Yes, do its own sprint and I think based on what I answered to you for other questions, it looks
> like we will have a lot of tasks for that sprint. So whenever you discuss something with the aiboard
> lead, and it's worth having a dedicated task for that, add it to that new sprint."*

**What changed on this brief as a result** — the forward-move procedure the Backlog board documents
under its heading *"How work moves on and off this board"*:

| Edit | Value |
|---|---|
| `## Sprint` | `Backlog` → **`Sprint 11`** |
| `## Priority` | **stays `Unscheduled`** — Sprint 11 is **unranked**, so there is no destination rank to name, and inventing one is the act [ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md) forbids |
| `## Status` | ⛔ **UNCHANGED — `🔲 Backlog`. Nothing has started.** |
| Backlog board row | flipped to `➡️ Moved to [Sprint 11](../../../sprints/sprint-11.md)`, **no `— priority M` suffix** (unranked destination). The row is **not deleted**. |
| Sprint 11 board | row added |

⚠️ **The sprint is `Sprint 11`, not `Sprint 10`, and `Sprint 10` is deliberately left empty** —
earmarked by earlier owner rulings for fkit's *own* backlog work. The full reasoning, and the open
owner decision it leaves behind, are on [Sprint 11's board](../../../sprints/sprint-11.md) under its
heading *"READ THIS FIRST"*.

### ⛔⛔ 2026-09-18 — THE OWNER REDIRECTED THE APPROACH. THIS BRIEF'S "What to build" NOW SITS BEHIND TWO STEPS IT DOES NOT DESCRIBE.

⛔ **The "What to build" section below is left BYTE-IDENTICAL and is NOT rewritten.** This is a dated
note beside it, per the house pattern. ⛔ **It records a gap; it does not amend the section** — amending
it belongs to whoever picks this task up after step 2 below has run.

**The owner's words, verbatim, 2026-09-18:**

> *"I think you can work with the aiboard lead and ask it first to adapt to our needs. So you said that
> the dependencies are different for fkit and aiboard — fkit depends mostly only on Node and aiboard
> depends on Python and some other stuff. We can start from swapping that dependency from Python to
> Node for aiboard, so both will depend only on Node. The next step can be for you and aiboard lead to
> discuss the differences in the structure of tasks and sprints and to figure out what's the best from
> the two. Or maybe one of the two is the better approach than the other. And when you figure it out,
> you can report back to me and ask for my final decision. So basically right now, both fkit and
> aiboard are only used by me. So we are very flexible about what we are doing here. At this moment we
> can basically make sure they match each other, and we can adapt them to our needs to make sure they
> work together seamlessly."*

**The shape is now three ORDERED steps:**

1. **Port aiboard from Python to Node** — aiboard-side work, tracked on **aiboard's own board**.
2. **The two leads compare fkit's and aiboard's task/sprint structures and pick the best of the two** —
   possibly one wholesale, possibly a mix.
3. **Report back and ask the owner for his final decision.**

⭐ **What this does to this brief, stated plainly:** its **step 3** (map the two models field by field)
is now the substance of **step 2 above** and is still exactly right. Its **steps 4–6** (choose a
data-flow shape, define the adapter seam, cost and risk) are **downstream of convergence** — the seam
is designed against whatever structure step 2 picks, not against today's mismatch. ⛔ **A run that
designs an adapter against the pre-port, pre-convergence layout has designed against a layout that is
being deliberately changed.**

⭐ **aiboard-lead's own recommendation — a read-only adapter first — is DEFERRED BEHIND CONVERGENCE,
NOT REJECTED.** Recorded so it is neither re-proposed as new nor lost as refused. If convergence
stalls, it is the standing fallback.

### ⚠️ Open owner decisions as of 2026-09-18 — three, and none may be settled between agents

| # | Decision | State |
|---|---|---|
| **D1** | **Write-back appetite — would a browser drag-to-Done forge a close?** (Constraint A below, put to the owner as a question) | ⚠️ **DEFERRED, NOT DROPPED.** Asked 2026-09-18, **not answered**; the new sequencing places it **after** convergence, and `fkit-lead` is holding it for the step-3 decision gate. ⛔ Deferred on **sequencing**, not on merit — it is the highest-risk design question here. |
| **D2** | **Cross-project read access to the aiboard repository, fkit side, read-only** | ⭐ **Treated as GRANTED — BY IMPLICATION, not by an explicit answer.** The owner granted the mirror direction explicitly (aiboard-lead may read fkit's tree read-only) and told the two leads to *"figure out what's the best from the two"* structures, which cannot be done without reading both. `fkit-lead` has told the owner it is proceeding on that reading **so he can correct it.** ⛔ An inference the owner can overturn, never an answer he gave. |
| **D3** | **Adoption itself** | ⛔ **Unchanged and still the owner's alone.** Step 3 above is the act of putting it to him. |

### ⛔ THE STANDING CONSTRAINT SURVIVES THE REDIRECT — the owner has not withdrawn it

⭐ **aiboard must remain usable by someone with no fkit and no framework at all.** So **"converge" must
never mean "aiboard absorbs fkit's concepts"**: aiboard must not take on as core concepts **fkit's role
model**, **fkit's four mover procedures and their producer-only rule**, or **the literal
`(agent-closed — not owner-verified)` marker**.

⚠️ **The tension is real, and restating the constraint does not resolve it.** The owner has *also* now
said *"we can basically make sure they match each other"*, which invites movement on **both** sides
where the earlier constraint pointed the adaptation one way only. ⭐ **The reconciliation this task
works to until the owner says otherwise:** convergence may change **shared, generic** board concepts
(id format, folder layout, status names, where a sprint lives); it may **not** push fkit's
**governance** concepts into aiboard's core. ⛔ **A proposal that cannot be placed on one side of that
line is an owner question, not a producer judgement.**

### The coordination channel now in flight — ⛔ THE PART MOST AT RISK OF BEING LOST

Two Claude Code sessions are talking over cross-session messaging:

| Address | Which session |
|---|---|
| `fkit-lead` | this project's lead session |
| `aiboard-lead` | the aiboard project's lead session |

**The owner named both addresses.** On **2026-09-18** `fkit-lead` sent `aiboard-lead` an opening
message asking **six** questions:

1. **Honest status inventory** — what actually runs versus what is stubbed.
2. **Data model** — how a task, a sprint and a status are represented, and **where that data lives**.
3. **Read versus write** — does the browser UI write back, and if so **what** does it write and
   **where**.
4. **Packaging** — npm package, git dependency, local server, static build; and the shape of the
   **install and run command**.
5. **Adapter surface** — is there a pluggable reader/provider interface, or does aiboard assume its
   own storage layout?
6. **Stack, runtime, dependencies.**

⛔ **THE ANSWER HAD NOT ARRIVED WHEN THIS BRIEF WAS FILED (2026-09-18).** The section reserved for it
is below, empty and clearly marked. **Whoever picks this task starts by checking whether the reply
landed** — and if it did not, chases it rather than guessing at answers, because every one of the six
is load-bearing for the seam.

### 📥 RESERVED — `aiboard-lead`'s reply

> ⛔ **EMPTY AS OF 2026-09-18. Do not delete this section; fill it.** Paste the reply here, dated,
> attributed, and question-by-question against the six above. Mark any question the reply does not
> answer as **still open** rather than inferring an answer — an inferred answer to Q3 (write-back) or
> Q5 (adapter surface) is exactly the kind of guess that produces a wrong seam.

#### ⭐ THE REPLY LANDED 2026-09-18 — recorded below. The blockquote above is left BYTE-IDENTICAL; its "EMPTY AS OF 2026-09-18" line is superseded by this section, not rewritten.

⛔ **PROVENANCE, AND IT IS LOAD-BEARING.** Everything below is **reported by `aiboard-lead`**, which
says it verified it in aiboard's own files on **2026-09-18** at that repo's HEAD **`df554b9`**, and
relayed through `fkit-lead`. ⛔ **No fkit agent read aiboard's tree.** Treat every line as
reported-by, not as measured-here, until someone re-verifies it.

| Q | What was asked | Answer | State |
|---|---|---|---|
| **1** | Honest status inventory — what runs vs what is stubbed | **41 tests pass** (unittest discovery, ~3.3s). `aiboard check` reports *"OK: board is consistent"*. **Nothing stubbed.** Its own board holds **17 done, 2 backlog, 1 cancelled, 3 sprints**. | ✅ Answered |
| **2** | Data model — task, sprint, status, and where the data lives | A root manifest file; `tasks/{backlog,in-progress,done,cancelled}/T-001-slug/` each holding a brief, a worklog and a comments file; `sprints/{backlog,in-progress,done,cancelled}/S-001-slug/` holding a sprint file. ⭐ **Status is the FOLDER and nothing else** — a cancelled task `T-008` ("Store status inside brief.md as well") carries the reasoning in its body: *"Rejected: two sources of truth. The folder is the status."* | ✅ Answered |
| **3** | Read vs write — does the UI write back, what and where | **It writes by default**; `--read-only` opts out. A drag between columns **moves the task folder**, appends a worklog entry, touches an `updated` field and re-renders the sprint checklist. ⛔ **No roles, no close procedure, and no field for fkit's `(agent-closed — not owner-verified)` marker.** | ✅ Answered |
| **4** | Packaging, and the install/run command | **Python ≥ 3.9, ZERO dependencies, stdlib only.** Not on PyPI; installed from git via `pipx`. ⛔ **Not a library fkit can import — fkit is Node.** | ✅ Answered — ⭐ **and now superseded by the owner's port ruling; see the 2026-09-18 annotation below.** |
| **5** | Adapter surface — pluggable provider, or own layout assumed | ⛔ **ZERO adapter seam.** Pointed at fkit's `ai-agents/` it finds **zero** tasks: fkit's `0042-slug` ids fail its id pattern and are **skipped silently**; it wants all four status directories including `in-progress`; it expects a per-sprint folder with a sprint file, not fkit's markdown tables; and it has **no field** for the brief's `## Status`. | ✅ Answered |
| **6** | Stack, runtime, dependencies | As Q4 — Python stdlib only, no third-party dependencies. | ✅ Answered |

⚠️ **Volunteered, not asked, and it is the most consequential thing in the reply — SCALE.** Largest
board aiboard has ever exercised is **20 tasks**, against fkit's **234**. Every listing re-reads every
brief, worklog and comments file from disk; the board endpoint is a **full rescan**, polled every **3
seconds** by the UI. File locking **silently no-ops on Windows**. **No watch mode.**

⭐ **The owner ruled "benchmark first" on 2026-09-18** — measure at fkit's real scale before designing
any seam. ⚠️ **That survives the Python→Node port**, because the property being measured is
**architectural, not Python-specific**: a Node rewrite of a full-rescan-per-poll algorithm has the
same cost curve.

⛔ **Nothing among the six is still open.** What remains open is the owner's, not aiboard's — see the
open-decision annotation below and [Sprint 11's board](../../../sprints/sprint-11.md).

### ⛔ THE TWO fkit-SIDE CONSTRAINTS ANY WRITE PATH MUST RESPECT — this is the real integration risk

⭐ **These are not preferences and they are not negotiable inside this task.** They were flagged to
`aiboard-lead` on 2026-09-18 and are restated here because a browser board that writes back is where
they break.

**Constraint A — closing a task is not a status edit.**
A task reaches `done/` or `cancelled/` **only** via the four mover procedures, **only** the producer
may invoke them, and anything an agent closes **must** carry the literal marker
`(agent-closed — not owner-verified)`
([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)).
A close also **moves the task's folder**
([ADR-029](../../../knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md))
and updates the sprint plan. ⛔ **A browser "drag the card to Done" that simply rewrites a status cell
is therefore not a close — it is a forged one.** It leaves the folder in `backlog/`, leaves the brief's
`## Status` untouched, and skips the marker. Any write path must either refuse this transition or route
it into the mover procedure.

**Constraint B — a task's status is duplicated, and both copies must move together.**
Status lives in **two** places: the brief's own `## Status` field, and the sprint board row's status
cell. ⛔ **A writer that updates one and not the other manufactures precisely the drift class our
tooling exists to detect** — `dashboard.sh`'s drift rules compare the two carriers and report a
`drift disagreement`, and a drifted row always renders. Two worked examples of this exact failure,
with the empirical evidence, are written into the Backlog board's own header under its heading
*"How work moves on and off this board"*.

⚠️ **A third, smaller one, stated so it is not discovered late:** the six legal status values are fixed
([`task-status-vocabulary.md`](../../../knowledge-base/conventions/task-status-vocabulary.md)), and
`➡️ Moved` carries a mandatory target marker. A Kanban UI's column set is **not** free to be whatever
the UI finds convenient.

### The measured pain that motivates this — ⚠️ RE-MEASURED BY THE FILING PRODUCER, 2026-09-18

⛔ **The figures relayed from the 2026-09-16 status briefing did not all reproduce.** Both readings are
recorded, with the counting rule beside each, rather than one being silently preferred.

| What was counted | Relayed, 2026-09-16 | Re-measured 2026-09-18 by this producer |
|---|---|---|
| `ai-agents/sprints/backlog.md`, **rendered** board output (`dashboard.sh`, bytes of stdout) | **425,240 bytes** | **441,959 bytes** |
| The same file **on disk** (bytes) | *(not relayed)* | **857,403 bytes** |
| Table data rows (lines starting `\|`, minus header and separator) | **231** | **234** |
| Rows whose status cell reads `🔲 Backlog` | **113 "unscheduled"** | **122** |
| Longest single Task cell (characters, 4th pipe-delimited field) | **15,650** | **17,577** |

**Reading the discrepancies honestly:**
- ✅ **Rendered bytes, rows and open count reconcile as two days of growth.** The trend is consistent
  with `0383`'s own 2026-09-10 measurement of **770,306 bytes on disk / 210 rows**.
- ⚠️ **The relayed "425,240 bytes" is the RENDERED output, not the file.** The file was already ~2×
  that on 2026-09-10. Anyone quoting a board size must say **which** of the two numbers they mean.
- ⛔ **The longest-cell figure does NOT reconcile.** `15,650` (relayed, 2026-09-16) sits *below*
  `17,187` (measured by `0383`, 2026-09-10), and cells only grow. **One of the two used a different
  extraction rule.** This is unresolved, and it is exactly the reconciliation failure `0383`'s brief
  warned would repeat if counting rules go unwritten. ⛔ **Re-measure at pickup; do not trust any
  number in this table.**

⭐ **COUNTING-RULE CLARIFICATION, added 2026-09-18 — the "Re-measured 2026-09-18" column is CONFIRMED
CURRENT, not stale.** `fkit-lead` re-stated today's measurements independently and they reproduce that
column **exactly**: rendered **441,959** bytes, on disk **857,403** bytes, **234** data rows, **122**
`🔲 Backlog` rows, longest cell **17,577** characters. ⚠️ **One counting rule was missing, and it is
written down here because it is precisely the ambiguity this table complains about:** the **234** row
count **excludes this task's own row** — the board reads **235** data rows with `0404` counted. ⛔ **The
longest-cell discrepancy stays UNRECONCILED. This note does not smooth it.**

### ⚠️ Relationship to `0383` — cross-reference, NOT a duplicate

[`0383`](../0383-shrink-the-backlog-board-whose-task-cells-are-being-used-as-a-document-store/brief.md)
("Shrink the Backlog board, whose Task cells are being used as a document store") touches **the same
pain from the opposite end**:

- **`0383` fixes the artifact** — the markdown board is too big because its cells are being used as a
  document store. It is a producer surface, it ships no source, and it changes nothing about who reads
  the board.
- **`0404` (this task) questions the medium** — whether a browser board should exist *alongside* the
  markdown, and what the seam looks like.

⛔ **Neither replaces the other, and neither blocks the other.** ⚠️ **But if aiboard is adopted and
reads the markdown board, `0383`'s chosen shape changes what aiboard has to parse.** Whoever runs the
second of the two must re-read the first. ⭐ **`0383`'s hard constraint that `dashboard.sh`'s parsed
contract does not change is the thing that keeps them compatible** — say so in the findings.

## What to build

⛔ **THIS IS EVALUATION AND INTEGRATION-DESIGN. IT IS NOT IMPLEMENTATION, AND IT IS NOT AN ADOPTION
DECISION.** Nobody has decided fkit will adopt aiboard. ⭐ **The adoption call is the owner's alone** —
this task's job is to make that call an informed one. **A run that arrives having already decided to
adopt, or already written integration code, has failed.**

**The deliverable is one written artifact** under `ai-agents/knowledge-base/reports/`, dated, that
answers two questions and no more:

1. **Can aiboard serve as fkit's human-readable board?**
2. **If so, where exactly is the seam?**

Work it in this order:

1. **Check for `aiboard-lead`'s reply first.** Fill the reserved section above. If it has not arrived,
   chase it through the owner's lead session and **stop here** rather than guessing — the six questions
   are the task's inputs, and ⛔ **an evaluation written without them is fiction with a report layout.**
2. **Establish the honest baseline.** From the reply (and, if the owner grants access, the aiboard repo
   itself): what runs, what is stubbed, what the data model is, whether the UI writes back. ⛔ **Record
   "not tested by the owner" as a stated fact about the MVP, not as a criticism** — it is the owner's
   own characterisation.
3. **Map aiboard's task/sprint/status model against fkit's, field by field.** The owner's words are
   *"resembles pretty much what we are doing in fkit, but there might be differences."* **The
   differences are the entire technical content of this task.** At minimum, map: task identity
   (fkit's permanent four-digit folder ID, ADR-029), sprint membership, the **six** status values,
   `## Owner`, priority-as-board-rank, and the `➡️ Moved` marker with its target.
4. **Decide the direction of data flow, and say it plainly.** Candidate shapes, **none recommended
   here** — the evaluator picks with evidence:
   - **(a) Read-only mirror.** aiboard reads fkit's markdown; humans look, and change nothing.
     Cheapest, satisfies the owner's *"check the cards, their statuses"*, satisfies **none** of his
     *"maybe change something."*
   - **(b) Read, plus write-back restricted to the safe transitions** — the ones any session may set
     (`🔄 In progress`, `🚧 Blocked`) — with closes refused in the UI and routed to the producer.
   - **(c) Read, plus full write-back including closes**, by having the write path invoke fkit's mover
     procedures rather than editing cells. **Highest value, highest risk**, and it puts the
     `(agent-closed — not owner-verified)` marker question squarely on the table.
   - **(d) aiboard owns the data; the markdown becomes a projection.** ⛔ **Names the biggest question
     in the whole evaluation** — it inverts fkit's current source of truth. Include it so it is
     rejected on evidence rather than by omission.
   - **(e) Something else.**
5. **Define the adapter seam, honouring the one-way dependency.** Name the interface fkit implements
   (or the file format fkit emits) so that **aiboard learns nothing about fkit**. If aiboard has no
   pluggable provider today, say so, and state what it would need — as a **request to the aiboard
   project**, not as work fkit does inside aiboard.
6. **State the cost and the risk in the same breath as the recommendation.** Packaging, runtime, new
   dependencies, and what breaks when aiboard changes under fkit.
7. **Write the findings, and stop.** ⛔ **No integration code.** ⛔ **No ADR is recorded by this task** —
   if the findings warrant one, the follow-on is a separate `/fkit-record-decision` run against the
   owner's actual ruling.

**These are hard:**

- ⛔ **Constraints A and B above are not solvable by the UI's convenience.** Any proposal that writes
  back must say, explicitly, what it does about closes and about the duplicated status.
- ⛔ **No secrets in the artifact** — no endpoints, DSNs, tokens or credentials from either project.
  This goes to git.
- ⛔ **No `ai-agents/wiki-vault/` write**
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ **No `path:NNN` citation into a coordination document** — anchor by heading plus quoted fragment
  ([`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md)).
  `test/coordination-citation-policy.test.js` scans this corpus, and backticks hide nothing from it.
- ⛔ **Nothing under `ai-agents/tasks/done/` or `ai-agents/tasks/cancelled/` is edited** (ADR-034
  freezes closed folders).
- ⛔ **No commit.**

## Verification steps

1. **The reserved reply section is filled**, dated and attributed, with each of the six questions
   either answered or explicitly marked **still open**. ⛔ **A section still reading "EMPTY AS OF
   2026-09-18" is a failed run**, unless the artifact states that the reply never arrived and names
   the date it was last chased.
2. **A dated report exists** under `ai-agents/knowledge-base/reports/` and answers both framing
   questions ("can it serve", "where is the seam") in its own words. ⛔ Not in the wiki.
3. **The model map from step 3 is present as a table**, and every one of the six fkit status values
   appears in it with its aiboard counterpart or an explicit "no counterpart".
4. **The chosen data-flow shape is named, with its rejected alternatives and the reason each was
   rejected.** A report that presents five options with no recommendation has not done the work.
5. **Constraints A and B are each answered explicitly** in the report, by name. A search of the report
   for the literal string `(agent-closed — not owner-verified)` finds it.
6. **The one-way dependency is demonstrated, not asserted** — the report states what aiboard would have
   to know about fkit under the chosen shape, and that answer is **nothing**, or the divergence is
   flagged to the owner as a departure from his stated intent.
7. **Every figure in the "measured pain" table is re-measured at pickup**, with the counting rule
   written beside it, and the unresolved longest-cell discrepancy is either reconciled or re-stated as
   still unreconciled.
8. `git diff --stat` shows **no source change and no file under `ai-agents/tasks/`** other than this
   task's own folder. ⛔ **A source diff means the task was misread as implementation.**
9. `node --test test/*.test.js` passes — this task ships no code, so it must not move that needle.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- ⛔ **"Depends on: nothing" is a statement about TASKS, and it is not the whole picture.** This task is
  gated on an **information** input that is not a task and that `dashboard.sh` cannot see:
  **`aiboard-lead`'s reply to the six questions, unanswered as of 2026-09-18.** ⚠️ **The board will
  show this row as pullable. It is not, until that reply lands.** Stated here because the canonical
  dependency form has no way to say it
  ([`dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md)).
- **Owner: `fkit-architect`** — ⭐ **deliberately not `fkit-coder`.** The deliverable is a feasibility
  and design consult that precedes any code: the unknowns are technical (data model, packaging,
  adapter surface, whether a write path can respect the mover invariants), which is the architect's
  seat per
  [`task-owner-vocabulary.md`](../../../knowledge-base/conventions/task-owner-vocabulary.md) —
  *"design consistency, feasibility, ADRs"*. ⚠️ **The counter-argument, recorded rather than buried:**
  the output feeds a **product** decision (adopt or not), which argues `fkit-producer`. It is not
  taken, because the producer cannot judge the six questions that decide the answer. ⛔ **Either way
  the adoption decision itself is the owner's, and neither role makes it.**
- ⚠️ **If the findings lead to adoption, this task does NOT grow into the implementation.** The natural
  follow-on split, available only once findings exist and reviewed with the owner, is at least: **(i)**
  the adapter/emitter fkit implements, **(ii)** the write-back path with its mover routing, **(iii)**
  packaging and the install/run command, **(iv)** an ADR recording the owner's ruling. ⛔ **Do not
  pre-file those** — investigation-first; their shape is unknown until step 3's map exists.
- ⚠️ **Cross-reference, not a dependency:**
  [`0383`](../0383-shrink-the-backlog-board-whose-task-cells-are-being-used-as-a-document-store/brief.md).
  Same pain, opposite end — see the Context section under its own heading. ⛔ **They must not run
  concurrently if this task's findings reach the markdown board's shape**, which they only do under
  data-flow shape (d).
- ⚠️ **aiboard is a SEPARATE PROJECT with a separate repository.** ⛔ **This task writes nothing into
  it.** Anything aiboard must change is a **request** carried back through `aiboard-lead`, and the
  owner owns both sides.
- **Unranked**, per the Backlog board's archive-not-queue rule. ⛔ **Nothing was re-ranked by this
  filing**, and the row was **appended last**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
- ⚠️ **One brief, not several — the split rationale, recorded because decomposition is the default.**
  The two halves ("can it serve" and "where is the seam") are **not independently shippable**: the seam
  cannot be designed before the evaluation, both land in one decision-support artifact for one owner
  decision, and splitting the capture would scatter a conversation that exists nowhere else. ⭐ **The
  real split comes after the findings**, and is listed above.

## ⭐⭐ FIRST REAL USER EVIDENCE — appended 2026-09-18. THIS SECTION IS THE CANONICAL RECORD.

⛔ **Read this before anything above it.** Every section above says, in one wording or another, that
**nobody has ever used either board for the purpose it exists for** and that *"every claim about which
is easier to read is currently an assertion."* ⭐ **That is no longer true.** The owner has now used a
board against real content, and said what he thought. This section is that evidence.

⭐ **It is recorded here, on `0404`, because this brief is where the durability argument was made** —
see its own heading *"WHY THIS BRIEF EXISTS AT ALL: IT IS A TRANSCRIPT RESCUE"*. The evidence existed
**only in a live `fkit lead` session transcript on 2026-09-18** and would have been lost when that
session ended, which is the exact failure this row was filed to prevent. A **verbatim duplicate** of
the owner's words is also appended to
[`0405`](../0405-investigate-a-terminal-ui-for-the-board-and-compare-it-against-the-web-board/brief.md)
under its heading *"FIRST REAL USER EVIDENCE"*, because the second half of what he said is about a
terminal UI and `0405` must not be worked without it. ⛔ **`0405`'s copy is a duplicate of this
section, not an independent record. If the two ever disagree, THIS one is canonical.**

### ⭐⭐ THE OWNER'S OWN PROSE — HE TYPED THIS. IT IS NOT SELECTED OPTION TEXT.

⛔ **This differs from every other owner record filed on 2026-09-18, and the difference is
load-bearing.** Every other ruling captured today reached the record as **relayed** text or as an
option the owner **selected** from choices an agent wrote. ⭐ **This is his own free text, typed by
him.** It may be quoted as his words. ⛔ **A future reader must not blur the two — do not let this
section acquire the relayed-text caveat that correctly sits on the others.**

> *"It's kind of useful, because I can see all the cards and read the details there by clicking the
> cards. When I open .md files the text is hard to read and is too huge to consume, the board allows me
> to see the titles and descriptions in a more readable way. When I ask agents in terminal about
> providing me the status of the sprint/tasks — it's also kind of hard to read when there are a lot of
> tasks and texts. I don't know if it can be improved to make it user-friendly in the Terminal-UI (I
> can think of some 'unusual' approaches, like using ASCII or 'rendering' the HTML here with some
> 'symbol-based-renders', maybe it will help and make the web-HTML board not needed, I don't know)."*

### What he actually used — real content, real scale, not a demo

| | |
|---|---|
| **The artifact** | `fkit-external-expert`'s read-only spike, built specifically so the owner could close this gap |
| **The UI** | aiboard's **unmodified** browser UI |
| **The data** | fkit's **unmodified** tree |
| **Scale** | **405 real tasks** |
| **Preserved at** | this task's own `assets/external-expert-spike/` |

⭐ **So the evidence is against real content at real scale.** ⛔ **It is not a demo, not a sample, and
not a mock-up** — which is what makes it usable as evidence at all.

⚠️ **What it is still NOT.** One user, one sitting, free-form impressions, **no side-by-side against a
terminal rendering** (none exists to compare against). It settles *"has anyone ever used it"*. It does
**not** settle *"which of web and terminal is more readable"* — that comparison is `0405`'s deliverable
and this evidence is an **input** to it, not a substitute for running it.

### ⚠️ `fkit-lead`'s reading of it — ATTRIBUTED, UNCONFIRMED, AND SELF-FLAGGED AS POSSIBLY MOTIVATED

⛔ **Everything in this subsection is `fkit-lead`'s interpretation, not the owner's words.** It is kept
**below** and **visually separate from** the quote above so the two are never read as one thing.
⚠️ **Status: UNCONFIRMED.** `fkit-lead` sent it to `aiboard-lead` to attack on 2026-09-18 and
**`aiboard-lead` has not answered.**

> *The mechanic he named is **overview plus drill-down on demand** — see many titles at once, open one
> for detail. Not "cards", not "a browser". It is the thing neither existing tool gives him: raw
> markdown is all detail and no overview; a linear status report is a wall of text. If that reading
> holds, his requirement is a **presentation** requirement, which is where `fkit-external-expert`'s
> verdict already put the problem — and overview-plus-drill-down is the native shape of a terminal UI,
> not a stretch for one.*

⛔⛔ **`fkit-lead`'s OWN warning about its own reading, recorded at its own request and not softened:**
it *"may be fitting his words to a conclusion I already preferred,"* and it *"has been caught doing
that twice today."* ⭐ **His words are the evidence. This reading is a hypothesis.** Anyone using this
section must carry both labels forward, or re-derive the reading from the quote itself.

### ⭐ A SECOND, DISTINCT FINDING — it is about THIS TEAM, not about tooling

⛔ **Recorded as its own finding, deliberately NOT folded into the terminal-UI question.** The owner
said terminal status reports are *"kind of hard to read when there are a lot of tasks and texts."*

⭐ **That is direct feedback on `/fkit-status` and on how this team reports to him.** It may be fixable
with **no UI at all** — by reporting less, or hierarchically. ⚠️ **A TUI that papers over verbose
reporting treats a symptom**, which is why it is kept separate: if the reporting is the problem, a new
renderer hides it rather than fixing it, and the cost is paid twice.

⛔ **NOT ACTED ON. No task is filed for it and no fix is scoped** — `fkit-lead` has **not** put it to
the owner. ⭐ **It is recorded here solely so it is not lost.** Whoever raises it with the owner does so
as a new question, not as an approved item.

### ⛔ WHAT THIS EVIDENCE DOES *NOT* DO

- ⛔ **The convergence decision is NOT ruled.** `fkit-lead` is putting it to the owner. **Do not
  anticipate it.**
- ⛔ **The Sprint 11 migration freeze is NOT lifted, and nothing is re-scoped on the strength of this
  feedback.**
- ⛔ **It is not an adoption decision.** Adoption is **D3** in the open-decision table above and remains
  the owner's alone.
- ⛔ **Nothing above this section was changed by this append** — it is additive, per the house
  dated-note pattern.

---

## ⭐⭐⭐ THE CONVERGENCE DECISION IS RULED — 2026-09-18, LATE. THIS SECTION IS THE CANONICAL RECORD.

⛔⛔ **READ THIS BEFORE ANYTHING ELSE IN THIS FILE, INCLUDING THE SECTION IMMEDIATELY ABOVE IT.** The
section above ends *"The convergence decision is NOT ruled… Do not anticipate it."* ⭐ **It is now
ruled.** ⛔ **That sentence is left BYTE-IDENTICAL** — it is the true record of where things stood
earlier the same day — **and it is superseded by this section, not rewritten.**

⛔ **Nothing above this section was changed by this append.** Additive, per the house dated-note
pattern.

**Authority.** Given live via `AskUserQuestion` in an `fkit lead` session on 2026-09-18 and relayed
into a spawned `fkit-producer` which has **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).

### The ruling — ⚠️ SELECTED OPTION TEXT. An option an agent wrote; he chose it.

⛔ **Not his own free prose.** His own prose is the next section, and the two are kept apart
deliberately — this brief's own heading *"THE OWNER'S OWN PROSE — HE TYPED THIS"* above already
establishes that the distinction is load-bearing here.

> *"**B, but only after aiboard proves itself** — Accept B as the destination, run A now as the
> interim. You get the board immediately, and commit to the migration only once the Node port lands,
> T-022 is fixed, and you've used it on real work for a while. Slower to the end state; nothing
> irreversible happens early."*

**Where A and B are.** ⭐ **Both are ONE store. Neither duplicates.**

| | Shape | Who stores the tasks | Ruled |
|---|---|---|---|
| **A** | fkit's `ai-agents/` tree stays the single store; aiboard reads it through a pluggable reader and renders the board. No migration, no duplication. ⭐ Already demonstrated by `fkit-external-expert`'s **129-line** read-only spike, preserved at this task's own `assets/external-expert-spike/`. | fkit | ✅ **THE INTERIM — RUN NOW** |
| **B** | **aiboard becomes the single store**; fkit reads and writes through it. Moving all 404 tasks into aiboard's shape, and teaching fkit's movers, status tooling and skills to work through aiboard. | aiboard | ⭐ **THE DESTINATION — GATED** |

⛔ **This answers step 4 of `## What to build` above** — *"Decide the direction of data flow, and say it
plainly."* ⭐ **The owner picked its candidate (d)**: *"aiboard owns the data; the markdown becomes a
projection"* — the option that step listed precisely so that it would be *"rejected on evidence rather
than by omission."* ⛔ **It was not rejected. It was chosen, and gated.**

### ⭐⭐ THE OWNER'S OWN PROSE ON WHY B IS THE DESTINATION — HE TYPED THIS. IT IS NOT SELECTED OPTION TEXT.

⛔ **Do not let this acquire the selected-text caveat that correctly sits on the block above.** It may be
quoted as his words.

> *"If we ever achieve the situation where F-Kit uses AI board, it only makes sense if we have one
> storage for the tasks and sprints. We never should duplicate them. If I understand you correctly,
> what you are right now suggesting is that we basically have the main tasks in F-Kit and kind of
> create duplication for AI board to be able to represent them. That's not what I want. If we ever use
> AI board as a dependency for fkit, it should be the single and the only storage for tasks. I want to
> avoid situations where the duplication is even possible, because if we do duplicate tasks it will
> lead to a bunch of bad stuff like desynchronization, what is the source of truth, remembering that
> many tasks should be changed at the same time, many files should be changed at the same time, etc."*

⭐ **Note how exactly this converges with aiboard's own cancelled `T-008`** — quoted under this board's
division-of-boards reasoning as *"Rejected: two sources of truth. The folder is the status."* ⛔ **The
owner and aiboard's own history reached the same rule independently.**

### ⚠️⚠️ THE CORRECTION THAT PRODUCED IT — an AGENT'S ERROR, recorded at that agent's own request

⛔ **`fkit-lead` recorded this against itself and asked that it not be softened.**

The owner **initially understood the adapter to mean duplicating tasks into a second store.** ⛔ **It
does not** — the spike reads fkit's files **live** and **writes nothing**. `fkit-lead` had used the
words *"adapter"* and *"seam"* **without ever explaining them**, and the misunderstanding followed from
that.

⭐ **Once corrected, he still held the principle: if aiboard is ever the dependency, it must be the
only store.** ⛔⛔ **So B is chosen on PRINCIPLE, not on a misunderstanding.** Anyone tempted to
re-litigate B as *"he only picked it because he was confused"* is wrong, and this paragraph is the
reason that argument is closed rather than open.

⚠️ **The reusable lesson:** *"adapter"* and *"seam"* are agent vocabulary. Put to the owner, they read
as *"a second copy."* ⭐ **Say what reads what, and what writes what, in plain words.**

### ⛔ WHAT THIS PARTIALLY SUPERSEDES — `fkit-external-expert`'s verdict, ON THE ENDPOINT ONLY

⚠️ **Precision matters, because the verdict is NOT wrong and ⛔ ITS FILE IS NOT EDITED.**

[The verdict](../../../knowledge-base/reports/2026-09-18-external-expert-verdict-on-fkit-aiboard-convergence.md)
opens, under its heading *"0. The verdict in six lines"*, with *"Do not converge the two storage
models. Not now, not staged, not as a goal."*

| | The verdict said | The owner ruled |
|---|---|---|
| **The path** | Adapter first, read-only; *"Converge the view contract instead"* | ⭐ **ADOPTED** — that is A, and A runs now |
| **The endpoint** | **No storage convergence, ever** | ⛔ **OVERRIDDEN** — B is the destination, gated |

⛔ **Record it that way and no other way: adopted on the path, overridden on the destination.** ⛔ **The
verdict's file is not edited** — a report records what its author concluded, and editing it would make
the record say something its author did not say. ⭐ **This section and
[Sprint 11](../../../sprints/sprint-11.md) are where the supersession lives.**

⚠️ **Carry the verdict's own self-assessment forward with it**, from its heading *"6. Where I think each
party is wrong"*: *"I have a bias toward not building, and this verdict is what that bias produces."*
⭐ **The owner weighed exactly that and still took the endpoint the other way.**

⚠️ **The verdict's owner-decision #1 is therefore ANSWERED, and answered NO on its first clause:** it
asked him to *"Accept 'no storage convergence'"*. ⛔ **He did not.** Its other two clauses — re-scoping
Sprint 11 around the port, the deterministic movers and a re-scoped `0383` — ⭐ **survive and are what
Sprint 11 now is.**

### ⭐ WHAT THIS TASK NOW IS — re-scoped, and `## What to build` above is PARTLY DISCHARGED

⛔ **`## What to build` is annotated, not rewritten. Its text is BYTE-IDENTICAL.**

| Step above | Fate |
|---|---|
| **1** — check `aiboard-lead`'s reply | ✅ **DISCHARGED** — the reply landed and is recorded in this brief's reserved section |
| **2** — establish the honest baseline | ✅ **DISCHARGED** by the evaluation report and the verdict |
| **3** — map the models field by field | ✅ **DISCHARGED** by the verdict's 10 points and 12 questions |
| **4** — decide the direction of data flow | ✅ **DISCHARGED BY THE OWNER** — candidate **(d)**, gated. ⛔ **Not an agent's to revisit.** |
| **5** — define the adapter seam | ⭐ **THIS IS WHAT THE TASK NOW IS** — the **interim (A)** seam |
| **6** — cost and risk with the recommendation | ⭐ **SURVIVES**, and is now sharper: the cost of A is small, and the cost of B is the gate |
| **7** — write the findings and stop | ⚠️ **CHANGED.** The task is no longer only a report. ⭐ **A is the ruled interim, so this row's deliverable is a reader the owner ACTUALLY USES**, not a scratchpad spike. ⛔ **Still no migration code, still no id re-keying, still no mover changes.** |

⭐ **STARTABLE.** ⛔ **It is outside the migration freeze** — it writes nothing and changes no stored
shape. ⚠️ **What held it was a pending decision, and that is gone.**

⛔ **What it still may NOT do**, and these are hard:
- ⛔ **No id re-keyed, no task or sprint folder moved, no board rewritten.** That is B, and B is frozen
  behind the gate.
- ⛔ **No write path of any kind.** A is read-only by definition, and the write question is **D1**, which
  now belongs at the **B gate**.
- ⛔ **Nothing is written into aiboard's repo.** Anything aiboard must change is a **request** through
  `aiboard-lead`.

### ⭐ NEW EVIDENCE, 2026-09-18 — `aiboard-lead` ran fkit's real 408-brief corpus through aiboard

⛔ **Measured by `aiboard-lead` in aiboard's own repo, through aiboard's public API, on 2026-09-18.**
⛔ **NOT read, run or verified by this producer.** Provenance stated rather than blurred, per
[`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md).

⛔⛔ **RECORD BOTH HALVES AT EQUAL WEIGHT. A later summary carrying only one of them has misreported
this.**

**⛔ THE BUG — zero-padded ids are SILENTLY DESTROYED, and EVERY fkit id is zero-padded.**

- `"0404"` written to any front-matter field **reads back as `404`** and lands on disk as `404`.
  `"0013"` → `13`. `"007"` → `7`. ⛔ **No error. A second write does not restore it.**
- **Cause:** its scalar parser coerces an all-digit string to an integer and dumps it back unquoted.
- ⚠️⚠️ **`0013` becomes `13`, which is a DIFFERENT TASK OF OURS.** As a **viewer** this never mattered.
  ⛔ **Under B it is a corruption waiting for the first write to any field carrying an id** — an id
  field, a `blocked_by` entry, a label, a cross-reference.
- ⭐ **It is precisely the all-digits case — i.e. precisely us.** Emoji, colons, brackets, quotes,
  backslashes, leading/trailing spaces and `true`/`false`/`null` all round-trip correctly.
- ⭐ **This is a direct hit on
  [ADR-029](../../../knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md)** —
  a task is a folder keyed by a **permanent** four-digit id. A store that cannot hold `0013` cannot
  hold fkit's identity model.
- **Filed as aiboard `T-023` (high) on aiboard's board.** ⛔ **No fkit task is filed for it** — it is an
  **external precondition**, referenced, never owned.

**⭐ THE GOOD NEWS — and it is evidence, not reassurance.** All **408** real fkit briefs imported into a
scratch aiboard board and read back: **0 create errors, 0 titles corrupted, 0 bodies lost** —
emoji-dense, link-heavy, `---` rules, nested code fences, 57 KB monsters, all intact. ⭐⭐ **That is the
strongest evidence anyone has that B is FEASIBLE**, and it is why B is a gated destination rather than
a wish.

**⚠️ THE QUADRATIC IS WORSE UNDER B — `aiboard-lead` corrected its own earlier framing.** The cost is
proportional to **sprint membership**, not task count. fkit's 408 briefs imported **without** sprints
snapshot in **75 ms** — ⭐ **it nearly reported that as reassurance.** With every task sprinted, which is
the corpus's shape under B:

> **409 real tasks, all sprinted — `snapshot()` 729 ms, payload 294 KB, browser polls every 3 seconds →
> 24% of every poll interval inside one function.**

⛔ **Worse than its synthetic projection. `T-021` is not a nice-to-have under B** — it is the difference
between a board that works at fkit's scale and one that does not. ⭐ **Note this VINDICATES the
*"benchmark first"* ruling recorded on Sprint 11**, and vindicates its stated reason: the property is
architectural, not Python-specific.

**⛔ THERE IS NO UNDO. Under B a mistake is a DATA-LOSS event.** A status change is a `shutil.move`. No
transaction log, no trash, no confirmation on destructive paths, no export. A mis-drag is reversible
only by dragging back, and only if noticed. ⚠️ **aiboard's entire durability story is the consuming
project's version control** — which is not aiboard's, and **which nobody has committed to running on a
schedule.** ⭐ **`aiboard-lead` asked that this be an EXPLICIT DEPENDENCY before B, not an assumption.**

⚠️ **Read it against `D1`** (a browser drag forging a close) in this brief's open-decisions section:
**no-undo makes D1 strictly worse.** A forged close that is also irreversible is not a governance bug
with a repair path; it is data loss with a governance bug on top.

**⚠️ TWO STRUCTURAL HAZARDS `aiboard-lead` NAMED AGAINST ITS OWN PROJECT:**

- **Id allocation races across branches.** Next id is `max(existing)+1` under a per-machine lock that
  does nothing across git branches. Two branches allocate the same id, both commit, and they merge with
  **no textual conflict** because they are different directories. ⛔ **That is the hazard ADR-029
  documented and accepted for fkit** — ⚠️ **under B, fkit inherits a SECOND COPY of a problem it already
  decided to live with once**, and `/fkit-task-brief`'s own allocation step already calls the same
  class *"an accepted residual risk, not a solved problem."*
- **aiboard's own duplication, at 404× scale.** aiboard stores sprint membership **twice** — the task's
  `sprint:` field and the sprint's `tasks:` list — reconciled by a checker. ⛔⛔ **It named this itself,
  and it lands directly on the owner's own words above:** *"I want to avoid situations where the
  duplication is even possible."* ⚠️ **`aiboard-lead`'s position: not fatal, one side is derivable, the
  checker is real — but it wants it reduced to ONE source BEFORE migration, not after.** ⭐ **That is in
  the proposed gate as a hard precondition, because after the migration it is 404 tasks too late.**

### ⭐⭐ `aiboard-lead`'s ACCEPTANCE-TEST INSIGHT — the most useful sentence produced on 2026-09-18

⛔ **Its own process note, quoted:**

> *"The thing that surfaced T-023 was running your real files through my code rather than reasoning
> about whether it would work. I'd been reasoning about that parser all day and describing it as 'a
> liability' without once feeding it a real corpus. The abstract worry was right and completely
> useless; ten minutes of your actual data produced the specific bug."*

> *"Under B, the acceptance test for 'aiboard can hold fkit' is a **full import-and-diff of all 404, not
> a design review.**"*

⭐ **Written into the proposed gate criteria in those terms.** ⚠️ **It generalises past this project: the
house rule
[`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md)
already says a claim needs evidence — this adds that *"I reviewed the design and it looks unsafe"* is
not evidence either.**

### ~~⭐⭐ THE GATE IS UNDEFINED — and that is the LIVE RISK, not a formality~~ ✅ **RESOLVED — THE GATE IS DEFINED**

> ✅ ⭐⭐ **SUPERSEDED 2026-09-18. The heading above was TRUE WHEN WRITTEN and is kept, struck, as the
> record of the risk that was live at the time.** The owner ruled the full gate the same day.
> ⛔ **Authoritative text:
> [ADR-051](../../../knowledge-base/decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md),
> *§The gate*.** ⭐ **The risk this section names — that *"later"* becomes *"never"* or *"next week"* —
> is what the gate now closes.

⛔ **The ruling names three conditions and one is not measurable as written:**

1. **The Node port lands** — measurable once *"lands"* is defined.
2. **T-022 is fixed** — measurable.
3. **He has *"used it on real work for a while"*** — ⛔ **NOT MEASURABLE AS WRITTEN.**

⚠️⚠️ **An undefined gate is how "later" becomes "never" or "next week", and this is a migration he will
only want to do ONCE.** ⛔ **No agent may adopt gate criteria of its own.** ~~Draft criteria were returned
to `fkit-lead` as a `NEEDS-DECISION` on 2026-09-18 and are carried on
[Sprint 11](../../../sprints/sprint-11.md) as open decision **D4**. ⛔ **Until the owner rules, the gate
is undefined and B stays frozen.**~~

> ✅ ⭐⭐ **SUPERSEDED 2026-09-18 — THE OWNER RULED, AND ALL THREE CONDITIONS ARE NOW MEASURABLE.**
> He took the **full** gate: preconditions `P1`–`P6`, acceptance test `A1`–`A2`, a trial, and
> pre-declared FAIL conditions `F1`–`F5`. ⭐ **The unmeasurable third condition —
> *"used it on real work for a while"* — is now, **all three, running CONCURRENTLY**: **4 calendar
> weeks**, **2 sprints planned and closed in fkit's tree through the movers and WATCHED on the board**,
> and **≥40 status changes SEEN on the board however they were made** — with the clock starting when
> aiboard's Node port lands.**
>
> ⛔ **Both work-floor halves were REPAIRED on 2026-09-18** — as first written (*"through it"* /
> *"through the board"*) they required a **read-only** board to originate the work, which is
> **unsatisfiable by construction**. ⭐ **REPAIRS, NOT LOOSENINGS: the difficulty is unchanged.**
> ⛔ **The trial also has NO TIMEOUT** — no deadline, check-in or review point, ruled deliberately.
> ⭐ **Details in ADR-051 *§Amendment 8*, *§Amendment 9*, *§Amendment 10*.**
>
> ⛔⛔ **AUTHORITATIVE TEXT:
> [ADR-051](../../../knowledge-base/decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md),
> *§The gate*.** ⛔ **Do not restate the gate in this brief** — Sprint 11 carries a planning summary and
> that is already one copy more than ideal. ⭐ **If any copy differs from the ADR, the ADR wins.**
>
> ⛔ **B STAYS FROZEN ANYWAY.** A **defined** gate is not a **passed** one, ⛔ **and even "passed" is not
> "migration authorised"** — a dry run with a byte-hash diff the owner reads sits between them.
> ⛔ **Only the owner declares any of it. No agent.**

### ⛔ WHAT IS STILL NOT DECIDED BY THIS RULING

- ~~⛔ **The gate criteria — D4.** Open, and the most important open item.~~ ✅ ⭐⭐ **CLOSED 2026-09-18 —
  THE GATE IS DEFINED AND RECORDED.** Authoritative text:
  [**ADR-051**](../../../knowledge-base/decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md),
  *"One store for tasks — aiboard is the gated destination; the read-only reader is the interim"*,
  under its heading *"⭐⭐ THE GATE — ruled by the owner on 2026-09-18, and the most important content
  in this ADR"*. ⛔ **Sprint 11's copy is a SUMMARY; if they differ the ADR wins.**
- ⛔ **D1 — the write-back / forged-close question.** ⭐ **Still deferred, and it MOVED**: it is now a
  **B-gate** question, not a step-3 question, and no-undo makes it worse.
- ⛔ **D2 — whether `Sprint 11` is the right identity for that board.** Unchanged, still open.
- ⛔ **D3 — cross-project read access.** Still an inference the owner can overturn, not an answer he
  gave.
- ⛔ **D5 — whether `0383`'s hold is lifted.** ⭐ **Its MERIT is answered on Sprint 11** (it survives B
  and is a precondition of doing B well); **the lift is the owner's.**
- ~~⛔ **An ADR recording this ruling.** ⚠️ **It does not exist.** The act that recorded this ruling was
  scoped to exclude `ai-agents/knowledge-base/decisions/` entirely. ⭐ **Recorded as an outstanding
  debt, not as done.**~~
  ✅ ⭐⭐ **IT EXISTS — the debt is DISCHARGED.**
  [**ADR-051**](../../../knowledge-base/decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md)
  — *"One store for tasks — aiboard is the gated destination; the read-only reader is the interim"*,
  status `accepted`, written by `fkit-architect` on 2026-09-18. ⭐ **It records the direction, the full
  gate, and the three amendments the owner made to his own gate later the same day.**
  ⚠️ **Why the claim above was written, and why it was wrong:** the producer that wrote it had been
  scoped out of `ai-agents/knowledge-base/decisions/` — ⛔ **the ADR existed; the writer could not see
  it.** ⭐ **The struck text is kept as the record of that failure mode:** an agent barred from a
  directory cannot tell *"absent"* from *"invisible"*, and will honestly report the first when the
  truth is the second.

⛔ **Written by a spawned `fkit-producer` with no owner channel** (ADR-021), executing the mechanics of a
relayed ruling and deciding nothing beyond them and the `0383` merit finding it was delegated.
⛔ **No commit was made by this append**, and nothing was written to `ai-agents/wiki-vault/`
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
