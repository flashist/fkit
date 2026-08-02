# Build A-i — the declared skill-ownership site registry plus the completeness tripwire

## ID
0189

## Sprint
Sprint 2

## Priority
167

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

**Follow-up 2 of `0142`'s decision report**, Part 8 —
[`2026-08-02-skill-ownership-fact-inventory-gap.md`](../../../knowledge-base/reports/2026-08-02-skill-ownership-fact-inventory-gap.md).
**The decision is already recorded and accepted:**
[ADR-036](../../../knowledge-base/decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry.md)
— *the skill-ownership site inventory is a declared registry, not a checklist*. **This task builds what
ADR-036 decided; it does not re-open it.**

**The problem.** `claude/skills-for-role.sh` carries a hand-maintained **mirror checklist** — the list of
places to update when a role↔skill ownership fact changes. It has failed **three times**: task `0036`
(shipped false docs), task `0124` (a manual grep found three live sites the checklist does not cover —
system prompts and the universal rules block, which sit in an agent's context every turn and outrank a
SKILL file in the agent's own reasoning), and task `0151` (a stale `skills_for_role()` location in
prose *outside* the generated block). **`0142` enumerated the true inventory: 39 rows across 21 classes
over 61 fact-site files, against a checklist that names FIVE.**

> ### ⚠️ The tradeoff, carried verbatim from the report and the owner's ruling — do not let it get lost
>
> **It makes the *inventory* mechanical, not the *sweep*. A registered site whose prose quietly goes
> false still ships false.**

**Scored honestly** (report Part 6): A-i would have caught `0124`'s three sites and `0151`'s — **4 of 6
historical classes** — and **0 of the ≥5 defects live in the tree today**, because those are wrong prose
at *registered* sites. It would **not** have caught `0036`. That is the control's boundary, and it is
the reason `0137` stays a separate convention.

> ### ⚠️ This artifact reproduced the defect it was investigating, TWICE. Read `§0.1` before you start.
>
> `0142`'s round 1 shipped an inventory of **21 rows** whose stated method never opened three surfaces
> its own ADR declared in scope. Round 2's correction **still missed a site** — and it was the exact
> shape both documents swore had no live instance
> (`claude/scaffold/ai-agents/knowledge-base/PROJECT.md`, attributing `fkit-initiate-project` to the
> producer **by possessive alone**, nearest ownership verb **839 characters** away). Round 3 was the
> first round the inventory survived attack. **The registry you build will be wrong in the same way if
> you build it from a count instead of from the tree.**

## What to build

Per ADR-036 §Decision, clauses 2–5.

### 1. The registry — `test/skill-ownership-sites.mjs`

- A checked-in module in the **shape of `test/dual-home-parity-exceptions.mjs`**, and **authoritative
  the way that module is**: one flat array of `{ path, kind, reason }`.
- **`reason` floor of 30 characters, enforced by the test.** Same requirement and same stated reason as
  ADR-027 §Decision 3's exception list: *an entry with no stated reason is an unfalsifiable permanent
  hole.*
- **Two `kind`s, and the second is load-bearing:** **ownership-fact sites** (a file that *attributes* a
  named skill, or a skill-gated act, **to a role**) and **declared non-fact hits** (files that trip a
  trigger while attributing nothing, whose `reason` says exactly that). *"Registered"* means *present
  under either kind*. **Without the second kind the tripwire can never go green.**

> ### ⚠️ The registry is AUTHORITATIVE for the inventory, and NO COUNT IS HARD-CODED
>
> Once `test/skill-ownership-sites.mjs` exists, **it** is the inventory. Every count in `0142`'s report
> and in ADR-036 is a **dated measurement of the tree on 2026-08-02**, never the record. **ADR-036
> hard-codes no site count deliberately** — three passes by one author on one day produced ~19, 21 and
> 38 rows. **Scope this build from the registry it builds, not from any figure in the report.** No
> assertion in the code, the test, or the module's comments may state how many sites there are.

### 2. The completeness tripwire

A hand-rolled test that greps the **declared live surface** (ADR-036 clause 5) for the trigger set and
**fails on any hit whose file is not registered**. It does **not** judge whether the prose is true — it
answers exactly one question: **is this site declared?**

### 3. The five triggers — take them from ADR-036 clause 4, VERBATIM

> **⛔ Do not paraphrase, summarize, or re-derive the trigger spec.** The matching rules for **(b), (c)
> and (e)** live in a blockquote inside **ADR-036 clause 4** — **~13.9k characters, byte-identical with
> report §4.1** (`diff` → no output, verified 2026-08-02, re-verified after the round-5 qualifier edit).
> **That block is the buildable definition.** ADR-036's own one-sentence summary of it says so about
> itself: *"this sentence is a summary of it, not a second copy of it."* **If the ADR and the report
> ever differ, the ADR is the record and the report is stale.**

The five, named only so you know what to go and read:

- **(a)** the bare token `skills_for_role` — **signed in deliberately**; it is the only trigger that
  catches `0151`'s class, which names no skill and no role. It costs ~100 raw hits repo-wide (101
  measured 2026-08-02, **only 10 of them live surface**), which is why clause 5's live-surface boundary
  exists.
