# ADR-012: The skill lockdown is session-scoped; `skills:` frontmatter is dropped, not generated

- **Status:** accepted — **Decisions 3 and 4 superseded by
  [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md)
  (2026-07-16)**; §§1, 2 (structural-in-session half), 5 remain in force
- **Date:** 2026-07-11
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect
- **Supersedes (in part):** [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md) §Decision 2
  (`adr-010:63-65`) and §Decision 5 (`adr-010:73-76`)

> ⚠️ **Read this before trusting Decision 2's "advisory in a consult" language below.**
> [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) reopens
> Decisions 3 and 4 (their own pre-registered re-raise trigger, `adr-012:139-141`, is met) and adopts
> the `PreToolUse` skill-ownership hook. Once that hook is implemented and verified (tracked in
> `ai-agents/tasks/backlog/implement-pretooluse-skill-ownership-hook.md`), the "structural in a
> session, advisory in a consult" split this file draws in Decision 2 **no longer describes current
> truth** — enforcement extends to the consult path at any depth. This file is kept intact, unedited
> below, as the historical record; ADR-018 is the current ground truth for the consult-path question.

## Context

ADR-010 locked every fkit session to one role and claimed the lock was **structural**: "Role
separation is enforced structurally, not by instruction" (`adr-010:63-65`). It also left one thing
to the coder: `skills_for_role()` is the single source of truth, and the `skills:` frontmatter in
`claude/agents/*.md` "must be **generated from it or dropped**" (`adr-010:73-76`). Sprint 2 task 6
went to close that, and in doing so established — empirically, from live spawns — that **the
mechanism is not what ADR-010 assumed**.

### What the mechanism actually is

```
skill availability in ANY context (session or spawned consult)
  = all installed skills − the skillOverrides of the SESSION THAT LAUNCHED THE PROCESS
`skills:` frontmatter  →  inert; no effect on enforcement
```

**A consult's skill set is a function of the *caller's* role, not the consultee's.** A spawned
subagent inherits the launching session's `--settings` and nothing else. Three independent spawns
from a **coder** session, each reporting the *coder's* skills rather than its own:

1. Spawned `fkit-lead` (frontmatter: `fkit-team, fkit-query`) was advertised **every** fkit skill,
   and the harness **accepted** its `Skill(fkit-status)` call — a producer-owned skill. Only the
   `⛔ Owner:` prose banner in the skill body stopped it.
