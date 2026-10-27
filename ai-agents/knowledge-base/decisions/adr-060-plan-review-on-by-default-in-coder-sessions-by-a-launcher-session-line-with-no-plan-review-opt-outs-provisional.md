# ADR-060: Plan review on by default in `fkit coder` sessions, `/fkit-task-ship-loop` and a plain `/fkit-plan-task` — switched on by a launcher session line, off with `--no-plan-review` (provisional; owner probe pending)

- **Status:** accepted — **provisional**, and **conditional**. Provisional: the owner's final keep/drop
  ruling on plan review comes after real-project use (ADR-059's *Re-raise only if*, first item).
  Conditional: every feasibility verdict it rests on is *"feasible with a condition: confirm by owner
  probe"*, and the **owner-run Tier-2 probe has not run** (2026-10-24). **No build starts before it.**

  > ⚠️ **Dated note 2026-10-26 (Tier-2 results).** The probe **has run**. Its facts and their effect on
  > the builds are in the note below Decision 9, and are deliberately not restated here, so there is one
  > place to keep true rather than two. The text above is left byte-identical.
- **Date:** 2026-10-24
- **Deciders:** owner (Mark Dolbyrev). Recorded by `fkit-architect`, spawn #3 of 3 (task `0542`'s plan,
  §*"2. Steps"*, *"Step C"*), hop 1, chain `lead → architect`, spawned by `fkit-sprint-ship-loop`, which
  `fkit-lead` was driving in a live `fkit lead` session (Sprint 12 run). The architect had no owner
  channel (ADR-021); every owner word below reached it as a verbatim relay from `fkit-lead`.
- **Revised:** 2026-10-24, before commit, by the `fkit-coder` Process-review worker answering the task's
  `review.md` R1–R7 (wording confirmed by a `fkit-architect` consult at hop 2): Decisions 2, 3, 9, 10,
  12 and the passages list. No owner-ruled point changed.
- **Task:** `0542` (`0542-design-plan-review-on-by-default-for-the-coder-session-task-ship-loop-and-plain-plan-task`).
- **Design report (the full design and evidence):**
  [`2026-10-24-design-plan-review-on-by-default-session-paths.md`](../reports/2026-10-24-design-plan-review-on-by-default-session-paths.md)
  (§1 probe evidence, §3 design, §8 the pending Tier-2 probe, §10 owner answers, §7 build split).
