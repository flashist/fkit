# Research brief: Omnigent multi-agent architecture (for the fkit port)

**To:** an external deep-research agent
**Deliverable:** a written report (`omnigent-research-report.md`) that answers the questions below,
grounded in primary sources, so the requester can choose the right architecture for a multi-agent
system built on Omnigent.

---

## 0. Why this research exists (the decision at stake)

The requester maintains **fkit** — a team of six collaborating agents (a producer, a coder, a
reviewer, an adversarial-reviewer, an architect, and a wiki "librarian") being ported to run on
**Omnigent** (the meta-harness; `omnigent` CLI, target version **0.4.0**). The agents are meant to
**consult one another**: every agent asks the wiki agent for project knowledge (a single "wiki
gateway"); the coder consults the architect; the producer and architect consult each other; the
reviewer delegates a second-opinion pass to the adversarial-reviewer.

A live shakedown revealed the collaboration wiring does **not** work as built, and that Omnigent's
real sub-agent model forces either duplication or a redesign. **The requester must now choose a
topology and a DRY strategy.** This report is the input to that choice. Every question below is here
because its answer changes that decision — please keep answers concrete and decision-oriented, not
encyclopedic.

**The single most important thing to resolve:** *How do you let multiple independent agents share and
call one common sub-agent (e.g. the wiki) without physically duplicating that sub-agent's bundle under
each caller?* If there is a clean, supported way, most of the redesign disappears.

---

## 1. Ground rules (how to research)

1. **Verify against primary sources; do not trust prose (including this brief).** Cite everything:
   Omnigent source file paths + line numbers, official doc URLs, GitHub issues/PRs/discussions,
   changelogs, commit SHAs, and the **version** each claim applies to.
2. **The installed source is available for reading** at
   `~/.local/share/uv/tools/omnigent/lib/python3.12/site-packages/omnigent/` on the requester's
   machine (version 0.4.0). Prefer reading the actual loader/spec/runner code over docs when they
   disagree — **and report any place docs and code disagree.**
3. **Distinguish "documented" from "actually works."** Where feasible, confirm behavior with a
   minimal reproducible config you actually ran, and paste the exact command + output. If you could
   not run it, say so and label the answer *documented-only* or *inferred-from-source*.
4. **Pin every answer to a version.** 0.4.0 is the target. If a feature is newer/older or on a
   roadmap, say which version and cite it.
5. **Prefer minimal working examples.** For each recommended pattern, include the smallest complete
   `config.yaml` (and directory layout) that demonstrates it.
6. **When something is unknown or unverifiable, say so plainly.** A precise "not supported in 0.4.0;
   see issue #123" is more valuable than a confident guess.

---

## 2. Facts already established in a live shakedown (verify, then build on — don't redo)

Treat each as a hypothesis to confirm/refute with a citation; note any that are wrong or
version-specific.

- **F1.** `omnigent run <bundle-dir> -p "msg"` runs an agent headlessly (one-shot) and exits;
  `--no-session` uses a fresh session. `--log` conflicts with `-p`.
- **F2.** A claude-sdk agent auto-reads a project-root `CLAUDE.md`; a codex agent auto-reads
  `AGENTS.md`; the harness injects it alongside the agent's own `prompt:`. *(Confirmed by smoke test —
  confirm the exact source/precedence/scope; see Q-G.)*
- **F3.** Sub-agent tools declared as `tools.<name>: { type: agent, config: ../other/config.yaml }`
  **do not work**: reading `omnigent/inner/loader.py` (the `tool_type == "agent"` branch), the loader
  reads `spec`, `prompt`, `tools`, `executor`, `os_env`, `pass_history`, `max_sessions` — **there is
  no `config:` field**, so a file-path reference is silently ignored, producing an AgentTool with no
  spec. At runtime the caller gets `Error: <name> not in local dispatch table (no agent spec)`.
- **F4.** The **working** sub-agent pattern (from bundled examples `debby`/`polly`): nest the
  sub-agent at `<parent>/agents/<name>/config.yaml` and expose it via `tools: { agents: [<name>] }`;
  the parent dispatches to it with `sys_session_send` and collects results from `sys_read_inbox`
  (async/inbox model). *Confirmed working end-to-end in the shakedown.*
- **F5.** **Symlinking** the nested sub-agent dir (`<parent>/agents/<name>` → canonical bundle) is
  **rejected**: `invalid agent spec: tools.agents references sub-agent '<name>' but no matching
  directory found under agents/`. (Discovery appears not to follow symlinks.)
- **F6.** Sub-agents also exist as **inline** `type: agent` tools (full `prompt`/`executor`/`tools`
  inlined) and as `spec: self` (clone of parent). Both are per-parent (i.e. also duplication).
