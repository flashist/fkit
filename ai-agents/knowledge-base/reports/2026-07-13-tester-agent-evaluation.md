# Does fkit need a dedicated e2e-tester agent?

- **Date:** 2026-07-13
- **Raised by:** the owner, after Sprint 2's release gate (task 7) required him to hand-run the
  interactive verification steps.
- **Participants:** owner, fkit-coder, fkit-architect (design consult), fkit-producer (product consult).
- **Status:** ⚠️ **NO DECISION MADE.** The architect and producer both recommend **against** an 8th role.
  **The owner has not ruled.** This document records the discussion so the decision can be made later
  without re-deriving it. Deciding it is its own backlog task.

> **Read this first, and don't skip it.** Everything below is *recommendation and evidence*, not a
> decision. If a future reader treats the architect's "no 8th role" as settled, this document has
> failed at its only job. **New architecture direction needs the owner's sign-off.**

## The question

Should fkit gain a **dedicated e2e-tester agent** — an 8th role that can drive a terminal and/or a
browser to verify use-cases end to end?

**The framing that matters:** the owner is thinking about fkit **as a product used on other projects**,
not about fkit's own repo. fkit-coder's first answer reasoned only from fkit's own needs (a POSIX shell
tool whose e2e is deterministic shell) and generalized wrongly. **fkit is not a representative fkit
user.** For a consuming project — a game, a web app, an API — e2e means driving the app, observing, and
judging, which is genuinely agentic. The owner's reframe was correct and the coder conceded it.

## Where it came from — a real, observed hole

Sprint 2's task 7 (the release gate) required fkit-coder — who implemented tasks 1–6 and 8 — to verify
its own work. It could not credibly do so, and split verification into a mechanical phase (itself) and a
judgment phase (the owner, by hand, in live sessions).

**That split was ad hoc — but it is exactly the property the reviewer role exists to provide.** The
instinct was right; fkit just has no seat for it.

## The strongest argument FOR (stronger than the one originally made)

**"Did you test it?" currently rests on the coder's self-report.**

- `claude/agents/fkit-coder.md:112-113` — *"run the relevant tests … **If you can't run them, say so
  explicitly.**"* Pure self-report.
- This is precisely the *"agent greens its own board"* failure the project already guards against by
  gating `Done` / `Cancelled` behind owner-invoked skills.

**fkit today has two agents that READ code and zero that RUN it. Every review is static.** That needs no
user research to see, and it is the real finding of this discussion.

### The smoking gun — the reviewer admits the hole itself

`claude/skills/fkit-review/SKILL.md:113`:

> `✅ Ready to merge — no open confirmed defects. Append **"(validation-gated)"** if a manual test is the
> only remaining gate.`

The reviewer already emits *"I read this and it looks right, but somebody has to actually run it."*
**That is a hole in the reviewer, admitted by the reviewer, in its own output vocabulary.**

## fkit-architect's position (design) — no 8th role

**Roles are authority boundaries, not activities.** `PROJECT.md:18-24` states fkit's thesis: the problem
is *"no separation of **authority**."* Every seat holds an authority no one else holds:

| Role | Unique authority |
|---|---|
| producer | product/scope calls; task lifecycle |
| coder | **sole source-write** |
| architect | design / ADR authority |
| reviewer | independence **from the writer** |
| adversarial reviewer | **model** independence (Codex) |
| wiki | exclusive write gateway to `wiki-vault/` |
| lead | none — and it explicitly *does no work* |

> *"What authority would a tester hold that no existing role does? Not write authority. Not
> independence-from-the-coder — **the reviewer already has exactly that, on exactly the same axis.** Not
> model diversity. **It holds no new authority. In fkit's own model, a thing with no authority boundary
> is a skill, not a seat.**"*

**The write-authority fork is not a fork — it is a proof:**
- **Tester writes test code** → creates a **second source-write authority**, destroying a property
  asserted in **seven places** in the repo. Catastrophic trade for an activity a skill can already do.
- **Tester only executes** → holds no authority at all. A skill wearing a seat.

**Either branch → no role.**

### Arguments the architect explicitly KILLED (do not re-raise them)

- ❌ *"It's thin for a whole role."* — **A bad argument.** Activity-volume, and wrong: *"driving a game,
  observing it, trying to break it is not thin — that's the entire QA profession."* `fkit-lead` does
  almost nothing and is a legitimate seat. **The case must rest on authority, not workload.**
