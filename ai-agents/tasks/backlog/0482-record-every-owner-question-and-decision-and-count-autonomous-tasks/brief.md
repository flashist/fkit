# Record every owner question and decision, and count the tasks done autonomously after plan approval

## ID
0482

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

> ## ⛔⛔ DO NOT IMPLEMENT until the owner gives a direct, explicit "APPROVE" for implementation.
>
> This is **stronger** than the usual *"do not start without the owner's word"*. Being pullable on a
> board is not approval. A plan approval for some other task is not approval. A relayed or inferred
> "go ahead" is not approval. Only the owner's own direct, explicit **APPROVE** for *implementing this
> task* unlocks it.
>
> **Before that APPROVE, the only work allowed** is the read-only investigation and the written
> design proposal in phase A below — no hook, no script, no settings change, no skill or agent edit,
> no ADR marked Accepted, no test, no change to any file outside this task folder.
>
> Owner's own words (2026-10-02, `fkit-lead` session, relayed to a spawned producer): *"Brief a task,
> but make it clear that we shouldn't implement it, until there is a direct and clear APPROVE for
> implementation from me. I agree with all your comments and especially the things that we should be
> careful about and especially about privacy. "end to end" - I mean when I approve the plan, and then
> the agents work without me being involved into it, but you're right, I at least approve plans for
> the tasks at the beginning, so the tasks are not "fully automatic" anyway."*

## Context

**What the owner asked for** (2026-10-02, same `fkit-lead` turn, own words): *"we don't have approved
records about how many tasks fkit is able to do end to end without me being involved. I think it
happens because we don't record all the questions that were asked to me. Basically to a user, to a
human. And it actually might help us in the future to find some retrospective data or figure out why
something was done that way or another way. Maybe we need to record this information into the workbook
file every time anything is asked by from the human or when a human makes proactive decisions without
being asked about some tasks."* ("workbook" = the task folder's `worklog.md`.)

**Scope the lead proposed and the owner agreed to** ("I agree with all your comments") — the six items
under *What to build*. Item 6 is optional and needs its **own** separate approval.

**Owner rulings, 2026-10-02 (`fkit-lead` session, relayed to a spawned producer):**
- **Ruling 1 — what may be committed** (selected option, verbatim): *"Rulings verbatim, chat
  paraphrased — Keep today's practice: decisions/rulings quoted word for word; everything else you
  type only as counts or a short paraphrase. Raw messages stay local."*
- **Ruling 2 — no off-switch; safe by construction or not at all** (his own typed words): *"We're not
  implementing the switch, if the feature is dangerous, we're not going to implement it at all."*
  Consequences: the off-switch is **out of scope**; and the governing principle is that **capture must
  be safe by construction, or it is not built at all**. Phase A must end in an explicit safety verdict
  (Phase A step 2). If the honest verdict is "not safe enough", the recommendation is to **drop the
  feature**, and that goes to the owner.

**Why now:** the owner wants a real number for a conference talk about fkit. Today there is no record
to count from, so any number would be a guess.

**The metric, in the owner's definition:** a task is **"autonomous after plan approval"** when, after
the owner approved its plan, the agents finished it with **no further owner involvement**. The plan
approval itself is expected and does **not** disqualify a task. Nothing is "fully automatic" — do not
use that phrase in the metric or the report.

**What already exists (read at filing, 2026-10-02 — re-check, line numbers drift):**
- `claude/askuserquestion-marker-hook.sh` — a `PreToolUse` hook on `AskUserQuestion` (task `0127`,
  ADR-030). It writes only an empty per-session marker under `.fkit/state/`. It sees the **question**
  at call time, **not the answer**. It must keep working unchanged.
- `build_settings()` in `claude/fkit-claude.sh` wires all fkit hooks (`PreToolUse`, `Stop`,
  `UserPromptExpansion`) into `.fkit/settings/<role>.json`. **Hooks run only in sessions opened by the
  `fkit <role>` launcher** — a plain `claude` session in the same repo is not captured. That is a
  coverage gap the design must state, not hide.
- `.fkit/` is gitignored (`.gitignore` line ~8), and `fkit-claude-init.sh` adds that ignore in
  consuming projects. That is the natural home for local-only raw logs. Note the init script's own
  comment (~:95) that anything stored in `.fkit/` is invisible to teammates — fine for private data.
