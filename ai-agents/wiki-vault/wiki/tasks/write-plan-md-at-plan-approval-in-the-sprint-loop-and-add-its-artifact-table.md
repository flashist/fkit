# Write `plan.md` at plan approval in the sprint loop, and add the artifact table it lacks

**Source**: `ai-agents/tasks/done/0202-write-plan-md-at-plan-approval-in-the-sprint-loop-and-add-its-artifact-table/brief.md`
**Status**: done — ✅ **agent-closed, not owner-verified** (2026-08-02)
**Sprint/Tag**: Sprint 2 · task `0202` · owner `fkit-coder`
**Key files**: `claude/skills/fkit-sprint-ship-loop/SKILL.md` (+42 / −2)

## Goal
Follow-up 1 of [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]], and **the fix for a confirmed live production failure, not a tidy-up**. `/fkit-sprint-ship-loop` wrote `plan.md` in its **Build** row — so at the moment of the Build spawn **the file the prompt was supposed to carry did not exist**. Its sibling `/fkit-task-ship-loop` writes it **at plan approval** and declares it in an **artifact table**; the sprint loop **had no artifact table at all** (`grep -i artifact` returned zero hits).

## Key Changes

**The `plan.md` write moved from the Build worker to the driver, at plan approval.** The Plan row's owner gate now reads: **on approval the DRIVER writes the approved text to `<task-folder>/plan.md` verbatim — copied, not re-rendered — BEFORE spawning Build.** The Build row is amended to match: `plan.md` **already exists, never re-author it.**

**A new `## Durable artifacts` section** — the section the loop lacked entirely — declaring `plan.md` (driver, at plan approval), `worklog.md` (Build worker, grown by Process-review) and `review.md` (the two-party ledger, separate ownership, never merged into the worklog). All git-tracked, **left in the working tree — the owner commits, never the loop** — and they **move with the folder** when the producer closes the task. Task *statuses* are deliberately excluded: they live in the brief and the sprint row, not in an artifact write.

**Why the driver, and why that is not a breach of *"delegate, never substitute"*.** The approved plan exists only in **this session's** `AskUserQuestion` exchange, so the driver is the only actor holding the approved bytes at the moment of approval. The no-substitute rule forbids the driver **writing source** and **reviewing** — and the driver already writes the `🔄 In progress` and `🚧 Blocked` statuses itself. **Delegating this copy would put a context boundary in the middle of it — the exact operation that failed.**

## Outcome

⛔ **What it closes: the reconstruction route only.** No worker is ever asked to reconstruct the plan again — which is how `0162/plan.md` came to be a **re-rendering** of a plan approved hours earlier (blob `2458a57e`, two distinctive strings from the approved text absent).

⛔ **What it does NOT close: the `carried-not-approved` class**, and the shipped skill text says so in its own words. **A hash pins which bytes were *carried*, not which were *approved*.** A driver that persists a plan the owner never approved and then carries it faithfully still verifies green over bytes the owner never saw. **Structural** — approval leaves no artifact — and an **accepted residual** in `0162`'s review ledger. The driver doing the copy **narrows** the transcription hazard to one copy with no spawn boundary; it does not remove it, it **relocates it into the driver's session**.

⚠️ **The skill text carries an explicit "do not delete this write as redundant" warning** — a path + `git hash-object` pointer needs a file to point at, and the planned `PreToolUse` carry-check needs one at spawn time.

**It shipped mid-sprint, under a direct owner ruling.** `0162`'s OQ-4 asked *now or after Sprint 2* — editing the driver's own step table while that table is executing is a real hazard class. The owner ruled **NOW**, once the failure was confirmed live, on the ground that the change is **to prose in a step table, not to running code**.

**Still open behind it:** `0203` (amend the carry rule itself with the byte-exact-read construction, carrying an explicit *"unverified — no hook checks it"* marker), `0204` (build the `PreToolUse`/`Task` carry-check hook — **hard-gated on this task**), `0207` (a dated correction note to ADR-020 naming the driver a sanctioned `plan.md` writer) and `0208` (an exit-table row for a failed Build/Verify/Review spawn).

## Related
- [[tasks/decide-the-construction-that-satisfies-the-verbatim-carry-requirement]] — task `0162`, the ruling this implements, and the `carried-not-approved` residual it does **not** close
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — the per-task artifact scheme this extends; `0207` owes it a correction note naming the driver as a sanctioned writer
- [[tasks/build-fkit-sprint-ship-loop-skill]] — task `0111`, the loop this edits
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the loop's autonomy and consent model
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — Decision 2, *"delegate, never substitute"*, and why this write does not breach it
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why approval leaves no artifact, which is what makes the residual structural
- [[decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling]] — the declared-approval marker this carry feeds
- [[decisions/adr-029-a-task-is-a-folder-keyed-by-a-permanent-global-id]] — the `<task-folder>` the artifact table is keyed on
- [[tasks/implement-task-ship-loop-skill]] — `/fkit-task-ship-loop`, whose artifact table this mirrors
- [[tasks/sprint-2-remove-omnigent]] · [[systems/fkit]]
