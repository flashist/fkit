# Add a shared instructions layer that every fkit agent reads

## Sprint
Sprint 2

## Priority
29

## Status
🔲 Backlog

## Context

**There is no way to give all seven fkit agents an instruction at once.** Today an instruction that
applies to everyone has to be written into every agent file by hand — which means it gets written
seven times, drifts six ways, and nobody can tell which copy is authoritative.

**The duplication is already there, and it is exactly the shape the owner is trying to avoid.** The
"universal hard rules" appear independently in all seven `claude/agents/fkit-*.md` files:

| Rule | Appears in |
|---|---|
| never commit / push unprompted | all 7 |
| wiki writes only via the fkit-wiki agent | all 7 |
| no secrets in any artifact | 2 of 7 — **already drifted** |

That last row is the argument for this task in one line: a rule that is supposed to be universal is
**already only in two of seven files**, and nobody noticed. Hand-copying a rule seven times is not a
process; it is a slow leak.

**The owner's framing (2026-07-14), and it bounds the scope:**

> *"I want a way to add some instructions that ALL agents will use. Some sort of CLAUDE.md file, but
> only for the fkit agents — and this file doesn't replace the existing instructions for agents, it
> just adds something on top of it. A single file, just to be sure that I don't duplicate the same
> thing across multiple files."*

**Additive, not a refactor.** The goal is a place to put *new* cross-cutting instructions once. It is
**not** a mandate to strip the existing rules out of the seven agent files — see "Out of scope" below.

## ⚠️ Investigation first — do not implement from this brief

**There is no shared-preamble mechanism in fkit today.** `claude/fkit-claude.sh:457` is just:

```
exec claude --agent "fkit-$role" --settings "$settings" "$@"
```

Nothing injects common text. So *how* a shared file reaches an agent is an open technical question,
and it has a trap in it:

> **The load-bearing unknown: does the mechanism reach a *spawned consult*, or only a session?**
>
> Per [ADR-012](../../knowledge-base/decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md),
> a spawned `@fkit-<role>` consult **inherits the calling session's settings, not its own**. That is
> exactly how the skill lockdown ended up being *"a wall in a session, a rule in a consult."*
>
> **A shared-instructions layer that only reaches interactive sessions would repeat that mistake** — it
> would silently not apply to every consult, which is a large fraction of how these agents actually
> run. **Establish this from the code and by experiment before choosing a mechanism.** If no mechanism
> reaches both, say so plainly — that is a finding, not a failure.

**Sequence:** investigate → report → owner reviews → **then** implementation is scoped into its own
task(s). Findings land as `reports/YYYY-MM-DD-shared-instructions-layer.md` per
[ADR-013](../../knowledge-base/decisions/adr-013-knowledge-base-root-holds-the-living-canon.md).

## What the investigation must answer

- **Which mechanisms exist, and which of them reach both a session *and* a spawned consult?**
  Candidates to establish from the code and by experiment, not from assumption:
  - `claude --append-system-prompt` (or equivalent) at the `exec` in `fkit-claude.sh`
  - splicing a shared block into each `claude/agents/fkit-*.md` at **init time**
    (`fkit-claude-init.sh` already generates the `.claude/` copies — this is the one seam that
    provably applies to whatever the agent file is, session or consult)
  - a pointer line in each agent file (*"read `ai-agents/AGENTS-COMMON.md` before acting"*)
  - the project's own `CLAUDE.md` — **does a spawned subagent read it at all?** Establish, don't guess.
- **Where does the file live, and does it ship?** In the consuming project (owner-editable, scaffolded)
  or in `claude/` (fkit's own, shipped)? **The owner's stated need is to add *his own* instructions** —
  which points at a scaffolded, project-local file. Confirm.
- **Generated vs. authored.** If the mechanism splices text into agent files, those files become
  **generated artifacts** — and the `.claude/` copies are already gitignored and regenerated. What
  breaks if someone hand-edits one? Does `fkit-claude-init.sh` need to re-run for a change to take
  effect, and is that acceptable?
- **Precedence.** The file *adds* to an agent's instructions. What happens when it **contradicts** one?
  Additive is easy to say and ambiguous in practice — state the rule.
- **Is a pointer good enough?** A line telling agents to read a file is cheap but **advisory** — the
  agent may not comply. A spliced preamble is **structural**. Given fkit's whole design thesis is
  "a fact, not a request," say which this must be and why.

## Out of scope — do not widen this

- **Do NOT strip the existing universal rules out of the seven agent files.** The owner asked for an
  *additive* layer, explicitly: *"this file doesn't replace the existing instructions."* Consolidating
  the current duplication is a **separate, later decision** — it is a refactor of seven system prompts
  and it deserves its own brief and its own risk assessment. Note the drift found above as evidence;
  do not act on it here.
- **No hooks, no tool-level enforcement.** ADR-010's deferral stands.
- **Do not scope the implementation in this task.** If the investigation produces an obvious build,
  that is a *finding*, not a licence — it goes back to the owner first.

## Verification steps

*(For the investigation. Implementation gets its own tasks and its own verification.)*

- A findings report exists at `ai-agents/knowledge-base/reports/YYYY-MM-DD-shared-instructions-layer.md`.
- **The session-vs-consult question is answered by experiment, not by reasoning.** The report shows an
  actual agent — in both a session *and* a spawned consult — demonstrably acting on an instruction that
  exists **only** in the shared file. A mechanism that cannot be shown to work in both is recorded as
  such.
- It gives a clear recommendation with its main tradeoff, and states where the file lives and whether
  it ships to consuming projects.
- The precedence rule (shared vs. agent-specific conflict) is stated.
- Implementation tasks are scoped **only after** the owner has reviewed the findings.

## Notes

- **Owner: fkit-architect** (investigation), with the **owner** on the decision. The **producer** writes
  the implementation briefs once the shape is agreed.
- **Depends on:** nothing. Independent of everything else in Sprint 2.
- **Read first:** ADR-012 (why the consult path is the trap), `claude/fkit-claude.sh` (the `exec` at
  `:405` / `:457`), and `claude/fkit-claude-init.sh` (which generates the `.claude/` copies — the most
  likely seam).
- **Related:** [task 24](stop-agents-asserting-unchecked-repo-state.md) adds a standing rule
  (`conventions/evidence-before-assertion.md`) that applies to **every role** — and today has no
  mechanism to reach them except a link from each skill. **It is the first real customer of whatever
  this task builds.** Worth reading its brief; do not merge the two.
- Risk of getting it wrong: **moderate.** A mechanism that reaches sessions but not consults would be
  *worse than nothing* — the owner would believe an instruction is universal when it is not. That is
  the failure this brief exists to prevent.
