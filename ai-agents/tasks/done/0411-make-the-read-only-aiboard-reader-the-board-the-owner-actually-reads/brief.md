# Make the read-only aiboard reader the board the owner actually reads

## ID
0411

## Sprint
Sprint 11

## Priority
P3

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

### Why this brief exists — it is the half of `0404` that authorises code

⭐ **Owner ruling, 2026-09-20**, given live via `AskUserQuestion` in an `fkit lead` session and relayed
into this spawned `fkit-producer`, which has **no owner channel**
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
⚠️ **SELECTED OPTION TEXT — an option an agent wrote and he chose. It is not his own free prose.**

> *"**Close 0404, file the reader as its own task** — The evaluation happened and produced three
> reports plus an accepted ADR — 0404's stated deliverable exists. Close it honestly against that
> evidence, and give the interim reader a brief of its own that actually authorises writing code, with
> the coder as owner. Cleanest: each task's brief then matches what it is."*

**What was wrong, and what this fixes.** [`0404`](../0404-evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam/brief.md)
carried **two carriers that disagreed about what the task was**: its `## What to build` said, in its own
words, *"⛔ THIS IS EVALUATION AND INTEGRATION-DESIGN. IT IS NOT IMPLEMENTATION… A run that arrives
having already written integration code has failed."*, while its Sprint 11 row — annotated after the
convergence ruling — said the evaluate half was discharged and what remained was the reader. Two tasks,
two different `## Owner` roles under
[ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md).
`0404` is now closed against the evaluation it actually delivered; **this brief is the code half, and it
authorises writing code.**

⛔ **`## Owner` here is `fkit-coder`, deliberately.** It does **not** inherit `0404`'s
`fkit-architect`. The deliverable is **source** — a thing the owner runs — and ADR-044 clause 1 puts a
deliverable that names no skill with the coder, *"whatever `## Owner` says"*. A design consult with the
architect is available and expected; the build is the coder's.

### What this is, in one line

⭐ **Track 1 — "A now"** of
[**ADR-051**](../../../knowledge-base/decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md):
fkit's `ai-agents/` tree stays the **single** store; aiboard reads it and renders the board. **A is the
interim that runs now, while B — aiboard as the single store — is the gated destination.**
Sprint 11's board records it as *"The read-only reader/adapter, run for real. Not a spike in a
scratchpad — the way the owner actually reads his board."*

⛔⛔ **ADR-051 is the authoritative text for the direction and the gate.** Anything this brief, Sprint 11
or `0404` says about either is a **summary**. ⭐ **If any copy differs from the ADR, the ADR wins.**

### ⛔ The starting material — evidence, NOT a codebase

The preserved spike lives at
**`ai-agents/tasks/done/0404-evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam/assets/external-expert-spike/`**
— it moved into `done/` with `0404`'s folder on 2026-09-20 and that is its permanent path.

⛔ **Its README heads itself *"⚠️ THROWAWAY SPIKE — a demonstration, not a component"*** and says, in its
own words, *"Do not ship, extend, or depend on it. It exists to show that something is possible and how
cheap it is."*

⭐⭐ **THIS TASK'S FIRST JOB IS TO DECIDE WHAT OF IT SURVIVES.** It is evidence that a thing is possible
and cheap — it is **not** a starting branch to extend by default. *"Rewrite it"*, *"keep the card
mapping and rewrite the rest"* and *"keep it and fix the hard-coded paths"* are all legitimate
conclusions; **arriving at one without having made the call is not.**

⛔ **Nothing under `ai-agents/tasks/done/` or `ai-agents/tasks/cancelled/` may be edited** — a closed
folder's claims are frozen; only a mover repairs a link inside one. ⚠️ **`0404`'s own brief attributes
this rule to "ADR-034", and that citation is WRONG** — ADR-034 is *"A review ledger closes on the work
product, not the task's own record"*; nothing in `knowledge-base/decisions/` states a
closed-folder freeze under that number. ⛔ **The rule stands on the house convention and the movers'
own text; do not propagate the ADR-034 attribution.** The spike is **read** from there and whatever survives is written **somewhere new**. ⛔ **Do
not edit the spike in place, and do not move it.**

