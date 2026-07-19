# ADR-028: fkit gains an eighth role — a sandboxed e2e-tester — and the "not breadth" constraint is explicitly reversed

- **Status:** accepted
- **Date:** 2026-07-19
- **Deciders:** owner (Mark Dolbyrev), recorded by fkit-architect
- **Evidence:** [`reports/2026-07-13-tester-agent-evaluation.md`](../reports/2026-07-13-tester-agent-evaluation.md)
  — the full discussion (owner, fkit-coder, fkit-architect, fkit-producer), including the five arguments
  that were examined and **killed** and must not be re-raised.
- **Task:** [`decide-whether-fkit-needs-a-tester-agent.md`](../../tasks/done/decide-whether-fkit-needs-a-tester-agent.md)

> **What this ADR decides, in one line:** fkit adds an **eighth role, a tester**, whose unique authority
> is a **sandbox** authority — a permission envelope no other role gets — and the owner **knowingly
> reverses** his own "seven roles, not breadth" constraint to allow it.

## Context

Sprint 2's release gate (task 7) forced fkit-coder to verify its own work. It could not credibly do so
and split verification into a mechanical phase (itself) and a judgment phase (the owner, by hand). That
split was ad hoc, and it exposed a structural gap:

**fkit has two roles that READ code and zero that RUN it. Every review is static.** The reviewer already
admits this in its own output vocabulary — `claude/skills/fkit-review/SKILL.md:113` emits
*"(validation-gated)"*, meaning *"I read this and it looks right, but somebody has to actually run it."*
And `claude/agents/fkit-coder.md:112-113` makes "did you test it?" a pure **self-report** — the same
*agent-greens-its-own-board* failure the project already guards against by gating `Done`/`Cancelled`
behind owner-invoked skills.

The framing that matters: fkit is being designed **as a product used on other projects**, not for its own
repo. fkit's own e2e is deterministic shell; a consuming project's is driving a real app and judging it.
**fkit is not a representative fkit user**, and reasoning from its own needs generalizes wrongly.

### The recommendation this ruling went against

**fkit-architect and fkit-producer both recommended AGAINST an eighth role**, proposing a reviewer-owned
`/fkit-validate` capability instead, on the grounds that *roles are authority boundaries, not activities*
(`PROJECT.md:18-24`) and a tester adds no authority. **The owner ruled against that recommendation, on
the record.** It is not an override of the architect's principle, though — see below.

### What makes the ruling coherent rather than an override

The evaluation named exactly one argument that beats the architect's, and beats it cleanly:

> **Sandbox-authority divergence.** If validation needs a **permission envelope you would not grant the
> reviewer** — network-enabled, write-enabled, running an untrusted app — then the tester **does** hold a
> unique authority (a *sandbox* authority), and by the architect's own authority argument **it earns a
> seat.**

The owner's scope ruling (Q3) triggers precisely that condition: the tester runs terminal commands, drives
a browser, and controls native apps, using built-in Claude Code tools, **deliberately unhardened and
unlimited** — *"the tester should figure out what they need to test, when they do testing."* That is an
envelope no other role gets. **The flip condition fired; the seat is earned on the architect's own
criterion.**

## Decision

1. **fkit gains an eighth role: a tester.** A real seat, invoked directly (`fkit tester`) — not a
   capability folded into review. The owner wants to *talk to* it.
2. **Its authority is sandbox authority**, and the ADR names it as such: the tester holds a permission
   envelope that would not be granted to the reviewer. This is the boundary that earns the seat, and it
   is the only justification recorded here — do not later re-derive the seat from "testing is a different
   activity," which was killed in the evaluation.
3. **Scope is broad by design and unhardened by design.** Terminal commands, browser, native apps —
   whatever the target needs. **No special scripts, no capability allowlist, no tool restriction.**
   Built-in Claude Code tools are sufficient; the tester determines what it needs at testing time.
4. **The tester is read-only with respect to source. It writes no code.** fkit-coder's **sole
   source-write authority is preserved intact and unamended** (source includes test code). The tester
   drives, observes, judges and **reports**; any fix or committed test is the coder's work, exactly as
   fkit-reviewer already operates. *(The gitignored ephemeral-driver carve-out floated in the evaluation
   was offered and **not** taken — see Consequences.)*
5. **`.fkit/validate` is dropped.** No pluggability hook, no plugin contract, nothing for a consuming
   project to install. Decision 3 dissolves it: the tester improvises from the project itself. The
   `curl | sh` promise is preserved.
