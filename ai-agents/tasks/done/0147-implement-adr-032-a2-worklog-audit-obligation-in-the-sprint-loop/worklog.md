# Worklog — 0147: implement ADR-032 A2's worklog audit obligation in the sprint-ship-loop

**Task:** 0147 (Sprint 2, priority 125). **Co-landed with 0150** in one `fkit-coder` build session by
board ruling — the two edit `claude/agents/fkit-coder.md` in **different clauses**. This worklog covers
**0147 only**; 0150 has its own worklog and closes against its own brief.

**Baseline:** HEAD `994e3e3`. **Built:** 2026-07-27 (planning began 2026-07-26; the run crossed midnight).
**Driver:** `fkit-sprint-ship-loop`, under its declared-approval marker. **No commit** — edits left in the
working tree.

---

## 1. What was wrong

ADR-032's 2026-07-22 autonomy amendment (**A2**) grants the sprint-loop Process-review worker the right to
apply verified-`CORRECT`, in-plan fixes without per-fix owner approval, and in the same breath imports
ADR-019's audit obligation as the condition on that grant — ADR-019 `:96`: *"Every autonomous choice —
every obvious winner — is recorded in the task's worklog decision-log (ADR-020) so it is auditable."*

**Nothing implemented it.** Verified against the tree at baseline:

| Site | Said (at `994e3e3`) | Gap |
|---|---|---|
| `claude/skills/fkit-sprint-ship-loop/SKILL.md:105` (Process review row) | *"return change surface + residuals…"* | no worklog obligation at all |
| `claude/agents/fkit-coder.md:73-82` (Process-review-worker bullet) | grants the autonomy, states the stop conditions | imposed no worklog obligation |

Consequence, and why this was not cosmetic: **ADR-032 A4 bullet 2's reopening condition was unsatisfiable
in practice.** That guard permits reopening A2's autonomy only on evidence that a loop-applied post-review
fix was wrong or out-of-plan, and names A2's worklog record as the mechanism — a guard pointing at
evidence nothing required anyone to write.

Both brief premises were re-derived from source before editing, **not inherited from the brief**. The
brief's cited line numbers (`SKILL.md:102/105/109`, `fkit-coder.md:65-66/73-82/84-91`, ADR-032 `:97`,
ADR-019 `:96`) were all **accurate** at baseline.

## 2. What changed — 0147's two edits

**Edit A — driver side, `claude/skills/fkit-sprint-ship-loop/SKILL.md`, Process review row (`:105`).**
Extended the *"what the worker is asked to do"* cell with the worklog obligation, naming what each entry
must contain. The row's **stop-condition column is byte-unchanged** (check C5).

**Edit B — worker side, `claude/agents/fkit-coder.md`, Process-review-worker bullet.** Appended the same
obligation to the **end** of the bullet, citing ADR-019 `:96` / ADR-020 as the surrounding text cites its
authorities, so a worker spawned by any conforming driver carries the duty in its own contract rather than
depending on the prompt remembering to ask.

**Append, not mid-bullet insertion** — a pure-insertion hunk makes "touched nothing settled" a **diff
fact** rather than a judgment call, which is what discharges the co-landing hazard in §4. Driver's call at
the build gate, on that reasoning.

**Scope held.** No change to the declared-approval marker's three signals, to A1/A2's permitted write
surface, or to the `NEEDS-DECISION` stop conditions (checks C3, C5, C8, C8c, C8d). This task added an
**obligation, not a permission**.

## 3. The one clause that exceeds the brief — owner-ruled in, not slipped in

The final clause **"Applied none? Say so — an empty log and a forgotten one are otherwise
indistinguishable"** goes **beyond brief 0147's literal items 1-3**. It was surfaced at the plan gate as an
explicit, strikeable addition and **ruled in by the owner on 2026-07-27**, who took the reasoning that
without it ADR-032 A4 bullet 2 still cannot check the **zero-fix case** — which is the whole point of this
task — and noted it is the same shape as the null line approved for task 0125, adding **obligation only,
never permission**. Recorded here so a reviewer can see it was sanctioned.

## 4. The co-landing hazard, and how it was discharged

The two briefs' verification steps **contradict each other in a shared working tree**:

- 0150 step 6 requires `SKILL.md` be **untouched** — but 0147 edits it.
- 0147 step 4 forbids touching the marker's three signals — but 0150 changes signal (b).

Neither guard was weakened. The resolution is **per-hunk attribution**, made a recorded fact rather than
post-hoc reasoning by **edit order**: 0150's one-word edit was made first and its diff snapshotted
**before** any 0147 edit existed. That snapshot showed `git diff --numstat` on `fkit-coder.md` at exactly
`1	1` — proving 0150 contributed exactly one line and nothing else. Check C6 then proves `SKILL.md`
changed on exactly one line, all of it 0147's.

## 5. Verification

**⚠️ Both of this task's edits are prose enforced by nothing.** Established **by execution this run**, not
inherited: `fkit-claude-init.sh` only `cp`s `agents/` (`:464-466`) and never parses a body; its
`RULES_MAX` guard (`:318`) measures **only** `claude/scaffold/universal-rules.md`, not `fkit-coder.md`;
and nothing under `test/` opens an agent prompt or a `SKILL.md` body. **`npm test` green means "no repo
regression", NOT that these edits are enforced.** Tasks 0154/0156 are the filed attempts to change that.
Verification here is therefore assertion-by-grep, fail-closed, with negative controls.

### 5.1 The verification script, exactly as executed

