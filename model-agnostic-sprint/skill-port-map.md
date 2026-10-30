# Skill and payload map

Inventory: 28 canonical `claude/skills/*/SKILL.md` files, counted during this investigation. Ownership comes from `claude/skills-for-role.sh`. This map groups work; it does not replace that registry.

| Group | Skills | Main port concerns |
| --- | --- | --- |
| All roles | `fkit-team`, `fkit-query` | Runtime-neutral roster and invocation instructions; preserve query's read-only wiki and staleness behavior. |
| Six ordinary roles | `fkit-open-questions-interview`, `fkit-dumb-down` | Replace Claude-only ownership wording; bind interactive question/relay behavior to the runtime. Adversarial role does not gain these implicitly. |
| Producer: setup and coordination | `fkit-initiate-project`, `fkit-task-brief`, `fkit-status`, `fkit-heal` | Intake, cross-role calls, structure spec/manifest, script paths, owner questions and file preservation. |
| Producer: terminal state | `fkit-task-done`, `fkit-task-cancelled`, `fkit-sprint-done`, `fkit-sprint-cancelled` | Preserve producer-only invocation, folder/board consistency, consent and agent-closed marker. No direct moves by a porting script. |
| Architect | `fkit-survey-project`, `fkit-inspect`, `fkit-design-spec`, `fkit-evaluate-approach`, `fkit-record-decision` | Tool names and consult binding; preserve survey/decision responsibilities, evidence and amendment conventions. |
| Coder | `fkit-plan-task`, `fkit-process-review`, `fkit-process-stateful-review`, `fkit-task-ship-loop` | Plan mode semantics need re-evaluation; owner gates, plan-review switch, ledger dispositions and producer handoff. |
| Reviewer | `fkit-review`, `fkit-stateful-review` | Hard-coded Codex second-pass invocation; model/coverage labels, ledger header and findings ownership, sandbox and unique scope prompts. |
| Adversarial | `fkit-adversarial-review` | Remove the assumption it starts in Claude; avoid recursive wrapping; fresh role context, configured model and findings-only output. |
| Wiki | `fkit-wiki-ingest`, `fkit-wiki-lint`, `fkit-wiki-sync` | Preserve exclusive wiki writes and schema/watermark behavior; validate quality when using smaller models. |
| Lead | `fkit-sprint-ship-loop` | Native delegation binding, fresh role identity, live owner relay, approved plan carry, stop/recovery behavior and producer-only close. |

Executable payloads currently shipped inside skills: status `dashboard.sh` and `throughput.mjs`; heal `check.sh` and `repair.sh`. Retain their dependencies, referenced resources and path containment. The board reader also finds status's payload through the canonical/managed Claude locations; a later directory extraction must update this discovery with the packaging change.

Additional coupling: root `CLAUDE.md`/`AGENTS.md`, scaffold context files and universal rules; `claude/README.md`; `structure-spec.md` and `structure-manifest.tsv`; installer and self-host launcher; release validation and relevant test fixtures. Audit active content for `Agent`, `Task`, `Skill`, `AskUserQuestion`, `EnterPlanMode`, `Write`, `Edit`, `$ARGUMENTS`, `/fkit-*`, `@fkit-*` and `.claude/` references. Many are behavioral bindings, not safe global string replacements.

Known related backlog work includes sandbox 0273 (and wiki follow-up 0287), ownership refresh 0519, plan-gate wall 0387, plan-mode wording 0545, task-loop plan-review default 0544 and coder plan-review default 0543. These are overlap candidates found by search; inspect their current briefs/status before assigning or merging work. Do not assume this transformation authorizes changing their decisions or closing them.
