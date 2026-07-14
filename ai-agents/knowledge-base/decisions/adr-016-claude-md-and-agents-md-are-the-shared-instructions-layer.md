# ADR-016: `CLAUDE.md` + `AGENTS.md` **are** the shared-instructions layer — no new mechanism

- **Status:** accepted (**summary corrected 2026-07-14** — the "Positive" section reintroduced the very
  overclaim this ADR exists to retract; **the decision is unchanged**. See "Amendment".)
- **Date:** 2026-07-14
- **Deciders:** owner (Mark Dolbyrev), ruling on
  [`ai-agents/knowledge-base/reports/2026-07-14-shared-instructions-layer.md`](../reports/2026-07-14-shared-instructions-layer.md)
  (rev 2); investigation by fkit-architect, delivery experiment by fkit-coder, recording by
  fkit-architect
- **Evidence:** the report above. It is **revision 2**. Revision 1 recommended building an
  `ai-agents/AGENTS-COMMON.md` spliced into the seven agent files; it went through an adversarial pass
  (Codex + Claude, 17 findings) and **the recommendation did not survive**. Rev 2 reverses it. Every
  claim below is the post-adversarial version.
- **Harness version for all channel observations: Claude Code 2.1.208.** Recorded deliberately — an
  unversioned observation elevated to a law of nature was ADR-010's original error
  ([ADR-012](adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md) had to retract it), and
  this ADR will not repeat it.

> **What this ADR decides, in one line:** fkit's shared-instructions layer **already exists** — it is
> `CLAUDE.md` (for the Claude agents) and `AGENTS.md` (for the codex CLI). **No new mechanism is
> built.** What is fixed is the *delivery* of the layer we already ship.

## Context

The trigger was task
[`add-shared-instructions-layer-for-all-agents.md`](../../tasks/backlog/add-shared-instructions-layer-for-all-agents.md),
whose premise was *"there is nowhere to put an instruction that all fkit agents read."*

**That premise is false.** `claude/scaffold/CLAUDE.md:56-63` ships a **"Universal hard rules (every
role, every session)"** block today — never commit unprompted, only the wiki role writes the vault,
task files move only via the owner-invoked skills, no secrets in any artifact. It is a shared
instructions layer, with a universal-rules block, and it reaches every fkit agent. The section heading
says so in as many words.

So the task collapses from *"design and build a shared-instructions mechanism"* to *"fix the delivery
holes in the mechanism we already ship."*

### The channel table — observed, not reasoned

The brief demanded experiment over reasoning. The coder ran it on **Claude Code 2.1.208**:

| Channel | Session | Spawned consult |
|---|---|---|
| Agent definition file (`.claude/agents/<name>.md`) | ✅ | ✅ 3/3 |
| **Project `CLAUDE.md`** | ✅ | **✅ 3/3** |
| `claude --append-system-prompt` | ✅ (control) | **❌ 0/3 — session-only** |

**The method matters and is stated, because the negative result is the load-bearing one:**

- **The subagent wrote its own output to a file.** An earlier relay *through the calling session* was
  confounded — the caller echoed the canary token itself. The result above is the subagent's own
  artifact.
- **The negative survives two independent controls:**
  - **Within-subject.** Three canaries armed in a single spawn: the agent-file and `CLAUDE.md` canaries
    **fired**, the appended one **did not**. The subagent was demonstrably canary-responsive; only the
    append channel was dark.
  - **Append-only-alone.** Re-run with `--append-system-prompt` as the *sole* canary — no competing
    tokens, so instruction-competition/dedup **cannot** explain the null. Still nothing (0/2).

**The mechanistic reason** — a spawned subagent's system prompt is built from its **own** agent
definition, while `--append-system-prompt` modifies the **parent process's** prompt — is offered as the
**explanation** for the result, **not as its proof**. The proof is the two designs and the same
negative.

*(A separate observation, recorded so it is not misread: editing `.claude/agents/fkit-architect.md`
**mid-session** and then spawning the architect does **not** fire a canary. That demonstrates
**session-start caching of agent definitions** — it does **not** show the agent-file channel failing.
That channel works, 3/3; it is simply read at session start.)*

### The two live delivery holes

