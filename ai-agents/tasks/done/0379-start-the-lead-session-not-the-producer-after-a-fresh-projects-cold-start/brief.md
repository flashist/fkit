# Start the LEAD session, not the producer, once a fresh project's cold start has been answered — and decide WHERE the initiation runs

## ID
0379

## Sprint
Sprint 7

## Priority
P15

## Status
✅ Done (agent-closed — not owner-verified)

## Owner
fkit-coder

## Context

### The requirement, in the owner's own words

**Owner instruction, given live in a `fkit lead` session on 2026-09-05. Quoted verbatim, because the
wording is the requirement:**

> *"Add a task. Into the current sprint. I don't like that currently when we run fkit, in a new
> project, it asks you questions. And then it starts the producer session. The main agent that people
> should communicate with is the lead agent. So after the first start and after answering all the
> questions, it should start the lead session, not the producer."*

⭐ **Read what the instruction does NOT say.** It does not ask for the questions to go away — *"after
answering all the questions"* keeps them. The complaint is the **destination**: the session the owner
is left sitting in when the cold start is over. **The intake questionnaire stays; the terminal session
changes.**

### ⛔ THE CURRENT ROUTING IS DELIBERATE, NOT AN OVERSIGHT. Do not write this change as a bug fix.

Measured 2026-09-05 against `claude/fkit-claude.sh`, in the section whose own comment reads
*"Fresh project: skip the menu, go straight to the producer's cold start"*:

| What the branch does | Evidence, as the file's own words |
|---|---|
| Decides "fresh" only when init did **not** refuse the tree and setup succeeded | *"a refused `ai-agents/` is NOT fresh. Fall through to the menu and let them work."* |
| Fires only when no role was named on the command line | the branch is gated on `fresh` **and** an empty `role` |
| Runs the project's intake questionnaire when it is executable | it invokes `.fkit/interview` and tolerates a non-zero exit |
| Pins the role to the producer | it sets `role="producer"`, builds the producer settings, sets the tab title to the producer |
| Passes **one of two** seed strings | one seed for when `.fkit/intake.md` exists (*"READ THAT FILE FIRST and use it as the product brief"*), one for when it does not (*"interview me about the product, have the fkit-architect agent survey the codebase"*) |
| `exec`s Claude as the producer agent with that seed appended | `exec claude --agent fkit-producer …` |

⭐ **The branch states its own reason, and it is a good one.** Its comment argues:
*"the producer's initiation exists to WRITE `ai-agents/`, and a failed setup is direct evidence fkit
cannot write this project. Cold-starting into it could only fail."* The whole surrounding block is
about **not stranding an owner** in an initiation that can never complete. ⛔ **Nothing in this task
may weaken that guard.** The refusal path, the `setup_ok` check, and the fall-through to the menu are
out of scope and must come out byte-identical unless the implementer can show otherwise at the plan
gate.

⭐ **The routing simply PREDATES the decision that makes lead the front door.** It was written when the
producer was the only role with a cold start to run.

### The authority for the change: ADR-031

[ADR-031](../../../knowledge-base/decisions/adr-031-fkit-lead-becomes-the-orchestrating-front-door.md)
reversed ADR-010 §Decision 3 and made `fkit-lead` the **orchestrating front door** — a
*"single-point-of-interaction conductor"* that **spawns typed `fkit-<role>` workers**, drives them, and
**keeps the owner channel to itself** while workers *return* questions instead of asking them
([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)).
The owner's *"the main agent that people should communicate with is the lead agent"* is that ADR
restated. **This task brings the one remaining entry path into line with it.**

### ⛔ THE WALL THIS TASK CANNOT CLIMB — `fkit-initiate-project` is producer-only, and it is ENFORCED

⛔ **"Start the lead instead" CANNOT mean "the lead runs the initiation."** Verified 2026-09-05:

- Role→skill ownership is declared in **exactly one place** — `skills_for_role()` in
  `claude/skills-for-role.sh`. Its `producer)` arm is the only arm listing `fkit-initiate-project`; the
  `lead)` arm does not carry it.
