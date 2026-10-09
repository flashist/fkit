# ADR-053: Owner-involvement capture — closed-format, launcher-only hook log; a deterministic per-task line; "autonomous after plan approval" is counted conservatively

- **Status:** `proposed` — **not accepted.** ⭐ **Phase B items 1–5 of task 0482 were APPROVED by the
  owner on 2026-10-05**, given directly by the owner via `AskUserQuestion` in the `fkit-lead` session
  (`/fkit-sprint-ship-loop`, Sprint 10) and relayed by `fkit-lead`. ⛔ **Item 6 is NOT approved** — it
  needs its own separate approval. ⛔ **This ADR becomes `accepted` only by the owner's direct ruling
  (brief B0).** The APPROVE of items 1–5 is not that ruling.
- **Amended 2026-10-05 after review round 1 (R1–R7); still `proposed`.** The owner's APPROVE was of
  plan.md §3. Where this ADR now differs from it (D1 fields, D2 tag extraction, D4 day files, D5 rule 1,
  D8 counting), this ADR governs, and B0 is asked against this text with those differences listed.
- **Amended again 2026-10-05 after review round 2 (R9–R13); still `proposed`.** D1 list route, D2
  expansion gate, D3 single-write appends, D4 on-disk wording, D5 `unknown-session` rule; owner-rulings
  record corrected (R13). Also differences from plan.md §3 that B0 must list: the launcher-passed fixed
  lists (D1), the new `expanded` event kind (D2), the `unknown (log-corrupt)` reason (D3/D7), and the
  `unknown-session` rule (D5).
- **Amended again 2026-10-05 after review round 3 (R14–R15); still `proposed`.** Record only, no design
  change: the D5 rule added to the B0 differences list above (R14); two owner rulings on `expanded` and
  damaged log lines added, and one item moved out of the owner-rulings list (R15).
