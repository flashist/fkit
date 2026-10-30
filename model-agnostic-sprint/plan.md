# Model-agnostic transformation plan

Status: implementation active under the owner's goal to transfer fkit to local Codex. The task breakdown remains a working plan; see `progress.md` for actual evidence. Local IDs below belong only to this temporary folder; they are not fkit global task IDs or official board state.

Owner follow-up, 2026-10-29: the first Codex version must register no PreToolUse or Stop hooks.
Retain their implementation dormant for possible later feedback; earlier optional-hook scope and
evidence below are historical. Dispatcher checks and written role/question/footer rules remain.

Owner availability clarification, 2026-10-29: the plain Claude command also fails in the owner's
normal Terminal, and the owner said “don't count on Claude to be available here locally”. Local
acceptance and use therefore rely on Codex for all seven roles. Do not retry Claude or require
repairing its API as a condition of using this local Codex deliverable. MA-15's real Claude/mixed
runtime certification remains explicitly deferred to a Claude-capable environment; it is not
satisfied by stubs or waived for a broader compatibility claim. No local Claude verifier is available.

## Outcome and boundaries

First deliverable: the owner can run all seven fkit roles on this Mac using installed Codex CLI and existing login, with no Claude executable required. A project has a default model and per-role overrides. A distinct adversarial pass always runs when possible; one available model is sufficient. Claude/Codex compatibility is the following stage. Direct APIs and more providers follow later.

Preserve task/sprint folders, review ledgers, role responsibilities, owner approval points, wiki ownership, producer-only movers and user-owned files. Any proposed enforcement difference is explicit. Existing published installer and launcher remain available during local experimentation. No release, commit or push is part of this planning work.

## Recommended direction

Build an opt-in local Codex launcher with a small adapter boundary, native role/subagent definitions where they meet the contract, and a separate process for an adversarial pass when needed for isolation. This is a **conditional recommendation**: settle feasibility tasks MA-01 and MA-02 before implementing role enforcement. Do not create a general orchestration server merely to select models.

The adapter accepts a resolved role, model choice, project directory, instructions and execution mode; it reports supported capabilities, launch failures and review evidence. Keep role policy and model resolution independent of the runtime. Reuse existing script payloads where their contract still applies; avoid copying the full Claude runtime and maintaining two evolving policy sources. Extract shared content incrementally, with output comparison and owner-body preservation.

For the local entry point, use an explicit checkout command or separately named local executable. Do not replace the owner's installed global `fkit` during the experiment. Decide the final public command in stage 2. Local runtime files may be materialized under project-specific managed locations only after path-containment checks; preserve any existing `.codex/` configuration and unrelated skills.

## Work breakdown

Effort is relative uncertainty/size (S/M/L), not a calendar estimate. Every implementation task records changed paths, validation, limitations and handoff. Proposed role owners are future workflow assignments, not claims that these roles ran this investigation.

| ID | Task | Depends on | Proposed owner | Size |
| --- | --- | --- | --- | --- |
| MA-01 | Prove Codex role, model and skill delivery | — | architect | M |
| MA-02 | Prove enforcement, review isolation and owner relay | MA-01 | architect | L |
| MA-03 | Record runtime and review policy decisions | MA-01, MA-02 | architect + owner | S |
| MA-04 | Define settings resolver and validation | MA-03 | coder | M |
| MA-05 | Add isolated local launcher and adapter | MA-03, MA-04 | coder | M |
| MA-06 | Deliver all seven role definitions and shared policy | MA-05 | coder | L |
| MA-07 | Port ordinary skills and executable payloads | MA-06 | coder | M |
| MA-08 | Implement role controls and hook lifecycle | MA-02, MA-06 | coder | L |
| MA-09 | Add model setup and reconfiguration journey | MA-04, MA-05 | coder | M |
| MA-10 | Port fresh-project initiation | MA-07, MA-08, MA-09 | coder | M |
| MA-11 | Port adversarial and stateful review | MA-03, MA-07, MA-08 | coder | L |
| MA-12 | Port task and sprint orchestration | MA-07, MA-08, MA-11 | coder | L |
| MA-13 | Verify and document local Codex milestone | MA-10, MA-11, MA-12 | reviewer + owner | M |
| MA-14 | Unify Claude/Codex launch and packaging | MA-13 | coder | L |
| MA-15 | Validate Claude compatibility and upgrades | MA-14 | reviewer + owner | M |
| MA-16 | Finalize public docs and release readiness | MA-15 | producer | M |

