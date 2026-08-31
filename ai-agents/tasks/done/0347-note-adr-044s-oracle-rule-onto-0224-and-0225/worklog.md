# Worklog — 0347 note ADR-044's oracle rule onto `0224` and `0225`

Built by a spawned `fkit-coder` **Build worker** under `/fkit-sprint-ship-loop` (ADR-032 Decision 3),
on the driver's declared-approval marker. `plan.md` (blob `9caefdcea687d1aae1bb2e8c958c5778cf68ec9a`,
26642 bytes — **re-verified against disk before the first edit**, both hash and size matched the
driver's pointer exactly) **is the autonomy boundary**.
Implemented against `HEAD` = `1f33b95` ("Push tasks"). Both target briefs re-measured clean
(`git status --porcelain` empty on both folders) before the first edit.

**Role:** `fkit-coder` — Build worker. Per ADR-044 §Decision 1 this deliverable names **no producing
skill** (it is two append-only brief-text edits), so the Build role is the coder's *"whatever `## Owner`
says"* — and `0224`'s `## Owner` is `fkit-architect`, `0225`'s is `fkit-coder`. **`0224`'s divergence is
the ADR-044 rule working, not a misroute** — which is precisely the thing the note this task writes
exists to stop a future detector from flagging.

## Owner-decision log

- **Plan gate (2026-08-29, `AskUserQuestion` in the driver session):** approved — verbatim label
  **"Approve as written (Rec)"**, which explicitly upheld both of the plan's §4 judgement calls.
  - **§4(a) — carry BOTH figures.** The `8 of 13` ADR-044 §C6 citation *and* the `9 of 14` live
    re-measurement, each dated and method-named. Upheld.
  - **§4(b) — name `0345` as an ordering note, not a hard `Depends on:` bullet.** Upheld.
- **Fixes applied unattended, without asking (ADR-019 / ADR-032 A2 audit obligation):** `none`.
  No review round ran in this spawn; every edit came verbatim from the approved plan's §3.1 / §3.2.
- **Obvious-winner calls made unattended:** `none`. Both judgement calls were pre-settled at the plan
  gate; nothing arose that the approved plan did not already answer.

## The re-measurement (plan §5 step 1) — run FIRST, before any edit

The plan required confirming `9 of 14` still held at Build time rather than pasting its figure blind.
I re-ran the plan's §7 script verbatim under `bash -c` (**not** zsh — zsh does not word-split unquoted
expansions, which corrupted the Plan worker's first run).

**Result: `=> 9 of 14` — unchanged from the plan. No number or date needed updating.**

| | ADR-044 §C6, 2026-08-28 | Plan, 2026-08-29 | **Build re-run, 2026-08-29** |
|---|---|---|---|
| `🔲 Backlog` briefs (population) | 123 | 138 | **138** |
| of which `## Owner: fkit-producer` | 13 | 14 | **14** |
| …carrying ≥1 real `/fkit-*` skill token | 9 | 10 | **10** |
| …carrying ≥1 **producer-exclusive** token | **8** | **9** | **⛔ 9** |

The same 14 rows and the same 9 misrouted rows the plan named, individually reproduced:
misrouted = `0184`, `0187`, `0262`, `0318`, `0320`, `0321`, `0335`, `0340`, `0360`; `0221` is the one
row with a real-but-not-exclusive token (lead-owned `/fkit-sprint-ship-loop`). Producer-exclusive skill
set derived live from `skills_for_role()` and matching the plan exactly: `fkit-heal`,
`fkit-initiate-project`, `fkit-status`, `fkit-task-brief`, `fkit-task-cancelled`, `fkit-task-done`.

**Method** (`conventions/evidence-before-assertion.md`): population = every brief under
`ai-agents/tasks/backlog/` whose `## Status` is `🔲 Backlog`; `## Owner` read with an **anchored**
`^## Owner$` match; every `/fkit-[a-z0-9-]+` token per brief checked against `skills_for_role()` in
`claude/skills-for-role.sh`.

