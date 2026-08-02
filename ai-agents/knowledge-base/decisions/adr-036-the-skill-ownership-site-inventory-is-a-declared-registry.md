# ADR-036: The skill-ownership site inventory is a declared registry, not a checklist

- **Status:** accepted
- **Date:** 2026-08-02
- **Revised:** 2026-08-02, same day, after a stateful review of `0142` returned 🛑 BLOCKED and the owner
  ruled a fix round. **The decision is unchanged.** What changed: the hard-coded site count is
  **removed** (see Context), clause 4(b)'s binding is corrected, clause 5's live surface gains four
  entries including `claude/README.md`, clause 2 gains the two-kinds-of-entry rule, a **false**
  sequencing mechanism in §Consequences is withdrawn and replaced by the owner's actual ground, the
  current-defect count moves from 4 to ≥5, and a newly found hole in the trigger set is recorded as an
  open residual.
- **Revised again:** 2026-08-02, after the owner ruled that open residual. **The decision is still
  unchanged.** What changed: clause 4 gains a **fifth trigger (e)** — a role name within 80 characters
  of an ownership verb — **fully specified**, with its false-positive cost **measured across the
  declared live surface before the spec shipped** (6 files, registry noise 15 → 21); the residual is
  rewritten from OPEN-unruled to ruled-and-priced; and a **narrower** surviving hole, verbless
  attribution, is named in its place.
- **Revised a third time:** 2026-08-02, after review round 2 of `0142` returned 🛑 BLOCKED on 6 defects
  (2 high) and the owner ruled a fix round plus two structural rulings. **The decision is still
  unchanged.** What changed, and every item is a correction of something this ADR asserted:
  1. **The residual's licence sentence is RE-OPENED, not footnoted.** *"No live-surface site has that
     shape on 2026-08-02"* was **FALSE** — `claude/scaffold/ai-agents/knowledge-base/PROJECT.md`
     attributes `fkit-initiate-project` to the producer by possessive alone. The licence that rested on
     it — *"a builder may treat clause 4 as complete for verb-carrying attribution"* — **is withdrawn
     entirely.** *(Owner's reasoning, recorded because it is the general rule and not specific to this
     ADR: a licence whose stated basis is disproven must not survive by having an exception noted beside
     it — that is the "confidently incomplete" pattern one level up, and a builder skimming the licence
     may not read the exception. That is precisely how the FOUR-mirror checklist failed three times.)*
  2. **Clause 4's matching rules are pinned and (c) is re-scoped.** (b) had **no token-boundary rule**,
     so the set was not deterministically buildable; (c) required a skill name that (b) already caught,
     making it **a no-op**. (c) is re-scoped to *a bare skill suffix within 80 characters of a role
     name*, with its own window and its own measured cost — **zero false positives** — and it **catches
     the site in item 1**.
  3. **Clause 2's checklist demotion is widened to `claude/fkit-claude.sh`**, which carries a
     byte-identical duplicate of the FOUR-mirror checklist. As written, a compliant build left the false
     `FOUR` live.
  4. **The "one true mechanical note" in §Consequences is withdrawn, and no mechanism replaces it.**
     It was the second false mechanism attached to the same sequencing note in two revisions; both were
     asserted rather than measured. **The sequencing rests on the owner's ruling alone.**
  5. (e)'s day-one cost re-states as **7 files, registry noise 15 → 22** — an accounting knock-on of a
     miscounted noise list, **not** a re-pricing of (e), whose own measurements all reproduce exactly.
- **Deciders:** owner (Mark Dolbyrev), ruling via `AskUserQuestion` in the live `fkit-lead`
  `/fkit-sprint-ship-loop` driver session; investigation, options and recommendation by
  **fkit-architect** from task `0142`'s decision report.
- **Scope:** the **inventory of places a role↔skill ownership fact is stated**. It does **not** touch
  where the fact itself lives — see the Decision's first clause.

---

## Context

`claude/skills-for-role.sh` carries a **mirror checklist**: a comment block naming the places to update
when a role↔skill ownership fact changes. It opens *"⚠️ CHANGING A ROLE'S SKILLS? **FOUR**
hand-maintained places MIRROR this list"* and closes *"If you add a fifth mirror, add it HERE FIRST."*

**It has failed three times, in three different ways.**

1. **Task `0036`** — the checklist was followed precisely and still shipped a false statement into
   every consuming project's root `CLAUDE.md`. The checklist's own text narrates this: *"A checklist
   that is itself incomplete is worse than no checklist: it is followed, and it fails."*
2. **Task `0124`** — a hand-run grep found **three further live sources** asserting the ADR-025 grant
   that ADR-033 had just reversed, none of them on the checklist: `claude/scaffold/universal-rules.md`
   and the **system prompts** `claude/agents/fkit-producer.md` and `claude/agents/fkit-coder.md`. Had
   it shipped as written, the ADR-018 hook would have denied the coder a mover while its own system
   prompt still instructed it to invoke one — **a runtime arguing with itself.** Caught by a human, not
   by any control.
3. **Task `0151`** — `CLAUDE.md`'s hand-written prose *outside* the fkit-managed rules block named the
   wrong file for `skills_for_role()`. A class the checklist does not name at all.

