# ADR-036: The skill-ownership site inventory is a declared registry, not a checklist

**Date**: 2026-08-02
**Status**: accepted — **revised three times on its own accepted date**, each revision correcting something the ADR itself had asserted. **The decision never changed.**

> **What this ADR decides, in one line:** the list of places a role↔skill ownership fact is *stated* stops being **remembered** in a comment and starts being **declared** in a checked-in module, with a test that fails on any live-surface site not on the list.

## Context

`claude/skills-for-role.sh` carries a **mirror checklist** — a comment block naming the places to update when a role↔skill ownership fact changes. It opens *"⚠️ CHANGING A ROLE'S SKILLS? **FOUR** hand-maintained places MIRROR this list"* and closes *"If you add a fifth mirror, add it HERE FIRST."*

**It has failed three times, in three different ways.**

1. **Task `0036`** — the checklist was followed **precisely** and still shipped a false statement into every consuming project's root `CLAUDE.md`. Its own text narrates this: *"A checklist that is itself incomplete is worse than no checklist: it is followed, and it fails."*
2. **Task `0124`** — a hand-run grep found further live sources asserting the ADR-025 grant that ADR-033 had just reversed, **none of them on the checklist**. Had it shipped as written, the ADR-018 hook would have denied the coder a mover while its own system prompt still instructed it to invoke one — **a runtime arguing with itself.** Caught by a human, not by any control. *(See the note on the site count under [[tasks/revert-task-movers-to-producer-only]].)*
3. **Task `0151`** — `CLAUDE.md`'s hand-written prose **outside** the fkit-managed rules block named the wrong file for `skills_for_role()`. A class the checklist does not name at all.

⚠️ **NO SITE COUNT IS RECORDED IN THIS ADR, AND THAT IS THE DECISION, NOT AN OMISSION.** An earlier revision hard-coded *"21 sites across 16 classes"* into the durable record, and review found the underlying sweep short by **17 rows and 5 whole classes** — three passes by one author on one day produced ~19, 21 and 38. **A number that unstable does not belong in an ADR about the danger of remembered lists.** The registry module is authoritative; a report figure is a **dated measurement of one tree on one day**.

Two constraints bound the options: **ADR-014** keeps devDependencies at zero, so any test is hand-rolled `node:test`; and the rules block sits at **3570 B of a 4096 B cap** — **526 B headroom**, of which only **126 B** is usable against the owner's standing ≥400 B target.

## Decision