**⚠️ Inherited limb, carried forward unchanged and stated rather than papered over.** ADR-044's
*"none of the N names a **producing** skill"* claim was re-verified by the Plan worker **only for the
new row `0360`**. The other 13 rest on ADR-044's 2026-08-28 per-brief read. **I did not re-verify them
either** — the notes themselves say so in their own text, so the limitation ships with the claim.

## Coordinates re-verified on disk before writing (not inherited from the plan)

- `claude/skills/fkit-sprint-ship-loop/SKILL.md:122` (**Plan**) and `:123` (**Build**) still read the
  literal `` `@fkit-coder` ``; `:126` (**Process review**) is the one reasoned rule-cell today.
  ⭐ **This is what `0225`'s note warns against parsing — it genuinely does not exist yet.**
- `ai-agents/tasks/backlog/0345-carry-adr-044s-build-and-plan-role-rule-into-the-ship-loop-and-agent-text/` exists.
- `ai-agents/knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md` exists.
- `ai-agents/tasks/done/0270-decide-how-the-ship-loop-handles-a-non-coder-owned-task-row/` exists (all
  three relative links in both notes resolve).
- `## Notes` is the **last** `##` section of both briefs (`0224:229`, `0225:112`), which is what makes a
  pure EOF append provably inside `## Notes`.

## Change surface — exactly two files edited, plus this worklog

| File | Edit | Lines |
|---|---|---|
| `ai-agents/tasks/backlog/0224-.../brief.md` | append plan §3.1 at EOF (inside `## Notes`, note starts `:286`) | **+79 / −0** (284 → 363) |
| `ai-agents/tasks/backlog/0225-.../brief.md` | append plan §3.2 at EOF (inside `## Notes`, note starts `:140`) | **+69 / −0** (138 → 207) |
| `ai-agents/tasks/backlog/0347-.../worklog.md` | this file (new) | — |

⛔ **Not touched:** `claude/`, `test/`, `ai-agents/sprints/*`, ADR-038, ADR-044,
`ai-agents/wiki-vault/`, both briefs' `## ID` / `## Sprint` / `## Priority` / `## Status` / `## Owner`,
both briefs' `## Context` / `## What to build` / `## Verification steps`, and both task folders'
locations. **`plan.md` was neither re-authored nor overwritten.** No commit, no push.

⚠️ **Two files were already modified in the working tree when I started and are NOT mine:**
`ai-agents/sprints/sprint-7.md` and `ai-agents/tasks/backlog/0347-.../brief.md`. Recorded so the change
surface is not misread.

## Verification — the brief's ten steps

| # | Step | Result |
|---|---|---|
| 1 | exactly two existing files + this task's folder | ✅ `git diff --numstat` = two `brief.md` rows only (`79/0`, `69/0`) |
| 2 | `−0` outside `## Notes` | ✅ `git diff -U0 \| grep -c '^-[^-]'` → **`0`**; both notes start below their `## Notes` heading |
| 3 | five fields byte-identical to HEAD | ✅ `diff` of the HEAD-vs-worktree field extraction **empty** for both. `0224` = `0224`/`Backlog`/`Unscheduled`/`🔲 Backlog`/`fkit-architect`; `0225` = `0225`/`Backlog`/`Unscheduled`/`🔲 Backlog`/`fkit-coder` |
| 4 | `0224` note: `skills_for_role()`, ADR-044, producing-skill-not-literal-cell | ✅ within the note: `skills_for_role()` ×4, `ADR-044` ×14; `producing skill` at `:356`; literal-cell refusal at `:303` and `:357` |
| 5 | `0224` carries **8 of 13** (+ the live figure) | ✅ `8 of the 13` ×1 **and** `9 of 14` ×1 — both present, per §4(a) |
| 6 | `0225`: rule-cell + **stronger** + strengthened form | ✅ `rule-cell` at `:152`, `:158`, `:162`; `STRONGER`/`stronger` at `:140`, `:158`, `:159`. ⚠️ The plan's literal grep for *"every named Build skill's owner must own it in"* returned **nothing** — a **false negative**: the phrase wraps across `:159–160`. Re-checked newline-normalized and it is **present verbatim**. Recorded rather than reported as a pass |
| 7 | `0225` names `0345` | ✅ ×4 |
| 8 | both notes dated | ✅ `2026-08-29` ×5 in `0224`, ×4 in `0225` |
| 9 | canonical dependency form intact | ✅ `grep -c "Depends on"` → **3 / 3**, exactly the HEAD baseline. Neither note contains the literal string — §4(b) working |
| 10 | tests green, counts named | ✅ see below |