Task `0142`'s investigation (report:
[`2026-08-02-skill-ownership-fact-inventory-gap.md`](../reports/2026-08-02-skill-ownership-fact-inventory-gap.md))
enumerated the live surface by evidence. **The checklist names 5 sites — itself and four mirrors.**
The real number is **many times that**, and it is **deliberately not written into this ADR**: see the
paragraph below. What the sweep found qualitatively is what matters here — undeclared, live,
load-bearing sites including **the agent system prompts**, **the universal rules block** that sits in
every agent's context on every turn, **the installer's own printed role roster** (whose comment says
*"nothing tests that they agree"*), **the project brief**, **eight convention pages and four READMEs**
— half of them shipping into every consuming project — and
`test/skill-ownership-hook.test.js`, which maintains its `OWNED` table by hand and says so about itself
(*"OWNED is a maintained MIRROR of `skills_for_role()`, not derived from it"*) — **a fifth mirror,
undeclared, added by the very task that was told to declare one.**

> **⚠️ NO SITE COUNT IS RECORDED IN THIS ADR, AND THAT IS THE DECISION, NOT AN OMISSION.** Under
> clause 2 **the registry module is authoritative for the inventory.** A count in a report is a
> **dated measurement of the registry on a day**, nothing more. This is not a preference: an earlier
> revision of this ADR hard-coded *"21 sites across 16 classes"* into the durable record, and a review
> found the underlying sweep short by **17 rows and 5 whole classes** — three passes by one author on
> one day produced ~19, 21 and 38. **A number that unstable does not belong in an ADR about the danger
> of remembered lists.** Anyone needing the current inventory reads
> `test/skill-ownership-sites.mjs`; anyone needing a dated snapshot reads the report's §1.2 and
> honours its date.