- **Date:** 2026-10-05
- **Deciders:** **the owner** (Mark Dolbyrev) — the Phase-B APPROVE and the rulings below are his;
  acceptance (B0) is pending. Drafted by `fkit-architect` in a hop-2 consult (chain: `fkit-lead` →
  `fkit-coder` → `fkit-architect`) and written up by `fkit-architect` spawned by `fkit-lead`; neither had
  an owner channel ([ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
- **Task:** `0482` (gated umbrella; the Phase-A design is the `plan.md` in its task folder).
- **Harness pinned:** Claude Code **2.1.289** — the hook payload facts below were measured on that
  version and are only valid for it.
- **Bears on:** ADR-010, ADR-018, ADR-020, ADR-021, ADR-030, ADR-032 (A2), ADR-033, ADR-049, ADR-050,
  ADR-051 D1, ADR-052; task `0121`.

## Context

The owner wants a real count of tasks that fkit finished **without his involvement after he approved
the plan**. Today nothing records that, so any number would be a guess. Two owner rulings bound the
design (task 0482 brief):
- **Ruling 1:** rulings may be quoted word for word in committed files; everything else he types
  appears only as counts or short paraphrase; raw messages stay local.
- **Ruling 2:** no off-switch — *"if the feature is dangerous, we're not going to implement it at
  all."* Capture is safe by construction, or it is not built.

Measured hook facts (Phase A, 2.1.289; headless runs plus an SDK-host driver in a scratch directory,
and a key-only survey of local transcripts). ⚠️ **The interactive terminal UI was not tested live**
(an interactive session in a new folder writes a trust entry into the real user config):
- **E1** PostToolUse fires for an answered `AskUserQuestion`. The payload holds questions and answers;
  a free-text "Other" answer is indistinguishable from a label except by comparing it to the option
  labels.
- **E2** A dismissed question fires PreToolUse (and PermissionRequest) but **no** PostToolUse or
  PostToolUseFailure. ⚠️ Measured on the SDK-host path only; whether the terminal UI's dismissal fires
  PostToolUseFailure is unverified. D2 records "asked" at PreToolUse, so a dismissal counts as
  involvement whatever fires afterwards.
- **E3** UserPromptSubmit carries the raw typed prompt, session_id, cwd, prompt_id and agent_type. A
  typed slash command fires UserPromptExpansion **and** UserPromptSubmit.
- **E4** UserPromptSubmit does not fire for a subagent spawn prompt. It **does** fire for a
  harness-injected background-agent notification, with keys identical to a typed prompt. Other
  injected kinds (artifact comments, scheduled prompts, remote/bridge) are plausible but unverified.
- **E5** The main launcher session has agent_type `fkit-<role>` and no agent_id. Subagents carry
  agent_id, and settings hooks fire inside them.
- **E6** Hooks exist only in `fkit <role>` sessions (`.fkit/settings/<role>.json`, built by
  `build_settings()`, `claude/fkit-claude.sh:295-353`).

Existing pieces this builds beside, without changing them:
- `claude/askuserquestion-marker-hook.sh` (ADR-030) and `claude/shiploop-marker-hook.sh`, both wired in
  the one hooks string at `claude/fkit-claude.sh:331`.
- `claude/carry-check-hook.sh` / `claude/carry-check-hook.mjs`, which deny spawns, so capture must not
  live there.
- `.fkit/` is gitignored (`.gitignore:8`; `claude/fkit-claude-init.sh:726`, `add_ignore '.fkit/'`).
- `path_contained` (`claude/fkit-claude-init.sh:293`).
- `plan.md` is written at plan approval (ADR-020): `claude/skills/fkit-task-ship-loop/SKILL.md:142-146`
  (step 4, "write the approved plan to `<task-folder>/plan.md`") and
  `claude/skills/fkit-sprint-ship-loop/SKILL.md:130` (Plan row, "on approval the DRIVER writes the
  approved text to `<task-folder>/plan.md` verbatim"). Both SKILLs carry uncommitted edits from task
  0480 as of 2026-10-05; re-check these lines after that lands.

## Decision

**D1 — Closed-format capture only.** Launcher-session hooks record events. Every stored field is
either taken from a fixed list or matches a narrow closed format:
- timestamp — ISO 8601 UTC, made by the hook (never read from the payload);
- session_id — harness-generated; B1 pins the narrowest format measured on 2.1.289 (expected: a UUID).
  A failing value is stored as the fixed `unknown-session`; the entry is still written;
- agent_type — stored only if it is `fkit-<role>` for a role `skills_for_role()`
  (`claude/skills-for-role.sh`) knows; anything else is stored as `other`;
- event kind — a fixed list (D2);
- task id — exactly four digits (`\d{4}`); a failing value is left out and the entry is still written;
- command_name — stored only if it names a skill `skills_for_role()` lists for some role; anything else
  is stored as `other`;
- answer kind — `option` | `free-text`.

Both fixed lists come from the one source, never hand-copied. The launcher builds them on every launch:
the known roles from `$ROLES`, and the command_name list as the union of `skills_for_role "$r"` over
`$ROLES`. It passes each as one comma-joined argument in the hook command that `build_settings()` emits
(the regenerated `.fkit/settings/<role>.json`, or its inline `--settings` fallback). Nothing is written
to a committed file. The hook does not source `claude/fkit-claude.sh` and holds no role or skill list of
its own. It accepts only items matching `[a-z0-9-]+`. A missing or malformed list counts as empty, so
every value is stored as `other` and the entry is still written; that only loses binds, so it errs
toward `unknown`. A running session keeps its launch-time lists until its next launch. A hand-copied
list would be a seventh mirror under `claude/skills-for-role.sh`'s header (ADR-018: one source).
(Rejected: giving `claude/skills-for-role.sh` a role enumerator — it moves `ROLES` and touches the
mirror header for no gain.)

**No free text is ever stored, even locally** (owner rulings OQ1, R2): no typed prompt, no answer, no
option label, no question text, no command args, no transcript_path. prompt_id is not stored either. A
closed character set is not a closed vocabulary: a value an owner can type or an agent can choose is
checked against a fixed list — or, for a task id, a format too narrow to carry text — never only
against a character set. Privacy comes from an allow-list, not from redaction.

**D2 — Events captured.** Main session only: entries with an agent_id are ignored.
- PreToolUse `AskUserQuestion` → `asked`: one entry per question in the call.
- PostToolUse `AskUserQuestion` → `answered`: one entry per answered question, with answer kind —
  `option` when the answer equals one option label, or for multi-select a join of labels in the join
  format B1 measures; anything else `free-text`.
- For both: if the question's `question` field (not `header`, not the options) holds exactly one
  distinct strict `[task NNNN]` tag (B2's relay convention), the hook extracts the four digits at
  capture time and stores only them as the entry's task id. Zero or several distinct tags → no task
  id. The question text itself is never stored.
- UserPromptSubmit → `typed`, or `injected` when the prompt begins with a known harness prefix
  (initially `<task-notification>`). Unknown injected kinds count as `typed`.
- UserPromptExpansion with `expansion_type` = `slash_command` (gated as
  `claude/shiploop-marker-hook.sh` does) → `command` (command_name — fixed list or `other`, D1; a task
  id only when command_name is `fkit-task-ship-loop`, taken from the args by a strict pattern). Any
  other or missing `expansion_type` (e.g. `mcp_prompt`) → `expanded`, with no command_name and no task
  id. An `expanded` entry counts as owner involvement (D5/D7) but never binds, never satisfies D7
  liveness, and is never added to the typed-message count (D8). (Recording nothing would lose an owner
  action if UserPromptSubmit does not fire for such an expansion — E3 was measured for slash commands
  only; storing it as `command` could fake liveness. `expanded` errs safe either way.)
- PreToolUse `Agent|Task` → `bind` (task id from a fixed `task: <id>` spawn-prompt line, or from the
  existing `plan:` pointer).
- PostToolUse `Write|Edit` on `ai-agents/tasks/**/<id>-*/plan.md` → `plan-write`.

The existing marker hooks stay byte-unchanged. No SessionStart hook.

**D3 — Storage is fail-closed.** One append-only file per session per UTC day (D4) under
`<project>/.fkit/owner-log/`.
The project root comes from a launcher-generated command argument, never from cwd. Before every write:
- each path segment is checked and a symlink refused (`path_contained` discipline);
- `git check-ignore` must confirm the exact target is ignored.

Each entry is built in full first, then written as one complete newline-terminated line in a single
`write` to a file opened in append mode (`O_APPEND`). There is never a read-modify-write. B1 names the
exact write primitive and why it is a single call, and adds a fixture: many concurrent appenders to one
day file give every line intact and none lost. (One session already fires hooks concurrently, e.g.
parallel `Agent` calls → parallel `bind`.)

A line that does not parse fully to the closed format (every field on its list or in its format),
including a final line with no newline, is **malformed**. It counts toward no total. Any task that
would otherwise be `autonomous-after-plan-approval`, and whose window (D5) overlaps that file's UTC day,
reads `unknown (log-corrupt)` instead. The report's diagnostics count malformed lines.

Any failure → nothing is written. The hook always exits 0, **never prints to stdout**
(UserPromptSubmit stdout reaches the model's context), never blocks or denies, and never echoes the
payload.

**D4 — Retention: each entry becomes deletable once it is about 30 days old, and is deleted at the next
prune run** (owner rulings OQ4, R4, R9).
- Entries go into one file per session per UTC day. The day is the entry's own timestamp day (one
  clock read). A file is only appended to on its own day.
- A day file becomes deletable once 30 days have passed since the START of its day, and is deleted at
  the next prune run (below). Entries late in the day become deletable up to one day early (about 29
  days old), which errs to `unknown`, never to `autonomous`.
- A file is never written after its day ends, so deleting it cannot race an append. A per-entry
  rewrite of a live file could lose a concurrent append, under-count involvement and over-report
  autonomy — that is why day files, not rewrites. A long-lived or resumed session does not keep old
  entries alive.
- **When pruning runs:** (a) on every capture write; (b) on every summarizer run. Each run covers every
  session's files. It deletes only regular files whose name matches the day-file pattern, inside the
  D3-checked folder, refusing symlinks. It never prints and never blocks; a failed prune is ignored.
- ⚠️ **On disk vs what readers see (owner ruling R9, 2026-10-05: accepted as designed).** In **every**
  project, an expired file stays on disk until the first capture write or summarizer run in that
  project after it becomes deletable: typically hours to days, and **indefinitely if the project is
  never used again**. Nothing can delete a file unless some process runs. So the 30-day limit holds for
  what readers see (W, below), not for what is on disk. This is the exact rule the owner accepts at B0.
- **Read rule (no stored watermark):** every reader (the summarizer, 0121) computes W = the end of the
  UTC day containing (now − 30 days). It ignores every entry before W as if pruned, whether or not its
  file is still on disk. W is exactly the line below which the rule may already have deleted. D7's
  "watermark" means W.
- Note for 0121 (D11): readers see at most 30 days of the shared log; older files may still be on disk
  until the next prune, and must be ignored.

**D5 — Linking entries to tasks happens at summary time, deterministically.** A session is bound to
task X by `command`, `bind` or `plan-write` events naming X. For an owner entry (`asked`, `answered`,
`typed`, `command`, `expanded`) in session S at time t:
- (1) the entry carries a task id from a `[task NNNN]` tag (D2) — a `command` entry's task id binds S
  (above); it is not a tag. If that task is bound in S → it only. If it is not bound in S → it, and
  also as if untagged: rule (2), or rule (3) when S has no bound task. A mis-tag or missing bind then
  adds involvement instead of losing it;
- (2) no tag → every task bound in S;
- (3) no tag and no task bound in S → **unattributed**: counted against every task whose window covers
  t, and reported separately (owner ruling OQ2). A task's **window** runs from its anchor (D6) to the
  summarizer run for it (the close, D8; a provisional run uses its own time and is overwritten at the
  close). Entries before the anchor never count, so no earlier start is needed.

Entries stored under `unknown-session` (D1) pool several sessions, so they are never treated as one
session. They never bind a task, and they never satisfy D7 liveness. D5 handles their owner entries as
if S has no bound task: a tagged entry counts for its tagged task **and** as unattributed (rule 3); an
untagged one counts as unattributed only. A `plan-write` there still sets the task's anchor (D6),
because the task id comes from the plan.md path, not from the session. A task whose only binding
session is `unknown-session` therefore reads `unknown`. All of this can only lower autonomy.

Apart from the residual risks named under Consequences, these rules only ever add involvement: a doubt
about which task an entry belongs to counts it for more tasks, not fewer.

**D6 — The plan-approval anchor** is the first `plan-write` for the task. Owner entries strictly after
it are involvement; a re-approval is involvement. No anchor → `unknown (no-anchor)`. The anchor is a
hook-observed file write. It is **not** evidence of a human approval (ADR-049).

**D7 — Classification.**
- `autonomous-after-plan-approval` needs **all** of: an anchor exists; liveness (the binding session
  holds at least one captured `typed` or `command` entry); the watermark (W, D4) is not later than the
  anchor; zero attributed **and** zero unattributed owner entries after the anchor.
- `involved` when any owner entry after the anchor is attributed.
- `involved-unattributed` when the only post-anchor entries are unattributed.
- `unknown (<reason>)` otherwise — including `log-corrupt` (D3) and a task whose only binding session is
  `unknown-session` (D5).

Every ambiguity these rules decide resolves away from "autonomous"; the residual risks under
Consequences are the named exceptions. "Fully automatic" is never used.

**D8 — The committed record is one fixed-wording line, written by a deterministic script.** A shipped
node script regenerates exactly one line in the task's worklog: it replaces its own earlier line. The
line holds counts (questions asked, answered, **typed messages** — owner ruling OQ3; attributed and
unattributed), the classification and its reason code, and the scope "captured: launcher sessions,
this machine". It contains no owner text and no "approved"/"verified" wording.

"Typed messages" = the number of `typed` entries: every owner-typed prompt, slash commands included
(E3: a typed command fires UserPromptSubmit too). `command` entries bind (D5) and count as involvement
(D7), but they are never added to the typed-message count, so a slash command counts once. ⚠️ If a
harness path ever fires UserPromptExpansion without UserPromptSubmit, the count is one low for it.
Classification is unaffected: the `command` entry is still involvement. Question counts are per
question (D2).

The **producer** runs the script in `/fkit-task-done` before the move (ADR-033). If the script cannot
run, the producer appends a fixed `unknown (summary-unavailable)` line given verbatim in the SKILL. The
coder gets no mover. Running the script early only writes a provisional line that the close
overwrites.

**D9 — The metric** counts done tasks only, reading the line from `worklog.md` **and**
`worklog-legacy.md`. A done task with no line is `unknown`. Reports always say "captured channels
only".

**D10 — Surviving ADR-052.** After the board switch, the same fixed text becomes a board worklog entry
written `--by producer` (ADR-052 D4/D5). The converter's word-for-word `worklog-legacy.md` (ADR-052
Q5/D8) keeps old lines. A dedicated board field is deferred (a data-format change; its own decision).
The local log is evidence, not task state, so it does not break ADR-051 D1.

**D11 — One log.** This is fkit's only hook-based owner-interaction log. Task `0121` and any later
observer **read** it and do not build a second one. New event kinds come only by amending this ADR,
under D1/D3's rules.

**D12 — Not a verification.** Capture never feeds, upgrades or replaces
`(agent-closed — not owner-verified)` (ADR-049 D3; ADR-033 Decision 5). In a project converted to the
built-in board, where ADR-052 amends both (owner-verified only through the owner's web page), capture
feeds that rule no more than this one.

**D13 — Launcher-only.** Wired only by `build_settings()`. Nothing goes in a committed
`.claude/settings.json`; nothing goes in the shared rules block. Plain `claude` sessions, claude.ai,
hand edits, git commits and other machines are uncovered. That gap is stated in every report.

## Options considered

- **Closed-format, launcher-only capture; linking done at summary time; script-written line
  (chosen).** Privacy can be proven by tests. Apart from the named residual risks, errors only add
  involvement. The single deterministic
  writer sits behind the producer-only close.
- **Store question text and owner text locally, with heuristic redaction.** Rejected: redaction cannot
  be shown complete, so it fails Ruling 2. Agents also put secrets and owner text into question text.
  The owner ruled it out directly (OQ1).
- **Classify typed messages as "decisions" vs chit-chat.** Rejected: needs the text and judgement, so it
  is neither deterministic nor safe. Every typed message counts instead (owner ruling OQ3).
- **Ignore unattributed owner messages.** Rejected by the owner (OQ2): ignoring them would let a message
  typed outside any bound session inflate the autonomy count.
- **Linking at capture time, or agent-kept "current task" state.** Rejected: agents forget, it races
  between parallel tasks, it cannot be checked, and capture-time logic is harder to test than a pure
  summarizer.
- **Plan-approval anchor via a mandatory tagged approval question.** Rejected as the primary anchor: it
  misses typed approvals and the ExitPlanMode approval. The plan.md write is already required at
  approval by ADR-020.
- **Extend carry-check to record bindings.** Rejected: carry-check denies, capture must never deny;
  their failure rules differ.
- **Wire into the project `.claude/settings.json` to cover plain sessions.** Rejected: it captures
  teammates without consent, plain sessions have no role (agent_type), and it blurs ADR-010's line.
- **The producer transcribes the line from script output.** Rejected: a model copying the text is the
  reconstruction failure ADR-020's 2026-09-04 correction records. The script writes the line itself.
- **Drop the feature (Ruling 2's fallback).** Not chosen: the closed-format design is safe by
  construction for privacy, and the owner approved items 1–5. If the owner judges the remaining
  *accuracy* gaps unacceptable, dropping it stays open at B0.

## Consequences

- **Positive:** a countable, honest, conservative metric; no owner text in any file, local or
  committed; one log 0121 can reuse; the existing hooks and the ADR-030 Stop hook are untouched.
- **Negative / costs:**
  - six new hook entries, with a little start-up cost on every prompt and every Write/Edit, plus a
    pruning scan of the log folder on every capture write;
  - two new prose conventions (`task: <id>` spawn line, `[task <id>]` relay tag);
  - a `/fkit-task-done` step, which touches a mover (ADR-050) and must be coordinated with ADR-052;
  - **no "why"** in the log — the "why" stays in the worklog decision log;
  - the line says "typed messages", not "decisions";
  - status checks and chit-chat count as involvement;
  - sprint-loop tasks will often read `involved` because of untagged typed messages;
  - with **30-day** retention, a task whose anchor is before W (D4: about 29–30 days before its
    summary) reads `unknown (log-pruned)` — never autonomous.
- **Residual risks (autonomy can still be over-reported) — named, not closed:**
  1. Owner involvement in uncovered channels: plain sessions, claude.ai, other machines, teammates.
  2. A hook failure in the middle of a task (disk, permissions) looks like silence. Liveness only
     checks the binding session.
  3. Claude Code payload drift silently stops capture. Partly mitigated by the liveness rule, the
     report's last-entry-per-kind dates, and fixture tests.
  4. An agent mis-tags a relayed question to another task bound in the same session.
  5. An owner message typed between the approval and the plan.md write counts as pre-anchor.
  6. An owner prompt that begins with a known harness prefix is classified `injected`.
  7. plan.md written via Bash gives no anchor (errs to `unknown`) — unless a later Write/Edit of
     plan.md sets a late anchor; then it over-reports like residual 5.
  8. Deleting or editing log files by hand inside the 30-day window looks like silence.
- **Re-raise only if:**
  - Claude Code changes any measured payload fact (E1–E6) → re-measure on the named version, then
    amend.
  - ADR-052's board gains a structured field for this → move D10.
  - 0121 needs an event kind this log lacks → amend D2 under D1/D3; do not add a second log.
  - 0121 needs history older than 30 days → the owner re-rules OQ4; still no second log.
- **Do not re-raise:**
  - "store the text for richer retrospectives" without a closed-format answer to Ruling 2 — the owner
    has also ruled "no text at all, even locally" (OQ1);
  - "add an off-switch" (Ruling 2);
  - "count only decisions, not every typed message" (OQ3);
  - "ignore unattributed messages" (OQ2).

## Owner rulings (2026-10-05)

Given directly by the owner via `AskUserQuestion` in the `fkit-lead` session (Sprint 10,
`/fkit-sprint-ship-loop`), relayed by `fkit-lead`. They replace the draft's open questions.

- **Phase B — APPROVE items 1–5** (capture; linking; the per-task line; the metric; privacy, as in the
  Phase-A `plan.md` §3). The ADR itself stays `proposed` until B0.
- **Item 6 — NOT approved.** The historical approximate count from local transcripts needs its own
  separate approval; nothing here authorises it.
- **OQ1 → No text at all, even locally** (counts, times, task ids only). Brief test 9 becomes "capture
  emits no owner text". **R2 (owner, 2026-10-05, `AskUserQuestion`, `fkit-lead` session):** session_id,
  agent_type, event kind, command_name and answer kind are allowed and are not "text". command_name and
  agent_type are stored only if on a fixed known list, else `other` (D1; this also settles R3).
- **OQ2 → Count unattributed owner messages against running tasks, shown separately** (D5 rule 3; D7's
  `involved-unattributed`).
- **OQ3 → Every typed message counts as involvement.** The line says "typed messages", not "decisions"
  (D8).
- **OQ4 → Retention 30 days** (D4), not the draft's recommended 90.
- **Review round 1 (2026-10-05, same channel; ledger `review.md` in the task folder):**
  - **R2 → "Allow, with a fixed list"** (option label) — recorded in the OQ1 bullet above and in D1.
  - **R4 → "Each entry 30 days old"** (option label; its description: "Every entry is deleted once it's
    30 days old. Matches your ruling literally.") — D4. *Paraphrase, not the owner's words:* the ADR
    states how pruning is triggered and what it cannot guarantee.
- **Review round 2 (2026-10-05, same channel):**
  - **R9 → "Accept, fix the wording"** (option label) — the day-file rule as designed is accepted:
    entries may be deleted up to about one day early, and expired files stay on disk until the next
    capture write or summarizer run in that project (indefinitely if it is never used again); readers
    ignore everything before W. D4 states exactly that.
  - **`expanded` (R12) → "Yes, count it"** (option label; its description: "Keep the new 'expanded'
    event. Safer: no action of yours is lost from the count."). Asked after round 2 and relayed in the
    round-3 spawn. *Paraphrase of the question:* should an expansion that is not a normal slash command
    (e.g. an MCP tool's prompt) count as owner involvement, but never as proof the session was watched?
    — D2's `expanded` kind; until this ruling it was an agent design call.
  - **Damaged log lines (R11) → "Yes, mark unknown"** (option label; its description: "A damaged line
    might have been your entry, so the task isn't credited as autonomous."). Asked and relayed the same
    way. *Paraphrase of the question:* if a line in the local log is damaged, should any task whose
    window overlaps that day read `unknown (log-corrupt)` rather than possibly autonomous? — D3/D7; until
    this ruling it was an agent design call.
- **Not owner rulings (corrected 2026-10-05):** R1, R5, R6 and R7 were **not** ruled on by the owner.
  An earlier version of this list said "R5–R7 — fix"; that was the sprint driver's default, wrongly
  relayed as an owner ruling. Each was verified CORRECT by `fkit-coder` and fixed under the sprint
  loop's standing approval as an in-plan or obvious-winner fix (R1 → D2/D5; R5 → D5/D7; R6 → D1/D5;
  R7 → D8).
  - **Briefs filed after the APPROVE, before acceptance; B0 blocks B1–B5 (see Authority)** — **not** an
    owner ruling (corrected 2026-10-05, review round 3, R15b). An earlier version listed it under
    review round 1 as "kept". The owner did not rule on it: the sprint driver told him it was found
    consistent and needed no answer, and he gave none. Basis: the reviewer and `fkit-architect` found it
    consistent with the brief's Phase-B text and plan.md §4 ("filed by the producer only after
    APPROVE"). It stands unless the owner says otherwise at B0.

## Authority

Drafted by `fkit-architect` in a **hop-2 consult with no owner channel** (ADR-021) during task 0482
Phase A; written up here with the owner's 2026-10-05 rulings folded in. **Status: `proposed`.** Phase B
items 1–5 are **APPROVED by the owner, 2026-10-05**. That APPROVE lets the producer file the Phase-B
briefs per the Phase-A `plan.md` §4; **B0 — the owner's direct acceptance of this ADR — still blocks
every one of B1–B5 (including B3b)**. B6 (item 6) is not authorised. This ADR becomes `accepted` only by
the owner's direct ruling; no agent may mark it so.

## Related

- Task `0482` brief and Phase-A `plan.md` (in its task folder).
- [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md),
  [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md),
  [ADR-020](adr-020-per-task-plan-and-worklog-artifacts.md),
  [ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md),
  [ADR-030](adr-030-stop-hook-enforces-turn-completion-contract.md),
  [ADR-032](adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md) A2,
  [ADR-033](adr-033-task-movers-are-producer-only-reversing-adr-025.md),
  [ADR-049](adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one.md),
  [ADR-050](adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed.md),
  [ADR-051](adr-051-one-store-for-tasks-aiboard-is-the-gated-destination-the-reader-is-the-interim.md) D1,
  [ADR-052](adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md).
- Code: `claude/fkit-claude.sh` `build_settings()` (:295-353); `claude/skills-for-role.sh`
  `skills_for_role()` (:54-65); `claude/askuserquestion-marker-hook.sh`;
  `claude/shiploop-marker-hook.sh`; `claude/carry-check-hook.sh` / `.mjs`; `claude/fkit-claude-init.sh`
  `path_contained` (:293), `add_ignore` (:718).
- Task `0121` (observer) — reads this log (D11).
