# Architect decision — does `/fkit-heal` warrant its own role?

## ID
0304

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

⚠️ **CHANGED 2026-09-14 from `fkit-architect` — a producer judgement under the re-scope, flagged and reversible in one edit.** The 2026-08-14 ruling that set `fkit-architect` is preserved verbatim under `## Notes` and is not overruled; it ruled on a deliverable that no longer exists. See §"⚠️ On the owner field" under `## What to build`.

## Context

### ⛔ What this task is, and what it is NOT

**This task asks a question and returns a recommendation for the owner to rule on.**

⛔ **It does NOT create a role.** It does not edit `skills_for_role()`, the menu, any agent
definition, or any test. ⚠️ **Even if the recommendation is "yes, build it", building it is a
separate task the owner must authorize** — see `## Notes`.

### Provenance

**Owner ruling, 2026-08-14**, given live via `AskUserQuestion` in a `fkit lead` session driving
`/fkit-sprint-ship-loop` — **the option label is the verbatim text**: **"File it as an architect
decision (Recommended)"**.

**The owner's observation, which is the whole question:** *it is not obvious why heal sits under the
producer.* It surfaced after they updated to `v0.2.2` and ran `fkit` in a real consuming project
(`geoconflict`), and the launch-time notice told them to *"run `/fkit-heal` in a producer session"* —
a role they had no other reason to open.

**Verified on disk 2026-08-14:** `/fkit-heal` is **1 of the producer's 10 skills**, per the
`producer)` arm of `skills_for_role()` in `claude/skills-for-role.sh`, which lists: `fkit-team`,
`fkit-query`, `fkit-open-questions-interview`, `fkit-dumb-down`, `fkit-initiate-project`,
`fkit-task-brief`, `fkit-task-done`, `fkit-task-cancelled`, `fkit-status`, `fkit-heal`. ⚠️ **Note the
shape of that list**: the other nine are product, planning and task-lifecycle work. **Heal is the odd
one out** — it is a repo-maintenance operation. That is the owner's point, stated in code.

**Owner ruling, 2026-08-14**, same session and channel — **"Backlog, unranked — rank later
(Recommended)"**. Unranked, no sprint. ⚠️ **There is no active sprint** —
[`0294`](../../done/0294-archive-sprint-5-move-the-plan-into-sprints-done-and-repoint-every-link/brief.md)
archived Sprint 5 on 2026-08-14 and opened no successor; `select-active` returns `active none`
(exit **3**, the documented no-active-sprint code, **not** a failure).

**Owner ruling, 2026-08-14**, same session and channel — **"Three separate briefs (Recommended)"**.
This task, [`0302`](../../done/0302-pressing-enter-at-the-role-menu-should-open-the-lead/brief.md) and
[`0303`](../0303-give-the-lead-a-trigger-for-the-structure-notice-so-it-can-offer-the-heal/brief.md)
are **three separate rows, not one bundle**. ⚠️ Recorded here for completeness — the label was already
carried by `0302` and `0303` and is restated so all three rows agree on their own filing authority.

### ⭐ Further owner ruling, 2026-08-14 — recommended order: this task FIRST

**Given live via `AskUserQuestion`, same session and channel — the option label is the verbatim
text: "0304 first, then 0303 (Recommended)".** The **recommended sequence** is **this task before**
[`0303`](../0303-give-the-lead-a-trigger-for-the-structure-notice-so-it-can-offer-the-heal/brief.md)'s
trigger design, **because a "yes, heal warrants its own role" changes `0303`'s premise materially.**

⚠️⚠️ **This is a SEQUENCING PREFERENCE, NOT a hard dependency** — the owner's own framing was
**"neither blocks the other"**. ⛔ **It is deliberately NOT written into either task's `Depends on:`
bullet**, so ⛔ **nothing here makes `0303` ineligible.** See `## Notes`.

## What to build

