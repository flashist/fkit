# Worklog — 0203

**Task:** amend the sprint loop's *"Rules that make this honor the ADRs"* block with the faithful-carry
construction. **Role:** `fkit-sprint-ship-loop` Build worker (spawned `@fkit-coder`), under the
declared-approval marker. **Date:** 2026-08-05.

## ⚠️ How the plan was carried to me — the defect this task repairs, biting on this task

**The spawn prompt's paste leg was NOT verbatim.** It claimed *"The plan is carried BOTH ways below —
paste and pointer — and I confirmed both legs are in this prompt by looking at it before sending."* The
pointer leg was **correct and verified** (`cba052cdf18244f1dbe657402b2b15e40edfc7be`, 17,991 B, 228
lines — all three re-derived firsthand and matching). The paste leg was a **condensed restatement** of
the plan, roughly 60% of its length: §0 (provenance and evidence classes), §3's element-mapping table,
§5's collision table and §7's coordinate table were compressed to single lines or dropped, and §2's rule
text was reflowed to different line breaks.

This is the **same shape** as the two failures the amendment exists to prevent — a completeness claim
over bytes that were altered — and, as the shipped rule's step 4 says, **the pointer is what made it
detectable.** I did not act on the paste. I ran `Bash(cat plan.md)`, verified `git hash-object` and
`wc -c` against the pointer, and implemented from the file's bytes.

**Not returned as `BLOCKED`, deliberately.** The return contract's `BLOCKED` trigger is narrow — *"if
hash or byte count disagrees with the paste"* — and neither did: both matched the file on disk. With the
pointer intact and the authoritative bytes read this turn, the risk the marker's condition (b) exists to
prevent (acting on a mis-carried plan) was fully removed. Blocking would have stalled a task I could
execute exactly. **Surfaced loudly instead, here and in the return.**

## Coordinate re-verification (nothing inherited)

Every anchor in plan §7 re-derived from surrounding text this turn and **confirmed exactly**:
`**Rules that make this honor the ADRs:**` at `:149`; the first bullet ending `…not a verifiable token.`
at `:150-156` (anchor `grep` returned exactly **1** hit — checked before editing); the next bullet
`**The plan/build split…**` at `:157`; `## Stop conditions` at `:243`; file **309 lines / 25,457 bytes**,
blob `cce59c1d412d36f5e6a1b987e1b2a57f9c00d89f` — matching the plan's plan-time measurement.

## What changed

One file — `claude/skills/fkit-sprint-ship-loop/SKILL.md`. **One insertion, zero deletions, zero edits to
existing lines** (verified: `diff` old→new = 0 `<` lines, 62 `>` lines). The first bullet's existing
awkward line wrap was left untouched, per plan §1.

The inserted text is a **mechanical copy**, not a retyping: I extracted plan.md §2's fenced block with
`awk` to a file, inserted that file's lines with `awk`, then `cmp`'d the block back out of the result —
**byte-identical**. This was a deliberate choice to practise the discipline the block installs.

## Two plan statistics corrected — stated, not silently inherited

Both are **derived counts in the plan's prose, not the mandated artifact**; §2's verbatim text governs
and shipped unaltered.

1. **Insertion is +62 lines, not +56.** The plan's `+56 / −0` counts only **non-blank** lines — the
   extracted block is 60 physical lines of which **56 are non-blank** (`grep -c '[^[:space:]]'` = 56), plus
   the 2 blank separator lines markdown requires for the sub-block to render as its own paragraph inside
   the list item rather than lazily continuing the bullet's last line.
2. **`## Stop conditions` moved `243 → 305`, not `243 → 299`** (plan §5). Same cause: `299 = 243 + 56`.
   ⚠️ **`0208` should take 305, not 299** — and per plan §5 should re-derive from text regardless.

## Decision log (ADR-020 / ADR-032 A2)

Fixes applied without asking: **none** — this was a Build step, not a Process-review; no review findings
existed. Obvious-winner calls: **two**, both formatting-level and inside the approved plan's intent.

