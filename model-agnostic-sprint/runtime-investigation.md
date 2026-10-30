# Runtime investigation — initial evidence

Status: preliminary; not a claim of Codex/Claude parity. Verify all capabilities on the installed version and document version-dependent limits before design approval.

| Concern | Existing fkit behavior and evidence | Codex investigation |
| --- | --- | --- |
| Launch and selection | `claude/fkit-claude.sh` launches `claude --agent` with generated role settings; `install.sh` ships the Claude tree. Fresh setup runs producer first. | Installed `codex-cli 0.165.0` reports `--model` for interactive and `exec` modes. Verify safe role-specific instruction injection and clean context in both modes. |
| Roles and delegation | `claude/agents/` has seven definitions, including a distinct adversarial reviewer. Lead delegates using the Claude Agent tool. Consult topology is advisory (`architecture.md` §5.3). | Test role-specific subagent configuration, nested calls, per-role models, context isolation, and interactive owner relay; do not infer from names alone. |
| Skill ownership | `claude/skills-for-role.sh` and `claude/skill-ownership-hook.sh` enforce allowed skills by invoking role, including consults (ADR-018). | Determine whether skill invocation has an enforceable interception point and caller identity. If not, test an alternative controlled dispatcher or isolation, including bypass paths; document residual limits. |
| Other hooks | Launcher generates hooks; `turn-completion-hook.sh`, `askuserquestion-marker-hook.sh`, `shiploop-marker-hook.sh` and `carry-check-hook.sh` carry separate contracts. ADR-030 records the turn-completion hook as built; the architecture document's claim it is not built is stale. | Inventory each event, purpose, fail-open/closed behavior and identity requirement. Verify event support and failure semantics empirically. |
| Review | `fkit-review` calls `codex exec --sandbox read-only`; degraded reports are explicit. `fkit-adversarial-review` is already a separate role but currently assumes a Claude-to-Codex pairing. | Design a fresh independent adversarial pass even in single-model mode; report model diversity accurately and consider unavailable or failed runs separately. Validate actual sandbox scope, not just a flag. |
| Owner questions | Session and consult have different question/relay contracts (ADR-021, ADR-032). | Check interactive sessions and spawned workers separately, including no answer, interruption and relay without guessing. |
| Project state | ADR-015 protects `ai-agents/` from unattended destructive migration; `.fkit/` is ignored local state. Init also refreshes managed `.claude/` copies. | Design local-first configuration and isolation so experimentation does not alter other users' launch paths; decide later which shared settings survive clone and how overrides interact. |
| Tests | Existing launcher, hook, convergence, structure and release tests under `test/` exercise contracts; ADR-057 constrains test policy. | Map existing tests to user-visible contracts, add evidence-led runtime tests under the applicable policy, and separately record manual live checks. |

## Investigation order

1. Read current official Codex documentation and inspect local CLI version and help; capture exact versions and sources.
2. Map all Claude dependencies and each role's workflows, owner gates, skill ownership and hooks to a capability matrix.
3. Run minimal isolated experiments in a temporary project for role routing, model overrides, subagent isolation, skill and tool restrictions, user questions, and read-only review. Record inputs, outputs and limitations without secrets.
4. Compare native Codex features with a small fkit-controlled adapter/dispatcher and any other viable approaches. Rate enforcement, bypasses, cost, UX and maintainability; do not represent advisory controls as security boundaries.
5. Present recommendations and unresolved tradeoffs, then produce dependency-ordered tasks and acceptance criteria. Claude compatibility follows the local stage and requires separate validation.

## Documentation leads

The current OpenAI manual describes [custom subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents.md) with role-specific instructions and model settings, but says subagents inherit parent permissions and provider. It also describes disabling individual skills. Its [hooks documentation](https://learn.chatgpt.com/docs/hooks.md) lists PreToolUse, Stop and subagent events, and says non-managed hooks require trust. These are promising leads, not proof that skill ownership or per-role sandboxing can be enforced in this CLI; check the applicable surface and actual installed version. In particular, a skipped untrusted hook must not be mistaken for enforcement.

The same hooks documentation says tool interception is not a complete enforcement boundary: some tool paths opt out. `SubagentStart` carries agent type and ID, but the listed `PreToolUse`-specific fields do not include them; inspect common fields and test correlation rather than assuming Claude's identity-based hook can be copied. The manual says untrusted hooks are skipped, so a launcher relying on them must detect or account for that condition. These descriptions still need validation against the local CLI.

Local probe: `codex-cli 0.165.0`, isolated temporary directory, `codex exec` with read-only sandbox and a trivial prompt returned the expected reply and exit 0. Initial execution inside the workspace sandbox failed to initialize; the successful probe used an approved escalated execution. It verifies only basic execution. More experiments and detailed primary-source verification remain outstanding.

Hook discovery probe: in a disposable directory, a project `hooks.json` registered a `PreToolUse` Bash denial. The requested `pwd` ran rather than being denied, including after passing a one-run project trust override, adding an empty project config file, and initializing a temporary Git repository. The cause is not established. A production design must not silently assume a hook is active.

Hook enforcement probe: supplying the same vetted hook directly through `-c hooks.PreToolUse=...` caused Codex to report `PreToolUse Blocked`; the requested `pwd` did not run and the model reported the denial. Exit 0 was a successful probe result, not evidence that the denied command executed. Both probes used one-run hook trust bypass for this known script, so they do not establish the normal trust UX. This demonstrates a working interception/denial primitive, but not caller identity, skill coverage or nested role enforcement.

The official web search failed; the documentation leads come from the OpenAI Docs manual helper. CLI help establishes available flags, not behavior or parity.
