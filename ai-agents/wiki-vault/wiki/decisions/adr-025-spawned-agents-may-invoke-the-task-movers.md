# ADR-025: Spawned agents may invoke `/fkit-task-done` and `/fkit-task-cancelled` — the owner-only gate is removed, and the anti-laundering guarantee is removed with it

**Date**: 2026-07-18
**Status**: accepted

> **⚠️ This reverses a universal hard rule.** *"Task files move between `backlog/`, `done/`, `cancelled/` only via the owner-invoked movers"* (`CLAUDE.md:55`, `claude/scaffold/universal-rules.md:6`, `AGENTS.md:41`) **no longer holds**, and it **amends [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] §Decision 5** (the owner-only done-gate). Any wiki page or prose still asserting the owner-only rule is stale.

> **What this ADR decides, in one line:** any spawned agent may now move task files; **nothing prevents a false close-out, and nothing detects one except a marker written by the same agent that performs the move.**

**Pre-registered:** ADR-019's own "re-raise only if" named this exact decision as needing its own ADR. This is that ADR. **The architect's recommendation in the design spec was to keep it owner-only. The owner ruled against the recommendation, knowingly.** Both facts are recorded on purpose.

**Implemented** by task 64 ([[tasks/implement-spawned-invocation-for-task-movers]]), landed 2026-07-19. **This is no longer a decision awaiting build — it is the shipped behaviour.**

## Amendment (2026-07-19, during task 64 implementation)

⚠️ **Read the amendment together with Decision 5 below, not the Decision on its own — they contradict without it.** Three owner-ruled changes, all with the owner present.

**A1 — Decision 5 is reversed for the hook's data source.** The mandatory adversarial pass (Decision 6) found this ADR **self-contradictory**: Decision 2 grants every spawned role the movers, but Decision 5 forbade touching the hook — and `claude/skills-for-role.sh` listed both movers under `producer` only, so `claude/skill-ownership-hook.sh` denied every non-producer call before the relaxed prose was ever read. **As written, Decision 2 could not take effect.** The owner ruled: change the mapping, keep "any role."

- Changed: `claude/skills-for-role.sh` only — the movers added to `lead`, `coder`, `architect`, `reviewer`, `wiki` (`producer` already had them). Verified in the tree 2026-07-19.
- **`claude/skill-ownership-hook.sh` is still unchanged** (verified — no diff), so the *substance* of Decision 5 stands exactly as recorded: **no precondition check, prose-only, nothing verifies that work is actually done.** The honesty clause is untouched.

