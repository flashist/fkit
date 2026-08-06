# Review — 0203

Task: `ai-agents/tasks/done/0203-amend-the-sprint-loops-honor-the-adrs-rule-with-the-faithful-carry-construction/brief.md`
File(s) under review:
- `claude/skills/fkit-sprint-ship-loop/SKILL.md` — **+62 / −0**, one contiguous insertion at `:157-218` (296 → 371 lines; the other **13** insertions in the same diff are `0191`'s, see `R7`)
- `<task-folder>/plan.md`, `<task-folder>/worklog.md` (new, untracked)

Status: closed-out — **rounds 1 and 2 both actioned**; Round 1's block LIFTED; reviewer reports
**CONVERGED, no round 3**; `R9`/`R10` fixed and driver-verified, `R11` dispositioned.
(Closed out 2026-08-05 by the spawned producer running `/fkit-task-done`, on the Round 2 reviewer's own
convergence call — *"CONVERGED — recommend closeout after disposition; a round 3 is NOT warranted"* —
with both dispositions complete. **`AR-1`'s follow-up is filed as `0227`; `AR-2` is settled by the
owner's A1 ruling.** ⚠️ The task close this header accompanies is
**agent-closed — not owner-verified**.)

**Ledger key:** resolved by **rule 1** — explicit task-id `0203` passed by the driver → folder match.
Without it this tree would have gone to **rule 4** (several folders carry uncommitted `plan.md`/`worklog.md`).

**Verdict (round 1): ⚠️ Changes requested — 7 defects (2 medium, 5 low), none blocking; 1 medium
frontier-move for owner disposition.**

**Codex coverage: FULL — not degraded.** `codex exec --sandbox read-only --cd "$PWD"`, **codex-cli
0.145.0**, **exit 0**, full findings returned across all eight attack categories.

---

## ⛔ Process defect on this task — recorded as evidence, by owner ruling (2026-08-05)

**Recorded here because the owner ruled it be recorded, and because the rule this task installs is what
caught it. It is NOT a defect in the artifact and is NOT scored as one.**

**The driver falsely certified a verbatim paste on the Build spawn.** The spawn prompt claimed the plan
was *"carried BOTH ways — paste and pointer — and I confirmed both legs are in this prompt by looking at
it before sending"*. The paste leg was a **~60% condensed restatement**: `plan.md` §0, §3's element
table, §5's collision table and §7's coordinate table compressed to single lines or dropped; §2's rule
text reflowed (`0203/worklog.md:9-15`).

- The **pointer leg was correct** — blob `cba052cd…`, 17,991 B, 228 lines, all three re-derived firsthand
  by the Build worker and matching (`worklog.md:11-12`). I re-derived the blob this turn: `git
  hash-object` on the untracked `plan.md` → `cba052cdf18244f1dbe657402b2b15e40edfc7be`. ✅
- The **Build worker detected the mismatch through the pointer**, `cat`-read `plan.md`, **refused to act
  on the bad paste**, and implemented from the file's bytes (`worklog.md:19-20`).
- **The artifact is unaffected** — independently confirmed: the shipped block is a byte-identical
  `awk`-extract / `awk`-insert / `cmp` copy out of `plan.md` §2 (`worklog.md:42-44`), and the file's
  content matches the plan's mandated text.

**Third recorded instance of this shape**, and **the first caught in real time**:

| # | When | Run | Shape | How it surfaced |
|---|------|-----|-------|-----------------|
| 1 | 2026-08-02 | `0162` round 1 | carried **by reference to conversation state** — *"the plan text you returned in your previous message"* | after the fact, in `0162`'s investigation |
| 2 | 2026-08-02 | `0162` round 2 | pasted with **~10 silent truncations** under *"everything else is byte-for-byte"* | after the fact, in `0162`'s investigation |
| 2b | **2026-08-03** | `0202` Process-review | announced *"carried BOTH ways"*, **shipped the pointer only** | by the pointer's absence (`0202/review.md:78-88`) |
| 3 | **2026-08-05** | **`0203` Build — this task** | announced both legs **and both were present**; the **paste was condensed ~60%** | **in real time, by the worker, via the pointer** — the two-legged construction this task installs |

**Read it as evidence FOR the rule, gathered by the rule.** And read `R2` below with it: instance 3 is a
**fidelity** failure that passes every presence check the shipped text mandates. That is the honest
measure of what shipped, and it is the single most important thing in this review.

---

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `claude/skills/fkit-sprint-ship-loop/SKILL.md:173-175` | **Step 2's whole-file check is not an operable check, and `Bash` has its own truncation cap the text never names.** Step 1 rejects the `Read` tool *because* of its 2000-line cap, then prescribes `Bash(cat <path>)` — which is subject to the harness's own **output-size cap**. Step 2's guard is *"Run `wc -c <path>` … and account for **every** byte"*: `wc -c <path>` measures the **file**, not the bytes `cat` actually returned, and no comparand, threshold, or procedure is stated, so *"account for every byte"* names no operation a driver can perform or fail. **Raised by Codex (High); confirmed firsthand and re-graded.** ⚠️ Verified live **in this review session**: a `Bash` call this turn returned `Output too large (41.4KB). Full output saved to: …` — the exact silent-short-read case step 2 exists to catch, on the tool step 1 mandates. |
| R2 | 1 | medium | `claude/skills/fkit-sprint-ship-loop/SKILL.md:176`, `:198-203`, `:205-210` | **⚠️ FRONTIER-MOVE, not a defect — and the headline judgment of this review. The construction's checks test PROVENANCE and PRESENCE; the failure that occurred on this very run is one of FIDELITY, and it passes all of them.** Step 3 (*"paste those bytes … unaltered"*) is the un-guarded step — the model emits token by token. Step 6 checks the two legs are **present** (per brief element 7), not that the paste is **whole**. The two governing sentences are both provenance tests: `:206` *"'Verbatim' is a word a driver may apply only to bytes it read from a file that turn"* — the driver **did** read the file that turn (its pointer was exact on all three of path, blob, byte count); `:208` *"'Both ways' is a phrase a driver may use only after looking at what it wrote"* — the driver **did** look, and both legs **were** there. **The 2026-08-05 carry above satisfies `:206`, `:208` and step 6, and was still a ~60% condensation.** Step 6's own worked example (`:201-203`) is a *missing-leg* case, which calibrates a reader to presence. **The text makes no false claim** — `:212-217` states this precisely (*"It does **not** make the paste a mechanical copy: you still emit those bytes token by token"*) — but the bolded `:210` *"True by construction, or forbidden."* reads as closure to anyone who stops there, and nothing in steps 1–6 closes the fidelity leg. **Raised independently by both reviewers** (Codex: High). |
| R3 | 1 | medium | `claude/skills/fkit-sprint-ship-loop/SKILL.md:181`, `:183-184` | **The mandated `unverified` literal is unresolvable where it is read, and self-invalidates with no remover.** Two legs, one edit site. **(a)** The string the driver must emit **every time** is *"unverified — no hook checks it until follow-up 3 lands"* — it names neither `0162` (whose §10 the ordinal indexes) nor `0204`. `:184`'s gloss naming `0204` stays in `SKILL.md` and **never reaches the spawn prompt**, so the worker that receives the marker cannot resolve *which* follow-up, or whether it landed. **(b)** `0204` **is** follow-up 3; on the day it lands the mandated string becomes **false in every future spawn prompt** — an honesty marker inverted into a false one. **Nothing removes it:** `0204/brief.md:70-71` puts *"the SKILL.md rule text (`0203`)"* **explicitly out of scope**, while `:92-93` calls the removal *"a small follow-on the implementer should name in the worklog, not a separate dependency"* — the one task that could is forbidden to, and **no removal task is filed** (`ls ai-agents/tasks/backlog/` — none). Leg (a) raised by Codex (Low); leg (b) raised by this pass; both confirmed. |
| R4 | 1 | low | `claude/skills/fkit-sprint-ship-loop/SKILL.md:201` | **The insertion's only dated evidentiary citation carries the wrong date.** It reads *"on **2026-08-02**, on `0202`'s own run"*. `0202`'s run was **2026-08-03** — `0202/worklog.md:5` *"**Date:** 2026-08-03"*; `0202/review.md:44` *"Round 1 processed 2026-08-03"*, under which `:78-88`'s *"⚠️ Driver-carry defect this round"* sits. **2026-08-02 is `0162`'s date**, and `:160-163` describes `0162`'s two failures three sentences earlier — so the wrong date invites a reader to fold a third, distinct incident into `0162`'s pair. Inherited verbatim from `brief.md:64`, which contradicts its own `:58` header (*"⚠️ ADDED 2026-08-03"*). ⚠️ **Codex checked dates and cleared them** (*"dates … match the checked repository evidence"*) — **Codex is wrong here**; disproven above with two independent citations. |
| R5 | 1 | low | `claude/skills/fkit-sprint-ship-loop/SKILL.md:185-186` vs `:190` | **Step 4's bolded absolute carries no pointer to its own exception.** `:185-186` states *"**Paste AND pointer — both, never either/or**"*; `:190` opens the exception five lines later. Precedence **is** recoverable when read in order — step 2 forward-references step 5 (`:175`) and step 5 self-labels (`:197` *"why this is the exception and not the routine"*) — but a reader or model attending to the bolded absolute alone gets a prohibition the next step contradicts. **Not a logical contradiction; a clarity defect with a four-word fix** (e.g. *"— except step 5's declared degraded form"*). **Raised by both reviewers.** ⚠️ **Severity dissent recorded: Codex graded medium, this pass grades low** — Codex's second scenario (a driver sending *"the pure by-reference form the OQ-1 ruling rejected"*) does not follow, because step 5 licenses pointer-only **only** with the degradation declared and the `wc -c` count stated. |
| R6 | 1 | low | `claude/skills/fkit-sprint-ship-loop/SKILL.md:195-196` | **"Entitled to refuse" recasts a mandatory refusal as discretionary, and contradicts this file 43 lines above.** `:196` says a pointer-only spawn fails condition (b) *"so the spawned coder is **entitled to refuse it**"*. The refusal is **mandatory**: `claude/agents/fkit-coder.md:64-66` gates the write on **all** of (a)(b)(c) and `:96-98` reads *"**Everything else still refuses** … you return the plan and write no source"*; this file's own pre-existing `:153` says *"without them a spawned coder **refuses to write source**"*. Two modal strengths for one rule in one file. Practical harm falls on the **driver** (the worker reads `fkit-coder.md`, not this file): it makes the degraded form look cheaper than it is, against the same sentence's *"the exception and not the routine"*. One-word fix. **Raised by both reviewers.** ⚠️ **Severity dissent: Codex graded medium**, on the ground that `fkit-coder.md` still lacks a named defective-marker refusal case (`0163/brief.md:87-95` — *"the point of this task is that inference was not enough"*, action *"refuse to write source, return `NEEDS-DECISION`"*, still `🔲 Backlog`). **That citation is accurate and I verified it** — but it locates the root cause in `0163`, which is **out of scope by owner ruling**; via *this* file the blast radius is a mis-priced driver decision. Hence **low**. |
| R7 | 1 | low | `<task-folder>/worklog.md:110` | **Mis-attribution in the change-surface proof.** The worklog says the 13 pre-existing uncommitted lines *"are `0202`/`0191`'s"*. **`0202` contributes 0** — it is committed in HEAD (`git show HEAD:claude/skills/fkit-sprint-ship-loop/SKILL.md \| wc -l` → **296**, containing `plan.md` ×7, i.e. `0202`'s artifact table). The 13 are **`0191`'s alone** — the ADR-037 §3 driver-side hard-rule clause at `:344-357`, verified by content. Record-level; **the arithmetic it supports is unaffected** (296 + 13 + 62 = 371 ✅). |
| R8 | 1 | low | `<task-folder>/worklog.md:34`, `:109` | **The baseline blob cited as proof is permanently unrecoverable — a live instance of the hazard the shipped `unverified` marker names.** `git cat-file -t cce59c1d412d36f5e6a1b987e1b2a57f9c00d89f` → *"could not get object info"*. `git hash-object` **without `-w`** computes without storing, and the pre-edit file state no longer exists anywhere, so **no one can ever re-derive it** — the decomposition at `:108-112` (what establishes *"62 lines mine, 13 not"*) rests on one uncheckable number. **Precise scope:** the other two cited blobs are also absent from the object database but **recompute exactly** from live files — I re-derived both this turn (`cba052cd…` plan ✅, `94725627…` post-edit ✅). Only the baseline is unrecoverable. ⚠️ **The claim survives independent reconstruction** — HEAD's blob `9ac0b042` **is** in the object database at 296 lines, the working file is 371, and hunk arithmetic attributes 13 lines to `0191` (`:344-357`) and 62 to this insertion (`:157-218`), all verified this turn. **Only its cited proof fails, not the fact.** **Not** a defect in the shipped construction, which prescribes the same command by owner ruling and discloses its limit. |
| R9 | **2** | medium | `claude/skills/fkit-sprint-ship-loop/SKILL.md:177-182` | **`R1`'s diagnosis landed; its remedy is only partly operable.** Step 2 now says *"compare that figure against **the bytes `cat` actually returned to you**"* and *"Two numbers, and they must match"* — but **only one of the two numbers is obtainable.** `wc -c <path>` yields the first; neither `Bash(cat …)` nor the harness exposes a byte count for the output actually delivered into context, and a model cannot measure its own context. So the mandated numeric comparison **cannot be performed**, and a driver told to perform it will either skip it or assert it — **asserting a completeness check it did not run is this task's own defect class.** ⚠️ **Mitigating and load-bearing:** the step also names an **operable** tell — *"if the harness reported a truncation notice in place of the file's tail, the read stopped short"* (`:180-181`) — which matches real harness behaviour, so the step is **not empty**, it is mis-framed. **Raised by both reviewers** (Codex: Medium, *"R1 remains unresolved"*). **I grade `R1` PARTIALLY resolved, not unresolved:** both of its legs (wrong object measured; `Bash` has its own cap) are now stated explicitly in the text, which was the core. |
| R10 | **2** | medium | `claude/skills/fkit-sprint-ship-loop/SKILL.md:195-198`, and `:188`, `:190`, `:193`, `:232` | **`R3`'s removal clause names 2 of 5 sites that go stale the day `0204` lands.** It says *"deleting it from **both sites above**"* — `:188` (the emitted literal) and `:190` (the instruction to emit it). **Three more go stale and are not named:** `:193` *"nothing checks it until `0204`'s … hook lands, and a reader must never mistake it for a checked one"* — after the hook, that is false **and** the advice inverts; `:195-198` itself, which once executed refers to text that no longer exists; and **`:232`, inside B1** — *"until `0204`'s carry-check hook lands, nothing does"*. **Enumeration raised by Codex, which found five where this pass found four — Codex's `:195-198` self-reference is correct and is adopted.** ⚠️ **The sharpest part: the one uncovered site sits inside the honest-bound paragraph** — the paragraph whose entire job is to stay true, and which both reviewers ruled must not be casually edited. Direction is fail-safe (leftovers *understate* protection), but leaving false statements in an honesty apparatus is precisely this block's own defect class, and `0204` is filed and queued, so this **will** fire. |
| R11 | **2** | medium | `claude/skills/fkit-sprint-ship-loop/SKILL.md:195-198` vs `ai-agents/tasks/backlog/0204-build-the-pretooluse-task-carry-check-hook-and-its-tests/brief.md:70-71` | **`R3`'s removal clause does not yet have the authority it assigns.** It rules the removal is *"`0204`'s to make, not a separate task"*, while `0204/brief.md:70-71` still places *"the SKILL.md rule text (`0203`)"* **explicitly out of scope** and `:92-93` still calls the removal *"a small follow-on … not a separate dependency"*. **The producer amendment that reconciles them is owner-ruled but NOT YET MADE** (confirmed with the driver). Two independent failure paths, both fixed by that one amendment: **(i)** a `0204` implementer following its brief lands the hook and leaves the now-false marker in every future spawn prompt; **(ii)** the instruction lives in a file `0204`'s brief tells its implementer **not to touch**, so it may never be read at all. **Raised by both reviewers.** ⚠️ **Classified as a cross-artifact defect whose fix belongs to the PRODUCER, not to `0203`** — the `SKILL.md` side is the correct half. |

⚠️ **`R1`–`R8` are Round 1 and are all discharged** (see the Round 2 verdict table below and the *Coder
response*). **`R9`–`R11` are Round 2 and are open.** Round 1's `file:line` coordinates are pre-edit;
Round 2's are against the current file.

---

## Round 2 — re-verification (2026-08-05)

**⛔ ROUND 1'S BLOCK LIFTS.** All eight Round 1 findings are discharged — six FIXED and verified
firsthand below, two accepted as residuals (AR-1, AR-2). **The Round 1 convergence call — *"ACT, do not
close out"* — is satisfied and withdrawn.**

**Round 2 verdict: ⚠️ Changes requested — 3 defects (3 medium), none blocking.** The three new findings
do **not** re-impose the lifted block: `R10` and `R11` fire only **when `0204` lands**, and `R9` is a
mis-framed check that still carries an operable fallback. **Nothing found this round concerns the
construction's behaviour today.**

**Codex coverage: FULL — not degraded.** `codex exec --sandbox read-only`, **codex-cli 0.145.0**,
**exit 0**, all six attack categories plus three explicit verdicts returned. **FULL on both rounds.**

⚠️ **All Round 1 coordinates are stale and were re-derived from scratch, not carried.** The block moved
`:157-218` → **`:157-236`** (62 → 78 lines); file 371 → **387**; `git diff --numstat` → **`91 / 0`**
(`91 = 13` from `0191` `+ 78` this block), **zero deletions**, so no line present in HEAD was removed or
modified. `## Stop conditions` → **`:321`**.

### Verdict on each of the six fixes — verified, not taken on trust

| R# | Coder's claim | My verdict | Evidence re-derived this turn |
|----|---------------|-----------|-------------------------------|
| **R1** | FIXED qualitatively, no figure pinned | **PARTIALLY FIXED — core carried, remedy incomplete → `R9`** | `:173-176` names `Bash`'s cap and states *"No byte figure is pinned here on purpose"*; `:177-179` replaces the file with *"the bytes `cat` actually returned to you"*. **Both of `R1`'s legs are now in the text.** The no-figure ruling is right — the `0177`/`0190` precedent (`RULES_MAX` 4096 → 4352 falsified three pinned figures) is real and I confirmed the bump in `claude/fkit-claude-init.sh`. **The ~41 KB figure remains mine alone and was not re-measured by anyone** — recorded as a gap, with **no consequence for the artifact**, which deliberately pins no number. |
| **R3** | FIXED both legs | **FIXED as to the literal; INCOMPLETE as to scope and authority → `R10`, `R11`** | Old literal → **0 hits**; new literal → **exactly 2**, `:188` (pointer form) and `:190` (the instruction), **neither in a footnote**. Both re-derived with `/usr/bin/grep`. |
| **R4** | FIXED, verified against two `0202` artifacts | **FIXED ✅** | `:217` reads `2026-08-03`. Re-verified against **both** primaries: `0202/worklog.md:5` *"**Date:** 2026-08-03"* and `0202/review.md:44` *"Round 1 processed 2026-08-03"*. ⚠️ **Codex cleared this date wrongly in Round 1 and now confirms it — a reviewer's own error, corrected in the open.** |
| **R5** | FIXED | **FIXED ✅** | `:199-201` now reads *"**Paste AND pointer — both, never either/or** … — **except step 5's declared degraded form**, which is the only either/or this construction licenses."* The absolute now carries its own signpost. |
| **R6** | FIXED, `fkit-coder.md` untouched | **FIXED ✅ — and its citations check out** | `:209-212` reads *"the spawned coder **must refuse it** — the refusal is mandatory, not discretionary"*. Both supporting citations verified: `fkit-coder.md:64-66` gates on **all** of (a)(b)(c), and this file's own `:153` reads *"a spawned coder **refuses to write source**"*. `claude/agents/fkit-coder.md` is **byte-unchanged**. |
| **R7 / R8** | FIXED in the worklog | **FIXED ✅** | Both corrections are record-level and land where `R7`/`R8` located them. `R8`'s repair is the right one: the uncheckable blob is **left standing and labelled**, not quietly replaced. |

### ⛔ B1 — the honest-bound paragraph is INTACT and UNWEAKENED. Confirmed at word level.

**This was the thing I said must not happen, and it did not.** I diffed `SKILL.md:228-233` against the
original in `plan.md:105-110` word by word with whitespace normalized. **Exactly one substitution, and
nothing else:**

```
follow-up 3   →   `0204`'s carry-check hook
```

Every clause survives verbatim: *"do not rewrite this into a guarantee"* · *"that is the whole of the
gain"* · *"It does **not** make the paste a mechanical copy: you still emit those bytes token by
token"* · *"**This construction narrows the hazard; it does not remove it**"*. **No bound softened, no
admission dropped, no hedge added.** `:226`'s *"True by construction, or forbidden."* still sits
immediately above it, so the ordering that makes the block honest is unchanged. **Codex reached the same
verdict independently** (*"UNWEAKENED … No bound or admission was softened"*).

### R5 + R6 — NO new contradiction. Both reviewers agree.

R5 softens an absolute (adds an exception); R6 hardens a modal (refusal now mandatory). **They pull
opposite ways and still compose correctly**, because they govern different acts: step 4 licenses the
driver to **send** a declared pointer-only spawn; step 5 obliges the worker to **refuse** it. Licensed
to send, guaranteed to be refused — that is the honest failure path, and `:212-213` says so
(*"That is the correct outcome, and it is why this is the exception and not the routine"*). Codex
concurs: *"a deliberate stop, not contradictory authorization."*

⚠️ **One second-order effect, reported and deliberately NOT raised as a finding.** R6's hardening makes
step 5 a **guaranteed dead end** — where *"entitled to refuse"* left the outcome open, *"must refuse"*
means the degraded path yields zero progress. That raises the pressure toward the forbidden middle
(condense-and-certify). **This is AR-2's territory, and it does NOT meet AR-2's re-raise condition** —
which requires either a formulation that is neither A2 nor A3 (I have none) or the degraded form taken
*repeatedly*. **AR-2 counter stays at 1**; this round's pointer-only Process-review spawn is the
instance the coder already logged, and I do not double-count it. **Recorded so the next round can
count, not re-litigated.**

### The `0204` deadlock — the removal clause does NOT resolve it on its own

Answering the question directly: **no.** It resolves it **only once the producer amendment to `0204`'s
brief lands, and that amendment is owner-ruled but not yet made.** Two independent gaps remain until it
does — the forbidding text at `0204/brief.md:70-71`, and the fact that the instruction sits in a file
`0204`'s implementer is told not to open. See `R11`. **The `SKILL.md` half is the correct half; the
producer owns the other half.**

### ⛔ RULING — the brief's verification step 6 literal is SUPERSEDED. Do not "repair" it back.

`brief.md:111-112` requires the literal **`unverified — no hook checks it until follow-up 3 lands`** and
says *"Grep for it. Absent = this task failed."* **That grep now returns 0 hits, and that is CORRECT.**
The owner ruled the change right and the brief's literal superseded (`AskUserQuestion`, 2026-08-05).

**The governing literal is now, and only:**

> **`unverified — no hook checks it until 0204's carry-check hook lands`**

**I rule the new literal correct and complete.** It carries all three things the old one carried —
*unverified*, *nothing checks it*, *what would change that* — and fixes the one thing the old one broke:
the receiving worker can resolve `0204` (the task is filed at
`ai-agents/tasks/backlog/0204-build-the-pretooluse-task-carry-check-hook-and-its-tests/`), where
*"follow-up 3"* was an ordinal into a report the worker never sees.

⛔ **A later worker or linter that "restores" the old ordinal would be re-introducing the exact defect
`R3` fixed — and would be doing it by citing a superseded brief step, which is the `0218` stale-figure
pattern precisely.** This ruling is recorded here so that never reads as a repair.

### All seven required elements survive — re-verified, not inherited

Re-derived against `brief.md:42-88` at the new coordinates: **1** `:167-176` (byte-exact `cat`, `Read`
excluded, both reasons — now with the `Bash` caveat) · **2** `:177-182` · **3** `:183` · **4**
`:184-203` · **5** `:222` · **6** `:204-213` · **7** `:214-224`. Ten content greps re-run
independently, **every hit intact at Round 1 counts** (`NOT the Read tool` 1 · `cat -n` 1 · `2000 lines`
1 · `wc -c` 2 · `git hash-object` 4 · both governing sentences 1 each · `never a partial paste` 1 ·
`narrows the hazard; it does not remove` 1). The header still reads *"these **six** steps"* and six are
present, in order. **Nothing in the block contradicts `## Hard rules` (`:353+`) or the step table
(`:118-125`)** — checked by both reviewers.

### Two gaps carried forward — owner-accepted, recorded, NOT scored as defects

1. **`prove-red.sh` was NOT re-run** after the Process-review edits. The builder, the coder and I all
   declined on the same ground — it mutates files in a shared dirty tree. It **did** pass at the Verify
   step on this same file (mutations 1–14 red, mutation 9 not a no-op), and the later edits are
   body-only prose that no test reads. `node --test 'test/*.test.js'` → **567 / 567 / 0** before and
   after, **which is a regression check only.** The `npm test` pair is **incomplete and stated as such.**
2. **The `Bash` truncation cap was never re-measured** by anyone but me (~41 KB, observed firsthand in
   Round 1). **No consequence for the artifact** — the shipped text deliberately pins no figure, which
   is the correct response to an unmeasured moving constant.

### Convergence call — CONVERGED. Recommend closeout after disposition; a round 3 is not warranted.

**Round 1: 7 defects + 1 frontier. Round 2: 3 defects, 0 frontier, 0 re-litigation.** Every Round 2
finding is **novel** — none re-opens AR-1 or AR-2, and the one adjacent observation (R6's incentive
effect) is explicitly suppressed above against AR-2's stated re-raise condition rather than smuggled in
as new.

**This is genuine downward convergence, not a loop.** The remaining three are one edit each, two of them
concern a task that has not been built yet, and **a round 3 would be re-reviewing one-line edits** —
below ADR-034's work-product bar. Both reviewers converged independently on all three, and on all three
verdicts (B1 unweakened · R5+R6 no conflict · R3 incomplete), which is the strongest agreement either
round has produced.

**⚠️ No regression risk in any recommended direction, and one explicit warning that carries forward:**
`R10`'s uncovered site is **inside B1**. Whoever discharges it must delete the stale clause **without
touching the rest of that paragraph** — the same warning both reviewers gave in Round 1, now with a
concrete edit attached to it.

---

## Judged as asked — the four questions put to this review

**1. Does the construction PREVENT the failure, or merely make it DETECTABLE?** — **Both, on different
routes. It prevents two of three and only detects the third.** Route by route:

| Route | Step | Preventive or evidentiary? |
|---|---|---|
| **Recall over conversation state** (`0162` round 1) | Step 1 — `cat` puts the file's bytes in context this turn | **PREVENTED.** The route is closed outright. |
| **Silent truncation at read** (`Read`'s 2000-line cap) | Steps 1–2 | **PREVENTED in intent, INCOMPLETE as written** — see `R1`: `Bash` has its own cap and step 2 states no comparand. |
| **Emission-fidelity divergence** (paste condensed while certifying) | Steps 3, 6 | **DETECTABLE ONLY — and only in the READER's hands, downstream.** See `R2`. |

**On this run the construction was executed twice, once each way, and both outcomes are consistent with
that table.** It failed on the driver's side (condensed paste — the un-guarded emission step) and
succeeded on the Build worker's side (`awk`-extract → `awk`-insert → `cmp`, a genuinely mechanical copy
with no model in the byte path — `worklog.md:42-44`). **The text as written would NOT have prevented the
driver's failure. It made it detectable, and detection worked.** That is a real gain over the status quo
ante — which had no construction at all and produced two undetected failures — but it is a smaller gain
than `:210`'s *"True by construction, or forbidden."* implies on its own.

**2. Step 5's A1 bound — operable, or does it relocate the judgment?** — **It relocates it, deliberately
and correctly, and the residual weakness is real.** *"Cannot carry the plan whole"* is a permission
boundary, not a decision procedure: it tells a driver what it **may** do, never how to know it is in the
exception, and a model has no reliable introspection on its own output limits. The wording does
everything prose can: it prices the exception (state the `wc -c` count **and** the reason), forbids the
middle absolutely (`:192-194` — *"not with a declaration, not with an ellipsis, not 'omitting rationale
only'"*), and warns the spawn fails (b). **But the incentive gradient still points at the forbidden
middle:** the driver on this run, facing a 17,991-byte plan, took neither the whole paste **nor** step 5
— it condensed and certified. **This is the owner-ruled frontier point, not a defect** (A2's byte
threshold and A3's driver-judgment form were both rejected on 2026-08-05, and A3 was rejected *for*
being self-authorizing). Codex raised it as Medium; it is **suppressed as settled** below and
**recommended as an accepted residual** — see OQ-2.

**3. ⛔ The B1 honest-bound paragraph (`:212-217`) — honest, or does it undercut the rule?** — **Honest,
load-bearing, and it does NOT undercut the rule. It is the most accurate paragraph in the insertion, and
this run validated it within hours.** Three reasons, each checked:
- **It grants no permission.** It denies a *guarantee*; it licenses no exception. Every imperative in
  steps 1–6 survives it word for word. **A driver cannot cite it to excuse non-compliance** — there is
  no "so you may…" clause to cite. Codex reached the same conclusion independently (*"does not expressly
  waive steps 1–6"*).
- **It is factually right, and `R2` is the proof.** *"you still emit those bytes token by token"* and
  *"Step 4's pointer is what would let anyone notice a divergence — and until follow-up 3 lands, nothing
  does"* describe **exactly** the 2026-08-05 failure and **exactly** how it was caught.
- **It is what keeps `:210` from being a false claim.** Without it, *"True by construction, or
  forbidden."* would be the strongest and last word — and would be wrong. **Removing or softening this
  paragraph would convert a correct document into an overstated one.** The owner's B1 ruling is upheld
  without reservation.

**4. Element 4's "paste AND pointer, never either/or" vs element 6's degraded form — contradiction, and
is precedence clear?** — **No logical contradiction; the precedence is clear reading in order and unclear
reading step 4 alone.** See `R5` (low, four-word fix). Step 5's *"If — and only if —"*, its
self-labelling as the exception, and step 2's forward-reference all establish precedence — **from step
5's side only.** Step 4's bolded absolute carries no signpost of its own.

**5. The `unverified` marker's references (`0204`, "follow-up 3") — resolvable?** — **`0204` is
resolvable today; "follow-up 3" is not from this file, and neither reaches the worker.**
`ai-agents/tasks/backlog/0204-build-the-pretooluse-task-carry-check-hook-and-its-tests/brief.md` **exists
and is filed** — *not yet built* is not *not yet resolvable*, so a reader of `SKILL.md:184` can resolve
`0204` fine. *"Follow-up 3"* is an ordinal into `0162`'s report §10, which this insertion cites only as
*"§2/§4"* (`:158-159`) — unresolvable from this file. **The sharper problem is `R3`**: the emitted string
carries the ordinal and not the task id, so the reader who most needs it — the spawned worker — gets the
one form that resolves to nothing.

---

## Verified as CORRECT — recorded so the coder does not re-chase them

- **All 7 required brief elements are present**, re-derived independently this turn against
  `brief.md:42-88`: element 1 `:167-172` (byte-exact `cat`, `Read` excluded, **both** stated reasons);
  2 `:173-175`; 3 `:176`; 4 `:177-189`; 5 `:206`; 6 `:190-197`; 7 `:198-203` + `:208`.
- **The `unverified` marker is in the rule text at exactly 2 hits** — `:181` (the literal pointer form)
  and `:183` (the instruction to emit it) — **neither in a footnote**. `/usr/bin/grep -n` confirms.
  `:216`'s *"until follow-up 3 lands"* is a different phrase in the B1 paragraph, not a third hit.
- **A1 shipped and A2/A3 are provably absent** — the only size figure in `:157-218` is the **2000-line**
  `Read` cap, which is element 1's *required* reason. No invented byte threshold, no driver-judgment
  form.
- **Both of element 1's technical reasons are factually correct, verified firsthand this turn.** `Read`
  returns `cat -n` framing (every `Read` result in this review came back line-number + tab prefixed) and
  caps at 2000 lines by default. `git hash-object` works on untracked files — I ran it on the untracked
  `plan.md`. ✅
- **`:187`'s *"the paste … is what satisfies condition (b) of the marker as written"* is CORRECT and does
  NOT overstate.** Checked against `0162`'s `R1` (which punished exactly this family of overstatement in
  the report): the sentence attributes (b)-satisfaction to the **paste**, contrasted against the pointer
  as the checkability leg. It makes no claim that anything verifies **approval**. No finding.
- **Zero deletions across the whole file**, so no existing line was edited — `git diff --numstat` →
  `75 0`. Diff arithmetic **75 = 62 (this build) + 13 (`0191`)** re-derived independently.
- **`plan.md` untouched** — `cba052cdf18244f1dbe657402b2b15e40edfc7be`, re-derived this turn. ✅
- **`## Stop conditions` is at `:305`** — confirmed. The worklog's ⚠️ that **`0208` should take 305, not
  the plan's 299** (`worklog.md:55-56`) is **correct and worth carrying forward**.
- **Scope discipline CLEAN.** Every other modification under `claude/` is **`0190`'s**, verified by
  reading each diff: `claude/scaffold/universal-rules.md`, `CLAUDE.md` and `AGENTS.md` all carry the
  identical ADR-037 worker-side precedence clause, and `claude/fkit-claude-init.sh` carries the
  `RULES_MAX 4096 → 4352` bump explicitly labelled *"owner ruling, task 0190, 2026-08-04"*. **None is
  `0203`'s.** `claude/agents/fkit-coder.md`, every hook, the §2 Build row, the §5.4 exit-table region,
  `ai-agents/wiki-vault/` and every test are **byte-unchanged**. No commit, no push.
- **Suite independently re-run this turn** — `node --test 'test/*.test.js'` → **tests 567 / pass 567 /
  fail 0 / suites 17**. Matches the worklog exactly.
- **The worklog's own ⚠️ at `:96-99` is correct and important**: `test/skill-frontmatter.test.js`
  discards the body at `splitFrontmatter`, **no test in `test/` reads this file's body**, so the green
  suite is a **regression check only** and never evidence the amendment landed. Correctly refused to
  propose a text-presence test, per the brief's exclusion.
- **The Build worker's decision-log entry 2** — proceeding on the `cat`-read bytes rather than returning
  `BLOCKED` — is **the right call, and correctly recorded**. The `BLOCKED` trigger was narrow (*"if hash
  or byte count disagrees"*) and neither did; the authoritative bytes were in context; the hazard
  condition (b) exists to prevent was fully removed. Surfacing it loudly rather than blocking is what
  ADR-032 A2's decision log is for.

## Recorded as unverified — not defects, and not to be read as passes

- **`prove-red` "PASSED **before**" (`worklog.md:93`) is NOT reproduced.** I did not re-run
  `test/prove-red.sh`: it mutates files in place, and this working tree is shared and dirty across a
  dozen tasks — running it here risks a far worse problem than it settles. The **"after"** half is
  independently plausible (mutation 9 targets this file's frontmatter continuation, which the insertion
  does not touch), but **neither half is verified by this review.** Stated, not waved through.
- **Brief verification step 7** (`brief.md:113-114`) — *"`git status` and `git diff --stat` show nothing
  else"* — **is literally false** in this shared tree (12 modified files, 20+ untracked). The step's
  **intent** passes: I attributed every other `claude/` change to `0190` above. **Brief-side wording
  defect, not fixable by `0203`** — the brief is a producer artifact and the task has shipped. Filed
  here so it is not silently graded ✅.

---

## Re-litigates settled decisions (suppressed)

- **Step 5's capability bound is self-authorizing** — *Codex, Medium, `SKILL.md:190-197`*: *"a lazy
  driver cites context pressure for every long plan, supplies the required count/reason, and makes
  pointer-only the routine path."* **Suppressed as settled by the owner's OQ-1 ruling, 2026-08-05
  (A1).** A2 (invented byte threshold) and A3 (driver's judgment) were both **rejected**, and A3 was
  rejected *precisely for* being self-authorizing (`0203/plan.md:212`). Codex's finding is **substantively
  correct** — see judgment 2 above — but no re-wording is available that the owner has not already
  refused. **Not dropped: recommended for the *Accepted residuals* section instead** (OQ-2 below), which
  is where a correct-but-settled tradeoff belongs.
- **Nothing else was suppressed.** Codex was primed with `carried-not-approved` (`0162` ledger), the
  trust-not-proof marker (ADR-037 `:365-367`), and the prose-enforced plan gate, and **respected all
  three** — it raised no finding against any of them. `R2` sits **near** the ADR-037 fence but does not
  trip it: it does not re-flag that the marker is forgeable or that the rule is unenforced prose; it
  reports that the construction's own checks target **presence and provenance** rather than **fidelity**,
  evidenced by a live instance from this run. That is a coverage claim about new text, not a re-raise.

## Convergence call

**ACT — do not close out. Round 1 on a fresh ledger; all 8 findings are novel and none re-litigates a
residual** (the ledger has none, and the single settled item is visibly suppressed above rather than
recorded as a finding).

**Both reviewers converged independently on R2, R5 and R6** — and R2 is the one they converged on
hardest, from different directions. That is the strongest signal in the set and it points at the same
place: **the fidelity leg is the gap.**

**Nothing blocks.** This is documentation; no behavior regresses; the file is strictly better than the
status quo ante, which had **no** construction and produced two undetected failures. The load-bearing
design call — *a faithful carry is a copy over a durable artifact, executed in the spawning turn* — is
**sound and this run's evidence supports it**. The defects are in the *record* and the *edges*, not the
*decision*.

**Cost profile:** `R4`, `R5`, `R6` are one-line edits inside the shipped block. `R3` is one clause at one
site (plus a `0204`-side or newly-filed follow-up for the removal). `R1` is one added comparand sentence.
`R7`/`R8` are worklog corrections. `R2` needs no edit at all if the owner records it as a residual.

**⚠️ No regression risk identified in any recommended direction.** I specifically checked the shape that
bit `0202` — where the obvious fix recreates the defect under review — and none of R1–R8 has it. In
particular, **do not "fix" `R2` by weakening `:212-217`**: that paragraph is what makes the document
honest (judgment 3).

---

## Coder response

*Round 1 processed 2026-08-05 by the sprint-loop **Process-review** worker (spawned `@fkit-coder`) under
the declared-approval marker. **All dispositions below were ruled by the owner via `AskUserQuestion` in
the live driver session and relayed with the spawn — none was chosen by me.** Full reasoning, the decision
log and the verification evidence are in `worklog.md` under `# Process-review — round 1`.*

⛔ **How this spawn arrived, recorded because it is the rule's own first live test.** The plan was carried
**pointer-only** — the step 5 degraded form — and the driver **declared** it rather than certifying a
paste it could not reproduce. That fails condition (b), so **I refused and returned `NEEDS-DECISION`
instead of editing.** The owner then issued a **one-time waiver** (2026-08-05) and I proceeded on the
`cat`-read bytes, pointer verified on all three legs (`cba052cd…`, 17,991 B, 228 lines). ⚠️ **The
waiver's cost is on the record:** it sets a precedent for waiving pointer-only spawns three days after A3
was rejected for being self-authorizing. **The standing rule is unchanged — the paste remains required.**
Read together with the process-defect table above, the construction has now been exercised three ways on
this one task: **falsely certified** (Build), **honestly degraded** (this spawn), **and refused** — and
only the third is the behaviour the rule prescribes.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** — confirmed firsthand | Defect (medium) | Step 1 gains a ⚠️ naming **`Bash`'s own truncation cap**; step 2 now compares `wc -c <path>` against **the bytes `cat` actually returned**, naming the truncation notice as the tell. ⛔ **No byte figure pinned** — owner accepted my refinement that a live-measured constant in durable prose re-creates task `0218`'s defect (`0177`'s three pinned figures went false when `0190` moved `RULES_MAX` 4096 → 4352). ⚠️ **I did not re-measure the cap; the 41.4 KB figure is the reviewer's.** R1's core needs no measurement: `wc -c <path>` measures the file, which is identical either way, so it cannot detect a short read. | **FIXED** |
| R2 | **CORRECT** — and the headline judgment of this review | **Frontier-move (medium)** | **Accepted as a residual, no edit.** The checks test presence and provenance, not fidelity, and this run's failure passes all of them. B1 already discloses it precisely. ⛔ **B1 was NOT weakened to "fix" this** — both reviewers warned against it and I agree. A **fidelity-leg follow-up is owner-authorized**; **I did not file it** — noted for the producer. | **ACCEPTED RESIDUAL** |
| R3 | **CORRECT, both legs** — verified in `0204`'s brief | Defect (medium) | Emitted literal now names the task: `unverified — no hook checks it until 0204's carry-check hook lands`. Added a ⛔ clause: **`0204` removes the marker, in the same change that lands the hook.** ⚠️ **This changes the mandated literal** — see the marker-count note below. Owner accepted my finding that the clause would otherwise mandate what `0204/brief.md:70-71` forbids while `:92-93` assumes; **a producer will amend that brief** — I did not touch it. | **FIXED** |
| R4 | **CORRECT — and Codex is wrong** | Defect (low) | `2026-08-02` → **`2026-08-03`**. Verified independently as instructed: `0202/worklog.md:5` *"Date: 2026-08-03"* and `0202/review.md` *"Round 1 processed 2026-08-03"*. **Codex explicitly cleared dates and was mistaken.** | **FIXED** |
| R5 | **CORRECT** | Defect (low) | Step 4's absolute now reads *"— **except step 5's declared degraded form**, which is the only either/or this construction licenses."* Severity dissent noted; the fix is identical either way, so the dissent did not need settling. | **FIXED** |
| R6 | **CORRECT** | Defect (low) | *"entitled to refuse it"* → *"**must refuse it** — the refusal is mandatory, not discretionary"*, citing the (a)(b)(c) gate and this file's own rule 43 lines above. ⛔ **`claude/agents/fkit-coder.md` untouched** — root cause is `0163`, out of scope by owner ruling. ⚠️ **This finding governed my own conduct this round:** the corrected modal is why refusing was mandatory rather than optional. | **FIXED** |
| R7 | **CORRECT** | Defect (low) | Worklog corrected: the 13 pre-existing lines are **`0191`'s alone**. Re-verified `git show HEAD:…SKILL.md \| wc -l` → **296**, so `0202` is committed and contributes 0. Arithmetic unaffected. | **FIXED** |
| R8 | **CORRECT** | Defect (low) | Worklog now records that `cce59c1d…` is **permanently uncheckable** (`git hash-object` without `-w` stores nothing; `git cat-file -t` → *"could not get object info"*, re-confirmed) — **and that the claim survives independent reconstruction while its proof does not.** Left standing as evidence of the very hazard the `unverified` marker names, not quietly repaired. | **FIXED** |
| — | **CORRECT but settled** | Frontier (Codex, medium) | Step 5's capability bound is self-authorizing. **Recorded as an accepted residual with a re-raise condition** so it is not re-raised every round. | **ACCEPTED RESIDUAL** |

**⚠️ Marker count — changed on purpose, flagged loudly.** The `unverified` marker still appears **exactly
2 times** in the rule text (`:188` literal pointer form, `:190` the instruction to emit it), neither in a
footnote. **But the literal itself changed**, so a grep for the old string
`unverified — no hook checks it until follow-up 3 lands` now returns **0** — including the brief's
verification step 6. This was unavoidable: R3 leg (a) is that the **emitted** string carries an ordinal
the receiving worker cannot resolve, and the gloss naming `0204` never reaches the spawn prompt, so
resolvability required changing the emitted text.

**⚠️ `SKILL.md` is now deliberately OUT OF SYNC with `plan.md` §2**, which mandates that block verbatim.
R1/R3/R4/R5/R6 all edit mandated text; **the owner approved the divergence explicitly.** `plan.md` was
**not** re-authored — still `cba052cdf18244f1dbe657402b2b15e40edfc7be` after all edits.

**Verification after the edits:** all seven required elements survive (ten content greps, all hits
intact); **B1's honest-bound paragraph is intact and unweakened** — its only change is an ordinal → task
id, no caveat or bound touched; `git diff --numstat` → **`91 0`**, zero deletions, `91 = 13` (`0191`) `+
78` (this block, 62 → 78); `node --test 'test/*.test.js'` → **567 pass / 0 fail**, before and after,
⚠️ **a regression check only — no test reads this file's body.** ⚠️ **`prove-red.sh` was NOT run** (mutates
a shared dirty tree; the reviewer declined for the same reason), so the `npm test` pair is incomplete.
No commit, no push, no brief filed, nothing under `ai-agents/wiki-vault/`.

---

### Round 2 — processed 2026-08-05

*Round 1's block **lifted**; **B1 confirmed intact at word level** (one substitution, `follow-up 3` →
`` `0204`'s carry-check hook ``; Codex independently: **"UNWEAKENED"**); **converged, no round 3**.
Round 2 raised 3 medium findings, none blocking — two mine, one the producer's. **All dispositions
owner-ruled via `AskUserQuestion` in the live driver session; none chosen by me.** Full reasoning in
`worklog.md` under `# Process-review — round 2`.*

⚠️ **`R4` vindicated:** Codex cleared the wrong date in round 1 and confirmed in round 2 that the fix was
right. The concrete case for *review notes are inputs to evaluate, not orders* — deferring to it would
have shipped a wrong date.

| #  | Verdict | Class | Action | Status |
|----|---------|-------|--------|--------|
| R9 | **CORRECT** — and I accept the *partially resolved* grading of `R1` | Defect (med) | Step 2 now **leads with the truncation notice** — *"if it said it truncated, the read failed — stop there and take step 5"* — and states outright that the byte count of what `cat` returned **is not exposed**, so *"compare the two figures"* is not an operation a driver can perform *"and a step demanding it would be theatre"*. `wc -c <path>` demoted to the **corroborating** figure the pointer and step 5 want, explicitly **not** the guard. **`R1`'s core is preserved:** round 1 fixed *which object* was measured; round 2 makes the check performable. ⚠️ The reviewer's point that asserting an unrun completeness check **is this task's own defect class** is exactly right, and is why the wording now forbids hunting for a second number rather than merely softening the demand. | **FIXED** |
| R10 | **CORRECT** | Defect (med) | Removal clause now enumerates **all FIVE** stale sites, prefaced by the reason: **`0204` may never open this file.** **Codex's five beat the reviewer's four — I re-derived the set myself rather than copying the count, and independently reached the same five**, including the `:195-198` self-reference. Three considered-and-excluded candidates are recorded with reasons in the worklog so the count is auditable, not asserted. ⛔ **Site 4 is inside B1**, and the clause carries the explicit instruction: *delete THAT CLAUSE ONLY; leave every other byte of that paragraph untouched*, with the reason it is protected. | **FIXED** |
| R11 | **CORRECT** | Defect (med) | ⛔ **NOT MINE — the producer's, and now IN FLIGHT.** I did not amend `0204`'s brief. Verified this turn that its working-tree modification is that parallel producer edit and **not** mine: it adds the owner-ruled ✅ carve-out permitting the marker removal, a B1 protected-site warning, and an instruction to re-read the live file because *"a separate task is concurrently editing this same clause"* — this task. **The reviewer's two failure paths are both closed, and the two ends now meet.** | **PRODUCER, IN FLIGHT** |

⛔ **Durable record of the reviewer's ruling — the brief's step-6 grep returning 0 hits is CORRECT.**
Restoring the old ordinal *"would re-introduce the defect `R3` fixed while citing a superseded brief step
— the `0218` pattern exactly."* **The brief step is stale; the file is right.** No action, by ruling.

⛔ **B1 not touched this round — proved, not asserted.** `R10`'s site 4 sits inside it, but discharging
`R10` required editing the *removal clause*, not B1, so no `NEEDS-DECISION` was needed. `md5` over the
extracted paragraph is **`4da746ddbc042a497dfe3552d3e8eb7a`**, identical before and after. Its ragged
wrap was left alone deliberately: tidying a protected paragraph is an unrequested edit, and
`narrows the hazard; it does not remove` must stay on one line for the verification grep. **Ugly beats
touched.**

**Verification:** ten content greps all pass; marker still **exactly 2**, now at **`:192`/`:194`**, neither
in a footnote; all seven elements survive; `git diff --numstat` → **`105 0`**, zero deletions, **401
lines** (`105 = 13` `0191` `+ 92` this block, 62 → 78 → 92); `node --test 'test/*.test.js'` → **567 pass /
0 fail** before and after — ⚠️ **regression check only**, no test reads this file's body;
⚠️ **`prove-red.sh` NOT run** (owner-accepted, shared dirty tree), so the `npm test` pair stays
**incomplete**; `plan.md` → `cba052cdf18244f1dbe657402b2b15e40edfc7be`, untouched.
⚠️ **`## Stop conditions` has moved a fourth time — `243 → 305 → 321 → 335`. `0208` should take `335`**,
and should re-derive from surrounding text regardless, precisely because this coordinate keeps moving.
No commit, no push, no brief filed, nothing under `ai-agents/wiki-vault/`.

---

## Accepted residuals (shared, do-not-re-litigate)

**Two added in round 1, both on the owner's explicit disposition (2026-08-05).**

### AR-1 — The construction tests presence and provenance, never fidelity (from `R2`)

Steps 3 and 6 and both governing sentences check that the paste is **there** and that its bytes were
**read from the file that turn**. None checks that the pasted bytes **match** the file. The 2026-08-05
Build carry satisfied every one of them and was still a ~60% condensation. **The construction prevents
the recall route outright, is incomplete on the truncation route (now repaired by `R1`), and is
detect-only on the emission-fidelity route.**

- **Disposition:** accepted as a residual. **No edit** — B1, the paragraph opening *"The honest bound on
  'true by construction'"* (`SKILL.md:228-233` after this round's edits; the reviewer cited `:212-217`
  pre-edit), already states this precisely, and both reviewers warned that "fixing" it by softening B1
  would convert a correct document into an overstated one.
- **Re-raise only if:** a *new* mechanism is proposed that closes the fidelity leg, or evidence appears
  that B1 no longer describes the shipped behaviour. **Do not re-raise as a defect** — it is disclosed.
- **Owner-authorized follow-up (not yet filed, producer's to file):** add a fidelity leg that re-derives
  `git hash-object` over the **pasted block**, not merely the file.

### AR-2 — Step 5's capability bound is self-authorizing (Codex, medium)

*"A lazy driver cites context pressure for every long plan, supplies the required count/reason, and makes
pointer-only the routine path."* **Substantively correct** — and this very round is an instance: the
driver took the degraded form on a 17,991-byte plan.

- **Disposition:** accepted as a residual. **Settled, not unrecognised.** The owner ruled OQ-1 → A1 on
  2026-08-05 and rejected **A2** (invented byte threshold) and **A3** (driver's judgment) — **A3
  precisely for the self-authorizing property Codex names.** No re-wording is available that the owner
  has not already refused.
- **Re-raise only if:** a *non-self-authorizing, non-threshold* formulation is proposed — i.e. something
  neither A2 nor A3 — **or** if the degraded form is taken repeatedly enough to show the exception has
  become the routine. ⚠️ **Counter this round: 1** (this spawn, owner-waived and declared).
- **Related and open:** the owner has logged, as a candidate for `0204`'s ADR, amending condition (b) to
  accept a pointer-only carry **when the worker re-derives the blob itself** — which would reshape this
  residual rather than settle it. **Not decided.**
