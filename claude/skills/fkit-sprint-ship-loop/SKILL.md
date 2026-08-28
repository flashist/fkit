---
name: fkit-sprint-ship-loop
description: >-
  The lead's sprint-scope conductor loop — drives eligible tasks brief→closed by spawning role
  workers and relaying owner decisions live through this session. Since ADR-033 the driver closes
  nothing itself — it spawns a producer to close each shipped task, and that producer writes the
  agent-closed marker. Session-only; the driver holds the owner channel workers lack.
---

# Sprint Ship-Loop (lead side)

> ## ⛔ Owner: the **lead**
> This is the fkit-lead's own procedure. Execute it **only** if you are the lead — running in a
> `fkit lead` **session** with the owner reachable.
>
> **Any other role: do not execute this.** The ADR-018 skill-ownership hook denies it to every role but
> `lead`. It is also **session-only**: it drives by spawning workers and relaying owner decisions, and
> the owner channel (`AskUserQuestion`) exists **only** in a live session. A spawned/headless invocation
> cannot reach the owner — **refuse it**, and say why.

## Overview

`fkit-sprint-ship-loop` ships a **whole sprint's eligible tasks** from brief to closed. It is the
flagship application of the conductor remit ([ADR-031](../../../ai-agents/knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)),
specified by [ADR-032](../../../ai-agents/knowledge-base/decisions/adr-032-fkit-sprint-ship-loop-autonomy-and-consent-model.md)
and the owner-approved design report
[`2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md`](../../../ai-agents/knowledge-base/reports/2026-07-22-design-fkit-lead-orchestrator-and-sprint-ship-loop.md)
§5.

**It is a *driver*, not a doer.** For each task it spawns typed `fkit-<role>` workers for discrete,
bounded steps (coder to plan/build/verify, reviewer to review, coder to process the review), **holds the
owner channel itself**, and — since [ADR-033](../../../ai-agents/knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)
§4 — **routes each task's close to a spawned `@fkit-producer`** rather than closing it itself. The
**work** runs in fresh spawned contexts — so reviewer independence and the coder's sole-source-write
authority are preserved; the loop only *sequences* the separate contexts.

**Say the cost plainly** (ADR-033 §Consequences): that is **one more spawn and one more hop before each
task leaves the board.** The driver's autonomy is narrower than ADR-032 first specified.

**It models `fkit-task-ship-loop`'s *rigor* at sprint scope — it never *invokes* it.** The coder's task
loop is **session-only and refuses a spawned invocation** (`fkit-task-ship-loop/SKILL.md:8-18`); it also
could not reach the owner from a spawn (ADR-021). So this loop is a **new driver** that reuses the task
loop's shape (stateful review, verify budget, degraded-run conservatism), never its session-bound
machinery. `fkit-task-ship-loop` stays **byte-unchanged.**

**Argument:** `$ARGUMENTS` — a sprint plan path (e.g. `ai-agents/sprints/sprint-2.md`); **empty = the
active sprint, as `/fkit-status` resolves it** — see `fkit-status/SKILL.md`'s empty-argument rule.
**Do not re-derive that rule here** (ADR-041 §5: one grammar, one implementation). One operand — no
output-variant flags (`conventions/one-skill-one-output.md`).

---

## ⚠️ The plan-gate honesty clause — read before the loop, do not "fix" it away

On this orchestrated path, **"no code before the owner approves the plan" is prose-enforced in the worker
prompt, NOT a runtime write-wall.** Plan mode — the coder session's structural write-wall and ADR-019's
one unremovable checkpoint — **cannot run in a spawned worker** (no owner channel there, ADR-021). So the
driver enforces the ordering by **splitting** it:

1. spawn `@fkit-coder` **for the plan only** — prompt: *"produce a plan with `/fkit-plan-task`, write no
   source, return the plan and any open questions"*;
2. the driver presents the plan to the owner via **`AskUserQuestion`** → owner approves;
3. spawn `@fkit-coder` **to implement the approved plan**.

The "write nothing yet" in step 1 is a **prompt instruction, not a wall** — a confused or injected worker
could write before approval and nothing structural stops it. **This is stated plainly and accepted by the
owner (2026-07-22, ADR-031 honesty clause / ADR-032 Decision 7).** A later reader — human or coder —
**must not** rewrite this into a false structural guarantee. Owners who want plan mode's structural wall
for a given task ship it the old way: `fkit coder` + `/fkit-task-ship-loop`.

---

## Durable artifacts

