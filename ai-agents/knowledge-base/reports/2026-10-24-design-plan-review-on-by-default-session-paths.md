# Design: plan review on by default in the `fkit coder` session, `/fkit-task-ship-loop` and plain `/fkit-plan-task`, with an opt-out (provisional)

- **Task:** `0542` (`ai-agents/tasks/done/0542-design-plan-review-on-by-default-for-the-coder-session-task-ship-loop-and-plain-plan-task/`)
- **Date:** 2026-10-24
- **Author:** `fkit-architect`, spawn #2 of 3 (plan Step B), hop 1, chain `lead → architect`. Spawned
  by `fkit-sprint-ship-loop`, which `fkit-lead` was driving in a live `fkit lead` session (Sprint 12 run,
  started 2026-10-24T14:06Z). Procedure: `/fkit-design-spec`. **No owner channel** (ADR-021). Its
  Step 2 says "ask the owner"; here the questions are returned to the driver instead (§9). Nothing is
  decided that belongs to the owner.
- **Status:** **design approved by the owner** (2026-10-24 ~15:30 UTC; answers verbatim in §10) and
  recorded as [ADR-060](../decisions/adr-060-plan-review-on-by-default-in-coder-sessions-by-a-launcher-session-line-with-no-plan-review-opt-outs-provisional.md)
  — **provisional**, and **conditional**: every verdict below is *"feasible with a condition: confirm by
  owner probe"*, and the owner's Tier-2 probe (§8) **has not run**. It gates every build (§7).
- **Step C** (plan Step C): `fkit-architect` spawn #3 of 3, hop 1, chain `lead → architect`, same
  run. Added §10, finalised §7, updated §13, the *Status* bullet and this bullet; wrote ADR-060 and the
  additions-only pointer notes on ADR-056/059. Inputs re-checked by `git hash-object` before any edit:
  `plan.md` `800eac33…`, `worklog.md` `9941d100…`, this report `d6424fd9…` — all unchanged since Step B.
  Everything else in §0–§9 and §11–§12 is Step B's text, unedited.
- **Process-review, round 1** (`fkit-coder` Process-review worker, 2026-10-24, answering `review.md`
  R1–R6; wording confirmed by a `fkit-architect` consult at hop 2): edited §3.1, §3.2, §3.6, §4.1, §7,
  §8, §10.3 and §13. For those sections the Step C bullet's *"Everything else … unedited"* no longer
  holds; that bullet is left as its dated record. No owner-ruled point changed.
- **Plan carried:** `plan.md` blob `800eac333fd26bfcd21ed4e299cd738f0139e7ad` (18394 bytes, checked
  with `git hash-object`). Probe record: `worklog.md` §"Step A — plan-mode probe record", blob
  `73bb6cbc2f81848c02eb0496ae2d6f67bbe5bdd9` (15010 bytes, checked).