> ## ⭐⭐ RE-SCOPED 2026-09-14 — THIS SECTION AND `## Verification steps` WERE REPLACED. **DECIDE → MOVE.**
>
> **Authority: owner ruling 2026-09-14**, given live via `AskUserQuestion` in a live `fkit lead`
> session with the owner present — **the option label is the verbatim text: *"Re-scope the existing
> brief (Rec)"***. The alternative offered was filing a new row and cancelling this one; the owner
> chose to keep **this row, this id**.
>
> ⛔ **WHY IT HAD TO BE RE-SCOPED, AND THE READING IS NOT A JUDGEMENT CALL.** The 2026-09-13 ruling at
> the foot of this brief moves `/fkit-heal` **to the lead** and rejects a ninth role. Its own words:
> the *"weigh all four"* framing is **"spent"** and *"what remains is the **move itself**."* ⛔ **But
> the section this replaced FORBADE, by name, every surface the move requires** — it said *"No edit to
> `claude/skills-for-role.sh`, `claude/agents/`, the launcher menu, `test/`"* and its step 6 made
> touching them **"a failed run"**. ⛔ **A brief that forbids its own ruling's work cannot be run.**
>
> ⛔ **WHAT WAS NOT TOUCHED — every byte of the record is preserved.** The `## Context` provenance, the
> three 2026-08-14 rulings, the 2026-08-14 **ordering** ruling (in **both** the places it appears — in
> `## Context` and again under `## Notes`), the *"if the recommendation is yes"* note, the
> *"On the owner role"* section, the filing-time tree state, and the whole **2026-09-13** blockquote at
> the foot of this file are all **byte-identical**. ⛔ **This re-scope replaces the FORWARD scope, never
> the record.** ⚠️ Where a preserved section is now spent, it is named as spent **here** rather than
> edited there.
>
> ⚠️ **The H1 still reads *"Architect decision — does `/fkit-heal` warrant its own role?"* and the
> folder slug still reads `0304-decide-…`. Both are now STALE and both were left alone deliberately** —
> the ruling authorised a re-scope, not a rename, and the slug has **three inbound citers** (the Backlog
> board, `0303`'s brief and `0305`'s brief, measured 2026-09-14). ⛔ **Retitling and renaming is a
> separate act needing its own ruling.** ⭐ **The Backlog board row already carries the 2026-09-13
> correction**, so a board reader is not misled by the stale title.
>
> ⚠️ **The `## Owner` field was changed from `fkit-architect` to `fkit-coder` — a PRODUCER JUDGEMENT,
> flagged, and reversible in one edit.** See §"⚠️ On the owner field" below for the argument and the
> ruling it sits against.

**Move `/fkit-heal` from the producer to the lead.** ⛔ **The decision is made — this task executes it.
It weighs nothing and recommends nothing.**

### ⛔ THE SURFACES — RE-DERIVED ON DISK 2026-09-14, NOT CARRIED FROM ANY HAND-OVER

⚠️ **Re-measure at pickup; this table is dated and the repo moves.** Counts are occurrences of the
literal string `fkit-heal` in each file at `HEAD` `f209a8c`.

**Group 1 — the declaration point. One line, and it is the whole ownership change.**

| Surface | Measured 2026-09-14 | What the move does |
|---|---|---|
| `claude/skills-for-role.sh` | **1** occurrence, in the `producer)` arm (which lists 12 skills) | ⭐ **Remove `fkit-heal` from `producer)`, add it to `lead)`** (which lists 5 today). ⛔ **This is the single declaration point**, sourced by **both** `claude/fkit-claude.sh` and the [ADR-018](../../../knowledge-base/decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) `PreToolUse` hook |

**Group 2 — the tests that pin the declaration.**

| Surface | Measured 2026-09-14 | What the move does |
|---|---|---|
| `test/skill-ownership-hook.test.js` | **3** occurrences — the all-skills list, the `producer:` matrix row, **and a comment reading *"producer-owned per the owner's 2026-08-06 …"*** | ⛔ **Move the entry from the `producer` row to the `lead` row, AND correct the comment.** ⚠️ **A move that updates `skills_for_role()` and not this matrix goes RED — that is the desired behaviour, not a surprise** |
| `test/dual-home-parity.test.js` | — | ⚠️ **Not edited, but it BINDS**: two Group-3 surfaces below are dual-homed into `claude/scaffold/` and this test enforces the pairing. ⛔ Edit each pair in the same change |

