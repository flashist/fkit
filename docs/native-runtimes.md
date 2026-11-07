# Native fkit in Berd and Buzz

The native integration runs seven fkit personas on the models selected in the app.
It requires Node.js and a POSIX shell for setup, plus bash for the shipped skill helpers.
Claude Code and the Codex CLI are not required. The existing Claude launcher remains available.

## Choose models during setup

The first setup in an interactive terminal asks for the runtime and model. Reconfigure later with
`--configure`; scripts can pass the same choices explicitly:

```sh
fkit berd --configure
fkit berd --runtime codex --model gpt-6.1-sol
fkit buzz --runtime codex --model gpt-6.1-sol
```

Main runtime choices are `goose`, `codex`, and `claude`. `--provider` selects the model provider
when using Goose. The adversarial reviewer inherits the main choice unless you supply
`--adversarial-runtime`, `--adversarial-model`, or `--adversarial-provider`. Use model IDs offered
by the selected runtime, not display labels. Berd imports for Codex/Claude require a model ID
so their portable `model: "harness:model-id"` field selects the intended harness.

Choices persist per project in `.fkit/native/manifest.json`; repeating setup without model flags
keeps them. `--check` uses the saved choices without prompting. `--model -` restores the app
default where supported; adversarial options accept `inherit`. Setup stores no credentials.
Changing disk artifacts does not update already-imported personas or running chats automatically.

The current owner setup uses Codex with GPT-6.1 Sol for every role. This is supported, with
explicitly incomplete same-model review; choose a different adversarial family during setup
when independent review is wanted. A different runtime or model name alone does not prove diversity.

Native role/skill boundaries and plan approval are **prompt rules**. Claude's enforcement hooks
are not installed in Goose sessions. The port does not claim a structural skill lock, a plan-mode
write wall, or a read-only reviewer sandbox. Native independent review requires an actual,
usable pass from a verified different model family; unknown or same-family provenance produces
`⚠️ [NOT model-diverse — INCOMPLETE]` before findings and prevents automatic closure.

## 1. Berd

From an installed version containing the native port:

```sh
cd /path/to/project
fkit berd
```

From this checkout, before publishing or installing the change:

```sh
node /path/to/fkit/bin/fkit-native.mjs berd /path/to/project
# or, from fkit's root:
npm run setup:berd -- /path/to/project
```

Import the seven `.persona.md` files under `.fkit/native/berd/` individually from Berd's **Agents**
page. Open the same folder as a **Berd project**, then select `fkit-lead`. For an uninitiated
project, start with `fkit-producer` and request `fkit-initiate-project`. The backend can discover
project-local `.agents/agents/*.md`, but the current app's persona picker requests global sources;
putting files in a project alone does not register them in that picker. The runtime discovers the
project's `.agents/skills/*/SKILL.md`. Reload the project after changing resources.

Give the lead a goal. Its native delegation uses the actual persona IDs returned by
`berdctl agent list --json`, and `berdctl session create` with the same project and explicit
`--harness-id` / `--model-id` values from `berdctl info harnesses` / `berdctl info models`.
Supplying a persona ID alone leaves the CLI on its default Goose harness; it does not inherit
the parent's Codex selection. Creation starts work; it is not a finished result. Record the returned
session ID, or recover a unique match with one scoped list lookup if the response omits it, then
verify persona, harness, model and project with `session get`. A prose role claim in an older chat
is insufficient: the live check found an older producer-labelled chat with null persona metadata.
Start a fresh session with the explicit persona and attached project. Workers return results to the parent session and
persist full authorized artifacts; CLI message previews can truncate. Installed command help is
authoritative. A native deployment without session delegation must report `NEEDS-ROLE`, not have
the lead pretend to be the coder or reviewer.

## 2. Buzz

After preparing and checking Berd, prepare Buzz for the same checkout:

```sh
node /path/to/fkit/bin/fkit-native.mjs buzz /path/to/project
# installed command: fkit buzz
```

In Buzz, use **Agent teams → Import** and select `.fkit/native/fkit.team.json` in that project.
It is a `buzz-team-snapshot` v1 containing seven `buzz-agent-snapshot` v1 members, no memory,
no keys, no endpoints, and no machine-specific commands. Buzz creates fresh identities at import.
The snapshot carries the runtime/model choices made during setup; without explicit choices it
defaults to Goose and leaves the model to the app. Each member can be adjusted in Buzz afterward.