### MA-01 — role, model and skill delivery

Deliver a versioned capability report and reproducible disposable-project probes. Verify root role instructions, all seven custom role names, separate-context delegation, default/per-role model resolution in root and child sessions, role skill visibility and native skill invocation. Compare explicit spawn values with configured role overrides. Check instruction truncation, working directory and existing user configuration interaction. Evidence must distinguish CLI, desktop and any documented surface mismatch. Do not spawn workers unless authorized by the session's agent rules; make that explicit in the probe instructions.

Acceptance: exact version, command/config inputs and observed outcomes for each capability; at least one successful root role and one successful delegated role with model selection verified from runtime evidence. If delegation needs owner authorization or a different environment, identify that narrow dependency and complete independent checks first. No unsupported parity claims.

### MA-02 — boundaries and owner channel

Verify hook activation, caller identity, invocation coverage, trust/retrust and failure semantics; test skill disables against direct invocation, nested contexts and alternate paths. Compare native controls with a minimal controlled dispatcher if needed. Test primary write capability separately from adversarial restrictions; test actual attempted edits and commands in disposable files. Establish how owner decisions are asked and worker questions are relayed in interactive, headless, interrupted and unanswered cases. Preserve declared limits: current wiki ownership and consult depth are not automatically filesystem/security guarantees.

Acceptance: enforced/advisory/unsupported/untested matrix with evidence; no silent continuation with a required inactive control; a ranked recommendation for each material gap. Include sandbox reconciliation with ADR-042 and existing backlog task 0273, rather than silently resolving that older decision.

### MA-03 — decisions

Prepare explicit decisions replacing the single-runtime constraint and defining single-model review status, minimum Codex version, required guarantees and local-stage isolation. Resolve API/provider/model terminology and the eventual shared policy location. Follow accepted ADR append/amend conventions; do not rewrite historical decisions as though they always supported Codex. Owner decides material tradeoffs after seeing concrete evidence. Acceptance: decision scope and affected ADRs/source sites named; implementation gates clear.

### MA-04 — configuration

Implement the proposal in `settings-and-onboarding.md` after schema review. Resolve all roles consistently in direct and delegated invocation; reject invalid config and unavailable explicit selections without silently switching models. Keep credentials with CLI. Acceptance: inherited default and wiki override work; review override resolves independently; effective settings explain provenance; cancellation and failed writes preserve old settings; runtime defaults and reasoning compatibility are explicit.

### MA-05 — local entry point

Add a checkout-local opt-in launcher with safe argv construction, version/dependency checks, no-Claude preflight, and a narrow runtime adapter. Preserve unknown-role errors, correct working directory, exit status and interruption behavior. Avoid interpreting raw model IDs as shell text. Acceptance: all role names resolve, invalid role/config fails before model invocation, installed global command is unaffected, and user `.codex/` settings are preserved. Include setup-only behavior only if necessary for the existing workflow.

### MA-06 — seven roles

Port role prompts with shared responsibilities and runtime-specific bindings. Keep policy canonical and generated artifacts clearly owned; preserve file ownership, task vocabulary and fresh-context rules. Adversarial role executes its own review work without recursively relaunching itself. Acceptance: direct and delegated role instructions agree; smaller wiki model retains the same ownership contract; no stale Claude tool names in active Codex instructions; no duplicated hand-maintained ownership map.

### MA-07 — skills and scripts