`<task-folder>` = `ai-agents/tasks/<board>/<NNNN>-<slug>/` — the folder that holds `brief.md` (ADR-029).
All of these are **git-tracked and left in the working tree; the owner commits — never the loop.** They
**move with the folder** when the producer's `/fkit-task-done` relocates it.

| File | Written by | When, and what it holds |
|---|---|---|
| `<task-folder>/plan.md` | **the driver** | **at plan approval, before the Build spawn** — the approved plan, copied verbatim; the artifact every later carry points at |
| `<task-folder>/worklog.md` | the **Build** worker, grown by Process-review | worklog + decision log — every autonomously-applied fix and obvious-winner call, `none` if none (ADR-032 A2 / ADR-019) → what the close-out packet surfaces per task (*Progress reporting*, §5.5) |
| `<task-folder>/review.md` | the **spawned reviewer** (*Reviewer findings*) + the **Process-review** worker (*Coder response*) | the two-party ledger — separate ownership, never merged into the worklog. ⚠️ **The Review row passes no task-id, so the key falls to rule 2 — the task folder name, in scope here via this folder's `plan.md`/`worklog.md`; rule 3's branch-name ledger is only the *neither-resolves* case.** Still pass the task-id: mid-run, several tasks' uncommitted artifacts can leave rule 2 ambiguous (→ rule 4), and rule 1 settles it. |

Task **statuses** are deliberately **not** in this table: they live in the brief's `## Status` and the
sprint row, and are governed by §2 (mark `🔄 In progress`) and §4 (close posture), not by an artifact
write.

---

## The loop, numbered

### 1. Select & order the sprint's tasks (§5.1)
- Read the sprint plan (`$ARGUMENTS`, or the active sprint as `/fkit-status` resolves it) and the
  briefs it links.
- Get the board **via the deterministic reader** — never hand-derive status:
  ```
  bash claude/skills/fkit-status/dashboard.sh <plan>
  ```
- **Eligible** = tasks that are `🔲 Backlog` **and** whose every `Depends on` link is `✅ Done`. Skip
  `🔄 In progress` (someone else owns it), `🚧 Blocked`, `✅ Done`, `⛔ Cancelled`, `➡️ Moved`.
- **Order** by `## Priority`, then by dependency topology (a task never runs before a task it depends on).
- **Per-run skip memory.** Keep an in-session set of tasks **attempted or plan-rejected this run** and
  **exclude** them from the eligible set — so re-derivation (step 5) never re-selects a task the owner just
  rejected or one you already drove. This memory is **this-run only**; a later invocation reconsiders them.
- **Dependency deadlock** — backlog remains but nothing is eligible (every remaining task waits on
  something unfinished) → **stop and report the blocking chain** to the owner. Do not guess an order.

### 2. Drive each eligible task, in order (§5.2)
Run the **bounded-worker + driver-owns-owner-channel** pattern per task. Each worker is a **typed
`fkit-<role>` subagent** (a generic `general-purpose`/`Explore` helper is denied every `fkit-*` skill by
the ADR-018 hook — never use one for a step that runs an fkit procedure).

**Mark the task `🔄 In progress` first.** At the start of driving a task, set `🔄 In progress` in **both**
the brief `## Status` and the sprint row (via a spawned worker or directly) — so `/fkit-status` and any
concurrent driver see it is owned (step 1 skips `🔄 In progress`). Every later exit overwrites this with
the accurate exit status — a terminal one (`✅ Done` / `🚧 Blocked`), **or reset to `🔲 Backlog` if the
owner rejects the plan** (§5.4), so a rejected task is never stranded `🔄 In progress`.

