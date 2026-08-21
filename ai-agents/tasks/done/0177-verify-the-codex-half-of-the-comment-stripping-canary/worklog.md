# Worklog — task 0177, verify the codex half of the comment-stripping canary

Build step, 2026-08-16. Executed the plan in `plan.md` (blob `1073a66d`) as amended by its dated
correction. No commit. No task file moved. No `## Status` changed. `ai-agents/wiki-vault/` untouched.

---

## 1. Finding

**`codex-cli 0.145.0` does NOT strip HTML comments from `AGENTS.md`.** The fkit marker lines and the
`fkit-managed:` wrapper comment reach the model verbatim inside the `AGENTS.md` payload. This is the
brief's outcome **#2 — "codex does not strip"**: the conservative assumption was right, and it is no
longer an assumption.

Consequence for the budget: the wrapper is **free on the Claude side** (comments stripped from
`CLAUDE.md`, re-run first-hand 2026-08-01 on Claude Code 2.1.220, restated from task 0130) and
**paid in full on the codex side**. Both are harness-specific (ADR-016) and must be re-measured when
either build moves.

Not inconclusive: two independent lines agreed, 3/3 behavioral reps were consistent, and every
control held.

### Version stamps

| Harness | Version | Measured |
|---|---|---|
| codex | `codex-cli 0.145.0` | **2026-08-16, this task, first-hand** |
| Claude Code | `2.1.220` | 2026-08-01, task 0130 — **restated, not re-run here** |

⚠️ The Claude-side figure is **carried forward from 0130, not re-measured by this task.** Only the
codex half was under test.

---

## 2. Byte table — measured before AND after the edits

Measured with the repo's **own** `emittedBlockSize()` from `test/rules-block-budget.test.js`,
extracted from the file programmatically at runtime (`scratchpad/measure.mjs` reads the function text
out of the test source and evaluates it) — **not** hand-transcribed. Hand-transcribing that extractor
is the documented way to get this wrong.

| Quantity | BEFORE | AFTER | Plan §1 claimed | Verdict |
|---|---|---|---|---|
| Emitted block | **3837 B** | **3837 B** | 3840 B | plan §1 wrong, correction right |
| `RULES_MAX` | 4352 | 4352 | 4352 | agreed |
| Free headroom | **515 B** | **515 B** | 512 B | plan §1 wrong, correction right |
| Source `universal-rules.md` | 3433 B | 3433 B | 3433 B | agreed |
| Wrapper (markers + comment) | **404 B** | **404 B** | 407 B | plan §1 wrong, correction right |
| — of which markers | 50 B | 50 B | — | |
| — of which comment | **354 B** | **354 B** | 357 B | plan §1 wrong, correction right |
| Utilization | 88 % | 88 % | 88 % | agreed |

**≥400 B standing headroom target (owner ruling, task 0130): MET at 515 B**, clearing by 115 B.

The emitted block is **byte-identical** before and after — `cmp` on the two captures exits 0. The
edits are comment-only and sit *outside* `emit_block()`, above `RULES_MAX=4352`, so nothing this task
touched can move the block.

### The dated correction is independently confirmed

The plan's §1 figures (`3840 / 512 / 407`) are refuted, and its "0130 recorded 404 in error"
paragraph is **false in every part**. Five paths agree on 3837/515/404:

