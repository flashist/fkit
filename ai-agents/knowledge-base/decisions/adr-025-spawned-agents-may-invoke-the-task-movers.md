# ADR-025: Spawned agents may invoke `/fkit-task-done` and `/fkit-task-cancelled` — the owner-only gate is removed, and the anti-laundering guarantee is removed with it

- **Status:** accepted
- **Date:** 2026-07-18
- **Deciders:** owner (Mark Dolbyrev), with fkit-architect
- **Reverses:** the universal hard rule *"Task files move between `backlog/`, `done/`, `cancelled/`
  only via the owner-invoked `/fkit-task-done` / `/fkit-task-cancelled`"* (`CLAUDE.md:55`,
  `claude/scaffold/universal-rules.md:6`, `AGENTS.md:41`) and **amends
  [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) §Decision 5**
  (`adr-019:97` — *"the done-gate is unchanged and owner-only"*).
- **Pre-registered:** ADR-019's own "re-raise only if" named this exact decision — *"The owner later
  wants relayed-consent close-out (loop-triggered task-done) — that is a **new** consent-model decision
  needing its **own** ADR; do not settle it implicitly here."* **This is that ADR.**
- **Evidence:** [`reports/2026-07-18-design-spawned-invocation-consent-model-for-task-movers.md`](../reports/2026-07-18-design-spawned-invocation-consent-model-for-task-movers.md)
  (task 63). The architect's recommendation in that report was **keep it owner-only**. **The owner
  ruled against the recommendation, knowingly.** Both facts are recorded here on purpose.

> **What this ADR decides, in one line:** any spawned agent may now move task files; **nothing prevents
> a false close-out, and nothing detects one except a marker written by the same agent that performs
> the move.**

## Amendment (2026-07-19, during task 64 implementation)

Three changes, all owner-ruled with the owner present. **Decision 5 below is partly reversed** — read
it together with this block, not on its own.

**A1 — Decision 5 is reversed for the hook's data source.** The mandatory adversarial pass (Decision 6)
found this ADR **self-contradictory**: Decision 2 grants every spawned role the movers, but Decision 5
forbids touching the hook — and `claude/skills-for-role.sh` listed both movers under `producer` only,
so `claude/skill-ownership-hook.sh` denied every non-producer call before the relaxed prose was ever
read. **As written, Decision 2 could not take effect.** Verified against the code before acting, not
taken on the reviewer's word. The owner ruled: **change the mapping, keep "any role."**

- What changed: `claude/skills-for-role.sh` only — the movers were added to `lead`, `coder`,
  `architect`, `reviewer`, `wiki` (`producer` already had them).
- **`claude/skill-ownership-hook.sh` itself is still unchanged**, so the *substance* of Decision 5 —
  **no precondition check, prose-only, nothing verifies that work is actually done** — stands exactly
  as recorded. The honesty clause is untouched.

**A2 — `fkit-adversarial-reviewer` is excluded from the movers** (owner ruling). Decision 2 says "any
spawned role"; this is the one exception. Its contract is findings-only, it never edits anything, and it
runs on Codex under a restricted allowlist (ADR-022). **The exclusion is deliberate — not an
oversight, and not a bug to fix.** `test/skill-ownership-hook.test.js` pins it as a deny assertion.

**A3 — the audit marker is invisible in `/fkit-status`, and that is accepted.** Decision 3 calls the
marker "the entire residual mechanism." The adversarial pass found it does not reach the surface an
owner actually reads: `claude/skills/fkit-status/dashboard.sh` matches the **marker prefix**, collapsing
`✅ Done (agent-closed — not owner-verified)` to plain `done`, then filters the row off the open board;
the roll-up counts it as an ordinary close. Confirmed against the code. The owner ruled **accept and
record**, not fix.

> **So the honesty clause is weaker than it reads.** It says detection is advisory rather than
> structural. Add: **the advisory signal is also not surfaced.** To tell an agent-closed task from an
> owner-closed one you must open the sprint plan or the brief — `/fkit-status` will not tell you, and
> nothing counts how many closes were agent-performed. What remains is a marker in a file that nothing
> enforces, nothing verifies, and nothing reports.

**Also amended by implication: the ship-loop's terminal act.** ADR-019 sold the loop's autonomy on two
human gates; this ADR removed one, and task 64 made the loop close its own task (owner ruling). The
composition — plan approval, then unattended build/review/judge/close — is **L1 at full strength**. The
loop's own prose now stops short of self-closing a *degraded* run (no Codex pass, red verification,
unresolved residual) and never self-cancels; those are loop-local conservatism, **not** guarantees this
ADR provides.

## Context

