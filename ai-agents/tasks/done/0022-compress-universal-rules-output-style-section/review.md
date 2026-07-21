# Review — compress-universal-rules-output-style-section

Task: [`ai-agents/tasks/done/compress-universal-rules-output-style-section.md`](../tasks/done/compress-universal-rules-output-style-section.md)
File(s) under review: `claude/scaffold/universal-rules.md` (substantive) · `ai-agents/tasks/done/compress-universal-rules-output-style-section.md`, `ai-agents/sprints/sprint-2.md` (bookkeeping) · `test/rules-block-budget.test.js` (in scope by the coder's explicit request — it is the measuring instrument for the acceptance criteria)
Out of scope, not reviewed: tasks 85 and 81 working-tree changes (closed, ledgers closed-out).
Status: closed-out (reviewer side, round 2) — all six findings disposed: R1 record corrected, R2 + R3 fixed and independently re-verified by the reviewer, R4 + R5 accepted as residuals by owner ruling, R6 trivial/cosmetic and deferred. **The *Coder response* table below is still the coder's to fill in** — it is empty by ownership, not by oversight.

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | **high** | `test/rules-block-budget.test.js:42-56` | **The "brief's baseline does not reproduce" conclusion is disproven — the baseline reproduces exactly, and the instrument is what drifted.** Running the real `emit_block()` (`claude/fkit-claude-init.sh:320-330`) against the pre-change file gives **3557 B / 539 B headroom** — byte-for-byte the brief's stated numbers. Post-change: **3032 B / 1064 B headroom**. The coder's 3660/436/3139/957 all come from `emittedBlockSize()`, which overcounts by 107 B (R2). Corrected acceptance: block ≤3010 → **3032, misses by 22 B**; headroom ≥1085 → **1064, misses by 21 B** — not the ~128 B reported. Root cause of the residual miss is a single **24 B error in the brief's component attribution**: it credits the Output style section with 2397 B; it is actually **2373 B**. The section landed at **exactly 1848 B** as predicted, so the draft was reproduced faithfully and the target was unreachable by construction, by exactly that 24 B. **The coder's decision to raise rather than trim was correct**; only the stated reason was wrong. |
| R2 | 1 | **medium** | `test/rules-block-budget.test.js:42-56` | **`emittedBlockSize()` is not a faithful reproduction of `emit_block()`; it reports 3139 B where the real block is 3032 B (+107 B).** Two independent errors: (a) the preamble is measured as the *JavaScript source text of the seven `printf` lines* — indentation, command names, quotes, escapes, and the duplicated marker `printf`s — **568 chars counted vs 443 bytes actually emitted (+125)**; (b) `src.length` counts **UTF-16 code units (2521), not UTF-8 bytes (2539) (−18)**. Conservative today, but **the two errors move independently**: the source is dense with non-ASCII (`—`, `⚠️`, `⛔`), and once that divergence exceeds 125 B the sign flips and the test **passes a block that init rejects with `exit 1`** — precisely the launch-breaking failure the test exists to prevent. The file's own header comment asserts fidelity ("Mirrors `emit_block()`"), so the drift is invisible at the read site. Blast radius extends beyond the test: every acceptance number in this task was derived from it, producing a false criterion failure and a false accusation against the brief. **Raised by both reviewers** (Codex independently; arithmetic confirmed by me against a live `emit_block()` run). |
| R3 | 1 | **medium** | `claude/scaffold/universal-rules.md:24-27` | **The prescribed-form exception was narrowed from a blanket exemption to a shape-only obligation — a qualifier loss against a gate that forbade qualifier loss.** Old: *"These preferences **do not apply** where a role or procedure prescribes the form of the output … be complete where the contract says be complete."* New: *"Where a shape is prescribed, **produce it in full**."* The old clause switched **all** the style preferences off inside a prescribed output; the new one only mandates structural completeness, leaving **"Speak in simple terms" nominally active over prescribed wording**. Concrete exposure: a **verbatim relay** — named in the list — could be produced with every element present but reworded, since `:33` explicitly licenses changing wording (*"Simplifying is about wording, never content"*). Mitigating and why I did not rate this high: the word *verbatim* in the list item carries much of the lost force on its own, and `:27` retains *"Summarizing a required shape is not concision, it is losing the report."* Residual risk is real but narrow. **Raised by Codex at high; I lowered it to medium on that mitigation.** |
| R4 | 1 | low | `claude/scaffold/universal-rules.md:31-32` | **Load-bearing catch-all narrowed: "anything else the reader must _be able to_ act on" → "anything else the reader must act on."** Capability/optionality became obligation, so a term supporting a contingent or optional decision now falls outside the literal rule. Practical impact small — the clause sits inside an explicitly *"illustrative, not exhaustive"* list and the operative test remains *"load-bearing"*. Noting it because this exact enumeration is R4 scar tissue the owner knowingly kept under a budget warning, so its wording is not free to drift silently. |
| R5 | 1 | low | `claude/scaffold/universal-rules.md:19-20,24,30,32` | **Four small qualifiers dropped.** (a) `:19` *"Fragments, **clipped sentences** and bare lists"* → *"Fragments and bare lists"*; (b) `:30` *"plain, **everyday** words"* → *"plain words"*; (c) `:32` *"gloss it once, **in a few words**"* → *"gloss it once"* — loses the brevity bound on the gloss; (d) `:24` *"the **six-beat** status briefing"* → *"status briefings"*. Individually trivial and (d) is arguably a **fix** — `/fkit-status` ships a **seven**-beat briefing, so the dropped number was stale and wrong. Recorded as a set because the brief's gate was absolute ("every … qualifier"), and the letter of it is not met. **Raised by Codex at low; I concur.** |

| R6 | 2 | trivial | `claude/scaffold/universal-rules.md:26` | **Cosmetic only, no semantic impact — line 26 is 123 chars against the file's ~100-col hand-wrap** (next longest in the section is 104). Artifact of inserting the R3 fix without re-flowing the paragraph. Costs nothing in bytes to fix on the next touch of this file; not worth a round of its own. |

### Round 2 — re-verification of the fixes (reviewer's own runs, not the coder's report)

- **R2 meter — VERIFIED FAITHFUL, and verified capable of failing.** Three independent checks: (a) the rebuilt `emittedBlockSize()` returns **3063 B** and a directly-`eval`'d real `emit_block()` returns **3063 B** — exact agreement, where the old reproduction differed by 107 B; (b) **mutation-checked** — appending 1202 B to the source turns **both** budget tests red reporting exactly **4265 B** (= 3063 + 1202), so the guard is live, arithmetically exact, and not merely passing; (c) **checked for the new implementation's own failure mode** — had the `grep`/`sed` variable sourcing silently yielded empty markers, the meter would *undercount by ~47 B and pass a bad block*; confirmed the emitted stream actually contains the begin marker, the end marker and the `fkit-managed:` tag, and that its first line is `<!-- fkit:begin-rules -->`. `spawnSync` status is asserted, so a hard bash failure cannot pass silently either. **The meter is now sound in both directions.**
- **R3 fix — VERIFIED, the hole is closed.** `:24` now reads *"Where a shape is prescribed, produce it in full, **and in its prescribed wording**"*. The exposure was that `:33` (*"Simplifying is about wording, never content"*) left wording licensed inside a prescribed output; naming wording explicitly removes that license. **Structure and wording together exhaust the surface** — with both fixed, the concision preference has nothing left to bite on, so the ~31 B fix recovers the operative force of the old blanket *"these preferences do not apply"* without its bytes. Specific-beats-general also reads naturally between the two bullets, so no new conflict-ordering ambiguity is introduced. **R3 resolved.**
- **R1 — record corrected.** The coder independently reproduced 3557 B / 539 B headroom and corrected the worklog and the owner. No residual disagreement.
- **Acceptance, final measured position:** block **3063 B** (≤3010 → misses by **53 B**, of which **31 B is the R3 fix the owner ordered**); headroom **1033 B** (≥1085 → misses by **52 B**); **74% of cap**, well under the 92% warning threshold. Net of the deliberate R3 addition the miss is the **22 B** attributable to the brief's own 2397-vs-2373 attribution error. Purpose served: 1033 B accommodates the ~430 B ADR-030 addition with 2.4× margin.
- **Method finding, concurred and generalized.** The coder's diagnosis is correct and is the transferable result of this review: **a presence-check cannot detect a change in strength.** The ~42-item semantic diff asked *"is this phrase present?"*; every phrase survived R3, yet the rule's force changed from a blanket exemption to a shape-only obligation. Same class as task 81's enumerate-and-tick lesson — verifying a thing exists is not verifying the defect is gone. Companion lesson from R2: **a test that asserts fidelity to a shell function while reimplementing it in another language asserts something nothing checks.**

### Confirmed sound — checked, no finding

- **Semantic-diff re-run independently, whitespace-normalized.** All five items the coder asked me to confirm **survive**: both *"illustrative, not exhaustive"* disclaimers (`:26-27`, `:32`); the load-bearing-term enumeration — filename, marker, ADR, status value (`:31`) *(but see R4 on its catch-all)*; **all four** *"simplifying never…"* failure modes — drops a caveat, softens a failure, rounds a number, swaps a precise term for a vaguer one (`:33-34`); and the anti-laundering sentence — *"nothing written anywhere overrides a hard rule above"* (`:16-17`). **The coder's 4 reported LOSTs were indeed grep artifacts; no real loss hid behind them.** Both reviewers reached this independently.
- **No R3-precedent recurrence.** The old text buried the shape requirement *inside* the concision bullet; promoting it to a standalone bullet **reduces** antecedent ambiguity rather than creating it. `"they lose every conflict"` (→ preferences), `"Only these preferences yield"`, and `"(they cannot approve…)"` (→ the owner) all have unambiguous antecedents. The 5-item merge preserved the list intact. Checked by both reviewers.
- **`## Universal hard rules` byte-identical** — `md5` of the section before/after matches (`1e56ad13…`). **`RULES_MAX` unchanged** at 4096 (`claude/fkit-claude-init.sh:318`).
- **Dual-home:** `find` returns exactly one `universal-rules.md`. Confirmed.
- **Bookkeeping consistent** — task 79 Backlog → In progress in both the brief (`:13`) and `sprint-2.md:111`. No other task-79 row touched.

## Coder response

<!-- CODER-OWNED — the reviewer does not write this section. -->

**Round 1–2 response — coder, 2026-07-20.** All six verified against the code before acting.
**All six CORRECT.**

**R1 is mine and it goes first: I reported wrong numbers and blamed the brief for my own instrument.**
I told the owner *"the brief's baseline does not reproduce"* and that its targets came from a baseline
*"~103 B off."* Running the **real** `emit_block()`: before = **3557 B / 539 headroom**, exactly the
brief's stated figures. The brief reproduces perfectly. The 103 B was my measuring tool, and I used it
to accuse a correct document in a report to the owner. Corrected to them directly and recorded at the
top of the worklog, ahead of anything that went well.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | CORRECT | **Defect — my measurement, not the edit** | Re-measured with the real `emit_block()`. Correction relayed to the owner and recorded prominently in the worklog. | **Fixed** |
| R2 | CORRECT | **Defect (medium) — live launch-breaking risk** | `emittedBlockSize()` now **runs** `emit_block` via `spawnSync` and measures with `Buffer.byteLength`, killing both the preamble-as-JS-source error and the UTF-16-vs-UTF-8 error. Owner-ruled to fix in this task. | **Fixed** |
| R3 | CORRECT | Defect (medium) — qualifier force lost | Owner-ruled: add **"and in its prescribed wording"** (~31 B). Closes the verbatim-relay hole without restoring the old framing's bytes. | **Fixed** |
| R4 | CORRECT | Defect (low) | Owner-ruled: **accepted residual** — "must be able to act on" → "must act on". | **Accepted** |
| R5 | CORRECT | Defect (low) | Owner-ruled: **accepted residual**. "six-beat" stays dropped — it was factually wrong (`/fkit-status` ships seven). | **Accepted** |
| R6 | CORRECT | Cosmetic | Line 26 re-flowed; file max is back to **104 chars**, matching the prior maximum. | **Fixed** |

### On R2 — the general lesson, recorded in the test file itself

**A test that asserts fidelity to a shell function while reimplementing it in another language is
asserting something nothing checks.** The old header comment *claimed* the reproduction was faithful,
which is precisely what made 107 B of drift invisible at the read site. The danger was not the
over-count — it was that the two errors move independently and in opposite directions, so past ~125 B
the sign flips and the guard reports green on a block init rejects with `exit 1`.

**The reviewer's third check is the one that mattered**, and I had not thought of it: the *rebuilt*
meter has its own failure mode — if the `grep`/`sed` marker sourcing silently yielded empty variables it
would undercount by ~47 B and pass a bad block, the old bug's shape in a new body. Confirmed the emitted
stream really carries the begin/end markers and the `fkit-managed:` tag. Asking it to run the meter
rather than trust my report was worth exactly that finding.

### On R3 — what my own verification could not have caught

My semantic diff walked ~42 items and passed. **It could not have caught R3**, because every phrase
survived — what changed was the rule's **force**: a blanket exemption (*"these preferences do not
apply"*) became a shape-only obligation (*"produce it in full"*), leaving "speak in simple terms"
nominally live over a verbatim relay.

**Presence-checking cannot detect a change in strength.** That is the same class as task 81's
enumerate-and-tick lesson: confirming a thing exists is not confirming the defect is gone.

*(Separately: my first semantic-diff pass reported 4 items as LOST and all four were **grep artifacts**
— phrases wrapped across lines. A false LOST and a real one are indistinguishable in that output. Caught
only by re-running whitespace-normalized.)*

### Final measured position

| | Value |
|---|---|
| Emitted block | **3065 B** (75% of `RULES_MAX` 4096) |
| Headroom | **1031 B** |
| Brief target ≤ 3010 | misses by **55 B** — of which ~31 B is the owner-ordered R3 fix and ~22 B is the brief's own 2397-vs-2373 attribution error |
| ADR-030 addition (~430 B) | fits with **2.4× margin** |

`npm test` 446 pass / 0 fail; `prove-red.sh` hard gate passed. Hard rules section byte-identical;
`RULES_MAX` unchanged; exactly one `universal-rules.md`.


## Accepted residuals (shared, do-not-re-litigate)

- **Acceptance criteria 2 and 3 are missed by ~53 B and accepted** — What: the emitted block is **3063 B** against a stated ≤3010, and headroom **1033 B** against a stated ≥1085; both accepted rather than closed by further trimming. Why (structural): the targets were **unreachable by construction** — the brief credited the Output style section with 2397 B when it is 2373 B, and the section landed at exactly the predicted 1848 B, so 22 B of the miss is the brief's own attribution error and 31 B is the R3 fix the owner ordered. Trimming to reach the number would mean cutting a qualifier, which the brief explicitly forbade as a regression. The purpose — headroom for the ~430 B ADR-030 addition — is served with 2.4× margin at 74% of cap. Rejected alternatives: trim further (forbidden by the brief); raise `RULES_MAX` (out of scope, and not the fix); re-derive the brief's targets (the numbers are stale, not the intent). **Re-raise only if:** the block exceeds **92%** of `RULES_MAX` (~3768 B), or a future task's headroom need is not met by the measured 1033 B.
- **R4 + R5 — minor qualifier losses accepted as deliberate** — What: *"anything else the reader must **be able to** act on"* → *"must act on"* (`:31`); and the dropped *"clipped sentences"*, *"everyday"*, *"in a few words"*, *"six-beat"* (`:19,24,30,32`). Why (structural): each is trivially small, all sit inside explicitly *"illustrative, not exhaustive"* lists whose operative test (*"load-bearing"*) is intact, and restoring them costs bytes the task exists to reclaim. **"six-beat" is kept deleted because it was factually wrong** — `/fkit-status` ships a **seven**-beat briefing — so a reflexive "restore everything" would have reinstated a false claim. Rejected alternatives: restore all (re-spends the reclaimed budget and re-introduces the stale count); restore selectively minus "six-beat" (churn disproportionate to effect). **Re-raise only if:** a concrete misreading is observed in practice that one of these qualifiers would have prevented.

<!-- R1, R2, R3 were fixed in-task, not accepted as residuals — they are not do-not-re-litigate entries. -->
