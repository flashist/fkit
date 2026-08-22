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
fkit-architect

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

**One architecture decision document, with a recommendation** — via `/fkit-record-decision` if the
architect judges an ADR is warranted, or `/fkit-evaluate-approach` if the honest output is a weighed
comparison for the owner to rule on. ⚠️ **Which of those two is right is itself the architect's call**
— ⛔ do not write an ADR that records a decision **the owner has not made.**

Filed to `ai-agents/knowledge-base/decisions/` or `.../reports/` respectively. ⛔ **Never the wiki**
([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

**It must weigh, and state, all four of the following.**

### 1. ⭐ It competes directly with `0303` — this is the crux, address it head-on

[`0303`](../0303-give-the-lead-a-trigger-for-the-structure-notice-so-it-can-offer-the-heal/brief.md)
designs the **lead** offering the heal at session start, where the owner already is. ⭐ **If that
lands, a role you open *specifically* to heal has little left to do.**

⛔ **The two may be alternatives, not complements — and the recommendation must say which, in those
terms.** ⚠️ **A recommendation that treats them as independent has failed this task's main job.**
The likely shapes worth naming explicitly:

- **`0303` supersedes this** — the round trip disappears, so the producer-ownership oddity stops
  being user-visible and a 9th role buys nothing.
- **This supersedes `0303`** — a dedicated role is the cleaner answer, and `0303`'s session-start
  trigger (which fires on every lead launch) is the wrong place to solve it.
- **Genuinely both** — but then say **what each does that the other cannot**, concretely.

⚠️ **The architect can weigh both futures and should**; `0303` does **not** need to land first
(see `## Notes` — this is deliberately **not** blocked on it).

### 2. The cost of a new role — enumerate it, do not gesture at it

A role is not a file. The surfaces a new one touches, each verified as a real declaration point:

- **Role-locked sessions** ([ADR-010](../../../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md))
  — the `--agent` pin and the session's settings.
- **`skills_for_role()` in `claude/skills-for-role.sh`** — ⚠️ **the single declaration point**,
  sourced by **both** `claude/fkit-claude.sh` and the
  [ADR-018](../../../knowledge-base/decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md)
  `PreToolUse` skill-ownership hook.
- **The launcher menu** — the `1-7` prompt, the `case` arms, the role listing.
  ⚠️ **Note the collision:** [`0302`](../../done/0302-pressing-enter-at-the-role-menu-should-open-the-lead/brief.md)
  also edits that prompt string. ⛔ Not a dependency, but worth naming in the cost.
- **An agent definition** under `claude/agents/`.
- **Docs** — `README.md`, `CLAUDE.md`, the scaffold copies, and `ai-agents/knowledge-base/`.
  ⚠️ Several are **dual-homed** into `claude/scaffold/` and enforced by the parity test.
- **Tests** — `test/launcher-contract.test.js` iterates an explicit `ROLES` array;
  `test/skill-ownership-hook.test.js` owns the per-role/per-skill matrix.
- **The `fkit-team` skill**, which describes the team to the user.
- **`ai-agents/knowledge-base/conventions/task-owner-vocabulary.md`**, whose seven-role table is the
  authoritative `## Owner` set and which explicitly says a role is *"not a valid owner until it
  actually ships."*

### 3. ⚠️ It would be the NINTH role — and the eighth is not built

[ADR-028](../../../knowledge-base/decisions/adr-028-fkit-gains-an-eighth-role-a-sandboxed-e2e-tester.md)
**already authorised an eighth role — a sandboxed e2e tester — and it is NOT yet built.** The team is
**seven** today. ⛔ **Adding a ninth while the eighth remains unbuilt is itself a decision worth
stating**, and the document must state it rather than counting to nine quietly.

⚠️ Worth asking directly, because it may be the most useful thing this task produces: **is "add a
role" the shape fkit reaches for too readily?** Two authorised-but-unbuilt roles would be evidence
either way, and the answer bears on far more than heal.

### 4. Is the producer-ownership oddity a real design flaw, or an invisible internal detail?

Argue both sides. ⚠️ **The strongest version of "it is fine"**: with `0303` landed, a user is
**never** told to go open a producer session — the oddity becomes an implementation detail nobody
meets. ⚠️ **The strongest version of "it is a flaw"**: the producer's other nine skills are product
and task-lifecycle work (listed in `## Context`), and heal is repo maintenance — the grouping is
incoherent **on its own terms**, independently of whether a user notices.

⚠️ **A third option the document should not skip: move `/fkit-heal` to a different EXISTING role**
(the lead is the obvious candidate) rather than creating one. It is not in the owner's framing, but
it is the cheapest answer to the stated complaint and ⛔ **omitting it would make the comparison
dishonest.**

## Verification steps

1. **The document exists** in `ai-agents/knowledge-base/decisions/` or `.../reports/`, and
   ⛔ **nothing was written under `ai-agents/wiki-vault/`**. Show `git status --porcelain`.

2. **It ends in one clear recommendation with its main tradeoff named** — not five options with
   caveats, and not a survey that leaves the owner to decide unaided.

3. **⭐ The `0303` competition is addressed head-on.** Quote the document's own words showing it
   reaches one of the three shapes in `## What to build` §1 (supersedes / superseded / genuinely
   both, with each one's distinct job named). ⛔ **A document that discusses `0303` only as "related
   work" has NOT met this step.**

4. **All four `## What to build` items are answered**, each traceable in the text — including §3's
   explicit statement about the unbuilt eighth role, and §4's third option (move heal to an existing
   role).

5. **The cost enumeration is verified, not recited.** For at least `skills_for_role()`, the
   launcher's `ROLES` handling in `test/launcher-contract.test.js`, and
   `task-owner-vocabulary.md`, confirm on disk that each really is a place a ninth role would have to
   be added, and say so. ⚠️ **If any listed surface turns out NOT to need touching, say that too** —
   an inflated cost argues the case as dishonestly as a deflated one.

6. ⛔ **`git diff --stat` must list NO change to `claude/skills-for-role.sh`, `claude/agents/`,
   `claude/fkit-claude.sh`, `claude/skills/`, `test/`, or `task-owner-vocabulary.md`.** This task
   decides; it does not build. **A role created here is a failed run**, however good the argument
   for it.

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

### ⛔ Scope fences

- ⛔ **Do NOT create a role.** No edit to `claude/skills-for-role.sh`, `claude/agents/`, the launcher
  menu, `test/`, the `fkit-team` skill, or `task-owner-vocabulary.md`.
- ⛔ **Do not write an ADR recording a decision the owner has not made.** If the honest output is a
  weighed comparison, `/fkit-evaluate-approach` is the right skill and an ADR is the wrong one.
- ⛔ **No re-rank** ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md))
  — filed by a spawned producer with no owner channel; unranked (`—`), renumbers nothing.
- ⛔ **No `ai-agents/wiki-vault/` write** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md))
  — if the decision warrants a vault record once ruled, it is **routed to `fkit-wiki`**.
- ⛔ **No task-file move** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md))
  — the close goes through `/fkit-task-done`, **producer-only**, carrying the
  `(agent-closed — not owner-verified)` marker if the owner is absent.
- ⛔ **No commit, no push.**

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
