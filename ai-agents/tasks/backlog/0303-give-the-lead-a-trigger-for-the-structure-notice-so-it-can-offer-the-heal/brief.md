# Design how the lead learns the structure notice fired, so it can offer the heal where the owner already is

## ID
0303

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

### What the owner wants, in one sentence

**When paths diverge from what the installed fkit version ships and something is actually repairable,
the lead should ask — at session start, interactively — whether to start the heal, and on "yes" drive
the rest itself.**

### Provenance

**Owner request, 2026-08-14**, made live in a `fkit lead` session driving `/fkit-sprint-ship-loop`,
after updating to `v0.2.2` and running `fkit` in a **real consuming project** (`geoconflict`). What
they saw, verbatim:

```
⚠ fkit: 5 path(s) diverge from what the installed fkit version ships (CLAUDE.md, AGENTS.md,
  ai-agents/knowledge-base/conventions/README.md +2 more) — run /fkit-heal in a producer session
  to see and repair; nothing was changed. Deliberate? List the path in ai-agents/.fkit-accepted-drift.
```

The complaint is the round trip: the notice tells you to **go open a different session** as a
different role, in the middle of the work you just sat down to do.

**Owner ruling, 2026-08-14**, same session and channel — **the option label is the verbatim text**:
**"Three separate briefs (Recommended)"**. ⛔ This task was explicitly **not** bundled with
[`0302`](../../done/0302-pressing-enter-at-the-role-menu-should-open-the-lead/brief.md), the owner's stated
reason being that `0302` is trivial and shippable immediately while **this one needs design**, and
bundling would gate the one-liner behind the hard one. ⛔ Do not re-merge them.

**Owner ruling, 2026-08-14**, same session and channel — **"Backlog, unranked — rank later
(Recommended)"**. Unranked, no sprint. ⚠️ **There is no active sprint** —
[`0294`](../../done/0294-archive-sprint-5-move-the-plan-into-sprints-done-and-repoint-every-link/brief.md)
archived Sprint 5 on 2026-08-14 and opened no successor; `select-active` returns `active none`
(exit **3**, the documented no-active-sprint code, **not** a failure).

### ⭐⭐ Three further owner rulings, 2026-08-14 — given live via `AskUserQuestion`, same session and channel

**The option labels below are the verbatim text.**

**⭐ Ruling C — "Accept — design first (Recommended)".** ⛔ **The deliverable is a DESIGN SPEC ONLY.**
The implementation brief is **deliberately not filed** and is a **separate future task**. ⚠️ **The
owner explicitly accepted that their request is TWO TASKS FROM SHIPPING, not one.** ⛔ **Do not scope
implementation into this task**, and ⛔ do not let the design pass quietly become one.

**⭐ Ruling D — "Leave it fenced — architect resolves (Recommended)".** On the
[ADR-039](../../../knowledge-base/decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md)
**rule 4** tension (*consent is never stored*) versus a session-start trigger that wants to avoid
re-asking on every launch: ⛔ **the fence stands exactly as this brief wrote it** — **resolve in
ADR-039's favour by default**, and the architect **may make a case and put it to the owner**.
⚠️⚠️ **Recorded so the architect knows this was CONSIDERED, not overlooked: the owner SAW this tension
and DECLINED to rule on it directly** — including declining the option of a **per-session
suppression**. ⛔ **The decline is not indifference; it is a ruling that the fence holds until the
architect argues otherwise to the owner.**

**⭐ Ruling E — "0304 first, then 0303 (Recommended)".** The **recommended sequence** is
[`0304`](../0304-decide-whether-fkit-heal-warrants-its-own-role/brief.md) **before** this task's
trigger design, because a **"yes, heal warrants its own role"** changes this task's premise
materially. ⚠️⚠️ **THIS IS A SEQUENCING PREFERENCE, NOT A HARD DEPENDENCY** — the owner's own framing
was **"neither blocks the other"**. ⛔ **It is deliberately NOT recorded under `Depends on:`**, so this
task stays **eligible** on any board- or loop-driven view. See `## Notes`.

### ⭐ The load-bearing finding — this is NOT the ADR-021 collision it looks like

**Re-verified on disk 2026-08-14. This is the single most important fact in the brief; confirm it
first, because everything below rests on it.**

The obvious objection is that this collides with
[ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md):
a **spawned** worker has no `AskUserQuestion`, so a spawned producer cannot collect consent. **It does
not collide.** `claude/skills/fkit-heal/SKILL.md`, under *Procedure — the repair*, step 1
(*"Live session required"*), already sanctions the repair running in —