```bash
#!/usr/bin/env bash
# STEP 5 verification for co-landed tasks 0147 + 0150. Run from repo root.
# Fail-closed: every check must POSITIVELY fire; absence/error = FAIL.
set -uo pipefail
CODER=claude/agents/fkit-coder.md
SKILL=claude/skills/fkit-sprint-ship-loop/SKILL.md
BASE=994e3e3
fails=0
ok(){ printf 'PASS  %s\n' "$1"; }
no(){ printf 'FAIL  %s\n' "$1"; fails=$((fails+1)); }
# FIX 1: `|| echo 0` double-printed on zero matches (grep -c already prints 0, then exits 1),
# yielding "0\n0" and a shell integer error instead of a clean FAIL. Swallow the exit status only.
have(){ grep -cF -- "$2" "$1" 2>/dev/null || :; }
# FIX 2: whitespace-insensitive match, for phrases that markdown wraps across a line break.
haven(){ norm < "$1" | grep -cF -- "$2" 2>/dev/null || :; }
norm(){ tr -s ' \n' ' '; }
marker(){ awk '/A second scoped exception/,/is both your \*\*standing approval\*\*/'; }
prow(){ grep -F '| **Process review**'; }

# C1 [0150] verbatim present in condition (b), exactly once
[ "$(have $CODER '**approved plan** verbatim; and (c) it states the owner')" = 1 ] \
  && ok 'C1 0150: (b) requires verbatim' || no 'C1 0150: (b) verbatim missing/duplicated'
# NC1 [0150] discriminating: the same string must be ABSENT at BASE
[ "$(git show $BASE:$CODER | grep -cF '**approved plan** verbatim; and (c)')" = 0 ] \
  && ok 'NC1: check discriminates (absent at BASE)' || no 'NC1: check does not discriminate'
# C2 [0150] the ONLY change in the marker paragraph is that one word
a="$(git show $BASE:$CODER | marker | norm)"
b="$(marker < $CODER | norm | sed 's/\*\* verbatim;/**;/')"
[ "$a" = "$b" ] && ok 'C2 0150: marker para differs by exactly the word verbatim' \
                || no 'C2 0150: marker para changed beyond one word'
# NC2 discriminating: un-stripped new text must NOT equal BASE
[ "$(marker < $CODER | norm)" != "$a" ] && ok 'NC2: C2 would catch a no-op' || no 'NC2: C2 is vacuous'
# C3 [0150] three signals, joined by "all of"
for s in '**all** of (a) the spawn prompt' '(b) it carries' '(c) it states the owner'; do
  [ "$(have $CODER "$s")" = 1 ] && ok "C3 signal present: $s" || no "C3 signal missing/dup: $s"
done
# C4 [0147a] Process-review row now names the worklog and its required contents
row="$(prow < $SKILL)"; base_row="$(git show $BASE:$SKILL | prow)"
for s in 'worklog.md' 'which finding it answers' 'what changed' 'why it qualified'; do
  case "$row" in *"$s"*) ok "C4 row states: $s";; *) no "C4 row missing: $s";; esac
done
# NC3 [0147a] discriminating: BASE row must NOT mention worklog
case "$base_row" in *worklog*) no 'NC3: BASE row already had worklog - check is vacuous';;
                    *) ok 'NC3: check discriminates (BASE row had no worklog)';; esac
# C5 [0147a] stop-condition column byte-unchanged
f5(){ awk -F'|' '{print $5}'; }
[ "$(printf '%s' "$row" | f5)" = "$(printf '%s' "$base_row" | f5)" ] \
  && ok 'C5 0147a: stop-condition column byte-unchanged' || no 'C5 0147a: stop conditions CHANGED'
# C6 [0150 step 6 / 0147 non-widening] SKILL.md changed on exactly ONE line, and :109 untouched
[ "$(git diff --numstat -- $SKILL | awk '{print $1"/"$2}')" = "1/1" ] \
  && ok 'C6 SKILL.md: exactly one line changed (all of it 0147a)' || no 'C6 SKILL.md: unexpected change count'
[ "$(have $SKILL 'MUST each carry the approved plan verbatim')" = 1 ] \
  && ok 'C6b SKILL:109 verbatim rule intact' || no 'C6b SKILL:109 verbatim rule disturbed'
# C7 [0147b] coder bullet carries the obligation + all three content elements + cites
# NOTE: plan listed a bare 'what' here; replaced with 'what changed' - see worklog decision log.
for s in 'Record what you did unattended' 'which finding it answers' 'what changed' 'why it qualified' \
         'adr-019-autonomous-coder-ship-loop' 'ADR-020' 'A4 bullet 2'; do
  [ "$(haven $CODER "$s")" -ge 1 ] && ok "C7 coder bullet states: $s" || no "C7 coder bullet missing: $s"
done
# NC4 [0147b] discriminating: the obligation must be ABSENT at BASE, checked the SAME
# (normalized) way C7 checks for its presence - otherwise the control is vacuous.
[ "$(git show $BASE:$CODER | norm | grep -cF 'Record what you did unattended' || :)" = 0 ] \
  && ok 'NC4: C7 discriminates (obligation absent at BASE, normalized)' || no 'NC4: C7 is vacuous'
# NC5 [0147b] prove haven() actually finds the wrapped phrase that plain grep -F cannot -
# i.e. that C7's first element is now satisfiable rather than passing for the wrong reason.
[ "$(have $CODER 'Record what you did unattended')" = 0 ] \
  && [ "$(haven $CODER 'Record what you did unattended')" -ge 1 ] \
  && ok 'NC5: phrase is line-wrapped; haven() sees it, plain grep -F does not' \
  || no 'NC5: wrapping assumption wrong - re-inspect C7'
# C8 [both] settled text intact: refusal universal + trust-not-proof paragraph
[ "$(have $CODER 'Everything else still refuses')" = 1 ] \
  && ok 'C8 refusal universal intact' || no 'C8 refusal universal disturbed'
t(){ awk '/This is trust, not proof/,/you return the plan and write no/'; }
[ "$(t < $CODER | norm)" = "$(git show $BASE:$CODER | t | norm)" ] \
  && ok 'C8b trust-not-proof para byte-unchanged' || no 'C8b trust-not-proof para CHANGED'
# C8c [0147 step 4 / 0150 step 4] Build-worker bullet byte-unchanged
bw(){ awk '/As the Build worker/,/never widen scope on your own/'; }
[ "$(bw < $CODER | norm)" = "$(git show $BASE:$CODER | bw | norm)" ] \
  && ok 'C8c Build-worker bullet byte-unchanged' || no 'C8c Build-worker bullet CHANGED'
# C8d [0147 step 4] the Process-review STOP conditions byte-unchanged in the coder bullet
sc(){ awk '/STOP and return/,/not the$/'; }
[ "$(sc < $CODER | norm)" = "$(git show $BASE:$CODER | sc | norm)" ] \
  && ok 'C8d coder STOP conditions byte-unchanged' || no 'C8d coder STOP conditions CHANGED'
# C9 [both] no collateral files touched under claude/
[ "$(git status --porcelain claude/ | wc -l | tr -d ' ')" = 2 ] \
  && ok 'C9 exactly 2 files touched under claude/' || no 'C9 unexpected files touched under claude/'
# C10 attribution surface - record, do not assert
echo '--- C10 attribution (numstat) ---'
git diff --numstat -- $CODER $SKILL
printf 'checks failed: %d\n' "$fails"; [ "$fails" -eq 0 ] || exit 1
```

### 5.2 Its output, as observed (**29** asserted checks, 5 negative controls, exit 0)

> **Correction (round 2, finding R6).** This heading originally said *"30 checks"*. The asserted total
> is **29** — `C10` is an explicit non-asserting echo and was miscounted as a check. The reviewer's
> independent re-run reached 29 first; re-counting `^(PASS|FAIL)` lines in the captured output confirms
> **29**. The same wrong figure appeared in 0150's worklog and is corrected there too. Round 2's
> corrected harness asserts **33**.

