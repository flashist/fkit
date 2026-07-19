# ADR-028: fkit gains an eighth role — a sandboxed e2e-tester — and "not breadth" is explicitly reversed

**Date**: 2026-07-19
**Status**: accepted

> ⚠️ **Decided, not built.** As of 2026-07-19 `claude/agents/` holds **seven** files. This ADR authorizes an eighth seat; no agent file, skill dir, `skills-for-role.sh` entry, hook coverage or launcher wiring exists yet, and Decision 7 sequences all of it behind an unfinished CI gate. **Do not read this page as "fkit has eight roles."**

## Context
fkit has **two roles that READ code and zero that RUN it — every review is static.** The reviewer admits the hole in its own output vocabulary: `claude/skills/fkit-review/SKILL.md:113` emits **`(validation-gated)`**, meaning *"I read this and it looks right, but somebody has to actually run it."* And `claude/agents/fkit-coder.md:112-113` makes *"did you test it?"* a pure **self-report** — the same *agent-greens-its-own-board* failure the project guards against elsewhere.

The gap was observed, not theorized: Sprint 2's release gate (task 7, [[tasks/verify-onboarding-flow-end-to-end]]) forced the coder to verify its own work; it could not credibly do so and split verification into a mechanical phase (itself) and a judgment phase (the owner, by hand).

**The framing that decides the question:** fkit is designed **as a product used on other projects**. fkit's own e2e is deterministic shell; a consuming project's is driving a real app and judging it. **fkit is not a representative fkit user**, and reasoning from its own repo generalizes wrongly.

### The ruling went against the architect's and producer's recommendation
**Both recommended AGAINST an eighth role**, proposing a reviewer-owned `/fkit-validate` capability instead, on the grounds that **roles are authority boundaries, not activities** (`PROJECT.md:18-24`) and a tester adds no authority. The architect's proof was a fork: a tester that *writes test code* creates a second source-write authority (catastrophic); a tester that *only executes* holds no authority at all (a skill wearing a seat). **Either branch → no role.** **The owner ruled against that recommendation, on the record.**

### Why it is coherent rather than an override
The evaluation pre-registered exactly one argument that beats the architect's — and it **fired**:

> **Sandbox-authority divergence.** If validation needs a **permission envelope you would not grant the reviewer** — network-enabled, write-enabled, running an untrusted app — then the tester **does** hold a unique authority (a *sandbox* authority), and by the architect's own criterion **it earns a seat.**

The owner's scope ruling (Q3) triggers precisely that condition. **The seat is earned on the architect's own criterion**, not over its objection.

## Decision
1. **fkit gains an eighth role: a tester.** A real seat, invoked directly (`fkit tester`) — not a capability folded into review. The owner wants to *talk to* it.
2. **Its authority is sandbox authority**, and that is **the only recorded justification**. Do not later re-derive the seat from *"testing is a different activity"* — that argument was killed.
3. **Scope is broad and unhardened by design.** Terminal, browser, native apps. **No allowlist, no tool restriction, no special scripts** — built-in Claude Code tools; the tester decides what it needs at testing time.
4. **The tester is read-only with respect to source.** The coder's **sole source-write authority is preserved intact and unamended** (source includes test code). The tester drives, observes, judges and **reports**. The gitignored ephemeral-driver carve-out was **offered and not taken**.
5. **`.fkit/validate` is dropped** — no pluggability hook, nothing for a consuming project to install. The `curl | sh` promise is preserved.
6. **The "seven roles, not breadth" constraint is explicitly REVERSED**, not drifted past. `PROJECT.md:8` and `:71-72` **are now false and must be amended.**
7. **Sequencing: fkit's own regression gate goes first** — *"the bigger risk and it's cheap — full stop, not as an experiment."* **It is not a probe for this decision.**

## Consequences
- **Positive:** the static-review gap closes; *"did you test it?"* stops resting on the implementer's self-report; **the authority model survives intact** (the seat rests on a permission boundary, not an activity); the coder's write invariant is untouched; nothing to install in consuming projects.
- **Negative — stated plainly, not softened:**
  - **This is breadth at prototype stage and the owner's own constraint said don't.** Reversed knowingly; the cost is an eighth agent definition, its skills, a lockdown entry, launcher wiring and dual-home scaffold work — **all before the existing seven are hardened**.
  - **The demand case is a hypothesis. The owner confirmed (Q2) fkit is used on no other project today.** The seat is being built for users who do not yet exist, judged against a hole in the very repo the evaluation calls unrepresentative. **The ADR names this as its own weakest part and asks for it to be time-boxed as a hypothesis, not treated as validated demand.**
  - **A deliberately unhardened, network- and write-enabled agent that runs untrusted code is a real security surface**, and Decision 3 declines to bound it. It sits **at odds with [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]]**, where the one surviving structural tool wall exists precisely because unrestricted tools were judged unacceptable for one role.
  - **The tester cannot verify fkit's own role lock.** Per [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] a spawned subagent inherits the caller's skill overrides. **Do not scope it to.**