⛔⛔ **A CORRECTION TO THE SURFACE LIST THIS TASK WAS HANDED — MEASURED, NOT ARGUED.**
**`test/launcher-contract.test.js` is NOT a surface this move touches.** Measured 2026-09-14: it
contains **zero** occurrences of `heal`, and its role handling is a generic
`const ROLES = ['lead', 'producer', 'coder', 'architect', 'reviewer', 'adversarial-reviewer', 'wiki']`
array iterated by every arm. ⭐ **That array was a real surface for the question this brief USED to
ask** — adding a ninth role would have grown it. ⛔ **Moving a skill between two existing roles changes
no role, so it changes nothing here.** ⚠️ **Re-check at pickup rather than trusting this line** — but
do not budget for it on someone's say-so.

**Group 3 — the prose that names the producer as heal's owner. Each was verified to actually say it.**

| Surface | Measured 2026-09-14 | The line that changes |
|---|---|---|
| `claude/skills/fkit-heal/SKILL.md` | **6** occurrences | ⛔ **Its own `⛔ Owner:` banner reads `⛔ Owner: the **producer**`**, and its consult example reads `@fkit-producer Run /fkit-heal …` |
| `claude/agents/fkit-producer.md` | **1** | The producer's own skill enumeration names `/fkit-heal`. ⛔ **Remove it** |
| `claude/agents/fkit-lead.md` | ⭐ **0** | ⛔ **The ADD side.** The lead's agent file does not mention heal at all today and must gain it |
| `claude/skills/fkit-team/SKILL.md` | **1** | Its role→procedures table's **producer** row lists `/fkit-heal`. ⛔ Move it to the **lead** row |
| `claude/scaffold/CLAUDE.md` | **1** | Its role table's **producer** row lists `/fkit-heal`. ⚠️ **Dual-homed** |
| `claude/scaffold/ai-agents/README.md` | **1** | *"`/fkit-heal` in a producer session"* — wording, not a list. ⚠️ **Dual-homed** |
| `ai-agents/README.md` | **1** | *"`/fkit-heal` in a producer session shows what diverged…"* |
| `README.md` | **2** | *"run `/fkit-heal` in a producer session"* (the second occurrence names no role and may need nothing — **check, do not assume**) |
| `claude/fkit-claude.sh` | **5** | ⛔ **Only ONE names a role**: the launch-notice `printf` reading *"run /fkit-heal in a producer session"*. The other four are comments and a path to `skills/fkit-heal/check.sh` and change nothing. ⭐ **This notice is the whole complaint that opened this task** — it is what sent the owner to *"a role they had no other reason to open"* |

⚠️ **`ai-agents/knowledge-base/architecture.md` holds 7 occurrences and `ai-agents/.fkit-accepted-drift`
holds 1 — TRIAGE, do not rewrite blind.** Some are historical narration of a decision that was true when
written. ⛔ **Rewriting a dated record to match today's state is the failure this repo has a convention
against.**

⛔⛔ **NEVER EDIT `.claude/`.** The `.claude/agents/` and `.claude/skills/` copies in this repo are
**gitignored and regenerated** by `claude/fkit-claude-init.sh .` from the canonical sources under
`claude/`. ⛔ **A hand-edit there is lost on the next refresh and is not part of this task's diff.**
⚠️ **A prior hand-over listed *"the `.claude/` mirrors"* as a surface to edit — that is wrong, and it
is corrected here rather than repeated.**

### ⚠️ What the move must NOT quietly change

- ⛔ **No ninth role.** Owner-ruled 2026-09-13, and the reason is recorded there: ADR-028's **eighth**
  role is still authorised-but-unbuilt.