Identify the owner and give every worker the same explicit prepared checkout path. Buzz normally
starts managed workers in its shared `~/.buzz` nest; preparing project files does not change that
launch directory. Put the project path in the channel description and require project commands to
use it as their working directory (or explicitly `cd` there). Resolve skill and artifact paths under
that checkout, and verify access with a bounded read-only check. This is an instruction binding,
not a filesystem sandbox or an automatic project mount. Do not create another `ai-agents/` tree in
the nest.
The current setup uses Codex for all roles and flags review as incomplete. To obtain independent
review later, select a different model family for `fkit-adversarial-reviewer`; a different persona
name is not model diversity. Snapshots do not bundle skills, so each worker must use the prepared
checkout's `.agents/skills/`. A remote worker needs that prepared checkout there,
not just a snapshot imported on the owner's laptop.

The `owner-only` policy accepts the identified owner and verified agents belonging to that same
owner. The live lead → producer → lead handoff worked without broadening it. Keep that policy
for this team. Extra allowlists are needed only for deliberately authorized external identities;
never switch to `anyone` to make a failed handoff work. Imported identities are fresh, so resolve
them from the actual roster. Teammates cannot approve the owner's plans. Native colleagues use
the installed Buzz agent/task tools or project channel and verify the responding identity and
request before advancing.

Publish answers, questions and worker results with the installed `buzz messages send` command or
the actual native messaging tool, using the current context's reply destination. Ordinary final
assistant text stays internal. A connection check must permit its reply command even when project
and file work are prohibited.

The adversarial reviewer uses `sessionPolicy: thread`; other roles retain channel-scoped sessions.
Start every adversarial pass in a new top-level channel thread, including later review rounds, and
verify its fresh native session identity. Replies inside an old thread reuse that context; direct
messages stay conversation-scoped. Older imports used channel scoping for all seven roles: update
the adversarial reviewer's session setting and instructions in Buzz deliberately. Re-running disk
setup does not update the imported agent.

Buzz's persona-pack format is **not** the desktop import format. Its current pack loader can
validate/inspect packs but does not deploy them directly into the desktop runtime. This port
therefore generates a desktop team snapshot and installs the skill files separately.

### Codex compatibility in Buzz v0.5.28

The installed Buzz bridge requests ACP protocol version 2. Adapter 2.5.0 rejects that initialize
request with `Invalid params`, although a standalone protocol-1 probe can succeed. Adapter 1.10.0
accepts Buzz's request and negotiates protocol 1:

```sh
npm install -g @agentclientprotocol/codex-acp@1.10.0
```

For a newer model, use a working standalone Codex CLI through `CODEX_PATH`. In **Agents → Agent
defaults → Advanced → Environment variables**, set `CODEX_PATH` to the executable reported by
`command -v codex`. This leaves global Codex settings and login unchanged. The owner setup uses
Codex 0.167.0 with GPT-6.1 Sol. Do not infer desktop compatibility from a sidecar-only probe.

## Files and updates

### Berd's bundled Codex and newer models

Berd v0.6.4 bundles ACP adapter 1.10.0 with Codex 0.153.4. A newer model selected in the
user's Codex configuration can fail with missing model metadata and `model_not_found` in that
older runtime even when the standalone Codex CLI works. Verify the same model in an empty
standalone session first. The adapter supports `CODEX_PATH` to select a different executable:

```sh
export CODEX_PATH="$(command -v codex)"
```

Berd captures the user's interactive shell environment on startup. Put the override after
Codex is available on PATH in the shell startup file, then quit and reopen Berd. Keep an existing
intentional `CODEX_PATH` setting unless it is the one being changed. This selects the working CLI
without changing its model, login, app permissions, or signed Berd bundle. The local setup used
a marked block in `.zshrc`; remove that block to revert. No API key is stored in the override.

This is a workaround for the older bundled runtime, not a requirement for all native users.
The actual Berd adapter was tested with Codex 0.167.0 and GPT-6.1 Sol, including a successful
text-only response in the desktop app.