**What the spike's own README already concedes** — read it before planning, it is short:
both repo paths are **hard-coded absolute paths to the owner's machine**; Python 3.9, stdlib only;
priority flattened to `medium`; dependencies not mapped at all; sprint status read from the **first**
status glyph on a board's line 3, which mis-read Sprint 11 as cancelled in a first draft because that
banner carries a later `⛔ PARTIALLY FROZEN`. ⭐ **Its own closing line names where a real version
belongs:** *"in aiboard, as a pluggable store-adapter seam (after the Node port), with fkit shipping the
adapter for its own tree. This file is not that."*

### ⚠️ The measured facts — ATTRIBUTED, and NOT verified by fkit

⛔ **Measured by `fkit-external-expert` on 2026-09-18 and tagged `[X]` in its own verdict. No fkit agent
has re-run any of it.** Provenance stated rather than blurred, per
[`evidence-before-assertion.md`](../../../knowledge-base/conventions/evidence-before-assertion.md).

| Fact | Value |
|---|---|
| Size of the read-only adapter | **129 lines** |
| Write behaviour | **Read-only — refuses every POST; writes nothing anywhere** |
| Corpus rendered | **405 real fkit tasks**, from fkit's **unmodified** tree, into aiboard's **unmodified** browser UI |
| Snapshot | **37 ms** (warm) |

⚠️ **One number does not reproduce, and it is recorded rather than smoothed:** `wc -l` on the preserved
copy today returns **130**, not 129, for `fkit_board_spike.py`. The README records that **one edit was
made to the copies** (`rows.py` finding its index beside itself). ⛔ **Unreconciled. Re-measure at
pickup and state the counting rule**, per the same convention.

⭐ **The user evidence that motivates this, and it is the owner's own typed prose** — canonically
recorded on [`0404`](../0404-evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam/brief.md)
under its heading *"THE OWNER'S OWN PROSE — HE TYPED THIS"*:

> *"It's kind of useful, because I can see all the cards and read the details there by clicking the
> cards. When I open .md files the text is hard to read and is too huge to consume, the board allows me
> to see the titles and descriptions in a more readable way."*

⛔ **One user, one sitting, free-form impressions.** It settles *"has anyone ever used it"*. It does not
settle *"which of web and terminal is more readable"* — that is
[`0405`](../../backlog/0405-investigate-a-terminal-ui-for-the-board-and-compare-it-against-the-web-board/brief.md)'s
deliverable.

### ⛔⛔ THIS IS NOT THE MIGRATION, AND IT IS OUTSIDE THE SPRINT 11 MIGRATION FREEZE