- ⛔ **No change to what `/fkit-heal` DOES.** Its consent gate, its report-only treatment of
  owner-edited files, its never-move/rename/delete rule, and its routing of wiki-vault repairs to
  `fkit-wiki` ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md))
  are all unchanged. ⭐ **This is a change of owner, not of behaviour.**
- ⛔ **No change to any other role's skill set.**
- ⚠️ **Whether the ruling warrants an ADR is OPEN and is a plan-gate question for the owner.** ⭐ The
  2026-09-13 note observes an ADR would now be **recording, not deciding** — ⛔ but it does not say one
  is owed, and this brief does not decide it either.

### ⚠️ On the owner field — changed to `fkit-coder`, and this is a flagged producer judgement

⛔ **The 2026-08-14 ruling *"File it as an architect decision (Recommended)"* is preserved verbatim
under `## Notes` and is NOT overruled here.** ⭐ **It ruled on a DELIVERABLE that no longer exists** —
an architecture decision document. **The deliverable is now a code and prose move** across
`claude/skills-for-role.sh`, `claude/`, `test/` and the scaffold.
[ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
Decision 1 fixes the role by the deliverable and staffs source, tests, scaffold and prose under
`claude/` to the coder as **sole source-write authority**; ⛔ **the architect never writes source.**
⚠️ **Leaving `fkit-architect` would route a code move to a role that cannot perform it.** ⛔ **The owner
can revert this field in one edit, and this paragraph is here so the revert is informed.**

## Verification steps

1. **`skills_for_role()` is the ONLY behavioural change.** Show the diff of
   `claude/skills-for-role.sh`: `fkit-heal` gone from `producer)`, present in `lead)`, and ⛔ **no other
   arm touched.**

2. **Prove the lock actually moved, in both directions** — the point of the task, not a formality:
   - A **producer** session/identity invoking `/fkit-heal` is **DENIED** by the ADR-018 `PreToolUse`
     hook.
   - A **lead** session/identity invoking `/fkit-heal` is **ALLOWED**.
   ⛔ **Both, or the move is not demonstrated.**

3. **`node --test test/skill-ownership-hook.test.js` is green**, with the matrix row moved **and** its
   `fkit-heal` comment corrected. ⚠️ **A green suite with a stale comment fails this step.**

4. **`bash test/prove-red.sh` still passes**, and state whether any existing mutation covers this move.
   ⛔ **If none does, say so** ([ADR-026](../../../knowledge-base/decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled.md)
   discipline) — whether one is owed is a plan-gate question, not this step's to settle.

5. **The full suite is green**, `test/dual-home-parity.test.js` included. ⛔ **Both dual-homed pairs
   edited in the same change.**

6. **Every Group-3 surface is either changed or explicitly ruled out, in writing, one line each.**
   ⛔ **A surface silently skipped fails this step.** ⭐ **Include the launcher's notice line** — it is
   the sentence the owner actually complained about.

7. **`claude/agents/fkit-lead.md` gained heal and `claude/agents/fkit-producer.md` lost it.** ⛔ Both
   halves; a move that only removes leaves the skill undocumented on its new owner.

8. ⛔ **`git status --porcelain` shows NO change under `.claude/`** (gitignored and regenerated) **and
   NO write under `ai-agents/wiki-vault/`**
   ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

9. ⛔ **No ninth role was created.** No new arm in `skills_for_role()`, no new entry in
   `test/launcher-contract.test.js`'s `ROLES`, no new file under `claude/agents/`.

10. **`ai-agents/knowledge-base/architecture.md` and `ai-agents/.fkit-accepted-drift` were TRIAGED and
    the triage is stated** — which occurrences are live claims (change them) and which are dated
    narration (⛔ leave them).

## Notes

- **Depends on:** nothing
- **Blocks:** nothing

⚠️ **Informed by, but explicitly NOT blocked on,
[`0303`](../0303-give-the-lead-a-trigger-for-the-structure-notice-so-it-can-offer-the-heal/brief.md).**
Recorded honestly: the architect can weigh **both futures** — "with the lead offering the heal" and
"without" — from `0303`'s brief alone, without its design pass having run. ⛔ **Do not gate this on
`0303`.** ⚠️ **The reverse direction is the one that matters**: if **this** lands first and
recommends a heal role, `0303`'s design premise should be re-checked before anything is implemented
(`0303`'s `## Notes` records the same warning from its side).

### ⭐ Recommended order — this task first, then `0303`. ⛔ A PREFERENCE, NOT A DEPENDENCY.

**Owner ruling, 2026-08-14, verbatim label "0304 first, then 0303 (Recommended)"** — given live via
`AskUserQuestion`. ⭐ **This task is the recommended first of the pair**, because a **"yes"** here
changes `0303`'s premise materially.

⚠️⚠️ **A SEQUENCING PREFERENCE, NOT a hard dependency — the owner's own framing was "neither blocks
the other."** ⛔ **It is deliberately NOT recorded in either task's `- **Depends on:**` bullet**, which
stays `nothing` on both. That bullet is the **only** form a board- or loop-driven view reads as a
dependency (`dashboard.sh` parses exactly it to derive each task's next-step), so writing the
preference there would make `0303` **ineligible** — which is precisely what the owner did **not**
rule. ⭐ **The preference lives here, in prose, where a human planner reads it and a scheduler does
not.**

⛔ **Running `0303` first is NOT a violation** — it is the less-preferred of two sanctioned orders.
⚠️ Note the asymmetry that makes this task the better first move: **this task can weigh both futures
from `0303`'s brief alone**, without `0303`'s design pass having run, while `0303` cannot recover a
heal-role decision that has not been made.

[`0302`](../../done/0302-pressing-enter-at-the-role-menu-should-open-the-lead/brief.md) came out of the same
session and the same launch. It is **independent** — but ⚠️ note it edits the **same menu prompt
string** a ninth role would edit. ⛔ Not a dependency; a cost worth naming in §2.

### ⚠️ If the recommendation is "yes, build it" — that is still not authorization

⛔ **This task returns a recommendation for the OWNER to rule on.** Building the role is a separate
task, filed by a producer **only after** the owner has ruled. ⚠️ Note the standing constraint from
`task-owner-vocabulary.md`: a role is **not a valid `## Owner` value until it actually ships** — so
even an authorised-but-unbuilt heal role could own no task, exactly as the eighth role owns none
today.

### ⛔ Scope fences — ⭐⭐ REPLACED 2026-09-14 BY THE RE-SCOPE. The list they replaced is quoted below, because it is WHY the re-scope happened.

⛔ **The fences that stood here forbade every surface the 2026-09-13 ruling requires.** Quoted verbatim
so no reader thinks they were dropped for convenience:

> ⛔ **Do NOT create a role.** No edit to `claude/skills-for-role.sh`, `claude/agents/`, the launcher
> menu, `test/`, the `fkit-team` skill, or `task-owner-vocabulary.md`.

⭐ **The first sentence SURVIVES and is restated below. The second is what the ruling reversed** — those
are now the surfaces the work touches. ⛔ **Nothing was relaxed beyond that.**

**The fences that bind now:**

- ⛔ **Do NOT create a role.** ⭐ **Unchanged and owner-ruled 2026-09-13** — a ninth role is rejected
  while ADR-028's eighth is authorised-but-unbuilt. No new `skills_for_role()` arm, no new
  `claude/agents/` file, no new entry in `test/launcher-contract.test.js`'s `ROLES`.
- ⛔ **Do not change what `/fkit-heal` does.** Owner, not behaviour.
- ⛔ **Do not touch any other role's skill set.**
- ⛔ **Never edit `.claude/`** — gitignored and regenerated from `claude/` by
  `claude/fkit-claude-init.sh .`.
- ⛔ **Do not add `fkit-heal` to `task-owner-vocabulary.md`** — that page's table is the authoritative
  `## Owner` role set, and **no role is being added**, so it needs nothing. ⚠️ **Check it rather than
  assume; if it names heal's owning role anywhere, that is a Group-3 surface.**
- ⛔ **Do not rewrite dated narration** in `architecture.md` or elsewhere to match today's state —
  triage it (verification step 10).
- ⛔ **Do not retitle this task or rename its folder.** Three inbound citers, and no ruling authorises
  it.
- ⛔ **No `ai-agents/wiki-vault/` write** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md))
  — if the ruling warrants a vault record, it is **routed to `fkit-wiki`**.
- ⛔ **No re-rank** ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)).
  ⚠️ **This row is NOT on Sprint 9** and was not pulled onto it by the 2026-09-14 re-scope.