| Step | Driver spawns | Worker does (bounded, then returns) | Owner gate (driver-held) |
|---|---|---|---|
| **Plan** | `@fkit-coder` | run `/fkit-plan-task`; **write no source**; return the plan + open questions | **⛔ present plan → `AskUserQuestion` approve/reject** — the unremovable checkpoint (prose-enforced here, see honesty clause); **on approval the DRIVER writes the approved text to `<task-folder>/plan.md` verbatim — copied, not re-rendered — BEFORE spawning Build** (ADR-020; mirrors `fkit-task-ship-loop` step 4) |
| **Build** | `@fkit-coder` | implement the **approved** plan; write source + `worklog.md` (**`plan.md` already exists — the driver wrote it at approval; never re-author it**); return change surface + any decision surfaced | stop only if the worker returns `NEEDS-DECISION` |
| **Verify** | `@fkit-coder` | run tests per [ADR-014](../../../ai-agents/knowledge-base/decisions/adr-014-how-fkit-tests-itself.md) (`node --test`, zero devDeps); return pass/fail + diagnosis | **budget: 3 no-progress cycles** → `🚧 Blocked — verification` |
| **Review** | `@fkit-reviewer` → `/fkit-stateful-review` | own pass + Codex second opinion; write the *Reviewer findings* ledger section; return the verdict | — |
| **Process review** | `@fkit-coder` — **always, whoever authored the deliverable under review** ([ADR-038](../../../ai-agents/knowledge-base/decisions/adr-038-a-loop-steps-role-is-fixed-by-the-skill-the-step-runs.md)): a loop step's role is fixed by **the skill the step runs**, and this one writes the ledger's **coder-owned *Coder response*** section and **applies code fixes at its Step 6** (`fkit-process-stateful-review/SKILL.md:195`). Neither changes when the deliverable is a document rather than code. | apply `fkit-process-stateful-review` **method** — **all of its steps, none of its per-round owner gate** (this loop's single up-front approval replaces that gate; ADR-019 / ADR-032, and the skill itself stays byte-unchanged). ⚠️ **A subset is not the method:** on `0195` a hand-application **missed Step 0 entirely, ran Steps 2 and 3.5 only partially, inherited the reviewer's severity labels instead of deriving them (Step 3), and used none of Step 4's prescribed Status values** — and looked complete to the worker doing it. Run **every** step: **0** — open or create `<task-folder>/review.md`, load *Accepted residuals* **and skim `ai-agents/knowledge-base/decisions/` for ADRs in scope** (an ADR's *"Re-raise only if"* binds exactly like a residual); **1** — identify the **novel** findings (those with no *Coder response* row yet); **2** — loop-check each against those residuals **and** ADRs, and say **loudly** when an unmet *"Re-raise only if"* makes one `closeout`; **3** — verify each against the actual code at `file:line`, reading **enough surrounding context to understand the full flow, not just the cited line**, and **deriving severity yourself from the blast radius you traced, never inheriting the reviewer's label**; **3.5** — classify **defect vs frontier-move**, and run the **regression / oscillation check** against the prior rounds already in the file — a round budget is a proxy, not the rule, so **a genuine new defect in round 3+ MUST still be acted on: stop on the *nature* of the finding, not the count**; **4** — assign **CORRECT / PARTIALLY CORRECT / INCORRECT / INCOMPLETE** and write **one *Coder response* row per finding id** (verdict, defect/frontier, action, status). The Status cell takes **one of exactly these six prescribed values** (`fkit-process-stateful-review/SKILL.md:85`) and never an ad-hoc label — `pending approval` ⛔ *(the one value this loop never uses: the standing approval above has already replaced the per-round gate that produces it)* · `✅ done` · `won't fix (frontier)` · `disproven` · `closeout (re-litigation)` · `blocked` — so **five of the six apply here**. Map them: **INCORRECT** → `disproven` with Action `none`; a **frontier-move you recommend keeping** → `won't fix (frontier)`; a **Step-2 re-litigation** → `closeout (re-litigation)`, **naming the residual or ADR that settles it**, and **do not re-fix it**; **5** — report the summary table, the **suppressed-as-settled** list, and the **convergence call**; **6** — apply the **minimal, idiomatic fix** for each (smallest correct change; match surrounding style; no unrelated refactors), **add/update tests and run the relevant tests / linter / build — or say plainly you could not**; then set each row's Action to what you actually did, and its Status **by outcome, not uniformly**: `✅ done` for a fix you applied, `blocked` **plus the reason** for one you could not complete, and `won't fix (frontier)` for a confirmed intended tradeoff — which also earns an ***Accepted residuals*** entry in full **What / Why (structural) / Re-raise only if** shape. **Leave the `disproven` and `closeout (re-litigation)` rows exactly as Step 4 set them** — this step revisits only the rows you acted on. Set the document header **Status: closed-out** once every novel finding is closeout / disproven / accepted and nothing blocking remains; **7** — final report: findings dispositioned this round, code changed (files, how tested, result), the *Coder response* rows written, any newly-recorded residual, the document's new Status, and anything flagged — noting that the method itself makes no commit, and **asserting no commit state you did not check this turn**. **Never edit the *Reviewer findings* section** — the sole exception is the skill's own seeding path (`fkit-process-stateful-review/SKILL.md:103-104`, `:119-120`): creating the ledger, or appending findings handed to you as pasted text, each noted as done on the reviewer's behalf. In this loop the **Review** step has already written that section, so in practice you never touch it. Then: **apply verified-`CORRECT`, in-approved-plan fixes autonomously (task-loop discipline, ADR-019)** — **under that standing approval an authorized fix lands at Status `✅ done` in the same round**; **record each autonomously-applied fix and each obvious-winner call in the task folder's `worklog.md` decision log — per entry: which finding it answers, what changed, and why it qualified; record `none` if none** (ADR-032 A2 / ADR-019 `:96`); return change surface + residuals, and **return `NEEDS-DECISION` for any judgment call** | **⛔ stop for judgment calls** — frontier-move, regression, disputed severity, broad/behavior-changing, or out-of-plan fix |
| **Close** | `@fkit-producer` | run `/fkit-task-done` on the brief; write `✅ Done (agent-closed — not owner-verified)` in the brief and every board row (ADR-033 §5 — a **spawned** producer has no owner channel, so its close is never owner-verified); return the step-7 close-out report | **the driver confirms the close landed** against that report (§4) before counting the task shipped; **stop for the owner on a degraded run** |

