# Worklog — 0381 give the task movers a step for the `NAMED_EXEMPT` keys a move invalidates

Built by a spawned `fkit-coder` **Build worker** under `/fkit-sprint-ship-loop` (ADR-032 Decision 3),
on the driver's declared-approval marker. `plan.md` (blob `bb5e11afe0c22ae3c70e12679f9bfe8a983019ef`,
17072 bytes, verified against disk with `git hash-object` before the first edit) **is the autonomy
boundary**. Implemented against `HEAD` = `9943dcf13633e576761f7b76dd4a4b30c754de00`.

⚠️ **THE STEP SHIPPED HERE IS NOT YET IN FORCE IN THIS REPO.** Ruling **AF4**: `0381` ships
**canonical only** (`claude/skills/…`). The gitignored `.claude/` mirror that a mover actually reads
in this repo was **byte-identical** to canonical before this change and **diverges the moment it
lands**. A mover invoked here today still reads the OLD text, with no exemption step. The refresh
(`claude/fkit-claude-init.sh .`) is the **owner's, after committing** — it is deliberately not done
here and is not a defect to file.

⚠️⚠️ **CORRECTION (2026-09-11, after round 1) — the paragraph above is STALE as written, and the
stale version must not be read as current.** The owner has since **committed** (`HEAD` = `00d8b6b`)
**and re-run `claude/fkit-claude-init.sh .`**, so the premises have changed. Re-measured on disk this
turn, not assumed:

- The `.claude/` mirror **does now carry the exemption clause** — `Then check the exemption keys this
  move may have invalidated` occurs **once** in `.claude/skills/fkit-task-done/SKILL.md`. So "a mover
  invoked here today reads the OLD text, with no exemption step" is **no longer true**.
- **But the clause in the mirror is one bullet behind.** Diffing the extracted clause canonical ⇄
  mirror shows **exactly one hunk**: the **authority-gate bullet**. The mirror still carries the
  pre-**AH1** key-centric wording (`naming each offending key verbatim and its direction`, **1**
  occurrence in **both** mirrored movers) and **zero** occurrences of the AH1 wording. The rest of the
  clause is byte-identical.
- **Therefore the AF4 caveat still applies — but only to the AH1 fix, not to the whole step.** The
  correct statement today: *the exemption step IS in force in this repo; the `L2`-covering hand-off
  wording is NOT, and will not be until the owner re-runs init again.* A mover invoked here right now
  would still be told to name a key that, for an `L2` red, does not exist.
- The refresh remains the **owner's**, per AF4 — not done here.

## Owner-decision log

- **Plan gate (2026-09-11, `AskUserQuestion` in the driver session):** approved via **AF1–AF4**,
  appended to `plan.md` verbatim. Summary of what each bound:
  - **AF1 — "Both — manual repro + durable arms (Rec)"**: do the one-shot manual repro *and* extract
    `staleExemptions(root, keys)` with fixture arms. Both delivered; see below.
  - **AF2 — "Extend step 5's tail (Rec)"**: no new numbered step, no renumbering; bolded lead-in.
  - **AF3 — "Out of scope — file a row (Rec)"**: `fkit-task-cancelled`'s missing `OWN self-locators`
    block is NOT this task's. Named in the return instead. ⭐ **See the finding below — a row already
    exists.**
  - **AF4 — "You refresh after committing (Rec)"**: canonical only; state the not-in-force caveat
    loudly. Stated at the head of this file and in the return.

- **Fixes applied unattended, without asking (ADR-019 audit obligation) — BUILD spawn:** `none`. No
  review round ran in that spawn; every edit came from the approved plan's Sequencing steps 1–7.

- **Fixes applied unattended — PROCESS-REVIEW spawn, round 1 (2026-09-11):** **six**, all under the
  sprint-ship-loop's standing approval (the plan gate above) plus rulings **AG1–AG4** relayed live in
  the driver session. Each is verified `CORRECT`, mechanical/localized, and inside the approved plan.

  | Finding | What changed | Why it qualified |
  |---------|--------------|------------------|
  | **R1** | The three direction bullets in both movers now route on text the operator really sees — the arm name `L4`/`L2` (printed by `node --test` as the failing test's name) plus a verbatim fragment of that arm's own message. Constants `DELETE_RULE`, `REPOINT_RULE`, `THIRD_DIRECTION` updated in the same change. | Ruling **AG1**, "Reword the bullets to quote real output". Verified: `missingCiter`/`targetIsBack` occur in the guard only as destructured locals and comments — neither assertion message nor test name carries them. ⛔ The tokens were **not** added to `L4`'s messages, which keeps them byte-identical to pre-`0381`. |
  | **R2** | The third-direction bullet now carries **both** branches of `L2`'s own message with **repair leading**, instead of asserting the red is quoted text needing a new key. The `Attribute before touching anything` bullet gained an `L2` referent (the broken link's citing file or target) for the case where no key exists yet. | Verified against `L2`'s message text. The old wording converted a loud deterministic red into a silent permanent exemption — the exact failure the plan rejected option B for — and the attribution bullet contradicted the bullet three lines above it. In-plan under **AG2** ("land them in 0381"). |
  | **R3** | `T2`–`T11` now match against the **extracted clause** (`clauseOf(name)`), not the whole `SKILL.md`. One-line `source:` change per test plus the helper. | Ruling **AG3**. The reviewer's disproof was re-run here: relocating the delete rule to an `## Appendix` in both movers went from **16/16 green** to **T3 red, "found 0"**. The extraction and its gate already existed; only the `source:` was wrong. |
  | **R4** | The `Green` bullet no longer tells the operator to record a `named-exempt: N` line. It names the real shape — `L8`'s tail, e.g. `0 broken, 7 named-exempt`, number before the words. | Ruling **AG4**. Measured: the guard prints `scanned 899 files, resolved 3492 link targets, 0 broken, 7 named-exempt`. No such `named-exempt: N` string is emitted anywhere. |
  | **R5** | `T13` rewritten to drive T12's **real** path (`extractAndDedent` → `foldBoard` → comparison) over synthetic clauses, with a positive control (a) and two discriminating arms (b) reword and (c) missing board swap. Retitled. `foldBoard` and the synthetic anchors hoisted to module scope. | Ruling **AG4**. Verified vacuous: the old body compared two literals differing in `'y'`/`'z'` and never invoked `extractBlock`, `dedent` or `forBoard`. The new one was proved to discriminate — a board-blind `foldBoard` reds `T13(c)`. |
  | **R6** | The worklog's *"whole argument for `L4` being an equality arm rather than a ceiling"* sentence corrected, with the correction shown rather than silently overwritten. | Ruling **AG4**. Verified on disk: `L3` holds `assert.equal(LIVE.namedExemptCount, 7)`; `L4` holds two `assert.deepEqual(…, [])` arms. A record error about a measurement, read by `0341`'s author and the wiki ingest. |