> **Citation form.** Agent, skill and hook files can change. They are cited by **section plus quoted
> phrase**, with the line number **as of 2026-10-24** (0541's uncommitted edits included) as a reading
> aid only. "Will write" means text a later build writes; it is never cited as present.

> **Owner rulings this report is written under** (`fkit lead` session, `AskUserQuestion`, 2026-10-24,
> relayed verbatim by `fkit-lead`; by ADR-056 Decision 8 a relay is trust, not proof):
> - Plan gate (~14:57 UTC): *"Approve"*. Q1 *"How should the plan-mode probe run?"* → *"Architect only
>   (Recommended)"*. Q2 *"Where do the build briefs go once the design is approved?"* → *"Sprint 12"*
>   (description he saw: *"This run could pick them up; wait on 0542 in Sprint 12. Risk: old prompt
>   text loaded here."*).
> - After Step A (~15:12 UTC): *"Run your interactive plan-mode test before the design report?"* →
>   *"Keep ruling, design now (Recommended)"* (description: *"Architect writes the design now; affected
>   verdicts say "confirm by owner probe". Your test stays a check before any build."*).
> - *"0542 check "nothing under claude/ changed" fails on 0541's uncommitted edits. How to handle?"* →
>   *"Compare to current state (Recommended)"* (description: *"Check passes if claude/ is unchanged from
>   now (0541's edits as baseline)."*).

---

## 0. The answer in brief

- **One mechanism, three entry points.** Plan review in a session lives in **`fkit-plan-task`'s
  existing gated section**. `/fkit-task-ship-loop` reaches it through its step 2. A plain
  `/fkit-plan-task` reaches it directly. The "`fkit coder` session" path is the **session-wide switch**
  that both of them read.
- **What turns it on (Rec):** a **session line written by the `fkit` launcher** into the session's
  system prompt, for `fkit coder` only, **plus** a live-session check (`AskUserQuestion` is in the
  toolset). If either one is missing, plan review is **off**: today's behaviour. A brief cannot write
  the session line. A spawned coder never gets it (probe B1, §1.4). So ADR-059's rejected "missing line
  means on" never applies, and ADR-059 Decision 2 for spawned plan-only coders is untouched.
- **Opt-outs:** `fkit coder --no-plan-review` (the whole session), `/fkit-task-ship-loop <brief>
  --no-plan-review`, and `/fkit-plan-task <brief> --no-plan-review`. Same name as 0541's flag, same
  "stop on a typo or a conflict" rule.
- **The record:** the coder's `===PLAN-REVIEW RECORD===` block goes **inside the plan-approval
  presentation**. The coder writes it to `plan-review.md` **after approval**, once plan mode has lifted
  its block on `Write`. No subagent ever has to write a file during plan mode (C1/C6 make that
  impossible headless).
- **Hops:** in a session the coder is hop 0, so the approvers are at hop 1. **They stay leaves** (they
  consult no one), by an explicit line in their prompt. That matches the trialled flow (ADR-056
  Decision 7).
- **The weak point is the Codex step under plan mode.** The runtime lets it run (C2, C5). The
  reviewer **model** may still refuse after the plan-mode notice: it did once in two realistic runs
  (C4, run 8-2). Recommended mitigation: a fixed note in the reviewer's spawn prompt, one retry, and
  then a loud `plan review incomplete` flag (owner question Q2).
- **Verdicts:** all three paths are **feasible with a condition: confirm by owner probe** (C7/C8 are
  not settled). The Tier-2 interactive probe (§8) must run **before any build**.
- **Finding, scoped to headless evidence:** plan mode **did not gate Bash at all** (C2). fkit's
  documents call plan mode a "structural write-wall". On this evidence it is a wall for `Write`/`Edit`
  only. §6 sets out the follow-up options. That choice is the owner's (Q7).

---

## 1. Evidence: the plan-mode probe (the official record)

The full Step A record is the task's `worklog.md`, §"Step A — plan-mode probe record" (blob above).
Raw transcripts: `/private/tmp/claude-501/-Users-mark-dolbyrev-Workspace-fkit/419e99ae-6e82-48b2-bd33-a10f5e221dd1/scratchpad/out/run*.jsonl`
(scratch, not kept). This section restates its conclusions, then adds one Step-B probe.

### 1.1 Setup (from the worklog, A.1)

Claude Code `2.1.310`; Codex present (`codex-cli 0.157.1`). Every run was `claude -p` in a throwaway
`git init` repo under the scratchpad. The owner's user settings were loaded (`defaultMode: auto`),
except in runs 2c/2f. **No fkit agents, hooks or role lock were present**, so the interactive
`fkit coder` setup was **not** reproduced. None of the four agents involved sets `permissionMode` in
its frontmatter. The adversarial reviewer has no `Write` tool
(`claude/agents/fkit-adversarial-reviewer.md:9`, `tools: Read, Grep, Glob, Bash, Skill`), so its temp
file can only be written by Bash (`claude/skills/fkit-adversarial-review/SKILL.md` step 2, *"Write the
prompt through a Bash heredoc"*, ~:51).

### 1.2 Conclusions C1–C8 (verbatim status from the worklog, A.3)

| # | Conclusion (short) | Status | Runs |
|---|---|---|---|
| C1 | Plan mode **denies `Write`** outside the plan file, for the main agent and for subagents, even with a `Write` allow rule | settled (headless) | 2b–2d, 3b, 5a, 5b, 6 |
| C2 | Plan mode puts **no gate on Bash**: writes, `rm -rf` and `git push --force` all ran. That is looser than `default` mode, where the same Bash write was denied | settled (headless). Why it does this is unknown | 2b–2f, 3, 3b, 4, 5a, 5b, 6, 8 vs 1, 1c, 5-ctl |
| C3 | Plan mode **reaches subagents** through a notice after their first tool call | settled (headless) | 3, 3b, 4, 5b, 8 |
| C4 | The only thing holding Bash back in plan mode is **the model's own restraint**, and it is non-deterministic | settled (headless): non-deterministic | 8-1 vs 8-2, 3, 2a |
| C5 | A subagent **can** write the `.fkit/tmp/` prompt by heredoc and run `codex exec --sandbox read-only` to exit 0 | settled as *possible*; **not settled** as *reliable* | 4, 5b, 8-1 |
| C6 | An approver-style subagent **cannot** persist a record with `Write` during plan mode | settled (headless) | follows from C1 |
| C7 | Interactive `fkit coder` plan mode: whether `Write` prompts the owner, whether Bash prompts, whether the real reviewer completes, whether `@fkit-architect` runs | **not settled** | needs Tier 2 |
| C8 | Effect of the owner's `defaultMode: auto` / `autoMode` on plan mode, interactively | **not settled** | needs Tier 2 |

### 1.3 What these conclusions force on the design

- **C1/C6 → no file writes by any worker during plan mode.** The record travels back to the coder,
  which shows it at the gate and persists it after approval.
- **C3/C4 → the Codex step is the reliability risk.** Approvers only read and reply, so the plan-mode
  notice asks nothing of them that they would do anyway. The adversarial reviewer must do two
  non-read actions (heredoc, `codex exec`), and a reviewer model refused one of them in run 8-2: *"Codex
  … still writes its own session files to your system, so I counted it as not read-only."*
- **C2 → do not lean on plan mode for Bash in either direction.** The design must not assume Bash is
  blocked (the wording finding, §6). It must also not *use* the Bash gap to write records during plan
  mode: that would turn a runtime quirk into a dependency.

### 1.4 Step-B addition: probe B1 (headless, one run, run by this architect)

This was run to check the signal design in §3.1. It is **not part of the approved plan**; it is
recorded here as an addition. It ran in the same scratch repo, clean env, with this command:
`claude -p --agents agentsB.json --agent mainb --append-system-prompt "SESSION LINE: ZQX-7731-MARK …"
--permission-mode plan --settings hooksB.json --max-turns 8`. Transcript:
`/private/tmp/claude-501/-Users-mark-dolbyrev-Workspace-fkit/419e99ae-6e82-48b2-bd33-a10f5e221dd1/scratchpad/out/runB1.jsonl`.

| Check | Observed | Status |
|---|---|---|
| `--agent` and `--append-system-prompt` combine | The main agent quoted the appended line verbatim | settled (headless) |
| The appended line reaches a spawned subagent | The subagent (task text did **not** contain the token; checked in the `Agent` tool input) answered **`NOT PRESENT`** | **observed once, model self-report**. Strong enough to design on; confirmed by Tier-2 step 5d (§8) |
| A `PreToolUse` hook sees the mode | Hook input carried `"permission_mode": "plan"` and `"agent_type": "mainb"` for the main agent's Bash call | settled (headless) for the **main agent only**. A subagent's hook input was not captured |

Exit 0; no file written in the repo; `--max-turns 8`. This matters for §3.1 (the launcher line is
session-only) and §6 option B (a hook could tell plan mode apart).

---

## 2. Goal, constraints, scope

**Goal.** The owner's intent (ADR-059 Decision 1, owner 2026-10-24, *"All paths"*): plan review on by
default in the `fkit coder` session, `/fkit-task-ship-loop` and a plain `/fkit-plan-task`. It is
**provisional**, and the old path stays one parameter away (brief §Context; trial summary §9, the
owner's words *"keep the old one available via a parameter"*, `reports/2026-10-24-plan-review-trial-summary.md:191`).

**Hard constraints.**
- **ADR-059 Decision 2 is unchanged:** a **spawned** plan-only coder runs plan review only on a
  driver's switch line, and *"Nothing else turns it on"*. ADR-059's rejected option *"Default in
  `fkit-plan-task` itself"* (a missing line meaning "on") must not come back in through the session
  design.
- **ADR-056 Decision 5 / ADR-019 Decision 2:** the plan gate stays the one human checkpoint, and the
  owner approves last. Plan review only adds consults before the gate.
- **ADR-056 Decisions 1, 4, 6 and 8 carry over:** the classification wording, the flow and its
  2-round cap, `plan-review.md` kept separate from `plan.md`, and "trust, not proof".
- **ADR-054:** Codex is optional. Without it, the pass is Claude-only and flagged *NOT model-diverse*.
- **ADR-010:** the two-hop limit and no cycles. ADR-018: the skill lock (approvers run no skill, so
  the lock has nothing to deny).
- **Opted out = today.** Every path must show that its opt-out behaves exactly as today, apart from
  the report line (if the owner carries over ADR-059 Decision 7, Q5).
- This task changes **nothing under `claude/`** (baseline rule, owner ruling above).

**Out of scope.** Spawned coders (sprint loop and lead; ADR-059 Decision 2 stays as it is). The
sprint loop's own flag. Building anything. The final keep/drop ruling, which comes after the owner's
real-project use.

---

## 3. Proposed design

### 3.0 Shape

```
fkit coder [--no-plan-review]            ← launcher (claude/fkit-claude.sh) — session-wide switch
   │  writes ONE session line into the main session's system prompt (--append-system-prompt)
   ▼
fkit-coder session (hop 0, owner present, has AskUserQuestion + EnterPlanMode)
   ├── /fkit-plan-task <brief> [--no-plan-review]            ← plain path
   └── /fkit-task-ship-loop <brief> [--no-plan-review]       ← forwards the flag to step 2's /fkit-plan-task
            │
            ▼
   fkit-plan-task: EnterPlanMode → draft → GATE CHECK ─ off → step 7 as today
                                              │ on
                                              ▼
            classify → ask @fkit-architect / @fkit-producer (hop 1, leaves, parallel)
            → ≤2 revision rounds → disagreement? → AskUserQuestion to the owner (in session)
            → @fkit-adversarial-reviewer "Attack this plan" (hop 1; Bash heredoc + codex exec)
            → ExitPlanMode: banners · plan · 3 attachments · RECORD block
                                              │ owner approves
                                              ▼
            write plan-review.md (+ plan.md on the ship-loop path, as today)
```

### 3.1 What turns it on: the session gate (all three paths)

`fkit-plan-task`'s gated section (`claude/skills/fkit-plan-task/SKILL.md:54-148`, *"Run this section
only if your spawn prompt carries the driver's switch line"*) gains a **second, session-only source**.
Build will write wording like this:

> Run this section if **either** (a) your **spawn prompt** carries the driver's switch line (unchanged),
> **or** (b) you are the **session coder**, which takes **both** of these: your **system prompt**
> carries the launcher's line `fkit session: coder · Plan review: on — the default for fkit coder
> sessions (owner ruling 2026-10-24, ADR-060), launched <UTC>`, **and** `AskUserQuestion` is in your
> toolset. If this invocation's arguments carry `--no-plan-review`, skip it. Nothing else turns it on.

Why both checks in (b):
- **The launcher line** is written by a shell process (`claude/fkit-claude.sh:559`, `exec claude
  --agent "fkit-$role" --settings "$settings" "$@"`). A task brief or plan cannot put it there: those
  reach the coder as files it reads, not as its system prompt. Two owner-controlled things **can**
  carry the same text: the owner's own pass-through `--append-system-prompt`, and an always-loaded file
  such as `CLAUDE.md`. Both need the owner (or a repo file he keeps) and matter only in a live session
  he is in; the live-session check still keeps every spawn off. A quote of the line inside a file the
  coder reads does not count; this report and ADR-060 both quote it. That is a prose rule the model
  follows: trust, not proof (ADR-056 Decision 8). If the line is missing, the answer is **off**. That
  is exactly the property ADR-059's rejected option lacked.
- **The live-session check** is the existing measured seam: a spawned coder lacks `AskUserQuestion`
  (`claude/agents/fkit-coder.md`, §Output format, *"The measured failure mode is `TOOL_ABSENT` (3/3)"*).
  It guards the case where a future runtime passes appended prompts down to subagents. Probe B1 says
  that does not happen today, observed once (§1.4).
- **Each check fails toward off,** so a broken signal can only give today's behaviour, never an
  unasked-for review in a spawn.

**Inline plans** (`fkit-coder.md:10-14`, *"run /fkit-plan-task (or produce an inline plan)"*) get
**no** plan review. The switch is in `fkit-plan-task`, and an inline plan is the coder's small-work path.
This is a design choice the owner can override (it is part of Q1).

### 3.2 The opt-out, per path

| Path | Opt-out | Read when | Its effect |
|---|---|---|---|
| `fkit coder` session | `fkit coder --no-plan-review`. The **launcher consumes it** (it is not passed to `claude`) and writes the **off** line `fkit session: coder · Plan review: off — fkit coder --no-plan-review (owner, at launch <UTC>)` | once, at launch; it holds for the whole session; to change it, relaunch | every `/fkit-plan-task` in the session skips the gated section |
| `/fkit-task-ship-loop` | `/fkit-task-ship-loop <brief> --no-plan-review` | once, at loop start; forwarded to step 2's `/fkit-plan-task` | that loop's plan is not reviewed |
| plain `/fkit-plan-task` | `/fkit-plan-task <brief> --no-plan-review` | per invocation | that plan is not reviewed |

Shared rules, copied from ADR-059 Decision 4:
- **`--plan-review` is accepted as a no-op.**
- **On the two skills: both flags together, or any unrecognised `--` token, stop the command before
  planning**, and it asks the owner.
- **At the launcher the rule is narrower, because args after a role pass through to `claude`**
  (`fkit-claude.sh` usage text: *"Args AFTER a role pass through to `claude`"*). After `coder`, the
  launcher takes out only the exact tokens `--no-plan-review` and the no-op `--plan-review`, wherever
  they appear among the args. Both together is a usage error. After any other role, either token is a
  usage error with fkit's own message. Every other arg passes through unchanged, as today, so `fkit
  coder --resume` keeps working. Build 1's plan names the edge cases: a token after a `--` separator,
  or the same text used as another option's value. A mistyped `--` flag such as `--no-plan-reveiw`
  reaches `claude`, which refuses to start (measured by the reviewer: `error: unknown option
  '--no-plan-reveiw'`, Claude Code 2.1.310). So on that version a typo never starts a session with
  review silently on.
- **If an on line and an off line are both present** (for example `fkit coder --no-plan-review
  --append-system-prompt "<on line>"`), **off wins**: every conflict fails toward off, like each check
  in §3.1. The two owner-controlled carriers of the on text are named in §3.1; a quote of the line
  inside a file the coder reads does not count (trust, not proof, ADR-056 Decision 8).
- **The flag passes the one-skill-one-output litmus**, for the same reason as ADR-059 Decision 4: it
  changes what work the plan step does. Build updates `fkit-task-ship-loop`'s *"**Argument:**"*
  paragraph (*"there are **no output-variant arguments**"*, ~:64-68); the litmus still holds there.
- **The launcher accepts `--no-plan-review` only after `coder`.** `fkit lead --no-plan-review` and
  similar are a usage error: the sprint loop has its own flag, and the other roles do not plan.
- **No line at all** (a session started with raw `claude --agent fkit-coder`, outside the launcher)
  means off. It reports as `Plan review: off (no fkit session line)`.

**Opted out is today's behaviour.** With any opt-out (or no line), the gate sends the coder *"from
Workflow step 6 straight to step 7, exactly as if it were not here"* (`fkit-plan-task/SKILL.md:62-63`).
That is today's text, and today's flow runs unchanged. There are only two differences:
1. The one report line (Q5).
2. In every `fkit coder` session, the launcher's line is now in the system prompt. It is an added
   instruction, not a changed behaviour.

`/fkit-task-ship-loop` steps 1–9 do not change at all when it is opted out.

### 3.3 The flow in a session (what differs from ADR-056 Decision 4)

ADR-056 Decision 4's steps carry over unchanged unless listed here.

1. **Classify.** Same wording (ADR-056 Decision 1).
2. **Ask.** Spawn the approvers in parallel. The hop line becomes *"You are being consulted at hop 1 of
   2; chain: coder → <role>. You are a plan-review approver: answer from files and consult no one; put
   anything you cannot settle as an open question."* (§3.5).
3. **≤2 revision rounds.** Unchanged.
4. **A disagreement after round 2.** The **session coder asks the owner directly** with
   `AskUserQuestion`, inside plan mode, following `conventions/asking-the-owner.md`. There is no
   `NEEDS-DECISION` and no re-spawn: the owner is present. The ruling is quoted in the record with date
   and channel (`fkit coder session, AskUserQuestion`). Then the coder goes on to step 5. *(Condition:
   that `AskUserQuestion` works inside interactive plan mode is not probed. That is Tier-2 step 5c.)*
5. **Codex last.** `@fkit-adversarial-reviewer`, *"Attack this plan"*, hop 1. For the **plan-mode
   note** (the Q2 recommendation), see §3.6. Its banner goes first, verbatim. The plan is not changed
   after Codex. There is one coder check per finding.
6. **The owner approves last,** through `ExitPlanMode`. Order: banners → the line `Plan review: ON
   (default)` → the plan → three attachments (who approved and the classification · what changed and
   why · Codex findings with the coder checks) → **the full record block**. Then approve or reject.

**The owner's view while it runs (Q3 recommendation):** one short chat line as each step returns, for
example `Plan review: round 1 — architect APPROVE, producer CHANGES REQUESTED (2 points)`. In a session
the owner can watch it happen rather than have it all go on *"behind the scene"* (trial summary :191).

**Owner feedback at the gate** (he declines `ExitPlanMode` and asks for changes): the revised plan is
**not re-reviewed** unless he asks (Q4 recommendation). It is shown under a banner `revised after
owner feedback — not re-reviewed`. The record gains a line `Owner revision: <his words quoted> — not
re-reviewed`. Reason: the owner's word outranks the approvers' (ADR-056 Decision 5, *"the owner
approves last"*), and a second full pass costs ~17 minutes again (trial summary :64).

### 3.4 Who writes `plan-review.md`

| Path | Writer | When | Contents |
|---|---|---|---|
| `/fkit-task-ship-loop` | the session coder | **step 4, on approval**, next to `plan.md` (*"On approval (plan mode releases the write wall), write the approved plan"*, ~:149) | the record block as shown at the gate, plus `Presented: <UTC>`, `Owner decision: approved via ExitPlanMode, <UTC>, fkit coder session`, under `## Attempt N — <date>` (ADR-056 Decision 6 format) |
| plain `/fkit-plan-task` with a task-folder brief | the session coder | on approval, before any other edit | the same. **`plan.md` is still not written** on this path (unchanged; Q6 sets out the options) |
| plain `/fkit-plan-task`, inline work (no task folder) | nobody | — | the record lives only in the approval presentation (the session transcript). This is said in the presentation |
| rejected (owner ends the plan without approving) | nobody | — | **not persisted**. Plan mode still blocks `Write`, and using Bash to get around that is ruled out (§1.3). The rejection report says so: `plan-review record not persisted (plan rejected while in plan mode)` |

**A difference from the sprint loop, stated plainly.** There, a driver copies a worker's returned
record. Here, the agent that ran the review also writes the record. That is a **self-record** —
fidelity, not proof (ADR-056 Decision 8). One thing bounds it: the owner saw the **same block at the
gate**, so any drift between the two can be spotted by comparing them. A `Write` that fails after
approval is a `Problems:` entry, and the loop still goes on (the record is evidence, not scope).

Rejected attempts were kept under ADR-056 Decision 6 *"because rejected attempts are trial evidence
for `0474`"*. The trial is over (ADR-059), so dropping them on the session paths loses no promised
evidence. It is recorded here as a known gap.

### 3.5 The hop budget

- **The chain in a session:** `coder (hop 0) → architect / producer / adversarial-reviewer (hop 1)`.
  The coder is hop 0 because it is the session (`fkit-coder.md:175`, the example *"hop 1 of 2; chain:
  coder → reviewer"*).
- **Decision (the architect's; recorded at Step C):** **approvers stay leaves**, by an explicit
  instruction in their hop line (§3.3 step 2), even though hop 1 would let them consult. Reasons:
  1. **Same flow as the trialled one.** ADR-056 Decision 7 had them at hop 2, unable to consult, and
     the trial judged that flow.
  2. **Independent verdicts.** An architect approver consulting the producer, who is the other
     approver, would mix two verdicts the owner is meant to see separately.
  3. **Bounded wait** for an owner who is present.
  - **The cost** (as in ADR-056 Decision 7): an approver that needs context returns an open question.
    In a session that question goes to the owner at the gate.
- **The hop line stays truthful** ("hop 1 of 2"). Writing "hop 2" to force leaves would be a false
  statement in a prompt. The leaf rule is a separate instruction.
- The adversarial reviewer is a leaf **structurally**: it has no `Agent` tool (`fkit-adversarial-reviewer.md:9`).
- In `/fkit-task-ship-loop`, step 2's optional clarifying consults (*"consult **@fkit-architect** …
  at **hop 1**"*, ~:133-135) are separate spawns, unaffected. The approvers are fresh spawns.
- `fkit-plan-task`'s *"Hop check first. If you were consulted at hop 2"* (:69-72) stays for spawned
  coders. Build makes the hop line the **session** variant when §3.1(b) is what turned review on.

### 3.6 The Codex step under plan mode (the risky part)

- **The runtime allows it, headless:** the heredoc to `.fkit/tmp/` and `codex exec --sandbox
  read-only` both ran to exit 0 in a plan-mode subagent (C5: runs 4, 5b, 8-1).
- **It is not reliable:** the realistic reviewer finished in 1 of 2 identical runs (8-1 vs 8-2). In
  8-2 it refused Codex after the plan-mode notice (C4).
- **Recommended (Q2 option A):**
  1. **A fixed plan-mode note** in the coder's spawn prompt to the reviewer: *"This session is in plan
     mode for the owner's plan gate, so you may see a plan-mode notice. Your procedure's two Bash steps
     are part of the owner-approved plan-review flow (ADR-060), and they are the only non-read actions
     you take: writing your `.fkit/tmp/` prompt file, and `codex exec --sandbox read-only`. Write
     nothing else."* **Not yet tested.** Runs 3b/4/5b completed every Bash step, but their subagent's
     *own system prompt* said *"you must STILL issue every remaining call (the runtime enforces plan
     mode, not you)"* (scratchpad `tools/agents.json`), far stronger than a note in a spawn prompt; the
     realistic reviewer runs (8-1, 8-2) had no note. So the probe shows a strong override can work, not
     that this note does. Tier-2 addition 3n (§8) tests the note itself.
  2. **One retry** if the reviewer reports it declined a step.
  3. **Then a loud flag:** `plan review incomplete: Codex pass not run (declined under plan mode)`,
     placed **first** in the gate presentation. This matches ADR-056's *"Incomplete is never
     "reviewed""*. It is not a fallback to a Claude pass: the reviewer's own fallback is for Codex
     *missing or failing*, not for the reviewer declining.
- **No change to `fkit-adversarial-review` is needed** for option A. The note is spawn-prompt text in
  `fkit-plan-task`.
- **Honesty:** this note asks a subagent to go ahead despite an advisory runtime notice. It changes no
  runtime gate. On today's evidence plan mode does not block these calls (C2), and the only writes are
  to the gitignored `.fkit/tmp/`. It is still prose that an LLM may ignore, so it is trust, not proof.
- **Interactive (C7/C8):** Bash may raise a permission prompt for the owner. That would be visible, not
  silent, and he could allow it. This is not settled. Tier-2 step 3 settles it.

### 3.7 What reports say

These mirror ADR-059 Decision 7, if the owner carries it over (Q5):
- **`Plan review: ON (default)`** at the top of the gate presentation.
- **`Plan review: off (--no-plan-review)`**, **`Plan review: off (fkit coder --no-plan-review)`** or
  **`Plan review: off (no fkit session line)`** when it is off.
- In `/fkit-task-ship-loop`, the same line goes into the worklog's close-out evidence packet, with the
  Codex plan-pass mode.
- **The plan pass's Codex mode does not change step 9's close posture.** That keys on the **code**
  review's `Codex unavailable` (`fkit-task-ship-loop/SKILL.md` step 6, ~:171-176). A NOT-model-diverse
  *plan* pass is flagged in the packet; it does not withhold the close.
- A presentation with **no** plan-review line is a defect, as ADR-059 Decision 7 has it.

### 3.8 Without Codex

ADR-054 applies. The reviewer falls back to a Claude pass whose banner says *NOT model-diverse*, and
the banner goes first, verbatim. The recommendation (Q5) is to carry over ADR-059 Decision 8 (*"Accept,
flagged"*) to sessions. The opt-out is the flag. The cost: in a Codex-less project, every session plan
gets a Claude-only attack pass plus the approver rounds.

---

## 4. Per path: the brief's required points, and a verdict

### 4.1 `fkit coder` session (the session-wide switch)

- **On:** the launcher's on line, plus the live-session check (§3.1).
- **A brief cannot fake it:** the line comes from the launcher process; missing means off.
- **Opt-out:** `fkit coder --no-plan-review`.
- **`plan-review.md`:** written by the session coder after approval, through the path in use (§3.4).
- **Hops:** coder 0 → approvers 1, kept as leaves.
- **What the owner sees:** progress lines, then the gate presentation (§3.3).
- **Without Codex:** flagged Claude pass (§3.8).
- **Opted out = today** (§3.2).
- **Verdict: feasible with a condition: confirm by owner probe.** Conditions:
  - Tier-2 steps 3/3n/4/5/5b/5c settle C7/C8 (the reviewer completes interactively with the §3.6
    note, or any prompt is allowable; the approvers run; `AskUserQuestion` works in plan mode).
  - Tier-2 step 5d confirms that the appended line does not reach a subagent (B1, observed once).
- **Build risk:** if the owner already passes his own `--append-system-prompt` through the launcher's
  pass-through args, two such flags may conflict. Build checks the runtime's behaviour (or uses
  `--append-system-prompt-file`), and a launcher test covers it (ADR-057; a new test file needs the
  owner's OK by name, ADR-057 §D2.1).

### 4.2 `/fkit-task-ship-loop`

- **On:** the session gate, through step 2's `/fkit-plan-task`.
- **Opt-out:** `--no-plan-review` on the loop, forwarded to step 2.
- **The interaction with its own plan gate** (ADR-019 Decision 2):
  - Review runs **inside** step 2, before step 3's `⛔ STOP — plan approval`. Step 3 stays the one
    guaranteed stop (ADR-056 Decision 5 unchanged).
  - Step 3's presentation gains the banners, the attachments and the record (§3.3 step 6).
  - Step 4 also writes `plan-review.md` (§3.4).
  - Step 3's rejection branch (*"no worklog is opened before approval"*) gains the not-persisted line.
- **Hops:** as in 4.1.
- **Without Codex:** flagged, and it does not change step 9 (§3.7).
- **Opted out = today:** steps 1–9 are unchanged.
- **Verdict: feasible with a condition: confirm by owner probe** (as for 4.1). It also depends on
  build 1 (§7).

### 4.3 Plain `/fkit-plan-task` in a session

- **On:** the session gate.
- **Opt-out:** `--no-plan-review` on the call.
- **`plan-review.md`:** written at approval when the argument is a task-folder brief (Q6). Otherwise it
  lives only in the presentation.
- **What is new:** the plain path persists nothing today, so the record is new.
- **Hops, view, Codex:** as in 4.1.
- **Opted out = today:** Workflow steps 1–7, unchanged.
- **Verdict: feasible with a condition: confirm by owner probe.**

### 4.4 Not feasible (rejected on the evidence)

- **An approver or reviewer persisting a record with `Write` during plan mode:** not feasible headless
  (C1/C6). It would be feasible interactively only if a prompt appears and the owner allows it (C7, not
  settled). That is not worth depending on.
- **Writing the record by Bash during plan mode** works headless (C2). It is **rejected** anyway: it
  would make the design depend on a gap that may be a quirk or may close.

---

## 5. The brief's open questions 1–9

| # | Brief question | Answer here |
|---|---|---|
| 1 | Plan mode vs the Codex temp file; does the wall reach subagents? | Reaches them, as a notice (C3). Bash is not gated (C2), so the temp file and Codex **can** run (C5), but the model may decline (C4). Interactive: not settled (C7). §3.6, Q2 |
| 2 | What turns it on without a driver; does "a brief is not the switch" hold? | The launcher session line plus the live-session check. Missing means off. The rule holds (§3.1). Q1 |
| 3 | The opt-out's form; same name as 0541's? | `--no-plan-review` at the launcher and on both skills (§3.2). Q1 covers the launcher part |
| 4 | Who writes `plan-review.md` | The session coder, after approval (§3.4). Q6 covers the plain path |
| 5 | Agents before the owner; how much he sees | Agents first; live progress lines; the full record at the gate (§3.3). Q3 |
| 6 | What a session reports, on and off | Mirrors ADR-059 Decision 7 (§3.7). Q5 |
| 7 | Cost and wait in a live session | ~17 min median per plan (trial :64), on every `/fkit-plan-task`. Owner-feedback revisions not re-reviewed by default. Q3, Q4 |
| 8 | Codex-less projects | Flagged Claude pass, as ADR-059 Decision 8 (§3.8). Q5 |
| 9 | ADR form | **Architect's call: a new ADR-060** (plan rec), written at Step C. It amends ADR-056 Decision 3 and ADR-059 Decision 3 for sessions, and keeps ADR-059 Decision 2 for spawns. Pointer notes on ADR-056/059 are additions only |

---

## 6. Finding: plan mode is not a Bash wall (headless evidence)

**What fkit says.** Several places describe plan mode as a structural or runtime write-wall for the
session coder:
- `claude/agents/fkit-lead.md`, the bullet *"⚠️ The orchestrated plan gate is prose, not a wall"*
  (~:126-129): *"not by plan mode's structural write-wall … An owner who wants the structural wall for a
  task ships it the old way: `fkit coder` + `/fkit-task-ship-loop`"*. Also §*"When the owner wants a
  dedicated role session instead"* (~:190-191), *"plan mode's **structural** write-wall"*.
- `claude/skills/fkit-sprint-ship-loop/SKILL.md`, §*"⚠️ The plan-gate honesty clause"* (~:69-82),
  *"Plan mode — the coder session's structural write-wall"*. Also the hard rules (~:271, ~:499-500).
- `claude/skills/fkit-task-ship-loop/SKILL.md`, §*"What makes this autonomous"* (~:82), *"runtime-enforced
  by plan mode"*. Also step 2 (~:136-137) and step 4 (~:149).
- `claude/skills/fkit-plan-task/SKILL.md` step 1 (:32-35), *"a **wall the runtime enforces**, not a
  promise: `Write` and `Edit` are refused"*. This one is accurate about `Write`/`Edit`, but it is silent
  on Bash, and it reads as "no files edited".
- ADR-031 §*"The plan-gate honesty clause"* (:132-133), ADR-032 Decision 7 (:153) and :291-292, and
  ADR-019 Decision 2 (:69, *"runtime-enforced by plan mode"*).

**What the probe saw (headless only, Claude Code 2.1.310).**
- Plan mode blocked `Write` (C1).
- It put **no gate on Bash**: a Bash redirect wrote files, `rm -rf .fkit` deleted a directory, and `git
  push --force` was let through to git (run 2e). This held for the main agent and subagents, with or
  without the owner's settings (C2).
- The only restraint was the model's own, and it was non-deterministic (C4).
- In `default` mode the same Bash write **was** denied (runs 1, 1c). So, headless, plan mode is
  **looser** than default mode for Bash.

**What this means, scoped.**
- If this holds interactively (C7, not settled), the session wall covers `Write`/`Edit` only.
- A confused coder in plan mode could still write source with Bash, just as ADR-031's honesty clause
  says a spawned sprint-loop worker could.
- So the contrast fkit draws ("orchestrated = prose; session = structural wall") is **narrower than
  stated**.
- This does **not** reopen ADR-031's accepted cost. It corrects how the alternative it points to is
  described.

**Proposed follow-up (not filed; owner decision, Q7):**
- **A (Rec). After Tier 2 confirms,** file one **wording-correction** task. It changes no behaviour:
  - Reword the places above: *"plan mode blocks `Write`/`Edit`; Bash is held back only by the model's
    plan-mode instructions"*.
  - Add dated additions-only notes on ADR-019/031/032 (architect).
- **B. A + design a plan-mode Bash guard.** A `PreToolUse` hook sees `permission_mode: "plan"` (probe
  B1, main agent only). It could deny Bash in plan mode except a read-only allowlist. That would be a
  real wall. The costs:
  - A Bash read-only classifier is hard, and it could break plan-mode reading.
  - It would have to allowlist §3.6's two reviewer calls, so it interacts with Q2.
  - It is not known whether a subagent's hook input also carries the mode.
- **C. Record the finding only;** decide after Tier 2.

---

## 7. Build split — final (Step C; for the producer to file; owner placement ruling: *"Sprint 12"*)

**The Tier-2 gate — on every build brief, stated as a precondition, not a `Depends on:` link** (owner,
2026-10-24 ~15:12 UTC: *"Your test stays a check before any build."*; Q7: *"after your probe
confirms"*):
- The owner's Tier-2 probe (§8) **has run**, and its results are **recorded verbatim** — relayed by the
  lead to a `fkit-architect` spawn, which appends a dated *"§8a Tier-2 results"* section to this report
  and reads them against §8's mapping table.
- The build's coder checks for §8a **before planning**; if it is missing, it stops and asks (session)
  or returns `NEEDS-DECISION` (spawn). It does not plan around a missing probe.
- If any result hits a §8 row other than *"§3.6 option A stands"*, the design goes back to the
  architect and ADR-060 gets a dated note **before** that build is planned.
- **A skipped labelled addition** (3-notice, 3n, 3m, 3m-bis, 5b, 5c, 5d) is recorded in §8a as
  skipped, never as passed. Its condition stays unconfirmed, and the build whose design rests on it
  (build 1 and so build 2: 3-notice, 3n, 5b, 5c, 5d; build 3: 3m, 3m-bis) names it at its plan gate
  and asks the owner (session: `AskUserQuestion`; spawn: returns `NEEDS-DECISION`, the same as the
  missing-§8a rule above) whether to go ahead with it unconfirmed or run it first.
- The probe is a check, not a task: it has no brief and no board row, so it cannot be a `Depends on:`
  entry.

| # | Proposed brief title | Owner | Depends on | Touches (expected) |
|---|---|---|---|---|
| 1 | Turn plan review on by default in `fkit coder` sessions and plain `/fkit-plan-task`: launcher session line, `fkit coder --no-plan-review`, and `--no-plan-review` per command | fkit-coder | `0542` (+ the Tier-2 gate) | `claude/fkit-claude.sh` (consume `--no-plan-review` after `coder` only; write the on/off line; usage text); **a launcher test — the owner has NOT OK'd one by name** (his Q1 option said *"Launcher test needs your OK."*, which is not that OK; ADR-057 §D2 item 1) — build 1's plan gate names the file or cases and asks; `claude/skills/fkit-plan-task/SKILL.md` gated section (session gate §3.1, flag, session hop line + leaf rule, owner-asked disagreement, the Codex plan-mode note + one retry + flag, progress lines, the not-re-reviewed banner, the report lines, `plan-review.md` at approval on a task-folder brief); `claude/agents/fkit-coder.md` (procedures bullet; adversarial-reviewer consult bullet); `claude/agents/fkit-architect.md` and `fkit-producer.md` (their plan-approval paragraph: an approver consults no one at any hop); `claude/agents/fkit-lead.md` (the bullet *"Only the sprint loop has it"*); `ai-agents/tasks/README.md` + scaffold twin (`plan-review.md` writer on session paths); `CHANGELOG.md`. Also confirm at its plan gate: inline plans get no plan review (ADR-060 *Open questions*) |
| 2 | Turn plan review on by default in `/fkit-task-ship-loop`: forward `--no-plan-review`, show the review record at the plan gate, write `plan-review.md` at approval | fkit-coder | build 1 (+ the Tier-2 gate) | `claude/skills/fkit-task-ship-loop/SKILL.md` (*"**Argument:**"* paragraph, steps 2–4, step 3's rejection branch, the close-out evidence packet); `CHANGELOG.md` |
| 3 | Correct fkit's "plan mode is a structural write-wall" wording: plan mode blocks `Write`/`Edit`, not shell commands (no behaviour change) | fkit-coder (the `claude/` text); the dated ADR-019/031/032 notes by a `fkit-architect` consult inside the task | none (+ the Tier-2 gate) | the files listed in §6. **If Tier-2 addition 3m (or 3m-bis) shows the session's own Bash prompts or is denied by the runtime**, the scope shrinks to recording the headless-only finding (§8 last row) |

- **Order, not dependency, for build 3:** it waits on no task (owner Q7: *"Waits on nothing; nothing
  waits on it."*). It shares files with builds 1–2 (`fkit-task-ship-loop`, `fkit-plan-task`,
  `fkit-lead.md`). **Advice:** if it runs in the same stretch, land it after them to avoid a mixed edit;
  this is not a `Depends on:` link.
- **Knock-on (Sprint 12, the owner's ruling):**
  - Build 1 waits on 0542 in the same sprint. Build 2 waits on build 1, same sprint. Build 3 waits on
    no task. None waits on a later sprint.
  - No open task waits on any of them (re-checked at Step C: only 0541's done folder, `sprint-12.md`,
    ADR-059, this report and 0542's own folder reference 0542; none as a `Depends on:` of an open task).
  - All three are also blocked in practice by the Tier-2 gate, which only the owner can clear.
- **Risk, already accepted in the owner's option text:** builds 1 and 2 edit `fkit-plan-task`, and this
  run's later plan spawns read it. The driver has old text loaded.
- **ADR-052 phase 5 overlap** (`0453`, `0450`, `0451`, `0457`, all Backlog; 0453 needs the owner's
  word): this is file overlap with `fkit-task-ship-loop`, not a dependency link. **These builds land
  first; 0453 carries the switch, the flag and `plan-review.md` forward** (ADR-059 re-raise:
  *"if an ADR-052 phase-5 change drops the gated blocks, the flag, or `plan-review.md`"*).
- **Live check needs a relaunch:** `.claude/` refresh plus a new `fkit coder`. The check cannot run
  inside this lead session.

---

## 8. The confirming check: owner-run Tier 2 (must run **before any build**)

Steps 1–8 are the **approved plan's** (plan Step A, Tier 2). The extra steps are **labelled additions,
not in the approved plan**. The owner may skip them; the conditions they cover would then stay
unconfirmed; §7's gate says what then. Everything touches only `.fkit/` (gitignored), except the
optional 3m-bis, which has the owner change his own settings for one run. About 5–8 minutes.

1. In a second terminal at the repo root, run `fkit coder`.
2. Press Shift+Tab until the mode line shows plan mode.
3. Type: *"@fkit-adversarial-reviewer Probe only, review nothing: run `mkdir -p .fkit/tmp && printf
   probe > .fkit/tmp/plan-mode-probe.txt && ls -l .fkit/tmp/plan-mode-probe.txt`, then `codex exec
   --sandbox read-only - < .fkit/tmp/plan-mode-probe.txt`, and report each tool result verbatim."*
   - **Addition (step-3 notice check):** also record whether the reviewer said it saw a plan-mode
     notice and whether it **declined** a step on its own. If it declined, re-run step 3 once and
     record both outcomes.
   - **Addition 3n (review R2): test the option-A note itself.** Type: *"@fkit-adversarial-reviewer
     Attack this plan: 'Plan: add one line to README.md.' <the §3.6 note, verbatim>"*. This runs its
     real `fkit-adversarial-review` procedure. Ask the session to pass the text to the reviewer
     verbatim. Then expand the Agent call and record the prompt it actually sent. If the note is
     missing or reworded, 3n has not tested it; re-run. Record whether the reviewer saw a plan-mode
     notice, whether it wrote its `.fkit/tmp/` prompt file and ran `codex exec`, and any prompt and
     your answer. If it declined, re-run once. If the reviewer reports Codex missing or failing and
     falls back to a Claude pass, 3n has not tested the note: record it as skipped (§7).
   - **Addition 3m (review R3): the session's own Bash in plan mode.** Still in plan mode, type to the
     session itself (not a subagent): *"Probe only: run `printf probe > .fkit/tmp/plan-mode-main.txt`
     with Bash and report the tool result verbatim."* Note any prompt and your answer; check the file
     in step 6. Record which happened: the tool result shows a runtime denial or plan-mode refusal, or
     the model declined and never made the call. A model decline gets one re-run. Also record your
     `defaultMode` and any `autoMode` (in `~/.claude/settings.json`), and any `permissions.allow` rule
     that covers `printf`/Bash: with auto mode or such a rule, a write with no prompt could be that
     approval, not plan mode letting it through (C8).
   - **Addition 3m-bis, only if the 3m row below says so:** the owner sets `defaultMode` to `default`
     in `~/.claude/settings.json` (and removes any matching allow rule) for one run. Then relaunch
     `fkit coder`, Shift+Tab to plan mode, repeat 3m to `.fkit/tmp/plan-mode-main-2.txt`, restore the
     settings, and `rm -f` that file. The only difference between the two runs is the approval
     setting, so the result separates auto approval from plan mode. Editing his own settings is his
     call; if skipped, §7's skipped-addition rule applies.
4. Note whether a permission prompt appeared, what it said, and whether you allowed or denied it.
5. Type: *"@fkit-architect Probe only: reply PROBE-OK and write nothing."*
   - **Addition 5b:** *"@fkit-architect Probe only: use the Write tool to create
     `.fkit/tmp/plan-mode-probe-w.txt` containing `probe`, and report the tool result verbatim."* Note
     any prompt and your answer. This settles C6/C7 for `Write`, interactively.
   - **Addition 5c (new in Step B):** type *"Probe only: ask me one AskUserQuestion with two options, A
     and B, then stop."* Note whether the dialog appears while plan mode is on. This settles the
     condition in §3.3 step 4.
   - **Addition 5d (new in Step B):** quit, relaunch with `fkit coder --append-system-prompt "SESSION
     LINE: ZQX-0542-MARK"` (args after the role pass through to `claude`, `fkit-claude.sh` usage
     text). Then type *"@fkit-architect Probe only: does any line in your system prompt or context
     contain a token starting with the three letters Z Q X followed by a hyphen? If yes quote the line
     verbatim; if not say NOT PRESENT."* (B1's wording: the question never spells the token.) Then ask
     the session itself the same question. Expected: the subagent answers NOT PRESENT and the session
     quotes the line. Only a quote of the full `ZQX-0542-MARK` counts as present, for the subagent
     and for the session alike. This confirms B1 interactively (§3.1).
6. In another terminal, run `ls -l .fkit/tmp/plan-mode-probe.txt` (found or not found).
7. Press Shift+Tab to leave plan mode, run `rm .fkit/tmp/plan-mode-probe.txt`, and close the session.
   - **Addition:** also run `rm -f .fkit/tmp/plan-mode-probe-w.txt .fkit/tmp/plan-mode-main.txt`,
     and `rm` the exact `.fkit/tmp/…-adversarial-prompt.md` path the reviewer reported in 3n (not a
     glob: it could delete another live review's prompt file).
8. Paste the results back to the lead.

**How results map to the verdicts:**

| Result | Effect |
|---|---|
| 3n completes (possibly after an allowed prompt, or on its one retry) | §3.6 option A stands. Step 3 completing on its own shows only that the calls are allowed interactively; it does not confirm option A |
| 3n declines twice | Q2 should move to option B or C |
| Step 5 fails | The whole design is **not feasible** as written; back to the architect |
| 5c fails | §3.3 step 4 falls back to ADR-056 Decision 4.4's return-and-ask, at the gate |
| 5d: the subagent quotes the full `ZQX-0542-MARK` | §3.1 rests on the live-session check alone; the architect re-reviews before build 1 |
| 3m: a permission prompt, or the runtime denies the call | §6 narrows to headless only; build 3 shrinks to recording that |
| 3m: the model declines twice without calling | §6 not tested interactively; build 3's plan gate names it and asks (§7) |
| 3m writes with no prompt, and no auto mode or allow rule could explain it | §6 stands interactively; build 3 rewords as planned |
| 3m writes with no prompt, and auto mode or an allow rule could explain it (C8) | run 3m-bis |
| 3m-bis prompts | §6 narrows to "plan mode lets Bash through only where auto approval or an allow rule does"; build 3's wording says that, after a dated ADR-060 note |
| 3m-bis writes with no prompt | §6 stands interactively |
| A labelled addition skipped | its condition stays unconfirmed; the affected build's plan gate names it and asks (§7) |

---

## 9. Owner questions (for the driver to put via `AskUserQuestion`; the driver adds "Explain more, then ask again" to each)

**Q1. How does a `fkit coder` session know plan review is on, and how do you switch it off for a whole session?**
Context:
- Today, plan review switches on only when a sprint-loop driver adds a line to a coder's instructions.
- A session you open yourself has no driver, so it needs another source that a task brief cannot fake.
- The recommendation: the `fkit` launcher writes one line into the session when it starts it. If the
  line is missing, the answer is "off", which is exactly today's behaviour.
- Small inline plans (work done without `/fkit-plan-task`) get no plan review in either option.

Options:
- **(Rec) Launcher line, plus a launch flag.** `fkit coder` turns it on. `fkit coder --no-plan-review`
  turns it off for that session. `/fkit-plan-task … --no-plan-review` and `/fkit-task-ship-loop …
  --no-plan-review` turn it off for one plan.
  - Cost: the launcher script changes and gets a test, which needs your OK by name.
- **No launcher change: per-command flags only.** On whenever the coder sees it is a live session. Off
  only per command.
  - Cost: no launch-wide off switch.
  - Cost: "on" then rests on one check (the coder can ask you questions), not two.
- knock-on: none (checked). No task placement or `Depends on:` change.

**Q2. Plan mode and the Codex reviewer: how do we handle the reviewer declining?**
Context:
- In the non-interactive test, plan mode did **not** block the reviewer's two Bash steps (its temp file
  and Codex).
- The reviewer model itself sometimes refused after seeing a "you're in plan mode" notice: it finished
  1 of 2 realistic runs.
- Your interactive session may behave differently; your probe settles that.

Options:
- **(Rec) Tell the reviewer the notice is expected; retry once; then flag.** Its instructions say its
  two Bash steps are part of the approved flow. If it still declines, the plan reaches you with
  `plan review incomplete: Codex pass not run` at the top.
  - Cost: some plans may arrive without the Codex pass, clearly flagged.
- **Review before plan mode.** The coder drafts and runs the reviews with plan mode off, then enters
  plan mode only to show you the plan.
  - Codex then runs reliably.
  - Cost: for ~17 minutes per plan the coder has no `Write`/`Edit` block, only its promise (the same
    level as the sprint loop's honesty clause).
- **No Codex pass in sessions:** approvers only.
  - Cost: no model-diverse check on session plans.
- knock-on: none (checked).

**Q3. In a session you're present: what do you see while plan review runs?**
Context:
- It takes about 17 minutes per plan (trial median).
- You said that in the trial it all happened "behind the scene".

Options:
- **(Rec) Agents first, with live progress lines.** One chat line per approver round and for the Codex
  pass. Then the plan with the full review record when you approve.
- **Agents first, silent until the plan.** As in the sprint loop.
- **Ask per plan.** The coder shows you the draft and asks "Run plan review on this plan?" before
  starting.
  - You can skip it for small plans.
  - Cost: one extra question on every plan; it is closer to opt-in.
- knock-on: none (checked).

**Q4. If you ask for changes at the approval step, is the revised plan reviewed again?**
Context:
- At the approval step you can say "no, change X". The coder then revises.
- A second full review costs about another 17 minutes.

Options:
- **(Rec) Not re-reviewed unless you ask.** The revised plan carries the banner `revised after owner
  feedback — not re-reviewed`.
- **Always re-reviewed.** Every revision gets the approvers and Codex again.
- knock-on: none (checked).

**Q5. Carry the two sprint-loop rulings over to sessions?**
Context:
- For sprint-loop runs you chose two things:
  - reports say "Plan review: ON (default)" or "off (--no-plan-review)" both ways;
  - projects without Codex get a Claude-only pass, flagged NOT model-diverse.
- This asks whether sessions follow the same rules.

Options:
- **(Rec) Yes, both.** Same report lines in sessions. Codex-less sessions get the flagged Claude pass;
  the opt-out flag switches it off.
- **Same report lines, but skip the Codex step in Codex-less sessions.** Approvers still run; the
  report says "Codex step skipped — not installed".
- knock-on: none (checked).

**Q6. A plain `/fkit-plan-task` (not inside the ship loop): where does the review record go?**
Context:
- Today a plain `/fkit-plan-task` saves nothing; the plan exists only in the chat.
- The ship loop already saves `plan.md` when you approve.

Options:
- **(Rec) Save only `plan-review.md`, next to the brief, when you approve.** `plan.md` stays unsaved on
  this path, as today.
- **Chat only.** No file. The record is in the approval message.
  - Cost: nothing durable to judge the default from later.
- **Save both `plan-review.md` and `plan.md`.**
  - Cost: plain `/fkit-plan-task` starts writing a plan file, which is a wider change than plan review.
- knock-on: none (checked).

**Q7. Finding: in the test, plan mode did not block shell commands at all. What follow-up?**
Context:
- fkit tells you that a `fkit coder` session in plan mode is a "structural write-wall", stronger than
  the lead's prompt-only rule.
- In the non-interactive test, plan mode blocked the file-writing tool. Shell commands, though, could
  write files, delete a folder and even attempt a force-push. Only the model's own caution held them
  back.
- Your interactive probe will show whether your real session behaves the same.

Options:
- **(Rec) Fix the wording after your probe confirms.** One task. It changes no behaviour; it rewords
  fkit's claims to "blocks Write/Edit; shell held back only by the model".
- **Fix the wording and design a guard.** A hook that blocks risky shell commands in plan mode.
  - A real wall.
  - Cost: hard to get right; it could block plan-mode reading and the Codex step.
- **Record only;** decide after your probe.
- knock-on: Rec and the second option file a new task in Sprint 12 (your build-placement ruling) that
  waits on no task, and no open task waits on it. Its file overlap with builds 1–2 is not a dependency.
  The third option: none (checked).

---

## 10. Owner answers

**Channel and date for every answer below:** `fkit lead` session driving `/fkit-sprint-ship-loop`
(Sprint 12 run), via `AskUserQuestion`, relayed verbatim to this architect by `fkit-lead`. By ADR-056
Decision 8 a relay is trust, not proof. Each entry: the question as asked → the selected option label →
the description he saw.

### 10.1 The design questions (§9) — 2026-10-24, ~15:30 UTC

| Q | Question as asked | Selected option | Description he saw | What it settles |
|---|---|---|---|---|
| Q1 | *"Q1 — How does a coder session know plan review is on, and switch it off?"* | *"Launcher line + flags (Recommended)"* | *"Launcher adds the line; fkit coder --no-plan-review for the session; --no-plan-review per command. Launcher test needs your OK."* | §3.1 and §3.2 as written. ⚠️ **The launcher test is NOT OK'd**: the description says it *needs* his OK; that is not his OK of a named test (ADR-057 §D2 item 1). Still open — build 1's plan gate names it and asks |
| Q2 | *"Q2 — When the Codex reviewer declines in plan mode, what happens?"* | *"Expect + retry + flag (Recommended)"* | *"Tell it the notice is expected, retry once, else flag "Codex pass not run" at the top."* | §3.6 option A |
| Q3 | *"Q3 — What do you see during the ~17-min review in a session?"* | *"Progress lines (Recommended)"* | *"One live line per round and for Codex; full record at approval."* | §3.3, the owner's view |
| Q4 | *"Q4 — If you ask for changes at approval, is the revised plan re-reviewed?"* | *"Only if you ask (Recommended)"* | *"Revised plan carries a "not re-reviewed" banner."* | §3.3, owner feedback at the gate |
| Q5 | *"Q5 — Do sessions follow the sprint-loop rulings (ON/off report lines; flagged Claude-only pass without Codex)?"* | *"Yes, both (Recommended)"* | *"Same report lines; Codex-less sessions get a flagged Claude-only pass."* | §3.7 and §3.8 |
| Q6 | *"Q6 — For a plain /fkit-plan-task, where does the review record go?"* | *"plan-review.md only (Recommended)"* | *"Saved next to the brief on approval; plan.md stays unwritten, as today."* | §3.4, plain-path row |
| Q7 | *"Q7 — Follow-up for "plan mode doesn't block shell commands"?"* | *"Wording fix after probe (Recommended)"* | *"One Sprint 12 task, no behaviour change, after your probe confirms. Waits on nothing; nothing waits on it."* | §6 option A; build 3 in §7 |

### 10.2 Earlier rulings in scope (verbatim in the header block above; listed here for completeness)

- **~14:57 UTC** — `0542` plan gate *"Approve"*; *"Q1 — How should the plan-mode probe run?"* →
  *"Architect only (Recommended)"*; *"Q2 — Where do the build briefs go once the design is approved?"* →
  *"Sprint 12"* (description: *"This run could pick them up; wait on 0542 in Sprint 12. Risk: old prompt
  text loaded here."*).
- **~15:12 UTC** — *"Run your interactive plan-mode test before the design report?"* → *"Keep ruling,
  design now (Recommended)"* (description: *"Architect writes the design now; affected verdicts say
  "confirm by owner probe". Your test stays a check before any build."*); *"0542 check "nothing under
  claude/ changed" fails on 0541's uncommitted edits. How to handle?"* → *"Compare to current state
  (Recommended)"* (description: *"Check passes if claude/ is unchanged from now (0541's edits as
  baseline)."*).

### 10.3 Still open

1. **The launcher test's OK, by name** — at build 1's plan gate (Q1 note above).
2. **The Tier-2 probe (§8)** — not run. Gates every build (§7).
3. **Inline plans get no plan review** (§3.1) — stated in §9 Q1's *Context*; the relayed question and
   description do not show whether he saw that line. Confirm at build 1's plan gate.
4. **The labelled Tier-2 additions** (3-notice, 3n, 3m, 3m-bis, 5b, 5c, 5d) — not in the approved
   plan; the owner may skip them, and the conditions they cover would then stay unconfirmed (§8); §7's
   gate says what then.

Nothing else in §9 is unanswered.

---

## 11. Alternatives considered (brief)

- **Default inside `fkit-plan-task` with no signal ("run unless told not to").** Rejected. This is
  ADR-059's rejected option: a spawn that forgot the opt-out would run it.
- **An env var from the launcher as the signal.** Rejected. Env vars reach subagents' Bash, so they
  cannot tell a session from a spawn.
- **Approvers persist their own replies with `Write`.** Not feasible headless (C1/C6).
- **Driver-style respawns for disagreements in sessions.** Unnecessary. The owner is present, so he is
  asked directly (§3.3 step 4).
- **Approvers allowed to consult at hop 1.** Rejected for independence, parity with the trial and the
  wait (§3.5).

## 12. Testing strategy (for the builds)

- **Build 1:** a launcher test for `--no-plan-review`: it is consumed after `coder`; it is a usage error
  after other roles; it writes the on and off lines; it handles a pass-through `--append-system-prompt`.
  The owner OKs the test file by name (ADR-057 §D2.1). Run `npm test`.
- **Prompt text is not tested mechanically** (ADR-057; `0473`'s text-presence test is gone). The live
  check is a relaunched `fkit coder`, with one plan with review and one with `--no-plan-review`.
- **Build 2:** a live `/fkit-task-ship-loop` on a small task: `plan-review.md` is written at step 4,
  the line appears in the evidence packet, and the opt-out run matches today's.

## 13. Change surface of this report and what's left

- **Written:** this report, plus a short Step-B note in the task's `worklog.md`.
- **Scratch only:** the probe B1 files, under `/private/tmp/claude-501/-Users-mark-dolbyrev-Workspace-fkit/419e99ae-6e82-48b2-bd33-a10f5e221dd1/scratchpad/`.
- **Not touched:** `claude/`, `.claude/`, any ADR, the wiki. No commit.
- **Step C added:** §10 (owner answers), the final §7, the *Status* and *Step C* header bullets, and
  this bullet; [ADR-060](../decisions/adr-060-plan-review-on-by-default-in-coder-sessions-by-a-launcher-session-line-with-no-plan-review-opt-outs-provisional.md)
  (new); additions-only pointer notes on ADR-056 (one header bullet, one end ⛔ note) and ADR-059 (one
  header bullet, one end ⛔ note), proved against byte copies taken before the edits. `claude/`,
  `.claude/`, the worklog, briefs and the wiki untouched. No commit.
- **Process-review, round 1 changed:** §3.1, §3.2, §3.6, §4.1, §7, §8, §10.3, this section, and the
  header (new bullet), plus ADR-060 Decisions 2, 3, 9, 10, 12 and its passages list. Findings and
  responses: the task's `review.md`; decisions: its `worklog.md` decision log.
- **Wiki:** **fkit-wiki** should ingest this report and ADR-060, and re-ingest ADR-056 and ADR-059.
  The architect does not write the vault.
