# Worklog — 0341 build the producer-only sprint movers `/fkit-sprint-done` and `/fkit-sprint-cancelled`

Built by a spawned `fkit-coder` **Build worker** under `/fkit-sprint-ship-loop`
([ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)
Decision 3), on the driver's declared-approval marker (owner approved **2026-09-12** via
`AskUserQuestion` in the live `fkit lead` session; option label verbatim **"Approve — build it (Rec)"**).
`plan.md` (blob `e07d34195d987d925b242f17a532b240add19156`, 19450 bytes, 258 lines — verified with
`git hash-object` **and read with `bash cat`, not the `Read` tool**, before the first edit) **is the
autonomy boundary**. Implemented against `HEAD` = `f4666cea53bdb99770ff31d4a1a8f46f0964e84a`.

⚠️ **The plan reached this worker POINTER-ONLY, not pasted.** That is a declared deviation from the
loop's carry construction, and it is the **driver's**, recorded in the spawn prompt with its reason
(at 19,450 bytes a paste would have been the driver re-emitting text from its own context — the exact
failure `0162` recorded). The `cat` is the faithful copy; the hash matched; `Bash` reported no
truncation. Recorded here so a reviewer can weigh it rather than discover it.

⭐ **The `.claude/` mirror IS refreshed.** Unlike `0381` (whose ruling AF4 left the refresh to the
owner), this task's plan step 9 puts `bash claude/fkit-claude-init.sh .` in the build. It was run:
*"refreshed 7 agents → .claude/agents/, 28 skills → .claude/skills/"*. **The two sprint movers are in
force in this repo now**, and `CLAUDE.md` + `AGENTS.md` carry the regenerated rules block.

---

## Owner-decision log

**Plan gate (2026-09-12, `AskUserQuestion` in the driver session):** six rulings, recorded verbatim in
`plan.md` §5. What each bound, and what was built:

| Id | Ruling (option label, verbatim) | What shipped |
|---|---|---|
| **D1** | **"New `successor` mode (Rec)"** | `dashboard.sh` gained `successor <sprints-dir> <closing-identity>` — mode + dispatch + 10 contract tests. `0338`'s surfaces edited under this ruling. |
| **D2** | **"`.gitkeep`, this repo only (Rec)"** | `ai-agents/sprints/cancelled/.gitkeep`. **No scaffold change, no `structure-spec.md` rows, no `EXPECTED_ROWS` bump** — confirmed: `EXPECTED_ROWS` is untouched and `structure-check` is green. |
| **D3** | **"Generalize the existing bullet (Rec)"** | ONE bullet in `universal-rules.md` now names all four movers. No second bullet, no eviction, no `RULES_MAX` bump. |
| **Q1** | **"Follow the ADR — relocate (Rec)."** | Both movers **relocate** open rows and never refuse the close. The brief's contrary `## What to build` step 1 is **named as stale text inside both skills**, not silently ignored. |
| **D4** | **"Amend backlog.md here (Rec)"** | ⛔ **NOT MINE, and not done here.** `ai-agents/sprints/backlog.md` is a producer surface; the driver routes that one-line edit to a spawned `fkit-producer`. It shows as modified in the working tree — **that modification is not this worker's.** |
| **D5** | **"Keep everything in 0341 (Rec)"** | All five accumulated items shipped, `0338` R7 included. |

---

## Applied without asking — every call, and why it qualified

ADR-019's audit obligation, transferred with its permission. **Nothing here is a frontier-move, a
behaviour change outside the plan, or a disputed severity.** Each entry says what changed and which
of the two licences it fell under (verified-`CORRECT` + mechanical/localized + in-plan, or
obvious-winner-within-intent).

1. **Two declared ownership mirrors the plan's step 8 table omitted — `claude/README.md:49` and
   `ai-agents/knowledge-base/architecture.md:147`/`:158`/`:307`.**
   *Why it qualified — obvious winner within the plan's intent.* The plan's step 4 tells this build to
   edit `claude/skills-for-role.sh`, and **that file's own header names SIX mirrors that MUST be
   updated in the same commit**, twice, with the recorded history of the omission having *"shipped a
   false statement into every consuming project"*. Two of the six are absent from step 8's table.
   Leaving them lands a **measurable falsehood**: `architecture.md` said *"The 26 skills"* against a
   corpus that is now 28, and both producer rows would omit two skills the producer owns. Step 8's own
   title is *"prose that enumerates the movers"*, so these are inside its intent, not outside it.
   Nothing was decided — the fact was already ruled by D1/D5; only its statement was completed.

