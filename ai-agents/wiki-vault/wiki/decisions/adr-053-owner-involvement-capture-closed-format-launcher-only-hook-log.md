# ADR-053: Owner-involvement capture — closed-format, launcher-only hook log; a deterministic per-task line; "autonomous after plan approval" counted conservatively

**Date**: 2026-10-05
**Status**: proposed — ⛔ **NOT accepted.** It becomes `accepted` **only by the owner's direct ruling** (brief B0, task `0485`); no agent may mark it so.

> ⭐ **Phase B items 1–5 of task `0482` were APPROVED by the owner on 2026-10-05** (`AskUserQuestion`, `fkit-lead`
> session, Sprint 10 ship-loop, relayed by the lead). ⛔ **That APPROVE is not acceptance of this ADR.** ⛔
> **Item 6** (a historical count mined from local transcripts) is **NOT approved** — it needs its own approval.
> The ADR was amended three times on 2026-10-05 after review rounds 1–3 (R1–R15); where it differs from
> `0482`'s Phase-A `plan.md` §3 it governs, and B0 must be asked **against this text with the differences
> listed**. ⚠️ **Harness pinned:** the hook facts were measured on Claude Code **2.1.289** only; the
> interactive terminal UI was **not** tested live.

## Context
The owner wants a real count of tasks fkit finished **without his involvement after he approved the plan**
(for a conference talk). Nothing recorded that, so any number would be a guess. Two owner rulings bound the
design (task `0482`): **Ruling 1** — rulings may be quoted word for word in committed files; everything else he
types only as counts or short paraphrase; raw messages stay local. **Ruling 2** — no off-switch: *"if the
feature is dangerous, we're not going to implement it at all."* Safe by construction, or not built.

**Measured hook facts (Phase A, 2.1.289; headless runs + an SDK-host driver in a scratch dir):** PostToolUse
fires for an answered `AskUserQuestion` and carries the answers (a free-text "Other" is only distinguishable
by comparing to the labels); a **dismissed** question fires PreToolUse but no PostToolUse (SDK path only —
terminal UI unverified); `UserPromptSubmit` carries the raw typed prompt and fires for a typed slash command
too, **not** for a subagent spawn prompt, **but does** for a harness-injected background-agent notification;
the main launcher session has `agent_type` `fkit-<role>` and no `agent_id`; hooks exist **only** in
`fkit <role>` sessions (`build_settings()`).

## Decision
- **D1 — Closed-format capture only.** Every stored field is from a fixed list or a narrow format: hook-made
  UTC timestamp; session_id (failing → `unknown-session`); agent_type only if `fkit-<role>` for a known role,
  else `other`; a fixed event-kind list; task id exactly four digits; command_name only if a known skill, else
  `other`; answer kind `option` | `free-text`. Both fixed lists are built by the launcher **from the one source**
  (`skills_for_role()`) on every launch and passed as hook arguments — never hand-copied (a hand copy would be
  a seventh mirror, ADR-018). ⛔ **No free text is ever stored, even locally** (owner OQ1): no prompt, answer,
  label, question text, command args or transcript path. **Privacy comes from an allow-list, not redaction.**
