# Add the `task: <id>` spawn line and the `[task NNNN]` relay tag to both ship-loop skills

## ID
0487

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

> ⛔ **Do not start without the owner's specific word.**
>
> ⛔ **Blocked by [`0485`](../0485-owner-reads-and-accepts-adr-053-before-any-owner-involvement-capture-is-built/brief.md)
> (B0) until ADR-053 is `accepted`.** The 2026-10-05 APPROVE of Phase B is not acceptance of the ADR.

## Context

**Where this comes from.** Brief **B2** of the Phase-B split of the gated umbrella
[`0482`](../../done/0482-record-every-owner-question-and-decision-and-count-autonomous-tasks/brief.md)
(the prose half of item 2, "linking entries to tasks"). Design:
[ADR-053](../../../knowledge-base/decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log.md)
D2 and D5. **ADR-053 governs where it differs from `0482`'s `plan.md` § 3.** The "Carry into the
Phase-B briefs → B2" list in `0482`'s `worklog.md` is folded in below.

**Why two conventions.** The capture hook (`0486`) does not know which task an entry belongs to. Two
fixed, machine-readable conventions let it tell, without storing any text (owner ruling OQ1, 2026-10-05):
- a **`task: <id>` line in every worker spawn prompt** → the hook records a `bind` (D2);
- a **`[task NNNN]` tag in a relayed question's `question` field** → the hook keeps only those four
  digits as the entry's task id (D2). This is how a question the lead asks **for a worker** is counted
  against the worker's task, not the lead's session (ADR-021).

**Bears on:** `claude/skills/fkit-task-ship-loop/SKILL.md` and `claude/skills/fkit-sprint-ship-loop/SKILL.md`.
⚠️ Both carried uncommitted edits from task `0480` on 2026-10-05 — re-check current text first.

## What to build

1. **The relay tag** — in both ship-loop SKILLs: when the session asks the owner a question **on behalf
   of a task**, the question's **`question` field** (not `header`, not an option) carries exactly one
   `[task NNNN]` tag. **One task per question.** A question about several tasks is split into several
   questions.
2. **The spawn line** — in both ship-loop SKILLs: every worker spawn prompt carries a fixed
   `task: <id>` line (four-digit id), alongside the existing `plan: …/plan.md blob …` pointer where one
   exists.
3. State in each SKILL, in one sentence, what the tag and line are for (owner-involvement capture,
   ADR-053) and that they carry **only** the four-digit id — never other text.
4. Refresh the `.claude/` copies via `claude/fkit-claude-init.sh .`. Nothing in the shared rules block.

Do **not** change how or when `plan.md` is written — that is the plan-approval anchor (D6). If `0486`
finds the sprint driver writes it via Bash, that is routed to the owner separately.

## Verification steps

1. Both SKILLs name the `[task NNNN]` tag, its place (the `question` field only), and the one-task-per-
   question rule, in matching wording.
2. Both SKILLs name the `task: <id>` spawn line in every worker spawn template they contain; a grep over
   each SKILL's spawn templates finds the line in every one.
3. The strict tag pattern used in the SKILL text matches the pattern `0486`'s hook extracts (four
   digits, `[task NNNN]`), checked by a test or a grep cited in the worklog.
4. Existing SKILL/doc tests pass (`npm run test:docs`); the skill-ownership tests pass.
5. Rules block size unchanged — `fkit-claude-init.sh`'s cap check passes with the same byte count.
6. No absolute machine path in any changed file.

## Notes
- **Depends on:** 0485
- **Blocks:** 0488, 0491
- **Runs alongside:** `0486`.
- **Parent:** [`0482`](../../done/0482-record-every-owner-question-and-decision-and-count-autonomous-tasks/brief.md);
  design in [ADR-053](../../../knowledge-base/decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log.md).
- **Residual risk this cannot close** (ADR-053 residual 4): an agent may mis-tag a relayed question to
  another task bound in the same session.
- **Not yet scheduled:** on the Backlog board; pulling it into a sprint is the owner's call.
- **Consulted:** none at filing.
- Filed 2026-10-05 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  APPROVE of `0482` Phase B items 1–5; it decides nothing beyond that APPROVE and ADR-053.