2. **`ai-agents/tasks/README.md` (the LIVE copy) — the same edit as its scaffold twin.**
   *Why it qualified — verified `CORRECT`, mechanical, and forced by a test.* `test/dual-home-parity.test.js`
   red on the first full run: `tasks/README.md` is an **enforced byte-identical dual-homed file**, and
   the plan's step 8 named only the scaffold copy. The fix is defined by the rule (*"edit BOTH copies
   in the same change"*) with no judgment in it. **Measured red, then measured green.**

3. **`ai-agents/knowledge-base/conventions/task-status-vocabulary.md` (the LIVE copy) — the
   sprint-status authority split, in fkit-flavoured wording.**
   *Why it qualified — obvious winner within intent.* The plan named the **scaffold** copy only. The
   two are a declared **`audience-adapted`** dual-home exception (`test/dual-home-parity-exceptions.mjs`),
   so no test forced this — but the exception's stated contract is that **both copies stay maintained,
   differently worded**, and the live copy is the one fkit's own agents read. Left alone it would say
   fkit has two movers when it has four. Written with ADR links (the live copy's register), matching
   the exception's own description of the divergence.

4. **`mode_successor` refuses a non-sprint `<closing-identity>` with exit 1.**
   *Why it qualified — mechanical, localized, inside the plan.* The plan specifies *"exits 1 on usage"*
   and nothing else about a bad identity. `identity_gt` on a non-sprint token compares **garbage
   silently** — `id_digits Backlog` yields `Backlo` — so the alternative was answering confidently
   about nothing. Refusing is the plan's own "1 on usage" branch applied to the one input that reaches
   it. Pinned by contract test S9.

5. **`S3`'s off-by-one, fixed in the test I had just written** (`lines.slice(moveAt[0] + 1, …)`).
   *Why it qualified — my own defect, caught by my own red run.* T14's anchor is a paragraph line;
   S3's anchor **is** the `### ` heading, so including it made the assertion fail unconditionally. Not
   a change to any rule.
   ⛔ **SUPERSEDED 2026-09-12 by review round 2, R22 — the rationale above is STALE, the entry is kept
   because a worklog is a dated record.** Round-1 R13 re-anchored `S3` on `SPRINT_GIT_MV`, a `git mv`
   **command** line, which can never satisfy `startsWith('### ')`. So `moveAt[0] + 1` is no longer
   load-bearing and *"S3's anchor is the `### ` heading"* no longer describes the code. The assertion
   itself is correct and was not changed; only the comment explaining the offset was.

**No other fix was applied unattended, and no other obvious-winner call was made.**

---

## Review round 1 — applied without asking, every call and why it qualified

Written by a spawned `fkit-coder` **Process-review worker** under `/fkit-sprint-ship-loop`, 2026-09-12,
on the same declared-approval marker as the build (owner approved `plan.md` via `AskUserQuestion`,
option label verbatim **"Approve — build it (Rec)"**). That single approval is the **standing
approval** replacing `fkit-process-stateful-review`'s per-round fix gate (ADR-032 D3 + its autonomy
amendment; discipline mirrors ADR-019, whose audit obligation this section discharges). Full verdicts,
derived severities and the convergence call are in `review.md`'s *Coder response*; this is the
**decision log** — what qualified each fix for landing unattended.

**Five of the eighteen were OWNER-RULED** (given live via `AskUserQuestion`, 2026-09-12, relayed in the
spawn prompt), so they needed no autonomy licence at all — the owner had already chosen the
disposition. Recorded here for completeness, not as unattended calls:

| Finding | Ruling (option label, verbatim) |
|---|---|
| **R1 + R2** | **"Add a rule for non-link hits (Rec)"** |
| **R3** | **"Fix the sentence + constant (Rec)"** |
| **R11** | **"Reword via a 2nd variable (Rec)"** |
| **R10** | **"Reword inside the boundary (Rec)"** |
| **R17** | **"Fix it now in the worklog (Rec)"** |

**The thirteen applied on the standing approval.** Each is verified-`CORRECT` against the code at
`file:line`, mechanical/localized, and inside `plan.md`'s authorized surfaces. ⛔ **None is a
frontier-move, a behaviour change outside the plan, or a disputed severity.**

1. **R4 — the closed-row freeze vs the depth repoint** (`fkit-sprint-done` step 4 rule 1;
   `fkit-sprint-cancelled` step 4 rule 1). Answers the collision between *"a closed row is NEVER
   touched"* and *"every task href on the board gains one hop"*. Changed: rule 1 now freezes a closed
   row's **content** (status cell, `P<n>` rank, prose — ADR-035's actual subject) and states that an
   href's **depth** is not covered, pointing at step 6. *Why it qualified — obvious winner within the
   plan's intent.* One option dominates: the skill's **own** step 7 (*"Then prove it."*) already
   obliges the executor to resolve every relative link in the moved plan, so the freeze-literal
   reading is not internally consistent, and ADR-035 protects the **rank**, not the pointer. Measured:
   14 `../tasks/` hrefs on `sprint-8.md`, every `✅ Done` row carrying one.