> *"a `fkit producer` session, **or spawned under the sprint-loop relay pattern with every decision
> surfaced to the owner live**"*

And the lead **already owns** `/fkit-sprint-ship-loop` — verified in `claude/skills-for-role.sh`,
whose `lead)` arm lists `fkit-sprint-ship-loop` — and already runs that relay pattern daily.

So the mechanism is **already available and already licensed**. The lead can: spawn a producer to run
`check.sh` (which **never writes**, in any branch), relay the `repair.sh propose` output **verbatim**,
hold the `AskUserQuestion` **itself**, and pass the approved `item` lines back to `repair.sh apply`.

⛔ **This means the brief is not asking anyone to invent a consent path, weaken ADR-021, or re-open
ADR-039.** Any design that proposes to is answering the wrong question.

### ⭐ The actual gap — the TRIGGER, and only the trigger

**Nothing tells the lead, at session start, that the notice fired.**

The notice is emitted by `structure_notice()` in `claude/fkit-claude.sh` — a shell function that runs
`check.sh`, filters its rows against `ai-agents/.fkit-accepted-drift`, and prints **one line to
stderr**. It is invoked once, unconditionally, as `structure_notice || :`. **That line goes to the
terminal. The agent never sees it** — it is not in the prompt, not in the session state, not anywhere
the model reads.

⚠️ **This is a design question, and this task EXISTS to answer it — not to pick an answer off this
brief.** Candidates worth weighing, and this list is **not** meant to be exhaustive:

| Candidate | The obvious problem with it |
|---|---|
| Launcher exports an env var the lead reads via `Bash` | The lead must be *told to look*; an env var is invisible to the model until something runs `printenv` |
| Launcher drops a file the lead reads at session start | Same "must be told to look" problem, plus a new artifact whose lifecycle (staleness, cleanup, gitignore) needs deciding |
| The lead runs `check.sh` itself at session start | ⚠️ **The sharpest one — see the role-boundary question below** |
| Something in the session-start seed / prompt path | Needs establishing that such a path exists and is the right surface |

### ⚠️ The two questions underneath the trigger — the real reason this needs an architect

**Neither is a coding decision, and both change what gets built.**

1. **May the lead execute a producer-owned skill's scripts directly?** `/fkit-heal` is the
   **producer's**, declared in `skills_for_role()` — the single declaration point, sourced by **both**
   the launcher and the [ADR-018](../../../knowledge-base/decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md)
   `PreToolUse` hook. That hook denies a `Skill` call by the wrong role — but `check.sh` is a **bash
   script**, not a `Skill` invocation, so `bash .claude/skills/fkit-heal/check.sh` from the lead
   **would not be denied by anything**. ⛔ **Whether that is a legitimate read-only shortcut or a
   hole in the ownership boundary is exactly the kind of call this task is for.** Relevant:
   [ADR-010](../../../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md) and
   [ADR-012](../../../knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md)
   (the lock is *a wall in a session, a rule in a consult*).
2. **What surface makes the lead act at session start at all?** Nothing today instructs the lead to
   do anything on startup. Answering this means changing `claude/agents/fkit-lead.md`, or a skill, or
   adding a new one — **a change to a role's standing definition**, not a feature bolted onto a
   script. ⚠️ It also has a cost the design must state honestly: **whatever it is, it fires on every
   lead launch**, including the overwhelming majority where nothing is repairable.

### ⚠️⚠️ The real-world caveat that will make a naive design look broken

**In the owner's own project the diverging set includes `CLAUDE.md` — a file projects customise
heavily.** It will very likely classify **`owner-edited`** → **report-only with a diff, NOT
repairable.**

`check.sh`'s own classification comment (verified on disk) is the authority:

> *hash matches any `structure-manifest.tsv` row for the path → `untouched-stale`*
> *matches nothing → `owner-edited`*

The manifest records **every content hash fkit has ever shipped** per path. So: **match any shipped
hash → `untouched-stale` (repairable); match nothing → `owner-edited` (report-only).**

⛔ **A design that assumes "divergence ⇒ offer to fix" will, in the owner's own project, offer to fix
nothing and look broken.** The trigger must distinguish *"paths diverge"* from *"something is
repairable"* — and the notice the owner saw reports the **former**. ⭐ **Getting this distinction into
the design is arguably more valuable than the trigger mechanism itself.**

