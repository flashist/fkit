# Review — 0202

Task: 0202 — [brief](./brief.md)
File(s) under review: `claude/skills/fkit-sprint-ship-loop/SKILL.md` (+42/−2, 256→296); `<task-folder>/plan.md`, `<task-folder>/worklog.md` (new)
Status: closed-out

**Closed out 2026-08-03 by the owner's ruling** (`AskUserQuestion`, live lead session), on **ADR-034's
work-product bar** — the same call made on `0195` and `0162`. **The limit stands, unsoftened: the three
fixes applied this round (the R2 rewrite, R3, R4) have had NO independent re-review.** The Process-review
worker **declined to declare convergence itself** — it left the header `in-review` precisely because a
coder marking its own just-applied fixes converged is not a review; **the owner made the close call, not
the worker.**

**Ledger key:** resolved by **rule 1** (explicit task-id `0202` → folder match). The driver passed the
task-id deliberately; without it, resolution on this tree would have gone to rule 2 or rule 4 — see
`R2`.

**Reviewers run:** own pass (Claude, Opus 5) + **Codex `codex-cli 0.145.0`**, `codex exec --sandbox
read-only`. **Codex coverage: FULL — no degradation.**

**Round 1 verdict:** ⚠️ **Changes requested — 6 defects (none blocking).** All six are
documentary-accuracy defects in a docs-only change. The load-bearing design call — the driver writes
`plan.md` — is **sound and verified**; the defects are in the *record*, not the *decision*.

---

## Reviewer findings

| #  | Round | Sev | file:line | Claim |
|----|-------|-----|-----------|-------|
| R1 | 1 | medium | `claude/skills/fkit-sprint-ship-loop/SKILL.md:120` | `:120` cites **ADR-020** as support for *"the DRIVER writes `<task-folder>/plan.md`"*. ADR-020's Decision table supports the **timing** (`at plan approval`, `adr-020…:39`) but its own Decision sentence calls these artifacts **"coder-written"** (`:34`), and `:109` names ADR-019's coder loop as the writer. The justification note (`:127-134`) reconciles the change with **ADR-031 only** and never mentions ADR-020. Net: the one ADR cited at the write-site is, on its literal text, the one the change diverges from — unacknowledged. ⚠️ **See the regression flag below — the obvious "fix" recreates `R4b`.** |
| R2 | 1 | medium | `claude/skills/fkit-sprint-ship-loop/SKILL.md:82` | The `review.md` row's ⚠️ says the ledger-key rules *"can fall through to **rule 3**, the git branch name"* and then declares prose and observed behaviour to disagree, *"neither … asserted here as authoritative"*. **Rule 2 is skipped entirely and rule 2 is what governs** (`claude/skills/fkit-stateful-review/SKILL.md:36` — *"Else the task folder name … its `review.md`"*). Every sprint-loop review has `<task-folder>/plan.md` + `worklog.md` in scope, so rule 2 has a referent and resolves to the task folder. Prose and observation **agree**; the row invents a standoff over a knowable fact. Secondary: the ⚠️ is ~75 words / 3 sentences, not the **one clause** the owner's OQ-1 ruling specified, and is the longest cell in the table. |
| R3 | 1 | medium | `claude/skills/fkit-sprint-ship-loop/SKILL.md:81` | Artifact table's `worklog.md` row says *"the **Build** worker, **grown by Verify** + Process-review"*. **The Verify row instructs no write** — `:122` reads only *"run tests …; return pass/fail + diagnosis"*. `grep -n worklog` over the file returns `:81 :82 :121 :124 :267`; only `:121` (Build) and `:124` (Process-review) instruct a write, `:267` is a read. The table asserts a write no step commands — and this is the exact cell the brief warned about (*"do not copy the sibling's rows unchecked"*). |
| R4 | 1 | low | `claude/skills/fkit-sprint-ship-loop/SKILL.md:81` | *"→ what the close-out packet **§5** surfaces"* is a **dangling reference — no §5 exists**. This file's own §5 is *Advance* (`:236`); worklog surfacing is under *Progress reporting (§5.5)* (`:266-268`); the design report's §5 is the whole sprint-loop contract; and the sibling's close-out evidence packet (`fkit-task-ship-loop/SKILL.md:245-258`) is an **unnumbered bullet list**. |
| R5 | 1 | low | `claude/skills/fkit-sprint-ship-loop/SKILL.md:120-121`, `:243-255` | `plan.md` is now persisted **before** the Build spawn, but the exit table has no terminal state for a **Build/Verify/Review worker spawn that fails**. A run that approves, writes `plan.md`, then dies leaves an approved-plan artifact for a task that never built — with nothing in the **skill** telling the next driver what to do with it. The resume guidance exists **only in `worklog.md:60-74`**, which no future driver reads. *Mitigating:* the brief itself directed that guidance to the worklog, and the Plan row rewrites `plan.md` on every approval, so a normal re-run overwrites it. Ordinary plan-rejection does **not** create this state (rejection precedes the write) — verified against `:249`. |
| R6 | 1 | low | `<task-folder>/plan.md:13`, `:15` | `plan.md` §0 calls `fkit-task-ship-loop/SKILL.md:101` the artifact-table **header** and on that basis declares the brief's `:100-104` citation wrong. **Both claims are backwards:** `:100` is the header row, `:101` is the `\|---\|---\|---\|` separator — so the brief's `:100-104` was **correct**, and `plan.md` "corrects" it into an error. `worklog.md:25-33`'s re-verification pass did not catch this, so the "all coordinates re-verified correct" claim is **partially correct**, not clean. |

