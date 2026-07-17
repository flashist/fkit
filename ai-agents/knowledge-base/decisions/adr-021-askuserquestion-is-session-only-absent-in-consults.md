# ADR-021: `AskUserQuestion` is session-only — absent in spawned consults; the "return open questions" contract is the only option there

- **Status:** accepted
- **Date:** 2026-07-17
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect
- **Harness pinned:** **Claude Code 2.1.212** (codex-cli 0.144.4). This ADR records a *measured harness
  behavior*; its validity is scoped to that version (see "re-raise only if").

## Context

The owner asked to *"make `AskUserQuestion` available for all agents."* `AskUserQuestion` is a built-in
Claude Code **tool** (gated by each agent's `tools:` frontmatter), not a skill (`skills_for_role()`) —
it appears in **none** of the seven `claude/agents/fkit-*.md` `tools:` lines, so no fkit agent can use
it today.

fkit agents run in two contexts: a **role-locked session** (owner present) and a **spawned consult**
(owner absent by design; ADR-010's two-hop envelope). The brief's central worry (Conflict 3) was that
granting the tool would let a consult **interrogate the owner mid-chain**, changing the consult model.
The prior `--append-system-prompt` work established that harness behavior across the session/consult
seam **must be measured, not reasoned** (it looked inheritable and was session-only, 0/3 then 0/2 —
[`reports/2026-07-14-shared-instructions-layer.md`](../reports/2026-07-14-shared-instructions-layer.md) §5).

**It was measured** (full method + results:
[`reports/2026-07-17-askuserquestion-availability-for-agents.md`](../reports/2026-07-17-askuserquestion-availability-for-agents.md)):

- **Consult (spawned subagent): `TOOL_ABSENT`, 3/3.** Three `general-purpose` subagents (`tools: *` —
  the broadest possible grant) each reported `AskUserQuestion` is **not in their toolset and not even
  discoverable via `ToolSearch`**; a control token proved each was live, and an anti-fabrication guard
  ruled out a hallucinated positive. No dialog reached the owner. The failure mode is **absence**, not
  the *hang* the brief feared ("worse than a tool that is absent") — the safest of the possible modes.
- **Session (top-level `claude`): works, 1/1.** The owner invoked the tool in a plain session and the
  selection dialog rendered and returned normally.

This ADR exists as a **tombstone**: to record the measured constraint so the consult model is not
re-litigated, exactly as the `--append-system-prompt` result needed a tombstone so "just append the
rules to the spawn" would not be re-attempted.

## Decision

**On Claude Code 2.1.212, `AskUserQuestion` is a session-only tool: it functions in a top-level
`fkit <role>` session (owner present) and is `TOOL_ABSENT` in any spawned subagent (consult), at any
spawn depth, regardless of the agent's `tools:` grant.** Therefore:

1. **A consult cannot ask the owner via `AskUserQuestion`.** The standing consult contract — *"return
   it as an open question in your reply rather than guessing/asking"* (`fkit-producer.md:44`,
   `fkit-architect.md:38`, and the hop-2 equivalents) — is **not merely a convention we chose; on this
   harness it is the only option a consult has.** It stays in force, unchanged.
2. **Granting `AskUserQuestion` cannot change the consult model.** Any grant is a **session-only
   ergonomics** capability (structured multiple-choice prompts to the owner when present), not a
   change to the two-hop envelope. The brief's Conflict 3 is empirically void.
3. **"All agents" cannot structurally include the second model.** `fkit-adversarial-reviewer` runs its
   review on **Codex** (`codex exec`), which has no `AskUserQuestion`, and is a **findings-only leaf**
   (`fkit-adversarial-reviewer.md:22, :61`). It is excluded from any grant.
4. **The owner-approved grant** (recorded here, implemented separately — a producer-scoped brief, **not**
   this investigation task): add `AskUserQuestion` to the `tools:` line of the **six Claude-side
   agents** — producer, coder, architect, reviewer, wiki, lead — and **not** the adversarial reviewer.
   Each granted role also carries a one-line note: *"In a session you may use `AskUserQuestion`; in a
   spawned consult it is absent — return open questions as before."* No consult-contract text is
   deleted; no `skills_for_role()` change (this is a tool, not a skill).

## Options considered

- **Record the measured session-only behavior as a tombstone + grant to the six Claude-side agents
  (chosen).** Captures the harness fact with its version, keeps the consult contract intact (it is now
  *load-bearing*, not decorative), and gives interactive sessions nicer prompts. Cost: a small tool-
  allowlist widening on six agents, and a version-scoped fact that must be re-checked if the harness
  changes.
- **Grant to all seven ("all agents", the literal ask).** Rejected: structurally impossible for the
  second model (Codex has no such tool) and contradicts the adversarial reviewer's findings-only leaf
  contract — "all agents" is misnamed, the same shape as the rejected `AGENTS-COMMON.md`.
- **Grant nothing; leave the report as the only record.** Rejected by the owner: without the tombstone,
  "why can't a consult just ask the owner?" comes back and re-opens the consult model — the exact
  re-litigation this ADR prevents.
- **Treat the consult "return open questions" rule as a soft convention to relax once the tool is
  granted.** Rejected as factually impossible: the tool is absent in consults, so there is nothing to
  relax.

## Consequences

- **Positive:**
  - The consult model is settled with evidence: a consult *cannot* ask the owner on 2.1.212, so the
    "return open questions" contract is the only correct behavior — not to be re-litigated.
  - The grant decision is correctly de-risked to session-only ergonomics; no architecture change.
  - The dangerous failure mode the brief feared (a consult that **hangs** waiting for input that never
    comes) is measured as **not present** — the tool is simply absent, so a granted consult no-ops
    rather than hangs.
- **Negative / costs:**
  - **This is a version-scoped behavioral fact.** A harness that later exposes `AskUserQuestion` to
    subagents would invalidate Decisions 1–2. That is why the version is pinned in the header.
  - A small tool-allowlist widening on six agents (implementation task) — more surface per agent,
    accepted as a low-stakes ergonomic upgrade.
- **Residual risks / "re-raise only if":**
  - **A future Claude Code version exposes `AskUserQuestion` (or an equivalent interactive prompt) to
    spawned subagents** — re-measure with the same design (multiple trials, control, pinned version),
    and reopen Decisions 1–2: a consult that *can* reach the owner mid-chain is a genuine consult-model
    change and would then need its own decision. Until re-measured on a new version, do **not** assume
    the seam changed.
  - Do **not** re-raise "why can't a consult ask the owner directly?" as a design gap — it is
    `TOOL_ABSENT` by harness behavior (this ADR), not an fkit omission. A finding must show a *measured*
    change on a *named* version, not restate the wish.
  - Do **not** re-raise "grant it to all agents including the adversarial reviewer" — structurally
    impossible for the Codex-run second model (Decision 3).

## Related

- Investigation: [`reports/2026-07-17-askuserquestion-availability-for-agents.md`](../reports/2026-07-17-askuserquestion-availability-for-agents.md)
  — method, trial data (consult 3/3 `TOOL_ABSENT`, session 1/1 works), per-agent recommendations.
- Precedent tombstone: [`reports/2026-07-14-shared-instructions-layer.md`](../reports/2026-07-14-shared-instructions-layer.md)
  §5 — `--append-system-prompt` is session-only (0/3, 0/2); the same session/consult seam, same
  measure-don't-reason discipline.
- [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md) — the two-hop consult envelope this
  confirms; [ADR-012](adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md) — note tools are
  gated by `tools:` frontmatter, **not** `skills_for_role()`.
- Contracts kept in force: `claude/agents/fkit-producer.md:44`, `claude/agents/fkit-architect.md:38`
  (consult "return open questions"); `claude/agents/fkit-adversarial-reviewer.md:22,:61` (leaf,
  findings-only).
- Task: `ai-agents/tasks/backlog/investigate-askuserquestion-availability-for-agents.md` (this
  investigation). The grant implementation is a **separate producer-scoped brief**, not this task.