2. **R5 — no compliant state for an unranked successor** (`fkit-sprint-done` step 5). Changed:
   `## Priority` → the real number `M` **or `Unscheduled`** where the successor's board is unranked,
   plus the reason. *Obvious winner within intent.* `fkit-task-brief`'s de-scope step 5 already uses
   `Unscheduled` for the identical shape (no rank exists to hand out), ADR-046 makes the state
   reachable, and `## Priority` is guard-checked by nothing — so the alternative was a silent invented
   number.
3. **R6 — the inert ambiguity stop** (both movers, step 8/9). Changed: dropped the false claim that
   the reader emits `drift ambiguous-active-sprint`; named `select-active` as the mode that does.
   *Verified `CORRECT`, mechanical, in-plan.* The emitter is at `dashboard.sh:649` inside
   `mode_select_active`; neither mover invokes it. ⛔ **The executor's obligation is unchanged** —
   still *stop and ask* — so this corrects a claim, it does not add a step.
4. **R7 — no archive-destination pre-check** (both movers, step 1). Changed: a ⛔ stop-if-occupied
   bullet added to the existing validation step. *Obvious winner within intent.* Nothing competes:
   without it the `git mv` fails **after** every mutation, and the links repointed in step 6 resolve
   **successfully** to an older archived board. A validation bullet in a step whose job is validation
   is inside the plan's step-1 list, not a new step.
5. **R8 — the copied per-row override** (`fkit-sprint-cancelled` step 4). Changed: replaced with its
   negation and the reason. *Obvious winner within intent.* The bullet contradicts the same skill's
   always-Backlog rule and its single brief procedure, and exercising it manufactures the permanent
   `drift disagreement` step 5 warns about. `fkit-sprint-done` keeps its override — correct there.
6. **R9 — `../` missing from the `Superseded by` template** (`fkit-sprint-done` step 3). *Mechanical,
   localized, in-plan.* The template now matches the step-4 markers.
