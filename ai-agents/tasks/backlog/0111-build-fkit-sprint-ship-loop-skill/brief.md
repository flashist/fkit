# Build the `fkit-sprint-ship-loop` skill (the lead's sprint-scope conductor loop)

## ID
0111

## Sprint
Sprint 2

## Priority
93

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

The substantive build of the approved design
[`2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`](../../../knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md)
— **§5 is the full contract**; read it and
[ADR-032](../../../knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)
before starting. This creates a new lead-owned skill that drives a whole sprint's eligible tasks
brief→closed by spawning role workers and relaying owner decisions live through the lead session.

Model it on the coder's `fkit-task-ship-loop` (`SKILL.md`) at **sprint scope**, re-implemented at the
**driver** level so the owner channel lives in the loop, not in a spawned worker. The coder's
`fkit-task-ship-loop` stays **byte-unchanged and session-only** (design §4.3, C3) — the sprint loop
reuses its *shape*, never invokes it.

## What to build

Create `claude/skills/fkit-sprint-ship-loop/SKILL.md` with the front matter and `⛔ Owner: the lead`
banner from design §6.3, implementing the §5 contract:

- **Argument** (§5): a sprint plan path; empty = the active sprint. One operand, no output-variant
  flags (one-skill-one-output convention).
- **Task selection & ordering** (§5.1): read the plan + linked briefs; get the board via
  `bash claude/skills/fkit-status/dashboard.sh <plan>` (never re-derive status by hand). Eligible =
  `🔲 Backlog` tasks whose `Depends on` links are all `✅ Done`, ordered by priority then dependency
  topology. Dependency deadlock → stop and report the blocking chain.
- **Per-task drive sequence** (§5.2): the bounded-worker + driver-owns-owner-channel pattern —
  Plan → Build → Verify → Review → Process-review → Close, with the owner gates held by the driver as
  the §5.2 table specifies.
- **The live owner-relay gate** (§5.3): a spawned worker that hits a decision **returns** a structured
  payload (`{ status, question, options[], recommendation, context }`, §6.2), the driver reads it and
  calls `AskUserQuestion`, blocks on a real owner answer, then spawns the next worker with the
  decision folded in. **No timer, no guess** — this is the opposite of the declined ADR-024
  auto-proceed.
- **Stop conditions** (§5.4) and **progress reporting** (§5.5): every exit ends in an owner-visible
  report, never silence; both the brief `## Status` and the sprint row get accurate status.
- **Close posture** (§5.2 Close row, ADR-032/ADR-025): the driver runs `/fkit-task-done` itself and
  writes `✅ Done (agent-closed — not owner-verified)` **by default**; **degraded run → do not
  self-close**, put the close to the owner; **never self-cancel** — stop and ask.

### ⚠️ Must survive into the skill — the plan-gate honesty clause (design §3.5, §9.1, ADR-031)

On the orchestrated path, "no code before the owner approves the plan" is **prose-enforced in the
worker prompt, NOT a runtime write-wall.** Plan mode (the coder session's write-wall) cannot function
in a spawned worker (no owner channel). So the loop must:

1. spawn the coder **for the plan only** — prompt: *"produce a plan, write no source, return it"*;
2. driver presents the plan to the owner via `AskUserQuestion` → owner approves;
3. spawn the coder **to implement the approved plan**.

The "write nothing yet" in step 1 is a **prose instruction**, not a wall. **A later reader — human or
coder — must not "fix" this into a false structural guarantee.** The skill text must state plainly
that this path does not carry plan mode's structural write-wall (owner-accepted, 2026-07-22). Owners
who want the structural wall ship the task the old way: `fkit coder` + `/fkit-task-ship-loop`.

## Verification steps

1. `claude/skills/fkit-sprint-ship-loop/SKILL.md` exists with the §6.3 front matter and the
   `⛔ Owner: the lead` banner.
2. It implements task selection via `dashboard.sh` (not hand-derived), the §5.2 drive sequence, the
   §5.3 live-relay gate, the §5.4 stop table, and §5.5 reporting.
3. **The plan/build split and the plan-gate honesty clause are present and stated as prose-enforced,
   not structural** (design §3.5). A reviewer reading the skill can see it does not claim plan-mode
   parity.
4. The close writes `(agent-closed — not owner-verified)` by default, stops for the owner on a
   degraded run, and never self-cancels.
5. `fkit-task-ship-loop`'s SKILL is **unchanged** by this task.

## Notes

- **Owner:** fkit-coder.
- **Depends on:** 0110 (evolved `fkit-lead`). Design §11: `T3` depends on T1 (Done) + T2 (0110).
- **Blocks:** 0112 (wiring — the skill must exist to register it) and 0116 (stop-hook skip set).
- **Do NOT invoke `fkit-task-ship-loop`** from this skill (C3) — it is session-only and refuses a
  spawned invocation; reuse its shape only.
- **⚠️ Open questions for the owner (design §14 — don't block, flag on the plan):**
  1. **Skill name** — `fkit-sprint-ship-loop` is the working name for the owner's *"fkit-spec
     sprint-ship-loop"*. Confirm before hard-wiring it (the name is echoed in 0112's `skills-for-role.sh`
     entry + four mirrors, and 0116's stop-hook set — renaming later touches all of them).
  2. **General-conductor primitive** — is the general conductor (design §4.1) its own named skill, or
     only ever exercised *through* the sprint loop? This spec models the general primitive but names
     only the sprint-loop application. Owner's call.
- **Probe before/at implementation (design §13, §14.1):** does `/fkit-plan-task` need a small
  "spawned/return-only" branch, or does the driver's spawn prompt fully carry "return a plan, write no
  source"? Design leans: driver-prompt carries it — confirm against the binary.
- No commit — leave files in the working tree.
