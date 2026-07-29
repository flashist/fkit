# Decide the durable citation form for mutable coordinates

## ID
0160

## Sprint
Sprint 2

## Priority
141

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### This is an investigation, not an implementation — and that is deliberate

The defect is known and measured. **The fix is not.** Three artifact classes cite each other by
coordinates that move, and the three do **not** obviously want the same answer — one of them collides
head-on with a design rule fkit deliberately holds. Per the investigation-first rule, **no
implementation brief is written until this task's findings are in and reviewed with the owner.** The
repair and any enforcement guard are follow-ups this task scopes; they are not pre-written here.

### The class: a citation whose target is a coordinate that moves

A citation is supposed to save the reader a lookup. A citation to a **mutable coordinate** does the
opposite: when the coordinate shifts, the citation still *reads* authoritative and is silently wrong, so
the reader who trusts it is misdirected and never learns to check. **Nothing in this repo detects the
moment it goes stale.** This run was bitten three separate ways.

**Case 1 — board rank cited in prose** (`0150 (124)`). Rank is re-ranked whenever the plan changes;
sprint 2 was re-ranked twice in one day. **Already covered — do not re-scope it.** Task **0157** writes
the rule (*cite the folder ID, not the rank*); task **0159** repairs the existing damage (21 stale rank
numbers, 19 sites, 11 files). This task must **not** touch either surface.

**Case 2 — line numbers into a growing file** (`sprint-2.md:417`, `:414`). **The trigger, and it is
firsthand.** On 2026-07-27 a producer appended **one** Status-table row to `ai-agents/sprints/sprint-2.md`.
The plan shifted **+70 lines** and **eleven** `:NNN` pointers silently became wrong in one edit — two
inside the plan itself, three in `0157`'s brief, six in `0159`'s. The producer that caused it found it
by hand and repaired all eleven by hand. **Nothing flagged them. No test catches this, and none can
catch it today** (see *What nothing enforces* below).

Measured 2026-07-27, firsthand:

| Measure | Count |
|---|---|
| `path:NNN` citations in **open** briefs under `tasks/backlog/` | **113** |
| of those, pointing into `sprint-2.md` — the file that grows on every board edit | **12** |

`sprint-2.md` is **2,398 lines** and grows with every addendum. Every one of those 12 is a pointer into a
file whose line numbers are guaranteed to move again.

**Case 3 — a folder path in a review ledger that dies when the task closes.** A `review.md` records the
task under review as `ai-agents/tasks/backlog/NNNN-…/brief.md`. The moment `/fkit-task-done` moves the
folder to `done/`, **every one of those paths points at nothing** — and the movers deliberately never
repair them, because **a review ledger's claims are frozen by design.** This is not three instances. A
firsthand sweep of `ai-agents/tasks/done/` on 2026-07-27 found **30 closed tasks whose `review.md`
carries at least one dead `tasks/backlog/…` path.** Three of them surfaced during this run alone —
`0103`, `0125`, `0153`.

> **⚠️ Case 3 is NOT "just repair the path", and the brief does not assume it is.** Repairing it means
> **editing a frozen document** — the thing the ledger rule exists to forbid. The candidate answers
> (leave them dead and accept it; resolve location at read time; cite a location-free anchor at write
> time; annotate rather than rewrite) have genuinely different costs, and choosing between them is this
> task's job. **Do not arrive at "rewrite the paths" without weighing the frozen-ledger rule against it.**

---

### 🆕 CASE 4 — added 2026-07-29 · provenance: the spawned `fkit-producer` that closed task `0148`

> **This case was appended after the brief was written.** It adds **a fourth case and a named
> candidate rule** — **it rules nothing.** Everything in *What to build* stays open, and case 4 joins
> cases 1–3 as a thing to be ruled on separately, not folded into them.

**Case 4 — mutable coordinates carried inside the wiki completion flag, and inside the `log.md` entry
that carries it.**

**Why it is a fourth case and not one of the other three.** Neither `0125` nor `0153` says anything
about what a completion flag may **not** carry — they specify what it must contain. And this is **the
only instance in three runs where a stale coordinate risked a wrong action**, rather than merely
misdirecting a reader:

