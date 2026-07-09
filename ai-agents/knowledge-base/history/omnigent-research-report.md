# Omnigent multi-agent architecture — research report (for the fkit port)

**Target version:** Omnigent **0.4.0** (`omnigent==0.4.0`, PyPI, requires Python ≥3.12).
**Method:** Answers below are grounded in the **actual 0.4.0 wheel source** (downloaded from PyPI and
read file-by-file — `omnigent-0.4.0-py3-none-any.whl`, source files dated 2026‑07‑03), the **official
0.4.0 docs** (`docs/*.md` at the `v0.4.0` git tag and `omnigent.ai/docs`), and **fkit's own six
configs** as they exist today. Per the requester's instruction this pass is *source + docs*, not live
execution — so confidence is labelled **`source`** (read in 0.4.0 code), **`documented`** (stated in
0.4.0 docs), **`inferred-from-source`** (deduced from code paths, not executed), or **`unknown`**.
There is no **`ran-it`** label because nothing was executed. Every claim that would benefit from a
2‑minute local confirmation is flagged.

Citations use `file.py:line` against the installed 0.4.0 package
(`~/.local/share/uv/tools/omnigent/lib/python3.12/site-packages/omnigent/…` on your machine — the same
tree I read from the wheel). Doc citations give the URL.

---

## 1. Executive summary — the findings that decide the topology/DRY choice

1. **fkit's collaboration is built on a field Omnigent never reads.** Every one of the six configs
   wires consultation as `tools.<name>: { type: agent, config: ../fkit-X/config.yaml }`. The 0.4.0
   loader's `type: agent` branch reads `spec`, `prompt`, `tools`, `executor`, `os_env`, `pass_history`,
   `pass_histories`, `max_sessions` — **there is no `config:` key anywhere in it**
   (`inner/loader.py:434-495`; a grep for `.get("config")` in `loader.py` returns nothing). The path
   is silently dropped → an `AgentTool` with no spec → the runtime `not in local dispatch table`
   error. **F3 confirmed. This is the single root cause of the shakedown failure.** `source`

2. **There is no "reference one shared sub-agent bundle from many parents" feature in 0.4.0.** The
   only file-based sub-agent mechanism is *physical nesting*: a real directory at
   `<parent>/agents/<name>/config.yaml`, exposed via `tools.agents: [<name>]`
   (`spec/parser.py:2535-2564`, `spec/validator.py:408-432`). No path include, no name/registry
   include, no `extends`/`base`/`mixin`. `source`

3. **But there *is* a clean DRY route that avoids nesting entirely: the server/session model.** With
   top‑level `spawn: true`, an agent gets `sys_session_create`, which launches **an existing agent by
   `agent_id`** or **a canonical bundle by `config_path`** and then drives it with `sys_session_send` /
   collects via `sys_read_inbox` (`runner/tool_dispatch.py:1828-1927`, `spec/parser.py:210-216`). This
   is how one wiki definition can serve all callers without copying it under each. `source`

4. **The idiomatic Omnigent shape is a single orchestrator that owns the workers and brokers between
   them — a tree, not a peer graph.** The two shipped multi-agent examples (`debby`, `polly`) are both
   one root that fans out to leaf workers and mediates all cross-worker work (e.g. polly hands one
   worker's diff to a *different* worker for review). Workers do **not** call each other or call back
   up (`resources/examples/polly/config.yaml`, `resources/examples/debby/config.yaml`). fkit's
   producer↔architect *mutual* consultation and "coder consults architect" are **peer edges that a
   pure nesting tree can't express** without an orchestrator or duplication. `source`

5. **Sub-agent dispatch is async/inbox — there is no blocking "call and get the answer" primitive.**
   Both `sys_session_send` (named mode) and `sys_session_create` return a *launching handle*; the
   result arrives later in the caller's inbox (`runner/tool_dispatch.py:1571-1584`). The "ask, wait,
   use the answer" wiki-gateway pattern is implemented by *ending the turn* and letting the framework
   wake you when the child finishes, then reading `sys_read_inbox` — exactly as the debby/polly prompts
   instruct. `source`

6. **Symlinks are a dead end for anything you package or serve.** Local discovery uses
   `Path.is_dir()`/`exists()`, which *do* follow symlinks — so F5's "discovery doesn't follow symlinks"
   is likely mis-attributed (the real error is a name mismatch, see A3/F5). But the bundle tar
   extractor **rejects any symlink or hardlink outright** (`spec/tar_utils.py:114-134`,
   `member.issym() or member.islnk()`), so a symlinked shared agent dies the moment the bundle is
   packaged or uploaded to the server. `source`

7. **Role boundaries *can* be enforced structurally, and fkit currently does not.** The bwrap/seatbelt
   sandbox is **read-only by default**; `sandbox.write_paths: [ …]` opts specific paths into writability
   (`inner/bwrap_sandbox.py:23,206,247`; `inner/seatbelt_sandbox.py:352,395`; documented in
   `AGENT_YAML_SPEC.md`). fkit sets `sandbox: { type: none }` on all six — which **disables the sandbox
   entirely**, so "REVIEW-ONLY" and "wiki-only-writes" live purely in prose today. `source` + `documented`

8. **The F7 frontmatter trap is real and load-fatal, and there is no pre-flight validator command.**
   Agent parse loads skills in *strict* mode (`spec/parser.py:1963-1972`, `skipped=None` ⇒ first bad
   `SKILL.md` raises and aborts the whole agent). There is no `omnigent validate`/`lint`/`check`
   subcommand; validation only happens inside `omnigent run` at load. The programmatic pre-flight is
   `omnigent.spec.load()` / `omnigent.spec.validate()` (`spec/__init__.py`). `source`

---

## 2. The DRY / topology verdict

### 2.0 Direct answer to the core question

> *Can multiple independent agents share and call one common sub-agent (e.g. the wiki) without
> physically duplicating its bundle under each caller — in 0.4.0?*

**Not through the `tools.agents` / nested-directory mechanism — that one is copy-only.** A name in
`tools.agents` must resolve to a real sub-directory under the parent's own `agents/`
(`spec/validator.py:425-432`); there is no path, include, registry, or inheritance form, and symlinks
don't survive packaging. So if you stay inside the nested model, sharing = copying.

**Yes, through the server/session model** — this is the supported DRY route and it's under-documented,
so it's easy to miss:

- Give each consulting agent `spawn: true`. That registers **`sys_session_create`**, which can
  **launch an existing registered agent by `agent_id`** (one wiki, registered once, reused by all) **or
  launch a canonical bundle by `config_path`** (all callers point at the *same* `../fkit-wiki`
  directory — one source of truth, no per-parent copy). It returns a child-session handle you drive
  with `sys_session_send` and read back via `sys_read_inbox`
  (`runner/tool_dispatch.py:1828-1927`; the `spawn` semantics are spelled out at
  `spec/parser.py:210-216`). `source`
- Reads across sessions are always-on; only the *write* grant (`spawn`) is explicit
  (`spec/parser.py:210-216`). A caller can also `sys_session_send(session_id=…)` straight to an
  already-running wiki session by id (`runner/tool_dispatch.py:1244`, `_send_to_existing_session`).

The catch on the server route: dispatch is **async** (send → end turn → inbox), it needs the Omnigent
**server** running so sessions have ids and a create endpoint (`POST /v1/sessions`), and you manage the
shared agent's lifecycle/addressing yourself. That's the price of true single-definition sharing.

### 2.1 Ranked recommendation for this six-agent team

**#1 — Single "fkit" orchestrator that owns all six as workers and brokers consultation (option b).**
This is the idiomatic shape (debby/polly), fully supported in 0.4.0 with zero duplication: each worker
is defined *once* under `fkit/agents/<name>/`. The orchestrator fans out with `sys_session_send` and
mediates every cross-worker consult — when the coder needs the architect, the coder returns "I need X";
the orchestrator dispatches the architect and feeds the answer back. Wiki lookups, producer↔architect,
reviewer→adversarial all route through the broker.
*Trade-off:* the six stop being independently-runnable roots and become leaves; all peer consultation
becomes orchestrator round-trips (more latency, more orchestrator prompt logic). Peer-to-peer "the
coder directly asks the architect" is **not** expressible — the tree forbids sibling and upward edges
(see B1). `source`

**#2 — Server-registered shared wiki + `spawn`, hybrid with shallow nesting (option a).** Keep the
consulting agents as independent roots. Register **fkit-wiki once** as its own agent; every other agent
gets `spawn: true` and consults it via `sys_session_create(agent_id=<wiki>)` (or `config_path` to the
one canonical wiki) → `sys_read_inbox`. Nest the genuinely-private pair directly:
`fkit-adversarial-reviewer` lives under `fkit-reviewer/agents/` (a clean one-level parent→child that
needs no sharing). Handle producer↔architect either by making one the other's spawned child or by
brokering through whichever of the two the human starts.
*Trade-off:* requires the server; async inbox instead of a blocking call; you own the wiki's lifecycle
and addressing. This is the **only** route that keeps the six as separate agents *and* keeps the wiki
DRY. `source`

**#3 — Single-source + generate the nested copies (option c).** Author the wiki once (canonical
`fkit-wiki/`) and add a tiny build step that copies it into each parent's `agents/wiki/` before
`omnigent run`/bundle. You stay entirely inside the supported `tools.agents` model; duplication exists
only in *built* artifacts, never in hand-maintained source.
*Trade-off:* a build step and stale-copy risk; bundles get bigger. But it's the least-moving-parts way
to get DRY authoring without the server. `inferred-from-source` (mechanics are all supported; the
generator is your code)

