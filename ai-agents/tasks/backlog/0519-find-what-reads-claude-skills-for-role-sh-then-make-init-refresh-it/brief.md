# Find what reads `.claude/skills-for-role.sh`, then make init refresh it (the dogfooded copy is stale)

## ID
0519

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-coder

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule, own words (2026-09-27):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being on the board is not his word.

**Why this task exists.** During
[`0284`](../../done/0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md)'s Verify
step (2026-10-16) it was found that this repo's dogfooded copy `.claude/skills-for-role.sh` differs from
the canonical `claude/skills-for-role.sh`, and `claude/fkit-claude-init.sh` never refreshes it.

**Owner ruling, 2026-10-16** (`AskUserQuestion` in the `fkit-lead` session running the Sprint 12
sprint loop, relayed to a spawned producer). Question: *"Stale .claude/skills-for-role.sh copy (not
refreshed by init): write a brief?"* — chosen option, verbatim label: **"Write a brief
(Recommended)"**, described as *"A producer files a backlog brief to make init refresh it. Knock-on:
none."*

**Why it matters — security-relevant.** `skills_for_role()` is the single source of truth for which
role may run which skill. The ADR-018 `PreToolUse` skill-ownership hook sources it on every `Skill`
call. A stale copy is harmless only if nothing reads it. If anything does, that role's lock is wrong.

### Measured 2026-10-16 by the producer (re-verify; do not quote)

- **The copies differ.** The `.claude/` copy is older: its header says *"FOUR hand-maintained places
  MIRROR this list"* and *"task 43 / ADR-018"*, where the canonical file says *"SIX"* and `0052`. In the
  role table **only the `producer` line differs**: the stale copy lacks `fkit-sprint-done`,
  `fkit-sprint-cancelled` and `fkit-heal`.
- **Init does not copy it.** `claude/fkit-claude-init.sh` step 3 refreshes only
  `.claude/agents/fkit-*.md` and `.claude/skills/fkit-*/`.
- **It is tracked in git and not gitignored.** `git ls-files .claude` lists it (added in commit
  `a89c917`, 2026-07-22, last changed `ed4122f`, 2026-07-25). `.gitignore` covers only the agents and
  skills globs. So it is a committed file, not a "gitignored refresh copy".
- **Evidence that the hook does NOT read it, in this repo.** `.fkit/settings/producer.json` wires the
  Skill hook to `<repo>/claude/skill-ownership-hook.sh`, which sources `"$here/skills-for-role.sh"` —
  its own directory, `claude/`. The launcher builds that path from its own location
  (`claude/fkit-claude.sh`, the `hooks=` line in `build_settings`). A producer session in this repo
  runs `fkit-sprint-done` and `fkit-heal` without denial, which the stale list would deny. Not yet
  proved: whether anything else (a test, a script, a doc procedure) reads the `.claude/` copy.
- **Two docs state a false belief about it.** Open brief
  [`0217`](../0217-wire-fkit-wiki-update-into-the-leads-skill-ownership-and-mirrors/brief.md), `## Notes`,
  says *"`.claude/skills-for-role.sh` and `.claude/agents/` are gitignored copies refreshed by
  `claude/fkit-claude-init.sh .`"*. A Codex log under `.fkit/tmp/` repeats it. Both are wrong on both
  counts today.

## What to build

**1. Investigate first, and write the answer in `worklog.md`.**
- Which `skills-for-role.sh` does the skill-ownership hook source at runtime **in this repo** (launched
  via the installed `fkit`, which re-execs into the checkout, and via `claude/fkit-claude.sh` directly)?
- Which does it source **in a consuming project** (installed share under `~/.local/share/fkit`)? Does a
  consuming project have a `.claude/skills-for-role.sh` at all?
- Does anything else read `.claude/skills-for-role.sh` — tests, scripts, `/fkit-heal`'s structure-spec
  or hash manifest, any skill? Use `/usr/bin/grep`, not the shell wrapper.
- How did the file get into `.claude/` (git history of `a89c917`)?

Prove each answer by a run or a trace, not by reading alone.

**2. Fix, per the owner's ruling.** The ruled default: make `claude/fkit-claude-init.sh .` refresh
`.claude/skills-for-role.sh` from `claude/`, so the copy cannot go stale again.

⛔ **Plan-gate question for the owner if step 1 shows nothing reads the copy.** Then "refresh it" and
"remove it" are different fixes, and the owner's ruling chose refresh. Do not switch on your own. Put
both to the owner at the plan gate with the knock-on of each:
- **Refresh** — init would start writing a new file into **every consuming project's** `.claude/`,
  where nothing reads it; it needs a gitignore entry and a decision on `/fkit-heal`'s view of it
  (ADR-043: `.claude/` is not a structure-conformance surface).
- **Remove** — `git rm` the dogfooded copy; nothing to refresh; the false claims above become simply
  false and must be corrected.

**3. Correct the false claim** in `0217`'s `## Notes` to match what is true after the fix: a dated
note appended beside it, original text byte-identical (it is another task's open brief).

**Edit `claude/` only** for code. Never hand-edit `.claude/` except by running init (or the removal, if
the owner rules it).

**Out of scope:** any change to the role→skill table itself; the hook's logic; `ai-agents/wiki-vault/`.

## Verification steps

1. `worklog.md` answers every step-1 question with the command or trace that proves it.
2. After the fix: either `claude/fkit-claude-init.sh .` leaves `cmp claude/skills-for-role.sh
   .claude/skills-for-role.sh` silent, **and** a test fails if init stops refreshing it (mutation
   shown red, then green) — or, if the owner ruled removal, the file is gone from `git ls-files` and
   nothing in step 1's list reads it.
3. The skill-ownership hook still denies and allows exactly as before:
   `node --test test/skill-ownership-hook.test.js` passes; state the counts.
4. A consuming-project install (temp `HOME`, temp project, init run) shows the outcome step 1 predicted.
5. Run the checks CONTRIBUTING's *"What to run for a change"* table names for `claude/fkit-claude-init.sh`
   and state the measured pass/fail counts, including `test/prove-red.sh` if init is in its mutation
   list.
6. `0217`'s brief: `git diff --numstat` shows 0 removed lines.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Related:** `0217` carries the false claim corrected in step 3; it is not a dependency either way.
- **Provenance:** `0284`'s Verify step, 2026-10-16, relayed by the `fkit-lead` driver. Facts above
  re-measured by the producer the same day.
- Filed 2026-10-16 by a spawned `fkit-producer` with **no owner channel** (ADR-021), on the owner's
  ruling relayed by the `fkit-lead` driver. It edited no existing brief, changed no other task's
  status, priority or location, wrote nothing under `ai-agents/wiki-vault/`, and committed nothing.
