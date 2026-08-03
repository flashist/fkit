# 0162 — worklog

**Build phase.** Role: `fkit-architect`, spawned by `/fkit-sprint-ship-loop` under the declared-approval
marker. Date: 2026-08-02.

---

## 1. The irony, recorded because the task requires it

**This `plan.md` was written at Build time, not at plan approval — which is finding F2, the central
structural defect this task identified.** The sprint loop names `plan.md` exactly once, in the Build row
of its step table (`claude/skills/fkit-sprint-ship-loop/SKILL.md:103`), as something the *Build worker*
writes. So the approved plan reaches disk only after the work it authorized has begun.

**And it bit the owner's own ruling, same day.** The owner ruled a faithful carry is *paste + path/hash
pointer*. The spawn prompt for this Build carried **the paste and no pointer**, because
`0162/plan.md` did not exist. Verified firsthand: `ls -la` of this folder at the start of the turn
returned exactly one file, `brief.md`.

**Half of the approved construction was unavailable at the first moment it was supposed to be used**, on
the very task that defined it. That is not a hypothetical failure mode in a report — it is a worked
example, and it is why follow-up 1 is a hard prerequisite rather than housekeeping.

The driver disclosed this gap in the spawn prompt rather than asserting a fidelity it could not deliver.
**That disclosure is testimony** — no session transcript is stored (`find . -name "*.jsonl"` excluding
`node_modules/` → empty), so the paste cannot be checked against anything. **No conclusion in the report
rests on it**; every finding was re-derived from files read this turn.

---

## 2. Verification against the approved plan — six corrections

**The approved plan was treated as a hypothesis, not as evidence.** Every claim in its evidence table was
re-checked against live files before use. Six things changed. Full table in `plan.md` §3; the two that
matter most:

- **The brief's citation is stale in TWO places, not one.** `SKILL.md:109` → `:110` *and* the quote range
  `:109-115` → `:110-116`. `:109` is the heading `**Rules that make this honor the ADRs:**`; the bullet
  runs `:110-116`. Follow-up 6 widened accordingly.
- **The brief's claim that no test reads `fkit-coder.md` "or any `SKILL.md` content at all" is half
  wrong.** `test/skill-frontmatter.test.js` reads every skill `SKILL.md` and every agent `.md` —
  `readFileSync` at `:323`, live-corpus tests at `:577` and `:596`, over a pinned corpus
  (`EXPECTED_SKILLS = 25`, `EXPECTED_AGENTS = 7`, `:574-575`). **The accurate claim is that no test reads
  the *body*.** Repeating the brief's wording would have propagated a false claim into a second document.
  Corrected in the report (F5) and filed as follow-up 7.

Also corrected: `0157` is closed, not an open sibling; `shiploop-marker-hook.sh` is a
`UserPromptExpansion` hook (only two `PreToolUse` matchers exist); `.claude/settings.local.json` **does**
exist but carries no `hooks` key; and the pointer must use **`git hash-object`**, which works on
untracked files — today's `plan.md` files are all `??` in `git status`, so a commit-relative ref would
fail on every one of them.

**The one testimony claim that could be checked, failed.** The driver reported compressing `0195`'s §7
"five Q&A pairs". `ai-agents/tasks/done/0195-…/plan.md:88-97` has **four** rows and says *"All four"*.
Recorded in the report as mild but direct evidence for the central finding.

---

## 3. Decision log — autonomous calls made while the owner was away

