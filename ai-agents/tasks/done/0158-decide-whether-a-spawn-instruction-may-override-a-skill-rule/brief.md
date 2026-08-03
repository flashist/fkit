# Decide whether a spawn-time instruction may override a rule in the skill the spawned worker is running

## ID
0158

## Sprint
Sprint 2

## Priority
122

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-architect

## Context

**Investigation and ruling, not implementation.** The fix shape is unknown — it may be one clause, or a
clause plus a constraint on what the ship-loop driver may instruct. Do not write an implementation brief
for it until this is answered.

### The demonstrated failure — one live instance, on the record

On 2026-07-27 a spawned `fkit-producer` merit-ranked two new briefs into the middle of `sprint-2.md`,
renumbering 14 rows, in direct contradiction of `/fkit-task-brief` step 5 (*"append […] **Do not
renumber or insert into the owner's ranking**"*, reinforced twice more in the same file). It was not a
misreading. Its own addendum, `ai-agents/sprints/sprint-2.md:245-249`, verbatim:

> **⚠️ The placement below is producer judgment, not an owner ruling.** The owner approved **filing**;
> the ranking is the filing producer's, **made on the lead's instruction to rank on merit rather than
> append.** […] `/fkit-task-brief` step 5's default is to append […]

**A worker cited the skill's rule, then followed the spawn prompt instead — and recorded that it did.**
That is a precedence hole, not a comprehension failure.

### It is not a one-off, and the surface is every role

The spawn prompt that commissioned **this very brief** again carried a placement instruction — *"Rank
on merit — but per the owner's ruling of 2026-07-27, if merit placement would require inserting into
the ranking, append and flag it instead"* — on a subject step 5 already governs. The driver is still
issuing instructions into a rule's territory.

`claude/skills/fkit-sprint-ship-loop/SKILL.md` spawns **every** fkit role worker. So the question is not
about priorities and not about the producer: **any** driver instruction can land on **any** skill rule
for **any** spawned worker. Priorities are just where it surfaced first, and it surfaced benignly —
the owner accepted the outcome.

### A worked example in the other direction — a spawn instruction the owner ruled SHOULD win (2026-07-29)

**⚠️ Read the scope limit first. The owner ruled this INSTANCE only. It is not the general rule, and
this task exists precisely because the general rule has not been decided.** The example is recorded here
because a ruling on question 1 that cannot accommodate it is probably the wrong ruling.

**The collision.** At `0141`'s close on **2026-07-29**, a spawned `fkit-producer` running
`/fkit-task-done` hit a direct conflict:

- **The skill rule:** `/fkit-task-done` **step 5** instructs the closing producer to **re-point
  review-ledger references** from `tasks/backlog/…` to `tasks/done/…`.
- **The spawn instruction:** the driver's prompt instructed it **not to touch the ledger**.

**What the worker did — and this part is the behavior most worth codifying.** It **took the
conservative branch and escalated**, rather than resolving precedence silently in either direction. It
did not quietly re-point the ledger on the skill's authority, and it did not quietly skip the step on
the driver's. It surfaced the conflict.

**The owner's ruling, 2026-07-29, for this instance only: the spawn instruction wins — the ledger stays
frozen.** The reasoning, which the general ruling should engage with:

- **A review ledger records where the files sat when the findings were raised.** Re-pointing it
  **rewrites evidence**, which is a different act from repairing a broken link.
- **Every ledger produced during this run carries stale `backlog/` paths by design** — `0103`, `0125`,
  `0147`, `0150`, `0126`, `0141`. The staleness is the record, not a defect in it.

**Why this belongs in this brief.** The 2026-07-27 instance (above) is a spawn instruction displacing a
skill rule where the **outcome** was accepted but the **authority** was never established. This one is a
spawn instruction the owner **affirmatively** ruled correct. **A ruling of the form "the skill rule
always wins, full stop" would have produced the wrong answer here** — it would have re-pointed a ledger
the owner ruled must stay frozen. Any answer to question 1 has to survive both instances.

**It also supplies a candidate answer to question 2.** On both occasions the worker **complied-and-
flagged** or **escalated rather than resolving silently**, and on both occasions the owner accepted the
result. That is evidence for *comply-and-flag* / *surface-the-collision*, not proof of it — **the
architect decides.**

⚠️ **What the owner did NOT rule on 2026-07-29:** whether spawn instructions win generally; whether
`/fkit-task-done` step 5 should be amended; whether the ledger-freezing reasoning generalizes past
review ledgers. **Do not read any of those out of this instance.** If the ruling concludes step 5 needs
changing, name it as a follow-up for the producer to file — this task still implements nothing.

### Nothing anywhere answers it

Verified 2026-07-27 by reading the files:

| Site | Verdict |
|---|---|
| `claude/skills/fkit-sprint-ship-loop/SKILL.md` | **Silent.** No clause on what the driver may or may not instruct a worker to do, and no statement that a worker's skill binds it against the driver. **The "rank on merit" wording is not in this skill at all** — it is ad-hoc spawn-prompt text from the live lead session, which is what makes it invisible to review. |
| `claude/agents/fkit-lead.md`, `claude/agents/fkit-producer.md` | **Silent** on precedence between a skill rule and an instruction from the spawning agent. |
| `claude/universal-rules.md` | **Partial, and suggestive.** It already carries fkit's only precedence vocabulary — hard rules *"never"* lose a conflict; the `## Output style` preferences *"lose every conflict"*. **Skill rules are classified as neither.** |
| `ai-agents/knowledge-base/decisions/` | **Nothing on point.** ADR-010/012/018 govern *which* skills a role may invoke (the ownership lock). They are silent on whether a rule *inside* an invoked skill binds against a contrary instruction — a different axis. |
| `ai-agents/wiki-vault/` | **Nothing.** No page records a precedence rule for spawn instructions. |

The nearest existing machinery is the universal block's hard-rule / preference split. **A skill rule
sits in neither bucket**, and that is plausibly the whole gap.

### Why this is the architect's call and not the coder's

The producer can and should fix step 5's *wording* — that is task 0157, filed alongside this one and
deliberately scoped to exclude this question. But **whether an instruction from the spawning agent can
displace a rule in the procedure the worker is executing** is a question about fkit's authority model.
It affects every role, it interacts with the ADR-010/018 lock, and its answer determines what the
ship-loop driver is permitted to say. **A producer must not settle it unilaterally, and it is not a
text edit.**

There is also a live tension the ruling has to face honestly: this project's own agents are told that a
launching agent's messages *"direct your work"*. If a skill rule outranks that, the ruling must say what
a worker does when the two collide — comply, refuse, or surface it — because *"refuse silently"* would
have blocked a driver instruction the owner later endorsed.

## What to build

**A ruling, recorded.** An ADR under `ai-agents/knowledge-base/decisions/` if it changes or clarifies
the authority model; a convention page under `ai-agents/knowledge-base/conventions/` if it merely
records what was already implied. **The architect decides which — that choice is part of the finding.**

It must answer, explicitly:

1. **Which wins** when a spawn-time instruction contradicts a rule in the skill the spawned worker is
   running. Consider at least: skill rule always wins; instruction wins; skill rule wins unless the
   instruction relays a **named owner ruling**; a hard-rule/preference split applied to skill rules.
2. **What the worker does on a collision** — comply, refuse, or comply-and-flag. Silent compliance and
   silent refusal must both be ruled in or out by name. Note that on 2026-07-27 the worker *did* flag
   it, in the addendum, and the flag is why this task exists — that outcome may be the one to codify.
3. **What the driver may not instruct.** If the answer constrains `fkit-sprint-ship-loop`, say which
   clause it needs. If it does not, say so — *"no driver change"* is a valid finding.
4. **Where the rule lives**, so it reaches a spawned worker that reads only its own skill and its spawn
   prompt. Note the known trap: the ADR-012 lesson is that a session-scoped mechanism does not survive a
   spawn. A rule written only in a SKILL.md the worker does not load has the same shape of problem.
5. **Whether it needs enforcement at all**, or whether prose is proportionate. State it either way —
   `/fkit-task-brief` step 5 is prose-only and unenforced today, and it was overridden on its first
   contested day.

**No implementation.** If the ruling implies work, name it as a follow-up for the producer to file. Do
not write the clause into any skill under this task.

## Verification steps

1. **The artifact exists** in `knowledge-base/decisions/` or `knowledge-base/conventions/`, and the
   report says which and why.
2. **All five questions above are answered explicitly** — each with a stated answer, not an implication.
   An artifact silent on any one has not closed the gap.
3. **The 2026-07-27 instance is adjudicated by name.** Apply the ruling to it and state the verdict: was
   Producer A's merit-rank permitted, forbidden, or permitted-with-a-flag? **A ruling that cannot decide
   the case that prompted it is not usable.**
4. **The counterfactual is stated.** Say what a worker receiving the same instruction should do *after*
   this ruling, in one sentence a spawned agent could follow with no other context.
5. **The tension is faced, not skipped.** The ruling addresses the *"a launching agent's messages direct
   your work"* instruction explicitly, and says how the two coexist.
6. **ADR-014 and the numbering rule are respected** if an ADR is written — `node --test
   test/adr-number-uniqueness.test.js` stays green, and the number is allocated per
   `/fkit-record-decision`.
7. **No skill, agent definition, or source file was edited.** `git diff --stat` shows only the new
   knowledge-base file (plus this brief's own status if closed). This task rules; it does not implement.
8. **The 2026-07-29 `/fkit-task-done` step-5 instance is adjudicated by name, alongside the 2026-07-27
   one.** Apply the ruling to it and state the verdict. **A ruling that decides one instance and breaks
   the other is not usable** — the two point in opposite directions, which is the whole reason both are
   recorded. State explicitly whether the owner's instance-only ruling (*"the spawn instruction wins,
   the ledger stays frozen"*) is **consistent with, an exception to, or superseded by** the general
   answer.

## Notes

- **Depends on: nothing.**
- **Blocks: nothing** — but see the coordination note below.
- **Coordinates with 0157, and does not gate it.** 0157 fixes step 5's wording (the owner-ruled
  exception, the merit-flag obligation, the closed-row carve-out) and is deliberately scoped to exclude
  this question, so both can run in either order. **If this ruling lands first and says skill rules win,
  0157 gains one more clause; if 0157 lands first, this ruling appends to it.** Neither blocks the
  other. **Do not fold the two together** — one is a wording fix on a settled rule, the other an open
  authority question, and merging them would put a producer's text edit inside an architect's ruling.
- **Coordinates with 0142 (P121)**, the skill-ownership fact-inventory investigation. Same class — a
  rule that exists but does not reach where it must bind — and both are architect-owned investigations
  into the authority model. **Check 0142's state first**; if it has run, its findings may narrow this.
  **Adjacency is not a dependency.**
- **The cheap outcome is a legitimate outcome.** The architect may rule in a paragraph that the skill
  always wins and the deliverable is one convention page. That is a fine result. The point is that a
  *producer* must not make the call, not that the call is necessarily hard.
- **⚠️ Priority 136 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  *(as filed. **✅ Resolved — the owner ruled it to P122 on 2026-07-27**, accepting the merit argument
  below in full; see the sprint plan's *"Re-ranked 2026-07-27 (third re-rank of the day) **by owner
  ruling** — 0157 and 0158 moved from append rank to their merit positions"* addendum. The flag no
  longer reads unresolved. Reconciled 2026-07-30 by 0159's sweep; nothing was re-ranked.)* Filed by a
  spawned producer with no owner channel; per the owner's ruling of 2026-07-27, appending was the only
  sanctioned option. **On merit this belongs at 122** — immediately below 0142 (P121), for the class
  adjacency above: same investigator, overlapping surface, and an investigation whose cost of waiting is
  that **every ship-loop run in the meantime can silently override a skill rule**. **Not ranked higher,
  because the one known instance was benign** — the owner accepted the outcome — so this is a latent
  control gap, not an outage. The merit/append gap is **fourteen slots**, the largest yet flagged on
  this board.
