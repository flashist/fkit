# FKit for OpenCode

Requires Node.js, Bash (shared skill helpers), POSIX shell and OpenCode **v2** (configuration discovery inspected with v2.2.6).
Use your own OpenCode provider authentication and model configuration. No Claude or Codex CLI needed.

```sh
cd /path/to/project
sh /path/to/fkit/opencode/fkit-opencode.sh init
opencode
# Or launch the selected role in OpenCode mini:
sh /path/to/fkit/opencode/fkit-opencode.sh coder
```

OpenCode preview releases (starting at `0.3.3-opencode.1`) use `X.Y.Z-opencode.N` and are opt-in, on the `fkit-open-code` channel.
Install that channel with:

```sh
curl -fsSL https://raw.githubusercontent.com/flashist/fkit/fkit-open-code/install.sh | FKIT_REF=fkit-open-code sh
```

This switches that installation to previews; `fkit update` stays on the recorded preview branch.
The normal installer continues using stable `main`.

Installed usage: `fkit opencode [role]`. `FKIT_RUNTIME=opencode fkit [role]` selects this runtime
by default. `fkit opencode board` opens the shared read-only board. `fkit update` remains the
existing installer update command; do not pass it as an OpenCode role.

Setup generates seven native agent profiles in `.opencode/agents/`, lazy-loaded skills with their
supporting scripts in `.opencode/skills/`, and slash commands in `.opencode/commands/`. Commands
keep the current role: owned procedures run in the current session; cross-role requests delegate
to the named owner through the native subagent tool. This keeps interactive approval gates in
a primary role session and preserves separate review contexts. The lead remains the owner-facing conductor;
workers return NEEDS-DECISION and the primary asks with OpenCode's question tool. Direct role sessions
use mini's `--agent` because the current full TUI has no agent CLI flag.

A new project receives the shared `ai-agents/` scaffold. Existing knowledge, AGENTS.md and OpenCode
configuration files are preserved. Setup refreshes FKit-named profiles/procedures; edit the canonical
`opencode/` sources instead of generated copies. Existing `ai-agents/` trees are not converged or
repaired at launch. A missing PROJECT.md or its placeholder triggers producer onboarding when the
lead starts. The producer interviews in the live session; no shell intake is required.

The default project config is created at `.opencode/opencode.json` only when the project has
no root or .opencode JSON/JSONC configuration. The launcher adds
`.opencode/fkit.json` through OPENCODE_CONFIG unless that variable already selects your own file.
An existing OPENCODE_CONFIG is preserved. In a project with custom configuration, ensure
`experimental.subagent_depth` is at least 3 for lead → coder → reviewer → adversarial-reviewer;
select fkit-lead in your own config if you want plain `opencode` to start there. User configuration
and managed policy can override FKit defaults. No provider credentials are generated or copied. You can also set per-agent models through native
OpenCode configuration, for example `agents.fkit-adversarial-reviewer.model`; unset the environment
override when using your own per-agent setting. `--no-plan-review` skips only the independent plan
review for that launch; `--plan-review` explicitly keeps it on. Do not combine those flags.
Option values and arguments after `--` are passed through unchanged; the owner approval gate and implementation review remain mandatory.

Role → skill ownership comes from `claude/skills-for-role.sh`, shared by both runtimes. OpenCode
permissions enforce skill ownership per child and block leaf delegation. The coder may edit source;
other roles have artifact-specific edit grants. Only wiki may edit the vault. Shell commands ask
for approval and can bypass edit-tool restrictions if approved: this is not an OS write sandbox.
Owner approval before implementation is a prompt rule; Claude plan-mode and completion hooks do
not run in OpenCode. No instruction or review verdict authorizes commits or pushes.

Reviews use a native hostile child, not a shell bridge. Configure a separate model when setting up:

```sh
FKIT_OPENCODE_ADVERSARIAL_MODEL=provider/model fkit opencode init
```

Repeat the variable on subsequent launches (setup refreshes the profile). Without it the child
inherits its parent's model. The review helper inspects the child and parent native assistant-message model records before claiming
model diversity, and otherwise prominently flags partial coverage. For a private/remote server, set FKIT_OPENCODE_SERVER for evidence inspection;
an unavailable session record stays partial. Provider aliases require scrutiny: distinct runtime IDs
do not establish that two custom aliases use different upstream models. The hostile child has no shell or edit
permission, so its normal coverage is reasoning-only. Partial reviews and incomplete required
verification never authorize automatic closure. Only producer runs lifecycle movers, preserving
`(agent-closed — not owner-verified)`.

Most playbooks and scripts are adapted from `claude/skills/`; OpenCode-specific planning, team,
review and ship-loop playbooks in `opencode/skills/` override those copies. Existing stateful ledger
formatting remains shared. Heal uses the shared checker/repair engine with a native scaffold snapshot and hash manifest.
It checks AGENTS.md and ai-agents/, never requires CLAUDE.md, preserves keep-outs, and repairs only
untouched-stale files after explicit approval and apply-time rechecks. Wiki repairs stay wiki-owned.
Generated OpenCode profiles are refreshed by setup, rather than by heal. Run
`npm run generate:manifest` after changing native scaffold adaptations; prior hashes are retained. Native skill discovery and command routing are OpenCode responsibilities.

Verification (2026-11-11): native profiles, 28 skills and 28 commands were discovered by OpenCode
v2.2.6. Owner-approved manual checks cover installed setup, project/config preservation, launcher
arguments, symlink refusal, native scaffold repair and model evidence. Live fixtures verified
lead → coder → reviewer → hostile nesting, actual model identities, native skill denial, and a
same-role slash command with a native question/reply round trip. Project artifacts stayed unchanged.
A provider-quota failure correctly produced a partial review and withheld closure.

Tests remain manual: `npm run test:opencode` runs the focused contracts when authorized. No startup
hook, CI trigger, schedule or release default was enabled. Registry loading is asynchronous, and
headless runs cannot answer optional service-activation prompts; the bounded verification fixture
turned off Web Search. See [verification evidence and limits](VERIFICATION.md).

Official runtime references: [agents](https://opencode.ai/docs/agents/),
[skills](https://opencode.ai/docs/skills/), [commands](https://opencode.ai/docs/commands/),
[permissions](https://opencode.ai/docs/permissions/) and [configuration](https://opencode.ai/docs/config/).
