# Review — 0158

Task: 0158 — [brief](./brief.md)
File(s) under review: `ai-agents/knowledge-base/decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md` (the deliverable), `<task folder>/plan.md`, `<task folder>/worklog.md`
Status: in-review

**Round 1 verdict: 🛑 Blocked — 5 confirmed defects (1 high).**
**Reviewers run: fkit-reviewer (own pass) + Codex (`codex-cli 0.145.0`, exit 0) — Codex coverage FULL, no degradation.**

---

## Reviewer findings

| #  | Round | Sev  | file:line | Claim |
|----|-------|------|-----------|-------|
| R1 | 1 | high | `adr-037-…md:245-247` (also `:126-128`) | The counterfactual sentence — the one artifact §4 designates as the worker-side rules-block clause — produces the WRONG verdict on instance B, the ADR's own counterexample. It says flatly *"follow the skill rule"* with the named-owner-ruling exception as its only escape; in instance B no ruling was named, so a worker following it re-points the frozen ledger — the exact outcome `:72-73` rejects *"the skill rule always wins, full stop"* for. §Decision 1's headline rule `:126-128` has the same gap (no conservative-branch / escalation carve-out). Raised by both reviewers. |
| R2 | 1 | medium | `adr-037-…md:212-213` (also `:329-331`, `worklog.md:66-70`) | The 92 % test threshold is miscomputed. `test/rules-block-budget.test.js:103-108` **rounds** the percentage before comparing (`Math.round(size/max*100) <= 92`), so the suite passes through **3788 B** and first reds at **3789 B** — **218 B** of headroom, not the stated 198 B / 3768 B. Consequence: the ADR's *"the longest fails the test outright"* is **FALSE** — all three candidates (3744 B / 3756 B / 3782 B) pass. Raised by both reviewers. |
| R3 | 1 | low | `adr-037-…md:93`, `:88-93`, `:48-51` | Three quote-fidelity slips inside an ADR whose subject is citation fidelity. (a) `:93` labels ***"Everything else still refuses."*** *"verbatim"*; source `claude/agents/fkit-coder.md:98` reads *"Everything else still refuses** — any other spawned…"* (em-dash continuation, no period). (b) `:90-92` quotes the (a)/(b)/(c) marker but silently drops *"(the lead's sprint driver)"* from (a) with no ellipsis. (c) `:50` renders *"It is open to an owner override."* **bolded** inside a block presented as the addendum verbatim; `sprint-2.md:1071` has it unbolded — emphasis added, unmarked, in the same paragraph that convicts the brief of mis-quoting that passage. Codex raised (a); (b) and (c) are this reviewer's. |
| R4 | 1 | low | `adr-037-…md:216-217` | The three candidate wordings measured at 174 B / 186 B / 212 B are recorded **nowhere** — not in the ADR, `plan.md` or `worklog.md`. The measurement that drives §4's owner budget call is therefore unreproducible, and follow-up 1's *"re-measured at filing time"* instruction has nothing to re-measure against. Mitigant: the follow-up must draft its own wordings anyway. |
| R5 | 1 | low | `adr-037-…md:102-104` | The stated reproduction — *"`grep -rn \"direct your work\"` on 2026-08-02 returns only `0158`'s own brief and the board row"* — does not hold as written; the same command in this working tree also returns ADR-037 itself, `plan.md:47,52` and `worklog.md:33`. The claim describes a pre-deliverable sweep and does not say so. The substantive conclusion (the phrase is harness-injected, not authored in this repo) is unaffected and **verified TRUE**. |

### Disproven / not recorded as rows

- **Codex F1 as Codex framed it** (*"the ADR does not decide instance B at all; clause 2 is contradicted"*) — **PARTIALLY CORRECT, downscoped into R1.** §Decision 2 bullet 2 *does* reach instance B's behavior via *"— if it changes the outcome — return `NEEDS-DECISION` rather than proceeding"*, so clause 2 is recoverable. The unrecoverable text is the counterfactual and clause 1. Do not "fix" clause 2 in isolation.
- **The "two independent grounds" claim vs ADR-035 (`:258-261`)** — **VERIFIED CORRECT, no finding.** ADR-035's Decision states flatly *"It does not permit inserting a new row mid-board"*, an axis genuinely independent of precedence. ADR-037 does not do ADR-035's work and does not contradict it.

---

## Coder response

*(coder-owned — reviewer never writes here)*

**Round 1 response — 2026-08-02, process-review worker spawned by `fkit-sprint-ship-loop` under the
declared-approval marker. Owner dispositions on all five findings were relayed in the spawn prompt
(`AskUserQuestion`, live driver session, 2026-08-02); nothing below was decided by this worker alone.**