| # | Call | What I did | Why it qualified |
|---|---|---|---|
| 1 | Blank lines around the inserted block | Added one blank line before the block and one after, before the `- **The plan/build split**` bullet | **Mechanical + in-plan.** Plan §1/§2 mandate an *"indented sub-block under the first bullet"*; without a preceding blank line markdown treats line 1 as a lazy continuation of the bullet's final line and merges it into that paragraph — i.e. the plan's mandated shape does not render without them. Changes no mandated byte. |
| 2 | Proceeding despite the non-verbatim paste | Implemented from `cat`-read `plan.md` after verifying the pointer, rather than returning `BLOCKED` | **In-plan, hazard removed.** Pointer verified on all three of path/blob/byte-count; the authoritative bytes were in context this turn. See the ⚠️ section above for the full reasoning and why it is recorded rather than waved through. |

Nothing outside the approved plan was touched: `claude/agents/fkit-coder.md`, every hook, the §2 step
table's Build row, the §5.4 exit-table region, `ai-agents/wiki-vault/`, and every test are **unchanged**.
No commit, no push.

## Verification

**Content greps — these are the proof (plan §6, all ten):**

| # | Pattern | Hits |
|---|---|---|
| 1 | `unverified — no hook checks it until follow-up 3 lands` | **2** (`:181` literal pointer form, `:183` the instruction to emit it) — as §3 requires |
| 2 | ``NOT the `Read` tool`` | 1 |
| 3 | `cat -n` | 1 |
| 4 | `2000 lines` | 1 |
| 5 | `wc -c` | 2 |
| 6 | `git hash-object` | 4 |
| 7 | `a word a driver may apply only to bytes it read from a file that turn` | 1 |
| 8 | `a phrase a driver may use only after looking at what it wrote` | 1 |
| 9 | `never a partial paste` | 1 |
| 10 | `narrows the hazard; it does not remove` | 1 |

**Tests — baseline first, then after. Both green, unchanged:**

| Run | `node --test test/skill-frontmatter.test.js` | `node --test test/*.test.js` | `bash test/prove-red.sh` |
|---|---|---|---|
| Before | 28 pass / 0 fail | 567 pass / 0 fail (17 suites) | gate PASSED, mutations 1–14 all red |
| After | 28 pass / 0 fail | 567 pass / 0 fail (17 suites) | gate PASSED, mutations 1–14 all red |

⚠️ **The green suite is a REGRESSION CHECK, never proof the amendment landed.**
`test/skill-frontmatter.test.js` globs every `claude/skills/*/SKILL.md` but its `splitFrontmatter` helper
slices at the closing `---` and discards the body — **no test in `test/` reads this file's body.** The
greps above are the proof. No text-presence test proposed, per the brief's exclusion.

**Checked non-risk cleared:** `prove-red.sh` **mutation 9** (de-indents this file's `description: >-`
continuation) still reports **red** after the edit — **no no-op**, as plan §6 predicted.

**Change surface.** `git diff --stat` shows 12 files, but the tree was already dirty from earlier tasks
this run (plan §6 anticipated this — check the diff, not a clean tree). **My surface is exactly one
file.** Decomposition, verified rather than asserted:

- `HEAD:claude/skills/fkit-sprint-ship-loop/SKILL.md` = blob `9ac0b042…`, **296 lines / 24,394 B**
- my pre-edit baseline = blob `cce59c1d…`, **309 lines / 25,457 B** → the **13** pre-existing uncommitted
  lines are **`0191`'s alone** — ⚠️ **corrected in Process-review round 1 (finding `R7`): the original
  text here read *"`0202`/`0191`'s"*, and `0202` contributes 0.** `0202` is committed in HEAD, verified
  by `git show HEAD:claude/skills/fkit-sprint-ship-loop/SKILL.md | wc -l` → **296**. The 13 are ADR-037's
  driver-side hard-rule clause from `0191`. The arithmetic below is unaffected.
- after = blob `94725627afec2d86cbd152dbe1ed330c033f8615`, **371 lines / 30,430 B** → **62 lines mine**
- `75 insertions` in `git diff --stat` = **13 pre-existing + 62 mine**; **0 deletions**

⚠️ **The `cce59c1d…` baseline blob above is permanently uncheckable — recorded in Process-review round 1
(finding `R8`).** `git hash-object` **without `-w`** computes a hash without storing the object, and the
pre-edit file state no longer exists anywhere, so `git cat-file -t cce59c1d412d36f5e6a1b987e1b2a57f9c00d89f`
returns *"could not get object info"* and always will. **The claim survives independent reconstruction
even though its cited proof does not:** HEAD's blob `9ac0b042` **is** in the object database at 296 lines,
the working file is measurable, and the hunk arithmetic attributes 13 lines to `0191` and the remainder to
this task's insertion — all re-derived firsthand. **Only the proof fails, not the fact.** This is a live
instance of exactly the hazard the shipped `unverified` marker names, and it is left standing as evidence
rather than quietly repaired.