The owner asked that another agent be able to drive the task movers by spawning the producer, removing
the coder → producer session switch at close-out. The design spec decomposed the ask into two separable
wants (§1):

| | Want | Kind of problem |
|---|---|---|
| **W1** | Remove the **session switch** at close-out | **Ergonomics.** Solvable without touching the gate. |
| **W2** | Remove the **owner** from the close-out decision | **Guarantee.** Not solvable. |

### The load-bearing finding: no fabrication-resistant precondition exists

The brief asked for a precondition that would make spawned invocation safe. **Every candidate fails on
the same axis — the requesting agent can write it.** Verified against project state (§3):

| Candidate | Forgeable by the requester? |
|---|---|
| Closed review ledger with a passing verdict | **Yes** — the coder owns the *Coder response* section and its verdict cells (`ai-agents/reviews/README.md:44-53,74-79`); nothing binds the *Reviewer findings* section to an actual reviewer run |
| Worklog evidence (ADR-020) | **Yes**, trivially — ADR-020 Decision 3 names `worklogs/` a coder write target |
| Review-role sign-off | **Yes** — a sign-off line is text; there is no signature and no attestation channel |
| A `CORRECT` review verdict | **Yes**, and ADR-019 already ruled it insufficient on separate grounds — it certifies a *finding's accuracy*, not that the work is done |
| Git commit authorship | Not available (agents are barred from committing) and `user.name` is settable anyway |
| **Hook-payload identity** (`agent_type`) | **No — genuinely authenticated** (ADR-018). But **unusable here**: visible only inside `claude/skill-ownership-hook.sh`, never to a skill or shipped script (`build_settings()` passes no identity env var to anything but the hook), and it answers *"who is calling"*, never *"is this work complete"* |

**The one genuinely unforgeable signal in fkit tells you who is asking and nothing about whether the
answer should be yes.** Under [ADR-022](adr-022-tools-unrestricted-except-adversarial-reviewer.md) tool
allowlists are unrestricted for every role but the adversarial reviewer, and the `PreToolUse` hook gates
the **`Skill` tool only** (`claude/skill-ownership-hook.sh:95-98`) — not file writes. An agent asked to
prove its work is done can author its own proof.

This is [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) rev-1's problem
wearing new clothes. That design died on *no runtime-authenticated signal for "loop context."* This one
dies on the sibling fact: **fkit has no authenticated authorship.**

### Why a spawned producer is not a second judgment

A producer spawned as a consult has **no owner channel** — its `⛔ Owner:` banner is advisory
([ADR-012](adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md)) and `AskUserQuestion` is
absent ([ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md)). So *"the coder spawns
the producer and asks it to mark done"* is functionally **"the coder marks its own work done, with an
extra hop in between."** The spawned producer adds a *role name* to the transaction, not a *second
judgment*.

### The four laundering paths, and what now stops them

| # | Path | Likelihood | Stopped after this ADR? |
|---|---|---|---|
| **L1** | **The confused optimist** — the coder genuinely believes the task is complete but the work misses the brief's intent; the board turns green on the coder's own judgment | **High — the normal failure, not an exotic one** | ❌ **No** |
| **L2** | **Evidence written to satisfy the check** — the agent works backwards from a published precondition and writes it into the passing state | Medium–high | ❌ No (no precondition is published) |
| **L3** | **Relayed consent** — "the owner approved this," unverifiable by the spawned producer | Medium | ❌ No |
| **L4** | **Prompt injection / a confused subagent** — ADR-018 §Decision 6 records this as live and demonstrated | Low but demonstrated | ❌ No |

All four were stopped by the owner-only gate. **None is stopped now.**

## Decision

**Spawned agents may invoke `/fkit-task-done` and `/fkit-task-cancelled`.** Concretely, per the owner's
rulings of 2026-07-18:

1. **The gate is removed for both movers** (Q1 = relax; Q2 = relax **both**). `cancelled` is **not**
   held back as the lower-blast-radius case. The architect's ruling that neither should relax, and the
   fallback that `cancelled` alone was the defensible one, were both put to the owner and declined.
2. **Any spawned role may invoke them** (Q4). The "only a role that did not do the work" restriction is
   **not** adopted — correctly, since it was never enforceable: *who did the work* is self-reported in
   files the doer wrote. **The coder may close its own task.**
3. **Agent-closed moves carry a distinct marker** (Q3). An agent-performed close-out writes
   `✅ Done (agent-closed — not owner-verified)` — and the `cancelled` equivalent — into the brief and
   the board. It must **never** be visually identical to an owner-closed move. **This marker is the
   entire residual mechanism.** See the honesty clause below.