**A2 — `fkit-adversarial-reviewer` is excluded from the movers** (owner ruling). Decision 2 says "any spawned role"; this is the one exception. Its contract is findings-only, it never edits anything, and it runs on Codex under a restricted allowlist ([[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]). **The exclusion is deliberate — not an oversight and not a bug to fix**; `test/skill-ownership-hook.test.js` pins it as a deny assertion.

**A3 — the agent-closed marker is invisible in `/fkit-status`, and that is accepted.** Decision 3 calls the marker "the entire residual mechanism." The adversarial pass found it does not reach the surface an owner actually reads: `claude/skills/fkit-status/dashboard.sh` matches the **marker prefix**, collapsing `✅ Done (agent-closed — not owner-verified)` to a plain `done`, then filters the row off the open board; the roll-up counts it as an ordinary close. Confirmed against the code. The owner ruled **accept and record**, not fix.

> **So the honesty clause is weaker than it reads.** It says detection is advisory rather than structural. Add: **the advisory signal is also not surfaced.** To tell an agent-closed task from an owner-closed one you must open the sprint plan or the brief — `/fkit-status` will not tell you, and nothing counts how many closes were agent-performed. What remains is a marker in a file that nothing enforces, nothing verifies, and nothing reports.

**Also amended by implication — the ship-loop's terminal act.** [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] sold the loop's autonomy on **two** human gates; this ADR removed one, and task 64 made the loop **close its own task**. The composition — plan approval, then unattended build/review/judge/close — is **L1 at full strength**. The loop's own prose stops short of self-closing a *degraded* run (no Codex pass, red verification, unresolved residual) and never self-cancels; those are **loop-local conservatism, not guarantees this ADR provides**.

## Context

The owner asked that another agent be able to drive the movers by spawning the producer, removing the coder → producer session switch at close-out. The spec split the ask in two: **W1 — remove the session switch** (ergonomics, solvable without touching the gate) and **W2 — remove the owner from the close-out decision** (a guarantee, not solvable).

### The load-bearing finding: no fabrication-resistant precondition exists
Every candidate precondition fails on the same axis — **the requesting agent can write it**:

| Candidate | Forgeable by the requester? |
|---|---|
| Closed review ledger with a passing verdict | **Yes** — the coder owns its ledger section and its verdict cells; nothing binds the reviewer section to an actual reviewer run |
| Worklog evidence (ADR-020) | **Yes**, trivially — `worklogs/` is a coder write target by decision |
| Review-role sign-off | **Yes** — a sign-off line is text; there is no signature channel |
| A `CORRECT` review verdict | **Yes**, and ADR-019 already ruled it insufficient — it certifies a *finding's* accuracy, not that work is done |
| Git commit authorship | Not available (agents are barred from committing), and `user.name` is settable anyway |
| **Hook-payload identity** (`agent_type`) | **No — genuinely authenticated** (ADR-018). But **unusable here**: visible only inside the hook, never to a skill or shipped script, and it answers *"who is calling"*, never *"is this work complete"* |

**The one unforgeable signal in fkit tells you who is asking and nothing about whether the answer should be yes.** Tools are unrestricted (ADR-022) and the `PreToolUse` hook gates the `Skill` tool only — not file writes. An agent asked to prove its work is done can author its own proof.

### Why a spawned producer is not a second judgment
A spawned producer has **no owner channel** — its `⛔ Owner:` banner is advisory (ADR-012) and `AskUserQuestion` is absent (ADR-021). So *"the coder spawns the producer and asks it to mark done"* is functionally **"the coder marks its own work done, with an extra hop in between."** It adds a *role name*, not a *second judgment*.

### The four laundering paths — all four were stopped by the owner-only gate; **none is stopped now**
- **L1 — the confused optimist.** The coder genuinely believes the task is complete but the work misses the brief's intent; the board turns green on the coder's own judgment. **High likelihood — the normal failure, not an exotic one.**
- **L2 — evidence written to satisfy the check.** Medium–high.
- **L3 — relayed consent** ("the owner approved this"), unverifiable by the spawned producer. Medium.
- **L4 — prompt injection / a confused subagent.** Low but demonstrated (ADR-018 §6).

## Decision
1. **The gate is removed for both movers.** `cancelled` is **not** held back as the lower-blast-radius case. The architect's "neither should relax" ruling and the "cancelled only" fallback were both put to the owner and declined.
2. **Any spawned role may invoke them.** The "only a role that did not do the work" restriction is **not** adopted — correctly, since *who did the work* is self-reported in files the doer wrote. **The coder may close its own task.**
3. **Agent-closed moves carry a distinct marker** — `✅ Done (agent-closed — not owner-verified)` and the `cancelled` equivalent — written into the brief and the board. Never visually identical to an owner-closed move. **This marker is the entire residual mechanism.**
4. **Spawned agents do the whole job.** The "prepared-move packet" (agents derive, owner fires) is **not** built.
5. **Prose-only — the hook is not changed.** No precondition check is added. Instead, every SKILL.md and agent-prompt line asserting the owner-only rule is rewritten to match the new reality. ⚠️ **Partly reversed — see A1 above**: the hook's *data source* (`claude/skills-for-role.sh`) had to change or Decision 2 could not take effect. The hook script itself is unchanged, so **"no precondition check, nothing verifies the work is done" still holds.**
6. **An adversarial Codex pass is mandatory before task 64 (implementation) starts.** A Codex pass killed the closest prior attempt at this exact relaxation (ADR-019 rev-1).

### The honesty clause — what replaces the guarantee: nothing equivalent
**The guarantee was:** *a task is marked done only by an act of the human.*
**What replaces it:** *a task marked done by an agent is labelled as such — if the agent follows the prose that tells it to apply the label.*

- **Prevention is gone.** No mechanism stops a false close-out. L1, the most likely failure, is unmitigated.
- **Detection is advisory, not structural.** The marker is written by the mover skill, which is **prose**. The same agent that ignores the prose telling it not to close its own work ignores the prose telling it to label the close. With Decision 5, **no code path can enforce the marker**.
- **Git does not backstop this.** Agents cannot commit, so the commit landing an agent-closed move is authored by the **owner** — git history carries **no authenticated trace** of which moves were agent-performed.

**Therefore: this is not prevention downgraded to detection. It is prevention removed, with a labelling convention in its place.** A legitimate owner choice — the movers are reversible, fkit has one user, the friction was real — recorded this way so no future reader mistakes the marker for a guarantee.

## Consequences
- **Positive:** the close-out session switch is gone; the relaxation removes a rule the system never structurally held (the movers were already prose-only); every move is reversible; and the negative finding — **no authenticated precondition exists in fkit, and why** — is on record for the second time (ADR-019 rev-1 was the first).
- **Negative:** all four laundering paths open, **L1 most of all**; the audit marker is unenforced; **the board can go green without a human ever having looked at the work**, and downstream tasks unblock on that signal, so a false `done` compounds; **`cancelled/` is audited by nobody** — an agent that cannot finish a task can make its own obligation disappear; and **ADR-019's autonomy was sold on two human gates — one is now gone.** The plan-gate is untouched and remains ADR-019's one unremovable checkpoint.
- **Re-raise only if:** fkit gains an **authenticated authorship or attestation channel** (that would make a real precondition possible for the first time and **should reopen this**); an agent-closed task is found incomplete (**evidence the downgrade costs real quality — reopen the ADR, do not patch the skill**); or `cancelled/` accumulates agent-cancelled tasks that should have been done. Do **not** re-raise *"a spawned agent can move a task file"* (that is this decision), *"the marker is only prose"* (stated knowingly — a finding must show it **failing in practice**), or *"a ledger/worklog/sign-off precondition would make this safe"* (evaluated and rejected twice; a new proposal must first show an **unforgeable** signal).

## Related
- [[decisions/adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates]] — **amended** by this ADR; its re-raise pre-registered this decision. The plan-gate is unchanged.
- [[decisions/adr-023-fkit-git-agent-is-not-built]] — the "agents may prepare, never fire" consent model kept for commit/push. **This ADR deliberately diverges** for the task movers; the distinction is blast radius.
- [[decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list]] — the hook and its authenticated `agent_type`; §6 rejected prose-only enforcement, and **this ADR knowingly chooses the posture ADR-018 rejected elsewhere**
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] · [[decisions/adr-021-askuserquestion-is-session-only-absent-in-consults]] — why a spawned producer has no owner channel
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — unrestricted tools, therefore every candidate precondition artifact is agent-writable
- [[systems/role-locked-sessions]] · [[systems/fkit]] · [[tasks/sprint-2-remove-omnigent]]
- [[decisions/adr-024-ship-loop-owner-question-timeout-is-not-built]]
- [[systems/knowledge-base-structure]]
- [[tasks/design-fkit-git-agent-and-consent-model]]
- [[tasks/harden-task-movers-against-closed-sprint-link-rot]]
- [[tasks/implement-pretooluse-skill-ownership-hook]]
- [[tasks/implement-task-ship-loop-skill]]
- [[tasks/enforce-task-status-vocabulary]] — the status vocabulary whose `Done`/`Cancelled` owner-only rule this ADR reverses
- [[tasks/design-spawned-invocation-consent-model-for-task-movers]] — task 63, the design task that produced this ruling (**Done**)
- [[tasks/implement-spawned-invocation-for-task-movers]] — task 64, which **built** this ADR and produced the amendment above (**Done — agent-closed, not owner-verified**)
- [[tasks/implement-task-ship-loop-skill]] — the loop whose terminal act this ADR changed: it now closes its own task
