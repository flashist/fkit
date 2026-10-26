# Correct fkit's "plan mode is a structural write-wall" wording: plan mode blocks `Write`/`Edit`, not shell commands (no behaviour change)

## ID
0545

## Sprint
Sprint 12

## Priority
P15

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Precondition — do not start (do not even plan) until the owner's Tier-2 probe has run.**
> The finding this rewords rests on **headless** evidence only
> ([ADR-060](../../../knowledge-base/decisions/adr-060-plan-review-on-by-default-in-coder-sessions-by-a-launcher-session-line-with-no-plan-review-opt-outs-provisional.md)
> Decisions 9–10; report §6, §7). Before planning, check that the design report
> ([`2026-10-24-design-plan-review-on-by-default-session-paths.md`](../../../knowledge-base/reports/2026-10-24-design-plan-review-on-by-default-session-paths.md))
> has a dated **"§8a Tier-2 results"** section — the owner's results, recorded verbatim by a
> `fkit-architect` spawn and read against §8's mapping table.
> - **§8a missing** → stop: in a session ask the owner (`AskUserQuestion`); spawned, return
>   `NEEDS-DECISION`. Do not plan around a missing probe.
> - **Read the 3m / 3m-bis rows of §8's mapping table first — they set this task's scope:**
>   a permission prompt or a runtime denial → the scope **shrinks** to recording the headless-only
>   finding; a no-prompt write that auto mode or an allow rule could explain → 3m-bis decides; 3m-bis
>   prompts → the wording says *"plan mode lets Bash through only where auto approval or an allow rule
>   does"*, after a dated ADR-060 note (architect).
> - **A skipped labelled addition is skipped, never passed.** This build rests on **3m and 3m-bis**.
>   If either is recorded as skipped (or 3m's model declined twice without calling), **name it at this
>   task's plan gate and put it to the owner** — go ahead with it unconfirmed, or run it first.
>
> The probe is a check, not a task, so it is not a `Depends on:` link. It is the owner's alone to run.

**Where this comes from.** `0542`'s headless probe found that plan mode blocked `Write` but put **no
gate on Bash** (report §6, conclusion C2: a Bash redirect wrote files, `rm -rf` and `git push --force`
were let through). fkit's texts call plan mode the session's *"structural write-wall"*. That contrast
("orchestrated = prose; session = structural wall") is **narrower than stated**. This is **build 3** of
report §7 / ADR-060 Decision 11, on the owner's Q7 ruling (2026-10-24 ~15:30 UTC, `fkit lead` session,
`AskUserQuestion`, relayed verbatim): *"Wording fix after probe (Recommended)"* — description he saw:
*"One Sprint 12 task, no behaviour change, after your probe confirms. Waits on nothing; nothing waits
on it."* Placement: *"Q2 — Where do the build briefs go once the design is approved?"* → *"Sprint 12"*
(description: *"This run could pick them up; wait on 0542 in Sprint 12. Risk: old prompt text loaded
here."*), 2026-10-24 ~14:57 UTC.

**Locked decisions this touches.** ADR-019 Decision 2, ADR-031 *"The plan-gate honesty clause"* and
ADR-032 Decision 7 carry the wording; their text stays byte-identical — **dated additions-only notes**
only, written by a `fkit-architect` consult inside this task. This does **not** reopen ADR-031's
accepted cost (ADR-060 Decision 10). **No guard is built** — the owner chose option A, not B (a
plan-mode Bash hook).

## What to build

1. **Reword the claims** listed in report §6 (*"What fkit says"*) so they say, in substance: *plan
   mode blocks `Write`/`Edit`; Bash is held back only by the model's plan-mode instructions* — or the
   narrower wording §8a calls for (see the precondition). The sites, cited by section and phrase in
   §6: `claude/agents/fkit-lead.md` (*"The orchestrated plan gate is prose, not a wall"*; *"When the
   owner wants a dedicated role session instead"*); `claude/skills/fkit-sprint-ship-loop/SKILL.md`
   (*"The plan-gate honesty clause"* and the hard rules); `claude/skills/fkit-task-ship-loop/SKILL.md`
   (*"What makes this autonomous"*, steps 2 and 4); `claude/skills/fkit-plan-task/SKILL.md` step 1
   (accurate on `Write`/`Edit`, silent on Bash). Re-locate each by phrase — builds `0543`/`0544` may
   have moved them.
2. **Dated additions-only notes** on ADR-019, ADR-031 and ADR-032, by a `fkit-architect` consult.
3. `CHANGELOG.md`.
4. **No behaviour change**: no hook, no permission rule, no tool list changes.

## Verification steps

1. §8a exists in the report before the plan was written; the plan names which §8 3m/3m-bis row
   applies and the scope that follows, and any skipped addition with the owner's answer.
2. `grep` for *"structural write-wall"*, *"runtime-enforced by plan mode"* and *"wall the runtime
   enforces"* under `claude/` returns no claim that plan mode gates Bash (or returns only the narrowed
   wording §8a called for).
3. `git diff` on ADR-019/031/032 shows additions only (the dated notes).
4. `git diff -- claude/` changes prose only — no hook, settings, tool list or script logic.
5. `npm test` green.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Precondition (not a link):** the owner's Tier-2 probe, recorded as report §8a — see the top of
  *Context*.
- **Ordering advice, not a dependency:** it shares files with `0543` and `0544` (`fkit-plan-task`,
  `fkit-task-ship-loop`, `fkit-lead.md`). **Land it after them** if it runs in the same stretch, to
  avoid a mixed edit (report §7). The owner ruled it *"Waits on nothing; nothing waits on it"* — so no
  `Depends on:` link.
- **Knock-on of placing it on Sprint 12:** it waits on no task. No open task waits on `0545`.
- ⚠️ Priority P15 is append rank, NOT a merit ranking — flagged for owner confirmation.
  **On merit this belongs directly below 0544**, because the ordering advice puts it after both builds
  — the same place as its append rank.
- ⚠️ **Old prompt text is loaded in the session that filed this.** The Sprint 12 `fkit lead` run that
  filed this brief has the pre-edit skill and agent text loaded. **Plan and build this from a fresh
  `fkit lead` / `fkit coder` launch after refreshing `.claude/`.**
- **Classification hint, not a ruling:** wording in shipped prompts, no behaviour change — reads as
  **code-only / docs** for plan review; the plan gate decides.
- **Filed 2026-10-24** by a spawned `fkit-producer` (no owner channel, ADR-021) at the direction of
  `fkit-sprint-ship-loop` (driven by `fkit-lead`), on the owner's Q7 and placement rulings quoted in
  *Context*, from report §6–§7 and ADR-060 Decisions 10–11. ⛔ No commit.