4. **Spawned agents do the whole job** (Q5). The "prepared-move packet" (agents derive, owner fires) is
   **not** built; the owner ruled that spawned agents do all the work, derivation *and* writing. The
   packet is therefore moot as a gate-preserving device and is **not** carried forward as a task.
5. **Prose-only. The hook is not changed** (Q6/Q6b). No precondition check is added to
   `claude/skill-ownership-hook.sh`, and the §7 session-vs-spawn hardening is **not** pursued. Instead,
   **every SKILL.md and agent-prompt line asserting the owner-only rule is rewritten to match the new
   reality** — the owner's instruction was that prose contradicting the decision gets corrected, not
   that the gate gets re-enforced elsewhere.
6. **An adversarial Codex pass is mandatory before task 64 starts** (Q7). A Codex pass killed the
   closest prior attempt at this exact relaxation (ADR-019 rev-1). Two claims should be attacked: that
   no unforgeable signal exists (§3 — a load-bearing *negative* claim), and whether removing the gate
   has second-order effects on the ship-loop's terminal act.

### The honesty clause — what replaces the guarantee: nothing equivalent

**The guarantee was:** *a task is marked done only by an act of the human.*

**What replaces it:** *a task marked done by an agent is labelled as such — if the agent follows the
prose that tells it to apply the label.*

