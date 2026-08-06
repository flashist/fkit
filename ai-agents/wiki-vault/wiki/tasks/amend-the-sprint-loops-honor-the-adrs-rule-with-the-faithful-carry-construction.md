# Amend the sprint loop's *"Rules that make this honor the ADRs"* with the faithful-carry construction

**Source**: `ai-agents/tasks/done/0203-amend-the-sprint-loops-honor-the-adrs-rule-with-the-faithful-carry-construction/brief.md`
**Status**: done — `✅ Done (agent-closed — not owner-verified)`, closed 2026-08-05
**Sprint/Tag**: Sprint 2 · ID `0203` · owner `fkit-coder`

## Goal
**Follow-up 2 of [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] (`0162`).** The sprint loop's rule said the Build and Process-review spawn prompts *"MUST each carry the approved plan verbatim"* and **gave no construction for satisfying it**. That is the whole of `0162`'s finding: **the requirement fired zero times in the very run that installed it**, failing twice in consecutive rounds — once by carrying **by reference** to conversation state, once by pasting with **~10 silent truncations** under an explicit *"everything else is byte-for-byte"* claim.

**The ruling this task writes down: a faithful carry is a copy operation over a durable artifact, never a recall over conversation state.**

## Key Changes
**One file — `claude/skills/fkit-sprint-ship-loop/SKILL.md`. One insertion, zero deletions, zero edits to existing lines.** The inserted text was a **mechanical copy**, not a retyping: the plan's fenced block was extracted with `awk`, inserted with `awk`, then `cmp`'d back out of the result **byte-identical** — a deliberate choice to practise the discipline the block installs.

**Seven required elements, all-or-nothing:**
1. **A byte-exact read** of `<task-folder>/plan.md` — a `Bash(cat …)`-class read. ⚠️ **Explicitly NOT the `Read` tool**, and the rule says why: `Read` returns `cat -n`-framed output (line numbers and tabs prepended, so **the bytes are not the file's bytes**) and **caps at 2000 lines by default**.
2. **A mandatory whole-file check** against `wc -c`. *A read that silently stopped short is round 2's failure with a different cause.*
3. **Paste the bytes unaltered** into the spawn prompt.
4. **Cite a pointer alongside** — the `plan.md` path plus its `git hash-object` blob hash. **Both legs; the owner rejected pure by-reference.**
5. **The "verbatim"-word discipline as a governing rule:** ***"verbatim" is a word a driver may apply only to bytes it read from a file that turn.***
6. **The pointer-only degraded form and its bound.** If the plan is too long to paste, emit the **pointer alone and say so**. **Truncation is never permissible** — never a partial paste, never a completeness claim over bytes that were cut. ***A truncation that announces itself is a defect; a truncation that certifies itself is a lie the reader cannot check.***
7. **A presence check on BOTH legs before the spawn** *(added 2026-08-03)*. The driver confirms, **in the prompt it is about to send**, that the pasted bytes **and** the pointer are **both actually there**, and states the result. ***"Both ways" is a phrase a driver may use only after looking at what it wrote.***

> ⛔ **Element 7 exists because announcing a two-legged carry and shipping one leg is not hypothetical** — it happened on `0202`'s own run: the driver announced the plan was carried *"BOTH ways — paste and pointer"* and **shipped the pointer only**.
>
> **The most important part: the pointer is what made it detectable.** With a paste and no pointer — the shape used on `0158`, `0143` and `0195` — **nothing would have surfaced the defect at all.** **The two-legged construction produced the evidence of its own first failure.** Read it as support for elements 3 and 4, **never as a case for dropping either**.

**⚠️ MANDATORY in the rule text itself:** the emitted pointer is marked **`unverified — no hook checks it until 0204's carry-check hook lands`**. This is an **owner ruling** — the amendment **ships without waiting for `0204`**, and that wording is the whole of what stops a self-computed, self-reported hash from being mistaken for a checked one.
> ⛔ **The literal changed 2026-08-05; the mandate did not.** The original ordinal form *"follow-up 3 lands"* is **superseded and deliberately absent — a grep returning 0 for it is the requirement working, not failing.** *"Follow-up 3"* is an ordinal **a receiving worker cannot resolve**: it is meaningful only against `0162`'s report ordering, which the worker reading the shipped rule does not have. **Two independent rulings, same direction** — the owner's, and the Round 2 reviewer's, which added that restoring it *"would re-introduce the defect `R3` fixed while citing a superseded brief step."*

## Outcome

### ⚠️ The defect this task repairs bit ON THIS TASK, at its own spawn
**The spawn prompt's paste leg was NOT verbatim.** It claimed both legs were present and confirmed by looking — the **pointer leg was correct and verified**, but the paste leg was a **condensed restatement, roughly 60 % of the plan's length**, with four sections compressed to single lines or dropped and the rule text reflowed. **The same shape as the two failures the amendment exists to prevent.**

**The worker did not act on the paste.** It `cat`-read `plan.md`, verified `git hash-object` and `wc -c` against the pointer, and implemented **from the file's bytes**. **Deliberately not returned as `BLOCKED`** — the return contract's trigger is narrow (*hash or byte count disagrees*) and neither did; with the pointer intact the risk was fully removed, and blocking would have stalled a task it could execute exactly. **Surfaced loudly instead.**

### Verification, and what it does not prove
Ten content greps are **the proof**, including the exactly-2 hits on the unverified-pointer marker. Tests: **28/28 frontmatter, 567 pass / 0 fail / 17 suites, `prove-red.sh` gate PASSED with all 14 mutations red** — identical before and after. ⚠️ **The green suite is a REGRESSION CHECK, never proof the amendment landed:** `skill-frontmatter.test.js` slices at the closing `---` and **discards the body — no test in `test/` reads this file's body.** Mutation 9 (which de-indents this file's `description: >-` continuation) still reports **red** after the edit — checked, not assumed.