**Step 10, with the aggregate counts the Plan worker could not name:**

- Targeted pair `node --test test/task-id-uniqueness.test.js test/dashboard-contract.test.js` →
  **tests 185, pass 185, fail 0** (17.85s) — **exactly the plan's baseline**.
- Full `node --test test/*.test.js` → **exit 0; tests 792, suites 24, pass 792, fail 0, cancelled 0,
  skipped 0, todo 0** (54.68s). Zero `✖` lines.
- `bash test/prove-red.sh` → **exit 0**, `✓ hard gate PASSED — real + unmutated copy green; each
  mutation reds its NAMED assertion.`
- ⭐ **The failure the Build brief warned about does not exist.** The predicted
  `792 tests, 791 pass, 1 fail` is **stale**: the suite is **792/792/0**. The Plan worker's finding is
  confirmed, now with the counts named rather than inferred from an exit code.

**Extra check (plan §6) — dashboard drift, proven by differential render.** The `/fkit-status`
renderer's derive cell *is* fed from the brief's `## Notes`, so this needed more than an eyeball. I
rendered `bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` twice — once with
HEAD's briefs restored, once with mine — and **diffed the two renders: byte-identical, zero drift.**
Both renders exit 0 and both contain the **same 3** `unparseable` occurrences, all of which are prose
inside *other* rows' brief summaries (board rows 21, 84, 91) and **pre-date this change**. `0224` and
`0225` render unchanged. ⭐ **This is the direct proof that §4(b) was the right call** — a second
`Depends on:` bullet is exactly what would have moved this cell. The two briefs were restored from
backup and **hash-verified byte-identical** afterwards.

## Flagged

- **The inherited-limb caveat above** — 13 of the 14 rows' *"names no producing skill"* status is
  ADR-044's 2026-08-28 read, not re-verified on 2026-08-29. Both notes say so in their own text.
- **The step-6 grep is a false negative for anyone re-running it verbatim** — the asserted phrase wraps
  a line. A re-runner should normalize newlines before concluding the clause is missing.
- **`/fkit-query` was not run** (carried from plan §8 item 6). The task's whole authority is ADR-044,
  `0347`'s brief, and two live measurements, all read at source. Stated, not skipped silently.
- **Nothing committed or pushed.** That remains the owner's.

---

# Process-review round 1 — 2026-08-29

**Role:** `fkit-coder` — **Process-review worker**, spawned by `/fkit-sprint-ship-loop` under the
driver's declared-approval marker (ADR-032 Decision 3 + its 2026-07-22 autonomy amendment). Per
ADR-038 §Decision the Process-review step's role is fixed by the skill it runs
(`fkit-process-stateful-review`, coder-owned, `claude/skills-for-role.sh:55`) — **whoever authored the
deliverable**, and ADR-044 §Decision 3 leaves that untouched. Ran the **full**
`fkit-process-stateful-review` method, steps 0–7, and **none of its per-round owner gate**; `pending
approval` was therefore never used. Ledger:
`ai-agents/tasks/backlog/0347-.../review.md`, round 1, findings **R1–R5**, coverage
**both reviewers measured** (ADR-042 D1 — not a degradation).

