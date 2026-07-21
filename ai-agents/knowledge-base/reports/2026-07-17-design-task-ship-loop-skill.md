# Design — the coder's autonomous ship-loop (`fkit-task-ship-loop`)

**Date:** 2026-07-17 · **Author:** fkit-architect · **Task:**
[`design-task-ship-loop-skill.md`](../../tasks/done/0031-design-task-ship-loop-skill/brief.md) (Sprint 2,
priority 52) · **Blocks:** task 53 (implementation) — hard.

**Status: ✅ OWNER-APPROVED (rev 3, 2026-07-17).** The numbered loop in §11 and every decision in §5 /
§9 were ruled by the owner in a one-at-a-time design interview on 2026-07-17. Two ADRs record the
settled decisions this design rests on — **ADR-019** (the autonomous ship-loop contract & consent
model) and **ADR-020** (the per-task `plans/` + `worklogs/` artifacts). Task 53 implements exactly this
spec.

> **Revision history.** Rev 1 → rev 2: a Codex adversarial pass (model diversity intact) killed rev
> 1's headline — narrowing `fkit-process-stateful-review`'s gate via a cross-skill note was
> unenforceable (no runtime "loop-context" signal; `CORRECT` ≠ mechanical). Rev 2 → rev 3: the owner
> reframed autonomy from a *per-run spoken grant* to the **loop's built-in default** ("I want to run
> the loop, walk away, and trust the coder to decide — only important questions asked of me"), which
> both **resolves** the Codex objection (autonomy self-contained in the loop skill, not bolted onto a
> shared gate) and **amends the coder's foundational "owner present" contract** (→ ADR-019). Full
> findings ledger and owner rulings: §15.

---

## 1. Goal & context

**The owner's ask (2026-07-17):** a coder skill that takes a task from brief to *done* with **minimal
owner involvement**. Refined during the interview to a concrete operating model: **the owner starts the
loop, approves the plan, walks away, and the coder ships the task autonomously — pausing only for
"important questions" and returning to the owner at the done-gate.** *"Only important questions can and
should be asked from me."*

**Success criteria** (task verification steps): the loop step by step (§11); every deviation from the
sketch with a reason (§10); explicit rulings on the five conflicts (§5); the owner-contact contract
(§6); durability across a long autonomous run (§4.1, §7); failure/exit with no silent stall (§8); skill
mechanics (§9); ending in a numbered, owner-approved loop (§11).

This is a **design task**: nothing is implemented here. Task 53 builds the approved design.

---

## 2. Grounding — what the loop is built on

- **The coder is a session, owner present — the loop redefines *when*, not *whether*, the owner is
  reachable.** `fkit-coder.md:28-33` bars *background delegation* because the gates need the owner. The
  loop keeps the owner reachable **in the session** — "walk away" means the owner answers a pending
  question *when they return to the terminal*, which is ordinary session turn-taking (the loop ends its
  turn and idles; no hang, no new tooling, no task-39 dependency). What the loop changes is the
  **default**: between gates it proceeds without waiting. That is a real amendment to the "owner
  present for the fix gate" contract → **ADR-019**.
- **The plan gate is load-bearing and stays.** `fkit-plan-task/SKILL.md:29-37` — `EnterPlanMode` /
  `ExitPlanMode`, a runtime-enforced wall (task 17). It is the **one guaranteed upfront stop**.
- **The review handshake exists and is loop-resistant.** Coder asks `@fkit-reviewer` →
  `fkit-stateful-review` writes *Reviewer findings* of `ai-agents/reviews/<task-id>.md`
  (`fkit-stateful-review/SKILL.md:1-3`); the coder verifies/classifies with the *method* of
  `fkit-process-stateful-review` (verify each finding, defect-vs-frontier, loop-check against residuals
  + ADRs, `:114-124`). **Enforced by ADR-018's `PreToolUse` hook** at any spawn depth
  (`adr-018:72-84`), so the coder→reviewer spawn works today.
- **Done is owner-gated, anti-laundering.** Task files move to `done/` **only** via owner-invoked
  `/fkit-task-done` (`fkit-task-done/SKILL.md:183-189`; `CLAUDE.md`).
- **Codex is the review's whole point.** No-Codex = explicitly partial / not model-diverse, flagged
  loudly, never "complete" (`fkit-review/SKILL.md` degradation contract; architecture.md §7).