```text
PASS  C1 0150: (b) requires verbatim
PASS  NC1: check discriminates (absent at BASE)
PASS  C2 0150: marker para differs by exactly the word verbatim
PASS  NC2: C2 would catch a no-op
PASS  C3 signal present: **all** of (a) the spawn prompt
PASS  C3 signal present: (b) it carries
PASS  C3 signal present: (c) it states the owner
PASS  C4 row states: worklog.md
PASS  C4 row states: which finding it answers
PASS  C4 row states: what changed
PASS  C4 row states: why it qualified
PASS  NC3: check discriminates (BASE row had no worklog)
PASS  C5 0147a: stop-condition column byte-unchanged
PASS  C6 SKILL.md: exactly one line changed (all of it 0147a)
PASS  C6b SKILL:109 verbatim rule intact
PASS  C7 coder bullet states: Record what you did unattended
PASS  C7 coder bullet states: which finding it answers
PASS  C7 coder bullet states: what changed
PASS  C7 coder bullet states: why it qualified
PASS  C7 coder bullet states: adr-019-autonomous-coder-ship-loop
PASS  C7 coder bullet states: ADR-020
PASS  C7 coder bullet states: A4 bullet 2
PASS  NC4: C7 discriminates (obligation absent at BASE, normalized)
PASS  NC5: phrase is line-wrapped; haven() sees it, plain grep -F does not
PASS  C8 refusal universal intact
PASS  C8b trust-not-proof para byte-unchanged
PASS  C8c Build-worker bullet byte-unchanged
PASS  C8d coder STOP conditions byte-unchanged
PASS  C9 exactly 2 files touched under claude/
--- C10 attribution (numstat) ---
10	2	claude/agents/fkit-coder.md
1	1	claude/skills/fkit-sprint-ship-loop/SKILL.md
checks failed: 0
exit: 0
```

**Checks owned by 0147:** C4 (row states the worklog obligation and all three required contents), NC3
(discriminating: the baseline row had no `worklog`), C5 (stop-condition column byte-unchanged), C6 +
C6b (`SKILL.md` changed on exactly one line; `:109`'s verbatim rule intact), C7 (coder bullet carries the
obligation, its three content elements, and the ADR-019/ADR-020/A4-bullet-2 citations), NC4 + NC5
(discriminating controls for C7), C8c/C8d (Build-worker bullet and STOP conditions byte-unchanged).

**`npm test`** — exit **0**, `523` tests, `523` pass, `0` fail, and `prove-red.sh`'s hard gate PASSED
(each mutation reds its named assertion). Re-run to capture the code unambiguously, because the first
invocation timed out at a 2-minute limit (a timeout, **not** a failure) and a `${PIPESTATUS[0]}` echo
returned empty under zsh, which uses `$pipestatus`. Green here is a repo regression guard only — see the
warning opening §5.

### 5.3 Two defects of my own, both caught by re-verification, neither by any test

The **first** run of the verification suite **failed**, and the failure was mine, in the harness rather
than in the edits:

1. **`have()` double-printed on zero matches.** It was `grep -cF … || echo 0`; `grep -c` already prints
   `0` and *then* exits 1, so the fallback appended a second `0`, yielding `"0\n0"` and the shell error
   `[: 0\n0: integer expression expected` instead of a clean FAIL.
2. **C7's anchor `Record what you did unattended` spans a line break in the file** (`…what you did` /
   `unattended.**…`), so the `grep -F` was **unsatisfiable as written**. I had identified this exact
   line-wrap hazard while planning, deliberately re-wrapped the paragraph to keep `what changed`
   contiguous — and then failed to apply the same care to the bold lead-in.

**NC4's original pass was discarded, not kept.** It guarded C7 using the same unsatisfiable phrase against
the baseline, so it would have passed even if the phrase existed nowhere — a **vacuous control** by the
standard task 0153 established. It was rewritten to check the baseline the *same normalized way* C7 checks
for presence, and a new **NC5** was added to prove the phrase really is line-wrapped: plain `grep -F`
finds `0`, normalized `haven()` finds it. Without NC5, C7's first element could pass for the wrong reason.

**The files were correct; the checks were wrong.** No edit to `fkit-coder.md` or `SKILL.md` was made in
response — only the harness changed.

## 6. Decision log — autonomous choices made while the owner was away

Recorded per **ADR-019 `:96`** / ADR-020 — the very obligation this task installs, applied to itself.

| # | Choice | Which finding/step it answers | What changed | Why it qualified |
|---|---|---|---|---|
| D1 | Fixed `have()` to swallow only grep's exit status (`\|\| :`) instead of `\|\| echo 0` | First verification run's shell error on C7 | Verification harness only (scratchpad script) — **no source file touched** | Verified `CORRECT` (root cause reproduced: `grep -c` prints `0` then exits 1), mechanical, localized, and inside the approved plan's STEP 5, which requires checks that fail closed rather than error |
| D2 | Added `haven()` (whitespace-normalized match) and switched C7's elements to it | C7's anchor unsatisfiable because markdown wrapped the phrase | Verification harness only | Same: mechanical, localized; the plan explicitly forbids vacuous checks, so making an unsatisfiable check satisfiable is inside its intent |
| D3 | Rewrote NC4 to test the baseline the same normalized way, and added NC5 | The discarded vacuous control | Verification harness only | The plan's own standard ("a negative control that does not fire means the check it guards is vacuous") required it; obvious winner, no alternative preserves the control's meaning |
| D4 | Replaced the plan's bare `'what'` C7 element with `'what changed'`, and wrapped the appended paragraph so that phrase stays on one line | Plan STEP 5's C7 list as literally written | Verification harness + line-wrapping of the new paragraph (**no wording change**) | Obvious winner within the plan's intent: a bare `'what'` matches trivially and would have been a false pass of exactly the 0153 R1 category. Wording of the obligation is unchanged; only where lines break |

**No fix in this table changed the meaning of either edited file.** D4 altered line breaks in the new
paragraph only.

## 7. Residuals and flags — raised, not acted on

- **F1 — ADR-032's A2 blockquote is now false as written.** It says the requirement is *"not yet true of
  the implementation"* and cites `SKILL.md:105` as asking only for *"change surface + residuals"*. Both
  halves are now stale. **Correcting it is an architect action** (a dated note, ADR-010/0143 precedent),
  and the vault copy is fkit-wiki's. Brief step 6 requires raising it; **no ADR was edited.**
- **F2 — ADR-020's stated worklog path does not exist.** Its Decision table names
  `ai-agents/worklogs/<task-id>.md`; that directory is **absent**, and 35 worklogs live at
  `<task-folder>/worklog.md` (ADR-020 Decision 6's "future direction" is now the actual layout). Both
  edits use the **real** path and deliberately do not propagate the stale one. Architect follow-on.
- **F3 — rank-citation noise** in 0150's brief (`"0147 (123)"`, `"128 → 124"` vs both briefs' actual
  `## Priority` 125/126). Already covered by task 0159. No action.