- **F7.** SKILL.md frontmatter is parsed as YAML; an unquoted `description:` containing `": "`
  (e.g. `keyword: 'all tasks'`) breaks loading and takes down the whole agent. *(Confirm the exact
  frontmatter schema — Q-E.)*
- **F8.** `omnigent config list` shows configured provider credentials per harness; there appears to
  be **no** native "shared instructions across all agents" mechanism (no `extends`/`base`/`mixin`;
  `instructions:` replaces the prompt). *Confirm or refute — Q-G3.*

---

## 3. Research questions (grouped; **P0** = blocks the topology decision)

### A. Sharing a sub-agent without duplication  — **P0, the crux**
- **A1.** Is there **any** supported way for multiple independent parent agents to call one shared
  sub-agent definition without copying its bundle into each parent's `agents/` dir? Consider: a path
  reference, a name/registry reference, an "include", a package/tarball dependency, a workspace-level
  agents directory, or config inheritance. If yes: exact syntax, version, citation, and a minimal
  example. If no: state it definitively with a source citation.
- **A2.** **Server / session route.** Omnigent has `server`, `host`, `attach`, `login`,
  `sys_agent_list`, `sys_session_list`. Can you **register or run one agent (e.g. the wiki) as its own
  long-lived agent/session** and have *other, separately-started* agents dispatch to it **by name or
  id** (`sys_session_send` / handoff) **without nesting it**? Describe the exact mechanism, addressing
  scheme, lifecycle, and isolation. Provide a working example if possible. *(This is the most
  promising DRY route — please prioritize it.)*
- **A3.** Do **symlinks** work in *any* form (symlinked `config.yaml` inside a real dir; a
  `follow_symlinks`/packaging flag)? Does bundle packaging (tarball via `extract_safe`) preserve
  symlinks, or strip/reject them?
- **A4.** What is the **officially recommended pattern** for "N agents share one common worker
  agent"? Cite docs/examples/maintainer guidance.

### B. Topology & the call graph — **P0**
- **B1.** Can a nested sub-agent call a **sibling** (another child of the same parent)? Can it call
  **back up** to its parent, or reach a **grandparent**? Precisely: what edges does the dispatch graph
  permit? (Determines whether "specialists that consult each other" is even expressible, or must be
  mediated by one orchestrator.)
- **B2.** Is the intended model strictly a **tree** (one root orchestrator; workers as leaves, à la
  debby/polly), or can it be a **graph** with peer-to-peer edges? What do the maintainers intend?
- **B3.** Nesting **depth** and **fan-out** limits — any hard caps, or practical perf/cost/latency
  implications of deep nesting or wide fan-out?
- **B4.** For a "team of specialists that consult each other," what is the **idiomatic** Omnigent
  shape? Give a concrete skeleton (directory layout + minimal configs).

### C. Sub-agent invocation semantics — **P0/P1**
- **C1.** **`type: handoff`** tools (`target_agent`, `bidirectional`, `pass_history`): what are they,
  how do they differ from `type: agent`/`tools.agents`, and — critically — **can `target_agent` name
  an agent that is *not* nested** (i.e. is handoff the peer/named-agent mechanism)? Full semantics +
  example. *(Possibly central to A1/A2 — dig in.)*
- **C2.** `sys_session_send` vs `sys_call_async` vs any synchronous call: what's the difference and
  when to use each?
- **C3.** Is sub-agent dispatch **only async/inbox-based**, or is there a **blocking "call and get the
  answer back"** form? (The wiki-gateway needs "ask, wait, use the answer" semantics, not a
  fire-and-forget fan-out — which primitive delivers that?)
- **C4.** Exact semantics of `pass_history`, `pass_histories`, `max_sessions`, and `spec: self` —
  what data crosses the boundary, and what do the defaults do?