1. **`skills_for_role()` remains the single source of truth for role↔skill ownership.** ADR-012 §1 is unchanged. This ADR is about a *different* fact — the inventory of places that fact is **stated**.
2. **A checked-in module becomes authoritative for the inventory** — `test/skill-ownership-sites.mjs`, in the shape of `test/dual-home-parity-exceptions.mjs`: a flat `{ path, kind, reason }` array with a **30-character `reason` floor enforced by the test** (ADR-027 §Decision 3's rationale: *an entry with no stated reason is an unfalsifiable permanent hole*). The checklist comment is **demoted to a pointer** and stops enumerating. ⚠️ **The demotion applies to BOTH copies** — the 12-line block exists **twice, byte-identically**, in `claude/skills-for-role.sh` and `claude/fkit-claude.sh`; neither points at the other and nothing tests they agree. **Both are demoted, or neither is.** *(The artifact warning about undeclared copies is itself an undeclared copy.)*
   **Two kinds of entry:** **ownership-fact sites** (a file attributing a named skill or skill-gated act to a role) and **declared non-fact hits** (files that trip a trigger while attributing nothing). **Without the second kind the tripwire can never go green.**

   > ⚠️ **Dated note 2026-08-22 (lint) — DECIDED, NOT BUILT; the decision text above is left byte-identical.** Measured this run: **`test/skill-ownership-sites.mjs` does not exist** (`test/` holds `skill-ownership-hook.test.js` and no sites module), so Decision 2's registry, Decision 3's completeness tripwire and Decision 4's five triggers are **on the record and not in the tree**. ⛔ **Read the numbered items above in the ADR's deciding voice, not as a description of the repo.** ⚠️ **No implementing task is named on this page**, and identifying or filing one is a producer's call, not the lint's.
3. **A completeness tripwire enforces it** — a hand-rolled test that greps the declared live surface and **fails on any hit whose file is not registered**. It does **not** judge whether the prose is true; it answers one question: *is this site declared?*
4. **Five triggers**, all matched **case-insensitively and bounded on both sides** (whole-token, never substring — `fkit-reviewer` *contains* `fkit-review`, so leaving this unstated makes the set **not deterministically buildable**): **(a)** the bare token `skills_for_role`; **(b)** any `fkit-<skill>` naming a skill in the universe **enumerated from `claude/skills/*/` at test time, never a hand-maintained constant**; **(c)** a **bare** skill suffix within 80 characters of a role name; **(d)** `⛔ Owner:`; **(e)** a role name within 80 characters of an ownership verb (a closed 41-word list). The window is measured with whitespace runs collapsed — **load-bearing, not tidiness**, because a hard wrap would otherwise hide the very specimen (e) exists to catch.
5. **The live surface versus dated records is declared, not inferred.** **Live surface** (a false statement here is acted on): `claude/*.sh`, `claude/agents/`, `claude/skills/`, `claude/README.md`, the whole of `claude/scaffold/`, the repo-root `CLAUDE.md`/`AGENTS.md`, `ai-agents/README.md`, `ai-agents/tasks/README.md`, `PROJECT.md`, `architecture.md`, `conventions/`, and **`test/`**. **Dated records** (outside the surface; correcting one would destroy the record): **ADRs, task briefs, sprint plans, review ledgers, reports, and the whole of `ai-agents/wiki-vault/`.**
6. **Per-site prose extractors (option A-ii) are deferred**, not rejected on principle.

**`test/` is inside the live surface deliberately** — it is what makes the **fifth mirror** catchable: `test/skill-ownership-hook.test.js` maintains its `OWNED` table by hand and says so about itself. *(A sixth hand-maintained roster sits in `claude/fkit-claude-init.sh` under a comment admitting "nothing tests that they agree".)*

### Rejected
- **Option B — generate the ownership sentences from `skills_for_role()`.** Fatal blind spot, and it is **not** the budget: **the sites are arguments, not lists.** In `fkit-coder.md` the membership fact is one clause of six; the rest is the reversing ADR, the enforcement mechanism, the routing instruction and a carve-out with its own justification. That cannot be generated from a shell array. *(126 usable bytes rejects it independently.)*
- **Option C — a fourth, better checklist.** The option that has already failed three times. *"A list nobody can be audibly wrong about is a hope, not a control."*

## Consequences

- **Positive.** The inventory stops being remembered and starts being declared. A new agent, skill, root doc or test oracle **cannot be added silently** — the tripwire fails until it is registered. The `reason` floor keeps each entry falsifiable.
- **Negative.** The bare-token trigger sweeps ~100 files repo-wide, so the live-surface boundary must be maintained as a **real declaration** — a new top-level directory is a decision, not an oversight. Most tripping files assert no ownership fact, so the registry carries declared-noise entries alongside real sites.
- ⚠️ **THE HONEST LIMIT, stated in the ADR text rather than a footnote: this makes the *inventory* mechanical. It does NOT make the *sweep* mechanical.** A **registered** site whose prose quietly goes false **still ships false.** Scored against the record: it would have caught `0124`'s sites and `0151`'s, but **not `0036`** (already a declared mirror — the registration was fine, the content went false), and it catches **none of the ≥5 defects live in the tree on 2026-08-02**, all of which are wrong content at registered sites. **4 of 6 historical classes, 0 of ≥5 current defects. Anyone reading this ADR as "the ownership docs are now guaranteed correct" has read it wrong.**
- ⚠️ **NO COMPLETENESS LICENCE IS GRANTED, and one was withdrawn.** An earlier revision shipped trigger (e) **beside a sentence declaring the remaining hole had no live instance** — and it had one, unregistered, shipping into every consuming project. **The owner ruled the licence be re-opened rather than annotated**, and the reasoning is the durable part: *a licence whose stated basis is disproven must not survive by having a counter-example noted next to it — a builder skimming the licence may never read the exception, which is precisely how the FOUR-mirror checklist failed three times.* The hole was then closed **by a clause, not a claim** (the (c) re-scope). **Whoever builds A-i must NOT treat clause 4 as complete, for any shape, with no exception clause.**
- **Sequencing: repair the live defects FIRST, then build the guard** — task `0188` before task `0189`. ⚠️ **On the owner's ruling alone, verbatim — *"do not let the build quietly repair its own corpus"*.** **TWO false mechanisms were attached to this sequencing note in two consecutive revisions; both were asserted rather than measured, both were plausible, both shipped, and both are withdrawn. No mechanism replaces them.**
- **The other half of the problem belongs to task `0137`** (the *"verify against the claim"* convention). The two **compose rather than substitute**: *`0137` teaches the reader to ask the right question of a citation; this hands them the complete list of citations to ask it about.*

## Related
- [[tasks/investigate-the-skill-ownership-fact-inventory-gap]] — task `0142`, the investigation, the five live defects, and the report that shipped an incomplete inventory **twice**
- [[decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test]] — the precedent this copies almost exactly: convention + hand-rolled test + machine-readable exception list with mandatory reasons
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — §1, `skills_for_role()` as the single source of truth. **Unchanged by this ADR**
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook that makes ownership structural, and the reason a false system prompt yields a runtime arguing with itself
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the reversal whose ripple exposed failure 2
- [[tasks/revert-task-movers-to-producer-only]] — task `0124`, failure 2 itself
- [[tasks/correct-claude-mds-stale-skills-for-role-location]] — task `0151`, failure 3
- [[decisions/adr-014-how-fkit-tests-itself]] — zero devDependencies; the tripwire is hand-rolled
- [[decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception]] — the sibling ADR from the same sprint run; both follow task `0160`'s citation form
- [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]] · [[systems/testing-and-verification]]
- Source: `ai-agents/knowledge-base/decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry.md`, `ai-agents/knowledge-base/reports/2026-08-02-skill-ownership-fact-inventory-gap.md`
- [[tasks/convert-skill-descriptions-to-block-scalars-and-guard]] — task `0136` — every skill `description:` to a `>-` block scalar, plus the repo's first `SKILL.md` frontmatter guard
- [[tasks/decide-how-an-owner-records-a-merit-ordering]] — task `0174` — the merit-ordering ruling; **the task that became its own proof case**
- [[tasks/reconcile-dual-homed-file-drift-live-vs-scaffold]] — task `0132` — the dual-home reconciliation, and the sweep that **disproved ADR-027's premise**
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — one of the three ADRs that touch the precedence axis without deciding it; its registry must also assess ADR-037's two new clause sites (task `0194`)
- [[tasks/add-adr-037s-worker-side-precedence-clause-to-the-universal-rules-block]] — task `0190`, whose edit lands **inside this ADR's declared live surface** — and whose trigger-(e) check **could not be run**, because the registry module does not exist on disk
- [[tasks/decide-whether-process-review-is-always-the-coder-or-the-architect-gains-the-skill]] — task `0200`, which hit the same gap from the other side: **every "which files would change" count in its report is a hand grep**, and the four-mirror checklist was **incomplete again, in both directions**