## ⭐ Decision log — fixes applied unattended, without asking (ADR-019 `:96` / ADR-032 A2)

Each entry: **which finding it answers · what changed · why it qualified for autonomous application**
(verified `CORRECT` + mechanical/localized + inside the approved plan). ⛔ A list of files is not
enough — these are written so a wrong fix is findable afterwards.

1. **Answers R1** (high, `0224/brief.md:354-357`). **Changed:** the paragraph headed *"What this means
   concretely for half (ii)'s implementation"* was rewritten from the present-indicative *"The detector
   compares the recorded `**Role:**` …"* into the conditional *"Half (ii) still compares nothing … the
   oracle any comparison must use if and when one is built"*. All three ⛔ negatives and the
   `producing skill` / literal-cell tokens were kept, so brief verification step 4's greps still hit.
   **Why it qualified:** verified `CORRECT` against `0224:181-185` (residual **R14**) and the note's
   own `:359-363`; a one-paragraph reword inside the note this task appends, changing no other line;
   and **inside the approved plan** — plan §8 risk 5 names this exact failure mode (*"the strongest
   failure mode of this note is that a future implementer reads … as a claim that half (ii) compares"*)
   and asserts the note guards it. The review proved the guard was undercut by the actionable-labelled
   paragraph. Restoring the plan's own stated intent is not a widening of it.
2. **Answers R2** (high, `0225/brief.md:152-156`). **Changed:** the single §Decision 1 attribution for
   both cells split into two verbatim-quoted rules — Build → §Decision 1, Plan → §Decision 2 (named as
   an owner-ruled **scoped exception to ADR-038**, ND3) — plus a new ⛔ block recording the
   `/fkit-plan-task` collision (coder-exclusive, `claude/skills-for-role.sh:55`, all seven role lists
   read). **Why it qualified:** verified `CORRECT` against ADR-044 `:173-193` and `:387-394`; localized
   to one paragraph of the note; and **inside the approved plan** *as bounded by a live owner ruling* —
   see the ruling entry below. The plan's §3.2 text mis-stated the ADR it was written to record; a
   cite correction to the thing being recorded is the plan's own purpose.
3. **Answers R3** (medium, `0225/brief.md:162-164`). **Changed:** *"The existing rule stands and covers
   it"* replaced with the measured truth — `:82-83` and verification step 3 guard **whole-table**
   vacuity only, and the three-assertion green path (Review + Process-review + Close) is spelled out —
   plus the ⛔ per-cell replacement requirement, stated as **replacing** the stale row-count guard,
   *"it does not drop it"*. **Why it qualified:** verified `CORRECT` by tracing the parse against the
   live table `claude/skills/fkit-sprint-ship-loop/SKILL.md:120-127`; localized to the tail of one
   paragraph; and in-plan — the plan asserted a coverage claim that is false, and correcting a false
   claim inside the note is not a scope change.
4. **Answers R4** (low, `0225/brief.md:177-179`). **Changed:** the parenthetical *"§Decision 3 and §C4
   scope the change to Build alone"* → keeps the true half (§Decision 3 for Verify) and replaces the
   false half with ⚠️ *"Not 'Build alone': §Decision 2 moves **Plan** as well"* plus §C4's own sentence
   quoted verbatim. **Why it qualified:** verified `CORRECT` against ADR-044 `:195-197` and `:387`;
   two lines; in-plan (cite accuracy within the note).
5. **Answers R5** (low; a defect in the **plan's verification method**, not the deliverable).
   **Changed: nothing in either brief** — R5's own ⛔ *"do not reword the note to satisfy the grep"* was
   followed. The corrected check was adopted and run instead (below). **Why it qualified:** the action
   is a worklog record, not an edit.

**Obvious-winner calls made unattended:** `none`. Every fix above answers a verified `CORRECT` finding;
no option-weighing arose that the findings and the owner ruling did not already settle.

## ⭐ Owner ruling carried into R2's fix

- **2026-08-29, `AskUserQuestion` in the driver session**, on the reviewer's own surfaced question.
  **Verbatim option label: "Flag the collision only (Rec)."** Described to the owner as: the note
  records that the Plan/`/fkit-plan-task` collision exists and leaves the carve-out to `0225`'s own
  plan gate, because `0347`'s scope is to record what ADR-044 changes.
- **How it was applied, exactly:** the note now names the collision, its evidence, and the ⛔
  instruction *"Do not read this note as declaring the Plan row exempt"*, and states in terms that the
  resolution is `0225`'s plan-gate decision. **The ruling's label is quoted in the brief itself** so a
  later reader can find the authority rather than infer it. ⛔ **No exemption was declared and `0225`'s
  assertion shape was not settled here.**

## ⛔ N1 — a novel finding I raised and did NOT fix. Returned as `NEEDS-DECISION`.

**What:** `0224`'s note scopes its oracle to Build and ⛔ instructs *"Do not widen this note past
Build"* (`:313-314`). But `0224` half (ii) mandates a `**Role:**` line *"at the head of **every**
worklog round"* (`:157`) — the **Plan** round included — and ADR-044 **§Decision 2** moves the Plan
role too. So the oracle as stated is **incomplete for Plan rounds**, and after this round `0225`
carries §Decision 2 while `0224` tells the implementer not to.

**Severity: low**, derived, not inherited — the gap bites only if the hypothetical comparison of R1 is
ever built, and R14 says nothing compares today. **Nothing in the `0224` note is false**; it faithfully
mirrors ADR-044 §C3, which itself scopes `0224`'s widening to Build.

**Why I did not fix it:** there is no additive fix. Naming Plan **is** widening the note past Build,
which reverses an explicit ⛔ line in the plan text the owner approved verbatim. That is a judgment
call outside the approved plan, so the worker stops (ADR-019 / ADR-032 A2: *"when in doubt about the
shape, return `NEEDS-DECISION`"*). ⛔ **`0224` was edited for R1 only.**

## Verification re-run after the fixes — what I actually measured

⚠️ **`npm test` was NOT run end to end.** It now runs `test/prove-red.sh` to completion, which the
driver's own brief puts at **well over ten minutes**. I ran `node --test test/*.test.js` (the whole
suite) instead and say so rather than claiming the hard gate. **The mutation gate is therefore
unverified by me this round**; the driver's pre-change baseline had it `PASSED`, and my change surface
is two markdown briefs, which `prove-red.sh` does not mutate.

| # | Brief verification step | Result after fixes |
|---|---|---|
| 1 | exactly two existing files + this task's folder | ✅ `git diff --numstat` → `0224` **82/0**, `0225` **95/0**; no other file outside `0347/`'s folder is mine |
| 2 | `−0` outside `## Notes` | ✅ `git diff -U0 \| grep -c '^-[^-]'` → **`0`** (still a pure append; every fix rewrote lines that were themselves added by this task, so HEAD loses nothing) |
| 3 | five header fields byte-identical to HEAD | ✅ `diff` of the HEAD-vs-worktree field extraction **empty** on both. `0224` = `0224`/`Backlog`/`Unscheduled`/`🔲 Backlog`/`fkit-architect`; `0225` = `0225`/`Backlog`/`Unscheduled`/`🔲 Backlog`/`fkit-coder` |
| 4 | `0224` note: `skills_for_role()`, ADR-044, producing-skill-not-literal-cell | ✅ `skills_for_role()` ×6, `ADR-044` ×14; `producing skill` at `:358`; literal-cell refusal at `:303` and `:359` |
| 5 | `0224` carries **8 of 13** (+ the live figure) | ✅ `8 of the 13` ×1 **and** `9 of 14` ×1 — plan §4(a) intact |
| 6 | `0225`: rule-cell + **stronger** + strengthened form | ✅ `rule-cell` ×5, `stronger`/`STRONGER` ×3. ⚠️ **R5's corrected check** — `tr '\n' ' ' < brief \| grep -c "every named Build skill's owner must own it in"` → **1**. The plan's literal `grep -n` still returns **0**: the clause wraps `:159-160` between *"Build"* and *"skill's"*. ⛔ Anyone re-running step 6 must normalize newlines first; the literal grep is a **false negative**, not a missing clause |
| 7 | `0225` names `0345` | ✅ ×6 |
| 8 | both notes dated | ✅ `2026-08-29` ×5 in `0224`, ×6 in `0225` |
| 9 | canonical dependency form intact | ✅ `grep -c "Depends on"` → **3 / 3**, unchanged from HEAD. No fix introduced the literal string — plan §4(b) still holds |
| 10 | tests green, counts named | ✅ targeted pair `node --test test/task-id-uniqueness.test.js test/dashboard-contract.test.js` → **tests 185, pass 185, fail 0** (17.9s), exactly the baseline. Full `node --test test/*.test.js` → **tests 792, suites 24, pass 792, fail 0, cancelled 0, skipped 0, todo 0** (54.6s), zero `✖` lines — matching the driver's pre-change 792/792 |

**Dashboard drift, re-proved by differential render after the fixes.** Rendered
`bash claude/skills/fkit-status/dashboard.sh ai-agents/sprints/backlog.md` twice — once with HEAD's
two briefs restored, once with mine — and **diffed: byte-identical, zero drift.** Both exit 0. The two
briefs were restored from copies and **`shasum`-verified byte-identical** afterwards.
⚠️ **One honest discrepancy with the Build round's record:** that round counted **3** `unparseable`
occurrences in the render; I count **0** in both of mine. I did not chase it — the board's own state
moved between rounds (`ai-agents/sprints/sprint-7.md` is modified in the working tree by neither
round). **What the check proves either way is the differential, which is zero**; the absolute count is
not mine to assert.

## Change surface — this round

| File | Edit |
|---|---|
| `ai-agents/tasks/backlog/0224-.../brief.md` | R1 only — one paragraph in the appended note reworded (**+3** vs the Build round; note total now **+82/−0**) |
| `ai-agents/tasks/backlog/0225-.../brief.md` | R2, R3, R4 — three paragraphs in the appended note (**+26** vs the Build round; note total now **+95/−0**) |
| `ai-agents/tasks/backlog/0347-.../review.md` | *Coder response* rows R1–R5 + N1, header `Status`, *Accepted residuals* note. ⛔ **The *Reviewer findings* section was not touched** |
| `ai-agents/tasks/backlog/0347-.../worklog.md` | this section |

⛔ **Not touched:** `claude/`, `test/`, `ai-agents/sprints/*`, any ADR, `ai-agents/wiki-vault/`, both
briefs' header fields and every section other than `## Notes`, `plan.md`, and both task folders'
locations. **Nothing committed, nothing pushed** — I ran no `git commit` and no `git push` this round.
No secrets were written.

⚠️ **Post-close pointer repair — 2026-08-29, appended after this section was written.** The
**`+82/−0`** and **`+95/−0`** totals recorded at `:259-260` above are **unchanged and still measure
true** — read on for why the tree can differ from the reviewed bytes without the figures moving.
After `0347` closed and its folder moved to `ai-agents/tasks/done/`, the inbound links from
`0224:293` and `0225:147` back to this brief still read `../0347-…` and no longer resolved. On the
owner's ruling of **2026-08-29** — option label verbatim: **"Repair both hrefs now (Rec)"** — a
producer re-pointed both to `../../done/0347-…/brief.md`, completing `/fkit-task-done` step 5's
sibling-link rule.
⛔ **No reviewed content changed** — one href on one line in each brief, nothing else. Both notes'
substance is byte-identical, the five header fields are untouched, and `grep -c "Depends on"` is
still **3/3** in both briefs.
📏 **Why the figures did not move:** both repaired lines were themselves *added* by this task, so the
repair rewrites an added line rather than adding or removing one. `git diff --numstat HEAD` still
reports **`82 0`** and **`95 0`**, and the briefs' line counts are unchanged (**366** / **233**).

---

# Process-review continuation — N1 finalisation (2026-08-29)

Spawned by `/fkit-sprint-ship-loop` under the driver's declared-approval marker. **One bounded
finalisation**, no new review round: R1–R5 stay `✅ done` and were not re-opened; the *Reviewer
findings* section was not touched.

## The owner's ruling — verbatim

Put to the owner live via `AskUserQuestion` in the driver's session, **2026-08-29**. Option label,
**verbatim**:

> **"Leave 0224 as approved (Rec)"**

Presented to them as: *the note faithfully mirrors ADR-044 §C3, which itself scopes `0224`'s widening
to Build — nothing in it is false. Cost, stated: an implementer building the Plan-round oracle from
`0224` alone gets Decision 1 only, and would flag a lawful architect-planned row as a misroute — the
exact failure the note exists to prevent, one step over.*

⛔ **So `0224`'s note text does not change.** No clause naming §Decision 2 was added; *"Do not widen
this note past Build"* stays as approved. The owner accepted the asymmetry with its cost stated.

## What I did with it

**N1 is no longer `blocked` — it is a confirmed, owner-accepted incompleteness.** Three edits to
`review.md`, per `fkit-process-stateful-review`'s prescribed shapes:

1. **N1's *Coder response* row re-statused** `blocked` → **`won't fix (frontier)`** — the prescribed
   value for a confirmed intended tradeoff; no ad-hoc label used. Its Action now records the ruling,
   quotes the option label verbatim, and dates it 2026-08-29. The Defect/Frontier cell keeps the
   original round-1 derivation (*defect (low)*, an incompleteness rather than a false statement) and
   appends the owner's reclassification to a frontier-move — so the ledger shows the change of
   disposition rather than rewriting history.
2. ***Accepted residuals* entry for N1 written in full prescribed shape** — **What / Why (structural) /
   Re-raise only if**. *Why* is structural: ADR-044 §C3 itself scopes `0224`'s widening to Build, so the
   note mirrors its source faithfully; the rejected alternative (naming Plan) *is* the widening, and
   would depart from both §C3's scoping and the ⛔ line in the owner-approved plan text.
3. **The false standing note repaired.** Round 1's residuals section stated *"N1 is `blocked`, not
   accepted — ⛔ do not read its row as a residual"*. That is now false and was **removed**, replaced by
   the residual entry itself; the surviving sentence about the two `0224` residuals (R14, R18) is
   unchanged apart from *"Two"* → *"Two further"*.
4. **Ledger header set to `Status: closed-out`** (2026-08-29), with the earlier ⚠️ *NOT closed-out*
   reason **explicitly superseded in place** rather than silently deleted. `Coverage:` was not touched —
   it is the reviewer's field.

### The *"Re-raise only if"* condition I wrote — and why

I wrote it as a real, checkable trigger rather than a restatement. It fires on **either**:

- **(a)** an implementation of `0224` half (ii) actually goes past the presence test and **compares** a
  recorded `**Role:**` to a rule-derived role for a round other than Build — i.e. residual **R14** no
  longer holds for the Plan round. This is the condition under which the accepted cost stops being
  hypothetical: the Build-only oracle becomes genuinely insufficient.
- **(b)** `0345` lands its **Plan rule-cell** — checkable as: the **Plan** row of the step table in
  `claude/skills/fkit-sprint-ship-loop/SKILL.md` cites ADR-044 §Decision 2 and contains the words
  *"scoped exception"* (`0345`'s brief `:80-82`, `:139-140` require exactly that) — **and** `0224` is
  still open. From that point the live table a `0224` implementer reads carries Plan-as-a-rule while
  the note tells them not to widen, which is a different situation from the one the owner ruled on.

Plus an explicit ⛔ **do-not**: re-raising merely because the note omits §Decision 2 is re-litigation —
that omission *is* the ruling.

## Decision log — what I applied without asking

Standing approval: the driver's declared-approval marker (ADR-032 Decision 3 + its 2026-07-22 autonomy
amendment; ADR-019 discipline). Every item below is **mechanical and localized, inside the approved
scope of this spawn** (`review.md` + `worklog.md` in `0347`'s folder only), and each is the direct,
non-discretionary consequence of an owner ruling already made — not a judgment call of mine.

| # | Answers | What changed | Why it qualified |
|---|---------|--------------|------------------|
| 1 | N1 | Status `blocked` → `won't fix (frontier)`; Action records the ruling verbatim + dated | Mechanical: the skill prescribes exactly this status for a confirmed intended tradeoff; the owner confirmed it. In-scope, `review.md` only |
| 2 | N1 | *Accepted residuals* entry added in full What / Why / Re-raise shape | Mechanical consequence of (1) — the skill requires the residual entry whenever a row goes `won't fix (frontier)`. The *Re-raise only if* wording is mine, written as instructed |
| 3 | N1 | Removed the round-1 note asserting N1 is *"`blocked`, not accepted"* | Repair of a now-false statement; leaving it makes the ledger self-contradictory. Localized to the sentence that became untrue |
| 4 | — | Header `Status: in-review — ⚠️ NOT closed-out` → `closed-out`, old reason superseded in place | The header's own convention: set `closed-out` once every novel finding is done/disproven/accepted and nothing blocking remains. That condition is now met |

**No obvious-winner calls** beyond the above, and **no `NEEDS-DECISION`** raised this spawn.

## What I ran, and what I did not

- ⛔ **I ran no tests this round, and I do not claim any.** My change surface is **two markdown files
  inside `0347`'s task folder** — no source, no `test/`, no `claude/`. The last measurements on record
  are the driver's pre-round **792/792, hard gate PASSED, exit 0**, and the prior Process-review
  spawn's post-fix `node --test` **792/792**. Both are **inherited, not re-measured by me.**
- **Measured this round:** `git diff --numstat` on the two briefs → `0224` **82/0**, `0225` **95/0** —
  **identical to the prior spawn's recorded figures**, confirming both briefs are byte-unchanged by
  this spawn. `git status --porcelain` shows both still ` M` (modified by the earlier rounds only).
- **Checked this round:** `grep` over `review.md` for surviving `blocked` / *not accepted* claims →
  the only two hits are the header's explicitly-superseded quotation of the old reason and N1's Action
  cell saying *"now settled — not blocked"*. **No surviving claim that N1 is blocked or unaccepted.**

## Change surface — this spawn

| File | Edit |
|---|---|
| `ai-agents/tasks/backlog/0347-.../review.md` | header `Status:` line; N1's *Coder response* row (Defect/Frontier tail, Action, Status); *Accepted residuals* section. ⛔ ***Reviewer findings* not touched**; R1–R5 rows not touched; `Coverage:` not touched |
| `ai-agents/tasks/backlog/0347-.../worklog.md` | this section |

⛔ **Not touched:** `0224`'s and `0225`'s briefs (**no brief text changed at all this spawn**),
`plan.md`, `claude/`, `test/`, `ai-agents/sprints/*`, any ADR, `ai-agents/wiki-vault/`. No folder
moves. **Nothing committed, nothing pushed** — I ran no `git commit` and no `git push`. No secrets
were written.