**New blob and byte count (plan §6's closing requirement):**
`94725627afec2d86cbd152dbe1ed330c033f8615`, **30,430 bytes / 371 lines**.

## Carried forward, not decided here

Plan §9's flags stand untouched and are the owner's, not mine: scope grew 2026-08-03 (element 7) while
the rank did not, and `P181` is append rank — on merit `0203` belongs directly below `0202`.

---

# Process-review — round 1

**Role:** `fkit-sprint-ship-loop` **Process-review** worker (spawned `@fkit-coder`), running
`/fkit-process-stateful-review`. **Date:** 2026-08-05. Ledger: this folder's `review.md` (reviewer
findings `R1`–`R8` + one suppressed Codex finding). All dispositions below were **ruled by the owner via
`AskUserQuestion` in the live driver session** and relayed with the spawn — **none was chosen by me.**

## ⛔ How the plan was carried to me — a declared pointer-only carry, and the owner's one-time waiver

**This spawn carried the approved plan by POINTER ONLY — the degraded form of step 5 — and the driver
declared it as such rather than concealing it.** That is a material improvement on the Build spawn, which
certified a verbatim paste that was a ~60% condensation. The driver's stated reason: it could not
reproduce 17,991 bytes inline with confidence of fidelity, having already failed at exactly that on this
task.

**A pointer-only spawn fails condition (b) of the declared-approval marker**, and `fkit-coder.md` gates
the source write on **all** of (a)(b)(c) — *"Everything else still refuses … you return the plan and write
no source."* **So I refused and returned `NEEDS-DECISION` rather than editing.** I did not treat the
Build worker's precedent as governing: that spawn had a paste (defective), so (b) was *nominally*
satisfied; this one had none, so (b) failed on its face.

**The owner then ruled — `AskUserQuestion`, live driver session, 2026-08-05 — a ONE-TIME WAIVER for this
spawn** (my Option 2), and I proceeded on the `cat`-read bytes, whose pointer I had verified on all three
legs: blob `cba052cdf18244f1dbe657402b2b15e40edfc7be`, **17,991 B**, **228 lines**, matching the
declaration exactly.

⚠️ **The waiver's stated cost, recorded because the owner required it be recorded:** it sets a precedent
that a pointer-only spawn can be waived through, **three days after the owner rejected A3 precisely for
being self-authorizing.** The mitigation is that the waiver is *named, dated and owner-issued* rather than
worker-assumed — the property A3 lacked. **The standing rule is UNCHANGED: the paste remains required, and
this waiver binds this spawn only.**

**Logged as a candidate for `0204`'s ADR, not acted on:** amend condition (b) to accept a pointer-only
carry **when the worker re-derives the blob itself**, on the reasoning that a worker's `cat` at a verified
blob is strictly more faithful than any model-emitted paste, and that `0204`'s hook would make it
mechanically checkable. **Not decided here and not filed by me.**

## ⚠️ `SKILL.md` now diverges from `plan.md` §2, which mandates that text verbatim — owner-authorized

`plan.md` §2 mandates the inserted block verbatim, and the Build worker copied it mechanically
(`awk`-extract → `awk`-insert → `cmp`, byte-identical) on purpose. **Findings `R1`, `R3`, `R4`, `R5` and
`R6` all edit that mandated text, so the shipped file is deliberately OUT OF SYNC with the approved
plan.** The owner **approved the divergence explicitly** when ruling those five findings on 2026-08-05.
**`plan.md` itself was NOT re-authored** — it remains blob `cba052cdf18244f1dbe657402b2b15e40edfc7be`,
re-derived after all edits. The plan records what was approved; the file records what shipped; this entry
is the bridge between them.

## Decision log (ADR-020 / ADR-032 A2)

**Fixes applied under the owner's dispositions: 6** (5 in `SKILL.md`, 2 corrections in this worklog).
**Obvious-winner calls: 2**, both formatting-level. **Nothing was applied on my own authority** — the
standing approval covered execution, and every finding's disposition was owner-ruled before I edited.