- **`.claude/` mirrors are now deliberately stale.** `fkit-claude-init.sh` was **not** run, per the
  driver's standing instruction; neither edit needs to be live this run, and refreshing mid-run changes
  nothing already in a loaded context. Divergence, stated rather than left silent:

  | File | canonical `claude/` | gitignored mirror `.claude/` |
  |---|---|---|
  | `agents/fkit-coder.md` | `4de1a6d69e164c015c88134853c1c5bf` | `e08875aa6baad20d0c2805a6e81dafca` |
  | `skills/fkit-sprint-ship-loop/SKILL.md` | `d0ff36581b0320f1e0200beb2f8d8ebd` | `8c46bd0b916ce6af887d3a5faeddfe43` |

  The mirror value `e08875aa…` is the **pre-edit canonical** md5 that brief 0150 cites — i.e. the mirrors
  were in sync before this build and diverged because of it, exactly as intended.
- **⚠️ PROCESS DEFECT 1 of 2 — the build prompt violated `SKILL.md:109`'s `MUST`** (finding R7 here,
  R1 in 0150's ledger). The build-step prompt that authorized this work carried the approved plan **by
  reference** ("the plan text you returned in your own previous message, unmodified") rather than its
  bytes. `SKILL.md:109` states a **`MUST`**, and **a `MUST` is not waived by the substantive condition
  happening to hold** — the fact that no summary was interposed, and that I held the exact bytes as their
  author, does not discharge it. **The driver broke its own rule.** It is a process defect in this run's
  conduct, not a defect in the diff, and it gates neither task. It is also direct evidence for **why
  0150's second line of defence is worth having** — the primary control slipped in the very run that
  installed the backup.

  > **Wording corrected in round 2 (R7).** This entry originally called it *"a mild deviation"* that
  > *"put nothing at risk"*. That undersold a violated `MUST` in the **primary** control, and the
  > reasoning was the same error the finding is about. Corrected to the form above.

- **⚠️ PROCESS DEFECT 2 of 2 — the process-review prompt's plan was not carried verbatim either, and the
  relay asserted that it was.** The round-2 prompt pasted the plan but **elided STEP 5's script body**
  (named by the driver) **and silently truncated ~10 further passages** across NON-GOALS, EDGE CASES and
  FLAGS — one of which dropped an instruction, not merely rationale — while stating *"Everything else is
  byte-for-byte."* That positive claim was **false**. I stopped and returned `NEEDS-DECISION` rather than
  absorbing it; the **owner ruled Option B on 2026-07-27**: the truncations are non-substantive for this
  round, the owner rulings are the round's scope boundary, and **the deviation is recorded as ruled
  through, not absorbed**. The driver has acknowledged the error on the record. A follow-on on
  `SKILL.md`'s spawn-prompt guidance will be filed at a **high** rank — a prose control that failed in
  **two consecutive rounds**, during the very run installing its own backup, is not a polish item.

## 8. Change surface — 0147 only