- **Status vocabulary** (`conventions/task-status-vocabulary.md`): `🔄 In progress` — anyone, freely;
  `🚧 Blocked — <reason>` — reason mandatory; **`✅ Done`/`Cancelled` — owner-gated**.
- **Consult envelope** (ADR-010): session = hop 0; each consult states "hop N of 2"; hop 2 terminal;
  no cycles; a new architecture decision **escalates to the owner**.
- **One skill, one output** (`conventions/one-skill-one-output.md`): the argument is the brief-path
  **operand**, never an output variant.

---

## 3. Constraints & scope

**Hard constraints:** the loop never moves a task file and never tells another agent to; never sets
`✅ Done`; never commits/pushes; never writes `ai-agents/wiki-vault/`; keeps the up-front plan gate;
every terminal state it reaches emits a report; no silent stall.

**In scope:** the loop; the autonomy/consent model; the owner-contact contract; the two per-task
artifacts; durability; failure/exit; skill mechanics.

**Out of scope:** implementation (task 53); `AskUserQuestion` (task 39 — not a dependency, see D3); the
`task-plan → task-brief` rename (task 50); any wiki sync (post-53); the future per-task-folder layout
(recorded in ADR-020 as direction, not built here).

---

## 4. Proposed design — the phased loop

The loop is a **multi-turn, autonomous session procedure**. The owner approves the plan, then leaves;
the loop runs as long autonomous stretches, **ending its turn only to wait for the owner at an
"important question" or a gate.** The owner returns to either a pending question or the done-gate.
Because a SKILL.md playbook holds no durable memory across turns/compaction, the loop **externalizes
its state** to per-task files and **re-derives its position on every resume** (§4.1).

```
  fkit coder session  ── /fkit-task-ship-loop <brief-path> ──►

  P0 GROUND    read brief · resolve task-id · /fkit-query + architecture.md + ADRs   [autonomous]
        │
  P1 PLAN      consult architect/producer if brief is ambiguous (hop 1)
               /fkit-plan-task → EnterPlanMode → plan → ExitPlanMode
               write the plan to ai-agents/plans/<task-id>.md
               ╠═► ⛔ OWNER GATE: approve the plan (+ answer open Qs).                  [STOP]
               ║   Rejection ⇒ task stays 🔲 Backlog, report, STOP.
        │  approved  ─── owner walks away here ───
        │   set 🔄 In progress  (brief ## Status AND sprint row — together, §4.1)
        │   open ai-agents/worklogs/<task-id>.md (worklog + owner-decision log)
  P2 BUILD     implement the approved plan · minimal idiomatic diffs                  [autonomous]
        │
  P3 VERIFY ◄─┐ test (project conventions / ADR-014) · sub-agents where they help
        │     │ fail → diagnose → fix → re-verify        (budget: 3 no-progress cycles)
        │     └── budget hit, or a fix needs a decision beyond the plan ─► ⛔ GATE     [STOP→worklog]
        │  pass
  P4 REVIEW ◄┐ @fkit-reviewer → /fkit-stateful-review (working tree, task-id)  (hop 1)
        │    │ verify each finding · classify defect/frontier · loop-check · write verdicts
        │    │   • mechanical, in-plan CORRECT-defect fix, or an OBVIOUS WINNER ─► apply [autonomous]
        │    │   • judgment call (frontier/residual · regression/oscillation · disputed
        │    │     scope · broad/behavior-changing · outside the plan) ─► ⛔ OWNER GATE  [STOP]
        │    │ partial (no Codex)? re-request review up to 3 total; still partial ⇒
        │    │     proceed but mark loudly "reviewed — NOT model-diverse"              [autonomous]
        │    │ ── ANY code changed here ⇒ RETURN TO P3 (re-verify) before closing ──┐
        │    └── repeat rounds until ledger closed-out; non-convergence ─► ⛔ GATE [STOP→worklog]
        │  ledger closed-out AND last verify green
  P5 REPORT    finalize ai-agents/worklogs/<task-id>.md into the ready-for-done EVIDENCE
        │      packet (§6.3) — evidence to judge, not a done-verdict. Partial review flagged loudly.
  P6 DONE GATE ╠═► ⛔ OWNER GATE: "mark done?" — owner returns here. Loop STOPS. Does NOT
               move the file, does NOT spawn a producer to move it. Owner closes via the normal
               /fkit-task-done (producer). Status stays 🔄 In progress (accurate) until ✅ Done.

  ANY early exit (P1 rejection · P3 budget · P4 non-convergence · consult dead-end):
     set accurate status (🔲 Backlog on rejection, else 🚧 Blocked — <reason>, both locations)
     · finalize the worklog with the reason · end turn (the owner returns to it). No silent stall.
```

