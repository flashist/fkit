# Design: a consent model for spawned invocation of the task movers

- **Date:** 2026-07-18
- **Author:** fkit-architect (spawned consult; chain `coder → architect`, hop 1 of 2)
- **Task:** [`design-spawned-invocation-consent-model-for-task-movers.md`](../../tasks/backlog/design-spawned-invocation-consent-model-for-task-movers.md) (Sprint 2, #63)
- **Status:** 🟡 **Draft — awaiting owner rulings.** No ADR recorded, no implementation authorized.
- **Blocks:** task 64 (implementation) — hard, including the owner's approval and the reversal ADR.

---

## Summary — the finding, stated plainly

**No fabrication-resistant precondition exists in fkit today.** Every candidate the brief named — a
closed review ledger, worklog evidence, a review-role sign-off — is a **markdown file in the repo that
the requesting agent has `Write` access to**. Under ADR-022 tool allowlists are unrestricted for every
role except the adversarial reviewer, and the `PreToolUse` hook gates the **`Skill`** tool only
(`claude/skill-ownership-hook.sh:95-98`) — not file writes. An agent asked to prove its work is done can
author its own proof.

This is the ADR-019 rev-1 problem wearing new clothes. That design died because there is **no
runtime-authenticated signal for "loop context."** This one dies on a sibling fact: **fkit has no
authenticated *authorship*.** No artifact under `ai-agents/` carries a signature its writer cannot
forge, and the one genuinely authenticated identity channel — the `PreToolUse` payload's `agent_type`
(ADR-018) — is (a) visible only to the hook, never to a skill or a script, (b) evaluated at
*invocation* time, and (c) answers *"who is calling"*, **never** *"is this work actually complete."*

**Architect's recommendation: keep `done` owner-only. Do not relax it.** A relaxation cannot *preserve*
the anti-laundering guarantee; it can only *replace* prevention with after-the-fact detection. That may
still be a trade the owner wants — §5 specifies it honestly — but it is a downgrade, and it should be
chosen as one, not adopted as if it were equivalent.

**Constructive alternative that costs nothing (§6): the prepared-move packet.** It removes most of the
friction the owner is actually complaining about without touching the gate at all, and I recommend
building it regardless of how the owner rules on the relaxation.

---

## 1. What the owner asked for, and what it decomposes into

> *"Let another agent drive `/fkit-task-done` and `/fkit-task-cancelled` by spawning the producer
> sub-agent and asking it to run them."*

The ask bundles two separable things:

| | Want | Status |
|---|---|---|
| **W1** | Remove the **session switch** (coder → producer) at close-out | An **ergonomics** problem. Solvable — §6. |
| **W2** | Remove the **owner** from the close-out decision | A **guarantee** problem. Not solvable — §2–§4. |

Most of the felt friction is W1. W2 is the part that reverses the hard rule. **They should be ruled on
separately**, and the questions in §9 are split accordingly.

## 2. Threat model — what "consent laundering" actually is here

**Laundering** = the moment where an agent's *belief* that work is done is converted into the
repository's *assertion* that it is done, with no human having checked.

The paths, in order of realistic likelihood:

| # | Path | Likelihood | Stopped by today's gate? |
|---|---|---|---|
| **L1** | **The confused optimist.** The coder genuinely believes the task is complete — tests green, review closed — but the work misses the brief's intent. It spawns the producer, which has no independent way to check and no owner channel, and the board turns green on the coder's own judgment. | **High.** This is the normal failure, not an exotic one. | ✅ Yes |
| **L2** | **Evidence written to satisfy the check.** A precondition is added ("ledger must read `closed-out`"); the agent, working backwards from the check, writes the ledger into the passing state and then invokes the mover. No dishonesty is required — the check reads as a *step*, not a *gate*. | **Medium–high**, and it *rises the moment a checkable precondition is published*, because the check becomes a documented target. | ✅ Yes (nothing to satisfy) |
| **L3** | **Relayed consent.** The coder tells the spawned producer "the owner approved this." The producer has no channel to verify (ADR-021: `AskUserQuestion` is session-only, absent in consults). | Medium | ✅ Yes |
| **L4** | **Prompt injection / a genuinely confused subagent.** ADR-018 §Decision 6 already records this as live: a spawned `fkit-lead` was stopped only by prose. | Low but demonstrated | ✅ Yes |

**The key structural fact.** A producer spawned as a consult has **no owner channel** — its `⛔ Owner:`
banner is advisory (ADR-012), and `AskUserQuestion` is absent (ADR-021). So *"the coder spawns the
producer and asks it to mark done"* is functionally **"the coder marks its own work done, with an extra
hop of laundering in between."** The spawned producer adds a *role name* to the transaction, not a
*second judgment*.

**L2 deserves emphasis because it is the trap in this design.** A precondition that the requester can
write does not merely fail to stop laundering — it *legitimizes* it, by giving the requester a ritual
that produces a green board and looks like compliance. That is strictly worse than no check, because it
manufactures false confidence in the artifact record.

## 3. Candidate preconditions, evaluated against actual project state

The brief asked for evaluation, not assertion. All three named candidates fail on the same axis.

| Candidate | Who writes it | Forgeable by the requester? | Verdict |
|---|---|---|---|
| **Closed review ledger** with a passing verdict (`ai-agents/reviews/<task-id>.md`) | Two-party, but the **coder owns the *Coder response* section** and its `Status`/verdict cells (`ai-agents/reviews/README.md:44-53,74-79`) | **Yes.** Plain markdown; coder has `Write`. Nothing binds the *Reviewer findings* section to an actual reviewer run. | ❌ Fails |
| **Worklog evidence** (ADR-020) | **Coder-written by definition** — ADR-020 Decision 3 names `worklogs/` a *"new coder write target"* | **Yes**, trivially. It is the coder's own narrative. | ❌ Fails |
| **Review-role sign-off** | `fkit-reviewer` writes it — but into a file with no authenticated authorship | **Yes.** A sign-off line is text; there is no signature, no attestation channel, and no way for the mover to tell a reviewer-written line from a coder-written one. | ❌ Fails |
| *(added)* **A `CORRECT` review verdict** | coder | Yes — and **ADR-019 already ruled this insufficient on separate grounds**: a `CORRECT` verdict certifies *a finding's accuracy*, **not** that the work is done (ADR-019 §Context, findings X1/X6). | ❌ Fails twice |
| *(added)* **Git commit authorship** | — | Agents are barred from committing (universal hard rule) and `user.name` is settable anyway. Not available and not authenticated. | ❌ Fails |
| *(added)* **Hook-payload identity** (`agent_type`) | The **harness** — genuinely authenticated (ADR-018, empirically confirmed at 0/1/2 hops) | **No — this one is not forgeable.** But it is *unusable for this purpose*: it is visible only inside `skill-ownership-hook.sh`, never to a skill or a shipped script (verified: `build_settings()` at `claude/fkit-claude.sh:249-276` passes **no** identity env var to anything but the hook), and it reports the caller, not the state of the work. | ⚠️ Authenticated but **answers the wrong question** |

**The one genuinely authenticated signal in the system tells you who is asking, and nothing about
whether the answer should be yes.** That asymmetry is the whole finding.

### 3.1 The one empirical question I did **not** resolve

Whether the `PreToolUse` payload distinguishes a **top-level role session** from a **spawned subagent of
the same role** (both carry `agent_type: fkit-producer`; `agent_id` also exists but its semantics are
unverified here). ADR-018's precedent is to test this against the live binary rather than reason about
it — worth doing, and cheap.

**But note it does not change this design's conclusion even if the answer is yes**, and the coder should
not treat it as a lead: a session/spawn discriminator lets the hook **deny spawned invocations more
firmly** — which is today's behavior, hardened. It provides no basis for **allowing** one. It would be a
welcome enforcement upgrade to the *status quo* (§7), not a route to the relaxation.

## 4. Ruling: `done` vs `cancelled` — the asymmetry is real in magnitude, not in kind

The brief is right that these are not equally dangerous, and right to demand the ruling rather than
assume symmetry.

| | `done` | `cancelled` |
|---|---|---|
| What it asserts | *"This work is complete"* — a **positive claim about quality** | *"This work will not be done"* — a **disposal, with a recorded reason** |
| Board effect | Turns green. Reads as delivered. | Leaves the board honest about non-delivery. |
| Laundering payoff | **High** — false credit, and the deception compounds (downstream tasks unblock on a lie) | **Low** — no false credit |
| Detection | A false `done` is caught only when someone uses the feature | A false `cancelled` is caught… possibly never. **Nobody audits `cancelled/`.** |
| Residual risk | Laundering by *credit* | Laundering by **disposal** — an agent that cannot finish a task making its obligation disappear |

**Ruling (recommended): do not relax either by default.** `cancelled` is *less attractive* to launder,
not *safe* to launder — an agent unilaterally deciding a task will never be done is still an agent
closing its own obligation without a human, and its lower detection rate partly offsets its lower
payoff. `fkit-task-cancelled/SKILL.md:226` states the reason directly: *"cancelling work is a judgment
about whether it will ever be done."* Judgment is the thing the gate protects.

**However — if the owner wants to relax exactly one, `cancelled` is the defensible choice**, and it is
the better experiment: lower blast radius, fully reversible (move the file back), and it exercises the
whole mechanism honestly. If the owner takes it, two conditions are non-negotiable:

1. **A mandatory, specific reason** — already required (`fkit-task-cancelled/SKILL.md:61`). An
   agent-invoked cancellation with a generic reason is refused.
2. **A distinct board marker** — an agent-cancelled task must **not** be visually identical to an
   owner-cancelled one. See §5.2.

## 5. If the owner relaxes anyway — the least-bad shape, priced honestly

Recommended **only** as the fallback under Q1=relax. It is a genuine downgrade and is written here so
the owner can choose it with open eyes.

### 5.1 What changes: prevention → detection

The guarantee stops being *"a task is marked done only by an act of the human"* and becomes *"a task
marked done by an agent is marked as such, and the act is visible in git."* Laundering becomes
**loud and reversible** instead of **impossible**. That is not nothing — but it is not the same thing,
and no wording should imply otherwise.

### 5.2 The mechanism

1. **Hook-enforced precondition, not prose.** Extend `skill-ownership-hook.sh` so a `Skill` call for
   `fkit-task-done` / `fkit-task-cancelled` is **denied** unless the required repo artifacts exist and
   are in the passing state. The hook is a shell script and can read the filesystem, so this is
   mechanically straightforward. **Prose in a SKILL.md is not enforcement** — ADR-018 §Decision 6
   already rejected prose-only self-refusal as defeatable by injection or confusion. If the relaxation
   ships with a prose-only check, it ships with no check.
   - **This stops L1 (the confused optimist) — the most likely path.** It does **not** stop L2, and
     saying otherwise would be the design's central dishonesty.
2. **A mandatory, hook-verifiable audit marker.** The mover writes `✅ Done (agent-closed — not
   owner-verified)` into the brief and the board — a *distinct token* from the owner-closed `✅ Done`.
   Anything that makes agent-closed and owner-closed indistinguishable defeats the entire fallback.
3. **Fail-closed everywhere**, per ADR-018 §Decision 3: any parse failure, missing artifact, ambiguous
   task-id, or internal hook error resolves to **deny**. Claude Code hooks fail *open* by default; that
   is the named hazard and it must be engineered against in every path, with tests forcing the error
   states.
4. **Who may invoke.** Only a role that did **not** perform the work. **Flagged as unenforceable for the
   same reason as everything else** — "who did the work" is recorded in a file the doer wrote. Treat
   this as a documented convention, never as a guard, and do not let it appear in an ADR as if it were
   one.

### 5.3 What the fallback still does not do

- It does not stop L2, the failure mode a published checkable precondition actively *invites*.
- It does not give the spawned producer an independent judgment. It gives it a checklist.
- It does not make `CORRECT` mean "done" (ADR-019, X1/X6).

## 6. Recommended regardless: the prepared-move packet (solves W1, touches no gate)

This is the part I would build. It addresses the friction the owner is actually feeling and requires
**no ADR, no hard-rule change, and no reversal.**

A spawned producer may do **100% of the derivation and 0% of the writing**:

- resolve the brief, read its `## Sprint` / `## Parent / Epic`
- run the full step-4 grep across `sprints/`, `sprints/done/`, and the parent epic
- compute **every** edit the mover would make — each status cell, each href repair, the brief's own
  `## Status`, and the outbound sibling-link repairs
- validate every relative link the move would break
- flag every ambiguity the mover would flag (no row found, multiple matches, sprint mismatch)
- emit a **move packet**: the exact file-by-file diff the mover would produce, plus the ambiguities

The owner then reviews a complete, pre-validated packet and fires the real mover. **The human judgment
stays exactly where the gate puts it** — the owner is still deciding *"is this done?"* — but they are no
longer also doing the clerical derivation, and the ambiguities surface *before* the move rather than in
the post-move report.

This is consent model **(a) "agents may prepare, never fire"** from the `fkit-git` design
(`reports/2026-07-18-design-fkit-git-agent-and-consent-model.md:15`), which is now settled precedent via
ADR-023. It keeps this decision **consistent** with the two nearest rulings instead of contradicting
both.

It does **not** eliminate the session switch (the mover is producer-owned and hook-gated). It makes the
switch cheap: the producer session's job becomes *read the packet, confirm, fire.*

## 7. Optional hardening of the status quo (independent of every ruling above)

If the §3.1 test shows the payload distinguishes session from spawn, the gate can move from **prose** to
**structural**: the hook denies `fkit-task-done` / `fkit-task-cancelled` from any *spawned* context
outright. Today the owner-only rule is enforced by SKILL.md text only
(`fkit-task-done/SKILL.md:183-189`) — exactly the prose-only posture ADR-018 rejected elsewhere. This
strengthens the existing decision and needs no ADR. **Worth a task either way.**

## 8. Write surface — the full bounded scope for task 64

Enumerated so task 64 is bounded and the dual-home lesson (tasks 48/49) is not relearned. **The hard
rule has three homes, not two** — verified 2026-07-18:

| # | Path | What changes | Only if |
|---|---|---|---|
| 1 | `claude/scaffold/universal-rules.md:7-8` | **The source of truth** for the hard rule — injected into consuming projects by `claude/fkit-claude-init.sh:322` | relaxation adopted |
| 2 | `CLAUDE.md:55-57` | the dogfooded copy of the same rule | relaxation adopted |
| 3 | `AGENTS.md:42-43` | the third copy (ADR-016 shared-instructions layer) | relaxation adopted |
| 4 | `claude/skills/fkit-task-done/SKILL.md:8-15` (banner), `:26-30` (why-this-exists), `:183-189` (the gated-status rule) | the owner-only wording, in **three** places in one file | relaxation adopted for `done` |
| 5 | `claude/skills/fkit-task-cancelled/SKILL.md:8-15`, `:34`, `:226` | same three-place pattern | relaxation adopted for `cancelled` |
| 6 | `claude/agents/fkit-producer.md:6-7`, `:37`, `:100-101` | the producer's own "never moves task files" contract | relaxation adopted |
| 7 | `claude/agents/fkit-coder.md:145-146` | the coder's "must not move task files" line | relaxation adopted |
| 8 | `claude/scaffold/CLAUDE.md:23` | the role table's *"must not: move task files unprompted"* cell | relaxation adopted |
| 9 | `claude/skill-ownership-hook.sh` | the precondition check (§5.2) + fail-closed error paths | relaxation adopted (§5.2) **or** hardening (§7) |
| 10 | `test/skill-ownership-hook.test.js` | ADR-014 `node --test`: **the refusal path is the highest-care test** | any hook change |
| 11 | `ai-agents/knowledge-base/decisions/` | the reversal/amending ADR (§8.1) | any ruling |
| 12 | `ai-agents/knowledge-base/architecture.md` | wherever the owner-only gate is asserted as a property | relaxation adopted |
| 13 | `ai-agents/wiki-vault/` | **fkit-wiki only**, a separate spawned task once the contract is final — never an architect/coder edit | any ruling |
| 14 | `.claude/agents/`, `.claude/skills/` | gitignored, refreshed by `claude/fkit-claude-init.sh .` — **never hand-edited** | any change to `claude/` |

**Not in scope, and must not drift into it:** `fkit-process-stateful-review` and `fkit-task-ship-loop`.
ADR-019 §Decision 1 keeps the review skill byte-unchanged, and §5 keeps the loop's terminal act an
evidence packet. Neither changes here regardless of the ruling.

### 8.1 What the ADR would have to say

It **amends ADR-019 §Decision 5** ("the done-gate is unchanged and owner-only") and **reverses the
CLAUDE.md universal hard rule.** ADR-019 pre-registered this exact re-raise: *"The owner later wants
relayed-consent close-out — that is a **new** consent-model decision needing its **own** ADR"*
(`adr-019:138`). This is that ADR. It must state, without softening:

1. **What the guarantee was:** a task is marked done only by an act of the human.
2. **What replaces it:** under relaxation, *nothing equivalent* — prevention becomes detection (§5.1).
   **An ADR that claims the guarantee is preserved is false**, and would be the most damaging artifact
   this task could produce.
3. **Why no authenticated precondition was available** (§3), so this is not re-litigated by a future
   design that rediscovers the ledger idea and assumes it works.
4. **The `done`/`cancelled` ruling** (§4) as an explicit line.
5. **Its own "re-raise only if"**, at minimum: *fkit gains an authenticated authorship or attestation
   channel* (which would make a real precondition possible and should reopen this), or *an agent-closed
   task is found to have been incomplete* (evidence the downgrade is costing real quality, not a
   defect — reopen the decision).

If the owner keeps the movers owner-only, an ADR is **still warranted** — a decision record pinning "we
looked for an authenticated precondition, there is none, here is why" so this is not re-litigated a
third time (ADR-019 rev-1 was the first, this is the second).

## 9. For the owner — the rulings this spec asks for

**Q1 — the core reversal. Relax spawned invocation of `/fkit-task-done`, or keep it owner-only?**
Architect recommends **keep it owner-only.** No fabrication-resistant precondition exists (§3); a
relaxation replaces prevention with detection (§5.1). Relaxing is a legitimate choice — but it is a
downgrade, not an equivalent-safety change, and the ADR must say so.

**Q2 — the asymmetry. Same treatment for `done` and `cancelled`, or relax `cancelled` only?**
Architect recommends **neither relaxes** (§4). If exactly one relaxes, `cancelled` is the defensible
one — with a mandatory specific reason and a **distinct board marker** so agent-cancelled never looks
like owner-cancelled.

**Q3 — if Q1 = relax: is the audit marker acceptable as the replacement guarantee?** Agent-closed tasks
would read `✅ Done (agent-closed — not owner-verified)` — permanently distinguishable on the board and
in the brief. This is the whole of what replaces the gate. Acceptable, or not?

**Q4 — if Q1 = relax: who may invoke?** Any spawned role, or only a role that did not do the work?
Note the restriction is **advisory only** — "who did the work" is self-reported (§5.2.4). Ruling on it
is still useful as documented intent; relying on it is not.

**Q5 — build the prepared-move packet (§6) regardless of Q1?** Architect recommends **yes.** It solves
most of the friction (W1), needs no ADR and no rule change, and is consistent with ADR-023's
"prepare, never fire" precedent. It is the answer to the ask that costs nothing.

**Q6 — run the §3.1 payload test and, if positive, harden the current gate from prose to hook (§7)?**
Independent of every other ruling. Architect recommends **yes** — the owner-only rule is currently
prose-only, the posture ADR-018 rejected elsewhere.

### Downstream tasks each ruling spawns

| Ruling | Tasks |
|---|---|
| Q1 = keep owner-only | ADR (decision record, §8.1); task 64 **shrinks to nothing or to §7 hardening only** |
| Q1 = relax | reversal ADR; task 64 as scoped (§8 rows 1–12); wiki-sync (fkit-wiki, separate) |
| Q5 = yes | new task: prepared-move packet in the producer's contract |
| Q6 = yes | new task: payload session/spawn test + hook hardening |

## 10. Adversarial pass — warranted, before owner sign-off

**Yes — I recommend it, and more strongly than the usual precedent.** A Codex pass killed the closest
prior attempt at exactly this relaxation (ADR-019 rev-1). Two specific things should be attacked, and
**this spec's central claim is that the second one cannot be answered** — so a pass that finds a way
would be genuinely valuable, not merely confirmatory:

1. **§5.2's claim that a hook-enforced precondition stops L1** — does it, or does publishing the check
   simply convert L1 into L2?
2. **§3's claim that no unforgeable signal exists** — is there an attestation surface I missed? This is
   the load-bearing negative claim, and a negative claim is exactly what an adversarial pass is for.

If the owner rules **keep owner-only** (Q1), the pass is optional — the conclusion is the conservative
one and nothing is being weakened. **If the owner rules relax, the pass should be mandatory before task
64 starts**, per the brief's own recommendation and the 20/29/39/52 precedent.

## Related

- [ADR-019](../decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) — §Decision 5 (owner-only done-gate), §Options (relayed-consent close-out rejected), `:138` (the pre-registered re-raise this task answers).
- [ADR-023](../decisions/adr-023-fkit-git-agent-is-not-built.md) + [`reports/2026-07-18-design-fkit-git-agent-and-consent-model.md`](2026-07-18-design-fkit-git-agent-and-consent-model.md) — the "prepare, never fire" precedent (§6) and the parallel consent-model analysis.
- [ADR-018](../decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) — the hook, its authenticated `agent_type`, the fail-open hazard, and §Decision 6's rejection of prose-only enforcement.
- [ADR-012](../decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md) / [ADR-021](../decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md) — why a spawned producer has no owner channel.
- [ADR-020](../decisions/adr-020-per-task-plan-and-worklog-artifacts.md) — worklogs are coder-written (§3).
- [ADR-022](../decisions/adr-022-tools-unrestricted-except-adversarial-reviewer.md) — unrestricted tools ⇒ every candidate artifact is agent-writable (§3).
- [ADR-016](../decisions/adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md) — why the hard rule has three homes (§8).
- Code: `claude/skill-ownership-hook.sh:95-136`, `claude/fkit-claude.sh:249-276` (`build_settings()` — no identity env var reaches any script), `claude/fkit-claude-init.sh:322` (universal-rules injection), `ai-agents/reviews/README.md:44-53`.