| # | Finding | What changed | Why it qualified |
|---|---|---|---|
| 1 | `R1` (medium) | Step 1 gains a ⚠️ naming **`Bash`'s own truncation cap qualitatively**; step 2 now compares `wc -c <path>` against **the bytes `cat` actually returned**, with the truncation notice named as the tell | Owner-ruled FIX, in-plan. ⛔ **Deliberately pins NO byte figure** — see the refinement below |
| 2 | `R3` (medium) | The emitted literal now reads `unverified — no hook checks it until 0204's carry-check hook lands`; added a ⛔ clause naming **`0204` as the remover, in the same change that lands the hook** | Owner-ruled FIX. Makes the marker resolvable **where it is read** — in the spawn prompt |
| 3 | `R4` (low) | `2026-08-02` → **`2026-08-03`** at step 6's `0202` citation | Owner-ruled FIX; **Codex cleared this date and Codex was wrong.** Verified against two independent artifacts |
| 4 | `R5` (low) | Step 4's *"both, never either/or"* now carries *"— **except step 5's declared degraded form**, which is the only either/or this construction licenses"* | Owner-ruled FIX, four-word class, mechanical |
| 5 | `R6` (low) | *"entitled to refuse it"* → *"**must refuse it** — the refusal is mandatory, not discretionary"*, citing `fkit-coder.md`'s (a)(b)(c) gate and this file's own rule | Owner-ruled FIX. ⛔ **`claude/agents/fkit-coder.md` untouched** — root cause is `0163`, out of scope |
| 6 | `R7`, `R8` (low) | Change-surface decomposition corrected to **`0191`'s alone**; the uncheckable `cce59c1d…` baseline recorded with its claim-survives/proof-fails split | Owner-ruled FIX in the worklog; record-level, no artifact change |
| OW-1 | — | Reflowed two of my own lines to the file's ~100–108 char house width | **Mechanical.** ⚠️ One reflow was constrained: the phrase `narrows the hazard; it does not remove` is a **verification grep** and had to stay on one line — I wrapped before `narrows`, not inside it, and re-ran the grep to confirm **1 hit** |
| OW-2 | — | In B1, `until follow-up 3 lands` → ``until `0204`'s carry-check hook lands`` | **Resolvability only, and reported loudly because B1 is protected.** Leaving the one unresolvable ordinal in the file while removing it everywhere else would have created a fresh inconsistency. ⛔ **This does not weaken B1** — no caveat, bound or admission was touched; only an ordinal became a task id |

## ⛔ B1's honest-bound paragraph — deliberately NOT weakened

Both reviewers concurred that B1 (*"The honest bound on 'true by construction'"*) is what keeps
*"True by construction, or forbidden."* from being a false claim, and the review's ⚠️ warned explicitly
against "fixing" `R2` by softening it. **Every substantive byte stands.** The only edit is OW-2's ordinal
→ task id. `R2` was accepted as a residual **with no edit to the artifact at all**, which is exactly how
the review costed it.

## Two refinements to the dispositions — raised by me, both ACCEPTED by the owner before I edited

Review notes are inputs to evaluate, and two dispositions rested on premises worth adjusting:

1. **`R1` — name the cap QUALITATIVELY, pin no number.** Writing a live-measured harness constant into
   durable skill prose re-creates the exact defect task
   `0218-repair-0177s-stale-cap-and-byte-figures` exists to repair: `0218` documents three figures `0177`
   pinned as acceptance criteria that went false when `0190` moved `RULES_MAX` 4096 → 4352, and warns a
   worker may *"restore"* numbers by reverting an owner-signed bump. The shipped text therefore says the
   cap exists and that it moves, and states *"No byte figure is pinned here on purpose."*
   ⚠️ **I did not re-measure the cap myself this turn** — the review's 41.4 KB figure is the reviewer's,
   not mine. `R1`'s logical core does not depend on it and is airtight from the text alone: `wc -c <path>`
   measures the **file**, which is identical whether or not the read truncated, so it cannot detect a
   short read. **That is why step 2 was the part that had to change.**
2. **`R3` — the clause would have mandated what `0204` is forbidden to do.** Confirmed firsthand:
   `0204/brief.md:70-71` puts *"the SKILL.md rule text (`0203`)"* **explicitly out of scope**, while
   `:92-93` calls the removal *"a small follow-on the implementer should name in the worklog."* The owner
   ruled the clause ships **and** that a producer will amend `0204`'s brief so it may make the edit it is
   being told to make. **I did not touch `0204`'s brief** — see the producer notes below.