- `0148`'s flag (`ai-agents/wiki-vault/log.md:447`) carried a **stale board rank** — *"priority 125"*;
  the row is **`P132`**.
- `log.md` cited **`sprint-2.md:162` as `0148`'s board row twice** — at `:683` and `:743`. **Wrong
  against HEAD (`:160`) and wrong against the working tree (`:164`).** `:162` is task **`0157`**'s row.
- **The driver's out-of-band correction is the only reason the closing producer did not edit `0157`'s
  row** while closing `0148`.

**The finding, in the source's own words:**

> ***"the mandated content was never wrong; the unmandated extras were wrong three times."***

**Named candidate rule — recorded for this task to rule on, NOT a decision.** The three wiki SKILLs'
flag block should require **folder ID and brief path only — no board rank, no `P<n>`, no `:NNN`.**
Weigh it against the alternatives (allow extras but mark them advisory; require nothing; resolve at
read time) the same way cases 1–3 are weighed. **Note the ownership boundary: the flag block lives in
`claude/skills/fkit-wiki-*/SKILL.md`, so any wording change is a follow-up for the producer to file,
not this task's edit** — and it collides with the `SKILL.md`-walk claimant queue (`0136`, `0152`,
`0154`), which the report should say out loud rather than discover later.

**Coordinates with `0165` (P129), does not duplicate it.** `0165` owns *whether the flag's form is
checked at all*; this owns *what a flag may carry that moves*. **Both were fed by the same `0148`
flag** — the owner ruled on 2026-07-29 to route the finding into these two existing briefs rather than
file a new task. Rule case 4 without waiting on `0165`; say plainly if the two answers must agree.

**Verified firsthand on disk 2026-07-29** by the producer recording this section: the `:447`, `:683`
and `:743` citations resolve as quoted; `0148`'s board row is line `160` at HEAD and line `164` in the
working tree; `sprint-2.md:162` is `0157`'s row in the working tree. **The `sprint-2.md` line numbers
in this paragraph will themselves move on the next board edit — they are case 2 specimens, quoted
knowingly, and are not to be trusted at implementation time.**

### The conflict that must be reconciled, not stepped around

**`claude/agents/fkit-architect.md`, `## Output format`, first bullet, actively mandates the thing case 2
argues against:**

> - Architecture docs / specs: structured markdown with `path:line` citations and ASCII or mermaid
>   diagrams where they clarify structure.

Review ledgers lean on the same form even harder — a finding at `plan.md:106` is precise in a way no
heading anchor is, and that precision is the point of a finding. **So "never cite a line number" is not
obviously the right rule.** The real question is narrower and harder: *when does durability beat
precision, and when does it not?* A ruling that does not answer that leaves the architect's own
instructions contradicting the new convention on day one.

### What nothing enforces — checked firsthand, 2026-07-27

| Site | Verdict |
|---|---|
| `claude/skills/fkit-status/dashboard.sh` | **Partial, and only for case 3's sibling.** `drift relocated` and `drift missing-brief` resolve a **sprint-board row's** brief link against the folder's real location and report it. This is the **one** existing mechanism in the repo that catches a stale task path — and it covers board rows **only**. It never reads a `review.md`, a brief's prose, or any `:NNN`. |
| `test/` (13 files) | **Nothing.** No test reads any `.md` for citation validity. `grep -rn 'line number\|citation'` over `claude/ test/ conventions/` returns **4** hits, none of them a check. Tasks **0152** and **0154** are building the first two readers of `SKILL.md` *content* — neither reads citations. |
| Any markdown lint | **Does not exist.** There is no lint step in this repo. |
| `ai-agents/wiki-vault/` | **Nothing** — no page records a citation convention. Flagged as a wiki gap. |

