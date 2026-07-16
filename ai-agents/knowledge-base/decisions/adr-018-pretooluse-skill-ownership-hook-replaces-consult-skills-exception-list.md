# ADR-018: The `PreToolUse` skill-ownership hook replaces the `CONSULT_SKILLS` exception list

- **Status:** accepted
- **Date:** 2026-07-16
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect
- **Reopens:** [ADR-012](adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md) Decisions 3
  and 4, together, per that ADR's own re-raise trigger (`adr-012:139-141`)
- **Supersedes (in part):** [ADR-012](adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md)
  Decision 3 (retired) and the "advisory in a consult" half of Decision 2 (superseded once the hook
  lands — see §Decision below)

## Context

ADR-012 established, from live evidence, that the fkit skill lockdown is **session-scoped**: a
consult (spawned subagent) inherits the *launching* session's `skillOverrides`, not its own role's.
It patched the one known instance of this (producer → architect, `fkit-survey-project`) with a
hand-maintained always-on exception list, `CONSULT_SKILLS="fkit-survey-project fkit-query"`
(`claude/fkit-claude.sh:252`), and explicitly **priced** rather than fixed the underlying problem —
Decision 4 deferred the only real fix, a `PreToolUse` gate on the `Skill` tool, pending one open
question: *"does the hook payload even expose the calling subagent's identity?"* (`adr-012:95-98`).
ADR-012 pre-registered its own re-raise condition, verbatim: *"the `PreToolUse` hook payload is
confirmed to expose the calling subagent's identity and someone is prepared to build the gate →
reopen Decisions 3 and 4 together"* (`adr-012:139-141`).

**Both conditions are now met.**

**A second live instance of the exact bug class**, found today (2026-07-16) by fkit-coder: spawning
`@fkit-reviewer` to run a stateful review failed with `Error: Skill fkit-stateful-review is disabled
for model invocation in skillOverrides settings`. Traced across three fkit-coder ↔ fkit-architect
consults to the same root cause ADR-012 already named: `skillOverrides` is one flat setting for the
whole CLI process, applied identically to the launching session and every subagent spawned inside it
at any nesting depth (`claude/fkit-claude.sh:252,258`, `build_settings()` at `:257-283`). Coder →
reviewer is not on the `CONSULT_SKILLS` list; it fails the same way producer → architect did before
that list existed, and it will keep recurring for any role pair not hand-added to it — this is a
**bug class**, not a one-off.

**The open question is answered.** Verified today against the running Claude Code binary (not docs),
across the three consults above: the `PreToolUse` hook payload **does** expose the real, live caller
identity (`agent_type`/`agent_id`) at any spawn depth — the actual current caller, not the inherited
launching-session settings. This is the fact ADR-012 said would make the hook *available* rather
than merely deferred.

**The design (the "hook-flip"), settled in today's consults — this ADR is the record, not new
analysis:**

- Leave every `fkit-*` skill technically enabled everywhere (drop the `skillOverrides`-based "off"
  list that `build_settings()` writes today).
- Add a `PreToolUse` hook on the `Skill` tool that **denies** a call whenever the invoking agent's
  role (parsed from `agent_type`, e.g. `fkit-reviewer` → `reviewer`, at any spawn depth) does not own
  that skill per `skills_for_role()` in `claude/fkit-claude.sh:230` — the existing single source of
  truth, read directly, never duplicated.
- A hook can only ever **add** a deny on top of what the harness already allows; it cannot grant an
  allow the harness doesn't have. A separate idea — using a hook to *unblock* an "off" skill — was
  tried and confirmed **impossible**; this design doesn't need it and doesn't use it.
- **Named risk, load-bearing, not an afterthought:** Claude Code's hook exit-code semantics **fail
  open** by default — exit 0, or any other/unhandled outcome, is treated as allow; only an explicit
  deny decision (or exit 2) blocks. The hook implementation MUST treat this as the default it exists
  to override, in every code path, including its own internal-error paths.

## Decision

1. **ADR-012 Decisions 3 and 4 are reopened together, as pre-registered, and resolved as follows:**

2. **Decision 3 (the `CONSULT_SKILLS` always-on exception list) is RETIRED.** Once enforcement follows
   the real caller's identity instead of inherited launching-session settings, the exception list has
   no remaining purpose — every role reaches exactly its own skills via the hook, with no
   hand-maintained "leave this on for everyone" carve-out. This also retires the accepted leak
   Decision 3 named: `fkit-survey-project` was reachable from every role session by name
   (`adr-012:130`); under the hook it is reachable only by a role that actually owns it, or by a
   consult chain whose real innermost caller does.