---

## Coder response

*(coder-owned — reviewer does not write this section)*

*Round 1 processed 2026-08-03 by the sprint-loop **Process-review** worker (spawned `@fkit-coder`) under
the declared-approval marker. Fixes applied under the owner's four dispositions relayed with the spawn
(`AskUserQuestion`, live lead session, 2026-08-03) — not chosen by me.*

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** | Defect (documentary) | **Verified:** `adr-020…:34` reads *"git-tracked, **coder-written**, task-id-keyed artifacts"*; `:39` supports the **timing** only. Per owner disposition: **`SKILL.md:120` keeps its ADR-020 citation; the ADR is what changes** — a dated correction note recording the driver as a sanctioned writer (form per `0143`, extended by `0195`) is **filed as a follow-up**, not written here (this task must not touch any ADR). | deferred → follow-up (owner ruling) |
| R1-codex | **INCORRECT** (Codex's recommended fix) | — | Codex graded R1 High and recommended relaying the approved bytes to a bounded coder to write. **Disproven as applied** and **rejected**: that is a copy across a context boundary — the exact `R4b` operation this task exists to eliminate (`0162/plan.md`, blob `2458a57e`). The reviewer's regression flag is upheld; the owner agreed. Codex's second leg (ADR-031 `:59-63`) was disproven by the reviewer and I concur — `:60-63`'s stated purpose is reviewer independence, not a bar on persisting an approval that happened in the driver's own context. **Delegation is not on the table; do not reopen.** | disproven |
| R2 | **CORRECT** | Defect (documentary) | **Verified against `claude/skills/fkit-stateful-review/SKILL.md:36`** — rule 2 is *"Else the task **folder name** … its `review.md`"*, so the shipped ⚠️ skipped the rule that governs and wrongly claimed fall-through to rule 3. **Rewrote the ⚠️** (`:82`) to name **rule 2** as governing, keep rule 3 as the *neither-resolves* case, and shorten ~75 → ~55 words. **One addition beyond the disposition, stated:** I did **not** write *"rule 2 always resolves"* — mid-run, several tasks' uncommitted `plan.md`/`worklog.md` can make the folder ambiguous → **rule 4** (stop and ask), still never rule 3. | ✅ done |
| R3 | **CORRECT** | Defect (documentary) | **Verified:** `grep -n worklog` → `:81 :82 :121 :124 :267`; only `:121` (Build) and `:124` (Process-review) instruct a write, `:122` (Verify) instructs *"run tests …; return pass/fail + diagnosis"* only, `:267` is a read. **Fixed in place** (`:81`): *"grown by Verify + Process-review"* → *"grown by Process-review"*. | ✅ done |
| R4 | **CORRECT** | Defect (documentary) | **Verified:** this file's `### 5.` is *Advance* (`:236`); the close-out packet is surfaced under *Progress reporting (§5.5)* (`:266-268`). **Fixed in place** (`:81`): *"what the close-out packet §5 surfaces"* → *"what the close-out packet surfaces per task (*Progress reporting*, §5.5)"* — §5.5 matches this file's own in-text section vocabulary (`:116` cites §5.4 for the exit table). | ✅ done |
| R5 | **CORRECT** | Defect (process gap, not documentary) | **Verified:** the exit table (`:245-255`) has a terminal state for a failed **producer** spawn (*Blocked — hand-off didn't land*) but **none** for a failed **Build/Verify/Review** spawn, so an approved-plan artifact can be orphaned; the resume guidance exists only in `worklog.md:60-74`, which no future driver reads. Per owner disposition: **not fixed here** — it needs a real exit-table row, arguably `0203`/`0204` territory. **Filed as a follow-up.** | deferred → follow-up (owner ruling) |
| R6 | **CORRECT** | Defect (in `plan.md`, not the deliverable) | **Verified:** `fkit-task-ship-loop/SKILL.md:100` is the header row, `:101` the `\|---\|` separator — so the brief's `:100-104` was **correct** and `plan.md:13,15` "corrected" it into an error. **Stated plainly:** `worklog.md:23-33`'s *"every coordinate re-measured and confirmed"* was therefore **partially** true, not clean. **Not fixed:** `plan.md` is the verbatim approved-plan artifact — editing it to repair a coordinate would corrupt the very bytes it exists to preserve. **Filed as a follow-up**; the deliverable cites no line number here and is unaffected. | deferred → follow-up (owner ruling) |

**Status-vocabulary gap, surfaced not papered over.** The schema's six values (`pending approval` · `✅ done` ·
`won't fix (frontier)` · `disproven` · `closeout (re-litigation)` · `blocked`) have **no value for "CORRECT,
but the owner ruled the fix out of this task's scope."** `won't fix (frontier)` would falsely record R1/R5/R6
as accepted tradeoffs (and demand residual entries they must not get); `blocked` is untrue. I used
`deferred → follow-up (owner ruling)` — **out of vocabulary, deliberately** — rather than record a wrong
in-vocabulary value. Filed as a follow-up against both stateful-review skills. **Left as shipped by owner
ruling (2026-08-03): it is the evidence for that follow-up.**

### Owner rulings on this round's open items — 2026-08-03, `AskUserQuestion`, live lead session

- **R2 — the departure from the disposition's letter was surfaced, and the owner RATIFIED it.** The
  disposition implied rule 2 simply resolves; the worker checked and found it can be **ambiguous mid-run**
  — this loop never commits, so after the first task ships, several folders carry uncommitted
  `plan.md`/`worklog.md` and resolution falls to **rule 4**, still **never** rule 3. The ⚠️'s conclusion
  holds either way. The owner **declined to overrule**, crediting that the worker refused to write a fresh
  inaccuracy into the very cell `R2` punished for being inaccurate, **and flagged the departure rather than
  sliding it past**. **The shipped text stands as written.**
- **Both new follow-ups filed** (status-vocabulary value, added to **both** schemas together or the ledger
  forks; and the carry-construction both-legs-present check, attached to `0203`).

### ⚠️ Driver-carry defect this round — recorded because the detection mechanism is the lesson

The Process-review spawn prompt stated the approved plan was *"carried BOTH ways — paste and pointer"* and
*"The paste below should match it"*, then **shipped the pointer only — no paste**. The driver owned this to
the owner; it is filed as the follow-up above. It is **the same shape as the round-2 false certification
`0162` exists to prevent**: an assertion of a carry that was not performed.

**The pointer is what made the gap detectable.** With a paste and no pointer — the construction used on
`0158`, `0143` and `0195` — nothing would have surfaced it; the worker would have had bytes it could not
check and no way to know a leg was missing. **Live evidence for the two-legged construction**, produced by
the construction's own first failure.

---

## ⚠️ REGRESSION FLAG — read before acting on R1

Codex graded R1 **High** and recommended: *"it can relay those exact bytes to a bounded coder."*
**Do not apply that.** Relaying the approved bytes to a spawned coder to write is *a copy across a
context boundary* — **precisely the `R4b` operation this task exists to eliminate** (`0162/plan.md`,
blob `2458a57e`, a re-rendering rather than a copy). Codex's recommended fix **recreates the defect
under review.** R1's valid content is **documentary only**: reconcile the `:120` citation with
ADR-020's authorship clause, or record a dated correction note on ADR-020. The *behavior* stays.

Codex's second leg for R1 — ADR-031 `:59-63` *"every role's actual work runs in that role's own fresh
spawned context"* — is **DISPROVEN as applied.** Read in full, `:60-63`'s stated purpose is **reviewer
independence** and not merging *proposal, build, and approval* into one context. Persisting the text of
an approval that happened in the driver's own context is neither a role's *work* nor a merge of those
three. The ADR-031 leg does not carry; the ADR-020 leg does.

---

## Design call — VERIFIED SOUND (the thing I was told to test hardest)

The worker's three supports all check out against the code:

1. **ADR-031 Decision 2's prohibition is specific** — `adr-031…:59` reads verbatim *"It **never writes
   source and never reviews.**"* A plan artifact is neither. ✅
2. **In-file precedent for driver document-writes** — `:112-116` (driver sets `🔄 In progress` *"via a
   spawned worker **or directly**"*) and `:226` (*"the driver writes **only** its own `🚧 Blocked`
   marker"*). ✅
3. **No alternative actor exists** between approval and the Build spawn — the plan worker has returned,
   the Build worker is not yet spawned, and approval lives in the driver's `AskUserQuestion`. ✅ And any
   delegation is strictly worse (see the regression flag).

**Conclusion: delegating this write would be worse, not better.** Recorded so it is not re-opened.

## `carried-not-approved` — correctly NOT closed ✅

Checked against `0162`'s ledger, which states follow-up 1 *"does not close it, and must not be recorded
as if it does."* The shipped text at `:139-144` says exactly that: bolded, under a ⛔, naming it *"an
accepted residual in `0162`'s review ledger"*, and *"it relocates it, it does not remove it."* A hurried
reader **cannot** take this as closing the class — the heading itself is *"what that does and does not
fix"* with two symmetrical bullets. **No finding.** Both reviewers independently agree.

## Re-litigates settled decisions (suppressed)

**None.** Neither reviewer re-raised `carried-not-approved` (`0162` ledger), the prose-enforced plan
gate (ADR-031 honesty clause / ADR-032 D7), the owner's OQ-1 *don't-fix-the-Review-row* ruling, or the
OQ-2 *keep-the-parenthetical* ruling. Codex explicitly returned *"No findings"* on the residual/honesty
wording and on Build ownership. The Step-1 priming held.

**R2 is not re-litigation of OQ-1.** OQ-1 settled the row's **shape** (task-folder path + a one-clause
⚠️) and settled **not** fixing the Review row. R2 attacks the ⚠️'s **factual accuracy**, which the
review request explicitly asked be judged. No behavioral change to the Review row is proposed.

## Scope — verified clean

- `claude/skills/fkit-task-ship-loop/SKILL.md` — **byte-unchanged** (`git status`/`git diff` empty). ✅
- No `.claude/` copy edited; `.claude/skills/fkit-sprint-ship-loop/SKILL.md` still dated Aug 1 17:32 and
  now differs from canonical **only** because canonical was edited → **`fkit-claude-init.sh` was not
  run**. ✅ (Confirms `worklog.md:62-65`: the change reaches no session until the next `fkit` launch.)
- **`0203`'s region byte-identical:** HEAD `:109-116` vs working `:149-156` → `diff` clean. ✅
- **`0164`'s target was CHANGED, knowingly.** `0164`'s brief Option A targets the **Build row worker
  column** (`0164/brief.md:41`, `:101`) — the cell `0202` rewrote. This is the owner's **OQ-4** ruling
  (`0202` lands first, `0164` re-verifies after), not an accident. Reported as fact, not a defect.
- **Verification step 6, substance checked independently** (owner ruled accept-in-substance; not
  re-litigated): `git status --short -- claude/ test/ package.json` → only the sprint-loop `SKILL.md`;
  `git diff --stat -- claude/` → 1 file, +42/−2. The task did change exactly one file. ✅
- Coordinate re-verification: every pre-edit coordinate in `plan.md` §0 confirmed against
  `git show HEAD` (`:102` Plan row, `:103` Build row, `:109` Rules heading, `grep -i artifact` = 0 hits,
  sibling `:102-104`/`:106`/`:142-143`). The worker's own `:31-40` correction to `plan.md` §7 is
  **CORRECT** (block runs `:31-40`, numbered rules `:34-40`). **One coordinate error survived — see R6.**

## `plan.md` fidelity — reads as a copy, unverifiable against the approval

**Cannot be verified against the driver's prompt** — no session transcript exists and the
`AskUserQuestion` marker is empty (`0162` ledger, `claude/askuserquestion-marker-hook.sh:57`). Stated,
not asserted. **What is checkable points to a genuine pre-work plan, not a re-rendering:**

- Estimates **"+28 / −2 lines, 256 → ~282"** (`plan.md:50`); actual is **+42/−2, 296**. A post-hoc
  rendering would have had the real numbers. **Strongest single signal.**
- OQ-1…OQ-4 stand **unanswered** (`:96-101`); the owner's rulings are absent from the file.
- Future tense throughout (*"I will not run"*, *"Will report suite counts"*); pre-edit line counts in §0.
- §5 records the `0164` overlap as a **correction to the brief** — a discovery, not a retelling.

Codex reached the same conclusion independently. **No finding.**

---

## Convergence call

**Round 1 — act, do not close out.** Six **novel** findings, zero re-litigation, zero suppressed. Both
reviewers converged independently on R1/R2/R3, which is the strongest signal in the set. Nothing
oscillates and no prior round exists.

The defects are **cheap and local** — R2/R3/R4 are single-cell text corrections; R1 is a citation
clause or an ADR correction note; R5/R6 are candidate follow-ups. **None blocks the design**, which is
verified sound. Recommend: correct R2/R3/R4 in place, dispose R1/R5/R6 at the owner's discretion.

## Accepted residuals (shared, do-not-re-litigate)

*(none added this round — additions require the owner's explicit disposition)*
