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
    `0222` row on [Sprint 3](../../../sprints/sprint-3.md).
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
- ⚠️ **Second open question, from the report:** *who is obliged to read the log, and what asserts that
  the log itself has not silently stopped being written.* Report §5 names this as the remaining open
  piece. Answering it may be in scope or may be its own task — the owner's call.
- ⚠️ **Filed on the Backlog board because the owner's ruling named no sprint.** A spawned producer has
  no owner channel and never invents a sprint placement. **Flagged for owner confirmation: Sprint 2
  may be the intended home**, alongside `0222`.
- **Possible overlap to check before starting:** `0189` (ADR-036's skill-ownership site registry) and
  `0194`. Report §8 item 8 asks whether this denial record is itself a new site under that registry.
  **That assessment is `0194`/`0189`'s, not this task's** — do not fold it in.