Port all 28 current procedures, grouped by the source map in `skill-port-map.md`. Keep shared content and adapter-specific invocation/owner-question bindings explicit. Carry `dashboard.sh`, `throughput.mjs`, heal check/repair and references with their original containment and ownership rules. Acceptance: every skill maps to an allowed role and an invocation path; payload paths resolve from managed installation; read-only board/status continue to use existing grammars; heal never treats owner edits or wiki files as freely replaceable.

### MA-08 — controls

Implement only the controls selected in MA-03, including skill ownership, caller identity, turn completion, owner-question marker, ship-loop marker and carry-check equivalents. Explicitly handle disabled, changed, untrusted or failed hooks. Acceptance: cross-role skill and mover attempts have the agreed outcome; normal owner work is not blocked by a question hook in a spawned consult; sandbox and prompts do not claim more protection than measured. Test normal and failure paths using the approved test scope.

### MA-09 — model setup

Provide default selection, optional per-role customization, a seven-role summary, single-model review guidance, authentication recovery and reconfiguration. Acceptance: one-model setup succeeds without Claude or a second provider; an existing project selects models without repeating product interview; noninteractive mode never hangs; canceled changes preserve prior state; model discovery failure permits labeled explicit input.

### MA-10 — product initiation

Retain intake, producer product brief, architect survey, optional wiki ingest, root overview updates and producer-to-lead handoff. Acceptance: fresh empty and existing-code projects initiate; interrupted, skipped or incomplete setup behaves predictably; `PROJECT.md` freshness remains authoritative; settings are available before any role is invoked; no user-owned context body or project content is lost.

### MA-11 — review

Port ordinary, adversarial and stateful review plus coder dispositions, preserving unique run prompts, scope, untracked content, ledger/residual rules and verbatim second-pass handling where required. Avoid recursive second opinions when the adversarial role itself runs. Acceptance: same-model two-pass review works; a configured different model is selected; no usable second pass is reported separately; labels follow MA-03; command evidence is per pass; reasoning-only is not presented as measured coverage; concurrent runs cannot overwrite each other's scope.

### MA-12 — orchestration

Port task/sprint loops, plan review toggle, plan persistence/carry, review rounds, producer handoff and stop conditions. Acceptance: demonstrate one bounded task and a small sprint in a disposable project, including a real unanswered decision and failure recovery; never infer consent; lead does not substitute for workers; only producer invokes movers and carries the required closure marker. No real repository task is closed during verification.

### MA-13 — local milestone

Demonstrate the checklist in `validation.md` on this Mac with Claude unavailable to the tested launch path. Document exact versions, unresolved limits, model choices, invocation, recovery and rollback. Acceptance: seven direct roles, representative delegation, model override, setup/reconfiguration, two-pass review and bounded workflow succeed. Owner reviews the evidence and agreed limitations. This is local readiness, not a claim of Claude compatibility or all-platform support.

### MA-14–16 — shared support

Introduce public runtime selection and mixed-role runtime routing only after local needs are known. Update installer, self-host, update detection, resource packaging, structure spec/manifest history, board payload discovery and release gates together. Preserve compatible old settings and project content. Verify both runtimes separately with real environments; mocked Claude success is insufficient. If Claude cannot be run locally, arrange a verifier and keep that validation explicitly pending. Final docs and decision records must describe measured behavior. Publishing, committing and pushing require a separate explicit owner instruction.

## Dependency and scope discipline

Do MA-01 through MA-03 before choosing an enforcement implementation. Settings and launcher establish a thin usable path before broad skill porting. Complete one local vertical slice (lead → coder → reviewer/adversarial → producer) before expanding to every loop. Stop expansion when local requirements are met; API backends, arbitrary model support, the unbuilt eighth tester, daemon/broker infrastructure and unrelated backlog cleanup are outside this transformation milestone.

No dates are assigned while L-size feasibility is unresolved. After MA-02, estimate implementation based on observed native support and split L tasks into bounded changes. Existing backlog tasks should be linked or re-briefed rather than duplicated; 0273's sandbox decision is a known overlap. Formal task IDs and board placement belong to a producer handoff, after owner review of this plan.