- It is not advisory. The
  [ADR-018](../../../knowledge-base/decisions/adr-018-pretooluse-skill-ownership-hook-replaces-consult-skills-exception-list.md)
  `PreToolUse` skill-ownership hook checks the **real invoking agent's identity at any spawn depth**
  against that same function and **denies** what the role does not own. A lead session calling
  `/fkit-initiate-project` is refused by the hook, not merely discouraged.

⛔ **Widening `skills_for_role()` to hand lead the initiation is NOT in scope and must not be done
under this brief.** That is a role-boundary change and needs its own owner ruling.

⭐ **But ADR-031 already supplies the legal shape:** a lead session **spawns `@fkit-producer`**, which
runs `/fkit-initiate-project` inside its own identity — exactly what the hook permits, and exactly the
shape every other task on this board has shipped through.

## What to build

### ⛔ STEP 1 IS A DECISION, AND THIS BRIEF DELIBERATELY DOES NOT MAKE IT

The requirement is settled. **Where the initiation runs is not**, and it is a real design fork with
real costs on every branch. ⛔ **Do not pick one silently in code.** Put it to the owner at the plan
gate ([ADR-021](../../../knowledge-base/decisions/adr-021-askuserquestion-is-session-only-absent-in-consults.md)
— if you are a spawned worker, **return** it, do not ask it).

| Option | Shape | What it costs |
|---|---|---|
| **A — lead first, producer spawned** | The launcher runs the intake as now, then `exec`s **lead** with a seed telling it to spawn `@fkit-producer` for the initiation and relay. | ⛔ **The interview is interactive and the worker has no owner channel.** Under ADR-021 the spawned producer must *return* its follow-up questions for lead to relay, so a conversational interview becomes return→relay→re-spawn rounds. `/fkit-initiate-project` is written for a session with the owner present; whether it survives being driven this way is **the open technical risk of this option** and must be checked, not assumed. |
| **B — producer first, then hand off** | Unchanged cold start; when the initiation completes, the owner lands in a **lead** session (re-exec, or an explicit "now run `fkit`" instruction at the end). | Cheapest, and the initiation keeps the live owner channel it was written for. ⚠️ But it satisfies the owner's sentence only from the **second** turn onward — the first session the owner talks to is still the producer, which is arguably the literal thing they objected to. **An automatic re-exec also throws away the initiation session's context**, and the owner may or may not want that. |
| **C — something else** | e.g. the launcher decides by whether `.fkit/intake.md` already answered enough to skip the interview. | Unbounded; only worth putting up if A and B both fail on inspection. |

⚠️ **Name the ambiguity in the owner's sentence when you put this up.** *"After answering all the
questions"* reads two ways: **(i)** after the `.fkit/interview` intake questionnaire (→ favours A), or
**(ii)** after the whole initiation interview the producer conducts (→ favours B). ⛔ **The two
readings pick different options. The owner must say which they meant.**

### Step 2 — implement the ruled option in `claude/fkit-claude.sh`

⚠️ **`claude/fkit-claude.sh` is a shipped surface. Four constraints, all hard:**

1. ⛔ **Edit the canonical source under `claude/` — NEVER the mirrored copy under `.claude/`.** The
   `.claude/` tree is gitignored and refreshed from `claude/` by `claude/fkit-claude-init.sh`.
2. ⛔ **The change is NOT live in any running session** until init has been re-run against the project.
   Do not report it as live, and do not test it by reading the mirror.
3. ⚠️ **The file is covered by the structure manifest and the dual-home parity convention**
   ([ADR-027](../../../knowledge-base/decisions/adr-027-dual-home-parity-is-a-dev-time-convention-plus-test.md)).
   ⛔ **If the edit forces regenerating a shipped artifact — the hash manifest, a bundle, a dual-homed
   twin — STOP AND SURFACE IT.** Do not regenerate on your own authority.
4. ⛔ **Preserve the two seed strings' intent.** Whichever agent is launched, a fresh project with an
   `.fkit/intake.md` must still be told to read it first, and one without it must still be told to run
   the initiation from scratch. If the destination agent changes, the seed's **wording** must change to
   match — a seed that says *"run your `fkit-initiate-project` procedure"* handed to **lead** instructs
   it to do something the ADR-018 hook will refuse.

