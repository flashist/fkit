# 0482 — Phase A: hook mechanics, safety verdict, design proposal

> ⛔ **Phase A only. Phase B is NOT approved** (owner ruling 2026-10-04, relayed by `fkit-lead`). Nothing
> here approves anything. Written by `fkit-coder` as the Plan step of `/fkit-sprint-ship-loop` (Sprint 10),
> with design input from `fkit-architect` (a hop-2 consult). Neither had an owner channel (ADR-021).
> Date: 2026-10-05.

## 1. Hook mechanics — evidence (Phase A step 1)

**How this was tested.**
- Claude Code **2.1.289**.
- A throwaway hook that dumps each payload to a scratch folder outside the repo. It was registered on 11 events through a per-run `--settings` file, with `--setting-sources` narrowed so no real user or project settings loaded.
- Runs used: headless `-p` runs (the main session started with `--agent <probe>`; one subagent spawn; one project slash command), plus a stream-json **SDK-host driver** that answered or denied `AskUserQuestion` the way the Agent SDK does.
- A **key-only** survey of this repo's local session transcripts: structure only, no values read out.
- Everything was deleted afterwards.
- **Not tested live:** the interactive terminal UI. An interactive session in a new folder writes a trust entry into the real user config, which the rules forbid.
- Docs: code.claude.com hooks reference and Agent SDK hooks page, fetched 2026-10-05.

| # | Question | Answer | Evidence |
|---|---|---|---|
| 1a | Does `PostToolUse` fire for `AskUserQuestion`, and does it carry the answer? | **Yes.** `tool_response` = `{questions:[…], answers:{"<question text>":"<answer>"}}`, also copied into `tool_input.answers`. | Experiment (SDK host). Docs list `tool_response` for PostToolUse but say nothing about this tool's shape. The transcript survey confirms real terminal answers have keys `{questions, answers}` or `{questions, answers, annotations}`. |
| 1b | Free-text "Other"? | It arrives as the answer string itself. It can only be told apart from a label by comparing it with the option labels. In local history about 7% of answers are free text and about 1% are joined multi-select answers. | Experiment, plus a key/kind-only transcript survey |
| 1c | Dismissed question? | `PreToolUse` and `PermissionRequest` fire. **No `PostToolUse` and no `PostToolUseFailure`.** So "asked" can only be seen at PreToolUse. In real transcripts a dismissal is an error tool_result that starts "The user doesn't want to…". | Experiment (SDK-host deny). Docs are silent. ⚠️ **Not checked live in the terminal UI**: whether the terminal path fires `PostToolUseFailure` is unverified. `PermissionDenied` is documented for auto-mode denials only, not a user dismissal. |
| 2a | Does `UserPromptSubmit` carry the typed text, session id and cwd? | **Yes.** It carries `prompt` (raw text), `session_id`, `cwd`, `transcript_path`, `prompt_id`, `permission_mode`, and `agent_type` (when started with `--agent`). | Experiment and docs |
| 2b | Does it fire for a typed `/command`? | **Yes, both events fire**: `UserPromptExpansion` first (`expansion_type: slash_command`, `command_name`, `command_args`), then `UserPromptSubmit` with the raw `/cmd args`. Both share the same `prompt_id`. | Experiment. Docs confirm Expansion fires on user-typed commands and say nothing about order. |
| 2c | Does it fire for a subagent's spawn prompt or a relayed message? | **Not for a spawn prompt.** ⚠️ **But it DOES fire for turns the harness injects itself**: a background-agent completion notice (prompt starts `<task-notification>`) fired with **exactly the same keys** as a typed prompt. No field tells owner-typed and injected turns apart. A relayed answer reaches the lead as an `AskUserQuestion` answer in the **lead's** session, not as a prompt in the worker's. | Experiment. Docs: *"Also fires on turns Claude Code starts on its own."* Other injected kinds (artifact comments, scheduled prompts, remote/bridge) are plausible but unverified. |
| 3 | What identifies the role? | `agent_type`. In a launcher session it is `fkit-<role>`, with no `agent_id`. In a subagent it is the subagent's own type plus an `agent_id`. A plain `claude` session has no `agent_type` at all. | Experiment and docs (*"agent_id … Present only when the hook fires inside a subagent"*; *"agent_type … Present when the session uses --agent or the hook fires inside a subagent"*). This matches ADR-018's earlier measurement. |
| 4 | What fires in a spawned subagent? | Settings hooks **do** fire there: PreToolUse and PostToolUse (with `agent_id`), SubagentStart, SubagentStop. UserPromptSubmit does not fire for a spawn prompt. `AskUserQuestion` is absent in a spawned consult (ADR-021). In headless `-p` it could not be loaded at all. | Experiment and docs |
| — | Coverage | Hooks exist only in `fkit <role>` sessions (`.fkit/settings/<role>.json`, built by `build_settings()`). Plain `claude` sessions, claude.ai, hand edits, owner git commits and other machines are invisible. | Code read |

