# fkit for Hermes Agent

fkit gives a software project a lead and six specialist roles. Start with the lead to take work from brief through implementation, independent review and closure. The team shares task folders, sprint boards, review ledgers and a project wiki under `ai-agents/`.

## Install from this checkout

Use a Hermes Agent build with delegation-provider plugins and per-task profile routes. Configure your preferred provider in Hermes first. fkit requires Python 3.9+, Bash, Git and Node.js. The independent review requires a signed-in Codex CLI.

```sh
FKIT_SOURCE="$PWD" sh install.sh
export PATH="$HOME/.local/bin:$PATH"
fkit setup
cd /path/to/project
fkit
```

To keep another installation of fkit on your PATH, run this checkout's `bin/fkit` by absolute path instead. `FKIT_BIN` and `FKIT_SHARE` select custom install directories. `fkit update` refreshes an installation from its recorded source. `HERMES_BIN` selects the Hermes executable.

On first launch the producer interviews you, consults the architect and prepares the project brief. After initiation, the lead takes over. In an initialized project, Enter in the role menu selects the lead. Use `fkit init` to scaffold a project without starting a model session.

Hermes asks for one-time permission when the producer fills in the overview in the protected `AGENTS.md`. Use an interactive terminal for this step. A headless run can still write the brief and architecture and report the pending overview.

## Work with the team

| Command | Responsibility |
| --- | --- |
| `fkit lead` | Route questions, coordinate specialists, run a sprint with `/fkit-sprint-ship-loop` |
| `fkit producer` | Create briefs, prioritize, report status and close tasks or sprints |
| `fkit coder` | Plan changes, seek approval, implement and process review findings |
| `fkit architect` | Survey the code, assess designs and record architecture decisions |
| `fkit reviewer` | Review changes, run the Codex pass and maintain the findings ledger |
| `fkit adversarial-reviewer` | Challenge a plan or diff using read-only Codex and return findings |
| `fkit wiki` | Ingest, lint and synchronize the project wiki |

Try `/fkit-team` for the roster or `/fkit-query` to look up a decision. From the shell, `fkit lead "Summarize the active sprint"` starts with a prompt. `fkit board` opens the read-only board server. [Board guide](docs/board.md)

Each role has its own Hermes profile, SOUL.md and skill catalog. The lead uses native `delegate_task` with an explicit `fkit_role`. Hermes owns child sessions and returns results to the parent. The fkit plugin enforces ownership on skill tool calls and checks a relayed plan against its recorded Git blob. The agent asks owner questions with Hermes `clarify`. Plan approval and the final “What's next?” check are instructions to the model. Project files persist across sessions, including when the owner switches profiles. [Hermes delegation](https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation)

Coders review plans by default. `fkit coder --no-plan-review` turns off the second opinion on plans for that session. Owner approval still precedes implementation. Only the producer runs the four closure procedures. An agent-closed item carries the marker `(agent-closed — not owner-verified)`. Only the wiki role edits wiki pages. Roles with shell access share the project filesystem.

## Models and existing projects

`fkit setup` installs seven profiles under the Hermes root's `profiles/` directory. New profiles take their initial model and provider from the active Hermes configuration. Use `hermes -p fkit-reviewer model` (or the corresponding role) to change a profile. For custom provider definitions or profile-scoped API keys, configure that route and its credentials in each profile that uses it. Hermes handles supported shared OAuth logins. To resume, run `hermes -p fkit-lead chat --in "$PWD" --continue`. [Hermes profiles](https://hermes-agent.nousresearch.com/docs/user-guide/profiles)

Choose distinct models for coding and independent review. The reviewer flags partial coverage if Codex is unavailable, the models overlap or diversity cannot be confirmed. Refreshing fkit updates its role instructions, skills and plugin files. Plugin updates request a profile-scoped gateway reload. If the gateway reports a problem, use `hermes -p fkit-lead fkit-reload` for the affected role. Your profile configuration, credentials and sessions stay under Hermes management.

Run `fkit init` in an existing project to reuse its `ai-agents/` records. Setup adds missing scaffold paths, honors `ai-agents/.fkit-keep-out` and updates the fkit-managed rules block in `AGENTS.md`. Owner text around that block is preserved. The repository's `hermes/` directory contains the active roles, skill procedures and delegation plugin. Shared scaffold and reporting helpers live under `claude/`.

## Verification

Verification is on demand. The repository workflows are manually dispatched. The port adds no recurring tests.

[MIT license](LICENSE)
