# Decide whether Process-review is always `@fkit-coder`, or the architect gains the skill

## ID
0200

## Sprint
Sprint 2

## Priority
178

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-architect

## Context

**This is an investigation-and-ruling task, not an implementation task. The fix shape is not known,
and "neither (a) nor (b)" is a legitimate outcome.**

### What happened, verified against the tree 2026-08-02

`fkit-sprint-ship-loop`'s step-2 spawn table names one role per step. Its **Process review** row reads:

> `| **Process review** | `@fkit-coder` | apply `fkit-process-stateful-review` **method** — verify each
> finding, classify defect/frontier, write the *Coder response*; … |`

(`claude/skills/fkit-sprint-ship-loop/SKILL.md`, step-2 table, row **"Process review"**.)

On the 2026-08-02 driver run the driver instead spawned **`@fkit-architect`** for that step on **three
consecutive tasks** — `0158`, `0143`, `0195` — because each deliverable was architect work product (an
ADR, and dated correction notes on an ADR). The driver's stated reasoning: the role that owns the
artifact should process its review.

`/fkit-process-stateful-review` is **coder-owned**. `skills_for_role()`'s `coder)` arm reads:

> `coder)     echo "fkit-team fkit-query fkit-open-questions-interview fkit-dumb-down fkit-plan-task fkit-process-review fkit-process-stateful-review fkit-task-ship-loop" ;;`

(`claude/skills-for-role.sh`, `skills_for_role()`.) The `architect)` arm does **not** list it.

So the **ADR-018 `PreToolUse` hook denied the skill** to the architect worker. `claude/skill-ownership-hook.sh`
resolves the role from the payload's own `agent_type` at any spawn depth and ends at:

> `*) deny "role '$skill_name' does not own skill …"` — the live deny string is
> `role '<role>' does not own skill '<skill>'`.

On `0195` the worker reported the denial verbatim and disclosed the workaround
(`ai-agents/tasks/done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/worklog.md`,
§round-2 notes and the numbered producer item):

> *"the `PreToolUse` skill-ownership hook denied it (**"role 'architect' does not own skill
> 'fkit-process-stateful-review'"**), which is the ADR-018 gate working as designed. The **method** was
> applied by hand from the spawn instruction … Worth a producer look: a coder-side ledger step routed to
> the architect role."*

It also disclosed that **it never read the skill's procedure text** — it worked from the driver's spawn
instructions only.

### The three tasks, and their current state

| Task | Where it sits | What its record says about the Process-review step |
|---|---|---|
| `0158` | `ai-agents/tasks/done/0158-decide-whether-a-spawn-instruction-may-override-a-skill-rule/` | `worklog.md` line 4: *"**Role:** fkit-architect, spawned by `fkit-sprint-ship-loop`"*. `review.md` §Coder response attributes the round to *"process-review worker spawned by `fkit-sprint-ship-loop`"* — **role not named there**, and **no denial is recorded anywhere in the folder**. |
| `0143` | `ai-agents/tasks/done/0143-append-a-dated-correction-note-to-adr-010/` | `review.md` §Coder response: *"Written by the **fkit-architect** running `fkit-process-stateful-review` as a bounded worker"*. **No denial recorded.** See the ⚠️ below — that sentence cannot be literally true. |
| `0195` | `ai-agents/tasks/done/0195-correct-adr-010s-skills-for-role-source-of-truth-claim/` (`✅ Done (agent-closed — not owner-verified)`) | Denial reported verbatim; method applied by hand; non-execution disclosed. **Its process-review is being re-run by a coder now**, on the owner's ruling of 2026-08-02. |

`0158` and `0143` are closed and are being **audited read-only** — owner ruling 2026-08-02: *audit, do
not reopen*. **This task does not reopen them and does not edit their files.**

> ⚠️ **A fact defect found while writing this brief, flagged and NOT repaired here.** `0143`'s
> `review.md` §Coder response asserts the architect was *"running `fkit-process-stateful-review`"*. The
> hook denies that invocation to the architect identity at any spawn depth, and no denial is recorded in
> `0143`'s folder. Either the skill was never invoked and the ledger overstates what happened, or a
> denial went unrecorded. **Both readings are a record defect, and the same wording risk exists in
> `0158`, whose ledger simply omits the role.** This belongs to the read-only audit of `0158`/`0143`
> already in flight — **route it there; do not edit those folders under this task.**

### Why this is a real design question and not a driver preference

The hook worked correctly — it caught a genuine routing error. **This is not a bug report against
ADR-018.** Two things are actually wrong:

1. The loop's prose and the hook's enforcement **disagreed for three consecutive tasks before anyone
   noticed**, and the disagreement was only surfaced because one worker chose to disclose it.
2. **Nothing in the loop says *why* the coder is the right role for that step.** A future driver
   handed an architect-authored deliverable re-derives the architect substitution as obviously right,
   exactly as this one did. The rule is stated but not reasoned, so it does not survive contact with a
   plausible-sounding exception.