- `claude/skills/fkit-sprint-ship-loop/SKILL.md` — **1 line changed** (`+1 / -1`), the Process review row.
- `claude/agents/fkit-coder.md` — **+9 / -1**, a pure insertion appended to the Process-review-worker
  bullet. *(The file's other hunk, `+1 / -1` at the marker's condition (b), belongs to **0150**, not to
  this task — see §4 and 0150's worklog.)*
- No commit. No `.claude/` mirror refresh. No ADR, brief, sprint-plan, or wiki write.

### Diff — `SKILL.md` (all of it 0147's)

```diff
diff --git a/claude/skills/fkit-sprint-ship-loop/SKILL.md b/claude/skills/fkit-sprint-ship-loop/SKILL.md
index b5ef916..ac5f9d1 100644
--- a/claude/skills/fkit-sprint-ship-loop/SKILL.md
+++ b/claude/skills/fkit-sprint-ship-loop/SKILL.md
@@ -104,3 +104,3 @@ owner rejects the plan** (§5.4), so a rejected task is never stranded `🔄 In
 | **Review** | `@fkit-reviewer` → `/fkit-stateful-review` | own pass + Codex second opinion; write the *Reviewer findings* ledger section; return the verdict | — |
-| **Process review** | `@fkit-coder` | apply `fkit-process-stateful-review` **method** — verify each finding, classify defect/frontier, write the *Coder response*; **apply verified-`CORRECT`, in-approved-plan fixes autonomously (task-loop discipline, ADR-019)**; return change surface + residuals, and **return `NEEDS-DECISION` for any judgment call** | **⛔ stop for judgment calls** — frontier-move, regression, disputed severity, broad/behavior-changing, or out-of-plan fix |
+| **Process review** | `@fkit-coder` | apply `fkit-process-stateful-review` **method** — verify each finding, classify defect/frontier, write the *Coder response*; **apply verified-`CORRECT`, in-approved-plan fixes autonomously (task-loop discipline, ADR-019)**; **record each autonomously-applied fix and each obvious-winner call in the task folder's `worklog.md` — per entry: which finding it answers, what changed, and why it qualified; record `none` if none** (ADR-032 A2 / ADR-019 `:96`); return change surface + residuals, and **return `NEEDS-DECISION` for any judgment call** | **⛔ stop for judgment calls** — frontier-move, regression, disputed severity, broad/behavior-changing, or out-of-plan fix |
 | **Close** | `@fkit-producer` | run `/fkit-task-done` on the brief; write `✅ Done (agent-closed — not owner-verified)` in the brief and every board row (ADR-033 §5 — a **spawned** producer has no owner channel, so its close is never owner-verified); return the step-7 close-out report | **the driver confirms the close landed** against that report (§4) before counting the task shipped; **stop for the owner on a degraded run** |
```

### Diff — `fkit-coder.md`, BOTH hunks (0147's is the second; the first is 0150's)

```diff
diff --git a/claude/agents/fkit-coder.md b/claude/agents/fkit-coder.md
index 8f76fc0..17e5862 100644
--- a/claude/agents/fkit-coder.md
+++ b/claude/agents/fkit-coder.md
@@ -64,5 +64,5 @@ When spawned by that loop you **MAY** write source — as its **Build worker** o
 worker** — but **only** under the loop's **declared-approval marker**: **all** of (a) the spawn prompt
 identifies the caller as `fkit-sprint-ship-loop` (the lead's sprint driver); (b) it carries a concrete
-**approved plan**; and (c) it states the owner **approved that plan** via a live `AskUserQuestion` relay
+**approved plan** verbatim; and (c) it states the owner **approved that plan** via a live `AskUserQuestion` relay
 in the driver session. On this path the refusal's rationale — *"nobody is there to approve"* — is
 **satisfied**: the owner approved in the **driver's** session before you were spawned. The approved plan
@@ -80,5 +80,13 @@ is both your **standing approval** and your **scope boundary**.
   plan**. When in doubt about the shape, return `NEEDS-DECISION`. You are a **bounded spawn, not the
   session loop** — you cannot "walk away": apply the in-plan `CORRECT` fixes, then **return** (`DONE` with
-  your change surface, or `NEEDS-DECISION`). The driver re-verifies and relays.
+  your change surface, or `NEEDS-DECISION`). The driver re-verifies and relays. **Record what you did
+  unattended.** ADR-019's audit obligation transfers with its permission
+  ([ADR-019](../../ai-agents/knowledge-base/decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)
+  `:96`; ADR-020's worklog decision log): for **each** fix applied without asking and **each**
+  obvious-winner call, record in the task folder's `worklog.md` **which finding it answers, what changed,
+  and why it qualified** (verified-`CORRECT` + mechanical/localized + in-plan, or
+  obvious-winner-within-intent). A list of touched files is not enough — the record must make a wrong
+  fix findable afterwards, which is what ADR-032 A4 bullet 2 turns on. **Applied none? Say so** — an
+  empty log and a forgotten one are otherwise indistinguishable.
 
 **This is trust, not proof — state it, do not harden it into a false guarantee.** You cannot verify the
```

---

# Round 2 — review response (2026-07-29)

**Reviewer verdict:** ⚠️ Changes requested — 6 defects, **none blocking**. Full model-diverse coverage
(`codex-cli 0.145.0`, exit 0, no degradation). Every disposition below was **owner-ruled on 2026-07-27**.
The reviewer independently re-derived the facts my harness failed to prove, confirmed 0147 satisfies
ADR-032 A2, judged the co-landing **genuinely discharged**, and **disproved one Codex finding**.

## 9. What I changed, per finding

**R1 (medium) — ACCEPTED, defect. C7 was partly vacuous.** `haven()` grepped the **whole file**, not the
bullet. Verified before fixing: at `994e3e3`, `what changed` already occurs (at `fkit-coder.md:241`, not
`:233` as the finding cited — a harmless citation slip; the claim holds) and
`adr-019-autonomous-coder-ship-loop` occurs **3×**. Both would have gone green in a world where edit B
was never made. **Fix:** added a `bullet()` extractor and an `inbullet()` matcher; C7's seven elements
are now matched **inside the Process-review-worker bullet only**, and **NC4 now asserts that all seven
are absent from the BASE bullet** — the discrimination the whole-file version never proved.

**R2 (medium) — ACCEPTED, defect. No minimality check existed for 0147's two edits.** Reproduced the
reviewer's mutation myself: `in-approved-plan fixes autonomously` → `any fixes autonomously` left C4, C5,
C6, C6b and NC3 **all green**. **Fix:** added **C11a** and **C11b**, the analogue of C2's role for 0150 —
strip *only* the inserted span from each edit and require what remains to reproduce `994e3e3`
byte-for-byte. A widening sits **outside** the stripped span, so it survives into the comparison and
fails the check. **Mutation-tested before keeping, as the standard requires** (§10).

**R3 (low) — ACCEPTED, defect. The null record was under-specified and the two sites diverged.**
`**Applied none? Say so**` attached grammatically to applied **fixes**, leaving an obvious-winner call
that produced no fix uncovered — and the **worker-side** clause, the one that survives a non-conforming
driver (brief item 2's entire rationale), was the **weaker** of the two. **Fix:** now reads **"Applied no
fix and made no obvious-winner call? Record `none` there too"** — both limbs, and a token (`none`)
matching the driver-side clause's strength.

**R4 (low) — ACCEPTED, defect. Neither clause said *where in the worklog* the record goes.** **Fix:**
both sites now name it — worker side *"in its decision log"*, driver side *"`worklog.md` decision log"* —
matching ADR-019 `:96`'s own term and `fkit-task-ship-loop/SKILL.md:305`'s idiom.

**R5 (low) — ACCEPTED as a HAND-OFF, not an edit.** The `+9/-1` insertion moved the lines ADR-032 cites
into `fkit-coder.md`: `:106` cites `:89-91` for the refusal universal, `:118`/`:131` cite `:73-82` for the
bullet. Those ranges are now stale (the round-2 edit shifts them again). **Not this task's work** — ADRs
are the architect's. **Folded into F1's architect visit.** Germane because A4 bullet 5 rules the claim
must stay answerable by **reading**.

**R6 (low) — ACCEPTED, defect. "30 checks" was 29.** Verified by counting `^(PASS|FAIL)` lines in the
captured output: **29**. `C10` is an explicit non-asserting echo and was miscounted. Corrected in §5.2
here and in 0150's §4.2, and `C10` is now labelled non-asserting in the script itself.

**R7 (medium) — ACCEPTED as a PROCESS DEFECT, wording corrected.** See §7's two process-defect entries.
The reviewer's point is the one that matters and I have adopted its exact form: **a `MUST` is not waived
by the substantive condition happening to hold.** My *"mild deviation"* framing undersold it — and, worse,
reproduced the very reasoning the finding rejects. **Not a defect in the diff; gates neither task.**

## 10. Proving R2's fix is not itself vacuous — C11 mutation-tested

The reviewer's standard, applied to my own new checks **before** keeping them. In-memory mutation; no file
touched.

```text
=== MUTATION A: SKILL row  'in-approved-plan fixes' -> 'any fixes'  (a real scope widening) ===
C11a: FIRES (fails on the widening) <-- discriminating
=== MUTATION B: coder bullet — drop 'mechanical/localized,' from the STOP conditions ===
C11b: FIRES (fails on the widening) <-- discriminating
=== CONTROL: unmutated inputs must still PASS (else C11 is broken, not strict) ===
C11a control: PASS
C11b control: PASS
```

## 11. A defect I introduced in round 2, caught by re-verification — not by any test

The first run of the corrected harness **failed two checks**, and the cause was mine:

**`bullet()`'s awk range terminated on `/otherwise indistinguishable\./` — a string that does not exist at
`994e3e3`.** So on the BASE side the range never closed and ran to **end of file**, making the "BASE
bullet" swallow the rest of the document. That is why `NC4` reported
`adr-019-autonomous-coder-ship-loop ALREADY in BASE bullet` and why `C11b` reported the bullet changed
outside the appended clause — both were comparing against garbage.

```text
FAIL  NC4 0147b: 'adr-019-autonomous-coder-ship-loop' ALREADY in BASE bullet - C7 element vacuous
FAIL  C11b 0147b: coder bullet changed OUTSIDE the appended clause
checks failed: 2
```

**Fix:** end the range at the bullet's terminating blank line, which exists in **both** trees.

**And NC5 did not catch it** — it asserted the range was "multi-line", and a to-EOF range *is* multi-line.
That is a negative control that failed to discriminate, by exactly the standard applied to me twice this
round. **NC5 was strengthened** to assert the range is **bounded** — that it stops before the next
paragraph — in both trees. Had I kept the weaker NC5, C7/NC4/C11b would have been silently comparing
against the wrong text.

## 12. Decision log — round 2

Per the obligation this task installs, now live in my own agent prompt.

| # | Choice | Which finding it answers | What changed | Why it qualified |
|---|---|---|---|---|
| D5 | Scoped C7 to the bullet via `bullet()`/`inbullet()`; re-pointed NC4 at the same range and made it assert all 7 elements absent at BASE | R1 | Verification harness only | Verified `CORRECT` (reproduced both vacuous elements at BASE first), mechanical, localized, inside the owner-ruled scope |
| D6 | Added C11a/C11b (strip-the-addition, compare to BASE) and mutation-tested both before keeping them | R2 | Verification harness only | Verified `CORRECT` (reproduced the reviewer's mutation first), mechanical, in-scope; mutation proof in §10 |
| D7 | Fixed `bullet()`'s unbounded BASE range; strengthened NC5 from "multi-line" to "bounded" | Defect I introduced in round 2 (§11) | Verification harness only | Verified `CORRECT` (root cause reproduced: terminator absent at BASE), mechanical, localized; the plan forbids vacuous checks, so a control that cannot discriminate must be fixed |
| D8 | Wrote `**decision log**` inside an already-bold span in the SKILL row, then immediately reverted the nested emphasis | R4 (self-caught while applying it) | `SKILL.md` row — net effect none; final text has no nested bold | Mechanical typo caught in the same turn; recorded because it briefly touched a source file and the obligation covers unattended source writes, not just kept ones |

**Source-text calls this round:** R3 and R4's wording changes were **owner-ruled**, not autonomous — they
are not decision-log entries, they are instructions executed. Every autonomous call above is
**harness-only** except D8, which is disclosed.

## 13. Retroactive entries — round 1 calls I made unattended and never logged

**Found by applying this task's own obligation to myself.** Round 1's approved plan (STEP 5) listed
checks `C1, NC1, C2, NC2, C3, C4, NC3, C5, C6, C6b, C7, C8, C8b, C9, C10`. I executed **C8c, C8d and
NC4** as well, and §6's decision log recorded **none of their additions** — D3 covers only NC4's later
*rewrite* and NC5.

| # | Choice | Which need it answered | What it added | Why it qualified |
|---|---|---|---|---|
| D1r | Added **C8c** — Build-worker bullet byte-unchanged vs BASE | Brief 0147 step 4 / 0150 step 4 ("no change to the Build bullet") asserted but unproven | Verification harness only | Strictly additive proof of a guard both briefs demand; mechanical, in-plan intent |
| D2r | Added **C8d** — the coder bullet's STOP conditions byte-unchanged vs BASE | Same: 0147 step 4 forbids touching the stop conditions | Verification harness only | Same |
| D3r | Added **NC4** — the obligation absent at BASE | The plan's own rule that a positive check needs a discriminating control | Verification harness only | Same — though as first written it was itself vacuous, which round 1 caught and D3 fixed |

**This is the sharpest evidence for R4, and it is against me.** The obligation's own author breached it
within one round of writing it — because the clause said *that* to record and *what* to record, but never
**where**. Four calls went into §6's table; one ("append, not mid-bullet insertion") went into §2 prose;
three went nowhere. R4's fix — naming *the decision log* in both clauses — is aimed exactly at that.

## 14. Round 2 verification

**The "prose enforced by nothing" statement of §5 is unchanged and still governs.** Re-confirmed this
round: nothing in `test/` opens either file, `fkit-claude-init.sh` only `cp`s `agents/`, and `RULES_MAX`
measures only `claude/scaffold/universal-rules.md`. **`npm test` green means "no repo regression", NOT
that these edits are enforced.**

### 14.1 The corrected harness, exactly as executed

```bash
#!/usr/bin/env bash
# Verification for co-landed tasks 0147 + 0150. Run from repo root.
# Fail-closed: every check must POSITIVELY fire; absence/error = FAIL.
# Round 2: R1 scopes C7 to the Process-review bullet; R2 adds C11 (minimality for 0147's two edits).
set -uo pipefail
CODER=claude/agents/fkit-coder.md
SKILL=claude/skills/fkit-sprint-ship-loop/SKILL.md
BASE=994e3e3
fails=0
ok(){ printf 'PASS  %s\n' "$1"; }
no(){ printf 'FAIL  %s\n' "$1"; fails=$((fails+1)); }
norm(){ tr -s ' \n' ' '; }
have(){ grep -cF -- "$2" "$1" 2>/dev/null || :; }
# R1 FIX: scope to the Process-review-worker BULLET, not the whole file. Two of C7's elements
# ('what changed', the adr-019 URL) occur elsewhere in fkit-coder.md and passed vacuously at BASE.
# NOTE (defect found round 2, by re-verification): the first version ended the range at
# /otherwise indistinguishable\./ - a string that does NOT exist at BASE, so awk ran the BASE range to
# END OF FILE and swallowed unrelated text. That broke NC4 and C11b. End at the bullet's terminating
# blank line instead, which exists in BOTH trees.
bullet(){ awk '/- \*\*As the Process-review worker:\*\*/{f=1} f&&/^[[:space:]]*$/{f=0} f'; }
inbullet(){ bullet < "$1" | norm | grep -cF -- "$2" 2>/dev/null || :; }
marker(){ awk '/A second scoped exception/,/is both your \*\*standing approval\*\*/'; }
prow(){ grep -F '| **Process review**'; }

# ---------- 0150: the one-word edit ----------
[ "$(have $CODER '**approved plan** verbatim; and (c) it states the owner')" = 1 ] \
  && ok 'C1  0150: (b) requires verbatim' || no 'C1  0150: (b) verbatim missing/duplicated'
[ "$(git show $BASE:$CODER | grep -cF '**approved plan** verbatim; and (c)')" = 0 ] \
  && ok 'NC1 0150: C1 discriminates (absent at BASE)' || no 'NC1 0150: C1 does not discriminate'
a="$(git show $BASE:$CODER | marker | norm)"
b="$(marker < $CODER | norm | sed 's/\*\* verbatim;/**;/')"
[ "$a" = "$b" ] && ok 'C2  0150: marker para differs by exactly the word verbatim (minimality)' \
                || no 'C2  0150: marker para changed beyond one word'
[ "$(marker < $CODER | norm)" != "$a" ] && ok 'NC2 0150: C2 would catch a no-op' || no 'NC2 0150: C2 is vacuous'
for s in '**all** of (a) the spawn prompt' '(b) it carries' '(c) it states the owner'; do
  [ "$(have $CODER "$s")" = 1 ] && ok "C3  0150: signal present: $s" || no "C3  0150: signal missing/dup: $s"
done

# ---------- 0147a: the SKILL.md Process-review row ----------
row="$(prow < $SKILL)"; base_row="$(git show $BASE:$SKILL | prow)"
for s in 'worklog.md' 'decision log' 'which finding it answers' 'what changed' 'why it qualified' 'record `none` if none'; do
  case "$row" in *"$s"*) ok "C4  0147a: row states: $s";; *) no "C4  0147a: row missing: $s";; esac