**Why the driver writes `plan.md`, and what that does and does not fix.** The approved plan exists only
in **this session's** `AskUserQuestion` exchange, so the driver is the only actor holding the approved
bytes at the moment of approval. It writes `<task-folder>/plan.md` itself, in the same turn as the
approval and **before** the Build spawn — **copying the approved text, never re-rendering or summarising
it.** This is not a breach of *"the driver delegates, never substitutes"*: that rule forbids the driver
**writing source** and **reviewing** (ADR-031 Decision 2), and the driver already writes the
`🔄 In progress` and `🚧 Blocked` statuses itself (§2, §4). Delegating this copy would put a **context
boundary** in the middle of it — the exact operation that failed.

- ⛔ **What it closes:** the **reconstruction route** — no worker is ever asked to reconstruct the plan,
  which is how `0162/plan.md` came to be a re-rendering of a plan approved hours earlier (blob
  `2458a57e`).
- ⛔ **What it does NOT close:** the **`carried-not-approved` class.** A hash pins *which bytes were
  carried*, not *which were approved*; a driver that persists a plan the owner never approved and carries
  it faithfully still verifies green over bytes the owner never saw. **Structural** — approval leaves no
  artifact (ADR-021) — and an **accepted residual** in `0162`'s review ledger. The driver doing the copy
  **narrows** the transcription hazard (one copy, no spawn boundary); it does not remove it, it relocates
  it to this session.

⚠️ **Do not delete this write as redundant.** A path + `git hash-object` pointer needs a file to point
at, and a `PreToolUse` carry-check needs one at spawn time.

