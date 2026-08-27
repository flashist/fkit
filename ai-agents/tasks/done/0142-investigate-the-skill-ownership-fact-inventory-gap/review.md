# Review — 0142

Task: 0142 — [brief](./brief.md)
File(s) under review:
- `ai-agents/knowledge-base/reports/2026-08-02-skill-ownership-fact-inventory-gap.md` (new)
- `ai-agents/knowledge-base/decisions/adr-036-the-skill-ownership-site-inventory-is-a-declared-registry.md` (new)
- `ai-agents/tasks/backlog/0142-investigate-the-skill-ownership-fact-inventory-gap/plan.md` (new)
- `ai-agents/tasks/backlog/0142-investigate-the-skill-ownership-fact-inventory-gap/worklog.md` (new)

Status: **closed-out** — 2026-08-02, after **review round 3 converged**. **15 findings over 3 rounds
(R1–R15); 14 applied, 1 accepted as a residual.** **Codex coverage was FULL on all three rounds** —
`codex-cli 0.145.0`, `--sandbox read-only`, own pass + adversarial pass every round. **No review round
4 — the reviewer recommended closeout explicitly.** Final verdict, accepted residuals and the
severity dissent on R14 are in **§Closeout** at the foot of this file.

> **Round 3 closed the review's substantive work.** Two Round-3 findings stand (**R14** medium, **R15**
> low), neither blocking. **Closeout is recommended and needs one owner disposition** — apply R14's
> scoping qualifier to the four named sentences, or record R14/R15 as accepted residuals. **No fourth
> review round is recommended either way.**

**Review type: document review.** The bar is inventory completeness, reproducing measurements,
resolving citations, and honestly stated blind spots — not code correctness.

**Reviewers run (Round 1):** fkit-reviewer own pass **+ Codex adversarial pass** (`codex-cli 0.145.0`,
`--sandbox read-only`). **Both ran. Coverage is FULL — this review is not degraded.**

**Verdict — 🛑 Blocked — 7 confirmed defects (3 high).** The recommendation, the option analysis, the
budget, the citation audit and the ADR's number all hold. **The inventory — the primary deliverable —
does not.**

**Reviewers run (Round 2 — the delta):** fkit-reviewer own pass **+ Codex adversarial pass**
(`codex-cli 0.145.0`, `--sandbox read-only`). **Both ran. Coverage is FULL — this review is not
degraded.** Scope: the round-2/round-3 delta only (§0.1, the 38-row inventory, §1.6, trigger (e), blind
spot #2, D5, Part 6's rescored row, Part 8, the appendix; ADR-036 clauses 4 and 5, the withdrawn
mechanism, the rewritten residual, the no-hard-count rule).