done
case "$base_row" in *worklog*) no 'NC3 0147a: BASE row already had worklog - vacuous';;
                    *) ok 'NC3 0147a: C4 discriminates (BASE row had no worklog)';; esac
f5(){ awk -F'|' '{print $5}'; }
[ "$(printf '%s' "$row" | f5)" = "$(printf '%s' "$base_row" | f5)" ] \
  && ok 'C5  0147a: stop-condition column byte-unchanged' || no 'C5  0147a: stop conditions CHANGED'
[ "$(git diff --numstat -- $SKILL | awk '{print $1"/"$2}')" = "1/1" ] \
  && ok 'C6  0147a: SKILL.md changed on exactly one line' || no 'C6  0147a: unexpected change count'
[ "$(have $SKILL 'MUST each carry the approved plan verbatim')" = 1 ] \
  && ok 'C6b 0150: SKILL:109 verbatim rule intact' || no 'C6b 0150: SKILL:109 verbatim rule disturbed'

# ---------- 0147b: the fkit-coder.md Process-review-worker bullet (BULLET-SCOPED, R1) ----------
ELEMS_FILE=$(mktemp)
cat > "$ELEMS_FILE" <<'ELEMS'
Record what you did unattended
in its decision log
which finding it answers, what changed, and why it qualified
adr-019-autonomous-coder-ship-loop
ADR-020
A4 bullet 2
Applied no fix and made no obvious-winner call? Record `none` there too
ELEMS
while IFS= read -r s; do
  [ "$(inbullet $CODER "$s")" -ge 1 ] && ok "C7  0147b: bullet states: $s" || no "C7  0147b: bullet missing: $s"
