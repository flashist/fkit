# fkit — External Review Brief

> **You are an independent, external reviewer.** Your job is a candid, critical assessment of **fkit**
> as a *general-purpose framework/workflow for building software with AI agents in **any** software
> project*. Be a skeptic, not a cheerleader. The most useful thing you can do is find where fkit's
> general-purpose claim is weakest — and say so with evidence.

---

## 0. Scope (confirm before you start)

This review covers **fkit as a whole**: both

- the **kit machinery** — the single-sourced skill/role system, per-project model routing, wiki
  system, and CLI (`bin/`, `generic/`, `manifest/`, `examples/`, `skills/`, `ai-agents/`), and
- the **agent model as realized in the Omnigent port** (`omnigent/`) — the current, fullest expression
  of fkit's agents, skills, and their consultation topology.

If you believe one of these should be out of scope, say so up front and proceed with the other.

---

## 1. What we want from you

An honest answer to: **"Is fkit a good general-purpose framework/workflow that a team could adopt in an
arbitrary software project — and where would it fail?"** Plus concrete, prioritized ideas to make it
better. Challenge assumptions; a plausible-sounding "yes" is less valuable than a well-evidenced "here's
where it breaks."

---

## 2. Orientation — what fkit is (our summary; **verify it, don't trust it**)

The following is *our* description. Treat it as a claim to check against the actual files, not as ground
truth — part of your job is to tell us where this description and the code diverge.

- **Premise.** fkit is a lightweight, zero-dependency kit for running a **team of AI agents** on a
  software project. Each *agent* is a role (producer, coder, reviewer, architect, wiki maintainer, …);
  each agent has scoped *skills* (procedural markdown playbooks); agents **delegate/consult** each other
  through a defined topology.
- **Single-sourced skills.** Skills are authored once under `generic/skills/` and compiled per target
  (`.claude/`, `.codex/`). Per-project model routing lives in a `config.json` (which model owns which
  skill); a manifest (`ai-agents/ai-agents.yml`) declares project identity + the agent roster.
- **Knowledge base ("wiki").** A structured wiki (Karpathy LLM-wiki pattern) under
  `ai-agents/wiki-vault/` holds synthesized project knowledge; dedicated skills query/ingest/lint/sync
  it.
- **Working structure.** Work is organized as tasks (`ai-agents/tasks/{backlog,done,cancelled}/`),
  sprints (`ai-agents/sprints/`), and a knowledge base (`ai-agents/knowledge-base/`). A "never commit
  unless explicitly asked" discipline runs throughout.
- **Omnigent port (`omnigent/`).** Six agents — **fkit-producer** (product/sprint planning),
  **fkit-coder** (implementation), **fkit-reviewer** (code review) with **fkit-adversarial-reviewer**
  (a Codex-based sidekick), **fkit-architect** (design/decisions), **fkit-wiki** (sole wiki gateway).
  Agents reference each other as `type: agent` sub-agent tools. Current consultation edges: everyone →
  fkit-wiki for wiki reads; coder → architect (design interpretation); producer ⇄ architect (product ⇄
  technical); reviewer → adversarial-reviewer (second-opinion review).

## 3. Where to look

| Area | Path |
|---|---|
| Framework overview | `README.md`, `CLAUDE.md` |
| Kit machinery / CLI | `bin/` (`compile-skills.mjs`, `bootstrap.mjs`, `sync.mjs`, `lib.mjs`, `scaffold-role.mjs`) |
| Source skills & roles | `generic/skills/`, `generic/roles/`, `generic/templates/` |
| Manifest & config schema | `manifest/`, `examples/sample.ai-agents.yml` |
| Agent model (fullest form) | `omnigent/<agent>/config.yaml` and `omnigent/<agent>/skills/*/SKILL.md` |
| Working conventions | `ai-agents/` (tasks, sprints, reviews, wiki-vault) |
| Tests | `tests/` |

Read enough of the actual skills and agent configs to form evidence-based judgments — don't review from
the summary above alone.

---

## 4. Review tasks

Work through these. For every claim, **cite the specific file/agent/skill** it rests on.

### Task 1 — General-purpose fitness (stress-test the "ANY project" claim)
- What **assumptions** does fkit bake in that may not hold in an arbitrary project? Consider at least:
  the `ai-agents/` directory convention, git, the two-model (Claude + Codex) premise, dependence on
  Omnigent, the wiki-vault, and the sprint/task structure. For each: does it *generalize*, or is it a
  hidden coupling?
