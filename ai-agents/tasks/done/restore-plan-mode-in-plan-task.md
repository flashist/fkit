# Restore Claude Code plan mode in `/fkit-plan-task`

## Sprint
Sprint 2

## Priority
17 *(independent of the Phase 0–4 chain — recommended as the first pickup; see Notes)*

## Status
✅ Done

## Context

**`/fkit-plan-task` no longer enters Claude Code's plan mode. It used to. The Claude-native port
silently dropped it.** The planning gate is currently **prose only** — `claude/skills/fkit-plan-task/SKILL.md`
step 1 says *"Declare planning-only"*, while the coder keeps `Write`/`Edit` throughout the run. So
*"no code will be written during planning"* is a promise the agent keeps, not a wall the runtime
enforces. This is a **regression**, not a missing feature — diagnosed by fkit-coder on 2026-07-11 and
traced in three hops:

1. **Pre-Omnigent it worked, tool-enforced.** `git show 104280c:.claude/skills/plan-task/SKILL.md` —
   step 1: *"Use the **EnterPlanMode** tool to switch into plan mode and state clearly that this run is
   planning-only…"*; step 7: *"Use **ExitPlanMode** to present the plan to the user and stop for
   approval before making any code changes."*
2. **The Omnigent port removed it deliberately, and was right to.** `omnigent/fkit-coder/config.yaml:20`:
   *"The bundled plan-task skill uses a prose … contract rather than Claude Code's
   EnterPlanMode/ExitPlanMode tools, which aren't guaranteed under this harness."* True — for Omnigent.
3. **The Claude-native port (`627d5ea`) copied that Omnigent prose back into
   `claude/skills/fkit-plan-task/SKILL.md`** — carrying a workaround *back into the exact environment it
   was working around*. Claude Code **does** have the tools. The parenthetical in the skill today
   (*"If Claude Code's plan mode is active, it serves as the same gate"*) is the fossil of the removed
   tool call.

**The tools exist in the installed runtime** (Claude Code 2.1.207): `EnterPlanMode` and `ExitPlanMode`
are both present in the shipped binary.

**Second lock, same bug.** `claude/agents/fkit-coder.md:9` reads
`tools: Read, Grep, Glob, Bash, Write, Edit, Agent, Skill` — **`EnterPlanMode` / `ExitPlanMode` are not
in the coder's allowlist.** Even a corrected skill body could not call them. **Both the skill and the
allowlist must be fixed, or neither works.**

### Owner decisions already made (2026-07-11) — do not relitigate

- **No session-wide plan default.** The architect recommended `permissions.defaultMode: "plan"` in the
  coder's generated `.fkit/settings/<role>.json` (a stronger invariant: *the coder writes nothing until
  the owner approves*). **The owner ruled against it:** *"I will use the plan-task skill whenever I need
  to plan a task; it's not what I need to have by default at the session start."* The gate is **scoped
  to the plan run, by design.**
- **No ADR.** This is a regression fix, not an architecture decision. Do not open one.
- **No hooks.** A `PreToolUse` hook denying `Write`/`Edit` during the plan run is **rejected** — it would
  reopen the hook-enforcement option that
  [ADR-010](../../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md) §Options
  explicitly **deferred**, and it isn't needed here. **ADR-010's deferral stands.**
- **Accepted residual.** The gate is **model-initiated** (the coder chooses to call `EnterPlanMode`) even
  though it is **harness-enforced once entered**. It does not stop a coder that simply never runs
  `/fkit-plan-task`. **The owner has accepted this.** A reviewer should not re-raise it as a finding.

## What to build

Exactly three changes — **keep the scope to this**.

1. **`claude/skills/fkit-plan-task/SKILL.md`**
   - **Step 1 calls `EnterPlanMode`** to switch the run into plan mode, and states that the run is
     planning-only.
   - **The final step calls `ExitPlanMode`** to present the finished plan and stop for owner approval
     before any code change.
   - **Remove the stale Omnigent-era parenthetical** (*"If Claude Code's plan mode is active…"*) — it is
     a fossil and it reads as if the gate is optional.

2. **`claude/agents/fkit-coder.md`** — add `EnterPlanMode, ExitPlanMode` to the `tools:` frontmatter
   line. **Change no other role's allowlist.**

3. **Keep the prose contract, reworded — as the fallback, not the primary gate.** A *spawned*
   `fkit-coder` subagent never runs `fkit-claude.sh` and may not have the tools; the prose planning-only
   rule must remain the **portable** rule for invocation paths the runtime doesn't cover. **Reword the
   contract to say so explicitly — do not delete it.** The tool call is the gate where the runtime
   provides it; the prose is the gate everywhere else.

## Verification steps

- In a `fkit coder` session, `/fkit-plan-task <task-file>` **visibly enters plan mode**, and `Write` /
  `Edit` are **refused by the harness** during the run — not merely declined by the agent.
- The plan is presented via **`ExitPlanMode`**, and the session **stops for owner approval**.
- **Approving exits plan mode** and implementation proceeds normally — no residual write block.
- A **spawned** `fkit-coder` consult (no tool guarantee) still honors the **prose** planning-only
  contract and does not error out attempting a tool it lacks.
- The `claude/agents/fkit-coder.md` allowlist change **does not disturb the other six roles** — start each
  and confirm its tool and skill set is unchanged.

## Notes

- **Owner: fkit-coder.** Diagnosis by fkit-coder (2026-07-11); technical picture confirmed with
  fkit-architect.
- **Risk: low.** Two files, both Claude-flavor sources. Neither is deleted or moved by the Omnigent
  removal, so there is **no ordering constraint against tasks 1–11** — it can be picked up at any time.
- **Recommended as the first pickup of the sprint, ahead of the Phase 0 chain.** It is cheap, and it
  repairs the **planning gate that every other Sprint 2 task will be planned through**. Left in place, the
  sprint's riskiest work (task 4, `install.sh`) gets planned behind a gate that is a promise rather than a
  wall. Priority 17 reflects **append-don't-renumber discipline on the owner's ranking**, not low urgency.
- **Interaction with task 6** (`reconcile-skill-ownership-source-of-truth`): that task governs the
  **`skills:`** declaration and `skills_for_role()`. This one touches **`tools:`** — a different field on
  the same file. No conflict, but if task 6 lands first and moves where agent frontmatter is generated,
  make the `tools:` change follow whatever source of truth it established.
- **If the interactive session path (`claude/fkit-claude.sh`) turns out to gate tools as well as skills**,
  the same grant is needed there for the gate to work at all — that is in the spirit of this fix, not scope
  creep. Establish it from the code; flag it to the owner if it changes the shape of the change.
- **Adjacent finding, deliberately NOT in this brief:** `fkit --resume` falls into the "no role, extra
  args" branch at `claude/fkit-claude.sh:190` and therefore **resumes as `lead`** — with lead's skill
  lockdown and no `Write`/`Edit`. Separate defect, separate brief, pending owner triage.
