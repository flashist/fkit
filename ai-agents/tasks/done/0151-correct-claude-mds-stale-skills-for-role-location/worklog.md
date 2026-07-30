# Worklog — 0151: correct `CLAUDE.md`'s stale `skills_for_role()` location

**Task:** 0151 (Sprint 2, priority 123). **Baseline:** HEAD `db863be`. **Built:** 2026-07-29.
**Driver:** `fkit-sprint-ship-loop`, under its declared-approval marker (owner approved the plan via
`AskUserQuestion` in the driver session, choosing the fuller wording). **No commit** — edit left in the
working tree.

---

## 1. What was wrong

`CLAUDE.md:43` named the wrong file as the home of the single source of truth for role→skill ownership.
`CLAUDE.md` is injected into **every** fkit session, so every role in every session was reading it.

Re-derived from source at baseline, not inherited from the brief:

| Site | State at `db863be` |
|---|---|
| `CLAUDE.md:43` | *"…declared in exactly one place: `skills_for_role()` in `claude/fkit-claude.sh`."* — **stale** |
| `claude/skills-for-role.sh:48` | where `skills_for_role()` is **actually defined** |
| `claude/fkit-claude.sh:257` | `. "$here/skills-for-role.sh"` — **sources** it, does not declare it |
| `claude/fkit-claude.sh:253-254` | comment documenting the move (task 43 / ADR-018) |

**Severity, neither inflated nor deflated.** One-hop misdirection, not a wrong edit: the correcting
comment sits directly above the `source` line, so a reader following the stale pointer lands next to the
correction. The cost was wasted reading plus a weakened *"exactly one place"* claim.

## 2. The brief was right about its own starting state — recorded deliberately

**Every core claim in brief 0151 verified true**, including `:43` itself, which is unusual enough to be
worth recording rather than only recording failures: three consecutive wiki briefs misstated their own
starting state in the previous run, and `sprint-2.md` has been re-ranked repeatedly, so any `:NNN` was
suspect on arrival. Verified at plan time: the stale line **is** at `:43`; `<!-- fkit:begin-rules -->`
**was** at `:45`, so the line **is** outside the generated block; `claude/README.md:41-43` **is** already
correct; and `grep -rn skills_for_role claude/scaffold/` **does** exit 1 — the scaffold ships both
`CLAUDE.md` and `AGENTS.md` but neither carries the claim, so there is **no dual-home twin**. Root
`AGENTS.md` likewise has no mention.

One claim was **partly** wrong — see §5.

## 3. The joined-line sweep was load-bearing, not ceremonial

To establish *"the only live stale site"* I swept **every tracked file** (`git ls-files`, with `.claude/`
filtered out) with a whitespace-collapsed `perl -0777` pass, for both the
`skills_for_role`↔`fkit-claude.sh` proximity and the phrase *"declared in exactly one place"*.

> **Premise corrected (round 2, finding R2).** This paragraph originally said the sweep excluded *"the
> gitignored `.claude/` mirror"*. **`.claude/skills-for-role.sh` is not gitignored** — it is **tracked**,
> and `.gitignore` covers only `.claude/settings.local.json` (`:5`), `.claude/agents/fkit-*.md` (`:14`)
> and `.claude/skills/fkit-*/` (`:17`). I excluded it with an explicit `grep -vE '^\.claude/'` filter, not
> because git ignored it. **The conclusion is unaffected** — that file carries the function *definition*,
> not a prose claim asserting a location — but the stated basis was wrong, and the basis is the reusable
> part. Recorded as an accepted residual in `review.md`.

**A line-based `grep` would have read this repo falsely.** `claude/README.md`'s **correct** sentence wraps
mid-claim:

```
**Role → skill ownership is declared in exactly one place:** `skills_for_role()` in
`skills-for-role.sh`, sourced by both `fkit-claude.sh` and the `PreToolUse` skill-ownership hook
```

A line-scoped search for the claim finds `skills_for_role()` on one line and `skills-for-role.sh` on the
next, and can conclude the sentence says something it does not.

**This is a new variant of the standing wrapped-grep finding in `wiki-vault/log.md`: the wrap hid a
CORRECT statement, not a stale one.** Prior instances hid staleness, so the failure mode was a
false-clean sweep. Here the risk ran the other way — a wrapped *correct* sibling could have been
mis-scored as drifted and "fixed", manufacturing the drift this task removes. The brief's step 3 (*"do not
touch `claude/README.md`"*) held for the right reason only because the sweep was joined-line.

