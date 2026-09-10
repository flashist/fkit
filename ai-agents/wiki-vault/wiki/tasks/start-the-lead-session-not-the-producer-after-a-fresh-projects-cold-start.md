# Start the LEAD session, not the producer, once a fresh project's cold start has been answered

**Source**: `ai-agents/tasks/done/0379-start-the-lead-session-not-the-producer-after-a-fresh-projects-cold-start/brief.md`
**Status**: done
**Sprint/Tag**: Sprint 7 · `P15` · task `0379` · owner `fkit-coder`

## Goal

After a fresh project's cold-start questions are answered, the launcher opened a **producer** session.
The owner asked for the **lead** instead.

⭐ **Read what the instruction does NOT say.** It does not ask for the questions to go away.

⛔ **THE CURRENT ROUTING IS DELIBERATE, NOT AN OVERSIGHT. Do not write this change as a bug fix.**
⭐ **The branch states its own reason, and it is a good one.** ⭐ **The routing simply PREDATES the
decision that makes lead the front door** — it was written before
[[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]].

## Key Changes

⛔ **THE WALL THIS TASK CANNOT CLIMB: `fkit-initiate-project` is producer-only, and it is ENFORCED.**
Verified 2026-09-05. ⛔ **"Start the lead instead" CANNOT mean "the lead runs the initiation."**
⛔ **Widening `skills_for_role()` to hand lead the initiation is NOT in scope and must not be done.**

⭐ **But ADR-031 already supplies the legal shape:** a lead session **spawns `@fkit-producer`**, which
runs the initiation and returns.

⛔ **Step 1 is a DECISION, and the brief deliberately does not make it** — ⚠️ the ambiguity in the
owner's sentence (*"after answering all the questions"*) had to be named when the choice was put up,
not resolved silently.

**Step 2** implements the ruled option in `claude/fkit-claude.sh`. ⚠️ **That is a shipped surface —
four hard constraints.**

⛔ **Step 3 — the existing test PINS the current behaviour and WILL go red. That is expected.**
⛔ **Do not delete it to make the suite green.** Amend it to pin the **new** contract.

## Outcome

Closed `✅ Done (agent-closed — not owner-verified)`.

⚠️ **Priority `P15` is APPEND rank, NOT a merit ranking — flagged for owner confirmation** on the brief.
⚠️ **Rank order and execution order therefore disagree for this pair**, exactly as they already do
elsewhere on this board.

⛔ **Out of scope, each needing its own owner ruling:** widening `skills_for_role()`, and moving where
the initiation runs.

- **Depends on:** nothing.

## Related
- [[tasks/sprint-7-stop-manufacturing-record-repair-rows]] — the board this row sits on
- [[decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door]] — the authority for the change,
  and the source of the legal spawn shape
- [[tasks/pressing-enter-at-the-role-menu-should-open-the-lead]] · [[tasks/reorder-launcher-menu-lead-first-and-rename-label]]
  — the other launcher changes that made lead the front door
- [[tasks/extend-initiate-project-fill-overview]] — the initiation skill that stays producer-only
- [[tasks/stop-init-failure-bricking-the-launcher]] — the same shipped launcher surface
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the
  hook that makes the producer-only wall structural
- [[systems/install-and-self-update]] · [[systems/role-locked-sessions]] — the launcher and the lock
- [[systems/testing-and-verification]] — the launcher-contract test that had to be amended, not deleted