- **Portability.** How well does fkit fit: a solo developer vs. a large team; a non-JavaScript stack; a
  monorepo; a non-git VCS; a single-model or different-provider setup; a greenfield project vs. a large
  legacy codebase?
- **Adoption cost.** How hard is it to set up, learn, and get value from? Prerequisites, onboarding
  effort, time-to-first-value. What would block a new team from adopting it?
- **Verdict:** on balance, is the "usable in any software project" claim justified, over-stated, or
  true-with-caveats? State the caveats.

### Task 2 — Per-agent & per-skill analysis
For **each** agent (producer, coder, reviewer, adversarial-reviewer, architect, wiki):
- Is its purpose clear and does it **earn its place** (or overlap/blur with another)?
- Are its skills the right set, at the right granularity? Any redundant, missing, or mis-scoped skills?
- Is the agent's persona/prompt coherent and free of internal contradiction?

Then assess the **consultation topology as a whole**: is the delegation graph (wiki gateway, coder↔
architect, producer⇄architect, reviewer→adversarial) sound? Where are the **loop risks**, bottlenecks,
or single points of failure? Is "one wiki gateway for all access" a strength or a chokepoint?

### Task 3 — Critique (what's weak)
- Design weaknesses, hidden couplings, and failure modes. Where does the workflow **break down** in
  practice (loops, over-delegation, agents stepping on each other, the human-in-the-loop becoming a
  bottleneck, token/cost blow-ups)?
- **Conceptual integrity:** is the agents + skills + consults model coherent and *learnable*, or is it
  accreting complexity? Is anything over- or under-engineered?
- Documentation & discoverability: could a newcomer actually understand and operate this from the docs?

### Task 4 — What's strong (be explicit)
- What genuinely works well and should be **preserved** or leaned into? We need this to know what *not*
  to change. Don't skip it.

### Task 5 — Gaps: what's missing
- Roles/agents a general-purpose framework arguably needs that fkit lacks (e.g., tester/QA, devops/
  release, security, docs/tech-writer, data/migration). Which are real gaps vs. deliberately out of
  scope?
- Missing skills, lifecycle stages, safety/governance mechanisms, or observability.

### Task 6 — Improvements
- **General** improvements to the framework/workflow. **Prioritized**, concrete, each with its rationale
  and its main **tradeoff** (what it costs). A prioritized shortlist beats an exhaustive wishlist.
- **Agent-specific** improvements — per agent, the single highest-value change you'd make.

### Task 7 — Positioning (optional but valuable)
- How does fkit compare to alternatives (raw Claude Code / Codex, Cursor rules, other multi-agent
  frameworks, the Karpathy wiki pattern it derives from)? What is its **distinctive value**, and in what
  situations would you **not** use it?

---

## 5. Report format — what to produce

Write your findings to **`fkit-external-review-report.md`** (a single file, alongside this brief),
structured for discussion:

1. **Executive summary** — your headline verdict on general-purpose fitness, plus the **top 3–5
   findings** (most important first). Someone should be able to read only this and know your position.
2. **Findings by task** — one section per task above. For each finding include:
   - a **priority** (`high` / `medium` / `low`) and whether it's a **defect** (something wrong) vs. a
     **design tradeoff** (a deliberate choice with a cost);
   - the **evidence** (`path`, agent, or skill it rests on);
   - a concrete **recommendation** where you have one.
3. **Strengths** — an explicit list of what to preserve (from Task 4).
4. **Prioritized recommendations** — a single consolidated, ranked list pulled from your findings.
5. **Open questions for us** — anything you couldn't resolve from the files and want us to clarify.

---

## 6. Ground rules for the review

- **Evidence over intuition.** Cite the actual file/agent/skill behind each claim. If you can't point to
  it, flag it as a hypothesis, not a finding.
- **Distinguish fact from opinion**, and **severity from confidence.** Don't inflate a stylistic
  preference into a blocking defect.
- **No fabrication.** If the framework already handles something you were about to critique, say so. An
  honest "this is fine" is a valid result.
- **Prioritize by impact** on the general-purpose goal — not by how easy something is to nitpick.
- **Be direct and specific.** Vague praise and vague criticism are equally useless; concrete examples
  and concrete fixes are what we can act on.