**Two plan statistics corrected rather than silently inherited** — the insertion is **+62 lines, not +56** (the plan counted only non-blank lines, omitting the two blank separators markdown requires for the sub-block to render at all), and `## Stop conditions` moved **243 → 305, not 299**. ⚠️ **Flagged forward for `0208`, which needed the corrected figure.**

### Two accepted residuals, both owner-dispositioned
- **`AR-1` — the construction tests presence and provenance, never fidelity.** Steps 3 and 6 and both governing sentences check the paste is **there** and that its bytes were **read from the file that turn**. **None checks that the pasted bytes MATCH the file** — the 2026-08-05 Build carry satisfied every one of them and was still a ~60 % condensation. **The construction prevents the recall route outright, is repaired on the truncation route, and is detect-only on the emission-fidelity route.** **No edit** — the shipped text already states this precisely, and **both reviewers warned that "fixing" it by softening that paragraph would convert a correct document into an overstated one.** Owner-authorized follow-up: **hash the emitted paste, not just the file** — task `0227`.
- **`AR-2` — the degraded form's capability bound is self-authorizing.** *"A lazy driver cites context pressure for every long plan … and makes pointer-only the routine path."* **Substantively correct, and this very round is an instance.** **Settled, not unrecognised:** the owner rejected an invented byte threshold **and** driver's-judgment, the latter **precisely for the self-authorizing property**. No re-wording is available the owner has not already refused. ⚠️ **Counter this round: 1.**

## Related
- [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] — task `0162`, the ruling this prose edit installs; its `carried-not-approved` residual is **NOT closed by this**
- [[tasks/write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table]] — task `0202`, its hard dependency: the construction points at a `plan.md` that must exist **at spawn time**
- [[tasks/add-an-exit-table-row-for-a-failed-build-verify-review-spawn-in-the-sprint-loop]] — task `0208`, same file, different region, landed second and inherited this task's corrected coordinates
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — §5's *"none is possible"*, which a driver-side carry-fidelity proxy narrows
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the declared-approval marker whose condition (b) this construction serves; **condition (b) stands byte-unchanged**
- [[tasks/add-verbatim-to-fkit-coder-declared-approval-marker]] — task `0150`, the *verbatim* word this construction gives a meaning to
- [[tasks/build-fkit-sprint-ship-loop-skill]] — task `0111`, the loop whose rule this amends
- [[tasks/add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules]] — task `0191`, the other uncommitted edit to the same file in the same run
- [[systems/testing-and-verification]] — the frontmatter-vs-body test surface, and why the greps are the proof
- [[tasks/sprint-2-remove-omnigent]] · [[systems/fkit]]