⚠️ **And its direct consequence, which is a hard rule, not a nicety:** `SKILL.md`'s repair step 2 —
*"**Nothing eligible → say so and stop.** If the report has no `untouched-stale` rows, state 'nothing
repair-eligible' and end. **Never manufacture a consent question.**"* ⛔ **If every divergent path is
`owner-edited`, the lead must NOT ask.** A design that always asks has failed.

### ⛔⛔ The consent rules that must survive — quoted, because they are non-negotiable

**Authority: [ADR-039](../../../knowledge-base/decisions/adr-039-consent-gated-structure-repair-licensed-adr-015-invariant-unchanged.md),
and `claude/skills/fkit-heal/SKILL.md` *Procedure — the repair* steps 3–7.** Every one of these is
already implemented and already binding. **The design must show each one still holds under the new
trigger, item by item:**

1. **The proposal is presented in full and verbatim** — *"the enumerated per-file `item` lines, every
   `# diff` block, and every `# excluded:` line. Announcing a change **never** substitutes for consent
   on this path — the proposal is the thing the owner approves, so they must see all of it."*
2. **One `AskUserQuestion`, plan-level, over that exact enumerated list**, asked **with the diffs in
   view**, offering *"approve the full list / approve a named subset / not now."*
3. **Apply exactly what was approved** — the approved `item` lines *"verbatim and nothing else"* —
   behind an **apply-time freshness re-check**; a changed file is refused as
   `refused: changed-since-propose`, because *"the consent given was to a diff that no longer
   exists."* Per-path apply output is presented **verbatim, refusals and errors loudest**.
4. **Consent is never stored.** *"No file, no config, no env var, nothing that survives the run."*
   No "always allow", no remembered approval, no progress state.
5. **Nothing is ever moved, renamed, or deleted.** v1 scope is replacement of untouched-stale
   fkit-authored files only.
6. **Wiki-routed rows stay routed.** `repair.sh` *"refuses any `ai-agents/wiki-vault/` path
   outright"* — those repairs belong to `fkit-wiki`
   ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).

⛔⛔ **A convenience path that weakens ANY of these is a failed implementation, not a faster one.**
⚠️ Note that rule 4 (*consent is never stored*) sits in genuine tension with a trigger that wants to
avoid re-asking on every launch. ⛔ **Resolve that tension in favour of ADR-039** — or, if the design
believes it cannot, **stop and put it to the owner rather than settling it.**

⭐ **OWNER-CONFIRMED 2026-08-14 — verbatim label "Leave it fenced — architect resolves
(Recommended)".** ⛔ **The fence above stands exactly as written**: ADR-039 wins **by default**, and
the architect **may make a case and put it to the owner**. ⚠️⚠️ **The owner SAW this tension and
DECLINED to rule on it directly — including declining the option of a per-session suppression.**
⛔ **Record that as considered-and-declined, not overlooked**, and ⛔ **do not read the decline as
permission to settle it inside the design.**

### ⚠️ This competes with `0304` — say so, do not treat them as independent

[`0304`](../0304-decide-whether-fkit-heal-warrants-its-own-role/brief.md) asks the architect whether
`/fkit-heal` warrants **its own role**. ⭐ **If the lead offers the heal where the owner already is,
a role you open specifically to heal has little left to do — the two may be alternatives, not
complements.** Neither task blocks the other and both can be reasoned about together; ⚠️ but if
`0304` lands first and recommends a heal role, **this design's premise should be re-checked before
implementation.**

## What to build

**A design spec, not an implementation.** Produced via `/fkit-design-spec` and filed to
`ai-agents/knowledge-base/reports/` — ⛔ **never the wiki.**

⛔ **This task writes NO source.** No edit to `claude/fkit-claude.sh`, `claude/skills/`,
`claude/agents/`, `claude/skills-for-role.sh`, `test/`, or `bin/`. Implementation is a **follow-on
brief**, filed after this design is reviewed with the owner — see `## Notes`.

The spec must settle, and justify:

1. **The trigger mechanism** — how the lead learns the notice fired. Weigh the candidates in
   `## Context` and any others; state the rejected ones and **why**.
2. **⭐ Repairable vs merely divergent** — how the trigger distinguishes *"paths diverge"* (what the
   notice reports) from *"something is `untouched-stale`"* (the only thing that can be consented to).
   ⛔ Including the **nothing-eligible branch: say so and stop, never ask.**
