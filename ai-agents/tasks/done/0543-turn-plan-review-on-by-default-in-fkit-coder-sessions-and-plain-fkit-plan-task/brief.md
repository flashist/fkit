# Turn plan review on by default in `fkit coder` sessions and plain `/fkit-plan-task`: launcher session line, `fkit coder --no-plan-review`, and `--no-plan-review` per command (provisional owner ruling)

## ID
0543

## Sprint
Sprint 12

## Priority
P13

## Status
✅ Done (agent-closed — not owner-verified)

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
>   **Done 2026-10-26:** 3n's row was hit. The owner re-ruled Q2 (report §10.4). §3.0/§3.3/§3.6/§4
>   were rewritten, and ADR-060 Decision 4.3 has a ⛔ note. Plan from the rewritten design.
> - **A skipped labelled addition is skipped, never passed.** This build rests on **5c and 5d**, both
>   passed (§8a.2). 3n failed, and the Q2 re-ruling replaced what rested on it. 5b and 3-notice did not
>   run, and nothing in the re-ruled design rests on them. Name them in the plan in one line; no owner
>   question (report §7, dated bullet).
>
> The probe is a check, not a task, so it is not a `Depends on:` link. It is the owner's alone to run.

**Where this comes from.** Task `0542` designed plan review on by default for the session paths; the
owner approved the design on 2026-10-24 (~15:30 UTC, `fkit lead` session, `AskUserQuestion`, relayed
verbatim; answers in report §10). It is recorded as ADR-060 — **provisional** (his final keep/drop
ruling comes after real-project use, ADR-059) and **conditional** (the Tier-2 probe above). This is
**build 1** of the three in report §7 / ADR-060 Decision 11: the `fkit coder` session switch and the
plain `/fkit-plan-task` path. `/fkit-task-ship-loop` is build 2 (`0544`), which builds on this one.

**Owner rulings this rests on** (verbatim, report §10.1): Q1 *"Launcher line + flags (Recommended)"*;
Q2 re-ruled 2026-10-26 (`fkit-lead` session, `AskUserQuestion`): *"Review before plan mode
(Recommended)"*. Description he saw: *"Draft + review (Codex included) with plan mode off; plan mode on
only for your approval. ~17 min held back by instructions only."* Report §10.4; it replaces the
2026-10-24 option A; Q3 *"Progress lines (Recommended)"*; Q4 *"Only if you ask
(Recommended)"*; Q5 *"Yes, both (Recommended)"*; Q6 *"plan-review.md only (Recommended)"*. Placement:
*"Q2 — Where do the build briefs go once the design is approved?"* → *"Sprint 12"* (description he saw:
*"This run could pick them up; wait on 0542 in Sprint 12. Risk: old prompt text loaded here."*),
2026-10-24 ~14:57 UTC, `fkit lead` session.

**Locked decisions this touches.** ADR-060 amends ADR-056 Decision 3 and ADR-059 Decision 3 for
sessions. **ADR-059 Decision 2 (spawned coders) is unchanged** — a spawned coder still runs plan review
only on a driver's switch line. Do not contradict either. ADR-019 Decision 2: on the review-on path,
its *"(also runtime-enforced by plan mode)"* covers only the gate (owner, 2026-10-26; dated ⚠️ note in
ADR-019). The gate and "owner approves last" are unchanged.

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
4. The plan-mode-already-on stop (report §3.6) is the architect's design; confirm it at the gate. The
   plan says how it handles the two unproven mechanics: whether the coder can tell when plan mode turns
   off, and how the owner leaves plan mode during the stop.
5. The interim window (report §4.2): once this lands, a ship loop reaches the review-on path while
   step 2 still says "in plan mode". The plan names this window, or proposes landing with 0544.

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
   directly on a disagreement after round 2; progress lines; the `not re-reviewed` banner on owner
   revisions; the report lines; `plan-review.md` written on approval for a task-folder brief (`plan.md`
   stays unwritten on the plain path). Plus:
   - Workflow step 1 and the order (report §3.0, §3.3, §3.6): run the gate check before step 1. With
     review on, skip `EnterPlanMode` at step 1. Draft and run the whole review with plan mode off,
     writing nothing before approval. Then `EnterPlanMode`, then step 7's `ExitPlanMode`.
   - Step 0's opening progress line.
   - The reviewer is spawned with its normal procedure: no plan-mode note, no retry.
   - The plan-mode-already-on stop: never spawn the reviewer in plan mode.
   - The `Plan mode:` record line.
   - The existing `plan review incomplete: <what>` flag for a failed spawn.
3. **Agent prompts**: `fkit-coder.md` (procedures bullet; adversarial-reviewer consult bullet);
   `fkit-architect.md` and `fkit-producer.md` (plan-approval paragraph: an approver consults no one, at
   any hop); `fkit-lead.md` (the bullet *"Only the sprint loop has it"*).
   - `fkit-lead.md`: its two "old way" wall pointers (*"An owner who wants the structural wall for a
     task ships it the old way"*; §*"When the owner wants a dedicated role session instead"*) gain
     `--no-plan-review`.
   - `claude/skills/fkit-sprint-ship-loop/SKILL.md`: only the honesty clause's *"Owners who want plan
     mode's structural wall … the old way"* sentence gains `--no-plan-review`. The "structural" wording
     stays for 0545 (report §6).
4. **Docs**: `ai-agents/tasks/README.md` and its scaffold twin (who writes `plan-review.md` on session
   paths); `CHANGELOG.md`.
5. **Opted out is today's behaviour**: with any opt-out, or no line, the gate goes straight from
   Workflow step 6 to step 7, as today. The only differences are the report line and the launcher line
   itself. This includes Workflow step 1: an opted-out plan enters plan mode first, as today.

## Verification steps

1. §8a exists in the report before the plan was written; any skipped addition this build rests on is
   named in the plan (no owner question unless a design element rests on it, report §7).
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
   with the matching `Plan review: off (…)` line. The review-on run shows plan mode off until the
   review is done and on for the gate, a real Codex pass (not a fallback), and the `Plan mode:` line.
   The `--no-plan-review` run enters plan mode first. One run started with plan mode already on shows
   the §3.6 stop.
5. A spawned coder (sprint-loop or lead spawn) with no driver switch line still skips plan review.
6. `git diff` on ADR-019/056/059/060 shows additions only (any dated note).

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
- **Shares files with `0545`** (`fkit-plan-task`, `fkit-lead.md`, `fkit-sprint-ship-loop/SKILL.md`) —
  `0545` is advised to land after this one; that is ordering advice, not a link.
- **Classification hint, not a ruling:** this changes what fkit delivers (session behaviour), so it
  reads as a **product change** for plan review.
- **Filed 2026-10-24** by a spawned `fkit-producer` (no owner channel, ADR-021) at the direction of
  `fkit-sprint-ship-loop` (driven by `fkit-lead`), on the owner's placement ruling quoted in *Context*,
  from report §7 and ADR-060 Decision 11. ⛔ No commit.
