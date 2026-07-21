# Add an e2e smoke script for fkit itself

## ID
0004

## Sprint
Backlog (unsprinted)

## Priority
Unscheduled *(but see Notes — the producer's position is that this outranks anything tester-agent-shaped)*

## Status
⛔ Cancelled (2026-07-14) — superseded by Sprint 2 task 23, which covers the same ground against the
settled argv surface.

> ## ⛔ This document is cancelled. Nothing in it is an instruction.
>
> **The live brief is Sprint 2 task 23 —
> [`add-launcher-contract-smoke-script.md`](../../done/0006-add-launcher-contract-smoke-script/brief.md).**
> That reference is here so a reader who lands on this file knows where the real work went. **It is a
> pointer, not a hand-off:** do not build from this document, and do not treat anything below as a
> spec, a scope, or a set of steps. Task 23 is self-contained and supersedes it entirely.
>
> **Two things below are actively wrong** — recorded so nobody follows them:
> - Its guidance to **derive the expected skill matrix from `skills_for_role()`** rather than hard-code
>   it is **overridden by
>   [ADR-014](../../../knowledge-base/decisions/adr-014-how-fkit-tests-itself.md)**. A test whose oracle is
>   the implementation tests nothing.
> - Its warning that this work **"collides with `remove-fkit-resume-passthrough`"** is **spent** — that
>   task landed on 2026-07-13 and the argv surface it rewrote is now final.
>
> Kept as a record of the thinking, per the archive-don't-delete convention. Read it as history.

## Context

**fkit ships a `curl | sh` entry point with zero automated coverage.** `architecture.md` §9.1 names
*"zero automated verification"* as the **top structural risk** in the project. Sprint 2's release gate
(task 7) confirmed it in practice: the only way to know the onboarding flow still works was for the owner
to hand-run it in live sessions.

This task is **deliberately not agentic.** It is a shell script. It is filed as a sibling of
`decide-whether-fkit-needs-a-tester-agent.md` and is **not blocked on it** — the reasoning, on the record
from the 2026-07-13 discussion:

> *"The script protects **fkit's own regressions**; the tester verifies **a change in a consuming
> project**. Different users, different jobs — **building the script will teach us almost nothing about
> whether the tester earns its seat.** The honest rationale is simpler: CI first because it's the bigger
> risk and it's cheap — **full stop, not as an experiment.**"*

And, bluntly: *"shipping a role that tests other people's software while fkit itself has no test at all is
the wrong order — and it's a bad look."*

### The load-bearing technical fact

**A role session can be driven headlessly.** Verified live on 2026-07-13:

```
claude --agent fkit-reviewer --settings .fkit/settings/reviewer.json -p "<prompt>"
```

…and the harness refused a non-owned skill with
`Skill fkit-plan-task is disabled for model invocation in skillOverrides settings`. **So fkit's single
most important invariant — the session skill lockdown (ADR-010/ADR-012) — is machine-checkable today,
from a script.**

The corollary matters just as much: per **ADR-012**, a *subagent* inherits its **caller's**
`skillOverrides` and would report a confident green on the caller's settings. **Any real lockdown test
must shell out to a subprocess.** On fkit's most important invariant, **a script is strictly better than
an agent** — which is exactly why this task is a script and must stay one.

## What to build

A smoke script (suggested: `scripts/smoke.sh`, or wherever the coder judges it belongs) that a human or a
CI runner can invoke, exiting non-zero on any failure. Scope it to what is **cheap and deterministic** —
resist growing it into a test framework.

Minimum coverage, in rough order of value:

1. **The install path.** `install.sh` runs to completion into a throwaway `HOME`/prefix and produces a
   working `fkit` on `PATH`. This is the `curl | sh` promise and it is currently untested.
2. **The scaffold.** `fkit-claude-init.sh` in a temp project produces the expected `.claude/agents/fkit-*`
   / `.claude/skills/fkit-*` copies, `.fkit/settings/*.json`, and the `ai-agents/` structure.
3. **The launcher's argv contract.** Bare `fkit` on a tty → menu; `fkit <role>` → that role; no-args
   no-tty → `lead`. (Establish the *current* contract from `claude/fkit-claude.sh` at pickup — a task to
   remove the blanket arg-passthrough is also in the backlog and will change this surface.)
4. **The skill lockdown, per role — the crown jewel.** For each role, in a **subprocess**, assert that an
   owned skill is available and a **non-owned skill is refused**. `skills_for_role()` in
   `claude/fkit-claude.sh` is the single source of truth for the expected matrix; drive from it rather
   than hard-coding a second copy of it.

**Deciding what is in vs out of scope is part of this task.** If a check needs a live model call, it is
slow, non-deterministic and costs money — decide explicitly whether it earns its place, and say so. A
fast script that runs on every push beats a thorough one nobody runs.

## Verification steps

- The script runs green on a clean checkout, from a clean environment, without the owner's local state.
- It runs **red** when it should: temporarily break one lockdown entry in `skills_for_role()` and confirm
  the script fails on it. **A smoke test that has never failed has not been tested.**
- It leaves nothing behind — no writes outside its temp dirs, no mutation of the developer's real
  `~/.claude/` or `$BIN`.
- It needs nothing beyond `curl | sh` + `claude` + `codex` — **no new fkit dependency**, and no browser
  stack. That constraint is non-negotiable.

## Notes

- **Owner: fkit-coder.** It is source code and the coder is the sole source-write authority.
- **The owner has not asked for this task** — it is filed by the producer, on the producer's own record
  that it is *"below CI, and not close"* when weighed against a tester agent. **It is Unscheduled and
  awaits the owner's confirmation** that it is worth a slot at all. If he'd rather not carry it in the
  backlog, cancel it; it is a proposal, not a commitment.
- **Do not treat this as an experiment about the tester question.** See the quote in Context. It ships or
  it doesn't on its own merits.

### Dependent — do not file yet

- **Wire it into CI on push.** This has nothing to run until the script exists, so it is a **dependent,
  not a peer** — it does not get its own brief today. It is thin (a workflow file), and the coder may
  reasonably land it in the same pass; if so, say so in the commit rather than letting it disappear.
  The one thing to get right is **which checks are cheap enough to run on every push**, which is a
  question this task's scoping answers.

### Sequencing

- Collides with `remove-fkit-resume-passthrough.md` (backlog), which rewrites the launcher's argv
  handling. **Whichever lands second must reconcile.** If the smoke script lands first it will catch the
  regression — which is arguably the point.