**#4 — Accept duplication (option d).** Hand-copy the wiki under each parent's `agents/`. Simplest to
reason about, works today, but six copies to keep in sync — exactly what you're trying to avoid.

**Bottom line:** if the six can collapse under one broker, take **#1**. If they must stay independent
and the wiki must stay single-source, take **#2**. Reserve #3/#4 for when you can't run the server.

---

## 3. Per-question answers

### A. Sharing a sub-agent without duplication — P0

**A1 — Any supported way to reference one shared sub-agent without copying?**
**Answer:** Not via `tools.agents`/nesting (copy-only). **Yes** via the server/session model
(`spawn: true` → `sys_session_create` by `agent_id` or `config_path`; or `sys_session_send` to an
existing `session_id`). No `extends`/`base`/`mixin`/`include`/path-reference for the *nested* form
exists. `config_path` is the closest thing to a path-reference and it uploads/launches the one canonical
bundle rather than copying it into the parent. **Evidence:** `runner/tool_dispatch.py:1828-1927`
(`_execute_session_create`, "`agent_id` — spawn from an existing agent … `config_path` — upload a NEW
agent from local disk (config YAML, dir, or `.tar.gz`)"); `spec/parser.py:210-216` (spawn flag);
`spec/validator.py:425-432` (nested must be a real dir). **Confidence:** `source`.

**A2 — Server/session route (register the wiki, dispatch by name/id from separately-started agents).**
**Answer: yes — this is the recommended DRY route.** Mechanism: run the Omnigent **server**
(`omnigent server`); the wiki becomes an agent with an `agent_id` and its sessions have ids. A separate
agent with `spawn: true` calls `sys_session_create(agent_id=<wiki_id>)` (child parented to the caller,
same runner affinity) and gets a handle, or `sys_session_send(session_id=<wiki_session>)` to an existing
one; results come back through `sys_read_inbox`. Observability/lifecycle: `sys_session_list`,
`sys_session_get_info`, `sys_session_get_history`, `sys_session_close`, and agent discovery via
`sys_agent_list`/`sys_agent_get` proxy the server's REST endpoints (`GET /v1/agents`, `GET /v1/sessions`)
(`runner/tool_dispatch.py:201-311`, `440-446`). Addressing is by **agent_id** (to spawn fresh) or
**session_id** (to continue). Isolation: each child is its own session/sandbox; the parent is forced as
`parent_session_id` (`runner/tool_dispatch.py:1849-1855`). **Confidence:** `source` (read the dispatch +
REST proxy paths; not executed — verify the exact `sys_session_create` arg names with one live call).

**A3 — Do symlinks work in any form? Does packaging preserve them?**
**Answer:** For **local, unpackaged** runs, sub-agent discovery *does* follow symlinks — `iterdir()` +
`Path.is_dir()` + `config.yaml.exists()` all dereference (`spec/parser.py:2557-2563`) — so a symlinked
`agents/<name>` pointing at a real dir with a matching `name:` *should* be discovered. **But packaging
strips/rejects them:** the bundle extractor denies any `issym()`/`islnk()` member outright
(`spec/tar_utils.py:114-134`, "Safety violations include path traversal, symlinks/hardlinks"), and the
server upload path validates bundles through it. So symlinks are unusable for anything you bundle,
deploy, or run through the server. **On F5 specifically:** the error you hit
(`… references sub-agent '<name>' but no matching directory found under agents/`) is the *validator's
name-set check* (`spec/validator.py:425-432`), which fires when the `tools.agents` entry doesn't match
any discovered sub-agent's **`name:`** — and the sub-agent's name comes from its `config.yaml` `name:`
field, **not** the directory basename (`spec/parser.py:239`). So the most likely real cause of F5 was a
**name mismatch** (the canonical `fkit-wiki` bundle has `name: fkit-wiki`, but the symlink/tools.agents
entry was `wiki`), not "symlinks aren't followed." **Confidence:** `source` for the tar rejection and
the name-from-config fact; `inferred-from-source` for the F5 re-attribution — worth a 2-minute test
(symlink `agents/fkit-wiki` → `../../fkit-wiki`, set `tools.agents: [fkit-wiki]`, `omnigent run`).

**A4 — Officially recommended pattern for "N agents share one common worker."**
**Answer:** The docs/examples don't give an explicit "shared worker" recipe; the shipped guidance is the
**single-orchestrator-with-nested-workers** pattern (debby/polly). For true sharing the supported
building block is `spawn`/`sys_session_create`. **Evidence:** `resources/examples/polly/config.yaml`
(comment: "`spawn: true` registers `sys_session_create`, so it can launch an existing agent by id or
author a custom agent config and launch it via `config_path`"); `AGENT_YAML_SPEC.md` documents only
inline + `spec: self` + `inherit`. **Confidence:** `source` + `documented`.

### B. Topology & the call graph — P0

**B1 — Can a nested sub-agent call a sibling / its parent / a grandparent?**
**Answer: no, not within the nesting model.** Named-mode `sys_session_send(agent=…)` requires the target
to be in the **caller's own** spec (`_has_subagent(sub_agent_name, agent_spec)`,
`runner/tool_dispatch.py:1262-1263`) and dispatches using the **caller's** `agent_id`
(`:1264-1281`). A leaf's spec lists no siblings, no parent, no grandparent, so those edges don't exist.
The permitted edges are strictly **parent → its own declared child**. The *only* way a leaf reaches
anything else is if it *itself* has `spawn: true` and creates an independent child session (which is a
new parent→child edge, not a sibling/upward edge). **Confidence:** `source`.

**B2 — Tree or graph? Maintainer intent.**
**Answer:** The dispatch model is a **tree** (one orchestrator, workers as leaves); peer-to-peer edges
are not a first-class concept. Both shipped examples are strict trees, and cross-worker interaction is
always *mediated by the root* (polly gives worker A's diff to worker B; the workers never talk). "Graph"
behaviour is only achievable by turning an edge into an orchestrator round-trip or a `spawn`ed child.
**Evidence:** `resources/examples/{polly,debby}/config.yaml`; dispatch constraints above.
**Confidence:** `source` for the mechanism; maintainer *intent* is `inferred-from-source` (no explicit
design statement found — see Open Questions).

**B3 — Depth / fan-out limits.**
**Answer:** No hard depth cap in the spec parser (sub-agents are parsed recursively,
`spec/parser.py:2535-2564`). Fan-out is bounded per turn by the optional **`spawn_bounds`** policy
(default `max_dispatches_per_turn=5`, counting `sys_session_send`;
`inner/nessie/policies.py` `spawn_bounds`; polly sets 6 and also counts `sys_session_create`). Practical
cost/latency: every dispatch is a full child session on a harness subprocess (its own model, sandbox,
possibly its own CLI on PATH), and deep nesting multiplies that; the async inbox model means each level
adds a wake-round-trip. **Confidence:** `source` (limits) + `inferred-from-source` (perf).

**B4 — Idiomatic shape for "specialists that consult each other" + skeleton.**
**Answer:** One orchestrator, specialists as nested leaves, consultation brokered by the orchestrator.
Minimal skeleton in §4.2. **Confidence:** `source`.

### C. Sub-agent invocation semantics — P0/P1

**C1 — `type: handoff` (target_agent, bidirectional, pass_history): what is it, and can `target_agent`
name a non-nested agent?**
**Answer:** A `handoff` tool **transfers the conversation to another agent** rather than delegating a
sub-task and getting a result back. Fields: `target_agent` (a **registered agent name** *or* an inline
`AgentDef`), `pass_history` (default **True** — copy history to the target), `bidirectional` (default
**True** — target may hand control back) (`inner/loader.py:510-516`; `inner/tools.py:337-361`, docstring:
"Transfers the Connection to another agent's session. `target_agent`: Either a registered agent name
(`str`) … or an inline `AgentDef`"). So conceptually handoff is the closer thing to a *named/peer*
reference — but in 0.4.0 it is **control-transfer, not request/response**: after a handoff the target
drives the conversation; it is not the "ask the wiki a question and keep working" primitive you want for
the gateway. It is also **not documented** in `AGENT_YAML_SPEC.md` (which lists handoffs only in the
tools table), and I found no example using it. **Whether `target_agent` resolves a truly
separately-started agent at runtime is not something I could confirm from the loader alone** — the
loader stores the name; resolution happens in the harness/executor layer (the openai-agents SDK
executor references handoffs). **Confidence:** `source` for the schema/semantics of the dataclass;
`unknown` for cross-agent runtime resolution — **do not build the wiki gateway on handoff without a live
test.**

**C2 — `sys_session_send` vs `sys_call_async` vs a synchronous call.**
**Answer:**
- **`sys_session_send`** — the sub-agent primitive. Two modes: *named* `(agent, title)` spawn-or-continue
  a child declared in your spec; *existing* `(session_id)` send to a known session. Returns a launching
  handle; result lands in your inbox (`runner/tool_dispatch.py:1146-1584`).
- **`sys_call_async` / `sys_cancel_async`** — the generic **async REST** work tools (fire a long call,
  get a task, collect via inbox), a layer under the sub-agent tools
  (`runner/tool_dispatch.py:11`, `168`). Gated by top-level `async:` (default true).
- **Synchronous call:** none at the `sys_*` level (see C3).
**Confidence:** `source`.

**C3 — Is dispatch only async/inbox, or is there a blocking "call and get the answer" form?**
**Answer: async/inbox only.** Both `sys_session_send` (named) and `sys_session_create` return
`status: "launching"` with "*Result will appear in your inbox; call `sys_read_inbox` to check*"
(`runner/tool_dispatch.py:1571-1584`). There is **no blocking primitive** that returns the child's answer
inline. (A docstring on `_execute_session_create` says it "does NOT block on the child turn — unlike
named-mode send," implying named send blocks; the *actual return value* of named send is the same
launching handle, so treat that docstring as misleading — a docs↔code wrinkle, see §5.) The
wiki-gateway "ask, wait, use answer" is therefore: **dispatch → end your turn → the framework wakes you
when the child finishes → `sys_read_inbox` → use the answer.** The debby prompt states this explicitly:
"*The partners run autonomously and notify you through the inbox when they finish; you do not drive them
turn-by-turn or wait on them yourself … END YOUR TURN and let the inbox wake you.*"
(`resources/examples/debby/config.yaml`). **Confidence:** `source`.

**C4 — `pass_history`, `pass_histories`, `max_sessions`, `spec: self`.**
**Answer:**
- **`pass_history`** (bool, default **False** for `type: agent`; **True** for `handoff`) — whether the
  child receives the parent's conversation history. fkit's `pass_history: false` is correct intent (the
  wiki only needs the question) — it's just attached to a `config:` tool that never loads
  (`inner/loader.py:489`, `514`).
- **`pass_histories`** — a plural variant carried on `AgentTool` (`inner/loader.py:491`); passes multiple
  named histories. Under-documented; treat as advanced/`inferred-from-source`.
- **`max_sessions`** (int ≥1) — cap on concurrent child sessions for that sub-agent tool; validated at
  load (`inner/loader.py:466-483`).
- **`spec: self`** — clone the parent's entire spec as the child; **cannot** be combined with
  `prompt`/`tools`/`executor`/`os_env`/`pass_history`/`pass_histories`/`max_sessions` (raises at load)
  (`inner/loader.py:434-460`). Useful for recursion/self-delegation, not for a *different* worker.
**Confidence:** `source`.

**C5 — Prompt authoring: how to make a model actually dispatch.**
**Answer:** Two things. (1) **The tools are generic, not per-sub-agent.** Declaring `tools.agents: [x]`
(or `spawn: true`) auto-registers the `sys_*` surface (`sys_session_send`, `sys_read_inbox`,
`sys_session_get_history`, `sys_session_list`, `sys_cancel_task`, …) — there is **no tool literally named
`x`**. So a prompt that says "call your `wiki` tool" misfires; the model must call
`sys_session_send` with `agent: "<name>"` (or `session_id`) and a `title`. (2) **Teach the async
rhythm.** The reliable wording (lifted from debby/polly) is: *"To consult <worker>, call
`sys_session_send` with `agent: '<name>'`, a short `title`, and the question as the message. Then END
YOUR TURN. You will be woken when it finishes; collect the result with a single `sys_read_inbox`. Do not
poll, loop, or use timers."* **Evidence:** `resources/examples/{debby,polly}/config.yaml`; tool
auto-registration in `runner/tool_dispatch.py:201-311`. **Confidence:** `source`.

### D. Enforcing role boundaries structurally — P1

**D1 — `blast_radius` / `gate_pushes`: exact semantics; headless ASK behaviour.**
**Answer:** `blast_radius(*, gate_pushes=True, deny_reason=…)` is a `tool_call` policy that classifies
`sys_os_shell` / native `Bash` / Pi `bash` commands by reversibility
(`inner/nessie/policies.py:346-410`):
- **DENY (always, irreversible):** the "catastrophic set" — force-push, `git push` with delete/force
  refspecs, hard-reset to a remote ref, `rm -rf` of a catastrophic target (root/system dirs), plus the
  `_DENY_PATTERNS`. `rm -rf` of `/home`,`/opt`,`/tmp` or a relative path is *not* catastrophic → ASK,
  not DENY (`:59-96,164-284`).
- **ASK (recoverable-but-outward), only when `gate_pushes=True`:** `git push`, `gh pr merge`, infra
  deploy/destroy, `rm -rf <path>` (`:68-73,307-343`).
- **ALLOW:** everything else (reads, tests, edits, local git commit/merge/worktree).

`gate_pushes=False` enforces **only** the DENY set (no approval prompts) — "*use only for trusted
unattended batch runs*" (`:361-364`). **Headless ASK behaviour:** an ASK **parks** the tool call and
waits for a human verdict up to the spec's `guardrails.ask_timeout` seconds; it does **not** auto-deny
or auto-allow. The delivery path uses a one-day read budget so a parked ASK survives a human stepping
away (`runner/tool_dispatch.py:1541-1552`), and polly raises `ask_timeout: 86400`. This is exactly why
the debby/polly sub-agents set `gate_pushes: false` — a comment states "*a headless head can't answer an
approval prompt anyway*" (`resources/examples/debby/agents/claude/config.yaml`). **Implication for
fkit:** your six agents set `gate_pushes: true`; run head-**less** they will **hang** on any
push/commit/merge until `ask_timeout` (default is short) then fail — for unattended runs use
`gate_pushes: false` and rely on the DENY set + sandbox writes. **Confidence:** `source`.

**D2 — Can an agent be made read-only or restricted to specific write paths?**
**Answer: yes — structurally, via the sandbox.** The bwrap/seatbelt sandbox is **read-only by default**;
`sandbox.write_paths: [ …]` is what opts specific subtrees into writability
(`inner/bwrap_sandbox.py:23` "*`write_paths: ["."]` flips it to read-write*"; `:206,247`;
`inner/seatbelt_sandbox.py:352,395`; documented in `AGENT_YAML_SPEC.md` → "Local OS access"). So:
- **Reviewer / adversarial-reviewer (no source writes):** either omit `os_env` (no `sys_os_write` at all)
  or set a sandbox with **no `write_paths`** (or only a scratch dir) → filesystem is read-only.
- **Wiki (writes only its vault):** `sandbox: { type: linux_bwrap, write_paths: [ai-agents/wiki-vault] }`.

**fkit's current problem:** all six use `sandbox: { type: none }`, which **turns the sandbox off** — no
write restriction at all; "REVIEW-ONLY"/"wiki-only-writes" are prompt-only. Switching `type: none` →
a real sandbox with scoped `write_paths` is the structural fix. See §4.4 for a review-only skeleton.
**Confidence:** `source` (read-only default + write_paths) + `documented`.

**D3 — Per-agent tool allow/deny / capability scoping.**
**Answer:** Capabilities are **opt-in and per-agent**, which is the main scoping lever:
- **OS/file/shell tools** appear only if `os_env` is declared (declaring it registers
  `sys_os_read/write/edit/shell`; the shell comes bundled — noted in the debby config). No `os_env` ⇒
  no filesystem/shell surface.
- **`tools.builtins`** is an explicit list of built-in tools to enable (`spec/parser.py:365,413-444`).
- **Sub-agent/spawn surface** is gated by `tools.agents` and top-level `spawn`.
- **Async/timers/session-sharing** each have their own top-level gate (`async:`, `timers:`,
  `agent_session_sharing:`, `spawn:`) (`spec/parser.py:200-222`).
- **Guardrail policies** (function/prompt) can DENY specific tool calls at runtime (blast_radius is one).
There is no single "deny-list these tool names" field surfaced in the docs; scoping is by *not granting*
the capability plus policy DENY. **Confidence:** `source` for the gates; `inferred-from-source` that
there's no dedicated per-name deny list beyond policies.

### E. Skills — schema, discovery, portability — P1

**E1 — Exact SKILL.md schema; `$ARGUMENTS`; quoting/length constraints.**
**Answer:** `SKILL.md` = YAML frontmatter delimited by `---` lines, then Markdown body
(`spec/parser.py:2003-2072`, `_parse_skill`). Frontmatter is parsed with `yaml.safe_load` and **must be a
mapping** with required **`name`** and **`description`**; optional **`user-invocable`** (bool; quoted
falsey strings `false/no/off/0` also count; default true). Body becomes `content`. **No `$ARGUMENTS`
token exists** in the 0.4.0 skill parser (grep found none) — skills are loaded as content via
`load_skill`/`read_skill_file`, not templated with arguments like Claude Code slash-commands. **Quoting
constraint (this is F7):** because frontmatter is real YAML, an **unquoted `description:` containing a
colon-space** (`key: value`) makes PyYAML read it as a nested mapping or raise → `OmnigentError` →
**load abort** (see E2). **Quote any description containing `: `.** No explicit length limit in the
parser. **Confidence:** `source`.

**E2 — Discovery / scoping / auto-trigger.**
**Answer:** Per-agent skills live in the bundle's `skills/` dir; each `skills/<name>/SKILL.md` is
discovered (`spec/parser.py:229`, `_discover_skills(root/"skills")`, `:1942-1972`). **Scoping** is by
the top-level `skills:` filter: `all` (default), `none`, or a name list (`spec/parser.py`
`_parse_skills_filter`; resolved in `inner/claude_sdk_executor.py:1015-1052`). **Trigger:** the harness
surfaces skills to the model (name + description) and the model invokes them (`load_skill`), i.e.
description-match / model choice — there is no separate slash-command router in the loader. **Critical
F7 detail:** agent parse calls `_discover_skills` with **no `skipped` list ⇒ strict mode**, so the first
malformed `SKILL.md` **raises and takes down the whole agent** (`spec/parser.py:1963-1972`). The lenient
"skip the bad one" mode exists only for host/plugin *menu* discovery, not for loading your own bundle.
**Confidence:** `source`.

**E3 — Do skills behave identically across harnesses (claude-sdk vs codex)?**
**Answer:** Parsing/discovery is harness-agnostic (same `_parse_skill`/`_discover_skills`). **Surfacing
differs by harness.** For claude-sdk, skills and CLAUDE.md discovery are coupled to `setting_sources`:
`skills: none` sets `setting_sources=[]`, which *also* suppresses the SDK's CLAUDE.md auto-load
(`inner/claude_sdk_executor.py:1034-1052`). Native harnesses (claude-native, codex-native) "ignore the
harness `tools` list" and get a relayed builtin surface instead (`runner/tool_dispatch.py:311-330`
comment), so skill/tool exposure is not identical. Treat skill *content* as portable but *triggering and
context-file coupling* as harness-specific. **Confidence:** `source` for claude-sdk coupling;
`inferred-from-source` for the full codex comparison — verify on codex if it matters.

**E4 — Pre-flight validation to catch YAML/schema errors before a live run?**
**Answer: no dedicated command.** The CLI commands are the harness shortcuts (`claude`, `codex`,
`opencode`, `pi`, `cursor`, `kiro`, `goose`, `hermes`, `antigravity`, `qwen`, `kimi`), plus `polly`,
`debby`, `run`, `resume`, `attach`, `version`, `setup`, `login`, `stop`, `upgrade`/`update`, and the
`server` / `host` / `config` / `debug` groups — **no `validate`/`lint`/`check`/`bundle`**
(`cli.py`, enumerated). Validation runs only *inside* `omnigent run` at load
(`cli.py:977-1007`, `materialize_bundle` + `load`). **Best programmatic pre-flight:** call the public
API — `from omnigent.spec import load, validate` (both exported, `spec/__init__.py:84-89`); `load()`
parses+validates a directory/bundle and `validate()` returns a `ValidationResult`. Wrap that in a tiny
CI script to catch frontmatter/schema errors (including the F7 trap) before shipping. **Confidence:**
`source`.

### F. Headless / automation / programmatic use — P1

**F1 — Headless one-shot `-p`; does it block until nested sub-agents finish or exit early?**
**Answer:** `omnigent run <bundle> -p "msg"` runs one-shot and prints the root's result (F1 in the brief
— consistent with the CLI). **The risk is real:** because dispatch is async, a root that fans out and
then *ends its turn* has, from the harness's point of view, completed a turn — so a naive `-p` can return
the root's first-turn text **before** children land in the inbox. The runner stays alive while work is
active (there's an **idle-timeout** monitor that only shuts down after `runner.idle_timeout_s` with **no
active agent work**, and "keeps waiting" if a turn is running — `runner/_entry.py:79-166`), so the
*process* won't die mid-flight; but whether `-p` print-mode pumps the inbox waves to completion and
prints the *final* synthesis is **not something I could confirm from source without running it.**
**Recommendation:** for reliable multi-agent completion in automation, drive via the **server REST API**
(create session, post message, poll `GET /v1/sessions/{id}` / history) rather than `-p`, or verify `-p`'s
end-condition with a quick 2-agent test. **Confidence:** `inferred-from-source` (mechanism) / `unknown`
(exact `-p` end-condition).

**F2 — Structured/JSON output mode or a Python/HTTP SDK?**
**Answer:** **HTTP API: yes.** The server exposes a full REST surface — `server/routes/sessions.py`,
`comments.py`, `session_policies.py`, `harnesses.py`, `hosts.py`, etc. — with `POST /v1/sessions`,
`GET /v1/sessions/{id}`, `/events`, `/child_sessions`, `/items`, `/agent`, `GET /v1/agents`
(referenced throughout `runner/tool_dispatch.py`). That's the programmatic driver for CI and for tools
that need to parse results. **Python API: partial** — `omnigent.spec` (`load`, `validate`,
`materialize_bundle`, `parse`) is a clean public authoring/validation API; the runner/executor classes
exist but aren't a documented embedding SDK. **CLI JSON print-mode:** I did not find a `run --json` /
`--output-format` flag in `cli.py` (unlike the native harness bridges, which use `stream-json`
internally). **Confidence:** `source` for the REST API + `omnigent.spec`; `inferred-from-source` /
`unknown` for a first-class embeddable Python SDK and CLI JSON output — check `omnigent.ai/docs` API
reference.

**F3 — Session persistence / resume / inspection.**
**Answer:** Sessions are server-side, durable in a conversation store, and inspectable: `omnigent resume`
and `omnigent attach` (CLI commands) reconnect; programmatically `sys_session_get_history`,
`sys_session_get_info`, `sys_session_list` and the REST endpoints (`GET /v1/sessions/{id}`, `/items`,
`/child_sessions`) read state back (`runner/tool_dispatch.py:201-228`; comment at `:211-217`). Good fit
for a review-ledger workflow. **Confidence:** `source`.

### G. Config, context files, model routing — P2

**G1 — Confirm F2 (which context file each harness injects, from where, precedence).**
**Answer (refined):** There are **two distinct mechanisms**, easy to conflate:
1. **Explicit `instructions:` / `prompt:`** — `instructions:` may be inline text *or a path*
   (e.g. `instructions: AGENTS.md`), resolved **relative to the config.yaml's directory**, and it
   **replaces** `prompt` when both are set (`prompt` is the legacy alias) (`spec/parser.py:225-231`;
   `AGENT_YAML_SPEC.md` "Common top-level fields" + "`prompt` may also be replaced by
   `instructions: AGENTS.md`; relative paths are resolved from the YAML file's directory").
2. **Harness auto-discovery** — the **claude-sdk** harness inherits Claude Code's `CLAUDE.md`
   discovery via the SDK's `setting_sources` (user + project scope, read from the **os_env cwd**, not the
   bundle dir); "bare mode skips CLAUDE.md auto-discovery" (`inner/claude_sdk_executor.py:1034,1954`).
   Codex's convention is `AGENTS.md`. **Coupling gotcha:** `skills: none` sets `setting_sources=[]`,
   which *also* disables CLAUDE.md auto-load (`:1040-1052`).
So F2 is right that claude-sdk reads `CLAUDE.md` and codex reads `AGENTS.md`, but the **precise scope**
(cwd/project/user) and codex's exact injection point are `inferred-from-source` — verify against
`omnigent.ai/docs` if you depend on merge order. **Confidence:** `documented` (instructions path) +
`source` (claude-sdk coupling) + `inferred-from-source` (codex scope/precedence).

**G2 — Per-agent model/harness selection; resolution when unpinned.**
**Answer:** Pin per agent under **`executor`**: `executor.config.harness` (fkit's shape) or the doc's
`executor.harness` + `executor.model` (both accepted; `_parse_executor_spec`, `inner/loader.py`;
`AGENT_YAML_SPEC.md` "Executor"). Each sub-agent picks its own harness+model, so mixing is per-role (doc
shows a `cursor` coder with a `claude-sdk` reviewer). **Unpinned:** the harness resolves the configured
**provider's default model** — e.g. claude-sdk with no model runs the configured Claude provider's
default (bundled catalog default `claude-opus-4-8`, per debby/polly comments). Per-dispatch overrides are
possible via `sys_session_send` `model`/`harness` args, but only if the sub-agent opts in via
`executor.config.allowed_harnesses` (`runner/tool_dispatch.py:1360-1400`). 0.4.0 harness ids
(`AGENT_YAML_SPEC.md@v0.4.0`): `claude-sdk`, `openai-agents`, `codex`, `cursor`, `kiro-native`, `pi`,
`antigravity`, `qwen`, `kimi`, `copilot`, `hermes` (+ native variants). **Confidence:** `source` +
`documented`.

**G3 — Confirm/refute F8: no native cross-agent shared-instructions? Role of `~/.omnigent/config.yaml`.**
**Answer: confirmed — there is no native "shared instructions across all agents" mechanism in 0.4.0.**
No `extends`/`base`/`mixin`; `instructions:` *replaces* the prompt rather than layering
(`spec/parser.py:225-231`). `~/.omnigent/config.yaml` (global) and a project `.omnigent/config.yaml`
carry **provider credentials, gateways, and runner defaults** (e.g. `runner.idle_timeout_s`,
`auth: {type: provider, name: …}`), **not** shared prompt content (`AGENT_YAML_SPEC.md@v0.4.0`
Copilot/Kimi sections reference `~/.omnigent/config.yaml` for providers; `omnigent config` group;
`runner/_entry.py:79-115`). **To share instructions across the six agents, your only options are:**
factor the common text into a file and reference it per-agent with `instructions: ../shared/COMMON.md`
(one file, six references — DRY at the source), or rely on the harness's `CLAUDE.md`/`AGENTS.md`
project-scope auto-discovery for shared context. **Confidence:** `source` + `documented`.

### H. Distribution, versioning, roadmap — P2

**H1 — How are bundles distributed/installed/shared; format; symlinks?**
**Answer:** A bundle is a **directory** (`config.yaml` + `agents/`, `skills/`, `tools/`) that
`materialize_bundle` normalizes and tars into a **gzipped tarball** for upload/deploy
(`spec/__init__.py:93`, `materialize_bundle`; `runner/tool_dispatch.py:1930-1947`, `_bundle_local_agent_source`).
Distribution channels in 0.4.0: run a local dir/YAML (`omnigent run`), `omnigent deploy`/`host` a bundle,
or upload via `POST /v1/sessions` (multipart) with `config_path`. The tarball **preserves directory
structure but rejects symlinks/hardlinks** (`spec/tar_utils.py:114-134`). No public agent *registry* /
package-manager distribution was found in 0.4.0 (agents are shared as dirs/tarballs). **Confidence:**
`source`.

**H2 — `spec_version` meaning; spec stability; breaking-change handling; multi-agent roadmap.**
**Answer:** `spec_version` is the agent-spec schema version; current value is **`1`** (all examples and
fkit use `spec_version: 1`; parsed at `spec/parser.py:142`; `AgentSpec.spec_version: int`,
`spec/types.py:1373,1486`). There's a compat/legacy-shim layer (`spec/_omnigent_compat.py`,
`spec/_omnigent_legacy_shim.py`), indicating the maintainers actively version and shim the spec across
releases. **Release cadence:** v0.1.0 (2026‑06‑13) → v0.2.0 (06‑19) → v0.3.0 (06‑26) → **v0.4.0**
(current), per `CHANGELOG.md` — roughly weekly, so the spec is **moving fast and not yet stable**.
**Roadmap for shared/referenced agents:** I found no committed roadmap item for a cross-parent shared-
agent reference or registry in the 0.4.0 changelog/docs I could read. Notably, the **`main`-branch**
`AGENT_YAML_SPEC.md` still documents sub-agents as **inline-only** (no `config:`/path reference), so as
of `main` the feature fkit assumed does not exist there either. **Confidence:** `documented` (versions,
inline-only in main) + `unknown` (unannounced roadmap — see Open Questions; check GitHub issues/Discussions).

**H3 — Authoritative docs & multi-agent examples beyond debby/polly.**
**Answer:** Best references: the repo `docs/` (`AGENT_YAML_SPEC.md`, `SANDBOXING.md`, `POLICIES.md`
referenced in source), `omnigent.ai/docs` (Custom Agents, MCP & Tools, Built-in Agents, Harnesses), the
Databricks launch blog, and the two shipped examples (`resources/examples/{debby,polly}`) — polly is the
closest analog to fkit (an orchestrator that delegates implement/review/explore and does cross-vendor
review). URLs in Sources. **Confidence:** `documented`.

---

## 4. Minimal working patterns (copy-pasteable)

> All snippets target 0.4.0. They mirror `resources/examples/{debby,polly}` (the known-good shapes).
> Field names verified against `inner/loader.py` and `AGENT_YAML_SPEC.md@v0.4.0`. Not executed —
> validate with `python -c "from omnigent.spec import load; load(Path('…'))"` before relying on them.

### 4.1 The shared worker — DRY via `spawn` + `sys_session_create` (the wiki as a shared service)

Directory layout — the wiki is defined **once**, not copied:

```
fkit/
  fkit-wiki/            # canonical, single source of truth
    config.yaml
    skills/query/SKILL.md
  fkit-coder/
    config.yaml         # consults the wiki by spawning it — no nested copy
```

`fkit-coder/config.yaml` (each consumer looks like this):

```yaml
spec_version: 1
name: fkit-coder
spawn: true                     # <-- registers sys_session_create
executor:
  config: { harness: claude-sdk }
os_env:
  type: caller_process
  cwd: .
  sandbox: { type: linux_bwrap, write_paths: ["."] }   # coder may write code
prompt: |
  ... You have NO `wiki` tool. To consult the project wiki, spawn it and wait
  for the inbox:
    1) sys_session_create with config_path: "../fkit-wiki"   (or agent_id: "<registered wiki id>")
    2) sys_session_send to the returned conversation_id with your question
    3) END YOUR TURN; when woken, sys_read_inbox to read the answer, then continue.
  Do not poll or loop.
```

(`config_path` and `agent_id` per `runner/tool_dispatch.py:1828-1927`; `spawn` per
`spec/parser.py:210-216`.) **Requires the Omnigent server running.** If you prefer no server, use 4.3.

### 4.2 "Specialists that consult each other" — one orchestrator brokering (the idiomatic shape)

```
fkit/                       # the orchestrator bundle
  config.yaml               # tools.agents: [wiki, coder, architect, producer, reviewer, adversarial]
  agents/
    wiki/config.yaml
    coder/config.yaml
    architect/config.yaml
    producer/config.yaml
    reviewer/config.yaml
    adversarial/config.yaml
```

`fkit/config.yaml`:

```yaml
spec_version: 1
name: fkit
executor: { config: { harness: claude-sdk } }
async: true
os_env: { type: caller_process, cwd: ., sandbox: { type: none } }
guardrails:
  policies:
    blast_radius: { type: function, on: [tool_call],
      function: { path: omnigent.inner.nessie.policies.blast_radius,
                  arguments: { gate_pushes: false } } }
    spawn_bounds: { type: function,
      function: { path: omnigent.inner.nessie.policies.spawn_bounds,
                  arguments: { max_dispatches_per_turn: 6 } } }
prompt: |
  You are the fkit lead. You do the planning and route work. Specialists never
  talk to each other directly — YOU broker. When the coder needs the architect,
  it returns a request; you dispatch the architect via sys_session_send and feed
  the answer back. Every wiki lookup goes through you too.
  To consult a specialist: sys_session_send with `agent: "<name>"`, a short
  `title`, the question as the message; END YOUR TURN; collect with a single
  sys_read_inbox when woken. Never poll or loop.
tools:
  agents: [wiki, coder, architect, producer, reviewer, adversarial]
```

Each `agents/<name>/config.yaml` is a normal agent spec whose `name:` **must equal** the list entry
(e.g. `agents/wiki/config.yaml` has `name: wiki`) — the validator matches on `name:`, not the folder
(`spec/parser.py:239`, `spec/validator.py:425-432`).

### 4.3 A clean one-level nesting that needs no sharing — reviewer → adversarial

Because only the reviewer uses the adversarial reviewer, nest it directly (no DRY problem):

```
fkit-reviewer/
  config.yaml            # tools.agents: [adversarial]
  agents/
    adversarial/
      config.yaml        # name: adversarial ; executor.config.harness: codex
```

`fkit-reviewer/config.yaml` (excerpt):

```yaml
tools:
  agents: [adversarial]
prompt: |
  For a second opinion, sys_session_send agent: "adversarial", title: "<topic>",
  message: the diff + your draft review. End your turn; read sys_read_inbox when woken.
```

### 4.4 Path-restricted / review-only agent (structural, not prompt-only)

Review-only (no writes anywhere):

```yaml
name: fkit-reviewer
executor: { config: { harness: claude-sdk } }
os_env:
  type: caller_process
  cwd: .
  sandbox:
    type: linux_bwrap
    write_paths: []          # read-only filesystem (default is read-only; empty keeps it so)
    allow_network: false
```

Wiki writes only its vault:

```yaml
name: fkit-wiki
executor: { config: { harness: codex } }
os_env:
  type: caller_process
  cwd: .
  sandbox:
    type: linux_bwrap
    write_paths: ["ai-agents/wiki-vault"]   # only this subtree is writable
```

(Read-only default + `write_paths` opt-in: `inner/bwrap_sandbox.py:23,206,247`; `AGENT_YAML_SPEC.md`
"Local OS access". On macOS the default sandbox is `darwin_seatbelt` — omit `type` to get the right one
per platform.)

### 4.5 Handoff (control-transfer — *not* the wiki gateway)

```yaml
tools:
  escalate:
    type: handoff
    target_agent: fkit-architect   # registered agent name OR inline AgentDef
    pass_history: true             # default true
    bidirectional: true            # default true
```

Use only when you truly want to **hand the conversation over** (and optionally get it back), not for
"ask a question and keep working." Cross-agent runtime resolution of `target_agent` is **unverified** —
test before relying on it (`inner/tools.py:337-361`).

---

## 5. Docs ↔ code discrepancies & gotchas

1. **`config:` external-file reference doesn't exist — in code *or* current docs.** fkit's
   `type: agent, config: ../fkit-X/config.yaml` is silently ignored (`inner/loader.py:434-495`). The
   0.4.0 **and** `main` `AGENT_YAML_SPEC.md` document sub-agents as **inline-only** (`prompt`/`executor`
   inline) plus `spec: self` / `inherit`. Some third-party summaries claim you can "point to a separate
   YAML file, config path relative to the parent" — **that claim is not supported by the 0.4.0 code or
   the official spec doc.** Don't trust it.
2. **The `tools.agents` + `agents/<name>/` directory pattern is used by the shipped examples but is
   *undocumented* in `AGENT_YAML_SPEC.md`.** The spec doc only shows inline sub-agents; the file-based
   multi-agent pattern you must actually use lives only in the `debby`/`polly` examples. Documentation
   gap.
3. **Sub-agent name = `config.yaml` `name:`, not the folder name** (`spec/parser.py:239`). A mismatch
   between the folder, the `name:`, and the `tools.agents` entry produces the misleading F5 error
   "*no matching directory found under agents/*" even though a directory exists. Keep all three equal.
4. **Misleading blocking hint.** `_execute_session_create`'s docstring says it "does NOT block on the
   child turn — unlike named-mode send," implying `sys_session_send` blocks. In fact named-mode send
   returns a `launching` handle and results come via the inbox (`runner/tool_dispatch.py:1571-1584`).
   Both are async; treat the docstring as stale.
5. **F7 frontmatter trap (confirmed).** An unquoted `description:` containing `": "` breaks YAML and,
   because bundle skills load in **strict** mode, **aborts the entire agent** (`spec/parser.py:1963-1972`).
   No validator catches it pre-run. *Quote descriptions; add a CI `omnigent.spec.load` check.*
6. **`sandbox: type: none` disables enforcement.** It's a footgun for role boundaries: it doesn't mean
   "default sandbox," it means "no sandbox." fkit's six all use it, so none of their write restrictions
   are real.
7. **`gate_pushes: true` + headless = hang.** A headless agent can't answer an ASK; it parks up to
   `ask_timeout`. fkit's six use `gate_pushes: true`; for unattended runs flip to `false` (DENY set still
   applies) as debby/polly do.
