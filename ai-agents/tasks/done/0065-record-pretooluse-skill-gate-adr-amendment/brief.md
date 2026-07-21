# Reopen ADR-012 Decisions 3 & 4 — record the PreToolUse skill-gate hook

## ID
0065

## Sprint
Sprint 2

## Priority
42

## Status
✅ Done

## Context

**Live bug, found today (2026-07-16) by fkit-coder:** spawning `@fkit-reviewer` to run a stateful
review failed with `Error: Skill fkit-stateful-review is disabled for model invocation in
skillOverrides settings`.

**Root cause, traced across three fkit-coder ↔ fkit-architect consults today:** `skillOverrides` is a
single flat setting for the whole Claude Code CLI **process**, applied identically to the top-level
session and to every subagent spawned within it, at any nesting depth. A spawned subagent does **not**
get its own role's skill list — it inherits whatever the *launching* session's settings turned on/off.
This is the **same bug class**
[ADR-012](../../../knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md)
already logged once (producer → architect, `fkit-survey-project`) and hand-patched with a
`CONSULT_SKILLS` always-on exception list (`claude/fkit-claude.sh:252`). Coder → reviewer is the same
class, unpatched, and it will keep recurring for any role pair not added to that hand-maintained list.

**ADR-012's own re-raise trigger for Decision 4 is met, verbatim:** *"the `PreToolUse` hook payload is
confirmed to expose the calling subagent's identity and someone is prepared to build the gate →
reopen Decisions 3 and 4 together, since the hook would remove the need for the always-on consult
set."* Verified today, against the running Claude Code binary (not just docs), across three
consults: the `PreToolUse` hook payload **does** expose the real, live caller identity
(`agent_type`/`agent_id`) at any spawn depth — the actual current caller, not the inherited
launching-session settings.

**Chosen design ("the hook-flip"), for the record — the design itself was settled in today's
consults, this task only records it:**
- Leave every fkit-* skill technically enabled everywhere; drop the `skillOverrides`-based "off" list
  and retire `CONSULT_SKILLS` entirely.
- Add a `PreToolUse` hook on the `Skill` tool that **denies** a call whenever the invoking agent's
  role (parsed from `agent_type`, e.g. `fkit-reviewer` → `reviewer`, at any spawn depth) does not own
  that skill per `skills_for_role()` in `claude/fkit-claude.sh` — the existing single source of truth,
  read directly, never duplicated.
- A hook can only ever **add** a deny on top of what the harness already allows; it can never grant an
  allow the harness doesn't have. (A separate idea — using a hook to *unblock* an "off" skill — was
  tried and confirmed **impossible**; this design does not need it and does not use it.)
- **Net effect:** ADR-010's claim *"enforced structurally, not by instruction"* — which ADR-012 had to
  concede was only true of a plain top-level session — now extends to a spawned consult at any depth.
  It also fully retires the accepted "`fkit-survey-project` reachable from anywhere" leak (ADR-012
  §Decision 3), since enforcement now follows the real caller instead of a hand-carried exception.
- **Named risk, not an afterthought:** Claude Code's hook exit-code semantics **fail open** by
  default — exit 0, or any other/unhandled outcome, is treated as allow; only an explicit deny
  decision (or exit 2) blocks. The hook must be the deliberate exception to that default, every time,
  including its own internal-error paths.

This is not a new decision manufactured on the spot — it is the exact condition ADR-012
pre-registered as its own trigger to reopen. Recording it is the remaining act; the analysis is done.

## What to build

Record an ADR (via `/fkit-record-decision`) that:

- **Reopens ADR-012 Decisions 3 and 4 together**, per its own re-raise trigger, now confirmed met.
- **Retires Decision 3** (the `CONSULT_SKILLS` always-on exception list) — no longer needed once the
  hook enforces by real caller identity instead of inherited launching-session settings.
- **Moves Decision 4 from "deferred, priced" to "adopted"**: the `PreToolUse` `Skill`-tool gate
  described above, keyed on `skills_for_role()` as sole source of truth.
- **Names the live bug that triggered it** (coder → reviewer, `fkit-stateful-review`, 2026-07-16) as a
  second concrete instance alongside the producer → architect one ADR-012 already recorded —
  establishing this as a recurring **bug class**, not a one-off.
- **States the fail-open hook semantics explicitly as a hard implementation requirement**: always emit
  an explicit deny decision; treat any internal hook error or unexpected payload as deny, never as an
  implicit allow.
- **Reconciles ADR-010/ADR-012's now-stale wording.** ADR-012 Decision 2 states enforcement is
  "structural in a role session, advisory in a consult." Once this hook lands, that is no longer true —
  the ADR record must say so (supersede/update the affected language) rather than leave two ADRs in
  silent conflict with the runtime.
- **Settles or explicitly defers these open items**, so the implementation task isn't left to
  discover or silently decide them:
  - **Menu visibility.** `skillOverrides: "off"` today also hides a skill from the `/` autocomplete
    menu, not just blocks invocation. Retiring the off-list means a foreign-role skill becomes
    *visible* in the menu even though invoking it is denied by the hook. Decide whether that's
    accepted, and record it — don't let it surface as a surprise UX regression.
  - **Confirm the rejected alternative by name:** prose-only self-refusal with no hook backstop was
    evaluated and rejected today (defeatable by prompt injection; would retire ADR-010's structural
    claim rather than strengthen it). Record the rejection so it isn't re-litigated.
- **Links to ADR-010, ADR-012** (superseding language; honest numbering — neither file is deleted or
  renumbered) and to this task's sibling implementation task
  ([`implement-pretooluse-skill-ownership-hook.md`](../0052-implement-pretooluse-skill-ownership-hook/brief.md)).

## Verification steps

- ADR file exists in `ai-agents/knowledge-base/decisions/` at the next sequential number, following
  the existing template used by its siblings.
- It explicitly names: both bug instances (producer→architect, coder→reviewer), the hook-payload-
  identity finding, the fail-open risk, the `CONSULT_SKILLS` retirement, and the menu-visibility
  question (settled or explicitly deferred — not silently dropped).
- ADR-010 and/or ADR-012 carry an updated cross-reference so a reader lands on current truth, not
  stale "advisory in a consult" language.
- The rejected prose-only alternative is recorded by name with its disqualifying reason.

## Notes

- **Owner: fkit-architect**, via `/fkit-record-decision`. The producer scopes the task; the architect
  writes the decision — same division as task 37.
- **Depends on: nothing.** The investigation is already done (three architect consults today,
  verified against the running binary). This is the recording step, not new analysis.
- **Blocks:** [`implement-pretooluse-skill-ownership-hook.md`](../0052-implement-pretooluse-skill-ownership-hook/brief.md)
  — hard dependency, same pattern as the design-then-implement split already used for tasks 40/41 and
  the investigation-then-implementation pattern for tasks 20/29/39: don't build against a decision
  that isn't recorded yet.
- **Provenance:** fkit-coder → fkit-producer consult, 2026-07-16 (live bug + verified design,
  escalated per project routing; owner has authorized starting work).
