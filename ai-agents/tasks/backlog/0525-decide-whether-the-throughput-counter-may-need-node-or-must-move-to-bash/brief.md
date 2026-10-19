# Decide whether the throughput counter may need node, or must move to bash

## ID
0525

## Sprint
Backlog

## Priority
Unscheduled

## Status
🔲 Backlog

## Owner
fkit-architect

## Context

> ⛔ **Do not start without the owner's specific word.** His standing rule, own words (2026-09-27):
> *"if we already have a brief for that task, the task shouldn't start, until I specifically approve it
> (because it might change the way fkit work in general)."* Being on the board is not his word.

**The problem.** fkit ships a skill script that needs Node.js, and its own rule says shipped scripts may
rely on `bash` only. No decision records the exception.

- **The script.** `claude/skills/fkit-status/throughput.mjs` is a shipped skill executable: it sits in
  a skill directory under `claude/`, so it reaches every consuming project at `.claude/skills/`. Its
  header, section *"PORTABILITY"*, says: *"node >= 18, no dependency, no `package.json` change."*
  `/fkit-status`'s Backlog beat (the *"1 · Headline"* row) tells the agent to *"run
  `node .claude/skills/fkit-status/throughput.mjs`"* for a measured trend. It is the only non-markdown,
  non-`.sh` file under `claude/skills/` (checked 2026-10-18).
- **The rule.** [ADR-017](../../../knowledge-base/decisions/adr-017-skills-may-ship-executables-invoked-via-bash-not-the-exec-bit.md),
  *Decision*, rule 3: *"Consumer runtime assumption: `bash`, and nothing more. No new PATH assumption
  may be added by a shipped skill executable without a new decision. Node in particular is **not**
  available to reach for here merely because ADR-014 permitted it for **repo-root tests**."* Its
  *Options considered* rejected node for shipped scripts, and its *Residual risks* say a shipped
  executable needing more than `bash` *"is a new consumer PATH assumption and rule 3 sends it back to
  the owner. It is not the implementer's call"*.
- **No record of the exception.** No ADR names `throughput.mjs` or allows node for skill scripts
  (a grep of `ai-agents/knowledge-base/decisions/` for `throughput` finds nothing, 2026-10-18). Task
  `0359` built the counter: its brief's verification step 1 reads *"runs from a clean checkout with
  `node`/`bash` only"*, and its worklog's decision *"D2"* changed the skill's draft command from `bash`
  to `node`, because `bash` cannot run a `.mjs` file. That made the command work. It did not settle
  rule 3.
- **Why the counter is in JS.** The header gives one reason for not using plain shell tools: the ISO
  week number comes from JS, *"rather than taken from `git log --date=format:%G-W%V`, because that path
  goes through the platform's strftime and %G/%V are not portable across the libc implementations this
  ships to."* A bash port has to solve that.

**Source.** Task `0510`'s plan, section *"9"*, open question Q-A (raised by its architect plan review,
which `0510` does not act on).

**Owner ruling, 2026-10-17** (`AskUserQuestion` in the `fkit-lead` session, at `0510`'s plan gate).
Question: *"Q-A: throughput.mjs needs Node, but ADR-017 says shipped scripts may only rely on bash.
What now?"* Chosen option, verbatim label: **"File a backlog brief (Recommended)"**, described as *"A
producer files a brief for the architect: record the exception, or move the counter to bash. Knock-on:
new Backlog row; nothing waits on it."* This is that brief.

## What to build

A decision, put to the owner and recorded. Not a code change.

1. **Lay out the two options** with their real costs, for the owner:
   - **(A) Record the exception.** Allow node for this script (or for skill scripts in general — say
     which, and why). Record it either as a dated addendum to ADR-017 or as a new ADR; recommend one.
     State what a consuming project without node sees today when `/fkit-status` reaches that step,
     measured, not assumed, and whether that is acceptable.
   - **(B) Move the counter to bash.** Estimate the size of a port, name how the ISO-week problem would
     be solved portably (macOS bash 3.2 and BSD tools included), and name what the port puts at risk:
     the `⟦fkit-throughput v1⟧` output contract and `test/throughput-counter.test.js`.
   The architect may consult a coder on the port's size and risk.
2. **Put the choice to the owner** and get his ruling.
3. **Record the ruling.**
   - **(A):** write the addendum or the new ADR via `/fkit-record-decision`, following the ADR-017
     correction style already in that file (a dated append; no existing line of the ADR edited).
   - **(B):** record the decision the same way, then hand the port back to the producer to file as a
     separate `fkit-coder` brief. The port is not part of this task.

**Out of scope:** any change to `throughput.mjs`, `dashboard.sh` or `install.sh`; the comment cleanup
of `throughput.mjs` (task `0510`).

## Verification steps

1. The owner's ruling is quoted verbatim (question, chosen label, date, channel) in this task's
   worklog.
2. **(A):** ADR-017 carries a dated addendum, or a new ADR exists, that names `throughput.mjs` (or the
   class it allows) and the node version. `git diff` on ADR-017 shows additions only.
   **(B):** the decision is recorded, and a new `fkit-coder` brief for the port exists on a board.
3. The measured behaviour without node (option A) or the port estimate (option B) is in the worklog,
   with the command used.
4. `node --test test/coordination-citation-policy.test.js test/reference-integrity.test.js` pass; state
   the counts.

## Notes

- **Depends on:** nothing
- **Blocks:** nothing
- **Related, not a dependency:** `0510` cleans the comments in `throughput.mjs`, including the header
  this brief quotes. Re-check the quotes above before acting; their meaning should not change.
- **Placement:** Backlog board, unranked, per the owner's 2026-10-17 ruling. Knock-on: none — no open
  task waits on it (checked 2026-10-18).
- Filed 2026-10-18 by a spawned `fkit-producer` with **no owner channel** (ADR-021), on the owner's
  ruling relayed by `fkit-lead`. Committed nothing; wrote nothing under `ai-agents/wiki-vault/`.