- ⛔ **No task-file move by hand** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md))
  — the close goes through `/fkit-task-done`, **producer-only**, carrying the
  `(agent-closed — not owner-verified)` marker if the owner is absent.
- ⛔ **No commit, no push.**

### ⭐ `0303` IS UNBLOCKED AND RUNS AFTER THIS ROW — restated 2026-09-14, decided 2026-09-13

⭐ **[`0303`](../0303-give-the-lead-a-trigger-for-the-structure-notice-so-it-can-offer-the-heal/brief.md)
is unblocked.** The 2026-08-14 sequencing preference (*"0304 first, then 0303 (Recommended)"*) existed
because a *"yes, heal warrants its own role"* would change `0303`'s premise. ⛔ **That premise is
settled: the answer is no, and heal moves to the lead — which is exactly where `0303` puts the
trigger.**

⭐ **The recommended order still holds, and now for a MECHANICAL reason rather than a premise one:**
`0303` designs the **lead** offering the heal at session start. ⛔ **Until this row lands, the lead does
not own `/fkit-heal` and the ADR-018 hook would DENY the lead invoking it** — so `0303`'s trigger would
design an offer its own role cannot accept.

⚠️⚠️ **It is still NOT a hard dependency, and neither task's `- **Depends on:**` bullet changes** — both
stay `nothing`. ⭐ **That bullet is the only form a board- or loop-driven view reads as a dependency**;
writing the preference there would make `0303` ineligible, which is precisely what the owner did not
rule. ⛔ **Running `0303` first is not a violation** — it is the less-preferred of two sanctioned
orders. ⚠️ **The re-scope of 2026-09-14 changes NOTHING about this**; it is restated because a reader
arriving at the new scope should not have to reconstruct it.