Two constraints bound the options. **ADR-014** keeps devDependencies at zero, so any test is
hand-rolled `node:test`. And the rules block is at **3570 B of a 4096 B cap** (re-measured 2026-08-02
by replaying `fkit-claude-init.sh`'s own `emit_block()` through `wc -c`) — **526 B headroom, 87.2 %**;
against the owner's standing *"keep ≥ 400 B free"* target, **usable growth is 126 bytes.** *(The
brief's 91.1 % figure was stale, and was the less alarming of the two ways to say this.)*

---

## Decision

**1. `skills_for_role()` in `claude/skills-for-role.sh` remains the single source of truth for
role↔skill ownership. ADR-012 §1 is unchanged and nothing below weakens it.** This ADR is about a
*different* fact.

**2. A new artifact becomes authoritative for the inventory of sites.** A checked-in module,
`test/skill-ownership-sites.mjs`, in the shape of `test/dual-home-parity-exceptions.mjs`: one flat
array of `{ path, kind, reason }`, with a **`reason` floor of 30 characters** enforced by the test — the
same requirement, for the same stated reason, as ADR-027 §Decision 3's exception list: *an entry with
no stated reason is an unfalsifiable permanent hole.* The module is **authoritative**; the checklist
comment is **demoted to a pointer at it** and stops enumerating.

> **⚠️ The demotion applies to BOTH copies of the checklist — widened 2026-08-02 after review round 2.**
> The 12-line FOUR-mirror block exists **twice, byte-identically**:
> `claude/skills-for-role.sh@2026-08-02:12-23` **and** `claude/fkit-claude.sh@2026-08-02:239-250`
> (`diff` over the two ranges → **no output**, measured 2026-08-02). An earlier revision of this clause
> named only the first, so **a fully compliant build would have left the false `FOUR` live in the
> second.** Neither copy points at the other and nothing tests that they agree. **Both are demoted, or
> neither is.**

**The registry holds two kinds of entry.** **Ownership-fact sites** — a file that *attributes* a named
skill, or a skill-gated act, **to a role** — and **declared non-fact hits**: files that trip a trigger
while attributing nothing, whose `reason` says exactly that. `kind` separates them, and *"registered"*
means *present under either kind*. Without the second kind the tripwire can never go green.

**3. A completeness tripwire enforces it.** A hand-rolled test greps the declared live surface for the
trigger set below and **fails on any hit whose file is not registered.** It does not judge whether the
prose is true; it answers one question — *is this site declared?*

**4. The trigger set includes the bare token.** **Five** triggers: (a) the bare token `skills_for_role`;
(b) any `fkit-<skill>` / `/fkit-<skill>` naming a skill in **the skill universe — defined as the skill
directories on disk, `claude/skills/*/`, enumerated at test time**; **(c) a bare skill suffix within 80
characters of a role name**; (d) `⛔ Owner:`; **(e) a role name within a proximity window of an
ownership verb**. **(b), (c) and (e) are specified in full in the block below, and that block is the
buildable definition — this sentence is a summary of it, not a second copy of it.**

**(a) is signed in deliberately.** It is what makes `0151`'s class catchable —
that line named no skill and no role, so (b), (c), (d) **and (e)** all miss it. It costs ~100 files of raw hits
repo-wide (101 measured 2026-08-02, only 10 of them live surface), which is why clause 5 exists.

> **⚠️ (c) was RE-SCOPED on 2026-08-02 by owner ruling, and the previous wording is recorded rather than
> overwritten.** It read *"a role name adjacent to a skill name"*. That required a **skill name**, and
> (b) already fires on any skill name, so **(c) ⊆ (b) — a no-op that could never change an outcome**,
> measurably so at every window from same-line to unbounded. The re-scoped (c) takes the **bare** skill
> suffix — the vocabulary this ADR rejected for (b) because `review`, `status`, `query` and `team` are
> ordinary English words — and makes it affordable by **requiring a role name inside the window**. Its
> measured day-one false-positive cost is **zero files**. **The general lesson, and it is the reason
> the block below is as long as it is: a clause specified less rigorously than its neighbour is how a
> trigger becomes a no-op nobody notices.** (e) was given a window, a boundary rule and a measured
> price; (c) was given a sentence, and the sentence did nothing for a full revision.

> **⚠️ THE MATCHING RULES FOR (b), (c) AND (e). This blockquote is byte-identical in ADR-036 clause 4
> and report §4.1 — verified by `diff` on 2026-08-02. If the two ever differ, the ADR is the record and
> the report is stale.** Everything a builder needs to implement the trigger set deterministically is
> inside this block. **Round 4 pins (b)'s token boundary and re-scopes (c); trigger (e) is unchanged
> except for the withdrawal of one false sentence at the end.**
>
> ---
>
> **THE TOKEN-BOUNDARY RULE — it governs (b), (c) and (e) alike, and it is not a detail.**
>
> Every name matched by any trigger is matched **case-insensitively and bounded on both sides by a
> character outside `[A-Za-z0-9_-]`** — a **whole-token** match, never a substring.
>
> **Why this is stated rather than assumed.** Role basename `fkit-reviewer` *contains* skill name
> `fkit-review`; `fkit-adversarial-reviewer` contains it too. Left unstated, (b) is **not
> deterministically buildable — two competent builders get two different answers**. Measured across the
> declared live surface on 2026-08-02: a **bounded** (b) trips **72** of 89 files; a **substring** (b)
> trips **74**. **On the original four-trigger set — (c) as it then stood — the set tripping ≥1 of
> (a)–(d) was 73 bounded and 74 as substrings; with (c) re-scoped as specified below it is 76 and 77**
> (re-measured 2026-08-02). Either way the file
> that flips is exactly **`test/rules-block-budget.test.js`** — which is why §1.5's noise list carried
> it wrongly (R11) and why an earlier revision of this report misattributed a sweep disagreement to (c).
> **Bounded is the rule.**
>
> ---
>
> **(b) — any `fkit-<skill>` / `/fkit-<skill>` naming a skill in the skill universe**, defined as **the
> skill directories on disk, `claude/skills/*/`, enumerated at test time** (25 on 2026-08-02; the count
> is never written down, which is the point). **Full `fkit-` form only** — the bare suffix is (c)'s job,
> and the split is deliberate: a bare suffix is only affordable with a role name beside it.
>
> ---
>
> **(c) — a BARE skill suffix within a proximity window of a role name.** *Re-scoped 2026-08-02 by
> owner ruling. See "what (c) used to say" below — the previous form was a no-op.*
>
> - **Bare skill suffixes** are the `claude/skills/*/` directory names with the `fkit-` prefix
>   stripped — **disk-derived at test time, never a hand-maintained list**, exactly as (b) and (e) are.
>   25 on 2026-08-02: `adversarial-review`, `design-spec`, `dumb-down`, `evaluate-approach`,
>   `initiate-project`, `inspect`, `open-questions-interview`, `plan-task`, `process-review`,
>   `process-stateful-review`, `query`, `record-decision`, `review`, `sprint-ship-loop`,
>   `stateful-review`, `status`, `survey-project`, `task-brief`, `task-cancelled`, `task-done`,
>   `task-ship-loop`, `team`, `wiki-ingest`, `wiki-lint`, `wiki-sync`.
> - **Role names** are the **same** disk-derived set (e) uses — the basenames of
>   `claude/agents/fkit-*.md` **plus each one's bare form**. One definition, used by two clauses, so
>   they cannot drift apart.
> - **The proximity window is 80 characters of the file with every whitespace run collapsed to one
>   space**, measured as the character gap between the two matches, **in either order** — the same
>   window and the same measurement basis as (e), for the same hard-wrap reason given under (e).
> - **A role name is REQUIRED.** A bare suffix alone is unusable: `review`, `status`, `query`, `team`
>   and `inspect` are ordinary English words — which is exactly why broadening **(b)** to bare suffixes
>   was rejected. Requiring a role name inside the window is the whole difference between that rejected
>   option and this one.
>
> **(c)'s measured cost, swept across the declared live surface on 2026-08-02** — the same 89 non-empty
> files (e) was priced against. **52 of 89 trip (c). Exactly ONE file trips (c) and none of (a), (b),
> (d), (e) — and it is a genuine ownership-fact site, not a false positive:**
> `claude/scaffold/ai-agents/knowledge-base/PROJECT.md`, *"The fkit **producer** replaces this file
> during project initiation (**its** initiate-project skill)"*, gap **51** between `producer` and
> `initiate-project`. **(c)'s day-one false-positive cost is ZERO files, and it adds ZERO registry
> noise.**
>
> **The margin is wide in both directions, which is why 80 is safe rather than tuned.** The specimen sits
> **29** characters inside the window. The nearest file that would become a false positive is
> `test/skill-frontmatter.test.js` at a gap of **685** — **605 characters outside** it; the next is
> `test/harness.mjs` at **2607**. Every window from **51 to 684** gives the identical result. **(c) is
> the cheapest clause in the set: it closes a live hole at no measured cost.**
>
> **⚠️ What (c) used to say, and why it is specified this rigorously now.** (c) formerly read *"a role
> name adjacent to a skill name"*, with **no window and no boundary rule**. It required a **skill
> name** — and **(b) already fires on any skill name** — so **(c) ⊆ (b): it could never change an
> outcome.** Measured 2026-08-02 at same-line / 20 / 40 / 80 / 200 / unbounded windows, the set tripping
> ≥1 of (a)–(d) is **73 of 89 in every case**, and (c) adds **0** files beyond (b) at every one.
> **A clause specified less rigorously than its neighbour is how a trigger becomes a no-op that nobody
> notices** — (e) was given a window, a boundary rule and a measured price; (c) was given a sentence.
> That asymmetry is now removed. Nothing is lost by the re-scope: **full skill names beside role names
> are still caught, by (b).**
>
> ---
>
> **(e) — a role name within a proximity window of an ownership verb.**
>
> - **Role names are derived from disk at test time, never from a hand-maintained list** — the same
>   discipline clause 4(b) applies to skills. The source is the basenames of `claude/agents/fkit-*.md`:
>   `fkit-adversarial-reviewer`, `fkit-architect`, `fkit-coder`, `fkit-lead`, `fkit-producer`,
>   `fkit-reviewer`, `fkit-wiki` — **and each one's bare form**, the `fkit-` prefix stripped
>   (`adversarial-reviewer`, `architect`, `coder`, `lead`, `producer`, `reviewer`, `wiki`). Matched
>   under the token-boundary rule above.
> - **Ownership verbs are a closed 41-word list written into the test**, in five groups —
>   **holding:** `own owns owned owner owners ownership hold holds held carry carries carried maintain
>   maintains maintained`; **permission:** `may must can cannot allowed permitted denied forbidden
>   barred refuse refuses`; **exclusivity:** `only exclusive exclusively sole solely`; **invocation:**
>   `invoke invokes invoked invoking runs`; **routing:** `routes routed delegates delegated gateway`.
>   Same matching rule as the role names.
> - **The proximity window is 80 characters of the file with every whitespace run collapsed to one
>   space**, measured as the character gap between the two matches, in either order. **Collapsing
>   whitespace first is load-bearing, not tidiness:** in `claude/scaffold/AGENTS.md` the clause
>   *"Writes stay exclusive to the `fkit-wiki` agent"* is broken by a **hard wrap between `the` and
>   `fkit-wiki`** (`@2026-08-02:19-20`) — so a same-line predicate would miss the very specimen (e)
>   exists to catch.
>
> **Both known specimens are caught, by their load-bearing clause and not incidentally** (re-measured
> 2026-08-02): `ai-agents/README.md` — *"Maintained by the **fkit-wiki agent**"*, gap **10**; and
> `claude/scaffold/AGENTS.md` — *"Writes stay exclusive to the `fkit-wiki` agent"*, gap **9**. Both sit
> far inside the 80-character window.
>
> **The measured cost, swept across the whole declared live surface on 2026-08-02** — 89 non-empty
> files (the clause-5 surface enumerates to 102 paths; the 13 empty `.gitkeep` placeholders under
> `claude/scaffold/` carry no prose and are skipped): **70 of 89 trip (e); 9 trip (e) and none of the
> original four triggers (a)–(d) — (c) as it then stood.** Of those 9, **2 are the ownership-fact sites
> (e) was added for**, leaving **7 files needing
> a new declared-non-fact-hit entry on day one — and all 7 are false positives**, none attributing a
> skill to a role: `ai-agents/knowledge-base/conventions/README.md` and its scaffold twin (*"it is not
> the architect's monopoly"*), `claude/scaffold/ai-agents/wiki-vault/schema.md` (*"Wiki Schema … the
> LLM must follow this schema"* — `wiki` the artifact, not the role), and `test/converge-contract.test.js`,
> `test/dual-home-parity.test.js`, `test/orphan-cleanup.test.js`, `test/rules-block-budget.test.js`
> (role words inside fixture paths, `runFkit(['coder'])` calls and an `agentType` fixture).
> **The registry's declared-non-fact-hit half goes from 15 files to 22.** That is the accepted cost, and
> it is affordable.
>
> > **⚠️ THE BUCKET BASIS, stated per §0 rather than smoothed — added round 5 (R14), re-measured
> > 2026-08-02.** The **9** and the **7** above are measured against the **original four triggers**,
> > with (c) as it then stood. Against (a)–(d) **with (c) re-scoped as specified above**,
> > `claude/scaffold/AGENTS.md` (gap 14) and `claude/scaffold/ai-agents/wiki-vault/schema.md` (gap 9)
> > trip **(c)** as well, so **(e)-only is 7, of which 1 is a fact site (`ai-agents/README.md`) and 6
> > are false positives**. **Nothing moves but the bucket:** (a)–(d) goes **73 → 76**, §1.5's half goes
> > **15 → 16**, (e)'s half goes **7 → 6**, and **the declared-non-fact-hit total is 22 on either
> > basis** — 15 + 7 or 16 + 6. **(e)'s own sweep is untouched — 70 of 89 trip (e)** — and so are the
> > totals that matter: **61 fact-site files, 83 of 89 tripping at least one of the five.** The same
> > qualifier applies wherever the four-trigger figures appear (§1.5, §1.6's C32 row, blind spot #2).
>
> > **⚠️ This paragraph said "6 … 15 → 21" in round 3, and the change is a knock-on, not a re-pricing of
> > (e).** `test/rules-block-budget.test.js` was double-counted: round 3 discounted it as *"already §1.5
> > noise"*, but §1.5 had it wrongly — it trips no (a)–(d) trigger under the token-boundary rule above,
> > and enters the registry through **(e)**. (e)'s sweep result is unchanged and reproduces exactly;
> > only the accounting of which half pays for that one file has moved.
>
> **The owner accepted the fuzziness explicitly, and it is priced here rather than hidden.** *"Role name
> near an ownership verb"* is a **fuzzier predicate than a token match, so it produces false
> positives** — which the registry's excepted-with-a-reason mechanism (clause 2's second kind of entry)
> already exists to absorb. **5 of the 7 come from the bare forms** (`architect`, `wiki`, `coder`).
> Restricting (e) to the `fkit-<role>` forms alone would cost **2** new entries instead of 7
> (`test/converge-contract.test.js` and `test/rules-block-budget.test.js` survive it, both at gap 27)
> and would still catch both specimens — **and was not taken**, because a bare-form attribution is
> exactly the shape (e) exists to catch: `claude/scaffold/CLAUDE.md` already says *"Writes stay
> exclusive to the **wiki role**"*, and a future *"only the producer may invoke `task-done`"* would
> escape a full-form-only trigger.
>
> **Why (e) and not a broadened (b), in the owner's reasoning:** (e) **catches the shape rather than the
> vocabulary**, so it also catches a site naming a skill in some form nobody has thought of yet.
> Broadening (b) to bare skill suffixes **on its own** was rejected because `review`, `status`, `query`
> and `team` are extremely common English words, and on a prose corpus every one of the resulting hits
> would need a written reason to silence. **(c)'s re-scope is not that option**: it takes the same
> vocabulary and requires a **role name** inside the window, which is what takes its measured cost to
> zero.
>
> ---
>
> **⚠️ WHAT THE SET STILL DOES NOT CATCH — and read this as a measurement, NOT as a licence.**
>
> **An earlier revision printed here: *"No live-surface site has that shape on 2026-08-02."* That
> sentence was FALSE, and it is withdrawn.** It described verbless attribution — a skill attributed to a
> role by possessive or apposition alone. `claude/scaffold/ai-agents/knowledge-base/PROJECT.md` had
> exactly that shape, in the live surface, on that date: *"its initiate-project skill"*, with its
> nearest ownership verb **839 characters** away. **The sentence ruling the shape out and the sweep that
> disproved it were written by the same author on the same day.** The hole is now closed **by a clause,
> not by a claim** — that is what the (c) re-scope is for.
>
> **What survives (a)–(e) is narrower, and is stated without a completeness claim of any kind:** an
> attribution carrying **no skill name in any form within 80 characters of a role name** *and* **no
> ownership verb within 80 characters of a role name** — for example a role paired with a *description*
> of a skill rather than its name.
>
> **The dated measurement, and its limits, stated together so neither can be read alone.** With all five
> triggers, **83 of the 89 live-surface files trip at least one**. The remaining **6** were opened and
> read on 2026-08-02 — `claude/askuserquestion-marker-hook.sh`,
> `claude/scaffold/ai-agents/wiki-vault/index.md`, `claude/scaffold/ai-agents/wiki-vault/log.md`,
> `test/askuserquestion-marker-hook.test.js`, `test/harness.mjs`, `test/skill-frontmatter.test.js` —
> and **none attributes a skill to a role.** **That is a measurement of one tree on one day by one
> author, and this report's own §0.1 records two occasions this month when exactly that kind of
> measurement was confidently wrong. It licenses nothing.** ADR-036's residual therefore states, with
> no exception clause beside it: **whoever builds A-i must NOT treat clause 4 as complete.**

> **(b) binds to the directory listing, never to a hand-maintained constant.**
> `test/skill-ownership-hook.test.js`'s `UNIVERSE` holds **24 of 25** skills — `fkit-sprint-ship-loop`
> is missing and the file says so about itself. Binding (b) to it would have let a site naming only
> that skill escape all four triggers as they then stood. **A trigger set for a control against hand-maintained lists must
> not itself be sourced from a hand-maintained list.**

**5. The live surface versus dated records is declared, not inferred.**

- **Live surface** — governs behaviour now; a false statement here is acted on: **all of
  `claude/*.sh`**, `claude/agents/`, `claude/skills/`, **`claude/README.md`**, **the whole of
  `claude/scaffold/`** (including the entire `claude/scaffold/ai-agents/` tree), the repo-root
  `CLAUDE.md` and `AGENTS.md`, `ai-agents/README.md`, `ai-agents/tasks/README.md`,
  `ai-agents/knowledge-base/PROJECT.md`, `ai-agents/knowledge-base/architecture.md`,
  `ai-agents/knowledge-base/conventions/`, and **`test/`**.
- **Dated records** — record what was true on a date; outside the surface, and correcting one would
  destroy the record: **ADRs (this one included), task briefs, sprint plans, review ledgers, reports,
  and the whole of `ai-agents/wiki-vault/`.**

> **`claude/README.md` is named explicitly because an earlier revision left it out.** It is one of the
> **four mirrors the checklist itself names**, so a boundary that excluded it would have meant the
> tripwire never scanned a canonical mirror. Added in the same amendment, all genuine sites an earlier
> sweep missed: `PROJECT.md`, the two working-tree `README.md`s, and the `claude/scaffold/ai-agents/`
> tree.

**`test/` being inside the live surface is signed in deliberately.** It is what makes the fifth mirror
catchable. *(Separately and unchanged: only **fkit-wiki** may write `ai-agents/wiki-vault/`. Nothing
here licenses any other role to touch it.)*

**6. Per-site prose extractors (option A-ii) are deferred**, not rejected on principle — see below.

---

## Options considered

- **A-i — the declared registry plus the completeness tripwire (CHOSEN).** The only option that
  converts *"did I remember every place?"* — unanswerable, failed three times — into *"did I check every
  place on this list?"*, which is answerable and auditable. Cost is one data module and one test file,
  no new dependency, and **zero bytes against the rules-block budget.**

- **A-ii — a bespoke extractor per registered site, diffing the asserted mapping against
  `skills_for_role()` — DEFERRED.** The five mirrors have **five different formats**: a pipe table keyed
  by role; a pipe table with the shared skills in the header cell; a four-column table with the lead
  only in prose; a table keyed by *owner* with a `the six Claude-side roles` pseudo-row; and JavaScript
  object literals. Five hand-written parsers over hand-edited markdown, each of which breaks on a
  reformat. **And it does not reach the failure class that motivated the work** — Tier C's prose sites,
  including the system prompts where `0124` actually failed, have no extractable structure at all. Most
  expensive option, does not cover the motivating case.

- **B — generate the ownership sentences from `skills_for_role()` into the agent definitions and the
  rules block, the way `universal-rules.md` already generates the root instruction blocks — REJECTED.**
  Its blind spot is fatal and it is not the budget: **the sites are arguments, not lists.** In
  `fkit-coder.md` §*"What you must not do"*, the membership fact — *the coder does not hold the movers*
  — is one clause of six; the rest is the reversing ADR, the enforcement mechanism, the routing
  instruction, the marker requirement, and a carve-out with its own justification. That cannot be
  generated from a shell array, and generating only the clause reintroduces the split mid-sentence.
  The budget rejects it independently: **126 usable bytes** is one sentence.

- **C — a fourth, better checklist — REJECTED as a standalone, retained as A-i's `reason` field.**
  Cheapest, and the option that has already failed three times. Nothing makes a checklist go red when
  it is wrong; a list nobody can be *audibly* wrong about is a hope, not a control. And the failure is
  current, not historical: the checklist says FOUR today while a self-declared fifth mirror sits in
  `test/` **and a sixth hand-maintained roster sits in `claude/fkit-claude-init.sh`, under a comment
  admitting *"nothing tests that they agree"*.** **And — found 2026-08-02, after two passes over this
  very question — the checklist that miscounts the mirrors is itself an unnoticed hand-maintained
  duplicate, byte-identical in `claude/skills-for-role.sh` and `claude/fkit-claude.sh`. The artifact
  warning about undeclared copies is an undeclared copy.**

---

## Consequences

- **Positive.** The inventory stops being remembered and starts being declared. Every undeclared
  site — the system prompts, the rules block, the test oracle, the installer's printed roster, the
  project brief, the convention pages and READMEs — enters the record. A new agent, skill, root doc or
  test oracle **cannot be added silently**: the tripwire fails until it is registered. The `reason`
  floor means each entry carries why it is there, so the list stays falsifiable. `0151`'s class is
  reachable because of clause 4; the fifth mirror is reachable because of clause 5.

- **Negative / costs.** The bare-token trigger sweeps ~100 files repo-wide, so the live-surface
  boundary must be maintained as a real declaration — a new top-level directory is a decision, not an
  oversight. Most live-surface files that trip a trigger assert **no** ownership fact, so the registry
  carries declared-noise entries alongside real sites (clause 2). The registry is one more thing to
  keep current, though unlike the checklist it now fails loudly when it is not.

- **Sequencing: repair the live defects FIRST, then build the guard — on the owner's ground, not a
  mechanical one.** `0142`'s Part 3 names **five** live defects that this ADR deliberately does not
  repair. They are a separate task, and it ships **before** the guard because of the owner's ruling,
  verbatim: ***"do not let the build quietly repair its own corpus."*** A build task that fixes its own
  inputs demonstrates nothing about the guard.

  > **⚠️ TWO false mechanisms have been attached to this sequencing note, in two consecutive revisions.
  > Both are withdrawn, and NO mechanism replaces them.**
  >
  > 1. *"Leaving the checklist asserting FOUR while the registry declares 21 makes the tripwire red on
  >    its first run."* **It cannot.** The tripwire does not judge whether prose is true (clause 3), and
  >    `claude/skills-for-role.sh` is a **registered** site — a false count inside it is invisible to
  >    the guard.
  > 2. Its replacement, offered as *"one true mechanical note"*: *"clause 2's demotion **deletes** the
  >    `FOUR` enumeration, so the build resolves that defect itself."* **Also false.** The checklist
  >    exists **twice, byte-identically** (clause 2's widening note), and the earlier clause 2 demoted
  >    only one copy — so a compliant build left the false `FOUR` live in `claude/fkit-claude.sh`.
  >
  > **Both were asserted, not measured. Both were plausible. Both shipped.** The sequencing has been
  > right throughout and has never needed a mechanism: **it rests on the owner's verbatim ruling above,
  > and on nothing else.** This note now carries no causal claim of any kind, deliberately.

- **⚠️ THE HONEST LIMIT — stated here, in the ADR text, not in a footnote.**
  **This makes the *inventory* mechanical. It does not make the *sweep* mechanical.** A **registered**
  site whose prose quietly goes false **still ships false.** Measured against the historical record:
  A-i would have caught `0124`'s three sites and `0151`'s, but it would **not** have caught `0036` —
  that site was already a declared mirror; the registration was fine and the content went false — and
  it catches **none of the ≥5 defects live in the tree on 2026-08-02**, all of which are wrong content
  at registered sites. **4 of 6 historical classes, 0 of ≥5 current defects.** Anyone who reads this
  ADR as "the ownership docs are now guaranteed correct" has read it wrong.

  > **A second limit, found after this ADR was first written, and closed in TWO steps because the first
  > step was declared complete when it was not.**
  >
  > **Step 1.** Two genuine ownership-fact sites — `ai-agents/README.md` and `claude/scaffold/AGENTS.md`
  > — tripped **none** of clause 4's original four triggers, because they name skills by their **bare
  > suffix** (`task-done`, `query`) and attribute them to a **role name**, which is not a skill. The
  > owner ruled **trigger (e)** on 2026-08-02; it is specified in clause 4, **it catches both**, and its
  > day-one cost was measured before the spec shipped — **7 false-positive files**, registry noise
  > **15 → 22**. *(Stated as 6 and 15 → 21 in the previous revision; the seventh file is an accounting
  > correction to the noise list it was netted against, not a change to (e)'s own measurements, which
  > all reproduce exactly.)*
  >
  > **Step 2, and it is the one worth reading.** That revision shipped (e) **beside a sentence
  > declaring the remaining hole had no live instance.** It had one — the site named in the residuals
  > below, unregistered, shipping into every consuming project. **The failure was not in (e). It was in
  > closing a gap with a claim instead of a clause.** The owner therefore ruled **(c) re-scoped** rather
  > than the sentence amended: (c) catches that site at gap **51** at a measured cost of **zero false
  > positives**. **A hole closed by a clause stays closed when the tree changes; a hole closed by a
  > dated observation does not.**

- **The other half of the problem belongs to task `0137`**, the *"verify against the claim"*
  convention, and the two **compose rather than substitute**: *`0137` teaches the reader to ask the
  right question of a citation; this hands them the complete list of citations to ask it about.* The
  owner considered folding them and chose to keep them separate for exactly this reason. `0142`'s audit
  is the evidence: `0137`'s Lesson 1 — *thematic adjacency at a shifted line range is the signature of
  drift, not evidence against it* — fired unprompted on the first citation opened, at a site A-i would
  have marked green.

- **Residual risks / "re-raise only if":**
  - **Re-raise if a *registered* site is found carrying false ownership prose and someone proposes
    this ADR should have caught it.** It should not have; that is A-ii's job and A-ii is deferred by
    ruling. That finding argues for scoping A-ii, not for a defect here.
  - **Re-raise if the bare-token trigger's noise makes the tripwire unmaintainable in practice** — if
    the registry starts accumulating entries whose `reason` is effectively *"to silence the grep"*.
    That is the signal that clause 4 was priced wrong.
  - **Re-raise if a site is found outside the declared live surface that genuinely governs behaviour
    now.** The boundary in clause 5 is a declaration and can be wrong; a counter-example amends it.
  - **RULED 2026-08-02 — the bare-suffix hole in clause 4 is closed by trigger (e), at a measured
    cost.** The owner chose *"add a fifth trigger — a role name beside an ownership verb"* over
    broadening (b) to bare suffixes, because **(e) catches the shape rather than the vocabulary** and
    so also catches a site naming a skill in a form nobody has thought of yet. (e) is specified in
    clause 4; both known specimens are caught; the day-one cost was measured **before** the spec
    shipped — **7 false-positive files** needing a declared-non-fact-hit entry, taking the registry's
    noise half from 15 files to 22. *(Those two figures are on the **four-trigger** basis; with (c)
    re-scoped the split is **16 + 6** and the **total is 22 either way** — clause 4's bucket-basis note,
    re-measured 2026-08-02.)* **Re-raise only if** (e)'s false-positive rate in practice runs far
    above that measurement — i.e. if entries whose `reason` is effectively *"to silence trigger (e)"*
    start outnumbering real sites.
  - **⚠️ RE-OPENED 2026-08-02, then RULED — verbless attribution, and the licence that stood here is
    WITHDRAWN.**

    **What this residual used to say, quoted so the withdrawal is auditable:** *"A site attributing a
    skill to a role by possessive or apposition alone … trips nothing. **No live-surface site has that
    shape on 2026-08-02.** Whoever builds A-i **may treat clause 4 as complete for verb-carrying
    attribution**, and must not treat it as covering verbless attribution."*

    **The factual claim was false.** `claude/scaffold/ai-agents/knowledge-base/PROJECT.md`
    (`@2026-08-02:1-2`) reads *"The fkit **producer** replaces this file during project initiation
    (**its** initiate-project skill)"* — attribution by possessive alone, inside the clause-5 live
    surface, **shipping into every consuming project**, with its nearest ownership verb **839
    characters** away. The attribution is **true**, so this is an unregistered fact site, not a live
    defect — which is worse for this ADR, not better: it is exactly the object the registry exists to
    enumerate, and it was missed by the sweep that wrote the sentence ruling it out.

    **The owner ruled that the licence be re-opened rather than annotated, and the reasoning is the
    durable part:** *a licence whose stated basis is disproven must not survive by having a
    counter-example noted next to it. That is the "confidently incomplete" pattern one level up — and a
    builder skimming the licence may never read the exception, which is precisely how the FOUR-mirror
    checklist failed three times.*

    **What now stands in its place:**
    - **The hole is closed by a clause, not a claim.** (c) is re-scoped (clause 4) and **catches that
      site**, at a measured false-positive cost of **zero files**.
    - **WHOEVER BUILDS A-i MUST NOT TREAT CLAUSE 4 AS COMPLETE — for any shape, with no exception
      clause.** This ADR grants no completeness licence of any kind, and no future revision should
      restore one from a sweep result.
    - **The dated measurement, which is a measurement and nothing more:** with all five triggers,
      **83 of the 89 live-surface files trip at least one**; the remaining **6** were opened and read on
      2026-08-02 and **none attributes a skill to a role**. **This is one tree, one day, one author —
      and the same method produced two confidently-wrong inventories in the preceding twelve hours.**
    - **Re-raise if** an ownership-fact site is found that trips no trigger in clause 4. That is an
      amendment to the trigger set, exactly as (e) and the (c) re-scope were, and it is expected rather
      than exceptional.
  - **Do not re-raise** "the checklist should just be better" (option C, rejected on three failures),
    or "generate the prose" (option B, rejected on the arguments-not-lists blind spot **and** the
    126-byte budget) — unless the rules-block cap is deliberately raised, which changes only B's
    *second* reason and leaves the fatal one standing.

---

## Related

- **Report:** [`reports/2026-08-02-skill-ownership-fact-inventory-gap.md`](../reports/2026-08-02-skill-ownership-fact-inventory-gap.md)
  — the inventory **as measured on 2026-08-02** (§1.2; the registry is authoritative, the report is a
  dated snapshot), the citation-resolution audit, the **five** live defects, and the
  would-it-have-caught-them table. **Read its §0.1 first:** the report shipped an incomplete inventory
  **twice** — round 1 short by 17 rows, round 2 short by one, and the one it missed was the exact shape
  both documents then declared had no live instance. That is both the reason for this ADR's
  no-hard-count rule and the strongest single piece of evidence for the decision.
- **Task:** [`0142-investigate-the-skill-ownership-fact-inventory-gap`](../../tasks/done/0142-investigate-the-skill-ownership-fact-inventory-gap/brief.md).
- **[ADR-027](adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md)** — the precedent this
  copies almost exactly: convention + hand-rolled test + machine-readable exception list with mandatory
  reasons. `test/dual-home-parity-exceptions.mjs` is the shape clause 2 adopts.
- **[ADR-012](adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md) §1** — `skills_for_role()`
  as the single source of truth. **Unchanged by this ADR.**
- **[ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md)** —
  the `PreToolUse` hook that makes ownership structural, and the reason a false system prompt produces a
  runtime arguing with itself rather than merely a wrong doc.
- **[ADR-033](adr-033-task-movers-are-producer-only-reversing-adr-025.md)** — the reversal whose ripple
  exposed failure 2.
- **[ADR-014](adr-014-how-fkit-tests-itself.md)** — zero devDependencies; the tripwire is hand-rolled.
- **[ADR-035](adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)** and task
  `0160` — the citation form this ADR and its report follow: heading and quoted phrase, tasks by folder
  ID, line numbers only where a line number is itself the evidence and then only as a dated measurement.
- **Task `0137`** — the *"verify against the claim"* convention; the composing half, kept separate.