## 2. Safety verdict (Phase A step 2, Ruling 2)

Judged for the **closed-format design** in §3 (D1: no text is stored, even locally).

| Point | Verdict | Reason |
|---|---|---|
| Raw log local-only and gitignored | **Yes** | Writes go only to `<project>/.fkit/owner-log/`. The project root comes from the launcher, never from cwd. Each path segment is checked and symlinks are refused (`path_contained` discipline). `git check-ignore` must confirm the exact target. Any failure means nothing is written. A non-git project gets no capture: coverage is lost, nothing leaks. |
| Redaction of secrets | **Yes — by not storing text, not by redacting.** | Every stored field must match a closed format (timestamp, identifier, 4-digit task id, fixed event or answer kind). A value that fails is dropped. Heuristic redaction can't be proven complete, so the design does not depend on it. This applies to agent-written question text too: agents paste secrets and the owner's words into questions. |
| Retention rule | **Yes** | Whole per-session files older than N days (proposed 90; OQ4) are deleted on each write. A `pruned-before` watermark makes pruned tasks show as `unknown (log-pruned)`, so pruning can never fake autonomy. |
| No secret and no non-ruling verbatim owner text can reach a committed file (Ruling 1) | **Yes** | Capture holds no text at all, so it has none to leak. The only committed output is one fixed-wording count line, written by a deterministic script. No model retypes it. Capture never quotes rulings either; agents keep quoting them by hand, as today. ⚠️ This changes brief test 9 to "capture emits no owner text" — OQ1. |
| ADR-049 no-upgrade holds | **Yes** | Capture never feeds, upgrades or replaces `(agent-closed — not owner-verified)`. The line never says "approved" or "verified". The plan-approval anchor is a file write a hook saw, not a verified human act. |
| Hook can't steer the model or block the owner | **Yes** | It prints nothing to stdout (UserPromptSubmit and SessionStart stdout is added to the model's context), always exits 0, never denies, never echoes the payload. No SessionStart hook. |

**Residual risks — named, not closed.** These are all honesty risks: autonomy can be **over**-reported. None of them is a privacy risk.
1. **Uncovered channels.** Owner involvement in plain sessions, claude.ai, on other machines, or by teammates is invisible. Every report says "captured: launcher sessions, this machine".
2. **A hook failure partway through a task** (disk, permissions) looks like silence. A liveness rule catches only a session that recorded nothing at all.
3. **Claude Code payload drift** can silently stop capture. Partly mitigated by the liveness rule, the report printing the date of the last entry of each kind, fixture tests pinned to 2.1.289, and re-measuring on any version change.
4. **A relayed question mis-tagged** by an agent to another task in the same session.
5. **An owner message typed between the approval and the `plan.md` write** counts as plan-phase.
6. **An owner message that happens to start with a known harness prefix** is classified as `injected`.
7. **A dismissal path in the terminal UI not checked live** (row 1c). The design records "asked" at PreToolUse, so a dismissal still counts as involvement whatever fires afterwards.

`plan.md` written via Bash gives no anchor. That errs to `unknown`, not to inflation.