| # | Call | Why it qualified |
|---|---|---|
| **D1** | Corrected the brief's test-surface claim in the report rather than repeating it, and filed the correction as follow-up 7. | Verified-wrong factual claim; the task prompt explicitly instructs *"if a measurement is wrong, say so rather than inheriting it."* In-plan, mechanical. |
| **D2** | Widened follow-up 6 from one stale citation to two. | Same instruction; the second stale citation was found by direct file read. Widening a named follow-up's text is not filing new work. |
| **D3** | Specified `git hash-object` (not `git rev-parse HEAD:<path>`) as the pointer's hash form. | The plan said "a content hash or git blob ref" without choosing. Verified today that plan.md files are untracked, which rules out the commit-relative form. A specification within an approved parameter, not a new decision. |
| **D4** | Downgraded the plan's *"`PreToolUse` hooks wired by matcher"* to name only the two matchers that exist, and reclassified the ship-loop marker hook as `UserPromptExpansion`. | Factual correction; the F3 conclusion is unaffected. |
| **D5** | Added §9 (enforcement honesty, consolidated) and §11's second open question — that nothing detects a driver writing a `plan.md` the owner never approved. | The task prompt required the enforcement-honesty statement be plain and unmissable; consolidating it into one section is placement, not new scope. The second open question is **surfaced, not settled** — explicitly marked out of `0162`'s scope. |
| **D6** | Recorded the §0.1 self-demonstration in the report body rather than in a footnote. | The task prompt instructed *"record it as a live worked example."* Placement follows the instruction. |

**No obvious-winner code calls were made — this task writes no code.**

---

## 3b. Decision log — Process-review round 1 (`fkit-coder`, 2026-08-02)

Spawned by `/fkit-sprint-ship-loop` under the declared-approval marker, as the **Process-review worker**.
`/fkit-process-stateful-review` was invoked and permitted by the ADR-018 skill-ownership hook. **All eight
fixes below were applied under the owner's explicit per-finding dispositions relayed in the spawn prompt**
— so none is an unattended autonomous call in ADR-019's sense. Logged anyway, per ADR-032 A2, because the
owner was not present in *this* context to see them applied.