**Reviewers run (Round 3 — the delta):** fkit-reviewer own pass **+ Codex adversarial pass**
(`codex-cli 0.145.0`, `--sandbox read-only`). **Both ran. Coverage is FULL — this review is not
degraded.** Scope: the round-3 delta only (C32; the re-scoped (c); (b)'s pinned token-boundary rule;
the withdrawn D4 note; §1.2's A3 row and §1.3's Tier-A claim; §1.5's membership; the withdrawn 88;
Part 1's Results arithmetic; the re-opened licence sentence; the possessive/appositive re-sweep).
**The owner ordered this round and required the changed figures to be independently re-verified rather
than accepted.**

**Verdict — Round 3 — ⚠️ Changes requested — 1 confirmed defect (medium), none blocking.** **The
re-scoped (c) is SOUND** and every figure behind it reproduces exactly on an independent
reimplementation — 52 of 89, exactly one (c)-only file and it is C32, zero false positives, specimen
gap 51, nearest would-be false positive at 685, identical result for every window 51–684. **The
inventory is acceptable.** What remains is that **three figures in normative text are measured against
(c) as it *used to* stand and are not labelled as such** — a scoping qualifier, not a substance error.
**Raised independently by both reviewers.**

**Verdict — Round 2 — 🛑 Blocked — 6 confirmed defects (2 high).** Trigger (e) itself is **sound and
correctly priced** — every measurement behind it reproduces exactly, including the byte-identical spec
block, both specimen gaps, and the honestly-priced rejected alternative. **R1's fix is NOT complete:
the corrected inventory still misses a live-surface ownership-fact site**, and that site is precisely
the *verbless* shape both documents declare has no live instance. Separately, the trigger spec is not
deterministically buildable, and R2's replacement "one true mechanical note" is itself false.

> **Naming note.** The *Round* column below is the **review** round. The report calls its own revisions
> "Round 2" and "Round 3"; those are author revisions, not review rounds. Review Round 2 covers both.

---

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | high | `ai-agents/knowledge-base/reports/2026-08-02-skill-ownership-fact-inventory-gap.md` §*"Part 1 — the true inventory"* | **The inventory is incomplete.** The stated method never read `ai-agents/knowledge-base/conventions/`, `claude/scaffold/ai-agents/`, or `claude/*.sh` beyond three scripts — yet ADR-036 §Decision clause 5 declares all three **inside** the live surface. **26 unregistered live-surface files trip the ADR's own trigger set**; at least eight state genuine role↔skill ownership facts. **21 sites / 16 classes is a floor, not the count** — and ADR-036 hard-codes it into the durable record. |
| R2 | 1 | high | report §*"D4 — the mirror checklist says FOUR"* vs §*"Part 6 — would it have caught them?"* row 6 | **The report contradicts itself on whether the guard ships red.** D4: *"the guard ships red on day one … the guard's first act is to fail on its own predecessor."* Part 6 row 6: A-i catches *"NO. None of the four"*, D4 included. The tripwire *"does **not** try to judge whether the prose is true"* and `claude/skills-for-role.sh` is **registered as A1** — so a false `FOUR` count in it **cannot** make the tripwire red. Carried into ADR-036 §Consequences as a normative sequencing justification. |
| R3 | 1 | high | `CLAUDE.md` §*"The fkit team in this repo (dogfooded)"* — *"every other fkit skill is turned off, invisible and unrunnable"* | **A fifth live defect the report missed, at a site it registered as C9 and quoted from.** Foreign skills are **visible-but-blocked**, not invisible. Contradicted by B1 (*"Visible-but-blocked, not invisible-and-blocked"*), `claude/README.md` (*"stays **visible** in the `/` menu but is **not runnable**"*), `architecture.md` (*"a non-owned skill stays **visible**"*), `claude/scaffold/CLAUDE.md` (*"a foreign skill is **visible** … but **not runnable**"*), and ADR-018 §Decision 5, which records the visibility regression as an accepted cost. The report quoted this same file for §2.2 from prose **13 lines below** this sentence. Makes the honest score **0 of ≥5** current defects, not 0 of 4, and the Part-3 population the repair task is scoped from is undercounted. |
| R4 | 1 | medium | report §1.2 row **B2** vs §1.1 and ADR-036 §Decision clause 5 | **`claude/README.md` is a declared Tier-B mirror that sits OUTSIDE the declared live surface.** Clause 5 enumerates `claude/*.sh`, `claude/agents/`, `claude/skills/`, `claude/scaffold/`, root `CLAUDE.md`/`AGENTS.md`, `architecture.md`, `conventions/`, `test/` — `claude/README.md` matches none. The report's §1.1 wording (*"the four root/scaffold instruction files"*) excludes it too, yet the appendix's live-surface count of **10** includes it. **As declared, the tripwire would never scan one of the four checklist mirrors.** |
| R5 | 1 | medium | report §4.1 §*"The trigger set"* — *"naming a skill from `UNIVERSE`"* | **Trigger (b) is bound to a constant that is knowingly incomplete.** `UNIVERSE` in `test/skill-ownership-hook.test.js` holds **24 of 25** skills — `fkit-sprint-ship-loop` is absent, and the file says so about itself (*"absent from UNIVERSE below, so it is not mirrored here either — pre-existing gap"*). A site naming only `fkit-sprint-ship-loop`, with no role adjacency, bare token or banner, escapes all four triggers. ADR-036 clause 4(b) says *"a skill in the skill universe"* (looser, safer) — **so the ADR and report also differ on a load-bearing spec detail.** |
| R6 | 1 | low | ADR-036 §Context — *"It has failed three times"* vs report §4.3 — *"already failed twice"* | **Unflagged count divergence between the durable record and its reasoning.** Report says twice in four places; ADR says three times in three places (promoting `0151` to a full failure). Neither notes the change — against the report's own §0 rule: *"Where a figure already on record differs, the difference is stated, not smoothed."* |
| R7 | 1 | low | report §*"Appendix — commands run, 2026-08-02"* — *"Bare-token corpus size … → **98**"* | **The figure no longer reproduces with its named command.** Re-run 2026-08-02: **100** (`.fkit/` excluded or not). Consistent with having been measured before the report and ADR were written, then presented as a final-report measurement — which §0 promises it is (*"Every number here was measured on 2026-08-02 by the commands named beside it"*). Directionally harmless; the *"~90 files"* argument survives. |
| R8 | 2 | **high** | `claude/scaffold/ai-agents/knowledge-base/PROJECT.md` (`@2026-08-02:1-2`) vs report §1.2 / §1.6 and ADR-036 §Residual risks | **The corrected inventory is STILL incomplete — and the missed site is the exact shape both documents declare has no live instance.** *"The fkit **producer** replaces this file during project initiation (**its** initiate-project skill)"* attributes `fkit-initiate-project` to the producer by **possessive** — true (`claude/skills-for-role.sh@2026-08-02:51`), inside the declared live surface (*"the whole of `claude/scaffold/`"*), and **absent from all 38 rows, from §1.5's noise list, and from both documents entirely**. It trips **none of (a)–(e)**. So §1.6's *"**two** fact sites trip no trigger at all"* is **≥3**; §4.1's *"(e) catches both"* is not completeness; and ADR-036's *"**No live-surface site has that shape on 2026-08-02**"* is **false** — the claim that licenses a builder to *"treat clause 4 as complete for verb-carrying attribution"*. **Ships into every consuming project**, and is the scaffold twin of registered **C16**, in the very tree the round-2 sweep claims to have added. **Raised independently by both reviewers.** |
| R9 | 2 | **high** | ADR-036 §Decision clause 4 — *"(b) any `fkit-<skill>` … (c) a role name adjacent to a skill name"*; report §4.1 triggers 2–3 | **The accepted trigger set is not deterministically buildable, and the architect's self-reported diagnosis of it is wrong.** **(b) states no token-boundary rule** — and role basename `fkit-reviewer` **contains** skill name `fkit-review`, so `test/rules-block-budget.test.js` trips (b) under a substring reading and not under a bounded one. That single file **is** the round-2-vs-round-3 disagreement the architect attributed to (c). **(c) cannot be the cause:** measured at same-line / 20 / 40 / 80 / 200 / unbounded, the tripped set is **73 of 89 in every case**, because (c) requires a skill name and (b) already fires on any skill name — **(c) ⊆ (b), a no-op trigger**. (e) specifies boundaries explicitly (*"bounded on both sides by a character outside `[A-Za-z0-9_-]`"*); (b) and (c) do not. **Raised by both reviewers.** |
| R10 | 2 | medium | report §D4 correction block — *"clause 2's demotion **deletes** the `FOUR` enumeration, so the build resolves D4 itself"*; ADR-036 §Consequences; `worklog.md`; report Part 8 | **R2's replacement "one true mechanical note" is FALSE — the second untrue mechanism attached to the same sequencing note.** The FOUR-mirror checklist is **duplicated byte-identically** in `claude/fkit-claude.sh@2026-08-02:239-250` and `claude/skills-for-role.sh@2026-08-02:12-23` (12-line `diff` → no output). ADR clause 2 demotes only *"the checklist comment in `claude/skills-for-role.sh`"*, so a clause-2-compliant build **leaves the false `FOUR` live**. Knock-on: §1.2 classes `claude/fkit-claude.sh` as **A3 *"machine consumer"*** anchored on `. "$here/skills-for-role.sh"`, and §1.3 asserts **Tier A *"Cannot drift; they read the function"*** — false for A3, which carries 12 lines of hand-maintained mirror prose. §1.4's mirror hunt never notices the duplicate. **Raised by Codex, verified first-hand.** |
| R11 | 2 | medium | report §1.5 — *"Registry noise — 15 live-surface files that trip a trigger and assert nothing"* | **The noise list has one file wrongly in and one wrongly out; the two errors cancel, so the total and the 58+15=73 arithmetic both close.** **In, wrongly:** `test/rules-block-budget.test.js` — trips **no** (a)–(d) trigger under a bounded reading of (b) (see R9). **Out, wrongly:** `claude/skills/fkit-status/dashboard.sh` — the **only** non-`SKILL.md` file under `claude/skills/`, trips (b) on `/fkit-status`, asserts no ownership fact, and is covered by neither C13/C14 (both `SKILL.md`-only) nor §1.5. My bounded (a)–(d) sweep returns exactly **15** non-fact trippers with that membership swap. Consequence: the day-one registry noise half is **22, not 21**. |
| R12 | 2 | low | report §Part 1 — *"enumerated to a file list (**88 files**)"* vs §Appendix — *"the §1.1 surface re-enumerated → **102 paths, 89 non-empty**"* | **Two enumerations of the same declared boundary, the same day, in adjacent appendix rows, differ and are never reconciled.** Enumerating clause 5 exactly reproduces **102 / 89 / 13 empty `.gitkeep`** — the round-3 figure. **88 matches neither.** Against §0's own rule: *"Where a figure already on record differs, the difference is stated, not smoothed."* **Material, not cosmetic: the 88-file sweep is the one that produced the 38-row inventory**, and R8 shows it missed a live-surface file. *(Codex offers a mechanism — 102 minus the 14 individually-named entries (7 `claude/*.sh` + 7 named docs) is exactly 88 — recorded as plausible but **unproven**, since B2/C15/C16/C17/C19 are individually-named files round 2 did add.)* |
| R13 | 2 | low | report §Part 1 — *"**Results:** 88 live-surface files · **73 trip at least one trigger** · **60 of those are fact-site files** … · **15 are noise**"* | **The headline results line for the primary deliverable is arithmetically impossible as worded.** 60 + 15 = 75 > 73. The intended reading is **58** triggered fact-site files + **15** noise = 73, plus the **2** untriggered fact sites = **60** fact-site files. *"60 of those"* mislabels its denominator. **Raised by Codex, verified.** |
| R14 | 3 | medium | report §4.1 / ADR-036 clause 4 shared block (`report@2026-08-02:675`, `@2026-08-02:764`; `adr-036@2026-08-02:170`, `@2026-08-02:259`); report §1.5 (`@2026-08-02:380`); report §1.6 C32 row (`@2026-08-02:401`) | **Three figures in normative text are measured against (c) as it USED to stand, and carry no qualifier saying so.** With the re-scoped (c) specified in the same block, `claude/scaffold/AGENTS.md`, `claude/scaffold/ai-agents/knowledge-base/PROJECT.md` and `claude/scaffold/ai-agents/wiki-vault/schema.md` now trip (c) — so **(a)–(d) bounded is 76, not 73** (substring 77, not 74), and **(e)-only is 7, not 9**. Affected: *"The set tripping ≥1 of (a)–(d) is **73** bounded and **74** as substrings"*; *"**9 trip (e) and none of (a)–(d)**"*; *"**My bounded (a)–(d) sweep of 2026-08-02 returns exactly 15 non-fact trippers with that membership**"*; and §1.6's C32 row closing *"**It trips none of (a)–(e).**"*, which the re-scope exists to falsify. **The report scopes this correctly in three OTHER places** — Part 1's *"This sweep measured the original FOUR triggers"*, §1.6's *"Running the original four-trigger set"*, and the appendix's *"the four triggers as they stood in round 2"* — so the fix is a qualifier on four sentences, with **no substance change**. **Same class as R11 and R13**: bucket-attribution between (c) and (e) shifted and was not restated, against §0's *"a figure already on record differs, the difference is stated, not smoothed"*. **Totals are unaffected and all reproduce** — registry 61 fact-site files + 22 declared non-fact hits = 83. **Raised independently by both reviewers.** |
| R15 | 3 | low | report §Appendix — *"**282 instances across 49 files**"* (`@2026-08-02:1159`) | **The possessive/appositive re-sweep's published figure does not reproduce.** Two independent reimplementations of the stated method — mine and Codex's, written separately — **both return 291 instances across 50 files**. Codex named the extra file: `claude/fkit-claude.sh`, five qualifying role occurrences, **registered as A3**. **The CONCLUSION is independently confirmed twice: every qualifying file is registered, and nothing beyond C32 is unregistered** — I checked all 50 against §1.2's 39 rows (C11/C12 = all 7 agent definitions, C13/C14 = all 25 `SKILL.md`) and §1.5's 15 plus (e)'s 7. **Low, not medium**, precisely because the document already declines to lean on it: the architect's own residual 2 calls it *"a proxy measurement, not a proof"*. That refusal is now load-bearing rather than rhetorical. |

### R1 — the omitted sites, named

Derived by my own sweep of the full declared live surface (86 files), independent of the report's list.
Both reviewers found omissions independently; this is the union, restricted to sites that genuinely
assert a role↔skill fact:

| Omitted site | The assertion |
|---|---|
| `ai-agents/tasks/README.md` | *"`fkit-reviewer`'s `stateful-review` writes the findings; `fkit-coder`'s `process-stateful-review` writes the verdicts/actions"* — an explicit role↔skill mapping |
| `claude/scaffold/ai-agents/tasks/README.md` | same sentences — **ships into every consuming project** |
| `ai-agents/knowledge-base/conventions/task-status-vocabulary.md` | *"only the producer may invoke those skills"* |
| `claude/scaffold/ai-agents/knowledge-base/conventions/task-status-vocabulary.md` | same |
| `ai-agents/knowledge-base/conventions/task-owner-vocabulary.md` | role roster table keyed by `fkit-<role>` |
| `claude/scaffold/ai-agents/knowledge-base/conventions/task-owner-vocabulary.md` | same |
| `claude/fkit-claude-init.sh` | the installer's printed roster — *"Role-locked sessions — inside each, only its own skills exist:"* — whose own comment admits *"The two must be kept in step by hand; neither derives from the other, and **nothing tests that they agree**."* A self-declared hand-maintained mirror the report never mentions, not even to exclude it. |
| `claude/scaffold/CLAUDE.md` / `claude/scaffold/AGENTS.md` — **unmanaged** prose | §*"Knowledge Base & Wiki"* wiki-write-exclusivity + `/fkit-query`, **outside** the generated block — the report's own C9/C10 class, applied to the root files but not to the scaffold twins |

**Two whole classes are absent from the inventory:** `conventions/` pages (both homes) and the
`scaffold/ai-agents/` tree. The report's §1.1 live-surface cell names *"`knowledge-base/conventions/`"*
explicitly — so this is not a boundary disagreement, it is a sweep that did not cover its own declared
boundary.

**This is the exact failure mode under investigation, reproduced by the artifact investigating it.**
It strengthens the report's thesis and invalidates its count.

---

## Round 2 — the independently re-derived sweep

**Method.** The clause-5 live surface was enumerated from scratch, all five triggers were reimplemented
from the ADR's own spec text, and the predicate was run over every non-empty file. **The report's
headline round-3 measurements reproduce exactly**: 102 paths · 89 non-empty · 13 empty `.gitkeep` ·
**73** trip ≥1 of (a)–(d) · **70** trip (e) · **9** trip (e) and none of (a)–(d), and the 9 are exactly
the 9 files named · 41 verbs · 25 skills · 7 roles.

### R8 — the site the corrected inventory still misses

> `claude/scaffold/ai-agents/knowledge-base/PROJECT.md`, the file's first two lines:
>
> *"placeholder brief. **The fkit producer** replaces this file during project initiation (**its
> initiate-project skill**)."*

It clears the report's **own** inclusion test — *"attributes a named `/fkit-*` skill … **to a role**:
who holds it"* — by possessive. The attribution is **true**: `skills_for_role(producer)` holds
`fkit-initiate-project` (`claude/skills-for-role.sh@2026-08-02:51`). So this is **not** a sixth live
defect; it is an **unregistered fact site**, which is the object this report exists to enumerate.