### ⛔ Step 3 — the existing test PINS the current behaviour and WILL go red. That is expected.

`test/launcher-contract.test.js`, the test whose name reads
*"12. fresh project, no role → producer cold-start with seed"*, asserts the exact argv
`['--agent', 'fkit-producer', '--settings', '.fkit/settings/producer.json']`, an argv length of 5, and
that the fifth argument matches `/fresh fkit project/i`.

⛔ **Do not delete this test to make the suite green.** Amend it to pin the **new** contract, and keep
it asserting the same four things: which agent, which settings file, that a seed is passed, and what
the seed says. A test that stops checking the settings file has lost half its value.

## Verification steps

1. **The seam already exists — use it; do not invent one.** `test/harness.mjs` exports
   `makeProject({ fresh: true })`, which builds a project in `os.tmpdir()` and **deliberately leaves
   `PROJECT.md` absent** so the tree reads as fresh; its own comment records why
   (*"a fresh tree hijacks every role into the producer cold-start"*). The harness also installs a
   `claude` **stub** that records the exact argv it was handed. ⭐ **So the cold-start argv is directly
   assertable in this repo without ever initiating a real project** — the concern that this path
   "cannot be exercised here" does not survive contact with the harness. Confirm that firsthand before
   relying on it.
2. Run the amended `test/launcher-contract.test.js` and show it asserting the **new** agent, the **new**
   settings file, and the **new** seed text.
3. Prove the guard is still a guard: temporarily break the launcher and show test 12 red, then restore.
   ⚠️ A test that passes against both the old and the new launcher is pinning nothing.
4. ⛔ **Prove the refusal path is untouched.** A project whose `ai-agents/` init refused, and a project
   whose setup failed, must **still fall through to the menu** and must **not** be cold-started. Show
   the existing coverage for that still passes, or add it.
5. ⛔ **Prove the explicit-role path is untouched.** `fkit coder` on a fresh project must still open the
   coder — the branch is gated on an empty role and that gate must survive.
6. `git diff --stat` shows **zero** files modified under `ai-agents/wiki-vault/` and **zero** under
   `.claude/`.
7. `npm test` passes. ⛔ **Report the measured counts** (total / pass / fail), not a quoted figure from
   an earlier run.

## Notes

- **Depends on:** nothing. ⛔ **But it BLOCKS
  [`0360`](../../done/0360-cut-the-v0-3-0-release-and-hand-archive-sprint-7/brief.md), hard** — that row
  archives Sprint 7 and may not run while any row on the board is open. `0379` has been added to
  `0360`'s `Depends on` field **in place**, because that field is **machine-parsed**: `dashboard.sh`
  derives the board's `Next step` from it, and a note underneath does not fix what the parser reads.
  ⭐ Same treatment `0361`'s addition, `0369`'s addition and removal, and `0355`'s removal each got.
- ⚠️ **Priority P15 is append rank, NOT a merit ranking — flagged for owner confirmation.**
  **On merit this belongs directly below `0359`**, because it is a user-facing behaviour change that
  the owner asked for today and it should land **before** the release `0360` cuts, not after it —
  whereas `P15` puts it nominally below `0360`. ⛔ **Nothing was re-ranked**
  ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md));
  the board carries closed rows below the merit position, so an insertion is not available, and a
  spawned producer with no owner channel never re-ranks regardless.
- ⚠️ **Rank order and execution order therefore disagree for this pair, exactly as they already do for
  `0361` and `0360`.** The binding order lives in `Depends on` / `Blocks`, not in the rank token.
- ⛔ **Out of scope, and each needs its own owner ruling:** widening `skills_for_role()`; moving
  `/fkit-initiate-project` to another role; changing what the `.fkit/interview` questionnaire asks;
  changing the refused-tree / failed-setup guard.
- **Owner:** `fkit-coder` — this is a launcher edit plus a launcher-contract test amendment.