**Rules that make this honor the ADRs:**
- **The Build AND Process-review spawn prompts MUST each carry the approved plan verbatim, state the owner
  approved it via `AskUserQuestion`, and identify the caller as `fkit-sprint-ship-loop`.** These three
  signals are the **declared-approval marker** that `fkit-coder.md`'s sprint-loop carve-out keys on for
  **both** worker roles; without them a spawned coder **refuses to write source** and returns the plan. It
  is **trust, not proof** — a prose
  mirror of the plan-step's "write nothing yet", carrying the same accepted prose-enforced cost (ADR-031
  honesty clause / ADR-032 D3/D7), not a verifiable token.

  **How to carry it — the construction, not an exhortation** (ADR-032 D3; `0162`'s decision report
  §2/§4, owner-ruled 2026-08-02). **A faithful carry is a copy over a durable artifact, executed in the
  spawning turn — never recall over conversation state.** The requirement above shipped without one, and
  per `0162` it then fired zero times in the run that installed it: once by pointing at conversation
  state, once by pasting with silent truncations under an explicit *"everything else is byte-for-byte"*
  claim. **A language model restating a long text from its own context cannot be relied on to reproduce
  it byte-for-byte, nor to detect its own failure to do so** — so run these six steps, in order, in the
  turn you spawn.

  1. **Read `<task-folder>/plan.md` byte-exactly — `Bash(cat <path>)`, NOT the `Read` tool.** Two
     reasons, both fatal. `Read` returns **`cat -n` framing** — a line number and a tab prepended to
     **every** line — so the bytes you hold are not the file's bytes and their `git hash-object` can
     never equal its blob hash; and `Read` **caps at 2000 lines by default**, silently truncating a long
     plan *before* you have formed any judgment about it. Stripping the framing by hand re-introduces the
     exact transformation this construction exists to remove.
     ⚠️ **`Bash` is not exempt from truncation — it caps oversized output too, and says so when it
     does.** A large plan can be cut by the **tool** rather than by the file, which is why step 2 leads
     with that notice. No byte figure is pinned here on purpose: the cap is a harness
     constant that moves, and a stale number in this text would be worse than none.
  2. **Check the read was whole — before pasting anything.** ⚠️ **The tell is the truncation notice,
     not an arithmetic comparison.** `Bash` announces when it caps output, so **if it said it truncated,
     the read failed — stop there and take step 5.** Do not go hunting for a second number to check that
     against: the byte count of what `cat` actually handed you is **not exposed to you**, so *"compare
     the two figures"* is not an operation you can perform, and a step demanding it would be theatre. Run
     `wc -c <path>` in the same turn regardless — it is the **corroborating** figure that the pointer and
     step 5 both want, and it tells a later reader how large the plan was. What it is **not** is the
     guard: it measures the **file**, which reads identically whether or not your read stopped short. A
     read that stopped short is a **failed** carry, not a carry to patch up: take step 5's degraded form
     and say so.
  3. **Paste those bytes into the spawn prompt, unaltered.**
  4. **Cite a pointer beside the paste** — the path plus `git hash-object <path>` (it works on untracked
     files, which is what these are). One line, in this form:
     ```
     plan: ai-agents/tasks/<board>/<task>/plan.md  blob c0ffee… (git hash-object)
     ```
     **Paste AND pointer — both, never either/or** (owner ruling, 2026-08-02, `0162` OQ-1; pure
     by-reference was rejected) — **except step 5's declared degraded form**, which is the only either/or
     this construction licenses. The paste is what the worker acts on and is what satisfies condition (b)
     of the marker as written; the pointer is what makes the paste checkable at all. **A paste alone is
     unfalsifiable — which is exactly why the truncate-and-certify round went undetected.**
  5. **If — and only if — you cannot carry the plan whole, carry by reference only, and say so in the
     spawn prompt in those words.** Pointer alone, degradation declared, and state the `wc -c` byte count
     and why it could not be carried. **Truncation is never permissible** — not with a declaration, not
     with an ellipsis, not "omitting rationale only": **never a partial paste, and never a completeness
     claim over bytes that were cut.** A truncation that announces itself is a defect a reader can act
     on; one that certifies itself is a claim the reader cannot check. A pointer-only spawn **fails
     condition (b) as written**, so the spawned coder **must refuse it** — the refusal is mandatory, not
     discretionary (`fkit-coder.md` gates the write on **all** of (a)(b)(c); this file's own rule above
     says a spawned coder **refuses to write source**). That is the correct outcome, and it is why this
     is the exception and not the routine.
  6. **Before you send: look at the prompt and confirm both legs are actually in it — then state the
     result.** Pasted bytes present **and** path + hash pointer present. In the degraded form: pointer
     present **and** the degradation declared. **A driver may not describe a carry as two-legged on the
     strength of intending it** — on 2026-08-03, on `0202`'s own run, a driver announced a plan carried
     *"BOTH ways — paste and pointer"* and shipped the pointer only. That is the same shape as the false
     certification this construction exists to prevent, and **the pointer is what made it detectable**.

  **Two words this construction governs. They bind the same way:**
  > **"Verbatim" is a word a driver may apply only to bytes it read from a file that turn.**
  >
  > **"Both ways" is a phrase a driver may use only after looking at what it wrote.**

  True by construction, or forbidden.

  **The honest bound on "true by construction" — do not rewrite this into a guarantee.** `cat` puts the
  file's bytes in your context *this turn*, which is strictly better than recall of a message written
  hours earlier, and that is the whole of the gain. It does **not** make the paste a mechanical copy: you
  still emit those bytes token by token. Step 4's pointer is what would let anyone notice a divergence.
  **This construction
  narrows the hazard; it does not remove it** (ADR-031 honesty clause; `0162` §9).

- **The plan/build split (honesty clause) is mandatory** — it is the only thing standing in for plan
  mode's write-wall on this path.
- **The Process-review worker applies fixes on ADR-019's discipline under the declared-approval marker,
  bounded by the approved plan** — verified-`CORRECT`, mechanical/localized, in-plan fixes proceed without
  per-fix owner approval (a second exception to the per-round gate, `fkit-coder.md`); every judgment call
  returns `NEEDS-DECISION`. **The driver re-verifies after any fix the worker writes.**
- **Re-verify after any post-review code change** before handing the close off (mirror
  `fkit-task-ship-loop/SKILL.md`).
- **The close is a spawned producer's, never the driver's** — the movers are **producer-only** (ADR-033
  §1) and the ADR-018 hook **denies** a mover call from the `lead` identity at any spawn depth, so the
  driver must not invoke one. The owner-relay stays coherent because the driver keeps **holding the
  channel**, not because it does the closing.