## ⛔ For the producer — noted, NOT filed by me

- **`0204`'s brief needs amending** so `:70-71`'s out-of-scope line permits the marker removal that
  `:92-93` already assumes. Until then the clause I shipped is a forward-reference `0204` is barred from
  honouring. Owner-ruled; a producer closes it from that end.
- **A fidelity-leg follow-up is owner-authorized** (from `R2`): re-derive `git hash-object` over the
  **pasted block**, not merely the file, so the construction gains a check that tests fidelity rather than
  presence and provenance. **I did not file it.**

## Verification — all re-run this turn, after the edits

**Content greps (`/usr/bin/grep`):**

| # | Pattern | Hits |
|---|---|---|
| 1 | `unverified — no hook checks it until 0204's carry-check hook lands` | **2** (`:188` literal pointer form, `:190` the instruction to emit) |
| 1b | `unverified — no hook checks it until follow-up 3 lands` (the OLD literal) | **0 — by design, see below** |
| 2 | ``NOT the `Read` tool`` | 1 |
| 3 | `cat -n` | 1 |
| 4 | `2000 lines` | 1 |
| 5 | `wc -c` | 2 |
| 6 | `git hash-object` | 4 |
| 7 | `a word a driver may apply only to bytes it read from a file that turn` | 1 |
| 8 | `a phrase a driver may use only after looking at what it wrote` | 1 |
| 9 | `never a partial paste` | 1 |
| 10 | `narrows the hazard; it does not remove` | 1 |

⚠️ **The marker count is still exactly 2, but the LITERAL CHANGED — stated because the brief's
verification step 6 greps the old string and will now return 0.** `R3` leg (a) is that the emitted string
names an ordinal (*"follow-up 3"*) that the worker receiving it cannot resolve, so making it resolvable
**required** changing the emitted text; the gloss naming `0204` never reaches the spawn prompt. Both hits
remain **in the rule text, neither in a footnote**, as the brief's ⛔ element requires. The only surviving
occurrence of *"follow-up 3"* is inside the new clause explaining why it was replaced.

**All seven required elements survive** — greps 2–10 above map to elements 1–7 exactly as `plan.md` §3
lays them out; none lost a hit.

**Change surface:** `git diff --numstat` → **`91 0`** on `claude/skills/fkit-sprint-ship-loop/SKILL.md`.
**Zero deletions** — my edits fall inside the block that is itself still uncommitted, so git sees the
whole region as added. `91 = 13` (`0191`'s) `+ 78` (this task's block, grown 62 → 78).
**Out-of-scope files confirmed byte-unchanged:** `claude/agents/fkit-coder.md`, `0204/brief.md`, all of
`test/`, the §2 Build row (`:121`, verified in place), and `ai-agents/wiki-vault/`. The §5.4 exit-table
heading moved `305 → 321` purely by displacement; **its region was not edited** — ⚠️ **`0208` should now
take 321**, and per plan §5 should re-derive from text regardless. The only other `claude/` changes are
`0190`'s, unchanged from the Build round.

**`plan.md` untouched:** `git hash-object` → `cba052cdf18244f1dbe657402b2b15e40edfc7be` after all edits. ✅

**Tests — ⚠️ REGRESSION CHECK ONLY, never proof the amendment landed:**

| Run | `node --test 'test/*.test.js'` |
|---|---|
| Before my edits | **567 pass / 0 fail / 17 suites** |
| After my edits | **567 pass / 0 fail / 17 suites** |

**No test in `test/` reads this file's body** — `skill-frontmatter.test.js` discards it at
`splitFrontmatter` — so green means only that nothing broke. **The greps above are the proof.** No
text-presence test was added, per the brief's exclusion.

⚠️ **`bash test/prove-red.sh` was NOT run this round, so the `npm test` pair is incomplete.** It mutates
files in place and this working tree is shared and dirty across a dozen tasks; the reviewer declined it
for the same reason and I concur. **Neither half of the Build round's `prove-red` result is re-verified
by me.** Stated, not waved through.

---

# Process-review — round 2

