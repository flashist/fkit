# Investigate making `AskUserQuestion` available to fkit agents

## ID
0056

## Sprint
Sprint 2

## Priority
39

## Status
✅ Done

## Context

**The owner's ask:** *"Make the `AskUserQuestion` skill available for all agents."*

**First, a correction that changes the work — `AskUserQuestion` is a built-in Claude Code *tool*, not a
skill.** The distinction is load-bearing because fkit gates the two through **different mechanisms**:

- **Skills** — `skills_for_role()` in `claude/fkit-claude.sh`, realized as the `skillOverrides` map in
  `.fkit/settings/<role>.json` ([ADR-010](../../../knowledge-base/decisions/adr-010-role-locked-sessions-and-skill-lockdown.md),
  [ADR-012](../../../knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md)).
- **Tools** — the `tools:` frontmatter line in each `claude/agents/fkit-*.md`.

So this is a **tool-allowlist** change, and nothing to do with `skills_for_role()`. **Verified
2026-07-16:** `AskUserQuestion` appears in **none** of the seven agents' `tools:` lines, and nowhere in
`claude/` at all — **no fkit agent can use it today.**

**The mechanical change is trivial — seven `tools:` lines. Everything below is why it is not a
seven-line task.**

### Unknown 1 — the crux: does it work in a *spawned consult*, or only in a session?

fkit agents run in two contexts: a **role-locked session** (owner present) and a **spawned consult**
(owner absent, by design). Whether `AskUserQuestion` reaches the owner from a spawned subagent is
**unknown and must be measured, not reasoned about.**

**There is direct, expensive precedent.** `claude --append-system-prompt` is **session-only** — it
looked obviously inheritable and was not: **0/3, then 0/2** into a spawned consult, across two
independent experiment designs with a within-subject control that stayed live
([`reports/2026-07-14-shared-instructions-layer.md`](../../../knowledge-base/reports/2026-07-14-shared-instructions-layer.md)
rev 2, on Claude Code 2.1.208). It is the same class of question about the same seam. And the
[`evidence-before-assertion`](../../../knowledge-base/conventions/evidence-before-assertion.md) convention
— plus the task-27 correction, where a behavioral claim about `cp -R` shipped false because nobody ran
it — says exactly this: **a behavioral claim about the harness is a claim to run.**

### Unknown 2 — "all agents" cannot structurally include the second model

**`fkit-adversarial-reviewer` runs its review on Codex** via the codex CLI, which has no
`AskUserQuestion`. Granting the tool in that agent's file affects only its Claude-side wrapper, not the
Codex run. This is **the same shape as the rejected `AGENTS-COMMON.md`** — *"a shared layer for **all**
agents that excludes the second model is misnamed"* (same report, §4). "All agents" needs an honest
answer here, not a seventh line in a file.

### Conflict 3 — the consult contract currently says *don't ask*, deliberately

This is **not an oversight to fix; it is a designed constraint**, written into the agents themselves:

- `claude/agents/fkit-producer.md:44` — when spawned as a consult, return it *"as an open question in
  your reply rather than guessing."*
- `claude/agents/fkit-architect.md:38` — same instruction, same seam.

Granting the tool would let a consult **interrogate the owner mid-chain**, which changes the consult
model (the two-hop envelope; ADR-004/010/012) rather than merely adding a capability. **That is an
architecture decision and it is the owner's.** `fkit-adversarial-reviewer` carries a further contract —
**findings only** — that an interactive prompt sits awkwardly against.

**A documented failure mode of exactly this pattern is already in the knowledge base:**
[`history/fkit-external-review-report.md:124`](../../../knowledge-base/history/fkit-external-review-report.md)
records a skill that gated its writes on interactive `AskUserQuestion` while its delegated stub ran
non-interactive — *"nobody present to answer the mandatory questions."*

## What to build

**An investigation and a recommendation — not the grant.** Do **not** add the tool to any agent as part
of this task.

1. **Measure the session-vs-consult behavior empirically.** Determine whether `AskUserQuestion`
   reaches the owner from (a) a role-locked `fkit <role>` session and (b) an agent spawned as a
   consult. **Multiple trials in both directions, with a within-subject control** — the design that
   caught the false positive in the `--append-system-prompt` work; a single trial is not an answer.
   **Pin the Claude Code version in the findings** (the rev-2 report models this, and it is what keeps
   a negative result from becoming a fossil).
2. **Characterize the failure mode in a consult** if it does not work: does it **error**, **hang**,
   **block**, or **silently no-op**? This is not a detail — **a tool that hangs an unattended consult
   is worse than a tool that is absent**, and it decides whether the grant is safe at all.
3. **Settle the Codex path** for `fkit-adversarial-reviewer`: can the second model participate at all,
   or is "all agents" structurally false? Say which.
4. **Map the role-contract conflicts** — at minimum the consult "return open questions" instruction
   (`fkit-producer.md:44`, `fkit-architect.md:38`) and the adversarial reviewer's findings-only
   contract. For each, name the file:line and what would have to change.
5. **Recommend, per agent** (all seven): grant / don't / conditional, in which context
   (session-only vs consult), with the reason — plus what each affected role's instruction should then
   say.
6. **Answer the ADR question.** This touches the consult model, so a decision record is likely
   warranted; the investigation should say so either way and name the owner
   (`/fkit-record-decision`, architect).

## Verification steps

- A dated findings report exists under `ai-agents/knowledge-base/reports/`, with the **Claude Code
  version pinned**.
- **The session-vs-consult question is answered with recorded trial counts** (e.g. `N/N` in each
  context), including a control — **not** by reasoning from the harness's documentation.
- **The consult failure mode is stated explicitly** as one of error / hang / block / silent no-op. If
  the answer is *hang*, that is called out as a blocking hazard, not a footnote.
- **The Codex / adversarial-reviewer status is stated structurally** — can or cannot, and why.
- **Each of the seven agents carries a recommendation** with its reason and its context.
- Every role-contract conflict is named with the `file:line` where it currently lives.
- The ADR question carries an answer.
- **Findings are reviewed with the owner before any implementation brief is scoped.**

## Notes

- **Owner: fkit-architect** (empirical work + the architecture question), **with the owner present** for
  the consult-model decision, which is not the architect's to make.
- **Depends on: nothing.** **Blocks:** any implementation of the grant — no implementation brief is
  written until these findings are reviewed.
- **This follows the task-20 / task-29 pattern deliberately** (migration mechanism; shared-instructions
  layer): investigation → owner review → *then* the producer scopes implementation. **Both of those
  investigations' rev-1 recommendations did not survive an adversarial Codex pass** — one reversed
  outright, the other lost two false factual claims. **Recommend this report take the same adversarial
  pass before its recommendation is acted on.**
- **The likely headline is not "grant it to all seven."** On the evidence above it is more probably
  *"session yes, consult no — and the consult already has the right answer (return the open question)."*
  **That is a hypothesis, not a finding — the investigation exists to falsify it**, and it should not be
  written up as a conclusion before the trials are run.
- **Terminology:** the brief says **tool** throughout on purpose. Anyone reaching for
  `skills_for_role()` here is in the wrong mechanism.
- **Risk: low** for the investigation itself (measurement + a document). The *grant* it may recommend is
  the part with the blast radius — hence the gate.
- **Provenance:** owner request via `/fkit-task-plan` (2026-07-16), scoped investigation-first because
  the feasibility is unmeasured and the consult-model question is the owner's.
