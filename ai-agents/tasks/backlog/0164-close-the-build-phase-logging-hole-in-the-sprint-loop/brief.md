# Close the build-phase logging hole — or state on the record why build choices need no log

## ID
0164

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

### ⚠️ First, plainly: this is NOT a defect in `0147` as delivered

`0147` was scoped to **ADR-032 A2** and to the **Process-review worker**, and it satisfies A2 in full.
Its brief and the driver's spawn both named that scope. **Nobody missed anything.** ADR-032's own
in-place callout (`adr-032-…:129-133`) named exactly two sites as the outstanding gap —
`fkit-sprint-ship-loop/SKILL.md`'s **Process-review** row and `fkit-coder.md`'s **Process-review**
bullet — and `0147` closed both. **This brief is a newly surfaced adjacent hole, not a miss**, and it
must not be read, reported, or reviewed as one.

### The hole

`0147` landed the worklog decision-log obligation on the **Process-review** worker only. The **Build**
worker carries no logging duty anywhere. Both sites read firsthand 2026-07-29:

- `claude/agents/fkit-coder.md:71-72`, the Build-worker bullet, **in full** — this is the whole of it:
  > - **As the Build worker:** implement **only that approved plan**. Anything outside it → **return
  >   `NEEDS-DECISION`**; never widen scope on your own.

  No logging duty of any kind. The obligation sits in the **Process-review** bullet (`:82-91`), which
  begins *"**Record what you did unattended.**"* and specifies the three content elements.

- `claude/skills/fkit-sprint-ship-loop/SKILL.md:102`, the **Build** row, worker column, **in full**:
  > implement the **approved** plan; write source + `plan.md`/`worklog.md`; return change surface + any
  > decision surfaced

  It names `worklog.md` as a **file to write** and stops. **There is no per-decision content
  requirement** — no *which need it answered*, no *what changed*, no *why it qualified*, no `none`
  sentinel. Contrast the **Process-review** row at `:105`, which spells all three out.

### The consequence, stated precisely

ADR-032 **A4 bullet 2** makes its do-not-re-raise guard conditional:

> **Re-raise only if** a loop-applied post-review fix is later found **wrong or out-of-plan** (A2's
> worklog record is what makes that checkable)

**The reopening condition rests on a record.** For **post-review** fixes that record now exists — `0147`
built it. For **build-phase** choices **no record exists and none is compelled**, so the same
checkability the ADR leans on is simply absent on that half of the path. **Whether A4 bullet 2 is
intended to reach build-phase choices at all is itself part of what this task settles** — the bullet's
own words say *post-review*, and stating that boundary honestly is a legitimate outcome (see the second
option below).

### The live proof, on disk, from `0147`'s own history

`0147`'s worklog **§13 — "Retroactive entries — round 1 calls I made unattended and never logged"**:

