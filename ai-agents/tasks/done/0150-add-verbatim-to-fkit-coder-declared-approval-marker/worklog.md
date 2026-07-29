# Worklog — 0150: add the missing `verbatim` to `fkit-coder.md`'s declared-approval marker, condition (b)

**Task:** 0150 (Sprint 2, priority 126). **Co-landed with 0147** in one `fkit-coder` build session by
board ruling — the two edit `claude/agents/fkit-coder.md` in **different clauses**. This worklog covers
**0150 only**; 0147 has its own worklog and closes against its own brief.

**Baseline:** HEAD `994e3e3`. **Built:** 2026-07-27 (planning began 2026-07-26; the run crossed midnight).
**Driver:** `fkit-sprint-ship-loop`, under its declared-approval marker. **No commit** — edit left in the
working tree.

---

## 1. What was wrong

A one-word drift between the owner's recorded ruling and the file implementing it, found by task 0119's
round-1 review as finding **R1** (medium), raised **independently by both reviewers**. Re-derived from
source at baseline, not inherited from the brief:

| Site | Condition (b) at `994e3e3` |
|---|---|
| `claude/agents/fkit-coder.md:65-66` (the worker's own contract) | *"(b) it carries a concrete **approved plan**"* — **no `verbatim`** |
| ADR-032 **A1** (`:97`, the owner's 2026-07-22 ruling) | *"(b) it carries the concrete **approved plan** verbatim"* |
| `claude/skills/fkit-sprint-ship-loop/SKILL.md:109` (the driver's obligation) | *"MUST each carry the approved plan **verbatim**"* |

**Why it matters.** The approved plan is not only the worker's standing approval, it is its **scope
boundary** (`fkit-coder.md:68-69`). A **paraphrased or reconstructed** plan satisfied the worker-side check
exactly as it was written, so the boundary a spawned coder enforces could silently become *the driver's
summary of what the owner approved* rather than what the owner actually approved — and the worker had no
way to notice, because its own contract never asked for the original wording.

**Severity stays medium, neither inflated nor deflated.** The driver's own verbatim rule
(`SKILL.md:109`) must fail first for this to bite. This is a **missing second line of defence, not the
primary control** — and it sits on a guarantee surface, which is why it was worth its own task.

**Check for other drifted copies — stated to its actual search scope (narrowed in round 2, finding R2).**
A grep for restatements of condition (b) across **`claude/` and `ai-agents/knowledge-base/decisions/`**
found **exactly three** sites there — `fkit-coder.md:65`, ADR-032 `:97`, and `SKILL.md:109`. Only
`fkit-coder.md` had drifted. **No fourth copy exists in the runtime-authority sources**, which is the
scope actually searched.

> **Correction.** This paragraph originally claimed *"No hidden fourth copy"* **repo-wide**. That
> overstated the search: it did **not** cover `ai-agents/wiki-vault/`. A fourth copy does exist there —
> `wiki-vault/wiki/tasks/track-fkit-coder-declared-approval-carve-out.md:17` restates all three marker
> signals and still reads *"carries a concrete **approved plan**"*, with **no `verbatim`**. Raised by
> Codex, confirmed by the reviewer, verified by me. It does **not** block: the vault is not runtime
> authority, and both vault copies of ADR-032 already carry `verbatim`. **Routed to task 0148** (already
> queued to re-ingest the amended ADR-032) because **only `fkit-wiki` may write the vault** — this task
> neither edits it nor may.

## 2. What changed — one word, one line

`claude/agents/fkit-coder.md`, line 66:

- **before:** `**approved plan**; and (c) it states the owner …`
- **after:**  `**approved plan** verbatim; and (c) it states the owner …`

**`a concrete` was deliberately kept, not changed to ADR-032 A1's `the concrete`.** Driver's call at the
build gate, on the reasoning surfaced at the plan gate: brief 0150 says *"Scope is one word"* twice, and
its verification step 2 asks the two texts to agree on the **requirement**, not to be byte-identical. The
article is not the requirement; `verbatim` is.

**No reflow.** Line 66 goes from 104 to 113 characters, within the file's existing range (it already
contains 104-, 106- and 193-character lines). Reflowing would have made the diff touch line 67, which
carries part of signal (c), for no benefit. The result is a **single-line diff**.

**Change surface held to that.** Signals (a) and (c), the Build-worker bullet, the Process-review-worker
bullet, the trust-not-proof paragraph, and the *"Everything else still refuses"* universal are all
byte-unchanged (checks C3, C8, C8b, C8c, C8d). This task **narrowed** a condition to match the ruling; it
widened, reopened and re-decided nothing.

## 3. `SKILL.md` and this task — reading brief step 6 honestly

Brief 0150's verification step 6 requires `claude/skills/fkit-sprint-ship-loop/SKILL.md` to be
**untouched**. In this shared working tree it **is** modified — by **0147**, which co-landed. The guard was
**not** weakened to accommodate that. It is discharged by **per-hunk attribution**, made a recorded fact
rather than post-hoc reasoning by **edit order**:

1. 0150's one-word edit was made **first**, before any 0147 edit existed.
2. Its diff was **snapshotted immediately**, showing `git diff --numstat` on `fkit-coder.md` at exactly
   `1	1` and `git status --porcelain claude/` listing **only** that file — proof that 0150 contributed
   exactly one line, to one file, and nothing to `SKILL.md`.
3. Check **C6** then proves `SKILL.md` changed on exactly one line (all of it 0147's), and **C6b** proves
   its `:109` verbatim rule — the reason this task is a second line of defence rather than the primary
   one — is intact.

**The STEP 2 snapshot, as observed:**

```text
=== numstat (MUST be exactly 1<TAB>1) ===
1	1	claude/agents/fkit-coder.md
=== porcelain claude/ (MUST list only fkit-coder.md) ===
 M claude/agents/fkit-coder.md
```

## 4. Verification

**⚠️ This edit is prose enforced by nothing.** Established **by execution this run**, not inherited:
`fkit-claude-init.sh` only `cp`s `agents/` (`:464-466`) and never parses a body; its `RULES_MAX` guard
(`:318`) measures **only** `claude/scaffold/universal-rules.md`, not `fkit-coder.md`; and nothing under
`test/` opens an agent prompt. **`npm test` green means "no repo regression", NOT that this edit is
enforced.** Tasks 0154/0156 are the filed attempts to change that. Verification is therefore
assertion-by-grep, fail-closed, with negative controls.

### 4.1 The verification script, exactly as executed

*(Shared harness — it also carries 0147's checks, so this worklog stands alone without cross-reference.)*

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

### 4.2 Its output, as observed (**29** asserted checks, 5 negative controls, exit 0)

> **Correction (round 2, finding R6 in 0147's ledger).** This heading originally said *"30 checks"*.
> The asserted total is **29** — `C10` is an explicit non-asserting echo and was miscounted as a check.
> Recorded once, in 0147's ledger, to avoid double-charging one nit. Round 2's corrected harness
> asserts **33**.

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

**Checks owned by 0150:**

| Check | What it proves | Result |
|---|---|---|
| **C1** | condition (b) requires `verbatim`, exactly once | PASS |
| **NC1** | discriminating — that exact string is **absent** at baseline, so C1 tests the change | PASS |
| **C2** | the marker paragraph differs from baseline by **exactly the word `verbatim`** (strip it, and the text reproduces the baseline byte-for-byte) | PASS |
| **NC2** | discriminating — C2 would catch a no-op | PASS |
| **C3** | the marker still has **exactly three** signals, joined by **all** of | PASS (×3) |
| **C6b** | `SKILL.md:109`'s verbatim rule untouched (brief step 6) | PASS |
| **C8 / C8b / C8c / C8d** | refusal universal, trust-not-proof paragraph, Build-worker bullet and STOP conditions all byte-unchanged (brief steps 4 and 5 — the carve-out is not leaked) | PASS |

**C2 is the load-bearing one for this task.** It does not merely check that `verbatim` appears; it proves
**nothing else in the declared-approval marker changed**, which is precisely what brief steps 3-4 demand.

**`npm test`** — exit **0**, `523` tests, `523` pass, `0` fail, and `prove-red.sh`'s hard gate PASSED. The
first invocation was re-run because it hit a 2-minute limit (a **timeout, not a failure**) and a
`${PIPESTATUS[0]}` echo returned empty under zsh, which uses `$pipestatus`; the re-run captured exit `0`
unambiguously. Green is a repo regression guard only — see the warning opening §4.

### 4.3 A harness defect found by re-verification, and what it did *not* touch

The **first** run of the suite failed. The failure was in the **verification harness**, not in this edit:
`have()` was `grep -cF … || echo 0`, but `grep -c` already prints `0` and *then* exits 1, so the fallback
appended a second `0` and produced a shell integer error instead of a clean FAIL. A second harness defect
(an anchor phrase that markdown had wrapped across a line break) affected **0147's** C7 only. Both were
fixed in the harness; **no source file was edited in response**, and every 0150 check above (C1, NC1, C2,
NC2, C3) passed on the first run and again after. Full detail, including a **discarded vacuous negative
control**, is in 0147's worklog §5.3 and its decision log.

## 5. Residuals and flags — raised, not acted on

- **ADR-032 was not edited.** The ADR is already correct; the file is what drifted from it. An ADR edit
  would be an architect action and is not this task's work.
- **Filing this did not close 0119.** 0119 remains the owner's to verify and close personally.
- **`.claude/` mirror is now deliberately stale.** `fkit-claude-init.sh` was **not** run, per the driver's
  standing instruction. Divergence, stated rather than left silent:

  | File | canonical `claude/` | gitignored mirror `.claude/` |
  |---|---|---|
  | `agents/fkit-coder.md` | `4de1a6d69e164c015c88134853c1c5bf` | `e08875aa6baad20d0c2805a6e81dafca` |

  `e08875aa…` is exactly the md5 brief 0150 cites as the pre-edit canonical/mirror value — confirming the
  mirror was in sync before this build and diverged because of it, as intended.
- **⚠️ PROCESS DEFECT 1 of 2 — a live instance of the very gap this task closes** (finding R1 here, R7 in
  0147's ledger). The build-step prompt authorizing this work carried the approved plan **by reference** —
  *"the plan text you returned in your own previous message, unmodified"* — rather than pasting its bytes.
  `SKILL.md:109` states a **`MUST`**, and **a `MUST` is not waived by the substantive condition happening
  to hold**: that no summary was interposed, and that I held the exact bytes as the plan's author, does
  not discharge it. **The driver broke its own rule** — the primary control. A process defect in this
  run's conduct, not a defect in this diff; it gates neither task. It is also **the strongest single
  argument for landing this task**: the primary control slipped in the very run that installed its backup.

  > **Wording corrected in round 2 (R1).** This entry originally called it *"a mild deviation"* that
  > *"put nothing at risk"* — undersells a violated `MUST` in the primary control, and repeats the very
  > reasoning the finding rejects.

- **⚠️ PROCESS DEFECT 2 of 2 — the process-review prompt was not verbatim either, and claimed it was.**
  The round-2 prompt elided STEP 5's script body (named) **and silently truncated ~10 further passages**,
  while asserting *"Everything else is byte-for-byte"* — a **false** positive claim. I returned
  `NEEDS-DECISION` rather than absorb it; the **owner ruled Option B on 2026-07-27** — truncations
  non-substantive for the round, owner rulings are the scope boundary, deviation **recorded as ruled
  through, not absorbed**. A `SKILL.md` spawn-prompt follow-on will be filed at **high** rank: this
  control has now failed in **two consecutive rounds**.

- **⚠️ Forward consequence, now live.** With this task landed, that same by-reference spawn shape
  **violates the worker's own condition (b)**, and a conforming worker is **obliged to refuse**. The
  driver's spawn-prompt construction must paste the plan bytes from here on. Nothing in this diff changes
  `SKILL.md`'s spawn-prompt guidance to make that more likely — hence the follow-on above.

## 6. Change surface — 0150 only

- `claude/agents/fkit-coder.md` — **1 line changed** (`+1 / -1`), condition (b) of the declared-approval
  marker. *(The file's other hunk, `+9 / -1` appended to the Process-review-worker bullet, belongs to
  **0147**, not to this task — see §3 and 0147's worklog.)*
- `claude/skills/fkit-sprint-ship-loop/SKILL.md` — **untouched by this task** (its one changed line is
  0147's; `:109` byte-unchanged, check C6b).
- No commit. No `.claude/` mirror refresh. No ADR, brief, sprint-plan, or wiki write.

### Diff — `fkit-coder.md`, BOTH hunks (0150's is the **first**, at condition (b); the second is 0147's)

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

**Reviewer verdict:** ⚠️ Changes requested — **2 defects, none blocking**, and the reviewer recommends
this task land: *"the one-word source edit is clean and better-proven than anything else in this pair."*
Full model-diverse coverage (`codex-cli 0.145.0`, exit 0, no degradation). Dispositions **owner-ruled
2026-07-27**.

**Every 0150-owned check was confirmed genuinely discriminating** by the reviewer's independent re-run —
C1, NC1, **C2** (the load-bearing minimality proof), NC2, C3 ×3, C6b, C8/C8b/C8c/C8d. **The vacuity
findings in the shared harness land on 0147's checks, not this task's.**

## 7. What I changed, per finding

**R1 (medium) — ACCEPTED as a PROCESS DEFECT; wording corrected, no source change.** The build prompt
carried the plan by reference, violating `SKILL.md:109`'s `MUST`. My *"mild deviation … put nothing at
risk"* framing undersold a violated `MUST` in the **primary control** and reproduced the very reasoning
the finding rejects: **a `MUST` is not waived by the substantive condition happening to hold.** Corrected
in §5, where it is now recorded as **Process defect 1 of 2**, alongside a **second** one found this round
(the process-review prompt's own non-verbatim relay, which asserted it was byte-for-byte). **Neither is a
defect in this diff; neither gates either task.** Both are the driver's to absorb, and it has
acknowledged them on the record. A `SKILL.md` spawn-prompt follow-on is being filed at **high** rank.

**R2 (low) — ACCEPTED, defect in my worklog's wording, not in the code.** My claim *"No hidden fourth
copy left to keep in sync"* was stated **repo-wide** but the search covered only `claude/` and
`ai-agents/knowledge-base/decisions/`. Verified myself before correcting: a fourth copy **does** exist at
`ai-agents/wiki-vault/wiki/tasks/track-fkit-coder-declared-approval-carve-out.md:17`, restating all three
marker signals and still reading *"carries a concrete **approved plan**"* — **no `verbatim`**. §1's
paragraph is now **narrowed to its actual search scope**, with the vault copy named. **Routed to task
0148**, which is already queued to re-ingest the amended ADR-032 — **I did not and may not edit the
vault; only `fkit-wiki` writes it.** Not blocking: the vault is not runtime authority, and both vault
copies of ADR-032 already carry `verbatim`.

**R6 (shared count nit, recorded in 0147's ledger) — ACCEPTED.** *"30 checks"* was **29**; corrected in
§4.2. The round-2 harness asserts **33**.

## 8. This task's source edit is unchanged in round 2

**No round-2 change was made to 0150's one-word edit.** R1 and R2 are a wording correction and a
hand-off; neither touches `claude/agents/fkit-coder.md:66`. The edit still stands at **`+1 / -1`**, and
**C2** — strip the inserted word, and the marker paragraph reproduces `994e3e3` byte-for-byte — still
passes. The round-2 edits to `fkit-coder.md` belong to **0147** (its bullet grew by one line from R3/R4).

## 9. Round 2 verification

**The "prose enforced by nothing" statement of §4 is unchanged and still governs.** **`npm test` green
means "no repo regression", NOT that this edit is enforced.**

### 9.1 The corrected harness, exactly as executed

*(Shared with 0147, so this worklog stands alone. Round 2 scopes C7 to the Process-review bullet (R1 in
0147's ledger) and adds C11a/C11b, the 0147 analogue of this task's C2 (R2 there). 0150's own checks are
unchanged from round 1.)*

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

### 9.2 Its output — **33** asserted checks, 0 failures, exit 0

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

## 10. Change surface after round 2 — 0150 only

- `claude/agents/fkit-coder.md` — **`+1 / -1`**, condition (b). **Unchanged in round 2.**
  *(The file's other hunk, now `+10 / -1` on the Process-review-worker bullet, belongs to **0147**.)*
- `claude/skills/fkit-sprint-ship-loop/SKILL.md` — **untouched by this task** in both rounds; its one
  changed line is 0147's, and `:109` is byte-unchanged (check C6b).
- `ai-agents/tasks/backlog/0150-…/worklog.md` — §1 scope narrowing, §4.2 count correction, §5 process
  defects, and §§7-10.
- `ai-agents/tasks/backlog/0150-…/review.md` — **Coder response section only.** The *Reviewer findings*
  section was **not** touched.
- **No vault write.** R2's fourth copy is routed to task 0148 — only `fkit-wiki` may write the vault.
- No commit. No `.claude/` mirror refresh. No ADR, brief, or sprint-plan write.