- **Re-raise only if:** the tester proves unable to work read-only (Decision 4's carve-out returns as its own decision); the unhardened envelope causes real harm (**do not pre-emptively harden before that evidence — that is the ruling**); or fkit reaches real projects and the seat goes unused (**retire it rather than grow it**).
- **Do NOT re-raise** the five killed arguments — *"it's thin for a whole role"*, *"the coder writing its own tests is self-certification"*, *"new tools need a new seat"*, *"isn't this the adversarial reviewer?"*, *"testing feels like a different job"* — nor *"an eighth role violates not-breadth"* (weighed and reversed) nor *"a reviewer-owned `/fkit-validate` would be cheaper"* (put to the owner and declined with reasons).

## Required follow-ups — none of them authorized by this ADR
1. **Amend `PROJECT.md`** `:8` and `:71-72`. *(Owner's or producer's call.)*
2. **The seven→eight ripple is already enumerated — do not re-derive it.** The table built for the *git agent* question ([[tasks/design-fkit-git-agent-and-consent-model]]) is directly reusable. Still-live claims verified 2026-07-19: `CLAUDE.md:7`, `AGENTS.md:7`, `PROJECT.md:8,:72`, `architecture.md:4,:82`, `README.md:76`, `claude/README.md:3`, and a **hard-coded literal** in `claude/fkit-claude-init.sh:847` — the last being **code, not prose, and the one most likely to be missed**.
3. **Producer-scoped briefs** for the agent definition, skills, `skills_for_role()` and scaffold dual-homing — **after** the CI gate.
4. **The bare-subagent investigation** — worth running **before** building the seat, to learn whether a plain subagent with these tools can actually drive and judge an app.
5. **fkit-wiki ingests this ADR.** *(Done — this page, 2026-07-19. The vault's own seven-role claims were corrected in the same sync.)*

## Related
- [[decisions/adr-023-fkit-git-agent-is-not-built]] — its Decision 3 (*"the team stays seven roles"*) is a **consequence of that ruling, not an independent constraint**; ADR-023 is **not superseded**, but its count claim is no longer current
- [[decisions/adr-022-tools-unrestricted-except-adversarial-reviewer]] — the tool-restriction posture this seat's unhardened envelope sits in tension with
- [[decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped]] — why the tester cannot verify fkit's own session lockdown
- [[decisions/adr-026-no-mutation-testing-library-prove-red-stays-hand-rolled]] Decision 4 and [[decisions/adr-003-ci-runs-validate-bundles]] — **the two unfinished pieces of the gate the tester waits behind**
- [[decisions/adr-014-how-fkit-tests-itself]] — the standing verification decision
- [[tasks/add-launcher-contract-smoke-script]] — Sprint 2 task 23, **Done**: the regression gate the owner sequenced ahead of the tester, **already shipped**
- [[tasks/add-e2e-smoke-script-for-fkit-itself]] — ⛔ cancelled 2026-07-14, superseded by task 23. **This is the task the owner's Q7 sequencing named** — so the prerequisite is further along than the ruling assumed
- [[tasks/verify-onboarding-flow-end-to-end]] — task 7, the run that surfaced the hole
- [[systems/testing-and-verification]] · [[systems/fkit]] · [[systems/review-and-model-diversity]]
- Source: `ai-agents/knowledge-base/reports/2026-07-13-tester-agent-evaluation.md` — the evidence record: the question, the observed hole, the killed arguments, the flip condition
- [[tasks/sprint-2-remove-omnigent]] — the sprint board; its parent investigation row is still open despite this ruling
- [[tasks/investigate-mutation-testing-library-adoption]] — task 46 → ADR-026, one of the two unfinished pieces of the gate the tester waits behind
- [[tasks/refresh-architecture-docs-for-tool-relaxation]] — task 58, which brought `architecture.md` current on ADR-022; it has since reached ADR-025 but is **behind again on this ADR**, its *"seven roles"* lines (`:4`, `:82`) now false
