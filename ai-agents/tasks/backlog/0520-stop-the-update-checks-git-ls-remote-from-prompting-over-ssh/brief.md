# Stop the update check's `git ls-remote` from prompting over ssh when git rewrites GitHub URLs

## ID
0520

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

**The problem.** Every `fkit` launch may run an update check. Its git path, `_fkit_remote_sha` in
`claude/fkit-claude.sh`, runs `git ls-remote "https://github.com/…"` with `GIT_TERMINAL_PROMPT=0`. If
the user's git config rewrites GitHub URLs to ssh (`url.<base>.insteadOf`, a common setup), git runs
ssh instead, and `GIT_TERMINAL_PROMPT=0` does not stop ssh from prompting: git does not pass
`BatchMode` to ssh. So a launch can show an ssh passphrase or host-key prompt. The check is meant to be
silent (the launcher's update-check header: *"offline / proxied / captive-portal must cost nothing and
print nothing"*).

**Measured.** `0284`'s reviewer, round 1, `review.md` header `Coverage:` line: *"a temp-HOME git probe
showing `GIT_TERMINAL_PROMPT=0` passes no `BatchMode` to ssh"* — on Apple git 2.50.1. The reviewer's
round-1 report put the ssh-prompt case under *"disproven / not recorded"* for 0284's scope, per the
`fkit-lead` driver's relay of 2026-10-16; `review.md` itself carries only the `Coverage:` sentence
(checked 2026-10-16).

**Today's bound.** Since
[`0284`](../../done/0284-bound-the-update-checks-git-path-which-has-no-deadline-and-hangs/brief.md) (🔄 In
progress, Sprint 12), the `_fkit_deadline` watchdog cuts the call off after `FKIT_NET_TIMEOUT` (5 s).
So the worst case today is a prompt shown for up to 5 s, then dropped — not a hang. This task removes
the prompt itself.

**Owner ruling, 2026-10-16** (`AskUserQuestion` in the `fkit-lead` session running the Sprint 12
sprint loop, relayed to a spawned producer). Question: *"Update check can still show an ssh prompt for
5 s if git rewrites GitHub to ssh. Brief a fix?"* — chosen option, verbatim label: **"Write a brief
(Recommended)"**, described as *"Backlog brief to make the check never prompt over ssh, weighing the
custom-ssh trade-off. Knock-on: none."*

## What to build

**1. Reproduce first**, in a temp `HOME` with a `url.…insteadOf` rewrite to ssh and no usable key:
show the prompt (or the ssh attempt) from the update check. Record the command and output in
`worklog.md`. If it cannot be reproduced, stop and report.

**2. Make the update check's git call never prompt**, for that one call only. Candidate shapes for the
plan to weigh (not a prescription):
- force `GIT_SSH_COMMAND="ssh -o BatchMode=yes"` for the call;
- keep the user's ssh command and add `-o BatchMode=yes` to it;
- stop the rewrite reaching this call (for example by ignoring user/system git config for it);
- fall back to the `curl` path when the URL would go over ssh.

⛔ **The trade-off the owner named — put it to him at the plan gate.** Setting `GIT_SSH_COMMAND`
overrides any custom `core.sshCommand` or `GIT_SSH_COMMAND` the user has (a proxy jump, a specific key,
a wrapper). Ignoring git config also drops the user's proxy and other settings. The plan states, for
the shape it recommends, which user setups change behaviour and how, and asks the owner to rule. The
coder does not settle it alone.

**3. Keep 0284's contract.** Still bounded by the watchdog, still silent on failure, still never
fails the launch.

**Out of scope:** `fkit update`'s installer download; the `curl` path's own behaviour; any change to
`FKIT_NET_TIMEOUT`.

## Verification steps

1. The step-1 repro, re-run after the fix: no prompt, no output from the check, launch continues, and
   the run takes well under `FKIT_NET_TIMEOUT` (state the measured time).
2. A test in `test/update-banner.test.js` (or a sibling) sets up the `insteadOf` rewrite in a temp
   `HOME` and asserts no prompt/no stray output. Shown red without the fix, green with it.
3. A user with a plain https setup still gets a correct update check (existing banner tests green).
4. If the chosen shape keeps a custom ssh command: a test shows the user's command is still used.
5. Run the checks CONTRIBUTING's *"What to run for a change"* table names for `claude/fkit-claude.sh`
   (including `test/prove-red.sh` if the launcher is in its mutation list) and state the measured
   pass/fail counts.
6. `worklog.md` records the owner's ruling on the trade-off, verbatim.

## Notes

- **Depends on:** 0284
- **Blocks:** nothing
- **Why the dependency:** same function, `_fkit_remote_sha`, and the same watchdog. Building on top of
  an unlanded 0284 would race its edits.
- **Provenance:** `0284`'s stateful review, round 1 (`review.md` `Coverage:` line, and the reviewer's
  report as relayed by the `fkit-lead` driver 2026-10-16).
- **Placement:** an open task on the Backlog board waiting on `0284` in Sprint 12 (an earlier board).
  Nothing on a sprint board waits on this task. Knock-on: none (checked 2026-10-16).
- Filed 2026-10-16 by a spawned `fkit-producer` with **no owner channel** (ADR-021), on the owner's
  ruling relayed by the `fkit-lead` driver. It edited no existing brief, changed no other task's
  status, priority or location, wrote nothing under `ai-agents/wiki-vault/`, and committed nothing.
