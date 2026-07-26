# Add `fkit-sprint-ship-loop` to the ADR-030 Stop-hook skip set

**Source**: `ai-agents/tasks/done/0116-add-sprint-ship-loop-to-stop-hook-skip-set/brief.md`
**Status**: done *(agent-closed — not owner-verified)*
**Sprint/Tag**: Sprint 2 · ID 0116 · priority 98 · owner `fkit-coder`

## Goal

Exempt the sprint loop's mechanical **idle** turns from the ADR-030 `Stop` hook's "What's next?" footer requirement, alongside `/fkit-task-ship-loop`.

## Key Changes

The sprint loop's idle turns run in the interactive lead session, so the `Stop` hook *sees* them — but a long autonomous driver is not a normal turn. Its **relay** turns already satisfy the hook's check A, because they call `AskUserQuestion`; this skip covers only the idle ones.

**The task was filed deliberately blocked.** When written, `claude/turn-completion-hook.sh` did not exist — [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] was authorized but unbuilt. The brief says plainly: *"do not start until the hook exists; this brief is filed to preserve the dependency, not to be picked up now."* It unblocked when [[tasks/build-adr-030-stop-hook]] landed on 2026-07-23.

## Outcome

**Done, agent-closed.** `node --test` → **494 pass / 0 fail** with both loop-skip tests green; `prove-red.sh` hard gate PASSED. The model-diverse review (reviewer + Codex) returned **0 defects** and **mutation-proved** the new test is a real gate — reverting the skip reds exactly that test.

**Its known weakness was scoped out honestly rather than silently inherited.** The detection at that point still scanned the transcript for the command marker, so this task added a *second* transcript-scanned entry carrying the same fragility. That was already filed as its own task and fixed immediately after — [[tasks/transcript-independent-ship-loop-skip-signal]] replaced the scan with an authoritative marker covering **both** loops.

⚠️ **Hand-verified only**: the live session-scoped path (a real invocation, and the `Stop` hook then actually skipping) cannot be exercised by a spawned or headless subagent.

## Related
- [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] — Decision 7's skip set
- [[decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model]] — Decision 8, which required this
- [[tasks/build-adr-030-stop-hook]] — the external blocker that had to land first
- [[tasks/transcript-independent-ship-loop-skip-signal]] — the hardening that made the skip signal trustworthy
- [[tasks/build-fkit-sprint-ship-loop-skill]] — hard dependency
- [[systems/testing-and-verification]] · [[systems/role-locked-sessions]] · [[systems/fkit]]
- [[tasks/design-fkit-lead-as-orchestrating-front-door-and-sprint-ship-loop]] — Design fkit-lead as the orchestrating front door, and the `fkit-sprint-ship-loop` skill
