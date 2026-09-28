# Evaluation: keeping the ship-loop conductor sessions from bloating their context

> ## ⛔ DECIDED 2026-09-28 — dated note. The rest of this report is left unchanged below it.
>
> **Outcome:**
> - **The owner manages context by hand.**
> - **Options 1, 2 and 3 are rejected**, and so is the self-restarting-session idea. Reasons:
>   compaction degrades session quality, and the alternatives are workarounds.
> - **The skill-cut finding (§1.3) stays on record, but no action is to be taken.**
> - **No brief is to be filed from this report.**
> - The "Status: OPEN" line below is historical; this note supersedes it.
>
> **The owner's own typed words (verbatim, his, may be quoted):**
>
> 1. On the approach in this report:
>    > *"To be honest I don't like this approach. The main negative thing that has been found is that
>    > compacting degrades the quality of sessions."*
> 2. Next, the lead proposed "fresh sessions, no compaction": a **self-restarting session** (the lead
>    writes a hand-over, ends its session, and the launcher starts a fresh one), plus two fallbacks —
>    external keystroke injection of `/clear`, and a semi-automatic `/clear` followed by a hook reload.
>    He rejected all of them:
>    > *"I don't like the approach, it looks like a workaround. I think I will continue working with
>    > fkit and controlling it myself, so I will try to manage the context manually, because there is
>    > no good way to handle it otherwise."*
> 3. On the ~20k-character skill cut after compaction (§1.3). This also applies to his own manual
>    `/compact`. He was offered three choices: brief the core-plus-reference restructure, use a
>    re-run-the-loop-command workaround, or discuss it. He chose none of them and typed:
>    > *"DO nothin"*
> 4. On recording this decision (the option he selected, verbatim):
>    > *"Yes — Adds a short dated note: you chose manual context management; auto-compaction, the
>    > progress file and self-restart were rejected, and why. So nobody re-proposes them."*
>
> **Usage advice only — not an fkit change.** The lead suggested three habits to the owner:
> - prefer `/clear` between tasks;
> - give `/compact` focus instructions;
> - after a manual compaction, re-run the loop command so the full skill text is loaded again.

- **Date:** 2026-09-27
- **Author:** fkit-architect (spawned consult from `fkit-lead`, hop 1 — the owner was not reachable
  from this spawn, so every open point is a question in §11, not a guess)
- **Kind:** evaluation (`/fkit-evaluate-approach`) — design only. No code, no skill or agent edit, no
  brief, no ADR.
- **Status:** ⏸ **OPEN — input to an owner discussion. Nothing here is decided.**

> ## ⛔ Owner conditions — read before anything else
>
> The owner's own typed words (2026-09-27, `fkit lead` session, relayed by the lead):
>
> > *"#1, but after the design is ready I want to do a thorough discussion of the proposed feature, how
> > it's gonna work and how it's gonna be implemented. Also, I want to make it clear, that if we already
> > have a brief for that task, the task shouldn't start, until I specifically approve it (because it
> > might change the way fkit work in general)."*
>
> What that means for this document:
>
> 1. **This report is input to a discussion with the owner.** It is not a work order.
> 2. **No brief may be filed from it** until that discussion has happened.
> 3. **If a brief is ever filed from it, that task must not start without the owner's specific
>    approval** — "accepted" or "filed" is not approval to start. Any brief written from this report
>    should carry that condition in its own header.

---

## 0. The short version

- **The problem is real and measured.** The two longest lead sessions on this machine reached **1.0M
  tokens** and **712k tokens** of context. On average every model turn re-read **~400k tokens**. Auto
  compaction fired **at ~1.0M tokens**, and the owner compacted by hand four times (§1).
- **The literal ask can't be built.** Claude Code does not let the model run `/compact` or `/clear`. No
  hook can start a compaction either (documented, §2). So "compact when a task closes" is not something
  an instruction can do.
- **A worse problem came up during the measuring.** After a compaction, Claude Code re-attaches a
  skill's text **cut at ~20,000 characters**. The sprint loop's `SKILL.md` is ~40,000, so it **loses its
  second half**: the decision-relay gate, the close rules, the stop table and the **hard rules**. The
  coder's task loop loses its last ~15%, including its hard rules (§1.3). **This is a safety gap today,
  whatever we do about bloat.**
- **Recommendation — Option 1, in phases:** (A) make both loops **survive** a compaction; (B) keep loop
  progress in a **run file on disk** and have Claude Code compact **earlier and on its own**, at a size
  you pick; (C) make the session **grow more slowly** (short worker hand-backs, the already-ruled
  pointer-only plan carry); (D) optionally, and only if a test run shows it is safe, allow automatic
  compaction **only between tasks**. That last one is the closest honest thing to your original ask.