### 3. Relay every decision live — the load-bearing gate (§5.3, §6.2)
A spawned worker **never asks the owner** — it **returns** its final message as **exactly one** of:

```
DONE           { result, changeSurface?, evidence? }              → driver advances
NEEDS-DECISION { question, options[], recommendation, context }   → driver relays via AskUserQuestion
BLOCKED        { reason, whatFails }                              → driver records status, skips/stops
```

This envelope is **prose in the worker's spawn prompt**, not a runtime schema — ADR-021 gives workers no
structured owner channel and there is no cross-context type system; the driver parses the worker's final
message. On `NEEDS-DECISION` the driver:

1. calls **`AskUserQuestion`** with the returned options (recommendation pre-marked), and
2. **blocks on a real owner answer** — **no timer, no guess** — then
3. spawns the next worker with the decision folded into its prompt.

**This is the opposite of the declined ADR-024 auto-proceed.** It does not remove the owner via a
silence-timeout; it **keeps** the owner and merely **consolidates the channel** into this one session.
ADR-024 is **not** reopened.

**Idle behavior:** between relays the driver **ends its turn and idles** — ordinary in-session
turn-taking. The owner returns to the terminal to answer. (When [ADR-030](../../../ai-agents/knowledge-base/decisions/adr-030-stop-hook-enforces-turn-completion-contract.md)'s
`Stop` hook ships, `fkit-sprint-ship-loop` joins `/fkit-task-ship-loop` in its skip set so these
mechanical idle turns are not forced to carry a "What's next?" footer; relay turns use `AskUserQuestion`
and satisfy the hook regardless — task 0116.)

### 4. Close posture (§5.2 Close row, ADR-032 D5/D6 **as amended by ADR-033 §4/§5**, ADR-025)
- **The driver invokes no mover.** It spawns `@fkit-producer` per shipped task; **that producer** runs
  `/fkit-task-done`. Producer-only is hook-structural (ADR-033 §1 / ADR-018), not a request.
- **Agent-closed marker by default.** Live-relay checks *decisions*, not *done-ness* — so a loop close
  carries `✅ Done (agent-closed — not owner-verified)`, written by the **spawned producer**, **unless the
  loop explicitly stopped and the owner verified.** The marker states exactly what was and was not
  checked; it is applied honestly. Note the limit ADR-033 names: routing through a producer separates the
  closing *identity*, it does **not** make the close a second judgment.
- **Confirm the close landed before counting the task shipped.** The producer's step-7 close-out report
  enumerates **every** doc it touched — board rows, the brief's own `## Status`, any parent-epic slice,
  `backlog.md`, in-body `**Status:**` lines, and every re-pointed href including under `sprints/done/`,
  `sprints/reviews/` and the knowledge-base. **Read that report** and cross-check it against the state
  you can see (folder now under `done/`; brief `## Status` and sprint row read Done **with** the marker).
  A three-location spot-check cannot see a partial close — **never report a close you did not verify**,
  and a sprint roll-up must not carry an unverified one across several tasks.
- **If a close half-landed, first work out WHICH half — the two cases have different remedies, and only
  one of them an agent can perform.**
  - **The folder never moved** (the producer failed before relocating it): **re-spawn `@fkit-producer`
    once**, naming exactly what is missing. The mover runs normally from a `backlog/` folder, so this is
    performable. If the re-spawn also fails, nothing was closed and no `✅ Done` exists — so the ordinary
    rule applies: write `🚧 Blocked — hand-off incomplete: <what disagrees>` in **both** locations.
  - **The folder moved but a status or href is stale:** **no agent can repair this — it is the owner's.**
    `/fkit-task-done` **stops** on a folder already under `ai-agents/tasks/done/`, and its one exception —
    the owner-verification upgrade — is **owner-only** (`fkit-task-done/SKILL.md:78-82`); `✅ Done` is
    skill-gated and must **never** be hand-edited (`fkit-task-done/SKILL.md:283-286`). So do **not**
    re-spawn the producer for this case and do **not** hand-patch anything: write
    `🚧 Blocked — hand-off incomplete: <what disagrees>` **on the location that is still stale**, leave any
    `✅ Done` the producer legitimately wrote **untouched** (only the owner may change a landed Done),
    **report it to the owner**, and **do not count the task as shipped** in the roll-up.
  - Either way the driver writes **only** its own `🚧 Blocked` marker, and **never** a `✅ Done` — statuses
    on a closing task belong to the producer, and a landed close belongs to the owner.
