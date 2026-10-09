# Build the owner-involvement capture hooks (closed format, launcher only, local log)

## ID
0486

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

> ⛔ **Do not start without the owner's specific word.**
>
> ⛔ **Blocked by [`0485`](../0485-owner-reads-and-accepts-adr-053-before-any-owner-involvement-capture-is-built/brief.md)
> (B0) until ADR-053 is `accepted`.** The 2026-10-05 APPROVE of Phase B is not acceptance of the ADR.

## Context

**Where this comes from.** Brief **B1** of the Phase-B split of the gated umbrella
[`0482`](../../done/0482-record-every-owner-question-and-decision-and-count-autonomous-tasks/brief.md)
(item 1 "automatic capture" and the capture half of item 5 "privacy"). The design is
[ADR-053](../../../knowledge-base/decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log.md)
D1–D4, D11–D13. **ADR-053 governs where it differs from `0482`'s `plan.md` § 3.** The "Carry into the
Phase-B briefs → B1" list in `0482`'s `worklog.md` is folded in below.

**Owner rulings that bound this task** (all 2026-10-05, `AskUserQuestion`, `fkit-lead` session, unless
noted): Phase B items 1–5 APPROVED; **OQ1 — no text at all, even locally**; **OQ4 — 30-day retention**;
**R2 "Allow, with a fixed list"** (role and command name kept only if on a known list, else `other`);
**R4 "Each entry 30 days old"**; **R9 "Accept, fix the wording"** (day files); **R12 "Yes, count it"**
(`expanded` kind); **R11 "Yes, mark unknown"** (damaged lines). From 2026-10-02: Ruling 1 (raw messages
stay local) and **Ruling 2 — no off-switch; safe by construction or not built at all.**

**Measured facts this rests on** (Claude Code 2.1.289, `0482` `plan.md` § 1; ADR-053 E1–E6): PostToolUse
on `AskUserQuestion` carries answers; a dismissed question fires PreToolUse but no PostToolUse;
UserPromptSubmit fires for typed prompts **and** for harness-injected `<task-notification>` turns, with
identical keys; a typed slash command fires UserPromptExpansion then UserPromptSubmit; settings hooks
fire inside subagents (with `agent_id`); hooks exist only in `fkit <role>` sessions. ⚠️ The interactive
terminal UI was **not** tested live.

**Existing pieces, unchanged:** `claude/askuserquestion-marker-hook.sh` (ADR-030) and
`claude/shiploop-marker-hook.sh` stay **byte-unchanged**; `claude/carry-check-hook.*` denies spawns, so
capture must not live there (capture never denies). `build_settings()` in `claude/fkit-claude.sh` wires
hooks. `path_contained` and `add_ignore '.fkit/'` are in `claude/fkit-claude-init.sh`. Line numbers in
ADR-053 drift — re-check.

## What to build

1. **Record-only hooks, wired only by `build_settings()`** (D13). Main session only — any payload with
   an `agent_id` is ignored (D2). Events (D2):
   - PreToolUse `AskUserQuestion` → `asked`, **one entry per question**.
   - PostToolUse `AskUserQuestion` → `answered`, one entry per answered question, answer kind `option`
     (equals one option label, or a multi-select join of labels) or `free-text`. **Measure and pin the
     multi-select join format on 2.1.289.**
   - For both: **tag extraction from the `question` field only** (not `header`, not options): exactly
     one distinct strict `[task NNNN]` tag → store the four digits as the task id; zero or several →
     no task id.
   - UserPromptSubmit → `typed`, or `injected` when the prompt begins with a known harness prefix
     (initially `<task-notification>`).
   - UserPromptExpansion → `command` **only** when `expansion_type` = `slash_command` (gated as
     `claude/shiploop-marker-hook.sh` does), with command_name from the fixed list or `other`, and a
     task id only for `fkit-task-ship-loop` by a strict pattern on the args (args never stored). Any
     other or missing `expansion_type` → `expanded`, with no command_name and no task id.
   - PreToolUse `Agent|Task` → `bind` (task id from the `task: <id>` spawn line `0487` adds, or the
     existing `plan:` pointer).
   - PostToolUse `Write|Edit` on `ai-agents/tasks/**/<id>-*/plan.md` → `plan-write`.
2. **Closed-format fields only** (D1): hook-made ISO 8601 UTC timestamp (never from the payload);
   session_id — **measure and pin its format on 2.1.289** (expected UUID), a failing value → the fixed
   `unknown-session`, entry kept; agent_type / command_name only if on the fixed lists, else `other`;
   task id `\d{4}` or left out; answer kind `option` | `free-text`. **No free text at all**: no
   prompt, answer, option label, question text, command args, transcript_path or prompt_id.