8. **`skills: none` also disables CLAUDE.md** on claude-sdk (`inner/claude_sdk_executor.py:1040-1052`) —
   surprising coupling if you turn skills off to slim the prompt.
9. **Harness-mixing has known live bugs.** GitHub issue #575 reports a claude-native sub-agent under a
   claude-sdk parent being respawned as the parent's harness and dying. fkit runs `codex`-harness
   wiki/adversarial under `claude-sdk` parents — validate mixed-harness dispatch on your machine.

---

## 6. Compatibility & roadmap table

| Capability | Supported in 0.4.0? | Documented in 0.4.0? | Evidence |
| --- | --- | --- | --- |
| Inline `type: agent` sub-agent | **Yes** | **Yes** | `loader.py:434-495`; `AGENT_YAML_SPEC.md` |
| `tools.agents` + `agents/<name>/` nested dir | **Yes** | **No** (examples only) | `parser.py:2535-2564`; `validator.py:425-432`; debby/polly |
| `type: agent` + `config:` file reference | **No** (silently ignored) | No | `loader.py:434-495` (no `config` key) |
| `spec: self` (clone parent) | **Yes** | **Yes** | `loader.py:434-460`; `AGENT_YAML_SPEC.md` |
| `tools.<name>: inherit` | **Yes** | **Yes** | `loader.py:495-497`; `AGENT_YAML_SPEC.md` |
| Shared sub-agent across parents (nested) | **No** (copy-only) | No | `validator.py:425-432` |
| Shared agent via `spawn`/`sys_session_create` (agent_id/config_path) | **Yes** | Partial (example comment) | `tool_dispatch.py:1828-1927`; polly config |
| Send to existing session by id | **Yes** | Partial | `tool_dispatch.py:1244`, `_send_to_existing_session` |
| Blocking "call & return" sub-agent | **No** (async inbox only) | n/a | `tool_dispatch.py:1571-1584` |
| Sibling / parent / grandparent calls | **No** | No | `tool_dispatch.py:1262-1281` |
| `type: handoff` (control transfer) | **Yes** (schema); runtime cross-agent resolution unverified | table-only | `loader.py:510-516`; `tools.py:337-361` |
| Symlinked sub-agent (local run) | Likely yes (follows symlinks) | No | `parser.py:2557-2563` |
| Symlink in packaged/served bundle | **No** (rejected) | Implied | `tar_utils.py:114-134` |
| `blast_radius` / `gate_pushes` guardrail | **Yes** | Yes (POLICIES.md) | `nessie/policies.py:346-410` |
| Read-only / `write_paths`-scoped writes | **Yes** | **Yes** | `bwrap_sandbox.py:23,206,247`; `AGENT_YAML_SPEC.md` |
| Per-agent capability gating (`os_env`, `builtins`, `spawn`, `timers`) | **Yes** | Partial | `parser.py:200-222,365,413-444` |
| SKILL.md schema (`name`,`description`,`user-invocable`) | **Yes** | Partial | `parser.py:2003-2072` |
| `$ARGUMENTS` in skills | **No** | No | (not present in parser) |
| Pre-flight `validate`/`lint` CLI | **No** | No | `cli.py` (no such command) |
| Programmatic validation (`omnigent.spec.load/validate`) | **Yes** | Partial | `spec/__init__.py:84-89` |
| Server REST API (create/read/drive sessions) | **Yes** | Yes (API docs) | `server/routes/sessions.py`; `tool_dispatch.py` |
| CLI JSON/structured print-mode (`run --json`) | **Not found** | No | `cli.py` (no flag located) |
| Per-agent model/harness (`executor.harness/model`) | **Yes** | **Yes** | `AGENT_YAML_SPEC.md`; `loader.py` |
| Cross-agent shared instructions (`extends`/`base`) | **No** | No | `parser.py:225-231` |
| `instructions: <file>` (path, replaces prompt) | **Yes** | **Yes** | `parser.py:225-231`; `AGENT_YAML_SPEC.md` |
| `CLAUDE.md`/`AGENTS.md` harness auto-discovery | **Yes** (harness-dependent) | Partial | `claude_sdk_executor.py:1034,1954` |
| Session persistence / `resume` / `attach` | **Yes** | Yes | `cli.py`; `tool_dispatch.py:201-228` |
| Agent registry / package-manager distribution | **No** (dir/tarball only) | No | `tar_utils.py`; `spec/__init__.py` |
| `spec_version` current value | **1** | Yes | `parser.py:142`; `types.py:1486` |

