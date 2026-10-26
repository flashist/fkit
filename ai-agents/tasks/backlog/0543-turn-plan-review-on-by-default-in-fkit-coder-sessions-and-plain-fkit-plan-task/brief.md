# Turn plan review on by default in `fkit coder` sessions and plain `/fkit-plan-task`: launcher session line, `fkit coder --no-plan-review`, and `--no-plan-review` per command (provisional owner ruling)

## ID
0543

## Sprint
Sprint 12

## Priority
P13

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Precondition — do not start (do not even plan) until the owner's Tier-2 probe has run.**
> The design this builds is *"feasible with a condition: confirm by owner probe"* on every path
> ([ADR-060](../../../knowledge-base/decisions/adr-060-plan-review-on-by-default-in-coder-sessions-by-a-launcher-session-line-with-no-plan-review-opt-outs-provisional.md)
> Decision 9; report §7). Before planning, check that the design report
> ([`2026-10-24-design-plan-review-on-by-default-session-paths.md`](../../../knowledge-base/reports/2026-10-24-design-plan-review-on-by-default-session-paths.md))
> has a dated **"§8a Tier-2 results"** section — the owner's results, recorded verbatim by a
> `fkit-architect` spawn and read against §8's mapping table.
> - **§8a missing** → stop: in a session ask the owner (`AskUserQuestion`); spawned, return
>   `NEEDS-DECISION`. Do not plan around a missing probe.
> - **Any §8a result hits a §8 row other than *"§3.6 option A stands"*** → the design goes back to the
>   architect and ADR-060 gets a dated note **before** this task is planned.
> - **A skipped labelled addition is skipped, never passed.** This build rests on **3-notice, 3n, 5b,
>   5c and 5d**. Any of them recorded as skipped must be **named at this task's plan gate and put to the
>   owner** — go ahead with that condition unconfirmed, or run it first.
>
> The probe is a check, not a task, so it is not a `Depends on:` link. It is the owner's alone to run.

**Where this comes from.** Task `0542` designed plan review on by default for the session paths; the
owner approved the design on 2026-10-24 (~15:30 UTC, `fkit lead` session, `AskUserQuestion`, relayed
verbatim; answers in report §10). It is recorded as ADR-060 — **provisional** (his final keep/drop
ruling comes after real-project use, ADR-059) and **conditional** (the Tier-2 probe above). This is
**build 1** of the three in report §7 / ADR-060 Decision 11: the `fkit coder` session switch and the
plain `/fkit-plan-task` path. `/fkit-task-ship-loop` is build 2 (`0544`), which builds on this one.

**Owner rulings this rests on** (verbatim, report §10.1): Q1 *"Launcher line + flags (Recommended)"*;
Q2 *"Expect + retry + flag (Recommended)"*; Q3 *"Progress lines (Recommended)"*; Q4 *"Only if you ask
(Recommended)"*; Q5 *"Yes, both (Recommended)"*; Q6 *"plan-review.md only (Recommended)"*. Placement:
*"Q2 — Where do the build briefs go once the design is approved?"* → *"Sprint 12"* (description he saw:
*"This run could pick them up; wait on 0542 in Sprint 12. Risk: old prompt text loaded here."*),
2026-10-24 ~14:57 UTC, `fkit lead` session.

**Locked decisions this touches.** ADR-060 amends ADR-056 Decision 3 and ADR-059 Decision 3 for
sessions. **ADR-059 Decision 2 (spawned coders) is unchanged** — a spawned coder still runs plan review
only on a driver's switch line. Do not contradict either.

**Still open — to settle at this task's plan gate** (ADR-060 *Open questions*; report §10.3):
1. **The launcher test needs the owner's OK by name** (ADR-057 §D2 item 1). His Q1 option text —
   *"Launcher test needs your OK."* — is **not** that OK. The plan names the test file and its cases
   and asks.
2. **Inline plans get no plan review** (ADR-060 Decision 6). The owner was not asked this as its own
   question. Confirm it at the plan gate.