There is a third wrinkle the ruling must address either way: the table row asks the worker to *"apply
`fkit-process-stateful-review` **method**"* — the word **method**, not *run the skill*. A driver can read
that as licensing hand-application by any role, which is close to what happened. Whatever answer is
chosen, that wording is part of the surface being decided.

### The question to settle

Either:

- **(a)** `fkit-sprint-ship-loop` states plainly that Process-review is **always** `@fkit-coder`,
  regardless of deliverable type — **and says why**, so a future driver does not re-derive the architect
  substitution; or
- **(b)** `skills_for_role()` grants `fkit-process-stateful-review` to `architect` as well, for
  architect-owned work products.

**A third answer may be right.** This brief deliberately does **not** pre-decide it. What it does record
is one asymmetry the decider must weigh explicitly:

> **(b) widens a hook-enforced ownership boundary. That is an authority-model change and would likely
> need an ADR. (a) is a wording change to one skill file.** Stated as a cost asymmetry, **not** as a
> ruling — cheapness is an input to the decision, not the decision.

### Decisions that bear on this

- **ADR-018** (`adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md`) —
  the hook, and its identity-following behavior at any spawn depth. It performed correctly here.
- **ADR-012** (`adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md`) — `skills_for_role()`
  is the single declared source of truth for role→skill ownership, and *"now the only place role→skill
  ownership is expressed"*. Option (b) edits that source. ⚠️ ADR-012 cites `skills_for_role()` as living
  in `claude/fkit-claude.sh`; **it lives in `claude/skills-for-role.sh` today** — the same stale-home
  claim `0195` is repairing in ADR-010. Cite the file, not ADR-012's path.
- **ADR-033** (`adr-033-task-movers-are-producer-only-reversing-adr-025.md`) — precedent for *"this step
  belongs to that role, structurally"*, including the pattern of routing a step to its owning role
  rather than granting the skill more widely. Directly analogous to option (a).
- **ADR-037** (`adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md`,
  accepted 2026-08-02) — a skill rule binds a spawned worker unless the instruction relays a **named
  owner ruling**, and the owner ruled it **binds both worker and driver** (Q2). Directly relevant: the
  driver's spawn instruction substituted a role the skill did not name, **with no owner ruling behind
  it**. ⚠️ ADR-037 §Context explicitly says it decides the **content** axis and **not** the *"which skill
  may a role run at all"* axis — so **ADR-037 does not already answer this task**, but it is what makes
  the driver's substitution assessable.
- **ADR-036** (`adr-036-the-skill-ownership-site-inventory-is-a-declared-registry.md`) — if (b) is
  chosen, the change lands inside the declared skill-ownership surface and must be assessed against the
  registry. See the mirror obligation below.

### The mirror obligation, if (b) is chosen

`claude/skills-for-role.sh`'s own header names **four hand-maintained mirrors that MUST be updated in
the same commit**: `claude/skills/fkit-team/SKILL.md`, `claude/README.md`, `claude/scaffold/CLAUDE.md`
(ships into every consuming project), and `ai-agents/knowledge-base/architecture.md`. The header also
records that an incomplete version of this list already shipped a false statement into every consuming
project (task 70). **Cost the mirrors before choosing (b) — do not discover them afterwards.**

## What to build

**A decision, recorded. No implementation under this task.**

1. **Re-verify the five facts above first-hand** before reasoning from them — the `coder)` arm, the
   absence of the skill from the `architect)` arm, the table row's `@fkit-coder` and its *"method"*
   wording, the hook's deny path and identity resolution, and `0195`'s disclosed denial. **Report
   anything that no longer holds**; this brief decays.
2. **Assess at least (a), (b), and one "neither" option** — for example: leave ownership alone and make
   the loop's Process-review row state its role *and its reason*, plus a driver-side check that a
   substituted role is never assumed. State for each: what changes on disk, whether an ADR is required,
   what it costs to maintain, and how it fails.
3. **Answer these five explicitly** — silence on any one fails the task:
   - Does the Process-review step's role follow the **deliverable's author**, or is it **structurally the
     coder** regardless? Say which, and why, in a sentence a future driver can act on.
   - Is *"apply the **method**"* in the table row the right wording, or does it license the
     hand-application that occurred? If it stays, say why it is right.
   - If (b): does granting the architect a coder-owned skill weaken the coder's **sole-source-write**
     boundary, and what stops the same argument granting it to every role that authors a deliverable?
   - What makes the **next** disagreement between the loop's prose and the hook visible in fewer than
     three tasks? (A detection answer, not only a repair.)
   - Does the answer need an ADR, and if so, **name it as a follow-up for the producer to file** — do
     not write it under this task unless the ruling itself is the ADR.