**So the honest answer today is: nothing enforces this, and a guard is only partly possible even in
principle.** A hand-rolled check could verify a `path:NNN` **resolves to a file with at least N lines** —
that is cheap and catches the deleted-file case. It **cannot** verify the line still says what the citer
meant, which is the actual failure mode. Case 3's dead-path check is mechanically easy and blocked on the
frozen-ledger question, not on tooling. **This is the same unenforced-prose class as `0154` and `0157`,
and the report must say so plainly rather than implying a guard would close it.**

ADR-014's zero-devDependencies rule means any guard is hand-rolled.

## What to build

**A decision report under `ai-agents/knowledge-base/reports/`, plus the follow-up briefs it justifies.
No convention page, no skill edit, no guard, and no repair sweep in this task.**

1. **Establish the durable-anchor form for each of the three cases, separately.** Do not assume one
   answer covers all three. For each: state the recommended form, what it costs the writer, what it
   costs the reader, and what it gives up. Candidate anchors to weigh — headings, `## ID` values, task
   folder IDs, relative ordering (*"directly below 0147"*), location-free task references, quoted
   snippets in place of a coordinate. Add others if better ones exist.
2. **Answer the precision-vs-durability question explicitly**, and reconcile it with
   `claude/agents/fkit-architect.md`'s `## Output format` mandate and with review-ledger practice. If the
   conclusion is *"line numbers stay for findings, go for cross-references"*, say exactly where the line
   falls and how a writer decides which side they are on.
3. **Rule on case 3 with the frozen-ledger rule in hand.** Weigh at minimum: accept the dead paths;
   resolve location at read time; write a location-free anchor going forward; append rather than rewrite.
   **A recommendation to edit existing ledgers must argue against the frozen-ledger rule directly** —
   it may not simply not mention it.
4. **State what could enforce each recommendation, and what could not** — including the weak
   line-count check and the case-3 dead-path check, with the ceiling on each stated honestly. If the
   answer for a case is *"nothing can enforce this"*, say that as the finding.
5. **Scope the follow-ups as named, separable units** — a convention page, per-skill/agent wording edits,
   a repair sweep, a guard — each with its `## Owner` role and its dependency on this decision. **Do not
   write those briefs here**; naming them is enough for the producer to file them once the owner rules.
6. **Say plainly what is left unenforced after all of it**, in the report's own words.

## Verification steps

1. **The report exists** at `ai-agents/knowledge-base/reports/<date>-<slug>.md` and names all three cases
   distinctly, with a separate recommendation for each — not one recommendation applied three times.
2. **Case 3's ruling engages the frozen-ledger rule by name.** Read the report's case-3 section alone: it
   must state the rule, weigh it, and say why the recommendation is compatible with it or why the rule
   should yield. A section that recommends a repair without mentioning the rule **fails this task.**
3. **The `path:line` conflict is reconciled.** The report must quote `claude/agents/fkit-architect.md`'s
   `## Output format` bullet and say whether it stands, narrows, or changes. Silence on it fails.
4. **The enforcement answer is falsifiable.** For each proposed guard the report names the file it would
   live in and the condition it would assert; for each case with no possible guard, it says so in those
   words. "Could be enforced by a test" with no condition is not an answer.
5. **A reader can act on it without another ruling.** Hand the report to a producer writing a brief
   tomorrow: it must tell them what to write when they want to point at (a) a spot in `sprint-2.md`,
   (b) a task, (c) a finding in a file under review — with no further owner input.
6. **The change surface is report-only.** `git diff --stat` shows **no** file under
   `claude/skills/`, `claude/agents/`, `ai-agents/tasks/`, `ai-agents/sprints/`, or
   `ai-agents/knowledge-base/conventions/`. **No task file moved** between `backlog/`, `done/` and
   `cancelled/`, and **no board rank changed**:
   `grep -oE '\| P[0-9]+ \|' ai-agents/sprints/sprint-2.md` returns the identical sequence before and
   after.