- **(b)** any `fkit-<skill>` / `/fkit-<skill>` naming a skill in the **skill universe**.
- **(c)** a **bare skill suffix** within **80 characters** of a role name. *(Re-scoped by owner ruling
  2026-08-02. Its previous wording — "a role name adjacent to a skill name" — was proved a **no-op**,
  `(c) ⊆ (b)`, at every window from same-line to unbounded. The re-scoped (c) catches the missed
  `PROJECT.md` site at gap **51** with **zero false positives and zero new registry noise**, on a
  **633-character stable margin** — the nearest would-be false positive is at gap 685.)*
- **(d)** `⛔ Owner:`.
- **(e)** a role name within **80 characters** of an ownership verb. *(Owner-ruled 2026-08-02; costs
  **7** additional declared non-fact hits.)*

**Two rules that are not optional:**

- **Apply the token-boundary rule to (b), (c) and (e)** as clause 4 pins it. Bounded matching is the
  pinned rule; a substring reading changes the result (the flip file is `test/rules-block-budget.test.js`).
- **(b) binds to the directory listing `claude/skills/*/`, enumerated at test time — NEVER to a
  hand-maintained constant.** `test/skill-ownership-hook.test.js`'s `UNIVERSE` holds **24 of 25** skills
  and says so about itself; binding (b) to it would let a site naming only `fkit-sprint-ship-loop` escape
  every trigger. **A trigger set for a control against hand-maintained lists must not itself be sourced
  from a hand-maintained list.**

### 4. Demote the checklist — BOTH copies

`claude/skills-for-role.sh`'s checklist block is **rewritten to point at the registry** and **stops
enumerating**.

> **⚠️ The demotion applies to BOTH copies** (ADR-036 clause 2, widened after review round 2). The
> 12-line block exists **twice, byte-identically** — `claude/skills-for-role.sh@2026-08-02:12-23` and
> `claude/fkit-claude.sh@2026-08-02:239-250`. **Both are demoted, or neither is.** `0188` will have
> touched both files first; re-read them rather than assuming either coordinate still holds.

## Verification steps

1. `test/skill-ownership-sites.mjs` exists, exports one flat array of `{ path, kind, reason }`, and its
   shape matches `test/dual-home-parity-exceptions.mjs`. Every `path` resolves to a file on disk.
2. The `reason` floor is **enforced by the test, not by convention**: a deliberately-added entry with a
   29-character reason makes the suite **fail**. Show the red.
3. The tripwire **fails** when a file on the declared live surface trips a trigger and is not
   registered: add an unregistered ownership assertion to a live-surface file, watch it go red, remove
   it, watch it go green. Show both.
4. The tripwire is **green on the tree as it stands** after the registry is populated — with `0188`
   already landed, so the corpus is clean and the green means the registry was built against reality.
5. **(b)'s universe is read from `claude/skills/*/` at test time.** Prove it: add a throwaway skill
   directory, confirm the universe grows without editing any list, remove it.
6. **No count of sites appears anywhere in the code, the test, or the module.** Grep for it and show
   nothing.
7. All five triggers are implemented as clause 4 specifies, with the token-boundary rule applied to (b),
   (c) and (e). Re-derive the sweep against the live surface **as it stands at implementation time** and
   state the numbers you got — **as a dated measurement, with no completeness claim attached**.
8. **No new devDependency** (ADR-014). Full suite passes.
9. Both copies of the mirror checklist point at the registry and enumerate nothing.
10. **Nothing in `ai-agents/wiki-vault/` is written** (ADR-005). **ADR-036 is not edited** — it is a
    dated record; a needed amendment is the architect's, and is flagged, not made.

## Notes

- **Depends on:** 0188 — by owner ruling (*"do not let the build quietly repair its own corpus"*), not
  by any mechanism. `0142` §D4 records **two** mechanical justifications for this ordering that were
  asserted, found false, and withdrawn. **Do not re-derive one.**
- **Blocks:** nothing.
- **Owner:** fkit-coder.

> ### ⛔ ADR-036 grants NO completeness licence of any kind
>
> Its residual states, with **no exception clause anywhere beside it**: **whoever builds A-i must NOT
> treat clause 4 as complete.** An earlier revision carried the opposite — *"a builder may treat clause
> 4 as complete for verb-carrying attribution"* — and it was **withdrawn**. The measurement behind it
> (83 of the 89 live-surface files trip at least one trigger; the other 6 were opened and read and none
> attributes a skill to a role) is *"a measurement of one tree on one day by one author … It licenses
> nothing."* **If you find an ownership-fact site that trips no trigger, that is a re-raise condition
> for the ADR, not a hole to paper over.**

- **The unclosed residual is named, not hidden:** ADR-036 §Consequences records what trigger (e) and the
  re-scoped (c) do **not** close, as a residual with a dated measurement and no completeness claim. Read
  it before deciding the trigger set is finished.
- **`A-ii` is DEFERRED by owner ruling** (report §4.1) — five bespoke parsers that still miss the
  unstructured system prompts where both real failures happened. **Do not build it, and do not
  half-build it.**
- **`0142` left one discrepancy open and it is not this task's to settle** (report Part 7):
  `ai-agents/wiki-vault/wiki/systems/fkit.md` says `0124`'s checklist missed **four** system prompts;
  `0142`'s brief and `sprint-2.md` say **three**. Settling it needs the sweep `0142` was barred from
  running, and **only `fkit-wiki` may write the vault**.
- ⚠️ **Priority 167 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below 0188** and there it already is — append rank and merit
  **coincide** for this row, because the dependency above pins it after `0188` regardless. The
  divergence flagged on `0188` carries this row with it.
- **No commit** — the brief is left in the working tree.