4. **Deliverable:** an options assessment with a single recommendation, written where the architect's
   own procedure puts it (`ai-agents/knowledge-base/reports/`), or an ADR if the ruling is
   architectural. **Plus** a named list of follow-up tasks for the producer to file — the skill edit,
   the mirror updates, the guard, whatever the ruling implies.

**⛔ Out of scope, by name:**
- Editing `claude/skills/fkit-sprint-ship-loop/SKILL.md` or `claude/skills-for-role.sh` under this task —
  those are the follow-ups the ruling names.
- Any edit to `ai-agents/tasks/done/0158-*/` or `ai-agents/tasks/done/0143-*/` (closed, audit in flight).
- Any edit to `ai-agents/tasks/done/0195-*/` (closed 2026-08-02; its record is this task's primary evidence).
- Re-opening ADR-018, ADR-033 or ADR-037.
- Any `ai-agents/wiki-vault/` write (`fkit-wiki` only, ADR-005).
- Any re-rank of the board.

## Verification steps

1. `grep -n 'coder)' claude/skills-for-role.sh` shows `fkit-process-stateful-review` in the `coder)` arm,
   and `grep -n 'architect)' claude/skills-for-role.sh` shows it **absent** — or the deliverable records
   that this changed and when.
2. `grep -n 'Process review' claude/skills/fkit-sprint-ship-loop/SKILL.md` returns the step-2 table row,
   and the deliverable quotes the role token it actually carries at assessment time.
3. `grep -n "does not own skill" claude/skill-ownership-hook.sh` returns the deny path the architect
   worker hit, and the deliverable states how the role is resolved (`agent_type`, any spawn depth).
4. The deliverable exists at a stated path under `ai-agents/knowledge-base/` and answers **all five**
   questions in *What to build* step 3 — each answerable by reading one clearly-labelled section, with no
   question left implicit.
5. The deliverable names its **recommendation** and, for the option it recommends, states whether an ADR
   is required and lists **every file that would change** — including the four mirrors from
   `claude/skills-for-role.sh`'s header if (b) is recommended.
6. The follow-up list is concrete enough for the producer to file briefs from without re-deriving the
   analysis: one line per follow-up, naming the file or decision it touches.
7. No file under `claude/`, `ai-agents/tasks/done/0158-*/`, `ai-agents/tasks/done/0143-*/`,
   `ai-agents/tasks/done/0195-*/` or `ai-agents/wiki-vault/` is modified —
   `git status --porcelain` shows only the deliverable and this task's folder.

## Notes

- **Depends on:** nothing. Independent of `0190`, `0191` and `0194`, which implement ADR-037's clauses;
  this task decides a different axis (which role may run the step at all) that ADR-037 §Context
  explicitly leaves open.
- **Blocks:** nothing today. The follow-ups it names will be filed after it rules.

**Adjacency, not dependency.** `0189` (the skill-ownership site registry) and `0194` (assessing ADR-037's
clause sites against that registry) touch the same surface. If (b) is recommended, its change is a new
ownership-fact site and should be assessed the same way — **say so in the deliverable rather than waiting
on `0189`**.

**⚠️ This brief decays.** Every coordinate above was verified 2026-08-02 against a live tree that three
concurrent workers were editing. **Re-verify at implementation time**, and treat `0195`'s state as
certainly changed.

**Why this is an architect task and not a coder one.** Option (a) alone is a wording change to one skill
file — ordinary `fkit-coder` work. But the task is not (a); it is the choice between (a), (b) and a third
answer, and **(b) widens a hook-enforced authority boundary**, which is the architect's seat by
`ai-agents/knowledge-base/conventions/task-owner-vocabulary.md` (*"design consistency, feasibility,
ADRs"*) and by the precedent of `0192`, the other open *"decide whether the skill needs amending"* row,
also owned by `fkit-architect`. **Assigning it to the coder would presuppose (a).** The implementation
follow-ups this task names will mostly be `fkit-coder`'s.

**⚠️ Priority 178 is APPEND rank, NOT a merit ranking — flagged for owner confirmation.**
**On merit this belongs directly above `0162`**, at the top of the open board, because it is the only
open row repairing a **live control** — a routing rule that has already misfired three times and will
misfire again on the next architect-authored deliverable the same loop ships — whereas the rows above it
repair stale prose in documents. Filed by a spawned producer with **no owner channel**, which never
re-ranks (ADR-035, `/fkit-task-brief` step 5). **No existing row was renumbered, inserted past, or
touched**, and no `✅ Done` / `⛔ Cancelled` / `➡️ Moved` row was altered.

> ⚠️ **Merit contention, stated so the owner sees it in one place.** `0195` already claims *"directly
> above `0162`"* on merit, on the strength of its end-of-sprint deadline. Both claims cannot hold. This
> brief does not resolve it: `0195` carries a deadline, this one carries a live misrouting. **The owner
> picks.**