- ❌ *"The coder writing its own tests is self-certification."* — **Category error.** Writing tests is no
  more self-certifying than writing the feature; tests get reviewed like any source. The broken loop is
  *"the developer is **the only one who ever decided whether it passed**."* Who typed the spec file is
  irrelevant.
- ❌ *"New tools need a new seat."* — The reviewer's allowlist already includes `Bash`. Bash runs
  Playwright. **Tool surface ≠ seat.**
- ❌ *"Isn't this the adversarial reviewer?"* — No. That seat's identity is **model diversity**, and its
  Codex pass runs `--sandbox read-only` — it structurally **cannot drive an app**. Driving doesn't need a
  second model; it needs a second **pair of hands**.
- ⚠️ *"Context pollution — reviewing and app-driving in one head."* — A real concern, cheap fix: the
  reviewer already has `Agent` and can spawn a subagent to do the driving and take back a verdict
  (exactly how it already offloads Codex).

### The architect's recommendation

**`/fkit-validate` as a reviewer-owned skill**, not an 8th role — closing a hole in the reviewer by
extending the reviewer.

**Restated invariant (would need owner sign-off):**
> **The coder is the sole source-write authority. "Source" includes test code.** No non-coder role writes
> anything under the project's source tree. The reviewer's write surface stays `ai-agents/reviews/`;
> validation artifacts (reports, traces, screenshots, logs) land there.
>
> **Narrow carve-out:** a validation run may write *ephemeral driver scripts* (a throwaway
> Playwright/curl script to exercise the app) into a **gitignored scratch path only** (`.fkit/scratch/`)
> — never committed. If a driver is worth keeping, it becomes a **coder task**.

**Dependency cost — solved, with fkit's own precedent.** The browser stack must **never** become an fkit
dependency; `curl | sh` + `claude` + `codex` stays the whole install story. Mirror the existing optional
project-supplied hook `.fkit/interview` (`claude/fkit-claude.sh:298`):

- `/fkit-validate` runs **`.fkit/validate`** if the consuming project provides one — *their* Playwright,
  *their* pytest, *their* game harness, *their* deps.
- If absent: drive with whatever Bash/MCP exists, and **say loudly what could not be driven.**

This also dissolves the "is a generic e2e tester even coherent?" worry: **genericity lives in the hook
contract, not in an LLM guessing the stack.**

## fkit-producer's position (product) — real need, wrong seat, wrong priority

- **Demand evidence is thin, and should be labelled as such.** One data point (task 7), and it is fkit
  testing *itself*. fkit has essentially no external users yet. *"Consuming-project owners want a
  tester"* is a **hypothesis, not an observation.** *"Don't let it get laundered into a requirement by
  the fact that it sounds obviously true."*
- **The job-to-be-done is only one of the four candidates:**

| Candidate | Verdict |
|---|---|
| Write the test suite | **Dead** — that's code; the coder is the sole write authority |
| Run the suite, triage failures | **Dead** — that's CI plus the coder |
| Exploratory / hostile driving | **Not a new role** — the adversarial reviewer's mandate, extended from *reading* to *running*. A tool grant, not a seat |
| **Verify the coder's change actually works** | ✅ **This is the product** — and it's a capability the reviewer already claims and cannot deliver |

- **⚠️ It conflicts with a constraint the owner already locked.** `PROJECT.md`: *"Stage: Prototype …
  hardening/polish is the current focus, **not breadth**."* An 8th role **is** breadth. The owner may
  supersede his own rule — but it should be an **explicit, recorded reversal, not a drift.**
- **Priority: below CI, and not close.** `install.sh` is a `curl | sh` entry point with **zero automated
  coverage**. *"A tester agent does not protect `install.sh`. A CI script does."* And: *"Shipping a role
  that tests other people's software while fkit itself has no test at all is the wrong order — and it's
  a bad look."*

### The producer caught fkit-coder in a dodge — recorded, because it matters

fkit-coder proposed *"build the CI script first, and let using it reveal whether we need the agent."*
The producer rejected the **reasoning**:

> *"Right order, wrong reason. The script protects **fkit's own regressions**; the tester verifies **a
> change in a consuming project**. Different users, different jobs — **building the script will teach us
> almost nothing about whether the tester earns its seat.** The honest rationale is simpler: **CI first
> because it's the bigger risk and it's cheap — full stop, not as an experiment.**"*