2. Spawned `fkit-architect` reported the coder's set — none of its own five procedures.
3. Spawned `fkit-producer` reported `fkit-plan-task` / `fkit-process-review` /
   `fkit-process-stateful-review` (the coder's) and **could not see** `fkit-initiate-project`,
   `fkit-task-done`, or `fkit-task-cancelled` (its own).

This matches the Claude Code docs: `skills:` controls **preloading only** — *"Subagents can still
invoke unlisted project, user, and plugin skills through the Skill tool."* `skillOverrides` has no
per-subagent scoping.

### The live bug this exposes

`claude/skills/fkit-initiate-project/SKILL.md:77-81` has the **producer** spawn the architect and
ask it to run `fkit-survey-project`. But `skills_for_role producer`
(`claude/fkit-claude.sh:95`) does not include that skill, so `build_settings()`
(`claude/fkit-claude.sh:108-120`) writes it **`"off"`** into `producer.json` — and the spawned
architect inherits that override. **Project initiation cannot invoke its own architecture survey.**
Symmetrically, a `lead` session grants only `fkit-team fkit-query` (`claude/fkit-claude.sh:94`), so
every role consulted from the team room gets **zero procedures**.

### Honest note on why ADR-010 is being reopened

ADR-010's re-raise clause says to reopen if Claude Code's `skillOverrides` / `--settings` semantics
"materially change what is enforceable" (`adr-010:114-116`). The semantics did **not** change — **we
misread them.** The trigger is met on the merits, and the record should show this as a misreading
corrected by evidence, not a platform regression.

## Decision

1. **The `skills:` frontmatter is inert and is therefore DROPPED, not generated.** ADR-010 §5 offered
   "generated from it **or** dropped"; that choice is now settled as **dropped**. Generating it would
   preserve a field that *looks* like an allowlist and enforces nothing — manufacturing the exact
   false invariant task 6 exists to kill. `skills_for_role()` in `claude/fkit-claude.sh:92-103`
   remains the **single source of truth**, and now the *only* place role→skill ownership is expressed.

2. **Enforcement is session-scoped by design: structural in a role session, advisory in a consult.**
   This replaces ADR-010 §2's unqualified "enforced structurally, not by instruction."
   - **In a role *session*** the lock is real and structural. The `--settings` `skillOverrides` JSON
     is correctly generated and applied (`claude/fkit-claude.sh:108-120`, verified). A `fkit coder`
     session genuinely cannot run `/fkit-review`. **This is the property reviewer independence rests
     on, and it holds** — ADR-010's core claim survives where it matters.
   - **In a *consult*** (spawned subagent) the boundary is carried by the agent's system prompt and
     the `⛔ Owner:` banner at the top of each skill. It is **advisory**. This is a known, accepted
     limit, of the same family as ADR-010's already-conceded prompt-enforced consult topology
     (`adr-010:107-110`).
   - **Consequently, two docs currently overclaim and MUST be corrected:**
     `claude/skills/fkit-team/SKILL.md:38` and `claude/scaffold/CLAUDE.md:33` both say non-owned
     skills are "invisible and unrunnable." True of a session; **false of a consult.** They must be
     scoped to sessions.

3. **A consult-reachable skill set exists, and `build_settings()` must never turn it off.** Because a
   consult inherits the *caller's* overrides, any skill a role is genuinely consulted *to run* must
   be left on for **every** role. Today that set is **`fkit-survey-project`** (plus `fkit-query`,
   already universal). Without it, initiation is broken.

   **Its cost, stated plainly:** an owner in any role session could then invoke
   `/fkit-survey-project` by name. That is a **benign leak on a read-heavy doc procedure**, traded
   against an initiation flow that currently **cannot run its own survey**. We take the trade. The
   set is deliberately minimal — adding to it is a decision, not a convenience.

4. **The `PreToolUse` hook stays deferred — but the deferral is now priced.** A `PreToolUse` gate on
   the `Skill` tool is the **only** mechanism that could make per-role skill ownership real on the
   consult path. It remains deferred (as in `adr-010:92-94`), but no longer as a *free* deferral: the
   named cost is that decisions 2 and 3 above exist only because we don't have it. Open question:
   **does the hook payload even expose the calling subagent's identity?** If it does not, the hook
   cannot discriminate by role and this option is not merely deferred but **unavailable** — that must
   be established before the hook is planned as the fix.

## Options considered

- **Drop the frontmatter; session-scoped lock; a minimal always-on consult set (chosen).** Matches the
  runtime as it actually behaves. One source of truth, no field that lies. Fixes initiation. Cost: the
  consult path is honestly advisory, and `fkit-survey-project` is reachable from any session.
- **Generate `skills:` from `skills_for_role()`** (ADR-010 §5's other branch). Rejected on the
  evidence: the field is **inert**. Generating it produces a maintained, tested, CI-checked artifact
  that enforces **nothing** — strictly worse than dropping it, because it manufactures false
  confidence in exactly the invariant we now know does not hold. A reader (or reviewer) would
  reasonably infer an allowlist where there is none.
- **Give the producer `fkit-survey-project` only** (narrowest fix for the initiation bug). Rejected:
  it fixes the one bug and leaves the general rule wrong. Any *other* consult-that-runs-a-procedure —
  and anything spawned from a `lead` session, which today grants nothing — breaks the same way. The
  rule belongs in `build_settings()`, not in one role's list.
- **Give every role every skill** (abandon the lockdown). Rejected: it discards the one place
  enforcement is genuinely structural — the role session — which is the whole basis of reviewer
  independence under ADR-010. The consult path being soft is not a reason to soften the session path.
- **Ship the `PreToolUse` hook now.** Not rejected on merit — **deferred**, per Decision 4. It is the
  only real fix for the consult path, but it is unbudgeted, and it may not even be viable (see the
  open question). Deferring it is what makes Decision 3's benign leak necessary.

## Consequences

- **Positive:** the docs and the code will finally describe the same runtime. One source of truth for
  role→skill ownership, with no second field pretending to be one. **Project initiation works** — the
  producer can actually get its architecture survey. The strong claim (a role session's lock is
  structural) is preserved and now stands on verified ground rather than assumption.
- **Negative / costs:**
  - **The consult path is advisory, and we now say so out loud.** A misbehaving or confused subagent
    can invoke a skill it does not own; only prose stops it. Evidence #1 above is a live demonstration.
  - **`fkit-survey-project` is reachable from every role session** by name (Decision 3's accepted leak).
  - `claude/skills/fkit-team/SKILL.md:38` and `claude/scaffold/CLAUDE.md:33` must be reworded — a
    doc-truth fix that weakens the pitch. That is correct: the pitch was overclaiming.
  - The `⛔ Owner:` banner is now **load-bearing** on the consult path, not merely belt-and-braces. It
    may not be removed from a skill as "redundant."
- **Residual risks / "re-raise only if":**
  - **Claude Code gains per-subagent skill scoping** (honoring `skills:` for enforcement, or scoping
    `skillOverrides` to a spawn) — that *would* be a genuine semantic change and should reopen
    Decisions 1 and 2.
  - **The `PreToolUse` hook payload is confirmed to expose the calling subagent's identity** and
    someone is prepared to build the gate — reopen Decisions 3 and 4 together, since the hook would
    remove the need for the always-on consult set.
  - **The always-on consult set needs a *second* member.** Do not add one silently — that is a new
    decision and re-opens Decision 3, because each addition widens the leak.
  - Do **not** re-raise "the skill lock is only prompt-enforced" as a blanket defect — it is
    **structural in a session** (ADR-010's claim, upheld) and **advisory in a consult** (stated here as
    a known, accepted limit). A finding must say *which path* it means.
  - Do **not** re-raise "why isn't `skills:` generated from `skills_for_role()`" — that is this
    decision, and the answer is that the field does not do anything.
  - Do **not** re-raise ADR-010's role-locked session model itself. Only its §§2 and 5 are amended
    here; §§1, 3, 4 stand unchanged.

## Related

- [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md) — supersedes §Decision 2
  (`adr-010:63-65`) and §Decision 5 (`adr-010:73-76`). Its file is kept intact (honest numbering);
  §§1, 3, 4 remain in force.
- [ADR-008](adr-008-claude-code-native-port-alongside-omnigent.md) — the deferred path-level hooks
  (`adr-008`), of which the `PreToolUse` `Skill` gate in Decision 4 is a sibling.
- [ADR-009](adr-009-claude-code-native-is-the-only-runtime.md) — the runtime this all lives on.
- The live bug: `claude/skills/fkit-initiate-project/SKILL.md:77-81` vs
  `claude/fkit-claude.sh:95` (`skills_for_role producer`) and `claude/fkit-claude.sh:108-120`
  (`build_settings`).
- Docs to correct: `claude/skills/fkit-team/SKILL.md:38`, `claude/scaffold/CLAUDE.md:33`.
- Source of truth: `claude/fkit-claude.sh:92-103` (`skills_for_role()`).