| # | Finding | What changed | Why it qualified |
|---|---|---|---|
| **P1** | R2 (high) | Report §2: `Read(plan.md)` → **byte-exact `Bash(cat …)`** + an explicit whole-file check against `wc -c`; added a blockquote naming the two `Read` failure modes (`cat -n` framing defeats hash equality; the 2000-line cap silently truncates). Follow-up 2's text rewritten to match. | Owner disposition 1, verbatim. Verified CORRECT firsthand — every `Read` this turn returned line-number-prefixed output, and the cap is documented tool behavior. Mechanical, localized, in-plan. |
| **P2** | R1 (high) | §6 caveat 1, §6 summary line, §7 (two paragraphs + a new "precisely what becomes checkable" block), §9's checkable bullet, §9's closing line, and follow-up 4's prescribed text: every assertion that **(b)** is machine-checkable now reads **"a carry-fidelity proxy for (b)"**, with (b)'s *approved* qualifier called out as unreachable. | Owner disposition 2. Verified against `adr-037-…:96-97` and `fkit-coder.md:65-66` — (b) does say *approved*. **Widened beyond the two named sites (§7 + follow-up 4) to four more** that carried the identical unqualified claim; leaving them would have made the report contradict itself. Mechanical, same defect, same fix — surfaced in the return rather than left silent. |
| **P3** | R1 (secondary) | §7: added a paragraph showing the correction does **not** trip ADR-037 `:365-367`'s *"Do NOT re-raise"* fence (forgeability / unenforced-prose / undisplaceable-rule), and that scoping it to the proxy is what keeps it clear of that fence. | Step-2 loop check against a settled ADR residual. The reviewer flagged the partial reading; the scoping fix is what makes follow-up 4 safe to write. In-plan (follow-up 4's wording is disposition 2's subject). |
| **P4** | R3 (medium) | Follow-up 2's row now **requires the rule text itself to say the emitted pointer is `unverified — no hook checks it until follow-up 3 lands`**, and its gate reads "ships without waiting for 3". | Owner disposition 3, verbatim — ship with the honesty text rather than hard-gating on 3. |
| **P5** | R4 (medium) | §3: corrected the audit claim — `git hash-object` **without `-w` stores nothing** (confirmed: `git cat-file -e` reports the object absent), so a pointer is **tamper-evidence at spawn time, not an archive**. §6: added **caveat 4, TOCTOU** (hook-read vs worker-use), renumbering to five caveats and updating follow-up 3. §9: added the **Build-time-authoring** case — a Build worker that *renders* rather than *copies* the plan poisons every later carry. | Owner disposition 4, all three parts. Each verified firsthand. |
| **P6** | R4 (live instance) | §9: the Build-time case upgraded from hypothetical to a **dated, confirmed observation** — `0162/plan.md` (blob `2458a57e…`) is **not** the approved plan; two distinctive approved strings are absent by `grep -F`. §0.1 and §12 point at it. **Explicitly qualified:** follow-up 1 closes **this route**, not the class. | Confirmed firsthand this turn at the driver's prompting. ⚠️ **The driver's framing was adjusted, not adopted:** it called this the §9 residual *"the hash pins which bytes were carried, not which bytes were approved"*. That generic sentence does cover it, but the specific mechanism — a **worker** authoring rather than copying — is the case R4 says the report **misses**, and the actor is the Build worker, not the driver. Recorded as the sharper, previously-unnamed form. |
| **P7** | R5 (medium) | This file's §4 rows for brief steps 6 and 7 re-graded from ✅ to **"⚠️ superseded (loop-mandated artifacts)"**, each stating the criterion **as written**, why it is superseded, and which half genuinely holds. | Owner disposition 5 — **re-grade, do not re-argue.** The substance was always fine and was disclosed at report `:8-9`; only the grading record was wrong. Severity kept at **medium** rather than cosmetic: a ✅ recorded against a silently reworded criterion is the same self-certification shape this whole task exists to fix, sitting in the ADR-032 A4 audit record. |
| **P8** | R6 (low) | Three stale internal refs fixed: `:19` §5/§6 → **§6/§7**; `:114` "(see §6)" → **§7**; `:222` "by a hook (§5)" → **§6**. | Owner disposition 6. Verified against the report's own `## N.` headings. |
| **P9** | R7 (low) | §12: elided paths (`adr-037-…`, `0195-…`, `0147-…`) expanded to full resolvable paths; `0195/plan.md:88-97` → **`:88-98`** (OQ-4 is at `:98` — confirmed); the non-reproducible `ls` row **marked non-reproducible** and re-classified nearer testimony; three new evidence rows added; a note on re-runnability added above the table. | Owner disposition 7. |
| **P10** | R8 (low, PARTIALLY CORRECT) | §0's *"not the load-bearing evidence for any conclusion below"* softened to: no conclusion **depends** on testimony, but §2 and §3 draw **illustrative** support from it, and both survive its removal. **Wording only — nothing restructured.** | Owner disposition 8, verbatim ("fix the wording only"). |

**Carried forward as settled, not re-verified** (owner instruction): the six Build-phase self-corrections
(D1–D6 above), all independently confirmed CORRECT by the reviewer — including its sweep of all 16 files
in `test/` finding no test that reads a skill or agent **body**; F2/F3/F4; `0163` needs no edit; Codex
coverage **FULL**.

---

## 4. Verification

