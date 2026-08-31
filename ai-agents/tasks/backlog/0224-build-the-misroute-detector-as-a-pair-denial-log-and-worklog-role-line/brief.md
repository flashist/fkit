# Build the misroute detector as a PAIR — the denial log and the worklog `**Role:**` line

## ID
0224

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

**Follow-up 3 of `0200`'s report**, filed on a **named owner ruling** taken via `AskUserQuestion` in a
live `fkit lead` driver session on **2026-08-05**: *file items 1, 2, 3 and 4 from `0200`'s unfiled
follow-ups list*. Source:
[`2026-08-05-eval-process-review-step-role-ownership.md`](../../../knowledge-base/reports/2026-08-05-eval-process-review-step-role-ownership.md)
**§5 and §8 item 3**. **Cite the report by path; do not re-narrate it.**

> ### ⛔ THIS IS ONE TASK WITH TWO HALVES. DO NOT SPLIT IT.
>
> **Splitting it is precisely what would let the weaker single-signal version ship.** The report's
> Round-1 answer proposed the denial log **alone** and was **amended (R2)**: the log is blind to the
> path the defect most likely actually took. **Neither half is a detector on its own.**
>
> **This supersedes report §8 follow-up 6** — that item is this task's half (ii), folded in
> deliberately. Do not file it separately.

**The gap.** A driver spawned the wrong role for the Process-review step on **three consecutive
tasks** (`0158`, `0143`, `0195`) before anyone noticed. Today a denial reaches the project record
**only if the denied worker chooses to write it there.** `0195`'s worker volunteered it
(`ai-agents/tasks/done/0195-…/worklog.md:188-194`, frozen); the other two did not, or had nothing to
volunteer. The hook detects every violation and **records none** — measured at
`claude/skill-ownership-hook.sh`, `deny()`, which does exactly two things: prints to stderr and emits
the deny JSON on stdout.

**Why one signal is not enough** — the two paths a misroute can take:

| Path | Reaches the hook? | Caught by |
|---|---|---|
| Worker **attempts** the skill and is denied (`0195`) | yes | **(i)** the denial log |
| Worker is told to apply the method **by hand** and never attempts it (`0158`/`0143`, on the reading the artifacts allow) | **no** | **(ii)** the `**Role:**` line |

The hook fires on an **attempted** `Skill` invocation only. On the by-hand path there is no denial to
persist, so a hook-only detector sees nothing — and that is the path `0158`/`0143` most plausibly took.

## What to build

### Half (i) — the hook's `deny()` writes a durable, git-tracked, append-only denial record

`claude/skill-ownership-hook.sh` — `deny()` additionally **appends** the denial to a git-tracked,
append-only log. The record must be enough to identify the misroute: at minimum the role that was
denied, the skill it tried to invoke, and a timestamp.

> ### ⚠️ THE SHAPE IS OWNER-RULED. THE PATH IS NOT. Put the path to the owner — do not pick one.
>
> **Owner-ruled 2026-08-05:** the record is **git-tracked** and **append-only**.
> **NOT ruled: where it lives.** `.fkit/` is **gitignored** (`.gitignore:8`), so the existing hook
> persistence pattern's home is unavailable — a log there is invisible to the project record, which
> defeats the whole point. **The task must surface the path choice as an owner decision and stop for
> it.** Do not settle it between agents.