3. **Fixed lists from the one source** (D1, R10): the launcher builds them on every launch — known
   roles from `$ROLES`, command_name list = union of `skills_for_role "$r"` over `$ROLES` — and passes
   each as one comma-joined argument in the hook command `build_settings()` emits (the regenerated
   `.fkit/settings/<role>.json`, or the inline `--settings` fallback). Items must match `[a-z0-9-]+`.
   A missing or malformed list = empty → every value `other`, entry kept. The hook never sources
   `claude/fkit-claude.sh` and holds no list of its own.
4. **Fail-closed storage** (D3): one append-only file per session per UTC day under
   `<project>/.fkit/owner-log/`; project root from a launcher-passed argument, never cwd. Before every
   write: each path segment checked, symlinks refused (`path_contained` discipline), and
   `git check-ignore` confirms the exact target. Each entry built in full, then written as **one
   newline-terminated line in a single `write` to an `O_APPEND` file** — never read-modify-write. **Name
   the exact write primitive and why it is a single call.** Any failure → nothing written. A non-git
   project gets no capture.
5. **Silent and harmless** (D3): always exit 0, **never print to stdout** (UserPromptSubmit stdout
   reaches the model), never block or deny, never echo the payload. No SessionStart hook.
6. **Retention** (D4): pruning on **every capture write** — deletes only regular files matching the
   day-file pattern, inside the D3-checked folder, symlinks refused; silent; a failed prune is ignored.
   A day file becomes deletable 30 days after its UTC day **starts**. **No stored watermark** (readers
   compute W; see `0488`).
7. **Verify and record** (`plan.md` § 3, "To verify in B1"): whether the sprint driver writes
   `plan.md` with the Write tool or with Bash. If Bash, every sprint-loop task would read
   `unknown (no-anchor)` — **do not change the driver's write path in this task**; record the finding
   and route it to the owner (a fix would amend ADR-053 D6 or `0487`'s scope).
8. Refresh the `.claude/` copies via `claude/fkit-claude-init.sh .`. Nothing in the shared rules block.

## Verification steps

1. **Payload fixtures (2.1.289):** an `AskUserQuestion` call + answer, and a typed owner message, each
   produce exactly the expected entries with time, session and role; a payload carrying an `agent_id`
   produces none; a `<task-notification>` prompt produces `injected`.
2. **Ignored path:** a test proves every capture write lands only under a path `git check-ignore`
   confirms; a symlinked or non-contained target → nothing written.
3. **No text reaches any file (OQ1, replaces `0482` test 9 for capture):** a secret-shaped string in an
   answer, a typed prompt, a question and command args reaches no written file; a secret-shaped
   command_name or agent_type is stored as `other`.
4. **Tag extraction:** one tag → its digits; zero tags → none; several distinct tags → none; tag only in
   `header` or an option → none.
5. **Dismissal** (SDK-host fixture) yields `asked` only.
6. **Retention:** a day file survives at day start + 30 days − ε and is deleted at + 30 days; a symlink
   or non-matching file in the folder is never deleted.
7. **Concurrency:** many concurrent appenders to one day file → every line intact, none lost.
8. **Expansion gate:** an `mcp_prompt` expansion → exactly one `expanded` entry, no command_name, no
   task id; a `slash_command` → one `command` entry.
9. **List argument:** an empty or malformed list → every value `other`, entry still written.
10. **Silence:** no hook writes to stdout in any fixture; every hook exits 0.
11. Existing hook tests (`askuserquestion-marker-hook`, turn-completion, skill-ownership) still pass;
    the two marker hooks are byte-unchanged (`git diff` empty on them).
12. Rules block size unchanged — `fkit-claude-init.sh`'s cap check passes with the same byte count.
13. No absolute machine path in any changed file. Tests are zero-dependency `node --test` (ADR-014).
14. Item 7's finding (Write vs Bash) is recorded in this task's `worklog.md`.

## Notes
- **Depends on:** 0485
- **Blocks:** 0488, 0491
- **Runs alongside:** `0487` (no shared files expected; `0487` edits only the two ship-loop SKILLs).
- **Parent:** [`0482`](../../done/0482-record-every-owner-question-and-decision-and-count-autonomous-tasks/brief.md);
  design in [ADR-053](../../../knowledge-base/decisions/adr-053-owner-involvement-capture-closed-format-launcher-only-hook-log.md).
- **Re-measure on any Claude Code version change** (ADR-053 "Re-raise only if"). Fixtures are pinned
  to 2.1.289.
- **Both ship-loop SKILLs carried uncommitted edits from task `0480` on 2026-10-05** — re-check the
  `plan.md`-write lines ADR-053 cites before relying on them.
- **One log** (D11): `0121` (observer) reads this log and must not build a second one.
- **Not ADR-049:** capture never upgrades `(agent-closed — not owner-verified)` (D12).
- **Not yet scheduled:** on the Backlog board; pulling it into a sprint is the owner's call.
- **Consulted:** none at filing.
- Filed 2026-10-05 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  APPROVE of `0482` Phase B items 1–5; it decides nothing beyond that APPROVE and ADR-053.
