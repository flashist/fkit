---
name: restart
description: >-
  Restart fkit-team ITSELF by killing this session's current runner process and starting a
  BRAND-NEW fkit-team session — the only way to actually pick up edits to config.yaml/skills made
  since this session began (confirmed: `--resume` does NOT re-read the bundle from disk for an
  existing conversation). Kills + creates fresh (NOT a resume, NOT sys_session_close). Use ONLY
  when the human directly asks fkit-team to restart/reload itself so newly vendored skill or
  config changes take effect — never proactively or on a timer. ALWAYS gets an explicit yes/no
  confirmation from the human, as its own turn, before taking any action.
---

# Restart

> **Design history, read before changing this file.** An earlier design tried "kill the runner,
> relaunch with `--resume <same conv_id>`" (Option 1). That was verified — by reading the
> installed `omnigent` v0.4.0 CLI source directly, not by guessing — to NOT deliver the actual
> goal: `chat.py`'s resume branch (`elif resume_conversation_id is not None: session_id =
> resume_conversation_id`) never references the freshly-built bundle bytes; only a genuine
> `sdk.sessions.create(bundle, ...)` (a brand-new session) uploads it, and the daemon-runner launch
> path used on resume takes no bundle parameter at all. A `--resume`-based restart only recovers a
> dead/hung runner — exactly what `fkit reconnect` / the `reconnect-agents` skill already do — it
> does not pick up new skills/config. Full citations:
> `ai-agents/knowledge-base/restart-skill-verification-2026-07-10.md`. The project owner reviewed
> that finding directly and explicitly chose **kill the existing session, start a genuinely new
> one** instead. Do not revert to a resume-based design without redoing that verification — the
> underlying CLI behavior is what it is, not a matter of taste.

**Argument:** `$ARGUMENTS` — usually none.

## When to use this

Only when the human directly asks — e.g. "restart yourself", "reload your skills", "pick up the
new config", "restart fkit-team". Do **not** run this:
- proactively, at the start of a turn, or on any kind of schedule/loop,
- for a teammate that seems disconnected — that's **reconnect-agents**, a different skill for a
  different (already-dead) situation; this skill is specifically for fkit-team's OWN live session,
  and killing a live process is a much bigger action than reconnecting a dead one,
- for any purpose other than fkit-team reloading its own config.yaml/skills off disk.

## What this actually does

Runs `fkit restart-team <this-session's-own-conversation-id>` in the background, detached from
this very process. That script (`omnigent/fkit-team-restart.sh`, the canonical mechanism — do not
reimplement its logic here):
1. Waits briefly so your final reply for this turn has time to reach the human before anything is
   killed.
2. Finds and terminates every process belonging to THIS session (the foreground REPL, the harness
   runner subprocess, and its `claude` child) — identified precisely by this conversation's own id
   appearing in their command line, so it cannot touch a sibling teammate session or shared
   server/runner infrastructure.
3. Launches a genuinely new `omnigent run .fkit/agents/fkit-team ... --server <url>` (no
   `--resume`) — a fresh session that uploads the CURRENT on-disk bundle, which is the part that
   actually delivers "pick up new skills/config".
4. Discovers the new session's conversation id and repoints `.fkit/team-session` at it, so the next
   `fkit` launch (or a reload of the web UI) lands on the new session automatically.

5. Once the new session is confirmed up, archives the OLD fkit-team session (`PATCH
   /v1/sessions/{old_id}` with `{"archived": true}`) so it drops out of the default session list.
   Archiving only flips a visibility flag — it does not delete the session or its history, and it
   does not stop anything (the kill in step 2 already did that); the old session still exists and
   is reachable directly by id, it's just hidden from the normal listing.

**What it deliberately does NOT do:** touch any of your six teammate child sessions
(producer/coder/reviewer/architect/wiki/adversarial-reviewer). They become orphaned — still
existing server-side, their runners left running, just no longer referenced by anything — while the
new fkit-team session's own standard bootstrap creates six brand-new teammates under itself, same
as any first-ever `fkit` launch. This is accepted, not a bug; see the script's own header comment
for why. (Unlike the old fkit-team root session itself, which the script now archives per step 5
above, these six are left unarchived too — only the root gets tidied off the list.)