3. **Decision 4 moves from "deferred, priced" to ADOPTED: the `PreToolUse` `Skill`-tool gate.**
   - Reads the real invoking agent's identity from the hook payload (`agent_type`/`agent_id`), at
     whatever spawn depth it fires — top-level session or a consult nested any number of hops.
   - Strips the `fkit-` prefix to get the role (`fkit-reviewer` → `reviewer`).
   - Reads `skills_for_role()` (`claude/fkit-claude.sh:230`) as the sole source of truth for what that
     role owns — read directly, never duplicated into the hook script.
   - Emits an explicit `hookSpecificOutput.permissionDecision` deny if the requested skill is not in
     that role's list; allows otherwise. Never a bare exit code standing in for the decision.
   - **Fail-open is the named implementation hazard, and the requirement is explicit:** any internal
     hook error — payload parse failure, an unmappable role, a script exception, an unexpected payload
     shape — MUST resolve to an explicit deny. It may never fall through to Claude Code's fail-open
     default. This is a hard implementation requirement, not a nice-to-have, and the sibling
     implementation task requires dedicated test coverage forcing exactly these error states.

4. **Net effect on ADR-010 and ADR-012's claims — reconciled here, not left stale:**
   - ADR-010's claim *"role separation is enforced structurally, not by instruction"*
     (`adr-010:63-65`) — which ADR-012 had to concede was true only of a plain top-level session
     (`adr-012:67-76`) — now **extends to a spawned consult at any depth**, once this hook lands. The
     structural/advisory split ADR-012 drew between "in a session" and "in a consult" no longer holds
     as a permanent architectural fact; it holds only until the hook ships.
   - **ADR-012 Decision 2's wording is superseded, not merely reinterpreted**: "structural in a role
     session, advisory in a consult" was correct when written and becomes incorrect once this hook is
     implemented and verified. A reader landing on ADR-012 alone would now be reading stale ground
     truth; this ADR is the pointer forward. (ADR-012's file is not edited or renumbered — see
     §Related and honest-numbering practice below.)
   - ADR-012 Decision 3's stated leak (`fkit-survey-project` reachable everywhere) and Decision 4's
     deferral are both closed by this ADR — not by amending ADR-012's text, but by this ADR
     superseding them going forward.

5. **Menu visibility — settled, not left to surprise the implementer.** `skillOverrides: "off"` today
   also hides a skill from the `/` autocomplete menu, not just blocks invocation
   (`claude/fkit-claude.sh:23` comment; `build_settings()` behavior). Retiring the off-list means a
   foreign-role skill becomes **visible** in the menu (e.g. a coder session's `/` autocomplete will
   list `/fkit-review`), even though invoking it is denied by the hook. **Accepted.** The properties
   that matter — a coder cannot *run* the reviewer's procedure, at any depth — are what the hook
   protects; a menu entry that fails on invocation is a discoverability nuisance, not a boundary
   violation, and is a strictly smaller cost than the `CONSULT_SKILLS` leak it replaces. Re-raise only
   if this visibility is shown to leak information beyond "this skill name exists" (e.g. if the menu
   ever previews skill contents).

6. **The rejected alternative, named so it isn't re-litigated:** prose-only self-refusal with no hook
   backstop (i.e., leaving the `⛔ Owner:` banner as the sole enforcement on the consult path
   indefinitely) was evaluated today and **rejected** — it is defeatable by prompt injection or a
   simply confused subagent (ADR-012 §Decision 2's own evidence #1, a spawned `fkit-lead` that was
   stopped only by prose), and it would leave ADR-010's structural claim permanently false for the
   consult path rather than closing the gap the hook now closes.

## Options considered

- **The `PreToolUse` skill-ownership hook, keyed on `skills_for_role()` (chosen).** Makes enforcement
  follow the real caller at any depth. Retires a hand-maintained exception list that only grows with
  every new consult-that-runs-a-procedure. Extends ADR-010's structural claim to the one place it
  didn't hold. Cost: new implementation surface, and the fail-open hazard named above must be
  engineered against explicitly (see the sibling implementation task, task 43).
- **Keep `CONSULT_SKILLS`, add a second member for the coder → reviewer case (status quo, patched
  again).** Rejected: this is the exact anti-pattern ADR-012 Decision 3 already warned against — "do
  not add [a second member] silently — that is a new decision and re-opens Decision 3, because each
  addition widens the leak" (`adr-012:142-143`). It does not fix the bug class, only adds a third
  known instance to a list that will keep needing new entries indefinitely.
- **Prose-only self-refusal, no hook (rejected — see Decision 6).** Defeatable by prompt injection;
  leaves ADR-010's structural claim false for the consult path permanently rather than temporarily.