**Why it escapes everything:** no `skills_for_role` token (a); `initiate-project` is a **bare suffix**,
not a `claude/skills/*/` directory name (b, c); no `⛔ Owner:` banner (d); and the nearest ownership
verb to *"producer"* is **839 characters** away, far outside (e)'s 80-character window.

**Two independent aggravations.** It is the **scaffold twin of registered C16**, and the report splits
every other twin into its own row (C18, C20, C22, C24, C26, C29, C30) — so omitting this one breaks its
own row-splitting convention. And `test/dual-home-parity-exceptions.mjs` — which the report registers as
**C31** and **quotes from** — points straight at it at `@2026-08-02:67-70`, naming
`/fkit-initiate-project` in the very `reason` string the report read.

### R9 — what the trigger spec actually leaves open

| Reading of (c) | files tripping ≥1 of (a)–(d) |
|---|---|
| same-line | 73 of 89 |
| 20 / 40 / 80 / 200 chars | 73 of 89 |
| unbounded | 73 of 89 |

**(c) is measurement-invisible because it is redundant**, not because it is harmless: it needs a skill
name, and (b) already fires on any skill name. The clause that *does* move the numbers is **(b)**, and
its ambiguity is not hypothetical — `fkit-review` is a skill, `fkit-reviewer` is a role, and one is a
prefix of the other. Bounded (b) → 72 files; substring (b) → 74, the two extra being
`test/launcher-contract.test.js` (already trips (a)) and **`test/rules-block-budget.test.js`** — the
single file the architect reported as a sweep disagreement.

---

## Round 3 — the independently re-derived sweep

**Method.** The clause-5 live surface was enumerated from scratch a third time, and **all five triggers
were reimplemented from the pinned spec block alone** — the token-boundary rule, both disk-derived
vocabularies, the whitespace-collapsed 80-character window, either order. Codex wrote its own
enumerator separately. **The owner required the changed figures to be re-derived rather than accepted;
they were.**

### The re-scoped (c) — SOUND, and the margin is wide, not knife-edge

| Claim | Independently measured |
|---|---|
| 52 of 89 trip (c) | **52** ✓ |
| exactly 1 trips (c) and none of (a), (b), (d), (e) | **1** ✓ |
| …and it is C32, a genuine fact site | `claude/scaffold/ai-agents/knowledge-base/PROJECT.md` ✓ |
| ZERO false positives, ZERO new registry noise | ✓ |
| specimen gap **51**, 29 inside the window | **51** ✓ |
| nearest would-be false positive `test/skill-frontmatter.test.js` at **685** | **685** ✓ (`coder` … `review`) |
| next, `test/harness.mjs` at **2607** | **2607** ✓ |
| identical result for every window **51–684** | ✓ — 51:1 · 52:1 · 80:1 · 200:1 · 500:1 · 683:1 · 684:1 · **685:2** |

**The margin is genuinely wide: a 633-character stable interval above the specimen before the first
false positive.** Codex measured the same interval independently.

**"The spec did not have to be bent to fit" — JUDGED HONEST.** (c) inherits its window (80), its
whitespace-collapse basis and its role-name set **verbatim from (e)**. The one free parameter was not
chosen to fit the specimen — any value in [51, 684] gives the identical answer. **R8's site is caught
by measurement, at the exact offsets claimed:** whitespace-collapsed, `producer` ends at **62**,
`initiate-project` begins at **113** → gap **51** ≤ 80.

**What the required role name buys, priced independently.** The bare-suffix broadening of (b) that the
owner rejected — bare suffixes with **no** role-name requirement — trips **84 of 89 files**. Requiring
a role name inside the window takes that to a clause that adds **one** file, and that file is a genuine
fact site. **The owner's rejection reasoning verifies empirically, and (c)'s re-scope is demonstrably
not that rejected option.**

### The figures the owner ordered re-verified — all reproduce

- **(e)'s day-one cost 6 → 7 and noise 21 → 22 — the architect's characterisation is HONEST.** (e)'s own
  measurements are untouched and all reproduce: **70** trip (e); **9** (e)-only on the pre-re-scope
  basis; specimen gaps **10** and **9**. The seven files named are **exactly** the seven I measured.
  `test/rules-block-budget.test.js` contains only `fkit-reviewer` — never `fkit-review` as a bounded
  token — so it genuinely enters the registry through **(e)**, not (b). **This is R11's accounting
  correction propagating, not a re-pricing of (e).** Codex ruled it honest independently.
- **83 of 89** trip ≥1 of the five ✓ — and the **6** that trip nothing are **exactly** the six named.
  **I opened all six myself**; none attributes a skill to a role. Codex opened them too, same answer.