**All owner contact funnels through the coder session** (D3). Sub-agents the loop spawns cannot reach
the owner mid-chain — they return open questions in their replies, which the loop surfaces at the next
gate (or logs and proceeds if the answer is an obvious winner).

### 4.1 Durability & resumption — surviving a long autonomous run (X5)

The loop does **not** trust its own memory. It anchors to durable, external files and re-derives
position each resume:

- **Approved plan** — `ai-agents/plans/<task-id>.md` (git-tracked). **The plan's scope is the boundary
  the loop's autonomy is measured against**, so it must survive a resume. Written at approval; the
  reference the loop re-reads to know what it may do without asking.
- **Worklog + owner-decision log** — `ai-agents/worklogs/<task-id>.md` (git-tracked). Accumulates, as
  it happens: what was built, **every "obvious winner" the loop chose while the owner was away**,
  problems, lessons — finalizing into the P5 report. This is the owner's window into the autonomous
  stretch.
- **Review state** — `ai-agents/reviews/<task-id>.md` (the reviewer↔coder ledger, kept a **separate**
  file — different two-party ownership rules; not merged into the worklog).
- **Implementation state** — the git working tree / `git diff`.
- **Fail-safe rule:** on resume, if the loop cannot establish from these files that a gate was passed,
  it **returns to the nearest owner gate** — it never infers a plan approval it cannot evidence. The
  verify-budget counter is a soft proxy (`fkit-process-stateful-review:152-154`); a reset on resume is
  acceptable — the real stop is the *nature* of the failure, not the count.

**Status write = both locations (X7):** every transition writes the brief's `## Status` **and** the
sprint-plan row in the same step; a half-written status is an error to finish, never left disagreeing.

---

## 5. The five conflicts — the owner's rulings (approved 2026-07-17)

### D1 — Done-gate consent → **loop stops at the gate.** (owner: **A**)
The loop's terminal act is the finalized worklog/report plus the explicit ask. It **does not** move the
brief and **does not** spawn a producer to move it. The owner closes via the normal owner-invoked
`/fkit-task-done` (a `fkit producer` session). The P5 packet is framed as **evidence the owner judges,
not a completion verdict** (preserving the anti-laundering *intent*, not just the mechanism). Rejected:
relayed-consent (contradicts "do not tell anyone else to"; would need its own ADR). Cost accepted: a
session switch to close each task — *that friction is the gate.* → **ADR-019.**

### D2 — Autonomy → **the loop's built-in default; the plan gate is the one upfront stop.** (owner: default autonomy + plan gate stays)
The owner's model: **start the loop → it plans → owner approves → owner walks away → the loop ships
autonomously → owner returns at the done-gate.**

- **This resolves the rev-1 / Codex objection (X1) rather than reopening it.** X1 said you cannot weaken
  the *shared* `fkit-process-stateful-review` gate via an unauthenticated "loop-context" signal.
  Autonomy here is **not** an override bolted onto that skill — it is the **self-contained default
  behavior of `fkit-task-ship-loop`**. Invoking the loop skill *is* the authorization; the skill is
  coder-owned and hook-enforced (only the coder can run it, ADR-018). The loop carries the review
  **rigor** (verify every finding, defect-vs-frontier, loop-check, re-verify) under its **own**
  discipline — it does not call the gated skill and then contradict it. No shared gate is secretly
  weakened, so X1's failure mode does not arise.
- **The plan gate is UNCHANGED and hard (P1)** — the single guaranteed human checkpoint on *what gets
  built*, before any code, also runtime-enforced by plan mode.
- **The autonomous class is bounded by fix *shape*, not verdict (X6):** the loop applies a fix without
  asking **only if** it is (a) verified `CORRECT`, **and** (b) mechanical/localized, **and** (c) inside
  the approved plan's design — **or** it is an **obvious winner** (see the stop-list, §6.1). It **stops**
  for every judgment call: a frontier-move / recording a residual, a regression or oscillation, a
  disputed severity that changes scope, a broad/behavior-changing fix, or anything outside the plan (a
  new architecture/scope decision → owner, `fkit-coder.md:90-94`). *When in doubt about the shape, it
  stops.*