| # | Path | Result |
|---|---|---|
| 1 | Repo's own `emittedBlockSize()`, extracted from the test at runtime | 3837 B |
| 2 | Real `emit_block \| wc -c` (the shipping guard's own path) | 3837 B |
| 3 | Redirect-to-file variant (rules out pipe/redirect asymmetry) | 3837 B |
| 4 | Live block in `CLAUDE.md` by marker range — no `emit_block` involved | 3837 B |
| 5 | Live block in `AGENTS.md` by marker range — no `emit_block` involved | 3837 B |
| 6 | Wrapper alone, against an **empty** source file, at HEAD | **404 B** |
| 7 | Wrapper alone, against an empty source, at `eb68c58` (0130's own commit) | **404 B** |
| 8 | `printf` of the two marker lines alone | **50 B** |

Path 7 settles the inheritance question directly: **the wrapper was 404 B at 0130's own compression
commit.** 0130's recorded `404 B / 354 B` was right; 0218's repair to 0177's brief was right; 0190's
records were right.

⚠️ **I reproduced the escaping fault myself, by accident.** My first attempt at paths 2 and 6 was an
inline `bash -c` with nested quoting; the `{` in `/^emit_block() {/` was eaten by a lost level of
escaping and `sed` failed outright (`invalid command code`), printing `0`. I re-ran both from a
**script file** (`canary`-adjacent `emit.sh`) instead of an inline string, and they agreed at once.
That is first-hand evidence for the correction's diagnosis of the mechanism — a lost level of shell
escaping in exactly that `sed` — though my failure was noisier than the silent `+3 B` one it
describes. The correction's own honesty bound still applies: it is confirmed by reproduction, not by
inspecting the command the plan's author actually ran.

---

## 3. Canary — the behavioral line through the real `codex exec` path

Script: `canary.sh`, in this folder (**not** in `test/` — owner ruling Q3; a codex-shelling test would
be network-, auth- and account-dependent and would fail for any contributor without codex
credentials).

Ran in a throwaway `git init` repo **outside the fkit checkout**. `canary.sh` carries a structural
guard that refuses to run inside the fkit repo; the guard was self-tested first and correctly refused:

```
$ FKIT_REPO=/Users/mark.dolbyrev/Workspace/fkit bash canary.sh /Users/mark.dolbyrev/Workspace/fkit/nope 1
REFUSING: /Users/mark.dolbyrev/Workspace/fkit/nope is inside the fkit checkout
          (/Users/mark.dolbyrev/Workspace/fkit). This script writes AGENTS.md.
guard exit: 2
```

### The scratch `AGENTS.md`

```
# Canary project

Scratch project. Nothing here is real work.

Plain-prose token: CANARY-PLAIN-d1b095165b376638

<!-- canary-managed: this comment block mimics the shape of the fkit-managed rules wrapper,
     which is a multi-line HTML comment sitting between two marker lines.
     Comment token: CANARY-COMMENT-d1b095165b376638 -->

End of file.
```

Three tokens, three jobs:

- `CANARY-PLAIN-…` in prose — **positive control**: proves `AGENTS.md` was loaded at all.
- `CANARY-COMMENT-…` inside `<!-- … -->` — **the test**.
- `CANARY-ABSENT-…` present nowhere in the file — **negative control** against confabulation.

### Command

```
codex exec --ephemeral -s read-only --skip-git-repo-check -C <scratch> --json "<prompt>"
```

Prompt (verbatim):

```
Do not run any command. Do not read any file. Do not use any tool. Answer only from the
instructions already present in your context.
1. List every token matching CANARY-* that appears in your INSTRUCTIONS (ignore any token
appearing in this message itself). If there are none, write NONE.
2. Does the exact token CANARY-ABSENT-d1b095165b376638 appear in your instructions? Answer YES or NO.
Reply with only those two answers, nothing else.
```

### Transcripts — 3/3 identical

Each rep, verbatim agent message:

```
############ REP 1 ############
exit: 0
--- agent message(s) ---
CANARY-PLAIN-d1b095165b376638, CANARY-COMMENT-d1b095165b376638
NO
--- end agent message(s) ---
--- CONFOUND CHECK: did any shell command execute? ---
no command-execution event found — rep is admissible
--- event types seen ---
   1 "type":"agent_message"
   1 "type":"item.completed"
   1 "type":"thread.started"
   1 "type":"turn.completed"
   1 "type":"turn.started"
```

Reps 2 and 3 were **byte-identical to rep 1** in agent message, confound check, and event-type
census.

### Read-out against the plan's table

| Control | Expected if "does not strip" | Observed, 3/3 |
|---|---|---|
| Plain token | seen | **seen** |
| Comment token | seen | **seen** |
| Absent token | not seen | **NO** (not seen) |
| Extra `CANARY-*` tokens | none | **none** — reported set is exactly the two planted |

⇒ **"does not strip"**, unanimously. No rep was void.

### The `cat AGENTS.md` confound — actively excluded

A model that runs `cat AGENTS.md` produces output *identical* to one that received the comment in
context. All three required mitigations were in force, and the third is the decisive one:

1. `-s read-only` sandbox.
2. Explicit "do not run any command / do not read any file / do not use any tool" instruction.
3. **`--json` event-stream verification.** The full event census per rep is
   `thread.started`, `turn.started`, `agent_message`, `item.completed`, `turn.completed` — and
   **nothing else**. There is no command-execution event of any kind. The model answered without
   touching the filesystem.

### Nested-`AGENTS.md` leakage — checked, none

- `~/.codex/AGENTS.md` exists but is **0 bytes** — no content to leak.
- `~/AGENTS.md` and `~/.codex/instructions.md` are absent.
- The scratch dir is a fresh `git init` at its own root, so codex's CWD-upward discovery stops there.
- The prompt-input dump was inspected for extra payloads: `AGENTS.md` appears 3 times, but
  occurrences 1 and 2 are mentions inside codex's **own base instructions** ("applicable `AGENTS.md`
  instructions…"), not payloads. **Exactly one** `# AGENTS.md instructions for <dir>` payload is
  present, and it is the canary's.

---

## 4. Direct observation — `codex debug prompt-input`

`codex debug prompt-input` renders the model-visible prompt input list as JSON **with no model call**,
so there is no sampling noise and no compliance question. It writes nothing.

### Against the scratch canary repo

Token occurrence counts in the model-visible prompt:

```
CANARY-PLAIN       1
CANARY-COMMENT     1
CANARY-ABSENT      0
canary-managed     1
```

The comment arrives in place, inside the `<INSTRUCTIONS>` envelope — not echoed from a file listing:

```
"text": "# AGENTS.md instructions for <scratch>/canary-work\n\n<INSTRUCTIONS>\n# Canary project\n\n
Scratch project. Nothing here is real work.\n\nPlain-prose token: CANARY-PLAIN-d1b095165b376638\n\n
<!-- canary-managed: this comment block mimics the shape of the fkit-managed rules wrapper,\n
     which is a multi-line HTML comment sitting between two marker lines.\n
     Comment token: CANARY-COMMENT-d1b095165b376638 -->\n\nEnd of file.\n\n</INSTRUCTIONS>"
```

### Against the REAL fkit repo — the actual comment under test

This is the load-bearing observation: it is fkit's own wrapper, not a mock of it. Run read-only from
the repo root (`prompt-input` makes no model call and writes no file; `git status` on `AGENTS.md`,
`CLAUDE.md` and both edit targets was **clean** immediately after).

| String | in `AGENTS.md` | in model-visible prompt |
|---|---|---|
| `fkit:begin-rules` | 1 | **1** |
| `fkit:end-rules` | 1 | **1** |
| `fkit-managed:` | 1 | **1** |
| `REPLACED on every` | 1 | **1** |
| `Universal hard rules` | 1 | **1** |
| `Never commit or push unless` | 1 | **1** |

In place, inside the payload:

```
…lives in\n[`ai-agents/knowledge-base/PROJECT.md`](ai-agents/knowledge-base/PROJECT.md).\n\n
<!-- fkit:begin-rules -->\n
<!-- fkit-managed: this block is REPLACED on every `fkit` launch. Edits inside the markers\n
     are overwritten. Put your own standing instructions OUTSIDE them — everything outside\n
     is yours and fkit never touches it. A marker is recognized only alone on its line, so a\n
     bare marker line inside a code fence still reads as a real marker. -->\n\n
## Universal hard rules (every role, every session)\n\n
- **Never commit or push unless the owner explicitly asks.** …
```

⚠️ **Residual weakness of this line, recorded rather than papered over.** `prompt-input` is a debug
renderer. That it shares the assembly path with `codex exec` is overwhelmingly likely but is an
*inference*, not an observation. That is exactly why the behavioral canary in §3 exists — it runs the
real `codex exec` path. The two lines cover each other's weakness; **neither is claimed as sufficient
alone.**

---

## 5. Things that would only LOOK like evidence — and were excluded

- **Asking codex whether it strips comments** — a model's claim about its own harness is not an
  observation of the harness. Not done.
- **Codex docs / release notes / 0130's architect consult** — excluded by the brief; the consult is
  the thing under test. Not consulted.
- **A single non-mention of the token** — indistinguishable from non-compliance. Hence 3 reps plus a
  positive control.
- **`strings` on the codex binary** — not run by this build step. Absence in a strings dump is not
  evidence of absence, so it could not have carried the finding either way.
- **A rep where any tool call fired** — would have been void. None fired.

---

## 6. Files changed — two, comments only

Not touched: `RULES_MAX`, `emit_block()`, `claude/scaffold/universal-rules.md`, `CLAUDE.md`,
`AGENTS.md`, and every assertion and threshold in the test.

Verified mechanically: every changed line in the path-scoped diff begins with `#` or `//`.

```
$ git diff --stat -- claude/fkit-claude-init.sh test/rules-block-budget.test.js
 claude/fkit-claude-init.sh      | 12 ++++++++----
 test/rules-block-budget.test.js | 13 +++++++++----
 2 files changed, 17 insertions(+), 8 deletions(-)
```

`fkit-claude-init.sh` was **not** re-run, and did not need to be: both edits sit above `RULES_MAX=4352`
and outside `emit_block()`, so the emitted block is provably unchanged and `CLAUDE.md` / `AGENTS.md`
stay clean. Neither file appears in `claude/structure-manifest.tsv`, so these edits cannot stale the
manifest.

### 6a. `claude/fkit-claude-init.sh` — the codex-side verdict

```diff
-# UNVERIFIED: the codex side (AGENTS.md, codex-cli 0.145.0) was not re-measured here; assume it
-# still pays.
+# MEASURED, codex side (task 0177, 2026-08-16, codex-cli 0.145.0): codex does NOT strip. The markers
+# and this comment reach the model verbatim inside the AGENTS.md payload — observed directly in
+# `codex debug prompt-input`, corroborated by a canary token only a surviving comment could carry.
+# So the wrapper is free on the Claude side and PAID IN FULL on the codex side. Harness-specific
+# (ADR-016): this is a property of these two builds and must be re-measured when either moves.
```

### 6b. `claude/fkit-claude-init.sh` — the `515 B` snapshot, RE-DATED ONLY (owner ruling Q1)

Owner ruling, verbatim option label: **"Leave 515 B; re-date only (Recommended)"**. `515 B` is
correct and was re-verified this session; **no number changed here.**

```diff
-# Standing budget target (owner ruling, task 0130): keep >= 400 B free. 515 B free at time of writing
-# — a snapshot, not a guarantee; test/rules-block-budget.test.js measures the live number.
+# Standing budget target (owner ruling, task 0130): keep >= 400 B free. 515 B free — re-verified
+# 2026-08-16 (task 0177), still a snapshot and not a guarantee; test/rules-block-budget.test.js
+# measures the live number.
```

### 6c. `test/rules-block-budget.test.js` — the codex-side sentence

```diff
-// comment lines did not. The wrapper costs cap budget without costing Claude-side context. The codex
-// side (AGENTS.md, codex-cli 0.145.0) was NOT re-measured; assume it still pays.
+// comment lines did not. The wrapper costs cap budget without costing Claude-side context.
+// The codex side IS now measured (task 0177, 2026-08-16, codex-cli 0.145.0): codex does NOT strip —
+// the wrapper reaches the model verbatim in the AGENTS.md payload, so it costs real context there.
+// The conservative assumption was right; it is no longer an assumption. Both figures are
+// harness-specific (ADR-016) and must be re-measured when either build moves.
```

### 6d. `test/rules-block-budget.test.js` — de-pin the `354 B` figure (owner ruling Q2)

Owner ruling, verbatim option label: **"Drift-proof it, correct rationale (Recommended)"**.

- `354 B` is **correct** and was **not** rewritten to `357 B` — it was **removed** in favour of
  drift-proof phrasing.
- The stated rationale is that a pinned number invites staleness. The "wrong on arrival"
  justification from the plan's Q2 is **false and appears nowhere** — verified by grep across both
  edited files.
- The dated `568 / 443 / 125 / 107` arithmetic that 0130's review round R2 protected is **untouched**
  — verified by grep; all four figures still present, on their original lines.

```diff
-//      printfs emitting 443 B of comment. Today it is six emitting 354 B — task 0130 compressed the
-//      wrapper. Kept at the old values on purpose: 568 − 443 = the 125 B divergence, less the 18 B
+//      printfs emitting 443 B of comment. Task 0130 later compressed the wrapper, so today's printf
+//      count and comment size are both smaller — deliberately NOT pinned here: `emittedBlockSize()`
+//      below measures the live block, and a figure pinned in a comment only invites staleness.
+//      Kept at the old values on purpose: 568 − 443 = the 125 B divergence, less the 18 B
```

### 6e. New files in this task folder

- `worklog.md` (this file).
- `canary.sh` — the reproducible canary, per owner ruling Q3. **Hardened in review round 1** (finding
  R1): the containment guard is now fatal-on-failure at every step instead of skip-on-failure, and
  `rm -rf "$WORK"` is gone in favour of `mktemp -d`, so the script deletes nothing. Two fail-open paths
  were reproduced first-hand before the fix and re-tested after it — 10 cases, all in `review.md`'s
  *Coder response*. ⛔ The script itself was **not executed** at any point in round 1; every test ran
  against a non-destructive transplant of the guard region, cut out with `sed`, containing zero
  references to `codex`.

---

## 7. Test suite — BEFORE and AFTER

Both runs: `node --test test/*.test.js` then `bash test/prove-red.sh`, full output redirected to a
file (a pipe truncates node's summary block) and read from the file.

| Run | `node --test` | `prove-red.sh` |
|---|---|---|
| **BEFORE** (baseline, dirty tree, pre-edit) | **730 pass / 0 fail** / 0 cancelled / 0 skipped, 17 suites, exit 0 | hard gate **PASSED**, exit 0 |
| **AFTER** (post-edit) | **730 pass / 0 fail** / 0 cancelled / 0 skipped, 17 suites, exit 0 | hard gate **PASSED**, exit 0 |

The baseline was mandatory: the tree carries substantial unrelated in-flight work
(`test/structure-check.test.js`, `claude/structure-manifest.tsv`, `claude/structure-spec.md`,
`claude/skills-for-role.sh`, `claude/skill-ownership-hook.sh`, many task briefs). Without it, a
pre-existing red would be misattributed to 0177. As it happens the baseline was **fully green**, so
any AFTER failure would be unambiguously this task's.

### 7a. AFTER run

**Identical to the baseline in every counter: 730 tests, 730 pass, 0 fail, 0 cancelled, 0 skipped,
0 todo, 17 suites, exit 0.** `prove-red.sh`: all 11 setup checks (`0a`–`0k`) green, all 22 mutations
red at their **named** assertion, `✓ hard gate PASSED`, exit 0.

**Delta vs baseline: none.** No test changed state in either direction. The unrelated in-flight work
in the tree was green before these edits and is green after them, so no failure is attributable to
0177 and none is masked by it.

`test/rules-block-budget.test.js` standalone: 3 pass / 0 fail.

### 7b. Review round 1 — suite re-run after the R1 + R4 edits

`npm test` (`node --test test/*.test.js && bash test/prove-red.sh`), full output redirected to a file
and read from the file:

**730 tests / 730 pass / 0 fail / 0 cancelled / 0 skipped / 0 todo, 17 suites**; `prove-red.sh`
`✓ hard gate PASSED` with all 22 mutations red at their named assertion; **exit 0**. Identical to
both the BEFORE baseline and the post-build AFTER run — **delta: none**.
`test/rules-block-budget.test.js` standalone, re-run: **3 pass / 0 fail**.

⛔ **The green suite says NOTHING about the `canary.sh` hardening.** `canary.sh` is in this task
folder, not `test/` (owner ruling Q3), so no test in the suite executes a line of it. The suite's only
relevance to round 1 is that the R4 comment addition broke nothing. The hardening's evidence is the
separate 10-case isolated table in `review.md`, plus `bash -n canary.sh` — and nothing else.

---

## 8. Verification against the brief's seven steps

| Brief step | Status |
|---|---|
| 1. Canary actually run, output quoted | ✅ §3 — 3 verbatim `codex exec` transcripts + §4 two `prompt-input` extracts |
| 2. Exact codex version recorded | ✅ `codex-cli 0.145.0`, matches the brief — no discrepancy. Stamped in the worklog and both comments; Claude-side 2.1.220 / 2026-08-01 restated and flagged as carried-forward |
| 3. Both comment sites updated | ✅ §6a + §6c — neither now reads as an unresolved assumption |
| 4. No functional change | ✅ §6 — path-scoped diff is comment-only, verified mechanically; `RULES_MAX=4352` before and after |
| 5. Suites green | ✅ §7 — compared against the step-0 baseline |
| 6. Byte budget unmoved | ✅ §2 — 3837/515/404 identical before and after; emitted block `cmp`-identical; free ≥ 400 B |
| 7. Trap not walked into | ✅ No change to what the cap measures; no source-capping recommendation folded in. The measured outcome **removes** the trap's pressure — it was the *stripped* result that would have argued for capping the source. "Does not strip" means the wrapper genuinely costs context on the codex side, which strengthens the existing emitted-block semantics rather than challenging it |

---

## 9. Decision log

Decisions taken **without asking**, under the sprint-ship-loop standing approval (ADR-019 discipline
carried by ADR-032): verified `CORRECT`, mechanical/localized, inside the approved plan — or an
obvious winner within the plan's intent.

1. **Negative control strengthened from "ask about an absent token" to "ask about an absent token
   AND require set-equality on the reported `CANARY-*` tokens."**
   *Which finding it answers:* none — it is a method detail of plan §2's canary design.
   *What changed:* the plan's read-out table treats a *seen* absent token as confabulation. Naming
   that token in the prompt makes "seen" ambiguous: the model can see it in **my message** rather
   than in its instructions, so a bare echo would falsely void a good run. I kept the plan's
   question (scoped explicitly to "in your instructions") **and** added the stronger check that the
   reported token set equals exactly the two planted.
   *Why it qualified:* obvious winner within the plan's intent — it preserves the control's purpose
   (catch confabulation) while removing a way the control could misfire. It adds a check, never
   relaxes one. Both checks passed 3/3, so the finding does not depend on which reading is used.

2. **`canary.sh`'s repo guard is structural, not a name match.**
   *Which finding it answers:* none — implementation detail of plan §6's "never touch the real
   `AGENTS.md`".
   *What changed:* the first draft refused any path containing the substring `fkit`. That
   false-positives on the legitimate scratchpad path (which contains `fkit` incidentally) and would
   have blocked the run. Replaced with a real containment test: resolve both paths and refuse if the
   scratch dir is inside the fkit checkout.
   *Why it qualified:* mechanical and localized, in a new file this task adds, and strictly safer —
   the substring test both false-positives and would miss a symlinked path. Self-tested: pointed at
   the real repo, it refuses with exit 2.

3. **The `515 B` re-dating wording.**
   *Which finding it answers:* owner ruling Q1.
   *What changed:* rendered "re-date only, change no number" as `515 B free — re-verified 2026-08-16
   (task 0177), still a snapshot and not a guarantee`.
   *Why it qualified:* mechanical, in-plan, and directly instructed. `515` is unchanged; `512`
   appears nowhere in the file (grep-verified).

4. **The drift-proof phrasing for Q2.**
   *Which finding it answers:* owner ruling Q2.
   *What changed:* removed the pinned `354 B` rather than re-pinning it, stated the correct rationale
   (a pinned figure invites staleness), and left the protected `568 / 443 / 125 / 107` arithmetic
   untouched.
   *Why it qualified:* mechanical, in-plan, directly instructed. Grep-verified: no `354 B`, no `357`,
   no "wrong on arrival", all four protected figures still present.

No frontier-moves. No regressions. Nothing outside the approved plan. Nothing was escalated because
nothing required a judgment call the plan had not already settled.

### 9a. Review round 1 — decisions taken without asking

Same standing approval (ADR-019 discipline carried by ADR-032). Round 1's seven findings were all
verified **CORRECT** first-hand before any edit; the owner's dispositions arrived with the spawn, so
*which* findings to fix was ruled, not decided here. What follows is the judgement exercised **inside**
those dispositions.

5. **`canary.sh` keeps its `<scratch-dir>` argument instead of taking a bare parent directory.**
   *Which finding it answers:* **R1**, the "use `mktemp -d` instead of `rm -rf` on a caller-supplied
   path" half of the owner's disposition.
   *What changed:* the obvious reading of "use `mktemp -d`" is to drop the argument and let `mktemp -d`
   pick a dir in `$TMPDIR`. I kept `<scratch-dir>` as the caller's chosen *name*, required its **parent**
   to exist, and create `<scratch-dir>.XXXXXXXX` under that canonicalized parent.
   *Why it qualified:* obvious winner within the disposition's intent. It satisfies all three
   instructions (canonicalize-or-die, fatal-`FKIT_REPO`, no `rm -rf`) **and** keeps the guard's refusal
   message referring to the path the caller typed — which is what makes §3's recorded self-test still
   true. Verified: `canary.sh <repo>/nope 1` still prints the refusal quoted at §3, byte-for-byte. The
   dropped-argument form would have silently invalidated that record.
   *Cost, stated:* the CLI contract moved. `<scratch-dir>` must now have an existing parent, and the
   dir actually created carries a random suffix. Both are printed by the script's own `scratch dir :`
   banner line.

6. **The R4 pointer cites task `0177` by folder-ID prefix, not by a `tasks/backlog/…` path.**
   *Which finding it answers:* **R4**, under the owner's "Pointer to worklog.md" disposition.
   *What changed:* the pointer added to `test/rules-block-budget.test.js` names the task
   (`0177`, `0177-verify-the-codex-half-of-the-comment-stripping-canary`) and tells the reader to find
   it by that prefix, explicitly because the folder moves `backlog/` → `done/` on close.
   *Why it qualified:* obvious winner — the form is dictated by an existing convention, not chosen.
   `conventions/durable-citation-anchors.md`'s row 4 rules a task's anchor to be "the folder-name
   `NNNN` prefix, always", and its link-label rule bans a mutable location as the visible label of a
   forwarding pointer. A pinned `ai-agents/tasks/backlog/…` path would have been dead the moment this
   task closed — the exact defect several live tasks in this sprint exist to repair.
   *What was NOT done:* no hedge was added to the claim. The claim sentence is byte-unchanged, per the
   owner's ruling and the brief's step 3.

7. **The apostrophe bug in the `${1:?…}` usage message — introduced by me, caught by me, recorded.**
   *Which finding it answers:* none — it is a self-inflicted defect during the R1 fix.
   *What changed:* my first draft of the usage message contained `<scratch-dir>'s parent`. Inside
   `${parameter:?word}` a single quote opens a quoted string **even within the surrounding double
   quotes**, so `bash -n canary.sh` failed with `unexpected EOF while looking for matching '}'` — the
   whole script would not parse. Rewritten without the apostrophe, and the reason is now a comment at
   the site.
   *Why it qualified:* fixing my own syntax error is mechanical and inside the plan. **It is logged
   because it nearly shipped:** the hardened script is not covered by any suite, so nothing but the
   `bash -n` check stood between this and an unrunnable artifact.

⛔ **Nothing was fixed outside the owner's dispositions.** R2, R3, R5, R6 and R7 were verified CORRECT
and deliberately left alone; all five are recorded as accepted residuals in `review.md`. In
particular, `test/rules-block-budget.test.js`'s "84% utilization" was **not** touched — it is a
past-tense account and `88%` would falsify it.

### 9b. Review round 2 — decisions taken without asking

Round 2 answers an owner ruling of 2026-08-16 (verbatim option label: **"Fix both (Recommended)"**)
on a defect an independent re-verify found in round 1's own response: round 1 **claimed a fix it did
not make**. Both items below were applied without asking, under the same standing approval.

⚠️ **Read §9a's item 5 with this section.** Round 1 recorded the R1 hardening as a clean win. It was
not complete, and §9a does not say so — this section is where that is said.

8. **The guard now checks the derived root's IDENTITY, rather than requiring `FKIT_REPO` to be passed
   explicitly.**
   *Which finding it answers:* **R1**, the third variant — script copied into a *different* git repo —
   which round 1's `review.md` asserted was *"closed by the same fix"* and **never re-tested**. It was
   not closed. Reproduced first-hand this round against the round-1 hardened code before any edit:
   `EXIT=0`, `GUARD ALLOWED`, `_r=<scratch>/otherrepo`, `_w=<fkit>/ai-agents/tasks`.
   *What changed:* after the existing non-empty and resolvable checks, the resolved root must contain
   all of `claude/fkit-claude.sh`, `claude/skills-for-role.sh` and
   `ai-agents/knowledge-base/PROJECT.md`, or the script dies. A `_src` variable records whether the
   root was derived or explicitly passed, and the refusal message says which.
   *Why it qualified:* obvious winner within the owner's ruling, which offered the two shapes and left
   the choice here. Dropping the `$0` derivation would make the ordinary in-repo run require an env
   var — and a caller forced to supply a value can supply a wrong one, which protects the wrong tree
   exactly as silently. The identity check keeps the zero-config happy path **and** closes the hole.
   Deliberately applied to explicitly-passed values too (case C8), for that same reason.
   *Root cause, named because it generalizes:* all three round-1 checks tested that the derived root
   was **non-empty and resolvable**. Inside another checkout `git rev-parse --show-toplevel` succeeds,
   so all three pass on the wrong root. **Resolving is not identifying.**
   *Cost, stated:* the guard is now coupled to three fkit path names. Rename one and the canary dies
   naming it — fail-closed, deliberately, rather than reverting to fail-open.
   *Evidence:* the 13-case round-2 table in `review.md`. C4/C4b now **exit 2** (were exit 0); the nine
   round-1 cases are unchanged; C8 is new. Post-condition: nothing deleted, nothing written into the
   checkout. `bash -n canary.sh` clean.

9. **`review.md` is corrected by dated append, not by editing the false sentence out.**
   *Which finding it answers:* the same owner ruling's second half — the ledger must record what was
   actually fixed, visibly corrected.
   *What changed:* three ⚠️ dated correction notes (at the *"A third variant…"* passage, at the
   round-1 AFTER table, at the R1 verdict row), a `- **Corrections:**` header bullet carrying the
   legend, and a complete 13-case round-2 table. Proof of shape: `git diff --no-index --numstat`
   against a pre-edit snapshot → **`71  0`**; `diff | grep '^<'` → **no output**. Nothing was
   overwritten.
   *Why it qualified:* the form was dictated, not chosen — the owner named it, and
   `claude/skills/fkit-record-decision/SKILL.md` fixes the two-marker legend (⚠️ drifted-or-wrong,
   ⛔ overturned), the below-the-claim placement, the dated present-tense wording, and the
   cross-reference rule (one site carries the fact, the others point at it).
   *One judgement inside it, stated:* the ruling said the AFTER table "must stop omitting the case",
   while the correction form forbids writing over recorded text. Resolved by leaving the 10-case table
   byte-identical and adding an adjacent round-2 table that supersedes it as the complete case set —
   the ledger no longer omits the case, and round 1's record stays intact and visibly corrected.
   *Marker choice, stated:* ⚠️ not ⛔ throughout. No decision was overturned — a claim was wrong.
   *What is NOT claimed:* this was not a fact that drifted. It was false when written, and round 1's
   own table could not have caught it, because the case had no row.

⛔ **The lesson worth carrying out of this task:** the third variant was found by the round-1 responder
**itself**, described in prose, and then left out of that same responder's verification table. A
self-found case is the one most likely to escape your own checking, precisely because finding it feels
like handling it. Naming a case in prose is not testing it.

⛔ **Nothing else was touched in round 2.** `claude/fkit-claude-init.sh`, the two shipped comment
claims, `84% utilization`, `515 B`, `354`/`357`, and `568/443/125/107` are all byte-unchanged;
the settled byte figures (3837 / 4352 / 515 / 3433 / 404) were not re-opened. No `## Status` changed,
no task file moved, nothing committed.

### 9c. Ledger-correction pass, 2026-08-16 — documents only, no source change

Run as a bounded LEDGER-CORRECTION step under an owner ruling given live via `AskUserQuestion` in the
driving `fkit lead` session, **verbatim option label: "Fix the miscount, note C9/C10 (Recommended)"**.
Files written: `review.md` and `worklog.md` in this folder, nothing else. No code touched, so
**`npm test` was deliberately not run** — a suite result over an unchanged tree is noise, not evidence.

10. **The round-2 NEW/re-run count is corrected IN PLACE; it is the only in-place edit in this pass.**
    *Which finding it answers:* defect 1 of the ruling — the sentence introducing the round-2 table
    claimed *"The four rows marked **NEW** … the other nine are re-run"*, and both halves were false.
    *Census, re-counted here before editing rather than taken on trust:* the round-2 table has **14**
    body rows = **13** case rows (C1, C2, C3a, C3b, C4, C4b, C5, C6, C7, C8, C9, C10, C11) + **1**
    post-condition row. Of the 13, **3** carry a bolded **NEW** marker (C4, C4b, C8) and **10** read
    `unchanged` in the *vs round 1* column. So the true figures are **3 / 10**, confirming the ruling's
    numbers. The neighbouring **13 cases** figure is therefore correct (3 + 10 = 13) and was left
    untouched.
    *What changed:* exactly one line — `four` → `three`, `nine` → `ten`. Nothing else on that line or
    the next moved.
    *Why in place rather than annotated:* the sentence sits inside round 2's **own newly-appended
    text**, not inside preserved round-1 history, so correcting it rewrites no record. The
    correction-form's no-overwrite rule protects recorded history; it does not require a ledger to keep
    a live false count standing next to a note explaining that the count is false. The in-place edit is
    named in the appended note below the table so no reader has to diff to discover it.

11. **C9/C10's cited scratch dirs are gone; recorded as a dated note, and the rows are NOT rewritten.**
    *Which finding it answers:* defect 2 of the ruling.
    *What changed:* a dated ⚠️ note appended immediately below the round-2 table, in the form encoded
    in `claude/skills/fkit-record-decision/SKILL.md` (⚠️ = a fact that drifted, below-the-claim
    placement, dated and present-tense, corrected text left byte-identical).
    *What it records:* `canarywork.XWu9sQml` and `canarywork.9l3AqfpK` are no longer on disk — their
    parent scratch dir is gone entirely, verified this pass by searching for `canarywork.*` and finding
    none — so the post-condition row's *"both scratch dirs still present"* is no longer checkable by
    inspection. **The run was real and the row was true when written**, confirmed by the round-2
    worker's own transcript (both dirs created; post-condition `scratch dirs surviving: 2`).
    *Classification, stated:* a **reproducibility residual, not a false fix claim** — the guard
    behaviour C9/C10 exercise is independently confirmed by a later verifier's own runs, so no part of
    the fix rests on those directories still existing. That is why the marker is ⚠️ and not ⛔: no
    decision was overturned.
    *Why the rows were left byte-identical:* rewriting them to past tense would replace what was
    observed at run time with a later reader's view of it — the same overwrite the correction form
    exists to prevent. The ruling said so explicitly.

12. **Recorded limitation, no fix: this ledger's append-only discipline cannot be proven against git.**
    *Which finding it answers:* the ruling's third item — record the limitation, file nothing.
    *What changed:* a dated ⚠️ note appended at the end of the round-2 evidence section, above
    *Accepted residuals*.
    *What it records, verified this pass:* `review.md` and `canary.sh` are **untracked at HEAD** —
    `git status` reports both `??` and `git ls-files --error-unmatch` fails on both — so
    `git diff --numstat -- review.md` yields **no baseline at all**, not `+N / −0`, and
    `git diff -U0 … | grep '^-' | grep -v '^---'` prints nothing because it has no input rather than
    because nothing was deleted. Both commands succeed, which is the trap. `worklog.md` and `plan.md`
    are untracked too; only `brief.md` is tracked.
    *What a future round should use instead:* a **pre-edit snapshot** plus `git diff --no-index
    --numstat <snapshot> <file>` and a **normal-format** `diff <snapshot> <file>` reading `<` lines as
    deletions (or an LCS check) — both immune to the `^---` blind spot, where a deleted line whose own
    text starts with `---` renders as `----…` and is filtered away as if it were the diff header.
    *Stated in fairness to round 2:* item 9 above already used the snapshot route
    (`git diff --no-index --numstat` → `71  0`; `diff | grep '^<'` → no output), so **round 2's
    append-only claim stands**. The limitation is about the tracked-file commands the form names as
    primary, which do not apply to these files.
    *Not filed:* the owner has ruled a **separate task** be filed about this; this pass deliberately
    does not file it.

*Append-only proof for this pass* — both files snapshotted before any edit, then compared with
**normal-format** `diff` (immune to the `^---` residual), not with the unified-diff filter.
`review.md` → hunks `181c181`, `199a200,222`, `232a256,280` = **one changed line** (the miscount
sentence, the single sanctioned in-place edit) plus **48 appended**; its only `<` line is the old
miscount sentence. `worklog.md` → **`<` lines: zero** — appended only, nothing changed or deleted.
Figures reproduced in the driver-facing return.

⛔ **Nothing else was touched in this pass.** `canary.sh`, `claude/fkit-claude-init.sh`,
`test/rules-block-budget.test.js`, `brief.md` and `plan.md` are byte-unchanged; the settled byte
figures (3837 / 4352 / 515 / 3433 / 404), the `84% utilization` line, `515 B`, `354`/`357` and
`568/443/125/107` were not re-opened; `canary.sh` was **not executed** (it makes live billed codex
calls). No `## Status` changed, no task file moved, no wiki write, nothing committed.

---

## 10. Residuals

- **`prompt-input` is a debug renderer.** That it shares the assembly path with `codex exec` is an
  inference. Mitigated, not eliminated, by the independent behavioral canary in §3.
- **Claude-side figure is carried forward**, not re-measured here (2026-08-01, Claude Code 2.1.220,
  task 0130). Only the codex half was in scope.
- **Both findings are harness-specific (ADR-016)** and expire when either build moves. Both comment
  sites now say so.
- **The correction's escaping diagnosis is confirmed by reproduction, not by inspecting the plan
  author's actual command** — no artifact of it survives to diff. My own independent reproduction of
  an escaping fault in the same `sed` (§2) supports it but does not close that gap.
- **`n = 3` behavioral reps**, all with a single model on a single day. Consistent, not exhaustive.

Added in review round 1 (all five owner-accepted; see `review.md` for the full dispositions):

- **`canary.sh`'s rep admissibility is still fail-open** (R2) — a rep that failed to run is reported
  "admissible". Did not bite the recorded run; bites any re-run.
- **`canary.sh`'s transcript extractor is still not JSON-safe** (R3) — "verbatim" holds only for
  answers containing no quote or backslash characters. True of the recorded answers, not guaranteed of
  a re-run's.
- **`canary.sh:11`'s negative-control legend is still loose** (R5) — "exists nowhere" means "nowhere
  in `AGENTS.md`"; the token is in the prompt. §3 of this file states it correctly.
- **The 3/3 replication is attested, not auditable** (R6) — reps 2 and 3 have no retained transcript
  and no hash. Closing it costs a fresh billed `codex exec` run.
- ⛔ **`canary.sh` is covered by no test suite at all.** It lives in this task folder by owner ruling
  Q3, so `npm test` exercises none of the round-1 hardening. **A green suite is not evidence about
  this script** — the only evidence is the isolated 10-case table in `review.md`.

Added in review round 2:

- ⛔ **Still no test covers `canary.sh`** (owner ruling Q3 keeps it out of `test/`). The round-1
  residual above says the only evidence is "the isolated 10-case table"; as of 2026-08-16 that is
  superseded by the **13-case round-2 table** in `review.md`. `npm test` remains **silent** about the
  guard — a green suite is not evidence about this script.
- **The identity check is a marker-file check, not a proof of provenance.** A directory that happens
  to contain `claude/fkit-claude.sh`, `claude/skills-for-role.sh` and
  `ai-agents/knowledge-base/PROJECT.md` would satisfy it — e.g. a second clone of fkit, which is
  correct behaviour, or a deliberate decoy, which is not defended against. The threat model is an
  honest mistake (a copied script), not an adversary.
- **The guard was verified by transplant, never end-to-end.** `canary.sh` was not executed in round 2
  — it makes live billed `codex exec` calls. The transplant covers `set -u` through the guard; the
  codex loop below it is unexercised this round.