### On the owner role — `fkit-architect`

⛔ **Owner-ruled, not a producer judgement.** Verbatim option label: **"File it as an architect
decision (Recommended)"**, given live via `AskUserQuestion`, 2026-08-14. The deliverable is a
role-model and cost/benefit judgement across ADR-010, ADR-018 and ADR-028 — architect territory by
construction.

### ⚠️ State of the tree at filing

Measured 2026-08-14 at filing time: `HEAD` is **`4424b44 "Release v0.2.2"`**, tag **`v0.2.2`** exists,
and `git status --porcelain` returned **0 lines — the tree was clean**. This brief, its two siblings,
and their three board rows are the only uncommitted work introduced by this filing.
(`conventions/evidence-before-assertion.md` — asserted from a check made this turn.)

> ## ⭐ DATED CORRECTION 2026-09-13 — OWNER RULING: **`/fkit-heal` moves to the LEAD. No ninth role.** Every prior byte left identical.
>
> **The owner ruled, live via `AskUserQuestion` in a live `fkit lead` session with the owner present,
> on 2026-09-13 — verbatim option label: *"Move it to the lead (Rec)"*.** This note is the amendment;
> ⛔ **every byte above is deliberately left byte-identical**, per the superseded-text convention.
>
> ### What was decided
>
> **`/fkit-heal` moves from the producer to the lead.** ⛔ **A ninth role is REJECTED.** The question
> the brief was written to weigh — *does heal warrant its own role?* — is answered **no**, and answered
> by the owner rather than deferred to an architect's recommendation.
>
> ### The owner's stated reasoning
>
> - ⭐ **The lead has few skills**, so heal lands somewhere with room for it rather than crowding a
>   role already full of lifecycle work.
> - ⭐ **The lead is the session users open first** — which is the whole complaint that opened this
>   task. The owner's original observation was that the launch-time notice sent them to *"a role they
>   had no other reason to open"*. Putting heal on the lead removes the round trip at its source.
> - ⛔ **A ninth role was rejected because ADR-028's EIGHTH role — the sandboxed e2e tester — is still
>   authorised-but-unbuilt.** The brief's §3 said this had to be stated rather than counted past
>   quietly; the owner stated it, and it is the reason the ninth role loses.
>
> ### ⭐ THE BRIEF'S COUNT IS STALE — re-measured on disk 2026-09-13
>
> ⛔ **The `## Context` above says *"`/fkit-heal` is 1 of the producer's 10 skills"*, verified
> 2026-08-14. That number is now WRONG.** Re-measured directly from the `producer)` arm of
> `skills_for_role()` in `claude/skills-for-role.sh`:
>
> | measurement | 2026-08-14 (in the text above) | **2026-09-13 (true)** |
> |---|---|---|
> | producer skills | 10 | **12** |
> | lead skills | not recorded | **5** |
>
> **The two added since are `fkit-sprint-done` and `fkit-sprint-cancelled`** — the sprint-board movers
> that **Sprint 8** put on the producer. The full current list: `fkit-team`, `fkit-query`,
> `fkit-open-questions-interview`, `fkit-dumb-down`, `fkit-initiate-project`, `fkit-task-brief`,
> `fkit-task-done`, `fkit-task-cancelled`, **`fkit-sprint-done`**, **`fkit-sprint-cancelled`**,
> `fkit-status`, `fkit-heal`.
>
> ⭐ **The argument is STRENGTHENED by the correction, not weakened.** The `## Context`'s point was
> that the other skills are *"product, planning and task-lifecycle work"* and **heal is the odd one
> out**. Both additions are **sprint-lifecycle movers** — squarely inside that same family. So the
> ratio moved from 9-against-1 to **11-against-1**, and heal is more conspicuously the outlier than
> when the observation was first made. ⛔ **Cite 12, not 10.** The stale sentence above is left in
> place deliberately; this note is its correction.
>
> ### Surfaces the move touches — named by the owner, verified on disk 2026-09-13
>
> | surface | state |
> |---|---|
> | `claude/skills-for-role.sh` | ⭐ **the single declaration point** for role→skill ownership, sourced by **both** `claude/fkit-claude.sh` and the ADR-018 `PreToolUse` skill-ownership hook. `fkit-heal` moves from the `producer)` arm to the `lead)` arm **here**. |
> | the launcher menu | `claude/fkit-claude.sh` — 5 `fkit-heal` occurrences at measure time. |
> | the mirrors | `claude/agents/fkit-producer.md`, `claude/skills/fkit-team/SKILL.md`, `claude/scaffold/CLAUDE.md`, `claude/scaffold/ai-agents/README.md`, `README.md`, and `claude/skills/fkit-heal/SKILL.md`'s own `⛔ Owner:` banner all name the producer as heal's owner. ⚠️ Several are **dual-homed** into `claude/scaffold/` and enforced by the parity test. |
> | `test/launcher-contract.test.js` | exists; asserts the launcher contract. |
>
> ⚠️ **That list is the owner's named set plus what a `grep` found — it is not certified complete.**
> Re-derive at plan time. The brief's §2 cost enumeration remains the right checklist to walk, read
> now as *"the cost of MOVING a skill"* rather than *"the cost of a NEW role"*.
>
> ⚠️ **`test/skill-ownership-hook.test.js`'s per-role/per-skill matrix** (named in §2) will also need
> the row moved — flagged here because a move that updates `skills_for_role()` and not the matrix will
> go red, which is the desired behaviour, not a surprise.
>
> ### ⚠️ `0303` is now UNBLOCKED
>
> [`0303`](../0303-give-the-lead-a-trigger-for-the-structure-notice-so-it-can-offer-the-heal/brief.md)
> was owner-ruled **2026-08-14** to run **after** this task, on the verbatim label
> ***"0304 first, then 0303 (Recommended)"*** — because *"a 'yes, heal warrants its own role' changes
> `0303`'s premise materially."* **That premise is now settled: the answer is no, and heal is moving to
> the lead — which is exactly where `0303` puts the trigger.** The sequencing preference is discharged
> and `0303` may proceed.
>
> ⛔ **Nothing changes in either task's `Depends on:` bullet** — the 2026-08-14 note was explicit that
> this was a **sequencing preference, not a hard dependency**, and deliberately not written into either
> declaration. That stays true.
>
> ⚠️ **The brief's §1 crux — *"the two may be alternatives, not complements"* — resolves toward
> COMPLEMENTS**, and both now live on the same role. What remains for `0303` is trigger design, not a
> contest with a ninth role that will not exist.
>
> ### What is left of this task
>
> ⚠️ **The decision is made, so the brief's *"weigh all four"* framing is spent.** What remains is the
> **move itself** across the surfaces above, plus whatever record the owner wants of the ruling. ⛔ **An
> ADR that records a decision the owner has not made** was the brief's stated failure mode; that risk
> is gone — the owner has made it, and an ADR would now be recording, not deciding.
>
> ⛔ **This row stays `🔲 Backlog`.** Nothing here is implemented and nothing here closes anything.