- **Contract amendment (task 53, ADR-019):** a scoped note in `fkit-coder.md` that `/fkit-task-ship-
  loop` runs autonomously by default after plan approval, with the shape limits and stop-list above —
  and that **outside this loop, the coder's per-round fix approval is unchanged.** `fkit-process-
  stateful-review` is **byte-unchanged**; the loop uses its method, not a modified copy.

### D3 — Sub-agents cannot ask the owner → **within today's envelope; no task-39 dependency.** (architect ruling)
All owner contact funnels through the coder session; sub-agents return open questions in their replies;
the loop surfaces them at the next gate (or logs and proceeds on an obvious winner). "Walk away" works
because a pending question simply waits for the owner's next session turn.

### D4 — Two-hop consult / no cycles → **loop is hop 0; its consults are hop 1.** (architect ruling)
No new topology. The reviewer→adversarial-reviewer spawn is a hop-2 leaf internal to
`fkit-stateful-review`; it may be absent (Codex down) → the review degrades to partial, handled at P4,
not a budget violation. An unresolved hop-2 open question is surfaced to the owner.

### D5 — Build on the ADR-018 hook → **relied upon.** (architect ruling)
The coder→reviewer spawn is enforced-correct by the ADR-018 hook keying on the real caller.

---

## 6. The owner-contact contract

### 6.1 STOP for the owner — the "important questions"
1. **Plan approval** (P1) — the one guaranteed upfront gate.
2. **Blocking ambiguity in the brief** that changes *what* gets built.
3. **A genuinely new architecture/scope decision** the plan didn't anticipate — a change of direction.
4. **Review judgment calls** (P4): a frontier-move / accepting a residual, a regression or review
   oscillation, a disputed severity that changes scope, a broad/behavior-changing fix, or a fix outside
   the approved plan.
5. **The done-gate** (P6).
6. **A dead-end** it can't resolve (verification it can't get green within budget; a consult that
   returns nothing usable).

**The proactive "obvious winner" override (owner ruling).** The loop should **not** stop for a decision
that has an obvious right answer. Where one option **clearly dominates on the merits** *and* stays
**within the approved plan's intent**, the loop **picks it and proceeds** — it does not manufacture an
important question out of a no-brainer. The boundary that keeps this from swallowing the real stops:
a genuine tradeoff with no dominant option, or any choice that **changes direction/scope**, is **not** a
winner — it stops (items 2–4). **Every winner it picks is recorded in the worklog's decision log**, so
the owner sees exactly what was chosen while they were away.

**The no-Codex path (owner ruling).** On a partial (no-Codex) review the loop re-requests the review up
to **3 attempts total** (absorbing a transient outage). If still no model-diverse pass, it **proceeds**
— it does **not** stop and wait — but marks the task **loudly "reviewed — NOT model-diverse,"** surfaces
that prominently in the worklog/report, and leaves it flagged at the done-gate for the owner's judgment.

### 6.2 Proceed autonomously (no stop)
Grounding; implementing the approved plan; verify cycles within budget; verifying/classifying review
findings; applying mechanical in-plan CORRECT-defect fixes and obvious winners; consulting agents
within the hop budget.

### 6.3 The ready-for-done report — the finalized `worklogs/<task-id>.md` (P5)
Evidence the owner judges, **not** a done-verdict. The owner's four are the floor; the producer consult
defined the additions (Done = *reviewed · verified · complete* — the packet lets the owner confirm each):
- **Task filename · problems encountered · lessons learned · open questions** *(owner's four)*.
- **Owner-decision log** — every important question asked and every obvious winner the loop chose while
  the owner was away (the autonomy audit trail).
- **Review ledger** — path, verdict line, all findings resolved/dispositioned, **and the Codex-coverage
  state** (full vs partial — if partial, flagged loudly).
- **Verification evidence, concrete** — commands + pass/fail, **from the run *after* the final code
  change** (X2), not "verification passed."
- **The brief's `## Verification steps`, walked and ticked** — each criterion met/unmet.
- **Files touched / change surface** — the diff scope (frames the later wiki sync's delta).
- **Residuals / deferrals** and **recommended follow-up tasks** — *named only*; the loop does **not**
  file briefs (producer's job) and does **not** write the wiki (fkit-wiki's job).
- **Commit state** — explicit (`git status`; hard rule + evidence-before-assertion).

---

## 7. Data & state — two new per-task artifacts (→ ADR-020)

The loop composes existing state and adds **two git-tracked, coder-written, task-id-keyed files**, each
a **top-level directory mirroring `ai-agents/reviews/`** (its own dir, keyed by id, staying put when the
brief moves to `done/`):

| Path | Written by | When | Contents | Lifecycle |
|---|---|---|---|---|
| `ai-agents/plans/<task-id>.md` | coder (loop) | at plan approval (P1) | the approved implementation plan — the autonomy boundary | retained by id; **not** moved by task-done; not wiki-ingested |
| `ai-agents/worklogs/<task-id>.md` | coder (loop) | opened post-approval; grows P2–P5 | worklog + owner-decision log → finalized ready-for-done report | retained by id; **not** moved by task-done; not wiki-ingested |

- **Both are new coder write targets** — a small, deliberate widening of the coder's write surface
  (previously: source + the *Coder response* section of the review ledger). Recorded in ADR-020.
- **Git-tracked, left in the working tree; the owner commits** (never the loop). Consistent with the
  review ledger, which is also git-tracked.
- **The review ledger stays separate** — two-party ownership; not merged.
- **Future direction (ADR-020, not built here):** collapse `plans/`, `worklogs/`, `reviews/`, and the
  brief into a **per-task folder `ai-agents/tasks/<task-id>/`** holding all of a task's files. Recorded
  with a *"Re-raise only if we adopt per-task folders"* trigger so today's separate-dirs choice is a
  known stepping stone, not re-litigated.

---

## 8. Failure & exit behavior — never a silent stall

| Terminal state | Trigger | The loop does |
|---|---|---|
| **Ready for done** | ledger closed-out **and** last verify green | finalize worklog → done-gate (STOP) |
| **Back to Backlog** | owner rejects the plan at P1 | status stays `🔲 Backlog` (In progress not set until approval); worklog notes it; STOP |
| **Blocked — verification** | P3 budget (3 no-progress cycles) hit | `🚧 Blocked — verification: <what fails>` (both locations); finalize worklog; STOP |
| **Blocked — review non-convergence** | P4 oscillation (loop-check fires) | surface convergence call; `🚧 Blocked — review not converging`; STOP |
| **Blocked — needs a decision** | a fix/plan question beyond the plan | surface; `🚧 Blocked — awaiting decision: <q>`; STOP |
| **Blocked — consult dead-end** | a hop-2 open question can't be answered | surface; `🚧 Blocked — <q>`; STOP |
| **Proceeds, flagged** | Codex absent after 3 attempts | proceed to P5/P6; task marked loudly "reviewed — NOT model-diverse" (not a stop) |

**Invariants — scoped honestly (X4):**
- `🔄 In progress` is set **only after plan approval** (so a pre-approval exit leaves `Backlog`);
  `🚧 Blocked — <reason>` on any run the loop concludes is not proceeding.
- At the **done-gate, `🔄 In progress` is correct, not stale** — work done, close-out pending the owner.
- The loop **cannot control a session the owner abandons mid-turn** and does not claim to; on **resume**
  it re-derives status from the artifacts (§4.1) and corrects any status that no longer matches reality.
- Every exit the loop reaches finalizes the worklog; the loop **never sets `✅ Done`.**

---

## 9. Skill mechanics (shape only — task 53 implements)

- **Name:** **`fkit-task-ship-loop`** *(the owner's choice, 2026-07-17)*. Directory
  `claude/skills/fkit-task-ship-loop/SKILL.md`, opening with the `⛔ Owner: the coder` banner **and a
  loud "this skill does NOT move task files"** line — because the `task-*` prefix otherwise reads as the
  producer's task-file-lifecycle namespace (`task-brief`, `task-done`, `task-cancelled`) and could
  mislead. (Naming rationale and the `fkit-ship-task` alternative are recorded in §15 / ADR-019; the
  owner ruled to keep `fkit-task-ship-loop`.)
- **Argument:** the **task-brief path** — an operand (one-skill-one-output; no output variants).
- **Registration:** add to the **coder's** list in `claude/skills-for-role.sh` (single source of
  truth). The ADR-018 hook then allows the coder, denies every other role. **Mirror tables updated in
  the same commit:** `claude/skills/fkit-team/SKILL.md`, `claude/README.md`.
- **Session-only, by contract:** the SKILL.md states it runs in a `fkit coder` **session**; it
  **refuses** a background/spawned invocation and returns the plan instead (`fkit-coder.md:28-33`).
- **Composes, does not fork, existing skills:** it invokes `/fkit-plan-task` (coder-owned) and spawns
  `@fkit-reviewer`; it applies `fkit-process-stateful-review`'s **method** under the loop's own
  autonomous discipline. The only wording touched (task 53) is the ADR-019 note in `fkit-coder.md`;
  `fkit-process-stateful-review` is byte-unchanged.
- **Test coverage (task 53, per ADR-014 — `node --test`, zero devDeps):** hook allow-for-coder /
  deny-for-every-other-role, both directions; plus the exit-path checks in §13.
- **Dependencies:** builds on ADR-018 (task 43, done). If task 50 lands first, use `task-brief`
  vocabulary in cross-references. No dependency on task 39 (D3).

---

## 10. Deviations from the owner's 13-step sketch — each with its reason

| Sketch | Change | Reason |
|---|---|---|
| Flat 1–13 list | Phases P0–P6 with explicit gates | Makes gates and the two inner loops legible. |
| (implicit) | P0 grounding (wiki/architecture/ADRs) | Standing coder practice (`fkit-coder.md:69-78`). |
| Step 3 plan | Plan written to `plans/<task-id>.md`; approval is the one hard upfront gate | Load-bearing (task 17); durable so autonomy has a fixed boundary (§4.1). |
| (implicit) status | `→ 🔄 In progress` **after** approval, both locations | Coder-authorized (vocabulary); post-approval avoids a stale status on plan rejection (C2/X7). |
| Steps 2/4/10 "ask owner if needed" | **Default autonomy** after approval; owner walks away; stops only for the §6.1 important-questions (+ obvious-winner override) | The owner's core ask — trust the coder, ask only what matters. → ADR-019. |
| Step 6 test | **Bounded** verify (3 no-progress → Blocked) + re-verify after any P4 fix | No silent thrash; a post-review fix can regress (X2). |
| Steps 8–9 review | Review under the loop's own discipline; mechanical/in-plan/obvious-winner fixes autonomous; judgment calls stop; **Codex retried 3× then proceed-and-flag** | Minimal owner involvement with the safety stops kept; a same-model "second opinion" never presented as complete (X3). |
| Step 11 "repeat until review completes" | **Bounded** by ledger closed-out / non-convergence | The loop-check already detects oscillation. |
| Step 12 report (4 items) | Evolving `worklogs/<task-id>.md` → finalized evidence packet (§6.3), evidence not verdict | Durable, complete-at-done record (owner's ask); anti-laundering intent (C3). |
| Step 13 "producer sub-agent runs task-done on Yes" | **Removed.** Loop stops at the done-gate; owner closes normally (D1) | Violates "do not move / do not tell anyone else to." |

---

## 11. The loop, numbered — OWNER-APPROVED (2026-07-17)

> **⛔ STOP** steps are owner gates. The owner approves the plan (step 3), then may walk away; the loop
> ships autonomously and the owner returns at the done-gate (step 10).

1. **Ground.** Read the brief; resolve the task-id. Read the wiki (`/fkit-query`), `architecture.md`,
   and any ADR whose "Re-raise only if" bears on the work.
2. **Clarify & plan.** If the brief is ambiguous on design/scope, consult architect/producer (hop 1)
   and surface returned open questions. Run `/fkit-plan-task` → produce the plan in plan mode → **write
   it to `ai-agents/plans/<task-id>.md`.**
3. **⛔ STOP — plan approval.** Present the plan (+ open questions) and wait. **If rejected, stop** —
   the task stays `🔲 Backlog`. *After approval, the owner may walk away.*
4. **Mark In progress & build.** Set `🔄 In progress` in **both** the brief `## Status` and the sprint
   row; open `ai-agents/worklogs/<task-id>.md`. Implement the approved plan with minimal, idiomatic
   diffs, logging notable decisions and every **obvious winner** chosen.
5. **Verify.** Test per project conventions (ADR-014), sub-agents where they help. On failure:
   diagnose → fix → re-verify. **Budget: 3 no-progress cycles** → **⛔ STOP** with a `🚧 Blocked`
   worklog. A fix needing a decision beyond the plan → **⛔ STOP**.
6. **Review.** Spawn `@fkit-reviewer` → `/fkit-stateful-review` (working tree, task-id; hop 1). Verify
   each finding against the code, classify defect vs frontier-move, loop-check against residuals + ADRs,
   write verdicts to the ledger. **Apply mechanical, in-plan CORRECT-defect fixes and obvious winners
   autonomously; ⛔ STOP** for any judgment call (frontier/residual, regression/oscillation, disputed
   scope, broad/behavior-changing, or out-of-plan). If the review is **partial (no Codex), re-request
   up to 3 attempts total; if still partial, proceed and mark the task loudly "reviewed — NOT
   model-diverse."**
7. **Re-verify & loop.** If any code changed in step 6, **return to step 5.** Repeat steps 6–7 until the
   ledger is **closed-out with the last verify green.** Non-convergence → **⛔ STOP** with the
   convergence call and a `🚧 Blocked` worklog.
8. **Finalize the report.** Complete `ai-agents/worklogs/<task-id>.md` into the ready-for-done
   **evidence** packet (§6.3) — evidence to judge, not a done-verdict.
9. **⛔ STOP — the done-gate.** The owner returns; ask whether to mark the task done. **The loop does
   not move the file and does not spawn a producer to move it.** The owner closes via the normal
   owner-invoked `/fkit-task-done` (producer session); status stays `🔄 In progress` until the mover
   sets `✅ Done`.

**Any early exit** (step 3 rejection, step 5 budget, step 7 non-convergence, a consult dead-end): set
the accurate status (`🔲 Backlog` on rejection, else `🚧 Blocked — <reason>`, both locations), finalize
the worklog with the reason, end the turn. **On resume, re-derive position from the durable artifacts
(§4.1) and fail safe to the nearest owner gate.** No path ends in silence.

---

## 12. Alternatives considered

- **Relayed-consent close-out** — rejected (D1); available only as an explicit owner ADR.
- **Per-run *spoken* autonomy grant** (rev 2) — superseded; the owner wants autonomy as the built-in
  default, not something to state each run.
- **Narrowing `process-stateful-review`'s gate via a cross-skill note** (rev 1) — rejected after the
  Codex pass (X1/X6); replaced by the self-contained loop default (D2).
- **One combined per-task working doc** (plan + report merged) — considered; the owner chose two
  separate files (`plans/`, `worklogs/`), forward-compatible with a future per-task folder (§7).
- **Unbounded verify/review loops** (sketch) — rejected; violates "no silent stall."
- **`fkit-ship-task`** (architect + producer recommendation, namespace-cleaner) — rejected by the owner
  in favor of `fkit-task-ship-loop`; mitigated by the loud "does not move task files" banner (§9).

---

## 13. Impact, risks & testing

**Blast radius:** one new coder skill; a scoped ADR-019 note in `fkit-coder.md`; two new per-task
artifact dirs (`plans/`, `worklogs/`). No launcher/hook code change; `fkit-process-stateful-review`
unchanged. **Backward-compat:** none broken; additive.

**Top risk — default autonomy relaxes the fix gate (ADR-019's sharp edge).** Mitigations: the plan gate
is an unremovable upfront human checkpoint; the autonomous class is bounded by **fix shape** (mechanical
+ in-plan) and the obvious-winner boundary (dominant + in-intent), not verdict; **every** judgment call
and direction-change still stops; **re-verify-after-fix (X2)** closes the silent-regression hole; the
**worklog decision-log** makes every autonomous choice auditable; and the owner is one session-turn away
throughout. Residual: the model must honestly self-classify fix shape / "obvious winner" — a soft
boundary, mitigated by "when in doubt, stop." This is the property task 53's dry-run must exercise
hardest.

**Debt:** the mirror-table duplication (`fkit-team`, `README.md`) — task 53 updates them in the same
commit.

**Testing strategy (task 53):**
- **Hook allow/deny** for `fkit-task-ship-loop`: coder allowed, every other role denied, both
  directions (`node --test`, zero devDeps per ADR-014).
- **Dry run on a real small backlog task**, owner observing every gate — proving the plan gate, the
  autonomous stretch (with the worklog decision-log populating), the obvious-winner and judgment-call
  split, the Codex-retry-then-flag path, re-verify-after-fix, and stop-at-done-gate end to end.
- **Exit-path checks:** force (a) verify-budget exit, (b) non-convergence exit, (c) plan rejection, (d)
  Codex-absent review; confirm each leaves the correct status (both locations), no stale `In progress`,
  and a finalized worklog.

---

## 14. Open questions

**All design decisions are resolved** (owner interview, 2026-07-17). Remaining items are handoffs, not
open questions:
- **ADR-019 and ADR-020** to be recorded (`/fkit-record-decision`, architect) alongside this approval.
- **Task 53** implements this spec; its dry-run needs a real small backlog task (producer nominates).
- **Post-53:** fkit-wiki ingests the new skill (scoped when 53 lands).

---

## 15. Adversarial-pass ledger & owner rulings

**Codex adversarial pass (rev 1 → rev 2)** — model diversity intact; disposition of each finding:

| # | Sev | Finding (abridged) | Disposition |
|---|---|---|---|
| X1 | crit | D2 cross-skill note unenforceable; no loop-context signal | **Resolved** — autonomy is the loop's self-contained default, not a shared-gate override (§5 D2). |
| X2 | high | No re-verify after review fixes | **Accepted** — re-verify step (§4, §8, §11 step 7). |
| X3 | high | Codex-absent review not handled; could close as "reviewed" | **Accepted** — retry 3×, then proceed-and-flag loudly (§6.1). |
| X4 | high | "No stale In progress" unguaranteeable for a stateless loop | **Accepted** — invariant re-scoped honestly (§8). |
| X5 | high | No durable checkpoint across turns/compaction | **Accepted** — §4.1 + §7 durable artifacts; fail-safe to nearest gate. |
| X6 | high | `CORRECT` ≠ mechanical; autonomy line too loose | **Accepted** — bound by fix *shape* + obvious-winner boundary (§5 D2, §6.1). |
| X7 | med | Blocked exits don't require both status writes | **Accepted** — status-write-is-both-locations (§4.1). |
| C1 | med | Relay-as-STOP inconsistency | **Accepted** — reconciled across §4/§6/§11. |
| C2 | med | Plan rejection left stale In progress | **Accepted** — In progress set only after approval (§8, §11). |
| C3 | low | Report asserted a done-verdict | **Accepted** — reframed as evidence to judge (§5 D1, §6.3). |
| C4 | low | D4 assumed hop-2 Codex leaf always present | **Accepted (note)** — robustness caveat (§5 D4). |

**Owner rulings (design interview, 2026-07-17), in order:**
1. **D1** — done-gate: **loop stops at the gate**; owner closes normally (no relayed-consent).
2. **D2** — autonomy: **the loop's built-in default**, not a per-run spoken grant; owner walks away.
3. **Plan gate** — **stays** as the one guaranteed upfront stop; owner approves, then leaves.
4. **Stop-list** — approved, **plus a proactive "obvious winner"** override (pick clearly-dominant
   in-plan options without asking; genuine forks/direction-changes still stop; all choices logged).
5. **Codex** — **retry up to 3 total, then proceed and mark loudly "NOT model-diverse."**
6. **Name** — keep **`fkit-task-ship-loop`** (with a loud does-not-move-files banner).
7. **Verify budget** — **3** no-progress cycles.
8. **Plan artifact** — **`ai-agents/plans/<task-id>.md`** (top-level, mirrors `reviews/`). Needs an ADR.
9. **Report artifact** — **`ai-agents/worklogs/<task-id>.md`** (separate file; worklog → final report).
   Follow-ups **named-only** (no auto-filing).
10. **Future** — per-task folder `ai-agents/tasks/<task-id>/` as the intended end-state (ADR-020,
    re-raise-only-if trigger).

---

*Deliverable: `ai-agents/knowledge-base/reports/2026-07-17-design-task-ship-loop-skill.md` (rev 3,
owner-approved). Not committed. ADR-019 (loop contract & consent) and ADR-020 (per-task `plans/` +
`worklogs/` artifacts) record the settled decisions; once task 53 ships, fkit-wiki should ingest the
skill. No wiki write performed here.*