**Overall: SAFE** for the closed-format design. **NOT SAFE ENOUGH** for any variant that stores owner text or question text, even locally with redaction: do not build that. If the owner finds the accuracy residuals above unacceptable for a metric, dropping the feature stays a valid choice.

## 3. Design proposal (Phase A step 3)

Shaped with `fkit-architect`. The full rationale is in the Proposed ADR draft.

**Item 1 — Automatic capture.** Launcher-only, wired by `build_settings()`. **Main session only**: entries with an `agent_id` are ignored. New entries, each a separate record-only hook:
- PreToolUse `AskUserQuestion` → `asked`. The existing marker hook stays **byte-unchanged**.
- PostToolUse `AskUserQuestion` → `answered`, with answer kind `option` / `free-text` only.
- UserPromptSubmit → `typed`, or `injected` when the prompt starts with a known harness prefix (initially `<task-notification>`). Unknown prefixes count as `typed`, which errs the safe way.
- UserPromptExpansion → `command` (command_name; for `fkit-task-ship-loop`, a 4-digit task id taken from the args with a strict pattern; the args themselves are never stored).
- PreToolUse `Agent|Task` → `bind`. The task id comes from a new fixed `task: <id>` spawn-prompt line, or from the existing `plan: …/plan.md blob …` pointer. This is **not** inside carry-check, which denies spawns; capture must never deny.
- PostToolUse `Write|Edit` on `ai-agents/tasks/**/<id>-*/plan.md` → `plan-write`.

One append-only file per session. Stored fields: timestamp, session_id, agent_type, event kind, task id, command_name, answer kind. Nothing else.

**Item 2 — Linking entries to tasks.** Done at **summary time** by a pure, fixture-tested function, never in the hook. A session is bound to task X by `command`, `bind` or `plan-write` events naming X. For an owner entry in session S at time t:
1. it carries a `[task <id>]` tag (relayed questions) and that id is bound in S → it counts for X only;
2. otherwise → it counts for **every** task bound in S;
3. no task is bound in S → **unattributed**: it counts against every task whose window covers t, reported separately (OQ2).

How the four cases come out:
- No task in progress → rule 3.
- Several tasks in one session → a tag picks one task; untagged entries go to all of them.
- Lead relaying for a worker → the lead's question carries the worker's tag.
- Chit-chat → every typed message counts. Telling "decisions" apart would need the text and judgement, which is neither safe nor deterministic (OQ3). So the line says "typed messages", not "decisions".

Errors from these rules can only **lower** the autonomy count.

**Plan-approval anchor** = the first `plan-write` for the task. Both ship-loops write `plan.md` right at approval:
- `fkit-task-ship-loop` step 4;
- `fkit-sprint-ship-loop`'s Build row: "the driver wrote it at approval".

Owner entries strictly after the anchor are involvement, and a re-approval counts as involvement. No anchor → `unknown (no-anchor)`. A `plan.md` written early (like this Phase-A proposal) moves the anchor earlier, which errs the safe way. *To verify in B1:* whether the sprint driver writes `plan.md` with the Write tool or with Bash.

**Item 3 — The per-task "Owner involvement" line.**
- A shipped, zero-dependency node script **regenerates exactly one** fixed-wording line in the task's `worklog.md`, next to the decision log (it does not replace that log). It replaces its own earlier line and never adds a second.
- The line holds: counts (questions asked, questions answered, typed messages, attributed and unattributed), the classification with a reason code, and the scope "captured: launcher sessions, this machine". No owner text. No "approved" or "verified".
- **The producer runs it in `/fkit-task-done` before the move** (ADR-033). The coder gets no mover. A run before the close only writes a provisional line that the close overwrites.
- If the script cannot run, the producer appends a fixed `unknown (summary-unavailable)` line, given word for word in the SKILL.
- No data (the task predates capture, or ran outside a launcher session) → `unknown (<reason>)`, never 0.