7. **R12 — the line-anchored argument guard** (`dashboard.sh mode_successor`). Changed: a one-line
   check before `is_eligible`, plus a multi-line arm on `dashboard-contract` `ADR-047 successor S9`.
   *Verified `CORRECT` by measurement, mechanical, in-plan.* Reproduced first (multi-line → exit 3,
   the mover's *fall to Backlog* path), re-measured after (exit 1), controls unchanged. The plan
   specifies *"exits 1 on usage"*; this makes that branch actually fail closed.
8. **R13 — `S3` anchored on the heading, not the move** (`test/mover-exemption-step.test.js`).
   Changed: new `SPRINT_GIT_MV` anchor on the `git mv` command line; `S0–S4` banner → `S0–S6`.
   *Mechanical, in-plan* — `plan.md` step 6 asks for a pin *"asserting after the `git mv` step"*, and
   the heading anchor did not deliver it. ⭐ Proved by mutation in a scratch tree: clause moved above
   the fence → **`S3` red, 23 green**, then reverted.
9. **R14 — `dashboard.sh`'s CONTRACT block said three modes.** *Mechanical.* Now four, `successor`
   named.
10. **R15 — the sprint fact filed on the task row** (`architecture.md`). Changed: the
    `sprints/sprint-N.md` row now carries the movers, the line-3 banner vocabulary and both archive
    destinations; the task row cross-references instead of restating. *Obvious winner within intent* —
    `architecture.md` is one of `skills-for-role.sh`'s six declared mirrors and was already edited by
    this task under build decision-log entry 1; this is placement, and the stale row is the one a
    reader consults about sprint boards.
11. **R16 — `L7`'s blind-spot-4 diagnostic** (`test/coordination-citation-policy.test.js`).
    *Mechanical, forced by the test's own stated purpose* — `L7` discloses every named blind spot, and
    `sprints/cancelled/` had been added to the header and the array but not the diagnostic. Also
    states its residual is **0 today**, so a prospective blind spot is not reported as a live cost.
12. **R18 (valid part) — `AGENTS.md` absent from the "repo-wide" sweep** (both movers, step 6).
    *Mechanical.* Added, symmetric with `CLAUDE.md`, which is generated the same way and was already
    listed. ⛔ **Deliberately not widened further:** measured impact is **0**
    (`grep -c 'sprint-[0-9]' AGENTS.md` → 0), the region is generated, and the movers' existing rule
    against hand-editing generated files already covers a hit there.
13. **The `S3` mutation and the manifest re-derivation were run, not assumed.** Not a code change —
    recorded because both are load-bearing claims in this round's report: `claude/structure-manifest.tsv`
    shows 3 rows against `HEAD`, and I reset it to `HEAD` and regenerated to prove those rows are the
    **build's** scaffold edits and not this round's. `universal-rules.md` is not manifest-scoped, so
    no hash moved.

⛔ **Nothing was returned as `NEEDS-DECISION`, and no accepted residual was opened.** Every one of the
eighteen findings resolved to `✅ done`; none required a judgment call that the standing approval does
not cover.

### Round-1 measured results

| Suite | Result |
|---|---|
| `npm run test:unit` | **963 pass / 0 fail**, 24 suites, 84.5s — baseline **held** |
| `test/mover-exemption-step.test.js` | **24/24** — held through R3's constant, R11's `MOVED` variable and R13's re-anchor |
| `test/reference-integrity.test.js` | **22/22**, **`0 broken, 7 named-exempt`** — both pinned figures held (corpus 901→**904** files, 3513→**3522** targets; not the pinned values) |
| `test/rules-block-budget.test.js` | **3/3** — block **3923 B → 3906 B**, **446 B** free under the 4352 B cap, `RULES_MAX` untouched |
| `test/coordination-citation-policy.test.js` | **21/21** — held |
| `bash claude/fkit-claude-init.sh .` | **ran** — 7 agents, 28 skills. Verified afterwards: nothing under `claude/` is newer than the mirror, and the three edited files are byte-identical to their `.claude/` copies |
| `npm test` (full) | **exit 0**, **`✓ hard gate PASSED`** — 15 baselines green (`0o` included), **34/34** mutations red their named assertion, `33` (`T3`) and `34` (`T11`) included |

⚠️ **The first `npm test` invocation's captured output was lost** when the harness backgrounded it. I
did **not** assert a result from it — I waited for that same process tree to finish and read its
flushed output, which is what the row above reports. ⛔ **That capture holds the gate half only**, so
the unit phase's tally inside the full run was not directly observed; `package.json:5` chains the two
with `&&`, so the gate ran only because the unit phase exited 0, and the separate `test:unit` run is
where the **963/963** figure comes from.

⚠️ **What this round did NOT change: the uncovered surface.** The four uncovered behaviours recorded
above — the banner write, row disposal, the link repoint, the `git mv` — are **still uncovered**.
Every prose fix in this round is verified by reading the code it describes and by its pin, **never by
executing a mover**, and a green 963 still says nothing about a mover running.

---

## Review round 2 — applied without asking, every call and why it qualified

Written by a spawned `fkit-coder` **Process-review worker** under `/fkit-sprint-ship-loop`,
2026-09-12, on the same declared-approval marker as the build and round 1 (owner approved `plan.md`
via `AskUserQuestion`, option label verbatim **"Approve — build it (Rec)"**). That single approval is
the **standing approval** replacing `fkit-process-stateful-review`'s per-round fix gate (ADR-032 D3 +
its autonomy amendment; discipline mirrors ADR-019, whose audit obligation this section discharges).
Full verdicts, derived severities and the convergence call are in `review.md`'s *Coder response*,
round 2; this is the **decision log**.

⚠️ **Four of this round's six findings were created by round 1's fixes** (R19, R20, R21, R22) —
the base rate `0381` measured, holding.

**FOUR of the six were OWNER-RULED** (given live via `AskUserQuestion`, 2026-09-12, relayed in the
spawn prompt), so they needed no autonomy licence — the owner had already chosen the disposition.
Recorded for completeness, not as unattended calls:

| Finding | Ruling (option label, verbatim) |
|---|---|
| **R19** | **"Delete the causal clause (Rec)"** |
| **R21** | **"Swap to the board render (Rec)"** |
| **R23** | **"Fix it (Rec)"** |
| **R24** | **"Restore EVIDENCE as an explicit exception (Rec)"** |

**Three applied on the standing approval** — R20, R22, and one defect of my own that the gate caught
(entry 3). Each is verified-`CORRECT` against the code, mechanical/localized, and inside `plan.md`'s
authorized surfaces. ⛔ **None is a frontier-move, a behaviour change outside the plan, or a disputed
severity.**

1. **R20 — three sites still asserting the reason R3 disproved**
   (`test/mover-exemption-step.test.js`: the header comment's item 1, `S1`'s `why`, `S5`'s failure
   message). Changed: all three now state that the sentence **carries no reason at all**, name both
   failed replacements with the measurement that killed each, and point at `UNCONDITIONAL` as where
   the rule lives. *Why it qualified — verified `CORRECT`, mechanical, in-plan, and its treatment was
   FORCED by an owner ruling rather than chosen by me.* R20 carries no ruling of its own; its row
   says to *"resolve them consistently with R19's deletion"*, and R19's ruling is the owner's. Once
   the causal clause is deleted from the skills, three test messages asserting a reason for it are
   not a judgment call — they are the same edit finishing. ⚠️ **One pre-existing sub-item fixed with
   it:** two references reading `S4` where the pin is `S5` (verified: `S4` is uniformity at `:1089`,
   `S5` is the absence pin at `:1118`). Mechanical, in the lines I was already editing.