- **Main trade-off:** compaction still happens while you are away. We make it harmless and cheaper; we
  do not make it happen at a moment we choose (except via the optional Phase D).
- Two bigger redesigns (a per-task sub-driver, and hosting the loop in the Agent SDK) are assessed and
  **parked** (§5).

---

## 1. The problem, measured

**Method.** I read the local Claude Code transcripts for this project (`~/.claude/projects/…`, JSONL,
not in git). I counted only the main conversation, not the workers' own transcripts. "Context" is the
real per-turn figure from the API `usage` field (input + cache read + cache write). The content shares
are **character** counts, so they are proportions, not exact token counts. Session A has a ship-loop
marker (`.fkit/state/shiploop-00fc3805-…`, written by `claude/shiploop-marker-hook.sh:64`).

### 1.1 Two long conductor sessions

| | **Session A** (`00fc3805`) | **Session B** (`992b2d5c`) |
|---|---|---|
| Span | 2026-08-25 → 09-14 (**20 days, one session**) | 2026-09-14 → 09-22 |
| Model turns | 2,258 | 865 |
| Peak context | **1,006,109** tokens | **711,548** tokens |
| Average context per turn | **~425k** | **~388k** |
| Turns above 500k | 832 | 277 |
| Compactions | 5: **auto** at 1.00M · manual 655k · manual 388k · **auto** at 1.01M · manual 814k | 1: manual at 679k |
| After a compaction | 15k–25k tokens; each compaction took ~2 min | 21k; ~2.8 min |
| Total input tokens processed | ~960M (only ~60M were new cache writes; the rest re-reads) | ~335M |

What that says:
- **Auto compaction fires only at ~1M** on this 1M-context model. Before that, every turn pays to
  re-read everything.
- **The owner already compacts by hand when he is present** (4 of 6 compactions). The pain is the time
  he is away.
- **One lead session was reused for 20 days.** Some of the bloat is the session living far longer than
  one sprint run.

### 1.2 What fills the conductor's context

| Share of the conversation (characters) | A | B |
|---|---|---|
| **Worker hand-backs** (the final report of each spawned worker) | **28.9%** | **23.0%** |
| **The driver's own spawn prompts** (what it sends to workers, including plan pastes) | **24.2%** | **21.4%** |
| Shell commands and their output (board reads, `cat plan.md`, checks) | 20.9% | 12.4% |
| The driver's own prose to the owner | 7.9% | 11.6% |
| `AskUserQuestion` questions and answers | 7.0% | 6.7% |
| Skill texts loaded into the conversation (incl. re-loads) | 4.6% | 8.5% |

- Hand-back size: median **~6.5k chars** (~1.6k tokens), 90th percentile ~15k, largest 48k.
- Spawn prompt size: coder median ~6–7k chars, largest **50k** — the verbatim plan carry
  (`fkit-sprint-ship-loop/SKILL.md:160-237`). A plan is in context up to four times per task: shown to
  the owner, `cat` for the carry, pasted into Build, pasted into Process-review.
- **Growth per task, rough:** Session A grew ~4.3M tokens in total across ≤77 producer spawns (an upper
  bound on closes), so **≥ ~55k tokens per task.** *(Inferred; producer spawns also cover non-close
  work, so the true per-task figure is probably higher.)*

**The lead's hypothesis, checked:** worker hand-backs are **about a quarter**, not the dominant share.
The driver's **own outgoing prompts are nearly as large**. Shrinking hand-backs alone slows growth by
perhaps a quarter; it does not solve the problem.

**Workers are not the problem.** Across 393 worker transcripts in A and B: median peak 120k tokens,
90th percentile 181k, largest 534k; **none compacted**. (This matters for §4 Part B.)

**Not measured:** the coder's `/fkit-task-ship-loop` sessions. None were left in the retained transcripts.
By design (`fkit-task-ship-loop/SKILL.md:142-155`) that loop builds and verifies **in its own context**,
so its bloat is its own file reads and test output, not hand-backs.

### 1.3 The finding that matters most: skills are cut in half after a compaction

After Session B's 2026-09-18 compaction, the transcript shows Claude Code re-attaching each skill used
so far (`invoked_skills`). Each one was cut to ~20,000 characters and ended with:

> `[... skill content truncated for compaction; use Read on the skill path if you need the full text]`

The local binary (2.1.283) confirms the rule: a skill is cut to *N* tokens × 4 characters, which gives
the ~20,000 seen. **Observed, not documented.** It is a harness constant and can change.