6. **The "seven roles, not breadth" constraint is explicitly reversed**, not drifted past. `PROJECT.md:71-72`
   currently reads *"Stage: Prototype … a solid working set of **seven** roles … hardening/polish is the
   current focus, **not breadth**"*, and `PROJECT.md:8` says *"a team of **seven** role-scoped AI agents."*
   **Both are now false and must be amended** — see "Required follow-ups". The owner superseded his own
   constraint knowingly, for this seat, on this reasoning.
7. **Sequencing: fkit's own regression gate goes first** — *"it's the bigger risk and it's cheap — full
   stop, not as an experiment."* It is **not** a probe for this decision and must not be treated as one.
   **Verified 2026-07-19, and the picture is better than the ruling assumed:** the task the owner
   sequenced against, `add-e2e-smoke-script-for-fkit-itself.md`, is **cancelled** — superseded on
   2026-07-14 by **Sprint 2 task 23** (`add-launcher-contract-smoke-script.md`), which is **Done**. So the
   bulk of this prerequisite has already shipped.
   **What remains of it is small and already owned elsewhere:** wiring `prove-red.sh` into an automated
   gate ([ADR-026](adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled.md) Decision 4 — still
   a producer-scoped brief), and the absence of any `.github/workflows/` in the tree
   ([ADR-003](adr-003-ci-runs-validate-bundles.md)'s posture is unrealized). **Those two are the actual
   gate the tester waits behind**, not a cancelled task.

## Options considered

- **Eighth seat, sandbox authority (chosen).** Earns its seat on the architect's own authority criterion
  via the fired flip condition. Costs breadth at prototype stage, on a demand hypothesis.
- **`/fkit-validate` capability on the reviewer.** The architect's and producer's recommendation.
  Rejected by the owner: he wants a seat he can talk to, and folding an unhardened sandbox envelope into
  the reviewer would have quietly widened the *reviewer's* authority — the very conflation the seat
  avoids.
- **Close the question, build nothing.** Rejected: the hole is real, observed, and admitted by the
  reviewer's own output vocabulary.
- **Full write authority for the tester.** Rejected (Decision 4): it would break the sole-source-write
  invariant, which would need its own explicit reversal. One constraint reversal in this ADR, not two.

## Consequences

- **Positive:**
  - **The static-review gap closes.** fkit gains its first role that actually runs the thing.
  - **"Did you test it?" stops resting on the implementer's self-report** — the same separation that
    makes the reviewer worth having.
  - **The authority model survives intact.** The seat is justified by a permission boundary, not by an
    activity, so ADR-precedent about roles-as-authorities is not weakened.
  - **The coder's sole-source-write invariant is untouched**, so the new seat adds no write surface.
  - **Nothing to install in consuming projects** (Decision 5).

- **Negative / costs — stated plainly:**
  - **This is breadth at prototype stage, and the owner's own constraint said don't.** Reversed knowingly,
    but the cost is real: an eighth agent definition, its own skills, a skill-lockdown entry, launcher
    wiring, and dual-home scaffold work — all before the existing seven are hardened.
  - **The demand case is a hypothesis, and the owner confirmed it (Q2): fkit is used on no other project
    today.** This seat is being built for users who do not yet exist, judged against a hole observed in
    fkit's *own* repo — the very repo the evaluation says is unrepresentative. **This is the weakest part
    of the ruling and it should be time-boxed as a hypothesis, not treated as validated demand.**
  - **A deliberately unhardened, network- and write-enabled agent that runs untrusted code is a real
    security surface**, and Decision 3 declines to bound it. That is the point of the seat — but it is
    also the largest new risk fkit has taken on, and it sits at odds with the posture of
    [ADR-022](adr-022-tools-unrestricted-except-adversarial-reviewer.md), where the one *surviving*
    structural tool wall exists because unrestricted tools were judged unacceptable for one role.
  - **The tester cannot verify the role lock.** Per
    [ADR-012](adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md), a spawned subagent
    inherits the caller's skill overrides, so the tester is structurally unable to test fkit's own
    session lockdown. Do not scope it to.
  - **No ephemeral-driver carve-out was granted** (Decision 4). If driving a real app turns out to require
    writing a throwaway script, the tester will be blocked and the invariant will need revisiting.
    Recorded as offered-and-not-taken, not rejected on merit.

- **Residual risks / "re-raise only if":**
  - **The tester proves unable to do useful work read-only** — i.e. driving a real app genuinely requires
    writing files. Then Decision 4's carve-out returns as its own decision, with the source-write
    invariant restated explicitly rather than eroded in practice.
  - **The unhardened envelope causes real harm** (data loss, credential exposure, an escaped process) on a
    consuming project. Then Decision 3 is reopened and the envelope gets bounded. **Do not** pre-emptively
    harden it before that evidence — that is this ADR's ruling, deliberately.
  - **fkit is used on real projects and the tester goes unused, or is used and adds nothing.** That is the
    hypothesis in the Negative section failing, and it should retire the seat rather than grow it.
  - Do **not** re-raise the five arguments the evaluation examined and killed: *"it's thin for a whole
    role"*, *"the coder writing its own tests is self-certification"*, *"new tools need a new seat"*,
    *"isn't this the adversarial reviewer?"*, *"testing feels like a different job"*.
  - Do **not** re-raise *"an eighth role violates the not-breadth constraint"* — weighed here and
    explicitly reversed (Decision 6).
  - Do **not** re-raise *"a reviewer-owned `/fkit-validate` would be cheaper"* — that was the
    recommendation, it was put to the owner, and it was declined with reasons.

## Required follow-ups — none of them authorized by this ADR

1. **Amend `PROJECT.md`** — `:8` ("seven role-scoped AI agents") and `:71-72` (the "not breadth"
   constraint). Leaving them is exactly the drift the task brief warned about. *(Owner's or producer's
   call — the brief is the product document, not the architect's.)*
2. **The seven→eight ripple is already enumerated — do not re-derive it.**
   [`reports/2026-07-18-design-fkit-git-agent-and-consent-model.md:67-77`](../reports/2026-07-18-design-fkit-git-agent-and-consent-model.md)
   carries the full table of every place the agent count and roster are asserted, built for the *git
   agent* question that [ADR-023](adr-023-fkit-git-agent-is-not-built.md) declined. **That work is
   directly reusable here** — the ripple is identical, only the eighth role differs. Verified 2026-07-19
   the same claims are still live: `CLAUDE.md:7`, `AGENTS.md:7`, `PROJECT.md:8,:72`,
   `architecture.md:4,:82`, `README.md:76`, `claude/README.md:3`, and a **hard-coded literal** in
   `claude/fkit-claude-init.sh:847` (*"Seven roles, each a locked session"*) — the last being code, not
   prose, and the one most likely to be missed.
   **Also stale, and not the architect's to fix:** `wiki-vault/index.md:11` and
   `wiki-vault/wiki/systems/fkit.md:7,:15` assert the seven-role team. **fkit-wiki** must resync those.
   **ADR-023 itself is not superseded** — it declined a *git* agent on its own reasoning, and Decision 3
   there ("the team stays seven role-scoped agents") is a consequence of that ruling, not an independent
   constraint. It should carry a pointer to this ADR so the count claim is not read as still current.
3. **Producer-scoped briefs** for the tester's agent definition, its skills, `skills_for_role()` in
   `claude/fkit-claude.sh`, and scaffold dual-homing — **after** the CI smoke script (Decision 7).
4. **B1 — the bare-subagent investigation** from the task's Dependents is now live: Q1 landed on *seat*,
   so it is no longer moot. Worth running **before** building the seat, to learn whether a plain subagent
   with these tools can actually drive and judge an app.
5. **fkit-wiki should ingest this ADR.** An architect never writes the vault.

## Related

- [`reports/2026-07-13-tester-agent-evaluation.md`](../reports/2026-07-13-tester-agent-evaluation.md) —
  the underlying record: the question, the observed hole, the killed arguments, the flip condition.
- [ADR-022](adr-022-tools-unrestricted-except-adversarial-reviewer.md) — the tool-restriction posture this
  seat's unhardened envelope sits in tension with.
- [ADR-012](adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md) — why the tester cannot
  verify fkit's own session lockdown.
- [`architecture.md`](../architecture.md) §9.1 — zero automated verification, the top structural risk.
  **Not evidence for a role question**, per the evaluation; listed so it is not misused as such.
- `claude/skills/fkit-review/SKILL.md:113` — the reviewer's `(validation-gated)` marker, the hole admitted
  in the reviewer's own vocabulary.
- `claude/agents/fkit-coder.md:112-113` — "did you test it?" as pure self-report.
- [`tasks/done/add-launcher-contract-smoke-script.md`](../../tasks/done/add-launcher-contract-smoke-script.md)
  — Sprint 2 task 23, **Done**: the regression gate the owner sequenced ahead of the tester, already
  shipped. It superseded `add-e2e-smoke-script-for-fkit-itself.md`
  ([cancelled](../../tasks/cancelled/add-e2e-smoke-script-for-fkit-itself.md) 2026-07-14), which is the
  task named in the evaluation and in the owner's Q7 framing.
- [ADR-026](adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled.md) Decision 4 and
  [ADR-003](adr-003-ci-runs-validate-bundles.md) — the two unfinished pieces of that gate.