**Result of the sweep:** of ~55 hits, `CLAUDE.md:43` was the **only live doc asserting** the stale claim.
The rest are dated records (ADRs 010/012/014/018/028/031, knowledge-base reports, done/cancelled briefs,
`wiki-vault/` ADR mirrors), sites that **correctly quote the defect** (`sprint-2.md:155` and `:1088`,
`0142/brief.md:98`), or already-correct sites (`wiki/systems/fkit.md`,
`wiki/systems/role-locked-sessions.md:4,88`, `test/prove-red.sh:136`). None were touched.

## 4. What changed — one file, one sentence

`CLAUDE.md`, line 43 (`+3 / -1`; the sentence wraps to three lines at the file's ~100-char prose width):

```diff
-Role→skill ownership is declared in exactly one place: `skills_for_role()` in `claude/fkit-claude.sh`.
+Role→skill ownership is declared in exactly one place: `skills_for_role()` in
+`claude/skills-for-role.sh`, sourced by both `claude/fkit-claude.sh` and the `PreToolUse`
+skill-ownership hook.
```

**The fuller wording was the owner's choice** at the plan gate, over a minimal filename-only swap. The
reasoning taken: naming *why* `claude/fkit-claude.sh` legitimately appears near the function is what stops
the drift from reading as correct again to a future editor, and it matches `claude/README.md:41-43` in
substance — which is what the brief's own verification step 2 asks for.

**`+3 / -1`, not `+1 / -1`, is the wrap, not extra content.** It is one sentence.

**Nothing else in `CLAUDE.md` changed** — not the ADR-012 paragraph above it, and nothing between the
`<!-- fkit:begin-rules -->` / `<!-- fkit:end-rules -->` markers.

## 5. Finding routed to task 0142 — `architecture.md`'s line number is stale

**The brief lists `ai-agents/knowledge-base/architecture.md:154-156` as already correct ✅. It is correct
on the filename and stale on the line number.** It reads:

> **Ownership is declared in exactly one place: `skills_for_role()` at `claude/skills-for-role.sh:35`.**

The function is at **`claude/skills-for-role.sh:48`**, not `:35`.

**Not fixed here, by owner ruling 2026-07-29: it folds into task `0142`.** The owner accepted that a stale
line number in the architecture reference is a live specimen of exactly the failure class 0142
investigates — the `skills-for-role.sh:12-24` mirror checklist not seeing every site a role↔skill
ownership fact is asserted — rather than a separate errand. Fixing it here would also have breached this
task's one-file scope.

**For 0142's author:** the site is `ai-agents/knowledge-base/architecture.md:154-155`; the real location is
`claude/skills-for-role.sh:48`; the assertion's filename is right and only its `:NNN` has drifted. Note the
shape — like `CLAUDE.md:43`, this is **hand-written prose**, a class 0142's inventory question does not yet
name (it currently names *"the generated `CLAUDE.md`/`AGENTS.md` blocks"*).

### Specimen 2 for 0142 — a tracked, byte-identical FIFTH copy (round 2, finding R1)

**`.claude/skills-for-role.sh` is a fifth copy of `skills_for_role()` that the
`claude/skills-for-role.sh:12-24` mirror checklist does not name.** Verified this run:

| Property | Value |
|---|---|
| Tracked in git? | **Yes** — `git ls-files .claude/` lists it (it is the only tracked `.sh` under `.claude/`) |
| Gitignored? | **No** — `git check-ignore` exits 1; `.gitignore` covers only `settings.local.json`, `agents/fkit-*.md`, `skills/fkit-*/` |
| Byte-identical to canonical? | **Yes** — `md5` `72cf34741a4dd1b0c99f0345459d3c30` for both |
| Generated by `fkit-claude-init.sh`? | **No** |
| Sourced by anything? | **No** — check **V8b** proves it is a copy, not a third loader |

**Pre-existing, and not changed here** — the *"declared in exactly one place"* phrase is verbatim at
`db863be`, the brief explicitly instructed preserving it, and task `0124`'s review already examined this
exact file, confirmed it byte-identical, and accepted it (`ai-agents/tasks/done/0124-…/review.md:94-96`).
Codex raised it as `high`; the reviewer downgraded it to `low` on that evidence, and the owner ruled it a
**specimen for 0142** rather than this task's defect.

**Task 0142 now has two specimens from this one small task** — this fifth copy, and
`architecture.md:154-155` above. That is itself the point worth carrying: a **one-line prose fix** surfaced
**two** sites the ownership-fact checklist does not see, which is fairly direct evidence that 0142's
inventory gap is real and not a one-off.

## 6. Verification

> **⚠️ This edit is prose enforced by nothing, and it ships unguarded.** Established by execution this
> run: exactly two tests read `CLAUDE.md` — `test/rules-block-budget.test.js`, which measures the
> **generated block** against `RULES_MAX=4096` and counts markers, and `test/orphan-cleanup.test.js`,
> which mentions `CLAUDE.md` only in a **comment**. **Neither reads line 43 or any ownership prose.**
> Nothing generates the line either: `fkit-claude-init.sh` rebuilds only the region between the markers.
> **`npm test` green means "no repo regression", NOT that this line is enforced.** The V1–V4 greps below
> ran **once, by hand, in this run** — they are **not** a standing guard and nothing re-runs them. This is
> the same untested-prose class task 0142 investigates.

**No `npm test` baseline was taken before the edit.** V6 below is the first suite run of this task; I am
**not** asserting the suite was green beforehand.

### 6.1 V1–V4, exactly as executed

```bash
cd /Users/mark.dolbyrev/Workspace/fkit
fail() { echo "FAIL: $1" >&2; exit 1; }

# V1 (joined-line): the correct claim is present AS A CLAIM, not just as a token
perl -0777 -ne 's/\s+/ /g; exit(/declared in exactly one place: `skills_for_role\(\)` in `claude\/skills-for-role\.sh`/ ? 0 : 1)' CLAUDE.md \
  || fail "new pointer absent (joined-line)"
echo "V1 PASS  new pointer present"

# V2 (joined-line): no 'declared in ... fkit-claude.sh' relation survives
perl -0777 -ne 's/\s+/ /g; exit(/declared in exactly one place:.{0,40}?in `claude\/fkit-claude\.sh`/ ? 1 : 0)' CLAUDE.md \
  || fail "stale claim survives joined-line"
echo "V2 PASS  stale claim gone"

# V3 the edit is OUTSIDE the generated rules block
lb=$(awk '{l=$0; gsub(/^[ \t\r]+|[ \t\r]+$/,"",l); if(l=="<!-- fkit:begin-rules -->") print NR}' CLAUDE.md)
ln=$(grep -n 'skills_for_role' CLAUDE.md | head -1 | cut -d: -f1)
echo "     begin-rules at line $lb ; claim at line $ln"
{ [ -n "$lb" ] && [ -n "$ln" ] && [ "$ln" -lt "$lb" ]; } || fail "edit is inside/after the rules block"
echo "V3 PASS  edit outside the block"

# V4 ground truth still holds
grep -q '^skills_for_role() {' claude/skills-for-role.sh || fail "definition moved again"
grep -q 'skills-for-role\.sh"$'  claude/fkit-claude.sh   || fail "source line moved"
echo "V4 PASS  definition + source line intact"
```

Output, as observed:

```text
V1 PASS  new pointer present
V2 PASS  stale claim gone
     begin-rules at line 47 ; claim at line 43
V3 PASS  edit outside the block
V4 PASS  definition + source line intact
ALL V1-V4 PASS
```

**V3's numbers are the load-bearing ones.** The claim stayed at `:43` while the begin marker moved
`45 → 47`, absorbing the two added wrap lines — which is the direct evidence that the edit is above the
generated block and cannot be overwritten by it.

### 6.2 V5 — scope, plus negative controls

The brief's own verification step 5 (*"`git diff --stat` shows one file changed"*) **cannot pass as
written and was replaced**, with the driver's agreement: the tree already carried the driver's two
`🔲 Backlog → 🔄 In progress` flips before this worker was spawned, so `git diff` shows three files
before any edit of mine. The scoped allowlist below still fails closed on genuine scope creep. It gained
a fourth entry for `worklog.md` — see §7 item 2.

**Two negative controls were added beyond the plan**, because on a task this small the likely defect is a
verification that passes for the wrong reason. Both check the assertions against baseline `db863be`:
V2 must **fire** on the stale baseline, and V1 must **not** pass on it.

Output, as observed:

```text
=== files changed ===
 M CLAUDE.md
 M ai-agents/sprints/sprint-2.md
 M ai-agents/tasks/backlog/0151-correct-claude-mds-stale-skills-for-role-location/brief.md
?? ai-agents/tasks/backlog/0151-correct-claude-mds-stale-skills-for-role-location/worklog.md

V5  PASS  only allowlisted files changed
V5b PASS  CLAUDE.md is the only source-tree change
     CLAUDE.md numstat: 3/1
V5c PASS  CLAUDE.md is +3/-1
NC  PASS  V2 fires on baseline (check is not vacuous)
NC2 PASS  V1 absent at baseline (check tests the change)
ALL V5 + negative controls PASS
```

### 6.3 V6 — `npm test`

**Exit `0`** — `523` tests, `523` pass, `0` fail, `0` cancelled/skipped; `prove-red.sh` hard gate
**PASSED** (baseline green, unmutated copies green, all 7 mutations red their named assertion). Green here
means no repo regression only — see the warning opening §6.

## 7. Decision log — ADR-032 A2 / ADR-019 `:96` (autonomous calls made without asking)

**Fixes applied to source without asking: none.** The one-sentence edit is the approved plan itself, made
under the owner's plan-gate approval, not an unattended fix.

**Two in-plan calls made without stopping, both to the verification harness rather than to source:**

1. **Strengthened V1 from my own approved plan.** *Which finding it answers:* self-verification of the
   harness before running it. *What changed:* my plan's V1 was
   `grep -qF 'in\n`claude/skills-for-role.sh`' … || grep -qF 'in `claude/skills-for-role.sh`' …` — a
   literal embedded newline OR'd with a single-line form. That is exactly the wrapped-grep fragility this
   task documents, and with the fuller wording the claim **does** wrap, so the check's outcome depended on
   guessing the wrap position. Replaced with a joined-line `perl -0777` assertion matching V2's form.
   *Why it qualified:* mechanical, localized, inside the approved plan's own verification step, and an
   obvious winner — the plan already used joined-line for V2, so this makes V1 consistent rather than
   introducing anything new. **It also made V1 strictly harder to pass:** it now requires the full
   *"declared in exactly one place: … in `claude/skills-for-role.sh`"* relation, not merely the filename
   appearing somewhere.
2. **Amended V5's allowlist to admit `worklog.md`.** *Which finding it answers:* a contradiction between
   my approved plan and the build-step instruction. *What changed:* the plan's V5 permitted only
   `CLAUDE.md` plus the driver's two status flips; the driver instructed me to write this worklog, a
   fourth file, which the plan's V5 would have scored as scope creep. *Why it qualified:* the worklog is a
   required loop artifact under ADR-032 A2, not a source change — so admitting it is in-plan intent, and
   refusing the worklog to satisfy a check about *source* scope would have been the wrong reading.
   **Flagged to the driver rather than resolved silently**, per the plan-wins instruction; the check still
   fails closed on any genuinely unexpected file.
3. **Added two negative controls (NC, NC2) not present in the approved plan.** *Which finding it answers:*
   the driver's standing warning that on a task this small the defect, if any, is in the verification
   rather than the edit. *What changed:* V1 and V2 are now each run against baseline `db863be` to prove
   they discriminate — V2 must fire on the stale text, V1 must fail on it. Without these, a
   mis-anchored regex could pass on **both** trees and prove nothing. *Why it qualified:* additive,
   localized, verification-only, and it can only make the gate stricter — it cannot mask a defect.
   **Also added V5b/V5c** (source-tree-only scope, and an exact `+3/-1` numstat) on the same reasoning.

## 8. Change surface

- `CLAUDE.md` — **`+3 / -1`**, one sentence at line 43. The only source-tree change.
- `ai-agents/tasks/backlog/0151-…/worklog.md` — this file (new).
- **Not touched:** `claude/README.md`, `ai-agents/knowledge-base/architecture.md` (§5 finding routed to
  0142 instead), any ADR, `claude/scaffold/`, and anything between the rules markers.
- **No vault write.** No commit, no push. **`fkit-claude-init.sh` was not run**, so the gitignored
  `.claude/` mirror of `CLAUDE.md` is now deliberately stale — the repo-root `CLAUDE.md` is the canonical
  file here and the mirror is regenerated on the next `fkit` launch.
- `ai-agents/sprints/sprint-2.md` and `0151/brief.md` carry the **driver's** `🔲 Backlog → 🔄 In progress`
  flips, made before this worker was spawned. Not mine.

---

# Round 2 — review response (2026-07-30)

**Reviewer verdict: ✅ Ready to merge — 0 defects in the shipped change.** Codex pass FULL, not degraded.
4 findings (3 low, 1 trivial), **all about the record rather than the edit**. The reviewer independently
confirmed all three assertions of the new sentence, including the highest-risk one: **the hook really does
source `skills-for-role.sh`**, so the fix put no new false claim into the file every session reads.
Dispositions owner-ruled 2026-07-30. Verdicts and per-finding actions are in `review.md`'s *Coder response*.

**The shipped sentence did not change in round 2.** `CLAUDE.md` is still `+3 / -1`, byte-identical to
round 1. Every round-2 change is to the **record** (this worklog, `review.md`) and to the **verification
harness**.

## 9. R3 — the fix: the harness now proves what the sentence asserts

**The defect, stated precisely:** the clause *"sourced by both `claude/fkit-claude.sh` and the `PreToolUse`
skill-ownership hook"* was **true but unchecked**. V1's regex stopped at the filename; V4 only checked the
definition plus a launcher grep, and never touched the hook. Worse, V4's
`grep -q 'skills-for-role\.sh"$'` did not require the matched line to be a **`source` command** — a comment
ending in that filename would have satisfied it.

**This is the finding with reuse value beyond this task: a check that stops short of the claim it guards.**
It passes, so it looks like evidence, and it is evidence of something weaker than the sentence says.

What was added:

| Check | What it now proves |
|---|---|
| **V4** *(tightened)* | `claude/fkit-claude.sh` has exactly **one real `source` statement** for the file — anchored `^\s*(\.|source)\s`, so comments cannot satisfy it |
| **V7** *(new)* | `claude/skill-ownership-hook.sh` has exactly one real `source` statement — the hook half of the clause |
| **V7b** *(new)* | the hook is actually **the `PreToolUse` hook on `matcher:"Skill"`**, not merely some script that sources the file — arm-isolated so the sibling `AskUserQuestion` hook on the same line cannot satisfy it |
| **V8** *(new)* | **"both" is exact**: exactly two sourcing sites among tracked files, **and they are the two named** |
| **V8b** *(new)* | nothing sources the tracked `.claude/` copy — so R1's fifth copy is a copy, not a third loader |
| **NC3** | the source-pattern **rejects mentions**: the hook mentions the filename **3×** (a comment, a `# shellcheck source=` directive, and the real `source`) and only **1** is counted |

**NC3 is the control that closes R3 rather than restating it.** A check asserting the hook merely *mentions*
`skills-for-role.sh` would pass on the comment at `:5` and prove nothing about what the hook loads.

## 10. Two defects in my own round-2 fix, both found by re-verification

**The driver predicted this round's defect would hide in the new hook check. It did — twice.**

**Defect 1 — V7b failed on correct wiring.** My first version matched a literal `"PreToolUse"`. The hook
JSON is built inside a double-quoted shell string, so in the file every quote is **backslash-escaped**
(`\"PreToolUse\"`), and the literal pattern cannot match. The check reported `FAIL` against wiring that was
in fact correct. **Fail-closed did its job** — a fail-open check would have shipped silently. Fixed by
de-escaping (`tr -d '\\'`) before matching.

**Defect 2 — V8 passed for the wrong reason, then failed for a third reason.** Run interactively it counted
**2**; run inside the script it counted **4**. Cause: **in this tool's shell, `grep` is a shell function**
(from a Claude Code shell snapshot), and it skips hidden directories. Real `grep` in a script also matched
`.fkit/tmp/codex-0139-err.txt:461` and `.fkit/tmp/codex-err.log:3382` — gitignored (`.gitignore:8`) Codex
error-log output that merely **quotes** the source line.

> **The generalizable lesson, worth more than the fix:** *a verification command typed into the interactive
> shell and the same command inside a script are not the same command.* The interactive one silently used a
> wrapper. Any "I ran the check and it passed" is only as good as the shell it ran in — so the round-2
> harness is a **file**, run as `bash verify-0151.sh`, and that is also what makes its transcript
> reproducible (which is R4's complaint, answered structurally rather than by adding an echo).

**Resolution:** V8 is scoped to **git-tracked** files — the principled scope, matching the sweep's own
scope, and it stops local scratch state from being able to fail a claim about the repo's code. It now
asserts the two sites **by name**, not just by count. **NC5b** proves that pipeline is non-vacuous by
feeding it the tracked list plus one real extra sourcing file and requiring the count to rise 2 → 3.

## 11. Round 2 verification

**§6's "prose enforced by nothing" warning is unchanged and still governs.** The new checks prove the
sentence is **true**; they are **not** a standing guard. Nothing re-runs them, and **no test reads line
43** — `npm test` green still means "no repo regression", not "this line is enforced".

### 11.1 The harness

Run as a file, from the repo root, so `grep` is the real binary (see §10):

```bash
bash /private/tmp/claude-501/.../scratchpad/verify-0151.sh
```

Key definitions (the parts that carry the round-2 fixes):

```bash
# A real `source` statement, NOT a mention — this distinction IS finding R3.
srcstmt(){ grep -cE '^[[:space:]]*(\.|source)[[:space:]]+.*skills-for-role\.sh' "$1" 2>/dev/null || :; }
# Tracked-file scope (see §10 defect 2). MUST run via `bash`, not the interactive shell.
srcfiles_tracked(){ git ls-files -z | xargs -0 grep -lE '^[[:space:]]*(\.|source)[[:space:]]+.*skills-for-role\.sh' 2>/dev/null | sort; }
# De-escape: the hook JSON lives in a double-quoted shell string (`\"PreToolUse\"`).
deesc(){ tr -d '\\' < claude/fkit-claude.sh; }
# Isolate the matcher:"Skill" arm so a DIFFERENT hook on the same line cannot satisfy V7b.
skillarm(){ deesc | perl -0777 -ne 'print $1 if /"matcher":"Skill",(.*?)(?:\{"matcher":|\],"Stop")/s'; }
auqarm(){   deesc | perl -0777 -ne 'print $1 if /"matcher":"AskUserQuestion",(.*?)(?:\{"matcher":|\],"Stop")/s'; }
```

### 11.2 Output — 21 checks, 0 failures, exit 0

```text
--- the sentence's three assertions ---
PASS  V1  claim names claude/skills-for-role.sh (joined-line)
PASS  V2  stale "declared in ... fkit-claude.sh" relation gone
PASS  V3  edit outside the rules block (claim :43 < begin-rules :47)
PASS  V3b claude/skills-for-role.sh defines skills_for_role() exactly once
PASS  V4  claude/fkit-claude.sh has exactly one real source statement
PASS  V7  claude/skill-ownership-hook.sh has exactly one real source statement
PASS  V7b PreToolUse matcher:"Skill" arm invokes skill-ownership-hook.sh
     V8 sourcing sites found (tracked):
       claude/fkit-claude.sh
       claude/skill-ownership-hook.sh
PASS  V8  exactly two sourcing sites, and they are the two named — "both" is exact
PASS  V8b nothing sources the tracked .claude/ copy (R1 is a copy, not a third loader)
--- negative controls ---
PASS  NC1 V1 absent at BASE (tests the change)
PASS  NC2 V2 fires at BASE (not vacuous)
PASS  NC3 source-pattern rejects mentions (3 mentions in the hook, 1 source statement)
PASS  NC4 V8 would catch a third sourcing site (2 -> 3)
PASS  NC5 a mention-only file is NOT counted (the R3 trap, proven closed)
PASS  NC5b V8 tracked-scope pipeline is non-vacuous (2 -> 3 with one added real site)
PASS  NC6 arm isolation works (AskUserQuestion arm excludes the hook)
PASS  NC6b both arms extracted non-empty (V7b/NC6 not vacuous)
--- scope ---
PASS  V5  only allowlisted files changed
PASS  V5b CLAUDE.md is the only source-tree change
PASS  V5c CLAUDE.md is +3/-1
PASS  V5d .claude/ untouched (R1 left pre-existing, per ruling)

checks failed: 0
ALL CHECKS PASS
verify exit: 0
```

### 11.3 `npm test` — round 2

**Exit `0`** — `523` tests, `523` pass, `0` fail; `prove-red.sh` hard gate **PASSED** (baseline green, 5
unmutated copies green, all 7 mutations red their named assertion).

⚠️ **This remains my claim alone, and is not independently confirmed.** The reviewer deliberately did not
re-run the suite, because it invokes init and could write into the tree under judgement. Still no
pre-edit baseline was taken, so green means "no regression observed now", not "green before and after".

## 12. Change surface after round 2

- `CLAUDE.md` — **`+3 / -1`**, line 43. **Byte-unchanged in round 2** (checks V5b/V5c).
- `ai-agents/tasks/backlog/0151-…/worklog.md` — §3 premise correction (R2), §5 second 0142 specimen (R1),
  and §§9–12.
- `ai-agents/tasks/backlog/0151-…/review.md` — **Coder response and Accepted residuals sections only.**
  The *Reviewer findings* section was **not** touched.
- **`.claude/` not touched** (check V5d); `fkit-claude-init.sh` not run; **no vault write**; no commit.
- Verification harness lives in the **scratchpad**, outside the repo — it is not a committed guard, which
  is the point of §11's warning.
