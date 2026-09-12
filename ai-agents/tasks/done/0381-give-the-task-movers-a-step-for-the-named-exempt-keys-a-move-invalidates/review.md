# Review — 0381

Task: `ai-agents/tasks/done/0381-give-the-task-movers-a-step-for-the-named-exempt-keys-a-move-invalidates/brief.md`
File(s) under review: `claude/skills/fkit-task-done/SKILL.md` · `claude/skills/fkit-task-cancelled/SKILL.md` ·
`test/mover-exemption-step.test.js` (new) · `test/reference-integrity.test.js` · `test/prove-red.sh`
(this task's hunks only — `run_mover_step_suite()`, gate `0o`, mutations 33/34, the index count) ·
`…/0381-…/worklog.md`
Status: **closed-out** — set under ruling **AM3** (2026-09-12) after the round-4 fix and my own
red-proof. ⛔ **Read the closure honestly: there was NO eighth verification pass.** AM3 removed it
deliberately, so no independent reviewer saw the `R17` fix; every round-4 figure is my own measurement,
with a control run included because self-verification has no second reader. `R17` **fixed** at both
pinned sites (**AM1**); `R18` **accepted as a residual, not fixed** (**AM2**) — R14's sentence stays
unpinned and a two-sided revert of it still passes 17/17, which I re-measured rather than inherited.

⭐ **What round 4 found, stated as the reviewer stated it.** The **AL4 narrow pass (round 4, the
SEVENTH over this clause)** ran and the answer to the question it existed to ask was ⛔ **YES: a SEVENTH
instance existed** (`R17`) — **and, for the third time running, it was introduced by the previous
round's own fix** (`R13`'s, which is mine). It is a **FOURTH direction** of the same defect class: a
repair correctly returned to the producer, but **unconditionally**, dropping the attribution qualifier
the same paragraph names as its first binding rule. One further low finding (`R18`). All three round-3
fixes (`R13`, `R14`, `R15`) **verified landed and correct as far as they go**; the round-3 residual
(`R16`) untouched. ⚠️ **The reviewer's read, which the owner accepted:** *"this clause has reached the
point where each fix costs about one new instance."* ⛔ **Closing does not refute that** — it accepts the
risk of an eighth instance rather than disproving it. Round 4 was answered under **AM1–AM3**; round 3
under **AL1–AL5**; round 2 under **AJ1–AJ3** and **AK1–AK2**; round 1 under **AG1–AG4** and **AH1–AH3**
Coverage (round 4 — narrow; this field states THIS round's state, it does not amend round 3's):
**both reviewers measured** (ADR-042 D1) — Codex (read-only, `codex exec`, 106,275 tokens) read the
clause in both movers, the pin block, and the guard's scanned-set definition, and returned **one**
finding; **it is `R17`, and I had reached the same sentence independently before its output landed**
(raised by both, converged). I independently re-measured `npm run test:unit` (**914/914**),
`reference-integrity` (**22/22**), `mover-exemption-step` (**17/17**), both canonical clauses at
**52 lines** and the board-folded diff **empty**, `BLOCK_START`/`BLOCK_END`/`PROVE_IT` **1 each** per
mover, `missingCiter`/`targetIsBack` **0/0**, the canonical⇄mirror gap **4 change groups** (`diff -U0`)
/ **3 hunks** (`diff -u`) with the mirrored clause at **37** lines, the **full `prove-red` hard gate
end to end** (**PASSED, exit 0, 34 mutations, zero `✗`**; **all 15** pre-gates `0a`–`0o` read
**verbatim** by me, all green; `33`→*"T3 … targetIsBack delete rule"*, `34`→*"T11 … board-dependent
sentences"*), and **three** two-sided source-mutation experiments of my own against copied trees via
`FKIT_MOVER_STEP_ROOT` (whole framing paragraph deleted → **T16 red, alone, 16/17**; only the R13 half
deleted → **T16 red, alone, 16/17**; R14's fixed sentence reverted to its pre-fix wording →
⛔ **17/17 GREEN**, which is `R18`).

Coverage (round 3 — narrow; this field states THAT round's state, superseded above for round 4):
**both reviewers measured** (ADR-042 D1) — Codex (`gpt-5.6-sol`, read-only) read the clause in both
movers plus the whole pin block, enumerated every module-scope constant against the clause lines it
covers, and executed `mover-exemption-step` itself (16/16); I independently re-measured `test:unit`
(**913/913**), `reference-integrity` (**22/22** — `scanned 899 files, resolved 3492 link targets,
0 broken, 7 named-exempt`), `mover-exemption-step` (**16/16**), both canonical clauses at **46 lines**
each and byte-identical modulo the board word, the mirror gap **by both methods** (`diff -U0` **5**
change groups / `diff -u` **3** hunks per mover; mirror clause **37** lines), **all 15** `prove-red`
pre-gates `0a`–`0o` read **verbatim**, all green (⭐ the coder read only `0l`–`0o`; the other eleven are
now read, not inferred from exit 0), the **full `prove-red` hard gate re-run end to end by me**
(**PASSED, exit 0, 34 mutations, zero `✗`** — `33` red at *"T3 … targetIsBack delete rule"*, `34` red at
*"T11 … board-dependent sentences"*), and **three** source-mutation experiments of my
own against a copied tree via `FKIT_MOVER_STEP_ROOT` (two-sided framing-paragraph deletion → **16/16
green**; one-sided control → **T12 red**; two-sided lead-in reword → **16/16 green**).

## Reviewer findings

| #  | Round | Sev    | Location | Claim |
|----|-------|--------|----------|-------|
| R1 | 1     | medium | `claude/skills/fkit-task-done/SKILL.md:335,338,342`; `claude/skills/fkit-task-cancelled/SKILL.md:254,257,261` vs `test/reference-integrity.test.js:511-518` | The clause routes the operator by three tokens — `missingCiter`, `targetIsBack`, "the broken-link arm" — that **never appear in the guard's runtime output**. `missingCiter`/`targetIsBack` exist only as JS identifiers and code comments; neither L4 assertion message nor the failing test name contains either token. An operator who greps a red run for the word the bullet names finds nothing and must infer the direction from English prose. Verified by replicating L4's asserts verbatim and reading the rendered message. ⚠️ 0341 inherits this verbatim. |
| R2 | 1     | medium | `claude/skills/fkit-task-done/SKILL.md:342-344` + `:350-353`; `claude/skills/fkit-task-cancelled/SKILL.md:261-263` + `:269-272` vs `test/reference-integrity.test.js:438-440` | The third-direction bullet **drops the guard's repair branch**. L2's own message offers two: *"Repair the link, or — if it is quoted or illustrative text rather than a pointer — add it to NAMED_EXEMPT with its reason."* The clause asserts the red **is** quoted text and needs a NEW key — converting a loud deterministic red into a silent exemption, the exact failure the plan rejects option B for. Compounding it, the `Attribute before touching anything` bullet that follows has **no referent** for an L2 red (there is no "named key" yet), so a literal read routes a fresh break to "reported as pre-existing and left alone" — contradicting the bullet three lines above. ⚠️ 0341 inherits this verbatim. |
| R3 | 1     | medium | `test/mover-exemption-step.test.js:386-525` (`source: readSkill(name)`) | T2–T11 match against the **whole SKILL.md**, not the extracted clause; only T12 works on the extracted block. So every pinned subject can be removed from the clause and relocated elsewhere in the file — in both movers — and the suite stays green. **Verified by construction**: deleting the `targetIsBack` delete rule from the clause and re-adding it under an `## Appendix` heading in BOTH movers leaves the suite **16/16 pass, 0 fail**. The suite's uniformity/presence claim therefore holds over the *file*, not over the *clause*. One-line fix: pass the extracted block as `source`. ⚠️ 0341 inherits this weakness. |
| R4 | 1     | low    | `claude/skills/fkit-task-done/SKILL.md:333`; `claude/skills/fkit-task-cancelled/SKILL.md:252` vs `test/reference-integrity.test.js:592-593` | The clause tells the operator to record the guard's `named-exempt: N` line. **No such string is emitted.** The guard prints `scanned 898 files, resolved 3492 link targets, 0 broken, 7 named-exempt` — number *before* the word, no colon. Measured by running the guard. Raised by both reviewers. |
| R5 | 1     | low    | `test/mover-exemption-step.test.js:563-572` | T13 is **vacuous and mis-titled**. Named "uniformity rejects a one-sided reword (the comparison is not vacuous)", it only asserts that two hard-coded literals differing in one character (`'y'` vs `'z'`) are unequal, plus that a fixture containing no board word contains no board word. It never invokes `extractBlock`, `dedent`, `forBoard`, or T12's comparison path, so it proves nothing about T12. T12's actual non-vacuity is held by its own `MIN_BLOCK_LINES` assert and by the extraction gate — both real. Effective pinning count is 15 of 16. |
| R6 | 1     | low    | `…/0381-…/worklog.md` § *"2. Red-first reproduction — AF1(a), both directions"* | The record mis-attributes the measurement. Quoted: *"That is the whole argument for `L4` being an equality arm rather than a ceiling, confirmed by measurement."* **`L3` is the equality arm** (`assert.equal(LIVE.namedExemptCount, 7)`); `L4` is a pair of `assert.deepEqual(…, [])` arms, where equality-vs-ceiling does not apply. And the measurement shows the opposite of what the sentence concludes: L3 is **blind** to a planted stale key, which argues for **L4 existing at all**, not for L3's form. The preceding sentence — *"a key that suppresses nothing is never counted"* — is **correct**, and I confirmed it against the counting loop at `test/reference-integrity.test.js:375` (`namedExempt++` fires only when a scanned link is both broken and matched). Record-accuracy only; 0341's author and the wiki ingest read this. |
| R7 | 1     | low    | `test/prove-red.sh:1543`, `:1580` | The "landed more than once" guards count **lines, not occurrences**: `grep -c 'mutation: delete rule inverted'` and `diff … \| grep -c '^>'` both return 1 for two substitutions on one line. ⭐ **Not exploitable as written** — both mutations' `sed` expressions omit the `/g` flag, so at most one substitution per line is possible. Recorded so a future edit that adds `/g` (or switches to `perl -pi -e`) does not silently disarm the guard. Raised by Codex; the non-exploitability is my own verification. |
| R8 | 2     | medium | `claude/skills/fkit-task-done/SKILL.md:337-344`, `:350-351`, `:353-357`, `:358`; `claude/skills/fkit-task-cancelled/SKILL.md:256-263`, `:269-270`, `:272-276`, `:277` | **The repair bullets command edits the authority gate forbids, and two of their sentences are unreachable for the role the clause addresses.** Bullet 3 reads *"Repoint the citer half to the new board, **re-run the guard**, and if it then reds at …, delete the key instead of keeping the repointed one"*; the count bullet reads *"**Re-run the guard to read the new number; never decrement it by hand.**"* Both describe a **post-edit** step. Four lines below, the gate reads *"**You may run this guard. You may not edit it.** … stop and return a `NEEDS-DECISION` … and treat the close as unfinished until a coder lands that edit."* `NAMED_EXEMPT` and the `L3` count both live in `test/reference-integrity.test.js`, so repointing, deleting, or adding a key **is** editing that file. Under the gate the producer never edits it and therefore never reaches either re-run — the two sentences are literally unfollowable — while the three bullets that precede the gate read as authorization to edit a coder surface. `plan.md` § *"Authority gate"* settles the intent (*"A producer running the mover may run the guard … but must not edit it"*), so the defect is that the prose never says the repairs are what to **name** in the `NEEDS-DECISION` rather than what to **do**. Compounding it, `Attribute before touching anything` sits **after** the bullets that command touching. Blast radius is capped — an unauthorised edit stays uncommitted and visible in `git status` — but the forbidden action is destructive and silent: deleting a key and lowering `L3` quietly weakens the repo's only link-rot guard. Both reviewers, independently. ⚠️ **`0341` pastes this verbatim, twice.** |
| R9 | 2     | medium | `claude/skills/fkit-task-done/SKILL.md:327` vs `:345-349`; `claude/skills/fkit-task-cancelled/SKILL.md:246` vs `:264-268`; pinned as `THREE_DIRECTIONS` at `test/mover-exemption-step.test.js:210-211` | **A fourth instance of R2's defect, in the lead-in that summarises the clause.** The opening sentence characterises the third direction as *"break a fresh link that **needs a new one**"* — i.e. a new `NAMED_EXEMPT` key. The `L2` bullet twenty lines later says the opposite, and R2 is why it does: *"**repair is the default**: a new key on a link that should resolve converts a loud deterministic red into a silent permanent exemption."* Round 1 fixed the third-direction bullet (R2) and the attribution bullet (R2), and ruling **AH1** fixed the authority gate; this summary sentence was missed by all three. It is the **first** disposition an operator reads, and `T11` pins the wrong wording, so a correction must change the constant in lockstep. Raised by Codex, verified by me against both files and the `L2` message. ⚠️ **`0341` pastes this verbatim, twice**; ruling **AG2** (*"get the clause right once"*) is the reason it matters here rather than later. |
| R10 | 2    | low    | `claude/skills/fkit-task-done/SKILL.md:333` vs `:353-354`; `claude/skills/fkit-task-cancelled/SKILL.md:252` vs `:272-273` | **The word "stop" carries two different meanings four bullets apart.** The green bullet says *"record the guard's measured named-exempt figure in the report and **stop**"* — meaning *end this step*. The authority gate says *"**stop** and return a `NEEDS-DECISION` … treat the close as unfinished"* — meaning *halt the whole close*. Read literally, the green bullet ends the mover on its **most common** path, skipping `fkit-task-cancelled` § *"6. Flag downstream dependents — cancellation can orphan work"* (a mandatory second sweep) and step 7's report — the very report the same sentence says to record into. **Downgraded from Codex's High to low**: the same bullet's next sentence, *"This is the common case, and **the step is a no-op**"*, disambiguates it inside the same bullet, so a reader reaching the end of the bullet is corrected. The collision of one word with two meanings is the real defect, not the premature exit. Raised by Codex. |
| R11 | 2    | low    | `claude/skills/fkit-task-done/SKILL.md:324-328` and `:353-357`; `claude/skills/fkit-task-cancelled/SKILL.md:243-247` and `:272-276`; vs `test/reference-integrity.test.js:443` (`L3 live corpus: NAMED-EXEMPT is exactly 7 instances`) | **A reachable red with no route.** The clause routes Green, `L4`×2 and `L2`, and its lead-in claims *"The guard already computes all three directions"* — but `L3` is a fourth red state, and it is reachable from a move. Verified against `scan()`: a newly-broken link whose `(rel, target)` pair is already in `NAMED_EXEMPT` hits `if (NAMED_EXEMPT.has(rel + '::' + t)) { namedExempt++; continue; }` and is **never pushed to `broken`** — so `L2` stays green, `L4` stays green (that key's own citer still exists, its own target still missing), and `L3`'s equality reds **alone**. That is precisely what `L3` exists to catch: *"A RISE means a new unresolved link happens to match an existing (file, target) key and is being silently swallowed."* The gate's `NEEDS-DECISION` content list does not cover it either — there is no offending key with a direction and no `L2` broken-link triple. **Mitigated, which is why it is low**: `L3`'s own message self-routes both directions, and the destination (hand off to a coder) is unchanged. Raised by Codex; reachability verified by me. |
| R12 | 2    | low    | `test/mover-exemption-step.test.js:38-41` (header § *"⚠️ WHAT THIS FILE DOES AND DOES NOT DETECT"*, item 2) | **The same staleness the coder routed to me in the residual, in a second place nobody flagged.** The comment reads *"canonical and mirror DIVERGE the moment this change is committed, and the step is **NOT IN FORCE** in this repo until the owner re-runs init."* Measured 2026-09-11: `.claude/skills/fkit-task-done/SKILL.md` and `.claude/skills/fkit-task-cancelled/SKILL.md` **do** carry the clause, and each differs from its canonical source by **exactly one hunk** — the **AH1** authority-gate bullet. So the step **is** in force, in its pre-**AH1** wording; only that one bullet is not. Record accuracy only, no behaviour — kept as a row because this file's header explicitly addresses `0341`'s author (*"Task 0341 is where the clause reaches them"*), and a false present-tense claim about what is in force is what that author would act on. Same class as R6. |
| R13 | 3 (narrow) | medium | `claude/skills/fkit-task-done/SKILL.md:331-335` vs `:319-321` and `:351-355`; `claude/skills/fkit-task-cancelled/SKILL.md:250-254` vs `:240-242` and `:270-274` | ⚠️ **R8's OWN FIX introduced a new mis-route — the same "who does what" defect, in the mirror direction.** The framing paragraph reads *"**Two rules bind every repair below** … each direction below names the repair a red *requires*, and that repair is what you put in the `NEEDS-DECISION`, not what you do. A coder lands it."* The quantifier is **universal over every direction**, but the `L2` direction's **leading** branch is *"**repair the link** when it is a pointer offered to a reader"* — repairing a broken markdown link in `ai-agents/` is **the producer's own mandatory work**, not a coder surface: the same step says four lines above, *"**Then prove it.** Resolve every relative markdown link in the files you touched … A move is not finished while a link it broke is still broken."* So a producer who obeys the ⛔-marked binding paragraph hands a link **they broke** to a coder, marks the close unfinished, and leaves the link broken — contradicting a mandatory earlier instruction in the same step. R8 fixed over-authorization by over-restricting; the clause still disagrees with itself about who performs the repair. **Verified by reading both, not inferred.** Blast radius is **over-caution, not destruction** (a stalled close and a link left broken, no silent guard edit), which is what holds this below high; held above low because two binding instructions in one skill give opposite orders and `0341` pastes it twice. ⚠️ **AND IT IS IN TWO PLACES, WHICH IS WHY A ONE-SITE FIX WOULD BE THE SIXTH PASS TO LEAVE AN INSTANCE BEHIND:** the **authority gate** (`fkit-task-done/SKILL.md:360-364`, `fkit-task-cancelled/SKILL.md:279-283`) has the same over-reach — *"stop and return a `NEEDS-DECISION` … **for an `L2` red where there is no key yet**, the broken link's citing file, its line text, and its unresolved target — and treat the close as unfinished until a coder lands that edit"* routes **every** `L2` red to a coder unconditionally, when only the *add-a-key* branch is a guard edit. ⛔ **This is NOT a re-litigation of ruling AH1** — AH1's ruling (fix the missing `L2` referent inside `0381`) was right and is untouched; the text it landed carries the same universal-quantifier slip the framing paragraph later inherited. ⛔ **Codex did not find this one; the framing half and the gate half are both mine.** |
| R14 | 3 (narrow) | low    | `claude/skills/fkit-task-done/SKILL.md:328-329`; `claude/skills/fkit-task-cancelled/SKILL.md:247-248` | ⭐ **THE SIXTH INSTANCE — it exists.** The lead-in's closing sentence still reads *"… and its own failure messages name the right action, so the rule here is to run it and **obey what it says**."* For an `L2` red the guard literally says (`test/reference-integrity.test.js:438-439`) *"Repair the link, or — if it is quoted or illustrative text rather than a pointer — **add it to NAMED_EXEMPT with its reason**"* — and adding a key **is** editing the coder surface the gate forbids. *"Obey what it says"* therefore commands, in one phrase, the exact action the authority gate five bullets down refuses; it also runs past *"Attribute the red first"*, since a repo-global red may not be this move's. ⚠️ **This sentence sits immediately after the sentence R9 just rewrote, in the same paragraph** — the fifth consecutive pass to edit this prose and leave the adjacent sentence alone. Held at **low**, not medium: the ⛔ framing paragraph is the very next paragraph and explicitly binds (*"read them before acting on one"*), so a reader who continues two lines is corrected — the same self-correction that put R10 at low. **Raised by both reviewers independently** (Codex rated it High; downgraded here on the framing-paragraph cap). |
| R15 | 3 (narrow) | medium | `test/mover-exemption-step.test.js:118-251` (the constant block) vs `claude/skills/fkit-task-done/SKILL.md:331-335`, `claude/skills/fkit-task-cancelled/SKILL.md:250-254` | ⛔ **R8's framing paragraph is UNPINNED — the one element carrying the fix's whole load is the one element no test holds.** Every other clause subject has a constant (`INVOCATION`, `DELETE_RULE`, `LEAD_IN`, `UNCONDITIONAL`, `REPOINT_RULE`, `THIRD_DIRECTION`, `INSTANCES_RULE`, `AUTHORITY_RULE`, `ATTRIBUTION_RULE`, `INVERSION`, `THREE_DIRECTIONS`); the framing paragraph has none. **Measured by construction, not argued:** deleting it from **both** movers in a copied tree (`FKIT_MOVER_STEP_ROOT`) leaves the suite **16/16 pass, 0 fail** — every subject constant still matches, `T12` uniformity still holds because both copies changed together, and the block is **41** lines, still far above `MIN_BLOCK_LINES = 22`. Control: the **one-sided** deletion reds `T12` alone, so only *asymmetric* loss is caught. ⚠️ **This is what makes it medium rather than a nit:** the coder's stated reason for leaving `DELETE_RULE`'s *"**Delete the key — do not repoint it.**"* and `THIRD_DIRECTION`'s imperatives unsoftened is *"the framing paragraph covers their imperatives"* — so two byte-exact-pinned imperatives are covered by an unpinned paragraph, and the suite would stay green over the exact authority defect R8 was raised to fix. **Raised by both** — Codex enumerated the constant/line coverage and reached the same conclusion by reading; the green mutation run is mine. |
| R16 | 3 (narrow) | low    | `test/mover-exemption-step.test.js:517` (`T7` title) and `:522-525` (`T7`'s `why:`) | **PARTIALLY CORRECT — `AK1`'s fix is real but the title still names only the exemption branch.** Post-`AK1` the title reads *"T7 both movers: the THIRD direction — a move can break a **quoted** link that needs a NEW key"*, and the `why:` *"A move can also BREAK a **quoted** link, which needs a NEW key with its reason"*. **Both are true as written** — existential, correctly hedged, and no longer the universal claim `AK1` removed. What they never state is that the direction's **default is repair**: the constant they pin (`THIRD_DIRECTION`) leads with *"**repair the link**"* and the `A6` comment above it says *"⛔ IT MUST CARRY BOTH BRANCHES … and repair must lead"*, so title and `why:` under-describe the very property the test exists to hold. ⚠️ **Downgraded from Codex's Medium to low, and flagged as a re-litigation risk, loudly:** the reader is a developer reading `node --test` output, never the operator running the mover; the pinned prose is correct either way; and this would be the **third** rewrite of one test title's wording — `AK1` explicitly declined to combine both hedges *because* it would invent a further phrasing. **A residual is the better disposition than a fix.** Raised by Codex (as two findings — title and `why:` — merged here; they are one claim). |
| R17 | 4 (narrow) | low | `claude/skills/fkit-task-done/SKILL.md:336` and `:369` vs `:332` and `:374`; `claude/skills/fkit-task-cancelled/SKILL.md:255` and `:288` vs `:251` and `:293`; pinned as `FRAMING_RULE` at `test/mover-exemption-step.test.js:259-267` and `AUTHORITY_RULE` at `:206-213` | ⛔ **THE SEVENTH INSTANCE — it exists, it is a FOURTH direction of the class, and R13's OWN FIX introduced it. That is the third round running in which the previous round's fix created the next instance** (R8→R13, R13→R17). **The repair R13 correctly returned to the producer is returned UNCONDITIONALLY, and the reason given for it can never discriminate.** The framing paragraph's first binding rule is *"**Attribute the red first:** the guard is repo-global, so it may not be this move's at all"* (`:332`), and the attribution bullet supplies the `L2`-specific test: it is this move's *"where … the broken link's own citing file or target"* spells the moved folder — *"**anything else is reported as pre-existing and left alone**"* (`:374`). But R13's exception sentence carries **no such qualifier**: *"**Exactly one repair below is yours:** `L2`'s leading branch, repairing a broken markdown link under `ai-agents/` … **so you land it**"* (`:336`), and the authority gate repeats it: *"**An `L2` red you answer by repairing the link is not this case:** that edit is under `ai-agents/`, **it is yours to land**"* (`:369`). ⛔ **And the discriminator it offers is vacuous — measured, not argued.** `collectFiles()` walks `path.join(root, 'ai-agents')` **only** (`test/reference-integrity.test.js:190-192`), and `L7` pins that nothing outside it is ever scanned (`:578-587`, `strays` must be `[]`). **Every `L2` red is therefore under `ai-agents/` by construction**, so *"that edit is under `ai-agents/`"* is a test that is **always true** and can never separate this move's link rot from another change's. An operator applying the stated reason literally concludes *"yours"* for **every** `L2` red — including a pre-existing one the attribution bullet says to leave alone — and edits another in-flight change's file. **Held at low, not Codex's medium**, and the cap is measured: the corrective sits in the **same paragraph as its FIRST named rule**, under an opening that says both rules bind *"every repair below"* — a stronger self-correction than R10's next sentence or R14's next paragraph, both of which were held low on that ground; the paragraph's own justification is already correctly scoped (*"a move is not finished while a link **it** broke is still broken"*); and the blast radius is a benign markdown-link edit under `ai-agents/`, visible in `git status`, **never** a `NAMED_EXEMPT` or `L3` edit. **Held above nothing** because it is the seventh instance, both binding sites carry it, `0341` pastes the clause twice, and a vacuous reason is worse than an absent one. ⚠️ **Both sites are byte-exact-pinned (`T16`, `T9`), so any fix must move `FRAMING_RULE` and `AUTHORITY_RULE` and their `why:` texts in lockstep.** ⭐ **Raised by BOTH reviewers independently** — I reached the sentence before Codex's output landed; Codex added the vacuity argument, which I then verified against `collectFiles()` and `L7`. |
| R18 | 4 (narrow) | low | `claude/skills/fkit-task-done/SKILL.md:328-330`; `claude/skills/fkit-task-cancelled/SKILL.md:247-249` vs `test/mover-exemption-step.test.js:146` (`LEAD_IN`) and `:238-239` (`THREE_DIRECTIONS`) | **R14's fix is UNPINNED — the same gap-class `R15` was raised for, now applied to the fix that landed beside it. Measured by construction, not argued:** reverting R14's sentence to its exact pre-fix wording (*"its own failure messages name the right action, so the rule here is to run it and obey what it says"*) in **BOTH** movers via `FKIT_MOVER_STEP_ROOT` leaves the suite ⛔ **17/17 GREEN, 0 fail** — `T16` green, `T12` green (both copies changed together, the same blind spot R15 closed one paragraph down). `LEAD_IN` pins only the bolded opening phrase and `THREE_DIRECTIONS` only the *"Moving a folder into …"* sentence; the two sentences between them are held by nothing. ⚠️ **The coder's own declaration is the measurement** — it reported *"no constant moved"* for R14, which is true and is exactly why the fix is unheld. **Low, and a residual is a defensible disposition**: the sentence is descriptive rather than binding, and the authority it defers to (*"which is what the two rules below settle"*) **is** now pinned by `T16`, so a silent revert leaves a reader corrected by the pinned paragraph two lines down — the same cap that put R14 itself at low. Held above nothing because six passes have churned this exact prose and the seventh just found another instance in it. ⛔ **Not a re-raise of R15** — R15 was disposed by pinning the framing paragraph (`FRAMING_RULE`/`T16`, ruling **AL2**); this is a **different, still-unpinned** sentence, measured after that pin landed. Mine; Codex did not raise it. |

## Coder response

<!-- CODER-OWNED — the reviewer never writes here. -->

⭐ **Round 1 — severity is re-derived here, not inherited.** Every finding landed on the same label the
reviewer gave it; the reasoning is in the rightmost column, not borrowed. **All seven verified against
the code; none matched an Accepted residual or an ADR's "re-raise only if", so none is re-litigation.**
⛔ **No `pending approval` rows**: this round ran under `/fkit-sprint-ship-loop`'s standing approval
(the plan gate) plus rulings **AG1–AG4**, so verified-`CORRECT`, in-plan, mechanical fixes were applied
directly. Every judgment call is surfaced, not resolved here.

| #  | Verdict | Defect / Frontier | Action | Status | Severity (mine) |
|----|---------|-------------------|--------|--------|-----------------|
| R1 | CORRECT | Defect | Rewrote the three direction bullets in **both** movers to route on text a red run really prints — the arm name (`L4` / `L2`, which `node --test` prints as the failing test's name) plus a verbatim fragment of that arm's own message. Updated `DELETE_RULE`, `REPOINT_RULE`, `THIRD_DIRECTION` in the same change. ⛔ The tokens were **not** added to the guard's messages (ruling **AG1**), so `L4`'s messages stay byte-identical to pre-`0381`. Verified: `missingCiter` / `targetIsBack` now occur **zero** times in either mover. | ✅ done | **medium** — a lookup failure, not a wrong repair: the operator greps for a word no output contains and must fall back to inferring direction from prose. Bounded because the guard's own messages do state the right action. `0341` copies it twice, which is what keeps it above low. |
| R2 | CORRECT | Defect | Third-direction bullet now carries **both** branches of `L2`'s message with **repair leading**, instead of asserting the red is quoted text needing a new key. Separately, `Attribute before touching anything` gained a referent for an `L2` red (the broken link's own citing file or target) for the case where no key exists yet. | ✅ done | **medium** — worse in kind than R1 (it instructed a *wrong repair*: exempting a genuinely broken link, converting a loud deterministic red into a silent permanent one), but capped by the authority gate: adding a key edits `test/reference-integrity.test.js`, which the clause already routes to a coder via `NEEDS-DECISION`, so a human sees it before it lands. Net **medium**. |
| R3 | CORRECT | Defect | `T2`–`T11` now match `clauseOf(name)` — the **extracted clause** — instead of the whole `SKILL.md`. The extraction and its fail-closed gate already existed for `T12`; only the `source:` was wrong. | ✅ done | **medium** — the suite's presence/uniformity claim held over the *file*, so every pinned subject could leave the clause and stay green. Re-measured here, not taken on trust: the reviewer's Appendix-relocation construction went **16/16 green → `T3` red, "found 0"**. This is the exact claim `0341` is about to lean on. |
| R4 | CORRECT | Defect | The `Green` bullet no longer names a `named-exempt: N` line. It names `L8`'s real shape — the tail of its disclosure line, e.g. `0 broken, 7 named-exempt`, **number before the words** — and says outright that no such `named-exempt: N` string exists. | ✅ done | **low** — an instruction that cannot be followed literally, but the operator sees the real figure on the same line and would record it anyway. No wrong action follows. |
| R5 | CORRECT | Defect | `T13` rewritten to drive T12's **real** path (`extractAndDedent` → `foldBoard` → comparison) over synthetic clauses: **(a)** positive control (board-word-only difference must compare **equal**), **(b)** one-sided reword must compare **unequal**, **(c)** missing board swap must compare **unequal** — mutation 34's shape. Retitled. `foldBoard` and the synthetic anchors hoisted to module scope so `T13` and `T15` share them. Proved discriminating: a board-blind `foldBoard` reds **`T13(c)`**. | ✅ done | **low** — no coverage was actually lost, because `T12`'s non-vacuity is held by the extraction gate. ⚠️ **But one sentence of R5's own rationale is wrong, and it understated the problem** — see the note below this table. |
| R6 | CORRECT | Defect | Worklog sentence corrected, with the correction **shown** rather than silently overwritten. Verified on disk: `L3` holds `assert.equal(LIVE.namedExemptCount, 7)`; `L4` holds two `assert.deepEqual(…, [])` arms. Also repaired two further statements that my **own** R1/R4 fixes had just made stale — the clause's *"30 lines"* (now 37) and its *"names no assertion internals"* claim (it now names `L4` / `L2`, deliberately). | ✅ done | **low** — record accuracy only, no behaviour. Kept at low rather than dropped because `0341`'s author and the wiki ingest read this file, and a wrong sentence about a measurement propagates further than it looks. |
| R7 | PARTIALLY CORRECT | Frontier | **Verified both halves.** `grep -c` does count **lines**, not occurrences — and it is **not exploitable**: both mutations' `sed` expressions omit `/g`, so at most one substitution per line is possible, and `diff … \| grep -c '^>'` is exact for a one-line change. ⛔ **Recorded, not hardened.** Hardening means editing `test/prove-red.sh`, which is **outside round 1's fence** (**AG1** chose the route that does not widen the surface). Entered in *Accepted residuals* with a re-raise condition that fires the moment it could become exploitable. | won't fix (frontier) | **low, latent** — zero blast radius today; the whole finding is about a *future* edit disarming a guard silently. That is precisely what a residual with a trigger is for, rather than a speculative fix. |

⭐ **One correction to a finding's reasoning — R5, and it made the finding *understate* the problem.**
R5 argues that *"T12's actual non-vacuity is held by its own `MIN_BLOCK_LINES` assert and by the
extraction gate — both real."* **The first half is false.** `extractAndDedent` joins to a **string**, so
`T12`'s `a.raw.length` was the **character** count — measured **3045**, compared against a **22-line**
floor. That assert could not fail for any block over 22 *characters*; it was vacuous in the same way
`T13` was. Non-vacuity was held by the extraction gate **alone**. Fixed to `a.raw.split('\n').length`
while fixing `T13`. ⚠️ **No red-proof exists for it** — the gate inside `extractBlock()` throws before a
sub-floor block can reach `T12` — so the corrected assert is **defensive only**, which is exactly what
its own comment says it is for. **This is beyond R1–R7 and is flagged to the owner, not buried.**

### Round 1 — convergence call and why the header still reads `in-review`

⛔ **`Status:` stays `in-review`. Not closed-out.** The skill closes a ledger out when every novel
finding is *closeout / disproven / accepted* and nothing blocking remains. That is **not** this round:
**six of seven were FIXED**, and applied fixes are not the same disposition as settled ones. Two
further reasons, both concrete:
1. **R1/R2 rewrote pinned contract text** — the three direction bullets are exactly what task `0341`
   will paste into the two sprint movers. New prose that no reviewer has read yet is the last thing
   that should ship unreviewed into a copy-twice surface.
2. **Two changes are beyond R1–R7** — the `T12` character-vs-line assert (**kept**, ruling **AH2**)
   and the authority gate's `L2` referent (**applied**, ruling **AH1**; it was left unapplied as a
   judgment call and the owner ruled on it). Both want a second pair of eyes before the ledger closes.

⭐ **No loop, no re-litigation.** All seven findings are round-1 novel; none matches an *Accepted
residual* or an ADR's "re-raise only if". **Recommendation: act — which was done — then one more
reviewer pass over the reworded clause, and close.**

### Round 1, addendum — the three owner rulings **AH1–AH3** (2026-09-11)

⭐ **AH1, "Fix it now inside 0381 (Rec)" — the THIRD instance is now FIXED.** The **authority gate**
bullet read *"return a `NEEDS-DECISION` naming each offending key verbatim and its direction"*. For an
`L2` red **there is no key yet**, so this was a **third instance of the defect R2 names** — the reviewer
found two (the third-direction bullet and the attribution bullet) and **missed this one**; it was found
while fixing R2 and left unapplied as a judgment call rather than resolved unilaterally. The owner ruled
on the basis of their own **AG2**: *get the clause right ONCE, before `0341` copies it twice.* Fixing two
of three instances and shipping the third is the outcome AG2 exists to prevent.

⭐ **What changed — the CONTENT of the hand-off, not the gate's job.** Stop and hand off to a coder was
already right and is untouched. The hand-off now reads:

> *"naming what the red points at verbatim — each offending key and its direction, or, for an `L2` red
> where there is no key yet, the broken link's citing file, its line text, and its unresolved target"*

It covers all three directions: `L4`'s two (a key exists) and `L2`'s (no key yet). `L2`'s own output
already prints the citing file, the quoted line and the unresolved target, so the hand-off carries
something real even with no key — and the wording mirrors the `L2` referent R2 added to the attribution
bullet, so the two bullets no longer disagree. Both movers reworded **identically** (the bullet carries
no board word); the pinned constant `AUTHORITY_RULE` (`T9`) updated in the same change.
⚠️ **The cost the ruling named was paid, not skipped**: a pinned-constant change and a full `prove-red`
re-run — measured in `worklog.md` §7c, including mutations 33 and 34 re-confirmed **at their named
assertions**.

⭐ **AH2, "Keep it (Rec)" — the `T12` character-vs-line fix STANDS.** `a.raw.length` was the **character**
count (**3045**) against a **22-line** floor, in the assert that is supposed to be `T12`'s safety net.
Not reverted. Its own caveat is unchanged and still stands: **no red-proof exists for it** — the gate
inside `extractBlock()` throws before a sub-floor block can reach `T12` — so the corrected assert is
**defensive only**.

⭐ **AH3, "Yes — round 2 (Rec)".** `Status:` stays **`in-review`**; the **reviewer** sets the final
status, not this section. Round 2 is the driver's to spawn.

⚠️ **One shared residual's wording has gone stale, and is deliberately NOT edited here** — it lives in
*Accepted residuals*, outside this round's fence. **`.claude/` mirror not refreshed**: the owner has
since re-run init, so **AF4**'s caveat now reads as current when it is not. The correct post-refresh
statement is recorded in `worklog.md`: the mirror was refreshed **before** this round's clause landed,
so the clause is **still not in force** in this repo until the owner re-runs init **again**. Flagged for
the reviewer to dispose of in round 2 rather than rewritten unilaterally.

### Round 2 — R8–R12, under owner rulings **AJ1–AJ3** (2026-09-11)

⭐ **Severity is re-derived here, not inherited.** All five verified against the code first; **none**
matched an *Accepted residual* or an ADR's "re-raise only if", so **none is re-litigation**.
⛔ **No `pending approval` rows** — this round ran under `/fkit-sprint-ship-loop`'s standing approval
plus rulings **AJ1–AJ3**. ⚠️ **Two rows carried a wrong action and were fixed (R8, R9); three carried
none and were recorded (R10, R11, R12).**

| #   | Verdict | Defect / Frontier | Action | Status | Severity (mine) |
|-----|---------|-------------------|--------|--------|-----------------|
| R8  | CORRECT | Defect | ⭐ **Fixed in both movers (ruling AJ1).** Three changes, identical in each copy. **(a)** A framing paragraph now sits **before** the bullets: *"Two rules bind every repair below — read them before acting on one. **Attribute the red first** … And **you may run this guard, you may not edit it** — each direction below names the repair a red *requires*, and that repair is what you put in the `NEEDS-DECISION`, not what you do. A coder lands it."* That converts every bullet from *do* to *name*, and it is what fixes the ordering complaint by **framing** rather than by moving the attribution bullet — moving it would relocate `BLOCK_END`, which anchors the extraction. **(b)** The repoint bullet's post-edit step is now attributed: *"the coder **re-runs the guard** after that edit"*. **(c)** The count bullet likewise: *"read from a re-run of the guard once the edit lands … again the coder's step, not yours."* ⛔ `DELETE_RULE` and `THIRD_DIRECTION` were **not** touched — the framing paragraph covers their imperatives, and `DELETE_RULE` is byte-exact-pinned *because* "do not repoint it" must not be softened. ⛔ No JS identifier reintroduced: `missingCiter`/`targetIsBack` still occur **0** times in either mover (R1 non-regression, measured). Constants `REPOINT_RULE` and `INSTANCES_RULE` moved in lockstep. | ✅ done | **medium** — one clause both authorizes and forbids the same edit, and the forbidden half is destructive: deleting a `NAMED_EXEMPT` key and lowering `L3` silently weakens the repo's only link-rot guard. Held **below** high by two real caps — the gate's own wording is unambiguous and sits in the same clause, and any such edit is uncommitted and visible in `git status`. Held **above** low because the two re-run sentences were literally unfollowable by the role addressed, and `0341` pastes the clause twice. Both reviewers found it independently. |
| R9  | CORRECT | Defect | ⭐ **Fixed in both movers (ruling AJ1).** The lead-in's third direction read *"break a fresh link that **needs a new one**"* — a new `NAMED_EXEMPT` key. Now *"break a fresh link that **needs repairing**"*, which is what the `L2` bullet twenty lines below actually says (*"repair is the default"*). ⚠️ **`THREE_DIRECTIONS` moved in the same change**, as required — the constant pinned the wrong wording, so `T11` would otherwise have gone red for the right edit. | ✅ done | **medium** — a summary that primes the exact action the `L2` bullet exists to refuse, in the **first** sentence an operator reads. Lower blast radius than R2 (it describes rather than commands, and the operative bullet corrects it downstream), but held at medium, not low, on three measured grounds: it is the **fourth** instance of one defect and **three** prior passes walked past it, the frame it sets is the one carried into the bullets, and `0341` pastes it twice — ruling **AG2**'s whole basis. |
| R10 | CORRECT | Defect (wording) | **Recorded, not fixed — ruling AJ3.** Entered in *Accepted residuals* as **"'stop' carries two meanings"**. ⚠️ Classified **Defect**, not a designed tradeoff; `won't fix (frontier)` is the status vocabulary's only value meaning *accepted residual*, so it is used here for that and not as a claim of intent. | won't fix (frontier) | **low** — I re-derived it and reach the reviewer's own downgrade from Codex's High for the same reason: the green bullet's next sentence (*"the step is a no-op"*) disambiguates **inside the same bullet**, so a reader who finishes the bullet is corrected. No wrong action follows either reading — which is precisely what separates it from R8/R9. |
| R11 | CORRECT | Defect (gap) | **Recorded, not fixed — ruling AJ3.** Entered in *Accepted residuals* as **"`L3` is a fourth red state the clause does not route"**. Reachability re-verified by me, not taken on trust: `test/reference-integrity.test.js:375` reads `if (NAMED_EXEMPT.has(rel + '::' + t)) { namedExempt++; continue; }` — the link is **never pushed to `broken`**, so `L2` and `L4` stay green and `L3`'s equality (`:451`) reds alone. Same vocabulary note as R10. | won't fix (frontier) | **low** — the gap is real, but nothing is mis-routed: `L3`'s own message self-routes both directions, and the destination (hand off to a coder) is identical for every arm, because *any* fix is an edit to a coder surface the authority gate already gates. The cost of closing it is a fourth direction bullet plus re-opening the lead-in's "all three directions" sentence and both pinned constants — structural widening of a clause `0341` is about to paste. |
| R12 | CORRECT | Defect (record) | **Recorded, not fixed — ruling AJ3.** Entered in *Accepted residuals* as **"the suite header's 'NOT IN FORCE' claim is stale"**. Verified independently: both `.claude/` mirrors contain the clause exactly once. ⚠️ **And this round moved the number the residual has to state** — see that entry. Same vocabulary note as R10. | won't fix (frontier) | **low** — record accuracy only, no behaviour, same class as R6. Not dropped below a row, because this file's header explicitly addresses `0341`'s author and a false present-tense claim about what is in force is exactly what that author would act on. |

⭐ **Two further instances of the round's wording defects were FOUND and deliberately NOT fixed — they
are surfaced, not buried, and not silently applied.** Both are in `test/mover-exemption-step.test.js`,
inside the fence, and both are one-line mechanical edits; neither is R8 or R9, which is why ruling
**AJ1**'s "fix both" does not reach them and why widening ruling **AJ2**'s narrow two-bullet pass to a
third and fourth subject was not mine to decide:
1. **`T7`'s test title is a fifth instance of R9's defect** — *"T7 both movers: the THIRD direction — a
   move can break a link that needs a NEW key"*, dropping the *quoted-text* qualifier that makes the
   claim true. ⭐ The same test's `why:` text and the `A6` comment above `THIRD_DIRECTION` are both
   correctly hedged (*"a **quoted** link, which needs a NEW key"*, *"**may** need"*); only the title is
   flat. ⛔ **Verified safe to change if approved**: `test/prove-red.sh` anchors mutations **33** and
   **34** on the `T3` and `T11` titles, never on `T7`'s.
2. **`MIN_BLOCK_LINES`' comment is stale, and was stale before this round** — *"The live block is 30
   lines in both files."* Measured now: **46 lines** in both. It read 39 before this round's edits, so
   this is pre-existing drift of the same record-accuracy class the owner just parked in **AJ3**, which
   is the other reason it was left rather than fixed. The **gate** is unaffected — the floor is 22 and
   the block is twice that.

### Round 2, addendum — the two owner rulings **AK1–AK2** (2026-09-12)

⛔ **This is not a round 3.** No new finding, no new verdict on a reviewer row, no status change: both
rulings dispose of the two instances **surfaced and not fixed** immediately above, which the coder
raised rather than a reviewer. Ruling **AJ2**'s narrow verification pass still owns the final status,
and the header still reads `in-review`.

| #   | Owner ruling (label verbatim)                | Disposition                                                                 | Status              |
|-----|----------------------------------------------|-----------------------------------------------------------------------------|---------------------|
| AK1 | *"Fix it now, before the narrow pass (Rec)"*  | ⭐ **`T7`'s title fixed** — landed **before** the narrow pass, so that pass reads final text. | ✅ done             |
| AK2 | *"Leave it — consistent with AJ3 (Rec)"*      | ⛔ **`MIN_BLOCK_LINES`' comment left unedited**; entered in *Accepted residuals* below.        | won't fix (frontier) |

**AK1 — what changed, exactly one line.** `test/mover-exemption-step.test.js`, the `test(...)` title of
`T7`:

- **Before:** *"T7 both movers: the THIRD direction — a move can break a link that needs a NEW key"*
- **After:** *"T7 both movers: the THIRD direction — a move can break a **quoted** link that needs a
  NEW key"*

⭐ **No sixth phrasing was invented.** The word added is the `why:` text's own qualifier — that text
reads *"A move can also BREAK a **quoted** link, which needs a NEW key with its reason"* — and the `A6`
comment above `THIRD_DIRECTION` hedges the same claim the other way (*"a link, which **may** need a NEW
key"*). The title now matches the `why:` wording, which is the hedge ruling **AK1** names (*the
quoted-text qualifier*). ⛔ Nothing else in the file was touched: **no test added, removed, or otherwise
renamed** — the suite is still `T1`–`T15`, 16 tests.

⛔ **The safety claim was re-verified on disk this turn, not carried over from the round-2 note.**
`test/prove-red.sh` greps mutation **33**'s red for `(✖|not ok|fail).*targetIsBack delete rule` and
mutation **34**'s for `(✖|not ok|fail).*board-dependent sentences` — substrings of the **`T3`** and
**`T11`** titles, which are unchanged. `T7` appears **nowhere** in `test/prove-red.sh`, and the string
*"the THIRD direction"* occurs in exactly three places repo-wide: this test file's `A6` comment, the
title just changed, and this ledger's own quotation of it. ⭐ Re-confirmed by running the gate, not by
reading it: mutation **33** red at *"T3 … targetIsBack delete rule"*, mutation **34** red at
*"T11 … board-dependent sentences"*, and pre-gate `0o` (unmutated copy of the suite) **green**.

**Re-measured after the edit (2026-09-12, `HEAD 00d8b6b`, unmoved):** `npm run test:unit`
**913/913** · `test/reference-integrity.test.js` **22/22** · `mover-exemption-step` **16/16** ·
`npm run test:prove-red` **PASSED, exit 0, 34 mutations, zero `✗`** (the script defines **15** green
pre-gates `0a`–`0o`, all of which must pass for exit 0; the captured log begins mid-list at `0l`, so
only `0l`–`0o` were read verbatim — the other eleven are covered by the exit code, not by my eyes).
⚠️ **`npm test` was NOT run as one command** — `test:unit` and `test:prove-red` were run separately, and
together they are exactly what `npm test` chains.

⚠️ **Superseded by round 3, below:** *"the suite is still `T1`–`T15`, 16 tests"* was true of **AK1**'s
edit and is **not** the current count. Ruling **AL2** added `T16`; the suite is **`T0`–`T16`, 17 tests**.

### Round 3 — R13–R16, under owner rulings **AL1–AL5** (2026-09-12)

⭐ **Severity re-derived here, not inherited.** All four verified against the code on disk before any
edit; **none** matched an *Accepted residual* or an ADR's "re-raise only if", so **none is
re-litigation**. ⛔ **No `pending approval` rows** — this round ran under `/fkit-sprint-ship-loop`'s
standing approval plus rulings **AL1–AL5**, all five relayed from a live `AskUserQuestion`.

⛔ **The sixth pass over this clause, and it fixed a defect the fifth pass CREATED.** R13 is a
regression introduced by **R8**'s own fix: R8 cured over-authorization by over-restricting. That is
stated first because it is the worst news in this round.

| #   | Verdict | Defect / Frontier | Action | Status | Severity (mine) |
|-----|---------|-------------------|--------|--------|-----------------|
| R13 | CORRECT | Defect (regression, mine) | ⭐ **Fixed at BOTH sites in one change, ruling AL1** — a one-site fix would have been the sixth pass to leave an instance behind. **(a) The framing paragraph** no longer quantifies over every direction. It now scopes the hand-off to the guard FILE — *"wherever the repair a red requires is an edit to `test/reference-integrity.test.js` (repointing a key, deleting one, or adding one), that repair is what you put in the `NEEDS-DECISION` … and a coder lands it"* — and then names the exception outright: *"**Exactly one repair below is yours:** `L2`'s leading branch, repairing a broken markdown link under `ai-agents/`. That one *\"Then prove it.\"* above already requires of you — a move is not finished while a link it broke is still broken — so you land it and the close is not unfinished for it."* **(b) The authority gate** narrowed its `L2` trigger from *"an `L2` red where there is no key yet"* to *"an `L2` red **taking the add-a-key branch**, where there is no key yet"*, and gained the matching closing sentence: *"**An `L2` red you answer by repairing the link is not this case:** that edit is under `ai-agents/`, it is yours to land, and it does not leave the close unfinished."* ⭐ **`AUTHORITY_RULE` and `T9` moved in lockstep**, as **AH1** did; `T9`'s `why:` now names the over-restriction direction so a red run explains both failure modes. ⛔ **AH1's fix is inside that text and is untouched** — an `L2` red still carries its own `NEEDS-DECISION` content item (citing file, line text, unresolved target), because there is still no key to name. Only the trigger narrowed. ⛔ `BLOCK_END` did not move: it is the attribution bullet's last sentence and both edits are above it. | ✅ done | **medium** — two binding instructions in one skill gave opposite orders about the same repair. Blast radius is **over-caution, not destruction** (a stalled close and a link left broken; no silent guard edit), which holds it below high. Held **above** low on two measured grounds the reviewer names and I re-derived: the producer who obeys the ⛔-marked paragraph leaves a link **they broke** unrepaired — that is real link rot, not merely a stalled close — and `0341` pastes the clause twice. |
| R14 | CORRECT | Defect | ⭐ **Fixed in both movers, ruling AL3 — the SIXTH instance of the same defect class.** The lead-in's closing sentence read *"… its own failure messages name the right action, so the rule here is to run it and **obey what it says**."* For an `L2` red the guard literally says *"add it to NAMED_EXEMPT with its reason"* — the edit the gate forbids. Now: *"… its own failure messages name **the repair each one needs** — but **never who lands it**, which is what the two rules below settle. Run it, then read its red against them."* That keeps the guard's messages as the source of the **repair** and moves **authority** to the rules below, which is where R8 and R13 put it. ⛔ **No constant moved** — the reviewer measured this sentence as unpinned and I re-confirmed it: it appears in no constant, and the two pinned sentences that bracket it (`THREE_DIRECTIONS` before, `FRAMING_RULE` after) are byte-unchanged by this edit. | ✅ done | **low** — I reach the reviewer's downgrade from Codex's High by the same route, re-derived: the ⛔ framing paragraph is the **very next paragraph** and explicitly binds (*"read them before acting on one"*), so a reader who continues two lines is corrected. Same self-correction that put **R10** at low. Held above nothing-at-all because it is the **first** instruction an operator reads and `0341` pastes it twice. |
| R15 | CORRECT | Defect (test gap) | ⭐ **Pinned, ruling AL2 — new constant `FRAMING_RULE` (A12) + new test `T16`.** Flat mode; board-agnostic by construction (no board word appears in the paragraph). ⭐ **Red-proved, not assumed** — see the red-proof below this table. ⚠️ **Accepted cost, named and paid in full:** the suite is now **`T0`–`T16`, 17 tests**, and every present-tense count claim was updated (list in the *Coder response* note below). ⛔ **`test/prove-red.sh` was NOT edited** — verified on disk this turn: its index is a **mutation** index (1–34), it carries no mover-suite test count, and `T16` appears nowhere in it, so the fence's *"index count only, if `T16` changes it"* did not fire. | ✅ done | **medium** — I re-derive the reviewer's label rather than inherit it. The gap is not "a paragraph lacks a pin": it is that the paragraph carrying the authority framing for **two byte-exact-pinned imperatives** (`DELETE_RULE`, `THIRD_DIRECTION`) was itself unpinned, so the suite would have stayed green over the exact authority defect **R8** was raised to fix — and, as R13 proves, over a regression in the opposite direction too. Below high because it is a guard gap, not a live wrong instruction. |
| R16 | PARTIALLY CORRECT | Defect (record) | ⛔ **Recorded, NOT fixed — ruling AL5, and deliberately not a third rewrite of `T7`'s title.** Both the reviewer and **AK1** already ruled against inventing further phrasings. Entered in *Accepted residuals* below as **"`T7`'s title and `why:` are true but incomplete"**. ⚠️ Same vocabulary note as **R10–R12**: `won't fix (frontier)` is the status vocabulary's only value meaning *accepted residual*, and is used for that here, **not** as a claim that the incompleteness is intended. | won't fix (frontier) | **low** — verified both halves of the reviewer's own claim on disk: the title and `why:` are **true as written** (existential, correctly hedged post-`AK1`) and they **do** under-describe `THIRD_DIRECTION`, which leads with *"repair the link"*. Low because the reader is a developer reading `node --test` output, never the operator running the mover; the **pinned prose is correct either way**; and a third rewrite of one title is a worse trade than a residual. |

⭐ **The `T16` red-proof — measured, not reasoned about.** Two mutant trees built from the live
`claude/` via `FKIT_MOVER_STEP_ROOT`, both **two-sided** (the one-sided case is already `T12`'s):

| Mutation (both movers) | Before this round | After |
|---|---|---|
| Delete the **whole** framing paragraph | **16/16 GREEN** (the reviewer's measurement, and the reason R15 is medium) | ⭐ **17 tests, 16 pass, 1 fail — `T16` red, alone.** `T12` green (both copies changed together, so uniformity still holds — exactly the blind spot now closed) |
| Delete **only** the R13 half (*"Exactly one repair below is yours … not unfinished for it."*) | n/a — the sentence did not exist | ⭐ **17 tests, 16 pass, 1 fail — `T16` red, alone.** Both halves of the paragraph are genuinely pinned, not just its opening |

⭐ **Where the test count was updated — every place, enumerated.** ⚠️ **Two dated figures were
deliberately NOT renumbered**, because rewriting a past measurement to a present number falsifies the
record; each was given a superseding note instead. This is the same disposition the owner ruled for
R12's dated *"one hunk"*.

| Place | Was | Now |
|---|---|---|
| `test/mover-exemption-step.test.js` § R3 comment, *"left this suite **16/16 pass, 0 fail**"* | present-tense-reading | **kept as the dated figure**, with *"a DATED figure: the suite was 16 tests then and is 17 now, since round-3 R15 added `T16`"* appended |
| `…/worklog.md` § *"4. `test/mover-exemption-step.test.js` (new) — 16 tests"* | `16 tests` | **`17 tests`** |
| `…/worklog.md` **AK1** row, *"still `T1`–`T15`, 16 tests"* | present-tense-reading | **kept as AK1's dated claim**, with an explicit *superseded by AL2* note |
| `…/review.md` **AK1** addendum, *"the suite is still `T1`–`T15`, 16 tests"* | present-tense-reading | **kept**, with the ⚠️ superseding line added immediately above this round-3 section |
| `…/review.md` + `…/worklog.md` round-3 verification tables | — | state **17/17** outright |
| `test/prove-red.sh` | — | ⛔ **unchanged** — no mover-suite test count exists in it; its index counts **mutations**, still **34** |

### Round 4 — R17–R18, under owner rulings **AM1–AM3** (2026-09-12)

⛔ **Worst news first: this is the SEVENTH pass over this clause, and for the THIRD round running the
previous round's own fix created the next instance** (R8→R13, R13→R17). R17 is **mine**, introduced by
my round-3 R13 fix. The reviewer's read, which the owner accepted, is that *"this clause has reached
the point where each fix costs about one new instance."*

⛔ **This round closed without an eighth verification pass — ruling AM3.** Every figure below is my
own red-proof, re-measured this turn; nothing is inherited. Both findings verified against the code on
disk before any edit; neither matched an *Accepted residual* or an ADR's "re-raise only if", so neither
is re-litigation. No `pending approval` rows — this round ran under `/fkit-sprint-ship-loop`'s standing
approval plus rulings **AM1–AM3**, all relayed from a live `AskUserQuestion`.

| #   | Verdict | Defect / Frontier | Action | Status | Severity (mine) |
|-----|---------|-------------------|--------|--------|-----------------|
| R17 | CORRECT | Defect (regression, mine) | ⭐ **Fixed at BOTH pinned sites in one change, ruling AM1**, with `FRAMING_RULE`, `AUTHORITY_RULE` and both `why:` texts (`T16`, `T9`) moved in lockstep. ⛔ **I verified the vacuity claim myself before relying on it, as AM1 required:** `collectFiles()` is `walk(path.join(root, 'ai-agents'))` (`test/reference-integrity.test.js:190-192`) and `L7` (`:578-587`) asserts `strays` is `[]`, so **every `L2` red is under `ai-agents/` by construction** and *"that edit is under `ai-agents/`"* is a test that is always true. **Both halves of the fix landed, because the finding has two halves. (a) The attribution qualifier is restored.** The framing paragraph now reads *"**Exactly one repair below is yours:** `L2`'s leading branch, repairing a markdown link **this move broke**. Attribution binds here too: an `L2` red this move did not cause is pre-existing — report it, leave it alone."* and the authority gate *"**An `L2` red you answer by repairing the link is not this case:** where **this move** broke the link, that repair is yours to land … A red this move did not cause is still pre-existing, and still left alone."* **(b) The vacuous justification is replaced by the real one, and named as vacuous rather than silently deleted** — *"And *\"the edit is under `ai-agents/`\"* is no test at all: the guard scans nothing else, so it holds for every `L2` red. What makes this one yours is *\"Then prove it.\"* above — a move is not finished while a link **it** broke is still broken"*. ⭐ **Refuting it explicitly is deliberate anti-recurrence**: this defect class has returned seven times, and a silently-deleted reason invites re-adding. ⛔ **`BLOCK_END` did not move** — both edits sit above the attribution bullet's final sentence; regex byte-unchanged, anchor 1× per mover. ⛔ **AH1's fix untouched** — the `L2` `NEEDS-DECISION` content item (citing file, line text, unresolved target) survives verbatim. | ✅ done | **low** — I adopt the reviewer's cap and re-derive it: the corrective sits in the **same paragraph as its first named rule**, under an opening binding *"every repair below"*; the blast radius is a benign markdown-link edit under `ai-agents/`, visible in `git status`, never a `NAMED_EXEMPT` or `L3` edit. Held **above nothing** because it is the seventh instance, both binding sites carried it, and `0341` pastes the clause twice. |
| R18 | CORRECT | Defect (test gap) | ⛔ **Recorded, NOT fixed — ruling AM2: R14's sentence is deliberately left unpinned.** Entered in *Accepted residuals* below in full. ⭐ **I re-measured the reviewer's claim myself rather than inherit it** (AM3 leaves no one to check it): reverting R14's sentence two-sided to its exact pre-fix wording (*"and its own failure messages name the right action, so the rule here is to run it and obey what it says."*) via `FKIT_MOVER_STEP_ROOT` leaves the suite ⛔ **17/17 GREEN, 0 fail** — `T16` green, `T12` green. The reviewer's figure reproduces exactly. ⚠️ Same vocabulary note as R10–R12 and R16: `won't fix (frontier)` is the status vocabulary's only value meaning *accepted residual*, **not** a claim the gap is intended. | won't fix (frontier) | **low** — the sentence is descriptive rather than binding, and the authority it defers to (*"which is what the two rules below settle"*) **is** now pinned by `T16`, so a silent revert leaves a reader corrected by the pinned paragraph two lines down. Same cap that put R14 itself at low. |

⭐ **The round-4 red-proof — seven scenarios, all two-sided (both movers), all measured this turn**
against mutant trees built from the live `claude/` via `FKIT_MOVER_STEP_ROOT`. ⛔ **A control run is
included**, because a mutation that reds a tree that was already red proves nothing:

| Scenario (applied to BOTH movers) | Result | Reads |
|---|---|---|
| **P0 control** — unmutated copy | **17 pass / 0 fail** | GREEN — the seam is honoured and the tree is clean |
| **P1** — delete the **whole** framing paragraph | **16 pass / 1 fail** | ⭐ **`T16` red, ALONE.** `T12` green (both copies changed together) — reproduces round 3's proof after this round's edit |
| **P2** — delete **only** the R17-affected framing half | **16 pass / 1 fail** | ⭐ **`T16` red, alone** — the new wording is genuinely pinned, not merely adjacent to a pin |
| **P3** — revert the R17 framing half to its **exact pre-fix (defective) wording** | **16 pass / 1 fail** | ⭐ **`T16` red, alone** — ⛔ **this is the anti-regression proof**: a silent return to the vacuous wording now reds |
| **P4** — delete **only** the R17-affected authority sentence | **16 pass / 1 fail** | ⭐ **`T9` red, alone** |
| **P5** — revert the R17 authority sentence to its **exact pre-fix wording** | **16 pass / 1 fail** | ⭐ **`T9` red, alone** — the second site is anti-regression-proved too |
| **P6** — revert **both** R17 sites together (the exact regression R17 describes) | **15 pass / 2 fail** | ⭐ **`T16` + `T9` red** — the full defect is caught at both binding sites |
| **P7** — **[R18 measurement]** revert **R14's** sentence to its exact pre-fix wording | **17 pass / 0 fail** | ⛔ **GREEN — the gap is real.** `T16` green, `T12` green. This is the residual AM2 accepts |

⭐ **Mutation re-confirmation at the NAMED assertions** — `prove-red` mutations **33** and **34** target
`DELETE_RULE` and `INVERSION`, sentences this round did not touch; both were re-run in the full gate and
each redded **its own** named assertion (`33` → *"T3 … targetIsBack delete rule"*, `34` → *"T11 …
board-dependent sentences"*), which is what `prove-red`'s title greps require — a red for the wrong
reason fails that gate.

⚠️ **One recorded figure I could not reproduce by the method I first used, stated rather than quietly
adjusted.** The *"`diff -U0` 4 groups / `diff -u` 3 hunks"* snapshot is the **canonical ⇄ mirror** gap
(each mover against its stale `.claude/` copy), **not** the done ⇄ cancelled uniformity diff; measured
correctly it is **4 groups / 3 hunks per mover, unchanged by this round** (verified against a
reconstructed pre-R17 tree: 4/3 before, 4/3 after), with the mirror clause still **37** lines. The
done ⇄ cancelled diff is a separate figure: **board-folded diff empty**, 2 raw change groups, all of
them board-word lines only.

## Accepted residuals (shared, do-not-re-litigate)

- **R14's lead-in sentence is UNPINNED — a silent revert to its pre-fix wording stays green** (round 4,
  **R18**, ruling **AM2**) — **What:** the lead-in's closing sentence now reads *"… its own failure
  messages name **the repair each one needs** — but **never who lands it**, which is what the two rules
  below settle. Run it, then read its red against them."* It appears in **no constant**: `LEAD_IN` pins
  only the bolded opening phrase and `THREE_DIRECTIONS` only the *"Moving a folder into …"* sentence, so
  the sentences between them are held by nothing. **The sentence is NOT pinned, and is deliberately left
  that way** · ⛔ **The measurement, re-run by me this turn and not inherited:** reverting that sentence
  **two-sided** to its exact pre-fix wording (*"and its own failure messages name the right action, so
  the rule here is to run it and obey what it says."*) via `FKIT_MOVER_STEP_ROOT` leaves the suite
  **17/17 GREEN, 0 fail** — **`T16` green, `T12` green** (both copies change together, so uniformity
  still holds). Scenario **P7** of the round-4 red-proof above · **Why (structural):** the authority the
  sentence defers to — *"which is what the two rules below settle"* — **is now pinned by `T16`**, which
  landed in round 3. A silent revert therefore leaves a reader corrected by a pinned paragraph two lines
  down, which is the same self-correction cap that held **R14** itself at low. Pinning it would add a
  fourth byte-exact constant over one descriptive sentence in prose that **seven passes have already
  churned**, and every added pin raises the cost of the next legitimate reword — the trade AM2 declined.
  ⚠️ A **defect**, not a designed tradeoff — `won't fix (frontier)` is the status vocabulary's only value
  meaning *accepted residual* · **Re-raise only if:** `T16`/`FRAMING_RULE` is removed or weakened (the
  correcting paragraph would then no longer be pinned, and this sentence's cap disappears with it),
  **or** the sentence is observed reverted or reworded in a way that re-states authority rather than
  deferring it, **or** a task takes the whole lead-in paragraph as its surface (which would sweep this up
  with `THREE_DIRECTIONS` and `LEAD_IN` together).

- **`T7`'s title and `why:` are true but INCOMPLETE — they name only the exemption branch** (round 3,
  **R16**, ruling **AL5**) — **What:** post-**AK1** the title reads *"T7 both movers: the THIRD
  direction — a move can break a **quoted** link that needs a NEW key"* and the `why:` *"A move can
  also BREAK a **quoted** link, which needs a NEW key with its reason"*. **Both are true and correctly
  hedged** — this is not the universal claim **AK1** removed. What neither states is that the
  direction's **default is repair**: the constant they pin (`THIRD_DIRECTION`) leads with *"**repair
  the link**"*, and the `A6` comment above it says *"⛔ IT MUST CARRY BOTH BRANCHES … and repair must
  lead"*. **Neither string is reworded** · **Why (structural):** ⛔ **this would be the THIRD rewrite of
  one test title's wording, and both the reviewer and ruling AK1 already declined to invent a further
  phrasing** — **AK1** explicitly refused to combine both hedges for exactly that reason. The audience
  is a developer reading `node --test` output, never the operator running the mover; the **pinned
  prose is correct either way**, and `T16`'s arrival this round means the clause's repair-vs-exempt
  authority is now pinned in its own right. ⚠️ A **defect**, not a designed tradeoff — `won't fix
  (frontier)` is the status vocabulary's only value meaning *accepted residual* · **Re-raise only if:**
  `THIRD_DIRECTION`'s *"repair is the default"* sentence is removed or reworded (at which point the
  title would describe a constant that no longer says what it says), **or** a reader is observed acting
  on `T7`'s title as if exemption were the default, **or** a task takes the whole title/`why:` surface
  of this file (which would sweep up **R12** and the `MIN_BLOCK_LINES` comment with it).

- **`MIN_BLOCK_LINES`' comment states a stale block length** (round 2 addendum, **AK2**) — **What:**
  `test/mover-exemption-step.test.js` line 246 reads *"A GATE, not a pin. The live block is **30** lines
  in both files; this is the floor below which an 'extraction' is not a block at all. Deliberately well
  under 30 …"*. **Measured 2026-09-12: 46 lines** in both canonical movers
  (`claude/skills/fkit-task-done/SKILL.md` lines 324–369, `claude/skills/fkit-task-cancelled/SKILL.md`
  lines 243–288). The sentence is left unedited, and so is the second *"well under 30"* in the same
  comment · **Why (structural):** record accuracy only, no behaviour — the **gate itself is unaffected**
  (`MIN_BLOCK_LINES = 22`, and the live block is more than twice that, so the floor is nowhere near
  binding). Same class as **R10/R11/R12**, which ruling **AJ3** had just parked; ruling **AK2** parks
  this one on the same ground rather than pay a further edit to a file whose narrow verification pass
  (**AJ2**) is about to re-read it. ⚠️ **A defect, not a designed tradeoff** — `won't fix (frontier)` is
  the status vocabulary's only value meaning *accepted residual*, and is used here for that, not as a
  claim of intent · ⚠️ **The number is inherently drifty and has now moved three times: 30 → 39 → 46
  → 52.** ⭐ **Re-measured 2026-09-12 after the round-3 R13/R14 edits: 52 lines** in both canonical
  movers (`claude/skills/fkit-task-done/SKILL.md` lines 324–375, `claude/skills/fkit-task-cancelled/SKILL.md`
  lines 243–294). The superseded snapshot **46** is preserved above rather than overwritten, and the
  **gate is still unaffected** — floor **22**, block **52**, further from binding than before.
  ⛔ **This is a snapshot correction by the party that moved the number, NOT a re-raise.**
  Any prose figure here is a snapshot; a reader must **measure**, never quote this one. ⛔ Do **not**
  answer the next drift by re-raising this residual — see the trigger · **Re-raise only if:** the block
  is trimmed to within ~10 lines of the 22-line floor (at which point the comment's "well under" claim
  starts to matter), **or** `MIN_BLOCK_LINES` itself is changed, **or** a task takes the whole
  header-accuracy surface of this file (which would sweep up **R12** with it).

- **"stop" carries two meanings in the clause** (round 2, **R10**) — **What:** the green bullet's
  *"record the guard's measured named-exempt figure in the report and **stop**"* (= end this step) and
  the authority gate's *"**stop** and return a `NEEDS-DECISION` … treat the close as unfinished"*
  (= halt the whole close) keep the same word four bullets apart; **neither is reworded** ·
  **Why (structural):** the collision is real, but it is **self-correcting inside its own bullet** —
  the green bullet's very next sentence, *"This is the common case, and the step is a no-op"*, tells a
  reader who finishes the bullet that the **step** ended, not the close. **No wrong action follows
  either reading**, which is what separates it from R8/R9, the two rows this round did fix. Ruling
  **AJ3** weighed a fifth prose edit against a clause the round-2 narrow pass is about to re-read, and
  chose to record. ⚠️ It is a **defect**, not a designed tradeoff; it is recorded because the owner
  ruled it accepted, not because it is intended · **Re-raise only if:** the disambiguating sentence
  (*"the step is a no-op"*) is removed or reworded, **or** an operator is observed ending a close at
  the green bullet, **or** a third use of "stop" enters the clause.

- **`L3` is a fourth red state the clause does not route** (round 2, **R11**) — **What:** the clause
  routes Green, `L4`×2 and `L2`, and its lead-in says *"The guard already computes all three
  directions"*; a newly-broken link whose `(citing file, target)` pair already matches an existing
  `NAMED_EXEMPT` key reds **`L3` alone**, and no bullet and no `NEEDS-DECISION` content item names that
  case · **Why (structural):** reachability **verified, not assumed** —
  `test/reference-integrity.test.js:375` is `if (NAMED_EXEMPT.has(rel + '::' + t)) { namedExempt++;
  continue; }`, so the link never reaches `broken`, `L2`/`L4` stay green, and the equality at `:451`
  reds by itself. But **nothing is mis-routed**: `L3`'s own message self-routes both directions
  (*"A RISE means a new unresolved link happens to match an existing (file, target) key and is being
  silently swallowed … A FALL means an exemption stopped applying; L4 should say which"*), and the
  **destination is identical for every arm** — any fix edits `test/reference-integrity.test.js`, which
  the authority gate already hands to a coder. Closing it costs a fourth direction bullet **plus**
  re-opening the lead-in's "all three directions" sentence and both movers' pinned constants — a
  structural widening of a clause `0341` is about to paste twice, for a red whose own output already
  carries the rule. Ruling **AJ3**. ⚠️ A **defect**, not a designed tradeoff · **Re-raise only if:**
  `L3`'s message stops self-routing, **or** the authority gate stops covering an arm with no offending
  key, **or** an `L3`-only red occurs in a real close and the operator does not reach a coder.

- **The suite header's "NOT IN FORCE" claim is stale** (round 2, **R12**) — **What:**
  `test/mover-exemption-step.test.js`'s header, § *"⚠️ WHAT THIS FILE DOES AND DOES NOT DETECT"* item 2,
  still reads *"canonical and mirror DIVERGE the moment this change is committed, and the step is NOT
  IN FORCE in this repo until the owner re-runs init."* **Measured 2026-09-11: both `.claude/` mirrors
  DO carry the clause** (exactly one occurrence each), so the step **is** in force in this repo, in its
  pre-**AH1** wording. The sentence is left unedited · **Why (structural):** record accuracy only, no
  behaviour — the same class as **R6**, and the **same false claim** the shared `.claude/` residual
  above already corrects for the ledger; ruling **AJ3** records it rather than paying a third edit to
  this file in a round whose verification pass is deliberately narrowed to two bullets.
  ⚠️ **This round moved the number, and the residual must not freeze the old one:** before it, canonical
  ⇄ mirror differed by **exactly one hunk** each (the **AH1** authority-gate bullet); **after** the
  R8/R9 edits the gap is **five change groups each** — ⛔ **re-measured 2026-09-12 and here is the
  method, because the figure depends on it:** `diff -U0` (and plain `diff`) reports **5** groups per
  mover, while `diff -u`'s default 3-line context merges them into **3** hunks. **5 is the current
  number**; ⛔ *"one hunk"* is the **superseded** figure and is current nowhere. The `.claude/` mirrors
  also still carry the **pre-R8/R9** clause at **37 lines** against canonical's **46**.
  ⭐ **ROUND 3 MOVED IT AGAIN — re-measured 2026-09-12 after the R13/R14 edits, same two methods, and
  it went DOWN, not up:** `diff -U0` and plain `diff` now report **4** change groups per mover (the
  R13 framing-paragraph edit merged two previously separate groups), `diff -u` still **3** hunks, the
  mirrored clause still **37** lines, canonical now **52**. ⛔ **4 is the current number**; both **5**
  and **one hunk** are superseded and preserved above only as history. ⛔ *"No exemption
  step in force"* remains the stale claim and must not be repeated · **Re-raise only if:** the owner re-runs
  init (which inverts the claim again and makes the sentence briefly true, then false), **or** the
  sentence is copied into `0341`'s records or ingested into the wiki.

- **`T12`'s corrected non-vacuity assert has no red-proof** (round 1 addendum, **AH2**) — **What:**
  `T12`'s floor check was `a.raw.length` — the **character** count, measured **3045**, compared against
  a **22-LINE** floor — and is now `a.raw.split('\n').length`. The corrected assert **stands** and
  **no `prove-red` mutation backs it**; its own comment says it is defensive · **Why (structural):** no
  input can red it. The gate inside `extractBlock()` **throws** on a sub-floor block before one can
  reach `T12`, and **`T15` red-proofs that gate** — so the property "a near-empty extraction never
  compares UNIFORM" is proved, just one layer down. Manufacturing a red-proof would mean **weakening
  the gate** to let a sub-floor block through; the only alternative is keeping a **known-false**
  character-count assert purely to preserve the sentence *"every assertion is red-proved"*, which is
  strictly worse than a defensive assert that declares itself one. The reviewer ruled it acceptable
  **with that evidence**, and ruling **AJ3** records it so it is not re-raised a third time ·
  **Re-raise only if:** `extractBlock()`'s sub-floor gate is removed or made non-throwing — at which
  point the assert becomes reachable and therefore red-provable, and must be proved.

- **Stale "All 28 prove-red mutations" count** — What: the count in `test/reference-integrity.test.js` and
  `test/coordination-citation-policy.test.js` is left stale rather than half-fixed · Why (structural):
  pre-existing (already stale at 32 before this task) and half of it lives outside 0381's fence; the build
  flagged it rather than making a partial repair · Re-raise only if: a task takes the whole surface.
- **`.claude/` mirror not refreshed** — ⚠️ **What-clause CORRECTED by the reviewer in round 2, not
  silently: the ruling is untouched, only the measured state it described.** The coder flagged this as
  stale in *Coder response* and deliberately did not rewrite a shared section; this is that disposition.
  ⛔ **Previous wording, preserved verbatim so nothing is lost:** *"What: `0381` ships canonical only."*
  **Corrected What (measured 2026-09-11):** `0381` still ships canonical only — but the owner's own init
  re-run has since landed the clause into `.claude/`, so both mirrors **do** carry it in their
  pre-**AH1** wording. ⛔ **The gap figure this clause carried is itself now superseded — corrected by
  the coder under ruling **AK1**'s round, and the prior wording preserved rather than overwritten:**
  it read *"canonical ⇄ mirror now differ by **exactly one hunk each** — the authority-gate bullet"*
  (measured 2026-09-11, before the R8/R9 edits). ⭐ **Current, re-measured 2026-09-12: five change
  groups each** — `diff -U0` and plain `diff` report **5** per mover; `diff -u`'s default 3-line context
  merges them into **3**, so the method must travel with the number. The mirrored clause is **37** lines
  against canonical's **46**. ⛔ **THAT FIGURE IS ITSELF NOW SUPERSEDED — round 3 (R13/R14) moved it a
  third time, and it went DOWN: re-measured 2026-09-12, `diff -U0` and plain `diff` report 4 change
  groups per mover** (the R13 framing-paragraph edit merged two previously separate groups), `diff -u`
  still **3** hunks, mirrored clause still **37** lines, canonical now **52**. ⭐ **4 is the current
  number**; **5** and **one hunk** are history, preserved above rather than overwritten.
  ⭐ **This is the figure the owner's `claude/fkit-claude-init.sh .` re-run
  after committing has to cover** — it is no longer one bullet. The step **is** in force in this repo;
  the **AH1**, R8/R9 **and R13/R14** wordings are not, until that re-run. ⛔ *"No exemption step in
  force"* is the stale claim and must not be repeated. · Why (structural): **unchanged** — ruling **AF4**, the refresh is the owner's, after
  committing · Re-raise only if: **unchanged** — the owner reassigns the refresh.
- **`fkit-task-cancelled` has no `OWN self-locators` block** — What: out of `0381`'s scope · Why
  (structural): ruling **AF3**; the row already exists as `0342` · Re-raise only if: `0342` is cancelled.
- **No renumbering of the movers' steps** — What: the clause extends step 5's tail · Why (structural):
  ruling **AF2**; both movers cross-reference their own step numbers in prose · Re-raise only if: the owner
  revisits AF2.
- **The suite guards source text, never behaviour** — What: nothing observes a mover actually running the
  guard during a close · Why (structural): the clause is prose in a SKILL.md; this is the reach of the
  fourth test-scope category · Re-raise only if: movers become executable.
- **`prove-red`'s "landed more than once" guards count LINES, not occurrences** (round 1, **R7**) —
  What: mutation 33's `grep -c 'mutation: delete rule inverted'` and mutation 34's
  `diff … | grep -c '^>'` are left as line counts rather than occurrence counts · Why (structural):
  **verified non-exploitable as written** — both mutations' `sed` expressions omit the `/g` flag, so at
  most one substitution per line is possible, making both counts exact for the mutations that exist;
  and hardening them means editing `test/prove-red.sh`, which is outside round 1's fence (ruling
  **AG1** deliberately chose the route that does not widen the surface). A speculative fix to a hard
  gate, applied unattended and outside the fence, is a worse trade than a recorded trigger ·
  **Re-raise only if:** either mutation's `sed` gains a `/g` flag, is switched to `perl -pi -e` or any
  global-substitution tool, or is re-anchored on text that can legitimately repeat within one line —
  **any one of those makes it exploitable, and the guard then disarms silently.**