3. **The role-boundary call** — may the lead run `check.sh` directly, or must a spawned producer do
   it? Answer it against ADR-010 / ADR-012 / ADR-018 and say which way the ownership boundary cuts.
4. **The session-start surface** — what changes (`claude/agents/fkit-lead.md`? a skill? something
   else?), and the honest cost of firing on every lead launch.
5. **A consent-rule conformance walk** — the six numbered rules above, each shown to still hold.
   ⛔ Not a blanket assurance; **item by item.**
6. **The `0304` interaction** — stated explicitly, per `## Context`.
7. **⚠️ An honest recommendation on whether to build this at all**, including the option of
   **not** doing so (e.g. if `0304` supersedes it, or if the cost on every launch outstrips the
   benefit). ⛔ **The architect is not obliged to design something it judges shouldn't exist** — say
   so and put it to the owner.

## Verification steps

1. **The design spec exists** under `ai-agents/knowledge-base/reports/`, and **nothing was written
   under `ai-agents/wiki-vault/`**. Show `git status --porcelain` and confirm no vault path appears.

2. **The load-bearing finding was independently re-verified, not taken on this brief's word.** Quote
   from disk: (a) the *"or spawned under the sprint-loop relay pattern…"* clause in
   `claude/skills/fkit-heal/SKILL.md`, and (b) the `lead)` arm of `skills_for_role()` in
   `claude/skills-for-role.sh` showing it owns `fkit-sprint-ship-loop`. ⚠️ **If either is not as
   described, STOP and report** — the whole task's framing depends on them.

3. **The `owner-edited` caveat is confirmed against `check.sh`, not assumed.** Quote the
   classification comment. ⚠️ **Better: run `bash claude/skills/fkit-heal/check.sh` in this repo and
   report what it actually classifies**, so the design is grounded in a real report rather than a
   described one.

4. **All seven `## What to build` items are answered**, each traceable in the spec. ⛔ An item
   acknowledged but not decided is **not** answered — say plainly which are open and why.

5. **The consent-rule walk names all six rules individually** and shows each holding. Quote the
   spec's own words for the two most likely to be lost: *consent is never stored*, and *nothing
   eligible → say so and stop*.

6. ⛔ **`git diff --stat` must list NO file under `claude/`, `test/`, or `bin/`.** This task designs;
   it does not build. An implementation diff here is a failed run, not a head start.

## Notes

- **Depends on:** nothing
- **Blocks:** the implementation brief that follows this design (**not yet filed** — see below)

⚠️ **Related, and NOT a dependency:**
[`0304`](../0304-decide-whether-fkit-heal-warrants-its-own-role/brief.md) — it asks whether
`/fkit-heal` warrants its own role, which **competes directly** with this task's premise (see
`## Context`). ⛔ Neither blocks the other, and **either order is safe**; but if `0304` lands first
and recommends a heal role, re-check this design's premise before implementing.

### ⭐ Recommended order — `0304` first, then `0303`. ⛔ A PREFERENCE, NOT A DEPENDENCY.

**Owner ruling, 2026-08-14, verbatim label "0304 first, then 0303 (Recommended)"** — given live via
`AskUserQuestion`. The owner's **recommended sequence** is
[`0304`](../0304-decide-whether-fkit-heal-warrants-its-own-role/brief.md) **before** this task,
**because a "yes, heal warrants its own role" changes this task's premise materially** — the trigger
design would then be designing a session-start prompt for a round trip that a dedicated role may
remove entirely.

⚠️⚠️ **This is a SEQUENCING PREFERENCE and NOT a hard dependency. The owner's own framing was
"neither blocks the other."** ⛔ **It is therefore deliberately NOT written into the `- **Depends
on:**` bullet above**, which stays `nothing`. That bullet is the **only** form any board- or
loop-driven view reads as a dependency (`dashboard.sh` parses exactly it to derive each task's
next-step), so recording the preference there would make `0303` **ineligible** — which is precisely
what the owner did **not** rule. ⭐ **The preference lives here, in prose, where a human planner reads
it and a scheduler does not.**

⛔ **If this task is picked up before `0304`, that is NOT a violation** — it is the less-preferred of
two sanctioned orders. ⚠️ **But say so in the plan, and re-check the premise against `0304`'s brief
before designing**, since `0304` records both futures and can be reasoned about without its own pass
having run.
[`0302`](../../done/0302-pressing-enter-at-the-role-menu-should-open-the-lead/brief.md) came from the same
session and the same launch but is **wholly independent** — owner-ruled not to be bundled.

