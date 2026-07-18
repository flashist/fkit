# ADR-019: The coder's `fkit-task-ship-loop` is autonomous-by-default, gated only at plan-approval and the done-gate

- **Status:** accepted
- **Date:** 2026-07-17
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect (producer consulted for lifecycle;
  fkit-adversarial-reviewer/Codex consulted for an adversarial pass)
- **Amends (does not supersede):** the coder's "owner present for the fix gate" contract in
  `claude/agents/fkit-coder.md:28-33` — narrowed for this one skill's context, unchanged everywhere
  else.
- **Amended in place (2026-07-18, owner ruling):** **Decision 3's "No `AskUserQuestion` dependency"
  clause only.** The tool is now granted ([ADR-022](adr-022-tools-unrestricted-except-adversarial-reviewer.md));
  see the amendment note inside Decision 3. **Every other decision here is unchanged** — including the
  turn-ending/idling behavior itself, which is **not** repealed.

## Context

The owner asked for a coder skill that takes a task from brief to *done* with **minimal owner
involvement** — explicitly: *"I want to run the loop, get away from the computer, and be sure the coder
makes their own decisions while I am absent — only important questions can and should be asked from
me."* This collides head-on with three settled facts:

1. **The coder's contract is "owner present."** `fkit-coder.md:28-33` bars *background delegation*
   because the plan and fix approval gates need the owner; task 17 restored plan mode as that gate.
2. **The review fix gate is per-round owner-approved.** `fkit-process-stateful-review/SKILL.md:172-182`
   and its hard rule (`:216-229`, *"Never change code without my explicit approval in this turn"*)
   require the owner to approve every code change, every review round.
3. **Done is owner-gated, anti-laundering.** Task files move to `done/` **only** via the owner-invoked
   `/fkit-task-done` (`fkit-task-done/SKILL.md:183-189`; `CLAUDE.md` universal hard rule: *never move a
   task file, and do not tell anyone else to*).

A first design (rev 1 of the design spec) tried to make the loop autonomous by having it invoke
`/fkit-process-stateful-review` and narrow that skill's gate "for the loop context" via a one-line
cross-skill note. A **Codex adversarial pass** (model diversity intact) killed it: there is **no
runtime-authenticated signal for "loop context,"** so the note either loses to the skill's
self-contained hard rule (autonomy impossible) or is claimable by any standalone invocation (gate
bypassed) — and a `CORRECT` *verdict* certifies a finding's accuracy, **not** that its fix is mechanical
or narrow.

The decision below resolves all of this. Full analysis, the phased loop, the owner-contact contract,
and the adversarial-findings ledger are in the design spec
[`reports/2026-07-17-design-task-ship-loop-skill.md`](../reports/2026-07-17-design-task-ship-loop-skill.md)
(rev 3, owner-approved).

## Decision

**`fkit-task-ship-loop` is a coder-owned skill that runs autonomously by default after a single
up-front plan approval, stopping for the owner only at a bounded set of "important questions" and at the
owner-only done-gate. It never moves a task file.**

1. **Autonomy is the loop's built-in default, self-contained in the skill.** Invoking
   `/fkit-task-ship-loop` **is** the owner's authorization to proceed autonomously. This is **not** an
   override bolted onto the shared `fkit-process-stateful-review` gate (which the Codex pass proved
   unenforceable) — the loop carries the review **rigor** (verify every finding, defect-vs-frontier,
   loop-check against residuals + ADRs, re-verify) under its **own** discipline, and does not call the
   gated skill and contradict it. Because the skill is coder-owned and hook-enforced (ADR-018, only the
   coder can run it), the authorization cannot be claimed by another role or a standalone invocation.
   **`fkit-process-stateful-review` is byte-unchanged; the per-round fix gate remains in force for every
   use of it outside this loop.**
2. **The plan gate stays — the one guaranteed upfront human checkpoint.** The owner approves the
   implementation plan (also runtime-enforced by plan mode) before any code. Only after approval may the
   owner walk away. Plan **rejection** ends the run with the task left `🔲 Backlog`.