- bounded (b) **72** ✓ · substring (b) **74** ✓ · flip file `test/rules-block-budget.test.js` ✓
- (a)–(d) bounded **73** ✓ *on the round-2 trigger basis* — **76** on the current basis (**R14**)
- Part 1 Results: **58 + 15 = 73** ✓ closes · +3 untriggered → **61** fact-site files ✓ · **39** rows ✓
  (counted: 3 A + 4 B + 32 C) · **21** classes ✓ (hand-normalised; C32 joins C16's class, adding none) ·
  Tier C **32** ✓
- **§1.5 is exactly 15** ✓, and both membership swaps verify: `claude/skills/fkit-status/dashboard.sh`
  **is** the only non-`SKILL.md` file under `claude/skills/` and trips (b) on `/fkit-status`.
- full-form-only alternative **7 → 2** ✓ — survivors `test/converge-contract.test.js` and
  `test/rules-block-budget.test.js`, **both at gap 27**, exactly as stated
- bare token **101** ✓ · live-surface subset **10** ✓

### Agreement, the D4 withdrawal, and the licence — all verified

- **The shared matching-rules blockquote is byte-identical**, `diff` → no output, **12,670 characters**
  (12,789 UTF-8 bytes). **R5's failure mode does not recur a third time.**
- **The D4 note carries NO mechanism.** Both false mechanisms are quoted and withdrawn in report §D4
  and ADR §Consequences; the sequencing rests on the owner's verbatim ruling alone. **Repair scope
  widened to `claude/fkit-claude.sh`** in report Part 8 **and** ADR clause 2. **§1.2's A3 row and §1.3's
  Tier-A claim are corrected** — §1.3 names its own former false claim rather than quietly replacing it,
  and §1.4 records that its mirror hunt walked past a byte-for-byte duplicate.
- **ADR-036 grants NO completeness licence of any kind.** `may treat clause 4 as complete` survives only
  twice, both inside explicit quoted-withdrawal blocks (`adr-036@2026-08-02:24`, `@2026-08-02:488`).
  ***"must NOT treat clause 4 as complete"* appears in both documents with no exception clause
  anywhere.** Both reviewers' greps agree.
- **(e)'s substance is unchanged.** The hard-wrap nit fix is correct: `claude/scaffold/AGENTS.md@2026-08-02:19`
  ends with `the` and `:20` opens with `` `fkit-wiki` ``, exactly as the corrected text now says. The
  role-name source, the closed 41-verb list in five groups, and the 80-character whitespace-collapsed
  window are all untouched.

### The three self-reported residuals — assessed

1. **R12 recorded as UNKNOWN — RIGHT.** 88 is withdrawn as unreproducible rather than back-fitted, and
   Codex's mechanism is recorded as plausible-but-unproven **with the reason it cannot be settled**
   (round 2 kept no file list). Guessing a cause here would have been the exact vice this report is
   about. **Recording an unknown as unknown is the correct call, and the honest one.**
2. **Residual 2 — refusing to convert the sweep into a licence — RIGHT, and the ADR honors it.**
   *"A proxy measurement, not a proof — the same method produced two confidently-wrong inventories in
   the preceding twelve hours"* is the correct epistemic stance, and **R15 makes it load-bearing rather
   than rhetorical**: two independent reimplementations just returned 291/50 against the published
   282/49. The ADR honors it — verified by grep, no exception clause anywhere.
3. **C32 appended out of sequence — RIGHT.** Inserting beside C16 would have renumbered C17–C31 between
   two revisions of a document whose rows are cited by identifier across a live ledger and an ADR.
   **Stable identifiers beat tidy ordering**, and the class column carries the grouping
   (*"same class as C16"*), so nothing is lost.

## Suppressed / disproven — do not chase

- **Codex: *"21 classes does not reproduce — the Class column holds 27 distinct literal values."*
  DISPROVEN.** Codex counted literal cell strings. Cells reading *"same class"* are pointers to the row
  above, not distinct values; §1.2 states the normalisation (*"with declared mirror kept split by
  audience"*). Hand-counting the normalised classes returns **exactly 21**.
- **Codex: *"the bare-token count does not reproduce — 131, not 101."* DISPROVEN in this environment.**
  The report's literal named command returns **101**, and the live-surface subset **10**. Codex's 131
  came from a different enumeration that reached gitignored runtime directories.
- **Round 3 — Codex: *"the bare token 101 does not reproduce; it is 130 raw, or 100 excluding `.fkit/`
  and `.claude/`."* DISPROVEN, and it is the THIRD variant of a claim already disproven in round 2.**
  The report's **literally-named** command — `grep -rln "skills_for_role" . | grep -v "^./.git/" | wc -l`
  — returns **exactly 101** in this environment, re-run 2026-08-02 during this round. Codex's 130 is the
  same gitignored-runtime-directory artifact that produced its disproven *"131"* last round. The
  live-surface subset is **10**, agreed by both reviewers. **`grep -rln … --exclude-dir=.git` also
  returns 101.** Recorded loudly so a fourth variant is recognised on sight.
- **Round 3 — Codex assigned R14 severity HIGH. I assign MEDIUM, and the severity is mine.** Traced to
  blast radius: nothing downstream acts on the three affected figures. The registry a builder writes
  (**61** fact-site files + **22** declared non-fact hits = **83**), (c)'s price (**zero** false
  positives), (e)'s price (**7** new entries, noise 15 → 22) and the no-licence rule are **all correct
  and all reproduce**. What shifts is bucket-attribution between (c) and (e) — the totals close either
  way.
- **Nothing suppressed as re-litigation.** No Round-2 finding re-raises an accepted residual (there are
  none) or an ADR-036 *"re-raise only if"* condition. **R8 specifically does not** trip the registered-
  site-with-false-prose residual: the site is **unregistered** and its prose is **true**. Nor does it
  dispute the verbless residual's *rule* — it disproves the **factual claim** printed beside it.

## Verified CORRECT in Round 2 — recorded so the architect does not re-chase them

- **Every measurement behind trigger (e) reproduces exactly.** 102/89/13; 70 trip (e); 9 (e)-only, and
  the 9 files are the 9 named — 2 specimens, `test/rules-block-budget.test.js`, and the 6 new entries.
  The verb list counts **41**.
- **The spec block is genuinely BYTE-IDENTICAL** in report §4.1 and ADR-036 clause 4 — `diff` over the
  63-line blockquote returns no output. **R5's failure mode does not recur.**
- **Both specimens are caught by their load-bearing clause**, not incidentally: `ai-agents/README.md`
  *"Maintained by the **fkit-wiki agent**"* → gap **10**; `claude/scaffold/AGENTS.md` — *"Writes stay
  exclusive to the `fkit-wiki` agent"* → gap **9**.
- **The hard-wrap justification holds.** The scaffold clause really does straddle
  `claude/scaffold/AGENTS.md@2026-08-02:19-20`, so a same-line predicate would miss it and
  whitespace-collapsing **is** load-bearing. *(Nit only: the block says *"`exclusive` ends one line"*;
  the word ending line 19 is `the`. The substance is right.)*
- **The rejected alternative is priced honestly and correctly.** Dropping the bare forms: **5 of the 6**
  new false positives vanish, cost falls **6 → 1** (`test/converge-contract.test.js`), and **both
  specimens still trip**. The stated ground for rejecting it verifies —
  `claude/scaffold/CLAUDE.md@2026-08-02:75` really does read *"Writes stay exclusive to the **wiki
  role**"*. **A well-argued frontier-move, not a defect.**
- **R1's nine named sites are all present:** C19/C20, C21/C22, C23/C24, C15
  (`claude/fkit-claude-init.sh`'s printed roster), C29/C30. **§0.1 names exactly the three declared
  areas the first pass never opened**, before Part 1, and calls the `fkit-claude-init.sh` omission the
  most embarrassing. **ADR-036 hard-codes no count**, with the registry authoritative.
- **R2's withdrawal is complete in BOTH documents** — the *"guard ships red on day one"* mechanism is
  gone from report §D4 and ADR §Consequences, and sequencing rests on the owner's verbatim ruling.
  *(Its **replacement** note is the defect — R10.)*
- **R3 is fully applied, and the restraint on `PROJECT.md` was RIGHT.** `PROJECT.md@2026-08-02:48` reads
  only *"skill is turned off"* — it makes **no visibility claim**, so the five D5 sources (all about
  visibility) do not contradict it. Flagging it without asserting it false is the correct call under
  `evidence-before-assertion`; asserting it would have outrun the evidence.
- **R4 holds in both documents** — `claude/README.md` is inside the live surface, and it is one of the
  10 live-surface token hits I measured.
- **R5's binding is identical in both documents** — (b) now sources from `claude/skills/*/` on disk.
  *(The **source** is fixed; the **matching rule** is what R9 leaves open.)*
- **R6/R7 hold** — three failures in both; bare token **101**; live-surface subset **10**, unmoved.
- **Tier and class arithmetic:** 3 + 4 + 31 = **38**; normalised classes = **21**; C17–C28 = **4
  READMEs + 8 convention pages**, matching ADR §Context. §1.5's prose expands to **15** names.
- **Part 1's pre-(e) counts are labelled adequately** — the *"This sweep measured the original FOUR
  triggers"* blockquote sits **immediately below** the Results line, not in a footer. Self-reported
  residual 3 is **resolved**; no finding.
- **Scope kept.** No test, script, skill, agent definition, board, convention page or vault file was
  written this round; nothing moved; nothing committed.

---

## Verified CORRECT — no finding (recorded so the coder does not re-chase them)

- **The methodological centerpiece reproduces exactly.** `for f in claude/skills/*/SKILL.md; do grep -q "⛔ Owner:" "$f" || echo "$f"; done` reports **only** `fkit-query`; a real banner check (`^> ## ⛔ Owner:`) reports **`fkit-query` and `fkit-team`**. The defeating prose is `claude/skills/fkit-team/SKILL.md` — *"The `⛔ Owner:` banner at the top of every skill is now a courtesy…"*. **23 of 25** skills carry a banner. The report's strongest argument stands, first-hand.
- **D1–D4 all reproduce as stated.** D1: `claude/scaffold/CLAUDE.md` producer row lists four skills, omits `/fkit-task-brief`, which `skills_for_role(producer)` holds. D2: two skills lack banners, doc says one. D3: `skills_for_role()` is at line **48**, `architecture.md` cites `:35` (inside the ADR-033 comment block). D4: checklist says `FOUR`; `test/skill-ownership-hook.test.js` self-declares *"OWNED is a maintained MIRROR of `skills_for_role()`, not derived from it"* — a fifth mirror.
- **The citation-resolution audit is correct in all five rows.** Three DEAD (`fkit-coder.md:103` → the `fkit-plan-task` bullet; `:190-191` → *"Test your changes."*; `fkit-producer.md:95-96` → *"Write task briefs, not code."*), one DRIFTED one line (`fkit-producer.md:37-38` → the assertion sits at 38-39), one HOLDS with its quoted phrase correctly removed (`universal-rules.md:7` now reads *"Only the producer may invoke them"*; the ADR-025 phrase survives nowhere in the live surface).
- **`0151` has landed** (`ai-agents/tasks/done/0151-…`) and root `CLAUDE.md` names `claude/skills-for-role.sh`, in unmanaged prose above the `begin-rules` marker.
- **The budget reproduces exactly.** Replaying `emit_block()` → **3570 B** / `RULES_MAX=4096` → **526 B** headroom, **87.2 %**, **126 bytes** usable against the ≥400 B target. `node --test test/rules-block-budget.test.js` → **3 pass**. The report presents 91.1 % only as the stale prior reading, as required.
- **ADR-036's number is free.** Highest on disk `adr-035`; no in-flight `ADR-036`/`ADR-037` in any brief, ledger, sprint plan or report; `git ls-tree` over all three non-`main` branches and `origin/main` → highest `adr-035`. `node --test test/adr-number-uniqueness.test.js` → **14 pass**.
- **ADR-036 matches the report on every item checked except R2, R4, R5 and R6.** Both signed scoping calls are present and marked as signed (the bare token, clause 4(a); `test/` inside the live surface, clause 5). The live-surface vs dated-record boundary is declared. **The honest limit is in the ADR text**, in §Consequences, flagged *"stated here, in the ADR text, not in a footnote"* — not a footnote. Counts agree (21/16, checklist names 5, 14 Tier-C, *"4 of 6 historical classes, 0 of 4 current defects"*).
- **The recommendation is honest and unsoftened.** The tradeoff survives verbatim — *"It makes the **inventory** mechanical, not the **sweep**."* Part 6 states **NO** for `0036` (site already registered, content went false) and **NO** for all four current defects. Not softened.
- **Part 7's discrepancy is accurately reported.** The vault says *"missed **four system prompts**"*; the brief and `sprint-2.md` say three. `0124`'s folder holds only `brief.md` and `review.md` — no `worklog.md`, as stated.
- **Tier arithmetic holds:** 3 + 4 + 14 = 21. The inputs are what is incomplete, not the sum.
- **Brief step 5 (no implementation) — clean.** No skill, agent definition, test, script, board, convention page or vault file written; nothing moved; nothing committed.

## Disproven — do not chase

- **Codex reported `test/adr-number-uniqueness.test.js` as 6 pass / 8 fail.** A sandbox artifact — eight
  fixture tests call `mkdtempSync` and hit `EPERM` under `--sandbox read-only`. In my environment it is
  **14 pass**, matching the worklog. The worklog's claim is correct.

## Re-litigates settled decisions (suppressed)

Nothing suppressed. No Round-1 finding re-raises an ADR-036 *"Re-raise only if"* condition or an accepted
residual. **Note for future rounds:** R3 does **not** trip ADR-036's residual *"re-raise if a registered
site is found carrying false ownership prose and someone proposes this ADR should have caught it"* —
R3 does not claim A-i should have caught it. R3 is that the **report's Part-3 defect census is
incomplete**, which is a different object.

## Per-step verdict — the brief's five verification steps

| # | Step | Verdict |
|---|---|---|
| 1 | Dated report in `reports/`, **complete** inventory, file + anchor per site | ⚠️ **PARTIAL** — report is dated, well-anchored, every row I checked is real. **The inventory is not complete** (R1). |
| 2 | Each approach: what it catches **and what it still misses** | ✅ **PASS** — A-i, A-ii, B, C, each with an explicit, substantive blind spot. Clears the *"an approach with no stated blind spot has not been examined"* bar. |
| 3 | One recommendation with its main tradeoff, plus whether an ADR is required | ✅ **PASS** — build A-i, defer A-ii, demote the checklist; tradeoff stated verbatim and repeated in the ADR; ADR required, argued (a new fact of record gets a new home), and written. |
| 4 | Validated against the known misses — *"would it have caught them?"* | ✅ **PASS** — per instance, six rows, both **NO**s stated plainly and not softened. The brief's *"single most useful sentence"* is delivered. |
| 5 | **No implementation** | ✅ **PASS** — verified against the working tree. |

## Ruling on the new citation form (`@2026-08-02:NNN`) — LEGITIMATE

**It is a genuine extension of what `0160` and ADR-035 already ruled, not a workaround. No conflict.**

- `0160`'s ruling report states *"Line numbers are for findings against a revision. Names are for
  cross-references into living documents."* The report uses coordinates **only** in the drift audit and
  the inventory's anchor column — both findings against a revision. Compliant.
- `0160`'s rider: *"**Never cite a line number naked.** Pair every `path:NNN` with a quoted fragment or
  the heading it…"* Every `@2026-08-02:NNN` here carries its quoted phrase. Compliant.
- ADR-035's form — heading and quoted phrase, tasks by folder ID — is followed throughout.
- **What it adds:** an explicit date stamp on the coordinate, making staleness declared rather than
  discovered. `0160`'s own report already dates its measurements (§*"Measurement — 2026-08-01"*); this
  generalises that practice into the citation itself. Additive, and it directly serves a report whose
  subject is citation drift.
- Codex reached the same conclusion independently.

**Follow-up to name:** this form belongs in **task `0171`** (`durable-citation-anchors` convention
page), which is `0160`'s follow-up 1 and is open in the backlog. Recommend the producer pass
`0142`'s §0 to `0171` as an input. **Not a defect, and not this task's to write.**

## Convergence call

**Round 1 — no re-litigation, all seven findings novel.** Recommend **act, not closeout.**

The investigation's *reasoning* is strong and largely verified: the option analysis, the honest limit,
the budget, the citation audit and the historical-validation table all hold up under an independent
pass and a model-diverse adversarial pass. **The defect is concentrated in the deliverable the brief
made primary** — the inventory — plus three internal inconsistencies (R2, R4, R6) and one missed live
defect (R3).

R1 and R4 together mean **ADR-036's clause 5 boundary and its "21 sites / 16 classes" figure are both
known-wrong on the day they were written**, and the follow-up build task would be scoped from them.
R2 removes the stated *mechanical* reason for the repair-before-guard sequencing — the sequencing may
still be right on the owner's recorded ground (*"do not let the build quietly repair its own corpus"*),
but the ADR should not carry a false mechanism as its justification.

None of this overturns the recommendation. **A-i remains the right call** — and R1 is, awkwardly, further
evidence for it.

## Convergence call — Round 2

**Not a loop. All six findings are novel; none re-litigates a settled tradeoff or an accepted
residual.** Recommend **act, not closeout** — but the shape of the act is narrower than Round 1's.

**What Round 2 settles in the work's favour.** The trigger-(e) round is, on its own terms, **good
work**: a fuzzy predicate specified concretely enough to build, its cost measured **before** the spec
shipped, the rejected alternative priced honestly at 6-vs-1 and rejected on a ground that verifies in
the tree, and the spec block genuinely byte-identical across both documents. Every number I could
re-derive, I re-derived, and it matched. **R2's, R3's, R4's, R5's, R6's and R7's fixes all hold.**

**What blocks.** **R1's fix is not complete.** The corrected inventory still misses a live-surface
ownership-fact site, and the miss is not incidental — it is **the exact shape ADR-036 tells a builder
has no live instance**. That is the third consecutive sweep of this surface that came back confidently
short (~19 → 21 → 38 → ≥39), and the second time an independent pass found what the author's own
"completed" sweep did not. **R12 is the mechanical fingerprint of it**: the enumeration that produced
the inventory (88) never matched the enumeration that priced (e) (89), on the same declared boundary,
on the same day, in adjacent rows of the same table.

**Where the finding cuts, and where it does not.** It does **not** overturn the recommendation, the
ADR's decision, or trigger (e). If anything R8 is further evidence for both the no-hard-count rule and
for (e) itself. What it overturns is a **completeness claim**, and completeness claims are exactly what
this ADR's own thesis says must never be asserted from a remembered sweep.

**A pattern worth naming before it recurs.** R10 is the **second** untrue mechanism attached to the same
D4 sequencing note: Round 1 removed *"the guard ships red on day one"*, and its replacement — *"clause 2
deletes the `FOUR`, so the build resolves D4 itself"* — is also false, because the same checklist is
duplicated byte-for-byte in a second file. Both times the mechanism was asserted, not measured. **The
sequencing itself has been fine throughout; it rests on the owner's verbatim ruling and needs no
mechanism at all.** Recommend the third revision simply carry no mechanical claim.

**Suggested minimum for a clean close:** register the missed site and re-open the *"no live site has
that shape"* sentence (R8); pin (b)'s token-boundary rule in both documents and either drop (c) or
give it a meaning (b) does not already have (R9); withdraw the D4 note and widen the repair scope to
`claude/fkit-claude.sh` (R10); correct the §1.5 membership (R11); reconcile 88 (R12); fix the Results
denominator (R13). **None of these touches the decision, the options analysis, or (e)'s specification.**

## Convergence call — Round 3

**Not a loop, and the round is close to clean.** Both Round-3 findings are novel and neither
re-litigates a settled tradeoff, an accepted residual, or an ADR-036 *"re-raise only if"* condition.
**Recommend CLOSEOUT with R14's qualifier applied — not a fourth review round.**

**What Round 3 settles, and it is most of the task.** Every structural ruling the owner made was applied
correctly and every figure behind it re-derives on an independent reimplementation. **The re-scoped (c)
is sound**: it closes a live hole at a measured cost of zero, with a 633-character margin, using a
window it inherited rather than tuned — and I priced the rejected alternative myself at **84 of 89
files** to confirm the role-name requirement is doing the work claimed. **The inventory is acceptable**:
39 rows across 21 classes over 61 fact-site files, 22 declared non-fact hits, 83 of 89 triggered, and
**the 6 untripped files opened and read by both reviewers with the same answer**. The D4 note carries no
mechanism; the licence is withdrawn with no exception clause anywhere; the shared spec block is
byte-identical for the first time across a round.

**Three things this round did that are worth naming, because they are the opposite of the failure under
investigation.** An unknown was **recorded as unknown** (R12's cause) rather than back-fitted to a
plausible mechanism. A licence was **withdrawn** rather than annotated with its counter-example. And a
clean sweep was **refused as evidence of completeness** by its own author — a refusal R15 has now made
load-bearing, since two independent reimplementations of that very sweep disagree with its published
count while confirming its conclusion.

**What R14 is, stated exactly.** It is the same class as R11 and R13 — a figure whose basis moved and
was not restated — but it is now a **qualifier on four sentences with no substance change**, and the
report already applies exactly that qualifier correctly in three other places. **It changes no
decision, no price, no registry entry and no completeness claim.** Blocking a third time on it would
cost more than it buys.

**A pattern that has now closed.** Rounds 1 and 2 each found a *substantive* incompleteness in the
primary deliverable — 17 rows, then a live-surface fact site of the exact shape both documents ruled
out. **Round 3 found neither.** Two independent adversarial passes swept the full declared surface by
two separately-written implementations and returned the same answer: **no unregistered ownership-fact
site remains.** That is not a completeness proof — ADR-036 is right that it cannot be — but it is the
first round where the inventory survived the attack that broke it twice.

## Response — round 1 (author: fkit-architect)

> **Note on section ownership.** `0142`'s change surface is documents, not source, so the author under
> review is the **architect**, not the coder. This section is that author's response and occupies the
> ledger's author-response slot. **`/fkit-process-stateful-review` was NOT run** — it is the coder's
> skill and the ADR-018 hook denies it to this role. Its *method* was applied by hand: every finding
> verified first-hand against the tree, classified, then the owner-ruled correction applied.
> **The *Reviewer findings* section above is untouched.**

**Owner ruling relayed by the driver: fix round on all seven. No finding was disproven; all seven are
applied.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT — and worse than reported** | Defect | Re-ran the sweep over the **full** declared live surface: 88 files enumerated, all four triggers applied, **every hit opened and read**. Inventory goes **21 rows / 16 classes → 38 rows / 21 classes** (+17 rows, +5 classes — `conventions/` both homes, the whole `scaffold/ai-agents/` tree, `PROJECT.md`, both working-tree `README.md`s, `fkit-claude-init.sh`'s printed roster, the scaffold `CLAUDE.md`/`AGENTS.md` unmanaged prose, `test/dual-home-parity-exceptions.mjs`). New report **§0.1** states plainly, before Part 1, that the first pass was incomplete and exactly why. **ADR-036 now hard-codes NO count** — the registry is authoritative; a report count is a dated measurement. | ✅ done |
| R2 | **CORRECT** | Defect | Verified: the tripwire checks registration only (report §4.1, ADR clause 3) and `claude/skills-for-role.sh` is registered as **A1**, so a false `FOUR` inside it cannot make it red. **The mechanism is withdrawn in both documents** (report §D4 correction block; ADR §Consequences). Sequencing is unchanged and now rests on the owner's actual ground — *"do not let the build quietly repair its own corpus."* Added one **true** mechanical note in the other direction: clause 2's demotion **deletes** the `FOUR` enumeration, so the build resolves D4 itself — a scoping note for the repair task. | ✅ done |
| R3 | **CORRECT** | Defect | Verified first-hand: root `CLAUDE.md` *"turned off, **invisible** and unrunnable"* (`@2026-08-02:32`) vs `fkit-team/SKILL.md` (*"Visible-but-blocked, not invisible-and-blocked"*), `claude/README.md`, `architecture.md`, `claude/scaffold/CLAUDE.md`, and **ADR-018 §Decision 5** (visibility recorded as an accepted cost). Added as **D5**; Part 3 retitled *five live defects*; Part 6 score **0 of 4 → 0 of ≥5**; repair follow-up rescoped to five. Also flagged, **without asserting it false**: `PROJECT.md`'s weaker *"turned off"*. | ✅ done |
| R4 | **CORRECT** | Defect | Verified: the checklist names `claude/README.md` as one of the four mirrors; clause 5 matched nothing for it; the appendix's live-surface 10 **included** it (re-measured — still 10, and `claude/README.md` is one of them). **`claude/README.md` is now inside the live surface** in both documents, together with `PROJECT.md`, `ai-agents/README.md`, `ai-agents/tasks/README.md` and the whole `claude/scaffold/ai-agents/` tree. | ✅ done |
| R5 | **CORRECT** | Defect | Verified: `UNIVERSE` (`test/skill-ownership-hook.test.js@2026-08-02:295`) holds **24 of 25**; the file's own comment at `@2026-08-02:318` says `fkit-sprint-ship-loop` is absent. Trigger (b) now binds, in **both** documents in the **same wording**, to *"the skill universe — the skill directories on disk, `claude/skills/*/`, enumerated at test time"*, which covers all 25 and cannot go stale. ADR adds the general rule: a control against hand-maintained lists must not source its trigger set from one. | ✅ done |
| R6 | **CORRECT** | Defect | Unified on **three** (`0036`, `0124`, `0151`) in both documents, with the promotion of `0151` stated rather than smoothed (§0). Knock-on: option C is now *"a **fourth**, better checklist"*. *(Ledger says the report said "twice" in four places; `grep -c` on the round-1 file returns three. Recorded in the report; does not change the finding.)* | ✅ done |
| R7 | **CORRECT** | Defect | Re-measured with the named command: **101** (was 98 first pass, 100 at review time). All three readings and the reason for the drift are now in §1.1 and the appendix — this report, ADR-036 and this ledger each contain the token, and **all three are dated records**, so the **live-surface subset stayed at 10 all day.** The corpus growing while the boundary held is now used as evidence *for* the declared boundary. | ✅ done |

### Not a finding — recorded so it is not re-chased

- **The `@YYYY-MM-DD:NNN` citation form** — reviewer ruled LEGITIMATE, Codex agreed, **owner ruled**:
  pass the report's **§0** to task **`0171`** (`durable-citation-anchors`) **as an input**. Done — named
  in report §0 and §8 as a follow-up input. **Not folded into ADR-036. `0171`'s brief was not edited**
  (producer's file). §0 itself is unchanged.
- **Codex's `adr-number-uniqueness` "6 pass / 8 fail"** — disproven by the reviewer as a read-only
  sandbox `mkdtempSync` EPERM artifact. **The worklog was right and was not touched.**
- **Everything the review verified as correct was left alone** — the grep-defeated-by-prose centrepiece,
  D1–D4, all five citation-audit rows, `0151` landed, the budget block (3570 B / 526 B / 87.2 % /
  126 usable bytes / 3 tests pass), ADR-036's number, Part 6's unsoftened NOs, Part 7, and 3+4+14=21
  *(now 3+4+31=38)*.

### ⚠️ New, found by the corrected sweep — NOT a review finding, and NOT settled here

> **SUPERSEDED — the owner ruled this on 2026-08-02.** Left in place as the round-1 record. The ruling
> and its measured cost are in **Response — round 2** below.

**Two genuine ownership-fact sites trip none of clause 4's four triggers**: `ai-agents/README.md`
(*"via the `task-done` / `task-cancelled` skills"* — bare suffixes) and `claude/scaffold/AGENTS.md`
(*"its own vendored `query` skill"*). Both name skills by bare suffix and attribute them to a **role
name**, which is not a skill. Both are **on** the registry, so the inventory covers them; the
**tripwire** would miss a future site written the same way. **This is a second blind spot in A-i.**

The two candidate fixes both change a trigger set the owner signed on 2026-08-02, so **neither is
applied**. Recorded loudly: report §1.6 and §4.1 *blind spot #2*, and **ADR-036 §Residual risks as an
OPEN item with no ruling yet** — explicitly *not* framed as "re-raise only if". **Whoever builds A-i
must not treat clause 4 as complete.**

### Scope kept

⛔ **No implementation.** No `test/skill-ownership-sites.mjs`; no edit to `claude/skills-for-role.sh`,
`claude/fkit-claude-init.sh`, any test, skill or agent definition. **None of the five live defects was
repaired** — still the separate follow-up. No brief filed, no task moved, nothing written to
`ai-agents/wiki-vault/`, no commit, no push. Files changed this round: the report, ADR-036,
`worklog.md`, `plan.md`, and this section.

## Response — round 2 (author: fkit-architect)

**Narrow, single-purpose round. One thing only: the owner ruled round 1's open residual.** The
*Reviewer findings* section is untouched; no round-1 verdict was reopened; nothing the review verified
as correct was rewritten.

### The ruling, recorded verbatim in substance

> **Add a fifth trigger — a role name beside an ownership verb.**

Put to the owner via `AskUserQuestion` in the live `fkit-lead` session, 2026-08-02, against the
alternative of broadening trigger (b) to bare skill suffixes.

**The owner's reasoning, recorded because it is the load-bearing part:**

1. **(e) catches the shape rather than the vocabulary**, so it also catches a site naming a skill in
   some form nobody has thought of yet — including the two live specimens (`ai-agents/README.md`,
   `claude/scaffold/AGENTS.md`).
2. **The accepted cost, in the owner's own framing:** *"role name near an ownership verb"* is a
   **fuzzier predicate than a token match, so it will produce false positives** — which **the
   registry's excepted-with-a-reason mechanism is already built to absorb.** Recorded as an accepted
   tradeoff, not a hidden cost.
3. **Broadening (b) was rejected** because `review`, `status`, `query` and `team` are extremely common
   English words; the false-positive rate on a prose corpus would be high, with every hit needing a
   written reason to silence.

### What was done

| Step | Outcome |
|---|---|
| **Specify (e) concretely enough to build** | Role names = basenames of `claude/agents/fkit-*.md` (**disk-derived at test time**, per 4(b)'s discipline) **plus their bare forms**; ownership verbs = a **closed 41-word list** in five groups; window = **80 characters on the file with whitespace runs collapsed to one space**. Full text in ADR-036 clause 4 and report §4.1. |
| **Identical wording in both documents** | The specification block is **byte-identical** in ADR-036 clause 4 and report §4.1 — **5191 characters, diffed programmatically**. R5's failure mode (report and ADR disagreeing on a load-bearing spec detail) does not recur. |
| **Measure the false-positive cost before shipping the spec** | Live surface re-enumerated: **102 paths, 89 non-empty** (13 empty `.gitkeep` placeholders skipped). **70 of 89 trip (e); 9 trip (e) and none of (a)–(d).** Of those 9: 2 are §1.6's genuine fact sites, 1 is already §1.5 noise → **6 new declared-non-fact-hit entries, and all 6 are false positives.** Registry noise half **15 → 21 files**. **Affordable — not returned as `NEEDS-DECISION`.** |
| **Re-check both specimens** | **Both caught, by their load-bearing clause, not incidentally.** `ai-agents/README.md` — *"Maintained by the **fkit-wiki agent**"*, gap **10**. `claude/scaffold/AGENTS.md` — *"Writes stay exclusive to the `fkit-wiki` agent"*, gap **9**. The second **crosses a hard wrap**, which is why the window is measured on whitespace-collapsed text and **not** per line — a same-line predicate would have missed the very specimen (e) exists to catch. |
| **Update the residual** | ADR-036's OPEN item is rewritten to **ruled + specified + priced**, with a real *"re-raise only if"*. |

### The warning was NOT removed — it was narrowed, because (e) does not fully close the hole

**A residual blind spot survives (e): verbless attribution.** (e) needs an ownership verb near the role
name. A site attributing a skill to a role by **possessive or apposition alone** — *"`task-done`: the
producer's"*, or a two-column table pairing a role with a bare skill suffix — trips nothing.
**No live-surface site has that shape on 2026-08-02** (the sweep of all 89 files found exactly two fact
sites tripping nothing, and (e) catches both), but the form is constructible. ADR-036 therefore says:
**whoever builds A-i may treat clause 4 as complete for verb-carrying attribution, and must not treat
it as covering verbless attribution.**

### Scope kept

⛔ **Still no implementation.** No `test/skill-ownership-sites.mjs` and no test of any kind was created;
no edit to `claude/skills-for-role.sh`, `claude/fkit-claude-init.sh`, any skill, or any agent
definition. **None of the five live defects was repaired.** No brief filed, `0171`'s brief untouched,
no task moved, nothing written to `ai-agents/wiki-vault/`, no commit, no push. The measurement ran from
a **read-only script in the session scratchpad**, outside the repo. Files changed this round:
ADR-036, the report, `worklog.md`, and this section.

## Response — round 3 (author: fkit-architect)

> **Section ownership, unchanged.** `0142`'s change surface is documents, so the author under review is
> the **architect**. **`/fkit-process-stateful-review` was NOT run** — coder's skill, ADR-018 hook
> denies it to this role. Its method was applied by hand: every finding verified first-hand against the
> tree this round, classified, then the owner-ruled correction applied. **The *Reviewer findings*
> section above is untouched.**

**Owner ruling relayed by the driver: fix round on all six, plus two structural rulings — re-scope (c),
and re-open ADR-036's licence sentence rather than annotate it. No finding was disproven; all six are
applied.** Every number below was **re-measured on 2026-08-02 in this round**, from a read-only script
in the session scratchpad, outside the repo.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R8 | **CORRECT — and the aggravations are correct too** | Defect | Verified first-hand: `claude/scaffold/ai-agents/knowledge-base/PROJECT.md@2026-08-02:1-2` reads *"The fkit **producer** replaces this file during project initiation (**its** initiate-project skill)"*; `skills_for_role(producer)` holds `fkit-initiate-project` (`claude/skills-for-role.sh@2026-08-02:51`), so the attribution is **true** — an unregistered **fact site**, not a sixth defect. **Trips none of (a)–(e), re-measured:** no `skills_for_role`; `initiate-project` is a bare suffix, not a `claude/skills/*/` name; no `⛔ Owner:`; **nearest ownership verb 839 chars away**, whitespace-collapsed. Registered as **C32**; row count **38 → 39**, classes **21** (C16's class); Tier C **31 → 32**; fact-site files **61**. §1.6 *"two"* → **three**. §0.1 rewritten to say **plainly, first, that this is the SECOND time the artifact reproduced the defect it investigates**, with all three named aggravations — it ships into every consuming project, it is the scaffold twin of C16 while every other twin got its own row, and registered **C31**'s `reason` string names `/fkit-initiate-project` and was quoted from. **ADR-036's *"No live-surface site has that shape"* is withdrawn as FALSE** (see the structural ruling below). | ✅ done |
| R9 | **CORRECT — and my round-2 self-diagnosis was wrong; the reviewer's is right** | Defect | Re-measured: **(c) as it stood adds 0 files beyond (b) at every window** — same-line / 20 / 40 / 80 / 200 / unbounded all give **73 of 89** tripping ≥1 of (a)–(d). **(c) ⊆ (b): a no-op.** The clause that moves numbers is **(b)**: bounded **72**, substring **74**, and the flip file is exactly `test/rules-block-budget.test.js` — the disagreement I misattributed to (c). **Both documents now carry ONE byte-identical block** (12 670 chars, `diff` → no output) pinning **the token-boundary rule for (b), (c) and (e) alike** — case-insensitive, bounded by `[^A-Za-z0-9_-]`, whole-token, never substring — and **(c) is re-scoped per the owner's ruling** to *a bare skill suffix within 80 characters of a role name*, with **its own disk-derived vocabulary, its own window, and its own measured price, in the same shape (e) got**. | ✅ done |
| R10 | **CORRECT** | Defect | Verified by `diff`: the 12-line FOUR-mirror checklist is **byte-identical** in `claude/skills-for-role.sh@2026-08-02:12-23` and `claude/fkit-claude.sh@2026-08-02:239-250` — **no output**. ADR clause 2 demoted only the first, so a compliant build left the false `FOUR` live. **The D4 note now carries NO mechanism at all** — both the round-1 mechanism and its round-2 replacement are quoted and withdrawn in report §D4 and ADR §Consequences, and the sequencing rests on the owner's verbatim ruling alone. **Repair scope widened to `claude/fkit-claude.sh`** in report Part 8 and ADR clause 2. **§1.2's A3 row and §1.3's Tier-A claim are corrected** — *"Cannot drift; they read the function"* is false for A3, which carries 12 lines of hand-maintained mirror prose; §1.4's mirror hunt now records that it walked past a byte-for-byte duplicate of the checklist it was auditing. | ✅ done |
| R11 | **CORRECT — including that the errors cancel** | Defect | Re-measured with the pinned boundary rule: `test/rules-block-budget.test.js` trips **no** (a)–(d) — it matched only as a substring (`fkit-reviewer` ⊃ `fkit-review`) — and `claude/skills/fkit-status/dashboard.sh`, the **only** non-`SKILL.md` file under `claude/skills/` on 2026-08-02, trips **(b)** on `/fkit-status`, asserts nothing, and is covered by neither C13/C14 (both `SKILL.md`-only) nor §1.5. **§1.5 membership swapped; the list is still exactly 15**, and both errors are stated rather than absorbed. **Day-one registry noise is 22, not 21** — 15 + the **7** that (e) adds; the re-scoped (c) adds **none**. | ✅ done |
| R12 | **CORRECT — and 88 is withdrawn, not reconciled** | Defect | Re-enumerated clause 5 exactly: **102 paths · 89 non-empty · 13 empty `.gitkeep`**, reproducing the appendix's round-3 figure. **88 matches neither and does not reproduce; it is withdrawn.** Part 1's method line, §0.1 and the appendix all now read 89, with the divergence **stated, not smoothed** per §0, and with the material consequence named: the 88-file sweep is the one that produced the 38-row inventory and missed C32. **Codex's mechanism (102 − 14 individually-named clause-5 entries = 88) is recorded as plausible but UNPROVEN** — round 2 kept no file list, so the cause cannot be settled from the record. Recorded as unknown rather than guessed. | ✅ done |
| R13 | **CORRECT** | Defect | Verified: 60 + 15 = 75 > 73. *"60 of those"* mislabelled its denominator. Part 1's Results is now a table that closes: **89 files · 73 trip ≥1 of (a)–(d) · 58 triggered fact-site files + 15 noise = 73 ✓ · 3 untriggered fact sites → 61 fact-site files · 39 rows across 21 classes.** The 2 → 3 is R8. The mislabelling is quoted and corrected in place, and the row-count-vs-file-count distinction is stated because the two are not derivable from each other. | ✅ done |

### The two structural rulings, applied

**1. (c) re-scoped — the full spec, its price, and proof it catches R8's site.**

> **(c) — a bare skill suffix within 80 characters of a role name.** Bare suffixes = the
> `claude/skills/*/` directory names with `fkit-` stripped, **disk-derived at test time** (25 on
> 2026-08-02). Role names = **the same disk-derived set (e) uses** — `claude/agents/fkit-*.md`
> basenames plus bare forms. Window = **80 characters of the file with whitespace runs collapsed to one
> space**, gap between the two matches, either order — **the same window and basis as (e)**, so the two
> cannot drift. Matching = the pinned token-boundary rule. **A role name is REQUIRED**, which is the
> entire difference between this and the bare-suffix broadening of (b) the owner rejected.

**Measured cost, 2026-08-02, over the same 89 files (e) was priced against: 52 of 89 trip (c); exactly
1 trips (c) and none of (a), (b), (d), (e) — and it is C32, a genuine fact site. ZERO false positives,
ZERO new registry noise.** The margin is wide both ways: the specimen sits at gap **51** (29 inside the
window); the nearest would-be false positive is `test/skill-frontmatter.test.js` at **685** (605
outside), then `test/harness.mjs` at **2607**. **Every window from 51 to 684 gives the identical
result** — 80 is safe, not tuned. **Proof it catches R8's site:** `producer` ends at collapsed offset
62, `initiate-project` begins at 113 → gap **51** ≤ 80. **The spec is right; the claim did not have to
be softened.** Nothing is lost by the re-scope — full skill names beside role names are still caught
by (b).

**2. ADR-036's licence sentence — RE-OPENED, not annotated.** *"A builder may treat clause 4 as
complete for verb-carrying attribution"* is **withdrawn entirely**, with the sentence it rested on
quoted so the withdrawal is auditable. The owner's reasoning is recorded in the ADR because it is the
general rule: **a licence whose stated basis is disproven must not survive by having a counter-example
noted beside it — that is the "confidently incomplete" pattern one level up, and it is how the
FOUR-mirror checklist failed three times.** What stands in its place: the hole is closed **by a clause**
(the re-scoped (c)), and the ADR now says, with **no exception clause**, *whoever builds A-i must NOT
treat clause 4 as complete*.

### The possessive/appositive re-sweep — R8 is the only one

**Method, run 2026-08-02:** (i) every role-name occurrence across all 89 live-surface files with a skill
name (**full or bare**) within 100 characters and **no** ownership verb within 80 — the R8 shape,
generalised — giving **282 instances across 49 files**, each file cross-checked against §1.2 and §1.5;
and (ii) the complement — with all five triggers, **83 of 89 files trip at least one**, and the
remaining **6 were opened and read**.

**Result: nothing beyond R8.** Every one of the 49 files was already registered as a fact site or a
declared non-fact hit **except C32**. Three registered non-fact hits were re-read to confirm the
classification holds: `claude/scaffold/…/wiki-vault/schema.md` (`wiki` the path, not the role),
`claude/scaffold/…/conventions/evidence-before-assertion.md` (an enforcement list; the twin's role
attribution was dropped in the de-fkit-ified rewrite — the report's own §1.5 example), and
`test/turn-completion-hook.test.js` (an `agentType` fixture). The 6 untripped files —
`claude/askuserquestion-marker-hook.sh`, `claude/scaffold/ai-agents/wiki-vault/index.md` and `log.md`,
`test/askuserquestion-marker-hook.test.js`, `test/harness.mjs`, `test/skill-frontmatter.test.js` —
**none attributes a skill to a role.**

⚠️ **This result is recorded as a dated measurement and is explicitly NOT a completeness claim, in
either document.** Two sweeps of this surface have already come back confidently short in twelve hours;
a third clean sweep is evidence, not a guarantee. Both documents say so in those words.

### Knock-on corrections not separately findable, stated rather than folded in silently

- **(e)'s day-one cost re-states 6 → 7 files and noise 15 → 22.** This is R11's accounting correction —
  round 3 discounted `test/rules-block-budget.test.js` as *"already §1.5 noise"* and §1.5 had it
  wrongly. **(e)'s own measurements are untouched and all reproduce** (70 trip (e); 9 (e)-only; both
  specimen gaps 10 and 9).
- **The full-form-only alternative re-prices 6 → 1 as 7 → 2.** Re-measured: dropping the bare forms,
  **5 of the 7 vanish**; the survivors are `test/converge-contract.test.js` and
  `test/rules-block-budget.test.js`, both at gap **27**. **The rejection and its reasoning are
  unchanged** — the review ruled the pricing honest and the frontier-move sound.
- **The hard-wrap nit is fixed.** The block said *"`exclusive` ends one line"*; the word ending
  `claude/scaffold/AGENTS.md@2026-08-02:19` is `the`. Corrected to name `the` and `` `fkit-wiki` ``.
  **The substance — that whitespace-collapsing is load-bearing — is unchanged and re-verified.**
- **Part 6 gains row 8** — *would A-i have caught this report's SECOND incomplete pass?* Answer split
  and unsoftened: **YES for the tree** (C32 trips the re-scoped (c), the tripwire would have gone red)
  and **NO for the report** (nothing in A-i stops an author writing *"no live site has that shape"*
  next to it). The score line is unchanged at **4 of 6 historical classes, 0 of ≥5 current defects**.

### Left alone exactly as the review directed

**Trigger (e) is NOT reworked** — only the false sentence beside it is gone. R1's nine named sites,
§0.1's three unopened areas, the no-hard-count rule, R2's withdrawal, **R3's restraint on `PROJECT.md`'s
weaker *"turned off"***, R4, R5, R6/R7 (**101** re-measured this round, live-surface subset **10**,
both unmoved), 3+4+31=38 *(now 3+4+32=39)*, C17–C28 = 4 READMEs + 8 convention pages, §1.5 expanding to
15 names, and the resolved self-reported residual 3 — **all untouched.** **Neither disproven Codex
finding was acted on** (the 21-classes claim and the 131-bare-token claim).

**Nothing in this round was applied against my own judgement, and no ruling rested on a false premise** —
every one of R8–R13 verified first-hand before a word changed.

### Scope kept

⛔ **Still no implementation.** No `test/skill-ownership-sites.mjs` and no test of any kind created; **no
edit to `claude/skills-for-role.sh`, `claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`, any skill,
or any agent definition.** **No live defect repaired** — still the separate follow-up, now widened.
**No brief filed; `0171`'s brief untouched.** No task moved, nothing written to `ai-agents/wiki-vault/`,
no commit, no push. All measurement ran from a read-only script in the session scratchpad, outside the
repo. Files changed this round: the report, ADR-036, `worklog.md`, `plan.md`, and this section.

## Response — round 4 (author: fkit-architect)

> **Section ownership, unchanged.** `0142`'s change surface is documents, so the author under review is
> the **architect**. **`/fkit-process-stateful-review` was NOT run** — it is the coder's skill and the
> ADR-018 hook denies it to this role. Its method was applied by hand: the finding verified first-hand
> against the tree this round, classified, then the owner-ruled correction applied. **The *Reviewer
> findings* section above is untouched.**

**Owner ruling relayed by the driver: APPLY R14; ACCEPT R15 as a residual and do NOT fix it.** Every
figure below was **re-measured on 2026-08-02 in this round**, from a read-only script in the session
scratchpad, outside the repo — the five triggers reimplemented from the pinned spec block, over the
clause-5 surface enumerated from scratch (**102 paths · 89 non-empty · 13 empty `.gitkeep`**, reproduced
again this round).

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R14 | **CORRECT — and every figure in it reproduces exactly** | Defect | Re-measured on the **current** trigger set: **(a)–(d) bounded = 76**, **substring = 77**, **(e)-only = 7** — R14's figures to the file. The three files (c) pulls in are exactly the three named: `claude/scaffold/AGENTS.md` (gap **14**), `claude/scaffold/ai-agents/knowledge-base/PROJECT.md` (gap **51**), `claude/scaffold/ai-agents/wiki-vault/schema.md` (gap **9**). **Four sentences corrected, no substance changed**, each reusing the qualifier the report already applies in three other places rather than inventing a form: §4.1's shared block (the 73/74 sentence, and the *"9 trip (e) and none of (a)–(d)"* sentence), §1.5's sweep line, and §1.6's C32 row. **The C32 row was the sharpest** — its closing *"It trips none of (a)–(e)"* taught a reader the opposite of the fix; it now says it tripped none of the set **as it stood in round 3**, and that on today's set it **does** trip (c) at gap 51. **Applied identically in ADR-036**; the shared block re-verified **byte-identical** (`diff` → no output, **13 869 characters / 14 020 UTF-8 bytes**). Knock-on qualifiers added, stated rather than absorbed: Part 1's Results blockquote, §4.1's registry-shape paragraph, blind spot #2, and three appendix rows. | ✅ done |
| R15 | **CORRECT — and ACCEPTED AS A RESIDUAL by owner ruling, not fixed** | Defect (low) | Not re-run and not re-typed. **Two independently-written reimplementations — the reviewer's and Codex's — both returned 291 across 50 against the published 282/49**, the extra file being `claude/fkit-claude.sh`, already registered as **A3**. **The conclusion is confirmed twice over: all 50 registered, nothing beyond C32.** The appendix row now **discloses the non-reproduction in place**, labelled an accepted residual rather than a correction, per the owner's ruling and per §0's *state, don't smooth* rule. **It is low precisely because the report already refuses to lean on that sweep** — §4.1's *"a measurement of one tree on one day by one author … It licenses nothing"*, and the task's self-reported residual 2, *"a proxy measurement, not a proof."* **R15 has now made that refusal load-bearing rather than rhetorical, and that is said in the report.** | ✅ recorded as residual |

### The severity dissent on R14 — recorded, not just the verdict

**Codex assigned R14 HIGH. The reviewer assigned MEDIUM and owns that severity.** The reviewer's stated
ground, recorded here because the dissent is part of the record and not only its resolution: the
registry (**61** fact-site files + **22** declared non-fact hits = **83**), **(c)'s price (zero false
positives)**, **(e)'s price (7 new entries)** and the **no-licence rule** are all correct and all
reproduce; what shifts is **bucket-attribution between (c) and (e)**, and **the totals close either
way**. My own re-measurement this round agrees on every one of those figures. **The owner ruled APPLY
on the MEDIUM reading, and no part of this round was applied against my judgement.**

### The arithmetic on both bases, since that is the whole of R14

| | four triggers, (c) as it stood | current set, (c) re-scoped |
|---|---|---|
| trip ≥1 of (a)–(d) | **73** (substring 74) | **76** (substring 77) |
| — of those, fact-site files | 58 | 60 |
| — of those, registry noise | 15 | 16 |
| fact sites tripping no (a)–(d) | 3 | 1 (`ai-agents/README.md`, caught by (e)) |
| (e)-only | 9 → 2 fact + 7 false positives | 7 → 1 fact + 6 false positives |
| **fact-site files** | **61** | **61** |
| **declared non-fact hits** | **22** (15 + 7) | **22** (16 + 6) |
| **trip ≥1 of all five** | **83 of 89** | **83 of 89** |
| **inventory** | **39 rows, 21 classes** | **39 rows, 21 classes** |

**Nothing a builder acts on moves. Only which clause pays for a file moves.**

### Left alone exactly as the review directed — not re-chased, not rewritten

The inventory (**39 rows / 21 classes / 61 fact-site files / 22 declared non-fact hits / 83 of 89**);
the **re-scoped (c)** and its **633-character stable interval**; the **84-of-89** price of the rejected
bare-suffix broadening; the **6→7 / 21→22** restatement; the **6** untripped files; **ADR-036's
no-licence stance**; **R12 recorded as UNKNOWN**; **C32's out-of-sequence number**; and every figure the
review verified in rounds 1–3. **Codex's *"bare token is 130, not 101"* was NOT acted on** — third
variant of a claim disproven twice; the report's literally-named command returns **101**, re-confirmed
by the reviewer this round.

### Scope kept

⛔ **Still no implementation.** No `test/skill-ownership-sites.mjs` and no test of any kind created; **no
edit to `claude/skills-for-role.sh`, `claude/fkit-claude.sh`, `claude/fkit-claude-init.sh`, any skill,
or any agent definition.** **No live defect repaired** — all five remain the separate follow-up. **No
brief filed; `0171`'s brief untouched.** No task moved, nothing written to `ai-agents/wiki-vault/`, no
commit, no push. All measurement ran from a read-only script in the session scratchpad, outside the
repo. Files changed this round: the report, ADR-036, `worklog.md`, `plan.md`, and this section.

---

## Closeout — 2026-08-02

**Terminal status: `closed-out`.**

**Final verdict — ✅ ACCEPTED. `0142` is complete as an investigation.** Three review rounds, both
reviewers every round, **Codex coverage FULL on all three** (`codex-cli 0.145.0`, `--sandbox
read-only`). **15 findings (R1–R15): 14 applied and re-verified, 1 (R15) accepted as a residual by
owner ruling.** Round 3 converged — *"the first round the inventory survived the attack that broke it
twice"* — and the reviewer recommended closeout rather than a fourth round. **No blocking finding
stands.** The brief's five verification steps: step 1 **PASS** (was PARTIAL in round 1; the inventory
is now judged acceptable by two independently-written enumerators), steps 2, 3, 4 **PASS**, step 5
**PASS** (no implementation, re-verified this round).

**What ships:** the report
(`ai-agents/knowledge-base/reports/2026-08-02-skill-ownership-fact-inventory-gap.md`) and **ADR-036**.
**Nothing was built and nothing was repaired** — that is the brief, not an omission.

## Accepted residuals (shared, do-not-re-litigate)

**Owner-disposed 2026-08-02 at closeout. Each carries a falsifiable re-raise condition.**

1. **R15 — the possessive/appositive sweep's published figure (282 instances / 49 files) does not
   reproduce.** Two independently-written reimplementations both returned **291 across 50**; the extra
   file is `claude/fkit-claude.sh`, **already registered as A3**. **The conclusion is confirmed twice
   over** — all 50 registered, nothing unregistered beyond C32. Disclosed in place in the report's
   appendix rather than re-typed. **Low precisely because the report never leaned on it**, and R15 has
   made that refusal load-bearing. **Re-raise only if** the sweep is ever cited as evidence that the
   inventory is *complete*, or if a re-run finds a qualifying file that is **not** registered.
2. **R12's cause is UNKNOWN and stays UNKNOWN.** The round-2 enumeration published **88** where clause 5
   reproduces **102 / 89 / 13**; 88 is **withdrawn as unreproducible**, not reconciled. Codex's
   mechanism — 102 minus the 14 individually-named clause-5 entries — is **plausible but unproven** and
   was **deliberately not adopted**, because round 2 kept no file list and back-fitting a plausible
   cause is the exact vice this report is about. **Re-raise only if** the round-2 file list is
   recovered, or a second enumeration of clause 5 returns 88 by a stated method.
3. **Residual 2 — a clean sweep is a proxy measurement, not a proof of completeness.** The report and
   ADR-036 refuse to convert any sweep result into a licence, and ADR-036 says with **no exception
   clause** that *whoever builds A-i must NOT treat clause 4 as complete*. **Do not re-raise** a
   proposal to restore a completeness licence from a sweep result. **Re-raise only if** the trigger set
   itself is changed — an ownership-fact site found tripping no trigger amends clause 4, exactly as (e)
   and the (c) re-scope did.
4. **C32 is numbered out of sequence, deliberately.** It belongs beside C16; appending it kept **every
   existing row's identifier stable** across revisions of a document whose rows are cited by identifier
   from this ledger and from ADR-036. The Class column carries the grouping. **Do not re-raise as
   untidiness.** **Re-raise only if** the inventory is ever regenerated wholesale, where renumbering
   costs nothing.
5. **The five live defects (D1–D5) are UNREPAIRED BY DESIGN.** Brief verification step 5 forbids
   implementation, and the owner's ruling is *"do not let the build quietly repair its own corpus."*
   They are the separate follow-up, and **A-i would catch none of them** — that limit is stated
   unsoftened in both documents. ⚠️ **D4's repair now requires touching TWO files, not one:**
   `claude/skills-for-role.sh` and `claude/fkit-claude.sh` carry **byte-identical** copies of the
   FOUR-mirror checklist (`diff` over the two 12-line ranges → no output), so a repair that touches only
   the first leaves the false `FOUR` live. ADR-036 clause 2 and report Part 8 are widened to say so.
   **Re-raise only if** a repair task closes D4 without touching both files.

**Recorded for the close:** **Codex coverage was FULL on all three review rounds.** No round was
degraded; no finding rests on a single reviewer where both were available.

## Coder response

_(coder-owned — not used on this task; `0142`'s author is the architect, whose response is above)_

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|

_(The shared **Accepted residuals** section sits above, immediately under §Closeout — five recorded,
owner-disposed 2026-08-02, each with a falsifiable "re-raise only if".)_
