# Worklog — 0218: repair 0177's stale cap and byte figures

**Worked by:** a spawned `fkit-producer` build worker, driven by `/fkit-sprint-ship-loop` in a live
`fkit lead` session. **No owner channel** — every judgment call is recorded in the decision log below.

**Date of work:** 2026-08-16.

**Plan:** `ai-agents/tasks/done/0218-repair-0177s-stale-cap-and-byte-figures/plan.md`, approved by
the owner via `AskUserQuestion` in that session, 2026-08-16, verbatim option label
**"Approve (Recommended)"**. Open questions were ruled on in the same round — OQ1 (labelled-historical
`4096`): **"Keep the one labelled mention (Recommended)"**; OQ2 (`0220`): **"Check 0220 after 0218
ships (Recommended)"**, so `0220` was **not** read and **not** widened into.

---

## 1. What I did

Four `Edit` calls on one file:
`ai-agents/tasks/backlog/0177-verify-the-codex-half-of-the-comment-stripping-canary/brief.md`.

| Site | Section | HEAD line(s) | Change |
|---|---|---|---|
| 1 | `## Context` | 22 | `RULES_MAX=4096` → live `RULES_MAX` cap **4352 B**, dated, with `0190`'s owner-signed bump named; added a standing "every byte figure below is a snapshot, not an acceptance criterion" warning. **`404 B` kept verbatim.** |
| 2 | `## What to build` §4 | 80–81 | `(3570 B emitted, 526 B headroom, ≥400 B standing target) stand` → the **≥400 B target promoted to "that is the criterion"**; absolute figures demoted to a dated snapshot (**3837 B / 515 B**) with the re-measure technique named. |
| 3 | `## Verification steps` §4 | 94–95 | *"`RULES_MAX` is unchanged at **4096**"* → *"unchanged **by this task** — read the live value before and after and confirm they match; do not assume a number"*, with `4352` as a dated parenthetical. |
| 4 | `## Verification steps` §6 | 98–100 | *"still measures **3570 B** with **526 B** headroom"* → re-measure at work time and report raw output; criterion is *this task did not move it*, free headroom still **≥ 400 B**; figures as a dated parenthetical. |

No `Write` to `0177`, no `Bash` mutation, no other file opened for write. No task file moved, no
`## Status` changed anywhere (0177 stays `🔲 Backlog`; 0218's own status **not changed by this step** —
it already read `🔄 In progress` when this step began, flipped from `🔲 Backlog` by the driver before
the build spawn, and that flip is visible in the working tree), no board file
touched, nothing under `claude/`, `test/`, or `ai-agents/wiki-vault/`. **No commit, no push** — the
change is in the working tree only.

## 2. Figures — re-measured this run, not copied from the plan

0218 verification step 1 and the brief's `## What to build` §1 both require the measurement to be
re-taken at repair time. It was.

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