**Role:** `fkit-sprint-ship-loop` **Process-review** worker (spawned `@fkit-coder`), running
`/fkit-process-stateful-review`. **Date:** 2026-08-05. **Round 1's block lifted** — all eight findings
discharged, convergence reached, no round 3. Round 2 raised **3 medium findings, none blocking**; two were
mine, one is the producer's. **All dispositions owner-ruled via `AskUserQuestion` in the live driver
session — none chosen by me.**

⚠️ **Round 1's `R4` date fix was vindicated:** Codex cleared `2026-08-02` as correct in round 1 and
**confirmed in round 2 that the fix was right.** Recorded because it is the concrete case for the standing
rule that review notes are inputs to evaluate, not orders — deferring to Codex there would have shipped a
wrong date.

## Decision log (ADR-020 / ADR-032 A2)

**Fixes applied under the owner's dispositions: 2.** **Obvious-winner calls: 2**, both cosmetic.
**Nothing applied on my own authority.**

| # | Finding | What changed | Why it qualified |
|---|---|---|---|
| 1 | `R9` (med) | Step 2 rewritten to **lead with the truncation notice** as the tell — *"if it said it truncated, the read failed"* — and to say outright that the byte count of what `cat` returned **is not exposed**, so *"compare the two figures"* is not an operation a driver can perform. `wc -c <path>` demoted to the **corroborating** figure the pointer and step 5 want, explicitly **not** the guard | Owner-ruled FIX, in-plan. **`R1`'s core is preserved** — step 2 was measuring the wrong object; round 1 fixed the object but prescribed a comparison with only one obtainable operand. Round 2 makes it performable |
| 2 | `R10` (med) | The removal clause now **enumerates all FIVE stale sites** instead of the two most visible, prefaced by the reason: **`0204` may never open this file** | Owner-ruled FIX. Codex's five-site enumeration beat the reviewer's four and was adopted; **I re-derived the sites myself rather than copying the count** — see below |
| OW-1 | — | Reflowed my own step-2 opening (110 chars → house width) | Mechanical; no mandated byte touched |
| OW-2 | — | Step 1's forward-reference *"which is why step 2 checks what `cat` actually returned"* → *"which is why step 2 leads with that notice"* | **Coherence, inside `R9`'s own scope.** After `R9` step 2 no longer performs a returned-bytes comparison, so the old forward-reference described a step that no longer exists. Leaving it would have re-created in step 1 the exact unperformable check `R9` removed from step 2 |

## `R10` — the five sites, re-derived firsthand (not taken on trust)

Derived by grepping the live file for `0204`, `unverified`, `hook`, `nothing checks`, `checked one` and
reading each hit, then asking of each: **does this become false on the day the hook lands?**

| # | Site | Why it goes stale |
|---|---|---|
| 1 | The `unverified …` line inside the fenced pointer form | It is the literal claim that nothing checks the hash |
| 2 | The ⚠️ instruction to emit that literal every time | Instructs emission of a then-false string |
| 3 | *"The hash is self-computed and self-reported; nothing checks it until `0204`'s … hook lands, and a reader must never mistake it for a checked one"* | Asserts the absence of the check the hook supplies |
| 4 | ⛔ **Inside B1** — *"and until `0204`'s carry-check hook lands, nothing does"* | Same assertion, in the protected paragraph |
| 5 | **The removal clause and its own list** | Dead text once 1–4 are gone; must be removed **last** |

**Considered and deliberately EXCLUDED, with reasons** — so the count is auditable rather than asserted:
- *"not a verifiable token"* (the first bullet, pre-existing) — about the **declared-approval marker** and
  condition (b), **not** the hash. Condition (b) is out of scope, and `0204`'s hook does not make the
  approval claim verifiable. **Not stale.**
- *"the pointer is what makes the paste checkable at all"* / *"a paste alone is unfalsifiable"* — **more**
  true after the hook lands, not less. **Not stale.**
- `:289`'s *"a sprint roll-up must not carry an unverified one across several tasks"* — a different sense
  of *unverified* (agent-closed markers), unrelated to this construction. **Not stale.**

## ⛔ B1 — NOT touched this round, and proved rather than asserted

`R10`'s site 4 sits **inside** the protected honest-bound paragraph. **Discharging `R10` did not require
editing B1**: the finding asks the *removal clause* to name the site and warn the remover, which is an
edit to the clause, not to B1. **So no `NEEDS-DECISION` was needed, and B1 was left alone.**

