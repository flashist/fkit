# Decide whether `/fkit-task-done` step 5 needs amending on the ledger-freezing reasoning

## ID
0192

## Sprint
Sprint 2

## Priority
170

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**Investigation and ruling, not implementation.** The fix shape is unknown — it may be an amendment to
`/fkit-task-done` step 5, an ADR amendment, a convention page, or **no change at all**, which is a
legitimate outcome. Do not write an implementation brief for it until this is answered.

**Follow-up 3 of [ADR-037](../../../knowledge-base/decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md)**
(accepted 2026-08-02). **ADR-037 deliberately does not decide this**, and `0158`'s brief forbade reading
it out of the instance. It is left open on the record, by name, twice.

### The open question

At `0141`'s close on **2026-07-29** a spawned `fkit-producer` running `/fkit-task-done` hit a direct
collision (ADR-037's **instance B**):

- **The skill rule** — `/fkit-task-done` **step 5** instructs the closing producer to **re-point
  review-ledger references** from `tasks/backlog/…` to `tasks/done/…`.
- **The spawn instruction** — the driver's prompt instructed it **not to touch the ledger**.

The worker took the conservative branch and escalated. **The owner ruled, for that instance only: the
spawn instruction wins — the ledger stays frozen.** The reasoning:

- **A review ledger records where the files sat when the findings were raised.** Re-pointing it
  **rewrites evidence**, which is a different act from repairing a broken link.
- **Every ledger produced during that run carries stale `backlog/` paths by design** — `0103`, `0125`,
  `0147`, `0150`, `0126`, `0141`. The staleness *is* the record, not a defect in it.

⚠️ **What the owner did NOT rule:** whether `/fkit-task-done` step 5 should be amended, or whether the
ledger-freezing reasoning generalizes past review ledgers. ADR-037 resolves the **precedence** axis and
explicitly leaves this one open.

### Why this is the architect's call

The question is not *"which instruction wins"* — ADR-037 settled that. It is **what step 5 should say**:
whether re-pointing a review ledger is *repairing a link* or *rewriting evidence*, and how far that
reasoning reaches. Step 5 today treats a ledger reference identically to a closed sprint plan's href —
*"they record what happened, not where a file lives"* — which is the **opposite** conclusion from the
owner's instance-B ruling, applied to the same class of file. **Two documents in this repository
currently point in opposite directions on the same act.**

### Live and interacting, not hypothetical

- **It interacts with ADR-034** (a review ledger closes on the work product, not the task's own record) —
  which already treats a ledger as a frozen record for one purpose and would have to agree with whatever
  is ruled here.
- **It interacts with `0176`'s owner ruling of 2026-08-01**, which grandfathers coordination citations
  inside closed `done/*/review.md` **by name**, on the stated ground that cleaning them means editing
  frozen historical ledgers — and which pointedly does **not** exempt `done/*/brief.md` or
  `done/*/worklog.md`. That ruling is evidence for a narrow, ledger-only freeze rather than a general one.
- **It is live on every close.** Every `/fkit-task-done` run reads step 5 as written and re-points ledger
  hrefs unless told not to. **This very task's parent, `0158`, was closed on 2026-08-02 by a spawned
  producer that left the moved brief's own `review.md` path byte-unchanged and flagged it** — the same
  collision, resolved the same conservative way, for the third recorded time.

## What to build

**A ruling, recorded.** An amendment to ADR-034 or a new ADR under
`ai-agents/knowledge-base/decisions/` if it changes the authority model; a convention page under
`ai-agents/knowledge-base/conventions/` if it records what was already implied. **The architect decides
which — that choice is part of the finding.**

It must answer, explicitly:

1. **Is re-pointing a review ledger's path a link repair or an evidence rewrite?** State the answer, not
   an implication.
2. **Does step 5 need amending?** If yes, say **which of its bullets** and what the amended rule is — in
   words a following task can implement without re-deriving the reasoning. If no, say so plainly; *"no
   change"* is a valid finding, and step 5's existing wording then needs a stated reason it is right.
3. **How far the freeze reaches.** Ledgers only, or worklogs, or plans, or briefs? Name each in or out.
   `0176`'s ruling exempts `done/*/review.md` **only** — say whether that boundary is the right one and
   whether the two rulings agree.
4. **What the mover does with a *broken* pointer it must not repair.** A frozen path that no longer
   resolves is rot from a reader's point of view. Say whether the mover leaves it, annotates it, or
   reports it — and if it reports it, to whom.
5. **Whether the moved task's own records are treated differently from a sibling's.** Step 5 has separate
   bullets for the two; the instance-B ruling was about a sibling, and `0158`'s close hit the own-record
   case. State whether they are one rule or two.

**No implementation.** If the ruling implies work — a step-5 edit, an ADR-034 amendment, a convention
page — **name it as a follow-up for the producer to file. Do not edit `/fkit-task-done` under this
task.**

## Verification steps

1. **The artifact exists** in `knowledge-base/decisions/` or `knowledge-base/conventions/`, and the
   report says which and why.
2. **All five questions above are answered explicitly** — each with a stated answer. An artifact silent
   on any one has not closed the gap.
3. **Instance B is adjudicated by name**, and the report states whether the owner's instance-only ruling
   of 2026-07-29 becomes **the general rule, an exception to it, or is superseded**.
4. **`0158`'s own close is adjudicated by name.** Its closing producer left
   `ai-agents/tasks/done/0158-…/review.md`'s recorded task path pointing at `tasks/backlog/…` and flagged
   it rather than repairing it. Say whether that was correct under the ruling. **A ruling that cannot
   decide the most recent live case is not usable.**
5. **The contradiction is faced.** The report quotes step 5's *"they record what happened, not where a
   file lives"* bullet and says whether it survives, is narrowed, or is wrong.
6. **ADR-014 and the numbering rule are respected** if an ADR is written — `node --test
   test/adr-number-uniqueness.test.js` stays green, and the number is allocated per
   `/fkit-record-decision`.
7. **No skill, agent definition, or source file was edited.** `git diff --stat` shows only the new
   knowledge-base file (plus this brief's own status if closed). This task rules; it does not implement.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **Coordinates with ADR-034 and with `0169`** (which points the stateful-review close conditions at
  ADR-034's work-product bar). Adjacency, not dependency — but if this ruling narrows what a ledger is,
  the two should not be read in isolation.
- **Does not gate `0190` or `0191`.** ADR-037 §1 is decided; step 5's fate does not change what either
  clause says.
- **⚠️ Priority 170 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below `0190`**, in the ADR-037 follow-up run, because it is the
  cheapest of the three to leave open — no wrong action is in flight. **The cost of waiting is real but
  small and bounded:** every close in the meantime re-decides the ledger question by hand, and all three
  recorded decisions so far reached the same conservative answer. Filed by a spawned producer with no
  owner channel; per the owner's ruling of 2026-07-27, appending was the only sanctioned option.