- **Amends:** [ADR-056](adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default.md) **Decision 3**
  (*"Session paths are unchanged"*) and [ADR-059](adr-059-plan-review-on-by-default-with-a-no-plan-review-opt-out-sprint-loop-runs-first-provisional.md)
  **Decision 3** (*"The session paths are not changed yet, and ADR-056 Decision 3 stays in force for
  them"*) — the amendment ADR-059 Decision 3 and its re-raise item (*"Re-raise when the session-path
  design task (`0542`) lands"*) call for. Both stay `accepted`; each gains one header bullet and one
  dated ⛔ note at its end, and their existing text is left byte-identical.
- **Does not supersede:** ADR-056's flow (Decisions 1, 4–8) or ADR-059's sprint-loop default (Decisions
  2, 4–8). Spawned coders are untouched (ADR-059 Decision 2).
- **Corrections:** dated notes, additions only. The text they annotate is **left byte-identical**, and
  the **Status stays `accepted`** (provisional, conditional). Legend: ⚠️ = a fact that drifted (the
  decision is untouched); ⛔ = a decision that was overturned. **2026-10-26** (Tier-2 results, report
  §8a), all ⚠️: below *Status*; below Decision 4.2; below Decision 4.3; below Decision 9 (this note
  carries the facts); below Decision 10; below *Open questions*' Tier-2 bullet.
  **2026-10-26, later** (owner re-ruled Q2; report §10.4). These are added to the site list above,
  which is left byte-identical; the same append-only rule and the same legend apply.
  - **⛔** below Decision 4.3 (this note carries the ruling and what replaces 4.3); below *Options
    considered*' option-B bullet; below *Owner rulings*' Q2 entry.
  - **⚠️** below Decision 4.2; below Decision 5; below Decision 9; below Decision 10; below Decision
    12; below the passages list; below *Consequences*' Codex bullet; below *Open questions*' Tier-2
    bullet; below *Related*'s ADR-019 bullet.


> **Citation form** (same as ADR-056/059). Agent, skill and hook files are mutable: cited by **section
> plus quoted phrase**, never by line number. Where this ADR describes text a later build **will
> write**, it says so; nothing here is cited as present in `claude/`. **This ADR changes no file under
> `claude/`**; until the builds in Decision 11 land and `.claude/` is refreshed, every session path still
> behaves exactly as today.

> **What this ADR decides, in one line:** in a `fkit coder` session, plan review runs by default in
> every `/fkit-plan-task` — directly or through `/fkit-task-ship-loop` — because the `fkit` launcher
> writes one session line a brief cannot fake (missing means off); `fkit coder --no-plan-review` turns
> it off for the session and `--no-plan-review` on either skill turns it off for one plan; the session
> coder shows the review record at the plan gate and writes `plan-review.md` only after approval;
> spawned coders stay exactly as ADR-059 Decision 2 has them.

## Context

- **The owner's intent** is already recorded: plan review on by default on **all paths** (ADR-059
  Decision 1; owner 2026-10-24, *"All paths"* — *"Needs a separate design task first; this task ships
  only the sprint-loop part."*). ADR-059 shipped the sprint loop and named five open design questions
  for the session paths (its Decision 3). Task `0542` is the design task.
- **Evidence — a headless plan-mode probe** (Claude Code `2.1.310`, `claude -p --permission-mode plan`,
  throwaway repo; report §1, task `worklog.md` §*"Step A — plan-mode probe record"*). Settled
  **headless only**:
  - plan mode **denies the `Write` tool** for the main agent and for subagents, even with an allow rule
    (C1, C6);
  - plan mode **reaches subagents** as a notice after their first tool call (C3);
  - plan mode puts **no gate on Bash** — writes, `rm -rf`, `git push --force` all ran (C2);
  - so a plan-mode subagent **can** write the adversarial reviewer's `.fkit/tmp/` prompt by heredoc and
    run `codex exec --sandbox read-only` to exit 0 (C5) — but the reviewer **model** may refuse after
    the notice: it finished 1 of 2 identical realistic runs (C4, runs 8-1 vs 8-2);
  - an appended system-prompt line reached the main agent and **not** a spawned subagent (probe B1,
    observed once, model self-report).
- **Not settled:** the interactive `fkit coder` case (C7) and the owner's own `defaultMode: auto`
  settings there (C8). The owner ruled (2026-10-24 ~15:12 UTC, *"Keep ruling, design now
  (Recommended)"*, description *"… Your test stays a check before any build."*) that the design goes
  ahead with those verdicts conditional, and that his interactive Tier-2 probe (report §8) runs before
  any build.
- **The constraint ADR-059 set:** it rejected *"Default in `fkit-plan-task` itself"* because *"a missing
  switch line would mean "on", so any spawn that forgot the opt-out would run it"*. Any session design
  must keep "missing means off".
- **The owner's design answers** (report §10, verbatim): 2026-10-24 ~15:30 UTC, `fkit lead` session,
  `AskUserQuestion`, relayed verbatim by `fkit-lead` — Q1 *"Launcher line + flags (Recommended)"*;
  Q2 *"Expect + retry + flag (Recommended)"*; Q3 *"Progress lines (Recommended)"*; Q4 *"Only if you
  ask (Recommended)"*; Q5 *"Yes, both (Recommended)"*; Q6 *"plan-review.md only (Recommended)"*;
  Q7 *"Wording fix after probe (Recommended)"*. Each is quoted with the question and the description he
  saw under *Owner rulings, with provenance*.

## Decision

1. **Scope.** Plan review becomes the default on the three session paths — the `fkit coder` session,
   `/fkit-task-ship-loop`, and a plain `/fkit-plan-task` in a session. **One mechanism, three entry
   points:** the review lives in `fkit-plan-task`'s existing gated section; `/fkit-task-ship-loop`
   reaches it through its step 2; a plain `/fkit-plan-task` reaches it directly; the launcher line is the
   session-wide switch both read.

2. **What turns it on — the session gate** (owner Q1, *"Launcher line + flags (Recommended)"*). Build
   will extend the gated section's trigger to: **either** (a) the spawn prompt carries a driver's switch
   line (unchanged, ADR-059 Decision 2), **or** (b) the coder is the **session coder**, which takes
   **both** (i) a line the `fkit` launcher writes into the session's system prompt — proposed text
   `fkit session: coder · Plan review: on — the default for fkit coder sessions (owner ruling
   2026-10-24, ADR-060), launched <UTC>` — **and** (ii) `AskUserQuestion` present in the toolset.
   - **Missing means off.** If either check fails, the section is skipped — today's behaviour. A
     task brief or plan cannot write the launcher line: those reach the coder as files it reads, not as
     its system prompt. Only the owner's own pass-through `--append-system-prompt` or an always-loaded
     file such as `CLAUDE.md` could carry the same text — both need the owner (or a repo file he keeps)
     and matter only in a live session he is in. A quote of the line inside a file the coder reads does
     not count; this ADR and the report both quote it. That is a prose rule the model follows: trust,
     not proof (ADR-056 Decision 8). **If an on line and an off line are both present, off wins.** A
     spawned coder lacks `AskUserQuestion`
     (`claude/agents/fkit-coder.md`, §Output format, *"The measured failure mode is `TOOL_ABSENT`
     (3/3)"*). So ADR-059's rejected "missing line means on" never applies, and *"Nothing else turns it
     on"* still holds with one named second source.
   - **Spawned coders are unchanged:** sprint-loop and lead spawns run plan review only on a driver's
     switch line (ADR-059 Decision 2).
   - **Why not an env var:** env vars reach subagents' Bash, so they cannot tell a session from a spawn
     (report §11).

3. **The opt-outs** (owner Q1). Same name as `0541`'s flag:
   - `fkit coder --no-plan-review` — the **launcher consumes it** and writes the off line `fkit session:
     coder · Plan review: off — fkit coder --no-plan-review (owner, at launch <UTC>)`; holds for the
     whole session; change it by relaunching.
   - `/fkit-task-ship-loop <brief> --no-plan-review` — read once at loop start, forwarded to step 2's
     `/fkit-plan-task`.
   - `/fkit-plan-task <brief> --no-plan-review` — that one plan.
   - **Shared rules, carried from ADR-059 Decision 4:** `--plan-review` is a harmless no-op; on the two
     skills, both flags together, or any unrecognised `--` token, stop the command before planning and
     ask; the flag passes the one-skill-one-output litmus because it changes what work the plan step
     does. **At the launcher the rule is narrower**, because args after a role pass through to `claude`
     (`claude/fkit-claude.sh` usage text, *"Args AFTER a role pass through to `claude`"*): after `coder`
     it takes out only the exact tokens `--no-plan-review` and the no-op `--plan-review`, wherever they
     appear among the args; both together is a usage error; every other arg passes through unchanged,
     as today (so `fkit coder --resume` keeps working); a mistyped `--` flag reaches `claude`, which
     refuses to start (`error: unknown option …`, measured on Claude Code 2.1.310). Build 1's plan names
     the edge cases (a token after a `--` separator, or the same text as another option's value). The
     launcher accepts `--no-plan-review` **only after `coder`**; after any other role it is a usage
     error. A session started outside the launcher (no line) is off and says
     `Plan review: off (no fkit session line)`.
   - **Opted out is today's behaviour:** the gate sends the coder from Workflow step 6 straight to step
     7, as today; `/fkit-task-ship-loop` steps 1–9 are unchanged. The only differences: the report line
     (Decision 7), and the launcher line itself in every `fkit coder` session's system prompt.

4. **The flow in a session — ADR-056 Decision 4, with these session differences only:**
   1. **Hops.** The session coder is hop 0; the approvers and the adversarial reviewer are at hop 1.
      **Approvers stay leaves** (architect's decision): the spawn's hop line stays truthful (*"hop 1 of
      2; chain: coder → <role>"*) and adds *"You are a plan-review approver: answer from files and
      consult no one; put anything you cannot settle as an open question."* Reasons: the trialled flow
      had leaf approvers (ADR-056 Decision 7); two approvers' verdicts stay independent; the present
      owner's wait stays bounded. The adversarial reviewer is a leaf structurally (no `Agent` tool).
   2. **A disagreement after round 2** — the session coder asks the owner directly with
      `AskUserQuestion`, inside plan mode, and quotes the ruling in the record (channel: `fkit coder
      session, AskUserQuestion`). No `NEEDS-DECISION`, no re-spawn. *Condition:* `AskUserQuestion` in
      interactive plan mode is unprobed (Tier-2 step 5c); if it fails, fall back to ADR-056 Decision
      4.4's return-and-ask, at the gate.

      > ⚠️ **Dated note 2026-10-26.** The condition is met. Tier-2 5c: `AskUserQuestion` appeared in
      > interactive plan mode and the answer came back. No fall-back is needed. The decision is
      > unchanged. See the note below Decision 9.

      > ⚠️ **Dated note 2026-10-26, later: "inside plan mode" no longer describes the usual case.** Since
      > the Q2 re-ruling, review runs with plan mode off, so this question is normally asked outside
      > plan mode. It runs inside plan mode only in the plan-mode-already-on case, and 5c covers that.
      > The decision (ask the owner directly) is unchanged. The ruling is in the ⛔ note below Decision
      > 4.3, deliberately not restated here, so there is one place to keep true rather than two. The text
      > above is left byte-identical.
   3. **Codex last, under plan mode** (owner Q2, *"Expect + retry + flag (Recommended)"*): the coder's
      spawn prompt to `@fkit-adversarial-reviewer` carries a fixed note that a plan-mode notice is
      expected and that its two Bash steps — the `.fkit/tmp/` prompt file and `codex exec --sandbox
      read-only` — are part of the owner-approved flow and its only non-read actions; **one retry** if
      it declines; then the plan reaches the owner with `plan review incomplete: Codex pass not run
      (declined under plan mode)` **first** in the presentation. No change to `fkit-adversarial-review`.
      A decline is not the reviewer's Claude fallback (that is for Codex missing or failing).

      > ⚠️ **Dated note 2026-10-26: the fact this rests on failed; the decision is not yet overturned.**
      > Tier-2 addition 3n sent this note verbatim (checked against the transcript), and the reviewer
      > declined both of its Bash steps on both tries. It cited the plan-mode instruction and said an
      > agent's message is not the owner's consent. Report §8's row *"3n declines twice"* says Q2 moves
      > to option B or C. The owner must re-rule Q2. Until he does, this item stands as recorded and
      > **must not be built** (Decision 9). When he rules, a ⛔ note goes here if it is overturned.
      > Analysis: report §8a.4. Facts: the note below Decision 9.

      > ⛔ **Dated note 2026-10-26: Decision 4.3 is overturned. Do not build it.**
      >
      > **The owner re-ruled Q2.** Channel: `fkit-lead` session, `AskUserQuestion`, 2026-10-26, relayed
      > verbatim by `fkit-lead` (trust, not proof; ADR-056 Decision 8).
      > - Question as asked: *"Plan review in sessions: how should the Codex attack step run, now that
      >   plan mode makes the reviewer refuse it?"*
      > - Selected: *"Review before plan mode (Recommended)"*.
      > - Description he saw: *"Draft + review (Codex included) with plan mode off; plan mode on only for
      >   your approval. ~17 min held back by instructions only."*
      > - He was also shown the following before choosing (the lead's summary):
      >   - in that stretch only the coder's instructions stop a stray write, and with his auto mode no
      >     permission prompt would catch one;
      >   - this is the sprint loop's level of protection;
      >   - `--no-plan-review` keeps plan mode from the start;
      >   - it amends ADR-019 Decision 2's *"(also runtime-enforced by plan mode)"* for this one path.
      >
      > **What replaces 4.3** (design: report §3.6, with §3.0 and §3.3):
      > - **Order.** With plan review on, the gate check runs before `fkit-plan-task`'s Workflow step 1,
      >   and the coder does **not** enter plan mode to draft. The draft, the approver rounds, the owner's
      >   disagreement question (4.2) and the Codex step all run **with plan mode off**. Then
      >   `EnterPlanMode`, and the gate (4.5) through `ExitPlanMode`.
      > - **The reviewer** runs its normal procedure, with **no plan-mode note and no retry**.
      >   - Codex missing or failing → its ADR-054 fallback (Decision 8).
      >   - The spawn fails → `plan review incomplete: Codex pass not run (<reason>)`, first.
      >   - The flag `… (declined under plan mode)` is retired.
      > - **Nothing is written before approval** (Decision 5). It is now the only thing that holds the
      >   draft-and-review stretch: ~17 min median, the level of the sprint loop's honesty clause (ADR-031;
      >   ADR-032 Decision 7).
      >   - The owner's view (4.4) opens with a line that says so.
      >   - The record gains `Plan mode: off for draft and review (<UTC> – <UTC>); on at <UTC> for the
      >     gate`.
      > - **Plan mode already on when a Codex step would start.** This happens if he switched it on first,
      >   or asked for a re-review after declining the gate (4.6). The coder never spawns the reviewer in
      >   plan mode. It stops and asks him to choose one of three:
      >   - leave plan mode;
      >   - go on, flagged `plan review incomplete: Codex pass not run (plan mode on)`;
      >   - drop review for that plan.
      >
      >   This is the architect's design, not an owner ruling. Build 1's plan gate confirms it.
      > - **Off paths are unchanged.** With `--no-plan-review`, no line, or a spawn, plan mode comes on at
      >   Workflow step 1, as today (Decision 3).
      > - **ADR-019 Decision 2.** On the review-on path its *"(also runtime-enforced by plan mode)"* covers
      >   only the gate. A dated ⚠️ note there says so. It takes effect when build 1 (`0543`) lands, because
      >   `/fkit-task-ship-loop` step 2 reaches this path through `/fkit-plan-task`.
      >
      > **Re-raise only if** one of these happens:
      > - the runtime gains a sanctioned way for a subagent to run its Bash steps under plan mode;
      > - a stray write is seen in a draft-and-review stretch;
      > - plan mode stops refusing `Write`/`Edit` at the gate.
      >
      > Item 4.3 and the ⚠️ note above are left byte-identical. The Status stays `accepted` (provisional).
   4. **What the owner sees while it runs** (owner Q3, *"Progress lines (Recommended)"*): one short chat
      line per approver round and one for the Codex pass; the full record at the gate.
   5. **The gate** (`ExitPlanMode`): banners → `Plan review: ON (default)` → the plan → the three
      attachments (ADR-056 Decision 4.6) → the full `===PLAN-REVIEW RECORD===` block.
   6. **Owner asks for changes at the gate** (owner Q4, *"Only if you ask (Recommended)"*): the revised
      plan is **not re-reviewed** unless he asks; it carries the banner `revised after owner feedback —
      not re-reviewed`, and the record gains `Owner revision: <his words quoted> — not re-reviewed`.

5. **Who writes `plan-review.md` — the session coder, after approval only.** No worker writes a file
   during plan mode (headless C1/C6; and using the Bash gap to write records is rejected — it would make
   a runtime quirk a dependency).
   - `/fkit-task-ship-loop`: at step 4, on approval, next to `plan.md`.
   - Plain `/fkit-plan-task` with a task-folder brief (owner Q6, *"plan-review.md only
     (Recommended)"*): `plan-review.md` next to the brief, on approval; **`plan.md` stays unwritten**,
     as today.
   - Plain `/fkit-plan-task` with no task folder: no file; the record lives in the approval
     presentation, which says so.
   - A rejected plan: **not persisted** (plan mode still blocks `Write`); the rejection report says
     `plan-review record not persisted (plan rejected while in plan mode)`.
   - Contents and format as ADR-056 Decision 6 (the record block, `Presented: <UTC>`, the owner's
     decision with date and channel, `## Attempt N — <date>`).
   - **Self-record, stated plainly:** the agent that ran the review writes its record. Fidelity, not
     proof (ADR-056 Decision 8); bounded because the owner saw the same block at the gate. A failed
     `Write` after approval is a `Problems:` entry; the work goes on.

   > ⚠️ **Dated note 2026-10-26 (Q2 re-ruled).** Since the re-ruling, the draft and the review run
   > with plan mode off. So for that stretch *"No worker writes a file during plan mode"* is held by
   > instruction, not by the runtime. The decision is unchanged and is now read as **"nothing is
   > written before approval"**. That rule is now the only thing holding the stretch, so it is not
   > loosened: no `plan-review.md` is written before the gate, even though `Write` would be allowed.
   > The rejected-plan bullet still holds, because a rejection happens at the gate, inside plan mode.
   > The ruling is in the ⛔ note below Decision 4.3. The text above is left byte-identical.

6. **Inline plans get no plan review** (architect's design). The switch is in `fkit-plan-task`; an
   inline plan (`fkit-coder.md`, *"run /fkit-plan-task (or produce an inline plan)"*) is the coder's
   small-work path. ⚠️ The owner was not asked this as its own question; see *Open questions*.

7. **Report lines** (owner Q5, *"Yes, both (Recommended)"* — ADR-059 Decision 7 carried over):
   `Plan review: ON (default)` at the top of the gate presentation; `Plan review: off
   (--no-plan-review)`, `Plan review: off (fkit coder --no-plan-review)` or `Plan review: off (no fkit
   session line)` when off. In `/fkit-task-ship-loop` the same line, with the Codex plan-pass mode, goes
   into the worklog's close-out evidence packet. **A NOT-model-diverse *plan* pass does not change step
   9's close posture** — that keys on the *code* review's Codex mode. A presentation with no plan-review
   line is a defect.

8. **Codex-less projects** (owner Q5 — ADR-059 Decision 8 carried over): the session plan pass runs
   Claude-only, flagged *NOT model-diverse* (ADR-054), banner first, verbatim. The opt-out flags
   switch it off.

9. **The confirming check gates every build.** The owner-run Tier-2 interactive probe (report §8,
   steps 1–8 plus the labelled additions 3-notice, 3n, 3m, 3m-bis, 5b, 5c, 5d) runs **before any build
   in Decision 11 is planned**, and its results are recorded verbatim. Option A (Decision 4.3) is
   confirmed only by addition 3n, which sends the actual note; step 3 alone does not confirm it. If a
   result hits a row of the report's §8 mapping table other than *"§3.6 option A stands"* — Codex
   declines twice, `@fkit-architect` fails in plan mode, `AskUserQuestion` fails in plan mode, the
   appended line reaches a subagent, or the session's own Bash prompts or is denied (3m/3m-bis) — the
   design returns to the architect, and this ADR gets a dated note **before** the affected build
   starts. A skipped labelled addition is recorded as skipped, never as passed; the build whose design
   rests on it names the unconfirmed condition at its plan gate and asks the owner (session:
   `AskUserQuestion`; spawn: `NEEDS-DECISION`) whether to go ahead or run it first.

   > ⚠️ **Dated note 2026-10-26: Tier-2 results** (owner-run in an interactive `fkit coder`, Claude Code
   > `2.1.310`, his settings `defaultMode: "auto"` with an `autoMode` block). The lead wrote them up from
   > the owner's screenshots; the architect checked them against the session transcripts. Full record:
   > report §8a. Verified against those transcripts on 2026-10-26.
   > - **Rows hit other than *"§3.6 option A stands"*:**
   >   - **3n declines twice.** Decision 4.3 (option A) failed, and Q2 is open again for the owner.
   >   - **3m: the model declines twice without calling.** Decision 10 is not tested interactively;
   >     build 3's plan gate asks.
   > - **Passed:**
   >   - Step 5: `@fkit-architect` replies in plan mode.
   >   - 5c: `AskUserQuestion` works in plan mode (Decision 4.2 holds).
   >   - 5d: the appended line reached the session and not the spawned architect. That is B1 confirmed
   >     interactively, so Decision 2 holds.
   > - **Not run, so treated as skipped:**
   >   - 5b: the session declined to spawn a subagent to write. Builds 1 and 2 name it at their plan
   >     gates; no decision rests on it (Decision 5).
   >   - 3-notice: no reviewer was spawned at step 3; 3n answers it in substance.
   > - **Not applicable:** 3m-bis. Its trigger, a write with no prompt, did not happen.
   > - **Still not settled:** whether the runtime would let a Bash or `Write` call through in
   >   interactive plan mode (C7). No model made such a call: the session coder declined all 5 requests
   >   that meant a write, and the reviewer 2 of 2. C8 is also unsettled, since nothing that writes
   >   reached the runtime.
   > - **Effect** (report §8a.6):
   >   - Builds 1 and 2 are **blocked** until Q2 is re-ruled and the design's §3.6 is rewritten.
   >   - Build 3 may be planned, carrying 3m to its gate.
   >
   > The decision above is unchanged, and its text is left byte-identical.

   > ⚠️ **Dated note 2026-10-26, later: the gate is cleared for builds 1 and 2.** This decision's
   > "design returns to the architect, dated note before the build" step for 3n's row is done.
   > - The owner re-ruled Q2 (⛔ note below Decision 4.3).
   > - Report §3.6, §3.0, §3.3 and §4 were rewritten.
   > - Builds 1 and 2 now rest on 5c and 5d, both passed.
   > - 5b and 3-notice did not run, and no element of the re-ruled design rests on them. Each build's plan
   >   names them in one line, with no question for the owner (report §7).
   > - Build 3 is unaffected: it still carries 3m.
   >
   > The decision above is unchanged, and its text is left byte-identical.

10. **Finding: plan mode is not a Bash wall (headless evidence); follow-up is a wording fix** (owner Q7,
    *"Wording fix after probe (Recommended)"* — description *"One Sprint 12 task, no behaviour change,
    after your probe confirms. Waits on nothing; nothing waits on it."*). fkit's texts call plan mode the
    session's *"structural write-wall"* (`claude/agents/fkit-lead.md`, `fkit-sprint-ship-loop`'s
    *"plan-gate honesty clause"*, `fkit-task-ship-loop`'s *"runtime-enforced by plan mode"*, ADR-019
    Decision 2, ADR-031, ADR-032 Decision 7; report §6). Headless, it blocks `Write`/`Edit` only. Once
    the Tier-2 probe confirms, one task rewords those claims; **no behaviour changes and no guard is
    built**. If Tier-2 addition 3m (or 3m-bis) shows the session's own Bash prompts or is denied by the
    runtime, the finding narrows to headless only and the task shrinks to recording that; if a
    no-prompt result could be auto approval or an allow rule (C8), 3m-bis separates the two (report §8
    mapping table). This does **not** reopen ADR-031's accepted cost.

    > ⚠️ **Dated note 2026-10-26.** Tier-2 3m: the session model declined both tries without making a
    > Bash call, citing its plan-mode instruction. So the runtime's handling of Bash in interactive plan
    > mode is untested, and the model's restraint held every time. The decision is unchanged, and so is
    > the planned wording (*"held back only by the model's plan-mode instructions"*). Build 3's plan gate
    > names the untested runtime point and asks. See the note below Decision 9 and report §8a.4.

    > ⚠️ **Dated note 2026-10-26, later (Q2 re-ruled).** The wording task gains one fact. On the
    > default session path (plan review on), plan mode covers only the gate, not the draft. Only
    > `--no-plan-review` keeps plan mode from the start. So "ship it the old way, `fkit coder` +
    > `/fkit-task-ship-loop`, for the wall" is true only with `--no-plan-review`.
    > - Build 1 adds `--no-plan-review` to the `claude/` pointers that say so (report §6).
    > - Build 3's wording keeps that, and covers ADR-032's passage in its dated note.
    >
    > The decision is unchanged. The text above is left byte-identical.

11. **Build split** (filed by the producer, on Sprint 12 by the owner's placement ruling, each gated by
    Decision 9; report §7 holds the final proposal):
    1. `fkit coder` session + plain `/fkit-plan-task` (launcher line and `fkit coder --no-plan-review`;
       the session gate, flow, record and `--no-plan-review` in `fkit-plan-task`). Depends on `0542`.
    2. `/fkit-task-ship-loop` (forward the flag; record at step 3; `plan-review.md` at step 4).
       Depends on build 1.
    3. The Decision 10 wording fix. Depends on no task.

12. **Unchanged:** ADR-056 Decisions 1, 2 (as amended by ADR-059), 4 (except Decision 4 above for
    sessions), 5, 6 (for the sprint loop), 7 (for spawned coders) and 8; ADR-059 Decision 2 for spawned
    coders (its gate sentence is read as in the passages list below) and Decisions 4–8 for the sprint
    loop. The plan gate is still the one human checkpoint and the owner approves last
    (ADR-019 Decision 2, ADR-032 Decisions 3 and 7). **Trust, not proof** (ADR-056 Decision 8): the
    session gate, the leaf rule, the plan-mode note and the round cap are prose in prompts; the launcher
    line is the only part written by a non-LLM process.

    > ⚠️ **Dated note 2026-10-26 (Q2 re-ruled).** *"The plan-mode note"* no longer exists. One more
    > prose element is added: on the review-on path, the no-write rule for the draft-and-review
    > stretch. The plan gate is still the one human checkpoint, and the owner still approves last.
    > ADR-019 Decision 2's plan-mode parenthetical covers only the gate on that path; ADR-019 carries a
    > dated ⚠️ note. Ruling: the ⛔ note below Decision 4.3. The text above is left byte-identical.

### ADR-056 and ADR-059 passages this ADR changes

Each is **left byte-identical** in its ADR as the record of its date; each ADR's new end-of-file ⛔
note points here. Read them through this ADR:

- **ADR-056 Decision 3** (*"Session paths are unchanged"*; *"behave exactly as today"*) — replaced by
  Decisions 1–8 above, once the builds land. Its *"There is **no per-task brief field**"* stands.
- **ADR-056 Decision 4.4** (*"The coder returns `NEEDS-DECISION` … The driver asks the owner"*) — in
  sessions, the coder asks the owner directly (Decision 4.2 above). Unchanged for spawns.
- **ADR-056 Decision 4** *"Workers write nothing"* and **Decision 6** *"Written by the driver … on
  approve and on reject"* — on session paths the session coder writes `plan-review.md` after approval,
  and a rejected plan's record is not persisted (Decision 5 above). Unchanged for the sprint loop.
- **ADR-056 Decision 7** (*"lead (hop 0) → coder (hop 1) → … (hop 2)"*; *"approvers at hop 2 cannot
  consult anyone"*) — in sessions the chain is coder (hop 0) → approvers (hop 1), leaves by instruction
  (Decision 4.1 above). Unchanged for spawns.
- **ADR-056 Decision 10** — *"session-path plan review (Decision 3)"* is no longer out of scope.
- **ADR-056 re-raise** — *"… or "should cover sessions""* is used up: this ADR is that decision.
- **ADR-059 Decision 1** — *"This ADR delivers only the first"*: the other three paths are decided
  here (delivered by the builds).
- **ADR-059 Decision 2** — *"`fkit-plan-task`'s gate keeps its rule — it runs only when the driver's
  switch line is present"*: still exactly true for spawned coders; the gate itself gains the second,
  session-only source (Decision 2(b) above), so read that sentence as *"for a spawn"*. ADR-059's header
  bullet and end ⛔ note (*"with that one named exception"*) say the same.
- **ADR-059 Decision 3** — *"The session paths are not changed yet, and ADR-056 Decision 3 stays in
  force for them"*: amended by this ADR; its five open questions are answered in the report (§3–§5) on
  headless evidence, with the interactive case pending (Decision 9).
- **ADR-059 Decision 7 and Decision 8** — extended to sessions (Decisions 7 and 8 above).
- **ADR-059 re-raise** — *"Re-raise when the session-path design task (`0542`) lands"* is used up.
- **ADR-059 *Negative / costs*** — *"The owner's all-paths intent is not yet delivered"* stays true
  **until build 1 (and build 2) ship and `.claude/` is refreshed**.
- **Not changed, by fact:** ADR-056's rejected option *"A per-task brief field"* names the plan-mode
  unknown (*"whether a spawned adversarial reviewer can write `.fkit/tmp/` under it is unverified"*). It
  is now answered **headless only** (C5: it can; C4: the model may decline). That is a fact for the
  record, not an overturned decision; the option stays rejected.

> ⚠️ **Dated note 2026-10-26 (Q2 re-ruled).** This ADR now changes one passage outside ADR-056/059.
> **ADR-019 Decision 2**, *"The owner approves the implementation plan (also runtime-enforced by plan
> mode) before any code"*: on the review-on session path, the parenthetical covers only the gate, not
> the draft and the review. Decision 2 itself stands. ADR-019 carries a dated ⚠️ note. The ruling is in
> the ⛔ note below Decision 4.3. Also, under *"Not changed, by fact"*: interactively, a plan-mode
> reviewer declined 2 of 2 (Tier-2 3n). The option stays rejected. The list above is left
> byte-identical.

## Options considered

- **Launcher session line + live-session check, flags at launch and per command (chosen; owner Q1).**
  A non-LLM process writes "on"; either check missing means off; spawns are untouched.
- **No launcher change, per-command flags only** (on whenever the coder sees it is a live session).
  Rejected by the owner (Q1): no session-wide off switch, and "on" would rest on one check.
- **Default inside `fkit-plan-task` with no signal.** Rejected (ADR-059): a missing line would mean on,
  so a spawn that forgot the opt-out would run it.
- **An env var from the launcher.** Rejected: it reaches subagents' Bash, so it cannot tell a session
  from a spawn.
- **Run the reviews before entering plan mode** (Q2 option B). Rejected by the owner: ~17 minutes per
  plan with no `Write`/`Edit` block on the coder.

  > ⛔ **Dated note 2026-10-26: this rejection is overturned.** Tier-2 3n showed that the chosen option
  > (A) cannot deliver a Codex pass in plan mode. The owner then **chose** this option, and accepted
  > the cost named above. The ruling is in the ⛔ note below Decision 4.3. Option A is now rejected on
  > evidence. Option C (no Codex pass in sessions) stays not chosen. The text above is left
  > byte-identical.
- **No Codex pass in sessions** (Q2 option C). Rejected by the owner: no model-diverse check on session
  plans.
- **Approvers or the reviewer persist the record with `Write` during plan mode.** Not feasible headless
  (C1/C6). **Writing it by Bash during plan mode** works headless (C2) but is rejected: a dependency on
  a gap that may be a quirk or may close.
- **Approvers allowed to consult at hop 1.** Rejected (architect): independence of the two verdicts,
  parity with the trialled flow, bounded wait.
- **Always re-review after owner feedback** (Q4). Rejected by the owner: another ~17 minutes; his word
  outranks the approvers'.
- **Silent progress / ask per plan** (Q3). Rejected by the owner in favour of progress lines.
- **Chat-only record, or `plan.md` too, on the plain path** (Q6). Rejected by the owner.
- **Skip Codex in Codex-less sessions** (Q5 option B). Rejected by the owner.
- **A plan-mode Bash guard hook, or record the finding only** (Q7). Rejected by the owner in favour of
  the wording fix after the probe.
- **ADR form: an additions-only amendment inside ADR-059** instead of this new ADR. Rejected
  (architect's call, brief question 9): ADR-059 is untracked, so `git diff` cannot show an untracked
  file was only added to; and a design of this size inside a provisional sprint-loop ADR would bury it.
  Precedent: ADR-059 amending ADR-056.

## Consequences

- **Positive:**
  - The owner's all-paths intent gets a concrete, buildable design with the old path one flag away on
    every path.
  - "Missing means off" holds: a broken or absent signal can only give today's behaviour.
  - The owner watches the review happen in a session (progress lines), answering his trial complaint
    that it all happened *"behind the scene"*.
  - Every session plan says which path it took.
- **Negative / costs — stated plainly:**
  - **Every session `/fkit-plan-task` pays plan review** — about 17 minutes wall-clock median in the
    trial (range ~9½–31) — while the owner waits.
  - **The Codex step is the weak point:** the reviewer model may decline under plan mode (headless 1 of
    2); some plans will arrive flagged `Codex pass not run`.

    > ⚠️ **Dated note 2026-10-26 (Q2 re-ruled).** This cost went with option A, which is overturned. The
    > cost now: with review on, **the draft and the review run ~17 min median with plan mode off**. Only
    > the coder's instructions stop a stray write in that stretch. With the owner's auto mode, no
    > permission prompt would catch one either. This is the sprint loop's level (ADR-031; ADR-032
    > Decision 7), and the owner accepted it in his ruling (⛔ note below Decision 4.3). The text above is
    > left byte-identical.
  - **Self-record** on session paths (Decision 5), and **rejected session attempts are not persisted**
    — a known gap against ADR-056 Decision 6's *"on reject"* (that rule existed for `0474`'s trial
    evidence, now over).
  - **The launcher changes** and needs a test; **the owner has not OK'd a named test** (ADR-057 §D2
    item 1). His Q1 option said *"Launcher test needs your OK."* — that is not his OK of a named test.
    Build 1's plan gate names it and asks.
  - **Possible `--append-system-prompt` clash** with an owner's own pass-through flag; build 1 checks
    the runtime behaviour or uses a file form.
  - **Codex-less projects** get a Claude-only plan pass on every session plan.
  - **Feasibility is conditional** on an unrun owner probe (Decision 9).
  - **ADR-052 phase-5 overlap** (`0453` rewires both ship loops; also `0450`, `0451`, `0457`, all
    Backlog): file overlap, not a dependency. These builds land first; whichever lands second carries
    the session gate, the flags and `plan-review.md` forward.
  - **The live check needs a relaunch** (`.claude/` refresh + a new `fkit coder`); it cannot run inside
    the lead session that files the builds. Builds 1 and 2 edit `fkit-plan-task`, which that run's later
    plan spawns read with old text loaded — accepted in the owner's placement option (*"Risk: old prompt
    text loaded here."*).
- **Residual risks / "re-raise only if":**
  - **Re-raise on the Tier-2 probe's results** if any result contradicts a condition (Decision 9).
  - **Re-raise on the owner's final ruling after real-project use** (as ADR-059).
  - **Re-raise if plan review runs in a session with no launcher on-line, in a `--no-plan-review`
    session or command, or in a spawned coder without a driver switch line** — or is missing from a
    default session plan, or a plan is shown as reviewed when a step did not run.
  - **Re-raise if the runtime starts passing appended system prompts to subagents**, or gives spawned
    agents `AskUserQuestion` — either weakens one of the two checks in Decision 2.
  - **Re-raise if plan mode's runtime behaviour changes** (blocks Bash, or stops blocking `Write`) —
    Decisions 4.3, 5 and 10 rest on it.
  - **Re-raise if an ADR-052 phase-5 change** drops the session gate, the flags or `plan-review.md`.
  - **Re-raise if the hop limit (ADR-010) or the Codex runtime (ADR-054) changes.**
  - Do **not** re-raise *"the session gate / leaf rule / plan-mode note is only prose"* (Decision 12),
    *"rejected session attempts are not persisted"* or *"the session coder writes its own record"*
    (stated costs), *"every session plan now pays the time"*, or *"Codex-less sessions get a Claude-only
    pass"* (owner Q5) as defects.
  - Do **not** re-raise *"inline plans should get plan review"* as a defect unless the owner rules so
    (see *Open questions*).

## Open questions (not decided here)

- **The launcher test's OK, by name** — at build 1's plan gate (ADR-057 §D2 item 1). Still needed.
- **The Tier-2 probe** — not run; gates every build (Decision 9).

  > ⚠️ **Dated note 2026-10-26.** It ran. What it opens: **Q2 (Decision 4.3) is open again** for the
  > owner. See the note below Decision 9.

  > ⚠️ **Dated note 2026-10-26, later.** Q2 is re-ruled (⛔ note below Decision 4.3). One new open
  > item: the **plan-mode-already-on stop** in that note is the architect's design. Build 1's plan gate
  > confirms it with the owner, together with its two unproven mechanics (report §3.6). The text above
  > is left byte-identical.
- **Inline plans get no plan review** (Decision 6) — stated in the report's Q1 context; the relayed
  question and description do not show whether the owner saw that line. Confirm at build 1's plan gate.

## Owner rulings, with provenance

- **2026-10-24 (~14:57 UTC)**, `fkit lead` session driving `/fkit-sprint-ship-loop` (Sprint 12),
  `AskUserQuestion`, relayed verbatim: `0542` plan *"Approve"*; *"Q1 — How should the plan-mode probe
  run?"* → *"Architect only (Recommended)"*; *"Q2 — Where do the build briefs go once the design is
  approved?"* → *"Sprint 12"* (description: *"This run could pick them up; wait on 0542 in Sprint 12.
  Risk: old prompt text loaded here."*).
- **2026-10-24 (~15:12 UTC)**, same channel: *"Run your interactive plan-mode test before the design
  report?"* → *"Keep ruling, design now (Recommended)"* (description: *"Architect writes the design now;
  affected verdicts say "confirm by owner probe". Your test stays a check before any build."*);
  *"0542 check "nothing under claude/ changed" fails on 0541's uncommitted edits. How to handle?"* →
  *"Compare to current state (Recommended)"* (description: *"Check passes if claude/ is unchanged from
  now (0541's edits as baseline)."*).
- **2026-10-24 (~15:30 UTC)**, same channel — the design questions (report §9), question as asked →
  selected option → description he saw:
  - *"Q1 — How does a coder session know plan review is on, and switch it off?"* → *"Launcher line +
    flags (Recommended)"* — *"Launcher adds the line; fkit coder --no-plan-review for the session;
    --no-plan-review per command. Launcher test needs your OK."*
  - *"Q2 — When the Codex reviewer declines in plan mode, what happens?"* → *"Expect + retry + flag
    (Recommended)"* — *"Tell it the notice is expected, retry once, else flag "Codex pass not run" at
    the top."*

    > ⛔ **Dated note 2026-10-26: this Q2 ruling is overturned** by the owner's re-ruling *"Review
    > before plan mode (Recommended)"* (`fkit-lead` session, `AskUserQuestion`, 2026-10-26). It is
    > quoted verbatim, with the description he saw, in the ⛔ note below Decision 4.3. It is deliberately
    > not restated here, so there is one place to keep true rather than two. The text above is left
    > byte-identical.
  - *"Q3 — What do you see during the ~17-min review in a session?"* → *"Progress lines
    (Recommended)"* — *"One live line per round and for Codex; full record at approval."*
  - *"Q4 — If you ask for changes at approval, is the revised plan re-reviewed?"* → *"Only if you ask
    (Recommended)"* — *"Revised plan carries a "not re-reviewed" banner."*
  - *"Q5 — Do sessions follow the sprint-loop rulings (ON/off report lines; flagged Claude-only pass
    without Codex)?"* → *"Yes, both (Recommended)"* — *"Same report lines; Codex-less sessions get a
    flagged Claude-only pass."*
  - *"Q6 — For a plain /fkit-plan-task, where does the review record go?"* → *"plan-review.md only
    (Recommended)"* — *"Saved next to the brief on approval; plan.md stays unwritten, as today."*
  - *"Q7 — Follow-up for "plan mode doesn't block shell commands"?"* → *"Wording fix after probe
    (Recommended)"* — *"One Sprint 12 task, no behaviour change, after your probe confirms. Waits on
    nothing; nothing waits on it."*

*These rulings reached the architect as a relay from fkit-lead. By ADR-056 Decision 8 and ADR-055
Decision 7, that relay is trust, not proof — recorded here as relayed.*

## Related

- [ADR-056](adr-056-opt-in-plan-review-per-sprint-loop-run-off-by-default.md) — the flow; Decision 3
  amended here.
- [ADR-059](adr-059-plan-review-on-by-default-with-a-no-plan-review-opt-out-sprint-loop-runs-first-provisional.md)
  — the sprint-loop default and the all-paths intent; Decision 3 amended here; Decision 2 kept.
- [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) Decision 2 — the
  ship loop's plan gate, unchanged; its *"runtime-enforced by plan mode"* wording is in Decision 10's
  scope.

  > ⚠️ **Dated note 2026-10-26 (Q2 re-ruled).** The gate itself is still unchanged. Its *"(also
  > runtime-enforced by plan mode)"* now covers only the gate on the review-on session path (⛔ note
  > below Decision 4.3; dated ⚠️ note in ADR-019). The text above is left byte-identical.
- [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md) — the two-hop budget;
  [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) — the
  skill lock (approvers run no skill); [ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md)
  — the `AskUserQuestion` seam Decision 2 uses.
- [ADR-031](adr-031-fkit-lead-becomes-the-orchestrating-front-door.md),
  [ADR-032](adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md) Decision 7 — the
  "structural write-wall" wording (Decision 10).
- [ADR-054](adr-054-codex-is-optional-but-recommended-the-claude-only-second-opinion-is-a-flagged-mode.md)
  — Codex optional; [ADR-057](adr-057-fkits-tests-cover-shipped-script-behaviour-only.md) §D2 — the
  test-file OK; [ADR-052](adr-052-aiboard-merges-into-fkit-as-its-built-in-board-the-single-store-for-tasks-and-sprints.md)
  phase 5 — the overlap.
- Code the builds edit (cited by section, mutable): `claude/fkit-claude.sh` (the `exec claude --agent`
  line and usage text); `claude/skills/fkit-plan-task/SKILL.md` gated section; `claude/skills/fkit-task-ship-loop/SKILL.md`
  *"**Argument:**"* paragraph and steps 2–4; `claude/agents/fkit-coder.md`, `fkit-architect.md`,
  `fkit-producer.md`, `fkit-lead.md`.
- Task `0542`'s brief, plan and worklog (probe record); the design report above.
- **Wiki:** **fkit-wiki** should ingest this ADR and the design report, and re-ingest ADR-056 and
  ADR-059 (new header bullet and ⛔ note each) — an architect never writes the vault.
