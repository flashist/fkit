# Review — add-backlog-board-default-for-unsprinted-task-briefs

Task: [`ai-agents/tasks/done/add-backlog-board-default-for-unsprinted-task-briefs.md`](../tasks/done/add-backlog-board-default-for-unsprinted-task-briefs.md)
Plan: [`ai-agents/plans/add-backlog-board-default-for-unsprinted-task-briefs.md`](../plans/add-backlog-board-default-for-unsprinted-task-briefs.md)
File(s) under review: `ai-agents/sprints/backlog.md` (new) · `claude/skills/fkit-task-brief/SKILL.md` · `claude/skills/fkit-task-done/SKILL.md` · `claude/skills/fkit-task-cancelled/SKILL.md` · `ai-agents/README.md` · `claude/scaffold/ai-agents/README.md`
Reviewers (round 1): fkit-reviewer (own pass) + Codex `codex-cli 0.144.4` (adversarial) — **both ran; coverage is full**
Status: in-review

## Reviewer findings

| #  | Round | Sev    | file:line | Claim |
|----|-------|--------|-----------|-------|
| R1 | 1     | high   | `claude/skills/fkit-task-brief/SKILL.md:146-149` · `ai-agents/sprints/backlog.md:17-19` | **The `➡️ Moved` pull-into-a-sprint convention is under-specified and, executed literally, manufactures permanent drift.** Both places say only "add the row to that sprint plan and flip the row here to `➡️ Moved to [Sprint N](sprint-N.md)`". Neither says to update the **brief's own `## Sprint` field** from `Backlog` to `Sprint N`. `dashboard.sh:571-580` (rule 2) compares `moved_target` against the brief's `## Sprint` and treats disagreement as real drift. **Reproduced empirically** on a scratch copy of `ai-agents/`: flipping one row exactly as specified emits `drift disagreement ? plan="➡️ Moved to [Sprint 2](sprint-2.md)" brief_sprint="Backlog (unsprinted)" moved_target="Sprint 2"`, and because `mark_drift` forces a drifted row to render, the moved row **stays visible on the backlog board forever** instead of being hidden as a closed row. Adding the brief-side `## Sprint` update clears both (re-run: row gone, no drift). Raised by both reviewers. |
| R2 | 1     | medium | `claude/skills/fkit-task-brief/SKILL.md:148` · `ai-agents/sprints/backlog.md:18` | **The specified `Moved` marker is noncanonical.** `task-status-vocabulary.md:19` defines the marker as `➡️ Moved to [Sprint N](…) — priority M` and states "**No other value is valid.**" Both new sites specify it without the `— priority M` component. The destination sprint does rank the task, so the value is available at the moment the transition happens. Not a runtime break — `dashboard.sh:534-535` only requires a parseable target (`moved-without-target`) — but `fkit-task-done/SKILL.md:91-95` narrates `➡️ Moved to Sprint 2 — priority 7` as the shape it must preserve byte-identically, so the new convention and the mover now describe different rows. Raised by Codex; verified. |
| R3 | 1     | medium | `claude/skills/fkit-task-brief/SKILL.md:132-134` | **The create-if-absent path is unexecutable on its first run in a consuming project.** It says "copy the structure from the existing board rather than inventing a new one" — but the branch only fires when no board exists, and per owner ruling 2 no scaffold template ships. `claude/scaffold/ai-agents/sprints/` contains only `.gitkeep` and `done/`. In a fresh project the agent is told to copy a file that is absent, and must therefore invent parser-critical structure (the exact `## Status` heading and 4-column table `dashboard.sh` hard-fails without) while being instructed not to invent. Dogfooding hides this: here the board now exists. Raised by Codex; verified against the scaffold tree. **The fix is not a scaffold template** (ruling 2) — it is for the skill text to carry the required structure inline. |
| R4 | 1     | medium | `claude/skills/fkit-task-brief/SKILL.md:159-160` | **The declared write surface contradicts the new behavior.** Step 8 still closes with "This skill creates **new Markdown briefs** and optionally edits **one sprint plan**. That is its whole write surface." After this change every no-sprint invocation **mandatorily** creates or edits `ai-agents/sprints/backlog.md` — a file whose own header (`backlog.md:3`) declares "**This is not a sprint.**" So the authority boundary statement now excludes the skill's most common write. Step 7 was rewritten; step 8's summary of it was not. Raised by Codex; verified. |
| R5 | 1     | medium | `claude/skills/fkit-task-done/SKILL.md:111-112,141-142` · `claude/skills/fkit-task-cancelled/SKILL.md:124-125,147-149` | **Both movers retain the now-false premise that unsprinted tasks have no board row.** task-done:111 "(an unsprinted task has no board row at all)"; :141-142 "the task may be unsprinted / backlog-only … report that no sprint status row was found"; the report wording at :127-129 hard-codes `(no sprint board reference existed to update)`. Task 67's new invariant is "every brief gets a row, always" (`SKILL.md:125`). Post-67 a backlog task with zero board references is no longer the normal unsprinted case — it is **missing backlog-board state**, i.e. a finding to report, not a state to normalize. The movers still teach the opposite. Behaviorally the zero-reference path is defensive and does not break; the defect is that the skills now teach a false model of the world. Raised by both reviewers. |
| R6 | 1     | medium | `claude/skills/fkit-task-done/SKILL.md:48` · `claude/skills/fkit-task-cancelled/SKILL.md:56` | **A sixth phantom-name site survived the sweep, one line from an edited line.** Both movers still enumerate the `## Sprint` field's example values as "(e.g. `Sprint 4`, `Sprint backlog`, `Backlog (unsprinted)`)". `Sprint backlog` is the same phantom this task set out to eliminate, and the list omits the new canonical value `Backlog` that `fkit-task-brief/SKILL.md:47` now mandates. The task's own completeness criterion ("no residual `sprint-backlog.md` reference outside the deliberate warnings", plan:39) was scoped to the exact hyphenated string and so did not catch the spaced variant teaching the same wrong name. |
| R7 | 1     | medium | `claude/skills/fkit-task-brief/SKILL.md:47` vs. the 5 backfilled briefs | **The skill text and the board's own data disagree on the canonical `## Sprint` value.** The skill now mandates `## Sprint: Backlog`, but all five backfilled briefs still read `Backlog (unsprinted)` (verified: `add-worked-example…`, `decide-whether-fkit-needs-a-tester-agent`, `extend-prove-red-to-reach-init`, `gate-read-side-symlink-hazard-in-init`, `gate-symlink-escape-in-init-intake-write`). Two values now denote one state, and the board's five exemplars all use the one the skill does not specify. Harmless today (nothing exact-matches the value on this path). **Forward hazard worth flagging now:** when task 68 gives the board a sprint identity, `PLAN_SPRINT` becomes non-empty and `dashboard.sh:582` rule 1 starts comparing it against the brief's `## Sprint`. If the board resolves to `Backlog` while briefs say `Backlog (unsprinted)`, **every backlog row takes rule 1's silent skip and real status drift on those rows is hidden**. Normalizing the five briefs now de-risks task 68. |
| R8 | 1     | low    | `ai-agents/sprints/backlog.md:27-29` | **A prose claim about the briefs is overstated.** The Priority section states "the briefs themselves record `## Priority: Unscheduled` to match". Four do; `extend-prove-red-to-reach-init.md:7` reads `Unscheduled — high-value (see Context: the un-red-proved fixes are exactly the ones that shipped broken)`. The board's unranked design is unaffected and the value is arguably still `Unscheduled` plus a note, but the sentence asserts an exactness that one of five backing files does not have, and `fkit-task-brief/SKILL.md:135-136` mandates the exact value. Raised by Codex; verified across all five. |