| Path | Purpose |
|---|---|
| `.agents/agents/fkit-*.md` | Seven native persona instructions |
| `.agents/skills/fkit-*/` | All 28 procedures and their supporting executables |
| `.agents/fkit-runtime/` | Native contract, ownership map, and local reference share for heal |
| `.agents/fkit-runtime/settings.json` | Requested main/adversarial runtime and model choices |
| `ai-agents/`, root context files | Create-if-absent project scaffolding |
| `.fkit/native/manifest.json` | Generated-file hashes for safe repeat setup |
| `.fkit/native/berd/*.persona.md` | Berd's individual import files |
| `.fkit/native/fkit.team.json` | Buzz's desktop team import file |

Existing project artifacts and context files are preserved. `.fkit-keep-out` entries are honored;
`.gitkeep` is not recreated inside an existing directory. Setup refuses symlinks, wrong types,
unowned collisions, and edited generated files. A repeat run updates only generated files whose
bytes still match the prior manifest. Resolve any reported edits yourself before retrying; there
is no force-overwrite option. Setup never moves, deletes, closes, commits, or pushes project work.

For a read-only comparison against the current fkit resources:

```sh
node /path/to/fkit/bin/fkit-native.mjs berd /path/to/project --check
node /path/to/fkit/bin/fkit-native.mjs buzz /path/to/project --check
```

Exit 0 means the generated files and required seeds are present/current; exit 1 means drift,
missing files, or a refusal. It does **not** prove app import, delegation, model availability,
owner approval, or review diversity. Re-running setup updates disk files, not already-imported
Buzz agents; re-import or update their prompts deliberately in the app.

## Implementation and evidence

`bin/fkit-native.mjs` renders `native/roles/` plus `native/runtime.md`, using the existing
`claude/skills-for-role.sh` ownership map. Most procedures retain their full existing content,
bound to native tools and `.agents/` paths. Planning, review, adversarial review and the team
roster have explicit native bindings. The ledger schema, role ownership, task IDs, movers,
agent-closed marker, and knowledge-base layout remain shared. Heal uses a project-local
reference share, so it does not require a global Claude installation.

Format and API research used these upstream revisions on 2026-11-07:

- Berd `a6b03407735bc2156a70c901d44a87f31e91c8e5`:
  [agent format](https://github.com/block/berd/blob/a6b03407735bc2156a70c901d44a87f31e91c8e5/distro/skills/agent-builder/SKILL.md),
  [persona importer](https://github.com/block/berd/blob/a6b03407735bc2156a70c901d44a87f31e91c8e5/src/shared/api/agents.ts),
  [session creation](https://github.com/block/berd/blob/a6b03407735bc2156a70c901d44a87f31e91c8e5/src/features/berdctl/commands/impl/createSession.ts).
- Berd's pinned Goose `361003ea3263587f4241a0f906affdcc0d5c9c1f`:
  [agent/skill source discovery](https://github.com/aaif-goose/goose/blob/361003ea3263587f4241a0f906affdcc0d5c9c1f/crates/goose/src/sources.rs).
- Buzz `12f3d510011b1c57c1f51f9aaa25a307fa0bb883`:
  [desktop team schema](https://github.com/block/buzz/blob/12f3d510011b1c57c1f51f9aaa25a307fa0bb883/desktop/src-tauri/src/managed_agents/team_snapshot.rs),
  [agent schema](https://github.com/block/buzz/blob/12f3d510011b1c57c1f51f9aaa25a307fa0bb883/desktop/src-tauri/src/managed_agents/agent_snapshot.rs),
  [owner and sibling instruction gate](https://github.com/block/buzz/blob/12f3d510011b1c57c1f51f9aaa25a307fa0bb883/crates/buzz-acp/src/lib.rs),
  [reply publication contract](https://github.com/block/buzz/blob/12f3d510011b1c57c1f51f9aaa25a307fa0bb883/crates/buzz-acp/src/base_prompt.md),
  [pack/deployment limits](https://github.com/block/buzz/blob/12f3d510011b1c57c1f51f9aaa25a307fa0bb883/crates/buzz-persona/PERSONA_PACK_SPEC.md#desktop-app-import).

File preparation and model-free validation do not constitute a complete live smoke test. Before
declaring the port verified, check in each app: discovery/import, owner identity, shared checkout
and helper access, producer briefing, architect survey, approved coder build, independent review
with model evidence, wiki-role write, and producer-only closure with the required marker.

Tests in this repository run only on explicit request. No new permanent tests accompany this port.