The clause now carries the explicit instruction: **delete THAT CLAUSE ONLY; leave every other byte of the
paragraph untouched**, with the reason (it is what keeps *"True by construction, or forbidden."* from
being a false claim).

**Proof B1 is byte-unchanged from round 1:** `md5` over the extracted paragraph → **`4da746ddbc042a497dfe3552d3e8eb7a`**, identical before and after this round's edits.
⚠️ **Its slightly ragged wrap at *"**This construction / narrows the hazard"* was left as-is on purpose** —
tidying it would be an unrequested edit to a protected paragraph, and the phrase `narrows the hazard; it
does not remove` must stay on one line for the verification grep. **Ugly beats touched.**

## Owner-ruled — recorded, not acted on

- **`R11` (the `0204` brief deadlock, `:70-71` forbids what `:92-93` assumes) is the PRODUCER's and is
  IN FLIGHT.** ⛔ **I did not amend `0204`'s brief.** Verified this turn that the file is modified in the
  working tree by that parallel producer edit and **not by me**: its diff adds an owner-ruled ✅ carve-out
  permitting the marker removal, a protected-site warning for B1, and an instruction to re-read the live
  file because *"a separate task is concurrently editing this same clause"* — that separate task is this
  one. The two ends now meet.
- **`AR-1`'s fidelity-leg follow-up is being filed by the producer.** Noted; **not filed by me.**
- ⛔ **The superseded brief step-6 literal — reviewer's ruling, recorded here so it is durable.** The
  brief's verification step 6 greps the **old** marker literal and now returns **0 hits**. The reviewer
  ruled that **0 is CORRECT**, and that restoring the old ordinal *"would re-introduce the defect `R3`
  fixed while citing a superseded brief step — the `0218` pattern exactly."* **The brief step is stale;
  the file is right.** No action, by ruling.

## Verification — all re-run this turn, after the round-2 edits

**Content greps (`/usr/bin/grep`), all ten:**

| # | Pattern | Hits |
|---|---|---|
| 1 | `unverified — no hook checks it until 0204's carry-check hook lands` | **2** — now at **`:192`** (literal pointer form) and **`:194`** (instruction to emit) |
| 2 | ``NOT the `Read` tool`` | 1 |
| 3 | `cat -n` | 1 |
| 4 | `2000 lines` | 1 |
| 5 | `wc -c` | 2 |
| 6 | `git hash-object` | 4 |
| 7 | `a word a driver may apply only to bytes it read from a file that turn` | 1 |
| 8 | `a phrase a driver may use only after looking at what it wrote` | 1 |
| 9 | `never a partial paste` | 1 |
| 10 | `narrows the hazard; it does not remove` | 1 |

**All seven required elements survive** — greps 2–10 map to elements 1–7 per `plan.md` §3; no hit lost.
⚠️ **The marker literal is still the round-1 replacement, not the brief's original** — see the ruling
above.

**Change surface:** `git diff --numstat` → **`105 0`**, zero deletions; file now **401 lines**.
`105 = 13` (`0191`'s) `+ 92` (this task's block, grown 62 → 78 → 92).
**Out-of-scope confirmed byte-unchanged:** `claude/agents/fkit-coder.md`, all `test/`, `ai-agents/wiki-vault/`,
the §2 Build row (grep → 1 hit, in place), and the §5.4 exit-table region. `0204/brief.md` **is** modified
— **by the producer, not by me** (above).

⚠️ **`## Stop conditions` has now moved a fourth time: `243 → 305 → 321 → 335`.** **`0208` should take
`335`** — and per `plan.md` §5 should re-derive from surrounding text regardless, precisely because this
coordinate keeps moving.

**`plan.md` untouched:** `cba052cdf18244f1dbe657402b2b15e40edfc7be`, re-derived after all edits. ✅

**Tests — ⚠️ REGRESSION CHECK ONLY:**

| Run | `node --test 'test/*.test.js'` |
|---|---|
| Before round-2 edits | **567 pass / 0 fail / 17 suites** |
| After round-2 edits | **567 pass / 0 fail / 17 suites** |

No test reads this file's body, so green means only that nothing broke; the greps are the proof.
⚠️ **`prove-red.sh` NOT run — owner-accepted, shared dirty tree.** The `npm test` pair remains incomplete.