| Skill | Size | Kept after compaction | **Lost** |
|---|---|---|---|
| `fkit-sprint-ship-loop` | ~39.8k chars | ~19.9k | **~50%** — cut mid-way through the plan-carry steps (~body line 187 of 410). Gone: §3 the decision-relay gate, §4 close posture (no close for degraded runs, never self-cancel), §5 advance, the stop-conditions table, progress reporting, **all Hard rules** |
| `fkit-task-ship-loop` | ~23.4k chars | ~19.9k | **~15%** — cut inside the failure table. Gone: the rest of the exit rows, the invariants, **all Hard rules** (don't commit, never write the wiki, log every autonomous choice) |

In Session B the model **re-loaded the full sprint loop on 2026-09-20**, two days after the
compaction. The harness labelled the reload *"(Re-invocation of /fkit-sprint-ship-loop — the previously
loaded copy was truncated by compaction; the full instructions follow.)"* I cannot tell what the loop
did in between. **This is exposure, not a proven failure.** The universal rules block in `CLAUDE.md` and
the agent's own system prompt are not part of the summarized conversation, so the **universal** hard
rules (no commit, wiki writes only by the wiki role, no secrets) are not lost. *(Inferred from how
system context works; not tested.)* The **loop-specific** rules are the ones at risk.

---

## 2. What Claude Code can and cannot do — each fact labelled

**Source labels.** *Documented* = current Claude Code docs, as quoted by a `claude-code-guide` agent on
2026-09-27. ⚠️ I could not fetch the docs myself (network policy blocked WebFetch and curl), so those
are **relayed quotes, not first-hand**. *Observed* = seen first-hand in this machine's transcripts or
the installed 2.1.283 binary. *Inferred* = my reasoning.