- **Degraded run → do NOT route the close.** No Codex pass after retries, red verification, or an
  unresolved residual ⇒ finish the report and **put the close to the owner.** Pushing work you already
  know is weak through a producer spawn is the exact failure this posture must not commit — the extra hop
  is not a second judgment (ADR-033 §The limit).
- **Never self-cancel.** If a task should be **cancelled** rather than done, **stop and ask the owner** —
  `cancelled/` is audited by nobody (ADR-025 §Consequences). A cancel always stops, and is never routed
  to a producer either.

### 5. Advance
After a task closes (or is skipped/blocked), return to step 1's eligible set — re-derive it (a just-closed
task may unblock a dependent), **minus the per-run skip set** (attempted / plan-rejected this run, §1) so a
just-rejected task is not re-selected — and drive the next task, until the eligible set is empty.

---

## Stop conditions — the driver's exit table (§5.4)

| Terminal state | Trigger | Driver does |
|---|---|---|
| **Sprint shipped** | **every eligible task CLOSED** (none deferred/rejected this run), last verify green | report the sprint roll-up + each task's close + marker |
| **Sprint drained — deferred remain** | eligible set empty, but one or more tasks were **plan-rejected / deferred this run** (in the skip set) and remain `🔲 Backlog` (**not** blocked by unfinished deps) | report the roll-up listing shipped tasks **and the deferred ones as `pending` — re-run to reconsider**; this is **NOT** a full-sprint ship (honesty thesis, ADR-031), and NOT a dependency deadlock |
| **Plan rejected** | owner rejects a task's plan | **reset the task `🔄 In progress` → `🔲 Backlog`** in **both** the brief and the sprint row (it was marked In progress at step 2), add it to the per-run skip set (§1), then move to the next eligible task, or stop if none |
| **Blocked — verification** | a task's no-progress budget (3 cycles) hit | `🚧 Blocked — verification: <what fails>`; skip to next eligible; report |
| **Blocked — review non-convergence** | review oscillation on a task | `🚧 Blocked — review not converging`; skip/stop; report |
| **Owner decision pending** | any judgment call / degraded close / cancel question | **pause**, relay via `AskUserQuestion`, resume on the answer |
| **Dependency deadlock** | eligible set empty, backlog remains | stop; report the blocking chain |
| **Worker spawn didn't land** | a task's **Plan, Build, Verify, Review or Process-review** spawn failed, was denied, or returned nothing — **not** the producer spawn, which is the row below — **and the driver is not continuing this task in this run**: if **every** path the spawn instruction named was discharged, the drive continues and **this row does not fire** | **Read disk before deciding, and read the paths the spawn instruction named** — wherever they live, never the task folder as a proxy, and never `git status` for an untracked path (it reads `??` before the write and after it): compare **content**. Then: **nothing landed** → reset `🔄 In progress` → `🔲 Backlog` in **both** locations, add it to the per-run skip set (§1), **and put the choice to the owner** — do not decide alone; the reset parks the task accurately, but **how many re-spawns are allowed is unruled and the driver must not settle it**; **something landed and everything that landed stands on its own with the missing paths never arriving — nothing is half-written, and nothing on disk depends on a path that is missing** → `🚧 Blocked — <step> spawn didn't land: <what landed, what is outstanding>` in **both** locations; **something landed but a file is half-written, or the unit is torn across paths** → **stop and put it to the owner** (`Owner decision pending`) — no agent may guess whether torn state is safe to build on; **the task stays `🔄 In progress` while the owner is asked — a pause is not an exit, so no terminal status is written**. **`plan.md` is left in place — see the note below the invariant.** **On the first two branches:** **report** it — do not pause the sprint; **do not count the task shipped**; next eligible task. **On the third the sprint pauses** until the owner answers. Branch 1 both asks and moves on: `🔲 Backlog` is an accurate **terminal** status for it, so the task is safely parked and the drive can exit with the question outstanding — §1's skip memory is **this-run only**, so the answer lands on a later run. Branch 3 has no **terminal** status to write — a pause is not an exit — so it waits |
| **Blocked — hand-off didn't land** | a task's producer spawn failed, was denied, or left the close partial (§4) — **close-step only; its single re-spawn is not a general worker-retry rule** | **folder never moved** → re-spawn `@fkit-producer` once, then if still unresolved `🚧 Blocked — hand-off incomplete: <what disagrees>` in **both** locations; **folder moved, a status/href stale** → owner-only, do not re-spawn, mark **only the stale location** (never over a landed `✅ Done`). Either way: **report** it — do not pause the sprint; **do not count the task shipped**; next eligible task |
| **No Codex, degraded** | Codex absent after retries on a task | proceed-and-flag that task **loudly**; **do not route its close** — put its close to the owner |