2. **R22 — R13's rationale left stale in two places** (`test/mover-exemption-step.test.js`'s `S3`
   comment, and this worklog's build decision-log entry 5). Changed: the test comment now says the
   `moveAt[0] + 1` offset merely starts the slice after the anchor and marks the old reason stale
   with its cause; the worklog entry gained a **superseded note appended rather than a rewrite**,
   because a worklog is a dated record. *Why it qualified — verified `CORRECT`, mechanical,
   localized.* `SPRINT_GIT_MV` matches a `git mv` command line, which can never satisfy
   `startsWith('### ')`; I re-confirmed independently that it matches exactly one line per mover and
   does not match the cancelled mover's `mkdir -p`. ⛔ **The assertion itself was not touched** — the
   finding says it is correct, and it is.

3. **My own defect in this round's `review.md` prose, caught by the full gate and fixed.** The first
   draft of the R24 row cited `ai-agents/tasks/done/0268-…/worklog.md` **by line number**
   (`:131`/`:156`). ⛔ **That reds `coordination-citation-policy`'s `L2`** — an OPEN record citing a
   coordination document by a line number that moves when a third party appends. It is the exact
   class blind spot 11 names (*"an open review.md is scanned and NOT exempt"*), and `0341`'s ledger is
   the first review.md to sit in `backlog/` while the gate runs. Changed: the row cites a **quoted
   fragment** instead, and says so in-place. *Why it qualified — my own defect, caught by my own red
   run; mechanical, and the repair is defined by the rule.*
   ⚠️ **How it was found matters, so it is stated:** the first full `npm test` of this round exited
   **1** with `✗ hard gate FAILED` at baseline **`0b`**, not at a mutation. `0b` re-runs the whole
   suite against a copied launcher **after** the unit phase, so it scanned the ledger text I had
   written *during* that run — which is why the unit phase inside the same invocation was 963/963
   green and `0b` was red. The gate did its job; the round-1 caveat about a lost capture did not
   recur, because this run was redirected to a file.

**No other fix was applied unattended, and no obvious-winner call was made this round.** ⛔ Nothing
was returned as `NEEDS-DECISION`, and **no accepted residual was opened** — all six findings resolved
to `✅ done`.

⭐ **One judgment inside an owner ruling, disclosed rather than buried.** R23's ruling is *"Fix it"*,
which admits two readings: correct the numbers, or delete the false clause. I **deleted** it. The
corrected count (37 outbound vs 12 inbound, re-measured myself) does not support the conclusion
either — the inversion's real justification holds at any ratio and is already stated in bold in the
next breath — so writing a corrected-but-still-non-sequitur causal claim would have repeated exactly
the failure R19's ruling exists to stop. Obvious winner within the ruling's intent, and consistent
with the owner's own direction on the sibling finding.

### Round-2 measured results

| Suite | Result |
|---|---|
| `npm run test:unit` | **963 pass / 0 fail**, 24 suites, 78.0s — baseline **held** |
| `test/mover-exemption-step.test.js` | **24/24** — held through R19's shortened `SPRINT_SWEEP_LEAD` and R20/R22's message rewrites |
| `test/reference-integrity.test.js` | **22/22**, **`0 broken, 7 named-exempt`** — both pinned figures held (904 files, 3522 targets, unchanged from round 1) |
| `test/rules-block-budget.test.js` | **3/3** — block **3906 B**, **446 B** free under the 4352 B cap, `RULES_MAX` untouched. ⭐ **Re-measured against the real `emit_block()`, not assumed**: unchanged, as expected — no edit this round touched `claude/scaffold/universal-rules.md` |
| `test/coordination-citation-policy.test.js` | **21/21** — held |
| `bash claude/fkit-claude-init.sh .` | **ran** — 7 agents, 28 skills. Verified afterwards: both movers are byte-identical to their `.claude/` copies |
| `test/coordination-citation-policy.test.js` | **21/21**, `RESIDUAL 0 across 0 files` — ⛔ **red once at `L2`** on my own ledger prose (decision-log entry 3), then green |
| `npm test` (full, chains `prove-red.sh`) | ⛔ **First invocation exited 1** — `✗ hard gate FAILED` at baseline `0b`, my defect, entry 3. **After the fix: exit 0, `✓ hard gate PASSED`** — all **15** `0a`–`0o` baselines green, **34/34** mutations red their named assertion (33 `T3`, 34 `T11` included). ⭐ **Round-1's caveat is discharged:** the unit tally *inside* the full run was directly observed — `tests 963 / pass 963 / fail 0`, 79.4s — because the run was redirected to a file |