| Check | Result |
|---|---|
| All five brief questions answered explicitly, each under its own heading, each with a stated answer | ✅ Report §2–§6 (Q1–Q5), plus §7 (Q6, the ADR-037 flag the brief demanded be loud) |
| By-reference genuinely weighed, with a stated distinction between an acceptable pointer and round 1's | ✅ Report §3 — three named properties in a table; round 1's pointer has none |
| **No worker-side detection proposed.** Zero occurrences | ✅ Report F4 states it is impossible and says so explicitly: *"No mechanism requiring the spawned coder to compare a carried plan against the owner's real approved plan appears anywhere in this report."* |
| Condition (b)'s fate stated | ✅ Report §5 — *"(b) stands byte-unchanged"*, with the rejected conditional branch recorded |
| Enforceability answer explicit and honest, driver-side and worker-side separately | ✅ Report §6, consolidated again in §9 |
| Follow-ups named; no brief filed (brief step 6) | **⚠️ superseded (loop-mandated artifacts)** — not ✅. Step 6 as written requires *"`git status` shows no new **file** under `ai-agents/tasks/`"*. `0162/plan.md`, `0162/worklog.md` and `0162/review.md` are new files there. They are mandated by the sprint loop and by ADR-020, so the criterion is **superseded by a later obligation**, not met. The half that is met, and is the half the step was protecting: **no new brief was filed** — `git status --porcelain ai-agents/tasks/` shows no added `brief.md`. Report §10 names 8 follow-ups |
| Change surface exactly one new report file (brief step 7) | **⚠️ superseded (loop-mandated artifacts)** — not ✅. Step 7 as written requires one added file under `ai-agents/knowledge-base/reports/` *"and nothing else"*; this folder's `plan.md`/`worklog.md`/`review.md` are also added. Same supersession, disclosed at report `:8-9`. The prohibitions the step actually guards **all hold**: no source, no `SKILL.md`, no agent definition, no test, no ADR, no board row, no brief, no wiki |
| Suite green | ✅ `npm test` → **`tests 560 / pass 560 / fail 0`**; the prove-red hard gate passed — baseline and all 8 unmutated copies green, all 13 mutations red their **named** assertion |

**Two of the report's internal links were verified by `ls` rather than assumed** (`adr-021-…`,
`adr-031-…`, `adr-032-…`, `adr-037-…` filenames). One placeholder glob was caught and replaced with the
real path before finishing.

---

## 5. Residuals and flags — raised, not acted on

- **OQ-4 (timing) — RULED, no longer open.** **Ruling: rank follow-up 1 NOW; drive it this sprint.**

  **Provenance:** the owner, via `AskUserQuestion` in the live `fkit-lead` session, **2026-08-02**,
  answering the question this task surfaced at the end of Process-review round 1. (Recorded per ADR-032
  A2. This worker did not put the question — `AskUserQuestion` is absent in a spawn, ADR-021 — the driver
  relayed it.)

  **The owner's stated reasoning, recorded as relayed:** **R4b weighed as a *confirmed live production
  failure*, not a hypothetical**, against the hazard of editing the loop's step table mid-flight — and
  the change was judged to be **to prose in a step table, not to running code**, so the mid-flight hazard
  is small and the cost of another sprint under the broken carry is not.

  This resolves the question surfaced in report §11, where it was left open with both sides stated and
  **no recommendation offered** — correctly, as a sequencing call the owner holds. It was held, and
  answered.
- **A gap the hook does not close — and it is no longer hypothetical.** The hash pins *which bytes were
  carried*, not *which bytes were approved*. A driver that writes a `plan.md` the owner never approved
  and then carries it faithfully defeats the whole construction, undetected. **⚠️ Upgraded at round 1 to
  a confirmed, dated observation:** this task's own `0162/plan.md` (blob `2458a57e…`) is **not** the
  approved plan — the Build worker authored a re-rendering instead of copying the approved bytes, and two
  distinctive approved strings are absent from it. See review ledger **R4b** and report §9. Follow-up 1
  closes **that route**; it does not close the class. **Still out of `0162`'s scope**, and **not** entered
  as an accepted residual — no owner disposition covers it.
- **Follow-up 4 (ADR-037 §5 correction) is required and unwritten**, per the owner's OQ-3 ruling. Report
  §10 states its content precisely enough to be written from that text alone — **and its text was
  rewritten at round 1 (R1)**: it must say a **carry-fidelity proxy for (b)** is checkable, never that
  **(b)** is. Writing the pre-round-1 wording would have put into ADR-037 exactly the overstated guarantee
  ADR-037 exists to prevent.
- **Follow-up 2's text was also rewritten at round 1** (R2, R3): byte-exact read instead of the `Read`
  tool, an explicit whole-file check, and a mandatory `unverified — no hook checks it until follow-up 3
  lands` marker on the emitted pointer.
- **Follow-up 5 must NOT be filed** — it was conditional on pure by-reference, which the owner rejected.
- **The task's `## Status` was not changed and the folder was not moved.** The close is a producer's
  (ADR-033).
- **Nothing was committed or pushed.**
