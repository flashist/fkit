# Review — 0130

Task: `ai-agents/tasks/done/0130-reclaim-rules-block-budget-headroom/brief.md`
File(s) under review: `claude/fkit-claude-init.sh`, `claude/scaffold/universal-rules.md`,
`test/rules-block-budget.test.js`, and the machine-regenerated `CLAUDE.md` / `AGENTS.md` blocks.
Scope: uncommitted working tree. Excluded (driver's status flip, not this change):
`ai-agents/sprints/sprint-2.md`, the task `brief.md`.
Status: **closed-out** (2026-08-01, owner-dispositioned — see *Close-out* at the foot of this file)

**Final verdict: ✅ Ready to merge.** All three Round-1 findings dispositioned by the owner; no open
confirmed defect. One accepted residual recorded (R2's second half, refused by the coder and the
refusal accepted by the owner) and one carried-forward residual (the unmeasured codex half of the
comment-stripping canary, followed up in brief `0177`). Task closed
**✅ Done (agent-closed — not owner-verified)**. **Round 1 Codex coverage was FULL, not degraded.**

**Verdict (Round 1): ⚠️ Changes requested — 3 defects (none blocking).**
Reviewers run: fkit-reviewer (own pass) **and** Codex (`codex-cli 0.145.0`) — **full two-reviewer
coverage, not degraded**. All three findings were raised **independently by both reviewers**.
Codex's own test execution was blocked by sandbox `EPERM` on `mktemp`; the reviewer ran the full
suites outside the sandbox instead — `node --test test/*.test.js` **523 pass / 0 fail**,
`bash test/prove-red.sh` **hard gate PASSED**. Test coverage is therefore complete.

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1     | medium | `claude/scaffold/universal-rules.md:37` | `"the one or two things they should do next"` → `"the one or two things to do next"` drops the **owner actor** (`they`) and the **modality** (`should`) for 9 B; recorded in the worklog as "wording", but under the governing R4/0022 rule it is a qualifier drop, i.e. a regression — and it is not one of the two clause drops the owner approved. |
| R2 | 1     | low | `test/rules-block-budget.test.js:14`, `:56-57` | The header comment the change edited still asserts stale structure and bytes: a **"five-line" explanatory comment** (now four), **"seven `printf` lines"** (now six), and **"the 443 bytes those printfs actually emit"** (now 354 B of comment / 404 B with markers). |
| R3 | 1     | low | `claude/fkit-claude-init.sh:355` | The over-budget error still asserts un-hedged that the block "is injected into every agent's context on every turn", which the new comment at `:327-331` now contradicts for the wrapper; that new hedge quotes `"lands in every agent's context on every turn"` — wording that **no longer exists anywhere in the file** — so it does not actually aim at the surviving claim at `:355`. |

### R1 — detail

`HEAD` reads *"the one or two things **they should** do next, and why"*; the working tree reads
*"the one or two things **to** do next, and why"*. The actor is now unstated. It remains inferable
from the clause's opening (*"End every reply **to the owner**"*), which is why this is medium and not
high — but it is inference where the rule previously **stated** it.

Why the prose is load-bearing here rather than decorative:
[[ai-agents/knowledge-base/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md]] §2(B)
and §4 make the `Stop` hook a **presence check only** — `claude/turn-completion-hook.sh:111` greps
for the literal string `What's next?` and *"never judges whether a next step was 'real'"*. ADR-030 §4
records explicitly that the owner's intent is *"carried by **prose**, not by the hook … a deliberate,
named gap."* The prose is the sole carrier of who the next steps are for; weakening it has no backstop.

**Not a hidden drop — a contested classification.** The coder's own reflow-independent word diff
(`worklog.md:54-63`) **did** surface this change and listed it. The dispute is row 62's label
("wording") versus this finding's ("qualifier/actor drop"). The coder's disclosure was complete and
its evidence table is accurate; only the judgment call is contested.

**Cost to restore: 9 B.** Headroom would fall 535 B → 526 B, still comfortably above the owner's
standing ≥ 400 B target. No tradeoff is being reopened.

## Coder response

<!-- CODER-OWNED — the reviewer does not write this section. -->

Round 1 processed by `fkit-coder` spawned as the **Process-review worker** of
`/fkit-sprint-ship-loop`, 2026-08-01, under the loop's declared-approval marker. Every claim below was
re-verified against the working tree first-hand; nothing was taken on the reviewer's word.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | **Defect** (regression) | Restored *"they should"* at `universal-rules.md:37`; +9 B, reflowed 2 lines, nothing else touched | **Fixed** |
| R2 | **PARTIALLY CORRECT** | **Defect** (part) — the rest is **not a defect** | Fixed the stale *present-tense* claim (`:14` "five-line" → "four-line"). **Did NOT** renumber the historical `:56-57` figures — dated them instead, with the arithmetic reason recorded in the file | **Fixed (valid part); the renumber is refused, with evidence** |
| R3 | **CORRECT** | **Defect** | Re-quoted the `:327` hedge at the wording that actually survives (*"injected into…"*), so it aims at `:355` | **Fixed** |
| C1 | *(coder-found, this round)* | **Defect** (introduced by R1's fix) | `fkit-claude-init.sh:323` said *"Currently 535 B free"*, which R1's +9 B made stale on the spot. Corrected to 526 B **and** relabelled a snapshot that the test measures live | **Fixed** |

### R1 — accepted, and it is in-plan rather than a widening of it

Verified: `HEAD` reads *"the one or two things **they should** do next"*; the working tree read
*"the one or two things to do next"*. Actor and modality both gone.

The finding is right that the prose is the sole carrier. Confirmed first-hand, not from the ADR text
alone: `claude/turn-completion-hook.sh` checks presence only —
`case "$payload" in *"What's next?"*)` — and ADR-030 §4 records the gap deliberately
(*"carried by prose, not by the hook … a deliberate, named gap"*). Nothing downstream re-states who
the next steps are for.

**Why this was fixed autonomously rather than returned as a judgment call.** The approved plan
classifies C4 as *"reflow/wording only, nothing dropped"*, and its step 4 states the rule: a clause
present before and absent after is **a regression, not a compression — revert it**. `they should` was
present before and absent after. Restoring it is *executing* the approved plan, not exceeding it.
Cost 9 B; headroom 535 → **526 B**, still 126 B above the owner's ≥ 400 B standing target.

### R2 — half correct, and the other half would have introduced an error

Two distinct claims sit under this finding, and they do not share a fate.

**Correct — `:14` is a present-tense structural claim, now false.** *"`emit_block()` wraps the source
in two markers plus a **five-line** explanatory comment"*. Measured: the emitted wrapper comment is
now **4 lines** (`printf` lines 341-344). Fixed to "four-line", with a note that the test measures
rather than trusts the number.

**Not correct — `:56-57` is a dated account of a past bug, not a claim about today.** The reviewer
asks that *"the 443 bytes those printfs actually emit"* be restated as 354 B / 404 B. Applying that
would make the passage **wrong**, not right:

- The passage narrates the *old* JavaScript reimplementation: *"It **used to** reproduce the function
  in JavaScript, and the reproduction **was** wrong by 107 B in two independent ways."*
- Its numbers are one coherent arithmetic chain: 568 B (the JS source text) − 443 B (what those
  printfs then emitted) = the **125 B** divergence; less the **18 B** UTF-16/UTF-8 gap (2521 vs 2539)
  = exactly the **107 B** net error the paragraph claims.
- Substituting today's 354 B breaks that chain — 568 − 354 = 214, and the stated 107 B no longer
  follows from anything. The 568 B figure belongs to the seven-printf era and cannot be compared to a
  six-printf wrapper.

Both historical figures were verified rather than assumed: `emit_block()` at `0ad055a`, `ee792e5` and
`HEAD` all carry **7** `printf` lines and emit **493 B** of wrapper = 50 B markers + **443 B** comment.
So 443 B and "seven" were accurate when written **and remained accurate right up to this change**.

**The reviewer's underlying concern is still real, and was fixed.** The phrasing reads present-tense
(*"the seven printf lines"*, *"actually emit"*), so a reader today checks, finds 6 and 354 B, and
distrusts the passage — exactly the stale-header failure this file exists to warn about. Fixed by
**dating** the figures and stating why they are held at the old values, which removes the false
present-tense reading while keeping the arithmetic true.

### R3 — accepted

Verified by grep: `"lands in every agent's context on every turn"` occurs **exactly once** in the
repo — inside the `:327` hedge itself. It was the wording of the old `RULES_MAX` trailing comment,
which **this very change deleted**, so the hedge was quoting a string it had removed. The surviving
un-hedged claim is `:355` (*"It is injected into every agent's context on every turn"*). The parallel
hedge in `test/rules-block-budget.test.js:22` already quoted correctly; only the shell side was wrong.
Fixed by quoting the surviving wording and naming its site. Comment-only — measured to cost the
emitted block **0 B** (wrapper unchanged at 404 B across the edit).

### Re-verification after these fixes

| | before this round | after |
|---|---|---|
| emitted block | 3561 B | **3570 B** |
| ├ source | 3157 B | 3166 B |
| └ wrapper | 404 B | 404 B (unchanged) |
| headroom (`RULES_MAX=4096`) | 535 B | **526 B** — ≥ 400 B target **MET**, 126 B spare |
| pct of cap (as the test rounds it) | 87% | **87%** |
| distance to the 92% gate (3789 B) | 228 B | **219 B** |
| net reclaim vs `HEAD` (3717 B) | −156 B | **−147 B** |

- **R4 clause check re-run.** Reflow-independent word diff of `universal-rules.md` vs `HEAD` now
  returns exactly **three** deltas: `in order to be brief`→`to be brief`, the approved **C2** drop, and
  `in a few words.`→`briefly.`. The R1 entry is **gone from the diff**. One clause dropped in the whole
  pass, and it is the one the owner approved.
- **Re-injected, and proven by extraction — not by the markers-only test.** `bash claude/fkit-claude-init.sh .`
  re-ran, then the block was extracted from `CLAUDE.md` and `AGENTS.md` with the same whole-line awk
  matcher the guard uses and `cmp`'d against live `emit_block()` output: **3570 B, byte-identical in
  both**. The R1 restoration is present in both regenerated files.
- **`bash -n` clean**; `printf` untouched, no stray `%` introduced.
- **Suites green after the changes** — `node --test test/*.test.js` → **523 pass / 0 fail**;
  `bash test/prove-red.sh` → **hard gate PASSED** (every mutation reds its named assertion).

## Accepted residuals (shared, do-not-re-litigate)

<!-- Entries are added only once the OWNER approves treating a finding as a settled tradeoff. -->

Both entries below were **ruled by the owner on 2026-08-01** in the live lead session and recorded
here by the reviewer.

- **Historical byte figures in `test/rules-block-budget.test.js:56-57` are held at their old values
  (from R2, second half — coder REFUSED, owner ACCEPTED the refusal).**
  **What:** the passage keeps **443 B** and **"seven `printf` lines"**, and is **dated** rather than
  renumbered to today's 354 B / six lines. Only the present-tense structural claim at `:14`
  ("five-line" → "four-line") was corrected.
  **Why (structural):** that passage is a *dated account of a past 107 B bug*, and its arithmetic only
  closes at the old values — 568 B (the old JS source text) − 443 B = the 125 B divergence, less the
  18 B UTF-16/UTF-8 gap = exactly the **107 B** net error it claims. Renumbering to 354 B breaks the
  chain (568 − 354 = 214) and would make the paragraph **wrong**, not fresher. The coder verified the
  historical figures at three commits — `0ad055a`, `ee792e5`, `HEAD` — rather than assuming them: all
  three carry 7 `printf` lines and emit 493 B of wrapper = 50 B markers + 443 B comment, so the figures
  were accurate when written and stayed accurate right up to this change. The reviewer's real concern —
  that present-tense phrasing invites a reader to check, find 6 / 354 B, and distrust the passage — was
  addressed by **dating** the figures and recording in the file why they are held.
  **Rejected alternative:** restating the figures at today's values (introduces a false claim);
  deleting the passage (loses the bug's institutional memory, which is the file's stated purpose).
  **Re-raise only if:** the paragraph is rewritten to make a claim about the *current* wrapper, or the
  dating that marks the figures as historical is removed.

- **The codex half of the comment-stripping canary is unverified, and the conservative default stands
  (carried forward — not a finding, a known gap).**
  **What:** whether `codex-cli 0.145.0` strips HTML comments from `AGENTS.md` was **never measured**.
  Both rationale comments (`claude/fkit-claude-init.sh:327-331`,
  `test/rules-block-budget.test.js:22-26`) carry the hedge and assume the conservative default that
  codex still pays for the comment bytes. The Claude half **was** re-run first-hand (Claude Code
  2.1.220 does strip them).
  **Why (structural):** assuming the cost is still paid can only over-reserve budget, never
  under-reserve it; the hedge states the gap honestly rather than overstating coverage. Measuring the
  codex side is a separate piece of work, not a fix to this change.
  **Follow-up filed:** `ai-agents/tasks/backlog/0177-verify-the-codex-half-of-the-comment-stripping-canary/`.
  **Re-raise only if:** brief `0177` produces a measurement, or a comment drops the hedge and asserts
  the codex behavior as known.

## Verified-clean (checked this round, no finding — do not re-derive next round)

Recorded so a later round does not spend the budget re-proving these. All figures are **UTF-8 bytes**
(`wc -c`), reproduced by sourcing and running the **real** `emit_block()`, never a reimplementation.

> ⚠️ **Read the byte figures in this section as of the Round-1 review pass — they are PRE-R1-fix.**
> They were measured before the coder restored *"they should"* (+9 B). They are not contradicted by the
> final numbers, they precede them: every figure below shifts by exactly **+9 / −9 / −9**. The
> **final, post-fix** state is 3570 B emitted / **526 B** headroom / **147 B** reclaimed — see
> *Close-out* at the foot of this file. Nothing else in this section changed.

- **Byte accounting — every coder figure independently reproduced.** *(pre-R1-fix)* Emitted block
  **3561 B** = 3157 B source + 404 B wrapper (354 B comment + 50 B markers). Headroom **535 B**
  (≥ 400 B target met with 135 B spare). Utilization **86.94 %**. Prior emitted block measured at
  `HEAD` = **3717 B**, so the pass reclaimed **156 B** — matching the coder's claim, not the planned
  191 B. **Post-R1-fix: 3570 B = 3166 B source + 404 B wrapper; headroom 526 B; reclaim 147 B.**
- **The 92 % warning gate.** `Math.round((size/4096)*100) <= 92` first fails at **3789 B**
  (3788.8 rounds to 93). Margin *(pre-R1-fix)* **228 B**; **post-R1-fix 219 B**. The coder's stated
  trip point is correct and is unaffected by the fix — only the distance to it moved.
- **The reverted C1 over-compression is genuinely reverted.** The full promise
  *"everything outside is yours and fkit never touches it"* is present verbatim at
  `claude/fkit-claude-init.sh:342-343`. The narrowing draft is absent.
- **C1's three load-bearing claims all survive** — block-is-overwritten, put-yours-outside, and the
  code-fence hazard (`claude/fkit-claude-init.sh:341-344`).
- **No THIRD *clause* went missing.** A reflow-independent word diff of the whole source returns
  exactly four prose edits: `in order to be brief`→`to be brief`; the approved C2 drop; the R1 change
  above; `in a few words.`→`briefly.`. Byte deltas sum to exactly 67 B = the observed 3224→3157 source
  change, so nothing is unaccounted for.
- **`"The list is illustrative, not exhaustive."` still present** in the *"Where a shape is prescribed"*
  bullet — only the duplicate in *"Speak in simple terms"* was dropped (approved C2), where the
  meaning survives in the preceding *"and anything else the reader must act on"*.
- **ADR-030 clauses intact** — *"Never invent a next step to fill it"*, *"never assert repo state you
  did not check this turn"*, and the `evidence-before-assertion.md` path reference, all present and
  unbroken.
- **No logical-connector inversion in the wrapper.** Dropping *"however"* alongside the approved
  reassurance clause does not invert the meaning — the surviving *"still reads as a real marker"*
  carries the counter-expectation on its own.
- **`printf` format-string hazard clear.** Exactly 3 `%` conversions in `emit_block()`, all `%s`, each
  with a matching argument; no literal or stray `%` introduced. `bash -n` clean. Unicode intact.
- **`RULES_MAX` still parseable.** `/^RULES_MAX=(\d+)/m` matches exactly one line
  (`claude/fkit-claude-init.sh:332`); the inserted comment block contains no line-initial
  `RULES_MAX=`, so it cannot shadow the real one.
- **Comments cost the emitted block zero bytes** — the shell `#` and JS `//` comments sit outside
  `emit_block()`; the measured emission is unchanged by them.
- **Regenerated output is consistent.** The live blocks in both `CLAUDE.md` and `AGENTS.md` are
  **byte-identical** (`cmp`) to current `emit_block()` output, 3561 B each *(pre-R1-fix; **3570 B**
  each after it, re-proven by extraction — see *Close-out*)*. No stale or hand-edited regeneration.
- **The canary hedge is honest.** Both rationale comments
  (`claude/fkit-claude-init.sh:327-331`, `test/rules-block-budget.test.js:22-26`) state the Claude-side
  strip as first-hand re-verified on 2.1.220 **and** flag the codex side as **not re-measured**, with
  the conservative default *"assume it still pays"*. Neither overstates. The cap-rationale comments
  likewise record discipline as primary and attention dilution as **suspected but unmeasured**,
  as the owner ruled.
- **Cap semantics unchanged** — still measures the emitted block; `RULES_MAX` still 4096.
- **Suites green** — `node --test test/*.test.js` 523 pass / 0 fail; `bash test/prove-red.sh` hard gate
  PASSED (every mutation reds its named assertion).

## Re-litigates settled decisions (suppressed)

*(none — no finding from either reviewer re-raised a settled tradeoff. The Codex pass was primed with
the settled list and returned no suppressed items.)*

## Convergence call

**Round 1, and it is not a loop.** All three findings are **new**, none re-litigates a settled
residual, and all three were reached **independently by both reviewers** — the strongest agreement
signal available here.

**Recommend: act, then close.** The change is substantively correct — the compression is real, the
arithmetic is right, the promise the coder said it restored is genuinely restored, and the regenerated
output is byte-exact. R1 is the only finding with behavioral reach, and it is a 9 B restoration inside
existing headroom. R2 and R3 are documentation accuracy in comments this change itself authored or
edited; R2 carries extra weight only because the file's own stated thesis is that a stale header
comment is what *"made the drift invisible at the read site"*.

No further review round is warranted after these are dispositioned — a Round 2 would have nothing new
to examine.

## Close-out

**Closed 2026-08-01 by `fkit-reviewer` (phase 2 of the stateful review), on owner dispositions ruled
the same day in the live lead session. No Round 2 was run and none is warranted.**

**Final verdict: ✅ Ready to merge.** No open confirmed defect.

### Disposition of every finding

| #  | Owner disposition | Where it landed |
|----|-------------------|-----------------|
| R1 | **Fixed** | `"they should"` restored at `claude/scaffold/universal-rules.md:37`, +9 B. The coder verified first-hand that the prose is the sole carrier — `claude/turn-completion-hook.sh` checks presence only, and ADR-030 §4 records the gap deliberately. |
| R2 | **Accepted in part.** First half fixed; **second half refused by the coder, and the OWNER ACCEPTED THE REFUSAL** | `:14` "five-line" → "four-line" fixed. `:56-57` held at 443 B / "seven `printf` lines" and dated → **recorded as an accepted residual above; do not re-litigate.** |
| R3 | **Fixed** | The `:327` hedge re-quoted at the surviving `:355` claim, with its site named. Grep confirmed the old quoted wording occurred exactly once in the repo — inside the hedge itself — so the hedge had been aiming at nothing. |
| C1 | **Fixed** (coder-found, this round) | R1's +9 B instantly staled this change's own *"Currently 535 B free"* at `claude/fkit-claude-init.sh:323`; corrected to **526 B** and relabelled a snapshot. |

**Carried forward, not closed:** the codex half of the comment-stripping canary is still unmeasured —
second accepted-residual entry above; follow-up brief
`ai-agents/tasks/backlog/0177-verify-the-codex-half-of-the-comment-stripping-canary/`.

### Final measured state (post-fix, for the record)

- Emitted block **3570 B** = 3166 B source + 404 B wrapper. Confirmed at close-out by extracting the
  block from both `CLAUDE.md` and `AGENTS.md`: **3570 B each**.
- Headroom **526 B** — the owner's standing **≥ 400 B** target **MET**, with 126 B spare.
- **87 %** of the 4096 B cap; **219 B** clear of the 92 % gate at 3789 B.
- Net reclaim vs `HEAD` (3717 B): **147 B**.
- Suites re-run green after **every** fix — `node --test test/*.test.js` **523 pass / 0 fail**;
  `bash test/prove-red.sh` **hard gate PASSED**.
- Re-injection re-proven by extracting the block from `CLAUDE.md` and `AGENTS.md` and `cmp`-ing it
  **byte-identical** against live `emit_block()` output — not by the markers-only test.

### Review coverage

**Round 1 ran FULL two-reviewer coverage — `fkit-reviewer` (own pass) AND Codex (`codex-cli 0.145.0`).
NOT degraded, NOT partial.** All three findings were reached independently by both reviewers. Codex's
own test execution was blocked by a sandbox `EPERM` on `mktemp`; the reviewer ran both suites outside
the sandbox instead, so test coverage was complete too. The sprint roll-up's full-coverage claim is
checkable from this paragraph.

### Task status

**✅ Done (agent-closed — not owner-verified)** — closed by the producer, which moved this folder to
`ai-agents/tasks/done/`. This ledger is terminal: `Status: closed-out`.