- `worklog.md` per task (ADR-020), and its decision log that the ship-loops already write
  (ADR-032 A2, task `0147`). The new "Owner involvement" line must sit next to that, not replace it.

**Decisions that bear on this — flagged, not planned around:**
- **ADR-021** — only a session can ask the owner (`AskUserQuestion` is absent in a spawned consult).
  So questions reach the owner only through session hooks — good for capture — but in the
  ship-loops the **lead** asks on behalf of a **worker**. Attribution must map a relayed question to
  the worker's task, not to the lead's session.
- **ADR-049** — an owner-verified close needs a verified human principal, and no channel supplies one.
  A hook-captured answer is **not** such a principal. This task must not be read as, or used to,
  upgrade the `(agent-closed — not owner-verified)` marker.
- **ADR-052** — tasks and sprints are moving to the built-in board as the single store. Where the
  per-task "Owner involvement" data finally lives may change; the design should say how it survives
  that move.
- **Rules-block byte cap** — `fkit-claude-init.sh` refuses a rules block over `RULES_MAX`. Nothing from
  this task goes in the shared rules block.
- **Related, not a dependency:** `0121` (observer agent / skill-tuning) — another "record how the work
  went" idea. The design should note overlap so the two do not build two logs.

## What to build

### Phase A — allowed before APPROVE: investigate and propose (read-only outside this task folder)