3. **"Walk away" is ordinary in-session turn-taking, not background delegation.** The loop stays a
   `fkit coder` **session** with the owner reachable; between gates it proceeds without waiting, and at
   an important question it **ends its turn and idles** until the owner returns to the terminal. It
   **refuses** a genuinely spawned/headless invocation and returns the plan instead. ~~No
   `AskUserQuestion` dependency (task 39).~~ — **amended 2026-07-18, see below.**

   > **Amendment (2026-07-18, owner ruling; surfaced by task 61's stateful review, R1).**
   > **In a session, `AskUserQuestion` is the expected way for the loop to put an important question to
   > the owner.** The struck clause was written on 2026-07-17 while task 39's investigation was still
   > open and **no fkit agent held the tool**; it recorded that the loop's owner-contact design did not
   > *depend* on a capability the coder did not have. [ADR-022](adr-022-tools-unrestricted-except-adversarial-reviewer.md)
   > (2026-07-18) granted it, so the premise is gone. Live ship-loop runs this session confirm it works
   > well at gates.
   >
   > **What does NOT change:**
   > - **The turn-ending/idling behavior is not repealed.** The loop still ends its turn and waits for
   >   the owner; a structured prompt is *how* it waits, not a replacement for waiting. There is still
   >   no timeout and no auto-proceed ([ADR-024](adr-024-ship-loop-owner-question-timeout-is-not-built.md)).
   > - **Spawned/headless is unaffected.** The tool is `TOOL_ABSENT` in any consult
   >   ([ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md)) and the loop refuses
   >   such an invocation anyway (this same Decision 3).
   > - **The plan-gate and done-gate keep their own enforcement, independent of the asking mechanism** —
   >   plan mode for the former (Decision 2), the owner-invoked `/fkit-task-done` mover for the latter
   >   (Decision 5). Using a structured prompt to *ask* at either gate does not route around either.
   >
   > This is a mechanism amendment, not a gate change: it neither adds a gate nor removes one.
4. **The autonomous class is bounded by fix *shape*, not verdict, plus an obvious-winner rule.** The
   loop applies a change without asking **only if** it is (a) verified `CORRECT`, (b) mechanical/
   localized, and (c) inside the approved plan's design — **or** it is an **obvious winner** (one option
   clearly dominates on the merits *and* stays within the approved plan's intent). It **stops** for every
   judgment call: a frontier-move / recording a residual, a regression or review oscillation, a disputed
   severity that changes scope, a broad/behavior-changing fix, a genuine tradeoff with no dominant
   option, or anything outside the plan (a new architecture/scope decision → owner,
   `fkit-coder.md:109-113`). **When in doubt about the shape, it stops.** Every autonomous choice — every
   obvious winner — is recorded in the task's worklog decision-log (ADR-020) so it is auditable.
5. **The done-gate is unchanged and owner-only.** The loop's terminal act is a finalized ready-for-done
   **evidence packet** (evidence to judge, not a done-verdict) plus the explicit ask. **It does not move
   the brief and does not spawn a producer to move it.** The owner closes via the normal owner-invoked
   `/fkit-task-done` (a producer session). Status stays `🔄 In progress` until the owner's mover sets
   `✅ Done`.
6. **The Codex second opinion cannot be silently skipped.** A partial (no-Codex) review is re-requested
   up to **3 attempts total**; if still not model-diverse, the loop **proceeds** but marks the task
   **loudly "reviewed — NOT model-diverse,"** surfaced in the report and at the done-gate — never
   presented as a complete review.
7. **No silent stall, honest status.** Every terminal state the loop reaches finalizes the worklog and
   leaves an accurate status (`🔲 Backlog` on plan rejection, else `🚧 Blocked — <reason>` in both the
   brief and the sprint row). `🔄 In progress` is set only *after* plan approval. The loop never sets
   `✅ Done`.

**Task 53 applies the single contract edit this requires:** a scoped note in `fkit-coder.md` stating
that inside `/fkit-task-ship-loop` the coder runs autonomously by default after plan approval, with the
shape limits and stop-list above — and that **outside this loop, the coder's per-round fix approval is
unchanged.**

## Options considered

- **Autonomous-by-default, self-contained in the loop skill; plan gate + done-gate retained
  (chosen).** Gives the owner the walk-away workflow, keeps the two load-bearing human checkpoints,
  keeps the review skill and its gate intact for every other use, and is enforceable because invoking
  the coder-only skill *is* the authorization. Cost: a real, recorded amendment to the coder's
  owner-present contract, and a soft boundary (the model self-classifying fix "shape" / "obvious
  winner") — mitigated by "when in doubt, stop," the plan-scope boundary, re-verify-after-fix, the
  worklog audit trail, and the owner being one session-turn away.
- **Per-run *spoken* autonomy grant** (design rev 2). Rejected by the owner: they do not want to state a
  grant each run — autonomy should be the loop's default. (It was also more ceremony for the same effect.)
- **Narrow `fkit-process-stateful-review`'s gate via a cross-skill note** (design rev 1). Rejected after
  the Codex pass: unenforceable without a runtime loop-context signal, and `CORRECT` ≠ mechanical (design
  spec §15, findings X1/X6).
- **Relayed-consent close-out** (loop spawns a producer to run the mover on a recorded "Yes"). Rejected:
  directly contradicts the "do not tell anyone else to" hard rule and would launder the coder closing its
  own work; a separate consent-model ADR would be required to adopt it. The producer consult concurred.
- **Fully unattended/headless background loop.** Impossible under `fkit-coder.md:28-33` and because
  spawned sub-agents cannot reach the owner mid-chain; the loop is deliberately session-bound.

## Consequences

- **Positive:**
  - The owner gets the intended workflow: start, approve the plan, walk away, return at the done-gate.
  - The two decisions that actually protect the work — *what gets built* (plan gate) and *what gets
    marked done* (done-gate) — stay human. The anti-laundering gate is intact.
  - The review skill and its per-round gate are untouched for every other use; no shared boundary is
    weakened, so the Codex objection (X1) does not arise.
  - Every autonomous choice is auditable in the worklog decision-log.
- **Negative / costs:**
  - **A genuine amendment to the coder's "owner present" contract**, scoped to this one skill. It must
    be written into `fkit-coder.md` (task 53), or the contract and the skill disagree.
  - **A soft self-classification boundary:** the loop must honestly judge a fix as mechanical/in-plan or
    an "obvious winner." A misjudgment could apply a scope-changing fix without asking. This is the
    sharpest edge; task 53's dry-run must exercise it hardest.
  - **Closing a task costs a session switch** (coder → producer) — accepted; that friction *is* the
    done-gate.
- **Residual risks / "re-raise only if":**
  - **The loop is shown to apply a scope-changing or out-of-plan fix without stopping** (the
    self-classification boundary failing in practice) — that is a defect against Decision 4, fix the
    skill; it does not reopen this ADR.
  - **A spawned/headless invocation of `fkit-task-ship-loop` is found to proceed autonomously** (the
    session-only refusal failing) — defect against Decision 3.
  - **Someone proposes making the loop's autonomy reachable by, or its gate model applied to, a role
    other than the coder, or bolting it onto `fkit-process-stateful-review` as a shared setting** —
    reopen this ADR; that is exactly the unenforceable path the Codex pass rejected.
  - **The owner later wants relayed-consent close-out** (loop-triggered task-done) — that is a **new**
    consent-model decision needing its **own** ADR; do not settle it implicitly here.
  - **A session-global `AskUserQuestion` timeout is armed** (`askUserQuestionTimeout` in *user* settings,
    or `CLAUDE_AFK_TIMEOUT_MS`) **while the loop uses the tool at the plan-gate or done-gate.** Both
    gates hold independently of the asking mechanism (plan mode; the owner-invoked mover), so this is
    **not** a live hole today — the shipped default is `"never"` and
    [ADR-024](adr-024-ship-loop-owner-question-timeout-is-not-built.md) declined to arm any timer. Named
    because ADR-024 reasoned about exactly this coupling: if a timer is ever armed, re-check that the two
    gates are not auto-proceedable, and prefer ADR-024's plain-wait expression for them.
  - Do **not** re-raise "the loop should not use `AskUserQuestion`" — that is the 2026-07-18 amendment
    above, taken knowingly on a premise (the tool being ungranted) that no longer holds. A finding must
    show a concrete failure of the *asking* mechanism, not restate the struck clause.
  - Do **not** re-raise "the coder shouldn't apply fixes without owner approval" as a defect against
    this loop — that is the per-round rule this ADR deliberately amends for `fkit-task-ship-loop` only;
    a finding must point to a specific failure of the shape/stop-list boundary, not restate the general
    rule.

## Related

- Design spec: [`reports/2026-07-17-design-task-ship-loop-skill.md`](../reports/2026-07-17-design-task-ship-loop-skill.md)
  (rev 3, owner-approved) — the full loop, owner-contact contract, and adversarial-findings ledger.
- [ADR-020](adr-020-per-task-plan-and-worklog-artifacts.md) — the `plans/` + `worklogs/` per-task
  artifacts this loop writes (the autonomy boundary and the audit trail live there).
- [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) — the
  `PreToolUse` hook that makes "only the coder can run this skill" structural, at any spawn depth.
- [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md) — the consult envelope the loop operates
  within (hop 0 session; hop-1 consults; no cycles).
- [ADR-022](adr-022-tools-unrestricted-except-adversarial-reviewer.md) — grants the coder
  `AskUserQuestion` (by inheritance); the fact that voids Decision 3's struck clause.
- [ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md) — the session/consult seam:
  the tool is `TOOL_ABSENT` in any spawned consult, so the amendment is **session-only** by construction.
- [ADR-024](adr-024-ship-loop-owner-question-timeout-is-not-built.md) — declines the owner-question
  timeout; its "safe design" already treated `AskUserQuestion` as the mid-loop asking mechanism, which
  independently corroborates the amendment. Its plan-gate/done-gate exclusions stand.
- Code the implementation (task 53) touches: `claude/skills-for-role.sh` (register for the coder),
  `claude/agents/fkit-coder.md:28-33` (the scoped contract note), `claude/skills/fkit-team/SKILL.md`
  and `claude/README.md` (mirror tables).
- Tasks: `ai-agents/tasks/backlog/design-task-ship-loop-skill.md` (this design, priority 52),
  `ai-agents/tasks/backlog/implement-task-ship-loop-skill.md` (implementation, priority 53 — hard
  dependency on this ADR + the approved spec).