## Step 1 — Ask for explicit confirmation before doing anything

This skill kills a live session and its history-bearing context; treat it like any other
irreversible-feeling action and get a real answer before acting, not an assumed one.

Before calling any tool, tell the human plainly what is about to happen, then stop and wait:

> Restarting fkit-team will kill THIS live chat process in a few seconds (it will stop responding
> mid-conversation) and orphan your six teammate sessions (producer/coder/reviewer/architect/
> wiki/adversarial-reviewer) — their history isn't deleted, but they're disconnected and won't be
> reused; a fresh set of six teammates gets created under the new session instead. The old
> fkit-team session itself will be archived (hidden from the session list, not deleted) once the
> new one is confirmed up. Proceed? (yes/no)

End your turn immediately after asking — do not call `sys_session_get_info`, `sys_os_shell`, or
anything else in this same turn. Only continue to Step 2 once the human replies with a clear
affirmative ("yes", "go ahead", "confirmed", etc.). Treat anything else — "no", a question, an
ambiguous or unrelated reply, or silence — as **not** a confirmation: do not restart; answer their
question or stand down instead, and don't re-ask on your own initiative unless they bring it up
again. The original request that triggered this skill (e.g. "restart yourself") is not itself the
confirmation — this explicit yes/no exchange is a separate, required gate.

## Step 2 — Confirm this is really your own session, and capture your own true id

Call `sys_session_get_info` with **no `session_id` argument** — this returns metadata about the
CALLING session, i.e. you. Take its `session_id` field as the authoritative conversation id to
restart. (Do not trust `.fkit/team-session` alone here — it could be stale from a prior manual
recovery; passing your own confirmed id to the script overrides that cache.)

## Step 3 — Background the restart script and return immediately

Via `sys_os_shell`, run (as ONE command so `disown` applies to the job it just started):

```
nohup fkit restart-team "<your-session_id-from-step-2>" < /dev/null > /dev/null 2>&1 & disown; echo "restart launched"
```

This must return almost instantly — you are backgrounding a script that will, a few seconds from
now, kill the very process executing this tool call. Do not wait on it, do not poll it, and do not
call any further tools after this in the same turn (there may not be a "later" in this process to
call them in).

## Step 4 — Tell the human what's happening, in the SAME reply, before ending your turn

Say something like: "Restarting now — this chat will stop responding in a few seconds. A fresh
fkit-team session (with today's config/skills) will come up under a new conversation id within
about 30 seconds. The next time you run `fkit` in this project, or reload the web UI, you'll land
on it automatically — `.fkit/team-session` gets repointed to it for you. Your six teammates will be
recreated fresh under the new session. This chat's own session gets archived (removed from your
session list, not deleted) once the new one is confirmed up; the old teammates' sessions are not
deleted or archived, just no longer connected to anything." This must go out in the SAME turn as
Step 3 — once the process is killed, you cannot send a later message from it.

## Hard rules

- **Never skip the confirmation gate (Step 1).** Do not run Step 2 or later off an implicit
  go-ahead buried in the request that triggered this skill — get an explicit yes/no first, in its
  own turn.
- **Only on explicit request.** Never invoke this proactively, speculatively, or in a loop.
- **Never use this on a teammate.** Reconnecting a disconnected teammate is `reconnect-agents`, a
  different mechanism for a different (already-dead) situation. This skill kills a LIVE process —
  only ever this session's own.
- **Never use `sys_session_close`.** That tool tombstones a CHILD session in your own spawn tree;
  it is the wrong tool for ending your own root session and was never the mechanism here.
- **Don't reimplement the kill/relaunch logic.** Always call `fkit restart-team`; never hand-roll
  the pid matching, kill sequencing, or relaunch yourself — the timing (grace window before
  SIGKILL) and the exact command-line matching are both load-bearing and already verified against
  the installed CLI's actual behavior, not just plausible-sounding.
- **Never commit or push anything.**