> Round 1's approved plan (STEP 5) listed checks `C1, NC1, C2, NC2, C3, C4, NC3, C5, C6, C6b, C7, C8,
> C8b, C9, C10`. I executed **C8c, C8d and NC4** as well, and §6's decision log recorded **none of their
> additions**.

Three verification-harness additions, **made during build**, **outside the approved plan**, **unlogged**.
That is exactly the *out-of-plan* class A4 bullet 2 cares about — and **the landed text would not have
compelled that record.** The coder caught itself only by **voluntarily applying the Process-review
obligation to work outside that obligation's scope**, and said so:

> **This is the sharpest evidence for R4, and it is against me.** The obligation's own author breached it
> within one round of writing it.

**A control that depends on the author volunteering to apply it to work it does not cover is not a
control.**

### Nothing enforces it

Verified 2026-07-29: **no test in `test/` reads `claude/agents/fkit-coder.md` or any `SKILL.md`
content.** `grep -rn 'fkit-coder.md' test/` returns one hit, an `existsSync` path check at
`converge-contract.test.js:357`. `0147`'s `C8c`/`C8d` byte-unchanged guards lived in that task's
**worklog harness and were never landed in `test/`** — so the Build-worker bullet this task edits is
**not** protected by any live guard. Same unenforced-prose class as `0152`, `0154`, `0157`, `0163`.
**Do not add a guard here**; `0152` and `0154` are already contending for that walk.

## What to build

**Settle it one of two ways. Both are acceptable outcomes; pick one and justify it in the worklog.**

**Option A — extend the obligation to the build phase.** Two files, matching what `0147` did for
Process-review:
- `claude/agents/fkit-coder.md:71-72` — add the record duty to the **Build-worker bullet**, with the same
  three content elements (*which need it answered, what changed, why it qualified*) and the same `none`
  sentinel. **Reuse `0147`'s wording rather than inventing a second phrasing** — two spellings of one
  obligation is the divergence shape this file already risks.
- `claude/skills/fkit-sprint-ship-loop/SKILL.md:102` — give the **Build** row the per-decision content
  requirement, mirroring the Process-review row at `:105`.

  **Scope the trigger.** The Build worker implements an approved plan, so its logged class is **not**
  "every fix" — it is **choices the approved plan did not determine**: an out-of-plan addition (the `0147`
  §13 case), an obvious-winner call within the plan's intent, a deviation. Say which, in terms a worker
  can apply without judgment about judgment. Getting this boundary right is the substance of Option A —
  an obligation to log *everything* will be ignored, and an obligation to log *nothing specific* is what
  exists today.

**Option B — state on the record why build-phase choices need no log.** If the honest answer is that the
Build worker's approved plan plus its returned change surface already make a wrong build-phase choice
findable, **write that down** — in the worklog and, if it bears on A4 bullet 2's reach, as a proposed
dated note to ADR-032 rather than a silent omission. **`0147` §13 is the case this answer must survive**:
three out-of-plan additions that the change surface alone did not surface, found only by a voluntary
audit. An Option B that does not address §13 by name has not answered the question.

**Do not** touch the Process-review bullet, the declared-approval marker, or the trust-not-proof
paragraph. **Do not** re-open A2 — `0147` satisfies it.

## Verification steps

1. **The chosen option is named and justified in `worklog.md`**, with `0147` §13 addressed by name
   either way.
2. **If Option A:** read `claude/agents/fkit-coder.md` with no other context and answer: *"I am the Build
   worker. The approved plan lists ten checks; I am about to add an eleventh it does not name."* The text
   must yield **record it in `worklog.md`'s decision log, with which need it answers, what changed, and
   why it qualified.** The `0147` §13 scenario must be covered by the text alone, with no appeal to the
   Process-review bullet.
3. **If Option A:** the same question put to `SKILL.md`'s **Build** row must yield the same three content
   elements — a row saying only *"write `worklog.md`"* has failed.
4. **If Option A:** the `none` sentinel is present, for the same reason `0147` gives — an empty log and a
   forgotten one are otherwise indistinguishable.
5. **If Option B:** the written rationale exists, names `0147` §13, and states whether A4 bullet 2 reaches
   build-phase choices. A silent decision to do nothing fails this task.
6. **`0147`'s work is byte-unchanged.** `git diff` shows the Process-review bullet
   (`claude/agents/fkit-coder.md:73-91`) and the Process-review row (`SKILL.md:105`) **untouched**.
   Any change to either fails this task.
7. **The declared-approval marker is byte-unchanged** — conditions (a)(b)(c) and the trust-not-proof
   paragraph. This task grants and removes no permission.
8. **The change surface is at most two files** — `claude/agents/fkit-coder.md` and
   `claude/skills/fkit-sprint-ship-loop/SKILL.md` (Option A), or worklog/ADR-note only (Option B).
   **No test, no board row, no task brief, no scaffold file.**
9. **The suite is still green.** `node --test test/` passes.

## Notes

- **Depends on:** nothing.
- **Blocks:** nothing.
- **⚠️ Shares `claude/agents/fkit-coder.md` with `0163` — non-overlapping regions.** This task edits the
  **Build-worker bullet** (`:71-72`); `0163` edits the **refusal clause** (`:98-100`). **Recommendation:
  co-land them, or land them back to back in one session.** Not because either depends on the other —
  neither does — but because the file has **no live test guarding its content** (see `## Context`), so
  each edit's only real check is a careful read of the whole clause set, and doing that read twice for
  two small edits is the avoidable cost. **If they are split, the second to land must re-read the first's
  region** rather than assume it.
- **Shares `claude/skills/fkit-sprint-ship-loop/SKILL.md` with `0162`'s eventual follow-up.** This task
  edits the **Build row** (`:102`); `0162`'s follow-up will edit the **verbatim-carry rule** (`:109`).
  Independent regions, independent decisions. Coordinate only on the file.
- **Dependency direction among the three, stated:** **none is hard.** `0162` decides, `0163` and `0164`
  each edit. The only real coupling is `0162` → `0163` on condition (b)'s wording (see `0163`'s notes).
  `0164` is independent of both.
- **Not a dual-home concern.** Verified 2026-07-29: `claude/scaffold/` ships no `agents/` and no
  `skills/`. No scaffold change.
- **Prose only, and unenforced — say so in the report.** Do not add a guard.
- **⚠️ Priority 142 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  *(as filed. **⚠️ Stale number reconciled 2026-07-30 by 0159's sweep — owner confirmation is still
  outstanding.** The append rank named above was superseded by displacement in later re-ranks; this
  brief's own `## Priority` field and its board row carry the live rank. **Nothing was re-ranked, and
  this flag is NOT discharged** — only its stale number was reconciled. The merit argument below is
  still awaiting an owner ruling, and is kept as the record of what was reasoned on the day.)* Filed by a
  spawned producer with **no owner channel**; appending after the existing highest priority was the only
  sanctioned option under `/fkit-task-brief` step 5 as written, which the spawning driver explicitly
  required for this brief. **On merit this belongs immediately below `0163`**, on the co-landing argument
  above — the two edits share an untested file and the read that verifies either verifies both, so
  running them apart pays the same verification cost twice. **Not ranked higher than that:** no wrong
  action is in flight. The build phase has been unlogged for the whole life of the loop, the one known
  instance was caught and retroactively recorded by the worker itself, and this buys back **auditability
  of a path already running**, not correctness of something shipping wrong today.