- **D2 — Events (main session only; entries with an `agent_id` ignored):** `asked` (PreToolUse
  `AskUserQuestion`, per question); `answered` (PostToolUse, with answer kind); a strict `[task NNNN]` tag in the
  question field yields only the four digits; `typed` / `injected` (UserPromptSubmit; known harness prefix →
  `injected`); `command` (slash-command expansion) and `expanded` (any other expansion — counts as involvement
  but never binds or proves liveness; owner: *"Yes, count it"*); `bind` (Agent/Task spawn with a `task: <id>`
  line or a `plan:` pointer); `plan-write` (Write/Edit of a task's `plan.md`). The existing marker hooks stay
  byte-unchanged.
- **D3 — Storage is fail-closed:** append-only day files under `<project>/.fkit/owner-log/`; project root from a
  launcher argument, never cwd; path-segment and symlink checks; `git check-ignore` must confirm the target is
  ignored; each line written whole in one `O_APPEND` write. A malformed line makes any otherwise-autonomous
  task whose window overlaps that day read `unknown (log-corrupt)` (owner: *"Yes, mark unknown"*). Any failure
  → nothing written; the hook always exits 0, **never prints to stdout**, never blocks.
- **D4 — Retention: each entry becomes deletable at ~30 days** (owner OQ4, not the draft's 90), pruned on every
  capture write and every summarizer run. ⚠️ **On disk vs what readers see (owner R9, accepted as designed):** an
  expired file stays on disk until the next capture or summarizer run in that project — **indefinitely if the
  project is never used again**. Readers ignore everything before W (end of the UTC day containing now − 30 days).
- **D5 — Linking at summary time, deterministically.** Sessions bind to tasks via `command` / `bind` /
  `plan-write`; a tagged entry counts for its task (and also as untagged if that task is not bound); untagged →
  every bound task; no bound task → **unattributed**, counted against every task whose window covers it and
  shown separately (owner OQ2). `unknown-session` entries never bind. **Doubt counts involvement for more tasks,
  not fewer.**
- **D6 — Anchor:** the first `plan-write` for the task. ⛔ It is **not** evidence of a human approval (ADR-049).
- **D7 — Classification:** `autonomous-after-plan-approval` needs an anchor, liveness (a captured `typed` or
  `command` in the binding session), W not later than the anchor, and **zero** attributed and unattributed owner
  entries after it; else `involved`, `involved-unattributed`, or `unknown (<reason>)`. "Fully automatic" is
  never used.
- **D8 — One fixed-wording worklog line written by a deterministic node script** (counts, classification,
  reason, scope "captured: launcher sessions, this machine"; no owner text; no "approved"/"verified"). Every
  typed message counts (owner OQ3 — "typed messages", not "decisions"). The **producer** runs it in
  `/fkit-task-done` before the move (ADR-033); if it cannot run, a fixed `unknown (summary-unavailable)` line.
- **D9 — The metric** counts done tasks only; no line → `unknown`; reports always say "captured channels only".
- **D10 — Surviving ADR-052:** the same text becomes a board worklog entry written `--by producer`.
- **D11 — One log:** task `0121` and any later observer **read** it; no second log.
- **D12 — Not a verification:** capture never feeds or upgrades `(agent-closed — not owner-verified)`.
- **D13 — Launcher-only:** plain `claude` sessions, claude.ai, hand edits, commits, other machines are
  uncovered — **stated in every report**.

## Consequences
- **Positive:** a countable, honest, conservative metric; no owner text in any file, local or committed; one
  log `0121` can reuse; existing hooks untouched.
- **Costs:** six new hook entries (small start-up cost per prompt and per Write/Edit, plus a prune scan); two
  prose conventions (`task: <id>` spawn line, `[task <id>]` relay tag); a step in a mover (ADR-050, coordinate
  with ADR-052); no "why" in the log; chit-chat counts as involvement; sprint-loop tasks will often read
  `involved`; a task anchored before W reads `unknown (log-pruned)`.
- **Residual risks — autonomy can still be over-reported:** uncovered channels; a mid-task hook failure looks
  like silence; Claude Code payload drift silently stops capture (partly mitigated by liveness); a mis-tagged
  relayed question; a message typed between approval and the `plan.md` write; an owner prompt starting with a
  harness prefix; `plan.md` written via Bash; hand-edited log files.
- **Re-raise only if:** a measured payload fact changes (re-measure, then amend); ADR-052's board gains a field
  for this; `0121` needs an event kind or more than 30 days of history (amend; never a second log).
- ⛔ **Do not re-raise:** storing text; an off-switch; counting only "decisions"; ignoring unattributed messages.
- ⚠️ **Not owner rulings (corrected 2026-10-05):** R1, R5, R6, R7 were fixed by the coder under the loop's
  standing approval — an earlier version wrongly listed "R5–R7 — fix" as an owner ruling. Filing the Phase-B
  briefs before acceptance was **also not ruled**; it stands unless the owner says otherwise at B0.

## Related
- [[tasks/record-every-owner-question-and-decision-and-count-autonomous-tasks]] — `0482`, the gated umbrella whose Phase A drafted this; Phase-B briefs `0485`–`0491` (open, Backlog board), B0 = `0485`
- [[decisions/adr-049-owner-verified-close-requires-a-verified-human-principal-no-channel-supplies-one]] — D6/D12: capture is never a verified human principal
- [[decisions/adr-033-task-movers-are-producer-only-reversing-adr-025]] · [[decisions/adr-050-prose-is-not-a-transaction-how-the-four-movers-are-executed]] — the producer-only close the D8 line rides on
- [[decisions/adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints]] — D10
- [[decisions/adr-020-per-task-plan-and-worklog-artifacts]] — the `plan.md` write that anchors (D6) and the worklog the line goes in
- [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] · [[decisions/adr-030-stop-hook-enforces-turn-completion-contract]] · [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]]
- [[systems/role-locked-sessions]] — the launcher-built settings the hooks are wired into
- [[tasks/sprint-10-the-0472-0482-batch]]
- *Added 2026-10-10 (sync `3915417`→`79a7dbf`, closing a one-way link):* [[systems/fkit]] — fkit
