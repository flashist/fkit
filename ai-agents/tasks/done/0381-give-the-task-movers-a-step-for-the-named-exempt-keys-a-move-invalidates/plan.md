# Implementation plan — task `0381`: give the task movers a step for the `NAMED_EXEMPT` keys a move invalidates

## ⛔ Four corrections that lead — two to constraints the driver relayed

**1. "grep returns 0" — CONFIRMED.** `NAMED_EXEMPT` and `reference-integrity` each appear **0** times in
`claude/skills/fkit-task-done/SKILL.md` and `claude/skills/fkit-task-cancelled/SKILL.md`.
(Case-insensitive `exempt` hits once in each — unrelated prose, *"it does **not** exempt the brief from
the outbound-link repair"*.)

**2. The `expected 7` pin — CONFIRMED, keys counted firsthand.** `test/reference-integrity.test.js:451`
asserts `LIVE.namedExemptCount === 7`. The set holds **six keys**; `0272`'s `../fkit-review/SKILL.md`
key matches **twice**. ⭐ **7 suppressed instances, 6 keys.** Live: `0 broken, 7 named-exempt`.

**3. ⛔ REFUTED — "the two movers' step orders differ."** They do **not**. Measured: both run
`### 3. Move the task FOLDER` → `### 4. Find every place the task is referenced` → `### 5. Update each
tracked location`. **Identical numbers, identical shape.** ⭐ ADR-047 §4 withdrew a **different** claim —
that the **sprint** movers mirror the **task** movers; its corrected text says the two task movers *"have
the identical shape"* and that **the sprint movers deliberately invert**. ⛔ **The driver inverted the
inversion, and `0341` must be told it is NOT inheriting differing step orders.**

⭐ **The real asymmetry, found while surveying:** `fkit-task-cancelled` has **no `OWN self-locators`
block at all**. `fkit-task-done` carries ~70 lines of it (the role-not-string rule + the `0250` worked
example, 2 repair / 5 freeze); `fkit-task-cancelled` jumps from `OWN outbound links` straight to
`Now do this regardless`. ⛔ **Out of scope — ruling AF3.**

**4. ⛔ REFUTED — the brief's own Verification step 4.** It says editing a skill under `claude/`
*"engages the install share's structure-spec and hash manifest"* and tells the planner to **stop and
surface** if the edit forces regenerating a shipped artifact. Measured: `claude/structure-manifest.tsv`
has **72 data lines, 0** containing `skills/` (it covers `ai-agents/**`, `CLAUDE.md`, `AGENTS.md` —
consuming-project paths). `claude/scaffold/` holds **no `skills/` tree**, so `test/dual-home-parity.test.js`
is not implicated either. ⭐ **Editing a mover SKILL.md regenerates no shipped artifact. That risk class
is EMPTY.**

## Baseline, measured at HEAD `9943dcf`

| Measurement | Value |
|---|---|
| `npm run test:unit` | **895 tests / 895 pass / 0 fail** · 78.6 s |
| `reference-integrity` | 896 files, 3492 targets, **0 broken, 7 named-exempt** · 20 tests |
| `coordination-citation-policy` | 21 tests |
| `skill-frontmatter` | 28 tests |
| Guard total | **69** |

⭐ Ran `test:unit`, ⛔ **not** `npm test` — the `prove-red` chain was not run at plan time.

**Baseline exclusion:** my surface is `claude/skills/fkit-task-{done,cancelled}/SKILL.md`,
`test/reference-integrity.test.js`, `test/prove-red.sh`, one new test file, and `0381`'s own records.
⛔ Everything else in the tree is **not mine**.

## ⭐ The root cause, stated mechanically

`fkit-task-done` step 4's sweep is:

```
grep -rn --exclude-dir=wiki-vault "<NNNN>-<slug>" ai-agents/
```

⛔ **Scoped to `ai-agents/`. The exemption keys live in `test/`.** The mover is not *forgetting* to check
them — it is **structurally incapable of seeing them.** Same grep, same scope, in `fkit-task-cancelled`.

⭐ **And the guard is not broken. Only the mover is blind.** `L4` already computes **both** directions
correctly, and its own failure messages already state the right action — `targetIsBack`: *"the link is no
longer broken, so the exemption is dead weight and must be removed (and the L3 count lowered with it)"*.
It fired for real on `0358`. ⛔ **Nothing about the detection needs inventing.**

⭐ **That reframes the fork: the mover does not need the inversion rule encoded in prose. It needs to RUN
THE GUARD after the move and OBEY WHAT IT SAYS.**

## ⛔ Why not option B (move-invariant keys) — recommended against, and the owner did not take it

- A move-invariant key kills the `missingCiter` direction but ⛔ **cannot** kill `targetIsBack`. ⭐ **The
  heal direction — the documented failure mode, the one that inverts — is left entirely unfixed.** B is a
  half-fix of the easier half.
- ⛔ Worse: an exemption that silently survives a heal is exactly the **dead weight** the set's own
  comment names as its blind spot (*"a FUTURE genuine rot with the same (file, target) pair is also
  suppressed"*). **B converts a loud, deterministic red into silent rot.**

## The step, in prose

⭐ **Placement (ruling AF2): extend step 5's existing `**Then prove it.**` tail in both movers. ⛔ No
renumbering.** Reasons: (a) the tail is already the post-repair verification paragraph, and **a heal is
only observable AFTER step 5's repairs** — running earlier sees nothing; (b) renumbering is not free —
`fkit-task-done`'s own prose cross-references *"step 5 rules that self case"*, *"reported frozen in step
7"*, *"(step 7)"*, and `fkit-task-cancelled` would shift 6→7, 7→8, 8→9. ⭐ Give it a **bolded scannable
lead-in** to recover most of a numbered step's visibility.

⭐ **Byte-identical clause in both movers, modulo the board word** (`done/` ⇄ `cancelled/`):

1. **Run the guard unconditionally**: `node --test test/reference-integrity.test.js`. Green → record the
   measured `named-exempt: N` in the report and stop.
2. **Red at the exemption arms** → the move invalidated one or more keys, and the guard's message names
   them **and the direction**:
   - **`missingCiter`** — the citing file moved with this close. **Repoint the citer half** to the new
     board, **re-run**, and ⚠️ **if it now lands in `targetIsBack`, DELETE instead.** ⭐ This is the
     literal `0358` sequence: repointing alone would only have moved the failure.
   - **`targetIsBack`** — the link **healed**. ⛔ **DELETE the key. Do not repoint.** ⭐ *"`../../done/X`
     survives, `../X` does not" is right about a POINTER and INVERTS for an EXEMPTION KEY.*
   - **`L2` newly broken** — ⭐ **a THIRD direction the brief's fork omits.** A move can also **break** a
     link that needs a **new** exemption with a reason (the `0290` case: one link broke as three healed).
     ⭐ The clause covers all three, not two.
3. **The `L3` count**: keep the **equality** — it is the arm that caught the three dead keys, and it is
   what makes a fall visible. ⚠️ **Lower it by the number of suppressed INSTANCES, not keys** — one key
   can match more than once (`0272`'s does). ⛔ **Re-run the guard to read the new number; never
   decrement by hand.**
4. ⛔ **Authority gate** — settles the brief's item 1. `test/reference-integrity.test.js` is a **coder**
   surface. A producer running the mover **may run** the guard (read-only, ADR-022) but ⛔ **must not edit
   it.** It returns **`NEEDS-DECISION` naming each key verbatim and its direction**, and the close is not
   finished until a coder lands the edit. ⭐ That is what actually happened in this session's close-out
   discipline, and it worked.
5. **Attribution** — the guard is repo-global. Attribute a red to *this* move only where the named key
   spells the moved folder; otherwise report it as **pre-existing** and touch nothing. ⛔ Must not
   contradict `0378` (a concurrent close's transient red) — ⛔ **not absorbing `0378`**, just not colliding.
6. **Re-run idempotence** — running the guard twice is harmless; the `NEEDS-DECISION` must not
   double-report. Matches the movers' existing no-op-on-re-run discipline.

⛔ **Rejected sub-optimisation, deliberately:** a grep-first early exit (`grep <folder-name>
test/reference-integrity.test.js`, skip the guard on no hit). It is *probably* sound for the current key
shape — but it rests on an assumption about key spelling that can rot, which is precisely the
"don't depend on test internals" trap. ⭐ **Run the guard unconditionally; use the grep only to name keys
in the `NEEDS-DECISION`.**

⭐ **Coupling to test internals — bounded on purpose.** The clause names **one path**
(`test/reference-integrity.test.js`) and ⛔ **no assertion internals** — the guard's own messages carry
the rule. Rot is closed by an assertion in the new contract test that **that path exists**.

## Change surface

| # | File | Change |
|---|---|---|
| 1 | `claude/skills/fkit-task-done/SKILL.md` | extend step 5's `**Then prove it.**` tail with the clause |
| 2 | `claude/skills/fkit-task-cancelled/SKILL.md` | same clause, board word swapped |
| 3 | `test/mover-exemption-step.test.js` **(new)** | contract test — the clause present, exactly once, in both |
| 4 | `test/prove-red.sh` | mutations **33** + **34**; index header count updated |
| 5 | `test/reference-integrity.test.js` | ruling **AF1** — extract `staleExemptions()`, add fixture arms |
| 6 | `…/0381-…/worklog.md` **(new)** | record |

⛔ **Not touched:** the `.claude/` mirror, `ai-agents/sprints/**`, ADR-047, any other task's records,
`ai-agents/wiki-vault/`. No commit, no push, no mover invocation, no re-rank.

## Proof — three layers

**P1 — contract test** `test/mover-exemption-step.test.js`. Copies the *method*
`test/wiki-flag-convention.test.js` names as reusable (*"Copy the method; do not grow this file into an
instrument"*): two named paths, hand-written constants, no shared extractor. Specifically:
- byte-exact match for the verbatim contract sentences; ⚠️ **whitespace-normalized** match for the
  wrapping prose — **that file measured SIX false negatives from raw-matching wrapped prose**, the exact trap;
- ⭐ **extract-and-GATE**: anchors found, ordered, minimum line count, ⛔ **throw** rather than pass on an
  empty extraction;
- an `FKIT_MOVER_STEP_ROOT` env seam with the stderr announcement, mirroring `FKIT_WIKI_FLAG_ROOT`, so
  prove-red can point it at a broken copy;
- ⭐ **T0 roster pin**: exactly these two mover skills exist under `claude/skills/` — goes red first if a
  third appears;
- an assertion that the path the clause names (`test/reference-integrity.test.js`) **exists** — closes
  the rot loop;
- ⛔ **no `path:NNN` anchors anywhere**, per `conventions/durable-citation-anchors.md`.

**P2 — `prove-red.sh` mutations 33/34.** One per mover: replace the clause with harmless prose carrying
an **injected marker** that cannot occur naturally in a SKILL.md (⭐ the round-2 R11 discipline — count
the marker, never the natural text), then assert the suite goes red **at the named assertion**, plus the
four guard branches the existing mutations use (no-op / wrong-target / did-not-land / landed-more-than-once).
⚠️ **Update the index count** — that index has read stale before (`0136` R5), in the one file whose whole
thesis is that an unexercised gate hides drift.

**P3 — red-first reproduction, both directions** — ruling **AF1**, both halves.

## Sequencing

1. Re-measure baseline. ⭐ Done — table above.
2. ⭐ **Red-first (AF1)**: demonstrate the orphaned and healed directions red **before** any fix.
3. Write the clause in `fkit-task-done`; mirror into `fkit-task-cancelled`.
4. Write `test/mover-exemption-step.test.js`; confirm green.
5. Add mutations 33/34; update the index count; run `sh test/prove-red.sh` and confirm both red **at the
   named assertion** — ⭐ **this is what proves step 4's test is load-bearing.**
6. `npm run test:unit` (fast loop, ~79 s) → expect **895 + new**. Then the hard gate: `sh test/prove-red.sh`,
   and `npm test` (**chains into prove-red, ~9 min**) once. ⛔ **Report measured numbers, never "all green".**
7. Worklog; hand back to the driver.

## Edge cases and non-obvious failure modes

- ⚠️ **Instances ≠ keys.** Deleting one key can lower the count by **more than one**. ⭐ The single
  easiest thing to get backwards.
- ⚠️ **Repoint-then-heal.** A key can be `missingCiter` *and*, once repointed, `targetIsBack`. ⛔ Naive
  "repoint" is wrong. Repoint → **re-run** → delete if healed.
- ⚠️ **The third direction.** A move can *break* a link needing a **new** key. The brief frames two; there
  are **three**.
- ⚠️ **Repo-global guard.** A red may belong to someone else's in-flight change. Attribute by folder name;
  report the rest as pre-existing.
- ⚠️ **A clean close is the common case.** Closing `0359` grepped clean. ⭐ The step will be a no-op most
  of the time — **which is exactly why it needs a test, not just prose.**
- ⚠️ **The `.claude/` mirror.** Measured: dated **Sep 4**, but both mover files are currently
  **byte-identical** to canonical. ⛔ **They diverge the moment this lands, and the step is not in force
  in this repo until the owner refreshes.** Ruling **AF4**.

## Overlap with the four `0341` follow-ups — ⛔ absorbing none

⭐ **Positive coupling, and it is the merit argument for running this first.** The clause is
**board-agnostic**: a sprint plan moving into `sprints/done/` or `sprints/cancelled/` invalidates
exemption keys by the **same inversion**. If the clause is byte-identical prose behind a roster-pinned
contract test, `0341`'s work becomes *"add two paths to `SKILLS`, paste the clause"*. ⛔ If written
bespoke per mover, **`0341` inherits the hole** — the near-certain follow-up row.

⚠️ **One caution to hand `0341`'s author, ⛔ not acted on here:** the sprint movers **invert** the order
(repoint → then `git mv`, ADR-047 §4). ⭐ **The exemption step must still run AFTER the `git mv`, because
a heal is only observable at the new path.** So in the sprint movers the clause sits at a **different
relative position**. ⛔ **A copy-paste that preserves position instead of preserving *after-the-move* is
wrong.**

- **V4** (`sprints/cancelled/` citation-guard exemption) — different guard, different file. **No conflict.**
  One heads-up: creating `ai-agents/sprints/cancelled/` also brings new files into `reference-integrity`'s
  scanned set, which can add broken links or new exemptions. ⛔ Not this task's.
- **FOLLOW-UP 2**, **FOLLOW-UP 3**, **`0338` R7** — orthogonal, no shared file or clause.

## `0386` — no overlap

Different files entirely. ⚠️ One indirect touch, non-blocking: if `0381`'s review defers a finding to
`0341`, the right Status value would be `deferred (→ 0341)` — which `0386` has not yet added, so
`blocked` would be used and would misread.

---

# ⭐ OWNER RULINGS — appended by the driver at the plan gate, 2026-09-11

Given live via `AskUserQuestion`. Option labels **verbatim**. These bind the Build and Process-review workers.

| # | Question | Owner ruling | What it settles |
|---|---|---|---|
| **AF0** | Approve this plan? | Approved via AF1–AF4 | ⛔ Every step above stands as written except where narrowed below. |
| **AF1** | How durable should the red-first reproduction be? | **"Both — manual repro + durable arms (Rec)"** | ⭐ **Do BOTH.** (a) the one-shot manual repro as the literal red-first evidence — plant a stale key, show red, revert, record in the worklog; **and** (b) ⭐ **the load-bearing half: extract `staleExemptions(root, keys) → {missingCiter, targetIsBack}`**, make `L4` a two-line call with **byte-identical messages**, and add fixture arms **M4 (orphaned) / M5 (healed)** against `os.tmpdir()`. ⭐ Basis: *"a step nothing tests is a step that silently stops happening"* — (a) alone does not meet that bar. ⚠️ Accepted cost: a **behavior-preserving refactor** of a coder surface with transcription-fidelity history. |
| **AF2** | Clause placement? | **"Extend step 5's tail (Rec)"** | ⭐ **Extend step 5's `**Then prove it.**` tail in both movers.** ⛔ **No new numbered step, no renumbering.** ⭐ Basis: a heal is only observable **after** step 5's repairs, and both movers cross-reference their own step numbers in prose. ⭐ **Add a bolded scannable lead-in** to recover a numbered step's visibility. |
| **AF3** | Is `fkit-task-cancelled`'s missing self-locator block in scope? | **"Out of scope — file a row (Rec)"** | ⛔ **NOT in scope. Keep `0381` to one clause in two files.** ⭐ The gap is real — `fkit-task-cancelled` has **no `OWN self-locators` block at all**, so a cancelled task's `plan.md`/`review.md`/`worklog.md` header locators go stale unrepaired. ⚠️ **The planner did NOT check whether a row already exists** — it checked only `0341` and `0386`. ⭐ **The producer filing it must look first.** ⛔ You do not file it; name it in your return. |
| **AF4** | Does the `.claude/` mirror refresh belong to this task? | **"You refresh after committing (Rec)"** | ⛔ **The refresh is the OWNER's, after committing.** ⭐ `0381` ships **canonical only**. ⭐ **The close-out packet must state LOUDLY that the step is shipped but NOT YET IN FORCE in this repo** — ⛔ never quietly. ⚠️ Both mover files are byte-identical to the mirror today and **diverge the moment this lands**. |
