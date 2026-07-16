# Implement the `PreToolUse` skill-ownership gate (the hook-flip)

## Sprint
Sprint 2

## Priority
43

## Status
🔲 Backlog

## Context

**Implements the design recorded in
[`record-pretooluse-skill-gate-adr-amendment.md`](record-pretooluse-skill-gate-adr-amendment.md)
(task 42)** — reference the resulting ADR by number once it exists. Fixes the live bug it documents:
a coder session spawning `@fkit-reviewer` for a stateful review fails with `Error: Skill
fkit-stateful-review is disabled for model invocation in skillOverrides settings`, because a spawned
subagent inherits the *launching* session's `skillOverrides`, not its own role's. Same bug class as
the producer → architect leak ADR-012 already patched by hand (`CONSULT_SKILLS`); this generalizes
the fix instead of adding a second hand-maintained exception for every future role pair that hits it.

**Do not start until task 42's ADR is recorded and reviewed with the owner.** Building the hook
against an unsettled decision is exactly what the design-then-implement split exists to prevent —
same reasoning as tasks 40/41.

## What to build

1. **A `PreToolUse` hook**, configured for the `Skill` tool, that:
   - Reads the real invoking agent's identity from the hook payload (`agent_type`/`agent_id`) — at
     whatever spawn depth it fires, top-level session or a consult nested any number of hops.
   - Strips the `fkit-` agent prefix to get the role (`fkit-reviewer` → `reviewer`).
   - Reads `skills_for_role()` in `claude/fkit-claude.sh` as the **sole source of truth** for what
     that role owns — read directly; do not duplicate the role→skill mapping in the hook script.
   - **Denies** the call, via an explicit `hookSpecificOutput.permissionDecision` (never a bare exit
     code), if the requested skill is not in that role's list; allows otherwise.
   - **Likely needs `skills_for_role()` extracted into its own sourceable unit** (e.g. a small lib
     file `source`d by both `claude/fkit-claude.sh` and the hook script), rather than sourcing
     `fkit-claude.sh` directly — that script has top-level side effects (self-hosting re-exec, the
     network update check, `$0`/`$PWD`-dependent logic) that must not fire inside a hook invocation.
     Confirm this during planning; it's the kind of thing worth ruling out before writing the hook,
     not discovering when a hook call triggers an update check or a re-exec.
2. **Fail-closed handling, explicitly engineered, not incidental.** Any internal error in the hook
   (payload parse failure, an unmappable role, a script exception, an unexpected payload shape) must
   resolve to an explicit deny — never to a bare/other exit code that Claude Code's fail-open default
   would treat as allow. This is the main correctness risk the ADR names, and it needs its own test
   path, not just an implementation.
3. **Retire the now-redundant plumbing in `claude/fkit-claude.sh`, sequenced *after* the hook is
   verified working:** stop generating the `skillOverrides` "off" list in `build_settings()`, and
   remove the `CONSULT_SKILLS` allowlist (`claude/fkit-claude.sh:252`). Removing the old gate before
   the new one is confirmed working would leave a window with no enforcement at all — don't do both in
   the same breath.
4. **Update the two doc spots ADR-012 flagged as needing correction**, now in the other direction:
   `claude/skills/fkit-team/SKILL.md` and `claude/scaffold/CLAUDE.md` currently say (correctly, as of
   ADR-012) that non-owned skills are advisory-only in a consult. Once this hook lands that becomes
   false again project-wide — the docs must say so.

## Verification steps

- **Reproduce the reported bug first.** Confirm a coder session spawning `@fkit-reviewer` for a
  stateful review fails today (pre-fix), then confirm the same flow succeeds after the hook lands.
- **Enforcement holds at multiple spawn depths, not just one hop:**
  - a role *session* invoking a skill it doesn't own is still denied (must not regress the one thing
    that already worked);
  - a one-hop consult (e.g. coder → reviewer) invoking a skill the *reviewer* owns succeeds, and
    invoking one it doesn't own is denied;
  - a two-hop consult (e.g. coder → reviewer → architect) enforces against the actual innermost
    caller's role, not the top-level session's.
- **The fail-open risk gets explicit test coverage, not just implementation:** force the hook script
  into an internal error state (bad payload, a thrown exception, a missing role mapping) and confirm
  the call is still **denied**, not silently allowed through Claude Code's default fail-open behavior.
  Required, not optional hardening.
- **Removing `CONSULT_SKILLS` and the `skillOverrides` off-list doesn't reopen a worse leak, and
  doesn't break the case `CONSULT_SKILLS` existed for**: `/fkit-initiate-project`'s producer →
  architect → `fkit-survey-project` consult must still work, now via the hook's own
  role-owns-the-skill logic (architect owns `fkit-survey-project`) instead of the exception list.
- **Universal skills (`fkit-team`, `fkit-query` — already in every role's own `skills_for_role()`
  list) remain reachable from every role, at every consult depth** — confirm the hook doesn't regress
  the one thing that was never broken.
- **Both flagged docs are updated** and no longer contradict the new enforcement reality.

## Notes

- **Owner: fkit-coder**, with fkit-architect available for a consult on fidelity to the ADR.
- **Depends on:** task 42 (the ADR) — **hard**. Do not begin implementation before it's recorded and
  reviewed with the owner.
- **Relates to:** ADR-010, ADR-012 — this is the reopening those decisions predicted and priced.
- **Risk: medium-high.** This changes the mechanism reviewer independence rests on (ADR-010's core
  claim). Get the fail-closed behavior and the multi-depth tests right — a hook that silently fails
  open is *worse* than the `CONSULT_SKILLS` leak it replaces, because it would look enforced without
  being enforced.
- **Provenance:** fkit-coder → fkit-producer consult, 2026-07-16 (live bug + verified design; owner
  has authorized starting work).