---

## 7. Open questions (and what would settle each)

1. **Does `sys_session_create` use exactly `agent_id` / `config_path` as the LLM-facing arg names, and
   does `config_path: "../fkit-wiki"` resolve from the caller's os_env cwd?** — Settled by one live
   `spawn: true` run with a `sys_session_create` call (read the tool schema the model sees, or the
   server 4xx). Source strongly implies yes (`tool_dispatch.py:1828-1927`).
2. **Can `handoff.target_agent` name a *separately-started* agent at runtime (peer reference), or only a
   nested/inline one?** — The loader stores the name; resolution is in the executor layer I didn't fully
   trace. Settled by a 2-agent handoff test or by reading the openai-agents SDK executor's handoff
   resolution.
3. **Does `omnigent run -p` pump async inbox waves to completion and print the final synthesis, or
   return after the root's first turn?** — Settled by `omnigent run <orchestrator> -p "…"` against a
   2-worker bundle and checking whether both workers' results appear. If not, drive via the REST API.
4. **Exact CLAUDE.md/AGENTS.md scope & precedence per harness (cwd vs project vs user; merge with
   `instructions:`).** — Settled by `omnigent.ai/docs` (Harnesses) or a probe run that drops a sentinel
   line in a project `CLAUDE.md`/`AGENTS.md` and inspects the child's system prompt.