| # | Fact | Status |
|---|---|---|
| F1 | The model **cannot run `/compact` or `/clear`**. Built-in commands can't be invoked programmatically. | **Documented** (commands page) |
| F2 | **No hook can start a compaction.** `PreCompact` sees `trigger` (manual/auto) and can **block** a compaction (exit 2 or `decision: block`). | **Documented** (hooks page) |
| F3 | `SessionStart` fires with matcher **`compact`** after a compaction and can add context. ⚠️ A GitHub issue (#15174) reports that the compact-matcher output **is not added**. | Feature **documented**; the bug is a **report, unverified** → spike S1 |
| F4 | The auto-compact point **can be changed**: `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` (a percentage). The 2.1.283 binary also has `CLAUDE_CODE_AUTO_COMPACT_WINDOW` and an `autoCompactWindow` **setting** (it prints *"set CLAUDE_CODE_AUTO_COMPACT_WINDOW=… (or the autoCompactWindow setting)"*). | Env var **documented**; window var and setting **observed** (docs status unclear). ⚠️ **This corrects the brief's fact** that there is "no documented setting to lower the threshold". |
| F5 | **Thrashing.** If the context refills to the limit within 3 turns of a compaction, 3 times in a row, Claude Code **stops auto-compacting** and shows an error. | **Documented**; also **observed** in the binary (`rapid_refill_breaker_tripped`) |
| F5a | The brief's inference that thrashing makes auto-compact "unsuitable for long loops": the stopping is real (F5). But a conductor grows ~55k per task, so it **never refills within 3 turns**. Thrashing only happens when one huge read or tool output fills the window. **The loop's real risk is different:** compaction fires at a random moment, and the summary can drop the loop's working state. | **Inferred** from F5 + §1 |
| F6 | `/compact <instructions>` steers a manual compaction. `CLAUDE.md` may carry "when compacting, keep …" guidance. | **Documented** |
| F7 | A subagent's tool calls stay in its own context. The parent receives **only its final message**. | **Documented** |
| F8 | The model has **no documented way to read its own context size**. The **status line** receives `context_window.used_percentage` (**documented**). Transcript lines carry per-turn `usage` (**observed**; the format is undocumented). Hooks receive `transcript_path` (documented common input; not re-checked today). | as stated |
| F9 | Headless `claude -p`: no one can answer, so asking tools are denied. **No live owner questions.** | **Documented** |
| F10 | Agent SDK: `AskUserQuestion` reaches the host program through the `canUseTool` callback, and the host answers it. | **Documented** |
| F11 | Whether sending `/compact` as a prompt through the SDK compacts: **conflicting** (the guide agent said no; my recollection says the SDK accepts some slash commands). Matters only for Option 3. | **Unverified** |
| F12 | After a compaction, invoked skills are re-attached **cut to ~20,000 chars** (§1.3). | **Observed** (transcript + binary 2.1.283) |

---

## 3. Why the literal ask can't be built — and the closest honest versions

**The ask:** *"when a task is closed and there are no other agents running, the compact command should
be triggered."*

- **Not buildable as asked.** F1: the model can't run `/compact`. F2: no hook can start one. An
  instruction in a skill or in `CLAUDE.md` can't do what the runtime forbids. *(Same kind of finding as
  [ADR-024](../decisions/adr-024-ship-loop-owner-question-timeout-is-not-built.md): an intuition about
  what is possible, meeting the runtime's turn model.)*
- **The closest honest versions:**
  1. **Compact automatically, but earlier** — lower the auto-compact point (F4). Automatic, no owner
     needed; but it fires at a *size*, not at a task boundary.
  2. **Compact automatically, only at task boundaries** — (1) plus a `PreCompact` hook that **blocks**
     automatic compactions while a task is mid-flight (F2). This comes closest to the ask, and it is
     also the riskiest (§4 Part D).
  3. **Pause at a task boundary and ask you to run `/compact`** — works, but it needs you present,
     which is what you wanted to avoid.

---

## 4. Option 1 (recommended) — survive, compact early, grow slower

Four parts. A is a safety fix worth doing even if nothing else is done. D is optional and
spike-gated.

### Part A — Make both loops survive a compaction (safety fix)

- **A1. Put each loop's essentials first.** Restructure both `SKILL.md` files so their first ~16,000
  characters (a margin under the ~20,000 cut) hold a **complete core**: the steps, the owner gates, the
  stop conditions, the hard rules, and an *"after a compaction"* rule. The long rationale and
  constructions (the plan-carry six steps, the half-landed-close cases, the stop table's full cells)
  move into **reference files in the same skill folder**, read at the step that needs them. There is
  precedent for extra files in a skill folder (`fkit-status/dashboard.sh`). Add a **size-budget test**,
  like `test/rules-block-budget.test.js`, so the core can't quietly grow past the cut. The test pins
  *our* budget and says why; the harness number itself is observed and can move.
- **A2. Re-anchor after a compaction.** A hook injects one line into the session after a compaction,
  and only when the existing ship-loop marker is present for this session (`.fkit/state/shiploop-<id>`,
  `claude/shiploop-marker-hook.sh:64`): *"A ship loop is running here. Before your next step, Read
  `<SKILL.md>` in full and the run file `<path>`."* **First choice:** `SessionStart` with matcher
  `compact` (F3). **Fallback, if spike S1 shows that output is dropped:** a `PreCompact` hook writes a
  flag file, and the next `PostToolUse` hook turns it into added context and clears it. This extends
  the launcher's existing hook set (`build_settings()`, `claude/fkit-claude.sh:295`).
- **A3. Compaction guidance, placed where it is not capped.** Two lines in `fkit-lead.md` and
  `fkit-coder.md` (their system prompts): *"If this conversation is summarized while a ship loop runs,
  the summary must keep: the run file path, the current task and step, workers in flight, any pending
  owner question word for word, and the instruction to re-read the loop skill in full."* **Not** in the
  shared rules block: it has ~446 bytes free against the owner's ≥400 target
  (`test/rules-block-budget.test.js`). ⚠️ Whether the automatic compactor reads agent-prompt guidance
  the way it reads `CLAUDE.md` guidance is **inferred** → spike S4.

### Part B — A run file on disk, and compaction earlier and on its own

- **B1. The run file** (the lead's idea 2), `.fkit/state/runs/<run-id>.md`:
  - **Where:** `.fkit/state/` — local, gitignored (`.gitignore`: `.fkit/`), already used for session
    markers. **Not** under `ai-agents/`, because everything durable is already in git: statuses on the
    board and brief, and `plan.md` / `worklog.md` / `review.md` in the task folder
    ([ADR-020](../decisions/adr-020-per-task-plan-and-worklog-artifacts.md)). The run file holds only
    what is lost today when memory goes:
    - the per-run skip set (`fkit-sprint-ship-loop/SKILL.md:111-113` — today *"in-session"* only);
    - the current task and step;
    - **workers in flight** (step, and which paths each was told to write) — needed because an async
      worker's report can arrive *after* a compaction;
    - a pending owner question, word for word;
    - the roll-up so far: shipped / blocked / pending, each close's marker, and each task's coverage
      state.
  - **It is a cache, never the authority.** If it disagrees with the board or the task folder, **disk
    records win**, and the loop re-derives as ADR-020 already requires. This is the same line as
    `0167`'s no-self-report rule
    ([report](2026-08-04-sprint-driver-response-to-a-dead-worker.md) §3).
  - **Who writes it:** the driver, one small edit per step. Movers, statuses and ledgers are untouched.
  - **Across sessions:** on start, the loop looks for an unfinished run file for the same board and asks
    you (`AskUserQuestion`): *resume run X, or start fresh?*
  - **Overlap:** backlog task
    [`0228`](../../tasks/backlog/0228-write-the-resume-doctrine-section-into-the-sprint-loop/brief.md)
    (the sprint loop's `## Resume doctrine`) covers how to trust disk on resume. The run file is where
    *"what was I doing"* lives. The two should be designed together — a sequencing question for the
    producer and you.
- **B2. Compact earlier** (the honest version 1 from §3). The launcher already writes a per-role
  settings file (`.fkit/settings/<role>.json`, `claude/fkit-claude.sh:295-348`). For the **lead** and
  **coder** roles it would also set the auto-compact point, e.g. a **300k** window.
  - At ~55k per task, that is a compaction roughly every 5 tasks instead of every ~18.
  - Average context per turn drops from ~400k to roughly ~160k, so each turn costs **~2.5× less**
    input. *(Inferred arithmetic.)*
  - Post-compaction size stays ~20k (§1.1).
  - ⚠️ **Scope risk:** the setting may apply to **workers too** (same process). Historically **11 of
    393 workers** went past 300k (§1.2), so they would compact mid-job. Spike S3 settles which knob
    works in launcher settings and whether it is per-agent. If it is global, pick ~400k or accept the
    risk — your call (Q3).

### Part C — Grow more slowly

- **C1. Short hand-backs** (the lead's idea 1). Workers already return one of `DONE` / `NEEDS-DECISION`
  / `BLOCKED` (`fkit-sprint-ship-loop/SKILL.md:252-263`).
  - Add a **size budget** to `DONE` and `BLOCKED`: ~15 lines, plus a `details:` path. The worker writes
    its full report where it already belongs: `worklog.md` for the coder, `review.md` for the reviewer,
    and a close-out record in the task folder for the producer.
  - **`NEEDS-DECISION` keeps its full question, options and context — no cap.** Decisions are what you
    need to see.
  - **The tension, named:** the output rules say a prescribed shape is produced *"in full"*. Under this
    change the **full shape still exists, in the file**. What changes is what reaches the driver's
    context, and what the driver shows you per task: a short plain summary plus the path, instead of the
    whole packet (`fkit-sprint-ship-loop/SKILL.md:359-370`). **That changes what you see, so it is your
    decision (Q4).** Backlog `0410` (how agents report status to you) is related.
- **C2. Check a close with a script, not by reading.** Today the driver reads the producer's full
  close-out report to confirm a close landed (`fkit-sprint-ship-loop/SKILL.md:287-293`). A read-only
  check could do that deterministically. That check is backlog `0407`, the mover-outcome verifier,
  gated behind ADR-050 and **not authorised to start**.
- **C3. Stop pasting whole plans.** You already ruled (2026-08-24) to sanction the **verified-pointer**
  carry (backlog `0331` ADR → `0333` skill edit, both unbuilt). Shipping it removes up to 21–33 KB of
  pasted plan per spawn, twice per task.
- **C4.** A1's shorter skill core also makes every skill reload cheaper.
- **Estimated effect of C1+C3:** growth per task down by roughly **a quarter to a third**. *(Inferred
  from the §1.2 shares; not a fix alone. That is why B2 carries the load.)*

### Part D (optional, spike-gated) — automatic compaction only between tasks

- A `PreCompact` hook **blocks an automatic compaction** (F2) while the run file says a worker is in
  flight or a task is mid-step. It **lets it through** at a task boundary, or after *N* blocked tries
  (fail-open).
- It only makes sense with B2: at a 300k window on a 1M model there is ~700k of headroom, and a task
  adds ~55k.
- **This is the closest thing to your original ask.**
- ⛔ **Unknowns that could make it harmful:**
  - Does a blocked automatic compaction retry on the next turn?
  - Does a hook block count toward the consecutive-failure breaker? The binary has a
    `failure_breaker_open` path. If it does, blocking could **switch auto-compaction off for the rest
    of the session**, and the loop would run into the hard limit.
- Spike S2 decides this. **Sprint loop only.** The coder loop has no inner boundary; its task *is* the
  loop.

### The coder's task loop, specifically

Its bloat comes from its own build and verify work, so C1 helps little. What helps is **A** (its hard
rules are cut today), **B2**, and two small habits:

- the loop's final report tells you to start the next task in a fresh session (`/clear`);
- long test output is pushed into a subagent by default. Step 5 already allows *"sub-agents where they
  help"*.

Its durable state already exists (ADR-020). A run file adds only the step, the workers in flight and a
pending question.

### Checkpoint pauses (the lead's idea 4) — kept as an opt-in fallback, not the default

This would stop at a task boundary and ask you to `/compact`. It pulls you back in, which is what you
wanted to avoid. It is also hard to trigger well: the loop can't read its own context size (F8). A
count-based trigger ("N tasks since the last compaction") would be enough, if you ever want the pause
(Q9).

---

## 5. The other options, and the baseline

- **Option 0 — habits only.** Start a fresh lead session per sprint run; compact by hand when you are
  present. No effort. It does not fix the time you are away, and it does not fix §1.3.
- **Option 2 — a per-task sub-driver.** The sprint driver spawns one short-lived *task driver* per
  task. That task driver runs the plan/build/review steps and returns only envelopes. When it needs
  you, it returns `NEEDS-DECISION`; the top driver asks you and resumes it (`SendMessage` continues a
  spawned agent with its context intact). The top session then grows maybe ~5–10k per task
  *(estimate)*.
  - Costs:
    - **Breaks the two-hop budget.** The workers' own consults would be hop 3
      ([ADR-010](../decisions/adr-010-role-locked-sessions-and-skill-lockdown.md)).
    - Relies on `SendMessage` resume, a harness feature that appears nowhere in fkit's docs and may
      change between versions.
    - The plan gate becomes a relay across three contexts.
    - The coder's write carve-out keys on the caller being `fkit-sprint-ship-loop`
      (`claude/agents/fkit-coder.md:60-68`), so it would have to widen. That makes **the process gap
      the lead flagged** load-bearing.
    - The loops' session-only rule would have to be rethought.
    - Amendments to [ADR-031](../decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)
      and [ADR-032](../decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md).
  - Large effort; hard to reverse.
- **Option 3 — host the loop in the Agent SDK** (the lead's idea 5). A small Node program runs one
  fresh session per task and answers `AskUserQuestion` itself through `canUseTool` (F10), in its own
  terminal UI. It gives **truly fresh context per task**, and compaction stops mattering. Costs:
  - a new host process around the runtime, which runs against the spirit of
    [ADR-009](../decisions/adr-009-claude-code-native-is-the-only-runtime.md);
  - the launcher's role lock, hooks and settings must be re-plumbed into SDK options (unverified);
  - fkit's first runtime npm dependency;
  - you would answer questions in a different UI.
  - Largest effort.

### Comparison

| | Keeps context small | Loop survives compaction | You can stay away | Effort | Reversibility | ADR friction |
|---|---|---|---|---|---|---|
| **0 Habits** | only when you're present | ✗ (§1.3 stays) | ✗ | none | total | none |
| **1 Survive + early + slower** (rec.) | ✓ (bounded by the window) | ✓ (A1–A3, B1) | ✓ | medium (~8–10 small tasks, 4 spikes) | high — settings and text; the run file is a cache | low: amends ADR-031's accepted residual, extends ADR-020 |
| **1 + Part D** | ✓ | ✓ | ✓, compaction only between tasks | + one hook | high (switch off) | low; **risk** if the breaker trips (S2) |
| **2 Sub-driver** | ✓✓ | mostly moot | ✓ | large | medium | high: ADR-010 hops, ADR-031/032, coder carve-out |
| **3 SDK host** | ✓✓✓ | moot | ✓ (different UI) | very large | low | high: ADR-009; new dependency |

---

## 6. Recommendation

**Option 1, in phases A → B → C, with D only if spike S2 is clean and you want it. Park Options 2
and 3.** Re-raise them only if Option 1 is measured and found insufficient (for example, a sprint run
still averages above ~200k per turn with B2 in place).

- **Why:**
  - It fixes the §1.3 safety gap, which exists today regardless of bloat.
  - It gives you "compacts on its own while I'm away" (B2), cheaply, with the existing launcher and
    hook machinery.
  - It leaves how workers are spawned **unchanged**, so no carve-out, hop or consent rule moves.
- **Main trade-off:** compaction still lands at an arbitrary moment (unless D works), and every summary
  loses detail. We accept that and make the loop lean on disk records, which ADR-020 already says it
  must.

---

## 7. How it would work, day to day (Option 1, all phases)

**Sprint run.**
1. You open `fkit lead` and run `/fkit-sprint-ship-loop`. The loop creates `.fkit/state/runs/<run-id>.md`
   (or, if an unfinished run for this board exists, asks: *resume or start fresh?*).
2. Plan gate as today: you approve the plan and walk away.
3. Each worker comes back with a short envelope, e.g.
   `DONE — 0421 built; 6 files; tests green (47/47); details: <task-folder>/worklog.md`. The driver
   notes the step in the run file and moves on. A `NEEDS-DECISION` still comes back in full and is put
   to you exactly as today.
4. The close is checked by a script (once `0407` exists); the run file's roll-up line is updated.
5. Around 300k tokens (your number), **Claude Code compacts on its own**. With D, it waits until the
   current task is between steps. The re-anchor hook then tells the loop to re-read its skill and the
   run file. It picks up at the recorded step, checking the task folder first, and carries on. You
   notice nothing, except a line in the final roll-up: *"context compacted 3× this run."*
6. You come back to either a pending question or the sprint roll-up. The roll-up is built from the run
   file, so it is complete even after compactions.
7. Next day, in a fresh session, `/fkit-sprint-ship-loop` finds the unfinished run and offers to
   resume. Plans approved earlier are either re-shown or trusted, depending on Q6.

**Coder task loop.** Same A and B2. At the end, the report says *"next task: start fresh (`/clear`)
first."* That is the one moment you are present anyway.

---

## 8. How it would be implemented (a sketch — not briefs)

**Spikes first.** Each is small and throwaway, run by a coder in a scratch session. Each answers one
question and records the result:

| Spike | Question | Decides |
|---|---|---|
| S1 | Does `SessionStart`/`compact` output reach the model on the current version? If not, does the `PreCompact` flag + `PostToolUse` fallback work? | A2's mechanism |
| S2 | When a `PreCompact` hook blocks an **auto** compaction: does it retry next turn, and does the block count toward the failure breaker? | Whether Part D is safe at all |
| S3 | Which knob works from `--settings` (`env` with `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`, the window var, or `autoCompactWindow`), and does it hit spawned workers too? | B2's knob and value |
| S4 | Does the auto-compactor keep agent-prompt "when summarized, keep …" guidance? | A3's placement |

**Then the work, roughly** (owner role in brackets; each would need your approval to start, per your
condition):
1. [coder] A1 — split both ship-loop skills into a core plus reference files, with a size-budget test.
   **The heaviest item:** these files carry many owner rulings, and the split must move text without
   changing meaning.
2. [coder] A2 — re-anchor hook(s) plus launcher wiring (`claude/fkit-claude.sh` `build_settings()`),
   with tests in the style of the existing hook tests.
3. [coder] A3 — two lines each in `claude/agents/fkit-lead.md` and `fkit-coder.md`.
4. [coder] B1 — run file format plus the loop text that writes and reads it. Sequence with `0228`.
5. [coder] B2 — per-role auto-compact setting in `build_settings()`.
6. [coder] C1 — envelope size budget in the spawn-prompt text; the producer's close record written to
   the task folder.
7. Already filed and ruled: `0331` → `0333` (pointer carry); `0407` (close verifier — **not
   authorised**).
8. [coder] D — only if S2 is clean and you say so.
9. [architect] One ADR recording the result:
   - "conductor sessions compact automatically; loops must survive compaction";
   - an amendment to [ADR-031](../decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)'s
     accepted cost *"Orchestrator context accumulation"*;
   - an extension of ADR-020 to a non-authoritative run file.
10. [wiki] Ingest afterwards.

**Existing decisions this touches:**
- Unchanged by Option 1:
  - [ADR-021](../decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md) — owner
    channel.
  - [ADR-024](../decisions/adr-024-ship-loop-owner-question-timeout-is-not-built.md) — no timers are
    added; it is **not** reopened.
  - [ADR-033](../decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md) — movers stay
    producer-only.
  - [ADR-037](../decisions/adr-037-a-skill-rule-binds-a-spawned-worker-unless-the-instruction-relays-an-owner-ruling.md).
- [ADR-030](../decisions/adr-030-stop-hook-enforces-turn-completion-contract.md)'s ship-loop marker is
  keyed by session id. After `/clear`, re-invoking the slash command re-creates it. A resume started by
  the *model* calling the Skill tool would not, so the Stop hook would enforce on idle turns — minor,
  and it fails safe.
- **The process gap the lead named** (the coder's carve-out only recognises `fkit-sprint-ship-loop`
  spawns) is **not touched** by Option 1. It becomes load-bearing only under Option 2. It deserves its
  own fix either way.

---

## 9. Risks

- **Summaries lose detail.** Even with A and B1, a mid-step compaction can drop a nuance the driver held
  but hadn't written down. Mitigation: B1 is written at every step, and D confines compactions to
  boundaries.
- **Harness constants move.** The ~20k skill cut, the knobs in F4, and the hook behaviour are
  version-specific (observed on 2.1.283). Pin each with a canary or a dated comment, as ADR-021 and the
  rules-block test already do.
- **A1 is an edit of heavily-reviewed text.** A bad split could lose a rule — the same failure it exists
  to prevent. It needs a careful review.
- **B2 on workers** (S3), and **D on the breaker** (S2).

---

## 10. Where this sits against earlier designs

- The task-loop design already assumed compaction and put state on disk
  ([2026-07-17 design](2026-07-17-design-task-ship-loop-skill.md) §4, X5). It did **not** know skills
  get cut after compaction.
- The conductor design named context accumulation and accepted it as a residual, mitigated by *"work
  runs in fresh spawned contexts"*
  ([2026-07-22 design](2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md) §9.2). §1
  shows that mitigation holds for the work, but the driver's relay traffic alone still reaches 1M.
- The declined timeout design ([2026-07-18](2026-07-18-design-ship-loop-timeout-auto-proceed.md)) is
  the precedent for *"the runtime cannot do the literal ask; here is the honest substitute."*

---

## 11. Questions for the owner

Recommendation marked ⭐.

1. **What bothers you most?** (a) cost and slowness of huge sessions; (b) the loop possibly losing track
   after a compaction; (c) having to be present to compact. It changes the weighting. ⭐ All three are
   covered by Option 1, but (b) is urgent (§1.3).
2. **Are you OK with Claude Code compacting on its own while you're away,** with the safety net in
   Parts A/B, instead of the loop waiting for you? ⭐ Yes — this is what Option 1 rests on.
3. **What size should trigger it?** 300k / 400k / leave at ~1M. If the setting also hits workers, ~3%
   of them (historically) would compact mid-job at 300k. ⭐ 300k if it is lead/coder-only; 400k if it
   is global.
4. **Per-task reporting:** is a short plain-language summary plus the file path enough, with the full
   close-out packet kept in `worklog.md`? Or do you want the full packet in chat as today? ⭐ Short
   summary plus path. Decisions (`NEEDS-DECISION`) stay in full.
5. **Plan pastes:** schedule `0331` → `0333` (your 2026-08-24 pointer-carry ruling) as part of this? ⭐
   Yes — it is the biggest single cut in what the driver sends.
6. **Resuming a run:** may a resumed run trust a plan you approved earlier in the *same* run? The run
   file would record the approval and the plan's hash. Or must every resume show you the plan again?
   (Today's rule: re-show — `fkit-sprint-ship-loop/SKILL.md:352-357`. Trusting the file is
   trust-not-proof, like the declared-approval marker.) ⭐ Re-show after a fresh session; trust within
   the same session after a compaction.
7. **Run file location:** local `.fkit/state/` (not in git) or git-tracked under `ai-agents/`? ⭐ Local
   — the durable records are already in git.
8. **Part D (compaction only between tasks):** worth a spike? It is closest to your ask, but it blocks a
   built-in mechanism. ⭐ Spike it; adopt only if S2 is clean.
9. **Checkpoint pauses:** want an opt-in "stop every N tasks and ask me to `/clear`" mode, or never
   stop for context? ⭐ Never by default.
10. **Restructuring the two ship-loop skills** into a short core plus reference files, so they survive
    compaction: OK, given it is a large edit of text carrying many of your rulings? ⭐ Yes, and first —
    it is a safety fix.
11. **Where compaction guidance lives:** in the lead/coder agent prompts, or spend ~150 of the shared
    rules block's ~446 free bytes (below your ≥400 target)? ⭐ Agent prompts.
12. **Options 2 and 3:** park them, re-raised only if Option 1 is measured insufficient? ⭐ Park.
13. **Sequencing with `0228`** (resume doctrine) — design it together with the run file? ⭐ Together.
14. **Coder loop habit:** add *"start the next task fresh (`/clear`)"* to its final report? ⭐ Yes.

---

## Appendix — evidence handles

- Transcripts (local, not in git): `~/.claude/projects/-Users-mark-dolbyrev-Workspace-fkit/00fc3805-….jsonl`,
  `992b2d5c-….jsonl`, and their `subagents/` folders. Compaction records are `system` /
  `compact_boundary` entries with `compactMetadata` (`trigger`, `preTokens`, `postTokens`). The
  truncated skills are the `invoked_skills` attachment right after the 2026-09-18 boundary in B. The
  reload is B's meta message at 2026-09-20T10:19:05Z.
- Binary: `~/.local/share/claude/versions/2.1.283` — the thrash message and rapid-refill breaker; the
  skill-truncation notice and its *N*×4 slice; `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`,
  `CLAUDE_CODE_AUTO_COMPACT_WINDOW` and `autoCompactWindow`.
- Docs quotes: relayed by a `claude-code-guide` agent, 2026-09-27, from code.claude.com pages: commands,
  hooks, env-vars, troubleshooting, statusline, headless, agent-sdk/user-input, agent-sdk/subagents.
  Not fetched first-hand (see §2).

**Written:** this file only. **No commits.** If you adopt a direction, it should become an ADR via
`fkit-record-decision`. `fkit-wiki` can ingest this report once it is decided.