⚠️ **What this round did NOT change: the uncovered surface.** Still four uncovered behaviours; still
no test that reaches either mover running. **Four of this round's six fixes are verified by reading
only** — R19's skill text is pinned by `SPRINT_SWEEP_LEAD`, but R21, R23 and R24 are pinned by
nothing at all.

⛔ **The structural cause of the R6→R21 recurrence is UNFIXED, by design.** *Which `dashboard.sh` mode
emits which drift record* is asserted in prose across four skill copies and pinned by **no test**, so
every statement of it — including the one I just wrote — is a fresh chance to be wrong. Asserting the
emitter map against `dashboard.sh` would be a new test surface, outside `plan.md`, and was **not**
added. Recorded as this round's honest residual risk, and the likeliest source of an instance five.

---

## Change surface

### New — the two movers
- **`claude/skills/fkit-sprint-done/SKILL.md`** (390 lines) — `⛔ Owner: the producer` banner,
  `>-` folded frontmatter, `## Resolve the status value FIRST` (ADR-033 §5 table), nine steps in
  **ADR-047 §4's INVERTED order** (banner → rows → briefs → repoint → `git mv`), the `0381` exemption
  clause in the `git mv` step's tail, ambiguity handling, report shape.
- **`claude/skills/fkit-sprint-cancelled/SKILL.md`** (414 lines) — the mirror, plus: mandatory reason
  argument, rows **always** to the Backlog board, `cancelled/` created on first use, and a
  downstream-dependents sweep (step 8) the `done` mover does not need.

### The ordering surface (D1)
- **`claude/skills/fkit-status/dashboard.sh`** (+87 lines) — `mode_successor`, a three-argument
  dispatch branch, and `USAGE` **appended after `status <plan>`** (inserting earlier reds the ADR-041
  usage assertion, whose unanchored pattern ends at `select-active <sprints-dir>`).

### Ownership and enforcement
- **`claude/skills-for-role.sh`** — the **producer** row gains both names, and nowhere else. Header
  comment generalized to four movers.
- **`test/skill-ownership-hook.test.js`** — `UNIVERSE` 25 → 27; `MOVERS` **two → four**; the
  spot-check loop's literal grows to four (it cannot reference `MOVERS`, which is in the temporal dead
  zone at that point — noted in-file); the exactly-one-role invariant comment updated to say four.
- **`test/skill-frontmatter.test.js`** — `EXPECTED_SKILLS` **26 → 28**, the deliberate edit its own
  failure message demands.

### The `cancelled/` tree (D2 + V4)
- **`ai-agents/sprints/cancelled/.gitkeep`** — the repo's own placeholder idiom (`sprints/done/.gitkeep`
  is the precedent).
- **`test/coordination-citation-policy.test.js`** — `'ai-agents/sprints/cancelled/'` added to `L6
  scope`'s `forbidden`, beside `done/` and `reviews/`, plus the header's blind-spot 4.
  ⚠️ **The `existsSync` trap the plan flagged is real and is what `.gitkeep` answers**: `L6` asserts
  each forbidden tree **exists**, so the prefix without the tree would have redded.
  ⭐ **Measured correction to V4's premise, stated because it changes nothing but should not be
  mis-taught:** `collectFiles()` reads `ai-agents/sprints/*.md` at **depth 1 with an `isFile()`
  guard**, so a board under `cancelled/` was **already** excluded by construction. The `forbidden`
  entry is a *defensive pin*, not the exclusion mechanism. V4's ruling is discharged as written; its
  stated reason (*"the first cancelled board would be scanned"*) does not reproduce.

### The clause (step 6)
- **`test/mover-exemption-step.test.js`** — a **second roster** (`SPRINT_SKILLS`), discovered by its
  own signature `### N. Move the board FILE to`, **deliberately not folded into `SKILLS`/T0**. Seven
  new tests `S0`–`S6`: roster, all eleven shared subjects, the board-word pins, **placement after the
  `git mv` step**, uniformity, a **negative** pin, and roster disjointness. `17 → 24` tests.

### `0338` R7 (item 4)
- **`claude/skills/fkit-status/SKILL.md`** — three sites: resolve a named sprint against `cancelled/`
  too; a cancelled board's rows read `➡️ Moved to Backlog`, **not** *moved to a successor*; the usage
  example.

