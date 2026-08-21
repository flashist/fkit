# Implementation plan — 0218: repair 0177's stale cap and byte figures

## 1. Re-measured figures — measured this run, 2026-08-16

**Command A — `RULES_MAX` read from source:**
```
/usr/bin/grep -n 'RULES_MAX' claude/fkit-claude-init.sh
```
raw output:
```
337:RULES_MAX=4352
358:if [ "$block_size" -gt "$RULES_MAX" ]; then
359:  echo "error: the fkit rules block is ${block_size}B, over the ${RULES_MAX}B cap." >&2
```

**Command B — emitted block by running the real `emit_block()`** (same technique as `test/rules-block-budget.test.js`: sources the script's marker vars, `eval`s the real shell function, counts UTF-8 bytes via `Buffer.byteLength`, not UTF-16 code units). Script written to scratchpad only, nothing in the repo:
```
node /private/tmp/claude-501/-Users-mark-dolbyrev-Workspace-fkit/b844c3f5-db8f-4caa-b026-b4ceea990a80/scratchpad/measure.mjs
```
raw output:
```
RULES_MAX      = 4352
emitted block  = 3837 B
free headroom  = 515 B
source file    = 3433 B
wrapper overhd = 404 B
utilization    = 88%
```

**Command C — corroboration, the live suite:**
```
node --test test/rules-block-budget.test.js
```
raw output (tail): `✔ the emitted rules block stays under RULES_MAX` / `✔ the rules block has not quietly consumed its headroom` / `✔ the live CLAUDE.md carries exactly one well-formed rules block` / `ℹ pass 3 ℹ fail 0`. (Run as a *measurement corroboration* during planning — the repair itself claims no suite result, per 0218 step 7.)

**Have the figures moved since 0218 was filed (2026-08-05)? No.** All three match 0218's table exactly: `RULES_MAX` 4352, emitted 3837 B, free 515 B. The 404 B wrapper figure also re-confirms exactly (3837 − 3433). Nothing to re-baseline.

## 2. State of `0177` — confirmed, no drift

`ai-agents/tasks/backlog/0177-verify-the-codex-half-of-the-comment-stripping-canary/brief.md`, 121 lines, **byte-identical to HEAD** (`git diff --quiet HEAD -- <0177 folder>` → clean). **`0306` did not leave it dirty** — nothing to reconcile against in-flight work.

`/usr/bin/grep -n '4096\|3570\|526\|404\|400'` over it returns exactly 6 hits, and all four stale sites are precisely where 0218 says:

| Line | Text | Verdict |
|---|---|---|
| 22 | ``costs **404 B** of the `RULES_MAX=4096` cap`` | **stale (cap only)** — 404 B stays |
| 24 | "that 404 B also costs *agent context*" | correct, do not touch |
| 80 | "(3570 B emitted, 526 B headroom, ≥400 B standing target) stand" | **stale (2 byte figures)** — ≥400 B stays |
| 94 | "`RULES_MAX` is unchanged at **4096**" | **stale** |
| 98 | "still measures **3570 B** with **526 B** headroom" | **stale** |
| 115 | "standing headroom target **≥400 B**" | correct, do not touch |

Also present and **out of scope**: the standing-trap paragraph at lines 44–52 (contains a quoted `493 B` figure — a historical quote from `0130`'s coder, not a live measurement, **do not touch**), the `2.1.220` / `0.145.0` version stamps, and the codex-canary subject.

## 3. Proposed edits, site by site

Four `Edit` calls on one file. No other file opened for write.

**Site 1 — `## Context`, line 22.**
- from: ``wrapper — HTML comments plus markers — costs **404 B** of the `RULES_MAX=4096` cap.``
- to: ``wrapper — HTML comments plus markers — costs **404 B** of the `RULES_MAX` cap — **4352 B**, re-measured 2026-08-16. (Raised from a superseded 4096 by task `0190`'s owner-signed ADR-016 bump, 2026-08-04; this brief predated it.) **⚠️ Every byte figure below is a snapshot, not an acceptance criterion — re-measure before treating one as a pass/fail.**``

**Site 2 — `## What to build` §4, line 80.**
- from: ``The byte figures established in `0130` (3570 B emitted, 526 B headroom, ≥400 B standing target) stand.``
- to: ``The **≥400 B standing headroom target** from `0130` stands — that is the criterion. The **absolute byte figures are a snapshot, not a criterion**: re-measure them at work time by running the real `emit_block()` (the technique in `test/rules-block-budget.test.js` — run the shell function, count UTF-8 bytes), never by copying a number from this brief. Last measured 2026-08-16: **3837 B emitted, 515 B free**. `0130`'s originals are superseded — task `0190`'s owner-signed cap bump moved them.``

**Site 3 — `## Verification steps` §4, line 94.**
- from: ``` `RULES_MAX` is unchanged at **4096**; the cap still measures the **emitted** block.```
- to: ``` `RULES_MAX` is **unchanged by this task** — read the live value from `claude/fkit-claude-init.sh` before and after and confirm they match; do not assume a number (it was **4352** on 2026-08-16, after `0190`'s owner-signed bump). The cap still measures the **emitted** block.```

**Site 4 — `## Verification steps` §6, line 98.**
- from: ``**Byte budget unmoved:** the emitted block still measures **3570 B** with **526 B** headroom (or, if it has legitimately changed since `0130` closed, the new figure is re-measured and reported rather than assumed).``
- to: ``**Byte budget unmoved:** re-measure the emitted block at work time — run the real `emit_block()` (technique: `test/rules-block-budget.test.js`; run the shell function, count UTF-8 bytes) and report the raw output. The criterion is that **this task did not move it**: same figure before and after, free headroom still **≥ 400 B**. Do not compare against any figure printed in this brief — the cap moves when the owner signs a bump. Last measured 2026-08-16: **3837 B** emitted, **515 B** free, `RULES_MAX=4352`.``

**Design note on step 4 of 0218 ("say the numbers are a snapshot"):** re-measure is now the *primary* verb at all four sites (sites 1 and 2 say it as a standing warning, sites 3 and 4 as the instruction itself), with the live figure demoted to a dated parenthetical. That is what stops a third falsification at the next bump.

**How the do-not-touch list is protected:**
- **404 B** — site 1's replacement keeps the token verbatim; line 24's second `404 B` is not in any edit's `old_string`.
- **≥400 B / 400 B** — site 2 keeps it and *promotes* it to "that is the criterion"; line 115 is untouched.
- **Standing trap paragraph (lines 44–52, incl. the `493 B` quote)** — no edit's `old_string` intersects it.
- **Scope/owner/status/priority** — no edit touches the title, `## ID`, `## Sprint`, `## Priority` (`Sprint 6 P4`), `## Status` (`🔲 Backlog`), or `## Owner` (`fkit-coder`). `0177` stays open and Backlog.
- Each `old_string` is a unique full-line span, so no accidental `replace_all` blast radius.

**Residual `4096` mentions after the repair: exactly one** (site 1, explicitly labelled "superseded … raised by `0190`"). **`3570` and `526`: zero.** I chose zero restatement of the old byte figures deliberately — a labelled-historical number is still a number a hurried reader can lift.

## 4. Verification, mapped to 0218's 7 steps

| 0218 step | How it is discharged |
|---|---|
| **1. All three figures measured this run** | Worklog reproduces Commands A/B above verbatim with their raw output. Re-run at repair time, not copied from this plan. |
| **2. `git diff` touches exactly one file** | Tree is dirty with unrelated work, so prove it path-scoped, not globally: `git status --porcelain > /tmp/…/before.txt` before the edit; after, `git diff --name-only -- ai-agents/tasks/backlog/0177-verify-the-codex-half-of-the-comment-stripping-canary/` must print exactly `…/0177-…/brief.md`; and `diff <(git status --porcelain) /tmp/…/before.txt` must show exactly one added line, that same path. Separately assert `git diff --name-only -- claude/ test/ ai-agents/sprints/` is **empty of new entries** vs. the before-snapshot. |
| **3. Every `4096`/`3570`/`526` gone or labelled superseded** | `/usr/bin/grep -n '4096\|3570\|526' <0177 brief>` → expect exactly **1 hit**, line ~22, with "superseded" and "`0190`" in the same sentence. Every hit accounted for in the worklog. |
| **4. `404` and `≥400`/`400 B` still present, uncorrected** | `/usr/bin/grep -n '404\|400 B\|≥400' <0177 brief>` → expect the same 4 semantic occurrences as today (lines 22, 24, 80, 115), with the site-80 one now reading as the criterion. Cross-check with `git diff -U0 --word-diff` that no `404`/`400` token appears as a removal. |
| **5. Scope byte-identical except where a stale figure sat** | `git diff -- <0177 brief>` must show **exactly 4 hunks**. Explicitly confirm the diff contains **no** change to the title line, `## Owner`, `## Status`, `## Priority`, the codex-canary subject (lines 26–29, 61, 88), or the trap paragraph (44–52) — verified by `git diff -U0` line numbers falling only in {22, 80, 94, 98}. |
| **6. Repaired brief internally consistent** | Read the repaired steps 4 and 6 back-to-back and confirm neither asks a worker to reproduce a fixed number: both now instruct *read/measure the live value and confirm this task didn't move it*. State that verdict in the worklog. |
| **7. No test run claimed** | The repair worklog reports **no suite run** for the repair. The `node --test test/rules-block-budget.test.js` run above is disclosed as a *planning-time measurement corroboration*, dated, and explicitly not offered as the task's suite result. |

**Plus (0218 `## Notes`):** no commit — change stays in the working tree.

## 5. Handover shape for the build spawn

One file, four `Edit` calls, no `Write`, no `Bash` mutation, no board edit. Estimated diff: ~4 lines removed, ~4 replaced (multi-line after wrapping). Worklog goes in `0218`'s task folder per existing convention; `0218` stays `🔄 In progress` until the close spawn.

**Drift noted, not acted on:** `0218`'s `## Notes` says it was "Filed on the **Backlog board**", but its `## Sprint` reads `Sprint 6` and `## Priority` reads `Sprint 6 P3` — a later scoping pass moved it in and did not update the note. Cosmetic, out of this task's scope; flagging so it isn't read as a board inconsistency.

## Open questions returned with the plan

1. Site 1 keeps ONE labelled-historical mention of the superseded `4096` (so a reader diffing against `0130` sees why the number moved), and zero mentions of `3570`/`526`. My recommendation. The alternative is zero mentions of all three — maximally safe against a hurried lift, but it drops the audit trail to `0190`. Confirm the one-mention version, or say strip it. Non-blocking: I will proceed with one labelled mention absent a ruling.
2. `0218` says it blocks `0220` as well as `0177`. I did not read `0220` in this step — if `0220` pins the same figures from a different file, it may need its own repair rather than inheriting this one. Want that checked before or after this repair ships?

---

## Owner approval record (driver-appended, 2026-08-16)

Approved by the owner via `AskUserQuestion` in the live `fkit lead` session driving `/fkit-sprint-ship-loop`, 2026-08-16. Verbatim option labels:

- Plan: **"Approve (Recommended)"**.
- Open question 1 (the labelled-historical `4096`): **"Keep the one labelled mention (Recommended)"** — the plan's own recommendation STANDS. One labelled-superseded `4096` at site 1; zero mentions of `3570`/`526`.
- Open question 2 (`0220`): **"Check 0220 after 0218 ships (Recommended)"** — ⛔ do NOT widen this repair to `0220`, and do not read it as part of this task. Once `0218` closes, the driver routes a producer to read `0220` and file a follow-up if it pins the same figures.

This task is driven by a **producer** worker rather than a coder because its `## Owner` field names `fkit-producer`; the owner ruled on 2026-08-15/16, verbatim option label **"Spawn the brief's Owner role (Recommended)"**, that this loop's Plan/Build workers are the role the brief's `## Owner` names.

Transport note: the plan text above was returned by the plan worker through a task-notification channel that HTML-escapes `<`, `>` and `&`; the driver restored those characters (`&gt;` → `>`, `&amp;` → `&`, `&lt;` → `<`) when copying. No other transformation was applied.