⛔ **Nothing in this task may re-key an id, move a task or sprint folder, rewrite a board, or make
aiboard the store.** That is **B**, and B is frozen behind ADR-051's gate. ⛔ **No write path of any
kind** — A is read-only by definition, and the write-back question (**D1**, *"would a browser
drag-to-Done forge a close?"*) now belongs at the **B gate**, not here.

⭐ **It is outside the migration freeze, and this is stated explicitly because the freeze is the first
thing a reader will check:** this task **writes nothing to fkit's tree and changes no stored shape**, so
it was never inside the freeze's literal words. Sprint 11's own track table already records T1 as
**STARTABLE** for exactly that reason: *"It writes nothing and changes no stored shape."*

### ⚠️ THE LIVE JUDGEMENT FOR THE PLAN GATE — how much hardening before the port lands

⛔ **Carried verbatim from `0404`'s Sprint 11 row, because it is the judgement this task's plan must
put to the owner rather than settle on its own:**

> *"the reader is only as good as aiboard's Node port, so how much hardening is worth doing before the
> port lands is a live judgement."*

**Why it bites.** The port is **aiboard's** work, on **aiboard's own board**, and it is
**precondition `P1`** of ADR-051's gate — the gate's trial clock does not even start until it lands.
Hardening a Python reader against an aiboard that is being rewritten in Node may be building against a
surface that is about to change; **shipping nothing until the port lands leaves the owner reading raw
markdown in the meantime, which is the pain this whole track exists to fix.** ⛔ **Neither extreme is an
agent's to pick.** Put the trade to the owner at the plan gate with a recommendation and its cost.

### ⚠️ aiboard-side findings — ATTRIBUTED, referenced, NOT ours to fix

⛔ **All three are filed on aiboard's board, in aiboard's repo. No fkit task is filed for any of them —
they are external preconditions, referenced, never owned.** ⛔ **Nothing is written into aiboard's repo
by this task**; anything aiboard must change is a **request** carried through `aiboard-lead`.

| Finding | What it is | ⭐ Exposure of a READ-ONLY reader — stated precisely |
|---|---|---|
| **`T-023`** | aiboard silently coerces an all-digit front-matter string to an integer and writes it back unpadded: `"0404"` → `404`, `"0013"` → `13`. No error. ⛔ `0013` becomes `13`, **a different task of ours**. | ⭐ **NOT A BLOCKER HERE.** The bug fires **on write**, and this reader **never writes**. ⛔ **It is a direct hit on [ADR-029](../../../knowledge-base/decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id.md) under B** — a store that cannot hold `0013` cannot hold fkit's identity model — which is a **B-gate** matter. ⚠️ **What this task must still do:** confirm the ids it *renders* are not mangled in the display path, and say so with evidence. |
| **`T-021`** | `snapshot()` is O(n²) — **729 ms** at 409 sprinted tasks, payload 294 KB, against a UI polling every 3 s. | ⚠️ **PARTIALLY RELEVANT.** That figure is aiboard's **own store** at fkit's scale, not this reader (which measured **37 ms** over fkit's tree). ⛔ **But the reader supplies the same snapshot shape to the same polling UI**, so its own snapshot cost at real scale is this task's to measure and keep honest. |
| **`T-022`** | Unauthenticated cross-origin writes — `do_POST` checks no `Origin`, `Host`, `Referer` or `Content-Type`. | ⭐ **NOT A BLOCKER HERE** for a reader that refuses every POST. ⚠️ **It is gate precondition `P2` for B.** ⛔ **But the reader binds a local HTTP port, so it owes the owner an explicit statement of what it listens on and what it serves** — that is a fresh question about this reader, not an import of `T-022`. |

⛔⛔ **Do not import all three as blockers.** A read-only reader is exposed to them very differently from
a writing store, and flattening that distinction would either block startable work or hide a real
question.

### ⛔ The one-way dependency still stands

⭐ **The owner's constraint, never withdrawn:** aiboard must remain usable by someone with **no fkit and
no framework at all**, so **fkit adapts to aiboard, not the reverse.** ⛔ **Anything this task needs from
aiboard is a request through `aiboard-lead`, and fkit ships its own adapter.** The spike's README
already names that shape: *"in aiboard, as a pluggable store-adapter seam (after the Node port), with
fkit shipping the adapter for its own tree."*

## What to build

⭐ **A read-only board the owner runs and actually reads his sprints and tasks in.** Not a scratchpad
demo, not a screenshot, not a report about one.

Work it in this order:

1. **Read the spike and decide what survives.** Name the call explicitly in the plan — rewrite, keep
   part, or keep and repair — with the reason. ⛔ *"Extend it"* is not a default.
2. **Put the language question to the owner at the plan gate.** The spike is Python; fkit is Node; the
   spike's README says the real version belongs in aiboard **after the Node port**. ⛔ **Not an agent's
   call alone** — it decides where this code lives for as long as A is the interim.
3. **Kill the hard-coded absolute paths.** The spike hard-codes both repo paths to the owner's machine.
   A thing the owner *runs* is configured or discovers its own root; a thing that only demonstrates is
   not.
4. **Make running it a documented, repeatable command**, with what it listens on stated plainly.
5. **Get the board's content right at real scale.** At minimum: sprint status read correctly from a
   board's line-3 banner (⛔ the spike's first draft mis-read Sprint 11 as cancelled by matching *any*
   `⛔` — [`sprint-status-vocabulary.md`](../../../knowledge-base/conventions/sprint-status-vocabulary.md)
   is the rule), ids rendered unmangled, and the six-value task vocabulary
   ([`task-status-vocabulary.md`](../../../knowledge-base/conventions/task-status-vocabulary.md))
   rendered without inventing a value the vocabulary does not have.
6. **Measure it at fkit's real corpus** and record the number with its counting rule beside it.
7. **State plainly what it does NOT do** — the card mapping it drops, dependencies unmapped, anything
   deferred to the port.

**These are hard:**

- ⛔ **Read-only. No write path of any kind, in any mode, behind any flag.**
- ⛔ **No id re-keyed, no task or sprint folder moved, no board rewritten.**
- ⛔ **Nothing under `ai-agents/tasks/done/` or `ai-agents/tasks/cancelled/` is edited** — see the
  starting-material section above, including its note on the wrong ADR-034 attribution.
- ⛔ **Nothing is written into aiboard's repository.**
- ⛔ **No `ai-agents/wiki-vault/` write**
  ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
- ⛔ **No secrets in any artifact** — no endpoints, tokens or credentials. This goes to git.
- ⛔ **No `path:NNN` citation into a coordination document** — anchor by heading plus quoted fragment
  ([`durable-citation-anchors.md`](../../../knowledge-base/conventions/durable-citation-anchors.md));
  `test/coordination-citation-policy.test.js` scans this corpus.
- ⛔ **No commit** unless the owner explicitly asks.

## Verification steps

1. **The plan names what of the spike survives, and why** — and the owner approved that call at the plan
   gate. A plan that silently extends the spike has skipped the task's first job.
2. **The hardening-depth trade was put to the owner** with a recommendation and its cost, and his answer
   is recorded. ⛔ A run that decided it alone has settled a judgement the row marks as the owner's.
3. **The owner can start it from a documented command on a clean checkout** with no path editing —
   demonstrate it, do not assert it.
4. **It writes nothing.** Prove it: run it against the tree, then show `git status --porcelain` on
   `ai-agents/` is unchanged by the run, and show every POST is refused.
5. **Sprint 11 renders with its true status**, not `cancelled` — the specimen that broke the spike's
   first draft.
6. **Ids render unmangled** — `0013` reads `0013`, not `13` — with the check shown.
7. **A snapshot timing at fkit's real corpus is recorded**, with the corpus size and the counting rule
   beside it.
8. **`git diff --stat` shows no file under `ai-agents/tasks/done/`, `ai-agents/tasks/cancelled/`, or
   `ai-agents/wiki-vault/`**, and no task or sprint folder moved or renamed.
9. `node --test test/*.test.js` passes.

## Outcome — the owner's demo verdict, recorded at close

⭐⭐ **Recorded here by the closing `fkit-producer` on 2026-09-21 because it existed nowhere on disk.**
Until this close it lived **only in a live `fkit lead` session transcript**. Every reader in the
evaluation chain — both project leads, Codex, and `fkit-external-expert` — independently flagged the
absence of any real usage evidence as the gap that mattered, so it is written down rather than left to
a transcript.

**What happened.** The owner ran this task's reader against the **live tree — 411 tasks across 11
boards** — and judged it **better than reading the markdown files**. That is the deliverable's actual
test (*"the way the owner actually reads his board"*) and the one no automated test can make.

**When.** 2026-09-21, in a live `fkit lead` session.

⚠️⚠️ **PROVENANCE — SELECTED OPTION TEXT, NOT HIS OWN WORDS.** He chose a **pre-written option**
(*"Yes — I'd use this"*) via `AskUserQuestion` and **typed no free text**. ⛔ **Never quote this as the
owner's prose.** His genuinely-typed prose about markdown being *"hard to read and too huge to
consume"* is a **separate, earlier** datum, canonically recorded on
[`0404`](../0404-evaluate-aiboard-as-fkits-human-readable-board-and-design-the-integration-seam/brief.md)
and cross-referenced on
[`0405`](../../backlog/0405-investigate-a-terminal-ui-for-the-board-and-compare-it-against-the-web-board/brief.md).

⛔⛔ **THE LIMITS, STATED SO THIS IS NOT READ AS MORE THAN IT IS.** **One session, one user** — who is
also **the author of both systems** and **knew what he hoped to see**. ⭐ **It is a strong signal about
one user's workflow. It is NOT a usability finding**, and it does not settle *"which of web and
terminal is more readable"* — that remains `0405`'s deliverable.

⚠️ **It may bear on [ADR-051](../../../knowledge-base/decisions/adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md)'s
gate**, whose pre-declared failure conditions include *"he stopped using it and did not notice"* — this
is the first datum saying he ever started. ⛔ **ADR-051 was NOT edited by this close.** It is `accepted`,
and amending its prose is the **architect's** act, not a mover's. Raised to the driver as an open
question instead.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- ⛔ **"Depends on: nothing" is a statement about fkit TASKS, and it is not the whole picture.**
  aiboard's **Node port** is an **external precondition** on **aiboard's own board** — it is ADR-051's
  gate precondition `P1`, and it decides how much hardening is worth doing (see the live-judgement
  section above). ⚠️ **It is not a fkit task and `dashboard.sh` cannot see it.** Stated here because the
  canonical dependency form has no way to say it
  ([`dependency-declaration-form.md`](../../../knowledge-base/conventions/dependency-declaration-form.md)).
- ⭐⭐ **SUPERSEDED THE SAME DAY — THE OWNER RULED THE RE-RANK AND THIS TASK IS NOW `P3`.** The bullet
  below is left **byte-identical** as the record of how it was filed; where the two disagree, this note
  governs. ⛔ **Authority first:** **the owner ruled it**, **2026-09-20**, **live via `AskUserQuestion`
  in an `fkit lead` session**, relayed into a spawned `fkit-producer` with no owner channel (ADR-021).
  ⚠️ **SELECTED OPTION TEXT — a pre-written option he chose; he typed no free text, so it is not his own
  prose.** ⛔⛔ **This is NOT producer precedent for re-ranking.** ⭐ **The refusal below stands as
  correct and is not erased by the outcome:** this brief was **appended at `P5`** and the merit position
  **escalated, not taken** — a mid-board insertion of a *new* row is not ADR-035's exception; moving a
  row that already exists, on an owner ruling, is. ⚠️ **`P3`, not the `P2` the option text names:** `P2`
  is held by `0404`, a **closed** row, and closed history is not re-ranked — so the ruled merit position
  (*"runs next, ahead of `0405` and `0410`"*) lands one integer lower. `0405` → `P4`, `0410` → `P5`;
  ⛔ **no closed row moved.** Full record on
  [Sprint 11](../../../sprints/sprint-11.md) under its heading *"THE OWNER RULED THE RE-RANK"*.
- ⚠️ **Priority `P5` is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below `0404`**, because it is the continuation of the Track-1 interim
  `0404`'s row was re-scoped to, ADR-051 ruled that interim *"RUN IT NOW"*, and
  [`0405`](../../backlog/0405-investigate-a-terminal-ui-for-the-board-and-compare-it-against-the-web-board/brief.md)'s
  own merit statement places it *"directly below `0404`"* — its comparison is only meaningful once a real
  board exists to compare against. ⛔ **It was appended, not inserted**: a mid-board insertion is not the
  owner-ruled re-rank exception
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
  and **a spawned producer has no owner channel and never re-ranks**.
- ⚠️ **Relationship to [`0405`](../../backlog/0405-investigate-a-terminal-ui-for-the-board-and-compare-it-against-the-web-board/brief.md)
  — cross-reference, not a dependency.** `0405` investigates a terminal UI and compares it against the
  web board. ⛔ **`0405` does not remove the web board**, and this task does not pre-empt `0405`'s
  comparison. ⭐ **A reader that actually runs makes `0405`'s comparison possible rather than
  hypothetical.**
- ⚠️ **Relationship to [`0383`](../../backlog/0383-shrink-the-backlog-board-whose-task-cells-are-being-used-as-a-document-store/brief.md)
  — cross-reference.** `0383` shrinks the markdown board; this reader **parses** that board. ⭐ **`0383`'s
  hard constraint that `dashboard.sh`'s parsed contract does not change is what keeps the two
  compatible** — whoever runs the second of the two re-reads the first.
- ⚠️ **One brief, not several — the split rationale, recorded because decomposition is the default.**
  The pieces above are **not independently shippable**: deciding what of the spike survives produces a
  decision, not a shipped thing, and it is made inside this task's plan; de-hard-coding the paths and
  getting the content right are not separately useful — a reader the owner cannot start, or that
  mis-reads Sprint 11's status, is not *"the way the owner actually reads his board."* ⭐ **The real
  split comes after the Node port lands**, and its shape is unknown until then. ⛔ **Do not pre-file
  it** — investigation-first.
- ⛔ **Written by a spawned `fkit-producer` with no owner channel** (ADR-021). Every framing choice below
  the owner's own quoted words is this producer's, and is open to correction. ⛔ **No commit was made by
  this filing**, and nothing was written to `ai-agents/wiki-vault/` (ADR-005).