### ✅ The implementation brief is deliberately NOT filed yet — OWNER-ACCEPTED 2026-08-14

**Investigation-first.** The trigger mechanism, the role-boundary call, and the session-start surface
are all genuinely undecided, and an implementation brief written now would guess at all three.
⚠️ **Stated plainly: this means the owner's request is not one task away from shipping — it is two.**
The follow-on brief should be filed by a producer **after** this design is reviewed with the owner.
⛔ **Do not let the design pass quietly turn into an implementation.**

⭐ **Owner ruling, 2026-08-14, verbatim label "Accept — design first (Recommended)"** — given live via
`AskUserQuestion`. ⛔ **The deliverable is confirmed as a DESIGN SPEC ONLY**, and ⚠️ **the owner
explicitly accepted the two-tasks-from-shipping cost** stated above. ⛔ **The implementation brief
stays unfiled until this design is reviewed with them** — filing one from this task is a failed run,
not a head start.

### ⛔ Scope fences

- ⛔ **Do NOT weaken any ADR-039 consent rule** — all six are quoted in `## Context`. A convenience
  path that weakens one is a failed implementation, not a faster one. ⚠️ Rule 4 (*consent is never
  stored*) is the one under pressure from a session-start trigger; **resolve in ADR-039's favour or
  stop and ask.** ⭐ **OWNER-CONFIRMED 2026-08-14** — verbatim label **"Leave it fenced — architect
  resolves (Recommended)"**: ⛔ **this fence stands as written**, ADR-039 wins **by default**, and the
  architect **may make a case and put it to the owner**. ⚠️ **The owner saw the tension and declined
  to rule directly, including declining a per-session suppression** — considered, not overlooked.
- ⛔ **Never manufacture a consent question.** All-`owner-edited` ⇒ say so and stop.
- ⛔ **No implementation.** No edit to `claude/fkit-claude.sh`, `claude/skills/`, `claude/agents/`,
  `claude/skills-for-role.sh`, `test/`, or `bin/`.
- ⛔ **No re-rank** ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md))
  — filed by a spawned producer with no owner channel; unranked (`—`), renumbers nothing.
- ⛔ **No `ai-agents/wiki-vault/` write** ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)).
  ⚠️ Doubly relevant here: the vault is also a **repair-routing** boundary — `repair.sh` refuses
  vault paths outright and they go to `fkit-wiki`.
- ⛔ **No task-file move** ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md))
  — the close goes through `/fkit-task-done`, **producer-only**, carrying the
  `(agent-closed — not owner-verified)` marker if the owner is absent.
- ⛔ **No commit, no push.**

### On the owner role — `fkit-architect`, and why (the caller asked for this justified either way)

⚠️ **This was a real call, and the case for `fkit-coder` is not empty** — the consent mechanics are
already built and already licensed, so one reading is *"just wire up a trigger."* **Rejected**, on
four grounds:

1. **The trigger is genuinely undecided**, with at least four candidates whose tradeoffs are about
   architecture (artifact lifecycle, prompt surfaces, launch cost), not implementation.
2. **⭐ It contains a role-boundary question that outranks the feature** — may the lead execute a
   producer-owned skill's scripts directly, given that the ADR-018 hook gates `Skill` calls and
   **not** `bash` calls? That is a hole-or-not question about the ownership model itself.
3. **It changes a role's standing definition**, not just a script — whatever makes the lead act at
   session start lives in `claude/agents/fkit-lead.md` or a skill.
4. **It is entangled with `0304`**, an architect decision about whether the feature should exist in
   this shape at all.

⛔ **Handing this to a coder would force a coder to settle 2 and 3 inside a plan gate**, which is
exactly the "scope implementation before findings exist" failure. ⚠️ **The counter-argument, stated
honestly:** this adds a hop, and the eventual implementation may well be small. **That is the
accepted cost** — the small implementation is small *because* the three questions were answered
first.

### ⚠️ State of the tree at filing

Measured 2026-08-14 at filing time: `HEAD` is **`4424b44 "Release v0.2.2"`**, tag **`v0.2.2`** exists,
and `git status --porcelain` returned **0 lines — the tree was clean**. This brief, its two siblings,
and their three board rows are the only uncommitted work introduced by this filing.
(`conventions/evidence-before-assertion.md` — asserted from a check made this turn.)