- **C5.** **Prompt authoring:** what is the correct way to instruct an agent to reach a sub-agent?
  (The requester's prompts said "call your `X` tool"; the working mechanism was `sys_session_send`.)
  What wording/tool-usage pattern reliably makes a model dispatch correctly, and are the relevant
  `sys_*` tools auto-available once `tools.agents` is declared?

### D. Enforcing role boundaries structurally — **P1**
- **D1.** `guardrails.policies.blast_radius` with `gate_pushes: true/false`: precise semantics — what
  exactly is gated, what is the "catastrophic set" that's denied outright, and how does the ASK
  approval flow behave in **headless** vs **interactive** runs (does headless block, auto-deny, or
  auto-allow)?
- **D2.** Can an agent be made **read-only** or have its **writes restricted to specific paths**
  (e.g. the wiki agent may write only `ai-agents/wiki-vault/`; the reviewer may write no source at
  all)? Via `sandbox`, tool allow/deny lists, `os_env` options, or policy? Show how. *(fkit currently
  enforces "REVIEW-ONLY" / "wiki-only-writes" purely in prompts — is structural enforcement
  possible?)*
- **D3.** Tool allow/deny / capability scoping per agent — what knobs exist to limit which tools an
  agent (or sub-agent) can use?

### E. Skills — schema, discovery, portability — **P1**
- **E1.** The exact **SKILL.md schema**: required vs optional frontmatter fields, the arguments token
  (`$ARGUMENTS`?), and any constraints (e.g. must `description` be quoted? length limits?). Cite the
  parser.
- **E2.** How are per-agent skills **discovered and scoped** (the `skills/` dir), and how does the
  harness decide to **auto-load/trigger** a skill (description match? name? slash command?)?
- **E3.** Do skills behave **identically across harnesses** (claude-sdk vs codex), or are there
  per-harness differences in loading/triggering/argument-passing?
- **E4.** Is there **pre-flight validation** — a command or API to lint/validate a bundle
  (config + skills) and catch YAML/schema errors **before** a live run? (F7 slipped through because
  nothing validated frontmatter until runtime.) If none exists, what's the best programmatic way to
  validate?

### F. Headless / automation / programmatic use — **P1**
- **F1.** Headless one-shot: exact `-p` behavior, exit conditions, and — with the async inbox model —
  **does a headless run block until nested sub-agents finish**, or can it exit early and drop their
  results?
- **F2.** Is there a **structured/JSON output mode** or a **Python/HTTP SDK** for driving agents
  programmatically (for CI and for tools that need to parse an agent's result)?
- **F3.** Session **persistence/resume/inspection** — how is state stored, and can it be read back
  programmatically (relevant to a review-ledger workflow)?

### G. Config, context files, model routing — **P2**
- **G1.** Confirm **F2** precisely: which context file(s) each harness injects, from **where**
  (caller cwd vs bundle dir vs both), the **precedence/merge** rules, which harnesses, and any size
  limits.
- **G2.** **Per-agent model/harness selection**: how to pin a specific model per agent
  (`executor.config.model`?), and how provider/model resolution works when nothing is pinned.
- **G3.** Confirm/refute **F8**: is there truly **no** native cross-agent shared-instructions
  mechanism? What is the role of `~/.omnigent/config.yaml` vs a project `.omnigent/config.yaml`, and
  can either carry shared prompt/instruction content (not just credentials/defaults)?

### H. Distribution, versioning, roadmap — **P2**
- **H1.** How are agent **bundles meant to be distributed/installed/shared** (tarball, a registry,
  git, pip)? What's the packaging format, and does it preserve directory structure/symlinks (ties to
  A3)?
- **H2.** `spec_version` meaning; **stability of the agent spec** in 0.4.0; how breaking changes are
  handled; and **what is on the roadmap** for multi-agent — especially shared/referenced agents,
  cross-agent config, or a registry (cite issues/PRs/discussions/changelog).
- **H3.** Where is the **authoritative documentation** and are there **multi-agent examples** beyond
  `debby`/`polly`? List the best references (with URLs) a maintainer should follow.

---

## 4. Report format (please deliver `omnigent-research-report.md` in this shape)

1. **Executive summary** — the 5–8 findings that most affect the topology/DRY decision, each one line.
2. **The DRY/topology verdict** — a direct answer to §0's core question: *can shared sub-agents be
   done without duplication in 0.4.0, and if so how?* Then a ranked recommendation among (a) server/
   registered shared agent, (b) single orchestrator that owns shared workers and brokers, (c)
   single-source + generate the nested copies, (d) accept duplication — with the tradeoffs of each for
   this six-agent team.
3. **Per-question answers** — for every Q above: the answer, the evidence (citation with
   version), confidence (`ran-it` / `documented` / `inferred-from-source` / `unknown`), and a minimal
   example where relevant.
4. **Minimal working patterns** — copy-pasteable `config.yaml` + directory layouts for: a shared
   worker (the DRY solution, if any), the recommended "specialists that consult each other" shape, a
   correct handoff, and a path-restricted / review-only agent.
5. **Docs↔code discrepancies & gotchas** — anything where the documentation is wrong, missing, or
   contradicted by 0.4.0 source; plus footguns (like the F7 frontmatter trap).
6. **Compatibility & roadmap table** — feature × {supported in 0.4.0? / documented? / roadmap} with
   citations.
7. **Open questions** — anything you could not determine, and exactly what evidence (or maintainer)
   would settle it.

## 5. Out of scope
Do not evaluate fkit's own design quality or its skill/prompt wording — that's a separate review. Focus
entirely on **what Omnigent supports and the best way to build a shared, collaborating multi-agent
system on it.** Assume the requester will re-architect fkit around your findings.