- **A hook that *unblocks* an off-listed skill for the owning role, keeping `skillOverrides` "off" as
  the default (tried, confirmed impossible).** A hook can only add a deny on top of what the harness
  already allows — it cannot grant an allow the harness has already turned off. This rules out any
  design that tries to keep the off-list and patch around it with a hook; the off-list must go.

## Consequences

- **Positive:**
  - Role separation on the consult path becomes structural, closing the gap ADR-012 named and priced.
    ADR-010's original claim is now true everywhere it was meant to be true, not just in a session.
  - No more hand-maintained exception list that grows by one entry per newly-discovered bug instance.
    `skills_for_role()` stays the single source of truth, now enforced at the point of invocation
    instead of at session-launch time only.
  - The `fkit-survey-project`-reachable-everywhere leak (ADR-012 Decision 3) closes as a side effect,
    not as a separately engineered fix.
- **Negative / costs:**
  - **New implementation and test surface**, carrying real risk: this changes the mechanism reviewer
    independence rests on. The fail-open hazard must be engineered against explicitly, with dedicated
    test coverage forcing internal-error paths to deny (task 43's required verification, not optional
    hardening).
  - **Menu visibility regresses in one narrow way** (§Decision 5): non-owned skills become visible,
    though not invocable, in the `/` menu across every session. Accepted, not fixed.
  - Two prior ADRs (010, 012) now carry language ("advisory in a consult") that is accurate as
    *history* but not as *current truth* once this hook ships — readers must follow this ADR's pointer
    rather than trusting ADR-012's Decision 2 prose in isolation. Neither file is edited or
    renumbered; this ADR is the correction layered on top, per project convention (`adr-012:154-156`
    keeping ADR-010 intact after being superseded in part).
  - `claude/skills/fkit-team/SKILL.md` and `claude/scaffold/CLAUDE.md`, corrected by ADR-012 to say
    non-owned skills are advisory-only in a consult, must be corrected **again**, in the other
    direction, once the hook lands and is verified (tracked in the sibling implementation task, not
    duplicated here).
- **Residual risks / "re-raise only if":**
  - **The hook is implemented but ships with a fail-open path** (an error state that resolves to allow
    instead of deny) — this is not a new decision to re-litigate, it is a defect against *this* ADR's
    explicit requirement in Decision 3. Fix the implementation; do not reopen this ADR.
  - **A future Claude Code release changes `PreToolUse` payload shape or semantics** such that
    `agent_type`/`agent_id` is no longer reliably present — that would remove the precondition this
    ADR relies on and should reopen this decision (back toward something like ADR-012's Decision 3/4
    posture) rather than silently degrading enforcement.
  - **The menu-visibility cost (Decision 5) is shown to leak more than a skill's existence** — e.g. if
    a future Claude Code version previews skill argument schemas or descriptions for off-owner skills
    in a way that exposes internal design — reopen Decision 5 specifically, not the whole ADR.
  - Do **not** re-raise "role separation is only prompt-enforced in a consult" as a defect once task 43
    (the hook implementation) is verified — that is what this ADR closes. A finding here must point to
    a specific failure of the hook (a role reaching a skill it doesn't own, or a fail-open path), not
    restate the general worry ADR-012 already recorded and this ADR resolves.
  - Do **not** re-litigate the rejected "keep `CONSULT_SKILLS`, add members as needed" path (§Options)
    — that is the exact drift this ADR retires.

## Related

- [ADR-012](adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md) — reopens Decisions 3 and
  4; Decision 2's "advisory in a consult" half is superseded by this ADR once the hook is implemented
  and verified. File kept intact, not edited or renumbered.
- [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md) — the structural-enforcement claim this
  ADR extends to the consult path; §§1, 3, 4 remain unaffected.
- [ADR-008](adr-008-claude-code-native-port-alongside-omnigent.md) — the originally-deferred path-level
  hooks, of which this `Skill`-tool `PreToolUse` gate is a sibling.
- Task (this decision): `ai-agents/tasks/backlog/record-pretooluse-skill-gate-adr-amendment.md`.
- Task (the implementation this unblocks):
  `ai-agents/tasks/backlog/implement-pretooluse-skill-ownership-hook.md` — hard dependency, do not
  begin until this ADR exists and is reviewed with the owner.
- Code: `claude/fkit-claude.sh:230` (`skills_for_role()`), `:252` (`CONSULT_SKILLS`, to be removed),
  `:257-283` (`build_settings()`, to stop generating the `skillOverrides` off-list).
- Docs requiring a follow-up correction once the hook ships (tracked in the implementation task, not
  duplicated here): `claude/skills/fkit-team/SKILL.md`, `claude/scaffold/CLAUDE.md`.
</content>