**Item 4 — The metric** (owner's definition). It counts done tasks only and reads the line from `worklog.md` **and** `worklog-legacy.md` (the ADR-052 converter keeps old free-text worklogs word for word). Buckets:
- `autonomous-after-plan-approval` needs **all** of: an anchor; liveness (the binding session shows at least one captured `typed` or `command` entry); the watermark is not later than the anchor; zero owner entries after the anchor, attributed or unattributed.
- `involved` — any attributed owner entry after the anchor.
- `involved-unattributed` — the only post-anchor entries are unattributed.
- `unknown (<reason>)` — everything else.

Shown by `/fkit-status` or a small report, always marked "captured channels only". "Fully automatic" is never used.

**Item 5 — Privacy, point by point.**
- Raw log local and gitignored: containment check plus `git check-ignore` before every write. **A test proves a capture file never lands in a tracked path.**
- What may be committed (Ruling 1): only the fixed count line. Capture produces no owner text, rulings included. Rulings stay quoted by hand in worklogs and briefs, as today (OQ1).
- No secrets: no text is stored, so nothing needs redacting. A test feeds a secret-like string in an answer, a prompt and a question, and proves it reaches no written file.
- Retention: delete whole files after N days; watermark → `unknown (log-pruned)`.
- No off-switch (Ruling 2): safety comes from the closed format, not from a toggle.

**Coverage gap for non-launcher sessions (stated, not hidden).** Only `fkit <role>` sessions are captured. Wiring capture into a committed `.claude/settings.json` was rejected:
- it would capture teammates' plain sessions without their consent;
- plain sessions have no role;
- it blurs ADR-010's line between fkit and non-fkit sessions.

Every report and every line carries the scope note.

**Item 6 — OPTIONAL, separately approvable, NOT covered by an APPROVE for items 1–5.** A read-only, clearly approximate historical count from local Claude Code transcripts. Linking to tasks there is guesswork, so every output says so in plain words. Never committed raw; never presented as the real metric.

**ADR-052 survival.**
- Today: a worklog line.
- After the board switch: the same fixed text becomes a board worklog entry written `--by producer`.
- A dedicated board field is deferred to its own decision.
- The local log is evidence, not task state, so ADR-051 D1's "one store" rule holds.

**Overlap with `0121` (observer).** **One log.** This hook log is fkit's only hook-based owner-interaction record. `0121` reads it and must not build a second one. New event kinds come only by amending the ADR, under the same closed-format, local, contained, no-stdout rules.

**Generic, and the rules block.** Ships from `claude/`, wired by `build_settings()`, with the `.claude/` copies refreshed. Nothing goes in the shared rules block (the byte cap is unchanged). No machine paths in committed files: the launcher-generated settings are local and gitignored. Tests are zero-dependency `node --test` (ADR-014).

## 4. Proposed split into implementation briefs (filed by the producer only after APPROVE)

| Brief | Scope | Depends on |
|---|---|---|
| **B0** | ADR accepted by the owner | — (blocks all) |
| **B1** | Capture hooks: closed-format schema, per-session files, containment and ignore guard, no-stdout rule, retention and watermark, `build_settings()` wiring, payload-fixture tests (2.1.289). Existing hook tests stay green. | B0 |
| **B2** | Skill prose conventions: the `task: <id>` spawn line and the `[task <id>]` relay tag in both ship-loop SKILLs | B0 (runs alongside B1) |
| **B3** | Summarizer: linking rules, anchor, liveness and watermark rules, fixed-line writer, fixture worked examples (plan-approval only → autonomous; later question → involved; no data → unknown) | B1, B2 |
| **B3b** | Add the summarizer step to `/fkit-task-done` (touches a mover, ADR-050; coordinate with the ADR-052 phases) | B3 |
| **B4** | Metric report (`/fkit-status` or a small `fkit` report), reading `worklog.md` and `worklog-legacy.md`, with reason codes | B3 |
| **B5** | Docs: coverage gap, privacy, README and architecture mirrors | B1–B4 |
| **B6** | OPTIONAL historical approximate count — separately approvable | independent |

## 5. Status
Phase A is complete. **Waiting on the owner's explicit APPROVE for Phase B. Not given.** Item 6 needs its own approval.
