# Build the `fkit-sprint-ship-loop` skill (the lead's sprint-scope conductor loop)

**Source**: `ai-agents/tasks/done/0111-build-fkit-sprint-ship-loop-skill/brief.md`
**Status**: done *(agent-closed — not owner-verified)* · ⚠️ **partly superseded by ADR-033**
**Sprint/Tag**: Sprint 2 · ID 0111 · priority 93 · owner `fkit-coder`

## Goal

Create `claude/skills/fkit-sprint-ship-loop/SKILL.md` — a lead-owned driver that ships a sprint's eligible tasks brief→closed by spawning role workers and relaying owner decisions live through the lead session.

## Key Changes

Modeled on the coder's `fkit-task-ship-loop` at **sprint scope**, re-implemented at the **driver** level so the owner channel lives in the loop, not in a spawned worker. The coder's loop stays **byte-unchanged and session-only** — the sprint loop reuses its *shape*, and is forbidden from ever invoking it (it refuses spawned invocation and could not reach the owner anyway).

The `⛔ Owner: the lead` banner, one operand (a sprint plan path; empty = active sprint) and no output-variant flags, per the one-skill-one-output convention. Selection reads the board via `dashboard.sh` rather than re-deriving status by hand; a dependency deadlock stops and reports the chain.

### The plan-gate honesty clause — required to survive into the skill text

On the orchestrated path, *"no code before the owner approves the plan"* is **prose-enforced in the worker prompt, not a runtime write-wall**. Plan mode cannot function in a spawned worker, so the loop splits it: spawn the coder **for the plan only** → driver presents it via `AskUserQuestion` → owner approves → spawn the coder **to implement**.

> The brief's binding instruction: **a later reader — human or coder — must not "fix" this into a false structural guarantee.** The skill must state plainly that this path does **not** carry plan mode's write-wall.

## Outcome

**Done, agent-closed.** Verified: the front matter and banner are present; §5.1 selection, the six-row drive table (Plan→Build→Verify→Review→Process→Close), the `DONE`/`NEEDS-DECISION`/`BLOCKED` relay envelope with *"no timer, no guess"*, the seven-row stop table and the reporting contract all landed; the honesty clause is present **as prose-enforced, not structural**, with the explicit "must not rewrite into a false guarantee" warning; close writes the agent-closed marker by default, degraded runs do not self-close, and it never self-cancels. `fkit-task-ship-loop/SKILL.md` is **byte-unchanged**.

> ⚠️ **Superseded in part by [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] (2026-07-23).** This skill was built to **ADR-032-as-first-written**, where the driver runs `/fkit-task-done` itself. ADR-033 makes the movers **producer-only**, so the loop must instead **spawn `@fkit-producer` to close**. **This task stays Done**; the revision landed via [[tasks/route-sprint-ship-loop-close-to-producer]].

Two open questions were flagged rather than blocking: whether to confirm the skill *name* before it is hard-wired in five places, and whether the general-conductor primitive is its own named skill or only ever exercised through the sprint loop.

## Related
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — the contract built
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] — **amends the close step**
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the honesty clause
- [[tasks/evolve-fkit-lead-into-orchestrating-conductor]] — hard dependency
- [[tasks/wire-lead-sprint-ship-loop-skill-ownership-and-mirrors]] · [[tasks/add-sprint-ship-loop-to-stop-hook-skip-set]] — what this blocks
- [[tasks/route-sprint-ship-loop-close-to-producer]] — the ADR-033 revision
- [[tasks/implement-task-ship-loop-skill]] · [[tasks/design-task-ship-loop-skill]] — the task-scope loop whose shape this reuses
- [[systems/fkit]]
- [[systems/role-locked-sessions]] — Role-Locked Sessions & the Skill Lockdown
- [[systems/testing-and-verification]] — Testing & Verification
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] — Design fkit-lead as the orchestrating front door, and the `fkit-sprint-ship-loop` skill