## Two facts established during this discussion (load-bearing; take as given)

1. **A role session CAN be driven headlessly.** Verified live:
   `claude --agent fkit-reviewer --settings .fkit/settings/reviewer.json -p "<prompt>"` → the harness
   refused a non-owned skill: `Skill fkit-plan-task is disabled for model invocation in skillOverrides
   settings`. **Automated e2e of fkit's own role sessions is feasible today, from a script.**
2. **Per [ADR-012](../decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md), a tester
   *subagent* CANNOT test the session lockdown** — it inherits the **caller's** `skillOverrides` and
   would report a confident green on its caller's settings. Any real session test must shell out to a
   **subprocess**. **On fkit's single most important invariant, an agent is strictly worse than a
   script.**

## The one thing that would flip the recommendation — watch for it

> **A tool-authority divergence.** If validation turns out to need a **permission envelope you would not
> grant the reviewer** — a network-enabled, write-enabled, permissive sandbox to run an untrusted app —
> then the tester **does** hold a unique authority (a **sandbox** authority), and by the architect's own
> authority argument **it earns a seat.**
>
> *"That is the only argument that beats mine, and it beats it cleanly. Watch for it the first time you
> write `.fkit/validate` for a real app."* — fkit-architect

Weaker signals worth watching:
- Validation quality measurably degrades when run in a session that also reviewed — **but** try the
  subagent-spawn fix first; if that works, no seat.
- Owners repeatedly cannot find *"who tests this?"* — that's a **routing** failure; fix it in
  `fkit-lead` / `fkit-team` long before fixing it with a seat.

**Explicitly NOT evidence:** *"testing feels like a different job."* — *"That is how a 7-role team
becomes a 12-role team, and you just spent a whole sprint proving that adding is cheap and removing is a
sprint."*

## Epistemic caveat — discount the convergence

The architect and producer independently landed on the same conclusion (real gap, wrong fix, CI first).
**But fkit-coder briefed both**, so some convergence is its framing echoing back. The parts that carry
genuine weight are the ones **neither consult got from the coder**:

- the **authority-boundary** argument (architect),
- the **`(validation-gated)` smoking gun** (architect),
- the **`.fkit/validate` hook** precedent (architect),
- the **"two agents read code, zero run it"** framing (producer),
- the **PROJECT.md "not breadth" conflict** (producer).

## Open questions — for the owner, unanswered

1. **Do you want to *talk to* a tester (a seat), or is it enough that verification happens automatically
   inside review (a capability)?** — *This single answer decides the whole scope.*
2. **Is fkit used on any other project today, by anyone?** If yes: what did they wish had been verified?
   If no, the demand case is a hypothesis and should be time-boxed as one.
3. **Terminal-only v1, or is the browser the point?** Very different install costs. **These may be two
   products.**
4. **Sign off on the restated source-write invariant** (*"source includes test code"*) + the gitignored
   ephemeral-driver carve-out?
5. **Is `.fkit/validate` the right pluggability boundary**, or do you want a first-party browser
   integration — at the cost of the `curl | sh` promise?
6. **Do you intend to supersede your own "seven roles, not breadth" constraint?** If so, record it as an
   explicit reversal.
7. **Sequencing:** CI task before `/fkit-validate`, or in parallel?

## If the decision goes the recommended way, the ADR writes the REJECTION

The architect's point: the durable, re-litigable artifact is the **rejection**, not the adoption —
*"without this ADR, 'should we add a tester?' comes back every sprint."* It would record: roles are
authority boundaries and a tester adds none; the source-write invariant restated to include test code;
`/fkit-validate` on the reviewer via the optional `.fkit/validate` hook; fkit's own CI gap as a separate,
explicitly non-agentic task; and the re-raise clause (the sandbox-authority divergence above).

## Related

- [`architecture.md`](../architecture.md) §9.1 — **zero automated verification**, the top structural risk.
  Not a role question, and it should not be used as evidence for one.
- [`2026-07-12-onboarding-verification.md`](2026-07-12-onboarding-verification.md) — the task-7 run that
  surfaced the gap.
- [`ADR-012`](../decisions/adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md) — why a tester
  *subagent* cannot verify the lockdown.