done < "$ELEMS_FILE"
# NC4 re-pointed at the SAME bullet range C7 uses. Every element must be ABSENT from the BASE
# bullet - this is exactly what the whole-file version failed to prove (R1).
nc4=0
while IFS= read -r s; do
  n="$(git show $BASE:$CODER | bullet | norm | grep -cF -- "$s" || :)"
  [ "$n" = 0 ] || { no "NC4 0147b: '$s' ALREADY in BASE bullet - C7 element vacuous"; nc4=1; }
done < "$ELEMS_FILE"
[ "$nc4" = 0 ] && ok 'NC4 0147b: all 7 C7 elements absent from BASE bullet (none vacuous)'
rm -f "$ELEMS_FILE"
# NC5: prove the extractor matched a BOUNDED range in BOTH trees. The round-2 defect this now guards:
# a terminator absent at BASE made awk run to EOF, so the "BASE bullet" swallowed the rest of the file
# and NC4/C11b compared against garbage. Asserting "multi-line" alone did NOT catch that - a to-EOF
# range is multi-line too. So assert the range STOPS before the next paragraph.
nc5=0
[ "$(bullet < $CODER | wc -l | tr -d ' ')" -gt 1 ] || nc5=1
[ "$(git show $BASE:$CODER | bullet | wc -l | tr -d ' ')" -gt 1 ] || nc5=1
[ "$(bullet < $CODER | grep -cF 'trust, not proof' || :)" = 0 ] || nc5=1
[ "$(git show $BASE:$CODER | bullet | grep -cF 'trust, not proof' || :)" = 0 ] || nc5=1
[ "$nc5" = 0 ] \
  && ok 'NC5 0147b: bullet range is multi-line AND bounded (stops before the next para) in BOTH trees' \
  || no 'NC5 0147b: bullet extractor unbounded or empty - C7/NC4/C11b would compare against garbage'

# ---------- C11 (R2): MINIMALITY for 0147's two edits - the analogue of C2 for 0150 ----------
# Strip ONLY the inserted span from each edit; what remains must reproduce BASE byte-for-byte.
# This catches a widening such as `in-approved-plan fixes` -> `any fixes`, which sits OUTSIDE the
# stripped span and therefore survives into the comparison.
strip_row(){ sed 's/\*\*record each autonomously-applied fix.*ADR-019 `:96`); //'; }
[ "$(printf '%s' "$row" | strip_row | norm)" = "$(printf '%s' "$base_row" | norm)" ] \
  && ok 'C11a 0147a: SKILL row minus the inserted clause == BASE row (no widening)' \
  || no 'C11a 0147a: SKILL row changed OUTSIDE the inserted clause'
strip_bullet(){ sed 's/ \*\*Record what you did unattended\..*indistinguishable\.//'; }
[ "$(bullet < $CODER | norm | strip_bullet)" = "$(git show $BASE:$CODER | bullet | norm)" ] \
  && ok 'C11b 0147b: coder bullet minus the appended clause == BASE bullet (no widening)' \
  || no 'C11b 0147b: coder bullet changed OUTSIDE the appended clause'

# ---------- settled text, both tasks ----------
[ "$(have $CODER 'Everything else still refuses')" = 1 ] \
  && ok 'C8  refusal universal intact' || no 'C8  refusal universal disturbed'
t(){ awk '/This is trust, not proof/,/you return the plan and write no/'; }
[ "$(t < $CODER | norm)" = "$(git show $BASE:$CODER | t | norm)" ] \
  && ok 'C8b trust-not-proof para byte-unchanged' || no 'C8b trust-not-proof para CHANGED'
bw(){ awk '/As the Build worker/,/never widen scope on your own/'; }
[ "$(bw < $CODER | norm)" = "$(git show $BASE:$CODER | bw | norm)" ] \
  && ok 'C8c Build-worker bullet byte-unchanged' || no 'C8c Build-worker bullet CHANGED'
sc(){ awk '/STOP and return/,/not the$/'; }
[ "$(sc < $CODER | norm)" = "$(git show $BASE:$CODER | sc | norm)" ] \
  && ok 'C8d coder STOP conditions byte-unchanged' || no 'C8d coder STOP conditions CHANGED'
[ "$(git status --porcelain claude/ | wc -l | tr -d ' ')" = 2 ] \
  && ok 'C9  exactly 2 files touched under claude/' || no 'C9  unexpected files touched under claude/'