5. **Is there a first-class embeddable Python SDK or a `run --json` mode beyond the REST API?** — Settled
   by the `omnigent.ai/docs` API reference / `omnigent run --help`.
6. **Is a shared/referenced-agent feature or an agent registry on the roadmap?** — Settled by the GitHub
   Issues/Discussions and release notes (none found in what I could read; the `main` spec doc is still
   inline-only, suggesting it's not imminent).

---

### Sources

Primary (0.4.0 source, read from the PyPI wheel `omnigent-0.4.0-py3-none-any.whl`): `omnigent/inner/loader.py`,
`omnigent/inner/tools.py`, `omnigent/inner/nessie/policies.py`, `omnigent/inner/claude_sdk_executor.py`,
`omnigent/inner/bwrap_sandbox.py`, `omnigent/inner/seatbelt_sandbox.py`, `omnigent/spec/parser.py`,
`omnigent/spec/validator.py`, `omnigent/spec/types.py`, `omnigent/spec/tar_utils.py`, `omnigent/spec/__init__.py`,
`omnigent/runner/tool_dispatch.py`, `omnigent/runner/_entry.py`, `omnigent/cli.py`,
`omnigent/resources/examples/debby/…`, `omnigent/resources/examples/polly/…`.

Docs & references:
- [AGENT_YAML_SPEC.md @ v0.4.0](https://raw.githubusercontent.com/omnigent-ai/omnigent/v0.4.0/docs/AGENT_YAML_SPEC.md)
- [AGENT_YAML_SPEC.md @ main](https://github.com/omnigent-ai/omnigent/blob/main/docs/AGENT_YAML_SPEC.md)
- [CHANGELOG.md @ v0.4.0](https://raw.githubusercontent.com/omnigent-ai/omnigent/v0.4.0/CHANGELOG.md)
- [Omnigent — Custom Agents](https://omnigent.ai/docs/use/custom-agents) · [MCP & Tools](https://omnigent.ai/docs/build/tools) · [Built-in Agents](https://omnigent.ai/docs/use/builtin-agents) · [Harnesses](https://omnigent.ai/docs/build/harnesses)
- [GitHub: omnigent-ai/omnigent](https://github.com/omnigent-ai/omnigent) · [Issues](https://github.com/omnigent-ai/omnigent/issues) · [Issue #575 (harness re-derivation bug)](https://github.com/omnigent-ai/omnigent/issues/575) · [Releases](https://github.com/omnigent-ai/omnigent/releases)
- [PyPI: omnigent](https://pypi.org/project/omnigent/)
- [Databricks blog: Introducing Omnigent](https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents)

fkit configs read for grounding: `omnigent/fkit-{producer,coder,reviewer,adversarial-reviewer,architect,wiki}/config.yaml`
(all six wire consultation via the unsupported `type: agent` + `config: ../…` form and set `sandbox: type: none`).