3. **A wording mismatch to resolve** (found by `0542`'s re-verify): report §3.2 says that after a
   non-`coder` role, **either** `--no-plan-review` **or** the no-op `--plan-review` is a usage error;
   ADR-060 Decision 3 names **only** `--no-plan-review`. The plan picks one and says which; if it
   picks the report's wider rule, ADR-060 needs a dated note (architect).

## What to build

Per ADR-060 Decisions 2–8 and report §3 (the design is there in full; this brief does not restate it):

1. **Launcher** (`claude/fkit-claude.sh`): for `fkit coder`, write one session line into the main
   session's system prompt — the **on** line by default, the **off** line when `--no-plan-review` is
   given. Consume `--no-plan-review` (and the no-op `--plan-review`) **only after `coder`**; both
   together is a usage error; after any other role, a usage error (scope per open question 3). Every
   other arg passes through to `claude` unchanged, as today (`fkit coder --resume` keeps working).
   The plan names the edge cases: a token after a `--` separator, the same text as another option's
   value, and an owner's own pass-through `--append-system-prompt` (report §4.1 build risk). Update the
   usage text.
2. **`fkit-plan-task` gated section**: the second, session-only trigger (launcher line **and**
   `AskUserQuestion` present; missing means off; on + off both present means off); the
   `--no-plan-review` argument; the session hop line plus the leaf rule for approvers; the owner asked
   directly on a disagreement after round 2; the Codex plan-mode note + one retry + the
   `plan review incomplete` flag; progress lines; the `not re-reviewed` banner on owner revisions; the
   report lines; `plan-review.md` written on approval for a task-folder brief (`plan.md` stays
   unwritten on the plain path).
3. **Agent prompts**: `fkit-coder.md` (procedures bullet; adversarial-reviewer consult bullet);
   `fkit-architect.md` and `fkit-producer.md` (plan-approval paragraph: an approver consults no one, at
   any hop); `fkit-lead.md` (the bullet *"Only the sprint loop has it"*).
4. **Docs**: `ai-agents/tasks/README.md` and its scaffold twin (who writes `plan-review.md` on session
   paths); `CHANGELOG.md`.
5. **Opted out is today's behaviour**: with any opt-out, or no line, the gate goes straight from
   Workflow step 6 to step 7, as today. The only differences are the report line and the launcher line
   itself.

## Verification steps

1. §8a exists in the report before the plan was written; any skipped addition this build rests on is
   named in the plan and the owner's answer recorded.
2. The plan records the owner's OK **by name** for the launcher test (or his refusal and what replaces
   it), his answer on inline plans, and which usage-error rule it picked (open question 3).
3. The approved launcher test covers: `--no-plan-review` consumed after `coder`; usage error after
   another role (per the chosen rule); both flags together is a usage error; the on and off lines are
   written; a pass-through `--append-system-prompt` still works; `fkit coder --resume` still passes
   through. `npm test` green, under ADR-057's 2-minute limit.
4. Live check, from a **fresh** `fkit coder` launch after refreshing `.claude/`
   (`claude/fkit-claude-init.sh .`): one `/fkit-plan-task` on a task-folder brief runs plan review,
   shows `Plan review: ON (default)` first at the gate, and writes `plan-review.md` on approval;
   `fkit coder --no-plan-review` and `/fkit-plan-task <brief> --no-plan-review` each give today's flow
   with the matching `Plan review: off (…)` line.
5. A spawned coder (sprint-loop or lead spawn) with no driver switch line still skips plan review.
6. `git diff` on ADR-056/059/060 shows additions only (any dated note).

## Notes

- **Depends on:** 0542
- **Blocks:** 0544
- **Precondition (not a link):** the owner's Tier-2 probe, recorded as report §8a — see the top of
  *Context*.
- **Knock-on of placing it on Sprint 12:** it waits on `0542`, which is in this sprint (closed
  2026-10-24, agent-closed). `0544` waits on it, in this sprint. No task waits on a later sprint.
- ⚠️ Priority P13 is append rank, NOT a merit ranking — flagged for owner confirmation.
  **On merit this belongs directly below 0542**, because it is the first build of `0542`'s design and
  `0544` builds on it — the same place as its append rank.
- ⚠️ **Old prompt text is loaded in the session that filed this.** The Sprint 12 `fkit lead` run that
  filed this brief has the pre-build `fkit-plan-task` text loaded (the risk the owner's placement
  option named). **Plan and build this from a fresh `fkit lead` / `fkit coder` launch after refreshing
  `.claude/`** — and the live check (step 4) cannot run inside the session that built it.
- **File overlap, not a dependency:** ADR-052 phase-5 tasks (`0453`, `0450`, `0451`, `0457`, Backlog)
  also edit these skills. Per report §7, these builds land first, and `0453` carries the switch, the
  flag and `plan-review.md` forward (ADR-059 re-raise item).
- **Shares files with `0545`** (`fkit-plan-task`, `fkit-lead.md`) — `0545` is advised to land after
  this one; that is ordering advice, not a link.
- **Classification hint, not a ruling:** this changes what fkit delivers (session behaviour), so it
  reads as a **product change** for plan review.
- **Filed 2026-10-24** by a spawned `fkit-producer` (no owner channel, ADR-021) at the direction of
  `fkit-sprint-ship-loop` (driven by `fkit-lead`), on the owner's placement ruling quoted in *Context*,
  from report §7 and ADR-060 Decision 11. ⛔ No commit.