**Command B — emitted block, by running the real `emit_block()`.** Same technique as
`test/rules-block-budget.test.js`: source the script's marker vars, `eval` the real shell function
out of the script, count **UTF-8 bytes** via `Buffer.byteLength` (not UTF-16 code units). The script
lives in the session scratchpad only — **nothing was written into the repo** for this measurement.
```
node <scratchpad>/measure.mjs
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

**Have the figures moved since the plan was written (2026-08-16) or since 0218 was filed
(2026-08-05)? No.** `RULES_MAX` 4352, emitted 3837 B, free 515 B, wrapper 404 B (3837 − 3433) — all
four re-confirm exactly. **Nothing to re-baseline, and no difference to call out.**

## 3. Verification — 0218's seven steps

### Step 1 — all three live figures measured this run, not copied
**PASS.** Commands A and B above, run this turn, with raw output reproduced. `RULES_MAX` = 4352,
emitted = 3837 B, free headroom = 515 B. The 404 B wrapper figure re-derives as 3837 − 3433.

### Step 2 — `git diff` touches exactly one file
**PASS.** The tree is dirty with unrelated in-flight work, so this is proved path-scoped **and**
against a before-edit snapshot rather than globally.

```
$ git diff --name-only -- ai-agents/tasks/backlog/0177-.../
ai-agents/tasks/backlog/0177-verify-the-codex-half-of-the-comment-stripping-canary/brief.md
```

`git status --porcelain` was captured before the first edit (83 lines) and again after. The delta is
**exactly one added line**:
```
$ diff before.txt after.txt
22a23
>  M ai-agents/tasks/backlog/0177-verify-the-codex-half-of-the-comment-stripping-canary/brief.md
```

`claude/`, `test/`, `ai-agents/sprints/` — the set of modified paths under those three prefixes is
**identical to the before-snapshot**, i.e. this work added none:
```
$ diff <(git diff --name-only -- claude/ test/ ai-agents/sprints/ | sort) before_scoped.txt
(no output — IDENTICAL to before, no new entries)
```
No board file touched. (`worklog.md` in 0218's own folder is a new untracked artifact this task is
required to write; `plan.md` was already there and was **not** re-authored.)

### Step 3 — every `4096` / `3570` / `526` gone or labelled superseded
**PASS — exactly one hit, and it is the labelled one the owner approved.**
```
$ /usr/bin/grep -n '4096\|3570\|526' <0177 brief>
23:re-measured 2026-08-16. (Raised from a superseded 4096 by task `0190`'s owner-signed ADR-016 bump,
```
Every hit accounted for: **1 of 1** — site 1, the word "superseded" and the task `0190` reference in
the same sentence, exactly as owner-ruled under OQ1. **`3570`: zero hits. `526`: zero hits.**

### Step 4 — `404` and `≥400` / `400 B` still present, uncorrected
**PASS.**
```
$ /usr/bin/grep -n '404\|400 B\|≥400' <0177 brief>
22:wrapper — HTML comments plus markers — costs **404 B** of the `RULES_MAX` cap — **4352 B**,
27:**Half of the question of whether that 404 B also costs *agent context* is answered; half is not.**
83:   content edit. The **≥400 B standing headroom target** from `0130` stands — that is the criterion.
110:   free headroom still **≥ 400 B**. Do not compare against any figure printed in this brief — the cap
127:  block; standing headroom target **≥400 B**; cap rationale is **discipline primary** (ADR-016's
```
All four pre-edit occurrences survive, re-numbered by the insertions: HEAD 22 → 22, HEAD 24 → 27,
HEAD 80 → 83, HEAD 115 → 127. Line **110 is a fifth, newly added** occurrence — site 4's replacement
re-states `≥ 400 B` as the criterion, which is the approved plan text, not a correction of an
existing figure.

⚠️ **Disclosed rather than buried:** `git diff --word-diff=porcelain` shows one removal chunk
containing the token — `-526 B headroom, ≥400`. That is **not** a lost `≥400`: the whole sentence at
site 2 was rewritten, and the readable word-diff for that hunk shows `≥400 B` re-added in the same
hunk, promoted to *"**≥400 B standing headroom target** from `0130` stands — that is the criterion"*.
The post-edit grep above is the authority: the token is present. No `404` token appears in any
removal chunk at all.

### Step 5 — `0177`'s scope unchanged except where a stale figure sat
**PASS.** `git diff --stat` on the brief: **1 file changed, 20 insertions(+), 8 deletions(-)**,
in **exactly four hunks**, all at the four intended sites:
```
@@ -22   +22,4  @@
@@ -80,2 +83,6  @@
@@ -94,2 +101,4 @@
@@ -98,3 +107,6 @@
```
HEAD-side lines touched are exactly {22, 80–81, 94–95, 98–100} — the four stale sites and nothing
else. Each protected region was checked for verbatim survival against `git show HEAD:<brief>`:

| Protected region | HEAD lines | Result |
|---|---|---|
| Title | 1 | present verbatim |
| `## ID` (`0177`) | 3–4 | present verbatim |
| `## Sprint` (`Sprint 6`) | 6–7 | present verbatim |
| `## Priority` (`Sprint 6 P4`) | 9–10 | present verbatim |
| `## Status` (`🔲 Backlog`) | 12–13 | present verbatim |
| `## Owner` (`fkit-coder`) | 15–16 | present verbatim |
| Codex-canary subject | 26–30 | present verbatim |
| Standing-trap paragraph | 44–52 | present verbatim |
| `## Notes` (incl. the `≥400 B` inherited ruling) | 105–121 | present verbatim |

The historical `493 B` quote survives untouched (now line 51). The version stamps `2.1.220` and
`0.145.0` all survive (lines 29, 32, 64, 95). File grew 121 → 133 lines. `0177` remains **open and
`🔲 Backlog`**.

### Step 6 — repaired brief internally consistent
**PASS.** Repaired verification steps 4 and 6 read back-to-back: step 4 now says `RULES_MAX` is
*"unchanged **by this task** — read the live value from `claude/fkit-claude-init.sh` before and after
and confirm they match; do not assume a number"*; step 6 now says *"re-measure the emitted block at
work time … The criterion is that **this task did not move it**: same figure before and after, free
headroom still **≥ 400 B**. Do not compare against any figure printed in this brief."* **Neither step
asks a worker to reproduce a fixed number any more** — both instruct measure-live-and-confirm-no-drift,
with the 2026-08-16 figures demoted to a dated parenthetical. Verdict: internally consistent, and no
longer an instruction to revert `0190`.

⚠️ **Known residual, out of this task's scope:** `0177`'s verification step 5 still demands
*"`node --test test/*.test.js` and `bash test/prove-red.sh` both pass"*. That is `0177`'s own
criterion for `0177`'s work and was untouched here by design — flagged only so it is not read as
something this repair silently left inconsistent.

### Step 7 — no test run required, and none claimed
**PASS. This repair ran no test suite and claims no suite result.** It changed no code.

Disclosure, so nothing is over-claimed: the `node <scratchpad>/measure.mjs` run in §2 is a
**measurement**, not a suite. `node --test test/rules-block-budget.test.js` was **not** run during
this build step at all; the plan records one such run as a **planning-time measurement corroboration**
on 2026-08-16, and that run is likewise **not** offered as this task's suite result.

**Plus (0218 `## Notes`): no commit.** Nothing staged, nothing committed, nothing pushed.

## 4. Decision log

**Obvious-winner calls made without an owner channel: none.** Both open questions the plan surfaced
were ruled on by the owner before this step began (OQ1 keep-one-labelled-mention; OQ2 do-not-widen-to-`0220`),
and both rulings were followed exactly. No new judgment call arose during implementation — the four
`old_string` spans were unique and matched on first attempt, and the file was byte-identical to HEAD
when the work started, so there was nothing to reconcile against in-flight work.

Two items **noted and deliberately not acted on**:

1. **`0220` was not read.** Owner ruling OQ2 defers it to after `0218` ships. It stays `0218`'s
   recorded `## Blocks` entry and is the driver's follow-up, not this step's.
2. **Cosmetic drift inside `0218` itself** (carried forward from the plan, still unacted): `0218`'s
   `## Notes` says it was *"Filed on the **Backlog board**"*, while its `## Sprint` reads `Sprint 6`
   and `## Priority` reads `Sprint 6 P3` — a later scoping pass moved it in and did not update the
   note. Out of scope; flagged so it is not read as a board inconsistency. Editing it would have meant
   changing a field this step was told not to touch.

---

## 5. Review round 1 — response step (2026-08-16)

Worked by a spawned `fkit-producer` worker under `/fkit-sprint-ship-loop`, applying the
`fkit-process-stateful-review` **method** over
`ai-agents/tasks/backlog/0218-repair-0177s-stale-cap-and-byte-figures/review.md`. **No owner channel.**
The owner had already ruled on all four dispositions in the live `fkit lead` session via
`AskUserQuestion`, verbatim option labels **"Repair all three now (Recommended)"** (R1+R2+R3) and
**"Correct the clause (Recommended)"** (R4). Each finding was re-verified against the files before
acting — none was applied on the reviewer's word alone. Full verdicts and evidence are in `review.md`'s
`## Coder response` section.

**Files written in this step:** `0177`'s `brief.md` (2 further `Edit` calls) and this worklog.
`review.md`'s `## Coder response` section. Nothing else.

### Decision log — response step

| # | Answers | What changed | Why it qualified |
|---|---|---|---|
| D1 | R1 + R2 (one edit cures both) | `0177` brief, `## Context` warning: scope changed from *"Every byte figure **below**"* to *"Every **absolute** byte figure **in this brief** — the cap figure in this very sentence included"*, and the **≥400 B standing headroom target named as the one exception** ("an owner-set criterion, not a snapshot"). | Owner-ruled repair, applied verbatim to intent. R1's two sanctioned remedies (scope to absolute figures / except ≥400 B by name) were **both** taken rather than one, because either alone leaves the other reading open. The ≥400 B target itself was **not** weakened — naming it as the exception strengthens it. R2's *"below"* scope defect is cured by the same sentence. |
| D2 | R3 | `0177` brief, verification step 6: *"and report the raw output"* → *"and report the **measured byte count** plus the exact command that produced it — the count, not the emitted block's own text."* | Owner-ruled. The reviewer's suggested wording was adopted with the disambiguating clause made explicit, since `emit_block()`'s literal stdout is the ~3837 B block. |
| D3 | R4 | This worklog §1: *"0218's own status untouched"* → *"0218's own status **not changed by this step** — it already read `🔄 In progress` when this step began, flipped from `🔲 Backlog` by the driver before the build spawn, and that flip is visible in the working tree."* | Owner-ruled wording ("not changed by this step"), plus the reason, so a later auditor seeing the flip in `git diff` is not left to reconcile it. Verified first: `git diff -U0` on `0218`'s brief shows `@@ -13 +13 @@ -🔲 Backlog / +🔄 In progress`. |

**Unattended judgment calls made in this step: one, disclosed.** D1 adds a **new** `≥400 B` occurrence
to the `0177` brief (now line 26). The approved plan's verification step 4 expected the pre-response
occurrence set to be unchanged; the owner's R1 ruling ("except the ≥400 B target **by name**")
necessarily adds one. Owner ruling beats plan text, so the addition was made — recorded here rather than
buried, since it is a deviation from a number the plan pinned. No `404`/`400` token was removed.

**Figure hygiene after this step** — `4096\|3570\|526`: exactly **1** hit (line 23, labelled superseded,
naming `0190`, per owner ruling OQ1); `3570`: **0**; `526`: **0**. Protected regions re-confirmed
verbatim, `0177` `## Status` still `🔲 Backlog`. `git status --porcelain` delta vs. the pre-response
snapshot: **empty**. `0220` neither read nor touched (owner ruling OQ2). **No suite run, none claimed**
(`0218` step 7) — no measurement was re-taken either, because no figure was edited in this step. No
commit, no push.