**Invariant — no path ends in silence.** Every exit writes accurate status in **both** the brief's
`## Status` **and** the sprint row, and ends in an owner-visible report.

> **The one carve-out: a half-landed close** (§4). When the producer moved the folder but left a status or
> href stale, a landed `✅ Done` is **the owner's** — the driver marks only the **stale** location
> `🚧 Blocked — hand-off incomplete`, leaves the `✅ Done` alone, and reports. That is the single sanctioned
> case where the two locations are knowingly left disagreeing, because no agent can lawfully reconcile them
> (`fkit-task-done/SKILL.md:78-82`, `:283-286`). It is **reported**, never silent.

> **The orphaned `plan.md`.** `<task-folder>/plan.md` is written **at plan approval, before the Build
> spawn** (§*Durable artifacts*), so **every** exit past the plan gate — `Worker spawn didn't land`, both
> `Blocked` rows above, `Blocked — hand-off didn't land`, and `No Codex, degraded` — leaves an approved-plan
> artifact on disk for a task nobody is driving. **Leave it in place: never delete it, never re-author it.**
> It is the approved bytes, and re-rendering them is the hazard writing it early exists to remove. **A later
> run that finds a `plan.md` it did not itself approve this run must not read it as a live approval** —
> re-present it at the plan gate and re-approve before spawning Build. The mirror case is the same rule from
> the other side: a task **past** the plan gate with **no** `plan.md` → return to the plan gate pre-Build;
> **past Build, treat the run as degraded and put the close to the owner.**

## Progress reporting (§5.5)
- **Per task:** surface the coder worker's close-out evidence packet from its `worklog.md` (change
  surface, verification evidence, review verdict + the **coverage state** (one of ADR-042's three —
  `reasoning-only second opinion` is normal and not a degradation), residuals).
- **Sprint level:** a roll-up — tasks **shipped / blocked / pending**, each close's marker (agent-closed
  vs owner-verified), and the coverage state per task. Loudly flag any task shipped **`Codex
  unavailable`** — that is the one state without a model-diverse review. ⚠️ A **reasoning-only second
  opinion** IS model-diverse (a different model reasoned over the diff); it is reported, not flagged.

---

## Hard rules
- **Session-only.** Refuse a spawned/headless invocation — you cannot reach the owner from a spawn.
- **Never invoke `fkit-task-ship-loop`** — it refuses a spawned invocation and is session-only; reuse its
  *shape* only. It stays byte-unchanged.
- **The driver delegates, never substitutes.** Spawn typed `fkit-<role>` workers for all real work; the
  driver **never writes source and never reviews.** A driver that reviews or designs "just this once"
  breaks the separation-of-authority thesis (ADR-031 Decision 2).
- **Spawn typed `fkit-<role>` subagents only** — never a generic helper for a step that runs an fkit skill.
- **The plan/build split is mandatory** and its gate is **prose-enforced, not structural** (honesty
  clause) — do not present it as plan mode's write-wall.
- **Never instruct into the territory of a rule in the skill a worker will run without naming the owner
  ruling you relay** (ADR-037 §3 — the driver-side half of the owner's Q2 ruling; this ADR binds the
  driver, not only the worker). Exactly one of three is permitted:
  - **Name the ruling** — what the owner ruled, when, on what point — and the instruction binds.
  - **Get the ruling first.** You hold the owner channel the worker lacks (ADR-021); if the point
    matters, ask before spawning.
  - **Do not issue it.** Let the skill rule stand.

  **A bare directive into a rule's territory is a defective instruction, and the worker's conservative
  branch is the correct response to it, not an obstruction** — do not read a worker's escalation here as
  a failure to follow orders. **This clause is weaker than its worker-side twin** and ADR-037 §3 records
  that deliberately: the worker-side clause reaches every spawn through the universal rules block, while
  this one binds you only because *you* load this file, and it reaches no worker.
- **The driver invokes no mover — it spawns `@fkit-producer` to close each task**, and that producer
  writes the agent-closed marker by default (ADR-033 §1/§4/§5). The driver confirms the close landed;
  degraded runs stop; **never self-cancel** (ADR-032/ADR-025).
- **Re-verify after any post-review code change** before handing a task's close off.
- **Do not commit or push** — leave every edit in the working tree; the owner commits.
- **Never write `ai-agents/wiki-vault/`** — ever.

## Usage
```
fkit lead
/fkit-sprint-ship-loop ai-agents/sprints/sprint-2.md
```