### Attacks that found nothing — verified negative

Checked directly and **sound**; recorded so a later round does not re-derive them.

- **Backfill membership is exactly right (the coder's question 1).** Independently enumerated the
  `## Sprint` field of all 26 briefs in `ai-agents/tasks/backlog/`: **exactly five** read
  `Backlog (unsprinted)`, and those five and only those five have rows on the board. No sprint-assigned
  brief is included; no unsprinted brief is missing. The one apparent collision —
  `gate-read-side-symlink-hazard-in-init.md` also appearing in `sprint-2.md` — is **prose only**
  (`sprint-2.md:549,1141`, both explicitly labelling it *unsprinted*), not a Status-table row. Both
  reviewers independently reached this conclusion.
- **The "designed exception" wording closes the hole (question 2).** Read adversarially as an attempt
  to license other sprint files, it does not yield: `SKILL.md:50-55` names exactly one path, states
  "**The exception is exactly one filename**", and re-asserts "Any other missing sprint still stops and
  asks". Both reviewers tried and failed to break it.
- **Both movers genuinely reach `backlog.md` (question 3) — the coder's dry-read holds.** Their step-4
  list `ai-agents/sprints/*.md` matches `backlog.md` (top-level, `.md`), and their documented command
  `grep -rn "<file>.md" ai-agents/sprints/ ai-agents/tasks/` (`task-done:70`, `task-cancelled:81`) is
  genuinely recursive. `backlog.md:23`'s claim that they "sweep `ai-agents/sprints/` recursively" is
  therefore **accurate**, not the overstatement it looks like. Verified by both reviewers.
- **The `➡️ Moved` row is handled correctly by the movers once a task is later completed.**
  `task-done/SKILL.md:88-95` scopes moved rows to pointer-repair-only ("never flip a `➡️ Moved` row to
  `✅ Done`") generically, not only for `sprints/done/`, so a backlog moved row gets its href repaired
  and its claim left intact. No finding.
- **The filename is genuinely outside the glob.** `ls ai-agents/sprints/sprint-*.md` resolves only
  `sprint-2.md`; `backlog.md` does not match. The load-bearing design fact holds, and no file in the
  diff introduces a `sprint-backlog.md` outside the two deliberate warnings.
- **No surviving live `sprint-backlog.md` reference.** Repo-wide grep returns only the two deliberate
  warnings (`fkit-task-brief/SKILL.md:142`, `backlog.md:7`), the task brief and plan, the worklog, and a
  historical note in a `tasks/done/` brief. All five live references are fixed. (The *spaced* variant is
  R6.)
- **Both READMEs are byte-identical on the changed line.** Confirmed independently.
- **The two task-68 drifts are not task-67 defects** (the coder's direct question). `unresolved-plan-sprint`
  and the `?` FACTS keys both follow from the board deliberately having no `Sprint N` identity and no
  numeric priority — the design points ruled on for this task. Neither breaks anything today. **But see
  R7:** the `Backlog` vs `Backlog (unsprinted)` divergence turns the first one into a silent
  drift-hiding hazard the moment task 68 resolves the board's identity, so R7 is best fixed before 68.

## Re-litigates settled decisions (suppressed)

Nothing was suppressed this round — both reviewers respected the priming. Recorded for future rounds:

- **Scope of the `sprint-backlog.md` fix** — owner ruling: fix all 5 now, inside task 67. Not scope
  creep. Re-raise only if a *sixth* live site is found (R6 is exactly that case, and is raised as new).
- **No scaffold board template** — owner ruling: an empty board makes `dashboard.sh` exit 1 (false
  "malformed plan"), so the board is created on demand. **R3 must not be answered with a template.**
  Re-raise only if `dashboard.sh` stops hard-failing on a zero-row board.
- **`drift unresolved-plan-sprint` and `?`-keyed FACTS on the backlog board** — task 68's declared
  scope. Re-raise only if shown to break something today (checked; it does not).
- **`brief-missing-status` on `gate-read-side-symlink-hazard-in-init.md`** — deliberately reported, not
  repaired; brief content is producer territory. Re-raise only if the producer declines to own it.

## Coder response

<!-- CODER-OWNED — the reviewer does not write this section. -->

**Round 1 — coder verdicts, 2026-07-18.** Every finding verified against the code before acting.
**All 8 CORRECT, none disputed, all 8 fixed.** Four needed an owner ruling (R2, R5, R6, R7) and were
escalated rather than applied autonomously; the owner ruled on all four the same day.

| #  | Verdict | Defect / Frontier | Action | Status |
|----|---------|-------------------|--------|--------|
| R1 | **CORRECT** (high) | Defect | **Reproduced independently before acting** — following my own convention literally emitted `drift disagreement … brief_sprint="Backlog (unsprinted)" moved_target="Sprint 2"`, and the row stayed permanently visible. The pull-into-a-sprint convention is now **three mandatory edits**, with the brief-side `## Sprint` update called out as the one that gets forgotten and why. Fixed in both `fkit-task-brief/SKILL.md` and the board header. | **fixed** |
| R2 | **CORRECT** | Defect | **Owner ruled: follow the vocabulary.** Marker is now `➡️ Moved to [Sprint N](sprint-N.md) — priority M`, with `M` explicitly the priority the task receives in Sprint N — so the component is meaningful precisely when the marker is written, and no vocabulary amendment was needed. | **fixed** |
| R3 | **CORRECT** | Defect | "Copy the existing board" is impossible on first run. The skill now carries the **required structure inline**, with the `## Status` heading and four-column table marked load-bearing (not a scaffold template — owner ruling 2 stands). | **fixed** |
| R4 | **CORRECT** | Defect | Step 8's write surface rewritten: exactly one board, sprint plan **or** `backlog.md`, and **a board edit is not optional** — every brief gets a row or the work is invisible, which is the gap this task closes. | **fixed** |
| R5 | **CORRECT** | Defect | **Owner ruled: fix now.** Both movers' "an unsprinted task has no board row" replaced — post-67, zero references is **itself worth reporting**, not the expected case. | **fixed** |
| R6 | **CORRECT** | Defect | **My miscount, and I reported it to the owner as 5 sites when there were 6.** The 6th (`Sprint backlog` as a `## Sprint` example in both movers) is corrected to `Backlog`. | **fixed** |
| R7 | **CORRECT** | Defect | **Owner ruled: normalize the briefs** (brief content is normally producer territory — escalated for that reason). All 5 backfilled briefs now read `## Sprint: Backlog`, matching the skill. This also disarms the rule-1 **silent skip** the reviewer identified as arriving with task 68. | **fixed** |
| R8 | **CORRECT** | Defect | Board header no longer claims every brief reads exactly `Unscheduled`; it records that a free-text qualifier may follow and **never** becomes a number in the Priority column. | **fixed** |

### Verification of the fixes

- **R1 re-proved by re-running my own repro** with all three convention steps applied: **no
  `drift disagreement`, and the moved row correctly drops off the board.** Before the fix the same
  fixture produced a permanent drifted row.
- `bash dashboard.sh ai-agents/sprints/backlog.md` — exit 0, 5 rows, roll-up `5 backlog — of 5`.
- `bash dashboard.sh ai-agents/sprints/sprint-2.md` — exit 0.
- `npm test` — **351 pass / 0 fail**.
- No residual `Backlog (unsprinted)` in any brief that has a board row.

### Still open, and deliberately so

- **`brief-missing-status` on `gate-read-side-symlink-hazard-in-init.md`** — reported, not repaired.
  The brief has no `## Status` section; adding one is the producer's call. Named in the worklog.
- **`drift unresolved-plan-sprint` on the backlog board** — task 68's declared scope. The reviewer
  agreed it is not a task-67 defect, **but flagged that R7 changes its character**: once 68 gives the
  board a sprint identity, rule 1 begins comparing it to each brief's `## Sprint`. R7's normalization
  is what keeps that comparison from silently skipping every backlog row. **Carried into 68 with that
  note attached.**

**Reviewer's independence preserved:** the *Reviewer findings* section is untouched.

## Accepted residuals (shared, do-not-re-litigate)

- **Board filename outside the `sprint-*.md` glob** — What: the board is `ai-agents/sprints/backlog.md`,
  deliberately not `sprint-backlog.md`. · Why (structural): `/fkit-status` resolves the active sprint by
  globbing `sprint-*.md`; staying outside that glob is the entire mechanism by which a default status run
  ignores unscheduled work. Rejected alternative: a `sprint-`-prefixed name "for consistency", which would
  make every status call report the backlog as the active sprint. · Re-raise only if: `/fkit-status` stops
  using a filename glob to resolve the active sprint.
- **The board is unranked (`—` Priority)** — What: every board row's Priority cell reads `—`; briefs read
  `## Priority: Unscheduled`. · Why (structural): ranking is what a sprint is for; a number here is a
  commitment nobody made, and needing a rank is the signal to pull the task into a sprint. Rejected
  alternative: numbering backlog rows. · Re-raise only if: the board acquires a scheduling role.
- **No scaffold board template** — What: consuming projects ship no `sprints/backlog.md`; the skill creates
  it on demand. · Why (structural): `dashboard.sh` hard-fails (exit 1, "no parseable rows") on a zero-row
  board, so a shipped empty template would make every fresh project report a false "malformed plan".
  Rejected alternative: shipping an empty or placeholder-row board. · Re-raise only if: `dashboard.sh`
  starts tolerating a zero-row board.