7. **Nothing was written to `ai-agents/wiki-vault/`.** `git status` shows no change under that path.
8. **The suite is still green.** `node --test test/` passes — this task should not touch it at all.
9. **🆕 Added 2026-07-29 — case 4 gets its own recommendation.** The report names case 4 (mutable
   coordinates inside the wiki completion flag and its `log.md` entry) **as a fourth distinct case**,
   not as an instance of case 1 or case 2, and **rules the named candidate rule in or out by name** —
   *folder ID and brief path only; no board rank, no `P<n>`, no `:NNN`*. It must also state whether
   case 4's answer has to agree with `0165`'s, and name the `SKILL.md` wording edit as a producer
   follow-up rather than performing it. Steps 1 and 5 above now read **four** cases, not three.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **⚠️ Case 1 is out of scope, hard.** Board-rank citations belong to **0157** (the rule) and **0159**
  (the repair). This task may **reference** them as the worked precedent for what a durable-anchor rule
  looks like, but must not edit `claude/skills/fkit-task-brief/SKILL.md`, any task brief, or the sprint
  board. Touching those re-creates the two-owner collision the 0157/0159 split just resolved.
- **⚠️ Soft ordering: prefer landing 0161 first.** 0161 makes the frozen-history clause in
  `priority-is-rank-not-identity.md` say which notation form it means. This task's case-3 reasoning turns
  on how "frozen" is read, and reading a clause that already says what it means is cleaner than reading
  one that needed a ruling. **Neither blocks the other** — either order ships.
- **⚠️ Do not fix the citations inside this brief, 0157, or 0159.** They are 0159's change surface and its
  findings table names them.
- **The number of dead ledger paths is 30, not 3.** Three surfaced during this run; the corpus-wide sweep
  on 2026-07-27 found 30. Scope case 3 against 30.
- **🆕 2026-07-29 — case 3's corpus grew again, and `0148`'s close is one of the additions.**
  `ai-agents/tasks/done/0148-…/review.md` now carries dead `backlog/` paths at **`:3`** (the ledger's
  `Task:` header) and **`:79`** (the verbatim completion flag, quoting the brief path it was closing).
  Left frozen by the ledger rule, exactly as case 3 predicts. **⚠️ Count discrepancy, stated rather
  than smoothed over:** the `0148` close reported itself as *"the 31st specimen"*, but a re-run of the
  same method on **2026-07-29** — `grep -rl 'tasks/backlog/' ai-agents/tasks/done/*/review.md | wc -l`
  — returns **35**. **Neither number is authoritative for the report**; per the *Findings decay* note
  below, **re-measure and state the method used.**
- **Findings decay.** The 113 / 12 / 30 counts were taken 2026-07-27 and move with every board edit and
  every close. **Re-measure at implementation time** rather than quoting these numbers as current.
- **The follow-ups this task names must be filed by the producer**, not created by the architect —
  brief-writing is the producer's act.
- **This is prose about prose, and unenforced.** Say so in the closing report; do not let the existence of
  a recommendation imply that anything now checks it.
- **🆕 2026-07-29 — case 4 added; scope, `## Owner` and rank unchanged.** The `0148` close routed its
  citation finding here rather than opening a new task (owner ruling 2026-07-29, via `AskUserQuestion`
  in the live `/fkit-sprint-ship-loop` driver session). **`P141` is untouched and nothing was
  re-ranked.** The closing producer had recommended a separate task; the owner ruled against it.
  **⚠️ The rank note directly below says "Priority 138" while the `## Priority` field and the board row
  both read `P141` — a pre-existing inconsistency, observed 2026-07-29, deliberately NOT edited here.**
- **⚠️ Priority 138 is append rank, NOT a merit ranking — flagged for owner confirmation.** Filed by a
  spawned producer with no owner channel; per `/fkit-task-brief` step 5 appending was the only sanctioned
  option. **On merit this belongs below 0161 and above the 0157/0159 pair is *not* claimed** — it is an
  investigation with no work blocked behind it, and its cost of waiting is that new stale citations keep
  accruing at the observed rate rather than that anything wrong ships. **Merit placement: roughly where it
  is.** The one argument for moving it up is that 0157 and 0159 are solving one third of this class right
  now, and deciding the other two thirds while that context is live is cheaper than re-acquiring it later.
