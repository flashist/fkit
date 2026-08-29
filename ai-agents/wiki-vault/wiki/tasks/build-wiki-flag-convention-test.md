# Build `test/wiki-flag-convention.test.js` — the wiki flag block is prose only and wholly unenforced

**Source**: `ai-agents/tasks/done/0154-build-wiki-flag-convention-test/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified**
**Sprint/Tag**: Sprint 6 `P21` · ID 0154 · owner `fkit-coder` · two review rounds, 2026-08-28

## Goal

`0125` landed the wiki completion-flag convention in **three `SKILL.md` files as prose only.** ⛔ **Deleting the entire block would turn nothing red.**

Re-verified firsthand: the ADR-018 skill-ownership hook **never opens a `SKILL.md`**; and ⛔ **there is no `readFileSync` of any `SKILL.md` anywhere in the suite** — every occurrence under `test/` is a comment. ⭐ **Named as a residual by both `0125` reviewers independently, by filename.**

⭐ **It also discharges `0125`'s standing finding R3** — that check's `diff && diff && echo UNIFORM` chain **prints `UNIFORM` on an empty extraction.** The owner ruled SUBSUME because *"a real test beats a better one-shot grep"*, ⛔ **so until this landed R3 was an open residual with nothing behind it but an uncommitted one-off harness.**

### ⭐⭐ The near-miss that is the argument for the test

As first written, `0125`'s check anchored on `/The wiki \*\*closes nothing/` while the block's actual text is `**The wiki closes nothing` — **the `**` on the other side.** ⛔ **The anchor matched ZERO lines, so the check compared three empty files and printed `UNIFORM`.** *"It was caught at build time by chance. That is the failure mode a committed, fail-closed test removes."*

### ⭐⭐ And then the same failure happened again, to the triage of this very brief

A 2026-08-14 backlog triage classified this row **STALE-PREMISE** on two claims, ⛔ **and both were FALSE on re-measurement.** The worse one held that pinning the rule *"would pin the WRONG rule under ADR-033"* — ⛔ *"that claim would make this task harmful to build as written."*

- **The clause is NOT gone.** It survives verbatim in all three files. ⭐⭐ **The triage's `grep -c` returned `0` because the phrase WRAPS ACROSS A LINE BREAK and the continuation is indented.** ⚠️ **Joining lines with `tr` is also not enough** — the indent stays as internal whitespace and two files still return 0. ⭐ **Only a whitespace-normalizing match finds it.** ⛔ **So the test MUST be wrap-tolerant, or the guard reproduces the exact false negative that produced this correction.**
- **The rule is NOT reversed.** ⭐ **The clause does not say "the producer must not close"; it says the WIKI must not spawn the producer to close on its own initiative.** ADR-033 has the *ship-loops* do that — **the driver's act.** ⛔ *"Two different actors, one rule, no contradiction"* — and a run acting on the triage's reading **would have deleted a live rule from three shipped skill files.**

⭐ *"This is not a footnote — it is the argument for this very task, arriving unprompted."*

## Key Changes

`test/wiki-flag-convention.test.js`, **new**, plus `test/prove-red.sh` step `0m` and **mutations 27–28** (a `FKIT_WIKI_FLAG_ROOT` seam so the mutants run against a copied tree). Suite → **792/792**, gate **28/28**.

The test asserts five subjects and that the three copies are **uniform**; `extractBlock()` bounds the block by anchors with a minimum-line floor. ⭐ **Every constant was re-derived from disk, never from the plan text** — the brief insisted, because `0173` had rewritten the block after `0153`.

## Outcome

**Two rounds, 11 findings, all CORRECT.** ⭐⭐ **Coverage: `both reviewers measured`** — Codex ran the suite (10/10) **and** a CRLF probe of its own; the Claude reviewer ran the suite plus **seven redirected-corpus controls** through the env seam, each against both the shipped matcher and a replicated weaker one.

### ⭐⭐ Round 1 found the guard had the same hole it was built to close

- **R1 (medium):** ⛔ **`extractBlock()` took the FIRST `BLOCK_END` match anywhere in the file, with no exactly-once check.** Measured: one duplicated closing sentence 32 lines in, plus real drift below it, and **the suite stays green.** Fixed by requiring **exactly one** match for both anchors.
- **R2 (low):** the two flag lines were **described and named as *"byte-identical"* and matched as a SUBSTRING count.** Measured: appending ` (deprecated — use the new form)` after a flag line still passes. Fixed to **whole-line equality modulo leading indent**.
- **R3 (low):** ⛔ **a failure message asserted something MEASURABLY FALSE** — that everything below it is *"trivially true over a thinned or empty set"*. Measured: a thinned corpus reds 7 of 10.
- **R4 (low):** four throw paths were **the only failure messages in the file with no "if this was deliberate, update the anchors" instruction**, and the floor message **asserted a single cause**.
- **R5 (low):** a prove-red step's stated justification was **false for that step itself** — it cannot distinguish *honoured* from *ignored*, because it reads a green tree either way. ⭐ Fixed by saying so plainly and keeping the step for its other reason.
- **R6 (low):** mutation 27 lacked the **exactly-one-site guard** its three siblings each carry.
- **R7 (frontier, residual):** ⭐ **T1–T5 match anywhere in the FILE, not inside the extracted block** — so moving four of the five subjects out of the block *identically in all three files* keeps everything green.

### ⭐⭐ Round 2 — three of four findings were fix-induced neighbours of round 1's fixes

- **R8:** ⛔ **the new R1 fixture's own comment was measurably false of that fixture** — the duplicate END was spliced where the truncation fell **below** the line floor, so another gate would have caught it. ⭐ **Fixed in the FIXTURE, not just the comment**: the duplicate now lands at the last body line, so truncation sits exactly **at** the floor and the exactly-once gate is the only thing that can catch it.
- **R9:** ⭐ **the over-pin R4 had just corrected on one message, reintroduced on R1's NEW throw** — it stated truncation as the only consequence. Fixed to name all three topologies.
- **R11:** ⛔ **R6's new guard counted NATURAL PROSE**, where the three guards it was modelled on count a **unique injected marker**. Fixed to inject a marker.
- **R10 (behavioural regression, residual):** ⛔ **R2's fix broke the suite on a CRLF checkout** — every line keeps a trailing `\r` and both raw assertions find **0**. Owner-ruled *"Not supported — accept as residual"*, ⭐ **and the header's claim *"It passes in a fresh clone"* was CORRECTED rather than left standing.**

### Accepted residuals

- **R7/R1-residual** — file-level matchers, not block-scoped. ⭐ **Structural reason: one of the five subjects deliberately lives OUTSIDE the block**, so a block-scoped matcher could not express it without a second mechanism. Tightening would be **a change to the ruled scope of the deliverable, not a repair of it.** ⭐ **The file states this limit about itself in its own header.** Re-raise only if a subject is found to have migrated out of the block.
- **R10** — CRLF checkouts unsupported, matcher deliberately unchanged, the header's claim corrected.
- ⛔ **Two owner-ruled follow-ups remain the PRODUCER's to file** — the `0125` R3 discharge note (its gate now satisfied) and a pre-existing prove-red wording fix.

## Related
- [[tasks/wiki-skills-flag-ready-to-close]] — `0125`, whose prose-only convention this finally enforces and whose R3 it discharges
- [[tasks/wiki-flag-carries-folder-id-and-brief-path]] — `0153`, and the later `0173` rewrite the constants had to be re-derived past
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — the rule the flag block states, and which the triage misread
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook that never opens a `SKILL.md`
- [[systems/testing-and-verification]] — prove-red, now at 28 mutations
- [[systems/knowledge-base-structure]] — the wiki completion-flag convention itself
- [[tasks/sprint-6-repair-the-record-the-board-rests-on]] — the board this ran on
- [[tasks/add-adr-037s-driver-side-clause-to-the-sprint-ship-loops-hard-rules]] — *added 2026-08-29 (lint):* `0191`, whose *"no test reads a `SKILL.md` body"* line this task made false **as an unqualified claim** — ⛔ **and no truer for that file**: this test's three-file list is hard-coded on purpose, with no `SKILL.md` walk