### Prose (step 8)
`claude/agents/fkit-producer.md` (3 of its 4 sites — the fourth is the ship-loop's task close, still
`/fkit-task-done`, correctly unchanged) · `claude/skills/fkit-team/SKILL.md` · `claude/scaffold/CLAUDE.md` ·
`claude/scaffold/ai-agents/tasks/README.md` **+ its live twin** · `claude/scaffold/universal-rules.md` ·
`claude/scaffold/…/task-status-vocabulary.md` **+ its live twin** · `claude/README.md` ·
`ai-agents/knowledge-base/architecture.md` · regenerated `claude/structure-manifest.tsv` (3 rows moved)
· `CLAUDE.md` / `AGENTS.md` rules blocks (generated by init — **not hand-edited**).

---

## ⛔ The uncovered surface — plan §6 Q3, recorded so a green suite cannot imply coverage

**No test in this repo reaches either mover's actual behaviour, and none can be written here.** Both
skills are **markdown prose an LLM executes**. What the 963-test green run proves is that the *text* is
present, uniform, correctly placed, and that the one *executable* surface behaves.

**Specifically NOT covered — four behaviours, named:**

1. **The banner write.** Nothing observes a mover stamping line 3, replacing an existing banner rather
   than adding a second, or inserting one where line 3 is prose. The *grammar* is testable through
   `dashboard.sh status`; the *act of writing it* is not.

   ⭐ **The grammar half WAS verified by hand this build, and it is worth having the result rather than
   the assumption.** All five banner forms the two skills prescribe were fed to the live recognizer via
   `dashboard.sh status`: owner-`Done`, agent-closed-`Done`, `Done` + `Superseded by …` trailing prose,
   owner-`Cancelled` + reason, and agent-closed-`Cancelled` + reason — **all five resolved, exit 0**.
   Two forms the skills forbid were rejected: a dateless `> ## ✅ Done.` and a `Cancelled` banner
   missing the period after the date — **both `unresolved`, exit 3**. So the prose and the recognizer
   agree. ⛔ **This is a one-shot measurement, not a standing test**, and it says nothing about item 1's
   real gap: whether a mover actually writes one of those five strings onto line 3.
2. **Row disposal.** Nothing observes a mover freezing closed rows, relocating open ones, appending
   `— priority M`, or omitting it on an unranked destination. The *successor selection* is covered
   (S1–S10); what the mover then writes onto the row is not.
3. **The link repoint.** Nothing observes the wider sweep running, the `../` → `../../` depth shift, or
   an evidence occurrence being left frozen.
4. **The `git mv`.** Nothing observes the move, the `cancelled/` create-on-first-use, or the
   half-moved interrupted state ADR-047 §4 accepts.

⭐ **What IS covered, so the boundary is exact:** the `successor` mode end to end (10 tests, and three
mutations measured red — the negation-vs-swap trap, dropping `Backlog` from the filter, and non-strict
ordering); the exemption clause's presence, uniformity, placement and board word (7 tests); the
ownership mapping at every role × skill pair including spawn depth (288 tests); frontmatter shape; the
citation-guard exemption; the rules-block budget.

⚠️ **A scripted extraction of the link-repoint step would make item 3 testable, at the cost of a new
executable surface. That is a fresh design decision, not this plan, and was NOT authorized here.**

### ⚠️ A second, smaller gap — no `prove-red.sh` entry for anything added here

`0381` gave its two byte-exact prose pins durable red-gate mutations (**33** for `T3`, **34** for
`T11`). **The `S`-series has no equivalent**, and neither does the `successor` mode. The plan's §3
testing table does not ask for one, so this is a scope statement rather than an omission I chose —
but the asymmetry is real and should be weighed, not discovered:

> ⛔ **NAMESPACE THE `S`-SERIES — corrected 2026-09-12 under owner ruling R17** (review round 1),
> option label verbatim **"Fix it now in the worklog (Rec)"**. **There are TWO unrelated `S`-series in
> this task**, and the two bullets below reference different ones six lines apart, originally with
> neither file named:
> - `test/mover-exemption-step.test.js` — the **sprint-mover roster**, `S0`–`S6`. ⛔ **There is no
>   `S7` in it.**
> - `test/dashboard-contract.test.js` — the **`ADR-047 successor`** series, `S1`–`S10`.
>
> ⚠️ **`S3`, `S4` and `S6` exist in BOTH files with different meanings, so three of the four tokens
> below collided SILENTLY** — each named a real test in the wrong file. The measurements themselves
> were correct; only the namespace was missing. ⭐ This matters downstream: follow-up **`0388`** has to
> write `prove-red.sh` mutations against named assertions **in the right file**.

- **`mover-exemption-step` `S1`/`S2` are the same class as `T3`/`T11`** — byte-exact and board-word
  pins over duplicated prose — now across **four** copies instead of two, with no durable mutation
  proving they still discriminate.
