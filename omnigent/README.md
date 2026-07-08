# fkit on Omnigent — the agent team

This directory is **fkit's primary form: a team of agents and skills built for
[Omnigent](https://omnigent.ai)** (Databricks' open-source agent meta-harness). Omnigent is the
**main dependency** — these agents are authored to run on it, and new fkit work targets it. The
standalone two-model (Claude + Codex) kit in the repo root still runs on its own, but it is now
legacy; this is where active development happens.

Each agent is an Omnigent **bundle directory** (`<agent>/config.yaml` + a per-agent `skills/` dir).
Skills are auto-discovered and **scoped to their agent** — they exist in a session only while that
agent is active.

## The team

| Agent | Harness | Skills | Role |
|---|---|---|---|
| **fkit-producer** | claude-sdk | task-done, task-cancelled | product / sprint planning, task lifecycle |
| **fkit-coder** | claude-sdk | plan-task, process-review, process-stateful-review | implementation (sole source-write authority) |
| **fkit-reviewer** | claude-sdk | review, stateful-review | code review (lead) |
| **fkit-adversarial-reviewer** | **codex** | _(prompt-only)_ | adversarial second-opinion sidekick — a *different model* on purpose |
| **fkit-architect** | claude-sdk | inspect, design-spec, evaluate-approach, record-decision | architecture, design specs, ADRs |
| **fkit-wiki** | **codex** | query, ingest, lint, sync | the wiki — **sole gateway** to `ai-agents/wiki-vault/` |

Per-agent harness is intentional (Omnigent's per-agent model feature): the adversarial reviewer runs
on a *different* model from the Claude lead for genuine perspective diversity.

## Consultation topology

Agents delegate/consult each other via `type: agent` sub-agent tools (`config: ../<agent>/config.yaml`):

- **Every non-wiki agent → fkit-wiki.** All wiki access (read *and* write) goes through fkit-wiki's
  `query`/`ingest`/… — no agent reads `ai-agents/wiki-vault/` directly. fkit-wiki is the single source
  of truth for anything about the project.
- **fkit-coder → fkit-architect** — design interpretation / consistency (a *new* architecture decision
  is surfaced to the owner instead).
- **fkit-producer ⇄ fkit-architect** — product ⇄ technical clarifications; the decision stays in the
  asker's domain.
- **fkit-reviewer → fkit-adversarial-reviewer** — independent adversarial pass, merged into the review.

Consults are framed as focused, loop-safe questions (answer concisely, don't counter-consult).

## Running an agent

```bash
omnigent run omnigent/fkit-producer          # or fkit-coder / fkit-reviewer / fkit-architect / fkit-wiki
omnigent run omnigent/fkit-adversarial-reviewer -p "adversarially review the current diff"
```

Agents use `os_env: caller_process, cwd: .`, so run them from the project root you want them to operate
on.

## Shared, cross-agent rules

Rules that apply to *all* agents (e.g. "never commit unless asked", secrets hygiene) belong in the
project-root **`CLAUDE.md`** (read by the claude-sdk agents) and **`AGENTS.md`** (read by the codex
agents) — the harness injects them automatically alongside each agent's own prompt (verified). fkit
generates both files from one template, so such rules are authored once. Omnigent has **no** native
"shared config across agents" mechanism (no `extends`/`base`; `instructions:` *replaces* the prompt),
so CLAUDE.md/AGENTS.md is the DRY home for shared instructions.

## Status & caveats (alpha)

These agents mirror the Omnigent spec but several runtime mechanics are **not yet verified end-to-end**
against a live Omnigent version — treat this as a working prototype, not a hardened release:

- Sub-agent references use an **upward** relative path (`config: ../<agent>/config.yaml`); confirm your
  Omnigent build resolves `../` before relying on the topology.
- The `guardrails.policies.blast_radius` / `gate_pushes` guardrail is referenced but its exact semantics
  should be confirmed against Omnigent's policy docs. All agents run `sandbox: none`; role boundaries
  (e.g. reviewers are REVIEW-ONLY) are enforced **behaviorally in prompts**, not by the sandbox.
- The review ledger schema used here (`ai-agents/reviews/<task-id>.md`, two-party) differs from the
  standalone kit's ledger schema at the same path — don't run both against one project until unified.

Smoke-test before treating any topology edge as guaranteed.