> ## ✅ DATED OWNER RULINGS 2026-09-14 — **TWO OPEN POINTS ON THIS BRIEF WERE PUT TO THE OWNER AND RULED. NOTHING CHANGES; BOTH ARE CONFIRMED.** Every prior byte left identical.
>
> ⭐ **Recorded so the next reader knows these were RULED, not overlooked.** Both given live via
> `AskUserQuestion` in an `fkit lead` session with the owner present; **the option labels are the
> verbatim text.**
>
> | # | Question put to the owner | Ruling (verbatim option label) | Effect |
> |---|---|---|---|
> | **1** | The `## Owner` field was **CHANGED 2026-09-14 from `fkit-architect` to `fkit-coder`** as a flagged producer judgement under the re-scope. Keep it, or revert? | ⭐ **"Keep fkit-coder (Rec)"** | ✅ **`## Owner` STAYS `fkit-coder`.** The change is no longer a producer judgement awaiting review — **it is owner-ruled.** ⛔ The 2026-08-14 ruling that set `fkit-architect` remains preserved verbatim under `## Notes` and is not deleted; it ruled on a deliverable that no longer exists |
> | **2** | The H1 (*"Architect decision — does `/fkit-heal` warrant its own role?"*) and the folder slug (`0304-decide-whether-fkit-heal-warrants-its-own-role`) both still describe the **spent** *"weigh all four"* framing. Rename either? | ⭐ **"Leave both for now (Rec)"** | ⛔⛔ **NEITHER IS RENAMED. DO NOT RENAME THEM.** The H1 stays as written and the folder slug stays as it is. ⚠️ **A reader who finds the H1 stale is finding something the owner has already seen and ruled on** — a rename would break inbound links for a cosmetic gain |
>
> ⚠️ **The `## Owner` note above the `## Context` heading — *"CHANGED 2026-09-14 … a producer judgement
> under the re-scope, flagged and reversible in one edit"* — is left BYTE-IDENTICAL and is now
> **superseded in one respect only**: the judgement it flags has been **reviewed and upheld by the
> owner.** ⛔ It is no longer awaiting a ruling.
>
> ⛔ **Nothing else on this brief changed.** `## Sprint` (`Backlog`), `## Priority` (`Unscheduled`) and
> `## Status` (`🔲 Backlog`) are untouched; no file was moved or renamed; nothing was re-ranked.
> Recorded by a spawned `fkit-producer` with no owner channel
> ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