**All five findings verified first-hand against the files. All five are CORRECT. None was rejected.**

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT (high)** | **Defect** — the deliverable's own headline sentence produces the wrong verdict on the ADR's own counterexample | Rewrote the counterfactual to carry the conservative-branch-and-escalate escape; added a *"'Binds' does not say 'proceed'"* qualifying block to §Decision 1. Added a by-name walk of both instances against the new sentence alone, and its measured size. **Clause 2 left byte-unchanged.** | **FIXED** |
| R2 | **CORRECT (medium)** | **Defect** — a stated number that is arithmetically wrong, plus a false conclusion drawn from it | Re-measured independently (not inherited from either side). Corrected §4, follow-up 1 and `worklog.md` D4 to **3789 B first red / 218 B headroom**. **Withdrew "the longest fails the test outright" as false.** | **FIXED** |
| R3 | **CORRECT (low)** | **Defect** — three unmarked quote slips in an ADR whose subject is quote fidelity | All three fixed: period → ellipsis + continuation shown; *"(the lead's sprint driver)"* restored; added bold removed and the source's own emphasis identified. | **FIXED** |
| R4 | **CORRECT (low)** | **Defect** (real, small) | **Owner disposition: accept as residual — not fixed.** Recorded below and in `worklog.md` D14. Partial incidental mitigation only (§4 now records the resulting block sizes and the new sentence's bytes); **the three wordings themselves remain unrecorded.** | **ACCEPTED RESIDUAL** |
| R5 | **CORRECT (low)** | **Defect** (reproduction claim only; conclusion sound) | **Owner disposition: accept as residual — not fixed.** Recorded below and in `worklog.md` D14. | **ACCEPTED RESIDUAL** |

**On the two items the reviewer resolved rather than filed — both carried forward as settled, neither
re-litigated:**

- **Codex F1 (*"clause 2 is contradicted, instance B undecided"*) — agreed DISPROVEN.** Re-checked:
  §Decision 2 bullet 2 does reach instance B via *"— if it changes the outcome — return `NEEDS-DECISION`
  rather than proceeding"*. **Clause 2 was therefore not edited.** R1's fix was written to be
  *consistent with* clause 2 rather than a substitute for it, per the reviewer's own instruction.
- **The *"two independent grounds"* claim vs ADR-035 — agreed VERIFIED CORRECT.** No change.

**Not fixed, deliberately, and named so no later round reads the omission as an oversight:** `0158`'s
own stale brief citations. They sit in the task's own record, ADR-034 makes them an accepted residual,
and the ADR carries them as **follow-up 4**. **The brief was not edited.**

**Tests re-run after the edits** — `npm test` → **560 pass / 0 fail / 17 suites**;
`node --test test/rules-block-budget.test.js` → **3 pass / 0 fail**;
`node --test test/adr-number-uniqueness.test.js` → **14 pass / 0 fail**.
**No source, skill, agent file or scaffold was touched, so no test outcome could have moved** — the runs
confirm that, they do not demonstrate a fix.

**Change surface this round:** the ADR, this `review.md`, and the task's `worklog.md`. No commit, no
board status change, no task-folder move, no `ai-agents/wiki-vault/` write.

---

## Re-litigates settled decisions (suppressed)

- **The brief's own stale citations** (`sprint-2.md:245-249` → `:1069-1073`; `## Priority` 122 vs board P123; `claude/universal-rules.md` → `claude/scaffold/universal-rules.md`; `0142`/`0157`/`0160` described as open) — **suppressed.** ADR-034 (*"a residual defect in the task's own record … is recorded as an accepted residual"*) makes these a residual, not a close blocker. ADR-037 names them as follow-up 4. Verified: all five drifts are real, and the ADR's corrections of them are accurate.
- **"This is unenforced prose" / "the named-owner-ruling marker is forgeable" / "some skill rule should have been undisplaceable"** — **suppressed**, per ADR-037 `:318-320` *"Do NOT re-raise"* and the owner's Q1 ruling of 2026-08-02. Neither reviewer raised them; recorded so a later round does not.

---

## Accepted residuals (shared, do-not-re-litigate)

**Dispositioned by the owner on 2026-08-02 via `AskUserQuestion` in the live driver session, relayed
into the process-review spawn. Both are REAL and VERIFIED — accepted, not disproven. Do not re-raise
them in a later round; raise a NEW finding only if new evidence changes what they are.**

- **R4 — the three candidate rules-block wordings (174 B / 186 B / 212 B) are recorded in no file.**
  Verified: they appear in neither the ADR, `plan.md` nor `worklog.md`. **Consequence, stated and
  accepted:** §4's budget call is not reproducible from the artifacts, and follow-up 1's *"re-measured
  at filing time"* has no baseline wording to re-measure. **Accepted because** follow-up 1 must draft
  and measure its own wordings regardless, so the missing text costs a re-draft, not a wrong decision.
  *Partial incidental mitigation applied while fixing R2:* §4 now records the resulting block sizes
  (3744 / 3756 / 3782 B) and each one's verdict, and the new counterfactual's own 313 B is recorded.
  **The wordings themselves are still absent.**
- **R5 — the reproduction claim at the ADR's *"direct your work"* subsection does not hold as written.**
  Verified: `grep -rn "direct your work"` in this working tree now also matches the ADR itself,
  `plan.md` and `worklog.md`; the ADR describes a pre-deliverable sweep without saying so. **Accepted
  because** the substantive conclusion it supports — *the phrase is harness-injected subagent preamble,
  not authored anywhere in this repo* — is **independently verified TRUE** and is unaffected by the
  imprecise reproduction. **The wording stays as-is and this note is the correction of record.**

---

## What was verified this round (evidence)

**Citations — every `path:line` in ADR-037 opened and checked against the file as it exists 2026-08-02:**

| Claim | Result |
|---|---|
| `fkit-task-brief/SKILL.md:141-143` step 5 + *"Do not renumber or insert into the owner's ranking"* | ✅ `:141` is the `### 5. Determine priority` heading, quote at `:142-143` |
| *"reinforced twice more in the same file"* | ✅ `:161`, `:343`, `:382` |
| `fkit-task-done/SKILL.md:144,157,174` step 5 + *"re-point the href … change nothing else on the line"* | ✅ `:144` heading; quote spans `:157-158`; the review-ledger bullet is `:173-177` |
| addendum is at `sprint-2.md:1069-1073`, not `:245-249`; `:245-249` is an unrelated displacement table | ✅ both halves confirmed |
| the brief's ellipsis drops *"It is open to an owner override"* | ✅ confirmed against `sprint-2.md:1071` |
| `claude/universal-rules.md` does not exist; the file is `claude/scaffold/universal-rules.md` | ✅ confirmed (`find` returns one file) |
| the three-tier `## Output style` preamble + *"nothing written anywhere overrides a hard rule above"* | ✅ `claude/scaffold/universal-rules.md:14-17`, verbatim-accurate |
| `fkit-coder.md` *"A second scoped exception"* heading, (a)(b)(c) marker, *"trust, not proof"* | ✅ `:60`, `:64-67`, `:93` (see R3 for two quoting slips) |
| ship-loop `## Hard rules` `:235-250` constrain **actions** only, never instruction content | ✅ confirmed |
| ship-loop *"Rules that make this honor the ADRs"* `:109` mirrors the marker | ✅ confirmed |
| ADR-019 `:96` carries the worklog audit obligation | ✅ confirmed |
| `test/skill-ownership-sites.mjs` does not exist on disk | ✅ confirmed |
| `reports/2026-08-01-durable-citation-form-for-mutable-coordinates.md` exists | ✅ confirmed |
| all 12 ADR cross-link filenames in `## Related` | ✅ all present |
| ADR-010/012/018 do not decide rule-content precedence | ✅ confirmed (invocation axis only) |

**Budget, re-measured independently** (ran the real `emit_block()` from `claude/fkit-claude-init.sh:341-349`, UTF-8 bytes): emitted **3570 B**, `RULES_MAX=4096` (`:334`), **526 B free**, raw utilization **87.1582 %**. ≥ 400 B-free standing target (`claude/fkit-claude-init.sh:323`, `test/rules-block-budget.test.js:21`) leaves **126 B**. All confirm the ADR **except** the 92 % threshold — see **R2**.

**Tests re-run first-hand:** `node --test test/adr-number-uniqueness.test.js` → **14 pass / 0 fail**. `node --test test/rules-block-budget.test.js` → **3 pass / 0 fail**. `npm test` → **560 pass / 0 fail / 17 suites**; `prove-red.sh` `0a`–`0h` green, mutations 1–13 all red, `✓ hard gate PASSED`. Every worklog verification figure reproduces exactly.

**Scope discipline — PASS.** `git status --porcelain` shows exactly 3 new files (the ADR, `plan.md`, `worklog.md`) and 2 modified. `git diff` confirms `sprint-2.md` and `brief.md` each changed **one line only**, the `🔲 Backlog` → `🔄 In progress` token — the driver's pre-spawn flips, not the worker's. **No edit** to `claude/scaffold/universal-rules.md`, `claude/skills/fkit-sprint-ship-loop/SKILL.md`, `/fkit-task-done`, the brief's citations, or `ai-agents/wiki-vault/`. No commit.

**Brief coverage.** All five `## What to build` questions answered explicitly at `## Decision` 1–5 — stated answers, not gestures. Verification steps 1, 2, 3, 5, 6, 7, 8 **PASS as graded**. **Step 4 FAILS** — the counterfactual is present but is not followable to a correct result with no other context (**R1**). Step 7 is met in substance: `plan.md`/`worklog.md` are ADR-020-mandated and the extra diff is disclosed, not hidden.

**ADR hygiene — PASS.** Number 037 unique (test green); `Status: accepted` / `Date` / `Deciders` header matches ADR-034/035/036 house shape; filename convention matches siblings; no ADR index or README exists in `decisions/`, so there is nothing to register in.