- **Obvious-winner calls made unattended — round 1:** **one**, and it is **beyond R1–R7**; flagged to
  the owner in the return rather than buried here.

  4. **`T12`'s own non-vacuity assert counted CHARACTERS against a LINE floor.** `extractAndDedent`
     joins to a **string**, so `a.raw.length` was `3045` measured against `MIN_BLOCK_LINES = 22`.
     That assert could not fail for any block above 22 *characters* — vacuous. Changed to
     `a.raw.split('\n').length`. **Why it qualified:** one line, in the fence, in the same test, and
     found while fixing `R5` — whose own rationale asserted the opposite ("T12's actual non-vacuity is
     held by its own `MIN_BLOCK_LINES` assert … both real"). Non-vacuity was in fact held by the
     extraction gate **alone**. ⚠️ **No red-proof is available for it**: the gate inside
     `extractBlock()` throws before a sub-floor block can ever reach `T12`, so the corrected assert is
     defensive only — which is exactly what its comment claims it is for. **Trivially reversible** if
     the owner would rather it had been a separate row.
     ⭐ **DISPOSED 2026-09-11 — owner ruling AH2, "Keep it (Rec)": the fix STANDS, not reverted.**
     Basis given: it is a genuine bug in the assert that was supposed to be the safety net — the
     **character** count (3045) against a **22-line** floor — and it was flagged rather than buried.
     The no-red-proof caveat above is unchanged and still stands.

- **Fixes applied unattended — PROCESS-REVIEW spawn, round 1 addendum (2026-09-11):** **one**, and it
  is **NOT** an unattended call at all — it was applied on an **explicit owner ruling**, **AH1**
  ("Fix it now inside 0381 (Rec)"), relayed live from the driver session. Recorded here anyway so the
  round's change surface is complete and a wrong fix stays findable.

  | Finding | What changed | Why it qualified |
  |---------|--------------|------------------|
  | **Coder-found third instance of R2's defect** (the reviewer found two and missed this one) | The **authority-gate** bullet in **both** movers: the `NEEDS-DECISION` hand-off now reads *"naming what the red points at verbatim — each offending key and its direction, or, for an `L2` red where there is no key yet, the broken link's citing file, its line text, and its unresolved target"*. The pinned constant `AUTHORITY_RULE` (`T9`) updated in the same change. | ⭐ **Owner ruling AH1** — not autonomy. Basis given by the owner from their own **AG2**: *get the clause right ONCE, before `0341` copies it twice*; fixing two of three instances and shipping the third is the outcome AG2 exists to prevent. ⭐ The gate's **job** (stop, hand off to a coder) was already correct and is **untouched**; only the hand-off's **content** was key-centric. ⚠️ **Costs named in the ruling and PAID, not skipped**: a pinned-constant change and a full `prove-red` re-run (§7c). |

- **Obvious-winner calls made unattended — round 1 addendum:** **none.** AH1 and AH2 were both owner
  rulings; nothing else was decided in this spawn.

- **Fixes applied unattended — PROCESS-REVIEW spawn, round 2 (2026-09-11):** **two**, and like the
  addendum above **neither is an unattended call**: both were applied on an **explicit owner ruling**,
  **AJ1** ("Fix both in 0381 now (Rec)"), relayed live from the driver session. Recorded anyway so the
  round's change surface is complete and a wrong fix stays findable. ⛔ **R10, R11 and R12 were NOT
  fixed** — ruling **AJ3** recorded all three, plus **AH2**, as accepted residuals.

  | Finding | What changed | Why it qualified |
  |---------|--------------|------------------|
  | **R8 — the repair bullets command edits the authority gate forbids** (found by both reviewers independently) | **Both movers, three identical changes.** (a) A new framing paragraph **before** the bullets: *"Two rules bind every repair below — read them before acting on one. **Attribute the red first** … And **you may run this guard, you may not edit it** — each direction below names the repair a red *requires*, and that repair is what you put in the `NEEDS-DECISION`, not what you do. A coder lands it."* (b) The repoint bullet's post-edit step attributed to its real actor: *"the coder **re-runs the guard** after that edit"*. (c) The count bullet likewise: *"read from a re-run of the guard once the edit lands … again the coder's step, not yours."* Pinned constants `REPOINT_RULE` and `INSTANCES_RULE` updated in the same change. | ⭐ **Owner ruling AJ1** — not autonomy. Verified `CORRECT` first: `NAMED_EXEMPT` and `L3`'s count both live in `test/reference-integrity.test.js:375,451`, so repointing / deleting / adding a key **is** editing the file the gate forbids editing, and the producer therefore never reaches either "re-run". `plan.md` § *"Authority gate"* settles the intent (*"may run the guard … but must not edit it"*), so the fix is to say the repairs are what to **name**, not what to **do**. ⛔ Two deliberate non-changes: `DELETE_RULE` was left byte-identical (it is pinned byte-exact **because** *"do not repoint it"* must not soften), and no JS identifier was reintroduced — `missingCiter`/`targetIsBack` still occur **0** times in either mover (R1 non-regression, measured). ⭐ The **ordering** half was fixed by **framing** rather than by moving the `Attribute` bullet: that bullet's last sentence **is** `BLOCK_END`, so moving it would relocate the extraction anchor. |
  | **R9 — a fourth instance of R2's defect, in the clause's first sentence** | **Both movers:** the lead-in's third direction, *"break a fresh link that **needs a new one**"* → *"break a fresh link that **needs repairing**"*. The pinned constant `THREE_DIRECTIONS` moved in **lockstep**, as `T11` requires. | ⭐ **Owner ruling AJ1**, on the basis of the owner's own **AG2** (*get the clause right ONCE*). Verified `CORRECT`: "a new one" refers to a new `NAMED_EXEMPT` key, which the `L2` bullet twenty lines below directly contradicts (*"**repair is the default**: a new key on a link that should resolve converts a loud deterministic red into a silent permanent exemption"*). Mechanical and localized — one clause, one sentence, one constant. ⚠️ The lockstep was load-bearing, not optional: without it `T11` reds on the correct edit. |

- **Obvious-winner calls made unattended — round 2:** **none.** Both fixes came from ruling **AJ1**;
  the residuals from **AJ3**. ⭐ **Two further instances of the same wording defects were FOUND and
  deliberately left**, surfaced to the driver rather than applied, because neither is R8 or R9 and
  widening ruling **AJ2**'s narrow two-bullet verification pass was not this spawn's call:
  **(1)** `T7`'s test title in `test/mover-exemption-step.test.js` is a **fifth** instance of R9's
  defect (*"a move can break a link that needs a NEW key"*, dropping the *quoted-text* qualifier the
  same test's `why:` and the `A6` comment both keep) — ⛔ verified safe to change if approved:
  `test/prove-red.sh` anchors mutations 33/34 on the `T3` and `T11` titles, never `T7`'s;
  **(2)** the `MIN_BLOCK_LINES` comment still says *"The live block is 30 lines in both files"* —
  measured **46** now, and it read 39 **before** this round, so it is pre-existing drift of the same
  record-accuracy class **AJ3** just parked. The gate itself is unaffected (floor 22, block 46).

- **Round 2 addendum — owner rulings AK1–AK2 (2026-09-12, `AskUserQuestion` in the driver session).**
  ⭐ Both dispose of the two instances the bullet immediately above surfaced and left. ⛔ **Not a round
  3** — no new finding, no reviewer row touched, no status change; the ledger stays `in-review` for
  ruling **AJ2**'s narrow pass, which now reads final text because **AK1** ordered the fix landed
  first.

  | Ruling | What changed | Why it qualified |
  |--------|--------------|------------------|
  | **AK1 — "Fix it now, before the narrow pass (Rec)"** | `test/mover-exemption-step.test.js`, **one line**: `T7`'s `test(...)` title. **Before:** *"T7 both movers: the THIRD direction — a move can break a link that needs a NEW key"*. **After:** *"T7 both movers: the THIRD direction — a move can break a **quoted** link that needs a NEW key"*. ⛔ Nothing else touched: **no test added, removed, or otherwise renamed**; still `T1`–`T15`, 16 tests. ⚠️ **Dated claim, true of AK1 and SUPERSEDED by AL2** — round 3 added `T16`; the suite is now `T0`–`T16`, **17** tests. | ⭐ **Owner ruling, not autonomy.** The word added is the `why:` text's own qualifier (*"BREAK a **quoted** link, which needs a NEW key with its reason"*); the `A6` comment hedges the same claim with *"**may** need"*. ⛔ **No sixth phrasing invented** — the title now matches the `why:` wording, which is the hedge **AK1** names. Basis: **AG2** (*get the clause right ONCE*) reaches the pin's own title, and `0341`'s author reads this file. |
  | **AK2 — "Leave it — consistent with AJ3 (Rec)"** | ⛔ **Nothing.** `MIN_BLOCK_LINES`' comment (*"The live block is 30 lines in both files"*, measured **46**) left unedited; entered in `review.md` § *Accepted residuals*. | ⭐ **Owner ruling**, matching the coder's own lean: same record-accuracy class as **R10–R12**, which **AJ3** had just parked. The gate is unaffected (floor **22**, block **46**). ⚠️ The residual records that the number has moved **twice already (30 → 39 → 46)** and will drift again on the next edit, so its re-raise trigger is the floor getting close — **not** the next drift. |

  ⛔ **Safety re-verified on disk this turn before the edit, not carried over from round 2.**
  `test/prove-red.sh` greps mutation **33**'s red for `(✖|not ok|fail).*targetIsBack delete rule` and
  mutation **34**'s for `(✖|not ok|fail).*board-dependent sentences` — substrings of the **`T3`** and
  **`T11`** titles, both unchanged. `T7` occurs **nowhere** in `test/prove-red.sh`. Then re-confirmed by
  **running** the gate: 33 red at *"T3 … targetIsBack delete rule"*, 34 red at *"T11 … board-dependent
  sentences"*, pre-gate `0o` green.

  **Re-measured after the edit (`HEAD 00d8b6b`, unmoved):** `npm run test:unit` **913/913** ·
  `test/reference-integrity.test.js` **22/22** · `mover-exemption-step` **16/16** ·
  `npm run test:prove-red` **PASSED, exit 0, 34 mutations, zero `✗`**. ⚠️ `npm test` was **not** run as
  one command — the two scripts were run separately, which is exactly what it chains.

  ⭐ **One record correction carried in the same pass** (`review.md` only, no source): the canonical ⇄
  mirror gap. The `.claude/` mirror residual still read *"exactly one hunk each"*; **re-measured
  2026-09-12 it is five change groups each** (`diff -U0` and plain `diff` say **5**; `diff -u`'s
  default 3-line context merges to **3**, so the method now travels with the number), and the mirrored
  clause is **37** lines against canonical's **46**. Both that residual and **R12**'s now state it, with
  the superseded *"one hunk"* wording preserved rather than overwritten. ⛔ **The `1`-hunk figure also
  appears at `review.md`'s *Reviewer findings* row R12 — left untouched**, because that section is the
  reviewer's and is a dated round-2 claim, not a current-state statement.

- **Round 3 — owner rulings AL1–AL5 (2026-09-12, `AskUserQuestion` in the driver session).** ⭐ The
  **AJ2** narrow verification pass ran and found **three novel confirmed defects** (`R13`, `R14`,
  `R15`) plus one partial (`R16`). ⛔ **`R13` is a REGRESSION introduced by my own `R8` fix** — it
  cured over-authorization by over-restricting. That is the worst news of the round and is stated
  first. The ledger stays `in-review` for a **seventh** pass (**AL4**); the driver spawns it, not me.

  | Ruling | What changed | Why it qualified |
  |--------|--------------|------------------|
  | **AL1 — "Fix both sites in one change (Rec)"** | ⭐ **`R13`, both sites, one change, in both movers.** **(a)** The **framing paragraph** stopped quantifying over every direction: the hand-off is now scoped to the guard FILE (*"wherever the repair a red requires is an edit to `test/reference-integrity.test.js` (repointing a key, deleting one, or adding one)"*) and the exception is named outright (*"**Exactly one repair below is yours:** `L2`'s leading branch, repairing a broken markdown link under `ai-agents/`"*, tied back to *"Then prove it."*). **(b)** The **authority gate** narrowed its `L2` trigger to *"an `L2` red **taking the add-a-key branch**"* and gained *"**An `L2` red you answer by repairing the link is not this case:** that edit is under `ai-agents/`, it is yours to land, and it does not leave the close unfinished."* ⭐ `AUTHORITY_RULE` **and** `T9`'s `why:` moved in lockstep. | ⭐ **Owner ruling, not autonomy.** ⛔ A one-site fix would have been the **sixth** pass to leave an instance of this defect class behind — the ruling says so and the record bears it out. ⛔ **`BLOCK_END` did not move** (it is the attribution bullet's last sentence; both edits sit above it), so the extraction anchor is untouched — the same constraint that made **R8** fix ordering by framing rather than by moving a bullet. ⛔ **AH1 is not re-litigated:** its `L2` `NEEDS-DECISION` content item survives verbatim inside the gate; only the TRIGGER narrowed. |
  | **AL2 — "Pin it — new constant + test (Rec)"** | ⭐ **`R15`.** New constant `FRAMING_RULE` (A12, flat, board-agnostic) + new test **`T16`**. Suite is now **`T0`–`T16`, 17 tests**. ⛔ `test/prove-red.sh` **NOT** edited. | ⭐ **Owner ruling.** The measurement is the argument: before this, deleting the paragraph from **both** movers left the suite **16/16 GREEN** — the only unpinned element of a byte-exact-pinned clause, and it carried the authority cover for two pinned imperatives. ⚠️ **Accepted cost paid in full:** every present-tense test-count claim updated; the two **dated** figures kept and superseded rather than renumbered. |
  | **AL3 — "Fix it (Rec)"** | ⭐ **`R14`, the SIXTH instance.** The lead-in's *"run it and **obey what it says**"* became *"its own failure messages name **the repair each one needs** — but **never who lands it**, which is what the two rules below settle. Run it, then read its red against them."* | ⭐ **Owner ruling.** For an `L2` red the guard literally says *"add it to NAMED_EXEMPT with its reason"* — the edit the gate forbids — so *"obey what it says"* commanded the forbidden action in one phrase. ⛔ **No constant moved:** the reviewer measured the sentence as unpinned and I re-confirmed it, and the two pinned sentences bracketing it (`THREE_DIRECTIONS`, `FRAMING_RULE`) are byte-unchanged by this edit. |
  | **AL4 — "One more narrow pass (Rec)"** | ⛔ **Nothing here.** Ledger left `in-review`. | ⭐ **Owner ruling.** A seventh verification pass follows and it is the driver's to spawn, not mine. |
  | **AL5 — folded in by the driver** | ⭐ **`R16` → accepted residual**, recorded in `review.md`. ⛔ **NOT a third rewrite of `T7`'s title.** | ⭐ **Owner ruling**, and it matches both the reviewer's own disposition and **AK1**, which explicitly declined to invent a further phrasing. The residual records what is missing: `T7`'s title and `why:` are **true but incomplete** — they name only the exemption branch, never that **repair is the default**. |

- **Fixes applied unattended, without asking — PROCESS-REVIEW spawn, round 3 (2026-09-12):** ⛔ **none.**
  Every source edit this round traces to a ruling above. **Five judgment calls INSIDE those rulings are
  recorded as obvious-winners below (items 4–8)** — a ruling names the fix, not the sentences, and a
  wrong choice inside one must stay findable.

- **Obvious-winner calls made unattended:** **eight** — three from the build, five from round 3.

  1. **The new fixture arms are numbered `M5`/`M6`, not `M4`/`M5` as ruling AF1 wrote them.**
     **Why it qualified:** `M4` was **already taken** in `test/reference-integrity.test.js` — the
     wiki-vault-skip arm (`M4 mutation: a broken link under ai-agents/wiki-vault/ is skipped and never
     scanned`), measured on disk before writing. Two arms sharing a number would break the one thing
     `test/prove-red.sh` depends on: grepping a red run for a **NAMED** assertion. One option
     (renumber to the next free slots) clearly dominates, and it changes nothing AF1 asked for —
     one arm per direction, orphaned and healed, against `os.tmpdir()`. **The plan's text was written
     before that collision was checked; the intent is unchanged.** Recorded in the test file's own
     header comment too, so the discrepancy with the plan is findable from either side.

  2. **Mutation 34 targets the BOARD WORD and carries no injected marker.** The plan said only "one
     [mutation] per mover". **Why it qualified:** mutation 33 already covers clause *content* (it
     inverts the delete rule). Mutation 34's job is the *uniformity* half, and the realistic drift
     there is a paste between movers that forgets the one word that legitimately differs. An injected
     marker would have reddened `T11` for the **wrong reason** (a reworded sentence, not a wrong
     board), so the wrong board word **is** the marker — `../../done/X` was measured to occur **zero**
     times in the unmutated `fkit-task-cancelled/SKILL.md`, making its presence afterwards
     unambiguous. Mechanical, localized, inside the plan's P2. **This is also the trap task `0341`
     walks into**, which is the plan's stated merit argument for shape.

  3. **The clause's exact prose.** The plan specified its six required contents (run unconditionally;
     the three directions; instances-not-keys; the authority gate; attribution + idempotence) but not
     the sentences. Written to be byte-identical in both movers **modulo the board word**, verified
     mechanically. Inside the plan's intent; nothing added beyond the six.

  4. **The replacement wording for `R13` and `R14` (round 3).** **AL1** and **AL3** name the fixes,
     not the sentences. **Why it qualified:** each rewrite is scoped to the smallest span that carries
     the defect, keeps every surrounding pinned sentence byte-identical, and preserves the clause's
     existing idiom (⛔ only on the framing paragraph, no new emoji inside bullets). The one shape
     choice with a real alternative — whether to state the producer's own repair as an exception in
     the framing paragraph **and** in the gate, or only once — was **settled by AL1 itself** ("fix both
     sites in one change"). Verified byte-identical between the two movers modulo the board word.

  5. **`T16`'s NUMBER is append-order while its POSITION is subject-order.** **Why it qualified:** the
     alternative — slotting the framing-paragraph pin in as a new `T5` and renumbering `T12`–`T15` —
     would rename the `T11` title that `test/prove-red.sh` **mutation 34** greps for, disarming a hard
     gate silently, and would stale every T-number citation in this task's records. One option clearly
     dominates. The test sits physically with its siblings `T2`–`T11` under its own banner, and the
     banner comment states the out-of-sequence number and why, so the choice is findable at the site.

  6. **`T9`'s `why:` text was extended, not just `AUTHORITY_RULE`.** **Why it qualified:** the pinned
     text now carries a second load-bearing sentence pointing the **opposite** way from the first, and
     a failure message that explains only the over-authorization half would invite the next editor to
     drop the over-restriction half as a qualifier. Mechanical, localized, inside **AL1**'s lockstep
     instruction.

  7. **The `16/16` figure in the R3 header comment was ANNOTATED, not renumbered.** **AL2** said to
     update every place stating the count. **Why it qualified:** that figure is a **dated measurement
     of an experiment run on a 16-test suite**; rewriting it to `17/17` would state a measurement that
     was never taken. It is now marked as dated and says what the count is today. ⭐ **Same disposition
     the owner ruled for R12's dated *"one hunk"*** ("Leave it — dated claim"), applied to the same
     class rather than decided fresh. The two other dated claims (**AK1**'s rows in this file and in
     `review.md`) were treated identically, with an explicit *superseded by AL2* note.

  8. **`test/prove-red.sh` was left untouched.** The fence allowed an index-count edit *"if `T16`
     changes it"*. **Why it qualified:** measured on disk, it does not. That script's index counts
     **mutations** (1–34), carries no mover-suite test count, and contains **zero** occurrences of
     `T16`. Editing a hard gate that nothing required editing is the strictly worse branch.

- **Round 4 gate (2026-09-12, `AskUserQuestion` relayed live by the driver session):** option label
  verbatim **"Fix R17, residual R18, close (Rec)"**, binding **AM1–AM3**:
  - **AM1 — fix `R17`** at **BOTH** pinned sites, moving `FRAMING_RULE`, `AUTHORITY_RULE` and both
    `why:` texts (`T16`, `T9`) **in lockstep**. Basis: `0341` pastes the clause twice, and ruling
    **AG2**'s whole basis is getting the clause right once.
  - **AM2 — `R18` → accepted residual.** ⛔ Do **not** pin R14's sentence; the authority it defers to
    is now pinned by `T16`. Recorded in `review.md` in full **What / Why (structural) / Re-raise only
    if**, including the measurement.
  - **AM3 — close on my own red-proof.** ⛔ **No eighth reviewer pass.** Set the ledger to
    `Status: closed-out` after fixing and verifying, unless something genuinely blocks.

  ⭐ **ADR-019 audit record — round 4.** Every code change this round is directly ruled by **AM1**;
  there were **no** fixes applied outside an owner ruling. Two **obvious-winner-within-intent** calls
  were made on wording, which AM1 did not specify, and both are recorded here so a wrong call is
  findable:

  1. **The vacuous justification was REFUTED IN PLACE, not silently deleted.** The clause now says
     outright *"*\"the edit is under `ai-agents/`\"* is no test at all: the guard scans nothing else,
     so it holds for every `L2` red"*, and the authority gate carries the mirror sentence.
     **Why it qualified:** the alternative — quietly dropping the phrase — leaves nothing explaining
     why it was wrong, and **this defect class has now recurred seven times, three of them created by
     the previous round's own fix**. A named refutation is what stops the eighth editor re-adding the
     same always-true test. It stays inside AM1's scope (it edits only the two sentences AM1 names)
     and it is byte-pinned by `T16`/`T9`, so a silent revert now reds — measured, scenarios **P3** and
     **P5** of the round-4 red-proof.
  2. **The attribution CONSEQUENCE was stated in both sentences, not only the qualifier.** Each site
     now ends with the disposition — *"an `L2` red this move did not cause is pre-existing — report
     it, leave it alone"* / *"A red this move did not cause is still pre-existing, and still left
     alone"* — rather than only narrowing the grant. **Why it qualified:** R17's measured failure mode
     is an operator who reads the grant and lands **every** `L2` repair; a qualifier alone tells them
     what is theirs but not what to do with the rest, and the disposition already exists verbatim in
     `ATTRIBUTION_RULE` three bullets down, so this restates the clause's own settled rule rather than
     inventing one. Mechanical and localized.

## What was done, in the plan's sequence

### 1. Baseline, re-measured at `HEAD 9943dcf`

| Measurement | Plan's value | **Re-measured** |
|---|---|---|
| `npm run test:unit` | 895 / 895 pass | **895 / 895 pass, 0 fail** · 73.5 s |
| `reference-integrity` | 896 files, 3492 targets, 0 broken, 7 named-exempt, 20 tests | **897 files**, 3492 targets, **0 broken, 7 named-exempt**, 20 tests |

⚠️ **One drift from the plan's table: 897 scanned files, not 896.** The tree gained a file between
plan time and build time. It is not this task's change (nothing was written before this measurement),
and `broken` and `named-exempt` are unmoved.

### 2. Red-first reproduction — AF1(a), both directions

Method: `cp` the pristine `test/reference-integrity.test.js` aside, plant a key into `NAMED_EXEMPT`,
run the guard, restore. Restored state verified with `git diff --quiet` (**empty**) and a re-run
(**20/20 green**). Nothing was left behind.

**Direction 1 — `missingCiter`** (citer path does not exist). Planted
`…/0381-…/NO-SUCH-FILE.md::../x.md`. Result: **`L4` RED**, 19 pass / 1 fail, with the guard's own
message naming the key and the action:

> `NAMED_EXEMPT keys whose CITING FILE no longer exists — it was renamed, moved between boards, or deleted. The exemption now suppresses nothing and hides the next rot at its new path:`

**Direction 2 — `targetIsBack`** (citer exists, target resolves). Planted `…/0381-…/plan.md::brief.md`
— `brief.md` is a real sibling, so the link resolves. Result: **`L4` RED**, 19 pass / 1 fail:

> `NAMED_EXEMPT keys whose TARGET now resolves — the link is no longer broken, so the exemption is dead weight and must be removed (and the L3 count lowered with it):`

⭐ **Two measured facts the plan did not anticipate, both recorded in code comments:**

- **The two arms are sequential `assert.deepEqual`s in one test, and the first failure MASKS the
  second.** With both keys planted at once, only `missingCiter` was reported. This is not a defect
  (the repair order is repoint → re-run anyway, which is what the movers' clause now says), but it
  **is** why the durable arms exercise each direction alone rather than trusting one live red to name
  both. Noted in `L4`'s body.
- **A stale key is INVISIBLE to `L3`.** Both plants left the count at `7 named-exempt`, because a key
  that suppresses nothing is never counted. Only `L4` sees it. That is the whole argument for **`L4`
  existing at all**, confirmed by measurement: `L3` cannot be tightened into covering this, because a
  stale key never moves the number `L3` asserts on.
  ⚠️ **Corrected in round 1 (R6).** This bullet previously read *"the whole argument for `L4` being an
  equality arm rather than a ceiling"*, which is wrong twice. **`L3` is the equality arm**
  (`assert.equal(LIVE.namedExemptCount, 7)`); `L4` is a pair of `assert.deepEqual(…, [])` arms, where
  equality-vs-ceiling does not apply. And the measurement argues the opposite of what that sentence
  concluded — `L3`'s blindness is a reason for `L4` to exist, not a reason for `L3`'s form. The
  equality-vs-ceiling argument is real, but it belongs to `L3` and rests on a different measurement
  (the 9 → 7 fall that caught three dead keys), recorded in `L3`'s own body.

### 3. The clause, in both movers

Extends step 5's existing `**Then prove it.**` tail (**AF2**: no new numbered step, no renumbering),
with the bolded lead-in `**Then check the exemption keys this move may have invalidated.**`.
**37 lines** (30 as first built; grown by round 1's R1/R2/R4 rewordings), inserted in both movers,
**byte-identical modulo the board word** (`done` ⇄ `cancelled`) — verified mechanically, and now
pinned by `T12`.

It names **one** path (`test/reference-integrity.test.js`); the design insight the plan turned on is
that the guard already computes all three directions and its own failure messages already state the
right action, so the clause tells a mover to **run the guard and obey what it says**.
⚠️ **Amended in round 1 (R1).** This paragraph previously claimed the clause names **no assertion
internals**. It now names the arms `L4` and `L2` and quotes fragments of their messages — deliberately,
under ruling **AG1**. That is not a retreat from the design insight: `L4`/`L2` are **test names
`node --test` prints on a red run**, and the quoted fragments are the **operator-visible message text**,
so every token in the clause is something a red run actually shows. What the clause still does not do
is re-derive the guard's logic, or name a JS identifier (`missingCiter`, `targetIsBack`) that appears
in no output. The grep-first early exit was **rejected** as planned, and `T5` now pins the unconditional
run so it cannot be re-introduced quietly.

### 4. `test/mover-exemption-step.test.js` (new) — 17 tests

Copies `test/wiki-flag-convention.test.js`'s *method*, not its code (that file names the method
reusable and says "Copy the method; do not grow this file into an instrument"): two named paths,
hand-written constants derived from disk, no shared extractor.

- **Two match modes** — byte-exact whole-line for the two single-line contract subjects (`T2` the
  invocation, `T3` the delete rule); whitespace-normalized for every wrapping prose subject. ⚠️ That
  file **measured six false negatives** from raw-matching wrapped prose; the split here is drawn to
  avoid the same trap.
- **Extract-and-GATE** — anchors found, exactly-once on both, ordered, and a `MIN_BLOCK_LINES = 22`
  floor (the live block is 37 after round 1; 30 as first built). `T15` proves all six refusal paths
  **throw** rather than pass, with a positive control so they are not all throwing for an unrelated
  reason.
- ⭐ **Round 1 (R3): the subject pins `T2`–`T11` match the EXTRACTED CLAUSE, not the whole file.** As
  first built they matched `readSkill(name)`, so the presence and uniformity claims held over the
  **file** — every pinned subject could leave the clause and relocate elsewhere and the suite stayed
  green. Re-measured here: relocating the delete rule to an `## Appendix` in both movers went **16/16
  green → `T3` red, "found 0"**.
- **`FKIT_MOVER_STEP_ROOT`** env seam with the stderr announcement, mirroring `FKIT_WIKI_FLAG_ROOT`.
- **`T0` roster pin.** ⚠️ **Discovery is by SIGNATURE (`### 3. Move the task FOLDER to`), not by name
  prefix** — measured: `claude/skills/` holds **four** `fkit-task-*` directories, and
  `fkit-task-brief` / `fkit-task-ship-loop` are **not** movers. A prefix pin would have reported two
  false movers and had to be loosened. The signature matches **exactly two** files across every skill.
- **`T1` closes the rot loop** — asserts the path the clause names **exists**, and does so against the
  real `REPO`, never `FKIT_MOVER_STEP_ROOT`, so a mutant `claude/` copy cannot make it pass.
- **`T14` pins placement** — the clause sits **after** the `Then prove it.` paragraph (a heal is only
  observable after step 5's repairs) and with **no `### ` heading between**, which is AF2's
  no-renumbering ruling made checkable.
- ⛔ **No `path:NNN` anchors anywhere**, per `conventions/durable-citation-anchors.md`.

### 5. `test/reference-integrity.test.js` — AF1(b), the durable half

- **`staleExemptions(root, keys) → {missingCiter, targetIsBack}`** extracted from `L4`'s body,
  **behaviour-preserving**. `root` and `keys` are parameters for the same reason `scan()`'s `root` is
  one: it is the whole fixture strategy, and it keeps every proof under `os.tmpdir()`.
- **`L4` is now the call plus its two original assertions**, whose **messages are byte-identical** to
  what they were inline — verified by diff: **zero** removed lines match any of the message strings.
  ⚠️ That fidelity is load-bearing now in a way it was not before: **those messages are what carry the
  rule to a mover operator**, because the clause deliberately quotes no assertion internals.
- **`M5` (orphaned) / `M6` (healed)** fixture arms, each proving one direction **and** its
  non-vacuity control (the same key, un-staled, is reported in neither direction). Both under
  `os.tmpdir()`; the repo's own `NAMED_EXEMPT` set is never touched.

### 6. `test/prove-red.sh` — mutations 33 and 34

- `run_mover_step_suite()` added beside `run_wiki_flag_suite()`; gate **`0o`** added beside `0m` (an
  unmutated copy must be green first, or a red below would be red-via-setup).
- **Mutation 33** — inverts the `targetIsBack` delete rule in `fkit-task-done` to
  `**Repoint the key (mutation: delete rule inverted).**`, which is the **documented failure mode**
  written out as plausible-but-wrong prose. Must red at **`T3`**. Carries an **injected marker** and
  counts **that**, never the natural text (the round-2 R11 discipline), plus the four standard guard
  branches (no-op / wrong-target / did-not-land / landed-more-than-once).
- **Mutation 34** — leaves `fkit-task-cancelled`'s board word un-swapped (`../../cancelled/X` →
  `../../done/X`). Must red at **`T11`**. See obvious-winner call 2 for why it carries no injected
  marker.
- ⚠️ **Index count updated: `THIRTY-TWO` → `THIRTY-FOUR`**, plus the two index rows. That index
  **has read stale before** (`0136` round-1 review R5) in the one file whose whole thesis is that an
  unexercised gate hides drift.
- ⛔ **`0271`'s uncommitted hunks in this file were left alone** (mutation 32 and its index row).

### 7. Verification — measured, not asserted

| Gate | Result |
|---|---|
| `npm run test:unit` (baseline, before any edit) | **895 / 895 pass, 0 fail** · 73.5 s |
| `node --test test/reference-integrity.test.js` (baseline) | **20 / 20 pass** · 0 broken, 7 named-exempt |
| Red-first, direction 1 (`missingCiter`) | **19 pass / 1 fail** — red at `L4`, message quoted above |
| Red-first, direction 2 (`targetIsBack`) | **19 pass / 1 fail** — red at `L4`, message quoted above |
| Repro reverted | `git diff --quiet` **empty**; **20 / 20 pass** |
| `node --test test/mover-exemption-step.test.js` | **16 / 16 pass** |
| `node --test test/reference-integrity.test.js` (after) | **22 / 22 pass** (20 + `M5` + `M6`) · 0 broken, **7** named-exempt |
| `npm run test:unit` (after) | **913 / 913 pass, 0 fail** — 895 + 16 + 2, exactly the expected delta |
| `node --test` over the three guards (after) | **71 / 71 pass** (69 baseline + `M5` + `M6`) · 898 files, **0 broken, 7 named-exempt** |
| `bash -n test/prove-red.sh` | syntax OK |
| `sh test/prove-red.sh` | **✓ hard gate PASSED**, exit **0** — **34 mutations red, 15 baseline gates green (`0a`–`0o`), zero `✗`** |
| ↳ mutation **33** | **red**, at the named assertion `T3 … targetIsBack delete rule` |
| ↳ mutation **34** | **red**, at the named assertion `T11 … board-dependent sentences` |
| ↳ gate **`0o`** (new) | **green** — an unmutated copy's mover-exemption-step suite passes, so 33/34's reds are not red-via-setup |

⭐ **The guard counts are worth reading as this task's own dogfood**: adding the clause to two movers
and a new worklog to `ai-agents/` left `reference-integrity` at **0 broken, 7 named-exempt** — exactly
the green no-op path the clause tells a mover to expect on a clean close.
⚠️ **Amended in round 1 (R4).** This paragraph previously described that path as *"green → record the
measured `named-exempt: N` and stop"*. **No such string is emitted.** `L8` prints
`scanned 899 files, resolved 3492 link targets, 0 broken, 7 named-exempt` — number **before** the
words, no colon. The clause was corrected to match; so is this sentence.

⛔ **`npm test` chains into `prove-red`** (`package.json`), so the hard gate was run directly rather
than twice.

### 7b. Verification — round 1 (after the R1–R6 fixes)

| Gate | Result |
|---|---|
| `npm run test:unit` (before round-1 edits) | **913 / 913 pass, 0 fail** · 75.4 s |
| `npm run test:unit` (after) | **913 / 913 pass, 0 fail** · 82.5 s — no count change; no test added or removed |
| Three guards (`reference-integrity` + `coordination-citation-policy` + `skill-frontmatter`), after | **71 / 71 pass** (22 + 21 + 28) · 899 files, **0 broken, 7 named-exempt** — the 7-instance pin is untouched, **no `NAMED_EXEMPT` key added** |
| `node --test test/mover-exemption-step.test.js` (after) | **16 / 16 pass** — count unchanged; `T13` rewritten in place, not added |
| ⭐ **R3 disproof re-run** — delete rule relocated to an `## Appendix` in **both** movers | **`T3` RED, "found 0"** (was **16/16 GREEN** before the fix). This is the reviewer's own construction, re-measured here. |
| ⭐ **R5 discrimination proof** — `foldBoard` mutated to fold **both** board words | **`T13` RED at `T13(c)`**. The previous `T13` never called `foldBoard`, so it would have stayed green. |
| Independent uniformity check (outside `T12`) — `diff` of the two extracted clauses with each board word folded | **empty** — identical modulo the board word |
| Clause length, both movers | **37 lines** each (30 as first built) |
| `sh test/prove-red.sh` (after) | **✓ hard gate PASSED**, exit **0** — **34 mutations, all red; 15 baseline gates `0a`–`0o`, all green; zero `✗`** |
| ↳ gate **`0o`** | **green** — so 33/34's reds are not red-via-setup |
| ↳ mutation **33** | **red**, at the named assertion `T3 … targetIsBack delete rule` — **re-confirmed after the reword** |
| ↳ mutation **34** | **red**, at the named assertion `T11 … board-dependent sentences` — **re-confirmed after the reword** |

⭐ **Why 33/34 had to be re-confirmed rather than assumed:** the R1 reword rewrote the very line
mutation 33's `sed` anchors on. Checked explicitly afterwards — `Delete the key — do not repoint it.`
still occurs **exactly once** in `fkit-task-done`, `../../cancelled/X` **once** in `fkit-task-cancelled`,
and `../../done/X` **zero** times there, so both mutations still land on exactly one site.

⛔ **`test/reference-integrity.test.js` and `test/prove-red.sh` were NOT touched this round** —
confirmed with `git status --porcelain` on both paths (empty). Ruling **AG1** chose the route that does
not touch the guard, which is what preserves `L4`'s byte-identical-to-pre-`0381` messages.

### 7c. Verification — round 1 addendum (after the AH1 authority-gate fix)

⚠️ **Everything below was RE-MEASURED this turn.** Nothing is carried over from §7b: the addendum
edited **clause text** (which mutations 33 and 34 anchor near) and a **pinned constant**, which is
precisely the pair that made the §7b re-confirmation necessary rather than ceremonial.

| Gate | Result |
|---|---|
| `node --test test/mover-exemption-step.test.js` | **16 / 16 pass, 0 fail** · 56.8 ms — count unchanged; no test added or removed, only `AUTHORITY_RULE`'s text |
| `npm run test:unit` | **913 / 913 pass, 0 fail** · 80.7 s — no count change |
| Three guards (`reference-integrity` + `coordination-citation-policy` + `skill-frontmatter`) | **71 / 71 pass, 0 fail** · `scanned 899 files, resolved 3492 link targets, **0 broken, 7 named-exempt**` — the 7-instance pin is untouched, **no `NAMED_EXEMPT` key added** |
| `bash test/prove-red.sh` | ⭐ **✓ hard gate PASSED**, exit **0** — **34 mutations, all red; 15 baseline gates `0a`–`0o`, all green; zero `✗`** |
| ↳ gate **`0o`** (unmutated copy of the mover suite) | **green** — so 33/34's reds are not red-via-setup |
| ↳ mutation **33** | **red at the NAMED assertion** `T3 … targetIsBack delete rule` — **re-confirmed after the AH1 edit** |
| ↳ mutation **34** | **red at the NAMED assertion** `T11 … board-dependent sentences` — **re-confirmed after the AH1 edit** |

⭐ **How "at the named assertion" is evidenced, rather than asserted.** `test/prove-red.sh` does not
merely check that the suite went red: for each of 33 and 34 it then greps the output for
`(✖|not ok|fail).*targetIsBack delete rule` / `.*board-dependent sentences` and prints
`✗ suite went red but NOT at …` if the red is for the wrong reason. **Zero `✗` in the whole run** is
therefore the measurement that both reds landed on their named assertions — not just that the gate
passed.

⭐ **Why the anchors survived this edit** (checked explicitly, all three re-measured on disk):

| Anchor | Where | Expected | Measured |
|---|---|---|---|
| `Delete the key — do not repoint it.` (mutation 33's `sed`) | `fkit-task-done` | exactly 1 | **1** |
| `../../cancelled/X` (mutation 34's `sed`) | `fkit-task-cancelled` | exactly 1 | **1** |
| `../../done/X` (mutation 34's landing check) | `fkit-task-cancelled` | exactly 0 | **0** |

The AH1 edit touches neither string, and the replacement text introduces neither — which is *why* both
mutations still land on exactly one site each.

⭐ **Uniformity re-checked independently of `T12`.** Both movers' clause blocks were extracted between
`T12`'s own anchors (`BLOCK_START` = the lead-in, `BLOCK_END` = *"produce a second `NEEDS-DECISION` for
the same key."*), each anchor verified to occur **exactly once** per file, then compared with both board
words folded:

- `fkit-task-done` → **39 lines**; `fkit-task-cancelled` → **39 lines** (was 37 each before AH1 — the
  bullet grew from 3 source lines to 5; no `MIN_BLOCK_LINES` concern, the floor is 22)
- board-folded comparison → ⭐ **identical**, empty diff — **byte-identical modulo the board word**
- the AH1 bullet itself carries **no** board word, so it is the *same* text in both files, not a
  board-swapped pair

⛔ **`test/reference-integrity.test.js` and `test/prove-red.sh` were NOT touched in this addendum** —
confirmed with `git status --porcelain` (both absent from the output; the only dirty paths are the five
in the addendum fence below).

### 7d. Verification — round 2 (after the R8 / R9 fixes, rulings AJ1 + AJ3)

⚠️ **Everything below was RE-MEASURED this turn.** Nothing carried over from §7c: round 2 edited
**clause text** in both movers *and* **three pinned constants** (`REPOINT_RULE`, `INSTANCES_RULE`,
`THREE_DIRECTIONS`) — the same pair that made §7b and §7c re-confirmations necessary.
⭐ **A pre-edit baseline was taken first** so "unchanged" is a comparison, not an assumption:
`npm run test:unit` **913 / 913 pass, 0 fail** before any edit.

| Gate | Result |
|---|---|
| `node --test test/mover-exemption-step.test.js` | **16 / 16 pass, 0 fail** · 57.8 ms — count unchanged; no test added or removed, only three constants' text |
| `npm run test:unit` | **913 / 913 pass, 0 fail** · 83.5 s — no count change from the pre-edit baseline |
| Three guards (`reference-integrity` + `coordination-citation-policy` + `skill-frontmatter`) | **71 / 71 pass, 0 fail** · `scanned 899 files, resolved 3492 link targets, **0 broken, 7 named-exempt**` — the 7-instance pin is untouched, ⛔ **no `NAMED_EXEMPT` key added** |
| `bash test/prove-red.sh` | ⭐ **✓ hard gate PASSED**, exit **0** — **34 mutations, all red; 15 baseline gates, all green; zero `✗`** (counted mechanically from the captured run, not read off the banner) |
| ↳ gate **`0o`** (unmutated copy of the mover suite) | **green** — so 33/34's reds are not red-via-setup |
| ↳ mutation **33** | **red at the NAMED assertion** `T3 … targetIsBack delete rule` — **re-confirmed after the R8/R9 edits** |
| ↳ mutation **34** | **red at the NAMED assertion** `T11 … board-dependent sentences` — **re-confirmed after the R8/R9 edits** |

⛔ **On "zero `✗`" — a correction to how §7b/§7c phrased this.** *"Zero `✗`"* and *"exit 0"* are the
**same signal**, not two independent ones: every `✗` branch in `test/prove-red.sh` also sets `fail=1`,
and the final gate is `if [ "$fail" = 0 ]`. The reasoning is sound and the property it establishes —
**each mutation reds its NAMED assertion**, not merely *some* assertion — still holds, because that is
what the per-mutation `grep -Eq '(✖|not ok|fail).*<assertion name>'` checks decide. It is one
measurement reported two ways, and should not be read as corroboration.

⭐ **Why the mutation anchors survived these edits** (re-measured on disk, not inferred):

| Anchor | Where | Expected | Measured |
|---|---|---|---|
| `Delete the key — do not repoint it.` (mutation 33's `sed`) | `fkit-task-done` | exactly 1 | **1** |
| `../../cancelled/X` (mutation 34's `sed`) | `fkit-task-cancelled` | exactly 1 | **1** |
| `../../done/X` (mutation 34's landing check) | `fkit-task-cancelled` | exactly 0 | **0** |

⭐ **This is why `DELETE_RULE` was deliberately left untouched.** R8's fix could have reworded the
delete bullet too; it did not, and that is *also* what keeps mutation 33's `sed` anchored on exactly
one site. The three changed bullets contain neither anchor string.

⭐ **Uniformity re-checked independently of `T12`.** Both clause blocks extracted between `T12`'s own
anchors, each anchor verified to occur **exactly once** per file, then compared with both board words
folded:

| Property | Measured |
|---|---|
| `BLOCK_START` (*"Then check the exemption keys this move may have invalidated"*) | **1** in each mover |
| `BLOCK_END` (*"produce a second `NEEDS-DECISION` for the same key."*) | **1** in each mover |
| `PROVE_IT` (*"**Then prove it.** Resolve every relative markdown link"*, `T14`'s placement anchor) | **1** in each mover |
| clause length | `fkit-task-done` **46 lines** · `fkit-task-cancelled` **46 lines** (39 each before this round; the framing paragraph adds 6 and the two reworded bullets 1) |
| board-folded comparison | ⭐ **identical, empty diff** — byte-identical modulo the board word |
| `missingCiter` / `targetIsBack` in either mover | **0** — round-1 **R1** not regressed |

⚠️ **`MIN_BLOCK_LINES`' comment still reads *"The live block is 30 lines in both files"* and is stale.**
It was stale before this round (39, not 30) and this round made it staler (46). ⛔ **Not fixed** — see
the round-2 obvious-winner entry above; it is the same record-accuracy class ruling **AJ3** parked, and
fixing it would have widened ruling **AJ2**'s deliberately narrow verification pass. The **gate** is
unaffected: the floor is 22 and the block is 46.

⛔ **`test/reference-integrity.test.js` and `test/prove-red.sh` were NOT touched in round 2** —
confirmed with `git status --porcelain`; both are absent from its output.

### 7e. Verification — round 2 addendum (after the **AK1** one-line title fix)

⚠️ **Re-measured this turn, at `HEAD 00d8b6b` (unmoved).** Nothing carried over from §7d.
⭐ **A test TITLE is an anchor surface**, which is the whole reason this pass exists rather than being
waved through as cosmetic: `test/prove-red.sh` decides mutations 33/34 by grepping a red run for a
**named assertion**, and renaming a title a mutation is anchored on disarms that gate **silently** —
green while proving nothing.

⛔ **Pre-edit safety check, on disk, before touching the file:**

| Question | Measured |
|---|---|
| Does `test/prove-red.sh` mention `T7`? | **no** — zero occurrences |
| Mutation **33**'s red-assertion grep | `(✖\|not ok\|fail).*targetIsBack delete rule` → a substring of **`T3`**'s title, unchanged |
| Mutation **34**'s red-assertion grep | `(✖\|not ok\|fail).*board-dependent sentences` → a substring of **`T11`**'s title, unchanged |
| *"the THIRD direction"* repo-wide (excl. `.git`, `node_modules`) | **3** — the `A6` comment, the `T7` title being changed, and `review.md`'s quotation of it. No other consumer |

⭐ **Post-edit re-confirmation — the gate was RUN, not reasoned about:**

| Gate | Result |
|---|---|
| `node --test test/mover-exemption-step.test.js` | **16 / 16 pass, 0 fail** — count unchanged; ⛔ **no test added, removed, or otherwise renamed**, still `T1`–`T15` |
| `npm run test:unit` | **913 / 913 pass, 0 fail** · 74.1 s — unchanged from §7d |
| Three guards (`reference-integrity` + `coordination-citation-policy` + `skill-frontmatter`) | **71 / 71 pass, 0 fail** · `scanned 899 files, resolved 3492 link targets, **0 broken, 7 named-exempt**` — ⛔ **no `NAMED_EXEMPT` key added**, the 7-instance pin holds |
| `npm run test:prove-red` | ⭐ **✓ hard gate PASSED**, exit **0** — **34 mutations, all red; zero `✗`** |
| ↳ gate **`0o`** (unmutated copy of the mover suite) | **green** |
| ↳ mutation **33** | **red at the NAMED assertion** `T3 … targetIsBack delete rule` |
| ↳ mutation **34** | **red at the NAMED assertion** `T11 … board-dependent sentences` |

⚠️ **Two honest limits on the run above, stated rather than rounded off.**
**(1)** `npm test` was **not** run as a single command; `test:unit` and `test:prove-red` were run
separately, which is exactly the pair `npm test` chains. **(2)** The prove-red log was captured to a
background file whose **head was truncated** — it begins mid-list at pre-gate `0l`, so only `0l`–`0o`
of the **15** green pre-gates (`0a`–`0o`, counted in the script) were read verbatim. The other eleven
are covered by **exit 0**, since every `✗` branch sets `fail=1` — ⛔ **the same single signal §7d warned
against double-counting**, not independent corroboration.

⭐ **Clause and mirror state, re-measured in the same pass** (no source touched — this is the figure the
owner's post-commit `claude/fkit-claude-init.sh .` re-run has to cover):

| Property | Measured 2026-09-12 |
|---|---|
| canonical clause length | `fkit-task-done` **46** lines (`SKILL.md:324–369`) · `fkit-task-cancelled` **46** lines (`SKILL.md:243–288`) |
| mirrored clause length | **37** lines in each `.claude/` copy — the pre-**AH1**, pre-R8/R9 wording |
| canonical ⇄ mirror gap | **5 change groups each** under `diff -U0` and plain `diff`; **3 hunks each** under `diff -u`'s default 3-line context. ⛔ **5 is the current number**; *"one hunk"* is superseded |
| `MIN_BLOCK_LINES` | **22** — floor untouched, and nowhere near binding against a 46-line block |

⛔ **Fence held.** `git status --porcelain` names exactly five files, unchanged in membership from
§7d: this task's `review.md` and `worklog.md`, both movers' canonical `SKILL.md` (from round 2, **not
re-touched this turn**), and `test/mover-exemption-step.test.js`. `test/reference-integrity.test.js`,
`test/prove-red.sh`, `ai-agents/sprints/**`, ADR-047 and other tasks' records are **absent** from it.

### 7f. Verification — round 3 (after the **AL1** R13 two-site fix, **AL3** R14, **AL2** R15/`T16`)

⚠️ **Every figure below was measured this turn at `HEAD 00d8b6b` (unmoved). Nothing carried over from
§7e** — and §7e's own numbers are superseded where they differ.

⛔ **The clause was read end to end, as an operator would, BEFORE and AFTER the edits** — the owner's
instruction, and the reason this pass is not a spot-fix. The post-edit read is what confirms the three
guard-file repairs the framing paragraph enumerates *(repointing a key, deleting one, adding one)* are
**exactly** the three the bullets below it name — `L4`/citer-missing → repoint, `L4`/target-resolves →
delete, `L2`/quoted-text → add — and that *"Exactly one repair below is yours"* is **literally true**:
of everything below, only `L2`'s repair-the-link branch is a producer action.

| Gate | Result |
|---|---|
| `node --test test/mover-exemption-step.test.js` | ⭐ **17 / 17 pass, 0 fail** — was 16/16; `T16` is the one added |
| `npm run test:unit` | ⭐ **914 / 914 pass, 0 fail** · 78.6 s — was **913**; the +1 is `T16` and nothing else |
| Three guards (`reference-integrity` + `coordination-citation-policy` + `skill-frontmatter`) | **71 / 71 pass, 0 fail** · `scanned 899 files, resolved 3492 link targets, **0 broken, 7 named-exempt**` — ⛔ **no `NAMED_EXEMPT` key added**, the 7-instance pin holds |
| `npm run test:prove-red` | ⭐ **✓ hard gate PASSED**, exit **0** — **34 mutations, all red; zero `✗`** |
| ↳ **all 15** pre-gates `0a`–`0o` | ⭐ **read VERBATIM this turn, all green** — ⛔ §7e could only read `0l`–`0o`; that limit is now discharged, not restated |
| ↳ mutation **33** | **red at the NAMED assertion** `T3 … targetIsBack delete rule` |
| ↳ mutation **34** | **red at the NAMED assertion** `T11 … board-dependent sentences` |
| ↳ `test/prove-red.sh` itself | ⛔ **not edited** — 0 occurrences of `T16`, no mover-suite test count in it, mutation index still **34** |

⭐ **`T16`'s red-proof — two mutant trees, both TWO-SIDED, via `FKIT_MOVER_STEP_ROOT`.** The one-sided
case is already `T12`'s, and one-sided was never the gap: R15's whole point is that a **symmetric**
deletion read green.

| Mutation (applied to BOTH movers) | Before this round | After |
|---|---|---|
| Delete the **whole** framing paragraph | **16/16 GREEN** — the reviewer's measurement, and why R15 is medium | ⭐ **17 tests · 16 pass · 1 fail — `T16` red, and only `T16`.** `T12` **green**, because both copies changed together: exactly the blind spot now closed |
| Delete **only** the R13 half — *"Exactly one repair below is yours … not unfinished for it."* | n/a, the sentence did not exist | ⭐ **17 tests · 16 pass · 1 fail — `T16` red, and only `T16`.** ⛔ Proves **both halves** are pinned, not just the paragraph's opening — the R13 fix cannot be silently undone |

⭐ **Clause state, re-measured in the same pass:**

| Property | §7e (2026-09-12, pre-round-3) | ⭐ Now |
|---|---|---|
| canonical clause length | **46** lines each | ⭐ **52** lines each (`fkit-task-done` `SKILL.md:324–375`, `fkit-task-cancelled` `SKILL.md:243–294`) |
| uniformity | byte-identical modulo the board word | ⭐ **unchanged — re-verified mechanically**, `diff` of the two extracted clauses with each board word folded to a token is **empty** |
| the three anchors, per mover | 1 / 1 / 1 | ⭐ **1 / 1 / 1** — `BLOCK_START`, `BLOCK_END` and the `PROVE_IT` placement anchor each match **exactly once**. ⛔ `BLOCK_END` did **not** move: both R13 edits sit above the attribution bullet |
| R1 non-regression | `missingCiter` / `targetIsBack` = 0 in both | ⭐ **0 / 0 in both**, still |
| mirrored clause length | **37** lines | **37** lines — unchanged; the mirror is still pre-**AH1** |
| canonical ⇄ mirror gap | **5** change groups (`diff -U0`) / **3** hunks (`diff -u`) | ⭐ **4** groups / **3** hunks — ⚠️ it went **DOWN**: the R13 framing edit merged two previously separate groups. **4 is the current number** |
| `MIN_BLOCK_LINES` | **22**, floor untouched | **22**, floor untouched — now **30 lines** of headroom, further from binding than before |

⚠️ **Honest limits on this run, stated rather than rounded off.** **(1)** `npm test` was **not** run as
a single command; `test:unit` and `test:prove-red` were run separately, which is exactly the pair it
chains. **(2)** ⛔ *"Red at the NAMED assertion"* for mutations 33/34 is **`test/prove-red.sh`'s own
check**, not a second reading of mine — the script prints `✗ … red for the wrong reason` when a
mutation reds elsewhere, and the log has **zero** `✗`. That is the script's evidence, and it is not
independent of exit 0. **(3)** ⛔ The `.claude/` mirror is **still not refreshed** (ruling **AF4**), so
the R13/R14 wording is **not in force in this repo** until the owner re-runs
`claude/fkit-claude-init.sh .` after committing. The step itself **is** in force, in its pre-**AH1**
wording.

### 7g. Verification — round 4 (after the **AM1** R17 two-site fix; **AM2** residual, **AM3** close)

⛔ **Worst news first: R17 was mine.** My round-3 R13 fix created it — the third round running in which
the previous round's fix created the next instance (R8→R13, R13→R17). This round is the **seventh** pass
over the clause, and per **AM3** it closes on **my own red-proof with no eighth verification pass**.

⭐ **The R17 fix — both halves, at both sites.** The finding is not only a wording problem, so the fix is
not only a reword. **(a)** The attribution qualifier is restored (*"repairing a markdown link **this move
broke**"* / *"where **this move** broke the link"*), each followed by the disposition for a red that is
not this move's. **(b)** The vacuous justification is replaced by the real one and **named as vacuous**,
so it cannot be quietly re-added. ⛔ **I verified the vacuity claim on disk before relying on it, as AM1
required:** `collectFiles()` is `walk(path.join(root, 'ai-agents'))` (`test/reference-integrity.test.js:190-192`)
and `L7` (`:578-587`) asserts `strays` is `[]` — so every `L2` red is under `ai-agents/` by construction
and the old test was always true.

⭐ **The round-4 red-proof — seven scenarios, all two-sided, all run this turn** against mutant trees
built from the live `claude/` via `FKIT_MOVER_STEP_ROOT`. ⛔ **A control is included**, because a
mutation that reds an already-red tree proves nothing:

| Scenario (BOTH movers) | Result | Reads |
|---|---|---|
| **P0 control** — unmutated copy | 17 pass / 0 fail | GREEN — seam honoured, tree clean |
| **P1** — delete the **whole** framing paragraph | 16 pass / 1 fail | ⭐ **`T16` red, ALONE** (`T12` green — both copies changed together) |
| **P2** — delete **only** the R17-affected framing half | 16 pass / 1 fail | ⭐ **`T16` red, alone** — the new wording is genuinely pinned |
| **P3** — revert the R17 framing half to its **exact pre-fix wording** | 16 pass / 1 fail | ⭐ **`T16` red, alone** — ⛔ **the anti-regression proof** |
| **P4** — delete **only** the R17 authority sentence | 16 pass / 1 fail | ⭐ **`T9` red, alone** |
| **P5** — revert the R17 authority sentence to its **exact pre-fix wording** | 16 pass / 1 fail | ⭐ **`T9` red, alone** |
| **P6** — revert **both** R17 sites together | 15 pass / 2 fail | ⭐ **`T16` + `T9` red** — the full regression is caught |
| **P7** — **[R18]** revert **R14's** sentence to its exact pre-fix wording | **17 pass / 0 fail** | ⛔ **GREEN — the gap is real**, `T16` green, `T12` green. Residual accepted under **AM2** |

⭐ **Clause state, re-measured in the same pass:**

| Property | §7f (round 3) | ⭐ Now (round 4) |
|---|---|---|
| canonical clause length | **52** lines each | ⭐ **56** lines each (`fkit-task-done` `SKILL.md:324–379`, `fkit-task-cancelled` `SKILL.md:243–298`) — the fix added 4 lines to each |
| uniformity | folded diff empty | ⭐ **unchanged — re-verified mechanically**: `diff` of the two extracted clauses with each board word folded to a token is **empty**. Raw diff is **2** change groups, every differing line a board-word line |
| the three anchors, per mover | 1 / 1 / 1 | ⭐ **1 / 1 / 1** — ⛔ `BLOCK_END` did **not** move (regex byte-unchanged; both edits sit above the attribution bullet's final sentence) |
| R1 non-regression | `missingCiter` / `targetIsBack` = 0 / 0 | ⭐ **0 / 0**, still — `L4` green in the post-edit run |
| guard disclosure | — | ⭐ `scanned 899 files, resolved 3492 link targets, **0 broken, 7 named-exempt**` |
| mirrored clause length | **37** lines | **37** lines — unchanged; the mirror is still pre-**AH1** |
| canonical ⇄ mirror gap | **4** groups (`diff -U0`) / **3** hunks (`diff -u`) | ⭐ **4** groups / **3** hunks — **unchanged by this round**, verified against a reconstructed pre-R17 tree (4/3 before, 4/3 after) |
| `MIN_BLOCK_LINES` | **22**, floor untouched | **22**, floor untouched — now **34 lines** of headroom |

⚠️ **A recorded figure I corrected rather than quietly restated.** The *"`diff -U0` 4 groups / `diff -u`
3 hunks"* snapshot is the **canonical ⇄ mirror** gap, **not** the done ⇄ cancelled uniformity diff. I
first measured it on the wrong span and got 2/2; the figure reproduces at **4/3 per mover** when measured
canonical-against-mirror, which is what §7f meant. Stated here because a silently "confirmed" figure
measured by a different method is exactly the rot this task exists to prevent.

⚠️ **Honest limits on this run, stated rather than rounded off.** **(1)** ⛔ *"Red at the NAMED
assertion"* for mutations **33** and **34** is **`test/prove-red.sh`'s own title grep**, not a second
reading of mine — the script prints `✗ … red for the wrong reason` when a mutation reds elsewhere, and
the log carries **zero** `✗`. That is the script's evidence and it is **not independent of exit 0**.
Neither mutation's target sentence (`DELETE_RULE`, `INVERSION`) was touched this round. **(2)** ⛔ The
`.claude/` mirror is **still not refreshed** (ruling **AF4**), so the R17 wording — like R13/R14 before
it — is **not in force in this repo** until the owner re-runs `claude/fkit-claude-init.sh .` after
committing. The step itself **is** in force, in its pre-**AH1** wording. **(3)** ⛔ **No independent
reviewer saw this round's fix** — AM3 removed the eighth pass deliberately. Everything above is my own
measurement, and the P0 control is included precisely because self-verification has no second reader.

## Findings for the driver

### ⭐ AF3 — the row it asks a producer to file **already exists**

Ruling AF3 noted the planner checked only `0341` and `0386` and told the producer to **look first**.
**Looked. It exists:**

`ai-agents/tasks/backlog/0342-mirror-the-self-locator-repair-rule-into-fkit-task-cancelled/brief.md`
— *"Mirror the self-locator repair rule into `/fkit-task-cancelled`"*, `🔲 Backlog`, Owner
`fkit-coder`. Filed **2026-08-26** by a spawned producer under a prior owner ruling on task `0325`'s
Q3 (verbatim label **"Follow-up brief (Recommended)"**).

⛔ **So no new row should be filed** — filing one would duplicate `0342`. The gap AF3 describes and
the gap `0342` owns are the same gap.

### ⚠️ Pre-existing stale claim, NOT repaired — flagged, not fixed

`test/reference-integrity.test.js` and `test/coordination-citation-policy.test.js` each carry a
`WHY THERE IS NO test/prove-red.sh ENTRY` note asserting **"All 28 prove-red mutations…"**. That count
was **already stale before this task** (the file held **32**), and this change makes it **34**.

⛔ **Deliberately not repaired.** The same stale number sits in `coordination-citation-policy.test.js`,
which is **outside this task's fence**; fixing one copy and not the other would leave a worse state
than fixing neither. ⭐ **The owner rulings those notes record are NOT affected** — both say
reference-integrity takes no prove-red entry, and this task added none: mutations 33/34 target
`mover-exemption-step.test.js` through its own env seam, not `reference-integrity.test.js`.

### ⚠️ One caution to hand task `0341`, not acted on here

The sprint movers **invert** the order (repoint, then `git mv` — ADR-047 §4), but the exemption step
must still run **AFTER** the move, because a heal is only observable at the new path. ⛔ **A
copy-paste that preserves POSITION instead of preserving AFTER-THE-MOVE is wrong.** `T14` pins
after-the-move for the **task** movers only; the sprint movers are deliberately outside `T0`'s roster
(they move a sprint plan, not a task folder, so the signature does not match them). Both points are
written into the new test file's header so `0341`'s author meets them there.

## Fence — what was and was not touched

**Touched (6, exactly the plan's change surface):**
- `claude/skills/fkit-task-done/SKILL.md`
- `claude/skills/fkit-task-cancelled/SKILL.md`
- `test/mover-exemption-step.test.js` *(new)*
- `test/prove-red.sh`
- `test/reference-integrity.test.js`
- this file *(new)*

⛔ **Not touched:** the `.claude/` mirror, `ai-agents/sprints/**`, ADR-047, any other task's records,
`ai-agents/wiki-vault/`, `claude/skills/fkit-status/**`. **No commit, no push, no folder moved, no
board row flipped, no re-rank, no mover invoked, no vault write.**

**Round 1 — touched (5, exactly the round's fence):**
- `claude/skills/fkit-task-done/SKILL.md` · `claude/skills/fkit-task-cancelled/SKILL.md` (R1, R2, R4)
- `test/mover-exemption-step.test.js` (R1 constants, R3, R5)
- this file (R6, plus the round-1 decision log and verification)
- `review.md` (*Coder response* + *Accepted residuals*)

⛔ **Round 1 — not touched:** `test/reference-integrity.test.js` and `test/prove-red.sh` (both **out of
this round's fence**; `git status --porcelain` on both paths is **empty**), plus everything in the
build's not-touched list above. **No commit, no push, no mover, no board row flipped, no vault write,
no `NAMED_EXEMPT` addition.**

⚠️ **The owner committed mid-round.** `00d8b6b "Sprint push"` (2026-09-11 19:50:58) landed while this
round was in progress and captured part of it — the two `SKILL.md` rewordings and the first half of the
test-file edits are **already in `HEAD`**. That commit was **not made by this agent**; it is recorded
here so the round's change surface is not mistaken for uncommitted work.

**Round 1 addendum (ruling AH1) — touched (4, exactly the addendum's fence):**
- `claude/skills/fkit-task-done/SKILL.md` · `claude/skills/fkit-task-cancelled/SKILL.md` (the
  authority-gate bullet only — **one hunk each**, identical text, no board word involved)
- `test/mover-exemption-step.test.js` (the `AUTHORITY_RULE` constant only)
- this file · `review.md` (*Coder response* + the `Status:` header line)

⛔ **Round 1 addendum — not touched:** `test/reference-integrity.test.js`, `test/prove-red.sh`,
`ai-agents/sprints/**`, ADR-047, any other task's records, the `.claude/` mirror, `ai-agents/wiki-vault/`,
and `review.md`'s shared *Accepted residuals* section (the stale `.claude/`-mirror residual is flagged
in the *Coder response* for the reviewer to dispose of in round 2, **not rewritten here**). **No commit,
no push, no mover, no board row flipped, no `NAMED_EXEMPT` addition, no vault write.**

⚠️ **Baseline for this addendum is `HEAD` = `00d8b6b`, and it already contains part of round 1.** The
two `SKILL.md` rewordings and the first half of the test-file edits are **committed**, so those files
showed **clean** in `git status --porcelain` at the start of this spawn — **because they were committed,
not because they were never edited.** Uncommitted at spawn were exactly **3** paths: `review.md`,
`worklog.md`, `test/mover-exemption-step.test.js`.

**Round 2 (rulings AJ1 + AJ3) — touched (5, exactly the round's fence):**
- `claude/skills/fkit-task-done/SKILL.md` · `claude/skills/fkit-task-cancelled/SKILL.md` — **R8** (the
  new framing paragraph, the repoint bullet, the count bullet) and **R9** (the lead-in's third
  direction). Identical text in both files; only the lead-in sentence carries a board word.
- `test/mover-exemption-step.test.js` — the three pinned constants `REPOINT_RULE`, `INSTANCES_RULE`,
  `THREE_DIRECTIONS`, each with the comment above it saying *why* it moved. ⛔ No test added, removed
  or renamed; the count stays **16**.
- this file (the round-2 decision log and §7d) · `review.md` (*Coder response* round-2 section, the
  four new *Accepted residuals*, and the `Status:` header line — ⭐ the residuals edit is authorized by
  ruling **AJ3**).

⛔ **Round 2 — not touched:** `test/reference-integrity.test.js`, `test/prove-red.sh`,
`ai-agents/sprints/**`, ADR-047, `plan.md` (⛔ never re-authored), any other task's records, the
`.claude/` mirror, `ai-agents/wiki-vault/`, and the reviewer-owned *Reviewer findings* section and
`Coverage:` field of `review.md`. **No commit, no push, no mover, no folder moved, no board row
flipped, no re-rank, no `NAMED_EXEMPT` addition, no vault write.**

⚠️ **Baseline for round 2 is `HEAD` = `00d8b6b` — unchanged from the addendum, and the addendum's own
work is therefore still uncommitted.** At the start of this spawn `git status --porcelain` listed
**3** dirty paths from the addendum (`review.md`, `worklog.md`, `test/mover-exemption-step.test.js`);
at the end it lists **5**, the two `SKILL.md` files having joined them. ⛔ Round 2 committed nothing —
the two extra paths are this round's edits, not a commit boundary moving.