echo '--- C10 attribution (numstat; explicit NON-asserting echo, not counted as a check) ---'
git diff --numstat -- $CODER $SKILL
printf 'checks failed: %d\n' "$fails"; [ "$fails" -eq 0 ] || exit 1
```

### 14.2 Its output — **33** asserted checks, 0 failures, exit 0

```text
PASS  C1  0150: (b) requires verbatim
PASS  NC1 0150: C1 discriminates (absent at BASE)
PASS  C2  0150: marker para differs by exactly the word verbatim (minimality)
PASS  NC2 0150: C2 would catch a no-op
PASS  C3  0150: signal present: **all** of (a) the spawn prompt
PASS  C3  0150: signal present: (b) it carries
PASS  C3  0150: signal present: (c) it states the owner
PASS  C4  0147a: row states: worklog.md
PASS  C4  0147a: row states: decision log
PASS  C4  0147a: row states: which finding it answers
PASS  C4  0147a: row states: what changed
PASS  C4  0147a: row states: why it qualified
PASS  C4  0147a: row states: record `none` if none
PASS  NC3 0147a: C4 discriminates (BASE row had no worklog)
PASS  C5  0147a: stop-condition column byte-unchanged
PASS  C6  0147a: SKILL.md changed on exactly one line
PASS  C6b 0150: SKILL:109 verbatim rule intact
PASS  C7  0147b: bullet states: Record what you did unattended
PASS  C7  0147b: bullet states: in its decision log
PASS  C7  0147b: bullet states: which finding it answers, what changed, and why it qualified
PASS  C7  0147b: bullet states: adr-019-autonomous-coder-ship-loop
PASS  C7  0147b: bullet states: ADR-020
PASS  C7  0147b: bullet states: A4 bullet 2
PASS  C7  0147b: bullet states: Applied no fix and made no obvious-winner call? Record `none` there too
PASS  NC4 0147b: all 7 C7 elements absent from BASE bullet (none vacuous)
PASS  NC5 0147b: bullet range is multi-line AND bounded (stops before the next para) in BOTH trees
PASS  C11a 0147a: SKILL row minus the inserted clause == BASE row (no widening)
PASS  C11b 0147b: coder bullet minus the appended clause == BASE bullet (no widening)
PASS  C8  refusal universal intact
PASS  C8b trust-not-proof para byte-unchanged
PASS  C8c Build-worker bullet byte-unchanged
PASS  C8d coder STOP conditions byte-unchanged
PASS  C9  exactly 2 files touched under claude/
--- C10 attribution (numstat; explicit NON-asserting echo, not counted as a check) ---
11	2	claude/agents/fkit-coder.md
1	1	claude/skills/fkit-sprint-ship-loop/SKILL.md
checks failed: 0
verify exit: 0
```

**`npm test`** — exit **0**, `523` tests, `523` pass, `0` fail, `prove-red.sh` hard gate PASSED.

## 15. Change surface after round 2 — 0147 only

- `claude/skills/fkit-sprint-ship-loop/SKILL.md` — **1 line changed** (`+1 / -1`), the Process review row
  (round-1 insertion plus round-2's R4 wording). Still exactly one line.
- `claude/agents/fkit-coder.md` — **`+10 / -1`**, the pure insertion appended to the Process-review-worker
  bullet (one line larger than round 1, from R3/R4's rewrite). *(The file's other hunk, `+1 / -1` at
  condition (b), belongs to **0150**.)*
- `ai-agents/tasks/backlog/0147-…/worklog.md` — this round's corrections and §§9-15.
- `ai-agents/tasks/backlog/0147-…/review.md` — **Coder response section only.** The *Reviewer findings*
  section was **not** touched.
- No commit. No `.claude/` mirror refresh (canonical/mirror md5s diverge further; intended, §7).
  No ADR, brief, sprint-plan, or wiki write.

### Final diff — `SKILL.md` (all of it 0147's)

```diff
diff --git a/claude/skills/fkit-sprint-ship-loop/SKILL.md b/claude/skills/fkit-sprint-ship-loop/SKILL.md
index b5ef916..9f12e1b 100644
--- a/claude/skills/fkit-sprint-ship-loop/SKILL.md
+++ b/claude/skills/fkit-sprint-ship-loop/SKILL.md
@@ -104,3 +104,3 @@ owner rejects the plan** (§5.4), so a rejected task is never stranded `🔄 In
 | **Review** | `@fkit-reviewer` → `/fkit-stateful-review` | own pass + Codex second opinion; write the *Reviewer findings* ledger section; return the verdict | — |
-| **Process review** | `@fkit-coder` | apply `fkit-process-stateful-review` **method** — verify each finding, classify defect/frontier, write the *Coder response*; **apply verified-`CORRECT`, in-approved-plan fixes autonomously (task-loop discipline, ADR-019)**; return change surface + residuals, and **return `NEEDS-DECISION` for any judgment call** | **⛔ stop for judgment calls** — frontier-move, regression, disputed severity, broad/behavior-changing, or out-of-plan fix |
+| **Process review** | `@fkit-coder` | apply `fkit-process-stateful-review` **method** — verify each finding, classify defect/frontier, write the *Coder response*; **apply verified-`CORRECT`, in-approved-plan fixes autonomously (task-loop discipline, ADR-019)**; **record each autonomously-applied fix and each obvious-winner call in the task folder's `worklog.md` decision log — per entry: which finding it answers, what changed, and why it qualified; record `none` if none** (ADR-032 A2 / ADR-019 `:96`); return change surface + residuals, and **return `NEEDS-DECISION` for any judgment call** | **⛔ stop for judgment calls** — frontier-move, regression, disputed severity, broad/behavior-changing, or out-of-plan fix |
 | **Close** | `@fkit-producer` | run `/fkit-task-done` on the brief; write `✅ Done (agent-closed — not owner-verified)` in the brief and every board row (ADR-033 §5 — a **spawned** producer has no owner channel, so its close is never owner-verified); return the step-7 close-out report | **the driver confirms the close landed** against that report (§4) before counting the task shipped; **stop for the owner on a degraded run** |
```

### Final diff — `fkit-coder.md`, BOTH hunks (0147's is the second)

```diff
diff --git a/claude/agents/fkit-coder.md b/claude/agents/fkit-coder.md
index 8f76fc0..2db90bc 100644
--- a/claude/agents/fkit-coder.md
+++ b/claude/agents/fkit-coder.md
@@ -64,5 +64,5 @@ When spawned by that loop you **MAY** write source — as its **Build worker** o
 worker** — but **only** under the loop's **declared-approval marker**: **all** of (a) the spawn prompt
 identifies the caller as `fkit-sprint-ship-loop` (the lead's sprint driver); (b) it carries a concrete
-**approved plan**; and (c) it states the owner **approved that plan** via a live `AskUserQuestion` relay
+**approved plan** verbatim; and (c) it states the owner **approved that plan** via a live `AskUserQuestion` relay
 in the driver session. On this path the refusal's rationale — *"nobody is there to approve"* — is
 **satisfied**: the owner approved in the **driver's** session before you were spawned. The approved plan
@@ -80,5 +80,14 @@ is both your **standing approval** and your **scope boundary**.
   plan**. When in doubt about the shape, return `NEEDS-DECISION`. You are a **bounded spawn, not the
   session loop** — you cannot "walk away": apply the in-plan `CORRECT` fixes, then **return** (`DONE` with
-  your change surface, or `NEEDS-DECISION`). The driver re-verifies and relays.
+  your change surface, or `NEEDS-DECISION`). The driver re-verifies and relays. **Record what you did
+  unattended.** ADR-019's audit obligation transfers with its permission
+  ([ADR-019](../../ai-agents/knowledge-base/decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md)
+  `:96`; ADR-020's worklog decision log): for **each** fix applied without asking and **each**
+  obvious-winner call, record in the task folder's `worklog.md`, **in its decision log** —
+  **which finding it answers, what changed, and why it qualified** (verified-`CORRECT` +
+  mechanical/localized + in-plan, or obvious-winner-within-intent). A list of touched files is not
+  enough — the record must make a wrong fix findable afterwards, which is what ADR-032 A4 bullet 2
+  turns on. **Applied no fix and made no obvious-winner call? Record `none` there too** — an empty
+  log and a forgotten one are otherwise indistinguishable.
 
 **This is trust, not proof — state it, do not harden it into a false guarantee.** You cannot verify the
```