- **The `successor` mode WAS mutation-tested, but only once, by hand.** Three mutations were applied
  to a scratch copy and measured red, then reverted — **every id here is
  `test/dashboard-contract.test.js`'s `ADR-047 successor` series, NOT the mover-exemption series**:
  the **negation-vs-swap trap** (redded `successor S6`), **dropping `Backlog` from the status filter**
  (redded `successor S3` + `S4`), and **non-strict ordering** (redded `successor S4` + `S7`).
  ⛔ **Those runs are evidence from this build, not a standing gate.** Nothing re-runs them.

---

## Measured results

| Suite | Result |
|---|---|
| `npm run test:unit` | **963 pass / 0 fail**, 24 suites, 77.3s (baseline 914 → **+49**, all new: 18 hook matrix + 14 hook spot-checks + 10 `successor` + 7 sprint-roster) |
| `test/reference-integrity.test.js` | **22/22**, `0 broken, 7 named-exempt` — both pinned figures **held** |
| `test/mover-exemption-step.test.js` | **24/24** (was 17/17) |
| `test/rules-block-budget.test.js` | **3/3** |
| `bash claude/fkit-claude-init.sh .` | ran — 7 agents, **28 skills** |
| `npm test` (full, chains `prove-red.sh`) | **exit 0.** Unit phase **963 pass / 0 fail**; red gate **✓ hard gate PASSED** — all 15 baselines green (`0o`, the mover-exemption suite, included) and **all 34 mutations red their named assertion**, 33 (`T3`) and 34 (`T11`) included |

**Rules block:** 3837 B → **3923 B** (+86), **90%** of the 4352 B cap. 102 B of headroom left before
the 92% warning threshold, 429 B before the hard cap. **`RULES_MAX` untouched**, per D3.

---

## What measurement contradicted, or the plan did not anticipate

1. ⭐ **The rules-block budget is 188 B, not 166 B.** The plan's §D3 sizing said 166; measured against
   the real `emit_block()` the room to the 92% warning threshold was **188 B**. The ruling is
   unaffected — one generalized bullet cost 86 B and fits either way — but the figure in the plan does
   not reproduce.
2. ⛔ **`test/dual-home-parity.test.js` is a step-8 constraint the plan's table does not name.** It
   redded on the first full run. Two of step 8's sites are dual-homed: `tasks/README.md` (**enforced
   byte-identical**) and `task-status-vocabulary.md` (a declared `audience-adapted` exception). A plan
   that lists only scaffold paths for those two is incomplete by construction.
3. ⛔ **`claude/README.md` and `architecture.md` are declared mirrors missing from step 8's table** —
   see decision-log entry 1. `architecture.md`'s *"The 26 skills"* heading would have become false.
4. ⚠️ **V4's stated reason does not reproduce** — see *The `cancelled/` tree* above. The ruling stands;
   its premise was wrong.
5. ⚠️ **`ADR-036`'s declared site registry does not exist.** The plan's step 4 names *"ADR-036's
   declared site inventory"* as the third of three enforcement sites. Measured: `test/skill-ownership-sites.mjs`
   is **not on disk** — ADR-036's Decision 2 was accepted and never implemented. There was nothing to
   register the two new skills in, and nothing to edit. Flagged, not fixed: implementing ADR-036 is
   plainly outside this plan.
6. ⚠️ **The clause's `Moving a folder into \`<board>/\`` sentence is literally inaccurate for a sprint
   mover** — a sprint board is a **file**, not a folder. It was **kept verbatim** because the plan's
   step 6 rules *"Everything else is byte-identical modulo the board word"* and names exactly ONE
   phrase to reword. Rewording it would have forced a sprint-specific `THREE_DIRECTIONS` constant and
   broken the shared-constant design the plan asked for. **Recorded rather than fixed, for a reviewer
   to weigh** — it is a wording call inside a boundary the owner approved, not a defect I chose to
   leave.
7. ⭐ **`reference-integrity`'s corpus figures moved** — 899 → **901 files**, 3492 → **3513 targets**,
   because the two new SKILL.md files carry links. The plan quoted the old figures as a baseline; the
   **pinned** values (`0 broken`, `7 named-exempt across 6 keys`) are what held, and they did.

---

## Not done here, deliberately

- **`ai-agents/sprints/backlog.md`'s "Off:" bullet (D4)** — a producer surface. The driver routes it.
- **No commit, no push.** Everything is staged-in-working-tree only.
- **No task file moved**, and no mover invoked.
- **`sprint-status-vocabulary.md` was not created.** ADR-047 §1 names it and rules that *a separate
  task writes it*. It is referenced from both new skills and from both vocabulary copies **in
  backticks, never as a markdown link**, exactly as ADR-047 authored it — so no link rots.
