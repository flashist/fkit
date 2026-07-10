---
name: reconnect-agents
description: >-
  Reconnect any disconnected teammate runner(s) in this fkit-team tree by running the existing,
  first-party `fkit reconnect` CLI tool. DELIBERATE, OWNER-APPROVED EXCEPTION to
  ai-agents/tasks/done/build-fkit-reconnect-tooling.md's scope note #9 ("do not wire fkit-team ...
  to invoke this script autonomously") and its "out of scope: auto-respawn/self-healing" line —
  the owner explicitly authorized this reversal. The underlying reconnect mechanism is UNCHANGED
  (still the same `omnigent run <config> --resume <conv_id> --server <url>` command the CLI script
  and the panel's own "Agent disconnected" dialog already use); this only adds a new caller
  (fkit-team itself). Use ONLY when the human asks fkit-team to check on / reconnect / wake up a
  teammate that seems unreachable, disconnected, or unresponsive — never proactively or on a timer.
---

# Reconnect Agents

> **This is a deliberate, owner-approved exception, not a new capability invented here.**
> `ai-agents/tasks/done/build-fkit-reconnect-tooling.md` (scope note #9) originally said: *"Scope as human-operator CLI tooling only. Do not wire
> `fkit-team` or any teammate to invoke this script autonomously — that would expand the team's
> 'orchestrates, never acts' charter and needs its own explicit decision, not a side effect of this
> task."* and listed "auto-respawn/self-healing" as out of scope. The project owner explicitly
> authorized reversing that one scope note, directly in session, so that fkit-team itself can
> invoke reconnect **on request**. Nothing about the reconnect mechanism changed to make this
> possible — it is still exactly the first-party `omnigent run <bundle>/config.yaml --resume
> <conv_id> --server <url>` command that `omnigent/fkit-reconnect.sh` (wired up as `fkit reconnect`)
> already runs, and that the Web UI's own per-session "Agent disconnected" notification gives a
> human to copy-paste. This skill adds exactly one new caller of that same mechanism: fkit-team,
> when asked. It does not add polling, auto-respawn, or any other self-healing behavior.

**Argument:** `$ARGUMENTS` — usually none. If the human names a specific teammate (e.g. "reconnect
the coder"), note that in your report, but still run the full check below — `fkit reconnect` walks
the whole tree in one pass and there is no cheaper single-session variant; just call out the one
they asked about first in your reply.

## When to use this

Only when the human directly asks — e.g. "reconnect the team", "the reviewer isn't responding",
"can you check if everyone's still connected", or similar. Do **not** run this:
- proactively, at the start of a turn, or on any kind of schedule/loop,
- as a reflex the moment `sys_session_list` looks empty (that tool has a known, separate listing
  bug per the incident doc — don't treat "list looks empty" alone as "go reconnect"; that's still a
  human call unless they've asked you to check),
- for anything other than fkit-team's own session tree (this project's teammates + any of their ad
  hoc consult children).

## Step 1 — Run the existing reconnect tool

Shell out to the exact same command a human would run from the terminal — do not reimplement the
tree walk, liveness check, or reconnect logic here; `fkit reconnect` (`omnigent/fkit-reconnect.sh`)
already does all of it correctly, including the parts that matter most:

```
fkit reconnect
```

via `sys_os_shell`. Use a generous timeout on the tool call itself (e.g. 120s) — the script waits
up to `FKIT_RECONNECT_TIMEOUT` (default 60s) per disconnected session it finds, on top of the tree
walk, so a short tool-call timeout can cut it off before it's done even though the reconnect itself
is still succeeding server-side.

If the shell reports `fkit: command not found`, stop and tell the human directly — don't try to
improvise an equivalent with raw `curl`/`omnigent` calls; that would be exactly the "invent a new
recovery mechanism" this skill is required not to do. (This should not normally happen: `fkit`
itself is what launched this very session, so it must already be on `PATH`.)

## Step 2 — Read the output, don't over-trust the exit code alone

`fkit reconnect` already implements the incident's key lesson itself — it judges success from
polled server state (`status: idle`, `runner_online: true`), not from the exit code or crash
output of the individual `omnigent run --resume ...` subprocesses it launches in the background (a
non-TTY `OSError` from one of those is expected noise, already accounted for inside the script).
So you can trust the script's own top-level exit code and stdout/stderr summary lines directly —
no need to separately re-verify each session's status yourself.

Typical outcomes you'll see in the output:
- `N session(s) checked, all connected.` — clean no-op, nothing was disconnected.
- One line per reconnected session: `<title> (<conv_id>): reconnected (status=idle)`.
- One line per session still unreachable after the timeout, or a resolution failure (no
  `agent_name` / no local bundle for a node) — printed to stderr, prefixed `ERROR:`.

If the command fails outright (no server running, no `.fkit/team-session`, missing `curl`/`python3`),
the script already prints a clear, specific reason — relay it verbatim rather than guessing.

## Step 3 — Report back plainly

Tell the human, in plain terms:
- What was checked (whole tree) and how many sessions.
- Which teammate(s) (if any) were disconnected and got reconnected — name them, not just a count.
- Any that are still unreachable, with the reason and the log path the script printed
  (`/tmp/reconnect-<title>.log`) so they can dig in if needed.
- If the teammate they specifically asked about is now confirmed reconnected, say so explicitly.

Do not silently retry on your own if something is still unreachable — report it and let the human
decide the next step (e.g. try again, or escalate manually per the incident doc's recovery recipe).

## Hard rules

- **Only on explicit request.** Never invoke this skill proactively, speculatively, or in a loop.
- **Don't reimplement the mechanism.** Always call `fkit reconnect`; never hand-roll the tree walk,
  the `omnigent.closed` label filter, or the `omnigent run --resume` calls yourself — that filter
  in particular is load-bearing (a deliberately closed session must never be "reconnected") and
  living inside the already-verified script, not duplicated here, is what keeps it correct.
- **This is the one narrow exception to "you are NOT a doer."** It doesn't change anything else
  about fkit-team's role — you still don't plan, code, review, or answer project questions
  yourself; you still only route the human to a teammate for everything else.
- **Never commit or push anything.**