1. **Verify the hook mechanics before designing anything.** Check against the Claude Code hooks docs
   **and** with a throwaway local experiment (scratch dir, never committed), and record the evidence:
   - Does `PostToolUse` fire for `AskUserQuestion`, and does its payload carry the owner's **answer**
     (selected option label and any free-text "Other")? What does it carry when the owner dismisses
     the question?
   - Does `UserPromptSubmit` carry the owner's typed text, session id, cwd? Does it fire for a typed
     `/fkit-*` command (vs `UserPromptExpansion`)? Does it **ever** fire for a subagent's spawn prompt
     or a relayed message (it must not count those as the owner)?
   - What identifies the role in a hook (the launcher's role, `agent_type`, or something else)?
   - What happens in a spawned subagent — does any of these hooks fire there?
2. **Give an explicit safety verdict** (Ruling 2): can capture be made **safe by construction**?
   Judge each point and say yes / no / partly with the reason: raw log local-only and gitignored;
   redaction of secrets; a retention rule; no secret and no non-ruling verbatim owner text can reach a
   committed file (Ruling 1); the ADR-049 no-upgrade rule holds. **Name the residual risks** that
   remain. If the honest verdict is "not safe enough", the recommendation is **drop the feature** —
   put that to the owner and do not design around it.
3. **Write a design proposal** in this task folder (`plan.md`) — only if the verdict is "safe" —
   with design questions routed to `fkit-architect`. It must cover every item below, and a **proposed
   split into implementation briefs** (this brief is one gated umbrella; the producer files the
   pieces after APPROVE).
4. **Draft the ADR** (via the architect) as **Proposed**, not Accepted.
5. **Stop.** Present the verdict and the proposal to the owner and wait for the explicit APPROVE.

### Phase B — ONLY after the owner's explicit APPROVE

1. **Automatic capture via hooks.** Every `AskUserQuestion` put to the owner **and his answer** (time,
   session, role), and his own typed messages (to catch decisions he makes without being asked).
   Deterministic — agents cannot forget to record. The existing marker hook keeps working unchanged.
2. **Linking entries to tasks.** The hook does not know the task. Define how each entry is attributed:
   e.g. the session's current task kept in local state, or an agent attributing entries at close.
   Must handle: no task in progress, several tasks in one session, the lead relaying for a ship-loop
   worker, and a typed message that is chit-chat rather than a decision (say how a "decision" is told
   apart, or count all owner messages and say so).
3. **A fixed per-task "Owner involvement" line** in `worklog.md`, written at close from the log — e.g.
   *"plan approved; N questions; M owner-initiated decisions"*. Fixed wording, so it can be counted.
   Decide which role writes it (the close is producer-only, ADR-033) and what it says when no capture
   data exists, e.g. the task predates capture or ran outside a launcher session (an honest
   "unknown", never 0).
4. **The countable metric.** Per the owner's definition above. Countable by `/fkit-status` or a small
   report: tasks autonomous after plan approval / tasks with involvement / unknown. Tasks with no
   capture data are reported as **unknown**, never as autonomous.
5. **Privacy — safe by construction (owner emphasised; Rulings 1 and 2):**
   - Raw logs of owner messages and answers stay **local and gitignored**, never committed — and a
     test proves no capture file lands in a tracked path.
   - **What may be committed (Ruling 1):** the owner's decisions/rulings quoted word for word;
     everything else he types only as counts or a short paraphrase. Raw messages stay local.
   - No secrets: a redaction pass for secret-like content before anything is written, even locally.
   - A retention rule for the raw log (how long it is kept, how it is cleared).
   - **No off-switch (Ruling 2).** Safety comes from the design itself, not from a toggle. If the
     design cannot be made safe by construction, it is not built.
6. **Optional, separately approvable — NOT covered by the APPROVE for items 1–5 unless the owner says
   so:** a read-only, clearly approximate historical count mined from local Claude Code session
   transcripts. Attribution to tasks is guesswork, so every output must say so in plain words. Never
   committed raw; never presented as the real metric.

**Across all of it:** generic for consuming projects (ships with fkit from `claude/`, wired by
`build_settings()`, refresh the `.claude/` copies); nothing in the shared rules block; no absolute
machine paths in any file; zero-dependency `node --test` tests (ADR-014).

## Verification steps

**Phase A (before APPROVE):**
1. `plan.md` records, with evidence (doc reference + local experiment output, no machine paths), the
   answer to every question in Phase A step 1.
2. `plan.md` states the **safety verdict** (Phase A step 2): each safety point judged with a reason,
   the residual risks named, and an overall "safe" / "not safe enough". If "not safe enough", it
   recommends dropping the feature and nothing further is designed.
3. If "safe": `plan.md` covers items 1–5 (and 6, marked optional), the privacy points one by one, the
   coverage gap for non-launcher sessions, and a proposed split into implementation briefs with
   dependencies.
4. If "safe": a **Proposed** ADR draft exists. Either way, `git status` shows no change outside this
   task folder and the ADR draft.
5. The worklog records the date and channel of the owner's APPROVE (or that it has not been given).

**Phase B (after APPROVE):**
6. A test drives the capture hooks with recorded payloads: an `AskUserQuestion` + answer and a typed
   owner message each produce one local entry with time, session and role; a subagent spawn prompt
   produces none.
7. A test proves raw capture writes only under a gitignored path (`git check-ignore` passes for it).
8. A test proves redaction: a secret-like string in an answer never reaches any written file.
9. A test proves Ruling 1: a non-ruling owner message reaches a committed worklog only as a count or
   short paraphrase, never verbatim; a ruling is quoted word for word.
10. A worked example: a fixture task with plan approval only reports "autonomous after plan approval";
    one with a later question reports involvement; one with no data reports "unknown".
11. The rules block size is unchanged (`fkit-claude-init.sh`'s cap check still passes, same bytes).
12. Existing hook tests (`askuserquestion-marker-hook`, turn-completion, skill-ownership) still pass.
13. No absolute machine path in any changed file.

## Notes
- **Depends on:** nothing to start Phase A; Phase B depends on the owner's explicit APPROVE.
- **Blocks:** nothing
- **Why one brief, not several:** the owner asked for *a* task, gated on his APPROVE, and the real
  shape depends on what the hook payloads actually carry (investigation-first). Splitting now would
  fix seams before the facts are in. Phase A's deliverable includes the proposed split; the producer
  files those briefs after APPROVE.
- **Who does what:** `fkit-coder` owns it; design questions go to `fkit-architect`, who also writes
  the ADR. The `worklog.md` close line touches the producer-only close path (ADR-033) — the design must
  say how without giving the coder a mover.
- **Item 6 needs its own approval**, separate from the APPROVE for items 1–5.
- **Do not conflate with ADR-049:** capture records involvement; it does not verify a human principal
  and never upgrades the agent-closed marker.
- **Consulted:** none at filing.
- Filed 2026-10-02 by a spawned `fkit-producer` (no owner channel, ADR-021) from the lead-relayed
  request and agreement above; it decides nothing beyond them.