This ADR states plainly, because the design spec required that it not be softened (§8.1.2 — *"An ADR
that claims the guarantee is preserved is false, and would be the most damaging artifact this task
could produce"*):

- **Prevention is gone.** No mechanism stops a false close-out. L1 — the most likely failure — is
  unmitigated.
- **Detection is advisory, not structural.** The audit marker is written by the mover skill, which is
  **prose**. The same agent that ignores the prose telling it not to close its own work ignores the
  prose telling it to label the close as agent-performed. With Decision 5 (prose-only, no hook), there
  is **no code path that can enforce the marker**.
- **Git does not backstop this.** Agents are barred from committing; the owner commits. So the commit
  that lands an agent-closed move is authored by the **owner**, and git history carries **no
  authenticated trace** of which moves were agent-performed. The marker text in the file is the only
  trace, and it is unenforced.

**Therefore: this is not prevention downgraded to detection. It is prevention removed, with a labelling
convention in its place.** That is a legitimate thing for the owner to choose — the movers are
reversible (move the file back), fkit currently has one user, and the friction was real. It is recorded
this way so that no future reader mistakes the marker for a guarantee.

## Options considered

- **Relax both movers, any role, prose-only, distinct marker (chosen).** Delivers exactly the ergonomics
  the owner asked for at the lowest machinery cost. Accepts that all four laundering paths are open.
- **Keep both owner-only (the architect's recommendation).** Preserves the guarantee intact. Rejected by
  the owner: the close-out session switch is friction he is unwilling to keep paying, and he judged the
  laundering risk acceptable for a single-user prototype with reversible moves.
- **Relax `cancelled` only.** The defensible one-way experiment — lower payoff for a launderer, fully
  reversible, exercises the mechanism honestly. Rejected: the owner wanted the friction gone from both
  paths, and a half-relaxation leaves the `done` session switch in place, which is where the friction
  actually is.
- **Relax, but with a hook-enforced precondition** (§5.2). Would stop **L1**, the most likely path, by
  denying a mover call unless required artifacts are in the passing state. Rejected on cost (Q6b): it is
  hook work plus fail-closed error-path tests, and the owner chose the prose-only route. **Note the
  spec's own caveat:** it would not stop L2, and publishing a checkable precondition actively converts
  L1 into L2 by giving the requester a documented target.
- **The prepared-move packet — agents derive, owner fires** (§6). Solved W1 (the real friction) with no
  ADR, no rule change, and consistency with ADR-023's "prepare, never fire" precedent. Rejected: the
  owner wanted spawned agents to do all the work, not to hand him a packet to fire.

## Consequences

- **Positive:**
  - **The close-out session switch is gone.** A coder session can finish a task end to end, which is the
    workflow the owner asked for and the friction that motivated the whole task.
  - **Consistent with what fkit actually enforces.** The old rule was already prose-only at the mover
    (`fkit-task-done/SKILL.md:183-189`); the relaxation removes a rule the system never structurally
    held, rather than pretending it did.
  - **Reversible.** A wrongly-moved task file is moved back. Nothing here is destructive.
  - **The negative finding is on record** — no authenticated precondition exists in fkit, and *why*
    (§3). This is the second time the ledger/worklog/sign-off idea has been proposed and killed
    (ADR-019 rev-1 was the first). It should not need a third investigation.

- **Negative / costs:**
  - **All four laundering paths (L1–L4) are open, L1 most of all.** Accepted, unmitigated.
  - **The audit marker is unenforced** — same prose layer as the rule it replaces (honesty clause).
  - **The board can now go green without a human ever having looked at the work.** Downstream tasks
    unblock on that signal, so a false `done` compounds.
  - **`cancelled/` is audited by nobody.** An agent that cannot finish a task can now make its own
    obligation disappear, and the detection rate for that is close to zero — the reason the spec
    recommended against relaxing `cancelled` even as the "safer" one.
  - **ADR-019 §Decision 5 is amended, and the ship-loop's terminal act is now weaker than that ADR
    described.** ADR-019 sold autonomy on the strength of two human gates; **one of them is now gone.**
    The plan-gate is untouched and remains ADR-019's one unremovable checkpoint.

- **Residual risks / "re-raise only if":**
  - **fkit gains an authenticated authorship or attestation channel** — e.g. a `PreToolUse` payload
    surface exposed to skills, signed artifacts, or harness-verified role identity reaching a script.
    That would make a real precondition possible for the first time and **should reopen this decision**,
    since the whole relaxation rests on the fact that none exists.
  - **An agent-closed task is found to have been incomplete.** That is **evidence the downgrade is
    costing real quality — not a defect to file against the mover.** Reopen this ADR; do not patch the
    skill.
  - **`cancelled/` accumulates agent-cancelled tasks that should have been done.** The disposal path is
    the un-audited one; a spot-check finding this is a trigger.
  - Do **not** re-raise *"a spawned agent can move a task file"* — **that is this decision.**
  - Do **not** re-raise *"the audit marker is only prose"* — stated here, knowingly, in the honesty
    clause. A finding must show the marker **failing in practice**, not restate its known limit.
  - Do **not** re-raise *"a ledger / worklog / sign-off precondition would make this safe."* Evaluated
    twice and rejected twice (§3, and ADR-019 rev-1). A new proposal must first show an **unforgeable**
    signal.

## Related

- [`reports/2026-07-18-design-spawned-invocation-consent-model-for-task-movers.md`](../reports/2026-07-18-design-spawned-invocation-consent-model-for-task-movers.md)
  — the design spec: §2 threat model (L1–L4), §3 the forgeability table, §4 the `done`/`cancelled`
  asymmetry, §5 the least-bad relaxation shape, §6 the prepared-move packet, §8 the full write surface
  for task 64, §9 the six rulings this ADR answers.
- [ADR-019](adr-019-autonomous-coder-ship-loop-default-autonomy-owner-gates.md) — **amended** by this
  ADR (§Decision 5, `:97`). Its `:143` re-raise pre-registered this decision. The **plan-gate is
  unchanged.**
- [ADR-023](adr-023-fkit-git-agent-is-not-built.md) — the "agents may prepare, never fire" consent model
  chosen for commit/push. **This ADR deliberately diverges from that precedent** for the task movers:
  commit/push stays owner-only, task moves do not. The distinction is blast radius — a bad push is
  public and hard to reverse; a bad task move is a file rename in a working tree.
- [ADR-018](adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md) — the
  hook, its authenticated `agent_type`, and §Decision 6's rejection of prose-only enforcement. **This
  ADR knowingly chooses the posture ADR-018 rejected elsewhere** (Decision 5, prose-only) — recorded as
  a divergence, not an oversight.
- [ADR-012](adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md) /
  [ADR-021](adr-021-askuserquestion-is-session-only-absent-in-consults.md) — why a spawned producer has
  no owner channel.
- [ADR-022](adr-022-tools-unrestricted-except-adversarial-reviewer.md) — unrestricted tools, therefore
  every candidate precondition artifact is agent-writable.
- [ADR-016](adr-016-claude-md-and-agents-md-are-the-shared-instructions-layer.md) — why the hard rule
  has **three** homes that must all change: `claude/scaffold/universal-rules.md:6`, `CLAUDE.md:55`,
  `AGENTS.md:41`.
- Code, verified 2026-07-18: `claude/skill-ownership-hook.sh:95-98` (gates the `Skill` tool only);
  `claude/skills/fkit-task-done/SKILL.md:183-189` (the owner-only rule, prose); `claude/scaffold/CLAUDE.md:23`
  (the producer's *"move task files unprompted"* cell); `ai-agents/reviews/README.md:44-53` (the coder
  owns its ledger section).
- **Task 64** (`implement-spawned-invocation-for-task-movers.md`) is unblocked by this ADR, **subject to
  the mandatory adversarial pass** (Decision 6). Its bounded write surface is the spec's §8 rows 1–12,
  minus row 9 (no hook change, per Decision 5).
- **Wiki:** `ai-agents/wiki-vault/` pages asserting the owner-only mover rule are now stale.
  **fkit-wiki** should ingest this ADR — an architect never writes the vault.