1. **Codex has no rules at all.** `claude/skills/fkit-adversarial-review/SKILL.md:30-42` builds its own
   prompt into `.fkit/tmp/adversarial-prompt.md` and runs `codex exec --sandbox read-only --cd "$PWD"`.
   Because of `--cd "$PWD"`, the codex CLI **natively reads the project-root `AGENTS.md`** — init's own
   comment says exactly this (`claude/fkit-claude-init.sh:62-63`, `:74`). And
   **`claude/scaffold/AGENTS.md` carries no universal-hard-rules section** (verified by grep; likewise
   this repo's own `AGENTS.md`). **The one model fkit *requires* for independent judgment
   ([ADR-009](adr-009-claude-code-native-is-the-only-runtime.md)) is never sent any of fkit's shared
   rules** — not "don't commit unprompted", not "don't write the wiki", not "no secrets in any
   artifact."

2. **Brownfield never gets the rules.** Init leaves an existing root context file alone:

   ```
   claude/fkit-claude-init.sh:64-65
     if [ -e "$dest/CLAUDE.md" ]; then
       echo "• CLAUDE.md already present — left as-is"
   ```

   Same for `AGENTS.md` (`:70-71`). **Any project that already used Claude Code — i.e. every plausible
   fkit adopter — never receives fkit's universal hard rules at all.** Including projects fkit itself
   set up before those rules existed.

### What did *not* motivate this

The task's headline justification was rule-drift across the agent files. **It collapsed under
verification.** Three different counts were published (2 of 7, 4 of 7, 3 of 7) and **all three were
wrong** — each from a different grep that missed the phrasing *"sensitive information"*. The verified
truth (`grep -rniE "sensitive|secret|credential" claude/agents/`): **6 of 7 agent files carry the
rule; exactly one does not — `fkit-lead.md`**, which holds neither `Write` nor `Edit` and is therefore
the agent least able to leak a secret into an artifact.

**One omission and three wordings is a copy-paste hygiene problem, not grounds for a new mechanism.**
It is recorded here as a *weak* motivation, on purpose, so nobody later cites it as a strong one.
*(Lesson, at the cost of three attempts: a count of a **semantic** rule cannot be established by
grepping one of its phrasings.)*

## Decision

### 1. No new shared-instructions mechanism — RATIFIED

`CLAUDE.md` (the Claude agents) and `AGENTS.md` (the codex CLI) **are** the shared-instruction
channels. They exist, they ship, and `CLAUDE.md` is proven to reach both a session and a spawned
consult. **The owner's stated need — "add my own instructions that all fkit agents read" — is met
today, with zero new code**, by adding lines to those two files.

### 2. Fix the Codex hole — APPROVED

The universal-hard-rules block goes into `claude/scaffold/AGENTS.md`. **This is the highest-value
change in the whole investigation and it is nearly free.** *(The producer is scoping the brief.)*

### 3. Fix the brownfield hole — APPROVED

Init must **merge** fkit's block into an existing `CLAUDE.md` / `AGENTS.md` rather than skipping the
file, so an already-initialized project can receive — and receive *corrections to* — the shared rules.
Everything outside fkit's region stays the owner's, untouched. This lives in init **step 2**
(`claude/fkit-claude-init.sh:62-75`), the project-root seam — **not** the `ai-agents/` scaffold guard,
so it carries **no dependency on task 28**. *(The producer is scoping the brief.)*

### 4. A single fkit-scoped edit point — DROPPED

The owner declined to pursue one. Its motivating claim (drift across the team) **collapsed** — 6 of 7,
not 2 of 7. If a genuine need for **fkit-scoped** instructions arises later, see "Re-raise only if".

## Tombstones — the two traps, named so nobody re-walks them

### ⚰️ `--append-system-prompt` — REJECTED BY NAME

**It is the most obvious mechanism, it demonstrably works in a session, and it silently does not reach
a spawned consult** (0/3, then 0/2, under two independent controls — Context above).

**This is the exact mirror image of [ADR-012](adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md):**

| What a spawned subagent inherits from the launching session | |
|---|---|
| `--settings` (`skillOverrides`) | **INHERITED** — `adr-012:21-23`. This is *why* the skill lock is only advisory in a consult. |
| System prompt (`--append-system-prompt`) | **NOT inherited** — this ADR. |

**Two opposite inheritance rules. Getting them backwards ships a lie.** A shared-instructions mechanism
that reaches sessions but not consults is **worse than nothing**: it would look like a floor, be
documented as a floor, and be absent from exactly the path — the spawned consult — where fkit's own
boundaries are already weakest.

### ⚰️ `ai-agents/AGENTS-COMMON.md` + splice into the seven agent files — REJECTED BY NAME

Stated at its strongest, then rejected on three counts:

1. **It can never reach Codex — structurally, not as a fixable bug.** The adversarial skill builds its
   own prompt from scratch and runs `codex exec`; it never reads `.claude/agents/*.md`. **A "shared
   layer for *all* agents" that structurally excludes the second model is misnamed.** `AGENTS.md` is
   the *only* channel that reaches Codex at all — and we already have it.
2. **Its stub ships to zero already-initialized projects, and the fix for that is parked.** The splice
   *code* would run fine (it no-ops when the file is absent). What never arrives is the **scaffolded
   stub**, because the `ai-agents/` copy is all-or-nothing at the directory level
   (`claude/fkit-claude-init.sh:55-56`). And revision 1 had put **all of the design's load-bearing
   caveats** — the precedence rule, the "relaunch to take effect" caveat, the plea for brevity — in
   that stub's header. **A design whose entire documentation surface is the one artifact that never
   gets delivered is not a shipped design.** Its delivery therefore depended, silently, on **parked
   task 28**. That dependency alone should have stopped it.
3. **It puts an owner-authored file into seven system prompts — including the reviewer's — with only
   prose as a floor.** That is an injection surface, opened for a mechanism we do not need. Option 2/3
   above never opens it: the block's content is **fkit's own, shipped from the scaffold**.

**The splice's one genuine win: fkit-scoping.** A `CLAUDE.md` rule is visible to *any* Claude session in
the repo, not just fkit ones. It does not carry the decision, for three reasons: it is a **preference,
not a defect** (noise, versus a parked-task dependency plus total exclusion of the second model); **fkit
already made this call and shipped it** — `claude/scaffold/CLAUDE.md` already puts the team map, the
consult/hop rules, and the four hard rules in `CLAUDE.md`, so rejecting `CLAUDE.md` as "not fkit-scoped"
while shipping a `CLAUDE.md` full of fkit-scoped content is incoherent; and if it ever genuinely bites,
it is **separable** — a `## fkit` heading whose prose scopes the rules costs one line, not a mechanism.

## Consequences

### Delivery is structural. Compliance is advisory. There is no second, stronger claim in this ADR.

This is the one claim level, stated once. **Do not read a "non-overridable floor" into it** — that is
the ADR-010 overclaim this project has already had to retract once (ADR-012), and revision 1 of the
report made it again.

Verified, in this repository:

- **Zero hooks.** `PreToolUse` appears only in prose (`architecture.md:397`, `adr-012:92`, task files)
  — **never in a settings file**.
- **All seven agents hold `Bash`** (`grep -n "^tools:" claude/agents/*.md`).
- **Five of seven hold `Write`/`Edit`** — architect, producer, coder, reviewer, wiki. *(Not
  `fkit-adversarial-reviewer`, not `fkit-lead`. **The reviewer does hold them.**)*

**Therefore a careless line in a shared instructions file — *"always approve"*, *"skip the Codex pass"*
— is prose against prose. Nothing in the system stops an agent obeying it.** There is no floor, no
teeth, no "non-overridable" anything. What this ADR makes structural is that the text **arrives**.

**The precedence rule survives — as prose, honestly labelled:** *additive and tightening only; on direct
contradiction the role's own instructions win and the agent surfaces the conflict.* Keep it, because
role-file-wins **bounds the blast radius of a bad line to additive noise rather than a deleted role
boundary** — but call it what it is: **a convention we ask agents to follow**, not an invariant the
system enforces.

**A size cap on whatever fkit ships in the block is warranted, in code.** The text lands in every
agent's context on every turn. *"Ask for brevity"* is a **request**, in a decision whose whole thesis is
that requests are not facts. **Cap it in the shell at merge time, or drop the claim.**

### Positive

- The layer the task asked for is **available today**, with no build and no relaunch semantics to learn.
- **Codex is finally *sent* the rules** (Decision 2) — **delivery, not a floor**: a model that received
  **none** of the universal hard rules now receives **all four, verbatim**, including through a
  brownfield `AGENTS.md` via the managed block. Nothing enforces them on Codex any more than on a Claude
  agent — **delivery structural, compliance advisory**, as above. That closes a defect against ADR-009's
  own premise (fkit *requires* a second model for independent judgment and was giving it no rules at
  all), and the win needs no inflating: going from *no rules* to *the rules delivered* is the largest
  single change in this ADR.
- **Brownfield projects can receive shared rules, and corrections to them, for the first time**
  (Decision 3) — a channel fkit can actually ship fixes through. Again: *receive*, not *obey*.
- **One prompt source per model**, not two. No splice, no sanitizer, no precedence code, no new file.
- **No dependency on parked task 28.** The root-file seam is separate from the `ai-agents/` guard
  ([ADR-015](adr-015-additive-launch-convergence-no-migration-mechanism.md)).

### Negative — the cost, stated rather than buried

- **fkit's rules stay visible to non-fkit Claude sessions in the same repo.** Real, small, and **it is
  the cost fkit already chose to pay** — `CLAUDE.md` already carries the team map and the hard rules by
  design.
- **Two live defects remain open until Decisions 2 and 3 ship** — and they are recorded here as
  defects, not as this ADR's achievements: (a) the Codex adversarial pass runs with **no** shared rules;
  (b) every brownfield project has **never** received them.
- **The read-side symlink hazard is unclosed, and it is now on the record.** Task 27 gated *writes*
  through a symlinked `ai-agents/` (`claude/fkit-claude-init.sh:40`, the `[ -L ]` gate). **The
  inversion was never gated: a future step that *reads* out of `ai-agents/` reads straight through a
  symlink** — which is precisely what the rejected splice would have done, merging off-project content
  into seven system prompts. The splice is dead, so the bug never ships **today**; **any future feature
  that reads out of `ai-agents/` inherits it** and needs a read-side sibling to that gate. Related:
  `exit 3` ("I refused `ai-agents/`, but setup succeeded") is treated as success by the launcher
  (`claude/fkit-claude-init.sh:193`, `claude/fkit-claude.sh:312`) — correct for today's init, **a trap
  for any future step that assumes `ai-agents/` was readable.**
- **`fkit-lead.md` is still missing the "no secrets" line.** One line, not a mechanism — but it is the
  residue of the motivation this ADR downgraded, and it should not be lost with it.

### Neutral

- Whether the six agent files' duplicated "no secrets" wordings are ever **consolidated** is **not
  decided here, deliberately.** It is a refactor of six system prompts and deserves its own risk
  assessment.

## Rejected alternatives

- **`ai-agents/AGENTS-COMMON.md` spliced into the seven agent files** (revision 1's recommendation).
  Rejected — see Tombstones, where it is stated at its strongest. Fatally: it **cannot reach Codex**,
  and its stub **ships to nobody** without parked task 28.
- **`claude --append-system-prompt` carrying the shared block.** Rejected — see Tombstones. **Works in a
  session, dark in a consult (0/3, 0/2).** The most seductive option on the table and the one most
  likely to be re-proposed by someone who tests it only in a session.
- **Overwrite the owner's `CLAUDE.md` / `AGENTS.md` wholesale at init** (the naive brownfield fix).
  Rejected: it destroys owner content. Decision 3 is a **marker-delimited merge** precisely so
  everything outside fkit's region stays the owner's, forever.
- **Do nothing at all** (the layer exists; the owner can hand-edit both root files). Rejected on
  Decision 2: hand-editing does not put the rules into `claude/scaffold/AGENTS.md`, so **every new
  project's Codex pass still ships ruleless**. Delivery is the defect; a manual workaround is not a fix
  to it.

## Re-raise only if

> **1. A future Claude Code version changes system-prompt inheritance for subagents.** The channel table
> above is **version-observed (2.1.208), not a law of nature**. If `--append-system-prompt` (or a
> successor) ever reaches a spawned consult, the `--append-system-prompt` tombstone is void and the
> mechanism question genuinely reopens. **Re-test before re-proposing — and record the version.**
>
> **2. A genuine need arises for instructions that must be fkit-scoped *and* must NOT appear in the
> project's own `CLAUDE.md`.** That is the one requirement this decision does not serve, and the only
> surviving argument the splice ever had. It must be a **real, stated need**, not a preference for
> tidiness — and note the cheap answer first: a `## fkit` heading inside `CLAUDE.md`.

**Not** a trigger: *"the rules are duplicated across the agent files."* They are (6 of 7). That is
**copy-paste hygiene, not a mechanism gap**, and it is what this ADR already weighed and found wanting.

**Not** a trigger: *"a shared instruction was ignored by an agent."* **Compliance was never claimed.**
Delivery is structural; compliance is advisory. A finding must say **which** it means, or it is
re-litigating a settled trade.

**Not** a trigger: adding, editing, or removing a line **inside** the shared block. That is using the
mechanism, and it works.

## Amendment — 2026-07-14: the summary reintroduced the overclaim this ADR retracts; **the decision stands**

**The defect.** The "Positive" section read **"Codex finally gets a floor."** Fifteen lines above it,
Consequences says *"There is no floor, no teeth, no 'non-overridable' anything"*, under a heading that
says *"Delivery is structural. Compliance is advisory. There is no second, stronger claim in this
ADR."* **The ADR asserted, in its own summary, the exact overclaim it was written to retract** — the
ADR-010 → ADR-012 failure mode reproduced *inside the document that exists to prevent it*. Raised by
fkit-reviewer across two review rounds, relayed by fkit-coder, approved by the owner.

**The correction, in both this ADR and its evidence report:** *floor* — a word that connotes a
**non-overridable minimum** — is replaced by **delivery**. What Decision 2 changes is that Codex, which
received **none** of the universal hard rules, now **receives all four, verbatim** (verified live: before
the change it returned nothing; after it returns all four, including from a brownfield `AGENTS.md`
through the managed block). **Nothing enforces them.** Verified in this repository, unchanged: **zero
hooks**, **all seven agents hold `Bash`**, **five of seven hold `Write`/`Edit`**. Compliance for Codex is
exactly as advisory as it is for every Claude agent.

**Scope.** Wording only, in this ADR and in `reports/2026-07-14-shared-instructions-layer.md`. **No
decision changes**: Decisions 1–4 stand verbatim, both tombstones stand, "Re-raise only if" stands —
including its "*a shared instruction was ignored by an agent*" non-trigger, which this correction makes
consistent rather than weaker. The remaining uses of *floor* in this ADR are the ones that **attack** the
word (the `--append-system-prompt` tombstone: a mechanism that *"would look like a floor… and be absent
from exactly the path where fkit's boundaries are weakest"*); they assert no enforcement and are kept.
Amended **in place rather than superseded**, per the ADR-013 / ADR-015 precedent: the decision is intact,
so there is nothing for a superseding ADR to explain.

**The standing rule this leaves behind:** *state the win as delivery.* "Codex now **receives** rules it
never received" is a large, true claim. "Codex now has a **floor**" is a false one, and it is the one this
project keeps reaching for.

## Related

- [`ai-agents/knowledge-base/reports/2026-07-14-shared-instructions-layer.md`](../reports/2026-07-14-shared-instructions-layer.md)
  — the evidence, rev 2 (post-adversarial), **corrected 2026-07-14 alongside this ADR** (same overclaim,
  same fix — see its header note). §1 = the corrected drift count; §2 = the layer already exists;
  §3 = the two holes; §4 = the splice defeated on the merits; §5 = the channel experiment;
  §6 = *delivery is structural, compliance is advisory*.
- [ADR-009](adr-009-claude-code-native-is-the-only-runtime.md) — Codex is a **required** runtime.
  Context §1 is a live defect against this ADR's premise.
- [ADR-010](adr-010-role-locked-sessions-and-skill-lockdown.md) — the "structural, not by instruction"
  overclaim that Consequences refuses to repeat.
- [ADR-012](adr-012-skill-lockdown-is-session-scoped-frontmatter-dropped.md) — the **mirror image**:
  `--settings` **is** inherited by a spawn (`adr-012:21-23`); the system prompt is **not**.
- [ADR-013](adr-013-knowledge-base-root-holds-the-living-canon.md) — why the evidence is a dated report
  and this is the durable document.
- [ADR-015](adr-015-additive-launch-convergence-no-migration-mechanism.md) — the `ai-agents/`
  convergence guard (task 28) that the rejected splice silently depended on, and that Decisions 2–3 do
  **not**.
- Code: `claude/scaffold/CLAUDE.md:56-63` (the layer that already exists);
  `claude/scaffold/AGENTS.md` (the layer that is **missing** for Codex);
  `claude/fkit-claude-init.sh:62-63,:74` (the codex CLI reads `AGENTS.md`), `:40` (the `[ -L ]`
  **write** gate — no read-side sibling), `:55-56` (all-or-nothing `ai-agents/` guard — task 28),
  `:64-75` (never-clobber root files — the brownfield hole), `:193` (`exit 3`);
  `claude/fkit-claude.sh:312` (`exit 3` treated as success);
  `claude/skills/fkit-adversarial-review/SKILL.md:30-42` (the codex prompt, built from scratch).