> ## ✅ DATED CORRECTION 2026-08-14 — THE LOCATION IS NOW OWNER-RULED. The block above is left byte-identical.
>
> **Owner ruling, 2026-08-14**, given live via `AskUserQuestion` in a `fkit lead` session driving
> `/fkit-sprint-ship-loop` and relayed to a spawned producer with no owner channel. **The option label
> is the verbatim text:**
>
> > **"Rule the path now — under ai-agents/ (Recommended)"**
>
> **What is now ruled: the denial log lives under `ai-agents/`.** Together with the 2026-08-05 ruling
> the shape is: **git-tracked, append-only, under `ai-agents/`.**
>
> ⭐ **Why this matters more than it looks.** The ruled shape previously had **nowhere to live**:
> `.fkit/` is gitignored, so *"git-tracked"* and *"the existing hook persistence home"* were in direct
> contradiction. **That contradiction is what blocked this task entirely**, and it is also what held
> [`0233`](../0233-assess-the-denial-log-as-an-adr-036-registry-site/brief.md) shut, since `0233`
> assesses an artifact that could not be built. ✅ **The contradiction is resolved.**
>
> ### ⛔⛔ THE OWNER RULED THE LOCATION. THEY DID NOT RULE THE FILENAME.
>
> ⛔ **Do not read a specific path out of this block, and do not treat any filename as ruled.** The
> ruling names the **directory tree** — `ai-agents/` — and nothing finer. **The exact path and
> filename remain an open design choice for this task's plan gate**, where the architect proposes and
> the owner confirms.
>
> ⛔ **This producer deliberately did NOT invent one.** Pinning a filename here would convert an
> agent's guess into something a later reader takes for an owner ruling — precisely the failure this
> brief's whole *"THE SHAPE IS OWNER-RULED. THE PATH IS NOT."* block exists to prevent. **The block
> above is narrowed by this ruling, not retired**: what must still be put to the owner is the exact
> path; what no longer needs asking is which tree it sits in.
>
> ⚠️ **Verification step 1 still governs, unchanged in force.** If the plan gate produces no owner
> confirmation of the exact path, the task is `🚧 Blocked — awaiting owner decision on the denial-log
> filename`, **not shipped with a guessed one**. ✅ What changes is only that the block is now
> narrower and answerable in one question rather than open-ended.
>
> ### ⚠️ A CONSEQUENCE THE PLAN GATE MUST CARRY: this file is INHERITED BY EVERY CONSUMING PROJECT
>
> `claude/skill-ownership-hook.sh` runs **inside a consuming project**, so a log it writes under
> `ai-agents/` appears in **every project that installs fkit** — not just this repo. ⚠️ **That is a
> distribution decision, not just a path decision, and it belongs in the plan put to the owner.**
> ⛔ Do not let it be discovered after the hook ships.
>
> ### ✅ THE STRUCTURE-SPEC FINDING — REPORTED, NOT ACTED ON
>
> **Asked:** does a new tracked file under `ai-agents/` need a row in `claude/structure-spec.md`'s
> inventory? **Measured on disk 2026-08-14; ⛔ no row was added and no spec file was touched.**
>
> **The answer turns on one thing: whether fkit SHIPS the file, or the hook CREATES it at runtime.**
>
> - **Inventory Table B is *"Every file the installed version requires, project-relative"*, and
>   `test/structure-spec.test.js` asserts SET EQUALITY IN BOTH DIRECTIONS** between the two inventory
>   tables and `claude/scaffold/` (assertions A and B; a violation reports either *"spec missing
>   file X"* or *"spec lists file X the scaffold does not ship"*).
> - ⛔ **So if the log is created at runtime by the hook and NOT shipped from
>   `claude/scaffold/ai-agents/`, it must NOT get an inventory row** — adding one **fails the build**
>   on the *"the scaffold does not ship"* half. ⭐ **The cautious instinct here is the wrong one.**
> - ✅ **If instead the design chooses to SHIP a seed file** (an empty log, or a `.gitkeep` for a new
>   directory) from `claude/scaffold/ai-agents/`, then it needs **both** a Table B row **and**
>   `npm run generate:manifest` — `RELEASING.md` §3, since `claude/scaffold/ai-agents/` is exactly
>   what the manifest covers. ⚠️ **And a NEW top-level entry under `claude/scaffold/` is more than a
>   regen**: the generator refuses loudly until it is taught the path, by design, because whether a
>   file ships to a project is a decision rather than a derivation.
>
> ⚠️ **Which branch applies is undecided, because it follows from the filename/shape question the plan
> gate still owes the owner.** ⛔ **Neither branch is chosen here.** Whichever is taken, the choice and
> its spec/manifest consequence go in the plan the owner approves — not into the implementation
> quietly.
>
> ⛔ **Nothing else about this row changed.** `## Status` stays `🔲 Backlog`, `## Priority` stays
> `Unscheduled`, `## Sprint` stays `Backlog`, `## Owner` stays `fkit-architect`. No board row was
> touched, nothing was re-ranked
> ([ADR-035](../../../knowledge-base/decisions/adr-035-a-mid-board-insertion-is-not-the-owner-ruled-re-rank-exception.md)),
> no mover ran
> ([ADR-033](../../../knowledge-base/decisions/adr-033-task-movers-are-producer-only-reversing-adr-025.md)),
> nothing was written under `ai-agents/wiki-vault/`
> ([ADR-005](../../../knowledge-base/decisions/adr-005-vendor-wiki-query-skill-reads-decentralized.md)),
> and nothing was committed.

**Persistence itself is not new ground** (report R6). `claude/askuserquestion-marker-hook.sh:57` and
`claude/shiploop-marker-hook.sh:64` already write under `$cwd/.fkit/state/`, and
`claude/turn-completion-hook.sh` reads them back. **The only new part is the git-tracked location.**

**Secrets:** the deny string is built only from `role` and `skill_name`, both passed through
`is_identifier()`. **A denial log carries no secret.** Stated because it goes to git — re-verify it
before shipping.

### Half (ii) — a mandatory `**Role:**` line per worklog round

Make a `**Role:**` attribution line **required** at the head of every worklog round, and **assert its
presence with a test**. This is the only signal that catches a **by-hand** application, which never
reaches the hook.

**Measured today:** across this session's four Process-review rounds, **2 of 4 are unattributed** —
`ai-agents/tasks/done/0167-…/worklog.md` carries exactly one `**Role:**` line (`:3`, the Build
worker), and its two Process-review sections at `:204` and `:434` carry **none**. `0190/worklog.md:239`
and `0191/worklog.md:121` do. So today a misroute leaves no trace in the record more often than it
leaves one.

Touches the worklog contract in `claude/skills/fkit-sprint-ship-loop/SKILL.md` plus `test/`.

### Feasibility

Both halves sit inside existing patterns (ADR-014: `node --test`, zero devDeps).
`test/skill-ownership-hook.test.js` already sources `skills-for-role.sh` directly and deliberately
keeps *"a MIRROR of `skills_for_role()`, not derived from it — a test whose oracle is the
implementation tests nothing"*. `test/skill-frontmatter.test.js` already walks every `SKILL.md` as a
live corpus. Follow both precedents.

---

### ⚠️ Two honest limits that MUST be carried into the implementation and the worklog

1. **Half (ii) is a *presence* test. It cures absence, not misattribution.** Nothing compares the
   recorded role to the row's role — a worker that writes the *wrong* `**Role:**` value passes. This is
   **accepted residual R14** from `0200`'s ledger. ⛔ **Do not describe half (ii) as catching a
   misroute; it catches an unattributed round.** A brief or a worklog implying otherwise ships a false
   guarantee.
2. **⛔ Do NOT reuse the report's phrase *"outside the denied worker's control"* — it overstates.**
   **Accepted residual R18:** **ADR-022** leaves every role but the adversarial reviewer
   **tool-unrestricted**, so a denied worker with Bash can reach the log file. The log is *durable and
   git-tracked*, which is a real improvement over a channel that runs through the accused; it is **not
   tamper-proof**. State it that way.

**The overall tradeoff, stated not buried:** this is **detection, not prevention**. The hook gates
skill **invocation**, and a driver that spawns the wrong role and tells it to work by hand never
reaches the gate. `0200` §7 accepts that tradeoff explicitly; so does ADR-033 about its own residual.

### Out of scope

- ⛔ **Do not change `skills_for_role()`** in `claude/skills-for-role.sh`. Option (b) was rejected.
- ⛔ Do not edit `claude/skills/fkit-process-stateful-review/SKILL.md` (ADR-032: byte-unchanged).
- ⛔ Do not reopen ADR-018 / ADR-022 / ADR-033 / ADR-037.

⚠️ **Contended file.** Half (ii) edits `claude/skills/fkit-sprint-ship-loop/SKILL.md`, which `0203`,
`0208` and `0223` also edit in three other regions. **Not to be worked in parallel; whichever lands
second re-verifies its coordinates.**

## Verification steps

1. **The path decision is evidenced, not assumed.** The worklog records the owner's ruling on the log
   path — who ruled it, when, and through which channel. **If no ruling was obtained, the task is
   `🚧 Blocked — awaiting owner decision on the denial-log path`, not shipped with a guessed path.**
2. The chosen path is **not** under `.fkit/` and is **not** matched by `.gitignore`. Prove it:
   `git check-ignore -v <path>` returns nothing, and `git status --porcelain <path>` shows the file as
   tracked/untracked-but-trackable rather than ignored.
3. **Half (i) fires end to end.** Drive a denial through `claude/skill-ownership-hook.sh` (the existing
   `test/skill-ownership-hook.test.js` harness already constructs deny payloads) and assert a new line
   lands in the log with the role, the skill, and a timestamp.
4. **Append-only is proved, not asserted.** A second denial appends a second line and the first line is
   byte-unchanged.
5. **No secret in the record.** Assert the written line contains only the identifier-validated `role`
   and `skill_name` plus the timestamp — no payload passthrough.
6. **Half (ii) fails red on a missing line.** A fixture worklog round with no `**Role:**` line makes
   the new test **fail**; adding the line makes it pass. A test that cannot fail proves nothing.
7. `node --test test/` passes with **zero devDeps** (ADR-014).
8. **Both halves are in the same change surface.** `git diff --stat` shows the hook, the loop's worklog
   contract, and `test/` all moved together. **A diff containing only one half fails this task.**
9. **The two residuals are recorded verbatim in the worklog** — R14 (presence, not misattribution) and
   R18 (ADR-022 leaves the worker tool-unrestricted). Neither may be softened or dropped.

## Notes

- **Depends on:** `0222` (records ADR-038 — the rule this detector guards).
  - **⚠️ DATED CORRECTION 2026-08-06 — THIS DEPENDENCY IS RELAXED. The line above is left
    byte-identical and is no longer binding.** **Owner ruling, verbatim: *"Relax 0224 and 0225."***
    Given 2026-08-06 via `AskUserQuestion` in a live `fkit lead` session. **Current dependency:
    `Depends on: nothing`.**
    **Why.** This task builds a *mechanism* — the paired denial log and worklog `**Role:**` line. The
    mechanism is the same whichever way ADR-038 words the rule it detects departures from, so it does
    not need ADR-038 to exist before it can be built. `0222` remains the right place for the rule to
    be *recorded*; it is not a gate on this build. Of the three briefs that declared `Depends on:
    0222`, only `0223`'s survived the owner's review, and only for its **reason clause** — see the
    `0222` row on [Sprint 3](../../../sprints/done/sprint-3.md).
    **What this does NOT change.** Nothing about scope, the two open questions below (the denial-log
    path is still unruled and still blocks the coder), the residuals, or the owner field. Relaxing a
    dependency makes this task *runnable*, not *ready* — the denial-log path question is still the
    first thing to settle.
- **Blocks:** nothing.
- **Owner:** fkit-architect — the task opens with a design decision to frame for the owner (the log
  path, its shape, and who is obliged to read it). ⚠️ **It then hands off to `fkit-coder` for the hook
  edit, the worklog contract and the tests.** The owner field takes one role
  ([`task-owner-vocabulary.md`](../../../knowledge-base/conventions/task-owner-vocabulary.md): *"not
  two roles"*), so the hand-off is recorded here rather than in the field.
- **Size: medium.** Two mechanisms, three files plus tests, one blocking owner decision.
- **Merit position, for the owner:** **the highest-merit of the four `0200` follow-ups.** It is the only
  one that supplies detection; `0223` and `0225` are prose and a guard against a different failure.
- ⚠️ **OPEN QUESTION FOR THE OWNER — the denial-log path.** Owner-ruled: git-tracked and append-only.
  **Not ruled:** where. `.fkit/` is out (gitignored). This must be answered before the coder starts.
  - ✅ **DATED CORRECTION 2026-08-14 — PARTLY ANSWERED. The bullet above is left byte-identical.**
    **Owner ruling, verbatim option label: "Rule the path now — under ai-agents/ (Recommended)"**
    (`AskUserQuestion`, 2026-08-14, live `fkit lead` session driving `/fkit-sprint-ship-loop`, relayed
    to a spawned producer with no owner channel). **The shape is now: git-tracked, append-only, under
    `ai-agents/`.** ⭐ **The contradiction that blocked this task — a ruled *"git-tracked"* shape whose
    only known home was gitignored — is resolved**, and with it the reason
    [`0233`](../0233-assess-the-denial-log-as-an-adr-036-registry-site/brief.md) was held shut at the
    decision level.
    ⛔⛔ **STILL OPEN, DELIBERATELY: the exact path and filename.** The owner ruled the **location**,
    not the file. ⛔ **No filename is pinned here and none may be inferred from this note** — it goes
    to this task's **plan gate** as one focused question. ⚠️ **Verification step 1 is unchanged in
    force:** no owner confirmation of the exact path → `🚧 Blocked`, never a guessed path.
    ⚠️ **Two consequences the plan gate must carry, reported and not decided:** the hook runs in a
    consuming project, so this file is **inherited by every project that installs fkit**; and whether
    it needs a `claude/structure-spec.md` inventory row depends on whether fkit **ships** it or the
    hook **creates** it — ⛔ **the cautious answer is the wrong one here**, because
    `test/structure-spec.test.js` asserts set equality against `claude/scaffold/` in both directions,
    so a row for a runtime-created file **fails the build**. **Full reasoning in the master correction
    in `## What to build`.** ⛔ **No spec row was added and no spec file was touched by this note.**
- ⚠️ **Second open question, from the report:** *who is obliged to read the log, and what asserts that
  the log itself has not silently stopped being written.* Report §5 names this as the remaining open
  piece. Answering it may be in scope or may be its own task — the owner's call.
- ⚠️ **Filed on the Backlog board because the owner's ruling named no sprint.** A spawned producer has
  no owner channel and never invents a sprint placement. **Flagged for owner confirmation: Sprint 2
  may be the intended home**, alongside `0222`.
- **Possible overlap to check before starting:** `0189` (ADR-036's skill-ownership site registry) and
  `0194`. Report §8 item 8 asks whether this denial record is itself a new site under that registry.
  **That assessment is `0194`/`0189`'s, not this task's** — do not fold it in.

### ⭐ 2026-08-29 — ADR-044 CHANGES THIS DETECTOR'S **ORACLE**. The mechanism is unchanged.

**Source:** [ADR-044](../../../knowledge-base/decisions/adr-044-build-role-follows-the-deliverables-skill-vault-rows-skip-at-step-1.md)
§C3, §C6, §Decision 1 — `Status: accepted` 2026-08-27, the deliverable of
[`0270`](../../done/0270-decide-how-the-ship-loop-handles-a-non-coder-owned-task-row/brief.md).
Filed as follow-on (iii) of §C2 on **owner ruling ND6**, verbatim: *"File all three after the ADR is
accepted (Recommended)"*. Written by
[`0347`](../../done/0347-note-adr-044s-oracle-rule-onto-0224-and-0225/brief.md).

⛔ **THE MECHANISM IS UNCHANGED — DO NOT RE-SCOPE THIS TASK.** The pair stands exactly as written
above: half (i) the git-tracked, append-only denial log, half (ii) the mandatory worklog `**Role:**`
line, **both in one change surface** (verification step 8). This note touches neither open question
(the denial-log path/filename, and who is obliged to read the log), neither residual (**R14** presence-
not-misattribution, **R18** ADR-022 leaves the worker tool-unrestricted), nor the `## Owner` field.

**What changes is the ORACLE — what half (ii)'s `**Role:**` line is checked AGAINST.**

- ⛔ **Old oracle (now wrong for Build):** the **literal role cell** in `/fkit-sprint-ship-loop`'s
  step-2 table.
- ⭐ **New oracle — ADR-044 §Decision 1, verbatim:** *"The Build row's role is the owner, in
  `skills_for_role()`, of the skill the deliverable is produced by."* And for a skill-less deliverable:
  *"A deliverable that names no skill — source, tests, scaffold, prose under `claude/`,
  coordination-doc repairs — is the coder's, as sole source-write authority, **whatever `## Owner`
  says**."* ⚠️ **That last clause is deliberate:** a `## Owner` differing from the Build role is the
  rule working, not a defect — so the detector must never derive the expected role from `## Owner`.
  (ADR-044 **§Decision 4** gives `## Owner` its own separate live job — the step-1 vault-row skip
  predicate. Two fields, two questions.)
- ⚠️ **Scope of the change, per ADR-044 §C4:** it moves **Build**. **Verify stays table-fixed**, and
  ADR-038 is *"not amended and not superseded"*. Do not widen this note past Build.
- ⚠️ **Consequence of NOT carrying this note, in ADR-044 §C3's own words:** *"Without this note the
  detector flags **every lawful non-coder Build as a misroute**."*

⛔ **THE ANTI-PATTERN THIS DETECTOR MUST NOT IMPLEMENT: grepping the brief for `/fkit-*` skill names.**
ADR-044 §C6, verbatim: *"A future oracle (`0224`, `0225` — C3) **must read the deliverable's producing
skill, never grep the brief for skill names.**"* This is measured, not stylistic — a grep oracle
**reproduces at scale the exact misroute ADR-044 removes**:

- **ADR-044 §C6, measured 2026-08-28:** a grep-for-skill-names oracle would route **8 of the 13**
  `## Owner: fkit-producer` rows back to the producer — *"reproducing precisely the `## Owner` staffing
  Decision 1 replaces."*
- ⭐ **RE-MEASURED 2026-08-29 by `0347` — the figure has MOVED: it is now 9 of 14.** The row `0360`
  was filed since; it is producer-owned and names `/fkit-status`, `/fkit-task-done` and
  `/fkit-task-cancelled`, so numerator and denominator each grew by one. **The shape of the failure is
  unchanged and slightly worse: ~64% of producer-owned rows misrouted.**
- **Method, so a later reader can re-run it rather than trust it** (`conventions/evidence-before-assertion.md`):
  population = briefs under `ai-agents/tasks/backlog/` whose **`## Status` is `🔲 Backlog`** — **138**
  on 2026-08-29 (123 on 2026-08-28); `## Owner` read with an **anchored** `^## Owner$` match (an
  unanchored one mis-reads `0184`'s second `## Owner rulings on record` heading — ADR-044 §"Unverified
  this pass"); then every `/fkit-[a-z0-9-]+` token per brief checked against `skills_for_role()` in
  `claude/skills-for-role.sh`.
- **The 14 producer-owned rows, 2026-08-29:** `0013`, `0149`, `0183`, `0184`, `0187`, `0193`, `0221`,
  `0262`, `0318`, `0320`, `0321`, `0335`, `0340`, `0360`. **Ten carry a real `/fkit-*` skill token**;
  ⛔ **nine of those ten name a producer-*exclusive* skill** — `/fkit-status`, `/fkit-task-brief`,
  `/fkit-task-done`, `/fkit-task-cancelled` or `/fkit-heal` (`0184`, `0187`, `0262`, `0318`, `0320`,
  `0321`, `0335`, `0340`, `0360`). Only `0221` does not, naming the lead-owned
  `/fkit-sprint-ship-loop`. `0013` names the **agent** `/fkit-coder`, not a skill; `0149`, `0183`,
  `0193` name none.
- ⚠️ **A mention is not an invocation.** ADR-044 §C6 checked all five `/fkit-record-decision` /
  `/fkit-task-brief` citations in that set and found *"every one is a reference, not an invocation"* —
  most of them citing a skill's prose as an **authority for form**. That is precisely why grep cannot
  serve: it cannot tell a citation from a call.
- ⛔ **This number is live and will move again.** Re-measure it before relying on it; do not copy it
  forward unchecked. **Partial verification, stated:** `0347` re-verified the *"names no producing
  skill"* limb only for the new row `0360` (it runs `npm run release:minor` plus a **hand**-archive;
  the `/fkit-sprint-done` and `/fkit-sprint-cancelled` tokens it names **do not exist** in
  `skills_for_role()` — `0341` would build them and is out of `0360`'s scope). The other 13 are
  inherited from ADR-044's 2026-08-28 per-brief read, **not re-verified on 2026-08-29**.

⭐ **What this means concretely for half (ii)'s implementation.** ⛔ **Half (ii) still compares
nothing** — it asserts the `**Role:**` line is *present*, and that is all (residual **R14**, restated
below). What this note fixes is the **oracle any comparison must use if and when one is built**: the
recorded `**Role:**` would be checked against the role that **ADR-044 §Decision 1's rule** yields for
that row's deliverable — producing skill → its owner in `skills_for_role()`; no producing skill →
`fkit-coder`. ⛔ Not against the step table's literal cell, ⛔ not against `## Owner`, and ⛔ **never**
against a grep of the brief.

⚠️ **R14 is unchanged and is NOT relaxed by this note.** Half (ii) remains a **presence** test:
nothing compares the recorded role to the row's role, so a worker writing the *wrong* `**Role:**`
value still passes. ⛔ Do not read "the oracle is now ADR-044's rule" as a claim that half (ii)
compares anything — that would ship the false guarantee R14 exists to prevent. The oracle stated here
is what a comparison **must use if and when one is built**.
